import React from "react";

export function SuggestedNext({ node = null, onOpenNode = null }) {
  if (!node) {
    return (
      <aside
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "var(--accent-green)",
          fontWeight: 600,
        }}
        aria-label="Recomendación de estudio"
      >
        <span style={{ fontSize: "14px" }}>✨</span>
        <span>¡Ruta completada! Has cubierto todos los conceptos recomendados.</span>
      </aside>
    );
  }

  return (
    <aside
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        minWidth: 0,
        flex: "1 1 auto",
      }}
      aria-label="Recomendación de estudio"
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", minWidth: 0, flex: "1 1 auto" }}>
        <span
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "9.5px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--accent-cyan)",
            background: "rgba(56, 189, 248, 0.1)",
            padding: "2px 8px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>🎯</span> PRÓXIMO DESAFÍO
        </span>

        {node.priority && (
          <span
            style={{
              flexShrink: 0,
              fontSize: "10.5px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              background: "rgba(0, 0, 0, 0.35)",
              padding: "1px 6px",
              borderRadius: "4px",
              border: "1px solid var(--border-line)",
            }}
          >
            p#{node.priority}
          </span>
        )}

        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.015em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "460px",
          }}
          title={node.label}
        >
          {node.label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpenNode?.(node.id)}
        style={{
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "var(--radius-control)",
          color: "#ffffff",
          fontSize: "11.5px",
          fontWeight: 700,
          boxShadow: "0 0 12px rgba(56, 189, 248, 0.25)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all var(--transition-fast)",
        }}
      >
        <span>Estudiar ahora</span>
        <span>→</span>
      </button>
    </aside>
  );
}
