import React from "react";
import { CategoryNav } from "./CategoryNav.jsx";

export function CockpitControlDeck({
  suggestedNext,
  onOpenNode,
  layoutMode = "grid",
  onSetLayoutMode,
  categories = {},
  selectedCategories = [],
  onSelectCategory,
  onClearCategories,
  nodeCounts = {},
  viewMode = "graph",
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: "52px",
        left: 0,
        right: 0,
        background: "rgba(11, 15, 25, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-line)",
        zIndex: 9,
        padding: "8px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      {/* Top row: Next Challenge Strip + Layout Mode */}
      {viewMode === "graph" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            minHeight: "28px",
          }}
        >
          {/* Next Challenge link */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "rgba(94, 234, 212, 0.12)",
                color: "var(--color-brand-primary, #5EEAD4)",
                fontWeight: 600,
              }}
            >
              Siguiente reto
            </span>
            {suggestedNext ? (
              <button
                onClick={() => onOpenNode(suggestedNext.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                }}
              >
                <span>{suggestedNext.label}</span>
                <span style={{ color: "var(--color-brand-primary, #5EEAD4)" }}>→</span>
              </button>
            ) : (
              <span style={{ color: "var(--text-muted)" }}>¡Todos los retos completados!</span>
            )}
          </div>

          {/* Layout Mode Selector */}
          <div
            className="hide-on-mobile"
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid var(--border-line-subtle)",
            }}
          >
            <button
              onClick={() => onSetLayoutMode("grid")}
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500,
                background: layoutMode === "grid" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: layoutMode === "grid" ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              ⊞ Cuadrícula
            </button>
            <button
              onClick={() => onSetLayoutMode("topology")}
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500,
                background: layoutMode === "topology" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: layoutMode === "topology" ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              ☊ Topología SVG
            </button>
          </div>
        </div>
      )}

      {/* Category Navigation rail */}
      <CategoryNav
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectCategory={onSelectCategory}
        onClearCategories={onClearCategories}
        nodeCounts={nodeCounts}
      />
    </div>
  );
}
