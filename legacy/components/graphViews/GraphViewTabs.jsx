import React from "react";

const GRAPH_VIEWS = [
  { id: "classic", label: "Clásico" },
  { id: "lanes", label: "Carriles" },
  { id: "radial", label: "Radial" },
  { id: "path", label: "Ruta" },
];

export function GraphViewTabs({ mode, onChange }) {
  return (
    <div className="graph-view-tabs" role="tablist" aria-label="Variantes de visualización del grafo">
      {GRAPH_VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={mode === view.id}
          className={`graph-view-tabs__btn ${mode === view.id ? "is-active" : ""}`}
          onClick={() => onChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
