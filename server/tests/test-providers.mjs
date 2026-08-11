// Test del contrato de provider. No requiere una API key real ni red.
// Ejecutar: node test-providers.mjs

process.env.ALLOW_PRIVATE_PROVIDER_URLS = "true";

const { parseRequestProvider } = await import("../ai/providers.js");

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

console.log("Provider contract OK: id vacío y provider sin id son válidos.");
