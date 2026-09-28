import { useEffect, useRef } from "react";
import { ArrowLeft, BookOpen, ClipboardCheck, Maximize2, MessagesSquare, Minimize2, PenLine, X } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Button, IconButton } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { ScoreValue } from "../primitives/Score.jsx";
import { EmptyState } from "../primitives/Feedback.jsx";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { useEscape } from "../hooks/useEscape.js";
import { ESC_PRIORITY } from "../state/escStack.js";
import { actions } from "../state/useWorkspace.js";
import { useStudyData } from "./useStudyData.js";
import { ReadStage } from "./read/ReadStage.jsx";
import { MentorStage } from "./mentor/MentorStage.jsx";
import { ParaphraseStage } from "./paraphrase/ParaphraseStage.jsx";
import { EvaluateStage } from "./evaluate/EvaluateStage.jsx";

export const STAGES = [
  { id: "read", num: "01", labelKey: "common.stages.read", icon: BookOpen, Component: ReadStage },
  { id: "mentor", num: "02", labelKey: "common.stages.mentor", icon: MessagesSquare, Component: MentorStage },
  { id: "paraphrase", num: "03", labelKey: "common.stages.paraphrase", icon: PenLine, Component: ParaphraseStage },
  { id: "evaluate", num: "04", labelKey: "common.stages.evaluate", icon: ClipboardCheck, Component: EvaluateStage },
];

// Sesión de estudio: capa a pantalla completa sobre el shell (US2).
export default function StudySession({ model, study }) {
  const t = useT();
  const { graph, graphId } = model;
  const node = graph.nodeById?.get(study.nodeId) ?? graph.nodes.find((n) => n.id === study.nodeId);
  if (!node) {
    return (
      <div className="study study--missing">
        <EmptyState title={t("study.session.notFoundTitle")} action={<Button variant="primary" onClick={actions.closeCard}>{t("study.backToMap")}</Button>}>
          {t("study.session.notFoundBody")}
        </EmptyState>
      </div>
    );
  }
  return <Session model={model} study={study} node={node} graphId={graphId} />;
}

function Session({ model, study, node, graphId }) {
  const t = useT();
  const { graph } = model;
  const data = useStudyData(graphId, node);
  const bodyRef = useRef(null);
  const stageIndex = Math.max(0, STAGES.findIndex((s) => s.id === study.stage));
  const stage = STAGES[stageIndex];
  const p = model.progress.of(node.id);
  const prevId = study.history.at(-1);
  const prevNode = prevId ? graph.nodeById?.get(prevId) : null;
  const running = data.task?.status === "running";

  useEscape(() => { if (!study.zen) return false; actions.setZen(false); return true; }, ESC_PRIORITY.zen, study.zen);
  useEscape(() => { actions.closeCard(); return true; }, ESC_PRIORITY.study, true);
  useEffect(() => { bodyRef.current?.scrollTo?.({ top: 0 }); }, [stage.id, node.id]);

  const go = (id, extra) => actions.setStage(id, extra);
  const onTabKey = (event) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = STAGES[(stageIndex + delta + STAGES.length) % STAGES.length];
    go(next.id);
    requestAnimationFrame(() => document.getElementById(`study-tab-${next.id}`)?.focus());
  };
  const color = getCategoryColor(graph.id, node.cat, graph.categories[node.cat]?.color);
  const Stage = stage.Component;

  return (
    <div className={`study ${study.zen ? "is-zen" : ""}`} style={{ "--lesson-color": color }} role="region" aria-label={t("study.session.regionLabel", { label: node.label })}>
      <header className="study__bar">
        <Button variant="ghost" icon={ArrowLeft} onClick={prevNode ? actions.back : actions.closeCard} className="study__back">
          <span className="clamp-1">{prevNode ? t("study.session.backTo", { label: prevNode.label }) : t("study.session.map")}</span>
        </Button>
        <div className="study__heading">
          <CategoryLabel graph={graph} cat={node.cat} className="study__cat" />
          <h1 className="study__title clamp-1" tabIndex={-1}>{node.label}</h1>
        </div>
        <div className="study__meta">
          <ScoreValue score={p.displayScore} size="md" />
          <IconButton icon={study.zen ? Minimize2 : Maximize2} label={study.zen ? t("study.session.zenExit") : t("study.session.zenEnter")} pressed={study.zen} onClick={() => actions.setZen(!study.zen)} />
          <IconButton icon={X} label={t("study.session.close")} onClick={actions.closeCard} />
        </div>
      </header>
      <nav className="study__tabs" role="tablist" aria-label={t("study.session.tabsLabel")} onKeyDown={onTabKey}>
        {STAGES.map((s) => {
          const selected = s.id === stage.id;
          const badge = s.id === "paraphrase" && data.draft.trim() ? t("study.session.badge.draft") : s.id === "evaluate" && running && data.task.type === "evaluation" ? t("study.session.badge.evaluating")
            : s.id === "mentor" && running && data.task.type === "pedagogical_harness" ? t("study.session.badge.working") : s.id === "evaluate" && data.attempts.length ? t("study.session.badge.attempts", { n: data.attempts.length }) : null;
          return (
            <button key={s.id} id={`study-tab-${s.id}`} role="tab" aria-selected={selected} aria-controls="study-stage" tabIndex={selected ? 0 : -1}
              className={`study-tab ${selected ? "is-active" : ""}`} onClick={() => go(s.id)}>
              <span className="study-tab__num mono">{s.num}</span>
              <span className="study-tab__label">{t(s.labelKey)}</span>
              {badge && <span className="study-tab__badge">{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div id="study-stage" ref={bodyRef} className="study__body" role="tabpanel" aria-labelledby={`study-tab-${stage.id}`} tabIndex={-1}>
        <Stage key={stage.id} node={node} graph={graph} model={model} data={data} study={study} go={go} />
      </div>
    </div>
  );
}
