---
system:
  name: "Learning Workspace — Design System v4"
  version: "4.0.0"
  creative_north_star: "Heat grid"
  aesthetic: "Cool ink/paper neutrals; eleven owned area hues used as fields; interaction in pure ink/paper contrast, no brand accent. Dark (reference) and light editions"
  platform: "Web + Electron (reference desktop 1440×900) · Mobile web (390×844)"
  governing_master_skill: "ui-design-foundations"
  direction_contract: "index.html, first comment inside <body> (THESIS / OWN-WORLD / STORY / FIRST VIEWPORT / FORM)"
  quality_standard: "docs/DESIGN_CRITERIA.md"
  ground_truth: "src/ui/theme/tokens.css, light.css, world.css (imported last, wins), heatgrid.css; src/logic/studyQueue.js"
  supersedes: "DESIGN.md v3.2.0 ('Night Study': warm graphite, iris accent, Geist + Newsreader, sage = mastery, gold = extra)"
---

# Learning Workspace — Design System v4

## 0. Creative north star: *Heat grid* (Rejilla de calor)

The curriculum is a **grid of square concept cells**, one row per area, and each cell **fills with its area's colour** as the learner masters it. At a glance you see which areas are lit and which are dark, find the ringed **NOW** cell, and continue. **More colour means more mastered.** The system refuses the dark-graphite-plus-one-accent productivity look.

Three ideas govern everything:

1. **Colour belongs to the areas.** Eleven owned hues are used as *fields*: cells, square swatches, tinted cards and nodes. They are never reduced to a dot, and nothing else competes with them.
2. **Interaction is ink and paper.** There is no brand accent. Focus, selection, links, "Best next" and the primary button are pure ink-on-paper (light) or paper-on-ink (dark) contrast.
3. **Mastery is one state.** 100 and 101–120 look the same (area tint/fill); extra depth only adds a mark (★ glyph or the cell's inner notch). Green and gold are not mastery fills.

Two editions of the same world: dark (`:root`, `tokens.css`, the reference) and light (`:root[data-theme="light"]`, `light.css`). Every role keeps its meaning; only lightness and depth physics change (§1.9, §5).

**Direction contract** (verbatim in `index.html`): THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM ("Heat grid, 3rd of 7").

### Units
- Font sizes, line-heights, control heights and spacing in **rem** (16px root). Tables show px; `rem = px / 16`.
- Borders, hairlines, strokes, cell sizes and radii in **px**.
- Media queries in **em** (`47.99em` / `48em` = 768px, `68.75em` = 1100px, `90em` = 1440px).

---

## 1. Color

Components reference tokens only. Ratios below are WCAG 2.2, computed from the token hexes.

### 1.1 Neutrals (cool ink, hue ≈ 220°)

| Token | Dark | Light | Use |
|:--|:--|:--|:--|
| `--bg-sidebar` | `#0A0C10` | `#ECEEF2` | Sidebar, mobile dock |
| `--bg-app` | `#0E1117` | `#F6F7F9` | Canvas, study session (also `theme-color`) |
| `--surface-1` | `#151922` | `#FDFDFE` | Heat grid panel, cards, nodes, tiles, dialogs |
| `--surface-2` | `#1B202B` | `#FBFCFD` | Palette, checked segment |
| `--surface-3` | `#232A37` | `#FEFEFF` | Popovers, menus, tooltips, toasts, selected sidebar item |
| `--surface-inset` | `#080A0E` | `#EDEFF3` | Code, inputs, rail tracks, diagrams |
| `--cell-empty` | `#1D2330` | `#E4E7EC` | Empty end of the /120 scale ramp |
| `--line-subtle` / `--line` / `--line-strong` | `rgba(214,226,255,.06/.10/.18)` | `rgba(18,26,44,.07/.12/.20)` | Hairlines; `--line-strong` also outlines empty heat cells |
| `--line-control` | `#5E6779` | `#858E9E` | Form field borders (3.1–3.3:1 vs app / s1) |
| `--hover-overlay` / `--press-overlay` | `rgba(214,226,255,.06/.10)` | `rgba(18,26,44,.045/.08)` | The single hover/press rule (§1.4) |
| `--pill-neutral` / `--skeleton` / `--well` | `.08` / `.07` / `.035` | `.06` / `.07` / `.03` | Neutral pills, skeletons, segmented/kbd wells |
| `--fill-secondary` / `--fill-disabled` | `rgba(214,226,255,.05)` / `.08` | `rgba(255,255,255,.72)` / `rgba(18,26,44,.06)` | Secondary button, disabled primary |
| `--scrim` | `rgba(3,5,9,.72)` | `rgba(18,24,36,.28)` | Behind dialogs/drawer/palette (+ 8px blur) |
| `--bar-glass` | `rgba(14,17,23,.88)` | `rgba(246,247,249,.88)` | Top bar on scroll (+ 8px blur) |
| `--selection` | `#2C3A5C` | `#D3DBEE` | `::selection` |
| `--node-hover` / `--node-selected` | `#1A1F29` / `#232A37` | `#F1F3F6` / `#E8EBF1` | Graph node fills |
| `--scrollbar-thumb` | `rgba(214,226,255,.16)` | `rgba(18,26,44,.22)` | Scrollbars |
| `--diagram-border` | `#3A4252` | `#C7CDD8` | Mermaid node borders |

### 1.2 Text (paper on ink / ink on paper)

| Token | Dark | Contrast app / s1 / s3 | Light | Contrast app / s1 / s3 |
|:--|:--|:--|:--|:--|
| `--text-1` | `#EEF1F6` | 16.7 / 15.5 / 12.7 | `#12161D` | 16.9 / 17.8 / 18.0 |
| `--text-2` | `#AEB6C4` | 9.3 / 8.6 / 7.1 | `#485061` | 7.5 / 8.0 / 8.0 |
| `--text-3` | `#8A93A3` | 6.1 / 5.7 / 4.7 | `#636C7E` | 4.9 / 5.2 / 5.2 |
| `--text-4` | `#525A69` | disabled only | `#A7AEBB` | disabled only |
| `--text-on-paper` | `#0E1117` | on `--paper` | `#F6F7F9` | on `--paper` |

**Text rules.** Never `#FFFFFF` / `#000000` as text. `--text-3` only at weight ≥ 500 (`.t3` enforces it) and never on `--*-soft` tints. Necessary information never in `--text-3` below 12px.

### 1.3 Interaction and semantics

**The No Brand Accent Rule.** `--accent` *is* ink/paper: dark `--accent #EEF1F6`, `--accent-strong #FBFCFE`, `--accent-soft rgba(238,241,246,.10)`; light `#12161D`, `#05070A`, `rgba(18,22,29,.07)`. Every existing `var(--accent)` use (selected rows, `is-best` node stroke, minimap viewport, input focus border, dock active icon, chart cursor) therefore renders as ink/paper contrast. No hue may be introduced for interaction.

| Token | Dark | Light | Role |
|:--|:--|:--|:--|
| `--paper` / `-hover` / `-active` | `#EEF1F6` / `#D9DEE7` / `#C3C9D4` | `#12161D` / `#272D38` / `#3A414E` | Primary button fill; "Best next" pill; far `is-best` graph node and minimap cell |
| `--accent` / `-strong` / `-soft` | see above | see above | Focus, selection, links (ink), cursor |
| `--warn` / `--warn-soft` | `#F6A55E` / `.13` | `#A9550B` / `.10` | Pending prerequisites, stale evaluation, medium severity |
| `--danger` / `--danger-soft` | `#FF6F86` / `.13` | `#C2304D` / `.10` | Errors, delete, high severity |
| `--mastery` / `--mastery-soft` | `#4ED69B` / `.14` | `#0F8F5F` / `.11` | **Fallback only** (`var(--area, var(--mastery))`) and success notices/toasts |
| `--gold` / `--gold-fill` / `--gold-soft` | `#F5C451` / = gold / `.14` | `#8F6400` / `#C9971A` / `.10` | Extra-depth **glyph** (★) only; see §13 for residual fills |
| `--rail-base` | `#AEB6C4` | `#858E9E` | 0–100 segment of the score rail before mastery |

- **Links** (`world.css`): `--text-1`, underline in `--line-strong`, 3px offset; on hover the underline becomes `currentColor`.
- **"Best next" pill** (`.pill--accent`): inverted, `--paper` background, `--text-on-paper`, weight 600 (paper on dark, ink on light).
- **Selected sidebar item**: `--surface-3`, no border, weight 600.
- **Selected state** elsewhere (row, chip, icon button): `--accent-soft` + 1px `--accent` (ink) border + `aria-selected` / `aria-pressed` / `aria-current`.
- **No colour as sole carrier**: every state carries text or a glyph (`aria-label` on cells, ✓ / ★ / lock icons, "n/120").

### 1.4 State-to-token mapping

**Heat level** (`heatLevel(p)` in `src/logic/studyQueue.js`) — the cell fill:

| Level | Condition | Fill (`color-mix(in srgb, var(--area) N%, transparent)`) | Edge |
|:--|:--|:--|:--|
| `h0` | no attempt, no draft | transparent | inset 1px `--line-strong` |
| `h1` | draft or attempts, no score | 20% | inset 1px area @ 35% |
| `h2` | score < 60 | 42% | inset 1px area @ 35% |
| `h3` | score 60–99 | 66% | inset 1px area @ 35% |
| `h4` | complete or score ≥ 100 | 100% (full hue) | none |
| extra | score > 100 (`scoreTier = "extra"`) | h4 + inner notch (`inset: 30%`, `--bg-app`, radius 1px) | none |

Mixing is in **srgb with transparent**, so the hue never shifts across levels; only opacity rises.

**Score tier** (`scoreTier(p)`: `none` · `progress` · `mastered` · `extra`) drives cards, rows, nodes, flashcards and study-tab badges:

| Tier | Treatment |
|:--|:--|
| `mastered` and `extra` (identical) | Card/flashcard: `color-mix(in oklch, var(--area) 14%, var(--surface-1))` fill, border area @ 60% (hover: full area). Row: area @ 12%. Pill/badge: area @ 22%, `--text-1` text, icon in area hue. Score rail base: area hue. |
| `extra` adds | ★ glyph (`Star`, lucide) beside the score; notch on heat cells |
| `progress` | Neutral surface; rail in `--rail-base`; graph far node area @ 45% |
| `none` | Neutral; "Not scored" in `--text-3` |

**Evaluation pills** keep icon + text: `review` (<60) `--warn-soft`/`--warn` + `AlertTriangle`; `developing` `--pill-neutral`/`--text-2` + `CircleDashed`; mastered/extra as above.

**Inline notices** (one row, no bordered box, `--r-md`, padding 8×12): error `--danger-soft` + `AlertCircle`; warning `--warn-soft`; info transparent + top hairline; success `--mastery-soft` + `CheckCircle2`.

**Buttons** (`primitives.css`):

| Variant | Background | Border | Text | Hover | Active |
|:--|:--|:--|:--|:--|:--|
| Primary | `--paper` | — | `--text-on-paper` | `--paper-hover` | `--paper-active` + 1px down |
| Secondary | `--fill-secondary` | `--line` | `--text-1` | + `--hover-overlay`, `--line-strong` | + `--press-overlay` |
| Ghost | transparent | — | `--text-2` | `--hover-overlay`, `--text-1` | `--press-overlay` |
| Destructive | transparent | — | `--danger` | `--danger-soft` | + `--line-strong` |
| Disabled | transparent (primary `--fill-disabled`) | `--line-subtle` | `--text-4` | — | — |

**The Single Hover Rule.** Every hover/press is `--hover-overlay` / `--press-overlay` over the element's own surface; borders change only if one exists (`--line` → `--line-strong`; mastered cards → full area). Exceptions: destructive (`--danger-soft`), heat cells (scale, §8.1).

### 1.5 Area hues (identity *and* progress field)

Eleven hue tokens, one per area, set per theme so each edition tunes lightness. `src/ui/theme/categoryPalette.js` maps area → token (`var(--cat-*)`); unknown area → `color-mix(in oklch, <data hex> 60%, var(--text-2))`, or `--text-3` without data.

| Token | Dark | Light | React area | Rails area |
|:--|:--|:--|:--|:--|
| `--cat-cyan` | `#3DB9EE` | `#0A87B8` | fundamentals | infra |
| `--cat-blue` | `#6C8DFF` | `#3D5FE0` | architecture | patterns |
| `--cat-violet` | `#A08AFF` | `#6E52E3` | effects | sti |
| `--cat-orchid` | `#DE7BEA` | `#A944B8` | quality | — |
| `--cat-rose` | `#FF6E9C` | `#CF3468` | designSystem | activerecord |
| `--cat-coral` | `#FF7F5E` | `#D44E2E` | operations | fundamentals |
| `--cat-orange` | `#FFA347` | `#C26A0C` | state | — |
| `--cat-yellow` | `#E6CC45` | `#9C8000` | runtime | — |
| `--cat-lime` | `#A6DB4B` | `#5A9412` | rendering | testing |
| `--cat-green` | `#43D69B` | `#0F9165` | leadership | assets |
| `--cat-teal` | `#2FD0C2` | `#0B8F86` | platform | — |

Contrast: dark hues 5.8–11.0:1 over `--surface-1`; light hues 3.4–5.0:1 over `--bg-app` (≥ 3:1 non-text everywhere; only blue, violet, orchid, rose reach 4.5 as text).

**The Fields Not Dots Rule.** Area colour appears as: heat cells, 12px square swatches in grid rows, square category marks (`.cat-dot`, radius 2px; 10px in the sidebar), mastered tints on cards/rows/flashcards/nodes, `--area` on the study session (`--lesson-color`). It is set per element as the `--area` custom property. Not for body text, buttons, or interaction states.

### 1.6 Code (unchanged from v3)

`--code-bg` = `--surface-inset`; block code `--fs-sm` / 24px line-height; inline `--code-inline-bg` (`rgba(255,248,230,.07)` dark, `rgba(58,46,28,.06)` light), `--r-xs`. Syntax: dark `--syn-keyword #BAA4E2`, `--syn-string #A4C386`, `--syn-number #E5A880`, `--syn-function #80C1E1`, `--syn-tag #E199AF`, `--syn-attr #D5BA82`, `--syn-type #81C6C1`; light `#6B46A0`, `#416B25`, `#9B4805`, `#006692`, `#9C365D`, `#7E5904`, `#006D69`; comment `--text-3` italic, punctuation `--text-2`, plain `--text-1`. Code block: `--line` border, `--r-lg`, 36px header with `--fs-xs` `--text-3` label and ghost actions, body padding 16, own horizontal scroll. Mermaid reads its theme variables from tokens before each render.

### 1.7 Charts

`--chart-eval` `--text-1` (filled circle), `--chart-eval-line` `--text-2`, `--chart-coach` `--text-3` (hollow diamond), `--chart-guide` `--line` dashed, `--chart-threshold` `--text-3`, `--chart-cursor` `--accent` (ink), `--chart-axis` `--text-3` mono, `--chart-band-extra` `--gold-soft`. Series are told apart by shape and a text legend.

### 1.8 Streaming, loading, provisional

Skeleton `--skeleton`, opacity .55 ↔ 1 over `--skeleton-dur` 1.4s, exact geometry of the resolved content. Caret 2px × 1em `--text-2`, 1s `steps(2)`. Provisional score: figures in `--text-2`, rail at `--provisional-opacity` .5. AI pulse: `Sparkles` icon, opacity .45 ↔ 1 over 1.6s, never a dot. Time bar fill `--text-3`, `--warn` past 1.5×.

### 1.9 Choosing the theme

- Default follows `prefers-color-scheme`; explicit choice in `localStorage["knowgraph:theme"]` (`"light"` | `"dark"`; "System" removes the key). Runtime store: `src/ui/theme/theme.js`.
- Before first paint an inline script in `index.html` sets `<html data-theme>` and `<meta name="theme-color">` (`#F6F7F9` / `#0E1117`); the CSP allows it by sha256 hash and `tests/logic/theme.mjs` fails if they drift.
- Controls: icon button by the EN/ES switcher (shows `Sun` in dark, `Moon` in light), System/Light/Dark segmented control in Settings, palette action.

---

## 2. Typography

### 2.1 Families (local `@fontsource-variable/*`, imported in `src/main.jsx`; no CDN)

| Token | Family | Role |
|:--|:--|:--|
| `--font-display` | `"Bricolage Grotesque Variable", "Figtree Variable", ui-sans-serif` | All `h1–h3` and named titles (view, grid, Continue, group, stage, panel, study, flashcard). Optical sizing auto, −0.02em |
| `--font-ui` | `"Figtree Variable", ui-sans-serif, system-ui` | UI, labels, reading body |
| `--font-mono` | `"JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo` | Scores, counts, `/120`, code, kbd |
| `--font-read` | `= var(--font-display)` | `.serif` display moments: lesson lead, flashcard title, verdicts, empty-state titles (weight 500, −0.025em) |

`.mono` always sets `font-variant-numeric: tabular-nums`; every live figure is tabular.

### 2.2 Scale (unchanged; ratio 1.125, 14px base)

| Token | px | Line-height | Use |
|:--|:--:|:--:|:--|
| `--fs-2xs` | 11 | 16 | Section labels, kbd only |
| `--fs-xs` | 12 | 16 | Pills, counts, legend, metadata |
| `--fs-sm` | 14 | 20 | **UI base** |
| `--fs-md` | 16 | 26 | Reading body, textarea |
| `--fs-lg` | 18 | 26 | Panel/section titles, Continue tile name |
| `--fs-xl` | 20 | 28 | Grid mastered count, empty-state titles |
| `--fs-2xl` | 22 | 30 | Intro title; lesson lead and flashcard title on mobile |
| `--fs-3xl` | 25 | 32 | Lesson lead, flashcard dialog title, practice question, scorecard score |
| `--fs-4xl` | 28 | 36 | View title, grid title, Continue title (weight 800, −0.03em) |
| `--fs-5xl` | 32 | 40 | Large figures in Progress and Evaluate |

Mobile (< 48em): `--fs-5xl` → 25, `--fs-4xl` → 22, `--fs-2xl` → 20, `--fs-2xs` → 12 (nothing under 12px on mobile).

### 2.3 Weights and tracking

| Style | Family | Weight | Tracking |
|:--|:--|:--|:--|
| View / grid / Continue title | display | 800 | −0.03em |
| Other headings, group title | display | 600–700 | −0.02em |
| `.serif` display moments | display | 500 | −0.025em |
| Labels / buttons | ui | 500 | −0.005em |
| Body | ui | 400 | 0 |
| Section label (`.eyebrow`) | ui | 700, UPPERCASE, `--text-3` | +0.08em |
| Metrics | mono | 500 | 0 (tabular) |

**Numerator / denominator** (`112/120`): denominator one-to-two steps smaller, mono 500, `--text-3`, baseline-aligned (sm→xs, md→sm, lg 25→20).

**The No Kicker Rule.** No eyebrow is placed above a heading. `.eyebrow` exists only as a small section label that *is* the heading of a compact block (context-rail sections, coach panel lists, flashcard "Key idea", minimap/ruler labels, sidebar "Focus"). Never in colour. See §13 for the graph panel exception the build still carries.

---

## 3. Spacing and dimensions (4px grid, unchanged)

| Token | px | Typical use |
|:--|:--:|:--|
| `--sp-1` | 4 | Icon ↔ text in pills, segment padding |
| `--sp-2` | 8 | Gap in bars, swatch ↔ area name |
| `--sp-3` | 12 | Row padding, grid head/rows gap, tile gap |
| `--sp-4` | 16 | Card/tile padding, grid label ↔ cells, mobile gutter |
| `--sp-5` | 20 | Grid horizontal padding, group separation |
| `--sp-6` | 24 | Study column padding, desktop gutter |
| `--sp-8` | 32 | Between card sections, Continue bottom padding |
| `--sp-10` | 40 | Between major blocks (maximum void) |
| `--sp-12` | 48 | Empty states only |

Off-grid by design: 1px hairlines, 2px rings, 3–4px gaps between heat cells and rows.

**Control heights** (desktop / mobile): `--ctl-xs` 24/32, `--ctl-sm` 28/40, `--ctl-md` 32/44, `--ctl-lg` 40/48, `--bar-h` 52/56, `--tabs-h` 44, `--dock-h` 64 + safe area. Widths: `--sidebar-w` 248 (collapsed 56), `--rail-w` 320, `--panel-w` 360, `--col-w` 720 (study column), `--col-wide` 880. Mobile touch targets ≥ 44×44 (pseudo-element expansion).

**Breakpoints**: mobile < 48em (no sidebar, bottom dock, grid rows stack); tablet 48–68.74em (sidebar 56, context rail becomes a final section); desktop ≥ 68.75em; wide ≥ 90em (study stage max 1320px).

---

## 4. Radii (square world, 4–8px)

| Token | px | Element |
|:--|:--:|:--|
| `--r-xs` | 3 | kbd, inline code (heat cell uses a literal 3px) |
| `--r-sm` | 4 | Buttons, inputs, segments, menu items, icon buttons |
| `--r-md` | 6 | Notices, tooltips, palette rows, grid area buttons |
| `--r-group` | 8 | Segmented controls, menus, popovers (4 + 4 padding) |
| `--r-lg` | 8 | Cards, tiles, flashcards, code blocks, toasts |
| `--r-xl` | 12 | Heat grid panel, dialogs, palette, drawer |
| `--r-full` | 999 | Pills, rail tracks, avatars |

Square marks: heat cells 3px (grid hit area 4px), swatches 3px, `.cat-dot` 2px, minimap cells 1px. **Concentric rule**: `outer = inner + padding` when padding < outer (segmented 8 = 4 + 4; menu 8 = 4 + 4); when padding ≥ outer the child is exempt (cards with 16px padding).

---

## 5. Elevation and depth

Dark: depth through **surface luminosity**; content carries only `--shadow-card` (`inset 0 1px 0 rgba(255,248,230,.04)`), the checked segment `--shadow-raised` (`.06`). Light: surfaces are close, so **ink-tinted shadows** carry depth (`--shadow-card 0 1px 2px rgba(48,36,20,.05)`, `--shadow-raised .10`).

| Level | Elements | Surface | Border | Shadow |
|:--|:--|:--|:--|:--|
| 0 canvas | App, study | `--bg-app` | — | — |
| 1 content | Heat grid panel, tiles, cards, nodes | `--surface-1` (or area tint) | `--line` (mastered: area @ 60%) | `--shadow-card` |
| 2 hover/press | any | own surface + overlay | `--line` → `--line-strong` | unchanged |
| 3 modal | Drawer, flashcard dialog, confirms | `--surface-1` over `--scrim` | `--line-strong` | `--shadow-modal` |
| 4 palette | Command palette | `--surface-2` over `--scrim` | `--line-strong` | `--shadow-modal` |
| 5 floating | Popovers, menus, tooltips, toasts | `--surface-3` | `--line-strong` | `--shadow-pop` |

Dark `--shadow-pop: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px -6px rgba(0,0,0,.55)`; `--shadow-modal: 0 2px 4px rgba(0,0,0,.35), 0 12px 32px -8px rgba(0,0,0,.6), 0 32px 80px -24px rgba(0,0,0,.7)`. Light versions use `rgba(48,36,20,…)`. No glows, gradients or glassmorphism (exceptions: `--bar-glass`, scrim blur 8px).

**Toasts**: `--surface-3`, `--line-strong`, `--r-lg`, `--shadow-pop`, padding 12×12×12×16, width ≤ 400px, bottom-right 16px (mobile: full width, 12px above the dock), 5s (`--dur-toast`), max 3 stacked.

## 6. Iconography (unchanged)
- **lucide** (`lucide-react`), 1.5px stroke (2px on small graph glyphs), 16 inline / 20 navigation, `currentColor`.
- Zero emoji. State glyphs: `Check` (mastered, in area hue), `Star` (extra), `Lock` (blocked), `AlertTriangle`, `CircleDashed`, `Sparkles` (AI working).
- Icon buttons always carry `aria-label` + tooltip.

## 7. Motion (unchanged)

| Token | Value | Use |
|:--|:--|:--|
| `--dur-1` | 120ms | Hover, colour, heat-cell scale |
| `--dur-2` | 180ms | Popovers, tooltips, tabs |
| `--dur-3` | 240ms | Drawers, dialogs, study layer |
| `--dur-flip` | 420ms | Flashcard flip (180ms reduced) |
| `--dur-rail-grow` | 480ms | Score rail / bar width |
| `--ease-out` / `--ease-in-out` | `cubic-bezier(.2,0,0,1)` / `(.4,0,.2,1)` | Entrances / transforms |
| `--move-1…4` | 4 / 8 / 16 / 24px | Entrance distances (0 under reduced motion) |

Entrances: opacity + `translateY(--move-n)` or `scale(--scale-enter .98)`. `prefers-reduced-motion`: opacity only, transitions 1ms, heat-cell scale off, skeleton/pulse static.

## 8. Signature elements

### 8.1 Heat cell (`HeatCell.jsx`, `.heat` in `world.css`)
A square of size `--cell` (default 14px), radius 3px, coloured by `--area` at the heat level of §1.4. Decorative (`aria-hidden`); whoever makes it a control provides the accessible name. **NOW** (`is-now`, the guidance primary): a 2px ink ring outside a 2px surface gap — `box-shadow: 0 0 0 2px var(--surface-1), 0 0 0 4px var(--text-1)` (h0 keeps its inner outline). Hover in the grid: `scale(1.18)` over `--dur-1`.

### 8.2 Heat grid (`HeatGrid.jsx`, `heatgrid.css`)
The map's first viewport. A `--surface-1` panel (`--r-xl`, `--line`, padding 16×20). Head: title (display 800, `--fs-4xl`), mastered total (`done` mono `--fs-xl` `--text-1` + `/total` `--text-3`), and a legend pushed right: "Less" h0→h4 "Mastered", plus an extra cell (12px cells). Rows: one per area, gap 3px, `minmax(12rem,16rem) | 1fr`. Left: area button (12px swatch, name, mono `done/total`) that toggles focus (`aria-pressed`, area @ 16% fill). Right: one cell per concept sorted by priority, column track sized to the longest area, `--cell: clamp(18px, 1.75vw, 30px)`, cell gap 4px. Each cell is a button opening the card; `aria-label` = "label · status · Best next".
- Mobile: rows stack (label above cells), cells fixed 18px `auto-fill`, legend left-aligned.

**First viewport (Map)**: heat grid full width → Continue tiles → concept groups. Continue tiles: `--surface-1`, `--r-lg`, padding 16, `auto-fit minmax(16rem,1fr)`; the best-next tile has an ink border (`--text-1` @ 40%), the "Best next" pill and the single **primary** button; other tiles use secondary.

**Cited exception — Continue first on mobile.** `.app.is-mobile .continue { order: -1 }` puts Continue above the grid on phones, because the primary mobile job is "where do I continue"; the grid follows directly.

### 8.3 Area-tinted mastery
See §1.4. Applies to map concept cards and rows, flashcards (`.fcard`), study tab badges, graph nodes (far: full area fill; near: area @ 16% fill + area @ 70% stroke; progress: area @ 45% / 8%), minimap cells (mastered full area; best next `--paper`). Mixing for tints is `in oklch` against the surface. Prerequisite chain edges: met `--text-1`, missing `--text-3`.

### 8.4 /120 scale and score rail
- **Scale** (`.scale`, onboarding/evaluate empty state): three segments 99 : 1.5 : 20, 8px, gap 2px: progress `--text-2` @ 45% over `--cell-empty`, mastered `--text-1`, extra `--text-1` at .55 opacity. Legend glyphs in `--text-1`. An ink ramp, matching the cell ramp.
- **Score rail** (`Score.jsx`): 120-unit track, `--surface-inset`, 4px (8px large), `--r-full`; base 0–100 `--rail-base`, area hue when mastered; 1px `--text-3` mark at 100; extra segment 100–120 after a 1px gap. Readout mono "112" + "/120", `★` before the number when > 100, `✓` in area hue at mastery.
- **Progress bars** (`.pbar`): `--text-2`; mastered bar `--text-1`.

### 8.5 Area swatch / category mark
Square, area hue, radius 2–3px, beside a `--text-2` (or `--text-1`) name. The only small-scale representation of an area.

### 8.6 Reading surface
A `--col-w` 720px column over `--bg-app`, no card; lesson lead in `.serif` `--fs-3xl` (mobile `--fs-2xl`); body `--fs-md` Figtree; context rail 320px. Only structured pieces (code, table, diagram) use inset/surface.

## 9. Voice and copy (unchanged)
- English (US), direct and technical, sentence case; UPPERCASE only in section labels.
- en-US numbers; scores always `n/120`; percentages without decimals.
- AI states say what is happening and what to do. No exclamations or emoji. Extra depth is marked with ★, not celebrated.

## 10. Layers (z-index, unchanged)

`--z-base` 0 · `--z-sticky` 10 · `--z-chrome` 20 (top bar, sidebar, dock) · `--z-study` 30 · `--z-hud` 40 · `--z-drawer` 50 (scrim 49) · `--z-modal` 60 (scrim 59) · `--z-palette` 70 (scrim 69) · `--z-popover` 80 · `--z-toast` 90 · `--z-tooltip` 100.

## 11. Accessibility baseline
- Focus: `:focus-visible { outline: 2px solid; outline-offset: 2px }`, colour `--text-1` (ink in light, paper in dark: ≥ 12.7:1 on any surface). Forced colours: `Highlight`.
- Heat cells never carry meaning alone: every cell button has an `aria-label` with name, status ("not started", "draft, not evaluated yet", "74/120", "112/120 · extra depth") and "Best next"; the legend is `role="img"` with a text label.
- Mobile targets ≥ 44×44; nothing under 12px on mobile.
- Scrollbars thin, `--scrollbar-thumb`; `::selection` `--selection` + `--text-1`; `color-scheme` follows the theme.

## 12. Authentic representation
Mockups, fixtures and states use real content from `src/`:

| Case | Graph | Real node | State |
|:--|:--|:--|:--|
| Extra | React | "State, snapshots and batching" | 112/120, full cell + notch, ★ |
| Exact mastery | React | "Hooks and their rules" | 100/120, full cell, ✓ |
| In progress | React | "useState vs useReducer" | 74/120, h3 |
| Review | Rails | "Routing RESTful" | 41/120, h2 |
| Not started | Rails | "Request lifecycle & Rack" | h0, pending prerequisites |
| Longest label | React | "Resilient layout, content and internationalization" | 2-line truncation |
| Starting point | React | "Modern JavaScript for reading React" | NOW ring, Best next |

Lorem ipsum, "Card title", "User 1" are forbidden.

## 13. Known divergences (recorded, not canonized)
These exist in the build but are **not** system rules; new surfaces must not copy them.
- **Gold fills on extra**: `.rail__extra` and the graph node's extra segment (`.gnode__extra`) still fill with `--gold-fill`; `.gnode.is-extra .gnode__icon`, `.glegend__star`, `.score-value__star` use `--gold` (glyph use is allowed). Coach "partial" icons, lesson takeaway icon, practice streak and the evaluate "optional depth" focus (`--gold-soft`) also use gold outside extra.
- **Green fallbacks**: Progress view bands (`.band.is-complete` border/icon), `.rail-link__done`, coach "covered" icon and the production code-compare border still use `--mastery`; any rail/pill without an `--area` ancestor falls back to green.
- **Kicker**: the graph node panel/sheet shows an eyebrow ("Stage n") above the node title.
- **Display face as reading face**: `--font-read` = Bricolage, so the paraphrase editor and evaluation draft (`--font-read`) set long-form writing in the display face, not Figtree.

## Changelog
- **4.0.0** (2026-10-06): *Heat grid* replaces *Night Study*. Warm graphite → cool ink neutrals (hue ≈ 220°) in both themes. Iris accent removed: `--accent` = ink/paper, inverted "Best next" pill, ink links and focus. Eleven area hues (`--cat-cyan…--cat-teal`, new set incl. blue, coral, orange, yellow, lime, green, teal) become fields (cells, square swatches, tints) instead of 8px dots. Mastery is area-tinted; green and gold no longer fill mastery/extra (extra = notch or ★). New heat cell (5 levels, srgb mix), heat grid as the map's first viewport with the NOW ring, `--cell-empty`, ink /120 scale. Geist + Newsreader → Bricolage Grotesque (display) + Figtree (UI/reading) + JetBrains Mono. Radii tightened to the square world (4/6/8, dialogs 12). Mobile shows Continue above the grid.
- **3.2.0**: light theme *Day Study*, theme choice and pre-paint script (still in force, §1.9).
- **3.1.x**: segmented `--surface-2`, `--move-1…4`; Phase 0 seal.
