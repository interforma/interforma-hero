(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var PHONE_ICO = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';
  var ARROW_R = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ARROW_D = '<svg aria-hidden="true" width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="#5C564E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v26M6 22l6 6 6-6"/></svg>';

  /* ---------- Escenarios de voz ---------- */
  var GREET = 'Hola, te comunicaste con Medic Home. Esta llamada puede ser grabada para mejorar tu atención. Cuéntame con tus palabras en qué te ayudamos, o marca 1 para agenda, 2 para pacientes en atención y 9 para hablar con una persona.';
  var VOICE = {
    agenda: { group: 'in', label: 'Reagendar una visita', dir: 'Llamada entrante · 600 Medic Home', caller: 'Número reconocido · Andrea Martínez (hija de paciente)',
      outcome: ['Resuelto por el asistente.', 'Sin espera ni ejecutivo. La llamada, el resumen y la grabación quedan en la ficha del paciente.'],
      steps: [
        { by: 'bot', text: GREET, ev: [['Llamada identificada', 'El número coincide con el contacto de la paciente Rosa Martínez en el CRM.']] },
        { by: 'pac', text: 'Hola, quería cambiar la visita de enfermería de mi mamá del jueves.', ev: [['Intención detectada', 'Reagendar visita · confianza alta.']] },
        { by: 'bot', text: 'Claro. Veo una visita de enfermería para Rosa Martínez el jueves a las 10:00. ¿Te acomoda el viernes a las 10:00 o a las 15:30?', ev: [['Consulta a la agenda clínica', 'Encuentra 2 bloques disponibles con la misma enfermera.']] },
        { by: 'pac', text: 'El viernes en la tarde, por favor.' },
        { by: 'bot', text: 'Listo, quedó el viernes a las 15:30. Te llega la confirmación por WhatsApp. ¿Te ayudo con algo más?', ev: [['Hora reagendada', 'Agenda actualizada y confirmación enviada desde el WhatsApp oficial.'], ['Registro automático en el CRM', 'Llamada, resumen, transcripción y grabación en la ficha.']] }
      ] },
    urgencia: { group: 'in', label: 'Una urgencia', dir: 'Llamada entrante · 600 Medic Home', caller: 'Número no registrado',
      outcome: ['Derivado a una persona con prioridad.', 'El asistente nunca da indicaciones clínicas: detecta la urgencia, orienta al SAMU y entrega la llamada al equipo clínico.'],
      steps: [
        { by: 'bot', text: GREET, ev: [['Llamada identificada', 'Número no registrado: se trata como posible paciente nuevo.']] },
        { by: 'pac', text: 'Mi papá está con mucha dificultad para respirar, no sé qué hacer.', ev: [['Señal de urgencia detectada', 'Se activa el protocolo de urgencia: sin preguntas adicionales.']] },
        { by: 'bot', text: 'Entiendo. Si es una emergencia vital, corta y llama al SAMU 131. Te estoy comunicando ahora mismo con nuestro equipo clínico.', ev: [['Derivación prioritaria', 'Entra primero a la cola del equipo clínico.']] },
        { by: 'sys', text: 'Carla, del equipo clínico, toma la llamada.', ev: [['Contexto entregado', 'Carla ve el resumen en su consola antes de contestar.']] }
      ] },
    humano: { group: 'in', label: 'Pide hablar con una persona', dir: 'Llamada entrante · 600 Medic Home', caller: 'Número reconocido · Carmen Soto (paciente)',
      outcome: ['Derivado a Administración con contexto.', 'La paciente no repite su caso: el ejecutivo lo ve en pantalla al contestar.'],
      steps: [
        { by: 'bot', text: GREET, ev: [['Llamada identificada', 'Paciente con servicio activo de hospitalización domiciliaria.']] },
        { by: 'pac', text: 'Quiero hablar con una persona.', ev: [['Solicitud de atención humana', 'Siempre disponible, con voz o marcando 9.']] },
        { by: 'bot', text: 'Por supuesto. Para que no tengas que repetirlo, ¿me cuentas brevemente el motivo?' },
        { by: 'pac', text: 'Es por un cobro que me llegó de la isapre.', ev: [['Motivo clasificado', 'Facturación y convenios → cola Administración.']] },
        { by: 'sys', text: 'En espera · posición 1. Matías, de Administración, contesta.', ev: [['Ficha y resumen abiertos', 'La consola de Matías muestra el caso y los cobros recientes.']] }
      ] },
    confirmar: { group: 'out', label: 'Confirmación automática', dir: 'Llamada saliente · desde el 600', caller: 'A Jorge Fuentes (paciente) · no respondió el recordatorio por WhatsApp',
      outcome: ['Confirmada sin que un ejecutivo marque.', 'Las llamadas salientes de rutina las hace el asistente; el equipo se concentra en los casos que requieren criterio.'],
      steps: [
        { by: 'sys', text: 'El asistente llama desde el 600 de Medic Home', ev: [['Lista de confirmación del día', 'Pacientes con visita mañana que no respondieron por WhatsApp. Comunicación informativa a pacientes con servicio contratado: uso permitido del prefijo 600.']] },
        { by: 'bot', text: 'Hola, te llamamos de Medic Home. ¿Hablo con Jorge Fuentes o con un familiar?' },
        { by: 'pac', text: 'Sí, soy su hija.' },
        { by: 'bot', text: 'Te llamo para confirmar la visita de kinesiología de mañana a las 11:00. ¿La confirmamos?', ev: [['Datos de la visita', 'Tomados de la agenda clínica en el momento de la llamada.']] },
        { by: 'pac', text: 'Sí, confirmada.' },
        { by: 'bot', text: 'Perfecto, quedó confirmada. Que tengan buena tarde.', ev: [['Agenda y CRM actualizados', 'Confirmación, grabación y resultado de la llamada en la ficha.']] }
      ] },
    devolver: { group: 'out', label: 'Devolver una llamada perdida', dir: 'Llamada saliente · desde el 600', caller: 'A +56 9 [NÚMERO] · colgó en espera a las 13:05',
      outcome: ['Llamada perdida recuperada.', 'Cada llamada abandonada genera una devolución con responsable y plazo. Hoy esas llamadas simplemente se pierden.'],
      steps: [
        { by: 'sys', text: 'Llamada perdida a las 13:05 · colgó tras 2 min en espera', ev: [['Abandono detectado', 'La llamada entra a la lista de devoluciones de la consola.']] },
        { by: 'sys', text: 'Matías devuelve la llamada con un clic desde la consola', ev: [['Sale por el 600', 'El paciente ve el número oficial de Medic Home, no un celular personal.']] },
        { by: 'hum', text: 'Hola, le habla Matías de Medic Home. Vimos que nos llamó hace unos minutos, ¿en qué le podemos ayudar?' },
        { by: 'pac', text: 'Sí, quería saber si mi isapre cubre la hospitalización en casa.', ev: [['Registro automático', 'Llamada saliente, duración, motivo y responsable quedan en la ficha.']] }
      ] }
  };

  /* ---------- Escenarios de WhatsApp ---------- */
  var WA = {
    confirmar: { label: 'Recordatorio de visita',
      outcome: ['Visita confirmada sin llamadas.', 'El asistente envía el recordatorio desde el número oficial, registra la respuesta y avisa al equipo de terreno.'],
      steps: [
        { by: 'sys', text: 'Mensaje automático · 24 h antes de la visita', ev: [['Recordatorio programado', 'Plantilla aprobada por Meta, enviada desde el número oficial de Medic Home.']] },
        { by: 'bot', text: 'Hola Andrea, te recordamos la visita de enfermería para Rosa Martínez mañana viernes a las 15:30. Responde 1 para confirmar o 2 para cambiarla.' },
        { by: 'pac', text: '1', ev: [['Respuesta interpretada', 'Confirmación de asistencia.']] },
        { by: 'bot', text: '¡Gracias! Quedó confirmada. La enfermera te escribirá por aquí cuando vaya en camino.', ev: [['Agenda y CRM actualizados', 'Visita marcada como confirmada; equipo de terreno notificado.']] }
      ] },
    nuevo: { label: 'Paciente nuevo',
      outcome: ['Lead calificado y entregado a ventas.', 'Se crea el contacto en el CRM con los datos clave y una tarea con plazo para el ejecutivo comercial.'],
      steps: [
        { by: 'pac', text: 'Hola, necesito enfermería a domicilio para mi papá en Concón. ¿Cuánto cuesta?', ev: [['Intención detectada', 'Paciente nuevo · solicitud de cotización.']] },
        { by: 'bot', text: 'Hola, gracias por escribirnos. Para cotizar necesito saber qué tipo de cuidado necesita tu papá y si tiene isapre o Fonasa.' },
        { by: 'pac', text: 'Curaciones y control de signos vitales. Tiene Fonasa.' },
        { by: 'bot', text: 'Perfecto. Un ejecutivo te prepara la cotización y coordina una evaluación. ¿Te sirve que te llame hoy antes de las 18:00?', ev: [['Sin precios inventados', 'El asistente no cotiza: reúne los datos y deriva a ventas.']] },
        { by: 'pac', text: 'Sí, perfecto.', ev: [['Contacto creado en el CRM', 'Comuna, tipo de cuidado y previsión, más una tarea para el ejecutivo comercial.']] }
      ] },
    humano: { label: 'Pide hablar con alguien',
      outcome: ['Traspaso a una persona en el mismo chat.', 'El ejecutivo entra con el resumen a la vista desde la consola, no desde su celular personal.'],
      steps: [
        { by: 'pac', text: 'Necesito hablar con alguien, me cobraron dos veces este mes.', ev: [['Solicitud de atención humana', 'Motivo: facturación · cola Administración.']] },
        { by: 'bot', text: 'Te paso con una persona de Administración. Ya le dejé el resumen para que no tengas que repetirlo.', ev: [['Derivación con contexto', 'La conversación aparece en la consola con resumen y ficha.']] },
        { by: 'sys', text: 'Matías, de Administración, se unió a la conversación' },
        { by: 'hum', text: 'Hola Carmen, soy Matías. Veo el cobro duplicado de octubre; lo reviso ahora y te confirmo hoy por aquí.', ev: [['Atención humana registrada', 'Quién atendió, tiempo de respuesta y compromiso quedan en el CRM.']] }
      ] },
    reasignar: { label: 'La ejecutiva no responde',
      outcome: ['Ninguna conversación queda sin respuesta.', 'Con WhatsApp personales, este mensaje habría esperado hasta que Carla volviera de terreno, sin que nadie lo supiera.'],
      steps: [
        { by: 'pac', text: 'Hola, ¿a qué hora llega la enfermera hoy?', ev: [['Asignada a la ejecutiva de cabecera', 'Carla atiende habitualmente a esta paciente.']] },
        { by: 'sys', text: 'Carla no responde en 10 minutos · está en terreno', ev: [['Regla de tiempo de respuesta', 'Pasado el plazo, la conversación se reasigna sola al siguiente ejecutivo disponible.']] },
        { by: 'sys', text: 'Reasignada a Matías' },
        { by: 'hum', text: 'Hola Andrea, soy Matías. La enfermera va en camino y llega cerca de las 15:30.', ev: [['Tiempos registrados', 'Tiempo de respuesta y reasignación quedan en la ficha y en las métricas del equipo.']] }
      ] }
  };

  var WHO_V = { bot: 'Asistente Medic Home', pac: 'Paciente / familiar', sys: 'Sistema', hum: 'Matías · ejecutivo' };
  var WHO_W = { bot: 'Asistente Medic Home', pac: 'Paciente / familiar', sys: '', hum: 'Matías · ejecutivo' };

  var state = {
    voice: { sc: 'agenda', step: 1 },
    wa: { sc: 'confirmar', step: 2 },
    con: { sel: 'u', taken: {}, closed: {}, calling: {}, sent: {}, muted: false },
    crm: { tab: 'all' }
  };

  function chatHtml(steps, n, who) {
    return steps.slice(0, n).map(function (x) {
      var w = who[x.by];
      return '<div class="msg msg--' + x.by + '"><div class="msg__in">' + (w ? '<span class="msg__who">' + esc(w) + '</span>' : '') +
        '<div class="bub bub--' + x.by + '">' + esc(x.text) + '</div></div></div>';
    }).join('');
  }
  function eventsHtml(steps, n) {
    var out = [], i = 0;
    steps.slice(0, n).forEach(function (x) { (x.ev || []).forEach(function (e) { i++; out.push('<li><span class="num">' + i + '</span><div><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div></li>'); }); });
    return out.join('');
  }
  function outcomeHtml(o, link, linkText) {
    return '<div class="outcome"><span class="eyebrow eyebrow--num">Resultado</span><span class="outcome__t">' + esc(o[0]) + '</span><span class="small muted">' + esc(o[1]) + '</span><a class="small" style="font-weight:700" href="' + link + '">' + esc(linkText) + '</a></div>';
  }
  function pill(act, key, label, on) {
    return '<button type="button" class="pill" data-act="' + act + '" data-key="' + key + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(label) + '</button>';
  }
  function badge(cls, text) { return '<span class="tag ' + cls + '">' + esc(text) + '</span>'; }

  /* ---------- Vistas ---------- */
  var VIEWS = {};

  VIEWS.inicio = function () {
    var tiles = [
      ['#llamadas', '01', 'Llamadas al 600', 'El asistente contesta, resuelve lo simple y hace las llamadas salientes de rutina.'],
      ['#whatsapp', '02', 'WhatsApp oficial', 'Un número para todo el equipo, en lugar de un WhatsApp personal por ejecutivo.'],
      ['#consola', '03', 'Consola del ejecutivo', 'Llamadas, WhatsApp y devoluciones en una sola bandeja, con el contexto listo.'],
      ['#crm', '04', 'Ficha del paciente', 'Cada interacción, entrante o saliente, registrada sola en el CRM.'],
      ['#arquitectura', '05', 'Arquitectura', 'Las piezas de la solución y lo que reemplaza de la operación actual.'],
      ['#flujos', '06', 'Flujos del proceso', 'Entrante y saliente paso a paso, comparados con lo que pasa hoy.'],
      ['#costos', '07', 'Costo y uso', 'Cómo cambia el modelo de costo y por qué el equipo sí lo usaría.'],
      ['#inversion', '08', 'Inversión y plazos', 'Costos operacionales, implementación, mantención y etapas, con calculadora ajustable.']
    ];
    return '<section class="hero"><span class="eyebrow">Propuesta para Medic Home · noviembre 2026</span>' +
      '<h1>Un centro de contacto que atiende, llama y registra solo.</h1>' +
      '<p class="lead">Maqueta funcional del reemplazo de CloudTalk: el número 600 entrante y saliente, un WhatsApp oficial, atención humana cuando corresponde y un CRM propio. Recorra las secciones y pruebe los casos.</p>' +
      '<div class="btns"><a class="btn btn--primary" href="#llamadas" style="text-decoration:none;color:#281F18">Comenzar el recorrido</a><a class="btn btn--ghost-dark" href="#costos" style="text-decoration:none">Ver costo y uso</a></div>' +
      '<svg class="hero__iso" aria-hidden="true" width="180" height="180" viewBox="0 0 90 90"><rect x="0" y="60" width="30" height="30" rx="3" fill="#5C564E"/><rect x="30" y="30" width="30" height="30" rx="9" fill="#5C564E"/><circle cx="75" cy="15" r="15" fill="#EE6E43"/></svg></section>' +
      '<div class="tiles">' + tiles.map(function (t) { return '<a class="tile" href="' + t[0] + '"><span class="eyebrow eyebrow--num">' + t[1] + '</span><h2>' + esc(t[2]) + '</h2><span class="small muted">' + esc(t[3]) + '</span></a>'; }).join('') + '</div>';
  };

  VIEWS.llamadas = function () {
    var st = state.voice, s = VOICE[st.sc], n = Math.min(st.step, s.steps.length), done = n >= s.steps.length;
    function group(g) { return Object.keys(VOICE).filter(function (k) { return VOICE[k].group === g; }).map(function (k) { return pill('voice-sc', k, VOICE[k].label, k === st.sc); }).join(''); }
    return '<div class="intro"><span class="eyebrow eyebrow--num">01 · Canal voz · entrante y saliente</span><h1>El 600 atiende y también llama.</h1>' +
      '<p class="lead">El asistente contesta las llamadas entrantes y hace las salientes de rutina, como confirmaciones y devoluciones de llamadas perdidas. Lo que requiere criterio pasa a una persona con el contexto listo. Elija un caso y avance paso a paso.</p></div>' +
      '<div style="display:flex;flex-direction:column;gap:10px"><div class="pillrow"><span class="eyebrow">Entrantes</span>' + group('in') + '</div><div class="pillrow"><span class="eyebrow">Salientes</span>' + group('out') + '</div></div>' +
      '<div class="row"><section class="card grow" aria-label="Llamada en curso"><div class="callhead"><div class="callhead__who"><span class="ico">' + PHONE_ICO + '</span><div style="display:flex;flex-direction:column"><b>' + esc(s.dir) + '</b><span class="small muted">' + esc(s.caller) + '</span></div></div><span class="step">PASO ' + n + ' DE ' + s.steps.length + '</span></div>' +
      '<div class="chat" aria-live="polite">' + chatHtml(s.steps, n, WHO_V) + '</div>' +
      '<div class="btns">' + (done ? '' : '<button type="button" class="btn btn--primary" data-act="voice-next">Siguiente paso</button>') + '<button type="button" class="btn" data-act="voice-reset">Reiniciar caso</button></div></section>' +
      '<aside class="card side" aria-label="Lo que hace el sistema"><span class="eyebrow">Lo que pasa detrás</span><ol class="events">' + eventsHtml(s.steps, n) + '</ol>' + (done ? outcomeHtml(s.outcome, '#crm', 'Ver cómo queda en el CRM') : '') + '</aside></div>';
  };

  VIEWS.whatsapp = function () {
    var st = state.wa, s = WA[st.sc], n = Math.min(st.step, s.steps.length), done = n >= s.steps.length;
    var human = s.steps.slice(0, n).some(function (x) { return x.by === 'hum'; });
    return '<div class="intro"><span class="eyebrow eyebrow--num">02 · Canal WhatsApp · número oficial</span><h1>Un WhatsApp de Medic Home, no uno por ejecutivo.</h1>' +
      '<p class="lead">Hoy cada ejecutivo atiende desde su teléfono personal y el sistema queda de lado. La propuesta es un solo número oficial, atendido por el asistente y el equipo, más cómodo que el WhatsApp personal.</p></div>' +
      '<div class="vs"><section class="card"><div class="between"><span class="eyebrow">Hoy</span>' + badge('b-crit', 'Crítico') + '</div><h2>Cada ejecutivo con su WhatsApp personal.</h2><ul>' +
      '<li>Las conversaciones quedan en celulares personales, fuera del sistema.</li><li>Si el ejecutivo está en terreno o de vacaciones, el paciente queda esperando.</li><li>No hay registro en el CRM ni forma de medir tiempos de respuesta.</li><li>Si alguien deja la empresa, se lleva los contactos y el historial.</li></ul></section>' +
      '<section class="card"><div class="between"><span class="eyebrow eyebrow--num">Propuesta</span>' + badge('b-ok', 'OK') + '</div><h2>Un número oficial para todo el equipo.</h2><ul>' +
      '<li>Cada conversación se asigna a un ejecutivo y se reasigna sola si no responde a tiempo.</li><li>El ejecutivo responde desde la consola, en el computador o en la app del celular.</li><li>Todo queda en la ficha del paciente, con responsable y tiempos.</li><li>Los contactos y el historial son de Medic Home.</li></ul></section></div>' +
      '<div class="pillrow"><span class="eyebrow" style="width:auto;margin-right:4px">Elija un caso</span>' + Object.keys(WA).map(function (k) { return pill('wa-sc', k, WA[k].label, k === st.sc); }).join('') + '</div>' +
      '<div class="row"><section class="phone" aria-label="Conversación de WhatsApp"><div class="phone__head"><span class="avatar">mh</span><div style="display:flex;flex-direction:column"><b>Medic Home · número oficial</b><span class="xs" style="color:#BEB8AE"><span class="dot"></span>' + (human ? 'Te atiende Matías' : 'Asistente en línea 24/7') + '</span></div></div>' +
      '<div class="chat" aria-live="polite">' + chatHtml(s.steps, n, WHO_W) + '</div>' +
      '<div class="phone__foot btns">' + (done ? '' : '<button type="button" class="btn btn--primary" data-act="wa-next">Siguiente mensaje</button>') + '<button type="button" class="btn" data-act="wa-reset">Reiniciar</button><span class="step">PASO ' + n + ' DE ' + s.steps.length + '</span></div></section>' +
      '<aside class="card grow" aria-label="Lo que hace el sistema"><span class="eyebrow">Lo que pasa detrás</span><ol class="events">' + eventsHtml(s.steps, n) + '</ol>' + (done ? outcomeHtml(s.outcome, '#consola', 'Ver la consola del ejecutivo') : '') + '</aside></div>';
  };

  /* ---------- Consola ---------- */
  var ITEMS = [
    { id: 'u', kind: 'call', name: 'Juan Pérez', channel: 'Llamada entrante', queue: 'Equipo clínico', motivo: 'Dificultad respiratoria de su padre', wait: '0:12', base: 'Urgente', summary: 'Reporta que su padre tiene mucha dificultad para respirar. El asistente indicó llamar al SAMU 131 si es una emergencia vital y derivó con prioridad. Número no registrado como paciente.', lines: [['Llamante', 'Mi papá está con mucha dificultad para respirar.'], ['Asistente', 'Si es una emergencia vital, llama al SAMU 131. Te comunico con el equipo clínico.']], fields: [['Paciente', 'No registrado'], ['Teléfono', '+56 9 [NÚMERO]'], ['Historial', 'Sin interacciones previas'], ['Prioridad', 'Urgente']] },
    { id: 'b', kind: 'callback', name: '+56 9 [NÚMERO]', channel: 'Llamada perdida', queue: 'Devoluciones', motivo: 'Colgó tras 2 min en espera', wait: '13:05', base: 'Por devolver', summary: 'Llamó a las 13:05 a la cola Comercial y colgó tras 2 minutos en espera. No alcanzó a dejar motivo. Número no registrado.', lines: [['Sistema', 'Llamada abandonada en la cola Comercial. Se creó la devolución.']], fields: [['Contacto', 'No registrado'], ['Cola', 'Comercial'], ['Plazo de devolución', 'Antes de 30 min'], ['Intentos', '0 de 3']] },
    { id: 'c', kind: 'wa', name: 'Carmen Soto', channel: 'WhatsApp', queue: 'Administración', motivo: 'Cobro duplicado en octubre', wait: '1:05', base: 'En cola', summary: 'Paciente con hospitalización domiciliaria activa. Indica que le cobraron dos veces en octubre. Pidió hablar con una persona.', lines: [['Paciente', 'Necesito hablar con alguien, me cobraron dos veces este mes.'], ['Asistente', 'Te paso con Administración. Ya dejé el resumen.']], fields: [['Paciente', 'Carmen Soto'], ['Servicio activo', 'Hospitalización domiciliaria'], ['Previsión', '[ISAPRE]'], ['Último contacto', 'Hace 5 días · WhatsApp']] },
    { id: 'l', kind: 'call', name: 'Luis Herrera', channel: 'Llamada entrante', queue: 'Comercial', motivo: 'Cobertura de isapre para hospitalización', wait: '2:30', base: 'En cola', summary: 'Familiar consulta si su isapre cubre la hospitalización domiciliaria tras un alta. El asistente tomó comuna y previsión; requiere ejecutivo comercial.', lines: [['Llamante', 'Quería saber si mi isapre cubre la hospitalización en casa.'], ['Asistente', 'Te comunico con un ejecutivo que revisa tu cobertura.']], fields: [['Contacto', 'Luis Herrera (familiar)'], ['Comuna', 'Viña del Mar'], ['Previsión', '[ISAPRE]'], ['Estado', 'Lead nuevo']] },
    { id: 'p', kind: 'wa', name: 'Pedro Rojas', channel: 'WhatsApp', queue: 'Comercial', motivo: 'Cotización de enfermería en Concón', wait: '0:40', base: 'En cola', summary: 'Necesita curaciones y control de signos vitales para su padre en Concón. Previsión Fonasa. Aceptó que lo llamen hoy antes de las 18:00.', lines: [['Contacto', 'Necesito enfermería a domicilio para mi papá en Concón.'], ['Asistente', 'Un ejecutivo te prepara la cotización. ¿Te llamamos hoy?']], fields: [['Contacto', 'Pedro Rojas'], ['Comuna', 'Concón'], ['Previsión', 'Fonasa'], ['Tarea', 'Llamar hoy antes de 18:00']] },
    { id: 'r', kind: 'wa', name: 'Andrea Martínez', channel: 'WhatsApp', queue: 'Agenda', motivo: 'Reagendó visita de enfermería', wait: '—', base: 'Resuelta por el asistente', summary: 'Movió la visita de enfermería de Rosa Martínez del jueves 10:00 al viernes 15:30 y confirmó por WhatsApp. No requiere acción.', lines: [['Contacto', 'Quería cambiar la visita del jueves.'], ['Asistente', 'Listo, quedó el viernes a las 15:30.']], fields: [['Paciente', 'Rosa Martínez'], ['Contacto', 'Andrea Martínez (hija)'], ['Servicio activo', 'Enfermería domiciliaria'], ['Próxima visita', 'Viernes 15:30']] }
  ];
  var BADGE = { 'Urgente': 'b-crit', 'En cola': 'b-warn', 'Por devolver': 'b-warn', 'Contigo': 'b-mine', 'Resuelta por el asistente': 'b-ok', 'Cerrada y registrada': 'b-closed' };
  function status(it) { var c = state.con; return c.closed[it.id] ? 'Cerrada y registrada' : c.taken[it.id] ? 'Contigo' : it.base; }

  VIEWS.consola = function () {
    var c = state.con, cur = ITEMS.filter(function (x) { return x.id === c.sel; })[0], s = status(cur);
    var isTaken = !!c.taken[cur.id] && !c.closed[cur.id], resolved = cur.base === 'Resuelta por el asistente', voice = cur.kind !== 'wa' || !!c.calling[cur.id];
    function count(pred) { return ITEMS.filter(function (x) { return pred(status(x)); }).length; }
    var takeLabel = { call: 'Contestar llamada', callback: 'Devolver llamada desde el 600', wa: 'Tomar conversación' }[cur.kind];
    var lines = cur.lines.concat((c.sent[cur.id] || []).map(function (t) { return ['Carla', t]; }));
    var action = '';
    if (!isTaken && !c.closed[cur.id] && !resolved) action = '<button type="button" class="btn btn--primary" style="align-self:flex-start" data-act="con-take">' + takeLabel + '</button>';
    if (isTaken && voice) action = '<div class="softphone"><span class="eyebrow">' + (cur.kind === 'call' ? 'Llamada entrante · 00:42' : 'Llamada saliente desde el 600 · 00:08') + '</span>' +
      '<button type="button" class="btn btn--ghost-dark" data-act="con-mute">' + (c.muted ? 'Activar micrófono' : 'Silenciar') + '</button><button type="button" class="btn btn--ghost-dark">Transferir</button><button type="button" class="btn btn--primary" data-act="con-close">Colgar y registrar</button></div>';
    if (isTaken && !voice) action = '<div style="display:flex;flex-direction:column;gap:8px"><label for="reply" class="small" style="font-weight:600">Responder desde el WhatsApp oficial</label><div class="reply"><input id="reply" type="text" placeholder="Escribe tu respuesta…" autocomplete="off"><button type="button" class="btn btn--primary" data-act="con-send">Enviar</button><button type="button" class="btn" data-act="con-close">Cerrar y registrar</button></div></div>';
    var note = (c.closed[cur.id] || resolved) ? '<div class="note">' + (c.closed[cur.id] ? 'Atención cerrada: resumen, duración y responsable quedaron en la ficha.' : 'Resuelta por el asistente: no requiere acción.') + ' <a href="#crm">Ver en el CRM</a></div>' : '';
    return '<div class="between" style="align-items:flex-end;gap:16px"><div class="intro"><span class="eyebrow eyebrow--num">03 · Consola omnicanal</span><h1 style="font-size:clamp(28px,3.4vw,36px)">Hola, Carla. Llamadas y WhatsApp en un solo lugar.</h1><span class="small muted">También en la app del celular, con el número oficial: sin WhatsApp personales.</span></div>' +
      '<div class="kpis"><div class="kpi"><span>En cola</span><b>' + count(function (x) { return x === 'En cola' || x === 'Urgente'; }) + '</b></div><div class="kpi"><span>Por devolver</span><b>' + count(function (x) { return x === 'Por devolver'; }) + '</b></div><div class="kpi"><span>Contigo</span><b>' + count(function (x) { return x === 'Contigo'; }) + '</b></div></div></div>' +
      '<div class="row" style="gap:20px"><section class="card inbox" aria-label="Bandeja"><span class="eyebrow">Bandeja</span>' +
      ITEMS.map(function (it) { var st2 = status(it); return '<button type="button" class="it" data-act="con-sel" data-key="' + it.id + '" aria-current="' + (it.id === c.sel) + '"><span class="it__top"><span>' + esc(it.name) + '</span><span>' + esc(it.wait) + '</span></span><span class="it__mot">' + esc(it.motivo) + '</span><span class="tags">' + badge('b-sky', it.channel) + badge(BADGE[st2], st2) + '</span></button>'; }).join('') +
      '</section><section class="card detail" aria-label="Conversación seleccionada"><div class="between" style="align-items:flex-start"><div style="display:flex;flex-direction:column;gap:4px"><span class="eyebrow">' + esc(cur.channel + ' · ' + cur.queue) + '</span><h2>' + esc(cur.name) + '</h2></div>' + badge(BADGE[s], s) + '</div>' +
      '<div class="summary"><span class="eyebrow eyebrow--num">Resumen del asistente</span><span style="font-size:15px;line-height:1.55">' + esc(cur.summary) + '</span></div>' +
      '<div class="lines"><span class="eyebrow">Conversación</span>' + lines.map(function (l) { return '<div class="line"><b>' + esc(l[0]) + '</b><span>' + esc(l[1]) + '</span></div>'; }).join('') + '</div>' + action + note + '</section>' +
      '<aside class="card patient" aria-label="Ficha del paciente"><span class="eyebrow">Ficha en el CRM</span><dl class="fields">' + cur.fields.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      (cur.kind === 'wa' && !c.calling[cur.id] && !c.closed[cur.id] ? '<button type="button" class="btn" data-act="con-call">Llamar desde el 600</button>' : '') + '<a class="small" style="font-weight:700" href="#crm">Abrir ficha completa</a></aside></div>' +
      '<section class="card" aria-label="Cómo es la consola"><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow eyebrow--num">Cómo es la consola</span><h2>Una página web y una app, conectadas al servidor de Medic Home.</h2>' +
      '<p class="small muted" style="margin:0;max-width:820px">Es una plataforma de atención de código abierto (por ejemplo, Chatwoot) instalada en el servidor de Medic Home. Cada ejecutivo entra con su usuario; el WhatsApp y el 600 siguen siendo de la empresa.</p></div>' +
      '<div class="howit"><div class="howit__card"><span class="eyebrow">En el computador</span><h3>Se abre en el navegador</h3><ul><li>Sin instalar nada: usuario y clave.</li><li>Bandeja con llamadas y WhatsApp asignados.</li><li>Llamadas con audífonos con micrófono, desde el mismo navegador.</li></ul></div>' +
      '<div class="howit__card"><span class="eyebrow">En el celular</span><h3>App para iPhone y Android</h3><ul><li>Se conecta al servidor de Medic Home.</li><li>Avisa cuando llega o se asigna una conversación.</li><li>Responde desde el número oficial, no desde el personal.</li></ul></div>' +
      '<div class="howit__card"><span class="eyebrow">Para la jefatura</span><h3>Supervisión en vivo</h3><ul><li>Colas, tiempos de espera y conversaciones abiertas.</li><li>Reasigna casos con un clic.</li><li>Reportes por canal y por ejecutivo.</li></ul></div>' +
      '<div class="minip" aria-hidden="true"><div class="minip__top">Medic Home · Bandeja</div><div class="minip__row"><b>Carmen Soto</b><span>Cobro duplicado · WhatsApp</span><i class="tag b-mine">Contigo</i></div><div class="minip__row"><b>Pedro Rojas</b><span>Cotización · WhatsApp</span><i class="tag b-warn">En cola</i></div><div class="minip__row"><b>+56 9 [NÚMERO]</b><span>Llamada perdida</span><i class="tag b-warn">Devolver</i></div></div></div></section>';
  };

  /* ---------- CRM ---------- */
  var ENTRIES = [
    { cat: 'wa', dir: 'Saliente', channel: 'WhatsApp oficial', title: 'Recordatorio de visita confirmado', when: '12/11 · 15:42', detail: 'Recordatorio 24 h antes de la visita de enfermería. Andrea respondió «1» para confirmar.', by: 'Asistente IA', extra: 'Ver conversación' },
    { cat: 'agenda', dir: '', channel: 'Agenda', title: 'Visita movida: jue 10:00 → vie 15:30', when: '12/11 · 15:31', detail: 'Cambio hecho por el asistente durante la llamada, con la misma enfermera.', by: 'Asistente IA', extra: '' },
    { cat: 'call', dir: 'Entrante', channel: 'Llamada 600', title: 'Reagendó visita de enfermería', when: '12/11 · 15:30', detail: 'Andrea pidió mover la visita del jueves. Se ofrecieron 2 bloques; eligió el viernes a las 15:30. Duración 1:40, sin espera.', by: 'Asistente IA', extra: 'Grabación · Transcripción' },
    { cat: 'call', dir: 'Saliente', channel: 'Llamada 600', title: 'Seguimiento semanal', when: '11/11 · 10:00', detail: 'Carla llamó desde la consola para revisar cómo va la paciente y coordinar insumos. Sale con el número oficial.', by: 'Carla · equipo clínico', extra: 'Grabación · Transcripción' },
    { cat: 'wa', dir: 'Entrante', channel: 'WhatsApp oficial', title: 'Consulta por hora de llegada', when: '08/11 · 11:05', detail: 'Carla estaba en terreno; a los 10 minutos la conversación se reasignó a Matías, que respondió.', by: 'Matías · ejecutivo', extra: 'Reasignada automáticamente' },
    { cat: 'call', dir: 'Entrante', channel: 'Llamada 600', title: 'Consulta de cobertura', when: '02/11 · 09:20', detail: 'Consulta por cobertura de la previsión. Derivada a Administración con el motivo ya clasificado.', by: 'Matías · Administración', extra: 'Grabación · Transcripción' }
  ];
  var TABS = [['all', 'Todo'], ['in', 'Entrantes'], ['out', 'Salientes'], ['wa', 'WhatsApp'], ['agenda', 'Agenda']];
  function match(tab, e) { return tab === 'all' || (tab === 'in' ? e.dir === 'Entrante' : tab === 'out' ? e.dir === 'Saliente' : e.cat === tab); }

  VIEWS.crm = function () {
    var tab = state.crm.tab;
    var fields = [['Contacto principal', 'Andrea Martínez (hija)'], ['Teléfono', '+56 9 [NÚMERO]'], ['Comuna', 'Viña del Mar'], ['Servicio activo', 'Enfermería domiciliaria'], ['Previsión', '[ISAPRE]'], ['Ejecutiva de cabecera', 'Carla · equipo clínico'], ['Próxima visita', 'Viernes 15:30 · confirmada']];
    return '<div class="between" style="align-items:flex-end;gap:16px"><div class="intro"><span class="eyebrow eyebrow--num">04 · CRM autoalojado · Twenty</span><h1>Rosa Martínez</h1><p class="lead">Cada llamada entrante o saliente, cada mensaje y cada cambio de agenda queda registrado solo, con quién atendió y qué se resolvió.</p></div>' + badge('b-sky', 'Datos en servidor dedicado de Medic Home') + '</div>' +
      '<div class="row"><aside class="card" style="flex:1 1 300px" aria-label="Datos del paciente"><span class="eyebrow">Datos del paciente</span><dl class="fields">' + fields.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<div class="consent"><span class="eyebrow eyebrow--num">Consentimiento</span><span class="small">Tratamiento de datos y grabación aceptados el 02/11/2026 por WhatsApp.</span></div></aside>' +
      '<section class="card grow" aria-label="Historial de interacciones"><div class="between"><h2>Historial de interacciones</h2><div class="pillrow" role="group" aria-label="Filtrar historial">' + TABS.map(function (t) { return pill('crm-tab', t[0], t[1], t[0] === tab); }).join('') + '</div></div>' +
      '<ol class="timeline">' + ENTRIES.filter(function (e) { return match(tab, e); }).map(function (e) {
        return '<li><div class="between"><span class="tags" style="align-items:center">' + badge('b-sky', e.channel) + (e.dir ? badge(e.dir === 'Saliente' ? 'b-out' : 'b-in', e.dir) : '') + '<b style="font-size:15px">' + esc(e.title) + '</b></span><span class="xs muted" style="font-family:var(--mono)">' + esc(e.when) + '</span></div>' +
          '<span class="small muted">' + esc(e.detail) + '</span><span class="xs" style="display:flex;gap:14px;flex-wrap:wrap"><b>Atendió: ' + esc(e.by) + '</b>' + (e.extra ? '<b style="color:#9A3D1A">' + esc(e.extra) + '</b>' : '') + '</span></li>';
      }).join('') + '</ol></section></div>';
  };

  VIEWS.arquitectura = function () {
    function down(n) { var a = []; for (var i = 0; i < n; i++) a.push(ARROW_D); return '<div class="down"><div class="down__arrows">' + a.join('') + '</div><div class="spacer"></div></div>'; }
    return '<div class="intro"><span class="eyebrow eyebrow--num">05 · Arquitectura</span><h1>Una sola plataforma para el 600, el WhatsApp y el CRM.</h1><p class="lead">Cuatro capas que trabajan juntas. A la derecha, qué reemplaza cada una de la operación actual.</p>' +
      '<div class="stack" aria-label="Herramientas de la solución"><span class="eyebrow">Herramientas</span>' + [['Asterisk', 'central telefónica del 600'], ['API de WhatsApp', 'número oficial (Meta)'], ['n8n + LLM', 'orquestador y asistente IA'], ['Chatwoot', 'consola de ejecutivos'], ['Twenty', 'CRM'], ['Servidor dedicado', 'Medic Home']].map(function (t) { return '<span class="stack__item"><b>' + t[0] + '</b>' + t[1] + '</span>'; }).join('') + '</div></div>' +
      '<div class="layer"><div class="layer__main"><span class="eyebrow">Canales</span><div class="layer__cards">' +
      '<div class="box box--light"><span><b>Número 600 · Asterisk</b>SIP trunk chileno con el 600 portado, a una central telefónica de código abierto</span></div>' +
      '<div class="box box--light"><span><b>WhatsApp oficial</b>API de Meta · un número para todo el equipo</span></div>' +
      '<div class="box box--light"><span><b>Web y formularios</b>Chat del sitio y solicitud de llamada</span></div></div></div>' +
      '<div class="repl-col"><span class="eyebrow eyebrow--num">Qué reemplaza</span><div class="box box--repl" style="flex:1"><span><b>Telefonía de CloudTalk</b>y los WhatsApp personales de cada ejecutivo.</span></div></div></div>' +
      down(3) +
      '<div class="layer"><div class="layer__main"><span class="eyebrow">Inteligencia</span><div class="box box--dark" style="min-height:110px"><span><b>Orquestador IA · n8n + LLM</b>Voz IA y bot de WhatsApp con el mismo cerebro · reglas de urgencia · derivación a colas · llamadas salientes y devoluciones</span></div></div>' +
      '<div class="repl-col"><span class="eyebrow" style="visibility:hidden">.</span><div class="box box--repl" style="flex:1"><span><b>Menú de grabaciones fijo</b>de CloudTalk y el complemento de IA de voz que se cobra aparte.</span></div></div></div>' +
      down(3) +
      '<div class="layer"><div class="layer__main"><span class="eyebrow">Atención y datos</span><div class="layer__cards">' +
      '<div class="box box--sky"><span><b>Consola omnicanal · Chatwoot</b>Código abierto, en el servidor de Medic Home · web y app iOS/Android · colas, softphone, devoluciones</span></div>' +
      '<div class="box box--sky"><span><b>CRM Twenty autoalojado</b>Ficha del paciente, historial completo, tareas y métricas</span></div>' +
      '<div class="box box--sky"><span><b>Agenda clínica de Medic Home</b>Integración por API para consultar y mover visitas</span></div></div></div>' +
      '<div class="repl-col"><span class="eyebrow" style="visibility:hidden">.</span><div class="box box--repl" style="flex:1"><span><b>Integración CloudTalk–Zoho</b>que hoy no registra bien, y las licencias de Zoho si deciden cambiar de CRM.</span></div></div></div>' +
      '<div class="layer"><div class="layer__main"><span class="eyebrow">Base</span><div class="box box--base" style="min-height:72px"><span><b>Infraestructura dedicada</b>Servidor de Medic Home administrado por Interforma · cifrado, respaldos y control de accesos · Ley 21.719</span></div></div><div></div></div>' +
      '<section class="card law" aria-label="Datos de pacientes y Ley 21.719"><div class="between"><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow eyebrow--num">Datos de pacientes · Ley 21.719</span><h2>Qué significa «infraestructura dedicada».</h2></div><span class="tag b-warn">Vigente desde el 1/12/2026</span></div>' +
      '<p class="small muted" style="margin:0;max-width:820px">La Ley 21.719 trata los datos de salud como datos sensibles: exige seguridad, contratos con quienes los manejan y aviso si hay una filtración, con multas que pueden llegar a 20.000 UTM. Esta es la forma en que la solución responde a eso.</p>' +
      '<div class="law__grid"><div><h3>Quién es quién</h3><ul>' +
      '<li><b>Medic Home es el responsable</b> de los datos: decide para qué se usan.</li>' +
      '<li><b>Interforma es el encargado</b>: los trata solo por instrucción de Medic Home, con un contrato de encargo y confidencialidad.</li>' +
      '<li><b>Meta, el operador telefónico y el proveedor de IA</b> participan con contratos de tratamiento de datos, sin usar la información para fines propios.</li></ul></div>' +
      '<div><h3>Qué hace la plataforma</h3><ul>' +
      '<li><b>Servidor propio de Medic Home:</b> sus datos no se mezclan con los de otros clientes.</li>' +
      '<li><b>Cifrado</b> en tránsito y en reposo, y <b>respaldos diarios</b>.</li>' +
      '<li><b>Accesos por rol</b> y registro de quién vio o cambió cada ficha.</li>' +
      '<li><b>Aviso y consentimiento</b> en el primer contacto, incluida la grabación de llamadas.</li>' +
      '<li><b>Mínimo necesario:</b> el asistente agenda y deriva; no pide ni registra diagnósticos.</li>' +
      '<li><b>Derechos del paciente</b> (acceso, rectificación, eliminación) atendidos desde el CRM, y protocolo de aviso ante incidentes.</li></ul></div></div></section>';
  };

  VIEWS.flujos = function () {
    function flow(steps) {
      return '<div class="flow">' + steps.map(function (s, i) {
        return (i ? '<div class="flow__arrow">' + ARROW_R + '</div>' : '') + '<div class="box flow__step ' + s[2] + '"><span><b>' + esc(s[0]) + '</b>' + esc(s[1]) + '</span></div>';
      }).join('') + '</div>';
    }
    return '<div class="intro"><span class="eyebrow eyebrow--num">06 · Flujos del proceso</span><h1>Entrante y saliente: qué cambia respecto de hoy.</h1></div>' +
      '<section class="card"><span class="eyebrow">Entrante · 600 y WhatsApp</span>' +
      flow([['Llega el contacto', 'Llamada al 600 o mensaje al WhatsApp oficial', 'box--light'], ['Identifica', 'Reconoce el número y abre la ficha en el CRM', 'box--light'], ['Entiende el motivo', 'Con voz natural o con el teclado, como hoy', 'box--dark'], ['Resuelve o deriva', 'Agenda, confirma, informa · urgencia al instante', 'box--dark'], ['Registro automático', 'Resumen, grabación y resultado en la ficha', 'box--sky']]) +
      '<div class="branch"><span class="branch__label">SI DERIVA →</span><div class="box box--repl" style="justify-content:center;text-align:center"><span><b>Ejecutivo con contexto</b>Contesta desde la consola, sin que el paciente repita · luego se registra igual</span></div></div>' +
      '<div class="cmp"><div class="cmp__now"><b>Hoy con CloudTalk</b><br>Menú de grabaciones fijo: casi todo pasa por la cola y el paciente espera. El registro en Zoho falla y el WhatsApp va por celulares personales.</div><div class="cmp__new"><b>Con la propuesta</b><br>Lo simple se resuelve sin espera, la urgencia salta la fila y cada contacto queda en el CRM solo. Menos carga por ejecutivo.</div></div></section>' +
      '<section class="card"><span class="eyebrow">Saliente · confirmaciones, devoluciones y seguimiento</span>' +
      flow([['Disparador', 'Visita mañana, llamada perdida o seguimiento', 'box--light'], ['Lista del día', 'Solo pacientes con servicio contratado', 'box--light'], ['WhatsApp primero', 'Plantilla aprobada por Meta, desde el número oficial', 'box--dark'], ['Sin respuesta: llamada', 'Asistente o ejecutivo, siempre desde el 600', 'box--dark'], ['Resultado registrado', 'Agenda y CRM al día, con responsable', 'box--sky']]) +
      '<div class="cmp"><div class="cmp__now"><b>Hoy con CloudTalk</b><br>Cada ejecutivo marca a mano, muchas veces desde su celular. Las llamadas perdidas no se devuelven de forma sistemática.</div><div class="cmp__new"><b>Con la propuesta</b><br>Las salientes de rutina las hace el asistente, las perdidas se devuelven con plazo y siempre se ve el 600 de Medic Home.</div></div></section>';
  };

  VIEWS.costos = function () {
    function table(head, rows) {
      return '<div class="tablebox"><table><thead><tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + r[1] + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
    var crit = badge('b-crit', 'Crítico') + ' ', warn = badge('b-warn', 'Mejorable') + ' ';
    return '<div class="intro"><span class="eyebrow eyebrow--num">07 · Costo y uso frente a CloudTalk</span><h1>De pagar por cada ejecutivo a pagar por lo que se usa.</h1>' +
      '<p class="lead">Los dos dolores de Medic Home con CloudTalk son el costo y el poco uso que le da el equipo. La propuesta ataca ambos: cambia el modelo de cobro y hace que usar el sistema sea más fácil que esquivarlo.</p></div>' +
      '<section class="card"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">01 · Costo</span><h2>Qué se paga hoy y qué se pagaría.</h2></div>' +
      table(['Aspecto', 'Hoy · CloudTalk', 'Propuesta · Interforma'], [
        ['Modelo de cobro', 'Licencia mensual por usuario: US$27, 39 o 69 según plan (precio de lista, referencial), más complementos.', 'Mensualidad de servicio Interforma más costos por uso: minutos de telefonía, conversaciones de WhatsApp e IA.'],
        ['IA de voz', 'Complemento aparte, cobrado por minuto.', 'Incluida en la plataforma. Costo del modelo de IA por uso, a validar con volúmenes reales.'],
        ['WhatsApp', 'Se paga la integración, pero en la práctica el equipo usa su WhatsApp personal.', 'Número oficial por la API de Meta. Se paga lo que cobra Meta por conversación, sin licencias por agente.'],
        ['CRM', 'Zoho, con licencias propias y una integración que no registra bien.', 'Twenty autoalojado: sin licencia por usuario. Se paga el servidor y su administración.'],
        ['Crecer el equipo', 'Cada ejecutivo nuevo suma una licencia de CloudTalk y una de Zoho.', 'Sumar ejecutivos no suma licencias de plataforma.'],
        ['Costo oculto', 'Horas de ejecutivo en tareas repetitivas: confirmar visitas, contestar lo mismo, registrar a mano.', 'El asistente absorbe lo repetitivo, entrante y saliente. El equipo atiende lo que requiere criterio.']
      ]) +
      '<div class="outcome" style="flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px"><span class="small">Los montos mensuales, la implementación y los plazos están en la calculadora, con tarifas públicas y volúmenes ajustables.</span><a class="btn btn--primary" style="text-decoration:none;color:#281F18" href="#inversion">Ver inversión y plazos</a></div></section>' +
      '<section class="card"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">02 · Uso</span><h2>Por qué el equipo sí lo usaría.</h2></div>' +
      table(['Aspecto', 'Hoy', 'Propuesta'], [
        ['WhatsApp', crit + 'Cada ejecutivo en su celular personal: el sistema queda de lado.', 'Número oficial atendido desde la consola o la app móvil, igual de cómodo que el personal.'],
        ['Registro', crit + 'Depende de una integración con Zoho que falla.', 'Automático: el ejecutivo no registra nada a mano.'],
        ['Llamadas perdidas', warn + 'Se pierden si nadie las revisa.', 'Lista de devoluciones con responsable y plazo.'],
        ['Atención', warn + 'El paciente navega un menú de grabaciones y repite su caso al ejecutivo.', 'Habla con sus palabras; el ejecutivo recibe el resumen antes de contestar.'],
        ['Medición', warn + 'Sin datos del WhatsApp ni del cierre de cada caso.', 'Métricas por canal, cola y ejecutivo: tiempos de respuesta, resueltos por el asistente y devoluciones.']
      ]) + '</section>' +
      '<div class="lists"><section style="background:#FBE6DC;border:1px solid #F7CDBB"><span class="eyebrow eyebrow--num">03 · Lo que hay que cuidar</span><ul>' +
      '<li>Calidad y continuidad de la voz: operador SIP con acuerdo de servicio y respaldo.</li><li>Soporte: Interforma pasa a ser responsable de la operación, con tiempos de respuesta acordados.</li><li>Cambio en el equipo: capacitación y acompañamiento las primeras semanas.</li><li>Datos de salud: consentimiento, accesos y respaldos conforme a la Ley 21.719.</li></ul></section>' +
      '<section style="background:#F2F1EE;border:1px solid #D0CCC4"><span class="eyebrow">04 · Para cuantificar el ahorro</span><ul>' +
      '<li>Plan y número de licencias de CloudTalk, con su última factura.</li><li>Minutos mensuales entrantes y salientes.</li><li>Conversaciones de WhatsApp al mes, aunque hoy sean en celulares personales.</li><li>Licencias de Zoho y si piensan mantenerlo.</li></ul></section></div>';
  };

  /* ---------- Inversión, costos operacionales y plazos ---------- */
  var RATES = {
    sipIn: 0.01, sipOut: 0.07, num600: 30, voiceAi: 0.12, waUtil: 0.024, waMkt: 0.107, waService: 0.024, waFree: 1000, llmMsg: 0.003, server: 40
  };
  state.calc = { agents: 6, plan: 39, otros: 50000, minIn: 6000, pctAi: 50, minOut: 2000, waSvc: 4000, waUtil: 1500, waMkt: 0, usd: 970, rate: 30000, maintH: 14 };
  var STAGES = [
    ['E0', 'Diagnóstico y diseño', 'Levantamiento de flujos de CloudTalk, volúmenes, Zoho y agenda clínica; diseño de colas y reglas.', 1, 1, 20],
    ['E1', 'Infraestructura y CRM', 'Servidor dedicado, seguridad y respaldos; Twenty autoalojado y migración de contactos desde Zoho.', 2, 3, 40],
    ['E2', 'WhatsApp oficial', 'Verificación en Meta, plantillas, asistente, consola omnicanal y traspaso a una persona.', 3, 5, 64],
    ['E3', 'Voz y número 600', 'SIP trunk, portabilidad del 600, réplica de los flujos actuales, softphone y asistente de voz.', 5, 8, 80],
    ['E4', 'Salientes y métricas', 'Confirmaciones automáticas, devoluciones de llamadas perdidas y panel de métricas.', 8, 9, 36],
    ['E5', 'Marcha blanca y cambio', 'Capacitación, operación en paralelo con CloudTalk y apagado de la plataforma anterior.', 10, 11, 24]
  ];
  var WEEKS = 11;
  function clp(n) { return '$' + Math.round(n).toLocaleString('es-CL'); }
  function usd(n) { return 'US$' + (Math.round(n * 10) / 10).toLocaleString('es-CL'); }

  function rate(n) { return 'US$' + n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 3 }); }
  function int(n) { return Math.round(n).toLocaleString('es-CL'); }
  var CALC_DEFAULTS = JSON.parse(JSON.stringify(state.calc));

  function calcOut() {
    var k = state.calc, r = RATES;
    var aiMin = k.minIn * k.pctAi / 100;
    var waSvcPaid = Math.max(0, k.waSvc - r.waFree);
    var lines = [
      ['Número 600 portado', 'Arriendo mensual del número (a cotizar)', r.num600],
      ['Minutos entrantes', int(k.minIn) + ' min × ' + rate(r.sipIn), k.minIn * r.sipIn],
      ['Minutos salientes', int(k.minOut) + ' min × ' + rate(r.sipOut) + ' (a móviles)', k.minOut * r.sipOut],
      ['Asistente de voz IA', int(aiMin) + ' min × ' + rate(r.voiceAi) + ' (' + k.pctAi + ' % de los entrantes)', aiMin * r.voiceAi],
      ['WhatsApp · respuestas', int(waSvcPaid) + ' pagadas × ' + rate(r.waService) + ' (las primeras 1.000 son gratis)', waSvcPaid * r.waService],
      ['WhatsApp · recordatorios', int(k.waUtil) + ' plantillas × ' + rate(r.waUtil), k.waUtil * r.waUtil],
      ['WhatsApp · marketing', int(k.waMkt) + ' plantillas × ' + rate(r.waMkt), k.waMkt * r.waMkt],
      ['IA del bot de WhatsApp', int(k.waSvc) + ' respuestas × ' + rate(r.llmMsg), k.waSvc * r.llmMsg],
      ['Servidor dedicado', '4 vCPU · 8 GB · respaldos diarios', r.server],
      ['Licencias de software', 'Twenty, n8n y consola: código abierto, sin licencia por usuario', 0]
    ];
    var platUsd = lines.reduce(function (a, l) { return a + l[2]; }, 0);
    var platClp = platUsd * k.usd;
    var maint = k.maintH * k.rate;
    var newMonthly = platClp + maint;
    var ctLic = k.agents * k.plan * k.usd;
    var nowMonthly = ctLic + k.otros;
    var diff = nowMonthly - newMonthly;
    var implH = STAGES.reduce(function (a, s) { return a + s[5]; }, 0);
    var impl = implH * k.rate;
    var payback = diff > 0 ? Math.ceil(impl / diff) : null;
    function row(label, val, strong) { return '<div class="sum__row' + (strong ? ' sum__row--total' : '') + '"><span>' + esc(label) + '</span><b>' + clp(val) + '</b></div>'; }
    return '<div class="split">' +
      '<section class="sum sum--now" aria-label="Hoy con CloudTalk"><span class="eyebrow">A · Hoy · CloudTalk</span><h3>Lo que pagan hoy al mes</h3>' +
      row('Licencias: ' + k.agents + ' ejecutivos × ' + usd(k.plan), ctLic) +
      row('Otros: minutos, complementos, Zoho', k.otros) +
      row('Total mensual hoy', nowMonthly, true) +
      '<p class="xs muted">Dato del cliente: sale de su factura de CloudTalk y de Zoho.</p></section>' +
      '<section class="sum sum--new" aria-label="Propuesta Interforma"><span class="eyebrow eyebrow--num">B · Propuesta · Interforma</span><h3>Lo que pagarían al mes</h3>' +
      row('Plataformas (Meta, telefonía, IA, servidor)', platClp) +
      row('Servicio Interforma: ' + k.maintH + ' h × ' + clp(k.rate), maint) +
      row('Total mensual propuesta', newMonthly, true) +
      '<p class="xs muted">Las plataformas se pagan a terceros según uso; el servicio es la mensualidad de Interforma.</p></section>' +
      '<section class="sum sum--diff" aria-label="Diferencia"><span class="eyebrow">A − B · Diferencia mensual</span><h3>' + (diff >= 0 ? 'Ahorro estimado' : 'Costo adicional estimado') + '</h3>' +
      '<b class="sum__big">' + clp(Math.abs(diff)) + '</b><p class="xs">' + (payback ? 'La implementación (' + clp(impl) + ') se recupera en ~' + payback + ' meses.' : 'Con estos datos no hay ahorro directo. El valor está en el uso del sistema, las llamadas recuperadas y el tiempo liberado del equipo.') + '</p></section></div>' +
      '<details class="detail-box"><summary>Ver el detalle de plataformas (' + usd(platUsd) + ' / ' + clp(platClp) + ' al mes)</summary>' +
      '<div class="tablebox"><table><thead><tr><th>Plataforma</th><th>Cálculo</th><th style="text-align:right">US$/mes</th><th style="text-align:right">CLP/mes</th></tr></thead><tbody>' +
      lines.map(function (l) { return '<tr><td>' + esc(l[0]) + '</td><td class="muted">' + esc(l[1]) + '</td><td style="text-align:right;font-variant-numeric:tabular-nums">' + usd(l[2]) + '</td><td style="text-align:right;font-variant-numeric:tabular-nums">' + clp(l[2] * k.usd) + '</td></tr>'; }).join('') +
      '<tr><td>Total plataformas</td><td></td><td style="text-align:right;font-weight:700">' + usd(platUsd) + '</td><td style="text-align:right;font-weight:700">' + clp(platClp) + '</td></tr></tbody></table></div></details>' +
      '<div class="money"><div><span class="xs muted">Implementación Interforma · pago único</span><b>' + clp(impl) + '</b><span class="xs muted">' + implH + ' h × ' + clp(k.rate) + ' · neto + IVA 19 %</span></div>' +
      '<div><span class="xs muted">Servicio mensual Interforma</span><b>' + clp(maint) + '</b><span class="xs muted">' + k.maintH + ' h/mes: soporte, monitoreo, ajustes del asistente, respaldos</span></div>' +
      '<div><span class="xs muted">Plazo total estimado</span><b>' + WEEKS + ' semanas</b><span class="xs muted">La portabilidad del 600 depende del operador</span></div></div>';
  }

  VIEWS.inversion = function () {
    var k = state.calc;
    function num(key, label, step, suffix, hint) {
      return '<label class="field"><span>' + esc(label) + '</span><span class="field__in"><input type="number" min="0" step="' + step + '" value="' + k[key] + '" data-calc="' + key + '">' + (suffix ? '<em>' + esc(suffix) + '</em>' : '') + '</span>' + (hint ? '<small>' + esc(hint) + '</small>' : '') + '</label>';
    }
    var gantt = '<div class="gantt" role="table" aria-label="Plazos por etapa"><div class="gantt__row gantt__head" role="row"><span role="columnheader">Etapa</span>' +
      Array.apply(null, Array(WEEKS)).map(function (_, i) { return '<span role="columnheader">S' + (i + 1) + '</span>'; }).join('') + '</div>' +
      STAGES.map(function (s) {
        return '<div class="gantt__row" role="row"><span role="rowheader"><b>' + s[0] + ' · ' + esc(s[1]) + '</b><em>' + s[5] + ' h</em></span><span class="gantt__bar" style="grid-column:' + (s[3] + 1) + ' / ' + (s[4] + 2) + '" aria-label="Semanas ' + s[3] + ' a ' + s[4] + '"></span></div>';
      }).join('') + '</div>';
    return '<div class="intro"><span class="eyebrow eyebrow--num">08 · Inversión y plazos</span><h1>Lo que cuesta operar, implementar y en cuánto tiempo.</h1>' +
      '<p class="lead">Compare lo que Medic Home paga hoy por CloudTalk con lo que pagaría con la propuesta. Los valores vienen cargados con un ejemplo; reemplácelos por los datos reales y todo se recalcula.</p></div>' +
      '<section class="howto" aria-label="Cómo usar la calculadora"><span class="eyebrow eyebrow--num">Cómo se usa</span><ol>' +
      '<li><b>A · Hoy (CloudTalk):</b> cuántos ejecutivos tienen licencia, qué plan y cuánto más pagan al mes (minutos, complementos, Zoho). Sale de su factura.</li>' +
      '<li><b>Volúmenes:</b> cuántos minutos y mensajes manejan al mes. Si no los tienen, deje el ejemplo y valídelo en el diagnóstico.</li>' +
      '<li><b>B · Interforma:</b> el valor hora y las horas mensuales de soporte que se cotizan.</li></ol>' +
      '<p class="small">Ejemplo cargado: 6 ejecutivos en plan Essential, $50.000 en otros costos, 6.000 minutos entrantes (la mitad los atiende el asistente), 2.000 salientes, 4.000 respuestas y 1.500 recordatorios por WhatsApp.</p>' +
      '<button type="button" class="btn" data-act="calc-reset">Volver al ejemplo</button></section>' +
      '<div class="groups">' +
      '<section class="card group group--now"><div class="between"><span class="eyebrow">A · Hoy · CloudTalk</span><span class="tag b-crit">Dato del cliente</span></div>' +
      num('agents', 'Ejecutivos con licencia', 1, 'usuarios', 'Personas que usan CloudTalk hoy.') +
      '<label class="field"><span>Plan contratado</span><span class="field__in"><select data-calc="plan">' + [[27, 'Lite · US$27 por usuario'], [39, 'Essential · US$39 por usuario'], [69, 'Expert · US$69 por usuario']].map(function (p) { return '<option value="' + p[0] + '"' + (k.plan === p[0] ? ' selected' : '') + '>' + p[1] + '</option>'; }).join('') + '</select></span><small>Precio de lista mensual, referencial.</small></label>' +
      num('otros', 'Otros costos mensuales', 10000, 'CLP', 'Minutos salientes, complementos de IA, licencias de Zoho.') +
      '</section>' +
      '<section class="card group"><div class="between"><span class="eyebrow">Volúmenes de atención al mes</span><span class="tag b-warn">A validar</span></div>' +
      num('minIn', 'Minutos de llamadas entrantes', 100, 'min', 'Total de minutos que reciben por el 600.') +
      num('pctAi', 'Parte que resuelve el asistente', 5, '%', 'Llamadas simples: agenda, confirmaciones, información.') +
      num('minOut', 'Minutos de llamadas salientes', 100, 'min', 'Confirmaciones, devoluciones y seguimiento.') +
      num('waSvc', 'Respuestas por WhatsApp', 100, 'msj', 'Mensajes que el sistema contesta a pacientes.') +
      num('waUtil', 'Recordatorios por WhatsApp', 100, 'msj', 'Avisos de visita y confirmaciones enviados.') +
      num('waMkt', 'Mensajes de marketing', 100, 'msj', 'Campañas. Déjelo en 0 si no aplica.') +
      '</section>' +
      '<section class="card group group--new"><div class="between"><span class="eyebrow eyebrow--num">B · Interforma</span><span class="tag b-out">Lo define Interforma</span></div>' +
      num('rate', 'Valor hora', 1000, 'CLP', 'Tarifa neta usada para implementación y servicio.') +
      num('maintH', 'Horas de servicio al mes', 1, 'h', 'Soporte, monitoreo, ajustes del asistente, respaldos.') +
      num('usd', 'Tipo de cambio', 1, 'CLP por US$', 'Para convertir las tarifas en dólares.') +
      '</section></div>' +
      '<section class="card" aria-live="polite"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">Resultado</span><h2>Hoy contra propuesta, al mes.</h2></div><div id="calc-out" style="display:flex;flex-direction:column;gap:16px">' + calcOut() + '</div></section>' +
      '<section class="card"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">Plazos</span><h2>Etapas de implementación.</h2></div>' + gantt +
      '<div class="tablebox"><table><thead><tr><th>Etapa</th><th>Qué incluye</th><th>Semanas</th></tr></thead><tbody>' +
      STAGES.map(function (s) { return '<tr><td>' + s[0] + ' · ' + esc(s[1]) + '</td><td>' + esc(s[2]) + '</td><td>' + (s[3] === s[4] ? 'S' + s[3] : 'S' + s[3] + '–S' + s[4]) + ' · ' + s[5] + ' h</td></tr>'; }).join('') + '</tbody></table></div></section>' +
      '<div class="lists"><section style="background:#F2F1EE;border:1px solid #D0CCC4"><span class="eyebrow">Tarifas usadas</span><ul>' +
      '<li>WhatsApp en Chile (Meta): marketing ~US$0,107 y utilidad o servicio ~US$0,024 por mensaje. Desde el 1/10/2026 también se cobran las respuestas de servicio, con 1.000 gratis al mes.</li>' +
      '<li>Asistente de voz IA: ~US$0,12/min (rango de mercado US$0,05–0,31 según modelo y voz).</li>' +
      '<li>Telefonía: entrante ~US$0,01/min y saliente a móviles ~US$0,07/min; un operador chileno con numeración 600 puede ser menor y se cotiza.</li>' +
      '<li>Servidor dedicado ~US$40/mes. Twenty, n8n y la consola son código abierto autoalojado: sin licencias por usuario. Si se usa el canal de voz nativo de la consola (hoy de pago por agente), se suma ese costo; la alternativa es el softphone de la central telefónica, también de código abierto.</li></ul></section>' +
      '<section style="background:#FBE6DC;border:1px solid #F7CDBB"><span class="eyebrow eyebrow--num">Supuestos y exclusiones</span><ul>' +
      '<li>Valores referenciales, netos, a validar con volúmenes reales y cotización del operador del 600.</li><li>No incluye contingencia: sugerimos reservar un 10 % adicional.</li>' +
      '<li>CloudTalk se mantiene durante la marcha blanca (S10–S11) para no cortar la atención.</li><li>El tipo de cambio y las tarifas de Meta y de los proveedores pueden variar.</li></ul></section></div>';
  };

  /* ---------- Router y eventos ---------- */
  var view = document.getElementById('view');
  function current() { var h = (location.hash || '').replace('#', ''); return VIEWS[h] ? h : 'inicio'; }
  function render(keepScroll) {
    var r = current();
    var y = window.scrollY;
    view.innerHTML = VIEWS[r]();
    document.querySelectorAll('.nav a').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-route') === r); if (a.getAttribute('data-route') === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (keepScroll) window.scrollTo(0, y);
  }
  window.addEventListener('hashchange', function () {
    render(false);
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
    var nav = document.getElementById('nav'); nav.classList.remove('is-open');
    document.querySelector('.menu-btn').setAttribute('aria-expanded', 'false');
  });

  function mark(field) { var o = Object.assign({}, state.con[field]); o[state.con.sel] = true; state.con[field] = o; }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act'), key = el.getAttribute('data-key');
    var v = state.voice, w = state.wa, c = state.con;
    switch (act) {
      case 'menu':
        var nav = document.getElementById('nav'), open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open); el.setAttribute('aria-expanded', String(open)); return;
      case 'voice-sc': v.sc = key; v.step = 1; break;
      case 'voice-next': v.step = Math.min(v.step + 1, VOICE[v.sc].steps.length); break;
      case 'voice-reset': v.step = 1; break;
      case 'wa-sc': w.sc = key; w.step = 1; break;
      case 'wa-next': w.step = Math.min(w.step + 1, WA[w.sc].steps.length); break;
      case 'wa-reset': w.step = 1; break;
      case 'con-sel': c.sel = key; c.muted = false; break;
      case 'con-take': mark('taken'); break;
      case 'con-call': mark('taken'); mark('calling'); break;
      case 'con-close': mark('closed'); c.muted = false; break;
      case 'con-mute': c.muted = !c.muted; break;
      case 'con-send':
        var inp = document.getElementById('reply'), t = inp ? inp.value.trim() : '';
        if (!t) { if (inp) inp.focus(); return; }
        var o = Object.assign({}, c.sent); o[c.sel] = (o[c.sel] || []).concat([t]); c.sent = o; break;
      case 'crm-tab': state.crm.tab = key; break;
      case 'calc-reset': state.calc = JSON.parse(JSON.stringify(CALC_DEFAULTS)); break;
      default: return;
    }
    render(true);
    if (act === 'con-send' || act === 'con-take') { var i2 = document.getElementById('reply'); if (i2) i2.focus(); }
  });
  function onCalc(e) {
    var el = e.target;
    if (!el || !el.hasAttribute || !el.hasAttribute('data-calc')) return;
    var v = Number(el.value);
    state.calc[el.getAttribute('data-calc')] = isFinite(v) && v >= 0 ? v : 0;
    var out = document.getElementById('calc-out');
    if (out) out.innerHTML = calcOut();
  }
  document.addEventListener('input', onCalc);
  document.addEventListener('change', onCalc);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'reply') { e.preventDefault(); var b = document.querySelector('[data-act="con-send"]'); if (b) b.click(); }
  });

  render(false);
})();
