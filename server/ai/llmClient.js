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
  supportsResponseFormat = true,
  extraBody = null,
  streamContentMode = "delta",
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
    ...(extraBody ?? {}),
    model,
    messages,
    temperature,
  };
  if (Array.isArray(tools) && tools.length > 0) body.tools = tools;
  if (responseFormat && supportsResponseFormat) body.response_format = responseFormat;
  if (onChunk) body.stream = true;

  let lastErr = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (signal?.aborted) throw new GatewayError(ErrorCodes.ABORTED, "Cancelado");

    try {
      return await callOnce({ baseUrl, apiKey, body, signal, timeoutMs, onChunk, onSection, onBlock, streamContentMode });
    } catch (err) {
      lastErr = err;
      if (!(err instanceof GatewayError) || !RETRYABLE.has(err.code) || err.details?.responseFormatUnsupported || attempt === maxAttempts) {
        throw err;
      }
      const backoff = BASE_BACKOFF_MS * 2 ** (attempt - 1);
      await sleep(backoff, signal);
    }
  }
  throw lastErr;
}

/**
 * Run the preferred provider first and fall back only when it fails before
 * emitting content. Falling back after partial streaming would concatenate
 * two different model responses in the same UI, so a partially emitted
 * stream is surfaced as an error and can be retried explicitly.
 */
export async function chatCompletionWithFallback({
  primary,
  fallback,
  responseFormat,
  onChunk,
  onSection,
  onBlock,
  ...request
}) {
  let primaryEmitted = false;

  if (!primary?.apiKey && !fallback?.apiKey) {
    throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "ConfigurÃ¡ un provider de IA antes de evaluar");
  }

  if (primary?.apiKey) {
    try {
      const raw = await callProvider(primary, false);
      return withProviderMetadata(raw, primary, null);
    } catch (error) {
      let providerError = error;
      if (!primaryEmitted && canUseResponseFormat(primary) && isResponseFormatUnsupported(error)) {
        try {
          const raw = await callProvider(primary, true);
          return withProviderMetadata(raw, primary, null);
        } catch (retryError) {
          providerError = retryError;
        }
      }
      if (providerError?.code === ErrorCodes.ABORTED || primaryEmitted || !fallback?.apiKey) {
        throw providerError;
      }
      console.warn(`[llm] ${primary.name} failed (${providerError?.code ?? "unknown"}); using ${fallback.name} fallback`);
    }
  }

  if (!fallback?.apiKey) {
    throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "No hay provider de fallback configurado");
  }
  const raw = await callProvider(fallback, false);
  return withProviderMetadata(raw, fallback, primary?.name ?? null);

  async function callProvider(provider, withoutResponseFormat) {
    const includeResponseFormat = !withoutResponseFormat && canUseResponseFormat(provider);
    return chatCompletion({
      ...request,
      ...provider,
      responseFormat: includeResponseFormat ? responseFormat : undefined,
      supportsResponseFormat: includeResponseFormat,
      onChunk: onChunk
        ? (delta, accumulated) => {
            if (provider === primary && delta) primaryEmitted = true;
            onChunk(delta, accumulated);
          }
        : null,
      onSection,
      onBlock,
    });
  }
}

/**
 * Same provider policy for structured responses. Validation belongs inside
 * the provider boundary: a 200 response with the wrong JSON shape is still a
 * provider failure for the caller. When streaming already showed partial
 * data, the caller must provide onProviderFallback so it can reset its
 * preview before the fallback stream begins.
 */
