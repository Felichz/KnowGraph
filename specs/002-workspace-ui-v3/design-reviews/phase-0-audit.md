# Phase 0 Audit & Gap Report: Design Foundations & System Architecture

- **Feature**: 002-workspace-ui-v3
- **Auditor Subagent**: Visual System Auditor
- **Governing Master Skill**: ui-design-foundations (`.agents/skills/ui-design-foundations/SKILL.md`)
- **Target Artifact Audited**: `DESIGN.md` (v3.1.2)
- **Iteration**: 6
- **Audit Date**: 2026-09-26T00:23:51-03:00

## 1. Quantitative Score & Gate Verdict

- **Overall Score**: 9.6 / 10.0
- **Total Unresolved Gaps**: 0
- **Gate Status**: SEALED

*(Gate Status is SEALED strictly when Score >= 9.5 / 10.0 AND Total Unresolved Gaps == 0)*

**Summary.** GAP-27 is resolved. Hover and press are now defined once and consistently in §1.4 l.157 and §5 l.408: the element's own base surface + overlay; the border changes only if the element already has one; a selected element keeps its `--accent` border. `--accent-line` is removed with no dangling references (grep). The danger-on-tint minimum is corrected to 4.66, which matches the measured value.

A full regression read found no new gaps. DESIGN.md v3.1.2 satisfies every Phase 0 checklist item and every foundation this product needs, with verified numbers throughout. **Phase 0 is sealed.**

### Iteration 5 gap resolution

| Gap | Status | Evidence (Iteration 6) |
|:--|:--:|:--|
| GAP-27 (1) Overlay base surface | RESOLVED | l.157 "sobre su propia superficie base (no la de su anfitrión)"; l.408 "superficie base **propia** del elemento + overlay". |
| GAP-27 (2) Hover border | RESOLVED | l.157 and l.408: "solo si el elemento ya tenía borde: `--line` → `--line-strong`". Borderless ghost buttons, menu items and rows gain no border. This is consistent with the ghost row (l.152). |
| GAP-27 (3) Selected + hover | RESOLVED | "un elemento seleccionado conserva su borde `--accent`" (l.157, l.408). `--accent-line` is deleted, and grep finds no references. The selection indicator stays at 6.24–7.58:1 in every state. |
| Note: danger-on-tint minimum | CORRECTED | l.78 "≥ 4.66:1, danger sobre danger-soft en s3", which matches the measured 4.66. |

### Cumulative gap ledger (Iterations 1–5)

| Iteration | Gaps raised | Resolved |
|:--:|:--|:--:|
| 1 | GAP-01 … GAP-18 (1 CRITICAL, 11 MAJOR, 6 MINOR) | 18 / 18 |
| 2 | GAP-05, GAP-13 (carried); GAP-19 … GAP-23 | 7 / 7 |
| 3 | GAP-22 (carried); GAP-24, GAP-25 | 3 / 3 |
| 4 | GAP-26 | 1 / 1 |
| 5 | GAP-27 | 1 / 1 |

### Key verified figures (culori, WCAG 2.x; carried from Iterations 2–5 and re-checked where touched)

- Text: t1 13.4–16.3 · t2 7.6–9.2 · t3 4.9–6.0 on app / s1 / s2 / s3; t3 is banned on tints.
- On tints: t1 and t2 ≥ 6.36; the tint's own semantic colour ≥ 4.66.
- Semantic colours on app: accent 7.58, mastery 9.39, gold 10.98, warn 8.63, danger 6.78.
- Non-text:
  - `--line-control` #6B6861: 3.64 on inset / 3.28 on s1 / 3.09 on s2.
  - Selected `--accent` border: 6.24–7.58.
  - Focus ring: ≥ 6.24.
- Overlays: hover and press always lighten the host (step 1.13–1.19).
  - Secondary text-1 ≥ 8.60; ghost text ≥ 5.66.
  - `--pill-neutral` text-2: 6.39–8.14.
  - Skeleton visible 1.06–1.22.
- Categories: L 0.74, C 0.09, ≥ 7.58 on s1.
  - Minimum ΔE2000 vs status colours: 7.1.
  - Separation is guaranteed by shape: category = dot or 2px stroke, status = icon + text.
- Type scale `14 × 1.125ⁿ`: 11.06 → 31.93, rounded correctly, with rem conversions correct.

