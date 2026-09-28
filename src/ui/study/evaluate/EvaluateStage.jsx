import { ClipboardCheck, PenLine, RotateCcw } from "lucide-react";
import { useT } from "../../../i18n/react.js";
import { Button } from "../../primitives/Button.jsx";
import { EmptyState } from "../../primitives/Feedback.jsx";
import { actions } from "../../state/useWorkspace.js";
import { TaskStatus } from "../TaskStatus.jsx";
import { EvaluationResult } from "./EvaluationResult.jsx";
import { AttemptHistory } from "./AttemptHistory.jsx";

// 04 Evaluar: evaluación 0–120 en background, resultado con rúbrica e historial de intentos.
export function EvaluateStage({ data, study, go }) {
  const t = useT();
  const evalTask = data.task?.type === "evaluation" ? data.task : null;
  const running = evalTask?.status === "running";
  const attempts = data.attempts;
  const selected = attempts.find((a) => a.id === study.attemptId) ?? attempts.at(-1) ?? null;
  const hasDraft = data.draft.trim().length >= 20;
  const draftChanged = selected && selected.answer?.trim() !== data.draft.trim();

  if (!hasDraft && !attempts.length) {
    return (
      <div className="stage stage--evaluate">
        <EmptyState icon={PenLine} title={t("study.evaluate.emptyTitle")} action={<Button variant="primary" onClick={() => go("paraphrase")}>{t("study.goParaphrase")}</Button>}>
          {t("study.evaluate.emptyBody")}
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="stage stage--evaluate">
      <section className="eval-main">
        <div className="eval-launch">
          <div>
            <h2 className="stage__title">{attempts.length ? t("study.evaluate.titleResult") : t("study.evaluate.titleNew")}</h2>
            <p className="t2">{t("study.evaluate.scale")}</p>
          </div>
          {!running && hasDraft && (
            <Button variant={attempts.length && !draftChanged ? "secondary" : "primary"} icon={attempts.length ? RotateCcw : ClipboardCheck} onClick={data.evaluate}>
              {attempts.length ? (draftChanged ? t("study.evaluate.evaluateNewVersion") : t("study.evaluate.reevaluate")) : t("study.evaluate.evaluateNow")}
            </Button>
          )}
        </div>
        <TaskStatus task={evalTask} onCancel={data.cancelTask} onDismiss={data.dismissTask} onRetry={data.evaluate} />
        {running && evalTask.streamingSections?.conciseVerdict && (
          <p className="eval-preview serif">{String(evalTask.streamingSections.conciseVerdict)}</p>
        )}
        {selected ? (
          <EvaluationResult attempt={selected} contentHash={data.contentHash} isLatest={selected === attempts.at(-1)} />
        ) : !running && (
          <div className="eval-draft">
            <span className="eyebrow">{t("study.evaluate.willEvaluate")}</span>
            <p className="eval-draft__text">{data.draft}</p>
          </div>
        )}
        {selected && (
          <div className="eval-next">
            <Button variant="secondary" icon={PenLine} onClick={() => go("paraphrase")}>{t("study.evaluate.improve")}</Button>
            <Button variant="ghost" onClick={actions.closeCard}>{t("study.backToMap")}</Button>
          </div>
        )}
      </section>
      {attempts.length > 0 && <AttemptHistory attempts={attempts} selectedId={selected?.id} onSelect={actions.selectAttempt} />}
    </div>
  );
}
