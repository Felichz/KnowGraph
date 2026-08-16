import { useEffect, useId, useMemo, useState } from "react";
import { getNodeVisual, nodeAriaLabel } from "./graphViewData.jsx";
import { collectTopologyFocus, createTopologicalLayout } from "./topologicalLayout.js";
import { usePanZoom } from "./usePanZoom.js";

const VIEW_WIDTH = 1500;
const VIEW_HEIGHT = 900;

function splitLabel(label, maxChars = 29) {
  const words = label.split(/\s+/).filter(Boolean);
  const lines = [""];
  words.forEach((word) => {
    const current = lines.at(-1);
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || lines.length === 2) lines[lines.length - 1] = candidate;
    else lines.push(word);
  });
  if (lines.length > 2) lines.splice(2);
  if (lines[1]?.length > maxChars + 5) lines[1] = `${lines[1].slice(0, maxChars + 2).trim()}…`;
  return lines;
}

function truncateMeta(text, maxChars = 19) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 1).trim()}…` : text;
}

function edgePath(source, target, nodeWidth, nodeHeight) {
  const x1 = source.x + nodeWidth;
  const y1 = source.y + nodeHeight / 2;
  const x2 = target.x;
  const y2 = target.y + nodeHeight / 2;
  const distance = Math.max(54, (x2 - x1) * 0.46);
  return `M ${x1} ${y1} C ${x1 + distance} ${y1}, ${x2 - distance} ${y2}, ${x2} ${y2}`;
}

function viewForPosition(position, config, viewport) {
  const leadingInset = Math.min(72, Math.max(32, Math.round(viewport.width * 0.055)));
  const availableWidth = Math.max(config.nodeWidth, viewport.width - leadingInset * 2);
  const columnStep = config.nodeWidth + config.columnGap;
  const minimumUsefulScale = viewport.width <= 760 ? 0.84 : 0.88;

  // Choose a whole number of visible stages so the next one never appears as
  // an ambiguous clipped sliver at the right edge of the map.
  let visibleColumns = 1;
  while (availableWidth / (config.nodeWidth + visibleColumns * columnStep) >= minimumUsefulScale) {
    visibleColumns += 1;
  }
  const scale = Math.min(
    1.04,
    availableWidth / (config.nodeWidth + (visibleColumns - 1) * columnStep),
  );

  return {
    k: scale,
    x: leadingInset - position.x * scale,
    y: viewport.height / 2 - (position.y + config.nodeHeight / 2) * scale,
  };
}

function Icon({ name }) {
  if (name === "fit") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 3H3v4M13 3h4v4M7 17H3v-4M13 17h4v-4" /></svg>;
  }
  if (name === "focus") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3" /><path d="M10 2v3M10 15v3M2 10h3M15 10h3" /></svg>;
  }
  if (name === "minus") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12" /></svg>;
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12" /></svg>;
}

export default function GraphTopologyView({ context, selected, onToggleNode, onBackgroundClick }) {
  const { graph, guidance } = context;
  const markerPrefix = useId().replaceAll(":", "");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? VIEW_WIDTH : Math.max(360, window.innerWidth),
    height: typeof window !== "undefined" && window.innerWidth <= 760 ? 500 : 650,
  }));
  const layout = useMemo(() => createTopologicalLayout(graph), [graph]);
  const guideEdgeIds = useMemo(() => {
    const route = guidance.levels.map((level) => level[0]).filter(Boolean);
    return new Set(route.slice(1).map((node, index) => `${route[index].id}->${node.id}`));
  }, [guidance.levels]);
  const primaryNode = graph.nodes.find((node) => guidance.levelById.get(node.id) === 1)
    ?? layout.layers[0]?.[0]
    ?? graph.nodes[0];
  const primaryPosition = layout.positions.get(primaryNode?.id);
  const initialView = primaryPosition
    ? viewForPosition(primaryPosition, layout.config, viewport)
    : { x: 40, y: 30, k: 0.85 };
  const { ref, view, setView, wasDragged, panHandlers } = usePanZoom({ min: 0.18, max: 1.7, initial: initialView });
  const focus = useMemo(() => collectTopologyFocus(hoveredNodeId, layout), [hoveredNodeId, layout]);
  const hoveredPosition = hoveredNodeId ? layout.positions.get(hoveredNodeId) : null;
  const focusedPosition = hoveredPosition ?? primaryPosition;
  const focusedStage = focusedPosition?.rank ?? 0;
  const hoveredParents = hoveredNodeId ? layout.parents.get(hoveredNodeId)?.size ?? 0 : 0;
  const hoveredChildren = hoveredNodeId ? layout.children.get(hoveredNodeId)?.size ?? 0 : 0;

  useEffect(() => {
    const svg = ref.current;
    if (!svg || typeof ResizeObserver === "undefined") return undefined;
    const updateViewport = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setViewport((current) => {
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        return current.width === width && current.height === height ? current : { width, height };
      });
    };
    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (primaryPosition) setView(viewForPosition(primaryPosition, layout.config, viewport));
  }, [graph.id, layout.config, primaryPosition, setView, viewport.height, viewport.width]);

  const selectNode = (node) => {
    if (wasDragged()) return;
    onToggleNode(node);
  };

  const fitAll = () => {
    const padding = 64;
    const k = Math.min(
      1,
      (viewport.width - padding * 2) / layout.width,
      (viewport.height - padding * 2) / layout.height,
    );
    setView({
      k,
      x: (viewport.width - layout.width * k) / 2,
      y: (viewport.height - layout.height * k) / 2,
    });
  };

  const focusPrimary = () => {
    if (primaryPosition) setView(viewForPrimary(primaryPosition, layout.config, viewport));
  };
  function viewForPrimary(position, config, viewport) {
    const scale = Math.min(1.3, viewport.width / 580);
    return {
      k: scale,
      x: viewport.width / 2 - (position.x + config.nodeWidth / 2) * scale,
      y: viewport.height / 2 - (position.y + config.nodeHeight / 2) * scale,
    };
  }

  const zoom = (factor) => {
    setView((current) => {
      const k = Math.min(1.7, Math.max(0.18, current.k * factor));
      const worldX = (viewport.width / 2 - current.x) / current.k;
      const worldY = (viewport.height / 2 - current.y) / current.k;
      return { k, x: viewport.width / 2 - worldX * k, y: viewport.height / 2 - worldY * k };
    });
  };

  return (
    <div className="topology-graph-shell">
      <div className="topology-graph-toolbar">
        <div className={`topology-graph-reading ${hoveredPosition ? "is-inspecting" : ""}`} aria-live="polite">
          {hoveredPosition ? (
            <>
              <strong>{hoveredPosition.node.label}</strong>
              <span className="topology-relation-summary">
                <b className="is-incoming">Necesita {hoveredParents}</b>
                <b className="is-outgoing">Habilita {hoveredChildren}</b>
              </span>
            </>
          ) : (
            <>
              <strong>Ruta sugerida</strong>
              <span>Mostramos solo el próximo avance. Pasá por un nodo para inspeccionar sus relaciones directas.</span>
            </>
          )}
        </div>
        <div className="topology-graph-stage" aria-live="polite">
          Etapa {focusedStage + 1} de {layout.maxRank + 1}
        </div>
        <div className="topology-graph-controls" aria-label="Controles del mapa">
          <button type="button" className="focus-button" onClick={focusPrimary} disabled={!primaryPosition} title="Centrar el pr\u00F3ximo foco">
            <Icon name="focus" />
            <span>Próximo foco</span>
          </button>
          <button type="button" onClick={fitAll} title="Ver el mapa completo" aria-label="Ver el mapa completo"><Icon name="fit" /></button>
          <button type="button" onClick={() => zoom(1 / 1.16)} title="Alejar" aria-label="Alejar"><Icon name="minus" /></button>
          <button type="button" onClick={() => zoom(1.16)} title="Acercar" aria-label="Acercar"><Icon name="plus" /></button>
        </div>
      </div>

      <svg
        ref={ref}
        className="graph topology-graph"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        role="application"
        aria-label={`Mapa topológico de ${graph.title}. ${layout.maxRank + 1} etapas y ${layout.edges.length} dependencias.`}
        onClick={(event) => { if (!event.target.closest(".topology-node")) onBackgroundClick(); }}
        {...panHandlers}
      >
        <defs>
          <marker className="topology-marker topology-marker--default" id={`${markerPrefix}-edge`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker className="topology-marker topology-marker--incoming" id={`${markerPrefix}-incoming`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker className="topology-marker topology-marker--outgoing" id={`${markerPrefix}-outgoing`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker className="topology-marker topology-marker--guide" id={`${markerPrefix}-guide`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <rect className="topology-graph-backdrop" width={viewport.width} height={viewport.height} />
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          {layout.layers.map((layer, rank) => {
            const x = layout.config.paddingX + rank * (layout.config.nodeWidth + layout.config.columnGap);
            const layerPositions = layer.map((node) => layout.positions.get(node.id)).filter(Boolean);
            const firstY = Math.min(...layerPositions.map((position) => position.y));
            const lastY = Math.max(...layerPositions.map((position) => position.y)) + layout.config.nodeHeight;
            return (
              <g className="topology-stage" key={rank}>
                <rect
                  className="topology-stage__surface"
                  x={x - 26}
                  y={firstY - 76}
                  width={layout.config.nodeWidth + 52}
                  height={lastY - firstY + 104}
                  rx="14"
                />
                <g className="topology-stage__header" transform={`translate(${x}, ${firstY - 54})`}>
                  <text className="topology-stage__index" x="0" y="12">ETAPA {rank + 1}</text>
                  <text className="topology-stage__meta" x="0" y="28">
                    {rank === 0 ? "Punto de partida" : `${layer.length} conceptos`}
                  </text>
                </g>
              </g>
            );
          })}

          <g className="topology-edges" aria-hidden="true">
            {layout.edges.map(([sourceId, targetId]) => {
              const source = layout.positions.get(sourceId);
              const target = layout.positions.get(targetId);
              if (!source || !target) return null;
              const sourceVisual = getNodeVisual(source.node, context);
              const targetVisual = getNodeVisual(target.node, context);
              const edgeId = `${sourceId}->${targetId}`;
              const inFocusedChain = hoveredNodeId && focus.edges.has(edgeId);
              const incoming = inFocusedChain && targetId === hoveredNodeId;
              const outgoing = inFocusedChain && sourceId === hoveredNodeId;
              const guide = guideEdgeIds.has(edgeId);
              const visible = hoveredNodeId ? inFocusedChain : guide;
              if (!visible) return null;
              const dimmed = sourceVisual.dimmed || targetVisual.dimmed;
              const marker = incoming ? `${markerPrefix}-incoming` : outgoing ? `${markerPrefix}-outgoing` : guide ? `${markerPrefix}-guide` : `${markerPrefix}-edge`;
              return (
                <path
                  key={edgeId}
                  className={`topology-edge ${incoming ? "is-incoming" : ""} ${outgoing ? "is-outgoing" : ""} ${guide ? "is-guide" : ""} ${dimmed ? "is-dimmed" : ""}`}
                  d={edgePath(source, target, layout.config.nodeWidth, layout.config.nodeHeight)}
                  markerEnd={`url(#${marker})`}
                />
              );
            })}
          </g>

          <g className="topology-nodes">
            {[...layout.positions.values()].map(({ node, x, y, rank }) => {
              const visual = getNodeVisual(node, context);
              const isSelected = selected?.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const inFocusedChain = !hoveredNodeId || focus.nodes.has(node.id);
              const dimmed = visual.dimmed || !inFocusedChain;
              const lines = splitLabel(node.label);
              const score = visual.score?.displayScore ?? 0;
              const baseWidth = (Math.min(score, 100) / 120) * (layout.config.nodeWidth - 24);
              const extraWidth = (Math.max(0, score - 100) / 120) * (layout.config.nodeWidth - 24);
              const scoreLabel = visual.score ? `${score}/120` : "Sin evaluar";
              const guideLabel = visual.guideLevel === 1 ? "MEJOR SIGUIENTE" : `NIVEL ${visual.guideLevel}`;
              const guideWidth = visual.guideLevel === 1 ? 126 : 78;
              return (
                <g
                  key={node.id}
                  className={`topology-node guide-node-${visual.guideLevel} ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""} ${visual.isChecked ? "is-complete" : ""} ${!visual.isChecked && visual.guideLevel !== 1 ? "is-incomplete" : ""} ${visual.extra > 0 ? "has-excellence" : ""} ${dimmed ? "is-dimmed" : ""}`}
                  transform={`translate(${x},${y})`}
                  style={{ "--node-color": visual.color }}
                  role="button"
                  tabIndex={visual.dimmed ? -1 : 0}
                  aria-label={`${nodeAriaLabel(node, visual)} Etapa ${rank + 1} de ${layout.maxRank + 1}.`}
                  aria-pressed={isSelected}
                  onPointerEnter={() => setHoveredNodeId(node.id)}
                  onPointerLeave={() => setHoveredNodeId(null)}
                  onFocus={() => setHoveredNodeId(node.id)}
                  onBlur={() => setHoveredNodeId(null)}
                  onClick={(event) => { event.stopPropagation(); selectNode(node); }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    onToggleNode(node);
                  }}
                >
                  <title>{`${node.label}. Etapa ${rank + 1}. ${scoreLabel}.`}</title>
                  {visual.extra > 0 && <rect className="topology-node__excellence-aura" x="-7" y="-7" width={layout.config.nodeWidth + 14} height={layout.config.nodeHeight + 14} rx="15" />}
                  <rect className="topology-node__surface" width={layout.config.nodeWidth} height={layout.config.nodeHeight} rx="11" />
                  <circle className="topology-node__category-dot" cx="14" cy="17" r="3.5" />
                  <text className="topology-node__category" x="24" y="20">{truncateMeta(visual.category.label)}</text>
                  <text className="topology-node__score" x={layout.config.nodeWidth - 12} y="20" textAnchor="end">{scoreLabel}</text>
                  <text className="topology-node__label" x="14" y={lines.length > 1 ? "43" : "49"}>
                    {lines.map((line, index) => <tspan key={line} x="14" dy={index === 0 ? 0 : 16}>{line}</tspan>)}
                  </text>
                  <rect className="topology-node__progress-track" x="12" y={layout.config.nodeHeight - 8} width={layout.config.nodeWidth - 24} height="3" rx="1.5" />
                  {baseWidth > 0 && <rect className="topology-node__progress-base" x="12" y={layout.config.nodeHeight - 8} width={baseWidth} height="3" rx="1.5" />}
                  {extraWidth > 0 && <rect className="topology-node__progress-extra" x={12 + ((100 / 120) * (layout.config.nodeWidth - 24))} y={layout.config.nodeHeight - 8} width={extraWidth} height="3" rx="1.5" />}
                  <line className="topology-node__mastery-mark" x1={12 + ((100 / 120) * (layout.config.nodeWidth - 24))} x2={12 + ((100 / 120) * (layout.config.nodeWidth - 24))} y1={layout.config.nodeHeight - 11} y2={layout.config.nodeHeight - 3} />
                  {visual.guideLevel > 0 && (
                    <g
                      className={`topology-node__guide topology-node__guide--${visual.guideLevel}`}
                      transform={`translate(${(layout.config.nodeWidth - guideWidth) / 2}, -30)`}
                    >
                      <line className="topology-node__guide-connector" x1={guideWidth / 2} y1="18" x2={guideWidth / 2} y2="30" />
                      <rect x="0" y="0" width={guideWidth} height="18" rx="9" />
                      <circle className="topology-node__guide-dot" cx="10" cy="9" r="2.5" />
                      <text x="17" y="12">{guideLabel}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
