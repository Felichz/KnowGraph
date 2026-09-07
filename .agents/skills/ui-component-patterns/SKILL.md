---
name: ui-component-patterns
description: Master component patterns skill covering app shell layouts, global controls, modal/overlay hierarchies, tab navigation, 6-state buttons, forms, scroll containment, and coordinated data views. Generates Sections D-E of design-spec.md.
---

# UI Component Patterns & Interactive Mechanics Master Skill

> **Domain Scope**: Fuses 15 specialized visual design skills into an authoritative, multi-perspective Master Skill.

## Constituent Skills Index

- [app-shell](#constituent-domain-app-shell)
- [global-toolbar-controls](#constituent-domain-global-toolbar-controls)
- [modal-and-overlay-patterns](#constituent-domain-modal-and-overlay-patterns)
- [tab-navigation](#constituent-domain-tab-navigation)
- [button-states](#constituent-domain-button-states)
- [form-design](#constituent-domain-form-design)
- [scroll-areas](#constituent-domain-scroll-areas)
- [sticky-and-fixed-elements](#constituent-domain-sticky-and-fixed-elements)
- [component-family-consistency](#constituent-domain-component-family-consistency)
- [repeated-component-alignment](#constituent-domain-repeated-component-alignment)
- [coordinated-data-views](#constituent-domain-coordinated-data-views)
- [data-display-and-selection](#constituent-domain-data-display-and-selection)
- [domain-expert-configuration](#constituent-domain-domain-expert-configuration)
- [operational-expert-tool-ui](#constituent-domain-operational-expert-tool-ui)
- [real-world-metaphors](#constituent-domain-real-world-metaphors)

---

## Constituent Domain: app-shell

# The App Shell

The shell is the part of the screen that does not change when the user navigates: the bar across the top, whatever sits in it, and in heavy tools a strip along the bottom. Everything between them belongs to the application. The shell is small, and it carries more weight than its size suggests — it is the only thing a user sees on every screen of every tool.

## The Shell Belongs to the Estate, Not to the App

One company rarely has one application. It has a public site, a shop, a customer portal, an internal admin tool, and something older that nobody wants to touch but that people depend on. The user crosses between them during a working day, and each crossing is where the sense of one company either holds or breaks.

**The rule: the top bar is estate-level furniture. The app owns everything below it.** An app that restyles the shared bar to fit its own look has taken something that was not its to change — the bar's job is to be the one fixed point.

But *fixed* is not the same as *full*. What the shell contains may shrink to whatever of its jobs are still unanswered here; what remains is identical — same position, same behaviour, same wording. Quantity flexes, treatment does not.

This also settles a hierarchy question that otherwise gets argued per team. Anything *above* the application in scope lives in the shell; anything *within* the application lives in the app's own navigation.

| Lives in the shell (above the app) | Lives in the app's own nav (within it) |
|---|---|
| Tenant / customer / organisation | Sections, modules, pages |
| Region or market | Filters and views |
| Language and locale | Entity-level actions |
| Identity, role, sign-out | Feature settings |
| App launcher | Search within this tool |

If a control changes what the *whole estate* shows you, it is a shell control. If it changes what *this tool* shows you, it is not.

## How Small the Shell May Get

A sub-application entered only from its parent has one estate-level job left — the way back — so the shell may collapse to a single line: one label, one icon, on the same background as the content, no bar and no chrome. Everything else the shell would carry was already answered upstream, and repeating it is noise.

The condition is the entry path, and it is the whole rule:

- **Entry is always through the parent** — a return affordance is enough.
- **Entry can be direct or lateral** — a deep link from chat, a bookmark, an email button, another tool — then a return affordance points at nothing, because browser history is not hierarchy. Carry a home affordance instead. It can still be one icon.

**Name it by destination, not by action.** `← Dashboard` stays true when history and hierarchy disagree; `← Back` does not. Back is a history concept, up is a hierarchy concept, and a shell that conflates them lies exactly when the user is most lost.

## The App Launcher

When a user has access to more than three tools, the shell needs a launcher: one icon in the top bar that opens the full set. It is what replaces the bookmark folder and the link someone pasted in chat two years ago.

- **Show everything the user can reach, and nothing they cannot** — a launcher listing tools that return a 403 teaches users to distrust it
- **Name tools the way people name them out loud**, not by internal project codename
- **Mark what opens in a new context** — a 2006 system that will not share the shell's look should say so, quietly, rather than surprising the user
- **Order by the user's use, then alphabetically** — not by the org chart of who built what

## Tenant, Environment, and the Colour Trap

In a multi-tenant or multi-customer tool, the user must always know whose data is on screen. Two related controls, one important difference.

**Environment is worth a colour.** Production, staging, and a local build should be impossible to confuse, because the cost of the confusion is a real change to real data. A coloured strip or a tinted bar is the right tool, and this is one of the few places where deliberately breaking the calm of the shell is correct.

**Tenant is not.** Tinting the whole UI per customer is a tempting idea that makes every customer a different-looking product, breaks the brand, and quietly wrecks contrast the moment a customer's colour is not one you chose. Show the tenant as a **label** in the shell — name, and an avatar or initials if you have one — not as a theme. If a tenant genuinely needs its own visual identity, that is a white-label decision made once at the product level, not a per-session tint ([[brand-visual-language]]).

Whoever is selected, the shell states it plainly and permanently, and destructive actions repeat it in the confirmation ([[ui-context-and-scope]]).

## The Status Bar

Heavy tools — dispatch boards, data managers, editors people sit in for six hours ([[operational-expert-tool-ui]]) — benefit from a strip along the bottom that carries ambient state. It answers questions the user would otherwise have to go looking for:

connection and sync state · environment · active filters and how many records they match · selection count · last saved · the one keyboard hint that matters here

It is ambient, so it stays quiet: the same small, muted type as the rest of the shell, no animation, no colour except when something is genuinely wrong. A status bar that flashes is a notification in the wrong place ([[notifications-and-recovery]]).

Consumer products almost never need one. If the user is not in the tool long enough to build a habit of glancing down, the strip is just a stolen row of screen.

## Review Checklist

- [ ] Is the shell in the same position, with the same behaviour and wording, across every application in the estate?
- [ ] Where it is reduced, is the reduction justified by the entry path rather than by one app's taste?
- [ ] Does a return affordance name its destination rather than saying "back"?
- [ ] Does every control sit at the right level: estate-scope in the shell, app-scope in the app's own nav?
- [ ] Does the launcher list exactly the tools this user can actually open?
- [ ] Is the current tenant stated as a label rather than applied as a theme?
- [ ] Is the environment (production / staging) unmistakable?
- [ ] In a heavy tool, does the status bar carry ambient state — and stay quiet?

---

## Constituent Domain: global-toolbar-controls

# Global Toolbar Controls

## What Belongs Here

Global controls affect the entire product experience but are not the user's primary task. They are reached occasionally — once per session or less — and should not compete visually with primary navigation or content.

Typical global toolbar controls:
- **Currency selector** (e-commerce, financial tools)
- **Language / locale switcher**
- **Region or market selector**
- **Unit system** (metric / imperial)
- **Theme toggle** (light / dark)
- **Accessibility preferences** (font size, contrast)

These are distinct from user account settings (which live in a profile menu) and from contextual settings (which live adjacent to the feature they affect).

## Where to Place Them

### Header utility strip
A secondary row above or within the main header, right-aligned. Common on e-commerce and international sites.

```
[Logo]                    [EN | EUR | 🌍]  [Account]  [Cart]
────────────────────────────────────────────────────────────
[Main navigation]
```

### Header right — compact
Inline with the main header, far right, using small typography and minimal visual weight.

```
[Logo]  [Nav items ...]              [EUR ▾]  [EN ▾]  [Account ▾]
```

### Footer
For controls the user sets once and rarely revisits. Language and region selectors frequently appear in footers on large international sites (Airbnb, Apple). Appropriate when the control is truly infrequent.

### Dedicated settings area
For more complex preference sets, a Settings page or panel is cleaner than cramming everything into the toolbar. The toolbar should link to it, not contain it.

## Typography and Visual Treatment

Global toolbar controls are secondary UI — they should not draw the eye away from primary content.

- **Font size: 13–14px** — deliberately smaller than body text (14px maximum per the type scale)
- **Colour: muted** — use a secondary text colour (`--color-text-secondary`), not the primary text colour
- **No bold** — regular weight only
- **Compact spacing** — tighter padding than primary navigation items
- **Separator** — a `|` or thin vertical rule between adjacent controls (language | currency) keeps them grouped without using full button chrome

```css
.toolbar-control {
  font-size: var(--text-sm);       /* 13–14px */
  color: var(--color-text-secondary);
  font-weight: 400;
  padding: 4px 8px;
}
```

## Interaction Pattern

Global controls typically use a **compact dropdown** — clicking the label opens a small popover or select with the available options.

- Show the current value as the trigger label: `EUR ▾`, `EN ▾`
- Use a flag icon + language code for locale, or currency symbol + code for currency
- Keep the option list short — if it exceeds ~20 items, add a search input inside the dropdown
- On selection, apply immediately and confirm with a brief status update (toast or inline update) if the change has a visible effect

## Review Checklist

- [ ] Are global controls placed consistently in one location across all pages?
- [ ] Is the typography smaller and more muted than primary navigation?
- [ ] Does the control show the current value as its label?
- [ ] Is the dropdown or popover compact and keyboard-navigable?
- [ ] Are global controls separated from user account settings?
- [ ] On mobile, are global controls accessible without being prominent? (Often moved to a menu or footer on small screens)

---

## Constituent Domain: modal-and-overlay-patterns

# Modal and Overlay Patterns

Overlays appear above the main content layer. They range from lightweight popovers (non-blocking, anchored to a trigger) to full blocking modals (require a user response before the app continues). Choosing the right overlay type for the task prevents unnecessary interruption and keeps the user oriented.

---

## The Overlay Hierarchy

Choose the lightest type that satisfies the task. Heavier overlays carry higher cognitive cost.

| Type | Blocks background | Anchored to trigger | Typical content | Dismiss with |
|---|---|---|---|---|
| **Tooltip** | No | Yes | 1–2 lines of explanatory text | Cursor leave / focus out |
| **Popover** | No | Yes | Short interactive content: a form field, a picker, a small list | Click outside, Escape, explicit close |
| **Dropdown / Menu** | No | Yes | List of actions or options | Click outside, Escape, selection |
| **Bottom sheet** (mobile) | Partial (dimmed) | No | Actions or content on small screens | Swipe down, tap scrim, Escape |
| **Drawer / Side panel** | Partial (dimmed) | No | Secondary editing, detail views, long forms | Escape, explicit close; optionally click scrim |
| **Dialog / Modal** | Yes (full scrim) | No | Blocking task: confirm action, fill required form | Escape (non-destructive only), explicit button |
| **Full-screen overlay** | Yes (complete) | No | Immersive task: media viewer, complex configuration | Explicit close only |

**Decision rule:** If the user can continue using the rest of the app while the overlay is open, use a non-blocking type (drawer, popover). If the app must wait for the user's response, use a modal.

---

## Tooltip

A tooltip appears on hover or keyboard focus and disappears when the trigger loses focus. It is purely informational — no interactive elements inside.

- Content: one short sentence, label, or keyboard shortcut. Never put a link or button inside a tooltip.
- Delay: 300–400ms on hover; no delay on keyboard focus.
- Position: prefer above the trigger; auto-flip when viewport edge is near.
- ARIA: `role="tooltip"` on the element; `aria-describedby` on the trigger pointing to the tooltip id.

---

## Popover

A popover is anchored to a trigger but contains interactive content — a colour picker, a date range selector, a small form, a list of filters. Unlike a tooltip, it stays open while the user interacts.

- Max width: 280–360px. For larger content, use a drawer.
- Position: anchored to the trigger; auto-flip to stay in viewport.
- Dismiss: click outside, Escape key, or explicit close button when the content is long.
- Focus: move focus into the popover when it opens; return focus to the trigger on close.
- ARIA: `role="dialog"` (if interactive) or `role="listbox"` (if a list); `aria-haspopup` on the trigger.

---

## Dropdown and Menu

A dropdown lists selectable options or actions anchored to a trigger button. It is the lightest interactive overlay.

- Separate **select dropdowns** (the user picks one value that persists) from **action menus** (the user triggers an action that doesn't persist as a value).
- Width: at least as wide as the trigger; cap at 280px.
- Long lists: add a search input at the top when there are more than 8–10 items.
- Keyboard: `↑`/`↓` to move between items, `Enter` to select, `Escape` to close.

---

## Bottom Sheet (Mobile)

On small screens, a bottom sheet replaces modals and popovers. It slides up from the bottom edge and feels native to touch devices.

- **Peek height:** Show a small portion of the sheet first (a handle + title), let the user drag to expand.
- **Full-height:** For longer content or forms that need the full viewport.
- Dismiss: swipe down, tap the scrim, or press Escape.
- Do not centre dialogs on mobile — use a bottom sheet instead (centred modals are too small and hard to reach).
- ARIA: treat as `role="dialog"` with the same focus management as a modal.

---

## Drawer / Side Panel

A drawer slides in from the left or right and partially covers the main content. Use it for secondary editing tasks, detail views, or settings that the user might refer back to while using the main content.

- **Right drawer:** Detail view, editing form, filter/sort panel. Most common.
- **Left drawer:** Navigation on mobile (hamburger menu pattern).
- Width: 320–480px on desktop. Full-width on mobile (effectively a bottom sheet or full-screen overlay instead).
- Scrim: a semi-transparent backdrop (`rgba(0,0,0,0.4)`) behind the drawer dims the main content.
- Dismiss: Escape key, explicit close button. Clicking the scrim is optional — avoid it when the drawer contains an unsaved form.
- Do not use a drawer when the task is blocking (e.g. a required decision). Use a modal instead.
- ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the drawer title.

---

## Modal / Dialog

A modal blocks the entire UI with a full scrim. Use it only when the app genuinely cannot continue without the user's response.

### When to use a modal

- Confirming a destructive or irreversible action
- A required form that must be submitted before continuing
- An error or warning that requires the user's acknowledgement

### When not to use a modal

- Displaying information the user can read at their leisure → use an inline notice or notification
- A task the user might want to do alongside the main content → use a drawer
- A large form with many fields → use a dedicated page or a drawer

### Anatomy

```
┌──────────────────────────────────┐
│  Title                      [✕]  │  ← Header: title + close button
├──────────────────────────────────┤
│                                  │
│  Body content                    │  ← Content: scrolls if needed
│  (description, form, media)      │
│                                  │
├──────────────────────────────────┤
│               [Cancel]  [Confirm]│  ← Footer: actions, right-aligned
└──────────────────────────────────┘
```

### Sizing

| Size | Width | Use for |
|---|---|---|
| Small | 360px | Short confirmations, single-field prompts |
| Medium | 480px | Standard dialogs, short forms |
| Large | 640px | Multi-field forms, richer content |
| Full-screen | 100% viewport | Immersive tasks; use sparingly |

Content that overflows the modal height should scroll within the **body area only** — the header and footer must remain visible.

### Dismiss behaviour

| Trigger | Allowed for non-destructive? | Allowed for destructive? |
|---|---|---|
| `Escape` key | Yes | No — require explicit Cancel |
| Click outside scrim | Yes (optional) | No — too easy to dismiss accidentally |
| Close button (✕) | Yes | Yes |
| Cancel button | Yes | Yes |

For destructive or irreversible actions: disable Escape and click-outside dismissal. The user must explicitly press Cancel or Confirm.

### Stacking modals

Avoid opening a modal from inside a modal. It signals an information architecture problem — the task is likely too complex for a single dialog.

If a secondary overlay is unavoidable, use a popover anchored inside the modal rather than another full modal. Never stack two blocking scrim overlays.

---

## Focus Management

Every overlay must manage focus correctly. Broken focus management is one of the most common accessibility failures.

### On open
1. Move focus to the first interactive element inside the overlay (usually the first field, or the confirm button for confirmations).
2. Trap focus: `Tab` and `Shift+Tab` cycle within the overlay only; focus cannot escape to the content behind the scrim.

### On close
Return focus to the element that triggered the overlay. If the trigger no longer exists (the element was deleted), move focus to a logical nearby element.

### Implementation note
Use a focus trap library or the native `<dialog>` element, which handles trapping natively in modern browsers. Rolling a manual focus trap is error-prone.

---

## ARIA for Modals and Drawers

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Delete project?</h2>
  <p id="modal-description">
    This will permanently delete "Apollo" and all its data. This cannot be undone.
  </p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

- `role="dialog"` on the container
- `aria-modal="true"` tells screen readers to ignore content behind the overlay
- `aria-labelledby` points to the dialog title's id
- `aria-describedby` points to the description's id (optional but helpful for confirmations)
- The scrim backdrop should have `aria-hidden="true"` — screen readers must not read it

---

## Destructive Confirmation Pattern

Confirmation dialogs for destructive actions must name the item and consequence. Generic "Are you sure?" dialogs don't give enough context.

**Do:**
> Delete "Apollo Project"?
> This will permanently remove all tasks, files, and history. This cannot be undone.
> [Cancel] [Delete project]

**Don't:**
> Are you sure you want to do this?
> [No] [Yes]

- The primary destructive action button uses `--color-error` / `--color-danger`, not `--color-primary`.
- Label the destructive button explicitly: "Delete project", "Remove member", "Cancel order" — not just "OK" or "Confirm".
- Cancel is always on the left (or secondary position); destructive action on the right.

---

## Review Checklist

- [ ] Is the correct overlay type chosen for the task (tooltip / popover / menu / bottom sheet / drawer / modal)?
- [ ] Is a modal avoided when a drawer or inline pattern would suffice?
- [ ] Does the modal/drawer have a visible title, body, and clear action buttons?
- [ ] Does overflow content scroll within the body — with the header and footer fixed?
- [ ] Is Escape disabled for destructive actions (click-outside too)?
- [ ] Does focus move into the overlay on open, and return to the trigger on close?
- [ ] Is focus trapped within the overlay while it's open?
- [ ] Is `role="dialog"`, `aria-modal="true"`, `aria-labelledby` set correctly?
- [ ] Does the destructive confirm dialog name the item and describe the consequence?
- [ ] Is the destructive button labelled explicitly (not "OK" or "Confirm")?
- [ ] Are stacked modals avoided?
- [ ] On mobile, are modals replaced with bottom sheets?

---

## Constituent Domain: tab-navigation

# Tab Navigation

Tabs organise related content under a shared context. The tab strip communicates the full set of available views; switching tabs swaps the content panel without a page navigation. They work best when all views share a heading, a primary action, or a common subject — tabs that have nothing to do with each other belong in separate pages.

---

## When to Use Tabs — and When Not To

| Use tabs when… | Use something else when… |
|---|---|
| 2–7 views share a common context (same record, same settings section) | There are more than 7–8 tabs — use a sidebar or section nav instead |
| Users switch between views frequently during a session | The content is sequential (use a stepper/wizard instead) |
| All tabs are equally valid entry points | One view is clearly primary — put the rest in a secondary nav or overflow |
| The views share a header or set of page-level actions | Each "tab" requires a different header and layout — use separate pages |

---

## Tab Types

Choose the visual style that fits the layout context.

### Underline / Indicator Tabs
A horizontal strip with a sliding underline or bottom border on the active tab. The lightest treatment — appropriate for page-level tabs where the tab strip sits inside the content area.

```
Overview  |  Activity  |  Settings
──────────
```

### Contained / Boxed Tabs
Each tab is a distinct box; the active tab appears connected to the panel below. Higher visual weight — appropriate for prominent tab groups near the top of a screen or within a card.

### Pill / Button Tabs
Rounded capsules that toggle between states. Lower emphasis — appropriate for secondary content switches within a section (not page-level). Often used for view toggles (e.g. "List / Grid / Map").

---

## Anatomy

```
┌─────────────────────────────────────────────────┐
│  Tab A  │  Tab B  │  Tab C  │                   │  ← Tab strip (role="tablist")
├─────────┴─────────────────────────────────────────┤
│                                                   │
│   Tab panel content                               │  ← Tab panel (role="tabpanel")
│                                                   │
└───────────────────────────────────────────────────┘
```

- **Tab strip:** Fixed height (typically 40–48px). Does not scroll with the page — consider making it sticky when the page is long.
- **Tab panel:** Fills the remaining available height. The panel, not the tab strip, scrolls when content overflows.
- **Active indicator:** A 2–3px bottom border in `--color-primary` for underline tabs; filled background for contained/pill tabs.

---

## States

| State | Visual treatment |
|---|---|
| Active | Primary colour indicator; label in `--color-text-primary` or primary |
| Inactive | Muted label (`--color-text-secondary`); no indicator |
| Hover | Subtle background shift (`--color-grey-50`); label slightly darkens |
| Focus | Visible focus ring (`outline: 2px solid --color-primary; outline-offset: 2px`) |
| Disabled | Reduced opacity (`0.4`); `cursor: not-allowed`; never the active tab |

Never disable the active tab. If content is unavailable, show it inside the panel with an explanation rather than disabling the tab.

---

## Tab Overflow

When the tab strip is wider than the viewport or container, do not wrap tabs onto multiple lines — it destroys the strip metaphor.

### Scrollable strip
The strip scrolls horizontally. Show a fade/gradient at the right edge to signal overflow. On touch devices this is the preferred solution.

```css
.tab-strip {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none; /* hide scrollbar visually on desktop */
}
.tab-strip::after {
  content: '';
  position: absolute; right: 0;
  background: linear-gradient(to left, var(--color-surface), transparent);
  pointer-events: none;
}
```

### "More" overflow menu
Show as many tabs as fit, then collapse the rest into a `More ▾` dropdown. Update the "More" label when an overflowed tab is active: `Settings ▾` (showing the active hidden tab name).

For desktop dashboards with many views, prefer a sidebar nav over overflow tabs.

---

## Vertical Tabs

Use when there are 5+ tabs and the layout has a left sidebar. Vertical tabs allow longer labels without overflow issues and scale more gracefully.

- Fixed width sidebar (typically 200–240px) with tab labels stacked vertically
- Active tab: left border accent (`3px solid --color-primary`) + subtle background
- The main content area fills the remaining width

---

## Keyboard Navigation

Tabs follow the ARIA "roving tabindex" pattern for within-strip navigation.

| Key | Action |
|---|---|
| `Tab` | Move focus to the tab strip (then into the active panel) |
| `←` / `→` | Move between tabs (horizontal strip); activate immediately or on Enter depending on content cost |
| `↑` / `↓` | Move between tabs (vertical strip) |
| `Home` | Jump to first tab |
| `End` | Jump to last tab |
| `Enter` / `Space` | Activate focused tab (if not already auto-activating on arrow key) |

**Auto-activate vs. manual activate:** If switching tabs triggers a network request, use manual activation (arrow keys move focus, Enter activates) to avoid unnecessary fetches. If content is already loaded or cheap, auto-activation on arrow key is acceptable.

---

## ARIA

```html
<div role="tablist" aria-label="Product sections">
  <button
    role="tab"
    id="tab-overview"
    aria-selected="true"
    aria-controls="panel-overview"
    tabindex="0"
  >Overview</button>
  <button
    role="tab"
    id="tab-activity"
    aria-selected="false"
    aria-controls="panel-activity"
    tabindex="-1"
  >Activity</button>
</div>

<div
  role="tabpanel"
  id="panel-overview"
  aria-labelledby="tab-overview"
>…</div>

<div
  role="tabpanel"
  id="panel-activity"
  aria-labelledby="tab-activity"
  hidden
>…</div>
```

- `aria-selected="true"` on the active tab, `false` on all others
- `tabindex="0"` on the active tab, `-1` on all others (roving tabindex)
- `hidden` attribute (or `display: none`) on inactive panels — screen readers skip hidden panels
- `aria-label` on the `tablist` when the heading above doesn't sufficiently describe the group

---

## State Persistence

Remember the active tab across page loads and navigations:

- **URL fragment or query param:** `?tab=activity` — the most robust approach; supports deep linking and browser back/forward
- **localStorage:** Acceptable for preferences (e.g. a preferred dashboard view) that don't need to be shareable
- Do not use `sessionStorage` — tabs closing lose the state unexpectedly

When the URL contains a tab param, jump to that tab on load even if it's not the first tab.

---

## Nested Tabs

Avoid tabs within tabs. Nested tabbing creates confusion about scope — a user editing content in "Tab A › Sub-tab 2" has no clear mental model of what the outer tab means.

If you find yourself nesting tabs, reconsider the information architecture:
- Can the inner tabs become a secondary nav (pills, a sidebar within the panel)?
- Can the outer tabs become a top-level page nav instead?

One level of tabs maximum in the primary content area.

---

## Review Checklist

- [ ] Are there 2–7 tabs, each sharing a common subject or context?
- [ ] Is the tab strip not wrapping to multiple lines on any target viewport?
- [ ] Does tab overflow use scrollable strip or a "More" menu — not wrapping?
- [ ] Is the active tab clearly distinguished by colour and/or indicator?
- [ ] Do hover and focus states meet contrast requirements?
- [ ] Are disabled tabs avoided (showing unavailability inside the panel instead)?
- [ ] Does keyboard navigation follow roving tabindex (←/→ between tabs, Tab into panel)?
- [ ] Is `role="tablist"`, `role="tab"`, `role="tabpanel"`, and `aria-selected` set correctly?
- [ ] Are inactive panels hidden from the accessibility tree (`hidden` attribute)?
- [ ] Is the active tab persisted in the URL (for deep-linkable views) or localStorage?
- [ ] Are nested tabs avoided?

---

## Constituent Domain: button-states

# Button and Interactive Element States

Every interactive component must have a complete, visually distinct state for each interaction mode. Missing or ambiguous states make the UI feel unfinished and reduce user confidence.

## The Six States

| State | Trigger | Visual signal |
|---|---|---|
| **Rest** | Default | Base colour, cursor: pointer |
| **Hover** | Mouse over | Slightly darker, subtle background shift |
| **Active / Pressed** | Mouse down / tap | Noticeably darker, slight scale-down |
| **Focus** | Keyboard navigation | Visible focus ring, no change to fill |
| **Disabled** | Not available | Low contrast, cursor: not-allowed, no interaction |
| **Loading** | Async action in progress | Spinner or pulse, non-interactive |

## Deriving State Colours Algorithmically

State colours are not chosen independently — they are derived from the base colour by adjusting lightness in HSL. This guarantees coherence across the entire palette.

```
base:     hsl(H, S%, L%)
hover:    hsl(H, S%, L% - 8%)    ← darken 8%
active:   hsl(H, S%, L% - 14%)   ← darken 14%
```

### Example: primary button `#635BFF` (hsl 243, 100%, 68%)

```css
.btn-primary {
  background: hsl(243, 100%, 68%);       /* rest    #635BFF */
}
.btn-primary:hover {
  background: hsl(243, 100%, 60%);       /* hover   #4A40FF */
}
.btn-primary:active {
  background: hsl(243, 100%, 54%);       /* active  #3429FF */
}
```

For light buttons on dark backgrounds, invert the logic — lighten on hover instead of darkening.

### Secondary / outlined buttons

```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}
.btn-secondary:hover {
  background: var(--color-grey-100);     /* subtle fill */
  border-color: var(--color-grey-300);
}
.btn-secondary:active {
  background: var(--color-grey-200);
}
```

## Focus State

Focus is a keyboard navigation requirement (WCAG 2.2). It must be visible and must not rely on the hover style alone — keyboard users do not trigger hover.

```css
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}
```

- Use `outline`, not `box-shadow`, for focus rings — `outline` respects `border-radius` in modern browsers and does not affect layout
- `outline-offset: 2–4px` gives the ring breathing room from the component edge
- Never use `outline: none` without a replacement focus style

## Disabled State

```css
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

- Disabled elements are exempt from WCAG contrast requirements — low opacity is correct and intentional
- Use `pointer-events: none` to prevent click events even if JS is bypassed
- Do not change the shape or size of a disabled button — only colour and cursor change

## Loading State

When a button triggers an async action, replace the label with a spinner and prevent re-submission.

```css
.btn--loading {
  pointer-events: none;
  cursor: wait;
  opacity: 0.7;
}
```

- Keep the button width stable during loading — avoid layout shift when label is replaced by spinner
- Return to rest state on completion (success or error)
- For long-running operations, pair with a status message — a spinner alone does not tell the user what is happening

## Scale on Active (Optional)

A subtle scale-down on press adds physical feedback — borrowed from Disney's squash principle.

```css
.btn:active {
  transform: scale(0.97);
  transition: transform 80ms ease-out;
}
```

Keep the scale value between `0.95–0.98`. Below `0.95` feels like the button is breaking.

## Complete Button CSS Reference

```css
.btn {
  cursor: pointer;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-button);
  padding: var(--component-padding-y-md) var(--component-padding-x-md);
  height: var(--component-height-md);
  border: none;
  transition: background 120ms ease-out, transform 80ms ease-out;
}

.btn:hover           { background: var(--color-primary-hover); }
.btn:active          { background: var(--color-primary-active); transform: scale(0.97); }
.btn:focus-visible   { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.btn:disabled        { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
.btn.btn--loading    { opacity: 0.7; cursor: wait; pointer-events: none; }
```

## Review Checklist

- [ ] Does every interactive element have all six states defined?
- [ ] Are hover and active colours derived from the base by lightness adjustment (not chosen arbitrarily)?
- [ ] Is focus state visible and using `outline` (not removed)?
- [ ] Is disabled state low-opacity with `cursor: not-allowed`?
- [ ] Does loading state prevent re-submission?
- [ ] Are transition durations 80–150ms — not instant, not slow?
- [ ] Does `cursor: pointer` appear on all interactive elements at rest?

---

## Constituent Domain: form-design

# Form Design

Forms are where users give the product data. Every unnecessary obstacle between the user and a completed form is a failure. The design goal is to make correct input easy and incorrect input obvious — before the user submits.

---

## The Three Guidance Layers

Each layer serves a distinct purpose. Do not collapse them.

### Layer 1 — Helper Text
Explains *what* to enter. Appears below the input, always visible, in small secondary text.

```
Email address
[                              ]
Use the email you signed up with.
```

- Write in plain language from the user's perspective
- Keep it to one sentence — if you need more, the field is too complex or misnamed
- Do not repeat the label ("Enter your email" below a label that says "Email" is redundant)
- Helper text is not a replacement for a label — the label is still required

### Layer 2 — Placeholder
Shows the *format* or an example value. Appears inside the input, disappears on typing.

```
[jane@example.com              ]
```

- Use a realistic example, not a description: `+358 40 123 4567` not `Enter phone number`
- Never use placeholder as a label — it disappears and leaves the user without context
- Keep it grey (`--color-text-secondary`) and lighter than actual input text
- Optional — not every field needs a placeholder

### Layer 3 — Validation
Confirms whether the input is correct. The most important layer.

```
Email address
[jane@           ] ← invalid
✗ Enter a valid email address.
```

**Validation timing:**
- **On blur** (leaving the field): default for most fields — validates once the user has finished
- **Real-time** (on input): use when the format is complex or the error is likely — password strength, IBAN, VAT number, URL, regex-heavy fields
- **On submit**: catches anything missed, scrolls to the first error

Real-time validation must be forgiving at the start — do not show an error the instant the user starts typing. Show it after a short debounce (300–500ms) or after the first character that makes the input definitively wrong.

---

## Submit Button State

The submit button enables when the form is valid. This is one of the clearest affordance signals in form design — the user sees the goal and knows when they have reached it.

```
[Submit]   ← disabled, low contrast, cursor: not-allowed
           (fields incomplete or invalid)

[Submit]   ← enabled, full colour, cursor: pointer
           (all required fields valid)
```

**Implementation:**
```html
<button type="submit" disabled={!isFormValid}>Submit</button>
```

For long or complex forms where real-time validation is not practical, do not disable the submit — validate on submit and scroll to errors instead. Disabled submit on a long form frustrates users who cannot tell what is missing.

**Loading state on submit:** Replace label with spinner, disable the button. Prevent double-submission.

---

## Field Anatomy

```
[Label]                           [Optional badge if optional]
[Input field                                                  ]
[Helper text — what to enter, format, constraints            ]
[Error message — appears below helper text on validation fail ]
```

```html
<div class="field">
  <label for="vat">VAT number <span class="optional">Optional</span></label>
  <input
    id="vat"
    type="text"
    placeholder="FI12345678"
    aria-describedby="vat-helper vat-error"
    aria-invalid="true"
  >
  <p id="vat-helper" class="helper-text">Finnish VAT numbers start with FI followed by 8 digits.</p>
  <p id="vat-error" class="error-text" role="alert">Enter a valid Finnish VAT number (e.g. FI12345678).</p>
</div>
```

---

## Required vs Optional

Mark the minority. If most fields are required, mark the optional ones. If most are optional, mark the required ones.

- Do not rely on colour alone — add a text label ("Required" or asterisk with legend)
- Place the required/optional indicator in the label, not only in the placeholder or helper text

```html
<label>Email <abbr title="Required">*</abbr></label>
<!-- or -->
<label>Phone <span class="badge">Optional</span></label>
```

---

## Grouping with Fieldset

Related fields belong in a `<fieldset>` with a `<legend>`. This is semantic HTML and helps screen readers announce the group context.

```html
<fieldset>
  <legend>Billing address</legend>
  <label>Street</label><input type="text">
  <label>City</label><input type="text">
  <label>Postal code</label><input type="text">
</fieldset>
```

Use fieldsets for:
- Address groups
- Payment details
- Radio button groups
- Checkbox groups

---

## Input Types

Use the correct `type` — browsers provide free validation, appropriate keyboards, and autofill.

| Data | Input type |
|---|---|
| Email | `type="email"` |
| Phone | `type="tel"` |
| URL | `type="url"` |
| Number | `type="number"` |
| Password | `type="password"` |
| Date | `type="date"` |
| Search | `type="search"` |
| Colour | `type="color"` |

On mobile, `type="email"` shows the email keyboard, `type="tel"` shows the numpad. These are free UX improvements.

---

## Autofill Support

Allow browsers to autofill. Do not disable it unless there is a security requirement.

```html
<input type="text"  autocomplete="name">
<input type="email" autocomplete="email">
<input type="tel"   autocomplete="tel">
<input type="text"  autocomplete="street-address">
<input type="text"  autocomplete="postal-code">
<input type="text"  autocomplete="cc-number">    <!-- credit card -->
<input type="password" autocomplete="new-password">
```

Correct `autocomplete` values reduce friction dramatically for returning users and on mobile.

---

## Review Checklist

- [ ] Every field has a visible label (not just placeholder)
- [ ] Helper text is below the input and explains what to enter
- [ ] Placeholder shows format or example, not a description
- [ ] Validation triggers on blur for simple fields, real-time for complex ones
- [ ] Error message is adjacent to the field that failed
- [ ] Error message is associated via `aria-describedby`
- [ ] Required/optional marked on the minority of fields
- [ ] Submit button is disabled when form is invalid (for short forms)
- [ ] Submit button shows a loading state and prevents re-submission
- [ ] Related fields are grouped in `<fieldset>` with `<legend>`
- [ ] Correct `type` attribute on all inputs
- [ ] `autocomplete` attributes set on address, contact, and payment fields

---

## Constituent Domain: scroll-areas

# Scroll Areas

## Avoid Scroll Areas by Default

Scroll containers inside a layout — panels, drawers, tables, modals with inner overflow — create friction. Users must discover that a region scrolls, manage multiple independent scroll positions simultaneously, and context-switch between scroll areas on the same screen.

**Default: let the page scroll.** A single page-level scroll is universally understood and requires no discovery. Before introducing an inner scroll area, ask whether the layout can be restructured so the page itself handles the overflow.

Alternatives to inner scroll:
- Pagination or load-more for long lists
- Collapsible sections (accordion) for long detail panels
- A separate page or route for content that would otherwise fill a scroll area
- Progressive disclosure — show less by default, expand on demand

## When a Scroll Area Is Justified

Some layouts genuinely require inner scroll:

- **Fixed-height sidebars** with navigation trees longer than the viewport
- **Data tables** where the header must remain visible while rows scroll
- **Chat or log panels** where the stream is continuous and the surrounding layout is fixed
- **Code editors or terminal panes** embedded in a larger application shell

In these cases, proceed — but apply the constraints below.

## One Axis Only

Never create a scroll container that scrolls on both axes simultaneously. Two-axis scroll is disorienting, hard to control precisely, and nearly unusable on touch devices.

```css
/* One axis: vertical */
overflow-y: auto;
overflow-x: hidden;

/* One axis: horizontal (e.g. wide table) */
overflow-x: auto;
overflow-y: hidden;

/* Never */
overflow: auto; /* allows both axes */
```

If content requires both axes — e.g. a wide table inside a constrained panel — restructure the layout so the table's horizontal scroll is the only scroll in the view, with the page itself not scrolling at that point.

## Always User-Controlled

Scroll must never happen automatically without user intent. Specifically:

- **No auto-scrolling** that moves the viewport without the user initiating it
- **No scroll hijacking** — do not intercept the native scroll event to animate or pace it artificially
- **Scroll-to on load** is acceptable only when restoring a previous scroll position (e.g. returning to a list after navigating away)
- **Scroll-to for errors or anchors** is acceptable as a response to a user action (submitting a form with errors, clicking a table-of-contents link)

Exception: chat and log panels may auto-scroll to the bottom on new content, but only if the user is already at the bottom. If the user has scrolled up to read, do not force them back down — show a "new messages" indicator instead.

## Scroll Affordance

Users must be able to tell a region is scrollable before they attempt to scroll it.

- Clip content visually at the edge — a partially visible item signals "there is more"
- Use a subtle scrollbar (not `scrollbar-width: none`) so the track is visible
- On touch, a partial item at the edge is the primary affordance — ensure the container does not have `overflow: hidden` on the trailing edge

## Review Checklist

- [ ] Is every inner scroll area genuinely necessary, or can the layout be restructured to use page scroll?
- [ ] Does every scroll container scroll on one axis only?
- [ ] Is `overflow: auto` (two-axis) avoided on all scroll containers?
- [ ] Is scroll always user-initiated — no hijacking, no forced auto-scroll?
- [ ] Is the scrollable region visually apparent (partial content, visible scrollbar)?
- [ ] On touch devices, is scroll smooth and native (`-webkit-overflow-scrolling: touch` or equivalent)?

---

## Constituent Domain: sticky-and-fixed-elements

# Sticky and Fixed Elements

## position: fixed vs position: sticky

| Property | Behaviour | Use for |
|---|---|---|
| `position: fixed` | Removed from document flow. Always stays at the same viewport position regardless of scroll or parent. | Global navigation header, bottom toolbar, floating action button |
| `position: sticky` | Stays in document flow until it hits its scroll threshold, then locks in place. Returns to flow when parent scrolls past. | Table column headers, section headings in a long list, in-page toolbars within a scroll container |

**Prefer `sticky` over `fixed`** when the element belongs to a specific section or scroll context. Fixed elements sit above everything and affect the entire viewport — use them only for truly global UI.

## Top — Navigation Header

The global navigation header is the most common fixed element. It should:

- Remain visible at all times so the user can always navigate away
- Be as thin as possible to maximise content area — 48–64px is a common range
- Have a background and shadow so content scrolling beneath it does not bleed through
- On scroll, a subtle shadow (`--shadow-sm`) signals that content is behind it

```css
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-header);
}
```

Compensate for the fixed header with matching top padding on the page body:
```css
body { padding-top: var(--header-height); }
```

## Bottom — Toolbar on Mobile

On mobile, the bottom of the screen is the most reachable area with one thumb. A persistent bottom toolbar is the natural home for:

- Primary navigation (bottom tab bar — iOS and Android convention)
- Contextual actions for the current view (edit, share, delete)
- A floating action button (FAB) for the single most important action

Bottom toolbars should:
- Respect the safe area inset on devices with a home indicator: `padding-bottom: env(safe-area-inset-bottom)`
- Be visually separated from content (background fill, top border, or shadow)
- Contain 3–5 items maximum — more than 5 should move to a menu or a different pattern
- Use icons with labels for navigation tabs, or icons alone for contextual toolbars (with tooltips)

On desktop, bottom toolbars are uncommon. Status bars, editor toolbars, and command palettes are the desktop equivalent — these are typically `position: fixed` at the bottom or `position: sticky` within their scroll container.

## Sticky Table Headers

For data tables inside a scroll container, sticky column headers prevent the user from losing track of what each column means.

```css
thead th {
  position: sticky;
  top: 0;
  background: var(--color-surface);
  z-index: 1;
}
```

If the table also has a sticky first column (for row identifiers), the top-left cell needs both `top: 0` and `left: 0`, and a higher `z-index` to sit above both the header row and the sticky column.

## Stacking and Z-index

Sticky and fixed elements create stacking context. Define z-index as named tokens, not arbitrary numbers:

```css
--z-base:       0;
--z-dropdown:   100;
--z-sticky:     200;
--z-header:     300;
--z-modal:      400;
--z-toast:      500;
```

Every fixed or sticky element must declare its z-index explicitly using a token. Avoid ad-hoc values like `z-index: 9999` — they signal an unmanaged stacking context and will eventually conflict.

## How Many Fixed Layers Is Too Many

Each fixed layer removes space from the content area and adds visual complexity. A page should rarely need more than:

- 1 fixed header (top)
- 1 fixed toolbar or bottom nav (bottom, mobile)
- 1 floating action button or contextual overlay

A fixed header + fixed bottom toolbar + floating button + sticky sidebar + sticky table header all simultaneously is too many layers. Consolidate where possible.

## Review Checklist

- [ ] Is `sticky` used for section-scoped elements and `fixed` only for truly global UI?
- [ ] Does the fixed header compensate for its height with body padding?
- [ ] Does the bottom toolbar respect `env(safe-area-inset-bottom)` on mobile?
- [ ] Are all z-index values defined as named tokens, not arbitrary numbers?
- [ ] Is the total number of simultaneous fixed layers minimal — header + one bottom element maximum in most cases?
- [ ] Does content scrolling behind a fixed element not visually bleed through (background + shadow on the fixed element)?

---

## Constituent Domain: component-family-consistency

# Component Family Consistency

Every interactive component in a product — buttons, inputs, selects, checkboxes, radio buttons, pills, badges, tags, calendars, date pickers, sliders, toggles — belongs to the same visual family. They share a common design DNA. A user should be able to look at any component and feel that it belongs to the same product as every other component.

When components are designed in isolation without shared tokens, the product feels assembled from parts rather than built as a whole.

## Reuse Before You Build a New Component

Before creating any component, **audit what already exists** — a new-from-scratch component is another mouth to feed: another entry in the family that must stay consistent (radius, height, states, motion) and another thing to maintain. Building fresh should be the last resort, not the first move. Work down this order:

1. **Is there already a component that does this?** Use it as-is. If it *almost* fits, extend it with a prop or variant rather than cloning it — one flexible `Button` beats `PrimaryButton`, `BigButton`, and `CtaButton` living in parallel.
2. **Is there something close in the codebase you can generalise?** Often a one-off was built inline for a single screen. If a small change would make it generic — lift it into the shared library, parameterise the hard-coded bits (label, colour, size via props/tokens), drop the screen-specific assumptions — do that instead of writing a second near-identical thing.
3. **Only build new when nothing existing fits and nothing can be reasonably generalised** — and when you do, build it *from the shared DNA below* so it joins the family cleanly.

Parallel one-offs — three near-identical buttons, two cards with different radius — are how a design system drifts. Before adding a component, ask: *does this exist, or is it one refactor from existing?*

The inverse also holds: a visual treatment that appears independently in 2–3 places has earned promotion — name it and make it a shared component or token before a fourth copy appears. And when pages from different design eras disagree, migrate old toward new: the newest components are the best evidence of current intent, but confirm before deprecating a style — see [`generate-ui-from-brand`](../generate-ui-from-brand/SKILL.md) for the consolidation pass.

> **Find the inconsistency automatically (dembrandt engine, optional).** Spotting where a live product has already diverged — five near-identical button radii, three greys that should be one — is tedious by eye. `get_findings` runs a design-system lint over a real extraction and reports consistency and duplication issues to consolidate. (And `compute_drift` scores how far two extractions have drifted apart — e.g. this product vs. its reference, or before vs. after a cleanup.) Use them to audit an existing product before deciding what to reuse. See [`extract-design`](../extract-design/SKILL.md).

## The Shared DNA

Define these tokens once. Every component inherits from them.

### Border-Radius
All interactive components use the same base radius token. Variations are derived, not invented.

```css
--radius-base:    8px;   /* buttons, inputs, selects */
--radius-sm:      4px;   /* checkboxes, small badges */
--radius-lg:      12px;  /* cards, modals, large panels */
--radius-full:    9999px; /* pills, tags, avatar chips */
```

A button and an input on the same form must have the same radius. A pill is always `--radius-full`. A badge is `--radius-sm` or `--radius-full` depending on brand tone — but consistent across all badges.

**Nested corners are concentric.** When one rounded box sits inside another, the outer radius equals the inner radius plus the gap between them. A card with `12px` padding around an `8px` button needs `20px`, not `12px`. Get this wrong and the corners run at different curvatures a few pixels apart — nobody names it, everybody sees it.

```css
.card {
  padding: var(--space-3);                                    /* 12px */
  border-radius: calc(var(--radius-base) + var(--space-3));   /* 8 + 12 = 20px */
}
```

Derive it with `calc()` rather than hardcoding the sum, so the corner stays correct when either token moves.

### Border Style

Borders across all form components and containers should use a highly restricted set of tokens.

**The 2-Step Rule:** Limit border widths to at most two options (e.g., `1px` and `4px`, or `1px` and `8px`). Do not use an incremental scale like `1px, 2px, 3px, 4px...`. A limited choice makes the hierarchy clear and the product feel intentional.

```css
--border-width-thin:   1px;   /* Default for inputs, cards, dividers */
--border-width-thick:  4px;   /* Featured items, bold accents, active indicators */

--border-color:        var(--color-border);
--border-color-focus:  var(--color-primary);
--border-color-error:  var(--color-error);
```

An input border and a select border are identical at rest. Focus state uses `--border-color-focus` everywhere. Error state uses `--border-color-error` everywhere.

### Spacing and Height
Components at the same visual scale share height and internal padding.

```css
/* Default (md) size */
--component-height-md:    2.5rem;    /* 40px */
--component-padding-x-md: 0.75rem;   /* 12px */
--component-padding-y-md: 0.5rem;    /* 8px  */

/* Small */
--component-height-sm:    2rem;      /* 32px */
--component-padding-x-sm: 0.5rem;    /* 8px  */
--component-padding-y-sm: 0.375rem;  /* 6px  */

/* Large */
--component-height-lg:    3rem;      /* 48px */
--component-padding-x-lg: 1rem;      /* 16px */
--component-padding-y-lg: 0.625rem;  /* 10px */
```

Heights and text padding are in rem so a control still contains its label when the user enlarges text; borders and shadows stay in px. See [[sizing-units]].

A button and an input placed next to each other must be the same height. This is not cosmetic — mismatched heights break form layouts and signal disorder.

**Set the height, do not derive it.** A control sized only by padding has a height of line-height + padding + border, so two controls in one row drift apart whenever any of those three differ:

- an outlined variant beside a borderless one is 2px taller,
- a fluid or clamped font size changes the line box at some viewports and not others,
- an item whose content is an avatar or icon rather than text has a different intrinsic height.

Give every control on a line the same explicit height and centre its content. Set it as `min-height`, so the shape holds at rest and yields rather than clips when the content is larger than you planned. With `box-sizing: border-box` — the default in Tailwind and most resets — the border is absorbed into that height rather than added to it, so outlined and ghost variants match exactly and a variant can gain or lose its border without moving anything.

**A derived height is also a defect you cannot search for.** An explicit height is one token you can grep and diff. A derived one is an emergent property of three separate declarations, so a row can be wrong in one control out of eight and no query finds it: in utility-class codebases the same padding appears in different orders (`rounded-md px-3 py-2` and `rounded-md border transition-colors px-3 py-2`), and a find-and-replace fixes some of them and silently skips the rest. Each miss is 2px, invisible on its own, and the reason the row still looks broken after you "fixed" it.

#### The One Way: One Class Owns the Row

Repeating the same values across siblings is how the row drifts, because every later edit has to find every copy. Declare them once instead. Every item in a row uses one shared class; that class owns the box, the content slot, and every state; an instance may set colour and nothing else.

```css
.control {
  box-sizing: border-box;
  height: var(--control-h);            /* set, never derived */
  display: inline-flex;
  align-items: center;
  gap: var(--control-gap);
  padding-inline: var(--control-px);   /* including its responsive steps */
  border: 1px solid transparent;       /* borderless variants keep the border, transparent */
  border-radius: var(--radius-base);
  font-size: var(--control-font);      /* declared here, not on the label inside */
  cursor: pointer;                     /* browsers give `button` cursor: default */
}

/* Opt-in, not `.control > *`: a descendant selector reaches icons that set
   their own dimensions and stretches them. One content slot for every child
   that carries content: avatar, label, icon, count. Equal boxes do
   not make an equal row, and a control holding an avatar next to one holding a
   text line looks uneven precisely when both measure identical. Standardising
   the slot is not drawing everything at one size: inside a 20px slot an icon
   can be 16px and a chevron 12px and the row still reads level. */
.control-slot { height: var(--control-slot); display: inline-flex; align-items: center; }

.control:hover { /* one definition for the whole family */ }
```

Three rules keep it true:

1. **Nothing in the row sets height, padding, font size, radius or a state on itself.** If one control needs something the class lacks, add a variant to the class.
2. **A variant may change colour and nothing else.** The moment a variant touches the box, it is a second class pretending to be one.
3. **States are edited on the class, never on one instance.** This is the regression that actually happens: the boxes are built correct, then months later one sibling gets a new hover, a new focus ring or a new transition and the row splits. A single row of eight controls has one box edit and dozens of state edits over its life, so the state rule is the one that pays.

### An icon's mass is not centred in its box

`align-items: center` centres the icon's **box**. The drawn shape inside that box usually is not centred in it, so an icon that measures level reads low or high beside its label. A star loads its head; a download arrow loads its base. Give each icon its own offset, and do not share one nudge across a set: the correction differs per shape, and a shared value necessarily overshoots one icon and undershoots another. Two commits pushing the same row in opposite directions is the signature of a shared constant, not of one of them being wrong.

Measure it instead of nudging until it looks right. Rasterise the glyph, take the centroid of the alpha channel, and compare it to the centre of the box it will be centred in:

```py
from PIL import Image
a = Image.open("icon.png").convert("RGBA").split()[3]     # alpha = ink coverage
px, w, h = a.load(), *a.size
tot = sum(px[x, y] for y in range(h) for x in range(w))
cy  = sum(px[x, y] * y for y in range(h) for x in range(w)) / tot
offset_px = (h / 2 - cy) / (h / RENDER_PX)                # negative: lift the icon
```

Bake the result into the markup as a per-icon offset, name the measurement in a comment, and re-measure when an icon is swapped. Two things that sound right and are not:

- **Blurring first rarely changes the answer.** Approximating how the eye integrates mass is a reasonable instinct, but on compact solid glyphs a Gaussian blur moves the centroid by hundredths of a pixel. It earns its place only on shapes with thin extensions, which weight a bounding box without weighting the eye.
- **Colour does not move the centroid.** On a single-colour glyph, luminance scales every pixel by the same constant and the centre of mass is unchanged. Colour changes how heavy the icon reads next to the text, which is a size and weight decision, not an alignment one.

The same reasoning applies to a lone letter used as a mark, where the offset follows the letterform's mass and legitimately differs in sign between two letters.

**The cursor belongs to the class too.** `<button>` renders with `cursor: default` in every browser, and a framework reset does not necessarily fix it: Tailwind v4's preflight does not. The cursor is the cheapest affordance a pointer user gets and the one that reads before any hover colour arrives, so a control that looks clickable and keeps the arrow reads as inert. It survives review precisely because the hover state usually is implemented and only the cursor is wrong. Verify rather than assume, since preflight contents change between majors: `grep -n "cursor" node_modules/tailwindcss/preflight.css`. An element made interactive without a native tag (`<div role="button">`) needs the cursor, a focus style and key handling; the cursor alone is the shallowest part of that.

For a group that wraps several controls in one shared surface (a balance beside an avatar, a segmented control, an input with an attached button) pin the height on the wrapper and set it on the children too. Stretching alone is a layout side effect that a later `align-items` change or an absolutely positioned child quietly removes.

**Introducing the class is the dangerous step, and it fails in two specific ways.** Both are silent in review and obvious on screen:

*It must lose to the utilities it now sits beside.* In a utility-first codebase every instance still carries colour classes, and a plain stylesheet loaded after the framework outranks them. Put the class in the framework's component layer (`@layer components`, or the equivalent `@layer` ordering), and write longhands, never shorthands: one `border: 1px solid transparent` repaints every button's border colour back to transparent, because the shorthand resets `border-color` that a utility had set. The same trap applies to `background`, `padding`, `font` and `transition`.

*It must consume the existing tokens, not restate their values.* Copying `8px` out of the old markup as a literal forks the token: the row is correct today and stops following the design system the next time the token moves. Reference `var(--radius-md)`, `var(--control-h)` and so on, and if the value you need has no token, add one.

After introducing it, re-measure. The class can be correct and still land wrong, and the measurement takes seconds.

**Measure; do not reason.** A wrong box, a right box with the wrong content mass, and a right row spoiled by a surface treatment all look like "the heights are off", so guessing between them fixes the wrong thing. Render the row against the app's real compiled stylesheet in a headless browser, at two viewport widths, and read every control:

```js
[...document.querySelectorAll('[data-control]')].map(el => {
  const r = el.getBoundingClientRect(), c = getComputedStyle(el);
  return { h: r.height, top: r.top, fontSize: c.fontSize, padLeft: c.paddingLeft };
});
```

Equal `height` proves the boxes match; equal `top` proves they share a baseline; differing `fontSize` or `padLeft` is the paradigm mismatch, as a number rather than an argument.

**Check every shell that builds the row.** The same toolbar is usually assembled in several places, and the one on screen may not be the one you opened. A fix that changes nothing visible means you edited the wrong file, not that the fix was wrong.

#### Grouping Non-Buttons Beside a Button Row

A toolbar often has to carry items that are not buttons: a balance, a status, an avatar, a count. Dropped loose into a row of buttons they read as broken buttons. The fix is common region (see [[gestalt-ui-organisation]]) — one surface that says "these belong together and are not the same thing as those" — and the surface, not the item, carries the grouping.

Ways to draw that region, quietest first:

| Treatment | Reads as | Use when |
|---|---|---|
| Background tint (2–8% neutral) | A resting surface | Default. Quiet enough to sit beside outlined buttons without competing |
| Border | A container | The row already has borderless buttons, so a border still distinguishes |
| Inner shadow | Recessed, a well | The group is an input-like or display region rather than a set of actions |
| Gradient | Raised and physical | Rarely. It re-adds the button affordance you were trying to remove |

Whichever you choose:

- **Match the buttons' `border-radius` exactly.** A different radius beside them reads as a foreign element, not a sibling.
- **Match the height.** Same rule as above; the group is one control's worth of vertical space.
- **Pick one treatment.** Tint plus border plus inner shadow is three ways of saying the same thing, and at toolbar scale the element cannot absorb the weight (see Small Component Restraint).
- **Keep the children plain.** No fills, no borders of their own — the region already grouped them. Their only state is hover, slightly stronger than the resting surface.
- **Do not let a child's hover redraw the group.** Give the wrapper its own border and divider colours, static ones. If members reuse the standalone button style, hovering a single segment restyles the whole unit's outline, and the group appears to twitch.
- **One icon per group, not one per segment.** Three segments each carrying the same download icon is the icon repeated three times, not three labelled choices. Show it only where the label cannot fit, e.g. at narrow widths.

**Direction carries the meaning.** Raised and recessed are the same two effects pointed opposite ways, and they make opposite promises — pressable versus readable. A recessed surface needs all three parts: the gradient running dark to light *downward*, the inset shadow on the *top* edge, and a light hairline on the *bottom* edge to close the well. Skip the last and the top shadow reads as grime rather than depth. Flip the first two and you have rebuilt the lit-from-above button you were trying not to be.

```css
/* Recessed: a readout. */
background-image: linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02));
box-shadow: inset 0 1px 2px rgba(0,0,0,0.07), inset 0 -1px 0 rgba(255,255,255,0.6);
```

Tune both themes separately — the same alpha values that read as a subtle well on light read as flat or as a smear on dark.

### Shadow
Interactive components use a consistent shadow logic:

- At rest: no shadow, or `--shadow-xs` for floating components (select dropdown trigger)
- On focus: focus ring via `outline`, not `box-shadow` (unless using `box-shadow` as the focus ring consistently)
- Elevated (dropdowns, popovers opening from components): `--shadow-md`

### Colour Logic
The same colour roles apply uniformly across all components:

| State | Colour token |
|---|---|
| Rest border | `--color-border` |
| Focus border / ring | `--color-primary` |
| Error border | `--color-error` |
| Disabled | `--color-text-secondary` at reduced opacity |
| Selected / active fill | `--color-primary` |
| Hover background | `--color-primary` at 8–12% opacity |

### One Interaction Language
The colour table above defines *what* each state looks like; this rule governs *how many* interaction patterns a product is allowed to have. **Pick one and reuse it — don't run 3–4 different hover/active/interaction patterns within the same product.**

The user already knows what site they're on. Variety *between* products is expected; variety *within* one is taxing — every new pattern is another thing to learn mid-task. So converge:

- **One hover response.** If interactive elements lift on hover, they all lift; if they shift background tint, they all shift tint. Don't mix lift, underline, colour-swap, and scale across sibling components.
- **One active/pressed response,** one focus ring, one selected treatment — applied identically everywhere (this is why the colour roles above are shared tokens, not per-component choices).
- **One motion signature** — the same easing and duration for the same *kind* of transition, so hovers, reveals, and toggles feel like one hand made them (see `micro-interactions`).

A tight, repeated interaction vocabulary is what makes a product feel learnable: the user learns the pattern once and trusts it everywhere.

## Component Family Members

| Component | Shares radius | Shares height | Shares border | Shares colour logic |
|---|---|---|---|---|
| Button | ✓ | ✓ | — (filled) | ✓ |
| Input / textarea | ✓ | ✓ | ✓ | ✓ |
| Select | ✓ | ✓ | ✓ | ✓ |
| Checkbox | `--radius-sm` | — | ✓ | ✓ |
| Radio | `--radius-full` | — | ✓ | ✓ |
| Toggle / switch | `--radius-full` | ✓ | — | ✓ |
| Pill / tag | `--radius-full` | ✓ | ✓ optional | ✓ |
| Badge | `--radius-sm` or `--radius-full` | — | — | ✓ |
| Date picker / calendar | `--radius-base` | ✓ | ✓ | ✓ |
| Slider | `--radius-full` (track + thumb) | — | — | ✓ |
| Search input | ✓ | ✓ | ✓ | ✓ |
| Combobox | ✓ | ✓ | ✓ | ✓ |

## Family Resemblance, Distinct Roles

Shared DNA makes components look *related* — it must not make them look *interchangeable*. The riskiest pairs are the ones that share the most: a pill-shaped button next to a pill-shaped badge, a bordered button next to a bordered input. When they blur, users click badges that do nothing and skip buttons that looked like labels.

The rule: **role must be readable before interaction.** From appearance alone, the user can tell what is clickable, what is editable, and what is read-only.

- **Button** — clickable: solid fill or a firm border, `cursor: pointer`, a hover response.
- **Badge / tag** — read-only: muted fill, smaller type, **no hover response and no pointer cursor, ever** — those two signals are reserved for interactive elements and are exactly what separates a badge from a button of the same shape.
- **Input** — editable: border with an empty interior, placeholder, text cursor.

Distinguish through at least two visual channels (fill + size, border + cursor) — never by colour alone. Squint test: with labels unreadable, can you still sort the buttons from the badges from the inputs? If not, the family has collapsed into one component.

## Semantic Chip Components

Generic `Badge` components lead to misuse — the same component ends up used for statuses, code tokens, keyboard shortcuts, and categorical labels, with style overrides scattered across the codebase.

**The pattern: one component per meaning, not one component with many variants.**

A product's inline labels typically fall into a small set of distinct meanings. Define a component for each one. Common examples:

| Component | Meaning | Shape |
|---|---|---|
| `Tag` | Categorical label, status, filter | Pill (`rounded-full`) |
| `Code` | Inline literal, path, key | `<code>`, mono, tight radius |
| `Kbd` | Keyboard shortcut | `<kbd>`, mono, tight radius |
| `Metric` | Measured value (`1.2s`, `42px`) | Mono, tight radius |

Add product-specific types as needed (e.g. `Flag` for CLI products, `Token` for API products). Each new type gets its own component — not a new `variant` prop on an existing one.

Each component encodes exactly one meaning. Appearance follows from it — callers never pass colour or shape props.

**Sizing:** use `em`-relative padding so a chip renders at the right size for whatever text context it sits in (heading, body, caption) without per-context overrides.

```tsx
const BASE = "inline-flex items-center align-middle whitespace-nowrap border leading-none";
const PILL = "text-[0.85em] px-[0.6em] py-[0.25em] rounded-full font-medium";
const CHIP = "text-[0.85em] px-[0.5em] py-[0.2em] rounded-[0.4em] font-mono";

export function Tag({ children }: { children: ReactNode }) {
  return <span className={`chip-tag ${BASE} ${PILL}`}>{children}</span>;
}
export function Code({ children }: { children: ReactNode }) {
  return <code className={`chip-code ${BASE} ${CHIP}`}>{children}</code>;
}
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className={`chip-kbd ${BASE} ${CHIP}`}>{children}</kbd>;
}
```

**Colour:** keep per-semantic colours in CSS classes (`chip-tag`, `chip-code`, etc.) in one file. Do not inline colour props. This keeps light/dark mode in one place and lets you audit the full chip palette at a glance.

```css
.chip-tag, .chip-code, .chip-kbd, .chip-metric {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.09);
  color: var(--text-secondary);
}
.chip-tag { color: var(--text-primary); }
```

**Back-compat:** if existing call sites use a generic `Badge`, re-export the most common semantic variant as the default so old imports keep working without a migration.

---

## Alignment on a Line

When a line mixes element types — label, badge, status dot, value, icon — they must read as one aligned row, not a jumble of differently-sized pieces.

- **Same type size on the line.** Text next to a badge or chip shares the surrounding typeface size; a badge must not silently shrink or enlarge its row. Use `leading-none` and `align-middle` (as in the chip `BASE` above) so every element sits on a shared centre line.
- **Centre status indicators.** A traffic-light dot (red/amber/green) is **vertically centred against the text it annotates** — aligned to the label's cap-height centre, not the baseline.
- **One optical centre line.** If badges, text, and icons jump up and down, the row reads as broken even when each piece is fine alone.

## Small Component Restraint

The smaller the component, the less it can carry. Restraint that looks plain at large sizes is what keeps small components legible.

- **Avoid multi-border / boxed-in containers.** Don't stack bordered layers (a bordered chip inside a bordered cell inside a bordered card) — a small element can't absorb the weight. Prefer one border or none; use fill or spacing instead. The small-scale companion to the 2-Step border rule.
- **At most one icon.** Two or three icons in a pill, badge, or row create clutter and ambiguity about which is actionable. If you need more, the component has outgrown its size — promote it to a larger pattern.
- **Multi-card-container design → pivot.** Card-in-card-in-card nesting solves grouping with boxes instead of spacing and hierarchy. Flatten it, group with whitespace and headings (see [[gestalt-ui-organisation]]), and keep the card metaphor for the outermost meaningful container only.

If the brand uses gradients, apply them consistently:

- A gradient on a primary button should use the same gradient angle and stops as gradient usage elsewhere in the product
- Hover state: slightly shift the gradient lightness, not the hue
- Do not use gradients on some button variants and flat colour on others — pick one approach per variant and apply it universally

## Review Checklist

- [ ] Do buttons and inputs on the same form share the same height?
- [ ] Is that height set explicitly rather than left to add up from padding, line-height and border?
- [ ] Do all controls in a row come from one shared class, rather than repeating the same values?
- [ ] Does that class sit in the component layer and use longhand properties, so instance utilities still win?
- [ ] Does it reference the existing radius, height and spacing tokens rather than copying their values?
- [ ] Does every child of a control (avatar, label, icon) sit in the same content slot height?
- [ ] Is every state defined on that class, so a new hover or focus ring cannot land on one sibling only?
- [ ] Were the heights measured with the real stylesheet at more than one viewport, rather than reasoned about?
- [ ] Do all bordered components use at most two border-width options (e.g., 1px and 4px)?
- [ ] Does focus state look identical across all focusable components?
- [ ] Does error state look identical across all components that can have errors?
- [ ] Is there a single interaction language — one hover response, one active/pressed response, one focus ring, one motion signature — reused across the product, rather than 3–4 competing patterns?
- [ ] Are all radius values derived from the same base token — not set independently per component?
- [ ] Do pills and tags use `--radius-full` consistently?
- [ ] Can a button, badge, and input be told apart from appearance alone (squint test) — with non-interactive elements carrying no hover response or pointer cursor?
- [ ] Is gradient usage (if any) consistent across all button variants?
- [ ] Before building a new component, was the existing library (and codebase) checked for one that fits as-is, or a one-off that could be generalised with a small change, rather than cloning?
- [ ] Could a new component be added to the library using only existing tokens?
- [ ] Are inline labels, statuses, code tokens, keyboard hints, and metrics separate components — not variants of a generic Badge?
- [ ] Do chip/badge components use `em`-relative sizing so they scale with their text context?
- [ ] Is chip colour defined in CSS classes (not inline props) so light/dark lives in one place?
- [ ] On rows mixing text, badges, and icons, does everything share one type size and centre line?
- [ ] Are status/traffic-light indicators vertically centred against their label?
- [ ] Do small components avoid stacked/nested borders (boxed-in look)?
- [ ] Do small components carry at most one icon?
- [ ] Has card-in-card-in-card nesting been flattened in favour of spacing and hierarchy?

---

## Constituent Domain: repeated-component-alignment

# Repeated Component Alignment

When a component is rendered many times — a card grid, a list, a table, a nav menu, a row of KPI tiles, a feed — it stops being a single box and becomes a **pattern**. The value of a pattern is rhythm: the eye learns the layout once and scans the same slot across every instance (the title row, the price row, the action row). Variable content length breaks that rhythm unless the component is built to absorb it.

The principle is general. A **card** is the most common case, but the same rule governs list rows, table cells, nav items, tiles, comment entries, dashboard widgets, search results — anything repeated. Treat each as a **fixed slot model**, not a free-form container.

The goal: **content of any length, instances that look identical.** This is partly content production (write to a target length) and partly layout engineering (build slots that tolerate the variance). This skill covers the layout half and where the two meet.

---

## The Slot Model

Name the slots once and treat them as a contract every instance honours. A product card, as a worked example:

```
┌──────────────────────┐
│ [media]              │  ← fixed aspect ratio
│                      │
├──────────────────────┤
│ ● Badge              │  ← optional slot, space reserved
│ Title                │  ← clamp to N lines
│ Subtitle / meta      │
│                      │
│ Description text…    │  ← flexible slot, grows
│                      │
├──────────────────────┤
│ €19.99      Read more│  ← anchor, pinned to bottom
└──────────────────────┘
```

The same three rules apply to a **list row** (avatar · name · meta · status pinned right), a **KPI tile** (label · big number · trend pinned bottom), or a **search result** (title · url · snippet clamped):

- **Every slot has a fixed position**, whether or not it has content in a given instance.
- **One slot absorbs the variance** (usually the description/snippet). All others are fixed or clamped.
- **Anchor elements are pinned** — the primary action or value (CTA, price, status, trend) sits at the same position in every instance regardless of how much content is above or beside it.

---

## Aligning the Anchor

The single most common defect: text of different lengths makes the anchor element (a "Read more" link, a price, a status chip) float to a different position in each instance. Fix it by letting the flexible slot grow and pushing the anchor to a fixed edge.

**Vertical layout (cards, tiles) — pin the footer to the bottom:**

```css
.item {
  display: flex;
  flex-direction: column;
  height: 100%;            /* fill the grid/flex track */
}

.item__media {
  aspect-ratio: 4 / 3;     /* never let media height vary */
  object-fit: cover;
}

.item__description {
  flex: 1;                 /* the flexible slot absorbs the slack */
}

.item__footer {
  margin-top: auto;        /* pin the anchor (price + CTA) to the bottom */
}
```

For instances to be **equal height as siblings**, the container track must stretch them — CSS Grid and Flex do this by default (`align-items: stretch`). Then `height: 100%` makes each instance fill its track, and `margin-top: auto` aligns every footer.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
  /* align-items: stretch is the default — do not override it */
}
```

**Horizontal layout (list rows, table cells) — pin the anchor to the right:**

```css
.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.row__title {
  flex: 1;                 /* title absorbs the width variance */
  min-width: 0;            /* REQUIRED for the title to be allowed to shrink/ellipsis */
}
.row__status {
  margin-left: auto;       /* status pinned to the right edge */
}
```

Do **not** force equal size with a hard-coded `height` — the tallest natural instance sets the size, and content beyond it clips or overflows. Let the track stretch and pin the anchor.

---

## Reserve Space for Optional Slots

A slot that appears in some instances and not others — a badge, a discount label, a "verified" tick — shifts everything after it on the instances that have it, breaking alignment. Two fixes:

1. **Reserve the slot** — always render the container at a fixed size, empty when there is no content:

```css
.item__badge-row {
  min-height: 24px;        /* always occupies the row */
}
```

2. **Overlay the slot** — position it absolutely so it never participates in the flow:

```css
.item__badge {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
}
```

Reserve when the element is inline metadata; overlay when it is a marker on media (Sale, New). Either way, the slot after it must start at the same position in every instance.

---

## Clamp Overflowing Text — and Give the Full Value Back

When a slot must be fixed-size but its content varies, clamp it to a line count and signal the cut with an ellipsis. This keeps the geometry stable. **But truncation hides information — always make the full value recoverable.**

**Multi-line text — clamp to N lines:**

```css
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Single-line values (names, SKUs, paths) — ellipsis:**

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;            /* needed inside a flex row to allow shrinking */
}
```

**Recover the full value.** A clamped or ellipsised string is a usability trap if the full text is unreachable. Provide it:

- **Native tooltip** for plain text: `<span title="Full value here">…</span>`. Zero cost, works everywhere, but hover-only (not touch) and unstyled.
- **Custom tooltip** when you need touch support, styling, or rich content.
- **Reveal in place** when the full content is the point — a "Read more" toggle that expands the instance or opens a detail view, rather than permanently hiding text the user needs.

> Only attach a tooltip when text is *actually* truncated — a `title` on a string that fits adds a redundant hover. Detect overflow (`scrollWidth > clientWidth`) and set `title` conditionally.

**The hierarchy of handling variable length:**

1. **Write to length** — the cleanest fix. Give content authors a target (e.g. titles ≤ 60 chars, snippets ≤ 120) so most values never need truncating. Layout tricks are a safety net, not the primary plan.
2. **Clamp + recover** — when authored length cannot be guaranteed (user-generated, third-party feeds, i18n expansion).
3. **Let one slot grow** — for the single slot allowed to vary, absorb the variance with flex rather than truncating, and pin everything after it.

---

## Internationalisation Note

Text expands when translated — German and Finnish commonly run 30–40% longer than English. A component that aligns perfectly in English can break in another locale. Design slots for the long case: clamp text, reserve optional slots, give flex rows `min-width: 0`, and never assume a label fits on one line because it does in the source language.

---

## Review Checklist

- [ ] Is the repeated component a defined slot model — every instance fills the same slots in the same order?
- [ ] Are sibling instances equal size via a stretched grid/flex track, not a hard-coded height?
- [ ] Is the anchor (CTA / price / status / value) pinned — `margin-top: auto` for columns, `margin-left: auto` for rows — so it aligns across instances?
- [ ] Does exactly one slot absorb length variance, with the rest fixed or clamped?
- [ ] Do optional slots (badge, label) reserve space or overlay, so they never shift the slots after them?
- [ ] Does media use a fixed `aspect-ratio` so its size never varies?
- [ ] Are multi-line slots clamped to a line count and single-line values ellipsised?
- [ ] Do flex rows that truncate have `min-width: 0` so the text is allowed to shrink?
- [ ] Is the full value recoverable (title/tooltip/reveal) wherever text is truncated?
- [ ] Is the tooltip applied only when the text actually overflows?
- [ ] Do content authors have target lengths, so truncation is a safety net rather than the norm?
- [ ] Have slots been checked against the longest-translating locale, not just the source language?

---

## Constituent Domain: coordinated-data-views

# Coordinated Data Views

Some data has more than one natural representation. A set of locations has both a map and a list. A dependency network has both a diagram and a node table. A dataset has both a chart and a raw table. When both representations are genuinely useful for different tasks, show them simultaneously and keep them synchronized — this is called a coordinated view.

The core rule: **any selection or highlight made in one view is immediately reflected in the other.**

---

## When to Use Coordinated Views

Use coordinated views when:

1. The two representations serve different tasks — the table is for finding/scanning; the visual view is for understanding arrangement or relationships
2. Users will frequently move between the two — not just glance at one occasionally
3. The dataset is large enough that the visual view alone doesn't identify individual items, and the table alone doesn't communicate how they relate

Do not add a coordinated view purely for visual richness. If users only ever look at the table and ignore the visual view, it adds complexity without benefit.

---

## The Synchronized Selection Model

Selection state is owned by a single shared store, not by either view. Both views read from and write to the same state.

```
Table row clicked → shared highlight state updated → both views re-render

Visual element clicked → shared highlight state updated → both views re-render
```

**What synchronization covers:**

| Interaction | Effect in table | Effect in visual view |
|---|---|---|
| Click row | Row highlights | Corresponding element highlighted |
| Click visual element | Corresponding row highlighted, scrolled into view | Element highlighted |
| Hover row | Subtle row highlight | Subtle element highlight |
| Hover visual element | Subtle row highlight | Subtle element highlight |
| Clear selection | Row returns to default | Element returns to default |

**Scroll-into-view:** When a visual element is clicked, the table must scroll to bring the corresponding row into view. A row that is highlighted but off-screen is useless.

---

## Consistent Colour Coding

Colour meaning must be identical in both views. If a category is orange in the table badge, it is orange in the visual view. Never use different colour assignments for the same data in different representations.

Define colours centrally:

```ts
const CATEGORY_COLORS = {
  groupA: 'hsl(24, 80%, 55%)',
  groupB: 'hsl(210, 70%, 55%)',
  groupC: 'hsl(145, 60%, 45%)',
} as const;
```

Both the table cell renderer and the visual element renderer import from the same source.

A shared legend appears once in the layout — not duplicated in each view.

---

## Layout

The split between views depends on which is primary:

**Table-primary (exploration, data management):** Table takes 60–70% of the width; visual view is a companion panel on the right or bottom.

**Visual-primary (understanding arrangement and relationships):** Visual view takes 60–70%; table is a supporting panel.

**Equal weight:** A 50/50 split with a draggable divider. Persist the user's preferred split.

```
┌─────────────────────┬────────────────┐
│                     │                │
│   Table (primary)   │  Visual view   │
│                     │                │
└─────────────────────┴────────────────┘
```

On mobile, show one view at a time with a tab or toggle to switch. Do not attempt to show both on a small screen.

---

## Visual View Controls

Controls that affect only the visual representation belong in the visual view panel, not in the table area.

Common visual-specific controls:
- **Zoom / pan** — navigation (usually handled by the rendering library)
- **Layer opacity** — reveal overlapping regions on a dense map or diagram
- **Layer toggle** — show/hide categories or types
- **Reset view** — fit all elements into view; extent reset for maps

These controls do not affect the table. Do not put them in the table toolbar.

Controls that affect the shared data (filters, time range, category selection) belong outside both views, above or beside the layout, since they affect what appears in both.

---

## Highlighting vs. Selection

These are distinct states:

**Highlight (hover):** Transient, shown while the pointer is over an element. Does not persist. Both views show a subtle version (e.g. 50% opacity overlay, or a faint row background). No interaction required to clear it — moving the pointer clears it.

**Selection (click):** Persistent until explicitly cleared. Both views show a strong, unambiguous visual (e.g. bright border, saturated colour, selected row background). Cleared by clicking elsewhere or pressing Escape.

Do not conflate these. A hover highlight that persists after the pointer leaves is confusing.

---

## Performance Considerations

Coordinated views can trigger expensive re-renders if not carefully managed.

- Debounce hover highlights — do not update on every pointer-move event, only when the target element changes
- Use stable identity for items (a consistent ID) so React (or equivalent) can reconcile without re-creating elements
- For large datasets (1000+ items), virtualize the table regardless of the visual view
- For canvas- or WebGL-rendered views, avoid re-creating elements on each highlight — update style properties on the existing ones instead

---

## Review Checklist

- [ ] Is selection state shared between views via a single store — not duplicated?
- [ ] Does clicking a row highlight the corresponding visual element, and vice versa?
- [ ] Does clicking a visual element scroll the table to the corresponding row?
- [ ] Are colour assignments identical in both views, defined from a single source?
- [ ] Is the shared legend shown once, not duplicated per view?
- [ ] Are visual-specific controls (zoom, transparency, layer toggle) in the visual panel, not the table?
- [ ] Are hover highlight and click selection visually distinct states?
- [ ] On mobile, is there a clear way to switch between views?
- [ ] Are hover events debounced to avoid unnecessary re-renders?

---

## Constituent Domain: data-display-and-selection

# Data Display and Selection

Complex data collections — products, files, users, orders, tasks — have no single correct view. Different tasks call for different views. Browsing benefits from grid; comparing details benefits from list or table; bulk management benefits from a dense table with mass actions. Give users the choice.

---

## View Modes

Offer multiple views when the data has both visual and detailed dimensions.

| View | Best for | When to default |
|---|---|---|
| **Grid** | Visual items: products, images, files, cards | When items are visually distinct and browsing is the primary task |
| **List** | Moderate detail: tasks, emails, articles | When a key piece of text or metadata drives selection |
| **Table** | Dense data: orders, reports, user management | When multiple columns of data must be compared |

**View toggle placement:** top-right of the collection, adjacent to sort/filter controls. Use icon buttons with tooltips (`grid`, `list`, `table`). Persist the user's choice in localStorage.

```
[Filter ▾]  [Sort ▾]          [⊞ Grid]  [☰ List]  [⊟ Table]
```

On mobile, collapse to the view that works best for the content — grid for visual items, list for text. Do not offer a view toggle on small screens unless both views are genuinely usable.

---

## Selection: Prefer Large Hit Areas

Checkboxes are small targets. Requiring users to hit a 16×16px checkbox to select a row is unnecessary friction — especially on touch devices.

**Default: the entire row or card is the selection target.**

- Click anywhere on the row → selects the row (background shifts, checkbox checks)
- The checkbox is a visual indicator of selection state, not the only way to select
- Keyboard: Space selects the focused row; Shift+click extends selection; Ctrl/Cmd+click toggles individual items

```css
.row {
  cursor: pointer;
  background: var(--color-surface);
  transition: background 100ms ease-out;
}
.row:hover {
  background: var(--color-grey-50);
}
.row.selected {
  background: var(--color-primary-subtle); /* subtle brand tint */
}
```

For cards in a grid, the entire card is the selection area — not just a checkbox in the corner.

---

## Selected State Visual Language

Selected items communicate their state through a background colour shift — not just a checkbox tick.

**Background:** `--color-primary-subtle` — the brand primary colour heavily desaturated and lightened to ~5–8% opacity. Perceptible but not jarring.

**Left border accent (optional):** A 3px left border in `--color-primary` reinforces the selected state for list and table rows.

**Checkbox:** Checked and filled with `--color-primary`. The checkbox is a secondary signal, not the primary one.

```css
.row.selected {
  background: var(--color-primary-subtle);    /* e.g. hsl(224, 21%, 94%) */
  border-left: 3px solid var(--color-primary);
}
```

**Do not** use a high-contrast or saturated background for selection — it competes with content and makes dense tables hard to read.

---

## Mass Actions

When one or more items are selected, mass actions appear. They disappear when nothing is selected.

**Placement:** A contextual toolbar that appears at the top of the collection (replacing or supplementing the standard toolbar) when selection is active.

```
[✓ 3 selected]  [Delete]  [Archive]  [Export]  [Move to ▾]  [× Clear]
```

- Lead with the selection count: "3 selected" — confirms the scope before any action
- Show only actions applicable to the selection — if some actions require a single item, disable them for multi-select
- "Clear" deselects everything and dismisses the toolbar
- Destructive mass actions (Delete) always trigger a confirm dialog naming the count: "Delete 3 projects? This cannot be undone."

**Select all:** A checkbox in the table header selects all items on the current page. A secondary action "Select all 247" extends to the full dataset.

```
[☑ Select all on page]  →  [Select all 247 results]
```

---

## Sorting and Filtering

### Column sorting (table view)
- Click a column header to sort ascending; click again for descending; third click clears sort
- Active sort column shows a directional arrow (↑ ↓)
- Only sortable columns are clickable — non-sortable columns have no hover state on header

### Filters
- Persistent filters belong in a sidebar or filter bar above the collection
- Active filters should be visible as chips/tags that can be individually removed
- "Clear all filters" removes all active filters in one action
- Filter count badge on the filter button when filters are active: `Filter (3)`

### Empty states
- **No results from filter:** "No results for these filters. [Clear filters]" — do not show a generic empty state
- **Genuinely empty collection:** show a call to action for the first item: "No projects yet. [Create project]"

---

## Search and Autocomplete

Search is how users find one thing in a large set, so it must feel **instant and recognisable**.

**Suggest from the first keystrokes.** Start returning results after **1 character, at most 2–3** — don't make the user finish typing or press enter to see anything. Results appear live in a dropdown as they type.

**Make a valid result recognisable at a glance.** The whole point of a suggestion list is that the user spots *their* result in a long list without reading every row. Give each result more than a bare string:
- a **thumbnail/image** where the item is visual (products, people, files),
- the **category / area** it belongs to, and for typed domains (products, spare parts, services) a **category icon and colour** so the type is legible before the label is read — find good brand-appropriate icons for these result types (see [[brand-visual-language]]),
- the matched text **highlighted** within the result.

This is a *soft* rule — not every search needs images — but the goal is constant: **the user should identify the right result out of many, fast** (reading is time — see [[ui-density]]).

**Give a way out to the full results.** The dropdown is a shortcut, not the whole story. Always offer "See all results for '…'", opening a **full listing/results page with filters** (the collection patterns above) for when the quick suggestions aren't enough.

**Fully keyboard-navigable.** Arrow keys move through suggestions, Enter selects, Esc closes — and it must all work by mouse too. Search is a power-user path; don't force the hand off the keyboard.

---

## Table-Specific Patterns

### Sticky header
Table column headers stick to the top when scrolling vertically — users must always be able to see what each column means.

### Sticky first column
For wide tables that scroll horizontally, the first column (row identifier — name, ID) sticks to the left.

### Row actions
Per-row actions (Edit, Delete, View) appear on hover in the rightmost column. Do not show them at rest — they add visual noise.

```
[Name]  [Status]  [Date]  [Amount]          ← at rest
[Name]  [Status]  [Date]  [Amount]  [Edit] [⋯]  ← on hover
```

### Column resize and reorder
For enterprise data tables: allow columns to be resized by dragging the header border, and reordered by dragging the header. Persist the layout.

---

## Making Numbers Comprehensible

A raw number is hard to judge on its own — "1,240 users" or "€48,900" means little without a reference. Presenting data is not just laying out the figures; it is giving them the context and shape that let a user *understand* them at a glance.

**Give a number a reference.** A bare value communicates far less than a value with a baseline: a percentage, an average, a delta, or a comparison. "€48,900 (+12% vs last month)", "72% of target", "avg 3.4 per user" — the comparison is usually the insight, not the absolute figure.

**Visualise when the story is a pattern.** Reach for a graph when the message is a **trend, distribution, comparison, or relationship** the eye reads faster than a column of digits. A single KPI can pair with a sparkline; a set of categories reads better as a bar chart than a table. A table is for looking up exact values; a chart is for seeing the shape.

**Show time-series for anything that evolves.** If a value lives and changes over time — revenue, usage, a status history — present its trajectory, not just the current snapshot. A trend line answers "is this getting better or worse?" that a single number never can. Whenever something is time-dependent, consider showing its history alongside its current value.

**Choose familiar, widely-understood chart types.** Pick the chart most people already know how to read — **bar, line, area, pie/donut, sparkline** — over an exotic one (sankey, radar, chord, treemap) that looks impressive but forces the user to *learn the chart* before they can read the data. Novelty in a chart type is a tax on comprehension; spend it only when a common chart genuinely can't tell the story.

**Limited, semantic palette.** At most 2–3 colours; each means exactly one thing (see [[status-colors-and-errors]]). Traffic-light or a known convention (brand-primary vs grey). Need more distinctions? Add a legend or tooltips — don't add hues. Chart craft (axes, legends, light/dark): `dataviz`. Pairing a chart with its table: [[coordinated-data-views]].

---

## Review Checklist

- [ ] Is a view mode toggle offered when data has both visual and detail dimensions?
- [ ] Is the user's preferred view persisted across sessions?
- [ ] Is the entire row or card the selection hit area — not just the checkbox?
- [ ] Does selected state use a subtle background colour shift (`--color-primary-subtle`)?
- [ ] Does a mass action toolbar appear when items are selected, showing the selection count?
- [ ] Do destructive mass actions require a confirm dialog naming the item count?
- [ ] Does "Select all" work per page, with an option to extend to the full dataset?
- [ ] Are active filters visible as removable chips?
- [ ] Does the empty state differ between "no results" and "genuinely empty"?
- [ ] Are per-row actions shown on hover only, not at rest?
- [ ] Is the table header sticky when the table scrolls vertically?
- [ ] Are key numbers given a reference (%, average, delta, comparison) rather than shown bare?
- [ ] Is a graph used where the story is a trend/distribution/comparison, and is time-evolving data shown as a time-series, not just a snapshot?
- [ ] Are chart types familiar and widely understood (bar/line/area/pie/sparkline) rather than exotic ones that must be learned before they can be read?
- [ ] Does a chart/infographic use a small, semantic palette (≤2–3 colours, traffic-light or a known convention), with each colour meaning one thing — and a legend/tooltips where the encoding isn't self-evident?

---

## Constituent Domain: domain-expert-configuration

# Domain Expert Configuration

A domain expert configuration UI exposes the parameters of a complex system — an optimisation algorithm, a planning engine, a simulation — to users who understand the problem domain deeply but have no knowledge of the system's internals.

The challenge: the system's parameters are defined in technical terms (weights, thresholds, flags, tolerances). The user thinks in domain terms (how long to wait, when to retry, how to group results). The UI must translate between these two vocabularies — always favouring the user's language.

---

## The Core Principle: Domain Language Over Technical Language

Every parameter label, tooltip, and error message should describe what the parameter *means in the user's world*, not what it *does inside the system*.

| Technical label | Domain label |
|---|---|
| `max_concurrent_jobs` | Maximum tasks running at once |
| `enable_auto_retry` | Retry failed tasks automatically |
| `batch_allocation_threshold` | Start a new batch after (% filled) |
| `request_timeout_ms` | Maximum wait per request (seconds) |
| `enable_fuzzy_matching` | Allow approximate matches |

If you cannot write a domain label for a parameter, question whether the user should be exposed to it at all. Parameters that cannot be explained in domain terms belong in a developer configuration file, not in the user-facing UI.

---

## Grouping by Domain Concept

Parameters should be grouped by the aspect of the real-world problem they control — not by their technical category (booleans together, numbers together) and not alphabetically.

A processing tool might group as:

```
Processing limits
  └─ Maximum tasks at once
  └─ Maximum wait per request
  └─ Memory ceiling

Matching rules
  └─ Allow approximate matches
  └─ Case sensitivity
  └─ Required fields

Batching behaviour
  └─ Batch fill threshold
  └─ Maximum batches
```

Each group should have a short heading that describes *what aspect of the task it controls*, not what kind of parameter it is.

---

## Sensible Defaults

Every parameter must have a default that works correctly for the majority of cases. The user should be able to start with all defaults and get a reasonable result.

**Show the default value:** When a field is at its default, indicate this. When a user has changed a value away from the default, make it easy to reset.

```
Maximum wait per request  [___30___ s]  ← custom value
                          [↺ Reset to default (15 s)]

Batch fill threshold  [_70_ %]  (default)  ← at default
```

**Why this matters:** Domain experts often do not know what value to enter for an unfamiliar parameter. If the field is blank with no hint, they will either skip it (leaving the system in an unknown state) or enter an arbitrary value. A visible default communicates "this is what the system assumes unless you tell it otherwise."

---

## Input Types Matched to Domain Semantics

Choose the input type based on what the parameter *means*, not just its data type.

| Parameter nature | Input type | Example |
|---|---|---|
| Binary rule (on/off) | Toggle switch | "Retry automatically: [toggle]" |
| Constrained number with clear unit | Number input with unit label | "Max wait: [___] s" |
| Choice between named options | Select or radio group | "Output format: [JSON ▾]" |
| Percentage or ratio | Slider with numeric input | "Batch fill threshold: [━●━━] 70%" |
| Free text identifier | Text input | "Job reference: [___]" |

**Units are mandatory** for all numerical inputs. Never show a bare number without its unit. Place the unit label adjacent to the input (suffix preferred: `[___] cm`, not `cm [___]`).

---

## Progressive Disclosure

Not all parameters are equally important. Expose them in layers:

**Primary settings (always visible):** The parameters that control the most commonly adjusted behaviour. A domain expert should be able to accomplish 80% of their tasks by adjusting these alone.

**Advanced settings (collapsed by default):** Parameters for edge cases, fine-tuning, or less common scenarios. Behind a disclosure control ("Advanced options ▾"). Opened by users who need them, invisible to those who don't.

**Developer / system parameters:** Not shown in the user-facing UI at all. In a config file or environment variable.

Do not put everything in the advanced section as a catch-all. If a parameter is needed frequently, it belongs in the primary settings.

---

## Saved vs. Session Configuration

Many operational tools distinguish between:

- **Saved configuration:** The user's persisted preferences (their standard processing setup, their standard rules). Loaded automatically.
- **Session overrides:** One-off adjustments for a specific run that should not change the saved defaults.

Make this distinction explicit in the UI. If the user adjusts a parameter for one run, they should not have to worry about corrupting their saved defaults.

```
┌─ Configuration ────────────────────────────┐
│  Maximum wait    [30 s]   ← session only    │
│  Retry on fail   [✓]      ← saved           │
│                                             │
│  [Save as default]   [Reset to saved]       │
└─────────────────────────────────────────────┘
```

---

## Validation and Constraint Feedback

When a value is invalid or conflicts with another setting, tell the user in domain terms.

| Technical error | Domain error |
|---|---|
| `value out of range [0, 9999]` | "Wait time must be between 0 and 999 seconds" |
| `constraint conflict: retry=true, fail_fast=true` | "Retry automatically and Stop on first failure cannot both be enabled" |
| `threshold must be < 1.0` | "Batch fill threshold must be less than 100%" |

Show validation inline, adjacent to the affected field. Do not wait for the user to submit before reporting conflicts.

For settings that interact with each other, show the relationship: "When automatic retry is off, the maximum-attempts setting has no effect." This prevents the expert from wasting time tuning a parameter that isn't active.

---

## Review Checklist

- [ ] Does every parameter label use domain language, not technical language?
- [ ] Are parameters grouped by the domain concept they control, not by type or alphabetically?
- [ ] Does every parameter have a visible default value?
- [ ] Is there a "reset to default" action for individual parameters?
- [ ] Do all numerical inputs show their unit adjacent to the field?
- [ ] Are input types matched to domain semantics (toggle for binary, select for named options)?
- [ ] Are advanced parameters hidden by default behind a disclosure control?
- [ ] Is the distinction between saved configuration and session overrides explicit?
- [ ] Is validation shown inline in domain language?
- [ ] Are parameter interactions (conflicts, dependencies) explained in the UI?

---

## Constituent Domain: operational-expert-tool-ui

# Operational Expert Tool UI

An operational expert tool is software used by trained domain specialists — warehouse operators, dispatchers, planners, analysts — as their primary work surface, often for the entire working day. These users are not beginners discovering a product; they are professionals executing a defined job with the tool as their instrument.

This is a fundamentally different design context from consumer software or occasional-use SaaS. The design priorities are reversed: density and speed of action take precedence over discoverability and visual spaciousness.

---

## Primary Design Principles

### 1. Information over whitespace

An expert user does not need breathing room to orient themselves — they know the tool. Every pixel of empty space is a missed opportunity to show data they need to act on.

- Use compact row heights (28–36px) for data tables
- Show secondary attributes (status, type, date) inline, not on hover or in a detail panel
- Prefer text labels over icons alone — experts read fast, icon-only UIs slow them down at the margins

### 2. Workflow linearity

Expert tools are used to complete a defined task sequence, not to browse. Design the layout to reflect the workflow order: left to right, or top to bottom, matching the mental model of the task.

```
[Step 1: Select items]  →  [Step 2: Configure]  →  [Step 3: Execute]
```

The UI should make the next step obvious at every point, without hiding it behind menus or requiring navigation away from the current context.

### 3. Persistent state

Filters, column widths, view modes, and open/closed panels are part of the operator's work context. They should survive page reloads and be consistent between sessions unless the user explicitly resets them.

Do not reset the UI on every visit — the expert has spent time configuring it to their workflow.

---

## Hierarchical Accordion Tables

Many operational domains have naturally hierarchical data: an order contains lines; a route contains stops; a project contains tasks. The right pattern is an in-place accordion, not a drill-down to a separate page.

```
▶ Order #1042   ACME Corp    3 lines    Pending
▼ Order #1089   Globex       2 lines    Ready
    ├─ Line 1   Widget A    Qty: 12    ✓ In stock
    └─ Line 2   Widget B    Qty:  4    ✗ No stock
▶ Order #1091   Initech      5 lines    Pending
```

**Why accordion over page navigation:**
- Context is preserved — the operator can see multiple orders simultaneously
- Status across siblings is visible without navigating back
- Keyboard navigation (expand/collapse with arrow keys) keeps hands on the keyboard

**Per-row inclusion toggles:** In planning and staging workflows, each row may need to be explicitly included or excluded from a batch operation. Use a checkbox or toggle per row that is always visible — not hidden on hover.

---

## At-a-Glance Status Indicators

Operators make decisions based on status. Status should be visible without interaction.

| Good | Avoid |
|---|---|
| Coloured dot or pill always visible in the row | Status only visible on hover or in a tooltip |
| 2–3 status states with distinct colours | More than 5 status colours (hard to memorise) |
| Status label beside colour for accessibility | Colour alone as the only indicator |
| Consistent colour semantics across the whole tool | Same colour meaning different things in different tables |

Status colour conventions should align with `status-colors-and-errors` — green for ready/complete, amber for warning/pending, red for error/blocked, grey for inactive.

---

## Workflow-State Filters vs. Search Filters

Expert tools often have two distinct types of filters that should be treated differently in the UI:

**Workflow-state filters** narrow the dataset to the operator's current work scope. They persist, they are broad, and they represent a decision ("I am working on today's orders that are not yet assigned"). Place these in a permanent filter bar or sidebar, always visible.

**Search filters** find a specific item within the current scope. They are transient. Place these in a search input that can be cleared quickly.

Do not merge these into a single filter UI — the operator switches mental mode between "what scope am I working in?" and "where is that specific item?"

```
[Workflow scope: Today ▾]  [Status: Unassigned ▾]  [Stock: Available ▾]
                                                     ↑ Persistent workflow-state filters

    Search within scope: [___________]
                                                     ↑ Transient search
```

---

## Keyboard Navigation

Expert users learn keyboard shortcuts. They should not be required, but they dramatically increase throughput for trained users.

- Arrow keys navigate rows in a table
- Space or Enter expands an accordion row
- Escape closes an open panel or dialog
- Common actions have discoverable shortcuts (shown in tooltips: `Delete [Del]`, `Include [Space]`)

Do not rely on right-click context menus as the only path to actions — they are not discoverable and break keyboard-only workflows.

---

## Action Feedback at Scale

When an operation affects many items (batch assign, mass status update), the feedback must be proportional:

- For fewer than ~10 items: inline confirmation is sufficient
- For 10–100 items: a toast notification with count ("42 orders updated")
- For 100+ items: a progress indicator during the operation, then a summary on completion

Never silently complete a bulk operation with no feedback — the expert needs to confirm their action took effect.

---

## Review Checklist

- [ ] Is the information density appropriate for trained daily users (compact rows, inline status)?
- [ ] Does the layout reflect the workflow sequence (left-to-right or top-to-bottom task flow)?
- [ ] Are filters, view modes, and open panels persisted across sessions?
- [ ] Is hierarchical data shown as in-place accordions, not separate pages?
- [ ] Are per-row inclusion controls always visible, not hidden on hover?
- [ ] Are status indicators always visible without interaction?
- [ ] Are workflow-state filters separated from transient search filters?
- [ ] Are common actions accessible via keyboard?
- [ ] Does bulk operation feedback scale with the number of affected items?

---

## Constituent Domain: real-world-metaphors

# Real-World Metaphors in UI

UI patterns borrowed from the physical world reduce the learning curve because users already know how they work. A card feels like something you can pick up. A carousel feels like flipping through a stack. A drawer feels like it slides out from the side. These metaphors carry affordance — the user knows what to do before reading any instructions.

Use them deliberately, not decoratively.

## Common Metaphors and When to Use Them

### Card
A card is a bounded, self-contained unit of content — like a physical index card or a product on a shelf.

**Use when:**
- Content items are discrete and comparable (products, people, articles, tasks)
- Each item needs to be scanned quickly and potentially acted on
- Items benefit from a visual thumbnail, image, or icon

**Key properties:**
- Cards should be graspable: elevation (`--shadow-sm`), border-radius, and clear boundary
- All cards in a set should be the same width; height can vary with content
- One primary action per card — secondary actions appear on hover or inside a detail view
- Cards imply "I can pick this up and do something with it" — if nothing happens on click, use a list instead

### Carousel / Horizontal Scroll
A carousel borrows from the physical act of flipping through a stack or sliding items along a rail.

**Use when:**
- There are more items than fit the viewport and browsing is the primary mode
- Items have a natural visual order (steps, featured content, media)
- The user is expected to explore, not to find a specific item

**Caution:**
- Carousels hide content — important items should not live only inside a carousel
- Auto-advancing carousels reduce user control; prefer user-driven navigation
- On mobile, a horizontal scroll without explicit navigation dots feels more natural than arrows

### Drawer / Side Panel
A drawer slides in from an edge, like a physical desk drawer — it brings additional context without replacing the current view.

**Use when:**
- Secondary detail is needed without losing context of the main view
- Editing or configuring an item while keeping the list visible behind
- Mobile navigation patterns (hamburger menu opens a side drawer)

**Key properties:**
- The drawer should feel anchored to an edge — left for navigation, right for detail/settings
- Always provide a clear close action (× button and clicking outside)
- The content behind should dim slightly (overlay) to signal the drawer is a layer above

### Accordion
Like a physical folder that expands to reveal contents — collapses to save space, expands to show detail.

**Use when:**
- Content has a clear parent–child hierarchy
- Most users need only a few sections at a time
- Vertical space is constrained

### Tabs
Like physical divider tabs in a binder — select a tab to see its section.

**Use when:**
- Content is divided into mutually exclusive, peer-level sections
- The user switches between sections frequently
- All tabs are equally relevant to the same context

**Caution:** Tabs imply peer-level, equal-importance sections. Do not use tabs for hierarchical navigation (use breadcrumbs or sidebar instead).

### Tooltip
Like a sticky note attached to an object — appears on hover, provides brief additional context.

**Use when:**
- An icon or control needs a short label that would clutter the layout if always visible
- A term or value needs brief explanation in context

**Not a replacement for:** clear labels, inline help text, or documentation for complex features.

## Principles for Using Metaphors Well

1. **The metaphor should match the interaction** — a card that does nothing on click creates a false affordance
2. **Don't mix metaphors** — a carousel inside a card inside a drawer creates cognitive noise
3. **Mobile borrows different metaphors than desktop** — swipe-to-dismiss, bottom sheets, and pull-to-refresh are mobile-native; forcing them onto desktop feels wrong in both directions
4. **Elevation reinforces the metaphor** — a card without shadow doesn't feel graspable; a drawer without an overlay doesn't feel layered

## Review Checklist

- [ ] Does the chosen pattern match the physical metaphor users will intuit?
- [ ] Do cards have a clear primary action — not just decoration?
- [ ] Does the carousel or horizontal scroll have navigation affordance (dots, arrows, or partial next item visible)?
- [ ] Do drawers dim the background content to signal layering?
- [ ] Are physical metaphors consistent — the same pattern used for the same type of content throughout the product?

---

## Auditor Defense Checklist & Quality Gate

Whenever acting as or validating against this Master Skill, verify each of the following golden criteria:

- [ ] **Overlay Hierarchy & Z-Index**: Does the design respect Tooltip -> Popover -> Drawer -> Modal -> Fullscreen hierarchy with mandatory background scroll-locking?
- [ ] **Button 6-State Completeness**: Are Default, Hover, Active, Focus-visible, Disabled, and Loading states fully specified with reserved button width (zero CLS)?
- [ ] **Scroll Containment**: Does the layout enforce a single scroll axis per viewport container, preventing nested scroll traps?
- [ ] **Tab Navigation Limits**: Are tab bars constrained to 2-7 items with flexShrink: 0 and panel-contained scrolling?
- [ ] **Explicit Control Heights**: Are touch and click targets defined with explicit min-height (>=44px mobile, >=32px desktop)?
- [ ] **Repeated Alignment**: Are table/list labels, inputs, and action buttons aligned across identical vertical and horizontal baselines?
