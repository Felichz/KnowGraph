import React, { useMemo } from "react";
import { GraphNode } from "./GraphNode.jsx";

export function GraphCanvas({
  nodes = [],
  progressMap = {},
  categories = {},
  onOpenNode,
  selectedGroupIds = [],
}) {
  // Group nodes by category if no specific category is filtered, or show all filtered nodes
  const groupedNodes = useMemo(() => {
    const map = new Map();
    nodes.forEach((node) => {
      const catKey = node.cat || "other";
      if (!map.has(catKey)) {
        map.set(catKey, []);
      }
      map.get(catKey).push(node);
    });
    return map;
  }, [nodes]);

  return (
    <div
      style={{
        padding: "20px 24px 80px 24px",
        maxWidth: "1440px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {Array.from(groupedNodes.entries()).map(([catKey, categoryNodes]) => {
        const catMeta = categories[catKey] || { label: catKey, color: "#38BDF8" };

        return (
          <section key={catKey} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Category header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: catMeta.color || "#38BDF8",
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                }}
              >
                {catMeta.label || catKey}
              </h2>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ({categoryNodes.length})
              </span>
            </div>

            {/* Grid of articles */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "14px",
              }}
            >
              {categoryNodes.map((node) => (
                <GraphNode
                  key={node.id}
                  node={node}
                  progress={progressMap[node.id]}
                  category={catMeta}
                  onOpenNode={onOpenNode}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
