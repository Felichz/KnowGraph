# Design Spec — Workspace UI v3

- **Feature**: `002-workspace-ui-v3`
- **Entrada**: [`spec.md`](./spec.md) · [`legacy-inventory.md`](./legacy-inventory.md) (copy exacto y fuentes de datos, referenciado como `INV §n`)
- **Fundamentos**: [`/DESIGN.md`](../../DESIGN.md) v3.1.3 (tokens citados como `--token`)
- **Criterios**: [`docs/DESIGN_CRITERIA.md`](../../docs/DESIGN_CRITERIA.md)
- **Viewports de referencia**: Desktop 1440×900 · Tablet 1024×768 · Mobile 390×844

Convenciones: *G* = glanceable (<1s), *O* = operativo (1–5s), *D* = on-demand (>5s). `ORG-*` = organismo visual (Sección B). Todo copy entre comillas es literal (español). Cuando el copy coincide con el legacy se remite a `INV §n` en vez de repetirlo.

---

## Sección A — Inventario exhaustivo de información y affordances

### A.1 Shell y navegación global

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-001 | Marca "Learning Workspace" + glifo | estático | — | G | ORG-SIDEBAR |
| INF-002 | Selector de grafo React / Rails | `listGraphs()` → `label` | Cambiar grafo (navega a `/:graph`) | O | ORG-SIDEBAR / ORG-TOPBAR-M |
| INF-003 | Navegación primaria: Mapa, Flashcards, Progreso | estado `view` | Cambiar vista | G | ORG-SIDEBAR / ORG-DOCK |
| INF-005 | Lista de focos: eyebrow "FOCO" (tooltip "Elegí un grupo para aislarlo") + "Todos" + 1 fila por categoría (punto, label, `hechas/total`) | `graph.categories`, progreso | Aislar foco (single-select; "Todos" resetea) | O | ORG-SIDEBAR / ORG-FOCUS-SHEET |
| INF-006 | Buscar "Buscar…" + kbd "⌘K"/"Ctrl K" | — | Abrir paleta | O | ORG-SIDEBAR / ORG-DOCK |
| INF-007 | "Conexiones de IA" + conexión activa (`label` o "Gateway") | `loadProviderProfile()` | Abrir drawer de ajustes | O | ORG-SIDEBAR / ORG-DOCK |
| INF-014 | Subtítulo del grafo (1 línea) | `graph.subtitle` | — | D | ORG-ROUTE |
| INF-008 | Colapsar/expandir sidebar | pref. persistida | Toggle | D | ORG-SIDEBAR |
| INF-009 | Título de contexto: grafo + foco ("React entrevistas · Todos los focos"), seguido inmediatamente por INF-010 | `graph.label`, foco | — | G | ORG-TOPBAR |
| INF-010 | Conmutador de modo del mapa "Lista" / "Grafo" | pref. persistida | Cambiar modo | O | ORG-TOPBAR |
| INF-011 | Progreso global en el item "Progreso" de la sidebar: `34%` mono a la derecha del label (desktop); en tablet, tooltip del icono; en móvil solo en la vista Progreso | progreso | Ir a Progreso | G | ORG-SIDEBAR |
| INF-012 | Dock móvil: Mapa, Flashcards, Progreso, Buscar, Ajustes (sin puntos de estado; el % vive en la vista Progreso) | — | Navegar | G | ORG-DOCK |
| INF-013 | Barra superior móvil: glifo, selector de grafo compacto, botón Foco (con foco activo), conmutador Lista/Grafo (icon button) | — | — | O | ORG-TOPBAR-M |

### A.2 Mapa — Ruta sugerida

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-020 | Eyebrow "RUTA SUGERIDA" + ayuda "Las flechas muestran qué concepto habilita al siguiente." | estático | — | D | ORG-ROUTE |
| INF-021 | Card "Ahora": punto+categoría, label, "Etapa n de m · Prioridad #p", riel/estado, botón "Estudiar ahora" | `getGuidance().primary`, layout rank | Abrir card | G | ORG-ROUTE |
| INF-022 | Lista "Después" (≤4): `#prioridad` + label + estado | `levels[1]` | Abrir card | O | ORG-ROUTE |
| INF-023 | Lista "Más adelante" (≤4) | `levels[2]` | Abrir card | O | ORG-ROUTE |
| INF-024 | Ruta completada: "Ruta completada" + "Todas las cards de este foco están dominadas." | guidance vacío | Ver Progreso | O | ORG-ROUTE |
| INF-025 | Nivel vacío: "No hay nodos disponibles" | — | — | D | ORG-ROUTE |
| INF-026 | Link de referencia (React): "{n}/110 preguntas de referencia trazadas al mapa ↗" | `interviewQuestions`, `interviewQuestionSource` | Abrir fuente externa | D | ORG-ROUTE |

### A.3 Mapa — modo Lista

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-030 | Cabecera de grupo: punto, label de categoría, `hechas/total` | categorías, progreso | — | G | ORG-GRID |
| INF-031 | Contexto de categoría (1 línea) | `graph.categoryContext[cat]` | — | D | ORG-GRID |
| INF-032 | Card de concepto: `#prioridad` | `node.priority` | — | O | ORG-GRID |
| INF-033 | Card: título (2 líneas máx.) | `node.label` | Abrir card | G | ORG-GRID |
| INF-034 | Card: estado de puntaje (★ n / ✓ 100 / n / "Sin evaluar") + riel 4px | `getScoreView` del intento representativo; harness | — | G | ORG-GRID |
| INF-035 | Card: marcador de ruta ("Mejor siguiente" / "Nivel 2" / "Nivel 3") | `guidance.levelById` | — | G | ORG-GRID |
| INF-036 | Card: prerrequisitos pendientes "! n prerreq." | prereqs no dominados | Tooltip con nombres | O | ORG-GRID |
| INF-037 | Card: IA trabajando (icono Sparkles pulsante) | `activeTaskNodeIds` | — | G | ORG-GRID |
| INF-038 | Card: borrador en curso (icono PenLine + "Borrador") | draft no vacío sin intento | — | O | ORG-GRID |

### A.4 Mapa — modo Grafo (INV §8.1)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-040 | Cabeceras de etapa: "ETAPA n" + "Punto de partida" / "{k} conceptos" | `layout.layers` | — | O | ORG-GRAPH |
| INF-041 | Nodo: trazo de categoría, categoría (19 car.), puntaje `n/120` o "Sin evaluar", label 2 líneas, riel base+extra con marca 100 | `getNodeVisual` | Desktop: click/Enter/Espacio abre la card. Táctil: 1er toque selecciona y muestra relaciones + panel inferior con "Estudiar"; 2º toque o botón abre | G | ORG-GRAPH |
| INF-042 | Nodo: marcador de ruta, IA activa, excelencia, atenuado por foco/hover | guidance, tasks | — | G | ORG-GRAPH |
| INF-043 | Aristas de la ruta guía; en hover solo aristas directas entrantes/salientes | `layout.edges`, `collectTopologyFocus` | — | O | ORG-GRAPH |
| INF-044 | Panel de lectura: reposo "Ruta sugerida" + "Mostramos solo el próximo avance. Pasá por un nodo o seleccionalo para ver sus relaciones directas."; hover / foco de teclado / selección táctil: label, "Necesita …", "Habilita …" | hover, foco, selección | — | O | ORG-GRAPH |
| INF-045 | Indicador "Etapa x de y" | rank | — | O | ORG-GRAPH |
| INF-046 | Controles: "Próximo foco", "Ver el mapa completo", "Alejar", "Acercar" | pan/zoom | Ajustar vista | O | ORG-GRAPH |
| INF-047 | Leyenda (overlay inferior izquierdo): ✓ dominada, ★ extra, línea = ruta sugerida, línea discontinua = necesita; debajo, subtítulo del grafo (INF-014) y link de referencia (INF-026) en modo Grafo | estático | — | D | ORG-GRAPH |

### A.5 Sesión de estudio — marco

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-050 | Cerrar ("Cerrar lección", Esc) | — | Cerrar | O | ORG-STUDY-HEADER |
| INF-051 | "Volver a {label anterior}" | pila `previousNodeIds` | Volver | O | ORG-STUDY-HEADER |
| INF-052 | Migas: en la barra, punto de categoría antes del título compacto (tooltip "{categoría} · #{p}"); en 01 Leer, eyebrow completo "{categoría} · #{p}" sobre el titular serif | node | — | G | ORG-STUDY-HEADER / ORG-STUDY-TITLE |
| INF-053 | Controles TTS (solo en etapa 01 Leer): repetir, anterior, reproducir/pausar ("Preparando i/n"), siguiente, velocidad (0.5–2x) | motor TTS | Controlar lectura | O | ORG-STUDY-HEADER / ORG-PLAYER-M |
| INF-054 | Modo Zen ("Modo Zen" / "Salir de modo Zen") | estado | Toggle | O | ORG-STUDY-HEADER |
| INF-055 | Título de la card: compacto en la barra (todas las etapas, 1 línea) y titular serif al inicio de 01 Leer | `node.label` | — | G | ORG-STUDY-HEADER / ORG-READ |
| INF-055b | Puntaje compacto en la barra (todas las etapas): `n/120` + riel 48px, o "Sin evaluar" | intento representativo | Ir a 04 Evaluar | G | ORG-STUDY-HEADER |
| INF-056 | Badge de estado (5 variantes, INV §11.1): bajo el titular en 01 Leer. En 02–04 la única variante accionable, "Prerrequisitos recomendados", se muestra como aviso inline de advertencia al inicio del contenido de la etapa ("Faltan prerrequisitos recomendados: {labels}", 36px); las demás (Dominada, Checkpoint, Mejor siguiente, Disponible) quedan representadas por el puntaje compacto (INF-055b) o dejan de ser relevantes una vez iniciada la práctica | progreso, guidance, prereqs | — | G | ORG-STUDY-TITLE |
| INF-057 | Estado TTS "Parte i/n · lectura del navegador" / "Lectura en pausa · parte i/n" | TTS | — | O | ORG-STUDY-TITLE |
| INF-058 | Pestañas 01 Leer · 02 Mentor IA · 03 Parafrasear · 04 Evaluar (subtítulos INV §11.2 como tooltip; el encabezado legacy "Ruta de estudio / Del concepto al dominio" se elimina: la numeración comunica el orden) | — | Cambiar etapa | G | ORG-STUDY-TABS |
| INF-059 | Indicador IA en pestañas 02/04 | tarea de la card por tipo | — | G | ORG-STUDY-TABS |
| INF-060 | Chip de tarea en curso (en el extremo derecho de la barra de pestañas, no como franja): icono por tipo + `task.message` truncado + "Ver en vivo" | `currentTask` | Ir a la etapa de la tarea | O | ORG-STUDY-TABS |
| INF-061 | Puntaje canónico: `n/120` + riel 4px + "{p}% de cobertura · {excelencia extra \| base}" / "Pendiente" + "Evaluá tu borrador cuando estés listo" | intento representativo | — | G | ORG-RAIL (Leer) |
| INF-062 | Lugar en el mapa: Antes (prerreqs en foco con estado) / Ahora / Después (≤5) | graph, guidance | Abrir card (recuerda historial) | O | ORG-RAIL (Leer) |
| INF-063 | "Siguiente en este foco": "Continuar con {label} →" | `nextFocusNode` | Abrir card | O | ORG-RAIL (Leer) |
| INF-064 | Completitud (3 textos, INV §11.1) | progreso | — | D | ORG-RAIL (Leer) |

### A.6 Etapa 01 — Leer (INV §11.3)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-070 | *En una frase* (serif) + "Por qué importa" | `lesson.summary`, `why` | Escuchar sección | G | ORG-READ |
| INF-071 | Explicación clara (chunks de lectura + términos deep dive) | `lesson.explanation`, `findDeepDiveMatches` | Abrir deep dive; escuchar | O | ORG-READ |
| INF-072 | Riesgos / Caso concreto y fallas (2 variantes) | `lesson.audit` | — | O | ORG-READ |
| INF-073 | Matices de la documentación | `lesson.docNotes` | — | D | ORG-READ |
| INF-074 | Dónde estamos en la ruta (bloqueado si faltan prereqs) | `getLessonContext` | — | O | ORG-READ |
| INF-075 | Posible consigna en vivo | `lesson.prompt` | — | D | ORG-READ |
| INF-076 | Tabla (título + label + filas) | `lesson.table*` | — | O | ORG-READ |
| INF-077 | Diagrama: Mermaid o flujo de cajas | `lesson.mermaid` / `lesson.diagram` | — | O | ORG-READ |
| INF-078 | Ejemplo: código resaltado + label + "Explicar este snippet" + "Copiar" | `lesson.code`, `codeLabel`, `getCodeNarration` | Explicar; copiar | O | ORG-READ |
| INF-079 | **Nuevo**: comparación "Enfoque ingenuo" vs "Patrón de producción" con "Por qué falla" / "Trade-off asumido" | `lesson.codeComparison` | Copiar | O | ORG-READ |
| INF-080 | Paso a paso (ordenada) + Trade-offs y errores | `steps`, `pitfalls` | — | O | ORG-READ |
| INF-081 | Idea para recordar | `takeaway` | — | G | ORG-READ |
| INF-082 | Cobertura de entrevista (React): "{u}/{t} desbloqueadas", filas `#id` + título + "Bloqueada: completá …" / "Disponible para practicar en esta card." + link GreatFrontend | `evaluateInterviewQuestions` | Expandir | D | ORG-READ |
| INF-083 | Fuentes para verificar (links ↗) | `lesson.sources` | Abrir externo | D | ORG-READ |
| INF-084 | Recordatorios relacionados: "Abrir: {label} →" | `lesson.related` | Abrir card (recuerda) | D | ORG-READ |
| INF-085 | Botón de audio por sección + resaltado de sección leída | segmentos TTS | Escuchar desde ahí | O | ORG-READ |
| INF-086 | Deep dive: eyebrow "SEGUNDA CAPA · POR QUÉ", título, respuesta, "Ejemplo", "Matiz importante", fuentes, cerrar | `REACT_DEEP_DIVES` | Cerrar (Esc/scroll) | D | ORG-DEEPDIVE |
| INF-087 | Error de TTS (2 textos, INV §11.3) | TTS | — | O | ORG-READ |

### A.7 Etapa 02 — Mentor IA (INV §12, con chat real)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-090 | Estado vacío: titular "Comenzá tu sesión con el mentor" + texto + "Generar lección" | sin draft/tarea | Iniciar harness | O | ORG-MENTOR |
| INF-091 | Lección magistral (markdown) con caret mientras llega | `task.draft` / `draftRecord.text` | — | O | ORG-MENTOR |
| INF-092 | Stepper de 3 pasos: Redacción · Auditoría del juez (n/100) · Publicación / Refinamiento (iter n) / Maestría aprobada | `task.stage`, `iteration` | — | G | ORG-MENTOR |
| INF-093 | Mensaje de etapa (INV §16 mensajes) + "Cancelar" | `task.message` | Cancelar | O | ORG-MENTOR |
| INF-094 | Puntaje del juez `n/100` (meta 95) + historial "72 → 88 → 96" | `harnessScore`, `harnessHistory` | — | G | ORG-RAIL (Mentor) |
| INF-095 | Rúbrica del juez (5 dimensiones /20) + observaciones | `harnessRubric`, `harnessCritique` | — | D | ORG-RAIL (Mentor) |
| INF-096 | "Regenerar lección" | — | Reiniciar harness | D | ORG-MENTOR |
| INF-097 | Hilo: mensajes "Vos" / "Mentor" (markdown), respuesta en streaming, "Respuesta interrumpida" | `coachChatStream`, persistencia de hilo | — | O | ORG-MENTOR |
| INF-098 | Preguntas rápidas (4, INV §12) | estático | Rellenar composer | O | ORG-MENTOR |
| INF-099 | Composer: textarea (máx. 4000), dictado, "Enviar" / "Detener", ayuda "Enter para enviar · Shift+Enter para nueva línea" | — | Enviar / detener | O | ORG-MENTOR |
| INF-100 | Bloqueo mientras el harness corre: "El mentor está refinando la lección. Vas a poder preguntar cuando termine." | tarea | — | O | ORG-MENTOR |
| INF-101 | "Ir a Evaluar →" | — | Cambiar etapa | D | ORG-MENTOR |

