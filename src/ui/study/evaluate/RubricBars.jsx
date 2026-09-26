import { displayScoreFromRaw } from "../../../ai/types.js";
import { ScoreRail } from "../../primitives/Score.jsx";

const DIMENSIONS = [
  { key: "accuracy", label: "Precisión" },
  { key: "causalityAndTradeoffs", label: "Por qué y trade-offs" },
  { key: "application", label: "Aplicación" },
  { key: "completeness", label: "Cobertura" },
];

// Rúbrica de 4 dimensiones en la escala visible 0–120.
export function RubricBars({ rubric }) {
  if (!rubric) return null;
  return (
    <section className="rubric" aria-label="Desglose por dimensión">
      {DIMENSIONS.map(({ key, label }) => {
        const dim = rubric[key];
        if (!dim) return null;
        const visible = displayScoreFromRaw(dim.max > 0 ? (dim.score / dim.max) * 100 : 0);
        return (
          <div key={key} className="rubric__row">
            <span className="rubric__label">{label}</span>
            <ScoreRail score={visible} label={`${label}: ${visible} de 120`} />
            <span className="rubric__num mono">{dim.score}/{dim.max}</span>
          </div>
        );
      })}
    </section>
  );
}
