import graph from "../src/reactGraph.js";
import { findDeepDiveMatches, REACT_DEEP_DIVES } from "../src/reactDeepDives.js";
import { buildInterviewQuizQuestion, getQuizForNode } from "../src/reactQuiz.js";

const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};
const normalized = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();

const auditQuizQuestion = (question, prefix, { minPromptLength = 25 } = {}) => {
  assert(question.prompt?.length >= minPromptLength, `${prefix} tiene una pregunta de quiz demasiado corta.`);
  assert(question.options?.length === 4, `${prefix} debe ofrecer cuatro opciones.`);
  assert(question.options?.every((option) => option.text?.length >= 20), `${prefix} tiene una opción superficial.`);
  assert(question.options?.some((option) => option.id === question.correctOptionId), `${prefix} no tiene respuesta correcta válida.`);
  assert(question.explanation?.length >= 35, `${prefix} necesita explicación posterior a la respuesta.`);

  const correctLength = question.options.find((option) => option.id === question.correctOptionId)?.text.length ?? 0;
  const distractorLengths = question.options
    .filter((option) => option.id !== question.correctOptionId)
    .map((option) => option.text.length);
  const allLengths = question.options.map((option) => option.text.length);
  const shortestDistractor = Math.min(...distractorLengths);
  const widestSpread = Math.max(...allLengths) / Math.min(...allLengths);
  assert(correctLength <= shortestDistractor * 1.35, `${prefix} tiene una respuesta correcta demasiado más larga que sus distractores.`);
  assert(widestSpread <= 1.65, `${prefix} tiene opciones con una diferencia de longitud demasiado visible.`);
};

const ids = graph.nodes.map((node) => node.id);
const idSet = new Set(ids);
assert(ids.length >= 100, `Se esperaban al menos 100 nodos React; hay ${ids.length}.`);
assert(idSet.size === ids.length, "Hay ids de nodos duplicados.");

const priorities = graph.nodes.map((node) => node.priority).sort((a, b) => a - b);
assert(new Set(priorities).size === priorities.length, "Hay prioridades duplicadas.");
assert(priorities.every((priority, index) => priority === index + 1), "Las prioridades no forman una secuencia continua desde 1.");

