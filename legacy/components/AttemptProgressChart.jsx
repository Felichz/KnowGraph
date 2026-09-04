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
  const x = total <= 1 ? WIDTH / 2 : PADDING_X + (index / (total - 1)) * chartWidth;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const y = PADDING_TOP + ((SCORE_MAX - score) / (SCORE_MAX - scoreMin)) * chartHeight;
  return { x, y };
}

function defaultScoreFor(attempt) {
  return getScoreView(attempt?.evaluation)?.displayScore ?? 0;
}

export function AttemptProgressChart({
  attempts = [],
  coachIterations = [],
  viewIndex,
  onSelect,
  onSelectEvaluation,
  onSelectCoach,
  scoreAccessor = defaultScoreFor,
  eyebrow = "RECORRIDO",
  title = "Progreso entre intentos",
  itemLabel = "Punto",
  hint = "Seleccioná un punto para volver a ver ese intento o versión de coaching.",
  showLegend = true,
  className = "",
}) {
  const gradientId = `attempt-progress-gradient-${useId().replace(/:/g, "")}`;

  // Build unified chronological timeline points
  const rawPoints = [];

  if (Array.isArray(attempts)) {
    attempts.forEach((attempt, index) => {
      const score = Math.max(0, Math.min(SCORE_MAX, Number(scoreAccessor(attempt)) || 0));
      rawPoints.push({
        id: attempt.id || `eval-${attempt.createdAt || index}`,
        kind: "evaluation",
        item: attempt,
        originalIndex: index,
        createdAt: attempt.createdAt || new Date(0).toISOString(),
        score,
        titleLabel: `Evaluación #${index + 1}`,
        typeLabel: "Evaluación completa",
      });
    });
  }

  if (Array.isArray(coachIterations)) {
    coachIterations.forEach((iteration, index) => {
      const score = Math.max(0, Math.min(SCORE_MAX, Number(iteration.review?.displayScore ?? 0)));
      rawPoints.push({
        id: iteration.id || `coach-${iteration.createdAt || index}`,
        kind: "coach",
        item: iteration,
        originalIndex: index,
        createdAt: iteration.createdAt || new Date(0).toISOString(),
        score,
        titleLabel: `Coaching #${index + 1}`,
        typeLabel: "Coaching en vivo",
      });
    });
  }

  // Sort points chronologically
  rawPoints.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return a.kind === "coach" ? -1 : 1;
  });

  if (!rawPoints.length) return null;

  const scores = rawPoints.map((p) => p.score);
  const lowestScore = Math.min(...scores);
  const scoreMin = lowestScore < DEFAULT_SCORE_MIN
    ? Math.max(0, Math.floor(lowestScore / 10) * 10)
    : DEFAULT_SCORE_MIN;

  const points = rawPoints.map((point, index) => {
    const coords = pointFor(index, rawPoints.length, point.score, scoreMin);
    return {
      ...coords,
      ...point,
      index,
    };
  });

  const line = points.map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const baselineY = HEIGHT - PADDING_BOTTOM;
  const area = `${line} L ${points.at(-1).x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

  // Find active point
  let current = null;
  if (Number.isInteger(viewIndex)) {
    // If viewIndex is provided, search if it matches an evaluation or direct index
    current = points[viewIndex] ?? points.find((p) => p.originalIndex === viewIndex && p.kind === "evaluation") ?? points.at(-1);
  } else {
    current = points.at(-1);
  }

  const guides = [...new Set([scoreMin, 60, 100, 120].filter((score) => score >= scoreMin))]
    .map((score) => ({ score, y: pointFor(0, rawPoints.length, score, scoreMin).y }));

  const hasMultipleKinds = points.some((p) => p.kind === "coach") && points.some((p) => p.kind === "evaluation");

  const handlePointClick = (point) => {
    if (point.kind === "evaluation") {
      if (onSelectEvaluation) {
        onSelectEvaluation(point.originalIndex, point.item);
      } else if (onSelect) {
        onSelect(point.originalIndex);
      }
    } else if (point.kind === "coach") {
      if (onSelectCoach) {
        onSelectCoach(point.originalIndex, point.item);
      } else if (onSelect) {
        onSelect(point.originalIndex);
      }
    }
  };

  return (
    <section className={`attempt-progress ${className}`.trim()} aria-label={title}>
      <div className="attempt-progress__heading">
        <div>
          <span className="attempt-progress__eyebrow">{eyebrow}</span>
          <h4>{title}</h4>
        </div>
        <div className="attempt-progress__badge-group">
          {current && (
            <span className={`attempt-progress__current attempt-progress__current--${current.kind}`} aria-live="polite">
              {current.titleLabel} · {current.score}/120
            </span>
          )}
        </div>
      </div>

      <div className="attempt-progress__chart-wrap">
        <svg
          className="attempt-progress__chart"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={WIDTH}
          height={HEIGHT}
          role="img"
          aria-label={`${title}: ${points.length} puntos. ${current?.titleLabel || "Punto actual"} con score ${current?.score || 0} de 120.`}
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
          {current && <line className="attempt-progress__cursor" x1={current.x} x2={current.x} y1={PADDING_TOP} y2={baselineY} />}
          <path className="attempt-progress__area" d={area} fill={`url(#${gradientId})`} />
          <path className="attempt-progress__line-shadow" d={line} />
          <path className="attempt-progress__line" d={line} />

          {points.map((point) => {
            const { x, y, score, index, kind, titleLabel, typeLabel } = point;
            const isCurrent = current ? point.id === current.id : index === points.length - 1;
            const isExtra = score > 100;
            const isCoach = kind === "coach";

            return (
              <g
                className={`attempt-progress__point attempt-progress__point--${kind} ${isCurrent ? "is-current" : ""} ${isExtra ? "is-extra" : ""}`}
                key={point.id}
                role="button"
                tabIndex="0"
                aria-label={`Ir a ${titleLabel} (${typeLabel}), score ${score} de 120`}
                onClick={() => handlePointClick(point)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handlePointClick(point);
                  }
                }}
              >
                <title>{titleLabel} ({typeLabel}): {score}/120</title>
                {isCurrent && (
                  <circle
                    className={`attempt-progress__point-ring ${isCoach ? "attempt-progress__point-ring--coach" : ""}`}
                    cx={x}
                    cy={y}
                    r="11"
                  />
                )}
                <circle className="attempt-progress__point-hit" cx={x} cy={y} r="15" />
                {isCoach ? (
                  /* Diamond shape for coaching checkpoints */
                  <polygon
                    className="attempt-progress__point-diamond"
                    points={`${x},${y - 6} ${x + 6},${y} ${x},${y + 6} ${x - 6},${y}`}
                  />
                ) : (
                  /* Dot for canonical evaluation attempts */
                  <circle
                    className="attempt-progress__point-dot"
                    cx={x}
                    cy={y}
                    r={isCurrent ? 5.5 : 4.5}
                  />
                )}
                {isCurrent && (
                  <text className="attempt-progress__point-label" x={x} y={y - 17} textAnchor="middle">
                    {score}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="attempt-progress__scale" aria-hidden="true">
          <span>{points[0]?.titleLabel || "Primera"}</span>
          <span>100 · base suficiente</span>
          <span>{points.at(-1)?.titleLabel || "Más reciente"}</span>
        </div>
      </div>

      {(showLegend || hasMultipleKinds) && (
        <div className="attempt-progress__legend" role="note" aria-label="Referencias del gráfico">
          <span className="attempt-progress__legend-item attempt-progress__legend-item--eval">
            <span className="attempt-progress__legend-dot attempt-progress__legend-dot--eval" />
            <span><strong>Evaluación completa</strong> (score formal 120 pts)</span>
          </span>
          <span className="attempt-progress__legend-item attempt-progress__legend-item--coach">
            <span className="attempt-progress__legend-diamond attempt-progress__legend-diamond--coach" />
            <span><strong>Coaching en vivo</strong> (score estimado del borrador)</span>
          </span>
        </div>
      )}

      <p className="attempt-progress__hint">{hint}</p>
    </section>
  );
}
