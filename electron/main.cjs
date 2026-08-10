const { app, BrowserWindow, Menu, session, shell, safeStorage, ipcMain } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const GATEWAY_HOST = "127.0.0.1";
const GATEWAY_PORT = 4317;
const GATEWAY_STATUS_URL = `http://${GATEWAY_HOST}:${GATEWAY_PORT}/api/ai/status`;
const DEV_RENDERER_URL = process.env.ELECTRON_RENDERER_URL || "http://127.0.0.1:5173";

let gatewayProcess = null;
let rendererDevProcess = null;
let rendererServer = null;
let mainWindow = null;
let shuttingDown = false;

function providerSettingsPath() {
  return path.join(app.getPath("userData"), "provider-settings.bin");
}

function normalizeProviderProfile(profile) {
  if (!profile || typeof profile !== "object") throw new Error("Perfil de provider invÃ¡lido");
  const normalized = {
    id: String(profile.id || "provider_default").slice(0, 80),
    label: String(profile.label || "Provider personal").slice(0, 80),
    adapter: profile.adapter === "minimax" ? "minimax" : "openai",
    baseUrl: String(profile.baseUrl || "").replace(/\/+$/, "").slice(0, 500),
    apiKey: String(profile.apiKey || "").slice(0, 4096),
    model: String(profile.model || "").slice(0, 200),
    supportsResponseFormat: Boolean(profile.supportsResponseFormat),
  };
  if (!normalized.baseUrl || !normalized.apiKey || !normalized.model) throw new Error("El perfil estÃ¡ incompleto");
  return normalized;
}

function normalizeProviderDraft(profile, adapter = "openai") {
  const source = profile && typeof profile === "object" ? profile : {};
  return {
    id: String(source.id || "provider_default").slice(0, 80),
    label: String(source.label || "").slice(0, 80),
    adapter: source.adapter === "minimax" || adapter === "minimax" ? "minimax" : "openai",
    baseUrl: String(source.baseUrl || "").replace(/\/+$/, "").slice(0, 500),
    apiKey: String(source.apiKey || "").slice(0, 4096),
    model: String(source.model || "").slice(0, 200),
  };
}

function normalizeProviderState(value) {
  const fallback = {
    version: 2,
    activeAdapter: "openai",
    profiles: {
      openai: normalizeProviderDraft({}, "openai"),
      minimax: normalizeProviderDraft({ label: "MiniMax", baseUrl: "https://api.minimax.io/v1", model: "MiniMax-M3" }, "minimax"),
    },
  };
  if (!value || typeof value !== "object") return fallback;
  if (!value.profiles) {
    const legacy = normalizeProviderDraft(value);
    fallback.activeAdapter = legacy.adapter;
    fallback.profiles[legacy.adapter] = legacy;
    return fallback;
  }
  return {
    version: 2,
    activeAdapter: value.activeAdapter === "minimax" ? "minimax" : "openai",
    profiles: {
      openai: normalizeProviderDraft(value.profiles.openai, "openai"),
      minimax: normalizeProviderDraft(value.profiles.minimax ?? { label: "MiniMax", baseUrl: "https://api.minimax.io/v1", model: "MiniMax-M3" }, "minimax"),
    },
  };
}

function registerProviderSettingsIpc() {
  ipcMain.handle("provider-settings:load", () => {
    try {
      if (!safeStorage.isEncryptionAvailable()) return null;
      const location = providerSettingsPath();
      if (!fs.existsSync(location)) return null;
      const encrypted = Buffer.from(fs.readFileSync(location, "utf8"), "base64");
      return normalizeProviderState(JSON.parse(safeStorage.decryptString(encrypted)));
    } catch {
      return null;
    }
  });

  ipcMain.handle("provider-settings:save", (_event, profile) => {
    if (!safeStorage.isEncryptionAvailable()) throw new Error("El sistema no ofrece almacenamiento cifrado");
    const normalized = normalizeProviderState(profile);
    const encrypted = safeStorage.encryptString(JSON.stringify(normalized)).toString("base64");
    fs.writeFileSync(providerSettingsPath(), encrypted, { encoding: "utf8", mode: 0o600 });
    return true;
  });

  ipcMain.handle("provider-settings:clear", () => {
    const location = providerSettingsPath();
    if (fs.existsSync(location)) fs.rmSync(location);
    return true;
  });
}

function requestHealthy(url, timeoutMs = 800) {
  return new Promise((resolve) => {
    const request = http.get(url, { timeout: timeoutMs }, (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });
    request.on("timeout", () => request.destroy());
    request.on("error", () => resolve(false));
  });
}

async function waitForHealthy(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await requestHealthy(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`El servicio local no respondió a tiempo: ${url}`);
}

