import http from "node:http";
import { config } from "./config.js";
import { evaluateParaphrase } from "./ai/evaluator.js";
import { reviewLive } from "./ai/liveReview.js";
import { answerCoachQuestion, MAX_COACH_CHAT_MESSAGE_CHARS } from "./ai/coachChat.js";
import { checkUpstream } from "./ai/llmClient.js";
import { parseRequestProvider } from "./ai/providers.js";
import { MAX_LEARNER_ANSWER_CHARS } from "./ai/schemas.js";
import { GatewayError, ErrorCodes, jsonErrorResponse } from "./ai/errors.js";

const server = http.createServer(async (req, res) => {
  // El gateway acepta orÃ­genes locales en desarrollo y orÃ­genes explÃ­citos
  // en producciÃ³n. Reflejar cualquier Origin convertirÃ­a un proxy BYOK en un
  // endpoint reutilizable por terceros.
  const origin = req.headers.origin;
  if (origin && !isAllowedOrigin(origin)) {
    return sendJson(res, 403, { code: "origin_not_allowed", message: "Este origen no puede usar el gateway" });
  }
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/api/ai/status") {
      const defaultProviderConfigured = Boolean(config.minimaxApiKey || (config.freellmapiBaseUrl && config.freellmapiApiKey));
      const upstream = config.freellmapiBaseUrl && config.freellmapiApiKey
        ? await checkUpstream({ baseUrl: config.freellmapiBaseUrl, apiKey: config.freellmapiApiKey })
        : { reachable: false, status: null, latencyMs: null, modelCount: null, error: "not_configured" };
      return sendJson(res, 200, {
        available: true,
        gateway: { configured: defaultProviderConfigured, acceptsUserProviders: true },
        primary: {
          provider: "minimax",
          configured: Boolean(config.minimaxApiKey),
          model: config.minimaxModel,
          url: config.minimaxBaseUrl,
        },
        evaluationModel: config.evaluationModel,
        tutorModel: config.tutorModel,
        liveModel: config.liveModel,
        upstream: {
          url: config.freellmapiBaseUrl,
          reachable: upstream.reachable,
          status: upstream.status,
          latencyMs: upstream.latencyMs,
          modelCount: upstream.modelCount,
          error: upstream.error,
          checkedAt: new Date().toISOString(),
        },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/ai/providers/test") {
      const body = await readJsonBody(req);
      const provider = await parseRequestProvider(body?.provider);
      const result = await checkUpstream({ baseUrl: provider.baseUrl, apiKey: provider.apiKey });
      return sendJson(res, 200, {
        reachable: result.reachable,
        status: result.status,
        latencyMs: result.latencyMs,
        modelCount: result.modelCount,
        error: result.error,
        label: provider.label,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/ai/evaluate") {
      const body = await readJsonBody(req);
      const { graphId, nodeId, answer, contentHash } = body ?? {};
      if (!graphId || !nodeId || typeof answer !== "string" || !contentHash) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Faltan campos: graphId, nodeId, answer, contentHash");
      }
      if (answer.length > MAX_LEARNER_ANSWER_CHARS) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, `answer demasiado largo (max ${MAX_LEARNER_ANSWER_CHARS})`);
      }
      const { node } = body;
      if (!node || typeof node !== "object") {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
      }

      const provider = await parseRequestProvider(body?.provider);
      const result = await evaluateParaphrase({ node, learnerAnswer: answer, contentHash, provider, signal: reqAbortedSignal(req) });

      return sendJson(res, 200, {
        attempt: {
          id: `attempt_${Date.now().toString(36)}_${randomHex(6)}`,
          createdAt: new Date().toISOString(),
          graphId,
          nodeId,
          model: result.model,
          routedVia: result.routedVia,
          provider: result.provider,
          fallbackFrom: result.fallbackFrom,
          scoringProvider: result.scoringProvider ?? result.provider,
          scoringModel: result.scoringModel ?? result.model,
          contentHash: result.contentHash,
          evaluatorVersion: result.evaluatorVersion,
          evaluation: result.evaluation,
        },
        repairAttempts: result.repairAttempts,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/ai/evaluate/stream") {
      const body = await readJsonBody(req);
      const { graphId, nodeId, answer, contentHash } = body ?? {};
      if (!graphId || !nodeId || typeof answer !== "string" || !contentHash) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Faltan campos: graphId, nodeId, answer, contentHash");
      }
      if (answer.length > MAX_LEARNER_ANSWER_CHARS) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, `answer demasiado largo (max ${MAX_LEARNER_ANSWER_CHARS})`);
      }
      const { node } = body;
      if (!node || typeof node !== "object") {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
      }

      // SSE: configurar headers y deshabilitar buffering de Node
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();

      const writeEvent = (type, data) => {
        if (res.writableEnded) return;
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      const signal = reqAbortedSignal(req);
      const provider = await parseRequestProvider(body?.provider);
      try {
        writeEvent("progress", { stage: "evaluating", length: 0 });
        const result = await evaluateParaphrase({
          node,
          learnerAnswer: answer,
          contentHash,
          provider,
          signal,
          // El JSON parcial queda dentro del gateway. El navegador recibe
          // progreso y secciones completas, nunca texto JSON a medio formar.
          onChunk: (_delta, accumulated) => {
            writeEvent("progress", { stage: "evaluating", length: accumulated.length });
          },
          onSection: (field, value) => {
            writeEvent("section", { field, value });
          },
          onBlock: (block) => {
            writeEvent("block", block);
          },
          onProviderFallback: (provider) => {
            writeEvent("reset", provider);
          },
        });

        writeEvent("done", {
          attempt: {
            id: `attempt_${Date.now().toString(36)}_${randomHex(6)}`,
            createdAt: new Date().toISOString(),
            graphId,
            nodeId,
            model: result.model,
            routedVia: result.routedVia,
            provider: result.provider,
            fallbackFrom: result.fallbackFrom,
            scoringProvider: result.scoringProvider ?? result.provider,
            scoringModel: result.scoringModel ?? result.model,
            contentHash: result.contentHash,
            evaluatorVersion: result.evaluatorVersion,
            evaluation: result.evaluation,
          },
          repairAttempts: result.repairAttempts,
        });
        res.end();
      } catch (e) {
        const { status, body } = jsonErrorResponse(e);
        writeEvent("error", { ...body, httpStatus: status });
        res.end();
      }
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/ai/live-review/stream") {
      const body = await readJsonBody(req);
      const { graphId, nodeId, answer, contentHash } = body ?? {};
      if (!graphId || !nodeId || typeof answer !== "string" || !contentHash) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Faltan campos: graphId, nodeId, answer, contentHash");
      }
      if (answer.length > MAX_LEARNER_ANSWER_CHARS) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, `answer demasiado largo (max ${MAX_LEARNER_ANSWER_CHARS})`);
      }
      const { node } = body;
      if (!node || typeof node !== "object") {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Falta el contenido de la card (node)");
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();

      const writeEvent = (type, data) => {
        if (res.writableEnded) return;
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      const signal = reqAbortedSignal(req);
      const provider = await parseRequestProvider(body?.provider);
      try {
        writeEvent("progress", { stage: "live_review", length: 0 });
        const result = await reviewLive({
          node,
          learnerAnswer: answer,
          contentHash,
          provider,
          signal,
          onChunk: (_delta, accumulated) => {
            writeEvent("progress", { stage: "live_review", length: accumulated.length });
          },
          onSection: (field, value) => {
            writeEvent("section", { field, value });
          },
          onProviderFallback: (provider) => {
            writeEvent("reset", provider);
          },
        });
        writeEvent("done", result);
        res.end();
      } catch (e) {
        const { status, body: errorBody } = jsonErrorResponse(e);
        writeEvent("error", { ...errorBody, httpStatus: status });
        res.end();
      }
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/ai/live-review/chat/stream") {
      const body = await readJsonBody(req);
      const { graphId, nodeId, answer, contentHash, node, review, history, question } = body ?? {};
      if (!graphId || !nodeId || typeof answer !== "string" || !contentHash || !node || typeof node !== "object") {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "Faltan campos del contexto de coaching");
      }
      if (answer.length > MAX_LEARNER_ANSWER_CHARS) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, `answer demasiado largo (max ${MAX_LEARNER_ANSWER_CHARS})`);
      }
      if (typeof question !== "string" || !question.trim()) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, "La pregunta está vacía");
      }
      if (question.length > MAX_COACH_CHAT_MESSAGE_CHARS) {
        throw new GatewayError(ErrorCodes.BAD_REQUEST, `question demasiado largo (max ${MAX_COACH_CHAT_MESSAGE_CHARS})`);
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();

      const writeEvent = (type, data) => {
        if (res.writableEnded) return;
        res.write(`event: ${type}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      const signal = reqAbortedSignal(req);
      const provider = await parseRequestProvider(body?.provider);
      try {
        writeEvent("progress", { stage: "coach_chat", length: 0 });
        const result = await answerCoachQuestion({
          node,
          learnerAnswer: answer,
          review,
          history,
          question,
          provider,
          signal,
          onChunk: (delta, accumulated) => {
            writeEvent("delta", { text: delta, length: accumulated.length });
          },
        });
        writeEvent("done", result);
        res.end();
      } catch (e) {
        const { status, body: errorBody } = jsonErrorResponse(e);
        writeEvent("error", { ...errorBody, httpStatus: status });
        res.end();
      }
      return;
    }

    sendJson(res, 404, { code: "not_found", message: "Ruta no encontrada" });
  } catch (err) {
    const { status, body } = jsonErrorResponse(err);
    sendJson(res, status, body);
  }
});

server.listen(config.port, config.host, () => {
  console.log(`[gateway] listening on http://${config.host}:${config.port}`);
  console.log(`[gateway] upstream: ${config.freellmapiBaseUrl}`);
  console.log(`[gateway] evaluation model: ${config.evaluationModel}`);
});

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function isAllowedOrigin(origin) {
  const normalized = String(origin ?? "").replace(/\/$/, "");
  if (!normalized) return false;
  if (config.allowedOrigins.includes(normalized)) return true;
  try {
    const url = new URL(normalized);
    // Electron usa un puerto aleatorio en packaged mode y Vite alterna entre
    // localhost/127.0.0.1; ambos son locales al usuario, no terceros remotos.
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 200_000) {
        reject(new GatewayError(ErrorCodes.BAD_REQUEST, "Body demasiado grande"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve(JSON.parse(text));
      } catch {
        reject(new GatewayError(ErrorCodes.BAD_REQUEST, "JSON inválido"));
      }
    });
    req.on("error", (err) => reject(err));
  });
}

function reqAbortedSignal(req) {
  const ac = new AbortController();
  req.on("close", () => ac.abort());
  req.on("aborted", () => ac.abort());
  return ac.signal;
}

function randomHex(bytes) {
  let s = "";
  for (let i = 0; i < bytes; i++) s += Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
  return s;
}