for (const node of graph.nodes) {
  const prefix = `${node.id}:`;
  assert(Boolean(graph.categories[node.cat]), `${prefix} categoría inexistente ${node.cat}.`);
  assert(node.label?.length >= 4, `${prefix} label vacío o demasiado corto.`);
  assert(node.prerequisites.every((id) => idSet.has(id)), `${prefix} contiene un prerrequisito inexistente.`);
  for (const prerequisiteId of node.prerequisites) {
    const prerequisite = graph.nodes.find((candidate) => candidate.id === prerequisiteId);
    assert(prerequisite.priority < node.priority, `${prefix} depende de ${prerequisiteId}, pero su prioridad no es anterior.`);
  }

  const lesson = node.lesson;
  assert(lesson.summary?.length >= 70, `${prefix} resumen demasiado corto.`);
  assert(lesson.why?.length >= 60, `${prefix} "por qué importa" demasiado corto.`);
  assert(lesson.explanation?.length >= 120, `${prefix} explicación demasiado corta.`);
  assert(!normalized(lesson.explanation).startsWith("pensalo dentro de un flujo concreto"), `${prefix} conserva la explicación genérica antigua.`);
  assert(lesson.code?.length >= 20, `${prefix} ejemplo de código ausente o demasiado corto.`);
  assert(lesson.codeLabel?.length >= 5, `${prefix} título del ejemplo ausente.`);
  assert(lesson.steps?.length >= 3, `${prefix} necesita al menos tres pasos claros.`);
  assert(lesson.takeaway?.length >= 35, `${prefix} idea para recordar demasiado corta.`);

  assert(Boolean(lesson.audit), `${prefix} no tiene caso concreto y fallas.`);
  assert(lesson.audit?.primer?.length >= 80, `${prefix} definición concreta demasiado corta.`);
  assert(lesson.audit?.example?.length >= 80, `${prefix} ejemplo concreto demasiado corto.`);
  assert(lesson.audit?.failureModes?.length >= 2, `${prefix} necesita al menos dos fallas concretas.`);
  for (const failure of lesson.audit?.failureModes ?? []) {
    assert(failure.length >= 45, `${prefix} tiene una falla demasiado superficial: "${failure}".`);
  }

  assert(lesson.sources?.length >= 1, `${prefix} no tiene una fuente para verificar o profundizar.`);
  const sourceUrls = new Set();
  for (const item of lesson.sources ?? []) {
    assert(item.label?.length >= 3, `${prefix} tiene una fuente sin label.`);
    assert(/^https:\/\//.test(item.href ?? ""), `${prefix} tiene una fuente no HTTPS: ${item.href}.`);
    assert(!sourceUrls.has(item.href), `${prefix} repite la fuente ${item.href}.`);
    sourceUrls.add(item.href);
  }

  const quiz = getQuizForNode(node);
  assert(quiz.length >= 3, `${prefix} necesita al menos tres preguntas propias de quiz.`);
  const quizIds = new Set();
  for (const question of quiz) {
    assert(!quizIds.has(question.id), `${prefix} repite la pregunta de quiz ${question.id}.`);
    quizIds.add(question.id);
    auditQuizQuestion(question, `${prefix} ${question.id}:`);
  }

  for (const interviewQuestion of node.interviewQuestions ?? []) {
    const interviewQuiz = buildInterviewQuizQuestion(interviewQuestion, node);
    assert(interviewQuiz, `${prefix} no pudo construir el quiz de entrevista #${interviewQuestion.id}.`);
    if (interviewQuiz) auditQuizQuestion(interviewQuiz, `${prefix} entrevista #${interviewQuestion.id}:`, { minPromptLength: 12 });
  }
}

for (const [source, target] of graph.edges) {
  assert(idSet.has(source) && idSet.has(target), `Edge inválido: ${source} -> ${target}.`);
  assert(graph.nodes.find((node) => node.id === target)?.prerequisites.includes(source), `Edge ${source} -> ${target} no coincide con prerequisites.`);
}

assert(graph.interviewQuestions?.length === 110, `Se esperaban 110 preguntas de referencia; hay ${graph.interviewQuestions?.length ?? 0}.`);
const questionIds = new Set();
for (const question of graph.interviewQuestions ?? []) {
  assert(!questionIds.has(question.id), `Pregunta duplicada #${question.id}.`);
  questionIds.add(question.id);
  assert(question.title?.length >= 12, `Pregunta #${question.id} demasiado corta.`);
  assert(question.nodeIds?.length >= 1, `Pregunta #${question.id} no está conectada a ningún nodo.`);
  assert(question.nodeIds.every((id) => idSet.has(id)), `Pregunta #${question.id} apunta a un nodo inexistente.`);
}

const milestoneNodeIds = new Set();
for (const milestone of graph.milestones ?? []) {
  assert(milestone.nodeIds?.length >= 1, `Milestone ${milestone.id} vacío.`);
  for (const id of milestone.nodeIds ?? []) {
    assert(idSet.has(id), `Milestone ${milestone.id} contiene el nodo inexistente ${id}.`);
    milestoneNodeIds.add(id);
  }
}
for (const node of graph.nodes) {
  assert(milestoneNodeIds.has(node.id), `${node.id}: no pertenece a ningún milestone.`);
}

for (const band of graph.seniorityBands ?? []) {
  assert(band.nodeIds?.length >= 1, `Banda de seniority ${band.id} vacía.`);
  assert(band.nodeIds.every((id) => idSet.has(id)), `Banda ${band.id} contiene nodos inexistentes.`);
  assert((band.milestoneIds ?? []).every((id) => graph.milestones.some((milestone) => milestone.id === id)), `Banda ${band.id} referencia milestones inexistentes.`);
}

for (const [id, dive] of Object.entries(REACT_DEEP_DIVES)) {
  assert(dive.aliases?.length >= 1, `Deep dive ${id} no tiene frases activadoras.`);
  assert(dive.answer?.length >= 100, `Deep dive ${id} tiene una respuesta demasiado corta.`);
  assert(dive.example?.length >= 80, `Deep dive ${id} tiene un ejemplo demasiado corto.`);
  assert(dive.nodeIds?.every((nodeId) => idSet.has(nodeId)), `Deep dive ${id} apunta a un nodo inexistente.`);
  assert(dive.sources?.length >= 1, `Deep dive ${id} no tiene fuente.`);
}

const reachableDeepDives = new Set(
  graph.nodes.flatMap((node) => findDeepDiveMatches(node.lesson.explanation, node.id, 3).map((match) => match.id)),
);
for (const id of Object.keys(REACT_DEEP_DIVES)) {
  assert(reachableDeepDives.has(id), `Deep dive ${id} no aparece en la explicación principal de ninguna card.`);
}

const repeatedText = new Map();
for (const node of graph.nodes) {
  const texts = [
    node.lesson.explanation,
    ...(node.lesson.steps ?? []),
    ...(node.lesson.pitfalls ?? []),
    ...(node.lesson.audit?.failureModes ?? []),
  ];
  for (const text of texts) {
    const key = normalized(text);
    if (key.length < 60) continue;
    repeatedText.set(key, [...(repeatedText.get(key) ?? []), node.id]);
  }
}
for (const [text, nodeIds] of repeatedText) {
  if (new Set(nodeIds).size >= 3) {
    errors.push(`Texto largo repetido en ${[...new Set(nodeIds)].join(", ")}: "${text.slice(0, 100)}…".`);
  }
}

if (errors.length) {
  console.error(`Audit React falló con ${errors.length} hallazgo(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Audit React OK: ${graph.nodes.length} nodos, ${graph.edges.length} dependencias, ${graph.interviewQuestions.length} preguntas y ${Object.keys(REACT_DEEP_DIVES).length} explicaciones profundas.`);
