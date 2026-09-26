import { ArrowRight } from "lucide-react";

// Fila-botón de 2 líneas para labels dinámicos (design-spec D.4).
export function RowButton({ prefix, label, onClick, icon: Icon = ArrowRight, className = "" }) {
  return (
    <button type="button" className={`row-btn ${className}`} onClick={onClick} aria-label={`${prefix} ${label}`}>
      <span className="row-btn__text">
        <span className="row-btn__prefix">{prefix}</span>
        <span className="row-btn__label clamp-2">{label}</span>
      </span>
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
