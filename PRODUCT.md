# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is a web developer with hands-on experience preparing for senior or tech lead interviews, especially in React and Rails. The product was born from Félix's personal workflow and must be able to serve other developers with a similar level and similar need afterwards.

## Product Purpose

Learning Workspace turns broad, scattered interview preparation into an active study route. It lets you recover and consolidate a mental model of technical concepts, practice explaining them in your own words, and walk into architecture, implementation, and trade-off conversations with confidence.

Success is not just "reading" a card: it is being able to explain the concept with sufficient coverage, detect what is missing, and move forward with an understandable mastery signal.

## Positioning

The product combines an explicit graph of conceptual dependencies with iterative paraphrase-based coaching. Each node defines the conceptual surface that needs to be covered; an LLM evaluator provides prioritized feedback, a score, and next steps, without turning prerequisites into hard blockers.

The 100/120 threshold represents complete coverage of the essential material. The 101–120 range represents optional depth or excellence: it is an opportunity to go further, not a requirement to continue.

## Operating Context

The person studies in sessions, usually close to an interview or while refreshing accumulated professional experience. They alternate between a concept map, didactic cards, written practice with a coach, full evaluations, attempt history, and flashcards.

The product includes two main maps: React for senior/tech lead frontend interviews and Rails for fullstack/backend interviews. It can grow to include other learning domains.

## Capabilities and Constraints

- Independent graphs with nodes, categories, dependencies, priorities, milestones, and suggested routes.
- Self-contained cards with explanation, examples, code, steps, trade-offs, common mistakes, diagrams, and sources.
- Local progress per graph; dependencies guide learning but do not block completing a node.
- LLM coaching and evaluation through a local gateway: MiniMax is the primary provider and FreeLLMAPI works as fallback.
- Local persistence of drafts and attempts in IndexedDB and of map progress in local storage.
- Flashcards with the user's evaluated paraphrase and its representative score.
- Read-aloud via the system's SpeechSynthesis.
- The experience must work on the web and as an Electron desktop application; the desktop runtime keeps the same React app, starts the local gateway when needed, and does not bundle keys.
- It is a local-first application. It must not expose keys or the AI gateway to the browser, nor assume its own account or remote backend.

## Brand Commitments

The product name is Learning Workspace. The voice must be direct, didactic, and technically precise: it treats the user as a capable developer, avoids empty simplifications, and explains the why, the limits, and the trade-offs when they add understanding.

The interface is a tool for sustained work and learning, not a marketing experience or a superficial quiz. The excellence score should feel special, but full coverage must communicate an achievable and sufficient goal.

## Evidence on Hand

- The graphs, cards, questions, sources, relationships, and study content live in `src/`.
- The React audit validates content and relationships with `npm run audit:react`.
- The LLM gateway, its prompts, validation, and streaming live in `server/`.
- The desktop app technical guide is in `docs/DESKTOP_APP.md`.
- The LLM experience plan is in `docs/LLM_LEARNING_EXPERIENCE_PLAN.md`.
- There is no external user research, public metrics, testimonials, or commercial claims that need to be invented.

## Product Principles

1. Learn in conceptual order without losing autonomy over where to start.
2. Make visible what is missing in order to explain it, not just whether an answer looks correct.
3. Favor active practice, iteration, and memory retrieval over passive consumption.
4. Distinguish required coverage from optional depth to avoid perfectionism that stalls progress.
5. Keep control and learning data local while integrating AI safely.

## Accessibility & Inclusion

The interface must be legible in long sessions, usable with the keyboard, and compatible with screen readers. Navigation, evaluation, streaming, and read-aloud controls must communicate their state without relying solely on color or animations. The desktop version does not replace the accessibility foundations of the web version.
