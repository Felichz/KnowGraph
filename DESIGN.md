---
system:
  name: "Learning Workspace — Design System v3"
  version: "3.2.0"
  creative_north_star: "Night Study"
  aesthetic: "Refined dark: warm graphite, paper, a single accent. Light edition: warm paper, graphite ink (Day Study)"
  platform: "Web + Electron (reference desktop 1440×900) · Mobile web (390×844)"
  governing_master_skill: "ui-design-foundations"
  governing_specification: "specs/002-workspace-ui-v3/spec.md"
  quality_standard: "docs/DESIGN_CRITERIA.md"
  supersedes: "DESIGN.md v2.0.0 (slate + sky, 'cockpit')"
---

# Learning Workspace — Design System v3

## 0. Creative north star: *Night Study*

A study desk at night: the room is warm, quiet graphite; the study material is **paper** (light, warm text, never pure white); and there is **a single work light** —the *iris* accent— marking where your attention is: keyboard focus, selection, the recommended action. **Gold** is reserved for one thing only: excellence (101–120). **Sage** for one thing only: mastery (≥100).

There are two editions of the same desk: **Night Study** (dark, the reference) and **Day Study** (light, §1.9), the same room by daylight, where the surfaces become warm paper and the text becomes graphite ink. The light theme is not an inversion: every role keeps its meaning (iris = attention, sage = mastery, gold = excellence), each color is re-tuned in OKLCH for a light background, and depth moves from surface luminosity to ink-tinted shadows. The default follows the system (`prefers-color-scheme`); the person can pin light or dark (§1.9.6).

Three ideas govern everything:

1. **The map is a tool; the card is a book.** Operational surfaces (map, filters, metrics, forms) use a technical sans and tabular mono. Study content uses an editorial serif in its reading moments (card title, *In one sentence*, flashcard question). That duality is the product's signature.
2. **Hierarchy through typography and space, not boxes.** One flat plane per surface. Groups are formed by proximity, headings, and hairlines (1px). Never colored borders around blocks of text.
3. **Color means something or it does not appear.** Neutrals for structure; iris for interaction; sage for mastery; gold for excellence; coral for error; orange for warning. Category colors exist **only as dots and thin strokes** of identity (see §1.5, shape separation).

### What changes vs. v2
| v2 (legacy) | v3 |
|:--|:--|
| Bluish slate + neon cyan, glows | Warm graphite (OKLCH hue 67–92°, C≈0.005), no glows |
| Neon categories as card side borders | Categories in harmonized OKLCH, only an 8px dot or 2px stroke |
| Emoji as iconography (🧠 ⚖️ ✨ 🔥) | 1.5px line icons (lucide), zero emoji |
| A single sans font | Geist (UI) + Geist Mono (metrics/code) + Newsreader (reading) |
| Stacked header + filters + banner (layer cake) | Persistent sidebar + canvas; a single 52px top bar |
| Lesson as a floating bordered modal | Full-screen study session: reading column + context rail |
| Progress bars in cyan (accent) | Neutral rail: paper → sage on mastery → gold in the extra segment |

### Units
- Font sizes, line-heights, control heights, and spacings are implemented in **rem** (16px root). Tables show px for readability; `rem = px / 16`.
- Borders, hairlines, strokes, and radii in **px**.
- Media queries in **em** (`48em` = 768px, `68.75em` = 1100px, `90em` = 1440px).

---

## 1. Color

All ratios are verified with WCAG 2.2 (culori) against the indicated background. §1.1 to §1.8 describe the dark theme (the `:root` base in `src/ui/theme/tokens.css`); the light theme redefines the same tokens under `:root[data-theme="light"]` in `src/ui/theme/light.css` (§1.9). Components only reference tokens, never hex values.

### 1.1 Neutrals (warm graphite, OKLCH C ≈ 0.005, hue 70–90°)

| Token | Hex | OKLCH L | Use |
|:--|:--|:--:|:--|
| `--bg-sidebar` | `#090806` | .135 | Sidebar, mobile dock |
| `--bg-app` | `#100E0C` | .165 | Main canvas, study session background |
| `--surface-1` | `#161512` | .195 | Map cards, rows, graph nodes, drawer, dialogs |
| `--surface-2` | `#1D1B19` | .225 | Command palette, active segment of segmented controls (hovers use `--hover-overlay`, §1.4) |
| `--surface-3` | `#242220` | .255 | Popovers, menus, tooltips, deep dive |
| `--surface-inset` | `#070604` | .120 | Code, textarea, inputs, rail tracks, wells |
| `--line-subtle` | `rgba(255,248,230,.06)` | — | Internal dividers, table hairlines |
| `--line` | `rgba(255,248,230,.09)` | — | Card, sidebar, panel borders |
| `--line-strong` | `rgba(255,248,230,.16)` (≈ `#474440` over s3) | — | Border hover, overlay borders |
| `--line-control` | `#6B6861` (opaque) | — | **Form field borders** (input, textarea, select, checkbox): 3.64 vs inset / 3.28 vs s1 / 3.09 vs s2 (WCAG 1.4.11) |
| `--scrim` | `rgba(4,3,2,.72)` | — | Background behind dialogs/drawers/palette |
| `--bar-glass` | `rgba(16,14,12,.88)` + `backdrop-filter: blur(8px)` | — | Top bar on scroll |
| `--selection` | `#2A2E56` | — | `::selection` (`--text-1` text, 10.9:1) |

### 1.2 Text ("paper")

| Token | Hex | Contrast app / s1 / s2 / s3 | Use |
|:--|:--|:--|:--|
| `--text-1` | `#EEECE7` | 16.3 / 15.5 / 14.5 / 13.4 | Headings, content, values |
| `--text-2` | `#B7B3AB` | 9.2 / 8.7 / 8.2 / 7.6 | Secondary body, labels, metadata |
| `--text-3` | `#938F87` | 6.0 / 5.7 / 5.3 / 4.9 | Hints, placeholders, eyebrows, denominators. **Weight ≥ 500.** |
| `--text-4` | `#5F5C56` | 2.4–2.9 (exempt from 1.4.3) | Disabled controls only |
| `--text-on-paper` | `#100E0C` | 16.3 over `--paper` | Primary button text |

