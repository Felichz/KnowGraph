# 003 — Graph view: whole map, semantic zoom, prerequisite chain

Status: implemented (2026-09-30). Governing: DESIGN.md v3.2 (Night Study / Day Study). No new tokens, fonts or colors.

## A. Problem and job

The previous graph showed ~3 of 17 stage columns at a time with 236×88 cards and hid almost every dependency until hover: the curriculum (React: 101 concepts, 212 dependencies, 17 stages) was never visible as a whole.

**Job (user-confirmed):** answer *"where do I continue?"* while letting the person **see the structure**.
Decisions taken with the user:
- 2D, not three.js (occlusion, unreadable labels, keyboard and screen-reader cost).
- Desktop first; mobile simplified but usable.
- A "route line" (single ordered list + dependency arcs) was built and **rejected**: it reads as a plain list and hides the structure. Do not reintroduce it.
- Chosen: *improve the existing stage graph* — whole map on screen, compact nodes, every edge visible, semantic zoom.

## B. Layout

- Topological ranks from `createTopologicalLayout` (crossing-minimising sweeps, `align: "center"`): **one column per stage, left → right**, each column centred vertically.
- World units: node 176×46, column gap 44, row gap 10, padding 24. Odd stages carry a `--well` band.
- Why columns: a whole stage (≤ 14 concepts) fits the canvas height at a readable zoom, so the main view shows ~5 complete stages with titles. A top→bottom variant (rows) fitted the whole map at 35% but with no readable titles; rejected after user feedback ("hard to understand visually").
- Desktop: canvas + docked panel (20rem; 17rem below 68.75em). Mobile: canvas only + bottom sheet.

## C. Semantic zoom

| Zoom | Node rendering |
|:--|:--|
| `k < 0.62` (far) | Solid status pill, no text: mastered **and extra** `--mastery` (101–120 is still mastered; only the ★ and the gold 100→120 stretch of the score bar tell it apart), in progress `--rail-base` mix, ready `--surface-3` + 1.5px `--text-1`, blocked `--surface-1` + `--line-control`, best next `--accent`. |
| `k ≥ 0.62` (near) | Soft tint of the same status + 7px category dot + 2-line title (14px) + 2px score bar + status icon: ✓ mastered (sage), ★ extra (gold star on the same sage box), lock blocked; in-progress shows its score. Blocked nodes use a **dashed** outline and `--text-2` title; ready nodes a solid 1.5px `--text-1` outline. |

Screen-size **callouts** (HTML overlay) keep what matters readable when zoomed out: best next (accent pill + title), the hovered and the selected concept. Zoomed in they are hidden (the node itself is legible and the accent node marks best next).

**Minimap** (bottom right, desktop): the whole curriculum as status-colored chips, best next in accent, the current view as an accent rectangle; click or drag to move. It is the overview; the main view stays legible.

## D. Focus: prerequisite chain

- `collectChain(id, layout)` (`src/logic/graphChain.js`): **transitive** ancestors, direct unlocks, chain edges and out edges.
- Inspected = hovered ?? selected. Chain edges: 1.75px `--mastery` (prerequisite mastered) / `--warn` (missing). Unlock edges: dashed `--text-2`. Rest of the edges at 30% opacity.
- Nodes outside the chain dim to 28% only after explicit interaction (hover or click), so the opening view stays a full progress overview.
- Focus filter (sidebar): out-of-focus nodes at 10%, not focusable; fit uses only in-focus bounds.

## E. Camera and controls

- Opens **readable, not fitted**: zoom 0.78–1 so the tallest stage fits in height, with the best next's column at ~34% of the width (its prerequisites to the left, what follows to the right), never leaving empty space left of stage 1. Mobile opens centred on the best next at 85%. *Show the whole map* fits everything (chips + callouts).
- Wheel zoom anchored on the cursor, drag to pan (`useGraphViewport`). Camera jumps (fit, best next, panel links) animate 380ms `--ease-out`; ruler and callouts transition in sync. Reduced motion: no animation.
- Controls (top right): best next, fit, −, zoom %, +. Stage ruler: fixed top strip; each column shows `n` and `mastered/total` (sage when complete), following the camera.
- Legend (bottom left, desktop): status swatches, chain, unlocks, interaction hint.

## F. Interaction and keyboard

- Click selects (panel updates); double-click or Enter opens the card; *Study now* in the panel opens it.
- Roving tabindex: ←/→ previous/next stage (nearest in y), ↑/↓ within the stage; focus selects and pans if off-screen. Home → best next, +/−/0 zoom and fit.
- Panel *Needs* / *Unlocks* entries select and fly to that concept (zoom ≥ 100%); out-of-focus entries open the card.

## G. Panel

Eyebrow (*Best next* pill or *Stage n of N*) + category, title `--fs-2xl`, score rail + readout, *Study now* (primary) and *Back to best next* (ghost), *Why now* (`getLessonContext`), *Needs* (✓ sage / ⚠ warn) and *Unlocks* lists.

## H. Accessibility

- SVG `role="application"` with a label that states the size and the keyboard model; nodes `role="button"` with label: title, stage, status, best next / level, AI activity.
- Every state is carried by shape/text as well as color (pill fill vs outline, panel icons, callout text).
- Out-of-focus nodes are `aria-hidden`.
