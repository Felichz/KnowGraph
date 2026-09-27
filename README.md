# KnowGraph

**[Live demo](https://know-graph.vercel.app/react)** · [Source](https://github.com/Felichz/KnowGraph)

An interactive study workspace that turns a broad technical curriculum into a navigable knowledge graph of concepts, dependencies, milestones and guided study sessions. It was born as a personal preparation map for senior React and Rails interviews: study one concept at a time, understand why it matters, review real code, explore dependency relations, and prove comprehension before moving on.

## Highlights

- **Curriculum knowledge graphs** — React (101 nodes, 212 dependency edges) and Rails maps, each with its own categories, milestones, suggested routes and seniority bands.
- **Four-stage study sessions** — *Read* (mental model, naive-vs-senior code comparison, pitfalls, sources), *Mentor* (Socratic AI tutor), *Paraphrase* (active recall in your own words, with voice dictation and concept chunking) and *Evaluate* (AI calibration on a 0–120 scale with a four-dimension rubric).
- **Non-blocking AI work** — evaluations keep streaming in the background while you keep studying; a global HUD reports progress, lets you jump back to the card or cancel.
- **Bring your own key (BYOK)** — MiniMax by default, plus any OpenAI-compatible provider (OpenRouter, OpenAI, Groq, Ollama…). Keys never reach the browser bundle in the hosted deployment; a local gateway proxies all AI traffic.
- **Active recall deck** — flashcards generated from every concept and its interview questions, flippable and filterable by mastery.
- **Progress & seniority** — per-concept mastery scores, seniority bands and curriculum milestones with live percentages.
- **Local-first** — progress, drafts and attempt history live in your browser (`localStorage` + IndexedDB); export/import a full JSON backup anytime.
- **Assistive reading** — native `SpeechSynthesis` narration per study section, and voice dictation via `SpeechRecognition`.
- **Mobile ergonomics** — thumb-reach bottom dock, safe-area aware, 44px touch targets.
- **Desktop app** — the same React app packaged with Electron, which manages the local gateway lifecycle.

## Stack

- React 19 + Vite 6, plain ES modules, no TypeScript
- Hand-rolled CSS design system (v3 "Estudio nocturno" — warm graphite, paper, one accent) built from sealed design tokens
- SVG-only graph rendering (topological DAG with pan & zoom) — no D3
- Mermaid (lazy-loaded) for conceptual diagrams, Prism for code, DOMPurify for rendered HTML
- `localStorage` for map progress; `idb` for paraphrase attempts and drafts
- Local Node gateway (`server/`) with Zod runtime validation and SSE streaming
- Electron as an optional desktop runtime
- Playwright end-to-end suite + headless logic test suite

## Getting started

Requirements: a Node.js version compatible with Vite 6, npm, and a modern browser.

```bash
npm install
```

For the AI features (mentor chat, paraphrase evaluation), also install and run the local gateway:

```bash
cd server
npm install
cp .env.example .env   # then fill in FREELLMAPI_API_KEY / MINIMAX_API_KEY
npm start
```

The gateway listens on `http://127.0.0.1:4317` and exposes `/api/ai/*`. It tries MiniMax first and falls back to FreeLLMAPI. Keep it private; the Vite dev server already proxies those routes.

Then, back in the repo root:

```bash
npm run dev
```

The app is served at `http://localhost:5173`. The dev server binds `0.0.0.0`, so you can also open it from another device on your LAN.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server on all interfaces. |
| `npm run build` | Produce the production build in `dist/`. |
| `npm run preview` | Serve the built app locally. |
| `npm run test:logic` | Run the headless domain test suite. |
| `npm run test:e2e` | Run the Playwright end-to-end suite. |
| `npm run audit:react` | Validate the React graph's content and structure. |
| `npm run check` | Content audit + production build. |
| `npm run desktop:dev` | Open the app in Electron, managing the local gateway. |
| `npm run desktop:pack` | Build an unpacked desktop bundle for verification. |
| `npm run desktop:dist` | Build the Windows installer. |

## Architecture

The codebase separates a **headless domain core** from the **presentation layer**, by constitutional rule (`AGENTS.md`, ADR 0005, ADR 0008):

- `src/logic/` — the headless learning controller (an external store consumed via `useSyncExternalStore`), selectors, topological layout, seniority progress.
- `src/ai/` — AI client (SSE streaming), background task manager (multi-tab sync via `BroadcastChannel`), BYOK provider settings, IndexedDB stores, JSON backup.
- `src/ui/` — the v3 presentation layer: shell, map and graph views, the four-stage study flow, flashcards, progress, settings, command palette, task HUD, primitives and theme. Every source file is limited to **≤ 150 lines** (ADR 0008).
- Content lives in code as composable layers (`src/reactGraph.js` plus audit notes, deep dives, interview questions, milestones and sources; `src/lessons.js` + `src/logic/railsGraph.js` for Rails).
- `server/ai/` — provider registry, prompts, Zod schemas and streaming parser for the local gateway.

### Concept node model

```js
{
  id: "hooks_rules",
  label: "Hooks and rules of use",
  cat: "state",
  priority: 12,
  prerequisites: ["state_updates"],
  lesson: {
    summary: "...",
    why: "...",
    explanation: "...",
    code: "...",
    steps: ["..."],
    pitfalls: ["..."],
    takeaway: "...",
    sources: [{ label: "...", href: "https://..." }],
    audit: { primer: "...", example: "...", failureModes: ["..."] }
  }
}
```

Dependencies are expressed as `prerequisites`: `A -> B` means A provides the mental model needed to understand B — it never blocks studying or completing B out of order.

### Adding or changing content

**React nodes**: add the base node and prerequisites in `src/reactGraph.js`, extend the thematic layer that owns the content, add sources in `src/reactSources.js`, interview questions in `src/reactInterviewQuestions.js` when relevant, then run `npm run check`. The audit fails if explanations, code, pitfalls, HTTPS sources, valid dependencies or well-formed quiz options are missing.

**Rails nodes**: add content in `src/lessons.js` and register the node in `src/logic/railsGraph.js`.

## Spec-driven design workflow

This repository develops UI through a formal, agent-oriented pipeline — no UI code exists until a design blueprint is sealed:

1. **Product spec** — `specs/<feature>/spec.md` defines user stories and acceptance criteria (currently `specs/002-workspace-ui-v3/`).
2. **Design engineering** — `docs/VISUAL_WORKFLOW.md` governs a 4-phase adversarial convergence loop that produces `DESIGN.md` (visual foundations, v3 "Estudio nocturno") and `specs/<feature>/design-spec.md` (an exhaustive UI blueprint).
3. **Implementation** — the presentation layer is built strictly against the sealed blueprint and verified by the Playwright suite.

Architecture decisions are recorded in `docs/adr/`. The working constitution for AI agents lives in `AGENTS.md`.

## Design documentation

- [DESIGN.md](DESIGN.md) — visual foundations and design tokens (v3)
- [LLM integration plan: paraphrase, tutoring and flashcards](docs/LLM_LEARNING_EXPERIENCE_PLAN.md)
- [Headless API & presentation handoff guide](docs/PRESENTATION_HANDOFF_GUIDE.md)
- [Desktop app with Electron](docs/DESKTOP_APP.md)
- [Public deploy on Vercel with a BYOK gateway](docs/DEPLOY_VERCEL.md)
- [UI/UX system](docs/UI_UX_SYSTEM.md) · [Visual QA checklist](docs/VISUAL_QA_CHECKLIST.md)

## Deployment

The frontend is deployed publicly on Vercel (the demo at the top). The AI gateway is BYOK: either run it locally, or deploy the streaming gateway separately following [the deploy guide](docs/DEPLOY_VERCEL.md). No keys are bundled into the frontend.

## Project status

Local-first personal tool. Progress is stored in the browser — clearing site storage resets local advancement. Card content lives in source code, so publishing content changes means editing the content layers and rebuilding.

The application UI language is currently Spanish.
