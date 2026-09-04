# ADR 0005 — Headless State Machine and UI Sync via `useSyncExternalStore`

- Status: **Accepted**
- Date: 2026-09-04
- Deciders: Learning Workspace Core

## Context

In the legacy prototype, application state was concentrated almost entirely within `legacy/App.jsx`, exceeding 2,600 lines of code. This introduced critical architectural liabilities:
1. **Cascading Re-renders**: Minor state shifts (such as typing in an input or audio playback progress) triggered cascading re-renders across the entire graph canvas.
2. **Headless Test Impossibility**: Curriculum recommendation logic, category filtering, and node progression could not be tested without mounting React and simulating DOM lifecycles.
3. **High Framework Coupling**: Interview business logic was entangled with React lifecycle hooks (`useEffect`, `useState`, `useCallback`).

For the V2 architecture, traditional solutions like **Redux Toolkit**, **Zustand**, and **React Context API** were evaluated.

## Decision

We chose to implement an autonomous **Headless Domain Controller in Vanilla JavaScript** (`createLearningController`) that is 100% framework-agnostic, integrating into React 19 through the official **`useSyncExternalStore`** API.

### 1. Pure Vanilla JS Core (`src/logic/learningController.js`)
* The controller exposes an explicit Store interface: `subscribe(listener)`, `getSnapshot()`, and action dispatchers (`setGraph`, `selectNode`, `setGroups`, `saveAttempt`, `updateDraft`).
* Selectors (`getSuggestedNextNode`, `getProgressMap`, `getVisibleNodes`, `getSeniorityProgress`) are pure functions operating on immutable snapshots.
* Zero imports of `react`, `react-dom`, or browser window globals in core logic; executes directly in headless Node.js runtimes.

### 2. Idiomatic React 19 Integration (`src/hooks/useController.js`)
* Instead of wrapping the application in Context providers (which cause unnecessary re-renders in subtrees), `useSyncExternalStore` binds state directly:
```javascript
const snapshot = useSyncExternalStore(
  controller.subscribe,
  controller.getSnapshot,
  controller.getSnapshot // SSR / initial hydration snapshot
);
```
* React ensures concurrent rendering consistency without visual tearing during transitions.

### 3. Pure Presentation View Shells
* Components in `src/components/` operate as pure view shells receiving primitives and callbacks, effortlessly remaining under 140 lines per file.

## Consequences

### Positive
* **Fast Test Execution**: Domain logic test suites (`tests/logic/*.mjs`) execute in pure Node.js in under 1 second without JSDOM overhead.
* **Decoupled Components**: Presentation components are cleanly separated, satisfying the constitutional 150-line rule.
* **Zero Dependencies**: Avoids bundling external state management libraries (`redux`, `zustand`, `mobx`), maintaining a lean bundle size.

### Accepted Costs and Limitations
* **Manual Snapshot Immutability**: Controller mutations must update cached immutable snapshots cleanly so `Object.is(prev, next)` satisfies `useSyncExternalStore` referential equality constraints.
