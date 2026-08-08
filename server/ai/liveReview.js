import { z } from "zod";
import { chatCompletion } from "./llmClient.js";
import { parseStructuredResponse } from "./parse.js";
import { buildEvaluationUserPayload } from "./schemas.js";
import { normalizeLiveReview } from "./liveReviewContract.js";
import { config } from "../config.js";

const LIVE_REVIEW_TIMEOUT_MS = 45_000;

const LivePointZod = z.object({
  id: z.string().min(1).max(80),
  status: z.enum(["covered", "partial", "missing"]),
});

export const LiveReviewZod = z.object({
  points: z.array(LivePointZod).min(1).max(10),
  hint: z.object({
    id: z.string().min(1).max(80),
    kind: z.enum(["gap", "refinement"]),
    label: z.string().min(1).max(140),
    text: z.string().min(1).max(220),
  }),
});

export const LiveReviewJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["points", "hint"],
  properties: {
    // points va primero para que la UI pueda calcular la cobertura antes del gap textual.
    points: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "status"],
        properties: {
          id: { type: "string", minLength: 1, maxLength: 80 },
          status: { type: "string", enum: ["covered", "partial", "missing"] },
        },
      },
    },
    hint: {
      type: "object",
      additionalProperties: false,
      required: ["id", "kind", "label", "text"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 80 },
        kind: { type: "string", enum: ["gap", "refinement"] },
        label: { type: "string", minLength: 1, maxLength: 140 },
        text: { type: "string", minLength: 1, maxLength: 220 },
      },
    },
  },
};

export const LIVE_REVIEW_SYSTEM_PROMPT = `
Sos un coach de aprendizaje para un desarrollador que explica una card técnica.

Revisá rápidamente el borrador contra la card proporcionada y evaluá exclusivamente su contenido.
Construí un checklist corto de 3 a 10 ideas esenciales que la persona debería poder explicar.
Cada punto solo necesita un id corto y un estado:
- "covered" si aparece correctamente en el borrador.
- "partial" si aparece pero falta una relación, consecuencia o precisión importante.
- "missing" si todavía no aparece.

No devuelvas explicaciones, evidencia, fortalezas ni una lista de gaps.
Devolvé únicamente "hint", un único texto breve para orientar al estudiante.
Si falta una idea esencial, usá kind "gap", elegí el punto más prioritario y escribí qué concepto falta
y qué aspecto concreto debería explicar el estudiante. Usá en hint.id exactamente el mismo id del punto elegido.
No uses frases genéricas como "¿Qué idea esencial todavía falta explicar?".
Si todos los puntos están cubiertos, usá kind "refinement" y sugerí un único trade-off o relación
que valga la pena profundizar. Nunca devuelvas más de un hint.

Ordená el JSON así: primero "points" y después "hint".
Devolvé únicamente JSON válido y respondé en español rioplatense claro.
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
