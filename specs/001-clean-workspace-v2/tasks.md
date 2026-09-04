---
description: "Task list for Clean Learning Workspace V2 implementation"
---

# Tasks: Clean Learning Workspace V2

**Input**: Design documents from `/specs/001-clean-workspace-v2/`  
**Prerequisites**: `plan.md`, `spec.md`, `.specify/memory/constitution.md`  
**Organization**: Tasks are grouped by phase and User Story (P1 to P7) to enable independent implementation and verification of each increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (independent files)
- **[Story]**: Target User Story (US1 to US7)
- Includes exact source filepaths

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create `src/styles/theme.css` with color, spacing, and typography tokens from `DESIGN.md`.
- [x] T002 [P] Create `src/components/common/CodeSnippet.jsx` (< 80 lines) with PrismJS and technical narration.
- [x] T003 [P] Create `src/components/common/MermaidChart.jsx` (< 70 lines) with lazy loading and SVG rendering.
- [x] T004 [P] Create `src/components/common/Sparkline.jsx` (< 90 lines) with SVG score trajectory visualization.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T005 Create `src/hooks/useController.js` connecting `createLearningController` via `useSyncExternalStore`.
- [x] T006 [P] Create `src/hooks/useKeyboardShortcuts.js` for global `Ctrl+K`, `Escape`, and navigation capture.
- [x] T007 [P] Create `src/hooks/useBackgroundTasks.js` subscribing to `backgroundTaskManager` for live reactivity.

---

## Phase 3: User Story 1 - Navigation and Graph (Priority: P1) 🎯 MVP

- [x] T008 [US1] Create `src/components/layout/AppHeader.jsx` (< 110 lines) with graph switcher and progress summary.
- [x] T009 [US1] Create `src/components/layout/CategoryNav.jsx` (< 100 lines) with category filter chips and completion counts.
- [x] T010 [US1] Create `src/components/graph/SuggestedNext.jsx` (< 60 lines) with next topological challenge strip.
- [x] T011 [US1] Create `src/components/graph/GraphNode.jsx` (< 90 lines) for node cards with status badges.
- [x] T012 [US1] Create `src/components/graph/GraphCanvas.jsx` (< 130 lines) for the main topological graph canvas.
- [x] T013 [US1] Create `src/components/common/CommandPalette.jsx` (< 120 lines) with instant search accessible via `Ctrl+K`.
- [x] T014 [US1] Integrate MVP in `src/App.jsx` and verify User Story 1 acceptance.

---

## Phase 4: User Story 2 - 4-Stage Study Modal (Priority: P2)

- [x] T015 [US2] Create `src/hooks/useStudySession.js` (< 120 lines) coordinating 4 stages and auto-save in IndexedDB.
- [x] T016 [US2] Create `src/components/study/ReadStage.jsx` (< 140 lines) with summary, explanation, snippet, and trade-offs.
- [x] T017 [US2] Create `src/components/study/LearnStage.jsx` (< 130 lines) for Socratic tutoring chat threads.
- [x] T018 [US2] Create `src/components/study/ParaphraseStage.jsx` (< 140 lines) with paraphrase editor and live review.
- [x] T019 [US2] Create `src/components/study/EvaluateStage.jsx` (< 140 lines) with 0–120 rubric bars, gaps, and sparkline.
- [x] T020 [US2] Create `src/components/study/StudyModal.jsx` (< 120 lines) integrating all 4 stages with navigation.
- [x] T021 [US2] Mount `StudyModal` in `src/App.jsx` and verify User Story 2 acceptance.

---

## Phase 5: User Story 3 - Background Tasks and Multi-Tab (Priority: P3)

- [x] T022 [US3] Create `src/components/layout/TaskBanner.jsx` (< 70 lines) with pulse animation and "View live →" button.
- [x] T023 [US3] Integrate `TaskBanner` into `src/components/layout/AppHeader.jsx` or main layout view.
- [x] T024 [US3] Verify User Story 3 acceptance.

---

## Phase 6: User Story 4 - Synchronized Voice Reading (Priority: P4)

- [x] T025 [US4] Create `src/hooks/useAudioNarrator.js` (< 110 lines) managing `SpeechSynthesis` across fragment IDs.
- [x] T026 [US4] Connect `useAudioNarrator` in `src/components/study/ReadStage.jsx` with section audio triggers.
- [x] T027 [US4] Verify User Story 4 acceptance.

---

## Phase 7: User Story 5 - Private BYOK Configuration (Priority: P5)

- [x] T028 [US5] Create `src/components/settings/ProviderModal.jsx` (< 140 lines) connected to `src/ai/providerSettings.js`.
- [x] T029 [US5] Wire settings modal trigger in `src/components/layout/AppHeader.jsx`.
- [x] T030 [US5] Verify User Story 5 acceptance.

---

## Phase 8: Base Verification and Compliance

- [x] T031 File line limit audit: Confirm no file in `src/components/` or `src/hooks/` exceeds 150 lines.
- [x] T032 Confirm `src/App.jsx` measures under 150 lines.
- [x] T033 Execute `npm run check` passing 100% green.
- [x] T034 Execute `npm run test:logic` passing 100% green without hanging processes.

---

## Phase 9: Interaction Gems Refinement (US1 & US2)

