import React, { useMemo } from "react";
import { REACT_MILESTONES, REACT_SENIORITY_BANDS } from "../../reactMilestones.js";
import { getMilestoneProgress, getSeniorityProgress } from "../../logic/seniorityProgress.js";

export function SeniorityDrawer({
  isOpen,
  onClose,
  graph,
  progressMap = {},
}) {
  const bands = graph?.seniorityBands?.length ? graph.seniorityBands : REACT_SENIORITY_BANDS;
  const milestones = graph?.milestones?.length ? graph.milestones : REACT_MILESTONES;

  const { bandProgress, milestoneProgress } = useMemo(() => {
    const checked = new Set(
      Object.entries(progressMap)
        .filter(([, prog]) => (prog?.score ?? prog?.latestAttempt?.score ?? 0) >= 100)
        .map(([id]) => id)
    );
    const nodeIds = graph?.nodeIds || new Set((graph?.nodes || []).map((n) => n.id));

    return {
      bandProgress: getSeniorityProgress(bands, checked, nodeIds),
      milestoneProgress: getMilestoneProgress(milestones, checked, nodeIds),
    };
  }, [bands, milestones, graph, progressMap]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        aria-label="Panel de Seniority y Milestones"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100%",
          background: "var(--color-surface-card, #10151D)",
          borderLeft: "1px solid var(--border-line)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.65)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            Seniority & Milestones
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-secondary)",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Seniority Bands Section */}
          <section>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              NIVELES DE SENIORITY
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {bandProgress.map((band) => (
                <div
                  key={band.id}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-line-subtle)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {band.label}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mono)", color: band.percentage === 100 ? "var(--accent-green)" : "var(--text-secondary)" }}>
                      {band.percentage}%
                    </span>
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "11.5px", color: "var(--text-muted)", lineHeight: 1.35 }}>
                    {band.description}
                  </p>
                  <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${band.percentage}%`, height: "100%", background: band.color || "var(--color-brand-primary, #5EEAD4)", borderRadius: "2px", transition: "width 0.3s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones Section */}
          <section>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              HITOS DE APRENDIZAJE
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {milestoneProgress.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-line-subtle)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                      {m.done}/{m.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
