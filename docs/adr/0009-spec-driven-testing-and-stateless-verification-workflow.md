# ADR 0009 — Spec-Driven Testing, Universal State Matrix, and Stateless Verification Workflow

- Status: **Accepted**
- Date: 2026-09-04
- Deciders: Learning Workspace Core

## Context

When developing software with AI agents under Spec-Driven Development (SDD), workflows frequently suffer from the **"One-Shot Fallacy"** and **"Clean-State Bias"**:
1. An agent writes the implementation code based on a specification.
2. The same agent writes automated tests holding the identical cognitive assumptions (e.g., assuming clean databases and initial empty states).
3. The test suite passes 100% green, creating a false sense of quality ("false-green assurance").
4. In production or user testing with pre-existing or populated data, unexercised conditional branches execute for the first time and crash the application (e.g., rendering `{score}/120` where `score` was an object instead of a primitive number).

Software testing standards (including ISO/IEC TR 29119-11 on metamorphic and property-based testing) establish that software components must be evaluated across invariant state spaces and boundary contracts rather than subjective happy-path scripts.

Furthermore, AI agents are ephemeral: conversations truncate, contexts reset, and different models (or human developers) take turns on the codebase. A reliable verification system cannot rely on conversational memory; **the workflow state must be fully inferable from the filesystem**.

## Decision

### 1. The Universal 4-State Matrix

Every User Story and UI view specified in `specs/` must be tested across four universal lifecycle states before being signed off:

| Universal State | Definition | Application |
| :--- | :--- | :--- |
| **1. Empty / Cold State** | Clean storage, 0 attempts, uninitialized state. | Verify initial layouts, zero-state messages, and absence of premature indicators. |
| **2. Populated / Nominal State** | Typical valid domain data representing real-world usage. | Verify active items, formatted badges, progress bars, and normal interactions. |
| **3. Boundary / Stress State** | Minimum/maximum values, extreme scales, overflowing text. | Verify max scores (e.g., 100+ excellence bonus), long labels, layout stability. |
| **4. Degraded / Error State** | Malformed data, network dropouts, corrupted storage. | Verify non-crashing fallbacks, error banners, and graceful recovery. |

### 2. Stateless Agent, Stateful Filesystem (Stigmergy)

The verification lifecycle is governed by filesystem artifacts in `specs/<feature>/` without relying on conversational history:
* **`spec.md`**: The requirements and acceptance criteria.
* **`test-plan.md`**: The derived verification matrix mapping every User Story to the 4 Universal States, boundary type assertions, and branch completeness checklist.
* **`tests/fixtures/`**: Versioned JSON snapshots providing deterministic populated and boundary states.
* **Execution Evidence**: Test runner output asserting 0 failures and 0 uncaught browser exceptions.

Any agent at any time can inspect `specs/<feature>/` and infer the exact phase:
- Missing `test-plan.md` $\to$ Generate test plan artifact.
- Unchecked boxes (`- [ ]`) $\to$ Implement missing fixtures or tests.
- All checked (`- [x]`) with failing CLI $\to$ Self-heal / repair code against stack traces.
- All checked (`- [x]`) with passing CLI $\to$ Gate passed, sign off in `tasks.md`.

### 3. Strict Boundary Contracts (Headless to Presentation)

Selectors in the headless layer (`src/logic/selectors.js`) delivering data to React components must return explicit scalar primitives (`number | null`, `string | null`, `boolean`). 
* The unit test suite (`npm run test:logic`) must assert primitive types on all presentation-facing properties to prevent internal evaluation domain objects from leaking into JSX children.

### 4. Conditional Branch Completeness

Every conditional UI construct (`if/else`, ternary `? :`, logical `&&`) in a component must have both its **true** and **false** branches exercised by the test suite. No component with 0% coverage on conditional branches may be accepted.

### 5. Zero Uncaught Exception Policy (Fail-Fast Runtime Guard)

All browser E2E test runs (Playwright) must register active listeners on `pageerror` and unhandled rejections. Any uncaught runtime exception or conflicting CSS shorthand warning (`border` vs `borderLeft`) aborts the test run immediately with non-zero exit code.

### 6. Realistic Fixture Engineering Protocol & Automated Drift Guard

Testing against synthetic "toy" mocks (e.g. `{ id: "test_1", score: 10 }` or single-word strings) produces false confidence and masks real-world rendering regressions.

Whenever a User Story touches persistence, aggregated metric dashboards, domain status filters, or threshold formatting, a realistic fixture in `tests/fixtures/` is mandatory and must satisfy the 4 Core Principles:
1. **Domain Alignment**: Must use authentic domain identifiers from system registries (e.g., `js_basics`, `state_updates`), never synthetic placeholders.
2. **Distribution Variance**: Must span heterogeneous status quadrants (developing, mastery, bonus extra).
3. **Lexical & Structural Realism**: Must contain realistic technical prose with realistic character lengths to validate overflow and layout bounds.
4. **Strict Schema Conformance**: Must parse cleanly via the production backup parser (`parseBackup`).

To prevent fixture drift across schema evolutions, all fixtures are guarded by an automated unit test (`tests/logic/fixtures-contract.test.mjs`) executed on every `npm run test:logic`.

## Consequences

### Positive
* **Elimination of False Greens**: Prevents runtime crashes on populated user databases by verifying nominal and boundary fixtures.
* **Model-Agnostic Repeatability**: Any LLM agent or human engineer can resume verification at the exact stage indicated by the filesystem artifacts.
* **Contract Integrity**: Decouples domain calculations from UI presentation, enforcing clean scalar interfaces.

### Negative / Trade-offs
* **Fixture Maintenance**: Requires authoring and maintaining JSON fixtures in `tests/fixtures/`.
* **Slightly Slower Development Cycle**: Implementation cannot be closed immediately after writing code; it requires generating and executing the explicit `test-plan.md` matrix.
