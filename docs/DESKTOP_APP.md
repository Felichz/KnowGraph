# KnowGraph as a desktop app

The Electron app is the main way to run KnowGraph. It keeps the web application as the renderer and adds a desktop shell that also runs the AI gateway, so there is nothing else to start. It does not duplicate the React code.

## Development

From the root, after `npm install` and `npm install --prefix server`:

```bash
npm run desktop:dev
```

This starts Vite on `127.0.0.1:5173` and opens Electron. Electron checks `127.0.0.1:4317`; if no gateway answers, it starts one from `server/` (reading `server/.env` if it exists). Closing the window stops the gateway it started, and never touches one that was already running.

## Installer

```bash
npm run desktop:pack   # unpacked build in release/win-unpacked, for checking
npm run desktop:dist   # release/KnowGraph-Setup-<version>.exe and a portable zip
```

Both build the renderer (`dist/`) and bundle the gateway into one file (`electron-dist/gateway.cjs`), which is shipped next to the app as an extra resource with a template of its settings (`gateway.env.example`).

The build is not code-signed. Windows SmartScreen asks for confirmation on first run; signing needs a certificate and re-enabling `win.signAndEditExecutable`.

No credentials ship in the installer. Models are added in the app, under **Settings → AI connections**. Optional gateway settings live in `%APPDATA%\KnowGraph\.env` (the first run copies a template next to it as `.env.example`).

## Publishing a release

1. Bump `version` in `package.json` and commit.
2. `npm run desktop:dist`.
3. Create a GitHub release tagged `v<version>` and attach `release/KnowGraph-Setup-<version>.exe` and `release/KnowGraph-<version>-win-x64.zip`.

The demo site and the README link to `releases/latest`, so they pick up the new release without changes.

## Architecture and security

```text
Electron main
├── Isolated BrowserWindow
│   └── React renderer (no Node access)
├── Local HTTP server for the built renderer, with SPA fallback
│   └── /api/ai/* → proxy to the gateway
└── Local gateway process (the same server/ code)
    └── the user's provider, chosen per request
```

- `contextIsolation` is on, `nodeIntegration` is off, and the renderer is sandboxed.
- The preload only exposes runtime, platform and versions: no filesystem, processes or secrets.
- Browser permissions are denied by default, and external links open in the system browser.
- The packaged app serves the renderer over HTTP on loopback, which keeps SPA routes and SSE streaming working without `file://`.
- IndexedDB and `localStorage` belong to the Electron profile, separate from any browser profile.

## Main files

- `electron/main.cjs`: window, lifecycle, local server, proxy and gateway process.
- `electron/preload.cjs`: the minimal boundary with the renderer.
