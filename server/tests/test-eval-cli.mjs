// tests/test-eval-cli.mjs — CLI helper para probar modelos vía env var
import { evaluateParaphrase } from "../ai/evaluator.js";

const NODE = {
  id: "js_basics", label: "Conceptos clave de JS para React",
  lesson: { summary: "Closures, módulos, promesas e inmutabilidad.", why: "Bases del código React moderno.", explanation: "Closures conservan scope. Promises representan trabajo futuro. Inmutabilidad: React detecta cambios por referencia (Object.is).", steps: [], pitfalls: [] },
};

const LONG_TEXT = "Algunos de los conceptos mas importantes de javascript moderno relevantes en React son modulos, closures, inmutabilidad, y promesas. Los closures son funciones que conservan el acceso al scope donde fueron creadas. La inmutabilidad sirve para que React pueda detectar cambios cuando cambia la referencia, hay que usar spread para crear nuevos arrays/objetos. React usa Object.is para comparar referencias. Spread es shallow copy. Las promesas sirven para ejecutar código asíncrono, async/await es sugar syntax. Los modulos son la manera actual de trabajar con javascript moderno, se importan con import/export.";

try {
  const r = await evaluateParaphrase({ node: NODE, learnerAnswer: LONG_TEXT, contentHash: "x" });
  console.log(`SCORE=${r.evaluation.score} STATUS=${r.evaluation.status} MODEL=${r.model} TIME=${Date.now()}`);
  process.exit(0);
} catch (e) {
  console.log(`CODE=${e.code} MSG=${e.message}`);
  process.exit(1);
}
