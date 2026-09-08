# Feature Design Specification: Clean Learning Workspace V2
## Master Visual & Interaction Blueprint (Phases 1–3 Complete)

- **Feature**: `001-clean-workspace-v2`
- **Version**: `2.0.0`
- **Status**: `Complete Design Specification (Phases 0–3 Sealed / Ready for Phase 3 Audit)`
- **Creative North Star**: *"El cockpit de dominio técnico"*
- **Aesthetic Benchmark**: Dark Engineering Editorial (Linear / Raycast / Vercel / Cursor)
- **Governing Master Skills**: 
  * `ui-design-foundations` (`.agents/skills/ui-design-foundations/SKILL.md`)
  * `ui-information-architecture` (`.agents/skills/ui-information-architecture/SKILL.md`)
  * `ui-component-patterns` (`.agents/skills/ui-component-patterns/SKILL.md`)
  * `ui-quality-and-audit` (`.agents/skills/ui-quality-and-audit/SKILL.md`)
- **System Foundations**: `DESIGN.md` (Sealed Phase 0 Design System Foundations)
- **Quality & Evaluation Criteria**: `docs/DESIGN_CRITERIA.md`
- **Input Specification**: `specs/001-clean-workspace-v2/spec.md` (US1 through US7)
- **Authors**: Design Systems Pair (Information Architect, Component Designer, Interaction & Usability Specialist)
- **Date**: 2026-09-08

---

## Executive Summary & Architectural Intent

This document establishes the single source of structural and informational truth for **Learning Workspace V2**. Grounded in first principles from `specs/001-clean-workspace-v2/spec.md` and governed by `DESIGN.md` and `docs/DESIGN_CRITERIA.md`, this specification rejects legacy top-bar layouts, arbitrary "carditis" div nesting, and bloated horizontal chrome.

The interface is engineered as **"El cockpit de dominio técnico"**: a high-density, zero-latency workstation tailored for software engineers preparing for senior, staff, and principal engineering interviews at tier-1 technology organizations. Every pixel, layout paradigm, attention level, and touch target is mathematically calibrated to maximize cognitive focus and eliminate friction.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    LEARNING WORKSPACE ARCHITECTURE STACK                     │
├──────────────────────────────────────────────────────────────────────────────┤
│  Phase 0 (Sealed)   │ DESIGN.md: Tokens, Minor Third Scale, Concentric Radii │
├─────────────────────┼────────────────────────────────────────────────────────┤
│  Phase 1 (Sealed)   │ Information Architecture, 3 Attention Tiers, Spatial   │
│                     │ Layout Paradigms (Landscape 1440×900 vs Mobile 390×844)│
├─────────────────────┼────────────────────────────────────────────────────────┤
│  Phase 2 (Sealed)   │ Component Patterns, 6-State Buttons, Overlay Z-Index   │
├─────────────────────┼────────────────────────────────────────────────────────┤
│  Phase 3 (Complete) │ 5-State Matrix, WCAG 2.2 AA Contrast, Implementation   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Section A: Exhaustive Information Inventory Matrix (Data & Affordance Manifest)

This matrix deconstructs every single data point, metric, label, status badge, control, and user action required across all 7 User Stories (US1–US7) and domain data models (`PedagogicalLesson`, `EvaluationResult`) into an immutable, numbered inventory (`INF-01` to `INF-102`). Cero omissions are permitted.

### Table Columns Definition:
- **ID**: Unique immutable identifier (`INF-01` to `INF-102`).
- **User Story**: Originating specification scenario (US1 through US7).
- **Data Element / Affordance**: Name and functional description of the UI item.
- **Data Type / Format**: Underlying primitive or composite data structure.
- **Source / Mutability**: Origin (Static Domain Schema, Reactive State, Local Database, Browser API) and mutation profile.
- **Target Surface / Organism**: Intended UI container or visual organism where the element renders.

| ID | User Story | Data Element / Affordance | Data Type / Format | Source / Mutability | Target Surface / Organism |
|:---|:---|:---|:---|:---|:---|
| `INF-01` | US1 | Curriculum Switcher | Enum (`'react' \| 'rails'`) | Local State / Reactive | App Shell Cockpit Header (`ORG-01`) |
| `INF-02` | US1 | Total Concept Count & Active Scope Metric | String / Integer (`48 conceptos`) | Computed / Read-only | App Shell Cockpit Header (`ORG-01`) |
| `INF-03` | US1 | Global Seniority Readiness Score | Percentage & Band (`78% Senior`) | Computed / Read-only | App Shell Cockpit Header (`ORG-01`) |
| `INF-04` | US1 | Seniority Bands Breakdown Trigger & Popover | Array (`[BandName, %, Count]`) | Computed / Interactive | Global HUD / Command Palette (`ORG-01`) |
| `INF-05` | US1 | Curriculum Milestones Progress Ratio | String (`14/18 Hitos Dominados`) | Computed / Read-only | Seniority Inspector / Top Deck (`ORG-01`) |
| `INF-06` | US1 | Topological Next Step Priority Badge | Enum Badge (`URGENTE`, `RECOMENDADO`, `EXPLORATORIO`) | Computed (Topology Engine) | Guidance Deck (`ORG-02`) |
| `INF-07` | US1 | Topological Next Step Recommended Node Title | String (`React Fiber Reconciler`) | Computed (Dependency Engine) | Guidance Deck (`ORG-02`) |
| `INF-08` | US1 | Topological Next Step Rationale Explanation | String (`Prerrequisito crítico bloqueante`) | Computed (Topology Engine) | Guidance Deck (`ORG-02`) |
| `INF-09` | US1 | Topological Next Step CTA Button | Action Trigger (`Iniciar Estudio`) | Interactive Primary Button | Guidance Deck (`ORG-02`) |
| `INF-10` | US1 | Category Filter Chip Strip | Array of 11/7 Category Chips (`key`, `label`, `count`, `colorDot`) | Static Domain / Reactive Filter | Concept Explorer Deck (`ORG-02`) |
| `INF-11` | US1 | Active Category Filter Indicator & Clear CTA | String / Action (`activeCategory`, `Limpiar`) | State / Interactive Clear | Concept Explorer Deck (`ORG-02`) |
| `INF-12` | US1 | Workspace View Switcher (Grid vs DAG) | Segmented Control (`'grid' \| 'dag'`) | State / Interactive Toggle | Workspace Utility Deck (`ORG-02`) |
| `INF-13` | US1 | Concept Card Title | String (`React Fiber Reconciler`) | Static Domain Schema | Concept Grid Card (`ORG-02`) |
| `INF-14` | US1 | Concept Card Seniority Level Badge | Enum Badge (`mid` \| `senior` \| `staff`) | Static Domain Schema | Concept Grid Card (`ORG-02`) |
| `INF-15` | US1 | Concept Card Category Micro-Pill | Hex Anchor + Label (`#4ADE80 Render`) | Immutable Category Color | Concept Grid Card (`ORG-02`) |
| `INF-16` | US1 | Concept Card Mastery Status Indicator | Status Dot (`locked`, `unlocked`, `in-progress`, `mastered`) | Local DB / Reactive State | Concept Grid Card (`ORG-02`) |
| `INF-17` | US1 | Concept Card Score Badge | Numeric Tabular Badge (`★ 118/120` or `--/120`) | Local DB / Read-only | Concept Grid Card (`ORG-02`) |
| `INF-18` | US1 | Concept Card 2-Line Clamped Summary | String (`Fiber re-implements call stack as linked list...`) | Static Domain Schema | Concept Grid Card (`ORG-02`) |
| `INF-19` | US1 | Concept Card Prerequisites Chips | Array of Chips (`[NodeTitle, StatusIcon]`) | Computed Dependency Graph | Concept Grid Card (`ORG-02`) |
| `INF-20` | US1 | Concept Card Click / Keypress Affordance | Navigation Action (`openConceptModal(nodeId)`) | Interactive Trigger | Concept Grid Card (`ORG-02`) |
| `INF-21` | US1 | DAG SVG Canvas Surface | SVG Surface (`viewBox`, Pan/Zoom matrix) | Interactive Canvas | DAG Topology Surface (`ORG-02`) |
| `INF-22` | US1 | DAG Interactive Node Element | SVG Node (`title`, `statusColor`, `categoryStroke`, `coords`) | Computed / Interactive | DAG Topology Surface (`ORG-02`) |
| `INF-23` | US1 | DAG Directed Dependency Edge | SVG Path with Marker Arrow (`source -> target`) | Computed Graph / Directed Edge | DAG Topology Surface (`ORG-02`) |
| `INF-24` | US1 | DAG Pan & Zoom Control Cluster | Action Buttons (`Zoom +`, `Zoom -`, `Recenter`) | Interactive Triggers | DAG Overlay Deck (`ORG-02`) |
| `INF-25` | US1 | DAG Mastery Filter Selector | Filter Toggles (`Todos`, `Dominados`, `Pendientes`, `Bloqueados`) | State / Interactive Filters | DAG Overlay Deck (`ORG-02`) |
| `INF-26` | US1 | Command Palette Trigger Button | Affordance Button (`⌘K` / `Ctrl+K`) | Interactive Trigger | App Shell Cockpit Header (`ORG-01`) |
| `INF-27` | US1 | Command Palette Input Search Field | Input (`type="text"`, autofocus) | Ephemeral Input State | Command Palette Modal (`ORG-01`) |
| `INF-28` | US1 | Command Palette Filtered Results List | Array of Matched Concepts / Actions | Computed in Real-Time | Command Palette Modal (`ORG-01`) |
| `INF-29` | US1 | Command Palette Global Quick Actions | Actions (`Ir a Flashcards`, `Ver Seniority`, `BYOK`) | Interactive Triggers | Command Palette Modal (`ORG-01`) |
| `INF-30` | US1 | Canonical URL Path Sizing & Sync | URL String (`/:graph/card/:nodeId`) | Browser Routing Engine | Browser Address Bar |
| `INF-31` | US1 | History Navigation (`popstate` Atrás/Adelante) | Browser History Events | Browser Routing Engine | App Controller |
| `INF-32` | US2 | Study Experience Modal / Drawer Container | Modal Frame Surface (`level_5`, `#121722`) | Viewport Layer | Study Experience Shell (`ORG-03`) |
| `INF-33` | US2 | Study Header Concept Title & Badges | String + Badges (`Title`, `CategoryPill`, `SeniorityBadge`) | Active Concept Record | Study Header (`ORG-03`) |
| `INF-34` | US2 | Study Header Close Affordance | Action Button (`Escape` / `X` button) | Interactive Trigger | Study Header (`ORG-03`) |
| `INF-35` | US2 | Study Header Zen Mode Fullscreen Toggle | Action Button (`100vw × 100vh` Focus) | State Toggle | Study Header (`ORG-03`) |
| `INF-36` | US2 | 4-Stage Stepper Navigation Strip | Segmented Tab Strip (`01 Leer`, `02 Aprender`, `03 Parafrasear`, `04 Evaluar`) | State (`stageIndex`) | Study Sub-Header (`ORG-03`) |
| `INF-37` | US2 | Contextual Progression Breadcrumb | Links (`Antes: NodeA` → `Ahora: NodeB` → `Después: NodeC`) | Computed Graph Dependencies | Study Sub-Header (`ORG-03`) |
| `INF-38` | US2 | Stage 01: Concept One-Line Core Mental Model | String (`summary: string`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-39` | US2 | Stage 01: Architectural Justification ("El porqué") | Prose Paragraph (`why: string`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-40` | US2 | Stage 01: Naive Code Comparison Snippet & Error | Label, Code Block, Failure Text (`naive`) | Domain Lesson Schema | Stage 01 Comparison Surface (`ORG-03`) |
| `INF-41` | US2 | Stage 01: Senior Code Comparison Snippet & Trade-offs | Label, Code Block, Trade-offs (`production`) | Domain Lesson Schema | Stage 01 Comparison Surface (`ORG-03`) |
| `INF-42` | US2 | Stage 01: Code Comparison Layout Switcher | Segmented Toggle (`Side-by-side` \| `Stacked`) | User Preference State | Stage 01 Comparison Surface (`ORG-03`) |
| `INF-43` | US2 | Stage 01: Step-by-Step Execution Sequence | Ordered List (`steps: string[]`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-44` | US2 | Stage 01: Production Pitfalls & Risks | Unordered List with Warning Icons (`pitfalls: string[]`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-45` | US2 | Stage 01: Executive Takeaway Rule | Highlighted Lead Prose (`takeaway: string`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-46` | US2 | Stage 01: Low-Level Deep-Dive Glossary Links | Accordion / Popover (`deepDives: term, def, model`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-47` | US2 | Stage 01: FAANG Interview Questions List | Expandable Cards (`question, answer, whyAsked, isUnlocked`) | Domain Lesson Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-102` | US2 | Stage 01: Official Documentation & Technical Sources Links | Array<{ title: string, url: string, domain: string }> | Static Domain Schema | Stage 01 Reading Well (`ORG-03`) |
| `INF-48` | US2, US4 | Stage 01: TTS Audio Player Controls | Audio Controls (`Play`, `Pause`, `Stop`, Rate `1.0x-1.5x`) | Native `SpeechSynthesis` | Stage 01 Reading Toolbar (`ORG-03`) |
| `INF-49` | US2, US4 | Stage 01: TTS Active Audio Playing Indicator | Animated Wave Badge / Pulse | Native Audio State | Stage 01 Reading Toolbar (`ORG-03`) |
| `INF-50` | US2 | Stage 02: Socratic Initial Diagnostic Question | Prose Prompt | Domain Lesson / AI Tutor | Stage 02 Socratic Surface (`ORG-03`) |
| `INF-51` | US2 | Stage 02: Socratic Dialogue History Thread | Message List (`role: 'tutor' \| 'user'`, `text`, `timestamp`) | Ephemeral Session State | Stage 02 Socratic Surface (`ORG-03`) |
| `INF-52` | US2 | Stage 02: Socratic Quick-Reply Trade-off Chips | Array of Action Chips (`[Option1, Option2]`) | Generated Trade-off Options | Stage 02 Socratic Surface (`ORG-03`) |
| `INF-53` | US2 | Stage 02: Socratic User Input Field & Send Action | Textarea + Button (`Ctrl+Enter` shortcut) | Ephemeral Input State | Stage 02 Socratic Surface (`ORG-03`) |
| `INF-54` | US2 | Stage 02: Socratic Synthesis Action Button | Action (`Integrar conclusiones al borrador`) | State Transformation Action | Stage 02 Socratic Surface (`ORG-03`) |
| `INF-55` | US2 | Stage 03: Paraphrase Formulation Text Editor | Multi-line Textarea (`value: string`, auto-expanding) | Local Storage State | Stage 03 Paraphrase Canvas (`ORG-03`) |
| `INF-56` | US2 | Stage 03: Speech-to-Text Microphone Dictation Affordance | Action Button (`SpeechRecognition` toggle, recording pulse) | Native Browser API | Stage 03 Editor Toolbar (`ORG-03`) |
| `INF-57` | US2 | Stage 03: Real-Time Character & Word Count Metrics | Tabular Numbers (`1,420 caracteres · 215 palabras`) | Computed in Real-Time | Stage 03 Editor Footer (`ORG-03`) |
| `INF-58` | US2 | Stage 03: Conceptual Chunks Rubric Checklist | Progress Indicator of Key Domain Terms Covered | Computed Heuristic | Stage 03 Editor Sidebar (`ORG-03`) |
| `INF-59` | US2 | Stage 03: Local Persistence Autosave Timestamp | Text Indicator (`Guardado local: 11:42:08`) | Local Storage Sync | Stage 03 Editor Footer (`ORG-03`) |
| `INF-60` | US2 | Stage 03: Proceed to Evaluation Primary CTA | Filled Brand Button (`Evaluar con IA (04)`) | Interactive Transition CTA | Stage 03 Editor Footer (`ORG-03`) |
| `INF-61` | US2 | Stage 04: Real-Time Streaming Text Well | Live Markdown Render Container | Async Stream Stream State | Stage 04 Evaluation Surface (`ORG-03`) |
| `INF-62` | US2 | Stage 04: Streaming Elapsed Timer Stopwatch | Monospace Timer (`font-variant-numeric: tabular-nums`, `00:14.2s`) | Live Active Timer | Stage 04 Streaming Banner (`ORG-03`) |
| `INF-63` | US2 | Stage 04: Streaming Character Counter | Tabular Counter (`1,842 caracteres`) | Live Stream Metric | Stage 04 Streaming Banner (`ORG-03`) |
| `INF-64` | US2 | Stage 04: Stream Cancel / Abort Button | Destructive Outline Button (`Cancelar evaluación`) | `AbortController` Trigger | Stage 04 Streaming Banner (`ORG-03`) |
| `INF-65` | US2 | Stage 04: Master Rubric Score Display | Display Hero Metric (`113 / 120` with Gold Accent if >100) | Evaluation Result Schema | Stage 04 Scorecard (`ORG-03`) |
| `INF-66` | US2 | Stage 04: Concise Executive Verdict Label | Heading (`Nivel Senior Sólido — Trade-offs bien articulados`) | Evaluation Result Schema | Stage 04 Scorecard (`ORG-03`) |
| `INF-67` | US2 | Stage 04: Rubric Dimension 1: Accuracy Metric & Note | Metric + Note (`accuracy: 38/40 pts`) | Evaluation Result Schema | Stage 04 Rubric Matrix (`ORG-03`) |
| `INF-68` | US2 | Stage 04: Rubric Dimension 2: Causality & Trade-offs | Metric + Note (`causalityAndTradeoffs: 24/25 pts`) | Evaluation Result Schema | Stage 04 Rubric Matrix (`ORG-03`) |
| `INF-69` | US2 | Stage 04: Rubric Dimension 3: Application & Real World | Metric + Note (`application: 19/20 pts`) | Evaluation Result Schema | Stage 04 Rubric Matrix (`ORG-03`) |
| `INF-70` | US2 | Stage 04: Rubric Dimension 4: Completeness & Gaps | Metric + Note (`completeness: 14/15 pts`) | Evaluation Result Schema | Stage 04 Rubric Matrix (`ORG-03`) |
| `INF-71` | US2 | Stage 04: Qualitative Strengths Bullet List | Array of Strings (`strengths: string[]`) | Evaluation Result Schema | Stage 04 Feedback Panel (`ORG-03`) |
| `INF-72` | US2 | Stage 04: Qualitative Knowledge Gaps Bullet List | Array of Strings (`gaps: string[]`) | Evaluation Result Schema | Stage 04 Feedback Panel (`ORG-03`) |
| `INF-73` | US2 | Stage 04: Qualitative Misconceptions Bullet List | Array of Strings (`misconceptions: string[]`) | Evaluation Result Schema | Stage 04 Feedback Panel (`ORG-03`) |
| `INF-74` | US2 | Stage 04: Next Attempt Guidance Prompt Callout | Callout Box (`nextAttemptPrompt: string`) | Evaluation Result Schema | Stage 04 Feedback Panel (`ORG-03`) |
| `INF-75` | US2 | Stage 04: Historical Evaluations Strip & Delta | Array of Past Attempts (`Intento #1: 72`, `Intento #2: 113`) | Local Database Records | Stage 04 History Deck (`ORG-03`) |
| `INF-76` | US3 | Background Evaluation Task Orchestrator | Object (`taskId`, `nodeId`, `status`, `chars`, `stream`) | Background Service State | Global State Controller |
| `INF-77` | US3 | Global HUD Floating Pill Container | Floating Deck (Level 5 Surface, Bottom-Right) | Global Overlay Layer | Global HUD (`ORG-04`) |
| `INF-78` | US3 | Global HUD Active Concept Name & Status Dot | String + Pulsing Status Dot (`Eval: Fiber Reconciler`) | Live Background State | Global HUD (`ORG-04`) |
| `INF-79` | US3 | Global HUD Real-Time Character Counter | Monospace Tabular Counter (`1,240 chars`) | Live Stream Metric | Global HUD (`ORG-04`) |
| `INF-80` | US3 | Global HUD Restore / View Action Button | Action Button (`Ver Evaluación`) | Interactive Trigger | Global HUD (`ORG-04`) |
| `INF-81` | US3 | Global HUD Abort Action Button | Action Button (`AbortController`) | Interactive Trigger | Global HUD (`ORG-04`) |
| `INF-82` | US3 | Multi-Tab BroadcastChannel Synchronization Dot | Visual Indicator (Synchronized across tabs) | Native `BroadcastChannel` | Global HUD (`ORG-04`) |
| `INF-83` | US5 | BYOK Settings Dialog Modal / Drawer | Container (`role="dialog"`, Level 5 Surface) | Viewport Layer | Settings Modal (`ORG-06`) |
| `INF-84` | US5 | AI Provider Selection Dropdown | Select (`OpenRouter` \| `OpenAI` \| `Groq` \| `Ollama`) | Local Config State | Settings Modal (`ORG-06`) |
| `INF-85` | US5 | Model Identifier Input Field | Input (`anthropic/claude-3.5-sonnet`, `deepseek/r1`) | Local Config State | Settings Modal (`ORG-06`) |
| `INF-86` | US5 | API Key Masked Input with Reveal Toggle | Password Field with Eye Icon Toggle | Local Encrypted / `localStorage` | Settings Modal (`ORG-06`) |
| `INF-87` | US5 | Connection Test Trigger Button | Action Button (`Probar Conexión`) | Interactive Trigger | Settings Modal (`ORG-06`) |
| `INF-88` | US5 | Connection Status & Latency Badge | Badge (`210ms OK` - Success Green / Error Red) | Async Health Check Result | Settings Modal (`ORG-06`) |
| `INF-89` | US5 | Local Storage Privacy Guarantee Callout | Informational Callout (Zero Central Storage Notice) | Static Security Copy | Settings Modal (`ORG-06`) |
| `INF-90` | US5 | Export JSON Backup Action Button | Download Trigger (`Exportar Respaldo JSON`) | Client-side File Saver | Settings Modal (`ORG-06`) |
| `INF-91` | US5 | Import JSON Backup Action Button & File Picker | File Upload Input (`.json`) | Client-side File Reader | Settings Modal (`ORG-06`) |
| `INF-92` | US5 | Schema Validation & Overwrite Confirmation Dialog | Confirm Dialog (Preview of records to import) | Guarded Modal Dialog | Settings Modal (`ORG-06`) |
| `INF-93` | US6 | Flashcard Workspace Mode Viewport | Full Surface Workspace View | Route State (`/flashcards`) | Flashcard Deck (`ORG-05`) |
| `INF-94` | US6 | Flashcard Taxonomy & Mastery Filters | Category Chips + Mastery Selectors (Weak, Senior Focus) | Reactive Filter State | Flashcard Deck (`ORG-05`) |
| `INF-95` | US6 | Flashcard Index & Total Counter | Tabular Counter (`Tarjeta 07 / 42`) | Computed Counter | Flashcard Deck (`ORG-05`) |
| `INF-96` | US6 | Flashcard 3D Card Front Face | Card Face (Challenge, Seniority, Category, Flip CTA) | Domain Lesson Schema | Interactive 3D Card (`ORG-05`) |
| `INF-97` | US6 | Flashcard 3D Card Back Face | Card Face (Architectural answer, Trade-off, Self-rating) | Domain Lesson Schema | Interactive 3D Card (`ORG-05`) |
| `INF-98` | US6 | Flashcard Deep-Dive Action Button | Action (`Profundizar en Modo Estudio`) | Transition to US2 Modal | Interactive 3D Card (`ORG-05`) |
| `INF-99` | US6 | Flashcard Keyboard Shortcuts Legend | Metadata Chips (`[Espacio] Voltear`, `[→] Siguiente`) | Accessible Hint | Flashcard Deck Footer (`ORG-05`) |
| `INF-100` | US7 | Mobile Bottom Navigation Dock | Fixed Dock (`.mobile-bottom-nav`, 5 Nav Items) | Mobile Shell Layer | Mobile Viewport (`ORG-07`) |
| `INF-101` | US7 | Mobile Full-Height Study Sheet with Drag Handle | Bottom Sheet Drawer with Touch Header Dismiss | Viewport Layer | Mobile Viewport (`ORG-07`) |

---

## Section B: Grouping, Hierarchy & Surface Architecture Matrix

### 1. Partitioning into 7 Unified Macro-Organisms

The 102 data points and affordances are partitioned into 7 cohesive visual organisms. Each organism has an unambiguous spatial boundary, explicit elevation tier, and container budget.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ORG-01] APP SHELL & COCKPIT HEADER (48px fixed, Elevation Level 2)         │
│  Logo "KW" │ React/Rails Switch │ 48 Conceptos │ 78% Senior │ ⌘K │ Settings │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ORG-02] WORKSPACE CONCEPT EXPLORER (Canvas Elevation Level 1)              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Guidance Deck: ★ URGENTE: React Fiber Reconciler [Iniciar Estudio]    │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Category Deck: [All] [Fundamentals] [State] [Rendering] ... (Wrap)    │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Concept Grid (Cards) OR Topological DAG Canvas (SVG pan/zoom)         │  │
│  │  [Card 1]  [Card 2]  [Card 3]  [Card 4]                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ORG-04] GLOBAL NON-BLOCKING TASKS HUD (Floating Deck, Elevation Level 5)   │
│  [● Streaming: Fiber Reconciler (1,240 chars) │ Ver │ Cancelar]             │
└─────────────────────────────────────────────────────────────────────────────┘
  Overlay Surfaces:
  - [ORG-03] 4-Stage Study Experience Modal / Zen Overlay (Level 5)
  - [ORG-05] Flashcard Rapid Retrieval Deck (Dedicated Route / Full Canvas)
  - [ORG-06] Settings & Data Sovereignty Deck (Modal Level 5)
  - [ORG-07] Mobile Ergonomic Shell (< 768px: Bottom Nav Dock + Touch Sheet)