### A.8 Etapa 03 — Parafrasear (INV §13)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-110 | Titular "Explicalo con tus palabras" + intro (INV §13) | estático | — | D | ORG-PARA |
| INF-111 | Dictado ("Dictar" / "Grabando…") | `useSpeechRecognition` | Toggle | O | ORG-PARA |
| INF-112 | Conmutador "Editor" / "Lectura por tramos" | — | Cambiar | O | ORG-PARA |
| INF-113 | Marca "Borrador generado con IA" (+ título explicativo) | `isAiGenerated` | — | O | ORG-PARA |
| INF-114 | Textarea autogrow (≥220px), placeholder INV §13 | draft (400ms autosave) | Escribir; Esc cancela revisión; ⌘/Ctrl+Enter revisa ahora | G | ORG-PARA |
| INF-115 | Vista por tramos: stats "{n} tramos · {w} palabras · ~{a} pal/tramo", click para editar; vacío "No hay texto para mostrar." | `useReadingChunks` | Volver a editar | D | ORG-PARA |
| INF-116 | Pie: `{n} caracteres` (+ "· un poco corta" <80), estado de guardado "Guardado" | draft | — | O | ORG-PARA |
| INF-117 | Anillo de espera "Revisar ahora · {s}s" (5s) y "Detener" | debounce | Revisar ya / cancelar | O | ORG-COACH |
| INF-118 | Estado del coaching (5 textos INV §13) + pill de conexión ("Pausa", "Actualizando", "Error", "Automático") | live review | — | G | ORG-COACH |
| INF-119 | Puntaje de entrenamiento `n/120` + riel + detalle | `review.displayScore` | — | G | ORG-COACH |
| INF-120 | Foco actual: "Ahora" / "Para profundizar" + texto + detalle markdown expandible | `review.hint` | Expandir | O | ORG-COACH |
| INF-121 | Superficie: `{c}/{t}` + lista completa agrupada ("Paso a paso", "Trade-offs y errores") con 4 estados | `mergeCoachCoverage` | — | O | ORG-COACH |
| INF-122 | "✓ Superficie esencial cubierta" | `allEssentialCovered` | — | G | ORG-COACH |
| INF-123 | Progreso de la petición (fases INV §14 LiveRequestFeedback, con acentos) | progress | — | O | ORG-COACH |
| INF-124 | Error de coaching + "Reintentar" | error | Reintentar | O | ORG-COACH |
| INF-125 | Historial de iteraciones: ← "Iteración i de n" / "Borrador actual" → + "Volver a la versión actual"; lectura sola | `listCoachIterations` | Navegar | D | ORG-COACH |
| INF-126 | "Ir a Evaluar →" | — | Cambiar etapa | O | ORG-PARA |
| INF-127 | Confirmación de cancelación "Revisión detenida" (1.4s, junto al anillo) | cancelación | — | O | ORG-COACH |
| INF-128 | Gráfico de iteraciones (checkpoints ◇ + evaluaciones ●) + fecha de la iteración vista + "Texto en solo lectura" | iterations + attempts | Seleccionar punto (evaluación → abre 04 Evaluar en ese intento) | D | ORG-COACH |
| INF-129 | Resumen de superficie: "{k} parciales" / "{k} faltan" / "Esperando revisión" / "Completo" | coverage | — | O | ORG-COACH |

### A.9 Etapa 04 — Evaluar (INV §14)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-130 | Titular "Evaluación completa" + borrador: "{n} caracteres listos para evaluar" / "Todavía no escribiste una respuesta" + "Editar en Parafrasear →" | draft | Ir a Parafrasear | O | ORG-EVAL |
| INF-131 | Primario "Evaluar borrador" ("Evaluando…") | tarea | Iniciar evaluación en background | G | ORG-EVAL |
| INF-132 | Loader: barra de tiempo con marca esperada, fase (3 textos), "{s} s / 300 s máx · esperado 90 s", chars recibidos, "Cancelar" | tarea | Cancelar | G | ORG-EVAL |
| INF-133 | Vista previa en vivo: puntaje provisional, rúbrica en vivo (4 filas), secciones Fortalezas / Puntos a revisar / Posibles confusiones / Siguiente intento / Veredicto con esqueletos | `streamingSections/Blocks` | — | O | ORG-EVAL |
| INF-134 | Error: "No se pudo completar la evaluación. {mensaje}" + "Reintentar" | tarea | Reintentar | O | ORG-EVAL |
| INF-135 | Scorecard: `n/120`, pill de estado, veredicto, riel 8px con "0" · "100 · base suficiente" · "120 · excelencia", explicación (3 textos), línea de completitud | `evaluation` | — | G | ORG-EVAL |
| INF-136 | Aviso de versión anterior de la card | `contentHash` ≠ actual | Reintentar | O | ORG-EVAL |
| INF-137 | Próximo foco: "Profundización opcional" / "Próximo foco" + título + cuerpo + revisión | hint / gaps | — | G | ORG-EVAL |
| INF-138 | Desglose (4 filas: label, `v/120`, "{s}/{m} base", riel, nota expandible) | `rubric` | Expandir nota | O | ORG-EVAL |
| INF-139 | Análisis completo: Lo que estuvo bien / Puntos para mejorar (severidad) / Correcciones / Consigna para otro intento | `feedback` | Expandir | D | ORG-EVAL |
| INF-140 | Respuesta evaluada | `attempt.answer` | Expandir | D | ORG-EVAL |
| INF-141 | Acciones: "Retomar en Parafrasear" (copia la respuesta al borrador), "← Card anterior", "Siguiente card →" | historial | Navegar | O | ORG-EVAL |
| INF-142 | Recorrido: gráfico evaluaciones (●) + checkpoints (◇), guías 60/100/120, banda extra, cursor, leyenda | attempts + iterations | Seleccionar punto | O | ORG-EVAL |
| INF-143 | Lista de intentos: "Evaluación i" · `n/120` · fecha · duración · modelo (`ModelMeta`) | attempts | Seleccionar | O | ORG-RAIL (Evaluar) |
| INF-144 | Estados vacíos (2, INV §14) | — | "Evaluar ahora" | O | ORG-EVAL |

### A.10 Flashcards (INV §9)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-150 | Título "Flashcards" + "{n} cards visibles" | filtro | — | G | ORG-FLASH-GRID |
| INF-151 | Filtros (6): Todas · Con IA · Sin intento · Base < 100 · Base alcanzada · Con extra | reglas INV §9 | Filtrar | O | ORG-FLASH-GRID |
| INF-152 | "Práctica rápida" (primario) · "Al azar" | — | Iniciar práctica / destacar aleatoria | O | ORG-FLASH-GRID |
| INF-153 | Card: categoría, `#pp`, título, resumen 2 líneas (fallback INV §9), estado (IA en progreso / `n/120 · estado` / "Sin intento"), "Con IA", riel, CTA "Practicar recuerdo" / "Revisar mi explicación", "Estudiar card completa →" | nodo + intento representativo | Abrir diálogo / abrir card | G | ORG-FLASH-GRID |
| INF-154 | Diálogo: categoría, "Card i de n", racha (Flame n), puntaje, cerrar | — | Cerrar | O | ORG-FLASH-DIALOG |
| INF-155 | Frente: "PREGUNTA DE REPASO", pregunta (serif), "Revelar respuesta" + kbd Espacio | `lesson.prompt` / fallback | Voltear | G | ORG-FLASH-DIALOG |
| INF-156 | Dorso: "Modelo mental" (En una frase + Por qué importa) + escuchar; "Tu respuesta evaluada" (tramos, modelo, duración, veredicto) + escuchar; o "Borrador en progreso"; aviso IA + "Practicar en Parafrasear →" | intento/draft | Escuchar; abrir card en Parafrasear | O | ORG-FLASH-DIALOG |
| INF-157 | Pie: ← i/n →; práctica: "¿Cómo lo recordaste?" 1 Otra vez · 2 Difícil · 3 Bien · 4 Fácil; "Estudiar card completa ↗" | sesión | Navegar / calificar | O | ORG-FLASH-DIALOG |
| INF-159 | Sin coincidencias: "No hay cards que coincidan con este filtro." + "Ver todas" | filtro | Reset | O | ORG-FLASH-GRID |
| INF-158 | Cierre de práctica: "Sesión completada" + "Repasaste {n} conceptos. Racha máxima: {s}." + "Repetir sesión" / "Volver al mazo" | sesión | — | O | ORG-FLASH-DIALOG |

### A.11 Progreso (INV §5)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-160 | Título "Progreso" + "{d}/{t} cards dominadas · {p}%" | progreso | — | G | ORG-PROGRESS |
| INF-161 | Seniority (React): eyebrow "MAPA DE SENIORITY", titular, texto, "{n}/{m} capacidades cerradas" | bandas | — | O | ORG-PROGRESS |
| INF-162 | Banda: etapa ("NIVEL I"), label, estado (Nivel completo / En progreso / Base pendiente), `%`, riel, "{d}/{t} cards · {k} milestones", "Requiere: {band}", chips de milestones (✓ si completo), descripción | `getSeniorityProgress` | — | G | ORG-PROGRESS |
| INF-163 | Milestones: eyebrow + texto + "{n}/{m} grupos completos"; fila: label, descripción, riel, `{d}/{t}`, `%`, "✓ Completo" | `getMilestoneProgress` | — | O | ORG-PROGRESS |
| INF-164 | Datos: "Exportar respaldo" / "Importar respaldo" + copy honesto (incluye API keys) | backup | Exportar / importar | D | ORG-PROGRESS / ORG-SETTINGS |

### A.12 Ajustes y conexiones de IA (INV §6)

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-170 | Cabecera por vista (3 títulos/subtítulos INV §6) + acciones ("Guardadas (n)", "Agregar", volver, cerrar) | vista | Navegar vistas | O | ORG-SETTINGS |
| INF-171 | En uso: label/modelo o "Provider del gateway" + "Usar gateway" | settings | Usar gateway | G | ORG-SETTINGS |
| INF-172 | Guardadas: filas (label, modelo · provider, estado En uso/Usar/Completar, editar, eliminar) + vacío | profiles | Activar / editar / eliminar | O | ORG-SETTINGS |
| INF-173 | Catálogo: búsqueda, "Actualizar", resumen de fuente, advertencia, nota desktop, pills de grupo con conteo, card "Endpoint compatible", lista agrupada con disponibilidad, vacío + "Restablecer filtros" | `fetchAiProviderCatalog` | Filtrar / elegir | O | ORG-SETTINGS |
| INF-174 | Editor: provider + "Cambiar", aviso local, Nombre, Base URL (+ayuda), API key, Modelo (select filtrable / slug manual), "Cargar catálogo", "Probar modelo", estado (idle/testing/success/error + textos INV §6), "Guardar" / "Guardar y usar" | draft | Probar / guardar | O | ORG-SETTINGS |
| INF-175 | Nota de almacenamiento (texto corregido por runtime) | `providerStorageDescription` | — | D | ORG-SETTINGS |
| INF-176 | "Eliminar todas las conexiones" (confirmación) | — | Eliminar | D | ORG-SETTINGS |
| INF-177 | Datos y respaldo (exportar/importar, copy honesto) | backup | — | D | ORG-SETTINGS |

### A.13 Transversales

| ID | Elemento | Dato / fuente | Acción | Nivel | Organismo |
|:--|:--|:--|:--|:--:|:--|
| INF-180 | Paleta: input (placeholder "Buscar card, acción o atajo…"), grupos "Acciones" (6, INV §10 con copy corregido) y "Cards" (`#p`, label, categoría, resumen), vacío, pie "↑↓ Navegar · ↵ Abrir · Esc Cerrar · {n} resultados" | graph | Ejecutar | O | ORG-PALETTE |
| INF-181 | HUD colapsado: icono IA, label o "{n} cards con IA activa", mensaje, chars | tasks | Expandir | G | ORG-HUD |
| INF-182 | HUD expandido: "Tareas en segundo plano ({n})", por tarea: tipo (Mentor · iter n / Evaluación), `n/100`, label, mensaje, chars, "Abrir card", "Cancelar" | tasks | Abrir / cancelar | O | ORG-HUD |
| INF-183 | Toasts (conexión activada/eliminada, respaldo exportado/importado, copiado, errores) | eventos | Deshacer (si aplica) | O | ORG-TOAST |
| INF-184 | Confirmación de importar respaldo / eliminar conexiones | — | Confirmar / cancelar | O | ORG-CONFIRM |
| INF-185 | Mini-player TTS móvil (reproducir/pausa, anterior, siguiente, velocidad, "Parte i/n") | TTS | Controlar | O | ORG-PLAYER-M |
| INF-186 | Tarjeta del foco móvil (sustituye HUD legacy): card "Ahora" con stepper "‹ i/n ›" por la ruta (≤9) + "Estudiar"; se desplaza con la lista (no es fija) | guidance | Recorrer / abrir | G | ORG-ROUTE (móvil) |

Cobertura: los 63 ítems de la *Parity checklist* (INV §23) quedan mapeados a INF-001…186, salvo los excluidos en `spec.md §2` (vistas de grafo dormidas, incorporar foco, reconciliar chat, SRS persistente).

### A.14 Reemplazos declarados (legacy → v3)

| Legacy | v3 | Motivo |
|:--|:--|:--|
| Botón "Ruta" que abre el panel de contexto en la lección | Riel contextual siempre visible (desktop) / riel compacto "Contexto" (tablet y Zen) / sección "Contexto de la card" al final de Leer (móvil, donde el slot inferior es del mini-player) | Elimina un toggle y un panel duplicado |
| Panel de contexto + `aside` duplicado | Un único bloque (INF-062…064) | Sin duplicación |
| Drawer del juez pedagógico | Riel de la etapa Mentor (INF-094/095) | Sin overlay |
| Tooltips de superficie y de foco (CoachCoverage, CoachHintTooltip) | Riel de coaching (INF-119…121) / hoja en móvil | Nunca tapan el editor |
| Panel lateral de progreso | Vista "Progreso" | Es un destino, no un overlay |
| Franja "Próximo desafío" del drawer de navegación | ORG-ROUTE | Una sola recomendación en pantalla |
| HUD móvil del grafo | Card "Ahora" con stepper (INF-186) | Mismo dato, ruta completa |
| Punto de progreso en el dock | Sin marcador (el % está en Progreso) | Regla "nunca punto de estado" |
| Fallbacks de contexto ("Inicio de este foco", "Punto de partida", "Último eslabón") | Se conservan como textos de INF-062 | — |
| Stepper de "Iniciar práctica rápida" con emoji | "Práctica rápida" con icono `Zap` | Cero emoji |
| Preguntas rápidas del Mentor ("¿Por qué falla el enfoque ingenuo?", "¿Podrías explicarlo con una analogía visual?", "¿Cómo diagnostico este error en producción?", "Tengo una duda con el código...") | "¿Por qué falla lo ingenuo?", "Explicalo con una analogía", "¿Cómo lo diagnostico en producción?", "Tengo una duda con el código" (el texto completo legacy es el que se inserta en el composer al elegir el chip) | Chips más cortos, misma intención |

### A.15 Trazabilidad de la *Parity checklist* (INV §23 → INF)

