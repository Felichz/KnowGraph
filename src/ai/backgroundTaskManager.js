import { useEffect, useState } from "react";
import {
  evaluateParaphraseStream,
  isCancel,
  judgePedagogy,
  polishParaphraseStream,
  refinePedagogyStream,
  userFacingAiError,
} from "./client.js";
import { saveAttempt, setDraft } from "./learningStore.js";

// Global in-memory map of tasks keyed by `${graphId}:${nodeId}`
const tasksMap = new Map();
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(tasksMap);
    } catch (e) {
      console.error("[backgroundTaskManager] listener error:", e);
    }
  });
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
    task.status = "cancelled";
    task.stage = "cancelled";
    task.message = "Cancelado por el usuario";
    task.completedAt = Date.now();
    notifyListeners();
  }
}

export function dismissTask(graphId, nodeId) {
  const cardKey = `${graphId}:${nodeId}`;
  const task = tasksMap.get(cardKey);
  if (task && task.status !== "running") {
    tasksMap.delete(cardKey);
    notifyListeners();
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

  const task = {
    id: taskId,
    graphId,
    nodeId: node.id,
    cardKey,
    node,
    type: "pedagogical_harness",
    status: "running",
    stage: "init",
    message: "Iniciando Harness Pedagógico...",
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

  tasksMap.set(cardKey, task);
  notifyListeners();
  onUpdate?.(task);

  // Background async loop
  (async () => {
    let currentDraft = initialDraft.trim();
    try {
      // Step 0: If draft is empty or very short, generate initial draft with IA
      if (!currentDraft || currentDraft.length < 15) {
        task.stage = "generating_initial";
        task.message = "🪄 Generando borrador inicial con IA...";
        task.updatedAt = Date.now();
        notifyListeners();
        onUpdate?.(task);

        let initAcc = "";
        const genRes = await polishParaphraseStream({
          node,
          currentDraft: "",
          provider: providerProfile,
          signal: controller.signal,
          onDelta: (delta) => {
            initAcc += delta;
            task.draft = initAcc;
            task.progress = initAcc.length;
            task.updatedAt = Date.now();
            setDraft(graphId, node.id, initAcc, {
              isAiGenerated: true,
              generatedAt: new Date().toISOString(),
            });
            notifyListeners();
            onUpdate?.(task);
          },
        });
        currentDraft = (genRes.text || initAcc).trim();
        task.draft = currentDraft;
        await setDraft(graphId, node.id, currentDraft, {
          isAiGenerated: true,
          generatedAt: new Date().toISOString(),
        });
        notifyListeners();
        onUpdate?.(task);
      }

      // Step 1: Initial Judge QA Evaluation
      task.stage = "judging";
      task.iteration = 0;
      task.message = "⚖️ Evaluando calidad pedagógica inicial con Juez...";
      task.updatedAt = Date.now();
      notifyListeners();
      onUpdate?.(task);

      let judgeResult = await judgePedagogy({
        node,
        draft: currentDraft,
        provider: providerProfile,
        signal: controller.signal,
      });

      task.score = judgeResult.score;
      task.rubric = judgeResult.rubric;
      task.critique = judgeResult.pedagogicalCritique || [];
      task.passedThreshold = judgeResult.passedThreshold;
      task.history = [
        {
          iteration: 0,
          score: judgeResult.score,
          rubric: judgeResult.rubric,
          verdict: judgeResult.verdict,
          critique: judgeResult.pedagogicalCritique || [],
          draft: currentDraft,
        },
      ];
      task.updatedAt = Date.now();
      notifyListeners();
      onUpdate?.(task);

      let iter = 0;
      while (!judgeResult.passedThreshold && iter < maxIterations) {
        iter += 1;
        task.iteration = iter;
        task.stage = "refining";
        task.message = `🪄 Refinando explicación según crítica del Juez (Iteración ${iter}/${maxIterations})...`;
        task.updatedAt = Date.now();
        notifyListeners();
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
            task.draft = refinedAcc;
            task.progress = refinedAcc.length;
            task.updatedAt = Date.now();
            setDraft(graphId, node.id, refinedAcc, {
              isAiGenerated: true,
              generatedAt: new Date().toISOString(),
            });
            notifyListeners();
            onUpdate?.(task);
          },
        });

        currentDraft = (refineRes.text || refinedAcc).trim();
        task.draft = currentDraft;
        await setDraft(graphId, node.id, currentDraft, {
          isAiGenerated: true,
          generatedAt: new Date().toISOString(),
        });

        // Re-judge
        task.stage = "judging";
        task.message = `⚖️ Re-evaluando calidad pedagógica (Iteración ${iter}/${maxIterations})...`;
        task.updatedAt = Date.now();
        notifyListeners();
        onUpdate?.(task);

        judgeResult = await judgePedagogy({
          node,
          draft: currentDraft,
          provider: providerProfile,
          signal: controller.signal,
        });

        task.score = judgeResult.score;
        task.rubric = judgeResult.rubric;
        task.critique = judgeResult.pedagogicalCritique || [];
        task.passedThreshold = judgeResult.passedThreshold;
        task.history = [
          ...task.history,
          {
            iteration: iter,
            score: judgeResult.score,
            rubric: judgeResult.rubric,
            verdict: judgeResult.verdict,
            critique: judgeResult.pedagogicalCritique || [],
            draft: currentDraft,
          },
        ];
        task.updatedAt = Date.now();
        notifyListeners();
        onUpdate?.(task);
      }

      // Success / Done
      task.status = "completed";
      task.stage = "done";
      task.completedAt = Date.now();
      task.message = judgeResult.passedThreshold
        ? `✨ ¡Maestría pedagógica alcanzada (${judgeResult.score}/100)!`
        : `Límite de ${maxIterations} iteraciones alcanzado (Puntaje: ${judgeResult.score}/100)`;
      notifyListeners();
      onUpdate?.(task);
    } catch (err) {
      if (controller.signal.aborted || isCancel(err)) {
        task.status = "cancelled";
        task.stage = "cancelled";
        task.message = "Cancelado por el usuario";
      } else {
        task.status = "error";
        task.stage = "error";
        task.error = userFacingAiError(err, "No se pudo completar el perfeccionamiento pedagógico.");
        task.message = task.error;
      }
      task.completedAt = Date.now();
      notifyListeners();
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

  const task = {
    id: taskId,
    graphId,
    nodeId: node.id,
    cardKey,
    node,
    type: "evaluation",
    status: "running",
    stage: "evaluating",
    message: "🧠 Evaluando tu explicación con IA...",
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

  tasksMap.set(cardKey, task);
  notifyListeners();
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
          task.progress = length;
          task.updatedAt = Date.now();
          notifyListeners();
          onUpdate?.(task);
        },
        onSection: (field, value) => {
          task.streamingSections = { ...task.streamingSections, [field]: value };
          task.updatedAt = Date.now();
          notifyListeners();
          onUpdate?.(task);
        },
        onReset: (fallback) => {
          const preserveScores = fallback?.scope === "feedback";
          task.progress = 0;
          task.streamingSections = preserveScores && task.streamingSections.scoreSummary
            ? { scoreSummary: task.streamingSections.scoreSummary }
            : {};
          task.streamingBlocks = preserveScores
            ? Object.fromEntries(Object.entries(task.streamingBlocks).filter(([id]) => id.startsWith("scoreSummary.")))
            : {};
          task.updatedAt = Date.now();
          notifyListeners();
          onUpdate?.(task);
        },
        onBlock: (block) => {
          task.streamingBlocks = { ...task.streamingBlocks, [block.id]: { ...task.streamingBlocks[block.id], ...block } };
          task.updatedAt = Date.now();
          notifyListeners();
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
      task.attempt = attempt;
      task.status = "completed";
      task.stage = "done";
      task.completedAt = Date.now();
      task.message = "Evaluación completada";
      notifyListeners();
      onUpdate?.(task);
      onAttemptSaved?.(attempt);
    } catch (err) {
      if (controller.signal.aborted || isCancel(err)) {
        task.status = "cancelled";
        task.stage = "cancelled";
        task.message = "Evaluación cancelada";
      } else {
        task.status = "error";
        task.stage = "error";
        task.error = userFacingAiError(err, "No se pudo completar la evaluación.");
        task.message = task.error;
      }
      task.completedAt = Date.now();
      notifyListeners();
      onUpdate?.(task);
    }
  })();

  return task;
}

export function useBackgroundTasks(graphId, nodeId) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const cardKey = graphId && nodeId ? `${graphId}:${nodeId}` : null;
  const currentTask = cardKey ? tasksMap.get(cardKey) ?? null : null;
  const allTasks = Array.from(tasksMap.values());
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
