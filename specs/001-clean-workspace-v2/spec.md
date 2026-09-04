# Feature Specification: Clean Learning Workspace V2

**Feature Branch**: `001-clean-workspace-v2`  
**Created**: 2026-09-03  
**Status**: Ready for Implementation  
**Input**: User description: "Rebuild the UI and architecture of Learning Workspace cleanly, separating headless domain logic from presentation, following Spec-Driven Development with GitHub Spec Kit, and preserving all interaction and pedagogical gems validated in the prototype."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Topological Navigation, Graph, Routing, Seniority Bands & Visual Topologies (Priority: P1) 🎯 MVP

As a software engineer preparing for senior technical interviews,  
I want to visualize the knowledge graph organized by categories, prerequisites, milestones, seniority bands, and alternative visual layouts (Grid, Topology DAG with Pan & Zoom), with bidirectional URL routing,  
So that I understand my genuine progression toward Senior/Staff roles and navigate the curriculum efficiently based on my spatial preference.

**Why this priority**: Core value proposition. Without topological structure, dependency visualization, and URL routing, the application lacks curricular grounding.

**Independent Test**: Mount the app, switch between React and Rails graphs, verify category and node loading, test direct URL routing (`/:graph/card/:id`) and `popstate`, open the Seniority progress drawer, and verify calculated completion percentages.

**Acceptance Scenarios**:

1. **Given** the user launches the application,  
   **When** the main canvas mounts,  
   **Then** the active graph renders with nodes, category tokens, total progress counters, and the "Next Challenge" strip.
2. **Given** the user viewing the React graph,  
   **When** they click the "Rails" graph switcher button,  
   **Then** the canvas immediately transitions to the Rails curriculum, updating categories, nodes, and local storage state.
3. **Given** all categories displayed,  
   **When** the user clicks a specific category chip,  
   **Then** the canvas filters nodes to that category and the "Next Challenge" strip recalculates the recommended next node within that focus.
4. **Given** the user pressing `Ctrl+K`,  
   **When** the Command Palette opens and queries a concept or action,  
   **Then** the list filters in real time, allowing direct node navigation and quick global actions (*📇 Flashcards*, *📊 Seniority*, *⚙️ BYOK Settings*).
5. **Given** direct navigation to `/:graph/card/:nodeId` or browser Back/Forward navigation (`popstate`),  
   **When** the route updates,  
   **Then** the target study card opens or closes automatically, synchronizing history without full page reload.
6. **Given** the user clicking the progress button in the header,  
   **When** the Seniority & Milestones drawer opens,  
   **Then** Seniority Bands (*React Professional, Senior Frontend, Staff/Lead, Design Systems*) display completed competencies, and Milestone cards show descriptions, progress bars, and completion badges.
7. **Given** topological recommendation calculations,  
   **When** the curriculum is evaluated,  
   **Then** the orientation engine classifies recommendations across 3 priority levels.
8. **Given** the graph canvas,  
   **When** the user drags or scrolls with pointer/mouse wheel,  
   **Then** the `usePanZoom` hook applies smooth translation and cursor-centered zoom, ignoring drag thresholds under 5px to avoid cancelling node click events.
9. **Given** the visual layout selector,  
   **When** the user switches between Grid and SVG Topology,  
   **Then** the canvas adapts the layout (Sugiyama-style DAG layered columns and directed marker arrows) respecting mastery states.

---

### User Story 2 - 4-Stage Guided Study Route with Rich Interactions (Priority: P2)

As a technical learner,  
I want clicking any node to open a 4-stage study modal (*01 Read*, *02 Learn*, *03 Paraphrase*, *04 Evaluate*), featuring oral voice dictation, contextual deep dives, unlockable FAANG interview questions, historical time-travel, Zen mode, Socratic mentor chips, and cognitive chunking breakdown,  
So that I internalize concepts, test my oral delivery, and calibrate my technical depth against senior industry hiring bars.

**Why this priority**: Pedagogical heart of the product. Combines active recall, speech-to-text interview rehearsals, and analytical rubrics with historical traceability.

**Independent Test**: Open any node, navigate all 4 tabs, test comparative code view, verify scrollTop resets to 0 across tabs, expand FAANG questions, and browse historical attempts.

**Acceptance Scenarios**:

1. **Given** a selected node in the graph,  
   **When** the user clicks the node or presses `Enter`,  
   **Then** the study modal opens on tab *01 Read*, displaying the summary, architectural justification, syntax-highlighted code comparison, and trade-offs.
2. **Given** tab *01 Read*,  
   **When** text contains advanced low-level terms defined in the deep-dive glossary,  
   **Then** discrete `?` badges render, which on click open a floating popover explaining the low-level engine mechanics without leaving the lesson.
