import React from "react";

export function TaskBanner({ task = null, onNavigateToTask = null }) {
  if (!task || task.status !== "running") return null;

  const stageIcon = task.stage === "judging" ? "⚖️" : task.stage === "evaluating" ? "🧠" : "🪄";
  const label = task.message || "Procesando tarea de IA en segundo plano…";

  return (
    <aside
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 20px",
        background: "rgba(112, 221, 212, 0.08)",
        borderBottom: "1px solid var(--accent-cyan)",
        color: "var(--text-primary)",
        fontSize: "12px",
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span className="pulse-dot" style={{ background: "var(--accent-cyan)" }} />
        <span style={{ fontSize: "14px" }} aria-hidden="true">{stageIcon}</span>
        <span style={{ fontWeight: 500 }}>{label}</span>
        {task.nodeId && (
          <span style={{ fontSize: "11px", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
            [{task.nodeId}]
          </span>
        )}
      </div>

      {onNavigateToTask && (
        <button
          type="button"
          onClick={() => onNavigateToTask(task.nodeId)}
          style={{
            padding: "4px 10px",
            background: "var(--bg-surface-emphasis)",
            border: "1px solid var(--accent-cyan)",
            borderRadius: "var(--radius-control)",
            color: "var(--accent-cyan)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Ver en vivo →
        </button>
      )}
    </aside>
  );
}
