# Legacy UI Feature Inventory (for workspace-ui-v3 parity)

Source of truth read: `legacy/App.jsx`, `legacy/components/**`, `legacy/*.css`, and every `src/` module they import.
Legacy import paths `./lessons`, `./ai/...`, `../hooks/...` resolve to `src/`. All Spanish strings are quoted verbatim.
"DORMANT" = code that exists in legacy but was never mounted or wired, so users never saw it. Decide explicitly whether v3 ships it.

---

## 0. Top-level findings

- **Mounted surfaces:** header/command bar, nav drawer, progress panel, provider panel, "Ruta sugerida" strip, topology graph, flashcards, command palette, lesson modal (4 tabs), deep-dive popover, background-task HUD, mobile HUD, and mobile bottom nav.
- **DORMANT pieces:**
  - `CoachChat` is only reachable through the unused `LiveHint`.
  - The inline-hint `ParaphraseEditor` (contentEditable) is unused.
  - `handleIncorporateFocus` is never used: `onIncorporateFocus={undefined}` is passed.
  - `handleReconcileChatWithDraft`, `sendCoachQuestion` and `stopCoachResponse` are never used.
  - `triggerLiveReviewFromShortcut` and `PedagogicalSparkline` are never used.
  - `GraphViewTabs`, `GraphLanesView`, `GraphRadialView` and `GraphPathView` are never mounted. Only `GraphTopologyView` renders.
  - `RubricNotes` in EvaluationFeedback is unused.
  - The `codeCopied` state in App is unused.
  - `getQuizForNode` and `buildInterviewQuizQuestion` exist in `src/reactQuiz.js`, but the legacy UI has no quiz. Legacy copy nevertheless says "Incluida en el quiz de esta card."
- **Rails graph data lives in `legacy/App.jsx`.** This covers `CATEGORY_CONTEXT`, `INTERVIEW_LESSON_OVERRIDES` (mvc, rack, controllers_params, routing_rest, responses_errors, rspec_basics, case_reporting), `CONCEPTUAL_CORRECTIONS` (18 nodes) and `RAILS_MILESTONES` (8). `src/logic/railsGraph.js` lacks all of it (see §22). The content must be moved into `src/` before the legacy folder is deleted.
- **Styles:**
  - Dark theme only.
  - Category colors are immutable per graph.
  - Mobile breakpoints are 760px and 768px. `prefers-reduced-motion` rules exist.

---

## 1. Data model

### 1.1 React graph: `src/reactGraph.js` (default export)
```
{ id:"react", label:"React entrevistas", title:"React interview map",
  subtitle:"De modelo mental y entrega de features a browser, producción, design systems y liderazgo frontend.",
  categories:{[catId]:{label,color}}, categoryContext:{[catId]:string},
  nodes:Node[], edges:[sourceId,targetId][], nodeIds:Set<string>,
  interviewQuestions: REACT_INTERVIEW_QUESTIONS (110), interviewQuestionSource: GREATFRONTEND_REACT_SOURCE (url),
  milestones: REACT_MILESTONES (16), seniorityBands: REACT_SENIORITY_BANDS (4) }
```

**Counts (verified by running the module):**
- 101 nodes, 11 categories, 212 edges.
- 57 nodes have interview questions, 23 have a `table`, 10 have `mermaid`, 11 have a `prompt`, 40 have `related`.
- Exactly 1 node has `codeComparison` (`state_updates`). No node has `diagram`.

**Nodes per category:**

