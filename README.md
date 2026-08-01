# ✦ Interforma Hero — Halftone + Parallax

> Hero section con figuras 3D en líneas halftone y parallax multi-capa para **Astro**.  
> Técnica inspirada en [twenty.com](https://twenty.com) — sin dependencias externas.

---

## ¿Qué es esto?

Un componente listo para usar en cualquier proyecto **Astro** que genera:

- **Figuras geométricas** (diamante, blob, candado, esfera, hexágono, cruz) renderizadas con líneas horizontales que simulan profundidad 3D
- **Parallax de 3 capas** ligado al scroll: cada figura se mueve a distinta velocidad creando ilusión de profundidad
- **Fondo animado** con patrón de líneas sutiles
- **0 dependencias npm** — solo Canvas 2D API nativa del browser

---

## Archivos incluidos

```
src/
├── scripts/
│   ├── halftone.ts           ← engine de dibujo (Canvas 2D + efecto 3D)
│   └── parallax.ts           ← listener de scroll multi-capa
└── components/
    ├── HeroSection.astro     ← hero completo listo para usar
    └── HalftoneShape.astro   ← canvas individual reutilizable en cualquier sección
```

---

## Uso rápido

**1. Copia los 4 archivos a tu proyecto Astro**

**2. Importa el hero en tu página:**

```astro
---
import HeroSection from '../components/HeroSection.astro'
---
<HeroSection />
```

**3. Listo.** No necesitas instalar nada más.

---

## HalftoneShape — uso individual

Puedes usar las figuras sueltas en cualquier sección, no solo en el hero:

```astro
---
import HalftoneShape from '../components/HalftoneShape.astro'
---

<!-- Diamante azul 160×160px -->
<HalftoneShape shape="diamond" width={160} height={160} />

<!-- Blob blanco sobre fondo oscuro -->
<HalftoneShape
  shape="blob"
  width={200} height={200}
  color="#ffffff"
  bg="#0d0d0d"
/>
```

### Props

| Prop        | Tipo   | Default     | Descripción                              |
|-------------|--------|-------------|------------------------------------------|
| `shape`     | string | —           | `diamond` `blob` `sphere` `lock` `hexagon` `cross` |
| `width`     | number | —           | Ancho en px                              |
| `height`    | number | —           | Alto en px                               |
| `lineGap`   | number | `4.5`       | Espaciado entre líneas                   |
| `lineWidth` | number | `0.38`      | Grosor de línea (0.1 – 0.9)             |
| `light`     | number | `1.6`       | Intensidad de luz 3D                     |
| `angle`     | number | `42`        | Ángulo de la luz en grados               |
| `color`     | string | `#3a3af4`   | Color de las líneas                      |
| `bg`        | string | transparente| Color de fondo                           |

---

## Personalizar el parallax

En `HeroSection.astro` cada capa tiene `data-fy` — cuanto más negativo, más rápido sube al hacer scroll (parece más cerca):

```html
<div class="parallax-layer" data-fy="0.22">   <!-- fondo: baja lento → sensación de lejanía -->
<div class="parallax-layer" data-fy="-0.06">  <!-- capa trasera: casi sin mover             -->
<div class="parallax-layer" data-fy="-0.18">  <!-- capa media                               -->
<div class="parallax-layer" data-fy="-0.34">  <!-- capa frontal: más dinámica               -->
```

---

## Cambiar colores

Edita las variables CSS al inicio de `HeroSection.astro`:

```css
.hero {
  --hero-bg:     #0d0d0d;  /* fondo */
  --hero-accent: #3a3af4;  /* color de figuras y botón principal */
  --hero-text:   #ffffff;  /* título */
  --hero-muted:  #666666;  /* subtítulo y párrafo */
}
```

---

## Agregar una forma nueva

En `halftone.ts`, añade el nombre al tipo y dibuja con Canvas 2D:

```ts
export type ShapeType = 'diamond' | 'blob' | ... | 'miforma'

else if (shape === 'miforma') {
  c.fillStyle = '#fff'
  c.beginPath()
  c.arc(W * .5, H * .5, W * .4, 0, Math.PI * 2)
  c.fill()
}
```

---

## Compatibilidad

| | |
|---|---|
| Astro | 4+ y 5+ |
| Output | `static` y `server` |
| View Transitions | ✅ cleanup automático |
| `prefers-reduced-motion` | ✅ parallax desactivado vía CSS |
| Dependencias externas | ninguna |

---

## Probar online

Abre el proyecto directamente en el browser sin instalar nada:

**[→ Abrir en StackBlitz](https://stackblitz.com/github/interforma/interforma-hero)**

---

Hecho por [Interforma Digital](https://interforma.digital) · Viña del Mar, Chile
