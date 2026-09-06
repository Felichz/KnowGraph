import React from "react";

export function GraphNode({
  node,
  categoryColor = "#38bdf8",
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
    ? "rgba(56, 189, 248, 0.65)"
    : isExtra
      ? "rgba(245, 158, 11, 0.45)"
      : "rgba(255, 255, 255, 0.08)";

  const shadow = isSelected
    ? "0 0 24px -2px rgba(56, 189, 248, 0.3), 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)"
    : isExtra
      ? "0 0 20px -2px rgba(245, 158, 11, 0.22), 0 6px 20px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(251, 191, 36, 0.18)"
      : "0 4px 16px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)";

  const background = isSelected
    ? "linear-gradient(180deg, rgba(28, 38, 62, 0.88) 0%, rgba(16, 22, 36, 0.98) 100%)"
    : isExtra
      ? "linear-gradient(180deg, rgba(32, 34, 44, 0.8) 0%, rgba(14, 18, 28, 0.94) 100%)"
      : "linear-gradient(180deg, rgba(20, 27, 44, 0.75) 0%, rgba(12, 16, 26, 0.92) 100%)";

  return (
    <article
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "10px",
        padding: "14px 16px 12px 18px",
        background,
        backdropFilter: "blur(12px)",
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
      {/* Category Left Accent Indicator (Always preserve category identity) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "10px",
          bottom: "10px",
          width: "3px",
          borderRadius: "0 2px 2px 0",
          background: categoryColor,
          boxShadow: `0 0 8px ${categoryColor}60`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.35, letterSpacing: "-0.015em" }}>
            {node.label}
          </h3>
          {hasActiveTask && <span className="pulse-dot" title="Evaluación con IA en progreso" />}
        </div>
        {node.lesson?.summary && (
          <p style={{ margin: 0, fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", opacity: 0.8 }}>
            {node.lesson.summary}
          </p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", marginTop: "4px" }}>
        {/* Score or Status Pill */}
        {score != null ? (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "11px",
              color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--accent-cyan)",
              background: isExtra ? "rgba(245, 158, 11, 0.14)" : isMastery ? "rgba(16, 185, 129, 0.12)" : "rgba(56, 189, 248, 0.12)",
              padding: "2px 8px",
              borderRadius: "6px",
              border: `1px solid ${isExtra ? "rgba(245, 158, 11, 0.35)" : isMastery ? "rgba(16, 185, 129, 0.3)" : "rgba(56, 189, 248, 0.3)"}`,
            }}
          >
            {isExtra ? `★ ${score}/120` : `${score}/120`}
          </span>
        ) : isCompleted ? (
          <span style={{ color: "var(--accent-green)", fontWeight: 600, background: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
            ✓ Listo
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--text-muted)", opacity: 0.5 }} />
            Pendiente
          </span>
        )}

        {/* Missing Prerequisites Alert or Priority Tag */}
        {missingPrereqCount > 0 && !isCompleted ? (
          <span
            title={`${missingPrereqCount} conceptos previos recomendados`}
            style={{
              fontSize: "10.5px",
              color: "var(--accent-gold)",
              background: "rgba(245, 158, 11, 0.1)",
              padding: "2px 7px",
              borderRadius: "6px",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              fontWeight: 500,
            }}
          >
            ⚠️ {missingPrereqCount} prereqs
          </span>
        ) : node.priority ? (
          <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", opacity: 0.8 }}>
            p#{node.priority}
          </span>
        ) : null}
      </div>
    </article>
  );
}
