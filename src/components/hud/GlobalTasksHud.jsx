import React, { useEffect, useState } from "react";
import { cancelTask, useBackgroundTasks } from "../../ai/backgroundTaskManager.js";

export function GlobalTasksHud({ activeGraphId = "react", onOpenCard }) {
  const { activeTasks: hookTasks } = useBackgroundTasks(activeGraphId);
  const [localTasks, setLocalTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncStorage = () => {
      try {
        const raw = localStorage.getItem("knowgraph_active_tasks");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setLocalTasks(parsed.filter((t) => t.status === "running"));
            return;
          }
        }
      } catch {}
      setLocalTasks([]);
    };
    syncStorage();
    window.addEventListener("storage", syncStorage);
    const interval = setInterval(syncStorage, 1000);
    return () => { window.removeEventListener("storage", syncStorage); clearInterval(interval); };
  }, []);

  const tasksMap = new Map();
  hookTasks.forEach((t) => tasksMap.set(t.id || t.cardKey, t));
  localTasks.forEach((t) => { if (!tasksMap.has(t.id || t.cardKey)) tasksMap.set(t.id || t.cardKey, t); });
  const tasks = Array.from(tasksMap.values()).filter((t) => t.status === "running");

  if (tasks.length === 0) return null;
  const primaryTask = tasks[0];

  const handleCancel = (e, task) => {
    e.stopPropagation();
    try {
      cancelTask(task.graphId || activeGraphId, task.nodeId);
      const raw = localStorage.getItem("knowgraph_active_tasks");
      if (raw) {
        const parsed = JSON.parse(raw);
        const remaining = parsed.filter((t) => t.id !== task.id && t.nodeId !== task.nodeId);
        if (remaining.length) localStorage.setItem("knowgraph_active_tasks", JSON.stringify(remaining));
        else localStorage.removeItem("knowgraph_active_tasks");
      }
      setLocalTasks((prev) => prev.filter((t) => t.id !== task.id && t.nodeId !== task.nodeId));
    } catch (err) { console.error(err); }
  };

  const handleOpen = (e, task) => {
    e.stopPropagation();
    onOpenCard?.(task.nodeId);
  };

  return (
    <aside
      aria-label="Tareas activas en segundo plano" onClick={() => setIsOpen((prev) => !prev)}
      style={{
        position: "fixed", bottom: "20px", right: "20px", zIndex: 20,
        background: "rgba(21, 27, 37, 0.95)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(94, 234, 212, 0.3)", borderRadius: "10px",
        padding: "10px 14px", boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)", cursor: "pointer", maxWidth: "340px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span className="pulse-dot" />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-brand-primary, #5EEAD4)", textTransform: "uppercase" }}>
          EVALUANDO: {primaryTask.nodeId}
        </span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "auto" }}>
          {primaryTask.progress || 0} chars
        </span>
      </div>

      {isOpen && (
        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border-line-subtle)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <strong style={{ fontSize: "12px", color: "var(--text-primary)" }}>Tarjetas procesando con IA</strong>
          {tasks.map((t) => (
            <div key={t.id || t.nodeId} style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "8px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{t.nodeId}</span>
                <div style={{ color: "var(--color-brand-primary, #5EEAD4)", fontFamily: "var(--font-mono)" }}>{t.progress || 0} chars</div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                <button onClick={(e) => handleCancel(e, t)} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", background: "rgba(239, 68, 68, 0.15)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.3)", cursor: "pointer" }}>
                  Cancelar ✕
                </button>
                <button onClick={(e) => handleOpen(e, t)} style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, background: "var(--color-brand-primary, #5EEAD4)", color: "#0B0D13", cursor: "pointer" }}>
                  Abrir card →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
