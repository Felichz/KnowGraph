import { displayScoreFromRaw } from "../../../ai/types.js";
import { useT } from "../../../i18n/react.js";
import { ScoreRail } from "../../primitives/Score.jsx";

const DIMENSIONS = ["accuracy", "causalityAndTradeoffs", "application", "completeness"].map((key) => ({ key, labelKey: `common.rubric.${key}` }));

// Rúbrica de 4 dimensiones en la escala visible 0–120.
export function RubricBars({ rubric }) {
  const t = useT();
  if (!rubric) return null;
  return (
    <section className="rubric" aria-label={t("study.evaluate.rubricLabel")}>
      {DIMENSIONS.map(({ key, labelKey }) => {
        const dim = rubric[key];
        if (!dim) return null;
        const label = t(labelKey);
        const visible = displayScoreFromRaw(dim.max > 0 ? (dim.score / dim.max) * 100 : 0);
        return (
          <div key={key} className="rubric__row">
            <span className="rubric__label">{label}</span>
            <ScoreRail score={visible} label={`${label}: ${t("common.scoreOf", { score: visible, max: 120 })}`} />
            <span className="rubric__num mono">{dim.score}/{dim.max}</span>
          </div>
        );
      })}
    </section>
  );
}
