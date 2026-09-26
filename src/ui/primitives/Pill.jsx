import { AlertTriangle, Check, Circle, CircleDashed, Star } from "lucide-react";

const STATUS = {
  exceptional: { icon: Star, tone: "gold", label: "Profundización extra" },
  strong: { icon: Check, tone: "mastery", label: "Base cubierta" },
  developing: { icon: CircleDashed, tone: "neutral", label: "En progreso" },
  review: { icon: AlertTriangle, tone: "warn", label: "Conviene revisar" },
  none: { icon: Circle, tone: "outline", label: "Sin evaluar" },
};

export function Pill({ tone = "neutral", icon: Icon, children, className = "", title }) {
  return (
    <span className={`pill pill--${tone} ${className}`} title={title}>
      {Icon ? <Icon size={12} strokeWidth={1.75} aria-hidden="true" /> : null}
      <span>{children}</span>
    </span>
  );
}

// Pill de estado de evaluación (DESIGN §1.4).
export function StatusPill({ status, label }) {
  const config = STATUS[status] ?? STATUS.none;
  return <Pill tone={config.tone} icon={config.icon}>{label ?? config.label}</Pill>;
}

export function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>;
}

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const MOD_KEY = isMac ? "⌘" : "Ctrl";
