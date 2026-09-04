---
name: spec-driven-testing
description: Autonomous, stateless verification and testing workflow skill for Spec-Driven Development. Inspects filesystem artifacts in specs/<feature>/ to deterministically infer lifecycle phase, enforces the Universal 4-State Matrix (Empty, Populated, Boundary, Error), validates boundary contracts, exercises branch completeness, and drives self-healing repair loops without conversational memory dependencies.
---

# Spec-Driven Testing & Stateless Verification Workflow

## 1. Core Philosophy: Stateless Agent, Stateful Filesystem (Stigmergy)

This skill operates under the principle that **the filesystem is the single source of truth**. You must never rely on ephemeral conversation context, chat history, or assumptions about what prior agents or steps did. 

Whenever you are invoked to verify, test, or close a feature under `specs/<feature-id>/`, you must inspect the directory and deterministically infer your workflow phase from the state of the files on disk.

---

## 2. Phase Inference Algorithm

Inspect `specs/<feature-id>/` and execute the step corresponding to the first matching state:

### State 0: Uninitialized Specification
- **Condition**: `specs/<feature-id>/spec.md` does NOT exist.
- **Verdict**: Cannot verify an unwritten specification.
- **Action**: Halt. Instruct the user or create `spec.md` first following GitHub Spec Kit standards.

### State 1: Missing Test Plan Artifact
- **Condition**: `specs/<feature-id>/spec.md` exists, but `specs/<feature-id>/test-plan.md` does NOT exist.
- **Verdict**: Feature specification exists, but the formal test matrix has not been derived.
- **Action**:
  1. Read `specs/<feature-id>/spec.md` line-by-line.
  2. Extract all User Stories and numbered Acceptance Scenarios.
  3. Generate `specs/<feature-id>/test-plan.md` using the **Universal 4-State Matrix Template** (Section 3).
  4. Leave all test checklists as unchecked (`- [ ]`).
  5. Commit `test-plan.md` to git.

### State 2: Unimplemented Test Matrix
- **Condition**: `specs/<feature-id>/test-plan.md` exists and contains unchecked boxes (`- [ ]`).
- **Verdict**: The testing strategy is defined, but tests or fixtures remain unwritten.
- **Action**:
  1. Identify the first unchecked requirement in `test-plan.md`.
  2. If it requires a populated or boundary state, check if a matching fixture exists in `tests/fixtures/`. If missing, author the JSON fixture.
  3. Implement the corresponding unit test (in `tests/logic/`) or E2E test (in `tests/e2e/`).
  4. Check the box (`- [x]`) **only after the code is written on disk**.

### State 3: Execution and Verification Gate
- **Condition**: All checklist items in `test-plan.md` are marked (`- [x]`), but test suites have not been executed in the current turn.
- **Verdict**: Tests are authored; proof of execution is required.
- **Action**:
  1. Run the headless logic test suite: `npm run test:logic`.
  2. Run the E2E browser test suite: `npm run test:e2e`.
  3. Ensure the browser runner has `pageerror` listeners active so any unhandled exceptions cause immediate failure.
  4. If all tests exit with code `0`, advance to State 5. If any test fails, proceed to State 4.

### State 4: Self-Healing & Defect Repair
- **Condition**: Test execution failed with non-zero exit code or uncaught exceptions.
- **Verdict**: The implementation violates the specification or boundary contracts.
- **Action**:
  1. Parse the real `stderr` / stack trace from the failure log.
  2. Locate the root cause in the source code (e.g., selector returning an object where a scalar was expected, or conflicting style properties).
  3. Apply the minimal, clean fix conforming to the 150-line constitutional limit.
  4. Re-run `npm run test:logic ; npm run test:e2e`.
  5. Repeat until exit code is `0`.

### State 5: Gate Certification & Sign-off
- **Condition**: All checklist items in `test-plan.md` are marked (`- [x]`) AND all test suites pass with code `0` (0 failures, 0 pageerrors).
- **Verdict**: The feature is fully verified under the standard.
- **Action**:
  1. Append the verification seal to the bottom of `test-plan.md`:
     ```markdown
     ## Gate Certification
     - **Status**: PASSED
     - **Timestamp**: [Current ISO-8601 Date]
     - **Commit**: [Current Git Commit Hash]
     - **Logic Tests**: 100% Passing
     - **E2E Tests**: 100% Passing (0 uncaught exceptions)
     ```
  2. Mark corresponding tasks in `specs/<feature-id>/tasks.md` as completed.

---

## 3. The Universal 4-State Matrix Template

When generating `specs/<feature-id>/test-plan.md`, you must structure each User Story around the 4 Universal States:

```markdown
# Test Plan: [Feature Name]
**Specification Reference**: `specs/<feature-id>/spec.md`

## User Story [N]: [Title]

### 1. Universal State Matrix
- [ ] **State 1: Empty / Cold Start**
  - *Condition*: Storage/database uninitialized, 0 records.
  - *Expected*: Default zero-state UI renders cleanly without errors.
  - *Target Test*: `tests/e2e/...`
- [ ] **State 2: Populated / Nominal**
  - *Condition*: Pre-populated with realistic domain records via fixture.
  - *Expected*: Normal active views, badges, and progress render formatted data.
  - *Target Test*: `tests/e2e/...`
- [ ] **State 3: Boundary / Stress**
  - *Condition*: Maximum allowed values, extreme lengths, edge constraints.
  - *Expected*: Layout and logic remain intact without overflow or truncation errors.
  - *Target Test*: `tests/e2e/...`
- [ ] **State 4: Degraded / Error**
  - *Condition*: Invalid schemas, corrupted storage, or network failures.
  - *Expected*: Non-crashing fallbacks with clear diagnostic UI.
  - *Target Test*: `tests/e2e/...`

### 2. Domain Boundary Contracts (Headless -> Presentation)
- [ ] List every property exposed to UI components and assert scalar primitives:
  - `assert(typeof item.property === "number" || item.property === null)`

### 3. Conditional Branch Completeness
- [ ] Identify every `if/else`, ternary `? :`, or logical `&&` in the UI:
  - [ ] Branch TRUE exercised
  - [ ] Branch FALSE exercised

### 4. Runtime Invariants
- [ ] 0 uncaught exceptions (`pageerror`).
- [ ] 0 style collision warnings.
```

---

## 4. Strict Anti-Fraud Rule (Proof of Execution)

**You are strictly forbidden from checking a box (`- [x]`) in `test-plan.md` based on theoretical reasoning.**
- Every checkmark requires verifiable proof: the corresponding file must exist in the repository, and terminal execution must report a passing status.
