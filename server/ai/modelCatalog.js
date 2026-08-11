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

  if (!preset.catalogProvider) {
    return {
      models: known,
      source: "manual",
      warning: "Este endpoint no tiene un catálogo integrado. Podés cargar /models o escribir el slug manualmente.",
    };
  }

  try {
    const catalog = await getModelsDevCatalog({ fetchImpl, now });
    const provider = catalog?.[preset.catalogProvider];
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

async function getModelsDevCatalog({ fetchImpl, now }) {
  if (catalogCache?.data && now < catalogCache.expiresAt) return catalogCache.data;

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
    expiresAt: now + CATALOG_TTL_MS,
  };
  return data;
}
