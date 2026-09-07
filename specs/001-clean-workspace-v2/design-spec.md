# Visual Design Specification & Blueprint: Clean Learning Workspace V2

**Feature**: `001-clean-workspace-v2`  
**Standard**: [docs/DESIGN_CRITERIA.md](../../docs/DESIGN_CRITERIA.md)  
**Workflow Reference**: [docs/VISUAL_WORKFLOW.md](../../docs/VISUAL_WORKFLOW.md)  
**ADR Reference**: [ADR 0010 — Spec-Driven Visual Design Engineering](../../docs/adr/0010-spec-driven-visual-design-and-continuous-review-workflow.md)  
**Status**: Approved & Formalized Blueprint  

---

## 1. Postura Estética y Tesis Visual

La interfaz de Learning Workspace V2 adopta una estética **Dark Engineering Editorial** (inspirada en Linear, Raycast y Vercel). Diseñada específicamente para ingenieros de software que se preparan para entrevistas Staff/Senior, prioriza la **densidad controlada** (*Controlled Density*), la claridad tipográfica y la economía cromática sobre adornos superfluos.

### Principios Fundamentales (Anti-AI-Slop):
1. **Densidad Controlada vs. Aire Muerto**: Cero cajas huecas con $>40\text{px}$ de vacío. Cada componente presenta sustancia real (micro-resúmenes, métricas tabulares, badges contextuales).
2. **Superficies Integradas (Anti-Carditis / Cero Div Soup)**: Se erradica el anidamiento de cajas flotantes dentro de modales o paneles con borde. La división de secciones se logra mediante escala tipográfica, espaciado proporcional y reglas divisorias sutiles (`1px solid var(--border-line)`).
3. **Anclas Cromáticas Semánticas**: El color asignado a cada categoría curricular (cian, ámbar, violeta, esmeralda, rosa, índigo) es **inmutable**. Ningún estado de progreso o maestría puede sobreescribir el color de categoría de una tarjeta. Las distinciones de maestría (100+) se expresan mediante badges afilados (`★ 120/120`).
4. **Tipografía de Grado de Ingeniería**: Uso riguroso de fuentes monoespaciadas y números tabulares (`font-variant-numeric: tabular-nums`) para todas las métricas, conteos y ratios.
5. **Acción y Contexto Acoplados (Ley de Fitts)**: Prohibidos los cañones horizontales de vacío generados por `space-between` en contenedores anchos (>350px de aire muerto). Los CTAs deben acoplarse visualmente al elemento que activan.
6. **Descubribilidad Absoluta (Anti-Hidden-Affordance)**: En escritorio, el 100% de las categorías y filtros deben ser visibles y seleccionables de inmediato. Prohibido esconder navegación bajo scrolls horizontales con ratón.

---

## 2. Sección A: Matriz de Inventario Exhaustivo de Información (Data & Affordance Manifest)

Esta matriz inventaria **cada dato, métrica, estado y acción interactiva** exigida por `specs/001-clean-workspace-v2/spec.md` para todas las User Stories (US1 a US7). Constituye el contrato de datos obligatorio que la interfaz debe manifestar visualmente.

