import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listAllAttempts, listAllDrafts } from "../ai/learningStore.js";
import { getScoreView, STATUS_LABEL } from "../ai/types.js";
import { ModelMeta } from "./ModelMeta.jsx";
import { formatEvaluationDuration } from "../ai/types.js";
import { selectRepresentativeAttempt } from "../ai/attemptSelection.js";
import { ReadingChunks } from "./ReadingChunks.jsx";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "ai-generated", label: "✨ Con IA" },
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
  const [drafts, setDrafts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [spotlightId, setSpotlightId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const toggleSpeech = useCallback((textToRead) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    if (!textToRead) return;
    synth.cancel();
    const utterance = new window.SpeechSynthesisUtterance(textToRead);
    utterance.lang = "es-419";
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
  }, [speaking]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [activeCardId, modalFlipped]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      listAllAttempts(),
      listAllDrafts(),
    ]).then(([allAttempts, allDrafts]) => {
      if (!cancelled) {
        setAttempts(allAttempts.filter((attempt) => attempt.graphId === graph.id));
        setDrafts(allDrafts.filter((draft) => draft.key?.startsWith(`${graph.id}:`)));
      }
    });
    return () => { cancelled = true; };
  }, [graph.id]);

  const draftByNode = useMemo(() => {
    const map = new Map();
    for (const draft of drafts) {
      const [, nodeId] = String(draft.key ?? "").split(":");
      if (nodeId) map.set(nodeId, draft);
    }
    return map;
  }, [drafts]);

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
    const list = (graph.nodes ?? []).map((node) => {
      const attempt = representativeByNode.get(node.id) ?? null;
      const draft = draftByNode.get(node.id) ?? null;
      const isAiGenerated = Boolean(attempt?.isAiGenerated || draft?.isAiGenerated);
      return { node, attempt, draft, isAiGenerated };
    });
    if (filter === "ai-generated") return list.filter((card) => card.isAiGenerated);
    if (filter === "no-attempt") return list.filter((card) => !card.attempt);
    if (filter === "below-mastery") return list.filter((card) => card.attempt && !getScoreView(card.attempt.evaluation).isMastery);
    if (filter === "mastery") return list.filter((card) => card.attempt && getScoreView(card.attempt.evaluation).isMastery);
    if (filter === "extra") return list.filter((card) => card.attempt && getScoreView(card.attempt.evaluation).isExtra);
    return list;
  }, [representativeByNode, draftByNode, filter, graph.nodes]);

  useEffect(() => {
    setSpotlightId(null);
    setActiveCardId(null);
    setModalFlipped(false);
    setPracticeMode(false);
  }, [filter, graph.id]);

  const openCard = useCallback((nodeId) => {
    setActiveCardId(nodeId);
    setModalFlipped(false);
  }, []);

  const closeCard = useCallback(() => {
    setActiveCardId(null);
    setModalFlipped(false);
    setPracticeMode(false);
  }, []);

  const startPracticeSession = useCallback(() => {
    if (!cards.length) return;
    setPracticeMode(true);
    setPracticeIndex(0);
    setStreak(0);
    setPracticeComplete(false);
    setModalFlipped(false);
    setActiveCardId(cards[0].node.id);
  }, [cards]);

  const handleRating = useCallback((score) => {
    if (score >= 3) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setModalFlipped(false);
    if (practiceIndex < cards.length - 1) {
      setPracticeIndex((i) => i + 1);
      setActiveCardId(cards[practiceIndex + 1].node.id);
    } else {
      setPracticeComplete(true);
    }
  }, [practiceIndex, cards]);

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

  // Global Keyboard Shortcuts in Flashcard Modal / Practice Mode
  useEffect(() => {
    if (!activeCardId) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCard();
      } else if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        setModalFlipped((v) => !v);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveActiveCard(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveActiveCard(1);
      } else if (modalFlipped && practiceMode) {
        if (event.key === "1") handleRating(1);
        else if (event.key === "2") handleRating(2);
        else if (event.key === "3") handleRating(3);
        else if (event.key === "4") handleRating(4);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCardId, closeCard, moveActiveCard, modalFlipped, practiceMode, handleRating]);

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
        <div className="flashcards__actions">
          <button type="button" className="flashcards__practice-cta" onClick={startPracticeSession}>
            <span aria-hidden="true">⚡</span> Iniciar práctica rápida
          </button>
          <button type="button" className="flashcards__random" onClick={pickRandom}>
            <span aria-hidden="true">✦</span> Elegir al azar
          </button>
        </div>
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
                    {card.isAiGenerated && (
                      <span className="flashcard__ai-badge" title="Esta explicación fue generada automáticamente con IA">
                        ✨ Con IA
                      </span>
                    )}
                  </div>
                  <div className={`flashcard__progress ${score?.isExtra ? "is-extra" : ""}`} aria-hidden="true">
                    <span style={{ width: `${score ? Math.min(100, (score.displayScore / 120) * 100) : 0}%` }} />
                  </div>
                  <div className="flashcard__primary-action">
                    <span>{attempt ? "Revisar mi explicación" : "Practicar recuerdo"}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
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
        const { node, attempt, draft, isAiGenerated } = active;
        const activeIndex = cards.findIndex(({ node: cardNode }) => cardNode.id === node.id);
        const score = attempt ? getScoreView(attempt.evaluation) : null;
        const status = score?.status;
        const categoryLabel = graph.categories?.[node.cat]?.label ?? node.cat ?? "Concepto";

        if (practiceComplete) {
          return (
            <div className="flashcard-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) closeCard(); }}>
              <section className="flashcard-modal flashcard-modal--complete" role="dialog" aria-modal="true">
                <div className="flashcard-complete-card">
                  <span className="flashcard-complete-emoji">🎉</span>
                  <h2>¡Sesión de práctica completada!</h2>
                  <p>Repasaste {cards.length} conceptos clave. Racha alcanzada: <strong>{streak} seguidas</strong>.</p>
                  <div className="flashcard-complete-actions">
                    <button type="button" className="quiz-primary-button" onClick={startPracticeSession}>Repetir sesión</button>
                    <button type="button" className="quiz-secondary-button" onClick={closeCard}>Volver al mazo</button>
                  </div>
                </div>
              </section>
            </div>
          );
        }

        return (
          <div className="flashcard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCard(); }}>
            <section className="flashcard-modal" role="dialog" aria-modal="true" aria-labelledby="flashcard-modal-title">
              <header className="flashcard-modal__header">
                <div>
                  <div className="flashcard__meta">
                    <span className="flashcard__cat">{categoryLabel}</span>
                    <span className="flashcard__index">CARD {activeIndex + 1} DE {cards.length} {practiceMode && streak > 0 && <span className="flashcard__streak-pill">🔥 Racha: {streak}</span>}</span>
                  </div>
                  <h2 id="flashcard-modal-title">{node.label ?? node.title}</h2>
                  {attempt && <span className={`flashcard__badge flashcard__badge--${status}`}>{score.displayScore}/120 · {STATUS_LABEL[status]}</span>}
                </div>
                <button type="button" className="modal-close" onClick={closeCard} aria-label="Cerrar flashcard"><CloseIcon /></button>
              </header>

              <div className={`flashcard-modal__body ${modalFlipped ? "is-flipped" : ""}`}>
                {!modalFlipped ? (
                  <div className="flashcard-modal__front">
                    <span className="flashcard-modal__eyebrow">PREGUNTA DE REPASO</span>
                    <p className="flashcard-modal__prompt">
                      {node.lesson?.prompt ?? `Explicá qué es ${node.label ?? node.title}, por qué importa y cómo se aplica en un proyecto real.`}
                    </p>
                    <button
                      type="button"
                      className="flashcard-modal__flip-cta"
                      onClick={() => setModalFlipped(true)}
                      aria-label="Revelar modelo mental y respuesta"
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.5a6.5 6.5 0 0 1 6.5 6.5h-2a4.5 4.5 0 1 0-1.3 3.2l1.4 1.4A6.5 6.5 0 1 1 10 3.5zm3.5 3.5L18 10l-4.5 3V7z" fill="currentColor"/></svg>
                      <span>Revelar respuesta y modelo mental</span>
                      <kbd>ESPACIO</kbd>
                    </button>
                  </div>
                ) : (
                  <div className="flashcard-modal__answer">
                    <div className="flashcard-modal__user-attempt-header">
                      <span className="flashcard-modal__eyebrow">MODELO MENTAL CANÓNICO</span>
                      <button
                        type="button"
                        className={`flashcard-tts-btn ${speaking ? "is-playing" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSpeech(`${node.lesson?.summary ?? ""}. ${node.lesson?.why ? "Por qué importa: " + node.lesson.why : ""}`);
                        }}
                        aria-label={speaking ? "Detener lectura" : "Leer modelo mental en voz alta"}
                        title={speaking ? "Detener lectura" : "Leer modelo mental en voz alta"}
                      >
                        {speaking ? (
                          <>
                            <svg viewBox="0 0 20 20" aria-hidden="true" className="tts-icon-pulse"><path d="M6 5h3v10H6zm5 0h3v10h-3z" fill="currentColor" /></svg>
                            <span>Detener</span>
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M9 4.5 5 8H2v4h3l4 3.5v-11ZM13.5 6.5a5 5 0 0 1 0 7M16 4a9 9 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span>Escuchar modelo</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flashcard-modal__canonical">
                      <p><strong>En una frase:</strong> {node.lesson?.summary}</p>
                      {node.lesson?.why && <p><strong>Por qué importa:</strong> {node.lesson?.why}</p>}
                    </div>

                    {attempt ? (
                      <div className="flashcard-modal__user-attempt">
                        <div className="flashcard-modal__user-attempt-header">
                          <div className="flashcard-modal__eyebrow-container">
                            <span className="flashcard-modal__eyebrow">TU RESPUESTA EVALUADA</span>
                            {attempt.isAiGenerated && (
                              <span className="flashcard-modal__ai-badge" title="Esta paráfrasis fue generada automáticamente con IA">
                                ✨ Generada con IA
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            className={`flashcard-tts-btn ${speaking ? "is-playing" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSpeech(attempt.answer);
                            }}
                            aria-label={speaking ? "Detener lectura de tu respuesta" : "Leer tu respuesta en voz alta"}
                            title={speaking ? "Detener lectura" : "Leer tu respuesta en voz alta"}
                          >
                            {speaking ? (
                              <>
                                <svg viewBox="0 0 20 20" aria-hidden="true" className="tts-icon-pulse"><path d="M6 5h3v10H6zm5 0h3v10h-3z" fill="currentColor" /></svg>
                                <span>Detener</span>
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M9 4.5 5 8H2v4h3l4 3.5v-11ZM13.5 6.5a5 5 0 0 1 0 7M16 4a9 9 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span>Escuchar mi respuesta</span>
                              </>
                            )}
                          </button>
                        </div>
                        <ReadingChunks text={attempt.answer} className="flashcard-modal__long-answer" />
                        <div className="flashcard-modal__meta-row">
                          <ModelMeta model={attempt.model} routedVia={attempt.routedVia} />
                          {formatEvaluationDuration(attempt.durationMs) && (
                            <span className="flashcard-modal__duration">({formatEvaluationDuration(attempt.durationMs)})</span>
                          )}
                          <span className={`flashcard__verdict flashcard__verdict--${status}`}>
                            {score.displayScore}/120 · {STATUS_LABEL[status]}
                          </span>
                        </div>
                      </div>
                    ) : draft?.text ? (
                      <div className="flashcard-modal__user-attempt flashcard-modal__user-attempt--draft">
                        <div className="flashcard-modal__user-attempt-header">
                          <div className="flashcard-modal__eyebrow-container">
                            <span className="flashcard-modal__eyebrow">BORRADOR EN PROGRESO</span>
                            {draft.isAiGenerated && (
                              <span className="flashcard-modal__ai-badge">
                                ✨ Generado con IA
                              </span>
                            )}
                          </div>
                        </div>
                        <ReadingChunks text={draft.text} className="flashcard-modal__long-answer" />
                      </div>
                    ) : null}

                    {isAiGenerated && (
                      <div className="flashcard-modal__ai-notice">
                        <div className="flashcard-modal__ai-notice-text">
                          <strong>✨ Card generada con IA</strong>
                          <span>¿Querés consolidar tu propio modelo mental escribiéndolo desde cero?</span>
                        </div>
                        <button type="button" className="flashcard-modal__ai-notice-btn" onClick={() => onOpenNode?.(node)}>
                          Practicar en Coaching →
                        </button>
                      </div>
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

                {practiceMode && modalFlipped ? (
                  <div className="flashcard-modal__rating-bar">
                    <span className="flashcard-modal__rating-label">¿Cómo lo recordaste?</span>
                    <div className="flashcard-modal__ratings">
                      <button type="button" className="flashcard-rating-btn rating-again" onClick={() => handleRating(1)} title="Atajo: tecla 1">
                        <kbd>1</kbd> Otra vez
                      </button>
                      <button type="button" className="flashcard-rating-btn rating-hard" onClick={() => handleRating(2)} title="Atajo: tecla 2">
                        <kbd>2</kbd> Difícil
                      </button>
                      <button type="button" className="flashcard-rating-btn rating-good" onClick={() => handleRating(3)} title="Atajo: tecla 3">
                        <kbd>3</kbd> Bien
                      </button>
                      <button type="button" className="flashcard-rating-btn rating-easy" onClick={() => handleRating(4)} title="Atajo: tecla 4">
                        <kbd>4</kbd> Fácil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flashcard-modal__actions">
                    <button type="button" className="quiz-secondary-button" onClick={() => setModalFlipped((value) => !value)}>
                      {modalFlipped ? "Ocultar respuesta" : "Ver respuesta (Espacio)"}
                    </button>
                    <button type="button" className="quiz-primary-button" onClick={() => { closeCard(); onOpenNode?.(node); }}>
                      Estudiar card completa ↗
                    </button>
                  </div>
                )}
              </footer>
            </section>
          </div>
        );
      })()}
    </div>
  );
}
