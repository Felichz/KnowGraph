# Test Plan: Clean Learning Workspace V2

**Specification Reference**: [`specs/001-clean-workspace-v2/spec.md`](file:///C:/Users/felix/dev/learning/specs/001-clean-workspace-v2/spec.md)  
**Methodology Standard**: [`ADR 0009: Spec-Driven Testing & Stateless Verification Workflow`](file:///C:/Users/felix/dev/learning/docs/adr/0009-spec-driven-testing-and-stateless-verification-workflow.md)  
**Associated Skill**: [`.specify/skills/spec-driven-testing/SKILL.md`](file:///C:/Users/felix/dev/learning/.specify/skills/spec-driven-testing/SKILL.md)  

---

## 1. Executive Summary & Verification Matrix

This test plan defines the concrete, deterministic verification gates for all 7 User Stories specified in `spec.md`. In strict compliance with ADR 0009, verification is not based on ephemeral assumptions or clean-state happy paths alone. Every user story is subjected to the **Universal 4-State Matrix**, strict **Domain Boundary Contracts** (validating that headless selectors never return unrendered composite objects to presentation components), and **Branch Completeness** (ensuring both truthy and falsy visual branches are exercised).

---

## 2. User Story 1: Topological Navigation, Graph, Routing & Seniority Bands (P1)

### 2.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: `attemptsByNode = {}`, 0 completed nodes, first visit.
  - *Expected*: Default React curriculum loads, progress counter shows `0/101 (0%)`, "Next Challenge" strip recommends root node, Seniority bands display 0% progress with 0 uncaught exceptions.
  - *Target Test*: `tests/e2e/workspace.spec.js`
- [x] **State 2: Populated / Nominal**
  - *Condition*: Hydrated state with multiple evaluated attempts across React and Rails graphs (`tests/fixtures/hydrated-state.json`).
  - *Expected*: Completed nodes render numeric score badges (e.g. `85/120`, `★ 105/120`), Seniority drawer calculates and displays accurate band progress (e.g. `React Professional > 0%`), and Next Challenge suggests the highest-priority incomplete node.
  - *Target Test*: `tests/e2e/workspace.spec.js`, `tests/e2e/flashcards.spec.js`
- [x] **State 3: Boundary / Stress**
  - *Condition*: 100% curriculum completion (all nodes >= 100 score) or extreme zoom / pan coordinates (`scale: 0.1`, `scale: 3.0`).
  - *Expected*: Total progress badge reflects 100% mastery, Next Challenge displays congratulations / all-complete state, pan-zoom transform handles clamped scale boundaries without visual clipping.
  - *Target Test*: `tests/logic/topological-layout.mjs`, `tests/e2e/workspace.spec.js`
- [x] **State 4: Degraded / Error**
  - *Condition*: Unknown graph id in URL route (e.g., `/#/unknown-graph/card/node-123`) or invalid node id.
  - *Expected*: Graceful fallback to default graph (`react`) without crashing, modal does not open on nonexistent node id.
  - *Target Test*: `tests/e2e/mobile.spec.js`

### 2.2 Domain Boundary Contracts (Headless -> Presentation)
- [x] `progress.score`: Assert `typeof progress.score === "number" || progress.score === null` across all nodes (NEVER composite object).
- [x] `progress.attemptCount`: Assert `typeof progress.attemptCount === "number" && progress.attemptCount >= 0`.
- [x] `progress.isComplete`: Assert `typeof progress.isComplete === "boolean"`.
- [x] `target: tests/logic/learning-controller.mjs`

### 2.3 Conditional Branch Completeness
- [x] `GraphNode.jsx: score != null`:
  - [x] Branch TRUE: Renders `${score}/120` or `★ ${score}/120` in monospace font.
  - [x] Branch FALSE (score == null && isCompleted): Renders `✓ Listo`.
  - [x] Branch FALSE (score == null && !isCompleted): Renders `Pendiente`.
- [x] `GraphNode.jsx: isExtra (score > 100)`:
  - [x] Branch TRUE: Renders `★` prefix with golden accent styling (`var(--accent-gold)`).
  - [x] Branch FALSE: Renders regular score with cyan or green accent styling.

---

## 3. User Story 2: 4-Stage Guided Study Route with Rich Interactions (P2)

### 3.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: Node opened for the first time; draft answer is empty string `""`, 0 prior attempts.
  - *Expected*: Tab 01 (Read) renders lesson summary and code comparisons; Tab 03 (Paraphrase) editor is blank with counter showing *"too short to measure depth"*; Tab 04 (Evaluate) shows ready prompt without stale scores.
  - *Target Test*: `tests/e2e/study.spec.js`
- [x] **State 2: Populated / Nominal**
  - *Condition*: Node opened with existing draft and prior evaluation attempt in state.
  - *Expected*: Tab 03 auto-populates draft; Tab 04 displays the 4-dimension calibrated senior staff rubric (0–120) with executive verdict and specific dimension bars.
  - *Target Test*: `tests/e2e/study.spec.js`
- [x] **State 3: Boundary / Stress**
  - *Condition*: Attempt history contains >= 5 iterations (time-travel stress) and draft exceeds 3,000 characters.
  - *Expected*: Pagination bar (`← Evaluation X of Y →`) allows stepping backward/forward through historical evaluations in read-only mode; reading chunk analyzer decomposes text without lag.
  - *Target Test*: `tests/logic/reading-chunks.mjs`, `tests/e2e/study.spec.js`
- [x] **State 4: Degraded / Error**
  - *Condition*: Node missing code examples or empty rubric definitions.
  - *Expected*: Fallback notices render cleanly; evaluate stage handles empty or malformed rubric objects without throwing rendering errors.
  - *Target Test*: `tests/logic/learning-controller.mjs`

### 3.2 Domain Boundary Contracts
- [x] `rubric[dim].score`: Assert `typeof dim.score === "number" && dim.score >= 0 && dim.score <= dim.max`.
- [x] `evaluation.displayScore`: Assert `typeof evaluation.displayScore === "number" && evaluation.displayScore <= 120`.

### 3.3 Conditional Branch Completeness
- [x] `EvaluateStage.jsx: activeEval.score != null`:
  - [x] Branch TRUE: Renders score badge, dimensional sliders, and executive verdict.
  - [x] Branch FALSE: Renders empty evaluation invitation.
- [x] `AttemptHistoryBar.jsx: currentAttempt?.score != null`:
  - [x] Branch TRUE: Renders `${currentAttempt.score}/120`.
  - [x] Branch FALSE: Renders fallback attempt title.

---

## 4. User Story 3: Asynchronous Background Tasks, Global HUD & Cancellation (P3)

### 4.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: `activeTask = null`, task queue empty.
  - *Expected*: Floating HUD is completely hidden from the viewport; no background timers or listeners consume CPU.
  - *Target Test*: `tests/logic/background-tasks.mjs`
- [x] **State 2: Populated / Nominal**
  - *Condition*: Active evaluation task running in background for `react-fiber`.
  - *Expected*: Floating HUD appears in bottom-right corner showing spinning indicator, streaming character count, and active node title. Clicking HUD expands task panel.
  - *Target Test*: `tests/logic/background-tasks.mjs`
- [x] **State 3: Boundary / Stress**
  - *Condition*: Multi-tab concurrency via `BroadcastChannel` with simultaneous task events.
  - *Expected*: Tab 2 receives events from Tab 1 and synchronizes task state in real time without race conditions.
  - *Target Test*: `tests/logic/background-tasks.mjs`
- [x] **State 4: Degraded / Error**
  - *Condition*: User triggers "Cancel" or provider emits unhandled stream error.
  - *Expected*: `AbortController` cleanly aborts fetch stream; task status transitions to `cancelled` or `error`; HUD gracefully clears without uncaught rejection.
  - *Target Test*: `tests/logic/background-tasks.mjs`

### 4.2 Domain Boundary Contracts
- [x] `task.receivedChars`: Assert `typeof task.receivedChars === "number" && task.receivedChars >= 0`.
- [x] `task.status`: Assert `["pending", "streaming", "completed", "cancelled", "error"].includes(task.status)`.

---

## 5. User Story 4: Voice-Assisted Reading (Synchronized TTS) (P4)

### 5.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: Audio playback idle, `activeSegmentIndex = -1`.
  - *Expected*: Audio play button visible on lesson paragraphs; no animation or border pulse active.
  - *Target Test*: `tests/logic/reading-chunks.mjs`
- [x] **State 2: Populated / Nominal**
  - *Condition*: Playback triggered for paragraph 1.
  - *Expected*: `SpeechSynthesis.speak()` called; paragraph 1 receives `.active-reading-segment` highlighting; playback state is `playing`.
  - *Target Test*: `tests/logic/reading-chunks.mjs`
- [x] **State 3: Boundary / Stress**
  - *Condition*: User clicks audio on paragraph 3 while paragraph 1 is actively speaking.
  - *Expected*: `SpeechSynthesis.cancel()` called immediately before playing paragraph 3; no overlapping audio streams.
  - *Target Test*: `tests/logic/reading-chunks.mjs`
- [x] **State 4: Degraded / Error**
  - *Condition*: Browser does not support `window.speechSynthesis` or user denied audio permissions.
  - *Expected*: Audio button gracefully hides or disables without throwing `TypeError`.
  - *Target Test*: `tests/logic/reading-chunks.mjs`

---

## 6. User Story 5: Private BYOK Provider Management & JSON Backup Portability (P5)

### 6.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: Clean storage, 0 custom API keys configured.
  - *Expected*: Provider settings modal displays default provider registry with clear unconfigured state; mock evaluation available.
  - *Target Test*: `tests/logic/provider-settings.mjs`, `tests/e2e/backup.spec.js`
- [x] **State 2: Populated / Nominal**
  - *Condition*: Configured Anthropic, OpenAI, and Groq providers with custom keys.
  - *Expected*: Active provider selection persisted in local storage; credentials masked in UI (`••••••••`); export produces valid backup schema.
  - *Target Test*: `tests/logic/provider-settings.mjs`, `tests/e2e/backup.spec.js`
- [x] **State 3: Boundary / Stress**
  - *Condition*: Large backup payload with 50+ detailed evaluation attempts and custom drafts.
  - *Expected*: Backup export generates complete JSON without string truncation; import successfully restores all records into state store.
  - *Target Test*: `tests/logic/backup-flow.test.mjs`, `tests/e2e/backup.spec.js`
- [x] **State 4: Degraded / Error**
  - *Condition*: Corrupted JSON file or schema version mismatch imported.
  - *Expected*: Import validator rejects payload with explicit diagnostic message; current application state remains untouched.
  - *Target Test*: `tests/logic/backup-flow.test.mjs`

---

## 7. User Story 6: Flashcards View & Active Recall (P6) 🎯 Critical Regression Surface

### 7.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: Clean session with `attemptsByNode = {}` (0 attempts).
  - *Expected*: Flashcard grid mounts, counter displays `Mostrando 101 de 101 flashcards`, cards display category badge and no score badge, "Sin intento" filter shows all 101 cards.
  - *Target Test*: `tests/e2e/flashcards.spec.js`
- [x] **State 2: Populated / Nominal (Regression Test for Object as Child)**
  - *Condition*: Pre-populated state fixture with attempted and mastered nodes (`tests/fixtures/hydrated-state.json`).
  - *Expected*: 
    - Attempted flashcards render scalar numeric score (e.g. `85/120` or `105/120`).
    - Zero `Objects are not valid as a React child` errors thrown.
    - Mastery filter "Base dominada (100+)" correctly filters and displays mastered cards.
    - "Base < 100" filter displays developing cards.
  - *Target Test*: `tests/e2e/flashcards.spec.js`
- [x] **State 3: Boundary / Stress**
  - *Condition*: Flashcard with maximum score (`120/120`) and long lesson title/summary.
  - *Expected*: 3D flip animation executes smoothly with CSS `transform: rotateY(180deg)`; no text overflow outside card container boundaries.
  - *Target Test*: `tests/e2e/flashcards.spec.js`
- [x] **State 4: Degraded / Error**
  - *Condition*: Node has missing `lesson` object or missing `category` mapping.
  - *Expected*: Card renders with fallback category ("CONCEPTO") and default explanation text without throwing runtime exceptions.
  - *Target Test*: `tests/e2e/flashcards.spec.js`

### 7.2 Domain Boundary Contracts (Headless -> Presentation)
- [x] `getNodeProgress(attemptsByNode, nodeId).score`:
  - Must be `number` or `null`.
  - Must NEVER be the composite rubric object `{ rawScore, coveragePercent, displayScore, ... }`.
  - Must satisfy: `assert(progress.score === null || typeof progress.score === "number")`.
  - Verified in: `tests/logic/learning-controller.mjs`.

### 7.3 Conditional Branch Completeness
- [x] `FlashcardCard.jsx: score != null`:
  - [x] Branch TRUE (exercised with hydrated fixture): renders `<span ...>{score}/120</span>` with green or gold accent.
  - [x] Branch FALSE (exercised with empty state): score badge is not rendered.
- [x] `FlashcardCard.jsx: score >= 100`:
  - [x] Branch TRUE: color is `var(--accent-green)`.
  - [x] Branch FALSE: color is `var(--accent-gold)`.
- [x] `FlashcardGrid.jsx: activeFilter`:
  - [x] `all`: displays all cards.
  - [x] `unattempted`: displays only unattempted cards.
  - [x] `below-mastery`: displays cards with `isAttempted && score < 100`.
  - [x] `mastery`: displays cards with `isAttempted && score >= 100`.

### 7.4 Runtime Invariants
- [x] **0 Uncaught Exceptions**: Global Playwright `page.on("pageerror", ...)` fail-fast listener enforced.
- [x] **0 Style Collision Warnings**: No mixing of shorthand `border` with `borderTop` or `borderLeft`.

---

## 8. User Story 7: Mobile Ergonomics & Bottom Navigation (P7)

### 8.1 Universal State Matrix
- [x] **State 1: Empty / Cold Start**
  - *Condition*: Mobile viewport (375x667), clean storage.
  - *Expected*: Fixed bottom navigation bar renders at bottom of screen with Graph, Flashcards, Seniority, and Settings tabs.
  - *Target Test*: `tests/e2e/mobile.spec.js`
- [x] **State 2: Populated / Nominal**
  - *Condition*: Mobile viewport with active graph progress.
  - *Expected*: Tapping bottom navigation tabs switches views instantly without layout shifts or horizontal scrolling.
  - *Target Test*: `tests/e2e/mobile.spec.js`
- [x] **State 3: Boundary / Stress**
  - *Condition*: Rapid alternating taps between bottom navigation items.
  - *Expected*: Active tab highlighting updates reliably without state desynchronization.
  - *Target Test*: `tests/e2e/mobile.spec.js`
- [x] **State 4: Degraded / Error**
  - *Condition*: Viewport resized dynamically between mobile (<768px) and desktop (>1024px).
  - *Expected*: Bottom bar hides smoothly on desktop viewports and reappears on mobile viewports without requiring page reload.
  - *Target Test*: `tests/e2e/mobile.spec.js`

---

## 9. Gate Certification
- **Status**: PASSED
- **Timestamp**: 2026-09-04T22:00:00-03:00
- **Logic Tests**: 100% Passing (8/8 test suites including automated fixture contract drift guard)
- **E2E Tests**: 100% Passing (33/33 tests across 6 suites, 0 uncaught exceptions, 0 style collision warnings)
- **Fixture Engineering Protocol**: 100% Validated (3 fixtures: hydrated nominal, boundary time-travel, degraded corruption guard)
- **Constitutional Limits**: 100% Compliant (42/42 files < 150 lines)