export async function structuredCompletionWithFallback({
  primary,
  fallback,
  responseFormat,
  parse,
  onChunk,
  onSection,
  onBlock,
  onProviderFallback,
  ...request
}) {
  if (typeof parse !== "function") throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "Falta parser estructurado");
  if (!primary?.apiKey && !fallback?.apiKey) {
    throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "ConfigurÃ¡ un provider de IA antes de evaluar");
  }
  let primaryEmitted = false;

  const callProvider = async (provider, fallbackFrom = null, withoutResponseFormat = false) => {
    const includeResponseFormat = !withoutResponseFormat && canUseResponseFormat(provider);
    const raw = await chatCompletion({
      ...request,
      ...provider,
      responseFormat: includeResponseFormat ? responseFormat : undefined,
      supportsResponseFormat: includeResponseFormat,
      onChunk: onChunk
        ? (delta, accumulated) => {
            if (provider === primary && delta) primaryEmitted = true;
            onChunk(delta, accumulated);
          }
        : null,
      onSection,
      onBlock,
    });
    return withProviderMetadata(raw, provider, fallbackFrom);
  };

  if (primary?.apiKey) {
    try {
      const raw = await callProvider(primary);
      return { raw, parsed: await parse(raw) };
    } catch (error) {
      let providerError = error;
      if (!primaryEmitted && canUseResponseFormat(primary) && isResponseFormatUnsupported(error)) {
        try {
          const raw = await callProvider(primary, null, true);
          return { raw, parsed: await parse(raw) };
        } catch (retryError) {
          providerError = retryError;
        }
      }
      const canResetPartialStream = Boolean(onProviderFallback);
      if (providerError?.code === ErrorCodes.ABORTED || (primaryEmitted && !canResetPartialStream) || !fallback?.apiKey) {
        throw providerError;
      }
      try { onProviderFallback?.({ from: primary.name, to: fallback.name, reason: providerError?.code ?? "provider_error" }); } catch {}
      const validationIssues = Array.isArray(providerError?.details?.issues)
        ? ` ${providerError.details.issues.slice(0, 5).join(" | ")}`
        : "";
      // El diagnóstico expone solo paths/errores de schema, nunca el texto del
      // estudiante ni la respuesta cruda del proveedor.
      console.warn(
        `[llm] ${primary.name} structured response failed (${providerError?.code ?? "unknown"})${validationIssues}; using ${fallback.name} fallback`,
      );
    }
  }

  if (!fallback?.apiKey) {
    throw new GatewayError(ErrorCodes.NOT_CONFIGURED, "No hay provider de fallback configurado");
  }
  const raw = await callProvider(fallback, primary?.name ?? null);
  return { raw, parsed: await parse(raw) };
}

function withProviderMetadata(raw, provider, fallbackFrom) {
  return {
    ...raw,
    provider: provider.name,
    requestedModel: provider.model,
    fallbackFrom,
  };
}

