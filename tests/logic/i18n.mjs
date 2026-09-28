// i18n: locale store, catalogs, localized curriculum, controller locale and the gateway's locale contract.
import assert from "node:assert/strict";

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
};

const { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, getLocale, setLocale, subscribeLocale } = await import("../../src/i18n/locale.js");
const { translate } = await import("../../src/i18n/translate.js");
const { MESSAGES } = await import("../../src/i18n/messages/index.js");
const { getGraph, listGraphs } = await import("../../src/logic/graphRegistry.js");
const { hashCardContent } = await import("../../src/ai/contentHash.js");
const { getLessonContext } = await import("../../src/logic/guidance.js");
const { createLearningController } = await import("../../src/logic/learningController.js");

// Locale store: English on first visit, choice persisted, invalid values ignored.
assert.equal(DEFAULT_LOCALE, "en");
assert.equal(getLocale(), "en");
const seen = [];
const unsubscribe = subscribeLocale((locale) => seen.push(locale));
setLocale("es");
assert.equal(getLocale(), "es");
assert.equal(memory.get(LOCALE_STORAGE_KEY), "es");
setLocale("fr");
assert.equal(getLocale(), "es");
setLocale("en");
unsubscribe();
assert.deepEqual(seen, ["es", "en"]);

// Catalogs: same keys, interpolation, plural functions.
const keys = (tree, prefix = "") => Object.entries(tree).flatMap(([key, value]) => (
  value && typeof value === "object" ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
)).sort();
assert.deepEqual(keys(MESSAGES.en), keys(MESSAGES.es));
assert.equal(translate("en", "common.stages.read"), "Read");
assert.equal(translate("es", "common.stages.read"), "Leer");
assert.equal(translate("en", "common.scoreOf", { score: 85, max: 120 }), "85 of 120");
assert.equal(translate("es", "common.status.unscored"), "Sin evaluar");
assert.equal(translate("en", "missing.key"), "missing.key");

// Curriculum: text differs per locale, structure and ids are shared.
for (const graphId of ["react", "rails"]) {
  const en = getGraph(graphId, "en");
  const es = getGraph(graphId, "es");
  assert.equal(en.locale, "en");
  assert.equal(es.locale, "es");
  assert.deepEqual(en.nodes.map((node) => node.id), es.nodes.map((node) => node.id));
  assert.deepEqual(en.edges, es.edges);
  assert.deepEqual(Object.keys(en.categories), Object.keys(es.categories));
  en.nodes.forEach((node, index) => {
    const base = es.nodes[index];
    assert.deepEqual(node.prerequisites, base.prerequisites);
    assert.equal(node.priority, base.priority);
    assert.equal(node.cat, base.cat);
    // Attempts stay valid across languages: the hash is always the authored (Spanish) one.
    assert.equal(node.contentHash, base.contentHash);
    assert.equal(hashCardContent(node), hashCardContent({ ...base, contentHash: undefined }));
    assert.equal(node.lesson.steps.length, base.lesson.steps.length);
    assert.equal(node.lesson.sources?.[0]?.href, base.lesson.sources?.[0]?.href);
  });
}
const reactEn = getGraph("react", "en");
const reactEs = getGraph("react", "es");
assert.equal(reactEs.nodes.find((node) => node.id === "react_mental_model").label, "Modelo mental: UI como función del estado");
assert.equal(reactEn.nodes.find((node) => node.id === "react_mental_model").label, "Mental model: UI as a function of state");
assert.equal(reactEs.categories.state.label, "Estado & datos");
assert.equal(reactEn.categories.state.label, "State & data");
assert.equal(reactEn.seniorityBands[0].label, "Professional React");
assert.ok(reactEn.nodes.every((node) => node.interviewQuestions.every((q) => !/[¿¡]/.test(q.title))));
assert.equal(listGraphs("es")[0].label, "React entrevistas");
assert.equal(getGraph("react").locale, "en");

// Context sentences follow the locale.
const node = reactEn.nodes.find((item) => item.id === "js_basics");
assert.match(getLessonContext(node, [], [], {}, "en"), /starting point/);
assert.match(getLessonContext(node, [], [], {}, "es"), /punto de partida/);

// Controller: switching language keeps selection and sends the locale with evaluations.
let sentLocale = null;
const storage = {
  getDraft: async () => "", setDraft: async () => {}, deleteDraft: async () => {},
  listAttempts: async () => [], listAllAttempts: async () => [], saveAttempt: async () => {},
};
const ai = {
  isCancel: () => false,
  evaluateParaphraseStream: async ({ locale, graphId, nodeId }) => {
    sentLocale = locale;
    return { attempt: { id: "a1", graphId, nodeId, evaluation: null } };
  },
};
const controller = createLearningController({ graphId: "react", storage, ai });
assert.equal(controller.getSnapshot().locale, "en");
controller.selectNode("state_updates");
controller.setLocale("es");
const snapshot = controller.getSnapshot();
assert.equal(snapshot.selectedNodeId, "state_updates");
assert.equal(snapshot.selectedNode.label, "Estado, snapshots y batching");
await controller.submitParaphrase("state_updates", "texto");
assert.equal(sentLocale, "es");
controller.setLocale("en");
assert.equal(controller.getSnapshot().graph.label, "React interviews");
controller.destroy();

// Gateway contract: locale is validated, absent means Spanish, prompts and payloads follow it.
const { parseLocale } = await import("../../server/ai/locale.js");
const { promptFor } = await import("../../server/ai/prompts.js");
const { buildParaphraseUserPayload } = await import("../../server/ai/schemas.js");
const { jsonErrorResponse, GatewayError, ErrorCodes } = await import("../../server/ai/errors.js");
assert.equal(parseLocale(undefined), "es");
assert.equal(parseLocale("en"), "en");
assert.throws(() => parseLocale("fr"), /locale must be one of/);
for (const name of ["EVALUATOR_SCORING_SYSTEM_PROMPT", "EVALUATOR_FEEDBACK_SYSTEM_PROMPT", "PARAPHRASE_SYSTEM_PROMPT", "SOCRATIC_MENTOR_SYSTEM_PROMPT", "PEDAGOGICAL_JUDGE_SYSTEM_PROMPT"]) {
  assert.ok(promptFor(name, "en").length > 100, name);
  assert.doesNotMatch(promptFor(name, "en"), /[áéíóúñ¿¡]/, name);
  assert.notEqual(promptFor(name, "en"), promptFor(name, "es"), name);
}
assert.match(promptFor("EVALUATOR_SYSTEM_PROMPT", "es"), /español rioplatense/);
assert.match(promptFor("LIVE_REVIEW_SYSTEM_PROMPT", "en", "fallback"), /English/);
assert.match(buildParaphraseUserPayload({ node: reactEn.nodes[0], locale: "en" }), /^CONCEPT TITLE: /);
assert.match(buildParaphraseUserPayload({ node: reactEs.nodes[0] }), /^TÍTULO DEL CONCEPTO: /);
const missing = new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
assert.equal(jsonErrorResponse(missing, "en").body.message, "The card content (node) is missing");
assert.equal(jsonErrorResponse(missing).body.message, "Falta el contenido de la card (node)");

console.log("i18n: OK");