**Text rules**
- Never `#FFFFFF` or `#000000`.
- **On tinted backgrounds (`--*-soft`), `--text-3` is forbidden** (it drops to 4.1–4.9). On tints use `--text-1` or `--text-2` (≥ 6.36:1 in the worst case, gold-soft over s2) or the semantic color itself (≥ 4.66:1, danger over danger-soft on s3).
- The reading body uses `--text-1` at 16px; necessary information never in `--text-3` below 12px.

### 1.3 Accent, paper, and semantics

| Token | Hex | Contrast app / s1 / s3 | Exclusive role |
|:--|:--|:--|:--|
| `--paper` | `#EEECE7` | — | Primary button fill (1 per action region) |
| `--paper-hover` | `#DAD7D0` | — | Primary hover |
| `--paper-active` | `#C7C4BD` | — | Primary active |
| `--accent` | `#909CF5` (iris) | 7.6 / 7.2 / 6.2 | Keyboard focus, selection, active tab, links, "Mejor siguiente" badge, chart cursor |
| `--accent-strong` | `#A5B1FD` | 9.4 / 8.9 / 7.6 | Link hover, text over `--accent-soft` |
| `--accent-soft` | `rgba(144,156,245,.14)` | — | Selected item / active row background |
| `--mastery` | `#74C692` (sage) | 9.4 / 8.9 / 7.6 | Mastered card (≥100), `Check` icon for "cubierto" coverage |
| `--mastery-soft` | `rgba(116,198,146,.12)` | — | Mastery pill background |
| `--gold` | `#E8BE62` | 11.0 / 10.4 / 8.9 | **Only** excellence 101–120 (extra segment, ★) |
| `--gold-soft` | `rgba(232,190,98,.12)` | — | Excellence pill/band background |
| `--warn` | `#F0995B` | 8.6 / 8.2 / 7.0 | Prerrequisitos pendientes, "un poco corta", stale evaluation, medium severity |
| `--warn-soft` | `rgba(240,153,91,.12)` | — | Warning background |
| `--danger` | `#E97871` (coral) | 6.8 / 6.4 / 5.6 | Errors, delete, high severity |
| `--danger-soft` | `rgba(233,120,113,.12)` | — | Inline error background |
| `--rail-base` | `#B7B3AB` (= text-2) | 9.7 over inset | 0–100 segment of the score rail **while there is no mastery** |

**Selected state** (row, card, node, chip): `--accent-soft` background + 1px `--accent` border (6.2–7.6:1, passes 1.4.11) + `aria-selected`/`aria-pressed`/`aria-current`.

**Accent budget.** `--accent` is exclusively interaction: focus, selection, active tab, link, "Mejor siguiente", and chart cursor. **It is not a data color**: no bar, score, or metric is filled with iris. With that, `--accent` + `--paper` occupy < 5% of the area of any view (verifiable: at most 1 paper button + 1 selection + 1 active tab per screen).

**No color as the sole carrier**: every semantic state carries icon + text (e.g. `✓ Dominada`, `★ 112`, `! Prerrequisitos`).

### 1.4 State-to-token mapping (closed list)

**Evaluation state (`evaluation.status` / `STATUS_LABEL`)**

| State | Pill: background / text | lucide icon | Copy |
|:--|:--|:--|:--|
| `exceptional` (101–120) | `--gold-soft` / `--gold` | `Star` | "Extra depth" |
| `strong` (100) | `--mastery-soft` / `--mastery` | `Check` | "Core covered" |
| `developing` (60–99) | `--pill-neutral` / `--text-2` | `CircleDashed` | "In progress" |
| `review` (<60) | `--warn-soft` / `--warn` | `AlertTriangle` | "Worth reviewing" |
| no attempt | transparent, border `--line` / `--text-3` | `Circle` | "Not scored" |

**Gap severity**

| Severity | Marker | Text |
|:--|:--|:--|
| high | `ChevronsUp` icon 16px `--danger` | "Alto" in `--danger` |
| medium | `ChevronUp` icon 16px `--warn` | "Medio" in `--warn` |
| low | `Minus` icon 16px `--text-3` | "Bajo" in `--text-2` |

**Surface coverage (coaching)**

| State | Icon | Color | aria-label |
|:--|:--|:--|:--|
| covered | `Check` | `--mastery` | "Cubierto" |
| partial | `CircleDashed` | `--warn` | "Parcial" |
| missing | `X` | `--danger` | "Falta" |
| pending | `Circle` | `--text-3` | "Sin revisar" |

**Inline notices (one row, no colored-border box)**

| Type | Background | Icon (color) | Text |
|:--|:--|:--|:--|
| Error | `--danger-soft` | `AlertCircle` (`--danger`) | `--text-1`, recovery action as a ghost button |
| Warning / stale evaluation | `--warn-soft` | `History` or `AlertTriangle` (`--warn`) | `--text-1` |
| Info | transparent + top hairline `--line-subtle` | `Info` (`--text-2`) | `--text-2` |
| Success | `--mastery-soft` | `CheckCircle2` (`--mastery`) | `--text-1` |

All with `--r-md` 8, padding 8×12, no border.

**Button variants (color; state mechanics in design-spec §D)**

| Variant | Background | Border | Text | Hover | Active |
|:--|:--|:--|:--|:--|:--|
| Primary | `--paper` | — | `--text-on-paper` | `--paper-hover` | `--paper-active` |
| Secondary | `rgba(255,248,230,.05)` over its host | `--line` | `--text-1` | + `--hover-overlay` and `--line-strong` | + `--press-overlay` |
| Ghost | transparent | — | `--text-2` | `--hover-overlay` + `--text-1` | `--press-overlay` |
| Destructive | transparent | — | `--danger` | `--danger-soft` | `--danger-soft` + `--line-strong` |
| Disabled (all) | transparent (primary: `rgba(255,248,230,.08)`) | `--line-subtle` | `--text-4` | no change | no change |

