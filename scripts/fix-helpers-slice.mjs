import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.resolve(__dirname, "..", "src", "App.jsx");

let content = fs.readFileSync(appPath, "utf8");

const startMarker = "function getGuidance(nodes, checked, activeCats) {";
const endMarker = "export default function App() {";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const cleanMiddle = `function getGuidance(nodes, checked, activeCats) {
  const known = new Set(checked);
  const levels = [];

  for (let depth = 0; depth < 3; depth += 1) {
    const available = nodes
      .filter((node) => !known.has(node.id) && activeCats.has(node.cat))
      .filter((node) => node.prerequisites.every((id) => {
        const prerequisite = nodes.find((candidate) => candidate.id === id);
        return !prerequisite || !activeCats.has(prerequisite.cat) || known.has(id);
      }))
      .sort((a, b) => a.priority - b.priority);
    const selectedForLevel = available.slice(0, depth === 0 ? 1 : 4);
    levels.push(selectedForLevel);
    selectedForLevel.forEach((node) => known.add(node.id));
  }

  const levelById = new Map();
  levels.forEach((level, index) => level.forEach((node) => levelById.set(node.id, index + 1)));
  return { levels, levelById, primary: levels[0]?.[0] ?? null };
}

function getLessonContext(node, prerequisites, missingPrerequisites, categoryContext) {
  const phase = categoryContext[node.cat];
  if (!prerequisites.length) return \`\${phase} Este es el punto de partida: no presupone ningún nodo anterior.\`;
  const names = prerequisites.map((item) => item.label).join(" y ");
  if (missingPrerequisites.length) return \`\${phase} Antes de estudiar este nodo necesitás completar: \${missingPrerequisites.map((item) => item.label).join(" y ")}. Esos conceptos aparecen aquí como base, no como detalle opcional.\`;
  return \`\${phase} Llegaste acá después de \${names}; este nodo usa esas ideas y agrega una decisión nueva.\`;
}

function getMilestoneProgress(milestones, checked, nodeIds) {
  return milestones.map((milestone) => {
    const ids = milestone.nodeIds.filter((id) => nodeIds.has(id));
    const done = ids.filter((id) => checked.has(id)).length;
    return {
      ...milestone,
      done,
      total: ids.length,
      percentage: ids.length ? Math.round((done / ids.length) * 100) : 0,
    };
  });
}

function getSeniorityProgress(bands, checked, nodeIds) {
  const completedBands = new Set();

  return bands.map((band) => {
    const ids = band.nodeIds.filter((id) => nodeIds.has(id));
    const done = ids.filter((id) => checked.has(id)).length;
    const percentage = ids.length ? Math.round((done / ids.length) * 100) : 0;
    const requirementsMet = band.requires.every((id) => completedBands.has(id));
    const complete = requirementsMet && percentage === 100;
    if (complete) completedBands.add(band.id);

    return {
      ...band,
      done,
      total: ids.length,
      percentage,
      requirementsMet,
      complete,
    };
  });
}

`;

  const newContent = content.slice(0, startIndex) + cleanMiddle + content.slice(endIndex);
  fs.writeFileSync(appPath, newContent, "utf8");
  console.log("Successfully replaced middle helpers with clean implementations!");
} else {
  console.log("Markers not found:", { startIndex, endIndex });
}
