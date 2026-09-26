import { BarChart3, Layers, Map, PanelLeftClose, PanelLeftOpen, Search, Settings2 } from "lucide-react";
import { listGraphs } from "../../logic/graphRegistry.js";
import { BrandGlyph } from "../primitives/BrandGlyph.jsx";
import { Segmented } from "../primitives/Segmented.jsx";
import { Menu } from "../primitives/Menu.jsx";
import { IconButton } from "../primitives/Button.jsx";
import { Kbd, MOD_KEY } from "../primitives/Pill.jsx";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { SidebarFocus } from "./SidebarFocus.jsx";
import { useProviderLabel } from "../hooks/useProviderLabel.js";

const NAV = [
  { view: "map", label: "Mapa", icon: Map },
  { view: "flashcards", label: "Flashcards", icon: Layers },
  { view: "progress", label: "Progreso", icon: BarChart3 },
];
const GRAPHS = listGraphs().map((graph) => ({ value: graph.id, label: graph.id === "react" ? "React" : "Rails", full: graph.label }));

// Sidebar persistente (design-spec D.1). `collapsed` = variante de 56px.
export function Sidebar({ model, collapsed, canExpand }) {
  const view = useWorkspace((s) => s.view);
  const providerLabel = useProviderLabel();
  const pct = model.progress.total ? Math.round((model.progress.done / model.progress.total) * 100) : 0;
  const pctLabel = model.progress.status === "error" ? "—" : `${pct}%`;
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`} aria-label="Navegación principal">
      <div className="sidebar__head">
        {collapsed && canExpand ? (
          <IconButton icon={PanelLeftOpen} size="md" label="Expandir barra lateral" data-tip-side="right" onClick={() => actions.setPref("sidebarCollapsed", false)} />
        ) : <BrandGlyph size={collapsed ? 24 : 20} />}
        {!collapsed && <span className="sidebar__brand">Learning Workspace</span>}
        {!collapsed && canExpand && (
          <IconButton icon={PanelLeftClose} label="Colapsar barra lateral" onClick={() => actions.setPref("sidebarCollapsed", true)} className="sidebar__collapse" />
        )}
      </div>
      <div className="sidebar__graph">
        {collapsed ? (
          <Menu label="Elegir mapa" value={model.graphId} onSelect={actions.setGraph} align="start"
            items={GRAPHS.map((g) => ({ value: g.value, label: g.full }))}
            trigger={(props) => (
              <button type="button" {...props} className="icon-btn icon-btn--md sidebar__mono mono" aria-label={`Mapa: ${model.graph.label}`} data-tip="Cambiar de mapa" data-tip-side="right">
                {model.graphId === "react" ? "Re" : "Ra"}
              </button>
            )} />
        ) : (
          <Segmented label="Mapa de conocimiento" options={GRAPHS} value={model.graphId} onChange={actions.setGraph} className="segmented--block" />
        )}
      </div>
      <nav className="sidebar__nav" aria-label="Vistas">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.view;
          return (
            <button key={item.view} type="button" className={`side-item ${active ? "is-selected" : ""}`} aria-current={active ? "page" : undefined}
              onClick={() => actions.setView(item.view)} aria-label={collapsed ? (item.view === "progress" ? `Progreso · ${pctLabel}` : item.label) : undefined}
              data-tip={collapsed ? (item.view === "progress" ? `Progreso · ${pctLabel}` : item.label) : undefined} data-tip-side="right">
              <Icon size={collapsed ? 20 : 16} strokeWidth={1.5} aria-hidden="true" />
              {!collapsed && <span className="side-item__label">{item.label}</span>}
              {!collapsed && item.view === "progress" && <span className="side-item__meta mono">{pctLabel}</span>}
            </button>
          );
        })}
      </nav>
      <SidebarFocus model={model} collapsed={collapsed} />
      <div className="sidebar__foot">
        {collapsed ? (
          <>
            <IconButton icon={Search} size="md" label={`Buscar (${MOD_KEY}+K)`} data-tip-side="right" onClick={() => actions.openOverlay("palette")} />
            <IconButton icon={Settings2} size="md" label="Conexiones de IA" data-tip-side="right" onClick={() => actions.openOverlay("settings")} />
          </>
        ) : (
          <>
            <button type="button" className="btn btn--secondary btn--md sidebar__search" onClick={() => actions.openOverlay("palette")}>
              <Search size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="btn__label">Buscar…</span>
              <Kbd>{MOD_KEY} K</Kbd>
            </button>
            <button type="button" className="side-item" onClick={() => actions.openOverlay("settings")}>
              <Settings2 size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="side-item__label">Conexiones de IA</span>
              <span className="side-item__meta clamp-1">{providerLabel}</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
