// server/tests/ping-models.mjs — ping cada modelo con un prompt corto
import dotenv from "dotenv";
import { chatCompletion } from "../ai/llmClient.js";

dotenv.config();

const MODELS = [
  "auto",
  "minimax-m3",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "deepseek-v4-flash",
  "step-3.7-flash",
  "mimo-v2.5",
  "llama-3.1-70b",
  "llama-3.3-70b",
];

const PROMPT = 'Respondé exactamente con este JSON sin nada más: {"ok":true}';

const results = [];
for (const model of MODELS) {
  const t0 = Date.now();
  try {
    const r = await chatCompletion({
      baseUrl: process.env.FREELLMAPI_BASE_URL,
      apiKey: process.env.FREELLMAPI_API_KEY,
      model,
      messages: [{ role: "user", content: PROMPT }],
      responseFormat: { type: "json_object" },
      timeoutMs: 30000,
      maxAttempts: 1,
    });
    const elapsed = Date.now() - t0;
    const content = r.choices?.[0]?.message?.content?.slice(0, 50) ?? "(empty)";
    results.push({ model, ok: true, ms: elapsed, content });
  } catch (e) {
    const elapsed = Date.now() - t0;
    results.push({ model, ok: false, ms: elapsed, error: `${e.code}: ${e.message.slice(0, 80)}` });
  }
}

console.log("\n=== Resultados ===");
for (const r of results) {
  if (r.ok) {
    console.log(`✓ ${r.model.padEnd(28)} ${(r.ms / 1000).toFixed(1)}s — ${r.content}`);
  } else {
    console.log(`✗ ${r.model.padEnd(28)} ${(r.ms / 1000).toFixed(1)}s — ${r.error}`);
  }
}

// Top 3 más rápidos que funcionaron
const ok = results.filter(r => r.ok).sort((a, b) => a.ms - b.ms);
console.log("\n=== Top 3 más rápidos ===");
ok.slice(0, 3).forEach(r => console.log(`  ${r.model.padEnd(28)} ${(r.ms / 1000).toFixed(1)}s`));
