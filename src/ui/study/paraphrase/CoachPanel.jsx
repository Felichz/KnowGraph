import { Check, Circle, CircleDot } from "lucide-react";
import { buildCoachChecklist, mergeCoachCoverage } from "../../../ai/coverage.js";
import { Notice } from "../../primitives/Feedback.jsx";

const ICON = { covered: Check, partial: CircleDot, missing: Circle, pending: Circle };
const STATUS = { covered: "cubierto", partial: "parcial", missing: "falta", pending: "sin revisar" };

// Panel de coaching: pista siguiente de la IA + checklist de ideas esenciales de la card.
export function CoachPanel({ node, live }) {
  const items = mergeCoachCoverage(buildCoachChecklist(node), live.review?.coverage);
  const hint = live.review?.hint;
  const covered = items.filter((i) => i.status === "covered").length;
  return (
    <aside className="coach" aria-label="Guía para tu explicación">
      {live.error && <Notice tone="error">{live.error}</Notice>}
      {hint ? (
        <section className={`coach__hint ${live.stale ? "is-stale" : ""}`}>
          <span className="eyebrow">{hint.kind === "refinement" ? "Para profundizar" : "Próximo foco"}</span>
          {hint.label && <p className="coach__hint-label">{hint.label}</p>}
          <p className="t2">{hint.detail || hint.text}</p>
          {live.stale && <p className="t3">Cambiaste el borrador desde esta revisión. Volvé a revisar para actualizarla.</p>}
          {typeof live.review.displayScore === "number" && <p className="t3 mono">Estimado: {live.review.displayScore}/120</p>}
        </section>
      ) : (
        <section className="coach__hint is-empty">
          <span className="eyebrow">Coaching</span>
          <p className="t2">Cuando tengas un borrador, tocá <strong>Revisar con IA</strong> y te marco qué ideas ya cubriste y cuál conviene sumar.</p>
        </section>
      )}
      <section className="coach__list">
        <h2 className="eyebrow">Ideas a cubrir {live.review ? <span className="mono">· {covered}/{items.length}</span> : null}</h2>
        <ul>
          {items.map((item) => {
            const Icon = ICON[item.status] ?? Circle;
            return (
              <li key={item.id} className={`coach-item is-${item.status}`}>
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                <span>{item.text}<span className="sr-only"> ({STATUS[item.status]})</span></span>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
