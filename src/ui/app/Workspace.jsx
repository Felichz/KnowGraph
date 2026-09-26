import { lazy, Suspense, useEffect } from "react";
import { AppShell } from "../shell/AppShell.jsx";
import { SkipLink, LiveAnnouncer } from "../primitives/Announcer.jsx";
import { Toaster } from "../primitives/Toaster.jsx";
import { TooltipLayer } from "../primitives/TooltipLayer.jsx";
import { actions, usePopstate, useWorkspace } from "../state/useWorkspace.js";
import { useGraphModel } from "../state/useGraphModel.js";
import { CommandPalette } from "../palette/CommandPalette.jsx";
import { TaskHud } from "../hud/TaskHud.jsx";

const StudySession = lazy(() => import("../study/StudySession.jsx"));
const SettingsDrawer = lazy(() => import("../settings/SettingsDrawer.jsx"));

// Raíz de la UI v3: shell, sesión de estudio (capa no modal), overlays y capas globales.
export function Workspace() {
  usePopstate();
  const model = useGraphModel();
  const study = useWorkspace((s) => s.study);
  const overlay = useWorkspace((s) => s.overlay);

  useEffect(() => {
    function onKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (overlay?.name === "palette") actions.closeOverlay(); else actions.openOverlay("palette");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay]);

  useEffect(() => { document.documentElement.dataset.study = study ? "open" : "closed"; }, [study]);

  return (
    <>
      <SkipLink target={study ? "study-stage" : "main"}>{study ? "Saltar al contenido de la etapa" : "Saltar al contenido"}</SkipLink>
      <AppShell model={model} inert={Boolean(study)} />
      {study && (
        <Suspense fallback={<div className="study study--loading" aria-busy="true" />}>
          <StudySession key={study.nodeId} model={model} study={study} />
        </Suspense>
      )}
      <TaskHud model={model} />
      <CommandPalette model={model} open={overlay?.name === "palette"} onClose={actions.closeOverlay} />
      {overlay?.name === "settings" && (
        <Suspense fallback={null}>
          <SettingsDrawer open onClose={actions.closeOverlay} initialView={overlay.payload?.view} />
        </Suspense>
      )}
      <Toaster />
      <TooltipLayer />
      <LiveAnnouncer />
    </>
  );
}
