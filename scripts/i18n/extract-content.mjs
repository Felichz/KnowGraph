// Writes English overlay skeletons (Spanish text in place) for curriculum content that has no
// translation yet. Usage: node scripts/i18n/extract-content.mjs [--locale en] [--init]
//   --init  splits every node into new chunk files (only for a locale that has no content yet).
// Without --init it prints the nodes that are missing or stale so they can be translated by hand.
import fs from "node:fs";
import path from "node:path";
import REACT_GRAPH from "../../src/reactGraph.js";
import { RAILS_GRAPH } from "../../src/logic/railsGraph.js";
import { pathToFileURL } from "node:url";
import { graphMetaShape, nodeShape, shapeHash } from "./contentShape.mjs";

const args = process.argv.slice(2);
const locale = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : "en";
const init = args.includes("--init");
const CHUNK_CHARS = 32000;
const root = path.resolve("src/i18n/content", locale);

function moduleSource(value, note) {
  return `// ${note}\n// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.\nexport default ${JSON.stringify(value, null, 2)};\n`;
}

for (const graph of [REACT_GRAPH, RAILS_GRAPH]) {
  const dir = path.join(root, graph.id);
  if (init) {
    fs.mkdirSync(dir, { recursive: true });
    const meta = graphMetaShape(graph);
    fs.writeFileSync(path.join(dir, "meta.js"), moduleSource({ _source: shapeHash(meta), ...meta }, `${graph.id} graph: labels, focus areas, milestones, seniority levels, interview questions`));
    let chunk = {}; let size = 0; let index = 1;
    const flush = () => {
      if (!Object.keys(chunk).length) return;
      const name = `nodes-${String(index).padStart(2, "0")}.js`;
      fs.writeFileSync(path.join(dir, name), moduleSource(chunk, `${graph.id} concepts (${Object.keys(chunk).join(", ")})`));
      console.log(`${graph.id}/${name}: ${Object.keys(chunk).length} nodes, ${size} chars`);
      chunk = {}; size = 0; index += 1;
    };
    for (const node of graph.nodes) {
      const shape = nodeShape(node);
      const chars = JSON.stringify(shape).length;
      if (size && size + chars > CHUNK_CHARS) flush();
      chunk[node.id] = { _source: shapeHash(shape), ...shape };
      size += chars;
    }
    flush();
    continue;
  }
  // Report mode: print the Spanish shape of every entry that is missing or stale, ready to translate
  // and paste into one of the chunk files (keep "_source").
  const { CONTENT_OVERLAYS } = await import(pathToFileURL(path.resolve("src/i18n/content/index.js")).href);
  const overlay = CONTENT_OVERLAYS[locale]?.[graph.id] ?? { meta: null, nodes: {} };
  const pending = [];
  const meta = graphMetaShape(graph);
  if (overlay.meta?._source !== shapeHash(meta)) pending.push(["meta.js", { _source: shapeHash(meta), ...meta }]);
  for (const node of graph.nodes) {
    const shape = nodeShape(node);
    if (overlay.nodes?.[node.id]?._source !== shapeHash(shape)) pending.push([node.id, { _source: shapeHash(shape), ...shape }]);
  }
  if (!pending.length) console.log(`${graph.id}: ${locale} content is complete and up to date.`);
  for (const [id, value] of pending) console.log(`
// ${graph.id}/${id} (${locale}: missing or stale)
${JSON.stringify({ [id]: value }, null, 2)}`);
}
