import React from "react";
import { RubricBars } from "./RubricBars.jsx";
import { getCompletionView, getScoreView, STATUS_LABEL, SEVERITY_LABEL } from "../ai/types.js";

export function EvaluationFeedback({ evaluation, attemptContentHash, currentContentHash, coachHint = null }) {
  if (!evaluation) return null;
  const stale = Boolean(attemptContentHash && currentContentHash && attemptContentHash !== currentContentHash);
  const score = getScoreView(evaluation);
  const completion = getCompletionView(evaluation);
  const primaryGap = evaluation.gaps?.[0] ?? null;
  const detailCount = (evaluation.strengths?.length ?? 0)
    + (evaluation.gaps?.length ?? 0)
    + (evaluation.misconceptions?.length ?? 0);

  return (
    <article className={`feedback ${score.isExtra ? "feedback--extra" : ""}`} aria-live="polite">
      <header className="feedback__overview">
        <div className="feedback__score-block">
          <div className="feedback__score-wrap">
            <div className="feedback__score">
              <strong>{score.displayScore}</strong>
              <span>/{score.displayMax}</span>
            </div>
            <div className="feedback__score-meta">Cobertura conceptual: {score.coveragePercent}%</div>
          </div>
          <div className={`feedback__status feedback__status--${score.status}`}>
            {STATUS_LABEL[score.status] ?? score.status}
          </div>
        </div>

        <div className="feedback__verdict-block">
          <span>RESULTADO</span>
          <p>{evaluation.conciseVerdict}</p>
        </div>
      </header>

      <ScoreMeter score={score} />

      <div className={`feedback__completion ${completion.isComplete ? "is-complete" : ""}`} role="status">
        {completion.isComplete
          ? `✓ Superficie conceptual cubierta · 100% (${completion.score}/${completion.max})`
          : `Cobertura esencial: ${completion.percent}% (${completion.score}/${completion.max}) · todavía faltan ideas de la card.`}
      </div>

      {stale && (
        <div className="feedback__stale" role="status">
          Esta evaluación corresponde a una versión anterior de la card. Reintentá para medir el contenido actual.
        </div>
      )}

      <PriorityFeedback gap={primaryGap} prompt={evaluation.nextAttemptPrompt} isMastery={score.isMastery} coachHint={coachHint} />

      <RubricBars rubric={evaluation.rubric} compact />

      <details className="feedback__details">
        <summary>
          <span>Ver análisis completo</span>
          <small>{detailCount} observaciones</small>
        </summary>
        <div className="feedback__details-body">
          <Section title="Lo que estuvo bien">
            {evaluation.strengths?.length
              ? <ul>{evaluation.strengths.map((strength, index) => <li key={index}>{strength}</li>)}</ul>
              : <p className="muted">Sin aspectos destacados.</p>}
          </Section>

          {evaluation.gaps?.length > 0 && (
            <Section title="Puntos para mejorar">
              <ul className="feedback__gaps">
                {evaluation.gaps.map((gap, index) => (
                  <li key={index}>
                    <span className={`sev sev--${gap.severity}`}>{SEVERITY_LABEL[gap.severity] ?? gap.severity}</span>
                    <strong>{gap.topic}:</strong> {gap.explanation}
                    {gap.revisionHint && <em className="hint">→ {gap.revisionHint}</em>}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {evaluation.misconceptions?.length > 0 && (
            <Section title="Correcciones">
              {evaluation.misconceptions.map((misconception, index) => (
                <div className="feedback__miscon" key={index}>
                  {misconception.quote && <blockquote>{misconception.quote}</blockquote>}
                  <p>{misconception.correction}</p>
                </div>
              ))}
            </Section>
          )}

          <Section title="Consigna para otro intento">
            <p className="feedback__prompt">{evaluation.nextAttemptPrompt}</p>
          </Section>
        </div>
      </details>
    </article>
  );
}

function PriorityFeedback({ gap, prompt, isMastery, coachHint }) {
  const hasCoachGuidance = Boolean(coachHint?.text?.trim());
  const label = isMastery && coachHint?.kind !== "gap" ? "PROFUNDIZACIÓN OPCIONAL" : "PRÓXIMO FOCO";
  const title = hasCoachGuidance
    ? coachHint.text
    : gap?.topic ?? (isMastery ? "La base ya está cubierta" : "Siguiente iteración");
  const body = hasCoachGuidance
    ? coachHint.detail || coachHint.text
    : gap?.explanation ?? prompt;

  return (
    <section className={`feedback__priority ${isMastery ? "is-optional" : ""} ${hasCoachGuidance ? "has-coach-guidance" : ""}`}>
      <span>{label}</span>
      <h4>{title}</h4>
      <p>{body}</p>
      {gap?.revisionHint && <strong>{gap.revisionHint}</strong>}
    </section>
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
          ? `La base ya está cubierta. Los ${score.extraPoints} puntos dorados son profundidad opcional.`
          : score.isMastery
            ? "Base suficiente alcanzada. Podés avanzar o profundizar si este concepto lo merece."
            : "El score mide cuántas piezas esenciales de la card ya cubriste."}
      </p>
    </div>
  );
}

function RubricNotes({ rubric }) {
  const notes = [
    ["Precisión", rubric?.accuracy?.note],
    ["Por qué y trade-offs", rubric?.causalityAndTradeoffs?.note],
    ["Aplicación", rubric?.application?.note],
    ["Cobertura", rubric?.completeness?.note],
  ].filter(([, note]) => note);

  if (!notes.length) return null;
  return (
    <Section title="Fundamento del score">
      <dl className="feedback__rubric-notes">
        {notes.map(([label, note]) => (
          <div key={label}><dt>{label}</dt><dd>{note}</dd></div>
        ))}
      </dl>
    </Section>
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
