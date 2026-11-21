/**
 * Wordmark Interforma — isotipo CSS + logotipo "interforma".
 * Replica exacta del Wordmark.astro del sitio principal.
 */
export default function Wordmark({ size = "sm", tone = "light" }: { size?: "sm" | "md"; tone?: "light" | "dark" }) {
  const markSize = size === "md" ? 30 : 24;
  const fontSize = size === "md" ? 24 : 20;
  const textColor = tone === "dark" ? "var(--white)" : "var(--ink)";
  const moduleColor = tone === "dark" ? "var(--white)" : "var(--ink)";

  return (
    <span className="inline-flex items-center gap-[10px]" style={{ color: textColor }}>
      <span
        className="relative block shrink-0"
        style={{ width: markSize, height: markSize }}
        aria-hidden="true"
      >
        {/* Module A — square */}
        <span
          className="absolute"
          style={{
            width: "25%", height: "25%",
            left: "11.667%", top: "63.333%",
            borderRadius: "10%",
            background: moduleColor,
          }}
        />
        {/* Module B — rounded */}
        <span
          className="absolute"
          style={{
            width: "25%", height: "25%",
            left: "37.5%", top: "37.5%",
            borderRadius: "30%",
            background: moduleColor,
          }}
        />
        {/* Module C — circle Energía */}
        <span
          className="absolute"
          style={{
            width: "25%", height: "25%",
            left: "63.333%", top: "11.667%",
            borderRadius: "50%",
            background: "var(--brand-500)",
          }}
        />
      </span>
      <span
        className="font-heading leading-none"
        style={{ fontSize, letterSpacing: "-0.03em", fontWeight: 500 }}
      >
        interforma
      </span>
    </span>
  );
}