| ID Ítem | User Story | Elemento / Pieza de Información | Tipo de Elemento | Estados de Datos Requeridos | Referencia Spec |
|:---|:---|:---|:---:|:---:|:---|
| **INF-01** | US1 | Identidad de Producto (`⚡ Learning Workspace` + badge `V2`) | Branding / Badge | Nominal | US1 Scen 1 |
| **INF-02** | US1 | Conmutador de Grafo Curricular (`React` \| `Rails`) | Segmented Toggle | Nominal (React activo / Rails activo) | US1 Scen 2 |
| **INF-03** | US1 | Conmutador de Vista Principal (`Grafo` \| `Flashcards`) | Segmented Toggle | Nominal | US1 Scen 1, US6 Scen 1 |
| **INF-04** | US1 | Métrica Global de Progreso Curricular (`[N / Total (X%)]`) | Texto tabular mono | Empty (0%), Populated, Boundary (100%) | US1 Scen 1 |
| **INF-05** | US1 | Micro-Barra Global de Progreso | Progress Bar SVG | Empty (0w), Populated, Boundary (100w) | US1 Scen 1 |
| **INF-06** | US1 | Disparador de Command Palette (`Buscar Ctrl+K`) | Botón interactivo | Nominal | US1 Scen 4 |
| **INF-07** | US1 | Disparador de Configuración BYOK (`⚙️ BYOK`) | Botón interactivo | Nominal / Indicador de estado | US1 Scen 4, US5 Scen 1 |
| **INF-08** | US1 | Disparador de Drawer de Seniority (`📊 Seniority`) | Botón interactivo | Nominal | US1 Scen 6 |
| **INF-09** | US1 | Badge de Próximo Desafío (`🎯 PRÓXIMO DESAFÍO`) | Badge contextual | Nominal / Focus activo | US1 Scen 1, 3 |
| **INF-10** | US1 | Prioridad Topológica del Desafío (`p#1`, `p#2`, `p#3`) | Pill badge cian/ámbar | 3 niveles de recomendación | US1 Scen 7 |
| **INF-11** | US1 | Título del Concepto Recomendado | Encabezado semi-bold | Dinámico según grafo y filtro | US1 Scen 1, 3 |
| **INF-12** | US1 | Botón CTA Principal de Estudio (`Estudiar ahora →`) | Botón primario cian | Hover, Focus, Active | US1 Scen 1 |
| **INF-13** | US1 | Contador de Conceptos Visibles (`N conceptos`) | Texto secundario | Filtrado vs. Total | US1 Scen 1, 3 |
| **INF-14** | US1 | Conmutador de Disposición (`⊞ Cuadrícula` \| `☊ Topología SVG`) | Segmented Toggle | Nominal | US1 Scen 9 |
| **INF-15** | US1 | Etiqueta de Sección de Filtros (`FILTRO`) | Label terciario uppercase| Estático | US1 Scen 3 |
| **INF-16** | US1 | Chip Maestro de Taxonomía (`Todos (N)`) | Pill interactivo | Activo (resaltado) / Inactivo | US1 Scen 3 |
| **INF-17** | US1 | Chips de Categorías Curriculares (Nombre + Conteo) | Pills con color inmutable| Activo (borde acento) / Inactivo | US1 Scen 1, 3 |
| **INF-18** | US1 | Tarjeta de Concepto: Barra de Acento Semántico | Borde vertical 3px | Inmutable según `categoryColor` | US1 Scen 1 |
| **INF-19** | US1 | Tarjeta de Concepto: Título del Concepto | Texto semi-bold 13.5px | Nominal | US1 Scen 1 |
| **INF-20** | US1 | Tarjeta de Concepto: Indicador de Tarea en Curso | Dot pulsante esmeralda | Activo (streaming) / Inactivo | US1 Scen 1, US3 Scen 1 |
| **INF-21** | US1 | Tarjeta de Concepto: Micro-Resumen Conceptual | Texto 2 líneas clamped | Nominal (`lesson.summary`) | US1 Scen 1 |
| **INF-22** | US1 | Tarjeta de Concepto: Puntaje de Maestría / Estado | Pill tabular mono | `★ 120/120` oro, `100` verde, `<100`, `Pendiente` | US1 Scen 1, 6 |
| **INF-23** | US1 | Tarjeta de Concepto: Alerta de Prerrequisitos / Prioridad | Pill secundario | `⚠️ N prereqs` o tag `p#N` | US1 Scen 1 |
| **INF-24** | US1 | Seniority Bands (4 Niveles de Carrera) | Lista con barras y badges | React Prof, Sr Frontend, Sr Design, Lead | US1 Scen 6 |
| **INF-25** | US1 | Hitos Curriculares (7 Milestones con descripción) | Cards con barra progreso | 0% a 100% de completitud | US1 Scen 6 |
| **INF-26** | US1 | Lienzo DAG Topología SVG con Curvas Bézier | SVG Canvas interactivo | Nodos, flechas direccionales, zoom | US1 Scen 8, 9 |
| **INF-27** | US1 | Controles Flotantes de Pan & Zoom (+, -, Reset) | Panel de botones flotante| Activo / Arrastre > 5px | US1 Scen 8 |
| **INF-28** | US1 | Command Palette: Input de Búsqueda con Atajos | Modal tipo Spotlight | Vacío, Con resultados, Sin resultados | US1 Scen 4 |
| **INF-29** | US1 | Command Palette: Acciones Globales Rápidas | Lista interactiva | Flashcards, Seniority, BYOK Settings | US1 Scen 4 |
| **INF-30** | US2 | Modal de Estudio: Barra de 4 Pestañas | Tab bar 42px flexShrink 0 | `01 Leer`, `02 Aprender`, `03 Parafrasear`, `04 Evaluar` | US2 Scen 1, 5 |
| **INF-31** | US2 | Modal de Estudio: Navegación Antes → Ahora → Después | Breadcrumb interactivo | Nodos previos y siguientes con botón volver | US2 Scen 6 |
| **INF-32** | US2 | Modal de Estudio: Botón Modo Zen | Toggle de pantalla completa | Normal vs. Inmersivo 100vw×100vh | US2 Scen 7 |
| **INF-33** | US2 | Etapa 01: Resumen Editorial (`📌 EN UNA FRASE`) | Tesis técnica 15px bold | Nominal | US2 Scen 1 |
| **INF-34** | US2 | Etapa 01: Justificación de Arquitectura (`Por qué importa`) | Texto enmarcado sutil | Nominal | US2 Scen 1 |
| **INF-35** | US2 | Etapa 01: Glosario Deep-Dive Interactivo (`?`) | Badge flotante + Popover | Cerrado / Abierto con explicación de bajo nivel | US2 Scen 2 |
| **INF-36** | US2 | Etapa 01: Comparativa de Código (`Naive` vs `Senior`) | Code diff con pestañas | Enfoque ingenuo vs. Patrón Senior con trade-off | US2 Scen 1 |
| **INF-37** | US2 | Etapa 01: Acordeón de Preguntas FAANG | Lista con estado de bloqueo| Desbloqueada vs. Bloqueada por prerrequisitos | US2 Scen 3 |
| **INF-38** | US2 | Etapa 01: Enlaces a Documentación Oficial y Fuentes | Links con icono `↗` | Enlaces externos validados | US2 Scen 4 |
| **INF-39** | US2 | Etapa 02: Chat con Tutor Socrático | Historial de mensajes | Mensajes usuario, respuestas socráticas IA | US2 Scen 8 |
| **INF-40** | US2 | Etapa 02: Chips de Pregunta Rápida (4 Temas) | 4 botones temáticos | Naive failure, Analogía, Producción, Código | US2 Scen 8 |
| **INF-41** | US2 | Etapa 02: Botón Integrar Síntesis en Respuesta | Botón CTA esmeralda | Transfiere síntesis a Etapa 03 con hash | US2 Scen 9 |
| **INF-42** | US2 | Etapa 03: Editor de Borrador de Parafraseo | Textarea con auto-guardado| Texto en tiempo real guardado en localStorage | US2 Scen 10 |
| **INF-43** | US2 | Etapa 03: Botón de Dictado por Voz | Botón interactivo micrófono| Inactivo, Escuchando (pulsando), No soportado | US2 Scen 10 |
| **INF-44** | US2 | Etapa 03: Conmutador `[✏️ Editor | 📖 Reading Chunks]` | Segmented Toggle | Modo editor vs. Modo análisis de chunks | US2 Scen 11 |
| **INF-45** | US2 | Etapa 03: Métricas de Densidad Léxica y Chunks | Panel analítico tabular | Párrafos, oraciones, palabras clave densas | US2 Scen 11 |
| **INF-46** | US2 | Etapa 03: Contador de Caracteres con Alerta de Profundidad| Texto tabular mono | `<140` chars: *"muy breve"*, `≥140`: habilitado | US2 Scen 12 |
| **INF-47** | US2 | Etapa 04: Loader de Evaluación con Cronómetro | Panel de progreso streaming | Segundos transcurridos, estado latencia, caracteres | US2 Scen 13 |
| **INF-48** | US2 | Etapa 04: Botón Cancelar Evaluación en Progreso | Botón de aborto limpio | Cancela SSE connection sin errores | US2 Scen 13, US3 Scen 3 |
| **INF-49** | US2 | Etapa 04: Switcher Histórico de Intentos (Time-Travel) | Barra de paginación | `← Intento N de M →` con retorno a actual | US2 Scen 15 |
| **INF-50** | US2 | Etapa 04: Aviso de Desfase de Versión de Contenido | Callout de advertencia | *"Evaluación corresponde a versión anterior..."* | US2 Scen 16 |
| **INF-51** | US2 | Etapa 04: Scorecard Ejecutivo (Puntaje Display + Sparkline)| Panel 2 columnas | Puntaje `120/120` + SVG Sparkline histórico | US2 Scen 14 |
| **INF-52** | US2 | Etapa 04: Veredicto de Staff Engineer | Cita editorial destacada | Veredicto analítico de alto nivel | US2 Scen 14 |
| **INF-53** | US2 | Etapa 04: Grilla de Rúbrica 2x2 (4 Dimensiones) | Grilla de 4 celdas | Precisión, Causalidad, Aplicación, Completitud | US2 Scen 14 |
| **INF-54** | US3 | HUD Global de Tareas en Segundo Plano | Panel flotante inferior der| Oculto si vacío, streaming en vivo, contador chars | US3 Scen 1, 2 |
| **INF-55** | US3 | Lista Desplegable de Tareas HUD | Popover flotante | `Abrir tarjeta →`, `Cancelar ✕` | US3 Scen 2, 3 |
| **INF-56** | US4 | Botón Maestro de Lectura Asistida por Voz (TTS) | Botón en cabecera etapa 01 | `🔊 Escuchar` / `⏸️ Pausar` | US4 Scen 1, 2 |
| **INF-57** | US4 | Resaltado Visual Sincronizado de Oración en Audio | Párrafo activo pulsante | Borde y fondo cian sutil mientras se narra | US4 Scen 1 |
| **INF-58** | US5 | Modal BYOK: Selector de Proveedores de IA | Pestañas de chips | OpenRouter, OpenAI, Groq, Ollama, etc. | US5 Scen 1 |
| **INF-59** | US5 | Modal BYOK: Input de API Key y Selector de Modelo | Formulario con máscara | Guardado local seguro (`safeStorage` / storage) | US5 Scen 1 |
| **INF-60** | US5 | Modal BYOK: Botón de Prueba de Conexión | Botón interactivo | Estado probing, Éxito, Error con mensaje | US5 Scen 1 |
| **INF-61** | US5 | Exportación / Importación de Respaldo JSON | Acciones de archivo | Exportar archivo fechado / Importar con validación | US5 Scen 2, 3 |
| **INF-62** | US6 | Vista de Flashcards: Filtros de Maestría | Selector de filtros | `Todos`, `Pendientes`, `Base <100`, `Maestría 100+` | US6 Scen 1 |
| **INF-63** | US6 | Tarjeta Flashcard: Anverso (Pregunta de Entrevista) | Card con rotación 3D | Pregunta, badge de categoría, hint de volteo | US6 Scen 2 |
| **INF-64** | US6 | Tarjeta Flashcard: Reverso (Respuesta Técnica Clave) | Card reverso con marco cian| Respuesta arquitectónica + botón `Estudiar tarjeta →`| US6 Scen 2, 3 |
| **INF-65** | US7 | Barra Móvil Inferior Fija (`mobile-bottom-nav`) | Tab bar fija en zona pulgar| 5 accesos: Grafo, Flashcards, Progreso, Buscar, Ajustes| US7 Scen 1 |
| **INF-66** | US7 | Padding de Seguridad para Safe Area Móvil | Contenedor con offset | `padding-bottom: 70px + env(safe-area)` | US7 Scen 1 |