| # | Ítem de paridad (abreviado) | INF |
|:--:|:--|:--|
| 1 | Rutas `/react`, `/rails`, `/:g/card/:id`, fallback, pila "Volver a", popstate | INF-002, 050, 051 (+ §D routing) |
| 2 | Selector de grafo, reset de foco y progreso por grafo | INF-002, 005 |
| 3 | Header: título, subtítulo, badge de preguntas, buscar, provider, progreso | INF-009, 014, 026, 006, 007, 011 |
| 4 | Drawer de navegación: grafo, Grafo/Flashcards, focos, próximo desafío, ajustes | INF-002, 003, 005, 021, 007 (A.14) |
| 5 | Paneles excluyentes, Esc por prioridad, backdrop | §D overlays (ORG-SETTINGS, ORG-FOCUS-SHEET) |
| 6 | Bandas de seniority | INF-161, 162 |
| 7 | Milestones | INF-163 |
| 8 | Respaldo export/import con confirmación, recarga, errores, copy honesto | INF-164, 177, 184, 183 |
| 9 | Conexiones: en uso, gateway, guardadas, vacío, nota, eliminar todas | INF-171, 172, 175, 176 |
| 10 | Catálogo completo | INF-173 |
| 11 | Editor completo | INF-174 |
| 12 | Ruta sugerida Ahora/Después/Más adelante | INF-020…025 |
| 13 | Grafo topológico completo | INF-040…045, 047 |
| 14 | Pan & zoom, próximo foco, ajustar, auto-encuadre | INF-046 |
| 15 | (Opcional) vistas alternativas | Excluido (`spec.md §2`) |
| 16 | Flashcards: 6 filtros, práctica, al azar, conteo, vacío | INF-150, 151, 152, 159 |
| 17 | Card de flashcard completa | INF-153 |
| 18 | Diálogo: frente, volteo, dorso, TTS, navegación, calificación, cierre | INF-154…158 |
| 19 | Intento representativo (tolerancia 5) | INF-034, 153 (fuente) |
| 20 | Paleta: ⌘K, acciones, búsqueda, teclado, vacío, conteo | INF-180 |
| 21 | Semántica de diálogo, foco, scroll-lock, color de lección, reset de scroll | §D (sesión de estudio) |
| 22 | Header de la card: título, puntaje, categoría, prioridad, TTS, estado | INF-052, 055, 055b, 056, 057 |
| 23 | Acciones del header: ruta, TTS, velocidad, Zen, volver, cerrar | INF-050, 051, 053, 054 (A.14: "Ruta") |
| 24 | Contexto: lugar en el mapa, siguiente, completitud | INF-062, 063, 064 |
| 25 | Pestañas 01–04 con indicador IA; banner de tarea | INF-058, 059, 060 |
| 26 | Secciones de Leer (16) | INF-070…084 |
| 27 | Audio por sección + resaltado | INF-085 |
| 28 | Deep dive | INF-086 |
| 29 | Motor TTS (encadenado, pausa, prev/next, velocidad, errores, es-419) | INF-053, 057, 087, 185 |
| 30 | Modo Zen | INF-054 (B.5) |
| 31 | (Nuevo) comparación de código y resaltado | INF-078, 079 |
| 32 | Mentor: cabecera, badge del juez, generar, auditoría | INF-090, 094, 095, 096 |
| 33 | Lección magistral: etapa, stepper, desglose, markdown, cancelar | INF-091, 092, 093, 095 |
| 34 | Vacío, hilo, preguntas rápidas, bloqueo, composer, ir a evaluar | INF-090, 097…101 |
| 35 | Pipeline del harness; dominio ≥95 | INF-092, 094 (+ regla `spec.md §4.1`) |
| 36 | (Fix) chat socrático real | INF-097, 099 |
| 37 | Parafrasear: intro, dictado, editor/tramos, marca IA, autogrow, autosave | INF-110…114, 116 |
| 38 | Vista por tramos | INF-115 |
| 39 | Anillo 5s, detener, feedback de cancelación, conteo "un poco corta" | INF-117, 127, 116 |
| 40 | Streaming del live review, guardado de iteraciones, reutilización | INF-118…123 (fuentes) |
| 41 | Panel de coaching: estados, pill, puntaje, cubierta, errores, progreso | INF-118, 119, 122, 123, 124 |
| 42 | Superficie (4 estados) y foco | INF-120, 121, 129 |
| 43 | Historial de iteraciones: navegación, lectura sola, gráfico, fecha; atajos | INF-125, 128, 114 |
| 44 | (Decidir) incorporar foco / chat por iteración / reconciliar | Excluido (`spec.md §2`); el chat vive en Mentor |
| 45 | Evaluar: CTA, estado del borrador, evaluación en background | INF-130, 131 |
| 46 | Loader + vista previa en vivo | INF-132, 133 |
| 47 | Error + reintentar; historial de intentos; gráfico; meta | INF-134, 142, 143 |
| 48 | Feedback completo | INF-135…139 |
| 49 | Respuesta evaluada; retomar; anterior/siguiente | INF-140, 141 |
| 50 | Estados vacíos de Evaluar | INF-144 |
| 51 | Tareas por card, sync entre pestañas, rehidratación, cancelar | INF-182 (+ fuente `backgroundTaskManager`) |
| 52 | HUD global | INF-181, 182 |
| 53 | Indicadores de IA en nodos, flashcards y pestañas | INF-037, 042, 153, 059 |
| 54 | HUD móvil del grafo | INF-186 (A.14) |
| 55 | Dock inferior; oculto en lección; pestañas segmentadas; riel apilado | INF-012, B.5, B.6 |
| 56 | ReadingChunks | INF-071, 115, 156 |
| 57 | CodeBlock (Prism, copiar) | INF-078, 079 |
| 58 | Markdown seguro | INF-091, 097, 120 |
| 59 | Mermaid lazy | INF-077 |
| 60 | ModelMeta; fases de petición; errores de IA | INF-143, 123, 124, 134 |
| 61 | Portar contenido Rails a `src/` | Tarea de datos (`spec.md §2`), fuera del diseño visual |
| 62 | Portar `getGuidance` / `getLessonContext` | Tarea de lógica (`spec.md §4`) |
| 63 | Regla de completitud unificada y fixes de hooks | Tarea de lógica (`spec.md §4`) |

---

## Sección B — Agrupación, jerarquía y arquitectura de superficies

### B.1 Principios aplicados
1. **Un plano por región.** Sidebar (`--bg-sidebar`), canvas (`--bg-app`) y overlays. Dentro de cada plano, la subdivisión es tipográfica (eyebrow → título → cuerpo) con hairlines `--line-subtle`. Nunca una caja con borde que contenga otra caja con borde, salvo piezas de datos estructurados (código, tabla, diagrama) que son *inset*, sin borde de color.
2. **Proximidad antes que líneas.** Dentro de un grupo, gaps de 4–12px; entre grupos 20–40px. Una hairline solo separa grupos que ya están a ≥ 20px y que el usuario debe leer como independientes (secciones del riel, cabeceras de lista).
3. **Anti layer-cake.** Controles globales viven en la sidebar (eje vertical). El canvas tiene exactamente una barra (52px). Nada se apila entre la barra y el contenido.
4. **Riel contextual por etapa** (decisión estructural clave de v3): el riel derecho de la sesión de estudio cambia de contenido según la etapa activa, en lugar de usar tooltips/drawers superpuestos. Así el coaching en vivo, el juez y el historial quedan siempre visibles sin tapar el editor.

### B.2 Organismos, contenido y niveles de atención

| Organismo | Contiene | Superficie | G (≤1s) | O (1–5s) | D (>5s) |
|:--|:--|:--|:--|:--|:--|
| ORG-SIDEBAR | INF-001…008, 011 | `--bg-sidebar`, borde derecho `--line` | vista activa, foco activo | grafo, focos con conteo, buscar, conexión activa | colapsar |
| ORG-FOCUS-SHEET | INF-005 (tablet/móvil) | popover anclado `--surface-3` (tablet) / hoja inferior `--surface-1` (móvil) | foco activo | lista de focos con conteo | — |
| ORG-TOPBAR | INF-009, 010 | `--bg-app` → `--bar-glass` con scroll | título de contexto | modo Lista/Grafo | — |
| ORG-TOPBAR-M / ORG-DOCK | INF-012, 013 | `--bg-sidebar` | vista activa | foco, grafo | — |
| ORG-ROUTE | INF-020…026, 186 | canvas directo; "Ahora" en `--surface-1` | card "Ahora" + CTA | Después / Más adelante | ayuda, link de referencia |
| ORG-GRID | INF-030…038 | cards `--surface-1` sobre canvas | título, estado de puntaje, ruta, IA | #prioridad, prereqs, borrador | contexto de categoría |
| ORG-GRAPH | INF-040…047 | canvas; nodos `--surface-1`; controles `--surface-3` | nodos, puntaje, ruta | hover relaciones, etapa, controles | leyenda |
| ORG-STUDY-HEADER | INF-050…055b | `--bg-app`, hairline inferior | cerrar/volver, título compacto, puntaje | TTS (solo Leer), Zen | velocidad |
| ORG-STUDY-TITLE | INF-056, 057 + titular serif de INF-055 (solo en 01 Leer) | canvas, primer bloque de la columna | titular, estado | estado TTS | — |
| ORG-STUDY-TABS | INF-058…060 | canvas, sticky, hairline inferior | etapa activa, IA activa | chip de tarea | subtítulos (tooltip) |
| ORG-RAIL | INF-061…064 (Leer), 094…095 (Mentor), ORG-COACH (Parafrasear), 143 (Evaluar) | `--bg-app`, borde izquierdo `--line` | puntaje | contexto / coaching / historial | completitud, rúbrica juez |
| ORG-READ | INF-070…087 | columna de lectura 68ch sobre canvas | En una frase, idea para recordar | explicación, código, pasos | fuentes, docNotes, entrevista |
| ORG-MENTOR | INF-090…101 | columna; composer sticky al pie | stepper, lección | hilo, composer | regenerar |
| ORG-PARA | INF-110…116, 126 | columna; textarea `--surface-inset` | textarea | toolbar, conteo | intro, tramos |
| ORG-COACH | INF-117…125, 127…129 | riel (desktop) / hoja inferior (móvil) | puntaje de entrenamiento, foco | superficie, estado, anillo | historial |
| ORG-EVAL | INF-130…142, 144 | columna | scorecard / loader | próximo foco, desglose, recorrido | análisis, respuesta |
| ORG-DEEPDIVE | INF-086 | popover `--surface-3` | título | respuesta, ejemplo | fuentes |
| ORG-FLASH-GRID | INF-150…153 | canvas + cards `--surface-1` | título, estado | filtros, CTA | resumen |
| ORG-FLASH-DIALOG | INF-154…158 | diálogo `--surface-1` | pregunta / respuesta | navegación, calificación | metadatos |
| ORG-PROGRESS | INF-160…164 | canvas; bandas `--surface-1` | % global, bandas | milestones | datos |
| ORG-SETTINGS | INF-170…177 | drawer `--surface-1`; filas sin borde (hover overlay), sin cajas anidadas: la card "Endpoint compatible" y la cabecera de provider del editor son filas/encabezados planos | conexión en uso | listas, formulario | notas, datos |
| ORG-PALETTE | INF-180 | `--surface-2` | input | resultados | pie |
| ORG-HUD | INF-181…182 | `--surface-3` | tarea en curso | lista, acciones | — |
| ORG-TOAST / ORG-CONFIRM | INF-183, 184 | `--surface-3` / diálogo | mensaje | acción | — |
| ORG-PLAYER-M | INF-185 | `--bg-sidebar` fijo abajo | play/pausa | anterior/siguiente | velocidad |

### B.3 Jerarquía tipográfica por organismo (qué es lo más grande)

| Organismo | Nivel 1 | Nivel 2 | Nivel 3 |
|:--|:--|:--|:--|
| ORG-ROUTE | label de "Ahora" `--fs-lg` 600 | labels de filas `--fs-sm` 500 | meta `--fs-xs` `--text-3` |
| ORG-GRID | cabecera de grupo `--fs-lg` 600 | título de card `--fs-sm` 500 | #, estado `--fs-xs` mono |
| ORG-STUDY-HEADER | título compacto `--fs-sm` 600 | puntaje `--fs-sm` mono | migas `--fs-xs` |
| ORG-STUDY-TITLE (Leer) | titular `--fs-4xl` serif | badge estado | TTS `--fs-xs` |
| ORG-READ | *En una frase* `--fs-2xl` serif | títulos de sección `--fs-lg` 600 | cuerpo `--fs-md` |
| ORG-EVAL | puntaje `--fs-3xl` mono | veredicto `--fs-md` 500 | desglose `--fs-sm` |
| ORG-PROGRESS | % global `--fs-3xl` mono (junto al título `--fs-xl` 600) | `%` de banda `--fs-lg` mono + label `--fs-sm` 600 | metadatos `--fs-xs` |

### B.4 Anatomía de barras y regiones (slots izquierda → derecha)

Regla anti-cañón: ninguna acción queda a más de 350px de su contexto. Por eso las barras **no usan `space-between` a ancho completo**: los controles siguen inmediatamente al título que los contextualiza, y en la sesión de estudio la barra usa la misma grilla horizontal que la columna de lectura (720px), de modo que el grupo derecho queda como máximo a 720 − ancho ocupado de su título.

| Barra | Alto | Izquierda | Centro | Derecha |
|:--|:--:|:--|:--|:--|
| ORG-TOPBAR (Mapa) | 52 | título de contexto: `graph.label` (`--fs-sm` 600) + " · " + foco (`--text-2`) + gap 16 + conmutador Lista/Grafo (segmented, 144px) | — | — (vacío) |
| ORG-TOPBAR (Flashcards/Progreso) | 52 | título de la vista (`--fs-sm` 600) + grafo (`--text-2`) | — | — (vacío) |
| ORG-STUDY-HEADER | 52 | **slot fijo** x = 16…76: cerrar (X, 28) + gap 4 + volver (icon button `ArrowLeft` 28, solo con historial; `aria-label` y tooltip "Volver a {label}") | título: empieza en `titleStart = max(colStart, 92)`; punto + título compacto 1 línea (ellipsis) + gap 12 + puntaje compacto (`n/120` + riel 48, 120px); a la derecha, terminando en `colEnd`: [solo Leer] grupo TTS (4×28 + velocidad 56 + contenedor y gaps) + Zen (28) = 232px reservados | — (sobre el riel: vacío) |
| ORG-STUDY-TABS | 44 | 4 pestañas alineadas con el borde izquierdo de la columna de lectura | — | chip de tarea (INF-060), máx. 320px |
| ORG-TOPBAR-M | 56 | glifo · selector de grafo compacto | — | Foco (icon + nombre corto) · Lista/Grafo (icon button) |
| ORG-DOCK | 64 + safe-area | 5 destinos equidistantes (≥ 72px de ancho c/u) | | |

Fórmulas: `W` = ancho de la región de columna (viewport − 320 en desktop; viewport completo en tablet/Zen); `colW = min(720, W − 48)`; `colStart = (W − colW) / 2`; `colEnd = colStart + colW`; `titleStart = max(colStart, 92)`; `titleMax = colEnd − titleStart − 120 − 12 − tools − 16`, con `tools` = 232 en Leer y 28 (solo Zen) en las demás etapas.

| Viewport | W | colStart | colEnd | titleStart | titleMax (Leer) | Hueco máx. puntaje→herramientas (título real más corto ≈ 170px) |
|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| 1440 (desktop) | 1120 | 200 | 920 | 200 | 340 | 340 − 170 + 16 = 186 ✓ |
| 1280 (desktop) | 960 | 120 | 840 | 120 | 340 | 186 ✓ |
| 1100 (desktop) | 780 | 30 | 750 | 92 | 278 | 124 ✓ |
| 1024 (tablet) | 1024 | 152 | 872 | 152 | 340 | 186 ✓ |
| 768 (tablet) | 768 | 24 | 744 | 92 | 272 | 118 ✓ |

El slot de cerrar/volver (termina en x = 76) nunca se superpone al título (≥ 92). Barra del mapa: todo su contenido está en los primeros ~560px; no hay acciones a la derecha.

### B.5 Regiones de la sesión de estudio por breakpoint

