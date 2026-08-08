import assert from "node:assert/strict";
import { selectRepresentativeAttempt } from "../../src/ai/attemptSelection.js";

function attempt(score, createdAt) {
  return {
    createdAt,
    evaluation: {
      score,
      rawScore: score,
      scoreScaleVersion: 3,
      coveragePercent: Math.min(score, 100),
      rubric: {},
    },
  };
}

const oldBest = attempt(110, "2026-08-08T10:00:00.000Z");
const recentWithinMargin = attempt(105, "2026-08-08T11:00:00.000Z");
assert.equal(selectRepresentativeAttempt([oldBest, recentWithinMargin]), recentWithinMargin);

const recentTooLow = attempt(104, "2026-08-08T12:00:00.000Z");
assert.equal(selectRepresentativeAttempt([oldBest, recentTooLow]), oldBest);

console.log("attempt selection: OK");
