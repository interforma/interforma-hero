// ─────────────────────────────────────────────
// parallax.ts
// Parallax multi-capa ligado al scroll de la ventana.
// Cada capa tiene su propio factor de velocidad:
//   factor  0    → se mueve igual que el scroll (sin efecto)
//   factor  0.2  → se mueve hacia abajo más lento (fondo)
//   factor -0.15 → sube un poco al bajar (primer plano trasero)
//   factor -0.35 → sube más rápido (primer plano delantero)
// ─────────────────────────────────────────────

export interface ParallaxLayer {
  /** selector CSS del elemento a mover */
  selector: string
  /** velocidad vertical: negativo = sube al bajar el scroll */
  fy: number
  /** velocidad horizontal (opcional) */
  fx?: number
}

export function initParallax(layers: ParallaxLayer[]): () => void {
  let raf: number | null = null

  // Resolvemos los elementos una sola vez
  const resolved = layers
    .map(l => ({ el: document.querySelector<HTMLElement>(l.selector), ...l }))
    .filter(l => l.el !== null) as Array<ParallaxLayer & { el: HTMLElement }>

  function update() {
    const sy = window.scrollY
    for (const layer of resolved) {
      const tx = ((layer.fx ?? 0) * sy).toFixed(1)
      const ty = (layer.fy * sy).toFixed(1)
      layer.el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
    }
    raf = null
  }

  function onScroll() {
    if (raf) return
    raf = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })

  // Devuelve una función de limpieza para cuando el componente se desmonte
  return () => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  }
}
