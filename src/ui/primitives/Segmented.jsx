import { useRef } from "react";

// Segmented = radiogroup (design-spec D.5 + F.6a). Flechas mueven y seleccionan.
export function Segmented({ options, value, onChange, label, size = "md", className = "", iconOnly = false }) {
  const refs = useRef([]);
  const index = Math.max(0, options.findIndex((option) => option.value === value));
  function move(delta) {
    const next = (index + delta + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }
  return (
    <div role="radiogroup" aria-label={label} className={`segmented segmented--${size} ${className}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); move(-1); }
      }}>
      {options.map((option, i) => {
        const checked = option.value === value;
        const Icon = option.icon;
        return (
          <button key={option.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio"
            aria-checked={checked} tabIndex={checked ? 0 : -1}
            aria-label={iconOnly ? option.label : undefined} data-tip={iconOnly ? option.label : undefined}
            className={`segmented__item ${checked ? "is-checked" : ""}`} onClick={() => onChange(option.value)}>
            {Icon ? <Icon size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
            {!iconOnly && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
