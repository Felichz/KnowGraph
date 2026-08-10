import React from "react";
import { ModelMeta } from "./ModelMeta.jsx";
import { AttemptProgressChart } from "./AttemptProgressChart.jsx";
import { formatEvaluationDuration } from "../ai/types.js";

export function AttemptHistory({ attempts, viewIndex, onSelect, onBackToDraft }) {
  if (!attempts?.length) return null;
  const total = attempts.length;
  const current = attempts[viewIndex] ?? attempts[total - 1];
  const currentNumber = viewIndex + 1;
  const canPrev = viewIndex > 0;
  const canNext = viewIndex < total - 1;
  const duration = formatEvaluationDuration(current.durationMs);

  return (
    <section className="attempt-history" aria-label="Historial de intentos">
      <div className="attempt-history__primary-row">
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
          <strong aria-live="polite">Intento {currentNumber} de {total}</strong>
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

        <button type="button" className="attempt-history__back" onClick={onBackToDraft}>
          Volver al borrador
        </button>
      </div>

      <AttemptProgressChart attempts={attempts} viewIndex={viewIndex} onSelect={onSelect} />

      <div className="attempt-history__meta">
        <time dateTime={current.createdAt}>
          {new Date(current.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
        </time>
        {duration && <span>{duration}</span>}
        <ModelMeta model={current.model} routedVia={current.routedVia} />
      </div>
    </section>
  );
}
