import React from "react";

export function AttemptHistory({ attempts, viewIndex, onSelect, onBackToDraft }) {
  if (!attempts?.length) return null;
  const total = attempts.length;
  const current = attempts[viewIndex] ?? attempts[total - 1];
  const currentNumber = viewIndex + 1;
  const canPrev = viewIndex > 0;
  const canNext = viewIndex < total - 1;

  return (
    <div className="attempt-history" role="group" aria-label="Historial de intentos">
      <button
        type="button"
        className="attempt-history__nav"
        onClick={() => canPrev && onSelect(viewIndex - 1)}
        disabled={!canPrev}
        aria-label="Intento anterior"
      >
        ← Anterior
      </button>
      <span className="attempt-history__counter" aria-live="polite">
        Intento {currentNumber} de {total}
        <span className="attempt-history__date">
          {new Date(current.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
        </span>
      </span>
      <button
        type="button"
        className="attempt-history__nav"
        onClick={() => canNext && onSelect(viewIndex + 1)}
        disabled={!canNext}
        aria-label="Siguiente intento"
      >
        Siguiente →
      </button>
      <button
        type="button"
        className="attempt-history__back"
        onClick={onBackToDraft}
        aria-label="Volver al borrador actual"
      >
        Volver al borrador
      </button>
    </div>
  );
}
