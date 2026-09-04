# ADR 0003 — Comprehensive Provider Directory and Protocol-Based Compatibility

- Status: **Accepted**
- Date: 2026-08-12
- Deciders: Learning Workspace Core
- Complements: [ADR 0001](./0001-llm-provider-registry.md) and [ADR 0002](./0002-multiple-provider-connections.md)

## Context

The initial connection panel presented only a curated library of seven providers. While functionally correct from a transport perspective, it fell short of delivering an open developer tool experience: users could not search for their preferred upstream provider, understand why it was unsupported, or discover compatible proxy endpoints that the gateway could execute.

Simultaneously, a visual directory cannot promise execution viability solely because a vendor appears in a catalog. The existing gateway implements `POST /chat/completions`, SSE streaming, and specific MiniMax reasoning features. It does not implement, for instance, native Anthropic Messages, Gemini `generateContent`, AWS sigv4/Bedrock, or OAuth handshakes. Presenting such providers as accepting an API key and the same endpoint would constitute a product defect and security risk.

## Decision

### Two Distinct Data Sources with Segregated Responsibilities

1. `shared/providerCatalog.js` is the **executable registry**. It contains endpoints the gateway natively calls via Chat Completions, verified default URLs, and curated nuances.
2. `https://models.dev/api.json` is the **discovery directory**. It is fetched upstream from the gateway, cached for six hours with ETag validation, and never receives user API keys, study responses, or arbitrary session data.

The public endpoint `GET /api/ai/providers/catalog` merges both sources and returns safe, sanitized metadata for browser consumption. The catalog is never used to run arbitrary code or inject unverified headers.

### Explicit Protocol Compatibility States

Every catalog row carries one of three explicit compatibility states:

| State | Definition | UI Action |
| --- | --- | --- |
| `ready` | The app supports its `chat-completions` protocol today. Includes verified presets and Models.dev metadata declaring `@ai-sdk/openai-compatible` with a URL. | **Connect** |
| `local` | Uses compatible protocol, but base URL targets private/local networks. | Connect only in Electron or local gateway; public Vercel explains and rejects. |
| `adapter-required` | Uses a native protocol not yet implemented in this gateway. | Searchable and visible without connection button; displays technical explanation. |

This explicitly decouples *“appears in directory”* from *“executable by runtime”*. Unsupported providers can still be accessed via OpenRouter or via the **Custom Compatible Endpoint** escape hatch if the user runs an OpenAI-compatible proxy.

### Persisted Connection Profiles

Connections remain named user profiles, adding `catalogProvider` as optional metadata:

```ts
type ProviderConnection = {
  id: string;
  label: string;
  adapter: string;
  catalogProvider: string | null;
  baseUrl: string;
  apiKey: string;
  model: string;
};
```

`adapter` is validated as a safe identifier and resolved against controlled transports. Unrecognized identifiers cannot execute arbitrary code or headers; they retain metadata links to Models.dev and execute the standard generic Chat Completions call.

Credentials remain in browser `sessionStorage` or Electron's encrypted system vault. The gateway receives keys strictly per request, never persisting or echoing them in SSE streams, logs, or error payloads.

### Configuration Experience

The settings panel operates as a professional developer tool:
1. **Connections**: Displays saved accounts and denotes the active profile.
2. **Select Provider**: Searchable broad directory, custom compatible endpoint escape hatch, and clear protocol status badges.
3. **Configure Connection**: Decouples model listing from minimal inference probes. The probe transmits no learning content.

Models can be chosen from Models.dev, discovered via `GET /models`, or supplied via custom manual slugs.

## Consequences

### Positive
- Users discover a broad provider landscape without manual maintenance of dozens of vendor catalogs.
- Compatible OpenAI-compatible providers can be configured immediately without waiting for software releases.
- Eliminates false promises of native support and prevents key leakage into incompatible protocols.
- Connection profile schema remains portable between Web and Electron.

### Accepted Costs and Limitations
- Models.dev downtime defaults to built-in presets gracefully.
- Providers tagged `adapter-required` require explicit gateway adapters, stream tests, and ADRs before enabling connection.
- Public deployments strictly enforce SSRF protection by disallowing private IP endpoints unless `ALLOW_PRIVATE_PROVIDER_URLS=true` is deliberately enabled for local development.
