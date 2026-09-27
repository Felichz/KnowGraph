# Handoff guide: Learning Graph Logic API

## Purpose

This project separates the learning system from its visual representation. The logic layer contains the graph catalog, navigation rules, progress, drafts, attempts, scoring, AI evaluation, streaming, audio, and persistence. The presentation layer decides how everything looks: layout, components, CSS, animations, transitions, visual accessibility, and UI event handlers.

The original visual presentation was restored in `src/App.jsx` and `src/components/`. The headless core remains available for future iterations or an alternative presentation: the current entrypoint mounts the original UI and can also expose the controller from a separate integration.

## Layer boundary

```text
Datos de contenido + adapters externos
  src/lessons.js, src/reactGraph.js, src/ai/*, src/ttsSegments.js
                         ↓
Lógica headless pública
  src/logic/graphRegistry.js
  src/logic/selectors.js
  src/logic/learningController.js
  src/logic/index.js
                         ↓
Presentación reemplazable
  React, CSS, canvas, SVG, mobile, etc.
```

The logic must not import JSX, CSS, `ReactDOM`, Mermaid, D3, or layout APIs. The presentation must not recalculate scores, query IndexedDB directly, call the AI gateway directly, or duplicate navigation rules.

## Public API

```js
import { createLearningController, getGraph, listGraphs } from "./logic/index.js";

const controller = createLearningController({ graphId: "react" });
const unsubscribe = controller.subscribe((snapshot) => {
  // La vista renderiza exclusivamente este snapshot.
});

await controller.hydrate();
```

### Catalog

- `listGraphs()` returns the available graphs without exposing internal search indexes.
- `getGraph(graphId)` returns the normalized catalog for controller use; it may include internal `Map`/`Set` indexes that the presentation does not need to touch.
- Each graph contains `id`, `label`, `title`, `subtitle`, `categories`, `nodes`, `edges`, `milestones`, and `seniorityBands`.
- Each node contains `id`, `label`, `cat`, `lesson`, `priority`, and `prerequisites`.

Prerequisites are pedagogical information and suggested navigation. They do not block completing or opening a node.

### Controller

`createLearningController` returns a stable object with these operations:

| Operation | Responsibility |
| --- | --- |
| `getSnapshot()` | Reads current state and all derived view models. |
| `subscribe(listener)` | Subscribes a presentation to changes; returns cleanup. |
| `hydrate()` | Loads attempts and drafts from the persistence adapter. |
| `setGraph(graphId)` | Switches topic and rehydrates its data. |
| `selectNode(nodeId, options)` | Selects and optionally opens the detail. |
| `closeNode()` | Closes the detail without clearing the selection. |
| `setViewMode("graph" \| "flashcards")` | Switches the main projection. |
| `setGroups(ids)` | Replaces the group filter. An empty list means all. |
| `toggleGroup(id)` | Adds or removes a group without forcing the others to be deselected. |
| `selectOnlyGroup(id)` | Shortcut to focus one group. `null` returns to all. |
| `navigate(direction)` | Moves to the previous or next node within the active filter. |
| `navigateToSuggested()` | Selects the best next visible node. |
| `updateDraft(nodeId, text)` | Updates the draft and persists it. |
| `submitParaphrase(nodeId, answer)` | Runs the streaming evaluation and saves the finished attempt. |
| `cancelEvaluation()` | Cancels the active request and clears transient state. |
| `selectAttempt(nodeId, index)` | Switches the displayed attempt. |
| `getNode(nodeId)` | Returns the view model for a single node. |
| `destroy()` | Cancels pending work and removes listeners. |

### Snapshot

The snapshot is the source of truth for the presentation. Its main parts are:

```js
{
  graphId,
  graph,
  viewMode,
  selectedGroupIds,
  selectedNodeId,
  modalNodeId,
  hydrated,
  error,
  selectedNode,
  visibleNodes,
  suggestedNextNode,
  graphView: { nodes, edges, progress },
  flashcards,
  progressMap,
  attemptsByNode,
  draftsByNode,
  activeEvaluation,
}
```

`selectedNode`, `graphView.nodes`, and `flashcards` already include `progress`, `draft`, and `narrationSegments`. The presentation does not need to query the database again or rebuild that data.

## Progress and score

The score has two distinct meanings:

- `coveragePercent` represents conceptual coverage of the card, from 0 to 100.
- `displayScore` represents coverage plus optional depth, from 0 to 120.

A node is considered complete when coverage reaches 100. Points 101–120 are optional excellence and never block navigation.

`getNodeProgress` exposes:

```js
{
  latestAttempt,
  attemptCount,
  score,
  completion,
  isComplete,
}
```

The `score` is already normalized by `src/ai/types.js`; it must not be reinterpreted visually in another layer.

## Streaming evaluation

`activeEvaluation` represents only the transient work:

