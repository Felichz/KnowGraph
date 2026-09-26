import { useMemo } from "react";
import { createTopologicalLayout } from "../../logic/topologicalLayout.js";

// Etapa (rank topológico) de cada nodo: "Etapa n de m".
export function useStageOf(graph) {
  const layout = useMemo(() => createTopologicalLayout(graph), [graph]);
  return (nodeId) => {
    const position = layout.positions.get(nodeId);
    return { rank: (position?.rank ?? 0) + 1, total: layout.maxRank + 1 };
  };
}
