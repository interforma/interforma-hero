# Registro de Decisiones

## ADR-001 — Astro como framework principal

**Estado:** Aprobado
**Motivo:** sitio informativo, rendimiento, SEO y uso selectivo de JavaScript.
**Decisión:** Astro como base; React solo para componentes interactivos.

## ADR-002 — Vercel como despliegue

**Estado:** Aprobado
**Motivo:** previews, integración con GitHub y despliegue simple.

## ADR-003 — Cloudflare mantiene DNS

**Estado:** Aprobado
**Motivo:** conservar gestión DNS y servicios asociados. Solo se cambiarán los registros web al final.

## ADR-004 — Firebase se retira gradualmente

**Estado:** Aprobado
**Motivo:** conservar rollback. No eliminar el proyecto completo si aún usa otros servicios.

## ADR-005 — MVP sin integraciones reales

**Estado:** Aprobado
**Motivo:** validar mensaje, UX y embudo antes de conectar n8n, CRM o WhatsApp Cloud API.

## ADR-006 — CSS Modules + Variables CSS nativas como sistema de estilos

**Estado:** Aprobado
**Motivo:** mantenibilidad, independencia de dependencias externas, compatibilidad natural con Astro y con la capa de Design Tokens. Tailwind puede incorporarse en fases futuras si el volumen de componentes lo justifica.

## ADR-007 — Node.js 20 LTS como versión oficial del proyecto

**Estado:** Aprobado
**Motivo:** versión LTS estable para el ciclo de vida de Release 0 y Release 1. El entorno de desarrollo puede ejecutar una versión superior compatible (>= 20) pero el proyecto declara Node 20 como mínimo en `.nvmrc` y en `engines` de `package.json`. No actualizar durante Release 0 salvo problema de seguridad crítico.

## ADR-008 — Astro 4.x — versión fijada durante Release 0

**Estado:** Aprobado
**Motivo:** estabilidad y previsibilidad durante la implementación. La versión instalada (4.16.x) no se actualiza a Astro 5.x ni superiores durante Release 0. Las actualizaciones de versión mayor se evalúan como un ADR separado al inicio de Sprint 1.

## ADR-009 — Identidad de marca 2026

**Estado:** Aprobado (registrado retroactivamente el 2026-10-26)
**Motivo:** dar más energía visual a la marca.
**Decisión:** el acento pasa de Signal Blue a **Energía `#EE6E43`** con neutros piedra cálida; titulares en Outfit, cuerpo en Manrope y datos en JetBrains Mono, autoalojadas; isotipo **Transforma** y logotipo «interforma» en minúsculas; **Punto** como mascota, separada del logo oficial. La fuente de verdad de valores es el bloque *IDENTIDAD 2026* de `src/styles/tokens.css`. Implementado en PR #8 a #11.
**Aplicación completa (2026-10-26):** `DESIGN.md` reescrito como referencia única; fuentes anteriores (Plus Jakarta Sans, Inter, Host Grotesk) retiradas del código y de las dependencias; botones y foco unificados; documentos HTML de Interforma en `public/` con la marca vía `public/marca/interforma-docs.css`. Excepciones documentadas en `DESIGN.md` §9 y §10 (colores de redes sociales, familias de categoría en diagramas de sistema, material con marca del cliente).

## ADR-010 — Arquitectura de Interforma Agents

**Estado:** Aprobado (registrado retroactivamente el 2026-10-26)
**Motivo:** ofrecer agentes que el equipo del cliente pueda supervisar y tomar en cualquier momento, con un canal estable y oficial.
**Decisión:** Meta WhatsApp Cloud API oficial (no conectores no oficiales) → Chatwoot como bandeja compartida → n8n autoalojado como *Agent Bot* → Claude API, con Redis para el historial y un CRM (Twenty en la implementación de referencia) como fuente central de datos comerciales. Toda acción sensible (cotizaciones, descuentos, reservas) requiere aprobación humana. Detalle en `docs/agentes/arquitectura.md`.
**Regla:** este repositorio solo guarda la arquitectura a nivel de componentes. Secretos, IDs y exportaciones de workflows nunca se versionan aquí.
**Relación con ADR-005:** el sitio de Interforma sigue sin integraciones reales; ADR-010 aplica a implementaciones para clientes y al futuro agente propio.

## ADR-011 — Activos de clientes servidos desde `public/`

**Estado:** Parcial — paso (a) aplicado, paso (b) pendiente de decisión
**Contexto:** informes mensuales, propuestas comerciales, planes y landings de clientes se publican como HTML estáticos en `public/informes/`, `public/propuestas/`, `public/clientes/` y `public/agente-medic-home/`. Es rápido de compartir, pero quedan en un repositorio público. Algunos incluyen montos facturados.
**(a) Corto plazo — aplicado el 2026-10-26:** `<meta name="robots" content="noindex, nofollow, noarchive">` en cada documento y header `X-Robots-Tag` con el mismo valor en `vercel.json` para esas rutas. **No** se bloquean en `robots.txt` a propósito: Google necesita leer el `noindex` para sacar del índice lo que ya hubiera indexado.
**(b) Mediano plazo — pendiente:** moverlos a un repositorio privado o a un portal con acceso (por ejemplo, el portal de reportes de clientes).
