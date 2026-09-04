import React from "react";

export function AppHeader({
  activeGraphId,
  onSwitchGraph,
  viewMode = "graph",
  onViewModeChange,
  totalNodes = 0,
  completedNodes = 0,
  onOpenProgress,
  onOpenCommandPalette,
  onOpenSettings,
}) {
  const percent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  const btnStyle = (active) => ({
    padding: "4px 9px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    background: active ? "var(--bg-surface-raised)" : "transparent",
    color: active ? "var(--accent-cyan)" : "var(--text-secondary)",
  });

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-line)",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--accent-cyan)", fontWeight: 700 }}>
            COCKPIT TÉCNICO
          </span>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Learning Workspace
          </h1>
        </div>

        {/* Switch Grafo */}
        <div style={{ display: "flex", background: "var(--bg-workspace)", padding: "2px", borderRadius: "var(--radius-control)" }}>
          <button type="button" onClick={() => onSwitchGraph?.("react")} style={btnStyle(activeGraphId === "react")}>React</button>
          <button type="button" onClick={() => onSwitchGraph?.("rails")} style={btnStyle(activeGraphId === "rails")}>Rails</button>
        </div>

        {/* Toggle Vista: Grafo / Flashcards */}
        <div style={{ display: "flex", background: "var(--bg-workspace)", padding: "2px", borderRadius: "var(--radius-control)" }}>
          <button type="button" onClick={() => onViewModeChange?.("graph")} style={btnStyle(viewMode === "graph")}>Grafo</button>
          <button type="button" onClick={() => onViewModeChange?.("flashcards")} style={btnStyle(viewMode === "flashcards")}>Flashcards</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Progreso y Seniority clickeable */}
        <button
          type="button"
          onClick={onOpenProgress}
          title="Ver Mapa de Seniority y Milestones"
          aria-label="Ver Mapa de Seniority y Milestones"
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer", padding: "4px 8px", borderRadius: "6px", background: "var(--bg-workspace)", border: "1px solid var(--border-line)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 700 }}>
            {completedNodes}/{totalNodes}
          </span>
          <div style={{ width: "60px", height: "6px", background: "var(--bg-canvas)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "var(--accent-green)" }} />
          </div>
          <span style={{ fontSize: "11px" }}>{percent}%</span>
        </button>

        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Buscar concepto (Ctrl+K)"
          style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px",
            background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)",
            borderRadius: "var(--radius-control)", fontSize: "12px", color: "var(--text-secondary)",
          }}
        >
          <span>Buscar</span>
          <kbd style={{ fontSize: "10px", background: "var(--bg-canvas)", padding: "1px 4px", borderRadius: "4px", border: "1px solid var(--border-line)" }}>
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          title="Configurar proveedores de IA y Respaldo"
          style={{
            padding: "5px 10px", background: "var(--bg-surface-raised)",
            border: "1px solid var(--border-line)", borderRadius: "var(--radius-control)",
            fontSize: "12px", color: "var(--text-secondary)",
          }}
        >
          ⚙️ BYOK
        </button>
      </div>
    </header>
  );
}
