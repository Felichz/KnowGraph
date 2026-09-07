# Visual UI/UX Design Engineering & Blueprint Workflow

**Master Workflow Entrypoint Document for `/goal`**  
**Reference**: [ADR 0010 — Spec-Driven Visual Design Engineering](./adr/0010-spec-driven-visual-design-and-continuous-review-workflow.md)  
**Governing Criteria**: [docs/DESIGN_CRITERIA.md](./DESIGN_CRITERIA.md)  
**System Foundations**: [DESIGN.md](../DESIGN.md) *(Generado en Fase 0)*  
**Input Specification**: `specs/<feature>/spec.md`  
**Target Output Artifact**: `specs/<feature>/design-spec.md`  

---

## 1. Goal Execution Contract & Scope Boundary

> [!IMPORTANT]
> **STRICT SCOPE BOUNDARY: EXCLUSIVELY THE DESIGN PHASE**  
> This workflow governs the **pure visual and interaction design phase** that bridges a product specification (`spec.md`) and software implementation.  
> **Output Artifacts are EXCLUSIVELY MARKDOWN DOCUMENTS**:
> 1. `DESIGN.md` (Design System Foundations & Visual Tokens)
> 2. `specs/<feature>/design-spec.md` (Exhaustive, Unambiguous UI/UX Engineering Blueprint)
> 3. `specs/<feature>/design-reviews/phase-*.md` (Auditor Gap Analysis & Certification Reports)
> 
> **ZERO CODE IMPLEMENTATION**: No files in `src/`, no React components, and no test code are authored in this workflow. Downstream implementation begins only after this design blueprint is 100% sealed.

When invoking `/goal` with this workflow, the orchestrating agent executes the **4-Phase Universal Convergence Loop** sequentially without stopping or declaring premature victory. The goal concludes **ONLY** when all 4 Phase Gates are formally sealed on disk with zero unresolved gaps.

```
                                  THE UNIVERSAL CONVERGENCE LOOP
                                  
    ┌────────────────────────────────────────────────────────────────────────┐
    │                                                                        │
    │  [Creator Subagent] ──► Writes/Patches Artifact on Disk               │
    │                               │                                        │
    │                               ▼                                        │
    │  [Auditor Subagent] ──► Runs Adversarial Defense Checklist             │
    │                               │                                        │
    │                               ▼                                        │
    │                 Emits [Gap Report on Disk]                             │
    │                               │                                        │
    │                     ¿Existen brechas / Gaps > 0?                       │
    │                              /        \                                │
    │                           [SÍ]        [NO (Gaps = 0 & Score ≥ 9.5)]    │
    │                            │                      │                    │
    │  [Re-invocar Creator] ◄────┘                      ▼                    │
    │   (Objetivo: parchear gaps)               [SELLO DE FASE]             │
    │                                                   │                    │
    └───────────────────────────────────────────────────┼────────────────────┘
                                                        │
                   ┌────────────────────────────────────┴────────────────────┐
                   ▼                                                         ▼
              [Avanzar a Siguiente Fase]                    [FASE 3 CERTIFICADA: GOAL_COMPLETE]
```

---

## 2. The 4 Master Design Domains & Subagent Archetypes

The workflow fuses 43 specialized visual design skills into 4 authoritative Master Domains located in `.agents/skills/`. Each phase is driven by an adversarial pair of subagents:

| Phase | Master Skill | Creator Subagent Role | Auditor Subagent Role | Target Artifact |
|:---|:---|:---|:---|:---|
| **Phase 0** | `ui-design-foundations` | `Visual Foundations Architect` | `Visual System Auditor` | `DESIGN.md` |
| **Phase 1** | `ui-information-architecture` | `Information Architect` | `IA & Spatial Layout Auditor` | `design-spec.md` (Sec A-C) |
| **Phase 2** | `ui-component-patterns` | `Component Systems Designer` | `Component Mechanics & Overlay Auditor` | `design-spec.md` (Sec D-E) |
| **Phase 3** | `ui-quality-and-audit` | `Interaction & Usability Specialist` | `Accessibility & 5-State Quality Auditor` | `design-spec.md` (Sec F-H) |

---

## 3. Detailed Phase Specifications

