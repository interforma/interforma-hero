# Interforma Analytics Engine v1.0

> Dispatcher desacoplado para eventos de comportamiento del usuario.
> Sprint 1 · 2026-08-01

---

## Principio fundamental

Los componentes **nunca** llaman a GA4 directamente.
Toda telemetría pasa por `track()` en `src/lib/analytics/track.ts`.

```typescript
// ✅ Correcto
track('hero_cta', { placement: 'hero' });
track({ name: 'hero_cta', properties: { placement: 'hero' } });

// ❌ Incorrecto — no hacer esto en componentes
window.gtag('event', 'hero_cta', { placement: 'hero' });
```

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/lib/analytics/track.ts` | Dispatcher central — único punto de salida a GA4 |
| `src/lib/analytics/scroll.ts` | Tracker de profundidad de scroll |
| `src/layouts/Base.astro` | Inyecta snippet GA4 + inicializa scroll tracker |

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `PUBLIC_GA4_MEASUREMENT_ID` | Sí (prod) | ID de medición GA4 (ej. `G-JMXV5EVB59`). Si ausente, el snippet no se inyecta. **Sin fallback.** |
| `PUBLIC_CLARITY_ID` | No | ID de Microsoft Clarity. Fallback: `'xwqi4gkp67'` |

---

## Firma de `track()`

```typescript
// Forma 1 — objeto
track({ name: 'evento', properties: { placement: 'hero' } })

// Forma 2 — posicional
track('evento', { placement: 'hero' })
```

Comportamiento por entorno:

| Entorno | Acción |
|---------|--------|
| Dev | `console.groupCollapsed('[analytics] evento')` + tabla de props |
| Prod | `window.gtag('event', name, props)` |
| Sin GA4 | No-op silencioso (gtag no cargado) |

---

## Catálogo de eventos

> **Revisado contra el código el 2026-10-26.** El catálogo anterior describía eventos de los componentes legados (`hero_cta`, `click_secondary_cta`, `menu_open`, `contact_start`, `contact_whatsapp`, `click_email`), eliminados en el PR #4. Hoy ninguno se envía.

### Navegación

| Evento | Trigger | Props |
|--------|---------|-------|
| `nav_click` | Clic en un link de la nav (desktop o móvil) | `destination`, `placement` (`header_desktop` \| `mobile_menu`) |
| `nav_click` | «Ver el método →» del Hero | `destination: '#metodo'`, `placement: 'hero'` |
| `nav_click` | «Cómo funciona» del hero de `/agentes` | `destination: '#como'`, `placement: 'agentes_hero'` |
| `agents_landing_open` | «Ver Interforma Agents» en `/#agentes` | `placement: 'home_agents'` |
| `method_detail_open` | «Ver el método en detalle» en `/#metodo` | `placement: 'home_method'` |
| `method_detail_back` | «← Volver al inicio» en `/metodo` | `page: 'metodo'` |
| `method_diagram_fullscreen` | «Abrir en pantalla completa» en `/metodo` | `page: 'metodo'` |
| `agents_flow_open` | «Ver el flujo en detalle» en `/#agentes` | `placement: 'home_agents'` |
| `case_filter` | Filtro por tipo en la sección Casos | `filter`, `placement: 'home_cases' \| 'cases_page'` |
| `case_open` | Clic en una tarjeta con página de caso | `case` (id del caso), `placement` |
| `case_site_open` | «Ver sitio» de un caso sin página propia | `case`, `placement` |
| `agents_flow_back` | «← Volver al inicio» en `/agentes/flujo` | `page: 'agentes_flujo'` |
| `agents_flow_fullscreen` | «Abrir en pantalla completa» en `/agentes/flujo` | `page: 'agentes_flujo'` |
| `agents_flow_to_landing` | «Ver Interforma Agents» en `/agentes/flujo` | `page: 'agentes_flujo'` |

### WhatsApp

