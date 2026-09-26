import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Loader2, X } from "lucide-react";
import { cancelTask, dismissTask, useBackgroundTasks } from "../../ai/backgroundTaskManager.js";
import { IconButton } from "../primitives/Button.jsx";
import { toast } from "../state/toastStore.js";
import { actions, useWorkspace } from "../state/useWorkspace.js";

const TYPE = { evaluation: "Evaluación", pedagogical_harness: "Borrador con IA" };

// HUD global de tareas de IA en background (US3): visible si hay tareas; avisa al terminar.
export function TaskHud({ model }) {
  const { allTasks } = useBackgroundTasks(model.graphId, null);
  const studyNodeId = useWorkspace((s) => s.study?.nodeId);
  const [open, setOpen] = useState(true);
  const seen = useRef(new Map());

  useEffect(() => {
    allTasks.forEach((task) => {
      const prev = seen.current.get(task.id);
      seen.current.set(task.id, task.status);
      if (prev === "running" && task.status === "completed" && task.nodeId !== studyNodeId) {
        toast({ tone: "success", message: `${TYPE[task.type] ?? "Tarea"} lista: ${task.node?.label ?? task.nodeId}`, action: "Abrir",
          onAction: () => actions.openCard(task.nodeId, { stage: task.type === "evaluation" ? "evaluate" : "paraphrase" }) });
      }
    });
  }, [allTasks, studyNodeId]);

  const visible = allTasks.filter((t) => t.status === "running" || t.status === "error" || (t.status === "completed" && Date.now() - (t.completedAt ?? 0) < 60000));
  if (!visible.length) return null;
  const running = visible.filter((t) => t.status === "running").length;
  return (
    <section className={`hud ${open ? "is-open" : ""}`} aria-label="Tareas de IA">
      <button type="button" className="hud__head" aria-expanded={open} onClick={() => setOpen(!open)}>
        {running ? <Loader2 size={14} strokeWidth={1.5} className="spin" aria-hidden="true" /> : <Check size={14} strokeWidth={2} aria-hidden="true" />}
        <span>{running ? `${running} tarea${running > 1 ? "s" : ""} de IA en curso` : "Tareas de IA"}</span>
        <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{ transform: open ? "none" : "rotate(180deg)" }} />
      </button>
      {open && (
        <ul className="hud__list">
          {visible.map((task) => (
            <li key={task.id} className={`hud__item is-${task.status}`}>
              <button type="button" className="hud__open" onClick={() => task.graphId === model.graphId && actions.openCard(task.nodeId, { stage: task.type === "evaluation" ? "evaluate" : "mentor" })}>
                <span className="hud__title clamp-1">{task.node?.label ?? task.nodeId}</span>
                <span className="hud__sub t3">
                  {task.status === "error" ? <><AlertCircle size={12} aria-hidden="true" /> {task.error ?? "Falló"}</> : task.status === "completed" ? `${TYPE[task.type]} · lista` : `${TYPE[task.type]} · ${task.progress ? `${task.progress} car.` : "iniciando"}`}
                </span>
              </button>
              <IconButton icon={X} label={task.status === "running" ? "Cancelar tarea" : "Descartar"} onClick={() => (task.status === "running" ? cancelTask(task.graphId, task.nodeId) : dismissTask(task.graphId, task.nodeId))} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
