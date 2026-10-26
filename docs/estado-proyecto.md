# Estado del proyecto — interforma.digital

**Fecha del análisis:** 2026-10-26
**Base:** `main` @ `5f97aef` (Motion: El barrio de Punto · Ep. 01) + correcciones de la rama `docs/estado-y-agentes-2026-10-26`
**Análisis anterior:** 2026-10-02 @ `7dc7d30`. Este documento lo reemplaza.
**Validación ejecutada:** `pnpm build` ✅ (6 páginas) · `pnpm check` ✅ (0 errores, 0 warnings) · capturas de las páginas y documentos con Playwright, sin errores de JavaScript.

---

## 1. Resumen ejecutivo

Desde el 2 de octubre se cerró casi toda la deuda técnica (0 errores de tipos, código legado eliminado, sitemap automático, navegación multipágina) y el sitio creció: nuevas páginas `/metodo` y `/agentes/flujo`, identidad de marca 2026 (paleta Energía, isotipo Transforma animado, Punto como mascota), píxel de Metricool y un motor de animación para las piezas de redes.

En esta rama se corrigieron además los cuatro hallazgos del análisis:

| Hallazgo | Corrección |
|---|---|
| Documentos de clientes públicos e indexables | `noindex` en meta y header `X-Robots-Tag` para `/informes`, `/propuestas`, `/clientes` y `/agente-medic-home` |
| CTA de `/agentes` a `mailto:hola@interforma.ai`, sin tracking | «Agendar piloto» → agenda Cal.com; «Hablar con ventas» → WhatsApp; todos con eventos |
| URLs con y sin barra final mezcladas | Convención única **sin barra** en Astro, Vercel, sitemap y canonicals |
| `DESIGN.md` contradictorio y restos del sistema anterior | `DESIGN.md` reescrito; identidad 2026 aplicada en el sitio, los componentes, los informes y las propuestas |

| Área | Estado |
|---|---|
| Sitio en producción (home, `/metodo`, `/agentes`, `/agentes/flujo`) | 🟢 Listo |
| Calidad de código (TS estricto) | 🟢 0 errores en `astro check` |
| Identidad 2026 y sistema de diseño | 🟢 Aplicada y documentada en todo el sitio y los documentos de Interforma |
| SEO técnico / GEO | 🟢 Sitemap, canonicals y redirect alineados; `llms.txt` con todas las páginas |
| Analytics | 🟢 Todos los CTA con evento |
| Privacidad de activos de clientes | 🟡 Fuera de buscadores; siguen en un repo público (ADR-011) |
| Proceso SDD / gobierno | 🟡 Documentación al día; specs y arquitectura siguen abiertos |
| Interforma Agents | 🟢 Referencia en producción con un cliente · ⚪ sin agente propio |
| Motion y contenido de redes | 🟢 Motor y fuentes versionados |
| Automatización comercial propia (Sprint 2) | ⚪ No iniciado |

---

## 2. ✅ Qué está listo

### Infraestructura y stack
- **Astro 4.16.x** estático (ADR-001, ADR-008), **Node 20** (ADR-007), **pnpm ≥ 10** (el `pnpm-workspace.yaml` usa `allowBuilds`).
- **Vercel** (ADR-002) con headers de seguridad, `trailingSlash: false` y `X-Robots-Tag` para documentos de clientes.
- **URLs sin barra final:** `trailingSlash: 'never'` en `astro.config.mjs`; sitemap, canonicals y `llms.txt` coinciden.
- **`@astrojs/sitemap` 3.2.1** genera `sitemap-index.xml` y `sitemap-0.xml` con las 5 páginas indexables. Ya no hay sitemap estático en `public/`.
- CSS nativo con variables (ADR-006). Fuente de verdad de color: bloque *IDENTIDAD 2026* de `src/styles/tokens.css`.

### Páginas
| Ruta | Contenido | Desde |
|---|---|---|
| `/` | Hero, Capacidades, Problemas, Método (con botón a `/metodo`), Servicios, Agentes (con botones a `/agentes` y `/agentes/flujo`), Sectores, CTA | rediseño D/E |
| `/metodo` | Diagrama interactivo del método (Archify, iframe), detalle de las 6 etapas, JSON-LD `HowTo` | PR #6 · 13-oct |
| `/agentes` | Landing de Interforma Agents (8 secciones). CTA a Cal.com y WhatsApp | PR #3 · 1-oct |
| `/agentes/flujo` | Diagrama del agente de WhatsApp, 8 pasos, estados, JSON-LD `HowTo` | PR #7 · 13-oct |
| `/privacidad`, `/404` | Política de privacidad y página 404 con Punto en estado «uy» | — |

