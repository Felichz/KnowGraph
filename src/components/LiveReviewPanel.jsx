import React from "react";

export function LiveReviewPanel({ status = "idle", review, error, isFinalizing, lastCheckpoint }) {
  const hasReview = Boolean(review?.points?.length);
  const statusText = status === "waiting"
    ? "Esperando una pausa para revisar..."
    : status === "running"
      ? "Revisando tu explicación..."
      : status === "error"
        ? "Se reintentará al seguir escribiendo."
        : hasReview
          ? "El hint aparece dentro del editor y se actualiza solo."
          : "Escribí para activar el coaching automático.";

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
        <div className="live-review__score">
          <div>
            <span className="live-review__score-label">COBERTURA ESENCIAL</span>
            <strong>{review.coveragePercent}%</strong>
            <span className="live-review__score-max">{review.coveredCount}/{review.totalEssential} ideas</span>
          </div>
          <div className="live-review__score-track" role="progressbar" aria-label={`Cobertura esencial ${review.coveragePercent}%`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={review.coveragePercent}>
            <span style={{ width: `${review.coveragePercent}%` }} />
          </div>
        </div>
      ) : (
        <div className="live-review__skeleton" aria-label="Preparando revisión en vivo">
          <span /><span />
        </div>
      )}

      {review?.allEssentialCovered && <span className="live-review__complete">✓ Superficie esencial cubierta</span>}
      {isFinalizing && <span className="live-review__finalizing">Confirmando checkpoint...</span>}
      {lastCheckpoint && <span className="live-review__checkpoint">Último checkpoint: {lastCheckpoint}/120</span>}
      {error && <span className="live-review__error" role="status">{error}</span>}
    </div>
  );
}
