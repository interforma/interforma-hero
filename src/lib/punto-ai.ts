import { track } from './analytics/track';
import { whatsappUrl } from '../config/site';

type Message = { role: 'user' | 'assistant'; content: string };
type ContextEvent = CustomEvent<{ label?: string; messages: string[]; reset: boolean }>;

export function initPuntoAI(chat: HTMLElement, getMiniSvg: (expression: string) => string) {
  const form = chat.querySelector<HTMLFormElement>('#punto-ai-form')!;
  const input = chat.querySelector<HTMLTextAreaElement>('#punto-ai-input')!;
  const send = chat.querySelector<HTMLButtonElement>('#punto-ai-send')!;
  const status = chat.querySelector<HTMLElement>('#punto-ai-status')!;
  const summaryButton = chat.querySelector<HTMLButtonElement>('#punto-ai-summary-button')!;
  const summaryPanel = chat.querySelector<HTMLElement>('#punto-ai-summary')!;
  const summary = chat.querySelector<HTMLTextAreaElement>('#punto-ai-summary-text')!;
  const share = chat.querySelector<HTMLAnchorElement>('#punto-ai-share')!;
  const cancel = chat.querySelector<HTMLButtonElement>('#punto-ai-cancel')!;
  const zone = chat.querySelector<HTMLElement>('#punto-messages')!;
  const options = chat.querySelector<HTMLElement>('#punto-options')!;
  let messages: Message[] = [];
  let context = '';
  let controller: AbortController | null = null;
  let version = 0;
  let busy = false;
  let activeUser: HTMLElement | null = null;

  function refresh() {
    send.disabled = busy || !input.value.trim();
    input.readOnly = busy;
    summaryButton.disabled = busy || !messages.length;
    summaryButton.hidden = !messages.length;
    cancel.hidden = !busy;
    options.hidden = busy;
    form.setAttribute('aria-busy', String(busy));
  }
  function updateShare() {
    const value = summary.value.trim();
    share.href = whatsappUrl('Hola, conversé con Punto. Quisiera revisar esta orientación con el equipo:\n\n' + value);
    share.setAttribute('aria-disabled', String(!value));
  }
  function cancelRequest() {
    version++;
    controller?.abort();
    controller = null;
    activeUser?.remove();
    activeUser = null;
    zone.querySelector('[data-punto-ai-pending]')?.remove();
    busy = false;
    chat.dispatchEvent(new CustomEvent('punto-ai-finish'));
    refresh();
  }
  chat.addEventListener('punto-context', (event) => {
    const detail = (event as ContextEvent).detail;
    cancelRequest();
    if (detail.reset) { messages = []; input.value = ''; }
    // Navigation is context, not a statement that the visitor has this problem.
    context = [detail.label ? `Exploró la opción: ${detail.label}.` : '', ...detail.messages].join('\n').slice(0, 1800);
    summaryPanel.hidden = true;
    status.textContent = '';
    refresh();
  });

  function addReply(text: string, pending = false) {
    const group = document.createElement('div');
    group.className = 'punto-msg-group punto-ai-reply';
    if (pending) group.dataset.puntoAiPending = '';
    const avatar = document.createElement('div');
    avatar.className = 'punto-msg-group__avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.innerHTML = getMiniSvg(pending ? 'piensa' : 'escucha');
    const bubble = document.createElement('div');
    bubble.className = 'punto-bubble';
    // Never render model or visitor output as HTML.
    bubble.textContent = text;
    group.append(avatar, bubble);
    zone.append(group);
    return group;
  }

  async function ask(mode: 'chat' | 'summary') {
    if (busy || !window.matchMedia('(max-width: 640px)').matches) return;
    const text = mode === 'summary' ? 'Prepara un resumen de lo conversado que pueda revisar y corregir antes de hablar con el equipo.' : input.value.trim();
    if (!text || text.length > 1200) return;
    if (messages.length >= 22) {
      status.textContent = 'Llegamos al límite de esta conversación. Puedes compartir tu resumen, hablar con el equipo o volver al inicio.';
      return;
    }
    const requestVersion = ++version;
    busy = true;
    summaryPanel.hidden = true;
    controller = new AbortController();
    const requestController = controller;
    chat.dispatchEvent(new CustomEvent('punto-ai-start'));
    refresh();
    status.textContent = 'Punto está preparando una respuesta…';
    const user = document.createElement('div');
    user.className = 'punto-bubble punto-bubble--user';
    user.textContent = mode === 'summary' ? 'Preparar mi resumen' : text;
    zone.append(user);
    activeUser = user;
    const pending = addReply('Estoy revisando lo que me cuentas…', true);
    form.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    const timeout = window.setTimeout(() => requestController.abort(), 30000);
    track('punto_ai_request', { mode, turn: messages.length / 2 + 1 });
    try {
      const response = await fetch('/api/punto-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }], context, mode }),
        signal: requestController.signal,
      });
      if (requestVersion !== version) return;
      if (!response.ok) throw new Error(response.status === 429 ? 'rate_limit' : 'unavailable');
      const reply: unknown = await response.json();
      if (!reply || typeof reply !== 'object' || !('message' in reply) || typeof reply.message !== 'string' ||
        !('summary' in reply) || !(reply.summary === null || typeof reply.summary === 'string')) throw new Error('unavailable');
      if (requestVersion !== version) return;
      pending.remove();
      const group = addReply(reply.message);
      messages.push({ role: 'user', content: text }, { role: 'assistant', content: [reply.message, reply.summary].filter(Boolean).join('\n\n').slice(0, 2400) });
      activeUser = null;
      if (mode === 'chat') input.value = '';
      if (reply.summary) {
        summary.value = reply.summary;
        summaryPanel.hidden = false;
        updateShare();
        track('punto_ai_summary_ready', { turn: messages.length / 2 });
      }
      status.textContent = 'Respuesta lista. Puedes seguir escribiendo o explorar las opciones.';
      group.scrollIntoView({ block: 'start', behavior: 'instant' });
      track('punto_ai_response', { mode, turn: messages.length / 2 });
    } catch (error) {
      if (requestVersion !== version) return;
      pending.remove(); user.remove(); activeUser = null;
      const rate = error instanceof Error && error.message === 'rate_limit';
      status.textContent = rate
        ? 'Hay muchas consultas en este momento. Espera un minuto y vuelve a enviar. También puedes hablar con el equipo.'
        : 'No pude responder ahora. Tu texto sigue aquí: puedes volver a enviarlo, usar las opciones o hablar con el equipo.';
      track('punto_ai_error', { reason: rate ? 'rate_limit' : 'unavailable' });
    } finally {
      clearTimeout(timeout);
      if (requestVersion === version) {
        busy = false; controller = null;
        chat.dispatchEvent(new CustomEvent('punto-ai-finish'));
        refresh();
      }
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); void ask('chat'); });
  input.addEventListener('input', refresh);
  summaryButton.addEventListener('click', () => void ask('summary'));
  cancel.addEventListener('click', () => { cancelRequest(); status.textContent = 'Respuesta cancelada. Puedes editar y volver a enviar tu mensaje.'; });
  summary.addEventListener('input', updateShare);
  share.addEventListener('click', event => {
    if (!summary.value.trim()) { event.preventDefault(); return; }
    track('punto_ai_handoff', { has_summary: true });
  });
  chat.querySelector<HTMLAnchorElement>('#punto-ai-human')!.addEventListener('click', () => track('punto_ai_handoff', { has_summary: false }));
  window.addEventListener('pagehide', cancelRequest);
  window.matchMedia('(max-width: 640px)').addEventListener('change', event => { if (!event.matches) cancelRequest(); });
  refresh();
}
