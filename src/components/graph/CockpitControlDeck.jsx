import React from "react";
import { CategoryNav } from "../layout/CategoryNav.jsx";

export function CockpitControlDeck({
  categories = {},
  nodes = [],
  progressMap = {},
  selectedCategories = [],
  onSelectCategory,
  onShowAllCategories,
  totalVisibleCount = 0,
  viewStyle = "grid",
  onViewStyleChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "8px 16px",
        background: "rgba(15, 20, 30, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: "var(--radius-panel)",
        border: "1px solid var(--border-line)",
      }}
    >
      <CategoryNav
        categories={categories}
        nodes={nodes}
        progressMap={progressMap}
        selectedCategories={selectedCategories}
        onSelectCategory={onSelectCategory}
        onShowAll={onShowAllCategories}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, borderLeft: "1px solid var(--border-line)", paddingLeft: "12px" }}>
        <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
          {totalVisibleCount} conceptos
        </span>
        <div style={{ display: "flex", gap: "3px", background: "rgba(0, 0, 0, 0.3)", padding: "2px", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
          <button
            type="button"
            onClick={() => onViewStyleChange?.("grid")}
            style={{
              padding: "4px 10px", fontSize: "11px", border: "none", borderRadius: "4px", cursor: "pointer",
              background: viewStyle === "grid" ? "var(--bg-surface-raised)" : "transparent",
              color: viewStyle === "grid" ? "var(--accent-cyan)" : "var(--text-secondary)",
              fontWeight: viewStyle === "grid" ? 700 : 500,
            }}
          >
            ⊞ Cuadrícula
          </button>
          <button
            type="button"
            onClick={() => onViewStyleChange?.("topology")}
            style={{
              padding: "4px 10px", fontSize: "11px", border: "none", borderRadius: "4px", cursor: "pointer",
              background: viewStyle === "topology" ? "var(--bg-surface-raised)" : "transparent",
              color: viewStyle === "topology" ? "var(--accent-cyan)" : "var(--text-secondary)",
              fontWeight: viewStyle === "topology" ? 700 : 500,
            }}
          >
            ☊ Topología SVG
          </button>
        </div>
      </div>
    </div>
  );
}
