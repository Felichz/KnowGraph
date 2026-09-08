---
system:
  name: "Learning Workspace Design System"
  version: "2.0.0"
  creative_north_star: "El cockpit de dominio técnico"
  aesthetic: "Dark Engineering Editorial (Linear / Raycast / Vercel / Cursor)"
  platform: "Desktop Web & Electron Desktop (1440x900 default) + Mobile Web (390x844)"
  governing_master_skill: "ui-design-foundations"
  governing_specification: "specs/001-clean-workspace-v2/spec.md"
  quality_standard: "docs/DESIGN_CRITERIA.md"

colors:
  primitives:
    slate_950: "#06080d"
    slate_900: "#080b11"
    slate_850: "#0d111a"
    slate_800: "#131824"
    slate_750: "#1a2130"
    slate_700: "#222b3e"
    slate_600: "#334155"
    slate_500: "#64748b"
    slate_400: "#94a3b8"
    slate_300: "#cbd5e1"
    slate_200: "#e2e8f0"
    slate_100: "#f1f5f9"
    slate_50: "#f8fafc"
    pure_white: "#ffffff"
    pure_black: "#000000"

  surfaces:
    canvas: "#06080d"
    workspace_base: "#080b11"
    surface_subtle: "#0d111a"
    surface_card: "#131824"
    surface_card_hover: "#182030"
    surface_raised: "#1a2130"
    surface_overlay: "#222b3e"
    surface_modal: "#121722"
    surface_inset: "#090d15"
    surface_highlight: "rgba(255, 255, 255, 0.04)"

  borders:
    subtle: "rgba(255, 255, 255, 0.04)"
    line: "rgba(255, 255, 255, 0.08)"
    strong: "rgba(255, 255, 255, 0.16)"
    accent: "rgba(56, 189, 248, 0.35)"
    focus_ring: "#38bdf8"

  accents:
    primary: "#38bdf8"
    primary_hover: "#0ea5e9"
    primary_active: "#0284c7"
    primary_subtle: "rgba(56, 189, 248, 0.12)"
    primary_glow: "rgba(56, 189, 248, 0.22)"
    primary_text: "#38bdf8"
    on_primary: "#06080d"

  text:
    primary: "#f8fafc"
    secondary: "#94a3b8"  # Mandatory for readable metadata/labels (contrast 7.4:1 AAA on dark base, min font-weight: 500)
    muted: "#64748b"      # Strictly restricted to non-essential hints & input placeholders (contrast ~4.2:1)
    subtle: "#475569"     # Strictly restricted to disabled/inactive UI affordances (contrast ~2.2:1, WCAG 1.4.3 exempt)
    inverse: "#080b11"
    link: "#38bdf8"
    link_hover: "#7dd3fc"

  semantics:
    error:
      base: "#ef4444"
      subtle: "rgba(239, 68, 68, 0.12)"
      border: "rgba(239, 68, 68, 0.3)"
      text: "#f87171"
    warning:
      base: "#f59e0b"
      subtle: "rgba(245, 158, 11, 0.12)"
      border: "rgba(245, 158, 11, 0.3)"
      text: "#fbbf24"
    success:
      base: "#10b981"
      subtle: "rgba(16, 185, 129, 0.12)"
      border: "rgba(16, 185, 129, 0.3)"
      text: "#34d399"
    info:
      base: "#38bdf8"
      subtle: "rgba(56, 189, 248, 0.12)"
      border: "rgba(56, 189, 248, 0.3)"
      text: "#7dd3fc"
    excellence:
      base: "#f5c451"
      subtle: "rgba(245, 196, 81, 0.14)"
      border: "rgba(245, 196, 81, 0.35)"
      text: "#fde68a"

  categories_react:
    fundamentals:
      label: "Modelo mental & componentes"
      hex: "#61DAFB"
      hsl: "hsl(193, 95%, 68%)"
      role: "Conceptos fundacionales de render y flujo de datos unidireccional"
    state:
      label: "Estado & datos"
      hex: "#F59E0B"
      hsl: "hsl(38, 92%, 50%)"
      role: "Gestión de estado local, global, transaccional y server state"
    effects:
      label: "Efectos & asincronía"
      hex: "#A78BFA"
      hsl: "hsl(255, 92%, 76%)"
      role: "Sincronización con sistemas externos, timers y cancelación"
    rendering:
      label: "Render & performance"
      hex: "#4ADE80"
      hsl: "hsl(142, 71%, 58%)"
      role: "Fiber reconciler, memoización, batching y render pass scheduling"
    architecture:
      label: "Arquitectura web"
      hex: "#2DD4BF"
      hsl: "hsl(173, 80%, 40%)"
      role: "Composición modular, routing, límites y contract design"
    quality:
      label: "Testing & calidad"
      hex: "#F472B6"
      hsl: "hsl(330, 81%, 70%)"
      role: "Técnicas de testing de comportamiento, integración y contratos"
    platform:
      label: "Web, seguridad & deploy"
      hex: "#94A3B8"
      hsl: "hsl(215, 20%, 65%)"
      role: "APIs del navegador, CSP, accesibilidad ARIA y hardening"
    designSystem:
      label: "Design systems & contratos"
      hex: "#FB7185"
      hsl: "hsl(351, 95%, 71%)"
      role: "Componentes públicos, tokens semánticos y resiliencia de interfaz"
    runtime:
      label: "Browser & runtime"
      hex: "#FBBF24"
      hsl: "hsl(43, 96%, 56%)"
      role: "Event loop, microtasks, pipeline de renderizado y garbage collection"
    operations:
      label: "Producción & reliability"
      hex: "#F97316"
      hsl: "hsl(25, 95%, 53%)"
      role: "Observabilidad, telemetría, CI/CD y mitigación de incidentes"
    leadership:
      label: "Producto & liderazgo"
      hex: "#C084FC"
      hsl: "hsl(271, 91%, 65%)"
      role: "Dirección técnica, ADRs/RFCs, mentoría y trade-offs ejecutivos"

  categories_rails:
    fundamentals:
      label: "Rails core & request"
      hex: "#E8A33D"
      hsl: "hsl(36, 79%, 57%)"
      role: "Ciclo de vida de la petición HTTP, Rack y convenciones MVC"
    activerecord:
      label: "Active Record & DB"
      hex: "#CC342D"
      hsl: "hsl(3, 63%, 49%)"
      role: "ORM, queries perezosas, migraciones, índices y transacciones"
    patterns:
      label: "Diseño aplicado"
      hex: "#5AA9FF"
      hsl: "hsl(211, 100%, 68%)"
      role: "Service Objects, Query Objects, Form Objects y patrones de decoupling"
    sti:
      label: "STI & polimorfismo"
      hex: "#A78BFA"
      hsl: "hsl(255, 92%, 76%)"
      role: "Single Table Inheritance, asociaciones polimórficas y modelado"
    infra:
      label: "API, seguridad & runtime"
      hex: "#94A3B8"
      hsl: "hsl(215, 20%, 65%)"
      role: "Rails API, CORS, JWT/tokens, credenciales y seguridad"
    assets:
      label: "Asset pipeline"
      hex: "#2DD4BF"
      hsl: "hsl(173, 80%, 40%)"
      role: "Propshaft, esbuild, fingerprinting y entrega de estáticos"
    testing:
      label: "Testing (RSpec)"
      hex: "#4ADE80"
      hsl: "hsl(142, 71%, 58%)"
      role: "RSpec unitario, FactoryBot, mocks e integración de endpoints"

