import { useMemo, useState } from "react";
import { Flame, RotateCcw } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Overlay, OverlayHeader } from "../primitives/Overlay.jsx";
import { Button } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { actions } from "../state/useWorkspace.js";
import { answerOf } from "./Flashcard.jsx";

const RATINGS = [
  { value: 1, labelKey: "flashcards.practice.ratings.again", key: "1" },
  { value: 2, labelKey: "flashcards.practice.ratings.hard", key: "2" },
  { value: 3, labelKey: "flashcards.practice.ratings.good", key: "3" },
  { value: 4, labelKey: "flashcards.practice.ratings.easy", key: "4" },
];

// Práctica: una card por vez, revelar, autoevaluar 1–4 y racha (solo de sesión).
export function PracticeDialog({ cards, graph, progress, onClose }) {
  const t = useT();
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
      <OverlayHeader id="practice-title" title={t("flashcards.practice.title")} subtitle={done ? t("flashcards.practice.finished") : t("flashcards.practice.position", { n: index + 1, total: deck.length })} onClose={onClose}
        actions={streak > 1 ? <span className="practice__streak"><Flame size={14} strokeWidth={1.5} aria-hidden="true" /> {streak}</span> : null} />
      <div className="practice__body" onKeyDown={onKeyDown} tabIndex={-1}>
        {done ? (
          <EmptyState title={t("flashcards.practice.result", { good, total: deck.length })} action={<Button icon={RotateCcw} onClick={() => { setIndex(0); setResults([]); setStreak(0); }}>{t("flashcards.practice.restart")}</Button>}>
            {t("flashcards.practice.resultBody")}
          </EmptyState>
        ) : (
          <>
            <CategoryLabel graph={graph} cat={node.cat} />
            <h3 className="practice__q serif">{node.label}</h3>
            {node.lesson?.prompt && <p className="t2">{node.lesson.prompt}</p>}
            {!revealed ? (
              <Button variant="primary" onClick={() => setRevealed(true)} className="practice__reveal">{t("flashcards.practice.reveal")}</Button>
            ) : (
              <div className="practice__answer">
                <p>{node.lesson?.summary}</p>
                {node.lesson?.takeaway && <p className="t2">{node.lesson.takeaway}</p>}
                {answerOf(progress.of(node.id)) && <p className="practice__mine"><span className="eyebrow">{t("flashcards.card.yourExplanation")}</span>{answerOf(progress.of(node.id))}</p>}
                <button type="button" className="practice__link" onClick={() => { onClose(); actions.openCard(node.id, { stage: "paraphrase" }); }}>{t("flashcards.practice.openParaphrase")}</button>
                <div className="practice__rates" role="group" aria-label={t("flashcards.practice.rateLabel")}>
                  {RATINGS.map((r) => <Button key={r.value} variant={r.value >= 3 ? "secondary" : "ghost"} onClick={() => rate(r.value)}>{t(r.labelKey)} <kbd className="kbd">{r.key}</kbd></Button>)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Overlay>
  );
}
