# Rigorous UI/UX Design & Evaluation Standard
*High-End Product Engineering Criteria (Linear / Raycast / Vercel Level)*

This document defines the strict, quantitative rubric used to audit and certify every view, screen, and interactive component of the system. It establishes the guidelines so that interfaces with structural problems of "carditis", disproportion, or poor density are never again leniently graded.

---

## 1. The 5 Pillars of Evaluation (0 to 10 Rubric)

Each view is graded from 0 to 10 by evaluating the weighted sum of 5 critical dimensions:

### Dimension 1: Structural Hierarchy & Surface Integrity (Weight: 25%)
- **Zero "Carditis" / Zero Div Soup**: Strictly forbidden to enclose every paragraph, metric, or sentence in its own floating box with a border and dark background (*boxes within boxes inside a modal*).
- **Shared Surface**: The modal or canvas surface is the unified plane. Subdivisions are produced through typographic scale, proportional spacing, or subtle divider lines (`1px solid rgba(255, 255, 255, 0.06)`).
- **Severe Penalties**:
  - `(-3.0 pts)` If there are more than 2 floating boxes with colored borders stacked vertically in the same section.
  - `(-2.0 pts)` If there is a container block that adds a loud border without grouping more than one conceptual element.

### Dimension 2: Information Density & Viewport Ergonomics (Weight: 25%)
- **Data/Ink Ratio (Tufte Principle)**: Crucial data must be visible immediately, without forcing the user to scroll because of inflated paddings or unnecessary empty space.
- **Viewport Fit in Modals**: At typical desktop resolutions (1440x900 or similar), the executive summary and the rubric metrics must fit simultaneously within the modal's first viewport without a forced vertical scrollbar.
- **Severe Penalties**:
  - `(-2.5 pts)` If a key metric (e.g. rubric criteria) ends up mutilated or requires immediate scrolling because of an oversized block above it.
  - `(-1.5 pts)` Crude native scrollbars in visible gray caused by unnecessary overflow.

### Dimension 3: Typography, Optical Alignment & Tabular Figures (Weight: 20%)
- **Tabular Numeric Metrics**: All scores, counts, times, and codes must use tabular monospace fonts aligned with optical precision.
- **Tracking & Weight Tuning**: Titles and display text must have `letter-spacing: -0.015em` to `-0.025em`, avoiding uncalibrated generic fonts.
- **Penalties**:
  - `(-1.5 pts)` Large numbers that do not use mono/tabular figures, or that are misaligned with respect to their denominator (`/ 120`).
  - `(-1.0 pts)` Secondary labels with weights or contrasts identical to the main content.

### Dimension 4: Color Economy & Atmosphere (Weight: 15%)
- **Accent Restriction**: A single functional primary color per view + one status indicator. Never turn the screen into a Christmas tree with multicolored borders competing against each other.
- **Micro-reliefs and Shadows**: Subtle inner highlights (`inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`), without exaggerated blurry shadows or aggressive fluorescent glows.
- **Penalties**:
  - `(-2.0 pts)` Thick borders in saturated colors (strong orange, bright blue, neon red) surrounding entire boxes of text.

### Dimension 5: Mobile Ergonomics & Responsive Resilience (Weight: 15%)
- **Thumb Adaptation**: On mobile (390x844), buttons and chips must respect a minimum touch area of 40-44px.
- **Zero Accidental Horizontal Overflow**: No text or chip may be cut off at the screen edge on desktop, or overflow the window horizontally on mobile.
- **Penalties**:
  - `(-2.0 pts)` Chips or pills that get cut off with ellipsis or fall off-screen when there is ample space available.
  - `(-2.0 pts)` Elements that end up hidden or covered by fixed bars (e.g. the mobile bottom navigation bar).

---

## 2. Absolute Grading Scale

| Range | Quality Level | Operational Description |
| :---: | :---: | :--- |
| **0.0 – 4.9** | **Unacceptable / Broken** | Overflows, alignment errors, illegibility, overlapping buttons. |
| **5.0 – 6.9** | **Basic Prototype / Div Soup** | It works, but suffers from severe carditis: multiple enormous stacked divs, premature scrolling, strident borders, gray native scrollbars. *(This is where the previous version of temp.png fell)* |
| **7.0 – 8.4** | **Acceptable / Average** | Tidy dark mode but with vestiges of unnecessary floating boxes, medium density, lack of data integration into a single plane. |
| **8.5 – 8.9** | **Good / Close to Pro** | Very clean with no evident errors, but still has margins worth improving in density, typography, or micro-details. |
| **9.0 – 9.4** | **Excellent / Linear Quality** | Unified structure, zero parasitic boxes, data visible at a glance, impeccable tabular typography, invisible styled scrollbars, perfect desktop and mobile ergonomics. |
| **9.5 – 10.0** | **World Class / Reference** | Perfection in micro-interactions, absolute aesthetic balance, zero cognitive friction.

---

## 3. Mandatory Goal Target

**All views mapped from the Specs** must be audited and obtain **an individual grade $\ge 9.0$** under this strict criterion. If a single view has $< 9.0$, it must be refactored immediately until it reaches the standard before finishing.

---

## 4. Protocol of the 4 Independent Review Passes

To eradicate overload blindness and prevent micro-details from hiding macro-structural failures, **every screenshot must be audited sequentially through 4 independent passes**. If a screenshot fails any pass, it is immediately disqualified according to its maximum cap (Cap):

