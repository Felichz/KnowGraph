import { useMemo } from "react";
import { CoverageRings, GUIDE_LABEL, getNodeVisual, nodeAriaLabel, truncateLabel } from "./graphViewData.jsx";
import { usePanZoom } from "./usePanZoom.js";

const COLUMNS = 5;
const DX = 205;
const DY = 175;
const PAD_TOP = 90;
const PAD_BOTTOM = 90;
const PAD_LEFT = 210;
const PAD_RIGHT = 70;

// Vista "Ruta": todos los conceptos en orden de prioridad forman un camino en
// serpiente. Los tramos completados se iluminan y las bandas de milestone
// muestran en qué etapa del viaje estás. Comunica progreso como recorrido.
export default function GraphPathView({ context, selected, onToggleNode, onBackgroundClick }) {
  const { graph, checked, milestoneProgress } = context;
  const { ref, view, wasDragged, panHandlers } = usePanZoom({ min: 0.25, max: 2, initial: { x: 16, y: 14, k: 0.8 } });

  const layout = useMemo(() => {
    const ordered = [...graph.nodes].sort((a, b) => a.priority - b.priority);
    const positions = new Map();
    const width = PAD_LEFT + (COLUMNS - 1) * DX + PAD_RIGHT;
    const rows = Math.max(1, Math.ceil(ordered.length / COLUMNS));

    ordered.forEach((node, index) => {
      const row = Math.floor(index / COLUMNS);
      const column = index % COLUMNS;
      const effectiveColumn = row % 2 === 0 ? column : COLUMNS - 1 - column;
      positions.set(node.id, {
        node,
        index,
        row,
        x: PAD_LEFT + effectiveColumn * DX,
        y: PAD_TOP + row * DY,
      });
    });

    // Tramos del camino entre conceptos consecutivos en el orden pedagógico.
    const segments = [];
    for (let index = 0; index < ordered.length - 1; index += 1) {
      const a = positions.get(ordered[index].id);
      const b = positions.get(ordered[index + 1].id);
      const sameRow = a.row === b.row;
      const midX = (a.x + b.x) / 2;
      const d = sameRow
        ? `M ${a.x} ${a.y} L ${b.x} ${b.y}`
        : `M ${a.x} ${a.y} C ${midX} ${a.y + 70}, ${midX} ${b.y - 70}, ${b.x} ${b.y}`;
      segments.push({
        id: `${a.node.id}~${b.node.id}`,
        d,
        complete: checked.has(a.node.id) && checked.has(b.node.id),
        guideTarget: ordered[index + 1].id,
      });
    }

    // Arcos tenues para dependencias que saltan posiciones en el camino.
    const skipEdges = graph.edges
      .map(([source, target]) => ({ source: positions.get(source), target: positions.get(target) }))
      .filter((pair) => pair.source && pair.target && pair.target.index - pair.source.index > 1)
      .map((pair) => {
        const midX = (pair.source.x + pair.target.x) / 2;
        const lift = Math.min(120, 30 + (pair.target.index - pair.source.index) * 8);
        return {
          id: `${pair.source.node.id}->${pair.target.node.id}`,
          targetId: pair.target.node.id,
          d: `M ${pair.source.x} ${pair.source.y} Q ${midX} ${Math.min(pair.source.y, pair.target.y) - lift}, ${pair.target.x} ${pair.target.y}`,
        };
      });

    // Bandas de milestone: cubren las filas donde viven sus nodos.
    const bands = milestoneProgress
      .map((milestone) => {
        const rowsSpanned = milestone.nodeIds
          .map((id) => positions.get(id))
          .filter(Boolean)
          .map((position) => position.row);
        if (!rowsSpanned.length) return null;
        const rowMin = Math.min(...rowsSpanned);
        const rowMax = Math.max(...rowsSpanned);
        return {
          ...milestone,
          y: PAD_TOP + rowMin * DY - 62,
          height: (rowMax - rowMin) * DY + 124,
        };
      })
      .filter(Boolean);

    return {
      positions,
      segments,
      skipEdges,
      bands,
      width,
      height: PAD_TOP + (rows - 1) * DY + PAD_BOTTOM + 60,
    };
  }, [graph, checked, milestoneProgress]);

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
      aria-label="Vista de ruta guiada"
      onClick={(event) => { if (!event.target.closest(".gv-node")) onBackgroundClick(); }}
      {...panHandlers}
    >
      <defs>
        <linearGradient id="pathBgGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141824" />
          <stop offset="100%" stopColor="#0B0D13" />
        </linearGradient>
        <marker id="path-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#667080" />
        </marker>
      </defs>
      <rect width={layout.width} height={layout.height} fill="url(#pathBgGlow)" />
      <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
        {layout.bands.map((band) => (
          <g key={band.id} pointerEvents="none">
            <rect
              className="gv-path-band"
              x={34}
              y={band.y}
              width={layout.width - 68}
              height={band.height}
              rx={18}
              style={{ "--band-color": band.color }}
            />
            <text className="gv-path-band-label" x={52} y={band.y + 30} style={{ "--band-color": band.color }}>
              {band.percentage === 100 ? `✓ ${band.label}` : band.label}
            </text>
            <text className="gv-path-band-progress" x={52} y={band.y + 48}>
              {band.done}/{band.total} · {band.percentage}%
            </text>
          </g>
        ))}

        {layout.segments.map((segment) => {
          const targetVisual = getNodeVisual(layout.positions.get(segment.guideTarget).node, context);
          return (
            <g key={segment.id} pointerEvents="none">
              <path className="gv-road" d={segment.d} />
              {segment.complete && <path className="gv-road-done" d={segment.d} />}
              {targetVisual.guideLevel === 1 && !segment.complete && <path className="gv-road-next" d={segment.d} />}
            </g>
          );
        })}

        {layout.skipEdges.map((edge) => {
          const targetVisual = getNodeVisual(layout.positions.get(edge.targetId).node, context);
          if (targetVisual.dimmed) return null;
          return (
            <path
              key={edge.id}
              className="gv-edge"
              d={edge.d}
              stroke={targetVisual.guideLevel ? "#E8A33D" : "#3A404D"}
              strokeOpacity={targetVisual.guideLevel ? 0.65 : 0.28}
              strokeWidth={1.1}
              strokeDasharray="5 6"
              fill="none"
              markerEnd="url(#path-arrow)"
            />
          );
        })}

        {[...layout.positions.values()].map(({ node, x, y }) => {
          const visual = getNodeVisual(node, context);
          const isSelected = selected?.id === node.id;
          const nodeRadius = isSelected ? 22 : visual.guideLevel === 1 ? 20 : 17;
          return (
            <g
              key={node.id}
              className={`gv-node gv-path-node guide-node-${visual.guideLevel}`}
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
              {visual.guideLevel === 1 && <circle r={nodeRadius + 10} fill="none" stroke="#F5F1E8" strokeOpacity={0.4} strokeWidth={2.4} className="primary-halo" />}
              {isSelected && <circle r={nodeRadius + 14} fill="none" stroke={visual.color} strokeOpacity={0.25} strokeWidth={6} className="selected-halo" />}
              <CoverageRings visual={visual} radius={nodeRadius} stroke={3.4} />
              {visual.isChecked ? (
                <path d="M -7 0 L -2 5.5 L 8 -7" stroke={visual.color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ) : (
                <text className="gv-path-number" y={5} textAnchor="middle">{node.priority}</text>
              )}
              {visual.guideLevel > 0 && (
                <text className={`guide-badge guide-badge-${visual.guideLevel}`} y={-nodeRadius - 10} textAnchor="middle">
                  {GUIDE_LABEL[visual.guideLevel]}
                </text>
              )}
              <text className="gv-path-label" y={nodeRadius + 20} textAnchor="middle">
                {truncateLabel(node.label, 22)}
              </text>
              {visual.extra > 0 && (
                <text className="gv-bonus" y={nodeRadius + 36} textAnchor="middle">+{visual.extra}</text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
