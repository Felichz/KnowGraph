// Preferencias de UI persistidas (spec 002 §4.7).
const KEY = "learning-workspace:ui-prefs:v3";
const DEFAULTS = { mapMode: "list", ttsSpeed: 1, sidebarCollapsed: false };

export function loadPrefs() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePrefs(prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ mapMode: prefs.mapMode, ttsSpeed: prefs.ttsSpeed, sidebarCollapsed: prefs.sidebarCollapsed }));
  } catch { /* almacenamiento no disponible: se ignora */ }
}
