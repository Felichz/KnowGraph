# Learning Map product and UI/UX system

## 1. Product purpose

This application is not just a concept graph. It is a training system for turning scattered knowledge into an explanation the user can retrieve, organize, and communicate in an interview.

The graph is the map's spatial representation. The real unit of learning is the card/node and its mastery cycle:

```text
ubicar el concepto → estudiarlo → explicarlo con palabras propias
→ recibir una guía rápida → confirmar con una evaluación completa
→ corregir gaps → volver a intentarlo o avanzar
```

The UI must make that cycle visible. If the user does not know what they are reading, what they are practicing, what is being measured, or what they can do next, the interface is failing even if every individual component looks polished.

## 2. User, context, and needs

The user is a developer with hands-on experience who needs to quickly recover a deep mental model for senior or tech lead interviews. They do not need an introductory course experience: they can understand concepts fast, but they need:

- explicit coverage of the important points;
- explanation of causes, trade-offs, and failure modes, not just definitions;
- concrete design and implementation examples;
- a way to express it in their own words;
- feedback that identifies the next priority gap;
- evidence that a card is covered without forcing them to perfect every optional detail;
- a progressive route so they do not get lost among related concepts.

The product's central tension is this:

```text
profundidad suficiente para aprender bien
                  ×
rapidez y baja fricción para iterar muchas veces
```

The interface must present one main decision at a time. The user can access the detail, but the detail must not compete with the next step.

## 3. Conceptual model of mastery

### 3.1 Entities

- **Graph:** the set of nodes, categories, dependencies, and milestones for a topic.
- **Node/Card:** a teachable concept with explanation, examples, code, diagrams, mistakes, trade-offs, and questions.
- **Dependency:** a relation that explains which knowledge enables another concept.
- **Draft:** the explanation the user is currently writing. It is not an evaluation.
- **Live review:** a quick, provisional review of the draft. It guides the next edit.
- **Checkpoint:** a complete, persisted evaluation against the card's content.
- **Attempt:** a snapshot of a checkpoint, with answer, score, model, duration, and feedback.
- **Completion:** a state derived from the checkpoint's essential coverage, not from extra depth.

### 3.2 Three truths that must not be mixed

The application must keep these three things separate:

1. **What the card teaches.** It is stable content.
2. **What the coach thinks should be reviewed now.** It is provisional feedback and can change while the user writes.
3. **What a complete evaluation recorded.** It is historical evidence and must not change silently when the draft changes.

An important design rule follows from this: never present the coach's provisional score with the same semantic weight as a checkpoint's canonical score.

## 4. Information architecture

### 4.1 Application level

The application has two main surfaces:

- **Map:** exploration, orientation, dependencies, priorities, and global progress.
- **Card:** deep learning of a specific node.

The card is a complete work surface. When opening it, the user should not feel they are still looking at the graph behind it; the context changes.

### 4.2 Card level

The card has three explicit, mutually exclusive views:

#### View 1 — Reading

Goal: build understanding before answering.

Recommended order:

1. one-sentence summary;
2. why it matters;
3. causal explanation;
4. context within the route and dependencies;
5. concrete case, failure modes, and trade-offs;
6. table or diagram;
7. code example;
8. step by step;
9. idea to remember;
10. interview questions, sources, and related concepts.

The reading view must not show the textarea or evaluation bars. It may show audio, contextual depth, and navigation to other cards.

#### View 2 — Coaching

Goal: produce one's own explanation with fast feedback.

Recommended order:

1. coach status;
2. a single provisional coverage indicator;
3. text editor;
4. debounce/request status;
5. a single priority hint;
6. manual action to request a full checkpoint.

The coach does not complete nodes and does not generate checkpoints automatically. Its output is an editing suggestion, not a historical verdict.

#### View 3 — Evaluate

Goal: record and review evidence of mastery.

Recommended order:

1. attempt navigation;
2. global score 0–120;
3. coverage threshold 100;
4. individual rubrics 0–120;
5. strengths;
6. gaps and corrections;
7. next attempt;
8. evaluated answer and model/duration metadata.

