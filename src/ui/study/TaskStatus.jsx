import { Loader2, X } from "lucide-react";
import { useLocale, useT } from "../../i18n/react.js";
import { formatNumber } from "../../i18n/translate.js";
import { Button } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";

const clean = (text = "") => String(text).replace(/^[\p{Extended_Pictographic}\s]+/u, "");

// Estado de una tarea de IA en background para la card abierta.
export function TaskStatus({ task, onCancel, onDismiss, onRetry }) {
  const t = useT();
  const locale = useLocale();
  if (!task) return null;
  if (task.status === "running") {
    const iter = task.type === "pedagogical_harness" && task.iteration ? ` · ${t("study.task.iteration", { n: task.iteration, max: task.maxIterations })}` : "";
    return (
      <div className="task-status" role="status" aria-live="polite">
        <Loader2 size={16} strokeWidth={1.5} className="spin" aria-hidden="true" />
        <div className="task-status__text">
          <p>{clean(task.message)}{iter}</p>
          <p className="t3 mono">{task.progress ? t("study.task.received", { n: formatNumber(task.progress, locale) }) : t("study.task.waiting")}</p>
        </div>
        <Button variant="ghost" size="sm" icon={X} onClick={onCancel}>{t("common.actions.cancel")}</Button>
      </div>
    );
  }
  if (task.status === "error") {
    return (
      <Notice tone="error" action={<div className="task-status__actions">{onRetry && <Button size="sm" onClick={onRetry}>{t("common.actions.retry")}</Button>}<Button size="sm" variant="ghost" onClick={onDismiss}>{t("study.task.dismiss")}</Button></div>}>
        {task.error || t("study.task.failed")} {t("study.task.checkGateway")}
      </Notice>
    );
  }
  if (task.status === "cancelled") {
    return <Notice tone="info" action={<Button size="sm" variant="ghost" onClick={onDismiss}>{t("study.task.hide")}</Button>}>{t("study.task.cancelled")}</Notice>;
  }
  return null;
}
