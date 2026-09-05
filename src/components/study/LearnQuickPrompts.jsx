import React from "react";

export const QUICK_PROMPTS = [
  "¿Por qué falla el enfoque ingenuo?",
  "¿Podrías explicarlo con una analogía?",
  "¿Cómo diagnostico este error en producción?",
  "Tengo una duda con el código...",
];

const PROMPT_ICONS = ["⚡", "💡", "🛠️", "💻"];

export function LearnQuickPrompts({ onSelectPrompt }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 12px 20px", color: "var(--text-muted)", maxWidth: "580px", margin: "0 auto" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(94, 234, 212, 0.08)", border: "1px solid rgba(94, 234, 212, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px", boxShadow: "0 0 16px rgba(94, 234, 212, 0.15)" }}>
        🤖
      </div>
      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
        Espacio Socrático con el Tutor
      </h3>
      <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "0 0 20px", textAlign: "center", lineHeight: 1.5 }}>
        Preguntale sobre trade-offs en producción o elegí una consulta rápida:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", width: "100%" }}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "var(--radius-control)",
              background: "rgba(18, 24, 38, 0.75)",
              border: "1px solid var(--border-line)",
              fontSize: "12px",
              color: "var(--accent-cyan)",
              textAlign: "left",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            <span style={{ fontSize: "15px", flexShrink: 0 }}>{PROMPT_ICONS[idx]}</span>
            <span style={{ fontWeight: 500 }}>{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

