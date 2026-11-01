import { Layers, Map, Search, Settings2 } from "lucide-react";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { useDueCount } from "../state/reviewStore.js";
import { useT } from "../../i18n/react.js";

const ITEMS = [
  { id: "map", labelKey: "shell.nav.map", icon: Map },
  { id: "flashcards", labelKey: "shell.nav.flashcards", icon: Layers },
  { id: "search", labelKey: "shell.nav.search", icon: Search },
  { id: "settings", labelKey: "shell.nav.settings", icon: Settings2 },
];

// Dock inferior móvil (specs/007): los dos destinos y las dos utilidades, en la zona del pulgar.
export function MobileDock({ model }) {
  const view = useWorkspace((s) => s.view);
  const due = useDueCount(model);
  const t = useT();
  function go(id) {
    if (id === "search") actions.openOverlay("palette");
    else if (id === "settings") actions.openOverlay("settings");
    else actions.setView(id);
  }
  return (
    <nav className="dock" aria-label={t("shell.nav.mobileLabel")}>
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.id === view;
        const badge = item.id === "flashcards" && due > 0;
        return (
          <button key={item.id} type="button" className={`dock__item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => go(item.id)}
            aria-label={badge ? `${t(item.labelKey)} · ${t("shell.nav.reviewDue", { n: due })}` : undefined}>
            <span className="dock__icon"><Icon size={20} strokeWidth={1.5} aria-hidden="true" />{badge && <span className="dock__badge mono" aria-hidden="true">{due}</span>}</span>
            <span>{t(item.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
