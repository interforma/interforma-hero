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

### Navegación

| Evento | Trigger | Props |
|--------|---------|-------|
| `nav_click` | Clic en link de nav (desktop o mobile) | `destination`, `placement` (`header_desktop` \| `mobile_menu`), `event` |
| `menu_open` | Apertura del menú mobile | `placement: 'header'` |
| `click_secondary_cta` | Clic en "Ver el método" del Hero | `destination: '#metodo'`, `placement: 'hero'` |

### WhatsApp

| Evento | Trigger | Props |
|--------|---------|-------|
| `hero_cta` | Clic en CTA principal del Hero | `placement: 'hero'`, `label` |
| `click_whatsapp` | Clic en WhatsApp desde Header | `placement: 'header'` |
| `click_whatsapp` | Clic en WhatsApp desde CTA Section | `placement: 'cta_section'` |
| `click_whatsapp` | Clic en botón flotante | `placement: 'float'` |
| `contact_whatsapp` | Clic en WhatsApp desde sección Contacto | `placement: 'contact'` |

### Contacto

| Evento | Trigger | Props |
|--------|---------|-------|
| `contact_start` | Sección Contacto llega al viewport (30%) | `page_path` |
| `click_email` | Clic en link de email | `placement: 'contact'` |

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