| Breakpoint | Columna | Riel contextual | Borde inferior (de abajo hacia arriba) |
|:--|:--|:--|:--|
| Desktop ≥ 1100 | región = viewport − 320 (riel); columna centrada, `max-width` 720 (texto a 68ch); piezas anchas (comparación, tabla, gráfico) hasta 880 | 320px, scroll propio | HUD (abajo a la derecha del viewport, 16px), toasts encima del HUD (+12) |
| Tablet 768–1099 y Zen (cualquier ancho ≥ 768) | columna centrada `max-width` 720 | **Riel compacto**: una *barra de resumen de etapa* fija al borde inferior de la columna (56px) que abre el contenido completo del riel en un panel de 360px a la derecha: **acoplado** (empuja la columna a `min(720, W − 360 − 48)`, sin scrim ni focus trap) si `W ≥ 968` (columna ≥ 560, donde entran las 4 pestañas); **hoja lateral modal** (scrim, focus trap, scroll-lock; D.3) si `W < 968`. La barra superior no se recalcula al abrir el panel (usa la grilla de `W`) | barra de resumen → HUD encima (+8) → toasts encima (+12) |
| Móvil < 768 | ancho completo, padding 16 | Igual que tablet, pero el detalle abre en hoja inferior modal (máx. 85% de alto) | safe-area → slot inferior único 56px (ver B.6) → HUD colapsado 48px (+8) → toasts (+12). El dock está **oculto** durante el estudio. |

Reubicación del riel por etapa y breakpoint (tabla canónica):

| Etapa | Desktop ≥ 1100 | Tablet / Zen | Móvil |
|:--|:--|:--|:--|
| 01 Leer | Riel: puntaje, lugar en el mapa, siguiente, completitud | Barra de resumen "Contexto" (Antes → Después en 1 línea) → panel acoplado con el riel | Sección "Contexto de la card" al final del contenido de Leer (el slot inferior es del mini-player) |
| 02 Mentor | Riel: juez (puntaje, historial, rúbrica, observaciones) | **Sin barra de resumen** (el pie de la columna es del composer): badge "Juez n/100" en la cabecera de la lección magistral → abre el panel/hoja de auditoría | Badge "Juez n/100" en la cabecera de la lección magistral (dentro del contenido), que abre la hoja inferior de auditoría (el slot es del composer) |
| 03 Parafrasear | Riel: coaching completo | Barra de resumen: puntaje + foco en 1 línea + "Ver coaching" → panel acoplado | Slot inferior = esa misma barra → hoja inferior |
| 04 Evaluar | Riel: lista de intentos | Lista de intentos en el contenido, debajo del recorrido | Igual que tablet |

**Barra de estudio móvil (56px)**: izquierda cerrar (X, 44) + [con historial] volver (←, 44, `aria-label` "Volver a {label}"); centro título compacto 1 línea `--fs-sm` 600 (ellipsis); derecha puntaje compacto (`n/120` en mono `--fs-sm`/`--fs-xs` + riel 32; sin evaluación: "Sin evaluar" `--fs-xs` `--text-3`), ≈ 96px; el título conserva ≥ 146px. Sin TTS (va al mini-player) ni Zen (no aplica en móvil).

**Reserva para el HUD**: mientras el HUD está visible, todo contenedor con scroll que llegue al borde inferior (canvas del mapa, columna, riel, lista de flashcards) suma `padding-bottom` = alto del HUD + 32 (desktop: 40 + 32 = 72px; móvil: 48 + 32 = 80px) para que el último elemento nunca quede tapado.

### B.6 Slot inferior único en móvil (sesión de estudio)

Solo un elemento ocupa el slot inferior a la vez (56px + safe-area), por etapa:

| Etapa | Slot inferior |
|:--|:--|
| 01 Leer | Mini-player TTS (INF-185) |
| 02 Mentor IA | Composer (crece 56 → 160px; por encima, scroll interno) |
| 03 Parafrasear | Barra de coaching (puntaje + foco, abre hoja) |
| 04 Evaluar | Barra de acción con "Evaluar borrador" (solo si no hay evaluación en curso ni resultado visible; si no, vacío) |

Pestañas en móvil: 44px, sticky bajo la barra (56), segmentos del ancho de su contenido sin números ("Leer", "Mentor", "Parafrasear", "Evaluar": ≈ 54 + 74 + 102 + 76 = 306px ≤ 358px útiles), texto `--fs-sm` 500.

---

## Sección C — Evaluación comparativa de layouts (Landscape 1440×900 vs Portrait 390×844)

Criterios (1–5, 5 = mejor): **VH** costo de altura de viewport · **Esc** escalabilidad con N ítems · **Desc** descubribilidad (anti affordance oculta) · **Erg** ergonomía puntero/táctil · **CL** carga cognitiva.

### C.1 Shell de la aplicación

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| P1 · Header + barra de filtros + banner (legacy) | 3 franjas = 137px | igual, filtros con scroll horizontal | 2 | 2 | 2 | 3 | 3 | 12 |
| P2 · Sidebar persistente + 1 barra de 52px | sidebar 248 + barra 52 | barra 56 + dock 64 + hoja de foco | 5 | 5 | 5 | 4 | 4 | **23** |
| P3 · Rail de iconos 56 + popovers | 56 + barra 52 | igual a P2 | 5 | 4 | 2 | 3 | 3 | 17 |

**Ganador: P2.** *Por qué*: con 11 categorías (React), una lista vertical muestra el 100% de los focos sin scroll horizontal (cumple Anti-Hidden-Affordance), deja 848/900px (94%) de alto al contenido y separa navegación (eje vertical) de contenido (canvas). En tablet (768–1099) la sidebar colapsa a P3 (56px) porque el ancho es el recurso escaso, conservando tooltips y la hoja de foco. En móvil, la navegación baja al dock (zona del pulgar) y los focos pasan a una hoja inferior invocada desde la barra.

### C.2 Mapa — presentación de conceptos

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| M1 · Solo grafo topológico (legacy) | canvas pan/zoom | 500px de alto, zoom 0.84 | 4 | 3 | 3 | 2 | 2 | 14 |
| M2 · Lista agrupada por categoría (grid de cards) + grafo opcional | 4 columnas × cards 140px | filas de 64px, 1 columna | 4 | 5 | 5 | 5 | 4 | **23** |
| M3 · Tabla densa (fila por concepto) | tabla 36px/fila | ilegible sin scroll horizontal | 5 | 5 | 4 | 3 | 3 | 20 |

**Ganador: M2 con M1 como modo alternativo ("Grafo").** *Por qué*: la lista responde "qué me falta" de un vistazo y escala a 101 nodos con cabeceras sticky; el grafo responde "qué habilita qué" y se conserva para exploración.

**Geometría de la lista (verificada)**
- Canvas a 1440: 1440 − 248 (sidebar) = 1192; padding 24×2 → 1144 útiles. Grilla `repeat(auto-fill, minmax(240px, 1fr))`, gap 12 → **4 columnas de 277px** (1144 ≥ 4×240 + 3×12 = 996; 5 columnas requerirían 1248). En `wide`, el canvas centra a 1320 → 1272 útiles → **5 columnas de 244px** (5×240 + 4×12 = 1248 ≤ 1272). En tablet (768–1099, sidebar 56): 2–3 columnas.
- Card: padding 16 + fila meta 20 + gap 8 + título 2 líneas 40 + gap 12 + riel 4 + gap 8 + fila pie 16 + padding 16 = **140px fijos** (todas iguales; título de 1 línea deja el hueco reservado para no romper la alineación).
- Primer viewport (848 útiles): padding 24 + ruta 176 + gap 32 + cabecera de grupo 44 = 276 → quedan 572 → **3 filas completas** (3×140 + 2×12 = 444) + el inicio de la 4ª. Cumple "≥ 2 filas".
- Orden: grupos en el orden de `graph.categories`; dentro, por `priority`. Con foco activo solo se muestra ese grupo.

**Modo Grafo (layout vertical)**: al elegir "Grafo" la ruta sugerida (ORG-ROUTE) **no se muestra** (el grafo dibuja la ruta guía); el canvas del grafo ocupa todo el alto bajo la barra (848px = 94%). Panel de lectura (arriba a la izquierda, máx. 360px), controles e indicador de etapa (arriba a la derecha) y leyenda (abajo a la izquierda) son **overlays flotantes** `--surface-3` a 16px del borde, no barras; no consumen alto.

**Móvil**: la lista usa filas de 64px (punto, título 2 líneas, estado a la derecha). El modo Grafo existe (icon button en ORG-TOPBAR-M): canvas a alto completo entre barra y dock (724 − safe-area), zoom inicial 0.84, panel inferior con el nodo seleccionado (INF-041 táctil).

### C.3 Ruta sugerida

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| R1 · Banner "Próximo desafío" de una línea (legacy v2) | 52px | 52px | 5 | 2 | 3 | 3 | 4 | 17 |
| R2 · Tres columnas Ahora / Después / Más adelante sobre el canvas | 176px, card + 2 listas | card "Ahora" con stepper por la ruta | 3 | 4 | 5 | 5 | 4 | **21** |
| R3 · Ruta solo dentro del grafo | 0px | 0px | 5 | 3 | 1 | 2 | 3 | 14 |

**Ganador: R2.** *Por qué*: es la respuesta al principio de producto "aprender en orden sin perder autonomía": muestra la recomendación y 8 alternativas sin abrir nada. 176px es el 20% del alto; se acepta porque reemplaza al banner y a la franja de filtros legacy (137px) y sigue permitiendo 3 filas completas de cards (C.2). En móvil se reduce a una sola card con stepper "‹ i/n ›" (≤ 9 pasos) para no empujar la lista.

### C.4 Sesión de estudio — contenedor

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| S1 · Modal flotante 940px con márgenes (legacy) | pierde 90px arriba/abajo | pantalla completa | 3 | 3 | 3 | 3 | 3 | 15 |
| S2 · Capa a pantalla completa: barra 52 + columna de lectura + riel contextual 320 | región de columna 1120 + riel 320 | barra 56 + tabs 44 + contenido; riel → sección/hoja (B.5) | 5 | 5 | 5 | 4 | 4 | **23** |
| S3 · Panel dividido mapa ⟷ card (master-detail) | mapa 40% + card 60% | inviable | 4 | 3 | 4 | 3 | 2 | 16 |

**Ganador: S2.** *Por qué*: la lectura larga necesita foco y medida de 68ch; el riel contextual mantiene visible el dato que importa en cada etapa (puntaje/ruta en Leer, juez en Mentor, coaching en Parafrasear, historial en Evaluar) sin superponer tooltips al editor. Geometría a 1440: región de columna = 1440 − 320 = **1120px**; la columna (720) se **centra** en esa región (márgenes simétricos de 200px, que son respiro de lectura, no cañones: no hay acciones separadas del contenido). Zen: oculta el riel, conserva la barra de 52 (con cerrar, TTS en Leer y "Salir de modo Zen") y pasa al riel compacto (B.5).

### C.5 Sesión de estudio — navegación entre etapas

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| T1 · Columna vertical de 4 etapas a la izquierda (legacy) | 200px de ancho | segmented horizontal | 4 | 3 | 5 | 4 | 3 | 19 |
| T2 · Pestañas horizontales numeradas, sticky bajo la barra | 44px | 44px, segmentos del ancho de su contenido | 5 | 3 | 5 | 5 | 5 | **23** |
| T3 · Stepper con "Siguiente etapa" al pie | 0px arriba | botón al pie | 5 | 2 | 2 | 3 | 4 | 16 |

**Ganador: T2.** *Por qué*: 4 etapas fijas (dentro del límite 2–7), orden explícito con numeración "01…04", ancho completo para la columna de lectura. En móvil: segmentos del ancho de su contenido, sin números (B.6), 44px de alto.

### C.6 Coaching en vivo (Parafrasear)

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| K1 · Pie bajo el editor con tooltips para superficie y foco (legacy) | tooltips de 800px tapan el editor | igual | 2 | 3 | 2 | 2 | 2 | 11 |
| K2 · Riel derecho persistente (puntaje, foco, superficie completa, historial) | 320px siempre visible | barra resumen fija (56px) sobre el borde inferior + hoja expandible | 5 | 4 | 5 | 4 | 4 | **22** |
| K3 · Panel inferior plegable | 240px bajo el editor | igual | 3 | 3 | 4 | 4 | 3 | 17 |

**Ganador: K2.** *Por qué*: el usuario escribe mirando el próximo gap; ponerlo al costado, siempre visible, elimina los tooltips flotantes (Nielsen: reconocimiento antes que recuerdo) y no desplaza el editor. Donde no hay riel (tablet 1024×768, Zen, móvil) se aplica el riel compacto de B.5: la barra de resumen (56px) mantiene visibles puntaje + foco actual junto al editor, y el detalle abre en un panel acoplado de 360 que reduce la columna (tablet/Zen; a 1024 la columna queda en 616px) o en hoja inferior (móvil), sin tapar el cursor. Tablet 1024×768: 52 + 44 barras + 56 barra de resumen = 152px de chrome → 616px (80%) para editor.

### C.7 Evaluación — resultado

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| E1 · Historial + gráfico arriba, luego scorecard (legacy) | scorecard queda bajo el pliegue | idem | 2 | 3 | 3 | 3 | 3 | 14 |
| E2 · Scorecard + próximo foco + desglose en el primer viewport; recorrido debajo; lista de intentos en el riel | acción 48 + scorecard 204 + foco 146 + desglose 202 (+ gaps) → 792 ≤ 900 | scorecard compacto, desglose apilado | 5 | 4 | 5 | 4 | 5 | **23** |
| E3 · Tabs internas Resultado / Rúbrica / Historial | 44px extra | igual | 4 | 4 | 2 | 3 | 3 | 16 |

**Ganador: E2.** *Por qué*: cumple el criterio de viewport fit. El titular serif solo existe en 01 Leer; en Evaluar el título vive en la barra. Presupuesto a 1440×900 (con evaluación visible):

| Bloque | px |
|:--|:--:|
| Barra de estudio + pestañas | 52 + 44 = 96 |
| Padding superior de la columna | 24 |
| Fila de acción: titular `--fs-lg` (26) sobre estado del borrador (20) + "Evaluar borrador" (`--ctl-lg`, centrado verticalmente) | 48 |
| Gap | 24 |
| Scorecard: puntaje+pill 40 · veredicto 2 líneas 52 · riel 8 + etiquetas 16 · explicación 20 · completitud 20 · 4 gaps de 12 | 204 |
| Gap | 24 |
| Próximo foco: eyebrow 16 + título 26 + cuerpo 2 líneas 52 + línea de revisión 28 (texto clamp 1 línea + "Ver más" `--ctl-sm`) + 3 gaps 8 | 146 |
| Gap | 24 |
| Desglose: cabecera 26 + 4 filas × 44 | 202 |
| **Total** | **792** (96 + 24 + 48 + 24 + 204 + 24 + 146 + 24 + 202). Peor caso con ambos avisos: + prerrequisitos al inicio (36 + 12) + versión anterior bajo el scorecard (36 + 12) = **888 ≤ 900** |

El recorrido (gráfico) y el análisis completo quedan debajo del pliegue: son *on-demand*.

### C.8 Flashcards

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| F1 · Grid + diálogo con volteo (legacy) | grid 3–4 col + diálogo 720 | 1 col + diálogo pantalla completa | 4 | 5 | 5 | 4 | 4 | **22** |
| F2 · Mazo único a pantalla completa | 1 card | 1 card | 5 | 2 | 2 | 5 | 4 | 18 |

**Ganador: F1** (con filtros como chips que envuelven, nunca scroll horizontal en desktop).

### C.9 Progreso

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| G1 · Panel lateral deslizable (legacy) | 420px sobre el mapa | pantalla completa | 3 | 3 | 3 | 3 | 3 | 15 |
| G2 · Vista propia en el canvas: bandas 2×2 (4 en fila ≥1440) + lista de milestones | canvas completo | 1 columna | 5 | 4 | 5 | 4 | 5 | **23** |

**Ganador: G2** — el progreso es una vista de destino (dock y sidebar), no un overlay.

### C.10 Ajustes de IA

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| A1 · Drawer derecho 480px con 3 vistas (legacy) | conserva el contexto | pantalla completa | 4 | 4 | 4 | 4 | 4 | **20** |
| A2 · Vista de página "Ajustes" | canvas completo | igual | 5 | 4 | 4 | 4 | 3 | 20 |

