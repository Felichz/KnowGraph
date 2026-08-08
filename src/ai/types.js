export const RAW_SCORE_MAX = 100;
export const DISPLAY_SCORE_MAX = 120;
export const MASTERY_RAW_SCORE = 80;
export const EXTRA_RAW_SCORE_START = 80;

export const STATUS_LABEL = {
  strong: "Base cubierta",
  exceptional: "Profundización extra",
  developing: "En progreso",
  review: "Conviene revisar",
};

export const SEVERITY_LABEL = {
  high: "alto",
  medium: "medio",
  low: "bajo",
};

export function displayScoreFromRaw(rawScore) {
  const raw = clamp(Math.round(Number(rawScore) || 0), 0, RAW_SCORE_MAX);
  if (raw <= MASTERY_RAW_SCORE) return Math.round(raw * (100 / MASTERY_RAW_SCORE));
  return 100 + (raw - MASTERY_RAW_SCORE);
}

export function statusFromRawScore(rawScore) {
  const raw = clamp(Math.round(Number(rawScore) || 0), 0, RAW_SCORE_MAX);
  if (raw >= 90) return "exceptional";
  if (raw >= MASTERY_RAW_SCORE) return "strong";
  if (raw >= 60) return "developing";
  return "review";
}

export function statusFromDisplayScore(displayScore) {
  const score = clamp(Math.round(Number(displayScore) || 0), 0, DISPLAY_SCORE_MAX);
  if (score >= 101) return "exceptional";
  if (score >= 100) return "strong";
  if (score >= 60) return "developing";
  return "review";
}

export function getScoreView(evaluation) {
  if (!evaluation) return null;

  const rawScore = Number.isFinite(evaluation.rawScore)
    ? evaluation.rawScore
    : scoreFromRubric(evaluation.rubric, evaluation.score);
  const coveragePercent = Number.isFinite(evaluation.coveragePercent)
    ? clamp(evaluation.coveragePercent, 0, 100)
    : completionPercentFromRubric(evaluation.rubric);
  const legacyExtra = coveragePercent >= 100 ? Math.max(0, Math.round(rawScore) - MASTERY_RAW_SCORE) : 0;
  const displayScore = Number.isFinite(evaluation.scoreScaleVersion) && evaluation.scoreScaleVersion >= 3
    ? clamp(evaluation.score, 0, DISPLAY_SCORE_MAX)
    : coveragePercent + Math.min(20, legacyExtra);
  const extraPoints = Math.max(0, displayScore - 100);

  return {
    rawScore: Math.round(rawScore),
    coveragePercent,
    displayScore,
    displayMax: DISPLAY_SCORE_MAX,
    status: statusFromDisplayScore(displayScore),
    isMastery: displayScore >= 100,
    isExtra: displayScore > 100,
    extraPoints,
    baseProgress: Math.min(100, (displayScore / DISPLAY_SCORE_MAX) * 100),
    thresholdProgress: (100 / DISPLAY_SCORE_MAX) * 100,
  };
}

export function formatEvaluationDuration(durationMs) {
  if (!Number.isFinite(durationMs) || durationMs < 0) return null;
  const totalSeconds = durationMs / 1000;
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)} s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}

export function getCompletionView(evaluation) {
  const dimension = evaluation?.rubric?.completeness;
  const percent = dimension?.max > 0
    ? Math.round((dimension.score / dimension.max) * 100)
    : 0;
  return {
    percent: Math.max(0, Math.min(100, percent)),
    score: dimension?.score ?? 0,
    max: dimension?.max ?? 15,
    isComplete: percent >= 100,
  };
}

export function isEvaluationSurfaceComplete(evaluation) {
  return Boolean(getScoreView(evaluation)?.isMastery);
}

function scoreFromRubric(rubric, fallback) {
  if (rubric) {
    return clamp(
      Number(rubric.accuracy?.score || 0)
        + Number(rubric.causalityAndTradeoffs?.score || 0)
        + Number(rubric.application?.score || 0)
        + Number(rubric.completeness?.score || 0),
      0,
      RAW_SCORE_MAX,
    );
  }
  return clamp(Number(fallback) || 0, 0, RAW_SCORE_MAX);
}

function completionPercentFromRubric(rubric) {
  const dimension = rubric?.completeness;
  if (!dimension || dimension.max <= 0) return 0;
  return clamp(Math.round((dimension.score / dimension.max) * 100), 0, 100);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