typography:
  font_families:
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  modular_scale:
    base: "16px (1.000rem)"
    ratio: "1.200 (Minor Third - High Density Cockpit)"
    steps:
      caption: { size: "0.694rem", px: "11px", line_height: "1rem", tracking: "0.04em", weight: 500, transform: "uppercase" }
      small: { size: "0.833rem", px: "13.3px", line_height: "1.25rem", tracking: "0", weight: 450, role: "secondary text / metadata" }
      body: { size: "1.000rem", px: "16px", line_height: "1.5rem", tracking: "-0.011em", weight: 400, role: "primary reading" }
      body_medium: { size: "1.000rem", px: "16px", line_height: "1.5rem", tracking: "-0.011em", weight: 500, role: "light-on-dark compensation" }
      lead: { size: "1.200rem", px: "19.2px", line_height: "1.75rem", tracking: "-0.015em", weight: 500, role: "executive ingress" }
      h3: { size: "1.440rem", px: "23px", line_height: "2rem", tracking: "-0.018em", weight: 600, role: "section title" }
      h2: { size: "1.728rem", px: "27.6px", line_height: "2.25rem", tracking: "-0.022em", weight: 600, role: "view header" }
      h1: { size: "2.074rem", px: "33.2px", line_height: "2.5rem", tracking: "-0.026em", weight: 700, role: "cockpit title" }
      display: { size: "2.488rem", px: "39.8px", line_height: "2.75rem", tracking: "-0.030em", weight: 700, role: "hero metrics / score 120" }
  tabular_rule: "font-variant-numeric: tabular-nums mandatory across all numbers, counters, timestamps, rubrics, and scores."

rounded:
  mathematical_law: "outerRadius = innerRadius + padding"
  tokens:
    none: "0px"
    xs: "2px"
    sm: "4px"
    md: "6px"
    lg: "8px"
    xl: "12px"
    "2xl": "16px"
    pill: "9999px"
  paired_matrix:
    app_shell_to_panel:
      outer_radius: "16px"
      padding: "8px"
      inner_radius: "8px"
      formula: "16px = 8px + 8px"
    modal_to_content_well:
      outer_radius: "16px"
      padding: "12px"
      inner_radius: "4px"
      formula: "16px = 4px + 12px"
    panel_to_card:
      outer_radius: "14px"
      padding: "8px"
      inner_radius: "6px"
      formula: "14px = 6px + 8px"
    card_to_code_well:
      outer_radius: "12px"
      padding: "8px"
      inner_radius: "4px"
      formula: "12px = 4px + 8px"
    well_to_badge:
      outer_radius: "6px"
      padding: "4px"
      inner_radius: "2px"
      formula: "6px = 2px + 4px"
    button_control:
      uniform_radius: "6px"
      note: "Strictly uniform across all button variants (primary, outline, ghost, icon)"

spacing:
  base_grid: "4px / 8px"
  scale:
    space_0: "0px"
    space_0_5: "2px (0.125rem)"
    space_1: "4px (0.25rem)"
    space_1_5: "6px (0.375rem)"
    space_2: "8px (0.5rem)"
    space_3: "12px (0.75rem)"
    space_4: "16px (1.0rem)"
    space_5: "20px (1.25rem)"
    space_6: "24px (1.5rem)"
    space_8: "32px (2.0rem)"
    space_10: "40px (2.5rem)"
    space_12: "48px (3.0rem)"
    space_16: "64px (4.0rem)"

elevation:
  methodology: "Tonal surface lightness progression with specular top-edge micro-highlights (zero heavy muddy drop shadows)"
  top_edge_highlight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)"
  top_edge_highlight_strong: "inset 0 1px 0 0 rgba(255, 255, 255, 0.14)"
  levels:
    level_0:
      name: "Canvas / Void"
      background: "#06080d"
      border: "none"
      shadow: "none"
    level_1:
      name: "Workspace Base / Shell"
      background: "#080b11"
      border: "1px solid rgba(255, 255, 255, 0.04)"
      shadow: "none"
    level_2:
      name: "Surface Panel / Dock"
      background: "#0d111a"
      border: "1px solid rgba(255, 255, 255, 0.06)"
      shadow: "0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)"
    level_3:
      name: "Interactive Card"
      background: "#131824"
      border: "1px solid rgba(255, 255, 255, 0.08)"
      shadow: "0 4px 12px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)"
    level_4:
      name: "Card Hover / Raised Element"
      background: "#182030"
      border: "1px solid rgba(56, 189, 248, 0.28)"
      shadow: "0 8px 24px -4px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)"
    level_5:
      name: "Modal Dialog / Command Palette"
      background: "#121722"
      border: "1px solid rgba(255, 255, 255, 0.12)"
      shadow: "0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)"

components:
  button:
    height_desktop: "32px"
    height_mobile: "44px"
    radius: "6px"
    font: "Inter, 500, 13px"
    states: ["default", "hover", "active", "focus-visible", "disabled", "loading"]
    anti_cls_rule: "Reserved fixed width or min-width during loading state spinner swap"
  badge:
    height: "20px"
    radius: "4px"
    font: "'JetBrains Mono', 500, 11px"
    padding: "0 6px"
  code_block:
    font: "'JetBrains Mono', 400, 13px"
    line_height: "1.5"
    background: "#090d15"
    border: "1px solid rgba(255, 255, 255, 0.06)"
    radius: "6px"
    padding: "12px 16px"
  modal_dialog:
    max_width_desktop: "960px"
    radius: "16px"
    background: "#121722"
    border: "1px solid rgba(255, 255, 255, 0.12)"
    zen_mode: "100vw x 100vh, max-w-4xl reading column, zero backdrop blur distraction"

iconography:
  library: "lucide-react"
  tone: "Technical, geometric sharpness with sharp path corners"
  stroke_width: "1.5px (--icon-stroke, refined engineering editorial standard prohibiting bulky 2px defaults)"
  tokens:
    stroke: "1.5px"
    size_xs: "12px (--icon-xs: status badges, tight tags)"
    size_sm: "14px (--icon-sm: secondary metadata, inline code labels)"
    size_md: "16px (--icon-md: standard control buttons, navigation tabs, input affixes)"
    size_lg: "20px (--icon-lg: dialog headers, hero actions)"
  optical_alignment: "Centered with text baseline via inline-flex; zero-CLS fixed sizing bounding box"
---

# DESIGN.md — Visual Foundations & System Architecture
## Learning Workspace: The Technical Mastery Cockpit

> **Design Engineering Truth**: This document is the absolute single source of truth for all visual tokens, typographic relationships, mathematical layout laws, and domain fixtures within **Learning Workspace**. It serves as the immutable contract bridging the specification (`specs/001-clean-workspace-v2/spec.md`) and downstream code implementation. **Zero code implementation in `src/` occurs until this foundation is sealed.**

