import React, { useMemo, useState } from "react";
import { useController } from "./hooks/useController.js";
import { useUrlRouting } from "./hooks/useUrlRouting.js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.js";
import { AppHeader } from "./components/layout/AppHeader.jsx";
import { CockpitControlDeck } from "./components/layout/CockpitControlDeck.jsx";
import { MobileBottomNav } from "./components/layout/MobileBottomNav.jsx";
import { GraphCanvas } from "./components/graph/GraphCanvas.jsx";
import { GraphTopologyCanvas } from "./components/graph/GraphTopologyCanvas.jsx";
import { FlashcardGrid } from "./components/flashcards/FlashcardGrid.jsx";
import { StudyModal } from "./components/modals/StudyModal.jsx";
import { CommandPalette } from "./components/modals/CommandPalette.jsx";
import { SeniorityDrawer } from "./components/modals/SeniorityDrawer.jsx";
import { ProviderModal } from "./components/modals/ProviderModal.jsx";
import { GlobalTasksHud } from "./components/hud/GlobalTasksHud.jsx";

export default function App() {
  const {
    snapshot, graph, modalNodeId, suggestedNext, progressMap, visibleNodes,
    activeGraphId, switchGraph, openNode, closeModal, filterCategories, saveAttempt,
  } = useController("react");

  const [layoutMode, setLayoutMode] = useState("grid");
  const [viewMode, setViewMode] = useState("graph");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSeniorityOpen, setIsSeniorityOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useUrlRouting({
    activeGraphId, modalNodeId,
    onApplyRoute: ({ graphId, nodeId }) => {
      if (graphId && graphId !== activeGraphId) switchGraph(graphId);
      if (nodeId) openNode(nodeId); else if (modalNodeId) closeModal();
    },
  });

  useKeyboardShortcuts({
    onCommandPalette: () => setIsPaletteOpen(true),
    onEscape: () => {
      setIsPaletteOpen(false); setIsSeniorityOpen(false); setIsSettingsOpen(false);
      if (modalNodeId) closeModal();
    },
  });

  const { nodeCounts, completedCount } = useMemo(() => {
    const counts = {};
    let completed = 0;
    (graph.nodes || []).forEach((n) => {
      counts[n.cat] = (counts[n.cat] || 0) + 1;
      const score = progressMap[n.id]?.score ?? progressMap[n.id]?.latestAttempt?.score ?? 0;
      if (score >= 100) completed += 1;
    });
    return { nodeCounts: counts, completedCount: completed };
  }, [graph.nodes, progressMap]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-workspace, #080b13)" }}>
      <AppHeader
        activeGraphId={activeGraphId} onSwitchGraph={switchGraph} viewMode={viewMode} onSetViewMode={setViewMode}
        totalNodes={graph.nodes?.length || 101} completedCount={completedCount}
        onOpenSearch={() => setIsPaletteOpen(true)} onOpenSeniority={() => setIsSeniorityOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <CockpitControlDeck
        suggestedNext={suggestedNext} onOpenNode={openNode} layoutMode={layoutMode} onSetLayoutMode={setLayoutMode}
        categories={graph.categories} selectedCategories={snapshot.selectedGroupIds || []}
        onSelectCategory={(cat) => filterCategories([cat])} onClearCategories={() => filterCategories([])}
        nodeCounts={nodeCounts} viewMode={viewMode}
      />

      <main style={{ flex: 1, position: "relative" }}>
        {viewMode === "flashcards" ? (
          <FlashcardGrid nodes={visibleNodes} progressMap={progressMap} categories={graph.categories} onOpenNode={openNode} />
        ) : layoutMode === "grid" ? (
          <GraphCanvas nodes={visibleNodes} progressMap={progressMap} categories={graph.categories} onOpenNode={openNode} selectedGroupIds={snapshot.selectedGroupIds || []} />
        ) : (
          <GraphTopologyCanvas graph={graph} progressMap={progressMap} onOpenNode={openNode} />
        )}
      </main>

      <MobileBottomNav
        activeView={viewMode} onSelectView={(m) => setViewMode(m)}
        onOpenSeniority={() => setIsSeniorityOpen(true)} onOpenSearch={() => setIsPaletteOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <GlobalTasksHud activeGraphId={activeGraphId} onOpenCard={openNode} />

      {modalNodeId && (
        <StudyModal
          graphId={activeGraphId} graph={graph} nodeId={modalNodeId} onClose={closeModal} onNavigateNode={openNode}
          activeEvaluation={snapshot.activeEvaluation} onStartEvaluation={saveAttempt} onCancelEvaluation={closeModal}
        />
      )}

      <CommandPalette
        isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} nodes={graph.nodes || []} onSelectNode={openNode}
        onSwitchView={(m) => { setViewMode(m); setIsPaletteOpen(false); }}
        onOpenSeniority={() => { setIsSeniorityOpen(true); setIsPaletteOpen(false); }}
        onOpenSettings={() => { setIsSettingsOpen(true); setIsPaletteOpen(false); }}
      />

      <SeniorityDrawer isOpen={isSeniorityOpen} onClose={() => setIsSeniorityOpen(false)} graph={graph} progressMap={progressMap} />
      <ProviderModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onRefreshData={() => switchGraph(activeGraphId)} />
    </div>
  );
}