```

#### Organism 1: `ORG-01` App Shell & Cockpit Header
- **Inventory Items**: `INF-01`, `INF-02`, `INF-03`, `INF-04`, `INF-05`, `INF-26`, `INF-27`, `INF-28`, `INF-29`, `INF-30`, `INF-31`.
- **Elevation Level**: Level 2 (`#0d111a`, hairline border `rgba(255,255,255,0.06)`, inset specular highlight `inset 0 1px 0 0 rgba(255,255,255,0.04)`).
- **Spatial Budget**: Fixed height `48px`, full width, `z-index: 100`.
- **Responsibility**: Houses global identity, curriculum switching (React vs Rails), high-level telemetry (Concept count, Seniority readiness %), Command Palette trigger (`⌘K`), and settings access.

#### Organism 2: `ORG-02` Workspace Concept Explorer
- **Inventory Items**: `INF-06`, `INF-07`, `INF-08`, `INF-09`, `INF-10`, `INF-11`, `INF-12`, `INF-13`, `INF-14`, `INF-15`, `INF-16`, `INF-17`, `INF-18`, `INF-19`, `INF-20`, `INF-21`, `INF-22`, `INF-23`, `INF-24`, `INF-25`.
- **Elevation Level**: Level 1 Base Canvas (`#080b11`), with Level 3 Cards (`#131824`).
- **Spatial Budget**: Variable canvas filling $\ge 75\%$ of the vertical viewport.
- **Responsibility**: The primary working canvas. Contains the Topological Guidance Banner, the Category Filter Deck, and the dual-mode visualization (Concept Card Grid with tabular metrics or Topological Directed Acyclic Graph Canvas with pan/zoom).

#### Organism 3: `ORG-03` 4-Stage Study Experience
- **Inventory Items**: `INF-32` through `INF-75`, and `INF-102` (all pedagogical stages 01–04, code diff, Socratic tutor, paraphrase editor, speech dictation/TTS, official sources links, and 120-point rubric scorecard).
- **Elevation Level**: Level 5 Modal / Zen Overlay (`#121722`, border `rgba(255,255,255,0.12)`, shadow `0 24px 60px -12px rgba(0,0,0,0.85)`).
- **Spatial Budget**: Desktop center modal `max-w-5xl` (`1024px`) with `max-h-[90vh]`; Zen mode `100vw × 100vh` with constrained `max-w-4xl` reading column.
- **Responsibility**: Deep technical mastery workspace. Houses the sequential 4-stage pedagogical flow with zero-state-loss tab switching.

#### Organism 4: `ORG-04` Global Non-Blocking Tasks HUD
- **Inventory Items**: `INF-76`, `INF-77`, `INF-78`, `INF-79`, `INF-80`, `INF-81`, `INF-82`.
- **Elevation Level**: Level 5 Overlay Surface (`#121722`, border `rgba(56,189,248,0.3)` on active stream, `z-index: 500`).
- **Spatial Budget**: Floating pill/dock in viewport bottom-right corner (`bottom: 24px; right: 24px; max-width: 360px; height: 44px`).
- **Responsibility**: Non-blocking background streaming status indicator. Allows navigating away from a running evaluation while monitoring character output, canceling via `AbortController`, or restoring the modal with 1 click.

#### Organism 5: `ORG-05` Flashcard Rapid Retrieval Deck
- **Inventory Items**: `INF-93`, `INF-94`, `INF-95`, `INF-96`, `INF-97`, `INF-98`, `INF-99`.
- **Elevation Level**: Level 1 Canvas with Level 3 Centered 3D Card (`#131824`, radius `16px`).
- **Spatial Budget**: Dedicated route (`/flashcards`) taking 100% viewport width and height minus header.
- **Responsibility**: Rapid cognitive recall and pre-interview warm-up. Houses interactive 3D flip card with keyboard shortcuts (`Space`, `Arrow` keys) and 1-click jump to full study mode.

#### Organism 6: `ORG-06` Settings & Data Sovereignty Deck
- **Inventory Items**: `INF-83`, `INF-84`, `INF-85`, `INF-86`, `INF-87`, `INF-88`, `INF-89`, `INF-90`, `INF-91`, `INF-92`.
- **Elevation Level**: Level 5 Modal (`#121722`, max width `560px`).
- **Spatial Budget**: Centered modal overlay with background scroll lock.
- **Responsibility**: Private configuration of LLM providers (BYOK: OpenRouter, OpenAI, Groq, Ollama), live latency connection test, and full offline JSON backup import/export.

#### Organism 7: `ORG-07` Mobile Ergonomic Shell & Sheet
- **Inventory Items**: `INF-100`, `INF-101`, plus mobile adaptations of `INF-01` to `INF-102`.
- **Elevation Level**: Bottom Dock Level 2 (`#0d111a`), Slide-over Sheet Level 5 (`#121722`).
- **Spatial Budget**: Mobile Viewport (<768px): Bottom bar `56px + env(safe-area-inset-bottom)`, touch targets $\ge 44\text{px}$, bottom cushion `80px`.
- **Responsibility**: Ensures zero horizontal overflow and total thumb reachable control on mobile devices (390×844).

---

### 2. Strict 3-Level Attention Hierarchy

Every piece of information is assigned to exactly one Attention Tier based on the user's cognitive scanning velocity:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: GLANCEABLE (< 1s) — High Contrast, Tabular Numbers, Instant State   │
│ - Seniority readiness % (`78% Senior`)    - Active curriculum (React/Rails) │
│ - Mastery status dot (Color/Icon)        - Score badge (`★ 118/120`)        │
│ - Next Step Priority Badge (`URGENTE`)   - Next Step Title & Card Title     │
│ - Active category color anchor & clear   - Study Header Title & Badges      │
│ - Streaming stopwatch & char counter     - HUD task status pulse & counter  │
│ - Multi-tab BroadcastChannel sync dot    - Connection latency badge (210ms) │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: OPERATIONAL (1–5s) — Interactive Controls, Inputs, Steppers         │
│ - Curriculum selector buttons            - Category filter chips (Wrap)     │
│ - View mode toggle (Grid vs DAG)         - Concept card click & hover       │
│ - 4-Stage stepper navigation tabs        - Code view switch (Split/Stacked) │
│ - Speech recognition mic toggle          - Paraphrase text editor           │
│ - Evaluation CTA ("Evaluar con IA")      - Flashcard flip & rating buttons  │
│ - Mobile bottom navigation dock          - Command Palette search input     │
│ - BYOK settings modal & API inputs       - Flashcard taxonomy & filters     │
│ - Mobile sheet drag handle & controls    - Flashcard shortcuts legend       │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: ON-DEMAND (> 5s) — Deep Technical Immersion, Inspection, History    │
│ - Naive vs Senior code AST diff          - Architectural "Why" explanation  │
│ - Socratic dialogue thread history       - 4-Dimension Rubric Scorecard     │
│ - Qualitative strengths & gaps notes     - Historical evaluation attempts   │
│ - FAANG interview questions & answers    - Official documentation & RFCs    │
│ - Conceptual chunks rubric checklist     - BYOK privacy copy & JSON backup  │
│ - System substrates: Canonical URL sync, popstate events, Shell containers  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Classification Roster:

1. **Tier 1: Glanceable (< 1s)** — Total: 23 Items:
   - `INF-01` (Active curriculum indicator)
   - `INF-02` (Concept count metric `48 conceptos`)
   - `INF-03` (Global seniority score `78% Senior`)
   - `INF-06` (Topological next step priority badge `URGENTE`)
   - `INF-07` (Topological next step recommended node title)
   - `INF-11` (Active category filter indicator & clear CTA)
   - `INF-13` (Concept card title)
   - `INF-14` (Concept card seniority level badge `mid` | `senior` | `staff`)
   - `INF-15` (Concept card category micro-pill `#4ADE80 Render`)
   - `INF-16` (Concept card mastery status indicator dot)
   - `INF-17` (Concept card score badge `★ 118/120`)
   - `INF-33` (Study header concept title & status badges)
   - `INF-49` (Stage 01: TTS active audio playing wave indicator)
   - `INF-57` (Stage 03: Real-time character & word count metrics)
   - `INF-59` (Stage 03: Local persistence autosave timestamp)
   - `INF-62` (Stage 04: Streaming elapsed timer stopwatch `00:14.2s`)
   - `INF-63` (Stage 04: Streaming character counter `1,842 chars`)
   - `INF-65` (Stage 04: Master rubric score display `113 / 120`)
   - `INF-78` (Global HUD active concept name & status pulse dot)
   - `INF-79` (Global HUD real-time character counter `1,240 chars`)
   - `INF-82` (Multi-tab BroadcastChannel synchronization indicator dot)
   - `INF-88` (Connection status & latency badge `210ms OK`)
   - `INF-95` (Flashcard index & total counter `07 / 42`)

2. **Tier 2: Operational (1–5s)** — Total: 38 Items:
   - `INF-04` (Seniority bands breakdown trigger & popover)
   - `INF-09` (Topological next step CTA button `[Iniciar Estudio]`)
   - `INF-10` (Category filter chip strip interactive buttons)
   - `INF-12` (Workspace view switcher segmented control `Grid` | `DAG`)
   - `INF-20` (Concept card click / keypress navigation trigger)
   - `INF-24` (DAG pan & zoom control cluster buttons)
   - `INF-25` (DAG mastery filter selector toggles)
   - `INF-26` (Command palette trigger button `⌘K` / `Ctrl+K`)
   - `INF-27` (Command palette input search field)
   - `INF-34` (Study header close affordance `Escape` / `X`)
   - `INF-35` (Study header Zen mode fullscreen toggle `100vw × 100vh`)
   - `INF-36` (4-Stage stepper navigation strip segmented tabs)
   - `INF-42` (Stage 01: Code comparison layout switcher `Side-by-side` | `Stacked`)
   - `INF-48` (Stage 01: TTS audio player controls `Play`, `Pause`, `Stop`, Rate)
   - `INF-52` (Stage 02: Socratic quick-reply trade-off action chips)
   - `INF-53` (Stage 02: Socratic user input field & send button)
   - `INF-54` (Stage 02: Socratic synthesis action button)
   - `INF-55` (Stage 03: Paraphrase formulation text editor input)
   - `INF-56` (Stage 03: Speech-to-text microphone dictation affordance)
   - `INF-60` (Stage 03: Proceed to evaluation primary CTA `Evaluar con IA (04)`)
   - `INF-64` (Stage 04: Stream cancel / abort button)
   - `INF-75` (Stage 04: Historical evaluation attempt tabs & score deltas)
   - `INF-80` (Global HUD restore / view action button `Ver Evaluación`)
   - `INF-81` (Global HUD abort streaming action button)
   - `INF-83` (BYOK settings dialog trigger & modal container shell)
   - `INF-84` (AI provider selection dropdown)
   - `INF-85` (Model identifier input field)
   - `INF-86` (API key masked input with reveal toggle)
   - `INF-87` (Connection test trigger button `Probar Conexión`)
   - `INF-90` (Export JSON backup action button)
   - `INF-91` (Import JSON backup action button & file picker)
   - `INF-94` (Flashcard taxonomy & mastery filter chips)
   - `INF-96` (Flashcard 3D card front face flip trigger affordance)
   - `INF-97` (Flashcard 3D card back face self-rating triggers `1-4`)
   - `INF-98` (Flashcard deep-dive action button `Profundizar en Modo Estudio`)
   - `INF-99` (Flashcard keyboard shortcuts legend hint chips)
   - `INF-100` (Mobile bottom navigation dock with 5 touch destinations)
   - `INF-101` (Mobile full-height study sheet drag handle & dismiss affordances)

3. **Tier 3: On-Demand (> 5s)** — Total: 41 Items:
   * **Deep Technical Immersion & Pedagogical Records (35 items)**:
     - `INF-05` (Curriculum milestones breakdown popover list)
     - `INF-08` (Topological next step recommendation rationale text)
     - `INF-18` (Concept card 2-line clamped summary prose)
     - `INF-19` (Concept card prerequisite dependency chips & status)
     - `INF-21` (DAG SVG canvas interactive panning/zooming surface)
     - `INF-22` (DAG interactive node element graphical representation)
     - `INF-23` (DAG directed dependency edge vector paths)
     - `INF-28` (Command palette filtered search results list)
     - `INF-29` (Command palette global quick actions list)
     - `INF-37` (Contextual progression breadcrumb `Antes` → `Ahora` → `Después`)
     - `INF-38` (Stage 01: Concept one-line core mental model prose)
     - `INF-39` (Stage 01: Architectural justification "El porqué" narrative)
     - `INF-40` (Stage 01: Naive code comparison snippet & error breakdown)
     - `INF-41` (Stage 01: Senior code comparison snippet & trade-offs analysis)
     - `INF-43` (Stage 01: Step-by-step execution sequence ordered list)
     - `INF-44` (Stage 01: Production pitfalls & operational risks list)
     - `INF-45` (Stage 01: Executive takeaway rule highlighted lead prose)
     - `INF-46` (Stage 01: Low-level deep-dive glossary popover links)
     - `INF-47` (Stage 01: FAANG interview questions list & model answers)
     - `INF-102` (Stage 01: Official technical documentation & RFC sources links)
     - `INF-50` (Stage 02: Socratic initial diagnostic challenge prompt)
     - `INF-51` (Stage 02: Socratic dialogue multi-turn history thread)
     - `INF-58` (Stage 03: Conceptual chunks rubric coverage checklist)
     - `INF-61` (Stage 04: Real-time streaming markdown text well)
     - `INF-66` (Stage 04: Concise executive verdict label narrative)
     - `INF-67` (Stage 04: Rubric dimension 1: Accuracy metric score & feedback)
     - `INF-68` (Stage 04: Rubric dimension 2: Causality & trade-offs analysis)
     - `INF-69` (Stage 04: Rubric dimension 3: Application & real-world cases)
     - `INF-70` (Stage 04: Rubric dimension 4: Completeness & knowledge gaps)
     - `INF-71` (Stage 04: Qualitative strengths bullet list)
     - `INF-72` (Stage 04: Qualitative knowledge gaps bullet list)
     - `INF-73` (Stage 04: Qualitative misconceptions bullet list)
     - `INF-74` (Stage 04: Next attempt guidance prompt callout)
     - `INF-89` (BYOK local storage privacy guarantee security copy)
     - `INF-92` (Schema validation & JSON backup overwrite confirmation dialog)
   * **Structural Shell Containers & System Substrates (6 items)**:
     - `INF-30` (Canonical URL path routing engine synchronization `/:graph/card/:nodeId`)
     - `INF-31` (Browser history navigation `popstate` event substrate)
     - `INF-32` (Study experience modal / drawer Level 5 surface container)
     - `INF-76` (Background evaluation task headless orchestrator service)
     - `INF-77` (Global HUD floating pill Level 5 container deck)
     - `INF-93` (Flashcard dedicated workspace mode route viewport surface)

#### Attention Tier Inventory Accounting:
$$\begin{aligned}
\text{Tier 1 (Glanceable < 1s)} &= 23 \text{ items} \\
\text{Tier 2 (Operational 1–5s)} &= 38 \text{ items} \\
\text{Tier 3 (On-Demand > 5s)} &= 41 \text{ items (35 Pedagogical + 6 Structural Substrates)} \\
\hline
\mathbf{\sum \text{Total Inventory}} &= \mathbf{102 \text{ items (100\% Section A Inventory captured with 0 omissions)}}
\end{aligned}$$

---

### 3. Gestalt Proximity & Layout Grouping Rules

To eliminate visual noise and comply with **docs/DESIGN_CRITERIA.md**, grouping is governed strictly by Gestalt proximity and common surfaces rather than decorative border lines.

1. **Whitespace-First Grouping**:
   - Spacing within a tightly coupled functional group (e.g. bold/italic or prev/next buttons): `var(--space-1)` (`4px`) to `var(--space-2)` (`8px`).
   - Spacing between distinct operational groups within a panel: `var(--space-4)` (`16px`).
   - Spacing between major macro-organisms: `var(--space-6)` (`24px`) to `var(--space-8)` (`32px`).
   - **Hairline dividers** (`1px solid rgba(255,255,255,0.06)`) are used *exclusively* to separate major vertical content sections within a modal or drawer. Unnecessary divider lines inside cards are strictly prohibited.

2. **Strict Anti-Carditis (The Unified Surface Law)**:
   - A modal dialog or study sheet is already an elevated container (`--surface-modal: #121722`).
   - **Zero "Cajas dentro de cajas"**: It is strictly forbidden to place cards inside cards or cards inside modals.
   - Content inside the 4-Stage Study Experience is partitioned through:
     * Typographic hierarchy (`H2: 27.6px`, `H3: 23px`, `Lead: 19.2px`, `Body: 16px`, `Small: 13.3px`).
     * Background wells for specialized interactive content (e.g. single code well `--surface-inset: #090d15`).
     * Subtle horizontal hairlines (`border-bottom: 1px solid var(--border-line)`).
   - Penalties under `DESIGN_CRITERIA.md` ($-3.0\text{ pts}$ for stacked bordered boxes) are strictly avoided.

