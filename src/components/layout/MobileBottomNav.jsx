import React from "react";

export function MobileBottomNav({
  activeView = "graph",
  onSelectView,
  onOpenSeniority,
  onOpenSearch,
  onOpenSettings,
}) {
  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 25,
      }}
    >
      <button
        onClick={() => onSelectView("graph")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          minWidth: "48px",
          minHeight: "44px",
          fontSize: "11px",
          color: activeView === "graph" ? "var(--color-brand-primary, #5EEAD4)" : "var(--text-muted)",
        }}
      >
        <span style={{ fontSize: "16px" }}>🔀</span>
        <span>Grafo</span>
      </button>

      <button
        onClick={() => onSelectView("flashcards")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          minWidth: "48px",
          minHeight: "44px",
          fontSize: "11px",
          color: activeView === "flashcards" ? "var(--color-brand-primary, #5EEAD4)" : "var(--text-muted)",
        }}
      >
        <span style={{ fontSize: "16px" }}>📇</span>
        <span>Flashcards</span>
      </button>

      <button
        onClick={onOpenSeniority}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          minWidth: "48px",
          minHeight: "44px",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ fontSize: "16px" }}>📊</span>
        <span>Progreso</span>
      </button>

      <button
        onClick={onOpenSearch}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          minWidth: "48px",
          minHeight: "44px",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ fontSize: "16px" }}>🔍</span>
        <span>Buscar</span>
      </button>

      <button
        onClick={onOpenSettings}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          minWidth: "48px",
          minHeight: "44px",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ fontSize: "16px" }}>⚙️</span>
        <span>Ajustes</span>
      </button>
    </nav>
  );
}