---

## 3. Sección B: Matriz de Agrupación, Jerarquía y Arquitectura de Superficies

Para erradicar la fragmentación visual (*Carditis / Div Soup*) y el aire muerto ($>40\text{px}$), los 66 ítems del inventario se agrupan en **organismos cohesivos con superficie unificada**:

| Organismo / Contenedor | Ítems Asignados | Superficie y Jerarquía | Principio Anti-Carditis Aplicado |
|:---|:---|:---|:---|
| **AppHeader** (Macro) | INF-01 a INF-08 | Superficie fija superior de 52px con backdrop-blur (`rgba(10, 15, 29, 0.85)`). Jerarquía Primaria. | Cero cajas flotantes. Divisores verticales sutiles de 1px entre conmutadores y métricas. |
| **CockpitControlDeck** (Macro) | INF-09 a INF-17 | Superficie unificada de 2 filas continuas (~96px). Fila 1: Acción y foco; Fila 2: Taxonomía y filtros. | Se fusionan el banner de próximo desafío y la barra de filtros en un solo panel continuo, eliminando el apilamiento de dos cajas separadas. |
| **Canvas de Conceptos** (Lienzo) | INF-18 a INF-23 | Grid responsiva fluida (`repeat(auto-fill, minmax(280px, 1fr))`) o SVG DAG. | Tarjetas técnicas unificadas. Cero cajas internas decorativas; título, resumen y pie se separan por tipografía y una línea horizontal de 1px. |
| **SeniorityProgressPanel** (Drawer) | INF-24, INF-25 | Drawer lateral deslizable de 420px con scrollbar ultrafina. | Las bandas de seniority e hitos se despliegan en una lista estructurada con barras de progreso integradas, sin encapsular cada hito en tarjetas separadas con borde. |
| **CommandPalette** (Modal) | INF-28, INF-29 | Modal centrado estilo Spotlight (maxWidth 580px). | Input sin borde tosco, lista de resultados limpia con atajos `Enter`/`Esc`. |
| **StudyModal Maestro** (Modal) | INF-30 a INF-32 | Ventana modal de 880px centrada (o 100vw en Zen Mode). Header 52px + TabBar 42px blindados con `flexShrink: 0`. | Marco unificado. Contenedor de contenido con `flex: 1, minHeight: 0, overflowY: auto`. Scrollbar invisible. |
| **ReadStage** (Micro) | INF-33 a INF-38, INF-56, INF-57 | Superficie continua de lectura editorial. Jerarquía tipográfica calibrada. | Cero "caja dentro de caja". Tesis, justificación, comparativa y acordeón FAANG residen en el mismo plano blanco-sobre-oscuro. |
| **LearnStage** (Micro) | INF-39 a INF-41 | Panel interactivo de diálogo con micro-chips. | Historial conversacional limpio con chips de quick-prompt compactos y CTA de integración al borrador. |
| **ParaphraseStage** (Micro) | INF-42 a INF-46 | Área de redacción amplia con barra de estado inferior. | Textarea sin bordes gruesos, contador monoespaciado en línea con el botón de dictado y el toggle de chunks. |
| **EvaluateStage** (Micro) | INF-47 a INF-53 | Executive Scorecard: Cabecera 2 columnas + Grilla 2x2. | Toda la rúbrica visible en un solo vistazo sin scrollbar forzada. Puntaje display con SVG sparkline integrado. |
| **GlobalTasksHud** (Micro) | INF-54, INF-55 | Píldora flotante compacta (34px alto) en esquina inferior derecha. | Cero interferencia con el canvas. Al pulsar abre overlay mínimo con acciones inmediatas. |
| **ProviderModal** (Modal) | INF-58 a INF-61 | Modal de configuración de 540px con secciones por divider. | Chips compactos para selección de proveedor, inputs con focus-ring fino, sección de backup sin marcos dobles. |
| **FlashcardGrid & Card** (Lienzo) | INF-62 a INF-64 | Grid de flashcards 3D con perspectiva `1000px`. | Las tarjetas aprovechan el volteo 3D sin inflar su altura. El anverso y reverso comparten dimensiones exactas. |
| **MobileBottomNav** (Macro Móvil) | INF-65, INF-66 | Barra inferior fija de 60px visible solo en viewport $\le 768\text{px}$. | Ubicada en la zona accesible del pulgar (*Thumb Zone*). Reemplaza controles de cabecera en móvil. |

