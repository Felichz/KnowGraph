import React from "react";

export function AttemptHistoryBar({
  attempts = [],
  currentIndex = null,
  onSelectIndex,
  onReturnCurrent,
  isStale = false,
}) {
  if (!attempts || attempts.length === 0) return null;

  const total = attempts.length;
  const isPast = Number.isInteger(currentIndex);
  const activeIdx = isPast ? Math.max(0, Math.min(currentIndex, total - 1)) : total - 1;
  const canPrev = activeIdx > 0;
  const canNext = isPast && activeIdx < total - 1;
  const currentAttempt = attempts[activeIdx];
  const attemptScore = currentAttempt?.score ?? currentAttempt?.evaluation?.score;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px", fontSize: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-surface)", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onSelectIndex?.(activeIdx - 1)}
            disabled={!canPrev}
            style={{ padding: "2px 6px", borderRadius: "4px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)", cursor: canPrev ? "pointer" : "not-allowed", opacity: canPrev ? 1 : 0.4 }}
          >
            ←
          </button>
          <strong>Intento {activeIdx + 1} de {total}</strong>
          <button
            type="button"
            onClick={() => (activeIdx >= total - 1 ? onReturnCurrent?.() : onSelectIndex?.(activeIdx + 1))}
            disabled={!isPast}
            style={{ padding: "2px 6px", borderRadius: "4px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)", cursor: isPast ? "pointer" : "not-allowed", opacity: isPast ? 1 : 0.4 }}
          >
            →
          </button>
          {attemptScore != null && (
            <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(112, 221, 212, 0.15)", color: "var(--accent-cyan)", fontWeight: 700 }}>
              {attemptScore}/120
            </span>
          )}
        </div>

        {isPast ? (
          <button
            type="button"
            onClick={onReturnCurrent}
            style={{ padding: "3px 8px", background: "var(--accent-cyan)", color: "var(--bg-workspace)", borderRadius: "4px", border: "none", fontWeight: 600, cursor: "pointer" }}
          >
            Volver a la versión actual
          </button>
        ) : (
          <span style={{ fontSize: "11px", color: "var(--accent-green)" }}>Último resultado</span>
        )}
      </div>

      {isStale && (
        <div style={{ padding: "6px 10px", background: "rgba(239, 118, 104, 0.1)", borderRadius: "4px", borderLeft: "2px solid var(--accent-red)", fontSize: "11px", color: "var(--text-secondary)" }}>
          ⚠️ Esta evaluación corresponde a una versión anterior del temario. Reevaluá para actualizar tu rúbrica.
        </div>
      )}
    </div>
  );
}
