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
        padding: "8px 24px",
        background: "rgba(8, 10, 15, 0.65)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-line)",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
      aria-label="Filtro de categorías"
    >
      <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: "4px" }}>
        Filtro
      </span>

      {/* Botón Todos */}
      <button
        type="button"
        onClick={onShowAll}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "var(--radius-pill)",
          fontSize: "12px",
          fontWeight: 600,
          background: isAllSelected ? "rgba(94, 234, 212, 0.12)" : "rgba(255, 255, 255, 0.03)",
          color: isAllSelected ? "var(--accent-cyan)" : "var(--text-secondary)",
          border: `1px solid ${isAllSelected ? "rgba(94, 234, 212, 0.4)" : "var(--border-line)"}`,
          boxShadow: isAllSelected ? "0 0 10px rgba(94, 234, 212, 0.1)" : "none",
        }}
      >
        <span>Todos</span>
        <span style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", opacity: 0.75 }}>({nodes.length})</span>
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
              gap: "7px",
              padding: "4px 11px",
              borderRadius: "var(--radius-pill)",
              fontSize: "12px",
              fontWeight: isSelected ? 600 : 500,
              background: isSelected ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.02)",
              color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
              border: `1px solid ${isSelected ? cat.color : "var(--border-line)"}`,
              boxShadow: isSelected ? `0 0 12px ${cat.color}25` : "none",
              opacity: isAllSelected || isSelected ? 1 : 0.55,
              transition: "all var(--transition-fast)",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: cat.color,
                display: "inline-block",
                boxShadow: isSelected ? `0 0 6px ${cat.color}` : "none",
              }}
            />
            <span>{cat.label}</span>
            <span style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", background: "rgba(0, 0, 0, 0.3)", padding: "1px 5px", borderRadius: "10px" }}>
              {completedCount}/{catNodes.length}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
