import { buildLessonNarrationSegments } from "../ttsSegments.js";
import { getCompletionView, getScoreView, isEvaluationSurfaceComplete } from "../ai/types.js";

export function getLatestAttempt(attemptsByNode, nodeId) {
  const attempts = attemptsByNode?.[nodeId] ?? [];
  return attempts[attempts.length - 1] ?? null;
}

export function getNodeProgress(attemptsByNode, nodeId) {
  const latestAttempt = getLatestAttempt(attemptsByNode, nodeId);
  const evaluation = latestAttempt?.evaluation ?? null;
  const scoreView = getScoreView(evaluation);
  const completion = getCompletionView(evaluation);
  return {
    nodeId,
    latestAttempt,
    attemptCount: (attemptsByNode?.[nodeId] ?? []).length,
    score: scoreView?.displayScore ?? null,
    scoreView,
    completion,
    isComplete: isEvaluationSurfaceComplete(evaluation),
  };
}

export function getProgressMap(graph, attemptsByNode) {
  return Object.fromEntries(graph.nodes.map((node) => [node.id, getNodeProgress(attemptsByNode, node.id)]));
}

export function getVisibleNodes(graph, selectedGroupIds = []) {
  if (!selectedGroupIds?.length) return graph.nodes;
  const selected = new Set(selectedGroupIds);
  return graph.nodes.filter((node) => selected.has(node.cat) || selected.has(node.id));
}

export function getSuggestedNextNode(graph, progressMap, selectedGroupIds = []) {
  const visible = getVisibleNodes(graph, selectedGroupIds);
  return visible
    .filter((node) => !progressMap[node.id]?.isComplete)
    .sort((a, b) => a.priority - b.priority)[0] ?? null;
}

export function getAdjacentNode(graph, currentNodeId, direction, selectedGroupIds = []) {
  const visible = getVisibleNodes(graph, selectedGroupIds).sort((a, b) => a.priority - b.priority);
  const index = visible.findIndex((node) => node.id === currentNodeId);
  if (index < 0) return null;
  return visible[index + direction] ?? null;
}

export function getNodeView(graph, attemptsByNode, draftsByNode, nodeId) {
  const node = graph.nodeById.get(nodeId) ?? graph.nodes.find((item) => item.id === nodeId);
  if (!node) return null;
  return {
    ...node,
    progress: getNodeProgress(attemptsByNode, nodeId),
    draft: draftsByNode?.[nodeId] ?? "",
    narrationSegments: node.lesson
      ? buildLessonNarrationSegments(node, graph.label, graph.locale)
      : [],
  };
}

export function getFlashcards(graph, attemptsByNode, draftsByNode, selectedGroupIds = []) {
  return getVisibleNodes(graph, selectedGroupIds).map((node) => getNodeView(graph, attemptsByNode, draftsByNode, node.id));
}

export function getGraphView(graph, attemptsByNode, draftsByNode, selectedGroupIds = []) {
  const progress = getProgressMap(graph, attemptsByNode);
  const nodes = getVisibleNodes(graph, selectedGroupIds).map((node) => ({
    ...getNodeView(graph, attemptsByNode, draftsByNode, node.id),
    isSuggested: getSuggestedNextNode(graph, progress, selectedGroupIds)?.id === node.id,
  }));
  const ids = new Set(nodes.map((node) => node.id));
  return { nodes, edges: graph.edges.filter(([source, target]) => ids.has(source) && ids.has(target)), progress };
}
