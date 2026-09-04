import React from "react";

const PHASE_COPY = {
  connecting: ["Conectando con el gateway", "Abriendo la request"],
  processing: ["Esperando la primera salida", "Conexion activa; puede haber procesamiento o buffering"],
  fallback: ["Cambiando de proveedor", "MiniMax no completo la respuesta; usando FreeLLMAPI como respaldo"],
  receiving: ["Recibiendo respuesta", "El modelo ya esta enviando texto"],
  scoring: ["Scores recibidos", "Generando el foco principal"],
  hint: ["Generando el foco", "El score ya esta disponible"],
};

export function LiveRequestFeedback({ progress = {}, compact = false }) {
  const phase = progress.phase ?? "connecting";
  const [label, detail] = PHASE_COPY[phase] ?? PHASE_COPY.processing;
  const chars = Number(progress.chars) || 0;
  const now = Number(progress.now) || Date.now();
  const startedAt = Number(progress.startedAt) || now;
  const elapsed = `${(Math.max(0, now - startedAt) / 1000).toFixed(1)} s`;
  const received = chars > 0 ? `${chars.toLocaleString("es-AR")} caracteres` : "sin texto recibido aun";
  const accessibleLabel = `${label}. ${detail}. ${received}. Tiempo transcurrido ${elapsed}.`;

  return (
    <div className={`live-request-feedback ${compact ? "is-compact" : ""}`} role="status" aria-live="polite" aria-label={accessibleLabel}>
      <span className="live-request-feedback__spinner" aria-hidden="true" />
      <span className="live-request-feedback__copy">
        <span className="live-request-feedback__label">{label}</span>
        <span className="live-request-feedback__detail">{detail} · {received}</span>
      </span>
      <time className="live-request-feedback__elapsed">{elapsed}</time>
    </div>
  );
}