```js
{
  status: "running",
  nodeId,
  startedAt,
  chars,
  sections,
  blocks,
}
```

Score blocks arrive first with ids like:

```text
scoreSummary.rubric.accuracy.score
scoreSummary.rubric.accuracy.max
scoreSummary.rubric.completeness.score
...
```

Texts arrive later with ids like:

```text
feedback.rubricNotes.accuracy
feedback.strengths[0]
feedback.gaps[0].explanation
feedback.conciseVerdict
```

The UI should show block skeletons, individual bars as soon as they are available, and a derived provisional score once subscores can be computed. On the final event, the gateway validates the JSON, normalizes the format, and computes the definitive score.

The presentation must not persist a partial result as a finished attempt. Only `submitParaphrase` saves, when it receives `done` with a valid evaluation.

## Persistence and adapters

The controller uses IndexedDB through `src/ai/learningStore.js`. For tests or a future local database, adapters can be injected:

```js
createLearningController({
  graphId: "react",
  storage: {
    listAllAttempts,
    listAttempts,
    saveAttempt,
    getDraft,
    setDraft,
    deleteDraft,
  },
  ai: {
    evaluateParaphraseStream,
    isCancel,
  },
});
```

The view must not know about IndexedDB, storage keys, or `AbortController` details.

## Rules the presentation must follow

1. Do not block a node by prerequisites.
2. Do not show 101–120 as if it were required coverage.
3. Do not replace the latest attempt with the best attempt without indicating it.
4. Do not lose a draft when closing or switching nodes.
5. Do not start two simultaneous evaluations from the same controller.
6. Do not save an incomplete stream as a valid evaluation.
7. Do not send the API key to the browser; the client only calls `/api/ai`.
8. Do not make visible group names part of the scoring logic.
9. Keep a clear way to return from the detail to the previous node.
10. Make visible when a score is provisional and when it has been confirmed.

## Brief for the design-specialist LLM

Design a learning experience for a graph of technical concepts. The graph is the main view; a node's detail is a deep study surface; flashcards is an alternative view. Visible states must exist for: initial loading, active group, suggested node, complete node, node with extra depth, draft, streaming evaluation, recoverable error, attempt history, and previous/next navigation.

Use the controller as the single source of truth. The presentation can turn click, keyboard, drag, hover, or shortcut events into controller calls, but it must not mutate the snapshot or invent rules. If a visual decision needs new data, add a selector or a field to the logic contract; do not read storage or AI modules directly from a component.

### Specific instructions for Kimi K3

Kimi K3 is responsible for two tasks: thinking through the complete visual experience and then implementing it in React. It must first read this document, `README.md`, `src/logic/index.js`, `src/logic/learningController.js`, `src/logic/selectors.js`, and the graphs before writing components.

The visual goal is not to show a generic dashboard. It is to communicate a living learning route and make the user understand at all times:

1. which concept they are studying;
2. which concept is recommended next and why;
3. which part of their understanding is already covered;
4. what feedback is arriving while their answer is being evaluated;
5. what sufficient coverage to complete the node is;
6. what optional and exceptional depth is.

The score must have two clearly distinct visual readings:

- `0–100`: conceptual coverage. Reaching 100 means the answer covered the card's required surface and the node can be considered complete.
- `101–120`: optional excellence. It must not look like a mandatory continuation of the normal bar. It should feel like a special zone —for example, with a gold treatment, a subtle glow, or a contained celebratory transition— that communicates additional depth without creating anxiety about not reaching it.

The streaming evaluation must be designed as a progressive transition, not a block that appears all at once. The UI must be able to show skeletons immediately, reveal each rubric's bars first when their scores arrive, derive a clearly labeled provisional score, and fill in the textual explanations afterwards. The provisional state must never be confused with a confirmed attempt.

The presentation can freely implement layout, typography, color, animations, canvas/SVG, responsive design, microinteractions, tooltips, accessibility, and audio controls. It cannot change the scoring rules, declare a node complete on its own, block by prerequisites, or call IndexedDB or the gateway directly.

Before implementing, Kimi must produce a short proposal describing:

- visual hierarchy of the main screen;
- treatment of groups and filters;
- visual states for pending, suggested, active, complete, and excellent nodes;
- transition between graph, detail, and flashcards;
- evaluation flow from draft to confirmed feedback;
- responsive behavior for desktop and mobile;
- accessibility and reduced-motion strategy.

It must then implement that proposal consuming only the controller and the snapshot. If it detects that information is missing to represent an important state, it must flag the gap and propose a small contract extension before duplicating logic in the UI.

## Validation

The minimum commands are:

```bash
npm run test:logic
node server/tests/test-parse.mjs
npm run build
npm run audit:react
```

The current build validates the original presentation and the headless core. The guide still works as a contract for any future redesign, but the active UI is not yet obligated to consume the controller.
