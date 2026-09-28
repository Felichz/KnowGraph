import { ArrowRight, Lightbulb } from "lucide-react";
import { useT } from "../../../i18n/react.js";
import { Button } from "../../primitives/Button.jsx";
import { Markdown } from "../../primitives/Markdown.jsx";
import { CodeBlock } from "../../primitives/CodeBlock.jsx";
import { Pill } from "../../primitives/Pill.jsx";
import { LessonExtras } from "./LessonExtras.jsx";
import { ContextRail } from "./ContextRail.jsx";
import { Narrator, lessonSpeechText } from "./Narrator.jsx";

// 01 Leer: la lección completa en una columna de lectura + riel de contexto.
export function ReadStage({ node, graph, model, go }) {
  const t = useT();
  const lesson = node.lesson ?? {};
  return (
    <div className="stage stage--read">
      <article className="lesson">
        <div className="lesson__top">
          {lesson.level && <Pill tone="outline">{lesson.level}</Pill>}
          <Narrator text={lessonSpeechText(node)} />
        </div>
        {lesson.summary && <p className="lesson__lead serif">{lesson.summary}</p>}
        {lesson.why && (
          <p className="lesson__why"><span className="eyebrow">{t("study.read.whyItMatters")}</span>{lesson.why}</p>
        )}
        {lesson.explanation && <Markdown text={lesson.explanation} className="lesson__body" headingOffset={2} />}
        {lesson.code && (
          <section className="lesson__section">
            <CodeBlock code={lesson.code} label={lesson.codeLabel || t("study.read.example")} language={graph.id === "rails" ? "ruby" : undefined} />
          </section>
        )}
        {lesson.steps?.length > 0 && (
          <section className="lesson__section">
            <h2 className="lesson__h">{t("study.read.howToApply")}</h2>
            <ol className="lesson__steps">{lesson.steps.map((step, i) => <li key={i}><span className="mono">{String(i + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
          </section>
        )}
        {lesson.pitfalls?.length > 0 && (
          <section className="lesson__section">
            <h2 className="lesson__h">{t("study.read.pitfalls")}</h2>
            <ul className="lesson__pitfalls">{lesson.pitfalls.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </section>
        )}
        <LessonExtras lesson={lesson} graph={graph} />
        {lesson.takeaway && (
          <aside className="lesson__takeaway">
            <Lightbulb size={16} strokeWidth={1.5} aria-hidden="true" />
            <p><span className="eyebrow">{t("study.read.takeaway")}</span>{lesson.takeaway}</p>
          </aside>
        )}
        {lesson.prompt && (
          <aside className="lesson__prompt">
            <span className="eyebrow">{t("study.read.practiceQuestion")}</span>
            <p>{lesson.prompt}</p>
          </aside>
        )}
        <footer className="stage__next">
          <p className="t2">{t("study.read.nextPrompt")}</p>
          <div className="stage__next-actions">
            <Button variant="secondary" onClick={() => go("mentor")}>{t("study.read.talkToMentor")}</Button>
            <Button variant="primary" iconRight={ArrowRight} onClick={() => go("paraphrase")}>{t("common.stages.paraphrase")}</Button>
          </div>
        </footer>
      </article>
      <ContextRail node={node} graph={graph} model={model} />
    </div>
  );
}
