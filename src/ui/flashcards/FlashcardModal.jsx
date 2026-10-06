import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Overlay } from "../primitives/Overlay.jsx";
import { Button, IconButton } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { Kbd } from "../primitives/Pill.jsx";
import { Inline } from "../primitives/Markdown.jsx";
import { actions } from "../state/useWorkspace.js";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { TierBadge, answerOf } from "./Flashcard.jsx";

// Modal de flashcards (specs/004-ui-flow §6): pregunta → revelar → idea clave y tu explicación completa,
// con navegación ←/→ entre las cards del filtro actual. Espacio revela/oculta.
export function FlashcardModal({ cards, index, graph, progress, onIndex, onClose }) {
  const t = useT();
  const [revealed, setRevealed] = useState(false);
  const node = cards[index];
  const p = progress.of(node.id);
  const mine = answerOf(p);
  const go = (delta) => onIndex(Math.min(cards.length - 1, Math.max(0, index + delta)));
  useEffect(() => { setRevealed(false); }, [node.id]);

  const onKeyDown = (event) => {
    if (event.key === " " && event.target.closest?.(".fmodal__reveal, textarea, input")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
    else if (event.key === " ") { event.preventDefault(); setRevealed((r) => !r); }
  };
  const study = () => { onClose(); actions.openCard(node.id, { stage: mine ? "paraphrase" : "read" }); };

  return (
    <Overlay open onClose={onClose} kind="dialog" labelledBy="fmodal-title" className="fmodal" initialFocus=".fmodal__frame">
      <div className="fmodal__frame" onKeyDown={onKeyDown} tabIndex={-1} style={{ "--area": getCategoryColor(graph.id, node.cat) }}>
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
            <Button variant="primary" icon={Eye} className="fmodal__reveal" onClick={() => setRevealed(true)}>
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
          <span className="t3 fmodal__keys">{t("flashcards.modal.keys")}</span>
          <Button variant="ghost" onClick={onClose}>{t("common.actions.close")}</Button>
          <Button variant="secondary" iconRight={ArrowRight} onClick={study}>{mine ? t("flashcards.card.improve") : t("flashcards.card.study")}</Button>
        </footer>
      </div>
    </Overlay>
  );
}
