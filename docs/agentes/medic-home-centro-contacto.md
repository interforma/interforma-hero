# Medic Home · Centro de contacto IA (maqueta)

- **URL:** `/agente-medic-home/centro-contacto` (no indexada: `X-Robots-Tag` de `vercel.json` y `meta robots`).
- **Qué es:** maqueta funcional de la propuesta para reemplazar CloudTalk en Medic Home: número 600 entrante y saliente, WhatsApp oficial con traspaso a una persona, consola del ejecutivo, CRM Twenty autoalojado, arquitectura, flujos, costo y uso, e inversión y plazos con calculadora.
- **Tecnología:** HTML, CSS y JS estáticos en `public/` (sin dependencias, rutas internas por `#hash`). No pasa por el build de Astro.
- **Datos:** conversaciones simuladas y datos ficticios. Las tarifas de la calculadora son referenciales (Meta Chile, voz IA, telefonía) y se ajustan en pantalla.
- **Validación:** render de las 9 vistas y clics simulados en Node sin errores; revisar en el preview de Vercel antes de compartir.
- **Pendiente:** eventos de analytics si se enlaza desde la página pública de Agentes.
- **Flujos (sección 06):** `flujo-entrante.html` y `flujo-saliente.html`, generados con Archify 3.2 (workflow, showcase, validaciones y browser-check en verde) y con el bloque `interforma-brand` de `/diagramas/metodo-interforma.html` (paleta y tipografía), `noindex` y canonical a la maqueta. Para editarlos: modificar el `candidate.json`, regenerar con `archify finalize workflow` y volver a insertar el bloque de marca.
