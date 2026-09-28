// react concepts (server_components, native_component_contract, public_component_contract, callback_contracts, controlled_uncontrolled_api, draft_commit_state, library_type_design, api_evolution, behavior_ownership)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "server_components": {
    "_source": "3b450d83b629",
    "label": "Server Components and client/server boundaries",
    "lesson": {
      "level": "Web",
      "summary": "A Server Component runs before the client bundle and can read data close to the server; a Client Component holds interactivity and is marked with \"use client\" in frameworks that support RSC.",
      "explanation": "A Server Component runs on the server and can access the data layer without sending that code to the browser. A Client Component uses state, events and browser APIs; the boundary is marked according to the framework, for example with `use client`. A product page can query the catalog on the server and pass serializable data to an interactive client selector. The selector does not receive a database connection or an arbitrary function as a prop.",
      "why": "Separating it from SSR avoids a common confusion: SSR produces the initial HTML; RSC additionally avoids sending the server component's code to the browser.",
      "codeLabel": "Data on the server, interaction on the client",
      "steps": [
        "The Server Component can access the data layer and use await, but not useState, effects or browser APIs.",
        "The Client Component receives serializable props and can use state, events and the DOM.",
        "The \"use client\" boundary includes that module and its imports in the client bundle.",
        "RSC depends on framework/bundler integration; it is not enabled by adding an isolated API to any SPA."
      ],
      "pitfalls": [
        "\"use server\" does not mark Server Components; it marks Server Functions.",
        "Importing a heavy library from a client boundary can push it into the browser bundle.",
        "Do not pass connections, classes or arbitrary functions as props across the boundary: the data must be serializable."
      ],
      "takeaway": "SSR decides how the HTML is born; RSC decides which components and code need to reach the browser.",
      "audit": {
        "primer": "A Server Component runs on the server and can access the data layer without sending that code to the browser. A Client Component uses state, events and browser APIs; the boundary is marked according to the framework, for example with `use client`.",
        "example": "A product page can query the catalog on the server and pass serializable data to an interactive client selector. The selector does not receive a database connection or an arbitrary function as a prop.",
        "failureModes": [
          "Importing a heavy library from the client boundary can increase the bundle.",
          "Server Components do not replace authorization: the server must validate the session on every sensitive operation."
        ]
      },
      "docNotes": [
        "Server Functions and the Server Components protocol are a remote surface: treat all input as untrusted, authorize every operation and keep the framework up to date. React published security fixes for RSC implementations in late 2025."
      ],
      "sources": [
        {
          "label": "Server Components (React)"
        },
        {
          "label": "React Server Components security advisory"
        }
      ]
    }
  },
  "native_component_contract": {
    "_source": "e43ac470fdcc",
    "label": "Native interop: props, refs and forms",
    "lesson": {
      "level": "Design system",
      "summary": "A reusable component that wraps a native element must preserve the capabilities the consumer expects from that element: attributes, events, ref, focus and form participation.",
      "explanation": "A reusable wrapper does not replace the contract of the native element it contains. If it promises to behave like a button or input, it must preserve attributes, events, ref, focus and form participation on the node that actually owns that behavior. A TextField can draw a label, help text and an error around an input. The ref, name, required and onChange reach the input; className may need separate targets for the control and the wrapper. That way FormData, focus() and accessibility tools keep observing the correct element.",
      "why": "A ref on the wrong node or a name that no longer reaches the input can break integrations even though the component still looks the same.",
      "codeLabel": "Extend the contract of the real element",
      "steps": [
        "Choose the semantic element that owns the base behavior: button, input, a or select.",
        "Extend its native props to accept id, name, data-*, aria-*, events and future attributes without redeclaring them one by one.",
        "Apply className, style and ref to the meaningful node the consumer needs to style, measure or focus.",
        "Check submit, reset, required, disabled and FormData serialization when the component participates in a form."
      ],
      "pitfalls": [
        "Spreading onto a wrapper div preserves TypeScript, but not the behavior of the real input or button.",
        "Changing the target of a ref or className is a contract change even if the public props keep their names.",
        "Do not spread props indiscriminately across several nodes: document which one is the main attachment point."
      ],
      "takeaway": "The wrapper should add design without silently removing platform capabilities.",
      "tableTitle": "NATIVE SURFACES",
      "tableLabel": "What must keep working",
      "table": {
        "columns": [
          "Surface",
          "Observable contract",
          "Risk when moving it"
        ],
        "rows": [
          [
            "ref",
            "Focusable or measurable node",
            "Broken focus and measurements"
          ],
          [
            "name / value",
            "Participation in FormData",
            "The backend does not receive the field"
          ],
          [
            "id / aria-*",
            "Semantic relationships",
            "Label and description disconnected"
          ],
          [
            "className / data-*",
            "Styling and selection",
            "Broken consumer integrations"
          ],
          [
            "event",
            "Target, timing and preventDefault",
            "Incompatible handlers"
          ]
        ]
      },
      "audit": {
        "primer": "A reusable wrapper does not replace the contract of the native element it contains. If it promises to behave like a button or input, it must preserve attributes, events, ref, focus and form participation on the node that actually owns that behavior.",
        "example": "A TextField can draw a label, help text and an error around an input. The ref, name, required and onChange reach the input; className may need separate targets for the control and the wrapper. That way FormData, focus() and accessibility tools keep observing the correct element.",
        "failureModes": [
          "Forwarding all props to the outer div makes TypeScript accept name or disabled even though the form and the browser never receive them.",
          "Moving the ref from the input to the wrapper breaks consumer code that calls focus(), measures the control or expects an HTMLInputElement.",
          "Duplicating the same id or handler on two nodes can create invalid HTML or events that run twice."
        ]
      },
      "sources": [
        {
          "label": "<button> (MDN)"
        },
        {
          "label": "Web forms (MDN)"
        }
      ]
    }
  },
  "public_component_contract": {
    "_source": "6915e590315f",
    "label": "The real public surface of a component",
    "lesson": {
      "level": "Design system",
      "summary": "The real API of a component does not end at its TypeScript interface: it also includes callbacks, refs, stable DOM, attributes, classes, styles, accessible names, stories and any behavior consumers can observe.",
      "explanation": "The public surface is everything another part of the system can legitimately observe and use: props and types, but also DOM, ref, callbacks, semantics, accessible names, form behavior and visual extension points. An application can depend on Button being a real button to submit a form, on its ref allowing focus and on data-state=\"loading\" existing for styling. Changing it to a div keeps the look, but breaks three contracts without modifying the TypeScript interface.",
      "why": "This model lets you detect breaking changes that look like internal refactors and decide what to preserve, deprecate or document.",
      "code": "type SelectContract = {\n  value?: string\n  defaultValue?: string\n  onValueChange?: (details: { value: string; reason: \"select\" | \"clear\" }) => void\n}\n\n// Also part of the contract: ref on the trigger, name on the control,\n// aria-expanded, data-state and the promised structure.",
      "codeLabel": "Inventory of the observable surface",
      "steps": [
        "List who consumes the component: application, CSS, tests, forms, assistive technology and other components.",
        "For each surface, ask what it can observe: type, value, event, node, attribute, visual state or semantics.",
        "Separate intentional contract from accidental detail, but treat an existing dependency as a migration risk even if it was not ideal.",
        "When making a change, preserve compatibility or make the new contract explicit with a version, deprecation, documentation and a test."
      ],
      "pitfalls": [
        "“It is internal” is not enough if className, DOM or ref are observable and consumers already exist.",
        "Promising the entire implementation freezes the component; define attachment points and deliberate contracts.",
        "Do not use tests as a substitute for a decision: first decide what must be stable and then protect it."
      ],
      "takeaway": "A refactor stops being internal when it forces a consumer to relearn something observable.",
      "tableTitle": "CONTRACT CONSUMERS",
      "tableLabel": "The same modification can affect different layers",
      "table": {
        "columns": [
          "Consumer",
          "Surface"
        ],
        "rows": [
          [
            "TypeScript / IDE",
            "Props, exports and types"
          ],
          [
            "React app",
            "Callbacks, controlled state and composition"
          ],
          [
            "Browser / forms",
            "Events, ref, name, validity and reset"
          ],
          [
            "CSS / tests",
            "DOM, classes and data attributes"
          ],
          [
            "Assistive technology",
            "Semantics, name, state and focus"
          ]
        ]
      },
      "prompt": "Review a change that replaces <input> with a trigger + popover: which public surfaces do you inventory before approving it?",
      "audit": {
        "primer": "The public surface is everything another part of the system can legitimately observe and use: props and types, but also DOM, ref, callbacks, semantics, accessible names, form behavior and visual extension points.",
        "example": "An application can depend on Button being a real button to submit a form, on its ref allowing focus and on data-state=\"loading\" existing for styling. Changing it to a div keeps the look, but breaks three contracts without modifying the TypeScript interface.",
        "failureModes": [
          "Declaring that a detail was internal does not protect consumers if the library exposed and documented it in practice.",
          "Promising every class and every node freezes the implementation; it is better to name deliberate attachment points.",
          "A snapshot that preserves the current DOM does not decide which part of that DOM should be stable."
        ]
      },
      "sources": [
        {
          "label": "Passing Props to a Component (React)"
        },
        {
          "label": "Semantic Versioning"
        }
      ]
    }
  },
  "callback_contracts": {
    "_source": "6f623a417c47",
    "label": "Callback and event contracts",
    "lesson": {
      "level": "Design system",
      "summary": "A public callback defines what happened, when it is notified and what stable information the consumer receives; that is why its payload and timing are part of the API.",
      "explanation": "A callback is a small protocol between the component and its consumer. Its name, execution timing, payload and meaning indicate which transition occurred and what the receiver can do with that information. A Select emits onValueChange({ value: \"admin\", reason: \"select\", originalEvent }) when the user confirms an option. Closing with Escape only emits onOpenChange(false); it does not invent a selection or confirm the draft.",
      "why": "Positional events that are hard to extend, synthetic objects that poorly imitate the browser, or callbacks fired during cancel can turn into subtle breaking changes.",
      "codeLabel": "Extensible payload with explicit intent",
      "steps": [
        "Define the domain event: select, clear, open, confirm or cancel.",
        "Choose whether you deliver the real native event, a domain payload or both; do not fabricate an object that looks native without honoring its contract.",
        "Prefer an object when several related pieces can grow without depending on positional order.",
        "Document whether the callback runs before or after the internal state and test that cancel/dismiss do not emit a commit."
      ],
      "pitfalls": [
        "Changing (event, item, context) to another signature breaks consumers even if the visual result is identical.",
        "A callback named onChange that only fires on close is ambiguous; the name should reveal the transition.",
        "Do not strip metadata the consumer needs to correlate the action with a stable id."
      ],
      "takeaway": "Callbacks are protocols: event, payload, timing and room to evolve.",
      "tableTitle": "EVENT DESIGN",
      "tableLabel": "Choose an honest shape",
      "table": {
        "columns": [
          "Shape",
          "Use it when",
          "Trade-off"
        ],
        "rows": [
          [
            "Native event",
            "target/preventDefault matters",
            "Ties the API to the DOM"
          ],
          [
            "Domain payload",
            "The intent matters",
            "Must model reason and identity"
          ],
          [
            "Extensible object",
            "The metadata will grow",
            "More explicit than positional parameters"
          ]
        ]
      },
      "audit": {
        "primer": "A callback is a small protocol between the component and its consumer. Its name, execution timing, payload and meaning indicate which transition occurred and what the receiver can do with that information.",
        "example": "A Select emits onValueChange({ value: \"admin\", reason: \"select\", originalEvent }) when the user confirms an option. Closing with Escape only emits onOpenChange(false); it does not invent a selection or confirm the draft.",
        "failureModes": [
          "An onChange that sometimes means editing and other times confirmation forces every consumer to infer the internal state.",
          "Changing the order of positional parameters is breaking even if TypeScript still finds compatible types.",
          "Fabricating an object that resembles a native event without real preventDefault, target or lifecycle creates a misleading API."
        ]
      },
      "sources": [
        {
          "label": "Responding to Events (React)"
        }
      ]
    }
  },
  "controlled_uncontrolled_api": {
    "_source": "0e04138331d5",
    "label": "Controlled and uncontrolled APIs",
    "lesson": {
      "level": "Design system",
      "summary": "In controlled mode the consumer owns the value and the component proposes changes through callbacks; in uncontrolled mode the component owns the value initialized by defaultValue.",
      "explanation": "In controlled mode, the visible value comes from the value prop and the callback only proposes a change; the parent must supply the new value. In uncontrolled mode, defaultValue initializes internal state once and the component then owns it. A controlled Accordion receives openItem and onOpenItemChange; if the parent ignores the callback, the UI does not change. In uncontrolled mode it receives defaultOpenItem, updates its state on interaction and can expose the same callback as a notification.",
      "why": "Mixing both contracts creates components that appear to accept external changes but keep diverging internal copies.",
      "codeLabel": "One source of truth per mode",
      "steps": [
        "Define exactly how the mode is detected and keep it for the lifetime of the component.",
        "In controlled mode, render value and not a copy synchronized with useEffect.",
        "In uncontrolled mode, defaultValue initializes once; later changes to the default do not replace user interaction.",
        "onChange expresses intent in both modes, but only the owner updates the source of truth."
      ],
      "pitfalls": [
        "Switching from controlled to uncontrolled while mounted produces ambiguous ownership; warn about or prevent that transition.",
        "Do not use value || internal: valid values like an empty string, 0 or false would be lost.",
        "Without an explicit policy for reset and clear, each mode can end up showing a different value."
      ],
      "takeaway": "Controlled: the parent decides. Uncontrolled: the component decides. Never both at once.",
      "tableTitle": "TWO MODES, ONE CONTRACT",
      "tableLabel": "Who owns each decision",
      "table": {
        "columns": [
          "Question",
          "Controlled",
          "Uncontrolled"
        ],
        "rows": [
          [
            "Source of truth",
            "value prop",
            "Internal state"
          ],
          [
            "Initial value",
            "Provided by the parent",
            "defaultValue"
          ],
          [
            "Change",
            "Callback; parent updates",
            "Internal state + callback"
          ],
          [
            "Reset",
            "The parent changes value",
            "Internal policy is restored"
          ]
        ]
      },
      "audit": {
        "primer": "In controlled mode, the visible value comes from the value prop and the callback only proposes a change; the parent must supply the new value. In uncontrolled mode, defaultValue initializes internal state once and the component then owns it.",
        "example": "A controlled Accordion receives openItem and onOpenItemChange; if the parent ignores the callback, the UI does not change. In uncontrolled mode it receives defaultOpenItem, updates its state on interaction and can expose the same callback as a notification.",
        "failureModes": [
          "Copying value into state with an Effect creates two sources of truth and can overwrite a recent interaction.",
          "Using value || internalValue breaks valid controlled values like an empty string, zero or false.",
          "Switching modes during the component's lifetime makes reset, validation and ownership ambiguous."
        ]
      },
      "sources": [
        {
          "label": "Sharing State Between Components (React)"
        }
      ]
    }
  },
  "draft_commit_state": {
    "_source": "0bf37fd87d5f",
    "label": "Draft, commit, cancel and reset",
    "lesson": {
      "level": "Design system",
      "summary": "Complex controls often need to distinguish the committed value from the draft the user edits inside a popover, drawer or temporary form.",
      "explanation": "Draft is what the person is editing; committed is the value the application has already accepted. Separating them lets Apply confirm and lets Cancel, Escape or closing without saving discard the draft predictably. A date filter opens with a draft equal to the confirmed range. Moving the calendar changes only the draft; Apply validates, emits the range and closes. Escape closes, and on reopening the draft is rebuilt from the confirmed value.",
      "why": "Without that separation, opening, closing, losing focus or pressing Escape can modify data without explicit intent or discard changes the user did confirm.",
      "codeLabel": "State machine with intent",
      "steps": [
        "On open, decide whether the draft starts from the current committed value or from a previous session.",
        "Editing only changes the draft; Apply validates and commits; Cancel and Escape restore without emitting a change.",
        "Clear and Reset are not synonyms: one can represent an empty value and the other a return to the default or the form state.",
        "Enumerate blur, dismiss, external submit and controlled updates while the panel is open."
      ],
      "pitfalls": [
        "Using isOpen as a signal to copy props with useEffect is fragile: it couples the visual lifecycle with ownership of the value.",
        "Do not emit onChange for generated values the user has not yet been able to confirm.",
        "Closing via an outside click should not accidentally become Apply."
      ],
      "takeaway": "Name each transition: editing is not confirming, closing is not canceling and resetting is not always clearing.",
      "mermaid": "stateDiagram-v2\n  [*] --> closed\n  closed --> editing: open / copy committed to draft\n  editing --> editing: edit draft\n  editing --> closed: apply / validate + commit\n  editing --> closed: cancel or Escape / restore\n  editing --> editing: clear draft\n  closed --> closed: external controlled update",
      "diagramTitle": "Lifecycle of an editable value",
      "audit": {
        "primer": "Draft is what the person is editing; committed is the value the application has already accepted. Separating them lets Apply confirm and lets Cancel, Escape or closing without saving discard the draft predictably.",
        "example": "A date filter opens with a draft equal to the confirmed range. Moving the calendar changes only the draft; Apply validates, emits the range and closes. Escape closes, and on reopening the draft is rebuilt from the confirmed value.",
        "failureModes": [
          "Copying props every time isOpen changes can erase an edit if another visual update opens or closes the panel.",
          "Treating an outside click as Apply confirms data the person may still have been reviewing.",
          "Confusing Clear with Reset makes it impossible to distinguish an empty value, the initial value and the value confirmed by the parent."
        ]
      },
      "sources": [
        {
          "label": "Choosing the State Structure (React)"
        }
      ]
    }
  },
  "library_type_design": {
    "_source": "2b3ebac7ed58",
    "label": "TypeScript for library APIs",
    "lesson": {
      "level": "Design system",
      "summary": "A library's types should describe states that are actually possible, produce good autocomplete and expose contracts that can evolve without defensive casts.",
      "explanation": "A public type should prevent invalid states, reveal the available operations and remain useful in the editor. TypeScript describes what is known at compile time; network data, storage or configuration still need runtime validation. Instead of { loading?: boolean, data?: T, error?: Error }, a union by status prevents data and error from coexisting. A parser validates the API JSON before converting it to that union; writing response as T does not run any check.",
      "why": "A type assertion can silence exactly the undefined or the variant that later fails at runtime, while an overly broad type forces every consumer to rediscover the valid shape.",
      "codeLabel": "Honest, discoverable types",
      "steps": [
        "Model mutually exclusive states with discriminated unions instead of several combinable optional props.",
        "Use native types for props, events and refs when the component preserves that contract.",
        "Avoid as: fix the origin of the data, validate at runtime or narrow with a verifiable condition.",
        "Name and export result types in public hooks so that changes are detected deliberately."
      ],
      "pitfalls": [
        "Record<string, string> loses autocomplete when the valid keys are known.",
        "unknown in a public ref hides the real node the consumer can use.",
        "TypeScript does not validate JSON or external configuration: a runtime boundary is still necessary."
      ],
      "takeaway": "The type should not convince the compiler; it should tell the consumer the truth.",
      "tableTitle": "TYPE HONESTY",
      "tableLabel": "Symptoms and fixes",
      "table": {
        "columns": [
          "Symptom",
          "What it hides",
          "Better boundary"
        ],
        "rows": [
          [
            "as SomeType",
            "Unverified data",
            "Validate or narrow"
          ],
          [
            "many optionals",
            "Impossible states",
            "Discriminated union"
          ],
          [
            "Record<string, …>",
            "Known keys",
            "Object with explicit keys"
          ],
          [
            "ForwardedRef<unknown>",
            "Real target",
            "Concrete element"
          ]
        ]
      },
      "audit": {
        "primer": "A public type should prevent invalid states, reveal the available operations and remain useful in the editor. TypeScript describes what is known at compile time; network data, storage or configuration still need runtime validation.",
        "example": "Instead of { loading?: boolean, data?: T, error?: Error }, a union by status prevents data and error from coexisting. A parser validates the API JSON before converting it to that union; writing response as T does not run any check.",
        "failureModes": [
          "Many optional props allow combinations the component does not know how to render.",
          "A cast silences the compiler precisely at the boundary where the data has not been verified yet.",
          "Re-exporting a vendor's types without a policy can turn any change in that dependency into a breaking change of your own."
        ]
      },
      "sources": [
        {
          "label": "TypeScript (React)"
        },
        {
          "label": "Unions and Narrowing (TypeScript)"
        }
      ]
    }
  },
  "api_evolution": {
    "_source": "c82da8f100cc",
    "label": "Evolution, deprecation and migrations",
    "lesson": {
      "level": "Design system",
      "summary": "A shared library evolves through compatibility, deprecations and explicit migrations; removing or narrowing something exported requires more than updating the internal implementation.",
      "explanation": "A shared API does not change for all its consumers at the same time. A safe migration temporarily keeps the previous contract, announces the alternative, makes it possible to measure adoption and removes the old one in a version consistent with that promise. The isOpen prop is deprecated in favor of open. For one version, the component accepts both, gives precedence to open, shows a development warning and documents a codemod. Telemetry or a search of consumers confirms adoption before removing isOpen in the next major.",
      "why": "Consumers upgrade at different times and depend on the IDE, changelog, stories and versions to understand what they must change.",
      "codeLabel": "Deprecate before removing",
      "steps": [
        "Identify the scope: prop, type, hook, export path, callback, DOM or a story of a previous case.",
        "If possible, keep the old API as an adapter and mark it @deprecated with an alternative and a horizon.",
        "Classify stability with alpha/beta when the contract can still change.",
        "Add a migration guide, changelog and a test or story of the old usage until the transition is complete."
      ],
      "pitfalls": [
        "Changing only the commit title does not help the consumer migrate.",
        "Deleting an old story because the new one works removes evidence of compatibility.",
        "Proxying a dependency's types also ties your semver to changes in that version."
      ],
      "takeaway": "Every public change needs an adoption story, not just a new implementation.",
      "mermaid": "flowchart LR\n  O[Current contract] --> D[Mark deprecated]\n  D --> A[Compatible adapter]\n  A --> M[Docs + migration + warning]\n  M --> V[Major version]\n  V --> R[Removal]",
      "diagramTitle": "Safe route for evolving an API",
      "audit": {
        "primer": "A shared API does not change for all its consumers at the same time. A safe migration temporarily keeps the previous contract, announces the alternative, makes it possible to measure adoption and removes the old one in a version consistent with that promise.",
        "example": "The isOpen prop is deprecated in favor of open. For one version, the component accepts both, gives precedence to open, shows a development warning and documents a codemod. Telemetry or a search of consumers confirms adoption before removing isOpen in the next major.",
        "failureModes": [
          "Removing first and writing the guide later forces every application to discover the migration when it is already broken.",
          "Keeping two paths without a precedence rule produces different results when both props arrive.",
          "A feature flag does not fix type, data or entry point incompatibilities between deployed versions."
        ]
      },
      "sources": [
        {
          "label": "Semantic Versioning"
        }
      ]
    }
  },
  "behavior_ownership": {
    "_source": "5fe59eafc5e5",
    "label": "Behavior ownership and native parity",
    "lesson": {
      "level": "Design system",
      "summary": "When you replace a native element or a local primitive with custom UI, your component becomes the owner of every behavior that base used to handle.",
      "explanation": "Behavior ownership means being responsible for all the rules that make an interaction work. Replacing a native primitive with custom UI transfers keyboard, focus, validation, forms, events, accessibility and edge cases to the team. To change the colors of a date input, you keep the native input and style its container. If the requirement demands a custom calendar, the team must implement parsing, min/max, keyboard navigation, locale, focus, reset and form serialization, not just the popover.",
      "why": "A seemingly visual task can expand into state, keyboard, focus, ARIA, parsing, validation, constraints, events and forms; recognizing that expansion avoids reimplementing an incomplete platform.",
      "code": "// Goal: customize the appearance of a date input\n// Lowest-ownership option:\n<label>\n  Date\n  <input type=\"date\" className=\"custom-date\" {...props} />\n</label>\n\n// A custom calendar is only justified if the requirement\n// cannot be built while keeping the primitive.",
      "codeLabel": "Keep the source of behavior",
      "steps": [
        "Name the original problem: presentation, normalization, API, behavior or accessibility.",
        "List which new responsibilities appear if you abandon the existing primitive.",
        "Try to keep the primitive as the source of behavior and layer presentation or composition on top.",
        "If custom is necessary, document the trade-off and build a parity matrix for values, events, constraints, forms, focus and keyboard."
      ],
      "pitfalls": [
        "“We can do it in React” does not show that we should own all of the behavior.",
        "Visual parity does not imply functional parity with the browser, forms or assistive technology.",
        "A thin wrapper abstraction stops being thin when it contains undeclared state policy and lifecycle."
      ],
      "takeaway": "Every custom behavior is a product responsibility that someone will have to maintain and test.",
      "tableTitle": "COST OF REPLACING THE PLATFORM",
      "tableLabel": "Responsibilities that become your own",
      "table": {
        "columns": [
          "Area",
          "Before",
          "After customizing"
        ],
        "rows": [
          [
            "Value",
            "Browser / primitive",
            "Own state and synchronization"
          ],
          [
            "Interaction",
            "Native keyboard and focus",
            "Own complete model"
          ],
          [
            "Validity",
            "Control constraints",
            "Own parsing and errors"
          ],
          [
            "Form",
            "name/reset/submit",
            "Hidden input or own integration"
          ],
          [
            "A11y",
            "Native semantics",
            "Own roles, states and relationships"
          ]
        ]
      },
      "prompt": "You are asked to visually redesign a date input. What would you keep native, and what evidence would you require if it is replaced?",
      "audit": {
        "primer": "Behavior ownership means being responsible for all the rules that make an interaction work. Replacing a native primitive with custom UI transfers keyboard, focus, validation, forms, events, accessibility and edge cases to the team.",
        "example": "To change the colors of a date input, you keep the native input and style its container. If the requirement demands a custom calendar, the team must implement parsing, min/max, keyboard navigation, locale, focus, reset and form serialization, not just the popover.",
        "failureModes": [
          "Visual parity can hide that keyboard, autofill, validation or submit no longer work.",
          "A wrapper presented as small can end up concentrating a state policy that nobody documented.",
          "Reimplementing the platform without a clear product need increases bugs and maintenance cost."
        ]
      },
      "sources": [
        {
          "label": "<button> (MDN)"
        },
        {
          "label": "WAI-ARIA Authoring Practices"
        }
      ]
    }
  }
};