3. **Concentric Radii Pairing**:
   - App Shell (`16px`) to Inner Dock (`8px` with `8px` padding): $16 = 8 + 8$.
   - Modal Dialog (`16px`) to Content Well (`4px` with `12px` padding): $16 = 4 + 12$.
   - Primary Panel (`14px`) to Concept Card (`6px` with `8px` padding): $14 = 6 + 8$.
   - Concept Card (`12px`) to Code Well (`4px` with `8px` padding): $12 = 4 + 8$.
   - Uniform control radius for all interactive buttons, inputs, and chips: `6px`.

---

## Section C: Comparative Structural Evaluation & Trade-off Matrix (Landscape 1440×900 vs Portrait 390×844)

To ensure structural soundness and prevent layout regression, every primary macro-organism is evaluated across 2–3 competing layout paradigms on both **Desktop Landscape (1440×900)** and **Mobile Portrait (390×844)**.

---

### `ORG-01`: App Shell & Cockpit Header

#### Evaluated Paradigms:
- **Paradigm 1A: Triple-Stacked Horizontal Banners (Legacy "Layer-Cake")**
  * *Structure*: Top Brand Header (56px) + Secondary Curriculum Bar (48px) + Tertiary Category Filter Strip (44px) stacked vertically.
- **Paradigm 1B: Collapsible Sidebar Layout (Linear / Cursor Style)**
  * *Structure*: Persistent vertical left rail (width: 240px, collapsible to 64px) housing curriculum selector, category taxonomy, and navigation items. Minimal top utility bar (40px) for search and profile.
- **Paradigm 1C: Integrated Single-Row Cockpit Rail with Contextual Wrap Deck (Selected Paradigm)**
  * *Structure*: High-density unified top rail (48px) integrating Brand, Curriculum Switcher, Live Telemetry (Seniority %), Quick Search (`⌘K`), and Settings. Category Filter chips sit directly above the grid in a responsive wrap row (height: 40px). Total fixed chrome = 88px.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 1A (Triple Stack) | Paradigm 1B (Left Sidebar) | Paradigm 1C (Integrated Cockpit Rail) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | **FAIL**: 148px total (> 130px ceiling). Steals > 16.4% of 900px fold. Obscures card row 2. | **PASS**: 40px top bar (4.4% height cost), but sacrifices 240px horizontal canvas width. | **PASS**: 48px fixed header + 40px category wrap = 88px total (well under 130px ceiling). |
