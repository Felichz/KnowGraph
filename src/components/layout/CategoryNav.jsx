import React from "react";

export function CategoryNav({
  categories = {},
  selectedCategories = [],
  onSelectCategory,
  onClearCategories,
  nodeCounts = {},
}) {
  const isAllSelected = selectedCategories.length === 0;

  return (
    <nav
      className="cockpit-category-nav"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "6px",
      }}
    >
      {/* "Todos" button */}
      <button
        onClick={onClearCategories}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 500,
          background: isAllSelected ? "rgba(94, 234, 212, 0.12)" : "rgba(255, 255, 255, 0.04)",
          color: isAllSelected ? "var(--color-brand-primary, #5EEAD4)" : "var(--text-secondary)",
          border: isAllSelected
            ? "1px solid rgba(94, 234, 212, 0.4)"
            : "1px solid var(--border-line-subtle)",
        }}
      >
        <span>Todos</span>
      </button>

      {/* Individual category chips */}
      {Object.entries(categories).map(([catKey, catMeta]) => {
        const isSelected = selectedCategories.includes(catKey);
        const count = nodeCounts[catKey] ?? 0;
        const color = catMeta.color || "#38BDF8";

        return (
          <button
            key={catKey}
            onClick={() => onSelectCategory(catKey)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              background: isSelected ? `${color}20` : "rgba(255, 255, 255, 0.03)",
              color: isSelected ? "#F8FAFC" : "var(--text-secondary)",
              border: isSelected ? `1px solid ${color}60` : "1px solid var(--border-line-subtle)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
            <span>{catMeta.label || catKey}</span>
            <span
              style={{
                fontSize: "10px",
                opacity: 0.6,
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </nav>
  );
}