## 2. Master Defense Checklist Evaluation

| # | Criterion | Result | Evidence / Finding |
|:---:|:---|:---:|:---|
| 1 | Visual Tone Consistency | PASS | "Estudio nocturno" delivers the user's "oscuro refinado" direction: warm graphite (C ≈ 0.005, R > G > B), paper text never #FFF, one iris light, gold only for 101–120, fewer borders (hairlines, one plane per surface), no glows. Radii 4–16 are softly rounded. Geist, Geist Mono and Newsreader form a documented tool/book duality. There is one icon set, lucide 1.5px. |
| 2 | Concentric Radii Formula | PASS | §4 pairs: 10 = 6 + 4 (segmented, menu), 16 = 8 + 8 (palette), 16 = 12 + 4 (HUD). Padding ≥ radius is exempt, and the rule is explicit (card, dialog, toast). |
| 3 | Color Palette Discipline (< 5% accent) | PASS | Iris is interaction-only (focus, selection border, tab, link, "Mejor siguiente", chart cursor) and never a data fill. The paper primary is limited to 1 per action region. The budget comes with a verification method. |
| 4 | Modular Typography Scale | PASS | Ratio 1.125, base 14, explicit px and rem tokens. The sub-14 exception is bounded (12px whitelist; 11px only for eyebrows and kbd; ≥ 12 on mobile). Denominators use n − 2 with a 12px floor. Tracking is within range. text-3 is always at weight ≥ 500. tabular-nums is mandatory. |
| 5 | Elevation & Depth | PASS | Depth comes from lightness first. Overlays are always lighter than their hosts. Shadows are 2 layers (pop) and 3 layers (modal), directional. The hover and press model is host-agnostic. Toasts are specified. |
| 6 | Sizing & Spacing Units (4/8 grid) | PASS | Spacing is 4…48. All paddings and gaps are on-grid, and the exceptions are declared (1px hairline, 2px stroke, 2px focus offset). Unit contract: rem for type and controls, px for borders, em for breakpoints. |
| 7 | Authentic Product Representation | PASS | 7 canonical fixtures, all verified in `src/reactGraph.js` / `src/logic/railsGraph.js`, with realistic scores (41 / 74 / 100 / 112) and the longest real label. |
| 8 | (Skill: WCAG) text and non-text pairs verified | PASS | See the verified figures above. |
| 9 | (Skill: palette) Functional token set complete | PASS | Evaluation status, severity, coverage, notices, 5 button roles, overlays, neutral pill, syntax (≥ 9.04 on inset), code block, Mermaid, charts (shape-coded series), streaming, skeleton, provisional state, time bar and toasts. |
| 10 | Internal consistency | PASS | No contradictory rules or undefined tokens remain. The z-index ladder, elevation mapping and hover rule are each defined in one place. |

## 3. Itemized Gap Analysis (Required if Gaps > 0)

No unresolved gaps.

## 4. Auditor Final Remarks & Instructions for Creator

Phase 0 is **SEALED**. DESIGN.md v3.1.2 is the source of truth for Phases 1–3. Downstream phases must consume its tokens verbatim and must not introduce new colours, sizes, radii or surfaces without a DESIGN.md amendment and a Phase 0 re-audit.

Non-blocking editorial notes. They are not gaps and do not affect the gate. Tidy them in any later amendment:
1. **Button table vs the single hover rule.** The destructive row (l.153) uses `--danger-soft` for hover and adds `--line-strong` on active, which departs from the literal "Regla única… overlays / bordes solo si ya tenía uno". The intent is clear: a semantic tint for a destructive action. Add a one-clause carve-out ("excepto destructivo: `--danger-soft`, sin borde") so that Phase 2 does not have to arbitrate.
2. **Level-2 shadow "igual" (l.408).** It reads most naturally as "unchanged from rest". State "sin cambio" explicitly so that borderless elements do not pick up the level-1 inset highlight.
3. **Measured ranges.**
   - text-4 on s2 / s3 = 2.58 / 2.38 (the doc says 2.7–2.9; exempt).
   - text-3 on tints = 4.1–5.1.
   - Iris against every surface, including inset = 6.2–8.0 (l.488).
   - The neutral hue measures 67–92° (the doc says 70–90°).