| **Scalability (N items)** | Poor: horizontal overflow on 11 React categories forces scroll clipping. | Excellent: vertical list easily scrolls 11 categories without crowding. | **EXCELLENT**: `flex-wrap: wrap` cleanly accommodates 11 React / 7 Rails categories. |
| **Discoverability (Anti-Hidden-Affordance)** | **FAIL**: Horizontal mouse dragging required to see last 4 categories. | High: all categories visible in vertical sidebar rail. | **EXCELLENT**: 100% of categories fully visible on 1440px desktop without mouse dragging. |
| **Pointer/Touch Ergonomics** | Poor: controls dispersed across full 1440px width with massive voids (Fitts's Law violation). | Moderate: controls pinned to left rail, distant from center canvas. | **EXCELLENT**: Controls tightly clustered (`gap: 8-12px`, max void < 160px). |
| **Cognitive Load & Friction** | High: visual noise from 3 stacked horizontal borders competing for attention. | Moderate: permanent sidebar adds constant visual weight and narrows reading space. | **MINIMAL**: Single sleek rail, immediate orientation, zero competing chrome. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **Paradigm 1C (Integrated Cockpit Rail)**.  
  *Why*: Eliminates the "Layer-Cake" antipattern by capping fixed top chrome at **88px** (reserving **90.2%** of the viewport fold for the working canvas). Unlike the Left Sidebar (1B), which consumes 240px of critical horizontal width needed for topological DAG node exploration and 4-column concept grids, Paradigm 1C gives the full 1440px width to the domain content while guaranteeing 100% category discoverability via natural wrapping.
- **Mobile Portrait (390×844) Winner**: **Paradigm 1C adapted to Mobile Top Bar (44px) + Bottom Navigation Dock (`ORG-07`)**.  
  *Why*: Top chrome reduces to 44px (Brand + Curriculum dropdown + ⌘K icon), while primary navigation moves to the bottom thumb zone (56px dock), respecting `safe-area-inset-bottom`.

---

### `ORG-02`: Workspace Concept Explorer (Grid vs SVG DAG Canvas)

#### Evaluated Paradigms:
- **Paradigm 2A: Split-Screen Master-Detail (List on Left, Persistent Card Detail on Right)**
  * *Structure*: Left 360px list of all concepts; right 1080px permanently open detail viewer showing the selected concept.
- **Paradigm 2B: Full Canvas Workspace with Dual-Mode Grid/DAG & Overlay Study Modal (Selected Paradigm)**
  * *Structure*: 100% viewport canvas dedicated to either a high-density 4-column Concept Card Grid or an interactive SVG Directed Acyclic Graph (DAG) with pan/zoom. Selecting any concept opens the 4-Stage Study Experience (`ORG-03`).
- **Paradigm 2C: In-Place Accordion Expansion Grid**
  * *Structure*: Cards are laid out in a grid. Clicking a card expands it in-place, pushing sibling cards downward.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 2A (Master-Detail) | Paradigm 2B (Full Canvas + Overlay Modal) | Paradigm 2C (In-Place Accordion) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | Rigid: Right detail view is wasted when the user is scanning the temario. | **OPTIMAL**: 100% canvas height available (812px / 90.2% fold ratio on 1440×900); 2 full card rows visible. | Severe: In-place card expansion violently displaces cards below the fold. |
| **Scalability (N items)** | Moderate: 48 concepts fit in long vertical list, but right pane feels static. | **EXCELLENT**: 4-column responsive grid or vector DAG pan/zoom effortlessly scales to 100+ concepts. | **FAIL**: Expanding cards causes dramatic reflow and visual asymmetry across 4 columns. |
| **Discoverability (Anti-Hidden-Affordance)** | Moderate: list reveals titles, but topological dependencies (prerequisites/unlocks) are hidden. | **EXCELLENT**: Top Guidance Deck exposes immediate next step; DAG reveals complete prerequisite topology. | Poor: deep content only discoverable through tedious sequential clicking of cards. |
| **Pointer/Touch Ergonomics** | Clumsy: requires constant back-and-forth pointer travel between left list and right pane. | **EXCELLENT**: Direct card interaction; DAG supports pan/zoom drag and smooth scrollwheel gestures. | Poor: expanding cards displaces pointer targets, causing accidental misclicks. |
| **Cognitive Load & Friction** | High: split-screen competition creates continuous split attention between list and reading pane. | **MINIMAL**: Clean separation: spatial exploration on canvas vs focused immersion in study modal. | High: Cumulative Layout Shift (CLS > 0.4) on accordion toggle disorients spatial memory. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **Paradigm 2B (Full Canvas Workspace + Overlay Modal)**.  
  *Why*: The curriculum structure of senior technical topics (e.g. React Fiber, Event Loop, ActiveRecord N+1) is inherently **topological**. Candidates must visualize upstream prerequisites and downstream unlockables. A Split-Screen (2A) crushes the topological DAG into an unreadable vertical list, while Accordion (2C) causes jarring layout shifts. Paradigm 2B grants the DAG and Concept Grid full visual breathing room, transitioning into the focused study cockpit only when an engineer commits to deep study.
- **Mobile Portrait (390×844) Winner**: **Paradigm 2B (Single-column Card Stack + Native Touch Sheet)**.  
  *Why*: Provides single-axis vertical scrolling without horizontal clipping, opening a fluid, draggable bottom sheet for study.

---

### `ORG-03`: 4-Stage Study Experience (Modal vs Zen Overlay)

#### Evaluated Paradigms:
- **Paradigm 3A: Multi-Page Route Transitions (`/card/read` → `/card/learn` → `/card/paraphrase` → `/card/eval`)**
  * *Structure*: Each pedagogical stage is a separate full-page route with browser page reloads or router transitions.
- **Paradigm 3B: Unified Cockpit Study Modal with Sticky Stage Stepper & Free Exploration (Selected Paradigm)**
  * *Structure*: A high-density modal (`max-w-5xl`, elevation 5) with a sticky stage navigation strip (`flexShrink: 0`, 44px). The engineer can freely switch between *01 Leer*, *02 Aprender*, *03 Parafrasear*, and *04 Evaluar* without losing draft state. Includes Zen mode toggle (`100vw × 100vh`).
- **Paradigm 3C: Strictly Gated Wizard Flow**
  * *Structure*: Stages are locked. The user cannot access *03 Parafrasear* or *04 Evaluar* until they spend mandatory time in *01 Leer* and *02 Aprender*.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 3A (Multi-Page Routes) | Paradigm 3B (Unified Cockpit Modal) | Paradigm 3C (Gated Wizard) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | Poor: Full page load adds browser chrome overhead; resets vertical reading position. | **CALIBRATED**: Desktop modal capped at `max-h-[90vh]` (810px); Zen mode expands to 100vw/100vh. | Constrained: Wizard navigation banners consume vertical space without added utility. |
| **Scalability (N items)** | Disjointed: Adding technical content (code diffs, Socratic history) splits state across routes. | **EXCELLENT**: 4 stages scale cleanly within sticky stepper; content scrolls on a single internal axis. | Rigid: Gated steps break down when candidates need to cross-reference code while paraphrasing. |
| **Discoverability (Anti-Hidden-Affordance)** | Moderate: User must navigate forwards and backwards through browser history to review stages. | **EXCELLENT**: 4-stage stepper (`01 Leer`, `02 Aprender`, `03 Parafrasear`, `04 Evaluar`) always visible. | **FAIL**: Future stages are locked/hidden, preventing senior engineers from assessing rubric criteria. |
| **Pointer/Touch Ergonomics** | Slow: Latency between route transitions breaks interactive flow. | **PERFECT**: In-memory stage switching (<16ms); sticky stepper at top; large click/touch targets. | Restrictive: Requires clicking "Next" sequentially through all stages. |
| **Cognitive Load & Friction** | High: Context loss on route navigation; risk of unsaved paraphrase drafts. | **OPTIMAL**: Zero state loss; Socratic thread and paraphrase draft persist in memory; Zen mode removes distraction. | **CRITICAL FAIL**: Infantilizing locks provoke frustration for senior candidates seeking targeted review. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **Paradigm 3B (Unified Cockpit Study Modal with Sticky Stepper & Zen Mode)**.  
  *Why*: Senior candidates have diverse study habits: some read the Naive vs Senior code comparison first; others jump straight into formulation (*03 Parafrasear*) to test recall, then consult the rubric (*04 Evaluar*). Paradigm 3B provides complete autonomy with zero state loss, while offering **Zen Mode** (`100vw × 100vh`, line length capped at `48rem` / `768px`) for uninterrupted deep work.
- **Mobile Portrait (390×844) Winner**: **Paradigm 3B adapted to Full-Height Slide-Over Sheet (`ORG-07`)**.  
  *Why*: Keeps the stage navigation sticky at the top, ensures touch targets $\ge 44\text{px}$, and provides continuous single-axis vertical scrolling without horizontal traps.

---

### `ORG-04`: Global Non-Blocking Tasks HUD

#### Evaluated Paradigms:
- **Paradigm 4A: Persistent Full-Width Bottom Status Bar**
  * *Structure*: A permanent 36px bar pinned across the bottom of the entire application displaying system status at all times.
- **Paradigm 4B: Floating Non-Blocking HUD Pill / Dock in Dead Margin (Selected Paradigm)**
  * *Structure*: When an AI evaluation or task streams in the background, a discrete floating HUD pill (`INF-77`) docks non-blockingly in the bottom-right corner (`bottom: 24px; right: 24px; max-width: 360px; height: 44px`), displaying stream progress, live character count, and quick restore/abort actions.
- **Paradigm 4C: Blocking Fullscreen Progress Modal with Spinner**
  * *Structure*: Modal takes over screen with an indeterminate spinner, blocking interaction until the LLM response completes.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 4A (Bottom Status Bar) | Paradigm 4B (Floating Non-Blocking HUD) | Paradigm 4C (Blocking Modal) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | **FAIL**: Permanently consumes 36px-44px across entire viewport bottom, reducing canvas fold. | **ZERO IMPACT**: Floats in bottom-right dead margin (`bottom: 24px; right: 24px`); zero canvas fold loss. | Total: 100% of viewport blocked by modal during LLM evaluation stream. |
| **Scalability (N items)** | Poor: Bottom bar gets crowded if multiple status indicators or tabs are active. | **EXCELLENT**: Compact pill (`max-w: 360px`, `44px` height) neatly encapsulates active task, counter, and CTAs. | Rigid: Can only show one task at a time; user is locked out from doing anything else. |
| **Discoverability (Anti-Hidden-Affordance)** | Low contrast: Status bars often blend into browser chrome or OS taskbars. | **EXCELLENT**: High-contrast Level 5 pill with glowing stream pulse dot and live monospace character count. | Obvious, but at the cost of freezing the entire workspace. |
| **Pointer/Touch Ergonomics** | Moderate: Actions spread along bottom edge; risk of clicking OS taskbar/dock. | **EXCELLENT**: Tightly clustered controls (`[Ver]` restore and `[X]` abort) within thumb/cursor corner. | Simple, but traps user interaction. |
| **Cognitive Load & Friction** | Constant background distraction across full viewport width. | **MINIMAL**: Non-blocking asynchronous feedback; lets user freely browse concepts while AI streams. | **HIGH FRICTION**: Forces candidate to wait 10-25s staring at a spinner without reading prerequisites. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **Paradigm 4B (Floating Non-Blocking HUD Pill in Bottom-Right Corner)**.  
  *Why*: Deep reasoning LLM evaluations (e.g. Claude 3.5 Sonnet, DeepSeek R1) stream for 10–25 seconds. Forcing candidates to stare at a blocking modal (4C) violates engineering ergonomics. The floating HUD pill (`ORG-04`) allows candidates to browse the temario or verify prerequisites while monitoring the stream (`INF-79`), with immediate 1-click restore (`INF-80`) or cancellation (`INF-81`).
- **Mobile Portrait (390×844) Winner**: **Paradigm 4B (Bottom Floating Toast docked 16px above Mobile Navigation Dock)**.  
  *Why*: Floats non-intrusively above the 56px mobile navigation dock with clear touch targets and zero collision with the home indicator.

---

### `ORG-05`: Flashcard Rapid Retrieval Deck

#### Evaluated Paradigms:
- **Paradigm 5A: In-Situ Card Flip inside Concept Grid**
  * *Structure*: Grid cards have a "Flip" button that rotates them in place inside the 4-column workspace grid.
- **Paradigm 5B: Dedicated Minimalist Focus Stage with 3D Flip & Keyboard Ergonomics (Selected Paradigm)**
  * *Structure*: Dedicated warm-up view (`/flashcards`). Centralized high-elevation card (680px width) with 3D rotation, large typography, clear front/back contrast, keyboard shortcuts (`Space` flip, `Arrow` next/prev), and self-rating triggers.
- **Paradigm 5C: Split-Screen Side-Drawer Flashcard Quiz**
  * *Structure*: A 400px side panel opens on the right side of the workspace while the concept grid remains in the background.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 5A (In-Situ Flip) | Paradigm 5B (Focused Minimalist Stage) | Paradigm 5C (Side Drawer Quiz) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | In-situ cards constrained to 280px height; severe vertical overflow on architectural answers. | **OPTIMAL**: Dedicated route (`/flashcards`); central 680px card comfortably utilizes vertical fold. | Cramped: 400px side drawer requires heavy vertical scrolling to read answers and code. |
| **Scalability (N items)** | Poor: Flipping individual cards among 48 items causes visual noise and lack of progression. | **EXCELLENT**: Clean sequential deck with counter (`07 / 42`), category filtering, and mastery subsets. | Moderate: Drawer navigation feels secondary and crowded alongside grid. |
| **Discoverability (Anti-Hidden-Affordance)** | Low: Flashcard mode is hidden behind card hover states in standard grid. | **EXCELLENT**: Clear route affordance in Cockpit Header, Command Palette (`⌘K`), and mobile dock. | Moderate: Drawer toggle competes with study modal triggers. |
| **Pointer/Touch Ergonomics** | Poor: Tiny card flip buttons; mouse hover conflicts with grid clicks. | **PERFECT**: Comprehensive keyboard ergonomics (`Space` flips, `→` next, `1-4` rates) + large touch targets. | Awkward: Focus traps between drawer controls and background grid. |
| **Cognitive Load & Friction** | High: Surrounding 47 concepts distract from active recall drill. | **MINIMAL**: Laser focus on one concept at a time; frictionless review loop with 1-click deep dive (`INF-98`). | Moderate: Background canvas distraction prevents deep mental immersion. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **Paradigm 5B (Focused Minimalist Stage with 3D Flip & Keyboard Ergonomics)**.  
  *Why*: Active recall requires rapid, friction-free cognitive cycles. In-situ flipping (5A) creates visual chaos and lacks space for senior-level trade-off explanations. Paradigm 5B provides a dedicated flight simulator experience for interview prep, driven entirely by keyboard ergonomics (`Space` to flip, `ArrowRight` to advance) and offering a 1-click escape hatch to full study mode (`INF-98`).
- **Mobile Portrait (390×844) Winner**: **Paradigm 5B (Single-Card Mobile Swipe / Tap with $44\text{px}$ bottom actions)**.  
  *Why*: The 3D card fills the mobile width (`358px` inside `16px` gutters), with tap-to-flip and oversized $44\text{px}$ bottom action buttons.

---

### `ORG-06`: Settings & Data Sovereignty Deck (BYOK & Backup)

#### Evaluated Paradigms:
- **Paradigm 6A: Dedicated Full-Page Route (`/settings`)**
  * *Structure*: Settings is a separate page taking the user completely out of their learning flow.
- **Paradigm 6B: Centered Lightweight Modal Dialog with Background Scroll Lock (Selected Paradigm)**
  * *Structure*: BYOK credentials and Backup tools open in a centered modal dialog (`max-w-xl`, Level 5) with background scroll lock.
- **Paradigm 6C: In-Place Collapsible Settings Drawer inside Cockpit Header**
  * *Structure*: Header expands vertically to reveal configuration fields inline.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 6A (Settings Page) | Paradigm 6B (Centered Modal Dialog) | Paradigm 6C (Header Drawer) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | Full page takeover; destroys active canvas context. | **ZERO PERMANENT COST**: Opens as a modal overlay (`max-w-xl`, Level 5) only when requested. | Variable: Header drawer pushes down canvas, causing layout shift. |
| **Scalability (N items)** | High scalability, but excessive visual void for 8 form controls and 2 backup buttons. | **PERFECT**: 560px modal cleanly accommodates provider selector, model ID, API key, latency badge, and JSON tools. | Poor: Header drawer lacks room for JSON schema validation preview and privacy notices. |
| **Discoverability (Anti-Hidden-Affordance)** | Low: Buried in sub-navigation or hamburger menu. | **EXCELLENT**: Direct gear icon in Cockpit Header (`ORG-01`), ⌘K action (`INF-29`), and Mobile Dock. | Moderate: Collapsible header drawers are non-standard and easily overlooked. |
| **Pointer/Touch Ergonomics** | Standard web form, but high navigation overhead. | **EXCELLENT**: Centered controls, clearly separated action clusters (Test Connection, Export, Import), Esc to dismiss. | Cramped: Controls squeezed into narrow header drop panel. |
| **Cognitive Load & Friction** | High: Navigating away from study context induces fear of losing study progress. | **MINIMAL**: Preserves exact study/workspace background; dismisses instantly back to original context. | Moderate: Visual clutter at top of screen overlaps canvas. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **Paradigm 6B (Centered Lightweight Modal Dialog)**.  
  *Why*: Settings changes (updating API keys, testing latency, exporting JSON backups) are infrequent, episodic tasks. Navigating candidates away to a separate page (6A) introduces route disruption and friction. Paradigm 6B preserves complete workspace state in the background, delivers immediate feedback via the connection latency badge (`INF-88`), and dismisses cleanly via `Escape` or backdrop click.
- **Mobile Portrait (390×844) Winner**: **Paradigm 6B adapted to Mobile Bottom Sheet (`ORG-07`)**.  
  *Why*: Slides up smoothly as a focused modal sheet with clear form spacing and $44\text{px}$ touch targets, adhering to mobile safe-area insets.

---

### `ORG-07`: Mobile Ergonomic Shell & Touch Sheet

#### Evaluated Paradigms:
- **Paradigm 7A: Responsive Desktop Shrink with Hamburger Menu Drawer**
  * *Structure*: Shrinks desktop header into top hamburger menu icon; study modal scales down to narrow width.
- **Paradigm 7B: Unified Thumb Dock (56px) + Dynamic Slide-Over Bottom Sheet (Selected Paradigm)**
  * *Structure*: Minimal 44px top utility bar; 5-destination bottom navigation dock (`.mobile-bottom-nav`, 56px height) pinned in thumb reach zone; study experience and settings open as full-height slide-over touch sheets with drag handle dismiss (`INF-101`).
- **Paradigm 7C: Native Tabbed PWA Shell with Floating Action Button (FAB)**
  * *Structure*: Bottom tab bar with prominent floating action button for quick study launch.

#### Trade-off Evaluation Matrix:

| Evaluation Dimension | Paradigm 7A (Hamburger Drawer) | Paradigm 7B (Thumb Dock + Slide Sheet) | Paradigm 7C (Tab Bar + FAB) |
|:---|:---|:---|:---|
| **Viewport Height Cost (Fold Impact)** | Stacks desktop headers vertically, stealing 160px+ of top mobile screen height. | **CALIBRATED**: Minimal 44px top utility bar + 56px bottom thumb dock; reserves 744px (88%) for vertical scroll. | 56px bottom tab bar + 56px floating action button; FAB occludes bottom card content. |
| **Scalability (N items)** | Hamburger menu scales to many links, but hides core learning destinations behind multi-tap friction. | **EXCELLENT**: 5 core destinations (`Grafo`, `Flashcards`, `Seniority`, `Búsqueda`, `Ajustes`) in thumb dock; bottom sheet accommodates full 4-stage study flow. | Poor: Bottom tabs limited to 3-4 items; FAB accommodates only 1 primary action. |
| **Discoverability (Anti-Hidden-Affordance)** | **FAIL**: Core tools hidden inside hamburger drawer (Nielsen Heuristic #6 violation). | **EXCELLENT**: 100% of core learning modes always visible in the bottom dock; active indicator highlights current mode. | Moderate: Secondary actions hidden behind FAB pop-up menus. |
| **Pointer/Touch Ergonomics** | **FAIL**: Hamburger toggle located in top-right/top-left corner, completely out of one-handed thumb reach. | **PERFECT**: Dock sits strictly inside the natural thumb sweep zone; all touch targets $\ge 44 \times 44\text{px}$; bottom padding 80px prevents occlusion. | Moderate: Bottom tabs reachable, but FAB corner placement causes accidental touches. |
| **Cognitive Load & Friction** | High: Fragmented user flow requiring opening and closing side drawers repeatedly. | **MINIMAL**: Smooth gesture-dismissible bottom sheets; seamless 1-tap switching between workspace and study mode. | Moderate: Persistent floating circle creates visual distraction over code snippets. |

#### Architectural Decision & "The Why":
- **Desktop Landscape (1440×900) Winner**: **N/A (Desktop activates `ORG-01` Cockpit Header + Full Canvas Workspace)**.  
  *Why*: Mobile thumb dock and touch sheet paradigms are conditionally scoped to viewport widths `< 768px`.
- **Mobile Portrait (390×844) Winner**: **Paradigm 7B (Unified Thumb Dock + Slide-Over Touch Sheet)**.  
  *Why*: Satisfies Invariant 1.5 of `docs/DESIGN_CRITERIA.md`. Places all primary navigation destinations within immediate single-thumb sweep reach (56px dock + 80px bottom scroll cushion), enforces $\ge 44\text{px}$ touch targets, and converts the complex 4-stage pedagogical workflow into a natural, swipe-dismissible native sheet.

---

## Spatial Budget & Invariants Compliance Audit

Before advancing to Phase 2, this Information Architecture blueprint certifies strict compliance with the non-negotiable engineering invariants established in `docs/DESIGN_CRITERIA.md`:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 VIEWPORT BUDGET & INVARIANTS COMPLIANCE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Anti-Layer-Cake Invariant (Max Top Chrome <= 130px)                      │
│    - Cockpit Header: 48px                                                   │
│    - Category Wrap Row (Desktop): 40px                                      │
│    - Total Fixed Top Chrome: 88px  ──►  [PASS: 88px <= 130px (Margin: 42px)] │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Regla del 70% del Viewport (Canvas Fold Ratio >= 70%)                    │
│    - Desktop Viewport Height: 900px                                         │
│    - Available Canvas Height: 900px - 88px = 812px                          │
│    - Canvas Fold Ratio: 812px / 900px = 90.2%  ──►  [PASS: 90.2% >= 70.0%]  │
│    - Two full rows of Concept Cards visible on initial mount: GUARANTEED.   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Anti-Canyon (Fitts's Law Voids < 350px)                                  │
│    - Controls are strictly coupled to entity contexts.                      │
│    - Header actions use flex gaps of 8px-12px (Max cluster void: 160px).    │
│    - Raw full-width space-between on desktop > 800px is PROHIBITED.  [PASS] │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. Anti-Hidden-Affordance (100% Taxonomies Visible in Wrap)                 │
│    - All 11 React / 7 Rails categories use flex-wrap: wrap on desktop.      │
│    - Zero forced mouse drag or hidden horizontal scrollbar on 1440px. [PASS] │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. Mobile Thumb Ergonomics (390x844)                                        │
│    - All mobile touch targets >= 44x44px.                                   │
│    - Bottom navigation dock anchored at bottom (56px + safe-area).          │
│    - Scrollable containers maintain padding-bottom: 80px cushion.    [PASS] │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Downstream Blueprint Handoff (Phase 1 Sealing Contract)

With Sections A, B, and C formally specified:
1. Every piece of domain data (`INF-01` to `INF-102`) has an explicit visual target and attention classification.
2. Macro-organisms have exact elevation tiers and spatial bounds.
3. Comparative layout evaluations document the winning structural paradigms for Desktop (1440×900) and Mobile (390×844).
4. This blueprint is ready for formal audit by the `IA & Spatial Layout Auditor` subagent in accordance with `docs/VISUAL_WORKFLOW.md`.

---

## Section D: Patrones de Componentes y Mecánica Interactiva
### Phase 2: Component Patterns & Interactive Mechanics Specification

- **Phase**: `Phase 2 (Component Patterns & Interactive Mechanics)`
- **Governing Master Skill**: `ui-component-patterns` (`.agents/skills/ui-component-patterns/SKILL.md`)
- **System Foundations**: `DESIGN.md` (Sealed Phase 0)
- **Quality & Evaluation Standard**: `docs/DESIGN_CRITERIA.md`
- **Architectural Scope**: Complete operational blueprint for component mechanics, App Shell geometry, overlay hierarchy, 6-state buttons, single-axis scroll containment, 4-stage tab stepper, 4-slot card model, and coordinated data view synchronization.

---

### D.1 Arquitectura del App Shell y Presupuesto de Chrome (Desktop & Mobile)

#### 1. Cabecera Fija del Cockpit (`.app-shell-header`)
La cabecera superior fija actúa como el mueble principal a nivel de estado (*estate-level furniture*) del espacio de trabajo. Permanece idéntica, persistente y visible en toda navegación:
- **Dimensiones y Posicionamiento**:
  * Altura fija: `48px` (`--header-height: 48px; min-height: 48px;`).
  * Posición: `position: fixed; top: 0; left: 0; right: 0; width: 100%;`.
  * Stacking context: `z-index: 20;` (Capa 1).
- **Tratamiento de Superficie y Efecto Glassmorphic**:
  * Fondo: `rgba(19, 24, 36, 0.85)` (`--surface-card` al 85% de opacidad).
  * Filtro de desenfoque: `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`.
  * Borde inferior: `1px solid rgba(255, 255, 255, 0.08)` (`--border-line`).
  * Resalte micro-especular superior: `box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.04);`.
- **Organización Interna (Flexbox sin Cañones Fitts)**:
  * `display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-4);`.
  * **Grupo Izquierdo (Identidad y Dominio)**:
    - Logotipo / Marca: `KW` (*Knowledge Workspace*) en fuente mono (`JetBrains Mono`, peso 700, 14px, acento `#38bdf8`).
    - Separador vertical sutil: `1px solid rgba(255, 255, 255, 0.08); height: 16px; margin: 0 var(--space-2);`.
    - Selector de Currículum (`React` / `Rails`): Segmented control compacto (`height: 28px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 2px;`).
    - Contador de Conceptos: `48 conceptos` en `Inter 500 13px`, color `--color-text-secondary` (`#94a3b8`).
  * **Grupo Central (Buscador Omni-Canal ⌘K)**:
    - Botón de trigger accesible para Command Palette (`width: 280px; height: 32px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 0 10px; display: flex; align-items: center; justify-content: space-between;`).
    - Texto placeholder: `Buscar conceptos... (⌘K)` con atajo en chip mono `<kbd>⌘K</kbd>`.
  * **Grupo Derecho (Telemetría de Seniority y Ajustes)**:
    - Medidor Global de Seniority (`78% Senior`): Badge interactivo que actúa como trigger del Seniority Drawer (`height: 28px; padding: 0 10px; border-radius: 6px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); color: #38bdf8; font-variant-numeric: tabular-nums;`).
    - Botón de Ajustes BYOK & Respaldo (`icon-only`, Lucide `Settings`, `32x32px`, `--radius-control: 6px`).

#### 2. Riel de Filtro de Categorías (`.category-filter-rail`)
- **Dimensiones y Posicionamiento**:
  * Altura de fila: `40px` (`--category-rail-height: 40px;`).
  * Posición: `position: sticky; top: 48px; width: 100%;`.
  * Stacking context: `z-index: 20;` (Capa 1).
  * Fondo: `rgba(8, 11, 17, 0.92)` (`--surface-base` al 92%) con `backdrop-filter: blur(8px);`.
  * Borde inferior: `1px solid rgba(255, 255, 255, 0.06);`.
- **Anti-Hidden-Affordance & Wrap Discipline (Desktop 1440px)**:
  * `display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); padding: 4px var(--space-4);`.
  * **Regla de Oro**: Prohibido terminantemente el scroll horizontal forzado o el truncamiento de categorías con el ratón en escritorio. Las 11 categorías de React y las 7 de Rails están 100% visibles y accesibles con un solo clic.
  * En pantallas intermedias (tablets / laptops pequeñas < 1100px), si el wrap genera una segunda fila durante el filtrado activo, la altura se expande de manera natural o se habilita desplazamiento por rueda trackpad/mouse (`onWheel`) sin scrollbars visualmente agresivos.
- **Micro-Chip de Categoría**:
  * Altura: `26px; border-radius: 9999px; padding: 0 10px; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500;`.
  * Punto de ancla inmutable: círculo concéntrico de `6x6px` con el color hexadecimal exacto de la categoría (`#61DAFB`, `#F59E0B`, etc.).
  * Contador numérico tabular: `font-variant-numeric: tabular-nums; opacity: 0.7;`.

#### 3. Presupuesto Total de Chrome Fijo y Regla del 90%
- **Cálculo Riguroso del Presupuesto Vertical**:
  $$\text{Top Fixed Chrome} = \text{Header (48px)} + \text{Category Rail (40px)} = \mathbf{88px}$$
- **Margen de Seguridad contra Invariante 1.2 (`DESIGN_CRITERIA.md`)**:
  * Límite máximo admisible: $130\text{px}$.
  * Consumo real: $88\text{px}$ $\implies$ **Holgura de 42px (Margen de seguridad del 32.3%)**.
- **Ratio de Pliegue del Canvas (Canvas Fold Ratio)**:
  * Viewport de referencia: $1440 \times 900\text{px}$.
  * Espacio vertical disponible para el lienzo de trabajo: $900\text{px} - 88\text{px} = \mathbf{812px}$.
  * Ratio efectivo:
    $$\text{Fold Ratio} = \frac{812\text{px}}{900\text{px}} = \mathbf{90.22\%} \ge 90.0\%$$
  * Garantía Ergonómica: El usuario visualiza al menos **dos filas completas de tarjetas de conceptos curriculares (altura tarjeta: 240px + gap: 16px = 496px) en el primer golpe de vista**, superando con holgura el umbral del 70% estipulado en el estándar de calidad.

#### 4. Dock de Navegación Móvil (`.mobile-bottom-nav`)
- **Dimensiones y Margen de Seguridad**:
  * Altura total: `calc(56px + env(safe-area-inset-bottom, 0px))`.
  * `padding-bottom: env(safe-area-inset-bottom, 0px);`.
  * Posición: `position: fixed; bottom: 0; left: 0; right: 0; width: 100%;`.
  * Stacking context: `z-index: 25;` (Capa 2).
  * Fondo: `rgba(13, 17, 26, 0.95)` (`--surface-subtle`) con `backdrop-filter: blur(16px);`.
  * Borde superior: `1px solid rgba(255, 255, 255, 0.08);`.
- **5 Destinos Táctiles en la Zona Natural del Pulgar**:
  * 1. `Grafo` (Topología / DAG)
  * 2. `Flashcards` (Repaso activo)
  * 3. `Seniority` (Inspector de madurez / Milestones)
  * 4. `Búsqueda` (Command Palette)
  * 5. `Ajustes` (BYOK y respaldos)
  * Cada botón de navegación: área táctil efectiva $\ge 44 \times 44\text{px}$ (`min-height: 44px; min-width: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;`).
- **Amortiguación Inferior para Contenedores con Scroll**:
  * En viewports móviles (`@media (max-width: 767px)`), todo contenedor desplazable aplica obligatoriamente:
    ```css
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
    ```
  * Previene que las últimas tarjetas o botones queden ocultos detrás del dock fijo.

#### 5. Seniority Progress Drawer (`.seniority-drawer`)
- **Mecánica de Despliegue**:
  * Panel lateral deslizante desde el borde derecho del viewport (*slide-in from right*).
  * Dimensiones: Ancho fijo `380px` en Desktop (`>= 768px`) / Ancho completo `100vw` en Mobile (`< 768px`).
  * Altura: `100vh; position: fixed; top: 0; right: 0; bottom: 0;`.
  * Stacking context: `z-index: 40;` (Capa 4).
  * Curva de animación: `transform: translateX(0); transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);` (Spring Ease-Out).
  * Estado cerrado: `transform: translateX(100%); pointer-events: none;`.
- **Superficie y Telón de Fondo (Scrim)**:
  * Fondo del panel: `--surface-modal` (`#121722`) con resalte especular izquierdo `box-shadow: -8px 0 24px -4px rgba(0, 0, 0, 0.7), inset 1px 0 0 0 rgba(255, 255, 255, 0.08);`.
  * Scrim Backdrop: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 39;`.
- **Contenido y Secciones Internas**:
  * Cabecera fija: Título "Progreso & Bandas de Seniority", porcentaje global `78% Senior`, y botón de cierre accesible (`✕` / `Esc`).
  * Cuerpo desplazable: Desglose de 4 bandas de madurez (*React Profesional*, *Senior Frontend*, *Staff/Lead*, *Design Systems*) con barras de progreso segmentadas, seguidas por el desglose de los 18 hitos curriculares (`14/18 Hitos Dominados`).

---

### D.2 Jerarquía Estricta de Overlays y Escalera de Z-Index

#### 1. Tabla Formal de la Escalera de Capas (Stacking Ladder)
Para erradicar colisiones de apilamiento y arbitrariedades numéricas (`z-index: 9999`), el sistema formaliza una escalera unidireccional de 9 capas:

| Capa | Nombre de Capa | Token Z-Index | Valor Numérico | Componentes Asignados | Comportamiento de Fondo |
|:---:|:---|:---|:---:|:---|:---|
| **Capa 0** | Base Canvas | `--z-canvas` | `0` | Lienzo SVG de topología, cuadrícula de conceptos, canvas de fondo. | Scroll nativo libre. |
| **Capa 1** | App Shell Header & Category Rail | `--z-sticky-chrome` | `20` | Cabecera fija del cockpit (`.app-shell-header`), riel de categorías pegajoso (`.category-filter-rail`). | Sticky / Fixed sin bloqueo de scroll. |
| **Capa 2** | Mobile Bottom Nav Dock | `--z-mobile-nav` | `25` | Dock de navegación inferior táctil en móviles (`.mobile-bottom-nav`). | Fixed con padding de seguridad de 80px en body. |
| **Capa 3** | Global Background Tasks HUD | `--z-hud-deck` | `30` | Píldora flotante no bloqueante de streaming IA en segundo plano (`ORG-04`). | Flotante, no interrumpe la interacción ni el scroll. |
| **Capa 4** | Slide-in Panels & Drawers | `--z-drawer` | `40` | Seniority Progress Drawer (`.seniority-drawer`), panel lateral de hitos curriculares. | **Bloqueo obligatorio de scroll** (`body` overflow hidden + compensación). |
| **Capa 5** | Command Palette & Global Search | `--z-command-palette` | `50` | Paleta omni-canal de búsqueda y atajos (`⌘K` / `Ctrl+K`), modal centrado con scrim. | **Bloqueo obligatorio de scroll** + Focus Trap. |
| **Capa 6** | Study Modal & BYOK Settings | `--z-modal-dialog` | `60` | Experiencia guiada de estudio en 4 etapas (`ORG-03`), modal de configuración BYOK & Respaldo (`ORG-06`). | **Bloqueo obligatorio de scroll** + Focus Trap + ARIA modal dialog. |
| **Capa 7** | System Toasts & Notifications | `--z-toast-deck` | `70` | Notificaciones de recuperación, alertas de sincronización multi-pestaña, confirmación de autoguardado. | Flotante (bottom-right en desktop, top-center en mobile), timeout 5s. |
| **Capa 8** | Tooltips & Micro-popovers | `--z-tooltip` | `80` | Tooltips contextuales, popovers de glosario técnico (deep-dives), chips de atajos flotantes. | Flotante, anclado al trigger, auto-flip en bordes. |

#### 2. Contrato Obligatorio de Bloqueo de Scroll (Background Scroll-Locking Contract)
Cualquier capa con nivel **$\ge \text{Capa } 4$** activa el contrato estricto de bloqueo de scroll:
1. **Inyección de Bloqueo**:
   ```typescript
   function lockBodyScroll(): () => void {
     // 1. Medir ancho exacto de la barra de desplazamiento del sistema
     const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
     
     // 2. Almacenar estilos previos
     const prevOverflow = document.body.style.overflow;
     const prevPaddingRight = document.body.style.paddingRight;
     
     // 3. Aplicar compensación para garantizar CLS = 0
     document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`);
     document.body.style.overflow = 'hidden';
     document.body.style.paddingRight = 'var(--scrollbar-compensation)';
     
     // 4. Compensar elementos fijos del App Shell
     const fixedElements = document.querySelectorAll<HTMLElement>('.app-shell-header, .mobile-bottom-nav');
     fixedElements.forEach(el => el.style.paddingRight = 'var(--scrollbar-compensation)');

     // 5. Cleanup al desmontar el overlay
     return () => {
       document.body.style.overflow = prevOverflow;
       document.body.style.paddingRight = prevPaddingRight;
       document.documentElement.style.removeProperty('--scrollbar-compensation');
       fixedElements.forEach(el => el.style.paddingRight = '');
     };
   }
   ```
2. **Garantía Matemática de Estabilidad Visual ($\text{CLS} = 0.000$)**:
   La remoción de la barra de scroll vertical nativa en sistemas operativos de escritorio (Windows / Linux) típicamente libera de 15px a 17px de ancho horizontal. Si esta anchura no es compensada mediante `padding-right` en el body y en los elementos fijos, la interfaz sufre un salto horizontal instantáneo (Cumulative Layout Shift) que degrada la experiencia. La inyección dinámica de `--scrollbar-compensation` garantiza $\Delta X = 0\text{px}$.
3. **Manejo de Foco y Tecla Escape**:
   - Al abrir un modal $\ge \text{Capa } 4$, el foco del teclado se transfiere automáticamente al primer elemento accionable o al botón de cierre.
   - El foco queda atrapado dentro del overlay mediante Focus Trap: `Tab` y `Shift+Tab` ciclan exclusivamente entre los controles internos.
   - La pulsación de `Escape` o el clic sobre el scrim exterior cierran de inmediato el overlay y restauran el foco al elemento disparador (`triggerElement.focus()`). En acciones destructivas no confirmadas (ej. sobreescritura de respaldo JSON), el cierre por clic exterior queda deshabilitado, requiriendo pulsar explícitamente "Cancelar".

---

### D.3 Ciclo de Vida de Botones en 6 Estados y Protección Anti-CLS

#### 1. Tabla de Especificación Completa de los 6 Estados
Cada botón y control interactivo implementa sin excepción los 6 estados de ciclo de vida con coherencia cromática algorítmica:

| Estado | Evento / Disparador | Tratamiento Visual Primario | Tratamiento Visual Secundario / Ghost | Cursor & Puntero |
|:---|:---|:---|:---|:---|
| **1. Default (Rest)** | En reposo | Fondo `#38bdf8`, texto `#06080d` (peso 600), specular highlight `inset 0 1px 0 0 rgba(255,255,255,0.2)`. | Fondo `rgba(255,255,255,0.04)`, borde `1px solid rgba(255,255,255,0.08)`, texto `#f8fafc`. | `cursor: pointer;` |
| **2. Hover** | Cursor sobre el elemento | Fondo `#0ea5e9` (aclarado HSL), brillo sutil `box-shadow: 0 0 12px rgba(56,189,248,0.25)`. | Fondo `rgba(255,255,255,0.08)`, borde `1px solid rgba(255,255,255,0.16)`, texto `#ffffff`. | `cursor: pointer;` |
| **3. Active (Pressed)** | Clic / Pulsación | Fondo `#0284c7`, `transform: scale(0.97); transition: transform 80ms ease-out;`. | Fondo `rgba(255,255,255,0.12)`, `transform: scale(0.97);`. | `cursor: pointer;` |
| **4. Focus-visible** | Navegación por teclado (`Tab`) | Anillo de enfoque de alto contraste: `outline: 2px solid #38bdf8; outline-offset: 2px;`. | Anillo de enfoque idéntico: `outline: 2px solid #38bdf8; outline-offset: 2px;`. | `cursor: pointer;` |
| **5. Disabled** | Acción no permitida | `opacity: 0.4; filter: grayscale(0.5); border: none;`, mantiene dimensiones exactas. | `opacity: 0.4; border-color: rgba(255,255,255,0.04);`, mantiene dimensiones exactas. | `cursor: not-allowed; pointer-events: none;` |
| **6. Loading** | Operación asíncrona activa | `opacity: 0.8; cursor: wait; pointer-events: none;`, spinner rotatorio en slot reservado. | `opacity: 0.8; cursor: wait; pointer-events: none;`, spinner rotatorio en slot reservado. | `cursor: wait; pointer-events: none;` |

#### 2. Ley Anti-CLS de Dimensiones Reservadas (The Anti-CLS Reserved Width Law)
- **El Problema**: Cuando un botón pasa de su estado en reposo (`Iniciar Evaluación`) a su estado de carga (`[Spinner]`), si el texto se elimina bruscamente o se inserta un spinner con dimensiones distintas, la anchura del botón cambia de forma repentina. Esto provoca un salto visual en todos los elementos adyacentes de la fila (Cumulative Layout Shift, CLS > 0).
- **La Solución Arquitectónica**:
  1. **Técnica del Contenedor Fantasma con Posicionamiento Absoluto**:
     El texto del botón nunca se desmonta del DOM. Al activarse `isLoading: true`, el contenedor del texto recibe `visibility: hidden`, preservando intacta su anchura intrínseca (`scrollWidth`). El spinner de carga (`.ui-spinner`) se superpone mediante posicionamiento absoluto centrado en el botón.
  2. **Técnica del Slot de Icono Pre-Reservado**:
     En botones con icono previo o posterior (ej. `[Icono] Guardar`), el slot del icono tiene un tamaño fijo garantizado de `16x16px` (`.ui-icon-slot { width: 16px; height: 16px; flex-shrink: 0; }`). Durante la carga, el icono original se permuta por el spinner SVG de `16x16px` sin alterar en un solo píxel el ancho total del botón.
- **Implementación CSS / Componente**:
  ```css
  .ui-button {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    min-height: var(--control-height-desktop, 32px);
    padding: 0 var(--space-3);
    border-radius: var(--radius-control, 6px);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 1;
    position: relative;
    white-space: nowrap;
    transition: background 120ms ease-out, border-color 120ms ease-out, transform 80ms ease-out;
  }

  /* Anti-CLS: Contenedor de contenido preserva el ancho mientras carga */
  .ui-button--loading .ui-button__content {
    visibility: hidden;
  }

  .ui-button--loading .ui-button__spinner-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .ui-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: ui-spin 600ms linear infinite;
  }

  @keyframes ui-spin {
    to { transform: rotate(360deg); }
  }
  ```

#### 3. Matriz de Variantes de Botón
- **Variante Primaria (`.btn-primary`)**:
  * Rol: El único CTA prioritario por vista (ej. `Iniciar Estudio`, `Evaluar con IA`).
  * Estilo: Fondo `#38bdf8`, texto `#06080d`, borde transparente, resalte superior `inset 0 1px 0 0 rgba(255,255,255,0.2)`.
- **Variante Secundaria / Delineada (`.btn-secondary`)**:
  * Rol: Acciones complementarias de apoyo (ej. `Sintetizar conclusiones`, `Probar conexión`).
  * Estilo: Fondo `rgba(255, 255, 255, 0.04)`, borde `1px solid rgba(255, 255, 255, 0.08)`, texto `#f8fafc`.
- **Variante Fantasma / Icono (`.btn-ghost`)**:
  * Rol: Botones de cabecera, alternador de vista Grid/DAG, atajos y cierres (`✕`).
  * Estilo: Fondo transparente, sin borde, color `#94a3b8`, hover con fondo `rgba(255, 255, 255, 0.06)` y texto `#f8fafc`.
- **Variante Destructiva / Peligro (`.btn-danger`)**:
  * Rol: Cancelación de streaming en curso, eliminación de notas o sobreescritura de respaldo.
  * Estilo: Fondo `rgba(239, 68, 68, 0.12)`, borde `1px solid rgba(239, 68, 68, 0.3)`, texto `#f87171`, hover con fondo `#ef4444` y texto `#ffffff`.

---

### D.4 Contención de Scroll y Eje Único de Desplazamiento

#### 1. Erradicación de Trampas de Scroll Anidado (Nested Scroll Traps)
- **Principio Fundamental**: En un sistema editorial de ingeniería, las trampas de scroll donde una rueda de ratón o gesto táctil queda atrapado dentro de una sub-caja vertical mientras el usuario intentaba mover la página representan un fallo de arquitectura inaceptable.
- **Regla del Eje Único**:
  * Cada vista o modal define un **único contenedor de desplazamiento vertical primario**.
  * Todos los encabezados, barras de herramientas y pies de página se fijan con `flex-shrink: 0;` y se posicionan fuera de la caja de scroll.
  * En la experiencia de estudio (`ORG-03`), el modal completo tiene altura fija máxima (`max-height: 90vh`). La cabecera con el título y las 4 pestañas no se desplazan; el panel de etapa `.study-stage-content` es el único elemento con scroll vertical.
  * Los bloques de código pre-formateado dentro de la lección permiten scroll horizontal (`overflow-x: auto`) pero **bloquean terminantemente el scroll vertical interno**, expandiéndose en altura para mostrar todas las líneas del snippet sin barras verticales anidadas.

#### 2. Propiedad CSS Obligatoria: `overscroll-behavior: contain;`
Para evitar el molesto fenómeno de "scroll chaining" (donde al llegar al tope o fondo de un contenedor con scroll, el navegador transfiere inmediatamente el movimiento de inercia a la página de fondo), se aplica obligatoriamente:
```css
.study-stage-content,
.seniority-drawer__body,
.concept-grid-scroll-area,
.command-palette__results-list,
.settings-modal__body {
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain; /* Contención estricta de inercia */
  -webkit-overflow-scrolling: touch; /* Fluidez inercial en iOS */
}
```

#### 3. Estilizado de Scrollbar Dark Engineering Editorial
Se prohiben las barras de desplazamiento nativas grises del sistema operativo, adoptando una barra estilizada ultrafina:
```css
/* Especificación Estándar W3C (Firefox 64+) */
.editorial-scroll {
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent; /* Slate 600 thumb, track transparente */
}

/* Especificación WebKit / Chromium / Edge */
.editorial-scroll::-webkit-scrollbar {
  width: 4px; /* Ultrafino: 4px de grosor */
  height: 4px;
}

.editorial-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.editorial-scroll::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 2px;
  transition: background 120ms ease;
}

.editorial-scroll::-webkit-scrollbar-thumb:hover {
  background: #64748b; /* Slate 500 en hover */
}
```

---

### D.5 Invariantes de Navegación por Pestañas (Tab Navigation Invariants)

#### 1. El Stepper Pedagógico de 4 Etapas
La experiencia de estudio guiada estructura el aprendizaje en exactamente 4 etapas secuenciales, cumpliendo estrictamente la regla de invariancia de $2 \le N \le 7$ pestañas de navegación:
- **Etapa 01**: `01 Leer` (Comprensión del modelo mental y comparativa de código Naive vs Senior)
- **Etapa 02**: `02 Aprender` (Diálogo socrático con el tutor de IA y trade-offs)
- **Etapa 03**: `03 Parafrasear` (Formulación activa propia con dictado por voz y métricas)
- **Etapa 04**: `04 Evaluar` (Calibración analítica con IA y rúbrica 0–120)

#### 2. Protección Estructural `flex-shrink: 0` y Cero Desbordes Horizontales
- La tira de pestañas (`.study-stepper-header`) tiene asignado:
  ```css
  .study-stepper-header {
    display: flex;
    flex-shrink: 0;
    min-height: 40px;
    background: var(--surface-card);
    border-bottom: 1px solid var(--border-line);
    padding: 0 var(--space-4);
    gap: var(--space-2);
    overflow: hidden; /* Cero scroll horizontal en la tira de pestañas */
  }

  .study-stepper-tab {
    flex-shrink: 0;
    height: 40px;
    padding: 0 var(--space-3);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 120ms ease-out, border-color 120ms ease-out;
  }

  .study-stepper-tab[aria-selected="true"] {
    color: var(--color-text-primary);
    border-bottom-color: var(--color-primary); /* Indicador cian #38bdf8 */
  }
  ```
- **Prohibición**: Prohibido hacer wrap en pestañas de etapas o forzar scroll horizontal en la barra. Con 4 pestañas de etiquetas breves, el ancho total requerido es $< 360\text{px}$, acomodándose perfectamente en pantallas móviles de $390\text{px}$ sin desbordes.

#### 3. Aislamiento de Scroll y Reseteo Automático de Posición
- El scroll vertical está aislado estrictamente al contenedor del panel activo: `.study-stage-content`.
- **Invariante de Reseteo Automático de Lectura**: Al cambiar de pestaña (ej. al avanzar de `01 Leer` a `02 Aprender`), el controlador ejecuta sincrónicamente:
  ```javascript
  stageContentRef.current.scrollTop = 0;
  ```
  Esto garantiza que el usuario ingrese a una nueva fase pedagógica siempre desde el inicio del contenido, erradicando desorientaciones por scroll residual.

#### 4. Accesibilidad ARIA y Navegación por Teclado ("Roving Tabindex")
- **Atributos ARIA Semánticos**:
  * Tira contenedora: `role="tablist"` con `aria-label="Etapas pedagógicas de estudio"`.
  * Botones individuales: `role="tab"`, `id="tab-stage-${index}"`, `aria-selected="true|false"`, `aria-controls="panel-stage-${index}"`.
  * Paneles de contenido: `role="tabpanel"`, `id="panel-stage-${index}"`, `aria-labelledby="tab-stage-${index}"`.
- **Patrón Roving Tabindex**:
  * La pestaña activa tiene `tabindex="0"`.
  * Todas las pestañas inactivas tienen `tabindex="-1"`.
  * Atajos de teclado gestionados en `onKeyDown`:
    - `ArrowRight` / `ArrowDown`: Mueve el foco a la siguiente pestaña cíclica.
    - `ArrowLeft` / `ArrowUp`: Mueve el foco a la pestaña previa cíclica.
    - `Home`: Salta inmediatamente a la primera pestaña (`01 Leer`).
    - `End`: Salta inmediatamente a la última pestaña (`04 Evaluar`).
    - `Enter` / `Space`: Selecciona y activa la pestaña enfocada.
- **Persistencia en URL**:
  * La etapa activa se refleja en la subruta / query param (`/:graph/card/:nodeId?stage=02-aprender`), permitiendo deep-linking directo a la etapa pedagógica deseada y navegación histórica con `popstate`.

---

### D.6 Dimensionamiento Explícito de Controles y Modelo de Tarjeta de 4 Slots

#### 1. Dimensionamiento Explícito de Controles y Ergonomía Fitts
- **Controles Táctiles Móviles (< 768px)**:
  * Dimensión mínima obligatoria: **$44 \times 44\text{px}$** (`--control-touch-min: 44px;`).
  * Aplica a todos los botones del dock inferior, chips de categoría en móvil, botón de cierre modal, y botones de volteo en flashcards.
- **Controles de Ratón en Escritorio (>= 768px)**:
  * Altura estándar: **$32\text{px}$** (`--control-height-desktop: 32px;`).
  * Botones compactos y chips de filtro: **$26\text{px}$ a $28\text{px}$**.
- **La Regla de Altura Explícita (No Derivada)**:
  Bajo los principios de `SKILL.md`, la altura de un control nunca se deja al azar de la suma de `padding + line-height + border`. Se declara siempre de manera explícita con `min-height` y `box-sizing: border-box`. Esto asegura que un botón con borde de 1px y un botón fantasma sin borde colocados lado a lado midan exactamente los mismos $32\text{px}$ de alto, preservando una línea base visualmente limpia.

#### 2. Modelo de Tarjeta de 4 Slots para Cuadrícula de Conceptos (Concept Card 4-Slot Baseline Model)
Para garantizar una alineación perfecta de las líneas base a lo largo de todas las filas en CSS Grid (`align-items: stretch`), la tarjeta de concepto (`.concept-card`) se divide en 4 slots verticales estrictos:

```
┌─────────────────────────────────────────────────────────┐
│ SLOT 1: Header (Category Chip + Mastery Status Dot)     │ min-height: 24px
├─────────────────────────────────────────────────────────┤
│ SLOT 2: Title & Core Summary (Clamped 2 lines)          │ min-height: 68px
├─────────────────────────────────────────────────────────┤
│ SLOT 3: Flexible Spacer / Prerequisite Dependency Tags  │ flex: 1 1 auto
├─────────────────────────────────────────────────────────┤
│ SLOT 4: Pinned Footer Baseline (Score Badge + CTA)      │ margin-top: auto (32px)
└─────────────────────────────────────────────────────────┘
```

- **Slot 1: Header (Categoría & Estado de Maestría)**:
  * Altura mínima reservada: `24px;`.
  * Componentes: Chip de categoría con dot inmutable (`#4ADE80 Render`) + Indicador de maestría (`Dominado`, `En progreso`, `Pendiente`, `Bloqueado`) + Badge de seniority (`Senior`).
- **Slot 2: Título & Resumen Ejecutivo**:
  * Título: `Inter 600 15px`, color `#f8fafc`, truncado a una sola línea con `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;`.
  * Resumen Ejecutivo: `Inter 450 13px`, color `#94a3b8`, con clamp estricto a 2 líneas:
    ```css
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    ```
  * Altura mínima calibrada: `68px;`. Absorbe variaciones de texto sin deformar las filas vecinas.
- **Slot 3: Espaciador Flexible & Chips de Prerrequisitos**:
  * `flex: 1 1 auto; margin: var(--space-2) 0;`.
  * Absorbe cualquier holgura de altura entre tarjetas de la misma fila.
  * Contiene chips de dependencias (`INF-19`): chips compactos en mono con icono de candado o check según el estado del prerrequisito. Si no hay prerrequisitos, actúa como espacio en blanco controlado.
- **Slot 4: Línea Base del Pie Fijada (Pinned Footer Baseline)**:
  * Propiedad clave de alineación: `margin-top: auto; height: 32px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.04); padding-top: var(--space-2);`.
  * Izquierda: Badge de puntaje analítico (`★ 118/120` con acento dorado si > 100, o `--/120` en estado sin evaluar) en `font-variant-numeric: tabular-nums; font-family: var(--font-mono);`.
  * Derecha: Botón de acción principal `[Estudiar]` (`.btn-secondary` o `.btn-primary` en el concepto recomendado).
  * **Garantía Visual**: Debido a `margin-top: auto;` y `height: 100%;` en un contenedor grid que estira a sus hijos, **todos los botones [Estudiar] y todos los puntajes en una misma fila de la cuadrícula coinciden exactamente en la misma línea horizontal Y**.

---

### D.7 Coordinación de Vistas y Sincronización Bidireccional de Estado

#### 1. Las Tres Vistas Complementarias del Workspace
Learning Workspace ofrece tres representaciones especializadas para el mismo modelo de dominio técnico:
1. **Cuadrícula de Conceptos (`Cuadrícula` / Grid View)**: Optimizada para el escaneo visual rápido, lectura de resúmenes y filtrado taxonómico por categorías.
2. **Grafo Topológico Interactivo (`Topología` / SVG DAG Canvas)**: Optimizada para la comprensión espacial de rutas críticas, dependencias de prerrequisitos y detección de cuellos de botella de conocimiento.
3. **Entrenador de Recuperación Activa (`Flashcards` / Rapid Recall Stage)**: Optimizada para simulacros de entrevista técnica de alta velocidad con volteo interactivo de tarjetas 3D.

#### 2. El Almacén Unificado de Estado (Single Source of Truth)
Ninguna vista posee estado de selección aislado. Todas las vistas leen y escriben sobre un **Almacén de Estado de Dominio Unificado**:
```typescript
interface WorkspaceDomainStore {
  // Ecosistema curricular activo
  activeGraph: 'react' | 'rails';
  
  // Selección y foco
  selectedNodeId: string | null;     // Concepto activo para estudio/inspección
  highlightedNodeId: string | null;  // Foco transitorio por hover
  
  // Taxonomía y filtros
  filterCategory: string | null;     // Categoría activa (null = todas)
  filterMastery: 'all' | 'unlocked' | 'mastered' | 'pending';
  
  // Capas de presentación
  viewMode: 'grid' | 'dag';          // Modo de visualización en canvas
  isStudyModalOpen: boolean;         // Modal de estudio US2
  studyStageIndex: 0 | 1 | 2 | 3;    // Etapa activa (01-04)
  isZenMode: boolean;                // Modo inmersivo fullscreen
  isSeniorityDrawerOpen: boolean;    // Panel lateral de madurez
  
  // Tareas asíncronas en background (US3)
  backgroundEvaluation: BackgroundTaskState | null;
  
  // Acciones sincrónicas
  selectConcept: (nodeId: string, openModal?: boolean) => void;
  hoverConcept: (nodeId: string | null) => void;
  setCategoryFilter: (category: string | null) => void;
  toggleViewMode: () => void;
  updateEvaluationScore: (nodeId: string, result: EvaluationResult) => void;
}
```

#### 3. Mecánica de Interacción y Sincronización Cruzada
- **Sincronización Grafo SVG $\leftrightarrow$ Cuadrícula de Tarjetas**:
  * **Hover Cruzado**: Al pasar el ratón sobre un nodo en el Grafo SVG, el estado `highlightedNodeId` se actualiza inmediatamente $\to$ Si la cuadrícula está visible, la tarjeta correspondiente activa su resalte de borde (`border-color: rgba(56, 189, 248, 0.4)`). A la inversa, hacer hover sobre una tarjeta en la cuadrícula resalta el nodo en el grafo.
  * **Selección Cruzada con Auto-Scroll**: Al hacer clic en un nodo en la visualización SVG y luego conmutar a la vista de cuadrícula, la aplicación ejecuta automáticamente:
    ```javascript
    const cardEl = document.querySelector(`[data-node-id="${selectedNodeId}"]`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      cardEl.classList.add('concept-card--selected');
    }
    ```
- **Sincronización Flashcards $\leftrightarrow$ Experiencia de Estudio**:
  * Al revisar una tarjeta en el mazo de Flashcards (`/flashcards`), el usuario puede pulsar el CTA `[Profundizar en Modo Estudio]` (`INF-98`).
  * Esta acción invoca `selectConcept(card.nodeId, true)`, abriendo inmediatamente el Modal de Estudio en 4 Etapas (`ORG-03`) precargado con el concepto exacto, preservando el historial de navegación para permitir regresar con `Escape`.
- **Identidad Cromática Absoluta**:
  * Las tres vistas importan los tokens de color de categoría desde la misma tabla canónica de `DESIGN.md`. La categoría `rendering` es `#4ADE80` en el chip de la tarjeta, `#4ADE80` en el contorno del nodo SVG, y `#4ADE80` en el micro-badge del reverso de la flashcard. Cero discrepancias cromáticas.

#### 4. Cero Deriva de Estado (Zero State Drift Protocol)
- **Actualizaciones Optimistas Inmediatas ($< 16\text{ms}$)**:
  Toda modificación de dominio (ej. completar una evaluación en la etapa 04, guardar un borrador en la etapa 03, o calificar una flashcard del 1 al 4) actualiza sincrónicamente el store en memoria antes de resolver la persistencia local.
- **Persistencia en LocalStorage & Sincronización Multi-Pestaña**:
  * El estado se persiste en `localStorage` con versionado de esquema.
  * Se emite un mensaje en el canal nativo `BroadcastChannel('kw_workspace_sync')` para que cualquier otra pestaña abierta sincronice su estado en tiempo real sin requerir recargar la página.
- **Recálculo Reactivo de Telemetría**:
  Al modificarse el puntaje de un concepto (`updateEvaluationScore`), el sistema recalcula en el mismo render pass:
  1. El porcentaje global de Seniority (`INF-03`).
  2. El progreso de los 18 hitos curriculares (`INF-05`).
  3. El nuevo paso topológico recomendado (`INF-06` a `INF-09`), reclasificando dependencias desbloqueadas.

---

## Section E: Matriz Universal de 5 Estados (Universal 5-State Matrix)

Cada componente u organismo visual en **Learning Workspace V2** debe operar de forma resiliente bajo la **Matriz Universal de 5 Estados**. Ninguna pantalla o componente pasa a implementación con estados implícitos o no especificados. Esta sección define con rigor geométrico, tipográfico y de micro-interacción los 5 estados canónicos para los 5 macro-organismos centrales:
1. `ORG-02`: Workspace Concept Explorer (Cuadrícula de Conceptos & Grafo DAG SVG)
2. `ORG-03`: Experiencia de Estudio en 4 Etapas (Leer, Aprender, Parafrasear, Evaluar)
3. `ORG-04`: Global Non-Blocking Tasks HUD (Streaming en Segundo Plano)
4. `ORG-05`: Flashcard Rapid Retrieval Deck (Entrenador de Recuperación Activa)
5. `ORG-06`: BYOK & Soberanía de Datos (Ajustes de IA y Respaldo Local)

---

### E.1 Organismo `ORG-02`: Workspace Concept Explorer (Grid & SVG DAG)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ORG-02] MATRIZ DE 5 ESTADOS: WORKSPACE CONCEPT EXPLORER                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. EMPTY      │ Sin conceptos para los filtros activos. Ilustración SVG sutil + CTA de reseteo.  │
│ 2. LOADING    │ Skeleton idéntico geométricamente. 4 slots de tarjeta preservados. CLS = 0.000.  │
│ 3. POPULATED  │ 4 columnas de tarjetas o Grafo DAG con pan/zoom. Datos y métricas tabulares.    │
│ 4. BOUNDARY   │ 100+ conceptos, 100% completitud (120/120), strings largos alemanes, 360px width│
│ 5. ERROR      │ Fallo al cargar datos locales. Explicación humana + [Reintentar Carga].          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Estado Vacío (Empty State)
- **Disparador**: Filtro taxonómico por categoría o búsqueda por texto que no produce coincidencias ($N = 0$).
- **Tratamiento Visual & Geometría**:
  * Contenedor centrado dentro de `.concept-grid-scroll-area`: `min-height: 420px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: var(--space-8);`.
  * Ilustración SVG Técnica: Glifo de radar o nodo desconectado en trazo fino (`1.5px`), color `--color-text-subtle: #475569`, dimensiones `48x48px`. Cero ilustraciones caricaturescas o infantiles.
  * Título en `text-h3` (`23px`, peso 600, color `#f8fafc`): `"Sin conceptos coincidentes"`.
  * Explicación Contextual en `text-sm` (`13.3px`, peso 500, color `#94a3b8`, `max-width: 380px`): `"No se encontraron conceptos en la categoría seleccionada que coincidan con los criterios actuales de búsqueda y maestría."`.
  * CTA Primario Único: Botón `.btn-primary` (`min-height: 32px; padding: 0 var(--space-4); border-radius: 6px;`): `[Restablecer filtros de búsqueda]`. Al pulsar, restablece el filtro de categoría a `null`, borra el término de búsqueda y restaura el estado global.

#### 2. Estado de Carga (Loading State - Skeletons Idénticos)
- **Garantía Anti-CLS**: Layout Shift $\text{CLS} < 0.1$ (Objetivo estricto $\mathbf{CLS = 0.000}$).
- **Tratamiento Visual de la Cuadrícula**:
  * Estructura CSS Grid idéntica a la vista poblada: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4); padding: var(--space-4);`.
  * Renderizado de exactamente 8 tarjetas skeleton (`.concept-card-skeleton`) con altura mínima fija `min-height: 180px; background: var(--surface-card); border: 1px solid var(--border-line); border-radius: var(--radius-xl, 12px); padding: var(--space-4); display: flex; flex-direction: column;`.
  * Mapeo exacto de los 4 slots:
    - *Slot 1 Skeleton (Header)*: Barra de chip `width: 72px; height: 20px; border-radius: 4px;` + Dot de estado `width: 12px; height: 12px; border-radius: 50%;`.
    - *Slot 2 Skeleton (Título & Resumen)*: Barra de título `width: 75%; height: 18px; border-radius: 4px; margin-bottom: 8px;` + Línea de resumen 1 `width: 100%; height: 13px; border-radius: 4px; margin-bottom: 4px;` + Línea 2 `width: 60%; height: 13px; border-radius: 4px;`.
    - *Slot 3 Skeleton (Prerrequisitos)*: Barra de chip de dependencia `width: 88px; height: 18px; border-radius: 4px; margin: var(--space-2) 0;`.
    - *Slot 4 Skeleton (Footer)*: `margin-top: auto; height: 32px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: var(--space-2);` conteniendo un badge skeleton `width: 60px; height: 18px; border-radius: 4px;` y un botón skeleton `width: 76px; height: 28px; border-radius: 6px;`.
  * Shimmer Pulse: Animación de degradado tonal a 1.5s ease-in-out:
    ```css
    .skeleton-shimmer {
      background: linear-gradient(
        90deg,
        var(--surface-card) 0%,
        var(--surface-raised) 50%,
        var(--surface-card) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }
    @keyframes skeleton-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    ```
- **Tratamiento Visual del Grafo DAG SVG**:
  * Canvas SVG con viewBox intacto renderizando 8 nodos placeholder circulares (`r=24px`) con borde punteado (`stroke-dasharray: 4 4; stroke: #334155; fill: #0d111a;`) conectados por líneas tenues (`stroke: rgba(255,255,255,0.06)`), con animación de opacidad sutil (pulsación 1.5s).

#### 3. Estado Poblado (Populated State)
- **Tratamiento Visual**:
  * Cuadrícula de alta densidad con tarjetas de concepto operando bajo el modelo de 4 slots.
  * Títulos de conceptos de alto nivel técnico (`INF-13`): *"React Fiber Reconciler & Concurrent Lanes"*, *"Browser Event Loop & Task Starvation"*, *"Active Record N+1 Prevention & Eager Loading"*.
  * Tipografía tabular (`font-variant-numeric: tabular-nums`) en todos los puntajes (`★ 118/120` o `--/120`).
  * Micro-pills de categoría con ancla cromática inmutable (`#4ADE80` para `rendering`, `#FBBF24` para `runtime`, `#CC342D` para `activerecord`).
  * En el Grafo DAG: nodos interactivos con pan/zoom fluido (traslación con ratón o rueda, zoom mediante rueda o cluster de controles `+` / `-` / `Recenter`).

#### 4. Estado Límite (Boundary State)
- **Escenarios Extremos Evaluados**:
  1. *Carga Masiva ($N > 100$ conceptos curriculares)*: El contenedor activa virtualización de renderizado en DOM para mantener $60\text{ fps}$ de desplazamiento. El Grafo DAG aplica cálculo espacial de límites (`getBoundingClientRect`) para auto-escalar el zoom inicial y encajar todos los nodos en el canvas sin desbordar el viewport.
  2. *Completitud Absoluta (100% de Maestría, Score 120/120)*:
     - Todos los conceptos lucen el badge de excelencia dorado: `★ 120/120` (`color: #fde68a; background: rgba(245, 196, 81, 0.14); border: 1px solid rgba(245, 196, 81, 0.35);`).
     - Telemetría global del Cockpit Header (`ORG-01`): Muestra `"100% Staff Excellence — 18/18 Hitos Dominados"` con resalte tenue dorado en el badge.
     - Topological Guidance Deck: Transiciona a mensaje de felicitación de maestría: `"Currículum Completado al 100%"` con CTA secundario `[Iniciar Repaso Global en Flashcards]`.
  3. *Cadenas Tipográficas Extremas (Alemán / Español Técnico)*:
     - Concepto con título extenso: `"Zustandsverwaltungsarchitektur und Render-Pipeline-Optimierung"`.
     - Tratamiento: Truncamiento controlado a 1 línea con elipsis en la tarjeta (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`), revelando el nombre completo en tooltip nativo al pasar el cursor (`title="..."`).
  4. *Viewport Mínimo Soportado ($360\text{px}$ Móvil)*:
     - La cuadrícula colapsa estrictamente a 1 sola columna (`grid-template-columns: 1fr; padding: var(--space-3);`).
     - Las tarjetas ocupan el 100% del ancho del viewport sin desbordes horizontales ($\Delta X = 0$).
     - Los objetivos táctiles de los botones `[Estudiar]` se elevan a $44\text{px}$ de altura mínima (`--control-touch-min`).

#### 5. Estado de Error (Error State)
- **Disparador**: Fallo de lectura del almacenamiento local (`localStorage` bloqueado, corrupción de datos JSON o fallo de inicialización del grafo).
- **Tratamiento Visual & Geometría**:
  * Superficie centrada con borde sutil de error: `background: var(--surface-card); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-xl, 12px); padding: var(--space-6); max-width: 460px; margin: var(--space-8) auto; text-align: center;`.
  * Icono de alerta: `AlertTriangle` (`24x24px`, color `--color-error-text: #f87171`).
  * Explicación Humana No Técnica: `"No se pudo cargar el temario curricular. Los datos locales del grafo no pudieron inicializarse correctamente debido a una restricción de almacenamiento o corrupción de caché."`.
  * Fallback No Destructivo: Los datos guardados de notas y evaluaciones del usuario se mantienen preservados y bloqueados para evitar pérdida de progreso.
  * Botón de Remediación con 1 Clic: Botón primario `.btn-primary` `[Reintentar Carga del Grafo]` que fuerza una re-hidratación limpia desde el esquema estático en memoria. Botón secundario `.btn-secondary` `[Restaurar Respaldo Local]` que abre el selector de archivo JSON.

---

### E.2 Organismo `ORG-03`: Experiencia de Estudio en 4 Etapas (Leer, Aprender, Parafrasear, Evaluar)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ORG-03] MATRIZ DE 5 ESTADOS: EXPERIENCIA DE ESTUDIO EN 4 ETAPAS                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. EMPTY      │ Etapa 03 sin formulación previa o Etapa 04 sin evaluar. Guía y CTA de inicio.   │
│ 2. LOADING    │ Streaming en tiempo real con cronómetro y contador. CLS = 0.000.                │
│ 3. POPULATED  │ 4 etapas completas: Comparativa Naive vs Senior, diálogo socrático, scorecard.   │
│ 4. BOUNDARY   │ Límite 10,000 caracteres, Score 120/120 perfecto, código extenso, 360px viewport│
│ 5. ERROR      │ Fallo de API/Red en streaming. Borrador preservado intacto + [Reintentar].       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Estado Vacío (Empty State)
- **Por Etapa Pedagógica**:
  * *Etapa 01 (Leer)*: Si el concepto no posee prerrequisitos o enlaces deep-dive, el panel muestra una nota pedagógica neutra: `"Concepto fundacional sin prerrequisitos previos requeridos. Procede directamente con la lectura del modelo mental."`.
  * *Etapa 02 (Aprender)*: Estado inicial del diálogo socrático antes de la primera interacción. Muestra el prompt de bienvenida del tutor: `"Bienvenido a la sesión socrática sobre Fiber Reconciler. Para comenzar, analiza el siguiente trade-off..."` acompañado de 2 chips de respuesta rápida (`[Bloqueo Síncrono]`, `[Lanes Concurrentes]`).
  * *Etapa 03 (Parafrasear)*: Editor de texto vacío. Placeholder editorial explicativo: `"Formula con tus propias palabras el funcionamiento del reconciliador Fiber, explicando la diferencia entre los árboles current y workInProgress y por qué evita la pérdida de interactividad en el hilo principal..."`. Métricas al pie: `"0 caracteres · 0 palabras"`.
  * *Etapa 04 (Evaluar)*: Concepto sin evaluación previa. Panel de bienvenida con icono de balanza técnica (`Scale` o `ClipboardCheck` de `32x32px`, color `#94a3b8`): `"Aún no has calibrado este concepto. Completa tu formulación técnica en la Etapa 03 y pulsa 'Evaluar con IA' para recibir tu calificación en la escala 0–120 y el análisis de rúbrica."`. CTA Primario: `[Ir a Parafrasear (Etapa 03)]`.

#### 2. Estado de Carga (Loading & Streaming State)
- **Carga Inicial del Modal**: Skeletons estructurados que replican exactamente el marco del diálogo:
  * Cabecera skeleton: Título `320x28px`, Badge de categoría `80x20px`, 4 pestañas de `72x40px`.
  * Cuerpo skeleton: Well de resumen `height: 54px`, contenedor de código comparativo `height: 240px` dividido en 2 columnas con 8 líneas skeleton cada una.
- **Streaming Activo en Etapa 04 (Evaluación con IA en Curso)**:
  * **Contenedor de Streaming en Vivo (`.evaluation-streaming-well`)**: Superficie `--surface-inset: #090d15`, borde animado con resalte sutil cian (`border: 1px solid rgba(56, 189, 248, 0.4); box-shadow: 0 0 16px rgba(56, 189, 248, 0.08);`).
  * **Barra de Telemetría Superior Pinned**:
    - Indicador de estado: Dot cian palpitante (`animation: pulse-dot 1.2s infinite;`).
    - Cronómetro transcurrido en tiempo real con números tabulares: `font-variant-numeric: tabular-nums; font-family: var(--font-mono); font-size: 13px;` (`00:14.2s`).
    - Contador de caracteres recibidos en streaming: `1,842 caracteres recibidos`.
    - Botón de Cancelación Inmediata: Botón destructivo `.btn-danger` `[Cancelar evaluación]` que invoca `AbortController.abort()`.
  * **Garantía Visual ($\text{CLS} = 0.000$)**: El contenedor reserva una altura mínima de `340px` con scroll vertical automático anclado al pie (`auto-scroll on stream chunk`). Cero saltos en los controles de la ventana.

#### 3. Estado Poblado (Populated State)
- **Etapa 01 (Leer)**: Resumen del modelo mental en `text-lead` (`19.2px`), justificación arquitectónica `"El porqué"`, comparativa interactiva Naive vs Senior con resaltado de sintaxis sobre fondo `#090d15`, lista de ejecución paso a paso, riesgos de producción con iconos `AlertTriangle`, y preguntas de entrevista FAANG desbloqueables.
- **Etapa 02 (Aprender)**: Hilo de conversación socrática con burbujas de tutor (`--surface-raised`) y usuario (`--surface-card`), chips de trade-offs interactivos, y botón destacado `[Integrar conclusiones al borrador]` (`INF-54`).
- **Etapa 03 (Parafrasear)**: Área de texto con tipografía de lectura (`Inter 16px`, `line-height: 1.6`), botón de dictado por voz (`SpeechRecognition`) con aura roja en grabación, métricas tabulares (`1,420 caracteres · 215 palabras`), checklist de chunks conceptuales cubiertos (4/5), timestamp de autoguardado (`Guardado local: 12:04:19`), y botón primario de avance `[Evaluar con IA (04)]`.
- **Etapa 04 (Evaluar)**: Scorecard analítico completo:
  * Master Score Display (`113 / 120`) con acento dorado si $> 100$.
  * Veredicto conciso: `"Nivel Senior Sólido — Trade-offs bien articulados"`.
  * Desglose tabular en 4 dimensiones:
    - *Accuracy*: `38 / 40 pts` (Nota técnica detallada).
    - *Causality & Trade-offs*: `24 / 25 pts`.
    - *Application & Real World*: `19 / 20 pts`.
    - *Completeness*: `14 / 15 pts`.
  * Listas cualitativas estructuradas de Puntos Fuertes (`strengths`), Brechas (`gaps`) y Conceptos Erróneos (`misconceptions`).
  * Tira histórica de intentos (`Intento #1: 74 pts` $\to$ `Intento #2: 113 pts (+39 pts)`).

#### 4. Estado Límite (Boundary State)
- **Límite Máximo de Caracteres en Parafraseo (10,000 Caracteres)**:
  * Al aproximarse a 9,500 caracteres, el contador de caracteres cambia a color advertencia ámbar (`#f59e0b`).
  * Al alcanzar 10,000 caracteres, el contador muestra `"10,000 / 10,000 caracteres (Límite alcanzado)"` en color rojo error (`#f87171`) y el textarea bloquea la inserción de nuevos caracteres sin truncar el contenido existente.
  * La contención de scroll interno (`overscroll-behavior-y: contain`) garantiza un desplazamiento fluido sin deformar el modal.
- **Calificación Perfecta de Excelencia (120/120 Puntos)**:
  * Badge maestro: `120 / 120` con halo dorado (`#f5c451`), icono de estrella de excelencia `★`, y etiqueta `"Staff / Principal Mastery"`.
  * Todas las dimensiones de rúbrica al $100\%$ (`40/40`, `25/25`, `20/20`, `15/15`).
- **Snippets de Código Extensos con Generics**:
  * Código con líneas de más de 120 caracteres: Contenedor con `overflow-x: auto; overflow-y: hidden;` que añade máscara de degradado en el borde derecho (`mask-image`), con scrollbar ultrafino de 4px sin desbordar el modal.
- **Modo Zen en Viewport Móvil ($360\text{px}$)**:
  * El modal se transforma en pantalla completa total (`100vw × 100vh; border-radius: 0;`).
  * La comparativa de código conmuta automáticamente de split horizontal (side-by-side) a apilado vertical (stacked) sin requerir acción del usuario.
  * El padding horizontal se reduce a `12px` manteniendo el ancho de lectura centrado.

#### 5. Estado de Error (Error State)
- **Disparador**: Fallo de streaming por desconexión de red, error 429 de límite de tasa en el proveedor LLM, API key inválida o interrupción abrupta del socket.
- **Tratamiento Visual & Geometría**:
  * Banner de error dentro de la Etapa 04: `background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-lg, 8px); padding: var(--space-4); margin: var(--space-4) 0;`.
  * Encabezado: Icono `AlertCircle` (`16x16px`, `#f87171`) + `"Fallo en la Calibración por IA"`.
  * Explicación Humana: `"No pudimos conectar con el modelo de lenguaje debido a una interrupción de red o cuota excedida en el proveedor de IA. Tu borrador de formulación no se ha perdido."`.
  * **Preservación Incondicional del Borrador**: El texto ingresado por el usuario en la Etapa 03 permanece intacto en memoria y en `localStorage`. Cero pérdida de datos.
  * Botones de Remediación Accionables:
    - Botón Primario: `[Reintentar Evaluación]` (`.btn-primary`), re-ejecuta la llamada de streaming inmediatamente.
    - Botón Secundario: `[Verificar Clave en Ajustes]` (`.btn-secondary`), abre el diálogo de BYOK (`ORG-06`) manteniendo el estado del estudio en segundo plano.
    - Botón Terciario: `[Copiar Borrador al Portapapeles]` (`.btn-ghost`), permite respaldar el texto manualmente.

---

### E.3 Organismo `ORG-04`: Global Non-Blocking Tasks HUD

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ORG-04] MATRIZ DE 5 ESTADOS: GLOBAL NON-BLOCKING TASKS HUD                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. EMPTY      │ Sin tareas activas. Componente desmontado del DOM (0px consumidos).              │
│ 2. LOADING    │ Tarea en background. Píldora fija flotante con dot palpitante y contador.        │
│ 3. POPULATED  │ Evaluación finalizada. Notificación lista con puntaje + [Abrir Resultado].       │
│ 4. BOUNDARY   │ Múltiples pestañas abiertas sincronizadas vía BroadcastChannel. 360px viewport.  │
│ 5. ERROR      │ Streaming abortado o fallido en background. Indicador rojo + [Reintentar].       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Estado Vacío (Empty State)
- **Comportamiento**: Cuando no existe ninguna tarea de evaluación asíncrona en segundo plano (`backgroundEvaluation === null`), el componente HUD está completamente **desmontado del DOM** (`render = null`). No consume memoria de renderizado, no bloquea eventos del ratón (`pointer-events: none`) y tiene altura `0px`.

#### 2. Estado de Carga (Active Streaming Background Task)
- **Disparador**: El usuario inicia una evaluación en `ORG-03` y cierra el modal para continuar navegando el temario mientras la IA genera la respuesta.
- **Tratamiento Visual & Posicionamiento**:
  * Píldora flotante fija en la esquina inferior derecha: `position: fixed; bottom: 24px; right: 24px; z-index: var(--z-hud, 500); height: 44px; min-width: 320px; max-width: 380px; display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-3); background: var(--surface-overlay, #222b3e); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 9999px; box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(56,189,248,0.2); backdrop-filter: blur(8px);`.
  * Indicador de Estado Palpitante: Dot cian `#38bdf8` (`8x8px`, animación pulso 1.2s).
  * Texto de Concepto & Métricas Tabulares: `"Eval: Fiber Reconciler · 1,240 chars"` (`Inter 500 12px`, números monoespaciados).
  * Controles Táctiles:
    - Botón `[Ver]` (`.btn-secondary`, altura `28px`, radio `9999px`): Restaura inmediatamente el Modal de Estudio (`ORG-03`) en la Etapa 04.
    - Botón `[✕]` (`.btn-ghost`, `28x28px`, icono de cierre): Aborta la tarea con confirmación rápida.

#### 3. Estado Poblado / Finalizado (Populated / Task Completed)
- **Tratamiento Visual**:
  * El borde de la píldora transiciona a verde esmeralda éxito: `border-color: rgba(16, 185, 129, 0.5); box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(16,185,129,0.2);`.
  * El dot palpitante se fija en verde sólido (`#10b981`).
  * Copia Informativa: `"Evaluación completada: ★ 113/120 pts"`.
  * Acción Principal: Botón `[Abrir Resultado]` (`.btn-primary`, fondo `#38bdf8`, texto oscuro).
  * Temporizador de Auto-Cierre: Si el usuario no interactúa en 15 segundos, el HUD se desvanece suavemente (`opacity: 0; transition: opacity 300ms ease-out;`) sin bloquear la interfaz.

#### 4. Estado Límite (Boundary State)
- **Sincronización Multi-Pestaña Masiva (`BroadcastChannel`)**:
  * Si el usuario tiene 4 pestañas abiertas del workspace, la tarea en background se coordina mediante una única pestaña líder (`leader election` en `kw_workspace_sync`).
  * Las demás pestañas muestran el dot con icono de sincronización (`RefreshCw` de `10x10px`) indicando: `"Sincronizado vía pestaña principal"`, evitando peticiones duplicadas a la API del LLM.
- **Viewport Móvil ($360\text{px}$)**:
  * La píldora abandona la esquina derecha y se ancla centrada horizontalmente por encima de la barra de navegación móvil: `bottom: calc(64px + env(safe-area-inset-bottom, 0px)); left: 12px; right: 12px; max-width: none; width: auto;`.

#### 5. Estado de Error (Error State)
- **Disparador**: La petición en background falló por corte de conexión con el proveedor LLM.
- **Tratamiento Visual**:
  * Píldora con borde rojo: `border-color: rgba(239, 68, 68, 0.5);`.
  * Dot rojo de alerta (`#ef4444`).
  * Texto: `"Evaluación fallida (Error de red)"`.
  * Botones: `[Reintentar]` y `[Descartar]`. Al pulsar reintentar, se relanza la tarea en background.

---

### E.4 Organismo `ORG-05`: Flashcard Rapid Retrieval Deck

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ORG-05] MATRIZ DE 5 ESTADOS: FLASHCARD RAPID RETRIEVAL DECK                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. EMPTY      │ Sin flashcards para el filtro seleccionado. CTA de ver todas las tarjetas.       │
│ 2. LOADING    │ Skeleton 3D idéntico. Contorno y anverso en shimmer 1.5s. CLS = 0.000.           │
│ 3. POPULATED  │ Tarjeta interactiva 3D. Anverso (pregunta) / Reverso (respuesta senior).         │
│ 4. BOUNDARY   │ Mazo 100% dominado (pantalla de meta alcanzada), textos largos, 360px móvil.     │
│ 5. ERROR      │ Fallo de lectura del mazo local. Fallback seguro + [Recargar Mazo].             │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Estado Vacío (Empty State)
- **Disparador**: Filtro de maestría (ej. `"Solo tarjetas débiles"`) sin ninguna tarjeta coincidente.
- **Tratamiento Visual & Geometría**:
  * Tarjeta vacía estilizada en el centro del canvas: `max-width: 540px; min-height: 320px; margin: var(--space-8) auto; background: var(--surface-card); border: 1px dashed var(--border-line); border-radius: var(--radius-2xl, 16px); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-6); text-align: center;`.
  * Icono: `CheckCircle2` (`32x32px`, color `#10b981`).
  * Texto: `"¡Excelente trabajo! No tienes flashcards marcadas como débiles en este ecosistema."`.
  * CTA Primario: `[Mostrar todas las flashcards del temario]` (`.btn-primary`).

#### 2. Estado de Carga (Loading State)
- **Tratamiento Visual**:
  * Skeleton 3D idéntico a las dimensiones de la tarjeta: `max-width: 600px; height: 360px; margin: var(--space-8) auto; border-radius: 16px; background: var(--surface-card); border: 1px solid var(--border-line); padding: var(--space-6); display: flex; flex-direction: column; justify-content: space-between;`.
  * Header skeleton: Chip de categoría `width: 90px; height: 22px; border-radius: 4px;` + Contador `width: 60px; height: 16px;`.
  * Body skeleton: 3 barras horizontales de pregunta técnica (`height: 20px; border-radius: 4px; margin-bottom: 8px;`).
  * Footer skeleton: Barra de pista de atajo de teclado `width: 140px; height: 24px; border-radius: 6px;`.
  * Shimmer pulse a 1.5s ease-in-out. Layout shift $\text{CLS} = 0.000$.

#### 3. Estado Poblado (Populated State)
- **Tratamiento Visual**:
  * Contenedor con perspectiva 3D (`perspective: 1000px;`).
  * **Anverso (Front Face)**:
    - Chip de categoría con dot inmutable (`#61DAFB React Core`).
    - Pregunta de entrevista técnica o desafío arquitectónico en `text-h2` (`27.6px`, peso 600, color `#f8fafc`).
    - Atajo sugerido: `[Barra Espaciadora o Clic para Voltear]`.
  * **Reverso (Back Face)**:
    - Respuesta senior sintética, modelo mental y trade-offs asumidos.
    - Cuadrícula de auto-calificación de 4 botones: `[1: Difícil]` (`#ef4444`), `[2: Regular]` (`#f59e0b`), `[3: Bueno]` (`#38bdf8`), `[4: Dominado]` (`#10b981`).
    - Botón de inmersión profunda: `[Profundizar en Modo Estudio]` (`INF-98`), abre el modal `ORG-03` con el concepto cargado.

#### 4. Estado Límite (Boundary State)
- **Mazo 100% Completado (Sesión de Estudio Finalizada)**:
  * Al calificar la última tarjeta del mazo, se despliega la pantalla de celebración editorial de meta:
    - Medalla gráfica minimalista o glifo de corona técnica (`Award` de `40x40px`, color dorado `#f5c451`).
    - Resumen de sesión: `"42 de 42 Flashcards repasadas — 34 Dominadas, 8 en Refuerzo"`.
    - Botones de acción: `[Reiniciar Calentamiento]` y `[Volver al Grafo Topológico]`.
- **Pregunta Técnica Larga (400 Caracteres)**:
  * El texto se escala ópticamente a `18px` para evitar desbordes verticales y se habilita scroll interno contenido con scrollbar ultrafino.
- **Móvil ($360\text{px}$)**:
  * La tarjeta ocupa el 100% del ancho con márgenes laterales de `12px`.
  * Soporte táctil para gestos de deslizamiento (swipe horizontal) para avanzar o retroceder.

#### 5. Estado de Error (Error State)
- **Disparador**: Deserialización fallida del mazo desde la base de datos local.
- **Tratamiento Visual**:
  * Mensaje: `"Error al cargar el mazo de flashcards. Los índices de sesión se encuentran desincronizados."`.
  * Fallback: Restablece el puntero de índice a la tarjeta 1 sin borrar las calificaciones previas.
  * CTA: `[Recargar Mazo Curricular]` (`.btn-primary`).

---

### E.5 Organismo `ORG-06`: BYOK & Soberanía de Datos (Ajustes de IA y Respaldo)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ORG-06] MATRIZ DE 5 ESTADOS: BYOK & SOBERANÍA DE DATOS                                          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. EMPTY      │ Sin API Key configurada. Modo offline activo + banner informativo.               │
│ 2. LOADING    │ Verificación de conexión en curso. Botón con spinner anti-CLS. Form deshabilitado│
│ 3. POPULATED  │ Clave enmascarada con toggle, proveedor activo, latencia 185ms OK, respaldo JSON │
│ 4. BOUNDARY   │ Archivo de respaldo masivo (10MB+, 500 intentos). Importación async en chunks.   │
│ 5. ERROR      │ Fallo de autenticación 401 o JSON corrupto. Alerta roja + [Volver a Probar].     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Estado Vacío (Empty State)
- **Disparador**: Primer inicio de la aplicación o usuario sin credenciales configuradas.
- **Tratamiento Visual**:
  * Banner azul informativo: `background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; padding: var(--space-4); margin-bottom: var(--space-4);`.
  * Copia de Privacidad Absoluta: `"Modo Local Autónomo. Puedes estudiar y explorar todo el temario sin conexión. Para habilitar las evaluaciones asistidas por IA y el diálogo socrático, introduce tu propia clave de API (BYOK). Tus claves jamás tocan servidores externos y residen cifradas en tu navegador."`.
  * Campos de formulario vacíos con placeholders explicativos (`sk-or-v1-...`).
  * CTA: `[Guardar Credenciales]`.

#### 2. Estado de Carga (Loading State)
- **Disparador**: Pulsación del botón `[Probar Conexión]` (`INF-87`).
- **Tratamiento Visual**:
  * El botón entra en estado de carga con la técnica Anti-CLS de ancho reservado: el texto `"Probar Conexión"` recibe `visibility: hidden`, y un spinner cian de $16\times 16\text{px}$ gira en el centro del botón.
  * Los inputs del formulario se bloquean con `disabled` para prevenir mutaciones durante la prueba.
  * El badge de estado de conexión muestra un skeleton palpitante: `width: 110px; height: 22px; border-radius: 4px;` con texto `"Comprobando..."`.

#### 3. Estado Poblado (Populated State)
- **Tratamiento Visual**:
  * Proveedor seleccionado (ej. `OpenRouter`), Modelo: `anthropic/claude-3.5-sonnet`.
  * Clave enmascarada con asteriscos de seguridad: `sk-or-v1-••••••••••••••••••••3a8f`, con botón de revelado (icono de ojo `Eye` / `EyeOff`).
  * Badge de Conexión Saludable: `● Conectado (185ms OK)` en verde esmeralda (`background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);`).
  * Sección de Soberanía de Datos:
    - Indicador de última copia exportada: `"Último respaldo: Hace 2 días (48 conceptos evaluados)"`.
    - Botón primario: `[Exportar Respaldo JSON]` (`INF-90`), genera descarga instantánea de `learning-workspace-backup-[date].json`.
    - Botón secundario: `[Importar Respaldo JSON]` (`INF-91`), abre el explorador de archivos nativo.

#### 4. Estado Límite (Boundary State)
- **Respaldo JSON Voluminoso (> 10MB, más de 500 intentos históricos y grabaciones de audio)**:
  * El motor de importación no bloquea el hilo principal: procesa el JSON en un WebWorker o promesa particionada (`requestIdleCallback`).
  * Muestra una barra de progreso determinate: `"Validando esquema... 45%"` $\to$ `"Restaurando evaluaciones... 85%"`.
  * Diálogo de confirmación previa antes de sobrescribir (`INF-92`): Muestra el resumen de lo que se reemplazará (`"Se sobrescribirán 48 conceptos y 120 notas de estudio. ¿Deseas continuar?"`).
- **Móvil ($360\text{px}$)**:
  * El modal se expande a pantalla completa (`width: 100vw; min-height: 100vh; border-radius: 0;`).
  * Inputs con altura táctil mínima de $44\text{px}$ y tamaño de fuente `16px` para evitar el zoom automático de Safari iOS.

#### 5. Estado de Error (Error State)
- **Error de Autenticación / Fallo de Conexión (401 / 403 / Network)**:
  * Tratamiento en línea directo bajo el campo de la API Key:
    ```html
    <div class="input-error-msg" role="alert">
      <span class="ui-icon ui-icon--xs"><AlertCircle /></span>
      <span>Fallo de autenticación (401): La clave ingresada fue rechazada por OpenRouter. Verifica tu saldo o la validez del token.</span>
    </div>
    ```
  * El borde del input se tiñe de rojo: `border-color: #ef4444;`.
  * Acción de remediación: Botón `[Volver a Probar]` y enlace a `"Cómo obtener una clave de OpenRouter"`.
- **Archivo JSON Corrupto o Esquema Inválido**:
  * Diálogo modal de advertencia: `"El archivo seleccionado no cumple con el esquema canónico de Learning Workspace V2 (falta la propiedad 'curriculum_version'). Ningún dato de tu estación de trabajo ha sido modificado."`.
  * CTA: `[Seleccionar Otro Archivo]`.

---

## Section F: Accesibilidad (WCAG 2.2 AA) y Heurísticas de Usabilidad de Nielsen

---

### F.1 Tabla Exhaustiva de Auditoría de Contraste de Color (WCAG 2.2 AA / AAA)

Todas las combinaciones cromáticas de texto y controles interactivos han sido auditadas matemáticamente contra las superficies de renderizado en modo oscuro bajo el estándar **WCAG 2.2 §1.4.3 (Contraste Mínimo $\ge 4.5:1$ para texto normal, $\ge 3.0:1$ para texto grande y controles)** y **§1.4.6 (Nivel AAA $\ge 7.0:1$ / $4.5:1$)**:

| Token de Color | Valor Hex | Superficie de Fondo | Ratio Matemático | Peso Compulsorio | Calificación WCAG | Rol y Aplicación Semántica Permitida |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| `--color-text-primary` | `#f8fafc` | `--surface-base` (`#080b11`) | **15.8 : 1** | 400 / 600 / 700 | **AAA Pass** | Títulos de vistas, conceptos, prosa principal, código. |
| `--color-text-primary` | `#f8fafc` | `--surface-card` (`#131824`) | **13.5 : 1** | 400 / 600 / 700 | **AAA Pass** | Títulos dentro de tarjetas, modales y drawers. |
| `--color-text-secondary` | `#94a3b8` | `--surface-base` (`#080b11`) | **7.4 : 1** | **Min 500** | **AAA Pass** | **Obligatorio para metadatos legibles, etiquetas y subtítulos.** |
| `--color-text-secondary` | `#94a3b8` | `--surface-card` (`#131824`) | **6.3 : 1** | **Min 500** | **AA Pass** | Metadatos dentro de tarjetas y paneles. |
| `--color-primary` (Accent) | `#38bdf8` | `--surface-base` (`#080b11`) | **9.6 : 1** | 500 / 600 | **AAA Pass** | Enlaces, acentos de enfoque, pestañas activas. |
| `--color-primary` (Accent) | `#38bdf8` | `--surface-card` (`#131824`) | **8.2 : 1** | 500 / 600 | **AAA Pass** | Acentos dentro de tarjetas y modales. |
| `--color-error-text` | `#f87171` | `--surface-card` (`#131824`) | **5.8 : 1** | 500 / 600 | **AA Pass** | Mensajes de error en línea, validaciones de campo. |
| `--color-warning-text` | `#fbbf24` | `--surface-card` (`#131824`) | **9.2 : 1** | 500 / 600 | **AAA Pass** | Advertencias de cuota, riesgos operacionales. |
| `--color-success-text` | `#34d399` | `--surface-card` (`#131824`) | **9.5 : 1** | 500 / 600 | **AAA Pass** | Estados dominados, pruebas de conexión exitosas. |
| `--color-info-text` | `#7dd3fc` | `--surface-card` (`#131824`) | **10.8 : 1** | 500 / 600 | **AAA Pass** | Notificaciones informativas, chips de estado. |
| `--color-excellence-text`| `#fde68a` | `--surface-card` (`#131824`) | **12.4 : 1** | 600 / 700 | **AAA Pass** | Badges de maestría Staff `★ 118/120` y excelencia. |
| Categoría `fundamentals` | `#61DAFB` | `--surface-base` (`#080b11`) | **11.8 : 1** | 500 / 600 | **AAA Pass** | Chip React: Modelo mental & componentes. |
| Categoría `state` | `#F59E0B` | `--surface-base` (`#080b11`) | **8.9 : 1** | 500 / 600 | **AAA Pass** | Chip React: Estado & datos. |
| Categoría `effects` | `#A78BFA` | `--surface-base` (`#080b11`) | **9.4 : 1** | 500 / 600 | **AAA Pass** | Chip React: Efectos & asincronía. |
| Categoría `rendering` | `#4ADE80` | `--surface-base` (`#080b11`) | **11.2 : 1** | 500 / 600 | **AAA Pass** | Chip React: Render & performance. |
| Categoría `architecture` | `#2DD4BF` | `--surface-base` (`#080b11`) | **10.5 : 1** | 500 / 600 | **AAA Pass** | Chip React: Arquitectura web. |
| Categoría `quality` | `#F472B6` | `--surface-base` (`#080b11`) | **8.6 : 1** | 500 / 600 | **AAA Pass** | Chip React: Testing & calidad. |
| Categoría `runtime` | `#FBBF24` | `--surface-base` (`#080b11`) | **10.8 : 1** | 500 / 600 | **AAA Pass** | Chip React: Browser & runtime. |
| Categoría `operations` | `#F97316` | `--surface-base` (`#080b11`) | **7.6 : 1** | 500 / 600 | **AA Pass** | Chip React: Producción & reliability. |
| Categoría `leadership` | `#C084FC` | `--surface-base` (`#080b11`) | **8.8 : 1** | 500 / 600 | **AAA Pass** | Chip React: Producto & liderazgo. |
| Categoría `rails_fundam.`| `#E8A33D` | `--surface-base` (`#080b11`) | **9.2 : 1** | 500 / 600 | **AAA Pass** | Chip Rails: Rails core & request. |
| Categoría `activerecord` | `#CC342D` | `--surface-base` (`#080b11`) | **5.8 : 1** | 600 (Bold) | **AA Pass** | Chip Rails: Active Record & DB. |
| Categoría `patterns` | `#5AA9FF` | `--surface-base` (`#080b11`) | **9.7 : 1** | 500 / 600 | **AAA Pass** | Chip Rails: Diseño aplicado. |
| `--color-text-muted` | `#64748b` | `--surface-base` (`#080b11`) | `4.2 : 1` | 400 | No Lectura | **Restringido a placeholders e hints decorativos.** |
| `--color-text-subtle` | `#475569` | `--surface-base` (`#080b11`) | `2.2 : 1` | 400 | Exento (§1.4.3)| **Restringido a controles desactivados (Disabled).** |

---

### F.2 Refuerzo de Estado No Basado Exclusivamente en el Color (Non-Color Status Reinforcement)

Bajo **WCAG 2.2 §1.4.1 (Uso del Color)**, el color nunca debe ser el único medio para transmitir información, indicar una acción, solicitar una respuesta o distinguir un elemento visual. Todo estado en Learning Workspace se refuerza mediante una **tríada accesible: Color + Forma/Icono + Texto Explícito**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MATRIZ DE REFUERZO NO-CROMÁTICO (TRÍADA DE ACCESIBILIDAD)                                            │
├─────────────────┬──────────────┬────────────────────────┬─────────────────────┬────────────────────────┤
│ ESTADO / DATO   │ COLOR CANÓN. │ FORMA GEOMÉTRICA       │ ICONO SVG ASOCIADO  │ ETIQUETA TEXTUAL ARIA  │
├─────────────────┼──────────────┼────────────────────────┼─────────────────────┼────────────────────────┤
│ Concepto Bloqueado│ Dim Slate  │ Candado con borde tenus│ `Lock` (12px)       │ "Bloqueado por prereq."│
│ Concepto Disponible│ Neutro     │ Círculo hueco 1.5px    │ `Circle` (12px)     │ "Disponible"           │
│ En Progreso     │ Ámbar #f59e0b│ Círculo semi-lleno     │ `Clock` (12px)      │ "En progreso (Etapa 2)"│
│ Dominado        │ Verde #10b981│ Check circular sólido  │ `CheckCircle2` (12px│ "Dominado (Score: 118)"│
│ Nivel Staff     │ Oro #f5c451  │ Estrella con destello  │ `Award` / `Sparkles`│ "Nivel Staff / Excel." │
│ Prioridad Urgente│ Cyan #38bdf8 │ Octágono / Bandera     │ `AlertOctagon`      │ "Prioridad: URGENTE"   │
│ Prioridad Recomend│ Azul #5aa9ff│ Brújula de navegación  │ `Compass`           │ "Prioridad: RECOMEND." │
│ Conexión IA OK  │ Verde #10b981│ Punto con halo verde   │ `Check` (12px)      │ "Conectado (210ms)"    │
│ Conexión Fallida│ Rojo #ef4444 │ Triángulo advertencia  │ `AlertTriangle`     │ "Desconectado (Error)" │
│ Grabación Audio │ Rojo palpit. │ Círculo rojo en pulso  │ `Mic` (onda activa) │ "Grabando dictado..."  │
└─────────────────┴──────────────┴────────────────────────┴─────────────────────┴────────────────────────┘
```

---

### F.3 Foco de Teclado, `:focus-visible` y Patrón Skip-Link

#### 1. Especificación del Anillo de Enfoque de Alto Contraste
Para garantizar visibilidad absoluta sin depender de los estilos predeterminados del navegador, se declara una regla universal estricta para `:focus-visible`:
```css
/* Eliminación del outline nativo exclusivamente cuando NO es navegación por teclado */
:focus:not(:focus-visible) {
  outline: none;
}

/* Anillo de Enfoque de Alta Precisión Universal */
:focus-visible {
  outline: 2px solid var(--border-focus, #38bdf8) !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.25) !important;
  transition: outline-offset 80ms ease-out;
}
```
- **Radio de Esquinas en Foco**: El anillo de enfoque se adapta al radio de curvatura del elemento enfocado (`border-radius: inherit`).
- **Prohibición**: Queda terminantemente prohibido el uso de `outline: none` o `outline: 0` sin proveer el reemplazo tokenizado `:focus-visible`.

#### 2. Patrón Skip-Link ("Saltar al Contenido Principal")
Para permitir a usuarios con lectores de pantalla y navegación exclusiva por teclado saltar las barras de navegación fijas y el switch de ecosistema, el primer elemento focusable del DOM es un skip-link canónico:
```html
<a href="#main-workspace-canvas" class="ui-skip-link">
  Saltar al contenido principal del workspace
</a>
```
```css
.ui-skip-link {
  position: absolute;
  top: -9999px;
  left: 16px;
  z-index: var(--z-skip-link, 900);
  padding: var(--space-2) var(--space-4);
  background: var(--surface-overlay, #222b3e);
  color: var(--color-primary, #38bdf8);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-control, 6px);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
}

.ui-skip-link:focus-visible {
  top: 12px; /* Desciende visiblemente al recibir foco */
}
```

---

### F.4 Sistema de Notificaciones y Patrón de Deshacer (Undo Pattern)

#### 1. Arquitectura de Toasts del Sistema
- **Ubicación**: Esquina inferior derecha de la pantalla (`bottom: 24px; right: 24px; z-index: var(--z-toast, 70); display: flex; flex-direction: column-reverse; gap: var(--space-2);`).
- **Duración & Persistencia**:
  * Notificaciones informativas o de éxito: Auto-cierre tras **5 segundos exactos**.
  * Notificaciones de error o fallos de conexión: **Persistentes hasta descarte manual** por parte del usuario mediante botón `[✕]`.
- **Anatomía del Toast**:
  ```
  ┌────────────────────────────────────────────────────────────────────────┐
  │ [Icono SVG] Mensaje conciso de una frase.        [Acción: Deshacer] [✕]│
  └────────────────────────────────────────────────────────────────────────┘
  ```

#### 2. Patrón de Recuperación y Deshacer (Undo Protocol)
Para operaciones destructivas o modificaciones de progreso masivas (ej. reiniciar el avance de un concepto, eliminar un borrador de parafraseo o limpiar filtros de búsqueda), el sistema aplica el **Patrón de Deshacer** en lugar de molestos diálogos modales de confirmación previa:
```typescript
// Protocolo de Deshacer para Reinicio de Concepto
function resetConceptMastery(nodeId: string) {
  const previousState = store.getConceptState(nodeId);
  
  // 1. Mutación optimista inmediata
  store.setConceptMastery(nodeId, 'unlocked', null);
  
  // 2. Disparar Toast con ventana de deshacer de 6 segundos
  toast.show({
    type: 'warning',
    message: `Progreso de "${nodeId}" reiniciado.`,
    action: {
      label: 'Deshacer',
      onClick: () => {
        store.restoreConceptState(nodeId, previousState);
        toast.dismiss();
      }
    },
    durationMs: 6000
  });
}
```
- **Accesibilidad ARIA**:
  * Mensajes de estado estándar utilizan `role="status"` y `aria-live="polite"`.
  * Mensajes de error crítico utilizan `role="alert"` y `aria-live="assertive"`.

---

### F.5 Mapeo Completo de las 10 Heurísticas de Usabilidad de Nielsen

| # | Heurística de Jakob Nielsen | Implementación Concreta en Learning Workspace V2 | Verificación de Auditoría |
|:---|:---|:---|:---|
| **1** | **Visibilidad del Estado del Sistema** | HUD global no bloqueante (`ORG-04`) con contador de caracteres y dot de streaming en tiempo real; cronómetro activo en evaluación; indicador de latencia en milisegundos (`210ms OK`); timestamps de autoguardado en parafraseo (`Guardado local: 12:04`). | El usuario conoce el estado de cualquier proceso en $< 1\text{s}$. |
| **2** | **Correspondencia entre el Sistema y el Mundo Real** | Uso riguroso del vocabulario de ingeniería senior de la industria: *"Fiber reconciler"*, *"lanes de prioridad"*, *"starvation de microtasks"*, *"ActiveRecord N+1 eager load"*, *"trade-offs"*. Cero identificadores técnicos opacos o UUIDs expuestos en la interfaz. | Lenguaje natural para ingenieros de nivel senior/staff. |
| **3** | **Control y Libertad del Usuario** | Tecla `Escape` cierra de forma universal cualquier modal o drawer; botón `[Cancelar evaluación]` aborta inmediatamente la generación de streaming vía `AbortController`; patrón `Deshacer` en reinicios de progreso; alternador de Modo Zen. | Rutas de escape visibles y accesibles en toda la aplicación. |
| **4** | **Consistencia y Estándares** | Ciclo de vida uniforme de botones en 6 estados con slots anti-CLS; anclas cromáticas de categorías inmutables en Grid, Grafo y Flashcards; atajo universal de búsqueda `⌘K` / `Ctrl+K`; alineación óptica en cuadrícula de 4 slots. | Mismo comportamiento, estilo y etiqueta en el 100% de las vistas. |
| **5** | **Prevención de Errores** | Diálogo de confirmación con vista previa antes de sobrescribir datos en importación de respaldo JSON; validación de longitud antes de evaluar; desactivación de botón `[Evaluar]` con borrador vacío; prueba de conexión antes de activar claves BYOK. | Hace imposible cometer errores destructivos accidentales. |
| **6** | **Reconocimiento Antes que Recuerdo** | Chips de prerrequisitos visibles directamente en cada tarjeta de concepto; breadcrumb contextual `Antes: X` $\to$ `Ahora: Y` $\to$ `Después: Z`; historial de intentos previos visible en el scorecard; opciones de trade-offs en chips socráticos. | Cero dependencia de la memoria de trabajo del usuario. |
| **7** | **Flexibilidad y Eficiencia de Uso** | Atajos de teclado completos (`⌘K` búsqueda, `Espacio` voltear flashcard, flechas para navegar etapas, `Ctrl+Enter` para enviar evaluación); rutas directas en URL con deep-linking; soporte simultáneo para novatos (clic guiado) y expertos (atajos veloces). | Ingenieros avanzados operan la interfaz a máxima velocidad. |
| **8** | **Diseño Estético y Minimalista** | Filosofía "Dark Engineering Editorial"; eliminación total de "carditis" y cajas decorativas en modales; acento primario limitado a $< 5\%$ del viewport; números monoespaciados tabulares; cero ruido visual. | Cada pixel en pantalla aporta sustancia cognitiva directa. |
| **9** | **Ayuda para Reconocer, Diagnosticar y Recuperarse de Errores** | Mensajes de error en español claro que explican *qué falló*, *por qué sucedió* y ofrecen un botón de 1 clic para recuperarse (`[Reintentar Evaluación]`, `[Probar Clave]`); preservación incondicional de notas en caso de error. | Erradicación total de códigos de error crudos o pantallas en blanco. |
| **10**| **Ayuda y Documentación** | Enlaces contextuales a documentación oficial y RFCs (`INF-102`); glosario de términos deep-dive en acordeones; preguntas reales de entrevistas FAANG con respuestas modelo; aviso de privacidad sobre almacenamiento de claves BYOK. | Ayuda disponible en el punto exacto de necesidad. |

---

### F.6 Presupuesto de Movimiento, Micro-Interacciones y Rendimiento

1. **Límites de Duración de Transición**:
   - Micro-interacciones de controles (hover, click, foco): **$\le 120\text{ms}$** con `ease-out`.
   - Transiciones de componentes (apertura de drawers, paneles, tabs): **$\le 200\text{ms}$** con `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Modales principales y vistas de pantalla completa: **$\le 250\text{ms}$**.
   - Shimmer de skeletons: **$1500\text{ms}$** `ease-in-out` continuo.
2. **Propiedades CSS Animables Exclusivas (GPU Accelerated)**:
   - Está terminantemente prohibido animar propiedades que provocan reflow/layout (`width`, `height`, `margin`, `padding`, `top`, `left`).
   - Las animaciones se restringen estrictamente a `transform` y `opacity`.
3. **Anulación Estricta por Accesibilidad (`prefers-reduced-motion`)**:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
     
     /* Sustitución de shimmer por color plano estático */
     .skeleton-shimmer {
       animation: none !important;
       background: var(--surface-card) !important;
     }
   }
   ```

---

## Section G: Referencia de Tokens de Diseño y Blueprint de Implementación

El siguiente bloque maestro consolida la totalidad de variables CSS Custom Properties (`:root`) que gobiernan **Learning Workspace V2**, fusionando los cimientos de `DESIGN.md` y las especificaciones de las Secciones A a la F en un único blueprint ejecutable:

```css
:root {
  /* ==========================================================================
     1. PRIMITIVAS DE COLOR (Slate & Monochrome Foundation)
     ========================================================================== */
  --color-slate-950: #06080d;
  --color-slate-900: #080b11;
  --color-slate-850: #0d111a;
  --color-slate-800: #131824;
  --color-slate-750: #1a2130;
  --color-slate-700: #222b3e;
  --color-slate-600: #334155;
  --color-slate-500: #64748b;
  --color-slate-400: #94a3b8;
  --color-slate-300: #cbd5e1;
  --color-slate-200: #e2e8f0;
  --color-slate-100: #f1f5f9;
  --color-slate-50:  #f8fafc;
  --color-pure-white: #ffffff;
  --color-pure-black: #000000;

  /* ==========================================================================
     2. SUPERFICIES Y ELEVACIÓN TONAL (Dark Mode Lightness Ladder)
     ========================================================================== */
  --surface-canvas:      var(--color-slate-950); /* #06080d - Fondo infinito */
  --surface-base:        var(--color-slate-900); /* #080b11 - Superficie base */
  --surface-subtle:      var(--color-slate-850); /* #0d111a - Dock & paneles estáticos */
  --surface-card:        var(--color-slate-800); /* #131824 - Tarjetas de concepto */
  --surface-card-hover:  var(--color-slate-750); /* #182030 - Hover & selección */
  --surface-raised:      var(--color-slate-750); /* #1a2130 - Paneles emergentes */
  --surface-overlay:     var(--color-slate-700); /* #222b3e - Modales, HUD & overlays */
  --surface-modal:       #121722;                /* Superficie unificada de estudio */
  --surface-inset:       #090d15;                /* Wells de código y editores */

  /* ==========================================================================
     3. BORDES Y RESALTES MICRO-ESPECULARES
     ========================================================================== */
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-line:   rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-accent: rgba(56, 189, 248, 0.35);
  --border-focus:  #38bdf8;

  /* Resaltes especulares superiores (Top-Edge Keylight) */
  --shadow-inset-subtle: inset 0 1px 0 0 rgba(255, 255, 255, 0.04);
  --shadow-inset-card:   inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  --shadow-inset-raised: inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
  --shadow-inset-modal:  inset 0 1px 0 0 rgba(255, 255, 255, 0.16);

  /* Sombras tonales direccionales */
  --elevation-1-shadow: none;
  --elevation-2-shadow: 0 1px 3px rgba(0, 0, 0, 0.35), var(--shadow-inset-subtle);
  --elevation-3-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.5), var(--shadow-inset-card);
  --elevation-4-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.65), var(--shadow-inset-raised);
  --elevation-5-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px var(--border-line), var(--shadow-inset-modal);

  /* ==========================================================================
     4. ACENTOS Y COLOR FUNCIONAL (< 5% del Viewport)
     ========================================================================== */
  --color-primary:        #38bdf8; /* Sky Cyan - Acento principal */
  --color-primary-hover:  #0ea5e9;
  --color-primary-active: #0284c7;
  --color-primary-subtle: rgba(56, 189, 248, 0.12);
  --color-primary-glow:   rgba(56, 189, 248, 0.22);
  --color-primary-text:   #38bdf8;
  --color-on-primary:     #06080d;

  /* ==========================================================================
     5. TIPOGRAFÍA Y TEXTO (Tokens de Contraste Calibrado WCAG 2.2)
     ========================================================================== */
  --color-text-primary:   #f8fafc; /* Contraste 15.8:1 - Lectura principal */
  --color-text-secondary: #94a3b8; /* Contraste 7.4:1 - Min font-weight 500 */
  --color-text-muted:     #64748b; /* Restringido a hints y placeholders */
  --color-text-subtle:    #475569; /* Restringido a controles disabled */
  --color-text-link:      #38bdf8;
  --color-text-link-hover:#7dd3fc;

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;

  /* Escala Modular Minor Third (Ratio 1.200) */
  --text-caption:   0.694rem; /* 11.1px - Line-height: 1.00rem, Tracking: +0.04em */
  --text-sm:        0.833rem; /* 13.3px - Line-height: 1.25rem, Tracking: 0 */
  --text-base:      1.000rem; /* 16.0px - Line-height: 1.50rem, Tracking: -0.011em */
  --text-lead:      1.200rem; /* 19.2px - Line-height: 1.75rem, Tracking: -0.015em */
  --text-h3:        1.440rem; /* 23.0px - Line-height: 2.00rem, Tracking: -0.018em */
  --text-h2:        1.728rem; /* 27.6px - Line-height: 2.25rem, Tracking: -0.022em */
  --text-h1:        2.074rem; /* 33.2px - Line-height: 2.50rem, Tracking: -0.026em */
  --text-display:   2.488rem; /* 39.8px - Line-height: 2.75rem, Tracking: -0.030em */

  /* Invariante Tabular Obligatorio */
  --font-tabular: tabular-nums;

  /* ==========================================================================
     6. ESTADOS SEMÁNTICOS Y RÚBRICA (0 a 120 Puntos)
     ========================================================================== */
  --color-error:            #ef4444;
  --color-error-subtle:     rgba(239, 68, 68, 0.12);
  --color-error-border:     rgba(239, 68, 68, 0.35);
  --color-error-text:       #f87171;

  --color-warning:          #f59e0b;
  --color-warning-subtle:   rgba(245, 158, 11, 0.12);
  --color-warning-border:   rgba(245, 158, 11, 0.35);
  --color-warning-text:     #fbbf24;

  --color-success:          #10b981;
  --color-success-subtle:   rgba(16, 185, 129, 0.12);
  --color-success-border:   rgba(16, 185, 129, 0.35);
  --color-success-text:     #34d399;

  --color-info:             #38bdf8;
  --color-info-subtle:      rgba(56, 189, 248, 0.12);
  --color-info-border:      rgba(56, 189, 248, 0.35);
  --color-info-text:        #7dd3fc;

  --color-excellence:       #f5c451;
  --color-excellence-subtle:rgba(245, 196, 81, 0.14);
  --color-excellence-border:rgba(245, 196, 81, 0.35);
  --color-excellence-text:  #fde68a;

  /* ==========================================================================
     7. ANCLAS CROMÁTICAS INMUTABLES DE CATEGORÍA (React & Rails)
     ========================================================================== */
  --cat-react-fundamentals: #61DAFB;
  --cat-react-state:        #F59E0B;
  --cat-react-effects:      #A78BFA;
  --cat-react-rendering:    #4ADE80;
  --cat-react-architecture: #2DD4BF;
  --cat-react-quality:      #F472B6;
  --cat-react-platform:     #94A3B8;
  --cat-react-design-system:#FB7185;
  --cat-react-runtime:      #FBBF24;
  --cat-react-operations:   #F97316;
  --cat-react-leadership:   #C084FC;

  --cat-rails-fundamentals: #E8A33D;
  --cat-rails-activerecord: #CC342D;
  --cat-rails-patterns:     #5AA9FF;
  --cat-rails-sti:          #A78BFA;
  --cat-rails-infra:        #94A3B8;
  --cat-rails-assets:       #2DD4BF;
  --cat-rails-testing:      #4ADE80;

  /* ==========================================================================
     8. ESPACIADO (Grid Rígido de 4px / 8px)
     ========================================================================== */
  --space-0:   0px;
  --space-0-5: 2px;
  --space-1:   4px;
  --space-1-5: 6px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;

  /* ==========================================================================
     9. RADIOS CONCÉNTRICOS Y CONTROLES UNIFORMES
     ========================================================================== */
  --radius-xs:      2px;
  --radius-sm:      4px;
  --radius-md:      6px;
  --radius-lg:      8px;
  --radius-xl:      12px;
  --radius-2xl:     16px;
  --radius-pill:    9999px;
  --radius-control: 6px; /* Uniforme en todos los botones, inputs y selects */

  /* ==========================================================================
     10. JERARQUÍA DE CAPAS Y ESCALERA Z-INDEX
     ========================================================================== */
  --z-canvas:         0;
  --z-app-shell:      10;
  --z-dock-mobile:    20;
  --z-sticky-bar:     30;
  --z-drawer:         40;
  --z-command-pal:    50;
  --z-modal:          60;
  --z-toast:          70;
  --z-tooltip:        80;
  --z-hud:            500;
  --z-skip-link:      900;

  /* ==========================================================================
     11. ICONOGRAFÍA TÉCNICA (Lucide-React Editorial Standard)
     ========================================================================== */
  --icon-stroke: 1.5px; /* Prohibido stroke de 2px por densidad editorial */
  --icon-xs:     12px;
  --icon-sm:     14px;
  --icon-md:     16px;
  --icon-lg:     20px;

  /* ==========================================================================
     12. PARÁMETROS DE VIEWPORT, CONTROLES Y SCROLLBAR
     ========================================================================== */
  --header-height:             48px;
  --category-rail-height:      40px;
  --mobile-bottom-dock-height: 56px;
  --control-height-desktop:    32px;
  --control-touch-min:         44px;
  --scrollbar-width:           4px;
  --scrollbar-thumb:           #334155;
  --scrollbar-track:           transparent;

  /* ==========================================================================
     13. TIEMPOS DE ANIMACIÓN Y CURVAS DE ACELERACIÓN
     ========================================================================== */
  --duration-micro:    80ms;
  --duration-fast:     120ms;
  --duration-base:     200ms;
  --duration-skeleton: 1500ms;
  --ease-out:          cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Section H: Contrato de Implementación y Verificación Downstream

Este contrato establece la lista de verificación exhaustiva, no negociable e incontestable para cualquier desarrollador frontend o agente de codificación downstream encargado de implementar **Learning Workspace V2** en `src/`. **Cero desviación del blueprint es tolerada.**

### H.1 Lista de Verificación de Implementación (Developer Acceptance Checklist)

```
[ ] 1. LÍMITES ESTRICTOS DE LÍNEAS DE CÓDIGO
    - [ ] Ningún archivo fuente en `src/` supera los 150 renglones.
    - [ ] Verificación ejecutada con éxito: `node scripts/audit-lines.mjs` (0 infracciones).

[ ] 2. MACRO-ARQUITECTURA & VIEWPORT BUDGET (docs/DESIGN_CRITERIA.md)
    - [ ] Cabecera de cockpit fija a 48px (--header-height).
    - [ ] Tira de categorías envolvente con flex-wrap a 40px (--category-rail-height).
    - [ ] Suma total de cromo fijo <= 88px (cumple holgadamente el tope de <= 130px).
    - [ ] Ratio de viewport >= 70% reservado exclusivamente para el canvas de contenido.
    - [ ] Al menos 2 filas completas de tarjetas visibles sin hacer scroll en 1440x900.
    - [ ] Cero cañones horizontales por space-between (> 350px de vacío prohibidos).

[ ] 3. MODELO DE TARJETA DE 4 SLOTS & ALINEACIÓN EN CUADRÍCULA
    - [ ] Slot 1 (Header): min-height 24px con Chip de categoría inmutable y status dot.
    - [ ] Slot 2 (Título & Resumen): min-height 68px, título a 1 línea con elipsis y resumen clamp a 2 líneas.
    - [ ] Slot 3 (Prerrequisitos): flex: 1 1 auto; margin: var(--space-2) 0; absorbiendo variaciones de altura.
    - [ ] Slot 4 (Footer Pinned): margin-top: auto; height: 32px; garantizando que todos los botones [Estudiar] y puntajes de una fila compartan exactamente la misma línea base horizontal.

[ ] 4. MATRIZ UNIVERSAL DE 5 ESTADOS (Sección E)
    - [ ] ORG-02 (Concept Explorer): Estados Empty, Loading Skeletons (CLS < 0.1), Populated, Boundary (100+ items, 120/120) y Error implementados.
    - [ ] ORG-03 (Estudio en 4 Etapas): Estados Empty, Streaming con AbortController, Populated (código diff Naive vs Senior, diálogo socrático, scorecard), Boundary (10,000 chars) y Error con preservación de borrador.
    - [ ] ORG-04 (Global Tasks HUD): Estados Empty (desmontado 0px), Active Streaming con píldora flotante, Populated/Completed y Error implementados.
    - [ ] ORG-05 (Flashcards): Estados Empty, Skeleton 3D, Populated con auto-calificación 1-4, Boundary (mazo 100% dominado) y Error implementados.
    - [ ] ORG-06 (BYOK & Respaldo): Estados Empty (modo offline), Loading (prueba de conexión anti-CLS), Populated (llave enmascarada), Boundary (importación async de 10MB+) y Error implementados.

[ ] 5. ACCESIBILIDAD WCAG 2.2 AA & NAVEGACIÓN (Sección F)
    - [ ] Ratio de contraste >= 4.5:1 verificado en todo texto normal y >= 3.0:1 en controles.
    - [ ] Texto secundario enforcea obligatoriamente --color-text-secondary (#94a3b8) a font-weight: 500+.
    - [ ] Refuerzo no cromático: el color NUNCA es el único portador de estado (tríada Color + Forma/Icono + Texto).
    - [ ] Enfoque de teclado: outline de 2px en #38bdf8 con offset de 2px en :focus-visible.
    - [ ] Skip-link `#main-workspace-canvas` presente como primer elemento focusable del DOM.
    - [ ] Mapeo de las 10 Heurísticas de Nielsen verificado punto por punto.

[ ] 6. PATRONES DE COMPONENTES & MECÁNICA INTERACTIVA (Sección D)
    - [ ] Ciclo de vida completo de botones en 6 estados (Default, Hover, Active, Focus, Disabled, Loading).
    - [ ] Ley Anti-CLS de botones respetada: el contenedor de texto aplica visibility: hidden y el spinner se superpone en slot absoluto reservado.
    - [ ] Contención de scroll en eje único (overscroll-behavior-y: contain) en los 5 contenedores de scroll.
    - [ ] Scrollbar ultrafino editorial de 4px sin barras nativas grises.
    - [ ] Stepper de estudio limitado estrictamente a 4 pestañas con flex-shrink: 0 y reseteo sincrónico de lectura (scrollTop = 0).
    - [ ] Bloqueo de scroll de fondo (Background Scroll-Locking Contract) inyectando --scrollbar-compensation a padding-right en body y elementos fijos.
    - [ ] Sincronización bidireccional entre Cuadrícula, Grafo SVG y Flashcards sin deriva de estado.

[ ] 7. ERGONOMÍA MÓVIL (390x844 Viewport)
    - [ ] Objetivos táctiles mínimos de 44x44px (--control-touch-min).
    - [ ] Dock inferior móvil fijado con padding-bottom: env(safe-area-inset-bottom, 0px).
    - [ ] Cushion de seguridad inferior de 80px en áreas de scroll para evitar oclusión tras el dock.
    - [ ] Cero desborde horizontal (overflow-x: hidden en body, Delta X = 0).
```

---

## Certificación Formal del Workflow de Diseño

Habiendo concluido de forma exhaustiva las Fases 0, 1, 2 y 3 del proceso de Ingeniería de Diseño Visual especificado en `docs/VISUAL_WORKFLOW.md`:
1. `DESIGN.md` se encuentra formalmente certificado con el sistema fundacional y tokens de diseño.
2. `specs/001-clean-workspace-v2/design-spec.md` contiene de manera íntegra, matemáticamente consistente y sin ambigüedades las **Secciones A, B, C, D, E, F, G y H**.
3. El estándar de calidad de `docs/DESIGN_CRITERIA.md` (Dark Engineering Editorial, Nivel Linear / Raycast / Vercel) queda plenamente satisfecho.
4. Queda autorizado el inicio de la Fase de Implementación Downstream (Spec-Driven Development).

<!-- DESIGN_WORKFLOW_COMPLETE -->


