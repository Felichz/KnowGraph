import { useEffect, useState } from "react";
import { Filter, LayoutList, List, Network, Workflow } from "lucide-react";
import { Segmented } from "../primitives/Segmented.jsx";
import { BrandGlyph } from "../primitives/BrandGlyph.jsx";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { useT } from "../../i18n/react.js";
import { LanguageSwitch } from "./LanguageSwitch.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

const TITLES = { map: null, flashcards: "shell.nav.flashcards", progress: "shell.nav.progress" };
const MODES = [{ value: "list", labelKey: "shell.topbar.list", icon: LayoutList }, { value: "graph", labelKey: "shell.topbar.graph", icon: Workflow }];

function useScrolled(scrollRef) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);
  return scrolled;
}

// Barra superior del canvas (B.4): título + controles pegados al título, sin space-between.
export function TopBar({ model, scrollRef }) {
  const view = useWorkspace((s) => s.view);
  const mapMode = useWorkspace((s) => s.prefs.mapMode);
  const scrolled = useScrolled(scrollRef);
  const t = useT();
  const focusLabel = model.focusCat ? model.graph.categories[model.focusCat].label : t("shell.topbar.allFocus");
  const modes = MODES.map(({ labelKey, ...mode }) => ({ ...mode, label: t(labelKey) }));
  return (
    <header className={`topbar ${scrolled ? "is-scrolled" : ""}`}>
      <h1 className="topbar__title" tabIndex={-1} data-view-title>
        {TITLES[view] ? t(TITLES[view]) : model.graph.label}
        <span className="topbar__sub"> · {view === "map" ? focusLabel : model.graph.label}</span>
      </h1>
      {view === "map" && (
        <Segmented label={t("shell.topbar.mapMode")} options={modes} value={mapMode} onChange={(value) => actions.setPref("mapMode", value)} />
      )}
      <div className="topbar__prefs">
        <LanguageSwitch className="topbar__lang" />
        <ThemeToggle className="topbar__theme" />
      </div>
    </header>
  );
}

const GRAPH_OPTIONS = [{ value: "react", label: "React" }, { value: "rails", label: "Rails" }];

// Barra móvil (D.1): glifo · selector de grafo · Foco · Lista/Grafo.
export function MobileTopBar({ model, onOpenFocus, narrow }) {
  const view = useWorkspace((s) => s.view);
  const mapMode = useWorkspace((s) => s.prefs.mapMode);
  const t = useT();
  const focusName = model.focusCat ? model.graph.categories[model.focusCat].label : null;
  return (
    <header className="mtopbar">
      <BrandGlyph size={24} />
      <h1 className="sr-only" tabIndex={-1} data-view-title>{model.graph.label}</h1>
      <Segmented label={t("shell.sidebar.knowledgeMap")} options={GRAPH_OPTIONS} value={model.graphId} onChange={actions.setGraph} size="md" />
      {view !== "progress" && (
        <button type="button" className={`mtopbar__focus ${focusName ? "is-selected" : ""}`} onClick={onOpenFocus}
          aria-label={focusName ? t("shell.topbar.focusLabel", { name: focusName }) : t("shell.topbar.focusAll")}>
          <Filter size={16} strokeWidth={1.5} aria-hidden="true" />
          {focusName && !narrow ? <span className="clamp-1">{focusName}</span> : null}
        </button>
      )}
      {view === "map" && (
        <button type="button" className="icon-btn icon-btn--md" aria-pressed={mapMode === "graph"}
          aria-label={mapMode === "graph" ? t("shell.topbar.viewAsList") : t("shell.topbar.viewAsGraph")} onClick={() => actions.setPref("mapMode", mapMode === "graph" ? "list" : "graph")}>
          {mapMode === "graph" ? <List size={20} strokeWidth={1.5} aria-hidden="true" /> : <Network size={20} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      )}
      {!narrow && <LanguageSwitch compact />}
    </header>
  );
}
