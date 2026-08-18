import assert from "node:assert/strict";
import { buildIncorporateFocusUserPayload, buildParaphraseUserPayload } from "../../server/ai/schemas.js";
import { INCORPORATE_FOCUS_SYSTEM_PROMPT, PARAPHRASE_SYSTEM_PROMPT } from "../../server/ai/prompts.js";

// Test Paraphrase Prompt and Schema
const sampleNode = {
  id: "use-effect",
  label: "useEffect",
  lesson: {
    summary: "Sincroniza un componente con un sistema externo.",
    why: "Evita memory leaks y side-effects descontrolados.",
    explanation: "Se ejecuta después del render y limpia con la función de retorno.",
    code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
    codeLabel: "Cleanup pattern",
    takeaway: "Siempre limpiar suscripciones y declarar todas las dependencias.",
    pitfalls: ["Olvidar dependencias produce stale closures."],
  },
};

const payload = buildParaphraseUserPayload({ node: sampleNode });
assert.ok(payload.includes("TÍTULO DEL CONCEPTO: useEffect"));
assert.ok(payload.includes("Sincroniza un componente"));
assert.ok(payload.includes("Cleanup pattern"));
assert.ok(PARAPHRASE_SYSTEM_PROMPT.includes("PARAFRASEO PEDAGÓGICO FLUIDO"));

// Test Incorporate Focus Schema and Prompt
const improvePayload = buildIncorporateFocusUserPayload({
  node: sampleNode,
  currentDraft: "useEffect sirve para ejecutar efectos secundarios en React.",
  focusTitle: "Función de cleanup y memory leaks",
  focusDetail: "Si no retornás una función de limpieza, suscripciones e intervalos quedan vivos en memoria al desmontar el componente.",
});

assert.ok(improvePayload.includes("CONCEPTO: useEffect"));
assert.ok(improvePayload.includes("BORRADOR ACTUAL DEL ESTUDIANTE:"));
assert.ok(improvePayload.includes("Función de cleanup y memory leaks"));
assert.ok(INCORPORATE_FOCUS_SYSTEM_PROMPT.includes("REGLAS DE TRANSFORMACIÓN PEDAGÓGICA"));
assert.ok(INCORPORATE_FOCUS_SYSTEM_PROMPT.includes("MANTENER LA BASE EXISTENTE"));

console.log("paraphrase AI schemas & prompts: OK");
