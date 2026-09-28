// react graph: labels, focus areas, milestones, seniority levels, interview questions
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "_source": "737e4711f7bc",
  "label": "React interviews",
  "title": "React interview map",
  "subtitle": "From the mental model and shipping features to the browser, production, design systems and frontend leadership.",
  "categories": {
    "fundamentals": {
      "label": "Mental model & components"
    },
    "state": {
      "label": "State & data"
    },
    "effects": {
      "label": "Effects & async"
    },
    "rendering": {
      "label": "Rendering & performance"
    },
    "architecture": {
      "label": "Web architecture"
    },
    "quality": {
      "label": "Testing & quality"
    },
    "platform": {
      "label": "Web, security & deploy"
    },
    "designSystem": {
      "label": "Design systems & contracts"
    },
    "runtime": {
      "label": "Browser & runtime"
    },
    "operations": {
      "label": "Production & reliability"
    },
    "leadership": {
      "label": "Product & leadership"
    }
  },
  "categoryContext": {
    "fundamentals": "First we build the mental model that lets you predict when React renders and how data flows.",
    "state": "Now we decide where state lives, who changes it and which data is the source of truth.",
    "effects": "This branch connects React to the outside world: network, timers, subscriptions and cancelling work.",
    "rendering": "With the mental model clear, we optimize only the renders and computations that actually matter.",
    "architecture": "Now we compose a complete application: routes, server state, auth and component boundaries.",
    "quality": "After designing the behavior, we learn to test it from the user's perspective.",
    "platform": "Finally we connect React to the real rules of the web: accessibility, security, SSR and production.",
    "designSystem": "This advanced branch treats reusable components as public products: it protects contracts, behavior, accessibility, evolution and evidence.",
    "runtime": "This branch goes down from React to the browser: tasks, visual rendering, network and resources that can outlive what you expect.",
    "operations": "A deployed application needs evidence, safe releases and a disciplined way to respond when something fails.",
    "leadership": "The last level changes the scope: beyond solving code, you have to guide decisions, people and product outcomes."
  },
  "milestones": [
    {
      "label": "Fundamentals",
      "description": "You predict how React turns state and props into UI."
    },
    {
      "label": "State and forms",
      "description": "You choose the source of truth and model local interaction."
    },
    {
      "label": "Effects and data",
      "description": "You connect the UI to the network, cleanup, cancellation and retries."
    },
    {
      "label": "Application architecture",
      "description": "You design routes, auth, server state and component boundaries."
    },
    {
      "label": "Rendering and performance",
      "description": "You understand reconciliation and optimize based on evidence."
    },
    {
      "label": "Testing and quality",
      "description": "You test real behavior, async work and user errors."
    },
    {
      "label": "Web and production",
      "description": "You connect React to accessibility, security, SSR and deploy."
    },
    {
      "label": "Interview cases",
      "description": "You can design a dashboard, login and checkout starting from the UI flow."
    },
    {
      "label": "Design system",
      "description": "You design public components with contracts and evidence."
    },
    {
      "label": "Browser and runtime",
      "description": "You diagnose scheduling, pixels, network, memory and connectivity."
    },
    {
      "label": "Frontend system design",
      "description": "You turn ambiguous requirements into boundaries and migrations."
    },
    {
      "label": "Production and reliability",
      "description": "You deploy, observe and respond to incidents in a controlled way."
    },
    {
      "label": "Advanced security",
      "description": "You model threats, identity and defense in depth."
    },
    {
      "label": "Quality strategy",
      "description": "You design a reliable suite based on real risks."
    },
    {
      "label": "Product and experience",
      "description": "You connect UX, content, metrics and performance."
    },
    {
      "label": "Technical leadership",
      "description": "You scale decisions, ownership and team growth."
    }
  ],
  "seniorityBands": [
    {
      "label": "Professional React",
      "description": "Mental model, state, async, rendering and testing to ship features autonomously.",
      "stage": "LEVEL I"
    },
    {
      "label": "Senior frontend",
      "description": "Architecture, browser, production, security and product under real constraints.",
      "stage": "LEVEL II"
    },
    {
      "label": "Senior Design Systems",
      "description": "Public contracts, platform, accessibility and evolution of a shared library.",
      "stage": "SPECIALIZATION"
    },
    {
      "label": "Frontend Lead",
      "description": "Technical direction, decisions, mentoring, delegation and alignment with stakeholders.",
      "stage": "LEVEL III"
    }
  ],
  "interviewQuestions": [
    {
      "title": "What is React and what are its main characteristics?"
    },
    {
      "title": "What is JSX and how is it transformed?"
    },
    {
      "title": "What is the Virtual DOM metaphor trying to express?"
    },
    {
      "title": "How does the virtual tree work and what are its costs?"
    },
    {
      "title": "What is the difference between a React node, element and component?"
    },
    {
      "title": "What are Fragments for?"
    },
    {
      "title": "What is the purpose of key?"
    },
    {
      "title": "What goes wrong when you use the index as key?"
    },
    {
      "title": "How do props and state differ?"
    },
    {
      "title": "How do class and function components differ?"
    },
    {
      "title": "When would you keep or write a class?"
    },
    {
      "title": "What is React Fiber, at the level that is useful for an interview?"
    },
    {
      "title": "What is reconciliation?"
    },
    {
      "title": "How do Shadow DOM and the React tree differ?"
    },
    {
      "title": "What is the difference between controlled and uncontrolled components?"
    },
    {
      "title": "How and why do you lift state up?"
    },
    {
      "title": "What were Pure Components and what is their modern equivalent?"
    },
    {
      "title": "What is the difference between createElement and cloneElement?"
    },
    {
      "title": "What role did PropTypes play and what changed in React 19?"
    },
    {
      "title": "What does it mean for a component to be stateless?"
    },
    {
      "title": "What does it mean for a component to be stateful?"
    },
    {
      "title": "How do you type props today?"
    },
    {
      "title": "Why does React discourage mutating state?"
    },
    {
      "title": "What do Hooks bring to the table?"
    },
    {
      "title": "What are the Rules of Hooks and why do they exist?"
    },
    {
      "title": "How do useEffect and useLayoutEffect differ?"
    },
    {
      "title": "What does the dependency array actually control?"
    },
    {
      "title": "When is useRef the right choice?"
    },
    {
      "title": "What is the updater form of setState or a setter for?"
    },
    {
      "title": "When does useCallback make sense?"
    },
    {
      "title": "When does useMemo make sense?"
    },
    {
      "title": "When should you choose useReducer?"
    },
    {
      "title": "What is useId for, and what is it not for?"
    },
    {
      "title": "How do you design a custom Hook?"
    },
    {
      "title": "What does it mean for a component to re-render?"
    },
    {
      "title": "What was forwardRef used for and what changes in React 19?"
    },
    {
      "title": "Which errors does an Error Boundary catch?"
    },
    {
      "title": "What does Suspense coordinate?"
    },
    {
      "title": "What is hydration?"
    },
    {
      "title": "What is a Portal for?"
    },
    {
      "title": "What does Strict Mode check?"
    },
    {
      "title": "How does code splitting work?"
    },
    {
      "title": "How do you reduce renders caused by Context?"
    },
    {
      "title": "What is the Flux pattern?"
    },
    {
      "title": "What does unidirectional data flow mean?"
    },
    {
      "title": "What costs and bugs does Context introduce?"
    },
    {
      "title": "What are common anti-patterns in React?"
    },
    {
      "title": "How do you choose between local state, Context and an external store?"
    },
    {
      "title": "What happens when you call a state setter?"
    },
    {
      "title": "What is prop drilling and when is it a problem?"
    },
    {
      "title": "How do you implement lazy loading?"
    },
    {
      "title": "How do React events and native events work?"
    },
    {
      "title": "How does the class lifecycle map to the modern model?"
    },
    {
      "title": "What concurrent capabilities does React offer?"
    },
    {
      "title": "How does React prioritize different updates?"
    },
    {
      "title": "How do you avoid blocking the UI with expensive work?"
    },
    {
      "title": "What does SSR bring?"
    },
    {
      "title": "What does static generation bring?"
    },
    {
      "title": "What is a Higher-Order Component?"
    },
    {
      "title": "What is container/presentational trying to separate?"
    },
    {
      "title": "What is a render prop?"
    },
    {
      "title": "How does composition work in React?"
    },
    {
      "title": "How do you respond to browser or container resizing?"
    },
    {
      "title": "How do you load async data without losing intermediate states?"
    },
    {
      "title": "What failures are common when doing data fetching?"
    },
    {
      "title": "What problem does React Router solve?"
    },
    {
      "title": "How do dynamic routes and params work?"
    },
    {
      "title": "How do nested routes and Outlet work?"
    },
    {
      "title": "When should you use BrowserRouter or HashRouter?"
    },
    {
      "title": "What is the difference between a router and a history API?"
    },
    {
      "title": "What modes and routers does React Router offer?"
    },
    {
      "title": "What is the practical difference between push and replace?"
    },
    {
      "title": "How do you navigate programmatically?"
    },
    {
      "title": "How do you design a private route without confusing it with authorization?"
    },
    {
      "title": "How do you represent the active route?"
    },
    {
      "title": "How do you handle a route that is not found?"
    },
    {
      "title": "How do you read and write search params?"
    },
    {
      "title": "How do you redirect after login without breaking Back or creating open redirects?"
    },
    {
      "title": "How do you provide data or dependencies to a route?"
    },
    {
      "title": "How do you localize a React application?"
    },
    {
      "title": "What problem does React Intl solve?"
    },
    {
      "title": "What are the main capabilities React Intl offers?"
    },
    {
      "title": "What is the difference between components and the imperative formatting API?"
    },
    {
      "title": "How do you use a localized message as an accessible placeholder?"
    },
    {
      "title": "How do you access the current locale?"
    },
    {
      "title": "How do you format dates correctly?"
    },
    {
      "title": "How do you structure a React testing strategy?"
    },
    {
      "title": "What role does Jest or Vitest play?"
    },
    {
      "title": "What is the philosophy behind React Testing Library?"
    },
    {
      "title": "How do you test a component through its behavior?"
    },
    {
      "title": "How do you test async work?"
    },
    {
      "title": "How do you mock or intercept requests?"
    },
    {
      "title": "How do you test a Hook used by a component?"
    },
    {
      "title": "When should you test a custom Hook with renderHook?"
    },
    {
      "title": "What was shallow rendering and why is it discouraged?"
    },
    {
      "title": "When does a snapshot help and when does it get in the way?"
    },
    {
      "title": "How do you test a component that consumes Context?"
    },
    {
      "title": "How do you test one connected to Redux or another store?"
    },
    {
      "title": "What is the difference between shallow rendering and DOM rendering?"
    },
    {
      "title": "What was react-test-renderer and what changed in React 19?"
    },
    {
      "title": "What were the major new features in React 19?"
    },
    {
      "title": "What does Action mean in React?"
    },
    {
      "title": "What state does useActionState coordinate?"
    },
    {
      "title": "How does useOptimistic work?"
    },
    {
      "title": "How does use(Promise or Context) work and how does it differ from fetching in an Effect?"
    },
    {
      "title": "What is a Server Component?"
    },
    {
      "title": "Where is the boundary between Server and Client Components?"
    },
    {
      "title": "What does React Compiler do and what does it not fix?"
    },
    {
      "title": "How do useTransition and useDeferredValue differ?"
    },
    {
      "title": "How does a function as a form action work?"
    }
  ]
};
