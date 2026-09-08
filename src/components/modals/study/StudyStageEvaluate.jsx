import React, { useEffect, useState } from "react";
import { StudyEvaluationLoader } from "./StudyEvaluationLoader.jsx";

export function StudyStageEvaluate({
  attempts = [],
  activeEvaluation = null,
  onCancelEvaluation,
}) {
  const [viewIndex, setViewIndex] = useState(attempts.length ? attempts.length - 1 : 0);

  useEffect(() => {
    if (attempts.length) setViewIndex(attempts.length - 1);
  }, [attempts.length]);

  if (activeEvaluation && activeEvaluation.status === "running") {
    return <StudyEvaluationLoader chars={activeEvaluation.chars || 0} onCancel={onCancelEvaluation} />;
  }

  if (!attempts.length) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13.5px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px dashed var(--border-line)" }}>
        No hay evaluaciones registradas para este concepto. Escribí tu parafraseo en la etapa 03 y presiona <strong>Evaluar con IA</strong>.
      </div>
    );
  }

  const currentAttempt = attempts[viewIndex] || attempts[attempts.length - 1];
  const evalData = currentAttempt.evaluation || {};
  const score = currentAttempt.score ?? evalData.score ?? 0;
  const isLatest = viewIndex === attempts.length - 1;
  const isExtra = score > 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Time-Travel Pagination Strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border-line-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setViewIndex((prev) => Math.max(0, prev - 1))} disabled={viewIndex === 0}
            style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", opacity: viewIndex === 0 ? 0.4 : 1, cursor: viewIndex === 0 ? "default" : "pointer" }}>
            ←
          </button>
          <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
            Intento {viewIndex + 1} de {attempts.length}
          </span>
          <button onClick={() => setViewIndex((prev) => Math.min(attempts.length - 1, prev + 1))} disabled={isLatest}
            style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", opacity: isLatest ? 0.4 : 1, cursor: isLatest ? "default" : "pointer" }}>
            →
          </button>
        </div>

        <div>
          {isLatest ? (
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-brand-primary, #5EEAD4)" }}>Último resultado</span>
          ) : (
            <button onClick={() => setViewIndex(attempts.length - 1)} style={{ fontSize: "11px", color: "var(--accent-cyan)", textDecoration: "underline", cursor: "pointer" }}>
              Volver a la versión actual
            </button>
          )}
        </div>
      </div>

      {/* Score & Verdict Card */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "10px",
        background: isExtra ? "rgba(245, 196, 81, 0.08)" : "rgba(16, 22, 35, 0.8)",
        border: isExtra ? "1px solid rgba(245, 196, 81, 0.35)" : "1px solid var(--border-line)",
        boxShadow: isExtra ? "0 0 20px rgba(245, 196, 81, 0.15)" : "none",
      }}>
        <div>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Calificación Canónica</span>
          <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "var(--font-mono)", color: isExtra ? "var(--color-status-excellence, #F5C451)" : "#F8FAFC" }}>
            {score} / 120 {isExtra && <span style={{ fontSize: "13px", marginLeft: "8px" }}>★ Bonus Staff</span>}
          </div>
        </div>
        <div style={{ maxWidth: "60%", textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            {evalData.conciseVerdict || currentAttempt.conciseVerdict || "Evaluación técnica completada según rúbrica senior."}
          </p>
        </div>
      </div>

      {/* 4 Rubric Criteria */}
      {evalData.rubric && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {Object.entries(evalData.rubric).map(([key, item]) => (
            <div key={key} style={{ padding: "10px 12px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-line-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>{item.label || key}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{item.score} / {item.max}</span>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.35 }}>{item.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
