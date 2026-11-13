(function () {
  'use strict';
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function badge(cls, text) { return '<span class="tag ' + cls + '">' + esc(text) + '</span>'; }
  var state = { calc: {} };
  var VIEWS = {};
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

  var view = document.getElementById('view');
  function render() { view.innerHTML = VIEWS.inversion(); }
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
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act="calc-reset"]');
    if (!el) return;
    state.calc = JSON.parse(JSON.stringify(CALC_DEFAULTS));
    render();
  });
  render();
})();
