// react concepts (accessibility, portals_dialogs, styling_assets, component_architecture, component_api_patterns, state_management, external_stores, typescript_react, testing_rtl, testing_async, security_frontend, ssr_hydration)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "accessibility": {
    "_source": "32c6e34f40b2",
    "label": "Accessibility as a UI contract",
    "lesson": {
      "level": "Web",
      "summary": "Accessibility makes the UI usable with a keyboard, a screen reader, sufficient contrast and different interaction modes.",
      "explanation": "Accessibility is the contract that lets people use the UI with a keyboard, a screen reader, zoom and different abilities. You do not get there by adding an isolated attribute: it requires semantics, focus, a name and feedback. A save action should be a `<button>` with an accessible name and a disabled/pending state. A form error is associated with the input via `aria-describedby` and receives focus when appropriate.",
      "why": "It widens who can complete the flow and forces you to express semantics, focus and feedback in a verifiable way; those same contracts also produce a sturdier UI and more useful tests.",
      "codeLabel": "Semantics and focus",
      "steps": [
        "Use semantic HTML.",
        "Every control must have an accessible name and focus.",
        "A modal must manage focus, Escape and focus return."
      ],
      "takeaway": "Accessibility is functional behavior, not decoration added afterwards.",
      "audit": {
        "primer": "Accessibility is the contract that lets people use the UI with a keyboard, a screen reader, zoom and different abilities. You do not get there by adding an isolated attribute: it requires semantics, focus, a name and feedback.",
        "example": "A save action should be a `<button>` with an accessible name and a disabled/pending state. A form error is associated with the input via `aria-describedby` and receives focus when appropriate.",
        "failureModes": [
          "A clickable div can look like a button but have no keyboard support or semantics.",
          "A modal that neither moves focus nor returns it to the trigger leaves keyboard users lost."
        ]
      },
      "sources": [
        {
          "label": "WAI-ARIA Authoring Practices"
        }
      ]
    }
  },
  "portals_dialogs": {
    "_source": "4d588f50a0b9",
    "label": "Portals, modals and focus management",
    "lesson": {
      "level": "Web",
      "summary": "createPortal renders DOM into another container, but the content still belongs to the same React tree: it keeps Context and its events propagate according to that tree.",
      "explanation": "A Portal lets you render a subtree into another DOM node without breaking React's logical tree. A dialog also needs focus, closing with Escape, an accessible name and blocking or handling of the focus outside it. The modal is mounted in `document.body` to escape an `overflow: hidden` on the panel. On open, it focuses the title or first control; on close, it returns focus to the button that opened it.",
      "why": "Modals need to escape overflow and stacking contexts, but the portal only solves placement; accessibility and focus remain the component's responsibility.",
      "codeLabel": "Accessible modal inside a portal",
      "steps": [
        "On open, move focus to a useful control inside the dialog.",
        "Keep focus inside while it is open, close with Escape and return focus to the trigger.",
        "Block or mark the background content as inert, depending on the implementation.",
        "Even if the DOM lives under document.body, a click can bubble up to ancestors in the React tree."
      ],
      "pitfalls": [
        "A huge z-index does not always fix a stacking context; the portal changes the DOM container.",
        "A Portal is not the same as an accessible modal: without a name, a focus trap and focus return, the interaction is broken.",
        "Closing on any bubbled click can cause accidental closes; distinguish the backdrop from the content."
      ],
      "takeaway": "A Portal changes where the DOM lives, not who its conceptual parent is in React.",
      "audit": {
        "primer": "A Portal lets you render a subtree into another DOM node without breaking React's logical tree. A dialog also needs focus, closing with Escape, an accessible name and blocking or handling of the focus outside it.",
        "example": "The modal is mounted in `document.body` to escape an `overflow: hidden` on the panel. On open, it focuses the title or first control; on close, it returns focus to the button that opened it.",
        "failureModes": [
          "The visual portal does not remove event propagation through the React tree.",
          "A modal without cleanup can leave Escape listeners or a scroll lock active after it closes."
        ]
      },
      "sources": [
        {
          "label": "createPortal (React)"
        },
        {
          "label": "WAI-ARIA Authoring Practices"
        }
      ]
    }
  },
  "styling_assets": {
    "_source": "2c867c67ca8a",
    "label": "CSS, assets and component design",
    "lesson": {
      "level": "Web",
      "summary": "CSS and assets are part of the contract: layout, states, responsive behavior, fonts, images and focus must be predictable.",
      "explanation": "Styling defines how appearance is expressed and what contract tokens, classes, assets and visual states have. CSS does not replace semantics or accessible behavior. A button can take a color token for hover and disabled, while its semantics remain `<button>`. A hashed asset in production allows long-lived caching; the HTML must reference the generated URL, not a local path.",
      "why": "A professional UI covers loading/error/responsive, not just the happy path.",
      "codeLabel": "Visual states",
      "steps": [
        "Define consistent variants.",
        "Reserve space to avoid layout shift.",
        "Optimizing images and fonts can outweigh React micro-optimizations."
      ],
      "takeaway": "Frontend quality includes states, semantics and visual performance.",
      "audit": {
        "primer": "Styling defines how appearance is expressed and what contract tokens, classes, assets and visual states have. CSS does not replace semantics or accessible behavior.",
        "example": "A button can take a color token for hover and disabled, while its semantics remain `<button>`. A hashed asset in production allows long-lived caching; the HTML must reference the generated URL, not a local path.",
        "failureModes": [
          "A high z-index does not fix a misunderstood stacking context.",
          "An icon that communicates state only through color fails for users with low color perception.",
          "Caching an asset without a fingerprint forever can serve an old version."
        ]
      },
      "sources": [
        {
          "label": "CSS custom properties (MDN)"
        },
        {
          "label": "WCAG: Reflow"
        }
      ]
    }
  },
  "component_architecture": {
    "_source": "800a2d5baa94",
    "label": "Component architecture",
    "lesson": {
      "level": "Architecture",
      "summary": "A healthy architecture separates the data layer, screen orchestration and pure presentational components.",
      "explanation": "Component architecture assigns ownership. A page or route knows the URL and the data; a feature component coordinates a use case; UI components receive focused contracts; custom Hooks encapsulate synchronization or reusable logic. These are roles, not mandatory folders. A boundary earns its cost when it lets you understand, test or replace a decision locally.",
      "why": "It lets the application grow without every component depending on routers, APIs or global state details.",
      "codeLabel": "Feature boundary",
      "steps": [
        "Organize code by business capabilities (features) instead of folders by file type.",
        "Extract network and cache logic into dedicated Custom Hooks with domain names (e.g. useOrders).",
        "Build screen components that orchestrate data and handle route navigation.",
        "Design pure presentational components that receive clear props and do not know that APIs or routers exist.",
        "Write behavior tests for UI components and integration tests for Custom Hooks."
      ],
      "pitfalls": [
        "Coupling reusable UI components (such as buttons or tables) directly to API client libraries or the app's routers.",
        "Creating abstractions and intermediate layers by reflex before there is a real need for reuse.",
        "Prop drilling through more than 4 levels instead of using composition with children."
      ],
      "takeaway": "Split responsibilities clearly: hooks fetch data, containers orchestrate and presentational components paint UI.",
      "audit": {
        "primer": "Component architecture decides which component owns data, which component coordinates the flow and which component only presents UI. Page, feature and presentational are not magic names: they are responsibility boundaries.",
        "example": "OrdersPage reads the URL and the cache; OrdersScreen receives `rows`, `isLoading` and callbacks; EmptyState only presents the empty case. If TanStack Query changes, the visual screen should not need rewriting.",
        "failureModes": [
          "A component that fetches, decides permissions, transforms data and paints 300 lines is hard to test and change.",
          "Splitting every div into a component can also hide the flow and add indirection with no benefit."
        ]
      },
      "tableTitle": "THE 3 LAYERS OF A COMPONENT",
      "tableLabel": "Clear responsibility boundaries",
      "table": {
        "columns": [
          "Layer",
          "Responsibility",
          "What it must NOT contain"
        ],
        "rows": [
          [
            "Custom Hook (Data)",
            "Network requests, cache, data formatting",
            "JSX markup, visual styles, routing"
          ],
          [
            "Feature Screen (Container)",
            "Orchestrate hooks, read the URL, handle dialogs",
            "Complex CSS styles, parsing logic"
          ],
          [
            "Presentational Component",
            "Paint UI, handle accessibility and events",
            "fetch calls, Redux/Query imports"
          ]
        ]
      },
      "docNotes": [
        "The React documentation starts from breaking the UI down and finding the minimal source of state. It does not prescribe universal categories like smart/dumb.",
        "A custom Hook shares logic, not state: each call keeps its own instance unless both connect to a shared external source.",
        "Separating data access from presentation can improve tests, but a wrapper that only forwards props and does not protect a decision adds indirection."
      ],
      "sources": [
        {
          "label": "Thinking in React"
        },
        {
          "label": "Reusing Logic with Custom Hooks"
        },
        {
          "label": "Choosing the State Structure (React)"
        }
      ]
    }
  },
  "component_api_patterns": {
    "_source": "715fa13a7306",
    "label": "Component API design",
    "lesson": {
      "level": "Architecture",
      "summary": "A good component API expresses intent with clear props, composition with children and callbacks with stable payloads.",
      "explanation": "A component's API is everything consumers can observe: props, children, ref, DOM, events, controlled/uncontrolled states, semantics, styles and timing. Designing it means exposing stable intent without hiding capabilities the native element needs, and without leaking internal details that cannot be changed later.",
      "why": "It avoids fragile components bloated with endless boolean props and lets the library evolve without breaking consumers.",
      "codeLabel": "Controlled and composed API",
      "steps": [
        "Identify the component's main capabilities and avoid creating a boolean prop for every visual variant.",
        "Use composition with children or Compound Components to allow flexible structures.",
        "For controlled components, expose the `value` pair (or equivalent) and the `onChange` / `onValueChange` callback.",
        "Design callbacks so they deliver extensible detail objects instead of multiple positional parameters.",
        "Preserve the platform's native contracts (such as `ref`, `disabled`, `aria-*`) when wrapping HTML elements."
      ],
      "pitfalls": [
        "Creating dozens of optional boolean props that produce state combinations impossible to maintain.",
        "Exposing the component's internal states as public props without a clear controlled vs uncontrolled policy.",
        "Changing the signature of public callbacks in later updates, breaking the application's consumers."
      ],
      "takeaway": "Design components as stable contracts: use composition for structure and clear payloads for events.",
      "audit": {
        "primer": "A component API is the contract of props, events, children, refs and controlled/uncontrolled states that consumers can use. A good API exposes intent and hides internal details.",
        "example": "Dialog receives `open` and `onOpenChange`, while the parent keeps the source of truth. `children` lets you compose the title and actions without creating a boolean prop for each variant.",
        "failureModes": [
          "Exposing internal states as public props makes it harder to change the implementation.",
          "A callback with no contract about when it fires can cause double submits or unexpected closes."
        ]
      },
      "docNotes": [
        "children and slots through composition usually scale better than a boolean prop per variant, but the structure must remain understandable and accessible.",
        "In React 19, function components can receive ref as a prop. forwardRef still appears in existing code and must be understood for maintenance.",
        "cloneElement and Children exist, but the documentation considers them uncommon and potentially fragile APIs; render props, Context or custom Hooks usually express the relationship better."
      ],
      "sources": [
        {
          "label": "Passing Props to a Component (React)"
        },
        {
          "label": "Passing data deeply with Context (React)"
        },
        {
          "label": "cloneElement (React)"
        },
        {
          "label": "Sharing State Between Components (React)"
        }
      ]
    }
  },
  "state_management": {
    "_source": "1ff7574c39d1",
    "label": "State management: Context, store and URL",
    "lesson": {
      "level": "Architecture",
      "summary": "State management decides where each piece of data lives based on its scope, how often it changes and its legitimate owner.",
      "explanation": "Choosing state management means assigning a source of truth based on semantics and scope. Local state owns isolated interaction; the common ancestor coordinates children; the URL owns shareable navigation; Context distributes a dependency; useSyncExternalStore integrates an external source; a query cache observes remote data. A library does not remove the need to decide ownership.",
      "why": "It prevents both accidental prop drilling and the antipattern of putting all state into a global store or a single unified Context.",
      "code": "URL: shareable filters\nContext: theme\nStore: cart\nQuery cache: orders",
      "codeLabel": "Choosing the owner",
      "steps": [
        "Decide whether the data is navigable: if it must be shareable via a link, its source of truth is the URL.",
        "If the data is a low-frequency global UI preference (theme), put it in a Context.",
        "If it is complex interactive client state shared by distant pieces (cart), use a global Store such as Zustand.",
        "If the data comes from an external API, manage it with a dedicated server cache.",
        "Keep as local useState any interaction state that only matters to a single component."
      ],
      "pitfalls": [
        "Duplicating the same data in the URL, in Context and in a useState, creating conflicting sources of truth.",
        "Using Context for high-frequency data, causing the whole consumer tree to re-render on every update.",
        "Storing API responses in Redux or Context instead of using a server cache manager."
      ],
      "takeaway": "There is no single tool for state: choose the location based on the data's scope, frequency and ownership.",
      "audit": {
        "primer": "State management is not choosing a single library: it is deciding the owner based on scope. The URL serves navigable state, Context broad dependencies, a store complex coordination and a query cache remote data.",
        "example": "Shareable filters live in the URL; an input's draft lives locally; the theme lives in Context; a complex cart can live in a store; orders stay in a server state cache.",
        "failureModes": [
          "Duplicating the same data in the URL, Context and a store creates fragile synchronization.",
          "A global store does not make backend data fresh or replace invalidation."
        ]
      },
      "tableTitle": "STATE DECISION MATRIX",
      "tableLabel": "Where to place each piece of data in the architecture",
      "table": {
        "columns": [
          "Data category",
          "Recommended location",
          "Concrete example"
        ],
        "rows": [
          [
            "Filters and navigation",
            "URL Query Params",
            "?status=active&page=2"
          ],
          [
            "Global preference (low frequency)",
            "React Context",
            "Visual theme (dark/light), language"
          ],
          [
            "Complex client state",
            "External store (Zustand)",
            "Shopping cart, interactive canvas"
          ],
          [
            "Remote data",
            "Server Cache (TanStack Query)",
            "Order list, user profile"
          ]
        ]
      },
      "docNotes": [
        "Prop drilling is not automatically a problem: it makes dependencies explicit. Context is worth it when many descendants need the same dependency and composition is not enough.",
        "Changing a Context's value updates the consumers that read it. Splitting providers by responsibility and frequency can reduce work and coupling.",
        "Do not duplicate the same authority in the URL, Context and a store. If you need a draft, name it as a distinct concept and define when it is committed or reset."
      ],
      "sources": [
        {
          "label": "Managing State (React)"
        },
        {
          "label": "Passing Data Deeply with Context (React)"
        },
        {
          "label": "Choosing the State Structure (React)"
        }
      ]
    }
  },
  "external_stores": {
    "_source": "8f6fbd14d5c7",
    "label": "External stores and useSyncExternalStore",
    "lesson": {
      "level": "Architecture",
      "summary": "useSyncExternalStore provides the official protocol for React to read from and subscribe to an external source consistently during concurrent rendering.",
      "explanation": "useSyncExternalStore is the official bridge for a source whose lifecycle does not belong to React. subscribe notifies that something might have changed; getSnapshot returns the version React will compare with Object.is; getServerSnapshot provides a consistent observation for SSR and hydration. The store still has to guarantee immutable snapshots and correct subscriptions.",
      "why": "It is the official contract for integrating Redux, Zustand or browser APIs (online/offline) with React 18+ safely.",
      "codeLabel": "subscribe + getSnapshot",
      "steps": [
        "Provide a `subscribe` function that registers the change callback and returns the cleanup function.",
        "Implement `getSnapshot` so it returns the current state value immutably.",
        "Make sure `getSnapshot` returns the same reference in memory if the data has not changed.",
        "Provide `getServerSnapshot` to deliver a safe initial value during server-side rendering (SSR).",
        "React will use these functions to keep the screen synchronous and consistent during concurrent renders."
      ],
      "pitfalls": [
        "Returning a new object or array on every `getSnapshot` call, which causes infinite re-render loops in React.",
        "Using a manual `useEffect` to subscribe to global stores in applications that take advantage of React 18's concurrent features.",
        "Omitting `getServerSnapshot` in SSR projects (Next.js), producing mismatch errors during hydration."
      ],
      "takeaway": "useSyncExternalStore guarantees that stores outside React are read synchronously and consistently across the whole UI.",
      "audit": {
        "primer": "`useSyncExternalStore` is an official React Hook for reading a data source that lives outside React, such as online status, Redux or a state library. It takes subscribe, getSnapshot and optionally getServerSnapshot.",
        "example": "A connectivity store notifies when the browser goes offline. React subscribes, reads a stable snapshot and cleans up the subscription on unmount; during SSR it uses a known snapshot to avoid a different hydration.",
        "failureModes": [
          "Returning a new object from every getSnapshot call can produce infinite renders.",
          "A manual useEffect can make different parts read different versions during a concurrent render."
        ]
      },
      "docNotes": [
        "getSnapshot must return exactly the same value as long as the store has not changed. If it always builds a new object, React cannot stabilize the read.",
        "subscribe must return unsubscribe. If the subscribe function changes on every render, React resubscribes; it is usually declared outside the component.",
        "getServerSnapshot is required if the component is rendered on the server. Its initial client value must match the hydrated HTML."
      ],
      "sources": [
        {
          "label": "useSyncExternalStore (React)"
        },
        {
          "label": "useEffect (React)"
        }
      ]
    }
  },
  "typescript_react": {
    "_source": "6e27041b209e",
    "label": "TypeScript applied to React",
    "lesson": {
      "level": "Architecture",
      "summary": "TypeScript documents and checks component and state contracts at compile time, but it does not validate network data at runtime.",
      "explanation": "TypeScript makes compile-time relationships explicit: props, callbacks, refs and possible states. A discriminated union can prevent invalid combinations in the code. Because types are erased when JavaScript is generated, an HTTP response, localStorage or an external message still needs runtime validation before it becomes trustworthy data.",
      "why": "It lets you prevent errors from nonexistent properties, model UI states honestly and refactor with confidence.",
      "codeLabel": "Contracts and unions",
      "steps": [
        "Type component props and callbacks at the input boundaries.",
        "Use Discriminated Unions to represent mutually exclusive UI states (idle, loading, success, error).",
        "Extend native types such as `ComponentPropsWithoutRef<'button'>` when creating components that wrap HTML elements.",
        "Avoid using `any` or defensive casts (`as Type`) that hide the lack of real checks.",
        "Combine TypeScript with runtime validation schemas (Zod) when receiving external data from the network."
      ],
      "pitfalls": [
        "Using `as Type` to force a type onto a JSON response without validating that the fields actually exist at runtime.",
        "Defining props with multiple optional flags that allow contradictory UI states to be represented.",
        "Manually typing native events instead of using the built-in types provided by React."
      ],
      "takeaway": "TypeScript checks code during development; runtime validation protects the real data boundaries.",
      "audit": {
        "primer": "TypeScript checks shapes and relationships during the build, but it does not validate JSON arriving from the network at runtime. Prop types express the React contract; runtime validation protects the API boundary.",
        "example": "`Order` can type the table and its callbacks, while a schema validates that the JSON really contains `id`, `status` and `total`. This keeps a changed backend from breaking the UI far from the point of entry.",
        "failureModes": [
          "An `as Order` only silences the compiler; it neither transforms nor validates data.",
          "Overly generic types such as `any` push the error onto the consumer and lose the contract."
        ]
      },
      "docNotes": [
        "Use React's types and ComponentProps when you want to keep a native element's contract; omit or redefine only the props whose semantics actually change.",
        "A cast as T neither validates nor transforms the value. It is an assertion to the compiler and should be reserved for information the runtime already guaranteed by other means.",
        "A discriminated union expresses mutually exclusive states; on its own it does not guarantee that the transition machine is correct."
      ],
      "sources": [
        {
          "label": "Using TypeScript (React)"
        },
        {
          "label": "Narrowing (TypeScript)"
        }
      ]
    }
  },
  "testing_rtl": {
    "_source": "71de9d5e2d67",
    "label": "Testing Library and behavior tests",
    "lesson": {
      "level": "Testing",
      "summary": "React Testing Library tests what the user can observe and do, not the internal implementation.",
      "explanation": "React Testing Library tests the UI the way a person uses it: it queries roles and accessible names, fires interactions and checks visible results. The goal is to protect behavior, not the internal structure of components. A login test finds the button by role, fills in email and password, clicks and waits for the dashboard to appear. If tomorrow we swap divs for a different component but the flow stays the same, the test is still valid.",
      "why": "Behavior tests survive refactors better because they protect the visible contract (what the person finds, does and gets back) instead of coupling to internal functions or state.",
      "codeLabel": "Observable interaction",
      "steps": [
        "Query by role, label or text.",
        "Use user-event for realistic interaction.",
        "Mock the external boundary, not every internal function."
      ],
      "takeaway": "Test user intent and observable outcomes.",
      "audit": {
        "primer": "React Testing Library tests the UI the way a person uses it: it queries roles and accessible names, fires interactions and checks visible results. The goal is to protect behavior, not the internal structure of components.",
        "example": "A login test finds the button by role, fills in email and password, clicks and waits for the dashboard to appear. If tomorrow we swap divs for a different component but the flow stays the same, the test is still valid.",
        "failureModes": [
          "Querying internal classes can make a visual refactor break tests without any change in behavior.",
          "An async test that does not wait for the response can pass or fail depending on timing."
        ]
      },
      "sources": [
        {
          "label": "Guiding Principles (Testing Library)"
        },
        {
          "label": "user-event (Testing Library)"
        }
      ]
    }
  },
  "testing_async": {
    "_source": "6208272c7687",
    "label": "Testing async code, mocks and MSW",
    "lesson": {
      "level": "Testing",
      "summary": "Async tests must control requests, loading, success, error and cleanup without depending on a real network.",
      "explanation": "Testing async code means controlling time and external responses. MSW intercepts requests in the test like a fake server; the test checks loading, success, error and recovery without depending on a real API. A test returns 500 for `GET /orders`, checks the message and presses Retry; then MSW returns 200 and the table is verified. The test demonstrates the observable contract and the transition from error to success.",
      "why": "Async code produces flakiness and false guarantees if it is tested poorly.",
      "codeLabel": "Mocking the server with MSW",
      "steps": [
        "MSW intercepts requests like a real API.",
        "Use findBy/waitFor, not sleeps.",
        "Test error, timeout, retry and empty responses if they are part of the contract."
      ],
      "takeaway": "Mock the server and test the UI that reacts to the network.",
      "audit": {
        "primer": "Testing async code means controlling time and external responses. MSW intercepts requests in the test like a fake server; the test checks loading, success, error and recovery without depending on a real API.",
        "example": "A test returns 500 for `GET /orders`, checks the message and presses Retry; then MSW returns 200 and the table is verified. The test demonstrates the observable contract and the transition from error to success.",
        "failureModes": [
          "Mocking the internal function that does the fetch can hide integration errors in the HTTP contract.",
          "Not cleaning up handlers, timers or cache between tests causes contamination and flakiness."
        ]
      },
      "sources": [
        {
          "label": "Mock Service Worker docs"
        },
        {
          "label": "Guiding Principles (Testing Library)"
        }
      ]
    }
  },
  "security_frontend": {
    "_source": "85fb68802a26",
    "label": "XSS, CSRF, storage and web security",
    "lesson": {
      "level": "Security",
      "summary": "React escapes text by default, but XSS, CSRF, tokens, URLs and external data require explicit decisions.",
      "explanation": "XSS is running untrusted JavaScript in the app's context. CSRF forces an authenticated browser to send an action the user did not intend. The frontend helps, but the API must validate input, identity and permissions. A comment is rendered as text, not as arbitrary HTML. If a session cookie is used, a mutation requires a CSRF defense; if an in-memory access token and an HttpOnly refresh token are used, the flow changes but it still needs authorization in Rails.",
      "why": "Security breaks at the edges: raw HTML, storage, redirects and trust in the client.",
      "code": "return <p>{comment.body}</p>\n\n// dangerouslySetInnerHTML only with sanitized HTML",
      "codeLabel": "Trust boundaries",
      "steps": [
        "The backend validates and authorizes; React improves UX.",
        "Sanitize HTML if you really need it.",
        "Weigh an in-memory access token and an HttpOnly refresh token against localStorage.",
        "Everything included in the bundle is public."
      ],
      "takeaway": "The client is never the final authority.",
      "audit": {
        "primer": "XSS is running untrusted JavaScript in the app's context. CSRF forces an authenticated browser to send an action the user did not intend. The frontend helps, but the API must validate input, identity and permissions.",
        "example": "A comment is rendered as text, not as arbitrary HTML. If a session cookie is used, a mutation requires a CSRF defense; if an in-memory access token and an HttpOnly refresh token are used, the flow changes but it still needs authorization in Rails.",
        "failureModes": [
          "An API key included in the bundle is not secret.",
          "Hiding the Delete button does not stop a user from calling `DELETE /orders/42` manually."
        ]
      },
      "sources": [
        {
          "label": "XSS Prevention (OWASP)"
        },
        {
          "label": "CSRF Prevention (OWASP)"
        },
        {
          "label": "Trusted Types API (MDN)"
        }
      ]
    }
  },
  "ssr_hydration": {
    "_source": "7c78b2875a3d",
    "label": "SSR, hydration and React frameworks",
    "lesson": {
      "level": "Web",
      "summary": "SSR sends HTML from the server, and hydration connects that HTML to React to make it interactive.",
      "explanation": "With SSR, the server runs React and sends visible HTML. The browser shows that HTML before downloading all the JavaScript; then hydrateRoot recomputes the same tree and attaches events to the existing nodes. If the client's first result differs (because of a date, a random value, localStorage or invalid markup), a hydration mismatch appears. This is not Server Components yet: the code for these traditional components also reaches the client.",
      "why": "It lets you reason about content visible before JavaScript, SEO, first load and hydration mismatches, and understand what responsibility frameworks like Next take on.",
      "codeLabel": "HTML first, interactivity later",
      "steps": [
        "SSR can improve the first response but adds complexity.",
        "A hydration mismatch appears if the server render and the first client render differ.",
        "window/localStorage do not exist during the server render."
      ],
      "takeaway": "SSR changes where the first render is computed; hydration requires compatible markup.",
      "audit": {
        "primer": "SSR generates HTML on the server so the browser can show content before it has all the JavaScript. Hydration is the process in which React attaches events and confirms that HTML; the client's first render must match.",
        "example": "Rendering `new Date()` or reading localStorage during the first render can produce different markup on the server and the client. You can show a stable placeholder and read the data in an Effect after hydrating.",
        "failureModes": [
          "Accessing `window` during the server render breaks because it does not exist in Node.",
          "Silencing all hydration warnings can hide a real visual or content difference."
        ]
      },
      "sources": [
        {
          "label": "hydrateRoot (React)"
        }
      ]
    }
  }
};
