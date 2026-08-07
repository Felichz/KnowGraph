import { z } from "zod";

// ────────────────────────────────────────────────────────────────────────────
// Constantes de rúbrica (compartidas por Zod y JSON Schema)
// ────────────────────────────────────────────────────────────────────────────

export const RUBRIC_MAX = Object.freeze({ accuracy: 40, causalityAndTradeoffs: 25, application: 20, completeness: 15 });
export const RUBRIC_TOTAL_MAX = 100;
export const DISPLAY_SCORE_MAX = 120;
export const MASTERY_RAW_SCORE = 80;
// Las explicaciones detalladas son parte del producto; el gateway valida este
// límite y el payload al LLM usa la misma constante para no truncar en silencio.
export const MAX_LEARNER_ANSWER_CHARS = 12000;

// ────────────────────────────────────────────────────────────────────────────
// Zod schemas (validación runtime en el gateway)
// ────────────────────────────────────────────────────────────────────────────

function rubricScoreZod(max) {
  return z.object({
    score: z.number().min(0).max(max),
    max: z.literal(max),
    note: z.string().min(1).max(500),
  });
}

function rubricScoreOnlyZod(max) {
  return z.object({
    score: z.number().min(0).max(max),
    max: z.literal(max),
  });
}

export const RubricZod = z.object({
  accuracy: rubricScoreZod(RUBRIC_MAX.accuracy),
  causalityAndTradeoffs: rubricScoreZod(RUBRIC_MAX.causalityAndTradeoffs),
  application: rubricScoreZod(RUBRIC_MAX.application),
  completeness: rubricScoreZod(RUBRIC_MAX.completeness),
});

export const ScoreSummaryZod = z.object({
  rubric: z.object({
    accuracy: rubricScoreOnlyZod(RUBRIC_MAX.accuracy),
    causalityAndTradeoffs: rubricScoreOnlyZod(RUBRIC_MAX.causalityAndTradeoffs),
    application: rubricScoreOnlyZod(RUBRIC_MAX.application),
    completeness: rubricScoreOnlyZod(RUBRIC_MAX.completeness),
  }),
});

const GapZod = z.object({
  topic: z.string().min(1).max(120),
  severity: z.enum(["high", "medium", "low"]),
  explanation: z.string().min(1).max(400),
  revisionHint: z.string().min(1).max(200),
});

const MisconceptionZod = z.object({
  quote: z.string().max(200).optional(),
  correction: z.string().min(1).max(400),
});

export const EvaluationZod = z.object({
  scoreSummary: ScoreSummaryZod,
  feedback: z.object({
    rubricNotes: z.object({
      accuracy: z.string().min(1).max(500),
      causalityAndTradeoffs: z.string().min(1).max(500),
      application: z.string().min(1).max(500),
      completeness: z.string().min(1).max(500),
    }),
    strengths: z.array(z.string().min(1).max(300)).max(6),
    gaps: z.array(GapZod).max(6),
    misconceptions: z.array(MisconceptionZod).max(6),
    nextAttemptPrompt: z.string().min(1).max(300),
    conciseVerdict: z.string().min(1).max(280),
  }),
});

// Frontera de dominio: la IA usa scoreSummary/feedback para poder hacer
// streaming por fases, pero la UI y el storage siguen usando una forma simple.
export function normalizeEvaluation(wire) {
  const scores = wire.scoreSummary.rubric;
  const notes = wire.feedback.rubricNotes;
  return {
    rubric: {
      accuracy: { ...scores.accuracy, note: notes.accuracy },
      causalityAndTradeoffs: { ...scores.causalityAndTradeoffs, note: notes.causalityAndTradeoffs },
      application: { ...scores.application, note: notes.application },
      completeness: { ...scores.completeness, note: notes.completeness },
    },
    ...wire.feedback,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// JSON Schema (hand-written, se manda a response_format: json_schema)
// NO se genera desde Zod para evitar dependencia de API interna (_def).
// Test "schemas.spec.js" verifica que coincidan.
// Cada dimensión tiene su propio schema con maximum específico.
// ────────────────────────────────────────────────────────────────────────────

function dimensionJsonSchema(maxForDimension) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["score", "max", "note"],
    properties: {
      score: { type: "number", minimum: 0, maximum: maxForDimension },
      max: { type: "integer", enum: [maxForDimension] },
      note: { type: "string", minLength: 1, maxLength: 500 },
    },
  };
}

const gapJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topic", "severity", "explanation", "revisionHint"],
  properties: {
    topic: { type: "string", minLength: 1, maxLength: 120 },
    severity: { type: "string", enum: ["high", "medium", "low"] },
    explanation: { type: "string", minLength: 1, maxLength: 400 },
    revisionHint: { type: "string", minLength: 1, maxLength: 200 },
  },
};

const misconceptionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["correction"],
  properties: {
    quote: { type: "string", maxLength: 200 },
    correction: { type: "string", minLength: 1, maxLength: 400 },
  },
};

