import { chatCompletionWithFallback, LLM_REQUEST_TIMEOUT_MS } from "./llmClient.js";
import { INCORPORATE_FOCUS_SYSTEM_PROMPT, PARAPHRASE_SYSTEM_PROMPT, POLISH_PEDAGOGY_SYSTEM_PROMPT, RECONCILE_CHAT_SYSTEM_PROMPT } from "./prompts.js";
import { buildIncorporateFocusUserPayload, buildParaphraseUserPayload, buildPolishPedagogyUserPayload, buildReconcileChatUserPayload } from "./schemas.js";
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



