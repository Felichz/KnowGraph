import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listAllAttempts } from "../ai/learningStore.js";
import { getScoreView, STATUS_LABEL } from "../ai/types.js";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "no-attempt", label: "Sin intento" },
  { id: "below-mastery", label: "Base < 100" },
  { id: "mastery", label: "Base alcanzada" },
  { id: "extra", label: "Con extra dorado" },
];

export function FlashcardView({ graph, onOpenNode }) {
  const [attempts, setAttempts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [flippedIds, setFlippedIds] = useState(() => new Set());
  const [spotlightId, setSpotlightId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listAllAttempts().then((all) => {
      if (!cancelled) setAttempts(all.filter((attempt) => attempt.graphId === graph.id));
    });
    return () => { cancelled = true; };
  }, [graph.id]);

  const bestByNode = useMemo(() => {
    const map = new Map();
    for (const attempt of attempts) {
      const current = map.get(attempt.nodeId);
      const score = getScoreView(attempt.evaluation);
      const currentScore = current ? getScoreView(current.evaluation) : null;
      if (!current || score.displayScore > currentScore.displayScore ||
          (score.displayScore === currentScore.displayScore && attempt.createdAt > current.createdAt)) {
        map.set(attempt.nodeId, attempt);
      }
    }
    return map;
  }, [attempts]);

  const cards = useMemo(() => {
    const list = (graph.nodes ?? []).map((node) => ({ node, attempt: bestByNode.get(node.id) ?? null }));
    if (filter === "no-attempt") return list.filter((card) => !card.attempt);
    if (filter === "below-mastery") return list.filter((card) => card.attempt && !getScoreView(card.attempt.evaluation).isMastery);
    if (filter === "mastery") return list.filter((card) => card.attempt && getScoreView(card.attempt.evaluation).isMastery);
    if (filter === "extra") return list.filter((card) => card.attempt && getScoreView(card.attempt.evaluation).isExtra);
    return list;
  }, [bestByNode, filter, graph.nodes]);

  useEffect(() => {
    setFlippedIds(new Set());
    setSpotlightId(null);
  }, [filter, graph.id]);

  const toggleCard = useCallback((nodeId) => {
    setFlippedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const pickRandom = useCallback(() => {
    if (!cards.length) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    setSpotlightId(card.node.id);
    document.getElementById(`flashcard-${card.node.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [cards]);

  if (!cards.length) {
    return (
      <div className="flashcards flashcards--empty">
        <p>No hay cards que coincidan con este filtro.</p>
        <button type="button" className="quiz-secondary-button" onClick={() => setFilter("all")}>Ver todas</button>
      </div>
    );
  }

  return (
    <div className="flashcards">
      <div className="flashcards__toolbar">
        <div className="flashcards__filters" role="group" aria-label="Filtros de flashcards">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flashcards__filter ${filter === item.id ? "is-active" : ""}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="button" className="flashcards__random" onClick={pickRandom}>
          <span aria-hidden="true">✦</span> Elegir una al azar
        </button>
        <span className="flashcards__count">{cards.length} cards visibles</span>
      </div>

      <div className="flashcards__grid">
        {cards.map(({ node, attempt }) => {
          const isFlipped = flippedIds.has(node.id);
          const score = attempt ? getScoreView(attempt.evaluation) : null;
          const status = score?.status;
          return (
            <article
              id={`flashcard-${node.id}`}
              className={`flashcard-shell ${spotlightId === node.id ? "is-spotlight" : ""}`}
              key={node.id}
            >
              <button
                type="button"
                className={`flashcard ${isFlipped ? "is-flipped" : ""}`}
                onClick={() => toggleCard(node.id)}
                aria-pressed={isFlipped}
                aria-label={isFlipped ? "Voltear para ver el frente" : "Voltear para ver tu explicación"}
              >
                <div className="flashcard__face flashcard__face--front">
                  <span className="flashcard__cat">{node.cat ?? ""}</span>
                  <h3 className="flashcard__title">{node.label ?? node.title}</h3>
                  <div className="flashcard__status-row">
                    {attempt
                      ? <span className={`flashcard__badge flashcard__badge--${status}`}>{score.displayScore}/120 · {STATUS_LABEL[status]}</span>
                      : <span className="flashcard__badge flashcard__badge--none">Sin intento</span>}
                  </div>
                  <p className="flashcard__hint">Tocá para ver tu explicación</p>
                </div>

                <div className="flashcard__face flashcard__face--back">
                  <span className="flashcard__cat">{node.cat ?? ""}</span>
                  <h3 className="flashcard__title">{node.label ?? node.title}</h3>
                  {attempt ? (
                    <>
                      <p className="flashcard__answer-label">Tu explicación evaluada:</p>
                      <p className="flashcard__answer">{attempt.answer}</p>
                      <p className={`flashcard__verdict flashcard__verdict--${status}`}>
                        {score.displayScore}/120 · {STATUS_LABEL[status]} · {new Date(attempt.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </>
                  ) : (
                    <p className="flashcard__empty">Todavía no escribiste una explicación para esta card. Abrila desde el grafo para completar la autoevaluación.</p>
                  )}
                </div>
              </button>
              <button type="button" className="flashcard__open" onClick={() => onOpenNode?.(node)}>
                Abrir card completa <span aria-hidden="true">↗</span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
