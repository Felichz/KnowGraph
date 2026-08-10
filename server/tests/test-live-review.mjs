import assert from "node:assert/strict";
import { normalizeLiveReview } from "../ai/liveReviewContract.js";
import { normalizeLiveReviewWire } from "../ai/liveReview.js";
import { extractCompletedFields } from "../ai/partialJson.js";

const source = JSON.stringify({
  points: [
    { id: "snapshot", status: "covered" },
    { id: "mutation", status: "partial" },
  ],
  hint: { id: "mutation", kind: "gap", label: "Mutación", text: "¿Qué problema produce?" },
});
const fields = extractCompletedFields(source);
assert.deepEqual(fields.map((field) => field.key), ["points", "hint"]);

const modernSource = JSON.stringify({
  scoreSummary: { rubric: { accuracy: { score: 20, max: 40 } } },
  coverage: [{ id: "snapshot", status: "covered" }],
  hint: { id: "mutation", kind: "gap", label: "Mutación", text: "¿Qué problema produce?" },
  additionalGaps: [{ topic: "detalle", severity: "low", explanation: "explicación", revisionHint: "ampliá el ejemplo" }],
});
const modernFields = extractCompletedFields(modernSource);
assert.deepEqual(modernFields.map((field) => field.key), ["scoreSummary", "coverage", "hint"]);

const minimaxShorthand = normalizeLiveReviewWire({
  scoreSummary: { accuracy: 36, causalityAndTradeoffs: 22, application: 17, completeness: 14 },
  coverage: [{ id: "step_1", status: "covered" }],
  hint: { text: "Profundiza en el ciclo del handler.", detail: "Explicacion del ciclo." },
});
assert.deepEqual(minimaxShorthand.scoreSummary, {
  rubric: {
    accuracy: { score: 36, max: 40 },
    causalityAndTradeoffs: { score: 22, max: 25 },
    application: { score: 17, max: 20 },
    completeness: { score: 14, max: 15 },
  },
});
assert.equal(minimaxShorthand.hint.id, "hint-001");
assert.equal(minimaxShorthand.hint.kind, "refinement");
assert.deepEqual(minimaxShorthand.additionalGaps, []);

const shorthandGaps = normalizeLiveReviewWire({
  scoreSummary: { accuracy: 1, causalityAndTradeoffs: 1, application: 1, completeness: 1 },
  coverage: [],
  hint: { text: "Explica el estado pending." },
  additionalGaps: ["Diferencia onClick de onClickCapture."],
});
assert.deepEqual(shorthandGaps.additionalGaps, [{
  topic: "Diferencia onClick de onClickCapture.",
  severity: "low",
  explanation: "Diferencia onClick de onClickCapture.",
  revisionHint: "Diferencia onClick de onClickCapture.",
}]);

const review = normalizeLiveReview(JSON.parse(source));
assert.equal(review.coveragePercent, 75);
assert.equal(review.coveredCount, 1);
assert.equal(review.partialCount, 1);
assert.equal(review.missingCount, 0);
assert.equal(review.allEssentialCovered, false);
assert.equal(review.nextGapId, "mutation");
assert.equal(review.hint.label, "Mutación");

const mismatchedHint = normalizeLiveReview({
  points: [
    { id: "snapshot", status: "covered" },
    { id: "state_mutation", status: "missing" },
  ],
  hint: { id: "mutation", kind: "gap", label: "Mutación", text: "¿Cómo afecta la mutación directa?" },
});
assert.equal(mismatchedHint.nextGapId, "state_mutation");
assert.match(mismatchedHint.hint.text, /mutación directa/i);

const genericHint = normalizeLiveReview({
  points: [{ id: "request_lifecycle", status: "missing" }],
  hint: { id: "wrong_id", kind: "gap", label: "Gap", text: "¿Qué idea esencial todavía falta explicar?" },
});
assert.match(genericHint.hint.text, /request_lifecycle/);

console.log("live review: OK");
