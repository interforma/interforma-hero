/**
 * Escenarios de ejemplo de Interforma Agents para la sección «Velo funcionar» de /agentes.
 * Datos ficticios: empresa, personas y vehículos son inventados. Sin nombres de clientes reales.
 * Un mensaje, tarjeta o cadena con `outcome` solo aparece cuando el visitante elige ese resultado.
 */

export type Tone = 'ok' | 'warn' | 'bad' | 'info';
export type NodeKind = 'cliente' | 'meta' | 'agents' | 'plantilla';

export interface EscMessage {
  step: number;
  /** Último paso en que se muestra (por defecto, hasta el final). */
  until?: number;
  outcome?: string[];
  from: 'cliente' | 'empresa' | 'sistema';
  text: string;
  who?: string;
  time?: string;
  tone?: Tone;
  /** Mensaje de plantilla aprobada por Meta, con sus botones. */
  template?: { label: string; buttons: string[]; pick?: string[] };
  file?: { name: string; meta: string };
  ad?: { brand: string; kicker: string; title: string; body: string; cta: string };
}

export interface EscCard {
  step: number;
  outcome?: string[];
  label: string;
  title: string;
  body?: string;
  badge?: { text: string; tone: Tone };
  fields?: [string, string][];
}

export interface EscFlow {
  step: number;
  outcome?: string[];
  title: string;
  type: string;
  nodes: { label: string; kind: NodeKind }[];
}

export interface EscStep {
  label: string;
  heading: string | Record<string, string>;
  cost: string | Record<string, string>;
  hint?: string;
}

export interface Escenario {
  id: string;
  tab: string;
  title: string;
  intro: string;
  business: { name: string; initials: string };
  steps: EscStep[];
  choice: { prompt: string; step: number; default: string; options: { id: string; label: string }[] };
  messages: EscMessage[];
  cards: EscCard[];
  flows: EscFlow[];
}

const C = (label: string) => ({ label, kind: 'cliente' as const });
const M = (label = 'WhatsApp oficial (Meta)') => ({ label, kind: 'meta' as const });
const A = (label: string) => ({ label, kind: 'agents' as const });
const P = (label: string) => ({ label, kind: 'plantilla' as const });

