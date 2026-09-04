# ADR 0002 — Curated Library and Multiple LLM Connections

- Status: **Accepted**
- Date: 2026-08-11
- Deciders: Learning Workspace Core
- Complements: [ADR 0001](./0001-llm-provider-registry.md)

## Context

The initial BYOK panel presented three presets inside a single form and retained one draft per `adapter`. While sufficient for trying a single provider, it failed to reflect how developers manage real accounts: a user may hold a personal OpenRouter account, a corporate OpenAI account, and a local compatible endpoint, requiring them to coexist without overwriting each other.

The product requires two distinct capabilities:
1. A small, dependable curated library of providers that the current gateway can execute via `POST /chat/completions`.
2. Named, user-defined connections, where exactly one can be designated active for coaching, chat, and evaluation.

The goal is not to present an exhaustive vendor marketplace or promise unsupported transports. For example, Anthropic Messages and OpenAI Responses require distinct protocols and are omitted from presets until natively supported by the gateway.

## Decision

### Shared and Explicit Provider Catalog

`shared/providerCatalog.js` is the single source of truth for the visible library and gateway registry:

```ts
type ProviderPreset = {
  id: string;
  group: "Direct APIs" | "Routers" | "Custom";
  label: string;
  description: string;
  defaultBaseUrl: string;
  catalogProvider: string | null;
  transport: "chat-completions";
  discovery: string;
};
```

Initial presets include OpenAI, OpenRouter, MiniMax, Groq, Mistral AI, and Cerebras, alongside **Custom Compatible Endpoint** as an escape hatch. All share the Chat Completions transport; MiniMax retains its custom reasoning gateway handling. Base URLs are verified against official provider documentation.

Models.dev remains an enrichment source for **model metadata**, not an execution dependency or list of executable providers.

### Named Connections, Not Per-Adapter Drafts

Persisted configuration advances to schema version 4:

```ts
type ProviderConnection = {
  id: string;
  label: string;
  adapter: ProviderPreset["id"];
  baseUrl: string;
  apiKey: string;
  model: string;
};

type ProviderSettings = {
  version: 4;
  activeProfileId: string | null;
  profiles: ProviderConnection[];
};
```

- `profiles` can store multiple connections targeting the same provider preset.
- `activeProfileId` is the sole selection applied to outgoing AI requests.
- `null` active ID indicates fallback to the operator default gateway, without clearing personal profiles.
- Saving a connection can be performed without activating it immediately.
- Migrations preserve v1–v3 profiles cleanly.

Web deployments store connections in `sessionStorage`; Electron uses OS native encrypted storage. The gateway receives credentials per request and never persists API keys.

### UI Flow Separation

The settings panel separates concerns across three views:
1. **Connections List**: Displays active connection, saved profiles, and explicit actions to activate, edit, or delete.
2. **Add Connection**: Lists curated providers by category, including the custom escape hatch.
3. **Configure Connection**: Captures endpoint, credential, and model. Discovery and minimal inference probes remain separate operations.

The probe transmits a simple `OK` completion request; student responses or study card content are never included. Empty upstream catalogs do not block connection: manual model slugs remain valid.

## Consequences

### Positive
- UI represents real entity hierarchies: Provider → Connection → Model → Active.
- Seamless switching between personal and corporate accounts without re-entering credentials.
- Adding compatible endpoints is a controlled data contract update, not an ambiguous user prompt.
- Custom endpoint flexibility remains preserved without fabricating unsupported native transports.

### Accepted Costs and Limitations
- The library is curated rather than a dynamic marketplace.
- Each new native protocol requires dedicated ADRs, validation, and test suites.
- Public deployments reject non-HTTPS or private IP endpoints unless `ALLOW_PRIVATE_PROVIDER_URLS=true` is explicitly enabled for local gateways.
