import { track } from './analytics/track';
import { whatsappUrl } from '../config/site';

type Message = { role: 'user' | 'assistant'; content: string };
type ContextEvent = CustomEvent<{ label?: string; messages: string[]; reset: boolean }>;

export function initPuntoAI(chat: HTMLElement, getMiniSvg: (expression: string) => string) {
  const section = chat.querySelector<HTMLElement>('.punto-ai')!;
  const form = chat.querySelector<HTMLFormElement>('#punto-ai-form')!;
  const input = chat.querySelector<HTMLTextAreaElement>('#punto-ai-input')!;
  const send = chat.querySelector<HTMLButtonElement>('#punto-ai-send')!;
  const status = chat.querySelector<HTMLElement>('#punto-ai-status')!;
  const privacy = chat.querySelector<HTMLElement>('#punto-ai-privacy')!;
  const extras = chat.querySelector<HTMLElement>('.punto-ai__extras')!;
  const hint = chat.querySelector<HTMLElement>('#punto-ai-hint')!;
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
  let revealed = false;

  // Show the AI input bar after intro bubbles appear
  function reveal() {
    if (revealed) return;
    revealed = true;
    section.hidden = false;
  }

  // Show privacy text on first focus
  input.addEventListener('focus', () => { privacy.hidden = false; }, { once: true });

  // Auto-grow textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  function refresh() {
    send.disabled = busy || !input.value.trim();
    input.readOnly = busy;
    const hasConvo = messages.length > 0;
    summaryButton.disabled = busy || !hasConvo;
    extras.hidden = !hasConvo;
    hint.hidden = !hasConvo || summaryPanel.hidden === false;
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
    if (detail.reset) { messages = []; input.value = ''; input.style.height = ''; }
    context = [detail.label ? `Exploró la opción: ${detail.label}.` : '', ...detail.messages].join('\n').slice(0, 1800);
    summaryPanel.hidden = true;
    hint.hidden = true;
    status.textContent = '';
    reveal();
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
    user.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    const timeout = window.setTimeout(() => requestController.abort(), 30000);
    track('punto_ai_request', { mode, turn: messages.length / 2 + 1 });
    try {
      const response = await fetch('/api/punto-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }], context, mode }),
        signal: requestController.signal,
      });
      if (requestVersion !== version) return;
      if (!response.ok) {
        if (response.status === 429) throw new Error('rate_limit');
        if (response.status === 503) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.reason === 'disabled' ? 'disabled' : body.reason === 'no_key' ? 'no_key' : 'unavailable');
        }
        throw new Error('unavailable');
      }
      const reply: unknown = await response.json();
      if (!reply || typeof reply !== 'object' || !('message' in reply) || typeof reply.message !== 'string' ||
        !('summary' in reply) || !(reply.summary === null || typeof reply.summary === 'string')) throw new Error('unavailable');
      if (requestVersion !== version) return;
      pending.remove();
      const group = addReply(reply.message);
      messages.push({ role: 'user', content: text }, { role: 'assistant', content: [reply.message, reply.summary].filter(Boolean).join('\n\n').slice(0, 2400) });
      activeUser = null;
      if (mode === 'chat') { input.value = ''; input.style.height = ''; }
      if (reply.summary) {
        summary.value = reply.summary;
        summaryPanel.hidden = false;
        hint.hidden = true;
        updateShare();
        track('punto_ai_summary_ready', { turn: messages.length / 2 });
      }
      status.textContent = '';
      group.scrollIntoView({ block: 'start', behavior: 'instant' });
      track('punto_ai_response', { mode, turn: messages.length / 2 });
    } catch (error) {
      if (requestVersion !== version) return;
      pending.remove(); user.remove(); activeUser = null;
      const msg = error instanceof Error ? error.message : '';
      status.textContent = msg === 'rate_limit'
        ? 'Hay muchas consultas en este momento. Espera un minuto y vuelve a enviar.'
        : msg === 'disabled' ? 'El asistente IA no está habilitado en este momento. Usa las opciones o habla con el equipo.'
        : msg === 'no_key' ? 'Falta configurar la conexión IA. Usa las opciones o habla con el equipo.'
        : 'No pude responder ahora. Puedes volver a enviarlo, usar las opciones o hablar con el equipo.';
      track('punto_ai_error', { reason: msg || 'unavailable' });
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
  chat.querySelector<HTMLAnchorElement>('#punto-ai-human')!.addEventListener('click', () => track('punto_ai_handoff', { channel: 'whatsapp', has_summary: false }));
  chat.querySelector<HTMLAnchorElement>('#punto-ai-cal')!.addEventListener('click', () => track('punto_ai_handoff', { channel: 'cal', has_summary: false }));
  chat.querySelector<HTMLAnchorElement>('#punto-ai-share-cal')?.addEventListener('click', () => track('punto_ai_handoff', { channel: 'cal', has_summary: true }));
  window.addEventListener('pagehide', cancelRequest);
  window.matchMedia('(max-width: 640px)').addEventListener('change', event => { if (!event.matches) cancelRequest(); });
  refresh();
}
