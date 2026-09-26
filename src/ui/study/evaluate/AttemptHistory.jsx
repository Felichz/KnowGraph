import { getScoreView } from "../../../ai/types.js";
import { ScoreValue } from "../../primitives/Score.jsx";

// Historial de intentos con mini gráfico de evolución (más reciente arriba).
export function AttemptHistory({ attempts, selectedId, onSelect }) {
  const points = attempts.map((a) => getScoreView(a.evaluation)?.displayScore ?? 0);
  const w = 240, h = 64, step = points.length > 1 ? w / (points.length - 1) : 0;
  const y = (v) => h - (v / 120) * h;
  const path = points.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <aside className="history" aria-label="Historial de intentos">
      <h2 className="eyebrow">Historial · {attempts.length}</h2>
      {points.length > 1 && (
        <svg className="history__chart" viewBox={`-4 -4 ${w + 8} ${h + 8}`} role="img" aria-label={`Evolución: ${points.join(", ")}`}>
          <line x1="0" x2={w} y1={y(100)} y2={y(100)} className="history__threshold" />
          <path d={path} className="history__line" />
          {points.map((v, i) => <circle key={i} cx={i * step} cy={y(v)} r={attempts[i].id === selectedId ? 4 : 2.5} className={attempts[i].id === selectedId ? "is-selected" : ""} />)}
        </svg>
      )}
      <ol className="history__list">
        {[...attempts].reverse().map((a, i) => (
          <li key={a.id}>
            <button type="button" className={`history__item ${a.id === selectedId ? "is-active" : ""}`} aria-current={a.id === selectedId || undefined} onClick={() => onSelect(a.id)}>
              <span className="t3 mono">#{attempts.length - i}</span>
              <span className="history__date">{new Date(a.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}{a.isAiGenerated ? " · IA" : ""}</span>
              <ScoreValue score={getScoreView(a.evaluation)?.displayScore} />
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
