import { useMemo } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { getMilestoneProgress, getSeniorityProgress } from "../../logic/seniorityProgress.js";
import { useT } from "../../i18n/react.js";
import { actions } from "../state/useWorkspace.js";

function Bar({ value, tone }) {
  return <span className={`pbar ${tone ? `pbar--${tone}` : ""}`} aria-hidden="true"><span style={{ width: `${value}%` }} /></span>;
}

// Niveles e hitos (specs/007): lo que antes era la vista Progreso, plegado bajo la rejilla.
// Es información para consultar de vez en cuando, no un destino de navegación.
export function Levels({ model }) {
  const t = useT();
  const { graph, progress } = model;
  const bands = useMemo(() => getSeniorityProgress(graph.seniorityBands ?? [], progress.checked, graph.nodeIds), [graph, progress.checked]);
  const milestones = useMemo(() => getMilestoneProgress(graph.milestones ?? [], progress.checked, graph.nodeIds), [graph, progress.checked]);
  const firstPending = (ids) => graph.nodes.filter((n) => ids.includes(n.id) && !progress.checked.has(n.id)).sort((a, b) => a.priority - b.priority)[0];
  const current = bands.find((b) => !b.complete) ?? bands.at(-1);

  return (
    <details className="levels">
      <summary className="levels__summary">
        <span className="levels__title">{t("progress.levels.title")}</span>
        {current && <span className="t3 levels__meta">{t("progress.levels.current", { label: current.label, done: current.done, total: current.total })}</span>}
        <ChevronDown size={16} strokeWidth={1.5} className="levels__chev" aria-hidden="true" />
      </summary>
      <div className="levels__body">
        {bands.length > 0 && (
          <ol className="bands" aria-label={t("progress.bands.title")}>
            {bands.map((b) => (
              <li key={b.id} className={`band ${b.complete ? "is-complete" : ""} ${!b.requirementsMet ? "is-locked" : ""}`}>
                <div className="band__head">
                  {b.complete ? <Check size={14} strokeWidth={2} className="band__icon" aria-label={t("progress.complete")} /> : !b.requirementsMet ? <Lock size={14} strokeWidth={1.5} className="band__icon" aria-label={t("progress.bands.locked")} /> : null}
                </div>
                <p className="band__label">{b.label} <span className="t3 band__stage">· {b.stage}</span></p>
                <p className="t2 band__desc">{b.description}</p>
                <Bar value={b.percentage} tone={b.complete ? "mastery" : undefined} />
                <p className="t3 mono">{b.done}/{b.total} · {b.percentage}%</p>
              </li>
            ))}
          </ol>
        )}
        <h3 className="progress__h">{t("progress.milestones.title")}</h3>
        <ul className="milestones">
          {milestones.map((m) => {
            const next = firstPending(m.nodeIds ?? []);
            return (
              <li key={m.id} className="milestone">
                <div className="milestone__text"><p className="milestone__label">{m.label}</p><p className="t2">{m.description}</p></div>
                <div className="milestone__meta"><Bar value={m.percentage} tone={m.percentage === 100 ? "mastery" : undefined} /><span className="t3 mono">{m.done}/{m.total}</span></div>
                {next ? <button type="button" className="milestone__next" onClick={() => actions.openCard(next.id)}>{t("progress.milestones.next", { label: next.label })}</button> : <span className="milestone__done">{t("progress.complete")}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
