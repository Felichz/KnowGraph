import { ErrorCodes, GatewayError } from "./errors.js";
import { extractCompletedFields } from "./partialJson.js";
import { extractStreamingBlocks } from "./streamBlocks.js";

const RETRYABLE = new Set([ErrorCodes.RATE_LIMIT, ErrorCodes.UPSTREAM, ErrorCodes.TIMEOUT]);
const MAX_ATTEMPTS = 2;
const BASE_BACKOFF_MS = 800;
export const LLM_REQUEST_TIMEOUT_MS = 5 * 60 * 1000;

export async function chatCompletion({
  baseUrl,
  apiKey,
  model,
  messages,
  tools,
  responseFormat,
  temperature = 0.2,
  signal,
  timeoutMs = LLM_REQUEST_TIMEOUT_MS,
  maxAttempts = MAX_ATTEMPTS,
  onChunk = null,
  onSection = null,
  onBlock = null,
}) {
  if (!baseUrl) throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "Falta FREELLMAPI_BASE_URL");
  if (!apiKey) throw new GatewayError(ErrorCodes.UNAUTHORIZED, "Falta FREELLMAPI_API_KEY");
  if (!model) throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "Falta modelo");
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "messages requerido");
  }

  const body = {
    model,
    messages,
    temperature,
  };
  if (Array.isArray(tools) && tools.length > 0) body.tools = tools;
  if (responseFormat) body.response_format = responseFormat;
  if (onChunk) body.stream = true;

  let lastErr = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (signal?.aborted) throw new GatewayError(ErrorCodes.ABORTED, "Cancelado");

    try {
      return await callOnce({ baseUrl, apiKey, body, signal, timeoutMs, onChunk, onSection, onBlock });
    } catch (err) {
      lastErr = err;
      if (!(err instanceof GatewayError) || !RETRYABLE.has(err.code) || attempt === maxAttempts) {
        throw err;
      }
      const backoff = BASE_BACKOFF_MS * 2 ** (attempt - 1);
      await sleep(backoff, signal);
    }
  }
  throw lastErr;
}

async function callOnce({ baseUrl, apiKey, body, signal, timeoutMs, onChunk, onSection, onBlock }) {
  const ac = new AbortController();
  let externalAbortHandler;
  if (signal) {
    if (signal.aborted) ac.abort();
    else externalAbortHandler = () => ac.abort();
  }
  const timer = setTimeout(() => ac.abort(new Error("timeout")), timeoutMs);
  if (externalAbortHandler) signal.addEventListener("abort", externalAbortHandler, { once: true });

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: ac.signal,
    });

    if (!res.ok) {
      await throwUpstreamError(res, baseUrl);
    }

    // Streaming: consumir SSE y reensamblar el JSON final
    if (onChunk) {
      return await consumeStream(res, ac, onChunk, onSection, onBlock);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof GatewayError) throw err;
    if (err?.name === "AbortError" || ac.signal.aborted) {
      if (signal?.aborted) throw new GatewayError(ErrorCodes.ABORTED, "Cancelado");
      throw new GatewayError(ErrorCodes.TIMEOUT, "La llamada al LLM excedió el tiempo");
    }
    throw new GatewayError(ErrorCodes.UPSTREAM, err?.message ?? "Error de red", { cause: err?.message });
  } finally {
    clearTimeout(timer);
    if (externalAbortHandler && signal) signal.removeEventListener("abort", externalAbortHandler);
  }
}

/**
 * Consume un stream SSE de OpenAI-compatible, llama onChunk por cada delta
 * de contenido, y al final reensambla el JSON completo.
 */
