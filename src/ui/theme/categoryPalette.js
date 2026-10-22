// Tonos de área (DESIGN v4 §1.5): cada área es dueña de su color en celdas, muestras y fondos teñidos.
// Devuelven tokens CSS (--cat-*) para que cada tema (tokens.css / light.css) ajuste la luminosidad.
const PALETTES = {
  react: {
    fundamentals: "cyan", state: "orange", effects: "violet", rendering: "lime", architecture: "blue",
    quality: "orchid", platform: "teal", designSystem: "rose", runtime: "yellow", operations: "coral", leadership: "green",
  },
  rails: {
    fundamentals: "coral", activerecord: "rose", patterns: "blue", sti: "violet",
    infra: "cyan", assets: "green", testing: "lime",
  },
};

export function getCategoryColor(graphId, catId, fallbackHex) {
  const hue = PALETTES[graphId]?.[catId];
  if (hue) return `var(--cat-${hue})`;
  return fallbackHex ? `color-mix(in oklch, ${fallbackHex} 60%, var(--text-2))` : "var(--text-3)";
}
