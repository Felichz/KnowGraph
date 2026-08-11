/**
 * Provider registry
 *
 * This is deliberately data, not a plugin loader. A profile chooses a known
 * transport and its request behavior; it can never cause the gateway to load
 * an arbitrary npm package or execute user-supplied code.
 */
export const PROVIDER_ADAPTERS = Object.freeze(["openai", "openrouter", "minimax"]);

export const PROVIDER_PRESETS = Object.freeze({
  openai: Object.freeze({
    id: "openai",
    label: "OpenAI compatible",
    catalogProvider: null,
    transport: "chat-completions",
    defaultBaseUrl: "",
    discovery: "upstream",
    capabilities: Object.freeze({
      streaming: "auto",
      structuredOutput: "auto",
      tools: "auto",
      reasoning: "auto",
    }),
    knownModels: Object.freeze([]),
  }),
  openrouter: Object.freeze({
    id: "openrouter",
    label: "OpenRouter",
    catalogProvider: "openrouter",
    transport: "chat-completions",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    discovery: "catalog-and-upstream",
    capabilities: Object.freeze({
      streaming: "auto",
      structuredOutput: "auto",
      tools: "auto",
      reasoning: "auto",
    }),
    knownModels: Object.freeze([]),
  }),
  minimax: Object.freeze({
    id: "minimax",
    label: "MiniMax",
    // The current app uses MiniMax's Chat Completions-compatible endpoint.
    // models.dev publishes metadata for the provider even though MiniMax does
    // not reliably expose the generic /models route used by this app.
    catalogProvider: "minimax",
    transport: "chat-completions",
    defaultBaseUrl: "https://api.minimax.io/v1",
    discovery: "catalog-and-manual",
    capabilities: Object.freeze({
      streaming: "supported",
      structuredOutput: "fallback-parser",
      tools: "auto",
      reasoning: "supported",
    }),
    knownModels: Object.freeze([
      Object.freeze({ id: "MiniMax-M3", label: "MiniMax M3", source: "preset" }),
    ]),
  }),
});

export function normalizeProviderAdapter(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  // Preserve profiles created by the first BYOK implementation while using a
  // more descriptive name in architecture documentation.
  if (normalized === "openai-compatible") return "openai";
  return PROVIDER_ADAPTERS.includes(normalized) ? normalized : "openai";
}

export function getProviderPreset(adapter) {
  return PROVIDER_PRESETS[normalizeProviderAdapter(adapter)];
}

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
