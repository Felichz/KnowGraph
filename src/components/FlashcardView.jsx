import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [randomMode, setRandomMode] = useState(false);
  const [index, setIndex] = useState(0);
  const [randomCard, setRandomCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const lastPickedRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    listAllAttempts().then((all) => {
      if (cancelled) return;
      setAttempts(all.filter((a) => a.graphId === graph.id));
    });
    return () => { cancelled = true; };
  }, [graph.id]);

  const nodes = graph.nodes ?? [];
  const bestByNode = useMemo(() => {
    const map = new Map();
    for (const a of attempts) {
      const cur = map.get(a.nodeId);
      // Mayor score; en empate gana el más reciente.
      const score = getScoreView(a.evaluation);
      const currentScore = cur ? getScoreView(cur.evaluation) : null;
      if (!cur || score.displayScore > currentScore.displayScore ||
          (score.displayScore === currentScore.displayScore && a.createdAt > cur.createdAt)) {
        map.set(a.nodeId, a);
      }
    }
    return map;
  }, [attempts]);

  const cards = useMemo(() => {
    const list = nodes.map((node) => ({ node, attempt: bestByNode.get(node.id) ?? null }));
    if (filter === "no-attempt") return list.filter((c) => !c.attempt);
    if (filter === "below-mastery") return list.filter((c) => c.attempt && !getScoreView(c.attempt.evaluation).isMastery);
    if (filter === "mastery") return list.filter((c) => c.attempt && getScoreView(c.attempt.evaluation).isMastery);
    if (filter === "extra") return list.filter((c) => c.attempt && getScoreView(c.attempt.evaluation).isExtra);
    return list;
  }, [nodes, bestByNode, filter]);

  const pickRandom = useCallback(() => {
    if (!cards.length) {
      setRandomCard(null);
      return;
    }
    if (cards.length === 1) {
      setRandomCard(cards[0]);
      lastPickedRef.current = cards[0];
      return;
    }
    let next;
    let attemptsLocal = 0;
    do {
      next = cards[Math.floor(Math.random() * cards.length)];
      attemptsLocal++;
    } while (next === lastPickedRef.current && attemptsLocal < 5);
    setRandomCard(next);
    lastPickedRef.current = next;
  }, [cards]);

  useEffect(() => {
    if (randomMode) pickRandom();
  }, [randomMode, pickRandom]);

  useEffect(() => {
    if (index >= cards.length) setIndex(0);
    setFlipped(false);
  }, [cards.length, index]);

  if (!cards.length) {
    return (
      <div className="flashcards flashcards--empty">
        <p>No hay cards que coincidan con este filtro.</p>
        <button type="button" className="quiz-secondary-button" onClick={() => setFilter("all")}>Ver todas</button>
      </div>
    );
  }

  const card = randomMode ? (randomCard ?? cards[0]) : cards[index];
  const node = card.node;
  const attempt = card.attempt;
  const score = attempt ? getScoreView(attempt.evaluation) : null;
  const status = score?.status;

  const advance = () => {
    if (randomMode) {
      pickRandom();
    } else {
      setIndex((i) => (i + 1) % cards.length);
    }
    setFlipped(false);
  };

  const back = () => {
    if (randomMode) {
      pickRandom();
    } else {
      setIndex((i) => (i - 1 + cards.length) % cards.length);
    }
    setFlipped(false);
  };

  return (
    <div className="flashcards">
      <div className="flashcards__toolbar">
        <div className="flashcards__filters" role="group" aria-label="Filtros de flashcards">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`flashcards__filter ${filter === f.id ? "is-active" : ""}`}
              onClick={() => { setFilter(f.id); setIndex(0); }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flashcards__random">
          <input type="checkbox" checked={randomMode} onChange={(e) => setRandomMode(e.target.checked)} />
          Aleatoria
        </label>
        <span className="flashcards__count">{cards.length} cards</span>
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Voltear para ver el frente" : "Voltear para ver la explicación"}
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
            <p className="flashcard__empty">Todavía no escribiste una explicación para esta card. Abrí la card desde el grafo y completá la autoevaluación.</p>
          )}
        </div>
      </button>

      <div className="flashcards__nav">
        <button type="button" className="quiz-secondary-button" onClick={back}>← Anterior</button>
        <button type="button" className="quiz-primary-button" onClick={onOpenNode ? () => onOpenNode(node) : undefined}>
          Abrir card completa
        </button>
        <button type="button" className="quiz-secondary-button" onClick={advance}>Siguiente →</button>
      </div>
    </div>
  );
}
