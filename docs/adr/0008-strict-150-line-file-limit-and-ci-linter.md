# ADR 0008 — Constitutional 150-Line File Limit and CI Linter

- Status: **Accepted**
- Date: 2026-09-04
- Deciders: Learning Workspace Core

## Context

In software development assisted by AI agents (*vibe-coding*), there is a documented natural entropy: language models solve incremental requirements by appending functions, hooks, inline styles, and local state directly onto whichever file is open in context, rather than decomposing systems into clean, modular subcomponents.

Over time, this pattern degraded the original prototype until `legacy/App.jsx` expanded into an unmaintainable 2,643-line monolith. Without an automated, non-negotiable enforcement mechanism, clean refactors inevitably succumb to entropy as new features accumulate.

## Decision

We enshrined **Article III in the Project Constitution** (`.specify/memory/constitution.md`):

> **Article III: Strict 150-Line File Limit.**  
> Under no circumstances may any component or hook file in `src/` exceed 150 physical lines of code.

To guarantee continuous enforcement and prevent exceptions:
1. **Automated Node Linter (`scripts/audit-lines.mjs`)**:
   - Recursively scans all `.js` and `.jsx` files across `src/components/`, `src/hooks/`, and root UI coordinators.
   - If even a single file reaches 151 lines, the linter outputs an explicit violation report and terminates with exit code 1.
2. **Continuous Integration (CI) Quality Gate**:
   - The script is embedded in the mandatory verification pipeline (`npm run check`).
   - Merging feature branches reporting line limit violations is blocked.
3. **Forced Component Decomposition**:
   - When complex views (such as the study modal or provider panel) expand, architectural discipline forces decomposition into single-responsibility subcomponents (e.g., `AttemptHistoryBar`, `EvaluationLoader`, `BackupActions`, `DeepDivePopover`).

## Consequences

### Positive
* **Zero Monolithic Decay**: The codebase remains strictly modular. Across all 42 source files, component lengths range cleanly between 2 and 142 lines (`App.jsx` stands at only 119 lines).
* **Low Cognitive Overhead**: Any human engineer or AI agent can read, understand, and reason about an entire component within a single screen view.
* **Isolated Refactoring and Debugging**: Edge cases and styling tweaks remain contained inside small, single-purpose files.

### Accepted Costs and Limitations
* **Increased File Count**: Managing smaller atomic components requires clean prop drilling or composition patterns across parent containers and child components.
