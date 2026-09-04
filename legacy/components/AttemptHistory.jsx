import React from "react";
import { ModelMeta } from "./ModelMeta.jsx";
import { AttemptProgressChart } from "./AttemptProgressChart.jsx";
import { formatEvaluationDuration } from "../ai/types.js";

export function AttemptHistory({
  attempts = [],
  coachIterations = [],
  viewIndex,
  onSelect,
  onSelectCoachIteration,
  onBackToDraft,
}) {
  if (!attempts?.length && !coachIterations?.length) return null;
  const total = attempts?.length || 0;
  const current = attempts?.[viewIndex] ?? attempts?.[total - 1] ?? null;
  const currentNumber = (viewIndex ?? total - 1) + 1;
  const canPrev = viewIndex > 0;
  const canNext = viewIndex < total - 1;
  const duration = current ? formatEvaluationDuration(current.durationMs) : null;

  return (
    <section className="attempt-history" aria-label="Historial de intentos">
      <div className="attempt-history__primary-row">
        {total > 0 ? (
          <div className="attempt-history__navigation" role="group" aria-label="Navegar intentos">
            <button
              type="button"
              className="attempt-history__nav"
              onClick={() => canPrev && onSelect(viewIndex - 1)}
              disabled={!canPrev}
              aria-label="Intento anterior"
            >
              ←
            </button>
            <strong aria-live="polite">Evaluación {currentNumber} de {total}</strong>
            <button
              type="button"
              className="attempt-history__nav"
              onClick={() => canNext && onSelect(viewIndex + 1)}
              disabled={!canNext}
              aria-label="Siguiente intento"
            >
              →
            </button>
          </div>
        ) : (
          <div className="attempt-history__navigation">
            <strong>Checkpoints de coaching</strong>
          </div>
        )}

        <button type="button" className="attempt-history__back" onClick={onBackToDraft}>
          Volver al coaching
        </button>
      </div>

      <AttemptProgressChart
        attempts={attempts}
        coachIterations={coachIterations}
        viewIndex={viewIndex}
        onSelectEvaluation={onSelect}
        onSelectCoach={onSelectCoachIteration}
        eyebrow="RECORRIDO"
        title="Progreso y checkpoints"
        hint="Hacé click en cualquier punto: los cianes son evaluaciones completas y los violetas son checkpoints del coaching."
      />

      {current && (
        <div className="attempt-history__meta">
          <time dateTime={current.createdAt}>
            {new Date(current.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
          </time>
          {duration && <span>{duration}</span>}
          <ModelMeta model={current.model} routedVia={current.routedVia} />
        </div>
      )}
    </section>
  );
}
