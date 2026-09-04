import React from "react";

export function MobileBottomNav({
  viewMode = "graph",
  onViewModeChange,
  onOpenProgress,
  onOpenCommandPalette,
  onOpenSettings,
}) {
  const itemStyle = (active) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 2px",
    background: "transparent",
    border: "none",
    color: active ? "var(--accent-cyan)" : "var(--text-muted)",
    fontSize: "10px",
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
  });

  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "56px", background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-line)",
        zIndex: 1000,
      }}
      className="mobile-bottom-nav"
      aria-label="Navegación inferior móvil"
    >
      <button type="button" onClick={() => onViewModeChange?.("graph")} style={itemStyle(viewMode === "graph")}>
        <span style={{ fontSize: "16px" }}>🗺️</span>
        <span>Grafo</span>
      </button>

      <button type="button" onClick={() => onViewModeChange?.("flashcards")} style={itemStyle(viewMode === "flashcards")}>
        <span style={{ fontSize: "16px" }}>📇</span>
        <span>Flashcards</span>
      </button>

      <button type="button" onClick={onOpenProgress} style={itemStyle(false)}>
        <span style={{ fontSize: "16px" }}>📊</span>
        <span>Progreso</span>
      </button>

      <button type="button" onClick={onOpenCommandPalette} style={itemStyle(false)}>
        <span style={{ fontSize: "16px" }}>🔍</span>
        <span>Buscar</span>
      </button>

      <button type="button" onClick={onOpenSettings} style={itemStyle(false)}>
        <span style={{ fontSize: "16px" }}>⚙️</span>
        <span>Ajustes</span>
      </button>
    </nav>
  );
}
