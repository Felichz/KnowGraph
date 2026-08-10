import { z } from "zod";
import { chatCompletionWithFallback, structuredCompletionWithFallback, LLM_REQUEST_TIMEOUT_MS } from "./llmClient.js";
import { parseStructuredResponse } from "./parse.js";
import {
  EvaluationZod,
  EvaluationWireZod,
  EvaluationJsonSchema,
  ScoreSummaryZod,
  buildEvaluationUserPayload,
  computeTotal,
  normalizeEvaluation,
  coveragePercentFromRubric,
  displayScoreFromCoverage,
  statusFromDisplayScore,
  normalizeEvaluationWire,
  normalizeEvaluationSection,
} from "./schemas.js";
import {
  EVALUATOR_SYSTEM_PROMPT,
  EVALUATOR_SCORING_SYSTEM_PROMPT,
  EVALUATOR_FEEDBACK_SYSTEM_PROMPT,
  REPAIR_SYSTEM_PROMPT,
  EVALUATOR_VERSION,
} from "./prompts.js";
import { config } from "../config.js";
import { providerChain } from "./providers.js";
import { SchemaMismatchError } from "./errors.js";

const ScoreEnvelopeZod = z.object({ scoreSummary: ScoreSummaryZod });
const ScoreEnvelopeWireZod = z.object({ scoreSummary: z.record(z.unknown()) }).passthrough();
const FeedbackEnvelopeZod = EvaluationZod.pick({ feedback: true });
const FeedbackEnvelopeWireZod = EvaluationWireZod.pick({ feedback: true }).passthrough();
const ScoreSummaryJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["scoreSummary"],
  properties: { scoreSummary: EvaluationJsonSchema.properties.scoreSummary },
};
const FeedbackJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["feedback"],
  properties: { feedback: EvaluationJsonSchema.properties.feedback },
};

export async function evaluateParaphrase({ node, learnerAnswer, contentHash, provider, signal, onChunk, onSection, onBlock, onProviderFallback }) {
  const userPayload = buildEvaluationUserPayload({ node, learnerAnswer });
  // El score se calcula en una request pequena y sin thinking: la UI no
  // depende de que el modelo termine de redactar el feedback para mostrarlo.
  const providers = providerChain(config.evaluationModel, { provider, thinking: "disabled" });

  const scoring = await structuredCompletionWithFallback({
    ...providers,
    messages: [
      { role: "system", content: EVALUATOR_SCORING_SYSTEM_PROMPT },
      { role: "user", content: userPayload },
    ],
    responseFormat: {
      type: "json_schema",
      json_schema: { name: "evaluation_scores", schema: ScoreSummaryJsonSchema, strict: false },
    },
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onProviderFallback: (provider) => onProviderFallback?.({ ...provider, scope: "all" }),
    parse: parseScoreSummary,
  });

  const scoreSummary = scoring.parsed.data.scoreSummary;
  onSection?.("scoreSummary", scoreSummary);
  emitScoreBlocks(scoreSummary, onBlock);

  const feedback = await structuredCompletionWithFallback({
    ...providers,
    messages: [
      { role: "system", content: EVALUATOR_FEEDBACK_SYSTEM_PROMPT },
      {
        role: "user",
        content: `${userPayload}\n\nRubrica ya calculada (no la modifiques):\n${JSON.stringify(scoreSummary)}`,
      },
    ],
    responseFormat: {
      type: "json_schema",
      json_schema: { name: "evaluation_feedback", schema: FeedbackJsonSchema, strict: false },
    },
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk,
    onSection: onSection
      ? (field, value) => onSection(field, normalizeEvaluationSection(field, value))
      : null,
    onBlock,
    onProviderFallback: (provider) => onProviderFallback?.({ ...provider, scope: "feedback" }),
    maxAttempts: onChunk ? 1 : undefined,
    parse: parseFeedback,
  });

  const data = normalizeEvaluation({ scoreSummary, feedback: feedback.parsed.data.feedback });
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
    model: feedback.raw?.requestedModel ?? scoring.raw?.requestedModel ?? config.evaluationModel,
    routedVia: feedback.raw?.model ?? scoring.raw?.model ?? null,
    provider: feedback.raw?.provider ?? scoring.raw?.provider ?? null,
    fallbackFrom: feedback.raw?.fallbackFrom ?? scoring.raw?.fallbackFrom ?? null,
    scoringProvider: scoring.raw?.provider ?? null,
    scoringModel: scoring.raw?.requestedModel ?? null,
    contentHash,
    repairAttempts: scoring.parsed.attempts + feedback.parsed.attempts,
  };
}

async function evaluateParaphraseLegacy({ node, learnerAnswer, contentHash, provider, signal, onChunk, onSection, onBlock, onProviderFallback }) {
  const userPayload = buildEvaluationUserPayload({ node, learnerAnswer });
  const providers = providerChain(config.evaluationModel, { provider });

  const { raw, parsed: { data: wireData, attempts } } = await structuredCompletionWithFallback({
    ...providers,
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
    onSection: onSection
      ? (field, value) => onSection(field, normalizeEvaluationSection(field, value))
      : null,
    onBlock,
    onProviderFallback,
    // Si ya mostramos deltas no podemos reintentar silenciosamente: el
    // segundo intento duplicaría el preview. La UI ofrece reintentar de forma
    // explícita cuando el stream falla.
    maxAttempts: onChunk ? 1 : undefined,
    parse: (response) => parseEvaluation(response, userPayload, signal, provider),
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
    model: raw?.requestedModel ?? config.evaluationModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
    contentHash,
    repairAttempts: attempts,
  };
}

async function parseEvaluation(raw, userPayload, signal, provider) {
  const parsed = await parseStructuredResponse({
    raw,
    schema: EvaluationWireZod,
    repair: ({ badOutput }) =>
      repairToJson({ badOutput, system: REPAIR_SYSTEM_PROMPT, userHint: userPayload, signal, provider }),
  });
  return {
    ...parsed,
    data: EvaluationZod.parse(normalizeEvaluationWire(parsed.data)),
  };
}

async function repairToJson({ badOutput, system, userHint, signal, provider }) {
  try {
    const res = await chatCompletionWithFallback({
      ...providerChain(config.evaluationModel, { provider }),
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

async function parseScoreSummary(raw) {
  const parsed = await parseStructuredResponse({ raw, schema: ScoreEnvelopeWireZod });
  return {
    ...parsed,
    data: validate(ScoreEnvelopeZod, normalizeEvaluationWire({ scoreSummary: parsed.data.scoreSummary })),
  };
}

async function parseFeedback(raw) {
  const parsed = await parseStructuredResponse({ raw, schema: FeedbackEnvelopeWireZod });
  return {
    ...parsed,
    data: validate(FeedbackEnvelopeZod, normalizeEvaluationWire({ feedback: parsed.data.feedback })),
  };
}

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw new SchemaMismatchError({
    reason: "normalized_schema_mismatch",
    issues: result.error.issues.slice(0, 5).map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  });
}

function emitScoreBlocks(scoreSummary, onBlock) {
  if (!onBlock) return;
  for (const [key, value] of Object.entries(scoreSummary.rubric ?? {})) {
    for (const field of ["score", "max"]) {
      onBlock({
        id: `scoreSummary.rubric.${key}.${field}`,
        kind: "number",
        value: String(value?.[field] ?? ""),
        complete: true,
        phase: "end",
      });
    }
  }
}
