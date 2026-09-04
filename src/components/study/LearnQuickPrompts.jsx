import React from "react";

export const QUICK_PROMPTS = [
  "¿Por qué falla el enfoque ingenuo?",
  "¿Podrías explicarlo con una analogía?",
  "¿Cómo diagnostico este error en producción?",
  "Tengo una duda con el código...",
];

export function LearnQuickPrompts({ onSelectPrompt }) {
  return (
    <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 10px" }}>
      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>
        Espacio Socrático con el Tutor
      </p>
      <p style={{ fontSize: "12px", maxWidth: "420px", margin: "0 auto 16px" }}>
        Preguntale sobre trade-offs en producción o elegí una consulta rápida:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            style={{
              padding: "6px 12px",
              borderRadius: "16px",
              background: "var(--bg-surface-raised)",
              border: "1px solid var(--border-line)",
              fontSize: "12px",
              color: "var(--accent-cyan)",
              cursor: "pointer",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
