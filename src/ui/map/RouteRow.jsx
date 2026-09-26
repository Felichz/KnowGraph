import { Check, Star } from "lucide-react";

// Fila de la ruta: #prioridad + label + estado (D.9 RouteRow).
export function RouteRow({ node, p, onOpen, prefix }) {
  const extra = p?.displayScore > 100;
  const done = p?.isComplete;
  return (
    <button type="button" className="route-row" onClick={onOpen}>
      <span className="route-row__num mono">{prefix ?? `#${node.priority}`}</span>
      <span className="route-row__label clamp-1">{node.label}</span>
      {extra ? <Star size={12} strokeWidth={1.75} className="route-row__icon is-gold" aria-label="Profundización extra" />
        : done ? <Check size={12} strokeWidth={2} className="route-row__icon is-mastery" aria-label="Dominada" /> : null}
    </button>
  );
}
