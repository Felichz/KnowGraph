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
      onWheel={(e) => {
        if (e.deltaY !== 0) {
          e.currentTarget.scrollLeft += e.deltaY;
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0,
        scrollbarWidth: "none",
        padding: "2px 0",
      }}
      aria-label="Filtro de categorías"
    >
      <span style={{ fontSize: "9.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "2px" }}>
        Filtro
      </span>

      {/* Button: Todos */}
      <button
        type="button"
        onClick={onShowAll}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 9px",
          borderRadius: "var(--radius-pill)",
          fontSize: "11px",
          fontWeight: 600,
          background: isAllSelected ? "rgba(56, 189, 248, 0.14)" : "rgba(255, 255, 255, 0.03)",
          color: isAllSelected ? "var(--accent-cyan)" : "var(--text-secondary)",
          border: `1px solid ${isAllSelected ? "rgba(56, 189, 248, 0.35)" : "var(--border-line)"}`,
          boxShadow: isAllSelected ? "0 0 12px rgba(56, 189, 248, 0.15)" : "none",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          flexShrink: 0,
        }}
      >
        <span>Todos</span>
        <span style={{ fontSize: "9.5px", fontFamily: "var(--font-mono)", opacity: 0.8 }}>({nodes.length})</span>
      </button>

      {/* Category Chips */}
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
              gap: "5px",
              padding: "3px 8px",
              borderRadius: "var(--radius-pill)",
              fontSize: "11px",
              fontWeight: isSelected ? 600 : 500,
              background: isSelected ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.02)",
              color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
              border: `1px solid ${isSelected ? cat.color : "var(--border-line)"}`,
              boxShadow: isSelected ? `0 0 14px ${cat.color}30` : "none",
              opacity: isAllSelected || isSelected ? 1 : 0.45,
              transition: "all var(--transition-fast)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: cat.color,
                display: "inline-block",
                boxShadow: isSelected ? `0 0 8px ${cat.color}` : "none",
              }}
            />
            <span>{cat.label}</span>
            <span
              style={{
                fontSize: "9.5px",
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                background: "rgba(0, 0, 0, 0.35)",
                padding: "1px 5px",
                borderRadius: "5px",
              }}
            >
              {completedCount}/{catNodes.length}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
