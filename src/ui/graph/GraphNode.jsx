import { memo } from "react";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { NODE_H, NODE_W, splitLabel, truncate } from "./graphUtils.js";

const RAIL_W = NODE_W - 24;

// Nodo del grafo 236×88 (design-spec D.9 + F.6a).
export const GraphNode = memo(function GraphNode({ node, graph, pos, p, level, state, aiActive, tabIndex, stage, onOpen, onHover, onFocusNode }) {
  const color = getCategoryColor(graph.id, node.cat, graph.categories[node.cat]?.color);
  const lines = splitLabel(node.label);
  const score = typeof p.displayScore === "number" ? Math.round(p.displayScore) : null;
  const base = score == null ? 0 : (Math.min(score, 100) / 120) * RAIL_W;
  const extra = score > 100 ? ((Math.min(score, 120) - 100) / 120) * RAIL_W : 0;
  const scoreText = score == null ? "Sin evaluar" : `${score > 100 ? "★ " : score === 100 ? "✓ " : ""}${score}/120`;
  const label = [node.label, `etapa ${stage}`, score == null ? "sin evaluar" : `puntaje ${score} de 120`,
    level === 1 ? "mejor siguiente" : level ? `nivel ${level} de la ruta sugerida` : null, aiActive ? "IA trabajando en esta card" : null].filter(Boolean).join(". ");
  return (
    <g className={`gnode ${state}`} transform={`translate(${pos.x} ${pos.y})`} role="button" tabIndex={tabIndex}
      aria-label={label} aria-hidden={state.includes("is-inactive") || undefined} data-node={node.id}
      onClick={() => onOpen(node)} onPointerEnter={() => onHover(node.id)} onPointerLeave={() => onHover(null)}
      onFocus={() => onFocusNode(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(node, true); } }}>
      <title>{`${node.label}. Etapa ${stage}. ${scoreText}`}</title>
      <rect className="gnode__focus" x={-3} y={-3} width={NODE_W + 6} height={NODE_H + 6} rx={15} />
      <g clipPath="url(#gnode-clip)">
        <rect className="gnode__rect node-rect" width={NODE_W} height={NODE_H} rx={12} />
        <rect width={NODE_W} height={2} fill={color} />
      </g>
      <rect className="gnode__border" x={0.5} y={0.5} width={NODE_W - 1} height={NODE_H - 1} rx={11.5} />
      <text className="gnode__cat" x={12} y={22}>{truncate(graph.categories[node.cat]?.label ?? node.cat)}</text>
      <text className={`gnode__score ${score > 100 ? "is-gold" : score === 100 ? "is-mastery" : ""}`} x={NODE_W - 12} y={22} textAnchor="end">
        {aiActive ? "✦ " : ""}{scoreText}
      </text>
      {lines.map((line, i) => <text key={i} className="gnode__label" x={12} y={44 + i * 20}>{line}</text>)}
      <g transform={`translate(12 ${NODE_H - 12})`}>
        <rect className="gnode__track" width={RAIL_W} height={4} rx={2} />
        {base > 0 && <rect className={score >= 100 ? "gnode__base is-mastered" : "gnode__base"} width={base} height={4} rx={2} />}
        {extra > 0 && <rect className="gnode__extra" x={(100 / 120) * RAIL_W + 1} width={extra - 1} height={4} rx={2} />}
        <rect className="gnode__mark" x={(100 / 120) * RAIL_W} y={-2} width={1} height={8} />
      </g>
      {level === 1 && (
        <g transform={`translate(${NODE_W - 108} -12)`} className="gnode__badge">
          <rect width={108} height={20} rx={10} /><text x={54} y={14} textAnchor="middle">Mejor siguiente</text>
        </g>
      )}
      {level > 1 && <text className="gnode__level" x={NODE_W} y={-8} textAnchor="end">Nivel {level}</text>}
    </g>
  );
});
