import { useEffect, useState } from "react";
import { StreamingEvaluationPreview } from "./StreamingEvaluationPreview.jsx";

export function ProgressLoader({
  startedAt,
  expectedMs = 60_000,
  maxMs = 110_000,
  streamingChars = 0,
  streamingSections = {},
  streamingBlocks = {},
  onCancel,
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(Date.now() - startedAt);
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => clearInterval(id);
  }, [startedAt]);

  const pct = Math.min(100, (elapsed / maxMs) * 100);
  const phase = elapsed >= expectedMs * 1.5 ? "critical" : elapsed >= expectedMs ? "slow" : "normal";
  const phaseLabel = {
    normal: "Esperando respuesta del modelo…",
    slow: "Tardando más de lo esperado…",
    critical: "Casi en el límite, esperando la respuesta…",
  }[phase];
  const seconds = Math.floor(elapsed / 1000);
  const maxSeconds = Math.round(maxMs / 1000);
  const expectedSeconds = Math.round(expectedMs / 1000);

  return (
    <div className={`progress-loader progress-loader--${phase}`} role="status" aria-live="polite">
      <div className="progress-loader__bar" aria-label={`${seconds} de ${maxSeconds} segundos`}>
        <div className="progress-loader__fill" style={{ width: `${pct}%` }} />
        <div className="progress-loader__marker" style={{ left: `${(expectedMs / maxMs) * 100}%` }} title={`Esperado: ${expectedSeconds}s`} />
      </div>
      <div className="progress-loader__info">
        <span className="progress-loader__label">
          {streamingChars > 0 ? `Generando feedback… (${streamingChars} chars)` : phaseLabel}
        </span>
        <span className="progress-loader__time">
          <strong>{seconds}s</strong>
          <span className="muted"> / {maxSeconds}s máx · esperado {expectedSeconds}s</span>
        </span>
      </div>
      <div className="progress-loader__live" aria-live="polite">
        <span className="progress-loader__pulse" aria-hidden="true" />
        <span>{streamingChars > 0 ? "El feedback se está completando por secciones" : "Preparando el feedback"}</span>
      </div>
      <StreamingEvaluationPreview sections={streamingSections} blocks={streamingBlocks} />
      {onCancel && (
        <button type="button" className="quiz-secondary-button" onClick={onCancel}>
          Cancelar
        </button>
      )}
    </div>
  );
}
