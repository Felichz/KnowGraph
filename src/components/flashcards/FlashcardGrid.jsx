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
    const isAttempted = p && (p.attemptCount > 0 || Boolean(p.latestAttempt));
    if (activeFilter === "unattempted") return !isAttempted;
    if (activeFilter === "below-mastery") return isAttempted && score < 100;
    if (activeFilter === "mastery") return isAttempted && score >= 100;
    return true;
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 60px", background: "var(--bg-canvas)" }}>
      <div style={{ maxWidth: "1340px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Barra de filtros de flashcards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            background: "rgba(13, 18, 30, 0.72)",
            border: "1px solid var(--border-line)",
            borderRadius: "var(--radius-panel)",
            padding: "8px 14px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 18px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
          }}
        >
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
                    borderRadius: "var(--radius-pill)",
                    fontSize: "11.5px",
                    fontWeight: isSel ? 600 : 500,
                    background: isSel ? "rgba(56, 189, 248, 0.14)" : "rgba(255, 255, 255, 0.03)",
                    color: isSel ? "var(--accent-cyan)" : "var(--text-secondary)",
                    border: `1px solid ${isSel ? "rgba(56, 189, 248, 0.35)" : "var(--border-line)"}`,
                    boxShadow: isSel ? "0 0 12px rgba(56, 189, 248, 0.15)" : "none",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "3px 9px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border-line)",
            }}
          >
            Mostrando {filteredNodes.length} de {nodes.length} flashcards
          </span>
        </div>

        {/* Cuadrícula de tarjetas */}
        {filteredNodes.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", background: "rgba(13, 18, 30, 0.4)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
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
