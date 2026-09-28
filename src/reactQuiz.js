const QUIZ_TEXT = {
  es: {
    genericDistractors: [
      "La decisión se toma únicamente por apariencia visual y no cambia el comportamiento de la aplicación.",
      "Siempre conviene aplicarlo de forma global, aunque el caso de uso no lo necesite.",
      "La responsabilidad principal debe quedar repartida entre todos los componentes para evitar una frontera clara.",
    ],
    distractorContext: [
      " En una aplicación real también habría que justificar quién mantiene la fuente de verdad, qué contrato recibe cada consumidor y qué ocurre cuando el camino esperado falla.",
      " Puede parecer razonable en una demo pequeña, pero no explica qué responsabilidad conserva cada pieza ni qué trade-off introduce cuando el sistema crece.",
      " El resultado podría funcionar en el caso feliz, aunque deja sin resolver cómo se prueba, cómo se recupera un error y qué parte queda acoplada a esa decisión.",
      " Antes de elegirlo habría que demostrar que todos los consumidores comparten ese requisito; de lo contrario agrega una regla global sin una frontera conceptual clara.",
      " Esta respuesta confunde una consecuencia visible con el mecanismo que la produce y no permite razonar sobre cambios, concurrencia o mantenimiento.",
      " En una entrevista también convendría aclarar los límites de la solución, porque una respuesta válida depende del flujo, del contrato y de los fallos que haya que manejar.",
    ],
    fallbackCorrect: "La respuesta depende del objetivo y del contrato explicado en esta card.",
    fillerOption: (position) => `No hay que confundir este concepto con una decisión independiente del caso de uso (${position}).`,
    fallbackFailure: "No distinguir el objetivo del concepto, sus límites y el trade-off que introduce.",
    fallbackSecondFailure: "Aplicar la técnica sin verificar si resuelve el problema real del caso.",
    conceptPrompt: (label) => `¿Cuál afirmación explica mejor «${label}»?`,
    applicationPrompt: (label) => `En el caso práctico de esta card, ¿qué decisión representa mejor el uso de «${label}»?`,
    applicationDistractors: [
      "Ignorar los estados de carga y error porque solo importa que el camino exitoso funcione.",
      "Duplicar todos los datos en state aunque ya exista una fuente de verdad clara.",
      "Mover la decisión a una abstracción global sin comprobar si el caso realmente la comparte.",
    ],
    failurePrompt: (label) => `¿Qué riesgos o trade-offs deberías mencionar al explicar «${label}» en una entrevista?`,
    failureDistractors: [
      "No hace falta mencionar ningún límite: si la implementación funciona en el caso feliz, la decisión siempre es correcta.",
      "El único riesgo relevante es que el nombre de la abstracción no sea suficientemente descriptivo para el equipo.",
      "La mejor práctica es elegir esta técnica por costumbre y mantenerla aunque el problema desaparezca o cambie de forma.",
    ],
    interviewDistractors: [
      "La respuesta correcta es siempre usar un hook nuevo, sin importar el problema ni el modelo mental involucrado.",
      "La respuesta depende solo de cambiar el CSS; el árbol de componentes y los datos no intervienen.",
      "La decisión se toma únicamente por preferencia personal, sin considerar el contrato, el flujo de datos ni los trade-offs.",
    ],
    interviewExplanation: (primer, example) => `${primer} En este caso, el ejemplo de la card ayuda a aterrizarlo: ${example}`,
  },
  en: {
    genericDistractors: [
      "The decision is made purely on visual appearance and does not change the behavior of the application.",
      "It is always better to apply it globally, even if the use case does not need it.",
      "The main responsibility should be spread across all components to avoid a clear boundary.",
    ],
    distractorContext: [
      " In a real application you would also need to justify who keeps the source of truth, what contract each consumer receives and what happens when the expected path fails.",
      " It may seem reasonable in a small demo, but it does not explain what responsibility each piece keeps or what trade-off it introduces as the system grows.",
      " The result might work in the happy path, but it leaves unresolved how it is tested, how an error is recovered and which part stays coupled to that decision.",
      " Before choosing it you would need to show that every consumer shares that requirement; otherwise it adds a global rule without a clear conceptual boundary.",
      " This answer confuses a visible consequence with the mechanism that produces it and does not let you reason about changes, concurrency or maintenance.",
      " In an interview it would also be worth clarifying the limits of the solution, because a valid answer depends on the flow, the contract and the failures that need handling.",
    ],
    fallbackCorrect: "The answer depends on the goal and the contract explained in this card.",
    fillerOption: (position) => `Do not confuse this concept with a decision that is independent of the use case (${position}).`,
    fallbackFailure: "Not distinguishing the goal of the concept, its limits and the trade-off it introduces.",
    fallbackSecondFailure: "Applying the technique without checking whether it solves the real problem of the case.",
    conceptPrompt: (label) => `Which statement best explains "${label}"?`,
    applicationPrompt: (label) => `In the practical case of this card, which decision best represents the use of "${label}"?`,
    applicationDistractors: [
      "Ignore the loading and error states because the only thing that matters is that the successful path works.",
      "Duplicate all the data in state even though a clear source of truth already exists.",
      "Move the decision into a global abstraction without checking whether the case actually shares it.",
    ],
    failurePrompt: (label) => `Which risks or trade-offs should you mention when explaining "${label}" in an interview?`,
    failureDistractors: [
      "There is no need to mention any limit: if the implementation works in the happy path, the decision is always correct.",
      "The only relevant risk is that the name of the abstraction is not descriptive enough for the team.",
      "The best practice is to choose this technique out of habit and keep it even if the problem disappears or changes shape.",
    ],
    interviewDistractors: [
      "The correct answer is always to use a new hook, regardless of the problem or the mental model involved.",
      "The answer depends only on changing the CSS; the component tree and the data play no part.",
      "The decision is made purely on personal preference, without considering the contract, the data flow or the trade-offs.",
    ],
    interviewExplanation: (primer, example) => `${primer} In this case, the example in the card helps ground it: ${example}`,
  },
};

