# Estado del proyecto — interforma.digital

**Fecha del análisis:** 2026-10-26
**Rama / commit:** `main` @ `5f97aef` (Motion: El barrio de Punto · Ep. 01)
**Análisis anterior:** 2026-10-02 @ `7dc7d30`. Este documento lo reemplaza.
**Validación ejecutada:** `pnpm build` ✅ (6 páginas) · `astro check` ✅ (0 errores, 0 warnings, 2 hints).

---

## 1. Resumen ejecutivo

Desde el 2 de octubre se cerró casi toda la deuda técnica (0 errores de tipos, código legado eliminado, sitemap automático, navegación multipágina) y el sitio creció: nuevas páginas `/metodo` y `/agentes/flujo`, identidad de marca 2026 (paleta Energía, isotipo Transforma animado, Punto como mascota), píxel de Metricool y un motor de animación para las piezas de redes.

Los riesgos principales ahora son tres:

1. **Documentos de clientes públicos e indexables.** Informes de Grupo Borie (incluye montos facturados), la propuesta de F5 y el panel de Gatica Property se sirven desde `public/` sin `noindex` y con `robots.txt` abierto.
2. **La conversión de `/agentes` no funciona como debería.** Sus CTA abren un correo a `hola@interforma.ai`, un dominio distinto al del sitio, y no tienen tracking.
3. **La documentación de gobierno sigue por detrás del código.** `DESIGN.md` se contradice internamente, los specs están en *Draft* y el catálogo de analytics no coincide con lo que se envía. Este PR actualiza estado, changelog, decisiones, roadmap, analytics y README, y agrega `docs/agentes/`.

| Área | Estado | Cambio vs. 2-oct |
|---|---|---|
| Sitio en producción (home, `/metodo`, `/agentes`, `/agentes/flujo`) | 🟢 Listo | +2 páginas |
| Calidad de código (TS estricto) | 🟢 0 errores en `astro check` | antes 🔴 39 errores |
| Identidad 2026 y sistema de diseño | 🟢 En código · 🟡 `DESIGN.md` contradictorio | nueva identidad |
| SEO técnico / GEO | 🟡 Sitemap automático OK, pero URLs con y sin barra final mezcladas | antes 🔴 |
| Analytics | 🟡 Parcial: CTA principales de WhatsApp sin tracking | sin cambio relevante |
| Privacidad de activos de clientes | 🔴 Públicos e indexables | nuevo hallazgo |
| Proceso SDD / gobierno | 🟡 Actualizado en este PR; specs y arquitectura siguen abiertos | antes 🔴 |
| Interforma Agents | 🟢 Referencia en producción con un cliente · ⚪ sin agente propio | documentado en `docs/agentes/` |
| Motion y contenido de redes | 🟢 Motor y fuentes versionados | nuevo |
| Automatización comercial propia (Sprint 2) | ⚪ No iniciado | sin cambio |

---

## 2. ✅ Qué está listo

### Infraestructura y stack
- **Astro 4.16.x** estático (ADR-001, ADR-008), **Node 20** (ADR-007), **pnpm 10** (el `pnpm-workspace.yaml` usa `allowBuilds`, que requiere pnpm ≥ 10).
- **Vercel** (ADR-002) con headers de seguridad y un redirect 301 de `/agentes/` → `/agentes`.
- **`@astrojs/sitemap` 3.2.1** activo (última versión compatible con Astro 4). Genera `sitemap-index.xml` y `sitemap-0.xml` con las 5 páginas indexables.
- CSS nativo con variables (ADR-006). La fuente de verdad de color es el bloque *IDENTIDAD 2026* de `src/styles/tokens.css`; tokens JSON en `design/tokens/`.

### Páginas
| Ruta | Contenido | Desde |
|---|---|---|
| `/` | Hero, Capacidades, Problemas, Método (con botón a `/metodo`), Servicios, Agentes (con botones a `/agentes` y `/agentes/flujo`), Sectores, CTA | rediseño D/E |
| `/metodo` | Diagrama interactivo del método (Archify, iframe), detalle de las 6 etapas, JSON-LD `HowTo` | PR #6 · 13-oct |
| `/agentes` | Landing de Interforma Agents (8 secciones) | PR #3 · 1-oct |
| `/agentes/flujo` | Diagrama del agente de WhatsApp, 8 pasos, estados, JSON-LD `HowTo` | PR #7 · 13-oct |
| `/privacidad`, `/404` | Política de privacidad y página 404 con Punto en estado «uy» | — |

### Limpieza técnica (PR #4 · 2-oct)
- Eliminados los componentes legados del diseño anterior (19 errores de tipos).
- Tipos anotados en la demo de `AgentsSection` (17 errores).
- `SectionHeading` acepta `id` y `as`; se repararon los `aria-labelledby` de Método, Sectores y CTA.
- Nav y footer usan `/#seccion` y enlazan a `/agentes`; el scroll-spy del header solo compara hashes en la página actual.