The evaluation must not silently displace or replace coaching. It is another view of the same cycle.

### 4.3 Persistent context

The card header must always keep visible:

- topic and priority;
- node title;
- completion state;
- reading controls;
- close and navigation.

View navigation must stay visible below the header. The aside can remain as secondary context on desktop, but it must not compete with the main content or duplicate information already in the active view.

## 5. Visual hierarchy

Every element must have a single dominant function.

### 5.1 Levels of importance

| Level | Function | Treatment |
|---|---|---|
| L0 | Surface and context | background, soft borders, low contrast |
| L1 | Main content | readable text, controlled width, high contrast |
| L2 | Primary action | brand color, high visual weight, one per region |
| L3 | Important state | badge, bar, or semantic callout |
| L4 | Optional detail | secondary text, collapsible or tooltip |

A canonical score and a primary button can be L2/L3. The model used, a timestamp, or the request route must be L4. They must never be presented with the same weight.

### 5.2 Focus rule

Each view must visually answer one question:

- Reading: **what do I need to understand?**
- Coaching: **what should I improve now?**
- Evaluation: **how complete was my explanation and what comes next?**

If a section does not help answer the view's question, it must move, be summarized, or be hidden.

## 6. Design system

### 6.1 Space tokens

Use a 4 px base scale, with these preferred values:

```text
4   detalle mínimo
8   separación entre elementos relacionados
12  padding compacto
16  separación estándar entre bloques
24  separación entre secciones
32  separación de regiones grandes
40+ respiración de superficie
```

Arbitrary values like 17, 19, or 23 must not be introduced unless there is a documented geometric reason. Spatial consistency communicates that two elements belong to the same group.

### 6.2 Shape tokens

- small controls: radius 8;
- cards and panels: radius 12–16;
- fullscreen surface: no outer radius;
- badges: pill radius only when they represent a compact label;
- borders: 1 px by default, 2 px only for focus or a highlighted state.

### 6.3 Semantic color tokens

Color must communicate meaning, not decorate:

- cyan/teal: activity, coach, current focus, living navigation;
- blue: stable action or information;
- green: essential coverage and completion;
- gold: optional depth, excellence >100, special milestone;
- orange: warning, developing score, attention required;
- red: error, misconception, or risk;
- bluish gray: metadata and secondary content.

Color must never be the only signal: pair it with text, icon, position, or shape.

### 6.4 Typography

- card title: strong display, a single line when possible;
- section headers: small uppercase monospace for orientation, not for reading content;
- didactic body: 65–75 character reading measure and line-height 1.55–1.75;
- code and metadata: monospace;
- LLM feedback: normal body, not all monospace.

Hierarchy is achieved by combining size, weight, color, and space. Uppercase must not be used for everything because it destroys the distinction between navigation, content, and state.

## 7. Components and anatomy

### 7.1 Card header

It must contain:

- eyebrow: topic and priority;
- title;
- completion or availability state;
- grouped audio controls;
- close button.

It must not contain long feedback or evaluation actions. The header identifies the card and lets you exit; it is not the place to explain everything.

### 7.2 View navigation

It must behave like a tablist:

- three always-visible tabs;
- one clearly identified as active;
- visible keyboard focus;
- stable label, do not switch between “Evaluar”, “Score”, “Historial” depending on state;
- optional secondary badge indicating a checkpoint exists;
- switching tabs must not clear or submit data.

### 7.3 Coaching panel

Anatomy:

```text
estado del coach
score provisional / cobertura
editor
estado debounce/request
hint único
acción checkpoint manual
```

The hint must be actionable and specific. “Te falta explicar X y por qué importa” is useful. “Profundizá más” is not.

### 7.4 Evaluation panel

Anatomy:

```text
selector de intento
score canónico destacado
barra 0–120 con umbral 100
desglose de rúbricas
feedback ordenado por prioridad
respuesta evaluada
metadata secundaria
acciones de reintento/navegación
```

