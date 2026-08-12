/**
 * Stable, executable provider presets.
 *
 * Models.dev provides the broad directory shown in the UI. This file is the
 * much smaller contract registry: every entry here is a provider that this
 * gateway can actually call today. Unknown but OpenAI-compatible entries can
 * still use the generic transport; native protocols deliberately need their
 * own adapter before they become executable.
 */

function preset({
  id,
  group,
  label,
  description,
  defaultBaseUrl = "",
  catalogProvider = id,
  discovery = "catalog-and-upstream",
  availability = "ready",
  knownModels = [],
  capabilities = { streaming: "auto", structuredOutput: "auto", tools: "auto", reasoning: "auto" },
}) {
  return Object.freeze({
    id,
    group,
    label,
    description,
    defaultBaseUrl,
    catalogProvider,
    discovery,
    availability,
    transport: "chat-completions",
    capabilities: Object.freeze(capabilities),
    knownModels: Object.freeze(knownModels.map((model) => Object.freeze(model))),
  });
}

export const PROVIDER_LIBRARY = Object.freeze([
  preset({ id: "openai", group: "APIs directas", label: "OpenAI", description: "GPT mediante la API oficial.", defaultBaseUrl: "https://api.openai.com/v1" }),
  preset({ id: "minimax", group: "APIs directas", label: "MiniMax · Chat Completions", description: "Endpoint Chat Completions directo, con reasoning y streaming configurados por el gateway.", defaultBaseUrl: "https://api.minimax.io/v1", discovery: "catalog-and-manual", capabilities: { streaming: "supported", structuredOutput: "fallback-parser", tools: "auto", reasoning: "supported" }, knownModels: [{ id: "MiniMax-M3", label: "MiniMax M3", source: "preset" }] }),
  preset({ id: "groq", group: "APIs directas", label: "Groq", description: "Inferencia de baja latencia con contrato Chat Completions.", defaultBaseUrl: "https://api.groq.com/openai/v1" }),
  preset({ id: "mistral", group: "APIs directas", label: "Mistral AI", description: "Modelos Mistral con endpoint compatible.", defaultBaseUrl: "https://api.mistral.ai/v1" }),
  preset({ id: "cerebras", group: "APIs directas", label: "Cerebras", description: "Modelos de inferencia rápida con API compatible.", defaultBaseUrl: "https://api.cerebras.ai/v1" }),
  preset({ id: "togetherai", group: "APIs directas", label: "Together AI", description: "Catálogo abierto y modelos de terceros vía Chat Completions.", defaultBaseUrl: "https://api.together.xyz/v1" }),
  preset({ id: "fireworks-ai", group: "APIs directas", label: "Fireworks AI", description: "Inferencia y routers de modelos open-source.", defaultBaseUrl: "https://api.fireworks.ai/inference/v1" }),
  preset({ id: "deepseek", group: "APIs directas", label: "DeepSeek", description: "Modelos DeepSeek con endpoint compatible.", defaultBaseUrl: "https://api.deepseek.com/v1" }),
  preset({ id: "xai", group: "APIs directas", label: "xAI", description: "Modelos Grok mediante Chat Completions.", defaultBaseUrl: "https://api.x.ai/v1" }),
  preset({ id: "nvidia", group: "APIs directas", label: "NVIDIA NIM", description: "NIM hospedado por NVIDIA con contrato compatible.", defaultBaseUrl: "https://integrate.api.nvidia.com/v1" }),
  preset({ id: "huggingface", group: "APIs directas", label: "Hugging Face", description: "Hugging Face Inference Providers Router.", defaultBaseUrl: "https://router.huggingface.co/v1" }),
  preset({ id: "perplexity", group: "APIs directas", label: "Perplexity", description: "Modelos Sonar y respuestas con búsqueda.", defaultBaseUrl: "https://api.perplexity.ai" }),
  preset({ id: "deepinfra", group: "APIs directas", label: "Deep Infra", description: "Modelos de terceros con endpoint Chat Completions.", defaultBaseUrl: "https://api.deepinfra.com/v1/openai" }),
  preset({ id: "chutes", group: "APIs directas", label: "Chutes", description: "Infraestructura de inferencia abierta.", defaultBaseUrl: "https://llm.chutes.ai/v1" }),
  preset({ id: "baseten", group: "APIs directas", label: "Baseten", description: "Endpoints de inferencia administrados.", defaultBaseUrl: "https://inference.baseten.co/v1" }),
  preset({ id: "moonshotai", group: "APIs directas", label: "Moonshot AI / Kimi", description: "Modelos Kimi mediante la API Moonshot.", defaultBaseUrl: "https://api.moonshot.ai/v1" }),
  preset({ id: "zai", group: "APIs directas", label: "Z.AI", description: "Modelos GLM mediante API compatible.", defaultBaseUrl: "https://api.z.ai/api/paas/v4" }),
  preset({ id: "stepfun", group: "APIs directas", label: "StepFun", description: "Modelos Step vía Chat Completions.", defaultBaseUrl: "https://api.stepfun.com/v1" }),
  preset({ id: "alibaba", group: "APIs directas", label: "Alibaba Cloud / Qwen", description: "DashScope en modo compatible con OpenAI.", defaultBaseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1" }),
  preset({ id: "openrouter", group: "Routers", label: "OpenRouter", description: "Un endpoint para un catálogo multi-provider.", defaultBaseUrl: "https://openrouter.ai/api/v1" }),
  preset({ id: "ollama", group: "Local", label: "Ollama", description: "Servidor local OpenAI-compatible. Solo desktop o desarrollo local.", defaultBaseUrl: "http://127.0.0.1:11434/v1", availability: "local" }),
  preset({ id: "lmstudio", group: "Local", label: "LM Studio", description: "Servidor local OpenAI-compatible. Solo desktop o desarrollo local.", defaultBaseUrl: "http://127.0.0.1:1234/v1", availability: "local" }),
  preset({ id: "custom", group: "Personalizado", label: "Endpoint compatible", description: "Proxy corporativo, vLLM, LM Studio u otra API Chat Completions.", catalogProvider: null, discovery: "upstream-or-manual" }),
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
