// react concepts (testing_tools_legacy, rendering_strategies, react_resources_activity, event_loop_tasks, browser_rendering_pipeline, memory_resource_lifecycle, http_cache_network, realtime_offline, frontend_system_design, module_boundaries_monorepo, feature_flags_migrations, frontend_observability, ci_cd_release_strategy)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "testing_tools_legacy": {
    "_source": "467580cfa19c",
    "label": "Test tooling and legacy APIs",
    "lesson": {
      "level": "Testing",
      "summary": "The runner (Vitest or Jest), the DOM environment, Testing Library, user-event, MSW and the browser runner play different roles. React 19 deprecates react-test-renderer and recommends moving away from shallow rendering, because both depend on details that do not represent the user's environment well.",
      "explanation": "Modern testing verifies contracts at the cheapest layer that can observe the risk faithfully. RTL verifies that a 500 shows Retry using MSW; Playwright checks real focus and navigation; a unit test exercises a pure parser with many combinations.",
      "why": "An interview often mixes tool names; answering well means placing each one and choosing evidence according to the risk.",
      "code": "test(\"saves an order\", async () => {\n  const user = userEvent.setup()\n  server.use(http.post(\"/orders\", () => HttpResponse.json({ id: \"42\" })))\n  render(<Checkout />)\n  await user.click(screen.getByRole(\"button\", { name: /confirm/i }))\n  expect(await screen.findByText(/order 42 created/i)).toBeVisible()\n})",
      "codeLabel": "Interaction, network and observable result",
      "steps": [
        "The test runner discovers tests, runs assertions and provides mocks/timers; jsdom simulates DOM APIs without being a full browser.",
        "Testing Library renders and queries by roles, names and visible results; user-event reproduces more realistic interaction sequences.",
        "MSW intercepts HTTP at the network edge so the component uses its real client without calling an external backend.",
        "renderHook is meant for Hooks that are a reusable API; if the Hook only exists for one feature, testing the component usually gives more confidence.",
        "A snapshot can protect a small, deliberate output; a huge snapshot does not explain which behavior matters."
      ],
      "pitfalls": [
        "Shallow rendering skips children and can hide integration, Context and effects; React recommends migrating to a modern testing library.",
        "react-test-renderer is deprecated in React 19 and can behave differently from the real DOM.",
        "Mocking every internal Hook makes the test repeat the implementation and keep passing even when the user flow is broken."
      ],
      "takeaway": "Name the observable risk first; then choose the runner, simulated DOM, intercepted network or real browser.",
      "tableTitle": "TOOL BY RESPONSIBILITY",
      "tableLabel": "Avoid treating everything as Jest",
      "table": {
        "columns": [
          "Piece",
          "Responsibility",
          "Does not prove"
        ],
        "rows": [
          [
            "Vitest/Jest",
            "runner, assertions, mocks",
            "real layout"
          ],
          [
            "RTL + user-event",
            "DOM behavior",
            "full browser"
          ],
          [
            "MSW",
            "HTTP contract from the client",
            "real backend"
          ],
          [
            "Playwright",
            "flow in the browser",
            "every unit branch"
          ]
        ]
      },
      "audit": {
        "primer": "Modern testing verifies contracts at the cheapest layer that can observe the risk faithfully.",
        "example": "RTL verifies that a 500 shows Retry using MSW; Playwright checks real focus and navigation; a unit test exercises a pure parser with many combinations.",
        "failureModes": [
          "fireEvent can skip events that user-event does fire.",
          "waitFor with vague assertions can hide that the test never reached the expected state."
        ]
      },
      "sources": [
        {
          "label": "React 19 Upgrade Guide: testing APIs"
        },
        {
          "label": "React Testing Library"
        },
        {
          "label": "Mock Service Worker"
        }
      ]
    }
  },
  "rendering_strategies": {
    "_source": "0f3893ea1b3d",
    "label": "CSR, SSR, SSG, streaming and hydration",
    "lesson": {
      "level": "Platform",
      "summary": "CSR, SSR, SSG and streaming describe when and where HTML is produced; hydration connects client-side React to previously produced HTML. Server Components describe where a component runs and is bundled. They are related axes, not interchangeable names.",
      "explanation": "SSR, SSG and Server Components answer different questions. First ask when the HTML is generated and what JavaScript the client needs. A public landing page can be static; a personalized account page uses per-request rendering; an interactive filter is still client-side even if it receives its catalog from a Server Component.",
      "why": "A current interview expects you to choose a strategy based on content, cache, personalization, SEO, latency and operational cost, not to declare that SSR is always faster.",
      "codeLabel": "Three different entry points",
      "steps": [
        "CSR sends a shell and produces the main UI in the browser after loading JavaScript.",
        "SSR produces HTML per request; SSG produces it during build or revalidation to serve it from cache/CDN.",
        "Streaming SSR sends ready parts and Suspense fallbacks before the whole page is complete.",
        "Hydration requires the first client tree to match the server HTML; then it attaches events.",
        "Server Components can run at build time or per request and send a serialized representation; their code is not part of the client bundle."
      ],
      "pitfalls": [
        "SSR can improve initial content but also adds server work, hydration and client JavaScript.",
        "Pure SSG does not work for per-request personalized data without an additional dynamic layer.",
        "Reading Date.now, random, window or localStorage in the first render can cause a mismatch."
      ],
      "takeaway": "Separate HTML generation, hydration and the server/client boundary before comparing architectures.",
      "tableTitle": "RENDERING AXES",
      "tableLabel": "When it is produced and what reaches the browser",
      "table": {
        "columns": [
          "Strategy",
          "Timing",
          "Trade-off"
        ],
        "rows": [
          [
            "CSR",
            "in the browser",
            "simple shell; content waits for JS/data"
          ],
          [
            "SSR",
            "per request",
            "personalization; complex cost and cache"
          ],
          [
            "SSG",
            "build/revalidation",
            "fast CDN; limited freshness"
          ],
          [
            "Streaming SSR",
            "per request, in parts",
            "progressive content; boundaries required"
          ]
        ]
      },
      "audit": {
        "primer": "SSR, SSG and Server Components answer different questions. First ask when the HTML is generated and what JavaScript the client needs.",
        "example": "A public landing page can be static; a personalized account page uses per-request rendering; an interactive filter is still client-side even if it receives its catalog from a Server Component.",
        "failureModes": [
          "Calling any code that runs on the server SSR confuses initial HTML with Server Components.",
          "Hydrating different markup can force client-side recovery and hide data errors or invalid HTML."
        ]
      },
      "sources": [
        {
          "label": "React DOM Server APIs"
        },
        {
          "label": "hydrateRoot (React)"
        },
        {
          "label": "Server Components (React)"
        }
      ]
    }
  },
  "react_resources_activity": {
    "_source": "d4e7ad30628e",
    "label": "Modern React: use, Suspense and Activity",
    "lesson": {
      "level": "Modern React",
      "summary": "The use API reads a resource such as a Promise or Context during render and integrates with Suspense and Error Boundaries. Activity, stable in React 19.2, lets you hide a part of the tree while preserving state, unmounting its Effects and deferring hidden work. Both require understanding concurrent rendering and framework boundaries.",
      "explanation": "use is an API for reading during render; Activity manages a visible or hidden part of the tree. They do not replace a data architecture or authorization. A Server Component creates a Promise and passes it to a Client Component that reads it with use under Suspense. A visited tab is kept in a hidden Activity, but its connection is cleaned up while it is not visible.",
      "why": "GreatFrontend covers React 19, but current preparation should also recognize the additions in React 19.2 and distinguish a stable React API from an integration that only a framework provides.",
      "codeLabel": "Reading a resource and preserving a hidden screen",
      "steps": [
        "use(Promise) suspends while the Promise is pending, returns its value when it fulfills and propagates the rejection to the Error Boundary.",
        "Unlike regular Hooks, use can be called in conditions and loops, but it must still run while React is rendering a component or Hook.",
        "The Promise must be stable; creating a new one on every client render can suspend repeatedly. Frameworks usually produce and cache those resources.",
        "A hidden Activity hides its children, unmounts Effects and defers updates, but keeps state for a later navigation.",
        "useEffectEvent, Activity and React Performance Tracks are React 19.2 topics; cacheSignal and several resource APIs depend on the Server Components environment."
      ],
      "pitfalls": [
        "use does not turn any client-side fetch into a complete strategy for caching, deduplication and mutation.",
        "Hiding an Activity does not mean its connections stay active: its Effects are cleaned up.",
        "Do not present a framework API as automatically available in a Vite SPA without that integration."
      ],
      "takeaway": "Modern React coordinates resources and priority, but the framework still defines how data is created, cached and transported.",
      "prompt": "Compare use(Promise), a router loader and TanStack Query for a detail screen. Explain who creates the resource, who caches it and how an error is recovered.",
      "audit": {
        "primer": "use is an API for reading during render; Activity manages a visible or hidden part of the tree. They do not replace a data architecture or authorization.",
        "example": "A Server Component creates a Promise and passes it to a Client Component that reads it with use under Suspense. A visited tab is kept in a hidden Activity, but its connection is cleaned up while it is not visible.",
        "failureModes": [
          "Creating the Promise during every render can restart Suspense.",
          "Keeping hidden state can increase memory; it is only worth it for surfaces where fast navigation justifies it."
        ]
      },
      "sources": [
        {
          "label": "use (React)"
        },
        {
          "label": "Activity (React)"
        },
        {
          "label": "React 19.2"
        }
      ],
      "docNotes": [
        "Unlike most Hooks, use can be called inside conditions and loops, but it must still run during render inside a component or Hook. A Promise created on every render can cause repeated suspension; the source must be stable or come from the framework."
      ]
    }
  },
  "event_loop_tasks": {
    "_source": "1c47adf4d723",
    "label": "Event loop, tasks and microtasks",
    "lesson": {
      "level": "Browser runtime",
      "summary": "The event loop decides when JavaScript can run and in what order tasks, microtasks, rendering and callbacks are processed.",
      "explanation": "Think of it as a queue shared by your application and the platform. Every callback that monopolizes that queue delays events, layout and paint; that is why the solution depends on whether the cost is CPU, network or coordination.",
      "why": "It lets you explain frozen UIs, promises that run before timers and why splitting long work improves interaction.",
      "codeLabel": "Observable event loop order",
      "steps": [
        "A task runs JavaScript until it yields control.",
        "When it finishes, the browser drains microtasks before the next task.",
        "Rendering happens when the browser gets an opportunity to paint again.",
        "Long CPU work should be split up or moved off the main thread."
      ],
      "pitfalls": [
        "An infinite chain of microtasks can also prevent the browser from painting.",
        "setTimeout(0) does not mean immediate execution.",
        "React scheduling operates within these constraints; it does not remove the cost of the JavaScript."
      ],
      "takeaway": "If the main thread does not return to the browser, there is no responsive input and no new frame.",
      "audit": {
        "primer": "The main thread runs a JavaScript task until it finishes, drains the pending microtasks and only then can it handle another task and find an opportunity to render. A long callback blocks input and paint even if React is well designed.",
        "example": "Parsing a large file during a click takes 180 ms: the spinner is scheduled, but the browser cannot paint it until parsing finishes. Splitting the work, using a Worker or moving it to the server restores opportunities to respond.",
        "failureModes": [
          "A chain that keeps adding new Promises can starve the event loop with microtasks and prevent paint.",
          "setTimeout(0) schedules another task; it does not guarantee immediate execution or an exact latency.",
          "Marking an update as a transition does not reduce the cost of an indivisible CPU-bound function."
        ]
      },
      "sources": [
        {
          "label": "JavaScript execution model (MDN)"
        }
      ]
    }
  },
  "browser_rendering_pipeline": {
    "_source": "acbc721c3995",
    "label": "Browser rendering pipeline",
    "lesson": {
      "level": "Browser runtime",
      "summary": "The browser turns DOM and CSS into style, layout, paint and compositing; each stage has different costs and triggers.",
      "explanation": "React decides which DOM needs to change; the browser decides how to turn that DOM into pixels. The DevTools Performance panel shows whether the delay is in scripting, layout, paint or compositing.",
      "why": "A senior engineer should distinguish an expensive React render from layout thrashing, heavy images or too much painting.",
      "codeLabel": "Measure before changing",
      "steps": [
        "Style resolves CSS rules.",
        "Layout computes geometry.",
        "Paint draws pixels and layers.",
        "Compositing combines layers; transform and opacity usually avoid a new layout."
      ],
      "pitfalls": [
        "Alternating layout reads and writes can force repeated synchronous calculations.",
        "A permanent will-change consumes memory.",
        "Reducing React renders does not fix a huge image or a problematic CSS selector."
      ],
      "takeaway": "Find which stage is consuming the frame before choosing the optimization.",
      "audit": {
        "primer": "After running JavaScript, the browser resolves styles, computes geometry in layout, draws in paint and combines layers in compositing. The expensive stage depends on which property changed and how much of the document was invalidated.",
        "example": "Animating left forces geometry to be recalculated and can trigger a repaint; animating transform usually allows compositing a layer that is already drawn. The DevTools Performance panel confirms whether the real bottleneck was scripting, layout, paint or a heavy image.",
        "failureModes": [
          "Reading getBoundingClientRect after several style writes can force synchronous layout repeatedly.",
          "Adding will-change to everything reserves resources and memory without guaranteeing an improvement.",
          "Reducing React renders does not fix layout thrashing caused by imperative code."
        ]
      },
      "sources": [
        {
          "label": "Rendering performance (web.dev)"
        },
        {
          "label": "Performance panel (Chrome DevTools)"
        }
      ]
    }
  },
  "memory_resource_lifecycle": {
    "_source": "6d0cb8e411f4",
    "label": "Memory, resources and leaks",
    "lesson": {
      "level": "Browser runtime",
      "summary": "A leak appears when listeners, timers, observers, caches or closures keep references that should no longer be alive.",
      "explanation": "Unmounted state is not the only risk. Observers, subscriptions and global structures can keep pointing at old objects; the test is that the references disappear after repeating the flow.",
      "why": "SPAs can stay open for hours; a small leak per navigation turns into real degradation.",
      "codeLabel": "Acquire and release the resource",
      "steps": [
        "Name the resource being created.",
        "Define who its owner is.",
        "Release it in cleanup or when its useful life ends.",
        "Confirm with heap snapshots and allocation profiling, not just by looking at total RAM."
      ],
      "pitfalls": [
        "Storing DOM nodes in a global cache can retain entire subtrees.",
        "An incorrect cleanup that uses a different callback does not remove the original listener.",
        "Aborting a fetch avoids obsolete work even if the garbage collector could reclaim the memory."
      ],
      "takeaway": "Every resource needs an owner, a lifetime and a release mechanism.",
      "audit": {
        "primer": "A leak appears when something that is no longer useful is still reachable: listeners, observers, timers, sockets, caches or closures keep references. The fix starts by naming who acquires the resource and when its life ends.",
        "example": "A screen creates a ResizeObserver on its table. The Effect stores the same instance and cleanup calls disconnect on unmount. A heap snapshot after opening and closing it twenty times confirms that the previous tables are no longer retained.",
        "failureModes": [
          "removeEventListener with a different function does not remove the original listener.",
          "An unbounded global cache can retain responses and nodes even if every component cleans up.",
          "Looking only at total RAM confuses legitimate caching, deferred garbage collection and growing retention."
        ]
      },
      "sources": [
        {
          "label": "Memory problems (Chrome DevTools)"
        }
      ]
    }
  },
  "http_cache_network": {
    "_source": "c3c72eaace64",
    "label": "HTTP, caching and asset delivery",
    "lesson": {
      "level": "Browser runtime",
      "summary": "Network performance depends on HTTP, compression, caching, CDN, priority and the size/order of resources.",
      "explanation": "Separate versioned content from responses that represent changing state. The browser, CDN and server all take part in freshness; React Query does not replace the HTTP cache.",
      "why": "It lets you design immutable assets, revalidatable data and diagnostics based on the waterfall instead of intuition.",
      "codeLabel": "Different policies per resource",
      "steps": [
        "Fingerprinted assets can be cached for a long time.",
        "HTML is usually revalidated to discover the new version.",
        "ETag allows a 304 without transferring the body again.",
        "The waterfall reveals DNS, connection, TTFB, download and blocking dependencies."
      ],
      "pitfalls": [
        "no-cache does not mean do not store; it means revalidate.",
        "Caching index.html as immutable can leave an app pointing to deleted chunks.",
        "More requests is not always worse under HTTP/2; measure size and critical dependencies."
      ],
      "takeaway": "The caching strategy is part of the deploy protocol.",
      "audit": {
        "primer": "Web delivery has several caches with different policies. Hashed assets can be immutable; HTML is usually revalidated to discover the current build; API responses depend on freshness, privacy and validators such as ETag.",
        "example": "app.a1b2.js is served for a year with immutable because different content would produce a different name. index.html uses no-cache so it can receive a 304 or a new version. That way it never ends up pointing for months to chunks the deploy already removed.",
        "failureModes": [
          "no-cache allows storing and forces revalidation; no-store is the directive that prevents storage.",
          "Marking index.html as immutable can leave clients stuck on an old asset graph.",
          "The TanStack Query cache improves app state, but it does not replace the CDN, the HTTP cache or validators."
        ]
      },
      "sources": [
        {
          "label": "HTTP caching (MDN)"
        }
      ]
    }
  },
  "realtime_offline": {
    "_source": "c921b353209d",
    "label": "Real time, reconnection and offline",
    "lesson": {
      "level": "Browser runtime",
      "summary": "Real time and offline require modeling connection, reconnection, ordering, duplicates and reconciliation with the server's authority.",
      "explanation": "Design explicitly what the user sees when the connection drops and which data becomes the authority again on reconnect. SSE, WebSocket or polling are transports; the semantics live on top of them.",
      "why": "An open connection does not guarantee consistency; messages can be repeated, go missing or arrive after a refetch.",
      "codeLabel": "Snapshot plus events",
      "steps": [
        "Get an authoritative snapshot.",
        "Apply identifiable, deduplicable events.",
        "Reconnect with backoff and jitter.",
        "When the connection is restored, reconcile before assuming continuity."
      ],
      "pitfalls": [
        "Retrying immediately from hundreds of clients produces a thundering herd.",
        "Storing offline mutations requires resolving conflicts.",
        "The browser's online indicator does not prove that your API is reachable."
      ],
      "takeaway": "Real time is a consistency and recovery problem, not just a sockets problem.",
      "audit": {
        "primer": "Real time needs semantics above the transport: an initial snapshot, identifiable events, ordering or versioning, deduplication, reconnection and a rule to reconcile what was lost during the disconnection.",
        "example": "The client loads orders at version 42 and then applies events 43 and 44 over WebSocket. If it reconnects and receives 47, it requests a snapshot or the missing events before continuing; it does not assume that everything it did not receive never happened.",
        "failureModes": [
          "Reconnecting every client immediately after an outage can take the service down again.",
          "navigator.onLine only describes network connectivity and does not prove that the API responds.",
          "Accepting offline writes without a conflict policy can overwrite another actor's changes."
        ]
      },
      "sources": [
        {
          "label": "WebSocket API (MDN)"
        },
        {
          "label": "Navigator.onLine (MDN)"
        }
      ]
    }
  },
  "frontend_system_design": {
    "_source": "d0afe1bd40af",
    "label": "Frontend system design",
    "lesson": {
      "level": "System design",
      "summary": "Frontend system design turns requirements into domain boundaries, data flows, failure states and contracts between the browser, the API and teams.",
      "explanation": "Frontend system design turns an ambiguous need into a verifiable model: users and constraints, sources of truth, observable states, boundaries between the browser and services, partial failures, security, performance, evidence and evolution. The diagram should show the flow and the authority behind each decision, not just component names.",
      "why": "It is the core skill for answering open-ended prompts without jumping straight to components or libraries.",
      "code": "Requirements -> invariants -> flows -> ownership\n          -> boundaries -> failures -> evidence\n\nOrders feature:\nURL -> query cache -> screen -> mutation -> invalidation",
      "codeLabel": "From requirement to architecture",
      "steps": [
        "Clarify users, scale and constraints.",
        "Name states and invariants.",
        "Assign ownership to the URL, component, store, cache and backend.",
        "Draw boundaries, failures, observability and the evolution strategy."
      ],
      "pitfalls": [
        "A box diagram without flow does not explain the system.",
        "Choosing Redux, microfrontends or SSR before the problem is solution-first.",
        "The happy path is not enough: include permissions, errors, retries and partial states."
      ],
      "takeaway": "A good architecture makes decisions, ownership and recovery visible.",
      "audit": {
        "primer": "Frontend system design is designing the complete flow of a feature: requirements, ownership, contracts, states, failures, observability and evolution. It is not drawing isolated components or choosing a library before understanding the problem.",
        "example": "For Orders, the URL owns the filters, the query cache owns remote data, the screen composes loading/error/empty and Rails authorizes every request. The diagram should also show what happens if the API is slow, if a widget fails or if the contract changes.",
        "failureModes": [
          "A box diagram that only shows the happy path does not explain recovery or ownership.",
          "Choosing Redux, SSR or microfrontends before knowing the scale and constraints adds complexity without a decision to protect."
        ]
      },
      "docNotes": [
        "Separate functional requirements from quality attributes. 'Filter orders' does not yet answer latency, volume, permissions, offline or accessibility.",
        "For each arrow in the diagram, ask what data travels, who can reject it, how pending is observed and what happens if the response arrives late or duplicated.",
        "Finish with evidence: metrics, tests, rollout and rollback. An architecture that cannot be verified is just a hypothesis."
      ],
      "sources": [
        {
          "label": "Thinking in React"
        },
        {
          "label": "Threat Modeling (OWASP)"
        },
        {
          "label": "Web Vitals (web.dev)"
        }
      ]
    }
  },
  "module_boundaries_monorepo": {
    "_source": "0d5f3e799880",
    "label": "Modules, packages and monorepo",
    "lesson": {
      "level": "System design",
      "summary": "Module boundaries define what each feature can import, which contracts are public and who can change a dependency.",
      "explanation": "A module boundary controls import direction, public API and ownership of change. A folder improves navigation; a package can add entry points, versioning and a build; a monorepo coordinates several projects. None of those forms produces decoupling if consumers import internals or share state and contracts without a deliberate direction.",
      "why": "In a large codebase, the direction of dependencies affects maintainability more than the exact folder structure.",
      "codeLabel": "Explicit dependency direction",
      "steps": [
        "Group by business capability.",
        "Expose public entry points.",
        "Avoid deep imports of internals.",
        "Use tooling to detect cycles and ownership to review sensitive boundaries."
      ],
      "pitfalls": [
        "A monorepo does not create modularity by itself.",
        "shared can turn into a junk drawer with no owner.",
        "Splitting packages prematurely adds versioning and builds without isolating a real decision."
      ],
      "takeaway": "A boundary is worth it when it reduces coupling and keeps change local.",
      "audit": {
        "primer": "A module boundary defines which API is public, which imports are forbidden and who is responsible for change. A monorepo organizes many packages, but it does not create modularity by itself.",
        "example": "`features/orders` can import `shared/http` through a public entry point, but not `features/billing/internal`. A test or lint rule detects cycles before two teams turn a temporary dependency into a permanent contract.",
        "failureModes": [
          "A `shared` package with no owner becomes a junk drawer of utilities that everyone modifies.",
          "Splitting packages without isolating a real decision adds builds, versioning and coordination."
        ]
      },
      "docNotes": [
        "Expose public entry points and avoid deep imports that make the internal structure observable.",
        "Detect cycles because they make it ambiguous which layer can change which. The goal is not a perfect DAG, but for exceptions to be visible and justified.",
        "Extracting shared code too early can couple different domains to an abstraction based only on visual similarity."
      ],
      "sources": [
        {
          "label": "Package entry points (Node.js)"
        },
        {
          "label": "Project References (TypeScript)"
        },
        {
          "label": "Semantic Versioning"
        }
      ]
    }
  },
  "feature_flags_migrations": {
    "_source": "d54fbf54ef79",
    "label": "Feature flags and gradual migrations",
    "lesson": {
      "level": "System design",
      "summary": "A gradual migration lets you change architecture or UX while keeping the system deployable and reversible at every stage.",
      "explanation": "A safe migration separates compatibility, activation and cleanup. Expand adds the new contract without breaking consumers; migrate moves traffic or data with telemetry; contract removes the old path once no dependency on it remains. A feature flag controls exposure, but it also creates state combinations that must be tested and retired.",
      "why": "Senior projects can rarely stop everything to replace an entire application.",
      "codeLabel": "Reversible change",
      "steps": [
        "Define the population and the success criterion.",
        "Separate deploy from release.",
        "Instrument both paths.",
        "Remove the flag, the old code and the temporary metrics when the migration is done."
      ],
      "pitfalls": [
        "Permanent flags duplicate states and debt.",
        "Two implementations writing incompatible formats require a data strategy.",
        "A UI rollback does not help if a destructive backend migration has already run."
      ],
      "takeaway": "Every phase must be deployable, observable and reversible.",
      "audit": {
        "primer": "A gradual migration separates deploy from release: first we make the system compatible, then we activate the new path for a controlled population and finally we retire the old one.",
        "example": "A new checkout can be enabled for employees, with conversion and errors observed, then expanded to 10% and switched back to the previous flow if it fails. If the data format changes, compatibility is added first, then the data is migrated and finally the old path is removed.",
        "failureModes": [
          "A permanent flag duplicates paths and increases state combinations.",
          "A UI rollback does not undo a destructive backend migration.",
          "Without per-variant metrics we cannot tell whether the new path improved things or just received less traffic."
        ]
      },
      "docNotes": [
        "Deploy and release are different decisions: the code can be deployed but inactive while it is validated with employees, a percentage or cohorts.",
        "Define before the rollout which metrics allow moving forward and which signals call for a rollback.",
        "The migration does not end when it reaches 100%. You still need to delete the flag, the compatibility code, the temporary metrics and the old documentation."
      ],
      "sources": [
        {
          "label": "Feature Toggles"
        },
        {
          "label": "Parallel Change"
        }
      ]
    }
  },
  "frontend_observability": {
    "_source": "e395d7c7d860",
    "label": "Frontend observability",
    "lesson": {
      "level": "Production",
      "summary": "Observability connects errors, performance and user actions with version, route, device and relevant state.",
      "explanation": "Combine technical telemetry with the user's flow: what they were trying to do, which release they were running and which dependency responded. Observability is not installing an SDK; it is designing questions that production can answer.",
      "why": "Without context, a minified stack trace or a global average rarely lets you reproduce a real problem.",
      "codeLabel": "Actionable event",
      "steps": [
        "Version source maps privately.",
        "Correlate frontend and backend.",
        "Measure Web Vitals and business operations.",
        "Define alerts by impact, with an owner who can act on them."
      ],
      "pitfalls": [
        "Logging personal data or tokens creates another incident.",
        "An average hides slow devices or percentiles.",
        "More unstructured logs increase cost, not understanding."
      ],
      "takeaway": "A signal is useful if it leads from impact to a probable cause.",
      "audit": {
        "primer": "Observability connects a failure with enough context to act: release, route, operation, timings, dependency and a correlation ID. It should answer which users were affected and in which part of the flow, without logging secrets.",
        "example": "checkout_submit records duration and result along with the release and requestId. An increase in the payment_timeout error in the new version links the frontend event to the Rails trace and makes it possible to separate a slow provider from local validation.",
        "failureModes": [
          "Uploading source maps publicly or logging tokens and personal data creates additional exposure.",
          "A global average hides that the 95th percentile fails only on slow mobile devices.",
          "Collecting events without an owner, alerts or operational questions adds cost without the ability to respond."
        ]
      },
      "sources": [
        {
          "label": "Web Vitals (web.dev)"
        },
        {
          "label": "OpenTelemetry for the browser"
        }
      ]
    }
  },
  "ci_cd_release_strategy": {
    "_source": "9cd940250392",
    "label": "CI/CD and release strategy",
    "lesson": {
      "level": "Production",
      "summary": "CI/CD turns a change into a verifiable artifact and releases it with controls proportional to the risk.",
      "explanation": "Not every change needs the same gate. Use risk, blast radius and observability to choose a preview, a canary, an approval or a direct deploy.",
      "why": "A lead has to balance speed, confidence and the ability to roll back.",
      "codeLabel": "Pipeline with promotion",
      "steps": [
        "Produce a reproducible artifact.",
        "Run cheap checks before expensive suites.",
        "Test the artifact that will be deployed.",
        "Release gradually and monitor success and error signals."
      ],
      "pitfalls": [
        "Rebuilding per environment can produce different artifacts.",
        "A slow pipeline encourages skipping controls.",
        "A rollback must account for compatibility with APIs and data that have already been modified."
      ],
      "takeaway": "A safe release means detecting, limiting and reverting impact.",
      "audit": {
        "primer": "CI verifies and builds; CD promotes the same artifact through environments and controls exposure. The number of gates should follow the risk, the scope of a failure and the ability to detect and revert.",
        "example": "The pipeline installs from the lockfile, runs lint, type checks and tests, builds an image once and tests it in a preview. Production receives 5% of traffic; error and conversion metrics decide whether to continue or go back to the previous artifact.",
        "failureModes": [
          "Rebuilding per environment can deploy different bytes from the ones that were tested.",
          "A frontend rollback is not enough if the release already wrote incompatible data.",
          "A pipeline so slow that the team avoids it reduces safety more than a small set of reliable gates."
        ]
      },
      "sources": [
        {
          "label": "GitHub Actions documentation"
        }
      ]
    }
  }
};
