export function buildCoachChecklist(node) {
  const lesson = node?.lesson ?? {};
  return {
    steps: (Array.isArray(lesson.steps) ? lesson.steps : []).map((text, index) => ({
      id: `step_${index + 1}`,
      text: String(text),
    })),
    tradeoffs: (Array.isArray(lesson.pitfalls) ? lesson.pitfalls : []).map((text, index) => ({
      id: `tradeoff_${index + 1}`,
      text: String(text),
    })),
  };
}

export function mergeCoachCoverage(checklist, coverage) {
  const coverageById = new Map(
    (Array.isArray(coverage) ? coverage : []).map((item) => [item.id, item.status]),
  );
  return [
    ...checklist.steps.map((item) => ({ ...item, group: "steps", status: coverageById.get(item.id) ?? "pending" })),
    ...checklist.tradeoffs.map((item) => ({ ...item, group: "tradeoffs", status: coverageById.get(item.id) ?? "pending" })),
  ];
}
