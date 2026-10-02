# Estado del proyecto — interforma.digital

**Fecha del análisis:** 2026-10-02
**Rama / commit:** `main` @ `7dc7d30` (feat: nueva página /agentes)
**Fuentes revisadas:** `CLAUDE_START_HERE.md`, `AGENTS.md`, `DESIGN.md`, `PRODUCT.md`, `README.md`, `README-SDD.md`, `.interforma/*`, `specs/`, `prompts/`, `src/`, `public/`, configuración (`astro.config.mjs`, `vercel.json`, `.env.example`) e historial de git.
**Validación ejecutada:** `pnpm build` ✅ (4 páginas generadas) · `astro check` ❌ (39 errores de tipos, 0 warnings).

---

## 1. Resumen ejecutivo

El sitio está **publicado y funcional**: es una landing estática en Astro 4.16 desplegada en Vercel, con la home rediseñada (iteraciones D y E), una nueva página `/agentes` (Interforma Agents), `/privacidad` y `404`. GA4 y Clarity están integrados, y la base de SEO/GEO está bien cubierta (metadata, canonical, OG, JSON-LD y `llms.txt`).

El proceso, en cambio, va por detrás del código. El flujo que plantea `CLAUDE_START_HERE.md` (PROMPT-001 → arquitectura aprobada → backlog → PROMPT-002…) nunca se cerró formalmente: no existe `docs/01-product-architecture.md`, `SPEC-001` sigue en *Draft* y PROMPT-002 a 007 están en *Pendiente*. Además hay **deuda técnica acumulada**: componentes legados huérfanos, errores de TypeScript, un sitemap estático desactualizado y CTA sin tracking. Esto choca con la Definition of Done de `AGENTS.md`.

| Área | Estado |
|---|---|
| Sitio en producción (home + /agentes) | 🟢 Listo |
| Sistema de diseño (tokens, tipografía, componentes base) | 🟢 Listo · 🟡 `DESIGN.md` no refleja el rediseño E |
| SEO técnico / GEO | 🟢 Mayormente listo · 🔴 sitemap desactualizado |
| Analytics | 🟡 Parcial: infraestructura lista, cobertura de eventos incompleta |
| Calidad de código (TS estricto, limpieza) | 🔴 39 errores en `astro check` y código muerto |
| Proceso SDD / documentación de gobierno | 🔴 Arquitectura, specs y backlog sin cerrar |
| Contenido (copy, casos reales) | 🟡 Copy provisional, sin casos ni testimonios |
| Automatización comercial (Sprint 2) | ⚪ No iniciado (correcto según ADR-005) |

---

## 2. ✅ Qué está listo

### Infraestructura y stack
- **Astro 4.16.x** con salida `static` (ADR-001 y ADR-008), **Node 20** fijado en `.nvmrc` y `engines` (ADR-007), y pnpm como gestor.
- **Vercel** como plataforma de deploy (ADR-002), con headers de seguridad en `vercel.json` (`nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`).
- **Estilos:** CSS nativo con variables (ADR-006): `reset.css`, `tokens.css`, `global.css` y `utilities.css`. Tokens JSON en `design/tokens/` (colores, tipografía, espaciado, radios, sombras y motion).
- `.env.example` documentado y sin secretos en el repositorio.
- El build compila sin errores y genera `/`, `/agentes/`, `/privacidad/` y `/404.html`.

### Home (`src/pages/index.astro`): rediseño D + E
Secciones ensambladas en `src/sections/`:
1. `HeroSection`: H1, CTA a WhatsApp y CTA secundario «Ver el método».
2. `CapabilitiesSection`: flujo de 5 capacidades animado.
3. `ProblemsSection`: 6 tarjetas «¿Le suena familiar?».
4. `MethodSection`: panel oscuro con las 6 etapas, rombo naranja por paso y leyenda de puertas de decisión.
5. `ServicesSection`: grilla de módulos y franja de Agentes de IA.
6. `AgentsSection`: hitos y demo animada del operador (JS puro).
7. `SectorsSection`: salud, logística y servicios profesionales.
8. `CtaSection`: CTA azul final (`#contacto`).

