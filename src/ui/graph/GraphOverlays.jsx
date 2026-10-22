import { Crosshair, Maximize, Minus, Plus, Star } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { IconButton } from "../primitives/Button.jsx";
import { NODE_W, STEP_X, rankX } from "./graphUtils.js";

const toScreen = (pos, view) => ({ x: (pos.x + NODE_W / 2) * view.k + view.x, y: pos.y * view.k + view.y });

// Regla de etapas fija arriba: número de etapa y dominadas/total, siguiendo a la cámara.
export function StageRuler({ layout, view, size, counts }) {
  const t = useT();
  const roomy = STEP_X * view.k >= 96;
  return (
    <div className="gruler" aria-hidden="true">
      <span className="eyebrow gruler__title">{t("graph.ruler.stage")}</span>
      {layout.layers.map((layer, rank) => {
        const x = (rankX(rank) + NODE_W / 2) * view.k + view.x;
        if (x < 76 || x > size.width - 24 || !counts[rank]?.total) return null;
        const { done, total } = counts[rank];
        return (
          <span key={rank} className={`gruler__tick ${done === total ? "is-done" : ""}`} style={{ left: x }}>
            <span className="mono gruler__n">{rank + 1}</span>
            {roomy && <span className="mono gruler__count">{done}/{total}</span>}
          </span>
        );
      })}
    </div>
  );
}

// Etiquetas a tamaño de pantalla para lo que importa aunque el mapa esté alejado.
export function Callouts({ layout, view, labeled, bestId, selectedId, hoveredId, graph }) {
  const t = useT();
  const items = [];
  const push = (id, kind) => { if (id && layout.positions.has(id) && !items.some((it) => it.id === id)) items.push({ id, kind }); };
  push(hoveredId, "hover");
  push(bestId, "best");
  push(selectedId, "selected");
  return items.map(({ id, kind }) => {
    const best = id === bestId;
    if (labeled) return null;
    const { x, y } = toScreen(layout.positions.get(id), view);
    return (
      <div key={id} className={`gcallout is-${kind} ${labeled ? "is-badge" : ""}`} style={{ left: x, top: y }} aria-hidden="true">
        {best && <span className="pill pill--accent">{t("map.card.bestNext")}</span>}
        {!labeled && <span className="gcallout__label">{graph.nodeById.get(id)?.label}</span>}
      </div>
    );
  });
}

export function GraphControls({ zoom, onZoom, onFit, onBest, hasBest }) {
  const t = useT();
  return (
    <div className="gpanel gpanel--controls" role="toolbar" aria-label={t("graph.controls.label")}>
      <IconButton icon={Crosshair} label={t("graph.controls.bestNext")} onClick={onBest} disabled={!hasBest} />
      <IconButton icon={Maximize} label={t("graph.controls.fit")} onClick={onFit} />
      <span className="gpanel__sep" aria-hidden="true" />
      <IconButton icon={Minus} label={t("graph.controls.zoomOut")} onClick={() => onZoom(1 / 1.25)} />
      <span className="gpanel__zoom mono" aria-live="polite">{Math.round(zoom * 100)}%</span>
      <IconButton icon={Plus} label={t("graph.controls.zoomIn")} onClick={() => onZoom(1.25)} />
    </div>
  );
}

export function GraphLegend({ mobile }) {
  const t = useT();
  const swatches = ["mastered", "available", "blocked", "best"];
  return (
    <div className="gpanel gpanel--legend" aria-label={t("graph.legend.label")}>
      <ul className="glegend">
        {swatches.map((kind) => <li key={kind}><span className={`glegend__swatch is-${kind}`} aria-hidden="true" />{t(`graph.legend.${kind}`)}</li>)}
        <li><Star size={12} strokeWidth={2} className="glegend__star" aria-hidden="true" />{t("graph.legend.extra")}</li>
        <li><span className="glegend__line is-chain" aria-hidden="true" />{t("graph.legend.chain")}</li>
        <li><span className="glegend__line is-out" aria-hidden="true" />{t("graph.legend.unlocks")}</li>
      </ul>
      {!mobile && <p className="glegend__hint">{t("graph.legend.hint")}</p>}
    </div>
  );
}
