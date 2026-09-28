// Paletas de categoría armonizadas en OKLCH (DESIGN §1.5). Solo para puntos y trazos.
// Devuelven tokens CSS (--cat-*) para que cada tema (tokens.css / light.css) ajuste la luminosidad.
const PALETTES = {
  react: {
    fundamentals: "cyan", state: "tan", effects: "lavender", rendering: "olive", architecture: "jade",
    quality: "orchid", platform: "sky", designSystem: "rose", runtime: "ochre", operations: "clay", leadership: "violet",
  },
  rails: {
    fundamentals: "tan", activerecord: "rose", patterns: "sky", sti: "lavender",
    infra: "cyan", assets: "jade", testing: "olive",
  },
};

export function getCategoryColor(graphId, catId, fallbackHex) {
  const hue = PALETTES[graphId]?.[catId];
  if (hue) return `var(--cat-${hue})`;
  return fallbackHex ? `color-mix(in oklch, ${fallbackHex} 60%, var(--text-2))` : "var(--text-3)";
}
