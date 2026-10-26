# Roadmap Interforma.digital

**Última revisión:** 2026-10-26 · ✅ hecho · 🟡 en curso · ⬜ pendiente

## Sprint 0 — Recuperar presencia online

- ✅ MVP funcional.
- ✅ Hero, método, problemas, CTA y footer.
- ✅ Preview en Vercel.
- 🟡 Arquitectura aprobada (no existe `docs/01-product-architecture.md`).
- 🟡 QA básico (sin checklist ni CI de calidad).
- 🟡 Cambio de DNS (el sitio se sirve desde Vercel; falta dejar constancia).
- 🟡 Validación y rollback disponible (sin registro del estado de Firebase).
- ⬜ Diagnóstico como flujo propio en el sitio (hoy es una conversación por WhatsApp).

## Sprint 1 — Medición y optimización

- ✅ Analytics base (GA4, Clarity, scroll, Metricool).
- 🟡 Eventos del embudo (faltan CTA de Hero, CTA final, `WhatsAppButton`, nav desktop y `/agentes`).
- ✅ SEO técnico (sitemap automático, canonical, JSON-LD) · 🟡 convención de barra final.
- ✅ GEO inicial (`llms.txt`).
- ⬜ Ajustes de conversión con datos.
- 🟡 Casos o escenarios por industria (sectores y piezas «Punto en acción»; faltan casos reales).

## Sprint 2 — Automatización comercial

La pila ya existe y opera para un cliente (ver `docs/agentes/`). Falta aplicarla a Interforma.

- ⬜ n8n para el agente propio de Interforma.
- ⬜ Registro de leads.
- ⬜ WhatsApp empresarial (número propio en Meta Cloud API).
- ⬜ Agenda (Cal.com).
- ⬜ Resumen contextual del diagnóstico.
- ⬜ CRM o Notion como backend operativo.

## Sprint 3 — Escala

- 🟡 Biblioteca de contenidos (serie animada de Punto en `design/motion/`).
- ⬜ Casos de éxito.
- 🟡 Páginas por problema e industria (`/metodo`, `/agentes`, `/agentes/flujo`; faltan las de industria).
- ⬜ RAG o asistentes.
- ⬜ Portal de leads o clientes (relacionado con ADR-011).