| Evento | Trigger | Props |
|--------|---------|-------|
| `click_whatsapp` | Botón de WhatsApp del Header | `placement: 'header'` |
| `click_whatsapp` | CTA principal del Hero | `placement: 'hero'` |
| `click_whatsapp` | CTA final del home | `placement: 'cta_section'` |
| `click_whatsapp` | `WhatsAppButton` (CTA de `/metodo` y `/agentes/flujo`) | `placement` (`metodo_cta` \| `agentes_flujo_cta`), `page_path` |
| `click_whatsapp` | «Hablar con ventas» en `/agentes` | `placement: 'agentes_cta'`, `page: 'agentes'` |
| `click_whatsapp` | Botón flotante | `placement: 'float'` |
| `click_whatsapp` | Botón dentro del saludo de Punto | `placement: 'punto_bubble'` |
| `punto_bubble_view` | Aparece el saludo «¿Conversamos?» (una vez por sesión, a los 6 s) | `path` |
| `punto_bubble_dismiss` | El visitante cierra el saludo (× o Escape) | — |

### Sección «¿Le suena familiar?» (animación de Punto)

| Evento | Trigger | Props |
|--------|---------|-------|
| `problems_scene_view` | Primera vez que se ve cada escena en la visita | `scene` (`1`–`6` \| `'cierre'`) |
| `problems_chip_click` | Clic en un problema de la lista | `scene` |
| `problems_toggle` | Pausar o reanudar | `state` (`pause` \| `play`) |
| `problems_sound` | Activar o silenciar el sonido (apagado por defecto) | `state` (`on` \| `off`) |

**KPI sugerido:** porcentaje de visitas que llegan a `scene: 'cierre'` (vieron la historia completa).

### Interforma Agents (conversión)

| Evento | Trigger | Props |
|--------|---------|-------|
| `agents_pilot_cta` | «Agendar piloto» del hero de `/agentes` (lleva a `#empezar`) | `placement: 'agentes_hero'`, `page: 'agentes'` |
| `agents_pilot_cta` | «Agendar piloto» del CTA final (abre la agenda de Cal.com) | `placement: 'agentes_cta_agenda'`, `page: 'agentes'` |

**KPI sugerido:** `agents_pilot_cta` con `placement: 'agentes_cta_agenda'` + `click_whatsapp` con `placement: 'agentes_cta'`, dividido por las visitas a `/agentes`.

### Otras herramientas

| Herramienta | Dónde | Nota |
|---|---|---|
| Microsoft Clarity | `Base.astro` | Heatmaps y grabaciones; ID con fallback |
| Metricool | `Base.astro` (PR #13) | Píxel de seguimiento para redes; ID fijo en el código |

### Scroll

| Evento | Trigger | Props |
|--------|---------|-------|
| `scroll_25` | Usuario alcanza 25% de la página | `page_path` |
| `scroll_50` | Usuario alcanza 50% de la página | `page_path` |
| `scroll_75` | Usuario alcanza 75% de la página | `page_path` |
| `scroll_90` | Usuario alcanza 90% de la página | `page_path` |

---

## Convenciones de payload

- Usar `placement` (no `source`) para indicar el origen físico del elemento
- Usar `destination` (no `target`) para URLs o anchors de destino
- Nunca incluir PII (nombre, email, teléfono, RUT) en ningún evento
- `page_path` = `window.location.pathname`

---

## Scroll tracker

`src/lib/analytics/scroll.ts` — `initScrollTracking()`

- Listener pasivo en `window`
- Milestones: `[25, 50, 75, 90]` (%)
- Un `Set` evita duplicados por sesión
- El listener se remueve automáticamente al completar los 4 milestones

Inicialización en `Base.astro` (una vez, globalmente):
```astro
<script>
  import { initScrollTracking } from '@lib/analytics/scroll';
  initScrollTracking();
</script>
```

---

## GA4 en Base.astro

El snippet se inyecta **sólo si `PUBLIC_GA4_MEASUREMENT_ID` tiene valor** en tiempo de build:

```astro
const ga4Id = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID;

{ga4Id && (
  <Fragment set:html={`<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>...`} />
)}
```

En Vercel, la variable debe existir en **Production** (no Preview ni Development, salvo para pruebas).

---

## Microsoft Clarity

Clarity está integrado en `Base.astro` mediante `is:inline define:vars`.
Clarity y GA4 son independientes — no interferir entre sí.
Clarity captura heatmaps y grabaciones de sesión automáticamente.

---

## Pendientes Sprint 2

| Tarea | Prioridad |
|-------|-----------|
| Evento `scroll_section` por sección visible (IntersectionObserver) | Media |
| Evento `form_start` / `form_submit` si se añade formulario | Alta (cuando aplique) |
| Adaptador PostHog opcional | Baja |
| Evento `exit_intent` | Baja |
