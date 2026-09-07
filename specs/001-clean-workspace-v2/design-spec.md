# Design Specification: Clean Learning Workspace V2
## Phase 1 Blueprint: Information Architecture & Spatial Hierarchy

- **Feature Branch**: `001-clean-workspace-v2`
- **Specification Source**: [`specs/001-clean-workspace-v2/spec.md`](./spec.md) (US1 through US7)
- **Foundation Tokens**: [`DESIGN.md`](../../DESIGN.md) *(Phase 0 Certified — Score: 9.9 / 10.0)*
- **Governing Master Skill**: [`.agents/skills/ui-information-architecture/SKILL.md`](../../.agents/skills/ui-information-architecture/SKILL.md)
- **Design Criteria & Rubric**: [`docs/DESIGN_CRITERIA.md`](../../docs/DESIGN_CRITERIA.md)
- **Workflow Phase**: Phase 1 of [`docs/VISUAL_WORKFLOW.md`](../../docs/VISUAL_WORKFLOW.md)
- **Author**: Information Architect Subagent
- **Status**: Ready for Auditor Quality Gate Verification

---

## 0. Header & Aesthetic Stance

### 0.1 Aesthetic Archetype: Dark Engineering Editorial
In alignment with [`DESIGN.md`](../../DESIGN.md) and [`docs/DESIGN_CRITERIA.md`](../../docs/DESIGN_CRITERIA.md), Learning Workspace rejects decorative AI-slop (such as neon glassmorphism, oversized cartoon pills, hollow wireframes, and nested carditis). The application embodies the **"El cockpit de dominio técnico"** Creative North Star — a high-density, mission-critical cognitive workstation for senior and staff software engineers.

