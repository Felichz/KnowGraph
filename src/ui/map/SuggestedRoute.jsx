import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Button, IconButton } from "../primitives/Button.jsx";
import { ScoreRail } from "../primitives/Score.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { useIsMobile } from "../hooks/useMediaQuery.js";
import { actions } from "../state/useWorkspace.js";
import { RouteRow } from "./RouteRow.jsx";
import { useStageOf } from "./useStageOf.js";

// Ruta sugerida: Ahora / Después / Más adelante (INF-020…026, R2).
export function SuggestedRoute({ model }) {
  const mobile = useIsMobile();
  const t = useT();
  const { guidance, graph, progress } = model;
  const stageOf = useStageOf(graph);
  if (!guidance.primary) {
    return (
      <section className="route route--done" aria-labelledby="route-title">
        <h2 id="route-title" className="sr-only">{t("map.route.title")}</h2>
        <EmptyState icon={CheckCircle2} title={t("map.route.doneTitle")} compact
          action={<Button variant="primary" onClick={() => actions.setView("progress")}>{t("map.route.viewProgress")}</Button>}>
          {t("map.route.doneBody")}
        </EmptyState>
      </section>
    );
  }
  if (mobile) return <MobileRoute model={model} stageOf={stageOf} />;
  const [, later, after] = guidance.levels;
  return (
    <section className="route" aria-labelledby="route-title">
      <div className="route__head">
        <h2 id="route-title" className="eyebrow">{t("map.route.title")}</h2>
        <p className="route__help">{t("map.route.help")} <span className="t3">{graph.subtitle}</span></p>
        {graph.interviewQuestions?.length ? (
          <a className="route__ref" href={graph.interviewQuestionSource} target="_blank" rel="noreferrer noopener">
            {t("map.route.questionsRef", { count: graph.interviewQuestions.length })} <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <div className="route__grid">
        <RouteNow node={guidance.primary} graph={graph} progress={progress} stage={stageOf(guidance.primary.id)} />
        <RouteColumn title={t("map.route.later")} nodes={later} progress={progress} />
        <RouteColumn title={t("map.route.after")} nodes={after} progress={progress} />
      </div>
    </section>
  );
}

function RouteNow({ node, graph, progress, stage, footer }) {
  const t = useT();
  const p = progress.of(node.id);
  return (
    <article className="route-now card">
      <div className="route-now__top">
        <p className="eyebrow">{t("map.route.now")}</p>
        <CategoryLabel graph={graph} cat={node.cat} className="route-now__cat" />
      </div>
      <h3 className="route-now__title clamp-2">{node.label}</h3>
      <ScoreRail score={p.displayScore} />
      <div className="route-now__meta">
        <span className="route-now__stage clamp-1">{t("map.route.stageMeta", { rank: stage.rank, total: stage.total, priority: node.priority })}</span>
        <Button variant="primary" size="md" iconRight={ArrowRight} minWidth={148} onClick={() => actions.openCard(node.id)}>
          {footer ? t("map.route.study") : t("map.route.studyNow")}
        </Button>
      </div>
      {footer}
    </article>
  );
}

function RouteColumn({ title, nodes, progress }) {
  const t = useT();
  return (
    <div className="route-col">
      <h3 className="eyebrow">{title}</h3>
      {nodes.length ? (
        <ul className="route-col__list">
          {nodes.map((node) => <li key={node.id}><RouteRow node={node} p={progress.of(node.id)} onOpen={() => actions.openCard(node.id)} /></li>)}
        </ul>
      ) : <p className="route-col__empty">{t("map.route.emptyColumn")}</p>}
    </div>
  );
}

function MobileRoute({ model, stageOf }) {
  const t = useT();
  const steps = model.guidance.levels.flat().slice(0, 9);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [model.graphId, model.focusCat]);
  const node = steps[Math.min(index, steps.length - 1)];
  const stepper = (
    <div className="route-now__stepper">
      <IconButton icon={ChevronLeft} size="md" label={t("map.route.previous")} disabled={index === 0} onClick={() => setIndex((i) => i - 1)} />
      <span className="mono t2">{index + 1}/{steps.length}</span>
      <IconButton icon={ChevronRight} size="md" label={t("map.route.next")} disabled={index >= steps.length - 1} onClick={() => setIndex((i) => i + 1)} />
    </div>
  );
  return (
    <section className="route route--mobile" aria-label={t("map.route.title")}>
      <RouteNow node={node} graph={model.graph} progress={model.progress} stage={stageOf(node.id)} footer={stepper} />
    </section>
  );
}
