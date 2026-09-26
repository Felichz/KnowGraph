import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const ICONS = { error: AlertCircle, warn: AlertTriangle, info: Info, success: CheckCircle2 };

// Aviso inline (DESIGN §1.4): una fila, sin borde de color.
export function Notice({ tone = "info", icon, children, action, className = "", role }) {
  const Icon = icon ?? ICONS[tone];
  return (
    <div className={`notice notice--${tone} ${className}`} role={role ?? (tone === "error" ? "alert" : undefined)}>
      <Icon size={16} strokeWidth={1.5} className="notice__icon" aria-hidden="true" />
      <div className="notice__body">{children}</div>
      {action ? <div className="notice__action">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ width = "100%", height = 12, radius = "var(--r-xs)", className = "", style }) {
  return <span aria-hidden="true" className={`skeleton ${className}`} style={{ width, height, borderRadius: radius, ...style }} />;
}

export function SkeletonLines({ lines = 3, height = 12, gap = 14, widths = ["100%", "94%", "70%"] }) {
  return (
    <div className="skeleton-lines" style={{ display: "grid", gap }} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => <Skeleton key={i} height={height} width={widths[i % widths.length]} />)}
    </div>
  );
}

// Estado vacío (design-spec D.9): icono, titular serif, texto, 1 acción.
export function EmptyState({ icon: Icon, title, children, action, compact = false }) {
  return (
    <div className={`empty ${compact ? "empty--compact" : ""}`}>
      {Icon ? <span className="empty__icon"><Icon size={20} strokeWidth={1.5} aria-hidden="true" /></span> : null}
      <h3 className="empty__title serif">{title}</h3>
      {children ? <p className="empty__text">{children}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
