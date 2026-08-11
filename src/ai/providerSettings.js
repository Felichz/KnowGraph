const SESSION_KEY = "learning-workspace:provider-profiles:v3";
const LEGACY_SESSION_KEYS = [
  "learning-workspace:provider-profiles:v2",
  "learning-workspace:provider-profile:v1",
];

export const PROVIDER_ADAPTERS = Object.freeze(["openai", "openrouter", "minimax"]);

export const PROVIDER_PRESETS = Object.freeze({
  openai: Object.freeze({
    adapter: "openai",
    label: "OpenAI compatible",
    baseUrl: "",
    model: "",
    description: "OpenAI, gateways compatibles, Ollama, LM Studio y endpoints propios.",
  }),
  openrouter: Object.freeze({
    adapter: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "",
    description: "Un catálogo multi-provider detrás de un endpoint compatible.",
  }),
  minimax: Object.freeze({
    adapter: "minimax",
    label: "MiniMax",
    baseUrl: "https://api.minimax.io/v1",
    model: "MiniMax-M3",
    description: "Adapter nativo para el formato de reasoning de MiniMax.",
  }),
});

export const EMPTY_PROVIDER_PROFILE = Object.freeze({
  id: "",
  label: "",
  adapter: "openai",
  baseUrl: "",
  apiKey: "",
  model: "",
});

// Compatibility export for callers created before the preset registry.
export const MINIMAX_PRESET = PROVIDER_PRESETS.minimax;

export function normalizeProviderAdapter(value) {
  const adapter = String(value ?? "").trim().toLowerCase();
  if (adapter === "openai-compatible") return "openai";
  return PROVIDER_ADAPTERS.includes(adapter) ? adapter : "openai";
}

export function createProviderDraft(adapter = "openai") {
  const preset = PROVIDER_PRESETS[normalizeProviderAdapter(adapter)];
  return normalizeProviderDraft({ ...EMPTY_PROVIDER_PROFILE, ...preset });
}

export function normalizeProviderDraft(value) {
  const source = value && typeof value === "object" ? value : EMPTY_PROVIDER_PROFILE;
  const adapter = normalizeProviderAdapter(source.adapter);
  const preset = PROVIDER_PRESETS[adapter];
  return {
    id: String(source.id ?? "").trim().slice(0, 80) || "provider_default",
    label: String(source.label ?? preset.label).trim().slice(0, 80),
    adapter,
    baseUrl: String(source.baseUrl ?? preset.baseUrl).trim().replace(/\/+$/, "").slice(0, 500),
    apiKey: String(source.apiKey ?? "").trim().slice(0, 4096),
    model: String(source.model ?? preset.model).trim().slice(0, 200),
  };
}

export function normalizeProviderProfile(value, { requireModel = true } = {}) {
  const profile = normalizeProviderDraft(value);
  return profile.baseUrl && profile.apiKey && (!requireModel || profile.model) ? profile : null;
}

export async function loadProviderDrafts() {
  return readStoredState();
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
    LEGACY_SESSION_KEYS.forEach((key) => window.sessionStorage.removeItem(key));
  }
}

export function providerStorageDescription() {
  return window.learningDesktop?.providerSettings
    ? "La clave se guarda cifrada en este dispositivo."
    : "La clave se conserva solo mientras esta pestaña permanezca abierta.";
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
    for (const key of LEGACY_SESSION_KEYS) {
      const legacy = window.sessionStorage.getItem(key);
      if (legacy) return normalizeProviderState(JSON.parse(legacy));
    }
    return createProviderState();
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
  LEGACY_SESSION_KEYS.forEach((key) => window.sessionStorage.removeItem(key));
}

function createProviderState() {
  return {
    version: 3,
    activeAdapter: "openai",
    profiles: Object.fromEntries(PROVIDER_ADAPTERS.map((adapter) => [adapter, createProviderDraft(adapter)])),
  };
}

function normalizeProviderState(value) {
  const fallback = createProviderState();
  if (!value || typeof value !== "object") return fallback;

  // Migrate v1's single profile and v2's openai/minimax draft map without
  // dropping credentials. OpenRouter starts as a fresh, isolated draft.
  if (!value.profiles) {
    const legacy = normalizeProviderDraft(value);
    fallback.profiles[legacy.adapter] = legacy;
    fallback.activeAdapter = legacy.adapter;
    return fallback;
  }

  const activeAdapter = normalizeProviderAdapter(value.activeAdapter);
  return {
    version: 3,
    activeAdapter,
    profiles: Object.fromEntries(PROVIDER_ADAPTERS.map((adapter) => [
      adapter,
      normalizeProviderDraft(value.profiles[adapter] ?? createProviderDraft(adapter)),
    ])),
  };
}
