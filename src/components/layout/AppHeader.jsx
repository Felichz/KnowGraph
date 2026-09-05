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
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 24px",
        background: "rgba(10, 13, 19, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-line)",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px var(--accent-cyan-glow)" }}>
            <span style={{ fontSize: "13px", fontWeight: 800, color: "#08090d" }}>⚡</span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h1 style={{ margin: 0, fontSize: "14.5px", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-primary)" }}>
                Learning Workspace
              </h1>
              <span style={{ fontSize: "9px", textTransform: "uppercase", padding: "1px 5px", borderRadius: "4px", background: "var(--accent-cyan-glow)", color: "var(--accent-cyan)", fontWeight: 700, letterSpacing: "0.05em" }}>v2</span>
            </div>
          </div>
        </div>

        {/* Switch Grafo */}
        <div style={{ display: "flex", background: "rgba(0, 0, 0, 0.45)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
          <button type="button" onClick={() => onSwitchGraph?.("react")} style={btnStyle(activeGraphId === "react")}>React</button>
          <button type="button" onClick={() => onSwitchGraph?.("rails")} style={btnStyle(activeGraphId === "rails")}>Rails</button>
        </div>

        {/* Toggle Vista: Grafo / Flashcards */}
        <div style={{ display: "flex", background: "rgba(0, 0, 0, 0.45)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
          <button type="button" onClick={() => onViewModeChange?.("graph")} style={btnStyle(viewMode === "graph")}>Grafo</button>
          <button type="button" onClick={() => onViewModeChange?.("flashcards")} style={btnStyle(viewMode === "flashcards")}>Flashcards</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Progreso y Seniority clickeable */}
        <button
          type="button"
          onClick={onOpenProgress}
          title="Ver Mapa de Seniority y Milestones"
          aria-label="Ver Mapa de Seniority y Milestones"
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer", padding: "5px 10px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.35)", border: "1px solid var(--border-line)", transition: "all var(--transition-fast)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 700, fontSize: "11.5px" }}>
            {completedNodes}/{totalNodes}
          </span>
          <div style={{ width: "50px", height: "5px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: percent > 0 ? "linear-gradient(90deg, var(--accent-cyan), var(--accent-green))" : "transparent", transition: "width 400ms ease" }} />
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: percent >= 100 ? "var(--accent-green)" : "var(--text-secondary)" }}>{percent}%</span>
        </button>

        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Buscar concepto (Ctrl+K)"
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px",
            background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)",
            borderRadius: "8px", fontSize: "12px", color: "var(--text-secondary)",
          }}
        >
          <span>Buscar</span>
          <kbd style={{ fontSize: "10px", fontFamily: "var(--font-mono)", background: "rgba(0, 0, 0, 0.4)", padding: "1px 5px", borderRadius: "4px", border: "1px solid var(--border-line)", color: "var(--text-muted)" }}>
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          title="Configurar proveedores de IA y Respaldo"
          style={{
            padding: "5px 11px", background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border-line)", borderRadius: "8px",
            fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500,
          }}
        >
          ⚙️ BYOK
        </button>
      </div>
    </header>
  );
}
