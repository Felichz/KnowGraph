import { BarChart3, Layers, Map, Search, Settings2 } from "lucide-react";
import { actions, useWorkspace } from "../state/useWorkspace.js";

const ITEMS = [
  { id: "map", label: "Mapa", icon: Map },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "progress", label: "Progreso", icon: BarChart3 },
  { id: "search", label: "Buscar", icon: Search },
  { id: "settings", label: "Ajustes", icon: Settings2 },
];

// Dock inferior móvil (INF-012): 5 destinos en la zona del pulgar.
export function MobileDock() {
  const view = useWorkspace((s) => s.view);
  function go(id) {
    if (id === "search") actions.openOverlay("palette");
    else if (id === "settings") actions.openOverlay("settings");
    else actions.setView(id);
  }
  return (
    <nav className="dock" aria-label="Navegación principal móvil">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.id === view;
        return (
          <button key={item.id} type="button" className={`dock__item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => go(item.id)}>
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
