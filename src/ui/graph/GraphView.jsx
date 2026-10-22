import { useCallback, useEffect, useMemo, useState } from "react";
import { useT } from "../../i18n/react.js";
import { collectChain, nodeState } from "../../logic/graphChain.js";
import { createTopologicalLayout } from "../../logic/topologicalLayout.js";
import { useIsMobile } from "../hooks/useMediaQuery.js";
import { Notice } from "../primitives/Feedback.jsx";
import { actions } from "../state/useWorkspace.js";
import { GraphCanvas } from "./GraphCanvas.jsx";
import { Callouts, GraphControls, GraphLegend, StageRuler } from "./GraphOverlays.jsx";
import { LABEL_K, LAYOUT, boundsOf, centerOn, fitView, isOffscreen, neighborInDirection, readableView } from "./graphUtils.js";
import { GraphMinimap } from "./GraphMinimap.jsx";
import { NodePanel } from "./NodePanel.jsx";
import { useGraphViewport } from "./useGraphViewport.js";

// Vista Grafo (specs/003-graph-view): mapa completo por etapas, zoom semántico y cadena de prerrequisitos.
export default function GraphView({ model, activeTaskNodeIds }) {
  const t = useT();
  const { graph, guidance, progress, activeCats } = model;
  const mobile = useIsMobile();
  const layout = useMemo(() => createTopologicalLayout(graph, LAYOUT), [graph]);
  const states = useMemo(() => new Map(graph.nodes.map((node) => [node.id, nodeState(node, progress)])), [graph, progress]);
  const vp = useGraphViewport({ x: 0, y: 0, k: 0.3 });
  const [hovered, setHovered] = useState(null);
  const [picked, setPicked] = useState(null);
  const isActive = useCallback((id) => activeCats.has(layout.positions.get(id)?.node.cat), [activeCats, layout]);
  const bestId = guidance.primary && isActive(guidance.primary.id) ? guidance.primary.id : null;
  const fallback = bestId ?? graph.nodes.filter((node) => isActive(node.id)).sort((a, b) => a.priority - b.priority)[0]?.id ?? null;
  const selected = picked && isActive(picked) ? picked : fallback;
  const inspected = hovered ?? selected;
  const focus = useMemo(() => collectChain(inspected, layout), [inspected, layout]);
  const bounds = useMemo(() => boundsOf([...layout.positions.values()].filter((p) => isActive(p.node.id))), [layout, isActive]);
  const inset = mobile ? { top: 52, right: 12, bottom: 200, left: 12 } : { top: 52, right: 24, bottom: 88, left: 24 };
  const fit = useCallback((animated = true) => vp.goTo(fitView(bounds, vp.size, inset), animated), [bounds, vp.size, mobile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setPicked(null); setHovered(null); }, [graph.id, model.focusCat]);
  // Arranque legible (no «ver todo»): 101 títulos no caben, así que se abre en el mejor siguiente
  // con su etapa entera a la vista; el minimapa da el conjunto.
  const start = () => {
    const pos = fallback ? layout.positions.get(fallback) : null;
    if (mobile && pos) vp.goTo(centerOn(pos, { width: vp.size.width, height: vp.size.height - inset.bottom }, 0.85), false);
    else vp.goTo(readableView(bounds, pos, vp.size, inset), false);
  };
  const counts = useMemo(() => layout.layers.map((layer) => {
    const active = layer.filter((item) => isActive(item.id));
    return { done: active.filter((item) => progress.checked.has(item.id)).length, total: active.length };
  }), [layout, isActive, progress.checked]);
  const done = counts.reduce((sum, c) => sum + c.done, 0);
  const total = counts.reduce((sum, c) => sum + c.total, 0);
  const jump = (wx, wy) => vp.goTo({ k: vp.view.k, x: vp.size.width / 2 - wx * vp.view.k, y: vp.size.height / 2 - wy * vp.view.k }, false);
  useEffect(() => { if (vp.measured) start(); }, [vp.measured, vp.size.width, vp.size.height, bounds]); // eslint-disable-line react-hooks/exhaustive-deps

  const reveal = (id, zoomIn) => {
    const pos = layout.positions.get(id);
    if (pos && (zoomIn || isOffscreen(pos, vp.view, vp.size))) vp.goTo(centerOn(pos, vp.size, zoomIn ? Math.max(vp.view.k, 1) : vp.view.k));
  };
  const select = (id, { fromFocus = false, reveal: fly = false } = {}) => {
    if (!fromFocus && !fly && vp.wasDragged()) return;
    setPicked(id);
    if (fly) { reveal(id, true); document.querySelector(`.graph-view [data-node="${id}"]`)?.focus({ preventScroll: true }); }
    else if (fromFocus) reveal(id, false);
  };
  const open = (id) => { if (!vp.wasDragged()) actions.openCard(id); };
  const toBest = () => { if (bestId) select(bestId, { reveal: true }); };

  function onKeyDown(event) {
    const current = document.activeElement?.closest?.("[data-node]")?.getAttribute("data-node");
    let next = null;
    if (event.key.startsWith("Arrow") && current) next = neighborInDirection(layout, current, event.key, isActive);
    else if (event.key === "Home") { event.preventDefault(); toBest(); return; }
    else if (event.key === "+" || event.key === "=") vp.zoomBy(1.25);
    else if (event.key === "-") vp.zoomBy(1 / 1.25);
    else if (event.key === "0") fit();
    else return;
    event.preventDefault();
    if (next) document.querySelector(`.graph-view [data-node="${next}"]`)?.focus({ preventScroll: true });
  }

  const explicit = Boolean(hovered || picked);
  const nodeProps = (pos) => {
    const id = pos.node.id;
    const active = isActive(id);
    return {
      node: pos.node, state: states.get(id), level: guidance.levelById.get(id) ?? 0, stage: pos.rank + 1,
      selected: id === selected, inChain: focus.nodes.has(id), aiActive: activeTaskNodeIds.has(id),
      dimmed: !active || (explicit && !focus.nodes.has(id)), inactive: !active, tabIndex: active && id === selected ? 0 : -1,
      onSelect: select, onOpen: open, onHover: setHovered,
    };
  };
  const node = selected ? graph.nodeById.get(selected) : null;
  const labeled = vp.view.k >= LABEL_K;
  return (
    <div className={`graph-view ${mobile ? "is-mobile" : ""} ${vp.measured ? "" : "is-measuring"}`}>
      <div className={`graph-stage ${vp.animate ? "is-animated" : ""}`} onKeyDown={onKeyDown}>
        <StageRuler layout={layout} view={vp.view} size={vp.size} counts={counts} />
        <GraphCanvas layout={layout} graph={graph} view={vp.view} animate={vp.animate} focus={focus} states={states}
          nodeProps={nodeProps} viewport={vp} labeled={labeled} />
        <Callouts layout={layout} view={vp.view} labeled={labeled} bestId={bestId} selectedId={selected} hoveredId={hovered} graph={graph} />
        <GraphControls zoom={vp.view.k} onZoom={vp.zoomBy} onFit={() => fit()} onBest={toBest} hasBest={Boolean(bestId)} />
        {!mobile && <GraphLegend />}
        {!mobile && <GraphMinimap layout={layout} graph={graph} states={states} isActive={isActive} bestId={bestId} view={vp.view} size={vp.size} done={done} total={total} onJump={jump} />}
        {layout.hasCycle && <Notice tone="warn" className="graph-notice">{t("graph.cycleWarning")}</Notice>}
      </div>
      {node && (
        <NodePanel node={node} graph={graph} state={states.get(node.id)} checked={progress.checked} mobile={mobile}
          stage={{ n: layout.positions.get(node.id).rank + 1, total: layout.maxRank + 1 }}
          unlocks={[...(layout.children.get(node.id) ?? [])].map((id) => graph.nodeById.get(id)).filter(Boolean).sort((a, b) => a.priority - b.priority)}
          inView={isActive} isBest={node.id === bestId} hasBest={Boolean(bestId)} onSelect={select} onStudy={(id) => actions.openCard(id)} onBest={toBest} />
      )}
    </div>
  );
}