---

## 4. Sección C: Matrices de Evaluación Comparativa Estructural y Trade-offs (Landscape/Desktop vs. Portrait/Mobile)

A continuación se formaliza el análisis divergente de opciones de disposición para cada organismo clave, comparando las soluciones para **Landscape (Desktop 1440×900)** y **Portrait (Mobile 390×844)** frente a criterios objetivos de diseño de producto.

---

### Organismo 1: Taxonomía Curricular y Filtros de Categoría (INF-15, INF-16, INF-17)

#### A. Evaluación en Landscape (Desktop 1440×900)
- **Desafío**: Mostrar entre 8 (React) y 10 (Rails) categorías con sus conteos y colores semánticos inmutables sin ocultar opciones ni consumir altura excesiva.
- **Opciones Estructurales**:
  1. *Opción A: Cinta Horizontal de una Fila con Desplazamiento (`white-space: nowrap; overflow-x: auto`)*:
     - *Densidad Vertical*: Excelente (~32px de altura).
     - *Escalabilidad ante N ítems*: Pobre. En 1440px solo entran 5 o 6 categorías; 40% quedan decapitadas a la derecha.
     - *Descubribilidad*: **Inaceptable (Affordance Oculta)**. Obliga al usuario de ratón a desplazarse lateralmente a ciegas para saber qué temas existen.
     - *Ergonomía de Puntero*: Pésima; los ratones estándar no tienen rueda horizontal.
     - *Veredicto Desktop*: **RECHAZADA**.
  2. *Opción B: Menú Selector Desplegable / Dropdown (`[ 🏷️ Categoría: Todas ▾ ]`)*:
     - *Densidad Vertical*: Excelente (~32px).
     - *Escalabilidad*: Alta.
     - *Descubribilidad*: Pobre. Oculta la riqueza visual de los colores temáticos detrás de una interacción obligatoria de clic.
     - *Carga Cognitiva*: Aumenta la fricción para explorar el temario.
     - *Veredicto Desktop*: **RECHAZADA**.
  3. *Opción C: Matriz Auto-Envolvente Compacta (`flex-wrap: wrap; gap: 6px`)*:
     - *Densidad Vertical*: Muy buena. Con tipografía de 11px y micro-padding (`3px 8px`), las 10 categorías ocupan exactamente 2 filas compactas (~50px de altura).
     - *Escalabilidad*: Excelente; aloja hasta 14 categorías sin exceder 75px.
     - *Descubribilidad*: **100% Óptima**. Todas las categorías y sus colores están visibles al primer vistazo. Cero scrolls laterales.
     - *Ergonomía de Puntero*: Óptima; selección en 1 solo clic directo en cualquier parte de la pantalla.
     - *Veredicto Desktop*: **SELECCIONADA (Ganadora)**.

