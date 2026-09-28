# Public deploy: Vercel + BYOK

The recommended mode runs the SPA and the Node gateway on the same Vercel
deployment:

```text
Browser --> Vercel (React/Vite + /api/ai) --> OpenAI-compatible provider
            no persisted API keys
```

The functions in `api/ai/**` reuse the gateway from `server/`. Vercel allows
streams of up to five minutes in this configuration. Same origin is accepted
automatically; there is no need to configure CORS for the deployment's own URL.

## 1. Deploy to Vercel

The repository already includes `vercel.json`. From the root, with the Vercel
session signed in:

```bash
npx vercel --prod
```

Do not add a provider API key to Vercel for BYOK mode. If you want a default
provider for internal use, define `MINIMAX_API_KEY` or `FREELLMAPI_*` only as
server environment variables, never as `VITE_*` or in the repository.

The health check for this deployment is:

```text
https://know-graph.vercel.app/api/ai/status
```

A `200` confirms the gateway is alive. `gateway.configured: false` is normal
when you have not defined a default provider: each person provides their
profile from the AI connections settings.

## 2. External gateway (optional)

Use Render or another Node process if you need different execution limits or
want to isolate the gateway. In that case configure in Vercel:

```text
VITE_AI_API_URL=https://TU-GATEWAY.example.com
```

And on the external gateway add a concrete allowlist, for example:

```text
CORS_ALLOWED_ORIGINS=https://know-graph.vercel.app
```

For one-off previews you can add more comma-separated origins. Never use
`*`: the gateway accepts one API key per request.

## 3. Configure a provider from the application

Open the **IA** button in the top bar. The directory lets you search known providers and shows which ones are connectable from this gateway. **Compatible** rows use `POST /chat/completions` and SSE streaming; **Requiere adaptador** rows are shown for discovery, but do not accept a connection until the gateway implements their native protocol. For MiniMax, choose the preset, paste your API key, and select the model.

- In the browser, the profile lives in `sessionStorage`: it is deleted when the tab closes.
- In Electron, the profile is encrypted with the operating system's secure storage.
- The API key travels only to the gateway, in the request that needs it. The gateway does not write it to disk or include it in responses, errors, or logs.
- In production the gateway rejects non-HTTPS, local, or private-network endpoints. For explicit local development, `ALLOW_PRIVATE_PROVIDER_URLS=true` can be used.

Use **Probar modelo** before saving. The test makes a minimal inference
against `POST /chat/completions`; this way it validates the real URL, key, and
slug. The catalog is a separate operation and a provider can be used even
without `/models`.

## Final checklist

- [ ] `npm run check` passes locally.
- [ ] The Vercel deployment answers `200` on `/api/ai/status`.
- [ ] If you use an external gateway, `CORS_ALLOWED_ORIGINS` contains the Vercel domain.
- [ ] If you use an external gateway, `VITE_AI_API_URL` points to its HTTPS URL and Vercel was redeployed.
- [ ] A real evaluation was verified with a BYOK profile from the UI.
- [ ] There are no keys in Git, `.env` files, `VITE_*`, or shared logs.

## Limits of this public mode

BYOK prevents the app from sharing a provider key, but the gateway remains a public proxy. For an open launch, add authentication, per-user/IP rate limiting, and size/cost limits before allowing anonymous traffic.
