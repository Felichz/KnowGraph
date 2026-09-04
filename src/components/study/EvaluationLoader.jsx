import React, { useEffect, useState } from "react";

export function EvaluationLoader({
  startedAt,
  expectedSeconds = 30,
  streamingChars = 0,
  onCancel,
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = startedAt || Date.now();
    setElapsed(Math.floor((Date.now() - start) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 500);
    return () => clearInterval(interval);
  }, [startedAt]);

  const pct = Math.min(100, Math.round((elapsed / expectedSeconds) * 100));
  const isSlow = elapsed > 12;

  return (
    <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }} role="status">
      <span className="pulse-dot" style={{ width: "16px", height: "16px" }} />

      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--text-primary)" }}>
          {streamingChars > 0 ? `Recibiendo rúbrica… (${streamingChars} caracteres)` : "Analizando precisión técnica y trade-offs…"}
        </h3>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", maxWidth: "440px" }}>
          {isSlow
            ? "Los modelos con pensamiento profundo (thinking models) demoran 15-30s en verificar causalidad."
            : "Calibrando rúbrica analítica en 4 dimensiones frente a estándares de entrevista."}
        </p>
      </div>

      {/* Barra de progreso de latencia */}
      <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ width: "100%", height: "6px", background: "var(--bg-canvas)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: isSlow ? "var(--accent-gold)" : "var(--accent-cyan)", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
          <span>{elapsed}s transcurridos</span>
          <span>~{expectedSeconds}s esperado</span>
        </div>
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginTop: "8px",
            padding: "6px 14px",
            background: "rgba(239, 118, 104, 0.12)",
            border: "1px solid var(--accent-red)",
            borderRadius: "var(--radius-control)",
            color: "var(--accent-red)",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Cancelar evaluación ✕
        </button>
      )}
    </div>
  );
}