**Ganador: A1** por desempate en contexto: se abre desde la sesión de estudio (error de IA → "Revisar conexión") sin perder la card.

### C.11 Presupuesto vertical verificado (1440×900)

| Vista | Barras fijas | Contenido útil | % |
|:--|:--:|:--:|:--:|
| Mapa (Lista) | 52 | 848 | 94% |
| Mapa (Grafo) | 52 | 848 | 94% |
| Sesión de estudio | 52 + 44 (tabs sticky) = 96 | 804 | 89% |
| Flashcards / Progreso | 52 | 848 | 94% |
| Móvil, mapa (844, safe-area 34) | 56 + 64 + 34 = 154 | 690 | 82% |
| Móvil, sesión (dock oculto) | 56 + 44 + 56 (slot) + 34 = 190 | 654 | 77% |
| Móvil, sesión con tarea de IA (HUD 48 + 8) | 246 | 598 | 71% |
| Tablet 1024×768, Parafrasear | 52 + 44 + 56 = 152 | 616 | 80% |

### C.12 Mentor IA

| Paradigma | Desktop | Móvil | VH | Esc | Desc | Erg | CL | Total |
|:--|:--|:--|:--:|:--:|:--:|:--:|:--:|:--:|
| MI1 · Chat puro (la lección es el primer mensaje del asistente) | hilo + composer | igual | 4 | 3 | 3 | 4 | 3 | 17 |
| MI2 · Lección en la columna + chat en el riel | riel de 320 para conversar | inviable | 3 | 2 | 4 | 2 | 3 | 14 |
| MI3 · Documento + hilo debajo + composer sticky al pie de la columna; juez en el riel | columna 720, composer 56–160 | composer en slot inferior | 4 | 4 | 5 | 5 | 4 | **22** |

**Ganador: MI3.** *Por qué*: la lección magistral es un documento para leer (misma superficie que Leer) y el chat son preguntas sobre ese documento; al ir debajo conserva el orden de lectura. El composer queda fijo al pie de la columna (medidas en D.9). Presupuesto a 1440×900: 96 de barras + composer: vacío con chips = 24 (padding) + 56 (marco) + 8 + 56 (chips de 24 en hasta 2 filas, gap 8) = **144**; expandido (sin chips) = 24 + 136 (marco con textarea máx. 120) = **160**. La lección tiene entre **644px (72%)** y **660px (73%)** visibles.

### C.13 Accesibilidad táctil del grafo

Sin hover en pantallas táctiles, las relaciones del nodo se revelan por **selección** (1er toque) y se muestran en el panel inferior (móvil) o en el panel de lectura (tablet); el 2º toque o el botón "Estudiar" abre la card. En teclado, el foco de un nodo equivale al hover.

---

## Sección D — Patrones de componentes y mecánica de interacción

### D.1 Arquitectura del app shell

```
<body>                                   overflow: hidden (el documento nunca scrollea)
 #root
 └ .app (shell)                          display:grid; grid-template-columns: var(--sidebar-w) 1fr; height:100dvh
    ├ aside.sidebar       (ORG-SIDEBAR)  grid: header 52 / switcher / nav / focos (1fr, scroll) / footer; z --z-chrome
    ├ main.canvas.view-scroll            overflow-y:auto; overscroll-behavior:contain; scrollbar-gutter:stable  ← único scroll de la vista
    │   ├ header.topbar   (ORG-TOPBAR)   position: sticky top 0; z --z-chrome; fondo --bg-app; con scrollTop>0 → --bar-glass + hairline
    │   └ div.view-content               (lista, grafo, flashcards, progreso)
    └ nav.dock            (ORG-DOCK)     solo < 768; position: fixed bottom 0
 ├ section.study          (sesión)       HERMANO de .app; position: fixed inset 0; z --z-study; role="region" aria-label="Sesión de estudio: {label}"
 ├ aside.hud                             HERMANO; position: fixed; z --z-hud
 └ #portal-root                          HERMANO; drawers, diálogos, paleta, popovers, toasts, tooltips
```

| Breakpoint | Columnas del shell | Sidebar | Barra | Dock |
|:--|:--|:--|:--|:--|
| < 768 | `1fr` | oculta | ORG-TOPBAR-M 56 (sticky) | 64 + safe-area; `.view-scroll` suma `padding-bottom: calc(64px + env(safe-area-inset-bottom) + 16px)` |
| 768–1099 | `56px 1fr` | colapsada: iconos 20 en botones 40×40, tooltips a la derecha; focos → botón `Filter` que abre ORG-FOCUS-SHEET (popover anclado, 320×máx 480) | 52 | — |
| ≥ 1100 | `248px 1fr` (o `56px` si el usuario la colapsa; preferencia persistida) | expandida | 52 | — |

**Sidebar (expandida, 248)** — de arriba abajo, padding horizontal 12:
1. Cabecera 52: glifo 20 + "Learning Workspace" (`--fs-sm` 600) · botón colapsar (`PanelLeftClose`, `--ctl-sm`) a la derecha de la marca (distancia ≤ 120px).
2. Selector de grafo: segmented de 2 (ancho completo 224, `--ctl-md`, `--r-group`), gap inferior 16.
3. Navegación: 3 items de 32 (`Map` Mapa · `Layers` Flashcards · `BarChart3` Progreso + `34%` mono `--text-3` a la derecha). Item activo: `--accent-soft` + borde 1px `--accent` + texto `--text-1`; inactivo `--text-2`. Gap inferior 20.
4. Focos: eyebrow "FOCO" (16) + gap 8 + filas de 32: "Todos" (`LayoutGrid` 16) y una por categoría (punto 8 + label ellipsis + `d/t` mono `--fs-xs` `--text-3`). Activa: estilo seleccionado. Esta sección es la única con scroll de la sidebar (`overflow-y:auto`, scrollbar fina).
5. Pie (hairline superior `--line-subtle`, padding 12): botón "Buscar…" + kbd (secundario, ancho completo, `--ctl-md`) · fila "Conexiones de IA" (`Settings2` + label + conexión activa `--text-3` ellipsis) `--ctl-md`.

**Colapso**: `grid-template-columns` anima 248 → 56 en `--dur-3` `--ease-in-out`; labels con `opacity` 0 en los primeros 120ms.

**Sidebar colapsada (56; tablet y desktop colapsado)** — columna de icon buttons 40×40 centrados (padding 8), con tooltip a la derecha (`--z-tooltip`, 600ms de retardo; 0 al moverse entre items; inmediato con foco de teclado):
1. Cabecera 52: botón expandir (`PanelLeftOpen`) — en tablet no existe expandir (no hay espacio) y en su lugar va el glifo.
2. Grafo: botón con monograma mono "Re"/"Ra" (`--fs-xs` 600) que abre un menú (popover) con "React entrevistas" / "Rails entrevistas" (`role="menuitemradio"`).
3. Nav: 3 icon buttons (activo = estilo seleccionado); el tooltip de Progreso incluye el % ("Progreso · 34%").
4. Foco: icon button `Filter` (estilo seleccionado si hay un foco activo, tooltip "Foco: {categoría}") que abre ORG-FOCUS-SHEET como **popover anclado** (320 × máx. 480) — en móvil ORG-FOCUS-SHEET es hoja inferior.
5. Pie: `Search` (paleta) y `Settings2` (ajustes).

**Barra móvil (ORG-TOPBAR-M, 56)**: glifo 24 · selector de grafo = segmented 2× "React | Rails" (contenedor 44, segmentos 36, 128px) · derecha agrupada (tras el selector, gap 8): botón Foco (`Filter` + nombre corto de la categoría activa, máx. 72 con ellipsis, o solo icono con "Todos") y conmutador Lista/Grafo (icon button 40 `List`/`Network`, `aria-pressed`).

**Sesión de estudio**: capa `position:fixed; inset:0; background:--bg-app`, **no modal**: al abrirse, solo `.app` (el shell) recibe `inert` (que ya implica ocultarlo a tecnologías asistivas); la sesión, el HUD y `#portal-root` son hermanos y siguen siendo alcanzables con Tab y lector de pantalla. No hay focus trap: el orden de Tab recorre sesión → HUD → overlays abiertos. Al abrir, el foco va al título compacto de la barra (`tabindex=-1`); al cerrar, vuelve al elemento que la abrió (card, fila, nodo, resultado de la paleta; si ya no existe, al título de la vista). Entra con opacidad + `translateY(var(--move-2))` en `--dur-3`.

| Breakpoint | Estructura de `.study` | Alto de `.study-body` | Padding inferior de `.study-scroll` |
|:--|:--|:--|:--|
| ≥ 1100 | barra `--bar-h` → `.study-body` grid `1fr 320px` (columna + riel, scrolls independientes) | `calc(100dvh − var(--bar-h))` | 40 (+ 72 si hay HUD) |
| 768–1099 o Zen | barra → `.study-body` grid `1fr` → barra de resumen de etapa (56, solo en Leer y Parafrasear; B.5) como última fila de la columna (`position:sticky; bottom:0`). Panel del riel: acoplado (`1fr 360px`) si `W ≥ 968`; si no, hoja lateral modal (D.3) | `calc(100dvh − var(--bar-h))` | con barra de resumen: 56 + 16; sin ella (Mentor: composer sticky; Evaluar): 40 (+ 56 si hay HUD en ambos casos) |
| < 768 | barra 56 → `.study-scroll` → slot inferior fijo (56 + safe-area; el composer puede crecer hasta 160; su alto real se publica en `--slot-h` vía ResizeObserver) | `calc(100dvh − 56px)` | `var(--slot-h) + env(safe-area-inset-bottom) + 16` (+ 56 si hay HUD) |

Dentro de `.study-scroll`: titular (solo Leer) + pestañas sticky (`top:0`) + panel de la etapa. `scrollbar-gutter: stable both-edges` para que la columna centrada quede alineada con la grilla de la barra. Teclado virtual (móvil): `<meta name="viewport" content="…, interactive-widget=resizes-content">` + alturas en `dvh`, de modo que el slot inferior y el composer quedan siempre por encima del teclado.

### D.2 Rutas, historial y teclado global

| Ruta | Estado |
|:--|:--|
| `/:graph` (`react`, `rails`) | vista Mapa; grafo inválido → `replaceState('/react')` |
| `/:graph/card/:nodeId` | sesión abierta en 01 Leer; nodo inválido → `replaceState('/:graph')` |
| `?view=flashcards` / `?view=progress` | vistas Flashcards / Progreso (el mapa es la vista por defecto) |

- Abrir card: `pushState({previousNodeIds, canReturn:true})`. Abrir desde otra card con "recordar" (Antes/Después/Relacionados/Siguiente/HUD) agrega la actual a `previousNodeIds` → habilita volver (INF-051).
- Cerrar: si `canReturn` → `history.back()`; si no → `replaceState('/:graph')`.
- `popstate`: detiene TTS, restablece etapa a 01 Leer, cierra popovers, reconstruye la pila.
- Cambiar etapa **no** cambia la URL (estado local). Abrir una card entra en 01 Leer con `scrollTop = 0`, **salvo que el origen indique etapa**: flashcards "Practicar en Parafrasear" → 03; HUD / chip de tarea → etapa de la tarea (02 harness, 04 evaluación); punto de evaluación del gráfico → 04 con ese intento.

**Esc — prioridad única (de arriba abajo, se consume el primero que aplica)**: tooltip → popover/menú/deep dive → paleta → diálogo (flashcard/confirmación) → drawer de ajustes → hoja (foco/riel compacto) → HUD expandido → revisión en vivo en curso (cancela, solo con foco en el editor) → **modo Zen (sale)** → sesión de estudio (cierra).

| Atajo | Ámbito | Acción |
|:--|:--|:--|
| ⌘K / Ctrl+K | global (incluso en inputs) | Abrir/cerrar paleta |
| Esc | global | ver prioridad |
| ← / → | mapa: solo con el foco dentro de la grilla de cards | card anterior / siguiente en prioridad dentro del foco (mueve el foco de teclado, no abre) |
| 1…4 | sesión: solo con el foco en `.study-scroll` o en la barra de pestañas | cambiar a etapa 01…04 |
| ⌘/Ctrl+Enter | editor de Parafrasear | revisar ahora (dispara el live review sin esperar el debounce) |
| ⌘/Ctrl+Shift+Enter | editor de Parafrasear | ir a 04 Evaluar |
| Enter / Shift+Enter | composer del Mentor | enviar / nueva línea |
| Espacio | diálogo de flashcard, con el foco en el cuerpo de la card (no en un botón) | voltear |
| ← / → | diálogo de flashcard | card anterior / siguiente (el diálogo detiene la propagación: no llega al mapa) |
| 1…4 | diálogo de flashcard, práctica, volteada | calificar |
| K / J | sesión 01 Leer: solo con el foco en `.study-scroll` | reproducir-pausar / siguiente segmento TTS |

**Regla de ámbito (WCAG 2.1.4)**: los atajos de una sola tecla solo actúan cuando el foco está en la región indicada y **nunca** si el objetivo es editable (`input`, `textarea`, `contenteditable`) o está dentro de un widget compuesto (`listbox`, `menu`, `radiogroup`, `tablist`, `grid`, `combobox`) o del canvas del grafo (`role="application"`), que manejan sus propias flechas.

### D.3 Overlays y jerarquía de capas

| Overlay | Capa (`--z-*`) | Superficie | Tamaño | Scrim | Scroll-lock | Focus trap | Cierre | Foco al cerrar |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| Tooltip | tooltip 100 | s3, `--r-md`, padding 8×12, `--fs-sm` | máx. 280 | no | no | no | mouseleave/blur/Esc | — |
| Popover / menú (velocidad TTS, grafo en sidebar colapsada) | popover 80 | s3, `--r-group`, padding 4 | 180–320 | no | no | roving en menús | click fuera/Esc/selección | disparador |
| Deep dive | popover 80 | s3, `--r-xl`, padding 20 | 300–520 × máx 520 | no | no | no (no modal) | Esc/scroll del contenedor/cerrar/click fuera | término |
| Paleta | palette 70 | s2, `--r-xl`, padding 8 | 640 × máx 520, top 12vh | sí | sí | sí | Esc/⌘K/click scrim/ejecutar | elemento previo (fallback: título de la vista) |
| Diálogo flashcard | modal 60 | s1, `--r-xl` | 720 × máx 88vh (móvil: pantalla completa) | sí | sí | sí | Esc/cerrar/click scrim | card del grid |
| Confirmación | modal 60 | s1, `--r-xl`, padding 24 | 440 | sí | sí | sí (foco inicial en Cancelar) | Esc/Cancelar | disparador |
| Drawer de ajustes | drawer 50 | s1, borde izq. `--line-strong` | 480 (móvil: 100%) | sí | sí | sí | Esc/cerrar/click scrim | disparador |
| Panel de riel acoplado (tablet/Zen, W ≥ 968) | — (dentro de `.study-body`, no es overlay) | bg-app, borde izq. `--line` | 360 lateral derecha; la columna se reduce a `min(720, W − 360 − 48)` | no | no | no | cerrar/Esc | barra de resumen o badge que lo abrió |
| Hoja lateral del riel (tablet/Zen con `W < 968`) | drawer 50 | s1, borde izq. `--line-strong`, `--shadow-modal` | 360 × alto completo | sí | sí (`.study-scroll`) | sí | Esc/cerrar/click scrim | barra de resumen o badge que la abrió |
| Hoja inferior (móvil: foco, riel, auditoría) | drawer 50 | s1, `--r-xl` arriba | 100% × máx 85% | sí | sí | sí | Esc/arrastrar abajo > 80px/click scrim | disparador |
| Hoja de foco (tablet) = popover anclado | popover 80 | s3 | 320 × máx 480 | no | no | roving | click fuera/Esc/selección | botón Filtro |
| Sesión de estudio | study 30 | bg-app | pantalla completa | no (opaca) | shell `inert` | **no** (capa no modal, ver D.1) | Esc (tras Zen)/cerrar | card/nodo/fila que la abrió |
| HUD | hud 40 | s3 | colapsado 40 (móvil 48) × 280–360; expandido 360 × máx 420 | no | no | no | click fuera/Esc (expandido) | — |
| Toast | toast 90 | s3 | 360–400 | no | no | no | 5s/cerrar | — |

