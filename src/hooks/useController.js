import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createLearningController } from "../logic/learningController.js";
import { getLocale, subscribeLocale } from "../i18n/locale.js";

// Singleton default controller instance
let globalController = null;
function getGlobalController(initialGraphId = "react") {
  if (!globalController) {
    globalController = createLearningController({ graphId: initialGraphId, locale: getLocale() });
    subscribeLocale((locale) => globalController.setLocale(locale));
    globalController.hydrate().catch(console.error);
  }
  return globalController;
}

export function useController(initialGraphId = "react") {
  const controller = useMemo(() => getGlobalController(initialGraphId), [initialGraphId]);

  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot
  );

  useEffect(() => {
    if (!snapshot.hydrated) {
      controller.hydrate().catch(console.error);
    }
  }, [controller, snapshot.hydrated]);

  return {
    snapshot,
    graph: snapshot.graph,
    selectedNode: snapshot.selectedNode,
    modalNodeId: snapshot.modalNodeId,
    suggestedNext: snapshot.suggestedNextNode,
    progressMap: snapshot.progressMap,
    visibleNodes: snapshot.visibleNodes,
    activeGraphId: snapshot.graphId,

    // Actions
    switchGraph: (graphId) => controller.setGraph(graphId),
    setLocale: (locale) => controller.setLocale(locale),
    selectNode: (nodeId, options) => controller.selectNode(nodeId, options),
    openNode: (nodeId) => controller.selectNode(nodeId, { openModal: true }),
    closeModal: () => controller.closeNode(),
    filterCategories: (categoryIds) => controller.setGroups(categoryIds),
    saveAttempt: (attempt) => controller.saveAttempt?.(attempt),
    saveDraft: (nodeId, text) => controller.updateDraft(nodeId, text),
    deleteDraft: (nodeId) => controller.updateDraft(nodeId, ""),
  };
}
