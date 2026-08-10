const SESSION_KEY = "learning-workspace:provider-profiles:v2";
const LEGACY_SESSION_KEY = "learning-workspace:provider-profile:v1";

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

export function normalizeProviderDraft(value) {
  const source = value && typeof value === "object" ? value : EMPTY_PROVIDER_PROFILE;
  return {
    id: String(source.id ?? "provider_default").trim().slice(0, 80),
    label: String(source.label ?? "").trim().slice(0, 80),
    adapter: source.adapter === "minimax" ? "minimax" : "openai",
    baseUrl: String(source.baseUrl ?? "").trim().replace(/\/+$/, "").slice(0, 500),
    apiKey: String(source.apiKey ?? "").trim().slice(0, 4096),
    model: String(source.model ?? "").trim().slice(0, 200),
  };
}

export function normalizeProviderProfile(value, { requireModel = true } = {}) {
  const profile = normalizeProviderDraft(value);
  return profile.baseUrl && profile.apiKey && (!requireModel || profile.model) ? profile : null;
}

export async function loadProviderDrafts() {
  const stored = await readStoredState();
  return stored;
}

export async function loadProviderProfile() {
  const stored = await readStoredState();
  return normalizeProviderProfile(stored.profiles[stored.activeAdapter]);
}

export async function saveProviderDraft(value) {
  const stored = await readStoredState();
  const draft = normalizeProviderDraft(value);
  stored.profiles[draft.adapter] = draft;
  await writeStoredState(stored);
  return draft;
}

export async function saveProviderProfile(value) {
  const profile = normalizeProviderProfile(value);
  if (!profile) throw new Error("Completa endpoint, API key y modelo.");
  const stored = await readStoredState();
  stored.profiles[profile.adapter] = profile;
  stored.activeAdapter = profile.adapter;
  await writeStoredState(stored);
  return profile;
}

export async function clearProviderProfile() {
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.clear) {
    await desktop.clear();
  } else {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(LEGACY_SESSION_KEY);
  }
}

export function providerStorageDescription() {
  return window.learningDesktop?.providerSettings
    ? "La clave se guarda cifrada en este dispositivo."
    : "La clave se conserva solo mientras esta pestana permanezca abierta.";
}

async function readStoredState() {
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.load) {
    try {
      return normalizeProviderState(await desktop.load());
    } catch {
      return createProviderState();
    }
  }

  try {
    const current = window.sessionStorage.getItem(SESSION_KEY);
    if (current) return normalizeProviderState(JSON.parse(current));
    const legacy = window.sessionStorage.getItem(LEGACY_SESSION_KEY);
    return normalizeProviderState(legacy ? JSON.parse(legacy) : null);
  } catch {
    return createProviderState();
  }
}

async function writeStoredState(value) {
  const stored = normalizeProviderState(value);
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.save) {
    await desktop.save(stored);
    return;
  }
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  window.sessionStorage.removeItem(LEGACY_SESSION_KEY);
}

function createProviderState() {
  return {
    version: 2,
    activeAdapter: "openai",
    profiles: {
      openai: normalizeProviderDraft(EMPTY_PROVIDER_PROFILE),
      minimax: normalizeProviderDraft({ ...EMPTY_PROVIDER_PROFILE, ...MINIMAX_PRESET, label: "MiniMax" }),
    },
  };
}

function normalizeProviderState(value) {
  const fallback = createProviderState();
  if (!value || typeof value !== "object") return fallback;

  // Migrate the previous single-profile format without losing it.
  if (!value.profiles) {
    const legacy = normalizeProviderDraft(value);
    fallback.profiles[legacy.adapter] = legacy;
    fallback.activeAdapter = legacy.adapter;
    return fallback;
  }

  const activeAdapter = value.activeAdapter === "minimax" ? "minimax" : "openai";
  return {
    version: 2,
    activeAdapter,
    profiles: {
      openai: normalizeProviderDraft(value.profiles.openai ?? { ...EMPTY_PROVIDER_PROFILE, adapter: "openai" }),
      minimax: normalizeProviderDraft(value.profiles.minimax ?? { ...EMPTY_PROVIDER_PROFILE, ...MINIMAX_PRESET, label: "MiniMax" }),
    },
  };
}
