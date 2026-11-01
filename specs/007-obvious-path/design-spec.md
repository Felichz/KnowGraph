# 007 — One obvious path

Status: implemented (2026-10-31). Governing: DESIGN.md v4.2. Mode: Operate. Command: distill.

## Problem
Every piece was clear on its own, but the first screen offered ~140 targets with similar weight (101 grid cells, 11 area buttons, a duplicate Focus list, three nav views, search, settings, List/Graph, EN/ES, theme, three Continue tiles). The action that matters competed with all of it, and several things could be done two ways.

## Principles
1. **One primary action per screen**, visually dominant; alternatives are text links.
2. **Never a dead end**: every finished action proposes the next one.
3. **One control per job**: remove duplicates rather than restyle them.
4. **Progressive disclosure**: what only matters later appears later.

## Changes
| Area | Before | After |
|:--|:--|:--|
| Navigation | Map · Flashcards · Progress (+ Focus list of 11 areas) | **Study** · **Review** (due count on Review). Progress → collapsed *Levels and milestones* under the grid; `?view=progress` falls back to the map. |
| Focus | Sidebar list + grid rows + mobile sheet | Grid rows only; a top-bar chip names the focused area and clears it. |
| Top bar | Title · List/Graph · EN/ES · theme | Title and focus chip. Language/theme in Settings (and the palette). |
| Graph | Toggle in the top bar | "View as graph" on the grid header; "Back to the grid" in the graph toolbar; palette actions for both. |
| Curriculum | Large React/Rails segmented control | Compact menu (a choice made rarely). |
| Map first viewport | Grid, then three Continue tiles | **Next step** block first (resume or best next; one large primary); "or review N due" as a link. Grid below. |
| First use | Grid of 101 empty cells + intro + tiles | Only "Start here" with one button and the three-step loop. Grid and levels appear with the first activity. |
| Study session | 4 equal tabs (Read, AI mentor, Paraphrase, Evaluate) | Path **Read → Explain → Evaluate**; mentor is a header aid ("Ask the mentor"). Each stage ends in one primary. |
| Paraphrase | "Review with AI" and "Evaluate" side by side | Coaching runs after a 5 s pause (once per draft version); one primary, Evaluate. |
| After evaluating | Improve / Back to map | 100+ → **Next: <concept>**; below → **Improve my explanation**; "Back to Study" as a link. |
| Flashcards | Grid modal (read-only) + separate Practice dialog; 5 filters | One mode: opening a card *is* reviewing it (reveal, rate 1–4, next). Filters: Due today / All. Finishing offers "Continue studying: <concept>". |

## Removed (and where it went)
- Sidebar Focus list, mobile focus sheet → grid rows + focus chip.
- Progress view → *Levels and milestones* (map). Seniority and milestones unchanged.
- Top-bar EN/ES and theme toggle → Settings drawer; palette actions remain.
- Practice dialog → flashcard modal.
- "Review with AI" button → automatic coaching on pause.
- Dismissable first-use panel → the three steps inside the first-use next step; they disappear with activity.

## Accessibility
Nav items announce the due count; the focus chip is a button labelled "Show all areas"; the mentor button exposes `aria-pressed`; when the mentor is open the tabpanel is labelled by the mentor stage name; rating buttons carry visible key hints.