A score of 100 must read as sufficient coverage. The 100–120 band must look special, but never like a debt required to move on.

### 7.5 Aside

The aside is orientation, not main content. It must answer:

- where did I come from?
- where am I?
- what comes next?
- what coverage level do I have?

If it shows a lengthy explanation, it competes with the main view and must move to Reading or Evaluate.

## 8. States that must be designed

Every interactive component must have at least:

- default;
- hover;
- focus-visible;
- active/selected;
- disabled;
- loading/skeleton;
- success;
- warning;
- error;
- stale;
- reduced-motion.

### 8.1 Coaching

```text
idle       escribí para activar el coach
waiting    debounce visible, request aún no enviada
running    request activa, no editar ni ocultar el campo
ready      hint y cobertura actualizados
error      error recuperable, el draft se conserva
stale      el usuario siguió escribiendo, resultado anterior atenuado
```

### 8.2 Evaluation

```text
empty      todavía no existe checkpoint
streaming  score/bloques parciales visibles
ready      evaluación completa persistida
cancelled  no se guardó evidencia parcial como intento
error      reintentar sin perder el draft
historical intento anterior seleccionado
extra      score superior a 100 con tratamiento dorado
```

## 9. Layout and responsive

### Desktop

- header and tabs outside the content scroll;
- main column for the active view;
- context aside with a stable width;
- reading content must have a comfortable maximum width;
- coaching and evaluation can use more width because they contain the editor, bars, and feedback;
- no sticky element may have a transparent background.

### Tablet

- shrink the aside or turn it into a collapsible panel;
- keep tabs in a single horizontal row;
- keep the editor and score as full-width regions.

### Mobile

- compact header;
- audio and close grouped without pushing the title off screen;
- tabs with horizontal scroll or three flexible-width buttons;
- aside below the content or turned into a collapsible section;
- primary actions wide enough for touch;
- never place two complex panels side by side.

## 10. Accessibility and behavior

- use `nav`, `main`, `article`, `section`, and `tablist` semantically;
- `aria-current` or `aria-selected` on active navigation;
- every button must have a visible label or accessible name;
- do not use color as the only signal;
- respect `prefers-reduced-motion`;
- preserve focus when opening/closing a card;
- do not move scroll while typing;
- announce request states without flooding screen readers;
- keep AA contrast for body and controls;
- long content must be traversable with the keyboard.

## 11. Design and validation process

### Step 1 — Inventory

List current regions, components, states, and actions. Mark duplications and elements without a semantic owner.

### Step 2 — Task model

Test the main tasks:

1. open the correct next node;
2. understand the card;
3. write an explanation;
4. identify a gap;
5. refine without losing the draft;
6. request a checkpoint;
7. compare attempts;
8. decide whether to move on.

### Step 3 — Wireframes

Design boxes and hierarchy first, without decorative colors. Validate that each view has a single dominant action.

### Step 4 — Tokens and components

Turn repeated decisions into variables and components. If two states need different styles, document the semantic reason.

### Step 5 — Functional prototype

Test real transitions: streaming, cancellation, tab switching, error, history, mobile, long content, and extra score.

### Step 6 — Visual and interaction QA

Review screenshots on desktop, tablet, and mobile. Verify overlays, scrollbars, focus, long texts, tooltips, sticky surfaces, and layout during loading.

### Step 7 — Friction-based iteration

Measure where the user hesitates, goes back, cannot find the next step, or confuses the provisional score with the canonical score. Adjust hierarchy and copy before adding more controls.

## 12. Success criteria for this app

The interface is well solved when:

- opening a card immediately conveys the concept and the next step;
- reading works without coaching interrupting it;
- writing works without losing the cursor or scroll position;
- the coach feels fast and provisional;
- the checkpoint feels deliberate and reliable;
- 100 reads as sufficiency, not as incomplete failure;
- 100–120 feels like optional excellence;
- history can be inspected without replacing the current draft;
- the user always knows whether they are reading, practicing, or verifying;
- the graph guides, but the card teaches.

