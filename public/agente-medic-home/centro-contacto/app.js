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
      ['#uso', '07', 'Uso y control', 'Por qué el equipo sí lo usaría y qué pasa a manos de Medic Home.'],
      ['#plazos', '08', 'Etapas y plazos', 'Seis etapas para salir de CloudTalk en unas 11 semanas.']
    ];
    return '<section class="hero"><span class="eyebrow">Propuesta para Medic Home · noviembre 2026</span>' +
      '<h1>Un centro de contacto que atiende, llama y registra solo.</h1>' +
      '<p class="lead">Maqueta funcional del reemplazo de CloudTalk: el número 600 entrante y saliente, un WhatsApp oficial, atención humana cuando corresponde y un CRM propio. Recorra las secciones y pruebe los casos.</p>' +
      '<div class="btns"><a class="btn btn--primary" href="#llamadas" style="text-decoration:none;color:#281F18">Comenzar el recorrido</a><a class="btn btn--ghost-dark" href="#plazos" style="text-decoration:none">Ver etapas y plazos</a></div>' +
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
    var src = '/agente-medic-home/centro-contacto/arquitectura.html';
    return '<div class="intro"><span class="eyebrow eyebrow--num">05 · Arquitectura</span><h1>Una sola plataforma para el 600, el WhatsApp y el CRM.</h1>' +
      '<p class="lead">Diagrama interactivo con el mismo formato del Método Interforma. Use las vistas Canales, Inteligencia y Atención y datos para recorrerlo por partes; al pie, qué reemplaza y cómo se cuidan los datos.</p></div>' +
      '<div class="flowframe"><iframe src="' + src + '" title="Diagrama interactivo de la arquitectura del centro de contacto de Medic Home" loading="lazy"></iframe></div>' +
      '<p class="small muted" style="margin:0">Asterisk, n8n y Chatwoot son de código abierto; Twenty es el CRM autoalojado. <a href="' + src + '" target="_blank" rel="noopener" style="font-weight:700">Abrir en pantalla completa</a></p>' +
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
    var cur = state.flow || 'entrante';
    var info = {
      entrante: { label: 'Entrante · 600 y WhatsApp', src: '/agente-medic-home/centro-contacto/flujo-entrante.html', title: 'Diagrama interactivo del flujo entrante de Medic Home' },
      saliente: { label: 'Saliente · confirmaciones y devoluciones', src: '/agente-medic-home/centro-contacto/flujo-saliente.html', title: 'Diagrama interactivo del flujo saliente de Medic Home' }
    };
    var f = info[cur];
    return '<div class="intro"><span class="eyebrow eyebrow--num">06 · Flujos del proceso</span><h1>Entrante y saliente: qué cambia respecto de hoy.</h1>' +
      '<p class="lead">Diagramas interactivos, con el mismo formato del Método Interforma. Use las vistas de cada diagrama para recorrer el camino que resuelve el asistente y el que pasa a una persona.</p></div>' +
      '<div class="pillrow" role="group" aria-label="Elegir flujo">' + Object.keys(info).map(function (k) { return pill('flow-tab', k, info[k].label, k === cur); }).join('') + '</div>' +
      '<div class="flowframe"><iframe src="' + f.src + '" title="' + esc(f.title) + '" loading="lazy"></iframe></div>' +
      '<p class="small muted" style="margin:0">Cada diagrama compara al pie la operación de hoy con CloudTalk y la propuesta. <a href="' + f.src + '" target="_blank" rel="noopener" style="font-weight:700">Abrir en pantalla completa</a></p>';
  };

  VIEWS.uso = function () {
    function table(head, rows) {
      return '<div class="tablebox"><table><thead><tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + r[1] + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
    var crit = badge('b-crit', 'Crítico') + ' ', warn = badge('b-warn', 'Mejorable') + ' ';
    return '<div class="intro"><span class="eyebrow eyebrow--num">07 · Uso y control</span><h1>Un reemplazo que el equipo sí usa.</h1>' +
      '<p class="lead">Cambiar de plataforma solo sirve si el equipo la usa. Por eso el reemplazo de CloudTalk viene con lo que hoy hace que se esquive el sistema: el WhatsApp personal y un registro que no funciona.</p></div>' +
      '<section class="card"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">01 · Uso</span><h2>Por qué el equipo sí lo usaría.</h2></div>' +
      table(['Aspecto', 'Hoy', 'Propuesta'], [
        ['WhatsApp', crit + 'Cada ejecutivo en su celular personal: el sistema queda de lado.', 'Número oficial atendido desde la consola o la app móvil, igual de cómodo que el personal.'],
        ['Registro', crit + 'Depende de una integración con Zoho que falla.', 'Automático: el ejecutivo no registra nada a mano.'],
        ['Llamadas perdidas', warn + 'Se pierden si nadie las revisa.', 'Lista de devoluciones con responsable y plazo.'],
        ['Atención', warn + 'El paciente navega un menú de grabaciones y repite su caso al ejecutivo.', 'Habla con sus palabras; el ejecutivo recibe el resumen antes de contestar.'],
        ['Tareas repetitivas', warn + 'Confirmar visitas, contestar lo mismo y registrar a mano.', 'El asistente las absorbe, entrantes y salientes; el equipo atiende lo que requiere criterio.']
      ]) + '</section>' +
      '<section class="card"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">02 · Control</span><h2>Lo que pasa a manos de Medic Home.</h2></div>' +
      table(['Aspecto', 'Hoy', 'Propuesta'], [
        ['Número y contactos', warn + 'Los contactos de WhatsApp quedan en teléfonos personales.', 'El 600, el WhatsApp oficial y el historial son de Medic Home.'],
        ['Datos de pacientes', warn + 'Repartidos entre CloudTalk, Zoho y celulares.', 'En un servidor dedicado de Medic Home, con accesos por rol.'],
        ['Cambios en los flujos', warn + 'Limitados a lo que permite la plataforma.', 'Se ajustan a la operación: colas, horarios, reglas y mensajes.'],
        ['Medición', warn + 'Sin datos del WhatsApp ni del cierre de cada caso.', 'Métricas por canal, cola y ejecutivo: tiempos, resueltos por el asistente y devoluciones.'],
        ['Crecer el equipo', warn + 'Cada ejecutivo nuevo pasa por la configuración de CloudTalk.', 'Sumar un ejecutivo es crear un usuario en la consola.']
      ]) + '</section>' +
      '<div class="lists"><section style="background:#FBE6DC;border:1px solid #F7CDBB"><span class="eyebrow eyebrow--num">03 · Lo que hay que cuidar</span><ul>' +
      '<li>Calidad y continuidad de la voz: operador con acuerdo de servicio y respaldo.</li><li>Soporte: Interforma pasa a ser responsable de la operación, con tiempos de respuesta acordados.</li><li>Cambio en el equipo: capacitación y acompañamiento las primeras semanas.</li><li>Datos de salud: consentimiento, accesos y respaldos conforme a la Ley 21.719.</li></ul></section>' +
      '<section style="background:#F2F1EE;border:1px solid #D0CCC4"><span class="eyebrow">04 · Para el diagnóstico</span><ul>' +
      '<li>Capturas de los flujos de CloudTalk y sus grabaciones.</li><li>Operador actual del 600.</li><li>Volúmenes aproximados de llamadas y de WhatsApp al mes.</li><li>Cómo usan hoy Zoho y la agenda clínica.</li></ul></section></div>' +
      '<div class="outcome" style="flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px"><span class="small">¿Cuándo estaría funcionando? Las etapas y semanas están en la siguiente sección.</span><a class="btn btn--primary" style="text-decoration:none;color:#281F18" href="#plazos">Ver etapas y plazos</a></div>';
  };

  /* ---------- Etapas y plazos ---------- */
  var STAGES = [
    ['E0', 'Diagnóstico y diseño', 'Revisamos los flujos y grabaciones de CloudTalk, el operador del 600, los volúmenes, Zoho y la agenda clínica.', 1, 1],
    ['E1', 'Base y CRM', 'Servidor dedicado, seguridad y respaldos; CRM instalado y contactos migrados.', 2, 3],
    ['E2', 'WhatsApp oficial', 'Número verificado en Meta, asistente, consola y traspaso a una persona. Es lo primero que usa el equipo.', 3, 5],
    ['E3', 'Voz y número 600', 'El 600 sale de CloudTalk con sus mismos flujos de grabaciones, más el asistente de voz.', 5, 8],
    ['E4', 'Salientes y métricas', 'Confirmaciones automáticas, devoluciones de llamadas perdidas y reportes.', 8, 9],
    ['E5', 'Marcha blanca', 'Capacitación, operación en paralelo con CloudTalk y apagado de la plataforma anterior.', 10, 11]
  ];
  var WEEKS = 11;

  VIEWS.plazos = function () {
    var gantt = '<div class="gantt" role="table" aria-label="Plazos por etapa"><div class="gantt__row gantt__head" role="row"><span role="columnheader">Etapa</span>' +
      Array.apply(null, Array(WEEKS)).map(function (_, i) { return '<span role="columnheader">S' + (i + 1) + '</span>'; }).join('') + '</div>' +
      STAGES.map(function (s) {
        return '<div class="gantt__row" role="row"><span role="rowheader"><b>' + s[0] + ' · ' + esc(s[1]) + '</b></span><span class="gantt__bar" style="grid-column:' + (s[3] + 1) + ' / ' + (s[4] + 2) + '" aria-label="Semanas ' + s[3] + ' a ' + s[4] + '"></span></div>';
      }).join('') + '</div>';
    return '<div class="intro"><span class="eyebrow eyebrow--num">08 · Etapas y plazos</span><h1>Fuera de CloudTalk en unas 11 semanas, sin cortar la atención.</h1>' +
      '<p class="lead">El reemplazo avanza por etapas. Cada una se valida con Medic Home antes de pasar a la siguiente, y CloudTalk sigue funcionando hasta la marcha blanca.</p></div>' +
      '<section class="card"><div class="pillrow"><span class="eyebrow eyebrow--num" style="width:auto">Línea de tiempo</span><h2>Seis etapas, semana a semana.</h2></div>' + gantt +
      '<div class="tablebox"><table><thead><tr><th>Etapa</th><th>Qué incluye</th><th>Semanas</th></tr></thead><tbody>' +
      STAGES.map(function (s) { return '<tr><td>' + s[0] + ' · ' + esc(s[1]) + '</td><td>' + esc(s[2]) + '</td><td>' + (s[3] === s[4] ? 'S' + s[3] : 'S' + s[3] + '–S' + s[4]) + '</td></tr>'; }).join('') + '</tbody></table></div></section>' +
      '<div class="lists"><section style="background:#F2F1EE;border:1px solid #D0CCC4"><span class="eyebrow">Cómo avanzamos</span><ul>' +
      '<li>Cada etapa termina con una validación de Medic Home antes de seguir.</li><li>El WhatsApp oficial llega primero, para que el equipo deje de usar sus celulares personales.</li>' +
      '<li>El 600 cambia de plataforma en una ventana acordada, con CloudTalk como respaldo.</li><li>CloudTalk se apaga solo cuando todo funciona en la nueva plataforma.</li></ul></section>' +
      '<section style="background:#FBE6DC;border:1px solid #F7CDBB"><span class="eyebrow eyebrow--num">A considerar</span><ul>' +
      '<li>La portabilidad del 600 depende de los plazos del operador.</li><li>Los plazos se confirman al cerrar el diagnóstico, con los flujos y volúmenes reales.</li>' +
      '<li>La propuesta formal, con sus condiciones, se entrega al terminar el diagnóstico.</li></ul></section></div>';
  };

  /* ---------- Router y eventos ---------- */
  var view = document.getElementById('view');
  var ALIAS = { costos: 'uso', inversion: 'plazos' };
  function current() { var h = (location.hash || '').replace('#', ''); h = ALIAS[h] || h; return VIEWS[h] ? h : 'inicio'; }
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
      case 'flow-tab': state.flow = key; break;
      default: return;
    }
    render(true);
    if (act === 'con-send' || act === 'con-take') { var i2 = document.getElementById('reply'); if (i2) i2.focus(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'reply') { e.preventDefault(); var b = document.querySelector('[data-act="con-send"]'); if (b) b.click(); }
  });

  render(false);
})();
