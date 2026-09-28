import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getCompletionView, getScoreView } from "../../../ai/types.js";
import { useLocale, useT } from "../../../i18n/react.js";
import { formatDate } from "../../../i18n/translate.js";
import { ScoreRail, ScoreValue } from "../../primitives/Score.jsx";
import { StatusPill } from "../../primitives/Pill.jsx";
import { Notice } from "../../primitives/Feedback.jsx";
import { RubricBars } from "./RubricBars.jsx";

// Resultado de un intento: puntaje, veredicto, foco siguiente, rúbrica y análisis completo.
export function EvaluationResult({ attempt, contentHash, isLatest }) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ev = attempt.evaluation;
  const score = getScoreView(ev);
  if (!ev || !score) return null;
  const completion = getCompletionView(ev);
  const gap = ev.gaps?.[0];
  const stale = attempt.contentHash && contentHash && attempt.contentHash !== contentHash;
  const severity = (value) => { const k = `common.severity.${value}`; const label = t(k); return label === k ? value : label; };
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
          {isLatest ? t("study.evaluate.result.latest") : t("study.evaluate.result.previous")} · {formatDate(attempt.createdAt, { dateStyle: "medium", timeStyle: "short" }, locale)}
          {" · "}{t("study.evaluate.result.coverage", { percent: completion.percent })}
        </p>
      </header>
      {stale && <Notice tone="warn">{t("study.evaluate.result.stale")}</Notice>}
      {(gap || ev.nextAttemptPrompt) && (
        <section className={`result__focus ${score.isMastery ? "is-optional" : ""}`}>
          <span className="eyebrow">{score.isMastery ? t("study.evaluate.result.optionalDepth") : t("study.nextFocus")}</span>
          <p className="result__focus-title">{gap?.topic ?? t("study.evaluate.result.nextIteration")}</p>
          <p className="t2">{gap?.explanation ?? ev.nextAttemptPrompt}</p>
          {gap?.revisionHint && <p className="result__hint">→ {gap.revisionHint}</p>}
        </section>
      )}
      <RubricBars rubric={ev.rubric} />
      <button type="button" className="result__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none" }} />
        {open ? t("study.evaluate.result.hideAnalysis") : t("study.evaluate.result.showAnalysis")}
      </button>
      {open && (
        <div className="result__details">
          {ev.strengths?.length > 0 && <section><h3 className="lesson__h">{t("study.evaluate.result.strengths")}</h3><ul className="bullets">{ev.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></section>}
          {ev.gaps?.length > 0 && (
            <section><h3 className="lesson__h">{t("study.evaluate.result.gaps")}</h3>
              <ul className="gaps">{ev.gaps.map((g, i) => (
                <li key={i}><span className={`sev sev--${g.severity}`}>{severity(g.severity)}</span><strong>{g.topic}.</strong> {g.explanation}{g.revisionHint && <em className="t2"> → {g.revisionHint}</em>}</li>
              ))}</ul>
            </section>
          )}
          {ev.misconceptions?.length > 0 && (
            <section><h3 className="lesson__h">{t("study.evaluate.result.corrections")}</h3>
              {ev.misconceptions.map((m, i) => <div key={i} className="miscon">{m.quote && <blockquote>{m.quote}</blockquote>}<p>{m.correction}</p></div>)}
            </section>
          )}
          {attempt.answer && <section><h3 className="lesson__h">{t("study.evaluate.result.evaluatedAnswer")}</h3><p className="eval-draft__text">{attempt.answer}</p></section>}
        </div>
      )}
    </article>
  );
}
