import React from "react";
import { GraphNode } from "./GraphNode.jsx";

export function GraphCanvas({
  nodes = [],
  categories = {},
  progressMap = {},
  selectedNodeId = null,
  activeTaskNodeIds = new Set(),
  onSelectNode,
  onOpenNode,
}) {
  if (!nodes || nodes.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        No hay conceptos para mostrar con los filtros actuales.
      </div>
    );
  }

  // Agrupamos los nodos visibles por categoría
  const nodesByCategory = {};
  for (const node of nodes) {
    const cat = node.cat || "general";
    if (!nodesByCategory[cat]) nodesByCategory[cat] = [];
    nodesByCategory[cat].push(node);
  }

  return (
    <main
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 20px 60px",
        background: "var(--bg-canvas)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "1280px", margin: "0 auto" }}>
        {Object.entries(nodesByCategory).map(([catKey, catNodes]) => {
          const cat = categories[catKey] || { label: catKey, color: "#70ddd4" };

          return (
            <section key={catKey} aria-labelledby={`category-heading-${catKey}`}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color }} />
                <h2 id={`category-heading-${catKey}`} style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
                  {cat.label}
                </h2>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  ({catNodes.length})
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "12px",
                }}
              >
                {catNodes.map((node) => {
                  const progress = progressMap[node.id];
                  const hasActiveTask = activeTaskNodeIds.has?.(node.id) || (Array.isArray(activeTaskNodeIds) && activeTaskNodeIds.includes(node.id));

                  // Calcular prerrequisitos faltantes
                  const missingPrereqs = (node.prerequisites || []).filter(
                    (pId) => progressMap[pId]?.status !== "completed"
                  );

                  return (
                    <GraphNode
                      key={node.id}
                      node={node}
                      categoryColor={cat.color}
                      status={progress?.status || "unseen"}
                      score={progress?.score}
                      isSelected={node.id === selectedNodeId}
                      hasActiveTask={hasActiveTask}
                      missingPrereqCount={missingPrereqs.length}
                      onClick={() => {
                        onSelectNode?.(node.id);
                        onOpenNode?.(node.id);
                      }}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
