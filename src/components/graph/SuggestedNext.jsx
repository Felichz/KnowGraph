import React from "react";

export function SuggestedNext({ node = null, onOpenNode = null }) {
  if (!node) {
    return (
      <aside
        style={{
          padding: "16px 24px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 18, 30, 0.75) 100%)",
          borderRadius: "var(--radius-panel)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
          fontSize: "13px",
          color: "var(--accent-green)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        aria-label="Recomendación de estudio"
      >
        <span style={{ fontSize: "18px" }}>✨</span>
        <strong>¡Ruta completada! Has cubierto todos los conceptos recomendados de este temario.</strong>
      </aside>
    );
  }

  return (
    <aside
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "14px 20px",
        background: "linear-gradient(135deg, rgba(22, 32, 54, 0.8) 0%, rgba(12, 17, 30, 0.95) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "var(--radius-panel)",
        boxShadow: "0 6px 24px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(16px)",
      }}
      aria-label="Recomendación de estudio"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
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
            <span>🎯</span> PRÓXIMO DESAFÍO EN TU RUTA
          </span>
          {node.priority && (
            <span
              style={{
                fontSize: "10.5px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "1px 6px",
                borderRadius: "4px",
                border: "1px solid var(--border-line)",
              }}
            >
              p#{node.priority}
            </span>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
          {node.label}
        </h2>
        {node.lesson?.summary && (
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "720px" }}>
            {node.lesson.summary}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpenNode?.(node.id)}
        style={{
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 18px",
          background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "var(--radius-control)",
          color: "#ffffff",
          fontSize: "12.5px",
          fontWeight: 700,
          boxShadow: "0 0 16px rgba(56, 189, 248, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
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
