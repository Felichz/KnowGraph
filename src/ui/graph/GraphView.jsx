import { useCallback, useEffect, useMemo, useState } from "react";
import { collectTopologyFocus, createTopologicalLayout } from "../../logic/topologicalLayout.js";
import { useIsMobile } from "../hooks/useMediaQuery.js";
import { actions } from "../state/useWorkspace.js";
import { GraphCanvas } from "./GraphCanvas.jsx";
import { GraphOverlays } from "./GraphOverlays.jsx";
import { NODE_H, centerOn, fitView, neighborInDirection, viewForPosition } from "./graphUtils.js";
import { useGraphViewport } from "./useGraphViewport.js";

// Vista Grafo (INF-040…047, C.13, F.6a): roving tabindex, hover/foco/selección táctil.
export default function GraphView({ model, activeTaskNodeIds }) {
  const { graph, guidance, progress, activeCats } = model;
  const mobile = useIsMobile();
  const layout = useMemo(() => createTopologicalLayout(graph, { nodeHeight: NODE_H }), [graph]);
  const vp = useGraphViewport({ x: 40, y: 30, k: 0.9 });
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const primary = guidance.primary ?? layout.layers[0]?.[0];
  const primaryPos = primary ? layout.positions.get(primary.id) : null;
  const inspected = hovered ?? selected;
  const focus = useMemo(() => collectTopologyFocus(inspected, layout), [inspected, layout]);
  const guideEdges = useMemo(() => {
    const route = guidance.levels.map((level) => level[0]).filter(Boolean);
    return new Set(route.slice(1).map((node, i) => `${route[i].id}->${node.id}`));
  }, [guidance.levels]);
  const isActive = useCallback((id) => activeCats.has(layout.positions.get(id)?.node.cat), [activeCats, layout]);
  const rovingId = focusId && isActive(focusId) ? focusId : primary?.id;

  const toPrimary = useCallback(() => { if (primaryPos) vp.setView(viewForPosition(primaryPos, layout.config, vp.size)); }, [primaryPos, layout, vp.size]); // eslint-disable-line
  useEffect(() => { toPrimary(); }, [graph.id, model.focusCat, vp.size.width, vp.size.height]); // eslint-disable-line

  function open(node, fromKeyboard) {
    if (!fromKeyboard && vp.wasDragged()) return;
    if (mobile && selected !== node.id) { setSelected(node.id); return; }
    actions.openCard(node.id);
  }
  function focusNode(id) {
    setFocusId(id);
    const pos = layout.positions.get(id);
    const { x, y, k } = vp.view;
    const sx = pos.x * k + x;
    const sy = pos.y * k + y;
    if (sx < 48 || sy < 48 || sx + 236 * k > vp.size.width - 48 || sy + NODE_H * k > vp.size.height - 48) vp.setView(centerOn(pos, vp.size, k));
  }
  function onKeyDown(event) {
    const current = document.activeElement?.closest?.("[data-node]")?.getAttribute("data-node");
    if (!current) return;
    let next = null;
    if (event.key.startsWith("Arrow")) next = neighborInDirection(layout, current, event.key, isActive);
    else if (event.key === "Home") next = primary?.id;
    else if (event.key === "+" || event.key === "=") vp.zoomBy(1.16);
    else if (event.key === "-") vp.zoomBy(1 / 1.16);
    else if (event.key === "0") vp.setView(fitView(layout, vp.size));
    else return;
    event.preventDefault();
    if (next) document.querySelector(`.graph-view [data-node="${next}"]`)?.focus();
  }
  const stageOf = (id) => (layout.positions.get(id)?.rank ?? 0) + 1;
  const nodeProps = (pos) => {
    const id = pos.node.id;
    const active = isActive(id);
    const dim = !active || (inspected && !focus.nodes.has(id));
    const state = [!active && "is-inactive", dim && "is-dimmed", focus.ancestors.has(id) && "is-ancestor", focus.descendants.has(id) && "is-descendant", selected === id && "is-selected"].filter(Boolean).join(" ");
    return {
      node: pos.node, p: progress.of(id), level: guidance.levelById.get(id) ?? 0, state, aiActive: activeTaskNodeIds.has(id),
      tabIndex: active && id === rovingId ? 0 : -1, stage: stageOf(id), onOpen: open, onHover: setHovered, onFocusNode: focusNode,
    };
  };
  return (
    <div className="graph-view" onKeyDown={onKeyDown} onClick={(event) => { if (event.target.tagName === "svg") setSelected(null); }}>
      <GraphCanvas layout={layout} graph={graph} view={vp.view} focus={focus} hovered={inspected} guideEdges={guideEdges} nodeProps={nodeProps} viewport={vp} />
      <GraphOverlays graph={graph} layout={layout} inspected={inspected} primary={primary} stageOf={stageOf} mobile={mobile}
        onPrimary={toPrimary} onFit={() => vp.setView(fitView(layout, vp.size))} onZoom={vp.zoomBy}
        selectedNode={mobile && selected ? layout.positions.get(selected)?.node : null} onStudy={(id) => actions.openCard(id)} hasCycle={layout.hasCycle} />
    </div>
  );
}
