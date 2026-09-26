import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getCompletionView, getScoreView, SEVERITY_LABEL } from "../../../ai/types.js";
import { ScoreRail, ScoreValue } from "../../primitives/Score.jsx";
import { StatusPill } from "../../primitives/Pill.jsx";
import { Notice } from "../../primitives/Feedback.jsx";
import { RubricBars } from "./RubricBars.jsx";

// Resultado de un intento: puntaje, veredicto, foco siguiente, rúbrica y análisis completo.
export function EvaluationResult({ attempt, contentHash, isLatest }) {
  const [open, setOpen] = useState(false);
  const ev = attempt.evaluation;
  const score = getScoreView(ev);
  if (!ev || !score) return null;
  const completion = getCompletionView(ev);
  const gap = ev.gaps?.[0];
  const stale = attempt.contentHash && contentHash && attempt.contentHash !== contentHash;
  return (
    <article className="result" aria-live="polite">
      <header className="result__head">
        <div className="result__score">
          <ScoreValue score={score.displayScore} size="lg" />
          <StatusPill status={score.status} />
        </div>
        <ScoreRail score={score.displayScore} size="lg" />
        {ev.conciseVerdict && <p className="result__verdict serif">{ev.conciseVerdict}</p>}
        <p className="t3">
          {isLatest ? "Último intento" : "Intento anterior"} · {new Date(attempt.createdAt).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })}
          {" · "}Cobertura esencial {completion.percent}%
        </p>
      </header>
      {stale && <Notice tone="warn">Esta evaluación es de una versión anterior de la card. Volvé a evaluar para medir el contenido actual.</Notice>}
      {(gap || ev.nextAttemptPrompt) && (
        <section className={`result__focus ${score.isMastery ? "is-optional" : ""}`}>
          <span className="eyebrow">{score.isMastery ? "Profundización opcional" : "Próximo foco"}</span>
          <p className="result__focus-title">{gap?.topic ?? "Siguiente iteración"}</p>
          <p className="t2">{gap?.explanation ?? ev.nextAttemptPrompt}</p>
          {gap?.revisionHint && <p className="result__hint">→ {gap.revisionHint}</p>}
        </section>
      )}
      <RubricBars rubric={ev.rubric} />
      <button type="button" className="result__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none" }} />
        {open ? "Ocultar análisis completo" : "Ver análisis completo"}
      </button>
      {open && (
        <div className="result__details">
          {ev.strengths?.length > 0 && <section><h3 className="lesson__h">Lo que estuvo bien</h3><ul className="bullets">{ev.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></section>}
          {ev.gaps?.length > 0 && (
            <section><h3 className="lesson__h">Puntos para mejorar</h3>
              <ul className="gaps">{ev.gaps.map((g, i) => (
                <li key={i}><span className={`sev sev--${g.severity}`}>{SEVERITY_LABEL[g.severity] ?? g.severity}</span><strong>{g.topic}.</strong> {g.explanation}{g.revisionHint && <em className="t2"> → {g.revisionHint}</em>}</li>
              ))}</ul>
            </section>
          )}
          {ev.misconceptions?.length > 0 && (
            <section><h3 className="lesson__h">Correcciones</h3>
              {ev.misconceptions.map((m, i) => <div key={i} className="miscon">{m.quote && <blockquote>{m.quote}</blockquote>}<p>{m.correction}</p></div>)}
            </section>
          )}
          {attempt.answer && <section><h3 className="lesson__h">Tu explicación evaluada</h3><p className="eval-draft__text">{attempt.answer}</p></section>}
        </div>
      )}
    </article>
  );
}
