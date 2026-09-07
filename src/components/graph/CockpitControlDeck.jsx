import React from "react";
import { CategoryNav } from "../layout/CategoryNav.jsx";
import { SuggestedNext } from "./SuggestedNext.jsx";

export function CockpitControlDeck({
  categories = {},
  nodes = [],
  progressMap = {},
  suggestedNext = null,
  onOpenNode = null,
  selectedCategories = [],
  onSelectCategory,
  onShowAllCategories,
  totalVisibleCount = 0,
  viewStyle = "grid",
  onViewStyleChange,
}) {
  const switchBtn = (active) => ({
    padding: "4px 10px",
    fontSize: "11px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: active ? "rgba(255, 255, 255, 0.12)" : "transparent",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    fontWeight: active ? 600 : 500,
    boxShadow: active ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "none",
    transition: "all var(--transition-fast)",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px 14px",
        background: "rgba(13, 18, 30, 0.72)",
        backdropFilter: "blur(16px)",
        borderRadius: "var(--radius-panel)",
        border: "1px solid var(--border-line)",
        boxShadow: "0 4px 18px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Fila 1: Recomendación de estudio a la izquierda, conteo y selector de vista a la derecha */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <SuggestedNext node={suggestedNext} onOpenNode={onOpenNode} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginLeft: "auto" }}>
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "2px 8px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border-line)",
              whiteSpace: "nowrap",
            }}
          >
            {totalVisibleCount} conceptos
          </span>

          <div style={{ display: "flex", gap: "2px", background: "rgba(0, 0, 0, 0.4)", padding: "2px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
            <button
              type="button"
              onClick={() => onViewStyleChange?.("grid")}
              style={switchBtn(viewStyle === "grid")}
            >
              ⊞ Cuadrícula
            </button>
            <button
              type="button"
              onClick={() => onViewStyleChange?.("topology")}
              style={switchBtn(viewStyle === "topology")}
            >
              ☊ Topología SVG
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.06)", margin: "0 -2px" }} />

      {/* Fila 2: Barra de categorías con envoltura completa (cero affordance oculta) */}
      <div style={{ minWidth: 0 }}>
        <CategoryNav
          categories={categories}
          nodes={nodes}
          progressMap={progressMap}
          selectedCategories={selectedCategories}
          onSelectCategory={onSelectCategory}
          onShowAll={onShowAllCategories}
        />
      </div>
    </div>
  );
}
