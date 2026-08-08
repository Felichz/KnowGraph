import { displayScoreFromRaw } from "./types.js";

const RUBRIC_KEYS = ["accuracy", "causalityAndTradeoffs", "application", "completeness"];

export function buildLiveReviewState(scoreSummary = null, hint = null, additionalGaps = []) {
  const rubric = scoreSummary?.rubric ?? null;
  const hasScores = rubric && RUBRIC_KEYS.every((key) => Number.isFinite(Number(rubric[key]?.score)));
  const rawScore = hasScores
    ? RUBRIC_KEYS.reduce((sum, key) => sum + Number(rubric[key].score), 0)
    : null;
  const displayScore = rawScore === null ? null : displayScoreFromRaw(rawScore);
  const completeness = rubric?.completeness;
  const allEssentialCovered = Boolean(completeness && Number(completeness.score) >= Number(completeness.max));

  return {
    scoreSummary: scoreSummary ? { rubric } : null,
    rawScore,
    displayScore,
    displayMax: 120,
    isExtra: displayScore !== null && displayScore > 100,
    hint,
    additionalGaps: Array.isArray(additionalGaps) ? additionalGaps : [],
    coveragePercent: displayScore === null ? 0 : Math.min(100, displayScore),
    allEssentialCovered,
    nextGapId: hint?.kind === "gap" ? hint.id : null,
  };
}
