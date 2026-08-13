import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listAllAttempts } from "../ai/learningStore.js";
import { getScoreView, STATUS_LABEL } from "../ai/types.js";
import { ModelMeta } from "./ModelMeta.jsx";
import { formatEvaluationDuration } from "../ai/types.js";
import { selectRepresentativeAttempt } from "../ai/attemptSelection.js";
import { ReadingChunks } from "./ReadingChunks.jsx";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "no-attempt", label: "Sin intento" },
  { id: "below-mastery", label: "Base < 100" },
  { id: "mastery", label: "Base alcanzada" },
  { id: "extra", label: "Con extra dorado" },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

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

  const representativeByNode = useMemo(() => {
    const grouped = new Map();
    for (const attempt of attempts) {
      const nodeAttempts = grouped.get(attempt.nodeId) ?? [];
      nodeAttempts.push(attempt);
      grouped.set(attempt.nodeId, nodeAttempts);
    }
    return new Map([...grouped].map(([nodeId, nodeAttempts]) => [
      nodeId,
      selectRepresentativeAttempt(nodeAttempts),
    ]));
  }, [attempts]);

  const cards = useMemo(() => {
    const list = (graph.nodes ?? []).map((node) => ({ node, attempt: representativeByNode.get(node.id) ?? null }));
    if (filter === "no-attempt") return list.filter((card) => !card.attempt);
    if (filter === "below-mastery") return list.filter((card) => card.attempt && !getScoreView(card.attempt.evaluation).isMastery);
    if (filter === "mastery") return list.filter((card) => card.attempt && getScoreView(card.attempt.evaluation).isMastery);
    if (filter === "extra") return list.filter((card) => card.attempt && getScoreView(card.attempt.evaluation).isExtra);
    return list;
  }, [representativeByNode, filter, graph.nodes]);

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

  const moveActiveCard = useCallback((offset) => {
    setActiveCardId((currentId) => {
      const currentIndex = cards.findIndex(({ node }) => node.id === currentId);
      if (currentIndex < 0) return currentId;
      const nextIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + offset));
      return cards[nextIndex]?.node.id ?? currentId;
    });
    setModalFlipped(false);
  }, [cards]);

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
      if (event.key === "ArrowLeft") moveActiveCard(-1);
      if (event.key === "ArrowRight") moveActiveCard(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCardId, closeCard, moveActiveCard]);

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
        {cards.map(({ node, attempt }, cardIndex) => {
          const score = attempt ? getScoreView(attempt.evaluation) : null;
          const status = score?.status;
          const categoryLabel = graph.categories?.[node.cat]?.label ?? node.cat ?? "Concepto";
          return (
            <article
              id={`flashcard-${node.id}`}
              className={`flashcard-shell flashcard-shell--${status ?? "none"} ${score?.isExtra ? "is-exceptional" : ""} ${spotlightId === node.id ? "is-spotlight" : ""}`}
              key={node.id}
            >
              <button
                type="button"
                className="flashcard"
                onClick={() => openCard(node.id)}
                aria-label={`Abrir flashcard ampliada: ${node.label ?? node.title}`}
              >
                <div className="flashcard__face flashcard__face--front">
                  <div className="flashcard__meta">
                    <span className="flashcard__cat">{categoryLabel}</span>
                    <span className="flashcard__index">#{String(node.priority ?? cardIndex + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="flashcard__title">{node.label ?? node.title}</h3>
                  <p className="flashcard__summary">{node.lesson?.summary ?? "Recuperá el concepto, su propósito y el criterio para aplicarlo."}</p>
                  <div className="flashcard__status-row">
                    {attempt
                      ? <span className={`flashcard__badge flashcard__badge--${status}`}>{score.displayScore}/120 · {STATUS_LABEL[status]}</span>
                      : <span className="flashcard__badge flashcard__badge--none">Sin intento</span>}
                  </div>
                  <div className={`flashcard__progress ${score?.isExtra ? "is-extra" : ""}`} aria-hidden="true">
                    <span style={{ width: `${score ? Math.min(100, (score.displayScore / 120) * 100) : 0}%` }} />
                  </div>
                  <div className="flashcard__primary-action"><span>{attempt ? "Revisar mi explicación" : "Practicar recuerdo"}</span><span aria-hidden="true">↗</span></div>
                </div>
              </button>
              <button type="button" className="flashcard__open" onClick={() => onOpenNode?.(node)}>
                Estudiar card completa <span aria-hidden="true">→</span>
              </button>
            </article>
          );
        })}
      </div>

      {activeCardId && (() => {
        const active = cards.find(({ node }) => node.id === activeCardId);
        if (!active) return null;
        const { node, attempt } = active;
        const activeIndex = cards.findIndex(({ node: cardNode }) => cardNode.id === node.id);
        const score = attempt ? getScoreView(attempt.evaluation) : null;
        const status = score?.status;
        const categoryLabel = graph.categories?.[node.cat]?.label ?? node.cat ?? "Concepto";
        return (
          <div className="flashcard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCard(); }}>
            <section className="flashcard-modal" role="dialog" aria-modal="true" aria-labelledby="flashcard-modal-title">
              <header className="flashcard-modal__header">
                <div>
                  <div className="flashcard__meta">
                    <span className="flashcard__cat">{categoryLabel}</span>
                    <span className="flashcard__index">CARD {activeIndex + 1} DE {cards.length}</span>
                  </div>
                  <h2 id="flashcard-modal-title">{node.label ?? node.title}</h2>
                  {attempt && <span className={`flashcard__badge flashcard__badge--${status}`}>{score.displayScore}/120 · {STATUS_LABEL[status]}</span>}
                </div>
                <button type="button" className="modal-close" onClick={closeCard} aria-label="Cerrar flashcard"><CloseIcon /></button>
              </header>

              <div className={`flashcard-modal__body ${modalFlipped ? "is-flipped" : ""}`}>
                {!modalFlipped ? (
                  <div className="flashcard-modal__front">
                    <span className="flashcard-modal__eyebrow">REPASO RÁPIDO</span>
                    <h3>¿Cómo lo explicarías en una entrevista?</h3>
                    <p>Intentá reconstruir el concepto antes de revelar tu respuesta. No hace falta repetir la card literalmente: buscá recuperar el modelo mental y sus trade-offs.</p>
                  </div>
                ) : (
                  <div className="flashcard-modal__answer">
                    <span className="flashcard-modal__eyebrow">TU EXPLICACIÓN EVALUADA</span>
                    {attempt ? (
                      <>
                        <ReadingChunks text={attempt.answer} className="flashcard-modal__long-answer" />
                        <ModelMeta model={attempt.model} routedVia={attempt.routedVia} />
                        {formatEvaluationDuration(attempt.durationMs) && (
                          <p className="flashcard-modal__duration">Evaluación completa: {formatEvaluationDuration(attempt.durationMs)}</p>
                        )}
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
                <div className="flashcard-modal__nav" aria-label="Navegar flashcards">
                  <button type="button" onClick={() => moveActiveCard(-1)} disabled={activeIndex <= 0} aria-label="Flashcard anterior">←</button>
                  <span>{activeIndex + 1}/{cards.length}</span>
                  <button type="button" onClick={() => moveActiveCard(1)} disabled={activeIndex >= cards.length - 1} aria-label="Flashcard siguiente">→</button>
                </div>
                <div className="flashcard-modal__actions">
                  <button type="button" className="quiz-secondary-button" onClick={() => setModalFlipped((value) => !value)}>
                    {modalFlipped ? "Ocultar respuesta" : "Ver mi explicación"}
                  </button>
                  <button type="button" className="quiz-primary-button" onClick={() => { closeCard(); onOpenNode?.(node); }}>
                    Estudiar card ↗
                  </button>
                </div>
              </footer>
            </section>
          </div>
        );
      })()}
    </div>
  );
}
