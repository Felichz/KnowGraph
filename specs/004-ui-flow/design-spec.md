# 004 — Study flow and shared progress language

Status: implemented (2026-10-06). Governing: DESIGN.md v3.2. No new tokens.

## 1. One answer to "what do I do now?" — *Continue*
Replaces the map's Now/Next/Later route (`src/ui/map/SuggestedRoute.jsx`, desktop and mobile).
- **Pick up where you left off**: most recent card with a draft or attempt that is not mastered (`resumeTarget`, `src/logic/studyQueue.js`), with its state ("draft changed since the last evaluation", "needs work to reach 100", "opened, nothing written") and score; *Resume* opens it in the right stage.
- **Best next** (`guidance.primary`) with *why now*. If it is the same card as the resume target, one tile shows both.
- **Review**: count of worked cards below 100 → Flashcards.
- Guidance levels use one vocabulary everywhere: *Best next* / *Next* / *Later* (cards, graph). "Level 2/3" is gone.

## 2. Prerequisites are information, not warnings
Concept cards: `Lock` + "Needs n" in `--text-3` (was `--warn` triangle). Graph panel and missing-chain edges: neutral (`--text-3` / `--text-1`). Orange stays reserved for real warnings.

## 3. Study session as a stepper
Tabs keep `role="tab"` and are joined by chevrons. Paraphrase shows *Draft*; Evaluate shows the score (`72/120`, sage with ✓ at 100+) instead of an attempt count. Evaluate's empty state includes the scale.

## 4. First use explains the 0–120 scale
`HowItWorks` (map, only when there is no activity; dismissible, `learning-workspace:intro-dismissed`): read → explain → evaluate + `ScaleExplainer` (0–99 in progress, 100 mastered = goal, 101–120 extra, optional). `ScaleExplainer` is reused in Evaluate.

## 5. One progress language
`scoreTier(p)`: `none | progress | mastered | extra`. **Mastered and extra are both sage** (100+ is mastered); extra only adds ★ and the gold 100→120 stretch of the rail. Applied to concept cards/rows (`tier-*`), flashcards, the graph and the study badge. Progress bars fill with `--mastery` (they count mastered cards).

## 6. Flashcards
- Grid card = button with category, `TierBadge` (✓/★ sage pill for 100+, neutral score, outline "Not scored"), title. Mastered cards get the sage tint and border, so 100+ is visible at a glance.
- Clicking opens `FlashcardModal`: question (title + prompt), *Show answer* (Space), key idea (summary + takeaway) and the **full** saved explanation in a scrolling body; fixed header (category, `n / total`, previous/next, close) and footer (*Improve explanation* / *Study*). ←/→ move within the current filter.
- *Practice* deals cards in review order (`reviewOrder`): worked and weakest first, then mastered, then untouched.
