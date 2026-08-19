import { useEffect, useState } from "react";
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

function updateTaskState(cardKey, task, updates = {}) {
  Object.assign(task, updates, { updatedAt: Date.now() });
  const snapshot = { ...task };
  tasksMap.set(cardKey, snapshot);
  notifyListeners();
  return snapshot;
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
    updateTaskState(cardKey, task, {
      status: "cancelled",
      stage: "cancelled",
      message: "Cancelado por el usuario",
      completedAt: Date.now(),
    });
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

  let task = {
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
          message: "🪄 Generando borrador inicial con IA...",
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
        message: "⚖️ Evaluando calidad pedagógica inicial con Juez...",
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
          ? `✨ ¡Maestría pedagógica alcanzada (${judgeResult.score}/100)!`
          : `⚖️ Juez asignó ${judgeResult.score}/100 (Meta: 95+)`,
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
          message: `🪄 Refinando explicación según crítica del Juez (Iteración ${iter}/${maxIterations})...`,
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
          message: `⚖️ Re-evaluando calidad pedagógica (Iteración ${iter}/${maxIterations})...`,
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
            ? `✨ ¡Maestría pedagógica alcanzada (${judgeResult.score}/100)!`
            : `⚖️ Juez asignó ${judgeResult.score}/100 en Iteración ${iter} (Meta: 95+)`,
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
          ? `✨ ¡Maestría pedagógica alcanzada (${judgeResult.score}/100)!`
          : `Límite de ${maxIterations} iteraciones alcanzado (Puntaje: ${judgeResult.score}/100)`,
      });
      onUpdate?.(task);
    } catch (err) {
      if (controller.signal.aborted || isCancel(err)) {
        task = updateTaskState(cardKey, task, {
          status: "cancelled",
          stage: "cancelled",
          message: "Cancelado por el usuario",
          completedAt: Date.now(),
        });
      } else {
        const errorMsg = userFacingAiError(err, "No se pudo completar el perfeccionamiento pedagógico.");
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
        message: "Evaluación completada",
      });
      onUpdate?.(task);
      onAttemptSaved?.(attempt);
    } catch (err) {
      if (controller.signal.aborted || isCancel(err)) {
        task = updateTaskState(cardKey, task, {
          status: "cancelled",
          stage: "cancelled",
          message: "Evaluación cancelada",
          completedAt: Date.now(),
        });
      } else {
        const errorMsg = userFacingAiError(err, "No se pudo completar la evaluación.");
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
