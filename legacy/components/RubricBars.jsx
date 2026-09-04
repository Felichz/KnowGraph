import React from "react";
import { displayScoreFromRaw } from "../ai/types.js";

const DIMENSIONS = [
  { key: "accuracy", label: "Precisión" },
  { key: "causalityAndTradeoffs", label: "Por qué y trade-offs" },
  { key: "application", label: "Aplicación" },
  { key: "completeness", label: "Cobertura" },
];

export function RubricBars({ rubric, compact = false }) {
  if (!rubric) return null;

  return (
    <section className={`rubric-breakdown ${compact ? "is-compact" : ""}`} aria-label="Desglose del score">
      <div className="rubric-breakdown__heading">
        <h4>Desglose del score</h4>
        <span>100 = base suficiente · 120 = excelencia</span>
      </div>
      <ul className="rubric" role="list">
        {DIMENSIONS.map(({ key, label }) => {
          const dim = rubric[key];
          if (!dim) return null;

          const coverage = dim.max > 0 ? (dim.score / dim.max) * 100 : 0;
          const visibleScore = displayScoreFromRaw(coverage);
          const baseWidth = `${Math.min(100, visibleScore) / 120 * 100}%`;
          const extraWidth = `${Math.max(0, visibleScore - 100) / 120 * 100}%`;
          const isExtra = visibleScore > 100;

          const row = (
            <>
              <span className="rubric__label">{label}</span>
              <span
                className="rubric__track"
                role="progressbar"
                aria-label={`${label}: ${visibleScore} de 120`}
                aria-valuemin="0"
                aria-valuemax="120"
                aria-valuenow={visibleScore}
              >
                <span className="rubric__fill" style={{ width: baseWidth }} />
                {isExtra && <span className="rubric__extra" style={{ width: extraWidth }} />}
                <span className="rubric__threshold" aria-hidden="true" />
              </span>
              <span className="rubric__value">
                <strong>{visibleScore}/120</strong>
                <small>{dim.score}/{dim.max} base</small>
              </span>
            </>
          );

          return (
            <li className={`rubric__row ${isExtra ? "is-extra" : ""}`} key={key}>
              <details className="rubric__details">
                <summary className="rubric__summary">{row}</summary>
                {dim.note && (
                  <div className="rubric__detail">
                    <span>Qué significa este resultado</span>
                    <p>{dim.note}</p>
                  </div>
                )}
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
