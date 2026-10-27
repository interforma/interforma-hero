/**
 * Punto — mascota de Interforma.
 *
 * El círculo Energía del isotipo, en primer plano y con ojos. Es un personaje
 * aparte del logo: el logo oficial nunca lleva ojos. Ver DESIGN.md §Punto.
 *
 * Devuelve el SVG como string para poder usarlo tanto desde componentes Astro
 * (Punto.astro) como desde scripts que construyen HTML (demo de /agentes).
 * Las animaciones viven en src/styles/punto.css.
 */

export type PuntoExpr =
  | 'atento'
  | 'saluda'
  | 'escucha'
  | 'piensa'
  | 'trabaja'
  | 'sorpresa'
  | 'celebra'
  | 'uy'
  | 'duerme';

export interface PuntoOptions {
  /** Ancho y alto en px. */
  size?: number;
  /** Texto para lectores de pantalla. Sin label, el SVG es decorativo. */
  label?: string;
  /** Incluye los elementos alrededor del cuerpo (puntos, confeti, gota). */
  decor?: boolean;
  /** Activa la animación de reposo: respira, parpadea y mira a los lados. */
  alive?: boolean;
}

const INK = '#281F18';
const ENERGIA = '#EE6E43';
const CIELO = '#CCE2ED';

const ovalEyes = (lx: number, rx: number, y: number, w = 9, h = 16) =>
  `<ellipse cx="${lx}" cy="${y}" rx="${w}" ry="${h}" fill="${INK}"/>` +
  `<ellipse cx="${rx}" cy="${y}" rx="${w}" ry="${h}" fill="${INK}"/>`;

function eyes(expr: PuntoExpr, alive: boolean): string {
  const blink = (svg: string) => (alive ? `<g class="punto-blink">${svg}</g>` : svg);
  switch (expr) {
    case 'escucha':
      return blink(ovalEyes(70, 104, 104));
    case 'piensa':
      return blink(ovalEyes(94, 126, 92));
    case 'trabaja':
      return `<path d="M74 104h16M110 104h16" stroke="${INK}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    case 'sorpresa':
      return `<circle cx="80" cy="98" r="13" fill="${INK}"/><circle cx="120" cy="98" r="13" fill="${INK}"/>`;
    case 'celebra':
      return `<path d="M70 102l12-14 12 14M106 102l12-14 12 14" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    case 'uy':
      return blink(ovalEyes(82, 118, 114, 8, 12));
    case 'duerme':
      // Ojos cerrados: arcos curvos hacia abajo
      return `<path d="M66 104 q16 12 32 0" stroke="${INK}" stroke-width="7" stroke-linecap="round" fill="none"/>` +
             `<path d="M102 104 q16 12 32 0" stroke="${INK}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    case 'atento':
    case 'saluda':
    default: {
      const e = blink(ovalEyes(82, 118, 100));
      return alive && expr === 'atento' ? `<g class="punto-look">${e}</g>` : e;
    }
  }
}

function extras(expr: PuntoExpr): string {
  switch (expr) {
    case 'saluda':
      return `<path class="punto-flick" d="M172 40l10-10M178 58l14-3M158 28l3-13" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    case 'piensa':
      return (
        `<circle class="punto-dot" cx="160" cy="40" r="5" fill="${INK}"/>` +
        `<circle class="punto-dot" style="animation-delay:.35s" cx="174" cy="24" r="6.5" fill="${INK}"/>` +
        `<circle class="punto-dot" style="animation-delay:.7s" cx="190" cy="8" r="8" fill="${INK}"/>`
      );
    case 'sorpresa':
      return `<path d="M100 22V10M70 28l-6-10M130 28l6-10" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    case 'celebra':
      return (
        `<rect class="punto-pop" x="14" y="26" width="12" height="12" rx="2" fill="${INK}"/>` +
        `<rect class="punto-pop" style="animation-delay:.25s" x="172" y="20" width="10" height="10" rx="2" fill="${INK}"/>` +
        `<circle class="punto-pop" style="animation-delay:.4s" cx="28" cy="150" r="5" fill="${INK}"/>`
      );
    case 'uy':
      return `<path d="M156 56q-9 14 0 20q9-6 0-20z" fill="${CIELO}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    case 'duerme':
      // Zzz flotando en diagonal
      return (
        `<text class="punto-zzz" x="152" y="72" font-family="sans-serif" font-size="18" font-weight="bold" fill="${INK}" opacity="0">Z</text>` +
        `<text class="punto-zzz" style="animation-delay:.7s" x="164" y="52" font-family="sans-serif" font-size="13" font-weight="bold" fill="${INK}" opacity="0">z</text>` +
        `<text class="punto-zzz" style="animation-delay:1.4s" x="174" y="36" font-family="sans-serif" font-size="9" font-weight="bold" fill="${INK}" opacity="0">z</text>`
      );
    default:
      return '';
  }
}

export function puntoSvg(expr: PuntoExpr = 'atento', opts: PuntoOptions = {}): string {
  const { size = 48, label, decor = false, alive = false } = opts;
  // Sin decoración se recorta al círculo para usarlo como avatar.
  const viewBox = decor ? '0 0 200 200' : '24 32 152 152';
  const a11y = label
    ? `role="img" aria-label="${label.replace(/"/g, '&quot;')}"`
    : 'aria-hidden="true" focusable="false"';

  let body = `<circle cx="100" cy="108" r="72" fill="${ENERGIA}"/>${eyes(expr, alive)}`;
  if (alive) {
    body = expr === 'saluda' ? `<g class="punto-sway">${body}</g>` : `<g class="punto-bob">${body}</g>`;
  }

  return (
    `<svg class="punto" width="${size}" height="${size}" viewBox="${viewBox}" ${a11y} xmlns="http://www.w3.org/2000/svg">` +
    body +
    (decor ? extras(expr) : '') +
    `</svg>`
  );
}
