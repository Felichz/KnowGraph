import React, { useEffect, useState } from "react";

export function StudyEvaluationLoader({ chars = 0, onCancel }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const phase = seconds < 15 ? "Normal" : seconds < 30 ? "Slow" : "Critical";

  return (
    <div
      style={{
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "rgba(13, 17, 24, 0.8)",
        borderRadius: "10px",
        border: "1px solid var(--border-line)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span className="pulse-dot" />
        <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
          Evaluando respuesta con IA...
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>Tiempo: <strong>{seconds}s</strong></span>
        <span>Recibido: <strong>{chars} chars</strong></span>
        <span>
          Fase:{" "}
          <strong style={{ color: phase === "Critical" ? "#F87171" : phase === "Slow" ? "#FBBF24" : "#4ADE80" }}>
            {phase}
          </strong>
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", textAlign: "center", maxWidth: "420px" }}>
        Los modelos de razonamiento profundo calibran la respuesta contra la rúbrica senior de 4 dimensiones. Podés cerrar este modal y seguir estudiando; la evaluación continúa en segundo plano.
      </p>

      <button
        onClick={onCancel}
        style={{
          marginTop: "8px",
          padding: "6px 14px",
          borderRadius: "6px",
          background: "rgba(239, 68, 68, 0.12)",
          color: "#F87171",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Cancelar Evaluación ✕
      </button>
    </div>
  );
}
