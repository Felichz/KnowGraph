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
        flexWrap: "wrap",
        gap: "16px",
        padding: "20px 26px",
        background: "linear-gradient(135deg, rgba(26, 36, 60, 0.75) 0%, rgba(13, 18, 32, 0.9) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "var(--radius-panel)",
        boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(16px)",
      }}
      aria-label="Recomendación de estudio"
    >
      {/* Glow decorative highlight */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          left: "20%",
          width: "240px",
          height: "80px",
          background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.07em",
              color: "var(--accent-cyan)",
              background: "rgba(56, 189, 248, 0.1)",
              padding: "3px 9px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
            }}
          >
            <span>🎯</span> PRÓXIMO DESAFÍO EN TU RUTA
          </span>
          {node.priority && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "2px 7px",
                borderRadius: "4px",
                border: "1px solid var(--border-line)",
              }}
            >
              p#{node.priority}
            </span>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          {node.label}
        </h2>
      </div>

      <button
        type="button"
        onClick={() => onOpenNode?.(node.id)}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 22px",
          background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "var(--radius-control)",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 700,
          boxShadow: "0 0 20px rgba(56, 189, 248, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
        }}
      >
        <span>Estudiar ahora</span>
        <span>→</span>
      </button>
    </aside>
  );
}
