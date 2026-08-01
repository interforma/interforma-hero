// ─────────────────────────────────────────────
// halftone.ts
// Engine de dibujo de figuras con efecto halftone.
// Fuente: github.com/interforma/interforma-hero (adaptado para interforma.digital)
// ─────────────────────────────────────────────

export type ShapeType = 'diamond' | 'blob' | 'sphere' | 'lock' | 'hexagon' | 'cross'

export interface HalftoneOptions {
  shape:     ShapeType
  lineGap:   number
  lineWidth: number
  light:     number
  angle:     number
  color:     string
  bg?:       string
}

function buildShapeBuffer(shape: ShapeType, W: number, H: number): ImageData {
  const off = document.createElement('canvas')
  off.width = W; off.height = H
  const c = off.getContext('2d')!
  c.clearRect(0, 0, W, H)

  if (shape === 'diamond') {
    c.fillStyle = '#fff'
    c.beginPath()
    c.moveTo(W * .5, H * .06)
    c.lineTo(W * .92, H * .46)
    c.lineTo(W * .5,  H * .94)
    c.lineTo(W * .08, H * .46)
    c.closePath(); c.fill()
    c.fillStyle = 'rgba(0,0,0,.28)'
    c.beginPath()
    c.moveTo(W * .5, H * .06); c.lineTo(W * .5, H * .46); c.lineTo(W * .92, H * .46)
    c.closePath(); c.fill()
    c.fillStyle = 'rgba(0,0,0,.52)'
    c.beginPath()
    c.moveTo(W * .5, H * .94); c.lineTo(W * .5, H * .46); c.lineTo(W * .08, H * .46)
    c.closePath(); c.fill()
  }

  else if (shape === 'blob') {
    c.fillStyle = '#fff'
    c.beginPath()
    const cx = W * .5, cy = H * .5, rx = W * .34, ry = H * .38
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * Math.PI * 2
      const wobble = 1 + .2 * Math.sin(t * 3 + .4) + .08 * Math.cos(t * 5)
      const x = cx + Math.cos(t) * rx * wobble
      const y2 = cy + Math.sin(t) * ry * wobble
      i === 0 ? c.moveTo(x, y2) : c.lineTo(x, y2)
    }
    c.closePath(); c.fill()
    c.fillStyle = 'rgba(0,0,0,.38)'
    c.beginPath()
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * Math.PI * 2
      const wobble = 1 + .2 * Math.sin(t * 3 + .4) + .08 * Math.cos(t * 5)
      if (cy + Math.sin(t) * ry * wobble > cy) {
        const x = cx + Math.cos(t) * rx * wobble
        const y2 = cy + Math.sin(t) * ry * wobble
        i === 0 ? c.moveTo(x, y2) : c.lineTo(x, y2)
      }
    }
    c.lineTo(cx + rx, cy); c.lineTo(cx - rx, cy)
    c.closePath(); c.fill()
  }

  else if (shape === 'sphere') {
    const gr = c.createRadialGradient(W * .38, H * .35, 0, W * .5, H * .5, W * .38)
    gr.addColorStop(0,   '#fff')
    gr.addColorStop(.55, 'rgba(180,180,180,.9)')
    gr.addColorStop(1,   'rgba(40,40,40,.5)')
    c.fillStyle = gr
    c.beginPath(); c.arc(W * .5, H * .5, W * .38, 0, Math.PI * 2); c.fill()
  }

  else if (shape === 'lock') {
    c.lineWidth = W * .1; c.strokeStyle = '#fff'; c.lineCap = 'round'
    c.beginPath(); c.arc(W * .5, H * .3, W * .2, Math.PI, 0); c.stroke()
    c.fillStyle = '#fff'
    c.beginPath()
    c.roundRect(W * .5 - W * .24, H * .42, W * .48, H * .42, W * .05)
    c.fill()
    c.fillStyle = 'rgba(0,0,0,.3)'
    c.beginPath()
    c.roundRect(W * .5 - W * .24, H * .42, W * .24, H * .42, W * .05)
    c.fill()
    c.fillStyle = 'rgba(0,0,0,.82)'
    c.beginPath(); c.arc(W * .5, H * .42 + H * .42 * .35, W * .058, 0, Math.PI * 2); c.fill()
    c.fillRect(W * .5 - W * .02, H * .42 + H * .42 * .35, W * .04, H * .42 * .26)
  }

  else if (shape === 'hexagon') {
    c.fillStyle = '#fff'
    c.beginPath()
    const hcx = W * .5, hcy = H * .5, hr = W * .38
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 - Math.PI / 6
      i === 0
        ? c.moveTo(hcx + Math.cos(a) * hr, hcy + Math.sin(a) * hr)
        : c.lineTo(hcx + Math.cos(a) * hr, hcy + Math.sin(a) * hr)
    }
    c.closePath(); c.fill()
    c.fillStyle = 'rgba(0,0,0,.35)'
    c.beginPath()
    for (let i = 3; i < 6; i++) {
      const a = i * Math.PI / 3 - Math.PI / 6
      i === 3
        ? c.moveTo(hcx + Math.cos(a) * hr, hcy + Math.sin(a) * hr)
        : c.lineTo(hcx + Math.cos(a) * hr, hcy + Math.sin(a) * hr)
    }
    c.lineTo(hcx, hcy); c.closePath(); c.fill()
  }

  else if (shape === 'cross') {
    const t = W * .16, arm = W * .34
    const cx = W * .5, cy = H * .5
    c.fillStyle = '#fff'
    c.beginPath()
    c.rect(cx - t / 2, cy - arm, t, arm * 2)
    c.rect(cx - arm, cy - t / 2, arm * 2, t)
    c.fill()
    c.fillStyle = 'rgba(0,0,0,.3)'
    c.beginPath(); c.rect(cx - t / 2, cy - arm, t * .45, arm * 2); c.fill()
  }

  return c.getImageData(0, 0, W, H)
}

