# AGENTS.md — Repository Agent Guidelines & Workflow Index

Welcome to **Learning Workspace**. This document defines the operating principles, core constraints, available workflows, and specialized skills for AI coding agents operating in this repository.

---

## 1. Core Operating Principles

1. **Stateless Agent, Stateful Filesystem (Stigmergy)**:
   - Agents must never rely on ephemeral conversational memory, chat history, or unverified assumptions.
   - The filesystem is the single source of truth. Every decision, specification, review, and test record must be persisted to disk.

2. **Separation of Concerns: Design Phase vs. Implementation Phase**:
   - **Design Phase** (`docs/VISUAL_WORKFLOW.md`): Strictly produces Markdown artifacts (`DESIGN.md`, `specs/<feature>/design-spec.md`, and Gap Reports). **ZERO CODE IMPLEMENTATION IN `src/`**.
   - **Implementation Phase** (Spec-Driven Development): Developers implement code strictly and trivially to the letter of the sealed design blueprint.

3. **Strict Code & Line Count Guardrails**:
   - Every source file in `src/` must strictly adhere to **$\le 150$ lines of code**.
   - Verified via: `node scripts/audit-lines.mjs` (0 violations tolerated).

4. **Anti-AI-Slop Visual Standards**:
   - Aesthetic: **Dark Engineering Editorial** (Linear / Raycast / Vercel level).
   - Rules: Controlled Density (no hollow voids $>40\text{px}$), Zero Carditis (no nested boxes inside modals/panels), Immutable Category Colors, Tabular Monospace Metrics (`font-variant-numeric: tabular-nums`), and Concentric Radii (`outer = inner + padding`).

---

## 2. Standard Autonomous Workflows

| Workflow | Entrypoint Document | Purpose & Scope |
|:---|:---|:---|
| **Visual Design Engineering** | [`docs/VISUAL_WORKFLOW.md`](./docs/VISUAL_WORKFLOW.md) | Autonomous 4-phase design convergence loop. Deconstructs `spec.md` into an exhaustive, unambiguous visual blueprint before any code is written. |
| **Spec-Driven Testing & Verification** | [`.agents/skills/spec-driven-testing/SKILL.md`](./.agents/skills/spec-driven-testing/SKILL.md) | Autonomous verification workflow. Enforces the Universal 4-State Matrix, Realistic Fixture Protocol, boundary testing, and self-healing loops. |

---

## 3. Master Skills Registry (`.agents/skills/`)

The repository equips agents with 5 authoritative Master Skills:

1. **`ui-design-foundations`** ([`.agents/skills/ui-design-foundations/SKILL.md`](./.agents/skills/ui-design-foundations/SKILL.md)):
   - *Constituent Domains (10)*: `brand-visual-language`, `color-mode-and-theme`, `algorithmic-color-palette`, `modular-scale-typography`, `elevation-and-depth`, `sizing-units`, `authentic-product-representation`, `clone-website`, `generate-ui-from-brand`, `extract-design`.
   - *Role*: Governs system tokens, typography scales, concentric radii, and `DESIGN.md`.

2. **`ui-information-architecture`** ([`.agents/skills/ui-information-architecture/SKILL.md`](./.agents/skills/ui-information-architecture/SKILL.md)):
   - *Constituent Domains (9)*: `information-architecture`, `gestalt-ui-organisation`, `ui-density`, `layout-paradigms-and-consistency`, `responsive-paradigms`, `visual-emphasis-and-hierarchy`, `ui-context-and-scope`, `user-flows-and-guided-paths`, `dembrandt`.
   - *Role*: Governs 3 attention levels, Gestalt grouping, comparative layout evaluations (Landscape vs Portrait), and Sections A-C of `design-spec.md`.

3. **`ui-component-patterns`** ([`.agents/skills/ui-component-patterns/SKILL.md`](./.agents/skills/ui-component-patterns/SKILL.md)):
   - *Constituent Domains (15)*: `app-shell`, `global-toolbar-controls`, `modal-and-overlay-patterns`, `tab-navigation`, `button-states`, `form-design`, `scroll-areas`, `sticky-and-fixed-elements`, `component-family-consistency`, `repeated-component-alignment`, `coordinated-data-views`, `data-display-and-selection`, `domain-expert-configuration`, `operational-expert-tool-ui`, `real-world-metaphors`.
   - *Role*: Governs app shell, overlay z-index hierarchy, 6-state buttons with anti-CLS reserved width, single scroll axis containment, and Sections D-E of `design-spec.md`.

4. **`ui-quality-and-audit`** ([`.agents/skills/ui-quality-and-audit/SKILL.md`](./.agents/skills/ui-quality-and-audit/SKILL.md)):
   - *Constituent Domains (9)*: `nielsen-usability-heuristics`, `notifications-and-recovery`, `loading-states-and-perceived-performance`, `wcag-accessibility`, `status-colors-and-errors`, `performance-and-web-vitals`, `micro-interactions`, `motion-and-storytelling`, `semantic-html-and-seo`.
   - *Role*: Governs Universal 5-State Matrix, WCAG 2.2 AA contrast, identical geometric skeletons, Nielsen heuristics, and Sections F-H of `design-spec.md`.

5. **`spec-driven-testing`** ([`.agents/skills/spec-driven-testing/SKILL.md`](./.agents/skills/spec-driven-testing/SKILL.md)):
   - *Role*: Autonomous testing engine, fixture engineering protocol, and test plan certification.

---

## 4. Subagent Roles & The Adversarial Review Protocol

To prevent self-review bias and hallucinated quality, workflows employ **adversarial agent pairs**:
- **Creator Subagent**: Generates, expands, or patches the markdown blueprint on disk using its assigned domain skill.
- **Auditor Subagent**: Evaluates the disk artifact against an objective, non-negotiable checklist, emitting a numerical score and an explicit Gap Report on disk.
- **Convergence**: The Main Agent iterates the Creator on unresolved gaps until the Auditor certifies Score $\ge 9.5 / 10$ and 0 gaps, sealing the phase gate.

---

## 5. Quality Verification Commands

Before concluding any implementation task or submitting changes:
```bash
# 1. Audit file line limits (mandatory ≤ 150 lines in src/)
node scripts/audit-lines.mjs

# 2. Run domain and logic unit tests
npm run test:logic

# 3. Compile distribution build
npm run build

# 4. Execute Playwright end-to-end test suite
npx playwright test
```
