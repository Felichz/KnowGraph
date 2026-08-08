import assert from "node:assert/strict";
import { normalizeLiveReview } from "../ai/liveReviewContract.js";
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
