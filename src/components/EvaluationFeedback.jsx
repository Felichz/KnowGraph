import React from "react";
import { RubricBars } from "./RubricBars.jsx";
import { getCompletionView, getScoreView, STATUS_LABEL, SEVERITY_LABEL } from "../ai/types.js";
import { ModelMeta } from "./ModelMeta.jsx";

export function EvaluationFeedback({ evaluation, attemptNumber, total, attemptContentHash, currentContentHash, model, routedVia }) {
  if (!evaluation) return null;
  const stale = Boolean(attemptContentHash && currentContentHash && attemptContentHash !== currentContentHash);
  const score = getScoreView(evaluation);
  const completion = getCompletionView(evaluation);

  return (
    <article className={`feedback ${score.isExtra ? "feedback--extra" : ""}`} aria-live="polite">
      <header className="feedback__head">
        <div className="feedback__score-block">
          <div className="feedback__score-wrap">
            <div className="feedback__score">
              <strong>{score.displayScore}</strong>
              <span>/{score.displayMax}</span>
            </div>
            <div className="feedback__score-meta">Cobertura conceptual: {score.coveragePercent}/100</div>
          </div>
          <div className={`feedback__status feedback__status--${score.status}`}>
            {STATUS_LABEL[score.status] ?? score.status}
          </div>
        </div>
        {typeof attemptNumber === "number" && typeof total === "number" && (
          <div className="feedback__counter">Intento {attemptNumber} de {total}</div>
        )}
        <ModelMeta model={model} routedVia={routedVia} />
      </header>

      <ScoreMeter score={score} />

      <div className={`feedback__completion ${completion.isComplete ? "is-complete" : ""}`} role="status">
        {completion.isComplete
          ? `✓ Superficie conceptual cubierta · 100% (${completion.score}/${completion.max})`
          : `Cobertura conceptual: ${completion.percent}% (${completion.score}/${completion.max} puntos) · último score global: ${score.displayScore}/120 · faltan ideas esenciales, no ejemplos ni profundidad extra.`}
      </div>

      {stale && (
        <div className="feedback__stale" role="status">
          Esta evaluación se hizo con una versión anterior de la card. Podés reintentar para evaluarla con el contenido actual.
        </div>
      )}

      <RubricBars rubric={evaluation.rubric} />

      <Section title="Lo que estuvo bien">
        {evaluation.strengths?.length
          ? <ul>{evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
          : <p className="muted">Sin aspectos destacados.</p>}
      </Section>

      {evaluation.gaps?.length > 0 && (
        <Section title="Para mejorar">
          <ul className="feedback__gaps">
            {evaluation.gaps.map((g, i) => (
              <li key={i}>
                <span className={`sev sev--${g.severity}`}>{SEVERITY_LABEL[g.severity] ?? g.severity}</span>
                <strong>{g.topic}:</strong> {g.explanation}
                {g.revisionHint && <em className="hint"> → {g.revisionHint}</em>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {evaluation.misconceptions?.length > 0 && (
        <Section title="Correcciones">
          {evaluation.misconceptions.map((m, i) => (
            <div className="feedback__miscon" key={i}>
              {m.quote && <blockquote>{m.quote}</blockquote>}
              <p>{m.correction}</p>
            </div>
          ))}
        </Section>
      )}

      <Section title="Próximo intento">
        <p className="feedback__prompt">{evaluation.nextAttemptPrompt}</p>
      </Section>

      <p className="feedback__verdict">{evaluation.conciseVerdict}</p>
    </article>
  );
}

function ScoreMeter({ score }) {
  const baseWidth = `${Math.min(100, score.displayScore) / score.displayMax * 100}%`;
  const extraWidth = `${score.extraPoints / score.displayMax * 100}%`;
  return (
    <div className={`feedback__score-meter ${score.isExtra ? "is-extra" : ""}`}>
      <div className="feedback__score-track" role="progressbar" aria-label={`Score ${score.displayScore} de ${score.displayMax}`} aria-valuemin="0" aria-valuemax={score.displayMax} aria-valuenow={score.displayScore}>
        <span className="feedback__score-base" style={{ width: baseWidth }} />
        {score.isExtra && <span className="feedback__score-extra" style={{ width: extraWidth }} />}
        <span className="feedback__score-threshold" aria-hidden="true" />
      </div>
      <div className="feedback__score-meter-labels">
        <span>0</span>
        <span className="feedback__mastery-label">100 · base suficiente</span>
        <span>120 · excelencia</span>
      </div>
      <p className="feedback__score-explanation">
        {score.isExtra
          ? `Ya cubriste la base. Los ${score.extraPoints} puntos dorados son profundización opcional.`
          : score.isMastery
            ? "Base suficiente alcanzada. Podés avanzar o seguir profundizando si este concepto lo merece."
            : "El score todavía mide cobertura de piezas esenciales de la card."}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="feedback__section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}
