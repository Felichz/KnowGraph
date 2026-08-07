// Prueba manual de integración SSE. Requiere el gateway corriendo en 4317.
// Ejecutar desde server/: node tests/test-stream.mjs

const PORT = 4317;
const PARAPHRASE = "Closures recuerdan su scope. Promises representan trabajo futuro. La inmutabilidad crea referencias nuevas.";
const NODE = {
  id: "js_basics",
  label: "Conceptos clave de JS para React",
  lesson: {
    summary: "Closures, modulos, promesas e inmutabilidad.",
    why: "Bases del codigo React moderno.",
    explanation: "Closures conservan scope. Promises representan trabajo futuro. La inmutabilidad crea referencias nuevas.",
    steps: ["Closure recuerda scope", "Promise representa valor futuro"],
    pitfalls: ["Mutar state directamente", "Asumir que spread copia profundo"],
  },
};

const t0 = Date.now();
const res = await fetch(`http://127.0.0.1:${PORT}/api/ai/evaluate/stream`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ graphId: "react", nodeId: "js_basics", answer: PARAPHRASE, contentHash: "x", node: NODE }),
});

if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
const reader = res.body.getReader();
const decoder = new TextDecoder();
let buffer = "";
let progressEvents = 0;
let sections = [];
let donePayload = null;

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  let separator;
  while ((separator = findSeparator(buffer)) !== null) {
    const raw = buffer.slice(0, separator.start);
    buffer = buffer.slice(separator.start + separator.length);
    const event = parseEvent(raw);
    if (!event.data) continue;
    const payload = JSON.parse(event.data);
    if (event.name === "progress") progressEvents += 1;
    if (event.name === "section") sections.push(payload.field);
    if (event.name === "done") donePayload = payload;
    if (event.name === "error") throw new Error(`${payload.code}: ${payload.message}`);
  }
}

if (!donePayload?.attempt?.evaluation) throw new Error("No llegó una evaluación final válida");
console.log(`OK ${Date.now() - t0}ms: ${progressEvents} progress events, sections=${sections.join(",")}`);
console.log(`score=${donePayload.attempt.evaluation.score} status=${donePayload.attempt.evaluation.status}`);

function findSeparator(value) {
  const lf = value.indexOf("\n\n");
  const crlf = value.indexOf("\r\n\r\n");
  if (lf < 0 && crlf < 0) return null;
  if (crlf >= 0 && (lf < 0 || crlf < lf)) return { start: crlf, length: 4 };
  return { start: lf, length: 2 };
}

function parseEvent(raw) {
  let name = "message";
  const data = [];
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
  }
  return { name, data: data.join("\n") };
}
