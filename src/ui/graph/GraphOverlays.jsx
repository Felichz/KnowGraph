import { ArrowRight, ArrowUpRight, Crosshair, Maximize, Minus, Plus } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { Button, IconButton } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";

function names(layout, ids) {
  return [...ids].map((id) => layout.positions.get(id)?.node.label).filter(Boolean);
}

// Overlays flotantes del grafo: lectura, controles, leyenda y panel táctil (INF-044…047).
export function GraphOverlays({ graph, layout, inspected, primary, stageOf, mobile, onPrimary, onFit, onZoom, selectedNode, onStudy, hasCycle }) {
  const t = useT();
  const node = inspected ? layout.positions.get(inspected)?.node : null;
  const parents = node ? names(layout, layout.parents.get(node.id) ?? []) : [];
  const children = node ? names(layout, layout.children.get(node.id) ?? []) : [];
  const stageFor = node ?? primary;
  return (
    <>
      <section className="gpanel gpanel--read" aria-live="polite">
        {node ? (
          <>
            <p className="gpanel__title">{node.label}</p>
            <p className="gpanel__text"><span className="t3">{t("graph.inspect.needs")}</span> {parents.length ? parents.join(", ") : t("graph.inspect.needsNone")}</p>
            <p className="gpanel__text"><span className="t3">{t("graph.inspect.unlocks")}</span> {children.length ? children.join(", ") : t("graph.inspect.unlocksNone")}</p>
          </>
        ) : (
          <>
            <p className="gpanel__title">{t("map.route.title")}</p>
            <p className="gpanel__text">{t("graph.inspect.help")}</p>
          </>
        )}
        {hasCycle && <Notice tone="warn">{t("graph.cycleWarning")}</Notice>}
      </section>
      <div className="gpanel gpanel--controls">
        {stageFor && <span className="gpanel__stage mono">{t("graph.controls.stage", { stage: stageOf(stageFor.id), total: layout.maxRank + 1 })}</span>}
        <div className="gpanel__group" role="group" aria-label={t("graph.controls.label")}>
          <IconButton icon={Crosshair} label={t("graph.controls.primary")} onClick={onPrimary} />
          <IconButton icon={Maximize} label={t("graph.controls.fit")} onClick={onFit} />
          <IconButton icon={Minus} label={t("graph.controls.zoomOut")} onClick={() => onZoom(1 / 1.16)} />
          <IconButton icon={Plus} label={t("graph.controls.zoomIn")} onClick={() => onZoom(1.16)} />
        </div>
      </div>
      {!mobile && (
        <div className="gpanel gpanel--legend" aria-label={t("graph.legend.label")}>
          <span><span className="glegend glegend--line" /> {t("map.route.title")}</span>
          <span><span className="glegend glegend--dash" /> {t("graph.legend.needs")}</span>
          <span className="glegend-text"><span className="is-mastery">✓</span> {t("map.status.mastered")} · <span className="is-gold">★</span> {t("graph.legend.extra")}</span>
          <span className="t3 gpanel__sub clamp-1">{graph.subtitle}</span>
          {graph.interviewQuestions?.length ? (
            <a href={graph.interviewQuestionSource} target="_blank" rel="noreferrer noopener">{t("graph.legend.questionsRef", { count: graph.interviewQuestions.length })} <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" /></a>
          ) : null}
        </div>
      )}
      {selectedNode && (
        <div className="gpanel gpanel--selected">
          <p className="gpanel__title clamp-2">{selectedNode.label}</p>
          <Button variant="primary" iconRight={ArrowRight} onClick={() => onStudy(selectedNode.id)}>{t("map.route.study")}</Button>
        </div>
      )}
    </>
  );
}
