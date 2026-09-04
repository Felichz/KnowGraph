import React from "react";
import { AttemptProgressChart } from "./AttemptProgressChart.jsx";

export function CoachIterationHistory({
  iterations = [],
  attempts = [],
  viewIndex,
  onSelect,
  onSelectAttempt,
  onReturnCurrent,
}) {
  if (!iterations?.length && !attempts?.length) return null;
  const total = iterations.length;
  const isPast = Number.isInteger(viewIndex);
  const activeIndex = isPast ? Math.max(0, Math.min(viewIndex, total - 1)) : total - 1;
  const current = iterations[activeIndex] ?? null;

  return (
    <section className={`coach-iterations ${isPast ? "is-history" : "is-current"}`} aria-label="Historial del coaching">
      <div className="coach-iterations__toolbar">
        {total > 0 && (
          <div className="coach-iterations__nav" role="group" aria-label="Navegar iteraciones del coaching">
            <button
              type="button"
              onClick={() => onSelect(isPast ? activeIndex - 1 : total - 1)}
              disabled={isPast && activeIndex <= 0}
              aria-label="Iteración anterior"
            >←</button>
            <strong>{isPast ? `Iteración ${activeIndex + 1} de ${total}` : "Borrador actual"}</strong>
            <button
              type="button"
              onClick={() => (activeIndex >= total - 1 ? onReturnCurrent() : onSelect(activeIndex + 1))}
              disabled={!isPast}
              aria-label="Siguiente iteración"
            >→</button>
          </div>
        )}
        {isPast ? (
          <button type="button" className="coach-iterations__current-button" onClick={onReturnCurrent}>Volver a la versión actual</button>
        ) : (
          <span className="coach-iterations__current-label">VERSIÓN EDITABLE</span>
        )}
      </div>

      <AttemptProgressChart
        coachIterations={iterations}
        attempts={attempts}
        viewIndex={isPast ? activeIndex : undefined}
        onSelectCoach={onSelect}
        onSelectEvaluation={onSelectAttempt}
        eyebrow="ITERACIONES"
        title="Evolución del coaching y evaluaciones"
        hint="Hacé click en los checkpoints (violeta) para ver ese borrador o en las evaluaciones (cian) para ver el feedback canónico."
        className="attempt-progress--coach"
      />

      {current && (
        <div className="coach-iterations__meta">
          <time dateTime={current.createdAt}>{new Date(current.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}</time>
          {isPast ? <span>Texto en solo lectura · el chat sigue disponible</span> : <span>El gráfico representa checkpoints ya procesados</span>}
        </div>
      )}
    </section>
  );
}
