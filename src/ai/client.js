export class AiError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.details = details;
  }
}

// `import.meta.env` only exists in Vite. Keeping this guard makes the client
// importable by the Node-side logic tests as well.
const AI_API_BASE_URL = String(import.meta.env?.VITE_AI_API_URL ?? "").replace(/\/+$/, "");

function aiUrl(path) {
  return `${AI_API_BASE_URL}${path}`;
}

export function isCancel(err) {
  return err?.name === "AbortError" || err?.code === "aborted" || err?.code === "aborted_from_abortcontroller";
}

export async function fetchAiStatus({ signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/status"), { signal });
  return handle(res);
}

export async function testAiProvider({ provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/providers/test"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider }),
    signal,
  });
  return handle(res);
}

export async function evaluateParaphrase({ graphId, nodeId, answer, contentHash, node, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/evaluate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graphId, nodeId, answer, contentHash, node, provider }),
    signal,
  });
  return handle(res);
}

/**
 * Streaming de la evaluación. El navegador no recibe JSON parcial: recibe
 * progreso y propiedades completas para poder renderizar un preview seguro.
 */
export async function evaluateParaphraseStream({
  graphId,
  nodeId,
  answer,
  contentHash,
  node,
  provider,
  signal,
  onProgress,
  onSection,
  onBlock,
  onReset,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/evaluate/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graphId, nodeId, answer, contentHash, node, provider }),
    signal,
  });

  if (!res.ok || !res.body) {
    let body = {};
    try { body = await res.json(); } catch {}
    throw new AiError(body.code ?? "upstream", body.message ?? `HTTP ${res.status}`, body.details);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalPayload = null;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let separator;
      while ((separator = findSseSeparator(buffer)) !== null) {
        const raw = buffer.slice(0, separator.start);
        buffer = buffer.slice(separator.start + separator.length);
        const event = parseSseEvent(raw);
        if (!event.data) continue;

        let payload;
        try {
          payload = JSON.parse(event.data);
        } catch {
          throw new AiError("upstream", "El gateway envió un evento inválido", null);
        }

        if (event.name === "progress" && typeof onProgress === "function") {
          onProgress(payload.length ?? 0, payload.stage ?? "evaluating");
        } else if (event.name === "section" && typeof onSection === "function") {
          if (typeof payload.field === "string") onSection(payload.field, payload.value);
        } else if (event.name === "block" && typeof onBlock === "function") {
          if (typeof payload.id === "string") onBlock(payload);
        } else if (event.name === "reset") {
          onReset?.(payload);
        } else if (event.name === "done") {
          finalPayload = payload;
        } else if (event.name === "error") {
          throw new AiError(payload.code ?? "upstream", payload.message ?? "Error del gateway", payload.details);
        }
      }
    }
    buffer += decoder.decode();
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.attempt?.evaluation) {
    throw new AiError("upstream", "Stream terminó sin una evaluación válida", null);
  }
  return finalPayload;
}

export async function liveReviewStream({
  graphId,
  nodeId,
  answer,
  contentHash,
  node,
  provider,
  signal,
  onProgress,
  onSection,
  onReset,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/live-review/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graphId, nodeId, answer, contentHash, node, provider }),
    signal,
  });

  if (!res.ok || !res.body) {
    let body = {};
    try { body = await res.json(); } catch {}
    throw new AiError(body.code ?? "upstream", body.message ?? `HTTP ${res.status}`, body.details);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalPayload = null;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let separator;
      while ((separator = findSseSeparator(buffer)) !== null) {
        const raw = buffer.slice(0, separator.start);
        buffer = buffer.slice(separator.start + separator.length);
        const event = parseSseEvent(raw);
        if (!event.data) continue;
        let payload;
        try { payload = JSON.parse(event.data); } catch {
          throw new AiError("upstream", "El gateway enviÃ³ un evento invÃ¡lido", null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "live_review");
        else if (event.name === "section") onSection?.(payload.field, payload.value);
        else if (event.name === "reset") onReset?.(payload);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? "Error del gateway", payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.review) throw new AiError("upstream", "La revisión viva terminó sin un resultado válido", null);
  return finalPayload;
}

export async function coachChatStream({
  graphId,
  nodeId,
  answer,
  contentHash,
  node,
  review,
  history,
  question,
  provider,
  signal,
  onProgress,
  onDelta,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/live-review/chat/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graphId, nodeId, answer, contentHash, node, review, history, question, provider }),
    signal,
  });

  if (!res.ok || !res.body) {
    let body = {};
    try { body = await res.json(); } catch {}
    throw new AiError(body.code ?? "upstream", body.message ?? `HTTP ${res.status}`, body.details);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalPayload = null;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let separator;
      while ((separator = findSseSeparator(buffer)) !== null) {
        const raw = buffer.slice(0, separator.start);
        buffer = buffer.slice(separator.start + separator.length);
        const event = parseSseEvent(raw);
        if (!event.data) continue;
        let payload;
        try { payload = JSON.parse(event.data); } catch {
          throw new AiError("upstream", "El gateway envió un evento de chat inválido", null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "coach_chat");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? "Error del gateway", payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.message?.content) {
    throw new AiError("upstream", "El chat terminó sin una respuesta válida", null);
  }
  return finalPayload;
}

function findSseSeparator(buffer) {
  const lf = buffer.indexOf("\n\n");
  const crlf = buffer.indexOf("\r\n\r\n");
  if (lf < 0 && crlf < 0) return null;
  if (crlf >= 0 && (lf < 0 || crlf < lf)) return { start: crlf, length: 4 };
  return { start: lf, length: 2 };
}

function parseSseEvent(raw) {
  let name = "message";
  const data = [];
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
  }
  return { name, data: data.join("\n") };
}

async function handle(res) {
  if (res.ok) return res.json();
  let body = {};
  try { body = await res.json(); } catch {}
  throw new AiError(body.code ?? "upstream", body.message ?? `HTTP ${res.status}`, body.details);
}
