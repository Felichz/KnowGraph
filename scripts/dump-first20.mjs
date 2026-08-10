import { mkdirSync, writeFileSync } from "node:fs";
import graph from "../src/reactGraph.js";

const nodes = [...graph.nodes].sort((a, b) => a.priority - b.priority).slice(0, 20);
mkdirSync(new URL("../tmp/cards", import.meta.url), { recursive: true });

const section = (title, body) => (body == null ? "" : `\n## ${title}\n${body}\n`);
const list = (items) => (items ?? []).map((item, i) => `${i + 1}. ${item}`).join("\n");

for (const node of nodes) {
  const l = node.lesson;
  const parts = [
    `# CARD ${node.priority}: ${node.id} — ${node.label}`,
    `categoría: ${node.cat} | nivel: ${l.level ?? "?"} | prereqs: ${node.prerequisites.join(", ") || "ninguno"}`,
    section("SUMMARY", l.summary),
    section("WHY (por qué importa)", l.why),
    section("EXPLANATION (lectura)", l.explanation),
    section(`CODE (${l.codeLabel ?? ""})`, l.code),
    section("STEPS (paso a paso)", list(l.steps)),
    section("PITFALLS / TRADEOFFS", list(l.pitfalls)),
    section("TAKEAWAY", l.takeaway),
    l.audit
      ? section(
          "AUDIT",
          `primer: ${l.audit.primer}\nexample: ${l.audit.example}\nfailureModes:\n${list(l.audit.failureModes)}`,
        )
      : "",
    section("SOURCES", (l.sources ?? []).map((s) => `- ${s.label}: ${s.href}`).join("\n")),
  ];
  const path = new URL(`../tmp/cards/${String(node.priority).padStart(2, "0")}-${node.id}.txt`, import.meta.url);
  writeFileSync(path, parts.filter(Boolean).join("\n"));
  console.log(`${node.priority}\t${node.id}\t${parts.join("").length} chars`);
}
