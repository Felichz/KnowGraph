import { useRef } from "react";
import { Sidebar } from "./Sidebar.jsx";
import { MobileDock } from "./MobileDock.jsx";
import { MobileTopBar, TopBar } from "./TopBar.jsx";
import { useIsDesktop, useIsMobile } from "../hooks/useMediaQuery.js";
import { useWorkspace } from "../state/useWorkspace.js";
import { MapView } from "../map/MapView.jsx";
import { FlashcardsView } from "../flashcards/FlashcardsView.jsx";

// Shell (specs/007): sidebar + canvas / barra móvil + dock. Dos vistas: Estudiar (mapa) y Repasar (flashcards).
export function AppShell({ model, inert }) {
  const view = useWorkspace((s) => s.view);
  const collapsedPref = useWorkspace((s) => s.prefs.sidebarCollapsed);
  const mapMode = useWorkspace((s) => s.prefs.mapMode);
  const mobile = useIsMobile();
  const desktop = useIsDesktop();
  const scrollRef = useRef(null);
  const collapsed = !desktop || collapsedPref;
  const isGraph = view === "map" && mapMode === "graph";
  return (
    <div className={`app ${mobile ? "is-mobile" : collapsed ? "is-collapsed" : ""}`} inert={inert || undefined} aria-hidden={inert || undefined}>
      {!mobile && <Sidebar model={model} collapsed={collapsed} canExpand={desktop} />}
      <main id="main" ref={scrollRef} tabIndex={-1} className={`canvas view-scroll ${isGraph ? "is-graph" : ""}`}>
        {mobile ? <MobileTopBar model={model} /> : <TopBar model={model} scrollRef={scrollRef} />}
        <div className="view-content">
          {view === "map" && <MapView model={model} mode={mapMode} scrollRef={scrollRef} />}
          {view === "flashcards" && <FlashcardsView model={model} />}
        </div>
      </main>
      {mobile && <MobileDock model={model} />}
    </div>
  );
}
