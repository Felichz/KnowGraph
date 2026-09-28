// react concepts (case_checkout, deployment_web, react_values_elements, legacy_react_apis, effect_timing_strict_mode, useid_identity, react_patterns_history, responsive_browser_subscriptions, routing_data_apis, i18n_localization)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "case_checkout": {
    "_source": "e1822b2e570f",
    "label": "Case: React checkout with states",
    "lesson": {
      "level": "Architecture case",
      "summary": "A frontend checkout is a finite state machine that coordinates validation, submission state, an idempotency key and results.",
      "explanation": "Checkout is a coordination between a UI state machine and a distributed operation. editing keeps the draft; submitting represents an intent sent exactly once; requires_action hands a step off to the provider; pending covers a result that is still unknown; success and failed are shown only when the backend has a durable state. The idempotency key identifies the same attempt across retries.",
      "why": "It shows you can design transactional flows that tolerate latency, double clicks, timeouts and provider failures.",
      "codeLabel": "Idempotent submit",
      "steps": [
        "Model the flow with explicit finite states (editing, submitting, pending, success, failed).",
        "Generate an idempotency key (idempotencyKey) on the client when the payment attempt starts.",
        "Disable the submit controls immediately when the transition starts to prevent duplicate submissions.",
        "Distinguish validation errors (recoverable in the form) from network failures or timeouts (which require a status check).",
        "Empty the shopping cart only when the server returns a successful, durable order confirmation."
      ],
      "pitfalls": [
        "Emptying the user's shopping cart before receiving a successful, durable confirmation from the server.",
        "Not using idempotency keys on payment requests, causing double charges if the user retries because of latency.",
        "Treating a network timeout as if the payment had been declined, without checking the real order status on the server."
      ],
      "takeaway": "Checkout demands finite states and idempotency: the client prevents duplication and the server confirms the payment.",
      "prompt": "Design a React checkout that tolerates double clicks, timeouts, pending payments and retries.",
      "mermaid": "stateDiagram-v2\n  [*] --> editing\n  editing --> submitting: valid submit\n  submitting --> editing: validation error\n  submitting --> requires_action: payment authentication\n  requires_action --> pending: action completed\n  submitting --> pending: uncertain response\n  pending --> success: backend confirms\n  pending --> failed: backend rejects\n  failed --> submitting: retry with same intent\n  success --> [*]",
      "diagramTitle": "Checkout state machine",
      "audit": {
        "primer": "Checkout is a distributed flow: React handles the experience, Rails validates and persists, and a payment provider may require external steps. That is why it is modeled with explicit states and not with a single `loading`.",
        "example": "`editing` validates fields; `submitting` deduplicates the button; `requires_action` waits for 3DS; `pending` covers an ambiguous timeout; `success` and `failed` are recoverable results. The same idempotency key lets you retry without creating two orders.",
        "failureModes": [
          "Emptying the cart before a durable confirmation can lose the user's intent.",
          "A provider timeout does not prove the payment failed: you have to check the status.",
          "The frontend must never treat a price or permission computed in the browser as authoritative."
        ]
      },
      "docNotes": [
        "Disabling the button reduces double clicks, but it does not replace idempotency: the browser, a proxy or the user can repeat the request.",
        "A timeout does not show whether the payment happened. Keep the attempt identifier and query the backend, or receive its reconciliation.",
        "Optimistic UI is appropriate for low-risk changes; you should not present a payment as confirmed before you have durable authority."
      ],
      "sources": [
        {
          "label": "Idempotency (Stripe Docs)"
        },
        {
          "label": "useActionState (React)"
        }
      ]
    }
  },
  "deployment_web": {
    "_source": "3de55841c884",
    "label": "Frontend build, deploy and observability",
    "lesson": {
      "level": "Production",
      "summary": "The build turns modules and assets into public files; production adds caching, variables, observability and reproducible deploys.",
      "explanation": "A frontend deploy turns the code into an artifact the browser can download. Observability adds evidence of which version, route and device failed; it is not just uploading files to a CDN. CI produces a build with fingerprinted assets, publishes a preview, rolls out production gradually and registers the release in the error tracker. If a version breaks checkout, a flag or a rollback limits the impact.",
      "why": "A fullstack interview may ask what happens between a commit and a deployed UI.",
      "codeLabel": "From source to production",
      "steps": [
        "Frontend variables are public; do not put secrets in the bundle.",
        "Configure SPA route fallback and caching for fingerprinted assets.",
        "CI runs lint, types, tests and build.",
        "Monitor errors and Web Vitals with identifiable releases."
      ],
      "takeaway": "A professional frontend also has a build, caching, observability and a deploy contract.",
      "mermaid": "flowchart LR\n A[Commit] --> B[CI]\n B --> C[Build]\n C --> D[CDN]\n D --> E[React]\n E --> F[Rails API]",
      "diagramTitle": "Frontend pipeline",
      "audit": {
        "primer": "A frontend deploy turns the code into an artifact the browser can download. Observability adds evidence of which version, route and device failed; it is not just uploading files to a CDN.",
        "example": "CI produces a build with fingerprinted assets, publishes a preview, rolls out production gradually and registers the release in the error tracker. If a version breaks checkout, a flag or a rollback limits the impact.",
        "failureModes": [
          "A public source map can reveal code you did not want to expose.",
          "Separate rebuilds per environment make it impossible to know which artifact was tested.",
          "A frontend rollback can be incompatible with an API that has already changed."
        ]
      },
      "sources": [
        {
          "label": "HTTP caching (MDN)"
        },
        {
          "label": "Web Vitals (web.dev)"
        }
      ]
    }
  },
  "react_values_elements": {
    "_source": "cf13e3127bd9",
    "label": "React nodes, elements, components and Fragments",
    "lesson": {
      "level": "Fundamentals",
      "summary": "A React node is any renderable value; a React element is the immutable description of a piece of UI; a component is the function or class React runs to get nodes. JSX creates elements, and a Fragment groups children without adding a DOM node.",
      "explanation": "JSX describes a React tree; it is not HTML pasted into the DOM. The element holds type, props and key, and React uses that description to decide which component to run and which host nodes to commit. A Fragment in a row can return two cells without wrapping them in an invalid div inside the table. If several rows use a Fragment, React.Fragment with a key preserves their identity.",
      "why": "Keeping these terms apart stops you from explaining React as if JSX were HTML, or as if calling a component function were the same as letting React render it.",
      "code": "function Greeting({ name }) {\n  return <>Hello <strong>{name}</strong></>\n}\n\nconst element = <Greeting name=\"Felix\" />\n// element describes what to render; React decides when to run Greeting.",
      "codeLabel": "From JSX to the React tree",
      "steps": [
        "JSX is transformed by the JSX runtime into calls that produce React elements; it is not inserted as an HTML string.",
        "An element contains type, props and key. It is a description, not a DOM node or a mutable instance.",
        "A node can be an element, text, a number, null, an array of nodes and other values React accepts.",
        "A Fragment allows several children without introducing a DOM wrapper; the long syntax accepts a key when used in lists.",
        "createElement is the explicit form that JSX replaces; cloneElement exists, but it tends to create fragile coupling and the documentation proposes composition, Context or render props as alternatives."
      ],
      "pitfalls": [
        "Do not call Component(props) directly to render it: <Component /> lets React control identity, Hooks and reconciliation.",
        "Virtual DOM is a useful metaphor, but a strong interview answer talks about elements, the tree, render, reconciliation and commit without promising it always beats any manual update.",
        "A Fragment removes an unnecessary wrapper; it does not remove the need for a key when each group belongs to a list."
      ],
      "takeaway": "Components produce nodes; JSX produces elements; React reconciles those descriptions and commits to the host.",
      "tableTitle": "EXACT VOCABULARY",
      "tableLabel": "They are not synonyms",
      "table": {
        "columns": [
          "Concept",
          "What it is",
          "Example"
        ],
        "rows": [
          [
            "React node",
            "Any value React can render",
            "text, null, element, array"
          ],
          [
            "React element",
            "Immutable object that describes UI",
            "<Button />"
          ],
          [
            "Component",
            "Definition that React runs",
            "function Button()"
          ],
          [
            "DOM node",
            "Real browser object",
            "HTMLButtonElement"
          ]
        ]
      },
      "audit": {
        "primer": "JSX describes a React tree; it is not HTML pasted into the DOM. The element holds type, props and key, and React uses that description to decide which component to run and which host nodes to commit.",
        "example": "A Fragment in a row can return two cells without wrapping them in an invalid div inside the table. If several rows use a Fragment, React.Fragment with a key preserves their identity.",
        "failureModes": [
          "Confusing an element with a DOM node leads to trying to mutate or measure it before the commit.",
          "Invoking a component as a function can break the rules of Hooks and hide its identity from React."
        ]
      },
      "sources": [
        {
          "label": "createElement (React)"
        },
        {
          "label": "Fragment (React)"
        },
        {
          "label": "React calls Components and Hooks (React)"
        }
      ]
    }
  },
  "legacy_react_apis": {
    "_source": "04fe4ac6b5c0",
    "label": "Legacy React: classes, lifecycles and migration",
    "lesson": {
      "level": "Maintenance",
      "summary": "Modern React uses function components and Hooks, but an interview may ask you to recognize classes, lifecycle methods, PureComponent, PropTypes, forwardRef and older testing APIs. The goal is to translate their intent and know what changed in React 19.",
      "explanation": "Classes have not disappeared from the ecosystem, but new React APIs are designed around functions. The interview value is being able to maintain and migrate without inventing false equivalences. A subscription split across mount, update and unmount becomes an Effect whose setup and cleanup depend on roomId. An Error Boundary can stay a class and wrap a function-based feature.",
      "why": "Many products are still migrating code. Knowing how to read the past avoids dogmatic answers and lets you choose a safe migration.",
      "codeLabel": "The remaining case for a class: Error Boundary",
      "steps": [
        "constructor initializes state; render computes UI; componentDidMount connects; componentDidUpdate resynchronizes; componentWillUnmount cleans up. An Effect models one complete synchronization instead of splitting it across three methods.",
        "PureComponent applies a shallow comparison of props and state. React.memo plays a similar role for function components, but neither makes the code pure or fixes mutations.",
        "React 19 ignores propTypes on function components and recommends TypeScript or another solution; network validation is still a separate runtime concern.",
        "In React 19, ref can be received as a prop in function components. forwardRef is still needed to understand and maintain React 18 code and compatible libraries.",
        "Error Boundaries are still implemented directly with a class, although frameworks and libraries offer wrappers or route boundaries."
      ],
      "pitfalls": [
        "Do not translate componentDidMount mechanically to useEffect(..., []): first identify which system it synchronizes and what its real dependencies are.",
        "PureComponent and memo use shallow equality; mutating an object can make it look unchanged.",
        "PropTypes did not replace validation of external input: it was a development-time check of props."
      ],
      "takeaway": "Recognize the legacy intent and migrate it to the modern model; do not memorize lifecycle-by-lifecycle equivalences.",
      "prompt": "You are shown a class with componentDidMount, componentDidUpdate and componentWillUnmount. Explain the synchronization they represent and migrate it without leaving out dependencies or cleanup.",
      "audit": {
        "primer": "Classes have not disappeared from the ecosystem, but new React APIs are designed around functions. The interview value is being able to maintain and migrate without inventing false equivalences.",
        "example": "A subscription split across mount, update and unmount becomes an Effect whose setup and cleanup depend on roomId. An Error Boundary can stay a class and wrap a function-based feature.",
        "failureModes": [
          "Copying lifecycle methods into several Effects can duplicate requests or separate setup from cleanup.",
          "Assuming forwardRef no longer exists breaks compatibility with React 18, even though React 19 allows ref as a prop."
        ]
      },
      "sources": [
        {
          "label": "Component (React)"
        },
        {
          "label": "PureComponent (React)"
        },
        {
          "label": "React 19 Upgrade Guide"
        },
        {
          "label": "forwardRef (React)"
        }
      ]
    }
  },
  "effect_timing_strict_mode": {
    "_source": "1ce63b5697f7",
    "label": "Effects: timing, layout and Strict Mode",
    "lesson": {
      "level": "Effects",
      "summary": "useEffect synchronizes after the commit; useLayoutEffect lets you measure or adjust layout before the browser repaints; useInsertionEffect exists mainly for CSS-in-JS libraries. Strict Mode adds development checks to reveal impurity and incomplete cleanup.",
      "explanation": "useEffect runs after the commit for synchronizations that do not need to block painting. useLayoutEffect also runs after React has modified the DOM, but before the browser repaints: it lets you measure and correct a position without the user seeing the jump, at the cost of blocking that frame. useInsertionEffect is an even earlier escape hatch intended mainly for CSS-in-JS libraries. In development, Strict Mode repeats renders and rehearses an extra setup and cleanup cycle to reveal impurity or resources that are not released; that extra work does not happen the same way in production.",
      "why": "Timing matters when a visible measurement could flicker, but doing synchronous work before the paint blocks the screen and should be the exception.",
      "codeLabel": "Measuring before the paint",
      "steps": [
        "Render computes; commit modifies the DOM; the browser prepares layout and paint. useLayoutEffect runs after the DOM change and before the repaint.",
        "Prefer useEffect for network, listeners and synchronization that does not need to block the paint.",
        "Use useLayoutEffect when you must measure and perform a second render before the user sees an incorrect position.",
        "Strict Mode re-renders and runs an extra setup-cleanup cycle in development; it confirms purity and symmetry, it does not simulate two users.",
        "In React 19.2, useEffectEvent separates non-reactive logic fired from an Effect, without using it to hide real dependencies."
      ],
      "pitfalls": [
        "Overusing useLayoutEffect delays the paint and can produce warnings during server rendering.",
        "Removing a dependency to stop an Effect keeps a stale closure; restructure the synchronization first.",
        "Do not disable Strict Mode to hide a duplicated setup: make cleanup undo exactly the resource that was created."
      ],
      "takeaway": "Choose the Effect by the system it synchronizes and the visual moment it needs; Strict Mode proves the contract survives repetition.",
      "tableTitle": "ESCAPE HATCH TIMING",
      "tableLabel": "Use the least blocking one that solves the case",
      "table": {
        "columns": [
          "API",
          "Timing",
          "Use case"
        ],
        "rows": [
          [
            "useEffect",
            "After the commit; usually after the paint",
            "network, listeners, widgets"
          ],
          [
            "useLayoutEffect",
            "After the DOM, before the repaint",
            "measure and correct layout"
          ],
          [
            "useInsertionEffect",
            "Before layout Effects",
            "style injection in libraries"
          ],
          [
            "useEffectEvent",
            "Called from an Effect",
            "read recent values without resynchronizing"
          ]
        ]
      },
      "audit": {
        "primer": "There is no exact equivalence 'componentDidMount = useEffect'. An Effect represents a synchronization that can start and stop many times.",
        "example": "A tooltip is measured with a layout effect so the user does not see the jump; analytics can be sent in an effect without blocking the paint.",
        "failureModes": [
          "A measurement in useEffect can cause flicker.",
          "Expensive work in useLayoutEffect freezes the frame before the user sees content."
        ]
      },
      "sources": [
        {
          "label": "useEffect (React)"
        },
        {
          "label": "useLayoutEffect (React)"
        },
        {
          "label": "StrictMode (React)"
        },
        {
          "label": "useEffectEvent (React)"
        }
      ]
    }
  },
  "useid_identity": {
    "_source": "f2d6618e1573",
    "label": "useId, identity and accessible relationships",
    "lesson": {
      "level": "Hooks",
      "summary": "useId generates a stable identifier to link accessibility elements within an instance and coordinates IDs between server rendering and hydration. It does not represent data identity and must not be used as a list key.",
      "explanation": "There are three distinct identities: DOM/a11y, reconciliation and domain. useId only solves the first one. Two PasswordField components on the same page receive different IDs and each input points to its own help text. A list of users still uses user.id as the key.",
      "why": "Confusing DOM identity, domain identity and React identity causes broken labels, hydration mismatches and state attached to the wrong row.",
      "codeLabel": "An accessible relationship without collisions",
      "steps": [
        "Call useId at the top level and add suffixes if a component needs several relationships.",
        "Use it for htmlFor, aria-describedby or aria-controls when the consumer did not pass an explicit id.",
        "During SSR, the initial server and client trees must match for React to generate the same sequence.",
        "For keys, use an id that comes from the data; for a business resource, use its canonical identifier."
      ],
      "pitfalls": [
        "useId is not a UUID generator for requests, records or idempotency keys.",
        "Generating Math.random during render breaks stability and can cause a hydration mismatch.",
        "A unique id does not guarantee the ARIA relationship is correct: roles and states must match too."
      ],
      "takeaway": "useId links markup; keys link elements across renders; domain IDs identify entities.",
      "audit": {
        "primer": "There are three distinct identities: DOM/a11y, reconciliation and domain. useId only solves the first one.",
        "example": "Two PasswordField components on the same page receive different IDs and each input points to its own help text. A list of users still uses user.id as the key.",
        "failureModes": [
          "Using useId inside map does more than violate the rules of Hooks: it also fails to express the record's persistent identity.",
          "Changing the tree between the server and the first client render can misalign IDs and hydration."
        ]
      },
      "sources": [
        {
          "label": "useId (React)"
        }
      ]
    }
  },
  "react_patterns_history": {
    "_source": "2bdbeaf9483f",
    "label": "React patterns: composition, HOCs and render props",
    "lesson": {
      "level": "Architecture",
      "summary": "Composition, custom Hooks, Context, render props and HOCs are ways to reuse behavior or structure. HOCs and render props still show up in real codebases; for new code, composition and custom Hooks usually make the flow more direct, but they do not replace every case.",
      "explanation": "Patterns are not generations that invalidate each other. What changes is which one makes the flow most visible for a concrete problem. A headless library can use a Hook for state and return explicit props; an Error Boundary still needs a different boundary; a legacy integration can expose a stable HOC.",
      "why": "An interview may use historical names to check whether you recognize the problem behind the pattern and its costs in identity, nesting, types and debugging.",
      "code": "function withPermission(Component) {\n  return function Guarded(props) {\n    const canView = usePermission(props.resource)\n    return canView ? <Component {...props} /> : <Forbidden />\n  }\n}\n\n// Modern alternative: usePermission + explicit composition in the route.",
      "codeLabel": "A recognizable HOC and an explicit alternative",
      "steps": [
        "Composition uses children or element props to assemble UI without inheritance.",
        "A HOC takes a component and returns another; it was common for connecting stores, permissions or data before Hooks.",
        "Render props deliver behavior through a function prop; they let the consumer decide the markup.",
        "A custom Hook reuses logic built with Hooks and keeps the structure visible in the consuming component.",
        "Container/presentational describes coordination and presentation roles, not an obligation to split every component."
      ],
      "pitfalls": [
        "Creating the HOC inside render produces a new component type and can reset the entire subtree.",
        "Chains of HOCs or render props can hide where props come from and create nesting that is hard to debug.",
        "A custom Hook does not share state between calls unless it connects to a common external source."
      ],
      "takeaway": "Learn the intent and cost of each pattern; choose explicit composition unless another boundary better protects a decision.",
      "tableTitle": "REUSE PATTERNS",
      "tableLabel": "Recognize legacy and choose with intent",
      "table": {
        "columns": [
          "Pattern",
          "Reuses",
          "Typical cost"
        ],
        "rows": [
          [
            "Composition",
            "structure and slots",
            "scattered contract if there are too many slots"
          ],
          [
            "Custom Hook",
            "logic built with Hooks",
            "hidden dependencies if the name is poor"
          ],
          [
            "HOC",
            "component wrapping",
            "layers, types and prop collisions"
          ],
          [
            "Render prop",
            "behavior with free-form markup",
            "nesting and function identities"
          ]
        ]
      },
      "audit": {
        "primer": "Patterns are not generations that invalidate each other. What changes is which one makes the flow most visible for a concrete problem.",
        "example": "A headless library can use a Hook for state and return explicit props; an Error Boundary still needs a different boundary; a legacy integration can expose a stable HOC.",
        "failureModes": [
          "Migrating a HOC to a Hook without preserving loading, errors and subscriptions can change the contract.",
          "Extracting any logic into a Hook with a generic name only moves complexity around."
        ]
      },
      "docNotes": [
        "The current React documentation teaches composition and custom Hooks as the main tools. HOCs and render props are still valid JavaScript patterns, but they appear mostly in libraries or older code.",
        "React must call components through JSX. A HOC is created outside render and returns a stable component type; the wrapped component is not invoked like an ordinary function.",
        "Extracting a custom Hook changes the organization, not the ownership: each call keeps separate state unless the Hook connects to a shared source."
      ],
      "sources": [
        {
          "label": "Passing Props to a Component (React)"
        },
        {
          "label": "Reusing Logic with Custom Hooks (React)"
        },
        {
          "label": "cloneElement alternatives (React)"
        }
      ]
    }
  },
  "responsive_browser_subscriptions": {
    "_source": "ed60f6e8c190",
    "label": "ResizeObserver and browser subscriptions",
    "lesson": {
      "level": "Web platform",
      "summary": "A UI can respond to the viewport with CSS, to a container's size with container queries or ResizeObserver, and to a shared external source with useSyncExternalStore. Choosing the right layer avoids turning layout into React state for no reason.",
      "explanation": "Responsive does not always mean setState(window.innerWidth). First decide whether the problem belongs to CSS, to an element or to a browser data source. A card changes its columns with container queries. A chart that recalculates its scale observes the real width of its wrapper and disconnects the observer on unmount.",
      "why": "The interview question 'how do you re-render on resize?' hides a more important one: does the UI really need JavaScript, or does CSS already express the behavior?",
      "codeLabel": "Observe the container and clean up",
      "steps": [
        "Prefer media queries or container queries when only the visual layout changes.",
        "Use ResizeObserver when JavaScript needs the size of an element, not just the viewport.",
        "Batch or throttle expensive work, because resize can produce many notifications.",
        "Disconnect observers and listeners in cleanup.",
        "If many components read the same external source, model subscribe/getSnapshot with useSyncExternalStore."
      ],
      "pitfalls": [
        "Listening to window.resize does not necessarily detect a change in a container's size.",
        "Repeatedly reading layout and writing styles in the same frame can cause layout thrashing.",
        "Storing every pixel in Context can re-render a large part of the tree for no reason."
      ],
      "takeaway": "CSS owns layout; observers connect JavaScript only when the behavior needs a measurement.",
      "audit": {
        "primer": "Responsive does not always mean setState(window.innerWidth). First decide whether the problem belongs to CSS, to an element or to a browser data source.",
        "example": "A card changes its columns with container queries. A chart that recalculates its scale observes the real width of its wrapper and disconnects the observer on unmount.",
        "failureModes": [
          "A listener without cleanup keeps running after the screen unmounts and retains callbacks or data that should already have been released.",
          "A resize handler that forces layout several times per frame produces jank."
        ]
      },
      "sources": [
        {
          "label": "ResizeObserver (MDN)"
        },
        {
          "label": "CSS Container Queries (MDN)"
        },
        {
          "label": "useSyncExternalStore (React)"
        }
      ]
    }
  },
  "routing_data_apis": {
    "_source": "bb2d8be39522",
    "label": "Modern React Router: loaders, actions and errors",
    "lesson": {
      "level": "Architecture",
      "summary": "Modern React Router can do more than map paths to elements. In data or framework mode, a route defines a loader for reads, an action for mutations, pending UI, revalidation and an ErrorBoundary. The route becomes a data and error boundary coordinated with navigation.",
      "explanation": "React Router has modes. The <Routes> API is enough for declarative matching; data routers add network coordination and navigation states. The loader for /orders/42 fetches the order before rendering; a 404 reaches OrderError. The form calls the action and the router revalidates the loader when it completes.",
      "why": "Knowing only BrowserRouter and useNavigate covers basic declarative routing; a current interview may ask how to avoid fetch waterfalls, handle mutations or isolate errors per route.",
      "codeLabel": "A route with a read, a mutation and an error",
      "steps": [
        "Choose the router mode based on whether you need only matching, data APIs or full-stack integration.",
        "The loader fetches data for a navigation and can throw a 404 Response to the nearest boundary.",
        "The action processes a route mutation; afterwards, the router revalidates the relevant loaders.",
        "useNavigation and fetchers let you show pending state and mutate without inventing global flags.",
        "Nested routes compose layouts, data and Error Boundaries; Outlet renders the child that matched."
      ],
      "pitfalls": [
        "Do not mix a loader and a useEffect that fetch the same resource: you create two authorities and duplicate requests.",
        "A client-side private route does not replace auth in loaders, actions and the API.",
        "replace avoids a history entry; push creates a new one. Choosing wrong affects Back after login or redirects."
      ],
      "takeaway": "A modern route can own the URL, data, mutations, pending state and errors as one coherent boundary.",
      "prompt": "Design /orders/:id/edit with a loader, an action, a 404, validation and pending state, without duplicating the data in useEffect.",
      "audit": {
        "primer": "React Router has modes. The <Routes> API is enough for declarative matching; data routers add network coordination and navigation states.",
        "example": "The loader for /orders/42 fetches the order before rendering; a 404 reaches OrderError. The form calls the action and the router revalidates the loader when it completes.",
        "failureModes": [
          "A global spinner for every navigation can hide the layout and worsen UX.",
          "Revalidating every loader after any action can create unnecessary work if the dependency is not understood."
        ]
      },
      "docNotes": [
        "React Router documents three modes: declarative, data and framework. The available APIs and the data loading strategy change depending on the chosen mode.",
        "After a successful action, data routers revalidate loader data to keep the UI in sync. A fetcher lets you mutate without triggering a navigation.",
        "A route ErrorBoundary can receive errors from the route's loaders, actions and rendering. That is a router integration, not the automatic scope of any React Error Boundary."
      ],
      "sources": [
        {
          "label": "React Router: Picking a mode"
        },
        {
          "label": "Route Object"
        },
        {
          "label": "Actions"
        },
        {
          "label": "Error Boundaries"
        }
      ]
    }
  },
  "i18n_localization": {
    "_source": "1189d35dc340",
    "label": "i18n: messages, locales and resilient layout",
    "lesson": {
      "level": "Web platform",
      "summary": "Internationalizing is not replacing strings. The application separates messages from code, chooses a locale, formats numbers, dates and plurals with locale rules, supports text direction and tests that the layout holds up with longer or different content.",
      "explanation": "react-intl or react-i18next are tools. The underlying model is messages, locale, linguistic rules and visual resilience. The URL /es-UY/orders preserves the locale; the price uses the order's currency and the user's conventions; a long German translation does not cut off the button.",
      "why": "Questions about react-intl assess one implementation; the transferable knowledge is modeling messages, locale, fallback, formatting and resilient content.",
      "codeLabel": "Formatting by locale and currency",
      "steps": [
        "Define how the locale is negotiated and persisted: URL, profile, cookie or browser preference.",
        "Use stable message IDs and per-locale catalogs; do not concatenate fragments the translator cannot reorder.",
        "Format numbers, dates, currency, lists and plurals with Intl or a library that uses those rules.",
        "Propagate lang and dir to the document or subtree when the language or direction changes.",
        "Test pseudolocalization, long copy, non-Latin characters, RTL, zoom and fallback for missing messages."
      ],
      "pitfalls": [
        "Storing already formatted dates loses the time zone and the ability to re-render them.",
        "Assuming plurals are just singular/plural fails in languages with more categories.",
        "Using translated text as a React key or an option ID breaks identity when the locale changes."
      ],
      "takeaway": "Localize meaning and format; design the layout for content you do not control.",
      "tableTitle": "I18N LAYERS",
      "tableLabel": "What each one is responsible for",
      "table": {
        "columns": [
          "Layer",
          "Example",
          "Failure if omitted"
        ],
        "rows": [
          [
            "Messages",
            "orders.empty.title",
            "hardcoded copy"
          ],
          [
            "Formatting",
            "Intl.DateTimeFormat",
            "ambiguous date or currency"
          ],
          [
            "Locale",
            "/es-UY/orders",
            "screen that cannot be reproduced"
          ],
          [
            "Layout",
            "dir=rtl, long text",
            "cut-off content"
          ]
        ]
      },
      "audit": {
        "primer": "react-intl or react-i18next are tools. The underlying model is messages, locale, linguistic rules and visual resilience.",
        "example": "The URL /es-UY/orders preserves the locale; the price uses the order's currency and the user's conventions; a long German translation does not cut off the button.",
        "failureModes": [
          "Concatenating 'Hello ' + name can prevent another language from reordering the sentence.",
          "A silent fallback can mix languages and hide untranslated messages."
        ]
      },
      "sources": [
        {
          "label": "Intl (MDN)"
        },
        {
          "label": "FormatJS: React Intl"
        },
        {
          "label": "W3C Internationalization"
        }
      ]
    }
  }
};
