import {
  PROVIDER_ADAPTERS,
  PROVIDER_LIBRARY,
  PROVIDER_PRESETS,
  getProviderPreset,
  isProviderId,
  normalizeProviderAdapter,
} from "../../shared/providerCatalog.js";

const SESSION_KEY = "learning-workspace:provider-connections:v4";
const LEGACY_SESSION_KEYS = [
  "learning-workspace:provider-profiles:v3",
  "learning-workspace:provider-profiles:v2",
  "learning-workspace:provider-profile:v1",
];

export { PROVIDER_ADAPTERS, PROVIDER_LIBRARY, PROVIDER_PRESETS, getProviderPreset, isProviderId, normalizeProviderAdapter };

export const EMPTY_PROVIDER_PROFILE = Object.freeze({
  id: "",
  label: "",
  adapter: "custom",
  catalogProvider: null,
  baseUrl: "",
  apiKey: "",
  model: "",
});

// Compatibility export for the first BYOK screen and external callers.
export const MINIMAX_PRESET = PROVIDER_PRESETS.minimax;

export function createProviderDraft(provider = "custom") {
  const descriptor = provider && typeof provider === "object" ? provider : { id: provider };
  const adapter = normalizeProviderAdapter(descriptor.id ?? descriptor.adapter);
  const preset = getProviderPreset(adapter);
  const label = String(descriptor.label ?? preset.label);
  const baseUrl = String(descriptor.defaultBaseUrl ?? descriptor.baseUrl ?? preset.defaultBaseUrl);
  const catalogProvider = isProviderId(descriptor.catalogProvider)
    ? descriptor.catalogProvider
    : (adapter === "custom" ? null : (preset.catalogProvider ?? adapter));
  return normalizeProviderDraft({
    ...EMPTY_PROVIDER_PROFILE,
    id: createProviderId(adapter),
    label,
    adapter,
    catalogProvider,
    baseUrl,
    model: preset.knownModels[0]?.id ?? "",
  });
}

export function normalizeProviderDraft(value, { idFallback } = {}) {
  const source = value && typeof value === "object" ? value : EMPTY_PROVIDER_PROFILE;
  const adapter = normalizeProviderAdapter(source.adapter);
  const preset = getProviderPreset(adapter);
  const id = String(source.id ?? "").trim().slice(0, 80) || idFallback || createProviderId(adapter);
  const requestedCatalogProvider = String(source.catalogProvider ?? "").trim().toLowerCase();
  return {
    id,
    label: String(source.label ?? preset.label).trim().slice(0, 80) || preset.label,
    adapter,
    catalogProvider: isProviderId(requestedCatalogProvider)
      ? requestedCatalogProvider
      : (adapter === "custom" ? null : (preset.catalogProvider ?? adapter)),
    baseUrl: String(source.baseUrl ?? preset.defaultBaseUrl).trim().replace(/\/+$/, "").slice(0, 500),
    apiKey: String(source.apiKey ?? "").trim().slice(0, 4096),
    model: String(source.model ?? preset.knownModels[0]?.id ?? "").trim().slice(0, 200),
  };
}

export function normalizeProviderProfile(value, { requireModel = true } = {}) {
  const profile = normalizeProviderDraft(value);
  return profile.baseUrl && profile.apiKey && (!requireModel || profile.model) ? profile : null;
}

export async function loadProviderSettings() {
  return readStoredState();
}

export async function loadProviderProfile() {
  const stored = await readStoredState();
  const active = stored.profiles.find((profile) => profile.id === stored.activeProfileId);
  return normalizeProviderProfile(active);
}

// Kept while consumers migrate from the old name. It now returns the complete
// connection state, not a fixed map keyed by adapter.
export async function loadProviderDrafts() {
  return readStoredState();
}

export async function saveProviderDraft(value) {
  return upsertProvider(value, { activate: false, requireModel: false });
}

export async function saveProviderProfile(value, { activate = true } = {}) {
  return upsertProvider(value, { activate, requireModel: true });
}

export async function setActiveProviderProfile(profileId) {
  const stored = await readStoredState();
  const id = String(profileId ?? "").trim();
  if (!id) {
    stored.activeProfileId = null;
    await writeStoredState(stored);
    return null;
  }
  const profile = stored.profiles.find((candidate) => candidate.id === id);
  const ready = normalizeProviderProfile(profile);
  if (!ready) throw new Error("La conexión debe tener endpoint, API key y modelo antes de usarse.");
  stored.activeProfileId = ready.id;
  await writeStoredState(stored);
  return ready;
}

export async function removeProviderProfile(profileId) {
  const stored = await readStoredState();
  const id = String(profileId ?? "").trim();
  stored.profiles = stored.profiles.filter((profile) => profile.id !== id);
  if (stored.activeProfileId === id) stored.activeProfileId = null;
  await writeStoredState(stored);
  return stored;
}

