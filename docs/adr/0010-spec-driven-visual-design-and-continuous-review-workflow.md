# ADR 0010 — Spec-Driven Visual Design Engineering, Anti-AI-Slop Standards, and Universal Convergence Loop

- Status: **Accepted**
- Date: 2026-09-06 (Amended: 2026-09-07)
- Deciders: Learning Workspace Core

## Context

Automated coding agents developing user interfaces frequently suffer from **"AI Visual Slop"**, **"Carditis / Div Soup"**, **"Layer-Cake Stacking"**, and **"Premature Implementation Guesswork"**:
1. **Generic AI Aesthetics (AI Slop)**: Defaulting to cookie-cutter layouts, hollow cards with empty dark space ($>40\text{px}$ dead void), uniform borders, repetitive gradient fills, and timid color distribution that destroys semantic meaning.
2. **Micro and Macro Carditis (Layer-Cake Anti-Pattern)**: Wrapping elements in independent bordered containers both at the micro level (boxes within modals) and at the macro level (stacking full-width horizontal slab containers: header + banner + control deck), fragmenting space and consuming >250px of vertical viewport height before reaching primary content.
3. **Widescreen Action Canyons (Fitts's Law Violations)**: Pushing primary CTA buttons to opposite screen edges with `justify-content: space-between` across wide desktop containers, leaving hundreds of pixels of unutilized black void and disconnecting actions from context.
4. **Premature Implementation Guesswork**: Jumping directly into React/JSX code without a rigorously reviewed design blueprint, forcing the developer/agent to invent spacing, colors, layouts, and states on the fly, inevitably resulting in inconsistent UI and bugs.
5. **Review Blindness & Premature Victory**: Reviewing designs superficially in a single pass without adversarial verification, declaring tasks complete while severe usability and visual defects persist.

To elevate visual engineering to the standards of products like Linear, Raycast, and Vercel, visual development must be governed by the same formal rigor as domain logic and testing.

## Decision

### 1. Strict Phase Boundary: Pure Design Engineering
The Visual Design Engineering workflow (`docs/VISUAL_WORKFLOW.md`) is established as a **pure upstream design phase**.
- **Input**: `specs/<feature>/spec.md` + Brand Intent.
- **Outputs**: **EXCLUSIVELY MARKDOWN BLUEPRINTS & AUDIT REPORTS**:
  1. `DESIGN.md` (Design System Foundations & Visual Tokens)
  2. `specs/<feature>/design-spec.md` (Exhaustive, Unambiguous UI/UX Engineering Blueprint)
  3. `specs/<feature>/design-reviews/phase-*.md` (Auditor Gap Analysis & Certification Reports)
- **Zero Code Implementation**: No React/JSX/CSS code in `src/` is authored during this workflow. The downstream implementation phase executes only after the design blueprint is 100% sealed.

### 2. The 4-Phase Universal Convergence Loop & Subagent Pairs
To eliminate self-review bias and ensure multi-perspective rigor, the workflow organizes 43 specialized design skills into 4 authoritative Master Domains, each defended by an adversarial pair of subagents:

```
[Phase 0: Foundations & Tokens] ──► [Phase 1: Feature IA & Layouts]
  - Master Skill: ui-design-foundations     - Master Skill: ui-information-architecture
  - Creator: Visual Foundations Architect  - Creator: Information Architect
  - Auditor: Visual System Auditor         - Auditor: IA & Spatial Layout Auditor
  - Artifact: DESIGN.md                     - Artifact: design-spec.md (Sec A-C)
            │                                         │
            ▼                                         ▼
[Phase 2: Component Patterns & Overlays] ──► [Phase 3: Usability, 5-States & Gate]
  - Master Skill: ui-component-patterns     - Master Skill: ui-quality-and-audit
  - Creator: Component Systems Designer     - Creator: Interaction Specialist
  - Auditor: Component Mechanics Auditor    - Auditor: Accessibility & 5-State Auditor
  - Artifact: design-spec.md (Sec D-E)      - Artifact: design-spec.md (Sec F-H) & Sign-off
```

### 3. The Stigmergic Convergence Loop per Phase
In each phase, the Main Agent drives an iterative loop on disk:
1. **Draft/Patch**: The Creator Subagent writes or patches the target markdown section on disk.
2. **Adversarial Audit**: The Auditor Subagent inspects the artifact against the Master Skill's objective defense checklist and writes a structured Gap Report on disk.
3. **Loop Termination**:
   - If Gaps > 0: Main Agent re-invokes the Creator targeting exclusively the reported gaps.
   - If Gaps == 0 (Score $\ge 9.5 / 10$): Main Agent seals the phase gate and advances to the next phase.

### 4. Mandatory Blueprint Architecture (`specs/<feature>/design-spec.md`)
The resulting blueprint must contain 8 non-negotiable sections:
- **Section A: Exhaustive Information Inventory Matrix (Data & Affordance Manifest)**: `INF-01` to `INF-N` mapping 100% of required fields, counters, and actions from `spec.md`.
- **Section B: Grouping, Hierarchy & Surface Architecture Matrix**: 3 attention levels (Glanceable, Operational, On-demand), Gestalt proximity, zero carditis.
- **Section C: Comparative Structural Evaluation & Trade-off Matrix (Landscape vs. Portrait)**: 2–3 competing layout options evaluated across density, scalability, discoverability, and ergonomics, documenting "The Why".
- **Section D: Component Patterns & Interactive Mechanics**: App shell, strict overlay z-index hierarchy, 6-state buttons with anti-CLS reserved width, single scroll axis containment, tab strip constraints (2-7 max, `flexShrink: 0`).
- **Section E: Universal 5-State Matrix**: Full specifications for Empty, Loading (identical geometric skeletons, CLS < 0.1), Populated, Boundary, and Error (with 1-click remediation).
- **Section F: Accessibility & Usability Assurance**: WCAG 2.2 AA contrast ($ge 4.5:1$), non-color status indicators, `:focus-visible` outline, Nielsen heuristics, recovery toasts.
- **Section G: Design Token Reference**: CSS custom properties, concentric radii formula (`outer = inner + padding`), modular typography scale with tabular figures.
- **Section H: Downstream Implementation Contract**: Guarantees that downstream coding is 100% trivial, deterministic, and free of design ambiguities.

### 5. Downstream Execution & Verification
Once the design blueprint is certified (`<!-- DESIGN_WORKFLOW_COMPLETE -->`), developers or implementation agents execute the code in `src/`, guided by `.agents/skills/spec-driven-testing` to verify logic and integration without improvising UI decisions.

## Consequences

- **Positive**: Eliminates design ambiguities before any code is written; guarantees 100% spec coverage; prevents AI slop, carditis, and layer-cake stacking; provides deterministic, verifiable quality gates.
- **Negative**: Requires upfront investment in thorough blueprint authoring before code execution begins.
- **Compliance**: Enforced via `docs/VISUAL_WORKFLOW.md` and `.agents/skills/`.
