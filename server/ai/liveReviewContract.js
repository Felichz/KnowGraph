export function normalizeLiveReview(data) {
  const points = data.points.map((point) => ({ ...point }));
  const covered = points.filter((point) => point.status === "covered").length;
  const partial = points.filter((point) => point.status === "partial").length;
  const totalEssential = points.length;
  const coveragePercent = totalEssential > 0
    ? Math.round(((covered + partial * 0.5) / totalEssential) * 100)
    : 0;
  const fallbackGap = points.find((point) => point.status !== "covered");
  const modelGap = data.hint?.kind === "gap"
    ? points.find((point) => point.status !== "covered" && point.id === data.hint.id)
    : null;
  const genericHint = /idea esencial todavía falta|qué idea esencial|todavía falta explicar/i.test(data.hint?.text ?? "");
  const hint = fallbackGap
    ? modelGap && !genericHint
      ? data.hint
      : data.hint?.kind === "gap" && !genericHint
        ? { ...data.hint, id: fallbackGap.id }
        : {
            id: fallbackGap.id,
            kind: "gap",
            label: fallbackGap.id,
            text: `Falta explicar “${fallbackGap.id}”: qué es, cómo funciona y por qué importa.`,
          }
    : data.hint;

  return {
    points,
    hint,
    coveragePercent: Math.max(0, Math.min(100, coveragePercent)),
    coveredCount: covered,
    partialCount: partial,
    missingCount: Math.max(0, totalEssential - covered - partial),
    totalEssential,
    allEssentialCovered: totalEssential > 0 && covered === totalEssential,
    nextGapId: hint?.kind === "gap" ? hint.id : null,
  };
}
