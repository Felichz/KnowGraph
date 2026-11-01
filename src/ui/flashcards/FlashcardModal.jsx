import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, CheckCircle2, X } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Overlay } from "../primitives/Overlay.jsx";
import { Button, IconButton } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { Kbd } from "../primitives/Pill.jsx";
import { Inline } from "../primitives/Markdown.jsx";
import { actions } from "../state/useWorkspace.js";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { TierBadge, answerOf } from "./Flashcard.jsx";

const RATINGS = [["again", 1], ["hard", 2], ["good", 3], ["easy", 4]];

// Repaso (specs/007 §4): un solo modo. Abrir una card es repasarla — pregunta → revelar → valorar (1–4) —
// y la valoración la reprograma y pasa a la siguiente. ←/→ navegan; Espacio revela.
export function FlashcardModal({ cards, index, graph, progress, onIndex, onRate, onClose, nextStudy }) {
  const t = useT();
  const [revealed, setRevealed] = useState(false);
  const done = index >= cards.length;
  const node = cards[Math.min(index, cards.length - 1)];
  const p = progress.of(node.id);
  const mine = answerOf(p);
  const go = (delta) => onIndex(Math.min(cards.length - 1, Math.max(0, index + delta)));
  useEffect(() => { setRevealed(false); }, [node.id, done]);

  const rate = (value) => { onRate(node.id, value); onIndex(index + 1); };
  const onKeyDown = (event) => {
    if (done) return;
    if (event.key === " " && event.target.closest?.(".fmodal__reveal, textarea, input")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
    else if (event.key === " ") { event.preventDefault(); setRevealed((r) => !r); }
    else if (revealed && ["1", "2", "3", "4"].includes(event.key)) { event.preventDefault(); rate(Number(event.key)); }
  };
  const study = () => { onClose(); actions.openCard(node.id, { stage: mine ? "paraphrase" : "read" }); };

  return (
    <Overlay open onClose={onClose} kind="dialog" labelledBy="fmodal-title" className="fmodal" initialFocus=".fmodal__frame">
      <div className="fmodal__frame" onKeyDown={onKeyDown} tabIndex={-1} style={{ "--area": getCategoryColor(graph.id, node.cat) }}>
        {done ? <Done t={t} total={cards.length} nextStudy={nextStudy} onClose={onClose} /> : (
          <>
            <header className="fmodal__head">
              <CategoryLabel graph={graph} cat={node.cat} />
              <span className="fmodal__pos mono" aria-live="polite">{t("flashcards.modal.position", { n: index + 1, total: cards.length })}</span>
              <IconButton icon={ChevronLeft} label={t("flashcards.modal.previous")} onClick={() => go(-1)} disabled={index === 0} />
              <IconButton icon={ChevronRight} label={t("flashcards.modal.next")} onClick={() => go(1)} disabled={index === cards.length - 1} />
              <IconButton icon={X} className="fmodal__close" label={t("common.actions.close")} onClick={onClose} data-close />
            </header>
            <div className="fmodal__body" key={node.id}>
              <div className="fmodal__q">
                <TierBadge p={p} />
                <h2 id="fmodal-title" className="fmodal__title serif">{node.label}</h2>
                {node.lesson?.prompt && <p className="t2 fmodal__prompt"><Inline text={node.lesson.prompt} /></p>}
              </div>
              {!revealed ? (
                <Button variant="primary" size="lg" icon={Eye} className="fmodal__reveal" onClick={() => setRevealed(true)}>
                  {t("flashcards.modal.reveal")} <Kbd>{t("flashcards.modal.space")}</Kbd>
                </Button>
              ) : (
                <div className="fmodal__answer">
                  <section>
                    <h3 className="eyebrow">{t("flashcards.card.keyIdea")}</h3>
                    {node.lesson?.summary && <p className="fmodal__lead serif"><Inline text={node.lesson.summary} /></p>}
                    {node.lesson?.takeaway && <p className="t2"><Inline text={node.lesson.takeaway} /></p>}
                  </section>
                  <section>
                    <h3 className="eyebrow">{t("flashcards.card.yourExplanation")}</h3>
                    {mine ? <p className="fmodal__mine">{mine}</p> : <p className="t3 fmodal__none">{t("flashcards.modal.noExplanation")}</p>}
                  </section>
                </div>
              )}
            </div>
            <footer className="fmodal__foot">
              {revealed ? (
                <div className="fmodal__rates" role="group" aria-label={t("flashcards.practice.rateLabel")}>
                  <span className="t2 fmodal__ask">{t("flashcards.practice.rateLabel")}</span>
                  {RATINGS.map(([key, value]) => (
                    <Button key={key} variant={value === 3 ? "primary" : "secondary"} onClick={() => rate(value)}>
                      {t(`flashcards.practice.ratings.${key}`)} <Kbd>{value}</Kbd>
                    </Button>
                  ))}
                </div>
              ) : <span className="t3 fmodal__keys">{t("flashcards.modal.keys")}</span>}
              <button type="button" className="stage__aside-link" onClick={study}>{mine ? t("flashcards.card.improve") : t("flashcards.card.study")}</button>
            </footer>
          </>
        )}
      </div>
    </Overlay>
  );
}

function Done({ t, total, nextStudy, onClose }) {
  return (
    <div className="fmodal__done">
      <CheckCircle2 size={28} strokeWidth={1.5} aria-hidden="true" />
      <h2 id="fmodal-title" className="fmodal__title serif">{t("flashcards.done.title")}</h2>
      <p className="t2">{t("flashcards.done.body", { n: total })}</p>
      {nextStudy ? (
        <Button variant="primary" size="lg" iconRight={ArrowRight} onClick={() => { onClose(); actions.openCard(nextStudy.node.id, { stage: nextStudy.stage }); }}>
          {t("flashcards.done.continue", { label: nextStudy.node.label })}
        </Button>
      ) : <Button variant="primary" size="lg" onClick={onClose}>{t("common.actions.close")}</Button>}
    </div>
  );
}
