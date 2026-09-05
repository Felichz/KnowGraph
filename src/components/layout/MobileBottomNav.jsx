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
    gap: "3px",
    padding: "6px 2px",
    background: "transparent",
    border: "none",
    color: active ? "var(--accent-cyan)" : "var(--text-muted)",
    fontSize: "10px",
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  });

  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "56px", background: "rgba(10, 14, 24, 0.96)",
        backdropFilter: "blur(18px)",
        borderTop: "1px solid var(--border-line)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.45)",
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
