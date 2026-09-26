// Paletas de categoría armonizadas en OKLCH (DESIGN §1.5). Solo para puntos y trazos.
const PALETTES = {
  react: {
    fundamentals: "#5DBBC6", state: "#D0A16B", effects: "#AAA1E0", rendering: "#A3B472", architecture: "#6CBDA2",
    quality: "#CF95C1", platform: "#6BB6D9", designSystem: "#DA93A8", runtime: "#C1A966", operations: "#DB997B", leadership: "#BC9BD6",
  },
  rails: {
    fundamentals: "#D0A16B", activerecord: "#DA93A8", patterns: "#6BB6D9", sti: "#AAA1E0",
    infra: "#5DBBC6", assets: "#6CBDA2", testing: "#A3B472",
  },
};

export function getCategoryColor(graphId, catId, fallbackHex) {
  return PALETTES[graphId]?.[catId] ?? (fallbackHex ? `color-mix(in oklch, ${fallbackHex} 60%, var(--text-2))` : "var(--text-3)");
}
