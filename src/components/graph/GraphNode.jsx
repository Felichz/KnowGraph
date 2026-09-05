import React from "react";

export function GraphNode({
  node,
  categoryColor = "#5eead4",
  status = "unseen",
  score = null,
  isSelected = false,
  hasActiveTask = false,
  missingPrereqCount = 0,
  onClick,
}) {
  const isCompleted = status === "completed" || score >= 100;
  const isMastery = score >= 100;
  const isExtra = score > 100;

  const borderColor = isSelected
    ? "var(--accent-cyan)"
    : isExtra
      ? "rgba(245, 158, 11, 0.45)"
      : "rgba(255, 255, 255, 0.08)";

  const shadow = isSelected
    ? "0 0 20px -2px rgba(94, 234, 212, 0.25), 0 6px 16px rgba(0, 0, 0, 0.5)"
    : isExtra
      ? "0 0 16px -2px rgba(245, 158, 11, 0.2), 0 6px 16px rgba(0, 0, 0, 0.45)"
      : "0 2px 8px rgba(0, 0, 0, 0.3)";

  return (
    <article
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "14px 16px 12px 18px",
        background: isSelected
          ? "linear-gradient(180deg, rgba(28, 36, 52, 0.85) 0%, rgba(18, 23, 34, 0.95) 100%)"
          : "linear-gradient(180deg, rgba(20, 25, 36, 0.7) 0%, rgba(14, 17, 25, 0.85) 100%)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        borderRadius: "var(--radius-card)",
        cursor: "pointer",
        minHeight: "82px",
        transition: "all var(--transition-fast)",
      }}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
      aria-selected={isSelected}
    >
      {/* Indicador lateral sutil de categoría */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "14px",
          bottom: "14px",
          width: "3px",
          borderRadius: "0 3px 3px 0",
          background: isExtra ? "var(--accent-gold)" : categoryColor,
          boxShadow: `0 0 8px ${isExtra ? "var(--accent-gold)" : categoryColor}40`,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
          {node.label}
        </h3>
        {hasActiveTask && <span className="pulse-dot" title="Evaluación con IA en progreso" />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", fontSize: "11px" }}>
        {/* Score o estado */}
        {score != null ? (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "11px",
              color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--accent-cyan)",
              background: isExtra ? "rgba(245, 158, 11, 0.12)" : isMastery ? "rgba(74, 222, 128, 0.1)" : "rgba(94, 234, 212, 0.1)",
              padding: "2px 7px",
              borderRadius: "5px",
              border: `1px solid ${isExtra ? "rgba(245, 158, 11, 0.3)" : isMastery ? "rgba(74, 222, 128, 0.25)" : "rgba(94, 234, 212, 0.25)"}`,
            }}
          >
            {isExtra ? `★ ${score}/120` : `${score}/120`}
          </span>
        ) : isCompleted ? (
          <span style={{ color: "var(--accent-green)", fontWeight: 600, background: "rgba(74, 222, 128, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>✓ Listo</span>
        ) : (
          <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--text-muted)", opacity: 0.5 }} />
            Pendiente
          </span>
        )}

        {/* Alerta de prerrequisitos si faltan */}
        {missingPrereqCount > 0 && !isCompleted && (
          <span
            title={`${missingPrereqCount} conceptos previos recomendados`}
            style={{ fontSize: "10px", color: "var(--accent-gold)", background: "rgba(245, 158, 11, 0.1)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.2)" }}
          >
            ⚠️ {missingPrereqCount} prereqs
          </span>
        )}
      </div>
    </article>
  );
}