Relative overlays (they work over any surface, always lighten): `--hover-overlay: rgba(255,248,230,.06)`, `--press-overlay: rgba(255,248,230,.10)`. **Single rule: every hover and press in the system** (buttons, menu items, rows, map cards, graph nodes, chips) is expressed with these overlays over the element's own base surface (not its host's); borders only change if the element already had one (`--line` → `--line-strong`), and a selected element keeps its `--accent` border on hover; no hover rule switches to another solid surface. Single exception: the destructive button uses `--danger-soft` as hover (and adds `--line-strong` on press) to anticipate the consequence.

Relative neutral fill for semantic-less pills and chips: `--pill-neutral: rgba(255,248,230,.06)` (text-2 on top: 8.1 / 7.5 / 7.0 / 6.4 over app / s1 / s2 / s3).

### 1.5 Category palettes (identity, not state)

Hues optimized to maximize the minimum perceptual distance between each other and against the 5 state colors (minimum ΔE2000 ≈ 6.6 with 11 categories: that is the physical ceiling at this lightness). That is why separation is guaranteed **by shape**, not just by color:

**Shape separation rule**
- **Category = dot (8px circle) or 2px straight stroke.** Never a progress bar, never a pill, never an icon.
- **State = icon + text (+ pill or rail).** Never a bare dot (not for severity, coverage, or "IA trabajando" either).
- Per-category progress bars (sidebar, bands) are filled with `--rail-base`; the category is identified only by the dot next to the name.

OKLCH L = 0.74, C = 0.09. Contrast ≥ 7.0:1 over `--surface-1`. They replace the data hexes at render time (`graph.categories[cat].color`) via `src/ui/theme/categoryPalette.js`, which maps each category to a hue token (`var(--cat-cyan)`, `var(--cat-tan)`, …) so each theme sets its own lightness (light values in §1.9.4); unknown category → `color-mix(in oklch, <dato> 60%, var(--text-2))`.

**React**

| Category | Hue | Hex |
|:--|:--:|:--|
| fundamentals · Mental model & components | 205 | `#5DBBC6` |
| state · State & data | 70 | `#D0A16B` |
| effects · Effects & async | 290 | `#AAA1E0` |
| rendering · Render & performance | 120 | `#A3B472` |
| architecture · Web architecture | 170 | `#6CBDA2` |
| quality · Testing & quality | 335 | `#CF95C1` |
| platform · Web, security & deploy | 230 | `#6BB6D9` |
| designSystem · Design systems & contracts | 0 | `#DA93A8` |
| runtime · Browser & runtime | 90 | `#C1A966` |
| operations · Production & reliability | 45 | `#DB997B` |
| leadership · Product & leadership | 310 | `#BC9BD6` |

Hue tokens: `--cat-cyan` 205 · `--cat-tan` 70 · `--cat-lavender` 290 · `--cat-olive` 120 · `--cat-jade` 170 · `--cat-orchid` 335 · `--cat-sky` 230 · `--cat-rose` 0 · `--cat-ochre` 90 · `--cat-clay` 45 · `--cat-violet` 310.

**Rails**

| Category | Hex |
|:--|:--|
| fundamentals · Rails core & request | `#D0A16B` |
| activerecord · Active Record & DB | `#DA93A8` |
| patterns · Applied design | `#6BB6D9` |
| sti · STI & polymorphism | `#AAA1E0` |
| infra · API, security & runtime | `#5DBBC6` |
| assets · Asset pipeline | `#6CBDA2` |
| testing · Testing (RSpec) | `#A3B472` |

