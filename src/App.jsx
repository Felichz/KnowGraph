import React, { useState } from "react";
import { useController } from "./hooks/useController.js";
import { useBackgroundTasks } from "./hooks/useBackgroundTasks.js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.js";
import { useUrlRouting } from "./hooks/useUrlRouting.js";

import { AppHeader } from "./components/layout/AppHeader.jsx";
import { TaskBanner } from "./components/layout/TaskBanner.jsx";
import { CategoryNav } from "./components/layout/CategoryNav.jsx";
import { SeniorityProgressPanel } from "./components/layout/SeniorityProgressPanel.jsx";
import { GlobalTasksHud } from "./components/layout/GlobalTasksHud.jsx";
import { MobileBottomNav } from "./components/layout/MobileBottomNav.jsx";
import { SuggestedNext } from "./components/graph/SuggestedNext.jsx";
import { GraphCanvas } from "./components/graph/GraphCanvas.jsx";
import { FlashcardGrid } from "./components/flashcards/FlashcardGrid.jsx";
import { CommandPalette } from "./components/common/CommandPalette.jsx";
import { StudyModal } from "./components/study/StudyModal.jsx";
import { ProviderModal } from "./components/settings/ProviderModal.jsx";

export default function App() {
  const {
    graph, activeGraphId, visibleNodes, suggestedNext, progressMap, modalNodeId,
    switchGraph, selectNode, openNode, closeModal, filterCategories,
  } = useController("react");

  const [viewMode, setViewMode] = useState("graph");
  const [selectedCats, setSelectedCats] = useState([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [progressPanelOpen, setProgressPanelOpen] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const { activeTasks, activeTaskNodeIds } = useBackgroundTasks(activeGraphId);

  useUrlRouting({
    activeGraphId, modalNodeId,
    onApplyRoute: ({ graphId, nodeId }) => {
      if (graphId && graphId !== activeGraphId) switchGraph(graphId);
      if (nodeId) openNode(nodeId); else if (modalNodeId) closeModal();
    },
  });

  useKeyboardShortcuts({
    onCommandPalette: () => setCommandPaletteOpen(true),
    onEscape: () => {
      setCommandPaletteOpen(false); setProviderModalOpen(false);
      setProgressPanelOpen(false); setHistoryStack([]); closeModal();
    },
  });

  const handleSelectCat = (k) => {
    setSelectedCats((prev) => {
      const next = prev.includes(k) ? prev.filter((c) => c !== k) : [k];
      filterCategories(next); return next;
    });
  };

  const completedCount = Object.values(progressMap).filter((p) => p.status === "completed" || p.score >= 100).length;
  const activeModalNode = modalNodeId ? graph.nodes.find((n) => n.id === modalNodeId) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-workspace)", paddingBottom: "60px" }}>
      <AppHeader
        activeGraphId={activeGraphId} onSwitchGraph={(id) => { setHistoryStack([]); switchGraph(id); }}
        viewMode={viewMode} onViewModeChange={setViewMode} totalNodes={graph.nodes.length}
        completedNodes={completedCount} onOpenProgress={() => setProgressPanelOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)} onOpenSettings={() => setProviderModalOpen(true)}
      />

      <TaskBanner task={activeTasks?.[0]} onNavigateToTask={openNode} />

      <CategoryNav
        categories={graph.categories} nodes={graph.nodes} progressMap={progressMap}
        selectedCategories={selectedCats} onSelectCategory={handleSelectCat}
        onShowAll={() => { setSelectedCats([]); filterCategories([]); }}
      />

      {viewMode === "graph" ? (
        <>
          <SuggestedNext node={suggestedNext} onOpenNode={openNode} />
          <GraphCanvas
            graph={graph}
            nodes={visibleNodes} categories={graph.categories} progressMap={progressMap}
            selectedNodeId={suggestedNext?.id} activeTaskNodeIds={new Set(activeTaskNodeIds)}
            onSelectNode={selectNode} onOpenNode={(id) => { setHistoryStack([]); openNode(id); }}
          />
        </>
      ) : (
        <FlashcardGrid
          nodes={visibleNodes} categories={graph.categories} progressMap={progressMap}
          onOpenStudy={(id) => { setHistoryStack([]); openNode(id); }}
        />
      )}

      <StudyModal
        node={activeModalNode} graph={graph} graphId={activeGraphId}
        open={Boolean(activeModalNode)} historyStack={historyStack}
        onNavigateNode={(t) => { if (activeModalNode) setHistoryStack((p) => [...p, activeModalNode]); openNode(t); }}
        onGoBack={() => { if (historyStack.length) { const p = historyStack[historyStack.length - 1]; setHistoryStack((s) => s.slice(0, -1)); openNode(p.id); } }}
        onClose={() => { setHistoryStack([]); closeModal(); }}
      />

      <SeniorityProgressPanel open={progressPanelOpen} onClose={() => setProgressPanelOpen(false)} graph={graph} progressMap={progressMap} />
      <ProviderModal open={providerModalOpen} onClose={() => setProviderModalOpen(false)} />
      <CommandPalette
        open={commandPaletteOpen}
        nodes={graph.nodes}
        categories={graph.categories}
        onSelectNode={(id) => { setHistoryStack([]); openNode(id); }}
        onOpenFlashcards={() => setViewMode("flashcards")}
        onOpenProgress={() => setProgressPanelOpen(true)}
        onOpenSettings={() => setProviderModalOpen(true)}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <GlobalTasksHud activeTasks={activeTasks} onOpenNode={openNode} />
      <MobileBottomNav viewMode={viewMode} onViewModeChange={setViewMode} onOpenProgress={() => setProgressPanelOpen(true)} onOpenCommandPalette={() => setCommandPaletteOpen(true)} onOpenSettings={() => setProviderModalOpen(true)} />
    </div>
  );
}
