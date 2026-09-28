import REACT_GRAPH from "../reactGraph.js";
import { RAILS_GRAPH } from "./railsGraph.js";
import { CONTENT_OVERLAYS } from "../i18n/content/index.js";
import { localizeGraph } from "../i18n/content/localizeGraph.js";
import { DEFAULT_LOCALE, LOCALES } from "../i18n/locale.js";
import { hashCardContent } from "../ai/contentHash.js";

// Spanish is the authored base; other locales overlay only text (see src/i18n/content).
const BASE_GRAPHS = { react: REACT_GRAPH, rails: RAILS_GRAPH };

function normalizeGraph(graph, contentHashes, locale) {
  const nodes = graph.nodes.map((node, index) => ({
    ...node,
    priority: node.priority ?? index + 1,
    prerequisites: node.prerequisites ?? [],
    // Attempts are tied to the authored (Spanish) card, so switching language never marks
    // an existing evaluation as made against an older version of the card.
    contentHash: contentHashes.get(node.id),
  }));
  return {
    ...graph,
    locale,
    nodes,
    nodeIds: new Set(nodes.map((node) => node.id)),
    nodeById: new Map(nodes.map((node) => [node.id, node])),
    edges: graph.edges ?? [],
  };
}

function buildRegistry(locale) {
  return Object.freeze(Object.fromEntries(Object.entries(BASE_GRAPHS).map(([id, base]) => {
    const hashes = new Map(base.nodes.map((node) => [node.id, hashCardContent(node)]));
    const localized = locale === "es" ? base : localizeGraph(base, CONTENT_OVERLAYS[locale]?.[id]);
    return [id, normalizeGraph(localized, hashes, locale)];
  })));
}

const REGISTRIES = Object.freeze(Object.fromEntries(LOCALES.map((locale) => [locale, buildRegistry(locale)])));

// Registry for the default locale. Graph ids, node ids and edges are identical in every locale.
export const GRAPH_REGISTRY = REGISTRIES[DEFAULT_LOCALE];

export function getGraph(graphId = "react", locale = DEFAULT_LOCALE) {
  const graph = (REGISTRIES[locale] ?? GRAPH_REGISTRY)[graphId];
  if (!graph) throw new Error(`Unknown graph: ${graphId}`);
  return graph;
}

export function listGraphs(locale = DEFAULT_LOCALE) {
  return Object.values(REGISTRIES[locale] ?? GRAPH_REGISTRY).map(({ nodeById, nodeIds, ...publicGraph }) => publicGraph);
}
