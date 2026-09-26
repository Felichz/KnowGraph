import { loadPrefs, savePrefs } from "./prefs.js";
import { buildPath, historyState, parseLocation, pushRoute, replaceRoute } from "./routing.js";

// Store único de la UI (useSyncExternalStore). Datos de dominio: logic/ y ai/.
const listeners = new Set();
let state = null;

function init() {
  const route = typeof window !== "undefined" ? parseLocation() : { graphId: "react", nodeId: null, view: "map" };
  const prefs = loadPrefs();
  const prev = typeof window !== "undefined" ? historyState() : null;
  state = {
    graphId: route.graphId, view: route.view, focusCat: null, prefs,
    study: route.nodeId ? { nodeId: route.nodeId, stage: "read", history: prev?.previousNodeIds ?? [], zen: false, attemptId: null } : null,
    overlay: null, lastOpenedNodeId: null,
  };
  if (typeof window !== "undefined" && !route.valid) replaceRoute(route, state.study?.history ?? []);
}

export function getState() { if (!state) init(); return state; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function set(patch) {
  state = { ...getState(), ...patch };
  listeners.forEach((fn) => fn());
}

export const actions = {
  setGraph(graphId) {
    if (graphId === getState().graphId) return;
    set({ graphId, focusCat: null, study: null, overlay: null });
    pushRoute({ graphId, view: getState().view });
  },
  setView(view) {
    set({ view, overlay: null });
    pushRoute({ graphId: getState().graphId, view });
  },
  setFocus(focusCat) { set({ focusCat }); },
  setPref(key, value) {
    const prefs = { ...getState().prefs, [key]: value };
    savePrefs(prefs);
    set({ prefs });
  },
  // Abre una card. remember: agrega la actual a la pila "Volver a". stage/attemptId: etapa de origen.
  openCard(nodeId, { remember = false, stage = "read", attemptId = null } = {}) {
    const { study, graphId, view } = getState();
    const depth = historyState()?.depth ?? 0;
    const history = study && remember ? [...study.history, study.nodeId] : [];
    set({ study: { nodeId, stage, history, zen: study?.zen ?? false, attemptId }, overlay: null, lastOpenedNodeId: nodeId });
    if (!study) pushRoute({ graphId, nodeId, view }, [], 1);
    else if (remember) pushRoute({ graphId, nodeId, view }, history, depth + 1);
    else replaceRoute({ graphId, nodeId, view }, [], depth);
  },
  closeCard() {
    const { study, graphId, view } = getState();
    if (!study) return;
    const depth = historyState()?.depth ?? 0;
    set({ study: null, lastOpenedNodeId: study.nodeId });
    if (depth > 0) window.history.go(-depth);
    else replaceRoute({ graphId, view });
  },
  back() {
    const { study } = getState();
    if (study?.history.length) window.history.back();
  },
  setStage(stage, extra = {}) {
    const { study } = getState();
    if (study) set({ study: { ...study, stage, ...extra } });
  },
  setZen(zen) { const { study } = getState(); if (study) set({ study: { ...study, zen } }); },
  selectAttempt(attemptId) { const { study } = getState(); if (study) set({ study: { ...study, attemptId } }); },
  openOverlay(name, payload = null) { set({ overlay: { name, payload } }); },
  closeOverlay() { set({ overlay: null }); },
  applyLocation() {
    const route = parseLocation();
    const hs = historyState();
    const current = getState();
    const graphChanged = route.graphId !== current.graphId;
    set({
      graphId: route.graphId, view: route.view, overlay: null,
      focusCat: graphChanged ? null : current.focusCat,
      study: route.nodeId ? { nodeId: route.nodeId, stage: "read", history: hs?.previousNodeIds ?? [], zen: current.study?.zen ?? false, attemptId: null } : null,
      lastOpenedNodeId: current.study?.nodeId ?? current.lastOpenedNodeId,
    });
  },
  path() { const s = getState(); return buildPath({ graphId: s.graphId, nodeId: s.study?.nodeId, view: s.view }); },
};
