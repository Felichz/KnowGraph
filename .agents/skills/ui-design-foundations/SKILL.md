---
name: ui-design-foundations
description: Master foundation skill establishing visual brand language, algorithmic color palettes, modular-scale typography, elevation/depth, sizing units, and authentic visual representation. Generates and governs DESIGN.md.
---

# UI Design Foundations & Visual System Master Skill

> **Domain Scope**: Fuses 10 specialized visual design skills into an authoritative, multi-perspective Master Skill.

## Constituent Skills Index

- [brand-visual-language](#constituent-domain-brand-visual-language)
- [color-mode-and-theme](#constituent-domain-color-mode-and-theme)
- [algorithmic-color-palette](#constituent-domain-algorithmic-color-palette)
- [modular-scale-typography](#constituent-domain-modular-scale-typography)
- [elevation-and-depth](#constituent-domain-elevation-and-depth)
- [sizing-units](#constituent-domain-sizing-units)
- [authentic-product-representation](#constituent-domain-authentic-product-representation)
- [clone-website](#constituent-domain-clone-website)
- [generate-ui-from-brand](#constituent-domain-generate-ui-from-brand)
- [extract-design](#constituent-domain-extract-design)

---

## Constituent Domain: brand-visual-language

# Brand Visual Language

Visual shape communicates personality. A rounded corner says something different to the user than a sharp one — and that message arrives before they read a single word. The shapes in typography, border-radius, and iconography should tell a consistent story.

## Shape Language

| Shape | Tone | Associated with |
|---|---|---|
| **Rounded, pill-shaped** | Friendly, approachable, playful, modern | Consumer apps, health, kids, lifestyle, social |
| **Softly rounded (8–12px)** | Professional, warm, accessible | SaaS, productivity, general B2B |
| **Lightly rounded (2–4px)** | Precise, structured, efficient | Enterprise tools, finance, data platforms |
| **Sharp / no radius** | Technical, serious, authoritative | Developer tools, security, industrial |

Every component — cards, inputs, modals, badges — should follow the same radius logic.

## Radius for Large Surfaces

The perceived "roundedness" of an element changes with its scale. A radius that looks soft on a button may look sharp on a large container.

- **Large Cards & Modals:** Typically use a larger radius than buttons (e.g., if buttons are 4px, large cards might be 8px or 12px) to maintain a consistent visual tone.
- **Wells and Background Sections:** For large background areas or "wells," a smaller radius (2px–8px) is often used to provide structure and define the region without making it feel like a "floating" component. This keeps the focus on the content within, rather than the container itself.

## Reading Shape from an Existing Brand

Before choosing a radius, look at the brand's existing materials:

- **Logo:** Is it rounded, geometric, or angular? The logo's shapes are intentional brand decisions.
- **Product photography or illustration style:** Rounded, bubbly illustrations signal a different personality than sharp, technical diagrams.
- **Typography:** A geometric sans-serif (Circular, Futura) reads differently than a humanist sans (Inter, Söhne) or a sharp editorial serif.
- **Competitor landscape:** Sometimes being the slightly softer option in a sharp market, or the more structured option in a playful market, is the differentiator.

> **Read the real shape language, don't infer it (dembrandt engine, optional).** For a brand that already ships a product, extract its actual radius, type, and tone from the live site rather than guessing from the logo: `get_brand_identity` and `get_design_tokens` return computed values off the DOM. See [`extract-design`](../extract-design/SKILL.md).

## Typography and Shape

Typeface shapes carry the same tonal signals:

| Type style | Tone |
|---|---|
| Geometric sans (circular letterforms) | Modern, clean, slightly playful |
| Humanist sans (varied stroke widths) | Warm, readable, professional |
| Grotesque sans (neutral, utilitarian) | Serious, efficient, no-frills |
| Serif | Authoritative, established, editorial |
| Rounded sans | Friendly, approachable, informal |
| Monospace | Technical, developer-facing, precise |

The typeface and the border-radius should not contradict each other. A rounded, friendly typeface paired with sharp 0px corners creates visual dissonance.

## Extending Brand Typography

Brand books often specify a display or heading font but leave body text underdefined — a single weight, no reading size, no fallback. This is common with luxury, fashion, or legacy brands where the brand identity was built for print, not screen.

When the brand book is insufficient for UI purposes, extend it deliberately:

**When extension is justified:**
- Brand font has poor legibility at small sizes (display fonts, decorative typefaces)
- Brand font lacks the weights needed for UI hierarchy (no regular, no medium)
- Brand font has no body or reading variant defined
- Brand font loads poorly (performance, licensing, web rendering)

**How to extend:**
- Keep the brand font for headings and display — this is where brand identity lives
- Add a secondary typeface for body text that is **complementary in tone**, not competing
- Match shape language: a geometric brand font pairs with a geometric body font; a humanist display pairs with a humanist body

```
Brand heading font (display, h1–h3): maintains identity
↓
Secondary body font (body, labels, UI copy): legibility and completeness
```

**Pairing principles:**
- Contrast in role, not in personality — the two fonts should feel like they belong to the same product
- Avoid two display fonts or two highly characterful fonts together
- A neutral, high-quality sans (Inter, DM Sans, Söhne) pairs safely with most brand fonts
- If the brand font is a serif, a clean sans body is the natural complement — and vice versa

**Do this sparingly.** Two typefaces is a deliberate extension. Three typefaces is almost always too many. Document the decision and the rationale so future designers do not add a third.

## Iconography

Icon style must match the brand's shape language. Mixing icon styles — some thin, some bold, some filled, some outlined — breaks visual cohesion even when individual icons are correct.

| Icon style | Tone | Use when |
|---|---|---|
| **Thin / outline (1–1.5px stroke)** | Minimal, elegant, refined | Luxury, editorial, premium SaaS |
| **Regular outline (2px stroke)** | Balanced, professional | General SaaS, productivity tools |
| **Bold / thick (2.5–3px stroke)** | Strong, clear, accessible | Consumer apps, mobile-first, accessibility focus |
| **Filled** | Solid, confident, clear at small sizes | Dashboard indicators, status icons, mobile nav |
| **Rounded corners on icon paths** | Friendly, approachable | Consumer, lifestyle, health |
| **Sharp corners on icon paths** | Technical, precise | Developer tools, finance, data |

**Rule:** Use one icon library and one weight throughout. If mixing is unavoidable (e.g. a specialised icon not available in the chosen library), match stroke width and corner style manually.

### Use the standard icon; never invent one for a solved concept
Gear = settings, person = profile, magnifier = search, house = home, trash = delete, bell = notifications. Inventing an alternative here costs decoding for zero benefit. Search "icon [concept]" to check the convention before committing. Save design freedom for concepts with no established icon.

Icons let the eye skip the word — but only unambiguous ones, and only where scanning pays off (nav, status, row types). A vague or decorative icon adds work instead of saving it; an icon on every label is noise. Right icon, relevant place. See [[ui-density]] on reading as time.

## Consistency Across Elements

All shape-bearing elements should follow the same visual logic:

| Element | Applies shape language via |
|---|---|
| Buttons | `--radius-button` |
| Cards | `--radius-card` (same or slightly larger than button) |
| Inputs | `--radius-input` (typically same as button) |
| Badges / tags | Can be more rounded than buttons — pill shape is common |
| Modals / drawers | `--radius-modal` (often larger, 12–16px) |
| Avatars | Always fully round (`--radius-full`) |
| Icons | Stroke weight and corner style match brand |
| Illustrations | Shape style consistent with icon style |

## Applying a Brand to Software You Cannot Rewrite

Most brand work does not land on a clean codebase. It lands on an estate that includes a portal built in 2015 with whatever framework was current and an internal system old enough to vote — and those are the tools employees stare at all day, so the brand experience is at stake there too.

Two things make this tractable. First, **the shape language is the last thing to arrive, not the first.** A legacy application can carry the brand convincingly with nothing but the right logo, the brand hue, and the typeface; matching radius and icon style is rung 3 work and usually never worth it there. Second, **decide per application how far up the ladder it goes** — identity, chrome, tokens, components — rather than treating anything short of a rewrite as failure. The ladder and the per-application decision live in [[layout-paradigms-and-consistency]].

Where an old application does have variables — a Bootstrap or Sass build usually does — mapping brand colour and typeface onto them buys most of the perceived coherence for a fraction of the work. What you are buying is recognition, not fidelity: the user should know whose software this is within a second of it loading.

## Review Checklist

- [ ] Does the border-radius token match the brand's shape language (logo, illustrations, photography)?
- [ ] Is the same radius logic applied to buttons, inputs, and cards?
- [ ] Does the typeface tone match the overall brand personality?
- [ ] Is a single icon library used consistently throughout?
- [ ] Do icons match the brand in stroke weight (thin for refined, bold for accessible)?
- [ ] Are rounded icon corners used for friendly brands and sharp corners for technical brands?
- [ ] Are standard concepts (settings, profile, search, delete, notifications) using the conventional icon rather than an invented one?
- [ ] Are icons used only where recognition pays off — not sprinkled on every label as decoration?
- [ ] Is the border-radius adjusted for surface size (e.g., larger for modals, tighter 2-8px for wells/backgrounds)?
- [ ] Is there no visual contradiction between typeface style and shape choices (e.g. rounded type + sharp cards)?

---

## Constituent Domain: color-mode-and-theme

# Color Mode and Theme

## The Decision: Light, Dark, or Both

Color mode is a brand and context decision, not a personal preference. Make it deliberately.

### Light (white design)
**Tone:** Open, trustworthy, content-forward, accessible, professional  
**Fits:** Marketing sites, e-commerce, editorial, SaaS with mixed audiences, consumer products, B2B tools where the content is the focus

Light mode is the safer default for most products. It performs better in bright environments and has broader accessibility coverage out of the box.

### Dark (dark design)
**Tone:** Premium, focused, immersive, technical, high-contrast data  
**Fits:** Trading platforms, developer tools, creative tools (video/audio editors), data dashboards with dense visualisations, entertainment, gaming

Dark mode reduces eye strain during extended use in low-light environments. It also makes colourful data visualisations (charts, heatmaps) pop more clearly against a dark surface.

**Caution:** Dark mode is harder to get right. Low-contrast text, over-saturated brand colours, and insufficient surface differentiation are common failures. If the team cannot maintain it properly, light mode is better than a broken dark mode.

### Combined (system-default + manual override)
Respect `prefers-color-scheme` and let the OS set the default. Offer a toggle for users who want to override. This is the modern standard for most products with a returning user base.

```css
@media (prefers-color-scheme: dark) {
  :root { /* dark tokens */ }
}
@media (prefers-color-scheme: light) {
  :root { /* light tokens */ }
}
[data-theme="dark"] { /* manual override */ }
[data-theme="light"] { /* manual override */ }
```

---

## When to Build a Theme Selector in the UI

A theme selector is a UI control — it takes space and adds complexity. Only build it when user control genuinely matters.

| Situation | Theme selector? |
|---|---|
| Marketing site, landing page | No — pick one mode, commit to it |
| Consumer SaaS, general audience | Combined (system-default + toggle) |
| Developer tool, technical product | Yes — developers expect it |
| Trading platform, financial dashboard | Yes — extended use, low-light sessions common |
| B2B enterprise tool (ERP, analytics) | Yes — power users, long sessions, personal preference varies |
| E-commerce storefront | Usually no — light default, possibly system-default |
| Creative tool (design, video, audio) | Yes — dark is often preferred, toggle still expected |

**Rule:** if the user will spend hours per day in the tool, give them control. If it's a transactional or occasional-use product, pick the mode that fits the brand and move on.

Place the theme toggle in the header (top-right, near account) or in user settings — not in primary navigation.

---

## Brand Tone and Color Mode

The brand's existing visual identity should inform the default mode.

| Brand tone | Default mode |
|---|---|
| Clean, minimal, trustworthy, open | Light |
| Premium, exclusive, bold, immersive | Dark |
| Technical, data-heavy, precise | Dark |
| Playful, colourful, energetic | Light (dark mode harder to maintain with vivid brand colours) |
| Neutral, enterprise, functional | Light, with system-default toggle |

If the brand uses a very dark primary colour (navy, deep green, near-black), a dark mode surfaces it naturally. If the brand is built around a bright, vivid primary, light mode lets it breathe.

---

## Dark Mode Token Principles

**A theme switcher is a second palette, not a toggle.** Every semantic colour needs a verified value in each mode — not one value flipped by an algorithm. Contrast that passes on light routinely fails on dark; saturation and elevation read differently. Real cost, and a reason not to build one unless it earns its place (see above).

Dark mode is not just inverting colours. Common mistakes:

- **Do not use pure black (#000000) as the base surface** — use a very dark neutral (#0A0A0F, #111827) for depth
- **Surface hierarchy in dark mode uses lightness, not shadows** — base, +1, +2 surfaces get progressively lighter, not more shadowed
- **Reduce brand colour saturation slightly** — vivid colours on dark backgrounds can be visually aggressive; a 10–15% desaturation keeps them readable
- **Increase font weight for reversed text** — light text on a dark background often appears "thinner" than the same weight in light mode. Increase the weight by one step (e.g., from Regular to Medium, or Medium to Semibold) to maintain legibility.
- **Text contrast needs active verification** — light text on dark surfaces is not automatically WCAG-compliant; check all combinations

```css
/* Dark mode surface scale */
--color-surface:         #0A0A0F;  /* base */
--color-surface-raised:  #141419;  /* cards */
--color-surface-overlay: #1E1E26;  /* modals, popovers */
--color-border:          rgba(255,255,255,0.08);
--color-text:            #F0F0F5;
--color-text-secondary:  #8A8F98;
```

---

## Review Checklist

- [ ] Is the color mode choice deliberate and based on brand tone and use context?
- [ ] If combined mode: does `prefers-color-scheme` set the default?
- [ ] If a theme selector is built: is it placed in a low-profile but accessible location?
- [ ] In dark mode: are surfaces differentiated by lightness steps, not just shadows?
- [ ] In dark mode: is brand colour slightly desaturated to avoid visual aggression?
- [ ] Are all text/background contrast ratios verified in both modes (WCAG 2.2 AA)?
- [ ] Is font weight increased by one step for reversed text (light-on-dark) to maintain optical legibility?
- [ ] Is pure black (#000000) avoided as a dark mode base surface?

---

## Constituent Domain: algorithmic-color-palette

# Algorithmic Colour Palette

A brand palette of 2–3 colours is not enough for a UI. You need shades for states (hover, active, disabled), neutrals for backgrounds and borders, and semantic colours for status. Deriving these algorithmically from the brand colours produces a palette that feels coherent — everything is visually related to the brand rather than pulled from a generic grey or a stock colour library.

> **Don't guess the seed colours — extract them (dembrandt engine, optional).** If the brand already exists on the web, pull its *real* palette off the live site instead of eyeballing a hex: `get_color_palette` (or the `extract-design` skill) returns the actual computed brand and neutral colours from the DOM, which you then expand with the methods below. See [`extract-design`](../extract-design/SKILL.md) for setup.

## Deriving Interactive State Colours

From each brand colour, generate at minimum three variants: base, darker (hover/active), lighter (tint/background).

### Method: HSL adjustment

```
base:    hsl(H, S%, L%)
hover:   hsl(H, S%, L% - 8%)     ← darken by reducing lightness
active:  hsl(H, S%, L% - 14%)    ← darken further
tint:    hsl(H, S%, L% + 40%)    ← lighten significantly for backgrounds
subtle:  hsl(H, S% * 0.3, L% + 45%)  ← heavily desaturated, near-white
```

### Example: brand primary `#133174` (hsl 224, 70%, 27%)

```css
--color-primary-subtle:  hsl(224, 21%, 94%);  /* background tint */
--color-primary-tint:    hsl(224, 70%, 67%);  /* light variant */
--color-primary:         hsl(224, 70%, 27%);  /* base */
--color-primary-hover:   hsl(224, 70%, 19%);  /* hover: -8% lightness */
--color-primary-active:  hsl(224, 70%, 13%);  /* active: -14% lightness */
```

### Example: success green derived from a teal brand colour

If the brand has a green or teal, shift it toward a clearer success green:

```css
--color-success-subtle:  hsl(142, 20%, 94%);
--color-success:         hsl(142, 60%, 35%);
--color-success-hover:   hsl(142, 60%, 27%);
```

## Deriving Brand-Tinted Greys

Generic greys (`#666`, `#999`, `#eee`) feel disconnected from the brand. Desaturating the brand hue produces greys that are subtly tinted — warm, cool, or neutral depending on the brand — and feel like they belong to the same palette.

### Optical Comfort: Avoiding Pure Black on White
Extreme contrast (pure black `#000000` on pure white `#FFFFFF`) can cause "halation" and eye strain. To create a more comfortable reading experience:
- **Use "Near-Black" for text:** Use a very dark grey (e.g., `#222222` or your `grey-900` token) instead of pure black.
- **Use "Off-White" for backgrounds:** A slightly muted white (e.g., `#EEEEEE` or your `grey-50` token) is softer on the eyes than pure `#FFFFFF`.

This "softened contrast" remains highly accessible (passing WCAG AA/AAA) but feels more professional and less harsh.

### Method: desaturate + adjust lightness

```
brand hue H
grey-900: hsl(H, 12%, 10%)   ← near-black, text
grey-700: hsl(H, 10%, 30%)   ← dark text, icons
grey-500: hsl(H,  8%, 50%)   ← secondary text, placeholders
grey-300: hsl(H,  6%, 70%)   ← disabled text, subtle labels
grey-200: hsl(H,  5%, 82%)   ← borders, dividers
grey-100: hsl(H,  4%, 92%)   ← input backgrounds, table stripes
grey-50:  hsl(H,  3%, 96%)   ← page background, subtle fills
```

### Example: brand primary `#133174` (H = 224, blue-tinted)

```css
--color-grey-900: hsl(224, 12%, 10%);  /* #16171f — slightly blue-black */
--color-grey-500: hsl(224,  8%, 50%);  /* #7b7e8a — cool grey */
--color-grey-200: hsl(224,  5%, 82%);  /* #cfd0d5 — cool light border */
--color-grey-50:  hsl(224,  3%, 96%);  /* #f4f4f6 — near-white with a hint of blue */
```

Compare to generic `#f5f5f5` (no hue) — the brand-tinted version is subtly different but feels intentional.

## Semantic Colour Derivation

Status colours (error, warning, success, info) should feel harmonious with the brand. To achieve cohesion, align their **Saturation** and **Lightness** to create a consistent "visual weight" across the status set.

### Method: Aligned visual weight

1. **Pick the Hues:** Use standard semantic hues (0 for Error, 38 for Warning, 142 for Success).
2. **Align S & L:** Use the saturation and lightness of your Brand Primary as a starting point.
3. **Adjust for Perceived Brightness:** Hues like Yellow/Orange (Warning) feel brighter than Blue/Red. Reduce the lightness of Warning by 5–10% compared to Success or Error to ensure they feel equally "heavy" on the page.

| Semantic | Hue (H) | Saturation (S) | Lightness (L) |
|---|---|---|---|
| **Error** | 0–10 | Match Primary | Match Primary |
| **Warning** | 35–45 | Match Primary | Primary L - 10% |
| **Success** | 140–160 | Match Primary | Match Primary |
| **Info** | 210–230 | Match Primary | Match Primary |

**The "Vibrancy" Rule:** If the brand is muted (low saturation), the semantic colours should also be slightly muted. If the brand is neon/vibrant, the semantics should follow suit. Cohesion comes from shared intensity.

## Functional and Interactive Colours

Standard UI elements require dedicated functional tokens beyond basic brand and semantic colours.

### Focus States
Focus indicators are critical for accessibility. Use a high-visibility colour that works on all backgrounds.
- **Default:** Brand Primary (if contrast is high enough).
- **Fallback:** A dedicated high-contrast blue `hsl(215, 95%, 50%)`.
- **Token:** `--color-focus`.

### Selection and Highlights
Text selection and list item highlights should be subtle and non-distracting.
- **Method:** Use the primary hue with very high lightness (90%+) and moderate saturation.
- **Token:** `--color-selection`.

### Overlays and Modals
Backdrops for modals or drawers need a neutral, semi-transparent colour.
- **Method:** Use your `grey-900` hue with an alpha channel.
- **Token:** `--color-overlay: hsla(H, 12%, 10%, 0.5);`

### Skeleton and Loading
Loading states should be neutral and recessive.
- **Method:** Use `grey-200` as the base and `grey-100` as the shimmer highlight.
- **Token:** `--color-skeleton`.

### Disabled States
Disabled elements must communicate unreachability.
- **Method:** Use `grey-500` for text and `grey-200` for backgrounds/borders.
- **Rule:** Avoid using brand tints for disabled backgrounds to prevent "pseudo-active" confusion.

### Brand-Tinted Shadows
Premium UIs avoid pure black shadows. Use a very dark, desaturated brand hue.
- **Method:** `hsla(H, 15%, 5%, alpha)` where H is the brand hue.
- **Token:** `--color-shadow-base`.

### Links
- **Base:** Brand Primary or a dedicated high-visibility blue.
- **Visited:** Shift primary hue toward purple (+20) and reduce saturation.
- **Token:** `--color-link`, `--color-link-visited`.

### Input and Validation
- **Method:** Use semantic base colours for borders and text in error/success states.
- **Inactive Border:** `grey-200`.
- **Active/Focus Border:** Brand Primary.

## Full Token Output Example

```css
:root {
  /* Primary — derived from brand #133174 */
  --color-primary-subtle:  hsl(224, 21%, 94%);
  --color-primary-tint:    hsl(224, 70%, 67%);
  --color-primary:         hsl(224, 70%, 27%);
  --color-primary-hover:   hsl(224, 70%, 19%);
  --color-primary-active:  hsl(224, 70%, 13%);

  /* Brand-tinted neutrals */
  --color-grey-900: hsl(224, 12%, 10%);
  --color-grey-700: hsl(224, 10%, 30%);
  --color-grey-500: hsl(224,  8%, 50%);
  --color-grey-300: hsl(224,  6%, 70%);
  --color-grey-200: hsl(224,  5%, 82%);
  --color-grey-100: hsl(224,  4%, 92%);
  --color-grey-50:  hsl(224,  3%, 96%);

  /* Semantic */
  --color-error:   hsl(4,  72%, 44%);
  --color-warning: hsl(38, 80%, 44%);
  --color-success: hsl(142, 58%, 35%);
  --color-info:    hsl(224, 70%, 27%); /* = primary */

  /* Semantic subtle backgrounds */
  --color-error-subtle:   hsl(4,  50%, 95%);
  --color-warning-subtle: hsl(38, 60%, 95%);
  --color-success-subtle: hsl(142, 40%, 95%);

  /* Functional */
  --color-focus:     var(--color-primary);
  --color-selection: hsl(224, 70%, 90%);
  --color-overlay:   hsla(224, 12%, 10%, 0.5);
  --color-skeleton:  var(--color-grey-200);
  --color-shadow:    hsla(224, 15%, 5%, 0.1);

  /* Links */
  --color-link:         var(--color-primary);
  --color-link-visited: hsl(244, 40%, 35%);
}
```

## Review Checklist

- [ ] Are hover and active colours derived from the base by lightness adjustment, not chosen independently?
- [ ] Are neutral greys tinted with the brand hue rather than using generic `#666` / `#eee`?
- [ ] Is saturation reduced progressively as lightness increases in the grey scale?
- [ ] Is pure black (#000000) on pure white (#FFFFFF) avoided in favor of near-blacks (e.g., #222) and off-whites (e.g., #EEE)?
- [ ] Are status colours (Success, Warning, Error) visually weighted to match the brand primary?
- [ ] If the brand primary is orange or amber, is warning colour clearly distinct from it?
- [ ] Does each brand colour have at minimum: subtle, base, hover, active variants?
- [ ] Are semantic colours aligned in Saturation and Lightness to create a cohesive visual weight?
- [ ] Is there a dedicated `--color-focus` token that meets accessibility contrast requirements?
- [ ] Are selection, overlay, and shadow colours derived from the brand hue rather than generic black/grey?
- [ ] Are disabled states neutral (greys) to avoid confusion with interactive brand colours?
- [ ] Does the link colour have a distinct `visited` state derived algorithmically?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| **Pure black on pure white** | High visual strain, "halation" | Use near-black (#222) and off-white (#EEE) |
| **Grey borders next to colourful areas** | Looks cheap and disconnected | Remove border or use a tinted/darker version of the adjacent colour |
| **Randomly picked "Warning/Error" colours** | Palette feels uncoordinated | Derive from brand HSL with visual weight alignment |
| **Generic grey palette (#666, #999)** | Lacks brand identity | Tint neutrals with a low-saturation version of the brand hue |

---

## Constituent Domain: modular-scale-typography

# Modular Scale Typography

Typography feels cohesive when all font sizes are related to each other through a single mathematical ratio. Without a scale, sizes get picked arbitrarily and the result feels visually noisy — headings that don't contrast enough, body text too close in size to captions, labels that blend into content.

## What Is a Modular Scale

A modular scale starts from a **base size** and multiplies or divides by a **ratio** to generate every size in the system.

```
size(n) = base × ratio^n
```

Every size is thus a deliberate step away from the base — not a guess.

## Choosing a Ratio

| Ratio | Name | Feel | Good for |
|---|---|---|---|
| 1.067 | Minor Second | Very tight | Dense data UIs, dashboards |
| 1.125 | Major Second | Subtle | Long-form reading, editorial |
| 1.200 | Minor Third | Balanced | Most UI applications |
| 1.250 | Major Third | Clear hierarchy | Marketing, landing pages |
| 1.333 | Perfect Fourth | Strong contrast | Display, hero sections |
| 1.414 | Augmented Fourth | Dramatic | Portfolios, branding |
| 1.500 | Perfect Fifth | Very dramatic | Use sparingly |

**Default recommendation:** `1.25` (Major Third) — enough contrast between steps to feel intentional without being theatrical.

## Generating a Scale

> **Recover an existing scale, don't reverse-engineer it by hand (dembrandt engine, optional).** If a brand already has type on the web, `get_typography` returns the real font sizes, weights, and line-heights computed off the live DOM — infer the underlying ratio from those, then regularise it with the method below, instead of guessing which sizes were intended. See [`extract-design`](../extract-design/SKILL.md).

Starting from `base = 16px`, ratio `1.25`:

| Step | Formula | Value | Rounded | Role |
|---|---|---|---|---|
| -2 | 16 ÷ 1.25² | 10.24px | 10px | Caption, label-xs |
| -1 | 16 ÷ 1.25 | 12.80px | 13px | Label, small |
| 0 | 16 | 16px | 16px | Body (base) |
| +1 | 16 × 1.25 | 20px | 20px | Body-lg, lead |
| +2 | 16 × 1.25² | 25px | 25px | H4 |
| +3 | 16 × 1.25³ | 31.25px | 31px | H3 |
| +4 | 16 × 1.25⁴ | 39.06px | 39px | H2 |
| +5 | 16 × 1.25⁵ | 48.83px | 49px | H1 |
| +6 | 16 × 1.25⁶ | 61.04px | 61px | Display |

Round to whole pixels or rem — the ratio provides the intent, exact pixel rounding is fine.

## Design Tokens (CSS custom properties)

```css
:root {
  --text-xs:   0.625rem;  /* 10px  — caption */
  --text-sm:   0.813rem;  /* 13px  — label   */
  --text-base: 1rem;      /* 16px  — body    */
  --text-lg:   1.25rem;   /* 20px  — lead    */
  --text-xl:   1.563rem;  /* 25px  — h4      */
  --text-2xl:  1.938rem;  /* 31px  — h3      */
  --text-3xl:  2.438rem;  /* 39px  — h2      */
  --text-4xl:  3.063rem;  /* 49px  — h1      */
  --text-5xl:  3.813rem;  /* 61px  — display */
}
```

## Tailwind Config

```js
// tailwind.config.js
fontSize: {
  'xs':   ['0.625rem', { lineHeight: '1rem' }],
  'sm':   ['0.813rem', { lineHeight: '1.25rem' }],
  'base': ['1rem',     { lineHeight: '1.5rem' }],
  'lg':   ['1.25rem',  { lineHeight: '1.75rem' }],
  'xl':   ['1.563rem', { lineHeight: '2rem' }],
  '2xl':  ['1.938rem', { lineHeight: '2.25rem' }],
  '3xl':  ['2.438rem', { lineHeight: '2.5rem' }],
  '4xl':  ['3.063rem', { lineHeight: '1.1' }],
  '5xl':  ['3.813rem', { lineHeight: '1' }],
}
```

## Why This Makes Typography Feel Cohesive

Without a scale, designers and developers pick sizes by eye or habit (`14px`, `16px`, `18px`, `24px`, `32px`, `48px`). These feel subtly wrong because the intervals are uneven — the jump from 14→16 is small, 32→48 is large, and there is no underlying logic tying them together. The eye senses the inconsistency even when the viewer cannot name it.

With a modular scale, every size step carries the same visual weight of change. Hierarchy reads clearly because each level is a proportional step away from the next, not an arbitrary gap.

## Minimum Font Size

**Body text base: 16px minimum.** This is the browser default for good reason — it is the threshold below which reading comfort drops significantly, especially on screens.

- **16px** — standard body text, the default base
- **14px** — acceptable for secondary UI text (labels, captions, metadata) used sparingly
- **Below 14px** — do not use. Even at high DPI, sub-14px text fails WCAG contrast requirements for normal text and creates accessibility issues.

In the modular scale, this means the base (`step 0`) should be 16px, and negative steps (step -1, step -2) should be used only for genuinely secondary content — never for body copy or primary labels.

**The 1% heuristic.** Sub-16px text is the rare exception (target: under ~1% of a page, never below 14px). Nobody counts characters, so apply it as a role test:

- **May go below 16px** — a fixed whitelist of glanced-at roles: timestamps, captions, table metadata, helper text, fine print, badge labels.
- **Never** — body copy, primary labels, list item titles, anything actually read to do the task.

Check: scan one screen, count distinct sub-16px roles. Two or three from the whitelist is healthy; five or more — or any reading content — means you've over-shrunk. That's layout density, not a type problem: cut what's shown rather than shrink the type to fit.

## Type Rendering Details

Size and ratio set the structure; these details determine whether the type actually reads well on screen.

### Letter Spacing
- **Body and default text:** keep tracking at `0`. Adding it to running text slows reading and makes the type feel loose.
- **Uppercase and small labels:** the one place tracking helps, since capitals are visually tight. Cap it at `0.04em`, and reach for that only when the label genuinely needs air.
- Pattern: **zero on lowercase body, at most a hair (`≤ 0.04em`) on uppercase labels** — never a blanket value. Over-tracking reads as dated, not premium.

### Weight on Dark Backgrounds
Light text on dark appears optically **thinner** — a halation effect where bright type bleeds into the dark field. Step up one weight to compensate: where regular (400) works on light, use **medium or semibold for the equivalent text on dark**. This keeps perceived weight consistent across modes instead of dark-mode text looking frail.

### Monospace
Monospace is for technical content where character alignment matters — code, IDs, numeric tables, diffs. **Don't use it as a default UI typeface, and avoid monospace + uppercase** (even widths plus tall capitals are hard to scan).

### Numbers That Change in Place
A counter, a countdown, a price that updates, a column of figures — proportional digits give each number a different width, so the text jitters sideways on every tick and columns fail to line up. Switch to tabular figures anywhere digits update or stack; leave body text proportional, where tabular digits look gappy.

```css
.stat, .price, td.numeric { font-variant-numeric: tabular-nums; }
```

### Where Lines Break
Headings are the place to control the break. `text-wrap: balance` evens the lines of a short heading and stops the one-word last line; `text-wrap: pretty` only prevents the orphan and is the cheaper choice for paragraphs. Balance is capped at a handful of lines by the browser, so it is a heading tool, not a body tool.

Set it once, in the stylesheet, for every element of that kind. A
`text-balance` utility sprinkled on one component holds for that component and
silently stops holding on the next page someone builds.

```css
h1, h2, h3, h4, h5, h6,
figcaption, blockquote, dt { text-wrap: balance; }

p, li, dd { text-wrap: pretty; }
```

Chrome and Safari implement both. Firefox ignores them and falls back to normal
wrapping, which is why neither is allowed to be load-bearing.

Never break a line by hand with `<br>` to fix a widow. It is correct at exactly
one viewport width and wrong at every other. Per-component wrapping is a
deliberate exception a designer asks for, not a default you reach for.

Bind a word to what follows it with a non-breaking space — `10&nbsp;kg`, `Figure&nbsp;3`, a name and its title. A unit stranded alone on the next line reads as a typo.

### Text That Does Not Fit Its Slot

`text-wrap: balance` fixes a heading that breaks awkwardly. It does not fix text
that is simply too long for the space it was put in, and reaching for it there
hides the real problem for one viewport width and returns at the next.

When a line orphans a word, or a caption wraps to three lines beside a title,
there are exactly three honest fixes:

1. **Shorten the text.** Usually the right one. A slot sized for a label was not
   asking for a sentence.
2. **Drop it a step on the scale.** Supporting text beside a title belongs a step
   or two below it, not at the same size.
3. **Change the parent layout.** When the text is already as short as it can say
   what it means, the container is the problem. Fewer grid columns at that
   breakpoint, a wider column, its own line, a different position. Six tiles
   across a 1280px viewport leaves each about 190px, and no rewording makes a
   number, a label and a caption fit that; three across at the same width does.

The order matters. Reach for the layout when the first two have run out, not
before: widening a container to rescue a sentence that should have been three
words moves the same problem to the next breakpoint.

What is not a fix: leaving it, or nudging the container until it happens to fit
the width you are looking at.

**A legend is not a sentence.** "Bar height is the total, the filled part is how
many completed" is thirteen words in a header sized for three. It wraps, and it
strands a word on the last line. Two swatches and one word each carry the same
meaning and cannot wrap badly:

```
■ completed   □ total
```

The same applies to axis labels, table headers, chip text, and any caption
sitting next to something larger. If the explanation genuinely needs a sentence,
it belongs under the element rather than beside it.

### Two Lines in One Slot

A label with an explanation under it is two jobs, and they have to look like two
jobs. Given the same size, weight and colour they merge into one block of grey
that reads as neither:

```html
<!-- wrong: identical styling, both clipped -->
<div class="w-36">
  <div class="text-sm font-medium text-gray-500 truncate">Imported</div>
  <div class="text-sm font-medium text-gray-500 truncate">rows without a matching account are skipped</div>
</div>
```

Separate them by weight and ink, not by size — this is the exception to
"different jobs step apart" above: both lines already sit near the 14px floor,
so dropping the second a step pushes it under the minimum, and two steps apart
is barely visible at these sizes anyway. Semibold primary over medium muted is
enough, and the muted colour needs a floor of its own: pair the palette's
faintest legible colour with the lightest weight (400) and it reads as
illegible even where it passes WCAG contrast on colour alone, because contrast
math is colour-only and ignores stroke weight. Give any muted/secondary text
token a minimum weight of 500 wherever it is used, not just here.

**Do not truncate an explanation.** A name survives clipping because a reader
recognises it from its first characters. A sentence does not: what is cut is the
part that carried the meaning, and moving it into a `title` attribute hides it
from touch, from keyboards, and from anyone who does not think to hover — this
is why the `title`-attribute escape hatch under Line Clamping below is scoped to
supporting descriptions the user does not need to act on, never to an
explanation that carries the meaning of what it is attached to. Truncate
identifiers. Let explanations wrap, shorten them, or give the column more room.

## Type Scale by Page Context

**Landing pages and marketing surfaces** benefit from large, expressive type — steps +4 to +6 for headlines create drama and brand presence.

**Feature pages and application UI** should use a more controlled range — steps +2 to +3 for headings, with body text at step 0. Oversized headings inside a functional UI distract from the content and make the layout feel unbalanced.

Match the ratio and scale usage to the purpose of the surface, not just the brand.

## Heading Hierarchy and Page Complexity

A successful heading scale uses more than just font size to distinguish levels. It also respects the cognitive limits of the page.

### Tools for Differentiation
If headings only differ by small increments of size, they become hard to distinguish at a glance. Use these tools to create a more meaningful scale:
- **Capitalization:** Use uppercase (`text-transform: uppercase`) for small, lower-level headings (H4–H5) to give them visual weight without needing large sizes.
- **Letter Spacing:** When using uppercase or bold headings, add at most a hair of `letter-spacing` (`≤ 0.04em`) — and only when the heading genuinely needs the air. Keep it subtle; over-tracking reads as dated, not premium.
- **Color:** Use your brand primary colour or a slightly muted grey for secondary headings to differentiate them from the main black/dark-grey text.
- **Style:** Use italics or subtle underlines for supplementary or metadata-style headings.

### The Rule of Three (H1–H3)
Most well-designed pages require only **three levels of heading hierarchy (H1, H2, H3)**. 
- **Simplicity:** H1–H3 is enough to cover the page title, section titles, and sub-sections.
- **H4–H6 is a complexity smell, not a typography problem.** If you find yourself reaching for H4, H5, or H6, the page is trying to do too much. Adding smaller heading levels only hides the symptom. Read it as a signal and make a *structural* decision instead:
  - **Split** — the page is really two features, or an in-page sub-page. Break it across pages or a modular structure (sidebar, tabs, master-detail).
  - **Remove** — the deep section may not earn its place at all.
  - **Simplify** — flatten the sub-hierarchy so it fits within H1–H3.
  - **Hide behind an opening/closing element** — push secondary content into a modal, accordion, or panel (see `information-architecture`).

A page that needs 6 levels of headings is a page that most users will stop reading.

## Reading Comfort and Editorial Patterns

Typography is not just about size — it is about the rhythm and structure of the content.

### Line Length (Measure)
For optimal reading comfort, keep body text between **45–75 characters per line** (approx. 500–700px).
- Lines that are too long make it hard for the eye to find the start of the next line.
- Lines that are too short break the reading rhythm and create distracting "rags."

### Measure, Leading and Size Move Together
Line length, line-height (leading) and font size are not three independent knobs — they are one system. This is a foundational typographic principle (Bringhurst's *The Elements of Typographic Style*) repeatedly validated on digital platforms, and it underpins the line-height ramps in the Material and Apple HIG type scales.

**The longer the measure, the more leading the eye needs** to track from the end of one line back to the start of the next. A tight line-height that reads fine on a narrow column becomes tiring on a wide one.

| Measure | Recommended body line-height |
|---|---|
| Narrow (~45ch) | 1.4 |
| Comfortable (55–66ch) | 1.5 |
| Wide (~75ch) | 1.6–1.7 |

Practical rules:
- **Body text:** line-height **1.4–1.7**, never below 1.4 for multi-line copy. WCAG SC 1.4.12 also requires text to stay readable when users override line-height to **at least 1.5**, so design with that headroom.
- **Headings:** large type needs *less* leading — tighten to **1.1–1.25** as size grows, or the lines drift apart and stop reading as one unit. Leading and size are inversely related.
- **Fix the cause, not the symptom:** if a line of body text feels hard to read, widen the leading *or* narrow the measure — don't just shrink the font. The three move together.

### Line Clamping
In grids, cards, or lists with unpredictable content lengths, clamp text to keep a consistent visual rhythm and equal-height cards. Limit descriptions to 2–3 lines so all cards in a row stay the same height.

**Multi-line clamp.** Pair the standard `line-clamp` with the `-webkit-` fallback — the legacy `-webkit-box` form is still required for full browser support, so keep both.
```css
.card-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
```

**Single-line clamp.** For titles and labels that must never wrap, use the ellipsis pattern instead.
```css
.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Inside flex or grid.** Truncation silently fails when the item can't shrink below its content width. Add `min-width: 0` (or `min-inline-size: 0`) to the clamped child so it is allowed to narrow.

**Accessibility — never lose the content.** Clamping hides text *visually only*; the full string stays in the DOM and is read in full by screen readers, but a sighted user can no longer see it. Always give them a path to the rest:
- Provide a `title` attribute (or accessible tooltip) carrying the full text, or
- Link to a detail view / "Read more" where the complete content lives.

This escape hatch is for supporting descriptions the user does not need to act
on. It does not extend to an explanation whose meaning is in the clipped part —
see "Do not truncate an explanation" above.

Never clamp text that the user *must* read to act (prices, errors, legal copy, primary instructions) — clamp only supporting descriptions where truncation is safe.

### Editorial Hierarchy
Use specific typographic roles to provide context and guide the user through the story:

| Role | Visual Treatment | Purpose |
|---|---|---|
| **Pre-title (Eyebrow)** | Small (12–13px), often all-caps, subtle letter-spacing (`≤ 0.04em`), muted colour | Provides context or category without distracting from the main heading |
| **Heading** | Large, bold, modular scale step +3 to +5 | The primary hook or subject |
| **Ingress (Lead text)** | Larger than body (step +1), slightly bolder or higher line-height | Summarises the core value; bridging the heading and the body copy |
| **Body** | Base size (16px), regular weight, comfortable line-height (1.5) | The primary reading experience |

### Wording and Voice
- **Use active voice.** "Get started" instead of "Getting started is easy."
- **Be punchy.** Use clear, descriptive labels that promise a result.
- **Consistency.** Use the same terms for the same actions throughout the product.

## Responsive Type Scale

The scale compresses on smaller viewports by **tightening the ratio**, not by manually overriding individual sizes. The floor (body, labels) stays stable — readability has a hard minimum. The ceiling (H1, display) shrinks significantly. Every heading level scales proportionally because the ratio changes; hierarchy stays internally coherent.

**Rule:** use a wider ratio on desktop (more drama), a tighter ratio on mobile (more restraint). The base stays the same. The top end gives way.

- Desktop → wider ratio (e.g. 1.25–1.333): large contrast between H1 and body
- Tablet → moderate ratio (e.g. 1.200): scale pulls in
- Mobile → tight ratio (e.g. 1.125): H1 is notably smaller, body is unchanged

Never shrink the scale from the bottom. Body text at 16px is already a floor — compression always comes from the top.

### Fluid Type with `clamp()`
Instead of stepping sizes at fixed breakpoints, let the top end scale smoothly between a floor and a ceiling using CSS `clamp(MIN, PREFERRED, MAX)`. The viewport-relative middle term does the scaling; the floor and ceiling stop it from ever getting too small or too large.
```css
:root {
  --text-body: 1rem;                         /* the floor stays fixed */
  --text-h1: clamp(2rem, 1.5rem + 3vw, 3.5rem);
}
```
- The `MIN` is the mobile size, the `MAX` is the desktop size — the same floor/ceiling thinking as the stepped scale, just interpolated.
- Apply `clamp()` to the **top of the scale** (headings, display). Keep body and labels at a fixed size — readability has a hard minimum, so the floor must not move.
- Include a `rem` term in the preferred value (e.g. `1.5rem + 3vw`, not `3vw` alone) so the text still responds to user zoom and root font-size — a pure `vw` value breaks zoom accessibility.

### Adjacent Fluid Steps Can Converge

If a design system fluidizes several small steps anyway (`text-fluid-xs`, `text-fluid-sm`, and so on) rather than keeping them fixed, two adjacent clamped sizes are not guaranteed to stay apart across the viewport range. Each `clamp()` interpolates on its own slope between its own floor and ceiling, so two steps with different `vw` coefficients can land close together — or land on the exact same computed value — at some width in between, even though they look correctly spaced at the narrowest and widest extremes. Checking only the two endpoints hides this: the gap that matters is the minimum gap across the whole range, not the gap at either end.

```css
/* Looks fine at 375px and 1440px. At ~860px both resolve to ~14.9px. */
--text-fluid-xs: clamp(0.75rem, 0.65rem + 0.4vw, 0.875rem);
--text-fluid-sm: clamp(0.8125rem, 0.7rem + 0.45vw, 0.9375rem);
```

- **Don't fluidize adjacent small steps at all.** This is the same "keep body and labels fixed" rule above, stated for the case it actually gets violated: a caption sitting directly beside body text, or two label-scale steps next to each other, should use fixed sizes precisely so their difference can't collapse. Reserve `clamp()` for the top of the scale, where one heading rarely sits pixel-adjacent to another size on the same line.
- **If a small step must stay fluid,** verify the gap across the range, not just at MIN and MAX: sample the pair's computed values at a handful of intermediate widths (or plot both `clamp()` expressions) and confirm neither crosses nor closes to within a couple of px anywhere in between, not only at the breakpoints you happened to check.
- **Prefer a shared coefficient.** Giving adjacent fluid steps proportionally related `vw` coefficients (e.g. derived from the same modular ratio) keeps their curves parallel instead of letting independently-chosen slopes cross.

## Review Checklist

- [ ] Are all font sizes derived from a single base + ratio?
- [ ] Is the base size 16px or larger?
- [ ] Is 14px used only for secondary/metadata text, never for body copy?
- [ ] Is nothing below 14px used anywhere in the UI?
- [ ] Counting distinct sub-16px text roles on a screen, are there only a few (≤3) and all from the secondary whitelist — never reading content?
- [ ] Is body letter-spacing 0, with uppercase-label tracking capped at `0.04em` and used only when air is needed?
- [ ] Does light-on-dark text use a slightly heavier cut to compensate for halation?
- [ ] Is monospace scoped to technical content, never used as a default or with uppercase?
- [ ] Is there at least 3–4 distinct steps between body text and the largest heading?
- [ ] Are adjacent steps (e.g. body vs. label) different enough to be distinguishable at a glance?
- [ ] Are font size tokens named by role (`--text-body`, `--text-h1`) or step (`--text-base`, `--text-2xl`), not by raw pixel value?
- [ ] Does the chosen ratio suit the UI density? (tight ratio for data-heavy UIs, wider ratio for marketing)
- [ ] Is body text line length between 45–75 characters?
- [ ] Does any supporting text beside a title wrap, or strand a word on its own line? Shorten it, step it down the scale, or give it room; never leave it.
- [ ] Are legends, axis labels and chip text written as labels rather than sentences?
- [ ] Where text still does not fit after shortening, has the column count at that breakpoint been reconsidered, rather than the text squeezed further?
- [ ] Where a label and its explanation stack in one slot, do they differ in weight and ink rather than being two identical grey lines?
- [ ] Is truncation used only on identifiers, never on an explanation whose meaning is in the part being cut?
- [ ] Does body line-height scale with the measure (≈1.4 narrow → ≈1.6+ wide), staying ≥1.4 and leaving 1.5 override headroom for WCAG 1.4.12?
- [ ] Is heading leading tightened (≈1.1–1.25) as size grows, so large type still reads as one unit?
- [ ] Is line-clamping used to keep grid/card layouts consistent?
- [ ] Does clamped text keep a path to the full content (`title`/tooltip or detail view), and is must-read content never clamped?
- [ ] If fluid type (`clamp()`) is used, is it applied only to the top of the scale, with a `rem`-based preferred term so zoom still works?
- [ ] If two adjacent steps are both fluid (e.g. `xs`/`sm`), do they stay visibly distinct across the whole viewport range, not just at the MIN/MAX extremes?
- [ ] Are editorial roles like pre-titles and lead text used to improve scannability?
- [ ] Are headings differentiated by more than just size (e.g., color, case, spacing)?
- [ ] Is the heading hierarchy limited to H1–H3 per view where possible?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Sizes like 14, 15, 16, 17px used side by side | Steps too small to read as distinct levels | Use at minimum a 1.125 ratio so each step is perceptible |
| Arbitrary sizes with no relationship (13, 18, 27, 36px) | No underlying logic — hierarchy feels accidental | Regenerate from a single base and ratio |
| Pixel values hard-coded in components instead of tokens | Scale changes require hunting through every file | Define once as CSS custom properties or design tokens |
| Same scale used for display headings and dense data tables | One ratio rarely serves both extremes well | Use a tighter ratio (1.125) for data, wider (1.25–1.333) for marketing contexts |
| Letter-spacing added to running body text | Loosens the type and slows reading | Keep body tracking at 0; add at most `0.04em` to uppercase labels when air is needed |
| Regular-weight white text on a dark background | Halation makes it look thin and frail | Step up one weight (medium/semibold) for light-on-dark text |
| Monospace as a default UI font, or monospace + uppercase | Hard to scan, reads as "unstyled" | Scope monospace to code/IDs/numeric data only |
| Adjacent small steps both set with independent `clamp()` values | Their curves can converge or cross mid-viewport, even when the MIN/MAX extremes look fine | Keep adjacent small/label steps at a fixed size; reserve `clamp()` for the top of the scale |

---

## Constituent Domain: elevation-and-depth

# Elevation and Depth

Elevation uses shadow and layering to communicate that an element sits above the base surface — giving UI a sense of physical depth. Combined with border-radius, it creates the tactile quality that makes cards graspable, modals clearly floating, and dropdowns feel like they've appeared on top of content.

## The Elevation Scale

Define a small set of elevation levels as tokens. Each level maps to a specific UI role.

| Level | Token | Shadow | Role |
|---|---|---|---|
| 0 | `--shadow-none` | none | Flat surface, inline elements |
| 1 | `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.06)` | Subtle card, table row hover |
| 2 | `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)` | Card, input focus ring area |
| 3 | `--shadow-md` | `0 4px 6px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)` | Dropdown, popover |
| 4 | `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)` | Modal, dialog, side drawer |
| 5 | `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)` | Command palette, full-screen overlay |

Keep shadows subtle. Dark, heavy shadows feel dated and visually aggressive. Light, diffuse shadows feel modern and material.

### The "Shadow + Border" Rule
A subtle shadow on a white surface can sometimes "wash out," making the edge of a card feel fuzzy or indistinct.
- **Rule:** For elevated white cards or sections, pair the shadow with a **1px border** that is slightly darker (1.5x to 2x) than the shadow's core tone (e.g., a medium grey like `#E2E8F0` or `grey-200`).
- **Effect:** The border defines the physical boundary of the card, while the shadow provides the depth. Together, they make the component "pop" with much higher clarity than using either alone.

### Hover Needs a Defined Edge
A card that shifts **background colour on hover** must have a defined edge — a border, shadow, or clear radius boundary. Without one, the shift has no shape and reads as a stray fill, not a highlighted card. **On a borderless, flat card, a background-change hover is forbidden** — use a border or a shadow (elevation) on hover instead.

### Subtle Gradients for Depth
Gradients can be used to bring "liveliness" to an interface and reinforce the sense of elevation.
- **The Lighting Metaphor:** A subtle linear gradient (top-to-bottom) that is slightly lighter at the top mimics natural overhead lighting. This makes a surface feel more physical and elevated than a flat fill.
- **The 5% Rule:** Keep the gradient extremely subtle. A change in lightness of only 2–5% between the top and bottom is usually enough. If the user can easily see where the gradient starts and ends, it is likely too heavy.
- **Usage:** Apply to primary buttons, hero cards, and header sections to improve visual hierarchy and brand personality.

## Pairing Elevation with Border-Radius

Border-radius and shadow work together to define the character of a surface. The combination signals the element's role and the product's visual tone.

| Surface | Shadow | Border-Radius | Tone |
|---|---|---|---|
| Inline chip / tag | none | `--radius-full` (pill) | Flat, lightweight |
| Card | `--shadow-sm` | `--radius-md` (8–12px) | Graspable, contained |
| Dropdown / popover | `--shadow-md` | `--radius-md` (8px) | Floating, contextual |
| Modal / dialog | `--shadow-lg` | `--radius-lg` (12–16px) | Prominent, focused |
| Toast / notification | `--shadow-md` | `--radius-md` | Ephemeral, above content |
| Button | none or `--shadow-xs` | **consistent across all buttons** — see below |

## Border-Radius Consistency Rule

**Button border-radius must not vary within a product.** All buttons — primary, secondary, destructive, ghost — use the same radius token. Varying radius between button types breaks visual consistency and implies a semantic difference that does not exist.

```css
/* Correct: one radius for all buttons */
.btn { border-radius: var(--radius-button); }

/* Wrong: different radii for different button variants */
.btn-primary { border-radius: 8px; }
.btn-secondary { border-radius: 4px; }  /* ← breaks consistency */
```

The button radius token is a brand decision — set it once, apply it everywhere.

## Text Shadow for Contrast and Separation

`text-shadow` can lift text off a background without changing colours — useful when contrast is marginal or text sits on a photograph, gradient, or complex background.

The effect must be imperceptible as a shadow. If the user notices the shadow, it is too strong.

```css
/* On images or complex backgrounds */
.hero-title {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

/* Very subtle separation from a near-matching background */
.label-on-tinted-surface {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

/* White text on light background — use a dark shadow, not white */
.inverted-text {
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.30);
}
```

**Rules:**
- Opacity: stay below `0.30` — above that it reads as a design choice rather than a refinement
- Blur: `2–4px` maximum — higher values make text feel dirty
- Offset: `0 1px` or `0 0` — directional offsets above 2px look like retro Web 2.0
- Never use `text-shadow` to compensate for a contrast failure — fix the colour first. Use it only when colours are already close to passing and a nudge is needed, or when text sits on unpredictable imagery

## Dark Mode Shadows

Shadows are less visible on dark backgrounds. On dark surfaces, compensate with:
- Slightly higher opacity on shadow values
- Adding a subtle border (`1px solid rgba(255,255,255,0.08)`) to define card edges
- Increasing the elevation level by one step for the same perceived depth

## Review Checklist

- [ ] Is there a defined elevation scale as design tokens (not one-off shadow values per component)?
- [ ] Does each elevated element use the correct level for its role (card ≠ modal)?
- [ ] Are shadows light and diffuse, avoiding heavy black (#000) defaults?
- [ ] For white cards on light backgrounds, is the shadow paired with a 1px border for better definition?
- [ ] Is border-radius consistent across all button variants?
- [ ] Do shadows feel subtle and diffuse rather than heavy and dark?
- [ ] On dark surfaces, are card/panel edges visible through border or adjusted shadow?
- [ ] Is elevation used to communicate layering — not just decoration?
- [ ] If gradients are used, are they subtle (2–5% lightness change) and used to reinforce the lighting/elevation metaphor?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Different border-radius on primary vs secondary buttons | Implies semantic difference that doesn't exist | Single `--radius-button` token for all buttons |
| Heavy `box-shadow: 0 8px 16px rgba(0,0,0,0.4)` | Feels dated and visually aggressive | Use low-opacity, multi-layer diffuse shadows |
| Shadow on every element regardless of role | Elevation loses meaning when everything is elevated | Reserve shadow for genuinely floating elements |
| Flat cards with no elevation on a white background | Card edge disappears into the page | Use `--shadow-sm` or a `1px` border to define the card boundary |

---

## Constituent Domain: sizing-units

# Sizing Units

## The Question the Unit Answers

A unit is not a formatting preference. It is a declaration of what happens to a value when the user enlarges text.

- `rem` — this value belongs to the text and must grow with it.
- `px` — this value belongs to the screen and must stay put.
- `%`, `fr`, `ch`, `clamp()`, `min()` — this value belongs to the available space.

Pick the unit by answering that question, not by picking a house style and applying it everywhere. Both absolutist positions — all-rem and all-px — produce defects, and they are different defects.

## Zoom Is Not the Font-Size Setting

The common argument for px everywhere is that browsers already have full-page zoom, so the root font size can be ignored. They are separate controls serving separate people.

- **Full-page zoom** magnifies everything, layout included. It buys larger text at the cost of horizontal scrolling and fewer items per screen.
- **The browser's default font size** enlarges text and leaves the layout alone. This is what a user with low vision sets once, years ago, and never touches again. They will not switch to zoom because your product ignored it.

A product that hard-codes every dimension in px answers the first user and silently refuses the second. WCAG 2.2 SC 1.4.4 (Resize Text) requires text to reach 200% without loss of content or function, and SC 1.4.10 (Reflow) requires the page to survive it in a single column. See [[wcag-accessibility]].

## Use rem For

**Typography.** Every font size and line height. See [[modular-scale-typography]].

**Padding around text.** A button's inner padding in px means large text presses against its edges. In rem the breathing room scales with the words it surrounds.

**Control heights.** A 40px control holding 24px text is broken. Write the height token in rem and it stays a control-shaped control at every text size. See [[component-family-consistency]].

**Measure.** `max-width` on a text column: `65ch` or a rem value, never px.

**Gaps between text-bearing blocks.** Stack spacing in a form or an article is part of the reading rhythm.

## Use px For

**Hairlines and borders.** `1px` is one device pixel by intent. In rem it becomes `1.25px` at a larger root size and renders as a blurry smear.

**Shadow offsets and blur.** Elevation is a screen-space effect. See [[elevation-and-depth]].

**Small icons inside controls** where the icon is a fixed glyph rather than text.

**Sub-pixel corrections** — the `-1px` that makes two borders overlap instead of doubling.

## Use Relative Units For

Layout widths and gaps. This is where the "lock it in px so it stays stable" instinct goes wrong: a px-locked container is not stable, it is brittle. The text inside it still grows, and a fixed box is exactly what makes growing text clip.

```css
/* Brittle — the box cannot absorb anything */
.card   { width: 320px; height: 180px; }
.sidebar { width: 280px; }

/* Resilient */
.card    { max-width: 20rem; min-height: 11.25rem; }
.sidebar { width: clamp(16rem, 22%, 22rem); }
```

**`min-height`, never `height`,** on anything containing text. A fixed height cannot grow; a minimum height holds the shape at rest and yields when it must.

## Media Queries

Use `em` in media queries. Media-query `rem` and `em` both resolve against the browser's default font size, ignoring any `html { font-size }` you set — so `em` is the honest spelling, and both respect the user's preference where a px breakpoint does not. A user with a large default font size gets the layout their effective text size warrants, not the one their device width claims.

```css
@media (min-width: 48em) { /* ~768px at default settings */ }
```

## Do Not Reset the Root

```css
html { font-size: 62.5%; } /* Do not do this */
```

The 62.5% trick exists to make rem arithmetic easy — `1.6rem` for 16px. It buys you mental arithmetic and pays for it by overriding the user's stated preference by default. Keep the root at the browser default and let the tooling do the division.

## Review Checklist

- [ ] Is every font size, line height, and text-adjacent padding in rem?
- [ ] Are borders, hairlines, and shadow offsets in px?
- [ ] Does any element containing text use `height` rather than `min-height`?
- [ ] Are container widths relative (`%`, `fr`, `clamp()`, `max-width`) rather than fixed px?
- [ ] Are media-query breakpoints in `em`?
- [ ] Is `html { font-size }` left at the browser default?
- [ ] At a 200% browser font-size setting, does every control still contain its label, with no clipping and no horizontal page scroll?

---

## Constituent Domain: authentic-product-representation

# Authentic Product Representation

The fastest way to lose a visitor's trust is a product visual that is obviously staged. People have seen thousands of landing pages; they recognise a fabricated dashboard, a screenshot full of lorem ipsum, or a "terminal" that prints things the real tool never would. The visual that converts is the one that looks like it was screenshotted straight out of the working product — because it was, or because it was built to be indistinguishable from it.

The principle is simple: **the visual is the product, not a poster of it.** Every shortcut away from that — invented data, decorative chrome, a capability shown that does not exist — is a small withdrawal from the trust account.

This skill governs whether a visual is *credible*; what it has to accomplish in the page's argument comes from the product narrative framework in [[layout-paradigms-and-consistency]]. A fabricated proof point proves nothing.

---

## Design With Real Content

Idealised placeholder content hides the problems your design will actually face.

- **No lorem ipsum.** Use real copy, or the closest draft of it. Real words have real lengths, real line-wraps, real awkward edge cases. Latin filler is uniformly tidy in a way your content never will be.
- **Real names, real numbers, real lengths.** "John Smith / $1,234" is a fantasy dataset. Use the longest realistic name, the account with 0 items, the title that wraps to three lines. If the design only looks good with perfect data, it is not finished.
- **Design the empty, loading, error, and overflow states too** — they are the product as much as the happy path. A screenshot that only ever shows the full, perfect state is selling a product that does not exist.

If you genuinely cannot use production data, generate the mock **from the real schema and the real renderer**, so its shape, formatting, and constraints match what ships.

---

## Mirror the Real Output

When a visual stands in for what the product produces — a CLI run, a generated file, a report, a chart, an editor — reproduce the **actual format**, not a prettier reinterpretation.

- Use the product's real output structure: the same labels, the same ordering, the same tree/log/table shape, the same truncation rules ("+4 more").
- Pull the values from a real run where possible. If the visual claims to process `yourdomain.com`, show what processing `yourdomain.com` actually yields — not another site's values relabelled.
- Reuse the real rendering component if one exists. A faithful embed beats a hand-built lookalike that drifts from reality the moment the product changes.
- Breadth is more convincing shown than claimed. Listing the real categories the tool already covers ("also: borders, shadows, motion, components") communicates scope truthfully; a "coming soon" teaser for things that already exist communicates the opposite.

A reinterpreted mock is a maintenance liability and a credibility risk: it looks like the product until someone compares it to the product.

---

## Keep It Truthful

The visual makes claims. Every one must hold.

- **Numbers reflect reality.** Stats, counts, and metrics are real or clearly illustrative — never inflated fiction presented as fact.
- **Labels match content.** Do not relabel one thing as another (a screenshot of system A captioned as system B; a domain in the command that does not match the results shown).
- **Show only real capabilities.** A demo that performs a feature the product does not have is a promise you will break on first use.
- **"Soon" means soon, and rarely earns its place.** A pending/soon badge on something that already ships is a lie; a pending badge on a real roadmap item is usually just noise in a product shot. Prefer showing what works.

---

## Refuse Fabricated Marketing Chrome

A recognisable visual dialect signals "generated to look impressive" rather than "screenshotted from a real product." It reads as AI-slop and erodes the authenticity you are trying to build.

Avoid:
- Invented dashboards, fake charts, and decorative "terminals" that print marketing copy
- Gradient-filled text, sparkle/star accents, aurora glows, and glassmorphism used as a substitute for substance
- Typewriter/rotator headlines and faux-AI chrome (scanning lines, "thinking" shimmers) with no real function
- Pill badges and ornaments that exist only to fill space, especially in places where they clash with the medium (e.g. a label chip dropped into monospace output)

The restraint test: if an element does not exist in the real product, it does not belong in a visual that represents the real product. Decoration that carries no information is the first thing to cut.

---

## When You Must Stage

Sometimes a literal screenshot is impossible (pre-launch, sensitive data, a composite view). Stage honestly:

- Build from the real schema, the real component, and realistic values.
- Match the product's real states and formatting, including the unglamorous ones.
- Keep claims conservative — under-promise in the visual, let the product over-deliver.
- Label clearly illustrative figures as such rather than passing them off as measured.

---

## Review Checklist

- [ ] Is there any lorem ipsum or obviously idealised placeholder content left? (There should be none.)
- [ ] Does the content use realistic lengths — the long name, the empty list, the three-line title?
- [ ] Are the empty, loading, error, and overflow states represented, not just the perfect state?
- [ ] When the visual stands in for product output, does it match the real format, ordering, and truncation?
- [ ] Do the values correspond to the input shown (right domain, right source), not another case relabelled?
- [ ] Is the real rendering component reused where one exists, instead of a hand-built lookalike?
- [ ] Are all numbers, labels, and capabilities truthful — nothing inflated, mislabelled, or not-yet-real?
- [ ] Is there any "coming soon" framing on things that already ship?
- [ ] Is there fabricated marketing chrome (fake dashboards, gradient text, sparkles, decorative terminals) that should be cut?
- [ ] Could a visitor screenshot the real product and get the same impression this visual gives? If not, why not?

---

## Constituent Domain: clone-website

# Clone a Website, Accurately

One-click cloners return a lookalike: it resembles the page, and nothing in the
process ever checked whether it matches it. This skill produces a different
artifact — values traceable to the source, and a diff that says what is still
wrong.

**The one rule: if the page states a value, read it. If it does not, and only
then, decide it.** A rebuild done that way is finished when the diff is empty,
which you can check, rather than when it looks about right, which nobody can.

Only the rebuild step cares whether the target is Figma, Penpot or a codebase.
Everything else is the same job.

## Decide before you capture

- **Two widths are the design target**, 390 mobile and 1440 desktop. Real
  devices open the same page at other ratios, so these are what you design to,
  not what you will see.
- A site that follows the light and dark preference renders **two different
  pages**. Capture both, or say which one you copied.
- The IP, locale, consent state and A/B branch reach the site before you do, so
  **what you capture is one visitor's view**, not the page. Check from a second
  location before trusting prices or copy.

## 1. Capture the rendered page

Drive a real browser and take four things at once: full-page screenshots at
both widths, the rendered DOM, the computed styles of each section, and the
asset URLs the page requested. On a client-rendered page this is the only
capture that contains anything at all.

Rendered state is the specification, not the file the server sent.

## 2. Take the raw source as well

Markup carries text verbatim and names every asset URL without a screenshot in
the loop.

```bash
wget -r -l 3 -k -p -E -nc https://example.com/page
```

Host-spanning is left out on purpose: CDN assets stay unfetched, their URLs are
in the markup, and they get downloaded directly at step 4. `wget` does not run
JavaScript, which is why it is the second capture and not the first.

## 3. Measure the design values

Read the tokens off the live page rather than off a picture — the type scale,
palette and spacing are already declared. Use [[extract-design]] for the
extraction; `--design-md` gives you a brief you can hand straight to the
rebuild step.

## 4. Take content and images from the capture

Parse headings, body copy, numbers, lists, links and the footer out of the DOM,
then download every referenced asset. Never retype a string and never infer a
value the source states. Nothing retyped means nothing drifts.

## 5. Build section by section

One section at a time — header, hero, feature rows, tables, media, testimonials,
FAQ, footer — in auto layout or real layout containers, never pinned
coordinates. Screenshot each section and compare it before moving on. A rebuild
judged only at the end gets judged once, badly.

## 6. Compare three things, not one

| Check | Question |
|---|---|
| Visual | Does it look the same at each width? |
| Structural | Is it built from sane containers rather than absolute positions? |
| Semantic | Are the words, links, numbers and variants the ones the source states? |

The third is the one people drop, and it is the one that matters most. A
perfect visual copy can carry wrong data, and it will pass every screenshot
comparison you run against it.

Token-level verification is free: extract the original, extract the rebuild,
compare the two token sets. The difference is your remaining work, stated as a
list instead of a feeling.

## 7. Fix what the capture could not see

Some errors are structural blindness, not degradation, and none of them look
like errors:

- A hero using the wrong image because the real one is a CSS background.
- Carousel or video items in the wrong order.
- Two cards whose values differ by variant, copied from each other.

Report what you could not resolve rather than guessing.

## 8. Fonts: stand in, then swap

Licensed foundry fonts usually cannot be loaded in an automated environment,
and a visual lookalike is the wrong answer because it moves every line break
you are about to verify. Build on a metric-compatible stand-in, then swap to
the real face at the end with one find and replace.

## 9. Fix by targeted prompt, not by rerunning

Every remaining error is local, so the instruction has to be local too: name
the section, name what is wrong, name the source value. Rerunning the whole
rebuild to fix one card costs the hour again and moves the errors somewhere
new.

Where the fix is a judgement call rather than a value, produce two or three
versions of that one section and ask which is right — and ask what made it
right. That sentence is what gets applied to the next section instead of a
guess.

## 10. Throw the scaffolding away

Import gone, staging assets gone. What is left is the two frames, named layers,
icons as vectors, not one absolutely positioned element. If the import is still
in the file, the file is still a draft.

## What this is for

Reproducing a page is research: teardowns, redesign baselines, migration
references, and regression checks against your own site. The last is the most
undervalued — the fastest way to learn whether production still matches its
design system is to extract it and compare.

Shipping someone else's layout, copy or brand as your own is a different act,
and the pipeline being fast does not make it a better idea. Respect robots.txt
and terms of service.

## Related

- [[extract-design]] — the measurement step, and the verification pass
- [[generate-ui-from-brand]] — when the goal is new UI in a brand, not a copy
- [[authentic-product-representation]] — keeping rebuilt content truthful

---

## Constituent Domain: generate-ui-from-brand

# generate-ui-from-brand

**Type:** Pipeline / Orchestrator  
**Input:** URL or existing DESIGN.md  
**Output:** Actionable UI spec with decisions made

---

## Step 1 — Extract

**If a URL is provided and Dembrandt MCP is available:**

All MCP extraction tools are async — they return a `job_id` immediately. Poll `get_job_status` until `status` is `"completed"`, then read `result`.

```
{ job_id } = get_design_tokens({ url })
{ result } = get_job_status({ job_id })   // repeat until status === "completed"
```

Run these in sequence (each extraction launches a browser):
```
get_design_tokens, get_color_palette, get_typography, get_component_styles, get_spacing
```

**If Dembrandt MCP is not available, run CLI:**
```bash
npx dembrandt <url> --design-md --crawl 3
```

**If DESIGN.md already exists:** parse it directly — skip extraction.

---

## Step 2 — Normalize Tokens

Do not use raw extracted values directly. Map them to a semantic system first.

### Colours
Identify the role of each extracted colour:

| Role | Token | How to identify |
|---|---|---|
| `color-primary` | Main brand colour | Used on primary buttons, links, key interactive elements |
| `color-secondary` | Supporting brand colour | Used on secondary actions, accents |
| `color-surface` | Background | Page or card background |
| `color-surface-raised` | Elevated surface | Cards, panels, modals |
| `color-border` | Border / divider | Input borders, separators |
| `color-text` | Primary text | Body copy |
| `color-text-secondary` | Secondary text | Labels, metadata, captions |
| `color-error` | Error state | Red — do not assign to any other role |
| `color-warning` | Warning state | Orange/amber — do not assign to any other role |
| `color-success` | Success state | Green — do not assign to any other role |

**Decision rule:** if the extracted palette has more than 2 brand colours competing for `color-primary`, pick the one with highest usage on interactive elements.

### Typography
Map extracted sizes to a scale. Verify ratio coherence — if sizes do not follow a consistent ratio, round them to the nearest modular scale step (base 16px, ratio 1.25 recommended).

| Token | Min size | Role |
|---|---|---|
| `text-base` | 16px | Body copy — never below 16px |
| `text-sm` | 14px | Labels, captions — use sparingly |
| `text-lg` | 20px | Lead paragraph |
| `text-h4` | 25px | Section subheading |
| `text-h3` | 31px | Section heading |
| `text-h2` | 39px | Page subheading |
| `text-h1` | 49px | Page heading |
| `text-display` | 61px | Hero / landing only |

**Decision rule:** if extracted body text is below 16px, override to 16px.

### Spacing
Identify the base spacing unit from the most common small margin/padding value. Derive a scale:

```
base = extracted smallest recurring value (usually 4px or 8px)
scale = base × 1, 2, 3, 4, 6, 8, 12, 16
```

### Border Radius
Extract the most common radius value used on interactive elements (buttons, inputs). This becomes `--radius-button` — applied uniformly to all buttons regardless of variant.

---

## Step 3 — Apply UX Decisions

With normalized tokens, make the following decisions explicitly. Do not leave these open:

### Visual Hierarchy
- Identify the single primary action for the UI being built
- Assign `color-primary` to that action only
- All other actions use neutral or outlined styles
- Apply `cursor: pointer` to all interactive elements

### Gestalt Grouping
- Define spacing between related elements (tight: `space-2`) and between groups (loose: `space-6` or `space-8`)
- Confirm that related controls will be co-located in the layout

### Accessibility (WCAG 2.2 AA)
Run contrast check on normalized tokens:
- `color-text` on `color-surface`: must be ≥ 4.5:1
- `color-text-secondary` on `color-surface`: must be ≥ 4.5:1
- `color-primary` on white/surface (button label): must be ≥ 4.5:1

If any fail, darken or lighten the token to meet the threshold. Document the adjustment.

### Error / Status Colours
- Confirm `color-error` is red and used only for errors
- Confirm `color-warning` is orange/amber and used only for warnings
- If the brand uses orange as a primary colour, it cannot double as a warning — a distinct amber must be defined for warning states

---

## Step 4 — Output UI Spec

Produce a concrete, copy-pasteable output. Choose the format that fits the request:

### Design Token File (CSS)
```css
:root {
  /* Colours */
  --color-primary:          <value>;
  --color-secondary:        <value>;
  --color-surface:          <value>;
  --color-surface-raised:   <value>;
  --color-border:           <value>;
  --color-text:             <value>;
  --color-text-secondary:   <value>;
  --color-error:            <value>;
  --color-warning:          <value>;
  --color-success:          <value>;

  /* Typography */
  --font-sans:    <extracted font family>;
  --text-base:    1rem;
  --text-sm:      0.875rem;
  --text-lg:      1.25rem;
  --text-h4:      1.563rem;
  --text-h3:      1.938rem;
  --text-h2:      2.438rem;
  --text-h1:      3.063rem;

  /* Spacing */
  --space-1:  <base>px;
  --space-2:  <base×2>px;
  --space-4:  <base×4>px;
  --space-6:  <base×6>px;
  --space-8:  <base×8>px;

  /* Borders */
  --radius-button:  <extracted>px;
  --radius-card:    <extracted or radius-button + 2>px;

  /* Elevation */
  --shadow-card:   0 1px 3px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06);
  --shadow-modal:  0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05);
}
```

### UX Audit (if auditing an existing UI)
```
CONTRAST ISSUES
  - color-text-secondary on color-surface: X.X:1 (required 4.5:1) → fix: darken to #...

HIERARCHY ISSUES
  - 3 primary buttons on same screen → reduce to 1 primary, 2 secondary

CONSISTENCY ISSUES
  - Button radius varies (4px, 8px, 12px) → standardize to --radius-button: 8px

MISSING STATES
  - No disabled state defined for inputs
  - No error state for form fields

FONT SIZE VIOLATIONS
  - Caption text at 12px → minimum 14px
```

### Component Structure (if generating a layout)
```
Page layout:
  Header (fixed, 56px)
    Logo | Nav | [Global controls: small type]
  
  Main
    Hero section
      H1 (display scale) + lead text + primary CTA (color-primary, full)
    
    Feature grid (3-col)
      Card (shadow-card, radius-card) × 3
        Icon + H4 + body text
    
  Footer
    Links (text-sm, color-text-secondary)
    Language/currency selector (text-sm)

Primary action: CTA button in hero
Secondary actions: nav links, card CTAs (outlined)
Error states: inline, adjacent to field, red text + icon
```

---

## Running This Across Many Brands (Token Architecture & Governance)

Building **several brands from one pipeline**, don't treat each as a fresh start. **One system, many skins:** every brand generates from the same semantic tokens; only primitives (colour, type, radius) change per brand. A fix propagates everywhere.

**Consolidate periodically — token systems drift.** Across many brands and over time, tokens fork, one-off values creep in, and the systems diverge. Schedule a recurring consolidation pass:
- **Re-extract and compare** the live sites (use Dembrandt's extract + drift/compute-drift tooling, plus plain visual inspection and benchmarking against each other and against current design trends and best practice).
- **Fold divergences back** into the shared semantic layer where they should be common; keep genuinely brand-specific values as primitive overrides only.
- **Feed in a point of view.** Consolidation isn't just mechanical de-duplication — bring UX / visual-design opinion and a clear direction for where each product should go, not just where it is.

**When design eras conflict, recency is the tiebreaker.** A product built over years carries pages from different design generations. The newest pages and components are the best available evidence of current design intent — migrate old toward new; never average the eras into a compromise style. Recency is a default, not a verdict: the newest surface can be an unreviewed one-off. Confirm with the user before promoting a style to canonical or marking an old one deprecated.

**Deprecate on touch, not big-bang.** Keep a short list of deprecated styles — the old radius, the old shadow, the retired button variant. When work already touches an old-generation page, lift it to the current style in the same pass. Every touch moves the product one page closer to one system, with no rewrite project on the roadmap.

**Two or three occurrences make a pattern.** When the same visual treatment appears independently in 2–3 places, it is no longer a coincidence — name it, tokenise it, and make it available everywhere. Promoting it is cheaper than a fourth hand-rolled copy. Once promoted, the pattern belongs to the design language: new components may use it as-is or adapt it, as long as the adaptation stays recognisably true to the original.

**Track feature usage and deprecate the dead weight.** The same discipline applies to features, not just tokens: instrument what actually gets used, and **deprecate the features/components with little real usage** rather than maintaining them forever. A shared system stays healthy only if it's pruned — every unused component is drift waiting to happen and a cost on every future change.

---

## Audit Checklist Before Handoff

- [ ] All tokens named semantically, not by value (`color-primary` not `color-blue-600`)
- [ ] Body text ≥ 16px everywhere
- [ ] Contrast ratios verified for all text/background combinations
- [ ] One primary button per view
- [ ] All buttons share `--radius-button`
- [ ] `cursor: pointer` on all interactive elements
- [ ] Error colour reserved exclusively for errors
- [ ] Warning colour (orange) reserved exclusively for warnings
- [ ] Spacing derived from a single base unit

---

## Constituent Domain: extract-design

# Extract Design — Dembrandt

Dembrandt runs a headless Chromium browser against any URL, walks up to thousands of DOM elements, reads computed CSS, and returns a structured design system: colors with confidence scoring, typography styles, spacing scale, border radius, borders, shadows, and interactive component styles.

## How to Run

```bash
# Zero-install — npx fetches the package on first run (lowest friction)
npx -y dembrandt https://dembrandt.com

# Or install once (global), then call `dembrandt` directly
npm i -g dembrandt

# Basic extraction — outputs to terminal
dembrandt https://dembrandt.com

# JSON output — pipe into files or other tools
dembrandt https://dembrandt.com --json-only > dembrandt-tokens.json

# W3C DTCG format (design-tokens.org standard)
dembrandt https://dembrandt.com --dtcg --save-output

# Generate DESIGN.md (human + AI readable brand doc)
dembrandt https://dembrandt.com --design-md

# Multi-page crawl (follows internal links)
dembrandt https://dembrandt.com --crawl 5

# Dark mode colors
dembrandt https://dembrandt.com --dark-mode

# Mobile viewport
dembrandt https://dembrandt.com --mobile

# Everything saved to output/
dembrandt https://dembrandt.com --save-output

# Tailwind v4 @theme CSS — observed values only  [dembrandt 0.28+]
dembrandt https://dembrandt.com --tailwind src/app.css

# Self-contained HTML report — open offline or attach as a CI artifact  [dembrandt 0.19+]
dembrandt https://dembrandt.com --html report.html

# Drift gate — compare against a saved baseline; exits 1 on drift  [dembrandt 0.19+]
dembrandt https://app.example.com --compare baseline.json --html report.html
```

## MCP Usage (async by default)

To expose Dembrandt as MCP tools, add this server to the agent's MCP config (no install — `npx` fetches it on first run):

```json
{ "mcpServers": { "dembrandt": { "command": "npx", "args": ["-y", "--package", "dembrandt", "dembrandt-mcp"] } } }
```

When using the Dembrandt MCP server, all extraction tools return a `job_id` immediately rather than blocking. Poll `get_job_status` until `status` is `"completed"`:

```
1. get_design_tokens({ url: "dembrandt.com", pages: 5 })
   → { job_id: "job_123_abc", status: "queued" }

2. get_job_status({ job_id: "job_123_abc" })
   → { status: "running" }   // poll again

3. get_job_status({ job_id: "job_123_abc" })
   → { status: "completed", result: { ... } }

4. get_findings({ job_id: "job_123_abc" })      // no need to resend the extraction
   → { findings: [ ... ], contrast: { ... } }
```

**Hand the `job_id` to the analysis tools instead of passing the extraction back.** Every pure tool accepts it, and the queue keeps the whole extraction for an hour, so a job started by a narrow tool such as `get_color_palette` still feeds `export_dtcg`. Passing the extraction inline works and wins when you give both, but a real extraction is far too large to travel back through the model as a tool argument.  [dembrandt 0.29+]

Pass `sync: true` to any extraction tool to block and return the result directly (useful on fast networks, risks timeout on slow sites, and proportionally slower when `pages` is above 1).

Extraction tools: `get_design_tokens` (everything), `get_color_palette`, `get_typography`, `get_component_styles`, `get_surfaces`, `get_spacing`, `get_brand_identity`. All accept `slow`, `mobile` (mobile viewport), and `cookie` (cookie string for authenticated pages); `get_design_tokens` and `get_color_palette` also accept `darkMode` and `wcag` (contrast analysis).  [dembrandt 0.23.1+ for mobile/cookie/wcag]

Every extraction tool also crawls, which is the single biggest lever on token quality: one page gives you one page's tokens.  [dembrandt 0.29+]

| Option | What |
|---|---|
| `pages` | Extract up to N pages and merge them into one token set (1 to 20). Pages come from DOM links, or from sitemap.xml when `sitemap` is true |
| `paths` | Name the extra paths explicitly, e.g. `["/pricing", "/docs"]`. Overrides discovery |
| `sitemap` | Discover from sitemap.xml. Alone it takes up to 20 pages; `pages` caps it |
| `header` | One extra HTTP header, e.g. `"Authorization: Bearer ..."`, for pages a cookie cannot reach |
| `userAgent` | Custom user agent string |
| `noSandbox` | Disable the browser sandbox. Required inside Docker and most CI containers, where launch otherwise fails |

A page that fails to load is dropped and the merge carries the rest, so a crawl does not fail on one bad URL.

Pure tools (no browser, synchronous; take an extraction object, or the `job_id` of a completed one  [dembrandt 0.29+]): `compute_drift` (0-100 drift score between two extractions; takes `baselineJobId` and `candidateJobId` as the job-based form), `get_findings` (design-system lint: contrast, consistency, duplication), `export_dtcg` (W3C Design Tokens format), `generate_design_md` (DESIGN.md brand guide), `render_report` (self-contained HTML report). Job control: `get_job_status`, `list_jobs`, `cancel_job`.  [dembrandt 0.23.1+ for get_findings/export_dtcg/generate_design_md/list_jobs]

Note: `npx` runs a `dembrandt-mcp` already on PATH in preference to the version named in `--package`, so a globally installed dembrandt silently shadows the pinned one. Symptom: options the pinned version supports are rejected as unknown, or a crawl returns a single page. Check with `dembrandt --version` and upgrade the global install, or point the MCP config at an explicit path.

Note: dembrandt <=0.23.0 fails to start via the npx one-liner above (`McpDepsMissingError`) — the MCP SDK was an optional peer dependency. Fixed in 0.23.1; require it.

## Output Structure

Dembrandt returns a structured object. The key sections:

```
colors.palette        — Deduplicated colors with confidence (high/medium/low).
                        Each entry carries hex (`normalized`), plus `lch` and
                        `oklch` of the same colour, and derived `role`,
                        `onColor`, `hover`. With `--wcag`, entries also carry
                        `contrastAgainst`, the pairs this colour was actually
                        observed against on the page, deduped by the other
                        colour and sorted by ratio (dembrandt 0.31+).
colors.semantic       — Primary, secondary, background, text, and accent detection
colors.cssVariables   — Named CSS custom properties. `value` is the author's
                        string verbatim (the only record of the authored
                        notation), plus computed hex + LCH + OKLCH.
typography.styles     — Font family, size, weight, line-height per context.
                        Each entry carries `count`, the number of elements
                        rendering that exact style.
typography.sources    — Google Fonts, Adobe Fonts, variable font detection.
                        `urls` lists the resolved font asset and webfont
                        stylesheet URLs, deduped, so you can re-fetch or verify
                        the real files. `filteredFamilies` lists families
                        dropped by the usage floor — check it before concluding
                        a face is missing.
spacing.commonValues  — Margin/padding scale with rem equivalents
spacing.scaleType     — 4px, 8px, or custom grid
borderRadius.values   — Border radius tokens with element context
borders.combinations  — Width + style + color combinations
shadows               — Box shadow elevation system
components.buttons    — Button variants with hover/active/focus states
components.inputs     — Input styles with focus states
components.links      — Link colors and hover states
components.badges     — Badge/tag/chip variants
breakpoints           — Responsive breakpoints from CSS media queries
frameworks            — Detected CSS framework (Tailwind, shadcn, MUI, etc.)
iconSystem            — Detected icon library (Heroicons, FA, Material, etc.)
pages                 — Present only on a merged multi-page result (`--crawl`,
                        `--sitemap`, extra paths, or MCP `pages`). One entry per
                        page extracted, so you can tell which URLs the merged
                        tokens came from. Palette entries then also carry
                        `pageCount`.
wcag                  : with `--wcag`, observed contrast pairs (fg, bg, ratio,
                        aa/aaLarge/aaa booleans) between real rendered colours.
meta.crawl            : present when `--crawl`, `--sitemap` or explicit paths
                        are used, with `technique`, `pagesRequested`,
                        `pagesFound` (dembrandt 0.31+).
meta.robotsWarnings   : pages robots.txt disallowed, whether that was the
                        entry URL or one discovered during a crawl. The check
                        is advisory, it never blocks extraction, this is the
                        only record of what it flagged (dembrandt 0.31+).
```

## Working with Extracted Tokens

### Seeding a Tailwind theme  *(dembrandt 0.28+)*

Don't hand-map the JSON. `--tailwind` writes a Tailwind v4 `@theme` block directly:

```bash
dembrandt https://dembrandt.com --tailwind            # → output/<domain>/theme.css
dembrandt https://dembrandt.com --tailwind src/app.css  # or straight into the project
```

```css
@import "tailwindcss";

@theme {
  --color-primary: #ea580c;
  --text-display: 96px;
  --text-display--line-height: 1;
  --spacing: 8px;
  --radius-lg: 8px;
  --breakpoint-md: 700px;
}
```

Observed values only: no 50–950 shade ramps, no interpolated scale steps, no derived hover or on-colour variants. An invented shade is indistinguishable from a measured one once it is in the file, so the export is a starting point you extend by hand. Colours keep their semantic role name (`--color-primary`) or the page's own custom property name where one is declared; the rest are numbered `--color-brand-N`. Spacing collapses to v4's `--spacing` multiplier when the page has a base-N rhythm, and falls back to named steps otherwise. Tailwind's defaults still apply to anything not listed, so the block extends the theme rather than replacing it.

v4 only. For a v3 `tailwind.config.js`, map the output by hand — `colors.semantic` → `theme.colors`, `typography.styles` → `fontFamily`, `spacing.commonValues` → `spacing`, `borderRadius.values` → `borderRadius`, `shadows` → `boxShadow`.

### Seeding a shadcn/ui theme

Map semantic colors to shadcn CSS variables in HSL:

```css
:root {
  --background: /* from colors.semantic.background (0.22.0+), else colors.palette — lightest neutral */;
  --foreground: /* from colors.semantic.text (0.22.0+), else colors.palette — darkest neutral */;
  --primary: /* from colors.semantic.primary */;
  --primary-foreground: /* contrasting color */;
  --muted: /* mid-tone neutral */;
  --border: /* from borders.combinations[0].color */;
  --radius: /* from borderRadius.values[0].value */;
}
```

### Reading confidence levels

Dembrandt scores every color by semantic context:

| Confidence | Meaning |
|---|---|
| **high** | Appears on semantically labeled elements (buttons, CTAs, headers with brand classes). Almost certainly a brand color. |
| **medium** | Moderate frequency or moderate context. Likely a brand color. |
| **low** | Rare, low semantic context. May be a one-off or component-specific color. |

Since 0.28.0 confidence also has a usage floor, as spacing and radii always had: a colour seen once caps at low, twice at medium, and high needs three occurrences whatever its semantic context scores. Hover and focus colours are the exception and keep medium — their single occurrence is provenance, not a usage claim.

Start with `high` confidence colors when building a palette. Include `medium` for full coverage. Treat `low` as reference only.

### Colour notation

Never convert a colour by hand and never re-derive one with your own maths. Every palette entry and every CSS variable already carries `lch` and `oklch` alongside the hex, so read the field you need straight from the JSON. `--color-format` only changes what the terminal prints, so it is the wrong tool when you are consuming JSON or MCP output.

Use hex (`normalized`) as the identity of a colour: it is what dedup, drift comparison and every downstream tool key on. Two entries with the same hex are the same token even when their emitted notations differ. When an author declared a token in a modern notation, `cssVariables[name].value` preserves it exactly, which is what you want when writing CSS back into that codebase, since it keeps the author's own notation and stays inside their gamut.

## Flags Reference

| Flag | What it does |
|---|---|
| `--json-only` | Clean JSON to stdout — pipe into files or tools |
| `--save-output` | Save JSON to `output/<domain>/<timestamp>.json` |
| `--dtcg` | W3C Design Tokens Community Group format |
| `--design-md` | Generate `DESIGN.md` — prose-first brand doc |
| `--html [path]` | Self-contained HTML report (inline CSS, embedded JSON). Open offline or attach as a CI artifact. *(0.19+)* |
| `--compare <baseline.json>` | Diff against a saved extraction; prints a drift verdict and exits `1` on drift. CI gate. *(0.19+)* |
| `--brand-guide` | Generate a PDF brand guide |
| `--dark-mode` | Extract dark color scheme and merge into palette |
| `--mobile` | Extract at 390px mobile viewport |
| `--crawl <n>` | Crawl up to N pages and merge tokens |
| `--sitemap` | Discover pages from sitemap.xml |
| `--slow` | 3× timeouts — use on slow-loading or JS-heavy sites |
| `--screenshot <path>` | Save a full-page screenshot |
| `--raw-colors` | Include pre-filter raw colors in JSON output |
| `--color-format <fmt>` | Notation for colors printed to the terminal: `hex` (default), `rgb`, `oklch`, `lch`, `source` (as authored). Presentational only, so JSON output is unchanged, and export paths ignore it. *(0.28+)* |
| `--tailwind [path]` | Write a Tailwind v4 `@theme` CSS file — observed values only. Defaults to `output/<domain>/theme.css`. *(0.28+)* |
| `--browser firefox` | Use Firefox instead of Chromium |
| `--stealth` | Opt-in anti-detection: navigator spoofing + human mouse simulation. Use only when authorized. |
| `--user-agent <string>` | Custom user agent string |
| `--locale <string>` | Browser locale, e.g. `fi-FI`, `en-GB` (default: `en-US`) |
| `--timezone <string>` | Browser timezone, e.g. `Europe/Helsinki` (default: `America/New_York`) |
| `--accept-language <string>` | Custom `Accept-Language` header value |
| `--screen-size <WxH>` | Physical screen resolution to report, e.g. `1920x1080` |

## Drift Detection & CI  *(dembrandt 0.19+)*

`--compare` turns extraction into a gate. Save a known-good baseline, then compare later extractions against it:

```bash
# 1. capture a baseline (in the SAME environment you will check against)
dembrandt https://app.example.com --json-only > baseline.json

# 2. later — compare; exits 0 if stable, 1 if drifted
dembrandt https://app.example.com --compare baseline.json --html report.html
```

- Runs the canonical drift engine over **structured tokens** — deterministic, not a pixel/render diff.
- **Exit code:** `0` stable, `1` drift. Gates a pipeline directly.
- `--html` writes a self-contained report; with `--compare` it includes a drift banner (added/removed/changed tokens). Attach it as a CI artifact.

**Baselines churn once on 0.28.0.** Three fixes move colour and typography values: the palette usage floor, `body` ending at the 24px reading range (non-heading text above it takes `text`, so hero copy stops landing on the body token), and families under 2% of counted text being dropped. Measured on dembrandt.com against a 0.27.1 extraction, drift came out at 15 against a threshold of 10 — enough to fail a gate. On the first run after upgrading, re-approve with `--compare <baseline> --approve` or regenerate the baseline. Drift after that is real drift.

**Determinism:** capture the baseline in the *same environment* you check it in (both production, or both the same preview). A baseline from one environment compared against another shows false drift.

**In CI:** run `--compare <baseline> --html report.html` against a preview/deployed URL, fail the job on exit `1`, upload the HTML artifact. **Programmatic:** import `computeDrift` from `dembrandt/drift` and `generateHtmlReport` from `dembrandt/report` to diff and render server-side without the CLI.

## Anti-Bot and SPA Handling

Dembrandt handles common extraction challenges automatically:

- **SPA hydration** — waits 8s for React/Vue/Svelte to render before extracting
- **Lazy content** — scrolls the full page to trigger lazy-loaded components
- **Cloudflare / bot walls** — auto-retries with a visible browser if headless is blocked
- **Slow sites** — use `--slow` for 3× timeouts on heavy JS bundles
- **Cookie banners** — dismisses common CMP dialogs (OneTrust, cookielaw, GDPR patterns) automatically
- **Bot detection bypass** — use `--stealth` to opt in to navigator spoofing and human mouse simulation; off by default so the tool identifies itself honestly

## Checklist After Extraction

- [ ] Identify the 3–5 high-confidence colors — these are the core brand palette
- [ ] Check `colors.semantic.primary` — is it correct?
- [ ] Look at `typography.styles` — what are the heading and body fonts?
- [ ] Check `spacing.scaleType` — 4px or 8px grid?
- [ ] Review `components.buttons` — how many variants exist?
- [ ] Check `frameworks` — is Tailwind, shadcn, or MUI detected? This shapes how you apply the tokens.
- [ ] Use `--dark-mode` if the site has a dark theme
- [ ] Use `--crawl 3` if the site has a multi-section design system spread across routes

---

## Auditor Defense Checklist & Quality Gate

Whenever acting as or validating against this Master Skill, verify each of the following golden criteria:

- [ ] **Visual Tone Consistency**: Do border-radii, typography, and iconography strictly match the defined brand personality?
- [ ] **Concentric Radii Formula**: Is outerRadius = innerRadius + padding strictly respected without visual clipping?
- [ ] **Color Palette Discipline**: Is the functional accent color restricted to < 5% of the visual field?
- [ ] **Modular Typography Scale**: Are type sizes adhering to an exact geometric ratio with explicit rem/px tokens and tabular figures for numbers?
- [ ] **Elevation & Depth**: Are shadow layers subtle (2-3 layers), directional, with dark mode utilizing surface lightness over drop shadows?
- [ ] **Sizing & Spacing Units**: Are all paddings, margins, and gaps pegged to a rigid 4px/8px grid system?
- [ ] **Authentic Product Representation**: Are all visuals, placeholders, and mockups grounded in realistic domain fixtures rather than generic lorem ipsum?
