const SESSION_KEY = "learning-workspace:provider-profile:v1";

export const EMPTY_PROVIDER_PROFILE = Object.freeze({
  id: "",
  label: "",
  adapter: "openai",
  baseUrl: "",
  apiKey: "",
  model: "",
});

export const MINIMAX_PRESET = Object.freeze({
  adapter: "minimax",
  baseUrl: "https://api.minimax.io/v1",
  model: "MiniMax-M3",
});

export function normalizeProviderProfile(value) {
  if (!value || typeof value !== "object") return null;
  const profile = {
    id: String(value.id ?? "provider_default").trim().slice(0, 80) || "provider_default",
    label: String(value.label ?? "Provider personal").trim().slice(0, 80) || "Provider personal",
    adapter: value.adapter === "minimax" ? "minimax" : "openai",
    baseUrl: String(value.baseUrl ?? "").trim().replace(/\/+$/, ""),
    apiKey: String(value.apiKey ?? "").trim(),
    model: String(value.model ?? "").trim().slice(0, 200),
  };
  return profile.baseUrl && profile.apiKey && profile.model ? profile : null;
}

export async function loadProviderProfile() {
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.load) return normalizeProviderProfile(await desktop.load());
  try {
    return normalizeProviderProfile(JSON.parse(window.sessionStorage.getItem(SESSION_KEY) ?? "null"));
  } catch {
    return null;
  }
}

export async function saveProviderProfile(value) {
  const profile = normalizeProviderProfile(value);
  if (!profile) throw new Error("Completa endpoint, API key y modelo.");
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.save) {
    await desktop.save(profile);
  } else {
    // A browser profile lives only for this tab session. localStorage and
    // IndexedDB would make an API key look safer than it actually is.
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  }
  return profile;
}

export async function clearProviderProfile() {
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.clear) await desktop.clear();
  else window.sessionStorage.removeItem(SESSION_KEY);
}

export function providerStorageDescription() {
  return window.learningDesktop?.providerSettings
    ? "La clave se guarda cifrada en este dispositivo."
    : "La clave se conserva solo mientras esta pestana permanezca abierta.";
}