Scroll-lock: `overflow:hidden` en `.view-scroll` y `.study-scroll` del plano inferior (el `body` ya es `overflow:hidden`), restaurando `scrollTop` al cerrar.

**Un solo overlay modal a la vez**: abrir la paleta (⌘K) o ejecutar una acción que abre otro modal primero cierra el overlay modal abierto (diálogo, drawer, hoja inferior) sin devolverle el foco; ejecutar una card desde la paleta cierra la paleta y abre la sesión. Nunca hay dos scrims.

**Foco inicial y roles por overlay**

| Overlay | Rol / ARIA | Foco inicial |
|:--|:--|:--|
| Tooltip | `role="tooltip"`, el disparador lleva `aria-describedby` (o `aria-label` si es icon button). Texto `--fs-sm`. Retardo 600ms (hover), inmediato con foco; se oculta al salir/blur/Esc | — |
| Menú (velocidad, grafo) | disparador `aria-haspopup="menu"` `aria-expanded`; `role="menu"` + `menuitemradio` con `aria-checked` | item marcado |
| Popover de foco (tablet) | `role="dialog"` no modal, `aria-label="Elegir foco"`; lista `role="radiogroup"` | radio activo |
| Deep dive | `role="dialog"` no modal, `aria-labelledby` título | botón cerrar |
| Paleta | `role="dialog" aria-modal="true" aria-label="Buscar"`; input `role="combobox" aria-expanded="true" aria-controls aria-activedescendant aria-autocomplete="list"`; resultados `role="listbox"`, grupos `role="group" aria-labelledby`, filas `role="option" aria-selected` | input |
| Diálogo de flashcard | `role="dialog" aria-modal="true" aria-labelledby` título | cuerpo de la card (`tabindex=-1`) |
| Confirmación | `role="alertdialog" aria-modal="true"`, `aria-describedby` cuerpo | "Cancelar" |
| Drawer de ajustes | `role="dialog" aria-modal="true" aria-labelledby` título de la vista | primer control de la vista (búsqueda en catálogo; "Nombre" en editor; primera fila en conexiones) |
| Hoja inferior (móvil) | `role="dialog" aria-modal="true"` | botón cerrar de la hoja |
| Hoja lateral del riel (tablet/Zen, `W < 968`) | `role="dialog" aria-modal="true" aria-labelledby` (título de la sección del riel) | botón cerrar |
| Panel acoplado del riel (`W ≥ 968`) | `role="complementary" aria-label="{título del riel}"`; no modal | se mueve al panel al abrirse (su título, `tabindex=-1`) |
| HUD expandido | `role="region" aria-label="Tareas en segundo plano"`; colapsado es `<button aria-expanded>` | primera fila |
| Toast | `role="status"` / `role="alert"` en una región `aria-live` persistente | — (no roba foco) |

**Variantes móviles (< 768)**

| Overlay | Móvil |
|:--|:--|
| Paleta | pantalla completa anclada arriba: input 48 (+ botón "Cerrar" 44), resultados con scroll hasta el borde superior del teclado (`dvh`), pie oculto |
| Confirmación | ancho `calc(100% − 32px)`, botones apilados a ancho completo (48), acción arriba |
| Deep dive | hoja inferior (máx. 85%) |
| Diálogo de flashcard | pantalla completa; pie fijo 64 + safe-area |
| Drawer de ajustes | pantalla completa, cabecera 56 con "Cerrar" |
| HUD en el mapa | encima del dock: `bottom: calc(64px + env(safe-area-inset-bottom) + 8px)`, ancho `calc(100% − 24px)` |

**Anatomía de hoja inferior (móvil)**: `--surface-1`, `--r-xl` solo arriba, `--shadow-modal`; asa 36×4 `--line-strong` `--r-full` a 8px del borde superior; cabecera 48 (título `--fs-sm` 600 a la izquierda + cerrar 44 a la derecha, junto al título en ≤ 358px); cuerpo con scroll Y; padding inferior 16 + safe-area; filas interactivas 48.

### D.4 Botones — 6 estados

| Variante | Default | Hover | Active | Focus-visible | Disabled | Loading |
|:--|:--|:--|:--|:--|:--|:--|
| Primario (paper) | `--paper` / `--text-on-paper` | `--paper-hover` | `--paper-active` + `translateY(1px)` | anillo 2px `--accent` offset 2 | `rgba(255,248,230,.08)` / `--text-4`, `cursor:not-allowed` | spinner 16 reemplaza el icono (o antecede al label), label pasa a gerundio ("Evaluando…"), `aria-busy="true"`, no clickeable |
| Secundario | `.05` + borde `--line` / `--text-1` | + `--hover-overlay`, borde `--line-strong` | + `--press-overlay` | idem | transparente, borde `--line-subtle`, `--text-4` | idem |
| Ghost | transparente / `--text-2` | `--hover-overlay` / `--text-1` | `--press-overlay` | idem | `--text-4` | idem |
| Destructivo | transparente / `--danger` | `--danger-soft` | + `--line-strong` | idem | `--text-4` | idem |
| Destructivo relleno (solo confirmaciones) | `--danger` / `--text-on-paper` | `color-mix(in oklch, var(--danger) 88%, white)` | `color-mix(in oklch, var(--danger) 80%, black)` | idem | como primario deshabilitado | idem |
| Icon button | ghost cuadrado (28/32/40) | idem ghost | idem | idem | idem | spinner en lugar del icono |

**Anti-CLS**: todo botón con estado de carga o label variable declara `min-width` igual al ancho de su label más largo (medido en diseño): "Evaluar borrador"/"Evaluando…" (`--ctl-lg`, icono `Scale`) 184px; "Probar modelo"/"Probando…" (md, `Zap`) 148px; "Cargar catálogo"/"Cargando…" (md, `Download`) 156px; "Guardar y usar"/"Guardando…" (md, primario sin icono → spinner antepuesto dentro del ancho reservado) 140px; "Generar lección"/"Regenerar lección" (md, `Sparkles`) 172px; "Actualizar"/"Actualizando…" (sm, `RefreshCw`) 148px; "Enviar"/"Detener" (sm, `ArrowUp`/`Square`) 104px; "Dictar"/"Grabando…" (sm, `Mic`) 128px; "Copiar"/"Copiado" (sm, `Copy`/`Check`) 108px; "Estudiar ahora" (md, `ArrowRight`) 148px; "Revisar ahora · {s}s" (sm, cifras `tabular-nums`) 152px. Valores con margen ≥ 4px sobre la medición en Geist 500 14px; un test e2e verifica `scrollWidth ≤ clientWidth` en cada uno. El spinner ocupa el lugar del icono (16px), nunca agrega ancho.

Tamaños: `--ctl-sm` 28 (padding 0×12, `--fs-sm` 500, icono 16, gap 8) · `--ctl-md` 32 (0×12) · `--ctl-lg` 40 (0×16). `--r-sm` en todos salvo donde un par concéntrico indique otro. Transiciones de color `--dur-1`. Los estilos hover se declaran dentro de `@media (hover: hover)`; en táctil solo existen active y focus.

**Labels dinámicos**: botones cuyo label incluye datos ("Continuar con {label}", "Abrir: {label} →"; "Volver a {label}" es un icon button con tooltip) nunca desbordan: son filas-botón de 2 líneas (línea 1 `--fs-xs` `--text-3` "Continuar con"; línea 2 `--fs-sm` 500 con el label, `line-clamp:2`), alto 56, ancho completo del contenedor; el label completo va en `aria-label`.

### D.5 Controles de formulario

| Control | Anatomía | Estados |
|:--|:--|:--|
| Input / search | `--ctl-md`, fondo `--surface-inset`, borde 1px `--line-control`, `--r-sm`, padding 0×12, `--fs-sm`; search con icono `Search` 16 a la izquierda (padding-left 32) y botón limpiar (`X`, 24) a la derecha cuando hay texto | hover: borde `--text-3`; focus (`:focus-visible` y `:focus`): borde `--accent` + `box-shadow: 0 0 0 1px var(--accent)` (2px efectivos), `outline:none` (reemplaza el anillo global solo en campos de texto); error: borde `--danger` + mensaje `--fs-sm` `--danger` debajo con icono `AlertCircle` 16; disabled: borde `--line-subtle`, texto `--text-4` |
| Label | encima, `--fs-sm` 500 `--text-1`, gap 8; ayuda debajo `--fs-xs` `--text-3`, salvo que sea información necesaria (entonces `--fs-sm` `--text-2`) | — |
| Password (API key) | input + botón ojo (`Eye`/`EyeOff`, ghost 28) "Mostrar/Ocultar clave" | idem |
| Select | igual al input + `ChevronDown` 16 (select nativo estilizado) cuando hay ≤ 20 opciones; lista de modelos (hasta 250): patrón **combobox** — input `role="combobox" aria-autocomplete="list" aria-expanded aria-controls aria-activedescendant` + `role="listbox"` de 240px con scroll propio; ↑↓ mueven la opción activa, Enter elige, Esc cierra la lista | opción activa y seleccionada: estilo único de listas (fila siguiente) |
| Textarea (Parafrasear) | fondo `--surface-inset`, borde `--line-control`, `--r-lg`, padding 16, `--fs-md`/26 `--font-ui`, `min-height` 220, autogrow sin scroll interno (el scroll es de la columna); al crecer se preserva la posición visual del caret | focus: borde `--accent`; read-only (historial): fondo transparente, borde `--line-subtle`, sin caret |
| Textarea (composer) | 1 línea (40) → máx. 120 de alto, luego scroll interno; botones a la derecha dentro del marco (mic 32, enviar 104) | idem |
| Segmented | contenedor `--r-group`, padding 4, fondo `rgba(255,248,230,.04)`, borde `--line-subtle`; segmentos `--r-sm`, altura contenedor − 8 (móvil: contenedor 44, segmentos 36 con área táctil de 44 por pseudo-elemento); activo: `--surface-2` + `--text-1` + sombra `inset 0 1px 0 rgba(255,248,230,.06)`; inactivo `--text-2`, hover `--hover-overlay` | **Siempre** `role="radiogroup"` + `role="radio"` `aria-checked` (Lista/Grafo, React/Rails, Editor/Tramos): flechas mueven y seleccionan, Tab entra/sale del grupo |
| Chip de filtro | `--ctl-xs` (24; móvil 32), `--r-full`, padding 0×12, `--pill-neutral`, `--fs-xs` 500 `--text-2`, conteo opcional mono | activo: estilo seleccionado (`--accent-soft` + borde `--accent`, texto `--accent-strong`; su conteo pasa a `--text-2`); disabled (conteo 0 con búsqueda): `--text-4` |
| Checkbox / switch | no se usan en v3 | — |
| **Regla global de estado seleccionado** | Dentro de cualquier elemento con fondo `--accent-soft` (item de nav activo, fila de categoría activa, fila de intento seleccionada, chip activo, card seleccionada), todo texto secundario pasa de `--text-3` a `--text-2` y el principal es `--text-1` | — |
| Opción activa en listas (paleta, listbox de modelos, menús, popover de foco) | **Un único estilo**: activa por teclado/hover = `--press-overlay` + barra izquierda 2px `--accent`; seleccionada/marcada = icono `Check` 16 `--text-1` al final de la fila. Nunca `--accent-soft` en listas | — |

Validación: al enviar, nunca en cada tecla; el primer campo inválido recibe el foco; mensajes con la copia INV §6.

### D.6 Contención de scroll (un eje por contenedor)

| Contenedor | Eje | Notas |
|:--|:--|:--|
| `.view-scroll` (= `main.canvas`: mapa lista, flashcards, progreso) | Y | Barra superior sticky (`top:0`); cabeceras de grupo sticky bajo ella (`top: var(--bar-h)`, `--z-sticky`, fondo sólido `--bg-app`, hairline inferior al quedar pegadas) |
| Canvas del grafo | ninguno (pan/zoom) | `touch-action:none`; rueda = zoom anclado al cursor (factor 1.12); arrastre > 5px = pan con pointer capture diferida |
| Sidebar: lista de focos | Y | Cabecera, selector, nav y pie no scrollean |
| `.study-scroll` (columna) | Y | Pestañas sticky dentro; se resetea a 0 al cambiar de card o de etapa |
| Riel de estudio | Y | Independiente de la columna |
| Bloque de código, tabla, comparación | X | `overflow-x:auto` propio; nunca Y |
| Composer / listbox / paleta (resultados) / hoja / drawer (cuerpo) | Y | Cabeceras y pies fijos (`flex-shrink:0`) |
| Chips de filtros (flashcards) | ninguno | `flex-wrap: wrap` en desktop y móvil (6 chips caben en 2 líneas en 390) |

Scrollbars: `scrollbar-width: thin` + color de DESIGN §11 en todos; `scrollbar-gutter: stable` en `.view-scroll` y el riel; `stable both-edges` en `.study-scroll` (mantiene la columna centrada respecto de la barra).

### D.7 Pestañas y navegación segmentada

- **Pestañas de etapa (ORG-STUDY-TABS)**: `role="tablist"` `aria-label="Etapas de estudio"`; 4 `role="tab"` con `aria-controls` → `role="tabpanel"`. Alto 44, `flex-shrink:0`, sticky. Cada pestaña: número mono `--fs-xs` `--text-3` + label `--fs-sm` 500; padding 0×12; activa: texto `--text-1` + indicador inferior 2px `--accent` (ancho del texto, `--r-full`), número `--text-2`; hover `--hover-overlay` en un área de 28px de alto centrada en la pestaña (inset 8px vertical, `--r-sm`); sin fondo en la activa (la superficie `--surface-2` es para el segmento activo de los segmented, no para estas pestañas). IA activa (02/04): icono `Sparkles` 12 pulsante tras el label + `aria-description="IA trabajando en esta etapa"`. Teclado: ←/→ mueven y **activan** (activación automática), Home/End.
- **Barra de pestañas**: ocupa exactamente el ancho de la columna (`colStart…colEnd`); las pestañas se alinean al borde izquierdo de la columna (igual que el contenido; por debajo de 1280 esto no coincide con `titleStart` de la barra superior, y es intencional: las pestañas pertenecen a la columna). El slot derecho termina en `colEnd`.
- **Chip de tarea** (slot derecho): `--ctl-sm` 28, `--pill-neutral`, `--r-full`, icono de tipo (`BrainCircuit` mentor / `Scale` evaluación) + mensaje ellipsis + separador + "Ver en vivo" (`--accent`); `min-width` 160, `max-width` 320; si el espacio libre del slot es < 240 muestra solo icono + "Ver en vivo" (128); en móvil (espacio 52) es un icon button 44 con `aria-label` "{mensaje}. Ver en vivo".
- **Conmutadores (Lista/Grafo, React/Rails, Editor/Tramos)**: segmented de D.5, 2 opciones.

### D.8 Tamaños explícitos de control (resumen)

| Elemento | Desktop | Móvil |
|:--|:--:|:--:|
| Botones de barra, icon buttons | 28 | 40 (área táctil 44) |
| Botón estándar, input, tab, segmented | 32 | 44 |
| Primarios de sección, input de paleta | 40 | 48 |
| "Estudiar ahora" (RouteNow, `--ctl-md`) | 32 | 44 |
| Items de sidebar / filas de lista / filas de paleta | 32 / 40 / 40 | — / 64 / 48 |
| Filas de hoja inferior / RouteRow / filas de riel interactivas | — / 32 / 32 | 48 / 44 / 44 |
| Filas de cobertura (no interactivas) | mín. 28, crece con el texto | igual |
| Chips de filtro y pills interactivas | 24 | 32 (área 44 por pseudo-elemento) |
| Nodo del grafo | 236 × 88 | igual (escalado por zoom) |
| Items del dock | — | 64 alto × ≥ 72 ancho |
| Pestañas de etapa | 44 | 44 |

