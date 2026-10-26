# Changelog

Registro de cambios por fecha. Para el detalle, ver el PR indicado.

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
