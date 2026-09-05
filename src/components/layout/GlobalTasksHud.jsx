import React, { useState } from "react";
import { cancelTask } from "../../ai/backgroundTaskManager.js";

export function GlobalTasksHud({ activeTasks = [], onOpenNode }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!activeTasks || activeTasks.length === 0) return null;

  return (
    <aside
      style={{
        position: "fixed", bottom: "20px", right: "20px", zIndex: 3000,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px",
      }}
      aria-label="Tareas activas en segundo plano"
    >
      {/* Popover con lista de tareas */}
      {popoverOpen && (
        <div
          style={{
            width: "320px", background: "rgba(18, 22, 31, 0.96)", backdropFilter: "blur(16px)",
            border: "1px solid var(--border-accent)", borderRadius: "var(--radius-panel)",
            padding: "16px", boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(94, 234, 212, 0.15)",
            display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>⚡</span> Tarjetas procesando con IA
            </strong>
            <button type="button" onClick={() => setPopoverOpen(false)} style={{ fontSize: "16px", color: "var(--text-muted)", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
            {activeTasks.map((t) => (
              <div key={`${t.graphId}-${t.nodeId}`} style={{ padding: "10px", background: "rgba(10, 13, 18, 0.75)", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line-strong)" }}>
                <div style={{ fontWeight: 700, marginBottom: "3px", color: "var(--text-primary)" }}>{t.node?.label || t.nodeId}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", lineHeight: 1.4 }}>
                  {t.message || "Procesando..."} {t.progress ? `(${t.progress} chars)` : ""}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => { onOpenNode?.(t.nodeId); setPopoverOpen(false); }}
                    style={{ padding: "4px 10px", background: "linear-gradient(135deg, var(--accent-cyan), #38bdf8)", color: "#08090d", borderRadius: "5px", fontSize: "11px", fontWeight: 700, border: "none" }}
                  >
                    Abrir card →
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelTask(t.graphId, t.nodeId)}
                    style={{ padding: "4px 10px", background: "rgba(248, 113, 113, 0.12)", color: "var(--accent-red)", border: "1px solid rgba(248, 113, 113, 0.3)", borderRadius: "5px", fontSize: "11px", fontWeight: 600 }}
                  >
                    Cancelar ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón flotante pulso */}
      <div
        onClick={() => setPopoverOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
          background: "rgba(18, 22, 31, 0.95)", backdropFilter: "blur(12px)", border: "1px solid var(--border-accent)",
          borderRadius: "9999px", boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 16px rgba(94, 234, 212, 0.2)", cursor: "pointer",
        }}
      >
        <span className="pulse-dot" style={{ width: "8px", height: "8px", background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }} />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
          ⚡ {activeTasks.length} {activeTasks.length === 1 ? "tarea en curso" : "tareas en curso"}
        </span>
      </div>
    </aside>
  );
}
