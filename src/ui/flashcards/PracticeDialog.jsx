import { useMemo, useState } from "react";
import { Flame, RotateCcw } from "lucide-react";
import { Overlay, OverlayHeader } from "../primitives/Overlay.jsx";
import { Button } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { actions } from "../state/useWorkspace.js";
import { answerOf } from "./Flashcard.jsx";

const RATINGS = [
  { value: 1, label: "Otra vez", key: "1" },
  { value: 2, label: "Difícil", key: "2" },
  { value: 3, label: "Bien", key: "3" },
  { value: 4, label: "Fácil", key: "4" },
];

// Práctica: una card por vez, revelar, autoevaluar 1–4 y racha (solo de sesión).
export function PracticeDialog({ cards, graph, progress, onClose }) {
  const deck = useMemo(() => [...cards].sort(() => Math.random() - 0.5), [cards]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState([]);
  const node = deck[index];
  const done = index >= deck.length;

  const rate = (value) => {
    setResults((r) => [...r, value]);
    setStreak((s) => (value >= 3 ? s + 1 : 0));
    setRevealed(false);
    setIndex((i) => i + 1);
  };
  const onKeyDown = (event) => {
    if (done || event.target.tagName === "TEXTAREA") return;
    if (!revealed && (event.key === " " || event.key === "Enter")) { event.preventDefault(); setRevealed(true); }
    else if (revealed && ["1", "2", "3", "4"].includes(event.key)) rate(Number(event.key));
  };
  const good = results.filter((v) => v >= 3).length;

  return (
    <Overlay open onClose={onClose} kind="dialog" labelledBy="practice-title" className="practice">
      <OverlayHeader id="practice-title" title="Práctica" subtitle={done ? "Terminaste" : `Card ${index + 1} de ${deck.length}`} onClose={onClose}
        actions={streak > 1 ? <span className="practice__streak"><Flame size={14} strokeWidth={1.5} aria-hidden="true" /> {streak}</span> : null} />
      <div className="practice__body" onKeyDown={onKeyDown} tabIndex={-1}>
        {done ? (
          <EmptyState title={`${good} de ${deck.length} bien`} action={<Button icon={RotateCcw} onClick={() => { setIndex(0); setResults([]); setStreak(0); }}>Practicar de nuevo</Button>}>
            Las que marcaste como difíciles conviene reescribirlas en Parafrasear.
          </EmptyState>
        ) : (
          <>
            <CategoryLabel graph={graph} cat={node.cat} />
            <h3 className="practice__q serif">{node.label}</h3>
            {node.lesson?.prompt && <p className="t2">{node.lesson.prompt}</p>}
            {!revealed ? (
              <Button variant="primary" onClick={() => setRevealed(true)} className="practice__reveal">Mostrar respuesta</Button>
            ) : (
              <div className="practice__answer">
                <p>{node.lesson?.summary}</p>
                {node.lesson?.takeaway && <p className="t2">{node.lesson.takeaway}</p>}
                {answerOf(progress.of(node.id)) && <p className="practice__mine"><span className="eyebrow">Tu explicación</span>{answerOf(progress.of(node.id))}</p>}
                <button type="button" className="practice__link" onClick={() => { onClose(); actions.openCard(node.id, { stage: "paraphrase" }); }}>Abrir en Parafrasear →</button>
                <div className="practice__rates" role="group" aria-label="¿Qué tan bien la sabías?">
                  {RATINGS.map((r) => <Button key={r.value} variant={r.value >= 3 ? "secondary" : "ghost"} onClick={() => rate(r.value)}>{r.label} <kbd className="kbd">{r.key}</kbd></Button>)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Overlay>
  );
}
