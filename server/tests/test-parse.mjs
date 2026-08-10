// Test del parse strategy. No requiere gateway ni red.
// Ejecutar: node test-parse.mjs

import { parseStructuredResponse } from "../ai/parse.js";
import { EvaluationZod, EvaluationWireZod, normalizeEvaluationWire } from "../ai/schemas.js";
import { extractCompletedFields } from "../ai/partialJson.js";
import { extractStreamingBlocks } from "../ai/streamBlocks.js";

const validEval = {
  scoreSummary: {
    rubric: {
      accuracy: { score: 30, max: 40 },
      causalityAndTradeoffs: { score: 20, max: 25 },
      application: { score: 15, max: 20 },
      completeness: { score: 10, max: 15 },
    },
  },
  feedback: {
    rubricNotes: {
      accuracy: "ok",
      causalityAndTradeoffs: "ok",
      application: "ok",
      completeness: "ok",
    },
    strengths: ["a", "b"],
    gaps: [],
    misconceptions: [],
    nextAttemptPrompt: "x",
    conciseVerdict: "y",
  },
};

const minimaxEval = normalizeEvaluationWire({
  scoreSummary: { accuracy: 40, causalityAndTradeoffs: 25, application: 20, completeness: 15 },
  feedback: {
    rubricNotes: validEval.feedback.rubricNotes,
    strengths: "Explicacion completa.",
    gaps: "Aclarar un matiz.",
    misconceptions: "Corregir la distincion entre fases.",
    nextAttemptPrompt: "Aclarar el matiz.",
    conciseVerdict: "Respuesta solida.",
  },
});
EvaluationWireZod.parse({
  ...minimaxEval,
  feedback: {
    ...minimaxEval.feedback,
    gaps: "Aclarar un matiz.",
    misconceptions: "Corregir la distincion entre fases.",
  },
});
EvaluationZod.parse(minimaxEval);

const spanishSeverityEval = normalizeEvaluationWire({
  scoreSummary: validEval.scoreSummary,
  feedback: {
    ...validEval.feedback,
    gaps: [{
      topic: "Propagación",
      severity: "baja",
      explanation: "Falta precisar una parte del flujo.",
      revisionHint: "Agregá esa precisión.",
    }],
  },
});
if (spanishSeverityEval.feedback.gaps[0].severity !== "low") {
  throw new Error("La severidad localizada de MiniMax no se normalizó");
}
EvaluationZod.parse(spanishSeverityEval);

const tests = [
  {
    name: "JSON limpio",
    raw: { choices: [{ message: { content: JSON.stringify(validEval) } }] },
    expectOk: true,
  },
  {
    name: "JSON envuelto en prosa",
    raw: { choices: [{ message: { content: "Acá va el JSON:\n" + JSON.stringify(validEval) + "\nListo." } }] },
    expectOk: true,
  },
  {
    name: "JSON inválido (sin repair)",
    raw: { choices: [{ message: { content: "{\"rubric\": {" } }] },
    expectOk: false,
    repair: async () => null,
  },
  {
    name: "JSON inválido con repair exitoso",
    raw: { choices: [{ message: { content: "{ broken" } }] },
    expectOk: true,
    repair: async () => JSON.stringify(validEval),
  },
  {
    name: "JSON inválido con repair que devuelve basura",
    raw: { choices: [{ message: { content: "{ broken" } }] },
    expectOk: false,
    repair: async () => "still broken",
  },
  {
    name: "score > max debe fallar",
    raw: { choices: [{ message: { content: JSON.stringify({
      ...validEval,
        scoreSummary: {
          ...validEval.scoreSummary,
          rubric: {
            ...validEval.scoreSummary.rubric,
            accuracy: { score: 100, max: 40 },
          },
        },
    }) } }] },
    expectOk: false,
  },
  {
    name: "score = max debe pasar",
    raw: { choices: [{ message: { content: JSON.stringify({
      ...validEval,
        scoreSummary: {
          ...validEval.scoreSummary,
          rubric: {
            ...validEval.scoreSummary.rubric,
            accuracy: { score: 40, max: 40 },
          },
        },
    }) } }] },
    expectOk: true,
  },
  {
    name: "max de dimensión debe ser canónico",
    raw: { choices: [{ message: { content: JSON.stringify({
      ...validEval,
        scoreSummary: {
          ...validEval.scoreSummary,
          rubric: {
            ...validEval.scoreSummary.rubric,
            accuracy: { score: 20, max: 100 },
          },
        },
    }) } }] },
    expectOk: false,
  },
];

const emitted = new Set();
const partialSource = JSON.stringify({
  scoreSummary: validEval.scoreSummary,
  feedback: validEval.feedback,
});
const partialFields = extractCompletedFields(partialSource, emitted);
if (partialFields.length !== 2 || partialFields[0].key !== "scoreSummary" || partialFields[1].key !== "feedback") {
  throw new Error("partial JSON extractor no detectó los campos completos en orden");
}
if (extractCompletedFields(partialSource, emitted).length !== 0) {
  throw new Error("partial JSON extractor emitió campos duplicados");
}
console.log("✓ partial JSON: campos completos sin duplicados");

const liveBlocks = extractStreamingBlocks('{"scoreSummary":{"rubric":{"accuracy":{"score":3,"max":40}}},"feedback":{"rubricNotes":{"accuracy":"Identifica el mecanismo');
const liveNote = liveBlocks.find((block) => block.id === "feedback.rubricNotes.accuracy");
if (!liveNote || liveNote.value !== "Identifica el mecanismo" || liveNote.complete) {
  throw new Error("streamBlocks no detecto el bloque de texto incompleto");
}
const liveStrength = extractStreamingBlocks('{"feedback":{"strengths":["Reconoce el snapshot inmutable');
if (liveStrength[0]?.id !== "feedback.strengths[0]" || liveStrength[0]?.value !== "Reconoce el snapshot inmutable") {
  throw new Error("streamBlocks no detecto un item parcial de strengths");
}
const orderedBlocks = extractStreamingBlocks(JSON.stringify(validEval));
const orderedScoreIds = orderedBlocks
  .filter((block) => block.id.endsWith(".score"))
  .map((block) => block.id);
const expectedScoreIds = [
  "scoreSummary.rubric.accuracy.score",
  "scoreSummary.rubric.causalityAndTradeoffs.score",
  "scoreSummary.rubric.application.score",
  "scoreSummary.rubric.completeness.score",
];
if (JSON.stringify(orderedScoreIds) !== JSON.stringify(expectedScoreIds)) {
  throw new Error("la rúbrica no emite los subscores en el orden esperado");
}
console.log("streaming blocks: inicio de bloque y texto parcial detectados");

let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    const result = await parseStructuredResponse({ raw: t.raw, schema: EvaluationZod, repair: t.repair });
    if (t.expectOk && result.data) {
      console.log(`✓ ${t.name} → attempts=${result.attempts}`);
      passed++;
    } else {
      console.log(`✗ ${t.name} → esperaba ok=${t.expectOk}, obtuve data=${!!result.data}`);
      failed++;
    }
  } catch (e) {
    if (!t.expectOk) {
      console.log(`✓ ${t.name} → error esperado: ${e.code}`);
      passed++;
    } else {
      console.log(`✗ ${t.name} → error inesperado: ${e.message}`);
      failed++;
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
