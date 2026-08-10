import React from "react";
import { useState } from "react";
import { LiveRequestFeedback } from "./LiveRequestFeedback.jsx";
import { CoachCoverage } from "./CoachCoverage.jsx";
import { CoachHintTooltip } from "./CoachHintTooltip.jsx";

export function LiveReviewPanel({ status = "idle", review, error, progress, hint, footerMeta, coverageNode }) {
  const [coverageSpace, setCoverageSpace] = useState(0);
  const [hintSpace, setHintSpace] = useState(0);
  const tooltipSpace = Math.max(coverageSpace, hintSpace);
  const hasReview = Boolean(review?.scoreSummary?.rubric);
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

  return (
    <footer
      className={`live-review ${status === "running" ? "is-running" : ""} ${review?.allEssentialCovered ? "is-complete" : ""} ${tooltipSpace > 0 ? "has-coach-coverage-space" : ""}`}
      style={{ "--coach-coverage-space": `${tooltipSpace}px` }}
      aria-live="polite"
    >
      <div className="live-review__header">
        <div>
          <span className="lesson-section-label">COACHING EN VIVO</span>
          <strong>{statusText}</strong>
        </div>
        <span className={`live-review__connection live-review__connection--${status}`}>
          {status === "waiting" ? "PAUSA" : status === "running" ? "ACTUALIZANDO" : status === "error" ? "REINTENTANDO" : "AUTOMÁTICO"}
        </span>
      </div>

      <div className="live-review__footer-content">
        {hasReview ? (
          <div className={`live-review__score ${review.isExtra ? "is-extra" : ""}`}>
            <div>
              <span className="live-review__score-label">SCORE DE ENTRENAMIENTO</span>
              <strong>{displayScore}/120</strong>
            </div>
            <div className="live-review__score-track" role="progressbar" aria-label={`Score de entrenamiento ${displayScore} de 120`} aria-valuemin="0" aria-valuemax="120" aria-valuenow={displayScore}>
              <span style={{ width: `${Math.min(100, (displayScore / 120) * 100)}%` }} />
            </div>
            <span className="live-review__score-detail">
              {review.isExtra ? "Profundidad extra" : displayScore >= 100 ? "Superficie cubierta" : "Cobertura en progreso"}
            </span>
          </div>
        ) : (
          <div className={`live-review__idle-state ${status === "running" ? "is-running" : ""}`}>
            <span className="live-review__idle-dot" aria-hidden="true" />
            <span>{statusText}</span>
          </div>
        )}

        {hint && <CoachHintTooltip hint={hint} isStale={status === "waiting" || status === "running"} onTooltipSpaceChange={setHintSpace} />}

        {footerMeta && <div className="live-review__footer-meta">{footerMeta}</div>}
      </div>

      {coverageNode && <CoachCoverage node={coverageNode} coverage={review?.coverage} onTooltipSpaceChange={setCoverageSpace} />}

      {status === "running" && <LiveRequestFeedback progress={progress} compact />}
      {review?.allEssentialCovered && <span className="live-review__complete">✓ Superficie esencial cubierta</span>}
      {error && <span className="live-review__error" role="status">{error}</span>}
    </footer>
  );
}
