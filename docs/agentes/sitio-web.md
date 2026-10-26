# Interforma Agents en el sitio web

**Última actualización:** 2026-10-26

Mapa de todo lo que existe en este repositorio sobre Interforma Agents y cómo mantenerlo.

## Páginas

| Ruta | Archivo | Contenido | JSON-LD |
|---|---|---|---|
| `/#agentes` | `src/sections/AgentsSection.astro` | Sección del home: hitos, demo animada del operador (JS puro), botón «Ver Interforma Agents» → `/agentes` y botón «Ver el flujo en detalle» → `/agentes/flujo`. | — (va en el del home) |
| `/agentes` | `src/pages/agentes.astro` | Landing del servicio. Tono «tú». | ❌ No tiene |
| `/agentes/flujo` | `src/pages/agentes/flujo.astro` | Diagrama interactivo, 8 pasos (agente / persona / regla de control), estados de la conversación y CTA de piloto por WhatsApp. Tono «usted». | ✅ `HowTo` |
| `/diagramas/agente-whatsapp.html` | `public/diagramas/agente-whatsapp.html` | Diagrama a pantalla completa para presentaciones. `noindex` y canonical a `/agentes/flujo`. | — |
| `/agente-medic-home/` | `public/agente-medic-home/index.html` | Propuesta estática para un cliente de salud (diagrama + Gantt). Sin `noindex`. | — |

### Secciones de `/agentes` (`src/sections/agentes/`)

1. `HeroAgentes` — titular, tarjeta de derivación de ejemplo («Espera humano · 6 min») y CTA a `#empezar` / `#como`.
2. `StatsAgentes` — 30 días · 1·1·1 · 5 min · 100 %.
3. `DemoAgentes` — «Un turno, en treinta segundos»: demo animada de la app del operador con Punto como avatar del agente.
4. `ComoFunciona` — los tres pasos de la regla 1·1·1.
5. `IntegracionSeguridad` — agnóstico + Ley 19.628 / 21.719.
6. `AppOperador` — concepto de app iOS del operador (derivaciones, aprobaciones, alertas). **Es un concepto: la app no existe todavía.**
7. `Dia30` — puerta de decisión: escalar, ajustar o detener.
8. `CtaAgentes` — «Agendar piloto» y «Hablar con ventas» (ambos `mailto:hola@interforma.ai`).

## Eventos de analytics

| Evento | Dónde | Props |
|---|---|---|
| `agents_flow_open` | Botón «Ver el flujo en detalle» en `/#agentes` | `placement: 'home_agents'` |
| `agents_flow_back` | «← Volver al inicio» en `/agentes/flujo` | `page: 'agentes_flujo'` |
| `agents_flow_fullscreen` | «Abrir en pantalla completa» | `page: 'agentes_flujo'` |
| `agents_flow_to_landing` | «Ver Interforma Agents» | `page: 'agentes_flujo'` |
| `nav_click` | Enlace «Agentes» de la nav **solo en móvil** | `destination`, `placement: 'mobile_menu'` |

**Sin tracking hoy:**

- Botón «Ver Interforma Agents» de `/#agentes`.
- Los CTA de `/agentes` (`#empezar`, `#como`, los dos `mailto`).
- El botón «Conversar sobre un piloto» de `/agentes/flujo`: `WhatsAppButton` declara `data-track-event="click_whatsapp"` pero ningún script lo escucha.

## Cómo actualizar

**Diagrama del flujo.** Editar el `candidate.json` de Archify, regenerar y reemplazar `public/diagramas/agente-whatsapp.html`. Conservar dos ajustes manuales: arranque en modo **Activa** (la preferencia «Fija» del visitante se guarda en `localStorage`) y la etiqueta `noindex` con canonical a `/agentes/flujo`.

**Pasos del flujo.** Están en el array `steps` de `src/pages/agentes/flujo.astro`; el JSON-LD `HowTo` se genera desde ese mismo array. Si cambian, actualizar también la página de Notion *Flujo público del Agente WhatsApp* y [`arquitectura.md`](./arquitectura.md).

**Regla de contenido.** El sitio muestra la versión genérica del flujo: sin nombres de clientes, números, dominios de infraestructura ni capturas reales de conversaciones.

## Pendientes del sitio

| Tema | Detalle |
|---|---|
| Conversión de `/agentes` | Cambiar los `mailto:hola@interforma.ai` por WhatsApp o Cal.com y agregar tracking. |
| Voz | Unificar «tú» (`/agentes`) con «usted» (resto del sitio). |
| JSON-LD de `/agentes` | Agregar `Service` / `Offer` para el piloto. |
| Alcance comunicado | Postventa, encuesta y remarketing aparecen en el flujo público, pero aún están en preparación. |
| App del operador | Aclarar en el copy que es la experiencia objetivo o reemplazarla por la bandeja real. |
| `/agente-medic-home/` | Evaluar `noindex` (propuesta de un cliente). |
