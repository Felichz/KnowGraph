# ADR 0006 — Dual-Tier Canonical Evaluation Scale (0–120) with Golden Excellence Tier

- Status: **Accepted**
- Date: 2026-09-04
- Deciders: Learning Workspace Core

## Context

Most learning platforms and LLM evaluation tools employ a standard 0–100 percentage scale. In technical engineering interview preparation, this introduces two structural failures:

1. **LLM Grade Inflation**: Language models routinely award 90–100 scores to passable or superficially correct answers that merely parrot standard concept definitions.
2. **Lack of Differentiation between "Sufficient" and "Senior/Staff Mastery"**:
   - In technical interviews, accurately explaining what a Hook is or how a Rails migration runs represents table stakes baseline knowledge (sufficient).
   - However, to qualify for *Senior*, *Lead*, or *Staff* levels, interviewers look for deep runtime comprehension (e.g., how the Fiber Reconciler schedules concurrent priority lanes, GC allocation pressures, or query planner execution costs).

If 100 points represents the ceiling, candidates settle for the textbook definition, and the platform loses its capacity to coach candidates toward true technical depth.

## Decision

We established a **Canonical 0–120 Scale** partitioned into two distinct conceptual tiers:

### 1. Base Technical Sufficiency Tier (0 to 100 Points)
* **100 Points**: Represents thorough, accurate coverage of the standard lesson curriculum.
* Satisfying all four core rubric dimensions (technical accuracy, causality/trade-offs, practical code application, and edge-case completeness) unlocks **Base Mastery (`isMastery = true`)**.
* Rendered in the UI with standard clean palette tokens (category cyan and success emerald).

### 2. Optional Golden Excellence Bonus Tier (101 to 120 Points)
* Points 101 to 120 are strictly reserved for answers demonstrating low-level runtime engine architecture, memory allocation trade-offs, or advanced concurrency considerations beyond the basic lesson scope.
* Visualized via specialized UI affordances:
  - **Golden Excellence Aura (`boxShadow` in warm amber/gold)** on graph nodes and evaluation headers.
  - **Star Designation (`★ 108/120`)** across canvases, cards, and badges.
  - **Dual Concentric Progress Rings (`CoverageRings`)**: Inner ring represents 0–100 baseline in category colors; outer concentric gold ring draws exclusively for points 101 through 120.

## Consequences

### Positive
* **Counters Complacency**: Candidates achieving 95 recognize they have a solid foundation while remaining aware of deeper runtime internals that distinguish top-tier candidates before hiring bars.
* **Non-Intrusive Affirmation**: The golden aura delivers meaningful visual reward without corrupting the technical, clean aesthetic of the workspace.

### Accepted Costs and Limitations
* **Deviation from Familiar 100-Point Convention**: Requires the UI to clarify that 100 represents full curricular mastery and 101–120 is bonus depth, ensuring candidates do not perceive a 95/120 as a deficient score.
