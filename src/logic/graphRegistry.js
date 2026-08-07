import REACT_GRAPH from "../reactGraph.js";
import { RAILS_GRAPH } from "./railsGraph.js";

function normalizeGraph(graph) {
  const nodes = graph.nodes.map((node, index) => ({
    ...node,
    priority: node.priority ?? index + 1,
    prerequisites: node.prerequisites ?? [],
  }));
  return {
    ...graph,
    nodes,
    nodeIds: new Set(nodes.map((node) => node.id)),
    nodeById: new Map(nodes.map((node) => [node.id, node])),
    edges: graph.edges ?? [],
  };
}

export const GRAPH_REGISTRY = Object.freeze({
  react: normalizeGraph(REACT_GRAPH),
  rails: normalizeGraph(RAILS_GRAPH),
});

export function getGraph(graphId = "react") {
  const graph = GRAPH_REGISTRY[graphId];
  if (!graph) throw new Error(`Unknown graph: ${graphId}`);
  return graph;
}

export function listGraphs() {
  return Object.values(GRAPH_REGISTRY).map(({ nodeById, nodeIds, ...publicGraph }) => publicGraph);
}
