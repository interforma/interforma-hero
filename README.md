# Interforma Digital

Sitio web de [Interforma](https://interforma.digital) — consultora de transformación digital para empresas medianas en Chile.

## Stack

- **Framework:** [Astro](https://astro.build) 4.16.x, salida estática (ADR-001, ADR-008)
- **Runtime:** Node 20 (ADR-007) · **pnpm ≥ 10** (el `pnpm-workspace.yaml` usa `allowBuilds`)
- **Deploy:** [Vercel](https://vercel.com)
- **Estilos:** CSS nativo con variables (ADR-006); tokens en `src/styles/tokens.css`
- **Tipografía:** Outfit (titulares), Manrope (cuerpo) y JetBrains Mono (datos), autoalojadas (ADR-009)
- **Analytics:** GA4 + Microsoft Clarity + Metricool (ver `.interforma/ANALYTICS.md`)

## Estructura

```
src/
├── components/     # base/, composite/, layout/ (Header, Footer), utility/ (SEO, JSON-LD, WhatsApp)
├── config/         # site, navigation, content (copy), typography
├── layouts/        # Base.astro: SEO, analytics, tipografía activa
├── lib/            # analytics/, motion/, animations/, punto.ts (mascota)
├── pages/          # index, metodo, agentes, agentes/flujo, privacidad, 404
├── sections/       # Secciones del home y agentes/ (secciones de /agentes)
└── styles/         # reset, tokens, global, utilities, punto

public/
├── diagramas/      # Diagramas interactivos (noindex): método y agente de WhatsApp
├── marca/          # Isotipo en SVG, PNG y GIF animado
├── fonts/          # Fuentes de marca
├── informes/       # Informes mensuales de clientes (ver ADR-011)
├── propuestas/     # Propuestas comerciales (ver ADR-011)
├── clientes/       # Paneles y landings de clientes (ver ADR-011)
└── llms.txt        # Descripción para buscadores de IA (GEO)

design/
├── tokens/         # Design tokens en JSON
└── motion/         # Motor de animación y piezas de redes (ver su README)

docs/               # Estado del proyecto y documentación de Interforma Agents
specs/              # Especificaciones (SDD: ver README-SDD.md)
prompts/            # Prompt Library
handoff/            # Brief de diseño y moodboards
email-signature/    # Firmas de correo HTML
scripts/            # Utilidades (GIF del isotipo)
.interforma/        # ADN, método, decisiones, roadmap, SEO/GEO, analytics, changelog
```

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm build          # genera dist/ y el sitemap
pnpm check          # astro check (TypeScript estricto)
```

Copia `.env.example` a `.env.local` y completa las variables necesarias.

## Deploy

El sitio se despliega automáticamente en Vercel al hacer push a `main`. Cada PR genera un preview.

## Documentación

| Documento | Para qué |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Estándar de ingeniería y Definition of Done |
| [`PRODUCT.md`](./PRODUCT.md) | Usuarios, posicionamiento y conversión |
| [`DESIGN.md`](./DESIGN.md) | Sistema visual (ver bloque Identidad 2026) |
| [`docs/estado-proyecto.md`](./docs/estado-proyecto.md) | Estado actual, pendientes y prioridades |
| [`docs/agentes/`](./docs/agentes/) | Interforma Agents: arquitectura, piloto y sitio |
| [`.interforma/`](./.interforma/) | Decisiones, roadmap, analytics, SEO/GEO, changelog |
| [`README-SDD.md`](./README-SDD.md) | Flujo de specs antes de implementar |

---

**Contacto:** +56 9 8540 8771 (WhatsApp)
