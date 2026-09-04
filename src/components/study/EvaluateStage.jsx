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
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        <p>Todavía no evaluaste tu explicación para este concepto.</p>
        <button type="button" onClick={onRetry} style={{ padding: "8px 16px", background: "var(--bg-surface-raised)", borderRadius: "var(--radius-control)", color: "var(--accent-cyan)", fontSize: "13px" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-primary)" }}>
      {/* Barra de tiempo e historial de intentos */}
      <AttemptHistoryBar
        attempts={attempts}
        currentIndex={selectedAttemptIndex}
        onSelectIndex={setSelectedAttemptIndex}
        onReturnCurrent={() => setSelectedAttemptIndex(null)}
      />

      {/* Cabecera de Puntaje y Sparkline con aura dorada si es extra */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: `1px solid ${isExtra ? "var(--accent-gold)" : "var(--border-line)"}`, boxShadow: isExtra ? "0 0 20px rgba(232, 163, 61, 0.2)" : "none" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--text-muted)" }}>
            {isExtra ? "★ EXCELENCIA (BONUS DORADO)" : isMastery ? "✓ BASE CUBIERTA (100 PTS)" : "EN PROGRESO"}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, fontFamily: "var(--font-mono)", color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--accent-cyan)" }}>
              {score}
            </span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>/ 120</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>EVOLUCIÓN ({attempts.length} intentos)</span>
          <Sparkline attempts={attempts} width={130} height={36} />
        </div>
      </div>

      {verdict && (
        <div style={{ padding: "10px 14px", background: "var(--bg-surface)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-control)", fontSize: "13px" }}>
          <strong style={{ color: "var(--accent-cyan)" }}>Veredicto: </strong>{verdict}
        </div>
      )}

      {/* Rúbrica Analítica de 4 dimensiones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em" }}>RÚBRICA DE EVALUACIÓN (0–120)</span>
        {Object.entries(rubric).map(([key, dim]) => {
          const val = dim?.score ?? 0;
          const max = dim?.max ?? 100;
          const pct = Math.min(100, Math.round((val / max) * 100));
          return (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span>{dim?.label || key}</span>
                <strong style={{ fontFamily: "var(--font-mono)" }}>{val}/{max}</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-canvas)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "var(--accent-green)" : "var(--accent-cyan)" }} />
              </div>
              {dim?.note && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>{dim.note}</p>}
            </div>
          );
        })}
      </div>

      {/* Fortalezas y Gaps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
        {feedback.strengths?.length > 0 && (
          <div style={{ padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-green)" }}>PUNTOS FUERTES</span>
            <ul style={{ margin: "6px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
              {feedback.strengths.map((s, i) => (<li key={i}>{s}</li>))}
            </ul>
          </div>
        )}
        {feedback.gaps?.length > 0 && (
          <div style={{ padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)" }}>IDEAS QUE FALTARON</span>
            <ul style={{ margin: "6px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
              {feedback.gaps.map((g, i) => (<li key={i}>{g}</li>))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
        <button type="button" onClick={onRetry} style={{ padding: "8px 16px", background: "var(--bg-surface-raised)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", fontSize: "12px", fontWeight: 600 }}>
          Volver a redactar y mejorar nota →
        </button>
      </div>
    </div>
  );
}
