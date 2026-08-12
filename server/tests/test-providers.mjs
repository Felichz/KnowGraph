// Contract tests for the provider registry. They do not need a real key or
// network connection: fetch is replaced only for the inference probe.
process.env.ALLOW_PRIVATE_PROVIDER_URLS = "true";

const { parseRequestProvider, requestProvider } = await import("../ai/providers.js");
const { getProviderCatalogModels, getProviderDirectory, mergeModelLists, normalizeCatalogModel } = await import("../ai/modelCatalog.js");
const { probeProvider } = await import("../ai/llmClient.js");

const base = {
  label: "MiniMax",
  adapter: "minimax",
  baseUrl: "https://api.minimax.io/v1",
  apiKey: "test-key",
  model: "MiniMax-M3",
};

const withEmptyId = await parseRequestProvider({ ...base, id: "" });
if (withEmptyId.id !== undefined) {
  throw new Error("Un id vacío debe normalizarse a undefined");
}

const withoutId = await parseRequestProvider(base);
if (withoutId.model !== base.model) {
  throw new Error("El modelo válido no debe alterarse");
}

const openRouter = await parseRequestProvider({
  ...base,
  adapter: "openrouter",
  label: "OpenRouter",
  baseUrl: "https://openrouter.ai/api/v1",
  model: "openai/gpt-4.1-mini",
});
if (openRouter.adapter !== "openrouter" || openRouter.catalogProvider !== "openrouter") {
  throw new Error("OpenRouter debe resolver su preset y catálogo");
}

const groq = await parseRequestProvider({
  ...base,
  adapter: "groq",
  label: "Groq",
  baseUrl: "https://api.groq.com/openai/v1",
  model: "llama-3.3-70b-versatile",
});
if (groq.adapter !== "groq" || groq.catalogProvider !== "groq") {
  throw new Error("Los presets curados deben resolver el catálogo y transporte compartido");
}

const custom = await parseRequestProvider({
  ...base,
  adapter: "openai-compatible",
  catalogProvider: null,
  label: "Gateway privado",
  baseUrl: "https://gateway.example/v1",
  model: "custom-model",
});
if (custom.adapter !== "custom" || custom.catalogProvider !== null) {
  throw new Error("El alias OpenAI compatible debe migrar al endpoint personalizado");
}

const minimaxRuntime = requestProvider(withoutId, { thinking: "disabled" });
if (minimaxRuntime.responseFormatMode !== "unsupported" || minimaxRuntime.extraBody?.thinking?.type !== "disabled") {
  throw new Error("MiniMax debe conservar su configuración de reasoning y schema");
}

const mergedModels = mergeModelLists(
  [{ id: "model-a", label: "Desde endpoint", contextLength: 1000 }],
  [{ id: "model-a", name: "Desde catálogo", limit: { context: 2000 } }, { id: "model-b", name: "Modelo B" }],
);
if (mergedModels.length !== 2 || mergedModels.find((model) => model.id === "model-a")?.label !== "Desde endpoint") {
  throw new Error("La lista de modelos debe preferir metadata del endpoint sobre el catálogo");
}
if (normalizeCatalogModel({ name: "sin-id" }) !== null) {
  throw new Error("Un modelo sin id no es seleccionable");
}

const catalogModels = await getProviderCatalogModels(withoutId, {
  fetchImpl: async () => new Response(JSON.stringify({
    minimax: {
      models: {
        "MiniMax-X": { id: "MiniMax-X", name: "MiniMax X", limit: { context: 128000 }, reasoning: true },
      },
    },
  }), { status: 200 }),
});
if (catalogModels.source !== "models.dev" || !catalogModels.models.some((model) => model.id === "MiniMax-M3") || !catalogModels.models.some((model) => model.id === "MiniMax-X")) {
  throw new Error("El catálogo debe enriquecer, no reemplazar, los modelos del preset");
}

const directory = await getProviderDirectory({
  force: true,
  fetchImpl: async () => new Response(JSON.stringify({
    "compatible-provider": {
      name: "Compatible Provider",
      api: "https://compatible.example/v1",
      npm: "@ai-sdk/openai-compatible",
      env: ["COMPATIBLE_API_KEY"],
      models: { "model-one": { id: "model-one" } },
    },
    anthropic: {
      name: "Anthropic",
      npm: "@ai-sdk/anthropic",
      env: ["ANTHROPIC_API_KEY"],
      models: { "claude-test": { id: "claude-test" } },
    },
  }), { status: 200 }),
});
const compatibleDirectoryEntry = directory.providers.find((provider) => provider.id === "compatible-provider");
const nativeDirectoryEntry = directory.providers.find((provider) => provider.id === "anthropic");
if (!compatibleDirectoryEntry?.connectable || compatibleDirectoryEntry.defaultBaseUrl !== "https://compatible.example/v1") {
  throw new Error("Un provider OpenAI-compatible del directorio debe poder crear una conexión genérica");
}
if (nativeDirectoryEntry?.connectable || nativeDirectoryEntry?.availability !== "adapter-required") {
  throw new Error("Un provider de protocolo nativo debe mostrarse sin prometer soporte inexistente");
}

const dynamicCompatible = await parseRequestProvider({
  ...base,
  adapter: "compatible-provider",
  catalogProvider: "compatible-provider",
  label: "Compatible Provider",
  baseUrl: "https://compatible.example/v1",
  model: "model-one",
});
if (dynamicCompatible.adapter !== "compatible-provider" || dynamicCompatible.catalogProvider !== "compatible-provider") {
  throw new Error("Los providers compatibles detectados deben conservar su id para el catálogo de modelos");
}

const originalFetch = globalThis.fetch;
let probeBody = null;
globalThis.fetch = async (_url, init) => {
  probeBody = JSON.parse(init.body);
  return new Response(JSON.stringify({ choices: [{ message: { content: "OK" } }] }), { status: 200 });
};
try {
  const probe = await probeProvider({
    baseUrl: "https://provider.example/v1",
    apiKey: "test-key",
    model: "test-model",
  });
  if (!probe.reachable || probeBody?.messages?.[0]?.content !== "Respondé solamente OK.") {
    throw new Error("La prueba debe usar una inferencia mínima y no contenido de estudio");
  }
} finally {
  globalThis.fetch = originalFetch;
}

console.log("Provider contract OK: perfiles, presets, catálogo y prueba de inferencia.");
