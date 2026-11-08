/**
 * POST /api/punto-chat
 *
 * Endpoint SSR para la conversación con Punto (IA).
 * Usa Claude Haiku para respuestas rápidas y baratas.
 * Solo se activa si PUNTO_AI_ENABLED=true en el servidor.
 */
export const prerender = false;

import type { APIRoute } from 'astro';

const ENABLED = import.meta.env.PUNTO_AI_ENABLED === 'true';
const API_KEY = import.meta.env.AI_GATEWAY_API_KEY ?? '';
const MODEL = import.meta.env.AI_GATEWAY_MODEL ?? 'claude-haiku-4-5-20251001';
const MAX_TURNS = 22;
const MAX_INPUT = 1200;

const SYSTEM_PROMPT = `Eres Punto, el asistente de Interforma. Eres un círculo naranja con ojos expresivos. Tu tono es directo, cálido y sin relleno.

CONTEXTO DE INTERFORMA:
- Interforma es una consultora digital chilena para empresas medianas.
- El diferenciador es el MÉTODO de 6 etapas: (1) Diagnóstico, (2) Estrategia, (3) Diseño, (4) Construcción, (5) Adopción, (6) Optimización.
- Primero se entiende el problema; después se elige la herramienta.
- Los servicios (agentes IA, CRM, web, automatización) son capacidades que se activan según lo que el diagnóstico revele, NO un catálogo de productos.
- Sectores: salud, logística, servicios profesionales.

REGLAS:
- Responde en español chileno natural, sin modismos exagerados.
- Máximo 2-3 oraciones por respuesta. Sé conciso.
- NUNCA inventes precios, plazos ni compromisos concretos.
- Para compromisos, agenda o cotización: deriva a WhatsApp con el equipo.
- NUNCA uses emojis. El diseño de Interforma los prohíbe.
- Si el usuario pregunta algo fuera de tu alcance, dilo honestamente y sugiere hablar con el equipo.
- Cuando el modo es "summary": genera un resumen breve y editable de la conversación que el usuario pueda revisar antes de compartir con el equipo. El resumen debe ser en primera persona del usuario ("Estamos buscando...", "Nuestro problema es...").`;

type Message = { role: 'user' | 'assistant'; content: string };

interface RequestBody {
  messages: Message[];
  context: string;
  mode: 'chat' | 'summary';
}

function buildMessages(body: RequestBody): { role: string; content: string }[] {
  const msgs: { role: string; content: string }[] = [];

  // Add navigation context if available
  if (body.context) {
    msgs.push({
      role: 'user',
      content: `[Contexto de navegación del usuario en el sitio: ${body.context}]`,
    });
    msgs.push({
      role: 'assistant',
      content: 'Entendido, tengo ese contexto presente.',
    });
  }

  // Add conversation history (last turns only)
  const history = body.messages.slice(-MAX_TURNS);
  for (const msg of history) {
    msgs.push({ role: msg.role, content: msg.content });
  }

  return msgs;
}

export const POST: APIRoute = async ({ request }) => {
  if (!ENABLED || !API_KEY) {
    return new Response(JSON.stringify({ error: 'unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'bad_request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate
  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'bad_request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastUserMsg = body.messages[body.messages.length - 1];
  if (!lastUserMsg || lastUserMsg.role !== 'user' || !lastUserMsg.content?.trim()) {
    return new Response(JSON.stringify({ error: 'bad_request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (lastUserMsg.content.length > MAX_INPUT) {
    return new Response(JSON.stringify({ error: 'too_long' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (body.messages.length > MAX_TURNS) {
    return new Response(JSON.stringify({
      message: 'Llegamos al límite de esta conversación. Puedes compartir tu resumen o hablar directamente con el equipo.',
      summary: null,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isSummary = body.mode === 'summary';
  const systemPrompt = isSummary
    ? SYSTEM_PROMPT + '\n\nMODO RESUMEN: El usuario pide un resumen de la conversación. Genera DOS bloques separados por "---RESUMEN---". Antes del separador: un mensaje breve confirmando que preparaste el resumen. Después del separador: el resumen editable en primera persona del usuario (2-4 oraciones, orientado a compartir con el equipo de Interforma).'
    : SYSTEM_PROMPT;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: systemPrompt,
        messages: buildMessages(body),
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limit' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, await response.text());
      return new Response(JSON.stringify({ error: 'unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text: string = data.content?.[0]?.text ?? '';

    let message: string;
    let summary: string | null = null;

    if (isSummary && text.includes('---RESUMEN---')) {
      const parts = text.split('---RESUMEN---');
      message = parts[0].trim();
      summary = parts[1].trim();
    } else {
      message = text.trim();
    }

    return new Response(JSON.stringify({ message, summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Punto AI error:', err);
    return new Response(JSON.stringify({ error: 'unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
