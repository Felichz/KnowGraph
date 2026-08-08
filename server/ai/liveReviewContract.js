import { displayScoreFromRaw } from "./schemas.js";

const RUBRIC_KEYS = ["accuracy", "causalityAndTradeoffs", "application", "completeness"];

export function normalizeLiveReview(data) {
  if (!data.scoreSummary && Array.isArray(data.points)) return normalizeLegacyLiveReview(data);
  const rubric = data.scoreSummary?.rubric ?? {};
  const rawScore = RUBRIC_KEYS.reduce((sum, key) => sum + Number(rubric[key]?.score ?? 0), 0);
  const displayScore = displayScoreFromRaw(rawScore);
  const completeness = rubric.completeness;
  const allEssentialCovered = Number(completeness?.score) >= Number(completeness?.max);

  return {
    scoreSummary: { rubric },
    rawScore,
    displayScore,
    displayMax: 120,
    isExtra: displayScore > 100,
    hint: data.hint,
    additionalGaps: data.additionalGaps ?? [],
    // Compatibilidad con la UI/cache anterior durante la migraciÃ³n.
    coveragePercent: Math.min(100, displayScore),
    allEssentialCovered,
    nextGapId: data.hint?.kind === "gap" ? data.hint.id : null,
  };
}

function normalizeLegacyLiveReview(data) {
  const points = data.points.map((point) => ({ ...point }));
  const covered = points.filter((point) => point.status === "covered").length;
  const partial = points.filter((point) => point.status === "partial").length;
  const total = points.length;
  const coveragePercent = total > 0 ? Math.round(((covered + partial * 0.5) / total) * 100) : 0;
  const fallbackGap = points.find((point) => point.status !== "covered");
  const genericHint = /idea esencial todavía falta|qué idea esencial|todavía falta explicar/i.test(data.hint?.text ?? "");
  const hint = fallbackGap && genericHint
    ? { ...data.hint, id: fallbackGap.id, text: `Falta explicar “${fallbackGap.id}”: qué es, cómo funciona y por qué importa.` }
    : data.hint?.kind === "gap" && fallbackGap && data.hint.id !== fallbackGap.id
      ? { ...data.hint, id: fallbackGap.id }
      : data.hint;

  return {
    points,
    hint,
    additionalGaps: [],
    coveragePercent,
    coveredCount: covered,
    partialCount: partial,
    missingCount: Math.max(0, total - covered - partial),
    totalEssential: total,
    allEssentialCovered: total > 0 && covered === total,
    nextGapId: hint?.kind === "gap" ? hint.id : null,
  };
}
