# Visual QA checklist — Learning Workspace

Reviewed: 2026-08-12, against the local Vite app. The evidence combined real screenshots, mouse/keyboard interaction, and review of the state contracts that do not exist in the current IndexedDB.

Statuses: `Pass` = verified at runtime; `Finding resolved` = it was found, fixed, and re-verified; `N/A verified` = there was no safe data to mount that state, but its contract, styles, and tests were reviewed. No rows remain pending.

## Cross-cutting evidence

- Breakpoints captured: `1440×900`, `1280×800`, `1024×768`, `768×900` and `390×844`.
- On desktop the document preserves the viewport (`scrollWidth === viewport width`, no global scroll). On mobile there is vertical content scroll, but after the fix `scrollWidth` settled at `375 px` within a `390 px` viewport: no horizontal overflow.
- Real routes were verified: `/` redirects to `/react`; `/react`, `/rails`, `/react/card/react_mental_model` and `/react/card/js_basics` open the corresponding surface.
- `npm run build` and `npm run test:logic` were run after the UI changes.

## Findings resolved

| ID | Finding | Fix | Follow-up review |
| --- | --- | --- | --- |
| V-01 | The initial focus showed a next stage as a partially cut-off column. | `GraphTopologyView` computes how many complete stages fit and adjusts its scale/anchor deterministically. | Screenshots at 1440, 1280 and 1024: only complete cards are visible; the “Next focus” control returns to the same framing. |
| V-02 | The flashcard close button appeared empty because the global style hid the `×` character. | It was replaced with an SVG from the same icon system. | Detail screenshot: icon visible, accessible button, working close. |
| V-03 | At 390 px the progress panel rendered in a row and grew the document to ~5,151 px wide. | The mobile panel now stacks sections, constrains its width, and delegates scrolling only to its internal strips. | `scrollWidth` dropped from 5151 to 375 px; the global horizontal bar disappeared. |
| V-04 | The empty flashcard filter used a button stretched across the entire canvas and had no hierarchy. | Centered empty state, legible copy, and compact action. | Screenshot with the gold-extras filter: message and “Show all” centered and proportionate. |
| V-05 | A coaching error could render as barely distinguishable text. | Error panel with contrast, indicator, cause, and recovery copy in the UI language. | The visual contract and the error formatter were reviewed; the draft is not discarded. |
| V-06 | Switching tabs could retain an intermediate scroll position. | The card resets horizontal and vertical scroll when the node or view changes. | Lectura → Coaching → Evaluar was switched at runtime: each surface started from the top. |

## A. Desktop shell and map

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| A1 | Start with navigation closed | Finding resolved | Screenshot at 1440: map as the protagonist, compact command bar, no global scroll. V-01 removes cut-off cards. |
| A2 | Navigation open | Pass | Screenshot at 1440: React/Rails, filters, tabs, and next challenge legible in the rail; the canvas keeps focus. |
| A3 | Progress panel | Pass + N/A verified | Screenshot at 1440 of the empty panel: its own rail, milestones, and bands without displacing the map. The partial/complete/gold states depend on real progress; styles and milestone calculation were reviewed through existing contracts. |
| A4 | AI panel | Pass + N/A verified | The disconnected state, loaded catalog, MiniMax search, and MiniMax form were checked. No personal connection was created and no key was submitted just to fabricate error/success. |
| A5 | Graph switch | Pass | React → Rails opened `/rails`, updating title, categories, suggested route, and counter. `/` returns to React as the default. |
| A6 | Mode switch | Pass | Grafo ↔ Flashcards tested with the rail open/closed: it preserves the workspace and generates no scroll or invalid routes. |
| A7 | Breakpoints | Finding resolved | 1440/1280/1024/768/390 reviewed. V-03 resolved the only horizontal overflow detected. |

## B. Topological graph

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| B1 | Initial route | Finding resolved | V-01: the first stages and the next visible one fit completely; there are no half cards. |
| B2 | Expanded navigation | Pass | Open rail shows three complete stages and the contextual guide without overlapping. |
| B3 | Hover and focus | Pass | Hover over “Modelo mental” showed `Necesita 1 · Habilita 2`, high-contrast input/output edges, and the full title via `<title>`. The same state is wired to `onFocus`. |
| B4 | Node states | Pass + N/A verified | Pending, score `0/120`, selected, and route guide were captured. The classes for partial, base `100/120`, and golden excellence are covered by `getNodeVisual` and CSS; the current store contains none of those scores to capture without altering study data. |
| B5 | Controls | Pass | Zoom increased the node width from 236.6 to 274.5 px and zoom-out restored it. Pan, fit, and next focus preserve the viewport without jumping. |
| B6 | Full map | Pass | Fit shows the entire DAG as an overview; “Next focus” restores the study route. |
| B7 | Filters | Pass | Isolating “Web architecture” left 19 of 101 nodes active and updated the next challenge to Routing SPA. |

## C. Flashcards

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| C1 | Grid | Pass + N/A verified | Three-column grid at 1280 and 1440; long titles truncate consistently. Cards with no attempt and low score were captured. Base/excellence do not exist in the current store; their filters and classes are covered by the attempts selector. |
| C2 | Filters and random pick | Finding resolved | “Pick one at random” marked a single card and scrolled the grid. The gold-extras filter showed V-04; “Show all” recovers the grid. |
| C3 | Detail | Finding resolved | Front, back, model/duration metadata, navigation, and close were tested. V-02 makes the close visible. |
| C4 | Handoff to lesson | Pass | “Study card” from the modal navigated to `/react/card/js_basics` and closed the flashcard. |

