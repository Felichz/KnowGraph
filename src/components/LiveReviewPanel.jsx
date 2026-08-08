import React, { useState } from "react";

export function LiveReviewPanel({ status = "idle", review, error, isFinalizing, lastCheckpoint }) {
  const [showMore, setShowMore] = useState(false);
  const hasReview = Boolean(review?.scoreSummary?.rubric);
  const showSkeleton = status === "running" && !hasReview;
  const statusText = status === "waiting"
    ? "Esperando una pausa para revisar..."
    : status === "running"
      ? "Revisando tu explicación..."
      : status === "error"
        ? "Se reintentará al seguir escribiendo."
        : hasReview
          ? "El score y el hint se actualizan mientras practicás."
          : "Escribí para activar el coaching automático.";
  const displayScore = review?.displayScore;
  const extraGaps = review?.additionalGaps ?? [];

  return (
    <div className={`live-review ${status === "running" ? "is-running" : ""} ${review?.allEssentialCovered ? "is-complete" : ""}`} aria-live="polite">
      <div className="live-review__header">
        <div>
          <span className="lesson-section-label">COACHING EN VIVO</span>
          <strong>{statusText}</strong>
        </div>
        <span className={`live-review__connection live-review__connection--${status}`}>
          {status === "waiting" ? "PAUSA" : status === "running" ? "ACTUALIZANDO" : status === "error" ? "REINTENTANDO" : "AUTOMÁTICO"}
        </span>
      </div>

      {hasReview ? (
        <div className={`live-review__score ${review.isExtra ? "is-extra" : ""}`}>
          <div>
            <span className="live-review__score-label">SCORE DE ENTRENAMIENTO</span>
            <strong>{displayScore}/120</strong>
            <span className="live-review__score-max">mismo criterio que la evaluación completa</span>
          </div>
          <div className="live-review__score-track" role="progressbar" aria-label={`Score de entrenamiento ${displayScore} de 120`} aria-valuemin="0" aria-valuemax="120" aria-valuenow={displayScore}>
            <span style={{ width: `${Math.min(100, (displayScore / 120) * 100)}%` }} />
          </div>
          <span className="live-review__score-detail">
            {review.isExtra ? "Profundidad extra" : displayScore >= 100 ? "Superficie conceptual cubierta" : "Todavía hay cobertura por completar"}
          </span>
        </div>
      ) : showSkeleton ? (
        <div className="live-review__skeleton" aria-label="Preparando revisión en vivo">
          <span /><span />
        </div>
      ) : (
        <div className="live-review__idle-state">
          <span className="live-review__idle-dot" aria-hidden="true" />
          <span>La revisión aparece después de que escribas y hagas una pausa.</span>
        </div>
      )}

      {review?.allEssentialCovered && <span className="live-review__complete">✓ Superficie esencial cubierta</span>}
      {extraGaps.length > 0 && (
        <div className="live-review__more">
          <button type="button" className="live-review__more-toggle" onClick={() => setShowMore((value) => !value)} aria-expanded={showMore}>
            {showMore ? "Ocultar gaps secundarios" : `Ver más · ${extraGaps.length} gap${extraGaps.length === 1 ? "" : "s"}`}
          </button>
          {showMore && (
            <div className="live-review__extra-gaps">
              {extraGaps.map((gap, index) => (
                <article className="live-review__extra-gap" key={`${gap.topic}-${index}`}>
                  <strong>{gap.topic}</strong>
                  <span>{gap.explanation}</span>
                  <em>{gap.revisionHint}</em>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      {isFinalizing && <span className="live-review__finalizing">Confirmando checkpoint...</span>}
      {lastCheckpoint && <span className="live-review__checkpoint">Último checkpoint: {lastCheckpoint}/120</span>}
      {error && <span className="live-review__error" role="status">{error}</span>}
    </div>
  );
}
