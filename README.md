# Interforma Hero — Halftone + Parallax para Astro

Efecto de figuras con líneas halftone 3D y parallax multi-capa,
inspirado en twenty.com. Sin dependencias externas — solo Canvas API nativa.

---

## Instalación

Copia estas carpetas a tu proyecto Astro:

```
src/
  components/
    HeroSection.astro     ← hero completo listo para usar
    HalftoneShape.astro   ← canvas individual reutilizable
  scripts/
    halftone.ts           ← engine de dibujo
    parallax.ts           ← listener de scroll
```

No requiere ningún `npm install` adicional.

---

## Uso mínimo

```astro
---
// src/pages/index.astro
import HeroSection from '../components/HeroSection.astro'
---
<HeroSection />
```

---

## Usar HalftoneShape en cualquier lugar

```astro
import HalftoneShape from '../components/HalftoneShape.astro'

<!-- diamante azul 160×160 -->
<HalftoneShape shape="diamond" width={160} height={160} />

<!-- blob blanco sobre fondo oscuro -->
<HalftoneShape
  shape="blob"
  width={200} height={200}
  color="#ffffff"
  bg="#0d0d0d"
/>
```

### Props disponibles

| Prop        | Tipo   | Default      | Descripción                        |
|-------------|--------|--------------|------------------------------------|
| `shape`     | string | —            | `diamond` `blob` `sphere` `lock` `hexagon` `cross` |
| `width`     | number | —            | Ancho del canvas en px             |
| `height`    | number | —            | Alto del canvas en px              |
| `lineGap`   | number | `4.5`        | Espacio entre líneas               |
| `lineWidth` | number | `0.38`       | Grosor relativo (0.1 – 0.9)        |
| `light`     | number | `1.6`        | Intensidad de luz 3D               |
| `angle`     | number | `42`         | Ángulo de la luz en grados         |
| `color`     | string | `'#3a3af4'`  | Color de las líneas                |
| `bg`        | string | `undefined`  | Color de fondo (vacío=transparente)|

---

## Ajustar el parallax

En `HeroSection.astro`, cada capa tiene `data-fy` y `data-fx`:

```html
<!-- más negativo = sube más rápido = parece más cerca -->
<div class="parallax-layer" data-fy="-0.06">  <!-- capa trasera  -->
<div class="parallax-layer" data-fy="-0.18">  <!-- capa media    -->
<div class="parallax-layer" data-fy="-0.34">  <!-- capa frontal  -->
```

El fondo de líneas usa `data-fy="0.22"` (positivo = baja más lento que el scroll).

---

## Cambiar colores

Edita las variables CSS en `HeroSection.astro`:

```css
.hero {
  --hero-bg:     #0d0d0d;   /* fondo del hero        */
  --hero-accent: #3a3af4;   /* color figuras y CTAs  */
  --hero-text:   #ffffff;   /* título                */
  --hero-muted:  #666666;   /* subtítulo y párrafo   */
}
```

---

## Agregar una forma personalizada

En `halftone.ts`, agrega tu forma al tipo y a la función `buildShapeBuffer`:

```ts
export type ShapeType = 'diamond' | 'blob' | ... | 'miforma'

// dentro de buildShapeBuffer:
else if (shape === 'miforma') {
  c.fillStyle = '#fff'
  // dibuja con Canvas 2D API
  c.beginPath()
  c.arc(W * .5, H * .5, W * .4, 0, Math.PI * 2)
  c.fill()
}
```

---

## Compatibilidad

- Astro 4+ y 5+
- Funciona con `output: 'static'` y `output: 'server'`
- Compatible con View Transitions (`astro:before-swap` hace cleanup)
- Respeta `prefers-reduced-motion` (parallax desactivado vía CSS)
- Sin dependencias npm adicionales