#### B. Evaluación en Portrait (Mobile 390×844)
- **Desafío**: El ancho disponible es de solo 390px. Envolver 10 categorías consumiría 5 filas (~160px), empujando el contenido fuera del primer pliegue.
- **Opciones Estructurales**:
  1. *Opción A: Matriz Auto-Envolvente en Móvil*:
     - *Consumo de Viewport*: Devastador. Ocupa >30% de la altura de pantalla solo en filtros.
     - *Veredicto Mobile*: **RECHAZADA**.
  2. *Opción B: Carrusel Táctil Horizontal Single-Row (`flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch`)*:
     - *Densidad Vertical*: Óptima (consume solo 34px).
     - *Ergonomía Táctil*: Natural. El swipe horizontal con el pulgar es intuitivo y fluido en pantallas táctiles móviles.
     - *Descubribilidad*: Aceptable gracias a la máscara de desvanecimiento en el borde derecho que insinúa continuidad de contenido.
     - *Veredicto Mobile*: **SELECCIONADA (Ganadora)**.

- **Síntesis y "The Why"**: La solución es responsiva condicionada (`@media (max-width: 768px)`): **Wrap completo en escritorio** para garantizar 100% de descubribilidad visual sin affordances ocultas, y **Touch carousel horizontal de 1 fila en móvil** para proteger el pliegue vertical.

---

### Organismo 2: Cockpit Control Deck & Next Challenge Strip (INF-09 a INF-14)

