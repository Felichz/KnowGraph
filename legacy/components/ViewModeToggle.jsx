import React from "react";

const MODES = [
  { id: "graph", label: "Grafo" },
  { id: "flashcards", label: "Flashcards" },
];

export function ViewModeToggle({ mode, onChange }) {
  return (
    <div className="view-mode-toggle" role="tablist" aria-label="Modo de vista">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          className={`view-mode-toggle__btn ${mode === m.id ? "is-active" : ""}`}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
