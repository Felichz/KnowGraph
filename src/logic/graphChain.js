// Foco del grafo (specs/003-graph-view §F): cadena completa de prerrequisitos (transitiva)
// y lo que el concepto desbloquea directamente.
export function collectChain(nodeId, layout) {
  const empty = { ancestors: new Set(), unlocks: new Set(), nodes: new Set(), chainEdges: new Set(), outEdges: new Set() };
  if (!nodeId || !layout.positions.has(nodeId)) return empty;
  const ancestors = new Set();
  const stack = [...(layout.parents.get(nodeId) ?? [])];
  while (stack.length) {
    const id = stack.pop();
    if (ancestors.has(id) || id === nodeId) continue;
    ancestors.add(id);
    stack.push(...(layout.parents.get(id) ?? []));
  }
  const unlocks = new Set(layout.children.get(nodeId) ?? []);
  const chainEdges = new Set();
  const outEdges = new Set();
  layout.edges.forEach(([source, target]) => {
    const key = `${source}->${target}`;
    if (ancestors.has(source) && (target === nodeId || ancestors.has(target))) chainEdges.add(key);
    else if (source === nodeId && unlocks.has(target)) outEdges.add(key);
  });
  return { ancestors, unlocks, nodes: new Set([nodeId, ...ancestors, ...unlocks]), chainEdges, outEdges };
}

// Estado de un concepto según el progreso: extra / mastered / progress / available / blocked.
export function nodeState(node, progress) {
  const p = progress.of(node.id);
  const missing = node.prerequisites.filter((id) => !progress.checked.has(id));
  const score = p.displayScore;
  if (typeof score === "number" && score > 100) return { kind: "extra", p, missing };
  if (p.isComplete || progress.checked.has(node.id)) return { kind: "mastered", p, missing };
  if (typeof score === "number") return { kind: "progress", p, missing };
  return { kind: missing.length ? "blocked" : "available", p, missing };
}
