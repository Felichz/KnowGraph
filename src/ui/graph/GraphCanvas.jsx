import { useMemo } from "react";
import { useT } from "../../i18n/react.js";
import { STEP_X, edgePath, rankX } from "./graphUtils.js";
import { GraphNode } from "./GraphNode.jsx";

// Lienzo SVG: bandas de etapa, todas las aristas y las fichas (specs/003-graph-view §E).
export function GraphCanvas({ layout, graph, view, animate, focus, states, nodeProps, viewport, labeled }) {
  const t = useT();
  const { positions, layers, config } = layout;
  const edges = useMemo(() => layout.edges.map(([s, tg]) => ({ key: `${s}->${tg}`, s, d: edgePath(positions.get(s), positions.get(tg)) })), [layout, positions]);
  const focused = focus.nodes.size > 0;
  const met = (id) => ["mastered", "extra"].includes(states.get(id)?.kind);
  return (
    <svg className="graph-svg" width="100%" height="100%" role="application" aria-roledescription={t("graph.canvas.roleDescription")}
      aria-label={t("graph.canvas.label", { graph: graph.label, stages: layout.maxRank + 1, edges: layout.edges.length })} {...viewport.handlers} ref={viewport.ref}>
      <g className={animate ? "graph-world is-animated" : "graph-world"} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
        {layers.map((_, rank) => (rank % 2 === 1 ? (
          <rect key={rank} className="gband" x={rankX(rank) - config.columnGap / 2} y={-4000} width={STEP_X} height={layout.height + 8000} />
        ) : null))}
        <g className={focused ? "gedges is-quiet" : "gedges"}>
          {edges.map((edge) => (focus.chainEdges.has(edge.key) || focus.outEdges.has(edge.key) ? null : <path key={edge.key} d={edge.d} />))}
        </g>
        <g className="gedges-focus">
          {edges.filter((edge) => focus.outEdges.has(edge.key)).map((edge) => <path key={edge.key} d={edge.d} className="gedge is-out" />)}
          {edges.filter((edge) => focus.chainEdges.has(edge.key)).map((edge) => (
            <path key={edge.key} d={edge.d} className={`gedge is-chain ${met(edge.s) ? "is-met" : "is-missing"}`} />
          ))}
        </g>
        {[...positions.values()].map((pos) => <GraphNode key={pos.node.id} pos={pos} graph={graph} labeled={labeled} {...nodeProps(pos)} />)}
      </g>
    </svg>
  );
}
