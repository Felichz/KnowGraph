import { getInterviewQuestionPrerequisites } from "../reactQuiz.js";

export function evaluateInterviewQuestions(questions = [], graph = null, checked = new Set()) {
  if (!Array.isArray(questions) || !graph) return [];

  return questions.map((question) => {
    const prerequisiteIds = getInterviewQuestionPrerequisites(question, graph);
    const missingNodes = prerequisiteIds
      .filter((id) => !checked.has(id))
      .map((id) => graph.nodes.find((node) => node.id === id))
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority);

    return {
      question,
      missingNodes,
      isUnlocked: missingNodes.length === 0,
    };
  });
}