async function ensureGateway() {
  if (await requestHealthy(GATEWAY_STATUS_URL)) return;

  if (app.isPackaged) {
    const source = path.join(process.resourcesPath, "gateway.env.example");
    const destination = path.join(app.getPath("userData"), ".env.example");
    if (fs.existsSync(source) && !fs.existsSync(destination)) fs.copyFileSync(source, destination);
  }

  const entry = app.isPackaged
    ? path.join(process.resourcesPath, "gateway.cjs")
    : path.join(PROJECT_ROOT, "server", "index.js");
  const workingDirectory = app.isPackaged
    ? app.getPath("userData")
    : path.join(PROJECT_ROOT, "server");

  gatewayProcess = spawn(process.execPath, [entry], {
    cwd: workingDirectory,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      GATEWAY_HOST,
      GATEWAY_PORT: String(GATEWAY_PORT),
    },
  });

  gatewayProcess.stdout?.on("data", (chunk) => process.stdout.write(`[gateway] ${chunk}`));
  gatewayProcess.stderr?.on("data", (chunk) => process.stderr.write(`[gateway] ${chunk}`));
  gatewayProcess.once("exit", (code) => {
    if (!shuttingDown && code !== 0) console.error(`[desktop] gateway finalizó con código ${code}`);
    gatewayProcess = null;
  });

  await waitForHealthy(GATEWAY_STATUS_URL);
}

async function ensureDevelopmentRenderer() {
  if (await requestHealthy(DEV_RENDERER_URL)) return;

  const viteEntry = path.join(PROJECT_ROOT, "node_modules", "vite", "bin", "vite.js");
  rendererDevProcess = spawn(process.execPath, [viteEntry, "--host", "127.0.0.1"], {
    cwd: PROJECT_ROOT,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
  });
  rendererDevProcess.stdout?.on("data", (chunk) => process.stdout.write(`[vite] ${chunk}`));
  rendererDevProcess.stderr?.on("data", (chunk) => process.stderr.write(`[vite] ${chunk}`));
  rendererDevProcess.once("exit", (code) => {
    if (!shuttingDown && code !== 0) console.error(`[desktop] Vite finalizó con código ${code}`);
    rendererDevProcess = null;
  });

  await waitForHealthy(DEV_RENDERER_URL, 20_000);
}

const MIME_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
});

function proxyGateway(request, response) {
  const headers = { ...request.headers, host: `${GATEWAY_HOST}:${GATEWAY_PORT}` };
  delete headers.connection;

  const upstream = http.request({
    hostname: GATEWAY_HOST,
    port: GATEWAY_PORT,
    path: request.url,
    method: request.method,
    headers,
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });

  upstream.on("error", (error) => {
    if (response.headersSent) return response.end();
    response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ code: "gateway_unavailable", message: error.message }));
  });
  request.pipe(upstream);
}

function resolveRendererAsset(distDirectory, requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://desktop.local").pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const candidate = path.resolve(distDirectory, relativePath);
  const isInsideDist = candidate === distDirectory || candidate.startsWith(`${distDirectory}${path.sep}`);

  if (isInsideDist && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  return path.join(distDirectory, "index.html");
}

function startRendererServer() {
  const distDirectory = path.join(PROJECT_ROOT, "dist");
  if (!fs.existsSync(path.join(distDirectory, "index.html"))) {
    throw new Error("No existe dist/index.html. Ejecutá npm run build antes de abrir la build desktop.");
  }

  rendererServer = http.createServer((request, response) => {
    if (request.url?.startsWith("/api/ai/")) return proxyGateway(request, response);

    const assetPath = resolveRendererAsset(distDirectory, request.url || "/");
    const contentType = MIME_TYPES[path.extname(assetPath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "content-type": contentType,
      "cache-control": assetPath.endsWith("index.html") ? "no-store" : "public, max-age=31536000, immutable",
    });
    fs.createReadStream(assetPath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    rendererServer.once("error", reject);
    rendererServer.listen(0, "127.0.0.1", () => {
      const address = rendererServer.address();
      resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

function isInternalNavigation(targetUrl, rendererOrigin) {
  try {
    return new URL(targetUrl).origin === new URL(rendererOrigin).origin;
  } catch {
    return false;
  }
}

async function createWindow() {
  await ensureGateway();
  if (!app.isPackaged) await ensureDevelopmentRenderer();
  const rendererOrigin = app.isPackaged ? await startRendererServer() : DEV_RENDERER_URL;

  mainWindow = new BrowserWindow({
    width: 1500,
    height: 940,
    minWidth: 1040,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#080c12",
    title: "Learning Workspace",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isInternalNavigation(url, rendererOrigin)) return;
    event.preventDefault();
    if (/^https?:/i.test(url)) shell.openExternal(url);
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => { mainWindow = null; });

  await mainWindow.loadURL(`${rendererOrigin}/react`);
}

function stopLocalServices() {
  shuttingDown = true;
  rendererServer?.close();
  rendererServer = null;
  if (rendererDevProcess && !rendererDevProcess.killed) rendererDevProcess.kill();
  rendererDevProcess = null;
  if (gatewayProcess && !gatewayProcess.killed) gatewayProcess.kill();
  gatewayProcess = null;
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  registerProviderSettingsIpc();
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  try {
    await createWindow();
  } catch (error) {
    console.error("[desktop] No se pudo iniciar:", error);
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow().catch(console.error);
  });
});

app.on("before-quit", stopLocalServices);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
