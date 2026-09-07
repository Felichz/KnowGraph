import React from "react";

export function Sparkline({ history = [], threshold = 100, width = 160, height = 40 }) {
  if (!history || history.length === 0) return null;

  const padX = 14;
  const padY = 8;
  const maxScore = 120;

  const points = history.map((item, idx) => {
    const x = history.length === 1
      ? width / 2
      : padX + (idx / (history.length - 1)) * (width - padX * 2);
    const score = Math.max(0, Math.min(maxScore, item.score ?? item.displayScore ?? 0));
    const y = height - padY - (score / maxScore) * (height - padY * 2);
    return { x, y, score, iteration: item.iteration ?? idx + 1 };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const thresholdY = height - padY - (threshold / maxScore) * (height - padY * 2);

  return (
    <div
      className="sparkline-wrap"
      title={`Trayectoria: ${points.map((p) => `${p.score}/120`).join(" → ")}`}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        {/* Línea guía de maestría (100 pts) */}
        <line
          x1={padX}
          y1={thresholdY}
          x2={width - padX}
          y2={thresholdY}
          stroke="var(--accent-green)"
          strokeDasharray="2,2"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Curva de evolución */}
        {points.length > 1 && (
          <polyline
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylineStr}
          />
        )}

        {/* Puntos de cada intento */}
        {points.map((p, i) => {
          const isLatest = i === points.length - 1;
          const isMastery = p.score >= 100;
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isLatest ? 3.5 : 2.5}
                fill={isMastery ? "var(--accent-green)" : "var(--accent-gold)"}
                stroke="var(--bg-canvas)"
                strokeWidth="1"
              />
              {isLatest && (
                <text
                  x={p.x}
                  y={p.y - 6}
                  fill={isMastery ? "var(--accent-green)" : "var(--accent-gold)"}
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  {p.score}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
