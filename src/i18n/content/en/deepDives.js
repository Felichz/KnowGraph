// React deep dives: English overlay for src/reactDeepDives.js (REACT_DEEP_DIVES).
// Keep keys, array lengths and source order identical to the Spanish shape; nodeIds and hrefs come from the Spanish dive.
export default {
  "render_vs_commit": {
    "title": "Why does React separate render and commit?",
    "aliases": ["render and commit", "render, reconciliation and commit", "after the commit", "during render"],
    "answer": "During render, React calculates what the interface should show. That phase must be pure because it can be repeated, paused or discarded. In commit, it applies the chosen result to the DOM. Separating them lets React prepare work without producing visible effects before it knows that work will be used.",
    "example": "If a render is interrupted by a more urgent update, an API call made during render would already have escaped React's control. An Effect, by contrast, runs after the result has been confirmed in the commit.",
    "nuance": "A re-render does not mean the whole DOM changes. The component can run and, after reconciliation, there may be no DOM mutation at all for part of the tree.",
    "sources": [
      { "label": "Render and Commit (React)" },
      { "label": "Components and Hooks must be pure (React)" }
    ]
  },
  "state_snapshot": {
    "title": "Why is state a snapshot?",
    "aliases": ["state is a snapshot", "snapshot of the render", "previous snapshot", "stale value"],
    "answer": "Each render receives a fixed snapshot of props and state. The handlers created by that render close over that snapshot. A setter requests another render; it does not retroactively modify the variables the current handler is already using.",
    "example": "Three calls to setNumber(number + 1) from the same handler read the same number. Three updaters setNumber(n => n + 1) form a queue and each one receives the result of the previous one.",
    "nuance": "This does not mean the update is slow. It means React keeps stable semantics for the code that is already running and applies the new value in another render.",
    "sources": [
      { "label": "State as a Snapshot (React)" },
      { "label": "Queueing a Series of State Updates (React)" }
    ]
  },
  "identity_and_keys": {
    "title": "Why does a key control identity?",
    "aliases": ["stable key", "stable keys", "stable identity", "domain identity", "preserved state", "reset a subtree"],
    "answer": "React associates state with a position in the tree: component type, position and key. A key tells React that an entity is still the same even if it moves. If the key changes, React treats the subtree as a different identity and resets its state.",
    "example": "When a row is inserted at the beginning, key={item.id} keeps the edited input with its record. key={index} can move that visual state to another row.",
    "nuance": "useId does not generate list keys. Keys must come from the data because they represent domain identity; useId is for accessibility relationships within an instance.",
    "sources": [
      { "label": "Preserving and Resetting State (React)" },
      { "label": "Rendering Lists (React)" }
    ]
  },
  "effects_are_sync": {
    "title": "Why is an Effect synchronization and not a generic lifecycle?",
    "aliases": ["external synchronization", "external system", "external systems", "you might not need an Effect", "don't need an Effect"],
    "answer": "An Effect declares how to keep an external system aligned with React's committed state: a connection, listener, timer, imperative widget or request. If you are only calculating a value to render or responding to a click, there is no external system to synchronize.",
    "example": "Connecting to a chat depends on roomId and requires disconnect in cleanup. Calculating filteredItems from items and query happens during render; submitting a form happens in the handler or Action that represents that intent.",
    "nuance": "The useful lifecycle is the synchronization's: start with some dependencies, stop that version and start again when they change. It does not necessarily match the mount/update/unmount mental story of the component.",
    "sources": [
      { "label": "Synchronizing with Effects (React)" },
      { "label": "You Might Not Need an Effect (React)" },
      { "label": "Lifecycle of Reactive Effects (React)" }
    ]
  },
  "strict_mode_probe": {
    "title": "Why does Strict Mode run extra work?",
    "aliases": ["Strict Mode", "double render", "double invocation", "setup+cleanup"],
    "answer": "In development, Strict Mode repeats functions that should be pure and runs an extra setup and cleanup cycle. It is a probe: it tries to surface mutations during render and resources that are not cleaned up correctly.",
    "example": "If an Effect opens a connection but its cleanup does not close it, the extra cycle leaves two connections and reveals the bug before production.",
    "nuance": "It is not production behavior, nor a reason to disable the mode. The goal is that repeating render or setup-cleanup does not change correctness.",
    "sources": [
      { "label": "StrictMode (React)" }
    ]
  },
  "controlled_source_of_truth": {
    "title": "Why does it matter who controls the value?",
    "aliases": ["source of truth", "controlled and uncontrolled", "controlled vs. uncontrolled", "controlled mode"],
    "answer": "Controlled means the parent provides the current value and decides every change; uncontrolled means the component or the DOM keeps the initial value and how it evolves. The difference defines ownership, not quality.",
    "example": "A controlled Dialog receives open and onOpenChange so a route or flow can coordinate its visibility. An uncontrolled input can leave the text in the DOM and hand it over on submit through FormData.",
    "nuance": "A component should not switch from controlled to uncontrolled during its lifetime. It should also be clear whether a callback reports an intent or confirms that the value has already changed.",
    "sources": [
      { "label": "Sharing State Between Components (React)" },
      { "label": "input (React DOM)" }
    ]
  },
  "server_state_authority": {
    "title": "Why is server state not simply global state?",
    "aliases": ["server state", "source of truth lives", "freshness", "invalidation", "fresh data"],
    "answer": "The central difference is authority. The browser owns a draft or a modal; the server owns shared orders and can change them without this client taking part. A local cache only keeps a temporary observation of that data.",
    "example": "Two users edit the same order. Even if Redux keeps a perfect copy, it does not know the other user changed it. You need a policy for freshness, revalidation, invalidation or real-time events.",
    "nuance": "Client state can persist in the URL or in storage, and server state can be available offline thanks to a cache. Persistence and synchronicity alone do not define the category.",
    "sources": [
      { "label": "TanStack Query Overview" },
      { "label": "Managing State (React)" }
    ]
  },
  "query_identity": {
    "title": "Why is queryKey part of the data model?",
    "aliases": ["queryKey", "identity key", "cache entry", "cache by filter"],
    "answer": "The queryKey declares which variables make two results different data. The cache uses that identity to share, refresh and invalidate the right observation.",
    "example": "['orders', { status, page }] separates pages and filters. If page is not in the key, page 2 can reuse the result from page 1.",
    "nuance": "A correct key does not decide how long the data stays fresh or which mutations affect it. Identity, staleTime and invalidation are separate decisions.",
    "sources": [
      { "label": "Query Keys (TanStack Query)" }
    ]
  },
  "optimistic_prediction": {
    "title": "Why is optimistic UI a prediction?",
    "aliases": ["optimistic update", "optimistic UI", "useOptimistic", "rollback"],
    "answer": "The interface shows a result that is not yet authoritative. That is why it must distinguish pending, reconcile with the canonical response and explain or revert a rejection.",
    "example": "For a like, the counter can be incremented temporarily. If the server returns the real count, that value replaces the projection; if it rejects, the confirmed state is restored and a retry is offered.",
    "nuance": "useOptimistic derives the view again from the base value when the Action finishes. TanStack Query usually has you cancel/refetch, save a snapshot and restore it in onError. They are different mechanisms.",
    "sources": [
      { "label": "useOptimistic (React)" },
      { "label": "Optimistic Updates (TanStack Query)" }
    ]
  },
  "transition_priority": {
    "title": "Why is a transition not a debounce?",
    "aliases": ["transition", "useTransition", "startTransition", "useDeferredValue", "responsive UI"],
    "answer": "A transition marks a render update as non-urgent so that an urgent interaction can interrupt it. It does not necessarily reduce the number of events or delay a request by time.",
    "example": "The input updates its text immediately and the expensive list is recalculated in a transition. A debounce, instead, waits for an interval before starting a search; AbortController can cancel the old request.",
    "nuance": "useDeferredValue defers the value consumed by one part of the tree; useTransition lets you mark the setter or Action that starts the update and observe isPending.",
    "sources": [
      { "label": "useTransition (React)" },
      { "label": "useDeferredValue (React)" }
    ]
  },
  "browser_history_contract": {
    "title": "Why does a SPA still need the server for its URLs?",
    "aliases": ["History API", "pushState", "popstate", "deep links", "deep URL", "fallback"],
    "answer": "pushState changes the history entry without requesting another document. But if the user opens that URL from scratch, the request does reach the server. The hosting must return the right entry point or resolve the route on the server.",
    "example": "Navigating internally to /orders/42 works with the router. On refresh, Nginx receives GET /orders/42; in a purely client-side SPA it usually has to serve index.html so the router can interpret the URL.",
    "nuance": "With SSR or a data router backed by a server, the route can have a real handler and not use a universal fallback. The configuration depends on the rendering mode.",
    "sources": [
      { "label": "History: pushState (MDN)" },
      { "label": "Routing (React Router)" }
    ]
  },
  "authn_vs_authz": {
    "title": "Why does hiding a route not authorize anything?",
    "aliases": ["authentication and authorization", "identity and permissions", "401", "403", "protected route"],
    "answer": "The router only controls which UI this client presents. The API receives requests that can come from DevTools, curl or another program, so it must check identity, permission and ownership of the resource again.",
    "example": "Not showing the Delete button improves the UX, but DELETE /orders/42 must verify in Rails that the authenticated user can delete that order.",
    "nuance": "401 indicates that an acceptable credential is missing; 403 indicates that the identity was understood but does not have permission. Some APIs deliberately return 404 to avoid revealing that a resource exists.",
    "sources": [
      { "label": "HTTP 401 (MDN)" },
      { "label": "HTTP 403 (MDN)" }
    ]
  },
  "token_storage_tradeoff": {
    "title": "Why is there no single correct storage for auth?",
    "aliases": ["Access Token in memory", "Refresh Token", "HttpOnly cookie", "localStorage", "SameSite"],
    "answer": "Each design moves the risk. An HttpOnly cookie prevents JavaScript from reading the secret, but the browser attaches it automatically and you have to analyze CSRF. A token accessible to JavaScript allows an explicit Authorization header, but an XSS can steal it.",
    "example": "A same-site app can use an HttpOnly session with SameSite and a CSRF token. Another architecture can use a short-lived access token in memory and a refresh cookie. The choice depends on domains, backend, threats and the renewal experience.",
    "nuance": "HttpOnly mitigates direct theft, not every consequence of XSS: a malicious script can still perform actions while the session is active. The backend always authorizes each operation.",
    "sources": [
      { "label": "Set-Cookie (MDN)" },
      { "label": "Session Management Cheat Sheet (OWASP)" }
    ]
  },
  "runtime_validation": {
    "title": "Why does TypeScript not validate an HTTP response?",
    "aliases": ["runtime validation", "does not validate JSON", "as Order", "schema"],
    "answer": "Types are erased when JavaScript is generated. The server can respond with a different shape and the browser does not run the TypeScript interface. A parser or schema inspects the real value at the boundary.",
    "example": "const body: Order = await response.json() trusts the value without checking it. OrderSchema.parse(await response.json()) produces a validated Order or a localized error.",
    "nuance": "There is no need to validate every internal object again if a trusted boundary already exists. The depth of validation should follow the risk and the contract of the system.",
    "sources": [
      { "label": "TypeScript for React (React)" },
      { "label": "TypeScript Handbook: Erased Types" }
    ]
  },
  "native_semantics": {
    "title": "Why does a native element carry so much behavior?",
    "aliases": ["native semantics", "native element", "native parity", "semantic HTML"],
    "answer": "A button, input or select already takes part in keyboard handling, focus, forms, accessibility and browser APIs. Replacing it with divs moves those obligations to your code.",
    "example": "A button responds to Enter and Space, can be disabled, receives focus and exposes a role and a name. A div with onClick only covers the pointer until you implement the rest.",
    "nuance": "ARIA describes semantics; it does not implement behavior. A custom widget can be correct, but it must follow a complete pattern and justify the additional ownership.",
    "sources": [
      { "label": "Accessibility attributes (React DOM)" },
      { "label": "ARIA Authoring Practices Guide" }
    ]
  },
  "error_boundary_scope": {
    "title": "Why do Error Boundaries not catch everything?",
    "aliases": ["Error Boundary", "Error Boundaries", "error boundary component"],
    "answer": "An Error Boundary protects the render of a subtree and certain React lifecycles. An error that occurs in an event handler or in async work is already outside that render and needs handling in the flow that started it.",
    "example": "If a widget throws during render, the boundary can replace it. If submit() rejects inside onClick, the handler or the mutation tooling must turn it into error state or propagate it through an integration designed for that.",
    "nuance": "Frameworks and routers can connect loaders, Actions and errors to their own boundaries. That is a capability of that integration, not an automatic extension of a regular class Error Boundary.",
    "sources": [
      { "label": "Component: catching rendering errors (React)" },
      { "label": "Error Boundaries (React Router)" }
    ]
  },
  "cache_freshness": {
    "title": "Why does cached not mean fresh?",
    "aliases": ["staleTime", "gcTime", "revalidation", "stale data", "previous data"],
    "answer": "The cache answers which known value we have; the freshness policy answers how long we trust it without querying again. Keeping a value in memory and considering it fresh are independent decisions.",
    "example": "An order can stay in the cache for 30 minutes while inactive, yet be considered stale immediately. When you return to the screen, the known data is shown while it is revalidated.",
    "nuance": "staleTime belongs to the query cache. Cache-Control belongs to the HTTP protocol. They can be combined, but they operate in different layers and with different keys.",
    "sources": [
      { "label": "Important Defaults (TanStack Query)" },
      { "label": "HTTP caching (MDN)" }
    ]
  },
  "ownership_boundary": {
    "title": "Why is ownership an architecture decision?",
    "aliases": ["ownership", "sources of truth", "source of truth", "coherent boundary", "module boundary"],
    "answer": "Ownership names who can confirm a value or a transition. It makes it possible to decide where to validate, who notifies changes and which copy can become stale. Without an owner, two layers try to correct each other and impossible states appear.",
    "example": "The URL owns shareable filters, the query cache observes orders from the server and an input owns its draft. Copying all three into a global store does not create an authority: it creates three versions to synchronize.",
    "nuance": "The owner is not always a component. It can be the browser, a route, an external store, a cache or the backend. The right boundary follows the semantics of the data.",
    "sources": [
      { "label": "Choosing the State Structure (React)" },
      { "label": "Sharing State Between Components (React)" }
    ]
  },
  "observable_component_contract": {
    "title": "Why is the contract larger than the props?",
    "aliases": ["everything observable", "a component's API", "focused contract", "focused contracts"],
    "answer": "A consumer also depends on the DOM, the ref, accessible names, callback timing, form behavior, focus and styling selectors. Even if the TypeScript types do not change, modifying any of those surfaces can break an application.",
    "example": "Changing a Button from button to div keeps props like onClick, but loses submit, disabled, keyboard handling and the ref to HTMLButtonElement. The signature looks stable while the real contract changed.",
    "nuance": "Not every internal detail is public. The design task is to decide which observations are promised and keep the freedom to replace the rest.",
    "sources": [
      { "label": "Passing Props to a Component (React)" },
      { "label": "Common components (WAI-ARIA APG)" }
    ]
  },
  "external_snapshot_protocol": {
    "title": "Why does useSyncExternalStore require a stable snapshot?",
    "aliases": ["getSnapshot", "immutable snapshots", "subscribe/getSnapshot", "shared external source"],
    "answer": "React needs to read the source several times and know whether it still sees the same version. subscribe only signals that there might be a change; getSnapshot provides the comparable observation. If it creates a new object without a real change, React cannot stabilize the render.",
    "example": "A mutable store keeps an object internally. When it changes, it builds and caches a new immutable snapshot; while it does not change, getSnapshot returns exactly that reference.",
    "nuance": "useSyncExternalStore does not make the store correct. The protocol still needs unsubscribe, consistent snapshots and a getServerSnapshot compatible with hydration.",
    "sources": [
      { "label": "useSyncExternalStore (React)" }
    ]
  },
  "idempotency_unknown_outcome": {
    "title": "Why does a timeout not mean failure?",
    "aliases": ["idempotency key", "idempotency", "unknown outcome", "ambiguous outcome"],
    "answer": "The response can be lost after the server or provider confirmed the effect. The client only knows it did not receive confirmation. Retrying with a different identity can duplicate the effect; retrying with the same key lets you recover the same result or query the status.",
    "example": "POST /payments reaches the provider, the charge goes through and the network drops before the 200. The retry keeps checkout_123; the server returns the payment already associated with it instead of creating another one.",
    "nuance": "Idempotency must be implemented at the boundary that owns the effect. Disabling a button or keeping a key only in React does not protect against network retries or parallel processes.",
    "sources": [
      { "label": "Idempotent requests (Stripe)" }
    ]
  },
  "migration_compatibility": {
    "title": "Why does a migration need intermediate compatibility?",
    "aliases": ["expand and contract", "expand/contract", "feature flag", "public entry points", "deep imports"],
    "answer": "Producers and consumers do not always change in the same deploy. Expand adds a compatible shape, migrate moves usage or data, and contract removes the old shape only when it no longer has consumers. That way every intermediate state keeps working.",
    "example": "First an API accepts oldName and newName; then the clients migrate and telemetry confirms that oldName is no longer used; finally it is removed and the corresponding breaking change is released.",
    "nuance": "A flag controls exposure, not data compatibility on its own. If both paths write different formats, a visual rollback may not recover what was already persisted.",
    "sources": [
      { "label": "Parallel Change" }
    ]
  },
  "reuse_pattern_tradeoff": {
    "title": "Why does a custom Hook not share state?",
    "aliases": ["custom Hook", "HOC", "render props", "explicit composition"],
    "answer": "A custom Hook is a function that composes Hook calls. Each component that calls it gets its own React state. They only share data if the Hook deliberately connects them to Context, a store, a cache or another external source.",
    "example": "Two components call useOnlineStatus and each one creates a subscription, unless the Hook uses a shared store. Extracting useForm does not make two forms share their draft.",
    "nuance": "HOCs and render props can share an instance through the wrapper they render. The choice is about ownership and API, not about one pattern always being modern or always obsolete.",
    "sources": [
      { "label": "Reusing Logic with Custom Hooks (React)" }
    ]
  }
};