#### A. Evaluación en Landscape (Desktop 1440×900)
- **Desafío**: Presentar el siguiente nodo recomendado por la orientación topológica, el botón de estudio, el conteo de conceptos y el selector de vista sin crear un "Layer Cake" de barras apiladas ni cañones de vacío `space-between`.
- **Opciones Estructurales**:
  1. *Opción A: Banner Independiente con `justify-content: space-between`*:
     - Crea un contenedor de 110px de altura donde el título está a la izquierda y el botón "Estudiar ahora" está a 800px a la derecha, dejando un cañón vacío negro en el medio. Debajo se apila otra barra para filtros (total >180px).
     - *Violación*: Invariante 1.1 (Layer Cake) e Invariante 1.3 (Action Canyon).
     - *Veredicto*: **RECHAZADA**.
  2. *Opción B: Cockpit Unificado Continuo de 2 Filas (`CockpitControlDeck.jsx`)*:
     - *Fila 1 (Foco y Acción)*: Badge `🎯 PRÓXIMO DESAFÍO` + prioridad `p#N` + Título del concepto + Botón CTA `Estudiar ahora →` fuertemente acoplados a la izquierda (gap 10px). A la derecha: Contador visible y selector de vista `[⊞ | ☊]`.
     - *Divisor*: Regla sutil de 1px (`rgba(255, 255, 255, 0.06)`).
     - *Fila 2 (Taxonomía)*: Filtro `Todos` + Chips de categorías auto-envolventes.
     - *Altura Total*: **~96px**, dentro de la Regla del 70% del Viewport ($\le 130\text{px}$).
     - *Veredicto Desktop*: **SELECCIONADA (Ganadora)**.

#### B. Evaluación en Portrait (Mobile 390×844)
- **Opciones Estructurales**:
  - En móvil, el Cockpit se compacta verticalmente: el badge de desafío y el título ocupan la primera micro-fila; el botón `Estudiar ahora →` se presenta en ancho completo con touch target de 44px; los filtros se ubican en la fila inferior en carrusel touch deslizable.
  - *Veredicto Mobile*: **SELECCIONADA (Ganadora)**.

---

### Organismo 3: Tarjetas de Concepto en el Lienzo (INF-18 a INF-23)

#### A. Evaluación de Opciones de Organización
- **Opciones Estructurales**:
  1. *Opción A: Tarjeta Minimalista (Solo Título y Badge)*:
     - *Ventaja*: Ocupa poco espacio vertical.
     - *Desventaja*: Cajas casi vacías con fondo oscuro uniforme. No brinda información sustancial sobre el contenido técnico. Parece un wireframe incompleto.
     - *Veredicto*: **RECHAZADA**.
  2. *Opción B: Tarjeta Bordeada en Colores de Maestría (Efecto Árbol de Navidad)*:
     - Pinta todo el borde exterior de la tarjeta en dorado/amarillo si el puntaje supera 100 y en verde si está aprobada.
     - *Violación*: Destruye el ancla semántica de color de la categoría curricular e hiper-satura la pantalla.
     - *Veredicto*: **RECHAZADA**.
  3. *Opción C: Tarjeta Técnica Editorial con Micro-Resumen y Acento Lateral (`GraphNode.jsx`)*:
     - Barra lateral vertical izquierda de 3px con el `categoryColor` original inmutable.
     - Cabecera con título semi-bold y dot de tarea activa.
     - Cuerpo con micro-resumen conceptual de 2 líneas (`lesson.summary` con line-clamp). Aporta sustancia cognitiva real (cero aire muerto).
     - Pie con divisor sutil de 1px: píldora tabular monoespaciada para puntaje (`★ 120/120` oro, `100/120` verde, `<100` cian, `Pendiente` gris) y alertas de prerrequisitos `⚠️ N prereqs`.
     - *Veredicto*: **SELECCIONADA (Ganadora)**.

---

### Organismo 4: Modal de Estudio - Etapa 01 Leer (INF-33 a INF-38, INF-56, INF-57)

#### A. Evaluación de Opciones de Organización
- **Desafío**: Presentar resumen en una frase, por qué importa, botón de audio TTS, explicación profunda con glosario, comparativa de código Naive vs Senior, y preguntas FAANG sin crear "Carditis" (cajas dentro de cajas) ni empujar el código fuera del primer pliegue.
- **Opciones Estructurales**:
  1. *Opción A: Cajas Flotantes Apiladas (Carditis Tradicional)*:
     - Una caja flotante con borde para la tesis, otra para el por qué importa, otra para el audio, otra para el código. Consume 350px antes de llegar a la primera línea de código.
     - *Violación*: Dimensión 1 (Integridad de Superficie) y Dimensión 2 (Densidad de Viewport).
     - *Veredicto*: **RECHAZADA**.
  2. *Opción B: Cabecera Editorial Integrada + Selector de Pestañas de Código*:
     - La tesis (`📌 EN UNA FRASE`) y el `Por qué importa` residen en la superficie unificada del modal, diferenciados únicamente por escala tipográfica (`15px` bold) y color tenue.
     - El botón de audio TTS `🔊 Escuchar` se acopla como un pill compacto en la esquina superior derecha del resumen (ahorro de 40px verticales).
     - La comparativa de código utiliza un selector segmentado `[Enfoque ingenuo | Patrón Senior]` en lugar de duplicar bloques verticalmente. El código aparece inmediatamente visible por encima del pliegue.
     - Los términos técnicos de bajo nivel tienen insignias discretas `?` que abren popovers de glosario in-situ sin navegación disruptiva.
     - *Veredicto*: **SELECCIONADA (Ganadora)**.

---

### Organismo 5: Modal de Estudio - Etapa 04 Evaluar (INF-47 a INF-53)