### Limpieza técnica (PR #4 · 2-oct)
- Eliminados los componentes legados del diseño anterior (19 errores de tipos).
- Tipos anotados en la demo de `AgentsSection` (17 errores).
- `SectionHeading` acepta `id` y `as`; se repararon los `aria-labelledby` de Método, Sectores y CTA.
- Nav y footer usan `/#seccion` y enlazan a `/agentes`.

### Identidad 2026 (PR #8–#11 y esta rama)
- Paleta **Energía `#EE6E43`** + neutros piedra cálida; **Outfit**, **Manrope** y **JetBrains Mono** autoalojadas. Se retiraron Plus Jakarta Sans, Inter y Host Grotesk del código y de las dependencias.
- Isotipo **Transforma** animado y logotipo «interforma» en minúsculas; **Punto** como mascota.
- Botones unificados: primario Energía con texto Umbra; sobre superficies Energía, primario Umbra; foco en Energía 800 en todos los componentes; sin esquinas rectas.
- Paneles oscuros y fallbacks de la demo de Agentes con la paleta cálida (sin grises fríos).
- **Documentos de Interforma** (informes, plantilla, propuestas de F5 y Medic-Home) con la marca vía `public/marca/interforma-docs.css`: fuentes propias, sin Google Fonts, colores y gráficos de marca.
- `DESIGN.md` reescrito como referencia única; `PRODUCT.md` y el brief de handoff marcados como actualizados o históricos.

### SEO y medición
- JSON-LD en home (`Organization`, `ProfessionalService`, `WebSite`), `/metodo` y `/agentes/flujo` (`HowTo`).
- `llms.txt` con todas las páginas principales.
- Diagramas en `/diagramas/` con `noindex` y canonical a su página.
- GA4 (condicional), Microsoft Clarity y Metricool en `Base.astro`.
- **Eventos en todos los CTA:** Hero, CTA final, header (desktop y móvil), `WhatsAppButton`, `/agentes` y botones del home hacia `/agentes` y `/agentes/flujo`. Catálogo en `.interforma/ANALYTICS.md`.

### Motion y redes (PR #12, #14–#16)
`design/motion/`: motor SVG + Playwright + ffmpeg + música original en Python. Serie de Punto (La semilla, Cap. 03–05, Método, «Punto en acción», *El barrio de Punto · Ep. 01*), portadas y stickers.

### Activos de clientes y comerciales en `public/`
| Ruta | Qué es | Indexación |
|---|---|---|
| `/informes/grupo-borie/*`, `/informes/_template/` | Informes mensuales y plantilla | `noindex` |
| `/propuestas/f5/` | Propuesta comercial de F5 Estudio Contable | `noindex` |
| `/clientes/gatica-property/` | Panel, plan y landing «Las Rocas» (marca del cliente) | `noindex` |
| `/agente-medic-home/` | Propuesta de asistente de WhatsApp para Medic-Home | `noindex` |

### Documentación
`docs/agentes/` (arquitectura, oferta y piloto, mapa en el sitio), este documento, `DESIGN.md`, `README.md` y `.interforma/` (CHANGELOG, DECISIONS con ADR-009 a ADR-011, ROADMAP, ANALYTICS).

---

## 3. 🟡 Qué está en progreso / parcial

