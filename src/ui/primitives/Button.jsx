import { forwardRef, useId } from "react";
import { Loader2 } from "lucide-react";

// Botón con 6 estados (design-spec D.4). `disabledReason` usa aria-disabled (enfocable) + tooltip.
export const Button = forwardRef(function Button({
  variant = "secondary", size = "md", icon: Icon, iconRight: IconRight, loading = false,
  loadingLabel, minWidth, disabled = false, disabledReason, className = "", children, onClick, style, type = "button", ...rest
}, ref) {
  const reasonId = useId();
  const ariaDisabled = disabled && disabledReason;
  const iconSize = 16;
  const label = loading && loadingLabel ? loadingLabel : children;
  return (
    <button
      ref={ref}
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled && !disabledReason}
      aria-disabled={ariaDisabled ? "true" : undefined}
      aria-describedby={ariaDisabled ? reasonId : undefined}
      aria-busy={loading || undefined}
      data-tip={ariaDisabled ? disabledReason : undefined}
      style={{ minWidth, ...style }}
      onClick={(event) => {
        if (disabled || loading) { event.preventDefault(); return; }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? <Loader2 size={iconSize} strokeWidth={1.5} className="spin" aria-hidden="true" />
        : Icon ? <Icon size={iconSize} strokeWidth={1.5} aria-hidden="true" /> : null}
      {label != null && <span className="btn__label">{label}</span>}
      {IconRight && !loading ? <IconRight size={iconSize} strokeWidth={1.5} aria-hidden="true" /> : null}
      {ariaDisabled ? <span id={reasonId} className="sr-only">{disabledReason}</span> : null}
    </button>
  );
});

export const IconButton = forwardRef(function IconButton({
  icon: Icon, label, size = "sm", pressed, active, className = "", iconSize = 16, tip = true, loading, ...rest
}, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`icon-btn icon-btn--${size} ${active ? "is-active" : ""} ${className}`}
      aria-label={label}
      aria-pressed={pressed}
      data-tip={tip ? label : undefined}
      {...rest}
    >
      {loading ? <Loader2 size={iconSize} strokeWidth={1.5} className="spin" aria-hidden="true" />
        : <Icon size={iconSize} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  );
});
