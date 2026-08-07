import {
  deleteDraft,
  getDraft,
  listAllAttempts,
  listAttempts,
  saveAttempt,
  setDraft,
} from "../ai/learningStore.js";
import { hashCardContent } from "../ai/contentHash.js";
import { evaluateParaphraseStream, isCancel } from "../ai/client.js";
import { getGraph } from "./graphRegistry.js";
import {
  getAdjacentNode,
  getFlashcards,
  getGraphView,
  getLatestAttempt,
  getNodeView,
  getProgressMap,
  getSuggestedNextNode,
  getVisibleNodes,
} from "./selectors.js";

function clone(value) {
  return structuredClone(value);
}

export function createLearningController({ graphId = "react", storage = null, ai = null } = {}) {
  const persistence = storage ?? { getDraft, setDraft, deleteDraft, listAttempts, listAllAttempts, saveAttempt };
  const aiClient = ai ?? { evaluateParaphraseStream, isCancel };
  let graph = getGraph(graphId);
  let listeners = new Set();
  let request = null;
  let state = {
    graphId,
    graph,
    viewMode: "graph",
    selectedGroupIds: [],
    selectedNodeId: graph.nodes[0]?.id ?? null,
    modalNodeId: null,
    attemptsByNode: {},
    draftsByNode: {},
    hydrated: false,
    error: null,
    activeEvaluation: null,
  };

  function snapshot() {
    const progressMap = getProgressMap(graph, state.attemptsByNode);
    const selectedNode = state.selectedNodeId
      ? getNodeView(graph, state.attemptsByNode, state.draftsByNode, state.selectedNodeId)
      : null;
    return clone({
      ...state,
      graph,
      visibleNodes: getVisibleNodes(graph, state.selectedGroupIds),
      graphView: getGraphView(graph, state.attemptsByNode, state.draftsByNode, state.selectedGroupIds),
      flashcards: getFlashcards(graph, state.attemptsByNode, state.draftsByNode, state.selectedGroupIds),
      progressMap,
      suggestedNextNode: getSuggestedNextNode(graph, progressMap, state.selectedGroupIds),
      selectedNode,
    });
  }

  function emit() {
    const next = snapshot();
    listeners.forEach((listener) => listener(next));
    return next;
  }

  function patch(next) {
    state = { ...state, ...next };
    return emit();
  }

  async function hydrate() {
    try {
      const attempts = await persistence.listAllAttempts();
      const attemptsByNode = {};
      attempts.filter((attempt) => attempt.graphId === graph.id).forEach((attempt) => {
        (attemptsByNode[attempt.nodeId] ??= []).push(attempt);
      });
      const draftsByNode = {};
      await Promise.all(graph.nodes.map(async (node) => {
        draftsByNode[node.id] = await persistence.getDraft(graph.id, node.id);
      }));
      return patch({ attemptsByNode, draftsByNode, hydrated: true, error: null });
    } catch (error) {
      return patch({ hydrated: true, error: normalizeError(error) });
    }
  }

  function setGraph(nextGraphId) {
    graph = getGraph(nextGraphId);
    state = {
      ...state,
      graphId: nextGraphId,
      graph,
      selectedGroupIds: [],
      selectedNodeId: graph.nodes[0]?.id ?? null,
      modalNodeId: null,
      attemptsByNode: {},
      draftsByNode: {},
      hydrated: false,
    };
    emit();
    return hydrate();
  }

  function selectNode(nodeId, { open = true } = {}) {
    if (!graph.nodeIds.has(nodeId)) return snapshot();
    return patch({ selectedNodeId: nodeId, modalNodeId: open ? nodeId : state.modalNodeId });
  }

  function closeNode() {
    return patch({ modalNodeId: null });
  }

  function setViewMode(viewMode) {
    if (!["graph", "flashcards"].includes(viewMode)) throw new Error(`Unknown view mode: ${viewMode}`);
    return patch({ viewMode });
  }

  function setGroups(groupIds) {
    return patch({ selectedGroupIds: [...new Set(groupIds)] });
  }

  function toggleGroup(groupId) {
    const ids = new Set(state.selectedGroupIds);
    if (ids.has(groupId)) ids.delete(groupId); else ids.add(groupId);
    return setGroups([...ids]);
  }

  function selectOnlyGroup(groupId) {
    return setGroups(groupId ? [groupId] : []);
  }

  function navigate(direction) {
    const node = getAdjacentNode(graph, state.selectedNodeId, direction, state.selectedGroupIds);
    return node ? selectNode(node.id) : snapshot();
  }

  function navigateToSuggested() {
    const progressMap = getProgressMap(graph, state.attemptsByNode);
    const node = getSuggestedNextNode(graph, progressMap, state.selectedGroupIds);
    return node ? selectNode(node.id) : snapshot();
  }

  async function updateDraft(nodeId, text) {
    if (!graph.nodeIds.has(nodeId)) throw new Error(`Unknown node: ${nodeId}`);
    const draftsByNode = { ...state.draftsByNode, [nodeId]: text };
    patch({ draftsByNode });
    await persistence.setDraft(graph.id, nodeId, text);
    return snapshot();
  }

  async function submitParaphrase(nodeId, answer = state.draftsByNode[nodeId] ?? "") {
    const node = graph.nodeById.get(nodeId);
    if (!node) throw new Error(`Unknown node: ${nodeId}`);
    if (!answer.trim() || request) return snapshot();
    const controller = new AbortController();
    const requestId = Symbol("evaluation");
    request = { controller, requestId };
    const startedAt = Date.now();
    patch({ error: null, activeEvaluation: { status: "running", nodeId, startedAt, chars: 0, sections: {}, blocks: {} } });

    try {
      const result = await aiClient.evaluateParaphraseStream({
        graphId: graph.id,
        nodeId,
        answer,
        contentHash: hashCardContent(node),
        node,
        signal: controller.signal,
        onProgress: (chars) => {
          if (request?.requestId !== requestId) return;
          patch({ activeEvaluation: { ...state.activeEvaluation, chars } });
        },
        onSection: (field, value) => {
          if (request?.requestId !== requestId) return;
          patch({ activeEvaluation: { ...state.activeEvaluation, sections: { ...state.activeEvaluation.sections, [field]: value } } });
        },
        onBlock: (block) => {
          if (request?.requestId !== requestId) return;
          patch({ activeEvaluation: { ...state.activeEvaluation, blocks: { ...state.activeEvaluation.blocks, [block.id]: block } } });
        },
      });
      if (request?.requestId !== requestId) return snapshot();
      const attempt = { ...result.attempt, answer };
      await persistence.saveAttempt(attempt);
      const attempts = await persistence.listAttempts(graph.id, nodeId);
      await persistence.deleteDraft(graph.id, nodeId);
      request = null;
      return patch({
        attemptsByNode: { ...state.attemptsByNode, [nodeId]: attempts },
        draftsByNode: { ...state.draftsByNode, [nodeId]: "" },
        activeEvaluation: null,
      });
    } catch (error) {
      if (request?.requestId !== requestId) return snapshot();
      request = null;
      if (aiClient.isCancel(error)) return patch({ activeEvaluation: null });
      return patch({ activeEvaluation: null, error: normalizeError(error) });
    }
  }

  function cancelEvaluation() {
    request?.controller.abort();
    request = null;
    return patch({ activeEvaluation: null });
  }

  function selectAttempt(nodeId, index) {
    const attempts = state.attemptsByNode[nodeId] ?? [];
    if (!attempts[index]) return snapshot();
    return patch({ selectedNodeId: nodeId, modalNodeId: nodeId, selectedAttemptIndex: index });
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(snapshot());
    return () => listeners.delete(listener);
  }

  function getNode(nodeId = state.selectedNodeId) {
    return getNodeView(graph, state.attemptsByNode, state.draftsByNode, nodeId);
  }

  function destroy() {
    request?.controller.abort();
    request = null;
    listeners.clear();
  }

  return Object.freeze({
    getSnapshot: snapshot,
    subscribe,
    hydrate,
    destroy,
    setGraph,
    selectNode,
    closeNode,
    setViewMode,
    setGroups,
    toggleGroup,
    selectOnlyGroup,
    navigate,
    navigateToSuggested,
    updateDraft,
    submitParaphrase,
    cancelEvaluation,
    selectAttempt,
    getNode,
  });
}

function normalizeError(error) {
  return { code: error?.code ?? "unknown", message: error?.message ?? "Unknown learning error" };
}
