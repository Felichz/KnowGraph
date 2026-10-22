import { ArrowRight, Check, Crosshair, Lock } from "lucide-react";
import { useLocale, useT } from "../../i18n/react.js";
import { getLessonContext } from "../../logic/guidance.js";
import { Button } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { ScoreRail, ScoreValue } from "../primitives/Score.jsx";

// Panel del concepto seleccionado (specs/003-graph-view §E). En móvil es una hoja compacta.
export function NodePanel({ node, graph, state, stage, unlocks, checked, inView, isBest, hasBest, onSelect, onStudy, onBest, mobile }) {
  const t = useT();
  const locale = useLocale();
  const prerequisites = node.prerequisites.map((id) => graph.nodeById.get(id)).filter(Boolean);
  const missing = prerequisites.filter((item) => !checked.has(item.id));
  const why = getLessonContext(node, prerequisites, missing, graph.categoryContext, locale);
  const eyebrow = isBest
    ? <span className="pill pill--accent">{t("map.card.bestNext")}</span>
    : <span className="eyebrow">{t("graph.panel.stage", stage)}</span>;
  const study = <Button variant="primary" iconRight={ArrowRight} onClick={() => onStudy(node.id)}>{t("graph.panel.study")}</Button>;

  if (mobile) {
    return (
      <aside className="gsheet" aria-label={t("graph.panel.label")}>
        <div className="gnpanel__top">{eyebrow}<CategoryLabel graph={graph} cat={node.cat} /></div>
        <h2 className="gsheet__title clamp-2">{node.label}</h2>
        <p className="gsheet__why t2 clamp-2">{why}</p>
        {study}
      </aside>
    );
  }
  const relation = (item) => (checked.has(item.id)
    ? <Check size={14} strokeWidth={2} className="grel__met" aria-label={t("map.status.mastered")} />
    : <Lock size={14} strokeWidth={1.75} className="grel__missing" aria-label={t("graph.legend.blocked")} />);
  return (
    <aside className="gnpanel" aria-label={t("graph.panel.label")}>
      <div className="gnpanel__head">
        <div className="gnpanel__top">{eyebrow}<CategoryLabel graph={graph} cat={node.cat} /></div>
        <h2 className="gnpanel__title">{node.label}</h2>
        <div className="gnpanel__score"><ScoreRail score={state.p.displayScore} /><ScoreValue score={state.p.displayScore} /></div>
        <div className="gnpanel__actions">
          {study}
          {hasBest && !isBest && <Button variant="ghost" icon={Crosshair} onClick={onBest}>{t("graph.panel.backToBest")}</Button>}
        </div>
      </div>
      <section className="gnpanel__block">
        <h3 className="eyebrow">{t("graph.panel.whyNow")}</h3>
        <p className="t2">{why}</p>
      </section>
      <Relations title={t("graph.panel.needs")} empty={t("graph.panel.needsNone")} items={prerequisites} icon={relation} inView={inView} onSelect={onSelect} onStudy={onStudy} />
      <Relations title={t("graph.panel.unlocks")} empty={t("graph.panel.unlocksNone")} items={unlocks}
        icon={() => <ArrowRight size={14} strokeWidth={1.5} className="grel__out" aria-hidden="true" />} inView={inView} onSelect={onSelect} onStudy={onStudy} />
    </aside>
  );
}

function Relations({ title, empty, items, icon, inView, onSelect, onStudy }) {
  const t = useT();
  return (
    <section className="gnpanel__block">
      <h3 className="eyebrow">{title} {items.length > 0 && <span className="mono">· {items.length}</span>}</h3>
      {items.length === 0 ? <p className="t3 gnpanel__none">{empty}</p> : (
        <ul className="grel">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="grel__btn" onClick={() => (inView(item.id) ? onSelect(item.id, { reveal: true }) : onStudy(item.id))}>
                {icon(item)}
                <span className="grel__num mono">#{item.priority}</span>
                <span className="grel__label clamp-2">{item.label}</span>
                {!inView(item.id) && <span className="t3 grel__note">{t("graph.panel.outOfFocus")}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