### D.9 Catálogo de componentes (anatomía y medidas)

**ScoreRail** (DESIGN §8.1) — props `{score|null, max=120, threshold=100, size: 'sm'(4) | 'lg'(8), provisional}`. Ancho 100% del contenedor; segmento base `width: min(score,100)/120`; extra desde 100/120. `role="img"` `aria-label="Puntaje {n} de 120"` / "Sin evaluar".

**ScoreValue** — `n` + `/120` según pares DESIGN §2.6; prefijo `★` (gold) si > 100, `✓` (mastery) si = 100.

**StatusPill** — `--ctl-xs` 24 (no interactiva: alto 20), `--r-full`, padding 0×8, icono 12 + `--fs-xs` 500; colores DESIGN §1.4.

**ConceptCard (ORG-GRID)** — 140px fijos, `--surface-1`, borde `--line`, `--r-lg`, padding 16; `<button>` completo (toda la card es el target) con `aria-label` compuesto ("{label}. Prioridad {p}. {estado}. {ruta}. {prereqs}").
- Fila meta (20): `#p` mono `--fs-xs` `--text-3` · (derecha) marcador de ruta: pill `--accent-soft`/`--accent-strong` "Mejor siguiente" (solo nivel 1) o texto `--fs-xs` `--text-3` "Nivel 2/3"; IA activa: `Sparkles` 12 pulsante antes del marcador.
- Título (40): `--fs-sm` 500 `--text-1`, 2 líneas, `line-clamp:2`.
- Riel sm (4) a ancho completo.
- Pie (16): `ScoreValue` sm a la izquierda (o "Sin evaluar" `--text-3`) · a la derecha `! 2 prerreq.` (`AlertTriangle` 12 `--warn` + `--fs-xs` `--warn`; **texto estático, no interactivo**: los nombres van en el `aria-label` de la card y en el contexto de la sesión) o `PenLine` 12 + "Borrador" `--text-3`.
- Hover: `--hover-overlay` + borde `--line-strong` (`--dur-1`); active: `--press-overlay`; focus-visible: anillo; seleccionada (última abierta al volver): estilo seleccionado 1.2s y luego vuelve a default.

**ConceptRow (móvil)** — 64px, padding 12×16, hairline inferior `--line-subtle`; punto 8 · título 2 líneas `--fs-sm` 500 · derecha `ScoreValue` + riel 48; target completo.

**RouteNow (ORG-ROUTE "Ahora")** — `--surface-1`, borde `--line`, `--r-lg`, padding 16, altura 176 (misma que las listas; ancho ≈ 411 a 1440): eyebrow "AHORA" (16) · gap 8 · label `--fs-lg` 600 (2 líneas, 52) · gap 8 · fila de 32: punto + categoría · "Etapa n de m · #p" (`--fs-xs` `--text-2`, ellipsis) seguida inmediatamente del primario `--ctl-md` "Estudiar ahora" (`ArrowRight`, 148) · gap 12 · riel sm (4) → 16+16+8+52+8+32+12+4+16 = 164 ≤ 176. Las columnas "Después" y "Más adelante" (sin caja): eyebrow (16) + gap 8 + hasta 4 filas `RouteRow` de 32 (= 152) (`#p` mono 28px + label ellipsis + icono de estado 12), hover overlay `--r-sm`. Grid de ORG-ROUTE: `1.2fr 1fr 1fr`, gap 24, hairline inferior `--line-subtle` a 32px.

**RouteNow móvil** — igual, ancho completo, con stepper al pie: `‹` (icon 40) · "i/n" mono · `›` (icon 40); el primario pasa a "Estudiar".

**CategoryRow (sidebar)** — 32px, padding 0×8, `--r-sm`; punto 8 + label `--fs-sm` (activa 500 `--text-1`; inactiva 400 `--text-2`) + conteo mono. `aria-pressed`.

**GraphNode** — `<g role="button" tabindex="0">` 236×88 (el layout topológico se configura con `nodeHeight: 88`), `--surface-1`, borde `--line`, `--r-lg` (rx 12), trazo superior 2px color de categoría (inset, dentro del radio: se dibuja como path que sigue la curva superior). Contenido (padding 8 vertical, 12 horizontal): fila 1 (16): texto de categoría (el color ya está en el trazo, sin punto) `--fs-xs` `--text-3` ellipsis 19 car. + `ScoreValue` `--fs-xs` a la derecha. gap 4 · fila 2 (40): label `--fs-sm` 500 2 líneas (29 car.) · gap 8 · fila 3: riel 4 con marca 100 → 8+16+4+40+8+4+8 = 88. Marcador de ruta: pill "Mejor siguiente" fuera del nodo, arriba a la derecha (−12px), o "Nivel n" `--fs-xs`. IA activa: `Sparkles` 12 junto al puntaje. Estados: fuera del foco de categoría → `opacity .32` y `tabindex=-1`; fuera de la cadena durante un hover → `opacity .32` **sin** cambiar `tabindex`; ancestro/descendiente en hover: borde `--line-strong`; hover: overlay + borde `--line-strong`; **foco de teclado**: además del estilo hover, anillo SVG (rect `rx 15`, a 3px del nodo, trazo 2 `--accent`) y muestra sus relaciones como el hover; seleccionado: estilo seleccionado.
- Aristas: ruta guía `--text-3` 1.5px continua con punta de flecha; entrante en hover "necesita" `--text-3` 1.5 discontinua 4/4; saliente "habilita" `--text-1` 1.5 continua; curvas bezier horizontales.
- Columnas de etapa: eyebrow "ETAPA n" + `--fs-xs` "Punto de partida"/"{k} conceptos" en la parte superior de cada columna (en coordenadas del grafo, escalan con el zoom).
- Overlays flotantes (`--surface-3`, `--r-lg`, padding 12, `--shadow-pop`): panel de lectura (sup. izq., máx. 360); controles (sup. der.): "Etapa x de y" `--fs-xs` + grupo de icon buttons 28 (`Crosshair` Próximo foco, `Maximize` Ver el mapa completo, `Minus` Alejar, `Plus` Acercar) en contenedor `--r-group` padding 4; leyenda (inf. izq.).
- Zoom: 0.18–1.7, pasos ×1.16; encuadre inicial: columnas enteras desde el nodo primario (escala ≤ 1.04, mínimo útil 0.88 desktop / 0.84 móvil); recentra en resize (ResizeObserver) y al cambiar de grafo/foco.

**StudyHeader** — ver B.4 (reserva de herramientas: 232px, que incluye 4 icon buttons + velocidad + Zen + gaps). Icon buttons 28; puntaje compacto: `ScoreValue` sm + riel 48 como `<button>` que lleva a 04 Evaluar (`aria-label` "Puntaje {n} de 120. Ir a Evaluar"). Grupo TTS en contenedor `--r-group` padding 4 con 4 icon buttons 28 (`RotateCcw`, `SkipBack`, `Play`/`Pause`/spinner, `SkipForward`) + botón menú de velocidad "1x" (mono, 56) que abre menú con 0.5 · 0.75 · 1 · 1.25 · 1.5 · 1.75 · 2 (roving, marca `Check`). Zen: `Maximize2`/`Minimize2`.

**TitleBlock (01 Leer)** — eyebrow "{categoría} · #{p}" → gap 8 → titular `--fs-4xl` serif (máx. 3 líneas) → gap 12 → fila: StatusPill de estado (INF-056) + estado TTS `--fs-xs` `--text-3`. Padding superior 32; gap 24 hasta las pestañas.

**ContextRail (Leer)** — padding 20, secciones separadas por hairline `--line-subtle` con 20 arriba y abajo:
1. Puntaje: eyebrow "PUNTAJE CANÓNICO" · `ScoreValue` lg (`--fs-3xl`) · riel sm · detalle `--fs-xs` `--text-2`.
2. "Lugar en el mapa": tres subgrupos Antes / Ahora / Después con eyebrow; filas `RouteRow` (≤ 5) con icono de estado; "Ahora" es texto `--text-1` 500 sin acción; vacíos "Punto de partida" / "Inicio de este foco" / "Último eslabón" en `--text-3`.
3. "Siguiente en este foco": fila-botón de 2 líneas (D.4 labels dinámicos) "Continuar con" / {label} + `ArrowRight`.
4. "Completitud": texto `--fs-sm` `--text-2`.

**ReadSection** — `<section aria-labelledby>`; cabecera: título `--fs-lg` 600 + (si hay segmento TTS) icon button 28 `Volume2` "Escuchar esta sección" alineado al final de la línea del título (gap 8, no al borde de la columna); cuerpo `--fs-md`/26 `--text-1`; gap entre secciones `--sp-8`. Sección en lectura TTS: barra vertical 2px `--accent` a la izquierda (−16px) + el chunk leído con fondo `--accent-soft` `--r-xs`. Pares de listas "Paso a paso" / "Trade-offs y errores": 2 columnas ≥ 880 de ancho disponible, si no apiladas; `ol` con números mono `--text-3`.

**EnUnaFrase** — sin título de sección: eyebrow "EN UNA FRASE" + texto serif `--fs-2xl` `--text-1` + gap 12 + "Por qué importa: " (`--fs-md` 600) + texto `--text-2`.

**DeepDiveTerm** — texto con subrayado punteado 1px `--text-3` (offset 3px) + icono `HelpCircle` 12 `--text-3`; hover/foco: subrayado `--accent`; `aria-haspopup="dialog"`, `aria-expanded`.

**DeepDive popover** — ver D.3; contenido: eyebrow "SEGUNDA CAPA · POR QUÉ" · título `--fs-lg` 600 · respuesta `--fs-sm`/22 · "Ejemplo" (subtítulo `--fs-sm` 600) + texto · "Matiz importante" · fuentes (links `--accent` con `ArrowUpRight` 12) · cerrar (icon 28, arriba a la derecha). Colocación: debajo si hay ≥ 240px útiles, si no arriba; márgenes de viewport 24; gap 12; flecha no.

**ReadingChunks** — cada chunk es un `<span>` (sin `tabindex`: no son paradas de Tab) dentro de `<p>`; hover: `--hover-overlay` `--r-xs`; **sin** atenuar hermanos (el dimming legacy se elimina por carga visual; el foco de lectura se logra con el resaltado del chunk).

**CodeBlock** — DESIGN §1.6. Cabecera 36 (padding 0×12 a la izquierda, 0×4 a la derecha): label (`codeLabel` o lenguaje) `--fs-xs` `--text-3` · acciones ghost `--ctl-sm` con `--r-md` 8 (par concéntrico 12 = 8 + 4 en la esquina): "Explicar" (`MessageSquareText`, solo en el ejemplo de la lección) y "Copiar" (`Copy` → `Check` "Copiado" 2s, `aria-live`). Cuerpo `<pre>` padding 16, Prism con tokens `--syn-*`. La explicación del snippet se despliega debajo del bloque (no dentro), `--fs-sm` `--text-2`, con transición de altura `--dur-2`.

**CodeComparison** — grid 2 columnas (gap 12) si ancho disponible ≥ 880, si no apiladas (gap 16). Cada lado: CodeBlock cuya cabecera muestra `X` `--danger` + "Enfoque ingenuo" / `Check` `--mastery` + "Patrón de producción" + label propio; debajo, `--fs-sm` `--text-2`: "**Por qué falla:** …" / "**Trade-off asumido:** …".

**DataTable** — sin caja: título eyebrow `tableTitle` + subtítulo `--fs-sm` `--text-2`; `<table>` ancho completo, cabecera `--fs-xs` 600 `--text-3` MAYÚSCULAS sin tracking extra, filas `--fs-sm` con hairline `--line-subtle`, padding 8×12, primera columna 500 `--text-1`; scroll X propio si excede.

**Diagram** — Mermaid en contenedor `--surface-inset` `--r-lg` padding 16, centrado, escalado al ancho; flujo de cajas (`lesson.diagram`): fila de cajas `--surface-1` `--r-md` padding 8×12 (label 500 + detalle `--fs-xs` `--text-2`) con `ArrowRight` 16 `--text-3` entre ellas, wrap.

**InterviewCoverage** — `<details>`: summary fila 40 "Cobertura de entrevista" `--fs-lg` 600 + "{u}/{t} desbloqueadas" mono `--text-3` + `ChevronDown` rotando; filas: `#id` mono + título + estado (`Lock` 12 `--text-3` "Bloqueada: completá {labels}" o `Check` 12 `--mastery` "Disponible para practicar en esta card.").

**MiniPlayer (móvil)** — slot inferior 56 + safe-area, `--bg-sidebar`, hairline superior: "Parte i/n" mono `--fs-xs` · `SkipBack` 40 · `Play/Pause` 48 (primario paper circular) · `SkipForward` 40 · velocidad "1x" 40.

**MentorStepper** — 3 pasos en fila, cada uno: círculo 20 (pendiente: borde `--line-strong`; activo: spinner 16 `--text-1`; hecho: `Check` 12 `--text-1` sobre `--pill-neutral`; "Maestría aprobada" final: `Trophy` 12 `--mastery`) + label `--fs-sm` 500; conectores 1px `--line` de 24px. Debajo el mensaje de etapa `--fs-sm` `--text-2` + "Cancelar" ghost sm.

**LessonDocument (Mentor)** — markdown seguro (DESIGN tipografía de lectura; h2 `--fs-lg`, h3 `--fs-md` 600, listas, tablas como DataTable, código como CodeBlock, citas con borde izq. 2px `--line-strong` y texto `--text-2`); caret DESIGN §1.8 al final mientras llega.

**ThreadMessage** — sin burbujas con borde: cada mensaje es un bloque con cabecera (avatar 20: `User` para "Vos" / `BrainCircuit` para "Mentor" sobre `--pill-neutral` circular) + nombre `--fs-xs` 600 + hora `--fs-xs` `--text-3`; cuerpo indentado 28px. Mensajes de "Vos" con fondo `rgba(255,248,230,.03)` `--r-lg` padding 12×16 para distinguir turnos. Interrumpida: pie `--fs-xs` `--text-3` "Respuesta interrumpida".

**Composer** — sticky al pie de la columna (`position:sticky; bottom:0`), fondo `--bg-app` con hairline superior, padding 12 0 12; marco `--surface-inset` + borde `--line-control` `--r-lg` 12, padding 8: textarea (1 línea 40 → máx. 120, luego scroll interno) + mic (icon 32, `--r-xs` 4: par 12 = 4 + 8) + "Enviar" (primario sm, `min-width` 104, `--r-xs`; mientras responde: secundario "Detener" `Square`). Preguntas rápidas: chips interactivos de 24 (D.8) sobre el marco, `flex-wrap` hasta 2 filas (gap 8) en desktop/tablet, solo con composer vacío y lección presente, con labels cortos (A.14). **Móvil**: una sola fila de chips de 32 con scroll horizontal propio (`overflow-x:auto`, `mask-image` degradada de 24px en el borde derecho, `scroll-snap` por chip), de modo que el slot suma como máximo 32 + 8 sobre el marco. La ayuda "Enter para enviar · Shift+Enter para nueva línea" es el `title`/tooltip del botón Enviar y el `aria-describedby` del textarea; "Ir a Evaluar →" vive en la cabecera de la lección magistral. Enter envía salvo `event.isComposing` (IME). Móvil: el composer es el slot inferior (B.6).

**JudgePanel (riel Mentor)** — puntaje `n/100` (`--fs-3xl` mono) + riel variante juez (marca 95) + estado (`Trophy` `--mastery` "Maestría pedagógica" si ≥95; si no "Meta: 95") · historial: fila de valores mono "72 → 88 → 96" · rúbrica: 5 filas (label con icono lucide, `n/20` mono, riel sm de 20 unidades) · "Observaciones del juez": lista `--fs-sm` `--text-2`.

**ParaToolbar** — fila 40 sobre el textarea: segmented "Editor | Lectura por tramos" · "Dictar" (secundario sm con `Mic`, `aria-pressed`; activo: estilo seleccionado, icono `Mic` con pulso de opacidad y label "Grabando…") · marca "Borrador generado con IA" (StatusPill neutral con `Sparkles`) si aplica.