Layout común: `Header` (pill, menú móvil), `Footer` rediseñado, `WhatsAppFloat` (FAB), `SkipToContent` y `SEOHead`.

### Página `/agentes` (PR #3, 2026-10-01)
Ocho secciones en `src/sections/agentes/`: Hero, Stats, Demo animada, Cómo funciona, Integración y seguridad, App del operador, Día 30 (puerta de decisión) y CTA.

### SEO / GEO
- `SEOHead` con title, description, canonical, Open Graph, Twitter Card y soporte de `noindex` (aplicado en 404).
- JSON-LD en la home: `Organization`, `ProfessionalService` (con `OfferCatalog` de 6 servicios) y `WebSite`, lo que cubre lo pedido en `.interforma/SEO_GEO.md`.
- `public/llms.txt` con descripción de la empresa, servicios y método (orientado a GEO).
- `robots.txt`, `og-image.png` y `favicon.svg`.
- `lang="es"` y locale `es_CL`.

### Analytics
- Dispatcher desacoplado `src/lib/analytics/track.ts` (logs en consola en dev, `gtag` en prod y no-op si falta GA4).
- Scroll tracking 25/50/75/90 (`scroll.ts`) inicializado en `Base.astro`.
- GA4 inyectado condicionalmente vía `PUBLIC_GA4_MEASUREMENT_ID`, más Microsoft Clarity.
- Eventos del `Header` (nav y WhatsApp) y del FAB de WhatsApp.

### Accesibilidad y performance
- Skip-to-content, foco visible global y soporte de `prefers-reduced-motion`.
- Fix de LCP (animaciones *visible-first* con `animations-ready`).
- Fix de zoom/overflow en móvil corregido en su causa raíz (`AgentsSection`).

### Activos complementarios (fuera del sitio principal)
- `public/agente-medic-home/`: página estática de demo.
- `public/clientes/gatica-property/`: plan de marketing y landing «Las Rocas».
- `public/informes/`: plantilla de informe mensual e informe Grupo Borie (sept 2026).
- `email-signature/`: firmas HTML v1 y v2.
- `handoff/`: brief de diseño, moodboards y referencias de Cal.com.

### Gobierno del proyecto
- `AGENTS.md` (estándar de ingeniería), `.interforma/ADN.md`, `METHOD.md`, `DECISIONS.md` (ADR-001 a 008), `ROADMAP.md`, `SEO_GEO.md` y `ANALYTICS.md`.
- `DESIGN.md` y `PRODUCT.md` con el contexto de diseño y de producto.

---

## 3. 🟡 Qué está en progreso / parcial

