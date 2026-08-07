// scripts/serve-dist.mjs — sirve el build estático + proxy /api/ai al gateway
// Usado por el Playwright e2e y para exponer la app sin ngrok.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = Number(process.env.STATIC_PORT ?? 4173);
const GATEWAY = process.env.GATEWAY_URL ?? "http://127.0.0.1:4317";

if (!fs.existsSync(DIST)) {
  console.error(`No existe ${DIST}. Corré "npm run build" primero.`);
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf":  "font/ttf",
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/api/ai/")) {
    const target = GATEWAY + req.url;
    try {
      const upstream = await fetch(target, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        body: req.method === "GET" || req.method === "HEAD" ? undefined : await readBody(req),
      });
      res.statusCode = upstream.status;
      const ct = upstream.headers.get("content-type");
      if (ct) res.setHeader("Content-Type", ct);
      res.end(await upstream.text());
    } catch (e) {
      res.statusCode = 502;
      res.end(JSON.stringify({ code: "gateway_unreachable", message: e.message }));
    }
    return;
  }

  const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let filePath = path.join(DIST, urlPath);
  if (!filePath.startsWith(DIST)) {
    res.statusCode = 403;
    return res.end("forbidden");
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      filePath = path.join(DIST, "index.html");
    }
    serveFile(res, filePath);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[static] serving ${DIST} on http://0.0.0.0:${PORT}`);
  console.log(`[static] proxy /api/ai → ${GATEWAY}`);
});
