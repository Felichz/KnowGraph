import React from "react";

export function GraphNode({
  node,
  categoryColor = "#70ddd4",
  status = "unseen", // "completed" | "in_progress" | "unseen"
  score = null,
  isSelected = false,
  hasActiveTask = false,
  missingPrereqCount = 0,
  onClick,
}) {
  const isCompleted = status === "completed" || score >= 100;
  const isMastery = score >= 100;
  const isExtra = score > 100;

  const borderColor = isSelected ? "var(--accent-cyan)" : isExtra ? "var(--accent-gold)" : "var(--border-line)";

  return (
    <article
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "12px 14px",
        background: isSelected ? "var(--bg-surface-emphasis)" : "var(--bg-surface)",
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${isExtra ? "var(--accent-gold)" : categoryColor}`,
        boxShadow: isExtra ? "0 0 12px rgba(232, 163, 61, 0.2)" : "none",
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        minHeight: "76px",
        transition: "all var(--transition-fast)",
      }}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
      aria-selected={isSelected}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
          {node.label}
        </h3>
        {hasActiveTask && <span className="pulse-dot" title="Evaluación con IA en progreso" />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", fontSize: "11px" }}>
        {/* Score o estado */}
        {score != null ? (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--accent-cyan)",
            }}
          >
            {isExtra ? `★ ${score}/120` : `${score}/120`}
          </span>
        ) : isCompleted ? (
          <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>✓ Listo</span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>Pendiente</span>
        )}

        {/* Alerta de prerrequisitos si faltan */}
        {missingPrereqCount > 0 && !isCompleted && (
          <span
            title={`${missingPrereqCount} conceptos previos recomendados`}
            style={{ fontSize: "10px", color: "var(--accent-gold)", background: "rgba(230, 185, 91, 0.1)", padding: "2px 5px", borderRadius: "4px" }}
          >
            {missingPrereqCount} prereqs
          </span>
        )}
      </div>
    </article>
  );
}
