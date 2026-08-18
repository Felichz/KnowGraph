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

export function buildCoverageChecklist(node) {
  const lesson = node?.lesson ?? {};
  return {
    steps: (Array.isArray(lesson.steps) ? lesson.steps : []).map((text, index) => ({
      id: `step_${index + 1}`,
      text: String(text),
    })),
    tradeoffs: (Array.isArray(lesson.pitfalls) ? lesson.pitfalls : []).map((text, index) => ({
      id: `tradeoff_${index + 1}`,
      text: String(text),
    })),
  };
}

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

// Los modelos redactan en español, pero el dominio usa severidades canónicas
// para que la UI no tenga que conocer variantes como "alta" o "baja".
// Esta forma es deliberadamente más amplia que GapZod: es la frontera de
// proveedor, antes de la normalización y la validación estricta del dominio.
const GapWireZod = z.object({
  topic: z.string().min(1),
  severity: z.string().min(1),
  explanation: z.string().min(1),
  revisionHint: z.string().min(1),
}).passthrough();

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

// Frontera tolerante para proveedores que simplifican arrays de un solo
// elemento o el envelope de scoreSummary. La salida se normaliza y luego se
// valida de nuevo contra EvaluationZod antes de llegar a la UI.
export const EvaluationWireZod = z.object({
  scoreSummary: z.record(z.unknown()),
  feedback: z.object({
    rubricNotes: z.object({
      accuracy: z.string().min(1),
      causalityAndTradeoffs: z.string().min(1),
      application: z.string().min(1),
      completeness: z.string().min(1),
    }),
    strengths: z.union([z.array(z.string().min(1)).max(6), z.string().min(1)]),
    gaps: z.union([z.array(z.union([GapWireZod, z.string().min(1)])).max(6), z.string().min(1)]),
    misconceptions: z.union([z.array(z.union([MisconceptionZod, z.string().min(1)])).max(6), z.string().min(1)]),
    nextAttemptPrompt: z.string().min(1),
    conciseVerdict: z.string().min(1),
  }).passthrough(),
}).passthrough();

export function normalizeEvaluationWire(wire) {
  const normalized = { ...wire };
  if (wire.scoreSummary) normalized.scoreSummary = { rubric: normalizeRubric(wire.scoreSummary) };
  if (wire.feedback) normalized.feedback = normalizeFeedback(wire.feedback);
  return normalized;
}

export function normalizeEvaluationSection(field, value) {
  if (field === "scoreSummary") return normalizeEvaluationWire({ scoreSummary: value }).scoreSummary;
  if (field === "feedback") return normalizeEvaluationWire({ feedback: value }).feedback;
  return value;
}

function normalizeRubric(value) {
  const source = value?.rubric && typeof value.rubric === "object" && !Array.isArray(value.rubric)
    ? value.rubric
    : value ?? {};
  return Object.fromEntries(
    Object.entries(RUBRIC_MAX).map(([key, max]) => {
      const raw = source[key];
      const score = raw && typeof raw === "object" && !Array.isArray(raw) ? raw.score : raw;
      return [key, { score: Number(score), max }];
    }),
  );
}

function normalizeFeedback(feedback) {
  return {
    ...feedback,
    rubricNotes: Object.fromEntries(
      Object.entries(feedback.rubricNotes ?? {}).map(([key, value]) => [key, String(value).slice(0, 500)]),
    ),
    strengths: normalizeStringList(feedback.strengths).map((item) => item.slice(0, 300)).slice(0, 6),
    gaps: normalizeGaps(feedback.gaps),
    misconceptions: normalizeMisconceptions(feedback.misconceptions),
    nextAttemptPrompt: String(feedback.nextAttemptPrompt ?? "").slice(0, 300),
    conciseVerdict: String(feedback.conciseVerdict ?? "").slice(0, 280),
  };
}