| Category | Nodes |
|---|---|
| fundamentals ("Modelo mental & componentes", #61DAFB) | 7 |
| state ("Estado & datos", #F59E0B) | 11 |
| effects ("Efectos & asincronía", #A78BFA) | 5 |
| rendering ("Render & performance", #4ADE80) | 9 |
| architecture ("Arquitectura web", #2DD4BF) | 19 |
| quality ("Testing & calidad", #F472B6) | 6 |
| platform ("Web, seguridad & deploy", #94A3B8) | 13 |
| designSystem ("Design systems & contratos", #FB7185) | 15 |
| runtime | 5 |
| operations | 3 |
| leadership | 8 |

The runtime, operations and leadership categories come from `SENIOR_CATEGORIES` in `seniorReactTopics.js`.

**Node shape:** `{ id, label, cat, lesson, interviewQuestions: {id,title,nodeIds}[], priority: 1-based index in priorityOrder, prerequisites: string[] }`

**Lesson shape (union of keys present):**
- Core fields:
  - `level`, a string such as "Base", "Fundamento" or "Estado".
  - `summary`, `why`, `explanation`.
  - `code`, `codeLabel`.
  - `steps[]`, `pitfalls[]`, `takeaway`.
- `audit{primer,example,failureModes[]}` and `explanationUsesAudit:boolean`.
  - `explanation` falls back to `audit.primer + " " + audit.example`.
- `docNotes[]`, merged with `REACT_REVIEW_NOTES[id]` from `reactSources.js`.
- `sources[{label,href}]`, merged with `getSupplementalReactSources(id)` and de-duplicated by href.
- `tableTitle`, `tableLabel`, `table{columns[],rows[][]}`.
- `mermaid` (a string), `diagramTitle`, `related[]` (node ids), `prompt`.
- `codeComparison{naive{label,code,whyItFails}, production{...}}`.
  - This field was **never rendered** by legacy. Treat it as a new v3 opportunity.

**Lesson build order:** `makeLesson(topicDetails)`, then `lessonAuditOverrides`, then `REACT_FOUNDATIONS_PROSE`, then audit (`REACT_AUDIT_NOTES` falling back to `REACT_ADVANCED_AUDIT_NOTES`), then `REACT_CONCEPTUAL_CORRECTIONS`, then `REACT_ARCHITECTURE_REVIEW`.

**Other React data:**
- **Milestones:** `{id,label,description,color,nodeIds[]}`. For example `react_foundations` = "Fundamentos".
- **Seniority bands:** `{id,stage,label,description,color,position{x,y},milestoneIds[],requires[],nodeIds[]}`. The four bands:

  | Band | Stage | Label | Requires |
  |---|---|---|---|
  | `react_professional` | "NIVEL I" | "React profesional" | – |
  | `senior_frontend` | "NIVEL II" | – | `react_professional` |
  | `senior_design_systems` | "ESPECIALIZACIÓN" | – | `react_professional` |
  | `frontend_lead` | "NIVEL III" | – | `senior_frontend` |

  A band's `nodeIds` is the union of its milestones' nodes.
- **Interview questions:** `{id:1..110, title, nodeIds[]}`. `getInterviewQuestionsForNode(nodeId)` returns the questions whose `nodeIds` include that node.
- **Deep dives:** `REACT_DEEP_DIVES` has 23 entries of the form `{title, aliases[], nodeIds[]?, answer, example, nuance?, sources[{label,href}]}`.
- `LEARNING_EXPLANATIONS` and `CLARIFIED_BULLETS` are **Rails-only** (40 keys each, only 1 overlaps React). React nodes do not merge them.

### 1.2 Rails graph (as legacy App built it)
- **Contents:**
  - 41 nodes and 7 categories.
  - 54 edges, taken from `PREREQUISITES` in App.
  - 8 milestones and no seniority bands.
  - No interview questions, and deep dives are disabled for Rails.
- **Categories:**
  - fundamentals "Rails core & request" #E8A33D
  - activerecord "Active Record & DB" #CC342D
  - patterns "Diseño aplicado" #5AA9FF
  - sti "STI & polimorfismo" #A78BFA
  - infra "API, seguridad & runtime" #94A3B8
  - assets "Asset pipeline" #2DD4BF
  - testing "Testing (RSpec)" #4ADE80
- **Graph config:** `{id:"rails", label:"Rails entrevistas", title:"Rails interview map", subtitle:"Core conceptual, diseño de necesidades de negocio, STI, API para React y asset pipeline.", categories, categoryContext, nodes, edges, nodeIds, milestones}`.
- **Node:** `lesson = {...(INTERVIEW_LESSON_OVERRIDES[id] ?? LESSONS[id]), ...LEARNING_EXPLANATIONS[id], ...CLARIFIED_BULLETS[id], ...CONCEPTUAL_CORRECTIONS[id]}` and `priority = PRIORITY.get(id) ?? 99`.
- **Rails lesson data:**
  - `LESSONS` (`src/lessons.js`, 53 keys) has shape `{level,summary,why,code,codeLabel,steps,pitfalls,takeaway,...extras}`. `react_rails_auth` has no LESSONS entry; only the correction supplies its fields.
  - `LEARNING_EXPLANATIONS[id]` is `{explanation}`.
  - `CLARIFIED_BULLETS[id]` is `{steps?, pitfalls?}`.
  - `CONCEPTUAL_CORRECTIONS` adds explanation, steps, pitfalls, table, code, mermaid, diagramTitle, related and takeaway.
  - The Rack override adds `diagram[{label,detail}]`, the only `diagram` user.
- **RAILS_MILESTONES:**
  - rails_request "Request Rails"
  - rails_data "Datos y Active Record"
  - rails_business "Diseño de negocio"
  - rails_cases "Casos de entrevista"
  - rails_domain "Modelado de dominio"
  - rails_api_security "API, React y seguridad"
  - rails_quality "Testing y operación"
  - rails_assets "Assets de Rails"

---

## 2. App shell, global state, routing, persistence

**App state (legacy/App.jsx):**
- Graph and progress: `graphKey`, `checked:Set` (completed node ids), `latestAttemptsByNode:Map`, `latestDraftsByNode:Map`, `activeCats:Set`.
- Selection and lesson: `selected` (node, meaning the modal is open), `mobileFocusedNode`, `lessonView` ("read" | "learn" | "coach" | "evaluate"), `lessonHistory` (node[]).
- Read-tab UI: `showCodeExplanation`, `activeDeepDive`, `ttsSpeed`, `ttsState{status,error,chunkIndex,chunkCount,activeSegmentId,paused}`.
- Panels and modes: `viewMode` ("graph" | "flashcards"), `workspaceNavOpen`, `progressPanelOpen`, `providerSettingsOpen`, `providerProfile`, `lessonContextOpen`, `commandPaletteOpen`, `zenMode`, `bgTasksPopoverOpen`.

**Routing (History API):**
- `getAppRoute(pathname)` maps `/react`, `/rails`, and `/{graph}/card/{nodeId}` to `{graphKey,nodeId,view:"graph"|"card",path}`. An unknown graph falls back to "react", and an unknown node falls back to the graph view.
- History state is `{app:"learning-map", view, graphKey, nodeId, previousNodeIds[], canReturn}`.
- Opening a card uses `pushState`. Closing uses `history.back()` when `canReturn`; otherwise it calls `replaceState('/{graph}')`.
- `popstate` calls `applyAppRoute`, which:
  - stops TTS;
  - resets `activeCats` when the graph changed;
  - resets `lessonView` to "read";
  - rebuilds `lessonHistory` from `previousNodeIds`;
  - closes the context panel and deep dive.
- On mount, the current URL is normalized with `replaceState`.
- `openLesson(node, rememberCurrent)`:
  - If the node is already selected, it closes the lesson (toggle behavior).
  - With `rememberCurrent`, it pushes the current node onto `previousNodeIds`, which enables the "Volver a {label}" button.
  - It stores the focus-return element.
- Switching graph navigates to `/{graph}` with a push.

**Progress hydration** (runs on graph change):
- `Promise.all([listAllAttempts(), listAllDrafts()])` is filtered by `graphId`.
- The latest attempt per node is the one with the greatest `createdAt`.
- A node is **completed** when either:
  - any attempt has `isEvaluationSurfaceComplete(evaluation) || evaluation.score >= 80`, or
  - its draft has `harnessPassedThreshold || harnessScore >= 95`.
  - Draft keys are `"graphId:nodeId"`.
- Callbacks from ParaphraseReview: `handleEvaluationSaved(attempt)` and `handleDraftSaved(nodeId,draft)` update the maps and `checked` in place.
- An error in the hydration promise is caught, and the maps reset to empty.

**Derived values:**
- Header totals: `total`, `done`, `percentage = round(done/total*100)`.
- `getMilestoneProgress` and `getSeniorityProgress` (§21).
- `getGuidance(nodes, checked, activeCats)`:
  - Builds 3 levels: level 1 has 1 node, levels 2 and 3 have up to 4 each.
  - Candidates are unchecked nodes in active categories whose prerequisites are all checked or out of focus, sorted by priority.
  - Returns `{levels, levelById:Map<id,1|2|3>, primary}`.
- `getLessonContext(node, prereqs, missing, categoryContext)`:
  - No prerequisites: `"{phase} Este es el punto de partida: no presupone ningún nodo anterior."`
  - Missing prerequisites: `"{phase} Antes de estudiar este nodo necesitás completar: {labels joined ' y '}. Esos conceptos aparecen aquí como base, no como detalle opcional."`
  - Otherwise: `"{phase} Llegaste acá después de {names}; este nodo usa esas ideas y agrega una decisión nueva."`
- Selected-node derivations:
  - `selectedAfterNodes` = up to 5 in-focus children sorted by priority. If there are none, it falls back to `nextFocusNode`, the first active-category node with a higher priority.
  - `selectedRelatedNodes` = `lesson.related`, filtered to in-focus nodes.

**Persistence (all keys):**

| Store | Key or name | Contents |
|---|---|---|
| IndexedDB | DB `learning-graph-ai` v3 | stores `attempts` (keyPath id, index byNode `[graphId,nodeId,createdAt]`, trimmed to 12 per node), `drafts` (keyPath `key="graphId:nodeId"`), `liveReviews` (keyPath key), `coachIterations` (keyPath id, index byNode, trimmed to 24 per node) |
| localStorage | `learning-workspace:provider-connections:v4` | provider state. Legacy keys `learning-workspace:provider-profiles:v3`, `…:v2` and `learning-workspace:provider-profile:v1` are migrated and then removed |
| localStorage | `knowgraph_active_tasks` | running background tasks, rehydrated if updated less than 10 min ago |
| BroadcastChannel | `knowgraph_tasks_sync` | cross-tab task sync |
| Electron | `window.learningDesktop` | `.providerSettings{load,save,clear}`, `.backup{save(json,filename),load()}`, `.isElectron` |

No UI preference (zen, tts speed, view mode, filters) is persisted.

**Global keyboard:**
- **Ctrl/⌘+K:** toggles the command palette. It works everywhere, including inside the modal.
- **Esc with no lesson open:** closes the provider panel, then the progress panel, then the nav drawer, in that priority order.
- **Esc with a lesson open:** closes the deep dive if one is open; otherwise it closes the lesson. Zen mode does **not** intercept Esc, even though its tooltip says "(Esc)".
- **Focus trap:** Tab and Shift+Tab are trapped inside the lesson modal.
- **Focus management:** focus goes to the close button when the modal opens and returns to the opener when it closes.
- **Scroll lock:** `overflow:hidden` is applied to the html and body elements while the modal is open.

---

## 3. Header / command bar (`header.desktop-commandbar`)

**Hamburger** (`workspace-nav-toggle`, three spans):
- aria-label: "Abrir navegación" or "Cerrar navegación".
- Opening it closes the progress and provider panels.

**Identity block:**
- `h1 {graph.title}` and `p.subtitle {graph.subtitle}`.
- React only, when `interviewQuestions` exist: badge link `"{n}/110 preguntas de referencia trazadas al mapa ↗"` pointing to `interviewQuestionSource`.

**Search trigger:**
- Text "Buscar concepto...", a `<kbd>Ctrl K</kbd>`, and the aria-label or title "Buscar concepto o acción (Ctrl+K)".
- Opens the palette.

**Provider toggle:**
- Shows the gear icon plus `providerProfile.label`, or "IA" when none is set.
- title: "Provider activo: {label}" or "Configurar provider de IA".
- The aria-label has a mojibake bug ("configuraciÃ³n"); fix it in v3.
- It is mutually exclusive with the other panels.

**Progress block:**
- Shows `"{done}/{total}"`, a progress bar (aria-label "Progreso total: {done} de {total} nodos"), `"{pct}% dominado"` and a chevron.
- It toggles the progress panel.

Data: `graph.title`, `subtitle`, `interviewQuestions.length`, `loadProviderProfile()` (§20), `checked.size`, `graph.nodes.length`.

---

## 4. Workspace navigation drawer (`#workspace-navigation`)

**Heading and graph switcher:**
- Heading "WORKSPACE" / "Navegación" with a close (×) button: "Cerrar navegación".
- "MAPA DE CONOCIMIENTO" label, then one `graph-switch` button per graph ("React entrevistas", "Rails entrevistas"). The active one has `is-active`.

**`ViewModeToggle`:**
- A tablist "Modo de vista" with "Grafo" and "Flashcards".
- Choosing one closes the drawer.

**FOCO legend:**
- Heading "FOCO" with the subtitle "Elegí un grupo para aislarlo".
- "Todos" chip resets to all categories (aria-pressed when all are active).
- One chip per category:
  - colored dot, label, and count `"{doneInCat}/{totalInCat}"`;
  - clicking focuses **only** that category (a single-select model);
  - inactive chips render at opacity 0.42.
- Every chip click closes the drawer.

**"Próximo desafío sugerido" strip:**
- "PRÓXIMO DESAFÍO" followed by `primaryNext.label`, or "Ruta completada".
- Scope line: "Viendo la ruta completa", or "Foco: {cat labels}".
- Button "Abrir card →", shown when there is a primary node.

**Footer:** "Ajustes, IA y Respaldo" opens the provider panel.

The drawer uses a backdrop that closes it on click.

---

## 5. Progress panel (`#workspace-progress-panel`, aside)

**Header:** "Progreso del mapa" / `"{done}/{total} nodos dominados"`, with a close button: "Cerrar panel de progreso".

**Seniority map** (only when `seniorityBands` is non-empty, which means React):
- Heading texts:
  - Kicker: "MAPA DE SENIORITY"
  - h2: "La superficie completa del crecimiento frontend"
  - Paragraph: "Cada banda agrupa varios milestones. Design Systems es una especialización paralela; Frontend Lead se construye sobre la banda Senior Frontend."
  - Summary: `"{n}/{m} capacidades cerradas"`.
- Each band card:
  - Stage pill (`band.stage`) and status: "✓ NIVEL COMPLETO", "EN PROGRESO" (requirements met) or "BASE PENDIENTE". Card classes are `is-complete`, `is-active` or `is-locked`.
  - `h3 label`, `strong {pct}%`, description.
  - Progress bar with aria "{label}: {done} de {total}".
  - Meta: `"{done}/{total} nodos"` and `"{k} milestones"`.
  - Chips for each milestone label; the chip is `is-complete` when that milestone is at 100%.

**Milestones:**
- Kicker "MILESTONES", paragraph "Completá grupos coherentes para cerrar etapas y recuperar la sensación de avance.", summary `"{n}/{m} grupos completos"`.
- Each card shows h2 label, description, `{pct}%`, a progress bar, `"{done}/{total} nodos"`, and "✓ COMPLETO" at 100%.

**Data / backup:**
- Kicker "DATOS", paragraph "Respaldo local de progreso, borradores, revisiones y conexiones. Las API keys quedan fuera del archivo."
- Buttons "Exportar respaldo" and "Importar respaldo".
- The copy is **factually wrong**: `createBackup` includes API keys (`secretsIncluded:true`). See §22.

**Backup flow:**
- **Export:** `downloadBackup(await createBackup())`.
  - In Electron it uses `learningDesktop.backup.save`; on the web it downloads a Blob as `learning-workspace-backup-YYYY-MM-DD.json`.
  - On error it shows `alert("No se pudo exportar el respaldo: {msg}")`.
- **Import:** Electron uses `learningDesktop.backup.load()`; the web uses a hidden `<input type=file accept="application/json,.json">`. The file then goes through:
  1. `parseBackup(text)`, which throws "El archivo no es un respaldo válido de Learning Workspace." on a bad file.
  2. `confirm("Esto reemplazará tu progreso, borradores y conexiones actuales con el contenido del respaldo. Las API keys no se restauran: tendrás que volver a ingresarlas. ¿Continuar?")`.
  3. `applyBackup`, then `location.reload()`.
  - On error it shows `alert("No se pudo importar el respaldo: {msg}")`.

---

## 6. Provider settings panel (`ProviderSettingsPanel`, `#workspace-provider-panel`)

**Props:** `{open, profile, onClose, onSaved(profile|null), onExportBackup, onImportBackup}`.

**Views:**
- There are three views: `connections`, `catalog` and `editor`.
- When the panel opens, it runs `loadProviderSettings()` and goes to `catalog` if there are no profiles, otherwise to `connections`.
- It also runs `fetchAiProviderCatalog()` at the same time.

**Header by view:**

| View | Title | Subtitle |
|---|---|---|
| connections | "Conexiones de IA" | "Elegí la cuenta y el modelo que usa el coaching." |
| catalog | "Elegí un provider" | "Directo si el protocolo es compatible; transparente si necesita otro adaptador." |
| editor | "Configurar conexión" | "La prueba usa una inferencia mínima; nunca envía contenido de estudio." |

**Header actions:**
- catalog: "Guardadas ({n})".
- connections: "+ Agregar".
- editor: back button (aria "Volver").
- All views: close button (aria "Cerrar conexiones de IA").

**Connections view:**
- **Active summary:** "En uso", then `activeConnection.label` or "Provider del gateway", then the model or "Sin una conexión personal activa". The button "Usar gateway" calls `setActiveProviderProfile(null)` and shows "Se usará el provider por defecto del gateway."
- **List:** heading "Guardadas" with a count and the button "+ Nueva conexión".
  - Empty state: "Todavía no hay conexiones configuradas." / "Conectá una cuenta o endpoint del catálogo para comenzar a estudiar con IA." / "Explorar catálogo de proveedores".
- **Each row:**
  - Marker, `label`, `"{model||'Falta elegir un modelo'} · {provider.label||adapter}"`.
  - State "En uso", "Usar" or "Completar".
  - Clicking the row activates it if ready (`normalizeProviderProfile(connection)` is non-null); otherwise it opens the editor.
  - Row actions "Editar {label}" and "Eliminar {label}".
  - Status messages: "{label} se usará en las próximas evaluaciones." and "Se eliminó {label}.".
- **Backup section:** "GESTIÓN DE DATOS Y RESPALDO" / "Exportá tu progreso, borradores de respuestas y configuración en JSON para respaldar o sincronizar entre dispositivos." with the buttons "Exportar respaldo (.json)" and "Importar respaldo (.json)".
- **Storage note:** `providerStorageDescription()` + " La clave viaja solo al gateway al pedir una respuesta; el gateway no la persiste."
  - Electron text: "La clave se guarda cifrada en este dispositivo."
  - Web text: "La clave se conserva solo mientras esta pestaña permanezca abierta." This is **inaccurate**: the key is kept in localStorage.
- **Danger link:** "Eliminar todas las conexiones de esta sesión" calls `clearProviderProfile()` and shows "Se eliminaron las conexiones guardadas en esta sesión."

**Catalog view:**
- **Search:** placeholder "Buscar provider, modelo o protocolo…", with a clear button ("Limpiar búsqueda"). It matches label, id, description, transport, catalogName and environmentVariables.
- **Refresh:** "Actualizar" (shows "Actualizando…" while loading) calls `fetchAiProviderCatalog({refresh:true})`.
- **Summary line:** "Actualizando el directorio de providers…", or `"{n} providers · catálogo Models.dev"` or `"… · biblioteca integrada"`.
  - "Ver todos" resets the category filter.
  - Warning on failure: "No se pudo actualizar el directorio. Podés usar la biblioteca integrada o reintentar."
- **Desktop-only note** (web runtime with local providers present): "Modelos locales" / "Disponible solo en la app de escritorio". Local providers are hidden on the web.
- **Category pills:**
  - "Todos" plus one pill per `provider.group`, from `shared/providerCatalog.js`: "APIs directas", "Routers", "Local", "Personalizado". Pills show counts.
  - Clicking the active pill again goes back to all.
  - A pill is disabled when its count is 0 and a query is set.
- **Quick custom card** (only when "all" is selected and there is no query): "Endpoint compatible" / "Conectá un gateway propio, vLLM o cualquier `/chat/completions`."
- **Grouped list:**
  - Each item shows a glyph (first letter), label, description, and an availability badge ("Local", "Requiere adaptador", "Compatible" or "Listo").
  - Chevron, or a lock icon when `!connectable`.
  - Clicking it calls `startCreate` → `createProviderDraft(provider)`.
- **Empty state:** "No encontramos providers que coincidan." / `No hay resultados para "{q}" en {el catálogo|cat}.` / "No hay providers disponibles en esta categoría." with a "Restablecer filtros" button.
- **Fallback directory** when the API is down: `PROVIDER_LIBRARY` (24 presets) with `connectable:true`.

**Editor view** (form; submit = save and activate):
- **Provider card:** glyph, label, description and a "Cambiar" button.
- **Local notice:** "Este endpoint solo puede usarse desde Electron o un gateway local con `ALLOW_PRIVATE_PROVIDER_URLS=true`. El deployment público lo rechaza por seguridad."
- **Fields:**

  | Field | Placeholder / behavior | Help text |
  |---|---|---|
  | "Nombre de esta conexión" | "Ej. OpenRouter personal", max 80 | – |
  | "Base URL" | "https://api.example.com/v1" | "La app agrega `/chat/completions`. Debe ser HTTPS y una API compatible." |
  | "API key" | password field, "Pegá tu clave" | – |
  | "Modelo" | a `<select>` "Seleccioná un modelo" once models are loaded (options `"{label} · {id}"`, capped at 250 and filtered by the "Filtrar modelos de la lista…" input); otherwise a text input "Ej: gpt-4o, llama-3.3-70b, deepseek-chat…" | – |

- **"Probar modelo"** (shows "Probando…"; disabled without a model) calls `testAiProvider({provider})`:
  - Status while testing: "Probando el modelo con una inferencia mínima…"
  - Success: "El modelo respondió en {latencyMs} ms."
  - Errors, by result code:

    | Error code | Message |
    |---|---|
    | `token_rejected` | "El endpoint respondió, pero rechazó la API key." |
    | `chat_route_not_found` | "El endpoint no expone /chat/completions. Elegí un endpoint compatible." |
    | `rate_limited` | "El provider limitó la prueba. Esperá un momento y reintentá." |
    | `timeout` | "El modelo tardó demasiado. Revisá la URL o reintentá." |
    | any other | "El modelo rechazó la prueba. Confirmá URL, API key y slug." |

- **"Cargar catálogo"** (shows "Cargando…") calls `fetchAiProviderModels({provider})`:
  - Success: `"{n} modelos disponibles · {endpoint y catálogo|endpoint|catálogo|preset}."`
  - Empty result: shows `discovery.catalog.warning`, or "No encontramos modelos. Podés ingresar el slug manualmente."
  - A toggle switches between "Ingresar slug manualmente" and "Elegir de lista".
  - Default help text: "El catálogo ayuda a elegir; probar modelo confirma URL, credencial y slug reales."
- **Validation errors:** "Completá endpoint, API key y modelo antes de guardar." and, for the catalog, "Completá endpoint y API key antes de cargar el catálogo."
- **Buttons:**
  - "Guardar" calls `saveProviderProfile(p,{activate:false})` and shows "Conexión guardada."
  - "Guardar y usar" (submit) activates the profile and shows "Conexión guardada y seleccionada para el coaching."
- Status is shown by `<p class="provider-status provider-status--{idle|testing|success|error}">`, with role alert on error.

---

## 7. "Ruta sugerida" strip (graph mode only)

- Kicker "RUTA SUGERIDA", help text "Las flechas muestran qué concepto habilita al siguiente."
- 3 levels, labeled "AHORA", "DESPUÉS" and "MÁS ADELANTE".
- Each item is a button showing `node.priority` and the label; it opens the lesson.
- Empty level: "No hay nodos disponibles".

---

## 8. Graph views

### 8.1 GraphTopologyView (the only mounted view)

**Props:** `{context, selected, onToggleNode, onBackgroundClick}`, where `context = {graph, checked, latestAttemptsByNode, latestDraftsByNode, activeCats, guidance, milestoneProgress, seniorityProgress, milestoneByNodeId, seniorityByNodeId, activeTaskNodeIds}`.

**Layout:** `createTopologicalLayout(graph)`:
- Sugiyama-style: the rank is the longest prerequisite path, and 8 barycentric sweeps order each layer.
- Config: nodes are 236×86, column gap 116, row gap 38.
- Returns `{config, layers, positions:Map<id,{node,rank,order,x,y}>, edges, parents, children, maxRank, width, height, hasCycle}`.
- `collectTopologyFocus(nodeId, layout)` returns `{ancestors, descendants, nodes, edges}` for **direct** neighbors only.

**Toolbar:**
- Reading area:
  - Idle: "Ruta sugerida" / "Mostramos solo el próximo avance. Pasá por un nodo para inspeccionar sus relaciones directas."
  - On hover: `{label}` with "Necesita {parents}" and "Habilita {children}".
- Stage indicator: `"Etapa {rank+1} de {maxRank+1}"` for the hovered node, or for the primary node when nothing is hovered.
- Controls:
  - "Próximo foco" centers the primary node.
  - Fit ("Ver el mapa completo").
  - "Alejar" and "Acercar", in steps of ×1.16 and clamped to 0.18–1.7.

**Canvas:**
- The SVG has `role="application"`, aria "Mapa topológico de {title}. {n} etapas y {m} dependencias."
- Stage columns show "ETAPA {n}" with "Punto de partida" or "{k} conceptos".
- **Edges:** only the guide route (level-1 node of each guidance level chained together) is visible. When a node is hovered, only its incoming and outgoing edges show, with separate markers for incoming, outgoing and guide edges.
- **Node card:**
  - Category dot and truncated category label (19 chars).
  - Score text `"{displayScore}/120"` or "Sin evaluar".
  - Two-line label (29 chars per line).
  - Progress track: a base segment up to 100, an extra gold segment for 100–120, and a mastery tick at 100.
  - Guide badge "MEJOR SIGUIENTE" or "NIVEL n".
  - Active-task pulse dot and aura.
  - Excellence aura when there are extra points.
  - Classes: `is-selected`, `is-complete`/`is-uncompleted`, `is-dimmed` (category out of focus, or not in the hover chain), `is-ancestor`, `is-descendant`.
- **Accessibility:**
  - `aria-label` = `nodeAriaLabel` + " IA trabajando activamente en esta card." + " Etapa x de y."
  - `<title>` = "{label}. Etapa n. {score}. (IA activa en segundo plano)".
  - Dimmed nodes get tabIndex −1.
- **Interaction:**
  - Enter or Space toggles the node.
  - Click toggles the node, unless the pointer was dragged more than 5px.
  - Clicking the background closes the lesson.

**Initial view:** `viewForPosition` fits a whole number of columns (scale ≤1.04, minimum useful scale 0.84 on mobile and 0.88 on desktop) starting at the primary node. It recenters on resize (ResizeObserver) and on graph change.

**`getNodeVisual(node, ctx)`:**
- Returns `{category, color, isChecked, score (getScoreView or harness pseudo-score), coverage 0..100, extra, guideLevel 0..3, dimmed, hasActiveTask}`.
- When there is no attempt but the draft has a harness score, it synthesizes a score with `displayMax:100` and `status` "exceptional" when ≥95, otherwise "strong".

**`usePanZoom({min,max,initial})`:**
- Returns `{ref, view{x,y,k}, setView, wasDragged(), panHandlers{onPointerDown,onPointerMove,onPointerUp,onPointerCancel}}`.
- Wheel zoom is non-passive, anchored at the cursor, with a factor of 1.12.
- Pointer capture starts only after the 5px drag threshold, so node clicks still register.

### 8.2 DORMANT views
- `GraphViewTabs` (tablist "Variantes de visualización del grafo": "Clásico" | "Carriles" | "Radial" | "Ruta").
- **Lanes:** one column per category, headed by the category label and "{done}/{total} cubiertos". Cards are 224×52 with `CoverageRings`, priority and a "+{extra}" bonus.
- **Radial:** category sectors with a central hub showing "{pct}%" and "{done}/{total} dominado".
- **Path:** a serpentine route in priority order (5 columns), with milestone bands labeled "✓ {label}" and "{done}/{total} · {pct}%". Segments completed on both ends are highlighted, and skip-edges are drawn as arcs.
- Shared constants: `GUIDE_STROKE{1:#F5F1E8,2:#E8A33D,3:#5AA9FF}` and `GUIDE_LABEL{1:"MEJOR SIGUIENTE",2:"NIVEL 2",3:"NIVEL 3"}`.
- `nodeAriaLabel` parts: "prioridad n", "superficie cubierta", "cobertura x de 100" or "pendiente", "más n puntos de excelencia opcional", "mejor siguiente" or "nivel n de la ruta sugerida".

---

## 9. Flashcards (`FlashcardView`, props `{graph, onOpenNode}`)

**Data:**
- `listAllAttempts()` and `listAllDrafts()`, filtered to the graph.
- The representative attempt per node comes from `selectRepresentativeAttempt(attempts, tolerance=5)` (§21).
- Draft by node comes from `key.split(":")`.
- `isAiGenerated = attempt.isAiGenerated || draft.isAiGenerated`.
- `useBackgroundTasks(graph.id).activeTaskNodeIds`.

**Toolbar:**
- Filters:

  | Filter | Label | Rule |
  |---|---|---|
  | all | "Todas" | every card |
  | ai-generated | "✨ Con IA" | `isAiGenerated` |
  | no-attempt | "Sin intento" | no attempt |
  | below-mastery | "Base < 100" | `!isMastery` |
  | mastery | "Base alcanzada" | `isMastery` |
  | extra | "Con extra dorado" | `isExtra` |

- "⚡ Iniciar práctica rápida", "✦ Elegir al azar" (scrolls to and spotlights a random card), and `"{n} cards visibles"`.

**Empty state:** "No hay cards que coincidan con este filtro." with a "Ver todas" button. The toolbar is hidden in this state.

**Grid card:**
- Category label, `#{priority padded to 2}`, title, and summary. The summary falls back to "Recuperá el concepto, su propósito y el criterio para aplicarlo."
- Badge: "IA en progreso" (with spinner) for an active task, otherwise `"{displayScore}/120 · {STATUS_LABEL}"` or "Sin intento".
- Badge "✨ Con IA".
- Progress bar (with extra styling).
- CTA: "Revisar mi explicación" or "Practicar recuerdo" ↗.
- Secondary button "Estudiar card completa →" switches to graph mode and opens the lesson.
- Card classes: `flashcard-shell--{status|none}`, `is-exceptional`, `is-spotlight`.

**Modal** (backdrop click closes it):
- **Header:** category, `"CARD {i} DE {n}"`, and "🔥 Racha: {streak}" in practice mode. Title, score badge, and close button ("Cerrar flashcard").
- **Front:**
  - "PREGUNTA DE REPASO".
  - Prompt `lesson.prompt`, or "Explicá qué es {label}, por qué importa y cómo se aplica en un proyecto real."
  - Button "Revelar respuesta y modelo mental" with `<kbd>ESPACIO</kbd>`.
- **Back:**
  - "MODELO MENTAL CANÓNICO" with a TTS toggle ("Escuchar modelo" / "Detener"), which reads summary + ". Por qué importa: " + why.
  - Summary and why paragraphs, labeled "En una frase:" and "Por qué importa:".
  - If there is an attempt:
    - "TU RESPUESTA EVALUADA" and "✨ Generada con IA".
    - TTS button "Escuchar mi respuesta".
    - `ReadingChunks(answer)`.
    - `ModelMeta`, the duration from `formatEvaluationDuration`, and the verdict "{score}/120 · {status}".
  - Otherwise, if there is a draft: "BORRADOR EN PROGRESO" and "✨ Generado con IA".
  - AI notice: "✨ Card generada con IA" / "¿Querés consolidar tu propio modelo mental escribiéndolo desde cero?" with the button "Practicar en Coaching →". That button calls `onOpenNode`, which opens the card on the Read tab, **not** the coach tab.
- **Footer:**
  - Navigation "←", `{i}/{n}`, "→".
  - Practice mode, after flipping: "¿Cómo lo recordaste?" with ratings "1 Otra vez", "2 Difícil", "3 Bien", "4 Fácil". A rating of 3 or more increments the streak; anything lower resets it. Ratings advance to the next card, and after the last card the complete screen shows.
  - Otherwise: "Ver respuesta (Espacio)" / "Ocultar respuesta" and "Estudiar card completa ↗".
- **Complete screen:** "🎉", "¡Sesión de práctica completada!", "Repasaste {n} conceptos clave. Racha alcanzada: {streak} seguidas.", with "Repetir sesión" and "Volver al mazo".
- **Keys while the modal is open:**
  - Esc closes.
  - Space flips.
  - ←/→ move between cards.
  - 1–4 rate (practice mode, flipped only).
- TTS is cancelled when the card changes or flips.

There is **no mastery persistence**: ratings are in-memory only.

---

## 10. Command palette (`CommandPalette`)

**Props:** `{open, onClose, graph, onSelectNode, onSwitchGraph, onOpenFlashcards, onOpenProviderSettings, onOpenProgress, onExportBackup, onImportBackup, graphConfigs, activeGraphKey}`.

**Input:** placeholder "Buscar concepto, card, acción o atajo... (Escribí para filtrar)", with `<kbd>ESC</kbd>`. The input is autofocused and the query resets whenever the palette opens.

**Actions** (badge "Acción"; filtered on label and description):

| Icon | Label | Description |
|---|---|---|
| ✦ | "Iniciar práctica de Flashcards" | "Repaso activo con tarjetas y autoevaluación" |
| 📊 | "Ver progreso y milestones" | "Métricas de dominio por etapas y seniority" |
| ⚙ | "Configurar proveedores de IA" | "Conexiones de OpenCode, Groq, Ollama, OpenAI y endpoints locales" |
| ↓ | "Exportar respaldo" | "Descargar progreso, borradores y conexiones (sin API keys)" |
| ↑ | "Importar respaldo" | "Restaurar desde un archivo de respaldo" |
| 🗺 | "Cambiar a mapa de {label}" | "Explorar {subtitle}" (one per other graph) |

The export row's "(sin API keys)" is also wrong; see §22.

**Nodes:**
- Each row shows `#{priority}`, label, category, summary, and a "↵" hint.
- Rows are filtered on label, category and summary.

**Behavior:**
- Keys: ↑/↓ wrap around, Enter runs the item, Esc closes. Hover selects the row, and the selected row scrolls into view.
- Empty: `No se encontraron conceptos ni acciones para "{q}".`
- Footer: "↑↓ Navegar", "↵ Abrir", "ESC Cerrar", `"{n} resultados"`.

---

## 11. Lesson modal (card)

The modal (`.lesson-modal`, dialog labelled by `#lesson-title`, described by `#lesson-summary`) sets `--lesson-color` to the category color. Scrolling the modal closes the deep dive. Scroll resets to top when the node or tab changes.

### 11.1 Header

**Score widget:**
- Title `h2 {label}`.
- `"SCORE CANÓNICO"` with `{displayScore}/{displayMax}`, or "PENDIENTE" when there is no attempt.
- A bar at `displayScore/displayMax`.
- Detail line: `"{coveragePercent}% de cobertura · {excelencia extra|base}"`, or "Evaluá tu draft cuando estés listo".
- Aria: "Score canónico x de y" or "Sin evaluación canónica".

**Status row:**
- `"{cat label}"` and `"Prioridad #{priority}"`.
- TTS badges:
  - `"PARTE i/n"` while loading.
  - `"PARTE i/n · LECTURA DEL NAVEGADOR"` while playing.
  - `"LECTURA EN PAUSA · PARTE i/n"` while paused.
- State badge (first matching rule wins):
  1. `checked` → "SUPERFICIE CUBIERTA 100%".
  2. Has a completion → `"CHECKPOINT · COBERTURA {percent}%"`.
  3. Is in the guidance → "MEJOR SIGUIENTE" or "NIVEL n".
  4. Has missing prerequisites → "PRERREQUISITOS RECOMENDADOS".
  5. Otherwise → "DISPONIBLE".

**Actions:**
- **"Ruta"** toggles the context panel.
- **TTS controls** (only when there are segments):
  - ↻ "Repetir segmento actual".
  - ⏮ "Segmento anterior", disabled at the first segment.
  - Main button: "Play", "Pausa", or "Preparando i/n" (aria "Reproducir lectura" / "Pausar lectura").
  - ⏭ "Segmento siguiente".
- **Speed:** −/+ ("Reducir velocidad" / "Aumentar velocidad") over steps [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], shown as `"{speed}x"`.
- **Zen toggle:** "Modo Zen (pantalla completa)" / "Salir de modo Zen".
- **Back button** (only with history): "Volver a {previous label}".
- **Close:** "Cerrar lección".

**Context panel** (`#lesson-context-navigation`, toggled by "Ruta"):
- "LUGAR EN EL MAPA" with ANTES / AHORA / DESPUÉS columns.
  - ANTES: in-focus prerequisites as buttons, or "Inicio de este foco" / "Punto de partida".
  - DESPUÉS: `selectedAfterNodes`, or "Último eslabón".
  - Buttons call `openLesson(n, true)`.
- "SIGUIENTE CARD EN ESTE FOCO": "Continuar con" + `{next label} →`.
- "COMPLETITUD", with one of three texts:
  - Checked: "Superficie conceptual cubierta al 100%. Ya podés avanzar; la profundización extra es opcional."
  - Has an attempt: `"Cobertura conceptual: {percent}% ({score}/{max} puntos). Score global: {displayScore}/120. La profundización extra no reemplaza las ideas esenciales que faltan."` plus the detail `"{score}/{max} cobertura · score {display}/120"`.
  - No attempt: "Todavía no hay una evaluación para este nodo. Escribí tu explicación y pedí una revisión para medir la cobertura de la card."

The same three blocks are **duplicated** in the right rail, `aside.lesson-aside`. It is always visible on desktop and stacks on mobile.

### 11.2 Tabs (`role=tablist`, "Vistas de la card")

Heading "RUTA DE ESTUDIO" / "Del concepto al dominio".

| # | lessonView | Label | Subtitle |
|---|---|---|---|
| 01 | read | "Lectura" | "Concepto y flashcard" |
| 02 | learn | "Mentor IA" | "Masterclass y Socrática" |
| 03 | coach | "Parafrasear" | "Escribir con tus palabras" |
| 04 | evaluate | "Evaluar" | "Confirmar dominio" |

- Tabs 02 and 04 show a pulse dot while the card's background task of the matching type (`pedagogical_harness` / `evaluation`) is running. The dot titles are "Mentor y Juez IA en progreso" and "Evaluación con IA en progreso".
- Switching tabs closes the deep dive.
- Every tab resets to "read" on navigation.

**Running-task banner:**
- Shown when `currentCardTask.status==="running"` (role status).
- Content: icon (⚖️ judging, 🧠 evaluating, 🪄 otherwise) and `task.message`.
- On the read and coach tabs it adds a button "Ver en vivo →", which jumps to evaluate or learn depending on the task type.

### 11.3 Read tab sections (in order)

Each section heading has a `SectionAudioButton` (aria "Reproducir sección {id}", title "Reproducir esta sección") when a segment with that id exists. The section currently being spoken gets the `tts-reading-section` or `tts-reading-text` highlight.

1. **TTS error:** alert box.
2. **"EN UNA FRASE":** `ReadingChunks(summary)` with id `lesson-summary`. Then "Por qué importa:" with `ReadingChunks(why)`.
3. **"EXPLICACIÓN CLARA":** `ReadingChunks(explanation)`, where each chunk is passed through `RichText` for deep-dive terms (React only, max 2 per chunk).
4. **Audit** (if `lesson.audit`):
   - Label: "RIESGOS QUE DEBÉS PODER EXPLICAR" when `explanationUsesAudit`, otherwise "CASO CONCRETO Y FALLAS".
   - When not `explanationUsesAudit`, it also shows "Qué es:" primer and "Ejemplo:" example.
   - Failure list: "Qué puede salir mal:" or "Si algo sale mal:" followed by `failureModes`.
5. **"MATICES DE LA DOCUMENTACIÓN"** (if `docNotes`): intro "Estas aclaraciones separan el comportamiento documentado de React o la librería de una decisión de arquitectura de la app." and a list.
6. **"DÓNDE ESTAMOS EN LA RUTA":** `getLessonContext` text. Gets `is-blocked` when prerequisites are missing.
7. **"POSIBLE CONSIGNA EN VIVO"** (if `prompt`).
8. **Table** (if `table`): `tableTitle` (default "MAPA RÁPIDO") and `tableLabel` (default "Relación entre conceptos"), then an HTML table.
9. **"DIAGRAMA"** with `diagramTitle`:
   - `mermaid` renders as a `MermaidDiagram` (loading text "Preparando diagrama…").
   - `diagram[]` renders as a flow of boxes with `→` arrows.
10. **"EJEMPLO"** with `codeLabel`:
    - Info button "i" toggles "Explicar este snippet" / "Ocultar explicación". It shows `getCodeNarration(node, lesson)` in `#code-explanation`.
    - Code is a **plain `<pre class=code-block>`**, with no Prism and no copy button.
11. **"PASO A PASO"** (ordered list of steps) and **"TRADE-OFFS Y ERRORES"** (pitfalls; the grid collapses to a single column when there are none).
12. **"IDEA PARA RECORDAR"** (takeaway).
13. *(`ParaphraseReview` mounts here with viewMode "hidden" on the read tab.)*
14. **"COBERTURA DE ENTREVISTA"** (a `<details>`, React only):
    - Summary: `"{unlocked}/{total} desbloqueadas"`.
    - Each question row shows `#{id}` and the title, then either "Bloqueada: completá {labels joined ' · '}." or "Incluida en el quiz de esta card."
    - Link "Abrir la lista de referencia de GreatFrontend ↗".
    - Data: `getInterviewQuestionPrerequisites(q, graph)` returns the de-duplicated prerequisite closure of `q.nodeIds`. The missing nodes are the unchecked ones.
15. **"FUENTES PARA VERIFICAR Y PROFUNDIZAR":** links with ↗, opened in a new tab.
16. **"RECORDATORIOS RELACIONADOS":** "Si necesitás repasar una pieza antes de continuar, abrila sin perder esta lección.", with buttons "Abrir: {label} →" (these remember history).

**Deep-dive popover:**
- Rendered in a portal as `aside#deep-dive-popover` (role dialog, non-modal).
- Content: "SEGUNDA CAPA · POR QUÉ", `dive.title`, answer, "Ejemplo" example, "Matiz importante" nuance, source links ↗, and a close button "Cerrar explicación profunda".
- **Trigger button** (`.deep-dive-term`):
  - Shows the matched text followed by a "?" glyph.
  - aria-label "Profundizar por qué: {text}", title "Abrir una explicación más profunda".
  - aria-expanded and aria-controls are set.
- **Placement:** below the trigger if at least 240px of usable height is available, otherwise above. Max height 520, viewport edge 24px, gap 12px, width about 300–520px.
- Closing restores focus to the trigger.
- **Matching:** `findDeepDiveMatches(text, nodeId, limit=3) → {id,start,end,text}[]`. It:
  - uses dives with no `nodeIds` or whose `nodeIds` include the node;
  - tries the longest alias first, case-insensitive;
  - uses each dive at most once and avoids overlapping matches.

**TTS engine (browser Speech Synthesis, in App):**
- Segments come from `buildBrowserSpeechSegments(node, contextString)`, which calls `buildLessonNarrationSegments`.
  - Each segment is `{id,title,text}`.
  - Ids: summary, why, explanation, audit, docNotes, context, prompt, table, diagram, example, steps, pitfalls, takeaway.
  - Text is normalized by `normalizeSpeechText`.
- Utterances use `lang="es-419"` and `rate=speed`. Playback chains segments and uses a generation counter to cancel stale callbacks.
- **Commands:**
  - `toggleSpeech` plays, pauses or resumes.
  - `moveSpeechSegment(±1)`.
  - `replaySpeech`.
  - `playSectionSpeech(id)`.
  - A speed change restarts the current segment if playing.
- **Errors:**
  - "Este navegador no ofrece Speech Synthesis."
  - "No se pudo reproducir la lectura. {error}" (the "canceled" and "interrupted" errors are ignored).
- Stops on unmount and on route change.

**Zen mode:**
- Toggling it adds `is-zen` to the modal (fixed full-screen, 100vw×100vh, background #080d13) and to the layout. The coach layout becomes a single centered column of at most 860px.
- It is not reset when the modal closes, and not persisted.

---

## 12. Mentor IA tab ("learn"): `LearningThreadView` + pedagogical harness

**Mount:** `ParaphraseReview viewMode="learn"` renders `<LearningThreadView graphId node draftRecord currentTask onStartHarness onCancelHarness onSendUserMessage onRequestEvaluate/>`.

**Derived values:**
- `isTaskRunning`.
- `isMastery = (harnessPassedThreshold || harnessScore>=95) && !running`.
- `history`, `score` and `rubric`, read from `draftRecord`, falling back to `currentTask`.
- `masterclassText` = `task.draft` while running, otherwise `draftRecord.text`.

**Header:**
- Tag "MENTORÍA SOCRÁTICA & MASTERCLASS" and the node label.
- Judge badge: "🏆 Maestría ({score}/100)" or "⚖️ Juez: {score}/100". It toggles the judge drawer.
- Button "✨ Generar Lección" / "Regenerar Lección" (disabled while running).

**Judge drawer:**
- "AUDITORÍA PEDAGÓGICA RIGUROSA" / "Evaluación de Calidad del Mentor", with a close button ("Cerrar panel de auditoría").
- History pills: "Evolución de Refinamiento (Meta: 95+)", then "Iter {i}: {score}/100", colored by the thresholds 95 and 80.
- Rubric grid, each dimension out of 20:

  | Dimension | Rubric key |
  |---|---|
  | "🪝 Anclaje Didáctico" | foundationalContext |
  | "🔭 Alcance y Foco" | selfContainedScope |
  | "⏳ Ritmo y Markdown" | cognitivePacing |
  | "⚖️ Causalidad Física" | causalityAndTradeoffs |
  | "🎯 Código y Socrática" | applicationAndFailureModes |

**Masterclass bubble** (avatar 🧠, "Mentor Senior"):
- Subline:
  - Running and judging: "⚖️ Juez Pedagógico auditando calidad..."
  - Running and generating the first draft: "🪄 Redactando explicación base..."
  - Running otherwise: "🪄 Refinando explicación (Iteración n)..."
  - Idle: "Lección Magistral de Apertura".
- Judge pill: "🏆 100/100 Maestría" or "⚖️ Juez: {score}/100" with ▲/▼.
- "Cancelar" button while running.
- **Stepper:**
  1. "Redacción Magistral"
  2. "Auditoría del Juez" → "Auditoría del Juez (Evaluando...)" → "Juez Pedagógico ({score}/100)"
  3. "Publicación" → "Refinamiento (Iter n)" → "Maestría Aprobada"
- **Inline judge breakdown:** "⚖️ Auditoría del Juez Pedagógico (5 Dimensiones):" with "Puntaje Final: {score}/100", bars for the 5 dimensions, and "Observaciones del Juez:" followed by the critique list.
- **Content:** `ChatMarkdown(masterclassText)`, or while there is no text yet a spinner with `task.message` or "Preparando lección pedagógica de clase mundial...".

**Empty state:**
- "🧠", "Comenzá tu sesión de aprendizaje".
- "El Mentor con IA redactará una **Lección Magistral** completa con analogías, mecánica interna y código estructurado en Markdown, auditada por el Juez Pedagógico."
- Button "🪄 Iniciar Lección con el Mentor (100/100)".

**Thread:**
- User messages (👤 "Vos") and assistant messages (🧠 "Mentor Senior", "Respuesta Socrática"), rendered with ChatMarkdown.
- Auto-scrolls to the end.

**Composer:**
- Quick prompts (shown when idle and a masterclass exists):
  - "¿Por qué falla el enfoque ingenuo?"
  - "¿Podrías explicarlo con una analogía visual?"
  - "¿Cómo diagnostico este error en producción?"
  - "Tengo una duda con el código..."

  Clicking one fills the input and focuses it.
- Locked banner while running: "El Mentor está perfeccionando la explicación con el Juez Pedagógico." / "El campo de respuesta se habilitará automáticamente al alcanzar la calidad óptima."
- Textarea, max 4000 chars:
  - Placeholder: "Escribí tu duda, contale al mentor lo que entendiste o respondé a su pregunta de reflexión..."
  - Placeholder while running: "Esperando que el mentor termine de pulir la explicación..."
  - Enter sends; Shift+Enter inserts a newline.
- Mic button (§17.2) and "Enviar" (aria "Enviar mensaje al mentor").
- Hint "Enter para enviar · Shift+Enter para nueva línea" and link "¿Listo para certificarte? Ir a Evaluación ➔".

**Send behavior — BUG, there is no real chat.** `onSendUserMessage(text, nextMessages)`:
1. Saves `draftRecord.messages` locally.
2. Calls `setDraft(...)`. `setDraft` **drops `messages`**, so the thread is lost on reload.
3. **Restarts the harness** with `bgStartHarness({node, initialDraft: draft, providerProfile, maxIterations:6})`.

No assistant reply is ever appended, and the user's question never reaches the LLM. v3 must implement a real Socratic chat, for example with `coachChatStream`.

**Harness pipeline:** `startPedagogicalHarness` in backgroundTaskManager (§16):
1. If the draft is shorter than 15 chars, `polishParaphraseStream` generates an initial draft (stage `generating_initial`).
2. `judgePedagogy` scores it (stage `judging`).
3. While `!passedThreshold && iter < maxIterations`, it loops `refinePedagogyStream` (stage `refining`) and then re-judges.
4. Every stream delta persists the draft with `setDraft(...isAiGenerated)`.
5. Each judge iteration is saved as a coach iteration with `source:"pedagogical_refiner"`.
6. The final `setDraft` includes `harnessScore`, `harnessRubric`, `harnessCritique`, `harnessHistory` and `harnessPassedThreshold`.
7. On completion, ParaphraseReview runs `startLiveReview(draft)` and calls `onDraftSaved`, which marks the node checked when the score is ≥95.

---

## 13. Parafrasear tab ("coach"): paraphrase workspace

**Heading and intro:**
- "PARAFRASEAR CON TUS PROPIAS PALABRAS" / h3 "Escribí tu respuesta y recibí coaching en tiempo real" with the badge "COACHING PROGRESIVO".
- Intro: "Escribí como si respondieras en una entrevista técnica. El asistente detecta en vivo qué conceptos esenciales ya cubriste y mantiene visible el próximo gap mientras redactás, sin alterar tus palabras."

**Editor tools:**
- Dictation button: "Dictar por voz" / "Grabando voz..." (aria "Dictar respuesta por voz" / "Detener dictado por voz").
- View toggle: "✏️ Editor" | "📖 Chunks de Lectura".
- Tag "Borrador en edición" when `isDraftAiGenerated`, with title "Este borrador proviene de una sesión previa. Podés editarlo o reescribirlo con tus palabras."

**Textarea:**
- Auto-grows to at least 190px while preserving the scroll position of `.lesson-content`.
- Placeholder "Explicá qué es, cómo funciona en el runtime, por qué importa y qué trade-offs tiene...", aria "Tu explicación con tus palabras".
- It is read-only while viewing coach history.
- Keys:
  - **Esc** during the debounce or a running review cancels the live review.
  - **Ctrl/⌘+Enter** switches to the Evaluate tab. It does *not* trigger the review, despite the debounce ring advertising it.

**Chunks view** (`ChunkedDraftView{text, isReadonly, onEdit}`):
- Stats pills "📖 {n} chunks", "📝 {w} palabras", "⚡ ~{avg} pal/chunk", from `useReadingChunks(text).stats`.
- Button "✏️ Volver a editar".
- Renders headings, lists and paragraphs as alternating a/b chunk spans. Clicking a chunk goes back to the editor ("Hacé click para editar este tramo").
- Empty: "No hay texto para mostrar."

**Footer:**
- Shortcut hint: `[Ctrl|⌘] + [Enter] "para ir a Evaluar"`. The keys light up while pressed.
- Button "Ir a Evaluación Formal ➔".

**Draft persistence:**
- Editing sets `isDraftAiGenerated=false` and saves after a 400ms debounce with `setDraft(graphId,nodeId,draft,{isAiGenerated})`.
- The initial text comes from, in order:
  1. the running task's draft;
  2. the stored draft;
  3. the last attempt's answer.

**Live review loop:**
- A user edit sets status "waiting" and starts a **5s debounce** (`LIVE_DEBOUNCE_MS`). A 50ms clock drives the `DebounceRing`.
- When it fires, `startLiveReview(draft)` runs. Drafts under 20 chars go idle and clear the review.
- It calls `liveReviewStream({graphId,nodeId,answer,contentHash,node,provider,signal,onSection,onReset,onProgress})`.
  - **`onSection`:**
    - `"scoreSummary"` → `buildLiveReviewState(value, prevHint, [], [])`, phase "scoring".
    - `"coverage"` → review.coverage, phase "coverage".
    - `"hint"` → review.hint and nextGapId, phase "hint".
    - `"additionalGaps"`.
  - **`onReset(fallback)`** clears the review and sets phase "fallback" with `fallbackFrom` and `fallbackTo`.
  - **`onProgress(len)`** sets phase "receiving" or "processing".
- **On done:**
  - Sets the review and status "ready".
  - Saves a **coach iteration** `{id:"coach_…", createdAt, graphId, nodeId, answer, answerHash, contentHash, review, model, routedVia, provider, fallbackFrom, durationMs, messages:[], isAiGenerated}`.
  - Reloads the iteration list.
  - Saves the live review with `saveLiveReview({graphId,nodeId,answerHash,contentHash,review})`.
  - Storage error message: "La revisión llegó, pero no se pudo guardar su iteración local."
- **Network error:** `userFacingAiError(e, "No se pudo conectar con el servicio de IA. Verificá que el gateway esté iniciado y que el provider esté disponible; después reintentá.")`.
- **Reuse:** on load, a stored iteration or live review is reused when `answerHash === hashAnswer(draft.trim())` and `contentHash === hashCardContent(node)`.
- **Cancel:** shows the feedback "■ revisión detenida Esc" for 1.4s.

**`LiveReviewPanel`** (footer `.live-review`, aria-live) props: `{status, review, error, progress, hint, footerMeta, coverageNode, onIncorporateFocus, isIncorporatingFocus}`.
- **Header:** "COACHING EN VIVO" with a status text:

  | Status | Text |
  |---|---|
  | waiting | "Esperando una pausa para revisar..." |
  | running | "Revisando tu explicación..." |
  | error | "No se pudo actualizar el coaching." |
  | has a review | "El score y el hint se actualizan mientras practicás." |
  | otherwise | "Escribí para activar el coaching automático." |

- Connection pill: "PAUSA", "ACTUALIZANDO", "ERROR" or "AUTOMÁTICO".
- **Score:** "SCORE DE ENTRENAMIENTO" `{displayScore}/120` with a progress bar. Detail: "Profundidad extra", "Superficie cubierta" (≥100) or "Cobertura en progreso".
- **Hint:** `CoachHintTooltip` (below), marked `isStale` while waiting or running.
- **footerMeta** (supplied by ParaphraseReview):
  - "SOLO LECTURA · ITERACIÓN {n}" while viewing history.
  - Otherwise, while a review is pending or running, `DebounceRing` and `LiveCancelButton`.
    - DebounceRing: a ring with the percentage, "evaluar ahora · {s}s", and the shortcut keys. Its title is "Evaluar el coaching ahora (⌘ + ↵)". Clicking it triggers the review now.
    - LiveCancelButton: "■ detener Esc", title "Detener la revisión del coaching".
  - Then the cancel feedback or the shortcut flash.
  - Character count: `"{n} caracteres"`, plus " · un poco corta" when under 80 chars.
- **`CoachCoverage`** (see below).
- `LiveRequestFeedback` (compact) while running.
- "✓ Superficie esencial cubierta" when `allEssentialCovered`.
- Error text, run through `userFacingAiError`.

**`CoachCoverage{node, coverage, onTooltipSpaceChange}`:**
- Checklist from `buildCoachChecklist(node)`: `{steps:[{id:"step_n",text}], tradeoffs:[{id:"tradeoff_n",text}]}`. `mergeCoachCoverage(checklist, coverage)` returns `[{id,text,group,status: covered|partial|missing|pending}]`.
- Trigger (a `<details>` summary): "SUPERFICIE", `"{covered}/{total}"`, a mini meter at `(covered+0.5·partial)/total`, the label "Superficie cubierta" or "Ver superficie", and ⌃.
- Tooltip:
  - "MAPA DE COBERTURA" / `"{covered}/{total} puntos cubiertos"`.
  - Status: `"{k} parciales"`, `"{k} faltan"`, "Esperando revisión" or "Completo".
  - Groups "Paso a paso" and "Trade-offs y errores". Items show ✓, ~, × or · with the aria labels "Cubierto", "Parcial", "Falta" and "Sin revisar".
- Pointer-outside closes it, except clicks in the textarea.
- It reserves footer space so the tooltip never covers the editor (ResizeObserver).

**`CoachHintTooltip{hint, isStale, onTooltipSpaceChange, onIncorporateFocus, isIncorporatingFocus}`:**
- Trigger: "AHORA" (`kind==="gap"`) or "PARA PROFUNDIZAR" (`kind==="refinement"`), with `hint.text` and ⌃.
- Tooltip:
  - Width up to 800px, positioned above and clamped to the viewport (visualViewport-aware).
  - "EXPLICACIÓN DEL FOCO", the `hint.text`, and a pill "✨ Incorporando..." while incorporating.
  - `ChunkedMarkdown(hint.detail)`.
- DORMANT: "✨ Incorporar este foco al borrador con IA" (shows "Incorporando foco con IA..." while running). It is disabled while stale and would call `improveParaphraseStream`.
- Hint shape: `{id, kind:"gap"|"refinement", label?, text, detail}`.

**`CoachIterationHistory{iterations, attempts, viewIndex, onSelect, onSelectAttempt, onReturnCurrent}`:**
- Navigation: ← / "Iteración {i} de {n}" or "Borrador actual" / →, plus "Volver a la versión actual" or the label "VERSIÓN EDITABLE".
- `AttemptProgressChart` with:
  - eyebrow "ITERACIONES", title "Evolución del coaching y evaluaciones";
  - hint "Hacé click en los checkpoints (violeta) para ver ese borrador o en las evaluaciones (cian) para ver el feedback canónico."
  - Clicking an evaluation point selects that attempt and switches to Evaluate.
- Meta: the timestamp (es-AR, short) and "Texto en solo lectura · el chat sigue disponible" or "El gráfico representa checkpoints ya procesados".
- Viewing a past iteration shows its answer read-only and its review in the panel.

---

## 14. Evaluar tab ("evaluate")

**Header:**
- "EVALUACIÓN COMPLETA" / h3 "Resultado de tu evaluación".
- Button "Procesar evaluación completa", which shows "Procesando..." and is disabled when the draft is empty or a task is pending.

**Draft status:**
- "BORRADOR ACTUAL" with `"{n} caracteres listos para evaluar"` or "Todavía no escribiste una respuesta".
- Button "Editar en Coaching →" or "Ir a Coaching →".

**Submit:**
- `submitFullEvaluation` → `bgStartEvaluation({node, answer, contentHash, providerProfile, isDraftAiGenerated, onAttemptSaved})`. The evaluation runs in the background and survives tab switches and card changes.
- The task drives the pending state (`{startedAt, answerKey, source:"full"}`) plus `streamingSections`, `streamingBlocks` and `streamingChars`.

**`ProgressLoader`** (expectedMs 90 000, maxMs 300 000):
- Time bar with an expected-time marker. Its phase label changes as time passes:

  | Elapsed | Label |
  |---|---|
  | under 1× expected | "Esperando respuesta del modelo…" |
  | 1× to 1.5× expected | "Tardando más de lo esperado…" |
  | over 1.5× expected | "Casi en el límite, esperando la respuesta…" |

  Once output arrives, the label becomes "Respuesta recibida… ({n} chars de salida)".
- Time: `"{s}s / {max}s máx · esperado {e}s"`.
- Live line: "El feedback se está completando por secciones" or "Preparando el feedback".
- Button "Cancelar".

**`StreamingEvaluationPreview{sections, blocks}`:**
- Heading "FEEDBACK EN VIVO" with "El modelo ya completó algunas secciones" or "Preparando las secciones...".
- **"SCORE PROVISIONAL"** `{n}/120`:
  - Shown once the completeness score and max blocks are complete.
  - Coverage under 100 → the displayed score is the coverage.
  - Otherwise → 100 + clamp(raw − 80, 0, 20) once all subscores are in.
  - Notes: "Los subscores recibidos ya permiten calcularlo; se confirma al terminar la evaluación." or "Base cubierta; esperando los subscores para calcular la profundidad extra."
- "Rúbrica" with "SUBSCORES EN VIVO": one row each for "Precisión" (40), "Causas y trade-offs" (25), "Aplicación" (20) and "Completitud" (15). Each row shows `displayScoreFromRaw(score/max·100)/120` and a note, or skeletons while waiting.
- Sections "Fortalezas", "Puntos a revisar", "Posibles confusiones", "Siguiente intento" and "Veredicto", each with a skeleton until filled.
- Block ids:
  - `scoreSummary.rubric.{key}.{score|max}`
  - `feedback.rubricNotes.{key}`
  - `feedback.strengths[i]`
  - `feedback.gaps[i].{topic|explanation|revisionHint}`
  - `feedback.misconceptions[i].{quote|correction}`
  - `feedback.nextAttemptPrompt`, `feedback.conciseVerdict`
- Each block is `{id, value, complete}`.

**Error:** "No se pudo completar la evaluación. {message}" with a "Reintentar" button.

**Result (when a canonical attempt exists and nothing is pending):**
- **`AttemptHistory{attempts, coachIterations, viewIndex, onSelect, onSelectCoachIteration, onBackToDraft}`:**
  - Navigation ← "Evaluación {i} de {n}" →, or "Checkpoints de coaching" when there are no attempts.
  - Button "Volver al coaching".
  - Chart with eyebrow "RECORRIDO", title "Progreso y checkpoints", hint "Hacé click en cualquier punto: los cianes son evaluaciones completas y los violetas son checkpoints del coaching."
  - Meta: timestamp, duration, and `ModelMeta`.
- **`EvaluationFeedback{evaluation, attemptContentHash, currentContentHash, coachHint}`:**
  - Score `{displayScore}/{displayMax}` with "Cobertura conceptual: {pct}%".
  - Status pill from `STATUS_LABEL` (strong "Base cubierta", exceptional "Profundización extra", developing "En progreso", review "Conviene revisar").
  - "RESULTADO" with `evaluation.conciseVerdict`.
  - **ScoreMeter:** base and extra segments, the 100 threshold, and labels "0", "100 · base suficiente", "120 · excelencia". Explanation text:
    - Extra: "La base ya está cubierta. Los {n} puntos dorados son profundidad opcional."
    - Mastery: "Base suficiente alcanzada. Podés avanzar o profundizar si este concepto lo merece."
    - Otherwise: "El score mide cuántas piezas esenciales de la card ya cubriste."
  - Completion line: "✓ Superficie conceptual cubierta · 100% ({s}/{m})" or "Cobertura esencial: {p}% ({s}/{m}) · todavía faltan ideas de la card."
  - Stale notice when the content hash changed: "Esta evaluación corresponde a una versión anterior de la card. Reintentá para medir el contenido actual."
  - **PriorityFeedback:**
    - Label "PROFUNDIZACIÓN OPCIONAL" (mastery and the coach hint is not a gap) or "PRÓXIMO FOCO".
    - Title: coach hint text, else `gap[0].topic`, else "La base ya está cubierta" / "Siguiente iteración".
    - Body: hint detail, else `gap.explanation`, else `nextAttemptPrompt`.
    - Plus `revisionHint`.
  - **RubricBars (compact):** "Desglose del score" / "100 = base suficiente · 120 = excelencia".
    - Rows "Precisión", "Por qué y trade-offs", "Aplicación" and "Cobertura".
    - Each row shows `{visible}/120` and "{score}/{max} base", and expands to "Qué significa este resultado" with its note.
  - `<details>` "Ver análisis completo" with "{n} observaciones":
    - "Lo que estuvo bien", or "Sin aspectos destacados." when empty.
    - "Puntos para mejorar": severity pill (alto, medio, bajo), topic, explanation, and "→ revisionHint".
    - "Correcciones": blockquote quote followed by the correction.
    - "Consigna para otro intento".
- `<details>` "Ver respuesta evaluada" showing the answer as a blockquote.
- Actions:
  - "Volver al coaching" copies the attempt's answer into the draft, then switches to Coach.
  - "← Volver a la card anterior" (only when there is history).
  - "Siguiente card →" (only when a next focus node exists).

**Other states:**
- No attempts but coach iterations exist:
  - AttemptHistory (checkpoints only).
  - "Tenés {n} checkpoint(s) de coaching registrados." / "El gráfico arriba muestra la evolución de tus borradores. Procesá la evaluación completa para obtener el score formal de 120 puntos y la rúbrica detallada."
  - Button "Procesar evaluación completa ahora".
- Nothing at all: "Todavía no hay una evaluación completa." / "El coaching rápido vive en la vista de Coaching. A medida que escribas tu explicación, los checkpoints y evaluaciones se irán combinando en este gráfico."

**`AttemptProgressChart`** (props: `attempts, coachIterations, viewIndex, onSelect, onSelectEvaluation, onSelectCoach, scoreAccessor, eyebrow, title, itemLabel, hint, showLegend, className`):
- An SVG of 680×214 that merges evaluations (dots, cyan) and coach iterations (diamonds, violet) chronologically.
- The Y axis runs from min(60, floor(lowest/10)·10) to 120, with guides at 60, 100 (the threshold) and 120, and an "extra zone" band above 100.
- The current point gets a cursor line, a ring and a label.
- Points are focusable buttons (Enter or Space); their aria reads "Ir a {Evaluación #n|Coaching #n} ({type}), score x de 120".
- Scale labels: first point, "100 · base suficiente", last point.
- Legend: "Evaluación completa (score formal 120 pts)" and "Coaching en vivo (score estimado del borrador)".
- Badge: `"{titleLabel} · {score}/120"`.

**`ModelMeta{model, routedVia}`:** "MODELO" with `<code>{routedVia||model}</code>` and "pedido: {model}" when rerouted. Without either value it shows "Modelo no registrado".

**`LiveRequestFeedback{progress{phase,chars,startedAt,now}, compact}`:**
- Spinner, a label and detail by phase, the character count (es-AR) or "sin texto recibido aun", and elapsed time "x.x s".
- Phase copy:
  - connecting: "Conectando con el gateway" / "Abriendo la request"
  - processing: "Esperando la primera salida" / "Conexion activa; puede haber procesamiento o buffering"
  - fallback: "Cambiando de proveedor" / "MiniMax no completo la respuesta; usando FreeLLMAPI como respaldo"
  - receiving: "Recibiendo respuesta" / "El modelo ya esta enviando texto"
  - scoring: "Scores recibidos" / "Generando el foco principal"
  - hint: "Generando el foco" / "El score ya esta disponible"
- The phase copy is missing accents; fix it in v3.

---

## 15. DORMANT coach features (fully coded in ParaphraseReview, never wired)

**`CoachChat{iteration, status, streamingText, progress, error, onSend, onStop, onReconcile, isReconciling, isAlreadyReconciled}`:**
- Header: "CONVERSACIÓN DE ESTA ITERACIÓN" / "Preguntale al coach", with `"{n} mensaje(s)"`.
- Reconcile button:
  - Labels: "✨ Integrar chat a mi respuesta", "Reconciliando con IA...", "✓ Reconciliado con el chat".
  - Disabled when there are no messages, already reconciled, or running.
- No iteration: "Primero procesá esta versión para crear su contexto de coaching."
- Empty: "Preguntá por el concepto, un ejemplo, un trade-off o cualquier parte del hint que todavía no te cierre."
- Messages are labeled "VOS" or "COACH", with "Respuesta interrumpida" on interrupted ones.
- Streaming: "Preparando una explicación..." plus compact LiveRequestFeedback.
- Composer: placeholder "¿Qué parte querés entender mejor?", "Enter envía · Shift+Enter agrega una línea", and "Enviar" / "Detener".
- **`sendCoachQuestion(q)`:**
  - Adds the user message optimistically and persists it with `updateCoachIterationMessages`.
  - Calls `coachChatStream({graphId,nodeId,answer,contentHash,node,review,history,question,provider,signal,onProgress,onDelta})`.
  - Appends the assistant message with model, routedVia, provider and fallbackFrom.
  - Error: "No se pudo obtener la respuesta del coach."
- **`stopCoachResponse`:** aborts and keeps the partial text as `{interrupted:true}`.
- **`handleReconcileChatWithDraft`:**
  - Calls `reconcileParaphraseStream({node,currentDraft,messages,provider,signal,onProgress,onDelta})` and streams the output into the draft.
  - Stores `hashReconcileInput(finalText, messages)` via `updateCoachIterationReconciledHash`, then re-runs the live review.
  - Error: "No se pudo reconciliar el borrador con el chat."
- **`handleIncorporateFocus(hint)`:**
  - Calls `improveParaphraseStream({node,currentDraft,focusTitle:hint.text,focusDetail:hint.detail,…})` and streams the output into the draft.
  - Error: "No se pudo incorporar el foco con IA."
- `LiveHint` toggle "Preguntarle al coach" / "Cerrar conversación".
- `ParaphraseEditor`: a contentEditable editor with a protected inline hint ("AHORA" / "PARA PROFUNDIZAR") injected at the caret.
- `PedagogicalSparkline`: a 170×44 SVG with the judge scores and a 95 threshold line.

---

## 16. Background tasks (`src/ai/backgroundTaskManager.js`) and the global HUD

**Exports:** `taskSyncChannel`, `subscribeToTasks(cb)→unsub`, `getTasksSnapshot()→Map`, `getTask(graphId,nodeId)`, `getAllTasks()`, `getActiveTasks()`, `getActiveTaskNodeIds(graphId?)→Set`, `cancelTask(graphId,nodeId)`, `dismissTask(graphId,nodeId)`, `startPedagogicalHarness({graphId,node,initialDraft="",providerProfile,maxIterations=6,onUpdate})→task`, `startEvaluation({graphId,node,answer,contentHash,providerProfile,isDraftAiGenerated=false,onAttemptSaved,onUpdate})→task`, `useBackgroundTasks(graphId,nodeId)`.

- `cancelTask` also accepts a single `cardKey` argument.
- Starting a task on a card cancels that card's existing task first.

**Task shape:**
```
{ id, graphId, nodeId, cardKey:"graphId:nodeId", node, type:"pedagogical_harness"|"evaluation",
  status:"running"|"completed"|"cancelled"|"error",
  stage:"init"|"generating_initial"|"judging"|"refining"|"evaluating"|"done"|"cancelled"|"error",
  message, progress(chars), draft, initialDraft?, score, rubric, critique[], history[{iteration,score,rubric,verdict,critique,draft}],
  iteration, maxIterations, passedThreshold, streamingSections{}, streamingBlocks{}, attempt, error,
  startedAt, updatedAt, completedAt, abortController }
```

**Task messages:**
- Harness start: "Iniciando Harness Pedagógico..."
- Initial draft: "🪄 Generando borrador inicial con IA..."
- First judge: "⚖️ Evaluando calidad pedagógica inicial con Juez..."
- Judge result: "⚖️ Juez asignó {s}/100 (Meta: 95+)"
- Refining: "🪄 Refinando explicación según crítica del Juez (Iteración i/max)..."
- Re-judging: "⚖️ Re-evaluando calidad pedagógica (Iteración i/max)..."
- Mastery: "✨ ¡Maestría pedagógica alcanzada ({s}/100)!"
- Iteration limit: "Límite de {max} iteraciones alcanzado (Puntaje: {s}/100)"
- Evaluation: "🧠 Evaluando tu explicación con IA...", "Evaluación completada", "Evaluación cancelada"
- Cancel: "Cancelado por el usuario"
- Errors go through `userFacingAiError`, with the fallbacks "No se pudo completar el perfeccionamiento pedagógico." and "No se pudo completar la evaluación."

**Evaluation reset handling:** `startEvaluation` handles `onReset(fallback)`. When `fallback.scope==="feedback"`, it keeps the `scoreSummary` sections and blocks.

**`useBackgroundTasks(graphId,nodeId)`** returns `{currentTask, allTasks, activeTasks, activeTaskNodeIds, startHarness(opts), startEvaluation(opts), cancelTask(targetNodeId?), dismissTask(targetNodeId?)}`. It is built on `useSyncExternalStore`.

**Cross-tab behavior:**
- Tabs exchange SYNC_REQUEST, SYNC_RESPONSE, TASK_MUTATION, TASK_CANCEL and TASK_DISMISS messages.
- Running tasks are persisted to localStorage and rehydrated (without their abortController) if under 10 min old.

**Global HUD** (`aside.global-bg-tasks-hud`, shown when there are active tasks; role status):
- **Collapsed:**
  - ⚡ with the node label (single task) or `"{n} tarjetas con IA activa"`.
  - Message: `task.message`, or "Hacé click o hover para ver detalles".
  - ▲/▼ chevron.
  - Hover or click expands it (title "Hacé click o pasa el cursor para ver todas las cards activas").
- **Popover:**
  - "Tareas en Segundo Plano ({n})" with close ✕ ("Cerrar panel de tareas").
  - Per task:
    - Tag "✨ JUEZ PEDAGÓGICO (Iteración n)" or "🧠 EVALUACIÓN".
    - `"{score}/100"` when a score exists.
    - Node label, then the message (or "Procesando con IA...") with " ({progress} chars)".
    - "Abrir card →" (only for non-current cards; opens with remember) and "Cancelar ✕" (`cancelTask(graphId,nodeId)`).

---

## 17. Mobile specifics and cross-cutting primitives

### 17.1 Mobile (≤760/768px)

**Mobile graph HUD** (graph mode; hidden when a lesson is open):
- Card for `mobileFocusedNode || primaryNext || nodes[0]`.
- Category pill with its dot.
- Badge "✓ DOMINADO", "🔥 MEJOR SIGUIENTE", or `"ETAPA {stage||guideLevel||1}"`. `node.stage` never exists, so the stage fallback is effectively dead.
- Title and CTA "Estudiar lección ›".
- Stepper through `guidance.levels.flat()` (up to 9 nodes): "Concepto anterior" / `"{i}/{n}"` / "Concepto siguiente".

**Bottom nav** (`nav.mobile-bottom-nav`, "Navegación principal móvil"; hidden when a lesson is open):
- "Grafo" and "Flashcards" set the view mode and close the panels.
- "Progreso" toggles the progress panel and shows a dot badge when progress > 0.
- "Buscar" opens the palette.
- "Ajustes" toggles the provider panel.

**Responsive layout:**
- The lesson tabs become a horizontal segmented control.
- The lesson aside stacks below the content.
- The topology view uses a 500px viewport height and a minimum useful scale of 0.84.

### 17.2 Speech recognition (dictation)

- Implemented inline in both ParaphraseReview and LearningThreadView.
- Uses `window.SpeechRecognition || webkitSpeechRecognition` with `lang="es-ES"`, `continuous:true` and `interimResults:false`.
- Final transcripts are appended with a space.
- If unsupported: `alert("El reconocimiento de voz no está disponible en este navegador.")`.
- Legacy bug: the ParaphraseReview version calls the undefined `saveDraft` inside a `setTimeout`, which throws silently. The 400ms effect still saves the draft.

### 17.3 ReadingChunks (focus-reading primitive)

**Props:** `{text, renderChunk(chunk,i), className, chunkClassName, id, singleChunk, chunkElement="p", contentElement="span"}`.

**Splitting (`splitReadingChunks`):**
- Splits text by blank lines, then into sentences with `Intl.Segmenter("es")` (regex fallback).
- Sentences shorter than 36 chars merge into the previous one.
- Structured text (lists or newlines) stays whole.

**Rendering and focus:**
- Chunks alternate `reading-chunk--a/b` and are `tabIndex=0`.
- A global pointer tracker (one listener for all groups) highlights the chunk under the pointer (`is-hit-active`). It also adds `is-reading-dimmed` to every sibling between the text block and the enclosing `.lesson-modal`/`.flashcard-modal`, except elements matching `.lesson-view-tabs, [data-reading-dim-exempt]`.
- Interactive targets (buttons, links, inputs, `[data-no-reading-focus]`) suppress it. Focus clears on window blur.

### 17.4 CodeBlock (Prism) and ChatMarkdown

**`CodeBlock{code, language}`:**
- Header with macOS-style dots, the language label, and a copy button ("Copiar" → "¡Copiado!" for 2s; aria "Copiar código" / "Código copiado al portapapeles").
- Prism languages: js, jsx, ts, tsx, ruby, bash, json, css, markup, with aliases (sh, shell, rb, html, xml).
- Display labels: "JavaScript", "React JSX", "TypeScript", "React TSX", "Ruby", "Terminal", "JSON", "CSS", "HTML".
- Used only inside ChatMarkdown (masterclass, hint tooltip, coach chat). **Lesson code is not highlighted.**

**`ChatMarkdown{text, chunked, className}`:**
- Fenced code blocks render with CodeBlock.
- Supported blocks: headings h1–h6, hr, blockquote, ordered and unordered lists (with continuation lines), and GFM tables.
- Inline: links (safe hrefs only — http(s), mailto, #), code, bold, and italic.
- `ChunkedMarkdown` = chunked inline spans (`coach-hint__chunk--a/b`).
- The ChunkedDraftView inline renderer does **not** sanitize hrefs (XSS risk).

### 17.5 Mermaid

- Lazy `import("mermaid")` once, with `initialize({startOnLoad:false, theme:"dark", securityLevel:"strict", themeVariables:{primaryColor:#171c27, primaryTextColor:#f5f1e8, primaryBorderColor:#5aa9ff, lineColor:#95a0b3, secondaryColor:#202735, tertiaryColor:#12161f}, flowchart:{htmlLabels:true, curve:"basis"}})`.
- `render(uniqueId, chart)` returns an SVG injected as innerHTML.
- A failed render yields an empty result, and the component stays on "Preparando diagrama…" with no error state.

---

## 18. AI client reference (`src/ai/client.js`)

**Common behavior:**
- `AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL` (trailing slash stripped).
- Errors are `AiError{name:"AiError", code, message, details}`.
- `isCancel(err)` is true for AbortError and the codes "aborted" and "aborted_from_abortcontroller".
- `userFacingAiError(err, fallback="No se pudo completar la solicitud.")` maps raw transport errors (HTTP 5xx, fetch failures) to "No se pudo conectar con el servicio de IA. Verificá que el gateway esté iniciado y que el provider esté disponible; después reintentá."
- Streams use SSE events: `progress{length,stage}`, `section{field,value}`, `block{id,value,complete}`, `delta{text,length}`, `reset{from,to,scope?}`, `done`, and `error{code,message,details}`.

| Function (all take `signal`) | Endpoint | Params | Callbacks | Resolves to |
|---|---|---|---|---|
| `fetchAiStatus({signal})` | GET /api/ai/status | – | – | `{available, gateway{configured,acceptsUserProviders}, primary{provider,configured,model,url}, evaluationModel, tutorModel, liveModel, upstream{url,reachable,status,latencyMs,modelCount,error,checkedAt}}` (unused by the UI) |
| `testAiProvider({provider})` | POST /providers/test | profile | – | `{reachable,status,latencyMs,error,label,model,verification:"inference"}` |
| `fetchAiProviderCatalog({refresh})` | GET /providers/catalog[?refresh=1] | – | – | `{providers[], source, warning}` |
| `fetchAiProviderModels({provider})` | POST /providers/models | profile | – | `{reachable,status,latencyMs,models[{id,label,…}],error,label,discovery{upstream{available,error,latencyMs},catalog{source,warning}}}` |
| `evaluateParaphrase` | POST /evaluate | graphId,nodeId,answer,contentHash,node,provider | – | JSON (unused) |
| `evaluateParaphraseStream` | POST /evaluate/stream | same | onProgress(len,stage), onSection(field,val), onBlock(block), onReset(fb) | `{attempt{id,createdAt,graphId,nodeId,model,routedVia,provider,fallbackFrom,scoringProvider,scoringModel,contentHash,evaluatorVersion,evaluation}, repairAttempts}` |
| `liveReviewStream` | POST /live-review/stream | same | onProgress, onSection, onReset | `{review{scoreSummary,coverage[{id,status}],hint,additionalGaps,…,contentHash}, model, routedVia, provider, fallbackFrom}` |
| `coachChatStream` | POST /live-review/chat/stream | +review, history, question | onProgress, onDelta(text,len) | `{message{id,role:"assistant",content,createdAt}, model, routedVia, provider, fallbackFrom}` |
| `generateParaphrase` / `generateParaphraseStream` | POST /paraphrase[/stream] | node,provider | onProgress, onDelta | `{text, model, routedVia, provider, …}` (unused) |
| `improveParaphrase` / `improveParaphraseStream` | POST /paraphrase/improve[/stream] | node,currentDraft,focusTitle,focusDetail,provider | onProgress, onDelta | `{text,…}` (dormant) |
| `reconcileParaphraseStream` | POST /paraphrase/reconcile/stream | node,currentDraft,messages,provider | onProgress, onDelta | `{text,…}` (dormant) |
| `polishParaphraseStream` | POST /paraphrase/polish/stream | node,currentDraft,provider | onProgress, onDelta | `{text,…}` (harness step 0) |
| `judgePedagogy` | POST /paraphrase/judge | node,draft,provider | – | `{score 0..100, rubric{foundationalContext,intuitionAndClarity,selfContainedScope,cognitivePacing,causalityAndTradeoffs,applicationAndFailureModes (each 0..20)}, passedThreshold (score≥95 && no critique), verdict, pedagogicalCritique[]}` |
| `refinePedagogyStream` | POST /paraphrase/refine/stream | node,draft,critique=[],currentScore=0,provider | onDelta, onProgress | `{text,…}` |
| `polishPedagogyHarnessStream` | POST /paraphrase/polish-loop/stream | node,currentDraft,maxIterations=3,provider | onEvent({type,…}) | `{text,…}` (unused: the harness runs client-side instead) |

`provider` is the active profile (`providerProfile`, which may be null for the gateway default). The `/api/ai` prefix is omitted in the table.

**Evaluation object (scoreScaleVersion 3):**
- Scores: `{score (display 0..120), rawScore 0..100, coveragePercent, extraPoints, scoreScaleVersion:3, status}`.
- `rubric{accuracy,causalityAndTradeoffs,application,completeness: {score,max,note}}`; the max values are 40, 25, 20 and 15.
- Feedback: `strengths[]`, `gaps[{topic,explanation,severity:high|medium|low,revisionHint}]`, `misconceptions[{quote,correction}]`, `nextAttemptPrompt`, `conciseVerdict`.

---

## 19. `src/ai/types.js` and friends

**Constants:** `RAW_SCORE_MAX=100`, `DISPLAY_SCORE_MAX=120`, `MASTERY_RAW_SCORE=80`, `EXTRA_RAW_SCORE_START=80`.
- `STATUS_LABEL{strong:"Base cubierta",exceptional:"Profundización extra",developing:"En progreso",review:"Conviene revisar"}`.
- `SEVERITY_LABEL{high:"alto",medium:"medio",low:"bajo"}`.

**Functions:**
- `displayScoreFromRaw(raw)`: raw ≤80 maps to `raw·1.25`; above that, `100 + (raw − 80)`.
- `statusFromRawScore(raw)`: ≥90 exceptional, ≥80 strong, ≥60 developing, otherwise review.
- `statusFromDisplayScore(d)`: ≥101 exceptional, ≥100 strong, ≥60 developing, otherwise review.
- `getScoreView(evaluation)` returns null, or `{rawScore, coveragePercent, displayScore, displayMax:120, status, isMastery (≥100), isExtra (>100), extraPoints, baseProgress, thresholdProgress (83.33)}`. When `scoreScaleVersion < 3`, `displayScore = coveragePercent + min(20, legacyExtra)`.
- `getCompletionView(evaluation)`: `{percent, score, max (default 15), isComplete}`, computed from `rubric.completeness`.
- `isEvaluationSurfaceComplete(evaluation)`: `getScoreView(e)?.isMastery`.
- `formatEvaluationDuration(ms)`: "12.3 s" or "1 min 05 s", or null.

**Other modules:**
- **`liveReview.js`:**
  - `buildLiveReviewState(scoreSummary, hint, additionalGaps, coverage)` returns `{scoreSummary{rubric}|null, rawScore|null, displayScore|null, displayMax:120, isExtra, coverage[], hint (normalized {…,text,detail}), additionalGaps[], coveragePercent, allEssentialCovered (completeness.score ≥ max), nextGapId}`.
  - `normalizeLiveReviewState(review)` maps the legacy `points` field to `coverage` and normalizes the hint.
- **`coverage.js`:** `buildCoachChecklist(node)` and `mergeCoachCoverage(checklist, coverage)`, see §13.
- **`attemptSelection.js`:** `RECENCY_SCORE_TOLERANCE=5`. `selectRepresentativeAttempt(attempts, tol)` returns the newest attempt when `best − newest ≤ tol`, otherwise the best one.
- **`contentHash.js`:**
  - `hashCardContent(node)` → "sha256:{fnv}" over id, title, summary, why, explanation, steps, pitfalls and audit. The "sha256:" prefix is misleading: the hash is FNV-1a 64-bit.
  - `hashAnswer(a)` → "draft:{fnv}".
  - `hashReconcileInput(draft, messages)` → "reconcile:{fnv}".

---

## 20. Storage and settings modules

**`learningStore.js`:**
- Attempts: `saveAttempt(a)` (trims to 12 per node), `listAttempts(g,n)` (sorted ascending), `getLatestAttempt(g,n)`, `listAllAttempts()`.
- Drafts:
  - `getDraft(g,n)` returns the text only.
  - `getDraftRecord(g,n)` returns `{key,text,isAiGenerated,source,generatedAt,updatedAt,harness*}`, or null.
  - `setDraft(g,n,text,{isAiGenerated,source,generatedAt,harnessHistory,harnessScore,harnessRubric,harnessCritique,harnessPassedThreshold})` **deletes the record when the text is empty** and **drops any other option, such as `messages`**.
  - `listAllDrafts()`, `deleteDraft(g,n)`.
- Live reviews: `getLiveReview(g,n)`, `saveLiveReview({graphId,nodeId,answerHash,contentHash,review})`.
- Coach iterations: `saveCoachIteration(it)` (trims to 24 per node), `listCoachIterations(g,n)`, `updateCoachIterationMessages(id,msgs)`, `updateCoachIterationReconciledHash(id,hash)`.
- Whole state: `exportLearningState()→{attempts,drafts,liveReviews,coachIterations}` and `importLearningState(payload)`, which clears everything and then puts the payload.

**`providerSettings.js`:**
- **Re-exports:** `PROVIDER_ADAPTERS`, `PROVIDER_LIBRARY`, `PROVIDER_PRESETS`, `getProviderPreset`, `isProviderId`, `normalizeProviderAdapter`.
- **Constants:** `EMPTY_PROVIDER_PROFILE`, `MINIMAX_PRESET`.
- **Functions:**
  - `createProviderDraft(provider|id)`.
  - `normalizeProviderDraft(v,{idFallback})`.
  - `normalizeProviderProfile(v,{requireModel=true})` returns the profile, or null when baseUrl, apiKey or (if required) model is missing.
  - Loading: `loadProviderSettings()` and `loadProviderDrafts()` return the state. `loadProviderProfile()` returns the active ready profile or null.
  - Saving: `saveProviderDraft(v)` and `saveProviderProfile(v,{activate=true})`. Validation errors: "Completá endpoint, API key y modelo." and "Completá endpoint y API key."
  - `setActiveProviderProfile(id|null)` throws "La conexión debe tener endpoint, API key y modelo antes de usarse."
  - Removing: `removeProviderProfile(id)` and `clearProviderProfile()`.
  - `providerStorageDescription()`, `exportProviderSettings()`, and `importProviderSettings(v)`, which keeps existing apiKeys when the incoming ones are empty.
- **Profile shape:** `{id:"provider_{adapter}_{uuid}", label, adapter, catalogProvider|null, baseUrl, apiKey, model}`.
- **State shape:** `{version:4, activeProfileId|null, profiles[]}`.
- **Preset shape** (from `shared/providerCatalog.js`, 24 presets): `{id, group, label, description, defaultBaseUrl, catalogProvider, discovery, availability:"ready"|"local", transport:"chat-completions", capabilities, knownModels[]}`.

**`backup.js`:**
- Constants: `BACKUP_APP_ID="learning-workspace"`, `BACKUP_KIND="state-backup"`, `BACKUP_VERSION=1`.
- `createBackup()→{app,kind,version,exportedAt,secretsIncluded:true,learning,providers}`.
- `parseBackup(text)`, `applyBackup(value)`, `downloadBackup(backup)`.

---

## 21. Headless modules already in `src/` (for the new UI)

**`src/logic/index.js`:** re-exports `GRAPH_REGISTRY, getGraph, listGraphs` and `createLearningController`, and exports the selectors as `selectors`.

**`graphRegistry.js`:**
- `normalizeGraph` adds `nodeIds:Set`, `nodeById:Map` and default priority and prerequisites.
- `GRAPH_REGISTRY{react,rails}`.
- `getGraph(id="react")` throws "Unknown graph".
- `listGraphs()` returns graphs without `nodeIds` or `nodeById`.

**`railsGraph.js`:** `RAILS_GRAPH` (41 nodes, 7 categories, 54 edges, `milestones:[]`, `seniorityBands:[]`).

**`selectors.js`:**
- `getLatestAttempt(attemptsByNode,nodeId)`.
- `getNodeProgress(abn,id)→{nodeId,latestAttempt,attemptCount,score,scoreView,completion,isComplete}`.
- `getProgressMap(graph,abn)`.
- `getVisibleNodes(graph,groupIds=[])`: an empty list means all nodes; it matches on cat or id.
- `getSuggestedNextNode(graph,progressMap,groupIds)`.
- `getAdjacentNode(graph,id,dir,groupIds)`.
- `getNodeView(graph,abn,dbn,id)`: returns `{...node, progress, draft, narrationSegments}`.
- `getFlashcards(...)` and `getGraphView(...)→{nodes(+isSuggested),edges,progress}`.

**`seniorityProgress.js`:** `getMilestoneProgress(milestones,checked,nodeIds)` and `getSeniorityProgress(bands,checked,nodeIds)`. They are identical to the legacy App versions and add `done`, `total`, `percentage`, `requirementsMet` and `complete`.

**`interviewUnlock.js`:** `evaluateInterviewQuestions(questions,graph,checked)→[{question,missingNodes,isUnlocked}]`.

**`topologicalLayout.js`:** identical to the legacy version (formatting only).

**`learningController.js`:** `createLearningController({graphId="react", storage, ai})` returns a frozen object with:
- `getSnapshot`, `subscribe`, `hydrate`, `destroy`;
- `setGraph`, `selectNode(nodeId,{open=true})`, `closeNode`, `setViewMode("graph"|"flashcards")`;
- `setGroups`, `toggleGroup`, `selectOnlyGroup`, `navigate(±1)`, `navigateToSuggested`;
- `updateDraft(nodeId,text)`, `submitParaphrase(nodeId,answer)`, `cancelEvaluation`, `selectAttempt(nodeId,index)`, `getNode`.

The snapshot is `{graphId, graph, viewMode, selectedGroupIds, selectedNodeId, modalNodeId, attemptsByNode, draftsByNode, hydrated, error, activeEvaluation, visibleNodes, graphView, flashcards, progressMap, suggestedNextNode, selectedNode}`. It is deep-cloned on every emit.

**Hooks:**
- **`useController(initialGraphId)`:** module singleton. Returns `{snapshot, graph, selectedNode, modalNodeId, suggestedNext, progressMap, visibleNodes, activeGraphId, switchGraph, selectNode, openNode, closeModal, filterCategories, saveAttempt, saveDraft, deleteDraft}`.
- **`useKeyboardShortcuts({onCommandPalette,onEscape,onNext,onPrevious})`:** Ctrl/⌘K, Esc, and ←/→ outside inputs.
- **`useUrlRouting({activeGraphId,modalNodeId,onApplyRoute})`**, with `parseAppPath(pathname)→{graphId,nodeId}` and `buildAppPath(g,n)`.
- **`useStudySession(graphId,node)`:** `{stage("read"|"learn"|"paraphrase"|"evaluate"), setStage, draft, updateDraft (600ms debounce), attempts, latestAttempt, loading, recordAttempt}`.
- **`useAudioNarrator()`:** `{speaking, activeSectionId, speed, setSpeed, playSection(id,text), stop}`, with `lang "es-ES"`.
- **`useSpeechRecognition()`:** `{isListening, isSupported, startListening(onTranscript), stopListening, toggleListening(onTranscript)}`.
- **`useReadingChunks(text,{initialActiveIndex})`:** `{chunks, stats{totalChunks,totalWords,totalChars,avgWordsPerChunk}, activeChunkIndex, setActiveChunkIndex, hoverChunk, clearHover, getChunkClass}`. It also exports `splitReadingChunks`, `splitParagraph`, `mergeTinySentences` and `looksLikeStructuredText`.
- **`useBackgroundTasks`:** re-export (§16).
- **`usePanZoom({min=0.3,max=2.5,initial})`:** `{ref, view, wasDragged, panHandlers, resetView, zoomIn, zoomOut}`, with ×1.2 steps.

---

## 22. Mismatches and bugs: headless modules vs the legacy UI

### 22.1 Controller and hooks
1. **`useController` option name:** `openNode` calls `selectNode(id,{openModal:true})`, but the controller reads `{open}`. The call works only because `open` defaults to true. Likewise, `selectNode(id,{openModal:false})` still opens the modal, so select-without-open is impossible. Fix: pass `{open}`.
2. **Missing controller method:** `useController.saveAttempt` calls `controller.saveAttempt?.()`, which does not exist, so the call is a silent no-op.
3. **Singleton ignores its argument:** `useController`'s singleton ignores `initialGraphId` after the first call.
4. **`hydrate` race:** a `setGraph` during `hydrate` can patch the old graph's attempts.
5. **Controller never passes a provider:** `submitParaphrase` omits `provider` (so it always uses the gateway default) and does not record `durationMs` or `isAiGenerated`. It also **deletes the draft** after the evaluation, and it bypasses backgroundTaskManager, so the evaluation is lost when the user navigates. Legacy kept the draft, used the background task, and passed the profile.
6. **Drafts lose metadata:** `hydrate` reads drafts with `getDraft`, which returns text only. `isAiGenerated` and the harness metadata are lost, so flashcard "✨ Con IA" and harness-based completion cannot be derived.
7. **Different completion rule:** selectors use `isComplete = latest attempt isMastery`. Legacy used *any* attempt with mastery or `evaluation.score ≥ 80`, or a draft harness score ≥95. Pick one rule. Recommendation: any attempt with mastery, or harness passed. Drop `score ≥ 80`: with v3 scores that is a display score of 80/120, which is below mastery (a legacy bug).
8. **Suggestions ignore prerequisites:** `getSuggestedNextNode` returns the lowest-priority incomplete node and has no 3-level guidance. The legacy `getGuidance` respected prerequisites and focus.
   - Port `getGuidance` and `getLessonContext` into `src/logic`; they currently exist only in legacy App.
   - `getGraphView` calls `getSuggestedNextNode` once per node, which is O(n²).
9. **Wrong narration context:** `getNodeView` builds narration with `buildLessonNarrationSegments(node,{graphLabel})`. That function expects a **string** context, so TTS would say "[object Object]". Pass `getLessonContext(...)` instead.
10. **Expensive snapshots:** the snapshot is rebuilt and `structuredClone`d (101 nodes with full lessons, plus the flashcards and graphView copies) on every patch, including every streaming progress event.
11. **Dead selector:** `selectAttempt` sets `selectedAttemptIndex`, which no selector reads.
12. **`useUrlRouting` diverges from legacy:**
    - It pushes `pushState(null)` on every change, with no history state, no `previousNodeIds`/`canReturn` "Volver a" stack, and no `replace` for close.
    - Its initial sync pushes a new entry instead of replacing.
    - The `parseAppPath` regex hardcodes react|rails.
13. **Hook defaults and duplication:**
    - `useAudioNarrator` uses `lang "es-ES"` where legacy used "es-419".
    - It has one utterance per call, with no segment chaining, pause/resume, prev/next or speed steps. Legacy TTS behavior (§11.3) must be rebuilt, or the hook extended.
    - `useKeyboardShortcuts`'s ←/→ collides with the flashcard modal's ←/→.
    - The two `usePanZoom` copies differ: the `src/` one captures the pointer immediately on pointerdown, which retargets the click so node clicks are swallowed (the bug the legacy copy fixed). Its max zoom is 2.5 against 2 in legacy.

### 22.2 Graph data
14. **`railsGraph.js` is incomplete** compared with legacy:
    - It has no `categoryContext`, no `nodeIds` (added by the registry), and `milestones:[]`.
    - The subtitle differs.
    - Lessons are `LESSONS[id]` only, missing the INTERVIEW_LESSON_OVERRIDES, LEARNING_EXPLANATIONS, CLARIFIED_BULLETS and CONCEPTUAL_CORRECTIONS merges. As a result there is no `explanation` for most nodes, and no table, mermaid, diagram or related.
    - `react_rails_auth.lesson` is **null**, which crashes any `lesson.summary` read.
    - The fallback priority is 42 instead of 99.
    - Port that content from `legacy/App.jsx` into `src/`.
15. **React Rails-only content:** React nodes never merge LEARNING_EXPLANATIONS or CLARIFIED_BULLETS. This matches legacy, since those modules are Rails-keyed.

### 22.3 Legacy UI bugs (do not replicate)
16. **Mentor chat:** it never calls an LLM (it restarts the harness), and its `messages` are not persisted because `setDraft` drops them (§12).
17. **ParaphraseReview re-runs its load effect on every task update:** the load effect depends on `currentTask`, which changes on every streamed delta. Each update re-reads IndexedDB and resets the coach history view, the chat state and errors.
18. **`onEvaluationSaved` fires twice** per evaluation: once from `onAttemptSaved` and once from the task effect.
19. **Harness iterations appear as coach iterations with no `review`:** they are plotted at score 0 in AttemptProgressChart, and viewing one shows an empty panel. Filter them by `source:"pedagogical_refiner"` or render the judge score.
20. **Chart index mismatch:** AttemptProgressChart's `viewIndex` is sometimes an attempt index (from AttemptHistory) but is used as a merged-timeline index (`points[viewIndex]`), so the wrong point can be highlighted.
21. **Wrong backup and storage copy:** the backup includes API keys, yet the Progress panel, palette and confirm dialog say keys are excluded or not restored. `providerStorageDescription` also says keys are kept "solo mientras esta pestaña…" although they persist in localStorage.
22. **Zen mode:** its tooltip promises Esc exits it, but Esc closes the lesson. The mode is not reset between cards.
23. **Flashcards:** `practiceComplete` is not reset in `closeCard`, so opening any card after a finished session shows the completion screen until "Repetir sesión". The ratings are not persisted and there is no spaced repetition.
24. **Undefined `saveDraft`** in ParaphraseReview dictation.
25. **Mojibake** in the provider toggle aria-label, and missing accents in the LiveRequestFeedback copy.
26. **Unsanitized links:** ChunkedDraftView renders markdown links without sanitizing hrefs.
27. **Ctrl+Enter:** in the coach textarea it navigates to Evaluate, while the DebounceRing advertises ⌘/Ctrl+↵ as "evaluar el coaching ahora".
28. **Quiz copy:** "Incluida en el quiz de esta card." refers to a quiz that does not exist in the UI (`getQuizForNode` is unused).
29. **Wrong flashcard deep link:** "Practicar en Coaching →" opens the Read tab instead of Coach.

---

## 23. Parity checklist

**Routing and shell**
- [ ] Routes `/react`, `/rails`, `/{graph}/card/{nodeId}` with an invalid-to-fallback rule; card history with "Volver a {label}" stack; close via back or replace; popstate sync
- [ ] Graph switcher (React/Rails), resetting focus and progress per graph
- [ ] Header: title, subtitle, interview badge "{n}/110 …", search trigger (Ctrl K), provider toggle with active label, progress block {done}/{total} + bar + "% dominado"
- [ ] Nav drawer: graph switch, Grafo/Flashcards toggle, FOCO category chips with counts plus "Todos", "PRÓXIMO DESAFÍO" strip with "Abrir card →", "Ajustes, IA y Respaldo"
- [ ] Mutually exclusive panels (nav, progress, provider); Esc closes them in priority order; backdrop

**Progress**
- [ ] Progress panel: seniority bands (stage, status, %, bar, nodes, milestone chips, "{n}/{m} capacidades cerradas")
- [ ] Milestone cards with "✓ COMPLETO" and "{n}/{m} grupos completos"
- [ ] Backup export (Electron and web download) and import (Electron and file input) with confirm, reload, error alerts; honest copy about API keys

**AI providers**
- [ ] Provider panel "connections" view: active summary, "Usar gateway", saved list (use, complete, edit, delete), empty state, storage note, delete-all
- [ ] Provider "catalog" view: search, refresh, source summary, warning, desktop-only note, category pills with counts, custom endpoint card, grouped list with availability badges, empty and reset states
- [ ] Provider "editor" view: name, Base URL, API key, model (select, filter, manual slug), "Cargar catálogo", "Probar modelo" with all error messages, "Guardar" / "Guardar y usar", local-endpoint notice

**Graph**
- [ ] "Ruta sugerida" strip: AHORA, DESPUÉS, MÁS ADELANTE with priority numbers
- [ ] Topology graph: staged layout, stage headers, guide-route edges, hover shows direct relations ("Necesita / Habilita"), stage indicator, node card (category, score/120, label, base + extra bar, mastery tick, guide badge, active-task pulse, excellence aura, dimming), keyboard toggle, drag-safe click, background click closes
- [ ] Pan and zoom: wheel zoom at cursor, drag pan, "Próximo foco", fit-all, zoom ±, auto-fit to the primary node on resize
- [ ] (Optional) alternative graph views: Carriles, Radial, Ruta, with tabs

**Flashcards**
- [ ] 6 filters, practice CTA, random spotlight, count, empty state
- [ ] Card grid: category, #priority, title, summary, score/status badge, "IA en progreso", "✨ Con IA", progress, CTAs, "Estudiar card completa →"
- [ ] Modal: front prompt; flip (Space); back with canonical model and TTS, evaluated answer with TTS, ModelMeta, duration, verdict, draft, AI notice; ←/→ navigation; practice ratings 1–4 with streak; completion screen
- [ ] Representative attempt selection (tolerance 5)

**Command palette**
- [ ] Ctrl/⌘K toggle, actions (flashcards, progress, providers, export, import, switch graph), node search (label, category, summary), ↑↓ Enter Esc, hover select, empty state, result count

**Lesson modal: shell and Read tab**
- [ ] Dialog semantics, focus trap, focus return, scroll lock, `--lesson-color`, scroll reset per node and tab
- [ ] Header: title, canonical score widget, category, priority, TTS part badges, state badge (5 variants)
- [ ] Header actions: Ruta toggle, TTS controls (replay, prev, play/pause, next), speed 0.5–2x, Zen toggle, back, close
- [ ] Context panel and right rail: LUGAR EN EL MAPA (antes, ahora, después), SIGUIENTE CARD EN ESTE FOCO, COMPLETITUD (3 texts)
- [ ] Tabs 01–04 with task pulse dots; running-task banner with "Ver en vivo →"
- [ ] Read sections: summary, why, explanation (chunked with deep-dive terms), audit (2 variants), doc notes, route context, live prompt, table, diagram (Mermaid or flow boxes), example (code, narration toggle), steps, pitfalls, takeaway, interview coverage details, sources, related reminders
- [ ] Per-section audio buttons and highlight of the section being read
- [ ] Deep-dive popover: placement, portal, sources, close on Esc or scroll, focus restore (React only)
- [ ] Browser TTS: segment chaining, pause/resume, prev/next/replay, per-section start, speed restart, error states, es-419
- [ ] Zen mode (full screen, centered coach column)
- [ ] (New) render `lesson.codeComparison` (naive vs production); syntax highlighting for lesson code

**Mentor IA tab**
- [ ] Header, judge badge, Generate/Regenerate, judge drawer (history pills, 5-dimension rubric)
- [ ] Masterclass bubble with stage subline, stepper, inline judge breakdown, critique, markdown content, cancel
- [ ] Empty state CTA; thread bubbles; quick prompts; locked banner; composer (Enter to send, dictation, max 4000); "Ir a Evaluación"
- [ ] Harness pipeline (generate if short, judge, refine loop until ≥95 or 6 iterations; persists draft and iterations); completion marks the node checked at ≥95
- [ ] (Fix) a real Socratic chat reply with persisted messages

**Parafrasear tab**
- [ ] Heading and intro; dictation; Editor/Chunks toggle; "Borrador en edición" tag; autogrow textarea; draft autosave (400ms)
- [ ] Chunked draft view with stats and click-to-edit
- [ ] 5s debounce ring ("evaluar ahora · Ns", click to run now), cancel ("detener Esc"), cancelled feedback, char count with "un poco corta"
- [ ] Live review streaming (scoreSummary, coverage, hint, additionalGaps, reset, fallback phases), iteration save, live-review reuse by hashes
- [ ] LiveReviewPanel: status texts, connection pill, training score/120, "✓ Superficie esencial cubierta", errors, LiveRequestFeedback
- [ ] CoachCoverage tooltip (steps and trade-offs, 4 statuses); CoachHintTooltip (AHORA / PARA PROFUNDIZAR, markdown detail)
- [ ] Coach iteration history: navigation, read-only past view, chart, timestamp; Ctrl/⌘+Enter goes to Evaluate; Esc cancels
- [ ] (Decide) Incorporate focus with AI, coach chat per iteration, reconcile chat into draft, stop streaming

**Evaluar tab**
- [ ] Header CTA; draft status with "Editar en Coaching"; background evaluation that survives navigation
- [ ] ProgressLoader (time phases, expected marker, chars, cancel) with StreamingEvaluationPreview (provisional score, live rubric, sections with skeletons)
- [ ] Error with retry; attempt history navigation; progress chart (evaluations and checkpoints, clickable); meta (date, duration, model)
- [ ] EvaluationFeedback: score/120, coverage, status, verdict, ScoreMeter with extra zone, completion line, stale-version notice, priority focus (coach hint first), rubric bars with notes, full analysis (strengths, gaps with severity, misconceptions, next prompt)
- [ ] "Ver respuesta evaluada"; "Volver al coaching" (restores that answer); previous and next card
- [ ] Empty states (checkpoints only, nothing yet)

**Background tasks**
- [ ] Per-card tasks (harness, evaluation), cross-tab sync, localStorage rehydration, cancel
- [ ] Global HUD: collapsed summary, popover list with tag, score, message, chars, "Abrir card →", "Cancelar ✕"
- [ ] Active-task indicators on graph nodes, flashcards and tabs

**Mobile**
- [ ] Mobile graph HUD (focused node card, badge, "Estudiar lección", route stepper)
- [ ] Bottom nav (Grafo, Flashcards, Progreso with dot, Buscar, Ajustes); hidden while a lesson is open; segmented lesson tabs; stacked rail

**Primitives**
- [ ] ReadingChunks (sentence chunking, pointer focus plus sibling dimming)
- [ ] CodeBlock (Prism, 9 languages, copy)
- [ ] ChatMarkdown (code, headings, lists, tables, quotes, safe links)
- [ ] Mermaid lazy render (dark theme, strict security)
- [ ] ModelMeta; LiveRequestFeedback phases; AI errors via `userFacingAiError`

**Data and logic**
- [ ] Port Rails CATEGORY_CONTEXT, lesson overrides, conceptual corrections and milestones from `legacy/App.jsx` into `src/`
- [ ] Port `getGuidance` and `getLessonContext` into `src/logic`
- [ ] Unify the completion rule; fix the useController `{open}` option, the narration context string, and draft-record hydration
