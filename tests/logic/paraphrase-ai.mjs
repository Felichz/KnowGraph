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
// Test Reconcile Chat Schema, Prompt and Hash
const { buildReconcileChatUserPayload } = await import("../../server/ai/schemas.js");
const { RECONCILE_CHAT_SYSTEM_PROMPT } = await import("../../server/ai/prompts.js");
const { hashReconcileInput } = await import("../../src/ai/contentHash.js");

const chatMessages = [
  { id: "m1", role: "user", content: "¿Por qué se cancela la request con AbortController?" },
  { id: "m2", role: "assistant", content: "Porque si el usuario cambia de tab o parámetros rápido, la respuesta anterior puede llegar más tarde y pisar el estado con datos viejos." },
];

const reconcilePayload = buildReconcileChatUserPayload({
  node: sampleNode,
  currentDraft: "useEffect sirve para sincronizar datos con el servidor.",
  messages: chatMessages,
});

assert.ok(reconcilePayload.includes("CONCEPTO: useEffect"));
assert.ok(reconcilePayload.includes("BORRADOR ACTUAL DEL ESTUDIANTE:"));
assert.ok(reconcilePayload.includes("CONVERSACIÓN DEL CHAT CON EL COACH"));
assert.ok(reconcilePayload.includes("¿Por qué se cancela la request con AbortController?"));
assert.ok(reconcilePayload.includes("AbortController"));
assert.ok(RECONCILE_CHAT_SYSTEM_PROMPT.includes("REGLAS DE RECONCILIACIÓN (SKILL V5)"));
assert.ok(RECONCILE_CHAT_SYSTEM_PROMPT.includes("DETECCIÓN E INTEGRACIÓN DE NOVEDADES DEL CHAT"));
assert.ok(RECONCILE_CHAT_SYSTEM_PROMPT.includes("SI NO HAY NADA NUEVO QUE AGREGAR"));

// Test Reconcile Hash Stability
const hash1 = hashReconcileInput("Borrador 1", chatMessages);
const hash2 = hashReconcileInput("Borrador 1", chatMessages);
const hashDiffDraft = hashReconcileInput("Borrador 2", chatMessages);
const hashDiffMessages = hashReconcileInput("Borrador 1", [...chatMessages, { id: "m3", role: "user", content: "Otra duda" }]);

assert.equal(hash1, hash2, "El hash debe ser determinista para el mismo draft y mensajes");
assert.notEqual(hash1, hashDiffDraft, "Cambiar el borrador debe invalidar el hash previo");
assert.notEqual(hash1, hashDiffMessages, "Agregar un mensaje al chat debe invalidar el hash previo");

// Test Polish Pedagogy Schema and Prompt
const { buildPolishPedagogyUserPayload } = await import("../../server/ai/schemas.js");
const { POLISH_PEDAGOGY_SYSTEM_PROMPT } = await import("../../server/ai/prompts.js");

const polishPayload = buildPolishPedagogyUserPayload({
  node: sampleNode,
  currentDraft: "La autenticación en una arquitectura React + API no es un monolito, sino un reparto...",
});

assert.ok(polishPayload.includes("TEMA: useEffect"));
assert.ok(polishPayload.includes("TEXTO ACTUAL A TRANSFORMAR:"));
assert.ok(POLISH_PEDAGOGY_SYSTEM_PROMPT.includes("MAESTRÍA PEDAGÓGICA"));
assert.ok(POLISH_PEDAGOGY_SYSTEM_PROMPT.includes("PROGRESIÓN COGNITIVA"));
assert.ok(POLISH_PEDAGOGY_SYSTEM_PROMPT.includes("DILUCIÓN DE JERGA"));
assert.ok(POLISH_PEDAGOGY_SYSTEM_PROMPT.includes("CAUSALIDAD TRANSPARENTE"));

console.log("paraphrase AI schemas & prompts: OK");


