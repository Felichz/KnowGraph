/**
 * Public provider metadata shared by the browser and the gateway.
 *
 * This deliberately describes only providers that speak the Chat Completions
 * protocol used by this application. It is not a promise that every model
 * from every vendor supports every optional capability. The gateway owns
 * request-time fallbacks and provider-specific behavior.
 */
export const PROVIDER_LIBRARY = Object.freeze([
  Object.freeze({
    id: "openai",
    group: "APIs directas",
    label: "OpenAI",
    description: "Modelos GPT a traves de la API oficial.",
    defaultBaseUrl: "https://api.openai.com/v1",
    catalogProvider: "openai",
    discovery: "catalog-and-upstream",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" }),
    knownModels: Object.freeze([]),
  }),
  Object.freeze({
    id: "openrouter",
    group: "Routers",
    label: "OpenRouter",
    description: "Un solo endpoint para un catalogo multi-provider.",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    catalogProvider: "openrouter",
    discovery: "catalog-and-upstream",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" }),
    knownModels: Object.freeze([]),
  }),
  Object.freeze({
    id: "minimax",
    group: "APIs directas",
    label: "MiniMax",
    description: "Adapter nativo para reasoning y streaming de MiniMax.",
    defaultBaseUrl: "https://api.minimax.io/v1",
    catalogProvider: "minimax",
    discovery: "catalog-and-manual",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "supported", structuredOutput: "fallback-parser", tools: "auto", reasoning: "supported" }),
    knownModels: Object.freeze([Object.freeze({ id: "MiniMax-M3", label: "MiniMax M3", source: "preset" })]),
  }),
  Object.freeze({
    id: "groq",
    group: "APIs directas",
    label: "Groq",
    description: "Inferencia de baja latencia con API compatible.",
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    catalogProvider: "groq",
    discovery: "catalog-and-upstream",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" }),
    knownModels: Object.freeze([]),
  }),
  Object.freeze({
    id: "mistral",
    group: "APIs directas",
    label: "Mistral AI",
    description: "Modelos Mistral mediante su endpoint compatible.",
    defaultBaseUrl: "https://api.mistral.ai/v1",
    catalogProvider: "mistral",
    discovery: "catalog-and-upstream",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" }),
    knownModels: Object.freeze([]),
  }),
  Object.freeze({
    id: "cerebras",
    group: "APIs directas",
    label: "Cerebras",
    description: "Modelos de inferencia rapida con contrato OpenAI.",
    defaultBaseUrl: "https://api.cerebras.ai/v1",
    catalogProvider: "cerebras",
    discovery: "catalog-and-upstream",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" }),
    knownModels: Object.freeze([]),
  }),
  Object.freeze({
    id: "custom",
    group: "Personalizado",
    label: "Endpoint compatible",
    description: "Un proxy corporativo u otra API Chat Completions compatible.",
    defaultBaseUrl: "",
    catalogProvider: null,
    discovery: "upstream-or-manual",
    transport: "chat-completions",
    capabilities: Object.freeze({ streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" }),
    knownModels: Object.freeze([]),
  }),
]);

export const PROVIDER_ADAPTERS = Object.freeze(PROVIDER_LIBRARY.map((provider) => provider.id));
export const PROVIDER_PRESETS = Object.freeze(Object.fromEntries(PROVIDER_LIBRARY.map((provider) => [provider.id, provider])));

export function normalizeProviderAdapter(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "openai-compatible") return "custom";
  return PROVIDER_ADAPTERS.includes(normalized) ? normalized : "custom";
}

export function getProviderPreset(adapter) {
  return PROVIDER_PRESETS[normalizeProviderAdapter(adapter)];
}
