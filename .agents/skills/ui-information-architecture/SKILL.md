---
name: ui-information-architecture
description: Master information architecture skill covering visual hierarchy, Gestalt UI organization, UI density by viewport/context, layout paradigms, responsive strategies, and attention mapping. Generates Sections A-C of design-spec.md.
---

# UI Information Architecture & Spatial Hierarchy Master Skill

> **Domain Scope**: Fuses 9 specialized visual design skills into an authoritative, multi-perspective Master Skill.

## Constituent Skills Index

- [information-architecture](#constituent-domain-information-architecture)
- [gestalt-ui-organisation](#constituent-domain-gestalt-ui-organisation)
- [ui-density](#constituent-domain-ui-density)
- [layout-paradigms-and-consistency](#constituent-domain-layout-paradigms-and-consistency)
- [responsive-paradigms](#constituent-domain-responsive-paradigms)
- [visual-emphasis-and-hierarchy](#constituent-domain-visual-emphasis-and-hierarchy)
- [ui-context-and-scope](#constituent-domain-ui-context-and-scope)
- [user-flows-and-guided-paths](#constituent-domain-user-flows-and-guided-paths)
- [dembrandt](#constituent-domain-dembrandt)

---

## Constituent Domain: information-architecture

# Information Architecture

In small products, users find their way by exploring. In large applications — multi-module SaaS, ERPs, analytics platforms, marketplaces — exploration breaks down. The structure itself must do the navigational work. Information architecture is the design of that structure: what exists, what it is called, and how it relates to everything else.

Good IA is invisible. Users find what they need without thinking about the structure. Bad IA forces users to hold a map in their head.

---

## Naming is Design

The names given to entities, sections, and actions are one of the most consequential design decisions in a large application. Bad names create cognitive friction on every visit.

**Principles:**

- **Use the user's vocabulary, not the engineer's.** If users call it a "job", do not call it a `task_assignment`. If they call it a "client", do not surface `contact_entity`.
- **Be specific.** "Settings" is vague. "Account settings", "Workspace settings", "Notification preferences" tell the user exactly where they are.
- **Be consistent.** If it is called "Project" in the sidebar, it must be called "Project" in the breadcrumb, the page title, the confirmation dialog, and the API error message.
- **Distinguish similar things.** If the product has both "Users" and "Members", the distinction must be meaningful and consistently communicated.
- **Name actions by their effect.** "Archive" not "Hide". "Publish" not "Save to live". "Transfer ownership" not "Change user".

**Naming audit questions:**
- Would a new user understand this term without training?
- Is this name used consistently across every surface it appears?
- Does this name describe what the thing *does*, not how it is stored?

### Internal vocabulary is not customer vocabulary
The terms a company uses internally are frequently *not* the terms the customer should see. An internal casual shorthand ("the recon job", "a P2 ticket") is precise for the team but opaque to an outsider. When a term crosses from the internal build into the customer-facing app, translate it to **the customer's word, or a universally understood one** — never ship the internal shorthand by default.

- **Introduce as few new terms as possible — a hard ceiling of ~10 invented terms for the whole product, and fewer is always better.** Every new coined term is something the user must learn before they can act. Prefer terms so universal that the end user already knows them over anything you'd have to teach.
- **Placement tells half the story.** Where a feature sits — which section, which nav group, next to what — communicates as much as its label. A well-placed control needs less naming; a well-named control in the wrong place still confuses. Design the location and the name together.

### Label length: buttons are terse, titles continue the story
- **Buttons: 1 word, ideally — 2 is fine, 3 is the maximum.** A button is an action verb, not a sentence. "Save", "Publish", "Invite member".
- **Titles and headings carry the fuller explanation.** Let the surrounding title, section header, or helper text extend the narrative that the button can only hint at. The button says *what*; the title says *what this whole area is about*.

---

## Mental Model Follows Data Model

The UI should be a direct, legible expression of the underlying data model. Users build a mental model of the product by interacting with it — that mental model should match how the data actually works.

**Match entities to screens.** Each major data entity (Project, Invoice, User, Product) typically deserves its own list view and detail view. Do not collapse distinct entities into one screen because it seems simpler — users will be confused when one action affects something they did not see.

**Expose relationships.** If a Project contains Tasks, and Tasks belong to Users, the UI hierarchy should reflect this:

```
Projects
  └── Project: Website Redesign
        └── Tasks
              └── Task: Fix header  [Assigned to: Maria]
```

Breadcrumbs, parent labels, and contextual references ("3 tasks in this project") reinforce the data relationships visually.

**Show transformation paths.** The UI should make it clear how data moves through the system. A draft becomes published. An invoice moves from pending to paid. A user is promoted to admin. These state transitions should be visible:

- Status labels that show current state and available transitions
- Action buttons labelled with the transformation: "Publish", "Mark as paid", "Promote to admin"
- Timeline or history showing past transitions

**Signal the scope of actions.** Before a user commits to an action, they must understand what it will affect:

```
"Archive this project?"
This will also archive 47 tasks and remove it from all dashboards. 
Team members will lose access immediately.
[Cancel]  [Archive project]
```

---

## Confirm Dialogs for Dangerous Actions

Any action that is irreversible, affects a wide scope, or causes data loss requires explicit confirmation before execution. The confirm dialog is not a courtesy — it is a contract with the user.

**When a confirm dialog is required:**

| Action type | Example | Dialog required |
|---|---|---|
| Permanent deletion | Delete project, remove user | Always |
| Bulk destruction | Delete all items in a filter | Always |
| Irreversible state change | Publish, Submit, Send | Yes if no undo |
| Wide-scope change | Transfer ownership, change billing plan | Always |
| Account-level action | Cancel subscription, delete account | Always |
| Permission escalation | Grant admin access | Yes |

**Confirm dialog anatomy:**

```
[Title: specific, not generic]
"Delete project: Website Redesign?"

[Body: scope and consequences]
"This will permanently delete:
• 47 tasks
• 3 milestones
• All associated files

This cannot be undone."

[Secondary action]  [Destructive primary action]
    [Cancel]              [Delete project]
```

**Rules:**
- Title names the specific entity — "Delete project: Website Redesign?" not "Are you sure?"
- Body states exactly what will be affected and whether it can be undone
- The destructive action is labelled with the action, not "OK" or "Yes"
- The destructive action is visually distinct: red fill, or positioned on the right
- Cancel is always available and is the default focus (keyboard enter should not trigger deletion)
- For the highest-risk actions (account deletion, irreversible bulk operations), require the user to type the entity name to confirm

**What not to use a confirm dialog for:**
- Saving or updating (autosave + undo is better)
- Navigation away from unsaved changes (use an unsaved changes warning banner instead)
- Low-stakes reversible actions (archiving with an unarchive option)

---

## Navigation Structure in Large Applications

IA manifests most visibly in navigation. As products grow, navigation must scale with them.

**Flat is fast, deep is findable.** Aim for no more than 3 levels of hierarchy in primary navigation. If the product requires more, introduce grouping and search rather than more levels.

**Group by user goal, not by product feature.** Users navigate to accomplish tasks. Group navigation items around what users want to do, not around how the backend is organised.

```
Bad:  Settings → Integrations → Webhooks → Event types
Good: Developer → Webhooks
```

**Progressive disclosure for power users.** Show the most-used sections in primary navigation. Secondary features live in settings, secondary nav, or are reached via search. Do not surface every feature at the top level.

**Global search as escape hatch.** In large applications, search reduces the navigation burden. Users who know what they want should never have to navigate through 4 levels to find it.

**Logo as Home.** The product logo should always be an interactive link leading back to the primary landing page or dashboard. This is a universal user expectation — a "reset button" for navigation.

**Global Header Consistency.** In applications with deep hierarchy, keep the primary header and top-level navigation consistent across all views. Changing the global navigation based on the user's current depth disorients them and removes their easy path back to other content.

**Persistent context.** In deeply nested views, the user must always be able to answer: where am I, what does this belong to, and how do I get back?
- **Shallow hierarchy (1–2 layers):** Use a simple "← Back to [Parent]" link. Breadcrumbs (Home > Parent > Current) often add unnecessary visual noise for simple structures.
- **Deep hierarchy (3+ layers):** Use breadcrumbs to provide a clear map of the user's location and an easy path to any parent level.

Use parent labels and contextual headers to reinforce the current location.

## Hide, Don't Delete — but Don't Serve It Up Front Either

When a feature or control adds density but a subset of users still needs it, you have three moves, not two. The mistake is treating it as a binary of *show it* or *remove it*.

1. **Surface it** — primary, always-visible. Reserve this for the actions on the main user path.
2. **Remove it** — if a control isn't earning its space and nobody's flow depends on it, cut it. Fewer, clearer controls beat a complete-but-noisy surface.
3. **Hide behind an opening/closing element** — the middle path, and often the right one. Move secondary functionality into a modal, drawer, accordion, popover, or expandable panel: **discoverable but not immediately present.** The element stays one interaction away, so the default view stays calm.

**Deliberate friction is a feature.** Place the reveal at the flow step where the user needs it — don't pre-load every option. Same instinct as the H1–H3 discipline (see `modular-scale-typography`): when a view sprouts deeper hierarchy, push the secondary layer into an opening/closing element.

Choose the container by the content's weight: **accordion/expandable** for inline detail the user reads in place, **popover/drawer** for a short secondary task, **modal** for a focused sub-task or confirmation that must interrupt.

---

## Review Checklist

- [ ] Are entity names derived from user vocabulary, not system terminology?
- [ ] Is the same name used consistently across every surface (nav, breadcrumb, dialog, error)?
- [ ] Does the UI hierarchy reflect the data model hierarchy?
- [ ] Are data state transitions (draft → published, pending → paid) clearly visible and labelled?
- [ ] Does every action communicate its scope before the user commits?
- [ ] Do all irreversible or wide-scope actions have a confirm dialog?
- [ ] Does the confirm dialog name the specific entity and list consequences?
- [ ] Is the destructive action in the confirm dialog labelled with the action, not "OK"?
- [ ] Is Cancel the default focus in confirm dialogs?
- [ ] Is primary navigation grouped by user goal, not product feature?
- [ ] Is global search available for products with more than 3 navigation levels?
- [ ] Does the product logo link back to the landing page or primary dashboard?
- [ ] Is the primary header and global navigation consistent across all views, regardless of depth?
- [ ] Are back links used for shallow hierarchies (1–2 layers) and breadcrumbs for deep hierarchies (3+ layers)?

---

## Constituent Domain: gestalt-ui-organisation

# Gestalt UI Organisation

UI should be organised so that the visual structure communicates relationships — which commands, controls, and elements belong together — without requiring users to read labels or documentation.

## Core Gestalt Principles for UI Layout

### 1. Proximity
Elements that are close together are perceived as a group.

- Place related controls (e.g. Bold / Italic / Underline) close together with minimal gap between them
- Separate unrelated groups with larger whitespace
- Do not use lines or borders as the primary grouping mechanism — proximity alone should convey the relationship

**Example:** A toolbar with `[Cut] [Copy] [Paste]` grouped tightly, then a wider gap before `[Undo] [Redo]`, communicates two distinct command groups without any visual divider.

#### Prefer whitespace over separator lines
Default to **whitespace, not divider lines**, for grouping. Most separators do work that spacing does better — they add noise and a "boxed-in" feel without adding information. Remove the majority and let proximity carry the grouping.

Caveat: a line takes almost no space, so removing it leaves groups too close. **Removing separators usually means adding spacing** — budget the whitespace (occasionally a subtle background or heading) rather than just deleting the line and leaving the layout cramped.

### 2. Similarity
Elements that look alike are perceived as related.

- Use consistent colour, shape, size, and iconography within a functional group
- Differentiate groups through visual contrast (shape, fill, size) — not just position
- Primary actions and secondary actions should look visually distinct from each other

**Example:** Destructive actions (Delete, Remove) use a different colour than constructive actions (Save, Add), signalling different intent groups.

### 3. Common Region
Elements enclosed in a shared region are perceived as a group.

- Use cards, panels, or background fills to enclose logically related content
- Avoid wrapping unrelated elements in the same container
- Nested regions should reflect nested logical hierarchy

**A region needs no border — but a borderless one needs air.** Enclosure can come from a border/fill *or* from whitespace alone. When a card has no border or background, generous internal padding and a clear gap to its neighbours are what make it read as one region; without a border doing that job, cut the air and separate cards collapse into one blur. Borderless is fine — cramped-and-borderless is not.

**Example:** Form sections grouped in bordered cards signal that fields inside each card form a logical unit.

### 4. Connectedness
Elements connected by lines or visual links are perceived as related.

- Use connectors, lines, or flow arrows only when a genuine relationship exists
- In navigation trees or node-based editors, visible connections should match data relationships exactly

### 5. Figure / Ground
Users distinguish foreground interactive elements from background context.

- Interactive controls should have sufficient contrast against their background
- Disabled or contextual information should visually recede (lower contrast, smaller weight)
- Modals and overlays must clearly separate from the underlying content layer

### 6. Continuity
The eye follows smooth paths and lines.

- Align related controls along a consistent axis (left edge, baseline, or centre line)
- Avoid breaking alignment within a logical group
- Grid-aligned layouts reinforce groupings through shared axis continuity

## Review Checklist

When reviewing a UI layout for Gestalt compliance:

- [ ] Can a new user identify which controls belong together without reading labels?
- [ ] Is proximity used as the primary grouping signal (not only borders/lines)?
- [ ] Do visually similar elements share a functional purpose?
- [ ] Are unrelated groups separated by meaningful whitespace?
- [ ] Have unnecessary divider lines been removed in favour of whitespace (with spacing added to compensate)?
- [ ] Does visual hierarchy match interaction hierarchy (primary > secondary > tertiary)?
- [ ] Are destructive or irreversible actions visually distinct from constructive ones?
- [ ] Is the figure/ground contrast sufficient for all interactive elements?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| All buttons same size and colour regardless of function | Similarity principle violated — implies all actions are equivalent | Differentiate primary, secondary, destructive visually |
| Related controls spread across distant areas of the screen | Proximity violated — user cannot perceive the relationship | Co-locate related controls |
| Overuse of divider lines to group elements | Relies on decoration rather than spatial logic | Use whitespace and proximity instead |
| Identical whitespace between all elements | No grouping signal — everything reads as a flat list | Apply 8pt/4pt spacing scale: tight within group, loose between groups |
| Mixed icon styles within one toolbar | Similarity broken — implies different functional families | Use a single consistent icon set and weight per toolbar |

---

## Constituent Domain: ui-density

# UI Density

Density describes how much information and how many interactive elements appear in a given area. The right density is not a universal standard — it depends on platform, user type, and session context.

## Platform Defaults

| Platform | Default density | Reason |
|---|---|---|
| Desktop | Medium to high | Large screen, precise input, often primary work surface |
| Tablet | Medium | Touch input, larger than phone but less than desktop |
| Mobile | Low | Small screen, touch targets need space, interrupted sessions |

Never port a dense desktop layout directly to mobile. Remove, collapse, or deprioritise features rather than shrinking them.

## User Type and Density

| User type | Appropriate density | Examples |
|---|---|---|
| Power user / enterprise | High density acceptable | Trading platforms, ERP, analytics, developer tools |
| Occasional / general user | Medium — clear visual breathing room | SaaS dashboards, project management |
| Consumer / first-time user | Low — guided, uncluttered | Onboarding flows, consumer apps, e-commerce |

A trading platform operator sits in the product for 8 hours a day and has learned every pixel — high density serves them. A user visiting a settings page once a month needs clear space and obvious labels.

**Domain experts tolerate complexity — if it solves the *right* problem quickly.** People who know the domain (especially in internal tools) will happily use dense, complex, feature-rich interfaces, because the complexity maps to a mental model they already hold. Two conditions make this work rather than overwhelm:

- **Terminology matches their vocabulary.** The labels, abbreviations, and jargon are the ones they already use. A term that's opaque to a consumer is a precise, fast signal to an expert — don't dumb it down for an audience that isn't there.
- **The outcome stays quickly reachable.** Density is fine as long as the *result* — the answer they came for, or the action they need — is fast to see or do, typically through an obvious **primary action** (see [[visual-emphasis-and-hierarchy]]). Complexity that surrounds a clear path to the outcome is power; complexity that buries the outcome is clutter.

Design a **power-user mode** around this: high density, expert terminology, keyboard-driven, primary action always in reach — distinct from a **casual/first-time mode** that guides and unclutters. The same product may offer both; match the mode to who is actually using the view.

## Density Tokens

Define spacing scale with density in mind. A compact variant reduces padding without changing structure:

```css
/* Default density */
--density-row-height:    44px;
--density-cell-padding:  var(--space-3) var(--space-4);
--density-gap:           var(--space-4);

/* Compact (enterprise / data-heavy) */
[data-density="compact"] {
  --density-row-height:    32px;
  --density-cell-padding:  var(--space-2) var(--space-3);
  --density-gap:           var(--space-2);
}

/* Spacious (consumer / onboarding) */
[data-density="spacious"] {
  --density-row-height:    56px;
  --density-cell-padding:  var(--space-4) var(--space-6);
  --density-gap:           var(--space-6);
}
```

## Feature Count by Platform

Not every feature belongs on every platform. For each feature ask: does a mobile user need this right now?

| Priority | Mobile | Tablet | Desktop |
|---|---|---|---|
| Core task | Always | Always | Always |
| Secondary actions | Collapsed (menu/sheet) | Visible | Visible |
| Filters and sorting | Accessible but not persistent | Collapsible | Persistent sidebar or toolbar |
| Bulk actions | Hidden or minimal | Reduced | Full |
| Advanced settings | Link to separate screen | Link or panel | Inline or panel |
| Data visualisation | Simplified (key metric only) | Reduced chart | Full chart |

## Density and Feature Reduction on Mobile

Sections and features can be removed, collapsed, or repositioned on smaller viewports — not just resized.

- **Remove:** Decorative sidebars, secondary data columns, promotional banners
- **Collapse:** Filters, advanced options, secondary navigation into accordions or bottom sheets
- **Reposition:** Toolbars move from top to bottom (thumb reach), sidebars move to drawers
- **Simplify:** A multi-column data table becomes a card list; a full chart becomes a single key metric

Progressive disclosure is the principle: show the minimum needed to complete the primary task, reveal more on demand.

## Reading Is Time

The most under-counted cost in a dense UI is **reading**. Every word the user must read to orient themselves is time spent, and it compounds — the more there is to read, the slower the whole interface feels, on every visit. Density is not just "how much fits on screen"; it's "how much the user has to *read* to act." Reduce that load:

- **Cut words before you shrink them.** The fix for a cramped screen is usually less content, not smaller type (see [[modular-scale-typography]]).
- **Let recognisable icons replace reading** where a concept has an unambiguous, standard icon — the eye recognises a shape faster than it reads a word (see [[brand-visual-language]]).
- **But don't over-ice with icons.** A wrong or decorative icon adds a thing to interpret instead of removing one; and an icon on everything is its own noise. Right icon, relevant place only.
- **Front-load the scannable bit.** Put the word or number the user scans for at the start of the line/label, so they don't read the whole thing to find it.

The goal: a user should be able to *glance*, not *read*, to know where they are and what to do next.

## Review Checklist

- [ ] Is the density appropriate for the primary platform (desktop = can be denser, mobile = must be sparse)?
- [ ] Is the density appropriate for the user type (power user = higher density, consumer = more space)?
- [ ] Are spacing tokens used to define density — not one-off padding values?
- [ ] On mobile: are secondary features collapsed, repositioned, or removed rather than shrunk?
- [ ] Are touch targets ≥ 44×44px even in compact density variants?
- [ ] Is a density toggle offered for enterprise tools where users have strong personal preferences?

---

## Constituent Domain: layout-paradigms-and-consistency

# Layout Paradigms and Consistency

A layout is not a neutral container you pour content into. The layout paradigm you choose is part of the argument about how the content should be read, compared, and acted on. Two products showing the same data can communicate completely different things depending on whether that data is a feed, a table, or a board.

This skill operates at the **macro scale** of consistency. It sits above [[component-family-consistency]] (the *meso* scale — buttons and inputs sharing one DNA) and above token-level consistency like [[button-states]], [[status-colors-and-errors]], and [[modular-scale-typography]] (the *micro* scale). Consistency is not one rule — it is the same discipline applied at three altitudes.

## Consistency operates at three scales

| Scale | What stays consistent | Where it lives |
|---|---|---|
| **Estate** | Brand chassis and shared shell across *separate applications* | *this skill, Part 3* + [[app-shell]] |
| **Macro** | Layout paradigm and page skeleton across screens | *this skill* |
| **Meso** | Component family — shared radius, height, colour logic | [[component-family-consistency]], [[brand-visual-language]] |
| **Micro** | States, tokens, type scale, semantic colours | [[button-states]], [[status-colors-and-errors]], [[modular-scale-typography]], [[algorithmic-color-palette]] |

A product can have perfect tokens and a coherent component family and still feel broken — because every screen is laid out differently and the user re-orients on every navigation. Macro consistency is what makes a product feel like *one* application.

---

## Layout is downstream — it serves something upstream

A layout paradigm is never the starting point. It is a *consequence* of decisions made earlier, and a *means* to ends defined elsewhere. Choosing a layout in isolation — "let's use a dashboard because dashboards look impressive" — is the most common way layouts go wrong.

**It flows down from information architecture.** The data model and structure ([[information-architecture]]) largely *determine* the candidate paradigms. Entities that move through states want a board; records compared on shared fields want a table; a hierarchy of containers and items wants master–detail. If the IA says "tasks belong to projects and have a status," the layout has already half-decided itself. Get the IA right first, then read the paradigm off it.

**It serves the brand and the story.** The same content can be laid out to feel calm or urgent, premium or utilitarian, editorial or operational. Layout is one of the loudest carriers of brand tone ([[brand-visual-language]]) and of the narrative you want the user to experience ([[motion-and-storytelling]]). A spacious single-focus layout tells a different story than a dense dashboard of the same data. Ask: *what should the user feel here, and what are we trying to say?* — then pick the paradigm that says it.

**It serves the user experience.** Ultimately the test is the user's task and context: what are they trying to do, how often, on what device, under what pressure ([[ui-density]], [[responsive-paradigms]]). The paradigm that best serves the task wins, even when a flashier one is available.

So the order is: **IA and brand intent first → derive the paradigm that supports them → then apply consistency.** Part 1 is how you derive it; Part 2 is how you keep it.

---

## Part 1 — Choose the paradigm that fits the content

Start from the nature of the content and the primary task, not from a default grid. Ask: *what relationship between items matters most here?* The answer points to a paradigm.

| Content nature / primary task | Layout paradigm | Why it fits | When NOT to use it |
|---|---|---|---|
| A stream of recent, homogeneous items, consumed top-down | **Feed** | Recency and flow are the message; infinite, low-commitment scanning | When items must be compared field-by-field, or order is not temporal |
| Items moving through stages of a workflow | **Board / Kanban** | Columns make state visible and transitions physical (drag) | When there are no discrete stages, or items have many attributes to compare |
| Many records compared across the same fields | **Table** | Aligned columns make values directly comparable; sort/filter is natural | When records are visual or heterogeneous, or on small screens |
| Browsing visual, heterogeneous items | **Gallery / Grid** | The artifact itself is the content; thumbnails carry meaning | When precise values matter more than the visual |
| A list plus the detail of the selected item | **Master–detail / Split** | Keeps context while drilling in; fast scanning + deep reading | On mobile where two panes don't fit (collapse to drill-down) |
| At-a-glance overview of many metrics | **Dashboard** | Spatial arrangement lets the eye triage what needs attention | When the user has one task, not monitoring — it becomes noise |
| Spatial relationships, free arrangement | **Canvas** | The user's spatial model *is* the data (diagrams, design, maps) | When content is inherently linear or ordered |
| Events ordered in time | **Timeline** | Time is the primary axis; gaps and density are meaningful | When time is just one of many equal attributes |
| Geographic data | **Map** | Location is the primary dimension | When location is incidental to the task |
| One object, one task, full attention | **Single-focus / Wizard** | Removes everything but the current decision | When the user needs surrounding context to decide → see [[user-flows-and-guided-paths]] |
| Persuading a stranger who has not bought in yet | **Narrative long-scroll** | Sequence *is* the argument — each section earns the next scroll | Inside the product, where the user has already committed and wants to work |

The paradigm interacts with other layout skills: it must group coherently ([[gestalt-ui-organisation]]), establish one clear emphasis ([[visual-emphasis-and-hierarchy]]), reflect the data model and naming ([[information-architecture]]), and adapt — not merely shrink — across breakpoints ([[responsive-paradigms]]). Where a real-world metaphor reinforces the paradigm (a board feels like cards on a wall), lean on it ([[real-world-metaphors]]).

**A view can offer more than one paradigm.** A collection of records is legitimately a table *and* a gallery *and* a board, chosen by the user per task — see [[data-display-and-selection]]. The point is that each option is a *deliberate* fit, not an accident.

### The narrative long-scroll — the product narrative framework

Marketing and landing pages are the one paradigm where **sequence is the argument.** Every other paradigm arranges content the user already wants; this one earns each scroll from someone who has committed to nothing. Judge a landing page by how it carries a stranger through these beats — not by whether the sections look good in isolation.

| # | Beat | The job | Typical treatment |
|---|---|---|---|
| 1 | **Hook** | Stop the *right* visitor and make them want to keep reading | Large headline, generous whitespace, supporting line, product shot / video / demo alongside |
| 2 | **Problem empathy** | Prove you understand the visitor's current situation | Named pains — slow, costly, manual, unreliable, scattered, hard to source |
| 3 | **USP** | What it is, who it's for, why it's different — in one sentence | One clear statement, given room |
| 4 | **Value propositions** | The 3–5 differentiated benefits | Benefit phrasing, not feature or spec nouns |
| 5 | **Proof points** | A reason to believe each claim | Whatever counts as evidence in the field — customers, figures, case studies, certifications, test data, materials, stock and delivery times, before/after |
| 6 | **How it works** | Remove uncertainty about mechanism and effort | Three steps, in the field's own terms — order/fit/measure, connect/process/result, browse/try/return |
| 7 | **Stakes** | What it costs to do nothing | Downtime continues, competitors move, time and money leak, the problem recurs |
| 8 | **Call to action** | The obvious next step | A verb the visitor can picture doing |

The beats are the same everywhere — B2B and B2C, software and physical goods, a global manufacturer and a local shop. What changes is their **weight and their evidence.** An industrial or spare-parts buyer wants proof, specification, fit and availability, and will read further to get it; a fashion or consumer page carries the hook in the imagery itself and reaches the CTA in far less scrolling; an internal tool's page can skip persuasion but still owes the visitor *what this is, why it exists, how to start*. Decide which beats carry the load for **this** audience before deciding what the page looks like.

**The hook is a question, not a summary.** A good hero states one value and leaves the visitor thinking *"I want to see how this works."* It gets that from size and air, not decoration ([[visual-emphasis-and-hierarchy]]). If the short headline is not explanatory enough alone, add a smaller supporting line under it rather than lengthening the headline. Pair it with the product actually running — screenshot, video, or live demo, never a mockup of behaviour the product does not have ([[authentic-product-representation]]).

**Value propositions are benefits, not features.** "AI dashboard" and "14 mm hardened steel" are nouns; "the numbers that matter at a glance" and "survives a season of gravel roads" are what the visitor gets. A line that could sit unchanged on a competitor's page is not a value proposition.

**Every claim carries proof.** The bolder the claim, the harder the evidence. What counts as hard evidence is set by the field, not by fashion — a test report and a fitment guarantee do the work a customer logo does elsewhere. Unproven superlatives cost credibility on the claims that *are* true.

**Stakes come from consequence, not pressure.** State what standing still costs. Manufactured scarcity — fake countdowns, invented "3 spots left" — spends the trust the rest of the page just built.

**The CTA names the action.** "Learn more" describes nothing. "Start free", "Check fitment", "Request a quote", "Find your size" tell the visitor what happens next, and hand off to a flow that delivers exactly that ([[user-flows-and-guided-paths]]).

#### The question chain

The narrative works because it answers the visitor's questions in the order they arise:

> What is this? → Is it for me? → Why is it better? → Can I trust it? → How does it work? → How much effort is this? → What do I do next?

This is the sharpest test here. Walk the page top to bottom and mark where each answer lands. If the visitor has to hunt or scroll back, the narrative is broken however good the sections look. Answering early is a defect too — pricing above the fold answers *"how much effort?"* to someone still asking *"what is this?"*.

#### What the strongest pages share

The best pages in every sector — a developer platform, a machine-tool supplier, a clothing label, a regional garage — converge on the same discipline:

- **One message per viewport** — each section answers exactly one question in the chain.
- **No more copy than the beat needs** — persuasion sections stay short and carried by whitespace, while specification and proof sections are allowed the detail a serious buyer came for.
- **Real product imagery and video** over abstract illustration or stock photography.
- **Benefit to proof, fast** — claims do not stack up unsupported.
- **The CTA repeats down the page**, so the visitor can act the moment they are convinced.
- **One visual rhythm** — section spacing, type scale, and imagery treatment repeat ([[modular-scale-typography]], [[brand-visual-language]]).
- **Restrained motion** that supports the sequence instead of competing with it ([[motion-and-storytelling]]).

Density here is the deliberate *opposite* of an expert tool ([[ui-density]]). A landing page serves someone who owes you no attention; a dashboard serves someone who has already committed. Do not import habits from one into the other.

---

## Part 2 — Reuse the paradigm consistently across the application

Once a paradigm is chosen for a kind of content, every screen of that kind uses the same paradigm and the same page skeleton. This is what lets a user learn the product once.

### Page skeletons should be templates, not one-offs

Define a small set of page templates and reuse them:

- **List / index page** — same position for title, filters, view-mode toggle, primary action, and the collection itself, on *every* list page.
- **Detail page** — same skeleton for every detail screen: header (name + status + primary actions) → key attributes → related content → activity. When a user learns one detail page, they have learned them all.
- **Editor / form page** — consistent placement of the form body, validation summary, and the save/cancel actions → see [[form-design]].
- **Settings page** — consistent section structure and control alignment.

### What must stay in the same place across pages

- **Navigation** — global nav, breadcrumbs, and back affordances do not move between screens ([[ui-context-and-scope]]).
- **Primary action** — the main CTA sits in the same region on comparable pages, not top-right on one and bottom-left on the next.
- **Persistent chrome** — headers and toolbars behave consistently ([[sticky-and-fixed-elements]]).
- **Status and feedback** — toasts, banners, and inline errors appear in consistent locations ([[notifications-and-recovery]]).

This is **internal consistency** in Nielsen's terms (heuristic 4) — see [[nielsen-usability-heuristics]]. Familiar patterns within one application beat novel ones on every screen.

### Balance feature weight across pages

Pages of the same kind should carry a **roughly comparable amount of feature and content weight.** When one page keeps accreting features while a sibling stays thin, the imbalance is usually a *structural* signal, not a content-writing problem — it means features should be **consolidated or split** so the load is distributed. Aim to keep page count and page lengths balanced over the long run, not perfectly equal on any given day.

**When a page is too thin** — it has too little to justify its own screen:
- Fold it back into a neighbouring page, or pull a related feature onto it.
- On marketing/general surfaces, adding an image, a short video, or links to related pages is a legitimate way to give a light page substance.
- In **professional / expert tools**, resist decorative filler — a power user reads it as noise. Prefer **small contextual pulls of genuinely relevant information from elsewhere** (a related metric, a recent activity item, a linked entity) over image/video padding.

**When a page is too heavy** — it has accreted more than one screen's worth:
- **Split it out** into its own page (often the same trigger as reaching H4–H6 headings — see [[modular-scale-typography]]).
- **Move** part of it to where it more naturally belongs.
- **Shrink the feature** by crystallising its core idea — cut to the one thing it must do, rather than exposing every option (pairs with the hide-don't-serve-up-front decision in [[information-architecture]]).

### When to deviate — and how

Consistency is the default, not a cage. Deviate when a screen's task genuinely differs (a focused checkout step legitimately drops the global nav). When you deviate:

- Do it for a clear reason tied to the task, not for visual variety.
- Deviate *completely and obviously* (a distinct mode), never subtly — a layout that is almost-but-not-quite the standard reads as a bug.
- Keep the deviation itself consistent: if focus mode hides nav, every focus-mode screen hides it the same way.

---

## Part 3 — Consistency across an estate of separate applications

Parts 1 and 2 assume one application. Most organisations of any size do not have one — they have an estate: a public site, a shop, a customer portal, an internal admin tool, and older systems nobody wants to touch. Different codebases, different teams, different decades. The user crosses between them in a single working day, and internally-facing software carries the brand experience just as externally-facing software does — the employee is a user too.

Keep the shell in proportion while doing this. A user's sense of a company forms across everything they meet — search results and the favicon in them, social channels, advertising, partner and affiliate pages, app store listings, transactional email, invoices, support chat, error pages, status pages, job ads. The product's chrome is one slice of that, and often not the largest. Which is also the good news: a separate application frequently needs no more than the right favicon, two or three of the brand's colours, and the logotype to belong to the family.

The instinct is to make them all look the same. That is the wrong target, and chasing it is how estate-wide design programmes die: the admin tool gets marketing's generous whitespace and becomes unusable, or the marketing site gets the admin tool's density and becomes lifeless.

### Not every application is from the same tree

A B2B internal detail view for master data and a B2C campaign page from the same company *should* look different. They serve different people doing different things under different pressure. What must not differ is the layer beneath the styling.

**The brand chassis — identical everywhere, no exceptions.** A difference here is a defect:

- Logotype and its clear space
- Brand hue and the semantic status colours — red means the same thing in every tool ([[status-colors-and-errors]])
- Typeface family
- Focus ring treatment ([[wcag-accessibility]])
- The look of a destructive action and the shape of its confirmation ([[information-architecture]])
- Date, number, and currency formatting
- The voice of system messages ([[notifications-and-recovery]])
- The accessibility floor

**The expression layer — varies deliberately by audience and task.** A difference here is a design decision, and it should be a stated one:

| Axis | Marketing / B2C surface | Internal / operational tool |
|---|---|---|
| Density | Generous, one idea per screenful | Dense, maximum information per glance ([[ui-density]]) |
| Type scale ratio | 1.333–1.5, expressive display sizes | 1.2, tight and functional ([[modular-scale-typography]]) |
| Imagery | Central — photography, illustration, video | Near-absent; the data is the picture |
| Motion budget | Storytelling and reveal ([[motion-and-storytelling]]) | Feedback only — confirm the action, nothing more |
| Error tone | Reassuring, plain language | Terse and actionable: *Row 412: VAT number missing* |
| Time and numbers | Friendly and relative — *2 days ago* | Absolute, with timezone; someone is on a phone call about it |
| Empty states | An onboarding moment | *No results — widen the filter* |
| Keyboard | Rarely needed | Shortcuts are a requirement for trained users ([[operational-expert-tool-ui]]) |
| Performance focus | LCP — first impression ([[performance-and-web-vitals]]) | INP — the thousandth interaction of the shift |
| Role and permission | Never surfaced | Stated plainly; the user needs to know what they may do ([[ui-context-and-scope]]) |

**The layout paradigm and the page skeleton belong to this layer, not to the chassis.** An aggregating landing page, an operational tool, and an authoring surface should not share a skeleton, and forcing one on them is how estate programmes make things worse: the binding constraint is the design system — tokens, components, states, behaviours — not the shape of the page.

The line worth holding: **when the task differs in kind, the paradigm should differ; when it differs only in content, it should not.** A dashboard that gathers services, a tool someone operates for a shift, and an editor are different in kind. Two lists of different entities are not.

Applications that *are* close relatives — two internal tools for the same team, a portal and its mobile companion — should share the expression layer too, not merely the chassis. Establish the family before styling a new member: if a near-sibling exists, inherit from it rather than deriving a second time from the brand.

### The coherence ladder

A 2003 terminal application will not be rebranded, and a design programme that demands it will stall on that one system. Coherence is not on or off — it is a ladder, and each application is placed on the rung it can realistically reach.

| Rung | What it means | Typical cost |
|---|---|---|
| **0 — Identity** | Right logo, name, favicon, page title. The user can tell whose software this is. | Hours |
| **1 — Chrome** | The shared shell: top bar, sign-in, typeface ([[app-shell]]) | Days |
| **2 — Tokens** | Brand colours and spacing mapped onto whatever variables the app already has | Days to weeks |
| **3 — Components** | Real shared components — buttons, inputs, tables ([[component-family-consistency]]) | Months |

An old Bootstrap application often reaches rung 2 quickly, because Bootstrap already has variables to override. The terminal application stops at rung 0, and that is the correct answer rather than a failure. Deciding the target rung per application, out loud, is what stops the programme from becoming an all-or-nothing rewrite that never starts.

### New applications keep appearing — that is a design problem too

Teams start a fresh codebase because joining the existing one is harder than starting over. When identity, tenancy, and permissions are not genuinely shared, a new tool behind a new login is the path of least resistance, and every one of them adds an account to maintain and a look to drift.

The design-side answer is to make joining cheaper than starting over: a shared shell that drops in, tokens that can be consumed without adopting a framework, and one account that already works. The measure of an estate's design system is not how beautiful its flagship is — it is whether the next tool someone builds joins it by default.

---

## Review Checklist

- [ ] Is the layout paradigm a deliberate fit for the content's nature and primary task — not a default grid?
- [ ] Could you state in one sentence *why* this paradigm beats the alternatives for this content?
- [ ] Do all screens of the same kind (all detail pages, all list pages) share one page skeleton?
- [ ] Does navigation stay in the same place across screens?
- [ ] Does the primary action sit in the same region on comparable pages?
- [ ] If a user learns one detail page, have they effectively learned them all?
- [ ] Do sibling pages carry comparable feature/content weight — with over-heavy pages split and over-thin pages consolidated, rather than padded with filler (especially in expert tools)?
- [ ] Where a screen deviates from the standard template, is there a clear task-driven reason — and is the deviation obvious rather than subtle?
- [ ] Does the product feel like one application rather than several stitched together?

Across an estate of separate applications:

- [ ] Is the brand chassis identical in every application — logo, brand hue, semantic colours, typeface, focus ring, formatting, system voice?
- [ ] Where applications differ, is it a stated decision about audience and task rather than accumulated drift?
- [ ] Does a new application inherit from its nearest sibling instead of re-deriving from the brand?
- [ ] Does every application have a target rung on the coherence ladder — including the legacy ones that stop at 0?
- [ ] Do internal tools carry the brand experience, not just the customer-facing ones?
- [ ] Is joining the estate cheaper for a team than starting a fresh codebase?

For a landing or marketing page:

- [ ] Does the page carry all eight beats — hook, problem, USP, value props, proof, how it works, stakes, CTA?
- [ ] Are the beats weighted for *this* audience and sector, with evidence of the kind that field actually accepts?
- [ ] Does the hero state one value and leave the visitor wanting to see the product run?
- [ ] Are the value propositions benefits rather than feature nouns, and does every substantial claim have proof beside it?
- [ ] Walking top to bottom, is each question in the chain answered where it arises — none early, none requiring a scroll back?
- [ ] Does the CTA name the action, and is urgency built from real consequence rather than manufactured scarcity?

---

## Constituent Domain: responsive-paradigms

# Responsive Paradigms

Mobile, tablet, and desktop are fundamentally different interaction contexts. The input method, screen real estate, viewing distance, and session intent all differ. Responsive design is not the same layout at different widths — it is a different design decision at each breakpoint.

## The Three Paradigms

### Mobile (< 768px)
- **Input:** Touch — fingers, not a cursor. Tap targets ≥ 44×44px.
- **Navigation:** Bottom tab bar (thumb reachable) or hamburger drawer. Top navigation is hard to reach.
- **Session:** Often interrupted, task-focused, shorter. Show the most important thing first.
- **Content:** Single column. Vertical scroll only. No hover states.
- **Primary action:** Floating action button (FAB) or full-width button at the bottom of the screen.

### Tablet (768px–1024px)
- **Input:** Touch and sometimes keyboard/trackpad. Hybrid paradigm.
- **Navigation:** Can support a persistent sidebar at landscape orientation; collapses to drawer at portrait.
- **Content:** Two-column layouts work. Master-detail patterns (list + detail side by side) are natural.
- **Primary action:** Can be in-line with content, not necessarily floating.

### Desktop (> 1024px)
- **Input:** Mouse with hover states, keyboard shortcuts, precise clicking.
- **Navigation:** Persistent sidebar or top navigation. Both visible simultaneously.
- **Content:** Multi-column, dense information, toolbars, context menus.
- **Primary action:** In-context with content, supported by keyboard shortcuts for power users.

---

## Section Behaviour Across Breakpoints

Not every section needs to appear on every breakpoint at the same position — or at all.

### Sections can be hidden on mobile
Secondary content (related articles, supplementary sidebars, decorative illustrations) can be hidden below a breakpoint. Ask: does a mobile user need this? If no, `display: none` at mobile is correct.

### Stacking is the default; repositioning is allowed within the same container
The default responsive move is simply to **stack** — a horizontal row of blocks becomes a vertical column as the viewport narrows. This preserves order and grouping, so the user's mental model of the page survives the breakpoint unchanged. Reach for it first.

**Repositioning an element is also allowed — but only if it stays within roughly the same container area / region.** A sidebar that sits to the left on desktop can move below the main content on mobile, or collapse into an expandable section: it's still "the stuff next to / around the main content", just re-flowed. That's fine.

What to avoid: repositioning that **moves an element into a different container or scope** — a control lifted from its card into the global header reads as a different UI, not a reflow. Keep the parent region stable; change only how it flows within it.

```
Desktop:              Mobile:
[Main] [Sidebar]  →   [Main]
                       [▼ Related]  ← collapsed accordion, still "around the main content"
```

### Sticky behaviour can change per breakpoint
An element that is `position: sticky` on desktop may need to become a fixed bottom bar on mobile, or be removed from sticky positioning entirely to free up screen space.

```css
.toolbar {
  position: static; /* mobile: inline, not sticky */
}

@media (min-width: 1024px) {
  .toolbar {
    position: sticky;
    top: var(--header-height);
  }
}
```

### Navigation transforms completely
| Desktop | Mobile |
|---|---|
| Persistent top nav or sidebar | Bottom tab bar or hamburger drawer |
| Visible labels + icons | Icons only (bottom nav) or full list (drawer) |
| Hover states on nav items | None — touch only |
| Dropdowns on hover | Tap to expand, full-screen or sheet |

### Labels can be shortened — but the full meaning must be recoverable
As space tightens, a label can be **shortened** or dropped to **icon-only**. Shortening hides information, so keep the full version reachable — the same "clamp + recover" contract as truncated text (see [[repeated-component-alignment]]):

- **Recover it** via `title` / `aria-label` (required for icon-only controls), or in a detail view / the desktop layout.
- **Icon-only** is valid *only if the icon is unambiguous* and still carries its label via `aria-label`. A cryptic icon is worse than the long word.

---

## Mobile-First Approach

Design and build mobile first, then enhance for larger screens. Mobile forces prioritisation — what makes it onto mobile is what actually matters.

```css
/* Mobile first: base styles are mobile */
.container { padding: var(--space-4); }

/* Enhance for larger screens */
@media (min-width: 768px) {
  .container { padding: var(--space-8); }
}

@media (min-width: 1024px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: var(--space-8);
  }
}

/* Ultra-wide protection */
@media (min-width: 1600px) {
  .container {
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

## Max-Width and Ultra-Wide Screens

Responsive design doesn't mean "expand forever." On very large monitors (2K, 4K, and ultra-wide), content must be capped to maintain readability and ergonomic comfort.

- **Ergonomics:** Spreading critical UI elements across the full width of a 4K screen requires excessive neck movement and makes the interface feel "fragmented."
- **Readability:** As noted in typography guidelines, line lengths should not exceed ~75 characters. On a 4K screen without a max-width, a single line of text could span thousands of pixels.
- **The "Safe Zone":** Use a max-width container (typically between **1280px and 1600px**) for all primary content.
- **Full-Bleed Exceptions:** Background colours, decorative images, and secondary footers can remain full-width to maintain the design's "energy" while the content remains centered and contained.

## Header chrome across breakpoints

A fixed header follows the same paradigms. The brand mark and the menu control both scale, and both keep the same inset from the edge.

- **Scale the brand mark.** A logo sized for desktop dominates a phone: smaller on mobile, moderate on tablet, full on desktop. A wordmark around 18 to 24px tall reads cleanly in a mobile header. Constrain by height and let width follow so the aspect ratio holds.
- **Match the edge inset.** Logo and menu control sit at opposite edges with the same inset, scaling with the breakpoint. Too tight reads as cramped and risks colliding with rounded display corners.

## Wrapped rows inherit the parent's alignment

A row of pills, stats, or tags built with `flex-wrap` keeps its own alignment when it wraps. In a centered mobile column the wrapped line hugs the left while everything around it is centered, leaving a lone trailing item in the corner. Match the inner alignment to the context: centered on mobile, left on desktop.

## Review Checklist

- [ ] Does mobile navigation use a bottom tab bar or drawer — not a top nav that requires thumb stretching?
- [ ] Are touch targets ≥ 44×44px on all interactive elements?
- [ ] Are secondary sections hidden or collapsed on mobile rather than just shrunk?
- [ ] Does sticky positioning adapt per breakpoint — not every sticky desktop element stays sticky on mobile?
- [ ] Is the layout built mobile-first with progressive enhancement upward?
- [ ] Are hover-dependent interactions (tooltips, dropdowns) replaced with tap equivalents on touch?
- [ ] Does the primary action remain reachable with one thumb on mobile?
- [ ] Is the primary content capped with a max-width (e.g., 1440px) on ultra-wide/4K monitors?
- [ ] Does the header brand mark scale with the breakpoint, with logo and menu control sharing the same edge inset?
- [ ] Do wrapped rows (pills, stats, tags) match the alignment of the context they sit in, rather than defaulting to left in a centered column?
- [ ] Is stacking the default reflow, with repositioning kept within an element's original container/region rather than moving it into a different scope?
- [ ] Where labels are shortened or reduced to icon-only, is the full meaning recoverable (tooltip/`aria-label`, a kept-elsewhere label, or an unambiguous icon)?

---

## Constituent Domain: visual-emphasis-and-hierarchy

# Visual Emphasis and Hierarchy

Every screen has a most-important thing. Visual hierarchy is the design work that makes sure the user's eye finds it first — without requiring the user to read everything and decide for themselves.

Emphasis is achieved through **size**, **colour**, **weight**, **contrast**, and **position**. These tools work because they are relative: an element looks important because it differs from what surrounds it.

## The Hierarchy Ladder

Design every action group and content area with a clear hierarchy:

| Level | Role | Visual treatment |
|---|---|---|
| **Primary** | The one action the user should most likely take | Filled, brand colour, largest button in the group |
| **Secondary** | An alternative action of moderate importance | Outlined or ghost, neutral colour, same or slightly smaller size |
| **Tertiary** | Rarely needed, destructive, or low-priority | Text link or subtle ghost, smaller, visually recessive |
| **Disabled** | Unavailable | Low contrast, no hover state — signals "not yet" |

There should be **at most one primary action per view** or per logical section. Two filled buttons side by side cancel each other out — both feel equally important, so neither guides the user.

## Size as Emphasis

A larger button, heading, or element draws the eye before a smaller one. Use size deliberately:

- The primary CTA is the largest interactive element in its group
- Page headings are larger than section headings, which are larger than labels
- A featured product, plan, or option can be physically larger than its peers to signal recommendation

Size differences must be perceptible — a 2px difference reads as inconsistency, not hierarchy. Use your modular scale for type; use meaningful size steps for components.

## Colour as Emphasis

Colour is the strongest emphasis signal and therefore the most easily overused.

- **One brand colour for primary actions** — used sparingly so it retains its signal
- Secondary and tertiary actions should be neutral (grey, outlined) so the primary colour stands out
- Status colours (red, orange, green) should never appear on primary CTAs — they carry their own semantic meaning

## Brand Colour as Large Areas

Brand primary colours work well as large background regions — hero sections, feature banners, section dividers. This is different from using brand colour on interactive elements.

The rule: **pick one role and commit to it per view.**

- Brand colour as a large area → buttons and links on that section use white or a high-contrast neutral, not the brand colour again
- Brand colour on interactive elements → backgrounds stay neutral so the colour retains its signal

Used as a bold background, brand colour communicates identity and energy. Used simultaneously on both backgrounds and buttons, it loses all signal — everything blends together.

## Contrast and Whitespace as a Focal Point

Emphasis is not just about what you add (colour, size), but also what you remove (distraction).

**The "Contrast + Space" Rule:** To create a powerful focal point, combine a high-contrast element (or a bold brand colour) with generous **whitespace (negative space)** around it.
- **Isolation:** Whitespace acts as a frame, isolating the primary action or message.
- **Visual Silence:** By removing competing elements nearby, you ensure the user's eye has only one logical place to land.
- **Scale:** A small high-contrast button in a large empty field can have more "pull" than a giant button in a crowded layout.

Use whitespace deliberately to "push" the user's attention toward the primary goal.

```
✓ Dark brand-colour hero section + white CTA button
✓ White page + brand-colour primary button
✗ Brand-colour hero section + brand-colour button on top of it
```

## Weight and Contrast

Typography weight communicates importance within text and aids scannability.

- **Bold a 2 to 5 word cluster that carries a point.** Bold is the second scanning layer after headings. A reader who skims the headings and the bold text alone should collect the claims, not the vocabulary.
- **Bold headings and labels.** Use weight to distinguish the structure of the information from the information itself.
- **Regular weight for supporting content.** Keep descriptions and secondary info in regular weight to provide a "rest area" for the eye.
- **Light or muted colour for metadata.** Use low contrast for timestamps, secondary labels, or "fine print".

In data-heavy UIs (tables, dashboards), bold the **primary metric or the row's identifying name**. The eye should be able to jump from one bold anchor to the next to quickly locate data.

### Where the Cluster Starts and Ends

A single bolded word is a highlighted term, not a point. So is a product name
or a piece of jargon lifted from the page.

| | |
|---|---|
| Good | "Figma is now the bottleneck." / "Screenshots without markup invent spacing" |
| Bad | a lone word, a term of art, a generic phrase carrying no claim |

- Never start the cluster on "the", "a" or "an". The article is wasted emphasis.
- Never end on a fluff word. The last word is where the eye lands, so it has to be the loaded one.
- Bold a claim, not a fragment. If the bolded text cannot be read alone as a statement, move the boundaries or drop the bold.

A single word is bold only when it is a UI element in its own right: a badge,
a chip, a table label, a metric in a stat tile. In running prose it is always
wrong, because there is no such thing as a one-word claim.

Density is sparse: roughly one per section, never two in a paragraph. A page
bolded everywhere has no emphasis, only noise.

This applies to prose the same way it applies to UI: articles, landing page
copy, and any long-form markdown an agent generates.

## Text Over Imagery

Text legibility is often compromised when placed directly over photographs or complex patterns. To maintain hierarchy and credibility:

- **Subtle Text Shadow:** Use a soft, high-blur text-shadow (e.g. `0 2px 4px rgba(0,0,0,0.2)`) to lift text off the background. It should be felt rather than seen — if the shadow is obvious, it's too heavy.
- **Image Tints & Gradients:** Apply a subtle dark tint or a linear gradient (e.g. from transparent to 40% black) over the image to increase contrast behind the text.
- **Selective Backgrounds:** When selecting stock footage, look for images with "negative space" or solid color areas (e.g. a clear sky, a plain wall) where text can sit naturally.
- **Scrims:** Use a "scrim" (a semi-transparent gradient overlay) specifically in the area where text sits to preserve the image's vibrant colours while ensuring text is readable.

## Position as Emphasis

Users in left-to-right reading cultures scan top-left first. Position reinforces hierarchy:

- Primary action: bottom-right of a form or dialog (natural end of the reading flow), or top-right of a page header
- Most important content: top of the page, above the fold
- On a landing page the hero carries one value promise, large and with air around it — for the sequence below it, see the product narrative framework in [[layout-paradigms-and-consistency]]
- Warnings and critical status: top of the affected section, not buried at the bottom
- Destructive actions (Delete, Remove): visually separated from constructive actions, often at the end of an action group

## Surface the One Key Thing in Data-Heavy Views

When a view has a lot of data, don't present it all at one flat level of emphasis — that pushes the work of finding the important thing onto the user. Instead, decide the **single key figure or fact for this use context** and make it **large and immediately findable**; let everything else sit in a supporting, lower tier.

- Ask what the user came to this screen to know or do, and give *that* the size, weight, and position (a big headline metric, a prominent status, a clear primary action).
- You may **drop or hide** the less important data — collapse it, move it behind a detail view or a "show more", or cut it entirely (this pairs with the hide-don't-serve-up-front decision in [[information-architecture]] and density choices in [[ui-density]]).
- **Validate what you demote or hide.** What's "key" is a claim about the user, not a given — ideally test with real end users. If UX testing isn't possible, at least validate the priority with the business / domain owner before shipping. Guessing wrong here hides the one thing someone needed.

## One Primary Action Per View

The biggest hierarchy mistake is giving everything equal emphasis. When every button is filled, every heading is bold, and every card is highlighted, the user has no signal about where to start.

**Rule:** In any view, ask "what is the single most likely next action for most users?" Make that one thing visually dominant. Everything else recedes.

**Priority is per-view, not absolute.** The same action is primary on its own page, secondary beside bigger ones — re-rank for the current context. "Primary/secondary/tertiary" are your names; the user sees only fill, colour, size, position. Needing a tertiary tier usually means the view is too complex — simplify first.

## Cursor

Every clickable or interactive element must use `cursor: pointer`. Users rely on the cursor changing to confirm that an element is actionable — without it, buttons and links feel broken or unresponsive.

```css
button, a, [role="button"], [onclick], label { cursor: pointer; }
```

Never leave interactive elements on the default `cursor: auto`. The one exception is text inputs, which correctly use `cursor: text`.

## Review Checklist

- [ ] Is there at most one primary (filled, brand-coloured) button per section?
- [ ] Is the primary action framed by enough whitespace to stand out from surrounding content?
- [ ] Are secondary and tertiary actions visually recessive compared to the primary?
- [ ] Is the most important content positioned highest and/or largest?
- [ ] Are size differences between hierarchy levels perceptible, not just 1–2px?
- [ ] Is brand colour used sparingly enough that it retains its emphasis signal?
- [ ] Are destructive actions visually distinct and separated from constructive actions?
- [ ] Do all buttons, links, and interactive elements use `cursor: pointer`?
- [ ] Does each bolded run read as a claim on its own, 2 to 5 words, at most one per paragraph?
- [ ] Is text overlaid on images easily legible (using shadows, tints, or smart image selection)?

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Two or more filled primary buttons side by side | Both feel equally important — no guidance | One primary, one secondary (outlined) |
| Brand colour used on backgrounds, headers, AND buttons | Colour loses emphasis signal | Reserve brand colour for one role |
| All text the same weight on a data-heavy screen | No visual entry point for the eye | Bold the key metric or label per group |
| "Cancel" and "Confirm" buttons the same size and colour | User must read to distinguish | Primary = filled, Cancel = ghost or text link |
| White text over a bright or busy image | Text is illegible or "vibrates" | Add a subtle text-shadow, image tint, or select images with solid-color areas |
| Important warnings placed below the fold | Users miss them | Surface critical status at the top of the affected section |
| Buttons changing size or shifting on interaction | Feels unstable and unpolished ("squishy" UI) | Maintain rock-solid layout; use color and internal feedback only |

---

## Constituent Domain: ui-context-and-scope

# UI Context and Scope

Users need to know three things at all times:
1. **Where am I?** — current location in the product hierarchy
2. **What context am I in?** — which section, record, or workspace is active
3. **What will my actions affect?** — scope of changes before committing them

When these are unclear, users make mistakes, feel lost, and lose trust in the product.

## Communicating Hierarchy with Visual Structure

### Lines and Dividers
Horizontal rules and borders signal the boundary between sections. Use them to separate content areas that belong to different contexts — not just for decoration.

- A line between a header and content says "the content below belongs to this header"
- A sidebar border says "this is a different region with a different purpose"
- Avoid overusing dividers — proximity and whitespace should do most of the work; dividers reinforce where space alone is insufficient

### Colour Regions and Background Fills
Background colour is one of the strongest signals for "you are now in a different area."

- Use a distinct background shade for sidebars, panels, or contextual drawers
- Active or selected regions benefit from a subtle fill to confirm "this is the current context"
- When a user's changes are scoped to a specific section, that section should be visually bounded — border, fill, or both — so the scope is self-evident before the user commits

### Section Labels and Context Headers
Every major region should be able to answer "what am I?" without the user having to read surrounding content.

- Name sections with the user's vocabulary, not the system's
- Show the active entity: "Editing: Invoice #2041" or "Settings for: Workspace" — not just "Settings"
- In forms that affect a specific record, show the record name prominently in the form header

## Navigating Depth

### Breadcrumbs
Use breadcrumbs when the product has three or more levels of hierarchy, or when users can arrive at a page from multiple paths.

```
Home > Projects > Website Redesign > Tasks > #142 Fix header
```

- Each breadcrumb item should be a clickable link back to that level
- The current page is the last item — not a link, just text
- On mobile, collapse to show only the immediate parent: `← Website Redesign`
- Breadcrumbs do not replace primary navigation — they complement it

### Search and Filter as Navigation
In products with large or dynamic content trees, search reduces the cognitive cost of navigating depth.

- Global search for finding any entity across the product
- Contextual filters for narrowing within the current scope
- Search results should show enough context to distinguish similar items (e.g. project name alongside task name)

## Scope Communication Before Action

When a change, setting, or action affects a specific scope, that scope must be communicated before the user commits — not discovered afterward.

- **Labels:** "This setting applies to: this workspace only" / "All users will see this change"
- **Visual bounding:** Highlight or outline the affected region when the user is about to edit it
- **Confirmation copy:** Destructive or wide-scope actions should state the scope in the confirmation dialog ("Delete this project and all 47 tasks inside it?")

## Acting on Behalf of Someone Else

Whenever the user is viewing or changing data **as another user, customer, or account** — impersonation, admin "view as", support acting on a customer's behalf — the interface must make that unmistakably obvious the entire time, not just at the moment they enter the mode.

- **Persistent, unmissable indicator:** a coloured banner or bar that stays on screen the whole session ("You are acting as **Acme Corp** — changes affect their account"), not a toast that disappears.
- **Whose view is this:** name the account/customer being acted upon, and make it visually distinct from the operator's own normal context so the two can never be confused.
- **An obvious exit:** a clear "Return to your account / Stop acting as…" control, always visible.

The risk being designed against is an operator making a change believing they're in their own context when they're really in a customer's — scope confusion here causes real damage.

## Authentication Is a Trust Context

The login / sign-up screen is where the user hands over a password — an inherently **scary moment**, and the point where they most need to feel they're in the right, safe place. Design it as a trust surface, not an afterthought:

- **It must feel unmistakably like the brand.** A generic or off-brand login page reads as suspicious ("is this really them, or a phishing page?"). Carry the full brand identity — logo, colours, type, tone — into the auth screens.
- **The URL must live in the customer's own ecosystem.** Host auth on the customer's domain or a clear subdomain — `app.customer.com`, `customer.com/login` — not a random third-party URL. Keep the path shallow and legible (at most `domain/path/path`, only meaningful query params). Users read the address bar to judge safety; an opaque redirect chain reads as phishing.

## Distinguish Internal Tools from External Products

Internal / back-office software should carry a deliberate visual "quirk" — a distinct accent colour, an env badge, a marked header — that makes it **impossible to mistake for the customer-facing app**. This prevents an operator from confusing an internal admin surface with the external product (or a staging environment with production). The cue should be persistent and immediately legible, not hidden in a settings page.

## Which Application, Whose Data, What Permissions

Where one login opens several tools, "where am I?" gains two answers the user needs at once, and both belong in the persistent shell rather than on a page ([[app-shell]]).

**Which application.** Once tools share a shell and a brand, they also start to look alike — a good outcome that creates a new failure: acting in the wrong tool. The application's own name stays visible in the shell, always in the same place.

**Whose data.** In a multi-tenant or multi-customer tool the active tenant is named permanently, and repeated in the confirmation of anything destructive. Name it as a label; do not encode it as a colour or theme, which breaks the brand and makes contrast unpredictable. Colour is reserved for the environment cue above, where confusing production with staging has a real cost.

**What permissions.** Internal users benefit from seeing the role they are operating under — it explains why an action is missing, and it makes an over-privileged session visible to the person holding it. Show the role in the shell, and prefer disabled-with-reason over silently hidden for actions the user's role blocks ([[nielsen-usability-heuristics]]). Customer-facing products should not surface roles this way; there, absence is the cleaner answer.

## Review Checklist

- [ ] Can the user always identify which section or record they are currently editing?
- [ ] Are colour regions or borders used consistently to separate distinct contexts?
- [ ] Does navigation deeper than 2 levels use breadcrumbs or a clear back path?
- [ ] Do action confirmation dialogs state the scope of what will be affected?
- [ ] When acting on behalf of another account, is there a persistent, unmissable indicator naming who, plus an always-visible exit?
- [ ] Do internal/back-office tools carry a persistent visual cue that distinguishes them from the customer-facing app (and staging from production)?
- [ ] Do auth screens feel fully on-brand, and does the login URL sit in the customer's own domain/subdomain with a shallow, legible path?
- [ ] Are section titles written in user vocabulary, naming the active entity where relevant?
- [ ] Is global search available when the content structure is too large to browse?
- [ ] Where several tools share one login and one look, is the current application named persistently?
- [ ] Is the active tenant named as a label rather than encoded as a colour or theme?
- [ ] In internal tools, is the user's role visible — and are blocked actions disabled with a reason rather than silently absent?

---

## Constituent Domain: user-flows-and-guided-paths

# User Flows and Guided Paths

Related features that belong together should be experienced as a single coherent journey — not as separate screens the user has to navigate between manually. A well-designed flow feels inevitable: each step leads naturally to the next, the user always knows where they are and what comes next, and the path fits the product's information hierarchy.

## When to Guide vs. When to Let Users Explore

| Scenario | Pattern |
|---|---|
| Linear process with a clear end goal (checkout, signup, setup) | Guided step-by-step flow or wizard |
| Complex task that benefits from breaking into stages | Wizard with progress indicator |
| Feature discovery across an existing product | Contextual tooltips or coach marks |
| User returning to complete something they started | Resume prompt with clear re-entry point |
| Open-ended exploration (dashboard, settings) | Free navigation — do not force a flow |

Only guide when the task genuinely has a natural order. Forcing a wizard onto a non-sequential task frustrates users who already know what they want.

## The Wizard Pattern

Use a wizard when:
- The task has 3 or more sequential steps
- Later steps depend on decisions made in earlier steps
- Doing all steps on one screen would overwhelm the user

### Wizard anatomy

```
[Step indicator: 1 of 4]

Step title

  [Form content for this step]

[Back]  [Continue →]
```

**Step indicator:** Always show the user where they are in the sequence and how many steps remain. A progress bar or numbered steps both work — numbered steps are clearer when step names are meaningful.

**Back navigation:** Always available. Users must be able to go back and change earlier decisions without losing their progress on later steps.

**Forward navigation:** Disabled until the current step is complete. Validate on Continue, not on Submit at the end.

**Exit path:** Make it clear how to abandon the flow without losing partial progress. Autosave drafts where possible.

### Step design principles
- One primary decision or input group per step — don't overfill steps
- Step titles should describe the user's goal, not the system's: "Your delivery address" not "Address input"
- Optional steps should be clearly marked and skippable
- The final step should show a summary before committing

## Purchase and Conversion Flows

Purchase flows have an additional constraint: every unnecessary step reduces conversion. Design for the shortest path to completion.

- Collect only what is required at each stage — defer optional information
- Show a persistent order summary so the user always sees what they are buying
- Surface trust signals near payment steps (security badges, return policy)
- Confirmation step before payment: show total, delivery, items — one last review
- Post-purchase: immediate confirmation with clear next steps ("Your order is confirmed. We'll email you when it ships.")

## Fitting Flows into the Product Hierarchy

A guided path should feel like it belongs to the product — not like it has opened a separate experience.

- The visual style, typography, and components inside a flow should match the rest of the product
- Navigation chrome (sidebar, top nav) can be hidden during a flow to reduce distraction, but the brand header should remain visible
- After completing a flow, return the user to a meaningful place in the hierarchy — not to a generic home screen
- Deep-linking into a flow should work: a user who arrives at step 3 via email link should see step 3, not step 1

## Review Checklist

- [ ] Does the flow have a clear start, a logical step order, and a definite end?
- [ ] Is a progress indicator visible at every step?
- [ ] Can the user go back to any previous step without losing later progress?
- [ ] Is each step focused on one decision or input group?
- [ ] Are step titles written in user language, describing their goal?
- [ ] Does the final step show a summary before the irreversible action?
- [ ] After completion, does the user land somewhere meaningful in the product?
- [ ] Does the flow visual style match the rest of the product?

---

## Constituent Domain: dembrandt

# dembrandt — UX Pipeline Orchestrator

> Concept by [@VictorGjn](https://github.com/VictorGjn).

Routes multi-concern UI/UX tasks through six ordered stages. Each stage loads sub-skills on demand — only what the task actually needs.

**When to use this skill vs a sub-skill directly:**

- Multi-concern task ("design review", "audit interface", "build UI") → use this orchestrator
- Single-concern task ("check my colour palette", "review button states") → go directly to the sub-skill
- Brand-to-token-to-spec pipeline with a URL or DESIGN.md → use `generate-ui-from-brand` instead
- Reproducing an existing page rather than designing one → use `clone-website` instead

---

## Pipeline

### Stage 1 — Brand Foundation

Establish the visual language before making any token decisions.

Sub-skills (load as needed):
- `brand-visual-language` — shape language, icon style, typography tone
- `algorithmic-color-palette` — derive states and brand-tinted greys from brand colours
- `color-mode-and-theme` — light vs dark vs combined, when to offer a theme selector

**Gate:** Brand tone and colour system agreed before proceeding.

---

### Stage 2 — Design Tokens & Scales

Pin the numeric system so all components share a common foundation.

Sub-skills (load as needed):
- `modular-scale-typography` — ratio-based type scales, minimum sizes, context-aware usage
- `elevation-and-depth` — shadow scale, border-radius, card and modal patterns
- `button-states` — six states: rest, hover, active, focus, disabled, loading
- `component-family-consistency` — buttons, inputs, pills: shared radius, colour, height
- `sizing-units` — px vs rem vs relative: which values move when the user enlarges text
- `status-colors-and-errors` — minimal semantic colours, error recovery, prevention

**Gate:** Tokens defined and consistent across component family.

---

### Stage 3 — Layout & Structure

Apply layout decisions to the specific product context.

Sub-skills (load as needed):
- `layout-paradigms-and-consistency` — choose the layout paradigm that fits the content; reuse the same page skeleton across screens (macro-scale consistency)
- `gestalt-ui-organisation` — group related controls: proximity, similarity, common region
- `visual-emphasis-and-hierarchy` — one CTA per view, colour and size as emphasis
- `information-architecture` — naming, mental models, data UI, confirm dialogs
- `ui-context-and-scope` — hierarchy, breadcrumbs, colour regions, scope communication
- `responsive-paradigms` — mobile/tablet/desktop: nav, sections, sticky behaviour
- `ui-density` — match density to platform and user type
- `sticky-and-fixed-elements` — headers, bottom toolbars, z-index tokens
- `scroll-areas` — avoid inner scroll, one axis only, user-controlled

**Gate:** Layout is coherent across breakpoints and user contexts.

---

### Stage 4 — Components & Interaction

Review component patterns and interactive states.

Sub-skills (load as needed):
- `real-world-metaphors` — cards, carousels, drawers: when to use and how
- `tab-navigation` — tab types, overflow, keyboard nav, ARIA, state persistence
- `modal-and-overlay-patterns` — tooltip/popover/drawer/modal hierarchy, focus management, destructive confirm
- `form-design` — helper text, placeholder, validation, submit state
- `data-display-and-selection` — grid/list/table, large hit areas, mass actions
- `repeated-component-alignment` — repeated components as slot models: equal size, pinned anchors, clamp + recover overflowing text
- `operational-expert-tool-ui` — dense, workflow-driven UIs for trained daily B2B users
- `coordinated-data-views` — keep a table and a visual view (map, diagram, chart) synchronized
- `domain-expert-configuration` — expose solver/algorithm settings in domain language
- `authentic-product-representation` — real content and real output over staged mockups and marketing chrome
- `app-shell` — top bar, app launcher, tenant and environment cue, status bar: one shell across an estate
- `global-toolbar-controls` — currency, language, region and unit selectors
- `notifications-and-recovery` — toasts, banners, retry, undo — always a path forward

**Gate:** All interactive states handled; no dead ends.

---

### Stage 5 — UX Polish

Apply UX principles and motion to sharpen perceived quality.

Sub-skills (load as needed):
- `nielsen-usability-heuristics` — 10 usability principles with review checklists
- `user-flows-and-guided-paths` — wizards, purchase flows, onboarding sequences
- `micro-interactions` — animated icons, toggles, reveals, celebrations
- `loading-states-and-perceived-performance` — spinners, skeleton screens, staggered entry
- `motion-and-storytelling` — Disney principles and cinematic language in UI

**Gate:** Flow is legible end-to-end; perceived performance is acceptable.

---

### Stage 6 — Accessibility & Technical Gate

Hard ship gate. Do not skip or defer.

Sub-skills (load as needed):
- `wcag-accessibility` — WCAG 2.2 AA / EN 301 549: contrast, keyboard, ARIA
- `semantic-html-and-seo` — HTML5, alt texts, Open Graph, progressive enhancement
- `performance-and-web-vitals` — Lighthouse audit, LCP, CLS, INP, images, fonts, JS loading

**Gate:** Passes WCAG 2.2 AA. Required by EU Accessibility Act (EAA) for products launched after June 2025.

---

## Output

Produce one structured review, not a stream of loose comments. Group findings by severity, most blocking first:

1. **Blockers** — fails a hard gate: WCAG 2.2 AA, a broken flow, a dead end. Must fix before ship.
2. **Major** — breaks consistency, hierarchy, or a core UX principle. Fix this iteration.
3. **Minor** — polish, micro-interactions, perceived-performance refinements. Backlog.

For each finding give the stage it came from, the specific element, what is wrong, and the concrete fix.

Run only the stages the task needs. An existing product with settled brand and tokens starts at Stage 3; a pure accessibility pass runs Stage 6 alone. State which stages you ran and which you skipped, and why.

---

## Relationship to `generate-ui-from-brand`

`generate-ui-from-brand` is a token-extraction pipeline: URL or DESIGN.md → tokens → UI spec. It overlaps stages 1–2 of this orchestrator. Use it when you have a brand source and need a concrete spec. Use this orchestrator when you are reviewing or building across the full stack of UX concerns without a specific brand-extraction starting point.

---

## Auditor Defense Checklist & Quality Gate

Whenever acting as or validating against this Master Skill, verify each of the following golden criteria:

- [ ] **3-Level Attention Hierarchy**: Are elements cleanly partitioned into Glanceable (<1s), Operational (1-5s), and On-demand (>5s)?
- [ ] **Proximity over Dividers**: Are sections separated primarily by whitespace steps rather than hairline dividing borders?
- [ ] **Density by Viewport**: Does desktop provide compact data density with wrap while mobile adapts cleanly to focused cards or carousels?
- [ ] **Comparative Layout Evaluation**: Does the design evaluate at least 3 distinct layout paradigms (Sidebar vs TopNav vs Split) with explicit pros/cons/why for Landscape and Mobile?
- [ ] **Scope & Context Preservation**: Are contextual actions localized to their target elements rather than scattered across global toolbars?
- [ ] **Golden Canvas Invariant**: Is the primary canvas/workspace maximized with secondary sidebars collapsible and non-intrusive?
