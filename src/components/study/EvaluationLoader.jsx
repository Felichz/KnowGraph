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
    <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", background: "rgba(18, 22, 31, 0.4)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }} role="status">
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: "36px", height: "36px", borderRadius: "50%", background: isSlow ? "rgba(245, 158, 11, 0.2)" : "rgba(94, 234, 212, 0.2)", filter: "blur(8px)" }} />
        <span className="pulse-dot" style={{ width: "16px", height: "16px", background: isSlow ? "var(--accent-gold)" : "var(--accent-cyan)", boxShadow: isSlow ? "0 0 16px var(--accent-gold)" : "0 0 16px var(--accent-cyan)" }} />
      </div>

      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
          {streamingChars > 0 ? `Recibiendo rúbrica… (${streamingChars} caracteres)` : "Analizando precisión técnica y trade-offs…"}
        </h3>
        <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-secondary)", maxWidth: "460px", lineHeight: 1.5 }}>
          {isSlow
            ? "Los modelos con pensamiento profundo (thinking models) demoran 15-30s en verificar causalidad."
            : "Calibrando rúbrica analítica en 4 dimensiones frente a estándares de entrevista."}
        </p>
      </div>

      {/* Barra de progreso de latencia */}
      <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ width: "100%", height: "6px", background: "rgba(10, 13, 18, 0.8)", borderRadius: "9999px", overflow: "hidden", border: "1px solid var(--border-line)" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: isSlow ? "linear-gradient(90deg, #d97706, var(--accent-gold))" : "linear-gradient(90deg, #0284c7, var(--accent-cyan))", borderRadius: "9999px", transition: "width 0.5s ease", boxShadow: isSlow ? "0 0 10px rgba(245, 158, 11, 0.5)" : "0 0 10px rgba(94, 234, 212, 0.5)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          <span>{elapsed}s transcurridos</span>
          <span>~{expectedSeconds}s esperado</span>
        </div>
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginTop: "6px",
            padding: "7px 16px",
            background: "rgba(248, 113, 113, 0.1)",
            border: "1px solid rgba(248, 113, 113, 0.35)",
            borderRadius: "var(--radius-control)",
            color: "var(--accent-red)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancelar evaluación ✕
        </button>
      )}
    </div>
  );
}
