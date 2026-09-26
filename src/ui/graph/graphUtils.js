// Utilidades del grafo topológico (design-spec D.9 GraphNode).
export const NODE_W = 236;
export const NODE_H = 88;

export function splitLabel(label, maxChars = 29) {
  const words = label.split(/\s+/).filter(Boolean);
  const lines = [""];
  words.forEach((word) => {
    const current = lines.at(-1);
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || lines.length === 2) lines[lines.length - 1] = candidate;
    else lines.push(word);
  });
  if (lines[1]?.length > maxChars) lines[1] = `${lines[1].slice(0, maxChars - 1).trim()}…`;
  return lines.slice(0, 2);
}

export function truncate(text, max = 19) {
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}

export function edgePath(source, target) {
  const x1 = source.x + NODE_W;
  const y1 = source.y + NODE_H / 2;
  const x2 = target.x;
  const y2 = target.y + NODE_H / 2;
  const distance = Math.max(54, (x2 - x1) * 0.46);
  return `M ${x1} ${y1} C ${x1 + distance} ${y1}, ${x2 - distance} ${y2}, ${x2} ${y2}`;
}

// Encuadre inicial: columnas enteras desde el nodo primario (escala ≤ 1.04).
export function viewForPosition(position, config, viewport) {
  const inset = Math.min(72, Math.max(24, Math.round(viewport.width * 0.055)));
  const available = Math.max(config.nodeWidth, viewport.width - inset * 2);
  const step = config.nodeWidth + config.columnGap;
  const minScale = viewport.width <= 760 ? 0.84 : 0.88;
  let columns = 1;
  while (available / (config.nodeWidth + columns * step) >= minScale) columns += 1;
  const k = Math.min(1.04, available / (config.nodeWidth + (columns - 1) * step));
  return { k, x: inset - position.x * k, y: viewport.height / 2 - (position.y + config.nodeHeight / 2) * k };
}

export function fitView(layout, viewport) {
  const k = Math.max(0.18, Math.min(1.04, (viewport.width - 48) / layout.width, (viewport.height - 48) / layout.height));
  return { k, x: (viewport.width - layout.width * k) / 2, y: (viewport.height - layout.height * k) / 2 };
}

export function centerOn(position, viewport, k) {
  return { k, x: viewport.width / 2 - (position.x + NODE_W / 2) * k, y: viewport.height / 2 - (position.y + NODE_H / 2) * k };
}

// Navegación por teclado (F.6a): ←/→ etapa anterior/siguiente (nodo más cercano en Y), ↑/↓ dentro de la etapa.
export function neighborInDirection(layout, fromId, key, isActive) {
  const from = layout.positions.get(fromId);
  if (!from) return null;
  const candidates = [...layout.positions.values()].filter((p) => isActive(p.node.id) && p.node.id !== fromId);
  if (key === "ArrowUp" || key === "ArrowDown") {
    const same = candidates.filter((p) => p.rank === from.rank).sort((a, b) => a.y - b.y);
    const next = key === "ArrowDown" ? same.find((p) => p.y > from.y) : [...same].reverse().find((p) => p.y < from.y);
    return next?.node.id ?? null;
  }
  const dir = key === "ArrowRight" ? 1 : -1;
  for (let rank = from.rank + dir; rank >= 0 && rank <= layout.maxRank; rank += dir) {
    const inRank = candidates.filter((p) => p.rank === rank);
    if (inRank.length) return inRank.sort((a, b) => Math.abs(a.y - from.y) - Math.abs(b.y - from.y))[0].node.id;
  }
  return null;
}
