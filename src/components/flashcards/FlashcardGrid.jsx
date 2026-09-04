import React, { useState } from "react";
import { FlashcardCard } from "./FlashcardCard.jsx";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "unattempted", label: "Sin intento" },
  { id: "below-mastery", label: "Base < 100" },
  { id: "mastery", label: "Base dominada (100+)" },
];

export function FlashcardGrid({
  nodes = [],
  categories = {},
  progressMap = {},
  onOpenStudy = null,
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNodes = nodes.filter((n) => {
    const p = progressMap[n.id];
    const score = p?.score ?? 0;
    if (activeFilter === "unattempted") return !p || p.status === "unseen";
    if (activeFilter === "below-mastery") return p && p.status !== "unseen" && score < 100;
    if (activeFilter === "mastery") return score >= 100;
    return true;
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "var(--bg-canvas)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Barra de filtros de flashcards */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {FILTERS.map((f) => {
              const isSel = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "var(--radius-control)",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: isSel ? "var(--bg-surface-emphasis)" : "var(--bg-surface)",
                    color: isSel ? "var(--accent-cyan)" : "var(--text-secondary)",
                    border: `1px solid ${isSel ? "var(--accent-cyan)" : "var(--border-line)"}`,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Mostrando {filteredNodes.length} de {nodes.length} flashcards
          </span>
        </div>

        {/* Cuadrícula de tarjetas */}
        {filteredNodes.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            No hay flashcards que coincidan con este filtro.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredNodes.map((node) => (
              <FlashcardCard
                key={node.id}
                node={node}
                category={categories[node.cat]}
                progress={progressMap[node.id]}
                onOpenStudy={onOpenStudy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
