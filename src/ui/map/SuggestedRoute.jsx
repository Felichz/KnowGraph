import { ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { useLocale, useT } from "../../i18n/react.js";
import { getLessonContext } from "../../logic/guidance.js";
import { resumeTarget } from "../../logic/studyQueue.js";
import { useDueCount } from "../state/reviewStore.js";
import { Button } from "../primitives/Button.jsx";
import { CategoryLabel } from "../primitives/CategoryDot.jsx";
import { HeatCell } from "../primitives/HeatCell.jsx";
import { ScoreValue } from "../primitives/Score.jsx";
import { getCategoryColor } from "../theme/categoryPalette.js";
import { actions } from "../state/useWorkspace.js";
import { HowItWorks } from "./HowItWorks.jsx";

// «Siguiente paso» (specs/007 §1): una sola acción primaria — retomar lo empezado o estudiar el mejor
// siguiente — y, si hay cards para hoy, un enlace secundario para repasarlas. Nada más compite con ella.
export function SuggestedRoute({ model }) {
  const t = useT();
  const locale = useLocale();
  const { guidance, graph, progress, visible } = model;
  const due = useDueCount(model);
  const resume = resumeTarget(visible, progress);
  const node = resume?.node ?? guidance.primary;
  const fresh = !resume && progress.done === 0 && due === 0;
  const review = due > 0 && (
    <button type="button" className="next__review" onClick={() => actions.setView("flashcards")}>
      <Layers size={16} strokeWidth={1.5} aria-hidden="true" /> {t("map.next.review", { n: due })} <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );

  if (!node) {
    return (
      <section className="next is-done" aria-labelledby="next-title">
        <CheckCircle2 size={24} strokeWidth={1.5} aria-hidden="true" />
        <h2 id="next-title" className="next__title">{t("map.route.doneTitle")}</h2>
        <p className="t2">{t("map.route.doneBody")}</p>
        {review}
      </section>
    );
  }
  const p = progress.of(node.id);
  const prerequisites = node.prerequisites.map((id) => graph.nodeById.get(id)).filter(Boolean);
  const why = getLessonContext(node, prerequisites, prerequisites.filter((n) => !progress.checked.has(n.id)), graph.categoryContext, locale);
  const label = resume ? t("map.next.resumeLabel") : fresh ? t("map.next.startLabel") : t("map.card.bestNext");
  return (
    <section className="next" aria-labelledby="next-title" style={{ "--area": getCategoryColor(graph.id, node.cat) }}>
      <div className="next__top">
        <span className="pill pill--accent">{label}</span>
        <CategoryLabel graph={graph} cat={node.cat} />
      </div>
      <h2 id="next-title" className="next__title"><HeatCell graph={graph} node={node} p={p} size={18} />{node.label}</h2>
      <p className="t2 next__why">
        {resume ? t(`map.continue.state.${resume.stage}`) : why}
        {resume && typeof p.displayScore === "number" && <> · <ScoreValue score={p.displayScore} /></>}
      </p>
      <div className="next__actions">
        <Button variant="primary" size="lg" iconRight={ArrowRight} onClick={() => actions.openCard(node.id, { stage: resume?.stage ?? "read" })}>
          {resume ? t("map.continue.resumeAction") : fresh ? t("map.next.start") : t("map.route.studyNow")}
        </Button>
        {review}
      </div>
      {fresh && <HowItWorks />}
    </section>
  );
}
