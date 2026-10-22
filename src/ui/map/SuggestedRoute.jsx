import { ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { useLocale, useT } from "../../i18n/react.js";
import { getLessonContext } from "../../logic/guidance.js";
import { resumeTarget, reviewCount } from "../../logic/studyQueue.js";
import { Button } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { ScoreValue } from "../primitives/Score.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { actions } from "../state/useWorkspace.js";
import { HowItWorks, useIntroDismissed } from "./HowItWorks.jsx";

// «Continuar» (specs/004-ui-flow §1): la única respuesta a «¿qué hago ahora?» — retomar, mejor siguiente, repasar.
export function SuggestedRoute({ model }) {
  const t = useT();
  const { guidance, graph, progress, visible } = model;
  const [introDismissed, dismissIntro] = useIntroDismissed();
  const resume = resumeTarget(visible, progress);
  const toReview = reviewCount(visible, progress);
  const fresh = !resume && progress.done === 0 && toReview === 0;
  // Si lo que retomarías es también el mejor siguiente, una sola tile con el estado y la etapa de retomar.
  const merged = resume && resume.node.id === guidance.primary?.id ? resume : null;
  return (
    <section className="continue" aria-labelledby="continue-title">
      <h2 id="continue-title" className="continue__title">{t("map.continue.title")}</h2>
      <div className="continue__grid">
        {resume && !merged && <ResumeTile resume={resume} graph={graph} />}
        {guidance.primary ? <BestNextTile node={guidance.primary} model={model} resume={merged} /> : (
          <div className="continue__tile">
            <EmptyState icon={CheckCircle2} title={t("map.route.doneTitle")} compact
              action={<Button variant="secondary" onClick={() => actions.setView("progress")}>{t("map.route.viewProgress")}</Button>}>
              {t("map.route.doneBody")}
            </EmptyState>
          </div>
        )}
        <div className="continue__tile">
          <p className="continue__name">{toReview ? t("map.continue.reviewCount", { n: toReview }) : t("map.continue.reviewNone")}</p>
          <p className="t2 continue__why">{toReview ? t("map.continue.reviewHelp") : t("map.continue.reviewNoneHelp")}</p>
          <Button variant="secondary" icon={Layers} onClick={() => actions.setView("flashcards")}>{t("map.continue.openReview")}</Button>
        </div>
      </div>
      {fresh && !introDismissed && <HowItWorks onDismiss={dismissIntro} />}
    </section>
  );
}

function ResumeTile({ resume, graph }) {
  const t = useT();
  const { node, p, stage } = resume;
  return (
    <article className="continue__tile">
      <div className="continue__top"><span className="pill">{t("map.continue.resume")}</span><CategoryLabel graph={graph} cat={node.cat} /></div>
      <p className="continue__name">{node.label}</p>
      <ResumeState resume={resume} />
      <Button variant="secondary" iconRight={ArrowRight} onClick={() => actions.openCard(node.id, { stage })}>{t("map.continue.resumeAction")}</Button>
    </article>
  );
}

function ResumeState({ resume }) {
  const t = useT();
  return (
    <p className="t2 continue__why">{t(`map.continue.state.${resume.stage}`)}
      {typeof resume.p.displayScore === "number" && <> · <ScoreValue score={resume.p.displayScore} /></>}</p>
  );
}

function BestNextTile({ node, model, resume }) {
  const t = useT();
  const locale = useLocale();
  const { graph, progress } = model;
  const prerequisites = node.prerequisites.map((id) => graph.nodeById.get(id)).filter(Boolean);
  const why = getLessonContext(node, prerequisites, prerequisites.filter((n) => !progress.checked.has(n.id)), graph.categoryContext, locale);
  return (
    <article className="continue__tile is-best">
      <div className="continue__top"><span className="pill pill--accent">{t("map.card.bestNext")}</span><CategoryLabel graph={graph} cat={node.cat} /></div>
      <p className="continue__name">{node.label}</p>
      {resume ? <ResumeState resume={resume} /> : <p className="t2 continue__why clamp-2">{why}</p>}
      <Button variant="primary" iconRight={ArrowRight} onClick={() => actions.openCard(node.id, { stage: resume?.stage ?? "read" })}>
        {resume ? t("map.continue.resumeAction") : t("map.route.studyNow")}
      </Button>
    </article>
  );
}
