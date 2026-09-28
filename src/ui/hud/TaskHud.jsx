import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Loader2, X } from "lucide-react";
import { cancelTask, dismissTask, useBackgroundTasks } from "../../ai/backgroundTaskManager.js";
import { IconButton } from "../primitives/Button.jsx";
import { toast } from "../state/toastStore.js";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { useT } from "../../i18n/react.js";

const TYPE_KEY = { evaluation: "hud.types.evaluation", pedagogical_harness: "hud.types.pedagogicalHarness" };

// HUD global de tareas de IA en background (US3): visible si hay tareas; avisa al terminar.
export function TaskHud({ model }) {
  const { allTasks } = useBackgroundTasks(model.graphId, null);
  const studyNodeId = useWorkspace((s) => s.study?.nodeId);
  const [open, setOpen] = useState(true);
  const seen = useRef(new Map());
  const t = useT();
  const typeLabel = (task) => t(TYPE_KEY[task.type] ?? "hud.types.fallback");
  // Label from the localized graph when the task belongs to the active one.
  const labelOf = (task) => (task.graphId === model.graphId && model.graph.nodes.find((node) => node.id === task.nodeId)?.label) || task.node?.label || task.nodeId;

  useEffect(() => {
    allTasks.forEach((task) => {
      const prev = seen.current.get(task.id);
      seen.current.set(task.id, task.status);
      if (prev === "running" && task.status === "completed" && task.nodeId !== studyNodeId) {
        toast({ tone: "success", message: t("hud.toastReady", { type: typeLabel(task), label: labelOf(task) }), action: t("common.actions.open"),
          onAction: () => actions.openCard(task.nodeId, { stage: task.type === "evaluation" ? "evaluate" : "paraphrase" }) });
      }
    });
  }, [allTasks, studyNodeId, t]); // eslint-disable-line

  const visible = allTasks.filter((task) => task.status === "running" || task.status === "error" || (task.status === "completed" && Date.now() - (task.completedAt ?? 0) < 60000));
  if (!visible.length) return null;
  const running = visible.filter((task) => task.status === "running").length;
  return (
    <section className={`hud ${open ? "is-open" : ""}`} aria-label={t("hud.region")}>
      <button type="button" className="hud__head" aria-expanded={open} onClick={() => setOpen(!open)}>
        {running ? <Loader2 size={14} strokeWidth={1.5} className="spin" aria-hidden="true" /> : <Check size={14} strokeWidth={2} aria-hidden="true" />}
        <span>{running ? t("hud.running", { n: running }) : t("hud.region")}</span>
        <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{ transform: open ? "none" : "rotate(180deg)" }} />
      </button>
      {open && (
        <ul className="hud__list">
          {visible.map((task) => (
            <li key={task.id} className={`hud__item is-${task.status}`}>
              <button type="button" className="hud__open" onClick={() => task.graphId === model.graphId && actions.openCard(task.nodeId, { stage: task.type === "evaluation" ? "evaluate" : "mentor" })}>
                <span className="hud__title clamp-1">{labelOf(task)}</span>
                <span className="hud__sub t3">
                  {task.status === "error" ? <><AlertCircle size={12} aria-hidden="true" /> {task.error ?? t("hud.status.failed")}</>
                    : t(task.status === "completed" ? "hud.status.ready" : task.progress ? "hud.status.progress" : "hud.status.starting", { type: typeLabel(task), n: task.progress })}
                </span>
              </button>
              <IconButton icon={X} label={t(task.status === "running" ? "hud.cancelTask" : "hud.dismiss")} onClick={() => (task.status === "running" ? cancelTask(task.graphId, task.nodeId) : dismissTask(task.graphId, task.nodeId))} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
