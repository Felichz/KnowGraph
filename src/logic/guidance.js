// Ruta sugerida y contexto de card (portado de legacy/App.jsx; spec 002 §4.3–4.4).

// 3 niveles: 1 + 4 + 4 candidatos no dominados del foco cuyos prerrequisitos están
// dominados o fuera de foco, ordenados por prioridad.
export function getGuidance(nodes, checked, activeCats) {
  const known = new Set(checked);
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const levels = [];
  for (let depth = 0; depth < 3; depth += 1) {
    const available = nodes
      .filter((node) => !known.has(node.id) && activeCats.has(node.cat))
      .filter((node) => node.prerequisites.every((id) => {
        const prerequisite = byId.get(id);
        return !prerequisite || !activeCats.has(prerequisite.cat) || known.has(id);
      }))
      .sort((a, b) => a.priority - b.priority);
    const selected = available.slice(0, depth === 0 ? 1 : 4);
    levels.push(selected);
    selected.forEach((node) => known.add(node.id));
  }
  const levelById = new Map();
  levels.forEach((level, index) => level.forEach((node) => levelById.set(node.id, index + 1)));
  return { levels, levelById, primary: levels[0]?.[0] ?? null };
}

export function getLessonContext(node, prerequisites, missingPrerequisites, categoryContext = {}) {
  const phase = categoryContext[node.cat] ?? "";
  const lead = phase ? `${phase} ` : "";
  if (!prerequisites.length) return `${lead}Este es el punto de partida: no presupone ningún nodo anterior.`;
  const names = prerequisites.map((item) => item.label).join(" y ");
  if (missingPrerequisites.length) {
    return `${lead}Antes de estudiar este nodo necesitás completar: ${missingPrerequisites.map((item) => item.label).join(" y ")}. Esos conceptos aparecen aquí como base, no como detalle opcional.`;
  }
  return `${lead}Llegaste acá después de ${names}; este nodo usa esas ideas y agrega una decisión nueva.`;
}

// Antes / Después / siguiente en foco para el riel de contexto.
export function getNodeNeighbors(graph, node, activeCats, checked) {
  const byId = graph.nodeById ?? new Map(graph.nodes.map((item) => [item.id, item]));
  const inFocus = (item) => activeCats.has(item.cat);
  const prerequisites = node.prerequisites.map((id) => byId.get(id)).filter(Boolean);
  const before = prerequisites.filter(inFocus);
  const missing = prerequisites.filter((item) => !checked.has(item.id));
  const after = graph.nodes
    .filter((item) => item.prerequisites.includes(node.id) && inFocus(item))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);
  const next = graph.nodes
    .filter((item) => inFocus(item) && item.priority > node.priority)
    .sort((a, b) => a.priority - b.priority)[0] ?? null;
  const previous = graph.nodes
    .filter((item) => inFocus(item) && item.priority < node.priority)
    .sort((a, b) => b.priority - a.priority)[0] ?? null;
  return { prerequisites, before, missing, after, next, previous };
}
