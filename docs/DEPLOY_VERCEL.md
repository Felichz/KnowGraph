# The demo site, and self-hosting the web build

## What know-graph.vercel.app serves

The Vercel project serves only the static demo page in `site/`: a walkthrough video, how the app works, and the links to the Windows release and the source. `vercel.json` publishes `site/` as is (no install, no build), and `.vercelignore` uploads nothing else, so `api/` is never deployed as a function.

There is no hosted app. Every AI feature needs a language model, and the project does not pay for one on behalf of visitors; people run KnowGraph locally (see the README) with their own provider or a local model.

To update the page, edit `site/index.html` (and `site/media/`) and push to `main`. Preview it locally with any static server:

```bash
npx serve site
```

The video is rendered with HyperFrames from a composition that recreates the UI with the real scores of one study session; it is not part of this repository.

## Self-hosting the web build

The web build still works on a server you control, with the gateway on the same origin. The handler in `api/ai/[...slug].js` mounts the gateway from `server/`, so a Vercel project of your own can serve both:

- Build command `npm run build`, output `dist/`.
- Keep `api/ai/[...slug].js` (remove it from `.vercelignore`) and rewrite `/api/ai/:path*` to it; rewrite every other path to `/index.html` for the SPA routes.
- Give the function a long `maxDuration` (evaluations stream for up to a few minutes).

Visitors then bring their own key in **Settings → AI connections**: the key travels with each request and is never stored by the gateway. When deployed publicly the gateway only accepts HTTPS provider endpoints that resolve to public IPs (`ALLOW_PRIVATE_PROVIDER_URLS=false`), so local models are not reachable from a hosted deployment.

Do not set a provider key as a `VITE_*` variable or commit it. A server-side default (`MINIMAX_API_KEY`, `FREELLMAPI_*`) makes every visitor's requests bill to that key.

For a frontend and gateway on different origins, set `VITE_AI_API_URL` at build time and `CORS_ALLOWED_ORIGINS` on the gateway.
