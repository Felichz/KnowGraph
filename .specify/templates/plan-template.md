# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: [e.g., JavaScript ES2023, Node 20]
**Primary Dependencies**: [e.g., React 19, Vite 6, Zod, idb]
**Storage**: [e.g., IndexedDB, localStorage, safeStorage]
**Testing**: [e.g., node:test, audit scripts]
**Target Platform**: [e.g., Web (Vite) and Desktop (Electron)]
**Project Type**: [e.g., Desktop & Web SPA]
**Performance Goals**: [domain-specific goals]
**Constraints**: [e.g., Local-first, offline-capable, BYOK security]
**Scale/Scope**: [domain-specific scope]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── spec.md              # Feature specification
├── plan.md              # This file
└── tasks.md             # Actionable task list
```

### Source Code (repository root)

```text
src/
├── domain/ or logic/
├── hooks/
├── components/
└── styles/
```

**Structure Decision**: [Document the selected structure]

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [none]    |            |                                     |