| Tema | Situación | Evidencia |
|---|---|---|
| **Documentos de clientes en repo público** | Ya no se indexan, pero siguen accesibles con el enlace y visibles en GitHub (el informe de octubre incluye el monto facturado). Falta decidir si se mueven a un repo privado o a un portal con acceso. | ADR-011 |
| **Agenda de Cal.com** | El enlace viene de la configuración de Interforma; conviene abrirlo en el preview de Vercel y confirmar que es el evento correcto. Se puede cambiar con `PUBLIC_CAL_URL`. | `src/config/site.ts` |
| **Landing «Las Rocas»** | Quedó con `noindex` junto al resto de `/clientes`. Si se quiere tráfico orgánico para esa propiedad, hay que excluirla. | `public/clientes/gatica-property/lasrocas.html` |
| **Voz** | `/agentes` usa «tú»; el resto del sitio, los documentos y el agente en producción usan «usted». | `src/sections/agentes/*` |
| **Alcance comunicado de Agents** | El flujo público muestra postventa, encuesta y remarketing; en la implementación real están en preparación. La «app del operador iOS» es un concepto. | `docs/agentes/README.md` |
| **Copy y headline A/B** | Copy marcado como provisional; decisión de headline abierta. | `src/config/content.ts`, `PRODUCT.md` |
| **Specs** | `SPEC-001` en *Draft* con alcance y eventos que no existen; no hay specs de `/metodo`, `/agentes` ni `/agentes/flujo`. | `specs/` |
| **Migración Firebase / DNS** | Sin registro del cambio de DNS ni del retiro de Firebase (ADR-003, ADR-004). | `.interforma/DECISIONS.md` |

---

## 4. 🔴 Qué falta por hacer

### Prioridad alta
1. **Decidir ADR-011:** mover informes y propuestas de clientes fuera del repo público.
2. **Revisar el preview de Vercel** de esta rama: agenda Cal.com, botones y documentos con la nueva marca.

### Prioridad media
3. Voz única (usted) en `/agentes`.
4. JSON-LD `Service` para `/agentes`.
5. Specs retroactivos de `/metodo`, `/agentes` y `/agentes/flujo`; actualizar `SPEC-001`.
6. `docs/01-product-architecture.md` (o la arquitectura vigente) y cierre de PROMPT-002 a 007.
7. Registrar el cambio de DNS y el estado de Firebase.
8. Copy definitivo, headline y casos reales con autorización y métricas verificables.
9. **Agente propio de Interforma** reutilizando `docs/agentes/arquitectura.md`.

### Prioridad baja
10. Validación automática por PR (Lighthouse/axe en CI o checklist).
11. Fijar pnpm con `packageManager` en `package.json`.
12. Reducir los aliases históricos de `tokens.css` (`--agents-*`, `--primary-*`, `--cj-*`) a los tokens de marca.

---

## 5. Roadmap: posición actual

| Sprint | Estado |
|---|---|
| **Sprint 0 — Recuperar presencia online** | 🟢 Completo en la práctica. Falta dejar constancia del DNS y del rollback. |
| **Sprint 1 — Medición y optimización** | 🟢 Casi completo: SEO técnico, GEO, analytics con eventos en todos los CTA, Metricool. Faltan casos por industria y ajustes de conversión con datos. |
| **Sprint 2 — Automatización comercial** | ⚪ No iniciado para Interforma. La pila existe y opera para un cliente (n8n, WhatsApp Cloud API, Chatwoot, CRM Twenty). |
| **Sprint 3 — Escala** | 🟡 Adelantado: `/agentes`, `/agentes/flujo`, `/metodo` y la serie animada de Punto. Faltan casos de éxito, páginas por industria y RAG. |

---

## 6. Cumplimiento de `AGENTS.md` (Definition of Done)

| Criterio | Estado | Nota |
|---|---|---|
| Funciona | ✅ Cumple | Build OK, 6 páginas |
| Comprensible | ✅ Cumple | Secciones y páginas bien separadas |
| Responsive | ✅ Cumple | — |
| Accesible | 🟡 Parcial | Foco visible unificado, reduced motion respetado; falta auditoría formal |
| Documentada | ✅ Cumple | `DESIGN.md`, estado, ADR, analytics y Agents al día; specs pendientes |
| Pruebas / validación explícita | 🟡 Parcial | `astro check` limpio y capturas manuales; sin CI de calidad |
| Sin regresiones conocidas | ✅ Cumple | — |
| TypeScript estricto | ✅ Cumple | 0 errores |
| CTA con tracking | ✅ Cumple | Ver `.interforma/ANALYTICS.md` |
| Sin secretos en repo | ✅ Cumple | IDs públicos de Clarity y Metricool; ningún token. Datos comerciales de clientes: ver ADR-011 |

---

## 7. Próximos pasos recomendados

1. Revisar el preview de Vercel y mezclar la rama.
2. Decidir ADR-011 (repo privado o portal para documentos de clientes).
3. Unificar la voz de `/agentes` y agregar su JSON-LD.
4. Specs retroactivos y arquitectura de producto.
5. Spec del agente propio de Interforma.
