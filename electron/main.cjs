const { app, BrowserWindow, Menu, nativeTheme, session, shell, safeStorage, ipcMain, dialog } = require("electron");
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

const PROVIDER_ADAPTERS = ["openai", "openrouter", "minimax", "groq", "mistral", "cerebras", "togetherai", "fireworks-ai", "deepseek", "xai", "nvidia", "huggingface", "perplexity", "deepinfra", "chutes", "baseten", "moonshotai", "zai", "stepfun", "alibaba", "freellmapi", "ollama", "lmstudio", "custom"];
const PROVIDER_PRESETS = {
  openai: { label: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "" },
  openrouter: { label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "" },
  minimax: { label: "MiniMax · Chat Completions", baseUrl: "https://api.minimax.io/v1", model: "MiniMax-M3" },
  groq: { label: "Groq", baseUrl: "https://api.groq.com/openai/v1", model: "" },
  mistral: { label: "Mistral AI", baseUrl: "https://api.mistral.ai/v1", model: "" },
  cerebras: { label: "Cerebras", baseUrl: "https://api.cerebras.ai/v1", model: "" },
  togetherai: { label: "Together AI", baseUrl: "https://api.together.xyz/v1", model: "" },
  "fireworks-ai": { label: "Fireworks AI", baseUrl: "https://api.fireworks.ai/inference/v1", model: "" },
  deepseek: { label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", model: "" },
  xai: { label: "xAI", baseUrl: "https://api.x.ai/v1", model: "" },
  nvidia: { label: "NVIDIA NIM", baseUrl: "https://integrate.api.nvidia.com/v1", model: "" },
  huggingface: { label: "Hugging Face", baseUrl: "https://router.huggingface.co/v1", model: "" },
  perplexity: { label: "Perplexity", baseUrl: "https://api.perplexity.ai", model: "" },
  deepinfra: { label: "Deep Infra", baseUrl: "https://api.deepinfra.com/v1/openai", model: "" },
  chutes: { label: "Chutes", baseUrl: "https://llm.chutes.ai/v1", model: "" },
  baseten: { label: "Baseten", baseUrl: "https://inference.baseten.co/v1", model: "" },
  moonshotai: { label: "Moonshot AI / Kimi", baseUrl: "https://api.moonshot.ai/v1", model: "" },
  zai: { label: "Z.AI", baseUrl: "https://api.z.ai/api/paas/v4", model: "" },
  stepfun: { label: "StepFun", baseUrl: "https://api.stepfun.com/v1", model: "" },
  alibaba: { label: "Alibaba Cloud / Qwen", baseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1", model: "" },
  freellmapi: { label: "FreeLLMAPI", baseUrl: "http://127.0.0.1:31415/v1", model: "auto" },
  ollama: { label: "Ollama", baseUrl: "http://127.0.0.1:11434/v1", model: "" },
  lmstudio: { label: "LM Studio", baseUrl: "http://127.0.0.1:1234/v1", model: "" },
  custom: { label: "Endpoint compatible", baseUrl: "", model: "" },
};

function normalizeProviderAdapter(value) {
  const adapter = String(value || "").trim().toLowerCase();
  if (adapter === "openai-compatible") return "custom";
  return /^[a-z0-9][a-z0-9._-]{0,79}$/.test(adapter) ? adapter : "custom";
}

function normalizeProviderProfile(profile) {
  const adapter = normalizeProviderAdapter(profile?.adapter);
  const preset = PROVIDER_PRESETS[adapter] || PROVIDER_PRESETS.custom;
  if (!profile || typeof profile !== "object") throw new Error("Perfil de provider inválido");
  const normalized = {
    id: String(profile.id || "provider_default").slice(0, 80),
    label: String(profile.label || preset.label).slice(0, 80),
    adapter,
    catalogProvider: /^[a-z0-9][a-z0-9._-]{0,79}$/.test(String(profile.catalogProvider || "").toLowerCase())
      ? String(profile.catalogProvider).toLowerCase()
      : (adapter === "custom" ? null : adapter),
    baseUrl: String(profile.baseUrl || preset.baseUrl).replace(/\/+$/, "").slice(0, 500),
    apiKey: String(profile.apiKey || "").slice(0, 4096),
    model: String(profile.model || preset.model).slice(0, 200),
  };
  if (!normalized.baseUrl || !normalized.apiKey || !normalized.model) throw new Error("El perfil está incompleto");
  return normalized;
}

function normalizeProviderDraft(profile, adapter = "custom", idFallback) {
  const source = profile && typeof profile === "object" ? profile : {};
  const normalizedAdapter = normalizeProviderAdapter(source.adapter || adapter);
  const preset = PROVIDER_PRESETS[normalizedAdapter] || PROVIDER_PRESETS.custom;
  return {
    id: String(source.id || idFallback || `provider_${normalizedAdapter}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`).slice(0, 80),
    label: String(source.label || preset.label).slice(0, 80),
    adapter: normalizedAdapter,
    catalogProvider: /^[a-z0-9][a-z0-9._-]{0,79}$/.test(String(source.catalogProvider || "").toLowerCase())
      ? String(source.catalogProvider).toLowerCase()
      : (normalizedAdapter === "custom" ? null : normalizedAdapter),
    baseUrl: String(source.baseUrl || preset.baseUrl).replace(/\/+$/, "").slice(0, 500),
    apiKey: String(source.apiKey || "").slice(0, 4096),
    model: String(source.model || preset.model).slice(0, 200),
  };
}

function normalizeProviderState(value) {
  const fallback = { version: 4, activeProfileId: null, profiles: [] };
  if (!value || typeof value !== "object") return fallback;
  if (Array.isArray(value.profiles)) {
    const profiles = normalizeProfileList(value.profiles);
    const activeProfileId = String(value.activeProfileId || "");
    return {
      version: 4,
      activeProfileId: profiles.some((profile) => profile.id === activeProfileId) ? activeProfileId : null,
      profiles,
    };
  }
  const entries = value.profiles && typeof value.profiles === "object"
    ? Object.entries(value.profiles).map(([adapter, profile]) => ({ ...profile, adapter: legacyAdapter(adapter, profile) }))
    : [value];
  const profiles = normalizeProfileList(entries);
  const activeAdapter = legacyAdapter(value.activeAdapter, value.profiles?.[value.activeAdapter]);
  return {
    version: 4,
    activeProfileId: profiles.find((profile) => profile.adapter === activeAdapter)?.id || null,
    profiles,
  };
}

function normalizeProfileList(values) {
  const usedIds = new Set();
  return values.map((value, index) => {
    const adapter = legacyAdapter(value?.adapter, value);
    const requestedId = String(value?.id || "");
    const id = requestedId && requestedId !== "provider_default" && !usedIds.has(requestedId)
      ? requestedId
      : `provider_${adapter}_${index + 1}`;
    usedIds.add(id);
    return normalizeProviderDraft({ ...value, adapter, id }, adapter, id);
  });
}

function legacyAdapter(value, profile) {
  const adapter = String(value || "").trim().toLowerCase();
  if (adapter === "openai" && profile?.label === "OpenAI compatible") return "custom";
  if (adapter === "openai-compatible") return "custom";
  return normalizeProviderAdapter(adapter);
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

// Native dialog texts follow the UI language sent by the renderer (English by default).
const DIALOG_TEXT = {
  en: { save: "Save learning backup", open: "Select backup file", json: "JSON files", all: "All files" },
  es: { save: "Guardar respaldo de aprendizaje", open: "Seleccionar archivo de respaldo", json: "Archivos JSON", all: "Todos los archivos" },
};
const dialogText = (locale) => DIALOG_TEXT[locale] ?? DIALOG_TEXT.en;

function registerBackupIpc() {
  ipcMain.handle("backup:save", async (_event, { content, defaultFilename, locale }) => {
    const text = dialogText(locale);
    try {
      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: text.save,
        defaultPath: defaultFilename || `learning-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`,
        filters: [
          { name: text.json, extensions: ["json"] },
          { name: text.all, extensions: ["*"] },
        ],
      });
      if (canceled || !filePath) return { canceled: true };
      await fs.promises.writeFile(filePath, content, "utf8");
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error?.message || String(error) };
    }
  });

  ipcMain.handle("backup:load", async (_event, { locale } = {}) => {
    const text = dialogText(locale);
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: text.open,
        properties: ["openFile"],
        filters: [
          { name: text.json, extensions: ["json"] },
          { name: text.all, extensions: ["*"] },
        ],
      });
      if (canceled || !filePaths || !filePaths[0]) return { canceled: true };
      const content = await fs.promises.readFile(filePaths[0], "utf8");
      return { success: true, content, filePath: filePaths[0] };
    } catch (error) {
      return { success: false, error: error?.message || String(error) };
    }
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
      ALLOW_PRIVATE_PROVIDER_URLS: "true",
      GATEWAY_HOST,
      GATEWAY_PORT: String(GATEWAY_PORT),
    },
  });

  gatewayProcess.stdout?.on("data", (chunk) => process.stdout.write(`[gateway] ${chunk}`));
  gatewayProcess.stderr?.on("data", (chunk) => process.stderr.write(`[gateway] ${chunk}`));
  gatewayProcess.once("exit", (code) => {
    if (!shuttingDown && code !== 0) console.error(`[desktop] gateway exited with code ${code}`);
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
    if (!shuttingDown && code !== 0) console.error(`[desktop] Vite exited with code ${code}`);
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
    // --bg-app of the theme the renderer will pick by default (system setting); see src/ui/theme/theme.js.
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#100E0C" : "#F7F4EF",
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
  registerBackupIpc();
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
