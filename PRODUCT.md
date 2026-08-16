# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Decisores en empresas medianas chilenas — no hay un perfil único. Los perfiles identificados son:

- **Dueño o gerente general:** toma la decisión final de inversión; busca resultados medibles y adopción real.
- **Gerente de operaciones:** responsable de procesos; quiere resolver fricciones operativas concretas.
- **Director TI / tecnología:** evalúa proveedores y soluciones; necesita un interlocutor técnicamente solvente.

Todos comparten el mismo problema de fondo: proyectos de transformación digital que fallaron por adopción, no por tecnología.

## Product Purpose

Interforma es una consultora digital chilena que ayuda a empresas medianas a implementar transformación digital con resultados medibles. La propuesta no es vender tecnología — es diagnosticar procesos y diseñar soluciones que el equipo adopta.

El producto central es el **Método Interforma**: un proceso estructurado en seis etapas (Diagnóstico → Diseño → Implementación → Integración → Adopción → Optimización) que garantiza que el proceso manda y la herramienta sirve.

La acción de conversión es iniciar un diagnóstico gratuito de 30 minutos vía WhatsApp.

## Positioning

El diferenciador que ningún proveedor genérico puede copiar: **el proceso siempre precede a la tecnología**. Interforma no llega con una solución predefinida — primero mapea los procesos reales (no los ideales), luego diseña el flujo, y solo entonces elige e implementa la herramienta. Esto elimina el patrón más común de fracaso: digitalizar procesos mal definidos.

## Operating Context

- Mercado: empresas medianas en Chile
- Canal de contacto principal: WhatsApp (`+56 9 8540 8771`)
- Conversión: diagnóstico gratuito de 30 minutos → propuesta a medida
- El sitio es una landing page de una sola sección; sin app, sin área de clientes, sin formulario
- Voz: formal (usted) — validada por el copy del codebase, no confirmada explícitamente como compromiso de marca

## Capabilities and Constraints

- **Sitio:** landing page estática en Astro 4.16.19, desplegada en Vercel, dominio `interforma.digital`
- **Contacto:** WhatsApp como canal único activo; email pendiente de activación
- **Analytics:** GA4 (`G-JMXV5EVB59`) + Microsoft Clarity activos en producción
- **Copy:** marcado como provisional en el codebase — pendiente aprobación definitiva del equipo
- **Sin formulario de contacto** en el sitio actual
- **Decisión abierta:** headline A vs. B (`content.ts › headlineAlternatives`)

## Brand Commitments

- **Nombre:** "Interforma" — confirmado, definitivo
- Colores, tipografía (Host Grotesk) y tono formal: presentes en el codebase pero no confirmados explícitamente como inamovibles

## Evidence on Hand

- **Casos reales existen** con resultados medibles — confirmado por el equipo
- **No integrados al sitio aún** — no hay sección de testimonios ni casos de estudio en la implementación actual
- **Acción pendiente:** incorporar casos reales al sitio (testimonios, métricas, industrias)
- No fabricar testimonios, métricas ni nombres de clientes hasta que el equipo los entregue

## Product Principles

1. **Proceso primero, tecnología después.** El flujo de trabajo se diseña antes de tocar cualquier herramienta.
2. **Adopción como métrica de éxito.** Un sistema que nadie usa no es una implementación — es un gasto.
3. **Resultados medibles, no promesas vagas.** Cada etapa tiene entregables concretos y métricas definidas.
4. **Contexto antes de solución.** Interforma no llega con una herramienta predefinida; diagnostica primero.
5. **Transformación como proceso continuo.** La implementación no termina en el go-live — evoluciona.

## Accessibility & Inclusion

- `prefers-reduced-motion` respetado en todos los componentes animados
- Navegación con teclado y focus-visible implementados
- Skip-to-content activo
- Idioma: español (Chile) — `lang="es"`, `locale: es_CL`
