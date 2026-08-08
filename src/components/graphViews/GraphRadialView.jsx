import { useMemo } from "react";
import { CoverageRings, GUIDE_LABEL, GUIDE_STROKE, getNodeVisual, nodeAriaLabel, truncateLabel } from "./graphViewData.jsx";
import { usePanZoom } from "./usePanZoom.js";

const RING_BASE = 170;
const RING_GAP = 72;
const LABEL_PAD = 110;

function polar(cx, cy, radius, angle) {
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

// Vista "Radial": cada categoría es un sector de la constelación y los anillos
// concéntricos marcan el orden pedagógico (adentro = base, afuera = avanzado).
// El centro resume el progreso total.
export default function GraphRadialView({ context, selected, onToggleNode, onBackgroundClick }) {
  const { graph, checked } = context;

  const layout = useMemo(() => {
    const categories = Object.entries(graph.categories).filter(
      ([catId]) => graph.nodes.some((node) => node.cat === catId),
    );
    const sectorSpan = (Math.PI * 2) / Math.max(1, categories.length);
    const positions = new Map();
    const sectors = [];
    let maxRadius = RING_BASE;

    categories.forEach(([catId, category], index) => {
      const start = -Math.PI / 2 + index * sectorSpan;
      const mid = start + sectorSpan / 2;
      const laneNodes = graph.nodes
        .filter((node) => node.cat === catId)
        .sort((a, b) => a.priority - b.priority);
      laneNodes.forEach((node, ringIndex) => {
        const radius = RING_BASE + ringIndex * RING_GAP;
        // Pequeño abanico angular alternado para que las etiquetas respiren.
        const angle = mid + (ringIndex % 2 === 0 ? -1 : 1) * Math.min(0.035, sectorSpan * 0.06) * Math.ceil(ringIndex / 2);
        positions.set(node.id, { node, radius, angle });
        maxRadius = Math.max(maxRadius, radius);
      });
      const done = laneNodes.filter((node) => checked.has(node.id)).length;
      sectors.push({ catId, category, start, mid, end: start + sectorSpan, total: laneNodes.length, done });
    });

    const size = (maxRadius + LABEL_PAD) * 2;
    const cx = size / 2;
    const cy = size / 2;
    const edges = graph.edges
      .filter(([source, target]) => positions.has(source) && positions.has(target))
      .map(([source, target]) => {
        const a = positions.get(source);
        const b = positions.get(target);
        const pa = polar(cx, cy, a.radius, a.angle);
        const pb = polar(cx, cy, b.radius, b.angle);
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        // Control point tirando hacia el centro: las dependencias se leen como
        // arcos que atraviesan la constelación.
        const control = { x: mx - (mx - cx) * 0.55, y: my - (my - cy) * 0.55 };
        return { id: `${source}->${target}`, sourceId: source, targetId: target, d: `M ${pa.x} ${pa.y} Q ${control.x} ${control.y} ${pb.x} ${pb.y}` };
      });

    const ringCount = Math.ceil((maxRadius - RING_BASE) / RING_GAP) + 1;
    return { sectors, positions, edges, size, cx, cy, maxRadius, ringCount };
  }, [graph, checked]);

  // Encuadre inicial: toda la constelación centrada en la ventana fija.
  const initialView = {
    k: Math.min(1500 / layout.size, 950 / layout.size),
    x: 0,
    y: 0,
  };
  initialView.x = 750 - layout.cx * initialView.k;
  initialView.y = 475 - layout.cy * initialView.k;
  const { ref, view, wasDragged, panHandlers } = usePanZoom({ min: 0.2, max: 2, initial: initialView });

  const total = graph.nodes.length;
  const done = checked.size;
  const percentage = total ? Math.round((done / total) * 100) : 0;

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
      aria-label="Vista radial de constelación"
      onClick={(event) => { if (!event.target.closest(".gv-node")) onBackgroundClick(); }}
      {...panHandlers}
    >
      <defs>
        <radialGradient id="radialBgGlow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#171C28" />
          <stop offset="100%" stopColor="#0B0D13" />
        </radialGradient>
      </defs>
      <rect width={layout.size} height={layout.size} fill="url(#radialBgGlow)" />
      <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
        {Array.from({ length: layout.ringCount }, (_, index) => (
          <circle
            key={index}
            cx={layout.cx}
            cy={layout.cy}
            r={RING_BASE + index * RING_GAP}
            fill="none"
            stroke="#1E2431"
            strokeWidth={1}
            strokeDasharray="3 7"
          />
        ))}

        {layout.sectors.map((sector) => {
          const labelPoint = polar(layout.cx, layout.cy, layout.maxRadius + 56, sector.mid);
          const lineStart = polar(layout.cx, layout.cy, RING_BASE - 60, sector.start);
          const lineEnd = polar(layout.cx, layout.cy, layout.maxRadius + 24, sector.start);
          const active = context.activeCats.has(sector.catId);
          return (
            <g key={sector.catId} opacity={active ? 1 : 0.3}>
              <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke="#1E2431" strokeWidth={1} />
              <text
                className="gv-sector-label"
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                style={{ "--lane-color": sector.category.color }}
              >
                {sector.category.label} · {sector.done}/{sector.total}
              </text>
            </g>
          );
        })}

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
              strokeOpacity={dim ? 0.07 : guideStroke ? 0.8 : doneLink ? 0.45 : 0.3}
              strokeWidth={targetVisual.guideLevel === 1 ? 2.2 : doneLink ? 1.4 : 1}
              fill="none"
            />
          );
        })}

        {/* Hub central con el progreso total */}
        <g className="gv-hub" transform={`translate(${layout.cx},${layout.cy})`}>
          <circle r={64} fill="#12151E" stroke="#2A2E3A" strokeWidth={1.5} />
          <circle
            r={64}
            fill="none"
            stroke="#61DAFB"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 64} ${2 * Math.PI * 64}`}
            transform="rotate(-90)"
          />
          <text className="gv-hub-value" y={-2} textAnchor="middle">{percentage}%</text>
          <text className="gv-hub-label" y={18} textAnchor="middle">{done}/{total} dominado</text>
        </g>

        {[...layout.positions.values()].map(({ node, radius, angle }) => {
          const visual = getNodeVisual(node, context);
          const isSelected = selected?.id === node.id;
          const point = polar(layout.cx, layout.cy, radius, angle);
          const nodeRadius = isSelected ? 20 : visual.guideLevel === 1 ? 17 : 14;
          return (
            <g
              key={node.id}
              className={`gv-node gv-radial-node guide-node-${visual.guideLevel}`}
              transform={`translate(${point.x},${point.y})`}
              opacity={visual.dimmed ? 0.13 : 1}
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
              {visual.guideLevel === 1 && <circle r={nodeRadius + 9} fill="none" stroke="#F5F1E8" strokeOpacity={0.4} strokeWidth={2.4} className="primary-halo" />}
              {isSelected && <circle r={nodeRadius + 13} fill="none" stroke={visual.color} strokeOpacity={0.25} strokeWidth={6} className="selected-halo" />}
              <CoverageRings visual={visual} radius={nodeRadius} stroke={3.2} />
              {visual.isChecked && (
                <path d="M -6.5 0 L -2 5 L 7.5 -6.5" stroke={visual.color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              )}
              {visual.guideLevel > 0 && (
                <text className={`guide-badge guide-badge-${visual.guideLevel}`} y={-nodeRadius - 8} textAnchor="middle">
                  {GUIDE_LABEL[visual.guideLevel]}
                </text>
              )}
              <text className="gv-radial-label" y={nodeRadius + 16} textAnchor="middle">
                {truncateLabel(node.label, 20)}
              </text>
              {visual.extra > 0 && (
                <text className="gv-bonus" y={nodeRadius + 30} textAnchor="middle">+{visual.extra}</text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
