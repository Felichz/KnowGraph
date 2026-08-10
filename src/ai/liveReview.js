import { displayScoreFromRaw } from "./types.js";

const RUBRIC_KEYS = ["accuracy", "causalityAndTradeoffs", "application", "completeness"];

export function buildLiveReviewState(scoreSummary = null, hint = null, additionalGaps = [], coverage = []) {
  const rubric = scoreSummary?.rubric ?? null;
  const hasScores = rubric && RUBRIC_KEYS.every((key) => Number.isFinite(Number(rubric[key]?.score)));
  const rawScore = hasScores
    ? RUBRIC_KEYS.reduce((sum, key) => sum + Number(rubric[key].score), 0)
    : null;
  const displayScore = rawScore === null ? null : displayScoreFromRaw(rawScore);
  const completeness = rubric?.completeness;
  const allEssentialCovered = Boolean(completeness && Number(completeness.score) >= Number(completeness.max));
  const normalizedHint = normalizeHint(hint);

  return {
    scoreSummary: scoreSummary ? { rubric } : null,
    rawScore,
    displayScore,
    displayMax: 120,
    isExtra: displayScore !== null && displayScore > 100,
    coverage: Array.isArray(coverage) ? coverage : [],
    hint: normalizedHint,
    additionalGaps: Array.isArray(additionalGaps) ? additionalGaps : [],
    coveragePercent: displayScore === null ? 0 : Math.min(100, displayScore),
    allEssentialCovered,
    nextGapId: normalizedHint?.kind === "gap" ? normalizedHint.id : null,
  };
}

export function normalizeLiveReviewState(review) {
  if (!review) return null;
  const coverage = Array.isArray(review.coverage)
    ? review.coverage
    : Array.isArray(review.points)
      ? review.points.map(({ id, status }) => ({ id, status }))
      : [];
  return { ...review, coverage, hint: normalizeHint(review.hint) };
}

function normalizeHint(hint) {
  if (!hint) return null;
  const text = String(hint.text ?? "").trim();
  const detail = String(hint.detail ?? "").trim() || text;
  return { ...hint, text, detail };
}
