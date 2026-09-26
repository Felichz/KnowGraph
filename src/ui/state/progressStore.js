import { listAllAttempts, listAllDrafts } from "../../ai/learningStore.js";
import { selectRepresentativeAttempt } from "../../ai/attemptSelection.js";
import { getScoreView } from "../../ai/types.js";
import { subscribeToTasks, getTasksSnapshot } from "../../ai/backgroundTaskManager.js";

// Progreso por grafo con la regla de dominio unificada (spec 002 §4.1).
const cache = new Map(); // graphId -> { status, error, attempts, drafts, nodes }
const listeners = new Set();
const EMPTY = { status: "loading", error: null, attempts: {}, drafts: {}, nodes: {} };

function emit() { listeners.forEach((fn) => fn()); }
export function subscribeProgress(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function getProgress(graphId) { return cache.get(graphId) ?? EMPTY; }

export function nodeProgress(attempts = [], draft = null) {
  const representative = selectRepresentativeAttempt(attempts) ?? null;
  const scoreView = getScoreView(representative?.evaluation) ?? null;
  const harnessDone = Boolean(draft?.harnessPassedThreshold || (draft?.harnessScore ?? 0) >= 95);
  const isComplete = attempts.some((attempt) => getScoreView(attempt.evaluation)?.isMastery) || harnessDone;
  const displayScore = scoreView?.displayScore ?? (harnessDone ? 100 : null);
  return {
    attempts, representative, scoreView, displayScore, isComplete,
    status: scoreView?.status ?? (harnessDone ? "strong" : null),
    hasDraft: Boolean(draft?.text?.trim()),
    isAiGenerated: Boolean(representative?.isAiGenerated || draft?.isAiGenerated),
    draft,
  };
}

export async function refreshProgress(graphId) {
  const prev = cache.get(graphId);
  if (!prev) cache.set(graphId, { ...EMPTY });
  try {
    const [allAttempts, allDrafts] = await Promise.all([listAllAttempts(), listAllDrafts()]);
    const attempts = {};
    allAttempts.filter((a) => a.graphId === graphId).forEach((a) => { (attempts[a.nodeId] ??= []).push(a); });
    const drafts = {};
    allDrafts.forEach((record) => {
      const [g, nodeId] = String(record.key ?? "").split(":");
      if (g === graphId && nodeId) drafts[nodeId] = typeof record === "string" ? { text: record } : record;
    });
    const ids = new Set([...Object.keys(attempts), ...Object.keys(drafts)]);
    const nodes = {};
    ids.forEach((id) => { nodes[id] = nodeProgress(attempts[id], drafts[id]); });
    cache.set(graphId, { status: "ready", error: null, attempts, drafts, nodes });
  } catch (error) {
    cache.set(graphId, { ...EMPTY, status: "error", error: error?.message ?? "Error de almacenamiento" });
  }
  emit();
}

// Refresca cuando una tarea de IA termina (evaluación o harness).
let lastDone = new Set();
subscribeToTasks(() => {
  const done = new Set();
  getTasksSnapshot().forEach((task) => { if (task.status === "completed") done.add(`${task.cardKey}:${task.completedAt}`); });
  const fresh = [...done].filter((key) => !lastDone.has(key));
  lastDone = done;
  const graphs = new Set(fresh.map((key) => key.split(":")[0]));
  graphs.forEach((graphId) => refreshProgress(graphId));
});