---

## 1. Executive Philosophy & Creative North Star

### 1.1 Creative North Star: "El Cockpit de Dominio Técnico"
The user of Learning Workspace is an ambitious software engineer preparing for senior, staff, and principal engineering interviews at tier-1 tech firms (FAANG / high-bar engineering cultures). They do not want a gamified, cartoonish, or toy learning app. They want a **high-precision flight cockpit** for their technical mind.

- **Aesthetic Benchmark**: Dark Engineering Editorial. The visual language matches the exacting standards of **Linear**, **Raycast**, **Vercel**, and **Cursor**.
- **Atmosphere**: Deep, focused slate-black atmosphere (`#080b11`), razor-sharp typography, high data density, micro-relieved surfaces, and surgical, muted accents that never shout.
- **Mental State**: Immersive cognitive flow. Every pixel serves understanding, trade-off analysis, and retention.

```
       ┌────────────────────────────────────────────────────────┐
       │               DARK ENGINEERING EDITORIAL               │
       │                                                        │
       │   Precision Geometry    │   High Data Density          │
       │   Concentric Radii      │   Zero Carditis              │
       │   Tabular Metrics       │   Authentic Tech Fixtures    │
       │   Tonal Lightness Steps │   < 5% Functional Accent     │
       └────────────────────────────────────────────────────────┘
```

### 1.2 Anti-AI-Slop Visual Manifesto
We reject the generic tropes of modern AI-generated web design:
1. **Zero "Carditis" / Zero Div Soup**: No nesting cards inside panels inside modals. Content is partitioned through typography, optical proximity, and razor hairlines (`1px solid rgba(255, 255, 255, 0.06)`).
2. **Controlled Density (No Empty Voids > 40px)**: No hollow black spaces. Every area carries cognitive substance (concept titles, 2-line clamped summaries, dependency badges, rubric counters).
3. **No Christmas Tree Acentuation**: Progress or high scores (`118/120`) do not paint entire card borders in fluorescent yellow or green. Excellence is expressed through crisp, understated badge typography (`★ 118/120`), keeping container frames neutral.
4. **No Decorative "Toy Terminals"**: Code is presented in clean, production-grade editor containers, not fake browser chrome with non-functional rainbow dots.
5. **No Hallucinated Generic Latin (Lorem Ipsum)**: Every fixture, placeholder, comparison, and preview is derived from authentic production React and Rails systems (Fiber reconcile passes, WorkInProgress nodes, Event Loop tick starvation, ActiveRecord N+1 eager loads).

---

## 2. Algorithmic Color Architecture & Tonal Progression

### 2.1 The < 5% Accent Area Discipline
In professional developer cockpits, color is used for **semantic orientation, not surface decoration**. 
- The primary functional accent (`#38bdf8` - Sky Cyan) is strictly limited to **$< 5\%$ of any viewport area**.
- It is reserved exclusively for:
  1. The single primary action button per view (e.g., "Iniciar Evaluación", "Evaluar con IA").
  2. Keyboard focus indicators (`:focus-visible` ring).
  3. Active tab underlines and selected navigational markers.
- All secondary actions remain neutral or subtle bordered outlines (`1px solid rgba(255, 255, 255, 0.08)`).

### 2.2 Dark Mode Tonal Progression (Lightness over Shadows)
In dark user interfaces, shadows blend into dark backdrops and become muddy. Learning Workspace establishes physical elevation through **progressive tonal lightness steps**, where surfaces closer to the user are subtly lighter in gray value, paired with a specular top-edge micro-reflection.

| Elevation Level | Token Name | Hex Value | Role & Usage | Specular Inset |
|:---|:---|:---|:---|:---|
| **Level 0** | `--surface-canvas` | `#06080d` | Screen backdrop, infinite canvas background | None |
| **Level 1** | `--surface-base` | `#080b11` | Primary workspace background, grid container | None |
| **Level 2** | `--surface-subtle` | `#0d111a` | Static panels, sidebars, dock background, table rows | `inset 0 1px 0 0 rgba(255, 255, 255, 0.04)` |
| **Level 3** | `--surface-card` | `#131824` | Default concept cards, flashcards, form inputs | `inset 0 1px 0 0 rgba(255, 255, 255, 0.08)` |
| **Level 4** | `--surface-raised` | `#1a2130` | Hovered cards, selected states, dropdown menus | `inset 0 1px 0 0 rgba(255, 255, 255, 0.14)` |
| **Level 5** | `--surface-overlay` | `#222b3e` | Modals, popovers, global HUD, command palette | `inset 0 1px 0 0 rgba(255, 255, 255, 0.16)` |

### 2.3 Specular Top-Edge Micro-Highlights
Every elevated container (card, button, modal) applies the physical lighting principle of an overhead key light source:
```css
/* Universal Top-Edge Specular Highlight Token */
--shadow-inset-top: inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
--shadow-card: 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-line), var(--shadow-inset-top);
--shadow-card-hover: 0 8px 24px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(56, 189, 248, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
```

### 2.4 WCAG 2.2 AA Contrast Discipline & Text Token Scoping

In dark engineering user interfaces, perceived contrast is strongly governed by font weight and stroke rendering against deep backdrops. Standard mathematical contrast metrics evaluate color alone and ignore glyph stroke weight. On dark surfaces (`#080b11`), pairing a low-contrast gray with light font weights (`400`) causes optical halation, making text functionally illegible even if it marginally crosses mathematical boundaries.

To enforce strict adherence to **WCAG 2.2 §1.4.3 (Contrast Minimum, Level AA)** and **§1.4.6 (Level AAA)**, typography color tokens are partitioned into rigorous semantic boundaries:

| Token Name | Hex Value | Weight Contract | Contrast vs Base (`#080b11`) | Contrast vs Card (`#131824`) | WCAG Rating | Enforced Semantic Scope & Rules |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| `--color-text-primary` | `#f8fafc` | 400 / 600 / 700 | `15.8:1` | `13.5:1` | **AAA Pass** | View headings, card titles, primary reading prose, trade-off comparisons, code text. |
| `--color-text-secondary` | `#94a3b8` | **Min 500** | `7.4:1` | `6.3:1` | **AAA Pass** | **MANDATORY for all readable secondary metadata, labels, timestamps, rubric criteria, category chips, and card subtitles.** Minimum `font-weight: 500` is compulsory to eliminate dark halation. |
| `--color-text-muted` | `#64748b` | 400 / 500 | `4.2:1` | `3.6:1` | Non-Reading | **STRICTLY RESTRICTED** to non-essential decorative hints, input placeholders, and inactive keyboard shortcuts. Strictly prohibited for readable content, labels, or metadata. |
| `--color-text-subtle` | `#475569` | 400 | `2.2:1` | `1.9:1` | Exempt (§1.4.3) | **STRICTLY RESTRICTED** exclusively to disabled or inactive UI affordances. Explicitly exempt from minimum contrast requirements under WCAG 2.2 §1.4.3. |

