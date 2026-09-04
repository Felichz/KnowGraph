# ADR 0001 — LLM Provider Registry and BYOK Configuration

- Status: **Accepted**
- Date: 2026-08-11
- Deciders: Learning Workspace Core

## Context

Learning Workspace uses LLM models for live coaching, canonical evaluation, and deep-dive conceptual chat. It is deployed as both a web application and an Electron desktop app, requiring user credential acceptance without turning the gateway into a centralized secrets store or coupling the UI to a specific vendor.

The initial prototype had two adapters (`openai` and `minimax`) and treated `GET /models` as a connection test. That was an invalid assumption: some Chat Completions-compatible providers do not expose that endpoint, or protect/implement it differently (MiniMax being a key example).

We also needed to provide a useful model selector without manually maintaining an internal global catalog that would inevitably become outdated.

## Decision

### 1. Controlled Registry, Not Arbitrary Runtime Code

The server defines presets, transport, and request nuances in `server/ai/providerRegistry.js`.

Initial adapters are:

| Adapter | Purpose |
|---|---|
| `openai` | Escape hatch for any Chat Completions-compatible endpoint. |
| `openrouter` | Preset with endpoint and OpenRouter catalog, retaining compatible transport. |
| `minimax` | Native adapter handling `thinking`, `reasoning_split`, and structured output fallback. |

A profile cannot declare npm packages, execute arbitrary code, or transform requests unpredictably. This boundary is critical for both Electron and public web instances: configuration represents data, not an execution surface.

```ts
type ProviderProfile = {
  id: string;
  label: string;
  adapter: "openai" | "openrouter" | "minimax";
  baseUrl: string;
  apiKey: string;
  model: string;
};
```

The registry derives capabilities and request behavior. The UI does not force the user to determine whether their provider accepts `response_format`: the gateway attempts it when appropriate and falls back to block parsing if rejected by the provider.

### 2. Separation of Inference Verification from Model Discovery

Two distinct operations are established:

| Operation | Endpoint | Validation Target |
|---|---|---|
| Model Test | `POST /api/ai/providers/test` | Executes a minimal completion against the selected model. Validates real URL, credentials, routing, and model slug. |
| Catalog Discovery | `POST /api/ai/providers/models` | Merges upstream `/models` with local/remote catalogs. Never determines if inference works. |

The test completion contains no user study notes or lesson text; it requests a simple `OK` response. It is billable by the provider and runs solely upon explicit user request.

Providers without `/models` remain fully valid: users can pick from presets or write the slug manually.

### 3. Models.dev as Enrichment, Not Runtime Authority

`server/ai/modelCatalog.js` queries `https://models.dev/api.json` from the server, without transmitting user URLs, API keys, prompts, or profiles. Results are cached in memory for six hours and enrich the selector with names, context limits, and capabilities.

Precedence for catalog resolution:

1. Configured endpoint response (`/models`), when present.
2. Explicit profile model and known preset models.
3. Models.dev metadata.
4. Manual user text input.

Remote lists never override base URLs, headers, credentials, or request behavior. If Models.dev is unreachable, presets and manual entries remain fully functional.

### 4. Separate Lifecycles for Configuration and Secrets

Settings state is version 3 and retains an independent draft per preset. Switching from MiniMax to OpenRouter preserves field values written for the other provider.

- **Electron:** Profiles are encrypted using OS native `safeStorage`.
- **Deployed Web:** Stored in `sessionStorage`; discarded upon closing the tab.
- **Gateway:** Receives keys per request to perform inference; never writes keys to disk or includes them in responses or logs.

The gateway automatically accepts its serving origin; an SPA deployed alongside `api/ai/**` on Vercel requires no extra CORS setup. Separately hosted frontends must be listed explicitly in `CORS_ALLOWED_ORIGINS`; wildcard `*` is never permitted on a BYOK gateway.

### 5. Preserved Product Data Contract

Providers emit vendor-specific text or SSE streams. The gateway retains sole responsibility for parsing, validating, and emitting standardized events consumed by the app: progress, subscores, coverage, hints, and final evaluation results. The UI never consumes vendor-specific chunk formats.

## Consequences

### Positive
- Compatible providers can be added without introducing new adapters.
- Specialized providers remain isolated and testable.
- Model selectors no longer fail by falsely conflating `/models` with inference readiness.
- Models.dev metadata reduces manual maintenance without exposing secrets.
- Future migration to Vercel AI SDK can be scoped to transport internals behind the registry without altering the SSE gateway or UI.

### Accepted Costs and Limitations
- In-memory catalog caching is not shared across serverless instances (an optimization, not a correctness requirement).
- Community catalogs may lag; manual slugs and endpoint catalogs retain priority.
- Only Chat Completions is implemented initially; native `Anthropic Messages` or alternative transports will require dedicated adapters when needed.
- Inference probes consume minimal user tokens.

## Alternatives Considered

### Embedded LiteLLM
Discarded. Would introduce a Python/proxy daemon and operational complexity for use cases already satisfied by an OpenAI-compatible adapter. Users can still point to an external LiteLLM instance as an endpoint.

### OpenRouter as Sole Abstraction
Discarded. OpenRouter is a valuable preset, but making it mandatory would eliminate direct BYOK and introduce an unnecessary third-party dependency.

### Immediate Vercel AI SDK Adoption
Postponed, not rejected. It remains a strong candidate for replacing internal transport implementations, but establishing stable application boundaries (controlled registry → own gateway → own SSE) was prioritized first.
