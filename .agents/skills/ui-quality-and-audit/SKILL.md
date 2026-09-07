---
name: ui-quality-and-audit
description: Master quality and audit skill covering Nielsen usability heuristics, notification & recovery patterns, 5 critical states, WCAG 2.2 AA accessibility, status colors, micro-interactions, motion, and web vitals. Generates Sections F-H of design-spec.md and governs Auditor Subagents.
---

# UI Quality, Accessibility & Lifecycle Verification Master Skill

> **Domain Scope**: Fuses 9 specialized visual design skills into an authoritative, multi-perspective Master Skill.

## Constituent Skills Index

- [nielsen-usability-heuristics](#constituent-domain-nielsen-usability-heuristics)
- [notifications-and-recovery](#constituent-domain-notifications-and-recovery)
- [loading-states-and-perceived-performance](#constituent-domain-loading-states-and-perceived-performance)
- [wcag-accessibility](#constituent-domain-wcag-accessibility)
- [status-colors-and-errors](#constituent-domain-status-colors-and-errors)
- [performance-and-web-vitals](#constituent-domain-performance-and-web-vitals)
- [micro-interactions](#constituent-domain-micro-interactions)
- [motion-and-storytelling](#constituent-domain-motion-and-storytelling)
- [semantic-html-and-seo](#constituent-domain-semantic-html-and-seo)

---

## Constituent Domain: nielsen-usability-heuristics

# Nielsen's 10 Usability Heuristics

Foundational principles for evaluating and designing usable interfaces. Apply these as a review checklist and as design constraints from the start — not only as a post-hoc audit tool.

---

## 1. Visibility of System Status

The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.

Users cannot make good decisions without knowing the current state of the system. Trust is built through clear, timely feedback.

**In practice:**
- Show loading states, progress indicators, and completion confirmations
- Indicate where the user is in a multi-step process
- Reflect state changes immediately (optimistic UI or loading spinners)
- Never leave a user wondering whether an action was registered

**Review question:** After any user action, is the outcome visible within 1 second?

---

## 2. Match Between System and Real World

The design should speak the users' language — words, phrases, and concepts familiar to the user, not internal jargon or system terminology.

Follow real-world conventions and natural mapping so the interface feels intuitive rather than requiring translation.

**In practice:**
- Use terminology the target audience uses, not what the engineering team uses
- Icons should match real-world objects or widely established web conventions
- Spatial metaphors should match real-world expectations (e.g. "trash" for deletion)
- Avoid exposing internal system concepts (IDs, error codes, process names) to end users

**Review question:** Would a user unfamiliar with this product understand every label and term?

---

## 3. User Control and Freedom

Users often perform actions by mistake. They need a clearly marked emergency exit to leave an unwanted state without going through an extended process.

Easy undo and escape paths foster confidence and prevent users from feeling trapped.

**In practice:**
- Always provide Undo for destructive or irreversible actions
- Modals and dialogs need an obvious close/cancel action
- Multi-step flows need a way to go back
- Destructive actions (delete, publish, send) should be reversible where possible — or require explicit confirmation

**Review question:** Can the user get out of any state without losing their work or needing to contact support?

---

## 4. Consistency and Standards

Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.

Consistency reduces cognitive load by meeting expectations users have built from other products.

**In practice:**
- Use the same label for the same action across the entire product
- Follow platform conventions (e.g. left-swipe to delete on mobile, Cmd+Z for undo)
- Design system components should look and behave identically everywhere they appear
- Do not rename standard web patterns (e.g. calling a "breadcrumb" a "path trail")

**Review question:** Does the same action always look and behave the same way throughout the product?

---

## 5. Error Prevention

Good error messages matter, but the best designs prevent errors from occurring in the first place.

Prevention addresses both slips (unintentional actions) and mistakes (misunderstanding of design intent).

**In practice:**
- Use constraints to make wrong inputs impossible (e.g. disable a Submit button until required fields are complete)
- Confirm before destructive or irreversible actions
- Use input masks, validation, and sensible defaults to guide correct input
- Design forms so the happy path is the obvious path

**Review question:** For every destructive or irreversible action, is there a confirmation step or an undo path?

---

## 6. Recognition Rather Than Recall

Minimise the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another.

Recognition requires less cognitive effort than recall. Visible affordances reduce the work of using the product.

**In practice:**
- Show relevant options in context rather than requiring users to remember commands
- Display previously entered data when relevant (e.g. pre-fill known fields)
- Use icons with labels — icons alone are ambiguous to many users
- Navigation should be visible at all times, not hidden behind a gesture or hover

**Review question:** Does a returning user need to remember anything to pick up where they left off?

---

## 7. Flexibility and Efficiency of Use

Shortcuts — hidden from novice users — may speed up interaction for expert users. The design should serve both.

Accelerators, customisation, and personalisation let experienced users work faster without adding complexity for beginners.

**In practice:**
- Provide keyboard shortcuts for frequent actions
- Support both guided flows (for new users) and direct paths (for experts)
- Allow users to customise views, filters, or layouts they use repeatedly
- Surface frequently used actions prominently based on usage patterns

**Review question:** Can a power user complete their most frequent task significantly faster than a first-time user?

---

## 8. Aesthetic and Minimalist Design

Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with relevant information and reduces its relative visibility.

Focus content and visual design on the essentials that support primary user goals. Less is more, only when the less is the right less.

**In practice:**
- Remove decorative elements that carry no meaning
- Secondary and tertiary actions should be visually subordinate to primary ones
- Avoid showing all features simultaneously — progressive disclosure reveals complexity only when needed
- Empty states, error states, and loading states deserve the same design attention as content states

**Review question:** Does every element on screen earn its place, or is something there "just in case"?

---

## 9. Help Users Recognize, Diagnose, and Recover from Errors

Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.

Error messages are a UX surface — they deserve the same care as any other UI copy.

**In practice:**
- Never show raw error codes or stack traces to end users
- State clearly what went wrong in plain language
- Tell the user what to do next, not just what failed
- Use appropriate visual treatment: red for errors, but not red for warnings or info
- Inline validation errors should appear adjacent to the problematic field

**Review question:** Does every error message tell the user what happened, why, and what to do next?

---

## 10. Help and Documentation

It is best if the system does not need any additional explanation. However, it may be necessary to provide documentation to help users complete tasks.

Help should be contextual, searchable, and actionable — not a last resort buried in a footer.

**In practice:**
- Prefer self-explanatory UI over tooltips; prefer tooltips over documentation
- Inline help (placeholder text, helper text, tooltips) should appear at the point of need
- Documentation should be task-oriented ("How do I…") not feature-oriented ("About the settings panel")
- Empty states are an opportunity for contextual help, not just a blank screen

**Review question:** Can a confused user find help without leaving the current screen?

---

## Heuristic Review Checklist

| # | Heuristic | Check |
|---|---|---|
| 1 | System status | Every action gives visible feedback within 1s |
| 2 | Real-world language | No jargon, terminology matches user vocabulary |
| 3 | User control | Undo available, exit paths always visible |
| 4 | Consistency | Same action = same label and behaviour everywhere |
| 5 | Error prevention | Irreversible actions have confirmation or undo |
| 6 | Recognition over recall | Options visible in context, no hidden commands |
| 7 | Flexibility | Power users have faster paths to frequent tasks |
| 8 | Minimalist design | Every element earns its place |
| 9 | Error recovery | Error messages are plain, specific, and actionable |
| 10 | Help and docs | Help is contextual and available at point of need |

---

## Constituent Domain: notifications-and-recovery

# Notifications and Recovery

When something changes — success, failure, or anything in between — the user must know. And when something goes wrong, they must always have a path forward. A notification without a recovery action is just an apology.

---

## Pattern Selection

| Pattern | When to use | Dismissal |
|---|---|---|
| **Toast** | Transient result of a user action (saved, sent, deleted) | Auto-dismiss 4–6s, manual close |
| **Inline error** | Field-level validation, form errors | Clears on correction |
| **Alert banner** | Persistent issue affecting the current context | Manual dismiss or resolved state |
| **Modal / dialog** | Blocking error requiring a decision before continuing | User action required |
| **Empty state** | No data yet — guide the user to the first action | N/A |
| **Skeleton / loading** | Async content pending | Replaced by content |
| **In-place confirmation** | Inline edit saved, row updated, item toggled | Auto-clears after 2–3s |

---

## Toast Notifications

Toasts confirm that a background action completed. They appear without interrupting the user's flow.

**Placement:** bottom-center or bottom-right. Never top-center — it competes with page content and navigation.

**Duration:** 4–6 seconds for information. Errors should persist until dismissed — the user needs time to read and act.

**Anatomy:**
```
[Icon] Message text                    [Action] [×]
```

- Icon: colour-coded (green ✓ success, red ✗ error, orange ⚠ warning, blue ℹ info)
- Message: one sentence, plain language
- Action (optional): "Undo", "Retry", "View" — one action maximum
- Close button: always present on errors; optional on success

```
✓ "Changes saved."
✓ "Message sent.  [Undo]"
✗ "Could not save. Check your connection.  [Retry]"  ← persists until dismissed
```

**Never:** multiple simultaneous toasts. Queue them; show one at a time.

---

## Inline Errors

Inline errors appear adjacent to the element that caused them. They are the most contextual and actionable form of error feedback.

**Form validation:**
- Validate on blur (leaving a field), not on every keystroke — keystroke validation is noisy
- Validate on submit for the complete form
- Show the error message directly below the field, in red, with an icon
- The field border changes to `--color-error`
- Error message is associated via `aria-describedby` for screen readers

```html
<label for="email">Email</label>
<input id="email" aria-describedby="email-error" aria-invalid="true">
<p id="email-error" role="alert">Enter a valid email address.</p>
```

**In-place editing:**
- When a field is edited inline (table cell, card title), show save/cancel controls adjacent to the field
- On save: brief success indicator ("✓ Saved") that fades after 2s — do not navigate away
- On error: inline error message below the field with a retry option
- On cancel: restore the original value immediately

---

## Alert Banners

Banners are persistent — they stay until the condition is resolved or the user dismisses them.

**Use for:**
- Service degradation ("Some features are temporarily unavailable")
- Account issues requiring action ("Your subscription expires in 3 days. [Renew]")
- Ongoing sync errors ("Changes are not saving. [Retry]")
- Important announcements tied to the current page

**Placement:** top of the affected section, not the entire page unless the issue is truly global.

**Anatomy:**
```
[Icon] [Message — describes the issue and its scope] [Action] [×]
```

- One banner at a time per region — multiple simultaneous banners create alarm fatigue
- Dismissible unless the condition is blocking
- Colour follows status colour conventions: red (error), orange (warning), blue (info), green (success/resolved)

---

## Recovery Patterns

Every error state must have a path forward. Design the recovery action at the same time as the error message.

### Retry
For transient failures (network, timeout, rate limit):

```
"Could not load results."
[Try again]
```

- Retry button triggers the same action
- After 3 failed retries, escalate: "Still having trouble? [Contact support]"
- Show a spinner during retry — do not let the user click multiple times

### Undo
For destructive or irreversible actions (delete, archive, send):

```
"Message sent.  [Undo]  ×"
```

- Undo window: 5–10 seconds. Toast persists for this duration.
- After the window closes, the action is final
- Undo is preferable to confirmation dialogs for low-stakes actions — it is faster and less disruptive

### Autosave and Draft Recovery
For long-form inputs (forms, documents, editors):

- Autosave every 30–60 seconds silently
- On save failure: "Autosave failed — your changes are stored locally. [Retry save]"
- On return after crash or close: "You have unsaved changes from [time]. [Restore] [Discard]"

### Graceful Degradation
When a feature fails but the rest of the product still works:

- Show an error state for the failed section only — do not blank the entire page
- Offer a fallback: "Could not load recommendations. [Browse all products →]"
- Log the error silently; surface only what the user needs to know

---

## Loading and Skeleton States

Loading is not an error, but it is a state that needs design.

- **Skeleton screens** for content-heavy pages — show the layout shape while data loads
- **Spinners** for targeted async actions (button loading, inline refresh)
- **Progress bars** for long operations with known duration (file upload, multi-step processing)
- Never show a blank screen while loading — always show something

Skeleton screens reduce perceived wait time compared to spinners. Match the skeleton shape to the actual content layout.

---

## The Notification Center

Toasts and banners are *transient*; a **notification center** is the persistent place a user goes to review and control what reaches them. Two things make it work.

**Easy to reach, and easy to control.** The user must get to their notification preferences with almost no digging (a bell icon → the center → settings). And keep the control model **coarse — 1 to 3 categories at most**, each with a simple level:

- `Off (0)` — none of this category
- `Minimal` — only the important ones
- `All / granular` — everything

Don't build a wall of per-event toggles. Two real needs dominate: **silence everything**, or **keep one or two categories**. Design straight for those — a prominent "mute all" / "mark all read" plus 1–3 category switches.

**Minimise reading.** The center is scanned, not read. Group by category, lead each item with a recognisable icon and the entity/action (not a paragraph), show unread state clearly, and let the whole list be cleared in one action. Reading is time (see [[ui-density]]) — a notification center that demands careful reading defeats its purpose.

## Notification Accessibility

- Errors use `role="alert"` — announced immediately by screen readers
- Status updates use `role="status"` — announced politely (after current speech)
- Toasts must be reachable by keyboard — do not use `pointer-events: none` on the close button
- Auto-dismissing toasts must have sufficient duration (`prefers-reduced-motion` users may need more time to read)

```html
<!-- Error: immediate announcement -->
<div role="alert">Could not save. Check your connection.</div>

<!-- Status: polite announcement -->
<div role="status" aria-live="polite">Changes saved.</div>
```

---

## Review Checklist

- [ ] Does every error have a recovery action (retry, undo, contact support)?
- [ ] Do toasts auto-dismiss for success but persist for errors?
- [ ] Is there never more than one toast visible at a time?
- [ ] Are inline errors placed adjacent to the field, not at the top of the form?
- [ ] Are form errors associated to their inputs via `aria-describedby`?
- [ ] Do alert banners appear at the top of the affected section, not always full-page?
- [ ] Is autosave or draft recovery available for long-form inputs?
- [ ] Do loading states use skeletons for content and spinners for targeted actions?
- [ ] Are errors announced via `role="alert"` and status updates via `role="status"`?

---

## Constituent Domain: loading-states-and-perceived-performance

# Loading States and Perceived Performance

Users don't mind waiting as much if they understand *what* they are waiting for and *how much* progress is being made. Perceived performance is the design work of making a system feel faster than it actually is.

---

## Choosing the Right Loading State

| Wait Duration | Best Pattern | Use for |
|---|---|---|
| **Short (< 1s)** | **Inline Spinner / Loader** | Button actions, small updates, quick data fetches |
| **Medium (1s – 3s)** | **Skeleton Screen** | Cards, lists, dashboards, profile pages |
| **Long (> 3s)** | **Determinate Progress Bar** | File uploads, complex exports, heavy processing |
| **Full Page** | **Staggered Entry / Animated Sections** | Initial app load, hero sections, immersive transitions |

---

## Simple Cases: Spinners and Loaders

Use spinners for small, contained actions where the layout doesn't change significantly.

- **Button Spinners:** Replace button text or sit alongside it. The button should enter a `disabled` state to prevent double-submissions.
- **Micro-Loaders:** A small 16–24px circle for inline updates (e.g., saving a single field).
- **Animation Tip:** A "spring-loaded" rotation (easing in and out) feels more premium than a constant linear rotation.

```css
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.spinner {
  animation: spin 800ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
```

---

## Skeleton Screens (Glimmer/Shimmer)

Skeleton screens provide a visual placeholder that mimics the layout of the final content. This reduces "layout shift" (CLS) and signals to the user exactly where the content will appear.

### The Shimmer Effect
A subtle, moving gradient that travels across the skeleton elements.

```css
.skeleton {
  background: var(--color-grey-100);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Rules for Skeletons
- **Match the shape:** If the final content is a round avatar, use a round skeleton. If it's a 2-line heading, use two bars of varying widths.
- **Stay Recessive:** Skeletons should use your most subtle grey (`--color-grey-100` or `grey-50`). They should not draw focus.
- **Fade into Reality:** When data arrives, fade the actual content in over the skeleton (150–200ms) rather than snapping.

---

## Fully Animated Sections

For major page transitions or initial loads, use a coordinated animation strategy.

### Staggered Entry (Cascading)
Instead of the whole page appearing at once, animate sections in a sequence. This guides the user's eye from the most important content (hero) down to secondary areas.

```css
.section {
  opacity: 0;
  transform: translateY(10px);
  animation: slide-up 400ms ease-out forwards;
}
/* Stagger by index */
.section:nth-child(1) { animation-delay: 100ms; }
.section:nth-child(2) { animation-delay: 200ms; }
.section:nth-child(3) { animation-delay: 300ms; }

@keyframes slide-up {
  to { opacity: 1; transform: translateY(0); }
}
```

### Hero Section "Bloom"
For hero sections, you might use a more complex animation:
1. **Background image** fades in slowly.
2. **Heading** slides in with a slight overshoot (spring).
3. **CTA button** appears last with a crisp fade-in or subtle color transition.

---

## Load in Priority Order — and Prefetch What's Next

Don't wait for everything before showing anything. Load in the order of **value to the user**, so the thing they came for appears first and the rest fills in around it. This is both a perceived-performance win and a code-efficiency one: you fetch and render less up front.

- **First, the highest-value content** — the key figure, the primary record, the above-the-fold answer. Render it the moment it's ready.
- **Then the next tier, then the next** — secondary panels, related lists, and below-the-fold sections stream in behind it (skeletons hold their space so nothing shifts — see the skeleton section above).
- **Fetch only what the current view needs.** Defer data for tabs, drawers, and off-screen sections until they're opened, rather than loading the whole page's worth of data at once.

**Prefetch the predictable next step** — next page, a hovered row's detail, the next wizard step — in the background so it's instant. Don't speculatively load everything; only where there's an obvious next move.

## Advanced: Optimistic UI

The fastest UI is one that doesn't wait for the server at all.
- **The Pattern:** Update the UI immediately assuming the server call will succeed. If it fails, roll back and show an error.
- **Use for:** Liking a post, toggling a switch, renaming a folder, deleting a message.
- **Benefit:** Instant gratification for the user, making the app feel "lightning fast."

---

## Adding Delight to the Wait

Loading doesn't have to be a neutral experience. For waits longer than 2 seconds, consider adding brand personality and "delight" to keep the user engaged.

### Brand-Aligned Micro-copy
Replace generic "Loading..." text with wording that reflects the brand's voice.
- **Technical:** "Compiling data...", "Syncing with cloud..."
- **Playful:** "Gathering pixels...", "Brewing your dashboard...", "Almost there!"
- **Professional:** "Preparing your report...", "Verifying details..."

### Branded Animations (Lottie/SVG)
For significant loading moments (initial app boot, complex data processing), replace the standard spinner with a small, brand-specific animation. 
- A designer's tool might show a pencil drawing a line.
- A fitness app might show a pulsing heart or a moving runner icon.
- A financial tool might show coins stacking or a chart line moving upward.

### Progressive Storytelling
If a wait is consistently long (3s+), use the loading area to tell a small story or provide value:
- **Tips & Tricks:** "Did you know you can use Ctrl+K to search?"
- **Process Transparency:** Show what the system is doing: "Checking database..." → "Optimising results..." → "Finalising view..."

### Visual Transitions (Arrival)

When transitioning from a loading state to content, use a crisp fade-in (150ms) to make the arrival feel like a reward. Avoid scaling the incoming content, as it can cause layout instability.

---

## Review Checklist

- [ ] Is the loading state appropriate for the expected wait duration (spinner vs skeleton)?
- [ ] Does the skeleton screen match the physical layout of the incoming content?
- [ ] Is there a subtle shimmer animation on skeletons to signal "active loading"?
- [ ] Are buttons disabled during loading to prevent duplicate actions?
- [ ] Does content fade in over skeletons (150–200ms) rather than blinking into existence?
- [ ] For full-page loads, is a staggered entry used to guide the eye?
- [ ] Is `prefers-reduced-motion` respected for all loading animations?
- [ ] In "Optimistic UI" moments, is there a clear rollback path if the action fails?
- [ ] Does content load in priority order (highest-value first, rest streaming in), fetching only what the current view needs rather than everything up front?
- [ ] Where the next step is predictable, is it prefetched so it feels instant — without speculatively loading everything?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| A global spinner that blocks the whole app | High frustration, user cannot browse other areas | Use contextual loaders or skeletons |
| Skeletons that don't match the final layout | Massive layout shift (CLS) when data arrives | Match shapes and sizes exactly |
| Too many spinners on one page | Visual noise, feels like the whole app is broken | Group loading states into a single container skeleton |
| Faster-than-light skeletons | Shimmer animation that is too fast or high-contrast | Keep shimmer slow (1.5s+) and very subtle |

---

## Constituent Domain: wcag-accessibility

# WCAG Accessibility (EN 301 549 / European Standard)

## The Standard

The **European Accessibility Act (EAA)** requires digital products and services in the EU to meet **EN 301 549**, which references **WCAG 2.2 Level AA** as the technical baseline. This is not optional — it is a legal requirement for products operating in the EU market.

**Default: always build to WCAG 2.2 AA.** Deviating requires explicit, documented justification. Do not skip accessibility requirements because of timeline pressure or design preference.

WCAG 2.2 AA organises requirements under four principles: **Perceivable, Operable, Understandable, Robust**.

---

## Perceivable

Users must be able to perceive all content and UI components.

### Colour Contrast
| Context | Minimum ratio | Enhanced (AAA) |
|---|---|---|
| Normal text (< 18pt / < 14pt bold) | **4.5 : 1** | 7 : 1 |
| Large text (≥ 18pt / ≥ 14pt bold) | **3 : 1** | 4.5 : 1 |
| UI components and graphical objects | **3 : 1** | — |

> **Check contrast on the real rendered page, not the spec (dembrandt engine, optional).** Design-time swatches lie once real text lands on real backgrounds, gradients, and overlays. `get_findings` / `render_report` run against the live DOM and surface the actual failing text/background pairs with their measured ratios — a fast way to catch the combinations a static palette review misses. See [`extract-design`](../extract-design/SKILL.md).

**Disabled elements are exempt.** WCAG explicitly excludes inactive UI components from contrast requirements (WCAG 1.4.3 exception). A disabled button may use low-contrast text — this is intentional and correct, as it communicates the unavailable state.

Do not use colour as the only means of conveying information (e.g. a red border alone to indicate an error — add an icon or text label).

### Text Alternatives
- Every meaningful image needs `alt` text describing its content or function
- Decorative images use `alt=""` so screen readers skip them
- Icons used as buttons need an accessible label: `aria-label` or visually hidden text
- Charts and data visualisations need a text summary or data table alternative

### Captions and Transcripts
- Video content needs captions
- Audio-only content needs a transcript

---

## Operable

Users must be able to operate all UI components.

### Keyboard Navigation
All interactive elements must be reachable and operable by keyboard alone.

- Every button, link, input, and control must receive focus via Tab
- Focus order must follow the visual reading order of the page
- No keyboard traps — users must be able to navigate away from any component
- Modal dialogs must trap focus inside while open, and return focus to the trigger element on close

### Focus Visibility
A visible focus indicator is required on every interactive element (WCAG 2.2 strengthens focus visibility requirements).

```css
/* Minimum: do not remove focus outline without a replacement */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

Never use `outline: none` without providing a custom focus style. The focus ring is not a design problem to eliminate — it is a navigation tool.

### Touch Target Size
Interactive elements on touch devices must be at least **24×24px** (WCAG 2.2) — **44×44px** is the recommended comfortable minimum (Apple HIG, Material Design). Small icon buttons need padding to reach this size even if the visual icon is smaller.

### No Seizure Triggers
Nothing on screen should flash more than 3 times per second.

### Skip Links
Pages with repeated navigation must provide a "Skip to main content" link as the first focusable element, so keyboard users can bypass navigation on every page.

---

## Understandable

Users must be able to understand the content and how the UI works.

### Language
- Set `lang` attribute on the `<html>` element: `<html lang="fi">` or `<html lang="en">`
- Mark inline content in a different language with `lang` on that element

### Labels and Instructions
- Every form input must have a visible label — not just a placeholder (placeholders disappear on input)
- Required fields must be indicated — do not rely on colour alone; add an asterisk and a legend
- Error messages must be associated with their input via `aria-describedby`

### Predictability
- Components that look the same must behave the same (see Consistency and Standards)
- Navigation must appear in the same location across pages
- Opening a new tab or window must be communicated in advance

### Error Identification
- Form validation errors must identify which field failed
- Errors must be described in text — not only by colour or icon

---

## Robust

Content must be interpreted reliably by assistive technologies.

### Semantic HTML
Use the correct HTML element for the job. Semantics convey role, state, and structure to screen readers for free.

```html
<!-- Correct -->
<button>Save</button>
<nav aria-label="Main navigation">...</nav>
<h1>Page title</h1>

<!-- Wrong — requires manual ARIA to replicate what the element provides natively -->
<div onclick="save()">Save</div>
<div class="nav">...</div>
<div class="heading">Page title</div>
```

### ARIA — Use Sparingly
ARIA supplements HTML semantics where native elements fall short. It does not fix broken HTML.

**Rule: no ARIA is better than incorrect ARIA.** Incorrect ARIA actively breaks screen reader output.

Required patterns:
- `aria-label` or `aria-labelledby` for components with no visible text label
- `aria-expanded` on toggles, accordions, and dropdowns
- `aria-live` regions for dynamic content updates (toast notifications, search results)
- `role="dialog"` with `aria-modal="true"` on modal overlays
- `aria-current="page"` on the active navigation item

### Status Messages
Dynamic updates (success toasts, loading states, error counts) must be announced to screen readers via `aria-live` or `role="status"` — they will not be announced automatically unless the focused element changes.

---

## The Disabled Element Exception

WCAG 1.4.3 explicitly states: *"Text or images of text that are part of an inactive user interface component… have no contrast requirement."*

This means:
- Disabled buttons, inputs, and links **may** use low-contrast text and colours
- The visual dimming of disabled states is both correct and compliant
- Do not add artificial contrast to disabled elements — the reduced contrast communicates "this is unavailable"

---

## Review Checklist

| Area | Check |
|---|---|
| Contrast | All active text ≥ 4.5:1 (normal) or 3:1 (large/UI) |
| Contrast | Disabled elements exempt — intentionally low contrast is fine |
| Colour | Colour is never the only information carrier |
| Keyboard | All interactive elements reachable and operable by keyboard |
| Focus | Visible focus indicator on every interactive element |
| Touch | Interactive targets ≥ 44×44px on touch surfaces |
| Labels | Every input has a visible label (not just placeholder) |
| Errors | Validation errors identify the field and describe the problem in text |
| HTML | Semantic elements used correctly; ARIA only where needed |
| Language | `lang` attribute set on `<html>` |
| Skip link | "Skip to main content" as first focusable element |
| Live regions | Dynamic updates announced via `aria-live` or `role="status"` |

---

## Constituent Domain: status-colors-and-errors

# Status Colours and Error Design

## Keep the Colour Set Small

Every status colour added to a system is a cognitive burden on the user. They must learn what each colour means, remember it, and interpret it correctly under stress — which is exactly when errors occur.

**The minimal set that covers almost everything:**

| Colour | Semantic meaning | Always means |
|---|---|---|
| **Red** | Error / failure / destructive | Something went wrong, or this action cannot be undone |
| **Orange / Amber** | Warning | Something needs attention before proceeding |
| **Green** | Success / positive | Action completed, state is healthy |
| **Blue** | Info / neutral status | Informational, no action required |

**Rule: each colour maps to exactly one meaning across the entire product.** If orange means "warning" in one component and "pending" in another, the system breaks down.

When in doubt, cut the colour — neutral grey communicates status without semantic weight, and neutral is better than a misused semantic colour.

## Orange Is Always a Warning

Orange (amber) carries a specific signal: pay attention, something may go wrong. Do not use it for:
- Neutral states (use grey)
- Progress or pending (use blue or a spinner)
- Informational content (use blue)
- Branding or decorative purposes inside status indicators

If orange appears in the UI, the user should immediately know it requires their attention.

## Errors Should Be Recoverable

**The worst error is one the user cannot recover from.** Design every error state with a path forward.

### Error message anatomy
Every error should answer three questions:
1. **What went wrong?** — plain language, no error codes
2. **Why did it happen?** — if useful and known
3. **What should the user do next?** — specific, actionable

```
❌ "Error 500"
❌ "Something went wrong"
✓  "We couldn't save your changes. Check your connection and try again."
✓  "This email is already in use. Sign in instead, or use a different email."
```

### Recovery actions
- Always provide a retry button for transient failures (network errors, timeouts)
- For validation errors, point directly to the problematic field
- For destructive actions that failed, reassure the user nothing was lost
- For session expiry, redirect to login and return the user to where they were

## Prevent Large Errors Before They Happen

The most damaging errors — data loss, irreversible actions, broken state — should be prevented at the design level, not handled after the fact.

- **Confirm before irreversible actions:** "Delete this project and all 47 tasks? This cannot be undone."
- **Disable unavailable actions** rather than letting users trigger them and hit an error
- **Autosave** where possible so a browser crash or accidental close does not destroy work
- **Optimistic UI** with rollback: show the success state immediately, silently retry on failure, surface an error only if the retry also fails

**State the consequences *before* the user acts, not after.** Fear comes from not knowing what a control will do. Make the outcome legible ahead of the action so the user commits with confidence:
- **Plain-language consequence text** next to or inside the control: "This will email all 240 subscribers", "Publishing makes this visible to everyone".
- **Staged guidance** for anything multi-step or heavy: break it into steps and tell the user what each one will do before they proceed, so the whole operation is predictable rather than a leap.
- Reserve the strong interruptions (confirm dialogs, typed confirmation) for the genuinely dangerous cases above; for everyday actions, a quiet line of helper text is enough. The goal is the same — no surprises, so nothing feels scary.

## Levels of Severity — Use Sparingly

Not every problem is equal. Match the visual weight of the feedback to the severity.

| Severity | Pattern | When to use |
|---|---|---|
| **Blocking error** | Full-page error state or modal | App cannot continue, user must act |
| **Inline error** | Red text below a field | Form field validation failure |
| **Toast / snackbar** | Temporary notification, bottom of screen | Transient failure the user should know about but can dismiss |
| **Alert banner** | Persistent bar at top of section | Ongoing issue affecting the current context |
| **Empty state** | Illustrated or descriptive empty screen | No data yet — use as an opportunity for guidance, not just a blank |

Avoid showing multiple simultaneous error types at once — one clear message is more useful than three overlapping alerts.

## Review Checklist

- [ ] Does the product use four or fewer semantic status colours?
- [ ] Does each colour mean exactly one thing, used consistently everywhere?
- [ ] Is orange/amber reserved exclusively for warnings?
- [ ] Does every error message state what went wrong and what to do next?
- [ ] Do all transient errors (network, timeout) have a retry action?
- [ ] Are irreversible destructive actions protected by a confirmation step?
- [ ] Is autosave or draft recovery available for long-form or complex inputs?
- [ ] Are multiple simultaneous error states avoided?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| "Something went wrong" with no action | User is stuck with no path forward | Add specific cause and a retry or contact link |
| Orange used for "pending" and "warning" simultaneously | Colour loses its meaning | Orange = warning only; use blue or spinner for pending |
| Five or more status colours (red, orange, yellow, teal, purple…) | User must learn and remember a complex legend | Cut to the minimum: red, orange, green, blue |
| Inline validation only on submit | User discovers all errors at once | Validate on blur (leaving a field) for immediate feedback |
| No confirmation on delete | Users accidentally delete data | Require explicit confirmation for all irreversible actions |

---

## Constituent Domain: performance-and-web-vitals

# Performance and Web Vitals

## Run a Lighthouse Audit

```bash
# CLI audit — outputs JSON and HTML report
npx lighthouse https://example.com --output html --output-path ./lighthouse-report.html

# Headless, useful in CI
npx lighthouse https://example.com --chrome-flags="--headless" --output json --output-path ./report.json

# Audit specific categories only
npx lighthouse https://example.com --only-categories=performance,accessibility,seo
```

Or open Chrome DevTools → Lighthouse tab → Analyse page load.

**Target scores:**
| Category | Target |
|---|---|
| Performance | ≥ 90 |
| Accessibility | 100 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

---

## Core Web Vitals

### LCP — Largest Contentful Paint
*How fast does the main content appear?*

**Target: ≤ 2.5s**

LCP measures when the largest visible element (hero image, heading, video poster) renders. It is the user's perception of "did the page load?"

**Common causes and fixes:**

| Cause | Fix |
|---|---|
| Unoptimised hero image | Use WebP/AVIF, correct size, `fetchpriority="high"` |
| Image not preloaded | `<link rel="preload" as="image" href="hero.webp">` |
| Render-blocking CSS/JS | Defer non-critical JS, inline critical CSS |
| Slow server response | CDN, caching headers, edge delivery |
| Web font blocking render | `font-display: swap` or `optional` |

```html
<!-- Preload LCP image -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- LCP image: no lazy loading -->
<img src="hero.webp" alt="..." fetchpriority="high" width="1200" height="600">
```

Never use `loading="lazy"` on the LCP image — it delays the most important render.

---

### CLS — Cumulative Layout Shift
*Does content jump around while loading?*

**Target: ≤ 0.1**

CLS measures unexpected layout shifts — content moving after it has rendered. Caused by images without dimensions, late-loading ads, fonts swapping, or dynamic content injected above existing content.

**Common causes and fixes:**

| Cause | Fix |
|---|---|
| Images without width/height | Always set `width` and `height` on `<img>` |
| Web font swap | Use `font-display: optional` or preload fonts |
| Dynamic content above fold | Reserve space with `min-height` on containers |
| Late-loading ads or embeds | Reserve fixed dimensions for ad slots |
| Animations that shift layout | Animate `transform` only, never `top/left/width/height` |

```html
<!-- Always include dimensions -->
<img src="product.jpg" width="400" height="300" alt="...">
```

```css
/* Reserve space for dynamic content */
.ad-slot { min-height: 250px; }

/* Animate transform, not layout properties */
.slide-in { transform: translateY(0); transition: transform 300ms; }
```

---

### INP — Interaction to Next Paint
*How quickly does the page respond to user input?*

**Target: ≤ 200ms**

INP measures the delay between a user interaction (click, tap, keyboard) and the next visual update. High INP makes the UI feel sluggish or frozen.

**Common causes and fixes:**

| Cause | Fix |
|---|---|
| Heavy JS on main thread | Break into smaller tasks, use `requestIdleCallback` |
| Large event handlers | Debounce/throttle scroll and resize handlers |
| Synchronous DOM updates | Batch DOM writes with `requestAnimationFrame` |
| Third-party scripts blocking | Load third-party scripts with `async` or `defer` |
| React re-renders | Memoize with `useMemo`, `useCallback`, `React.memo` |

---

## Images

Images are the single biggest performance lever on most pages.

```html
<!-- Modern formats with fallback -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" width="800" height="600" alt="..." loading="lazy">
</picture>

<!-- Responsive images -->
<img
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  src="image-800.webp"
  alt="..."
  width="800"
  height="600"
  loading="lazy"
>
```

**Rules:**
- Always set `width` and `height` — prevents CLS
- Use `loading="lazy"` below the fold, never on LCP image
- Serve WebP or AVIF — typically 30–50% smaller than JPEG
- Size images to their display size — do not serve 2000px image for a 400px slot
- Use a CDN with automatic format conversion where possible

---

## Fonts

Web fonts block rendering if not handled correctly.

```html
<!-- Preconnect to font origin -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical font file -->
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>
```

```css
@font-face {
  font-family: 'Brand';
  src: url('/fonts/brand.woff2') format('woff2');
  font-display: swap;     /* show fallback immediately, swap when loaded */
  /* font-display: optional; — never swap, use fallback if not cached */
}
```

- `font-display: swap` — good for headings, acceptable CLS
- `font-display: optional` — zero CLS, font only used if cached (best for body text)
- Subset fonts to the characters actually used — reduces file size by 60–80%

---

## JavaScript

```html
<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>

<!-- Module scripts are deferred by default -->
<script type="module" src="app.js"></script>
```

- `defer`: executes after HTML parsed, in order — use for most scripts
- `async`: executes as soon as downloaded, out of order — use for independent scripts (analytics)
- Never block the main thread with synchronous `<script>` in `<head>`

---

## Lighthouse CI (automated audits)

Run Lighthouse in CI to catch regressions before deployment.

```bash
# Install
npm install -g @lhci/cli

# Run
lhci autorun --upload.target=temporary-public-storage
```

```yaml
# .lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:seo": ["warn", { "minScore": 0.95 }]
      }
    }
  }
}
```

---

## Review Checklist

- [ ] Lighthouse performance score ≥ 90
- [ ] Lighthouse accessibility score = 100
- [ ] LCP ≤ 2.5s — LCP image preloaded, no `loading="lazy"` on it
- [ ] CLS ≤ 0.1 — all images have `width` and `height`, no layout-shifting animations
- [ ] INP ≤ 200ms — no heavy synchronous JS on main thread
- [ ] Images served as WebP or AVIF with correct dimensions
- [ ] `loading="lazy"` on all below-fold images
- [ ] Web fonts use `font-display: swap` or `optional`
- [ ] Non-critical JS loaded with `defer` or `async`
- [ ] Lighthouse CI configured to catch regressions in deployment pipeline

---

## Constituent Domain: micro-interactions

# Micro-Interactions

A micro-interaction is a moment. A checkbox that draws its checkmark. A heart that pulses when liked. A toggle that eases into place with a little overshoot. A confetti burst on completing a goal. These moments are small in duration — 200–600ms — but they communicate that the product was made by people who cared.

The reference is always the natural world. Nothing in nature snaps instantly. Everything has weight, momentum, and a moment of settling.

---

## What Makes a Good Micro-Interaction

A micro-interaction earns its place when it:

1. **Confirms an action** — makes the result of a click, tap, or input unmistakably clear
2. **Rewards a milestone** — celebrates something the user worked toward
3. **Reveals something** — unfolds information in a way that aids understanding
4. **Adds texture** — makes an otherwise flat moment feel physical and real

It fails when it:
- Delays the user (animation blocks the next action)
- Repeats too often (becomes noise, not signal)
- Exists only for decoration (no information is conveyed)

---

## Natural World as Reference

Physical objects have inertia, springiness, and weight. UI that borrows these properties feels intuitive because it matches expectations built over a lifetime.

| Natural behaviour | UI equivalent |
|---|---|
| A door swinging to rest | Toggle that overshoots slightly before settling |
| Water dripping | Staggered list item reveals |
| A rubber band snapping back | Pull-to-refresh bounce |
| A leaf falling | Gentle fade + drift downward on dismiss |
| A bell ringing | Icon that briefly oscillates (shakes) on trigger |
| A stamp pressing paper | Inner element shift (e.g. icon nudge) without shifting button bounds |

The motion should feel *inevitable* — as if the element has physical properties and cannot behave any other way.

---

## Patterns

### Animated Icons

Icons that animate on trigger communicate state change more vividly than a static swap.

**Checkmark draw-on:** A checkmark that draws itself from start to end point on completion.
```css
@keyframes check-draw {
  from { stroke-dashoffset: 20; }
  to   { stroke-dashoffset: 0; }
}
.checkmark path {
  stroke-dasharray: 20;
  animation: check-draw 300ms ease-out forwards;
}
```

**Heart pulse on like:** Scale up slightly then settle back.
```css
@keyframes heart-pulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.25); }
  100% { transform: scale(1); }
}
```

**Hamburger → close morphing:** Lines animate to form an × when a menu opens.

**Bell shake on notification:** A brief oscillating rotation.

**Loading spinner:** Rotate with easing rather than linear — a spring rotation feels alive; linear feels mechanical.

### Toggle / Switch

A toggle should feel like a physical switch, not a state change.

```css
.toggle-thumb {
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  /* cubic-bezier with overshoot — the thumb slides and bounces slightly */
}
.toggle:checked .toggle-thumb {
  transform: translateX(20px);
}
```

The cubic-bezier `(0.34, 1.56, 0.64, 1)` produces a spring effect — the thumb overshoots and settles. This is the difference between a switch that feels cheap and one that feels premium.

### Success / Completion

Mark moments of genuine completion — a form submitted, an onboarding step finished, a goal reached.

- **Checkmark animation** that draws on
- **Subtle confetti** for high-value milestones (first purchase, account created, goal achieved) — use sparingly, never for routine actions
- **Green fill transition** on a progress bar completing
- **Number count-up** when a stat reaches its final value

### Reveal and Disclosure

Accordions, tooltips, and popovers that open via a small reveal feel more considered than appearing instantly.

```css
.accordion-content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 250ms ease-out;
}
.accordion-content.open {
  max-height: 500px; /* generous upper bound */
}
```

Content that slides down as if gravity is pulling it into place feels natural. Content that blinks into existence does not.

### Button Interaction Feedback (Stability Rule)

Buttons must never change their outer dimensions or shift their position in the layout when hovered, focused, or clicked.

```css
.btn {
  transition: background-color 150ms ease-out, box-shadow 150ms ease-out;
}
.btn:hover {
  background-color: var(--color-brand-600); /* subtle shift in hue or brightness */
}
.btn:active {
  background-color: var(--color-brand-700); /* deeper contrast on press */
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); /* inner shadow suggests depth without scaling */
}
```

The button remains rock-solid in the layout. Feedback is conveyed through colour, internal shadows, or subtle micro-animations of *inner* elements (like an arrow moving 2px to the right) that do not affect the button's footprint.

### Skeleton → Content Transition

When content loads, do not flash it in. Fade it over the skeleton at 150–200ms. The skeleton dissolves, the content arrives.

```css
.content-loaded {
  animation: fade-in 150ms ease-out;
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### Attracting Attention to Remote Changes

Users often miss updates that occur far away from their current focus or click area (change blindness). If an area changes that the user is not currently looking at—such as a notification in a distant corner—use a subtle animation to guide their eye.

- **Notification Badge Bloom:** When a new notification arrives, briefly scale the badge up (1.2) and settle back to 1.0.
- **Background Highlight Fade:** If a list item updates or a new row is added, highlight its background with a subtle brand tint and fade it to transparent over 1–2 seconds.
- **Subtle Shake:** A very small horizontal shake (2–4px) can draw attention to a sidebar or toolbar item without being aggressive.

**Rule:** The animation should be non-looping. Once the eye is caught, the motion must stop to avoid becoming a permanent distraction.

---

## The Sacred Rule of Component Stability

Interactive elements — especially buttons — must be layout-stable.

- **No Scaling:** Never use `transform: scale()` on hover or click for buttons. It causes visual vibrating and can feel "squishy" rather than premium.
- **No Shifting:** Never use `translate` or margins that change the element's position relative to its neighbors.
- **Why:** Layout stability creates a sense of professional engineering and "sturdiness." If the UI moves under the user's cursor, it feels unpredictable.

---

## How to Declare the Motion

**Transitions for state, keyframes for sequences.** A CSS transition can be interrupted: move the cursor away mid-hover and the element turns around from where it is. A keyframe animation cannot — it plays to the end, then snaps. Every hover, focus, active and selected state is a transition. Reserve `@keyframes` for a staged entrance or a loop that runs on its own.

**Name the properties.** `transition: all` animates whatever happens to change, including layout properties that force the browser to re-lay-out the page every frame — and it is how a component starts sliding when an unrelated class lands on it.

```css
/* the element decides what moves */
transition-property: opacity, scale;
transition-duration: 200ms;
transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
```

**`will-change` is a last resort.** Add it only when you have seen the first frame stutter, only on `transform`, `opacity` or `filter`, and remove it when the animation ends. It reserves a compositor layer; applied broadly it costs more memory than it saves time.

---

## Restraint

Micro-interactions are seasoning, not the meal.

- **Once per trigger** — a checkmark animates once on save, not on every render
- **Skip on repeat actions** — a bulk delete of 50 items should not animate 50 times
- **No blocking animations** — the user must be able to continue immediately; the animation runs alongside, not instead of, the result
- **Respect `prefers-reduced-motion`** — always

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

**Ask for each interaction:** does this make the result clearer, or just more visually busy? If the answer is the latter, remove it.

---

## Review Checklist

- [ ] **Sacred Rule:** Do buttons and interactive elements remain perfectly stable (no size change, no shifting) during hover and click?
- [ ] Does each micro-interaction confirm an action, reward a milestone, or aid understanding?
- [ ] Is the duration 200–600ms — not instant, not slow enough to feel like waiting?
- [ ] Does motion reference natural physics (spring, ease-out, overshoot) rather than linear timing?
- [ ] Is the animation non-blocking — the user can continue immediately?
- [ ] Is `prefers-reduced-motion` respected?
- [ ] Are high-effort celebrations (confetti, bloom effects) reserved for genuine milestones?
- [ ] Do animated icons clearly communicate the state change they represent?
- [ ] Does the toggle/switch use a spring easing curve, not linear?
- [ ] Are remote changes (outside focal area) highlighted with a brief, non-looping animation to guide the eye?

---

## Constituent Domain: motion-and-storytelling

# Motion and Storytelling in UI

Animation and motion are not decoration — they are communication. When applied with the same discipline as typography or colour, they tell the user what is happening, where to look, and what the product feels like to use. The source material — Disney's 12 principles, cinematic language, comic book conventions — is centuries of accumulated knowledge about how to communicate through movement and sequence.

The key word is **subtlety**. In UI, motion should be felt, not watched.

---

## Disney's 12 Principles Applied to UI

### 1. Squash and Stretch
Objects compress on impact and extend on acceleration. In UI: a button that scales down slightly on press and springs back communicates physicality and responsiveness.

```css
button:active { transform: scale(0.96); }
button { transition: transform 80ms ease-out; }
```

Use sparingly — reserved for primary CTAs and satisfying confirmations.

### 2. Anticipation
A small preparatory movement before the main action. In UI: a menu item shifting slightly before opening, or a loading indicator appearing before a transition begins, prepares the user for what is coming.

### 3. Staging
Present one idea clearly at a time. In UI: entrance animations should direct attention to the new content, not compete with existing content. When a modal opens, the rest of the page dims — that is staging.

### 4. Straight Ahead vs Pose to Pose
**Pose to pose** — defining start and end states and letting the system interpolate — is the CSS/JS approach. Define clear initial and final states; let `transition` or a spring physics library handle the in-between.

### 5. Follow-Through and Overlapping Action
Elements don't all stop at the same time. In UI: staggered list item entrances (each item enters 40–60ms after the previous) feel more natural than all items appearing simultaneously.

```css
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
```

### 6. Ease In and Ease Out
Nothing in nature starts or stops instantly. Use easing curves, not linear transitions.

| Easing | Use for |
|---|---|
| `ease-out` (fast start, slow end) | Elements entering the screen — feels natural arrival |
| `ease-in` (slow start, fast end) | Elements leaving the screen — feels intentional exit |
| `ease-in-out` | Elements moving between positions on screen |
| Spring physics | Interactive elements that respond to touch/drag |

Never use `linear` for UI motion — it reads as mechanical and unfinished.

### 7. Arcs
Natural movement follows arcs, not straight lines. Tooltips and popovers that scale from their origin point (rather than fading uniformly) follow this principle. `transform-origin` matters.

### 8. Secondary Action
A supporting motion that reinforces the main action. In UI: an icon inside a button that shifts slightly when the button is pressed. A checkmark that draws itself after a form submission. These details reward attention without demanding it.

### 9. Timing
Duration is meaning. Fast = responsive, energetic. Slow = weighty, important.

| Duration | Use for |
|---|---|
| 80–120ms | Micro-interactions (button press, hover) |
| 150–250ms | Component transitions (dropdown open, tooltip) |
| 250–400ms | Page-level transitions, modal entrance |
| 400–600ms | Hero animations, onboarding sequences |
| > 600ms | Almost always too long — the user is waiting |

### 10. Exaggeration
A small, deliberate overstatement makes an action feel satisfying. In UI: a success checkmark that overshoots slightly before settling, or a notification badge that pops just slightly larger than its final size. The exaggeration is 10–15%, not theatrical.

### 11. Solid Drawing (Solid Design)
Respect the depth and layering of the interface. Elements should move in ways consistent with their perceived layer — a bottom sheet slides up from below because it lives below the content, not from the side. A tooltip appears near its trigger, not across the screen.

### 12. Appeal
The overall motion should feel right for the brand. A playful consumer app can use bouncier, springier motion. A financial tool uses precise, controlled transitions. Appeal is not decoration — it is brand personality expressed through time.

---

## Cinematic Techniques

### Reveal and Entrance
Content that enters the viewport has more impact when it arrives, rather than simply existing. Scroll-triggered entrance animations — a section fading up as the user scrolls into it — borrow from cinematic reveals. The key: **the content drives in from a meaningful direction** (below, because that's where the user is scrolling from).

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Parallax
Background elements moving slower than foreground elements creates depth. In web: a hero background image moving at 50% scroll speed while content moves at 100% creates a sense of layers. Use subtly — aggressive parallax causes motion sickness.

### Cut vs Dissolve
- **Hard cut** (instant state change): fast, decisive, efficient. Use for navigation between pages, closing modals.
- **Dissolve / crossfade**: gradual, considered, connected. Use when two states are related — a tab switching, an image gallery transitioning.

### Scene Setting
The first frame of a section sets the scene before detail appears. A hero with a strong image and large type, followed by supporting details appearing after a brief delay, is a cinematic opening. The user's eye is directed to the subject before reading begins.

---

## Comic Book Conventions

### Panel Sequence
Comics tell stories through a sequence of static frames that imply motion between them. In UI: step indicators, onboarding carousels, and progress flows use the same logic — each "panel" is a moment in a sequence, and the user's eye moves between them.

### Speed Lines and Energy
Emphasis lines, radial gradients, and directional blur suggest motion and energy without actual animation. A button with a subtle directional gradient implies it is pointing somewhere. A loading indicator with trailing opacity implies direction.

### Typography as Tone
In comics, the size, weight, and style of lettering communicates emotion — a shout is set in large bold caps, a whisper in thin small italics. In UI: oversized display type for a hero carries energy; small muted caption text recedes. This is micro-typography as emotional register, not just hierarchy.

### The Gutter
In comics, the reader's imagination fills the space between panels. In UI, transitions are the gutter — what happens between states. A smooth transition lets the user's brain construct a coherent mental model. A jarring jump forces them to re-orient.

---

## Practical Rules

1. **Respect `prefers-reduced-motion`** — always. Users with vestibular disorders or motion sensitivity must be able to use the product without animation.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. **Motion should serve the user, not entertain them.** Every animation should answer: does this help the user understand what happened, where something came from, or where to look next?

3. **Duration under 400ms for almost everything.** If an animation takes longer, it is slowing the user down.

4. **Never animate layout properties** (`width`, `height`, `padding`, `top`, `left`) — they cause reflow. Animate `transform` and `opacity` only — they run on the GPU.

5. **One motion at a time per region.** Simultaneous competing animations create visual noise. Stage them.

## Review Checklist

- [ ] Does `prefers-reduced-motion` disable or reduce all animations?
- [ ] Are all transitions using `ease-out` (enter), `ease-in` (exit), or `ease-in-out` (reposition)?
- [ ] Is linear easing avoided?
- [ ] Are durations under 400ms for component-level transitions?
- [ ] Are only `transform` and `opacity` animated (not layout properties)?
- [ ] Do entrance animations move from a meaningful direction (bottom for scroll-reveal, origin for scale)?
- [ ] Does motion match brand tone (bouncy for playful, precise for enterprise)?
- [ ] Are staggered entrances used for list items rather than simultaneous appearance?

---

## Constituent Domain: semantic-html-and-seo

# Semantic HTML and SEO

Good HTML is not just markup — it is the contract between your content, search engines, assistive technologies, and the browser. Semantic HTML, correct metadata, and progressive enhancement make UI resilient, findable, and accessible by default.

---

## Semantic HTML5

Use the element that describes the content's meaning, not just its appearance.

### Document structure
```html
<header>       <!-- site header, logo, primary nav -->
<nav>          <!-- navigation links -->
<main>         <!-- primary page content, one per page -->
<article>      <!-- self-contained content: blog post, product card, news item -->
<section>      <!-- thematic grouping with a heading -->
<aside>        <!-- tangentially related content: sidebar, callout -->
<footer>       <!-- site footer, secondary links, copyright -->
```

### Headings
One `<h1>` per page — the primary topic. Headings form an outline: do not skip levels (`h1` → `h3` without `h2`).

```html
<h1>Product name</h1>
  <h2>Features</h2>
    <h3>Feature detail</h3>
  <h2>Pricing</h2>
```

### Interactive elements
```html
<button>   <!-- clickable action, submits or triggers JS -->
<a href>   <!-- navigation to a URL -->
<input>    <!-- user data entry -->
<select>   <!-- option selection -->
<details> / <summary>  <!-- native disclosure/accordion -->
```

Never use `<div>` or `<span>` as interactive elements without full ARIA annotation — and even then, prefer the native element.

---

## Images and Alt Text

Every `<img>` needs an `alt` attribute. What goes in it depends on context.

| Image type | Alt text |
|---|---|
| Informative (product photo, chart) | Describe content: `alt="Red leather sofa, three-seater"` |
| Functional (icon button, logo link) | Describe function: `alt="Go to homepage"` |
| Decorative | Empty: `alt=""` — screen readers skip it |
| Complex (chart, diagram) | Short alt + longer description nearby or in `<figcaption>` |

```html
<!-- Informative -->
<img src="sofa.jpg" alt="Red leather sofa, three-seater">

<!-- Decorative -->
<img src="divider.svg" alt="">

<!-- With caption -->
<figure>
  <img src="chart.png" alt="Bar chart showing revenue growth Q1–Q4 2025">
  <figcaption>Revenue grew 42% year-on-year in Q4 2025.</figcaption>
</figure>
```

---

## SEO Fundamentals

### Title and description
```html
<title>Product Name — Short descriptor | Brand</title>
<meta name="description" content="One or two sentences. What this page is, who it is for, what they will find.">
```

- Title: 50–60 characters. Most important keyword first.
- Description: 120–160 characters. Shown in search results — write for the human, not the algorithm.

### Canonical URL
```html
<link rel="canonical" href="https://example.com/the-definitive-url">
```

Prevents duplicate content penalties when the same page is accessible via multiple URLs.

### Open Graph (social sharing)
```html
<meta property="og:title" content="Page title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">

<!-- Twitter/X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page title">
<meta name="twitter:image" content="https://example.com/og-image.jpg">
```

OG image: 1200×630px. Appears when the URL is shared on Slack, LinkedIn, Twitter, iMessage.

### Structured Data (JSON-LD)
Machine-readable content enables rich search results.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://example.com/product.jpg",
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "EUR"
  }
}
</script>
```

Common types: `Product`, `Article`, `BreadcrumbList`, `FAQPage`, `Organization`, `SiteLinksSearchBox`.

---

## Progressive Enhancement

Build in layers. The core content and function must work without JavaScript. Enhance with CSS. Enhance further with JS.

```
Layer 1: HTML — content is readable, links work, forms submit
Layer 2: CSS  — layout, typography, visual design
Layer 3: JS   — interactivity, animations, dynamic content
```

**In practice:**
- Forms must submit via native `<form action>` without JS — JS can intercept and enhance with fetch
- Navigation links must be real `<a href>` — JS can add transitions
- Content must be in the HTML — JS can enhance with lazy-load or personalisation
- Images must have `src` — JS can add lazy loading via `loading="lazy"` (now native)

---

## SPA Considerations

Single-page applications break browser defaults that SEO and accessibility depend on. Fix them explicitly.

### Server-side rendering or static generation
Client-rendered HTML is not reliably indexed by search engines. Use SSR (Next.js, Nuxt, SvelteKit) or static generation for any content that needs to be found.

### Title and meta updates
Update `document.title` and meta tags on every route change. Use the framework's `<Head>` component or equivalent.

### Focus management
On route change, move focus to the new page's `<h1>` or `<main>` — screen readers do not detect SPA navigation automatically.

```js
// After route change
document.querySelector('h1')?.focus();
```

### Scroll restoration
Restore scroll position to top on navigation, or to the saved position on back navigation. Browser default scroll restoration is disabled in SPAs.

### History API
Use `pushState` / `replaceState` so back/forward navigation and bookmarking work correctly.

---

## Device Capabilities and User Context

Design and code should adapt to what the device and user can actually do.

### Client-side storage as a personalization tool
`localStorage`, `sessionStorage`, and other browser capabilities (cookies, IndexedDB, media/permission queries) are legitimate tools for tailoring the experience — last view mode, chosen locale, a dismissed banner, an in-progress draft, a returning user's context.

Guardrails:
- **Personalise from real understanding, not a guess.** What to persist and pre-fill safely usually needs customer testing — a wrong assumption in stored state is worse than a neutral default.
- **Scope and consent.** `sessionStorage` for one session, `localStorage` across sessions; never store anything sensitive client-side; honour consent.
- **Re-validate every 2–3 years.** Needs drift; a personalization that fit at launch becomes friction. Revisit, ideally with fresh testing.

### Input method detection
```css
@media (hover: hover) {
  /* hover states — mouse or trackpad */
  .btn:hover { background: var(--color-primary-hover); }
}

@media (hover: none) {
  /* touch device — no hover, larger targets */
  .btn { min-height: 44px; }
}
```

### Pointer precision
```css
@media (pointer: coarse) {
  /* fat-finger touch — increase target sizes */
  .interactive { min-height: 44px; min-width: 44px; }
}

@media (pointer: fine) {
  /* mouse — precise, can use smaller targets */
}
```

### Network conditions
```html
<!-- Lazy load images below the fold -->
<img src="product.jpg" loading="lazy" alt="...">

<!-- Serve modern formats with fallback -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>
```

### User preferences
```css
@media (prefers-reduced-motion: reduce) { /* disable animations */ }
@media (prefers-color-scheme: dark)     { /* dark mode tokens */ }
@media (prefers-contrast: more)         { /* increase contrast */ }
@media (forced-colors: active)          { /* Windows high contrast mode */ }
```

---

## Review Checklist

- [ ] One `<h1>` per page, headings form a logical outline
- [ ] Semantic elements used: `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`
- [ ] Every `<img>` has a meaningful `alt` or `alt=""` for decorative images
- [ ] `<title>` is unique per page, 50–60 characters, keyword-first
- [ ] `<meta name="description">` present and 120–160 characters
- [ ] Open Graph tags present on all shareable pages
- [ ] `<link rel="canonical">` on pages accessible via multiple URLs
- [ ] Structured data (JSON-LD) on product, article, and FAQ pages
- [ ] Forms work without JavaScript
- [ ] SPA updates `document.title` and meta tags on route change
- [ ] SPA moves focus on route change
- [ ] Hover states scoped to `@media (hover: hover)`
- [ ] Touch targets ≥ 44px on `@media (pointer: coarse)`
- [ ] Images use `loading="lazy"` below the fold
- [ ] `prefers-reduced-motion` respected

---

## Auditor Defense Checklist & Quality Gate

Whenever acting as or validating against this Master Skill, verify each of the following golden criteria:

- [ ] **Universal 5-State Matrix**: Are Empty, Loading, Populated, Boundary, and Error states fully visualized with exact geometry and messaging?
- [ ] **Identical Geometric Skeletons**: Do skeleton loaders match the exact dimensions, radii, and positions of resolved content to prevent layout shifts (CLS < 0.1)?
- [ ] **Notification & Recovery**: Do destructive actions include explicit confirmation or undo toasts placed in non-blocking locations (bottom-right)?
- [ ] **WCAG 2.2 AA Compliance**: Do all text and interactive elements maintain >= 4.5:1 contrast (3:1 for large text), with explicit non-color indicators for status and visible focus rings?
- [ ] **Error Guidance & Remediation**: Does every error state explain what went wrong and provide an actionable, one-click recovery path?
- [ ] **Motion & Performance Budget**: Are all transitions <= 200ms with ease-out, respecting prefers-reduced-motion media query?
