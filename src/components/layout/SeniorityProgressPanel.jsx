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
          width: "100%", maxWidth: "480px", height: "100%", background: "linear-gradient(180deg, #121622 0%, #0b0d14 100%)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.12)", boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.7)", display: "flex", flexDirection: "column",
          padding: "24px 28px", overflowY: "auto", gap: "20px", color: "var(--text-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>MAPA CURRICULAR</span>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, letterSpacing: "-0.015em" }}>Progreso y Seniority</h2>
          </div>
          <button type="button" onClick={onClose} style={{ fontSize: "20px", color: "var(--text-muted)", padding: "4px 8px", borderRadius: "4px", lineHeight: 1 }}>×</button>
        </div>

        {/* Barra global */}
        <div style={{ padding: "16px", background: "linear-gradient(135deg, rgba(94, 234, 212, 0.08) 0%, rgba(20, 26, 38, 0.85) 100%)", borderRadius: "14px", border: "1px solid rgba(94, 234, 212, 0.25)", boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "8px" }}>
            <span style={{ color: "var(--text-secondary)" }}>Dominio total del temario</span>
            <strong style={{ fontFamily: "var(--font-mono)" }}>{doneCount}/{totalCount} ({percent}%)</strong>
          </div>
          <div style={{ width: "100%", height: "7px", background: "rgba(0, 0, 0, 0.4)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-green))", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Bandas de Seniority */}
        {seniorityBands.length > 0 && (
          <section>
            <h3 style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px", fontFamily: "var(--font-mono)" }}>
              NIVELES DE SENIORITY
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {seniorityBands.map((band) => (
                <div key={band.id} style={{ padding: "12px 14px", background: "rgba(22, 28, 40, 0.75)", borderRadius: "12px", border: `1px solid ${band.complete ? "rgba(74, 222, 128, 0.35)" : "var(--border-line)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "13px" }}>{band.label}</strong>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: band.complete ? "var(--accent-green)" : "var(--accent-gold)", background: band.complete ? "rgba(74, 222, 128, 0.1)" : "rgba(245, 158, 11, 0.1)", padding: "2px 7px", borderRadius: "5px", border: `1px solid ${band.complete ? "rgba(74, 222, 128, 0.25)" : "rgba(245, 158, 11, 0.25)"}` }}>
                      {band.complete ? "✓ CERRADA" : `${band.done}/${band.total}`}
                    </span>
                  </div>
                  {band.description && <p style={{ margin: "6px 0 0", fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>{band.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <section>
            <h3 style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px", fontFamily: "var(--font-mono)" }}>
              HITOS DE APRENDIZAJE (MILESTONES)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {milestones.map((m) => (
                <div key={m.id} style={{ padding: "12px 14px", background: "rgba(22, 28, 40, 0.75)", borderRadius: "12px", border: `1px solid ${m.percentage === 100 ? "rgba(94, 234, 212, 0.35)" : "var(--border-line)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600 }}>
                    <span>{m.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: m.percentage === 100 ? "var(--accent-cyan)" : "var(--text-secondary)" }}>{m.percentage}%</span>
                  </div>
                  <div style={{ width: "100%", height: "5px", background: "rgba(0, 0, 0, 0.35)", borderRadius: "3px", overflow: "hidden", margin: "6px 0" }}>
                    <div style={{ width: `${m.percentage}%`, height: "100%", background: m.color || "var(--accent-cyan)", transition: "width 0.4s ease" }} />
                  </div>
                  <p style={{ margin: 0, fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{m.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