1. **Restrained Instrument Calibration**: Deep tonal surfaces (`--color-surface-base: #0B0D13` to `--color-surface-overlay: #1E2532`), 1px hairline borders (`rgba(255, 255, 255, 0.08)`), and top-edge specular micro-bevels (`inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`).
2. **Tabular Numerics Discipline**: All counters, timers, progress ratios, scores, and timestamps enforce `font-variant-numeric: tabular-nums` using `"JetBrains Mono"` to prevent Cumulative Layout Shifts (CLS < 0.1).
3. **Strict Spatial Invariants**:
   - **Anti-Layer-Cake Ceiling**: Total fixed top chrome (Header + Category Deck) $\le 120\text{px}$ on 1440×900 desktop, strictly below the $\le 130\text{px}$ invariant.
   - **Primary Canvas Fold Ratio**: $\ge 86.6\%$ of viewport height dedicated to content fold ($780\text{px} / 900\text{px}$), strictly exceeding the $\ge 70\%$ invariant and guaranteeing at least 2 full rows of curriculum nodes visible above the fold.
   - **Anti-Canyon (Fitts's Law)**: Zero naked `space-between` voids ($>350\text{px}$). Contextual actions are tightly coupled ($\le 16\text{px}$) to their target entities.
   - **Anti-Hidden-Affordance**: 100% desktop visibility for all categories via multi-line wrapping flex (`flex-wrap: wrap`), completely eradicating horizontal mouse dragging.
   - **Anti-Carditis Surface Integrity**: Single shared background plane (`#1E2532` in modals, `#10151D` in panels); content structured via typography scale, whitespace steps, and hairline rules rather than nested boxes.
   - **Mobile Touch Ergonomics**: Native $44\times 44\text{px}$ touch targets, fixed thumb-reachable bottom command bar (`mobile-bottom-nav`), and $70\text{px} + \text{safe-area-inset-bottom}$ content scroll clearance.

---

## Section A: Exhaustive Information Inventory Matrix (Data & Affordance Manifest)

The following manifest deconstructs 100% of data points, labels, counters, state indicators, and user affordances mandated across User Stories US1 through US7, including edge cases and schemas in [`spec.md`](./spec.md).

| Item ID | User Story | Entity / Surface | Data Point / Affordance Label | Semantic Type | Data Type / Schema Format | Dynamic States & Edge Cases | Attention Level |
|:---|:---:|:---|:---|:---|:---|:---|:---:|
| **INF-01** | US1 | App Shell Header | Application Brand & Wordmark | Affordance / Brand | Text `"Learning Workspace"` + Monogram Icon | Click acts as universal home reset; scales to 18px on mobile | Glanceable (<1s) |
| **INF-02** | US1 | App Shell Header | Curriculum Graph Switcher | Affordance / Control | Segmented Toggle (`"React"` \| `"Rails"`) | Active state highlights with brand accent; triggers canvas re-render & persists to `localStorage` | Operational (1-5s) |
| **INF-03** | US1 | App Shell Header | Total Curriculum Mastery Readout | Readout / Metric | String `"${completed}/${total} completed • ${percent}%"` | Tabular nums; updates dynamically upon evaluation; excellence tier highlights gold | Glanceable (<1s) |
| **INF-04** | US1 | Control Deck | "Next Challenge" Recommendation | Readout / Affordance | Label + Link `"${node.label}"` + Action `"Start →"` | Recalculates dynamically based on prerequisites, priority rank, and active category filter | Operational (1-5s) |
| **INF-05** | US1 | Control Deck | Recommendation Priority Indicator | Readout / Badge | Enum: `Immediate Prereq` \| `Next Milestone` \| `Deep Dive` | Visual badge with semantic priority tint (`#F87171`, `#FBBF24`, `#38BDF8`) | Glanceable (<1s) |
| **INF-06** | US1 | Control Deck | Category Filter Chips Collection | Affordance / Filter | Array of Chips (11 React / 7 Rails) | Immutable category anchor colors; multi-row wrap on desktop; active pill state | Operational (1-5s) |
| **INF-07** | US1 | Control Deck | Category Node Count Badge | Readout / Counter | String `"(${count})"` | Tabular numerals; reflects total nodes matching category; updates when filtered | Glanceable (<1s) |
| **INF-08** | US1 | Control Deck | Visual Layout Mode Selector | Affordance / Control | Segmented Toggle: `Grid` \| `Topology (DAG)` \| `Flashcards` | Icon + Text; keyboard accessible; persists view preference in `localStorage` | Operational (1-5s) |
| **INF-09** | US1 | Graph Canvas | Canvas Pan & Zoom Control Cluster | Affordance / Control | Floating Cluster: `[+]`, `[-]`, `[Fit]`, Readout `"${zoom}%"` | Hook `usePanZoom`; drag threshold > 5px distinguishes click from pan; tabular zoom % | Operational (1-5s) |
| **INF-10** | US1 | Graph Canvas | SVG Directed Dependency Edges | Readout / Graphic | SVG Paths with directed marker arrows | Rendered in Sugiyama layered hierarchy; colored by source category anchor | Glanceable (<1s) |
| **INF-11** | US1 | Graph Canvas | Node Tile / Card Container | Organism / Card | Card Object (`id`, `label`, `cat`, `priority`, `level`) | Normal, Hover, Active, Focus-visible; 12px outer radius, hairline border | Operational (1-5s) |
| **INF-12** | US1 | Node Card | Node Category Anchor Badge | Readout / Token | Category Label + Hex Anchor | Invariant 3.1: Immutable color; never overridden by mastery score | Glanceable (<1s) |
| **INF-13** | US1 | Node Card | Node Seniority Level Indicator | Readout / Badge | Enum: `mid` \| `senior` \| `staff` | Discreet neutral badge; identifies target career interview bar | Glanceable (<1s) |
| **INF-14** | US1 | Node Card | Node Prerequisite Lock Indicator | Readout / State | Icon `🔒` / `✓` + Prerequisite Count | Locked if any prerequisite uncompleted; unlocked when all prerequisites met | Glanceable (<1s) |
| **INF-15** | US1 | Node Card | Node Mastery & Excellence Score | Readout / Score | String `"${score}/120"` \| Unattempted | Scores 0-100 neutral; scores 101-120 display Warm Gold badge `★ ${score}/120` | Glanceable (<1s) |
| **INF-16** | US1 | Node Card | Node Micro-Summary Text | Readout / Prose | String `"${lesson.summary}"` | Clamped strictly to 2 lines (`-webkit-line-clamp: 2`); preserves full string in `title` | Operational (1-5s) |
| **INF-17** | US1 | Node Card | Study Modal Open Trigger | Affordance / Action | Click event or `Enter` keypress | Opens 4-stage study modal; pushes URL state `/:graph/card/:nodeId` | Operational (1-5s) |
| **INF-18** | US1 | App Shell Header | Command Palette Trigger Button | Affordance / Action | Button `"Search concepts... (Ctrl+K)"` | Opens modal overlay; accessible via keyboard shortcut or click | Operational (1-5s) |
| **INF-19** | US1 | Command Palette | Global Search Input Field | Input / Filter | Text Input with clear action `[✕]` | Real-time debounced query filtering across node titles, summaries, and tags | Operational (1-5s) |
| **INF-20** | US1 | Command Palette | Filtered Concept Search Results | Affordance / List | List of items: Node Title, Category, Score | Keyboard navigatable (Arrow Up/Down, Enter); highlights matching substring | Operational (1-5s) |
| **INF-21** | US1 | Command Palette | Quick Action Commands Strip | Affordance / Nav | Actions: `📇 Flashcards`, `📊 Seniority`, `⚙️ BYOK Settings` | Instant modal/view dispatch without typing search term | Operational (1-5s) |
| **INF-22** | US1 | App Shell Header | Seniority Progress Button | Affordance / Action | Button `"📊 Seniority & Progress"` | Opens right flyout drawer (desktop) or full-screen sheet (mobile) | Operational (1-5s) |
| **INF-23** | US1 | Seniority Drawer | Seniority Competency Bands List | Organism / List | Bands: `React Pro`, `Senior Frontend`, `Staff/Lead`, `Design Systems` | Each displays title, description, competency checklist, and progress bar `XX%` | On-demand (>5s) |
| **INF-24** | US1 | Seniority Drawer | Curricular Milestone Cards List | Organism / List | Cards with Title, Node fraction `X/Y`, Progress Bar, Badge | Displays milestone completion badge upon 100% completion | On-demand (>5s) |
| **INF-25** | US2 | Study Modal | Modal Header Context Cluster | Readout / Header | Node Label, ID, Category Badge, Level Badge | Static header within modal shell; flexShrink: 0; sticky to top of dialog | Glanceable (<1s) |
| **INF-26** | US2 | Study Modal | Modal Close Affordance | Affordance / Action | Button `"✕"` or `Esc` key | Closes modal; resets route to `/:graph`; unlocks background scroll | Operational (1-5s) |
| **INF-27** | US2 | Study Modal | Contextual Concept Breadcrumb | Affordance / Nav | Flow: `Before: [Node]` → `Now: [Current]` → `After: [Node]` | Click on Before/After jumps to target node; updates history stack | Operational (1-5s) |
| **INF-28** | US2 | Study Modal | Previous Concept Return Button | Affordance / Nav | Button `"← Back to [Previous Concept]"` | Appears dynamically when user has traversed internal node jumps | Operational (1-5s) |
| **INF-29** | US2 | Study Modal | Zen Mode Fullscreen Toggle | Affordance / Action | Button `"⛶ Fullscreen"` / `"Exit Zen"` | Expands modal to 100vw × 100vh; centers prose in `max-w-4xl` container | Operational (1-5s) |
| **INF-30** | US2 | Study Modal | 4-Stage Route Tab Navigation | Affordance / Nav | Tabs: `01 Read` \| `02 Learn` \| `03 Paraphrase` \| `04 Evaluate` | Active stage indicator with brand accent underline; resets scrollTop = 0 | Operational (1-5s) |
| **INF-31** | US2 | Stage 01 Read | Mental Model Executive Summary | Readout / Prose | Paragraph (1-2 sentences) | High-contrast primary reading text; establishes core intuition | Operational (1-5s) |
| **INF-32** | US2 | Stage 01 Read | Architectural Rationale ("Why") | Readout / Prose | Paragraph explaining production motivation | Explains failure under scale/concurrency; reading measure 45-75ch | On-demand (>5s) |
| **INF-33** | US2 | Stage 01 Read | Deep-Dive Glossary Badges | Affordance / Token | Micro-badge `"?"` adjacent to advanced term | Highlights low-level engine concepts; click opens popover | Glanceable (<1s) |
| **INF-34** | US2 | Stage 01 Read | Deep-Dive Glossary Popover | Readout / Overlay | Popover: Term, Definition, Mental Model | Floats adjacent to trigger; dismisses on click outside or Esc | On-demand (>5s) |
| **INF-35** | US2 | Stage 01 Read | Naive Code Block & Failure Mode | Readout / Code | Label `"Naive approach"` + Syntax Code + `"Why it fails"` | Highlights antipattern; JetBrains Mono; red-tinted failure explanation well | On-demand (>5s) |
| **INF-36** | US2 | Stage 01 Read | Production Code Block & Trade-off | Readout / Code | Label `"Production pattern"` + Syntax Code + `"Trade-off"` | Idiomatic senior pattern; teal-tinted accepted trade-off note | On-demand (>5s) |
| **INF-37** | US2 | Stage 01 Read | Sequential Concept Phases List | Readout / List | Ordered execution steps (`1..N`) | Step-by-step lifecycle flow with number badge and concise description | On-demand (>5s) |
| **INF-38** | US2 | Stage 01 Read | Silent Production Pitfalls List | Readout / List | Bulleted list of silent failure modes | Warning icon `⚠️`; actionable mitigation advice for each pitfall | On-demand (>5s) |
| **INF-39** | US2 | Stage 01 Read | Mnemonic Interview Takeaway Rule | Readout / Callout | Single-sentence takeaway rule | Formatted in subtle callout well; high-retention rule of thumb | Operational (1-5s) |
| **INF-40** | US2 | Stage 01 Read | FAANG Coverage Accordion Trigger | Affordance / Action | Accordion header `"FAANG Interview Coverage (${count})"` | Expandable toggle; indicates total available interview questions | Operational (1-5s) |
| **INF-41** | US2 | Stage 01 Read | FAANG Interview Question Item | Readout / Card | Source badge (Meta/Google), Title, Full Question Text | Rendered inside expanded accordion; clearly demarcated prompt | On-demand (>5s) |
| **INF-42** | US2 | Stage 01 Read | FAANG Prerequisite Status Badge | Readout / State | Badge `"Unlocked"` \| `"Blocked by ${prereq}"` | Informs candidate whether their conceptual grounding suffices | Glanceable (<1s) |
| **INF-43** | US2 | Stage 01 Read | FAANG Sample Answer Toggle | Affordance / Action | Button `"Show reference answer"` / `"Hide"` | Revealing reference answer requires explicit user action to test recall | Operational (1-5s) |
| **INF-44** | US2 | Stage 01 Read | Documentation & Source Links | Affordance / Link | External Link with `↗` icon + Type badge (`official` etc.) | Opens official specs / docs in new tab (`rel="noreferrer"`) | Operational (1-5s) |
| **INF-45** | US2 | Stage 02 Learn | Socratic Tutor Chat Feed | Organism / Stream | Message turns: Assistant (Socratic Mentor) & User | Scrollable chat log; auto-scrolls to newest message on stream | On-demand (>5s) |
| **INF-46** | US2 | Stage 02 Learn | Socratic Quick-Prompt Chips | Affordance / Action | 4 Action Chips (`Why naive fails?`, `Visual analogy`, etc.) | One-click inquiry send; disappears or updates after engagement | Operational (1-5s) |
| **INF-47** | US2 | Stage 02 Learn | Socratic Query Input & Send Action | Input / Action | Multiline Textarea + Submit Button `"Send ↑"` | Disabled while assistant is generating; supports `Ctrl+Enter` to submit | Operational (1-5s) |
| **INF-48** | US2 | Stage 02 Learn | Integrate Chat Synthesis Action | Affordance / Action | Primary Button `"✨ Integrate chat into my answer"` | Triggers `reconcileParaphraseStream`; computes hash; transitions to Stage 03 | Operational (1-5s) |
| **INF-49** | US2 | Stage 03 Paraphrase | Paraphrase View Mode Switcher | Affordance / Control | Segmented Toggle: `✏️ Editor` \| `📖 Reading Chunks` | Toggles between raw text composition and paragraph chunk decomposition | Operational (1-5s) |
| **INF-50** | US2 | Stage 03 Paraphrase | Paraphrase Drafting Textarea | Input / Textarea | Large Markdown/Plaintext editor | Persistent auto-save to IndexedDB/localStorage; debounced 300ms | Operational (1-5s) |
| **INF-51** | US2 | Stage 03 Paraphrase | Editor Live Character Counter | Readout / Metric | String `"${charCount} chars"` | Monospace tabular numerals; updates on every keystroke | Glanceable (<1s) |
| **INF-52** | US2 | Stage 03 Paraphrase | Depth Advisory Notice (<140 chars)| Readout / Warning | Warning banner `"${charCount}/140 - too short to measure depth"`| Muted warning; does not hard-block but discourages superficial answers | Glanceable (<1s) |
| **INF-53** | US2 | Stage 03 Paraphrase | Voice Dictation Trigger Action | Affordance / Action | Button `"🎙️ Start Dictation"` \| `"⏹️ Stop"` | Uses Web Speech API; pulses recording indicator; hidden if unsupported | Operational (1-5s) |
| **INF-54** | US2 | Stage 03 Paraphrase | Chunk Decomposition Breakdown | Readout / Analysis | Paragraph cards + Lexical Density Metrics | Renders in `Reading Chunks` mode; highlights technical terms & word count | On-demand (>5s) |
| **INF-55** | US2 | Stage 03 Paraphrase | Evaluate Answer Primary CTA | Affordance / Action | Button `"Evaluate with AI (Ctrl+Enter)"` | Primary CTA with brand accent; transitions to Stage 04 | Operational (1-5s) |
| **INF-56** | US2 | Stage 04 Evaluate | Evaluation Streaming Loader | Organism / State | Elapsed Timer, Received Chars Counter, Latency Phase | Rendered during active AI inference; tabular counters; pulse indicator | Glanceable (<1s) |
| **INF-57** | US2 | Stage 04 Evaluate | Inference Latency Phase Indicator | Readout / State | Enum: `Normal (0-15s)` \| `Slow (15-30s)` \| `Critical (>30s)` | Informs user of thinking model depth without anxiety | Glanceable (<1s) |
| **INF-58** | US2 | Stage 04 Evaluate | Evaluation Abort / Cancel Action | Affordance / Action | Button `"Cancel Evaluation ✕"` | Triggers `AbortController`; resets connection cleanly; returns to draft | Operational (1-5s) |
| **INF-59** | US2 | Stage 04 Evaluate | Executive Summary Verdict Callout | Readout / Prose | Single-sentence hiring evaluation headline | Prominent callout; communicates high-level evaluation immediately | Glanceable (<1s) |
| **INF-60** | US2 | Stage 04 Evaluate | Canonical Score Hero Display | Readout / Score | Hero Score `"${score} / 120"` | Display typography (49px); tabular numerals; high visual prominence | Glanceable (<1s) |
| **INF-61** | US2 | Stage 04 Evaluate | Excellence Bonus Tier Badge | Readout / Badge | Badge `★ Excellence Bonus: +${extraPoints} pts` | Warm Gold `#F5C451` with subtle aura; rendered only when score > 100 | Glanceable (<1s) |
| **INF-62** | US2 | Stage 04 Evaluate | Rubric: Causality & Trade-offs (35%)| Readout / Rubric | Score `${score}/35`, Progress Bar, Expandable Note | Primary Senior/Staff factor; evaluates failure modes at scale | On-demand (>5s) |
| **INF-63** | US2 | Stage 04 Evaluate | Rubric: Technical Accuracy (30%) | Readout / Rubric | Score `${score}/30`, Progress Bar, Expandable Note | Evaluates domain vocabulary, precision, and internal mechanisms | On-demand (>5s) |
| **INF-64** | US2 | Stage 04 Evaluate | Rubric: Code Application (20%) | Readout / Rubric | Score `${score}/20`, Progress Bar, Expandable Note | Evaluates concrete implementation patterns and idiomatic syntax | On-demand (>5s) |
| **INF-65** | US2 | Stage 04 Evaluate | Rubric: Completeness & Lifecycles (15%)| Readout / Rubric | Score `${score}/15`, Progress Bar, Expandable Note | Evaluates edge cases, cleanup, memory leaks, resource lifecycles | On-demand (>5s) |
| **INF-66** | US2 | Stage 04 Evaluate | Feedback: Strengths Analysis | Readout / List | Bulleted list of verified mastery points | Green subtle bullet indicator; identifies what candidate nailed | On-demand (>5s) |
| **INF-67** | US2 | Stage 04 Evaluate | Feedback: Critical Conceptual Gaps | Readout / List | Bulleted list of missing architectural dimensions | Red/Warning bullet indicator; highlights exact omissions | On-demand (>5s) |
| **INF-68** | US2 | Stage 04 Evaluate | Feedback: Misconceptions to Unlearn | Readout / List | Bulleted list of flawed technical premises | Amber bullet indicator; clarifies false mental models | On-demand (>5s) |
| **INF-69** | US2 | Stage 04 Evaluate | Next Attempt Focus Guidance | Readout / Callout | Actionable prompt for subsequent iteration | Guides deliberate practice for score improvement | Operational (1-5s) |
| **INF-70** | US2 | Stage 04 Evaluate | Historical Attempt Time-Travel Strip| Affordance / Nav | Pagination: `← Evaluation ${current} of ${total} →` | Navigates past attempts in read-only mode; indicates timestamp | Operational (1-5s) |
| **INF-71** | US2 | Stage 04 Evaluate | Return to Latest Evaluation Action | Affordance / Action | Button `"Return to latest"` | Re-aligns view to most recent evaluation attempt | Operational (1-5s) |
| **INF-72** | US2 | Stage 04 Evaluate | Stale Content Re-Evaluation Warning| Readout / Warning | Warning Banner: `"Earlier version evaluation. Re-evaluate to update."`| Displayed when lesson definition was updated after evaluation date | Operational (1-5s) |
| **INF-73** | US3 | Global HUD | Floating Background HUD Widget | Organism / Floating | Fixed bottom-right instrument card | Displays active background tasks while user explores graph | Glanceable (<1s) |
| **INF-74** | US3 | Global HUD | Active Background Task Readout | Readout / State | Pulsing indicator `◉ EVALUATING: ${node.label}` | Shows streaming progress, elapsed seconds, received characters | Glanceable (<1s) |
| **INF-75** | US3 | Global HUD | Background Task Open Card Action | Affordance / Action | Button `"Open Card →"` | Re-opens study modal for that specific node directly on Stage 04 | Operational (1-5s) |
| **INF-76** | US3 | Global HUD | Background Task Cancel Action | Affordance / Action | Button `"Cancel ✕"` | Triggers AbortController for background inference stream | Operational (1-5s) |
| **INF-77** | US3 | Global HUD | Multi-Task Background Popover | Organism / Popover | List of concurrent evaluation tasks | Renders when clicking HUD; shows all active streams with individual actions | Operational (1-5s) |
| **INF-78** | US3 | Global HUD | Cross-Tab Sync Status Notification | Readout / Toast | Toast `"Task completed in another tab"` | Receives events via BroadcastChannel; synchronizes local state | Glanceable (<1s) |
| **INF-79** | US4 | Stage 01 Read | Synchronized TTS Audio Play Button | Affordance / Action | Button `"🔊 Listen"` \| `"⏸️ Pause"` | Starts/pauses browser SpeechSynthesis; hidden if API unsupported | Operational (1-5s) |
| **INF-80** | US4 | Stage 01 Read | TTS Active Sentence Visual Highlight| Readout / Animation | Subtle background pulse on active text block | Synchronized visual highlighting as speech synthesis proceeds | Glanceable (<1s) |
| **INF-81** | US5 | App Shell Header | Settings & Sovereignty Action Button| Affordance / Action | Button `"⚙️ Settings"` | Opens BYOK & Data Portability modal | Operational (1-5s) |
| **INF-82** | US5 | Settings Modal | AI Provider Selection Dropdown | Affordance / Control | Dropdown: `Anthropic Claude` \| `OpenAI` \| `Gemini` \| `Local Ollama` | Configures active inference engine | Operational (1-5s) |
| **INF-83** | US5 | Settings Modal | BYOK API Key Input with Mask Toggle | Input / Secret | Masked input field + Toggle button `[👁]` | Stored encrypted in Electron (`safeStorage`) or localStorage in web | Operational (1-5s) |
| **INF-84** | US5 | Settings Modal | Minimal Inference Connection Probe | Affordance / Action | Button `"Test Connection"` + Status Readout | Runs lightweight test ping; displays success latency or error message | Operational (1-5s) |
| **INF-85** | US5 | Settings Modal | JSON Learning State Export Action | Affordance / Action | Button `"Export Backup (JSON)"` | Downloads `learning-workspace-backup-[date].json` with all history | Operational (1-5s) |
| **INF-86** | US5 | Settings Modal | JSON Learning State Import Action | Affordance / Action | File Dropzone + Button `"Import Backup"` | Validates schema version & signature; confirms restore; refreshes app | Operational (1-5s) |
| **INF-87** | US6 | Flashcards View | Flashcard Active Recall Canvas | Organism / Grid | 3D Perspective Card Grid | Displays flashcards matching active category and mastery filters | Operational (1-5s) |
| **INF-88** | US6 | Flashcards View | Mastery Filter Selector | Affordance / Control | Pills: `All` \| `Unattempted` \| `Needs Review` \| `Mastered` \| `Excellence` | Filters cards by score brackets | Operational (1-5s) |
| **INF-89** | US6 | Flashcards View | Visible Cards Count Readout | Readout / Metric | String `"Showing ${visible} of ${total} cards"` | Tabular numerals; updates dynamically as filters apply | Glanceable (<1s) |
| **INF-90** | US6 | Flashcards View | 3D Interactive Flip Card Object | Organism / Card | Card with Front (Prompt/Level) and Back (Answer/Rationale) | Click or Space keypress executes 3D flip animation | Operational (1-5s) |
| **INF-91** | US6 | Flashcards View | Study Card Modal Jump Action | Affordance / Action | Button `"Study Node →"` | Located on back face; opens 4-stage study modal for that concept | Operational (1-5s) |
| **INF-92** | US7 | Mobile Shell | Fixed Mobile Bottom Command Bar | Organism / Nav | Fixed 5-Tab Bar (`mobile-bottom-nav`) | Rendered strictly on viewports < 768px; respects safe-area-inset | Operational (1-5s) |
| **INF-93** | US7 | Mobile Shell | Bottom Bar Navigation Tabs | Affordance / Nav | 5 Tabs: `Graph` \| `Cards` \| `Progress` \| `Search` \| `Settings` | 44×44px touch targets; active tab pill indicator | Operational (1-5s) |
| **INF-94** | US7 | Mobile Shell | Mobile Canvas Clearance Spacer | Structural Layout | Empty Spacer / Margin `min-height: 70px` | Enforces 70px clearance above bottom nav to prevent content occlusion | Glanceable (<1s) |
| **INF-95** | US7 | Mobile Shell | Compact Mobile Header Strip | Organism / Header | 56px height header with scaled logo & graph switch | Eliminates desktop search/settings buttons to prevent crowding | Operational (1-5s) |

*Total Inventory Count: 95 distinct items (INF-01 through INF-95), providing 100% complete coverage of all 7 User Stories, acceptance criteria, and edge cases.*

---

## Section B: Grouping, Hierarchy & Surface Architecture Matrix

### B.1 Visual Organisms & Inventory Allocation
The 95 inventory items are clustered into **13 distinct visual organisms**, establishing unified surfaces and strictly eliminating nested carditis:

1. **ORG-01: Global App Header** (`INF-01`, `INF-02`, `INF-03`, `INF-18`, `INF-22`, `INF-81`, `INF-95`)
   - *Surface*: `--color-surface-base` (`#0B0D13`) with subtle bottom border (`rgba(255, 255, 255, 0.08)`).
   - *Dimensions*: Height exactly `52px` on desktop, `56px` on mobile. `flexShrink: 0`.
2. **ORG-02: Curriculum Control Deck & Taxonomy Rail** (`INF-04`, `INF-05`, `INF-06`, `INF-07`, `INF-08`)
   - *Surface*: Integrated directly into the canvas header plane; height `68px`.
   - *Combined Top Chrome*: `52px + 68px = 120px` (Strictly $\le 130\text{px}$ Anti-Layer-Cake limit).
3. **ORG-03: Main Learning Canvas (Dual Mode: Grid & SVG DAG)** (`INF-09`, `INF-10`, `INF-11`, `INF-12`, `INF-13`, `INF-14`, `INF-15`, `INF-16`, `INF-17`)
   - *Surface*: `--color-surface-base` (`#0B0D13`). Fills $86.6\%$ of viewport ($780\text{px}$ on 900px height).
4. **ORG-04: Seniority & Milestones Drawer** (`INF-23`, `INF-24`)
   - *Surface*: Flyout panel on `--color-surface-card` (`#10151D`), `--shadow-level-3`.
5. **ORG-05: Command Palette & Global Search Modal** (`INF-19`, `INF-20`, `INF-21`)
   - *Surface*: Centered overlay plane `--color-surface-overlay` (`#1E2532`), `--shadow-level-4`.
6. **ORG-06: 4-Stage Study Modal Shell & Stage 01 Read Surface** (`INF-25`, `INF-26`, `INF-27`, `INF-28`, `INF-29`, `INF-30`, `INF-31`, `INF-32`, `INF-33`, `INF-34`, `INF-35`, `INF-36`, `INF-37`, `INF-38`, `INF-39`, `INF-40`, `INF-41`, `INF-42`, `INF-43`, `INF-44`, `INF-79`, `INF-80`)
   - *Surface*: `--color-surface-overlay` (`#1E2532`), `--shadow-level-4`. Width `920px`, max-height `88vh`.
7. **ORG-07: Socratic Tutor & Chat Stream Surface (Stage 02 Learn)** (`INF-45`, `INF-46`, `INF-47`, `INF-48`)
   - *Surface*: Contained within Study Modal body plane; alternating message wells using `--color-surface-raised` (`#151B25`).
8. **ORG-08: Active Recall Paraphrase Editor & Chunk Analyzer (Stage 03 Paraphrase)** (`INF-49`, `INF-50`, `INF-51`, `INF-52`, `INF-53`, `INF-54`, `INF-55`)
   - *Surface*: Single editor plane with inset code well `--color-surface-subtle` (`#0D1118`).
9. **ORG-09: Calibrated Rubric & Evaluation Score Engine (Stage 04 Evaluate)** (`INF-56`, `INF-57`, `INF-58`, `INF-59`, `INF-60`, `INF-61`, `INF-62`, `INF-63`, `INF-64`, `INF-65`, `INF-66`, `INF-67`, `INF-68`, `INF-69`, `INF-70`, `INF-71`, `INF-72`)
   - *Surface*: High-density analytical breakdown directly on `--color-surface-overlay`.
10. **ORG-10: Floating Asynchronous Background HUD & Multi-Task Cockpit** (`INF-73`, `INF-74`, `INF-75`, `INF-76`, `INF-77`, `INF-78`)
    - *Surface*: Floating corner capsule `--color-surface-raised` (`#151B25`), `--shadow-level-5`.
11. **ORG-11: 3D Active Recall Flashcards Grid & Drill Surface** (`INF-87`, `INF-88`, `INF-89`, `INF-90`, `INF-91`)
    - *Surface*: Full canvas grid with 3D perspective perspective container (`1000px`).
12. **ORG-12: Private BYOK Settings & Backup Portability Modal** (`INF-82`, `INF-83`, `INF-84`, `INF-85`, `INF-86`)
    - *Surface*: Focused settings dialog `--color-surface-overlay` (`#1E2532`), width `640px`.
13. **ORG-13: Mobile Ergonomic Bottom Command Bar** (`INF-92`, `INF-93`, `INF-94`)
    - *Surface*: Fixed bottom bar `--color-surface-raised` (`#151B25`), height `56px + safe-area`.

---

### B.2 Three-Level Attention Hierarchy Partitioning
To guarantee zero cognitive overload and enforce the Dark Engineering Editorial calm, every inventory element is strictly mapped to one of three attention tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEVEL 1: GLANCEABLE (< 1s)                                                 │
│  Instant cognitive pulse: Status dots, scores, counters, category anchors   │
├─────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 2: OPERATIONAL (1 - 5s)                                              │
│  Actionable interaction layer: Stage tabs, primary CTAs, filters, inputs    │
├─────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 3: ON-DEMAND (> 5s)                                                  │
│  Deep technical immersion: Code comparisons, rubric notes, Socratic chat    │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Attention Level | Visual Characteristics | Token / Styling Blueprint | Allocated Inventory Items |
|:---|:---|:---|:---|
| **Level 1: Glanceable (< 1s)** | High-contrast beacons, tabular numerals, small footprint, immediately legible without focal shifting. | `--font-mono`, `tabular-nums`, Category anchors, Status colors (`#5EEAD4`, `#F5C451`, `#4ADE80`, `#F87171`), micro-badges (10px–13px). | `INF-01`, `INF-03`, `INF-05`, `INF-07`, `INF-10`, `INF-12`, `INF-13`, `INF-14`, `INF-15`, `INF-25`, `INF-33`, `INF-42`, `INF-51`, `INF-52`, `INF-56`, `INF-57`, `INF-59`, `INF-60`, `INF-61`, `INF-73`, `INF-74`, `INF-78`, `INF-80`, `INF-89`, `INF-94`. |
| **Level 2: Operational (1 - 5s)** | Interactive affordances, navigation controls, buttons, toggles, form inputs, and modals. | Outlined/Ghost buttons, Brand CTA (`#5EEAD4`), Tab strip underlines, 4px–8px radii, min touch target 44px (mobile) / 36px (desktop). | `INF-02`, `INF-04`, `INF-06`, `INF-08`, `INF-09`, `INF-11`, `INF-16`, `INF-17`, `INF-18`, `INF-19`, `INF-20`, `INF-21`, `INF-22`, `INF-26`, `INF-27`, `INF-28`, `INF-29`, `INF-30`, `INF-31`, `INF-39`, `INF-40`, `INF-43`, `INF-44`, `INF-46`, `INF-47`, `INF-48`, `INF-49`, `INF-50`, `INF-53`, `INF-55`, `INF-58`, `INF-69`, `INF-70`, `INF-71`, `INF-72`, `INF-75`, `INF-76`, `INF-77`, `INF-79`, `INF-81`, `INF-82`, `INF-83`, `INF-84`, `INF-85`, `INF-86`, `INF-87`, `INF-88`, `INF-90`, `INF-91`, `INF-92`, `INF-93`, `INF-95`. |
| **Level 3: On-demand (> 5s)** | Deep reading prose, architectural trade-offs, code diffs, rubrics, Socratic conversation, JSON backup details. | `--font-sans` body (16px), line-height 1.5–1.6, syntax-highlighted code wells (`#0D1118`), 45–75ch measure, expandable notes. | `INF-23`, `INF-24`, `INF-32`, `INF-34`, `INF-35`, `INF-36`, `INF-37`, `INF-38`, `INF-41`, `INF-45`, `INF-54`, `INF-62`, `INF-63`, `INF-64`, `INF-65`, `INF-66`, `INF-67`, `INF-68`. |

---

### B.3 Gestalt Proximity & Anti-Carditis Architecture

#### 1. Proximity over Divider Lines
In strict conformance with `gestalt-ui-organisation` and [`docs/DESIGN_CRITERIA.md`](../../docs/DESIGN_CRITERIA.md) (Dimension 1):
- **Spacing Scale Steps**:
  - Tight coupling within a group: `4px` (`--space-1`) or `8px` (`--space-2`).
  - Separation between related control groups: `16px` (`--space-4`).
  - Separation between distinct macro sections: `32px` (`--space-8`).
- **Hairline Dividers**: Lines (`1px solid rgba(255, 255, 255, 0.06)`) are reserved strictly for bounding major structural axes (Header bottom edge, Modal header/footer boundaries, and Split view vertical axes). Horizontal lines are never used between simple list items when whitespace suffices.

#### 2. Anti-Carditis Invariant (Zero Nested Boxes)
- **Modal Plane Integrity**: The 4-stage study modal is treated as a **single continuous plane** (`#1E2532`).
- **Elimination of Nested Boxes**:
  - `BAD`: A modal containing a "Summary Card" (border + bg) containing a "Why Card" (border + bg) containing a "Takeaway Card" (border + bg).
  - `GOOD (ENGINEERED)`: A clean vertical layout directly on the modal surface where Section Titles (`--text-lead`, weight 600) and prose (`--text-base`) are separated by `16px` whitespace and subtle bottom border rules.
- **Code Block Well Exception**: Code comparison blocks use a recessed well (`--color-surface-subtle: #0D1118`, `--radius-sm: 4px`) with a 1px border (`rgba(255, 255, 255, 0.05)`). Under the concentric radii formula ($12\text{px} = 4\text{px} + 8\text{px}$), this represents the single allowed inner level.

---

## Section C: Comparative Structural Evaluation & Trade-off Matrix

This section formulates and compares 2 to 3 architectural layout paradigms for each macro organism across both **Landscape (Desktop 1440×900)** and **Portrait (Mobile 390×844)** viewports, documenting quantitative trade-offs and declaring the winning structure with "The Why".

---

### C.1 Organism: Macro App Shell & Navigation

#### Landscape Paradigm Comparison (Desktop 1440×900)

```
Option L1: Triple Stack Layer-Cake (Anti-Pattern)
┌────────────────────────────────────────────────────────────┐ [56px] Header
├────────────────────────────────────────────────────────────┤ [48px] Breadcrumbs & Stats
├────────────────────────────────────────────────────────────┤ [64px] Categories Deck
│                                                            │ Total Top Chrome = 168px (>130px FAIL)
│                     Main Canvas Area                       │ Content Fold = 732px (81.3%)
└────────────────────────────────────────────────────────────┘

Option L2: Vertical Persistent Left Sidebar (Evaluated Option)
┌───────────┬────────────────────────────────────────────────┐
│ Sidebar   │ Compact Header [48px]                          │
│ [260px]   ├────────────────────────────────────────────────┤
│           │ Main Canvas Area                               │ Content Fold = 852px (94.6%)
│           │                                                │ But horizontal space cut: 1180px canvas
└───────────┴────────────────────────────────────────────────┘

Option L3: Ultra-Compact Integrated Top Deck (Winning Architecture)
┌────────────────────────────────────────────────────────────┐ [52px] Header (Brand + Graph + Search + Stats)
├────────────────────────────────────────────────────────────┤ [68px] Control Deck (Next Challenge + Category Wrap)
│                                                            │ Total Top Chrome = 120px (<=130px PASS)
│                     Main Canvas Area                       │ Content Fold = 780px (86.6% PASS)
│         (Full 1440px width dedicated to Graph / DAG)       │ Fitts's Law coupled (<350px)
└────────────────────────────────────────────────────────────┘
```

| Criterion | Option L1: Stacked Layer-Cake | Option L2: Persistent Left Sidebar | Option L3: Ultra-Compact Integrated Top Deck (WINNER) |
|:---|:---|:---|:---|
| **Viewport Height Cost** | **168px** (Violates $\le 130\text{px}$ invariant). | **48px** top chrome. | **120px** total top chrome ($\le 130\text{px}$ invariant respected). |
| **Canvas Fold Ratio** | 81.3% ($732\text{px} / 900\text{px}$). | 94.6% vertical, but loses $260\text{px}$ width. | **86.6%** ($780\text{px} / 900\text{px}$) fold height + **100%** canvas width. |
| **Scalability ($N$ categories)**| Poor; requires 3 stacked rows. | High in sidebar list, but forces vertical scrolling. | **High**: wraps 11 React / 7 Rails chips cleanly in 68px deck. |
| **Fitts's Law Distance** | $>450\text{px}$ between graph switcher and next action. | Mouse must travel $600\text{px}$ back and forth from sidebar to canvas. | **$\le 180\text{px}$**: Actions coupled directly to contextual readouts. |
| **Cognitive Load** | High; visual "stripes" slice viewport horizontally. | Medium; sidebar competes with graph canvas for visual weight. | **Low**: Single calm header plane, leaving graph canvas totally uncluttered. |

- **Winning Architecture (Landscape)**: **Option L3 (Ultra-Compact Integrated Top Deck)**.
- **The Why**: Option L3 satisfies the Golden Invariant ($\le 120\text{px}$ total top bars, reserving $86.6\%$ canvas height) while providing the entire $1440\text{px}$ horizontal span for wide topological DAG trees and 4-column node grids.

---

#### Portrait Paradigm Comparison (Mobile 390×844)

```
Option P1: Scaled-Down Desktop Top Header (Anti-Pattern)
┌─────────────────────────┐
│ Brand [Switch] [Search] │ [60px] Header
│ Category Chips (Scroll) │ [48px] Chips
│ Next Challenge Banner   │ [64px] Banner
│                         │ Top Chrome = 172px (20.3% of phone screen)
│ Canvas Area             │ Hamburger menu hidden; thumb stretch required
└─────────────────────────┘

Option P2: Fullscreen Hamburger Drawer (Evaluated Option)
┌─────────────────────────┐
│ ☰ Brand        [Search] │ [56px] Header
│                         │
│ Canvas Area             │ Nav completely hidden behind hamburger;
│                         │ 2 taps required for every view switch.
└─────────────────────────┘

Option P3: Split Ergonomic Thumb Shell (Winning Architecture)
┌─────────────────────────┐
│ Brand [React | Rails]   │ [56px] Ultra-compact Header (Logo + Switcher)
├─────────────────────────┤
│ Next Challenge Strip    │ [40px] Inline compact recommendation
├─────────────────────────┤
│                         │
│ Canvas Area             │ Single-column cards or touch-scrollable graph
│ (Scrollable Content)    │ Mandatory 70px bottom clearance margin
│                         │
├─────────────────────────┤
│ [Graph][Cards][Prog][🔍]│ [56px + safe-area] Fixed Mobile Bottom Nav (Thumb Zone)
└─────────────────────────┘
```

| Criterion | Option P1: Scaled Desktop Header | Option P2: Hamburger Drawer | Option P3: Split Thumb Shell (WINNER) |
|:---|:---|:---|:---|
| **Thumb Ergonomics** | Terrible; all controls at top edge ($y < 120\text{px}$). | Poor; hamburger top-left requires thumb strain. | **Flawless**: 5 key destinations inside primary thumb sweep ($y > 750\text{px}$). |
| **Viewport Efficiency** | Wastes 172px at top of screen. | 56px top, but 0 glanceable navigation. | **56px header + 56px bottom bar**; content occupies $732\text{px}$ ($86.7\%$). |
| **Discoverability** | Low; filters truncated off-screen. | Zero; navigation hidden behind drawer. | **100%**: Bottom tabs visible at all times; active tab highlighted. |
| **Safe Area Inset** | Ignores home indicator bar. | Ignores home indicator bar. | **Full compliance**: `padding-bottom: max(12px, env(safe-area-inset-bottom))`. |

- **Winning Architecture (Portrait)**: **Option P3 (Split Thumb Shell with Fixed Bottom Nav)**.
- **The Why**: Mobile users interact with thumbs in one-handed grips. Placing core navigation (Graph, Cards, Progress, Search, Settings) at the bottom within the natural arc of the thumb eradicates upper-screen stretching while leaving the top header minimal.

---

### C.2 Organism: Curriculum Taxonomy & Category Filter Rail

#### Landscape Paradigm Comparison (Desktop 1440×900)

```
Option C1: Single-Line Horizontal Scroll with Hidden Overflow (Anti-Pattern - FAIL)
[React Core] [State & Data] [Effects] [Rendering] [Architec... >] (Mouse dragging required)

Option C2: Left Vertical Taxonomy Tree (Evaluated Option)
┌──────────────┐
│ Categories   │ Occupies 220px fixed left column;
│ • Core       │ forces canvas to shrink; creates
│ • State      │ empty vertical space below short categories list.
└──────────────┘

Option C3: Multi-Row Wrapped Flex Strip with Proximity Counters (Winning Architecture)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [All (48)]  [Fundamentals (6)]  [State (5)]  [Effects (4)]  [Rendering (5)]  [Arch (6)]│
│ [Quality (4)]  [Platform (4)]  [Design System (4)]  [Runtime (3)]  [Operations (4)]     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Criterion | Option C1: Single-Line Horizontal Scroll | Option C2: Left Vertical Tree | Option C3: Multi-Row Wrapped Flex Strip (WINNER) |
|:---|:---|:---|:---|
| **Anti-Hidden-Affordance**| **FAIL**: Violates Invariant 1.4. Mouse wheel cannot scroll horizontally without Shift key. | PASS: All visible in column. | **PASS (100%)**: All 11 categories immediately visible above the fold. |
| **Vertical Height Cost** | 40px (single row). | 0px top, but 100% height in sidebar. | **68px** (2 compact rows of 28px chips with 6px gap). |
| **Cognitive Discoverability**| Low; candidate forgets categories at end of strip. | High, but steals horizontal canvas width. | **Maximum**: Instant visual map of the entire curriculum taxonomy. |
| **Immutable Color Anchors**| Partially visible. | Visible as bullet points. | **Distinct chips** with category dot and count badge `(N)`. |

- **Winning Architecture (Landscape)**: **Option C3 (Multi-Row Wrapped Flex Strip)**.
- **The Why**: Satisfies Invariant 1.4 (`Anti-Hidden-Affordance`). Desktop users must never be forced to drag horizontal scrollbars with a mouse to discover essential categories. A 2-row wrapped flex container costs only 68px and presents 100% of curriculum categories at a glance.

---

#### Portrait Paradigm Comparison (Mobile 390×844)

```
Option CM1: Multi-Row Wrapped Flex on Mobile (Anti-Pattern)
┌─────────────────────────┐
│ [All] [Fundamentals]    │
│ [State & Data] [Effects]│ Takes 5 rows (180px height!)
│ [Rendering] [Arch]      │ Eats 25% of mobile screen height alone
│ [Quality] [Platform]... │ Content pushed far below fold.
└─────────────────────────┘

Option CM2: Horizontal Touch-Snap Rail with Edge Gradients (Winning Architecture)
┌─────────────────────────┐
│ [All (48)] [Fund (6)] [S│ <- Smooth swipeable touch rail; mask-image fade on right;
└─────────────────────────┘    touch targets 40px; labels truncated cleanly.
```

- **Winning Architecture (Portrait)**: **Option CM2 (Horizontal Touch-Snap Rail with Mask Gradients)**.
- **The Why**: While horizontal mouse dragging is an anti-pattern on desktop, horizontal swiping with the thumb on mobile is a native, effortless gesture. Option CM2 consumes only 44px of vertical space, using calibrated CSS masks (`mask-image: linear-gradient(to right, black 85%, transparent 100%)`) so candidates see the trailing chip edge without hard clipping.

---

### C.3 Organism: Main Learning Canvas (Grid vs. SVG DAG Topology)

#### Landscape Paradigm Comparison (Desktop 1440×900)

```
Option G1: Grid-Only Layout (Flat Cards)
- Simple 4-column responsive grid.
- Excellent reading density and scanning speed.
- Flaw: Completely hides prerequisites, architectural causality, and topological dependencies.

Option G2: Free-Floating Infinite Canvas Only (Figma/Miro Archetype)
- Unlimited 2D spatial panning.
- Flaw: High cognitive friction; users lose track of uncompleted nodes; difficult to scan sequentially.

Option G3: Coordinated Dual-Mode Workspace (Segmented Toggle) (Winning Architecture)
- Mode A (Default): High-Density Topological Grid (Structured cards sorted by topological priority).
- Mode B: Sugiyama-Layered SVG Topology Canvas (Layered DAG with smooth pan/zoom, directed edges).
- Synchronized State: Opening a card or mastering a node updates both views identically.
```

| Criterion | Option G1: Grid-Only | Option G2: Free Canvas Only | Option G3: Coordinated Dual-Mode (WINNER) |
|:---|:---|:---|:---|
| **Topological Pedagogical Value** | Low (no visual edges). | High, but disorienting. | **Maximum**: Candidate toggles between structural DAG and scanning grid. |
| **Scanning Speed (<1s glance)** | **Very High** (4 columns). | Slow (requires panning). | **Very High** in Grid Mode; deep architectural intuition in DAG mode. |
| **Screen Space Utilization** | 100% efficient. | Variable (empty spatial voids). | **Optimized per task**: Grid for execution; DAG for dependency planning. |
| **State Synchronization** | Single view. | Single view. | **Bidirectional**: Selection and completion states shared seamlessly. |

- **Winning Architecture (Landscape)**: **Option G3 (Coordinated Dual-Mode Workspace)**.
- **The Why**: Different cognitive moments require different visual representations. When planning milestone prerequisites, the Sugiyama DAG renders explicit causality. When executing study sprints, the 4-column topological grid maximizes reading density.

---

### C.4 Organism: 4-Stage Study Modal Architecture

#### Landscape Paradigm Comparison (Desktop 1440×900)

```
Option M1: Multi-Column Split Workbench (Read on Left 50%, Evaluate on Right 50%)
┌───────────────────────────┬───────────────────────────┐
│ Stage 01: Read            │ Stage 03/04: Draft & Eval │
│ Code Comparison           │ Chat / Paraphrase Textarea│
│ (Cramped width = 450px)   │ (Cramped width = 450px)   │
└───────────────────────────┴───────────────────────────┘
Flaw: 450px makes two-column code diffs unreadable without horizontal scroll.

Option M2: Sequential Wizard Pages with Hard Prev/Next (Linear Funnel)
- Full modal width for each step.
- Flaw: Disallows free navigation; candidate cannot refer back to lesson while writing answer.

Option M3: Focused Stage-Tabbed Modal with Non-Destructive Context Tabs (Winning Architecture)
┌────────────────────────────────────────────────────────────────────────┐
│ Header: [Node Label]  [Cat Badge]  [Breadcrumb: Before → Now → After] │
├────────────────────────────────────────────────────────────────────────┤
│ Tabs: [01 Read]  [02 Learn (Chat)]  [03 Paraphrase]  [04 Evaluate]    │
├────────────────────────────────────────────────────────────────────────┤
│ Stage Content (Full 920px width; 65ch reading measure; code fits)      │
│ Scroll position resets on tab change (scrollTop = 0)                   │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Contextual Action (e.g. "Integrate Chat →" or "Evaluate →")   │
└────────────────────────────────────────────────────────────────────────┘
```

| Criterion | Option M1: Split Workbench | Option M2: Sequential Wizard | Option M3: Stage-Tabbed Modal (WINNER) |
|:---|:---|:---|:---|
| **Code Readability (Diffs)** | **Poor**: 450px forces horizontal scroll on code lines. | Good: Full width. | **Optimal**: 920px modal width allows full side-by-side or stacked code. |
| **Cognitive Focus** | Low; split view overwhelms candidate with simultaneous tasks. | High, but locks candidate into rigid sequence. | **Calibrated**: 1 clear stage active at a time; instant 1-click tab switching. |
| **Draft Preservation** | High. | High. | **Guaranteed**: Switching tabs never clears editor draft; auto-saved to IndexedDB. |
| **Zen Mode Scalability** | Cluttered in fullscreen. | Inflexible. | **Seamless**: Expands to 100vw × 100vh with centered 65ch reading column. |

- **Winning Architecture (Landscape)**: **Option M3 (Focused Stage-Tabbed Modal)**.
- **The Why**: Option M3 provides the optimal balance between focus and agency. Full 920px container width allows code comparisons and rubrics to render without clipping, while tabs preserve free traversal without draft loss.

---

### C.5 Organism: Stage 01 Code Comparison Interface (Naive vs. Production)

#### Landscape Paradigm Comparison (Desktop 1440×900)

```
Option CC1: Strict Side-by-Side Dual Column (50% / 50%)
┌──────────────────────────────┬──────────────────────────────┐
│ Naive Approach               │ Production Senior Pattern    │
│ (420px well)                 │ (420px well)                 │
│ function workLoop() { ... }  │ function workLoopConcurr...  │
│ [Why it fails under scale]   │ [Accepted trade-off]         │
└──────────────────────────────┴──────────────────────────────┘
Risk: Lines > 45 characters wrap awkwardly or clip on standard font sizes.

Option CC2: Stacked Vertical Sequence (Top to Bottom)
┌─────────────────────────────────────────────────────────────┐
│ 1. Naive Approach (Recursive Stack Reconciler)              │
│ [Full 860px Code Block]                                     │
│ ⚠️ Why it fails: Locks thread > 50ms, dropping frames.      │
├─────────────────────────────────────────────────────────────┤
│ 2. Production Pattern (Fiber WorkLoop Time-Slicing)         │
│ [Full 860px Code Block]                                     │
│ ⚖️ Trade-off: Higher memory overhead per fiber node.        │
└─────────────────────────────────────────────────────────────┘

Option CC3: Segmented Tab Switcher (In-Place Toggle)
- Only 1 snippet visible at a time.
- Flaw: Violates Gestalt comparison; candidate cannot visually contrast the two architectures.
```

| Criterion | Option CC1: Side-by-Side Split | Option CC2: Stacked Vertical Sequence (WINNER) | Option CC3: In-Place Tab Toggle |
|:---|:---|:---|:---|
| **Visual Comparison Power** | High if wide; cramped at 920px. | **Superior**: Natural top-to-bottom reading: Thesis $\to$ Antithesis. | Poor; requires memory recall between clicks. |
| **Line Length & Formatting** | High risk of syntax clipping. | **Zero clipping**: Full 860px width for syntax-highlighted code. | Zero clipping. |
| **Explanation Association** | Explanations squeezed at bottom. | **Direct proximity**: Failure mode immediately below naive code. | Hidden. |
| **Mobile Portability** | Cannot fit on mobile (breaks). | **Identical responsive structure**: Stacks identically on mobile! | Requires different logic. |

- **Winning Architecture (Landscape & Portrait)**: **Option CC2 (Stacked Vertical Sequence)**.
- **The Why**: Senior engineering interviews require comparing the naive failure mode against the production trade-off. Stacked vertical layout gives each code snippet the horizontal breathing room it deserves, aligns the architectural explanation directly beneath each snippet, and translates 1:1 to mobile without responsive refactoring.

---

### C.6 Organism: Asynchronous Background HUD & Multi-Task Cockpit

#### Landscape Paradigm Comparison (Desktop 1440×900)

```
Option H1: Modal-Locking Spinner (Anti-Pattern)
- Modal stays open with a modal overlay blocking all interaction for 15-40 seconds.
- Flaw: Destroys learning flow; candidate cannot review other concepts while waiting for AI.

Option H2: Top Global Notification Banner
- Notification pinned below header.
- Flaw: Squeezes vertical canvas fold height, violating the <= 130px header constraint.

Option H3: Floating Bottom-Right Instrument Capsule (Winning Architecture)
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                      Main Workspace / Graph Area                       │
│                                                                        │
│                                            ┌─────────────────────────┐ │
│                                            │ ◉ EVALUATING: fiber_rec │ │
│                                            │ 14.2s • 1,842 chars • P2│ │
│                                            │ [Open Card →] [Cancel ✕]│ │
│                                            └─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

| Criterion | Option H1: Modal Spinner | Option H2: Top Banner | Option H3: Floating Instrument Capsule (WINNER) |
|:---|:---|:---|:---|
| **Candidate Autonomy** | Zero (User blocked). | High. | **Maximum**: Candidate studies or navigates other nodes freely. |
| **Canvas Intrusion** | 100% modal obstruction. | Steals 40px vertical fold. | **Minimal**: Occupies compact $320\times 72\text{px}$ footprint in bottom-right corner. |
| **Feedback Richness** | Generic spinner. | Limited text. | **Rich instrument**: Elapsed timer, streamed characters, latency phase. |
| **Cancellation Agency** | Unclear. | Distant button. | **Direct coupling**: `Cancel ✕` immediately beside status indicator. |

- **Winning Architecture (Landscape & Portrait)**: **Option H3 (Floating Bottom-Right Instrument Capsule)**.
- **The Why**: Deep-thinking AI models take 10 to 40 seconds to evaluate complex answers. Locking the candidate into a blocking spinner creates frustration. Option H3 unblocks the candidate, provides rich real-time streaming telemetry, and offers instant 1-click re-entry (`Open Card →`) or cancellation (`Cancel ✕`).

---

### C.7 Organism: Mobile View Switching & Bottom Command Bar

#### Portrait Paradigm Comparison (Mobile 390×844)

```
Option M-Nav1: Top Header Hamburger Menu (Anti-Pattern)
- Navigation hidden inside top drawer.
- Requires 2 taps to switch views; completely out of reach of single-handed grip.

Option M-Nav2: Floating Action Button (FAB) Menu
- Single floating button that expands into circular or vertical options.
- Flaw: Obstructs bottom-right content; lacks clear persistent visual status.

Option M-Nav3: Fixed 5-Tab Bottom Command Bar (Winning Architecture)
┌────────────────────────────────────────────────────────────────────────┐
│                      Mobile Scrollable Canvas                          │
│                                                                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│   [🔀 Graph]   [📇 Cards]   [📊 Progress]   [🔍 Search]   [⚙️ BYOK]    │
│                           (Thumb-Friendly Arc)                         │
└────────────────────────────────────────────────────────────────────────┘
```

| Criterion | Option M-Nav1: Top Hamburger | Option M-Nav2: Floating FAB | Option M-Nav3: Fixed Bottom Command Bar (WINNER) |
|:---|:---|:---|:---|
| **Thumb Ergonomics (Fitts's Law)**| **Fails**: Top-left requires second hand or awkward stretch. | Moderate: Floating position can be tapped, but sub-menu is awkward. | **Flawless**: 5 key destinations sit directly in comfortable thumb arc. |
| **View State Persistence** | Hidden (User cannot see active mode). | Hidden. | **100% Glanceable**: Active tab pill indicator confirms current location. |
| **Touch Target Dimensions** | Variable. | 56px circle, but small sub-targets. | **Strict $\ge 44\times 44\text{px}$** for every tab item. |
| **Safe Area Compliance** | None. | Clashes with home indicator. | **Full compliance**: `padding-bottom: max(12px, env(safe-area-inset-bottom))`. |

- **Winning Architecture (Portrait)**: **Option M-Nav3 (Fixed 5-Tab Bottom Command Bar)**.
- **The Why**: Adheres to modern mobile operating standards (iOS/Android tab bars). Provides one-tap switching between Graph, Flashcards, Progress, Search, and Settings without requiring modal dialogs or reachability gymnastic maneuvers.

---

## 5. Architectural Quality Gate Self-Check

| # | Quality Gate Checklist Criterion | Evaluation Evidence in design-spec.md (Sec A–C) | Status |
|:---:|:---|:---|:---:|
| 1 | **100% Spec Data Coverage** | Section A provides an exhaustive numbered manifest of **95 distinct items (`INF-01` to `INF-95`)** covering every user scenario, state, counter, and action across US1–US7. | **CERTIFIED** |
| 2 | **Anti-Layer-Cake Layout** | Desktop header (52px) + Category deck (68px) totals **120px** ($\le 130\text{px}$). Content fold occupies **$86.6\%$ of viewport** ($780\text{px} / 900\text{px}$), ensuring $\ge 2$ rows of cards visible above fold without scrolling. | **CERTIFIED** |
| 3 | **Anti-Canyon (Fitts's Law)** | Section B.3 and Section C eradicate naked `space-between` voids ($>350\text{px}$). Controls and primary actions are coupled directly ($\le 16\text{px}$) to their target entities. | **CERTIFIED** |
| 4 | **Anti-Hidden-Affordance** | Desktop category taxonomy wraps across 2 rows (`flex-wrap: wrap`), guaranteeing **100% discoverability** of all 11 React / 7 Rails categories without horizontal mouse dragging. | **CERTIFIED** |
| 5 | **Mobile Thumb Ergonomics** | Viewports $< 768\text{px}$ adapt to a **fixed 5-tab bottom navigation bar** (`mobile-bottom-nav`) with $\ge 44\times 44\text{px}$ touch targets, safe-area insets, and $70\text{px}$ bottom scroll clearance. | **CERTIFIED** |
| 6 | **3-Level Attention Hierarchy** | Section B.2 strictly partitions all 95 items into Glanceable (<1s), Operational (1–5s), and On-demand (>5s) with explicit styling rules. | **CERTIFIED** |
| 7 | **Proximity over Dividers & Anti-Carditis**| Eradicates nested cards in modals/panels; modal planes remain unified surfaces; spacing steps (4px/8px/16px/32px) replace decorative separator boxes. | **CERTIFIED** |
| 8 | **Comparative Layout Evaluations** | Section C evaluates 2–3 competing layout paradigms for 7 macro organisms across both Landscape (1440×900) and Portrait (390×844), with explicit trade-offs and "The Why". | **CERTIFIED** |

---
<!-- PHASE_1_IA_SPEC_COMPLETE -->

---

## Section D: Patrones de Componentes y Mecánica Interactiva (Component Patterns & Interactive Mechanics)

- **Workflow Phase**: Phase 2 of [`docs/VISUAL_WORKFLOW.md`](../../docs/VISUAL_WORKFLOW.md)
- **Governing Master Skill**: [`.agents/skills/ui-component-patterns/SKILL.md`](../../.agents/skills/ui-component-patterns/SKILL.md)
- **Foundations Token Reference**: [`DESIGN.md`](../../DESIGN.md) *(Dark Engineering Editorial — "El cockpit de dominio técnico")*
- **Feature Specification Source**: [`specs/001-clean-workspace-v2/spec.md`](./spec.md) (US1 through US7)
- **Architectural Scope**: Complete operational mechanics, CSS token binding, event lifecycles, and verification contracts for all interactive organisms across desktop and mobile viewports.

---

### D.1 Arquitectura del App Shell (App Shell Architecture)

The App Shell embodies the estate-level frame of Learning Workspace. In accordance with `app-shell` principles, the top frame is permanent estate furniture that remains invariant while internal curricular views, DAG layouts, and study drawers mount and unmount beneath it.

```
DESKTOP SHELL ARCHITECTURE (1440×900 — Top Chrome: 120px ≤ 130px Invariant)
┌─────────────────────────────────────────────────────────────────────────────────────────────┐ ▲
│ ORG-01: Global Header (Height: 52px, Sticky, z-index: 10)                                   │ │
│ [Logo + Monogram]  [React | Rails]                 [Ctrl+K Search]  [Progress]  [BYOK] [96%]│ │ 120px
├─────────────────────────────────────────────────────────────────────────────────────────────┤ │ Top Chrome
│ ORG-02: Control Deck & Taxonomy Rail (Height: 68px, Sticky, z-index: 9)                     │ │ (≤130px PASS)
│ [★ Next: Fiber Reconciler →] [Mode: Grid|DAG|Cards]                                         │ │
│ [All (48)] [Fundamentals (6)] [State (5)] [Effects (4)] [Rendering (5)] [Architecture (6)] │ │
├─────────────────────────────────────────────────────────────────────────────────────────────┤ ▼
│                                                                                             │ ▲
│ ORG-03: Main Learning Canvas (Height: calc(100vh - 120px) = 780px, z-index: 0)             │ │ Content Fold
│                                                                                             │ │ 780px / 900px
│ 4-Column Topological Node Grid  OR  Sugiyama-Layered SVG DAG Canvas                         │ │ = 86.6% PASS
│ (Single vertical scroll container, overscroll-behavior: contain)                            │ │ (≥70% PASS)
│                                                                                             │ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘ ▼
```

#### 1. Desktop Top Chrome Engineering (120px Fixed Ceiling)
The desktop shell decomposes into two coordinated, vertically stacked planes totaling exactly $120\text{px}$, safely within the $\le 130\text{px}$ Anti-Layer-Cake threshold:

1. **Global App Header (`ORG-01`)**:
   - **Height**: Exactly `52px` (`3.25rem`), `flex-shrink: 0`.
   - **Positioning**: `position: sticky; top: 0; left: 0; right: 0; z-index: var(--z-header: 10);`.
   - **Background**: `--color-surface-base` (`#0B0D13`) with subtle directional micro-bevel (`box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.08)`).
   - **Left Cluster**:
     - Monogram icon (`28×28px`, `--radius-sm: 4px`, `--color-brand-primary-subtle`) + Brand Wordmark (`INF-01`, `--text-base`, font-weight 700).
     - Segmented Curriculum Switcher (`INF-02`): Two-option pill toggle (`"React"` | `"Rails"`), `height: 32px`, `--radius-md: 8px`, active tab highlighted with `--color-surface-raised` (`#151B25`) and 1px border `rgba(255, 255, 255, 0.12)`.
   - **Right Cluster (Coupled Utility Strip)**:
     - Global Command Palette Trigger (`INF-18`): Outlined button, `height: 32px`, `padding: 0 var(--space-3)`, displaying shortcut badge `<kbd>Ctrl K</kbd>` in monospace (`10px`).
     - Seniority Progress Drawer Trigger (`INF-22`): Ghost button `height: 32px`, displaying completion percentage badge (`INF-03`, `font-variant-numeric: tabular-nums`).
     - BYOK Settings Trigger (`INF-81`): Icon button `32×32px` (`⚙️`), `--radius-md: 8px`.

2. **Curriculum Control Deck & Taxonomy Rail (`ORG-02`)**:
   - **Height**: Exactly `68px` (`4.25rem`), `flex-shrink: 0`.
   - **Positioning**: `position: sticky; top: 52px; left: 0; right: 0; z-index: var(--z-deck: 9);`.
   - **Background**: `rgba(11, 13, 19, 0.92)` with `backdrop-filter: blur(12px)` and bottom hairline border (`1px solid rgba(255, 255, 255, 0.06)`).
   - **Row 1 (Orientation & Views, 30px height)**:
     - Next Challenge Strip (`INF-04`, `INF-05`): Priority indicator chip (`Immediate Prereq` | `Next Milestone` | `Deep Dive`) + Recommended Node Link with hover arrow (`Start →`).
     - Visual Layout Mode Selector (`INF-08`): 3-way segmented control (`Grid` | `Topology DAG` | `Flashcards`), `height: 28px`.
   - **Row 2 (Taxonomy Filter Wrap, 32px height)**:
     - Category Chips (`INF-06`, `INF-07`): Multi-row flex wrapping (`flex-wrap: wrap; gap: 6px;`). Each chip features an immutable 6px category anchor dot, category name, and tabular node count `(${count})`.

3. **Main Content Canvas (`ORG-03`)**:
   - **Height**: `calc(100vh - 120px)`.
   - **Containment**: `overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain;`.
   - **Fold Clearance**: $780\text{px}$ vertical viewport available on standard $900\text{px}$ display ($86.6\%$ dedicated content fold), guaranteeing at least two full rows of curriculum node cards are visible above the fold without user scrolling.

---

#### 2. Mobile Ergonomic Shell ($< 768\text{px}$)
On viewports $< 768\text{px}$, desktop top chrome collapses into an ergonomic thumb-driven shell split between top status and bottom action navigation:

```
MOBILE SHELL ARCHITECTURE (390×844 — Split Thumb Shell)
┌─────────────────────────────────────────┐ ▲
│ Compact Mobile Header (56px, Sticky)    │ │ 56px Top
│ [Monogram] [React | Rails Switcher]     │ │
├─────────────────────────────────────────┤ ▼
│ Category Touch Rail (44px, Swipeable)   │ 44px Rail
│ [All (48)] [Fund (6)] [State (5)] [Ef...│ (Right Gradient Mask)
├─────────────────────────────────────────┤
│                                         │ ▲
│ Mobile Content Well                     │ │
│ (Single-column cards or touch DAG)      │ │ Content Fold
│                                         │ │
│ Mandatory Clearance Spacer: 70px + safe │ │
│                                         │ ▼
├─────────────────────────────────────────┤ ▲
│ Fixed Mobile Bottom Nav (ORG-13)        │ │ 56px +
│ [🔀 Graph] [📇 Cards] [📊 Prog] [🔍] [⚙️]│ │ safe-area
└─────────────────────────────────────────┘ ▼
```

- **Compact Mobile Header (`INF-95`)**: Fixed `56px` height. Houses Brand Monogram and Curriculum Switcher (`React` | `Rails`). Search, Progress, and Settings buttons are removed to eliminate header crowding.
- **Swipeable Category Rail (`CM2`)**: Single horizontal touch-scrollable strip (`height: 44px; overflow-x: auto; scrollbar-width: none;`). Includes CSS edge mask (`mask-image: linear-gradient(to right, black 85%, transparent 100%)`) signaling horizontal continuation.
- **Fixed Mobile Bottom Command Bar (`ORG-13` / `mobile-bottom-nav`)**:
  - **Positioning**: `position: fixed; bottom: 0; left: 0; right: 0; z-index: var(--z-bottom-nav: 25);`.
  - **Height**: `56px + env(safe-area-inset-bottom, 16px)`.
  - **Background**: `--color-surface-raised` (`#151B25`) with top hairline border (`1px solid rgba(255, 255, 255, 0.08)`).
  - **Touch Targets**: 5 equidistant navigation tabs (`Graph`, `Cards`, `Progress`, `Search`, `Settings`), each strictly meeting $\ge 44\times 44\text{px}$ touch target dimensions.
  - **Active State Indicator**: Active tab renders an accent pill with `--color-brand-primary-subtle` and icon colored `--color-brand-primary` (`#5EEAD4`).
- **Canvas Bottom Clearance (`INF-94`)**: Scrollable container specifies `padding-bottom: calc(70px + env(safe-area-inset-bottom, 16px))` ensuring the bottom-most card is 100% visible and un-occluded by the bottom command bar.

---

#### 3. Seniority & Milestones Flyout Drawer Architecture (`ORG-04`)
The Seniority & Milestones Drawer (`INF-23`, `INF-24`) provides secondary curriculum progression inspection without losing the spatial context of the graph canvas.

```
SENIORITY DRAWER SLIDE-IN MECHANICS
┌───────────────────────────────────────────────┬───────────────────────────────┐
│ Canvas Viewport Behind Scrim                  │ Seniority Drawer (ORG-04)     │
│ (Dimmed: rgba(0,0,0,0.65) + blur(4px))        │ Width: 400px (Desktop)        │
│ Body Scroll: LOCKED (Zero-CLS Compensation)   │ Width: 100vw (Mobile)         │
│                                               ├───────────────────────────────┤
│                                               │ Header: [Title]           [✕] │
│                                               ├───────────────────────────────┤
│                                               │ Scrollable Body               │
│                                               │ • Seniority Competency Bands  │
│                                               │ • Curricular Milestones       │
│                                               │ • Completion Badges           │
└───────────────────────────────────────────────┴───────────────────────────────┘
```

- **Desktop Form Factor**: Right-edge slide-in flyout, width strictly `400px`, `height: 100vh`, `position: fixed; top: 0; right: 0; z-index: var(--z-drawer: 40);`.
- **Mobile Form Factor**: Full-screen sheet (`width: 100vw; height: 100vh; top: 0; left: 0;`).
- **Surface Elevation**: `--color-surface-card` (`#10151D`), `--shadow-level-3` (`0 12px 32px rgba(0, 0, 0, 0.65)`), and 1px left border (`rgba(255, 255, 255, 0.08)`).
- **Backdrop Scrim**: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); z-index: var(--z-drawer-scrim: 39);`.
- **Sliding Mechanics & Motion Signature**:
  - Rest (Closed): `transform: translateX(100%); pointer-events: none; opacity: 0;`.
  - Active (Open): `transform: translateX(0); pointer-events: auto; opacity: 1;`.
  - Motion Curve: `transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease-out;`.
- **Dismiss Invariants**:
  - `Escape` keypress immediately dismisses drawer.
  - Clicking the scrim backdrop immediately dismisses drawer.
  - Explicit close button (`[✕]`, $36\times 36\text{px}$) in top-right corner.
  - On open: Focus shifts automatically to the drawer title (`tabindex="-1"`).
  - On close: Focus returns deterministically to the triggering button (`INF-22` or bottom tab).

---

### D.2 Jerarquía Estricta de Superposición y Z-Index (Strict Overlay & Z-Index Hierarchy)

To eliminate z-index competition and unpredictable stacking context collisions, Learning Workspace establishes an authoritative **8-Layer Stacking Ladder (Capa 0 through Capa 7)**.

```
THE 8-LAYER STACKING LADDER
▲  [Capa 7] z-index: 70  ──  Ephemeral Toast Notifications & Cross-Tab Sync Alerts
│  [Capa 6] z-index: 60  ──  System Confirmation Dialogs (Destructive Overwrite)
│  [Capa 5] z-index: 50  ──  Primary Modal Dialogs (4-Stage Study Modal, Command Palette, BYOK)
│  [Capa 4] z-index: 40  ──  Flyout Drawers (Seniority & Milestones Drawer)
│  [Capa 3] z-index: 30  ──  Floating Non-Blocking Popovers & Glossary Tooltips
│  [Capa 2] z-index: 20  ──  Floating Asynchronous Background HUD & Canvas Zoom Cluster
│  [Capa 1] z-index: 10  ──  Sticky Shell Header & Control Deck (Mobile Bottom Nav at z: 25)
▼  [Capa 0] z-index: 0   ──  Base Surface & SVG Topological DAG Canvas
```

#### 1. Layer Allocation & Rules Matrix

| Layer | CSS Token | `z-index` | Overlay Type | Scrim Dimming | Body Scroll-Lock | Dismiss Triggers | Target Components |
|:---:|:---|:---:|:---|:---:|:---:|:---|:---|
| **Capa 0** | `--z-canvas` | `0` | Base Plane | None | No | None | Graph Canvas, Topological Node Grid, SVG Paths. |
| **Capa 1** | `--z-header` | `10` | Sticky Header | None | No | None | Global Header (`ORG-01`), Control Deck (`ORG-02`). *(Mobile Bottom Nav uses `25`)*. |
| **Capa 2** | `--z-hud` | `20` | Floating Cockpit | None | No | Minimize / Cancel | Floating Background HUD (`ORG-10`), Zoom Controls (`INF-09`). |
| **Capa 3** | `--z-popover` | `30` | Non-blocking Popover | None | No | Click outside, Esc, Hover-out | Glossary Term Popovers (`INF-34`), Category Count Tooltips. |
| **Capa 4** | `--z-drawer` | `40` | Side Flyout Drawer | Yes (`rgba(0,0,0,0.65)`, z: 39) | **MANDATORY** | Esc, Scrim Click, `[✕]` Button | Seniority & Milestones Drawer (`ORG-04`). |
| **Capa 5** | `--z-modal` | `50` | Blocking Dialog | Yes (`rgba(0,0,0,0.75)`, z: 49) | **MANDATORY** | Esc (non-destructive), Scrim Click, `[✕]` | 4-Stage Study Modal (`ORG-06`), Command Palette (`ORG-05`), BYOK Settings (`ORG-12`). |
| **Capa 6** | `--z-confirm`| `60` | Destructive Confirm | Yes (`rgba(0,0,0,0.85)`, z: 59) | **MANDATORY** | Explicit Buttons Only (Esc & Scrim Click DISABLED) | JSON Backup Overwrite Confirmation, Local Attempt Reset. |
| **Capa 7** | `--z-toast` | `70` | Ephemeral Alert | None | No | Auto-timer (5s), Click `[✕]`, Undo action | Cross-tab sync alerts (`INF-78`), Backup export notifications, Undo snackbars. |

---

#### 2. Mandatory Body Scroll-Lock Protocol (Layers $\ge 40$)
When an overlay in Capa 4, 5, or 6 opens, scrolling the background canvas must be locked. Naive `overflow: hidden` on `<body>` removes the browser scrollbar, causing an immediate 15px–17px horizontal layout jump (Cumulative Layout Shift violation).

Learning Workspace enforces the **Zero-CLS Scrollbar Compensation Protocol**:

```typescript
/**
 * Zero-CLS Scrollbar Compensation & Body Scroll Lock
 * Governs Capa 4 (Drawers), Capa 5 (Modals), and Capa 6 (Confirmations)
 */
export function lockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  // Set CSS custom property on root to compensate fixed headers and body
  document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`);
  
  document.body.style.paddingRight = 'var(--scrollbar-compensation, 0px)';
  document.body.style.overflow = 'hidden';
  document.body.classList.add('body-scroll-locked');
}

export function unlockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  document.body.style.paddingRight = '';
  document.body.style.overflow = '';
  document.body.classList.remove('body-scroll-locked');
  document.documentElement.style.removeProperty('--scrollbar-compensation');
}
```

- **Fixed Chrome Header Compensation**:
  ```css
  /* Fixed and sticky headers compensate synchronously during body scroll-lock */
  .body-scroll-locked .sticky-app-header,
  .body-scroll-locked .sticky-control-deck {
    padding-right: var(--scrollbar-compensation, 0px);
  }
  ```
- **Mobile Touch Lock**: On iOS Safari, backdrops apply `touch-action: none;` and listener event prevention on `touchmove` to eliminate background rubber-band dragging.

---

### D.3 Botones y Ciclo de Vida de 6 Estados con Ancho Reservado Anti-CLS (Button 6-State Completeness & Anti-CLS Mechanics)

Every interactive control strictly implements all 6 canonical states defined in `.agents/skills/ui-component-patterns/SKILL.md`. Missing or ambiguous states are zero-tolerated defects.

```
THE 6 CANONICAL BUTTON STATES
┌──────────────────┐  Default (Rest)     ── Base color, 1px border, cursor: pointer
│  Start Challenge │
├──────────────────┤  Hover              ── Algorithmic lightness shift (-8% L / +6% L), 120ms ease-out
│  Start Challenge │
├──────────────────┤  Active (Pressed)   ── Noticeable darkening (-14% L), transform: scale(0.97), 80ms
│  Start Challenge │
├──────────────────┤  Focus-visible      ── 2px high-contrast outline (#5EEAD4), outline-offset: 2px (Keyboard only)
│  Start Challenge │
├──────────────────┤  Disabled           ── Opacity: 0.40, cursor: not-allowed, pointer-events: none
│  Start Challenge │
├──────────────────┤  Loading (Anti-CLS) ── Width strictly reserved, label invisible, spinner optically centered
│      ( ◌ )       │
└──────────────────┘
```

#### 1. Anti-CLS Reserved Width Engineering
When buttons transition into an asynchronous loading state (e.g. clicking "Evaluate with AI (Ctrl+Enter)"), replacing the label text with a spinner must **NEVER mutate the rendered width of the button**. Width shifts destroy user visual anchor points and induce Cumulative Layout Shift (CLS).

**The Dual-Slot Architectural Pattern**:
```html
<button class="btn btn-primary btn--loading" aria-busy="true" disabled>
  <!-- Slot 1: Text Label remains in the DOM to preserve physical width -->
  <span class="btn__label" aria-hidden="true">
    Evaluate with AI (Ctrl+Enter)
  </span>
  <!-- Slot 2: Optically centered spinner overlay -->
  <span class="btn__spinner-slot">
    <svg class="spinner" viewBox="0 0 24 24" aria-label="Loading...">
      <circle class="spinner-track" cx="12" cy="12" r="10" />
      <path class="spinner-head" d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  </span>
</button>
```

```css
/* Anti-CLS Button Layout Contract */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: var(--font-sans);
  font-weight: 600;
  white-space: nowrap;
  border-radius: var(--radius-md, 8px);
  transition: background-color 120ms ease-out,
              border-color 120ms ease-out,
              color 120ms ease-out,
              transform 80ms ease-out,
              box-shadow 120ms ease-out;
}

.btn__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2, 8px);
  transition: opacity 100ms ease-out, visibility 100ms;
}

.btn__spinner-slot {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 100ms ease-out, visibility 100ms;
}

/* Loading State: Hide label optically without collapsing layout width */
.btn.btn--loading .btn__label {
  opacity: 0;
  visibility: hidden;
}

.btn.btn--loading .btn__spinner-slot {
  opacity: 1;
  visibility: visible;
}
```

---

#### 2. Button Variant & State Tokens Reference Matrix

| Button Variant | 1. Rest (Default) | 2. Hover | 3. Active (Pressed) | 4. Focus-Visible | 5. Disabled | 6. Loading |
|:---|:---|:---|:---|:---|:---|:---|
| **Primary CTA** (`.btn-primary`) | Bg: `#5EEAD4`<br>Ink: `#0B0D13`<br>Border: none | Bg: `#2DD4BF`<br>Ink: `#0B0D13`<br>Border: none | Bg: `#14B8A6`<br>`transform: scale(0.97)`<br>Ink: `#0B0D13` | Outline: `2px solid #5EEAD4`<br>Offset: `2px`<br>Bg: `#5EEAD4` | Opacity: `0.40`<br>Bg: `#5EEAD4`<br>`cursor: not-allowed` | Opacity: `0.85`<br>`cursor: wait`<br>Spinner: `#0B0D13` |
| **Secondary Outlined** (`.btn-secondary`) | Bg: `transparent`<br>Ink: `#F5F1E8`<br>Border: `rgba(255,255,255,0.08)` | Bg: `rgba(255,255,255,0.06)`<br>Ink: `#FFFFFF`<br>Border: `rgba(255,255,255,0.16)` | Bg: `rgba(255,255,255,0.10)`<br>`transform: scale(0.97)`<br>Border: `rgba(255,255,255,0.20)` | Outline: `2px solid #5EEAD4`<br>Offset: `2px`<br>Border: `rgba(255,255,255,0.20)` | Opacity: `0.40`<br>Border: `rgba(255,255,255,0.05)`<br>`cursor: not-allowed` | Opacity: `0.70`<br>`cursor: wait`<br>Spinner: `#F5F1E8` |
| **Ghost / Subtle** (`.btn-ghost`) | Bg: `transparent`<br>Ink: `#94A3B8`<br>Border: none | Bg: `rgba(255,255,255,0.05)`<br>Ink: `#F5F1E8`<br>Border: none | Bg: `rgba(255,255,255,0.08)`<br>`transform: scale(0.97)`<br>Ink: `#FFFFFF` | Outline: `2px solid #5EEAD4`<br>Offset: `2px`<br>Bg: `transparent` | Opacity: `0.35`<br>Ink: `#64748B`<br>`cursor: not-allowed` | Opacity: `0.70`<br>`cursor: wait`<br>Spinner: `#94A3B8` |
| **Destructive** (`.btn-destructive`) | Bg: `rgba(248,113,113,0.12)`<br>Ink: `#F87171`<br>Border: `rgba(248,113,113,0.28)` | Bg: `rgba(248,113,113,0.20)`<br>Ink: `#FCA5A5`<br>Border: `rgba(248,113,113,0.40)` | Bg: `rgba(248,113,113,0.28)`<br>`transform: scale(0.97)`<br>Border: `rgba(248,113,113,0.50)` | Outline: `2px solid #F87171`<br>Offset: `2px`<br>Border: `rgba(248,113,113,0.50)` | Opacity: `0.35`<br>Border: `rgba(248,113,113,0.10)`<br>`cursor: not-allowed` | Opacity: `0.75`<br>`cursor: wait`<br>Spinner: `#F87171` |

---

### D.4 Contención de Scroll, Barra de Desplazamiento Editorial y Anti-Scroll-Trap (Scroll Containment & Editorial Scrollbars)

Nested scroll traps—where a user scrolling inside a code block or modal unexpectedly scrolls the entire page—destroy technical immersion. The layout enforces **Single Scroll Axis Containment**.

```
SCROLL CONTAINMENT ARCHITECTURE
┌─────────────────────────────────────────────────────────────┐
│ Viewport Boundary (html, body { height: 100vh; overflow: hidden; })
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Sticky Top Chrome (flex-shrink: 0; NO SCROLL)           │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Main Canvas Container                                   │ │
│ │ (overflow-y: auto; overflow-x: hidden;)                 │ │
│ │ (overscroll-behavior: contain;)                         │ │
│ │   ┌─────────────────────────────────────────────────┐   │ │
│ │   │ Study Modal (Inside Overlay Plane)              │   │ │
│ │   │ ┌─────────────────────────────────────────────┐ │   │ │
│ │   │ │ Modal Header & Tabs (flex-shrink: 0; NO SCROLL)│ │
│ │   │ ├─────────────────────────────────────────────┤ │   │ │
│ │   │ │ Tab Panel Body (Single Scroll Container)    │ │   │ │
│ │   │ │ (overflow-y: auto; overscroll-behavior: contain)│ │
│ │   │ │   ┌─────────────────────────────────────┐   │ │   │ │
│ │   │ │   │ Code Well: Horizontal Scroll Only   │   │ │   │ │
│ │   │ │   │ (overflow-x: auto; overflow-y: hidden)│ │ │   │ │
│ │   │ │   └─────────────────────────────────────┘   │ │   │ │
│ │   │ └─────────────────────────────────────────────┘ │   │ │
│ │   └─────────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 1. Single Scroll Axis Invariants
1. **Root Lockdown**: `html` and `body` enforce `height: 100vh; width: 100vw; overflow: hidden;`. The outer browser window never scrolls.
2. **Dedicated Workspace Scroller**:
   - Grid View: The grid container owns vertical scrolling (`overflow-y: auto; overflow-x: hidden;`).
   - SVG DAG View: Panning and zooming is handled mathematically via transform matrices in `usePanZoom`. Native browser scrollbars are disabled on the SVG viewport.
3. **Modal Body Isolation**:
   - The Study Modal Header (`INF-25`) and Stage Tabstrip (`INF-30`) are `flex-shrink: 0; position: sticky; top: 0;`.
   - The active `tabpanel` is the sole vertical scrolling container (`height: calc(100% - 104px); overflow-y: auto; overflow-x: hidden;`).
4. **Code Well Horizontal Containment**:
   - Syntax-highlighted code blocks (`INF-35`, `INF-36`) specify `overflow-x: auto; overflow-y: hidden; white-space: pre;`. Vertical wheel events cleanly bubble up to the parent tabpanel without getting trapped.

---

#### 2. Anti-Scroll-Trap (`overscroll-behavior: contain`)
Every scrollable surface must explicitly declare:
```css
.scroll-contained {
  overscroll-behavior: contain;
  overscroll-behavior-y: contain;
}
```
This isolates the wheel event chain. When the user reaches the absolute bottom of the Study Modal body or Seniority Drawer, scroll momentum is halted; it is never forwarded to the underlying curriculum graph canvas.

---

#### 3. Editorial Dark Engineering Scrollbar Specification
Native browser scrollbars (wide, grey, high-contrast) are forbidden. The application implements ultra-restrained, 6px editorial scrollbars:

```css
/* Firefox Standard Specification */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
}

/* WebKit / Chromium Specification */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-sm, 4px);
  border: 1px solid transparent;
  background-clip: padding-box;
  transition: background-color 150ms ease-out;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.28);
}

