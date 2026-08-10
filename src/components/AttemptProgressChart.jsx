import React, { useId } from "react";
import { getScoreView } from "../ai/types.js";

const WIDTH = 680;
const HEIGHT = 214;
const PADDING_X = 34;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 38;
const SCORE_MAX = 120;
const DEFAULT_SCORE_MIN = 60;

function pointFor(index, total, score, scoreMin) {
  const chartWidth = WIDTH - PADDING_X * 2;
  const x = total === 1 ? WIDTH / 2 : PADDING_X + (index / (total - 1)) * chartWidth;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const y = PADDING_TOP + ((SCORE_MAX - score) / (SCORE_MAX - scoreMin)) * chartHeight;
  return { x, y };
}

function defaultScoreFor(attempt) {
  return getScoreView(attempt?.evaluation)?.displayScore ?? 0;
}

export function AttemptProgressChart({
  attempts,
  viewIndex,
  onSelect,
  scoreAccessor = defaultScoreFor,
  eyebrow = "RECORRIDO",
  title = "Progreso entre intentos",
  itemLabel = "Intento",
  hint = "Seleccioná un punto para volver a ver ese intento.",
  className = "",
}) {
  const gradientId = `attempt-progress-gradient-${useId().replace(/:/g, "")}`;
  if (!attempts?.length) return null;

  const scores = attempts.map((attempt) => Math.max(0, Math.min(SCORE_MAX, Number(scoreAccessor(attempt)) || 0)));
  const lowestScore = Math.min(...scores);
  // Keep the graph focused on the useful interview range. If an actual
  // attempt falls below 60, lower the axis to a clean ten-point boundary so
  // that score is still visible without making the chart start at zero by
  // default.
  const scoreMin = lowestScore < DEFAULT_SCORE_MIN
    ? Math.max(0, Math.floor(lowestScore / 10) * 10)
    : DEFAULT_SCORE_MIN;
  const points = attempts.map((attempt, index) => {
    const score = scores[index];
    return { ...pointFor(index, attempts.length, score, scoreMin), attempt, index, score };
  });
  const line = points.map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const baselineY = HEIGHT - PADDING_BOTTOM;
  const area = `${line} L ${points.at(-1).x} ${baselineY} L ${points[0].x} ${baselineY} Z`;
  const current = points[viewIndex] ?? points.at(-1);
  const guides = [...new Set([scoreMin, 60, 100, 120].filter((score) => score >= scoreMin))]
    .map((score) => ({ score, y: pointFor(0, attempts.length, score, scoreMin).y }));

  return (
    <section className={`attempt-progress ${className}`.trim()} aria-label={title}>
      <div className="attempt-progress__heading">
        <div>
          <span className="attempt-progress__eyebrow">{eyebrow}</span>
          <h4>{title}</h4>
        </div>
        <span className="attempt-progress__current" aria-live="polite">
          {itemLabel} {current.index + 1} · {current.score}/120
        </span>
      </div>

      <div className="attempt-progress__chart-wrap">
        <svg
          className="attempt-progress__chart"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={WIDTH}
          height={HEIGHT}
          role="img"
          aria-label={`${title}: ${attempts.length} puntos. ${itemLabel} actual ${current.index + 1} con score ${current.score} de 120.`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#64e7dc" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#64e7dc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect className="attempt-progress__extra-zone" x={PADDING_X} y={PADDING_TOP} width={WIDTH - PADDING_X * 2} height={guides.find((guide) => guide.score === 100).y - PADDING_TOP} rx="8" />
          {guides.map(({ score, y }) => (
            <g key={score}>
              <line className={`attempt-progress__guide ${score === 100 ? "is-threshold" : ""}`} x1={PADDING_X} x2={WIDTH - PADDING_X} y1={y} y2={y} />
              <text className={`attempt-progress__guide-label ${score === 100 ? "is-threshold" : ""}`} x={PADDING_X - 8} y={y + 3} textAnchor="end">{score}</text>
            </g>
          ))}
          <line className="attempt-progress__cursor" x1={current.x} x2={current.x} y1={PADDING_TOP} y2={baselineY} />
          <path className="attempt-progress__area" d={area} fill={`url(#${gradientId})`} />
          <path className="attempt-progress__line-shadow" d={line} />
          <path className="attempt-progress__line" d={line} />

          {points.map(({ x, y, attempt, index, score }) => {
            const isCurrent = index === current.index;
            const isExtra = score > 100;
            return (
              <g
                className={`attempt-progress__point ${isCurrent ? "is-current" : ""} ${isExtra ? "is-extra" : ""}`}
                key={attempt.id ?? `${attempt.createdAt}-${index}`}
                role="button"
                tabIndex="0"
                aria-label={`Ir a ${itemLabel.toLowerCase()} ${index + 1}, score ${score} de 120`}
                onClick={() => onSelect(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(index);
                  }
                }}
              >
                <title>{itemLabel} {index + 1}: {score}/120</title>
                {isCurrent && <circle className="attempt-progress__point-ring" cx={x} cy={y} r="11" />}
                <circle className="attempt-progress__point-hit" cx={x} cy={y} r="15" />
                <circle className="attempt-progress__point-dot" cx={x} cy={y} r={isCurrent ? 5.5 : 4.5} />
                {isCurrent && <text className="attempt-progress__point-label" x={x} y={y - 17} textAnchor="middle">{score}</text>}
              </g>
            );
          })}
        </svg>
        <div className="attempt-progress__scale" aria-hidden="true">
          <span>Primera</span>
          <span>100 · base suficiente</span>
          <span>Más reciente</span>
        </div>
      </div>
      <p className="attempt-progress__hint">{hint}</p>
    </section>
  );
}
