# CONSTITUTION: Learning Workspace (v2 Architecture)

<!-- GitHub Spec Kit: Project Constitution -->
**Version:** 2.1.0  
**Status:** Active  
**Scope:** Entire repository `KnowGraph` / `Learning Workspace`

---

## 1. Foundational Purpose and Vision

Learning Workspace is a high-signal cockpit for technical mastery and intensive preparation targeting Senior and Tech Lead interview rounds. The application transforms complex curricula (React, Rails, Web Architecture) into an active, guided learning graph, Socratic tutoring, and analytical evaluation powered by AI.

This Constitution defines non-negotiable engineering principles to eliminate technical debt, prevent unprincipled AI development ("vibe coding"), and enforce a rigorous standard of maintainability, architectural elegance, and reliability.

---

## 2. Non-Negotiable Architectural Principles

### Article I: Zero Vibe-Coding Policy (Spec-Driven First)
1. **No UI line is written without a specification**: Every component, hook, or capability must map to an explicit task in `specs/`.
2. **Traceability**: Every commit must reference the requirement, ADR, or task that it resolves.
3. **No Patch Accumulation**: If a feature requires modifying an existing component and it approaches size constraints, it must be refactored and decomposed before adding new behavior.

### Article II: Strict Layered Separation (Headless-First)
The codebase is partitioned into three unidirectional layers:

```text
┌──────────────────────────────────────────────────────────┐
│  LAYER 1: DOMAIN AND PURE LOGIC (Headless)              │
│  - Graphs, topological ordering, prerequisites, milestones
│  - Local-first persistence (IndexedDB, storage)          │
│  - Zod schemas, data contracts, and scoring logic        │
│  RULE: 0 JSX, 0 CSS, 0 DOM. 100% testable in Node.js.    │
└────────────────────────────┬─────────────────────────────┘
                             │ Provides snapshots / dispatchers
                             ▼
┌──────────────────────────────────────────────────────────┐
│  LAYER 2: ORCHESTRATION & STATE (Hooks & Stores)         │
│  - useStudySession (4-stage flow: Read/Learn/Coach/Eval) │
│  - useBackgroundTasks (asynchronous evaluator tasks)     │
│  - useAudioNarrator (synchronized TTS by chunks)         │
│  - useCommandPalette (global shortcut orchestration)     │
│  RULE: Interaction state only; zero presentation markup. │
└────────────────────────────┬─────────────────────────────┘
                             │ Provides clean reactive data/callbacks
                             ▼
┌──────────────────────────────────────────────────────────┐
│  LAYER 3: VISUAL PRESENTATION (Dumb View Components)     │
│  - Pure React components, layout, modular aesthetics     │
│  RULE: Strictly <150 lines per file. Rendering only.     │
└──────────────────────────────────────────────────────────┘
```

### Article III: Strict 150-Line File Limit & Single Responsibility (SRP)
1. **150-Line Limit**: Under no circumstance may any component or hook file in `src/` exceed 150 physical lines of code.
2. **Monolith Prohibition**: `App.jsx` must remain a lean root coordinator of under 125 lines. It cannot define raw data structures, audio constants, or dense inline styling.
3. **Immediate Decomposition**: If a component requires more than 4 local state hooks (`useState`), state orchestration must be factored out into a dedicated Layer 2 hook.

### Article IV: Type Contracts and Layer Boundaries
1. All domain data crossing external or architectural boundaries (LLM gateway, SSE payloads, local storage, selectors delivering to UI) must be strictly validated.
2. Selectors delivering state to Layer 3 presentation must output scalar primitives (`number | null`, `string | null`, `boolean`), never raw evaluation domain objects.

### Article V: Preservation of Interaction Gems
Clean refactoring must never compromise or simplify validated pedagogical interaction gems:
- **4-Stage Study Route**: *01 Read* → *02 Learn* → *03 Paraphrase* → *04 Evaluate*.
- **Reactive Background Tasks**: AI evaluation streaming continues uninterrupted if the candidate explores other nodes, tracked via global HUD.
- **Multi-Tab Sync**: Coordinated via `BroadcastChannel` to prevent conflicting or stale task state.
- **Synchronized Voice Reading**: Visual pulse highlighting on the active paragraph during `SpeechSynthesis` playback.
- **Dual-Tier Analytical Rubric (0–120)**: Baseline sufficiency at 100 points; optional golden excellence tier at 101–120 points.

### Article VI: Local-First Security and Privacy
1. **Zero Secret Exposure**: BYOK API credentials are never sent to third-party servers other than the user-configured provider endpoint.
2. **SSRF Defense**: Gateway strictly blocks private IPs and loopback DNS in public deployments unless explicitly authorized via `ALLOW_PRIVATE_PROVIDER_URLS=true`.
3. **Encrypted Desktop Storage**: Under Electron, keys are stored encrypted via operating system keychains (`safeStorage`) with `0o600` permissions.

### Article VII: Visual Discipline and CSS Modularity
1. **Prohibition of Monolithic Stylesheets**: No unmaintained legacy CSS monsters.
2. **Encapsulation**: Styles are modular and isolated per component.
3. **Technical Dark Theme**: Canonical palette defined in `DESIGN.md` (Cockpit dark canvas `#0c0f14`, accents `#70ddd4`, `#6eb7ff`, `#55d98a`, `#e6b95b`).

### Article VIII: Non-Negotiable Testing Standard and Universal State Matrix
1. **Zero False-Green Policy**: No feature or User Story is accepted if verified exclusively against an uninitialized empty state.
2. **The Universal 4-State Matrix**: Every view specification must demonstrate test coverage across:
   - *State 1: Empty / Cold Start* (0 records, default zero-state).
   - *State 2: Populated / Nominal* (realistic pre-populated fixtures with real domain values).
   - *State 3: Boundary / Stress* (extreme scores, max bounds, text overflows).
   - *State 4: Degraded / Error* (malformed inputs, graceful fallbacks).
3. **Branch Completeness**: Every conditional rendering branch (`if/else`, `? :`, `&&`) in a component must be exercised in both true and false paths.
4. **Fail-Fast Runtime Guard**: E2E browser test runs must fail immediately upon any uncaught exception (`pageerror`) or style collision warning.
5. **Realistic Fixture Integrity**: All test fixtures in `tests/fixtures/` must adhere to the 4 Principles of Realistic Fixtures (Domain Alignment, Distribution Variance, Lexical Realism, Strict Schema Conformance) and pass automated drift validation.

---

## 3. Verification Process and Compliance Gates

A Pull Request, feature branch, or implementation is considered complete only when:
1. `npm run check` passes cleanly (linter audit confirming 0 files > 150 lines + clean production build).
2. `npm run test:logic` passes 100% in Node.js, including automated fixture contract validation.
3. `npm run test:e2e` passes 100% in Playwright with 0 uncaught exceptions or pageerrors.
4. The corresponding `test-plan.md` has all state matrix checkboxes verified with verifiable execution proof.
5. All test fixtures in `tests/fixtures/` pass schema and domain contract validation via `tests/logic/fixtures-contract.test.mjs`.
6. Conforms strictly to all articles of this Constitution.