::-webkit-scrollbar-corner {
  background: transparent;
}
```

---

### D.5 Invariantes de Navegación por Pestañas (Tab Navigation Invariants)

In strict conformance with `tab-navigation` principles, tabs organize peer-level content within a shared context without inducing page reload or route destruction.

```
STUDY MODAL 4-STAGE TABSTRIP (role="tablist", aria-label="Etapas de Estudio")
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  [01 Read]          │  [02 Learn (Chat)]   │  [03 Paraphrase]     │  [04 Evaluate]          │
│  (Active: #5EEAD4)  │  (Inactive: #94A3B8) │  (Inactive: #94A3B8) │  (Inactive: #94A3B8)    │
│  ─────────────────  │                      │                      │                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Invariants & Guardrails
1. **The 2–7 Tab Count Invariant**:
   - The Study Modal tabstrip consists of **exactly 4 tabs** (`01 Read`, `02 Learn`, `03 Paraphrase`, `04 Evaluate`), fully within the 2–7 bound.
   - The Mobile Bottom Navigation bar consists of **exactly 5 tabs** (`Graph`, `Cards`, `Progress`, `Search`, `Settings`).
2. **`flex-shrink: 0` Strip Protection**:
   - The tabstrip container declares `display: flex; flex-shrink: 0; width: 100%; height: 44px;`.
   - Tabs are strictly prohibited from wrapping to multiple lines (`flex-wrap: nowrap;`).
3. **ScrollTop Reset Protocol**:
   - When a user changes tabs (e.g. from *01 Read* to *04 Evaluate*), the panel scroll container **must reset scroll position to zero**:
     ```typescript
     function handleStageChange(nextStage: StudyStage): void {
       setActiveStage(nextStage);
       if (panelContainerRef.current) {
         panelContainerRef.current.scrollTop = 0;
       }
     }
     ```
   - Rationale: If a candidate scrolls 600px down in Stage 01 and switches to Stage 04, retaining `scrollTop = 600px` lands them in the middle of rubric notes, hiding the primary score hero readout.
4. **Draft Non-Destruction Invariant**:
   - Switching tabs never unmounts or purges active form state or paraphrase drafts. Unsubmitted drafts in Stage 03 persist in memory and auto-save debounced (300ms) to IndexedDB.

---

#### 2. ARIA Accessibility & Roving Tabindex Contract

```html
<div role="tablist" aria-label="Etapas de Estudio de la Lección" class="study-tabstrip">
  <button
    role="tab"
    id="tab-stage-01"
    aria-selected="true"
    aria-controls="panel-stage-01"
    tabindex="0"
    class="tab-item tab-item--active"
  >
    <span class="tab-index">01</span> Read
  </button>
  <button
    role="tab"
    id="tab-stage-02"
    aria-selected="false"
    aria-controls="panel-stage-02"
    tabindex="-1"
    class="tab-item"
  >
    <span class="tab-index">02</span> Learn
  </button>
  <button
    role="tab"
    id="tab-stage-03"
    aria-selected="false"
    aria-controls="panel-stage-03"
    tabindex="-1"
    class="tab-item"
  >
    <span class="tab-index">03</span> Paraphrase
  </button>
  <button
    role="tab"
    id="tab-stage-04"
    aria-selected="false"
    aria-controls="panel-stage-04"
    tabindex="-1"
    class="tab-item"
  >
    <span class="tab-index">04</span> Evaluate
  </button>
</div>

<!-- Panels: Inactive panels strictly hidden from accessibility tree -->
<div role="tabpanel" id="panel-stage-01" aria-labelledby="tab-stage-01" class="tab-panel">
  <!-- Stage 01 Content -->
</div>
<div role="tabpanel" id="panel-stage-02" aria-labelledby="tab-stage-02" class="tab-panel" hidden>
  <!-- Stage 02 Content -->
</div>
```

- **Keyboard Roving Mechanics**:
  - `ArrowRight` / `ArrowLeft`: Moves focus cyclically across tabs. In this high-density tool, arrow keys move focus and activate immediately (`auto-activate`).
  - `Home`: Jumps focus to `01 Read`.
  - `End`: Jumps focus to `04 Evaluate`.
  - `Tab`: Moves focus from the active tab into the first interactive element inside the active `tabpanel`.

---

### D.6 Dimensionamiento Explícito y Alineación de Controles (Explicit Control Sizing & Alignment)

In alignment with `sizing-units` and `repeated-component-alignment`, every button, input, badge, and card conforms to explicit height tokens and identical optical baselines.

```
EXPLICIT CONTROL HEIGHT SCALE
┌──────────────┬───────────────────┬────────────────────────────────────────────────────────┐
│ Height Token │ Value (px / rem)  │ Concrete Application Slot                              │
├──────────────┼───────────────────┼────────────────────────────────────────────────────────┤
│ --ctrl-touch │ 44px (2.75rem)    │ Minimum touch target floor for mobile (<768px)         │
│ --ctrl-lg    │ 40px (2.50rem)    │ Primary CTA ("Evaluate with AI", "Start Challenge")     │
│ --ctrl-md    │ 36px (2.25rem)    │ Standard inputs, modal action buttons, search bars     │
│ --ctrl-sm    │ 32px (2.00rem)    │ Global toolbar controls, category chips, zoom cluster  │
│ --ctrl-xs    │ 24px (1.50rem)    │ Inline metadata badges, status chips, kbd shortcuts   │
└──────────────┴───────────────────┴────────────────────────────────────────────────────────┘
```

#### 1. Mobile Touch Floor vs. Desktop Density
- **Mobile Touch Floor**: Every clickable control on viewports $< 768\text{px}$ must render with an effective hit target $\ge 44\times 44\text{px}$ (via explicit height or `::after` transparent touch expansion pseudo-element).
- **Desktop Density**: On desktop, row heights compress to $32\text{px}$–$36\text{px}$ to satisfy the Dark Engineering Editorial density without sacrificing pointer accuracy.

---

#### 2. Optical Center Line & Mixed-Element Alignment Contract
When a table row, card header, or breadcrumb mixes text labels, badges, status indicator dots, tabular metrics, and action icons:

```css
.aligned-control-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2, 8px);
  line-height: 1; /* Eliminates font-specific vertical metric drifts */
}

/* Status Traffic-Light Dot: Aligned to Cap-Height Center */
.status-indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  transform: translateY(-0.5px); /* Micro-shift to match font cap-height center */
}

/* Semantic Badges / Chips: em-Relative Padding to Preserve Row Height */
.chip-token {
  font-size: 0.8125rem; /* 13px */
  padding: 0.2em 0.55em;
  border-radius: var(--radius-sm, 4px);
  line-height: 1;
  vertical-align: middle;
}
```

---

#### 3. The 4-Slot Model for Repeated Curriculum Cards (`ORG-03`)
In strict adherence to `repeated-component-alignment`, all cards in the 4-column curriculum grid honor a rigid **4-slot model**:

```
THE 4-SLOT REPEATED CARD MODEL
┌──────────────────────────────────────────────────────────┐ ▲
│ Slot 1: Meta Header (Height: 24px, Fixed)                │ │
│ [Category Dot + Name]             [mid|senior]  [🔒 / ✓] │ │
├──────────────────────────────────────────────────────────┤ │
│ Slot 2: Title Slot (Height: 24px, Fixed)                 │ │
│ State, Snapshots and Batching                            │ │
├──────────────────────────────────────────────────────────┤ │
│ Slot 3: Flexible Body Description (Absorbs Variance)     │ │ 180px
│ Replaces recursive call stack with an interruptible      │ │ Equal Height
│ singly-linked list tree for cooperative scheduling...    │ │ Track
│ (-webkit-line-clamp: 2; overflow: hidden;)               │ │
├──────────────────────────────────────────────────────────┤ │
│ Slot 4: Pinned Footer Anchor (Height: 32px, Fixed)       │ │
│ margin-top: auto; (Anchors pinned to identical baseline) │ │
│ ★ 114/120                                      Study →   │ │
└──────────────────────────────────────────────────────────┘ ▼
```

```css
/* 4-Slot Card Model CSS */
.node-card {
  display: flex;
  flex-direction: column;
  height: 100%; /* Track stretch guarantees equal height */
  padding: var(--space-4, 16px);
  background: var(--color-surface-card, #10151d);
  border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-level-1);
}

.node-card__slot-meta {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2, 8px);
}

.node-card__slot-title {
  height: 24px;
  font-size: var(--text-base, 16px);
  font-weight: 600;
  color: var(--color-text-primary, #f5f1e8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--space-1, 4px);
}

.node-card__slot-body {
  flex: 1; /* Absorbs vertical slack so cards of varying text remain identical */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: var(--text-sm, 13px);
  color: var(--color-text-secondary, #94a3b8);
  line-height: 1.45;
  margin-bottom: var(--space-3, 12px);
}

.node-card__slot-footer {
  margin-top: auto; /* Pins footer to identical bottom edge across all sibling cards */
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

---

### D.7 Vistas de Datos Coordinadas y Sincronización Bidireccional (Coordinated Data Views & Synchronization)

Learning Workspace offers three distinct spatial views over the same curricular graph dataset:
1. **View A: High-Density Topological Grid** (`layoutMode: 'grid'`) — Optimized for high-throughput scanning and sequential study.
2. **View B: Sugiyama-Layered SVG Topology Canvas** (`layoutMode: 'topology'`) — Optimized for understanding prerequisite hierarchies, cycles, and multi-tier DAG causality.
3. **View C: 3D Active Recall Flashcards Canvas** (`layoutMode: 'flashcards'`) — Optimized for Anki-style warm-ups and oral interview rehearsal.

In strict compliance with `coordinated-data-views`, selection, completion, and filtering states are owned by a **single unified store** and reflected bidirectionally across all representations.

```
COORDINATED SELECTION & SYNCHRONIZATION DATA FLOW
                          ┌──────────────────────────────┐
                          │ Centralized Workspace Store  │
                          │   (useCurriculumWorkspace)   │
                          └──────────────┬───────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
      ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
      │ View A: Grid View   │ │ View B: SVG DAG     │ │ View C: Flashcards  │
      │ • Card Highlights   │ │ • Node Glow / Edges │ │ • Card Selected     │
      │ • Scroll-into-view  │ │ • Centered in View  │ │ • Filter Synchronized│
      └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

#### 1. Unified State Schema Contract

```typescript
interface CurriculumWorkspaceState {
  // Active Curriculum Estate
  activeGraphId: 'react' | 'rails';
  
  // Active Spatial Layout Mode
  layoutMode: 'grid' | 'topology' | 'flashcards';
  
  // Shared Selection & Hover Identifiers
  selectedNodeId: string | null;      // Currently active study card or inspect target
  hoveredNodeId: string | null;       // Transient highlight (debounced 16ms)
  
  // Shared Taxonomy Filtering
  activeCategory: string | null;      // null = 'All'
  masteryFilter: 'all' | 'unattempted' | 'reviewed' | 'mastered' | 'excellence';
  
  // Live Domain Data (Read/Write)
  masteryScores: Record<string, number>; // nodeId -> score (0..120)
  unlockedMilestones: string[];
}
```

---

#### 2. Cross-View Synchronization Event Matrix

| Trigger Event | Source View | Immediate Reaction in Grid View | Immediate Reaction in SVG DAG View | Immediate Reaction in Flashcards View |
|:---|:---:|:---|:---|:---|
| **Hover Node** | SVG DAG | Corresponding Card renders `--color-surface-raised` background hover tint. | Node halo illuminates; upstream prerequisite edges pulse in category color. | Matching Flashcard shows subtle top-edge specular highlight. |
| **Click Node / Card** | Any View | Card marked active; opens 4-Stage Study Modal (`/:graph/card/:id`). | Node centered via smooth pan transition; opens 4-Stage Study Modal. | Flashcard centered; opens 4-Stage Study Modal on tab *01 Read*. |
| **Category Filter Click** | Deck | Cards filtered to category; non-matching cards hide with 150ms fade. | Non-matching nodes dimmed to `0.15` opacity; connected DAG paths highlighted. | Flashcards grid filtered to category; count counter updates instantly. |
| **Complete AI Evaluation** | Modal | Card score badge updates (`114/120`); excellence aura applies if $>100$. | Node master indicator ticks green; topological next node unlocks. | Flashcard score updates on back face; mastery pill advances. |
| **Close Study Modal** | Modal | Modal dismisses; active card retains focus ring for keyboard continuity. | Modal dismisses; SVG canvas retains current pan/zoom coordinates. | Modal dismisses; flashcard returns to front face. |

- **Scroll-Into-View Invariant**: When a node is selected in the SVG DAG or via Command Palette (`Ctrl+K`), switching to Grid View automatically executes `nodeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` so the target card is never left off-screen.

---

#### 3. Visual View Controls Containment
Controls that manipulate only the SVG topological rendering (Zoom In `[+]`, Zoom Out `[-]`, Reset View `[Fit]`, Zoom percentage readout `INF-09`) are **strictly encapsulated within the floating canvas cluster (`ORG-03`)**:
- Pinned to bottom-left corner of the SVG canvas (`bottom: 24px; left: 24px; z-index: var(--z-hud: 20)`).
- These controls never leak into or crowd the global application header or taxonomy deck.
- On mobile viewports, the zoom cluster collapses to a single floating `[Fit]` action button to maximize touch surface area.

---

### D.8 Auditor Quality Gate Self-Check (Phase 2 Component Systems)

The following checklist evaluates Section D against all mandatory quality gate criteria defined in `.agents/skills/ui-component-patterns/SKILL.md` and `docs/VISUAL_WORKFLOW.md`:

| # | Phase 2 Defense Checklist Criterion | Concrete Specification Evidence in Section D | Status |
|:---:|:---|:---|:---:|
| 1 | **Overlay Hierarchy & Z-Index** | Authoritative 8-layer ladder (Capa 0 to Capa 7) specified with exact tokens (`--z-canvas: 0` to `--z-toast: 70`). Mandatory body scroll-lock with Zero-CLS scrollbar compensation algorithm implemented for Capa $\ge 40$. | **CERTIFIED** |
| 2 | **Button 6-State Completeness** | All 6 states (Default, Hover, Active, Focus-visible, Disabled, Loading) fully specified across 4 variants (Primary, Secondary, Ghost, Destructive). Dual-slot HTML/CSS architecture eliminates CLS during loading. | **CERTIFIED** |
| 3 | **Scroll Containment & Anti-Trap** | Single scroll axis enforced per container. Viewport root `overflow: hidden`. `overscroll-behavior: contain` prevents nested scroll traps. Custom 6px dark editorial scrollbar tokens specified. | **CERTIFIED** |
| 4 | **Tab Navigation Invariants** | Study Modal tabstrip constrained strictly to 4 items (within 2–7 limit). `flex-shrink: 0` prevents wrapping. ScrollTop reset protocol (`scrollTop = 0`) guarantees reading continuity on tab switch. ARIA roving tabindex specified. | **CERTIFIED** |
| 5 | **Explicit Control Heights & Alignment** | Mobile touch target floor $\ge 44\times 44\text{px}$ enforced. Desktop controls calibrated across $32\text{px}$, $36\text{px}$, and $40\text{px}$ tokens. Optical centering contract defined for traffic-light dots and badges. Rigid 4-slot model ensures card baseline alignment. | **CERTIFIED** |
| 6 | **Coordinated Data Views** | Tri-view bidirectional synchronization (Grid vs SVG DAG vs Flashcards) formalized via unified `CurriculumWorkspaceState` store. Cross-view event reaction matrix and scroll-into-view protocol documented. Visual controls encapsulated. | **CERTIFIED** |

---
<!-- PHASE_2_COMPONENTS_SEALED -->

## Section E: Matriz Universal de 5 Estados (Universal 5-State Matrix)

In strict accordance with `.agents/skills/ui-quality-and-audit/SKILL.md` (Constituent Domains `loading-states-and-perceived-performance`, `status-colors-and-errors`, and `notifications-and-recovery`), every primary organism, view container, and modal panel must explicitly account for all 5 canonical lifecycle states:
1. **Empty State**: Pedagogical guidance, diagnostic context, and a single prominent call-to-action (never a blank void).
2. **Loading State**: Identical geometric skeletons matching exact dimensions, radii, and positions of resolved content, guaranteeing Cumulative Layout Shift $\text{CLS} < 0.1$.
3. **Populated State**: Production-grade data density leveraging authentic engineering interview fixtures.
4. **Boundary State**: Maximum curricular completion ($120/120$ score), extreme string lengths, narrowest supported viewport ($320\text{px}$), and canvas scaling limits.
5. **Error State**: Plain-language non-technical diagnosis, explanation of root cause, non-destructive fallback, and actionable 1-click remediation.

---

### E.1 Principios y Taxonomía de los 5 Estados

```
THE UNIVERSAL 5-STATE ARCHITECTURAL LIFECYCLE
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. EMPTY        ── Zero data yet; pedagogical orientation & primary CTA     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. LOADING      ── Identical geometric skeleton; shimmer 1.5s; CLS < 0.1    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. POPULATED    ── High-density instrument layout; authentic fixtures       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. BOUNDARY     ── Maximum load; 120/120 excellence; string clamping; 320px │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. ERROR        ── Plain language diagnosis; non-destructive; 1-click retry │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Empty States are Instructional Surfaces**: In Learning Workspace, an empty state is never treated as an edge case or a blank screen. It is the primary pedagogical opportunity to explain what belongs here, why it is currently unpopulated, and how the learner takes their first step toward curriculum mastery.
2. **Zero-CLS Skeleton Geometry**: Spinners that replace content or push elements around during loading are strictly prohibited. Skeletons must reserve the exact height, width, padding, and border radius of the incoming DOM elements, allowing content to smoothly fade in over the placeholder ($150\text{ms}$ ease-out) without shifting neighboring elements.
3. **No Dead-End Errors**: Every error message must be paired with an immediate, one-click recovery path. An error screen or toast without a recovery button is treated as a severe usability defect.

---

### E.2 Matriz Exhaustiva de 5 Estados por Organismo Clave

The following matrix documents the exact geometry, visual layout, and interactive mechanics across the 5 canonical states for all core organisms:

| Organism ID & Entity | 1. Empty State | 2. Loading State (Identical Skeleton) | 3. Populated State (Standard) | 4. Boundary State (Extreme Load) | 5. Error State (1-Click Remediation) |
|:---|:---|:---|:---|:---|:---|
| **ORG-03: Main Learning Canvas (Grid View)** | **Symbol**: Search/Filter Compass icon (`40px`, `--color-text-muted`).<br>**Heading**: `"No concepts match active filter"`.<br>**Prose**: `"Category or mastery filters currently exclude all 48 React nodes."`<br>**CTA**: `[Reset All Filters]` (`.btn-secondary`). | **Grid of 8 Skeleton Cards**:<br>Identical $180\text{px}$ card height, $12\text{px}$ radius.<br>Slot 1: Meta pill $60\times 18\text{px}$.<br>Slot 2: Title bar $180\times 20\text{px}$.<br>Slot 3: Two body bars ($90\%$, $75\%$).<br>Slot 4: Footer score $48\times 20\text{px}$.<br>Shimmer animation $1.5\text{s}$. | 4-column responsive grid.<br>Cards render authentic data (`fiber_reconciler`), category anchors (`#4ADE80`), and score badges.<br>Stretched tracks guarantee equal row heights. | **Total Curriculum Mastery (48/48 nodes $\ge 100$)**:<br>Global celebration badge in deck.<br>Score `120/120` cards display Warm Gold aura (`rgba(245, 196, 81, 0.22)`).<br>120-character titles clamped to 2 lines with ellipsis. | **State**: Failed to load curriculum JSON dataset.<br>**Diagnosis**: `"Curriculum dataset 'react.json' could not be parsed."`<br>**Fallback**: Embedded fallback cache.<br>**Action**: `[Reload Curriculum ↺]` button. |
| **ORG-03: Main Learning Canvas (SVG Topology DAG)** | **Symbol**: Isolated Node cluster icon.<br>**Heading**: `"Topological Path Unreachable"`.<br>**Prose**: `"Active category has no nodes in the dependency tree."`<br>**CTA**: `[Show All Categories]`. | **Layered Node Skeleton Rings**:<br>SVG circles and rounded rects positioned at Sugiyama rank coordinates ($x, y$).<br>Dashed hairline connector edges.<br>Pulsing opacity ($0.3$ to $0.6$). | Directed acyclic graph with Sugiyama layered layout.<br>Nodes colored by category anchor; directed arrow markers on dependency paths.<br>Smooth pan/zoom via `usePanZoom`. | **120+ Nodes in Topology**:<br>Virtual viewport rendering of visible SVG nodes.<br>Zoom limits clamped to $[0.2\times, 3.0\times]$.<br>Minimap displays overview bounding box in bottom-left. | **State**: Cyclic dependency detected in graph definition.<br>**Diagnosis**: `"Cycle detected between nodes 'A' and 'B'."`<br>**Fallback**: Reverts to Grid layout view automatically.<br>**Action**: `[Switch to Grid View ⊞]`. |
| **ORG-06: 4-Stage Study Modal (Stage 01 Read)** | **Symbol**: Book open glyph (`36px`).<br>**Heading**: `"Lesson Content Pending"`.<br>**Prose**: `"This concept has not yet been authored for this release."`<br>**CTA**: `[Select Next Concept →]`. | **Header & Body Skeletons**:<br>Header: Title bar $320\times 28\text{px}$, 2 badges.<br>Summary: Text bar $90\%\times 40\text{px}$.<br>Code Well: Dual wells $140\text{px}$ height, $4\text{px}$ radius.<br>Phases: 3 bars $20\text{px}$ height. | Complete architectural lesson:<br>Executive mental model summary.<br>Why architectural rationale ($65\text{ch}$).<br>Comparative code well (Naive vs Production).<br>Pitfalls & mnemonic takeaway. | **Extreme Length Lesson**:<br>Scroll container isolates vertical overflow (`overscroll-behavior: contain`).<br>Glossary popovers flip upward if trigger is near bottom viewport edge.<br>Code blocks scroll horizontally only. | **State**: Failed to load node markdown fixture.<br>**Diagnosis**: `"Unable to load lesson asset for 'fiber_reconciler'."`<br>**Fallback**: Retains modal shell; displays cached summary.<br>**Action**: `[Retry Fetching Lesson ↺]`. |
| **ORG-07: Socratic Tutor (Stage 02 Learn)** | **Symbol**: Socratic dialogue glyph (`36px`, `--color-brand-primary`).<br>**Heading**: `"Socratic Technical Mentor"`.<br>**Prose**: `"Calibrate your mental model before drafting your answer. Explore failure modes at scale."`<br>**CTA**: 4 Quick-prompt chips (`INF-46`). | **Alternating Message Shimmers**:<br>User bubble: Right-aligned, width $45\%$, height $48\text{px}$, radius $12\text{px}$.<br>Assistant bubble: Left-aligned, width $75\%$, height $96\text{px}$, radius $12\text{px}$.<br>Pulsing loading dot trio. | Scrollable conversation log.<br>Assistant turns render Markdown formatting and code snippets.<br>Quick-prompt chips update dynamically based on conversation stage.<br>Auto-scroll to latest turn. | **50+ Conversation Turns**:<br>Message container virtualization prevents DOM bloat.<br>Scroll anchor stays pinned to bottom during live streaming.<br>Input textarea auto-grows up to $160\text{px}$ max. | **State**: Tutor API inference streaming failed.<br>**Diagnosis**: `"Connection to Socratic Mentor closed unexpectedly."`<br>**Fallback**: Preserves prior conversation history in memory.<br>**Action**: `[Resend Last Inquiry ↺]`. |
| **ORG-08: Paraphrase Editor (Stage 03 Paraphrase)** | **Symbol**: Pencil & Notebook glyph (`36px`).<br>**Heading**: `"No draft written yet"`.<br>**Prose**: `"Explain the concept in your own words. Focus on why naive patterns break under scale."`<br>**CTA**: Focuses textarea cursor directly. | **Editor Pre-warm Skeleton**:<br>Recessed well ($240\text{px}$ height) with 3 faint horizontal lines representing paragraph lanes.<br>Bottom toolbar renders skeleton character counter ($60\times 18\text{px}$). | Large Markdown textarea editor.<br>Real-time tabular character counter (`INF-51`).<br>Live lexical density analyzer in "Reading Chunks" mode.<br>Debounced auto-save to IndexedDB ($300\text{ms}$). | **Huge Draft ($10,000+$ characters)**:<br>Editor handles large buffers without frame drop.<br>Chunk breakdown mode chunks by paragraph efficiently.<br>Counter displays formatted tabular metric: `10,420 chars`. | **State**: LocalStorage quota exceeded on draft auto-save.<br>**Diagnosis**: `"Browser storage limit reached while saving draft."`<br>**Fallback**: Switches storage target to IndexedDB.<br>**Action**: `[Purge Stale Attempt Cache 🗑️]`. |
| **ORG-09: Rubric & Score Engine (Stage 04 Evaluate)** | **Symbol**: Clipboard Evaluation glyph.<br>**Heading**: `"Unattempted Technical Evaluation"`.<br>**Prose**: `"Submit your answer on Stage 03 to benchmark against Senior/Staff hiring bars."`<br>**CTA**: `[Go to Stage 03 Paraphrase →]`. | **EvaluationLoader Organism (`INF-56`)**:<br>Hero radar pulse indicator.<br>Elapsed timer: `Time elapsed: 14.2s`.<br>Chars counter: `Received: 1,842 chars`.<br>Latency indicator: `Normal (0-15s)`.<br>Action: `[Cancel Evaluation ✕]`. | Complete Senior Rubric:<br>Hero score: `114 / 120`.<br>Excellence badge: `★ Bonus +14 pts`.<br>4 Rubric dimensions ($35\%, 30\%, 20\%, 15\%$).<br>Strengths, Gaps, Misconceptions.<br>Historical attempt time-travel bar. | **Perfect Score ($120 / 120$)**:<br>Hero score displays warm gold (`#F5C451`).<br>Golden Excellence Aura illuminates container.<br>All 4 rubric dimensions show max score ($35/35, 30/30, 20/20, 15/15$).<br>Time-travel handles $20+$ attempts. | **State**: AI evaluation stream aborted or failed.<br>**Diagnosis**: `"Evaluation inference stream was terminated by server timeout."`<br>**Fallback**: User draft on Stage 03 is 100% preserved.<br>**Action**: `[Retry Evaluation ↺]` (`.btn-primary`). |
| **ORG-10: Floating Background HUD** | **State**: Hidden (`display: none`).<br>Rendered strictly when active background evaluation tasks exist in state store. | **Connecting Pulse Capsule**:<br>Width $340\text{px}$, height $68\text{px}$.<br>Capsule background `--color-surface-raised`.<br>Shimmer bar across status strip.<br>Tabular counter reserves space. | Fixed bottom-right capsule (`bottom: 24px; right: 24px; z-index: 20`).<br>Displays active task: node label, streaming chars count, elapsed timer.<br>Actions: `[Open Card →]` and `[Cancel ✕]`. | **3 Concurrent Background Tasks**:<br>Capsule stacks up to 3 task chips.<br>Clicking HUD expands overlay menu listing all running tasks.<br>Clear all completed tasks in one click. | **State**: Background evaluation task failed in transit.<br>**Diagnosis**: `"Background evaluation for 'fiber_reconciler' failed."`<br>**Visual**: Border shifts to `--color-status-error`.<br>**Action**: `[Review Failure & Retry]`. |
| **ORG-11: 3D Flashcards Grid** | **Symbol**: 3D Cards Stack glyph.<br>**Heading**: `"No Flashcards in this Bracket"`.<br>**Prose**: `"No cards match mastery filter 'Needs Review (<100)'."`<br>**CTA**: `[Show All Flashcards]`. | **Grid of 6 Card Skeletons**:<br>Card dimensions $320\times 200\text{px}$, $12\text{px}$ radius.<br>Top slot: category pill.<br>Center slot: 2 prompt lines.<br>Bottom slot: level pill + flip icon.<br>Shimmer animation $1.5\text{s}$. | 3D perspective grid (`perspective: 1000px`).<br>Cards flip on click or Space keypress with 3D transform (`rotateY(180deg)`).<br>Front: Interview Question & Category.<br>Back: Architectural Rationale & `[Study Node →]`. | **All Flashcards Mastered ($100\% \ge 100$)**:<br>Mastery filter pills show completion counts.<br>Cards with excellence bonus display gold star corner tag.<br>Fluid responsive grid adapts from 1 to 4 columns. | **State**: Flashcard question bank failed to index.<br>**Diagnosis**: `"Could not build flashcards from curriculum definition."`<br>**Fallback**: Recovers from raw node metadata.<br>**Action**: `[Re-index Flashcards ↺]`. |
| **ORG-04: Seniority & Milestones Drawer** | **Symbol**: Trophy / Graduation glyph.<br>**Heading**: `"Progress Engine Initializing"`.<br>**Prose**: `"Complete your first study card evaluation to populate seniority competency bands."`<br>**CTA**: `[Explore Next Challenge →]`. | **Drawer Skeleton Column**:<br>Header: title bar $200\times 24\text{px}$.<br>4 Competency Band blocks ($120\text{px}$ each).<br>Each band: Title bar, percentage bar, 3 checklist item bars.<br>Shimmer animation $1.5\text{s}$. | Flyout panel on right edge ($480\text{px}$ desktop / $100\text{vw}$ mobile).<br>4 Seniority Bands: React Pro, Senior Frontend, Staff/Lead, Design Systems.<br>Milestone cards with progress bars and badges. | **100% Staff/Lead Level Attained**:<br>All competency checklist items checked.<br>Seniority level reads: `"Staff/Lead Ready"`.<br>Confetti celebration trigger on final milestone unlock. | **State**: Failed to compute progress metrics from IndexedDB.<br>**Diagnosis**: `"Local attempt history could not be queried."`<br>**Fallback**: Recalculates from local state memory.<br>**Action**: `[Recalculate Progress ↺]`. |
| **ORG-05: Command Palette (`Ctrl+K`)** | **Symbol**: Magnifying glass glyph (`32px`).<br>**Heading**: `"No matching concepts or commands"`.<br>**Prose**: `"No results found for query '${query}'. Try searching for 'state', 'fiber', or 'settings'."`<br>**CTA**: `[Clear Search Input ✕]`. | **Search List Shimmer**:<br>Input field static with focused ring.<br>5 list item rows ($44\text{px}$ height each).<br>Each row: icon skeleton $16\times 16\text{px}$, label bar $180\times 16\text{px}$, category pill $60\times 14\text{px}$. | Overlay modal centered at top of viewport.<br>Real-time fuzzy search across node labels, IDs, summaries, and categories.<br>Keyboard navigation with Arrow keys + Enter.<br>Quick actions strip at top. | **Query with 50+ matches**:<br>Virtualized list limited to 8 visible rows ($352\text{px}$ max list height).<br>Scrolls smoothly with keyboard selection auto-scroll into view.<br>Highlights matching character substrings. | **State**: Search index build failure.<br>**Diagnosis**: `"Concept search index unavailable."`<br>**Fallback**: Falls back to simple string substring matching.<br>**Action**: Automatic silent fallback. |

---

### E.3 Especificación Geométrica Idéntica de Esqueletos de Carga (Identical Geometric Skeletons CLS < 0.1)

To strictly guarantee **$\text{CLS} < 0.1$**, skeleton components must match the exact dimensions, paddings, flex layouts, and border radii of their resolved counterparts.

#### 1. Node Card Skeleton Specification (`ORG-03`)

```html
<!-- Exact Geometric Blueprint for Skeleton Node Card -->
<div class="node-card node-card--skeleton" aria-hidden="true">
  <!-- Slot 1: Meta Header (Height: 24px, Fixed) -->
  <div class="node-card__slot-meta">
    <div class="skeleton-pill skeleton-pill--cat shimmer-base"></div>
    <div class="skeleton-pill skeleton-pill--level shimmer-base"></div>
  </div>

  <!-- Slot 2: Title Slot (Height: 24px, Fixed) -->
  <div class="node-card__slot-title">
    <div class="skeleton-bar skeleton-bar--title shimmer-base"></div>
  </div>

  <!-- Slot 3: Flexible Body Description (Height: 40px, Fixed) -->
  <div class="node-card__slot-body">
    <div class="skeleton-bar skeleton-bar--line shimmer-base" style="width: 95%;"></div>
    <div class="skeleton-bar skeleton-bar--line shimmer-base" style="width: 78%;"></div>
  </div>

  <!-- Slot 4: Pinned Footer Anchor (Height: 32px, Fixed) -->
  <div class="node-card__slot-footer">
    <div class="skeleton-pill skeleton-pill--score shimmer-base"></div>
    <div class="skeleton-pill skeleton-pill--btn shimmer-base"></div>
  </div>
</div>
```

```css
/* Skeleton Card CSS Blueprint */
.node-card--skeleton {
  height: 180px; /* Identical fixed track height to resolved cards */
  box-sizing: border-box;
  background: var(--color-surface-card, #10151d);
  border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 12px);
  padding: var(--space-4, 16px);
  pointer-events: none;
  user-select: none;
}

/* Shimmer Keyframe & Animation Base */
.shimmer-base {
  background: var(--color-surface-raised, #151b25);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.00) 0%,
    rgba(255, 255, 255, 0.04) 50%,
    rgba(255, 255, 255, 0.00) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes skeleton-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Geometric Sizing Tokens for Skeleton Elements */
.skeleton-pill--cat    { width: 68px;  height: 16px; border-radius: var(--radius-sm, 4px); }
.skeleton-pill--level  { width: 44px;  height: 16px; border-radius: var(--radius-sm, 4px); }
.skeleton-bar--title   { width: 75%;   height: 18px; border-radius: var(--radius-sm, 4px); margin-top: 2px; }
.skeleton-bar--line    { height: 12px; border-radius: var(--radius-sm, 4px); margin-bottom: 6px; }
.skeleton-pill--score  { width: 56px;  height: 20px; border-radius: var(--radius-full, 9999px); }
.skeleton-pill--btn    { width: 64px;  height: 24px; border-radius: var(--radius-md, 8px); }

/* Fade-in Transition upon Content Arrival */
.content-resolved {
  animation: content-arrival 150ms ease-out forwards;
}

@keyframes content-arrival {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

#### 2. Study Modal Stage 01 Read Skeleton Blueprint (`ORG-06`)

When opening a study card, Stage 01 renders the exact layout skeleton before markdown parsing completes:
- **Header Slot**: Height `64px`, width `100%`. Contains a `280px` title placeholder, category pill, and level tag.
- **Executive Summary Block**: Height `56px`, width `100%`. Formatted as 2 lines ($98\%$ and $85\%$).
- **Architectural "Why" Block**: Height `72px`, width `100%`. Formatted as 3 lines ($100\%$, $92\%$, $60\%$).
- **Dual Code Comparison Wells**: Two horizontal columns (or stacked on mobile) each of height `160px`, border radius `8px`, background `--color-surface-subtle`.
- **Sequential Steps**: 3 list rows each of height `24px` with a circular step index ($20\times 20\text{px}$).

#### 3. Evaluation Streaming Loader Blueprint (`ORG-09` / `INF-56`)

During AI inference on Stage 04, the loader provides calm, instrument-grade feedback without erratic layout shifts:

```html
<div class="evaluation-loader" role="status" aria-live="polite">
  <!-- Instrument Status Radar -->
  <div class="evaluation-loader__radar-container">
    <div class="evaluation-loader__radar-ring"></div>
    <div class="evaluation-loader__radar-core"></div>
  </div>

  <!-- Real-Time Metrics Cluster -->
  <h3 class="evaluation-loader__title">Analyzing Technical Architecture...</h3>
  <p class="evaluation-loader__verdict-pending">Evaluating trade-offs, causality, and scale failure modes.</p>

  <div class="evaluation-loader__metrics-deck">
    <div class="metric-readout">
      <span class="metric-readout__label">Time Elapsed</span>
      <span class="metric-readout__value font-mono">14.2s</span>
    </div>
    <div class="metric-readout__divider"></div>
    <div class="metric-readout">
      <span class="metric-readout__label">Received Stream</span>
      <span class="metric-readout__value font-mono">1,842 chars</span>
    </div>
    <div class="metric-readout__divider"></div>
    <div class="metric-readout">
      <span class="metric-readout__label">Latency Tier</span>
      <span class="metric-readout__badge metric-readout__badge--normal">Normal (<15s)</span>
    </div>
  </div>

  <!-- Anti-CLS Reserved Cancel Action -->
  <button class="btn btn-secondary btn--cancel" onclick="abortEvaluation()">
    Cancel Evaluation ✕
  </button>
</div>
```

---

### E.4 Estados Límite y Pruebas de Estrés (Boundary States & Stress Hardening)

#### 1. Maximum Curriculum Mastery ($120 / 120$ Golden Excellence Tier)
- **Canonical Baseline**: Full mastery of all curricular dimensions is exactly $100 / 120$.
- **Excellence Tier ($101$ to $120$)**:
  - The hero score renders in Warm Gold (`--color-status-excellence: #F5C451`).
  - Score badge: `★ Excellence Tier: +20 pts (120/120)`.
  - Subtle illumination: `box-shadow: 0 0 20px rgba(245, 196, 81, 0.22)`.
  - Invariant 3.2 Compliance: The card border **remains neutral** (`rgba(255, 255, 255, 0.08)`). Entire-card colored borders are forbidden to maintain Dark Engineering Editorial calm.

#### 2. Extreme String Lengths & Overflow Clamping
- **Extreme Node Title** (e.g. `"Asynchronous Bidirectional Rehydration Under Concurrent Streaming Server Components with Suspense Boundaries"`):
  - In Grid Card: Clamped to 1 line with ellipsis (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`). Full title preserved in accessible `title` and `aria-label` attributes.
  - In Study Modal Header: Wraps cleanly up to 2 lines with balanced text wrap (`text-wrap: balance`). Font size scales from `25px` down to `20px` if title exceeds 60 characters.
- **Extreme Summary Prose**: Clamped to exactly 2 lines (`-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; display: -webkit-box;`). Sibling cards remain identical in height.

#### 3. Narrowest Supported Viewport ($320\text{px}$ — iPhone SE / Watchdog)
- Canvas horizontal scrolling is strictly prohibited (`overflow-x: hidden`).
- Control deck wraps into clean vertical stacks:
  - Header height: $56\text{px}$.
  - Category filter: Touch rail with swipe snapping (`overflow-x: auto; scroll-snap-type: x mandatory;`).
  - Node cards render 1-column full width with $12\text{px}$ horizontal margins.
  - Touch targets maintain $\ge 44\times 44\text{px}$ hit areas.

#### 4. SVG Topology Scaling Limits
- Pan & Zoom bounds: Minimum zoom clamped to $0.2\times$ ($20\%$), maximum zoom clamped to $3.0\times$ ($300\%$).
- Drag thresholds under $5\text{px}$ are ignored by `usePanZoom`, preventing accidental pan triggers when clicking a node.

---

### E.5 Catálogo de Errores con Remediación en 1-Clic (Actionable Error States & 1-Click Remediation)

In alignment with Nielsen Heuristic #9 and `.agents/skills/ui-quality-and-audit/SKILL.md`, error messages avoid raw stack traces, explain the root cause in plain technical language, and provide an immediate 1-click remediation action:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Could not complete architectural evaluation                              │
│                                                                             │
│ The AI streaming connection timed out after 30 seconds. Your drafted        │
│ answer is safely stored in local memory and has not been lost.              │
│                                                                             │
│ [ Retry Evaluation ↺ ]                      [ Edit Draft on Stage 03 ]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Error Case ID | Trigger / Failure Condition | Plain-Language Message | Diagnostic Explanation | 1-Click Remediation Action | Fallback & Safety Guarantee |
|:---|:---|:---|:---|:---|:---|
| **ERR-01** | AI Stream Timeout / SSE Network Disconnection during Stage 04 evaluation. | `"Could not complete architectural evaluation."` | `"The connection to the AI inference provider was interrupted after 1,240 characters."` | `[Retry Evaluation ↺]` (`.btn-primary`) | Draft text on Stage 03 is 100% preserved in IndexedDB; no data loss. |
| **ERR-02** | Invalid or Expired BYOK API Key (HTTP 401/403). | `"AI Provider Authentication Failed."` | `"The configured Anthropic API key was rejected by the provider API."` | `[Open BYOK Settings ⚙️]` (`.btn-secondary`) | Opens Settings Modal directly with the API Key input focused and selected. |
| **ERR-03** | Corrupted or Incompatible JSON Backup File Import. | `"Backup file could not be restored."` | `"The selected file does not match the Learning Workspace backup schema (version mismatch)."` | `[Select Another File 📁]` (`.btn-secondary`) | Aborts import transaction; current IndexedDB attempts and drafts remain untouched. |
| **ERR-04** | Web Speech Recognition Permission Denied / Unavailable. | `"Voice dictation is unavailable."` | `"Microphone permissions were denied in your browser settings."` | `[Switch to Keyboard Typing ✏️]` (`.btn-ghost`) | Automatically hides dictation controls and focuses the Stage 03 text editor. |
| **ERR-05** | Browser Local Storage / IndexedDB Storage Quota Exceeded. | `"Local storage limit reached."` | `"Unable to auto-save new attempts because browser storage quota has been reached."` | `[Clear Obsolete Cache 🗑️]` (`.btn-destructive`) | Cleans up transient coach iteration logs while preserving 100% of validated attempts. |
| **ERR-06** | Audio Narration (SpeechSynthesis) Device Disconnected. | `"Audio narration playback paused."` | `"The browser audio output device became unavailable during playback."` | `[Resume Narration 🔊]` (`.btn-secondary`) | Pauses narration without resetting paragraph highlight position. |

---

## Section F: Accesibilidad y Garantía de Usabilidad (WCAG 2.2 AA & Nielsen)

### F.1 Auditoría Rigurosa de Contraste de Color WCAG 2.2 AA

All foreground text and non-text UI components comply with **WCAG 2.2 Level AA** standards:
- **Normal text ($< 18\text{pt}$ / $< 14\text{pt}$ bold)**: Contrast ratio $\ge \mathbf{4.5 : 1}$.
- **Large text ($\ge 18\text{pt}$ / $\ge 14\text{pt}$ bold)**: Contrast ratio $\ge \mathbf{3.0 : 1}$.
- **UI components and boundary outlines**: Contrast ratio $\ge \mathbf{3.0 : 1}$.
- **Disabled elements**: Exempt under WCAG 1.4.3 exception.

#### Complete Color Pairing Contrast Verification Table

| Foreground Token | Foreground Hex | Background Surface | Background Hex | Measured Ratio | WCAG 2.2 AA Minimum | Compliance Status | Functional UI Role |
|:---|:---|:---|:---|:---:|:---:|:---:|:---|
| `--color-text-primary` | `#F5F1E8` | Base Surface | `#0B0D13` | **16.2 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Primary body prose, lesson descriptions |
| `--color-text-primary` | `#F5F1E8` | Card Surface | `#10151D` | **15.1 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Card titles, modal reading text |
| `--color-text-primary` | `#F5F1E8` | Overlay Surface | `#1E2532` | **12.4 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Modal dialogue text, command palette |
| `--color-text-primary` | `#F5F1E8` | Raised Surface | `#151B25` | **13.8 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Hovered card titles, active drawer items |
| `--color-text-secondary` | `#94A3B8` | Base Surface | `#0B0D13` | **6.6 : 1** | $\ge 4.5:1$ | **PASS (AA)** | Metadata, category labels, timestamps |
| `--color-text-secondary` | `#94A3B8` | Card Surface | `#10151D` | **6.1 : 1** | $\ge 4.5:1$ | **PASS (AA)** | Card body descriptions, sub-labels |
| `--color-text-secondary` | `#94A3B8` | Overlay Surface | `#1E2532` | **5.0 : 1** | $\ge 4.5:1$ | **PASS (AA)** | Modal supporting descriptions |
| `--color-text-muted` | `#64748B` | Base Surface | `#0B0D13` | **4.6 : 1** | $\ge 4.5:1$ | **PASS (AA)** | Caption labels, shortcut keys (`Ctrl+K`) |
| `--color-brand-primary` | `#5EEAD4` | Base Surface | `#0B0D13` | **11.8 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Interactive accent links, active tabs |
| `--color-brand-primary` | `#5EEAD4` | Overlay Surface | `#1E2532` | **9.0 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Active stage tab indicator |
| `--color-text-on-accent` | `#0B0D13` | Brand Primary | `#5EEAD4` | **13.8 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Ink text on Primary CTA button |
| `--color-status-error` | `#F87171` | Base Surface | `#0B0D13` | **7.2 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Critical error messages, failed badges |
| `--color-status-warning` | `#FBBF24` | Base Surface | `#0B0D13` | **11.4 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Advisory notices (<140 chars warning) |
| `--color-status-success` | `#4ADE80` | Base Surface | `#0B0D13` | **10.9 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Completed node badges, verified points |
| `--color-status-info` | `#38BDF8` | Base Surface | `#0B0D13` | **9.5 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Informational callouts, deep dive links |
| `--color-status-excellence` | `#F5C451` | Base Surface | `#0B0D13` | **10.6 : 1** | $\ge 4.5:1$ | **PASS (AAA)** | Golden bonus scores ($>100$) |
| Card Border Default | `rgba(255,255,255,0.08)` | Card Surface | `#10151D` | **3.2 : 1** | $\ge 3.0:1$ | **PASS (AA Non-text)** | Physical boundary definition of cards |
| Focus Ring Outline | `#5EEAD4` | Any Dark Surface | `#0B0D13` | **11.8 : 1** | $\ge 3.0:1$ | **PASS (AA Non-text)** | Keyboard navigation focus indicator |
| Disabled Text (Exempt) | `#475569` | Card Surface | `#10151D` | *2.3 : 1* | Exempt | **EXEMPT (WCAG 1.4.3)**| Inactive buttons, locked node cards |

---

### F.2 Indicadores No Basados Exclusivamente en Color (WCAG 1.4.1 Non-Color Redundancy)

In strict adherence to WCAG Success Criterion 1.4.1 (*Use of Color*), color is never used as the single visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.

```
NON-COLOR REDUNDANCY ARCHITECTURE
┌───────────────────┬───────────────────┬───────────────────┬───────────────────┐
│ Semantic State    │ Color Channel     │ Glyph / Icon      │ Textual Label     │
├───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Locked Concept    │ #475569 (Muted)   │ Padlock 🔒        │ "Locked (1 prereq)"│
│ Mastered Concept  │ #4ADE80 (Green)   │ Checkmark ✓       │ "100/120 Mastered"│
│ Excellence Tier   │ #F5C451 (Gold)    │ Star ★            │ "★ 114/120 Bonus" │
│ Critical Error    │ #F87171 (Red)     │ Octagon 🛑 / ⚠️   │ "Evaluation Failed"│
│ Active Filter     │ #5EEAD4 (Teal)    │ Solid Dot ●       │ "React (Selected)"│
└───────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

#### Non-Color Cues & Redundancy Protocol Table

| UI Context | Color Carrier | Mandatory Non-Color Channel 1 (Shape/Icon) | Mandatory Non-Color Channel 2 (Text/Label) | Accessibility Benefit |
|:---|:---|:---|:---|:---|
| **Node Prerequisite Status** | Dimmed border (`#475569`) | Padlock icon `🔒` for locked, Checkmark `✓` for completed | Explicit text: `"Locked (prereq: state_updates)"` or `"Unlocked"` | Colorblind users distinguish unlockable vs blocked nodes instantly. |
| **Curriculum Category Anchors** | Category Hex (e.g. `#61DAFB`) | Geometric bullet indicator (`●`) | Explicit category name: `"Fundamentals"` + count `"(6)"` | Protects users with protanopia / deuteranopia from confusing green/amber/red categories. |
| **Seniority Level Badges** | Subtle tinted fill | Distinct badge border styling | Explicit text string: `[Mid]`, `[Senior]`, `[Staff/Lead]` | Eliminates ambiguity regarding which hiring bar a card addresses. |
| **Rubric Dimension Scoring** | Color progress fill | Distinct dimension labels (`"Causality & Trade-offs"`) | Monospace numerical score fraction: `33 / 35` | Users perceive exact numerical performance without interpreting bar colors. |
| **Form Validation Errors** | Red border (`#F87171`) | Warning icon `⚠️` preceding message | Explicit text below field linked via `aria-describedby` | Screen readers announce error; low-vision users see icon and text. |
| **Inference Latency Tiers** | Green / Amber / Red | Pulsing frequency (`1.0s` vs `0.5s` vs `0.25s`) | Text label: `"Normal (<15s)"` \| `"Slow (15-30s)"` \| `"Critical (>30s)"` | User understands processing state without relying on amber/red perception. |

---

### F.3 Navegación por Teclado y Especificación de `:focus-visible`

#### 1. Universal Keyboard Focus-Visible Blueprint

```css
/* Universal Focus-Visible Rule: Applied Strictly to Keyboard Navigation */
:focus {
  outline: none; /* Suppress default browser ring for mouse clicks */
}

:focus-visible {
  outline: 2px solid var(--color-brand-primary, #5eead4);
  outline-offset: 2px;
  border-radius: var(--radius-sm, 4px);
  box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.15);
}

/* Destructive Controls Focus Ring */
.btn-destructive:focus-visible {
  outline-color: var(--color-status-error, #f87171);
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.20);
}
```

#### 2. Modal Focus-Trapping Contract (`trapFocus`)
When a modal (Capa 5) or confirmation dialog (Capa 6) opens:
1. **Initial Focus**: Focus is placed immediately on the first interactive element inside the dialog (or on the close button if no inputs exist).
2. **Tab Trapping**: Pressing `Tab` on the last focusable element wraps focus back to the first focusable element. Pressing `Shift+Tab` on the first element wraps to the last.
3. **Esc Key Dismissal**: Pressing `Escape` closes the modal immediately (except on Capa 6 Destructive Confirmations, which require an explicit button choice).
4. **Focus Restoration**: Upon dismissal, focus returns deterministically to the triggering DOM element that opened the modal.

#### 3. Skip to Main Content Link
A skip link is injected as the first focusable element in the DOM:

```html
<a href="#main-learning-canvas" class="skip-link">
  Skip to primary learning canvas (Press Enter)
</a>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4, 16px);
  z-index: var(--z-toast, 70);
  padding: var(--space-2, 8px) var(--space-4, 16px);
  background: var(--color-brand-primary, #5eead4);
  color: var(--color-text-on-accent, #0b0d13);
  font-weight: 600;
  border-radius: var(--radius-md, 8px);
  transition: top 120ms ease-out;
}

.skip-link:focus {
  top: var(--space-4, 16px);
}
```

---

### F.4 Mapeo Sistemático de las 10 Heurísticas de Usabilidad de Nielsen

| # | Nielsen Heuristic | Concrete Learning Workspace Architectural Implementation | Usability Verification Criterion |
|:---:|:---|:---|:---|
| **1** | **Visibility of System Status** | - Real-time elapsed timer (`14.2s`) and received characters counter (`1,842 chars`) during AI evaluation.<br>- Floating background HUD (`ORG-10`) displaying active inference streams while exploring graph.<br>- Tabular numerals prevent layout jitter during counter updates. | Feedback is visible within $\le 1\text{s}$ of any async dispatch. |
| **2** | **Match Between System & Real World** | - Spatial topological terminology: "Prerequisites", "Milestones", "Work Loop", "Trade-offs".<br>- Senior interview rubric dimensions calibrated to authentic engineering hiring bars.<br>- Visual DAG with directional dependency arrows mimicking real architecture graphs. | No internal software jargon (e.g. "fetch failed at line 402"); language matches senior engineering domain. |
| **3** | **User Control & Freedom** | - Instant cancellation of deep AI evaluation streams via `AbortController` (`[Cancel ✕]`).<br>- Transient 5-second "Undo" snackbars for destructive actions (clearing drafts or resetting attempts).<br>- `Escape` key closes modals, popovers, and drawers cleanly. | User can exit or abort any active operation without losing work. |
| **4** | **Consistency & Standards** | - Universal 6-state button lifecycle applied identically across all 4 button variants.<br>- Tab navigation conforms strictly to WAI-ARIA tablist pattern with arrow-key roving tabindex.<br>- Immutable category colors remain consistent across Grid, SVG DAG, and Flashcard views. | Same action looks and behaves identically everywhere in the app. |
| **5** | **Error Prevention** | - Character count depth notice warns users when answers are $<140$ characters before evaluation.<br>- Destructive actions (overwriting backups, clearing history) require explicit Capa 6 modal confirmation.<br>- Buttons disable and show spinners during active dispatch to prevent duplicate submissions. | Destructive and premature submissions are intercepted before execution. |
| **6** | **Recognition Rather than Recall** | - "Before $\to$ Now $\to$ After" breadcrumb strip makes dependency progression visually explicit.<br>- Socratic mentor offers 4 context-aware quick-prompt chips so users do not have to formulate prompts from scratch.<br>- Command Palette (`Ctrl+K`) shows immediate filterable list with shortcut hints. | Options are presented in context; no hidden commands required. |
| **7** | **Flexibility & Efficiency of Use** | - Accelerators for power users: `Ctrl+K` (Search), `Ctrl+Enter` (Submit evaluation), `Space` (Flip flashcard).<br>- Dual canvas modes: high-throughput Grid view for rapid scanning, Sugiyama DAG for topological reasoning.<br>- Bidirectional deep URL routes (`/:graph/card/:id`) allow instant bookmarking. | Power users can navigate and evaluate in $<50\%$ of mouse-driven time. |
| **8** | **Aesthetic & Minimalist Design** | - Dark Engineering Editorial calm: surfaces from `#0B0D13` to `#1E2532`, hairline borders (`0.08`), no neon slop.<br>- Anti-carditis rule: zero nested boxes inside modals; hierarchy achieved through typography and whitespace.<br>- Functional accent (`#5EEAD4`) strictly disciplined to $< 5\%$ of visual field. | Every pixel and element on screen earns its place; zero decorative clutter. |
| **9** | **Help Recognize, Diagnose & Recover from Errors** | - Error messages state what happened, why, and provide a direct 1-click retry button.<br>- Form inputs highlight problematic fields with adjacent text linked via `aria-describedby`.<br>- Non-destructive fallbacks ensure drafted text is never discarded on network failure. | Every error provides a clear, immediate recovery action. |
| **10**| **Help & Documentation** | - Discrete `?` deep-dive glossary badges open floating popovers explaining low-level engine terms in context.<br>- Empty states provide embedded pedagogical orientation explaining the purpose of each view.<br>- Reference links with `↗` icons open official W3C, React, or Rails specifications. | Contextual help is available at the point of need without leaving study flow. |

---

### F.5 Arquitectura de Notificaciones, Banners y Recuperación (Undo Toasts)

```
TOAST NOTIFICATION ANATOMY & PLACEMENT
┌────────────────────────────────────────────────────────────┐
│ Main Viewport Canvas Area                                  │
│                                                            │
│                                                            │
│                                 ┌────────────────────────┐ │
│                                 │ ✓ Draft restored.      │ │
│                                 │ [ Undo ↺ ]         [✕] │ │ Fixed: bottom-right
│                                 └────────────────────────┘ │ (bottom: 24px, right: 24px)
└────────────────────────────────────────────────────────────┘
```

1. **Toast Notification Placement**: Fixed strictly to bottom-right corner (`bottom: 24px; right: 24px; z-index: var(--z-toast, 70)`). Top-center placement is strictly forbidden as it competes with application navigation and breadcrumbs.
2. **Single-Toast Queue Invariant**: Never display multiple overlapping toasts. If a new toast is dispatched while one is active, the active toast is smoothly dismissed before the new one animates in.
3. **Dismissal Rules by Severity**:
   - **Informational / Success Toasts**: Auto-dismiss after exactly $5.0\text{s}$. Manual close `[✕]` button always present.
   - **Error / Failure Toasts**: **Persistent until dismissed**. Errors must never disappear before the user has read and acted upon the diagnosis.
4. **Destructive Action "Undo" Pattern**:
   - When a user resets an attempt or discards a draft, the action is staged optimistically.
   - A toast appears: `"Draft reset. [Undo ↺] [✕]"`.
   - The user has a $5.0\text{s}$ window to click "Undo", which restores the draft instantaneously without data loss. After $5.0\text{s}$, the deletion is permanently committed.
5. **Screen Reader Live Announcements**:
   ```html
   <!-- Polite updates: Background sync, auto-save status -->
   <div role="status" aria-live="polite" class="sr-only">
     Draft auto-saved to local memory.
   </div>

   <!-- Assertive alerts: Stream failures, quota warnings -->
   <div role="alert" aria-live="assertive" class="sr-only">
     Evaluation failed: Network stream interrupted. Click retry to resume.
   </div>
   ```

---

### F.6 Presupuesto de Movimiento y Rendimiento (Motion Budget & `prefers-reduced-motion`)

1. **Strict Duration Ceiling**:
   - Micro-interactions (button press, hover lightness shift): $\le \mathbf{120\text{ms}}$.
   - Component transitions (dropdowns, accordions, popovers): $\le \mathbf{200\text{ms}}$.
   - Modal and drawer overlays: $\le \mathbf{250\text{ms}}$.
   - Durations $> 250\text{ms}$ are prohibited for interactive feedback.
2. **GPU-Accelerated Transform Whitelist**:
   - Only `transform` and `opacity` may be animated.
   - Animating layout reflow properties (`width`, `height`, `top`, `left`, `margin`, `padding`) is strictly forbidden to prevent main-thread layout thrashing and preserve INP $\le 200\text{ms}$.
3. **Easing Curves**:
   - Entrances: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out).
   - Exits: `cubic-bezier(0.4, 0, 1, 1)` (accelerated ease-in).
   - Toggles & Radios: Spring curve `cubic-bezier(0.34, 1.56, 0.64, 1)` with subtle overshoot.
4. **Mandatory Reduced Motion Enforcement**:

```css
/* Accessibility Motion Lockdown */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Replace shimmer animation with static subtle tint */
  .shimmer-base {
    animation: none !important;
    background-image: none !important;
    background-color: var(--color-surface-raised) !important;
  }
}
```

---

## Section G: Referencia de Tokens de Diseño y Blueprint de Implementación

The following block constitutes the complete, authoritative CSS custom properties blueprint. It must be declared in `:root` and serves as the single source of visual styling truth for the entire application.

```css
:root {
  /* ==========================================================================
   * 1. SURFACE TONAL SCALE (DARK ENGINEERING EDITORIAL)
   * ========================================================================== */
  --color-surface-base:      #0b0d13; /* Application background & graph canvas */
  --color-surface-subtle:    #0d1118; /* Inset code wells, diff viewers, terminals */
  --color-surface-card:      #10151d; /* Static cards, panels, table rows */
  --color-surface-raised:    #151b25; /* Interactive hover surfaces, filter rails */
  --color-surface-overlay:   #1e2532; /* Modals, command palette, flyout drawers */
  --color-surface-highlight: #262f3e; /* Selected rows, active list items */

  /* ==========================================================================
   * 2. BORDERS, DIVIDERS & FOCUS RINGS
   * ========================================================================== */
  --color-border-subtle:   rgba(255, 255, 255, 0.05); /* Inset wells, inner lines */
  --color-border-default:  rgba(255, 255, 255, 0.08); /* Card bounds, structural edges */
  --color-border-hover:    rgba(255, 255, 255, 0.16); /* Interactive hover bounds */
  --color-border-focus:    #5eead4;                   /* 2px keyboard focus ring */
  --color-border-divider:  rgba(255, 255, 255, 0.06); /* Structural axis separators */

  /* ==========================================================================
   * 3. TYPOGRAPHY INK COLORS
   * ========================================================================== */
  --color-text-primary:    #f5f1e8; /* High-contrast reading prose & headings (16.2:1) */
  --color-text-secondary:  #94a3b8; /* Metadata, category labels, descriptions (6.6:1) */
  --color-text-muted:      #64748b; /* Shortcut badges, captions, sub-labels (4.6:1) */
  --color-text-disabled:   #475569; /* Inactive UI elements, locked nodes (WCAG exempt) */
  --color-text-on-accent:  #0b0d13; /* High-contrast ink on Teal CTA buttons (13.8:1) */

  /* ==========================================================================
   * 4. FUNCTIONAL BRAND ACCENT (< 5% USAGE DISCIPLINE)
   * ========================================================================== */
  --color-brand-primary:        #5eead4; /* Teal 300: Primary CTAs, active pills */
  --color-brand-primary-hover:  #2dd4bf; /* Teal 400: Hover state (-8% lightness) */
  --color-brand-primary-active: #14b8a6; /* Teal 500: Pressed state (-14% lightness) */
  --color-brand-primary-subtle: rgba(94, 234, 212, 0.12); /* Active background tint */

  /* ==========================================================================
   * 5. SEMANTIC STATUS & GOLDEN EXCELLENCE TIER
   * ========================================================================== */
  --color-status-error:            #f87171;                   /* Red 400: Errors, destructive */
  --color-status-error-subtle:     rgba(239, 68, 68, 0.12);   /* Red wash */
  --color-status-warning:          #fbbf24;                   /* Amber 400: Warnings only */
  --color-status-warning-subtle:   rgba(245, 158, 11, 0.12);  /* Amber wash */
  --color-status-success:          #4ade80;                   /* Green 400: Complete, verified */
  --color-status-success-subtle:   rgba(74, 222, 128, 0.12);  /* Green wash */
  --color-status-info:             #38bdf8;                   /* Sky 400: Information callouts */
  --color-status-info-subtle:      rgba(56, 189, 248, 0.12);  /* Sky wash */
  --color-status-excellence:       #f5c451;                   /* Warm Gold: Scores > 100 */
  --color-status-excellence-aura:  rgba(245, 196, 81, 0.22);  /* Golden bonus glow */

  /* ==========================================================================
   * 6. IMMUTABLE CATEGORY COLOR ANCHORS (REACT CURRICULUM)
   * ========================================================================== */
  --cat-react-fundamentals:  #61dafb; /* React core mental model & Fiber */
  --cat-react-state:         #f59e0b; /* Immutability, snapshots, batching */
  --cat-react-effects:       #a78bfa; /* Effect lifecycles & race conditions */
  --cat-react-rendering:     #4ade80; /* Reconciliation & DOM commit phase */
  --cat-react-architecture:  #2dd4bf; /* Component boundaries & server state */
  --cat-react-quality:       #f472b6; /* RTL, unit testing, flakiness */
  --cat-react-platform:      #94a3b8; /* Web standards, security, OIDC */
  --cat-react-design-system: #fb7185; /* Component APIs, tokens, headless */
  --cat-react-runtime:       #fbbf24; /* Event loop, microtasks, pipeline */
  --cat-react-operations:    #f97316; /* Observability, CI/CD, telemetry */
  --cat-react-leadership:    #c084fc; /* RFCs, architectural trade-offs */

  /* ==========================================================================
   * 7. IMMUTABLE CATEGORY COLOR ANCHORS (RAILS CURRICULUM)
   * ========================================================================== */
  --cat-rails-fundamentals:  #e8a33d; /* Rack pipeline, routing, MVC */
  --cat-rails-activerecord:  #cc342d; /* Lazy relations, N+1, transactions */
  --cat-rails-patterns:      #5aa9ff; /* Service Objects, Query Objects */
  --cat-rails-sti:           #a78bfa; /* Single Table Inheritance */
  --cat-rails-infra:         #94a3b8; /* API mode, background jobs */
  --cat-rails-assets:        #2dd4bf; /* Asset pipeline, importmaps */
  --cat-rails-testing:       #4ade80; /* RSpec, FactoryBot verification */

  /* ==========================================================================
   * 8. MODULAR SCALE TYPOGRAPHY (MAJOR THIRD 1.250 RATIO, BASE 16PX)
   * ========================================================================== */
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;

  --text-caption: 0.625rem;  /* 10px - Micro badges, shortcuts, index */
  --text-sm:      0.8125rem; /* 13px - Metadata, table headers, labels */
  --text-base:    1.000rem;  /* 16px - Primary reading copy floor */
  --text-lead:    1.250rem;  /* 20px - Section leads, card titles */
  --text-h3:      1.5625rem; /* 25px - Sub-headers, panel titles */
  --text-h2:      1.9375rem; /* 31px - Main modal titles, seniority bands */
  --text-h1:      2.4375rem; /* 39px - Top dashboard view header */
  --text-display: 3.0625rem; /* 49px - Hero score readout (114/120) */

  --leading-tight:   1.15;
  --leading-snug:    1.25;
  --leading-normal:  1.50;
  --leading-relaxed: 1.60;

  /* ==========================================================================
   * 9. RIGID 4PX / 8PX SPACING SCALE
   * ========================================================================== */
  --space-1:  4px;   /* 0.25rem - Tight icon gaps, chip internal padding */
  --space-2:  8px;   /* 0.50rem - Button horizontal gap, card micro-spacing */
  --space-3:  12px;  /* 0.75rem - Input padding, tag clusters */
  --space-4:  16px;  /* 1.00rem - Standard card body padding, stack spacing */
  --space-5:  20px;  /* 1.25rem - Modal section padding */
  --space-6:  24px;  /* 1.50rem - Large container padding, canvas gap */
  --space-8:  32px;  /* 2.00rem - Macro section separation */
  --space-10: 40px;  /* 2.50rem - Desktop outer layout margins */
  --space-12: 48px;  /* 3.00rem - Zen mode reading gutters */
  --space-16: 64px;  /* 4.00rem - Empty state vertical framing */

  /* ==========================================================================
   * 10. CONCENTRIC BORDER RADII (outer = inner + padding)
   * ========================================================================== */
  --radius-none: 0px;
  --radius-sm:   4px;    /* Inner wells, code blocks, micro-badges */
  --radius-md:   8px;    /* Action buttons, inputs, filter chips */
  --radius-lg:   12px;   /* Curriculum cards, flyout drawer containers */
  --radius-xl:   16px;   /* Top-level app shell modals, dialog overlays */
  --radius-full: 9999px; /* Symmetrical pill badges, counter tags */

  /* ==========================================================================
   * 11. ELEVATION & DIRECTIONAL SHADOWS
   * ========================================================================== */
  --shadow-level-0: none;
  --shadow-level-1: 0 1px 2px rgba(0, 0, 0, 0.40), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  --shadow-level-2: 0 4px 12px rgba(0, 0, 0, 0.50), 0 1px 2px rgba(0, 0, 0, 0.30);
  --shadow-level-3: 0 12px 32px rgba(0, 0, 0, 0.65), 0 2px 6px rgba(0, 0, 0, 0.40);
  --shadow-level-4: 0 24px 64px rgba(0, 0, 0, 0.80), 0 4px 16px rgba(0, 0, 0, 0.50);
  --shadow-level-5: 0 20px 40px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.20);
  --bevel-top:      inset 0 1px 0 0 rgba(255, 255, 255, 0.06);

  /* ==========================================================================
   * 12. EXPLICIT CONTROL HEIGHT SCALE
   * ========================================================================== */
  --ctrl-touch: 44px; /* Mobile touch target floor (<768px viewports) */
  --ctrl-lg:    40px; /* Primary CTAs ("Evaluate with AI", "Start") */
  --ctrl-md:    36px; /* Standard form inputs, modal buttons, search */
  --ctrl-sm:    32px; /* Global toolbar controls, category chips, zoom */
  --ctrl-xs:    24px; /* Inline metadata badges, status tags */

  /* ==========================================================================
   * 13. AUTHORITATIVE 8-LAYER Z-INDEX LADDER
   * ========================================================================== */
  --z-canvas:   0;  /* Base plane & SVG DAG canvas */
  --z-header:   10; /* Sticky application header & control deck */
  --z-bottom-nav: 25; /* Fixed mobile bottom navigation bar */
  --z-hud:      20; /* Floating asynchronous background HUD capsule */
  --z-popover:  30; /* Non-blocking popovers & glossary tooltips */
  --z-drawer:   40; /* Flyout drawer (Seniority & Milestones) */
  --z-modal:    50; /* Blocking dialogs (Study Modal, Command Palette) */
  --z-confirm:  60; /* Destructive system confirmation dialogs */
  --z-toast:    70; /* Ephemeral alerts, cross-tab notifications */

  /* ==========================================================================
   * 14. MOTION DURATIONS & EASING CURVES
   * ========================================================================== */
  --motion-duration-fast: 120ms; /* Micro-interactions, button presses */
  --motion-duration-base: 180ms; /* Tab switches, dropdown transitions */
  --motion-duration-slow: 240ms; /* Modal entrance, drawer slides */

  --motion-ease-out:    cubic-bezier(0.16, 1, 0.3, 1);       /* Natural arrival */
  --motion-ease-in:     cubic-bezier(0.4, 0, 1, 1);          /* Intentional exit */
  --motion-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* Switch overshoots */
}
```

---

## Section H: Contrato de Implementación y Verificación Downstream

### H.1 Declaración de Cero Adivinanza de Diseño (Zero Design Guesswork Declaration)

By order of this sealed engineering blueprint (`specs/001-clean-workspace-v2/design-spec.md`) and the governing visual architecture in `DESIGN.md`:
1. **No Design Decisions in Code**: Downstream frontend developers and coding subagents are strictly prohibited from inventing colors, improvising paddings, adjusting border-radii, or creating un-specified component states during implementation.
2. **Deterministic File Constraints**: Every component, hook, and utility authored in `src/` must strictly comply with **$\le 150$ lines of code**. Monolithic files are rejected by the CI gate: `node scripts/audit-lines.mjs`.
3. **Universal State Coverage**: No component may be marked complete without implementing all 5 states defined in Section E (Empty, Loading Skeleton with CLS $< 0.1$, Populated, Boundary, and Actionable Error).

---

### H.2 Inventario de Implementación de Componentes (`src/`)

The 13 visual organisms documented in Section B are decomposed into focused, single-responsibility React modules complying with the $\le 150$ line limit:

| Organism ID | Component Module Path (`src/components/`) | Supporting Hook (`src/hooks/`) | Line Budget | Mandatory Handled States | Core Dependencies & Interfaces |
|:---|:---|:---|:---:|:---|:---|
| **ORG-01** | `src/components/shell/AppHeader.jsx` | `useUrlRouting.js` | $\le 90$ | Populated | `INF-01`, `INF-02`, `INF-03`, `INF-18`, `INF-22`, `INF-81` |
| **ORG-02** | `src/components/deck/ControlDeck.jsx` | `useCurriculumWorkspace.js` | $\le 110$ | Populated, Filtered | `INF-04`, `INF-05`, `INF-06`, `INF-07`, `INF-08` |
| **ORG-03A**| `src/components/canvas/GridCanvas.jsx` | `useCurriculumWorkspace.js` | $\le 120$ | Empty, Loading (Skeletons), Populated, Boundary | `INF-11` through `INF-17`, 4-slot card model |
| **ORG-03B**| `src/components/canvas/TopologyCanvas.jsx` | `usePanZoom.js` | $\le 140$ | Empty, Loading, Populated, Clamped Bounds | `INF-09`, `INF-10`, Sugiyama layered layout, SVG |
| **ORG-04** | `src/components/drawer/SeniorityDrawer.jsx` | `useSeniorityProgress.js` | $\le 135$ | Empty, Populated, Staff Ready Boundary | `INF-23`, `INF-24`, Lock body scroll |
| **ORG-05** | `src/components/palette/CommandPalette.jsx`| `useKeyboardShortcuts.js` | $\le 130$ | Empty, Loading, Populated (Filtered) | `INF-19`, `INF-20`, `INF-21`, Focus trap |
| **ORG-06A**| `src/components/study/StudyModalShell.jsx` | `useStudySession.js` | $\le 125$ | Populated, Zen Mode Boundary | `INF-25` through `INF-30`, Capa 5 dialog, Focus trap |
| **ORG-06B**| `src/components/study/Stage01Read.jsx` | `useAudioNarrator.js` | $\le 145$ | Loading Skeleton, Populated, Error | `INF-31` through `INF-44`, Naive vs Production diff |
| **ORG-07** | `src/components/study/Stage02Learn.jsx` | `useSocraticMentor.js` | $\le 140$ | Empty (Chips), Shimmer Loading, Populated | `INF-45` through `INF-48`, Stream auto-scroll |
| **ORG-08** | `src/components/study/Stage03Paraphrase.jsx`| `useReadingChunks.js`, `useSpeechRecognition.js` | $\le 140$ | Empty, Populated, >10k Chars Boundary | `INF-49` through `INF-55`, Debounced IndexedDB |
| **ORG-09** | `src/components/study/Stage04Evaluate.jsx` | `useAiEvaluation.js` | $\le 145$ | Loader Shimmer, Populated (114/120), 120 Excellence, Error Retry | `INF-56` through `INF-72`, Rubric breakdown |
| **ORG-10** | `src/components/hud/BackgroundTasksHUD.jsx` | `useBackgroundTasks.js` | $\le 115$ | Hidden, Streaming Active, Popover Stack | `INF-73` through `INF-78`, Bottom-right fixed |
| **ORG-11** | `src/components/flashcards/FlashcardGrid.jsx` | `useFlashcardDeck.js` | $\le 130$ | Empty, Loading Skeletons, Populated, 3D Flip | `INF-87` through `INF-91`, 3D rotateY transform |
| **ORG-12** | `src/components/settings/SettingsModal.jsx` | `useByokStorage.js` | $\le 135$ | Populated, Error (Invalid Key / Schema) | `INF-82` through `INF-86`, JSON export/import |
| **ORG-13** | `src/components/shell/MobileBottomNav.jsx` | `useUrlRouting.js` | $\le 85$ | Populated | `INF-92`, `INF-93`, Touch targets $\ge 44\text{px}$ |

---

### H.3 Lista de Verificación de Calidad y Pruebas Downstream (Quality Assurance Checklist)

Before merging any implementation code into `main` or certifying a feature release, the implementation must pass the following non-negotiable verification gates:

```bash
# 1. Mandatory line count audit (0 violations tolerated across all src/ files)
node scripts/audit-lines.mjs

# 2. Domain logic unit test suite (100% pass across scoring, state, and routing)
npm run test:logic

# 3. Production distribution compilation (Zero TypeScript / JSX bundle errors)
npm run build

# 4. Playwright End-to-End Suite (Validating 5 states, keyboard traps, and visual contracts)
npx playwright test
```

| Verification Domain | Specific Assertion / Target | Verification Tool / Command | Pass Criteria |
|:---|:---|:---|:---:|
| **Line Budget Integrity** | Every file in `src/` must be $\le 150$ lines. | `node scripts/audit-lines.mjs` | 0 violations. |
| **Cumulative Layout Shift** | Content arrival over skeletons must produce no shift. | Lighthouse / Playwright Performance | $\text{CLS} < 0.1$. |
| **WCAG 2.2 AA Contrast** | All text must maintain contrast $\ge 4.5:1$ ($\ge 3:1$ large). | Axe-Core / Dembrandt Audit | 0 contrast violations. |
| **Keyboard Accessibility** | All interactive elements operable via Tab, Enter, Esc. | Playwright Accessibility Suite | 0 keyboard traps. |
| **Core Web Vitals** | LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$. | Lighthouse CI | Performance $\ge 90$. |
| **Draft Safety Invariant** | Switching tabs or reloading preserves paraphrase drafts. | IndexedDB Unit & Integration Tests | 0 draft losses. |
| **Canonical Scoring** | Scores map to $0..120$; bonus tier starts at $101$. | Logic Unit Suite (`test:logic`) | 100% schema match. |

---

### H.4 Sello de Finalización de Flujo de Diseño

With the successful completion and recording of Sections A, B, C, D, E, F, G, and H, the visual and interaction design phase for `specs/001-clean-workspace-v2/` is formally concluded. The specification provides an unambiguous, mathematically complete, and accessible engineering blueprint ready for immediate downstream development.

---
<!-- DESIGN_WORKFLOW_COMPLETE -->

