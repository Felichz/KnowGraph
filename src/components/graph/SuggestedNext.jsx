import React from "react";

export function SuggestedNext({ node = null, onOpenNode = null }) {
  if (!node) {
    return (
      <aside style={{ padding: "8px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-line)", fontSize: "12px", color: "var(--accent-green)" }}>
        ✨ ¡Ruta completada! Has cubierto todos los conceptos recomendados.
      </aside>
    );
  }

  return (
    <aside
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 24px",
        background: "linear-gradient(90deg, rgba(94, 234, 212, 0.07) 0%, rgba(20, 26, 38, 0.7) 40%, rgba(96, 165, 250, 0.05) 100%)",
        borderBottom: "1px solid var(--border-line)",
        fontSize: "12px",
      }}
      aria-label="Recomendación de estudio"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--accent-cyan)", background: "rgba(94, 234, 212, 0.1)", padding: "2px 7px", borderRadius: "5px", border: "1px solid rgba(94, 234, 212, 0.25)" }}>
          <span>🎯</span> PRÓXIMO DESAFÍO
        </span>
        <strong style={{ color: "var(--text-primary)", fontSize: "13px" }}>{node.label}</strong>
        {node.priority && (
          <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            p#{node.priority}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpenNode?.(node.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          background: "linear-gradient(135deg, var(--accent-cyan), #38bdf8)",
          border: "none",
          borderRadius: "6px",
          color: "#08090d",
          fontSize: "11.5px",
          fontWeight: 700,
          boxShadow: "0 0 14px rgba(94, 234, 212, 0.25)",
          cursor: "pointer",
        }}
      >
        <span>Estudiar ahora</span>
        <span>→</span>
      </button>
    </aside>
  );
}
