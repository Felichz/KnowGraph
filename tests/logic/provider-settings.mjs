import assert from "node:assert/strict";

const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
  sessionStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
};

storage.set("learning-workspace:provider-profiles:v3", JSON.stringify({
  version: 3,
  activeAdapter: "minimax",
  profiles: {
    openai: { id: "provider_default", label: "OpenAI compatible", adapter: "openai", baseUrl: "https://gateway.example/v1", apiKey: "custom-key", model: "model-a" },
    minimax: { id: "provider_default", label: "MiniMax", adapter: "minimax", baseUrl: "https://api.minimax.io/v1", apiKey: "minimax-key", model: "MiniMax-M3" },
  },
}));

const {
  createProviderDraft,
  loadProviderSettings,
  loadProviderProfile,
  removeProviderProfile,
  saveProviderProfile,
  setActiveProviderProfile,
} = await import("../../src/ai/providerSettings.js");

const migrated = await loadProviderSettings();
assert.equal(migrated.version, 4, "La configuración v3 debe migrar a v4");
assert.equal(migrated.profiles.length, 2, "La migración debe conservar cada conexión anterior");
assert.equal(migrated.profiles.find((profile) => profile.label === "OpenAI compatible")?.adapter, "custom", "El escape hatch anterior debe conservar su semántica");
assert.equal((await loadProviderProfile())?.adapter, "minimax", "La conexión activa anterior debe mantenerse");

const groq = createProviderDraft("groq");
const savedGroq = await saveProviderProfile({ ...groq, apiKey: "groq-key", model: "llama-3.3-70b-versatile" }, { activate: false });
const afterSave = await loadProviderSettings();
assert.equal(afterSave.profiles.length, 3, "Deben poder coexistir varias conexiones del mismo workspace");
assert.equal((await loadProviderProfile())?.adapter, "minimax", "Guardar una conexión secundaria no debe cambiar la activa");

await setActiveProviderProfile(savedGroq.id);
assert.equal((await loadProviderProfile())?.id, savedGroq.id, "Activar una conexión debe cambiar solo el perfil activo");

await removeProviderProfile(savedGroq.id);
assert.equal(await loadProviderProfile(), null, "Eliminar la conexión activa debe volver al provider del gateway");

console.log("Provider settings OK: migración v3, conexiones múltiples y selección activa.");
