import { useMemo } from "react";
import { getGraph } from "../../logic/graphRegistry.js";
import { getGuidance } from "../../logic/guidance.js";
import { useProgress } from "./useProgress.js";
import { useWorkspace } from "./useWorkspace.js";

// Modelo derivado del grafo activo: foco, progreso y ruta sugerida (compartido por todas las vistas).
export function useGraphModel() {
  const graphId = useWorkspace((s) => s.graphId);
  const focusCat = useWorkspace((s) => s.focusCat);
  const graph = getGraph(graphId);
  const progress = useProgress(graph);
  const model = useMemo(() => {
    const catIds = Object.keys(graph.categories);
    const activeCats = new Set(focusCat ? [focusCat] : catIds);
    const guidance = getGuidance(graph.nodes, progress.checked, activeCats);
    const visible = graph.nodes.filter((node) => activeCats.has(node.cat));
    return { catIds, activeCats, guidance, visible };
  }, [graph, focusCat, progress.checked]);
  return { graph, graphId, focusCat, progress, ...model };
}
