# Implementation Plan: Clean Learning Workspace V2

**Branch**: `001-clean-workspace-v2` | **Date**: 2026-09-03 | **Spec**: [specs/001-clean-workspace-v2/spec.md](spec.md)  
**Input**: Feature specification from `specs/001-clean-workspace-v2/spec.md`  

---

## Summary

Complete greenfield refactoring of the presentation and state orchestration layer of Learning Workspace under a modular, reactive, and decoupled architecture. The headless core (`src/logic/` and `src/ai/`), the local gateway (`server/`), and the catalog of 101 React nodes and 41 Rails nodes are fully preserved. The UI is implemented via atomic presentation components strictly under 150 lines, wired through custom Layer 2 hooks and `useSyncExternalStore`. All interaction and pedagogical gems discovered in the legacy prototype are captured and preserved: Seniority progress and milestones, unlockable FAANG interview questions, historical time-travel navigation, floating global tasks HUD with cancellation, schema-validated JSON backup import/export, and 3D flashcards active recall mode.

---

## Technical Context

| Dimension | Technical Specification |
| :--- | :--- |
| **Language/Version** | JavaScript ES2023 / JSX, Node.js 20+ |
| **Primary Dependencies** | React 19, Vite 6, Electron 41, Zod 3, idb 8, PrismJS, Mermaid 11 |
| **Storage** | IndexedDB (`idb` v8) for attempts/drafts, `localStorage` for progress/graphs, `safeStorage` in Electron for API keys |
| **Web APIs** | `SpeechSynthesis` (TTS), `SpeechRecognition` (voice dictation), `History API` (pushState/popstate), `BroadcastChannel` (multi-tab sync), `AbortController` (streaming cancellation) |
| **Testing** | Node test runner (`tests/logic/*.mjs`), line count audit (`scripts/audit-lines.mjs`), Playwright E2E suites (`tests/e2e/*.spec.js`) |
| **Target Platform** | Modern Web SPA (Vite/Vercel) and Native Desktop (Electron for Windows, macOS, Linux) |
| **Performance Goals** | Initial load < 1.2s, CSS bundle < 10 kB, 0 layout shifts during SSE streaming |
| **Constraints** | Strict local-first, offline-capable, private BYOK sovereignty, constitutional 150-line limit per file |
| **Scale/Scope** | 101 React nodes, 41 Rails nodes, 110 reference FAANG questions, 4 seniority bands |

---

## Constitution Check

*GATE: Mandatory verification against `.specify/memory/constitution.md` before and during implementation.*

| Constitutional Rule | Status | Justification and Compliance Mechanism |
| :--- | :---: | :--- |
| **Art. I: Zero Vibe-Coding** | **PASSED** | All work maps directly to traceable tasks in `tasks.md` originating from `spec.md`. |
| **Art. II: Headless-First** | **PASSED** | Domain logic lives in `src/logic/` and `src/ai/` with 0 React/DOM dependencies. Tests run in pure Node.js. |
| **Art. III: 150-Line Limit** | **PASSED** | No file exceeds 150 lines. Complex panels and views are decomposed into atomic subcomponents. |
| **Art. IV: Boundary Contracts** | **PASSED** | Zod schemas validate gateway requests/responses; selectors output verified scalar primitives to presentation. |
| **Art. V: Gem Preservation** | **PASSED** | All interaction gems discovered in legacy code are formally captured in US1–US7. |
| **Art. VI: BYOK Security** | **PASSED** | Gateway enforces `assertPublicProviderUrl` (anti-SSRF); Electron uses `safeStorage` with `0o600` permissions. |
| **Art. VII: Modular CSS** | **PASSED** | Styles rely cleanly on design tokens defined in `src/styles/theme.css`. |
| **Art. VIII: Testing Standard**| **PASSED** | Multi-state matrix (Empty, Populated, Boundary, Error) verified with zero uncaught exception policy. |

---

## Project Structure

### Documentation (Spec Kit)
```text
.specify/
├── memory/
│   └── constitution.md     # Project constitution and non-negotiable rules
├── skills/
│   └── spec-driven-testing/SKILL.md # Autonomous testing & verification skill
└── templates/
    ├── spec-template.md     # Specification template
    ├── plan-template.md     # Architectural plan template
    └── tasks-template.md    # Task checklist template

specs/001-clean-workspace-v2/
├── spec.md                 # Prioritized functional specification (P1-P7)
├── plan.md                 # This implementation plan
├── tasks.md                # Ordered checklist of executable tasks
└── test-plan.md            # Derived verification matrix across 4 universal states
```

