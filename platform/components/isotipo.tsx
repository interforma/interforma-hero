/** Isotipo Interforma — tres módulos en diagonal (cuadrado → redondeado → círculo Energía). */
export default function Isotipo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <rect width="120" height="120" rx="28" fill="#281F18"/>
      <rect x="13" y="75" width="32" height="32" rx="4" fill="#F2F1EE"/>
      <rect x="44" y="44" width="32" height="32" rx="10" fill="#F2F1EE"/>
      <rect x="75" y="13" width="32" height="32" rx="16" fill="#EE6E43"/>
    </svg>
  );
}
