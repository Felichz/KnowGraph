import { PROVIDER_LIBRARY, isProviderId } from "../../shared/providerCatalog.js";
import { getProviderPreset, resolveProviderProfile } from "./providerRegistry.js";

const MODELS_DEV_API_URL = "https://models.dev/api.json";
const CATALOG_TTL_MS = 6 * 60 * 60 * 1000;

let catalogCache = null;

/**
 * Models.dev is enrichment for a model picker, never the authority for an
 * actual request. It is fetched without a user URL, key, prompt, or profile.
 * That keeps discovery separate from BYOK credentials and avoids turning the
 * catalog endpoint into an SSRF path.
 */
export async function getProviderCatalogModels(profile, { fetchImpl = fetch, now = Date.now() } = {}) {
  const resolved = resolveProviderProfile(profile);
  const preset = getProviderPreset(resolved.adapter);
  const known = mergeModelLists(preset.knownModels, resolved.model ? [{ id: resolved.model, label: resolved.model, source: "configured" }] : []);

  if (!resolved.catalogProvider) {
    return {
      models: known,
      source: "manual",
      warning: "Este endpoint no tiene un catálogo integrado. Podés cargar /models o escribir el slug manualmente.",
    };
  }

  try {
    const catalog = await getModelsDevCatalog({ fetchImpl, now });
    const provider = catalog?.[resolved.catalogProvider];
    const catalogModels = provider?.models && typeof provider.models === "object"
      ? Object.values(provider.models).map(normalizeCatalogModel).filter(Boolean)
      : [];
    return {
      models: mergeModelLists(known, catalogModels),
      source: "models.dev",
      warning: catalogModels.length ? null : "No encontramos modelos para este preset en el catálogo remoto.",
    };
  } catch {
    return {
      models: known,
      source: "preset",
      warning: "No se pudo actualizar el catálogo remoto. Podés escribir el slug manualmente.",
    };
  }
}

/**
 * Public directory used by the connection picker.
 *
 * Models.dev gives us broad, current provider metadata. The gateway then
 * adds an explicit compatibility verdict. A row marked `ready` is callable
 * by the existing Chat Completions transport; `local` is callable only from a
 * desktop/local gateway; `adapter-required` intentionally has no connect
 * action because its native protocol is not implemented by this gateway.
 */
export async function getProviderDirectory({ fetchImpl = fetch, now = Date.now(), force = false } = {}) {
  let catalog = null;
  let warning = null;
  try {
    catalog = await getModelsDevCatalog({ fetchImpl, now, force });
  } catch {
    warning = "No se pudo actualizar Models.dev. Se muestra la biblioteca integrada.";
  }

  const entries = new Map();
  for (const preset of PROVIDER_LIBRARY) {
    entries.set(preset.id, publicDirectoryEntry(preset, catalog?.[preset.catalogProvider]));
  }

  for (const [id, metadata] of Object.entries(catalog ?? {})) {
    if (!isProviderId(id)) continue;
    const current = entries.get(id);
    if (current) {
      entries.set(id, { ...current, ...catalogPresentation(metadata), modelCount: countCatalogModels(metadata) || current.modelCount });
      continue;
    }
    entries.set(id, dynamicDirectoryEntry(id, metadata));
  }

  const providers = [...entries.values()]
    .sort((a, b) => {
      const order = availabilityOrder(a.availability) - availabilityOrder(b.availability);
      return order || a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
    });
  return {
    providers,
    source: catalog ? "models.dev" : "builtin",
    warning,
    updatedAt: catalogCache?.fetchedAt ?? null,
  };
}

function publicDirectoryEntry(preset, metadata) {
  return {
    id: preset.id,
    label: preset.label,
    description: preset.description,
    group: preset.group,
    defaultBaseUrl: preset.defaultBaseUrl,
    catalogProvider: preset.catalogProvider,
    transport: preset.transport,
    availability: preset.availability,
    compatibility: preset.availability === "local" ? "local" : "compatible",
    connectable: true,
    capabilities: preset.capabilities,
    modelCount: countCatalogModels(metadata),
    ...catalogPresentation(metadata),
  };
}