export async function clearProviderProfile() {
  const desktop = window.learningDesktop?.providerSettings;
  if (desktop?.clear) {
    await desktop.clear();
  } else {
    window.localStorage.removeItem(SESSION_KEY);
    LEGACY_SESSION_KEYS.forEach((key) => window.localStorage.removeItem(key));
  }
}

export function providerStorageDescription() {
  return window.learningDesktop?.providerSettings
    ? "La clave se guarda cifrada en este dispositivo."
    : "La clave se conserva solo mientras esta pestaña permanezca abierta.";
}

export async function exportProviderSettings() {
  const stored = await readStoredState();
  return {
    version: stored.version,
    activeProfileId: stored.activeProfileId,
    profiles: stored.profiles.map((profile) => ({ ...profile })),
  };
}

export async function importProviderSettings(value) {
  const existing = await readStoredState();
  const incoming = normalizeProviderState(value);
  const mergedProfiles = incoming.profiles.map((incomingProfile) => {
    if (!incomingProfile.apiKey) {
      const match = existing.profiles.find((p) => p.id === incomingProfile.id);
      if (match?.apiKey) {
        return { ...incomingProfile, apiKey: match.apiKey };
      }
    }
    return incomingProfile;
  });
  const finalState = {
    ...incoming,
    profiles: mergedProfiles,
  };
  await writeStoredState(finalState);
  return finalState;
}

async function upsertProvider(value, { activate, requireModel }) {
  const normalized = normalizeProviderProfile(value, { requireModel });
  if (!normalized) {
    throw new Error(requireModel
      ? "Completá endpoint, API key y modelo."
      : "Completá endpoint y API key.");
  }
  const stored = await readStoredState();
  const index = stored.profiles.findIndex((profile) => profile.id === normalized.id);
  if (index >= 0) stored.profiles[index] = normalized;
  else stored.profiles.push(normalized);
  if (activate) stored.activeProfileId = normalized.id;
  await writeStoredState(stored);
  return normalized;
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
    const current = window.localStorage.getItem(SESSION_KEY);
    if (current) return normalizeProviderState(JSON.parse(current));
    for (const key of LEGACY_SESSION_KEYS) {
      const legacy = window.localStorage.getItem(key);
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
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  LEGACY_SESSION_KEYS.forEach((key) => window.localStorage.removeItem(key));
}

function createProviderState() {
  return { version: 4, activeProfileId: null, profiles: [] };
}

function normalizeProviderState(value) {
  if (!value || typeof value !== "object") return createProviderState();
  if (Array.isArray(value.profiles)) {
    const profiles = normalizeProfileList(value.profiles);
    const requestedActiveId = String(value.activeProfileId ?? "").trim();
    return {
      version: 4,
      activeProfileId: profiles.some((profile) => profile.id === requestedActiveId) ? requestedActiveId : null,
      profiles,
    };
  }

  const legacyProfiles = value.profiles && typeof value.profiles === "object"
    ? Object.entries(value.profiles).map(([adapter, profile]) => ({ ...profile, adapter: legacyAdapter(adapter, profile) }))
    : [value];
  const profiles = normalizeProfileList(legacyProfiles, { legacy: true });
  const activeAdapter = legacyAdapter(value.activeAdapter, value.profiles?.[value.activeAdapter]);
  return {
    version: 4,
    activeProfileId: profiles.find((profile) => profile.adapter === activeAdapter)?.id ?? null,
    profiles,
  };
}

function normalizeProfileList(values, { legacy = false } = {}) {
  const usedIds = new Set();
  return values.map((value, index) => {
    const adapter = legacyAdapter(value?.adapter, value);
    const requestedId = String(value?.id ?? "").trim();
    const safeId = requestedId && requestedId !== "provider_default" && !usedIds.has(requestedId)
      ? requestedId
      : `provider_${adapter}_${index + 1}`;
    usedIds.add(safeId);
    return normalizeProviderDraft({ ...value, adapter, id: safeId }, { idFallback: safeId });
  });
}

function legacyAdapter(value, profile) {
  const adapter = String(value ?? "").trim().toLowerCase();
  // Version 3 used `openai` as its generic custom endpoint. Preserve that
  // meaning during migration; new OpenAI profiles are explicit.
  if (adapter === "openai" && profile?.label === "OpenAI compatible") return "custom";
  if (adapter === "openai-compatible") return "custom";
  return normalizeProviderAdapter(adapter);
}

function createProviderId(adapter) {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `provider_${adapter}_${uuid}`.slice(0, 80);
  return `provider_${adapter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

