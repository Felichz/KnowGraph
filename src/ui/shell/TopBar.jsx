import { useEffect, useState } from "react";
import { Filter, LayoutList, List, Network, Workflow } from "lucide-react";
import { Segmented } from "../primitives/Segmented.jsx";
import { BrandGlyph } from "../primitives/BrandGlyph.jsx";
import { actions, useWorkspace } from "../state/useWorkspace.js";

const TITLES = { map: null, flashcards: "Flashcards", progress: "Progreso" };
const MODES = [{ value: "list", label: "Lista", icon: LayoutList }, { value: "graph", label: "Grafo", icon: Workflow }];

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
  const focusLabel = model.focusCat ? model.graph.categories[model.focusCat].label : "Todos los focos";
  return (
    <header className={`topbar ${scrolled ? "is-scrolled" : ""}`}>
      <h1 className="topbar__title" tabIndex={-1} data-view-title>
        {TITLES[view] ?? model.graph.label}
        <span className="topbar__sub"> · {view === "map" ? focusLabel : model.graph.label}</span>
      </h1>
      {view === "map" && (
        <Segmented label="Modo del mapa" options={MODES} value={mapMode} onChange={(value) => actions.setPref("mapMode", value)} />
      )}
    </header>
  );
}

const GRAPH_OPTIONS = [{ value: "react", label: "React" }, { value: "rails", label: "Rails" }];

// Barra móvil (D.1): glifo · selector de grafo · Foco · Lista/Grafo.
export function MobileTopBar({ model, onOpenFocus, narrow }) {
  const view = useWorkspace((s) => s.view);
  const mapMode = useWorkspace((s) => s.prefs.mapMode);
  const focusName = model.focusCat ? model.graph.categories[model.focusCat].label : null;
  return (
    <header className="mtopbar">
      <BrandGlyph size={24} />
      <h1 className="sr-only" tabIndex={-1} data-view-title>{model.graph.label}</h1>
      <Segmented label="Mapa de conocimiento" options={GRAPH_OPTIONS} value={model.graphId} onChange={actions.setGraph} size="md" />
      {view !== "progress" && (
        <button type="button" className={`mtopbar__focus ${focusName ? "is-selected" : ""}`} onClick={onOpenFocus}
          aria-label={focusName ? `Foco: ${focusName}` : "Foco: todos"}>
          <Filter size={16} strokeWidth={1.5} aria-hidden="true" />
          {focusName && !narrow ? <span className="clamp-1">{focusName}</span> : null}
        </button>
      )}
      {view === "map" && (
        <button type="button" className="icon-btn icon-btn--md" aria-pressed={mapMode === "graph"}
          aria-label={mapMode === "graph" ? "Ver como lista" : "Ver como grafo"} onClick={() => actions.setPref("mapMode", mapMode === "graph" ? "list" : "graph")}>
          {mapMode === "graph" ? <List size={20} strokeWidth={1.5} aria-hidden="true" /> : <Network size={20} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      )}
    </header>
  );
}