export const escenarios: Escenario[] = [
  {
    id: 'lead',
    tab: 'Del primer contacto a la venta',
    title: 'Un lead de Instagram, de la primera pregunta al cierre',
    intro: 'Una automotora recibe un lead desde un anuncio. Avanza paso a paso o toca los botones del teléfono.',
    business: { name: 'Automotora Costa', initials: 'AC' },
    steps: [
      { label: 'Anuncio en Instagram', heading: 'El anuncio abre la conversación, sin costo', cost: 'US$0,00', hint: 'Toca «Enviar mensaje» en el anuncio.' },
      { label: 'El agente califica', heading: 'El agente de IA hace las preguntas y ordena los datos', cost: 'US$0,00' },
      { label: 'Pasa a un vendedor', heading: 'Un vendedor toma el lead ya calificado', cost: 'US$0,00' },
      { label: 'Prueba de manejo', heading: 'Un recordatorio el día antes evita la inasistencia', cost: 'US$0,02' },
      { label: 'Cotización', heading: 'La cotización sale del CRM por la misma conversación', cost: 'US$0,02' },
      { label: 'Seguimiento', heading: 'Sin respuesta en 3 días, se insiste una sola vez', cost: 'US$0,04', hint: 'Elige cómo termina en «¿Cómo responde el cliente?».' },
      {
        label: 'Cierre en el CRM',
        heading: { gana: 'Venta ganada: parte la postventa', piensa: 'Venta postergada: vuelve en la fecha acordada', pierde: 'Venta perdida: queda el motivo y la reactivación' },
        cost: 'US$0,04',
      },
    ],
    choice: {
      prompt: '¿Cómo responde el cliente?',
      step: 7,
      default: 'gana',
      options: [
        { id: 'gana', label: 'Compra' },
        { id: 'piensa', label: 'Lo pensará' },
        { id: 'pierde', label: 'Otra marca' },
      ],
    },
    messages: [
      { step: 1, until: 1, from: 'empresa', text: '', ad: { brand: 'automotoracosta', kicker: 'Nuevo Suzuki Swift', title: 'Pruébalo este fin de semana en Viña del Mar', body: 'Agenda tu prueba de manejo y recibe la cotización por WhatsApp.', cta: 'Enviar mensaje' } },
      { step: 2, from: 'sistema', text: 'Lunes 9 de noviembre' },
      { step: 2, from: 'cliente', text: 'Hola, quiero información del Swift', time: '19:42' },
      { step: 2, from: 'empresa', text: '¡Hola! Soy el asistente de Automotora Costa. ¿Lo busca para uso diario o para trabajo? ¿Tiene un auto para dejar en parte de pago?', time: '19:42' },
      { step: 2, from: 'cliente', text: 'Uso diario. Tengo un Kia Morning 2019 y me interesa financiar', time: '19:44' },
      { step: 2, from: 'empresa', text: 'Perfecto. ¿Cuándo le gustaría probarlo? Tenemos horas este sábado en Viña del Mar.', time: '19:44' },
      { step: 2, from: 'cliente', text: 'El sábado en la mañana me sirve', time: '19:45' },
      { step: 3, from: 'empresa', text: 'Gracias, Andrés. Lo atiende Matías, su ejecutivo de Viña del Mar, que le confirma la hora en un momento.', time: '19:45' },
      { step: 3, from: 'empresa', who: 'Matías · Ejecutivo', text: 'Hola Andrés, le reservo el sábado 14 a las 11:00. ¿Le acomoda?', time: '19:51' },
      { step: 3, from: 'cliente', text: 'Sí, perfecto', time: '19:52' },
      { step: 4, from: 'sistema', text: 'Viernes 13 de noviembre' },
      { step: 4, from: 'empresa', text: 'Hola Andrés, le recordamos su prueba de manejo del Suzuki Swift mañana sábado 14 a las 11:00 en Viña del Mar. ¿Confirma su hora?', time: '11:00', template: { label: 'Mensaje aprobado · Utilidad', buttons: ['Confirmo', 'Reagendar'] } },
      { step: 4, from: 'cliente', text: 'Confirmo', time: '11:20' },
      { step: 5, from: 'sistema', text: 'Sábado 14 de noviembre' },
      { step: 5, from: 'empresa', who: 'Matías · Ejecutivo', text: 'Gracias por venir, Andrés. Le dejo la cotización con su Morning en parte de pago y la simulación de crédito.', time: '13:05' },
      { step: 5, from: 'empresa', text: '', file: { name: 'Cotizacion_Swift_GLX.pdf', meta: '2 páginas · generada en el CRM' }, time: '13:05' },
      { step: 6, from: 'sistema', tone: 'warn', text: '3 días sin respuesta' },
      { step: 6, from: 'empresa', text: 'Hola Andrés, ¿pudo revisar la cotización del Suzuki Swift? Si tiene dudas sobre el crédito o la parte de pago, Matías lo ayuda por aquí.', time: 'Mar 10:00', template: { label: 'Mensaje aprobado · Utilidad', buttons: ['Quiero avanzar', 'Tengo dudas'] } },
      { step: 7, outcome: ['gana'], from: 'cliente', text: 'Quiero avanzar. ¿Qué documentos necesito?', time: 'Mar 10:40' },
      { step: 7, outcome: ['gana'], from: 'empresa', who: 'Matías · Ejecutivo', text: 'Excelente, Andrés. Le envío la lista y coordinamos la firma para el jueves.', time: 'Mar 10:46' },
      { step: 7, outcome: ['piensa'], from: 'cliente', text: 'Tengo dudas, lo voy a pensar hasta diciembre.', time: 'Mar 10:40' },
      { step: 7, outcome: ['piensa'], from: 'empresa', who: 'Matías · Ejecutivo', text: 'Por supuesto. Le escribo el 1 de diciembre con la cotización actualizada.', time: 'Mar 10:46' },
      { step: 7, outcome: ['pierde'], from: 'cliente', text: 'Gracias, pero me decidí por otra marca.', time: 'Mar 10:40' },
      { step: 7, outcome: ['pierde'], from: 'empresa', who: 'Matías · Ejecutivo', text: 'Entendemos, Andrés. Gracias por considerarnos; quedamos atentos si necesita algo.', time: 'Mar 10:46' },
    ],
    cards: [
      { step: 1, label: 'Anuncio · clic a WhatsApp', title: 'Campaña del nuevo Swift', body: 'El botón del anuncio abre WhatsApp directo con tu empresa. Mientras dure la ventana gratuita que abre el anuncio, los mensajes de esa conversación no tienen costo.' },
      { step: 2, label: 'Agente de IA · datos del lead', title: 'Andrés Pizarro', badge: { text: 'Lead calificado', tone: 'ok' }, fields: [['Modelo de interés', 'Suzuki Swift'], ['Uso', 'Diario'], ['Parte de pago', 'Kia Morning 2019'], ['Financiamiento', 'Sí'], ['Prueba de manejo', 'Sábado en la mañana'], ['Origen', 'Anuncio de Instagram']] },
      { step: 3, label: 'Tu bandeja de conversaciones', title: 'Asignada a Matías, Viña del Mar', badge: { text: 'Asignada', tone: 'info' }, body: 'El agente pasa la conversación con todo el contexto y queda en pausa. Matías responde sin volver a preguntar.' },
      { step: 3, label: 'Tu CRM', title: 'Oportunidad creada', body: 'Contacto y oportunidad se crean solos, con la conversación y los datos adjuntos. Etapa: calificado.' },
      { step: 4, label: 'Mensaje aprobado por Meta', title: 'Confirmación de hora', badge: { text: 'Utilidad · US$0,02', tone: 'ok' }, body: 'Sale sola 24 horas antes. «Confirmo» deja la hora firme; «Reagendar» devuelve la conversación al agente para ofrecer otra.' },
      { step: 5, label: 'Tu CRM · cotización', title: 'Swift GLX con parte de pago', fields: [['Versión', 'Swift GLX'], ['Precio', 'Según lista vigente'], ['Parte de pago', 'Kia Morning 2019, a tasar'], ['Crédito', 'Simulación adjunta']] },
      { step: 6, label: 'Mensaje aprobado por Meta', title: 'Seguimiento de la cotización', badge: { text: 'Utilidad · US$0,02', tone: 'ok' }, body: 'Si en 3 días no hay respuesta, se envía un solo recordatorio. Si tampoco responde, no se insiste.' },
      { step: 7, outcome: ['gana'], label: 'Tu CRM · oportunidad', title: 'Compra el Swift GLX con crédito', badge: { text: 'Ganada', tone: 'ok' }, fields: [['Siguiente paso', 'Entrega y bienvenida'], ['Se activa', 'Encuesta de postventa tras la primera mantención']] },
      { step: 7, outcome: ['piensa'], label: 'Tu CRM · oportunidad', title: 'Lo decidirá en diciembre', badge: { text: 'Postergada', tone: 'warn' }, fields: [['Siguiente paso', 'Reactivación el 1 de diciembre'], ['Se activa', 'Recordatorio en la fecha acordada']] },
      { step: 7, outcome: ['pierde'], label: 'Tu CRM · oportunidad', title: 'Eligió otra marca', badge: { text: 'Perdida', tone: 'bad' }, fields: [['Siguiente paso', 'Motivo de pérdida registrado'], ['Se activa', 'Reactivación del lead a los 60 días']] },
    ],
    flows: [
      { step: 1, title: 'Primer mensaje', type: 'Entrada desde un anuncio', nodes: [C('Toca el anuncio'), M(), A('Tu bandeja')] },
      { step: 2, title: 'Cada mensaje', type: 'Conversación, sin plantilla', nodes: [C('Cliente escribe'), M(), A('Agente de IA'), A('Lee el historial'), M(), C('Recibe la respuesta')] },
      { step: 3, title: 'Registro', type: 'Automático, sin mensajes', nodes: [A('Agente de IA'), A('CRM: oportunidad'), A('Bandeja: asigna a Matías')] },
      { step: 3, title: 'Respuesta del vendedor', type: 'Escrita por una persona', nodes: [A('Matías en tu bandeja'), M(), C('Cliente')] },
      { step: 4, title: 'Recordatorio', type: 'Mensaje aprobado por Meta', nodes: [A('CRM: prueba agendada'), A('Automatización: 24 h antes'), P('Plantilla de confirmación'), M(), C('Cliente')] },
      { step: 5, title: 'Envío de la cotización', type: 'Dentro de la conversación', nodes: [A('CRM genera el PDF'), A('Tu bandeja'), M(), C('Cliente')] },
      { step: 6, title: 'Seguimiento', type: 'Mensaje aprobado por Meta', nodes: [A('CRM: 3 días sin respuesta'), A('Automatización'), P('Plantilla de seguimiento'), M(), C('Cliente')] },
      { step: 7, title: 'Cierre', type: 'Automático', nodes: [C('Cliente responde'), M(), A('Matías en tu bandeja'), A('CRM: resultado'), A('Activa el paso siguiente')] },
    ],
  },
  {
    id: 'encuesta',
    tab: 'Encuesta de postventa',
    title: 'Una encuesta que avisa al taller cuando algo salió mal',
    intro: 'Al día siguiente de un servicio, el cliente recibe una encuesta por WhatsApp. Toca una respuesta en el teléfono.',
    business: { name: 'Automotora Costa', initials: 'AC' },
    steps: [
      { label: 'Orden cerrada', heading: 'El taller cierra la orden y la encuesta queda agendada', cost: 'US$0,00' },
      { label: 'Encuesta por WhatsApp', heading: 'Un mensaje aprobado llega con los datos del cliente', cost: 'US$0,02', hint: 'Toca una respuesta en el teléfono.' },
      {
        label: 'Respuesta del cliente',
        heading: { buena: 'Una buena nota se cierra sola y pide reseña', regular: 'Una nota baja alerta al taller el mismo día', mala: 'Una nota baja alerta al taller el mismo día', none: 'Sin respuesta: un recordatorio y no se insiste' },
        cost: { buena: 'US$0,02', regular: 'US$0,02', mala: 'US$0,02', none: 'US$0,04' },
      },
      { label: 'Registro en el CRM', heading: 'Todo queda en la ficha de postventa', cost: { buena: 'US$0,02', regular: 'US$0,02', mala: 'US$0,02', none: 'US$0,04' } },
    ],
    choice: {
      prompt: '¿Cómo responde el cliente?',
      step: 3,
      default: 'none',
      options: [
        { id: 'buena', label: 'Muy buena' },
        { id: 'regular', label: 'Regular' },
        { id: 'mala', label: 'Mala' },
        { id: 'none', label: 'No responde' },
      ],
    },
    messages: [
      { step: 1, until: 1, from: 'sistema', text: 'Aún no hay mensajes: el taller está cerrando la orden.' },
      { step: 2, from: 'sistema', text: 'Hoy' },
      { step: 2, from: 'empresa', text: 'Hola Carolina, gracias por traer su Suzuki Swift a nuestro taller de Viña del Mar.\n\n¿Cómo evalúa la atención que recibió?', time: '10:02', template: { label: 'Mensaje aprobado · Utilidad', buttons: ['Muy buena', 'Regular', 'Mala'], pick: ['buena', 'regular', 'mala'] } },
      { step: 3, outcome: ['buena'], from: 'cliente', text: 'Muy buena', time: '10:15' },
      { step: 3, outcome: ['buena'], from: 'empresa', text: '¡Gracias, Carolina! Nos alegra mucho. ¿Nos ayudaría con una reseña de un minuto?', time: '10:15' },
      { step: 3, outcome: ['regular'], from: 'cliente', text: 'Regular', time: '10:15' },
      { step: 3, outcome: ['mala'], from: 'cliente', text: 'Mala', time: '10:15' },
      { step: 3, outcome: ['regular', 'mala'], from: 'empresa', text: 'Lamentamos que no haya sido una buena experiencia. ¿Qué podríamos mejorar?', time: '10:15' },
      { step: 3, outcome: ['regular', 'mala'], from: 'cliente', text: 'Me entregaron el auto dos horas después de lo acordado.', time: '10:17' },
      { step: 3, outcome: ['regular', 'mala'], from: 'empresa', text: 'Gracias por contarnos, Carolina. El jefe de taller la llamará hoy para conversarlo.', time: '10:17' },
      { step: 3, outcome: ['none'], from: 'sistema', tone: 'warn', text: '48 horas sin respuesta' },
      { step: 3, outcome: ['none'], from: 'empresa', text: 'Hola Carolina, ¿nos cuenta cómo le fue con la atención del taller? Su opinión nos ayuda a mejorar.', time: 'Jue 10:02', template: { label: 'Mensaje aprobado · Utilidad', buttons: ['Responder'] } },
      { step: 4, from: 'sistema', tone: 'ok', text: 'Conversación registrada en el CRM' },
    ],
    cards: [
      { step: 1, label: 'Tu CRM · orden de servicio', title: 'OS-2481 · Mantención 10.000 km', badge: { text: 'Cerrada', tone: 'ok' }, fields: [['Cliente', 'Carolina Muñoz'], ['Vehículo', 'Suzuki Swift 2023'], ['Sucursal', 'Viña del Mar'], ['Autorizó WhatsApp', 'Sí, al agendar']] },
      { step: 1, label: 'Qué pasa ahora', title: 'La encuesta queda agendada para mañana a las 10:00', body: 'Solo se envía a clientes que autorizaron recibir mensajes por WhatsApp.' },
      { step: 2, label: 'Mensaje aprobado por Meta', title: 'Encuesta de postventa', badge: { text: 'Utilidad · US$0,02', tone: 'ok' }, fields: [['Nombre del cliente', 'Carolina'], ['Vehículo de la orden', 'Suzuki Swift'], ['Sucursal', 'Viña del Mar']] },
      { step: 3, outcome: ['buena'], label: 'Tu bandeja de conversaciones', title: 'Carolina Muñoz · Muy buena', badge: { text: 'Resuelta por el agente', tone: 'ok' }, body: 'El agente agradeció y envió el enlace de reseña. Nadie del taller tuvo que intervenir.' },
      { step: 3, outcome: ['regular', 'mala'], label: 'Tu bandeja de conversaciones', title: 'Carolina Muñoz · nota baja', badge: { text: 'Nota baja', tone: 'bad' }, body: '«Me entregaron el auto dos horas después de lo acordado.» Asignada al jefe de taller; el agente queda en pausa.' },
      { step: 3, outcome: ['regular', 'mala'], label: 'Tu CRM · tarea', title: 'Llamar a Carolina Muñoz hoy', badge: { text: 'Urgente', tone: 'bad' }, body: 'Vence hoy a las 13:00 · Responsable: jefe de taller.' },
      { step: 3, outcome: ['none'], label: 'Automatización', title: 'Un recordatorio único a las 48 horas', badge: { text: 'Sin respuesta', tone: 'warn' }, body: 'Si tampoco responde, no se insiste: la encuesta se cierra y cuenta en el reporte mensual.' },
      { step: 4, outcome: ['buena'], label: 'Tu CRM · postventa OS-2481', title: 'Encuesta respondida', badge: { text: 'Muy buena', tone: 'ok' }, fields: [['Acción', 'Pedir permiso para usar su testimonio'], ['Próxima oportunidad', 'Mantención 20.000 km']] },
      { step: 4, outcome: ['regular', 'mala'], label: 'Tu CRM · postventa OS-2481', title: 'Seguimiento requerido', badge: { text: 'Nota baja', tone: 'bad' }, fields: [['Comentario', 'Entrega dos horas tarde'], ['Acción', 'Llamada del jefe de taller hoy'], ['Próxima oportunidad', 'Mantención 20.000 km']] },
      { step: 4, outcome: ['none'], label: 'Tu CRM · postventa OS-2481', title: 'Cerrada sin respuesta', badge: { text: 'Sin nota', tone: 'warn' }, fields: [['Acción', 'Cuenta en el reporte mensual'], ['Próxima oportunidad', 'Mantención 20.000 km']] },
    ],
    flows: [
      { step: 1, title: 'Disparador', type: 'Automático, sin mensajes', nodes: [A('CRM: orden cerrada'), A('Automatización: agenda el envío')] },
      { step: 2, title: 'Envío de la encuesta', type: 'Mensaje aprobado por Meta', nodes: [A('Automatización'), P('Plantilla de encuesta'), M(), C('Cliente')] },
      { step: 3, outcome: ['buena'], title: 'Respuesta', type: 'Conversación', nodes: [C('Cliente toca «Muy buena»'), M(), A('Agente de IA: pide reseña'), M(), C('Cliente')] },
      { step: 3, outcome: ['regular', 'mala'], title: 'Respuesta', type: 'Conversación', nodes: [C('Cliente toca una nota baja'), M(), A('Agente de IA: pregunta qué mejorar'), M(), C('Cliente')] },
      { step: 3, outcome: ['regular', 'mala'], title: 'Alerta', type: 'Automático', nodes: [A('CRM: tarea urgente'), A('Bandeja: asigna al jefe de taller')] },
      { step: 3, outcome: ['none'], title: 'Recordatorio', type: 'Mensaje aprobado por Meta', nodes: [A('Automatización: 48 h sin respuesta'), P('Plantilla de recordatorio'), M(), C('Cliente')] },
      { step: 4, title: 'Registro', type: 'Automático', nodes: [A('Automatización'), A('CRM: ficha de postventa')] },
    ],
  },
];
