import { Loader2, X } from "lucide-react";
import { Button } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";

const clean = (text = "") => String(text).replace(/^[\p{Extended_Pictographic}\s]+/u, "");

// Estado de una tarea de IA en background para la card abierta.
export function TaskStatus({ task, onCancel, onDismiss, onRetry }) {
  if (!task) return null;
  if (task.status === "running") {
    const iter = task.type === "pedagogical_harness" && task.iteration ? ` · iteración ${task.iteration}/${task.maxIterations}` : "";
    return (
      <div className="task-status" role="status" aria-live="polite">
        <Loader2 size={16} strokeWidth={1.5} className="spin" aria-hidden="true" />
        <div className="task-status__text">
          <p>{clean(task.message)}{iter}</p>
          <p className="t3 mono">{task.progress ? `${task.progress.toLocaleString("es-AR")} caracteres recibidos` : "Esperando respuesta del modelo…"}</p>
        </div>
        <Button variant="ghost" size="sm" icon={X} onClick={onCancel}>Cancelar</Button>
      </div>
    );
  }
  if (task.status === "error") {
    return (
      <Notice tone="error" action={<div className="task-status__actions">{onRetry && <Button size="sm" onClick={onRetry}>Reintentar</Button>}<Button size="sm" variant="ghost" onClick={onDismiss}>Descartar</Button></div>}>
        {task.error || "La tarea de IA falló."} Revisá que el gateway esté corriendo o tu conexión de IA en Ajustes.
      </Notice>
    );
  }
  if (task.status === "cancelled") {
    return <Notice tone="info" action={<Button size="sm" variant="ghost" onClick={onDismiss}>Ocultar</Button>}>Tarea cancelada.</Notice>;
  }
  return null;
}
