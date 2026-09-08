import React from "react";

export function GraphNode({ node, progress, category, onOpenNode }) {
  const score = progress?.score ?? progress?.latestAttempt?.score ?? null;
  const isMastered = score !== null && score >= 100;
  const isExtra = score !== null && score > 100;
  const catColor = category?.color || "#38BDF8";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenNode(node.id);
    }
  };

  return (
    <article
      tabIndex={0}
      onClick={() => onOpenNode(node.id)}
      onKeyDown={handleKeyDown}
      style={{
        background: "rgba(16, 21, 29, 0.9)",
        border: "1px solid var(--border-line)",
        borderRadius: "10px",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        cursor: "pointer",
        outline: "none",
        transition: "all 180ms ease-out",
        position: "relative",
        boxShadow: isExtra
          ? "0 0 16px rgba(245, 196, 81, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-line)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Category header & score badges */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: catColor, flexShrink: 0 }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: catColor, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            {category?.label || node.cat}
          </span>
        </div>

        {score !== null && (
          <span
            style={{
              fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
              color: isExtra ? "var(--color-status-excellence, #F5C451)" : isMastered ? "var(--accent-green)" : "var(--text-secondary)",
              background: isExtra ? "rgba(245, 196, 81, 0.12)" : "rgba(255, 255, 255, 0.05)",
              padding: "2px 6px", borderRadius: "4px",
              border: isExtra ? "1px solid rgba(245, 196, 81, 0.3)" : "1px solid var(--border-line-subtle)",
            }}
          >
            {isExtra ? `★ ${score}/120` : `${score}/120`}
          </span>
        )}
      </div>

      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)" }}>
        {node.label}
      </h3>

      {node.lesson?.summary && (
        <p
          title={node.lesson.summary}
          style={{
            margin: 0, fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.45,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
        >
          {node.lesson.summary}
        </p>
      )}

      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px",
          borderTop: "1px solid var(--border-line-subtle)", fontSize: "11px", color: "var(--text-muted)",
        }}
      >
        <span style={{ textTransform: "capitalize" }}>
          {node.lesson?.level ? `Nivel: ${node.lesson.level}` : `Prioridad: ${node.priority}`}
        </span>

        {node.prerequisites && node.prerequisites.length > 0 && (
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {node.prerequisites.length} prereq{node.prerequisites.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </article>
  );
}
