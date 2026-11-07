# Interforma Agents

**Última actualización:** 2026-10-26

Interforma Agents es la línea de servicio de agentes de IA de Interforma: un agente atiende las conversaciones repetitivas de una empresa (WhatsApp primero; web e Instagram como canales siguientes), deriva a una persona todo lo que sale de la política y no ejecuta nada sensible sin aprobación humana.

> **Repositorio público.** Esta carpeta describe la arquitectura, las reglas y la operación a nivel de componentes. **No** contiene tokens, IDs de cuentas, URLs de webhooks, IPs, números de teléfono de clientes ni exportaciones de workflows. Esos datos viven solo en la documentación interna de Notion (Playbook Interforma → Stack Técnico) y en el gestor de secretos o el `.env` del servidor.

## Documentos

| Documento | Contenido |
|---|---|
| [`arquitectura.md`](./arquitectura.md) | Componentes, flujo de punta a punta, traspaso agente ↔ persona, memoria, CRM, seguimiento, postventa, seguridad y lecciones operativas. |
| [`oferta-y-piloto.md`](./oferta-y-piloto.md) | Cómo se vende y se mide: piloto de 30 días, regla 1·1·1, KPI, puerta de decisión del día 30 y compromisos de cumplimiento. |
| [`sitio-web.md`](./sitio-web.md) | Qué hay de Interforma Agents en este repo: páginas, secciones, diagrama, demo, eventos de analytics y cómo actualizarlos. |

## Estado al 2026-10-26

| Frente | Estado | Nota |
|---|---|---|
| Implementación de referencia (cliente de logística) | 🟢 En producción | WhatsApp → Chatwoot → n8n → Claude, con registro en CRM Twenty, correo de confirmación y cotización aprobada por una persona. |
| Seguimiento 15/30/45 días | 🟡 Diseñado | Falta activarlo en el CRM. |
| Remarketing por motivo de pérdida | 🟡 Preparado | Vista creada en el CRM; falta clasificar y autorizar contactos. |
| Postventa y encuesta | 🟡 Estructura creada | Objeto y estados en el CRM; encuesta propuesta; sin automatizaciones activas. |
| Agente propio de Interforma (interforma.digital) | ⚪ No iniciado | Hoy el sitio deriva a WhatsApp humano. Se evalúa construirlo en n8n con un número propio en la API de Meta y agenda en Cal.com. |
| Landing y flujo público en el sitio | 🟢 Publicados | `/agentes` y `/agentes/flujo`. |
| App del operador (iOS) | 🟡 Prototipo | Diseñada como concepto en `/agentes`; no existe como app construida. Hoy el operador trabaja en la bandeja de Chatwoot y en el CRM. |

> **Ojo con el alcance comunicado.** El flujo público (`/agentes/flujo`) muestra postventa, encuesta y remarketing como parte del recorrido. En la implementación de referencia esas piezas todavía están en preparación. Si se ofrece a un cliente nuevo, se debe presentar como etapa posterior al piloto, no como funcionalidad incluida desde el día 1.

## Fuentes internas (Notion)

- *Stack Técnico — Agente WhatsApp IA (documentación interna)*: arquitectura con datos de infraestructura.
- *Flujo público del Agente WhatsApp — versión web y presentación*: versión genérica publicada en el sitio.
- *Informe de Avance — Agente WhatsApp IA + CRM Twenty (10 ago 2026)*.
- *CRM Twenty — Marketing, Remarketing y Postventa | Plan y responsabilidades* (17 sept 2026).

Cuando cambie la implementación, actualizar primero Notion (fuente técnica) y después este resumen.
