/**
 * Punto — mascota de Interforma.
 * El círculo Energía del isotipo con ojos. Es un personaje aparte del logo.
 * Adaptado de src/lib/punto.ts del sitio principal.
 */

type PuntoExpr = "atento" | "saluda" | "escucha" | "piensa" | "celebra" | "uy" | "duerme";

const INK = "#281F18";
const ENERGIA = "#EE6E43";
const CIELO = "#CCE2ED";

function getEyes(expr: PuntoExpr) {
  switch (expr) {
    case "escucha":
      return (
        <>
          <ellipse cx="70" cy="104" rx="9" ry="16" fill={INK}/>
          <ellipse cx="104" cy="104" rx="9" ry="16" fill={INK}/>
        </>
      );
    case "piensa":
      return (
        <>
          <ellipse cx="94" cy="92" rx="9" ry="16" fill={INK}/>
          <ellipse cx="126" cy="92" rx="9" ry="16" fill={INK}/>
        </>
      );
    case "celebra":
      return (
        <path d="M70 102l12-14 12 14M106 102l12-14 12 14" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      );
    case "uy":
      return (
        <>
          <ellipse cx="82" cy="114" rx="8" ry="12" fill={INK}/>
          <ellipse cx="118" cy="114" rx="8" ry="12" fill={INK}/>
        </>
      );
    case "duerme":
      return (
        <>
          <path d="M66 104 q16 12 32 0" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none"/>
          <path d="M102 104 q16 12 32 0" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none"/>
        </>
      );
    case "saluda":
    case "atento":
    default:
      return (
        <>
          <ellipse cx="82" cy="100" rx="9" ry="16" fill={INK}/>
          <ellipse cx="118" cy="100" rx="9" ry="16" fill={INK}/>
        </>
      );
  }
}

function getExtras(expr: PuntoExpr) {
  switch (expr) {
    case "saluda":
      return (
        <g>
          <path d="M172 40l10-10M178 58l14-3M158 28l3-13" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none"/>
        </g>
      );
    case "piensa":
      return (
        <g>
          <circle cx="160" cy="40" r="5" fill={INK}/>
          <circle cx="174" cy="24" r="6.5" fill={INK}/>
          <circle cx="190" cy="8" r="8" fill={INK}/>
        </g>
      );
    case "celebra":
      return (
        <g>
          <rect x="14" y="26" width="12" height="12" rx="2" fill={INK}/>
          <rect x="172" y="20" width="10" height="10" rx="2" fill={INK}/>
          <circle cx="28" cy="150" r="5" fill={INK}/>
        </g>
      );
    case "uy":
      return (
        <path d="M156 56q-9 14 0 20q9-6 0-20z" fill={CIELO} stroke={INK} strokeWidth="2.5" strokeLinejoin="round"/>
      );
    case "duerme":
      return (
        <g>
          <text x="152" y="72" fontFamily="sans-serif" fontSize="18" fontWeight="bold" fill={INK}>Z</text>
          <text x="164" y="52" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>z</text>
          <text x="174" y="36" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill={INK}>z</text>
        </g>
      );
    default:
      return null;
  }
}

export default function Punto({
  expr = "atento",
  size = 48,
  decor = false,
}: {
  expr?: PuntoExpr;
  size?: number;
  decor?: boolean;
}) {
  const viewBox = decor ? "0 0 200 200" : "24 32 152 152";

  return (
    <svg
      className="punto"
      width={size}
      height={size}
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="108" r="72" fill={ENERGIA}/>
      {getEyes(expr)}
      {decor && getExtras(expr)}
    </svg>
  );
}
