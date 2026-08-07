// Smoke test real contra FreeLLMAPI.
// Ejecutar con el .env ya configurado: node tests/smoke-real.mjs

import { config } from "../config.js";
import { chatCompletion } from "../ai/llmClient.js";
import { evaluateParaphrase } from "../ai/evaluator.js";

console.log("Upstream:", config.freellmapiBaseUrl);
console.log("Evaluation model:", config.evaluationModel);

// Test 1: chatCompletion simple
console.log("\n=== Test 1: chatCompletion con gemini-2.5-flash-lite ===");
const t0 = Date.now();
try {
  const result = await chatCompletion({
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model: "gemini-2.5-flash-lite",
    messages: [
      { role: "user", content: 'Devolvé exactamente {"ok":true} y nada más.' },
    ],
    responseFormat: { type: "json_object" },
    timeoutMs: 30_000,
  });
  console.log(`OK en ${Date.now() - t0}ms — modelo: ${result.model}`);
  console.log("Content:", result.choices?.[0]?.message?.content);
} catch (e) {
  console.log(`ERROR en ${Date.now() - t0}ms: ${e.code} — ${e.message}`);
}

// Test 2: chatCompletion con auto:smart
console.log("\n=== Test 2: chatCompletion con auto:smart ===");
const t1 = Date.now();
try {
  const result = await chatCompletion({
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model: "auto:smart",
    messages: [
      { role: "user", content: 'Devolvé exactamente {"ok":true} y nada más.' },
    ],
    responseFormat: { type: "json_object" },
    timeoutMs: 60_000,
  });
  console.log(`OK en ${Date.now() - t1}ms — modelo: ${result.model}`);
  console.log("Content:", result.choices?.[0]?.message?.content);
} catch (e) {
  console.log(`ERROR en ${Date.now() - t1}ms: ${e.code} — ${e.message}`);
}

// Test 3: evaluateParaphrase completo
console.log("\n=== Test 3: evaluateParaphrase (con json_schema strict) ===");
const t2 = Date.now();
try {
  const result = await evaluateParaphrase({
    node: {
      id: "state_updates",
      label: "Estado, snapshots y batching",
      lesson: {
        summary: "React mantiene un snapshot inmutable del estado por render.",
        why: "Base del modelo mental de React.",
        explanation: "En cada render React toma una foto del estado.",
        steps: ["El estado es un valor del render actual", "Los updates se aplican en el próximo render"],
        pitfalls: ["Mutar el estado directamente"],
      },
    },
    learnerAnswer: "React calcula cada render a partir de un snapshot inmutable del estado. Si cambia, programa un nuevo render con los nuevos valores. Esto permite cortar renders innecesarios comparando referencias.",
    contentHash: "sha256:test",
  });
  console.log(`OK en ${Date.now() - t2}ms`);
  console.log("Score:", result.evaluation.score, result.evaluation.status);
  console.log(JSON.stringify(result.evaluation, null, 2));
  console.log("Repair attempts:", result.repairAttempts);
} catch (e) {
  console.log(`ERROR en ${Date.now() - t2}ms: ${e.code} — ${e.message}`);
  if (e.details) console.log("Details:", JSON.stringify(e.details).slice(0, 300));
}

// Test 4: chatCompletion con deepseek-v4-pro directo (el que usa auto:smart)
console.log("\n=== Test 4: deepseek-v4-pro directo con json_object ===");
const t3 = Date.now();
try {
  const result = await chatCompletion({
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model: "deepseek-v4-pro",
    messages: [
      { role: "system", content: "Devolvé JSON con este schema: { score: number 0-100, summary: string }" },
      { role: "user", content: "Devolvé {\"score\": 85, \"summary\": \"ok\"}" },
    ],
    responseFormat: { type: "json_object" },
    timeoutMs: 60_000,
  });
  console.log(`OK en ${Date.now() - t3}ms — modelo: ${result.model}`);
  console.log("Content:", result.choices?.[0]?.message?.content);
} catch (e) {
  console.log(`ERROR en ${Date.now() - t3}ms: ${e.code} — ${e.message}`);
}
