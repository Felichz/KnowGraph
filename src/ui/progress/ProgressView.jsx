import { useMemo } from "react";
import { Check, Lock } from "lucide-react";
import { getMilestoneProgress, getSeniorityProgress } from "../../logic/seniorityProgress.js";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { actions } from "../state/useWorkspace.js";

function Bar({ value, tone }) {
  return <span className={`pbar ${tone ? `pbar--${tone}` : ""}`} aria-hidden="true"><span style={{ width: `${value}%` }} /></span>;
}

// Progreso (US7): total, bandas de seniority, milestones y avance por categoría.
export function ProgressView({ model }) {
  const { graph, progress } = model;
  const bands = useMemo(() => getSeniorityProgress(graph.seniorityBands ?? [], progress.checked, graph.nodeIds), [graph, progress.checked]);
  const milestones = useMemo(() => getMilestoneProgress(graph.milestones ?? [], progress.checked, graph.nodeIds), [graph, progress.checked]);
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const firstPending = (ids) => graph.nodes.filter((n) => ids.includes(n.id) && !progress.checked.has(n.id)).sort((a, b) => a.priority - b.priority)[0];

  return (
    <div className="progress">
      <section className="progress__hero">
        <span className="eyebrow">{graph.label}</span>
        <p className="progress__big"><span className="mono">{progress.done}</span><span className="t3 mono">/{progress.total}</span> <span className="progress__big-label">cards dominadas</span></p>
        <Bar value={pct} />
        <p className="t2">Una card queda dominada con 100/120 en una evaluación. {pct === 100 ? "Completaste el mapa." : `Vas ${pct}%.`}</p>
      </section>
      {bands.length > 0 && (
        <section className="progress__section">
          <h2 className="progress__h">Niveles de seniority</h2>
          <ol className="bands">
            {bands.map((b) => (
              <li key={b.id} className={`band ${b.complete ? "is-complete" : ""} ${!b.requirementsMet ? "is-locked" : ""}`}>
                <div className="band__head">
                  <span className="eyebrow">{b.stage}</span>
                  {b.complete ? <Check size={14} strokeWidth={2} className="band__icon" aria-label="Completo" /> : !b.requirementsMet ? <Lock size={14} strokeWidth={1.5} className="band__icon" aria-label="Requiere el nivel anterior" /> : null}
                </div>
                <p className="band__label">{b.label}</p>
                <p className="t2 band__desc">{b.description}</p>
                <Bar value={b.percentage} tone={b.complete ? "mastery" : undefined} />
                <p className="t3 mono">{b.done}/{b.total} · {b.percentage}%</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      <section className="progress__section">
        <h2 className="progress__h">Hitos</h2>
        <ul className="milestones">
          {milestones.map((m) => {
            const next = firstPending(m.nodeIds ?? []);
            return (
              <li key={m.id} className="milestone">
                <div className="milestone__text"><p className="milestone__label">{m.label}</p><p className="t2">{m.description}</p></div>
                <div className="milestone__meta"><Bar value={m.percentage} tone={m.percentage === 100 ? "mastery" : undefined} /><span className="t3 mono">{m.done}/{m.total}</span></div>
                {next ? <button type="button" className="milestone__next" onClick={() => actions.openCard(next.id)}>Siguiente: {next.label} →</button> : <span className="milestone__done">Completo</span>}
              </li>
            );
          })}
        </ul>
      </section>
      <section className="progress__section">
        <h2 className="progress__h">Por categoría</h2>
        <ul className="cats">
          {Object.entries(graph.categories).map(([id, cat]) => {
            const c = progress.byCat[id] ?? { done: 0, total: 0 };
            return (
              <li key={id} className="cat-row">
                <button type="button" className="cat-row__btn" onClick={() => { actions.setFocus(id); actions.setView("map"); }}>
                  <CategoryDot graph={graph} cat={id} /><span className="clamp-1">{cat.label}</span>
                </button>
                <Bar value={c.total ? (c.done / c.total) * 100 : 0} /><span className="t3 mono">{c.done}/{c.total}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