| Tema | Situación actual | Evidencia |
|---|---|---|
| **Rediseño E (acento naranja «Agents»)** | Implementado en código (`--agents-*` en `tokens.css`), pero `DESIGN.md` todavía declara la *One Accent Rule* (azul como único acento) y no menciona el naranja ni el wordmark en minúsculas. | `src/styles/tokens.css:32-44` vs `DESIGN.md` §Colors |
| **Copy** | Marcado como provisional y pendiente de aprobación del equipo. | `src/config/content.ts:2-3`, `PRODUCT.md` |
| **Decisión de headline A/B** | Sigue abierta. | `PRODUCT.md` → `content.ts › headlineAlternatives` |
| **Tracking de CTA** | La infraestructura está lista, pero los CTA de WhatsApp de `HeroSection` y `CtaSection` (rediseño D) no llaman a `track()`. Los CTA y mailto de `/agentes` tampoco tienen eventos. `AGENTS.md` exige «no agregar CTA sin tracking previsto». | `grep track src/sections` → sin resultados |
| **Catálogo de eventos** | `ANALYTICS.md` documenta `hero_cta`, `click_secondary_cta`, `contact_start`, etc., que hoy vivían en los componentes legados (`src/components/sections/*`) que ya no se usan. El catálogo no refleja lo que realmente se envía. | `.interforma/ANALYTICS.md` |
| **Página `/agentes`** | Publicada, pero: no está enlazada desde la nav ni la home (solo existe el ancla `#agentes`); usa el email `hola@interforma.ai` mientras `PRODUCT.md` dice que el email está pendiente y el dominio es `.digital`; el tono es «tú» frente al «usted» del resto del sitio; no tiene JSON-LD. | `src/sections/agentes/CtaAgentes.astro:13,21`, `src/pages/agentes.astro` |
| **Navegación entre páginas** | La nav y el footer usan anclas relativas (`#metodo`, `#servicios`, `#contacto`). En `/agentes` y `/privacidad` esas anclas no existen, así que los enlaces no llevan a la home. | `src/config/navigation.ts`, `src/components/layout/Footer.astro:17-19` |
| **Spec de homepage** | `SPEC-001` sigue en *Draft* y su alcance (incluye «Diagnóstico» y «Soluciones») y sus eventos (`view_home`, `start_diagnostic`, `complete_diagnostic`) no coinciden con lo implementado. | `specs/001-homepage.md` |
| **Migración Firebase → Vercel** | El sitio ya se sirve desde Vercel, pero el repo no registra si el DNS se cambió, si Firebase se retiró ni si existe una ruta de rollback documentada (ADR-003 y ADR-004). | `.interforma/DECISIONS.md` |

---

## 4. 🔴 Qué falta por hacer

### Prioridad alta: calidad y consistencia
1. **Corregir los 39 errores de `astro check`.** `AGENTS.md` exige TypeScript estricto.
   - `src/sections/AgentsSection.astro`: 17 errores (parámetros `any`, `.style` sobre `Element`, `root`/`canvas` posiblemente `null`).
   - `src/sections/MethodSection.astro`, `CtaSection.astro` y `SectorsSection.astro`: 1 cada uno (props de `SectionHeading`).
   - El resto pertenece a componentes legados (ver punto 2).
2. **Eliminar o archivar el código muerto del diseño anterior.** No se importa en ninguna página:
   - `src/components/sections/{Hero,Method,Problems,Bridge,CTA,Contact}Section.astro`
   - `src/components/composite/NavLink.astro`
   - `src/components/visual/{MethodSystemDiagram,DiagnosticWidget,DiagnosticFlowDiagram}.astro`
   - `src/components/background/HeroBackground.astro`, `src/components/base/CornerMarks.astro`, `src/lib/halftone.ts` (solo los usan los legados)

   Esto elimina 19 de los 39 errores y simplifica el repositorio.
3. **Sitemap.** `public/sitemap-0.xml` es un archivo estático que no incluye `/agentes`. `@astrojs/sitemap` está instalado pero no configurado en `astro.config.mjs`. Hay que activar la integración y borrar los XML estáticos.
4. **Tracking de CTA** en Hero, CTA final y `/agentes` mediante `track()`, y actualizar `.interforma/ANALYTICS.md` con el catálogo real.
5. **Navegación multipágina:** usar `/#metodo` en lugar de `#metodo` y agregar el enlace a `/agentes` en la nav y el footer.

### Prioridad media: documentación y proceso (SDD)
6. **Arquitectura de producto:** crear `docs/01-product-architecture.md` (resultado de PROMPT-001) o documentar retroactivamente la arquitectura vigente.
7. **Specs:** actualizar `SPEC-001` al estado real y crear un `SPEC-002` para `/agentes`. `README-SDD.md` indica que no se implementa sin spec aprobado.
8. **ADR nuevos** en `DECISIONS.md`: rediseño D/E y segundo acento naranja, página `/agentes` y su marca, y alojamiento de páginas de clientes e informes en `public/`.
9. **Actualizar `DESIGN.md`:** acento Agents, wordmark en minúsculas y paneles oscuros del rediseño D/E.
10. **Actualizar `.interforma/CHANGELOG.md`:** solo tiene la entrada v0.1 del 2026-07-31.
11. **Actualizar `README.md`:** menciona `src/content/` y `docs/`, que no existían, y omite `src/sections/`.
12. **Prompt Library:** PROMPT-002 (UX/UI) a PROMPT-007 siguen pendientes.