3. **Given** tab *01 Read*,  
   **When** the "FAANG Interview Coverage" section is expanded,  
   **Then** reference interview questions appear with clear badges indicating whether each question is unlocked or blocked by uncompleted prerequisites.
4. **Given** tab *01 Read*,  
   **When** official documentation sources or related concept nodes exist,  
   **Then** external reference links with `↗` icons and direct jump buttons to related concepts render cleanly.
5. **Given** tab switching within the modal (*01* to *04*),  
   **When** a new tab is selected,  
   **Then** the scroll container automatically resets scroll position (`scrollTop = 0`).
6. **Given** navigating inside the study modal,  
   **When** the user clicks a concept in the Before → Now → After map flow,  
   **Then** the modal jumps to that prerequisite/dependent node and displays a header button: `← Back to [Previous Concept]`.
7. **Given** any stage of the study modal,  
   **When** the user clicks the "Zen Mode" toggle,  
   **Then** the modal expands to full screen, hiding distraction elements.
8. **Given** tab *02 Learn*,  
   **When** the user opens the conversation with the tutor,  
   **Then** four quick-prompt chips appear (`Why does the naive approach fail?`, `Can you explain with a visual analogy?`, `How do I diagnose this in production?`, `I have a question about the code...`), sending the inquiry on click.
9. **Given** tab *02 Learn* with an active conversation,  
   **When** the user clicks "✨ Integrate chat into my answer",  
   **Then** `reconcileParaphraseStream` synthesizes the key insights into the draft on tab *03 Paraphrase* and computes its reconciliation hash.
10. **Given** tab *03 Paraphrase*,  
    **When** the user clicks "Voice Dictation" and speaks into the microphone,  
    **Then** the native `SpeechRecognition` API transcribes speech into the editor in real time and auto-saves to local storage.
11. **Given** tab *03 Paraphrase*,  
    **When** the user toggles between `✏️ Editor` and `📖 Reading Chunks`,  
    **Then** the view alternates between raw text editing and paragraph-by-paragraph chunk decomposition with lexical density statistics.
12. **Given** tab *03 Paraphrase*,  
    **When** the drafted answer contains fewer than 140 characters,  
    **Then** the character counter displays a subtle advisory notice: *"too short to measure depth"*.
13. **Given** an answer drafted on tab *03 Paraphrase*,  
    **When** the user presses `Ctrl+Enter` or clicks "Evaluate with AI",  
    **Then** tab *04 Evaluate* displays the `EvaluationLoader` with elapsed timer, thinking-model latency indicators, received character stream counter, and cancellation trigger.
14. **Given** an evaluation completed on tab *04 Evaluate*,  
    **When** final results render,  
    **Then** the concise executive verdict displays prominently, followed by the 4-dimension rubric (0–120) with golden bonus zone (101–120), expandable explanatory notes, and golden excellence aura for scores exceeding 100.
15. **Given** a node with multiple saved attempts,  
    **When** visiting tab *04 Evaluate*,  
    **Then** a time-travel pagination bar (`← Evaluation X of Y →`) allows browsing prior evaluations in read-only mode with a "Return to current" action.
16. **Given** a saved evaluation whose lesson content was modified in a later release,  
    **When** viewing the evaluation,  
    **Then** a notice informs: *"This evaluation corresponds to an earlier version of this card. Re-evaluate to measure current content."*

---

### User Story 3 - Asynchronous Background Tasks, Global HUD & Cancellation (Priority: P3)

As a candidate evaluating answers using deep-thinking AI models,  
I want to close the modal and explore other nodes while the AI processes, see a floating HUD displaying background tasks, and cancel requests anytime,  
So that my learning flow is never blocked waiting for long inference streams.

**Why this priority**: Eliminates waiting friction (5–40s), enables studying multiple concepts concurrently, and provides user agency to abort slow or stalled queries.

**Independent Test**: Initiate an evaluation, close the modal, verify the floating HUD in the bottom corner with live character counts, click "Cancel", and verify clean abort handling.

**Acceptance Scenarios**:

1. **Given** an ongoing evaluation on Card A,  
   **When** the user closes the modal and navigates the graph,  
   **Then** a floating HUD in the bottom-right corner displays active node label, streaming status, and received character count.
2. **Given** the floating HUD with active tasks,  
   **When** the user clicks the HUD,  
   **Then** an overlay list reveals active tasks with "Open card →" and "Cancel ✕" actions.
3. **Given** an evaluation in progress,  
   **When** the user clicks "Cancel" in the loader or HUD,  
   **Then** the `AbortController` triggers, cleanly aborting the SSE connection and resetting task state without console errors.
4. **Given** the evaluation progress loader,  
   **When** time elapses,  
   **Then** the component updates elapsed seconds and transitions through latency phases (*Normal* → *Slow* → *Critical*).