export function drawHalftone(
  canvas: HTMLCanvasElement,
  W: number,
  H: number,
  opts: HalftoneOptions
): void {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  if (opts.bg) {
    ctx.fillStyle = opts.bg
    ctx.fillRect(0, 0, W, H)
  }

  const buf  = buildShapeBuffer(opts.shape, W, H)
  const data = buf.data
  const sp   = opts.lineGap
  const lw   = opts.lineWidth
  const li   = opts.light
  const ang  = opts.angle * Math.PI / 180
  const lx   = Math.cos(ang)
  const ly   = -Math.sin(ang)

  const getAlpha = (x: number, y: number): number => {
    const xi = Math.max(0, Math.min(W - 1, Math.round(x)))
    const yi = Math.max(0, Math.min(H - 1, Math.round(y)))
    return data[(yi * W + xi) * 4 + 3] / 255
  }

  const getBright = (x: number, y: number): number => {
    const xi = Math.max(0, Math.min(W - 1, Math.round(x)))
    const yi = Math.max(0, Math.min(H - 1, Math.round(y)))
    const i = (yi * W + xi) * 4
    return (data[i] + data[i + 1] + data[i + 2]) / (3 * 255)
  }

  ctx.lineCap     = 'butt'
  ctx.strokeStyle = opts.color

  for (let y = sp / 2; y < H; y += sp) {
    for (let x = sp / 2; x < W; x += sp) {
      const a = getAlpha(x, y)
      if (a < 0.06) continue

      const dx  = getAlpha(x + 1.5, y) - getAlpha(x - 1.5, y)
      const dy  = getAlpha(x, y + 1.5) - getAlpha(x, y - 1.5)
      const nl  = Math.sqrt(dx * dx + dy * dy + .0001)
      const nx  = dx / nl, ny = dy / nl, nz = .5
      const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz)
      const diff = Math.max(0, (nx * lx + ny * ly + nz * .4) / nlen) * li

      const intensity = Math.min(1, .07 + diff * .62 + getBright(x, y) * .32) * a
      const lineH     = Math.max(.1, lw * sp * intensity)

      ctx.lineWidth   = lineH
      ctx.globalAlpha = Math.min(1, a * .93)
      ctx.beginPath()
      ctx.moveTo(x - sp * .47, y)
      ctx.lineTo(x + sp * .47, y)
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}
