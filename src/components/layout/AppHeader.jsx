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

  const pillBtn = (active) => ({
    padding: "5px 11px", borderRadius: "6px", fontSize: "11.5px",
    fontWeight: active ? 600 : 500,
    background: active ? "rgba(255, 255, 255, 0.12)" : "transparent",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    boxShadow: active ? "0 1px 4px rgba(0, 0, 0, 0.3)" : "none",
    transition: "all var(--transition-fast)",
  });

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 24px", background: "rgba(8, 11, 19, 0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border-line)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.45)", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-cyan) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99, 102, 241, 0.35)" }}>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>⚡</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <h1 style={{ margin: 0, fontSize: "14.5px", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-primary)" }}>Learning Workspace</h1>
            <span style={{ fontSize: "9.5px", textTransform: "uppercase", padding: "1px 6px", borderRadius: "var(--radius-pill)", background: "rgba(56, 189, 248, 0.12)", color: "var(--accent-cyan)", fontWeight: 700, letterSpacing: "0.06em", border: "1px solid rgba(56, 189, 248, 0.25)" }}>v2</span>
          </div>
        </div>

        <div style={{ display: "flex", background: "rgba(0, 0, 0, 0.4)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
          <button type="button" onClick={() => onSwitchGraph?.("react")} style={pillBtn(activeGraphId === "react")}>React</button>
          <button type="button" onClick={() => onSwitchGraph?.("rails")} style={pillBtn(activeGraphId === "rails")}>Rails</button>
        </div>

        <div className="hide-on-mobile" style={{ display: "flex", background: "rgba(0, 0, 0, 0.4)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
          <button type="button" onClick={() => onViewModeChange?.("graph")} style={pillBtn(viewMode === "graph")}>Grafo</button>
          <button type="button" onClick={() => onViewModeChange?.("flashcards")} style={pillBtn(viewMode === "flashcards")}>Flashcards</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button" onClick={onOpenProgress}
          title="Ver Mapa de Seniority y Milestones" aria-label="Ver Mapa de Seniority y Milestones"
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer", padding: "5px 12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-line)", transition: "all var(--transition-fast)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 700, fontSize: "11.5px" }}>{completedNodes}/{totalNodes}</span>
          <div style={{ width: "52px", height: "5px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: percent > 0 ? "linear-gradient(90deg, var(--accent-cyan), var(--accent-green))" : "transparent", transition: "width 400ms ease" }} />
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: percent >= 100 ? "var(--accent-green)" : "var(--text-secondary)" }}>{percent}%</span>
        </button>

        <button
          type="button" className="hide-on-mobile" onClick={onOpenCommandPalette} title="Buscar concepto (Ctrl+K)"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-line)", borderRadius: "8px", fontSize: "12px", color: "var(--text-secondary)" }}
        >
          <span>Buscar</span>
          <kbd style={{ fontSize: "10px", fontFamily: "var(--font-mono)", background: "rgba(0, 0, 0, 0.45)", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--border-line)", color: "var(--text-muted)" }}>Ctrl K</kbd>
        </button>

        <button
          type="button" className="hide-on-mobile" onClick={onOpenSettings} title="Configurar proveedores de IA y Respaldo"
          style={{ padding: "5px 12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-line)", borderRadius: "8px", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}
        >
          ⚙️ BYOK
        </button>
      </div>
    </header>
  );
}
