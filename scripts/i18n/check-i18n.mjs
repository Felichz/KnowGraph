// i18n parity check. Fails when:
//  - UI message catalogs for en and es do not have the same keys or interpolation params;
//  - a curriculum overlay is missing a concept, a text field, an array item, or has extra ones;
//  - a translation is stale (the Spanish text changed after it was translated);
//  - a translated string still looks like Spanish.
// Usage: node scripts/i18n/check-i18n.mjs            (everything)
//        node scripts/i18n/check-i18n.mjs --file <overlay chunk>   (one content file only)
import path from "node:path";
import { pathToFileURL } from "node:url";
import REACT_GRAPH from "../../src/reactGraph.js";
import { RAILS_GRAPH } from "../../src/logic/railsGraph.js";
import { REACT_DEEP_DIVES } from "../../src/reactDeepDives.js";
import { graphMetaShape, looksSpanish, nodeShape, OPTIONAL_KEYS, shapeHash } from "./contentShape.mjs";

const GRAPHS = { react: REACT_GRAPH, rails: RAILS_GRAPH };
const args = process.argv.slice(2);
const fileArg = args.includes("--file") ? path.resolve(args[args.indexOf("--file") + 1]) : null;
const errors = [];
const fail = (message) => errors.push(message);

function compare(expected, actual, where, key = "") {
  if (typeof expected === "string") {
    if (typeof actual !== "string" || !actual.trim()) return fail(`${where}: missing text`);
    if (!OPTIONAL_KEYS.has(key) && looksSpanish(actual)) fail(`${where}: still looks Spanish: ${JSON.stringify(actual.slice(0, 90))}`);
    if (/—/.test(actual)) fail(`${where}: contains an em-dash`);
    return undefined;
  }
  if (expected === null) {
    if (actual !== null) fail(`${where}: expected null (non-text item)`);
    return undefined;
  }
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return fail(`${where}: expected an array`);
    if (actual.length !== expected.length) return fail(`${where}: expected ${expected.length} items, got ${actual.length}`);
    expected.forEach((item, index) => compare(item, actual[index], `${where}[${index}]`));
    return undefined;
  }
  if (!actual || typeof actual !== "object" || Array.isArray(actual)) return fail(`${where}: expected an object`);
  for (const [childKey, child] of Object.entries(expected)) compare(child, actual[childKey], `${where}.${childKey}`, childKey);
  for (const childKey of Object.keys(actual)) {
    if (childKey !== "_source" && !(childKey in expected)) fail(`${where}.${childKey}: not in the Spanish shape`);
  }
  return undefined;
}

function checkEntry(expected, entry, where) {
  if (!entry) return fail(`${where}: missing translation`);
  if (entry._source !== shapeHash(expected)) fail(`${where}: stale (Spanish changed since translation, _source ${entry._source} != ${shapeHash(expected)})`);
  return compare(expected, entry, where);
}

async function load(file) {
  return (await import(pathToFileURL(file).href)).default;
}

async function checkFile(file) {
  const graphId = path.basename(path.dirname(file));
  const graph = GRAPHS[graphId];
  if (!graph) return fail(`${file}: unknown graph folder`);
  const data = await load(file);
  if (path.basename(file) === "meta.js") return checkEntry(graphMetaShape(graph), data, `${graphId}/meta`);
  for (const [id, entry] of Object.entries(data)) {
    const node = graph.nodes.find((item) => item.id === id);
    if (!node) fail(`${graphId}/${id}: not a concept of the graph`);
    else checkEntry(nodeShape(node), entry, `${graphId}/${id}`);
  }
  return undefined;
}

async function checkContent() {
  const { CONTENT_OVERLAYS } = await import(pathToFileURL(path.resolve("src/i18n/content/index.js")).href);
  for (const [locale, graphs] of Object.entries(CONTENT_OVERLAYS)) {
    for (const [graphId, graph] of Object.entries(GRAPHS)) {
      const overlay = graphs[graphId];
      if (!overlay) { fail(`${locale}/${graphId}: no overlay`); continue; }
      checkEntry(graphMetaShape(graph), overlay.meta, `${locale}/${graphId}/meta`);
      for (const node of graph.nodes) checkEntry(nodeShape(node), overlay.nodes[node.id], `${locale}/${graphId}/${node.id}`);
      for (const id of Object.keys(overlay.nodes)) if (!graph.nodes.some((node) => node.id === id)) fail(`${locale}/${graphId}/${id}: not a concept of the graph`);
    }
  }
}

// Deep dives (src/reactDeepDives.js) have their own overlay: same text shape, no ids or hrefs.
async function checkDeepDives() {
  const overlay = (await import(pathToFileURL(path.resolve("src/i18n/content/en/deepDives.js")).href)).default;
  for (const [id, dive] of Object.entries(REACT_DEEP_DIVES)) {
    const expected = { title: dive.title, aliases: dive.aliases, answer: dive.answer, example: dive.example, nuance: dive.nuance,
      sources: (dive.sources ?? []).map(({ label }) => ({ label })) };
    if (!overlay[id]) fail(`en/deepDives/${id}: missing translation`);
    else compare(expected, overlay[id], `en/deepDives/${id}`);
  }
  for (const id of Object.keys(overlay)) if (!REACT_DEEP_DIVES[id]) fail(`en/deepDives/${id}: not a deep dive`);
}

function flatten(tree, prefix = "", out = new Map()) {
  for (const [key, value] of Object.entries(tree)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, full, out);
    else out.set(full, value);
  }
  return out;
}

const params = (value) => (typeof value === "string" ? [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",") : null);

async function checkCatalogs() {
  const { MESSAGES } = await import(pathToFileURL(path.resolve("src/i18n/messages/index.js")).href);
  const en = flatten(MESSAGES.en);
  const es = flatten(MESSAGES.es);
  for (const key of en.keys()) if (!es.has(key)) fail(`messages: "${key}" exists in en but not in es`);
  for (const key of es.keys()) if (!en.has(key)) fail(`messages: "${key}" exists in es but not in en`);
  for (const [key, value] of en) {
    if (!es.has(key)) continue;
    const a = params(value); const b = params(es.get(key));
    if (a !== null && b !== null && a !== b) fail(`messages: "${key}" params differ (en: ${a || "none"}, es: ${b || "none"})`);
    if (typeof value !== typeof es.get(key)) fail(`messages: "${key}" is a ${typeof value} in en and a ${typeof es.get(key)} in es`);
    if (typeof value === "string" && /—/.test(value)) fail(`messages: "${key}" (en) contains an em-dash`);
  }
  return en.size;
}

if (fileArg) {
  await checkFile(fileArg);
} else {
  const count = await checkCatalogs();
  await checkContent();
  await checkDeepDives();
  if (!errors.length) console.log(`i18n OK: ${count} UI messages per locale, curriculum overlays complete.`);
}
if (errors.length) {
  console.error(errors.slice(0, 200).join("\n"));
  console.error(`\ni18n check failed: ${errors.length} problem(s).`);
  process.exit(1);
} else if (fileArg) {
  console.log(`OK: ${path.relative(process.cwd(), fileArg)}`);
}