function normalizeStringList(value) {
  if (typeof value === "string") return [value];
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function normalizeGaps(value) {
  const items = typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
  return items.map((item) => {
    if (typeof item !== "string") {
      if (!item || typeof item !== "object") return item;
      return {
        ...item,
        topic: String(item.topic ?? "").slice(0, 120),
        severity: normalizeSeverity(item.severity),
        explanation: String(item.explanation ?? "").slice(0, 400),
        revisionHint: String(item.revisionHint ?? "").slice(0, 200),
      };
    }
    const text = item.trim();
    return {
      topic: text.slice(0, 120),
      severity: "medium",
      explanation: text.slice(0, 400),
      revisionHint: text.slice(0, 200),
    };
  });
}

function normalizeSeverity(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  if (["high", "alta", "alto"].includes(normalized)) return "high";
  if (["low", "baja", "bajo"].includes(normalized)) return "low";
  return "medium";
}

function normalizeMisconceptions(value) {
  const items = typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
  return items.map((item) => {
    if (typeof item === "string") return { correction: item.slice(0, 400) };
    if (!item || typeof item !== "object") return item;
    return {
      ...item,
      quote: item.quote === undefined ? undefined : String(item.quote).slice(0, 200),
      correction: String(item.correction ?? "").slice(0, 400),
    };
  });
}

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
  const coverageChecklist = buildCoverageChecklist(node);
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
      coverageChecklist,
    },
    learnerAnswer: String(learnerAnswer ?? "").slice(0, MAX_LEARNER_ANSWER_CHARS),
  });
}

export function buildParaphraseUserPayload({ node }) {
  if (!node) return "";
  const lesson = node.lesson ?? {};
  const lines = [
    `TÍTULO DEL CONCEPTO: ${node.label ?? node.title ?? node.id}`,
  ];
  if (lesson.level) lines.push(`NIVEL / AUDIENCIA: ${lesson.level}`);
  if (lesson.summary) lines.push(`RESUMEN ESENCIAL:\n${lesson.summary}`);
  if (lesson.why) lines.push(`POR QUÉ IMPORTA:\n${lesson.why}`);
  if (lesson.explanation) lines.push(`EXPLICACIÓN DETALLADA / MODELO MENTAL:\n${lesson.explanation}`);
  if (lesson.code) {
    lines.push(`BLOQUE DE CÓDIGO / EJEMPLO FORMAL (${lesson.codeLabel || "snippet"}):\n\`\`\`\n${lesson.code}\n\`\`\``);
  }
  if (Array.isArray(lesson.steps) && lesson.steps.length > 0) {
    lines.push(`PRINCIPIOS CLAVE / PASOS:\n${lesson.steps.map((s) => `- ${s}`).join("\n")}`);
  }
  if (Array.isArray(lesson.pitfalls) && lesson.pitfalls.length > 0) {
    lines.push(`ERRORES COMUNES / SÍNTOMAS Y TRADE-OFFS:\n${lesson.pitfalls.map((p) => `- ${p}`).join("\n")}`);
  }
  if (lesson.takeaway) lines.push(`IDEA PARA RECORDAR / REGLA PRÁCTICA:\n${lesson.takeaway}`);
  if (lesson.table) {
    lines.push(`TABLA COMPARATIVA (${lesson.tableTitle || ""}):\n${JSON.stringify(lesson.table, null, 2)}`);
  }
  if (lesson.prompt) lines.push(`CONSIGNA DE APLICACIÓN:\n${lesson.prompt}`);
  if (lesson.docNotes?.length) {
    lines.push(`NOTAS DE DOCUMENTACIÓN:\n${lesson.docNotes.map((n) => `- ${n}`).join("\n")}`);
  }
  return lines.join("\n\n");
}

