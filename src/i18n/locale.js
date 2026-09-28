// Locale store (framework-free). English is the default on first visit, regardless of the
// browser language; the choice is remembered in localStorage and mirrored on <html lang>.
export const LOCALES = Object.freeze(["en", "es"]);
export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "learning-workspace:locale";

// BCP 47 tags for Intl formatting and the Web Speech API.
export const INTL_LOCALE = Object.freeze({ en: "en-US", es: "es-AR" });
export const SPEECH_LANG = Object.freeze({ en: "en-US", es: "es-AR" });

const listeners = new Set();
let current = null;

export function isLocale(value) {
  return LOCALES.includes(value);
}

function readStored() {
  try {
    const value = globalThis.localStorage?.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function getLocale() {
  if (!current) current = readStored() ?? DEFAULT_LOCALE;
  return current;
}

export function applyDocumentLocale(locale = getLocale()) {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}

function commit(next) {
  current = next;
  applyDocumentLocale(next);
  listeners.forEach((fn) => fn(next));
}

export function setLocale(next) {
  if (!isLocale(next) || next === getLocale()) return getLocale();
  try { globalThis.localStorage?.setItem(LOCALE_STORAGE_KEY, next); } catch { /* storage unavailable: keep in memory */ }
  commit(next);
  return next;
}

export function subscribeLocale(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Keep tabs in sync: another tab changing the language updates this one.
if (typeof window !== "undefined") {
  window.addEventListener?.("storage", (event) => {
    if (event.key === LOCALE_STORAGE_KEY && isLocale(event.newValue) && event.newValue !== getLocale()) commit(event.newValue);
  });
}
