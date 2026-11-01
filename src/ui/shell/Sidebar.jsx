import { ChevronsUpDown, Layers, Map, PanelLeftClose, PanelLeftOpen, Search, Settings2 } from "lucide-react";
import { listGraphs } from "../../logic/graphRegistry.js";
import { BrandGlyph } from "../primitives/BrandGlyph.jsx";
import { Menu } from "../primitives/Menu.jsx";
import { IconButton } from "../primitives/Button.jsx";
import { Kbd, MOD_KEY } from "../primitives/Pill.jsx";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { useDueCount } from "../state/reviewStore.js";
import { useT } from "../../i18n/react.js";

const NAV = [
  { view: "map", labelKey: "shell.nav.map", icon: Map },
  { view: "flashcards", labelKey: "shell.nav.flashcards", icon: Layers },
];

// Selector de temario compacto: una decisión que se toma pocas veces no merece un control grande.
export function CurriculumMenu({ model, compact = false }) {
  const t = useT();
  const items = listGraphs(model.locale).map((g) => ({ value: g.id, label: g.label }));
  return (
    <Menu label={t("shell.sidebar.chooseMap")} value={model.graphId} onSelect={actions.setGraph} align="start" items={items}
      trigger={(props) => (
        <button type="button" {...props} className={`curriculum ${compact ? "is-compact" : ""}`} aria-label={t("shell.sidebar.mapTrigger", { label: model.graph.label })}
          data-tip={compact ? model.graph.label : undefined} data-tip-side="right">
          <span className="curriculum__name clamp-1">{compact ? (model.graphId === "react" ? "Re" : "Ra") : model.graph.label}</span>
          {!compact && <ChevronsUpDown size={14} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      )} />
  );
}

// Barra lateral (specs/007): marca, temario, dos destinos (Estudiar / Repasar) y al pie buscar y ajustes.
export function Sidebar({ model, collapsed, canExpand }) {
  const view = useWorkspace((s) => s.view);
  const t = useT();
  const due = useDueCount(model);
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`} aria-label={t("shell.nav.label")}>
      <div className="sidebar__head">
        {collapsed && canExpand ? (
          <IconButton icon={PanelLeftOpen} size="md" label={t("shell.sidebar.expand")} data-tip-side="right" onClick={() => actions.setPref("sidebarCollapsed", false)} />
        ) : <BrandGlyph size={collapsed ? 24 : 20} />}
        {!collapsed && <span className="sidebar__brand">{t("common.appName")}</span>}
        {!collapsed && canExpand && (
          <IconButton icon={PanelLeftClose} label={t("shell.sidebar.collapse")} onClick={() => actions.setPref("sidebarCollapsed", true)} className="sidebar__collapse" />
        )}
      </div>
      <div className="sidebar__graph"><CurriculumMenu model={model} compact={collapsed} /></div>
      <nav className="sidebar__nav" aria-label={t("shell.nav.views")}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.view;
          const label = t(item.labelKey);
          const meta = item.view === "flashcards" && due > 0 ? due : null;
          const tip = meta ? `${label} · ${t("shell.nav.reviewDue", { n: due })}` : label;
          return (
            <button key={item.view} type="button" className={`side-item ${active ? "is-selected" : ""}`} aria-current={active ? "page" : undefined}
              onClick={() => actions.setView(item.view)} aria-label={collapsed || meta ? tip : undefined}
              data-tip={collapsed ? tip : undefined} data-tip-side="right">
              <Icon size={collapsed ? 20 : 16} strokeWidth={1.5} aria-hidden="true" />
              {!collapsed && <span className="side-item__label">{label}</span>}
              {meta && <span className={`side-item__badge mono ${collapsed ? "is-dot" : ""}`} aria-hidden="true">{collapsed ? "" : meta}</span>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar__foot">
        {collapsed ? (
          <>
            <IconButton icon={Search} size="md" label={t("shell.sidebar.searchWithKey", { key: MOD_KEY })} data-tip-side="right" onClick={() => actions.openOverlay("palette")} />
            <IconButton icon={Settings2} size="md" label={t("shell.nav.settings")} data-tip-side="right" onClick={() => actions.openOverlay("settings")} />
          </>
        ) : (
          <>
            <button type="button" className="side-item" onClick={() => actions.openOverlay("palette")}>
              <Search size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="side-item__label">{t("shell.sidebar.searchButton")}</span>
              <Kbd>{MOD_KEY} K</Kbd>
            </button>
            <button type="button" className="side-item" onClick={() => actions.openOverlay("settings")}>
              <Settings2 size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="side-item__label">{t("shell.nav.settings")}</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
