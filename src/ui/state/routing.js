import { GRAPH_REGISTRY } from "../../logic/graphRegistry.js";

// Rutas: /:graph, /:graph/card/:nodeId, ?view=flashcards|progress (design-spec D.2).
export const APP_STATE = "learning-workspace-v3";
const VIEWS = new Set(["map", "flashcards", "progress"]);
// The app can be served under a subpath (vite --base): routes live after it. (Written so Vite
// replaces it at build time; plain Node, in the logic tests, has no import.meta.env.)
const BASE = (() => {
  try {
    return import.meta.env.BASE_URL.replace(/\/$/, "");
  } catch {
    return "";
  }
})();

export function parseLocation(loc = window.location) {
  const path = BASE && loc.pathname.startsWith(BASE) ? loc.pathname.slice(BASE.length) : loc.pathname;
  const parts = path.split("/").filter(Boolean);
  const graphId = GRAPH_REGISTRY[parts[0]] ? parts[0] : "react";
  const graph = GRAPH_REGISTRY[graphId];
  const nodeId = parts[1] === "card" && graph.nodeIds.has(parts[2]) ? parts[2] : null;
  const viewParam = new URLSearchParams(loc.search).get("view");
  const view = VIEWS.has(viewParam) ? viewParam : "map";
  const canonical = buildPath({ graphId, nodeId, view });
  return { graphId, nodeId, view, canonical, valid: canonical === `${loc.pathname}${loc.search}` };
}

export function buildPath({ graphId, nodeId, view }) {
  const base = `${BASE}${nodeId ? `/${graphId}/card/${nodeId}` : `/${graphId}`}`;
  return view && view !== "map" ? `${base}?view=${view}` : base;
}

// depth = cantidad de entradas de card apiladas desde la vista (0 si se aterrizó directo en la card).
export function pushRoute(route, history = [], depth = 0) {
  window.history.pushState({ app: APP_STATE, previousNodeIds: history, depth }, "", buildPath(route));
}

export function replaceRoute(route, history = [], depth = 0) {
  window.history.replaceState({ app: APP_STATE, previousNodeIds: history, depth }, "", buildPath(route));
}

export function historyState() {
  const state = window.history.state;
  return state?.app === APP_STATE ? state : null;
}
