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
import { useT } from "../../i18n/react.js";
import { LanguageSwitch } from "./LanguageSwitch.jsx";

const NAV = [
  { view: "map", labelKey: "shell.nav.map", icon: Map },
  { view: "flashcards", labelKey: "shell.nav.flashcards", icon: Layers },
  { view: "progress", labelKey: "shell.nav.progress", icon: BarChart3 },
];
const graphOptions = (locale) => listGraphs(locale).map((graph) => ({ value: graph.id, label: graph.id === "react" ? "React" : "Rails", full: graph.label }));

// Sidebar persistente (design-spec D.1). `collapsed` = variante de 56px.
export function Sidebar({ model, collapsed, canExpand }) {
  const view = useWorkspace((s) => s.view);
  const providerLabel = useProviderLabel();
  const t = useT();
  const GRAPHS = graphOptions(model.locale);
  const pct = model.progress.total ? Math.round((model.progress.done / model.progress.total) * 100) : 0;
  const pctLabel = model.progress.status === "error" ? "—" : `${pct}%`;
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
      <div className="sidebar__graph">
        {collapsed ? (
          <Menu label={t("shell.sidebar.chooseMap")} value={model.graphId} onSelect={actions.setGraph} align="start"
            items={GRAPHS.map((g) => ({ value: g.value, label: g.full }))}
            trigger={(props) => (
              <button type="button" {...props} className="icon-btn icon-btn--md sidebar__mono mono" aria-label={t("shell.sidebar.mapTrigger", { label: model.graph.label })} data-tip={t("shell.sidebar.changeMap")} data-tip-side="right">
                {model.graphId === "react" ? "Re" : "Ra"}
              </button>
            )} />
        ) : (
          <Segmented label={t("shell.sidebar.knowledgeMap")} options={GRAPHS} value={model.graphId} onChange={actions.setGraph} className="segmented--block" />
        )}
      </div>
      <nav className="sidebar__nav" aria-label={t("shell.nav.views")}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.view;
          const label = t(item.labelKey);
          const tip = item.view === "progress" ? t("shell.nav.progressWithPct", { pct: pctLabel }) : label;
          return (
            <button key={item.view} type="button" className={`side-item ${active ? "is-selected" : ""}`} aria-current={active ? "page" : undefined}
              onClick={() => actions.setView(item.view)} aria-label={collapsed ? tip : undefined}
              data-tip={collapsed ? tip : undefined} data-tip-side="right">
              <Icon size={collapsed ? 20 : 16} strokeWidth={1.5} aria-hidden="true" />
              {!collapsed && <span className="side-item__label">{label}</span>}
              {!collapsed && item.view === "progress" && <span className="side-item__meta mono">{pctLabel}</span>}
            </button>
          );
        })}
      </nav>
      <SidebarFocus model={model} collapsed={collapsed} />
      <div className="sidebar__foot">
        {collapsed ? (
          <>
            <IconButton icon={Search} size="md" label={t("shell.sidebar.searchWithKey", { key: MOD_KEY })} data-tip-side="right" onClick={() => actions.openOverlay("palette")} />
            <IconButton icon={Settings2} size="md" label={t("shell.sidebar.aiConnections")} data-tip-side="right" onClick={() => actions.openOverlay("settings")} />
            <LanguageSwitch compact />
          </>
        ) : (
          <>
            <button type="button" className="btn btn--secondary btn--md sidebar__search" onClick={() => actions.openOverlay("palette")}>
              <Search size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="btn__label">{t("shell.sidebar.searchButton")}</span>
              <Kbd>{MOD_KEY} K</Kbd>
            </button>
            <button type="button" className="side-item" onClick={() => actions.openOverlay("settings")}>
              <Settings2 size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="side-item__label">{t("shell.sidebar.aiConnections")}</span>
              <span className="side-item__meta clamp-1">{providerLabel}</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
