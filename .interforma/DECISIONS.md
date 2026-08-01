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
