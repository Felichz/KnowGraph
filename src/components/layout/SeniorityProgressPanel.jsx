import React from "react";
import { getSeniorityProgress, getMilestoneProgress } from "../../logic/seniorityProgress.js";

export function SeniorityProgressPanel({
  open = false,
  onClose,
  graph,
  progressMap = {},
}) {
  if (!open || !graph) return null;

  const checked = new Set(
    Object.entries(progressMap)
      .filter(([, p]) => p.status === "completed" || p.score >= 100)
      .map(([id]) => id)
  );

  const totalNodeIds = new Set(graph.nodes.map((n) => n.id));
  const seniorityBands = getSeniorityProgress(graph.seniorityBands || [], checked, totalNodeIds);
  const milestones = getMilestoneProgress(graph.milestones || [], checked, totalNodeIds);

  const doneCount = checked.size;
  const totalCount = graph.nodes.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(9, 11, 15, 0.75)",
        backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", justifyContent: "flex-end",
      }}
      onClick={onClose}
      role="dialog"
      aria-label="Panel de Seniority y Milestones"
    >
      <div
        style={{
          width: "100%", maxWidth: "480px", height: "100%", background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-line-strong)", display: "flex", flexDirection: "column",
          padding: "24px", overflowY: "auto", gap: "20px", color: "var(--text-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>MAPA CURRICULAR</span>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Progreso y Seniority</h2>
          </div>
          <button type="button" onClick={onClose} style={{ fontSize: "20px", color: "var(--text-muted)", padding: "2px 8px" }}>×</button>
        </div>

        {/* Barra global */}
        <div style={{ padding: "12px", background: "var(--bg-workspace)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
            <span>Dominio total del temario</span>
            <strong>{doneCount}/{totalCount} ({percent}%)</strong>
          </div>
          <div style={{ width: "100%", height: "8px", background: "var(--bg-canvas)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "var(--accent-green)", transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Bandas de Seniority */}
        {seniorityBands.length > 0 && (
          <section>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "10px" }}>
              NIVELES DE SENIORITY
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {seniorityBands.map((band) => (
                <div key={band.id} style={{ padding: "10px 14px", background: "var(--bg-surface-raised)", borderRadius: "var(--radius-control)", border: `1px solid ${band.complete ? "var(--accent-green)" : "var(--border-line)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "13px" }}>{band.label}</strong>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: band.complete ? "var(--accent-green)" : "var(--accent-gold)" }}>
                      {band.complete ? "✓ CERRADA" : `${band.done}/${band.total}`}
                    </span>
                  </div>
                  {band.description && <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--text-secondary)" }}>{band.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <section>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "10px" }}>
              HITOS DE APRENDIZAJE (MILESTONES)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {milestones.map((m) => (
                <div key={m.id} style={{ padding: "12px", background: "var(--bg-surface-raised)", borderRadius: "var(--radius-control)", border: `1px solid ${m.percentage === 100 ? "var(--accent-cyan)" : "var(--border-line)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600 }}>
                    <span>{m.label}</span>
                    <span>{m.percentage}%</span>
                  </div>
                  <div style={{ width: "100%", height: "5px", background: "var(--bg-canvas)", borderRadius: "3px", overflow: "hidden", margin: "6px 0" }}>
                    <div style={{ width: `${m.percentage}%`, height: "100%", background: m.color || "var(--accent-cyan)" }} />
                  </div>
                  <p style={{ margin: 0, fontSize: "11px", color: "var(--text-secondary)" }}>{m.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
