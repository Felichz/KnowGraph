// Applies a locale overlay to a composed (Spanish) graph. Only text changes: ids, edges,
// prerequisites, colors, hrefs and (unless explicitly overridden) code stay shared.

export function mergeText(base, overlay) {
  if (overlay === undefined || overlay === null) return base;
  if (typeof overlay === "string") return base === undefined || typeof base === "string" ? overlay : base;
  if (Array.isArray(base)) return Array.isArray(overlay) ? base.map((item, index) => mergeText(item, overlay[index])) : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const [key, value] of Object.entries(overlay)) {
      if (key !== "_source" && key in base) out[key] = mergeText(base[key], value);
    }
    return out;
  }
  return base;
}

export function localizeGraph(base, overlay) {
  if (!overlay) return base;
  const meta = overlay.meta ?? {};
  const questionTitles = new Map((base.interviewQuestions ?? []).map((question, index) => [
    question.title, meta.interviewQuestions?.[index]?.title ?? question.title,
  ]));
  const localizeQuestions = (list) => list?.map((question) => ({ ...question, title: questionTitles.get(question.title) ?? question.title }));
  return {
    ...base,
    label: meta.label ?? base.label,
    title: meta.title ?? base.title,
    subtitle: meta.subtitle ?? base.subtitle,
    categories: mergeText(base.categories, meta.categories),
    categoryContext: mergeText(base.categoryContext, meta.categoryContext),
    milestones: mergeText(base.milestones, meta.milestones),
    seniorityBands: mergeText(base.seniorityBands, meta.seniorityBands),
    interviewQuestions: localizeQuestions(base.interviewQuestions),
    nodes: base.nodes.map((node) => {
      const entry = overlay.nodes?.[node.id];
      return {
        ...node,
        label: entry?.label ?? node.label,
        lesson: entry ? mergeText(node.lesson, entry.lesson) : node.lesson,
        interviewQuestions: localizeQuestions(node.interviewQuestions),
      };
    }),
  };
}
