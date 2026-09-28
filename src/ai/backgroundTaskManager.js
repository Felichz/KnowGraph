import { useSyncExternalStore } from "react";
import {
  evaluateParaphraseStream,
  isCancel,
  judgePedagogy,
  polishParaphraseStream,
  refinePedagogyStream,
  userFacingAiError,
} from "./client.js";
import { saveAttempt, saveCoachIteration, setDraft } from "./learningStore.js";
import { hashAnswer, hashCardContent } from "./contentHash.js";
import { t } from "../i18n/translate.js";

// Global in-memory map of tasks keyed by `${graphId}:${nodeId}`
const tasksMap = new Map();
let tasksSnapshot = new Map();
const listeners = new Set();
const ACTIVE_TASKS_STORAGE_KEY = "knowgraph_active_tasks";

// Cross-tab broadcast channel for reactive multi-tab task synchronization
export const taskSyncChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("knowgraph_tasks_sync")
    : null;

if (taskSyncChannel?.unref) {
  taskSyncChannel.unref();
}

function sanitizeTaskForBroadcast(task) {
  if (!task) return null;
  return {
    id: task.id,
    graphId: task.graphId,
    nodeId: task.nodeId,
    cardKey: task.cardKey,
    type: task.type,
    status: task.status,
    stage: task.stage,
    message: task.message,
    progress: task.progress,
    draft: task.draft,
    score: task.score,
    rubric: task.rubric,
    critique: task.critique,
    history: task.history,
    passedThreshold: task.passedThreshold,
    iteration: task.iteration,
    streamingSections: task.streamingSections,
    streamingBlocks: task.streamingBlocks,
    attempt: task.attempt,
    error: task.error,
    startedAt: task.startedAt,
    updatedAt: task.updatedAt,
    completedAt: task.completedAt,
  };
}

function persistActiveTasksLocally() {
  if (typeof localStorage === "undefined") return;
  try {
    const runningTasks = Array.from(tasksMap.values())
      .filter((t) => t.status === "running")
      .map(sanitizeTaskForBroadcast);
    if (runningTasks.length > 0) {
      localStorage.setItem(ACTIVE_TASKS_STORAGE_KEY, JSON.stringify(runningTasks));
    } else {
      localStorage.removeItem(ACTIVE_TASKS_STORAGE_KEY);
    }
  } catch {
    // ignore storage quota errors
  }
}

function hydrateFromLocalStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(ACTIVE_TASKS_STORAGE_KEY);
    if (!raw) return;
    const tasks = JSON.parse(raw);
    if (Array.isArray(tasks)) {
      const now = Date.now();
      tasks.forEach((task) => {
        if (
          task &&
          task.cardKey &&
          task.status === "running" &&
          now - (task.updatedAt || task.startedAt || 0) < 600_000
        ) {
          tasksMap.set(task.cardKey, task);
        }
      });
      tasksSnapshot = new Map(tasksMap);
    }
  } catch {
    // ignore parse errors
  }
}

// Initial synchronous hydration on module evaluation
hydrateFromLocalStorage();

function notifyListeners(broadcast = true, mutationData = null) {
  tasksSnapshot = new Map(tasksMap);
  persistActiveTasksLocally();
  listeners.forEach((listener) => {
    try {
      listener(tasksSnapshot);
    } catch (e) {
      console.error("[backgroundTaskManager] listener error:", e);
    }
  });

  if (broadcast && taskSyncChannel && mutationData) {
    try {
      taskSyncChannel.postMessage(mutationData);
    } catch (e) {
      console.warn("[backgroundTaskManager] broadcast error:", e);
    }
  }
}

