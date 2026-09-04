import React from "react";

export function CategoryNav({
  categories = {},
  nodes = [],
  progressMap = {},
  selectedCategories = [],
  onSelectCategory,
  onShowAll,
}) {
  const categoryEntries = Object.entries(categories);
  const isAllSelected = selectedCategories.length === 0 || selectedCategories.length === categoryEntries.length;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "var(--bg-workspace)",
        borderBottom: "1px solid var(--border-line)",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
      aria-label="Filtro de categorías"
    >
      <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", marginRight: "6px" }}>
        FOCO:
      </span>

      {/* Botón Todos */}
      <button
        type="button"
        onClick={onShowAll}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-control)",
          fontSize: "12px",
          fontWeight: 600,
          background: isAllSelected ? "var(--bg-surface-emphasis)" : "var(--bg-surface)",
          color: isAllSelected ? "var(--accent-cyan)" : "var(--text-secondary)",
          border: `1px solid ${isAllSelected ? "var(--accent-cyan)" : "var(--border-line)"}`,
        }}
      >
        Todos ({nodes.length})
      </button>

      {/* Chips de Categorías */}
      {categoryEntries.map(([key, cat]) => {
        const catNodes = nodes.filter((n) => n.cat === key);
        const completedCount = catNodes.filter((n) => progressMap[n.id]?.status === "completed").length;
        const isSelected = selectedCategories.includes(key);

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectCategory(key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              borderRadius: "var(--radius-control)",
              fontSize: "12px",
              fontWeight: 500,
              background: isSelected ? "var(--bg-surface-emphasis)" : "var(--bg-surface)",
              color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
              border: `1px solid ${isSelected ? cat.color : "var(--border-line)"}`,
              opacity: isAllSelected || isSelected ? 1 : 0.5,
              transition: "all var(--transition-fast)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: cat.color,
                display: "inline-block",
              }}
            />
            <span>{cat.label}</span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              {completedCount}/{catNodes.length}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