**Allowed uses (closed list)**: 8px dot next to the name; 2px top stroke on the graph node; `--lesson-color` (declared on the study session container with the card's category hex) used only on the card header dot. **Forbidden**: backgrounds, full borders, text, bars, states.

**Milestone and seniority band colors** (`milestone.color`, `band.color` in the data): **not used**. Milestones and bands render in neutral; their state is communicated with icon + text (§1.4).

### 1.6 Code

| Token | Value | Use |
|:--|:--|:--|
| `--code-bg` | `--surface-inset` | Code block, comparison |
| `--code-fs` | `--fs-sm` 14px, line-height 24px | Block code |
| `--code-inline-bg` | `rgba(255,248,230,.07)` | inline `code` in prose |
| `--code-inline-fs` | `--fs-sm` 14px mono (inside 16px prose), padding 0×4px, `--r-xs` | — |
| `--syn-comment` | `--text-3`, italic | Comments |
| `--syn-keyword` | `#BAA4E2` (9.2:1 over inset) | `const`, `return`, `def`, `class` |
| `--syn-string` | `#A4C386` (10.4:1) | Strings |
| `--syn-number` | `#E5A880` (9.9:1) | Numbers, booleans, Ruby symbols |
| `--syn-function` | `#80C1E1` (10.3:1) | Functions, methods |
| `--syn-tag` | `#E199AF` (9.0:1) | JSX/HTML tags |
| `--syn-attr` | `#D5BA82` (10.8:1) | Attributes, props, keys |
| `--syn-type` | `#81C6C1` (10.4:1) | Classes, constants, types |
| `--syn-punct` | `--text-2` | Punctuation, operators |
| `--syn-plain` | `--text-1` | Identifiers |

**Code block**: `--code-bg` background, `--line` border, `--r-lg` 12, 36px header with the language label (`--fs-xs`, `--text-3`) and ghost actions (Copy, Explain), body padding 16, its own horizontal scroll.

**Naive vs. production comparison**: two code blocks side by side (desktop ≥ 1100) or stacked. Each carries, in its header, a shape marker + text: `✕ Naive approach` (`X` icon in `--danger`) and `✓ Production pattern` (`Check` icon in `--mastery`). Below each block, one line of `--text-2` text: "Why it fails: …" / "Accepted trade-off: …". No colored borders.

**Mermaid** (`mermaid.initialize` → `themeVariables`, read from the active theme's tokens right before each render and re-rendered in place when the theme changes): `darkMode` (true only in dark), `background: --surface-inset`, `primaryColor: --surface-2`, `primaryTextColor: --text-1`, `primaryBorderColor: --diagram-border` (dark `#474440`, light `#CFC9BF`), `lineColor: --text-3`, `secondaryColor: --surface-1`, `tertiaryColor: --bg-app`, `fontFamily: "Geist Variable"`, `fontSize: "14px"`. Container identical to the code block, without the header.

### 1.7 Charts

| Token | Value | Use |
|:--|:--|:--|
| `--chart-eval` | `--text-1`; filled circle r=4 | Full evaluation (main series) |
| `--chart-eval-line` | `--text-2`, 1.5px | Line joining evaluations |
| `--chart-coach` | `--text-3`; 8px hollow diamond, 1.5 stroke | Coaching checkpoint |
| `--chart-band-extra` | `--gold-soft` | 100–120 band |
| `--chart-guide` | `--line`, 1px, dashed 2/4 | Guides at 60 and 120 |
| `--chart-threshold` | `--text-3`, 1px continuous | Guide at 100 ("100 · base suficiente") |
| `--chart-cursor` | `--accent`, 1px + 2px ring r=7 | Selected point |
| `--chart-axis` | `--fs-xs` 12 mono 500, `--text-3` | Axis labels and legend |
| `--chart-judge` | same as `--chart-eval`, threshold at 95 | Pedagogical judge history (0–100) |

The series is distinguished by **shape** (filled circle vs. hollow diamond) and by a text legend. The only non-neutral colors are the cursor (iris) and the gold band.

### 1.8 Streaming, loading, and provisional state

| Token | Value | Use |
|:--|:--|:--|
| `--skeleton` | `rgba(255,248,230,.07)` (relative, visible over any surface); opacity animation .55 ↔ 1, 1.4s ease-in-out | Skeleton blocks with the exact geometry of the resolved content |
| `--caret` | 2px × 1em bar, `--text-2`, 1s `steps(2)` blink | End of incoming text |
| `--provisional` | figures in `--text-2` (not `--text-1`) + "Provisional" pill (`--pill-neutral`/`--text-2`) + rail segments at 50% opacity | Score and rubric while the evaluation is in progress |
| `--expected-marker` | 1px tick `--text-3` + `--fs-xs` 12 mono 500 label "esperado 90 s" | Loader time bar |
| `--timebar-fill` | `--text-3` up to the expected time; `--warn` past 1.5× | Loader time bar |
| `--pulse-ai` | opacity .45 ↔ 1, 1.6s | 12–16px `Sparkles` icon `--text-1` for "IA trabajando" + text or `aria-label` "IA trabajando en esta card" (never scales, never a dot) |


### 1.9 Light theme: *Day Study*

Same roles, same shape rules, same budgets (§1.3 accent budget, §1.5 shape separation). What changes is the physics of a light surface: the canvas is warm paper, cards are a lighter sheet on it, text is graphite ink, and every semantic color drops to OKLCH L ≈ 0.49 to 0.53 so it holds up as text. Never `#FFFFFF` or `#000000` here either. Ratios: `--bg-app` / `--surface-1` / `--surface-3` / `--surface-inset` / `--bg-sidebar` unless stated.

#### 1.9.1 Neutrals (warm paper, hue ≈ 85°)

| Token | Light | Use (same role as dark) |
|:--|:--|:--|
| `--bg-sidebar` | `#EFEBE4` | Sidebar, mobile bar and dock: the desk frame, one step darker than the canvas |
| `--bg-app` | `#F7F4EF` | Canvas, study session |
| `--surface-1` | `#FCFAF7` | Cards, nodes, drawer, dialogs (a lighter sheet over the canvas) |
| `--surface-2` | `#FDFBF8` | Palette, active segment |
| `--surface-3` | `#FEFCFA` | Popovers, menus, tooltips, toasts, graph panels |
| `--surface-inset` | `#F1EEE8` | Code, textarea, inputs, rail tracks, diagrams |
| `--line-subtle` / `--line` / `--line-strong` | `rgba(58,46,28,.07)` / `.11` / `.18` | Hairlines in warm ink, not grey |
| `--line-control` | `#8D8881` | Form borders: 3.0 vs inset / 3.4 vs s1 / 3.4 vs s2 (1.4.11) |
| `--hover-overlay` / `--press-overlay` | `rgba(58,46,28,.045)` / `.08` | Same single hover rule as §1.4, darkening instead of lightening |
| `--pill-neutral` / `--skeleton` / `--well` | `rgba(58,46,28,.06)` / `.07` / `.04` | Neutral pills, skeletons, segmented and kbd wells |
| `--fill-secondary` / `--fill-disabled` | `rgba(255,253,249,.72)` / `rgba(58,46,28,.06)` | Secondary button fill, disabled primary |
| `--scrim` | `rgba(38,32,24,.24)` + blur 8px | Behind dialogs, drawer, palette |
| `--bar-glass` | `rgba(247,244,239,.86)` + blur 8px | Top bar on scroll |
| `--selection` | `#D9DBF5` | `::selection` (text-1 on top: 12.3:1) |
| `--node-hover` / `--node-selected` | `#F3F0EA` / `#ECEDF8` | Graph node hover and selected fills (dark: `#1B1A17` / `#272832`) |
| `--scrollbar-thumb` | `rgba(58,46,28,.22)` | Scrollbars (dark: `rgba(255,248,230,.14)`) |

#### 1.9.2 Text (graphite ink)

| Token | Light | Contrast app / s1 / s3 / inset / sidebar |
|:--|:--|:--|
| `--text-1` | `#211D1A` | 15.2 / 16.1 / 16.3 / 14.4 / 14.1 |
| `--text-2` | `#544F49` | 7.4 / 7.8 / 7.9 / 7.0 / 6.8 |
| `--text-3` | `#6D6861` | 5.0 / 5.3 / 5.4 / 4.8 / 4.6 (weight ≥ 500, same rule) |
| `--text-4` | `#AEAAA4` | 2.1 to 2.3 (disabled only, exempt) |
| `--text-on-paper` | `#F9F6F2` | 14.7 over `--paper` |

#### 1.9.3 Accent, paper and semantics

In light, **paper becomes ink**: the primary button is a graphite fill with paper text, which keeps "one high-contrast primary per region" true on a light canvas.

| Token | Light | Contrast app / s1 / s3 · over its own `-soft` on app | Role |
|:--|:--|:--|:--|
| `--paper` / `--paper-hover` / `--paper-active` | `#26221E` / `#393530` / `#4A4541` | n/a | Primary button fill |
| `--accent` (iris) | `#4F53BE` | 5.8 / 6.1 / 6.2 · 5.0 | Focus ring, selection, links, "Best next" |
| `--accent-strong` | `#3E3CAA` | 7.9 / 8.3 / 8.4 · 6.7 | Link hover, text over accent-soft |
| `--accent-soft` | `rgba(79,83,190,.10)` | n/a | Selected rows |
| `--mastery` (sage) | `#1A7244` | 5.4 / 5.7 / 5.8 · 4.7 | Mastery ≥ 100 |
| `--gold` | `#8A5D01` | 5.2 / 5.5 / 5.6 · 4.6 | **Text and icons** of excellence 101 to 120 (★, pills, scores) |
| `--gold-fill` | `#AD7C0E` | 3.2 vs the inset track (1.4.11) | **Fills** of the extra segment (score rail, node rail, rubric). Dark: `= --gold` |
| `--warn` | `#A84B07` | 5.2 / 5.5 / 5.6 · 4.5 | Warnings, prerequisites |
| `--danger` (coral) | `#B53530` | 5.4 / 5.7 / 5.8 · 4.7 | Errors; `--text-on-paper` over a `--danger` fill: 5.5 |
| `--*-soft` | own color at `.10` | n/a | Tints (dark uses `.12` / `.14`); text-2 over gold-soft on s1: 6.8 |
| `--rail-base` | `#8A857E` | 3.2 vs the inset track | 0 to 100 segment before mastery |

Gold is split in two only because of the light background: a gold dark enough for AA text reads as bronze when it fills a bar, so bars use the brighter `--gold-fill` (non-text, 3:1) and everything that is read uses `--gold`. Gold and warn stay apart by hue (76° vs 48°) and by shape (★ vs triangle).

#### 1.9.4 Categories (light)

Same hues as §1.5 at OKLCH L = 0.53, C = 0.10: ≥ 4.5:1 over `--bg-app` and `--surface-1`, so a category dot never fades on paper.

| Token | Light | Dark |
|:--|:--|:--|
| `--cat-cyan` | `#007C87` | `#5DBBC6` |
| `--cat-tan` | `#90601F` | `#D0A16B` |
| `--cat-lavender` | `#6B61A1` | `#AAA1E0` |
| `--cat-olive` | `#64742B` | `#A3B472` |
| `--cat-jade` | `#137E63` | `#6CBDA2` |
| `--cat-orchid` | `#8F5483` | `#CF95C1` |
| `--cat-sky` | `#14769A` | `#6BB6D9` |
| `--cat-rose` | `#9A5169` | `#DA93A8` |
| `--cat-ochre` | `#826817` | `#C1A966` |
| `--cat-clay` | `#9B5738` | `#DB997B` |
| `--cat-violet` | `#7E5A97` | `#BC9BD6` |

#### 1.9.5 Code, diagrams and elevation (light)

| Token | Light | Contrast over `--surface-inset` |
|:--|:--|:--|
| `--syn-keyword` | `#6B46A0` | 6.0 |
| `--syn-string` | `#416B25` | 5.4 |
| `--syn-number` | `#9B4805` | 5.5 |
| `--syn-function` | `#006692` | 5.5 |
| `--syn-tag` | `#9C365D` | 5.9 |
| `--syn-attr` | `#7E5904` | 5.5 |
| `--syn-type` | `#006D69` | 5.3 |
| `--syn-comment` / `--syn-punct` / `--syn-plain` | text-3 italic / text-2 / text-1 | 4.8 / 7.0 / 14.4 |
| `--code-inline-bg` | `rgba(58,46,28,.06)` | n/a |
| `--diagram-border` | `#CFC9BF` | Mermaid node borders |

Elevation in light: the surfaces are only a few steps apart, so **shadows carry the depth**, tinted with warm ink (`rgb(48,36,20)`), never neutral black.

- `--shadow-card`: `0 1px 2px rgba(48,36,20,.05)` (dark: `inset 0 1px 0 rgba(255,248,230,.04)`)
- `--shadow-raised` (checked segment): `0 1px 2px rgba(48,36,20,.10)` (dark: `inset 0 1px 0 rgba(255,248,230,.06)`)
- `--shadow-pop`: `0 1px 2px rgba(48,36,20,.08), 0 8px 24px -6px rgba(48,36,20,.18)`
- `--shadow-modal`: `0 2px 4px rgba(48,36,20,.06), 0 12px 32px -8px rgba(48,36,20,.16), 0 32px 80px -24px rgba(48,36,20,.24)`

#### 1.9.6 Choosing the theme

- **Default: system** (`prefers-color-scheme`), followed live while no choice is saved.
- **Explicit choice** is saved in `localStorage["knowgraph:theme"]` = `"light"` | `"dark"`; "System" removes the key.
- **Before first paint**, an inline script in `index.html` sets `<html data-theme>` and `<meta name="theme-color">` (`#F7F4EF` / `#100E0C`), and an inline style paints the matching `html` background. The CSP allows that script by its sha256 hash; `tests/logic/theme.mjs` fails if the script and the hash drift apart. Runtime store: `src/ui/theme/theme.js`.
- **Controls**: an icon button next to the EN / ES switcher in the top bar (collapsed sidebar: in the footer, under the language toggle), a System / Light / Dark segmented control in Settings, and a command palette action. The icon shows the theme you switch to (`Sun` in dark, `Moon` in light); label and `aria-label` are translated ("Switch to light theme" / "Cambiar a tema claro").
- **Brand glyph and favicon** do not change: the graphite tile reads as an app icon on both paper and graphite.
- **Electron** paints the window with the `--bg-app` of the system theme until the renderer is ready.

---

## 2. Typography

### 2.1 Families (packaged locally via `@fontsource-variable/*`, no CDN — local-first/Electron requirement)

| Token | Family | Role |
|:--|:--|:--|
| `--font-ui` | `"Geist Variable", ui-sans-serif, system-ui, sans-serif` | All UI and reading body |
| `--font-mono` | `"Geist Mono Variable", ui-monospace, "SF Mono", Menlo, monospace` | Metrics, scores, counters, code, shortcuts |
| `--font-read` | `"Newsreader Variable", ui-serif, Georgia, serif` | Editorial display: card title, *In one sentence*, flashcard question, empty-state headlines |

`font-variant-numeric: tabular-nums` is mandatory on `--font-mono` and on every figure that changes live.

### 2.2 Modular scale — ratio 1.125 (major second), 14px base

`size(n) = 14 × 1.125ⁿ`, rounded to the integer.

| Token | n | Exact | px / rem | Line-height | Use |
|:--|:--:|:--|:--|:--|:--|
| `--fs-2xs` | −2 | 11.06 | 11 / .6875 | 16 | Only eyebrows and kbd (exception §2.4) |
| `--fs-xs` | −1 | 12.44 | 12 / .75 | 16 | Metadata, pills, captions, legends (exception §2.4) |
| `--fs-sm` | 0 | 14.00 | 14 / .875 | 20 | **UI base**: controls, rows, labels |
| `--fs-md` | 1 | 15.75 | 16 / 1 | 26 | **Reading body**, textarea |
| `--fs-lg` | 2 | 17.72 | 18 / 1.125 | 26 | Card section titles, panel titles |
| `--fs-xl` | 3 | 19.93 | 20 / 1.25 | 28 | View titles (Progreso, Flashcards) |
| `--fs-2xl` | 4 | 22.43 | 22 / 1.375 | 30 | *In one sentence* (serif) |
| `--fs-3xl` | 5 | 25.23 | 25 / 1.5625 | 32 | Scorecard score (mono) |
| `--fs-4xl` | 6 | 28.38 | 28 / 1.75 | 36 | Card title (serif) |
| `--fs-5xl` | 7 | 31.93 | 32 / 2 | 40 | Flashcard question (serif) |

### 2.3 Mobile sizes (< 768px)

| Token | Desktop | Mobile |
|:--|:--:|:--:|
| `--fs-5xl` (flashcard question) | 32 | 25 (`--fs-3xl`) |
| `--fs-4xl` (card title) | 28 | 22 (`--fs-2xl`) |
| `--fs-2xl` (*In one sentence*) | 22 | 20 (`--fs-xl`) |
| `--fs-3xl` (score) | 25 | 25 |
| `--fs-2xs` | 11 | 12 (raises to `--fs-xs`; nothing < 12 on mobile) |
| Rest | same | same |

### 2.4 Documented minimum-size exception
The floor for informative text is 14px. 12px (`--fs-xs`) is allowed **only** in: pills/badges, secondary metadata (dates, model, counts), chart axes and legends. 11px (`--fs-2xs`) **only** in eyebrows (UPPERCASE, weight 600) and kbd. Never in body copy, form labels, or buttons. On mobile nothing goes below 12px.

### 2.5 Weights and tracking

| Style | Family | Weight | Tracking |
|:--|:--|:--|:--|
| Display serif (`--fs-2xl`…`--fs-5xl`) | read | 460 | −0.015em |
| UI titles (`--fs-lg`, `--fs-xl`) | ui | 600 | −0.015em |
| Labels / buttons | ui | 500 | −0.005em |
| Body | ui | 400 | 0 |
| Text in `--text-3` | ui | ≥ 500 | 0 |
| Eyebrow (`--fs-2xs`, UPPERCASE) | ui | 600 | +0.04em, `--text-3` |
| Metrics | mono | 500 | 0 (tabular) |

### 2.6 Numerator / denominator pairs (`112/120`)

Rule: **denominator = the numerator's n − 2 step, floored at `--fs-xs`**; mono 500, `--text-3`.

| Numerator | Denominator |
|:--|:--|
| `--fs-3xl` 25 (n=5, scorecard) | `--fs-xl` 20 (n=3) |
| `--fs-lg` 18 (n=2, card header, flashcard) | `--fs-sm` 14 (n=0) |
| `--fs-sm` 14 (n=0, rows, nodes, HUD) | `--fs-xs` 12 (floor) |
| `--fs-xs` 12 (pills) | `--fs-xs` 12 (floor; only the color changes) |

Both in tabular mono, baseline-aligned.

Reading measure: `max-width: 68ch` (≈ 680px at 16px) in the study column.

---

## 3. Spacing and dimensions (4px grid)

| Token | px | Typical use |
|:--|:--:|:--|
| `--sp-1` | 4 | Icon ↔ text in pills, segment container padding |
| `--sp-2` | 8 | Gap between controls in a bar, palette padding |
| `--sp-3` | 12 | Horizontal padding of rows/notices, dense grid gap |
| `--sp-4` | 16 | Card/panel padding, mobile gutter |
| `--sp-5` | 20 | Separation between groups within a section |
| `--sp-6` | 24 | Study column padding, desktop gutter |
| `--sp-8` | 32 | Separation between card sections |
| `--sp-10` | 40 | Separation between major blocks (maximum allowed void) |
| `--sp-12` | 48 | Empty-state margins only |

Only exception to the grid: 1px hairlines, 2px strokes, and the 2px focus offset.

### 3.1 Control heights (explicit, anti-CLS)

| Token | Desktop | Mobile (<768) | Use |
|:--|:--:|:--:|:--|
| `--ctl-xs` | 24 | 32 | Compact interactive pills, kbd |
| `--ctl-sm` | 28 | 40 | Toolbar buttons, secondary icon buttons |
| `--ctl-md` | 32 | 44 | Standard button, input, select, tab |
| `--ctl-lg` | 40 | 48 | Section primary, palette input |
| `--bar-h` | 52 | 56 | Canvas and session top bar |
| `--dock-h` | — | 64 + `env(safe-area-inset-bottom)` | Mobile navigation dock |
| `--sidebar-w` | 248 (collapsed 56) | — | Sidebar |
| `--rail-w` | 320 | — | Card context rail |
| `--rail-track` | 4 (8 on the scorecard) | 4 | Score rail thickness |

Every touch target on mobile ≥ 44×44 (the 32/40 ones expand their area with a pseudo-element up to 44).

### 3.2 Breakpoints

| Name | Range | Structural change |
|:--|:--|:--|
| `mobile` | < 48em (768) | No sidebar; bottom dock; session without rail |
| `tablet` | 48em–68.74em | Sidebar collapsed to 56 (icons + tooltip); card rail as the final section |
| `desktop` | 68.75em–89.99em | Sidebar 248; rail 320 |
| `wide` | ≥ 90em (1440) | Same; the map centers at `max-width: 1320px` |

---

## 4. Concentric radii

Rule: **`outer_radius = inner_radius + padding`** when the padding is smaller than the outer radius. If padding ≥ outer radius, the child does not touch the curve and uses its own token (exempt).

| Token | px | Element |
|:--|:--:|:--|
| `--r-xs` | 4 | kbd, inline code, inner pills |
| `--r-sm` | 6 | Buttons, inputs, tabs, menu items, segments |
| `--r-md` | 8 | Inline notices, tooltips, palette rows |
| `--r-group` | 10 | Segmented controls, menus, popovers with a list (6 + 4) |
| `--r-lg` | 12 | Map cards, graph nodes, code blocks, collapsed HUD |
| `--r-xl` | 16 | Dialogs, palette, drawer, expanded HUD |
| `--r-full` | 999 | State pills, dots, rail tracks |

**Verified pairs (all paddings on the 4px grid)**

| Container → child | Outer | Inner | Padding |
|:--|:--:|:--:|:--:|
| Segmented control → segment | 10 | 6 | 4 |
| Menu / popover with list → item | 10 | 6 | 4 |
| Command palette → result row | 16 | 8 | 8 |
| Expanded HUD → task row | 16 | 12 | 4 |
| Map card (padding 16) → button | 12 | 6 | exempt (16 ≥ 12) |
| Dialog (padding 20/24) → buttons | 16 | 6 | exempt |

---

## 5. Elevation and depth (dark mode; light in §1.9.5)

Depth is communicated through **surface luminosity**. Only overlays cast shadows. Every overlay is **lighter than its host**.

| Level | Elements | Surface | Border | Shadow |
|:--|:--|:--|:--|:--|
| 0 — canvas | App, study session | `--bg-app` | — | — |
| 1 — content | Cards, nodes, rows, panels | `--surface-1` | `--line` | `inset 0 1px 0 rgba(255,248,230,.04)` |
| 2 — hover/active | Hover and press of any level | the element's **own** base surface + `--hover-overlay` / `--press-overlay` | only if the element already had a border: `--line` → `--line-strong`; a selected element keeps its `--accent` border | no change |
| 3 — modal | Settings drawer, flashcard dialog, confirmations | `--surface-1` over `--scrim` | `--line-strong` | `--shadow-modal` |
| 4 — palette | Command palette | `--surface-2` over `--scrim` | `--line-strong` | `--shadow-modal` |
| 5 — floating | Popovers, menus, tooltips, deep dive, expanded HUD | `--surface-3` | `--line-strong` | `--shadow-pop` |

`--shadow-pop: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px -6px rgba(0,0,0,.55)`
`--shadow-modal: 0 2px 4px rgba(0,0,0,.35), 0 12px 32px -8px rgba(0,0,0,.6), 0 32px 80px -24px rgba(0,0,0,.7)`

This way a menu inside the drawer (s3 over s1) or inside the palette (s3 over s2) always sits visually above. No glows, background gradients, or glassmorphism (single exception: `--bar-glass` and the `--scrim` blur, 8px).

---

### 5.1 Toasts
Surface `--surface-3`, border `--line-strong`, `--r-lg` 12, `--shadow-pop`, padding 12×16, width 360–400px. Content: 16px semantic icon (§1.4 notices) + `--fs-sm` `--text-1` text + optional action (ghost button, e.g. "Deshacer") + close. Position: bottom right at 16px (desktop); centered on mobile, 12px above the dock. Duration 5s (pauses on hover/focus); `role="status"` (success/info) or `role="alert"` (error). Maximum 3 stacked (gap 8).

## 6. Iconography
- Set: **lucide** (`lucide-react`), 1.5px stroke, sizes 16 (inline/controls) and 20 (navigation). Color `currentColor`.
- Zero emoji in the UI. Replacements: 🧠 → `BrainCircuit`, ⚖️ → `Scale`, ✨ → `Sparkles`, 🔥 → `Flame`, ⚡ → `Zap`, 🏆 → `Trophy`, ✓ → `Check`, 🗺 → `Map`, 📊 → `BarChart3`, ⚙ → `Settings2`.
- Icon buttons always with `aria-label` + tooltip.

## 7. Motion

| Token | Value | Use |
|:--|:--|:--|
| `--dur-1` | 120ms | Hover, color, opacity |
| `--dur-2` | 180ms | Popovers, tooltips, tabs |
| `--dur-3` | 240ms | Drawers, dialogs, study layer |
| `--dur-flip` | 420ms | Flashcard flip |
| `--ease-out` | `cubic-bezier(.2,0,0,1)` | Entrances |
| `--ease-in-out` | `cubic-bezier(.4,0,.2,1)` | Transforms |
| `--move-1` / `--move-2` / `--move-3` / `--move-4` | 4 / 8 / 16 / 24px | Entrance distances: popover / study layer / drawer / bottom sheet |

Entrances: opacity 0→1 + `translateY(var(--move-n))` (distance per component) or `scale(.98)`. Exits at 70% of the duration. `prefers-reduced-motion: reduce` → opacity only; the 3D flip is replaced by a `--dur-2` fade; skeleton and pulse stay static.

## 8. Signature elements

### 8.1 Score rail
The central data piece. A 120-unit track:
- Track `--surface-inset`, height `--rail-track` (4px; 8px on the scorecard), `--r-full`.
- Base segment 0–100: `--rail-base` (muted paper) if < 100; `--mastery` if ≥ 100.
- Mark at 100: 1px `--text-3`, track height + 4px, centered.
- Extra segment 100–120: `--gold`, separated from the base by 1px.
- Readout: mono 500 "`112`" + "`/120`" (§2.6); if > 100, `★` prefix in `--gold`; if ≥ 100 without extra, `✓` in `--mastery`.
- No evaluation: empty track + "Sin evaluar" text in `--text-3`.
- Pedagogical judge variant (0–100, goal 95): same 100-unit track, mark at 95.

### 8.2 Category dot
8px circle in the category color + `--text-2` label. The only category representation.

### 8.3 Eyebrow
`--fs-2xs`, 600, UPPERCASE, +0.04em, `--text-3`. At most one per section. Never in color.

### 8.4 Reading surface
A 68ch column over `--bg-app` with no card; section titles `--fs-lg`, separation `--sp-8`. Only structured pieces (code, table, diagram, comparison) use `--surface-inset`/`--surface-1`.

## 9. Voice and copy
- English (US), direct and technical. *Sentence case*; UPPERCASE only in eyebrows.
- Numbers in en-US format; scores always `n/120`; percentages without decimals.
- AI states say what is happening and what to do: "Could not reach the AI service. Check that the gateway is running and the provider is available, then retry."
- Backup: "The file includes your connections' API keys. Keep the file somewhere safe."
- No exclamations or emoji. Excellence is celebrated with ★ and gold.

## 10. Layers (z-index)

Order by real flow: popovers always open from the active top layer, which is why they sit above all content layers.

| Token | Value | Layer |
|:--|:--:|:--|
| `--z-base` | 0 | Content |
| `--z-sticky` | 10 | Internal sticky bars (card tabs, group headers) |
| `--z-chrome` | 20 | Top bar, sidebar, mobile dock |
| `--z-study` | 30 | Study session (full layer over the shell) |
| `--z-hud` | 40 | Task HUD (also visible during study) |
| `--z-drawer` | 50 | Settings drawer (scrim at 49) |
| `--z-modal` | 60 | Dialogs: flashcard, confirmation (scrim at 59) |
| `--z-palette` | 70 | Command palette (scrim at 69) |
| `--z-popover` | 80 | Popovers, menus, deep dive |
| `--z-toast` | 90 | Toasts (see §5.1) |
| `--z-tooltip` | 100 | Tooltips |

## 11. Accessibility baseline
- Visible focus: `outline: 2px solid var(--accent); outline-offset: 2px;` only on `:focus-visible` (iris 6.2–7.6:1 against any surface).
- Scrollbars: `scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) transparent;` (WebKit 8px, thumb `--r-full`).
- `::selection { background: var(--selection); color: var(--text-1); }`
- `color-scheme: dark` on `:root`, `color-scheme: light` under `:root[data-theme="light"]` (native controls and scrollbars follow the theme).

## 12. Authentic representation
Mockups, fixtures, and states use real content. Canonical example set (real nodes from `src/`):

| Case | Graph | Real node | Example state |
|:--|:--|:--|:--|
| Excellence | React | "State, snapshots and batching" | 112/120, ★ Extra depth |
| Exact mastery | React | "Hooks and their rules" | 100/120, ✓ Core covered |
| In progress | React | "useState vs useReducer" | 74/120, In progress |
| Review | Rails | "Routing RESTful" | 41/120, Worth reviewing |
| Unevaluated | Rails | "Request lifecycle & Rack" | Not scored, pending prerequisites |
| Longest label | React | "Resilient layout, content and internationalization" | 2-line truncation test |
| Starting point | React | "Modern JavaScript for reading React" | Best next |

Lorem ipsum, "Card title", "User 1" are forbidden.

## Changelog
- **3.2.0**: Light theme *Day Study* (§1.9): full token set in `light.css`, system default with a saved override (`knowgraph:theme`), pre-paint script, toggle next to the language switcher, Settings section and palette action. New tokens in both themes: `--well`, `--fill-secondary`, `--fill-disabled`, `--scrollbar-thumb`, `--node-hover`, `--node-selected`, `--diagram-border`, `--gold-fill`, `--shadow-card`, `--shadow-raised` and the `--cat-*` hue tokens. Mermaid reads its theme from tokens and re-renders on change. Dark values unchanged.
- **3.1.3** (Phase 2): `--surface-2` is now used for the active segment of segmented controls (previously "active card tab"; stage tabs use an indicator, no fill). Adds the distance tokens `--move-1…4` (§7).
- **3.1.2** — Phase 0 seal.
