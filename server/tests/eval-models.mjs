// server/tests/eval-models.mjs — evalúa con prompt largo en varios modelos
import dotenv from "dotenv";
dotenv.config();
import { chatCompletion } from "../ai/llmClient.js";
import { parseStructuredResponse } from "../ai/parse.js";
import { EvaluationZod, EvaluationJsonSchema, buildEvaluationUserPayload, computeTotal, statusFromScore } from "../ai/schemas.js";
import { EVALUATOR_SYSTEM_PROMPT } from "../ai/prompts.js";

const PARAPHRASE = `Algunos de los conceptos mas importantes de javascript moderno relevantes en React son modulos, closures, inmutabilidad, y promesas. Los closures son funciones que conservan el acceso al scope donde fueron creadas, aun si son ejecutadas despues en otro contexto, como event handlers y callbacks, esto significa que pueden acceder a todas las variables de su scope padre como state y props. La inmutabilidad sirve para que React pueda detectar cambios cuando cambia la referencia de alguna variable/objeto, hay que tener cuidado con eso en los array de dependencias para evitar re-renders innecesarios, un ejemplo seria setProducts([...products, newProduct]) lo cual asignaria un nuevo objeto con una nueva referencia al state de productos. Las promesas sirven para ejecutar código asíncrono, async/await es sugar syntax. Los modulos son la manera actual de trabajar con javascript moderno, se importan con import/export en todos los archivos.`;

const NODE = {
  id: "js_basics", label: "Conceptos clave de JS para React",
  lesson: {
    summary: "Closures, módulos, promesas e inmutabilidad, aplicados al modelo de React.",
    why: "Son las bases que aparecen en casi todo el código React moderno.",
    explanation: "Closures permiten que handlers y callbacks conserven el scope donde se crearon. Promises representan trabajo futuro y se consumen con then/catch o async/await. La inmutabilidad es central: React detecta cambios comparando referencias (Object.is), por lo que hay que crear nuevos arrays/objetos en lugar de mutar los existentes.",
    steps: [
      "Una closure 'recuerda' el scope donde fue creada",
      "Una Promise representa un valor futuro; await pausa solo esa función",
      "Crear un array/objeto nuevo cambia la referencia y dispara re-render",
      "Spread {...obj} es shallow copy",
      "import/export organizan el código en módulos",
    ],
    pitfalls: [
      "Mutar el state directamente",
      "Asumir que spread copia profundo",
      "Creer que await bloquea el event loop del navegador",
    ],
  },
};

const MODELS = ["step-3.7-flash", "gemini-3-flash-preview", "llama-3.1-70b", "minimax-m3", "auto"];

async function evaluateWith(model) {
  const t0 = Date.now();
  try {
    const raw = await chatCompletion({
      baseUrl: process.env.FREELLMAPI_BASE_URL,
      apiKey: process.env.FREELLMAPI_API_KEY,
      model,
      messages: [
        { role: "system", content: EVALUATOR_SYSTEM_PROMPT },
        { role: "user", content: buildEvaluationUserPayload({ node: NODE, learnerAnswer: PARAPHRASE }) },
      ],
      responseFormat: { type: "json_schema", json_schema: { name: "evaluation", schema: EvaluationJsonSchema, strict: false } },
      timeoutMs: 55000,
      maxAttempts: 1,
    });
    const { data } = await parseStructuredResponse({ raw, schema: EvaluationZod, repair: async () => "" });
    const score = computeTotal(data.rubric);
    return { ok: true, ms: Date.now() - t0, score, status: statusFromScore(score), model: raw.model };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, error: `${e.code}: ${e.message.slice(0, 80)}` };
  }
}

const results = [];
for (const m of MODELS) {
  const r = await evaluateWith(m);
  results.push({ model: m, ...r });
  const status = r.ok ? `score=${r.score} ${r.status}` : `ERR ${r.error}`;
  console.log(`${r.ok ? "✓" : "✗"} ${m.padEnd(28)} ${(r.ms / 1000).toFixed(1)}s — ${status}`);
}

console.log("\n=== Top más rápidos que funcionaron ===");
results.filter(r => r.ok).sort((a, b) => a.ms - b.ms).slice(0, 5).forEach(r => {
  console.log(`  ${r.model.padEnd(28)} ${(r.ms / 1000).toFixed(1)}s — score=${r.score}`);
});
