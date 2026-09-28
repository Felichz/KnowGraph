import { BarChart3, Layers, Map, Search, Settings2 } from "lucide-react";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { useT } from "../../i18n/react.js";

const ITEMS = [
  { id: "map", labelKey: "shell.nav.map", icon: Map },
  { id: "flashcards", labelKey: "shell.nav.flashcards", icon: Layers },
  { id: "progress", labelKey: "shell.nav.progress", icon: BarChart3 },
  { id: "search", labelKey: "shell.nav.search", icon: Search },
  { id: "settings", labelKey: "shell.nav.settings", icon: Settings2 },
];

// Dock inferior móvil (INF-012): 5 destinos en la zona del pulgar.
export function MobileDock() {
  const view = useWorkspace((s) => s.view);
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
        return (
          <button key={item.id} type="button" className={`dock__item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => go(item.id)}>
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            <span>{t(item.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