### Prioridad media: contenido y marca
13. Aprobar el copy definitivo y cerrar la decisión del headline A/B.
14. Unificar la voz (usted vs. tú) entre la home y `/agentes`.
15. Definir el email oficial (`.digital` vs. `.ai`) y completar `PUBLIC_CONTACT_EMAIL`.
16. Incorporar casos reales con métricas y testimonios (`PRODUCT.md` › Evidence on Hand) sin fabricar datos.
17. Revisar si las páginas de clientes (`/clientes/gatica-property`) e informes (`/informes/grupo-borie`) deben ser públicas e indexables. Hoy se sirven como estáticos sin `noindex`.

### Prioridad baja: QA
18. Ninguna página tiene pruebas automatizadas. Falta definir una validación explícita (Lighthouse/axe en CI o un checklist de QA por PR) para cumplir la Definition of Done.
19. Hay que verificar el contraste de la escala naranja (`--agents-*`) sobre fondos claros, según las notas de `tokens.css`.

---

## 5. Roadmap: posición actual

| Sprint (`.interforma/ROADMAP.md`) | Estado |
|---|---|
| **Sprint 0 — Recuperar presencia online** | 🟢 Prácticamente completo (sitio en Vercel). Pendiente: confirmar formalmente el DNS, el rollback y la «arquitectura aprobada». |
| **Sprint 1 — Medición y optimización** | 🟡 En curso. Analytics, SEO técnico y GEO inicial hechos; sectores incorporados. Faltan eventos de embudo completos, ajustes de conversión con datos y casos por industria. |
| **Sprint 2 — Automatización comercial** | ⚪ No iniciado: n8n, registro de leads, WhatsApp Business, agenda y CRM/Notion. |
| **Sprint 3 — Escala** | ⚪ No iniciado: páginas por problema e industria (`/metodo`, `/sectores/salud`…), casos, recursos y RAG. `/agentes` es la primera página de servicio y adelanta parte de este sprint. |

---

## 6. Cumplimiento de `AGENTS.md` (Definition of Done)

| Criterio | Estado | Nota |
|---|---|---|
| Funciona | ✅ Cumple | Build OK, sitio publicado |
| Comprensible | ✅ Cumple | Estructura clara por secciones |
| Responsive | ✅ Cumple | Mobile-first, fix de overflow aplicado |
| Accesible | 🟡 Parcial | Base sólida; falta auditoría formal (axe/Lighthouse) |
| Documentada | 🔴 Pendiente | `DESIGN.md`, `ANALYTICS.md`, specs y changelog desactualizados |
| Pruebas / validación explícita | 🔴 Pendiente | Sin tests; `astro check` falla |
| Sin regresiones conocidas | 🟡 Parcial | Anclas de nav rotas fuera de la home; sitemap sin `/agentes` |
| TypeScript estricto | 🔴 Pendiente | 39 errores |
| CTA con tracking | 🟡 Parcial | Header y FAB sí; Hero, CTA final y `/agentes` no |
| Sin secretos en repo | ✅ Cumple | Solo `.env.example`; el ID de Clarity es público |

---

## 7. Próximos pasos recomendados (orden sugerido)

1. Hacer limpieza técnica en un solo PR: borrar los componentes legados, corregir los errores de tipos restantes, activar `@astrojs/sitemap` y arreglar las anclas de navegación.
2. Agregar tracking a todos los CTA y sincronizar `ANALYTICS.md`.
3. Poner la documentación al día: ADR del rediseño D/E y `/agentes`, `DESIGN.md`, `CHANGELOG.md` y `SPEC-001`/`SPEC-002`.
4. Cerrar decisiones de contenido: copy definitivo, headline, voz, email e incorporación de casos reales.
5. Planificar Sprint 2 (automatización comercial) con un spec aprobado antes de implementar.
