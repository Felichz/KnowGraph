import { chatCompletion, LLM_REQUEST_TIMEOUT_MS } from "./llmClient.js";
import { parseStructuredResponse } from "./parse.js";
import {
  EvaluationZod,
  EvaluationJsonSchema,
  buildEvaluationUserPayload,
  computeTotal,
  normalizeEvaluation,
  coveragePercentFromRubric,
  displayScoreFromCoverage,
  statusFromDisplayScore,
} from "./schemas.js";
import { EVALUATOR_SYSTEM_PROMPT, REPAIR_SYSTEM_PROMPT, EVALUATOR_VERSION } from "./prompts.js";
import { config } from "../config.js";

export async function evaluateParaphrase({ node, learnerAnswer, contentHash, signal, onChunk, onSection, onBlock }) {
  const userPayload = buildEvaluationUserPayload({ node, learnerAnswer });

  const raw = await chatCompletion({
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model: config.evaluationModel,
    messages: [
      { role: "system", content: EVALUATOR_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    responseFormat: {
      type: "json_schema",
      json_schema: {
        name: "evaluation",
        schema: EvaluationJsonSchema,
        strict: false,
      },
    },
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk,
    onSection,
    onBlock,
    // Si ya mostramos deltas no podemos reintentar silenciosamente: el
    // segundo intento duplicaría el preview. La UI ofrece reintentar de forma
    // explícita cuando el stream falla.
    maxAttempts: onChunk ? 1 : undefined,
  });

  const { data: wireData, attempts } = await parseStructuredResponse({
    raw,
    schema: EvaluationZod,
    repair: ({ badOutput }) =>
      repairToJson({ badOutput, system: REPAIR_SYSTEM_PROMPT, userHint: userPayload, signal }),
  });

  const data = normalizeEvaluation(wireData);
  const rawScore = computeTotal(data.rubric);
  const coveragePercent = coveragePercentFromRubric(data.rubric);
  const score = displayScoreFromCoverage(data.rubric, rawScore);
  const evaluation = {
    ...data,
    score,
    rawScore,
    coveragePercent,
    extraPoints: Math.max(0, score - 100),
    scoreScaleVersion: 3,
    status: statusFromDisplayScore(score),
  };

  return {
    evaluation,
    evaluatorVersion: EVALUATOR_VERSION,
    model: config.evaluationModel,
    routedVia: raw?.model ?? null,
    contentHash,
    repairAttempts: attempts,
  };
}

async function repairToJson({ badOutput, system, userHint, signal }) {
  try {
    const res = await chatCompletion({
      baseUrl: config.freellmapiBaseUrl,
      apiKey: config.freellmapiApiKey,
      model: config.evaluationModel,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Contexto original (no repetir):\n${userHint}\n\nJSON a reparar (devolvé SOLO el JSON correcto, sin explicaciones):\n${badOutput}`,
        },
      ],
      responseFormat: { type: "json_object" },
      signal,
      timeoutMs: 30_000,
    });
    return res?.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}
