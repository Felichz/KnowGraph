import { Check, Star } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { scoreTier } from "../../logic/studyQueue.js";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { Pill } from "../primitives/Pill.jsx";
import { getCategoryColor } from "../theme/categoryPalette.js";

export function answerOf(p) {
  return p.representative?.answer || p.draft?.text || "";
}

// Insignia de nota con el código común: verde = dominada (100+), ★ = extra, neutra = en curso.
export function TierBadge({ p }) {
  const t = useT();
  const tier = scoreTier(p);
  const score = Math.round(p.displayScore ?? 0);
  if (tier === "none") return <Pill tone="outline">{t("common.status.unscored")}</Pill>;
  if (tier === "progress") return <Pill tone="neutral"><span className="mono">{score}/120</span></Pill>;
  return <Pill tone="mastery" icon={tier === "extra" ? Star : Check}><span className="mono">{score}/120</span></Pill>;
}

// Card de la rejilla: abre el modal de flashcards (el contenido largo no cabe en la card).
export function Flashcard({ node, graph, p, onOpen }) {
  const t = useT();
  const tier = scoreTier(p);
  return (
    <button type="button" className={`fcard tier-${tier}`} onClick={onOpen} aria-haspopup="dialog" style={{ "--area": getCategoryColor(graph.id, node.cat) }}
      aria-label={t("flashcards.card.open", { label: node.label })}>
      <span className="fcard__top"><CategoryLabel graph={graph} cat={node.cat} /><TierBadge p={p} /></span>
      <span className="fcard__title">{node.label}</span>
      <span className="fcard__hint t3">{answerOf(p) ? t("flashcards.card.hasExplanation") : t("flashcards.card.hint")}</span>
    </button>
  );
}