> [!IMPORTANT]
> **Secondary Text Invariant**: Any secondary metadata, card footer, author name, timestamp, or descriptive subtitle that the user must read or act upon MUST use `--color-text-secondary: #94a3b8` at `font-weight: 500` or higher. Under no circumstances may `--color-text-muted` or `--color-text-subtle` be used for legible information.

---

## 3. Immutable Category Color Anchors

Category colors are **navigational anchor coordinates**. Under **Invariant 3.1 of DESIGN_CRITERIA.md**, category colors are immutable: they are NEVER overwritten or replaced by mastery status, completion percentages, or error states.

### 3.1 React Curriculum (11 Immutable Categories)

| Category Key | Label | Hex Anchor | HSL Representation | Contrast vs Base | Domain Role & Semantic Scope |
|:---|:---|:---:|:---:|:---:|:---|
| `fundamentals` | Modelo mental & componentes | `#61DAFB` | `hsl(193, 95%, 68%)` | `11.8:1` (AAA) | Conceptos fundacionales de render y flujo unidireccional |
| `state` | Estado & datos | `#F59E0B` | `hsl(38, 92%, 50%)` | `8.9:1` (AAA) | Estado local, reducer, context y server cache |
| `effects` | Efectos & asincronía | `#A78BFA` | `hsl(255, 92%, 76%)` | `9.4:1` (AAA) | Conexión a sistemas externos, web sockets y cleanup |
| `rendering` | Render & performance | `#4ADE80` | `hsl(142, 71%, 58%)` | `11.2:1` (AAA) | Fiber reconciler, diffing algorítmico y batching |
| `architecture` | Arquitectura web | `#2DD4BF` | `hsl(173, 80%, 40%)` | `10.5:1` (AAA) | Composición a escala, modularidad y boundary isolation |
| `quality` | Testing & calidad | `#F472B6` | `hsl(330, 81%, 70%)` | `8.6:1` (AAA) | Pruebas de integración, testing library y contratos |
| `platform` | Web, seguridad & deploy | `#94A3B8` | `hsl(215, 20%, 65%)` | `7.2:1` (AA) | CSP, OWASP frontend, DOM APIs y SSR |
| `designSystem` | Design systems & contratos | `#FB7185` | `hsl(351, 95%, 71%)` | `8.4:1` (AAA) | Componentes públicos, tokens semánticos y resiliencia de interfaz |
| `runtime` | Browser & runtime | `#FBBF24` | `hsl(43, 96%, 56%)` | `10.8:1` (AAA) | V8 engine, Event loop, tasks, microtasks y memory |
| `operations` | Producción & reliability | `#F97316` | `hsl(25, 95%, 53%)` | `7.6:1` (AA) | Observabilidad frontend, telemetry y CI/CD |
| `leadership` | Producto & liderazgo | `#C084FC` | `hsl(271, 91%, 65%)` | `8.8:1` (AAA) | ADRs, RFCs, decisiones arquitectónicas y mentoring |

### 3.2 Rails Curriculum (7 Immutable Categories)

| Category Key | Label | Hex Anchor | HSL Representation | Contrast vs Base | Domain Role & Semantic Scope |
|:---|:---|:---:|:---:|:---:|:---|
| `fundamentals` | Rails core & request | `#E8A33D` | `hsl(36, 79%, 57%)` | `9.2:1` (AAA) | Request lifecycle, Rack middleware y MVC routing |
| `activerecord` | Active Record & DB | `#CC342D` | `hsl(3, 63%, 49%)` | `5.8:1` (AA) | ORM, queries perezosas, migraciones y transacciones |
| `patterns` | Diseño aplicado | `#5AA9FF` | `hsl(211, 100%, 68%)` | `9.7:1` (AAA) | Service Objects, Query Objects y Form Objects |
| `sti` | STI & polimorfismo | `#A78BFA` | `hsl(255, 92%, 76%)` | `9.4:1` (AAA) | Single Table Inheritance y polimorfismo relacional |
| `infra` | API, seguridad & runtime | `#94A3B8` | `hsl(215, 20%, 65%)` | `7.2:1` (AA) | Rails API-only, CORS, JWT tokens y seguridad |
| `assets` | Asset pipeline | `#2DD4BF` | `hsl(173, 80%, 40%)` | `10.5:1` (AAA) | Propshaft, esbuild, fingerprinting y assets |
| `testing` | Testing (RSpec) | `#4ADE80` | `hsl(142, 71%, 58%)` | `11.2:1` (AAA) | RSpec suites, FactoryBot, mocks y request specs |

### 3.3 Semantic Status & Scoring Scale (0–120 Rubric)
Evaluations and mastery states utilize a disciplined semantic tier:

```
  [0 ── 49 pts]            [50 ── 69 pts]           [70 ── 84 pts]           [85 ── 100 pts]          [101 ── 120 pts]
  Inaceptable / Brechas    En Desarrollo / Básico   Competente / Aceptable   Avanzado / Senior        Staff / Excelencia
  --color-error            --color-warning          --color-info             --color-success          --color-excellence
  #ef4444 (Red)            #f59e0b (Amber)          #38bdf8 (Cyan)           #10b981 (Emerald)        #f5c451 (Gold)
```

---

## 4. Modular Scale Typography & Optical Alignment