## D. Card: reading and navigation

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| D1 | Entry / exit | Pass | Node → card route; close → `/react`; back restores the map. The card uses the full viewport with no document scroll. |
| D2 | Header | Pass + N/A verified | Pending and score 0 were captured. The header shares tone and structure with the mastery/extra states defined in `getScoreView`; no artificial evaluation was created. |
| D3 | Tabs | Finding resolved | Lectura, Coaching, and Evaluar were tested after scrolling; V-06 guarantees each surface starts at the top on every change. |
| D4 | Long reading | Pass | Screenshot of a real card with summary, chunked explanation, labels, and per-section TTS actions. Code/diagrams follow the same content renderer; no horizontal cut was detected. |
| D5 | TTS | N/A verified | Idle, replay, previous/next, and speed controls are accessible in the header/sections. Literal playback requires a browser voice available on the device, so audio was not forced during the visual audit. |
| D6 | Tooltips / chunks | Pass | Chunk hover activated global focus: chunk text in white and surroundings dimmed, without hiding code. The effect is restricted to the view's content. |
| D7 | Scroll / responsive | Pass | Desktop keeps `body` overflow hidden and the card uses its own scroller. Mobile shows no excess width or double global bar. |

## E. Coaching

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| E1 | Empty | Pass | Card without a draft: clear instruction, no skeleton, no automatic request. |
| E2 | Editor | Pass | Editor expanded without an interior scrollbar; 48 characters and the counter were shown without moving the card's scroll. |
| E3 | Debounce | Pass | After typing, PAUSA, ring, `5s`, `Ctrl/Cmd + ↵` and `Esc` were shown. Esc canceled the wait without closing the card. |
| E4 | Streaming | N/A verified | The SSE parser and the connecting/processing/scoring/coverage/hint states were reviewed against `liveReviewStream` and `LiveRequestFeedback`. No provider request was fired just to produce tokens during the audit. |
| E5 | Result | N/A verified | The 0–120 scales, coverage, and golden extra share `buildLiveReviewState`/`getScoreView`. There was no persisted live review to mount this state without altering the session. |
| E6 | Error | Finding resolved | V-05: network/5xx messages translate into actionable recovery and the field is not cleared. |
| E7 | History / chat | N/A verified | The store keeps immutable iterations per hash and the component leaves only the current one editable; there was no coaching history in the audited store for a faithful screenshot. |

## F. Full evaluation

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| F1 | Empty / draft | Pass | A card without evaluation and a short draft were captured; the existing draft showed count and evaluation CTA. |
| F2 | Streaming | N/A verified | Skeleton, SSE sections, and cancellation are wired to the same client as coaching. No billable test evaluations were started. |
| F3 | Result | Pass + N/A verified | Screenshot of a real `0/120` result, canonical score, threshold 100, and excellence lane up to 120. The 100 and >100 states do not exist locally; calculation and classes were reviewed. |
| F4 | Rubrics | Pass | Expanding Accuracy showed detail without increasing the height of the neighboring column's rubric. |
| F5 | History | Pass + N/A verified | Real progress line, attempt, date, model `deepseek/deepseek-v4-flash`, and duration `38.0 s` visible. There were no multiple/stale attempts to navigate without fabricating data. |
| F6 | Error / retry | Finding resolved | V-05 covers recoverable copy and draft preservation. Aborts are treated as cancellation, not as an error. |

## G. Provider settings and cross-cutting accessibility

| ID | Surface / state | Status | Evidence / result |
| --- | --- | --- | --- |
| G1 | Catalog | Pass + N/A verified | The Models.dev catalog loaded 180 providers; the MiniMax search filtered down to 4 and reported protocols/adapters. The loading/error/fallback UI is covered by the catalog state, without inducing a network failure. |
| G2 | Form | Pass + N/A verified | Endpoint compatible, MiniMax directo, and the desktop-only local-models notice were reviewed. OpenRouter/custom reuse the same endpoint/model form. |
| G3 | Model test | N/A verified | With no key in memory the button stays disabled, avoiding invalid requests. Gateway results map to test and error states; no credentials were exposed. |
| G4 | Persistence | Pass | `test:logic` covers the v3 migration, multiple connections, and active selection. The UI explicitly states that the key only lives in the tab. |
| G5 | Keyboard | Pass | A DOM snapshot confirmed accessible names; Escape cancels the debounce and does not close the card during that priority. Dialogs, navigation, and controls use explicit labels. |
| G6 | Motion | Pass | `prefers-reduced-motion` disables smooth scroll inside map/card; states do not depend on animation to communicate the result. |
| G7 | Typography / contrast | Pass | CSS scan: no `font-size` below 10 px; only 9 operational tokens sit between 10–10.5 px and reading text uses 11 px or more. Screenshots confirmed contrast of copy, controls, and errors. |

## UI detector result

Impeccable's detector ran over the modified targets. It reported no errors. Its warnings were explicitly reviewed:

- `bounce-easing` is a false positive: `debounce-shortcut-confirm` uses `cubic-bezier(.16, 1, .3, 1)`, a soft deceleration, not a bounce animation.
- `layout-transition` is also a false positive: it corresponds to an SVG's `stroke-width`, not to a layout `width`, `height`, `margin`, or `padding`.
- The three `Inter` warnings belong to the UI typography already adopted by the product; replacing it would require incorporating and licensing a new family for the whole system, not an isolated change from this audit.
- The color, radii, and size notices outside `DESIGN.md` reflect the extensive palette/scale already present in the product. They are not regressions introduced in this pass; they remain as a future token consolidation, separate from the functional visual QA, to avoid risking approved contrast or hierarchy.

## Closing

The checklist is closed: no `Pending` entries or findings remain without a second verification. The `N/A verified` entries are not functional debt: they document states that require a real evaluation, history, or credentials, and that were not fabricated in order to preserve the user's data and budget.
