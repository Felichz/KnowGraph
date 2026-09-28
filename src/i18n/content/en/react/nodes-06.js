// react concepts (accessible_composites, design_tokens, resilient_ui, vendor_boundaries, proof_strategy, scope_reviewability, case_design_system_select, case_dashboard, case_auth)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "accessible_composites": {
    "_source": "b8b68405cf50",
    "label": "Accessible patterns for composite widgets",
    "lesson": {
      "level": "Design system",
      "summary": "Widgets such as select, combobox, tabs, tree and menu need a coherent semantic pattern: valid roles, state on the correct element, unique names and a complete keyboard and focus model.",
      "explanation": "A composite widget needs a complete pattern, not a collection of ARIA attributes. The pattern defines related roles, name, state, focus movement, supported keys and what happens on open, choose, cancel and close. In a combobox, the input keeps focus, aria-expanded indicates whether the list is open, aria-controls points to the listbox and aria-activedescendant identifies the active option. Arrow keys change the active option, Enter confirms and Escape closes without selecting.",
      "why": "Adding aria-* attributes in isolation can announce false information; first you choose the interaction, then you implement all of its relationships.",
      "codeLabel": "Related trigger, panel and state",
      "steps": [
        "Prefer a native element if it satisfies the experience; if not, choose a complete WAI-ARIA pattern.",
        "Put aria-expanded and aria-controls on the trigger that opens; the panel gets its role, id and name.",
        "Define focus entry, arrow key navigation, Home/End where applicable, Escape, selection and focus return.",
        "Express selected/current/expanded structurally and keep the accessible text localizable."
      ],
      "pitfalls": [
        "Do not use aria-selected outside a role that supports it, or role=option without the corresponding container.",
        "Nesting buttons or links creates ambiguous paths for keyboard and screen reader users.",
        "Encoding selected inside the aria-label mixes identity with state and can produce duplicate or unstable names."
      ],
      "takeaway": "In accessibility, the contract is the complete pattern, not the sum of loose attributes.",
      "tableTitle": "WIDGET RELATIONSHIPS",
      "tableLabel": "What question each part answers",
      "table": {
        "columns": [
          "Piece",
          "Contract"
        ],
        "rows": [
          [
            "Trigger",
            "What it opens and whether it is expanded"
          ],
          [
            "Panel",
            "What kind of collection or dialog it is"
          ],
          [
            "Option",
            "Identity and selected state"
          ],
          [
            "Focus",
            "Where it enters, moves and returns"
          ],
          [
            "Name",
            "How it is announced without depending on appearance"
          ]
        ]
      },
      "audit": {
        "primer": "A composite widget needs a complete pattern, not a collection of ARIA attributes. The pattern defines related roles, name, state, focus movement, supported keys and what happens on open, choose, cancel and close.",
        "example": "In a combobox, the input keeps focus, aria-expanded indicates whether the list is open, aria-controls points to the listbox and aria-activedescendant identifies the active option. Arrow keys change the active option, Enter confirms and Escape closes without selecting.",
        "failureModes": [
          "role=\"option\" without a listbox, or aria-selected on an incompatible element, communicates a false structure.",
          "Moving focus and using aria-activedescendant at the same time without a defined model can produce duplicate announcements.",
          "Nesting interactive buttons or links creates ambiguous keyboard order and activation."
        ]
      },
      "sources": [
        {
          "label": "WAI-ARIA Authoring Practices"
        },
        {
          "label": "Combobox Pattern (WAI-ARIA APG)"
        }
      ]
    }
  },
  "design_tokens": {
    "_source": "dfc8be7041db",
    "label": "Tokens, theming and styling hooks",
    "lesson": {
      "level": "Design system",
      "summary": "Tokens express shared semantic decisions (background color, spacing, focus, elevation) and let a component work in current and future themes.",
      "explanation": "A semantic token names a decision that must stay consistent across components and themes. A local variable, by contrast, coordinates calculations inside one implementation; a literal is still valid when it does not represent an axis of change. Button uses --control-bg-danger and --focus-ring-color because the theme decides both values. Inside the component, --icon-size can coordinate width and spacing. A local 1px border does not automatically need to become a global token.",
      "why": "An isolated literal can fail in another theme; an unnecessary CSS variable also adds indirection. The abstraction should represent a real decision or relationship.",
      "codeLabel": "Semantic tokens and visible states",
      "steps": [
        "Use semantic tokens when the value must adapt to the theme; do not pick a color based on how it looks on a single background.",
        "If two calculations must change together, a local variable can express that invariant.",
        "Expose stable states through data attributes or deliberate classes for styling and visual regression.",
        "Test hover, focus-visible, disabled, error, selected and open in every supported theme."
      ],
      "pitfalls": [
        "Creating a variable for every literal with no reuse or calculation increases navigation and size without adding a decision.",
        "Hardcoding selectors for a closed list of themes prevents future extensions.",
        "Changing documented classes or data attributes can be a breaking change for consumers that extend styles."
      ],
      "takeaway": "Tokenize decisions, not numbers; and treat promised styling hooks as a contract.",
      "tableTitle": "VALUE LEVELS",
      "tableLabel": "Choose the level that expresses the intent",
      "table": {
        "columns": [
          "Value",
          "Example",
          "When"
        ],
        "rows": [
          [
            "Global token",
            "--control-bg",
            "Semantic decision across themes"
          ],
          [
            "Local variable",
            "--trigger-size",
            "Couple the component's calculations"
          ],
          [
            "Literal",
            "1px / currentColor",
            "Obvious local value with no axis of change"
          ]
        ]
      },
      "audit": {
        "primer": "A semantic token names a decision that must stay consistent across components and themes. A local variable, by contrast, coordinates calculations inside one implementation; a literal is still valid when it does not represent an axis of change.",
        "example": "Button uses --control-bg-danger and --focus-ring-color because the theme decides both values. Inside the component, --icon-size can coordinate width and spacing. A local 1px border does not automatically need to become a global token.",
        "failureModes": [
          "Tokens named after a physical color, such as blue-500, force the component to know the palette instead of the intent.",
          "Turning every number into a variable adds indirection without creating a reusable decision.",
          "Changing a documented data-state breaks consumers' styles and visual tests even if the component compiles."
        ]
      },
      "sources": [
        {
          "label": "CSS custom properties (MDN)"
        }
      ]
    }
  },
  "resilient_ui": {
    "_source": "d6ce3dcce671",
    "label": "Resilient layout, content and internationalization",
    "lesson": {
      "level": "Design system",
      "summary": "A reusable UI must adapt to real content, translations, zoom, system preferences, density and themes the author did not test manually.",
      "explanation": "A resilient UI preserves hierarchy, operability and meaning when the content or environment changes: longer text, zoom, RTL languages, narrow viewports, motion preferences and unknown themes. A card uses a flexible grid, min-width: 0 and overflow-wrap to accept a long German title. At 200% zoom the controls wrap to another line without being hidden; in Arabic it uses padding-inline and the logical order adapts to RTL.",
      "why": "Rigid widths and heights tend to encode the mock instead of the contract; quality shows when the layout preserves meaning under extreme inputs.",
      "codeLabel": "Layout governed by content and constraints",
      "steps": [
        "Test short, long and localized copy, and empty values, without changing the semantic structure.",
        "Prefer min/max, flex/grid and intrinsic sizing over reserving height for a fixed number of lines.",
        "Ensure zoom, reflow, reduced motion, contrast and visible focus.",
        "Separate accessible identity from visual details: a white border does not change what a warning icon means."
      ],
      "pitfalls": [
        "A default min-width can prevent the consumer from using the component in a flexible layout.",
        "A fixed height leaves phantom space or cuts off content when the font grows or the text is translated.",
        "Hardcoding accessible text in English inside a reusable primitive blocks localization."
      ],
      "takeaway": "Design for variation in content and environment, not just for the reference screenshot.",
      "prompt": "How would you test a card with a long German title, 200% zoom, an unknown theme and reduced motion?",
      "audit": {
        "primer": "A resilient UI preserves hierarchy, operability and meaning when the content or environment changes: longer text, zoom, RTL languages, narrow viewports, motion preferences and unknown themes.",
        "example": "A card uses a flexible grid, min-width: 0 and overflow-wrap to accept a long German title. At 200% zoom the controls wrap to another line without being hidden; in Arabic it uses padding-inline and the logical order adapts to RTL.",
        "failureModes": [
          "Fixed heights cut off translations or leave empty space when the font size changes.",
          "An ellipsis can hide the only piece of data that distinguishes two options and requires an accessible alternative.",
          "Responsive behavior tested only by width does not cover zoom, real copy, keyboard or reduced motion."
        ]
      },
      "sources": [
        {
          "label": "WCAG: Reflow"
        },
        {
          "label": "Intl (MDN)"
        }
      ]
    }
  },
  "vendor_boundaries": {
    "_source": "68ef8ba37f21",
    "label": "Boundaries with external libraries",
    "lesson": {
      "level": "Design system",
      "summary": "A vendor boundary decides which part of an external library becomes a direct dependency of your consumers and which part stays adapted behind your own API.",
      "explanation": "A vendor boundary decides which dependency consumers know about. A reexport keeps almost the entire external contract; a façade offers a stable subset; an adapter translates between the provider's model and your own domain. PaymentsAdapter receives your own Money and PaymentIntent and translates them to Stripe. By contrast, reexporting Row from TanStack Table declares that this type is part of the public API and that an incompatible upgrade may require a major version of the library.",
      "why": "Reexporting types or helpers without a policy can couple your semver to the vendor's version; hiding everything also forces you to maintain a wrapper that only repeats the API.",
      "code": "// vendor/tanstack-table.ts\nexport { getCoreRowModel } from \"@tanstack/react-table\"\nexport type { Row } from \"@tanstack/react-table\"\n\n// Our policy lives in a named boundary:\nexport function createMagneticTable(options) {\n  return useReactTable({ getCoreRowModel: getCoreRowModel(), ...options })\n}",
      "codeLabel": "Isolated vendor, own policy",
      "steps": [
        "Identify whether you offer a stable façade, a domain adapter or simply a versioned reexport.",
        "Centralize vendor imports when you need to control the version, polyfills or replacement.",
        "Do not filter out useful capabilities without a reason: every difference from the primitive creates a rule to maintain.",
        "Document which external types are part of your API and which upgrade would be breaking."
      ],
      "pitfalls": [
        "A wrapper that mirrors every option adds another API without reducing complexity.",
        "Deep relative imports skip the public boundary and can break with internal reorganization.",
        "Manually duplicating logic the vendor already provides can produce two paths with different behavior."
      ],
      "takeaway": "The boundary should reduce coupling or concentrate policy; if it does neither, it is not earning its cost.",
      "tableTitle": "BOUNDARY TYPES",
      "tableLabel": "Not all of them promise the same thing",
      "table": {
        "columns": [
          "Boundary",
          "Promise",
          "Cost"
        ],
        "rows": [
          [
            "Reexport",
            "Same capability/versioned",
            "Semver tied to the vendor"
          ],
          [
            "Façade",
            "Stable subset",
            "Maintain the translation"
          ],
          [
            "Adapter",
            "Domain contract",
            "Map both models"
          ]
        ]
      },
      "audit": {
        "primer": "A vendor boundary decides which dependency consumers know about. A reexport keeps almost the entire external contract; a façade offers a stable subset; an adapter translates between the provider's model and your own domain.",
        "example": "PaymentsAdapter receives your own Money and PaymentIntent and translates them to Stripe. By contrast, reexporting Row from TanStack Table declares that this type is part of the public API and that an incompatible upgrade may require a major version of the library.",
        "failureModes": [
          "A wrapper that copies every option creates another API without reducing coupling.",
          "Hiding necessary capabilities makes consumers skip the boundary with deep imports.",
          "Duplicating vendor logic across several adapters produces different behavior for the same case."
        ]
      },
      "sources": [
        {
          "label": "Semantic Versioning"
        }
      ]
    }
  },
  "proof_strategy": {
    "_source": "b76f62fdfe4e",
    "label": "Test matrix for public components",
    "lesson": {
      "level": "Design system",
      "summary": "A public component needs evidence proportional to its contracts: types for compilation, behavior tests, browser tests for the platform, stories/VR for visual states and documentation for trade-offs.",
      "explanation": "Evidence is chosen according to the contract that could break. Types observe compilation; Testing Library observes semantics and events; a real browser observes focus and layout; stories and visual regression observe states and themes. For a Select, a type test protects props, RTL tests selecting and submitting FormData, Playwright walks through real keyboard and focus, and Storybook captures open, disabled, error and themes. Each test covers a different risk.",
      "why": "A large suite does not give confidence if it tests internal lines and skips the callback, ref, form, keyboard or visual state that can actually break.",
      "codeLabel": "A test that protects the contract",
      "steps": [
        "Write the observable assertion before choosing a tool: what would a user or consumer do.",
        "Use RTL + userEvent for semantics and React behavior; avoid tests that only verify that render does not blow up.",
        "Use browser/E2E for layout, real focus, browser APIs and behaviors that jsdom does not model faithfully.",
        "Add stories and visual regression for open, selected, error, disabled, focus and theme states; TSDoc for non-obvious invariants."
      ],
      "pitfalls": [
        "A broad snapshot changes due to noise and does not explain which contract broke.",
        "fireEvent skips real sequences that userEvent does reproduce.",
        "A happy-path story does not test open overlays, long copy or alternative themes.",
        "Do not duplicate the same test across different layers: each harness should protect a risk it knows how to observe."
      ],
      "takeaway": "Choose evidence per contract, not for the convenience of the test framework.",
      "tableTitle": "EVIDENCE MATRIX",
      "tableLabel": "Tool according to the risk",
      "table": {
        "columns": [
          "Risk",
          "Main test"
        ],
        "rows": [
          [
            "Props / types / exports",
            "Type tests + consumer build"
          ],
          [
            "Events / state / semantics",
            "RTL + userEvent"
          ],
          [
            "Focus / layout / browser API",
            "Playwright or another real browser"
          ],
          [
            "Theme / visual state",
            "Storybook + visual regression"
          ],
          [
            "Non-obvious invariant",
            "TSDoc / docs + focused test"
          ]
        ]
      },
      "audit": {
        "primer": "Evidence is chosen according to the contract that could break. Types observe compilation; Testing Library observes semantics and events; a real browser observes focus and layout; stories and visual regression observe states and themes.",
        "example": "For a Select, a type test protects props, RTL tests selecting and submitting FormData, Playwright walks through real keyboard and focus, and Storybook captures open, disabled, error and themes. Each test covers a different risk.",
        "failureModes": [
          "A large snapshot can pass while submit, ref or keyboard are broken.",
          "Repeating the same happy path across four layers increases cost without adding signal.",
          "jsdom does not faithfully reproduce layout, focus navigation or every browser API."
        ]
      },
      "sources": [
        {
          "label": "Guiding Principles (Testing Library)"
        },
        {
          "label": "Playwright: Best Practices"
        }
      ]
    }
  },
  "scope_reviewability": {
    "_source": "f3198fd4fd73",
    "label": "Scope, precedent and reviewability",
    "lesson": {
      "level": "Design system",
      "summary": "Reviewing as a maintainer means protecting contracts with evidence, distinguishing bugs from questions of intent and requiring the change to own the smallest necessary behavioral surface.",
      "explanation": "Reviewability is the ability to understand what problem a change solves, which contracts it touches and what evidence supports it. A high-value review separates demonstrable bugs, questions of intent, suggestions and preferences. A color change replaces a native input with a popover. The review first points out the new ownership of keyboard, forms and focus; compares it with the existing primitive and asks for parity tests. A minor rename stays as a non-blocking suggestion.",
      "why": "The goal is not to impose preferences: it is to reduce what consumers and future maintainers will have to relearn.",
      "code": "// Before commenting:\n// 1. What problem is the change trying to solve?\n// 2. What observable surface changed?\n// 3. What evidence demonstrates the risk?\n// 4. Is there a local primitive or precedent?\n// 5. Is it a Request, Question, Suggestion or polish?",
      "codeLabel": "From the diff to a stewardship observation",
      "steps": [
        "Freeze the scope and separate API, DOM/a11y, state, types, styling, proof and boundaries.",
        "Look for the closest local precedent before calling a decision drift.",
        "If a visual task started owning state, parsing, focus or keyboard, question the scope in addition to pointing out concrete bugs.",
        "Write the why and ask to preserve the contract; do not prescribe an old helper unless it is still the current policy.",
        "Calibrate your language: direct for a proven bug, a question for uncertain intent and non-blocking for polish."
      ],
      "pitfalls": [
        "Complexity is not measured only in lines: a small hook can hide a policy that is hard to discover.",
        "Do not group different lifecycles as duplicates: when a value is confirmed and which value is valid are different questions.",
        "Do not use a majority of opinions as evidence; a single strong finding can be enough."
      ],
      "takeaway": "Senior review = context + contract + evidence + a proportional request.",
      "tableTitle": "CALIBRATION",
      "tableLabel": "How to turn evidence into a comment",
      "table": {
        "columns": [
          "Evidence",
          "Typical intent"
        ],
        "rows": [
          [
            "Reproducible bug",
            "Direct Request"
          ],
          [
            "Contract may break",
            "Request or Question"
          ],
          [
            "Uncertain intent/product",
            "Question"
          ],
          [
            "Clearer pattern, current one valid",
            "Suggestion"
          ],
          [
            "Polish with no demonstrated risk",
            "Non-blocking"
          ]
        ]
      },
      "prompt": "An MR meant to change colors replaces a native input with a custom popover. Write the three highest-signal comments and justify why you would not comment on the rest.",
      "audit": {
        "primer": "Reviewability is the ability to understand what problem a change solves, which contracts it touches and what evidence supports it. A high-value review separates demonstrable bugs, questions of intent, suggestions and preferences.",
        "example": "A color change replaces a native input with a popover. The review first points out the new ownership of keyboard, forms and focus; compares it with the existing primitive and asks for parity tests. A minor rename stays as a non-blocking suggestion.",
        "failureModes": [
          "Commenting on every visual detail hides the one risk that can break consumers.",
          "Prescribing a solution before confirming intent can solve a different problem.",
          "Accepting complexity because the diff is short ignores new hidden lifecycle or state policies."
        ]
      },
      "sources": [
        {
          "label": "Semantic Versioning"
        }
      ]
    }
  },
  "case_design_system_select": {
    "_source": "6c2ccaa80c9f",
    "label": "Case: designing a reusable Select",
    "lesson": {
      "level": "Capstone case",
      "summary": "Designing a reusable Select forces you to decide whether the native select is enough or whether the product needs a composite widget; ownership, API, state, accessibility, forms, styling and tests all follow from that decision.",
      "explanation": "Designing a public Select is an exercise in coordinated contracts. First you decide whether the native element covers the need; if not, the custom API must define value, events, identity, forms, focus, keyboard, accessibility, styling and evolution. A searchable Select uses value/defaultValue with a single source per mode, option.id as identity, onValueChange with a reason and a hidden input for FormData. The trigger controls a listbox with full navigation; there is no Apply if each selection commits immediately.",
      "why": "It is an excellent senior exercise because every visual improvement can create invisible obligations for consuming applications.",
      "code": "type SelectProps = Omit<ComponentPropsWithoutRef<\"button\">, \"value\" | \"defaultValue\" | \"onChange\"> & {\n  name?: string\n  value?: string\n  defaultValue?: string\n  options: Array<{ id: string; label: ReactNode; disabled?: boolean }>\n  onValueChange?: (details: { value: string; reason: \"select\" | \"clear\" }) => void\n}\n\n// triggerRef points to the control; the hidden input participates in the form.\n// The listbox uses stable ids, keyboard navigation and tokens.",
      "codeLabel": "Minimal contract of a custom Select",
      "steps": [
        "Confirm the requirements the native select does not cover; if they are only about appearance, keep it as the behavior source.",
        "Define controlled/uncontrolled, stable identity, clear/reset and the timing of onValueChange.",
        "Preserve id, name, ref, disabled, required, form submit and reset through the right node or explicit integration.",
        "Implement trigger/listbox/options as a complete pattern: name, expanded, controls, selection, keyboard and focus.",
        "Express states with tokens/data-state and test with RTL, browser, stories/VR, themes and migration from the previous API."
      ],
      "pitfalls": [
        "Using the label as the id breaks when it is translated or repeated.",
        "Closing the panel must not commit a draft or emit a selection event.",
        "A div with onClick does not inherit form, keyboard, focus or select semantics.",
        "Do not expose two entry points for the same policy at the same time without deciding which one is the authority."
      ],
      "takeaway": "The Select is not a pretty popover: it is a coordinated contract between React, the browser, forms, accessibility and consumers.",
      "mermaid": "flowchart TD\n  R[Requirements] --> N{Is the native select enough?}\n  N -->|Yes| NS[Style it and preserve native behavior]\n  N -->|No| O[Take on custom ownership]\n  O --> API[API: value/defaultValue/events/ref]\n  O --> ST[State: draft/commit/clear/reset]\n  O --> AX[A11y: trigger/listbox/keyboard/focus]\n  O --> FM[Form: name/required/submit/reset]\n  O --> VS[Visual: tokens/themes/content]\n  API --> P[Proof matrix]\n  ST --> P\n  AX --> P\n  FM --> P\n  VS --> P\n  P --> EV[Evolution and migration]",
      "diagramTitle": "Decisions for a public component",
      "prompt": "Design, live, a Select with search, clear, controlled/uncontrolled mode and form submit. Explain each contract before the code.",
      "audit": {
        "primer": "Designing a public Select is an exercise in coordinated contracts. First you decide whether the native element covers the need; if not, the custom API must define value, events, identity, forms, focus, keyboard, accessibility, styling and evolution.",
        "example": "A searchable Select uses value/defaultValue with a single source per mode, option.id as identity, onValueChange with a reason and a hidden input for FormData. The trigger controls a listbox with full navigation; there is no Apply if each selection commits immediately.",
        "failureModes": [
          "Using the translatable label as key or value changes identity when the language changes.",
          "Closing the popover must not emit a selection if the contract distinguishes draft from commit.",
          "Exposing two hooks or entry points that own the same state creates rival authorities."
        ]
      },
      "sources": [
        {
          "label": "Combobox Pattern (WAI-ARIA APG)"
        },
        {
          "label": "Web forms (MDN)"
        }
      ]
    }
  },
  "case_dashboard": {
    "_source": "4271248c9b2b",
    "label": "Case: dashboard with filters and cache",
    "lesson": {
      "level": "Architecture case",
      "summary": "A Dashboard combines filters in the URL, a server cache per widget, pagination and failure isolation between widgets.",
      "explanation": "First assign ownership: the URL holds shareable filters; each queryKey identifies a remote observation; each widget decides its own pending, empty, error and retry; a mutation invalidates or updates only the affected data. Then choose whether to coordinate requests, use Suspense, keep previous data, paginate or virtualize based on the experience and the volume.",
      "why": "It is a key Frontend System Design interview exercise that demonstrates mastery of state, resilience and real UX.",
      "codeLabel": "Complete dashboard",
      "steps": [
        "Establish the URL as the source of truth for shareable global filters.",
        "Give each widget its own queryKey derived from the URL filters.",
        "Isolate widgets with Suspense or independent loading states so a slow request does not block the screen.",
        "Wrap sections or widgets in local Error Boundaries to offer retries without taking down the dashboard.",
        "Implement server-side pagination or virtualization for tables with a large volume of data."
      ],
      "pitfalls": [
        "Blocking the entire dashboard screen with a single giant spinner while multiple independent requests load.",
        "Not including the filter variables in the widgets' queryKey, which shows data from previous selections.",
        "Rendering thousands of rows in the DOM without pagination or virtualization, freezing the browser."
      ],
      "takeaway": "Filters in the URL, a cache per widget and independent error boundaries make a dashboard fast and resilient.",
      "prompt": "Design a dashboard with filters, a paginated table and widgets that do not block each other.",
      "mermaid": "flowchart TD\n      A[URL Params: ?status=paid] --> B[Dashboard Container]\n      B --> C[Metrics widget: useQuery]\n      B --> D[Sales widget: useQuery]\n      B --> E[Orders table: useQuery]\n      C --> C1[Error Boundary 1]\n      D --> D1[Error Boundary 2]\n      E --> E1[Pagination / Virtualization]",
      "diagramTitle": "Decoupled dashboard architecture",
      "audit": {
        "primer": "This is a design exercise: first we define ownership of the URL, cache and widgets; then we model loading, error, empty and retry per boundary. The dashboard is not a single request or a single success screen.",
        "example": "The URL stores `status` and `page`; TanStack Query uses those values in the queryKey; the table shows previous data while the new page arrives; a metrics widget can fail without hiding the table. After creating an order, the affected queries are invalidated.",
        "failureModes": [
          "A global request blocks the whole dashboard even if only one widget fails.",
          "Without pagination or virtualization, a large response can freeze rendering even if the API responds quickly.",
          "A filter that is not in the queryKey shows results from another selection."
        ]
      },
      "docNotes": [
        "A React Error Boundary does not automatically catch the rejection of any fetch. The library or router must turn that error into a render, or the query must show its explicit error state.",
        "Suspense coordinates fallbacks for suspendable work; it does not replace empty, stale, background fetching or mutation errors.",
        "Virtualization reduces DOM nodes; pagination reduces transfer and server work. They can be combined, but they solve different costs."
      ],
      "sources": [
        {
          "label": "Suspense (React)"
        },
        {
          "label": "Paginated Queries (TanStack Query)"
        }
      ]
    }
  },
  "case_auth": {
    "_source": "0ab241152bea",
    "label": "Case: login, protected routes and refresh",
    "lesson": {
      "level": "Architecture case",
      "summary": "Frontend auth coordinates the initial session check, route guards, token refresh without loops and permission handling.",
      "explanation": "The flow starts in checking because we do not yet know whether a session exists. The route can postpone its decision or show a stable shell. Requests share a refresh coordinator to avoid races; a success renews and retries once, a failure clears identity and sensitive cache, and a 403 keeps the session but presents a lack of permission.",
      "why": "It tests whether you understand the difference between authentication and authorization and how to structure session flows without visual flicker.",
      "codeLabel": "Protected route",
      "steps": [
        "Keep an initial 'checking' state during bootstrap so you do not redirect to login prematurely.",
        "Build a protected route Guard component that evaluates the session when trying to access private screens.",
        "Implement silent token refresh on 401 responses, queuing concurrent requests.",
        "If the refresh fails, clear the cache and the session and start the redirect to login, saving the origin route.",
        "Differentiate 401 responses (re-authenticate) from 403 responses (show an access denied screen without logging out)."
      ],
      "pitfalls": [
        "Redirecting the user to the login screen while the authentication state is still in its initial loading phase.",
        "Letting multiple outgoing 401 requests trigger duplicate refresh requests simultaneously.",
        "Retrying the refresh request indefinitely when the refresh endpoint itself returns a 401 error."
      ],
      "takeaway": "The client organizes the session experience and navigation; the backend validates every permission absolutely.",
      "prompt": "Design login, a protected route, refresh token and 401 handling without loops.",
      "mermaid": "sequenceDiagram\n  participant R as React\n  participant A as Rails API\n  participant S as Session store\n  R->>A: Request + access token\n  A-->>R: 401 expired\n  R->>A: POST /refresh + cookie HttpOnly\n  A->>S: validates and rotates refresh\n  S-->>A: valid session\n  A-->>R: new access token\n  R->>A: retries request once\n  A-->>R: 200 or 403",
      "diagramTitle": "Coordinated refresh without loops",
      "audit": {
        "primer": "This case combines session state, the router and the HTTP client. The app needs a `checking` phase before deciding the route, a coordinated refresh and a clear difference between an invalid session and insufficient permission.",
        "example": "Five requests receive 401 at the same time: only one calls `/refresh`; the rest wait on the same Promise. If the refresh succeeds, they are retried once; if it fails, the user and cache are cleared and the app redirects to login. A 403 shows a permission screen, not login.",
        "failureModes": [
          "Each request doing its own refresh produces races and conflicting rotations.",
          "Retrying a 401 response indefinitely creates a network loop and never returns the user to a recoverable session state.",
          "Caching private data after logout can expose information to the next user of the device."
        ]
      },
      "docNotes": [
        "UI guards and loaders can avoid rendering a private screen, but the server authorizes each resource again.",
        "The return route after login must be validated to avoid open redirects to attacker-controlled domains.",
        "Local logout must clear caches holding user data; global logout or revocation depends on the backend keeping a revocable session or refresh token."
      ],
      "sources": [
        {
          "label": "Unvalidated Redirects Cheat Sheet (OWASP)"
        },
        {
          "label": "React Router: Sessions and Cookies"
        }
      ]
    }
  }
};