if (taskSyncChannel) {
  // Request active tasks from any other open tab
  try {
    taskSyncChannel.postMessage({ type: "SYNC_REQUEST" });
  } catch (e) {
    // ignore
  }

  taskSyncChannel.onmessage = (event) => {
    const data = event?.data;
    if (!data || !data.type) return;

    if (data.type === "SYNC_REQUEST") {
      const running = Array.from(tasksMap.values()).map(sanitizeTaskForBroadcast);
      if (running.length > 0) {
        taskSyncChannel.postMessage({ type: "SYNC_RESPONSE", tasks: running });
      }
    } else if (data.type === "SYNC_RESPONSE" && Array.isArray(data.tasks)) {
      let changed = false;
      data.tasks.forEach((task) => {
        if (task && task.cardKey) {
          const existing = tasksMap.get(task.cardKey);
          const abortController = existing?.abortController;
          if (!existing || (task.updatedAt || 0) >= (existing.updatedAt || 0)) {
            tasksMap.set(task.cardKey, { ...task, abortController });
            changed = true;
          }
        }
      });
      if (changed) {
        notifyListeners(false);
      }
    } else if (data.type === "TASK_MUTATION" && data.cardKey && data.task) {
      const existing = tasksMap.get(data.cardKey);
      const abortController = existing?.abortController;
      if (!existing || (data.task.updatedAt || 0) >= (existing.updatedAt || 0)) {
        tasksMap.set(data.cardKey, { ...data.task, abortController });
        notifyListeners(false);
      }
    } else if (data.type === "TASK_CANCEL" && data.cardKey) {
      const task = tasksMap.get(data.cardKey);
      if (task && task.status === "running") {
        if (task.abortController) {
          task.abortController.abort();
        }
        updateTaskState(
          data.cardKey,
          task,
          {
            status: "cancelled",
            stage: "cancelled",
            message: t("ai.tasks.cancelledByUser"),
            completedAt: Date.now(),
          },
          false
        );
      }
    } else if (data.type === "TASK_DISMISS" && data.cardKey) {
      if (tasksMap.has(data.cardKey)) {
        tasksMap.delete(data.cardKey);
        notifyListeners(false);
      }
    }
  };
}

function updateTaskState(cardKey, task, updates = {}, broadcast = true) {
  Object.assign(task, updates, { updatedAt: Date.now() });
  const snapshot = { ...task };
  tasksMap.set(cardKey, snapshot);
  notifyListeners(broadcast, {
    type: "TASK_MUTATION",
    cardKey,
    task: sanitizeTaskForBroadcast(snapshot),
  });
  return snapshot;
}

