# Casos y testimonios

Sección `/#casos` en la home, listado en `/casos` y una página por caso en `/casos/<id>`.
Diseño de referencia: canvas «Casos Interforma» en Claude Design.

## Agregar o editar un caso

Un archivo YAML por caso en `src/content/casos/`. El nombre del archivo es el id y la URL
(`first-cargo.yaml` → `/casos/first-cargo`). El esquema está en `src/content/config.ts`.

Formato único de tarjeta, siempre en este orden:

1. **Visual por tipo**: se dibuja solo según `tipo` (`web`, `agente`, `marketing`, `datos`, `app`).
2. **Tipo y estado**: `estado` es uno de En desarrollo, Beta, Entregado, En operación, En curso.
   `proximaFase` agrega una línea aparte (p. ej. «Fase 2 · continuidad desde noviembre 2026»).
3. **Título de resultado**: lo que cambió, no la herramienta. Máximo 80 caracteres, con punto final.
4. **Cliente · sector**: nombre solo con autorización del cliente.
5. **Prueba**: un hecho comprobable (`valor` corto + `etiqueta`).
6. **Stack**: máximo cuatro tecnologías.
7. **Enlace**: «Ver caso» si el archivo tiene `detalle`; «Ver proyecto» si tiene `pagina` (página propia, p. ej. `/libreta`); «Ver sitio» si solo tiene `sitio`; nada en otro caso.

`sitios` (varios sitios construidos por Interforma) agrega cápsulas con enlace en la tarjeta y, si traen `logo`,
una franja de logos en la página del caso. Los logos van en `public/casos/<caso>/`, en monocromo Umbra
(dos tonos: `ink` y `gray-500`), alto 96 px, para que no se vean como estampillas.

## Regla de la prueba

La tarjeta muestra hechos, no promesas: plazo, alcance, tiempo en operación, sitio en vivo o
fase actual. Cifras de rendimiento (porcentajes, leads, tiempos de respuesta) solo con
aprobación escrita del cliente, con fuente y período, y en la página del caso, nunca en la tarjeta.

## Testimonios

`testimonio.aprobado: false` → el texto queda guardado pero **no se publica** en ninguna página.
Cuando el cliente aprueba el texto final (y su cargo), cambiar a `aprobado: true` y completar `cargo`.
La franja de testimonios aparece sola cuando hay al menos uno aprobado.