5. **Given** two browser tabs open in the same session,  
   **When** a task updates or completes in Tab 1,  
   **Then** Tab 2 receives the event via `BroadcastChannel` and synchronizes task state in real time.

---

### User Story 4 - Voice-Assisted Reading (Synchronized TTS) (Priority: P4)

As a candidate who learns effectively through listening or resting screen fatigue,  
I want to listen to lesson sections using the browser's native speech synthesis with synchronized visual highlights,  
So that I absorb complex architectural explanations auditorily.

**Why this priority**: Enhances accessibility and ergonomics for extended study sessions without requiring external paid TTS services.

**Independent Test**: On tab *01 Read*, click the audio button on any section, verify that speech synthesis starts, and confirm that the active paragraph pulses visually.

**Acceptance Scenarios**:

1. **Given** tab *01 Read*,  
   **When** clicking the audio button on a section,  
   **Then** browser `SpeechSynthesis` initiates playback and the active text block highlights with an animated pulse.
2. **Given** audio playing,  
   **When** the user clicks pause or selects another section,  
   **Then** previous speech stops cleanly without overlapping audio streams.

---

### User Story 5 - Private BYOK Provider Management & JSON Backup Portability (Priority: P5)

As a developer who values privacy and personal study history ownership,  
I want to configure custom API keys privately and export/import full JSON backups of my notes and progress,  
So that I retain complete sovereignty over my learning data across web and desktop environments.

**Why this priority**: Guarantees true local-first ownership and zero vendor lock-in.

**Independent Test**: In settings modal, click "Export backup" to download JSON, modify local data, click "Import backup", and verify 100% restoration of attempts, drafts, and settings.

**Acceptance Scenarios**:

1. **Given** the AI providers modal open,  
   **When** the user selects a provider and enters credentials,  
   **Then** they can run a minimal inference probe and persist configuration locally (with `safeStorage` encryption in Electron).
2. **Given** the settings modal open,  
   **When** the user clicks "Export backup",  
   **Then** a schema-validated `learning-workspace-backup-[date].json` file downloads containing all drafts, attempts, historical notes, and settings.
3. **Given** a valid backup file,  
   **When** the user clicks "Import backup" and loads the file,  
   **Then** the application validates signature and version, restores data into IndexedDB and `localStorage`, and refreshes application state.

---

### User Story 6 - Flashcards View & Active Recall (Priority: P6)

As a candidate doing rapid warm-ups before technical interviews,  
I want to switch to a 3D flip-card flashcard view with mastery level filters,  
So that I test my working memory on key architectural concepts quickly.

**Why this priority**: Complements topological curriculum exploration with an agile Anki-style active recall drill.

**Independent Test**: Switch view mode from "Graph" to "Flashcards", apply mastery filters (e.g., "Unattempted", "Base < 100"), click cards to flip between interview question and technical answer, and jump to study mode.

**Acceptance Scenarios**:

1. **Given** the main screen,  
   **When** the user switches view mode to "Flashcards",  
   **Then** the canvas is replaced by the flashcard grid showing category chips and score status.
2. **Given** a visible flashcard,  
   **When** the user clicks the card or presses space,  
   **Then** the card flips with 3D animation, revealing the key technical answer and architectural rationale.
3. **Given** a flipped flashcard,  
   **When** the user clicks "Study card →",  
   **Then** the 4-stage study modal opens for that concept on tab *01 Read*.

---

### User Story 7 - Mobile Ergonomics & Bottom Navigation (Priority: P7)

As a candidate studying on mobile or tablet during commute,  
I want a fixed bottom navigation bar for thumb-driven view switching,  
So that I have an ergonomic touch experience without losing reading area.

**Why this priority**: Facilitates studying on touch viewports without cramped top-navigation header controls.

**Independent Test**: Reduce viewport width below 768px, confirm the fixed bottom navigation bar (`mobile-bottom-nav`) appears, and test navigation between Graph, Flashcards, Progress, Search, and Settings.

**Acceptance Scenarios**:

1. **Given** a viewport narrower than 768px,  
   **When** the screen renders,  
   **Then** the fixed bottom bar (`mobile-bottom-nav`) displays with `safe-area-inset-bottom` padding and quick shortcuts (Graph, Flashcards, Progress, Search, Settings), remaining hidden on desktop viewports (> 768px).
2. **Given** the mobile bottom navigation bar,  
   **When** the user taps "Progress",  
   **Then** the Seniority & Milestones drawer opens cleanly covering the mobile screen.

---

## Edge Cases & System Invariants

1. **Zero Draft Loss**: If the user reloads or closes the window while drafting, debounced drafts in local storage restore identically upon re-opening the node.
2. **Canonical Scoring Invariant (0–120)**:
   - Full baseline curriculum mastery = exactly 100 points.
   - Points 101 to 120 = optional golden excellence bonus tier (`isExtra: true`).
