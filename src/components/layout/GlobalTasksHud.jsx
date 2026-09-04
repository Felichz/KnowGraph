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
            width: "320px", background: "var(--bg-surface)", border: "1px solid var(--accent-cyan)",
            borderRadius: "var(--radius-panel)", padding: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ color: "var(--accent-cyan)" }}>Tarjetas procesando con IA</strong>
            <button type="button" onClick={() => setPopoverOpen(false)} style={{ fontSize: "16px", color: "var(--text-muted)" }}>×</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
            {activeTasks.map((t) => (
              <div key={`${t.graphId}-${t.nodeId}`} style={{ padding: "8px", background: "var(--bg-workspace)", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
                <div style={{ fontWeight: 700, marginBottom: "2px" }}>{t.node?.label || t.nodeId}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t.message || "Procesando..."} {t.progress ? `(${t.progress} chars)` : ""}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => { onOpenNode?.(t.nodeId); setPopoverOpen(false); }}
                    style={{ padding: "2px 8px", background: "var(--accent-cyan)", color: "var(--bg-workspace)", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}
                  >
                    Abrir card →
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelTask(t.graphId, t.nodeId)}
                    style={{ padding: "2px 8px", background: "rgba(239,118,104,0.15)", color: "var(--accent-red)", border: "1px solid var(--accent-red)", borderRadius: "4px", fontSize: "11px" }}
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
          display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px",
          background: "var(--bg-surface)", border: "1px solid var(--accent-cyan)",
          borderRadius: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", cursor: "pointer",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-cyan)" }} />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
          ⚡ {activeTasks.length} {activeTasks.length === 1 ? "tarea en curso" : "tareas en curso"}
        </span>
      </div>
    </aside>
  );
}
