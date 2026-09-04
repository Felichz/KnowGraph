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
        padding: "8px 20px",
        background: "var(--bg-surface-raised)",
        borderBottom: "1px solid var(--border-line)",
        fontSize: "12px",
      }}
      aria-label="Recomendación de estudio"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent-cyan)" }}>
          PRÓXIMO DESAFÍO:
        </span>
        <strong style={{ color: "var(--text-primary)" }}>{node.label}</strong>
        {node.priority && (
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            prioridad {node.priority}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpenNode?.(node.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          background: "var(--bg-surface-emphasis)",
          border: "1px solid var(--accent-cyan)",
          borderRadius: "var(--radius-control)",
          color: "var(--accent-cyan)",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        Estudiar ahora →
      </button>
    </aside>
  );
}