### Source Code (Modular Structure)
```text
legacy/                     # 📦 Historical archive (monolithic v1 prototype)

server/                     # 🧠 Local AI Gateway (BYOK, Zod, SSE, SSRF-safe)

src/                        # ✨ Clean Modular V2 Architecture
├── logic/                  # Layer 1: Pure Headless Domain (0 JSX)
│   ├── graphRegistry.js
│   ├── railsGraph.js
│   ├── selectors.js
│   ├── topologicalLayout.js
│   ├── seniorityProgress.js # Seniority Bands & Milestones calculation
│   ├── interviewUnlock.js   # Unlockable interview question calculation
│   └── learningController.js
│
├── ai/                     # Layer 1: Adapters & Local Storage
│   ├── client.js           # SSE client with AbortController
│   ├── backup.js           # JSON backup export/import validation
│   ├── learningStore.js    # IndexedDB for attempts and drafts
│   ├── backgroundTaskManager.js # Async tasks & BroadcastChannel sync
│   └── providerSettings.js # Credential persistence
│
├── hooks/                  # Layer 2: Orchestration & UI State
│   ├── useController.js    # useSyncExternalStore binding on learningController
│   ├── useUrlRouting.js    # Bidirectional URL routing & popstate history
│   ├── useStudySession.js  # Active modal card state, stages, and drafts
│   ├── useSpeechRecognition.js # Native voice dictation during paraphrasing
│   ├── useAudioNarrator.js # Native chunk-by-chunk TTS narration
│   ├── useBackgroundTasks.js # Reactivity to background evaluator tasks
│   └── useKeyboardShortcuts.js # Global shortcuts (Ctrl+K, Esc, Ctrl+Enter)
│
├── components/             # Layer 3: Dumb Presentation Components (< 150 lines)
│   ├── layout/
│   │   ├── AppHeader.jsx
│   │   ├── CategoryNav.jsx
│   │   ├── SeniorityProgressPanel.jsx # Seniority & Milestones drawer
│   │   ├── GlobalTasksHud.jsx        # Floating background task HUD
│   │   ├── MobileBottomNav.jsx       # Fixed thumb navigation bar for mobile
│   │   └── TaskBanner.jsx
│   ├── graph/
│   │   ├── GraphCanvas.jsx
│   │   ├── GraphNode.jsx
│   │   ├── GraphTopologyCanvas.jsx   # SVG topological DAG with Pan & Zoom
│   │   └── SuggestedNext.jsx
│   ├── flashcards/
│   │   ├── FlashcardGrid.jsx
│   │   └── FlashcardCard.jsx         # 3D interactive flip card
│   ├── study/
│   │   ├── StudyModal.jsx
│   │   ├── ConceptMapNav.jsx
│   │   ├── DeepDiveText.jsx
│   │   ├── DeepDivePopover.jsx
│   │   ├── InterviewQuestionsSection.jsx # FAANG accordion
│   │   ├── AttemptHistoryBar.jsx         # Historical pagination bar
│   │   ├── CodeComparisonSection.jsx     # Naive vs Senior comparative
│   │   ├── EvaluationLoader.jsx          # Live SSE streaming timer & abort
│   │   ├── ReadStage.jsx
│   │   ├── LearnStage.jsx
│   │   ├── ParaphraseStage.jsx
│   │   └── EvaluateStage.jsx
│   ├── common/
│   │   ├── CodeSnippet.jsx
│   │   ├── MermaidChart.jsx
│   │   ├── Sparkline.jsx
│   │   └── CommandPalette.jsx
│   └── settings/
│       ├── ProviderModal.jsx
│       └── BackupActions.jsx # Export/Import JSON buttons
│
├── styles/
│   └── theme.css           # Tokens and dark palette from DESIGN.md
│
├── App.jsx                 # Root coordinator (< 120 lines)
└── main.jsx                # Application entrypoint
```

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| *None* | All solutions strictly adhere to Constitutional limits and layered separation. | N/A |
