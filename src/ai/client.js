import { getLocale, isLocale } from "../i18n/locale.js";
import { t } from "../i18n/translate.js";

// Every AI request carries the UI language (validated by the gateway) so the mentor,
// paraphrase coaching and evaluation answer in it. An explicit `locale` param wins.
function jsonBody(payload, locale) {
  return JSON.stringify({ ...payload, locale: isLocale(locale) ? locale : getLocale() });
}

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

export function userFacingAiError(error, fallback = t("common.errors.requestFailed")) {
  const message = String(error?.message ?? "").trim();
  if (!message) return fallback;

  // A raw transport error is useful in DevTools but does not tell the
  // learner what to do. Keep deliberate provider/gateway messages intact.
  if (/^(HTTP 5\d\d|Failed to fetch|NetworkError|Load failed|fetch failed)$/i.test(message)) {
    return t("common.errors.gatewayUnreachable");
  }

  return message;
}

export async function fetchAiStatus({ signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/status"), { signal });
  return handle(res);
}

export async function testAiProvider({ locale, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/providers/test"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ provider }, locale),
    signal,
  });
  return handle(res);
}

export async function fetchAiProviderCatalog({ signal, refresh = false } = {}) {
  const res = await fetch(aiUrl(`/api/ai/providers/catalog${refresh ? "?refresh=1" : ""}`), { signal });
  return handle(res);
}

export async function fetchAiProviderModels({ locale, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/providers/models"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ provider }, locale),
    signal,
  });
  return handle(res);
}

export async function evaluateParaphrase({ locale, graphId, nodeId, answer, contentHash, node, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/evaluate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ graphId, nodeId, answer, contentHash, node, provider }, locale),
    signal,
  });
  return handle(res);
}

/**
 * Streaming de la evaluación. El navegador no recibe JSON parcial: recibe
 * progreso y propiedades completas para poder renderizar un preview seguro.
 */
export async function evaluateParaphraseStream({
  locale,
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
    body: jsonBody({ graphId, nodeId, answer, contentHash, node, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
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
          throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
        }
      }
    }
    buffer += decoder.decode();
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.attempt?.evaluation) {
    throw new AiError("upstream", t("common.errors.noEvaluation"), null);
  }
  return finalPayload;
}

export async function liveReviewStream({
  locale,
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
    body: jsonBody({ graphId, nodeId, answer, contentHash, node, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "live_review");
        else if (event.name === "section") onSection?.(payload.field, payload.value);
        else if (event.name === "reset") onReset?.(payload);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.review) throw new AiError("upstream", t("common.errors.noLiveReview"), null);
  return finalPayload;
}

export async function coachChatStream({
  locale,
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
    body: jsonBody({ graphId, nodeId, answer, contentHash, node, review, history, question, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidChatEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "coach_chat");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.message?.content) {
    throw new AiError("upstream", t("common.errors.noChatAnswer"), null);
  }
  return finalPayload;
}

export async function generateParaphrase({ locale, node, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, provider }, locale),
    signal,
  });
  return handle(res);
}

export async function generateParaphraseStream({
  locale,
  node,
  provider,
  signal,
  onProgress,
  onDelta,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "generating");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.text) {
    throw new AiError("upstream", t("common.errors.noGeneration"), null);
  }
  return finalPayload;
}

export async function improveParaphrase({ locale, node, currentDraft, focusTitle, focusDetail, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/improve"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, currentDraft, focusTitle, focusDetail, provider }, locale),
    signal,
  });
  return handle(res);
}

export async function improveParaphraseStream({
  locale,
  node,
  currentDraft,
  focusTitle,
  focusDetail,
  provider,
  signal,
  onProgress,
  onDelta,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/improve/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, currentDraft, focusTitle, focusDetail, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "generating");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.text) {
    throw new AiError("upstream", t("common.errors.noImprovement"), null);
  }
  return finalPayload;
}

export async function reconcileParaphraseStream({
  locale,
  node,
  currentDraft,
  messages,
  provider,
  signal,
  onProgress,
  onDelta,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/reconcile/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, currentDraft, messages, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "generating");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.text) {
    throw new AiError("upstream", t("common.errors.noReconcile"), null);
  }
  return finalPayload;
}

export async function polishParaphraseStream({
  locale,
  node,
  currentDraft,
  provider,
  signal,
  onProgress,
  onDelta,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/polish/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, currentDraft, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "generating");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.text) {
    throw new AiError("upstream", t("common.errors.noPolish"), null);
  }
  return finalPayload;
}

export async function judgePedagogy({ locale, node, draft, provider, signal } = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/judge"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, draft, provider }, locale),
    signal,
  });
  if (!res.ok) {
    let body = {};
    try { body = await res.json(); } catch {}
    throw new AiError(body.code ?? "upstream", body.message ?? `HTTP ${res.status}`, body.details);
  }
  return res.json();
}

export async function refinePedagogyStream({
  locale,
  node,
  draft,
  critique = [],
  currentScore = 0,
  provider,
  signal,
  onDelta,
  onProgress,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/refine/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, draft, critique, currentScore, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "progress") onProgress?.(payload.length ?? 0, payload.stage ?? "refining");
        else if (event.name === "delta") onDelta?.(payload.text ?? "", payload.length ?? 0);
        else if (event.name === "done") finalPayload = payload;
        else if (event.name === "error") throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.text) {
    throw new AiError("upstream", t("common.errors.noRefine"), null);
  }
  return finalPayload;
}

export async function polishPedagogyHarnessStream({
  locale,
  node,
  currentDraft,
  maxIterations = 3,
  provider,
  signal,
  onEvent,
} = {}) {
  const res = await fetch(aiUrl("/api/ai/paraphrase/polish-loop/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody({ node, currentDraft, maxIterations, provider }, locale),
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
          throw new AiError("upstream", t("common.errors.invalidEvent"), null);
        }
        if (event.name === "done") {
          finalPayload = payload;
          onEvent?.({ type: "done", ...payload });
        } else if (event.name === "error") {
          throw new AiError(payload.code ?? "upstream", payload.message ?? t("common.errors.gateway"), payload.details);
        } else {
          onEvent?.({ type: event.name, ...payload });
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  if (!finalPayload?.text) {
    throw new AiError("upstream", t("common.errors.noHarness"), null);
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
