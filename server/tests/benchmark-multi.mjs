// Benchmark con múltiples runs para tener varianza.
// 3 modelos x 3 runs = 9 evaluaciones, mismo prompt.

import { config } from "../config.js";
import { chatCompletion } from "../ai/llmClient.js";
import { parseStructuredResponse } from "../ai/parse.js";
import {
  EvaluationZod,
  EvaluationJsonSchema,
  buildEvaluationUserPayload,
  computeTotal,
  statusFromScore,
} from "../ai/schemas.js";
import { EVALUATOR_SYSTEM_PROMPT } from "../ai/prompts.js";

const MODELS = [
  "minimaxai/minimax-m3",
  "auto:smart",
  "deepseek-v4-pro",
  "deepseek-v4-flash",
];

const RUNS = 3;

const node = {
  id: "state_updates",
  label: "Estado, snapshots y batching",
  lesson: {
    summary: "React mantiene un snapshot inmutable del estado por render. Los updates se aplican al final del evento y disparan un re-render.",
    why: "Es la base del modelo mental de React y explica por qué usar el valor del estado dentro del mismo handler puede dar resultados raros.",
    explanation: "En cada render React toma una foto del estado. Si llamás a setState varias veces, los updates se acumulan y se aplican juntos. El nuevo render ve los nuevos valores.",
    steps: [
      "Pensá en el estado como un valor del render actual",
      "Los updates se aplican en el próximo render, no en el actual",
      "Comparar referencias sirve para optimizar renders",
    ],
    pitfalls: [
      "Mutar el estado directamente en vez de crear uno nuevo",
      "Leer el estado inmediatamente después de setState esperando el nuevo valor",
    ],
  },
};

const learnerAnswer = "React calcula cada render a partir de un snapshot inmutable del estado y las props. Si el estado cambia, React programa un nuevo render; el snapshot anterior no se muta. Esto permite comparar referencias y cortar renders innecesarios con React.memo o shouldComponentUpdate.";

const allResults = [];

for (const model of MODELS) {
  console.log(`\n=== ${model} (${RUNS} runs) ===`);
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const t0 = Date.now();
    try {
      const raw = await chatCompletion({
        baseUrl: config.freellmapiBaseUrl,
        apiKey: config.freellmapiApiKey,
        model,
        messages: [
          { role: "system", content: EVALUATOR_SYSTEM_PROMPT },
          { role: "user", content: buildEvaluationUserPayload({ node, learnerAnswer }) },
        ],
        responseFormat: {
          type: "json_schema",
          json_schema: { name: "evaluation", schema: EvaluationJsonSchema, strict: true },
        },
        timeoutMs: 90_000,
      });

      const { data, attempts } = await parseStructuredResponse({
        raw,
        schema: EvaluationZod,
        repair: async () => "",
      });

      const score = computeTotal(data.rubric);
      const latency = Date.now() - t0;
      const routedTo = raw.model ?? model;
      console.log(`  run ${i + 1}: ${latency}ms score=${score} → ${routedTo}`);
      runs.push({ model, routedTo, score, latency, repairAttempts: attempts });
    } catch (e) {
      const latency = Date.now() - t0;
      console.log(`  run ${i + 1}: ERROR en ${latency}ms — ${e.code} ${e.message.slice(0, 100)}`);
      runs.push({ model, error: e.code, latency });
    }
  }
  allResults.push(...runs);
}

console.log("\n" + "=".repeat(80));
console.log("ESTADÍSTICAS");
console.log("=".repeat(80));

for (const model of MODELS) {
  const ok = allResults.filter((r) => r.model === model && !r.error);
  if (!ok.length) {
    console.log(`\n${model}: 0 runs OK`);
    continue;
  }
  const scores = ok.map((r) => r.score);
  const latencies = ok.map((r) => r.latency);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const stdev = (arr) => {
    const m = avg(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  };
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const routedTo = ok.map((r) => r.routedTo);
  const uniqueRoutes = [...new Set(routedTo)];
  console.log(`\n${model}`);
  console.log(`  routed to: ${uniqueRoutes.join(", ")}`);
  console.log(`  score: avg=${avg(scores).toFixed(1)} stdev=${stdev(scores).toFixed(1)} min=${min} max=${max} (n=${ok.length})`);
  console.log(`  latency: avg=${avg(latencies).toFixed(0)}ms min=${Math.min(...latencies)}ms max=${Math.max(...latencies)}ms`);
  console.log(`  scores: [${scores.join(", ")}]`);
}
