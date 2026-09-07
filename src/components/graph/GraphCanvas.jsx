import React, { useState } from "react";
import { GraphNode } from "./GraphNode.jsx";
import { GraphTopologyCanvas } from "./GraphTopologyCanvas.jsx";
import { CockpitControlDeck } from "./CockpitControlDeck.jsx";

export function GraphCanvas({
  graph = null,
  nodes = [],
  categories = {},
  progressMap = {},
  suggestedNext = null,
  selectedNodeId = null,
  activeTaskNodeIds = new Set(),
  selectedCategories = [],
  onSelectCategory,
  onShowAllCategories,
  onSelectNode,
  onOpenNode,
}) {
  const [viewStyle, setViewStyle] = useState("grid");

  if (!nodes || nodes.length === 0) {
    return (
      <main style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", flex: 1, background: "var(--bg-canvas)" }}>
        No hay conceptos para mostrar con los filtros actuales.
      </main>
    );
  }

  const activeGraph = graph || { nodes, categories, edges: [] };

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
        padding: "16px 24px 60px",
        background: "var(--bg-canvas)",
      }}
    >
      <div style={{ maxWidth: "1340px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        <CockpitControlDeck
          categories={categories}
          nodes={graph?.nodes || nodes}
          progressMap={progressMap}
          suggestedNext={suggestedNext}
          onOpenNode={onOpenNode}
          selectedCategories={selectedCategories}
          onSelectCategory={onSelectCategory}
          onShowAllCategories={onShowAllCategories}
          totalVisibleCount={nodes.length}
          viewStyle={viewStyle}
          onViewStyleChange={setViewStyle}
        />

        {viewStyle === "topology" ? (
          <GraphTopologyCanvas
            graph={activeGraph}
            progressMap={progressMap}
            selectedNodeId={selectedNodeId}
            activeTaskNodeIds={activeTaskNodeIds}
            onSelectNode={onSelectNode}
            onOpenNode={onOpenNode}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {Object.entries(nodesByCategory).map(([catKey, catNodes]) => {
              const cat = categories[catKey] || { label: catKey, color: "#70ddd4" };
              return (
                <section key={catKey} aria-labelledby={`category-heading-${catKey}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: cat.color, boxShadow: `0 0 10px ${cat.color}70` }} />
                    <h2 id={`category-heading-${catKey}`} style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
                      {cat.label}
                    </h2>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", background: "rgba(0, 0, 0, 0.3)", padding: "1px 6px", borderRadius: "var(--radius-pill)" }}>
                      {catNodes.length}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
                    {catNodes.map((node) => {
                      const progress = progressMap[node.id];
                      const hasActiveTask = activeTaskNodeIds.has?.(node.id) || (Array.isArray(activeTaskNodeIds) && activeTaskNodeIds.includes(node.id));
                      const missingPrereqs = (node.prerequisites || []).filter((pId) => progressMap[pId]?.status !== "completed");
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
        )}
      </div>
    </main>
  );
}
