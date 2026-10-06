import { memo } from "react";
import { Check, Lock, Sparkles, Star } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { NODE_H, NODE_W, splitLabel } from "./graphUtils.js";

const ICON = { mastered: Check, extra: Star, blocked: Lock };

function statusText(t, state) {
  const score = Math.round(state.p.displayScore ?? 0);
  if (state.kind === "blocked") return t("graph.status.blocked", { n: state.missing.length });
  return t(`graph.status.${state.kind}`, { score });
}

// Ficha (specs/003-graph-view §C). Lejos: pastilla de estado. Cerca: punto de categoría, título e icono
// de estado (✓ dominada, ★ extra, candado bloqueada; las disponibles van con borde sólido brillante).
export const GraphNode = memo(function GraphNode({ node, graph, pos, state, level, stage, labeled, selected, dimmed, inactive, inChain, aiActive, tabIndex, onSelect, onOpen, onHover }) {
  const t = useT();
  const color = getCategoryColor(graph.id, node.cat, graph.categories[node.cat]?.color);
  const score = state.p.displayScore;
  const Icon = aiActive ? Sparkles : ICON[state.kind];
  const label = [node.label, t("graph.node.stage", { stage }), statusText(t, state),
    level === 1 ? t("map.card.aria.bestNext") : level ? t("map.card.aria.level", { level }) : null, aiActive ? t("map.card.aria.aiActive") : null].filter(Boolean).join(". ");
  const cls = ["gnode", `is-${state.kind}`, level === 1 && "is-best", selected && "is-selected", dimmed && "is-dimmed", inactive && "is-inactive", inChain && "is-chain", labeled ? "is-near" : "is-far"].filter(Boolean).join(" ");
  return (
    <g className={cls} transform={`translate(${pos.x} ${pos.y})`} role="button" tabIndex={tabIndex} aria-label={label} aria-hidden={inactive || undefined} data-node={node.id}
      onClick={() => onSelect(node.id)} onDoubleClick={() => onOpen(node.id)} onPointerEnter={() => onHover(node.id)} onPointerLeave={() => onHover(null)}
      onFocus={() => onSelect(node.id, { fromFocus: true })}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(node.id); } }}>
      {selected && <rect className="gnode__halo" x={-5} y={-5} width={NODE_W + 10} height={NODE_H + 10} rx={12} />}
      <rect className="gnode__body" width={NODE_W} height={NODE_H} rx={8} />
      {labeled && (
        <>
          <circle cx={13} cy={16} r={3.5} style={{ fill: color }} />
          {splitLabel(node.label).map((line, i) => <text key={i} className="gnode__label" x={23} y={20.5 + i * 17}>{line}</text>)}
          {Icon && <Icon x={NODE_W - 22} y={9} width={13} height={13} strokeWidth={2} className={`gnode__icon ${aiActive ? "ai-pulse" : ""}`} aria-hidden="true" />}
          {state.kind === "progress" && <text className="gnode__num" x={NODE_W - 9} y={20} textAnchor="end">{Math.round(score)}</text>}
          {typeof score === "number" && <rect className="gnode__score" x={9} y={NODE_H - 5} height={2} rx={1} width={(Math.min(score, 100) / 120) * (NODE_W - 18)} />}
          {score > 100 && <rect className="gnode__extra" x={9 + (100 / 120) * (NODE_W - 18) + 1} y={NODE_H - 5} height={2} rx={1} width={((Math.min(score, 120) - 100) / 120) * (NODE_W - 18) - 1} />}
        </>
      )}
    </g>
  );
});
