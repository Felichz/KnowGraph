import { z } from "zod";
import { chatCompletion } from "./llmClient.js";
import { parseStructuredResponse } from "./parse.js";
import {
  buildEvaluationUserPayload,
  RUBRIC_MAX,
  ScoreSummaryZod,
} from "./schemas.js";
import { normalizeLiveReview } from "./liveReviewContract.js";
import { config } from "../config.js";

const LIVE_REVIEW_TIMEOUT_MS = 45_000;

const LiveGapZod = z.object({
  topic: z.string().min(1),
  severity: z.enum(["high", "medium", "low"]),
  explanation: z.string().min(1),
  revisionHint: z.string().min(1),
});

export const LiveReviewZod = z.object({
  scoreSummary: ScoreSummaryZod,
  hint: z.object({
    id: z.string().min(1).max(80),
    kind: z.enum(["gap", "refinement"]),
    label: z.string().min(1).max(140),
    text: z.string().min(1),
    detail: z.string().min(1).optional(),
  }),
  additionalGaps: z.array(LiveGapZod).max(8),
});

function rubricScoreJsonSchema(max) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["score", "max"],
    properties: {
      score: { type: "number", minimum: 0, maximum: max },
      max: { type: "integer", enum: [max] },
    },
  };
}

export const LiveReviewJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["scoreSummary", "hint", "additionalGaps"],
  properties: {
    scoreSummary: {
      type: "object",
      additionalProperties: false,
      required: ["rubric"],
      properties: {
        rubric: {
          type: "object",
          additionalProperties: false,
          required: ["accuracy", "causalityAndTradeoffs", "application", "completeness"],
          properties: Object.fromEntries(
            Object.entries(RUBRIC_MAX).map(([key, max]) => [key, rubricScoreJsonSchema(max)]),
          ),
        },
      },
    },
    hint: {
      type: "object",
      additionalProperties: false,
      required: ["id", "kind", "label", "text", "detail"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 80 },
        kind: { type: "string", enum: ["gap", "refinement"] },
        label: { type: "string", minLength: 1, maxLength: 140 },
        text: { type: "string", minLength: 1 },
        detail: { type: "string", minLength: 1 },
      },
    },
    additionalGaps: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["topic", "severity", "explanation", "revisionHint"],
        properties: {
          topic: { type: "string", minLength: 1 },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          explanation: { type: "string", minLength: 1 },
          revisionHint: { type: "string", minLength: 1 },
        },
      },
    },
  },
};

export const LIVE_REVIEW_SYSTEM_PROMPT = `
Sos un coach de aprendizaje para un desarrollador que explica una card tecnica.

Evaluá el borrador exclusivamente contra el contenido de la card proporcionada.
Asigná los mismos cuatro subscores de la evaluación completa:
- accuracy (0..40): identifica qué es el concepto y cómo funciona.
- causalityAndTradeoffs (0..25): explica por qué importa, consecuencias, límites y errores.
- application (0..20): conecta el concepto con un caso o decisión realista.
- completeness (0..15): cubre las ideas esenciales de la card; no exige ejemplos explícitos.

No generes un score total: el gateway lo calcula de forma determinista y lo transforma al rango visible 0..120.
Después de scoreSummary, escribí un único hint principal. Si falta algo esencial, elegí el gap más prioritario.
Si ya está cubierta la superficie, sugerí una sola mejora de profundidad o trade-off.
hint.text es la instrucción breve que el usuario debe ver primero: una sola frase accionable y concreta.
hint.detail es la explicación completa de por qué eso es importante, qué parte de la card falta o se puede
refinar y qué debería agregar el usuario. Escribila en lenguaje claro, sin omitir el razonamiento necesario,
sin puntos suspensivos y sin decir que "hay más". No dependas de que el usuario conozca el gap de antemano.
La interfaz mostrará hint.text de forma compacta y podrá expandir hint.detail con "Ver más"; por eso detail
no debe ser un título ni una repetición de text.
Después del hint, devolvé additionalGaps con los demás gaps relevantes, sin repetir el hint principal.
Los gaps secundarios no deben reemplazar ni retrasar el hint principal.

Orden obligatorio del JSON: scoreSummary, hint, additionalGaps.
Devolvé únicamente JSON válido en español rioplatense claro.
`.trim();

export async function reviewLive({ node, learnerAnswer, contentHash, signal, onChunk, onSection }) {
  const raw = await chatCompletion({
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model: config.liveModel,
    messages: [
      { role: "system", content: LIVE_REVIEW_SYSTEM_PROMPT },
      { role: "user", content: buildEvaluationUserPayload({ node, learnerAnswer }) },
    ],
    responseFormat: {
      type: "json_schema",
      json_schema: { name: "live_review", schema: LiveReviewJsonSchema, strict: false },
    },
    signal,
    timeoutMs: LIVE_REVIEW_TIMEOUT_MS,
    onChunk,
    onSection,
    maxAttempts: onChunk ? 1 : undefined,
  });

  const { data } = await parseStructuredResponse({ raw, schema: LiveReviewZod });
  const review = normalizeLiveReview(data);
  return {
    review: { ...review, contentHash },
    model: config.liveModel,
    routedVia: raw?.model ?? null,
  };
}