### Identidad 2026 (PR #8–#11 · 14 y 15-oct)
- Paleta **Energía `#EE6E43`** + neutros piedra cálida; **Outfit** (titulares), **Manrope** (cuerpo) y **JetBrains Mono** (datos), autoalojadas.
- Isotipo **Transforma** y logotipo «interforma» en minúsculas; animación CSS en header y footer (estática con `prefers-reduced-motion`).
- **Punto**, la mascota: 8 expresiones, avatar del agente en `/agentes`, saludo «¿Conversamos?» junto al botón de WhatsApp (una vez por sesión) y 404.
- Firma de correo con isotipo animado (GIF de 50 KB) generado por `scripts/isotipo-gif.py`.

### SEO y medición
- JSON-LD en home (`Organization`, `ProfessionalService`, `WebSite`), `/metodo` y `/agentes/flujo` (`HowTo`).
- `llms.txt`, canonical, Open Graph y `og-image` actualizada con la nueva identidad.
- Diagramas en `/diagramas/` con `noindex` y canonical a su página.
- GA4 (condicional), Microsoft Clarity y **Metricool** (PR #13 · 20-oct) en `Base.astro`.

### Motion y redes (PR #12, #14–#16 · 15 al 26-oct)
`design/motion/`: motor SVG (`engine.html`) + captura con Playwright + ffmpeg + música original en Python. Piezas: La semilla, presentación de Punto, Cap. 03, 04 y 05, Método, «Punto en acción» (clínica y automotora, plano y con escenarios), *El barrio de Punto · Ep. 01* (Doña Rosa), portadas y stickers de WhatsApp. Fuentes OFL versionadas.

### Activos de clientes y comerciales en `public/`
| Ruta | Qué es |
|---|---|
| `/informes/grupo-borie/sept-2026.html`, `oct-2026.html` | Informes mensuales (Chart.js) |
| `/informes/_template/` | Plantilla de informe mensual |
| `/propuestas/f5/` | Propuesta comercial de F5 Estudio Contable (13-oct) |
| `/clientes/gatica-property/` | Panel, plan de marketing y landing «Las Rocas» |
| `/agente-medic-home/` | Propuesta de asistente de WhatsApp para Medic-Home |

### Documentación
- **Nueva:** `docs/agentes/` (arquitectura, oferta y piloto, mapa en el sitio).
- **Actualizada en este PR:** este documento, `README.md`, `.interforma/CHANGELOG.md`, `DECISIONS.md` (ADR-009 a ADR-011), `ROADMAP.md` y `ANALYTICS.md` (catálogo real).

---

## 3. 🟡 Qué está en progreso / parcial

| Tema | Situación | Evidencia |
|---|---|---|
| **`DESIGN.md`** | El bloque *Identidad 2026* (línea ~88) declara Energía como acento, pero el cuerpo del documento sigue describiendo **Signal Blue `#2655E8`** y la *One Accent Rule* azul. Quien lo lea completo recibe dos sistemas. | `DESIGN.md` §Colors |
| **Barra final en URLs** | Astro genera `/agentes/index.html`. El sitemap publica `/agentes/`, pero Vercel la redirige con 301 a `/agentes` y el canonical apunta a `/agentes`. Lo mismo para `/metodo` y `/agentes/flujo` (sitemap con barra, canonical sin barra, sin redirect). Google recibe señales contradictorias. | `dist/sitemap-0.xml`, `vercel.json`, canonicals |
| **`public/sitemap-0.xml`** | El PR #13 volvió a agregar un sitemap estático que la integración sobrescribe en el build. Es código muerto que confunde. | `public/sitemap-0.xml` |
| **Tracking de CTA** | Hero y CTA final del home (`wa.me`) no llaman a `track()`. `WhatsAppButton` declara `data-track-event="click_whatsapp"` pero nada lo escucha (afecta `/metodo` y `/agentes/flujo`). En desktop, los clics de la nav no se registran. `/agentes` no tiene ningún evento. | `grep track src` |
| **Conversión de `/agentes`** | «Agendar piloto» y «Hablar con ventas» son `mailto:hola@interforma.ai`. No llevan a WhatsApp ni a la agenda, y el dominio no es el del sitio. | `src/sections/agentes/CtaAgentes.astro` |
| **Voz** | `/agentes` usa «tú»; home, `/metodo`, `/agentes/flujo` y el agente en producción usan «usted». | `HeroAgentes.astro`, `PRODUCT.md` |
| **Alcance comunicado de Agents** | El flujo público muestra postventa, encuesta y remarketing; en la implementación real están en preparación. La «app del operador iOS» es un concepto. | `docs/agentes/README.md` |
| **Copy y headline A/B** | Copy marcado como provisional; decisión de headline abierta. | `src/config/content.ts`, `PRODUCT.md` |
| **`SPEC-001`** | Sigue en *Draft*, con alcance («Diagnóstico», «Soluciones») y eventos (`view_home`, `start_diagnostic`) que no existen en el sitio. No hay specs para `/metodo`, `/agentes` ni `/agentes/flujo`. | `specs/` |
| **Migración Firebase / DNS** | El sitio se sirve desde Vercel, pero no hay registro del cambio de DNS ni del retiro de Firebase (ADR-003, ADR-004). | `.interforma/DECISIONS.md` |

---

## 4. 🔴 Qué falta por hacer

### Prioridad alta
1. **Proteger los activos de clientes.** Agregar `noindex, nofollow` a `/informes/`, `/propuestas/`, `/clientes/` y `/agente-medic-home/`, y excluirlos en `robots.txt` (o con un header `X-Robots-Tag` en `vercel.json`). Evaluar si deben salir del repositorio público: el informe de octubre incluye el monto facturado al cliente.
2. **Conversión de `/agentes`:** reemplazar los `mailto` por WhatsApp o Cal.com, con tracking.
3. **Unificar la barra final:** elegir una convención (`trailingSlash` en `astro.config.mjs` + `trailingSlash` en `vercel.json`), alinear canonicals y sitemap, quitar el redirect manual y borrar `public/sitemap-0.xml`.
4. **Tracking de CTA:** Hero, CTA final, `WhatsAppButton`, nav desktop y `/agentes`. `AGENTS.md` exige no tener CTA sin tracking.

### Prioridad media: documentación y proceso
5. Reescribir el cuerpo de `DESIGN.md` según la identidad 2026 (Energía, neutros piedra, tipografías, Punto).
6. Actualizar `SPEC-001` al estado real y crear specs retroactivos para `/metodo`, `/agentes` y `/agentes/flujo`.
7. Crear `docs/01-product-architecture.md` (o documentar la arquitectura vigente) y cerrar PROMPT-002 a 007 o retirarlos.
8. Registrar el cambio de DNS y el estado de Firebase.

### Prioridad media: contenido y negocio
9. Voz única (usted) en `/agentes`.
10. JSON-LD `Service` para `/agentes`.
11. Copy definitivo, headline y casos reales con autorización y métricas verificables.
12. **Agente propio de Interforma:** hoy el sitio deriva a WhatsApp humano. Ver `docs/agentes/README.md`.

### Prioridad baja: QA
13. Validación automática por PR (Lighthouse/axe en CI o checklist).
14. Verificar contraste de las reglas Energía sobre fondos claros en todos los componentes.
15. Documentar en `README.md` que el proyecto requiere pnpm ≥ 10 (o fijarlo con `packageManager`).

---

## 5. Roadmap: posición actual

| Sprint | Estado |
|---|---|
| **Sprint 0 — Recuperar presencia online** | 🟢 Completo en la práctica. Falta dejar constancia del DNS y del rollback. |
| **Sprint 1 — Medición y optimización** | 🟡 En curso. SEO técnico, GEO, analytics base y Metricool listos. Faltan eventos de embudo completos, casos por industria y ajustes de conversión con datos. |
| **Sprint 2 — Automatización comercial** | ⚪ No iniciado para Interforma. La pila existe y opera para un cliente (n8n, WhatsApp Cloud API, Chatwoot, CRM Twenty), por lo que el agente propio puede reutilizarla. |
| **Sprint 3 — Escala** | 🟡 Adelantado. Ya existen páginas de servicio y detalle (`/agentes`, `/agentes/flujo`, `/metodo`) y una serie de contenidos animados. Faltan casos de éxito, páginas por industria y RAG. |

---

## 6. Cumplimiento de `AGENTS.md` (Definition of Done)

| Criterio | Estado | Nota |
|---|---|---|
| Funciona | ✅ Cumple | Build OK, 6 páginas |
| Comprensible | ✅ Cumple | Secciones y páginas bien separadas |
| Responsive | ✅ Cumple | — |
| Accesible | 🟡 Parcial | `aria-labelledby` reparados y reduced motion respetado; falta auditoría formal |
| Documentada | 🟡 Parcial | Al día tras este PR, salvo `DESIGN.md` y specs |
| Pruebas / validación explícita | 🟡 Parcial | `astro check` limpio; sin tests ni CI de calidad |
| Sin regresiones conocidas | 🟡 Parcial | Señales mixtas de barra final en SEO |
| TypeScript estricto | ✅ Cumple | 0 errores |
| CTA con tracking | 🔴 Pendiente | Ver §3 |
| Sin secretos en repo | ✅ Cumple | IDs públicos de Clarity y Metricool; ningún token. Pero hay datos comerciales de clientes en `public/` (ver §4.1) |

---

## 7. Próximos pasos recomendados

1. PR corto de privacidad: `noindex` + `robots.txt` para activos de clientes, y decidir si salen del repo.
2. PR de conversión y medición: CTA de `/agentes`, tracking de todos los WhatsApp, nav desktop.
3. PR de SEO: convención de barra final, canonicals, sitemap estático fuera.
4. Reescribir `DESIGN.md` y crear los specs retroactivos.
5. Spec del agente propio de Interforma reutilizando la arquitectura de `docs/agentes/arquitectura.md`.