const quizText = (locale) => QUIZ_TEXT[locale] ?? QUIZ_TEXT.es;

const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const shorten = (value, max = 310) => {
  const text = normalizeText(value);
  if (text.length <= max) return text;
  const boundary = text.slice(0, max).lastIndexOf(" ");
  return `${text.slice(0, boundary > 120 ? boundary : max)}…`;
};

const stableHash = (value) => [...String(value)].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7);

function balanceDistractor(text, targetLength, maxLength, seed, locale = "es") {
  const context = quizText(locale).distractorContext;
  let balanced = normalizeText(text);
  let extensionIndex = stableHash(seed) % context.length;
  let attempts = 0;

  while (balanced.length < targetLength && attempts < context.length * 2) {
    const extension = context[extensionIndex % context.length];
    if (!balanced.includes(extension.trim())) balanced += extension;
    extensionIndex += 1;
    attempts += 1;
  }

  return shorten(balanced, maxLength);
}

function makeQuestion({ id, prompt, correct, distractors, explanation, kind = "card", sourceQuestionId = null }, locale = "es") {
  const text = quizText(locale);
  const correctText = shorten(correct) || text.fallbackCorrect;
  const distractorTarget = Math.max(80, Math.round(correctText.length * 0.88));
  const distractorMax = Math.max(distractorTarget, Math.min(310, Math.round(correctText.length * 1.25)));
  const candidates = [correctText, ...(distractors ?? text.genericDistractors)
    .map((option, index) => balanceDistractor(shorten(option), distractorTarget, distractorMax, `${id}-distractor-${index}`, locale))
    .filter(Boolean)];
  const unique = candidates.filter((option, index) => candidates.indexOf(option) === index).slice(0, 4);
  while (unique.length < 4) unique.push(text.fillerOption(unique.length + 1));

  const offset = stableHash(id) % unique.length;
  const ordered = unique.map((_, index) => unique[(index + offset) % unique.length]);
  const options = ordered.map((optionText, index) => ({ id: `option-${index + 1}`, text: optionText }));

  return {
    id,
    prompt: normalizeText(prompt),
    options,
    correctOptionId: options.find((option) => option.text === correctText)?.id ?? options[0].id,
    explanation: normalizeText(explanation || correctText),
    kind,
    sourceQuestionId,
  };
}

function lessonFacts(node, locale = "es") {
  const text = quizText(locale);
  const lesson = node.lesson ?? {};
  const primer = lesson.audit?.primer || lesson.explanation || lesson.summary || node.label;
  const example = lesson.audit?.example || lesson.codeLabel || lesson.steps?.[0] || lesson.summary || node.label;
  const failures = lesson.audit?.failureModes || lesson.pitfalls || [];
  const failure = failures[0] || text.fallbackFailure;
  const secondFailure = failures[1] || text.fallbackSecondFailure;
  return { lesson, primer, example, failure, secondFailure };
}

/**
 * Three active-recall questions exist even when a node has no external interview
 * mapping. They deliberately cover definition, application and failure mode.
 */
export function getQuizForNode(node, locale = "es") {
  if (!node) return [];
  const text = quizText(locale);
  const { primer, example, failure, secondFailure } = lessonFacts(node, locale);
  const failureAnswer = [failure, secondFailure].filter(Boolean).join(" ");
  return [
    makeQuestion({
      id: `card-${node.id}-concept`,
      prompt: text.conceptPrompt(node.label),
      correct: primer,
      distractors: text.genericDistractors,
      explanation: primer,
    }, locale),
    makeQuestion({
      id: `card-${node.id}-application`,
      prompt: text.applicationPrompt(node.label),
      correct: example,
      distractors: text.applicationDistractors,
      explanation: example,
    }, locale),
    makeQuestion({
      id: `card-${node.id}-failure`,
      prompt: text.failurePrompt(node.label),
      correct: failureAnswer,
      distractors: text.failureDistractors,
      explanation: failureAnswer,
    }, locale),
  ];
}

/**
 * An existing GreatFrontend prompt becomes an MCQ only after the node's full
 * prerequisite chain is understood. The current card supplies the answer so
 * the quiz stays attached to the explanation the learner just read.
 */
export function buildInterviewQuizQuestion(interviewQuestion, node, locale = "es") {
  if (!interviewQuestion || !node) return null;
  const text = quizText(locale);
  const { primer, example } = lessonFacts(node, locale);
  return makeQuestion({
    id: `interview-${interviewQuestion.id}-${node.id}`,
    prompt: interviewQuestion.title,
    correct: primer,
    distractors: text.interviewDistractors,
    explanation: text.interviewExplanation(primer, example),
    kind: "interview",
    sourceQuestionId: interviewQuestion.id,
  }, locale);
}

export function getPrerequisiteClosure(nodeId, graph) {
  const visited = new Set();
  const visit = (currentId) => {
    const node = graph?.nodes?.find((candidate) => candidate.id === currentId);
    for (const prerequisiteId of node?.prerequisites ?? []) {
      if (visited.has(prerequisiteId)) continue;
      visited.add(prerequisiteId);
      visit(prerequisiteId);
    }
  };
  visit(nodeId);
  return [...visited];
}

export function getInterviewQuestionPrerequisites(interviewQuestion, graph) {
  return [...new Set((interviewQuestion?.nodeIds ?? []).flatMap((nodeId) => getPrerequisiteClosure(nodeId, graph)))];
}
