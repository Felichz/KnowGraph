import { z } from "zod";
import { structuredCompletionWithFallback, LLM_REQUEST_TIMEOUT_MS } from "./llmClient.js";
import { parseStructuredResponse } from "./parse.js";
import {
  buildEvaluationUserPayload,
  RUBRIC_MAX,
  ScoreSummaryZod,
} from "./schemas.js";
import { normalizeLiveReview } from "./liveReviewContract.js";
import { config } from "../config.js";
import { providerChain } from "./providers.js";

const LiveGapZod = z.object({
  topic: z.string().min(1),
  severity: z.enum(["high", "medium", "low"]),
  explanation: z.string().min(1),
  revisionHint: z.string().min(1),
});
const LiveCoverageItemZod = z.object({
  id: z.string().min(1).max(80),
  status: z.enum(["covered", "partial", "missing"]),
});

export const LiveReviewZod = z.object({
  scoreSummary: ScoreSummaryZod,
  coverage: z.array(LiveCoverageItemZod).max(40),
  hint: z.object({
    id: z.string().min(1).max(80),
    kind: z.enum(["gap", "refinement"]),
    label: z.string().min(1).max(140),
    text: z.string().min(1),
    detail: z.string().min(1).optional(),
  }),
  additionalGaps: z.array(LiveGapZod).max(8),
});

// MiniMax puede devolver el scoreSummary en forma abreviada:
// { accuracy: 36, ... } en vez de { rubric: { accuracy: { score: 36, max: 40 } } }.
// La frontera del proveedor acepta ambas formas y siempre entrega el contrato
// canónico al resto del gateway y al navegador.
const LiveReviewWireZod = z.object({
  scoreSummary: z.record(z.unknown()),
  coverage: z.array(LiveCoverageItemZod).max(40),
  hint: z.object({
    text: z.string().min(1),
    detail: z.string().optional(),
    id: z.string().optional(),
    kind: z.enum(["gap", "refinement"]).optional(),
    label: z.string().optional(),
  }).passthrough(),
  additionalGaps: z.array(z.union([LiveGapZod, z.string().min(1)])).max(8).optional().default([]),
}).passthrough();

export function normalizeLiveReviewWire(data) {
  const coverage = Array.isArray(data.coverage) ? data.coverage : [];
  return {
    ...data,
    scoreSummary: normalizeScoreSummary(data.scoreSummary),
    hint: normalizeLiveHint(data.hint, coverage),
    additionalGaps: normalizeAdditionalGaps(data.additionalGaps),
  };
}

export function normalizeLiveSection(field, value) {
  if (field === "scoreSummary") return normalizeScoreSummary(value);
  if (field === "hint") return normalizeLiveHint(value, []);
  return value;
}

function normalizeScoreSummary(value) {
  const source = value?.rubric && typeof value.rubric === "object" && !Array.isArray(value.rubric)
    ? value.rubric
    : value ?? {};

  return {
    rubric: Object.fromEntries(
      Object.entries(RUBRIC_MAX).map(([key, max]) => {
        const raw = source[key];
        const score = raw && typeof raw === "object" && !Array.isArray(raw) ? raw.score : raw;
        return [key, { score: Number(score), max }];
      }),
    ),
  };
}

function normalizeLiveHint(value, coverage) {
  const text = String(value?.text ?? "").trim();
  const hasUncoveredPoint = coverage.some((item) => item.status !== "covered");
  return {
    ...value,
    id: String(value?.id ?? "hint-001"),
    kind: value?.kind ?? (hasUncoveredPoint ? "gap" : "refinement"),
    label: String(value?.label ?? text),
    text,
    detail: String(value?.detail ?? "").trim() || text,
  };
}

