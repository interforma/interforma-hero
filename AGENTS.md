# AGENTS.md
## Interforma Product Engineering Standard
**Versión:** 1.0

## Misión

Todo trabajo realizado en este repositorio debe fortalecer el Método Interforma.

No construimos páginas web aisladas. Diseñamos productos digitales que ayudan a transformar organizaciones mediante estrategia, procesos, datos, tecnología, automatización e inteligencia artificial.

Cada decisión debe aumentar la claridad, la calidad, la mantenibilidad y la reutilización.

## Orden de decisión

Seguir siempre este orden:

1. Problema
2. Personas
3. Proceso
4. Datos
5. Tecnología
6. Inteligencia artificial

Nunca comenzar por una herramienta.

## Principios de arquitectura

- Priorizar simplicidad, modularidad y desacoplamiento.
- Elegir la solución más simple que cumpla los requisitos.
- Evitar dependencias innecesarias.
- Usar Astro como base y React solo para interactividad real.
- Mantener TypeScript estricto.
- Diseñar interfaces para integraciones futuras sin acoplarlas prematuramente.
- No implementar servicios reales cuando todavía corresponda usar mocks.

## UX

Toda interfaz debe responder:

- ¿Qué problema resuelve?
- ¿Qué debe comprender el usuario?
- ¿Qué acción debe realizar?
- ¿Qué fricción puede eliminarse?

La claridad tiene prioridad sobre la decoración.

## UI

Inspiración conceptual: Notion, Linear, Vercel, Stripe y Raycast.

No copiar. Priorizar:

- tipografía legible;
- espacios generosos;
- jerarquía clara;
- alto contraste;
- componentes sobrios;
- animaciones discretas;
- diseño mobile-first.

## SEO y GEO

Toda página debe considerar:

- HTML semántico;
- metadata;
- canonical;
- Open Graph;
- datos estructurados;
- URLs limpias;
- jerarquía correcta de títulos;
- contenido directo y comprensible;
- entidades, conceptos y respuestas claramente definidos.

## Analytics

Toda interacción relevante debe definir:

- evento;
- objetivo;
- propiedades;
- KPI;
- criterio de éxito.

No agregar CTA sin tracking previsto.

## Accesibilidad

Los componentes deben:

- funcionar con teclado;
- mostrar foco visible;
- usar labels explícitos;
- respetar contraste;
- considerar lectores de pantalla;
- admitir reducción de movimiento.

## Reutilización

Antes de crear un componente, prompt, patrón o arquitectura:

1. Buscar si ya existe.
2. Evaluar si puede extenderse.
3. Crear algo nuevo solo si existe una diferencia real.

## Definition of Done

Una tarea solo está terminada cuando:

- funciona;
- es comprensible;
- es responsive;
- es accesible;
- está documentada;
- tiene pruebas o una validación explícita;
- no introduce regresiones conocidas;
- respeta el Método Interforma.

## Prohibiciones

- No escribir código antes de comprender la tarea.
- No cambiar arquitectura, copy o diseño sin justificarlo.
- No reemplazar decisiones aprobadas silenciosamente.
- No crear complejidad especulativa.
- No introducir credenciales, tokens o secretos en el repositorio.
- No modificar DNS ni producción durante las fases de arquitectura o MVP.
- No eliminar Firebase hasta validar Vercel y conservar una ruta de rollback.
