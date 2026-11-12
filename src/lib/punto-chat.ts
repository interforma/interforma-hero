/**
 * punto-chat.ts — Árbol conversacional de Punto para la experiencia móvil.
 *
 * Estructura centrada en el MÉTODO como propuesta de valor.
 * "Primero entendemos el problema; después elegimos la herramienta."
 * Los servicios/herramientas son capacidades que se activan según diagnóstico,
 * no un catálogo de productos.
 */

import type { PuntoExpr } from './punto';

export interface ChatNode {
  id: string;
  expr: PuntoExpr;
  messages: string[];
  options?: ChatOption[];
}

export interface ChatOption {
  label: string;
  target: string;
}

export const chatTree: Record<string, ChatNode> = {

  // ── INICIO ──────────────────────────────────────────────
  inicio: {
    id: 'inicio',
    expr: 'saluda',
    messages: [
      'Hola! Soy Punto, de Interforma.',
      'Ayudamos a empresas medianas a transformar la forma en que trabajan.',
      'Primero entendemos el problema; después elegimos la herramienta.',
    ],
    options: [
      { label: 'Cuál es el problema que resuelven', target: 'problema' },
      { label: 'Cómo funciona el Método', target: 'metodo' },
      { label: 'Mira lo que podemos hacer en video', target: 'capsulas' },
      { label: 'Quiero agendar un diagnóstico', target: 'contacto' },
    ],
  },

  // ── PROBLEMA ────────────────────────────────────────────
  problema: {
    id: 'problema',
    expr: 'escucha',
    messages: [
      'La mayoría de los proyectos de transformación digital no fracasan por la tecnología.',
      'Fracasan por lo que ocurre alrededor de ella.',
      '¿Alguno de estos te suena familiar?',
    ],
    options: [
      { label: 'Tecnología que nadie usa', target: 'prob-1' },
      { label: 'Procesos sin mapear', target: 'prob-2' },
      { label: 'Equipos que no adoptan', target: 'prob-3' },
      { label: 'Sin resultados medibles', target: 'prob-4' },
      { label: 'Sistemas que no se integran', target: 'prob-5' },
      { label: 'Cómo lo resuelven', target: 'metodo' },
    ],
  },

  'prob-1': {
    id: 'prob-1',
    expr: 'uy',
    messages: [
      'Tecnología que nadie usa.',
      'Se instalan sistemas costosos que el equipo evita. La herramienta queda; el proceso no cambia.',
      'Nosotros primero mapeamos el proceso real. La herramienta viene después.',
    ],
    options: [
      { label: 'Cómo lo resuelve el Método', target: 'metodo' },
      { label: 'Ver otros problemas', target: 'problema' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'prob-2': {
    id: 'prob-2',
    expr: 'uy',
    messages: [
      'Procesos sin mapear.',
      'Se digitalizan flujos mal definidos y el software amplifica el caos.',
      'Nuestro Método parte por el diagnóstico: entender antes de construir.',
    ],
    options: [
      { label: 'Cómo lo resuelve el Método', target: 'metodo' },
      { label: 'Ver otros problemas', target: 'problema' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'prob-3': {
    id: 'prob-3',
    expr: 'uy',
    messages: [
      'Equipos que no adoptan.',
      'Sin acompañamiento, el equipo vuelve al Excel.',
      'Por eso la etapa 5 del Método es Adopción: capacitación y protocolo de uso.',
    ],
    options: [
      { label: 'Cómo lo resuelve el Método', target: 'metodo' },
      { label: 'Ver otros problemas', target: 'problema' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'prob-4': {
    id: 'prob-4',
    expr: 'piensa',
    messages: [
      'Sin resultados medibles.',
      'Meses de implementación sin métricas claras.',
      'Cada etapa del Método tiene un entregable concreto y una decisión antes de avanzar.',
    ],
    options: [
      { label: 'Cómo lo resuelve el Método', target: 'metodo' },
      { label: 'Ver otros problemas', target: 'problema' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'prob-5': {
    id: 'prob-5',
    expr: 'uy',
    messages: [
      'Sistemas que no se integran.',
      'Cada área trabaja en su silo y la información no fluye.',
      'La etapa 4 del Método conecta todo para que los datos fluyan sin traspasos manuales.',
    ],
    options: [
      { label: 'Cómo lo resuelve el Método', target: 'metodo' },
      { label: 'Ver otros problemas', target: 'problema' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  // ── MÉTODO ──────────────────────────────────────────────
  metodo: {
    id: 'metodo',
    expr: 'atento',
    messages: [
      'El Método Interforma tiene 6 etapas.',
      'El proceso manda. La herramienta sirve.',
      'Cada etapa tiene un entregable concreto y una decisión antes de pasar a la siguiente.',
    ],
    options: [
      { label: '01 Diagnóstico', target: 'met-1' },
      { label: '02 Diseño', target: 'met-2' },
      { label: '03 Implementación', target: 'met-3' },
      { label: '04 Integración', target: 'met-4' },
      { label: '05 Adopción', target: 'met-5' },
      { label: '06 Optimización', target: 'met-6' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'met-1': {
    id: 'met-1',
    expr: 'escucha',
    messages: [
      'Etapa 01 — Diagnóstico.',
      'Interforma hace entrevistas y revisión de procesos y sistemas actuales. Su equipo comparte datos y acceso a las áreas clave.',
      'Entregable: hoja de ruta priorizada.',
      'Decisión: ¿Qué problema atacamos primero?',
    ],
    options: [
      { label: 'Siguiente: Diseño', target: 'met-2' },
      { label: 'Agendar un diagnóstico', target: 'contacto' },
      { label: 'Ver todas las etapas', target: 'metodo' },
    ],
  },

  'met-2': {
    id: 'met-2',
    expr: 'piensa',
    messages: [
      'Etapa 02 — Diseño.',
      'Mapeamos procesos futuros y seleccionamos la tecnología adecuada. Su equipo valida el blueprint con los dueños de proceso.',
      'Entregable: blueprint de procesos y propuesta tecnológica.',
      'Decisión: ¿Aprobamos el blueprint y la herramienta?',
    ],
    options: [
      { label: 'Siguiente: Implementación', target: 'met-3' },
      { label: 'Ver todas las etapas', target: 'metodo' },
    ],
  },

  'met-3': {
    id: 'met-3',
    expr: 'trabaja',
    messages: [
      'Etapa 03 — Implementación.',
      'Construimos y configuramos el sistema. Su equipo prueba con casos reales del negocio.',
      'Entregable: sistema en producción y documentación.',
      'Decisión: ¿El sistema cumple lo acordado?',
    ],
    options: [
      { label: 'Siguiente: Integración', target: 'met-4' },
      { label: 'Ver todas las etapas', target: 'metodo' },
    ],
  },

  'met-4': {
    id: 'met-4',
    expr: 'trabaja',
    messages: [
      'Etapa 04 — Integración.',
      'Conectamos CRM, WhatsApp, formularios y sistemas existentes. Su equipo confirma que los datos son correctos.',
      'Entregable: flujos integrados y datos unificados.',
      'Decisión: ¿La información fluye entre áreas?',
    ],
    options: [
      { label: 'Siguiente: Adopción', target: 'met-5' },
      { label: 'Ver todas las etapas', target: 'metodo' },
    ],
  },

  'met-5': {
    id: 'met-5',
    expr: 'celebra',
    messages: [
      'Etapa 05 — Adopción.',
      'Capacitamos y acompañamos al equipo. Su equipo usa el sistema en su día a día.',
      'Entregable: equipo capacitado y protocolo de uso.',
      'Decisión: ¿El equipo lo usa sin acompañamiento?',
    ],
    options: [
      { label: 'Siguiente: Optimización', target: 'met-6' },
      { label: 'Ver todas las etapas', target: 'metodo' },
    ],
  },

  'met-6': {
    id: 'met-6',
    expr: 'sorpresa',
    messages: [
      'Etapa 06 — Optimización.',
      'Medimos KPIs y ajustamos. Su equipo revisa resultados en una reunión mensual.',
      'Entregable: métricas y ciclo de mejora continua.',
      'La transformación no termina, evoluciona.',
    ],
    options: [
      { label: 'Agendar un diagnóstico', target: 'contacto' },
      { label: 'Ver todas las etapas', target: 'metodo' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  // ── CAPACIDADES ─────────────────────────────────────────
  capacidades: {
    id: 'capacidades',
    expr: 'atento',
    messages: [
      'Combinamos cinco capacidades según la etapa de su empresa:',
      'Estrategia, Procesos, Tecnología, Automatización e Inteligencia Artificial.',
      'No se venden por separado. Se activan según lo que el diagnóstico revele.',
    ],
    options: [
      { label: 'Cómo funciona el Método', target: 'metodo' },
      { label: 'En qué sectores trabajan', target: 'sectores' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  // ── SECTORES ────────────────────────────────────────────
  sectores: {
    id: 'sectores',
    expr: 'atento',
    messages: [
      'Tenemos experiencia donde el proceso importa:',
    ],
    options: [
      { label: 'Salud', target: 'sec-salud' },
      { label: 'Logística y comercio exterior', target: 'sec-logistica' },
      { label: 'Servicios profesionales', target: 'sec-servicios' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'sec-salud': {
    id: 'sec-salud',
    expr: 'trabaja',
    messages: [
      'Salud.',
      'Hospitalización domiciliaria, telemonitoreo y servicios clínicos.',
      'Captación de pacientes, agentes de WhatsApp y CRM adaptados al sector.',
    ],
    options: [
      { label: 'Agendar un diagnóstico', target: 'contacto' },
      { label: 'Ver otros sectores', target: 'sectores' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'sec-logistica': {
    id: 'sec-logistica',
    expr: 'trabaja',
    messages: [
      'Logística y comercio exterior.',
      'Cotizaciones automatizadas, pipeline comercial y reportería para equipos de operación.',
    ],
    options: [
      { label: 'Agendar un diagnóstico', target: 'contacto' },
      { label: 'Ver otros sectores', target: 'sectores' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'sec-servicios': {
    id: 'sec-servicios',
    expr: 'trabaja',
    messages: [
      'Servicios profesionales.',
      'Captación B2B, LinkedIn y seguimiento comercial para estudios y consultoras.',
    ],
    options: [
      { label: 'Agendar un diagnóstico', target: 'contacto' },
      { label: 'Ver otros sectores', target: 'sectores' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  // ── CÁPSULAS ─────────────────────────────────────────────
  capsulas: {
    id: 'capsulas',
    expr: 'celebra',
    messages: [
      'Cápsulas que explican lo que hacemos.',
      'Videos cortos sobre transformación digital, agentes de IA y los problemas reales que resolvemos.',
    ],
    options: [
      { label: 'El Método Interforma', target: 'vid-metodo' },
      { label: 'Qué es un agente de IA', target: 'vid-agente' },
      { label: 'El mito de la transformación digital', target: 'vid-mito' },
      { label: 'Las planillas que frenan tu empresa', target: 'vid-planillas' },
      { label: 'Caso real: First Cargo', target: 'vid-firstcargo' },
      { label: 'Ver todas en Instagram', target: '_instagram' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'vid-metodo': {
    id: 'vid-metodo',
    expr: 'atento',
    messages: [
      'El Método Interforma — así transformamos procesos, no solo tecnología.',
      'La mayoría de los proyectos fracasan porque se enfocan en la tecnología y no en el proceso. Nuestro Método tiene 6 etapas que garantizan adopción real.',
    ],
    options: [
      { label: 'Ver el video', target: '_video:metodo-interforma-transformacion-digital' },
      { label: 'Cómo funciona el Método', target: 'metodo' },
      { label: 'Ver más cápsulas', target: 'capsulas' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'vid-agente': {
    id: 'vid-agente',
    expr: 'piensa',
    messages: [
      'Qué es un agente de IA y cómo se integra a una empresa.',
      'No es un chatbot genérico. Es un sistema que entiende tu negocio, responde como tu equipo y trabaja 24/7.',
    ],
    options: [
      { label: 'Ver el video', target: '_video:que-es-agente-ia-empresas' },
      { label: 'Ver más cápsulas', target: 'capsulas' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'vid-mito': {
    id: 'vid-mito',
    expr: 'sorpresa',
    messages: [
      'Lo que la gente cree sobre transformación digital vs. la realidad.',
      'Hay empresas que creen que es solo comprar software. Otras que es solo para grandes corporaciones. Desmontamos los mitos más comunes.',
    ],
    options: [
      { label: 'Ver el video', target: '_video:mitos-transformacion-digital' },
      { label: 'Ver más cápsulas', target: 'capsulas' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'vid-planillas': {
    id: 'vid-planillas',
    expr: 'uy',
    messages: [
      'Planillas — el problema silencioso.',
      'El 80% de las empresas medianas opera con planillas que nadie entiende, nadie mantiene y todos copian. Es el síntoma de un problema más profundo.',
    ],
    options: [
      { label: 'Ver el video', target: '_video:planillas-problema-empresas' },
      { label: 'Ver más cápsulas', target: 'capsulas' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  'vid-firstcargo': {
    id: 'vid-firstcargo',
    expr: 'celebra',
    messages: [
      'Caso real: First Cargo.',
      'Procesaban cotizaciones manualmente. Implementamos un agente de IA que responde consultas y genera cotizaciones en tiempo real. Respuestas inmediatas, equipo enfocado en lo que importa.',
    ],
    options: [
      { label: 'Ver el video', target: '_video:caso-first-cargo-automatizacion-logistica' },
      { label: 'Ver más cápsulas', target: 'capsulas' },
      { label: 'Agendar un diagnóstico', target: 'contacto' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },

  // ── CONTACTO ────────────────────────────────────────────
  contacto: {
    id: 'contacto',
    expr: 'celebra',
    messages: [
      'Entendamos primero el verdadero problema de su empresa.',
      'Una conversación de 30 minutos puede revelar más que meses de implementación sin diagnóstico previo.',
      'Sin compromiso. Respuesta en menos de 24 horas hábiles.',
    ],
    options: [
      { label: 'Escribir por WhatsApp', target: '_whatsapp' },
      { label: 'Volver al inicio', target: 'inicio' },
    ],
  },
};

export const WHATSAPP_URL = 'https://wa.me/56985408771';