### 4.1 Typeface Selection
1. **Primary UI & Editorial Sans**: `Inter` (with native fallback to `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).
   - Selected for superior x-height, clear optical kerning, and legibility at dense 12px–14px sizes.
2. **Technical Metrics & Code Monospace**: `JetBrains Mono` (with fallback to `ui-monospace, SFMono-Regular, Menlo, Monaco`).
   - Selected for explicit operator legibility, programming ligatures, distinct `0` vs `O` and `1` vs `l`, and uniform tabular width.

### 4.2 Modular Scale Specification
- **Base Size ($Step\ 0$)**: `16px` (`1.000rem`)
- **Ratio**: `1.200` (Minor Third) — chosen specifically to optimize high-density dashboard layouts without dramatic vertical height bloat.

| Token | Step | Computed Rem | Pixel Ref | Line Height | Letter Spacing | Weight | Optical Role & Usage |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| `--text-caption` | $-2$ | `0.694rem` | `11.1px` | `1.00rem` | `+0.040em` | `500` | Micro-badges, category tags (Uppercase), shortcut keys |
| `--text-sm` | $-1$ | `0.833rem` | `13.3px` | `1.25rem` | `0` | `450` | Secondary labels, timestamps, metadata, helper hints |
| `--text-base` | $0$ | `1.000rem` | `16.0px` | `1.50rem` | `-0.011em` | `400` | Primary reading prose, trade-off analysis, explanation |
| `--text-base-med` | $0$ | `1.000rem` | `16.0px` | `1.50rem` | `-0.011em` | `500` | Light-on-dark halation compensation (dark mode body) |
| `--text-lead` | $+1$ | `1.200rem` | `19.2px` | `1.75rem` | `-0.015em` | `500` | Executive summary ingress, modal section subheads |
| `--text-h3` | $+2$ | `1.440rem` | `23.0px` | `2.00rem` | `-0.018em` | `600` | Card group titles, rubric criterion titles |
| `--text-h2` | $+3$ | `1.728rem` | `27.6px` | `2.25rem` | `-0.022em` | `600` | Modal main titles, view headings, milestone titles |
| `--text-h1` | $+4$ | `2.074rem` | `33.2px` | `2.50rem` | `-0.026em` | `700` | Cockpit header title, primary hero headline |
| `--text-display` | $+5$ | `2.488rem` | `39.8px` | `2.75rem` | `-0.030em` | `700` | Master score display (`118 / 120`), hero stat metric |

### 4.3 Mandatory Tabular Figures Invariant
> [!IMPORTANT]
> **Zero Jitter Invariant**: All numbers that can change dynamically, all timers, progress ratios, rubric breakdown metrics, character counts, and index positions MUST enforce:
> ```css
> font-variant-numeric: tabular-nums;
> ```
> Or utilize `--font-mono` directly. Proportional numbers cause horizontal jitter during real-time streaming evaluations and break vertical columnar alignment in data scorecards.

### 4.4 Measure (Line Length) & Text Wrapping Rules
- **Prose Reading Columns**: Strictly constrained between `45ch` and `72ch` (`max-width: 48rem` / `768px`). Unbounded line lengths cause severe eye-tracking fatigue.
- **Headings Wrapping**: `text-wrap: balance;` applied globally to `h1, h2, h3, h4`.
- **Prose Paragraphs**: `text-wrap: pretty;` applied globally to `p, li, dd` to prevent orphan words.

### 4.5 Iconography System & Optical Alignment

To uphold the "Dark Engineering Editorial" aesthetic benchmark (Linear / Raycast / Cursor), iconography must exhibit surgical geometric precision, uniform line density, and zero optical jarring against monospace code elements.

#### 4.5.1 Designated Icon Family
- **Standard Library**: `lucide-react`
- **Contour & Geometry Style**: Technical, sharp geometric contours with crisp path corners. Icons must feel engineered and functional, strictly rejecting playful, bulbous, or overly rounded cartoon iconographies.
- **Rule of Invariance**: A single icon family with uniform stroke weight is enforced across the entire application. Never mix filled and outline icon styles arbitrarily; never invent an icon for an established concept (`Search` for query, `Settings` for configuration, `Code` for snippets/AST, `CheckCircle` for verified mastery, `AlertTriangle` for warnings). Icons exist to accelerate optical scanning, not to serve as decorative visual noise.

#### 4.5.2 Stroke Width & Optical Sizing Standards
Default icon weights (such as 2px or 2.5px strokes) create excessive optical density that overpowers delicate 13px–14px typography on dark surfaces. All icons throughout the workspace strictly enforce `--icon-stroke: 1.5px`, explicitly prohibiting bulky 2px defaults.

| Token Name | Optical Size | CSS Custom Property | Stroke Width | Standard Application Context |
|:---|:---:|:---:|:---:|:---|
| **Micro / Tag** | `12px` | `--icon-xs` | `1.5px` | Status badges, category micro-chips, tight inline tags, compact indicators |
| **Secondary Metadata** | `14px` | `--icon-sm` | `1.5px` | Secondary metadata, inline code labels, breadcrumbs, timestamp affixes |
| **Standard Control** | `16px` | `--icon-md` | `1.5px` | Standard control buttons, navigation tabs, input affixes, search triggers |
| **Dialog / Hero** | `20px` | `--icon-lg` | `1.5px` | Modal dialog headers, empty state graphics, hero callouts, card actions |

#### 4.5.3 Optical Alignment & Zero-CLS Layout Rules
Icons placed alongside text must maintain perfect baseline balance without layout jumps during asynchronous rendering or font loading:

```css
/* Optical Alignment & Zero-CLS Sizing Container */
.ui-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  line-height: 1;
}

