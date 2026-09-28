import { lazy, Suspense } from "react";
import { RefreshCw } from "lucide-react";
import { useBackgroundTasks } from "../../ai/backgroundTaskManager.js";
import { useT } from "../../i18n/react.js";
import { Notice } from "../primitives/Feedback.jsx";
import { Button } from "../primitives/Button.jsx";
import { SuggestedRoute } from "./SuggestedRoute.jsx";
import { ConceptGroups } from "./ConceptGrid.jsx";

const GraphView = lazy(() => import("../graph/GraphView.jsx"));

// Vista Mapa: Lista (ruta + grupos) o Grafo (design-spec C.2).
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
  return (
    <div className="map">
      {model.progress.status === "error" && (
        <Notice tone="error" className="map__notice"
          action={<Button variant="ghost" size="sm" icon={RefreshCw} onClick={model.progress.refresh}>{t("common.actions.retry")}</Button>}>
          {t("map.loadError")}
        </Notice>
      )}
      <SuggestedRoute model={model} />
      <ConceptGroups model={model} activeTaskNodeIds={activeTaskNodeIds} />
    </div>
  );
}
