# ADR 0010 — Spec-Driven Visual Design Engineering, Anti-AI-Slop Standards, and Continuous Review Loop

- Status: **Accepted**
- Date: 2026-09-06
- Deciders: Learning Workspace Core

## Context

Automated coding agents developing user interfaces frequently suffer from **"AI Visual Slop"**, **"Carditis / Div Soup"**, **"Layer-Cake Stacking"**, and **"Review Blindness via Cognitive Blending"**:
1. **Generic AI Aesthetics (AI Slop)**: Defaulting to cookie-cutter layouts, hollow cards with empty dark space, uniform borders, repetitive gradient fills, and timid color distribution that destroys semantic meaning.
2. **Micro and Macro Carditis (Layer-Cake Anti-Pattern)**: Wrapping elements in independent bordered containers both at the micro level (cajas within modals) and at the macro level (stacking full-width horizontal slab containers: header + banner + control deck), fragmenting space and consuming >250px of vertical viewport height before reaching primary content.
3. **Widescreen Action Canyons (Fitts's Law Violations)**: Pushing primary CTA buttons to opposite screen edges with `justify-content: space-between` across >1300px containers, leaving hundreds of pixels of unutilized black void and disconnecting actions from context.
4. **Review Blindness via Cognitive Blending**: Attempting to audit 20 disparate criteria simultaneously in a single review pass causes agents to develop review blindness, awarding 9+ ratings to flawed macro layouts simply because micro-details (e.g. text summaries or monospace numbers) appear refined.
5. **Premature Victory Declarations**: Agents fixing an isolated symptom, performing a superficial self-review, and terminating execution before reaching production-grade engineering standards.
6. **Decoupled Visual Verification**: Screenshots captured randomly without traceability to the formal product specifications (`spec.md`).

To elevate visual engineering to the standards of products like Linear, Raycast, and Vercel, visual development must be governed by the same formal rigor as domain logic and testing.

## Decision

### 1. 100% Spec Traceability Contract
Visual coverage cannot be arbitrary. Every single User Story (US1 through US7) and Acceptance Scenario defined in `specs/001-clean-workspace-v2/spec.md` must map 1:1 to a designated visual capture in `tmp/showcase/`. The capture nomenclature must be deterministic:
`US<#>-Scen<##>-<State>-<Viewport>-<Slug>.png`

### 2. The 3-Phase Visual Design Lifecycle

The visual workflow is structured into three mandatory, non-overlapping phases:

```
[Phase 1: Design Planning, Divergence & Tradeoff Matrix]
       │  - Explore 2-3 IA structural options per macro-organism
       │  - Evaluate Density, Scalability, Discoverability, Ergonomics
       │  - Artifact: specs/<feature>/design-spec.md
       ▼
[Phase 2: Implementation Guided by Blueprint]
       │  Quality Gates: ≤ 150 lines (audit-lines.mjs), 100% tests
       ▼
[Phase 3: Continuous Capture & 4-Pass Review Loop] ◄───────────────┐
       │  - Step 3.2.0: Empirical IA Reconsideration (reality check)│ (If any pass < 9.0
       │  - 4 Sequential Independent Review Passes                │  or IA flaw found)
       │  - Atomic refactor & quality re-verification             │
       ▼                                                          │
(Did 100% of views score ≥ 9.0 in ALL 4 passes?) ───[NO]──────────┘
       │
      [YES]
       ▼
  [GOAL COMPLETE]
```

### 3. Formalized Design Blueprint & Divergent IA Planning Mandate
Agents must never jump directly to code or adopt unconsidered default layouts (such as defaulting to a single-line horizontal tag strip for an arbitrarily sized list of categories, or layer-cake stacked slabs).
In Phase 1, the design blueprint (`specs/<feature>/design-spec.md`) must mandate four formal components:
1. **Section A: Exhaustive Information Inventory Matrix (Data & Affordance Manifest)**:
   Itemizes every required data field, numeric metric, state flag (Empty, Populated, Boundary, Error), status indicator, and interactive affordance mandated by `spec.md` for all User Stories.
2. **Section B: Logical Grouping & Surface Hierarchy Matrix**:
   Maps inventory items into unified visual surfaces and organisms, preventing "carditis / div soup" and hollow containers ($>40\text{px}$ dead void).
3. **Section C: Comparative Structural Evaluation & Trade-off Matrix (Landscape/Desktop vs. Portrait/Mobile)**:
   For every major organism, formulates and compares at least 2–3 layout paradigms across:
   - *Information Density & Viewport Cost* (vertical pixel consumption).
   - *Scalability with $N$ Items* (behavior when items grow from 4 to 10+).
   - *Discoverability & Zero Hidden Affordances* (100% of options visible without forced horizontal scrolling on desktop).
   - *Ergonomics: Desktop Pointer/Mouse vs. Mobile Touch* (mouse click vs. thumb zone $\ge 44\text{px}$).
   - *Cognitive Load & Visual Calm* (avoiding visual fragmentation).
   Declares the winning architecture for both Landscape and Portrait with the explicit rationale ("The Why").
4. **Section D: Review Traceability Protocol**:
   Establishes the Phase 1 blueprint as the immutable audit baseline for Phase 3 review passes, verifying 100% inventory presence and empirically validating layout hypotheses.

### 4. Integration of Anthropic "Frontend Design" (Anti-AI-Slop) Principles
The workflow incorporates the official Anthropic `frontend-design` standards:
- **Anti-Layer-Cake Layout**: Primary navigation and controls must be an integrated surface or vertical sidebar. Stacking multiple full-width bordered rectangles on the main canvas is strictly prohibited.
- **Controlled Density**: Interfaces for technical practitioners must balance whitespace with meaningful density. Zero empty voids ($> 40\,\text{px}$) inside cards; cards must convey summary, status, and context without filler divs.
- **Action-Context Cohesion (Fitts's Law)**: Actions must be grouped with their context, prohibiting `space-between` canyons (>350px dead void across wide desktop viewports).
- **Dominant Colors with Sharp Accents**: Category identity colors (cyan, amber, violet, emerald) are immutable anchors and must NEVER be overwritten by completion or score states. Excellence scores (100+) use sharp gold badge accents (`★ 120/120`) without repainting the entire card border.
- **Editorial Typography & Hierarchy**: Contrast achieved through typographic scale, weight, and subtle divider rules, never by boxing paragraphs in separate floating cards.
- **Zero Hidden Taxonomy Affordance**: Key navigation and filters must be immediately visible without forcing horizontal dragging or obscure scroll gestures on desktop.

### 5. Empirical Architectural Reconsideration & The 4 Review Passes
Before and during the 4 review passes, the agent must perform **Step 3.2.0: Empirical IA Reconsideration**:
- *Did the chosen structure survive contact with real viewports and data?*
- *Are categories clipped? Is horizontal scrolling masking a design failure?*
- If the visual evidence reveals that an assumed structure impairs discoverability or ergonomics, the agent must initiate a structural architectural pivot rather than applying cosmetic patches.

Following this reality check, captures are audited through the 4 sequential independent passes:
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
