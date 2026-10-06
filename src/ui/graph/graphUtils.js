// Geometría del grafo (specs/003-graph-view §B). Unidades de mundo; la cámara escala.
// Etapas en columnas de izquierda a derecha: una etapa entera (hasta 14 conceptos) cabe en alto
// a zoom legible, así que la vista principal muestra ~5 etapas completas con títulos.
export const NODE_W = 176;
export const NODE_H = 46;
export const LAYOUT = { nodeWidth: NODE_W, nodeHeight: NODE_H, columnGap: 44, rowGap: 10, paddingX: 24, paddingTop: 24, paddingBottom: 24, align: "center" };
export const STEP_X = NODE_W + LAYOUT.columnGap;
// Zoom semántico: por debajo de LABEL_K las fichas son pastillas sin texto (el minimapa da el conjunto).
export const LABEL_K = 0.62;
export const MIN_K = 0.12;
export const MAX_K = 1.6;

export const rankX = (rank) => LAYOUT.paddingX + rank * STEP_X;

// Dos líneas; la primera deja hueco al icono de estado de la esquina.
export function splitLabel(label, first = 16, second = 19) {
  const words = label.split(/\s+/).filter(Boolean);
  const lines = [""];
  words.forEach((word) => {
    const current = lines.at(-1);
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= (lines.length === 1 ? first : second) || lines.length === 2) lines[lines.length - 1] = candidate;
    else lines.push(word);
  });
  if (lines[0].length > first) lines[0] = `${lines[0].slice(0, first - 1).trim()}…`;
  if (lines[1]?.length > second) lines[1] = `${lines[1].slice(0, second - 1).trim()}…`;
  return lines.slice(0, 2);
}

export function edgePath(source, target) {
  const x1 = source.x + NODE_W;
  const y1 = source.y + NODE_H / 2;
  const x2 = target.x;
  const y2 = target.y + NODE_H / 2;
  const distance = Math.max(LAYOUT.columnGap / 2, (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + distance} ${y1}, ${x2 - distance} ${y2}, ${x2} ${y2}`;
}

const clampK = (k) => Math.min(MAX_K, Math.max(MIN_K, k));

export function boundsOf(positions) {
  if (!positions.length) return { x: 0, y: 0, width: NODE_W, height: NODE_H };
  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) + NODE_W - x, height: Math.max(...ys) + NODE_H - y };
}

// Encuadre completo (botón «ver todo»).
export function fitView(bounds, viewport, inset) {
  const w = viewport.width - inset.left - inset.right;
  const h = viewport.height - inset.top - inset.bottom;
  const k = clampK(Math.min(1, w / bounds.width, h / bounds.height));
  return { k, x: inset.left + (w - bounds.width * k) / 2 - bounds.x * k, y: inset.top + (h - bounds.height * k) / 2 - bounds.y * k };
}

// Vista inicial legible: la etapa más alta entra en alto (zoom 0.78–1) y la columna del concepto
// ancla queda a un tercio, con sus prerrequisitos a la izquierda y lo que sigue a la derecha.
export function readableView(bounds, anchor, viewport, inset) {
  const h = viewport.height - inset.top - inset.bottom;
  const k = Math.min(1, Math.max(0.78, h / bounds.height));
  const left = inset.left - bounds.x * k;
  // Nunca se deja hueco a la izquierda de la primera etapa.
  const x = anchor ? Math.min(left, inset.left + (viewport.width - inset.left - inset.right) * 0.34 - (anchor.x + NODE_W / 2) * k) : left;
  const contentH = bounds.height * k;
  const y = contentH <= h ? inset.top + (h - contentH) / 2 - bounds.y * k : inset.top + h / 2 - (anchor ? anchor.y + NODE_H / 2 : bounds.y) * k;
  return { k, x, y };
}

export function centerOn(position, viewport, k) {
  const z = clampK(k);
  return { k: z, x: viewport.width / 2 - (position.x + NODE_W / 2) * z, y: viewport.height / 2 - (position.y + NODE_H / 2) * z };
}

export function isOffscreen(position, view, viewport, margin = 32) {
  const sx = position.x * view.k + view.x;
  const sy = position.y * view.k + view.y;
  return sx < margin || sy < margin || sx + NODE_W * view.k > viewport.width - margin || sy + NODE_H * view.k > viewport.height - margin;
}

// Navegación por teclado: ←/→ etapa anterior/siguiente (nodo más cercano en Y), ↑/↓ dentro de la etapa.
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