#### A. Evaluación en Landscape (Desktop 1440×900)
- **Desafío**: Mostrar el puntaje global (0-120), tendencia histórica, veredicto de Staff Engineer, y los 4 criterios de rúbrica detallados sin exigir scroll en un modal de 600px de altura útil.
- **Opciones Estructurales**:
  1. *Opción A: Lista Vertical Apilada de Criterios con Cajas Independientes*:
     - Requiere un scroll vertical continuo de más de 800px. Los criterios 3 y 4 quedan invisibles en la carga inicial.
     - *Veredicto*: **RECHAZADA**.
  2. *Opción B: Executive Scorecard con Cabecera a 2 Columnas y Grilla de Rúbrica 2x2*:
     - *Cabecera*: Columna izquierda con puntaje display gigante monoespaciado (`120 / 120`) + sparkline SVG histórico integrado; Columna derecha con cita de veredicto senior y borde cian vertical.
     - *Cuerpo*: Grilla 2x2 para las 4 dimensiones (`accuracy`, `causalityAndTradeoffs`, `application`, `completeness`), cada una con barra esmeralda/oro, puntaje tabular y notas expandibles.
     - *Viewport Fit*: El 100% de la información entra en el primer viewport del modal sin scroll forzado.
     - *Veredicto Desktop*: **SELECCIONADA (Ganadora)**.

#### B. Evaluación en Portrait (Mobile 390×844)
- En móvil, la grilla 2x2 colapsa fluidamente a 1 sola columna con notas colapsadas por defecto, manteniendo legibilidad óptima y touch targets amplios.
- *Veredicto Mobile*: **SELECCIONADA (Ganadora)**.

---

### Organismo 6: Navegación Móvil Inferior (INF-65, INF-66)

#### A. Evaluación Comparativa
- **Opciones Estructurales**:
  1. *Opción A: Menú Hamburguesa Superior*:
     - Esconde la navegación principal detrás de un botón en la esquina superior derecha (fuera de la zona natural del pulgar). Agrega clics innecesarios para alternar entre Grafo y Flashcards.
     - *Veredicto*: **RECHAZADA**.
  2. *Opción B: Mobile Bottom Nav Fija en la Zona del Pulgar*:
     - Barra fija de 60px con 5 destinos (`Grafo`, `Flashcards`, `Progreso`, `Buscar`, `Ajustes`) con iconos de 20px, labels de 10px y touch targets $\ge 44\times 44\text{px}$.
     - Se complementa con un `padding-bottom: calc(70px + env(safe-area-inset-bottom))` en el contenedor principal para evitar solapamientos.
     - Visible exclusivamente en viewports $\le 768\text{px}$, oculta en escritorio.
     - *Veredicto*: **SELECCIONADA (Ganadora)**.

---

## 5. Sección D: Protocolo de Trazabilidad y Verificación para Fase 3 (Review Traceability Protocol)

Durante la Fase 3 del workflow (`docs/VISUAL_WORKFLOW.md`), cada una de las 26 capturas de `tmp/showcase/` se audita contra esta especificación:

### Matriz de Mapeo de Capturas y Verificación

