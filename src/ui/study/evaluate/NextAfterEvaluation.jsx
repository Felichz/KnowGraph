import { ArrowRight, PenLine } from "lucide-react";
import { useT } from "../../../i18n/react.js";
import { Button } from "../../primitives/Button.jsx";
import { actions } from "../../state/useWorkspace.js";

// Después de evaluar nunca hay callejón sin salida (specs/007 §1): con 100+ el primario es el siguiente
// concepto; por debajo, mejorar la explicación. Volver al mapa queda como opción discreta.
export function NextAfterEvaluation({ node, model, go }) {
  const t = useT();
  const mastered = model.progress.checked.has(node.id);
  const next = model.guidance.primary && model.guidance.primary.id !== node.id ? model.guidance.primary : null;
  return (
    <>
      {mastered && next ? (
        <Button variant="primary" size="lg" iconRight={ArrowRight} onClick={() => actions.openCard(next.id)}>{t("study.evaluate.nextConcept", { label: next.label })}</Button>
      ) : (
        <Button variant={mastered ? "secondary" : "primary"} size="lg" icon={PenLine} onClick={() => go("paraphrase")}>{t("study.evaluate.improve")}</Button>
      )}
      <button type="button" className="stage__aside-link" onClick={actions.closeCard}>{t("study.backToMap")}</button>
    </>
  );
}
