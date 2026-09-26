import { useEffect, useMemo, useSyncExternalStore } from "react";
import { getProgress, refreshProgress, subscribeProgress } from "./progressStore.js";

const NONE = { attempts: [], representative: null, scoreView: null, displayScore: null, isComplete: false, status: null, hasDraft: false, isAiGenerated: false, draft: null };

export function useProgress(graph) {
  const graphId = graph.id;
  const data = useSyncExternalStore(subscribeProgress, () => getProgress(graphId), () => getProgress(graphId));
  useEffect(() => { refreshProgress(graphId); }, [graphId]);
  return useMemo(() => {
    const checked = new Set(Object.entries(data.nodes).filter(([, p]) => p.isComplete).map(([id]) => id));
    const of = (nodeId) => data.nodes[nodeId] ?? NONE;
    const byCat = {};
    graph.nodes.forEach((node) => {
      byCat[node.cat] ??= { done: 0, total: 0 };
      byCat[node.cat].total += 1;
      if (checked.has(node.id)) byCat[node.cat].done += 1;
    });
    return {
      status: data.status, error: data.error, checked, of, byCat,
      done: graph.nodes.filter((node) => checked.has(node.id)).length,
      total: graph.nodes.length,
      refresh: () => refreshProgress(graphId),
    };
  }, [data, graph, graphId]);
}
