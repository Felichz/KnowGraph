import { AlertTriangle, PenLine, Sparkles } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { ScoreRail, ScoreValue } from "../primitives/Score.jsx";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { Skeleton } from "../primitives/Feedback.jsx";

function statusText(t, p) {
  if (typeof p.displayScore !== "number") return t("map.card.aria.unscored");
  return t(p.isComplete ? "map.card.aria.scoreMastered" : "map.card.aria.score", { score: Math.round(p.displayScore), max: 120 });
}

function ariaFor(t, { node, p, level, missing, aiActive }) {
  const parts = [node.label, t("map.card.aria.priority", { priority: node.priority }), statusText(t, p)];
  if (level === 1) parts.push(t("map.card.aria.bestNext")); else if (level) parts.push(t("map.card.aria.level", { level }));
  if (missing.length) parts.push(t("map.card.aria.missing", { list: missing.join(", ") }));
  if (aiActive) parts.push(t("map.card.aria.aiActive"));
  return parts.join(". ");
}

function RouteMark({ level }) {
  const t = useT();
  if (level === 1) return <span className="pill pill--accent">{t("map.card.bestNext")}</span>;
  if (level) return <span className="concept__level">{t("map.card.level", { level })}</span>;
  return null;
}

// Card de concepto de 140px fijos (design-spec D.9).
export function ConceptCard(props) {
  const { node, p, level, missing, aiActive, onOpen, loading } = props;
  const t = useT();
  return (
    <button type="button" className="concept card" data-node={node.id} aria-label={ariaFor(t, props)} onClick={onOpen}>
      <span className="concept__meta">
        <span className="mono t3">#{node.priority}</span>
        <span className="concept__meta-right">
          {aiActive && <Sparkles size={12} strokeWidth={1.5} className="ai-pulse" aria-hidden="true" />}
          <RouteMark level={level} />
        </span>
      </span>
      <span className="concept__title clamp-2">{node.label}</span>
      {loading ? <Skeleton height={4} radius="var(--r-full)" /> : <ScoreRail score={p.displayScore} />}
      <span className="concept__foot">
        {loading ? <Skeleton width={40} height={12} /> : <ScoreValue score={p.displayScore} />}
        {missing.length ? (
          <span className="concept__warn"><AlertTriangle size={12} strokeWidth={1.75} aria-hidden="true" /> {t("map.card.missingCount", { n: missing.length })}</span>
        ) : p.hasDraft && !p.representative ? (
          <span className="concept__draft"><PenLine size={12} strokeWidth={1.5} aria-hidden="true" /> {t("map.card.draft")}</span>
        ) : null}
      </span>
    </button>
  );
}

// Fila de 64px para móvil (design-spec D.9).
export function ConceptRow(props) {
  const { node, graph, p, level, aiActive, onOpen, loading } = props;
  const t = useT();
  return (
    <button type="button" className="concept-row" data-node={node.id} aria-label={ariaFor(t, props)} onClick={onOpen}>
      <CategoryDot graph={graph} cat={node.cat} />
      <span className="concept-row__text">
        <span className="concept-row__title clamp-2">{node.label}</span>
        {level === 1 ? <span className="concept-row__mark">{t("map.card.bestNext")}</span> : null}
      </span>
      <span className="concept-row__score">
        {aiActive && <Sparkles size={12} strokeWidth={1.5} className="ai-pulse" aria-hidden="true" />}
        {loading ? <Skeleton width={40} height={12} /> : <ScoreValue score={p.displayScore} />}
        <ScoreRail score={p.displayScore} className="concept-row__rail" />
      </span>
    </button>
  );
}
