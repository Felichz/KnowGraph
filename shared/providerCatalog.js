/**
 * Stable, executable provider presets.
 *
 * Models.dev provides the broad directory shown in the UI. This file is the
 * much smaller contract registry: every entry here is a provider that this
 * gateway can actually call today. Unknown but OpenAI-compatible entries can
 * still use the generic transport; native protocols deliberately need their
 * own adapter before they become executable.
 */

// Group ids map to UI catalog keys (settings.picker.groups.<id>); GROUP_LABEL keeps an
// English plain-string `group` for Node consumers such as the gateway directory.
const GROUP_LABEL = Object.freeze({ direct: "Direct APIs", routers: "Routers", local: "Local", custom: "Custom" });

// Localized text is stored as { en, es }; `label`/`description` stay plain English strings
// (default locale) and `labels`/`descriptions` carry every locale for the UI to resolve.
function localized(value) {
  if (value && typeof value === "object") return Object.freeze({ ...value });
  return Object.freeze({ en: value, es: value });
}

function preset({
  id,
  groupId,
  label,
  description,
  defaultBaseUrl = "",
  catalogProvider = id,
  discovery = "catalog-and-upstream",
  availability = "ready",
  knownModels = [],
  capabilities = { streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" },
}) {
  const labels = localized(label);
  const descriptions = localized(description);
  return Object.freeze({
    id,
    groupId,
    group: GROUP_LABEL[groupId],
    label: labels.en,
    labels,
    description: descriptions.en,
    descriptions,
    defaultBaseUrl,
    catalogProvider,
    discovery,
    availability,
    transport: "chat-completions",
    capabilities: Object.freeze(capabilities),
    knownModels: Object.freeze(knownModels.map((model) => Object.freeze(model))),
  });
}

// Resolves a preset's localized field ("label" or "description") for a locale, falling back to English.
export function presetText(provider, field, locale) {
  const values = provider?.[`${field}s`];
  return values?.[locale] ?? values?.en ?? provider?.[field] ?? "";
}

export const PROVIDER_LIBRARY = Object.freeze([
  preset({ id: "openai", groupId: "direct", label: "OpenAI", description: { en: "GPT through the official API.", es: "GPT mediante la API oficial." }, defaultBaseUrl: "https://api.openai.com/v1" }),
  preset({ id: "minimax", groupId: "direct", label: "MiniMax · Chat Completions", description: { en: "Direct Chat Completions endpoint, with reasoning and streaming configured by the gateway.", es: "Endpoint Chat Completions directo, con reasoning y streaming configurados por el gateway." }, defaultBaseUrl: "https://api.minimax.io/v1", discovery: "catalog-and-manual", capabilities: { streaming: "supported", structuredOutput: "fallback-parser", tools: "auto", reasoning: "supported" }, knownModels: [{ id: "MiniMax-M3", label: "MiniMax M3", source: "preset" }] }),
  preset({ id: "groq", groupId: "direct", label: "Groq", description: { en: "Low-latency inference with a Chat Completions contract.", es: "Inferencia de baja latencia con contrato Chat Completions." }, defaultBaseUrl: "https://api.groq.com/openai/v1" }),
  preset({ id: "mistral", groupId: "direct", label: "Mistral AI", description: { en: "Mistral models with a compatible endpoint.", es: "Modelos Mistral con endpoint compatible." }, defaultBaseUrl: "https://api.mistral.ai/v1" }),
  preset({ id: "cerebras", groupId: "direct", label: "Cerebras", description: { en: "Fast inference models with a compatible API.", es: "Modelos de inferencia rápida con API compatible." }, defaultBaseUrl: "https://api.cerebras.ai/v1" }),
  preset({ id: "togetherai", groupId: "direct", label: "Together AI", description: { en: "Open catalog and third-party models via Chat Completions.", es: "Catálogo abierto y modelos de terceros vía Chat Completions." }, defaultBaseUrl: "https://api.together.xyz/v1" }),
  preset({ id: "fireworks-ai", groupId: "direct", label: "Fireworks AI", description: { en: "Inference and routers for open-source models.", es: "Inferencia y routers de modelos open-source." }, defaultBaseUrl: "https://api.fireworks.ai/inference/v1" }),
  preset({ id: "deepseek", groupId: "direct", label: "DeepSeek", description: { en: "DeepSeek models with a compatible endpoint.", es: "Modelos DeepSeek con endpoint compatible." }, defaultBaseUrl: "https://api.deepseek.com/v1" }),
  preset({ id: "xai", groupId: "direct", label: "xAI", description: { en: "Grok models via Chat Completions.", es: "Modelos Grok mediante Chat Completions." }, defaultBaseUrl: "https://api.x.ai/v1" }),
  preset({ id: "nvidia", groupId: "direct", label: "NVIDIA NIM", description: { en: "NVIDIA-hosted NIM with a compatible contract.", es: "NIM hospedado por NVIDIA con contrato compatible." }, defaultBaseUrl: "https://integrate.api.nvidia.com/v1" }),
  preset({ id: "huggingface", groupId: "direct", label: "Hugging Face", description: { en: "Hugging Face Inference Providers Router.", es: "Hugging Face Inference Providers Router." }, defaultBaseUrl: "https://router.huggingface.co/v1" }),
  preset({ id: "perplexity", groupId: "direct", label: "Perplexity", description: { en: "Sonar models and search-grounded answers.", es: "Modelos Sonar y respuestas con búsqueda." }, defaultBaseUrl: "https://api.perplexity.ai" }),
  preset({ id: "deepinfra", groupId: "direct", label: "Deep Infra", description: { en: "Third-party models with a Chat Completions endpoint.", es: "Modelos de terceros con endpoint Chat Completions." }, defaultBaseUrl: "https://api.deepinfra.com/v1/openai" }),
  preset({ id: "chutes", groupId: "direct", label: "Chutes", description: { en: "Open inference infrastructure.", es: "Infraestructura de inferencia abierta." }, defaultBaseUrl: "https://llm.chutes.ai/v1" }),
  preset({ id: "baseten", groupId: "direct", label: "Baseten", description: { en: "Managed inference endpoints.", es: "Endpoints de inferencia administrados." }, defaultBaseUrl: "https://inference.baseten.co/v1" }),
  preset({ id: "moonshotai", groupId: "direct", label: "Moonshot AI / Kimi", description: { en: "Kimi models through the Moonshot API.", es: "Modelos Kimi mediante la API Moonshot." }, defaultBaseUrl: "https://api.moonshot.ai/v1" }),
  preset({ id: "zai", groupId: "direct", label: "Z.AI", description: { en: "GLM models through a compatible API.", es: "Modelos GLM mediante API compatible." }, defaultBaseUrl: "https://api.z.ai/api/paas/v4" }),
  preset({ id: "stepfun", groupId: "direct", label: "StepFun", description: { en: "Step models via Chat Completions.", es: "Modelos Step vía Chat Completions." }, defaultBaseUrl: "https://api.stepfun.com/v1" }),
  preset({ id: "alibaba", groupId: "direct", label: "Alibaba Cloud / Qwen", description: { en: "DashScope in OpenAI-compatible mode.", es: "DashScope en modo compatible con OpenAI." }, defaultBaseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1" }),
  preset({ id: "openrouter", groupId: "routers", label: "OpenRouter", description: { en: "One endpoint for a multi-provider catalog.", es: "Un endpoint para un catálogo multi-provider." }, defaultBaseUrl: "https://openrouter.ai/api/v1" }),
  preset({ id: "freellmapi", groupId: "local", label: "FreeLLMAPI", description: { en: "Local OpenAI-compatible FreeLLMAPI server on port 31415.", es: "Servidor local FreeLLMAPI OpenAI-compatible en puerto 31415." }, defaultBaseUrl: "http://127.0.0.1:31415/v1", availability: "local", knownModels: [{ id: "auto", label: "Auto (Recomendado)", source: "preset" }, { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash", source: "preset" }, { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash", source: "preset" }, { id: "minimax-m3", label: "MiniMax M3", source: "preset" }] }),
  preset({ id: "ollama", groupId: "local", label: "Ollama", description: { en: "Local OpenAI-compatible server. Desktop or local development only.", es: "Servidor local OpenAI-compatible. Solo desktop o desarrollo local." }, defaultBaseUrl: "http://127.0.0.1:11434/v1", availability: "local" }),
  preset({ id: "lmstudio", groupId: "local", label: "LM Studio", description: { en: "Local OpenAI-compatible server. Desktop or local development only.", es: "Servidor local OpenAI-compatible. Solo desktop o desarrollo local." }, defaultBaseUrl: "http://127.0.0.1:1234/v1", availability: "local" }),
  preset({ id: "custom", groupId: "custom", label: { en: "Compatible endpoint", es: "Endpoint compatible" }, description: { en: "Corporate proxy, vLLM, LM Studio or any other Chat Completions API.", es: "Proxy corporativo, vLLM, LM Studio u otra API Chat Completions." }, catalogProvider: null, discovery: "upstream-or-manual" }),
]);

export const PROVIDER_ADAPTERS = Object.freeze(PROVIDER_LIBRARY.map((provider) => provider.id));
export const PROVIDER_PRESETS = Object.freeze(Object.fromEntries(PROVIDER_LIBRARY.map((provider) => [provider.id, provider])));

export function isProviderId(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9._-]{0,79}$/.test(value.trim().toLowerCase());
}

export function normalizeProviderAdapter(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "openai-compatible") return "custom";
  return isProviderId(normalized) ? normalized : "custom";
}

export function getProviderPreset(adapter) {
  return PROVIDER_PRESETS[normalizeProviderAdapter(adapter)] ?? PROVIDER_PRESETS.custom;
}
