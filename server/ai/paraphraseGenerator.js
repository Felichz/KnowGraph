import { chatCompletionWithFallback, LLM_REQUEST_TIMEOUT_MS } from "./llmClient.js";
import { INCORPORATE_FOCUS_SYSTEM_PROMPT, PARAPHRASE_SYSTEM_PROMPT, PEDAGOGICAL_JUDGE_SYSTEM_PROMPT, PEDAGOGICAL_REFINER_SYSTEM_PROMPT, POLISH_PEDAGOGY_SYSTEM_PROMPT, RECONCILE_CHAT_SYSTEM_PROMPT } from "./prompts.js";
import { buildIncorporateFocusUserPayload, buildParaphraseUserPayload, buildPedagogicalJudgeUserPayload, buildPedagogicalRefinerUserPayload, buildPolishPedagogyUserPayload, buildReconcileChatUserPayload } from "./schemas.js";
import { config } from "../config.js";
import { providerChain } from "./providers.js";
import { ErrorCodes, GatewayError } from "./errors.js";

export async function generatePedagogicalParaphrase({ node, provider, signal, onChunk }) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  const userPayload = buildParaphraseUserPayload({ node });
  if (!userPayload.trim()) {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "El contenido de la card está vacío");
  }

  const raw = await chatCompletionWithFallback({
    ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
    messages: [
      { role: "system", content: PARAPHRASE_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk: onChunk ? (delta, accumulated) => {
      onChunk(delta, accumulated);
    } : undefined,
    maxAttempts: onChunk ? 1 : undefined,
  });

  const content = String(raw?.choices?.[0]?.message?.content ?? "").trim();
  if (!content) {
    throw new GatewayError(ErrorCodes.UPSTREAM, "El modelo no devolvió texto de paráfrasis");
  }

  return {
    text: content,
    model: raw?.requestedModel ?? config.tutorModel ?? config.evaluationModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
    isAiGenerated: true,
  };
}

export async function improveParaphraseWithFocus({
  node,
  currentDraft,
  focusTitle,
  focusDetail,
  provider,
  signal,
  onChunk,
}) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  const trimmedDraft = String(currentDraft ?? "").trim();
  if (!trimmedDraft) {
    return generatePedagogicalParaphrase({ node, provider, signal, onChunk });
  }

  const userPayload = buildIncorporateFocusUserPayload({
    node,
    currentDraft: trimmedDraft,
    focusTitle,
    focusDetail,
  });

  const raw = await chatCompletionWithFallback({
    ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
    messages: [
      { role: "system", content: INCORPORATE_FOCUS_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk: onChunk ? (delta, accumulated) => {
      onChunk(delta, accumulated);
    } : undefined,
    maxAttempts: onChunk ? 1 : undefined,
  });

  const content = String(raw?.choices?.[0]?.message?.content ?? "").trim();
  if (!content) {
    throw new GatewayError(ErrorCodes.UPSTREAM, "El modelo no devolvió texto de paráfrasis mejorada");
  }

  return {
    text: content,
    model: raw?.requestedModel ?? config.tutorModel ?? config.evaluationModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
    isAiGenerated: true,
  };
}

export async function reconcileParaphraseWithChat({
  node,
  currentDraft,
  messages,
  provider,
  signal,
  onChunk,
}) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  const trimmedDraft = String(currentDraft ?? "").trim();
  const validMessages = Array.isArray(messages) ? messages : [];

  if (validMessages.length === 0 && !trimmedDraft) {
    return generatePedagogicalParaphrase({ node, provider, signal, onChunk });
  }

  const userPayload = buildReconcileChatUserPayload({
    node,
    currentDraft: trimmedDraft,
    messages: validMessages,
  });

  const raw = await chatCompletionWithFallback({
    ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
    messages: [
      { role: "system", content: RECONCILE_CHAT_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk: onChunk ? (delta, accumulated) => {
      onChunk(delta, accumulated);
    } : undefined,
    maxAttempts: onChunk ? 1 : undefined,
  });

  const content = String(raw?.choices?.[0]?.message?.content ?? "").trim();
  if (!content) {
    throw new GatewayError(ErrorCodes.UPSTREAM, "El modelo no devolvió texto de paráfrasis reconciliada");
  }

  return {
    text: content,
    model: raw?.requestedModel ?? config.tutorModel ?? config.evaluationModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
    isAiGenerated: true,
  };
}

export async function polishParaphrasePedagogy({
  node,
  currentDraft,
  provider,
  signal,
  onChunk,
}) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  const trimmedDraft = String(currentDraft ?? "").trim();
  if (!trimmedDraft) {
    return generatePedagogicalParaphrase({ node, provider, signal, onChunk });
  }

  const userPayload = buildPolishPedagogyUserPayload({
    node,
    currentDraft: trimmedDraft,
  });

  const raw = await chatCompletionWithFallback({
    ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
    messages: [
      { role: "system", content: POLISH_PEDAGOGY_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    temperature: 0.5,
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk: onChunk ? (delta, accumulated) => {
      onChunk(delta, accumulated);
    } : undefined,
    maxAttempts: onChunk ? 1 : undefined,
  });

  const content = String(raw?.choices?.[0]?.message?.content ?? "").trim();
  if (!content) {
    throw new GatewayError(ErrorCodes.UPSTREAM, "El modelo no devolvió texto de paráfrasis didáctica");
  }

  return {
    text: content,
    model: raw?.requestedModel ?? config.tutorModel ?? config.evaluationModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
    isAiGenerated: true,
  };
}

export async function refineParaphrasePedagogy({
  node,
  draft,
  critique = [],
  currentScore = 0,
  provider,
  signal,
  onChunk,
}) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  const userPayload = buildPedagogicalRefinerUserPayload({
    node,
    draft,
    critique,
    currentScore,
  });

  let accumulated = "";
  const raw = await chatCompletionWithFallback({
    ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
    messages: [
      { role: "system", content: PEDAGOGICAL_REFINER_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    temperature: 0.45,
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk: (delta, acc) => {
      accumulated = acc;
      onChunk?.(delta, acc);
    },
    maxAttempts: 1,
  });

  const content = String(raw?.choices?.[0]?.message?.content ?? accumulated).trim();
  if (!content) {
    throw new GatewayError(ErrorCodes.UPSTREAM, "El modelo no devolvió texto refinado");
  }

  return {
    text: content,
    model: raw?.requestedModel ?? config.tutorModel ?? config.evaluationModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
    isAiGenerated: true,
  };
}

export async function judgePedagogy({ node, draft, provider, signal }) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  const userPayload = buildPedagogicalJudgeUserPayload({ node, draft });
  const raw = await chatCompletionWithFallback({
    ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
    messages: [
      { role: "system", content: PEDAGOGICAL_JUDGE_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    temperature: 0.1,
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
  });

  const content = String(raw?.choices?.[0]?.message?.content ?? "").trim();
  let parsed;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    parsed = {
      score: 75,
      rubric: { foundationalContext: 15, selfContainedScope: 15, cognitivePacing: 15, causalityAndTradeoffs: 15, applicationAndFailureModes: 15 },
      passedThreshold: false,
      verdict: "Evaluación completada",
      pedagogicalCritique: ["Mejorar la fluidez y claridad general."],
    };
  }

  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
  return {
    score,
    rubric: parsed.rubric || {
      foundationalContext: Math.round(score * 0.20),
      selfContainedScope: Math.round(score * 0.20),
      cognitivePacing: Math.round(score * 0.20),
      causalityAndTradeoffs: Math.round(score * 0.20),
      applicationAndFailureModes: Math.round(score * 0.20),
    },
    passedThreshold: score >= 95 && (!Array.isArray(parsed.pedagogicalCritique) || parsed.pedagogicalCritique.length === 0),
    verdict: parsed.verdict || (score >= 95 ? "Maestría pedagógica alcanzada" : "Requiere refinamiento"),
    pedagogicalCritique: Array.isArray(parsed.pedagogicalCritique) ? parsed.pedagogicalCritique : [],
  };
}

export async function runPedagogicalHarness({
  node,
  initialDraft,
  provider,
  signal,
  maxIterations = 6,
  onEvent,
}) {
  if (!node || typeof node !== "object") {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
  }

  let currentDraft = String(initialDraft ?? "").trim();
  const history = [];

  // Si no hay borrador, generamos uno inicial
  if (!currentDraft) {
    onEvent?.({ type: "stage", stage: "generating_initial", iteration: 0, message: "Generando borrador inicial con IA..." });
    let initAcc = "";
    const genRes = await generatePedagogicalParaphrase({
      node,
      provider,
      signal,
      onChunk: (delta, accumulated) => {
        initAcc = accumulated;
        onEvent?.({ type: "delta", stage: "generating_initial", iteration: 0, text: delta, fullText: accumulated });
      },
    });
    currentDraft = genRes.text || initAcc;
  }

  // Iteración 0: Juez inicial
  onEvent?.({
    type: "stage",
    stage: "judging",
    iteration: 0,
    draft: currentDraft,
    message: "⚖️ Evaluando calidad pedagógica inicial con Juez...",
  });

  let judgeResult = await judgePedagogy({ node, draft: currentDraft, provider, signal });
  history.push({
    iteration: 0,
    score: judgeResult.score,
    rubric: judgeResult.rubric,
    verdict: judgeResult.verdict,
    critique: judgeResult.pedagogicalCritique,
    draft: currentDraft,
  });

  onEvent?.({
    type: "judge_result",
    iteration: 0,
    score: judgeResult.score,
    rubric: judgeResult.rubric,
    verdict: judgeResult.verdict,
    critique: judgeResult.pedagogicalCritique,
    passedThreshold: judgeResult.passedThreshold,
    history,
  });

  let iteration = 0;
  while (!judgeResult.passedThreshold && iteration < maxIterations) {
    if (signal?.aborted) throw new GatewayError(ErrorCodes.UPSTREAM, "Cancelado por el usuario");
    iteration += 1;

    // Fase Refinamiento
    onEvent?.({
      type: "stage",
      stage: "refining",
      iteration,
      currentScore: judgeResult.score,
      critique: judgeResult.pedagogicalCritique,
      message: `🪄 Refinando explicación según crítica del Juez (Iteración ${iteration}/${maxIterations})...`,
    });

    const refinerPayload = buildPedagogicalRefinerUserPayload({
      node,
      draft: currentDraft,
      critique: judgeResult.pedagogicalCritique,
      currentScore: judgeResult.score,
    });

    let refinedAcc = "";
    const refinerRaw = await chatCompletionWithFallback({
      ...providerChain(config.tutorModel || config.evaluationModel, { provider }),
      messages: [
        { role: "system", content: PEDAGOGICAL_REFINER_SYSTEM_PROMPT },
        { role: "user", content: refinerPayload },
      ],
      temperature: 0.45,
      signal,
      timeoutMs: LLM_REQUEST_TIMEOUT_MS,
      onChunk: (delta, accumulated) => {
        refinedAcc = accumulated;
        onEvent?.({
          type: "delta",
          stage: "refining",
          iteration,
          text: delta,
          fullText: accumulated,
        });
      },
      maxAttempts: 1,
    });

    const newText = String(refinerRaw?.choices?.[0]?.message?.content ?? refinedAcc).trim();
    if (newText) {
      currentDraft = newText;
    }

    // Fase Re-evaluación del Juez
    onEvent?.({
      type: "stage",
      stage: "judging",
      iteration,
      draft: currentDraft,
      message: `⚖️ Re-evaluando calidad con Juez (Iteración ${iteration})...`,
    });

    judgeResult = await judgePedagogy({ node, draft: currentDraft, provider, signal });
    history.push({
      iteration,
      score: judgeResult.score,
      rubric: judgeResult.rubric,
      verdict: judgeResult.verdict,
      critique: judgeResult.pedagogicalCritique,
      draft: currentDraft,
    });

    onEvent?.({
      type: "judge_result",
      iteration,
      score: judgeResult.score,
      rubric: judgeResult.rubric,
      verdict: judgeResult.verdict,
      critique: judgeResult.pedagogicalCritique,
      passedThreshold: judgeResult.passedThreshold,
      history,
    });
  }

  const finalResult = {
    text: currentDraft,
    finalScore: judgeResult.score,
    passedThreshold: judgeResult.passedThreshold,
    totalIterations: iteration,
    history,
    rubric: judgeResult.rubric,
    verdict: judgeResult.verdict,
    isAiGenerated: true,
  };

  onEvent?.({
    type: "done",
    result: finalResult,
  });

  return finalResult;
}