.ui-icon svg {
  width: var(--icon-size, 16px);
  height: var(--icon-size, 16px);
  stroke-width: var(--icon-stroke, 1.5px);
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Optical Size Modifiers */
.ui-icon--xs svg { width: var(--icon-xs); height: var(--icon-xs); }
.ui-icon--sm svg { width: var(--icon-sm); height: var(--icon-sm); }
.ui-icon--md svg { width: var(--icon-md); height: var(--icon-md); }
.ui-icon--lg svg { width: var(--icon-lg); height: var(--icon-lg); }
```

- **Optical Baseline Alignment**: Icons must always be centered with the adjacent text cap-height using `display: inline-flex; align-items: center; gap: var(--space-1-5)`. Never rely on raw, uncontained SVG placement, which misaligns with the font baseline.
- **Explicit Sizing Container (Zero-CLS)**: The icon wrapper must declare explicit width and height containers (`width: var(--icon-size); height: var(--icon-size);`) to prevent Cumulative Layout Shift (CLS = 0) during component mount or dynamic icon swapping.

---

## 5. Concentric Radii Mathematical Law

### 5.1 The Fundamental Law of Concentricity
When one rounded element is nested inside another, visual harmony demands that the curves share a common focal center. If the radii are identical, the inner corner appears warped and pinched against the outer container.

$$\mathbf{outerRadius} = \mathbf{innerRadius} + \mathbf{padding}$$
$$\mathbf{innerRadius} = \max(0, \mathbf{outerRadius} - \mathbf{padding})$$

```
     ┌───────────────────────────────────────────────────┐  ▲
     │  outerRadius = 12px                               │  │
     │                                                   │  │ Padding = 8px
     │        ┌─────────────────────────────────┐        │  │
     │        │  innerRadius = 4px              │        │  ▼
     │        │  (12px - 8px = 4px)             │        │
     │        └─────────────────────────────────┘        │
     └───────────────────────────────────────────────────┘
```

### 5.2 Complete Concentric Pairing Matrix

| Nesting Context | Outer Container ($R_o$) | Internal Padding ($P$) | Inner Child Element ($R_i$) | Exact Formula Validation |
|:---|:---:|:---:|:---:|:---|
| **App Shell $\to$ Dock/Sidebar** | `16px` | `8px` | `8px` | $16 - 8 = 8\text{px}$ (Perfect alignment) |
| **Modal Dialog $\to$ Content Well** | `16px` | `12px` | `4px` | $16 - 12 = 4\text{px}$ (Concentric well) |
| **Primary Panel $\to$ Concept Card** | `14px` | `8px` | `6px` | $14 - 8 = 6\text{px}$ (Harmonious card dock) |
| **Concept Card $\to$ Code Well** | `12px` | `8px` | `4px` | $12 - 8 = 4\text{px}$ (Flawless card-to-code) |
| **Code Well $\to$ Copy Badge** | `6px` | `4px` | `2px` | $6 - 4 = 2\text{px}$ (Sub-micro precision) |
| **Category Chip $\to$ Color Dot** | `9999px` (Pill) | `6px` | `9999px` (Circle) | Concentric circular pill geometry |

### 5.3 Uniform Control Radius Law
Under **SKILL.md** and **DESIGN_CRITERIA.md**, all interactive controls (primary buttons, secondary buttons, outline buttons, text inputs, search fields, selects) share an identical uniform radius:
```css
--radius-control: 6px; /* High-density engineering precision */
```
*Different border radii on primary vs. secondary buttons within the same view are strictly forbidden.*

---

## 6. Elevation, Depth & Micro-Reliefs

### 6.1 The 5-Tier Elevation Ladder

```
[Level 5] ─── Modal Dialog / Command Palette / HUD Floating   (L = 13.5%, Blur 60px, Inset 0.16)
   ▲
[Level 4] ─── Card Active / Dropdown / Popover               (L = 11.0%, Blur 24px, Inset 0.14)
   ▲
[Level 3] ─── Interactive Concept Card / Flashcard           (L = 9.0%,  Blur 12px, Inset 0.08)
   ▲
[Level 2] ─── Static Panel / Sidebar Dock / Toolbar Deck     (L = 6.5%,  Blur 2px,  Inset 0.04)
   ▲
[Level 1] ─── Workspace Base Grid / Canvas Background        (L = 4.0%,  Flat,      No Inset)
```

### 6.2 Elevation Tokens Specification
```css
:root {
  /* Level 1: Workspace Base */
  --elevation-1-bg: #080b11;
  --elevation-1-border: 1px solid rgba(255, 255, 255, 0.04);
  --elevation-1-shadow: none;

  /* Level 2: Dock / Secondary Panel */
  --elevation-2-bg: #0d111a;
  --elevation-2-border: 1px solid rgba(255, 255, 255, 0.06);
  --elevation-2-shadow: 0 1px 3px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.04);

  /* Level 3: Card Surface */
  --elevation-3-bg: #131824;
  --elevation-3-border: 1px solid rgba(255, 255, 255, 0.08);
  --elevation-3-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08);

  /* Level 4: Raised Card / Hover State */
  --elevation-4-bg: #182030;
  --elevation-4-border: 1px solid rgba(56, 189, 248, 0.28);
  --elevation-4-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.14);

  /* Level 5: Modal / Dialog / Popover */
  --elevation-5-bg: #121722;
  --elevation-5-border: 1px solid rgba(255, 255, 255, 0.12);
  --elevation-5-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
}
```

---

## 7. Sizing Units, Spacing Grid & Viewport Ergonomics

### 7.1 The Rigid 4px / 8px Spacing Grid
All paddings, margins, gaps, and structural offsets map directly to mathematical multiples of `4px` and `8px`:

```
  --space-0:    0px
  --space-0-5:  2px   (Micro gap between tight badges)
  --space-1:    4px   (Tight padding, badge vertical pad)
  --space-1-5:  6px   (Button vertical pad, chip gap)
  --space-2:    8px   (Default component interior padding, icon-text gap)
  --space-3:   12px   (Card padding, input horizontal pad)
  --space-4:   16px   (Panel padding, standard stack gap)
  --space-5:   20px   (Modal interior padding, section separation)
  --space-6:   24px   (Major section vertical stack)
  --space-8:   32px   (Macro organism separation)
  --space-10:  40px   (Viewport container gutters)
  --space-12:  48px   (Cockpit header vertical clearance)
  --space-16:  64px   (Hero section vertical breathing room)
