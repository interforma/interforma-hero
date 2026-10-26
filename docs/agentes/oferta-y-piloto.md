# Oferta y piloto de 30 días

**Última actualización:** 2026-10-26
**Fuente:** copy publicado en `/agentes` y `/agentes/flujo` (ver [`sitio-web.md`](./sitio-web.md)).

## Propuesta

> Tu primer agente de IA, en 30 días. Con una persona al mando.

El agente atiende lo repetitivo; una persona decide todo lo sensible. Nada se cotiza, reserva o descuenta sin aprobación humana.

**Posicionamiento:**

- **Agnóstico:** se integra vía API con el CRM, ERP, sistema de reservas o planillas que el cliente ya usa. El agente se adapta al stack del cliente, no al revés.
- **Pensado para la normativa chilena:** Ley 19.628 y Ley 21.719 (finalidad definida, trazabilidad de cada acción, acceso controlado).
- **Coherente con el Método Interforma:** el proceso precede a la herramienta. Se elige un proceso concreto antes de configurar el agente.

## Regla 1·1·1

Un **proceso**, un **canal** y un **KPI**. Nada más para empezar.

1. **Elegir el proceso:** cotizaciones, reservas o soporte; uno con volumen repetitivo y una acción concreta al final.
2. **Conectar el canal:** WhatsApp Business (canal en producción hoy). Chat web e Instagram se ofrecen como canales siguientes.
3. **Fijar KPI y límites:** tiempo de respuesta, resolución o conversión, y la lista explícita de lo que siempre aprueba una persona.

## Compromisos publicados

| Indicador | Compromiso |
|---|---|
| Duración del piloto | 30 días |
| Alcance | 1 agente · 1 canal · 1 KPI |
| SLA de derivación a una persona | 5 min |
| Acciones sensibles aprobadas por una persona | 100 % |

> El SLA de 5 minutos depende del equipo del cliente, no solo del sistema. Debe acordarse por escrito al inicio del piloto (horario de atención, responsable de turno y qué pasa fuera de horario).

## Puerta de decisión · día 30

Se escala solo si el KPI mejora **y** el control humano se sostiene.

| Resultado | Decisión |
|---|---|
| Meta cumplida | **Escalar:** sumar canales o un segundo proceso. |
| Mejora parcial | **Ajustar:** afinar límites y extender 15 días. |
| Sin mejora | **Detener:** cerrar el piloto con un informe de aprendizajes. |

## Qué medir durante el piloto

El agente registra cada conversación, derivación y cotización. Indicadores mínimos para el informe del día 30:

- Conversaciones atendidas por el agente vs. por personas.
- Tasa y motivos de derivación (`[ESCALATE]`).
- Tiempo de primera respuesta y tiempo hasta que una persona toma una derivación (contra el SLA).
- Leads registrados en el CRM (`[LEAD]`) y cotizaciones enviadas.
- Oportunidades ganadas / perdidas con motivo.
- Incidentes: respuestas fuera de política, loops, conversaciones que no entraron en `pending`.
- Costo del modelo y de la bandeja por conversación.

## Checklist de puesta en marcha (por cliente)

- [ ] Proceso, KPI, límites y SLA acordados por escrito.
- [ ] Número de WhatsApp en Meta Cloud API, verificado con documentos del cliente; política de privacidad, términos y URL de eliminación de datos publicados.
- [ ] Bandeja de Chatwoot creada, **asignación automática desactivada**, Agent Bot conectado.
- [ ] Workflow de n8n duplicado desde la versión de referencia, con prompt de sistema del cliente y marcadores `[ESCALATE]` / `[LEAD]`.
- [ ] Prueba con un número que nunca haya escrito (entra en `pending` y responde el agente).
- [ ] Prueba de derivación (estado `open`, el agente calla) y de devolución al agente (`pending`).
- [ ] CRM con campos, pipeline y motivos de pérdida; correo de confirmación con identidad del cliente.
- [ ] Notificaciones al equipo para conversaciones nuevas y escalamientos.
- [ ] Capacitación: Pendiente = atiende el agente · Abierta = te toca a ti · devolver = marcar Pendiente.
- [ ] Tablero del KPI listo antes del día 1.

## Pendientes comerciales

- Definir el canal de conversión de `/agentes`: hoy los botones «Agendar piloto» y «Hablar con ventas» abren un correo a `hola@interforma.ai`, dominio distinto de `interforma.digital`. Alinear con WhatsApp o con la agenda de Cal.com.
- Unificar la voz: `/agentes` usa «tú»; el resto del sitio y el agente en producción usan «usted».
- Contar con un caso real publicable (con autorización del cliente y métricas verificables) para reemplazar el ejemplo ficticio de la demo.
