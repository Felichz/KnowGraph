import React, { useState } from "react";
import { Sparkline } from "../common/Sparkline.jsx";
import { AttemptHistoryBar } from "./AttemptHistoryBar.jsx";
import { EvaluationLoader } from "./EvaluationLoader.jsx";

export function EvaluateStage({
  evaluation = null,
  attempts = [],
  isEvaluating = false,
  evalStartedAt = null,
  streamingChars = 0,
  onCancel = null,
  onRetry,
}) {
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(null);

  if (isEvaluating) {
    return <EvaluationLoader startedAt={evalStartedAt} streamingChars={streamingChars} onCancel={onCancel} />;
  }

  const activeAttempt = selectedAttemptIndex != null ? attempts[selectedAttemptIndex] : null;
  const activeEval = activeAttempt?.evaluation || evaluation;

  if (!activeEval) {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "14px", marginBottom: "16px" }}>Todavía no evaluaste tu explicación para este concepto.</p>
        <button type="button" onClick={onRetry} style={{ padding: "9px 18px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-line)", borderRadius: "var(--radius-control)", color: "var(--accent-cyan)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          Ir a Parafrasear →
        </button>
      </div>
    );
  }

  const score = activeEval.score ?? activeEval.displayScore ?? 0;
  const isMastery = score >= 100;
  const isExtra = score > 100;
  const feedback = activeEval.feedback || {};
  const rubric = activeEval.rubric || activeEval.scoreSummary?.rubric || {};
  const verdict = activeEval.conciseVerdict || feedback.conciseVerdict;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", color: "var(--text-primary)" }}>
      <AttemptHistoryBar
        attempts={attempts}
        currentIndex={selectedAttemptIndex}
        onSelectIndex={setSelectedAttemptIndex}
        onReturnCurrent={() => setSelectedAttemptIndex(null)}
      />

      {/* Unified Executive Score & Verdict */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border-line)" }}>
        {/* Score Column */}
        <div style={{ minWidth: "180px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--text-muted)", marginBottom: "4px" }}>
            {isExtra ? "★ EXCELENCIA (BONUS DORADO)" : isMastery ? "✓ BASE CUBIERTA (100 PTS)" : "EN PROGRESO"}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "36px", fontWeight: 800, fontFamily: "var(--font-mono)", color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--accent-cyan)", lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>/ 120</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            <Sparkline attempts={attempts} width={90} height={20} />
            <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{attempts.length} intentos</span>
          </div>
        </div>

        {/* Verdict Editorial Column */}
        {verdict && (
          <div style={{ flex: "1 1 300px", padding: "10px 16px", background: "rgba(56, 189, 248, 0.04)", borderLeft: "2px solid var(--accent-cyan)", borderRadius: "0 8px 8px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em", marginBottom: "3px" }}>VEREDICTO</span>
            <p style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.5, color: "var(--text-secondary)" }}>{verdict}</p>
          </div>
        )}
      </div>

      {/* Rúbrica Detallada (Compact 2x2 Grid) */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>RÚBRICA DE EVALUACIÓN (0–120)</span>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Meta: 100 base + 20 bonus</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "10px 20px" }}>
          {Object.entries(rubric).map(([key, dim]) => {
            const val = dim?.score ?? 0;
            const max = dim?.max ?? 100;
            const pct = Math.min(100, Math.round((val / max) * 100));
            return (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{dim?.label || key}</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: pct >= 100 ? "var(--accent-green)" : "var(--accent-cyan)" }}>{val}/{max}</strong>
                </div>
                <div style={{ width: "100%", height: "5px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #0284c7, var(--accent-cyan))", borderRadius: "9999px" }} />
                </div>
                {dim?.note && <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>{dim.note}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fortalezas y Gaps */}
      {(feedback.strengths?.length > 0 || feedback.gaps?.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", borderTop: "1px solid var(--border-line)", paddingTop: "14px" }}>
          {feedback.strengths?.length > 0 && (
            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--accent-green)", letterSpacing: "0.06em" }}>✓ PUNTOS FUERTES</span>
              <ul style={{ margin: "6px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {feedback.strengths.map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
          )}
          {feedback.gaps?.length > 0 && (
            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--accent-red)", letterSpacing: "0.06em" }}>✕ IDEAS QUE FALTARON</span>
              <ul style={{ margin: "6px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {feedback.gaps.map((g, i) => (<li key={i}>{g}</li>))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-line)", paddingTop: "12px" }}>
        <button type="button" onClick={onRetry} style={{ padding: "8px 18px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
          Volver a redactar y mejorar nota →
        </button>
      </div>
    </div>
  );
}
