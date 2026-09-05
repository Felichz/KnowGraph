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
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px",
        background: isExtra ? "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(18, 22, 31, 0.9))" : isMastery ? "linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(18, 22, 31, 0.9))" : "var(--bg-surface)",
        borderRadius: "var(--radius-panel)",
        border: `1px solid ${isExtra ? "rgba(245, 158, 11, 0.5)" : isMastery ? "rgba(74, 222, 128, 0.4)" : "var(--border-line-strong)"}`,
        boxShadow: isExtra ? "0 0 28px rgba(245, 158, 11, 0.25)" : isMastery ? "0 0 20px rgba(74, 222, 128, 0.15)" : "var(--shadow-card)",
      }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--text-muted)" }}>
            {isExtra ? "★ EXCELENCIA (BONUS DORADO)" : isMastery ? "✓ BASE CUBIERTA (100 PTS)" : "EN PROGRESO"}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
            <span style={{ fontSize: "36px", fontWeight: 800, fontFamily: "var(--font-mono)", color: isExtra ? "var(--accent-gold)" : isMastery ? "var(--accent-green)" : "var(--accent-cyan)", textShadow: isExtra ? "0 0 20px rgba(245, 158, 11, 0.4)" : "none" }}>
              {score}
            </span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>/ 120</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>EVOLUCIÓN ({attempts.length} intentos)</span>
          <Sparkline attempts={attempts} width={130} height={36} />
        </div>
      </div>

      {verdict && (
        <div style={{ padding: "12px 16px", background: "rgba(94, 234, 212, 0.04)", border: "1px solid var(--border-accent)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-panel)", fontSize: "13px", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--accent-cyan)" }}>Veredicto: </strong>{verdict}
        </div>
      )}

      {/* Rúbrica Analítica de 4 dimensiones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line-strong)", boxShadow: "var(--shadow-card)" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>RÚBRICA DE EVALUACIÓN (0–120)</span>
        {Object.entries(rubric).map(([key, dim]) => {
          const val = dim?.score ?? 0;
          const max = dim?.max ?? 100;
          const pct = Math.min(100, Math.round((val / max) * 100));
          return (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                <span>{dim?.label || key}</span>
                <strong style={{ fontFamily: "var(--font-mono)", color: pct >= 100 ? "var(--accent-green)" : "var(--text-primary)" }}>{val}/{max}</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(10, 13, 18, 0.8)", borderRadius: "9999px", overflow: "hidden", border: "1px solid var(--border-line)" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "linear-gradient(90deg, #22c55e, #4ade80)" : "linear-gradient(90deg, #0284c7, var(--accent-cyan))", borderRadius: "9999px" }} />
              </div>
              {dim?.note && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>{dim.note}</p>}
            </div>
          );
        })}
      </div>

      {/* Fortalezas y Gaps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
        {feedback.strengths?.length > 0 && (
          <div style={{ padding: "14px", background: "rgba(74, 222, 128, 0.04)", borderRadius: "var(--radius-panel)", border: "1px solid rgba(74, 222, 128, 0.2)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-green)", letterSpacing: "0.05em" }}>✓ PUNTOS FUERTES</span>
            <ul style={{ margin: "8px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {feedback.strengths.map((s, i) => (<li key={i}>{s}</li>))}
            </ul>
          </div>
        )}
        {feedback.gaps?.length > 0 && (
          <div style={{ padding: "14px", background: "rgba(248, 113, 113, 0.04)", borderRadius: "var(--radius-panel)", border: "1px solid rgba(248, 113, 113, 0.2)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)", letterSpacing: "0.05em" }}>✕ IDEAS QUE FALTARON</span>
            <ul style={{ margin: "8px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {feedback.gaps.map((g, i) => (<li key={i}>{g}</li>))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
        <button type="button" onClick={onRetry} style={{ padding: "9px 18px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line-strong)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
          Volver a redactar y mejorar nota →
        </button>
      </div>
    </div>
  );
}
