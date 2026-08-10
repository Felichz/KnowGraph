import { displayScoreFromRaw } from "./schemas.js";

const RUBRIC_KEYS = ["accuracy", "causalityAndTradeoffs", "application", "completeness"];

export function normalizeLiveReview(data) {
  if (!data.scoreSummary && Array.isArray(data.points)) return normalizeLegacyLiveReview(data);
  const rubric = data.scoreSummary?.rubric ?? {};
  const rawScore = RUBRIC_KEYS.reduce((sum, key) => sum + Number(rubric[key]?.score ?? 0), 0);
  const displayScore = displayScoreFromRaw(rawScore);
  const completeness = rubric.completeness;
  const allEssentialCovered = Number(completeness?.score) >= Number(completeness?.max);
  const hint = normalizeHint(data.hint);

  return {
    scoreSummary: { rubric },
    rawScore,
    displayScore,
    displayMax: 120,
    isExtra: displayScore > 100,
    coverage: normalizeCoverage(data.coverage),
    hint,
    additionalGaps: data.additionalGaps ?? [],
    // Compatibilidad con la UI/cache anterior durante la migraciÃ³n.
    coveragePercent: Math.min(100, displayScore),
    allEssentialCovered,
    nextGapId: hint?.kind === "gap" ? hint.id : null,
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
    ? {
      ...data.hint,
      id: fallbackGap.id,
      text: `Falta explicar “${fallbackGap.id}”.`,
      detail: `Explicá qué es “${fallbackGap.id}”, cómo funciona y por qué importa en el contexto de esta card.`,
    }
    : data.hint?.kind === "gap" && fallbackGap && data.hint.id !== fallbackGap.id
      ? { ...data.hint, id: fallbackGap.id }
      : data.hint;
  const normalizedHint = normalizeHint(hint);

  return {
    points,
    coverage: points.map(({ id, status }) => ({ id, status })),
    hint: normalizedHint,
    additionalGaps: [],
    coveragePercent,
    coveredCount: covered,
    partialCount: partial,
    missingCount: Math.max(0, total - covered - partial),
    totalEssential: total,
    allEssentialCovered: total > 0 && covered === total,
    nextGapId: normalizedHint?.kind === "gap" ? normalizedHint.id : null,
  };
}

function normalizeHint(hint) {
  if (!hint) return null;
  const text = String(hint.text ?? "").trim();
  const detail = String(hint.detail ?? "").trim() || text;
  return { ...hint, text, detail };
}

function normalizeCoverage(coverage) {
  if (!Array.isArray(coverage)) return [];
  return coverage
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      id: item.id,
      status: ["covered", "partial", "missing"].includes(item.status) ? item.status : "missing",
    }));
}
