import { AlertTriangle, Check, Circle, CircleDashed, Star } from "lucide-react";
import { useT } from "../../i18n/react.js";

const STATUS = {
  exceptional: { icon: Star, tone: "gold", labelKey: "common.status.exceptional" },
  strong: { icon: Check, tone: "mastery", labelKey: "common.status.strong" },
  developing: { icon: CircleDashed, tone: "neutral", labelKey: "common.status.developing" },
  review: { icon: AlertTriangle, tone: "warn", labelKey: "common.status.review" },
  none: { icon: Circle, tone: "outline", labelKey: "common.status.unscored" },
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
  const t = useT();
  const config = STATUS[status] ?? STATUS.none;
  return <Pill tone={config.tone} icon={config.icon}>{label ?? t(config.labelKey)}</Pill>;
}

export function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>;
}

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const MOD_KEY = isMac ? "⌘" : "Ctrl";