async function consumeStream(res, ac, onChunk, onSection, onBlock) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let model = "";
  let finishReason = "";
  let usage = null;
  const emittedFields = new Set();
  const emittedBlocks = new Map();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE: eventos separados por una línea en blanco.
      let sep;
      while ((sep = findSseSeparator(buffer)) !== null) {
        const event = buffer.slice(0, sep.start);
        buffer = buffer.slice(sep.start + sep.length);

        for (const line of event.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") {
            continue;
          }
          let parsed;
          try { parsed = JSON.parse(payload); } catch { continue; }

          const delta = parsed?.choices?.[0]?.delta?.content;
          if (typeof delta === "string" && delta.length > 0) {
            content += delta;
            try { onChunk(delta, content); } catch {}
            if (onSection) {
              for (const field of extractCompletedFields(content, emittedFields)) {
                try { onSection(field.key, field.value, content); } catch {}
              }
            }
            if (onBlock) {
              for (const block of extractStreamingBlocks(content)) {
                const previous = emittedBlocks.get(block.id);
                if (!previous) {
                  try { onBlock({ ...block, phase: "start" }); } catch {}
                } else if (previous.value !== block.value) {
                  try {
                    onBlock({
                      ...block,
                      phase: "delta",
                      delta: block.value.startsWith(previous.value) ? block.value.slice(previous.value.length) : block.value,
                    });
                  } catch {}
                }
                if (block.complete && !previous?.complete) {
                  try { onBlock({ ...block, phase: "end" }); } catch {}
                }
                emittedBlocks.set(block.id, block);
              }
            }
          }
          if (parsed?.choices?.[0]?.finish_reason) finishReason = parsed.choices[0].finish_reason;
          if (parsed?.model) model = parsed.model;
          if (parsed?.usage) usage = parsed.usage;
        }
      }
    }
  } catch (err) {
    if (err?.name === "AbortError" || ac.signal.aborted) throw err;
    throw new GatewayError(ErrorCodes.UPSTREAM, err?.message ?? "Error leyendo stream", { cause: err?.message });
  }

  if (!content) {
    throw new GatewayError(ErrorCodes.SCHEMA_MISMATCH, "El stream no devolvió contenido");
  }

  // Reconstruir el shape { choices: [{ message: { role, content } }], model, usage }
  return {
    id: "stream-reconstructed",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{
      index: 0,
      message: { role: "assistant", content },
      finish_reason: finishReason,
    }],
    usage,
  };
}

function findSseSeparator(buffer) {
  const lf = buffer.indexOf("\n\n");
  const crlf = buffer.indexOf("\r\n\r\n");
  if (lf < 0 && crlf < 0) return null;
  if (crlf >= 0 && (lf < 0 || crlf < lf)) return { start: crlf, length: 4 };
  return { start: lf, length: 2 };
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new GatewayError(ErrorCodes.ABORTED, "Cancelado"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new GatewayError(ErrorCodes.ABORTED, "Cancelado"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function throwUpstreamError(res, baseUrl) {
  let detail = "";
  try {
    const data = await res.json();
    detail = data?.error?.message ?? JSON.stringify(data).slice(0, 300);
  } catch {
    detail = (await res.text().catch(() => "")).slice(0, 300);
  }
  if (res.status === 401 || res.status === 403) {
    throw new GatewayError(ErrorCodes.UNAUTHORIZED, "El proveedor rechazó el token", { status: res.status, provider: baseUrl });
  }
  if (res.status === 429) {
    throw new GatewayError(ErrorCodes.RATE_LIMIT, "Rate limit del proveedor", { status: res.status });
  }
  if (res.status >= 500) {
    throw new GatewayError(ErrorCodes.UPSTREAM, `Proveedor 5xx: ${detail.slice(0, 200)}`, { status: res.status });
  }
  throw new GatewayError(ErrorCodes.UPSTREAM, `HTTP ${res.status}: ${detail.slice(0, 200)}`, { status: res.status });
}

/**
 * Ping rápido al upstream para chequear salud. NO loguea ni devuelve el token.
 * Devuelve { reachable, status, modelCount, error }. Nunca lanza.
 */
export async function checkUpstream({ baseUrl, apiKey, timeoutMs = 5000 }) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const t0 = Date.now();
  try {
    const res = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: ac.signal,
    });
    const latencyMs = Date.now() - t0;
    if (res.status === 401 || res.status === 403) {
      return { reachable: false, status: res.status, latencyMs, error: "token_rejected" };
    }
    if (!res.ok) {
      return { reachable: false, status: res.status, latencyMs, error: `http_${res.status}` };
    }
    const body = await res.json().catch(() => null);
    const modelCount = Array.isArray(body?.data) ? body.data.length : null;
    return { reachable: true, status: res.status, latencyMs, modelCount, error: null };
  } catch (e) {
    return { reachable: false, status: null, latencyMs: Date.now() - t0, error: e?.name === "AbortError" ? "timeout" : (e?.message ?? "network") };
  } finally {
    clearTimeout(timer);
  }
}