3. **Modularity and Line Limit Invariant**:
   - No component or hook file in `src/` may exceed 150 lines.
   - Heavy dependencies (Mermaid, PrismJS) load dynamically (`React.lazy`).
4. **Web API Graceful Fallbacks**:
   - If `SpeechRecognition` is unsupported, voice dictation controls hide gracefully without breaking UI.
   - If `SpeechSynthesis` is unavailable, TTS playback triggers fail silently.
5. **Backup Integrity Invariant**:
   - Imported backups must validate `app === "learning-workspace"` and match expected version schemas before mutating local storage.

---

## Appendix: Domain Data Contracts & Clean-Room Reference Schemas

### 1. Canonical Node & Pedagogical Lesson Schema (`node.lesson`)

```typescript
interface LearningNode {
  id: string;                      // e.g., "state_updates", "fiber_reconciler"
  label: string;                   // e.g., "State, snapshots and batching"
  cat: string;                     // e.g., "state", "rendering", "architecture"
  priority: number;                // 1..N (curriculum order)
  prerequisites: string[];         // Required prerequisite node IDs
  lesson: PedagogicalLesson;
}

interface PedagogicalLesson {
  level: "mid" | "senior" | "staff";
  summary: string;                 // Mental model in 1-2 clear sentences
  why: string;                     // Architectural rationale
  
  // Senior Pedagogical Comparison: Naive vs Production
  codeComparison: {
    naive: {
      label: string;               // e.g., "Naive approach"
      code: string;                // Code with common anti-pattern
      whyItFails: string;          // Production failure mode under concurrency/scale
    };
    production: {
      label: string;               // e.g., "Resilient senior pattern"
      code: string;                // Idiomatic typed implementation
      tradeOff: string;            // Accepted memory, latency, or complexity trade-off
    };
  };

  steps: string[];                 // Execution phases of the concept
  pitfalls: string[];              // Silent production failure modes
  takeaway: string;                // One-line mnemonic rule for oral interviews

  // Low-level deep dive glossary
  deepDives?: Array<{
    term: string;
    trigger: string;
    definition: string;
    mentalModel: string;
  }>;

  // FAANG / GreatFrontEnd interview question bank
  interviewQuestions?: Array<{
    id: string;
    source: string;
    title: string;
    question: string;
    sampleAnswer: string;
    requiredPrereqs: string[];
  }>;

  // Official documentation references
  sources?: Array<{
    title: string;
    url: string;
    type: "official" | "spec" | "w3c" | "blog";
  }>;
}
```

### 2. Calibrated Senior/Staff Evaluation Rubric Schema (0–120 Points)

```typescript
interface EvaluationResult {
  score: number;                   // 0..120 canonical score
  isMastery: boolean;              // true if score >= 100
  isExtra: boolean;                // true if score > 100 (Excellence Bonus)
  extraPoints: number;             // 0..20 (points exceeding 100)
  conciseVerdict: string;          // One-sentence executive summary

  rubric: {
    // 1. Causality, trade-offs and failure modes at scale (35% - Primary Senior/Staff Factor)
    causalityAndTradeoffs: {
      score: number;               // 0..35
      max: 35;
      label: "Causality & Trade-offs";
      note: string;
    };

    // 2. Technical precision and domain vocabulary (30%)
    accuracy: {
      score: number;               // 0..30
      max: 30;
      label: "Technical Accuracy";
      note: string;
    };

    // 3. Practical application and production patterns (20%)
    application: {
      score: number;               // 0..20
      max: 20;
      label: "Code Application";
      note: string;
    };

    // 4. Edge-case completeness and resource lifecycles (15%)
    completeness: {
      score: number;               // 0..15
      max: 15;
      label: "Completeness";
      note: string;
    };
  };

  feedback: {
    strengths: string[];
    gaps: string[];
    misconceptions: string[];
    nextAttemptPrompt: string;
  };
}
```

### 3. Local-First Persistence Schema (IndexedDB v3)

```typescript
interface IDBSchema {
  attempts: {
    key: string;                   // id: "attempt_[timestamp]_[hash]"
    value: {
      id: string;
      graphId: "react" | "rails";
      nodeId: string;
      createdAt: string;           // ISO 8601
      score: number;               // 0..120
      evaluation: EvaluationResult;
      answerHash: string;
    };
  };

  drafts: {
    key: string;                   // "${graphId}:${nodeId}"
    value: {
      key: string;
      text: string;
      isAiGenerated: boolean;
      source: "user" | "ai" | "voice";
      updatedAt: string;
    };
  };

  coachIterations: {
    key: string;                   // id: "coach_[timestamp]_[hash]"
    value: {
      id: string;
      graphId: string;
      nodeId: string;
      createdAt: string;
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      reconciledHash?: string;
    };
  };
}
```
