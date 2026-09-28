import { Check, Circle, CircleDot } from "lucide-react";
import { buildCoachChecklist, mergeCoachCoverage } from "../../../ai/coverage.js";
import { useT } from "../../../i18n/react.js";
import { Notice } from "../../primitives/Feedback.jsx";

const ICON = { covered: Check, partial: CircleDot, missing: Circle, pending: Circle };
const STATUS = new Set(["covered", "partial", "missing", "pending"]);

// Panel de coaching: pista siguiente de la IA + checklist de ideas esenciales de la card.
export function CoachPanel({ node, live }) {
  const t = useT();
  const items = mergeCoachCoverage(buildCoachChecklist(node), live.review?.coverage);
  const hint = live.review?.hint;
  const covered = items.filter((i) => i.status === "covered").length;
  const [emptyBefore, emptyAfter = ""] = t("study.paraphrase.coach.empty").split("{action}");
  return (
    <aside className="coach" aria-label={t("study.paraphrase.coach.label")}>
      {live.error && <Notice tone="error">{live.error}</Notice>}
      {hint ? (
        <section className={`coach__hint ${live.stale ? "is-stale" : ""}`}>
          <span className="eyebrow">{hint.kind === "refinement" ? t("study.paraphrase.coach.deepen") : t("study.nextFocus")}</span>
          {hint.label && <p className="coach__hint-label">{hint.label}</p>}
          <p className="t2">{hint.detail || hint.text}</p>
          {live.stale && <p className="t3">{t("study.paraphrase.coach.stale")}</p>}
          {typeof live.review.displayScore === "number" && <p className="t3 mono">{t("study.paraphrase.coach.estimate", { score: live.review.displayScore })}</p>}
        </section>
      ) : (
        <section className="coach__hint is-empty">
          <span className="eyebrow">{t("study.paraphrase.coach.coaching")}</span>
          <p className="t2">{emptyBefore}<strong>{t("study.paraphrase.review")}</strong>{emptyAfter}</p>
        </section>
      )}
      <section className="coach__list">
        <h2 className="eyebrow">{t("study.paraphrase.coach.ideasToCover")} {live.review ? <span className="mono">· {covered}/{items.length}</span> : null}</h2>
        <ul>
          {items.map((item) => {
            const Icon = ICON[item.status] ?? Circle;
            return (
              <li key={item.id} className={`coach-item is-${item.status}`}>
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                <span>{item.text}<span className="sr-only"> ({STATUS.has(item.status) ? t(`study.paraphrase.coach.status.${item.status}`) : undefined})</span></span>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
