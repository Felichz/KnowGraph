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

### 2. The 3-Phase Visual Design Lifecycle

The visual workflow is structured into three mandatory, non-overlapping phases:

```
[Phase 1: Design Planning & Blueprint from Scratch]
       │  Artifact: specs/<feature>/design-spec.md
       ▼
[Phase 2: Implementation Guided by Blueprint]
       │  Quality Gates: ≤ 150 lines (audit-lines.mjs), 100% tests
       ▼
[Phase 3: Continuous Capture & 4-Pass Review Loop] ◄───────────────┐
       │  - Deterministic capture mapped to specs                 │ (If any pass < 9.0)
       │  - 4 Sequential Independent Review Passes                │
       │  - Atomic refactor & quality re-verification             │
       ▼                                                          │
(Did 100% of views score ≥ 9.0 in ALL 4 passes?) ───[NO]──────────┘
       │
      [YES]
       ▼
  [GOAL COMPLETE]
```

### 3. Integration of Anthropic "Frontend Design" (Anti-AI-Slop) Principles
The workflow incorporates the official Anthropic `frontend-design` standards:
- **Anti-Layer-Cake Layout**: Primary navigation and controls must be an integrated surface or vertical sidebar. Stacking multiple full-width bordered rectangles on the main canvas is strictly prohibited.
- **Controlled Density**: Interfaces for technical practitioners must balance whitespace with meaningful density. Zero empty voids ($> 40\,\text{px}$) inside cards; cards must convey summary, status, and context without filler divs.
- **Action-Context Cohesion (Fitts's Law)**: Actions must be grouped with their context, prohibiting `space-between` canyons (>350px dead void across wide desktop viewports).
- **Dominant Colors with Sharp Accents**: Category identity colors (cyan, amber, violet, emerald) are immutable anchors and must NEVER be overwritten by completion or score states. Excellence scores (100+) use sharp gold badge accents (`★ 120/120`) without repainting the entire card border.
- **Editorial Typography & Hierarchy**: Contrast achieved through typographic scale, weight, and subtle divider rules, never by boxing paragraphs in separate floating cards.
- **Invisible Polish (Design Engineering)**: Horizontal scroll with mousewheel (`onWheel`), smooth edge gradient masks (`mask-image: linear-gradient(...)`) instead of hard truncation, and cross-browser slim scrollbars.

### 4. The 4 Independent Review Passes by Perspective
To eliminate cognitive bias and review blindness, every capture is audited through 4 sequential, independent perspectives:
1. **Pass 1: Macro-Architecture & Viewport (Telescope)**: Anti-Layer-Cake (zero stacked horizontal slab boxes), 70% Viewport Rule (controls $\le 130\text{px}$ vertical, $\ge 2$ full card rows visible without scroll), Anti-Canyon (`space-between` gap $\le 350\text{px}$). *Cap: $\le 6.5 / 10$*.
2. **Pass 2: Component Micro-Density & Anti-Carditis (Microscope)**: Controlled Density (zero hollow voids $>40\text{px}$), Anti-Carditis (zero nested decorative cards in modals), Flexbox Protection (`flexShrink: 0`). *Cap: $\le 7.0 / 10$*.
3. **Pass 3: Color Semantics & Atmosphere (Colorist)**: Category Color Invariance, Sharp Accents vs. Christmas Tree (no full border repainting by score). *Cap: $\le 8.0 / 10$*.
4. **Pass 4: Touch Ergonomics, Mobile & Edge Cases (Tactile)**: Mobile Touch Targets ($\ge 44\times 44\text{px}$), Safe Areas ($70\text{px}$ bottom nav padding), Calibrated Gradient Masks, Contained Zen Mode reading line-length. *Cap: $\le 8.0 / 10$*.

### 5. Single Entrypoint Contract for `/goal`
A formal, self-contained entrypoint document is established at `docs/VISUAL_WORKFLOW.md`. The `/goal` command executes this document sequentially from Phase 1 to Phase 3, terminating ONLY when all views score $\ge 9.0$ across all 4 review passes.

## Consequences

- **Positive**: Eliminates premature victory declarations; enforces Linear/Raycast design quality; guarantees 100% spec coverage; separates macro-architectural critique from micro-detail polishing.
- **Negative**: Increases iteration cycles during visual refactors; requires strict discipline in screenshot review.
- **Compliance**: Enforced via automated scripts (`audit-lines.mjs`, `test:logic`, Playwright E2E, and `capture-showcase.mjs`).
