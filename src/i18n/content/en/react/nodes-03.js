// react concepts (server_state, react_query, optimistic_ui, react_actions, render_reconciliation, transitions_concurrency, keys_lists, memoization, react_compiler, performance, suspense_lazy, error_boundaries)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "server_state": {
    "_source": "3bcf2aa79322",
    "label": "Client state vs server state",
    "lesson": {
      "level": "Architecture",
      "summary": "Server State belongs to the server and is asynchronous; Client State represents local intent and interaction in the browser.",
      "explanation": "The useful distinction is not 'local versus global' or 'temporary versus persistent', but who holds authority. React owns a form draft; the URL owns navigable filters; the server owns the canonical version of an order that other processes can change. The browser can cache that observation, but it needs to decide identity, freshness, revalidation, invalidation and reconciliation.",
      "why": "Distinguishing both kinds of state avoids duplicating remote data in useState or Redux and prevents bugs from outdated data in the UI.",
      "codeLabel": "Two lifecycles",
      "steps": [
        "Identify whether the data originates in the browser (Client State) or in a remote database (Server State).",
        "Keep Client State in components, the URL or UI stores depending on its interaction scope.",
        "Manage Server State through a caching library that controls freshness, revalidation and invalidation.",
        "On a user action, send the mutation to the server and invalidate the affected cache entries.",
        "Reflect in the UI the loading states, background revalidation and errors returned by the server."
      ],
      "pitfalls": [
        "Copying API data into a local useState creates outdated versions that never find out when the data changes elsewhere in the app.",
        "Using Redux or Context as a manual server cache requires writing hundreds of lines of reducers and middleware for retries and invalidation.",
        "Assuming that data returned by the API stays fresh indefinitely without defining a revalidation strategy."
      ],
      "takeaway": "Ask who the real owner of the data is: the client manages its UI, the server owns the domain data.",
      "audit": {
        "primer": "Client state represents local interaction, such as an open modal. Server state represents data whose authority lives outside the browser, such as orders; it needs freshness, cache, refetch, invalidation and conflict handling.",
        "example": "The modal can live in useState and disappear when the screen closes. Orders should not be copied into that state: a query cache can show previous data while it fetches a new version and then be invalidated after saving.",
        "failureModes": [
          "Copying server state into many components lets each copy go stale.",
          "Treating a permissions error as an empty cache can show a misleading screen."
        ]
      },
      "tableTitle": "CLIENT STATE VS SERVER STATE",
      "tableLabel": "Fundamental lifecycle differences",
      "table": {
        "columns": [
          "Property",
          "Client State",
          "Server State"
        ],
        "rows": [
          [
            "Authority",
            "The browser (React)",
            "The server (database)"
          ],
          [
            "Nature",
            "Synchronous and immediate",
            "Asynchronous and subject to latency/network"
          ],
          [
            "Persistence",
            "Temporary (UI memory / URL)",
            "Persistent and durable"
          ],
          [
            "Recommended tool",
            "useState / useReducer / Zustand / URL",
            "TanStack Query / SWR / RTK Query"
          ]
        ]
      },
      "docNotes": [
        "Client state can also persist in the URL, sessionStorage or a store; server state can also be shown immediately from cache. Persistence and synchrony do not define the category.",
        "Copying a query into useState is only justified if it creates a different concept, such as an editable draft. That copy is no longer kept in sync automatically with the remote source.",
        "Pending, stale, fetching and error describe different moments. A UI can have visible data and be revalidating at the same time."
      ],
      "sources": [
        {
          "label": "Managing State (React)"
        },
        {
          "label": "TanStack Query Overview"
        },
        {
          "label": "Important Defaults (TanStack Query)"
        }
      ]
    }
  },
  "react_query": {
    "_source": "f076a4c6f939",
    "label": "TanStack Query and the server cache",
    "lesson": {
      "level": "Architecture",
      "summary": "TanStack Query manages caching, synchronization and invalidation of Server State declaratively, without manual boilerplate.",
      "explanation": "TanStack Query implements a server state cache and coordinates observers, requests, retries and invalidation. It does not know your business semantics: you define what identifies the data in queryKey, how queryFn fetches it, when it is fresh enough and which mutations make which entries obsolete.",
      "why": "The library removes mechanical boilerplate, but leaves the hard decisions visible: identity, freshness, error ownership, pagination, mutations and consistency.",
      "codeLabel": "Declarative cache",
      "steps": [
        "Define a stable queryKey (array) that includes every variable the query depends on (filters, IDs, pages).",
        "Provide the async queryFn responsible for requesting the data from the REST or GraphQL API.",
        "TanStack Query checks the cache: if the data is fresh (staleTime), it returns it instantly without touching the network.",
        "If the data is stale but exists in the cache, it shows it immediately in the UI and triggers a background revalidation (isFetching).",
        "When running mutations (useMutation), invalidate the affected queryKey to force the view to update automatically."
      ],
      "pitfalls": [
        "A queryKey with an object is valid if its serializable content represents the identity; the problem is not that the object is a new reference, but omitting data that belongs or including data that does not.",
        "Default retries can be reasonable for reads, but a mutation with side effects must have idempotent semantics before being retried.",
        "Do not use global invalidation by reflex: it can generate traffic and pending states unrelated to the mutation."
      ],
      "takeaway": "A server cache requires three explicit decisions: identity key, freshness time and invalidation strategy.",
      "audit": {
        "primer": "TanStack Query is a library for managing server state. `useQuery` uses a stable `queryKey` to identify the cache entry and a `queryFn` to fetch it; a mutation must update or invalidate the affected entries.",
        "example": "For a dashboard, `['orders', filters]` separates the cache by filters. When an order is created, the mutation can invalidate `['orders']`; while the response is in flight, the UI must distinguish previous data, background fetching and a mutation error.",
        "failureModes": [
          "An incomplete queryKey can show results from previous filters.",
          "Automatically retrying a payment mutation can duplicate an operation if the backend has no idempotency."
        ]
      },
      "tableTitle": "QUERY STATES",
      "tableLabel": "Distinguishing initial load from revalidation",
      "table": {
        "columns": [
          "State",
          "isLoading",
          "isFetching",
          "Recommended display"
        ],
        "rows": [
          [
            "First load",
            "true",
            "true",
            "Full-screen skeleton or spinner"
          ],
          [
            "Background revalidation",
            "false",
            "true",
            "UI with previous data + subtle update indicator"
          ],
          [
            "Fresh data in cache",
            "false",
            "false",
            "UI with instant data (no spinners)"
          ]
        ]
      },
      "docNotes": [
        "The queryKey must include every variable used by queryFn that changes the result. Two components with the same key observe the same entry.",
        "staleTime indicates how long the data is considered fresh; gcTime indicates how long the cache keeps a query with no observers. They are not equivalent.",
        "isPending describes that there is no successful data yet; isFetching describes that queryFn is running, even if previous data is visible.",
        "Invalidating marks queries as stale and may refetch active observers. For an immediate response you can also write the canonical data returned by the mutation into the cache."
      ],
      "sources": [
        {
          "label": "Query Keys (TanStack Query)"
        },
        {
          "label": "Important Defaults (TanStack Query)"
        },
        {
          "label": "Query Invalidation (TanStack Query)"
        }
      ]
    }
  },
  "optimistic_ui": {
    "_source": "2d9cf9768810",
    "label": "Optimistic UI and rollback",
    "lesson": {
      "level": "Architecture",
      "summary": "Optimistic UI updates the screen instantly, assuming the action will succeed, and prepares an explicit rollback if it fails.",
      "explanation": "Optimism means rendering a projection before receiving the canonical confirmation. There are different mechanisms. useOptimistic derives a temporary view while an Action is in progress and goes back to the base value when it finishes. TanStack Query can update a shared cache: it usually cancels refetches that could overwrite the prediction, saves context for restoring, and then invalidates or reconciles.",
      "why": "The question is not only how to make the UI fast, but when a prediction is safe, how pending is represented and how rejection, timeout, concurrency and the canonical response are resolved.",
      "codeLabel": "Local prediction during an Action",
      "steps": [
        "Define which value is confirmed and which will only be a visible projection while the operation is pending.",
        "Choose the mechanism based on ownership: useOptimistic for a view tied to an Action; the mutation cache for shared remote data.",
        "Show which entity is pending and keep incompatible interactions from piling up without a policy.",
        "On success, reconcile with the canonical response; on rejection, restore or let the projection disappear and explain how to recover.",
        "On timeout or concurrency, treat the result as ambiguous and use idempotency, versioning or a refetch to resolve it."
      ],
      "pitfalls": [
        "Applying optimism to irreversible or business-critical operations, such as confirming a payment or a bank transfer.",
        "Forgetting to save the previous snapshot, leaving the interface in a corrupt, unrecoverable state if the server rejects the order.",
        "Not handling fast, repeated user clicks (double click), generating conflicts between earlier snapshots."
      ],
      "takeaway": "Optimistic UI is a controlled UX prediction: it speeds up perception, but demands reconciliation and explicit recovery when the server does not confirm.",
      "audit": {
        "primer": "`useOptimistic` is an official React Hook for showing a temporary projection while an Action is pending. It does not replace the confirmed source: when the Action finishes, React goes back to the real value that arrives through props or state. TanStack Query offers another pattern for optimism over a shared cache.",
        "example": "In a comment list, when Like is pressed we show the incremented counter and a `pending` marker. If the backend confirms, the canonical response replaces the prediction; if it responds 409 because another change won, we revert the counter, remove `pending` and show Retry. On a Delete we can hide the row temporarily, but we must offer Undo because the operation may be irreversible.",
        "failureModes": [
          "A timeout does not necessarily mean the server did not save: retrying requires an idempotency key or a reconciliation query.",
          "Two fast clicks or two tabs can generate incompatible predictions; you need to deduplicate, order or reconcile by version.",
          "Optimism is not a good fit when a wrong prediction is costly, such as confirming a payment."
        ]
      },
      "mermaid": "flowchart TD\n      A[User action] --> B[Cancel in-flight queries]\n      B --> C[Save previous snapshot]\n      C --> D[Update UI instantly]\n      D --> E{API response?}\n      E -->|200 OK| F[Reconcile with real response]\n      E -->|Error| G[Restore snapshot + notify]",
      "diagramTitle": "Optimistic mutation flow with rollback",
      "docNotes": [
        "useOptimistic is an official React Hook. Its updateFn must be pure and receives the current state plus the optimistic value.",
        "With useOptimistic you do not always write a manual rollback: when the Action finishes, the projection stops applying and the UI goes back to the base value the application provides.",
        "In a shared cache, a manual snapshot is one possible strategy, not a universal rule. You can also refetch or reconcile with the server response.",
        "A timeout is an unknown result, not a confirmed rejection. To retry an operation with side effects you need idempotency or to query its status."
      ],
      "sources": [
        {
          "label": "useOptimistic (React)"
        },
        {
          "label": "Optimistic Updates (TanStack Query)"
        }
      ]
    }
  },
  "react_actions": {
    "_source": "2fb34d331fb7",
    "label": "Actions, useActionState and useOptimistic",
    "lesson": {
      "level": "Modern React",
      "summary": "Actions in React 19 coordinate async transitions, managing pending states, errors and optimism natively.",
      "explanation": "In React, an Action is a convention for a function that performs async work inside a transition. <form action={fn}> integrates FormData and pending; useActionState keeps the latest result of the Action and exposes isPending; useFormStatus reads the state of the enclosing form from a descendant; useOptimistic adds a temporary projection. None of these APIs decide server validation, authorization or persistence.",
      "why": "They simplify handling forms and async mutations, reducing the boilerplate of manual useStates for loading.",
      "codeLabel": "Action with pending and optimistic state",
      "steps": [
        "Define the async Action that receives the previous state and the payload data.",
        "Connect the Action to the form through the action prop, or use useActionState to get the resulting state and the isPending flag.",
        "React turns on isPending synchronously while the Action runs in the background.",
        "Use useOptimistic if you want to show a visual prediction while the Action is pending.",
        "When the Action finishes, React updates the view with the state returned by the server or the function."
      ],
      "pitfalls": [
        "Confusing expected validation errors (which should be returned as part of the Action state) with server exceptions (which Error Boundaries catch).",
        "Calling the Action dispatcher outside an action prop or a Transition, losing automatic control of the isPending state.",
        "Assuming Actions replace backend security: every parameter sent must be validated again on the server."
      ],
      "takeaway": "Actions standardize how async transitions are managed in React, coordinating pending states and responses without manual plumbing.",
      "audit": {
        "primer": "`useActionState` is an official React Hook for connecting an Action function to the resulting state and an `isPending` flag. The function receives the previous state and the payload, can be async and can perform external effects. `useOptimistic` is another official Hook for the temporary view during that Action; the dispatcher must run inside an Action or Transition.",
        "example": "In a profile, `dispatch({ name })` runs `saveProfile(previousState, payload)`. While waiting we show the optimistic name and disable the submit; a validation error comes back as known state to highlight the field, while an unexpected error can reach the Error Boundary. If three submits are made, `useActionState` queues them: if you need parallelism or cancellation, you have to choose a different design.",
        "failureModes": [
          "Calling the dispatcher outside an Action or Transition prevents React from managing pending correctly.",
          "Confusing a returnable validation error with an unexpected exception leads to the wrong UX or recovery.",
          "An Action authorizes nothing: the server must validate session, permissions and idempotency."
        ]
      },
      "docNotes": [
        "useActionState returns [state, dispatchAction, isPending]. The Action first receives the previous state and then the dispatch arguments or the form's FormData.",
        "When a function is passed to action on a <form>, React can reset uncontrolled fields after success. Controlled fields still depend on your state.",
        "useFormStatus must be called from a component that is a descendant of the form; it does not observe a form declared by the same component that calls the Hook.",
        "startTransition marks updates as non-urgent, but a controlled input update must not depend on a transition."
      ],
      "sources": [
        {
          "label": "Actions (React 19)"
        },
        {
          "label": "useActionState (React)"
        },
        {
          "label": "form (React DOM)"
        },
        {
          "label": "useFormStatus (React DOM)"
        }
      ]
    }
  },
  "render_reconciliation": {
    "_source": "003f6b95f72d",
    "label": "Render, reconciliation and commit",
    "lesson": {
      "level": "Rendering",
      "summary": "React can render to compute UI, reconcile trees and commit changes to the DOM.",
      "explanation": "Reconciliation is the comparison React makes between the previous tree and the new one to decide what to keep. Commit is applying those decisions to the DOM; a render on its own does not mean every node has changed. If a screen changes the title of a row, React can keep the neighboring input and its focus. If the key of the subtree changes, React interprets it as a different identity and unmounts the previous state.",
      "why": "Distinguishing render from commit lets you understand effects, keys and performance.",
      "codeLabel": "Rendering is not DOM manipulation",
      "steps": [
        "Render must be pure.",
        "A render does not imply that every DOM node changes.",
        "Profiler shows the real cost of renders and commits."
      ],
      "takeaway": "React computes first and applies afterwards.",
      "audit": {
        "primer": "Reconciliation is the comparison React makes between the previous tree and the new one to decide what to keep. Commit is applying those decisions to the DOM; a render on its own does not mean every node has changed.",
        "example": "If a screen changes the title of a row, React can keep the neighboring input and its focus. If the key of the subtree changes, React interprets it as a different identity and unmounts the previous state.",
        "failureModes": [
          "Doing heavy work or side effects during render undermines the ability to repeat or interrupt the computation.",
          "Measuring only the total request time can hide that the bottleneck is in large commits."
        ]
      },
      "sources": [
        {
          "label": "Render and Commit (React)"
        },
        {
          "label": "Preserving and Resetting State (React)"
        }
      ]
    }
  },
  "transitions_concurrency": {
    "_source": "a8e607d25dff",
    "label": "Transitions, priority and responsive UI",
    "lesson": {
      "level": "Rendering",
      "summary": "startTransition marks an update as non-urgent so that an urgent interaction like typing stays responsive.",
      "explanation": "`startTransition` and `useTransition` are official APIs for marking non-urgent updates. User typing must remain immediate; an expensive filter or navigation can run as a transition and expose `isPending`. In a search box, the `inputValue` state updates urgently and the filter over 20,000 rows is marked as a transition. The transition keeps the screen usable, but it does not cancel requests or fix a network race condition on its own.",
      "why": "It helps with expensive filters or navigation, but it does not make the API faster or cancel work on its own.",
      "codeLabel": "Update priority",
      "steps": [
        "Separate urgent state from expensive derived work.",
        "Show isPending if the transition needs feedback.",
        "A transition does not replace debouncing/cancelling requests.",
        "Concurrent rendering requires render to be pure and effects to have cleanup."
      ],
      "takeaway": "Transitions prioritize experience; they are not a generic performance solution.",
      "audit": {
        "primer": "`startTransition` and `useTransition` are official APIs for marking non-urgent updates. User typing must remain immediate; an expensive filter or navigation can run as a transition and expose `isPending`.",
        "example": "In a search box, the `inputValue` state updates urgently and the filter over 20,000 rows is marked as a transition. The transition keeps the screen usable, but it does not cancel requests or fix a network race condition on its own.",
        "failureModes": [
          "Marking the input itself as a transition can make the cursor feel slow.",
          "A transition does not replace debounce, AbortController, pagination or virtualization when the problem is the network or data volume."
        ]
      },
      "sources": [
        {
          "label": "useTransition (React)"
        }
      ]
    }
  },
  "keys_lists": {
    "_source": "61d9b4c721d3",
    "label": "Lists, keys and preserved state",
    "lesson": {
      "level": "Rendering",
      "summary": "A key identifies a list item's identity and determines which local state is preserved.",
      "explanation": "A key is the identity React uses to match an item in a list with the item in the next render. It must represent the domain identity and be stable across renders. If a list has A, B and C and X is inserted at the start, using indexes makes the input that belonged to A appear to belong to X. With `key={item.id}`, React keeps each row with its correct record.",
      "why": "It is not just a warning: it defines how React matches old and new elements.",
      "codeLabel": "Stable identity",
      "steps": [
        "Use stable domain ids.",
        "The index breaks when items are inserted or reordered.",
        "Changing a key on purpose can reset a subtree."
      ],
      "takeaway": "Keys model identity, and identity determines which state survives.",
      "audit": {
        "primer": "A key is the identity React uses to match an item in a list with the item in the next render. It must represent the domain identity and be stable across renders.",
        "example": "If a list has A, B and C and X is inserted at the start, using indexes makes the input that belonged to A appear to belong to X. With `key={item.id}`, React keeps each row with its correct record.",
        "failureModes": [
          "Using `Math.random()` as a key forces unmounts and loses state on every render.",
          "Changing a key deliberately can be useful to reset a form, but it must be an explicit decision."
        ]
      },
      "sources": [
        {
          "label": "Rendering Lists (React)"
        },
        {
          "label": "Preserving and Resetting State (React)"
        }
      ]
    }
  },
  "memoization": {
    "_source": "8a0cf5c4fd71",
    "label": "memo, useMemo and useCallback",
    "lesson": {
      "level": "Performance",
      "summary": "memo, useMemo and useCallback can avoid repeated work, but they are optimizations that need evidence.",
      "explanation": "`memo`, `useMemo` and `useCallback` are memoization tools, not correctness requirements. They store a result, a value or a function identity to avoid work when the dependencies did not change. If Profiler shows that an expensive table re-renders because its parent creates the same filters object on every render, we first stabilize the contract or move the state. Only then do we evaluate `memo` and measure whether the comparison costs less than rendering.",
      "why": "Memoizing everything adds comparisons, memory, dependencies and complexity; it only pays off when the avoided work costs more than keeping and comparing the cached value.",
      "codeLabel": "Measured optimization",
      "steps": [
        "Measure first with Profiler.",
        "memo helps if stable props and an expensive render justify the comparison.",
        "useCallback helps if the stable identity avoids real work."
      ],
      "takeaway": "Optimization = measurement and trade-off, not decorating components.",
      "audit": {
        "primer": "`memo`, `useMemo` and `useCallback` are memoization tools, not correctness requirements. They store a result, a value or a function identity to avoid work when the dependencies did not change.",
        "example": "If Profiler shows that an expensive table re-renders because its parent creates the same filters object on every render, we first stabilize the contract or move the state. Only then do we evaluate `memo` and measure whether the comparison costs less than rendering.",
        "failureModes": [
          "Memoizing every component adds comparisons and complexity with no measurable benefit.",
          "A memoized callback that captures the wrong state can hold on to a stale closure."
        ]
      },
      "sources": [
        {
          "label": "memo (React)"
        },
        {
          "label": "useMemo (React)"
        }
      ]
    }
  },
  "react_compiler": {
    "_source": "85caf112cde1",
    "label": "React Compiler and automatic memoization",
    "lesson": {
      "level": "Performance",
      "summary": "React Compiler can automate some memoization optimizations based on code analysis, but it does not remove the need for pure components and clear contracts.",
      "explanation": "React Compiler is a build tool that can apply automatic memoization to compatible components. It does not change which data is correct, nor does it remove the need for pure rendering, stable keys or measurement. If a list receives stable props, the compiler can avoid repeated work without us adding a manual `useMemo`. If the component mutates an object during render or uses an incorrect key, the optimization does not fix the conceptual bug.",
      "why": "A current interview may ask what you would optimize manually and what you would leave to tooling.",
      "code": "// Normal, pure code\nfunction Row({ item }) {\n  return <span>{item.name}</span>\n}\n\n// The compiler can avoid repeated work when it can prove it is safe.",
      "codeLabel": "Tooling versus manual memo",
      "steps": [
        "Purity lets tooling and React reason about the component.",
        "Manual memo still exists for when you need to express a specific boundary.",
        "Do not use effects or hidden mutations expecting the compiler to make them safe.",
        "Measure the result: less optimization code does not guarantee less work."
      ],
      "takeaway": "The compiler reduces optimization boilerplate; it does not replace the mental model or measurement.",
      "audit": {
        "primer": "React Compiler is a build tool that can apply automatic memoization to compatible components. It does not change which data is correct, nor does it remove the need for pure rendering, stable keys or measurement.",
        "example": "If a list receives stable props, the compiler can avoid repeated work without us adding a manual `useMemo`. If the component mutates an object during render or uses an incorrect key, the optimization does not fix the conceptual bug.",
        "failureModes": [
          "Expecting the compiler to fix a duplicated request confuses performance with effects.",
          "Disabling optimizations without measuring can leave unnecessary manual code that is hard to maintain."
        ]
      },
      "docNotes": [
        "React Compiler 1.0 is stable and optional. It can be adopted gradually; the documentation recommends keeping existing manual memoization, or removing it with measurement, because removing it can change the compilation output."
      ],
      "sources": [
        {
          "label": "React Compiler (React)"
        }
      ]
    }
  },
  "performance": {
    "_source": "24e297b38009",
    "label": "Profiling and real-world performance",
    "lesson": {
      "level": "Performance",
      "summary": "Frontend performance includes JS, renders, layout/paint, network, images and bundle; React is only one part.",
      "explanation": "Real-world performance is diagnosed by measuring a concrete interaction: duration, commits, long tasks, requests and Web Vitals. Optimization is a response to a cause, not a fixed list of Hooks. If a table is slow because of 10,000 DOM nodes, virtualizing reduces the visible nodes. If it is slow because of a slow API, the solution may be pagination or caching; `useMemo` does not fix a network response that arrives late.",
      "why": "A senior interview expects diagnosis, not a list of memoizations.",
      "code": "Measure with the React DevTools Profiler and the Performance panel.\nAsk: which interaction is slow, and where is the time spent?",
      "codeLabel": "Diagnosis",
      "steps": [
        "Reproduce and measure.",
        "Choose virtualization, pagination, debounce, code splitting or memo depending on the cause.",
        "Measure after the change."
      ],
      "takeaway": "Find the real bottleneck before optimizing.",
      "audit": {
        "primer": "Real-world performance is diagnosed by measuring a concrete interaction: duration, commits, long tasks, requests and Web Vitals. Optimization is a response to a cause, not a fixed list of Hooks.",
        "example": "If a table is slow because of 10,000 DOM nodes, virtualizing reduces the visible nodes. If it is slow because of a slow API, the solution may be pagination or caching; `useMemo` does not fix a network response that arrives late.",
        "failureModes": [
          "Optimizing an artificial benchmark can make the code the user relies on most worse.",
          "An average can hide that the p95 on a slow phone is unacceptable."
        ]
      },
      "sources": [
        {
          "label": "<Profiler> (React)"
        },
        {
          "label": "Performance panel (Chrome DevTools)"
        },
        {
          "label": "Web Vitals (web.dev)"
        }
      ]
    }
  },
  "suspense_lazy": {
    "_source": "d1d48336dfe8",
    "label": "Code splitting, lazy and Suspense",
    "lesson": {
      "level": "Rendering",
      "summary": "lazy splits code by feature and Suspense shows a fallback while a suspended dependency loads.",
      "explanation": "`lazy` splits the JavaScript and loads a component on demand. `Suspense` shows a fallback while something that can suspend is not ready; for a chunk that fails you also need an Error Boundary with a recovery path. A Reports route imports its screen only when the user enters it. We show a skeleton that preserves the layout; if the chunk fails to download because of a stale CDN version, the boundary offers a reload and does not leave the whole app blank.",
      "why": "It reduces the initial bundle, but introduces loading states that need good UX.",
      "codeLabel": "Deferred loading",
      "steps": [
        "Split by real routes or features.",
        "Design a fallback that reserves space.",
        "Code Suspense and data Suspense are not exactly the same thing."
      ],
      "takeaway": "Code splitting changes when the code arrives; design that loading state.",
      "audit": {
        "primer": "`lazy` splits the JavaScript and loads a component on demand. `Suspense` shows a fallback while something that can suspend is not ready; for a chunk that fails you also need an Error Boundary with a recovery path.",
        "example": "A Reports route imports its screen only when the user enters it. We show a skeleton that preserves the layout; if the chunk fails to download because of a stale CDN version, the boundary offers a reload and does not leave the whole app blank.",
        "failureModes": [
          "A generic fallback that changes the whole layout produces layout shift.",
          "Confusing code Suspense with data fetching Suspense can lead you to assume that any Promise thrown from a component is recovered the same way."
        ]
      },
      "sources": [
        {
          "label": "lazy (React)"
        },
        {
          "label": "<Suspense> (React)"
        }
      ]
    }
  },
  "error_boundaries": {
    "_source": "6aae75063678",
    "label": "Error boundaries and recovery",
    "lesson": {
      "level": "Rendering",
      "summary": "An Error Boundary catches errors during render in a subtree and allows localized recovery.",
      "explanation": "An Error Boundary catches errors during render, lifecycle methods and in descendant components. It does not automatically catch errors from event handlers or every fetch rejection; those flows need try/catch and explicit states. A dashboard can isolate the recommendations widget: if it fails, the orders table keeps working and the widget offers Retry. The logger receives the route, release and anonymized user for diagnosis.",
      "why": "It keeps a broken widget from taking down the whole application and lets each area offer an appropriate recovery, without turning a local failure into a completely unusable screen.",
      "codeLabel": "Failure boundary",
      "steps": [
        "Isolate independent widgets or routes.",
        "Log the error with context.",
        "Fetch and event handlers need explicit handling: not every error reaches the boundary."
      ],
      "takeaway": "Errors have architectural boundaries too.",
      "audit": {
        "primer": "An Error Boundary catches errors during render, lifecycle methods and in descendant components. It does not automatically catch errors from event handlers or every fetch rejection; those flows need try/catch and explicit states.",
        "example": "A dashboard can isolate the recommendations widget: if it fails, the orders table keeps working and the widget offers Retry. The logger receives the route, release and anonymized user for diagnosis.",
        "failureModes": [
          "A boundary placed too high turns a small failure into a full screen that is down.",
          "Showing a fallback without resetting it when the route changes can leave the error stuck on a new screen."
        ]
      },
      "sources": [
        {
          "label": "Error Boundaries (React)"
        }
      ]
    }
  }
};
