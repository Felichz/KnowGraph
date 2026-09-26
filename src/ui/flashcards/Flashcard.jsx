import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { ScoreValue } from "../primitives/Score.jsx";
import { actions } from "../state/useWorkspace.js";

export function answerOf(p) {
  return p.representative?.answer || p.draft?.text || "";
}

// Card volteable: frente = concepto; dorso = idea central + tu explicación.
export function Flashcard({ node, graph, p }) {
  const [flipped, setFlipped] = useState(false);
  const mine = answerOf(p);
  return (
    <div className={`fcard ${flipped ? "is-flipped" : ""}`}>
      <button type="button" className="fcard__face" aria-pressed={flipped} onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? `${node.label}: ver frente` : `${node.label}: ver respuesta`}>
        {!flipped ? (
          <>
            <span className="fcard__top"><CategoryLabel graph={graph} cat={node.cat} /><ScoreValue score={p.displayScore} empty="" /></span>
            <span className="fcard__title">{node.label}</span>
            <span className="fcard__hint t3">¿Cómo lo explicarías?</span>
          </>
        ) : (
          <>
            <span className="eyebrow">Idea central</span>
            <span className="fcard__answer">{node.lesson?.takeaway || node.lesson?.summary}</span>
            {mine && <span className="fcard__mine clamp-3"><span className="eyebrow">Tu explicación</span> {mine}</span>}
          </>
        )}
      </button>
      {flipped && (
        <button type="button" className="fcard__study" onClick={() => actions.openCard(node.id, { stage: mine ? "paraphrase" : "read" })}>
          {mine ? "Mejorar explicación" : "Estudiar"} <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