function dynamicDirectoryEntry(id, metadata) {
  const compatible = isOpenAiCompatible(metadata);
  const local = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(?::|\/|$)/i.test(String(metadata?.api ?? ""));
  const availability = compatible ? (local ? "local" : "ready") : "adapter-required";
  const label = cleanText(metadata?.name) || id;
  return {
    id,
    label,
    description: compatible
      ? "Endpoint compatible detectado desde el catálogo público. Verificá modelo y credencial con una prueba."
      : nativeProtocolDescription(metadata),
    group: availability === "ready" ? "Compatibles detectados" : availability === "local" ? "Local" : "Requieren adaptador",
    defaultBaseUrl: compatible ? String(metadata?.api ?? "").replace(/\/+$/, "") : "",
    catalogProvider: id,
    transport: compatible ? "chat-completions" : "native",
    availability,
    compatibility: compatible ? (local ? "local" : "compatible") : "native-required",
    connectable: compatible,
    capabilities: { streaming: "unknown", structuredOutput: "unknown", tools: "unknown", reasoning: "unknown" },
    modelCount: countCatalogModels(metadata),
    ...catalogPresentation(metadata),
  };
}

function isOpenAiCompatible(metadata) {
  return typeof metadata?.api === "string"
    && metadata.api.length > 0
    && /openai-compatible/i.test(String(metadata?.npm ?? ""));
}

function nativeProtocolDescription(metadata) {
  const provider = cleanText(metadata?.name) || "Este provider";
  const sdk = cleanText(metadata?.npm);
  return `${provider} usa un transporte nativo${sdk ? ` (${sdk})` : ""}. Este gateway todavía no implementa ese protocolo.`;
}

function catalogPresentation(metadata) {
  if (!metadata || typeof metadata !== "object") return {};
  const env = Array.isArray(metadata.env) ? metadata.env.filter((item) => typeof item === "string").slice(0, 4) : [];
  return {
    documentationUrl: cleanText(metadata.doc) || null,
    environmentVariables: env,
    catalogName: cleanText(metadata.name) || null,
  };
}

function countCatalogModels(metadata) {
  return metadata?.models && typeof metadata.models === "object" ? Object.keys(metadata.models).length : 0;
}

function cleanText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function availabilityOrder(value) {
  return ({ ready: 0, local: 1, "adapter-required": 2 })[value] ?? 3;
}

export function mergeModelLists(...lists) {
  const byId = new Map();
  for (const list of lists) {
    for (const item of Array.isArray(list) ? list : []) {
      const model = normalizeCatalogModel(item);
      if (!model) continue;
      const existing = byId.get(model.id);
      // The first list is intentionally the highest-precedence source. An
      // upstream catalog can therefore override stale community metadata.
      byId.set(model.id, existing ? { ...model, ...existing } : model);
    }
  }
  return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}

export function normalizeCatalogModel(value) {
  if (!value || typeof value !== "object") return null;
  const id = typeof value.id === "string" ? value.id.trim() : "";
  if (!id) return null;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const label = typeof value.label === "string" && value.label.trim()
    ? value.label.trim()
    : (name && name !== id ? name : id);
  const limit = value.limit && typeof value.limit === "object" ? value.limit : {};
  const contextLength = Number.isFinite(value.contextLength)
    ? value.contextLength
    : (Number.isFinite(limit.context) ? limit.context : null);

  return {
    id,
    label,
    contextLength,
    capabilities: {
      reasoning: Boolean(value.reasoning),
      tools: Boolean(value.tool_call ?? value.tools),
      structuredOutput: Boolean(value.structured_output ?? value.structuredOutput),
    },
    source: typeof value.source === "string" ? value.source : "catalog",
  };
}

async function getModelsDevCatalog({ fetchImpl, now, force = false }) {
  if (!force && catalogCache?.data && now < catalogCache.expiresAt) return catalogCache.data;

  const headers = { Accept: "application/json" };
  if (catalogCache?.etag) headers["If-None-Match"] = catalogCache.etag;
  const response = await fetchImpl(MODELS_DEV_API_URL, {
    method: "GET",
    headers,
    redirect: "error",
    signal: AbortSignal.timeout(12_000),
  });

  if (response.status === 304 && catalogCache?.data) {
    catalogCache.expiresAt = now + CATALOG_TTL_MS;
    return catalogCache.data;
  }
  if (!response.ok) throw new Error(`models.dev HTTP ${response.status}`);

  const data = await response.json();
  if (!data || typeof data !== "object") throw new Error("models.dev devolvió un catálogo inválido");
  catalogCache = {
    data,
    etag: response.headers.get("etag") ?? "",
    fetchedAt: new Date(now).toISOString(),
    expiresAt: now + CATALOG_TTL_MS,
  };
  return data;
}
