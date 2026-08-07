const GENERIC_DISTRACTORS = [
  "La decisión se toma únicamente por apariencia visual y no cambia el comportamiento de la aplicación.",
  "Siempre conviene aplicarlo de forma global, aunque el caso de uso no lo necesite.",
  "La responsabilidad principal debe quedar repartida entre todos los componentes para evitar una frontera clara.",
];

const DISTRACTOR_CONTEXT = [
  " En una aplicación real también habría que justificar quién mantiene la fuente de verdad, qué contrato recibe cada consumidor y qué ocurre cuando el camino esperado falla.",
  " Puede parecer razonable en una demo pequeña, pero no explica qué responsabilidad conserva cada pieza ni qué trade-off introduce cuando el sistema crece.",
  " El resultado podría funcionar en el caso feliz, aunque deja sin resolver cómo se prueba, cómo se recupera un error y qué parte queda acoplada a esa decisión.",
  " Antes de elegirlo habría que demostrar que todos los consumidores comparten ese requisito; de lo contrario agrega una regla global sin una frontera conceptual clara.",
  " Esta respuesta confunde una consecuencia visible con el mecanismo que la produce y no permite razonar sobre cambios, concurrencia o mantenimiento.",
  " En una entrevista también convendría aclarar los límites de la solución, porque una respuesta válida depende del flujo, del contrato y de los fallos que haya que manejar.",
];

const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const shorten = (value, max = 310) => {
  const text = normalizeText(value);
  if (text.length <= max) return text;
  const boundary = text.slice(0, max).lastIndexOf(" ");
  return `${text.slice(0, boundary > 120 ? boundary : max)}…`;
};

const stableHash = (value) => [...String(value)].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7);

function balanceDistractor(text, targetLength, maxLength, seed) {
  let balanced = normalizeText(text);
  let extensionIndex = stableHash(seed) % DISTRACTOR_CONTEXT.length;
  let attempts = 0;

  while (balanced.length < targetLength && attempts < DISTRACTOR_CONTEXT.length * 2) {
    const extension = DISTRACTOR_CONTEXT[extensionIndex % DISTRACTOR_CONTEXT.length];
    if (!balanced.includes(extension.trim())) balanced += extension;
    extensionIndex += 1;
    attempts += 1;
  }

  return shorten(balanced, maxLength);
}

function makeQuestion({ id, prompt, correct, distractors = GENERIC_DISTRACTORS, explanation, kind = "card", sourceQuestionId = null }) {
  const correctText = shorten(correct) || "La respuesta depende del objetivo y del contrato explicado en esta card.";
  const distractorTarget = Math.max(80, Math.round(correctText.length * 0.88));
  const distractorMax = Math.max(distractorTarget, Math.min(310, Math.round(correctText.length * 1.25)));
  const candidates = [correctText, ...distractors
    .map((text, index) => balanceDistractor(shorten(text), distractorTarget, distractorMax, `${id}-distractor-${index}`))
    .filter(Boolean)];
  const unique = candidates.filter((text, index) => candidates.indexOf(text) === index).slice(0, 4);
  while (unique.length < 4) unique.push(`No hay que confundir este concepto con una decisión independiente del caso de uso (${unique.length + 1}).`);

  const offset = stableHash(id) % unique.length;
  const ordered = unique.map((_, index) => unique[(index + offset) % unique.length]);
  const options = ordered.map((text, index) => ({ id: `option-${index + 1}`, text }));

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

function lessonFacts(node) {
  const lesson = node.lesson ?? {};
  const primer = lesson.audit?.primer || lesson.explanation || lesson.summary || node.label;
  const example = lesson.audit?.example || lesson.codeLabel || lesson.steps?.[0] || lesson.summary || node.label;
  const failures = lesson.audit?.failureModes || lesson.pitfalls || [];
  const failure = failures[0] || "No distinguir el objetivo del concepto, sus límites y el trade-off que introduce.";
  const secondFailure = failures[1] || "Aplicar la técnica sin verificar si resuelve el problema real del caso.";
  return { lesson, primer, example, failure, secondFailure };
}

/**
 * Three active-recall questions exist even when a node has no external interview
 * mapping. They deliberately cover definition, application and failure mode.
 */
export function getQuizForNode(node) {
  if (!node) return [];
  const { lesson, primer, example, failure, secondFailure } = lessonFacts(node);
  const failureAnswer = [failure, secondFailure].filter(Boolean).join(" ");
  return [
    makeQuestion({
      id: `card-${node.id}-concept`,
      prompt: `¿Cuál afirmación explica mejor «${node.label}»?`,
      correct: primer,
      distractors: GENERIC_DISTRACTORS,
      explanation: primer,
    }),
    makeQuestion({
      id: `card-${node.id}-application`,
      prompt: `En el caso práctico de esta card, ¿qué decisión representa mejor el uso de «${node.label}»?`,
      correct: example,
      distractors: [
        "Ignorar los estados de carga y error porque solo importa que el camino exitoso funcione.",
        "Duplicar todos los datos en state aunque ya exista una fuente de verdad clara.",
        "Mover la decisión a una abstracción global sin comprobar si el caso realmente la comparte.",
      ],
      explanation: example,
    }),
    makeQuestion({
      id: `card-${node.id}-failure`,
      prompt: `¿Qué riesgos o trade-offs deberías mencionar al explicar «${node.label}» en una entrevista?`,
      correct: failureAnswer,
      distractors: [
        "No hace falta mencionar ningún límite: si la implementación funciona en el caso feliz, la decisión siempre es correcta.",
        "El único riesgo relevante es que el nombre de la abstracción no sea suficientemente descriptivo para el equipo.",
        "La mejor práctica es elegir esta técnica por costumbre y mantenerla aunque el problema desaparezca o cambie de forma.",
      ],
      explanation: failureAnswer,
    }),
  ];
}

/**
 * An existing GreatFrontend prompt becomes an MCQ only after the node's full
 * prerequisite chain is understood. The current card supplies the answer so
 * the quiz stays attached to the explanation the learner just read.
 */
export function buildInterviewQuizQuestion(interviewQuestion, node) {
  if (!interviewQuestion || !node) return null;
  const { primer, example } = lessonFacts(node);
  return makeQuestion({
    id: `interview-${interviewQuestion.id}-${node.id}`,
    prompt: interviewQuestion.title,
    correct: primer,
    distractors: [
      "La respuesta correcta es siempre usar un hook nuevo, sin importar el problema ni el modelo mental involucrado.",
      "La respuesta depende solo de cambiar el CSS; el árbol de componentes y los datos no intervienen.",
      "La decisión se toma únicamente por preferencia personal, sin considerar el contrato, el flujo de datos ni los trade-offs.",
    ],
    explanation: `${primer} En este caso, el ejemplo de la card ayuda a aterrizarlo: ${example}`,
    kind: "interview",
    sourceQuestionId: interviewQuestion.id,
  });
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
