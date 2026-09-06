# ADR 0010 — Spec-Driven Visual Design Engineering, Anti-AI-Slop Standards, and Continuous Review Loop

- Status: **Accepted**
- Date: 2026-09-06
- Deciders: Learning Workspace Core

## Context

Automated coding agents developing user interfaces frequently suffer from **"AI Visual Slop"**, **"Carditis / Div Soup"**, and **"Premature Exit Bias"**:
1. **Generic AI Aesthetics (AI Slop)**: Defaulting to cookie-cutter layouts, hollow cards with empty dark space, uniform borders, repetitive gradient fills, and timid color distribution that destroys semantic meaning.
2. **Carditis / Div Soup**: Wrapping text elements in independent bordered containers inside an already bordered modal or panel, wasting critical vertical viewport height and forcing premature scrollbars.
3. **Premature Victory Declarations**: Agents fixing an isolated bug, performing a superficial self-review, assigning inflated ratings (e.g. 9/10 to a wireframe-grade layout with clipped text), and terminating execution before reaching production-grade engineering standards.
4. **Decoupled Visual Verification**: Screenshots captured randomly without traceability to the formal product specifications (`spec.md`).

To elevate visual engineering to the standards of products like Linear, Raycast, and Vercel, visual development must be governed by the same formal rigor as domain logic and testing.

## Decision

### 1. 100% Spec Traceability Contract
Visual coverage cannot be arbitrary. Every single User Story (US1 through US7) and Acceptance Scenario defined in `specs/001-clean-workspace-v2/spec.md` must map 1:1 to a designated visual capture in `tmp/showcase/`. The capture nomenclature must be deterministic:
`US<#>-Scen<##>-<State>-<Viewport>-<Slug>.png`

### 2. The 4-Phase Visual Design Lifecycle

The visual workflow is structured into four mandatory, non-overlapping phases:

```
[Phase 1: Design Planning & Blueprint from Scratch]
       │  Artifact: specs/<feature>/design-spec.md
       ▼
[Phase 2: Implementation Guided by Blueprint]
       │  Quality Gates: ≤ 150 lines (audit-lines.mjs), 100% tests
       ▼
[Phase 3: The Continuous Capture, Audit & Refactor Loop] ◄────────┐
       │  - Deterministic capture mapped to specs                 │ (If any view < 9.0)
       │  - Mandatory inspection against Negative Invariants      │
       │  - Atomic refactor & quality re-verification             │
       ▼                                                          │
(Did 100% of views score ≥ 9.0?) ───[NO]──────────────────────────┘
       │
      [YES]
       ▼
[Phase 4: Second Independent Verification Pass (Gate Certification)]
       │  Re-audit from scratch to eliminate confirmation bias
       ▼
  [GOAL COMPLETE]
```

### 3. Integration of Anthropic "Frontend Design" (Anti-AI-Slop) Principles
The workflow incorporates the official Anthropic `frontend-design` standards:
- **Controlled Density**: Interfaces for technical practitioners must balance whitespace with meaningful density. Zero empty voids ($> 40\,\text{px}$) inside cards; cards must convey summary, status, and context without filler divs.
- **Dominant Colors with Sharp Accents**: Category identity colors (cyan, amber, violet, emerald) are immutable anchors and must NEVER be overwritten by completion or score states. Excellence scores (100+) use sharp gold badge accents (`★ 120/120`) without repainting the entire card.
- **Editorial Typography & Hierarchy**: Contrast achieved through typographic scale, weight, and subtle divider rules (`border-bottom: 1px solid var(--border-line)`), never by boxing paragraphs in separate cards.
- **Invisible Polish (Design Engineering)**: Horizontal scroll with mousewheel (`onWheel`), smooth edge gradient masks (`mask-image: linear-gradient(...)`) instead of hard truncation, and cross-browser slim scrollbars.

### 4. The 5 Negative Invariants (Disqualifying Defects)
A view CANNOT score $\ge 9.0$ if it violates any of the following 5 invariants:
1. **Clipping / Amputation**: Labels, chips, or buttons cut off horizontally or vertically by `overflow: hidden`.
2. **Flexbox Compression Collapse**: Navigation bars or controls squished due to missing `flex-shrink: 0`.
3. **Carditis / Div Soup**: Floating bordered boxes nested inside an already bordered modal.
4. **Dead Void / Asymmetrical Gap**: $> 40\,\text{px}$ of unutilized empty space in banners or cards.
5. **Color Identity Loss**: Category accent bars replaced or overridden by status states.
*Violation of $\ge 1$ invariant automatically caps the view at $\le 7.0 / 10$ (or $\le 5.0 / 10$ if structural/layout failure).*

### 5. Single Entrypoint Contract for `/goal`
A formal, self-contained entrypoint document is established at `docs/VISUAL_WORKFLOW.md`. The `/goal` command executes this document sequentially from Phase 1 to Phase 4, terminating ONLY when Phase 4 is certified with evidence.

## Consequences

- **Positive**: Eliminates premature victory declarations; enforces Linear/Raycast design quality; guarantees 100% spec coverage; preserves constitutional code limits.
- **Negative**: Increases iteration cycles during visual refactors; requires strict discipline in screenshot review.
- **Compliance**: Enforced via automated scripts (`audit-lines.mjs`, `test:logic`, Playwright E2E, and `capture-showcase.mjs`).