export function subscribeToTasks(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getTasksSnapshot() {
  return tasksSnapshot;
}

export function getTask(graphId, nodeId) {
  if (!graphId || !nodeId) return null;
  return tasksMap.get(`${graphId}:${nodeId}`) ?? null;
}

export function getAllTasks() {
  return Array.from(tasksMap.values());
}

export function getActiveTasks() {
  return Array.from(tasksMap.values()).filter((t) => t.status === "running");
}

export function getActiveTaskNodeIds(graphId) {
  const set = new Set();
  tasksMap.forEach((task) => {
    if (task.status === "running" && (!graphId || task.graphId === graphId)) {
      set.add(task.nodeId);
    }
  });
  return set;
}

export function cancelTask(graphId, nodeId) {
  const cardKey = typeof nodeId === "string" ? `${graphId}:${nodeId}` : graphId;
  const task = tasksMap.get(cardKey);
  if (task && task.status === "running") {
    if (task.abortController) {
      task.abortController.abort();
    }
    updateTaskState(
      cardKey,
      task,
      {
        status: "cancelled",
        stage: "cancelled",
        message: t("ai.tasks.cancelledByUser"),
        completedAt: Date.now(),
      },
      true
    );
  } else if (taskSyncChannel) {
    taskSyncChannel.postMessage({ type: "TASK_CANCEL", cardKey });
  }
}

export function dismissTask(graphId, nodeId) {
  const cardKey = `${graphId}:${nodeId}`;
  const task = tasksMap.get(cardKey);
  if (task && task.status !== "running") {
    tasksMap.delete(cardKey);
    notifyListeners(true, { type: "TASK_DISMISS", cardKey });
  }
}

export async function startPedagogicalHarness({
  graphId,
  node,
  initialDraft = "",
  providerProfile,
  maxIterations = 6,
  onUpdate,
}) {
  if (!node || !node.id) return null;
  const cardKey = `${graphId}:${node.id}`;

  // Cancel any existing task on this card
  cancelTask(graphId, node.id);

  const controller = new AbortController();
  const taskId = `harness-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  let task = {
    id: taskId,
    graphId,
    nodeId: node.id,
    cardKey,
    node,
    type: "pedagogical_harness",
    status: "running",
    stage: "init",
    message: t("ai.tasks.harnessStarting"),
    progress: 0,
    draft: initialDraft,
    initialDraft,
    score: null,
    rubric: null,
    critique: [],
    history: [],
    iteration: 0,
    maxIterations,
    passedThreshold: false,
    error: null,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    abortController: controller,
  };

  task = updateTaskState(cardKey, task);
  onUpdate?.(task);

  // Background async loop
  (async () => {
    let currentDraft = initialDraft.trim();
    try {
      // Step 0: If draft is empty or very short, generate initial draft with IA
      if (!currentDraft || currentDraft.length < 15) {
        task = updateTaskState(cardKey, task, {
          stage: "generating_initial",
          message: t("ai.tasks.generatingDraft"),
        });
        onUpdate?.(task);

        let initAcc = "";
        const genRes = await polishParaphraseStream({
          node,
          currentDraft: "",
          provider: providerProfile,
          signal: controller.signal,
          onDelta: (delta) => {
            initAcc += delta;
            task = updateTaskState(cardKey, task, {
              draft: initAcc,
              progress: initAcc.length,
            });
            setDraft(graphId, node.id, initAcc, {
              isAiGenerated: true,
              generatedAt: new Date().toISOString(),
            });
            onUpdate?.(task);
          },
        });
        currentDraft = (genRes.text || initAcc).trim();
        task = updateTaskState(cardKey, task, { draft: currentDraft });
        await setDraft(graphId, node.id, currentDraft, {
          isAiGenerated: true,
          generatedAt: new Date().toISOString(),
        });
        onUpdate?.(task);
      }

      // Step 1: Initial Judge QA Evaluation
      task = updateTaskState(cardKey, task, {
        stage: "judging",
        iteration: 0,
        message: t("ai.tasks.judgingInitial"),
      });
      onUpdate?.(task);

      let judgeResult = await judgePedagogy({
        node,
        draft: currentDraft,
        provider: providerProfile,
        signal: controller.signal,
      });

      const initialHistory = [
        {
          iteration: 0,
          score: judgeResult.score,
          rubric: judgeResult.rubric,
          verdict: judgeResult.verdict,
          critique: judgeResult.pedagogicalCritique || [],
          draft: currentDraft,
        },
      ];

      task = updateTaskState(cardKey, task, {
        score: judgeResult.score,
        rubric: judgeResult.rubric,
        critique: judgeResult.pedagogicalCritique || [],
        passedThreshold: judgeResult.passedThreshold,
        history: initialHistory,
        message: judgeResult.passedThreshold
          ? t("ai.tasks.mastery", { score: judgeResult.score })
          : t("ai.tasks.judgeScore", { score: judgeResult.score }),
      });
      onUpdate?.(task);

      // Persist iteration 0
      await saveCoachIteration({
        id: `harness_${taskId}_0`,
        graphId,
        nodeId: node.id,
        answer: currentDraft,
        answerHash: hashAnswer(currentDraft),
        contentHash: hashCardContent(node),
        source: "pedagogical_refiner",
        isPedagogicalRefiner: true,
        iteration: 0,
        harnessSessionId: taskId,
        score: judgeResult.score,
        rubric: judgeResult.rubric,
        verdict: judgeResult.verdict,
        pedagogicalCritique: judgeResult.pedagogicalCritique || [],
        passedThreshold: judgeResult.passedThreshold,
        createdAt: new Date().toISOString(),
      }).catch(() => {});

      let iter = 0;
      let historyList = [...initialHistory];

      while (!judgeResult.passedThreshold && iter < maxIterations) {
        iter += 1;
        task = updateTaskState(cardKey, task, {
          iteration: iter,
          stage: "refining",
          message: t("ai.tasks.refining", { iter, max: maxIterations }),
        });
        onUpdate?.(task);

        let refinedAcc = "";
        const refineRes = await refinePedagogyStream({
          node,
          draft: currentDraft,
          critique: judgeResult.pedagogicalCritique || [],
          currentScore: judgeResult.score,
          provider: providerProfile,
          signal: controller.signal,
          onDelta: (delta) => {
            refinedAcc += delta;
            task = updateTaskState(cardKey, task, {
              draft: refinedAcc,
              progress: refinedAcc.length,
            });
            setDraft(graphId, node.id, refinedAcc, {
              isAiGenerated: true,
              generatedAt: new Date().toISOString(),
            });
            onUpdate?.(task);
          },
        });

        currentDraft = (refineRes.text || refinedAcc).trim();
        task = updateTaskState(cardKey, task, { draft: currentDraft });
        await setDraft(graphId, node.id, currentDraft, {
          isAiGenerated: true,
          generatedAt: new Date().toISOString(),
        });

        // Re-judge
        task = updateTaskState(cardKey, task, {
          stage: "judging",
          message: t("ai.tasks.rejudging", { iter, max: maxIterations }),
        });
        onUpdate?.(task);

        judgeResult = await judgePedagogy({
          node,
          draft: currentDraft,
          provider: providerProfile,
          signal: controller.signal,
        });

        historyList = [
          ...historyList,
          {
            iteration: iter,
            score: judgeResult.score,
            rubric: judgeResult.rubric,
            verdict: judgeResult.verdict,
            critique: judgeResult.pedagogicalCritique || [],
            draft: currentDraft,
          },
        ];

        task = updateTaskState(cardKey, task, {
          score: judgeResult.score,
          rubric: judgeResult.rubric,
          critique: judgeResult.pedagogicalCritique || [],
          passedThreshold: judgeResult.passedThreshold,
          history: historyList,
          message: judgeResult.passedThreshold
            ? t("ai.tasks.mastery", { score: judgeResult.score })
            : t("ai.tasks.judgeScoreIteration", { score: judgeResult.score, iter }),
        });
        onUpdate?.(task);

        // Persist iteration
        await saveCoachIteration({
          id: `harness_${taskId}_${iter}`,
          graphId,
          nodeId: node.id,
          answer: currentDraft,
          answerHash: hashAnswer(currentDraft),
          contentHash: hashCardContent(node),
          source: "pedagogical_refiner",
          isPedagogicalRefiner: true,
          iteration: iter,
          harnessSessionId: taskId,
          score: judgeResult.score,
          rubric: judgeResult.rubric,
          verdict: judgeResult.verdict,
          pedagogicalCritique: judgeResult.pedagogicalCritique || [],
          passedThreshold: judgeResult.passedThreshold,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      }

      // Persist final draft with complete harness metadata
      await setDraft(graphId, node.id, currentDraft, {
        isAiGenerated: true,
        source: "pedagogical_refiner",
        harnessScore: judgeResult.score,
        harnessRubric: judgeResult.rubric,
        harnessCritique: judgeResult.pedagogicalCritique || [],
        harnessHistory: historyList,
        harnessPassedThreshold: judgeResult.passedThreshold,
        generatedAt: new Date().toISOString(),
      }).catch(() => {});

      // Success / Done
      task = updateTaskState(cardKey, task, {
        status: "completed",
        stage: "done",
        completedAt: Date.now(),
        message: judgeResult.passedThreshold
          ? t("ai.tasks.mastery", { score: judgeResult.score })
          : t("ai.tasks.iterationLimit", { max: maxIterations, score: judgeResult.score }),
      });
      onUpdate?.(task);
    } catch (err) {
      if (controller.signal.aborted || isCancel(err)) {
        task = updateTaskState(cardKey, task, {
          status: "cancelled",
          stage: "cancelled",
          message: t("ai.tasks.cancelledByUser"),
          completedAt: Date.now(),
        });
      } else {
        const errorMsg = userFacingAiError(err, t("ai.tasks.harnessFailed"));
        task = updateTaskState(cardKey, task, {
          status: "error",
          stage: "error",
          error: errorMsg,
          message: errorMsg,
          completedAt: Date.now(),
        });
      }
      onUpdate?.(task);
    }
  })();

  return task;
}

export async function startEvaluation({
  graphId,
  node,
  answer,
  contentHash,
  providerProfile,
  isDraftAiGenerated = false,
  onAttemptSaved,
  onUpdate,
}) {
  if (!node || !node.id) return null;
  const cardKey = `${graphId}:${node.id}`;

  cancelTask(graphId, node.id);

  const controller = new AbortController();
  const taskId = `eval-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  let task = {
    id: taskId,
    graphId,
    nodeId: node.id,
    cardKey,
    node,
    type: "evaluation",
    status: "running",
    stage: "evaluating",
    message: t("ai.tasks.evaluating"),
    progress: 0,
    draft: answer,
    streamingSections: {},
    streamingBlocks: {},
    attempt: null,
    error: null,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    abortController: controller,
  };

  task = updateTaskState(cardKey, task);
  onUpdate?.(task);

  (async () => {
    const startedAt = Date.now();
    try {
      const result = await evaluateParaphraseStream({
        graphId,
        nodeId: node.id,
        answer,
        contentHash,
        node,
        provider: providerProfile,
        signal: controller.signal,
        onProgress: (length) => {
          task = updateTaskState(cardKey, task, { progress: length });
          onUpdate?.(task);
        },
        onSection: (field, value) => {
          task = updateTaskState(cardKey, task, {
            streamingSections: { ...task.streamingSections, [field]: value },
          });
          onUpdate?.(task);
        },
        onReset: (fallback) => {
          const preserveScores = fallback?.scope === "feedback";
          task = updateTaskState(cardKey, task, {
            progress: 0,
            streamingSections: preserveScores && task.streamingSections?.scoreSummary
              ? { scoreSummary: task.streamingSections.scoreSummary }
              : {},
            streamingBlocks: preserveScores
              ? Object.fromEntries(Object.entries(task.streamingBlocks || {}).filter(([id]) => id.startsWith("scoreSummary.")))
              : {},
          });
          onUpdate?.(task);
        },
        onBlock: (block) => {
          task = updateTaskState(cardKey, task, {
            streamingBlocks: { ...task.streamingBlocks, [block.id]: { ...(task.streamingBlocks?.[block.id] || {}), ...block } },
          });
          onUpdate?.(task);
        },
      });

      const durationMs = Date.now() - startedAt;
      const attempt = {
        ...result.attempt,
        answer,
        durationMs,
        isAiGenerated: Boolean(isDraftAiGenerated),
      };
      await saveAttempt(attempt);
      task = updateTaskState(cardKey, task, {
        attempt,
        status: "completed",
        stage: "done",
        completedAt: Date.now(),
        message: t("ai.tasks.evaluationDone"),
      });
      onUpdate?.(task);
      onAttemptSaved?.(attempt);
    } catch (err) {
      if (controller.signal.aborted || isCancel(err)) {
        task = updateTaskState(cardKey, task, {
          status: "cancelled",
          stage: "cancelled",
          message: t("ai.tasks.evaluationCancelled"),
          completedAt: Date.now(),
        });
      } else {
        const errorMsg = userFacingAiError(err, t("ai.tasks.evaluationFailed"));
        task = updateTaskState(cardKey, task, {
          status: "error",
          stage: "error",
          error: errorMsg,
          message: errorMsg,
          completedAt: Date.now(),
        });
      }
      onUpdate?.(task);
    }
  })();

  return task;
}

export function useBackgroundTasks(graphId, nodeId) {
  const currentTasksSnapshot = useSyncExternalStore(
    subscribeToTasks,
    getTasksSnapshot,
    getTasksSnapshot
  );

  const cardKey = graphId && nodeId ? `${graphId}:${nodeId}` : null;
  const currentTask = cardKey ? currentTasksSnapshot.get(cardKey) ?? null : null;
  const allTasks = Array.from(currentTasksSnapshot.values());
  const activeTasks = allTasks.filter((t) => t.status === "running");
  const activeTaskNodeIds = getActiveTaskNodeIds(graphId);

  return {
    currentTask,
    allTasks,
    activeTasks,
    activeTaskNodeIds,
    startHarness: (opts) => startPedagogicalHarness({ graphId, node: opts?.node, ...opts }),
    startEvaluation: (opts) => startEvaluation({ graphId, node: opts?.node, ...opts }),
    cancelTask: (targetNodeId) => cancelTask(graphId, targetNodeId || nodeId),
    dismissTask: (targetNodeId) => dismissTask(graphId, targetNodeId || nodeId),
  };
}
