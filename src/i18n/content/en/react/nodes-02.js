// react concepts (form_validation, lifting_state, derived_state, context, refs_dom, effects, effect_dependencies, data_fetching, async_race, routing, auth_frontend)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "form_validation": {
    "_source": "ce0f2efb6147",
    "label": "Forms with React Hook Form and schemas",
    "lesson": {
      "level": "State",
      "summary": "React Hook Form and schemas like Zod separate efficient input registration from declarative data validation.",
      "explanation": "A serious form has two validations with different jobs. Client validation exists for feedback: reject a malformed email instantly, mark the field, save a roundtrip. Server validation exists for truth: the client can be tampered with, and nothing validated there authorizes anything.\n\nReact Hook Form covers the first one with efficient input registration (it does not control every keystroke, it validates when appropriate), and a schema like Zod describes the payload rules in a declarative, executable way, as in the example: an email with a valid format and an integer age.\n\nThe point where many forms break is the way back. When the backend responds with a username conflict, that error does not come from the local schema: it has to be mapped to the right field or to a general message. And a network error is not a user error: \"we couldn't save, try again\" and \"you typed this field wrong\" are different messages that deserve different handling.",
      "why": "It is a popular solution for large forms, but the client schema does not replace backend validation.",
      "codeLabel": "Form library + schema",
      "steps": [
        "The schema validates shape and messages on the client.",
        "The backend validates again because the client can be tampered with.",
        "Map backend errors to fields and to general errors.",
        "Choose controlled/uncontrolled based on render cost and UI needs."
      ],
      "pitfalls": [
        "Treating client validation as security: anyone can skip the form and hit the API directly.",
        "Showing a network error as if it were a validation error confuses the user about what they need to fix.",
        "Duplicating complex business rules in the client schema creates two sources that diverge: the client validates shape, the server validates truth."
      ],
      "takeaway": "A library reduces plumbing; the business rule still belongs to the server.",
      "audit": {
        "primer": "React Hook Form is a library for registering inputs and coordinating validation. A schema is an executable description of the payload rules, for example a required email and a password with a minimum length.",
        "example": "The schema can reject a malformed email before calling Rails. After submit, Rails can return a username conflict; that error does not belong to the local schema and must be mapped to the field or to the general message.",
        "failureModes": [
          "Frontend validation improves feedback but never authorizes or guarantees integrity on the backend.",
          "A network error should not be shown as if the user had filled in the form incorrectly."
        ]
      },
      "sources": [
        {
          "label": "Web forms (MDN)"
        }
      ]
    }
  },
  "lifting_state": {
    "_source": "85a5d92237f3",
    "label": "Lifting state and source of truth",
    "lesson": {
      "level": "State",
      "summary": "Lifting state moves state to the common ancestor when several components need the same source of truth.",
      "explanation": "When two components need the same data, the state has to live in the closest common ancestor: that is lifting state. That ancestor becomes the single source of truth and hands the data down as props, along with callbacks to request changes.\n\nThe canonical example: a SearchInput and a ResultsList that filters. If each one keeps its own copy of the term, sooner or later they diverge. If the page keeps `query`, passes `value` and `onChange` to the input and hands the same `query` to the list, there is no way for them to show different filters.\n\nThe limit of the pattern is distance. Lifting state one level brings order; lifting it all the way up to App because \"everything is shared\" fills components that do not use them with props and widens renders. When the distance grows, the alternatives are Context, the URL or a store, but the single-source-of-truth rule never moves.",
      "why": "It avoids divergent copies of a shared filter, selection or draft.",
      "codeLabel": "One source of truth",
      "steps": [
        "The parent passes value and callbacks.",
        "The child does not duplicate the same source of truth.",
        "If the distance grows, evaluate Context, URL or a store."
      ],
      "pitfalls": [
        "Lifting all state to the top of the tree just in case causes prop drilling and renders that span half the screen.",
        "Copying the same filter into the input, the list and the URL without deciding which one rules creates conflicts over which value wins when syncing.",
        "Lifting ephemeral UI state, such as hover or focus, pollutes the parent with changes it does not care about: not everything deserves to be shared."
      ],
      "takeaway": "One source of truth reduces impossible states.",
      "audit": {
        "primer": "Lifting state means moving a piece of state to the closest common ancestor when two components need to coordinate. That ancestor becomes the source of truth.",
        "example": "If SearchInput changes the term and ResultsList filters results, OrdersPage keeps `query` and passes `value` and `onChange` to the input, while handing the same query to the list. That way there are no two filters that can diverge.",
        "failureModes": [
          "Lifting all state up to App can cause unnecessary props and wide renders.",
          "Copying the same filter into the input, the list and the URL creates conflicts over which value wins."
        ]
      },
      "sources": [
        {
          "label": "Sharing State Between Components (React)"
        }
      ]
    }
  },
  "derived_state": {
    "_source": "318f21314598",
    "label": "Derived state and normalization",
    "lesson": {
      "level": "State",
      "summary": "If a value can be calculated from existing props or state, it usually should not be stored as additional state.",
      "explanation": "Before creating a new piece of state, ask yourself one question: can I calculate this value from what I already have? If the answer is yes, it is not state: it is a derived value and it belongs to the render.\n\nThe typical case is the filtered list. If you already store `products` and `query`, then `visibleProducts = products.filter(...)` is calculated on every render and can never go stale, because it does not exist as independent data. Storing it as state creates a second source of truth that has to be synced by hand every time products changes and every time query changes, and the day you forget one of the two paths, the screen lies.\n\nThe only legitimate reason to memoize a derived value is cost: if the calculation is expensive and a measurement proves it, `useMemo` caches it without duplicating the source of truth. Normalizing server data is the same principle seen from the other side: each entity lives only once and everything else is a reference to it.",
      "why": "It avoids out-of-sync duplicates like filteredItems alongside items and query.",
      "codeLabel": "Calculate during render",
      "steps": [
        "Store the minimal source of truth.",
        "Calculate derived values during render if the cost is reasonable.",
        "Use useMemo only if the calculation is expensive and measured."
      ],
      "pitfalls": [
        "Updating filteredProducts by hand in two different places guarantees that someday one path will be left without an update.",
        "Syncing props into state with an Effect to derive values is the hidden version of the same bug: calculate during render.",
        "useMemo does not fix a duplicated source of truth; it only caches a calculation. If the derived value lives in state, the problem is already installed."
      ],
      "takeaway": "Store sources of truth; derive the rest.",
      "audit": {
        "primer": "Derived state is a value that can be calculated from existing props or state, such as `filteredItems`. It is not worth storing it separately because it introduces another source of truth.",
        "example": "If the state contains all the products and the search text, `visibleProducts = products.filter(...)` is calculated during render. `useMemo` is used only if a measurement proves that calculation is expensive.",
        "failureModes": [
          "Manually updating `filteredProducts` when products changes and when query changes can forget one of the two paths.",
          "Normalizing data does not mean duplicating it without criteria: the canonical reference must be clear."
        ]
      },
      "sources": [
        {
          "label": "Choosing the State Structure (React)"
        }
      ]
    }
  },
  "context": {
    "_source": "8406f7ab684d",
    "label": "Context: scope and trade-offs",
    "lesson": {
      "level": "State",
      "summary": "Context delivers a value to many descendants without passing props through every level, but it is not automatically an efficient store.",
      "explanation": "Context solves a scope problem: delivering a value to an entire subtree without passing it as a prop through every intermediate level. The Provider declares the value and any descendant reads it with `useContext`; the components in between do not even notice.\n\nIts legitimate cases are broad, stable dependencies: theme, language, current user, feature flags. Its trap is believing it is a global state store. It is not: when the Provider's `value` changes, every consumer re-renders, so a cart that changes ten times per second in a single Context drags renders across half the tree. The defenses are splitting contexts by responsibility and change frequency, or moving hot state to an external store.\n\nAnd a clarification that interviews never let slide: Context distributes data, it does not authorize. Hiding a button based on a context does not stop someone from calling the API directly; authorization is always verified on the server.",
      "why": "It works for theme, language or current user; it can hide dependencies and propagate renders.",
      "codeLabel": "Scope of a dependency",
      "steps": [
        "The Provider defines the value for a subtree.",
        "The consumer updates when the value changes.",
        "Split contexts by responsibility and change frequency."
      ],
      "pitfalls": [
        "Putting all app state into a single Context turns every small change into a massive render and into invisible coupling.",
        "An object literal as value is recreated on every Provider render and wakes up consumers even though nothing changed: memoize it or split it.",
        "Using Context to avoid passing two props down a single level hides dependencies without gaining anything: short prop drilling is more honest."
      ],
      "takeaway": "Context solves scope; it does not replace a server cache or any store.",
      "audit": {
        "primer": "Context lets a value travel through a subtree without passing props through every level. It is useful for broad dependencies such as theme, locale or session; it is not automatically a global store.",
        "example": "A ThemeProvider can expose the theme to Button and Modal. Changing the Provider's value can re-render consumers; for a cart with many updates it is worth evaluating a store or splitting contexts.",
        "failureModes": [
          "Putting all application state into a single Context widens the blast radius of every change.",
          "Context does not replace authorization: hiding a button does not stop someone from calling the API directly."
        ]
      },
      "sources": [
        {
          "label": "Choosing the State Structure (React)"
        }
      ]
    }
  },
  "refs_dom": {
    "_source": "54f1fb4b6cd5",
    "label": "useRef, DOM and mutable values",
    "lesson": {
      "level": "Hooks",
      "summary": "useRef keeps a mutable value across renders without triggering a render and can point to a DOM node.",
      "explanation": "`useRef` gives you a mutable box that survives across renders without triggering new renders when you change it. It has two uses that are worth separating mentally.\n\nThe first is escaping to the DOM: `dialogRef.current?.focus()` after opening a dialog, measuring a node, integrating an imperative library. The second is storing values that belong to the logic but not to the screen: a timer id, the last request fired, the previous value of a prop.\n\nThe rule that ties both uses together: if changing the value should update what is shown, it is state; if not, it can be a ref. And there are two timing details that do not forgive. `ref.current` is assigned after the commit, so reading it during render is reading the past. And mutating it notifies no one: a ref never triggers the UI on its own, which is why a timer stored there still needs its clearTimeout in the cleanup.",
      "why": "It is useful for focus, timers, previous values and imperative integrations.",
      "codeLabel": "Reference to the DOM",
      "steps": [
        "ref.current is assigned after the commit.",
        "Changing ref.current does not update the UI.",
        "For visible data use state; for a mutable resource use a ref."
      ],
      "pitfalls": [
        "Reading ref.current during render to decide what to show breaks the model: the box can change without React repainting.",
        "Storing a timer in a ref does not clean it up: without clearTimeout in the cleanup, the callback stays alive after unmounting.",
        "Using refs to avoid state for visible values produces screens that do not reflect the data: the silent mutation is the bug, not the solution."
      ],
      "takeaway": "State updates the UI; a ref keeps a reference without requesting new UI.",
      "audit": {
        "primer": "`useRef` is an official Hook that keeps a mutable value across renders without triggering a render when it changes. It also lets you get a reference to a DOM node.",
        "example": "After opening a dialog, `dialogRef.current?.focus()` moves focus back to the first control. It is also useful for storing a timer or the last request; for a value that must be visible on screen, you need state.",
        "failureModes": [
          "Reading `ref.current` during render to decide the UI usually breaks the declarative model.",
          "A ref does not replace cleanup: a timer stored there still needs `clearTimeout` or `clearInterval`."
        ]
      },
      "sources": [
        {
          "label": "Referencing Values with Refs (React)"
        }
      ]
    }
  },
  "effects": {
    "_source": "05ba5c5004b5",
    "label": "useEffect: external synchronization",
    "lesson": {
      "level": "Effects",
      "summary": "useEffect synchronizes React with external systems after the commit: network, timers, subscriptions or browser APIs.",
      "explanation": "An Effect has a single job: synchronizing your component with an external system (the network, a WebSocket, a timer, a browser listener, an imperative API). The question that organizes everything is: which external system must stay synchronized with this render?\n\nIf the answer is a chat connection, the Effect opens it after the commit and the cleanup closes it before opening the next one. If the answer is \"none\", you do not need an Effect. That second half is the most valuable one: most Effects in real code should not exist. If the value can be calculated from props and state, calculate it during render; if the operation happens because the user clicked, it belongs in the click handler, not in an Effect that watches a boolean.\n\nThe full cycle always has three parts: what it synchronizes, what it depends on and how it is cleaned up. An Effect that cannot answer all three is not finished yet.",
      "why": "Many bugs come from using effects for calculations or events that are not external synchronization.",
      "codeLabel": "External synchronization",
      "steps": [
        "The effect runs after the commit.",
        "Cleanup undoes the previous synchronization.",
        "The dependencies describe external values used by the effect."
      ],
      "pitfalls": [
        "An Effect that updates the same state it uses as a dependency enters a loop: render, effect, setState, render.",
        "Not cleaning up the previous subscription leaves two connections alive: when switching rooms, messages arrive from both.",
        "Using an Effect to transform data when receiving props adds an extra render with a visible intermediate state: that calculation belongs in render."
      ],
      "takeaway": "An effect must answer what it synchronizes, what it depends on and how it is cleaned up.",
      "audit": {
        "primer": "`useEffect` is an official Hook for synchronizing React with an external system after the commit: network, timer, listener, WebSocket or imperative API. It is not the general place to calculate derived data.",
        "example": "A chat component opens a WebSocket when `roomId` changes, listens for messages and returns a cleanup that closes the previous connection. If the user clicks save, the request normally belongs in the click handler, not in an Effect that watches a boolean.",
        "failureModes": [
          "An Effect that updates state it uses itself as a dependency can enter a loop.",
          "If the previous connection is not cleaned up, switching rooms leaves messages from several rooms mixed together."
        ]
      },
      "sources": [
        {
          "label": "Synchronizing with Effects (React)"
        }
      ]
    }
  },
  "effect_dependencies": {
    "_source": "5fa6cc173cb2",
    "label": "Dependencies, cleanup and stale closures",
    "lesson": {
      "level": "Effects",
      "summary": "Dependencies and cleanup determine which closure the effect observes and when the previous work is cancelled.",
      "explanation": "Every render creates new versions of your functions: closures that capture the values of that render. An Effect sees the world through the closure of the render in which it was created, and the dependency array tells React when that closure has gone stale and it needs to resynchronize.\n\nThe characteristic bug is the stale closure: an interval inside an Effect with `[]` prints the `count` from the first render forever, because its closure was never renewed. There are three honest ways out: declare the dependency you actually use, use the functional form of the setter when you only need the previous value, or move the value to a ref when it should not trigger resynchronization. What is not a way out is lying to the array: omitting a dependency because it is annoying only postpones the bug until the user or the route changes.\n\nThe cleanup completes the contract. AbortController cancels the request that no longer matters, the listener unsubscribes, the response that arrives late is discarded. Without that, the old work competes with the new work and whichever arrives last wins.",
      "why": "It is the foundation for avoiding stale closures, duplicated listeners and old responses.",
      "codeLabel": "Cancellation with AbortController",
      "steps": [
        "Every render creates a closure with its values.",
        "Omitting dependencies can leave the effect reading an old value.",
        "AbortController can cancel a request."
      ],
      "pitfalls": [
        "Omitting a dependency compiles and even works on the happy path: the old value only shows up when something you did not touch changes.",
        "Passing a function or object recreated on every render as a dependency resynchronizes on every render: stabilize it or take it out of the array.",
        "A fetch without cancellation can resolve out of order: the old response overwrites the new one if you do not discard the late result."
      ],
      "takeaway": "Every effect needs complete dependencies and a cleanup strategy.",
      "audit": {
        "primer": "An Effect's dependencies indicate which captured values should make React repeat the synchronization. A stale closure is a function that keeps an old value because it was not recreated when that value changed.",
        "example": "An interval that prints `count` inside an Effect with `[]` will keep seeing the initial count. You can include count as a dependency, use an updater or store the latest reference when the case justifies it.",
        "failureModes": [
          "Omitting a dependency can hide a bug until the user or the route changes.",
          "Adding a new function as a dependency without stabilizing it can reconnect the system on every render."
        ]
      },
      "sources": [
        {
          "label": "Lifecycle of Reactive Effects (React)"
        },
        {
          "label": "Removing Effect Dependencies (React)"
        }
      ]
    }
  },
  "data_fetching": {
    "_source": "2318c9b5f2ef",
    "label": "Data fetching and request states",
    "lesson": {
      "level": "Async",
      "summary": "Real fetching needs to model loading, success, error, retry and what happens if the screen changes before it finishes.",
      "explanation": "Data fetching is requesting external data and representing at least loading, success and error. Those states describe the request lifecycle; they are not optional UI details. When `/orders` opens, the screen shows a skeleton, then the list or an empty state. If the backend responds with 500, the user sees an error with a retry; if they leave the route, the request can be cancelled so it does not update a component that is no longer visible.",
      "why": "The happy-path request is easy; quality shows up in incomplete states and errors.",
      "codeLabel": "States of a request",
      "steps": [
        "Define idle/loading/success/error.",
        "Treat unsuccessful HTTP statuses as errors.",
        "Separate cache, retry and deduplication when the problem grows."
      ],
      "takeaway": "Data fetching is state, concurrency and cache, not just fetch.",
      "audit": {
        "primer": "Data fetching is requesting external data and representing at least loading, success and error. Those states describe the request lifecycle; they are not optional UI details.",
        "example": "When `/orders` opens, the screen shows a skeleton, then the list or an empty state. If the backend responds with 500, the user sees an error with a retry; if they leave the route, the request can be cancelled so it does not update a component that is no longer visible.",
        "failureModes": [
          "A permanent spinner can hide the fact that the request failed.",
          "Showing the response of an old request after changing the filter produces incorrect data even though there is no exception."
        ]
      },
      "sources": [
        {
          "label": "useEffect (React)"
        },
        {
          "label": "AbortController (MDN)"
        }
      ]
    }
  },
  "async_race": {
    "_source": "667f90f1a029",
    "label": "Abort, race conditions and retries",
    "lesson": {
      "level": "Async",
      "summary": "A race condition happens when out-of-order responses update state with a selection that is already stale.",
      "explanation": "A race condition happens when two pieces of work finish in a different order from the one in which they were started. AbortController lets you cancel a fetch request, although a sound design also validates which result is still current. The user types `re` and then `react`. The `react` request should win even if the `re` request finishes later; you can abort the previous one and associate each response with the query that originated it.",
      "why": "It is common in searches, autocompletes, filters and fast navigation.",
      "codeLabel": "Only the current response wins",
      "steps": [
        "Two requests can finish in a different order from the one they started in.",
        "Use AbortController and/or a request id.",
        "Retry needs backoff, cancellation and a limit."
      ],
      "takeaway": "The UI must decide which response is still current.",
      "audit": {
        "primer": "A race condition happens when two pieces of work finish in a different order from the one in which they were started. AbortController lets you cancel a fetch request, although a sound design also validates which result is still current.",
        "example": "The user types `re` and then `react`. The `react` request should win even if the `re` request finishes later; you can abort the previous one and associate each response with the query that originated it.",
        "failureModes": [
          "Cancelling the fetch does not automatically stop a parse or transformation that is already in progress.",
          "Retrying without a limit can saturate the API and make an outage worse; you need backoff and a give-up condition."
        ]
      },
      "sources": [
        {
          "label": "AbortController (MDN)"
        }
      ]
    }
  },
  "routing": {
    "_source": "eba5f9f841c4",
    "label": "Routing and SPA navigation",
    "lesson": {
      "level": "Architecture",
      "summary": "A router in an SPA maps the browser URL to a component tree without reloading the full HTML document.",
      "explanation": "A normal web navigation requests another document from the server. In an already loaded SPA, the router can use the History API to change the URL and pick another UI tree without requesting a new document. The contract still includes the browser and the server: Back/Forward must rebuild the screen, a deep link must work when opened from scratch and the URL should keep only state that makes sense to share or recover.",
      "why": "Routing is not hiding and showing components: it coordinates URL, history, layouts, data loading, errors, pending UI and the server's response when a route is opened directly.",
      "codeLabel": "URL as navigable state",
      "steps": [
        "The user navigates to a URL or interacts with a link inside the application.",
        "The client router intercepts the navigation through the HTML5 History API without making a full page request to the backend.",
        "The navigated route and the dynamic parameters are matched against the component tree declared in the routes.",
        "React renders the new component subtree for the route and updates the browser's navigable history.",
        "Search parameters (query params) and route parameters are exposed as the source of truth for syncing the interface."
      ],
      "pitfalls": [
        "Configuring a universal fallback to index.html is correct for a client-side SPA, but not for every architecture: SSR and server-backed routers can resolve the route before sending HTML.",
        "pushState and replaceState do not automatically fire popstate in the same call; the library keeps its own navigation notification.",
        "A route guard improves the experience, but it does not authorize data: the API must verify identity, permission and ownership."
      ],
      "takeaway": "The URL is the SPA's primary navigable state; the router syncs that state with the UI while staying compatible with the browser.",
      "audit": {
        "primer": "A router maps the URL to a screen and its parameters. A route parameter identifies a resource, such as `/orders/42`; a query parameter usually represents filters or pagination, such as `?status=pending`.",
        "example": "When `/orders/42` is shared, the app can rebuild the detail directly, show loading and then a 404 if the order does not exist. A protected route can redirect the UI, but Rails still has to verify identity and permissions.",
        "failureModes": [
          "A refresh on a deep route can return 404 if the server does not redirect to the SPA's entrypoint.",
          "Hiding a route does not protect its data: a user can call the API manually."
        ]
      },
      "tableTitle": "TYPES OF DATA IN THE URL",
      "tableLabel": "Choose the right place based on intent",
      "table": {
        "columns": [
          "Data type",
          "Example",
          "Purpose in the architecture"
        ],
        "rows": [
          [
            "Route parameter",
            "/orders/:id (/orders/42)",
            "Uniquely identifies a resource or domain entity."
          ],
          [
            "Query Parameter",
            "?status=paid&page=2",
            "Expresses shareable UI preferences: filters, searches and pagination."
          ],
          [
            "Hash",
            "#section-comments",
            "Internal navigation within the same document or scroll position."
          ]
        ]
      },
      "mermaid": "flowchart LR\n      A[Navigation / Click] --> B[Router intercepts]\n      B --> C[pushState / popstate]\n      C --> D[Route and params matching]\n      D --> E[Component / Layout render]\n      E --> F[Updated UI]",
      "diagramTitle": "Client-side navigation cycle in an SPA",
      "docNotes": [
        "pushState adds an entry to the history, replaceState replaces the current one and popstate reports navigations such as Back/Forward. Changing the URL does not render React by itself; the router listens and updates the application.",
        "Current React Router offers declarative, data and framework modes. An example with <Routes> explains matching, but loaders, actions, pending UI and errors belong to its data or framework APIs.",
        "A route parameter identifies a hierarchical part of the URL; search params usually express filters or pagination. The distinction is semantic, not a security rule."
      ],
      "sources": [
        {
          "label": "React Router: Routing"
        },
        {
          "label": "React Router: Picking a mode"
        },
        {
          "label": "History.pushState (MDN)"
        },
        {
          "label": "History API (MDN)"
        }
      ]
    }
  },
  "auth_frontend": {
    "_source": "807a0e2f4bb3",
    "label": "Authentication in React + API",
    "lesson": {
      "level": "Architecture",
      "summary": "The React client coordinates the session lifecycle (login, tokens and retries), while the API keeps authority over identity and permissions.",
      "explanation": "React models the session experience: bootstrap, known or anonymous identity, renewal, logout and permission states. Real security lives in every request the backend validates. There is no single universal token scheme: a session with an HttpOnly cookie and CSRF defense can be excellent; a short-lived access token in memory plus a refresh cookie can be too. The choice depends on domains, threats, backend and the need for delegation.",
      "why": "A solid answer separates session UX, credential transport and server authorization; it also explains XSS, CSRF, expiration, rotation and concurrent requests.",
      "codeLabel": "API client",
      "steps": [
        "When the app starts, React enters a 'checking' state while it validates the existing session against the API or memory.",
        "Login sends credentials over HTTPS; once authenticated, it stores the Access Token in memory and receives the Refresh Token in an HttpOnly cookie.",
        "Every HTTP request to the API attaches the Access Token in the Authorization header (Bearer Token).",
        "If the API responds 401 Unauthorized, an interceptor catches the failure, pauses outgoing requests and requests a new token from the refresh endpoint.",
        "Once the new token is confirmed, the client retries the failed requests transparently for the user."
      ],
      "pitfalls": [
        "Storing long-lived Access Tokens or Refresh Tokens in localStorage exposes the session to direct theft in case of an XSS vulnerability.",
        "Firing refresh requests in parallel when 5 simultaneous calls return 401 can cause token races or infinite loops if the refresh endpoint also fails.",
        "Treating a 403 Forbidden error (missing permission for a resource) as if it were a 401 (missing session), logging the user out by accident."
      ],
      "takeaway": "React manages the session experience and flow; the API validates and enforces authority over every request.",
      "audit": {
        "primer": "Authentication verifies who the user is; authorization verifies what they can do. A 401 means a missing or invalid credential; a 403 means a valid identity without permission. The frontend coordinates the session, but the backend decides.",
        "example": "When the app loads, `checking` avoids redirecting before knowing whether a session exists. A request receives a 401, a coordinator performs a single refresh, retries the pending requests once and, if it fails, clears the user and sensitive cache.",
        "failureModes": [
          "A refresh that retries the refresh endpoint itself can create an infinite loop.",
          "Storing a long-lived refresh token in localStorage increases the impact of an XSS; an HttpOnly cookie changes the flow and requires proper CSRF protection."
        ]
      },
      "tableTitle": "TOKEN STRATEGY",
      "tableLabel": "Where to store session credentials",
      "table": {
        "columns": [
          "Token type",
          "Recommended storage",
          "Risk mitigation"
        ],
        "rows": [
          [
            "Access Token",
            "JS memory (State / Closure)",
            "Disposable and short-lived (e.g. 15 min); reduces the impact of XSS."
          ],
          [
            "Refresh Token",
            "HttpOnly + Secure + SameSite cookie",
            "Inaccessible to JavaScript in the browser; prevents reads through XSS."
          ]
        ]
      },
      "mermaid": "flowchart TD\n      A[API request] --> B{Status?}\n      B -->|200 OK| C[Return data]\n      B -->|401 Unauthorized| D{Refresh in progress?}\n      D -->|No| E[Start token refresh]\n      D -->|Yes| F[Queue request in promise]\n      E --> G{Refresh succeeded?}\n      G -->|Yes| H[Retry queued requests]\n      G -->|No| I[Clear session and redirect to login]",
      "diagramTitle": "Handling 401 and the refresh token queue",
      "docNotes": [
        "HttpOnly prevents JavaScript from reading the cookie, but the browser can still send it in requests. SameSite, Secure, the app's origin and CSRF defense are part of the same design.",
        "An access token in memory reduces persistence of the secret, but it forces you to design bootstrap and renewal on reload. It is not automatically superior to a cookie session.",
        "When several 401s happen at once, sharing a single refresh promise avoids parallel rotations. Each request is retried at most once and the refresh endpoint stays outside the interceptor."
      ],
      "sources": [
        {
          "label": "Session Management Cheat Sheet (OWASP)"
        },
        {
          "label": "OAuth 2.0 for Browser-Based Apps (IETF)"
        },
        {
          "label": "Set-Cookie (MDN)"
        },
        {
          "label": "OAuth 2.0 Cheat Sheet (OWASP)"
        },
        {
          "label": "CSRF Prevention (OWASP)"
        }
      ]
    }
  }
};
