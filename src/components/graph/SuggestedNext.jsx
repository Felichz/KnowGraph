import React from "react";

export function SuggestedNext({ node = null, onOpenNode = null }) {
  if (!node) {
    return (
      <aside style={{ padding: "16px 24px", background: "rgba(74, 222, 128, 0.08)", borderRadius: "var(--radius-panel)", border: "1px solid rgba(74, 222, 128, 0.25)", fontSize: "13px", color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "10px" }} aria-label="Recomendación de estudio">
        <span>✨</span>
        <strong>¡Ruta completada! Has cubierto todos los conceptos recomendados de este temario.</strong>
      </aside>
    );
  }

  return (
    <aside
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "18px 24px",
        background: "linear-gradient(135deg, rgba(22, 29, 44, 0.85) 0%, rgba(13, 17, 26, 0.95) 100%)",
        border: "1px solid rgba(94, 234, 212, 0.28)",
        borderRadius: "var(--radius-panel)",
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 0 20px -2px rgba(94, 234, 212, 0.1)",
      }}
      aria-label="Recomendación de estudio"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent-cyan)", background: "rgba(94, 234, 212, 0.12)", padding: "3px 8px", borderRadius: "5px", border: "1px solid rgba(94, 234, 212, 0.3)" }}>
            <span>🎯</span> PRÓXIMO DESAFÍO EN TU RUTA
          </span>
          {node.priority && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              p#{node.priority}
            </span>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
          {node.label}
        </h2>
      </div>

      <button
        type="button"
        onClick={() => onOpenNode?.(node.id)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          background: "linear-gradient(135deg, var(--accent-cyan), #38bdf8)",
          border: "none",
          borderRadius: "var(--radius-control)",
          color: "#08090d",
          fontSize: "12.5px",
          fontWeight: 700,
          boxShadow: "0 0 16px rgba(94, 234, 212, 0.3)",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <span>Estudiar ahora</span>
        <span>→</span>
      </button>
    </aside>
  );
}