### Phase 0: Design Foundations & System Architecture
- **Objective**: Establish or verify the project's visual system, creative North Star, token architecture, and brand personality. If `DESIGN.md` does not exist, author it from scratch; if it exists, audit and calibrate it against the feature's requirements.
- **Governing Skill**: `.agents/skills/ui-design-foundations/SKILL.md`
- **Constituent Skills (10)**: `brand-visual-language`, `color-mode-and-theme`, `algorithmic-color-palette`, `modular-scale-typography`, `elevation-and-depth`, `sizing-units`, `authentic-product-representation`, `clone-website`, `generate-ui-from-brand`, `extract-design`.
- **Mandatory Output**: `DESIGN.md` in repo root.
- **Auditor Quality Gate Checklist**:
  - [ ] **Visual Tone Consistency**: Do border-radii, typography, and iconography strictly match the defined brand personality?
  - [ ] **Concentric Radii Formula**: Is `outerRadius = innerRadius + padding` strictly respected across nested cards and containers?
  - [ ] **Color Palette Discipline**: Is the functional accent color restricted to < 5% of the visual field?
  - [ ] **Modular Typography Scale**: Are type sizes adhering to an exact geometric ratio with explicit rem/px tokens and tabular figures for numbers?
  - [ ] **Elevation & Depth**: Are shadow layers subtle (2-3 layers), directional, with dark mode utilizing surface lightness over drop shadows?
  - [ ] **Sizing & Spacing Units**: Are all paddings, margins, and gaps pegged to a rigid 4px/8px grid system?
  - [ ] **Authentic Product Representation**: Are all visuals, placeholders, and mockups grounded in realistic domain fixtures rather than generic placeholder text?
- **Convergence Condition**: Auditor emits `specs/<feature>/design-reviews/phase-0-audit.md` with Score $\ge 9.5 / 10$ and 0 gaps.

---

### Phase 1: Feature Information Architecture & Spatial Hierarchy
- **Objective**: Deconstruct `specs/<feature>/spec.md` into an exhaustive data manifest, cluster data into unified surfaces, and conduct comparative structural evaluations (Landscape vs Portrait) documenting "The Why".
- **Governing Skill**: `.agents/skills/ui-information-architecture/SKILL.md`
- **Constituent Skills (9)**: `information-architecture`, `gestalt-ui-organisation`, `ui-density`, `layout-paradigms-and-consistency`, `responsive-paradigms`, `visual-emphasis-and-hierarchy`, `ui-context-and-scope`, `user-flows-and-guided-paths`, `dembrandt`.
- **Mandatory Output Sections in `specs/<feature>/design-spec.md`**:
  1. **Section A: Exhaustive Information Inventory Matrix (Data & Affordance Manifest)**:
     - Numbered inventory table (`INF-01` to `INF-N`) covering every single data point, label, counter, status dot, and button required across all User Stories. Cero omissions.
  2. **Section B: Grouping, Hierarchy & Surface Architecture Matrix**:
     - Mapping of inventory items into unified visual organisms.
     - Enforcement of Gestalt proximity over divider lines; complete eradication of nested carditis (*cajas dentro de cajas*).
     - Partitioning into 3 Attention Levels: Glanceable (<1s), Operational (1-5s), and On-demand (>5s).
  3. **Section C: Comparative Layout Evaluations & Trade-offs (Landscape vs Portrait)**:
     - For every macro organism, formulation and side-by-side comparison of 2–3 structural layout paradigms for both **Landscape (Desktop 1440×900)** and **Portrait (Mobile 390×844)**.
     - Evaluation against: Viewport Height Cost, Scalability ($N$ items), Discoverability (Anti-Hidden-Affordance), Pointer/Touch Ergonomics, and Cognitive Load.
     - Explicit documentation of the winning paradigm and "The Why".
