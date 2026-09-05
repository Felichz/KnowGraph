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
        gap: "6px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0,
        scrollbarWidth: "none",
        padding: "2px 0",
      }}
      aria-label="Filtro de categorías"
    >
      <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "2px" }}>
        Filtro
      </span>

      {/* Botón Todos */}
      <button
        type="button"
        onClick={onShowAll}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "var(--radius-pill)",
          fontSize: "11.5px",
          fontWeight: 600,
          background: isAllSelected ? "rgba(94, 234, 212, 0.12)" : "rgba(255, 255, 255, 0.03)",
          color: isAllSelected ? "var(--accent-cyan)" : "var(--text-secondary)",
          border: `1px solid ${isAllSelected ? "rgba(94, 234, 212, 0.4)" : "var(--border-line)"}`,
          boxShadow: isAllSelected ? "0 0 10px rgba(94, 234, 212, 0.12)" : "none",
          cursor: "pointer",
        }}
      >
        <span>Todos</span>
        <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", opacity: 0.75 }}>({nodes.length})</span>
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
              padding: "3px 9px",
              borderRadius: "var(--radius-pill)",
              fontSize: "11.5px",
              fontWeight: isSelected ? 600 : 500,
              background: isSelected ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.02)",
              color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
              border: `1px solid ${isSelected ? cat.color : "var(--border-line)"}`,
              boxShadow: isSelected ? `0 0 12px ${cat.color}25` : "none",
              opacity: isAllSelected || isSelected ? 1 : 0.5,
              transition: "all var(--transition-fast)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: cat.color,
                display: "inline-block",
                boxShadow: isSelected ? `0 0 6px ${cat.color}` : "none",
              }}
            />
            <span>{cat.label}</span>
            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", background: "rgba(0, 0, 0, 0.3)", padding: "1px 4px", borderRadius: "8px" }}>
              {completedCount}/{catNodes.length}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
