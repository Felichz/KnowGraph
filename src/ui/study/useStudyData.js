import { useCallback, useEffect, useRef, useState } from "react";
import { getDraftRecord, listAttempts, setDraft } from "../../ai/learningStore.js";
import { hashCardContent } from "../../ai/contentHash.js";
import { useBackgroundTasks } from "../../ai/backgroundTaskManager.js";
import { refreshProgress } from "../state/progressStore.js";
import { useProviderProfile } from "../hooks/useProviderLabel.js";

// Datos de la sesión de estudio: borrador (autosave 400 ms), intentos, tarea de IA y conexión activa.
export function useStudyData(graphId, node) {
  const [draft, setDraftText] = useState("");
  const [draftMeta, setDraftMeta] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const timer = useRef(null);
  const tasks = useBackgroundTasks(graphId, node.id);
  const provider = useProviderProfile();
  const contentHash = hashCardContent(node);

  const reload = useCallback(async () => {
    const [record, list] = await Promise.all([getDraftRecord(graphId, node.id), listAttempts(graphId, node.id)]);
    return { record, list: list ?? [] };
  }, [graphId, node.id]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    reload().then(({ record, list }) => {
      if (!alive) return;
      setDraftText(record?.text ?? "");
      setDraftMeta(record ?? null);
      setAttempts(list);
    }).catch(() => {}).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; clearTimeout(timer.current); };
  }, [reload]);

  // Al terminar una tarea (evaluación o harness) recargamos intentos y borrador.
  const task = tasks.currentTask;
  const doneKey = task?.status === "completed" ? `${task.id}:${task.completedAt}` : null;
  useEffect(() => {
    if (!doneKey) return;
    reload().then(({ record, list }) => {
      setAttempts(list);
      if (task.type === "pedagogical_harness" && record?.text) { setDraftText(record.text); setDraftMeta(record); }
    }).catch(() => {});
  }, [doneKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateDraft = useCallback((text, options) => {
    setDraftText(text);
    setSaveState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDraft(graphId, node.id, text, options)
        .then(() => { setSaveState("saved"); refreshProgress(graphId); })
        .catch(() => setSaveState("error"));
    }, 400);
  }, [graphId, node.id]);

  const evaluate = useCallback(() => tasks.startEvaluation({
    node, answer: draft, contentHash, providerProfile: provider,
    isDraftAiGenerated: Boolean(draftMeta?.isAiGenerated),
  }), [tasks, node, draft, contentHash, provider, draftMeta]);

  const runHarness = useCallback(() => tasks.startHarness({ node, initialDraft: draft, providerProfile: provider }), [tasks, node, draft, provider]);

  return {
    draft, draftMeta, updateDraft, saveState, attempts, loading, task, contentHash, provider,
    evaluate, runHarness, cancelTask: () => tasks.cancelTask(), dismissTask: () => tasks.dismissTask(),
  };
}