function normalizeAdditionalGaps(gaps) {
  if (!Array.isArray(gaps)) return [];
  return gaps.map((gap) => {
    if (typeof gap !== "string") return gap;
    const text = gap.trim();
    return {
      topic: text.slice(0, 120),
      severity: "low",
      explanation: text,
      revisionHint: text,
    };
  });
}

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
  required: ["scoreSummary", "coverage", "hint", "additionalGaps"],
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
    coverage: {
      type: "array",
      maxItems: 40,
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

Además devolvé coverage con exactamente los IDs de card.coverageChecklist.steps y
card.coverageChecklist.tradeoffs, una sola vez cada uno. Usá "covered" si el borrador explica correctamente
el punto, "partial" si lo menciona pero queda incompleto o ambiguo, y "missing" si no aparece o es incorrecto.
No inventes IDs y no uses un score de rúbrica como sustituto del estado punto por punto.

No generes un score total: el gateway lo calcula de forma determinista y lo transforma al rango visible 0..120.
scoreSummary debe conservar esta forma exacta; no reemplaces cada objeto de rubrica por un numero:
{"rubric":{"accuracy":{"score":0,"max":40},"causalityAndTradeoffs":{"score":0,"max":25},"application":{"score":0,"max":20},"completeness":{"score":0,"max":15}}}
Después de scoreSummary, escribí un único hint principal. Si falta algo esencial, elegí el gap más prioritario.
Si ya está cubierta la superficie, sugerí una sola mejora de profundidad o trade-off.
hint.text es la instrucción breve que el usuario debe ver primero: una sola frase accionable y concreta.
hint.detail es una mini-lección autocontenida que debe enseñar el punto faltante, no solamente diagnosticarlo.
Escribila para alguien que todavía no entiende ese concepto: definí qué es, explicá cómo funciona paso a paso,
mostrá un ejemplo mínimo o un flujo concreto cuando ayude, y cerrá conectándolo con lo que debería agregar al
parafraseo. Conservá brevemente lo que el usuario ya explicó bien, pero dedicá la mayor parte del detalle a
construir el modelo mental que le falta. No escribas como si el usuario ya conociera el gap.
Evitá que el detalle sea una crítica meta del tipo "la card menciona...", "tu respuesta solo..." o "omitiste..."
sin explicar el concepto después. Esas frases pueden aparecer como contexto breve, pero nunca reemplazar la
explicación. Si el gap es una fase, recorrido, ciclo o secuencia, describí explícitamente el orden de los pasos,
desde dónde empieza hasta dónde termina, y nombrá las APIs o elementos relevantes. Por ejemplo, para la fase de
captura de eventos del DOM explicá que el evento baja desde la raíz hacia el objetivo, que los handlers
onClickCapture observan esa fase, que luego ocurre el objetivo y finalmente el burbujeo hacia los ancestros;
contrastalo con onClick y conectalo con el momento en que stopPropagation puede detener el recorrido.
No afirmes que stopPropagation siempre permite llegar al objetivo: si se llama durante la captura en un ancestro,
puede impedir que el evento siga avanzando hacia el objetivo; si se llama en el boton hijo, ese handler ya se
ejecutó y se evita que el evento continúe hacia la fila o los demás ancestros. Diferenciá stopPropagation de
preventDefault: el primero controla a qué nodos llega el evento y el segundo no detiene la propagación, solo
cancela la acción predeterminada del navegador.
Escribila en lenguaje claro, sin puntos suspensivos y sin decir que "hay más". No dependas de que el usuario conozca el gap de antemano.
La interfaz mostrará hint.text y hint.detail en el contexto del coaching; por eso detail no debe ser un título
ni una repetición de text.
Después del hint, devolvé additionalGaps con los demás gaps relevantes, sin repetir el hint principal.
Cada additionalGap debe ser un objeto con topic, severity, explanation y revisionHint; no devuelvas frases sueltas.
Los gaps secundarios no deben reemplazar ni retrasar el hint principal.

Orden obligatorio del JSON: scoreSummary, coverage, hint, additionalGaps.
No omitas coverage aunque todos sus puntos estén missing o covered: debe ser un
array con exactamente los IDs de steps y tradeoffs recibidos en coverageChecklist.
Devolvé únicamente JSON válido en español rioplatense claro.
`.trim();

export async function reviewLive({ node, learnerAnswer, contentHash, provider, signal, onChunk, onSection, onProviderFallback }) {
  const { raw, parsed: { data } } = await structuredCompletionWithFallback({
    ...providerChain(config.liveModel, { provider }),
    messages: [
      { role: "system", content: LIVE_REVIEW_SYSTEM_PROMPT },
      { role: "user", content: buildEvaluationUserPayload({ node, learnerAnswer }) },
    ],
    responseFormat: {
      type: "json_schema",
      json_schema: { name: "live_review", schema: LiveReviewJsonSchema, strict: false },
    },
    signal,
    timeoutMs: LLM_REQUEST_TIMEOUT_MS,
    onChunk,
    onSection: onSection
      ? (field, value) => onSection(field, normalizeLiveSection(field, value))
      : null,
    onProviderFallback,
    maxAttempts: onChunk ? 1 : undefined,
    parse: async (response) => {
      const parsed = await parseStructuredResponse({ raw: response, schema: LiveReviewWireZod });
      return {
        ...parsed,
        data: LiveReviewZod.parse(normalizeLiveReviewWire(parsed.data)),
      };
    },
  });

  const review = normalizeLiveReview(data);
  return {
    review: { ...review, contentHash },
    model: raw?.requestedModel ?? config.liveModel,
    routedVia: raw?.model ?? null,
    provider: raw?.provider ?? null,
    fallbackFrom: raw?.fallbackFrom ?? null,
  };
}
