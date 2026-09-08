import React, { useMemo, useState } from "react";
import { FlashcardCard } from "./FlashcardCard.jsx";

export function FlashcardGrid({
  nodes = [],
  progressMap = {},
  categories = {},
  onOpenNode,
}) {
  const [filter, setFilter] = useState("all"); // "all" | "unattempted" | "under100" | "mastered"

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const score = progressMap[node.id]?.score ?? progressMap[node.id]?.latestAttempt?.score ?? null;
      if (filter === "unattempted") return score === null;
      if (filter === "under100") return score !== null && score < 100;
      if (filter === "mastered") return score !== null && score >= 100;
      return true;
    });
  }, [nodes, progressMap, filter]);

  const filterButtons = [
    { id: "all", label: "Todas" },
    { id: "unattempted", label: "Sin intento" },
    { id: "under100", label: "Base < 100" },
    { id: "mastered", label: "Base dominada (100+)" },
  ];

  return (
    <div
      style={{
        padding: "20px 24px 80px 24px",
        maxWidth: "1440px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Controls Bar: Filter Pills + Counter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {filterButtons.map((btn) => {
            const isActive = filter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: isActive ? "rgba(94, 234, 212, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "var(--color-brand-primary, #5EEAD4)" : "var(--text-secondary)",
                  border: isActive
                    ? "1px solid rgba(94, 234, 212, 0.4)"
                    : "1px solid var(--border-line-subtle)",
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <span
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Mostrando {filteredNodes.length} de {nodes.length} flashcards
        </span>
      </div>

      {/* Cards Grid or Empty State */}
      {filteredNodes.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "14px",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "12px",
            border: "1px dashed var(--border-line)",
          }}
        >
          No hay flashcards que coincidan con este filtro
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
              progress={progressMap[node.id]}
              category={categories[node.cat]}
              onOpenNode={onOpenNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