export function buildIncorporateFocusUserPayload({ node, currentDraft, focusTitle, focusDetail }) {
  const lesson = node?.lesson ?? {};
  const lines = [
    `CONCEPTO: ${node?.label ?? node?.title ?? "Tema"}`,
    `BORRADOR ACTUAL DEL ESTUDIANTE:\n"""\n${String(currentDraft ?? "").trim()}\n"""`,
    `FOCO ESPECÍFICO A INTEGRAR (HINT DEL COACH):\n- Foco: ${focusTitle ?? ""}\n- Explicación del foco:\n${focusDetail ?? ""}`,
  ];
  if (lesson.summary) lines.push(`RESUMEN CANÓNICO DE REFERENCIA:\n${lesson.summary}`);
  if (lesson.why) lines.push(`POR QUÉ IMPORTA:\n${lesson.why}`);
  if (lesson.code) lines.push(`CÓDIGO DE REFERENCIA:\n\`\`\`\n${lesson.code}\n\`\`\``);
  if (lesson.takeaway) lines.push(`REGLA DE CIERRE RECOMENDADA:\n${lesson.takeaway}`);
  return lines.join("\n\n");
}

export function buildReconcileChatUserPayload({ node, currentDraft, messages = [] }) {
  const lesson = node?.lesson ?? {};
  const formattedChat = (Array.isArray(messages) ? messages : [])
    .filter((m) => m && m.content)
    .map((m, idx) => {
      const roleLabel = m.role === "assistant" ? "COACH" : "ESTUDIANTE";
      return `[Mensaje ${idx + 1} - ${roleLabel}]:\n${m.content}`;
    })
    .join("\n\n");

  const lines = [
    `CONCEPTO: ${node?.label ?? node?.title ?? "Tema"}`,
    `BORRADOR ACTUAL DEL ESTUDIANTE:\n"""\n${String(currentDraft ?? "").trim()}\n"""`,
    `CONVERSACIÓN DEL CHAT CON EL COACH (Dudas, aclaraciones y explicaciones):\n"""\n${formattedChat || "Sin mensajes en el chat"}\n"""`,
  ];
  if (lesson.summary) lines.push(`RESUMEN CANÓNICO DE REFERENCIA:\n${lesson.summary}`);
  if (lesson.why) lines.push(`POR QUÉ IMPORTA:\n${lesson.why}`);
  if (lesson.code) lines.push(`CÓDIGO DE REFERENCIA:\n\`\`\`\n${lesson.code}\n\`\`\``);
  if (lesson.takeaway) lines.push(`REGLA DE CIERRE RECOMENDADA:\n${lesson.takeaway}`);
  return lines.join("\n\n");
}

export function buildPolishPedagogyUserPayload({ node, currentDraft }) {
  const lesson = node?.lesson ?? {};
  const lines = [
    `CONCEPTO A ENSEÑAR: ${node?.label ?? node?.title ?? node?.id ?? "Concepto técnico"}`,
    `TEXTO ACTUAL A REESCRIBIR DE MANERA DIDÁCTICA Y HUMANA:\n"""\n${String(currentDraft ?? "").trim()}\n"""`,
  ];
  if (lesson.summary) lines.push(`RESUMEN ESENCIAL DE REFERENCIA:\n${lesson.summary}`);
  if (lesson.why) lines.push(`POR QUÉ IMPORTA / CASO DE USO REAL:\n${lesson.why}`);
  if (lesson.explanation) lines.push(`EXPLICACIÓN CANÓNICA:\n${lesson.explanation}`);
  if (lesson.code) lines.push(`CÓDIGO DE REFERENCIA:\n\`\`\`\n${lesson.code}\n\`\`\``);
  if (Array.isArray(lesson.pitfalls) && lesson.pitfalls.length > 0) {
    lines.push(`ERRORES Y TRADE-OFFS CLAVE:\n${lesson.pitfalls.map((p) => `- ${p}`).join("\n")}`);
  }
  if (lesson.takeaway) lines.push(`REGLA PRÁCTICA FINAL:\n${lesson.takeaway}`);
  return lines.join("\n\n");
}


