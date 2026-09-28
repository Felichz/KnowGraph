import { NODE_W, edgePath } from "./graphUtils.js";
import { useT } from "../../i18n/react.js";
import { GraphNode } from "./GraphNode.jsx";

// SVG del grafo: columnas de etapa, aristas y nodos (INF-040…043).
export function GraphCanvas({ layout, graph, view, focus, hovered, guideEdges, nodeProps, viewport }) {
  const t = useT();
  const { positions, layers, config } = layout;
  const visibleEdges = layout.edges.filter(([source, target]) => {
    const key = `${source}->${target}`;
    return hovered ? focus.edges.has(key) : guideEdges.has(key);
  });
  return (
    <svg className="graph-svg" width="100%" height="100%" role="application" aria-roledescription={t("graph.canvas.roleDescription")}
      aria-label={t("graph.canvas.label", { graph: graph.label, stages: layout.maxRank + 1, edges: layout.edges.length })} {...viewport.handlers} ref={viewport.ref}>
      <defs>
        <clipPath id="gnode-clip" clipPathUnits="userSpaceOnUse"><rect width={NODE_W} height={config.nodeHeight} rx={12} /></clipPath>
        <marker id="arrow-guide" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" className="garrow garrow--guide" /></marker>
        <marker id="arrow-out" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" className="garrow garrow--out" /></marker>
        <marker id="arrow-in" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" className="garrow garrow--in" /></marker>
      </defs>
      <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
        {layers.map((layer, rank) => (
          <g key={rank} transform={`translate(${config.paddingX + rank * (config.nodeWidth + config.columnGap)} ${config.paddingTop - 64})`} className="gstage">
            <text className="gstage__index" y={0}>{t("graph.stage.index", { n: rank + 1 })}</text>
            <text className="gstage__count" y={20}>{rank === 0 ? t("graph.stage.start") : t("graph.stage.count", { n: layer.length })}</text>
          </g>
        ))}
        {visibleEdges.map(([source, target]) => {
          const key = `${source}->${target}`;
          const kind = !hovered ? "guide" : target === hovered ? "in" : "out";
          return <path key={key} d={edgePath(positions.get(source), positions.get(target))} className={`gedge gedge--${kind}`} markerEnd={`url(#arrow-${kind})`} />;
        })}
        {[...positions.values()].map((pos) => <GraphNode key={pos.node.id} pos={pos} graph={graph} {...nodeProps(pos)} />)}
      </g>
    </svg>
  );
}
