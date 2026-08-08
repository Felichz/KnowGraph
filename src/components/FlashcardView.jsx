import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listAllAttempts } from "../ai/learningStore.js";
import { getScoreView, STATUS_LABEL } from "../ai/types.js";
import { ModelMeta } from "./ModelMeta.jsx";

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
  const [spotlightId, setSpotlightId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);

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
    setSpotlightId(null);
    setActiveCardId(null);
    setModalFlipped(false);
  }, [filter, graph.id]);

  const openCard = useCallback((nodeId) => {
    setActiveCardId(nodeId);
    setModalFlipped(false);
  }, []);

  const closeCard = useCallback(() => {
    setActiveCardId(null);
    setModalFlipped(false);
  }, []);

  const pickRandom = useCallback(() => {
    if (!cards.length) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    setSpotlightId(card.node.id);
    document.getElementById(`flashcard-${card.node.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [cards]);

  useEffect(() => {
    if (!activeCardId) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCardId, closeCard]);

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
                className="flashcard"
                onClick={() => openCard(node.id)}
                aria-label={`Abrir flashcard ampliada: ${node.label ?? node.title}`}
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

                <div className="flashcard__peek">Click para ampliar</div>
              </button>
              <button type="button" className="flashcard__open" onClick={() => onOpenNode?.(node)}>
                Abrir card completa <span aria-hidden="true">↗</span>
              </button>
            </article>
          );
        })}
      </div>

      {activeCardId && (() => {
        const active = cards.find(({ node }) => node.id === activeCardId);
        if (!active) return null;
        const { node, attempt } = active;
        const score = attempt ? getScoreView(attempt.evaluation) : null;
        const status = score?.status;
        return (
          <div className="flashcard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCard(); }}>
            <section className="flashcard-modal" role="dialog" aria-modal="true" aria-labelledby="flashcard-modal-title">
              <header className="flashcard-modal__header">
                <div>
                  <span className="flashcard__cat">{node.cat ?? ""}</span>
                  <h2 id="flashcard-modal-title">{node.label ?? node.title}</h2>
                </div>
                <button type="button" className="modal-close" onClick={closeCard} aria-label="Cerrar flashcard">×</button>
              </header>

              <div className={`flashcard-modal__body ${modalFlipped ? "is-flipped" : ""}`}>
                {!modalFlipped ? (
                  <div className="flashcard-modal__front">
                    <span className="flashcard-modal__eyebrow">REPASO RÁPIDO</span>
                    <p>Recordá el concepto con tus propias palabras. Luego podés abrir la card completa para estudiar toda la explicación.</p>
                    {attempt && <span className={`flashcard__badge flashcard__badge--${status}`}>{score.displayScore}/120 · {STATUS_LABEL[status]}</span>}
                  </div>
                ) : (
                  <div className="flashcard-modal__answer">
                    <span className="flashcard-modal__eyebrow">TU EXPLICACIÓN EVALUADA</span>
                    {attempt ? (
                      <>
                        <p className="flashcard-modal__long-answer">{attempt.answer}</p>
                        <ModelMeta model={attempt.model} routedVia={attempt.routedVia} />
                        <p className={`flashcard__verdict flashcard__verdict--${status}`}>
                          {score.displayScore}/120 · {STATUS_LABEL[status]} · {new Date(attempt.createdAt).toLocaleDateString("es-AR")}
                        </p>
                      </>
                    ) : (
                      <p className="flashcard__empty">Todavía no escribiste una explicación para esta card. Abrila desde el grafo y completá la autoevaluación.</p>
                    )}
                  </div>
                )}
              </div>

              <footer className="flashcard-modal__footer">
                <button type="button" className="quiz-secondary-button" onClick={() => setModalFlipped((value) => !value)}>
                  {modalFlipped ? "Ver frente" : "Ver mi explicación"}
                </button>
                <button type="button" className="quiz-primary-button" onClick={() => { closeCard(); onOpenNode?.(node); }}>
                  Abrir card completa ↗
                </button>
              </footer>
            </section>
          </div>
        );
      })()}
    </div>
  );
}
