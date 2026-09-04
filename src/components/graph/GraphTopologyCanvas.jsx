import React, { useMemo, useState } from "react";
import { collectTopologyFocus, createTopologicalLayout } from "../../logic/topologicalLayout.js";
import { usePanZoom } from "../../hooks/usePanZoom.js";

function edgePath(sourcePos, targetPos, nodeWidth, nodeHeight) {
  const sx = sourcePos.x + nodeWidth;
  const sy = sourcePos.y + nodeHeight / 2;
  const tx = targetPos.x;
  const ty = targetPos.y + nodeHeight / 2;
  const dx = Math.max(30, (tx - sx) / 2);
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
}

export function GraphTopologyCanvas({
  graph,
  progressMap = {},
  selectedNodeId = null,
  activeTaskNodeIds = new Set(),
  onSelectNode,
  onOpenNode,
}) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const { ref, view, wasDragged, panHandlers, zoomIn, zoomOut, resetView } = usePanZoom();
  const layout = useMemo(() => createTopologicalLayout(graph), [graph]);
  const focus = useMemo(() => collectTopologyFocus(hoveredNodeId || selectedNodeId, layout), [hoveredNodeId, selectedNodeId, layout]);

  const activeFocusId = hoveredNodeId || selectedNodeId;

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 180px)", minHeight: "500px", overflow: "hidden", background: "var(--bg-canvas)" }}>
      {/* Controles de Zoom Flotantes */}
      <div style={{ position: "absolute", bottom: "16px", right: "16px", zIndex: 10, display: "flex", gap: "6px", background: "var(--bg-surface-raised)", padding: "4px", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
        <button type="button" onClick={zoomIn} title="Acercar" style={{ padding: "4px 8px", background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", fontWeight: 700 }}>+</button>
        <button type="button" onClick={zoomOut} title="Alejar" style={{ padding: "4px 8px", background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", fontWeight: 700 }}>-</button>
        <button type="button" onClick={resetView} title="Restablecer vista" style={{ padding: "4px 8px", background: "transparent", border: "none", color: "var(--accent-cyan)", cursor: "pointer", fontSize: "11px" }}>⟲ Centrar</button>
      </div>

      <svg ref={ref} {...panHandlers} width="100%" height="100%" style={{ cursor: "grab", userSelect: "none" }}>
        <defs>
          <marker id="topo-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--text-muted)" opacity="0.6" />
          </marker>
          <marker id="topo-arrow-focus" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--accent-cyan)" />
          </marker>
        </defs>

        <g transform={`translate(${view.x}, ${view.y}) scale(${view.k})`}>
          {/* Columnas de Etapas Topológicas */}
          {layout.layers.map((layer, rank) => {
            const x = layout.config.paddingX + rank * (layout.config.nodeWidth + layout.config.columnGap);
            const layerPos = layer.map((n) => layout.positions.get(n.id)).filter(Boolean);
            if (!layerPos.length) return null;
            const minY = Math.min(...layerPos.map((p) => p.y));
            const maxY = Math.max(...layerPos.map((p) => p.y)) + layout.config.nodeHeight;
            return (
              <g key={rank} opacity="0.35">
                <rect x={x - 16} y={minY - 32} width={layout.config.nodeWidth + 32} height={maxY - minY + 48} rx="12" fill="var(--bg-surface)" stroke="var(--border-line)" strokeDasharray="3 3" />
                <text x={x} y={minY - 14} fill="var(--text-muted)" fontSize="11px" fontWeight="700" letterSpacing="0.05em">ETAPA {rank + 1}</text>
              </g>
            );
          })}

          {/* Aristas del DAG */}
          {layout.edges.map(([sourceId, targetId]) => {
            const s = layout.positions.get(sourceId);
            const t = layout.positions.get(targetId);
            if (!s || !t) return null;
            const edgeKey = `${sourceId}->${targetId}`;
            const isChain = activeFocusId ? focus.edges.has(edgeKey) : true;
            const dimmed = activeFocusId && !isChain;
            return (
              <path
                key={edgeKey}
                d={edgePath(s, t, layout.config.nodeWidth, layout.config.nodeHeight)}
                fill="none"
                stroke={isChain && activeFocusId ? "var(--accent-cyan)" : "var(--border-line)"}
                strokeWidth={isChain && activeFocusId ? 2 : 1.2}
                opacity={dimmed ? 0.15 : isChain && activeFocusId ? 1 : 0.45}
                markerEnd={isChain && activeFocusId ? "url(#topo-arrow-focus)" : "url(#topo-arrow)"}
              />
            );
          })}

          {/* Nodos */}
          {[...layout.positions.values()].map(({ node, x, y }) => {
            const progress = progressMap[node.id];
            const score = progress?.score;
            const isCompleted = progress?.status === "completed" || score >= 100;
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const inChain = !activeFocusId || focus.nodes.has(node.id);
            const cat = graph.categories?.[node.cat] || { color: "#70ddd4", label: node.cat };
            const hasTask = activeTaskNodeIds.has?.(node.id) || (Array.isArray(activeTaskNodeIds) && activeTaskNodeIds.includes(node.id));

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                opacity={inChain ? 1 : 0.22}
                style={{ cursor: "pointer" }}
                onPointerEnter={() => setHoveredNodeId(node.id)}
                onPointerLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  if (wasDragged()) return;
                  onSelectNode?.(node.id);
                  onOpenNode?.(node.id);
                }}
              >
                {score > 100 && (
                  <rect x="-4" y="-4" width={layout.config.nodeWidth + 8} height={layout.config.nodeHeight + 8} rx="12" fill="none" stroke="var(--accent-gold)" strokeWidth="2" opacity="0.6" />
                )}
                <rect
                  width={layout.config.nodeWidth}
                  height={layout.config.nodeHeight}
                  rx="8"
                  fill={isSelected ? "var(--bg-surface-emphasis)" : "var(--bg-surface)"}
                  stroke={isSelected ? "var(--accent-cyan)" : isHovered ? "var(--accent-cyan)" : "var(--border-line)"}
                  strokeWidth={isSelected || isHovered ? 1.5 : 1}
                />
                <rect width="4" height={layout.config.nodeHeight} rx="2" fill={score > 100 ? "var(--accent-gold)" : cat.color} />
                <circle cx="16" cy="18" r="4" fill={cat.color} />
                <text x="26" y="21" fill="var(--text-muted)" fontSize="10px" fontWeight="600">{cat.label}</text>
                <text x={layout.config.nodeWidth - 10} y="21" textAnchor="end" fill={score > 100 ? "var(--accent-gold)" : isCompleted ? "var(--accent-green)" : "var(--text-muted)"} fontSize="10px" fontWeight="700" fontFamily="var(--font-mono)">
                  {score != null ? (score > 100 ? `★ ${score}/120` : `${score}/120`) : isCompleted ? "✓ Listo" : "Pendiente"}
                </text>
                <text x="14" y="44" fill="var(--text-primary)" fontSize="12px" fontWeight="600" width={layout.config.nodeWidth - 28}>
                  {node.label.length > 28 ? `${node.label.slice(0, 26)}…` : node.label}
                </text>
                {hasTask && <circle cx={layout.config.nodeWidth - 12} cy="42" r="4" fill="var(--accent-cyan)" />}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
