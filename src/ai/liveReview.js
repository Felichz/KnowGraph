export function buildLiveReviewState(points = [], hint = null) {
  const normalizedPoints = Array.isArray(points) ? points.map((point) => ({ ...point })) : [];
  const covered = normalizedPoints.filter((point) => point.status === "covered").length;
  const partial = normalizedPoints.filter((point) => point.status === "partial").length;
  const total = normalizedPoints.length;
  const coveragePercent = total > 0 ? Math.round(((covered + partial * 0.5) / total) * 100) : 0;

  return {
    points: normalizedPoints,
    hint,
    coveragePercent: Math.max(0, Math.min(100, coveragePercent)),
    coveredCount: covered,
    partialCount: partial,
    missingCount: Math.max(0, total - covered - partial),
    totalEssential: total,
    allEssentialCovered: total > 0 && covered === total,
    nextGapId: hint?.kind === "gap" ? hint.id : null,
  };
}
