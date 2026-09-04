// Utilidades visuales compartidas por las vistas alternativas del grafo.
// Solo derivan representación: el estado de negocio (checked, attempts,
// guidance) se recibe ya resuelto desde App.

import { getScoreView } from "../../ai/types.js";

export function getNodeVisual(node, context) {
  const { graph, checked, latestAttemptsByNode, latestDraftsByNode, activeCats, guidance, activeTaskNodeIds } = context;
  const category = graph.categories[node.cat];
  const attempt = latestAttemptsByNode?.get(node.id);
  const draft = latestDraftsByNode?.get(node.id);
  
  let score = attempt ? getScoreView(attempt.evaluation) : null;
  const isChecked = checked.has(node.id);

  if (!score && draft && (draft.harnessScore || draft.harnessPassedThreshold)) {
    const rawScore = Number(draft.harnessScore) || (draft.harnessPassedThreshold ? 100 : 0);
    score = {
      rawScore,
      coveragePercent: Math.min(100, rawScore),
      displayScore: rawScore,
      displayMax: 100,
      status: rawScore >= 95 ? "exceptional" : "strong",
      isMastery: rawScore >= 95 || Boolean(draft.harnessPassedThreshold),
      isExtra: rawScore > 100,
      extraPoints: Math.max(0, rawScore - 100),
      baseProgress: Math.min(100, rawScore),
      thresholdProgress: 95,
    };
  }

  const coverage = score ? Math.min(100, score.coveragePercent) : (isChecked ? 100 : 0);
  const hasActiveTask = Boolean(activeTaskNodeIds?.has(node.id));

  return {
    category,
    color: category?.color ?? "#8f96a5",
    isChecked,
    score,
    coverage,
    extra: score ? Math.max(0, score.extraPoints) : 0,
    guideLevel: guidance?.levelById?.get(node.id) ?? 0,
    dimmed: !activeCats?.has(node.cat),
    hasActiveTask,
  };
}

export const GUIDE_STROKE = { 1: "#F5F1E8", 2: "#E8A33D", 3: "#5AA9FF" };
export const GUIDE_LABEL = { 1: "MEJOR SIGUIENTE", 2: "NIVEL 2", 3: "NIVEL 3" };

export function truncateLabel(text, max = 26) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function nodeAriaLabel(node, visual) {
  const parts = [node.label, `prioridad ${node.priority}`];
  if (visual.isChecked) parts.push("superficie cubierta");
  else if (visual.coverage > 0) parts.push(`cobertura ${visual.coverage} de 100`);
  else parts.push("pendiente");
  if (visual.extra > 0) parts.push(`más ${visual.extra} puntos de excelencia opcional`);
  if (visual.guideLevel > 0) parts.push(visual.guideLevel === 1 ? "mejor siguiente" : `nivel ${visual.guideLevel} de la ruta sugerida`);
  return `${parts.join(". ")}.`;
}

// Arco circular de progreso reutilizable: cobertura 0–100 con el color de la
// categoría y, encima, un arco dorado separado para la zona 101–120.
export function CoverageRings({ cx = 0, cy = 0, radius = 13, visual, stroke = 3 }) {
  const circumference = 2 * Math.PI * radius;
  const extraRadius = radius + 3.5;
  const extraCircumference = 2 * Math.PI * extraRadius;
  return (
    <g className="gv-coverage" aria-hidden="true">
      <circle cx={cx} cy={cy} r={radius} fill="#0B0D13" stroke="#2A2E3A" strokeWidth={stroke} />
      {visual.coverage > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={visual.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(visual.coverage / 100) * circumference} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
      {visual.extra > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={extraRadius}
          fill="none"
          stroke="#E8A33D"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray={`${(visual.extra / 20) * extraCircumference} ${extraCircumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
    </g>
  );
}
