# Changelog

Registro de cambios por fecha. Para el detalle, ver el PR indicado.

## 2026-10-28 — Caso Grupo Borie con sus marcas

- Tarjeta de Grupo Borie con cápsulas a bmgroup.cl, agenciaborie.cl, firstcargo.cl y bmtransport.cl («Sitios construidos por Interforma»).
- Nueva página `/casos/grupo-borie` con franja de logos en monocromo Umbra y enlace a cada sitio.
- Campo `sitios` en la colección; `antes` y `ahora` pasan a ser opcionales.

## 2026-10-28 — Casos y testimonios

- **Nueva sección Casos** en la home (`/#casos`), listado en `/casos` y página de caso en `/casos/first-cargo`; «Casos» en la navegación.
- Colección de contenido `casos` (YAML en `src/content/casos/`) con formato único: tipo, estado, título de resultado, cliente · sector, prueba verificable, stack y enlace. Reglas en `.interforma/CASOS.md`.
- Seis casos: First Cargo (agente), F5 Contadores (web, fase 2 desde noviembre), Grupo Borie (marketing), Medic-Home (agente en desarrollo), portal de reportes (datos) y app de entrenamiento (beta).
- Testimonios con aprobación del cliente: el borrador de First Cargo queda guardado y oculto hasta que se apruebe.
- Eventos `case_filter`, `case_open` y `case_site_open`; `llms.txt` con `/casos`; datos estructurados `ItemList` y `CreativeWork`.

## 2026-10-26 — Identidad 2026 en todo y correcciones

- **Sistema de diseño:** `DESIGN.md` reescrito con la identidad 2026; fuentes Plus Jakarta Sans, Inter y Host Grotesk retiradas (código y dependencias); botones primarios en Energía con texto Umbra en `Button` y `WhatsAppButton`; foco en Energía 800; botones de `/agentes` con radio de marca; grises fríos reemplazados en Método y en la demo de Agentes.
- **Documentos de Interforma** (informes, plantilla, propuestas F5 y Medic-Home): nueva hoja `public/marca/interforma-docs.css` con fuentes autoalojadas y tokens; sin Google Fonts; colores y gráficos de marca. Se corrigió la lista del plan en la propuesta de F5.
- **Privacidad:** `noindex` (meta + `X-Robots-Tag`) en `/informes`, `/propuestas`, `/clientes` y `/agente-medic-home`.
- **Conversión de `/agentes`:** «Agendar piloto» → Cal.com; «Hablar con ventas» → WhatsApp con mensaje sobre el piloto.
- **Tracking** en todos los CTA: Hero, CTA final, nav desktop, `WhatsAppButton`, `/agentes` y botón «Ver Interforma Agents».
- **SEO:** URLs sin barra final en Astro, Vercel, sitemap y canonicals; sitemap estático eliminado; `llms.txt` con `/metodo`, `/agentes` y `/agentes/flujo`.

## 2026-10-26 — Documentación al día

- Actualizado `docs/estado-proyecto.md` al commit `5f97aef`.
- Nueva carpeta `docs/agentes/`: arquitectura del agente de WhatsApp, oferta y piloto de 30 días, y mapa de Interforma Agents en el sitio.
- `DECISIONS.md`: ADR-009 (identidad 2026), ADR-010 (arquitectura de Interforma Agents) y ADR-011 (activos de clientes en `public/`).
- `ROADMAP.md` con estado por ítem; `ANALYTICS.md` con el catálogo de eventos real; `README.md` con la estructura vigente.

## 2026-10-26 — Motion (PR #14, #15, #16)

- Motor de animación con escenarios del barrio de Punto; reels del Método, «Punto en acción» (clínica y automotora), Cap. 03 y Cap. 05; portadas de grilla.
- *El barrio de Punto · Ep. 01* (Doña Rosa).
- Fuentes OFL versionadas en `design/motion/fonts/`.

## 2026-10-20 — SEO y Metricool (PR #13)

- Píxel de Metricool en `Base.astro`.
- Redirect 301 `/agentes/` → `/agentes` en `vercel.json`.
- `public/sitemap-0.xml` estático (redundante con `@astrojs/sitemap`; ver estado del proyecto).

## 2026-10-15 — Marca (PR #9 a #12)

- Isotipo Transforma animado en header y footer.
- Firma de correo con isotipo animado (GIF).
- Punto, la mascota: 8 expresiones, avatar del agente, saludo junto al botón de WhatsApp y 404.
- `design/motion/`: fuentes de las animaciones de marca.

## 2026-10-14 — Identidad 2026 (PR #8)

- Paleta Energía, neutros piedra cálida, tipografías Outfit, Manrope y JetBrains Mono, isotipo Transforma y logotipo en minúsculas. Solo capa visual.

## 2026-10-13 — Método, flujo del agente y F5 (PR #6, #7)

- Página `/metodo` con diagrama interactivo, detalle de 6 etapas y JSON-LD `HowTo`.
- Página `/agentes/flujo` con el diagrama del agente de WhatsApp, 8 pasos y estados de conversación.
- Diagramas en `/diagramas/` con `noindex` y modo «Activa» por defecto.
- Propuesta comercial de F5 Estudio Contable en `/propuestas/f5/`.

## 2026-10-09 — Informes

- Informe Grupo Borie septiembre–octubre 2026.

## 2026-10-02 — Limpieza técnica (PR #4, #5)

- 0 errores de tipos: eliminados componentes legados y anotados los tipos de la demo de Agentes.
- `@astrojs/sitemap` activo; navegación multipágina con `/#seccion` y enlace a `/agentes`.
- «Ver Interforma Agents» enlaza a `/agentes`.
- Primer `docs/estado-proyecto.md`.

## 2026-10-01 — Interforma Agents (PR #3)

- Página `/agentes` con 8 secciones.

## 2026-09-29 — Rediseño D y E

- Home rearmada por secciones en `src/sections/` (Hero, Capacidades, Problemas, Método, Servicios, Agentes, Sectores, CTA).
- Acento naranja para Agents, demo animada del operador y wordmark en minúsculas.
- Fix de LCP y de overflow en móvil.

## 2026-08 — Activos y SEO

- Página de propuesta `agente-medic-home`, plan y landing de Gatica Property, informe y plantilla de Grupo Borie.
- Animación del método por scroll, ajustes de SEO (canonical, OG, JSON-LD) y página 404.

## 2026-07-31 — v0.1

- Creado estándar AGENTS.
- Creado ADN del repositorio.
- Documentado Método Interforma.
- Definido sistema visual inicial.
- Definido estándar SEO y GEO.
- Creado índice de Prompt Library.
- Registradas decisiones iniciales.
- Creado roadmap del producto.