**ParaFooter** — fila 32 bajo el textarea: izquierda `{n} caracteres` mono `--fs-xs` (+ " · un poco corta" `--warn`) · "Guardado" (`Check` 12 `--text-3`, aparece 1.5s tras cada guardado) · a continuación (gap 16, sin alineación a la derecha) "Ir a Evaluar →" ghost sm.

**CoachPanel (riel Parafrasear)** — secciones (hairlines):
1. Estado: pill de conexión (StatusPill neutral: "Automático" `Radio` / "Pausa" `Pause` / "Actualizando" spinner / "Error" `AlertCircle` `--danger`) + texto de estado `--fs-sm` `--text-2`; debajo, **DebounceRing** cuando corresponde: anillo SVG 20px (trazo 2, `--text-3` fondo `--line`, progreso `--text-1`) + "Revisar ahora · {s}s" (ghost sm, dispara ya) + "Detener" (ghost sm `Square`, "Esc"); tras detener, "Revisión detenida" `--fs-xs` `--text-3` 1.4s (`aria-live`).
2. Puntaje de entrenamiento: eyebrow "PUNTAJE DE ENTRENAMIENTO" · `ScoreValue` lg · riel · detalle ("Profundidad extra" / "Superficie cubierta" / "Cobertura en progreso").
3. Foco: eyebrow "AHORA" / "PARA PROFUNDIZAR" · texto `--fs-sm` 500 `--text-1` · detalle markdown `--fs-sm` `--text-2` (colapsado a 4 líneas con "Ver más"); estado obsoleto (esperando/revisando): opacidad .56 + `aria-busy`.
4. Superficie: eyebrow "SUPERFICIE" + `c/t` mono + resumen (INF-129); dos grupos "Paso a paso" / "Trade-offs y errores", filas de mín. 28 con icono de cobertura DESIGN §1.4 + texto `--fs-sm` completo (sin truncar, sin tooltip).
5. "✓ Superficie esencial cubierta" (aviso éxito) cuando aplica; progreso de la petición (LiveRequestFeedback: spinner 12 + fase + detalle + chars + "x.x s") mientras corre; error + "Reintentar".
6. Historial: `‹` "Iteración i de n" / "Borrador actual" `›` + "Volver a la versión actual"; gráfico compacto (288×120, mismos tokens de DESIGN §1.7, sin leyenda: tooltip por punto); fecha de la iteración vista.

**EvalActionRow** — titular `--fs-lg` 600 "Evaluación completa" + debajo estado del borrador `--fs-sm` `--text-2` + link "Editar en Parafrasear →"; primario `--ctl-lg` "Evaluar borrador" (`min-width` 184, icono `Scale`) en la misma fila, inmediatamente después del bloque de texto (`justify-content:flex-start`, gap 24; el bloque de texto es `max-content` con `max-width` 420, así el botón nunca queda a más de 24px de su contexto).

**ProgressLoader** — barra de tiempo 4px ancho completo (`--surface-inset`, relleno `--timebar-fill`, marca esperada DESIGN §1.8); fila: fase `--fs-sm` 500 + tiempo mono `--fs-xs` `--text-3` + chars; "Cancelar" secundario sm a continuación de la fila de texto.

**StreamingPreview** — misma geometría que el resultado (Scorecard + Desglose + secciones), con valores provisionales (DESIGN §1.8) y esqueletos de igual tamaño; pill "Provisional".

**Scorecard** — sin caja: fila 40: `ScoreValue` lg (`--fs-3xl` + `/120` `--fs-xl`) + StatusPill; veredicto `--fs-md` 500 `--text-1` (2 líneas); riel lg (8) con etiquetas bajo la pista: "0" (izq.), "100 · base suficiente" (centrada en la marca), "120 · excelencia" (der.) `--fs-xs` `--text-3`; explicación `--fs-sm` `--text-2`; completitud `--fs-sm` con icono. Aviso de versión anterior (warn) debajo.

**NextFocus** — eyebrow "PRÓXIMO FOCO" / "PROFUNDIZACIÓN OPCIONAL" · título `--fs-lg` 600 · cuerpo `--fs-md` `--text-2` (clamp 2 líneas) · revisión `--fs-sm` con `CornerDownRight` 16 (clamp 1 línea) + botón ghost sm "Ver más" al final de esa línea si hay texto recortado (expande ambos; `aria-expanded`).

**RubricRows** — cabecera "Desglose del puntaje" `--fs-lg` 600 + "100 = base suficiente · 120 = excelencia" `--fs-xs` `--text-3`; 4 filas de 44 (`<button aria-expanded>`): label `--fs-sm` 500 · `v/120` mono · "{s}/{m} base" `--fs-xs` `--text-3` · `ChevronDown` · riel sm debajo; expandida: nota `--fs-sm` `--text-2` (título "Qué significa este resultado").

**AnalysisDetails / AnswerDetails** — `<details>` con summary 40 (`--fs-sm` 600 + conteo "{n} observaciones" `--text-3` + chevron); contenido con subtítulos `--fs-sm` 600 y listas; gaps con marcador de severidad DESIGN §1.4; correcciones como cita (borde izq. 2px `--line-strong`) + corrección.

**EvalActions** — fila al pie: "Retomar en Parafrasear" (secundario, `PenLine`) · "← Card anterior" (ghost) · "Siguiente card →" (secundario) — agrupados a la izquierda con gap 8.

**AttemptChart** — 680×214 (se adapta al ancho con viewBox), DESIGN §1.7; cada punto es un `<g role="button" tabindex="0">` con área de impacto transparente de 24×24 (móvil: 44×44; si dos áreas se solapan, gana el punto más cercano al puntero) alrededor del marcador visible (8px), `aria-label` INV §14, foco visible = círculo r 10 trazo 2 `--accent`; cursor en el punto seleccionado; leyenda al pie con formas.

**AttemptsList (riel Evaluar)** — filas 56 (`<button>`, seleccionada con estilo seleccionado): "Evaluación i" `--fs-sm` 500 + `ScoreValue` sm a la derecha; línea 2 `--fs-xs` `--text-3`: fecha es-AR corta · duración · modelo (`routedVia || model`; "pedido: {model}" en tooltip si difiere). Pie: "{n} checkpoints de coaching" `--fs-xs`.

**FlashCard (grid)** — `--surface-1`, borde `--line`, `--r-lg`, padding 16, alto 216 fijo: meta (categoría con punto + `#pp`) · título `--fs-md` 600 (2 líneas) · resumen `--fs-sm` `--text-2` (2 líneas) · estado (StatusPill o "IA en progreso" con spinner, + "Con IA" `Sparkles`) · riel sm · pie: CTA secundario sm "Practicar recuerdo"/"Revisar mi explicación" (máx. 184) + icon button ghost 28 `ArrowUpRight` (`aria-label`/tooltip "Estudiar card completa") → ≤ 220px, cabe en el ancho útil mínimo de 248 (280 − 32). Grid `minmax(280px,1fr)` gap 12. Destacada ("Al azar"): estilo seleccionado 2s + scroll a la vista.

**FlashDialog** — D.3; cabecera 56 (padding 0×20, hairline): punto + categoría · "Card i de n" mono · racha (`Flame` 16 + n, solo práctica) · StatusPill · cerrar. Cuerpo padding 32 (móvil 20); frente y dorso se apilan en la misma celda de grid (`grid-area: 1/1`), de modo que el alto del cuerpo = el mayor de los dos (mín. 360); si supera `88vh − 56 − 64`, el cuerpo scrollea en Y (la cara visible); frente = eyebrow "PREGUNTA DE REPASO" + pregunta serif `--fs-5xl` + primario "Revelar respuesta" + kbd "Espacio"; dorso = secciones (DESIGN lectura) con botones "Escuchar" ghost sm. Volteo: `rotateY` 180° `--dur-flip` con `backface-visibility:hidden` (reduced-motion: fundido). Pie 64 (padding 0×20, hairline; móvil: 2 filas, navegación arriba y calificación abajo, 112 + safe-area): `‹` icon 32 · "i/n" mono · `›` · (práctica y volteada) "¿Cómo lo recordaste?" + 4 botones secundarios sm con kbd "1 Otra vez", "2 Difícil", "3 Bien", "4 Fácil" · "Estudiar card completa" ghost.

**BandCard (Progreso)** — `--surface-1`, borde `--line`, `--r-lg`, padding 20: eyebrow etapa ("NIVEL I") + estado a la derecha (`CheckCircle2` `--mastery` "Nivel completo" / `CircleDashed` `--text-2` "En progreso" / `Lock` `--text-3` "Base pendiente") · label `--fs-sm` 600 + `%` `--fs-lg` mono · riel sm (relleno `--rail-base` o `--mastery` al 100%) · "{d}/{t} cards · {k} milestones" `--fs-xs` · "Requiere: {band}" `--fs-xs` `--text-3` · chips de milestones (pill neutral; completo: `Check` 12 + texto `--text-1`) · descripción `--fs-sm` `--text-2`. Grid 2×2 (≥ 1440: 4 columnas).

**MilestoneRow** — fila 64, hairline: label `--fs-sm` 600 + descripción `--fs-xs` `--text-2` (1 línea) · riel sm 160 · `d/t` mono · `%` mono · estado (`Check` "Completo").

**SettingsDrawer** — cabecera 56 (título `--fs-lg` 600 + subtítulo `--fs-xs` `--text-2` en 2 líneas; acciones a la derecha del título dentro de 480) · cuerpo scroll · secciones con eyebrow. Filas de conexión 56: contenedor `<div role="listitem">` (no botón) con tres hermanos: botón principal (label + modelo; activa la conexión o abre el editor si está incompleta) + icon buttons 28 `Pencil` "Editar {label}" y `Trash2` "Eliminar {label}" (visibles en hover/foco-dentro y siempre en táctil). Filas de catálogo 48: glifo 28 (inicial sobre `--pill-neutral` `--r-sm`) + label + descripción 1 línea + badge de disponibilidad (StatusPill neutral; "Requiere adaptador" con `Lock`) + `ChevronRight`. Editor: formulario D.5 en columna, acciones al pie sticky (hairline, padding 16): "Probar modelo" secundario · "Guardar" secundario · "Guardar y usar" primario. Estado de prueba como aviso inline DESIGN §1.4.

**CommandPalette** — input `--ctl-lg` 40 sin borde (icono `Search` 16, placeholder `--text-3`, kbd "Esc" a la derecha); hairline; resultados con grupos (eyebrow 28) y filas 40 (`--r-md`): icono 16 (acción) o `#p` mono (card) · label `--fs-sm` 500 · meta `--fs-xs` `--text-3` (categoría · resumen ellipsis) · `CornerDownLeft` 12 en la fila activa. Fila activa: estilo único de opción activa (D.5). La paleta busca en **todo** el grafo (ignora el foco activo) y muestra la categoría en la meta. Pie 32: atajos `--fs-xs` + "{n} resultados". Máx. 8 acciones + 50 cards visibles (virtualización innecesaria a este tamaño).

**HUD** — colapsado: alto `--ctl-lg` (40; móvil 48), `--r-lg`, padding 0×12: `Sparkles` 16 pulsante + label/resumen `--fs-sm` 500 ellipsis + chars mono `--fs-xs` + `ChevronUp`; expandido (`--r-xl`, padding 4): cabecera 40 "Tareas en segundo plano (n)" + cerrar; filas (`--r-lg`, padding 12): tipo `--fs-xs` (`BrainCircuit` "Mentor · iteración n" / `Scale` "Evaluación") + `n/100` · label `--fs-sm` 500 · mensaje `--fs-sm` `--text-2` + "({chars} caracteres)" · acciones ghost sm "Abrir card" y destructivo sm "Cancelar". Se expande por click (no por hover: evita aperturas accidentales) y con Enter.

**Retorno de foco con overlays reemplazados**: si el elemento que abrió un overlay ya no existe o quedó `inert` (p. ej. la paleta cerró un diálogo al abrirse), el foco vuelve al título de la vista activa (`h1` de la vista o título compacto de la sesión, ambos `tabindex=-1`).

**Toast / Notice / Skeleton / EmptyState** — DESIGN §5.1, §1.4, §1.8. EmptyState: icono 20 `--text-3` en círculo `--pill-neutral` 40 · titular serif `--fs-xl` · texto `--fs-sm` `--text-2` (máx. 48ch) · 1 primario; centrado en su región, padding 48.

**ConfirmDialog** — título `--fs-lg` 600, cuerpo `--fs-sm` `--text-2`, pie: "Cancelar" (secundario, foco inicial) + acción (primario o destructivo-relleno: `--danger` fondo con texto `--text-on-paper` para "Reemplazar datos"). Usos: importar respaldo ("Importar respaldo" — "Esto reemplaza tu progreso, borradores y conexiones actuales por los del archivo. El archivo incluye API keys si se exportaron con esta versión. ¿Continuar?"), eliminar todas las conexiones.

### D.10 Vistas coordinadas

| Vista A | Vista B | Sincronización |
|:--|:--|:--|
| Foco (sidebar / hoja) | Lista, Grafo, Ruta, Flashcards | Un único `focusCategory` en el store; cambia los cuatro a la vez; la ruta se recalcula. La paleta **no** filtra por foco |
| Lista | Grafo | Comparten `lastOpenedNodeId`: al volver de una card, la vista activa hace scroll/encuadre a ese nodo y lo resalta 1.2s |
| Sesión: etapa | Riel | El riel renderiza el contenido de la etapa activa (B.5) |
| Evaluar: gráfico | Lista de intentos + Scorecard | `selectedAttemptId` único: click en punto o fila → scorecard muestra ese intento; el índice del gráfico se resuelve por `id`, nunca por posición (corrige INV §22.20) |
| Parafrasear: historial | Editor + panel | `viewIteration` → editor en solo lectura con ese texto y el panel con esa revisión; "Volver a la versión actual" restablece |
| Gráfico de Parafrasear (punto de evaluación) | 04 Evaluar | Selecciona ese intento y cambia de etapa |
| Tareas (backgroundTaskManager) | HUD, pestañas 02/04, nodos, cards, flashcards, chip de tarea | Suscripción única (`useSyncExternalStore`); todos los indicadores derivan del mismo snapshot |
| Paleta | Mapa / Sesión | Ejecutar una card abre la sesión (recordando la card actual si había una abierta) |
| Flashcards: "Practicar en Parafrasear" | Sesión | Abre la card directamente en 03 Parafrasear (corrige INV §22.29) |
| Evaluar: intento mostrado | — | Por defecto el intento representativo (`selectRepresentativeAttempt`, tolerancia 5); al llegar un resultado nuevo se selecciona el nuevo y el riel anima su puntaje |

### D.11 Movimiento por componente

| Componente | Entrada | Salida |
|:--|:--|:--|
| Sesión de estudio | opacidad + `translateY(var(--move-2))`, `--dur-3` | opacidad, 168ms |
| Drawer / hoja lateral | `translateX(16px)` + opacidad, `--dur-3` | 170ms |
| Hoja inferior | `translateY(24px)` + opacidad, `--dur-3` | 170ms |
| Diálogo / paleta | `scale(.98)` + opacidad, `--dur-2` | 130ms |
| Popover / tooltip | opacidad + `translateY(4px)`, `--dur-2` / `--dur-1` | 130 / 85ms |
| Indicador de pestaña | desliza entre pestañas (`transform`), `--dur-2` `--ease-in-out` | — |
| Riel de puntaje | ancho de segmentos 0 → valor, 480ms `--ease-out` solo al aparecer un resultado nuevo | — |
| Volteo de flashcard | `--dur-flip` | — |

Distancias como tokens (definidos en G): `--move-1` 4px, `--move-2` 8px, `--move-3` 16px, `--move-4` 24px; salidas = `calc(var(--dur-n) * .7)`. En la tabla: sesión `--move-2`, drawer `--move-3`, hoja `--move-4`, popover `--move-1`. Todo movimiento se reduce a opacidad con `prefers-reduced-motion`.
