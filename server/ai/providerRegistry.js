/**
 * Provider registry
 *
 * The public catalog is shared with the settings UI. A profile chooses a
 * controlled transport and request behavior; it cannot load code, headers or
 * arbitrary transforms into the gateway.
 */
import {
  PROVIDER_ADAPTERS,
  PROVIDER_PRESETS,
  getProviderPreset,
  normalizeProviderAdapter,
} from "../../shared/providerCatalog.js";

export { PROVIDER_ADAPTERS, PROVIDER_PRESETS, getProviderPreset, normalizeProviderAdapter };

export function resolveProviderProfile(profile) {
  const adapter = normalizeProviderAdapter(profile?.adapter);
  const preset = getProviderPreset(adapter);
  return {
    ...profile,
    adapter,
    label: String(profile?.label || preset.label).trim(),
    baseUrl: String(profile?.baseUrl || preset.defaultBaseUrl).replace(/\/+$/, ""),
    transport: preset.transport,
    catalogProvider: preset.catalogProvider,
    discovery: preset.discovery,
    capabilities: preset.capabilities,
  };
}

export function providerRuntimeOptions(profile, { thinking = "adaptive" } = {}) {
  const resolved = resolveProviderProfile(profile);
  const isMiniMax = resolved.adapter === "minimax";

  return {
    name: resolved.label,
    baseUrl: resolved.baseUrl,
    apiKey: resolved.apiKey,
    model: resolved.model,
    transport: resolved.transport,
    responseFormatMode: isMiniMax ? "unsupported" : "auto",
    extraBody: isMiniMax
      ? {
          thinking: { type: thinking === "disabled" ? "disabled" : "adaptive" },
          reasoning_split: true,
        }
      : null,
    streamContentMode: "delta",
  };
}
