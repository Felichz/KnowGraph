import React from "react";

export function AppHeader({
  activeGraphId = "react",
  onSwitchGraph,
  viewMode = "graph",
  onSetViewMode,
  totalNodes = 101,
  completedCount = 0,
  onOpenSearch,
  onOpenSeniority,
  onOpenSettings,
}) {
  const percent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;
  const isExcellence = percent >= 80;

  const btnStyle = (active) => ({
    padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
    background: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
    color: active ? "var(--text-primary)" : "var(--text-muted)",
    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
  });

  return (
    <header style={{
      position: "sticky", top: 0, left: 0, right: 0, height: "52px",
      background: "rgba(11, 13, 19, 0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-line)", zIndex: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", gap: "12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "6px",
          background: "rgba(94, 234, 212, 0.12)", border: "1px solid rgba(94, 234, 212, 0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--color-brand-primary, #5EEAD4)", fontWeight: 800, fontSize: "14px",
        }}>LW</div>
        <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}>Learning Workspace</span>

        <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.04)", borderRadius: "8px", padding: "2px", border: "1px solid var(--border-line-subtle)", marginLeft: "8px" }}>
          <button onClick={() => onSwitchGraph("react")} style={btnStyle(activeGraphId === "react")}>React</button>
          <button onClick={() => onSwitchGraph("rails")} style={btnStyle(activeGraphId === "rails")}>Rails</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div className="hide-on-mobile" style={{ display: "flex", background: "rgba(255, 255, 255, 0.04)", borderRadius: "8px", padding: "2px", border: "1px solid var(--border-line-subtle)" }}>
          <button onClick={() => onSetViewMode("graph")} style={btnStyle(viewMode === "graph")}>Grafo</button>
          <button onClick={() => onSetViewMode("flashcards")} style={btnStyle(viewMode === "flashcards")}>Flashcards</button>
        </div>

        <button className="hide-on-mobile" onClick={onOpenSearch} style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", height: "30px",
          borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)",
          fontSize: "12px", color: "var(--text-secondary)",
        }}>
          <span>Buscar...</span>
          <kbd style={{ fontSize: "10px", padding: "1px 4px", borderRadius: "4px", background: "rgba(255,255,255,0.08)" }}>Ctrl K</kbd>
        </button>

        <button aria-label="Ver Mapa de Seniority y Milestones" onClick={onOpenSeniority} style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", height: "30px",
          borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)",
          fontSize: "12px", color: "var(--text-primary)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: isExcellence ? "var(--accent-gold)" : "var(--color-brand-primary, #5EEAD4)" }}>
            {completedCount}/{totalNodes} ({percent}%)
          </span>
          <span className="hide-on-mobile" style={{ color: "var(--text-secondary)" }}>📊 Seniority</span>
        </button>

        <button className="hide-on-mobile" onClick={onOpenSettings} style={{
          padding: "4px 10px", height: "30px", borderRadius: "6px",
          background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)",
          fontSize: "12px", color: "var(--text-secondary)",
        }}>
          ⚙️ BYOK
        </button>
      </div>
    </header>
  );
}
