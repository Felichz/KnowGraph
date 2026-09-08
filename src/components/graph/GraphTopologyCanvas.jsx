import React, { useMemo } from "react";
import { createTopologicalLayout } from "../../logic/topologicalLayout.js";
import { usePanZoom } from "../../hooks/usePanZoom.js";

export function GraphTopologyCanvas({ graph, progressMap = {}, onOpenNode }) {
  const layout = useMemo(() => createTopologicalLayout(graph), [graph]);
  const { ref, view, panHandlers, resetView, zoomIn, zoomOut } = usePanZoom({
    initial: { x: 50, y: 50, k: 0.8 },
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 125px)", overflow: "hidden" }}>
      {/* Floating Zoom Controls */}
      <div style={{
        position: "absolute", top: "16px", right: "16px", display: "flex", gap: "6px", zIndex: 20,
        background: "rgba(16, 22, 35, 0.85)", backdropFilter: "blur(8px)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-line)",
      }}>
        <button onClick={zoomIn} style={{ width: "28px", height: "28px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", fontWeight: 700 }}>+</button>
        <button onClick={zoomOut} style={{ width: "28px", height: "28px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", fontWeight: 700 }}>-</button>
        <button onClick={resetView} style={{ padding: "0 8px", height: "28px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", fontSize: "11px" }}>⟲ Centrar</button>
      </div>

      <svg ref={ref} {...panHandlers} style={{ width: "100%", height: "100%", cursor: "grab", background: "var(--bg-canvas, #06080e)" }}>
        <defs>
          <marker id="topo-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(255, 255, 255, 0.35)" />
          </marker>
        </defs>

        <g transform={`translate(${view.x}, ${view.y}) scale(${view.k})`}>
          {/* Stage Headers */}
          {layout.layers.map((layer, rank) => {
            const columnX = layout.config.paddingX + rank * (layout.config.nodeWidth + layout.config.columnGap);
            return (
              <g key={`stage-${rank}`}>
                <text x={columnX + layout.config.nodeWidth / 2} y={layout.config.paddingTop - 50} textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="12" fontWeight="700" letterSpacing="0.08em">
                  {`ETAPA ${rank + 1}`}
                </text>
                <line x1={columnX + layout.config.nodeWidth / 2} y1={layout.config.paddingTop - 35} x2={columnX + layout.config.nodeWidth / 2} y2={layout.config.paddingTop - 15} stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 2" />
              </g>
            );
          })}

          {/* Directed Edges */}
          {layout.edges.map(([sourceId, targetId]) => {
            const src = layout.positions.get(sourceId);
            const tgt = layout.positions.get(targetId);
            if (!src || !tgt) return null;
            const x1 = src.x + layout.config.nodeWidth;
            const y1 = src.y + layout.config.nodeHeight / 2;
            const x2 = tgt.x;
            const y2 = tgt.y + layout.config.nodeHeight / 2;
            const mx = (x1 + x2) / 2;
            return (
              <path key={`${sourceId}->${targetId}`} d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" markerEnd="url(#topo-arrow)" />
            );
          })}

          {/* Nodes */}
          {Array.from(layout.positions.entries()).map(([nodeId, pos]) => {
            const node = pos.node;
            const cat = graph.categories[node.cat];
            const catColor = cat?.color || "#38BDF8";
            const progress = progressMap[nodeId];
            const score = progress?.score ?? progress?.latestAttempt?.score ?? null;

            return (
              <g key={nodeId} transform={`translate(${pos.x}, ${pos.y})`} onClick={() => onOpenNode(nodeId)} style={{ cursor: "pointer" }}>
                <rect width={layout.config.nodeWidth} height={layout.config.nodeHeight} rx="8" fill="rgba(16, 22, 35, 0.95)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                <circle cx="16" cy="18" r="4" fill={catColor} />
                <text x="26" y="22" fill={catColor} fontSize="10" fontWeight="600">{cat?.label || node.cat}</text>
                {score !== null && (
                  <text x={layout.config.nodeWidth - 12} y="22" textAnchor="end" fill="var(--color-status-excellence, #F5C451)" fontSize="10" fontWeight="700">
                    {score > 100 ? `★ ${score}/120` : `${score}/120`}
                  </text>
                )}
                <text x="16" y="44" fill="#F8FAFC" fontSize="12" fontWeight="600">
                  {node.label.length > 25 ? `${node.label.slice(0, 24)}…` : node.label}
                </text>
                <text x="16" y="66" fill="rgba(255, 255, 255, 0.45)" fontSize="10">
                  {node.lesson?.level ? `Nivel: ${node.lesson.level}` : `Prioridad ${node.priority}`}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
