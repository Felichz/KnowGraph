// «Continuar» y orden de repaso (specs/004-ui-flow): se derivan de borradores e intentos ya guardados,
// sin estado nuevo que persistir.

export function lastActivityAt(p) {
  const draft = p?.draft?.updatedAt ?? "";
  const attempt = p?.attempts?.at(-1)?.createdAt ?? "";
  return draft > attempt ? draft : attempt;
}

// Etapa en la que retomar: sin intento → seguir el borrador; con intento por debajo de 100 → mejorarlo.
function resumeStage(p) {
  if (p.attempts?.length) return p.hasDraft && p.draft?.text?.trim() !== p.representative?.answer?.trim() ? "evaluate" : "paraphrase";
  return p.hasDraft ? "paraphrase" : "read";
}

// Card más reciente con actividad que aún no está dominada.
export function resumeTarget(nodes, progress) {
  let best = null;
  nodes.forEach((node) => {
    const p = progress.of(node.id);
    if (p.isComplete) return;
    const at = lastActivityAt(p);
    if (at && (!best || at > best.at)) best = { node, p, at, stage: resumeStage(p) };
  });
  return best;
}

// Repaso: primero lo trabajado y flojo (nota ascendente), luego lo dominado, al final lo no intentado.
export function reviewOrder(nodes, progress) {
  const rank = (p) => (p.attempts?.length || p.hasDraft ? (p.isComplete ? 1 : 0) : 2);
  return [...nodes].sort((a, b) => {
    const pa = progress.of(a.id);
    const pb = progress.of(b.id);
    return rank(pa) - rank(pb) || (pa.displayScore ?? -1) - (pb.displayScore ?? -1) || a.priority - b.priority;
  });
}

// Cards trabajadas que aún no llegan a 100: lo que conviene repasar.
export function reviewCount(nodes, progress) {
  return nodes.filter((node) => {
    const p = progress.of(node.id);
    return (p.attempts?.length || p.hasDraft) && !p.isComplete;
  }).length;
}

// Calor de una celda (DESIGN v4 §8.1): 0 vacía · 1 con borrador · 2 nota < 60 · 3 nota 60–99 · 4 dominada (100+).
export function heatLevel(p) {
  const score = p?.displayScore;
  if (p?.isComplete || (typeof score === "number" && score >= 100)) return 4;
  if (typeof score === "number") return score >= 60 ? 3 : 2;
  return p?.attempts?.length || p?.hasDraft ? 1 : 0;
}

// Estado visual común (lista, grafo, flashcards): mastered incluye 101–120; extra solo añade la ★.
export function scoreTier(p) {
  const score = p?.displayScore;
  if (typeof score === "number" && score > 100) return "extra";
  if (p?.isComplete || (typeof score === "number" && score >= 100)) return "mastered";
  if (typeof score === "number") return "progress";
  return "none";
}