async function callOnce({ baseUrl, apiKey, body, signal, timeoutMs, onChunk, onSection, onBlock, streamContentMode }) {
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
      redirect: "error",
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
      return await consumeStream(res, ac, onChunk, onSection, onBlock, streamContentMode);
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
async function consumeStream(res, ac, onChunk, onSection, onBlock, streamContentMode = "delta") {
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

          const incomingContent = parsed?.choices?.[0]?.delta?.content;
          if (typeof incomingContent === "string" && incomingContent.length > 0) {
            const delta = streamContentMode === "cumulative"
              ? (incomingContent.startsWith(content) ? incomingContent.slice(content.length) : incomingContent)
              : incomingContent;
            content = streamContentMode === "cumulative"
              ? incomingContent
              : content + incomingContent;
            if (delta) {
              try { onChunk(delta, content); } catch {}
            }
            if (delta && onSection) {
              for (const field of extractCompletedFields(content, emittedFields)) {
                try { onSection(field.key, field.value, content); } catch {}
              }
            }
            if (delta && onBlock) {
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
  const responseFormatUnsupported = (res.status === 400 || res.status === 422) && /response[_ -]?format|json\s*schema|structured output|unsupported.*(format|schema)|unknown field/i.test(detail);
  throw new GatewayError(ErrorCodes.UPSTREAM, `HTTP ${res.status}: ${detail.slice(0, 200)}`, { status: res.status, responseFormatUnsupported });
}

function canUseResponseFormat(provider) {
  if (provider?.responseFormatMode) return provider.responseFormatMode !== "unsupported";
  return Boolean(provider?.supportsResponseFormat);
}

function isResponseFormatUnsupported(error) {
  if (error?.details?.responseFormatUnsupported) return true;
  if (error?.code !== ErrorCodes.UPSTREAM) return false;
  return /response[_ -]?format|json\s*schema|structured output|unsupported.*(format|schema)|unknown field/i.test(error?.message ?? "");
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
      redirect: "error",
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

/**
 * Verify an actual inference route rather than treating GET /models as a
 * universal health check. Several valid OpenAI-compatible gateways, notably
 * MiniMax, do not expose that discovery endpoint.
 *
 * The request is intentionally tiny and never includes study content. It is
 * still billable by the configured provider, so the UI only invokes it after
 * the user explicitly clicks "Probar modelo".
 */
export async function probeProvider({
  baseUrl,
  apiKey,
  model,
  extraBody = null,
  timeoutMs = 15_000,
}) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      redirect: "error",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...(extraBody ?? {}),
        model,
        messages: [{ role: "user", content: "Respondé solamente OK." }],
        temperature: 0,
        max_tokens: 8,
      }),
      signal: ac.signal,
    });
    const latencyMs = Date.now() - startedAt;
    if (response.ok) {
      // Drain a small response to release the connection but never return
      // provider content to the browser or put it in logs.
      await response.arrayBuffer().catch(() => {});
      return { reachable: true, status: response.status, latencyMs, error: null };
    }

    const detail = (await response.text().catch(() => "")).slice(0, 400);
    if (response.status === 401 || response.status === 403) {
      return { reachable: false, status: response.status, latencyMs, error: "token_rejected" };
    }
    if (response.status === 404) {
      return { reachable: false, status: response.status, latencyMs, error: "chat_route_not_found" };
    }
    if (response.status === 429) {
      return { reachable: false, status: response.status, latencyMs, error: "rate_limited" };
    }
    return { reachable: false, status: response.status, latencyMs, error: "inference_rejected", detail };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      latencyMs: Date.now() - startedAt,
      error: error?.name === "AbortError" ? "timeout" : "network",
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch a provider's model catalog without exposing the API key to the
 * browser. Providers that implement the OpenAI-compatible `/models` route
 * can power the model picker; providers that do not can still be configured
 * manually in the UI.
 */
export async function listUpstreamModels({ baseUrl, apiKey, timeoutMs = 10000 }) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const t0 = Date.now();
  try {
    const res = await fetch(`${baseUrl}/models`, {
      method: "GET",
      redirect: "error",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: ac.signal,
    });
    const latencyMs = Date.now() - t0;
    if (res.status === 401 || res.status === 403) {
      return { reachable: false, status: res.status, latencyMs, models: [], error: "token_rejected" };
    }
    if (!res.ok) {
      return { reachable: false, status: res.status, latencyMs, models: [], error: `http_${res.status}` };
    }

    const body = await res.json().catch(() => null);
    const models = Array.isArray(body?.data)
      ? body.data
        .map(normalizeModel)
        .filter(Boolean)
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }))
      : [];
    return { reachable: true, status: res.status, latencyMs, models, error: null };
  } catch (e) {
    return {
      reachable: false,
      status: null,
      latencyMs: Date.now() - t0,
      models: [],
      error: e?.name === "AbortError" ? "timeout" : (e?.message ?? "network"),
    };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeModel(value) {
  if (!value || typeof value !== "object") return null;
  const id = typeof value.id === "string" ? value.id.trim() : "";
  if (!id) return null;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const label = name && name !== id ? name : id;
  const contextLength = Number.isFinite(value.context_length) ? value.context_length : null;
  return { id, label, contextLength };
}