- [x] T035 [US2] Create `src/hooks/useSpeechRecognition.js` (< 60 lines) for oral voice dictation in `ParaphraseStage`.
- [x] T036 [US2] Connect microphone button and `Ctrl+Enter` shortcut in `src/components/study/ParaphraseStage.jsx`.
- [x] T037 [US2] Create `src/components/study/DeepDivePopover.jsx` and `DeepDiveText.jsx` for low-level technical terms.
- [x] T038 [US1/US2] Create `src/components/study/ConceptMapNav.jsx` with Before → Now → After flow and back navigation.
- [x] T039 [US1] Create `src/hooks/useUrlRouting.js` (< 70 lines) for bidirectional URL routing and `popstate` history sync.
- [x] T040 [US2] Implement `zenMode` (fullscreen distraction-free) toggle in `src/components/study/StudyModal.jsx`.

---

## Phase 10: User Story 6 - Flashcards View & Active Recall (Priority: P6)

- [x] T041 [US6] Create `src/components/flashcards/FlashcardCard.jsx` (< 90 lines) with 3D flip animation.
- [x] T042 [US6] Create `src/components/flashcards/FlashcardGrid.jsx` (< 120 lines) with mastery state filters.
- [x] T043 [US6] Connect Graph/Flashcards view switcher in `src/components/layout/AppHeader.jsx` and `src/App.jsx`.
- [x] T044 Re-run `scripts/audit-lines.mjs` and `npm run check` confirming 0 violations.

---

## Phase 11: Curriculum, Seniority Bands & FAANG Questions (Priority: P1 & P2)

**Goal**: Model high-level career abstractions (Seniority Bands, Milestones, and unlockable interview banks).

- [x] T045 [P] [US1] Create `src/logic/seniorityProgress.js` (< 60 lines) with pure band and milestone calculations.
- [x] T046 [P] [US2] Create `src/logic/interviewUnlock.js` (< 60 lines) with unlockable FAANG question logic.
- [x] T047 [US1] Create `src/components/layout/SeniorityProgressPanel.jsx` (< 120 lines) with band breakdown and milestone bars.
- [x] T048 [US2] Create `src/components/study/InterviewQuestionsSection.jsx` (< 90 lines) with FAANG accordion.
- [x] T049 [US2] Integrate `InterviewQuestionsSection`, official documentation links, and related nodes in `ReadStage.jsx`.

---

## Phase 12: Historical Time-Travel, JSON Backup & Mobile Nav (Priority: P2, P3, P5, P7)

**Goal**: Provide evaluation history inspection, full local-first backup, floating HUD, and touch mobile bottom navigation.

- [x] T050 [P] [US2] Create `src/components/study/AttemptHistoryBar.jsx` (< 80 lines) with `← X of Y →` pagination and stale card alerts.
- [x] T051 [P] [US5] Create `src/components/settings/BackupActions.jsx` (< 80 lines) connecting `src/ai/backup.js`.
- [x] T052 [P] [US3] Create `src/components/layout/GlobalTasksHud.jsx` (< 100 lines) with floating HUD and AbortController cancellation.
- [x] T053 [P] [US7] Create `src/components/layout/MobileBottomNav.jsx` (< 90 lines) for thumb navigation on narrow viewports.
- [x] T054 Connect new components in `App.jsx`, `StudyModal.jsx`, `EvaluateStage.jsx`, and `ProviderModal.jsx`.
- [x] T055 Run `node scripts/audit-lines.mjs`, `npm run test:logic`, and `npm run check` certifying final compliance.

---

## Phase 13: Forensic Refinement and Micro-Interactions (US1, US2, US7)

**Goal**: Finalize interaction refinements uncovered in forensic review (quick actions, responsive loader, excellence aura, and mobile visibility).

- [x] T056 [P] [US1] Add quick system actions (*📇 Flashcards*, *📊 Seniority*, *⚙️ BYOK*) to `src/components/common/CommandPalette.jsx`.
- [x] T057 [P] [US2/US3] Create `src/components/study/EvaluationLoader.jsx` (< 75 lines) with real-time latency timer and thinking model notice.
- [x] T058 [US2] Integrate `conciseVerdict` and `EvaluationLoader` in `src/components/study/EvaluateStage.jsx`.
- [x] T059 [US1] Incorporate golden excellence aura `★ score/120` in `src/components/graph/GraphNode.jsx`.
- [x] T060 [US7] Implement conditional visibility in `src/styles/theme.css` to hide `mobile-bottom-nav` on desktop while supporting `safe-area-inset-bottom` on mobile.

---

## Phase 14: Spec-Driven Testing, Universal State Matrix & Domain Contracts (ADR 0009)

**Goal**: Establish deterministic verification matrix, eliminate clean-state bias, fix child object rendering and style collision bugs, and enforce 100% test passing gates.

- [x] T061 Formulate ADR 0009 and autonomous `spec-driven-testing` skill enforcing the Universal 4-State Matrix and stigmergic workflow.
- [x] T062 Author `specs/001-clean-workspace-v2/test-plan.md` mapping US1 through US7 across Empty, Populated, Boundary, and Error states.
- [x] T063 Fix domain boundary contract in `src/logic/selectors.js` (`score: scoreView?.displayScore ?? null`) and eliminate React CSS shorthand conflicts in `FlashcardCard.jsx` and `GraphNode.jsx`.
- [x] T064 Create `tests/fixtures/hydrated-state.json` and author E2E tests in `flashcards.spec.js` and `workspace.spec.js` with global `pageerror` fail-fast listeners.
- [x] T065 Certify compliance: 100% logic tests passing (7/7 suites), 100% E2E tests passing (28/28 tests), and 0 line limit violations across all 42 source files.