- **Auditor Quality Gate Checklist**:
  - [ ] **100% Spec Data Coverage**: Does the inventory matrix capture all user stories and acceptance criteria without omission?
  - [ ] **Anti-Layer-Cake Layout**: Are top controls and bars $\le 130\text{px}$ total, reserving $\ge 70\%$ of the viewport for primary content?
  - [ ] **Anti-Canyon (Fitts's Law)**: Are actions coupled to their target context, eliminating wide `space-between` voids (>350px)?
  - [ ] **Anti-Hidden-Affordance**: Are all categories and primary navigation options 100% visible on desktop without forced horizontal mouse dragging?
  - [ ] **Mobile Thumb Ergonomics**: Does mobile layout adapt to single-column/bottom navigation within the natural thumb zone?
- **Convergence Condition**: Auditor emits `specs/<feature>/design-reviews/phase-1-audit.md` with Score $\ge 9.5 / 10$ and 0 gaps.

---

### Phase 2: Component Patterns & Interactive Mechanics
- **Objective**: Specify the exact component mechanics, app shell layout, overlay z-index hierarchy, button 6-state lifecycles, form inputs, and scroll containment rules.
- **Governing Skill**: `.agents/skills/ui-component-patterns/SKILL.md`
- **Constituent Skills (15)**: `app-shell`, `global-toolbar-controls`, `modal-and-overlay-patterns`, `tab-navigation`, `button-states`, `form-design`, `scroll-areas`, `sticky-and-fixed-elements`, `component-family-consistency`, `repeated-component-alignment`, `coordinated-data-views`, `data-display-and-selection`, `domain-expert-configuration`, `operational-expert-tool-ui`, `real-world-metaphors`.
- **Mandatory Output Sections in `specs/<feature>/design-spec.md`**:
  1. **Section D: Component Patterns & Interactive Mechanics**:
     - **App Shell Architecture**: Header height, canvas containment, sticky positioning, drawer sliding mechanics.
     - **Overlay & Z-Index Hierarchy**: Strict z-index ladder (Tooltip $\to$ Popover $\to$ Drawer $\to$ Modal $\to$ Fullscreen) with mandatory background scroll-locking (`overflow: hidden` on body).
     - **Button 6-State Completeness**: Full specifications for Default, Hover, Active, Focus-visible, Disabled, and Loading states with reserved button width to prevent Cumulative Layout Shift (CLS).
     - **Scroll Containment**: Single scroll axis per container; elimination of nested scroll traps; custom invisible scrollbar styling.
     - **Tab Navigation Invariants**: Maximum 2–7 tabs, `flexShrink: 0` on tab strip, scrolling constrained strictly to the content panel.
     - **Explicit Control Sizing**: Touch targets $\ge 44\text{px}$ on mobile, $\ge 32\text{px}$ on desktop.
     - **Coordinated Data Views**: Bidirectional state synchronization between complementary representations (e.g. Grid vs SVG Topology vs Flashcards).
- **Auditor Quality Gate Checklist**:
  - [ ] **Overlay Hierarchy & Z-Index**: Are overlay levels strictly structured with background scroll-locking?
  - [ ] **Button 6-State Completeness**: Are all 6 states specified with anti-CLS reserved dimensions?
  - [ ] **Scroll Containment**: Is there strictly a single scroll axis per container, preventing nested scroll traps?
  - [ ] **Tab Bar Limits**: Are tab strips limited to 2-7 items with `flexShrink: 0` protection?
  - [ ] **Explicit Control Heights**: Are all interactive elements assigned explicit min-height tokens?
- **Convergence Condition**: Auditor emits `specs/<feature>/design-reviews/phase-2-audit.md` with Score $\ge 9.5 / 10$ and 0 gaps.

---

### Phase 3: Usability, 5-State Matrix & Verification Gate
- **Objective**: Define the Universal 5-State Matrix, specify identical geometric skeletons, audit against WCAG 2.2 AA accessibility, Nielsen usability heuristics, notification recovery, and deliver the final signed design certificate.
- **Governing Skill**: `.agents/skills/ui-quality-and-audit/SKILL.md`
- **Constituent Skills (9)**: `nielsen-usability-heuristics`, `notifications-and-recovery`, `loading-states-and-perceived-performance`, `wcag-accessibility`, `status-colors-and-errors`, `performance-and-web-vitals`, `micro-interactions`, `motion-and-storytelling`, `semantic-html-and-seo`.
- **Mandatory Output Sections in `specs/<feature>/design-spec.md`**:
  1. **Section E: Universal 5-State Matrix**:
     - Exact visual geometry and messaging for:
       * **Empty State**: Pedagogical illustration, contextual explanation, and single clear primary CTA.
       * **Loading State**: Identical geometric skeleton matching exact dimensions and radii of resolved content (CLS < 0.1).
       * **Populated State**: Standard high-density data representation.
       * **Boundary State**: Maximum load, 100% completion (e.g. score `120/120`), long localized strings, narrowest supported viewport.
       * **Error State**: Non-technical explanation of failure, non-destructive fallback, and actionable one-click recovery button.
  2. **Section F: Accessibility & Usability Assurance (WCAG 2.2 AA & Nielsen)**:
     - Color contrast audit table: All text $\ge 4.5:1$ (large text $\ge 3:1$).
     - Non-color status indicators: Color is never the sole carrier of status (shape, text, icon reinforcement).
     - Focus-visible specification: 2px high-contrast outline with 2px offset on keyboard navigation.
     - Notification & Recovery: Destructive actions feature undo toasts in bottom-right with 5-second persistence.
  3. **Section G: Design Token Reference & Implementation Blueprint**:
     - Exhaustive CSS custom properties, typography scales, spacing scale, concentric radii mapping, and color variables.
  4. **Section H: Downstream Implementation & Verification Contract**:
     - Verification checklist for frontend developers to execute implementation strictly to the letter with zero ambiguities.
- **Auditor Quality Gate Checklist**:
  - [ ] **Universal 5-State Matrix**: Are Empty, Loading, Populated, Boundary, and Error states exhaustively visualized?
  - [ ] **Identical Geometric Skeletons**: Do skeleton loaders match exact container geometry to eliminate layout shift?
  - [ ] **Notification & Recovery**: Are destructive actions protected by undo patterns or explicit confirmation?
  - [ ] **WCAG 2.2 AA Compliance**: Do contrast ratios meet $\ge 4.5:1$, with visible focus rings and non-color cues?
  - [ ] **Actionable Error Recovery**: Does every error state provide an immediate recovery mechanism?
- **Convergence Condition**: Auditor emits `specs/<feature>/design-reviews/phase-3-audit.md` with Score $\ge 9.5 / 10$ and 0 gaps, certifying `<!-- DESIGN_WORKFLOW_COMPLETE -->`.

---

## 4. Standard Gap Report Artifact Schema

Every Auditor Subagent must write its audit findings to disk at `specs/<feature>/design-reviews/phase-<0-3>-audit.md` strictly conforming to this schema:

```markdown
# Phase <X> Audit & Gap Report: <Phase Name>

- **Feature**: <feature-slug>
- **Auditor Subagent**: <Auditor Role>
- **Governing Master Skill**: <Master Skill Name>
- **Target Artifact Audited**: <Path to Artifact>
- **Iteration**: <Iteration Number>
- **Audit Date**: <ISO Timestamp>

## 1. Quantitative Score & Gate Verdict

- **Overall Score**: <X.X> / 10.0
- **Total Unresolved Gaps**: <N>
- **Gate Status**: [SEALED | NEEDS_REVISION]

*(Gate Status is SEALED strictly when Score >= 9.5 / 10.0 AND Total Unresolved Gaps == 0)*

## 2. Master Defense Checklist Evaluation

| # | Criterion | Result | Evidence / Finding |
|:---:|:---|:---:|:---|
| 1 | <Checklist Item 1> | PASS / FAIL | <Brief justification> |
| 2 | <Checklist Item 2> | PASS / FAIL | <Brief justification> |
...

## 3. Itemized Gap Analysis (Required if Gaps > 0)

| Gap ID | Severity | Section / Line | Deficiency Description | Concrete Remediation Required |
|:---|:---:|:---|:---|:---|
| GAP-01 | [CRITICAL | MAJOR | MINOR] | <Ref> | <What is missing or non-compliant> | <Exact change or formula required> |

## 4. Auditor Final Remarks & Instructions for Creator
<Instructions to pass back to the Creator Subagent for targeted patching>
```

---

## 5. Operational Subagent Invocation Guide

When running this workflow as the Main Orchestrator Agent (e.g. under `/goal docs/VISUAL_WORKFLOW.md`):

### Step-by-Step Subagent Invocation Loop:
1. **Launch Creator**: Invoke the designated Creator Subagent using `invoke_subagent`, referencing the governing Master Skill path (e.g. `.agents/skills/<skill-name>/SKILL.md`) and directing it to write or patch the target artifact on disk.
2. **Launch Auditor**: Upon Creator completion, invoke the corresponding Auditor Subagent using `invoke_subagent`. The Auditor must view the artifact on disk, evaluate all checklist criteria, and write the Gap Report to `specs/<feature>/design-reviews/phase-<X>-audit.md`.
3. **Evaluate Disk State (Stigmergy)**: The Main Agent inspects the generated Gap Report:
   - If `Gate Status: NEEDS_REVISION` (or Gaps > 0): Send a targeted revision message or re-invoke the Creator with the exact `GAP-XX` items. Repeat review until certified.
   - If `Gate Status: SEALED` (Score $\ge 9.5$ and Gaps == 0): The phase gate is locked. Advance to the next phase.
4. **Final Closure**: When Phase 3 is sealed, the Main Agent outputs the final summary with `<!-- DESIGN_WORKFLOW_COMPLETE -->`.

---

## 6. Downstream Developer Handoff Contract

When this workflow completes:
1. `DESIGN.md` and `specs/<feature>/design-spec.md` constitute the **complete, sealed single source of visual truth**.
2. Any frontend engineer or code-generation agent can take these artifacts and implement the user interface **trivially and mechanically**:
   - Zero layout guessing.
   - Zero color improvisation.
   - Zero omitted states (Loading, Empty, Boundary, Error are already drawn).
   - Zero ambiguous breakpoints or touch target sizes.
3. Downstream implementation is verified against the blueprints using standard testing workflows (such as `.agents/skills/spec-driven-testing`).
