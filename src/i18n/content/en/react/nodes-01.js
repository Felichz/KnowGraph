// react concepts (js_basics, react_mental_model, components_props, jsx_rendering, events_propagation, state_updates, hooks_rules, custom_hooks, use_state_reducer, forms_controlled)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "js_basics": {
    "_source": "a3934e68dd2c",
    "label": "Modern JavaScript for reading React",
    "lesson": {
      "level": "Starting point",
      "summary": "Modern JavaScript brings closures, modules, Promises and immutability; many React bugs are really reference or async bugs.",
      "explanation": "Before React there are four JavaScript ideas that show up in every component: closures, modules, Promises and immutability. A closure is a function that remembers the variables from the place where it was created. Every handler you write inside a component is a closure that captures the props and state of that render, which is why a setTimeout can end up reading an old value: the function remembers the render in which it was created, not the latest one.\n\nModules tell you where each symbol comes from: when you read `import { useState } from \"react\"` you are looking at the contract, not magic. A Promise represents work that has not finished yet; `await` pauses that function, not the browser, and a rejection without a `catch` becomes an error nobody handled.\n\nFinally, immutability. React detects changes by comparing references, so `setItems([...items, item])` hands it a new reference it can recognize, while `items.push(item)` mutates the one it already had and can leave the screen out of date. Mastering these four pieces turns reading any component into a mechanical exercise: you know what each function captures, where each symbol comes from, what is still pending and which reference changed.",
      "why": "You need to read the syntax that appears in hooks, handlers and data fetching.",
      "code": "import { useState } from \"react\"\n\nfunction Search() {\n  const [query, setQuery] = useState(\"\")\n  const submit = async () => {\n    // closure: remembers the `query` from the render where it was created\n    const res = await fetch(`/api/search?q=${query}`)\n    console.log(await res.json())\n  }\n  return <button onClick={submit}>Search \"{query}\"</button>\n}",
      "codeLabel": "Module, closure and Promise in a handler",
      "steps": [
        "Read each handler as a closure: identify which values from the current render it captured.",
        "Follow each symbol back to its import to understand what contract that module exposes.",
        "Treat each fetch as a Promise: where the result is awaited and where the rejection is caught.",
        "For every update, ask yourself whether you created a new reference or mutated the existing one."
      ],
      "pitfalls": [
        "Mutating an existing array or object can hide the change: React compares references and the old one is still in place.",
        "A new reference does not guarantee new data: `[...items]` copies the structure, it does not validate the content.",
        "A fetch without a catch leaves the rejection as an unhandled rejection: the screen hangs and the error only lives in the console."
      ],
      "takeaway": "To read React: master closures, modules, Promises and immutable copies.",
      "audit": {
        "primer": "To read React you need four pieces of JavaScript: closures, modules, Promises and immutable references. A closure keeps variables; a Promise represents future work; a new copy lets changes be detected by reference.",
        "example": "A handler created inside render forms a closure over props and state. A `fetch` returns a Promise and `await` pauses that function, not the browser. `setItems([...items, item])` creates a new array; `items.push(item)` mutates the existing reference.",
        "failureModes": [
          "A closure can read an old snapshot if it is used later in a timer or callback.",
          "A missing `catch` turns a Promise rejection into an unhandled error.",
          "Mutating a shared object can keep React and other consumers from detecting the change."
        ]
      },
      "sources": [
        {
          "label": "Closures (MDN)"
        },
        {
          "label": "Using promises (MDN)"
        }
      ]
    }
  },
  "react_mental_model": {
    "_source": "3f4337184acf",
    "label": "Mental model: UI as a function of state",
    "lesson": {
      "level": "Fundamentals",
      "summary": "React computes a UI description from props, state and context; then it compares and applies changes during the commit.",
      "explanation": "React offers you a deal: you describe how the interface should look for a given state, and React takes care of bringing the DOM to that point. Computing that description is called render; the moment React applies only what changed to the DOM is called commit.\n\nLook at the counter in the example: the click does not change the number on screen, it schedules a new state. React runs your component again with that value, compares the new description with the previous one and touches only the button text. Nothing else is rebuilt.\n\nTwo rules follow from this model, and they explain almost every React bug. First: render can be repeated, so it must be pure; if you mutate something or fetch during render, that work can be duplicated. Second: everything that synchronizes with the outside world (subscriptions, timers, network) goes after the commit, in an Effect. When a screen does something odd, the right question is almost always the same: did this happen in render, in commit or in an effect?",
      "why": "This model explains renders, effects, memoization and why you do not manipulate the DOM manually for every change.",
      "codeLabel": "State → render → commit",
      "steps": [
        "Rendering computes a description and does not mean the whole DOM changes.",
        "Render must be pure because React can repeat it.",
        "Effects synchronize external systems after the commit."
      ],
      "pitfalls": [
        "Do not fetch or perform global mutations during render.",
        "setState schedules another render; it is not an ordinary immediate assignment."
      ],
      "takeaway": "Render = compute the UI; commit = apply it; effect = synchronize the outside world.",
      "audit": {
        "primer": "React is a library that computes a description of the interface from props, state and context. A render is that computation; the commit is the moment React applies only the necessary changes to the DOM.",
        "example": "In a counter, the click schedules a new state, React runs the component again and compares the result. If only the number changed, it does not have to rebuild the whole page. If the component performs a mutation during render, React could repeat it and produce duplicated effects.",
        "failureModes": [
          "An impure render can duplicate a request or a subscription.",
          "If the same data is copied into two states, an update can leave part of the screen out of date."
        ]
      },
      "sources": [
        {
          "label": "Thinking in React"
        },
        {
          "label": "Render and Commit (React)"
        }
      ]
    }
  },
  "components_props": {
    "_source": "3250b5816f12",
    "label": "Components, props and composition",
    "lesson": {
      "level": "Fundamentals",
      "summary": "Components are functions that receive props and compose UI through small contracts.",
      "explanation": "A component is a function that receives inputs (props) and returns a UI description. Props are read-only: the child uses them but does not change them, because every piece of data has an owner and that owner decides how it evolves.\n\nComposition is what lets this scale. Instead of one giant component with twenty flags, you build small pieces with small contracts and combine them. `children` is the most useful case: a `Card` does not need to know what goes inside it, only where to put it, which is why it can wrap a table today and a form tomorrow without changing a line.\n\nWhen the child needs something to change, it does not modify the prop: it notifies. An `OrdersTable` receives `rows` and `onSelectOrder`; it displays and emits intent, and the parent screen decides whether that click opens a modal, changes the URL or requests more data. That is why the same table works on a full page and in a side panel: its contract assumes no context, and that is the property that makes a component truly reusable.",
      "why": "Composition scales better than inheritance and catch-all components.",
      "codeLabel": "Composition and children",
      "steps": [
        "Define what data the component needs and expose it as read-only props.",
        "Place state in the owner of the decision; the child requests changes through callbacks.",
        "Use children when the container should not know the content it wraps.",
        "Keep the contract small: few props, domain names, no flags that contradict each other."
      ],
      "pitfalls": [
        "A prop with too many options, or a generic options object, forces people to read the implementation to use the component correctly.",
        "Copying a prop into local state so you can edit it creates two sources of truth: when the prop changes, the child keeps showing the old value.",
        "Passing props through five levels that do not use them (prop drilling) usually signals missing composition or a Context, not missing props."
      ],
      "takeaway": "Compose pieces with small contracts and clear ownership.",
      "audit": {
        "primer": "A component is a function that receives props, returns UI and can compose other components. Props are read-only inputs; state belongs to whoever must decide how the data changes.",
        "example": "An OrdersTable can receive rows and onSelectOrder. The table displays and emits the intent; the parent screen decides whether to open a modal, change the URL or request more data. That way the same table works for a page and for a side panel.",
        "failureModes": [
          "A prop with too many options creates a component that is hard to understand.",
          "If the child keeps an editable copy of a prop without explicit synchronization, it can show an old value."
        ]
      },
      "sources": [
        {
          "label": "Passing Props to a Component (React)"
        },
        {
          "label": "Thinking in React"
        }
      ]
    }
  },
  "jsx_rendering": {
    "_source": "fccedb4badd4",
    "label": "JSX and declarative rendering",
    "lesson": {
      "level": "Fundamentals",
      "summary": "JSX describes elements and JavaScript expressions; it is not HTML inserted line by line.",
      "explanation": "JSX looks like HTML, but it is JavaScript: every tag you write is transformed into a call that produces the description of that piece of the interface. Curly braces `{}` put any expression inside that description: a value, a ternary, a `map` that builds a list.\n\nBeing declarative changes your job: you do not say \"find this node and change its text\"; you describe how the UI looks for the current state and React resolves the difference with what is already on screen.\n\nTwo protections come built in and are worth knowing. React escapes the text you render, so a comment containing `<script>` is shown as text and is not executed; `dangerouslySetInnerHTML` exists for when you really need raw HTML, and it requires sanitizing it first. And in lists, `key` gives each row a stable identity so React knows which is which when the order changes.",
      "why": "It prevents mistakes with lists, expressions, semantics and untrusted content.",
      "codeLabel": "JSX as a description",
      "steps": [
        "Read JSX as expressions: everything inside curly braces is evaluated on every render.",
        "Build lists with map and a stable key that comes from the data, not from the array index.",
        "Rely on the default escaping; if you use dangerouslySetInnerHTML, sanitize the HTML first.",
        "Describe the final result for each state instead of instructions for mutating the DOM."
      ],
      "pitfalls": [
        "An index-based key seems to work until the list is reordered: internal state stays attached to the position and jumps to another row.",
        "`{count && <Badge />}` with a numeric count renders a 0 on screen when it is zero: use an explicit boolean.",
        "Injecting user HTML without sanitizing it is straight XSS: default escaping only protects what you render as text."
      ],
      "takeaway": "JSX describes the UI and React decides how to update it.",
      "audit": {
        "primer": "JSX is JavaScript syntax that describes elements; it is not an HTML template that the browser executes directly. Expressions inside curly braces are evaluated during render.",
        "example": "In `items.map(item => <Row key={item.id} />)`, map builds the description of each row and key gives it identity. React escapes text like `<script>` if it is shown as content, but `dangerouslySetInnerHTML` bypasses that protection and requires sanitization.",
        "failureModes": [
          "An index-based key can move internal state to another row when the list is reordered.",
          "HTML coming from the user can become XSS if it is injected without sanitizing."
        ]
      },
      "sources": [
        {
          "label": "Writing Markup with JSX (React)"
        }
      ]
    }
  },
  "events_propagation": {
    "_source": "b0b0f2f2d6e3",
    "label": "Events, propagation and user actions",
    "lesson": {
      "level": "Fundamentals",
      "summary": "An event starts at a browser element and React runs the handlers declared in the component tree; normally the event bubbles from the target up to its ancestors.",
      "explanation": "A browser event starts at a specific node and travels: first it goes down in the capture phase and then it bubbles up to the root. React lets you declare handlers in any component along that path with props like `onClick`, and it respects the journey.\n\nThis gives you two tools you need to tell apart without thinking. `preventDefault` stops the browser's native action: the form reloading the page, the link navigating. `stopPropagation` stops the event from traveling to its ancestors. The classic case: a row that opens the detail view on click and has a Delete button inside it; without `stopPropagation`, deleting also opens the detail view.\n\nAnd there is a boundary rule that organizes the whole model: the handler is the place for user actions. Confirming, setting the pending state, calling the API and handling the error live there, not in an Effect that watches a boolean, because the Effect does not know which click started the operation or in what context.",
      "why": "It is the foundation for forms, delegation, modals and compound components, and it keeps you from confusing a user action with an Effect.",
      "codeLabel": "Event → handler → update",
      "steps": [
        "React receives a function in onClick or onSubmit; you must not execute it during render.",
        "event.target is the node where the event originated and event.currentTarget is the node whose handler is running.",
        "preventDefault avoids the default action, such as reloading when submitting a form; stopPropagation keeps the event from continuing to ancestors.",
        "The handler expresses a specific action. useEffect is reserved for synchronization caused by having rendered."
      ],
      "pitfalls": [
        "Passing onClick={save()} executes save during render; pass onClick={save}.",
        "Using stopPropagation everywhere hides the flow. Reserve it for a deliberate interaction boundary.",
        "Do not move into an Effect an operation that belongs to the click or submit: you would lose the exact context of the action."
      ],
      "takeaway": "Event = something that happened; handler = a specific response; Effect = synchronization after render.",
      "audit": {
        "primer": "Browser events have a capture phase and a bubbling phase. React exposes handlers like `onClick`; `stopPropagation` stops the event's journey, while `preventDefault` avoids the native action, such as following a link.",
        "example": "A row opens the detail view on click, but its Delete button must stop propagation so it does not also open the detail view. The handler still has to ask for confirmation, handle pending and deal with an API error.",
        "failureModes": [
          "Confusing preventDefault with stopPropagation leaves the event traveling or blocks the wrong action.",
          "A button inside a link can cause accidental navigation and a mutation at the same time."
        ]
      },
      "sources": [
        {
          "label": "Responding to Events (React)"
        }
      ]
    }
  },
  "state_updates": {
    "_source": "cc903f956468",
    "label": "State, snapshots and batching",
    "lesson": {
      "level": "State",
      "summary": "State is a snapshot of the current render; updating it schedules another render and React can batch updates.",
      "explanation": "React state is not a variable that changes: it is a snapshot of the render, a fixed picture of the values that pass was computed with. When you write `setCount(count + 1)` you are not modifying `count`; you are scheduling a new render with a different value. Inside the current handler, `count` is still the one in the picture.\n\nThis explains the interviewers' favorite bug: two `setCount(count + 1)` calls in a row do not add two, because both read the same snapshot. The functional form `setCount(c => c + 1)` does accumulate, because each updater receives the most recent value from the update queue.\n\nBatching completes the picture: React groups the updates from the same event into a single render, so three setters in a row are not three renders. The practical conclusion has three parts: if the next value depends on the previous one, use an updater; if you work with objects or arrays, create new references; and never read state expecting that the setter you just called has already taken effect.",
      "why": "It explains why two setters that use the same old value do not necessarily accumulate.",
      "codeLabel": "Functional update",
      "steps": [
        "When the next value depends on the previous one, use the functional form.",
        "With objects and arrays, create new references.",
        "Reading state after the setter inside the same handler returns the previous snapshot."
      ],
      "pitfalls": [
        "Reading state right after the setter to validate or log uses the previous value: the picture has not been refreshed yet.",
        "Mutating an object and storing the same reference again can leave the UI unchanged: React compares references to decide.",
        "Assuming each setter triggers an immediate render leads to unnecessary defensive code: React batches updates from the same event."
      ],
      "takeaway": "State is not an ordinary mutable variable: it feeds the next render.",
      "codeComparison": {
        "naive": {
          "label": "Naive approach (Stale Snapshot)",
          "code": "function Counter() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    // ⚠️ Bug: both setters read the initial snapshot (count = 0)\n    setCount(count + 1);\n    setCount(count + 1);\n    console.log(\"Current count:\", count); // Prints 0, not 2\n  }\n\n  return <button onClick={handleClick}>+2 ({count})</button>;\n}",
          "whyItFails": "Inside the handler's closure, 'count' is constant for the current render. Subsequent calls with a direct value overwrite the previous one instead of composing."
        },
        "production": {
          "label": "Senior pattern (Functional Queue & Batching)",
          "code": "function Counter() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    // 🛡️ Functional updates are queued sequentially in Fiber\n    setCount(prev => prev + 1);\n    setCount(prev => prev + 1);\n  }\n\n  return <button onClick={handleClick}>+2 ({count})</button>;\n}",
          "tradeOff": "It requires pure functions with no side effects inside the updater (React can re-run them in StrictMode or in concurrent rendering)."
        }
      },
      "audit": {
        "primer": "React state is a snapshot: inside a render and its handler you see that render's value. The setter schedules another render; it does not mutate the local variable immediately.",
        "example": "If a button increments twice using `setCount(count + 1)`, both expressions can use the same snapshot. `setCount(current => current + 1)` chains the two transitions correctly because each updater receives the most recent value from the queue.",
        "failureModes": [
          "Reading state right after the setter can make a validation use the previous value.",
          "Mutating an existing object and storing the same reference again can keep the UI from detecting the change."
        ]
      },
      "sources": [
        {
          "label": "State as a Snapshot (React)"
        },
        {
          "label": "Queueing a Series of State Updates (React)"
        }
      ]
    }
  },
  "hooks_rules": {
    "_source": "d9473db0f9f4",
    "label": "Hooks and their rules",
    "lesson": {
      "level": "Hooks",
      "summary": "Hooks bring state and React capabilities to functions, but their call order must be stable.",
      "explanation": "Hooks are functions that connect your component to React capabilities: state, effects, context, refs. The price of that convenience is a hard rule: always call them in the same order and at the top level of the component.\n\nThe reason is mechanical, not ideological. React has no names to associate each `useState` with its value; it uses the position of the call in the sequence. If you put a Hook inside an `if`, when the condition changes the positions shift and React gives each Hook another one's state. That is why the fix is never to call it only sometimes: always call it and put the condition inside the logic, as the example does, where the Effect always runs and decides with an early return whether there is work to do.\n\nThe other consequence is a happy one: any function that starts with `use` and calls Hooks inherits the same contract, and each component that uses it gets its own state instance. That is the foundation custom Hooks are built on.",
      "why": "The rules let React associate each Hook with the same state on every render.",
      "code": "function Search({ enabled }) {\n  const [term, setTerm] = useState(\"\")\n  useEffect(() => {\n    if (!enabled) return // the condition goes inside, not around the Hook\n    const id = setTimeout(() => search(term), 300)\n    return () => clearTimeout(id)\n  }, [enabled, term])\n}",
      "codeLabel": "The condition goes inside the Hook",
      "steps": [
        "Call Hooks at the top level or inside custom Hooks.",
        "Do not call them inside ifs, loops or nested functions.",
        "A custom Hook shares logic, but each call has its own state."
      ],
      "pitfalls": [
        "A Hook inside an if, a loop or after an early return breaks the positional correspondence, and the error shows up far from the offending line.",
        "Extracting logic with Hooks into an ordinary function without the use prefix hides the contract: the linter does not check it and your colleagues do not recognize it.",
        "Believing that two components using the same custom Hook share state: each call creates its own independent instance."
      ],
      "takeaway": "A stable Hook order is a contract with React.",
      "audit": {
        "primer": "A Hook is a React API that lets you use state, effects or other capabilities from a function component. The Rules of Hooks require always calling them in the same order, at the top level.",
        "example": "`useState` must not be inside `if (enabled)`: when enabled changes, React could no longer know which state belongs to each call. The alternative is to always call the Hook and decide inside its callback what behavior to run.",
        "failureModes": [
          "A Hook inside a loop or condition breaks the correspondence between calls and can produce errors that are hard to track down.",
          "A custom Hook does not automatically share state between consumers: each call creates its own instance."
        ]
      },
      "docNotes": [
        "use is the documented exception to the ordering rule: it can be called inside conditions and loops, but it still has to run during render inside a component or custom Hook. It must not be wrapped in try/catch; Suspense and Error Boundaries model its results."
      ],
      "sources": [
        {
          "label": "Rules of Hooks (React)"
        },
        {
          "label": "use (React)"
        }
      ]
    }
  },
  "custom_hooks": {
    "_source": "50e20fd36fe6",
    "label": "Custom Hooks and composing logic",
    "lesson": {
      "level": "Hooks",
      "summary": "A custom Hook encapsulates reusable state, effect or subscription logic without reusing markup.",
      "explanation": "A custom Hook is a function named `use...` that packages React logic (state, effects, subscriptions) so it can be reused without duplicating coordination across components.\n\nThe key concept: it shares behavior, not data. If two screens call `useOnlineStatus`, each one has its own state and its own subscription to the browser's online/offline events; what they reuse is the recipe, not the instance. This sets it apart from a global store, and the fact that it uses Hooks inside sets it apart from an ordinary helper function.\n\nThe design of its API matters as much as its implementation: it should speak the language of the domain (`isOnline`, `retry`, `isIdle`) and not leak implementation details such as refs or browser event names. The signal for extraction is simple: when the same coordination shows up in a component for the third time, it probably deserves a name of its own and wants to be a Hook.",
      "why": "It avoids duplicating coordination in components and lets you test the logic behind a clear boundary.",
      "codeLabel": "Reusable logic",
      "steps": [
        "A custom Hook shares behavior, not a global state instance.",
        "Its API should expose domain data and actions, not incidental UI details.",
        "If two hooks need to synchronize the same global resource, consider an external store."
      ],
      "pitfalls": [
        "A custom Hook that mixes fetching, navigation and UI decisions piles up responsibilities and stops being reusable.",
        "Forgetting the cleanup of a subscription inside the Hook leaves duplicated listeners every time the screen mounts and unmounts.",
        "Using a custom Hook to synchronize a global resource between components does not work: each call has its own instance; that calls for a store or Context."
      ],
      "takeaway": "Extract a custom Hook when the behavior repeats and has a nameable boundary.",
      "audit": {
        "primer": "A custom Hook is a function whose name starts with `use` and that composes existing Hooks to reuse logic, not to share an instance of data.",
        "example": "`useOnlineStatus` can subscribe to the online/offline events, return `{ isOnline }` and clean up listeners on unmount. Two components that call it receive the same browser fact, but each one manages its own subscription.",
        "failureModes": [
          "A custom Hook that mixes fetching, navigation and UI ends up with too many responsibilities.",
          "Forgetting cleanup in a subscription leaves duplicated listeners after mounting and unmounting the screen."
        ]
      },
      "sources": [
        {
          "label": "Reusing Logic with Custom Hooks (React)"
        }
      ]
    }
  },
  "use_state_reducer": {
    "_source": "557ad1fbf545",
    "label": "useState vs useReducer",
    "lesson": {
      "level": "State",
      "summary": "useState is for simple local state; useReducer expresses related transitions through events.",
      "explanation": "The two official local state Hooks answer two different kinds of change. `useState` describes a value: ideal when transitions are small and independent, like a text field or a flag. `useReducer` describes transitions: the component dispatches events (`save_started`, `save_failed`) and a pure function, the reducer, decides the next state for each one.\n\nThe reducer wins when several updates share rules, or when the state is really a state machine. An editor that goes from `idle` to `saving` to `saved` or `error` reads better as events than as four setters scattered through the code, and invalid transitions become visible in a single place.\n\nThe cost is ceremony: action types, dispatch, switch. That is why the rule is not \"a reducer is more professional\", but \"a reducer when there is transition logic to concentrate\". And one boundary is non-negotiable: the reducer is pure. The HTTP call lives in the handler that dispatches the action, never inside the function that computes the state.",
      "why": "Choosing well avoids scattered setters or unnecessary reducers.",
      "codeLabel": "State driven by events",
      "steps": [
        "useState is clear for small transitions.",
        "useReducer concentrates rules in a pure function.",
        "The reducer does not call APIs or mutate state."
      ],
      "pitfalls": [
        "Putting a fetch or a Date.now() inside the reducer makes it impure: it stops being predictable, repeatable and testable.",
        "Using a reducer for an isolated boolean adds ceremony without any real decision to concentrate.",
        "Dispatching generic actions like set_field recreates useState with more steps: actions should name domain events."
      ],
      "takeaway": "useState describes values; useReducer describes transitions.",
      "audit": {
        "primer": "`useState` is the official Hook for simple local values. `useReducer` is another official Hook: it receives actions and a pure function that computes the next state when there are several related transitions.",
        "example": "An editor can have `idle`, `saving`, `saved` and `error`. With a reducer, `dispatch({ type: 'save_started' })` and `dispatch({ type: 'save_failed', message })` make the flow explicit, while the HTTP call stays outside the reducer.",
        "failureModes": [
          "A reducer that calls an API stops being pure and becomes hard to repeat or test.",
          "Using a reducer for an isolated boolean adds ceremony without a real decision boundary."
        ]
      },
      "sources": [
        {
          "label": "Extracting State Logic into a Reducer (React)"
        }
      ]
    }
  },
  "forms_controlled": {
    "_source": "695e5bcecd02",
    "label": "Controlled and uncontrolled forms",
    "lesson": {
      "level": "State",
      "summary": "A controlled input receives value from React and reports changes; an uncontrolled one keeps the value in the DOM and is read with a ref.",
      "explanation": "Every input in React picks an owner for its value. In a controlled input the owner is React: `value` comes from state and every keystroke goes through `onChange`, so the screen always shows what your state says and you can validate while the user types. In an uncontrolled one the owner is the DOM: the input keeps its own value and you read it with a ref or with FormData on submit.\n\nThe trade-off is real. Controlled gives you immediate feedback (showing the email error below the field while the user types) at the price of one render per keystroke. Uncontrolled avoids those renders and is the basis of libraries like React Hook Form, which registers inputs and validates at the right moment.\n\nThe practical rule: if live validation or formatting matter, go controlled; if the form is huge and the render cost is noticeable, register without controlling. What does not change with either one: the submit has to model validation, pending, success and error as explicit states.",
      "why": "The choice affects validation, performance and integration with libraries.",
      "codeLabel": "Controlled form",
      "steps": [
        "State is the source of truth for the controlled value.",
        "Submit must model validation, submitting, success and error.",
        "A large form can use uncontrolled inputs to reduce renders, without losing a validation contract."
      ],
      "pitfalls": [
        "An input that starts with value undefined and later receives a string switches from uncontrolled to controlled midway through its life: React warns about it and the bug is confusing.",
        "One render per keystroke in a fifty-field form is noticeable: measure the cost before controlling everything by default.",
        "Disabling the submit button does not replace backend validation or prevent duplicate submits from another client."
      ],
      "takeaway": "Controlled = React knows the value; uncontrolled = the DOM keeps it.",
      "audit": {
        "primer": "A controlled input receives its `value` from React and reports changes with `onChange`; an uncontrolled input keeps the value in the DOM and is read with a ref or when the form is submitted.",
        "example": "For an email, a controlled form can show the error below the field while the user types. For a huge form, React Hook Form can register uncontrolled inputs and validate on submit without causing a render on every keystroke.",
        "failureModes": [
          "An input that goes from undefined to a value becomes controlled midway through its life and generates warnings.",
          "Disabling the button does not replace backend validation or prevent a duplicate submit from another client."
        ]
      },
      "sources": [
        {
          "label": "Sharing State Between Components (React)"
        },
        {
          "label": "Web forms (MDN)"
        }
      ]
    }
  }
};
