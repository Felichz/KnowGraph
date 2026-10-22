// Theme store (framework-free, same shape as i18n/locale.js). The default follows the system
// (prefers-color-scheme); an explicit choice is saved under THEME_STORAGE_KEY as "light" | "dark".
// index.html applies the same rule before first paint, so this module only keeps it in sync.
export const THEMES = Object.freeze(["light", "dark"]);
export const THEME_STORAGE_KEY = "knowgraph:theme";
// Mirrors --bg-app of each theme (tokens.css / light.css) for <meta name="theme-color">.
export const THEME_COLOR = Object.freeze({ light: "#F6F7F9", dark: "#0E1117" });

const listeners = new Set();
const isTheme = (value) => THEMES.includes(value);
const media = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

function readStored() {
  try {
    const value = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

const systemTheme = () => (media?.matches ? "light" : "dark");
let snapshot = null;

function compute() {
  const preference = readStored();
  return { preference: preference ?? "system", theme: preference ?? systemTheme() };
}

// { theme: "light" | "dark", preference: "light" | "dark" | "system" }. Stable between changes.
export function getThemeState() {
  if (!snapshot) snapshot = compute();
  return snapshot;
}
export const getTheme = () => getThemeState().theme;

export function applyDocumentTheme(theme = getTheme()) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

function refresh() {
  const next = compute();
  const prev = getThemeState();
  snapshot = next;
  applyDocumentTheme(next.theme);
  if (prev.theme !== next.theme || prev.preference !== next.preference) listeners.forEach((fn) => fn(next));
}

// "light" | "dark" saves the choice; "system" (or null) forgets it and follows the OS again.
export function setThemePreference(next) {
  try {
    if (isTheme(next)) globalThis.localStorage?.setItem(THEME_STORAGE_KEY, next);
    else globalThis.localStorage?.removeItem(THEME_STORAGE_KEY);
  } catch { /* storage unavailable: the choice lasts for this page only */ }
  if (isTheme(next)) {
    const prev = getThemeState();
    snapshot = { preference: next, theme: next };
    applyDocumentTheme(next);
    if (prev.theme !== next || prev.preference !== next) listeners.forEach((fn) => fn(snapshot));
  } else refresh();
}

export const toggleTheme = () => setThemePreference(getTheme() === "dark" ? "light" : "dark");

export function subscribeTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Follow the OS while there is no explicit choice, and keep other tabs in sync.
media?.addEventListener?.("change", () => { if (getThemeState().preference === "system") refresh(); });
if (typeof window !== "undefined") {
  window.addEventListener?.("storage", (event) => { if (event.key === THEME_STORAGE_KEY || event.key === null) refresh(); });
}
