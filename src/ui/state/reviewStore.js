import { useCallback, useSyncExternalStore } from "react";
import { dayKey, schedule } from "../../logic/spacedRepetition.js";

// Programación de repasos por mapa en localStorage (specs/006). Fuera de IndexedDB para no tocar
// el esquema ni el formato de respaldo; si el almacenamiento falla, el repaso sigue en memoria.
const keyOf = (graphId) => `learning-workspace:review:v1:${graphId}`;
const cache = new Map();
const listeners = new Set();

function read(graphId) {
  if (!cache.has(graphId)) {
    let entries = {};
    try { entries = JSON.parse(localStorage.getItem(keyOf(graphId)) ?? "{}") || {}; } catch { entries = {}; }
    cache.set(graphId, entries);
  }
  return cache.get(graphId);
}

export function rateCard(graphId, nodeId, rating, today = dayKey()) {
  const next = { ...read(graphId), [nodeId]: schedule(read(graphId)[nodeId], rating, today) };
  cache.set(graphId, next);
  try { localStorage.setItem(keyOf(graphId), JSON.stringify(next)); } catch { /* sin almacenamiento: solo esta sesión */ }
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function useReviews(graphId) {
  const entries = useSyncExternalStore(subscribe, () => read(graphId), () => read(graphId));
  const rate = useCallback((nodeId, rating) => rateCard(graphId, nodeId, rating), [graphId]);
  return { entries, rate, today: dayKey() };
}
