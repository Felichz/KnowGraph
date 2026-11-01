import { lazy, Suspense } from "react";
import { RefreshCw } from "lucide-react";
import { useBackgroundTasks } from "../../ai/backgroundTaskManager.js";
import { useT } from "../../i18n/react.js";
import { Notice } from "../primitives/Feedback.jsx";
import { Button } from "../primitives/Button.jsx";
import { SuggestedRoute } from "./SuggestedRoute.jsx";
import { HeatGrid } from "./HeatGrid.jsx";
import { ConceptGroups } from "./ConceptGrid.jsx";
import { Levels } from "./Levels.jsx";

const GraphView = lazy(() => import("../graph/GraphView.jsx"));

// Estudiar (specs/007): siguiente paso → tu temario (rejilla) → cards del área elegida → niveles e hitos.
// Con cero actividad solo se ve el siguiente paso: lo demás aparece cuando ya significa algo.
export function MapView({ model, mode }) {
  const { activeTaskNodeIds } = useBackgroundTasks(model.graphId);
  const t = useT();
  if (mode === "graph") {
    return (
      <Suspense fallback={<div className="graph-view" aria-busy="true" />}>
        <GraphView model={model} activeTaskNodeIds={activeTaskNodeIds} />
      </Suspense>
    );
  }
  const { visible, progress } = model;
  const active = progress.done > 0 || visible.some((n) => { const p = progress.of(n.id); return p.attempts?.length || p.hasDraft; });
  return (
    <div className="map">
      {progress.status === "error" && (
        <Notice tone="error" className="map__notice"
          action={<Button variant="ghost" size="sm" icon={RefreshCw} onClick={progress.refresh}>{t("common.actions.retry")}</Button>}>
          {t("map.loadError")}
        </Notice>
      )}
      <SuggestedRoute model={model} />
      {(active || model.focusCat) && <HeatGrid model={model} />}
      {model.focusCat && <ConceptGroups model={model} activeTaskNodeIds={activeTaskNodeIds} />}
      {active && !model.focusCat && <p className="map__hint">{t("map.heat.pickArea")}</p>}
      {active && <Levels model={model} />}
    </div>
  );
}
