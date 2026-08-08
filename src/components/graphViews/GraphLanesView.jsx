import { useMemo } from "react";
import { CoverageRings, GUIDE_LABEL, GUIDE_STROKE, getNodeVisual, nodeAriaLabel, truncateLabel } from "./graphViewData.jsx";
import { usePanZoom } from "./usePanZoom.js";

const LANE_WIDTH = 300;
const CARD_W = 224;
const CARD_H = 52;
const ROW_H = 66;
const HEADER_H = 72;
const PAD = 46;

function edgePath(source, target) {
  const x1 = source.x + CARD_W;
  const y1 = source.y + CARD_H / 2;
  const x2 = target.x;
  const y2 = target.y + CARD_H / 2;
  const forward = x2 >= x1;
  const dx = Math.max(56, Math.abs(x2 - x1) * 0.45);
  return `M ${x1} ${y1} C ${forward ? x1 + dx : x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

// Vista "Carriles": cada categoría es una columna; los nodos se apilan por
// prioridad pedagógica. El grafo se lee de izquierda a derecha como un plan
// de estudio estructurado.
export default function GraphLanesView({ context, selected, onToggleNode, onBackgroundClick }) {
  const { graph, activeCats, checked, milestoneByNodeId } = context;
  const { ref, view, wasDragged, panHandlers } = usePanZoom({ initial: { x: 24, y: 16, k: 0.9 } });

  const layout = useMemo(() => {
    const lanes = [];
    const positions = new Map();
    let maxRows = 0;
    Object.entries(graph.categories).forEach(([catId, category], colIndex) => {
      const laneNodes = graph.nodes
        .filter((node) => node.cat === catId)
        .sort((a, b) => a.priority - b.priority);
      if (!laneNodes.length) return;
      const x = PAD + colIndex * LANE_WIDTH;
      const done = laneNodes.filter((node) => checked.has(node.id)).length;
      lanes.push({ catId, category, x, total: laneNodes.length, done, active: activeCats.has(catId) });
      laneNodes.forEach((node, rowIndex) => {
        positions.set(node.id, { node, x, y: PAD + HEADER_H + rowIndex * ROW_H });
      });
      maxRows = Math.max(maxRows, laneNodes.length);
    });
    const edges = graph.edges
      .filter(([source, target]) => positions.has(source) && positions.has(target))
      .map(([source, target]) => ({
        id: `${source}->${target}`,
        sourceId: source,
        targetId: target,
        d: edgePath(positions.get(source), positions.get(target)),
      }));
    return {
      lanes,
      positions,
      edges,
      width: PAD * 2 + Math.max(1, lanes.length - 1) * LANE_WIDTH + CARD_W,
      height: PAD * 2 + HEADER_H + maxRows * ROW_H,
    };
  }, [graph, activeCats, checked]);

  const selectNode = (node) => {
    if (wasDragged()) return;
    onToggleNode(node);
  };

  return (
    <svg
      ref={ref}
      className="graph graph-variant"
      viewBox="0 0 1500 950"
      role="application"
      aria-label="Vista de carriles por categoría"
      onClick={(event) => { if (!event.target.closest(".gv-node")) onBackgroundClick(); }}
      {...panHandlers}
    >
      <defs>
        <radialGradient id="lanesBgGlow" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#141824" />
          <stop offset="100%" stopColor="#0B0D13" />
        </radialGradient>
        <marker id="lanes-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#667080" />
        </marker>
      </defs>
      <rect width={layout.width} height={layout.height} fill="url(#lanesBgGlow)" />
      <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
        {layout.lanes.map((lane) => (
          <g key={lane.catId} opacity={lane.active ? 1 : 0.35}>
            <rect
              className="gv-lane-bg"
              x={lane.x - 14}
              y={PAD - 8}
              width={CARD_W + 28}
              height={layout.height - PAD * 2 + 16}
              rx={14}
              style={{ "--lane-color": lane.category.color }}
            />
            <text className="gv-lane-title" x={lane.x} y={PAD + 16} style={{ "--lane-color": lane.category.color }}>
              {lane.category.label}
            </text>
            <text className="gv-lane-progress" x={lane.x} y={PAD + 34}>
              {lane.done}/{lane.total} cubiertos
            </text>
          </g>
        ))}

        {layout.edges.map((edge) => {
          const sourceVisual = getNodeVisual(layout.positions.get(edge.sourceId).node, context);
          const targetVisual = getNodeVisual(layout.positions.get(edge.targetId).node, context);
          const guideStroke = GUIDE_STROKE[targetVisual.guideLevel] ?? null;
          const doneLink = sourceVisual.isChecked && targetVisual.isChecked;
          const dim = sourceVisual.dimmed || targetVisual.dimmed;
          return (
            <path
              key={edge.id}
              className="gv-edge"
              d={edge.d}
              stroke={guideStroke ?? (doneLink ? "#CC342D" : "#3A404D")}
              strokeOpacity={dim ? 0.08 : guideStroke ? 0.8 : doneLink ? 0.5 : 0.34}
              strokeWidth={targetVisual.guideLevel === 1 ? 2.4 : doneLink ? 1.5 : 1.1}
              markerEnd="url(#lanes-arrow)"
            />
          );
        })}

        {[...layout.positions.values()].map(({ node, x, y }) => {
          const visual = getNodeVisual(node, context);
          const isSelected = selected?.id === node.id;
          const milestone = milestoneByNodeId.get(node.id);
          return (
            <g
              key={node.id}
              className={`gv-node gv-lane-node ${visual.guideLevel ? `guide-node-${visual.guideLevel}` : ""}`}
              transform={`translate(${x},${y})`}
              opacity={visual.dimmed ? 0.14 : 1}
              role="button"
              tabIndex={visual.dimmed ? -1 : 0}
              aria-label={nodeAriaLabel(node, visual)}
              aria-pressed={isSelected}
              onClick={(event) => { event.stopPropagation(); selectNode(node); }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onToggleNode(node);
              }}
            >
              <title>{`${node.label} · prioridad ${node.priority}`}</title>
              {visual.guideLevel > 0 && (
                <text className={`guide-badge guide-badge-${visual.guideLevel}`} x={0} y={-8}>
                  {GUIDE_LABEL[visual.guideLevel]}
                </text>
              )}
              <rect
                className={`gv-card ${isSelected ? "is-selected" : ""} ${visual.isChecked ? "is-checked" : ""}`}
                width={CARD_W}
                height={CARD_H}
                rx={10}
                style={{ "--node-color": visual.color }}
              />
              {milestone && (
                <rect x={0} y={8} width={4} height={CARD_H - 16} rx={2} fill={milestone.color} opacity={0.85} />
              )}
              <g transform="translate(30, 26)">
                <CoverageRings visual={visual} radius={13} />
                {visual.isChecked ? (
                  <path d="M -6 0 L -1.5 5 L 7 -6" stroke="#F5F1E8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ) : (
                  visual.coverage > 0 && <text className="gv-percent" y={3.5} textAnchor="middle">{visual.coverage}</text>
                )}
              </g>
              <text className="gv-card-label" x={54} y={26} dominantBaseline="middle">
                {truncateLabel(node.label, 24)}
              </text>
              <text className="gv-card-priority" x={54} y={42}>
                #{node.priority}
              </text>
              {visual.extra > 0 && (
                <text className="gv-bonus" x={CARD_W - 10} y={CARD_H - 8} textAnchor="end">+{visual.extra}</text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
