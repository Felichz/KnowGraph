// Benchmark de modelos para evaluación de parafraseo.
// Mide: latencia, score, status, repair attempts, calidad del feedback, adherencia al prompt.
// Uso: node tests/benchmark-models.mjs

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
  { id: "auto:smart", label: "auto:smart" },
  { id: "deepseek-v4-pro", label: "deepseek-v4-pro" },
  { id: "deepseek-v4-flash", label: "deepseek-v4-flash" },
  { id: "gemini-3-flash-preview", label: "gemini-3-flash-preview" },
  { id: "gemini-3.5-flash", label: "gemini-3.5-flash" },
  { id: "gemini-2.5-flash", label: "gemini-2.5-flash" },
];

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

// El mismo paraphrase para todos: explica snapshot bien, pero omite el pitfall de mutación,
// y mete tema de optimización de referencias que no estaba en la card.
const learnerAnswer = "React calcula cada render a partir de un snapshot inmutable del estado y las props. Si el estado cambia, React programa un nuevo render; el snapshot anterior no se muta. Esto permite comparar referencias y cortar renders innecesarios con React.memo o shouldComponentUpdate.";

const results = [];

for (const m of MODELS) {
  const t0 = Date.now();
  let result = { model: m.id, error: "unknown" };
  try {
    const raw = await chatCompletion({
      baseUrl: config.freellmapiBaseUrl,
      apiKey: config.freellmapiApiKey,
      model: m.id,
      messages: [
        { role: "system", content: EVALUATOR_SYSTEM_PROMPT },
        { role: "user", content: buildEvaluationUserPayload({ node, learnerAnswer }) },
      ],
      responseFormat: {
        type: "json_schema",
        json_schema: { name: "evaluation", schema: EvaluationJsonSchema, strict: true },
      },
      signal: undefined,
      timeoutMs: 90_000,
    });

    const { data, attempts } = await parseStructuredResponse({
      raw,
      schema: EvaluationZod,
      repair: async ({ badOutput }) => {
        const fix = await chatCompletion({
          baseUrl: config.freellmapiBaseUrl,
          apiKey: config.freellmapiApiKey,
          model: m.id,
          messages: [
            { role: "system", content: "Devolvé únicamente el JSON correcto del schema. Sin explicaciones." },
            { role: "user", content: `JSON a reparar:\n${badOutput}` },
          ],
          responseFormat: { type: "json_object" },
          timeoutMs: 30_000,
        });
        return fix?.choices?.[0]?.message?.content ?? "";
      },
    });

    const score = computeTotal(data.rubric);
    result = {
      model: m.id,
      routedTo: raw.model ?? m.id,
      latencyMs: Date.now() - t0,
      ok: true,
      score,
      status: statusFromScore(score),
      rubric: data.rubric,
      strengthsCount: data.strengths.length,
      gapsCount: data.gaps.length,
      misconceptionsCount: data.misconceptions.length,
      repairAttempts: attempts,
      nextAttemptPrompt: data.nextAttemptPrompt,
      conciseVerdict: data.conciseVerdict,
      flaggedExternalKnowledge: data.gaps.concat(data.misconceptions).some((x) => /memo|shouldComponentUpdate|optimizaci[oó]n/i.test(x.explanation ?? "") || /memo|shouldComponentUpdate|optimizaci[oó]n/i.test(x.correction ?? "")),
    };
  } catch (e) {
    result = {
      model: m.id,
      latencyMs: Date.now() - t0,
      ok: false,
      error: e.code ?? "error",
      errorMessage: e.message,
    };
  }
  results.push(result);
  console.log(`${result.ok ? "✓" : "✗"} ${m.label.padEnd(28)} ${String(result.latencyMs).padStart(6)}ms  ${result.ok ? `score=${result.score} status=${result.status}` : `error=${result.error}`}`);
}

console.log("\n" + "=".repeat(80));
console.log("RESUMEN");
console.log("=".repeat(80));

const ok = results.filter((r) => r.ok);
if (!ok.length) {
  console.log("Ningún modelo respondió OK.");
  process.exit(1);
}

console.log("\nPor score (mayor = mejor feedback):");
ok.sort((a, b) => b.score - a.score);
for (const r of ok) {
  console.log(`  ${r.model.padEnd(28)} ${String(r.score).padStart(3)}/100  ${r.status.padEnd(11)}  strengths=${r.strengthsCount}  gaps=${r.gapsCount}  misc=${r.misconceptionsCount}  repair=${r.repairAttempts}`);
}

console.log("\nPor latencia (menor = más rápido):");
ok.sort((a, b) => a.latencyMs - b.latencyMs);
for (const r of ok) {
  console.log(`  ${r.model.padEnd(28)} ${String(r.latencyMs).padStart(6)}ms  → ${r.routedTo}`);
}

console.log("\nAdherencia al prompt (debe marcar la omisión del pitfall de mutación):");
for (const r of ok) {
  const notes = Object.values(r.rubric).map((d) => d.note).join(" ");
  const allText = (r.nextAttemptPrompt ?? "") + " " + (r.conciseVerdict ?? "") + " " + notes;
  const mentionsMutation = /mutaci[oó]n|mutar/i.test(allText);
  const leaksExternal = /react\.memo|shouldComponentUpdate/i.test(allText) && !/no estaba|no figura|fuera de|optimizaci[oó]n no (estaba|incluida)/i.test(allText);
  console.log(`  ${r.model.padEnd(28)} mencionaMutación=${mentionsMutation}  leaksExternos=${leaksExternal}`);
}

console.log("\n" + "=".repeat(80));
console.log("FEEDBACK COMPLETO POR MODELO");
console.log("=".repeat(80));
for (const r of ok) {
  console.log(`\n── ${r.model} (routed: ${r.routedTo}) ── score=${r.score} ${r.status}`);
  console.log(`  strengths: ${r.strengthsCount}, gaps: ${r.gapsCount}, misconceptions: ${r.misconceptionsCount}`);
  console.log(`  verdict: ${r.conciseVerdict}`);
  console.log(`  next: ${r.nextAttemptPrompt}`);
}