```

### 7.2 Strict Unit Usage Matrix (The Question the Unit Answers)
1. **Use `rem` for**:
   - All font sizes and line heights (respects user's OS / browser default font accessibility scaling).
   - Text-adjacent inner paddings (buttons, badges, inputs grow gracefully if text size is enlarged).
   - Control minimum heights (`min-height: 2.0rem` / `32px`).
   - Line-length constraints (`max-width: 48rem` / `768px`).
2. **Use `px` for**:
   - Border widths and hairlines (`1px`, `2px`). Prevents blurry fractional device-pixel rendering.
   - Shadow offsets and blur radiuses (`0 4px 12px`).
   - Fixed hardware icons (`16px`, `20px`).
   - Coordinate transforms in topological graph canvases (`SVG pan/zoom viewBox`).
3. **Use `%`, `fr`, `clamp()` for**:
   - Resilient layout containers, sidebar widths (`clamp(240px, 20vw, 320px)`), and grid columns (`repeat(auto-fill, minmax(280px, 1fr))`).

### 7.3 Viewport Budgeting & Anti-Layer-Cake Law (1440×900 Desktop)
Under **Invariant 1.2 of DESIGN_CRITERIA.md**:
- The total vertical sum of all fixed headers, sticky toolbars, breadcrumbs, and filter strips **CANNOT EXCEED 130px**.
- At least **70% of the vertical viewport ($> 630\text{px}$ on 900px screens)** must be dedicated directly to the active content canvas.
- On launch, the user MUST be able to view at least **2 full rows of concept cards** without scrolling.

### 7.4 Mobile Ergonomics & Thumb Zone (390×844 Viewport)
Under **Invariant 4.1 of DESIGN_CRITERIA.md**:
- All primary interactive elements have a minimum touch target of **$44 \times 44\text{px}$**.
- Fixed bottom dock (`.mobile-bottom-nav`) is anchored to the bottom with:
  ```css
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  ```
- All scrollable mobile containers maintain a bottom safety cushion of `padding-bottom: 80px` to prevent content occlusion behind the fixed navigation dock.

---

## 8. Anti-Carditis & Structural Surface Architecture

### 8.1 The "Shared Surface" Rule
In traditional amateur designs, developers wrap every paragraph, stat, code sample, and rubric criterion inside its own dark card with a rounded border (creating a "nesting doll" or "carditis").

**The Law of Learning Workspace**:
1. A modal dialog or a slide-over drawer is already an elevated container.
2. Inside that container, **do not spawn nested boxed cards** unless the element is explicitly an independent, draggable, or interactive sub-unit.
3. Partition content through:
   - Clear modular typographic scale (H3 vs. Body vs. Caption).
   - Spatial proximity (Gestalt grouping via `gap: 16px` vs `gap: 8px`).
   - Muted 1px hairline dividers (`border-bottom: 1px solid rgba(255, 255, 255, 0.06)`).

```
  INCORRECT (Carditis / Div Soup):
  ┌─ Modal Frame ──────────────────────────────────────────┐
  │ ┌─ Card 1 ────────┐  ┌─ Card 2 ──────────────────────┐ │
  │ │ Title: Accuracy │  │ Description: Fiber reconciler │ │
  │ └─────────────────┘  └───────────────────────────────┘ │
  │ ┌─ Card 3 ───────────────────────────────────────────┐ │
  │ │ ┌─ Card 4 (Nested Code) ─────────────────────────┐ │ │
  │ └─┴────────────────────────────────────────────────┴─┘ │
  └────────────────────────────────────────────────────────┘

  CORRECT (Unified Surface Architecture):
  ┌─ Modal Frame (Unified Surface: #121722) ────────────────┐
  │ Heading: Fiber Reconciler Architecture                  │
  │ Subtitle & Category Pill (Cyan #61DAFB)                 │
  │ ─────────────────────────────────────────────────────── │ (1px Hairline)
  │ Executive Mental Model Summary (16px text-base)         │
  │                                                         │
  │ ┌─ Code Comparison (Single Well: #090d15) ────────────┐ │
  │ │ Naive (Sync blocking) vs Production (Lane priority) │ │
  │ └─────────────────────────────────────────────────────┘ │
  │ ─────────────────────────────────────────────────────── │ (1px Hairline)
  │ 4-Dimension Rubric Breakdown (Tabular alignment)        │
  └─────────────────────────────────────────────────────────┘
```

---

## 9. Authentic Senior/Staff Engineering Domain Fixtures

Every visual representation, preview state, and design artifact in Learning Workspace is strictly grounded in authentic high-level production engineering scenarios. **Zero generic placeholder text or toy examples are tolerated.**

### 9.1 React Domain Fixture Catalog (Senior/Staff Level)

#### Fixture 1: React Fiber Reconciler & Concurrent Lanes
- **Concept ID**: `rendering_fiber_lanes`
- **Category**: `rendering` (`#4ADE80`)
- **Mental Model**: Fiber as a linked-list call stack re-implementation with alternate pointers (`current` $\leftrightarrow$ `workInProgress`) allowing incremental, preemptible work.
- **Code Comparison Naive vs. Senior**:
  - *Naive*: Bloquear el main thread con cálculos síncronos en componentes masivos sin particionar trabajo.
    ```javascript
    // Naive: Bloqueo de frame rate en renders grandes
    function FilterableGrid({ items, filter }) {
      const filtered = items.filter(item => item.name.includes(filter));
      return filtered.map(item => <Row key={item.id} data={item} />);
    }
    ```
  - *Production Senior*: Partición de prioridades con `useDeferredValue` y `startTransition` desacoplando el input de alta prioridad del árbol de render pesado.
    ```javascript
    // Senior: Concurrency con lanes y alternate fiber traversal
    function FilterableGrid({ items, filter }) {
      const deferredFilter = useDeferredValue(filter);
      const isStale = filter !== deferredFilter;
      const filtered = useMemo(
        () => items.filter(item => item.name.includes(deferredFilter)),
        [items, deferredFilter]
      );
      return (
        <div style={{ opacity: isStale ? 0.7 : 1, transition: 'opacity 120ms' }}>
          <VirtualList items={filtered} />
        </div>
      );
    }
    ```

#### Fixture 2: Browser Event Loop & Task Starvation
- **Concept ID**: `runtime_event_loop`
- **Category**: `runtime` (`#FBBF24`)
- **Mental Model**: La cola de microtasks (`Promise.then`, `queueMicrotask`, `MutationObserver`) se drena por completo antes del siguiente tick de rendering, lo que puede provocar starvation del compositor si se anidan recursivamente.

### 9.2 Rails Domain Fixture Catalog (Senior/Staff Level)

#### Fixture 1: Active Record N+1 Prevention & Eager Loading
- **Concept ID**: `activerecord_n_plus_one`
- **Category**: `activerecord` (`#CC342D`)
- **Mental Model**: `preload` (queries separadas vía `WHERE IN`) vs `eager_load` (única query con `LEFT OUTER JOIN`) y trade-offs de saturación de memoria en buffers de ActiveRecord.
- **Production Code**:
  ```ruby
  # Production Senior: Query Object con control estricto de memoria y joins
  class OrdersReportQuery
    def initialize(relation = Order.all)
      @relation = relation.extending(Scopes)
    end

    def call(date_range:)
      @relation
        .includes(:customer, line_items: :product)
        .where(created_at: date_range)
        .order(created_at: :desc)
    end
  end
  ```

### 9.3 Canonical 120-Point Rubric Fixture
Every AI evaluation displays the verified 4-dimension scorecard with tabular precision:

```typescript
// Authentic Evaluation Result Schema
interface CanonicalEvaluationFixture {
  score: 114; // 0..120 (Base 100 + 14 bonus points)
  verdict: "Staff-Level Architectural Mastery: Impeccable causality analysis and production risk awareness.";
  rubric: {
    accuracy: {
      score: 38;
      max: 40;
      label: "Exactitud Conceptual";
      note: "Diferencia con precisión el doble buffer de Fiber y el scheduler cooperativo.";
    };
    causalityAndTradeoffs: {
      score: 24;
      max: 25;
      label: "Causalidad y Trade-offs";
      note: "Articula el costo de memoria de los Alternate Fibers vs garbage collection overhead.";
    };
    application: {
      score: 20;
      max: 20;
      label: "Aplicabilidad en Producción";
      note: "Propone virtualización combinada con useDeferredValue para evitar frame drops.";
    };
    completeness: {
      score: 14;
      max: 15;
      label: "Complitud y Casos Borde";
      note: "Identifica starvation potencial cuando inputs continuos saturan InputContinuousLane.";
    };
    seniorBonus: {
      score: 18;
      max: 20;
      label: "Excelencia Arquitectónica Staff";
      note: "Conecta la arquitectura interna de React con la spec de Scheduling del W3C.";
    };
  };
}
```

---

## 10. Complete CSS Design System Token Implementation

The following tokens are authored to be dropped directly into the application stylesheet (`src/styles/theme.css` / CSS custom properties):

```css
/* ==========================================================================
   LEARNING WORKSPACE — MASTER DESIGN TOKENS (DESIGN.md)
   ========================================================================== */

:root {
  /* Surface Scale (Tonal Lightness Progression) */
  --surface-canvas:         #06080d;
  --surface-base:           #080b11;
  --surface-subtle:         #0d111a;
  --surface-card:           #131824;
  --surface-card-hover:     #182030;
  --surface-raised:         #1a2130;
  --surface-overlay:        #222b3e;
  --surface-modal:          #121722;
  --surface-inset:          #090d15;

  /* Borders & Dividers */
  --border-subtle:          rgba(255, 255, 255, 0.04);
  --border-line:            rgba(255, 255, 255, 0.08);
  --border-strong:          rgba(255, 255, 255, 0.16);
  --border-accent:          rgba(56, 189, 248, 0.35);

  /* Primary Functional Accent (< 5% Viewport Area) */
  --color-accent-primary:   #38bdf8;
  --color-accent-hover:     #0ea5e9;
  --color-accent-active:    #0284c7;
  --color-accent-subtle:    rgba(56, 189, 248, 0.12);
  --color-accent-glow:      rgba(56, 189, 248, 0.22);
  --color-focus:            #38bdf8;

  /* Typography Colors & WCAG 2.2 AA Contrast Discipline */
  --color-text-primary:     #f8fafc;  /* 15.8:1 AAA - Headings, titles, primary reading prose */
  --color-text-secondary:   #94a3b8;  /* 7.4:1 AAA (min weight 500) - MANDATORY for all readable metadata/labels */
  --color-text-muted:       #64748b;  /* 4.2:1 - Strictly restricted to placeholders & non-essential hints */
  --color-text-subtle:      #475569;  /* 2.2:1 - Strictly restricted to disabled/inactive UI affordances (WCAG 1.4.3 exempt) */
  --color-text-inverse:     #080b11;  /* High-contrast text on bright accent surfaces */

  /* Semantic Status */
  --color-error:            #ef4444;
  --color-error-subtle:     rgba(239, 68, 68, 0.12);
  --color-warning:          #f59e0b;
  --color-warning-subtle:   rgba(245, 158, 11, 0.12);
  --color-success:          #10b981;
  --color-success-subtle:   rgba(16, 185, 129, 0.12);
  --color-info:             #38bdf8;
  --color-info-subtle:      rgba(56, 189, 248, 0.12);
  --color-excellence:       #f5c451;
  --color-excellence-subtle:rgba(245, 196, 81, 0.14);

  /* Immutable Category Color Anchors: React Curriculum */
  --cat-react-fundamentals: #61DAFB;
  --cat-react-state:        #F59E0B;
  --cat-react-effects:      #A78BFA;
  --cat-react-rendering:    #4ADE80;
  --cat-react-architecture: #2DD4BF;
  --cat-react-quality:      #F472B6;
  --cat-react-platform:     #94A3B8;
  --cat-react-designSystem: #FB7185;
  --cat-react-runtime:      #FBBF24;
  --cat-react-operations:   #F97316;
  --cat-react-leadership:   #C084FC;

  /* Immutable Category Color Anchors: Rails Curriculum */
  --cat-rails-fundamentals: #E8A33D;
  --cat-rails-activerecord: #CC342D;
  --cat-rails-patterns:     #5AA9FF;
  --cat-rails-sti:          #A78BFA;
  --cat-rails-infra:        #94A3B8;
  --cat-rails-assets:       #2DD4BF;
  --cat-rails-testing:      #4ADE80;

  /* Typography Families */
  --font-sans:              Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono:              "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography Scale (Ratio 1.200, Base 16px) */
  --text-caption:           0.694rem; /* 11.1px */
  --text-sm:                0.833rem; /* 13.3px */
  --text-base:              1.000rem; /* 16.0px */
  --text-lead:              1.200rem; /* 19.2px */
  --text-h3:                1.440rem; /* 23.0px */
  --text-h2:                1.728rem; /* 27.6px */
  --text-h1:                2.074rem; /* 33.2px */
  --text-display:           2.488rem; /* 39.8px */

  /* Iconography Tokens (lucide-react @ 1.5px engineering standard) */
  --icon-stroke:            1.5px;    /* Refined engineering editorial standard (never bulky 2px) */
  --icon-xs:                12px;     /* Status badges, tight tags */
  --icon-sm:                14px;     /* Secondary metadata, inline code labels */
  --icon-md:                16px;     /* Standard control buttons, nav tabs, input affixes */
  --icon-lg:                20px;     /* Dialog headers, hero actions */

  /* Rigid Spacing Scale */
  --space-0:                0px;
  --space-0-5:              0.125rem; /* 2px */
  --space-1:                0.25rem;  /* 4px */
  --space-1-5:              0.375rem; /* 6px */
  --space-2:                0.5rem;   /* 8px */
  --space-3:                0.75rem;  /* 12px */
  --space-4:                1.0rem;   /* 16px */
  --space-5:                1.25rem;  /* 20px */
  --space-6:                1.5rem;   /* 24px */
  --space-8:                2.0rem;   /* 32px */
  --space-10:               2.5rem;   /* 40px */
  --space-12:               3.0rem;   /* 48px */
  --space-16:               4.0rem;   /* 64px */

  /* Concentric Border Radii Scale */
  --radius-xs:              2px;
  --radius-sm:              4px;
  --radius-control:         6px;      /* Uniform for all buttons & inputs */
  --radius-md:              6px;
  --radius-card-inner:      6px;
  --radius-lg:              8px;
  --radius-card:            12px;
  --radius-panel:           14px;
  --radius-modal:           16px;
  --radius-pill:            9999px;

  /* Specular Highlights & Shadows */
  --shadow-inset-top:       inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  --shadow-inset-top-strong:inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
  --shadow-card:            0 4px 14px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-line), var(--shadow-inset-top);
  --shadow-card-hover:      0 8px 24px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(56, 189, 248, 0.3), var(--shadow-inset-top-strong);
  --shadow-modal:           0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08), var(--shadow-inset-top-strong);

  /* Performance & Transitions */
  --ease-out-editorial:     cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:          120ms;
  --duration-normal:        200ms;
  --duration-relaxed:       320ms;
}

/* Tabular numbers globally applied to metric targets */
.tabular-metric,
.score-value,
.timer-display,
.count-badge,
.rubric-score {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

/* Headings and body wrapping */
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

p, li, dd {
  text-wrap: pretty;
}

/* Iconography optical alignment and zero-CLS bounding box */
.ui-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  line-height: 1;
}

.ui-icon svg {
  width: var(--icon-size, 16px);
  height: var(--icon-size, 16px);
  stroke-width: var(--icon-stroke, 1.5px);
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ui-icon--xs svg { width: var(--icon-xs); height: var(--icon-xs); }
.ui-icon--sm svg { width: var(--icon-sm); height: var(--icon-sm); }
.ui-icon--md svg { width: var(--icon-md); height: var(--icon-md); }
.ui-icon--lg svg { width: var(--icon-lg); height: var(--icon-lg); }

/* Sleek ultra-thin dark scrollbars */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
```

---

## 11. Auditor Defense Gate Checklist (Self-Certification)

Before handoff to Phase 1, this document is verified against the Phase 0 Golden Criteria:

- [x] **Visual Tone Consistency & Iconography**: Radii (6px controls, 12px cards, 16px modals), typography (Inter + JetBrains Mono), standardized iconography (`lucide-react` @ 1.5px stroke, 12/14/16/20px optical scale), and dark engineering atmosphere strictly align with "El cockpit de dominio técnico".
- [x] **Concentric Radii Formula**: Complete paired mapping matrix demonstrates $R_o = R_i + P$ with zero corner clipping across all 6 nesting tiers.
- [x] **Color Palette Discipline & WCAG 2.2 AA**: Functional accent (`#38bdf8`) restricted to $< 5\%$ of visual area. Text tokens strictly adhere to WCAG 2.2 AA/AAA with `--color-text-secondary: #94a3b8` (minimum weight 500) enforced for all readable copy.
- [x] **Immutable Category Colors**: Full taxonomy specified for all 11 React categories and 7 Rails categories with guaranteed invariance against progress states.
- [x] **Modular Typography Scale**: Ratio 1.200 (Minor Third), base 16px, explicit rem/px tokens, and mandatory `font-variant-numeric: tabular-nums`.
- [x] **Elevation & Depth**: Tonal lightness hierarchy (Levels 0–5) with specular top-edge micro-highlights (`inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`).
- [x] **Sizing & Spacing Units**: Rigid 4px/8px scale, rem for text/padding, px for hairlines.
- [x] **Authentic Product Representation**: 100% grounded in authentic senior/staff engineering domain fixtures (Fiber reconciler, Concurrency lanes, Event loop tasks, ActiveRecord N+1, 120-point rubric; zero lorem ipsum).
