import { Check, Star } from "lucide-react";
import { useT } from "../../i18n/react.js";

// Riel de puntaje 0–120 con marca en 100 y segmento dorado (DESIGN §8.1).
export function ScoreRail({ score, max = 120, threshold = 100, size = "sm", provisional = false, className = "", label }) {
  const t = useT();
  const has = typeof score === "number";
  const base = has ? Math.min(score, threshold) / max : 0;
  const extra = has ? Math.max(0, Math.min(score, max) - threshold) / max : 0;
  const mastered = has && score >= threshold;
  const aria = label ?? (has ? t("primitives.score.rail", { score: Math.round(score), max }) : t("common.status.unscored"));
  return (
    <div role="img" aria-label={aria} className={`rail rail--${size} ${provisional ? "is-provisional" : ""} ${className}`}>
      <span className={`rail__base ${mastered ? "is-mastered" : ""}`} style={{ width: `${base * 100}%` }} />
      {extra > 0 && <span className="rail__extra" style={{ left: `calc(${(threshold / max) * 100}% + 1px)`, width: `calc(${extra * 100}% - 1px)` }} />}
      <span className="rail__mark" style={{ left: `${(threshold / max) * 100}%` }} />
    </div>
  );
}

// Cifra n/120 con par numerador/denominador (DESIGN §2.6).
export function ScoreValue({ score, max = 120, size = "sm", showDenominator = true, empty, threshold = 100 }) {
  const t = useT();
  if (typeof score !== "number") return <span className={`score-value score-value--${size} is-empty`}>{empty ?? t("common.status.unscored")}</span>;
  const value = Math.round(score);
  return (
    <span className={`score-value score-value--${size}`} aria-label={t("common.scoreOf", { score: value, max })}>
      {value > threshold && <Star size={size === "lg" ? 16 : 12} strokeWidth={1.5} className="score-value__star" aria-hidden="true" />}
      {value === threshold && <Check size={size === "lg" ? 16 : 12} strokeWidth={2} className="score-value__check" aria-hidden="true" />}
      <span className="score-value__num" aria-hidden="true">{value}</span>
      {showDenominator && <span className="score-value__den" aria-hidden="true">/{max}</span>}
    </span>
  );
}