### Pass 1: Screen Macro-Architecture & Viewport (The Telescope Gaze)
*The image is evaluated pulled back at 100% of the full viewport, temporarily ignoring micro-texts or fonts.*
1. **Invariant 1.1: Anti-Layer-Cake (Prohibition of Stacked Blocks)**  
   Strictly forbidden: the vertical stacking of multiple independent rectangular stripes or horizontal boxes with their own background and border in the main canvas (`header` + `banner` + `control deck`). Navigation and controls must be one continuous integrated surface, or structured as a vertical axis (sidebar) + main canvas.
2. **Invariant 1.2: The 70% Viewport Rule (Fold & Density Ratio)**  
   At desktop resolutions (1440×900), the sum of fixed bars, headers, and filters cannot exceed **130px of total vertical height**. At least 70% of the viewport must be dedicated directly to the content canvas (nodes/graph), guaranteeing that at least **2 complete rows of cards are visible without scrolling**.
3. **Invariant 1.3: Prohibition of Horizontal Canyons via `space-between` (Fitts's Law)**  
   Forbidden: the use of `justify-content: space-between` in full-width containers (>800px) that throws the action more than 350px away from the text, with no central content justifying the space. If an action belongs to a context, it must be visually coupled to it.
4. **Invariant 1.4: Prohibition of Hidden Affordances in Taxonomy and Filters (Anti-Hidden-Affordance)**  
   Forbidden: confining category filters to a single horizontal line with hidden overflow or scrolling on desktop when the number of categories ($N > 6$) exceeds the available width. Taxonomy discoverability must be 100%: chips must wrap naturally (`flex-wrap: wrap`) or provide a structured selector where no category is left invisible or dependent on an awkward horizontal scroll with a desktop mouse.
- **Penalty**: Violation of any Pass 1 invariant $\implies$ **automatic maximum Cap $\le 6.5 / 10$**.

### Pass 2: Micro-Density & Component Anti-Carditis (The Microscope Gaze)
*Individual components (cards, modals, forms) are audited.*
1. **Invariant 2.1: Controlled Density (Zero Hollow Boxes > 40px)**  
   Forbidden: cards or banners with more than $40\,\text{px}$ of unjustified black emptiness. Each element must contribute cognitive substance (title, 2-line micro-summary with clamp, badges and priority), eliminating the empty wireframe look.
2. **Invariant 2.2: Internal Anti-Carditis (Zero Decorative Boxes in Modals)**  
   Zero floating boxes with decorative borders enclosing texts inside containers that already have a border (modals, panels). Texts are structured with typographic scale and subtle divider lines (`border-bottom: 1px solid var(--border-line)`).
3. **Invariant 2.3: Flexbox Structural Protection**  
   Headers, tab bars, and navigation rails mandatorily protected with `flexShrink: 0`. Zero collapses or squishing when content grows.
- **Penalty**: Violation of any Pass 2 invariant $\implies$ **automatic maximum Cap $\le 7.0 / 10$**.

### Pass 3: Chromatic Semantics & Lighting Hierarchy (The Colorist Gaze)
*Only the use of color, contrasts, and accents is audited.*
1. **Invariant 3.1: Immutable Category Color Anchor**  
   The curricular category color (cyan, amber, violet, emerald) is untouchable and must never be replaced by progress or mastery states.
2. **Invariant 3.2: Sharp Accents vs. Christmas Tree**  
   Forbidden: painting entire card borders in strident colors (yellow/amber, green, neon blue) just for having a high score. Excellence accents must be discrete, sharp badges (`★ 113/120`), keeping the container on a neutral border (`rgba(255, 255, 255, 0.08)`).
- **Penalty**: Violation of any Pass 3 invariant $\implies$ **automatic maximum Cap $\le 8.0 / 10$**.

### Pass 4: Interaction Ergonomics, Mobile & Extreme States (The Tactile Gaze)
*Mobile viewports (390px), transitions, extreme states, and overflows are audited.*
1. **Invariant 4.1: Touch Ergonomics & Safe Areas on Mobile**  
   On the mobile viewport (390×844), touch targets must be $\ge 44\times 44\,\text{px}$, and there must be bottom safe padding of at least 70px to avoid overlapping with the fixed navigation bar.
2. **Invariant 4.2: Zero Hard Truncations & Wheel Support**  
   Every horizontal list that overflows must have a calibrated gradient mask (`mask-image`) that does not cut numbers in half, and fluid support for scrolling with a mouse wheel or trackpad (`onWheel`).
3. **Invariant 4.3: Immersive Modes & Reading Containment**  
   Zen Mode must occupy 100vw × 100vh, eliminating the background without breaking legibility, while maintaining a calibrated line width (`max-w-4xl`) to avoid excessively long lines.
- **Penalty**: Violation of any Pass 4 invariant $\implies$ **automatic maximum Cap $\le 8.0 / 10$**.

---

## 5. Invisible "Design Engineering" Polish (Emil Kowalski)

1. **Wheel Interaction in Filters**: Fluid horizontal scrolling (`onWheel`) in all side lists.
2. **Ultra-thin Scrollbars**: `scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.14) transparent;`, eradicating gray native scrollbars.
3. **Tabular Numbers in Metrics**: Mandatory use of `font-variant-numeric: tabular-nums` or monospace typography for all scores, counts, and ratios.


