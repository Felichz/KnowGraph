import { useT } from "../../i18n/react.js";
import { heatLevel, scoreTier } from "../../logic/studyQueue.js";
import { HeatCell } from "../primitives/HeatCell.jsx";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { actions } from "../state/useWorkspace.js";

function cellLabel(t, node, p, now) {
  const tier = scoreTier(p);
  const score = Math.round(p.displayScore ?? 0);
  const status = tier === "none" ? t(heatLevel(p) ? "map.heat.status.draft" : "map.heat.status.none")
    : tier === "progress" ? t("map.heat.status.progress", { score }) : t(`map.heat.status.${tier}`, { score });
  return [node.label, status, now ? t("map.card.bestNext") : null].filter(Boolean).join(" · ");
}

// Rejilla de calor (DESIGN v4 §8.1, specs/005): el temario entero, una fila por área, una celda por concepto.
// Más color = más dominado. Pulsar una celda abre la card; pulsar el área la pone en foco.
export function HeatGrid({ model, size = "md", bare = false }) {
  const t = useT();
  const { graph, progress, visible, guidance, focusCat } = model;
  const nowId = guidance.primary?.id;
  const areas = Object.keys(graph.categories)
    .map((cat) => ({ cat, nodes: visible.filter((n) => n.cat === cat).sort((a, b) => a.priority - b.priority) }))
    .filter((area) => area.nodes.length);
  const done = visible.filter((n) => progress.checked.has(n.id)).length;
  const cols = Math.max(1, ...areas.map((a) => a.nodes.length));
  const track = `repeat(${cols}, var(--cell))`;
  return (
    <section className={`hgrid hgrid--${size} ${bare ? "hgrid--bare" : ""}`} aria-labelledby={bare ? undefined : "hgrid-title"} aria-label={bare ? t("map.heat.title") : undefined}>
      {!bare && <header className="hgrid__head">
        <h2 id="hgrid-title" className="hgrid__title">{t("map.heat.title")}</h2>
        <p className="hgrid__total"><span className="mono">{done}</span><span className="mono t3">/{visible.length}</span> {t("map.heat.mastered")}</p>
        <Legend color={getCategoryColor(graph.id, areas[0]?.cat)} />
      </header>}
      <ul className="hgrid__rows">
        {areas.map(({ cat, nodes }) => {
          const c = progress.byCat[cat] ?? { done: 0, total: 0 };
          const color = getCategoryColor(graph.id, cat);
          return (
            <li key={cat} className="hgrid__row" style={{ "--area": color }}>
              <button type="button" className={`hgrid__area ${focusCat === cat ? "is-focus" : ""}`} aria-pressed={focusCat === cat}
                onClick={() => actions.setFocus(focusCat === cat ? null : cat)}>
                <span className="hgrid__swatch" aria-hidden="true" />
                <span className="hgrid__name clamp-1">{graph.categories[cat].label}</span>
                <span className="hgrid__count mono">{c.done}/{c.total}</span>
              </button>
              <div className="hgrid__cells" style={{ gridTemplateColumns: track, "--cols": cols }}>
                {nodes.map((node) => {
                  const p = progress.of(node.id);
                  const label = cellLabel(t, node, p, node.id === nowId);
                  return (
                    <button key={node.id} type="button" className="hgrid__cell" aria-label={label} data-tip={label} onClick={() => actions.openCard(node.id)}>
                      <HeatCell graph={graph} node={node} p={p} now={node.id === nowId} />
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Legend({ color }) {
  const t = useT();
  const steps = ["h0", "h1", "h2", "h3", "h4"];
  return (
    <div className="hgrid__legend" aria-label={t("map.heat.legend.label")} role="img">
      <span className="t3">{t("map.heat.legend.less")}</span>
      {steps.map((h) => <span key={h} className={`heat ${h}`} style={{ "--area": color }} aria-hidden="true" />)}
      <span className="t3">{t("map.heat.legend.more")}</span>
      <span className="heat h4 is-extra" style={{ "--area": color }} aria-hidden="true" />
      <span className="t3">{t("map.heat.legend.extra")}</span>
    </div>
  );
}
