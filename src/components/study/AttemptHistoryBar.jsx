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
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px", fontSize: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(18, 22, 31, 0.75)", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line-strong)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => onSelectIndex?.(activeIdx - 1)}
            disabled={!canPrev}
            style={{ width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)", cursor: canPrev ? "pointer" : "not-allowed", opacity: canPrev ? 1 : 0.35, color: "var(--text-primary)" }}
          >
            ←
          </button>
          <strong style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>Intento {activeIdx + 1} de {total}</strong>
          <button
            type="button"
            onClick={() => (activeIdx >= total - 1 ? onReturnCurrent?.() : onSelectIndex?.(activeIdx + 1))}
            disabled={!isPast}
            style={{ width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)", cursor: isPast ? "pointer" : "not-allowed", opacity: isPast ? 1 : 0.35, color: "var(--text-primary)" }}
          >
            →
          </button>
          {attemptScore != null && (
            <span style={{ padding: "3px 8px", borderRadius: "6px", background: "rgba(94, 234, 212, 0.14)", border: "1px solid var(--border-accent)", color: "var(--accent-cyan)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {attemptScore}/120
            </span>
          )}
        </div>

        {isPast ? (
          <button
            type="button"
            onClick={onReturnCurrent}
            style={{ padding: "4px 12px", background: "linear-gradient(135deg, var(--accent-cyan), #38bdf8)", color: "#08090d", borderRadius: "6px", border: "none", fontWeight: 700, fontSize: "11.5px", cursor: "pointer", boxShadow: "0 0 10px rgba(94, 234, 212, 0.25)" }}
          >
            Volver a la versión actual
          </button>
        ) : (
          <span style={{ fontSize: "11px", color: "var(--accent-green)", display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: 600 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-green)" }} />
            Último resultado
          </span>
        )}
      </div>

      {isStale && (
        <div style={{ padding: "8px 12px", background: "rgba(248, 113, 113, 0.08)", borderRadius: "6px", border: "1px solid rgba(248, 113, 113, 0.25)", borderLeft: "3px solid var(--accent-red)", fontSize: "11.5px", color: "var(--text-secondary)" }}>
          ⚠️ Esta evaluación corresponde a una versión anterior del temario. Reevaluá para actualizar tu rúbrica.
        </div>
      )}
    </div>
  );
}