export const EvaluationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["scoreSummary", "feedback"],
  properties: {
    // Este objeto debe completarse entero antes de comenzar feedback. El
    // orden de properties acompaÃ±a el orden pedido en el prompt.
    scoreSummary: {
      type: "object",
      additionalProperties: false,
      required: ["rubric"],
      properties: {
        rubric: {
          type: "object",
          additionalProperties: false,
          required: ["accuracy", "causalityAndTradeoffs", "application", "completeness"],
          properties: {
            accuracy:             scoreOnlyJsonSchema(RUBRIC_MAX.accuracy),
            causalityAndTradeoffs: scoreOnlyJsonSchema(RUBRIC_MAX.causalityAndTradeoffs),
            application:          scoreOnlyJsonSchema(RUBRIC_MAX.application),
            completeness:         scoreOnlyJsonSchema(RUBRIC_MAX.completeness),
          },
        },
      },
    },
    feedback: {
      type: "object",
      additionalProperties: false,
      required: ["rubricNotes", "strengths", "gaps", "misconceptions", "nextAttemptPrompt", "conciseVerdict"],
      properties: {
        rubricNotes: {
          type: "object",
          additionalProperties: false,
          required: ["accuracy", "causalityAndTradeoffs", "application", "completeness"],
          properties: {
            accuracy: { type: "string", minLength: 1, maxLength: 500 },
            causalityAndTradeoffs: { type: "string", minLength: 1, maxLength: 500 },
            application: { type: "string", minLength: 1, maxLength: 500 },
            completeness: { type: "string", minLength: 1, maxLength: 500 },
          },
        },
        strengths: { type: "array", maxItems: 6, items: { type: "string", minLength: 1, maxLength: 300 } },
        gaps: { type: "array", maxItems: 6, items: gapJsonSchema },
        misconceptions: { type: "array", maxItems: 6, items: misconceptionJsonSchema },
        nextAttemptPrompt: { type: "string", minLength: 1, maxLength: 300 },
        conciseVerdict: { type: "string", minLength: 1, maxLength: 280 },
      },
    },
  },
};

function scoreOnlyJsonSchema(maxForDimension) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["score", "max"],
    properties: {
      score: { type: "number", minimum: 0, maximum: maxForDimension },
      max: { type: "integer", enum: [maxForDimension] },
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers de score
// ────────────────────────────────────────────────────────────────────────────

export function computeTotal(rubric) {
  const sum = rubric.accuracy.score + rubric.causalityAndTradeoffs.score
            + rubric.application.score + rubric.completeness.score;
  return Math.max(0, Math.min(RUBRIC_TOTAL_MAX, Math.round(sum)));
}

export function statusFromScore(score) {
  if (score >= 90) return "exceptional";
  if (score >= MASTERY_RAW_SCORE) return "strong";
  if (score >= 60) return "developing";
  return "review";
}

export function displayScoreFromRaw(rawScore) {
  const raw = Math.max(0, Math.min(RUBRIC_TOTAL_MAX, Math.round(Number(rawScore) || 0)));
  if (raw <= MASTERY_RAW_SCORE) return Math.round(raw * (100 / MASTERY_RAW_SCORE));
  return 100 + (raw - MASTERY_RAW_SCORE);
}

export function coveragePercentFromRubric(rubric) {
  const dimension = rubric?.completeness;
  if (!dimension || dimension.max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((dimension.score / dimension.max) * 100)));
}

// El score visible tiene una semántica única: hasta 100 mide superficie
// cubierta; los puntos 101..120 solo existen después de cubrirla completa.
export function displayScoreFromCoverage(rubric, rawScore) {
  const coverage = coveragePercentFromRubric(rubric);
  if (coverage < 100) return coverage;
  const extra = Math.max(0, Math.min(20, Math.round(Number(rawScore) || 0) - MASTERY_RAW_SCORE));
  return coverage + extra;
}

export function statusFromDisplayScore(score) {
  if (score >= 101) return "exceptional";
  if (score >= 100) return "strong";
  if (score >= 60) return "developing";
  return "review";
}

export const STATUS_LABEL = Object.freeze({
  strong: "Base sólida",
  developing: "En progreso",
  review: "Conviene revisar",
});

// ────────────────────────────────────────────────────────────────────────────
// Helpers de payload
// ────────────────────────────────────────────────────────────────────────────

export function buildEvaluationUserPayload({ node, learnerAnswer }) {
  const lesson = node.lesson ?? {};
  return JSON.stringify({
    card: {
      id: node.id,
      title: node.label ?? node.title,
      summary: lesson.summary ?? "",
      why: lesson.why ?? "",
      explanation: lesson.explanation ?? "",
      code: lesson.code ?? "",
      codeLabel: lesson.codeLabel ?? "",
      steps: lesson.steps ?? [],
      pitfalls: lesson.pitfalls ?? [],
      takeaway: lesson.takeaway ?? "",
      audit: lesson.audit ?? null,
      docNotes: lesson.docNotes ?? [],
      prompt: lesson.prompt ?? null,
      table: lesson.table ?? null,
      tableTitle: lesson.tableTitle ?? "",
      tableLabel: lesson.tableLabel ?? "",
      diagram: lesson.diagram ?? null,
      diagramTitle: lesson.diagramTitle ?? "",
      mermaid: lesson.mermaid ?? "",
    },
    learnerAnswer: String(learnerAnswer ?? "").slice(0, MAX_LEARNER_ANSWER_CHARS),
  });
}