| Identificador de Captura | User Story / Viewport | Ítems de Inventario a Verificar | Criterio Arquitectónico a Ratificar / Reconsiderar |
|:---|:---|:---|:---|
| `US1-Scen01-Populated-Desktop-CockpitGrid` | US1 / Desktop 1440x900 | INF-01 a INF-23 | Cockpit unificado $\le 96\text{px}$; Fila 1 con CTA acoplado; Fila 2 con 100% de categorías visibles en wrap; 2 filas de tarjetas visibles en viewport. |
| `US1-Scen02-Populated-Desktop-RailsGraph` | US1 / Desktop 1440x900 | INF-02, INF-17 | Conmutación instantánea a Rails; las 10 categorías de Rails se acomodan en 2 filas limpias sin recortes ni scrollbar gris. |
| `US1-Scen03-Populated-Desktop-CategoryFilter` | US1 / Desktop 1440x900 | INF-10, INF-11, INF-17 | Chip activo con borde cian; recálculo dinámico de la recomendación en el strip; tarjetas filtradas con ancla de color inmutable. |
| `US1-Scen04-Populated-Desktop-CommandPalette` | US1 / Desktop 1440x900 | INF-28, INF-29 | Modal Spotlight centrado; lista filtrada con atajos `Enter` y `Esc`; acciones globales disponibles. |
| `US1-Scen06-Populated-Desktop-SeniorityTop` | US1 / Desktop 1440x900 | INF-24, INF-25 | Drawer de 420px; 4 bandas de seniority con conteos tabulares; barra total de avance. |
| `US1-Scen06-Populated-Desktop-SeniorityScroll` | US1 / Desktop 1440x900 | INF-25 | Scrollbar ultrafina; 7 hitos con descripciones pedagógicas y barras de color. |
| `US1-Scen09-Populated-Desktop-TopologySVG` | US1 / Desktop 1440x900 | INF-26, INF-27 | Visualizador DAG Sugiyama; aristas Bézier con flechas direccionales; controles Pan/Zoom flotantes. |
| `US2-Scen01-Populated-Desktop-StudyReadTop` | US2 / Desktop 1440x900 | INF-30, INF-33, INF-34, INF-56 | Modal 880px; cabecera unificada sin cajas flotantes; botón `🔊 Escuchar` integrado a la derecha; pestañas protegidas con `flexShrink: 0`. |
| `US2-Scen01-Populated-Desktop-StudyReadScroll` | US2 / Desktop 1440x900 | INF-35, INF-36 | Comparativa Naive vs Senior con tabs de código; popovers de glosario `?`; trade-off visible sobre el pliegue. |
| `US2-Scen03-Populated-Desktop-StudyFAANG` | US2 / Desktop 1440x900 | INF-37, INF-38 | Preguntas FAANG con badges de desbloqueo; enlaces con icono `↗`. |
| `US2-Scen07-Populated-Desktop-StudyZenMode` | US2 / Desktop 1440x900 | INF-32 | Modo inmersivo 100vw × 100vh; backdrop removido; ancho contenido `max-w-4xl` para ergonomía de lectura. |
| `US2-Scen08-Populated-Desktop-StudyLearnStage` | US2 / Desktop 1440x900 | INF-39, INF-40, INF-41 | Tutor socrático interactivo; 4 chips temáticos; botón de síntesis a Etapa 03. |
| `US2-Scen11-Populated-Desktop-StudyParaphrase` | US2 / Desktop 1440x900 | INF-42, INF-43, INF-46 | Editor de borrador con auto-guardado; botón de dictado; contador tabular `<140` chars con aviso. |
| `US2-Scen11-Populated-Desktop-StudyChunks` | US2 / Desktop 1440x900 | INF-44, INF-45 | Descomposición en chunks de lectura; métricas de densidad léxica. |
| `US2-Scen14-Boundary-Desktop-StudyEvaluateScore`| US2 / Desktop 1440x900 | INF-51, INF-52, INF-53 | Executive Scorecard 2 columnas; puntaje display `120/120` con sparkline SVG; grilla 2x2 sin scroll. |
| `US2-Scen15-Populated-Desktop-StudyEvaluateHistory`| US2 / Desktop 1440x900 | INF-49, INF-50 | Paginación `← Intento N de M →`; veredicto de intento previo; aviso de versión si aplica. |
| `US3-Scen01-Populated-Desktop-BYOKSettings` | US3, US5 / Desktop 1440x900 | INF-07, INF-58 a INF-61 | Modal de proveedores con chips de selección; inputs seguros; botones de exportar/importar JSON. |
| `US5-Scen02-Populated-Desktop-GlobalHUDStreaming` | US3 / Desktop 1440x900 | INF-54, INF-55 | Píldora HUD flotante en esquina inferior derecha; contador de streaming monoespaciado; botón cancelar. |
| `US6-Scen01-Populated-Desktop-FlashcardsGrid` | US6 / Desktop 1440x900 | INF-62, INF-63 | Cuadrícula de flashcards 3D; filtros de maestría; anverso con pregunta de entrevista y badge de categoría. |
| `US6-Scen02-Populated-Desktop-FlashcardFlipped` | US6 / Desktop 1440x900 | INF-64 | Reverso volteado en 3D; respuesta técnica clave; botón `Estudiar tarjeta →`. |
| `US7-Scen01-Populated-Mobile-WorkspaceTop` | US7 / Mobile 390x844 | INF-09 a INF-17, INF-65 | Cockpit adaptado a móvil; carrusel de categorías en 1 fila touch con scroll horizontal; bottom nav fija. |
| `US7-Scen01-Populated-Mobile-WorkspaceScroll` | US7 / Mobile 390x844 | INF-18 a INF-23, INF-66 | Scroll de tarjetas en columna simple; padding inferior de 70px que evita solapamiento con la barra. |
| `US7-Scen01-Populated-Mobile-BottomNavActive` | US7 / Mobile 390x844 | INF-65 | Barra inferior con pestaña activa resaltada en cian; touch targets $\ge 44\times 44\text{px}$. |
| `US7-Scen02-Populated-Mobile-Flashcards` | US7 / Mobile 390x844 | INF-62 a INF-64 | Flashcards en columna vertical fluida para interacción con el pulgar. |
| `US7-Scen02-Populated-Mobile-StudyModal` | US7 / Mobile 390x844 | INF-30 a INF-36 | Modal adaptado a viewport móvil; cero desbordes laterales; lectura fluida. |

---

## 6. Matriz de Tokens de Diseño y Tipografía

```css
/* Colores de Fondo y Superficie */
--bg-workspace: #080b13;
--bg-canvas: #060910;
--border-line: rgba(255, 255, 255, 0.08);

/* Colores Semánticos Inmutables de Categoría */
--cat-mental-model: #38bdf8;   /* Cian */
--cat-state-data:    #f59e0b;   /* Ámbar */
--cat-async-effects: #a855f7;   /* Violeta */
--cat-performance:   #10b981;   /* Esmeralda */
--cat-architecture:  #ec4899;   /* Rosa */
--cat-testing:       #06b6d4;   /* Turquesa */
--cat-production:    #6366f1;   /* Índigo */

/* Tipografía de Grado de Ingeniería */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
```
