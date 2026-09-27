# Learning Workspace as a desktop application

The Electron version keeps the web application as the renderer and adds a secure desktop shell. It does not duplicate the React logic or create a second frontend.

## Interface experience

- The top bar works as a compact command bar: map identity, progress, and access to navigation.
- The navigation panel stays closed by default to prioritize the canvas.
- When opened, it gathers the graph selector, Grafo/Flashcards mode, categories, and next challenge.
- Cards are full-screen SPA routes and work as a separate workspace.
- A card's contextual navigation opens with `Ruta`; when closed, only the title, score, controls, and the active view remain visible.
- Lectura, Coaching, and Evaluar remain persistent surfaces in the left rail.

## Development

First set up `server/.env` from `server/.env.example`. Then run from the root:

```bash
npm run desktop:dev
```

The command starts Vite on `127.0.0.1:5173` and opens Electron. Electron checks `127.0.0.1:4317`; if the gateway does not exist, it starts it automatically using `server/.env`. Closing the window also terminates the gateway it started, but it does not touch a gateway that was already running.

## Local build and installer

Unpacked build for verification:

```bash
npm run desktop:pack
```

Windows installer:

```bash
npm run desktop:dist
```

The results land in `release/`. The gateway is compiled as a single Node file before packaging Electron.

The current configuration produces an unsigned local application and avoids the Windows codesigning toolchain. To distribute it publicly, it is advisable to configure a certificate and re-enable `win.signAndEditExecutable`.

Credentials are not included in the installer. On a packaged installation, the first run copies a template to:

```text
%APPDATA%\Learning Workspace\.env.example
```

Copy it as `.env` in the same folder and fill in the keys. The packaged gateway uses that directory as its local configuration.

## Architecture and security

```text
Electron main
├── Isolated BrowserWindow
│   └── React + Vite (renderer with no Node access)
├── Local HTTP server for assets and SPA fallback
│   └── /api/ai/* → proxy to the gateway
└── Local gateway process
    └── Direct MiniMax → FreeLLMAPI as fallback
```

- `contextIsolation` is active.
- `nodeIntegration` is disabled.
- The renderer is sandboxed.
- The preload only exposes runtime, platform, and versions; it does not expose the filesystem, processes, or secrets.
- Browser permissions are denied by default.
- External links open in the system browser.
- Production is served over HTTP loopback to preserve SPA routing and SSE streaming without depending on `file://`.
- IndexedDB and `localStorage` belong to the Electron profile, separate from the browser profile.

## Main files

- `electron/main.cjs`: window, lifecycle, local server, proxy, and gateway.
- `electron/preload.cjs`: minimal, secure boundary with the renderer.
- `src/App.jsx`: workspace shell and collapsible contextual navigation.
- `src/product-ui.css`: desktop composition and responsive styling.
