# Visual Design Specification & Blueprint: Clean Learning Workspace V2

**Feature**: `001-clean-workspace-v2`  
**Standard**: [docs/DESIGN_CRITERIA.md](../../docs/DESIGN_CRITERIA.md)  
**Workflow Reference**: [docs/VISUAL_WORKFLOW.md](../../docs/VISUAL_WORKFLOW.md)  
**Status**: Approved Blueprint  

---

## 1. Postura Estética y Tesis Visual

La interfaz de Learning Workspace V2 adopta una estética **Dark Engineering Editorial** (inspirada en Linear, Raycast y Vercel). Diseñada específicamente para ingenieros de software que se preparan para entrevistas Staff/Senior, prioriza la **densidad controlada** (*Controlled Density*), la claridad tipográfica y la economía cromática sobre adornos superfluos.

### Principios Fundamentales (Anti-AI-Slop):
1. **Densidad Controlada vs. Aire Muerto**: Cero cajas huecas con $>40\text{px}$ de vacío. Cada componente presenta sustancia real (micro-resúmenes, métricas tabulares, badges contextuales).
2. **Superficies Integradas (Anti-Carditis)**: Se erradica el anidamiento de cajas flotantes dentro de modales o paneles con borde. La división de secciones se logra mediante escala tipográfica, espaciado proporcional y reglas divisorias sutiles (`1px solid var(--border-line)`).
3. **Anclas Cromáticas Semánticas**: El color asignado a cada categoría curricular (cian, ámbar, violeta, esmeralda) es **inmutable**. Ningún estado de progreso o maestría puede sobreescribir el color de categoría de una tarjeta. Las distinciones de maestría (100+) se expresan mediante badges y medallas afiladas (`★ 120/120`).
4. **Tipografía de Grado de Ingeniería**: Uso riguroso de fuentes monoespaciadas y números tabulares (`font-variant-numeric: tabular-nums`) para todas las métricas, conteos y ratios.
5. **Pulido Invisible (Design Engineering)**:
   - Desplazamiento horizontal con rueda del ratón (`onWheel`) en barras de filtros.
   - Máscaras de degradado suave (`mask-image: linear-gradient(...)`) en listas que desbordan para eliminar cortes duros de texto.
   - Scrollbars universales ultrafinas casi invisibles.
   - Protección contra compresión de Flexbox (`flexShrink: 0`) en todos los encabezados y barras de pestañas.

---

## 2. Jerarquía de Información y Blueprint por User Story

### US1: Navegación Topológica, Grafo, Routing y Seniority

#### A. Header Principal (`AppHeader.jsx`)
- **Jerarquía**:
  - *Izquierda*: Identidad de producto (`⚡ Learning Workspace`), badge de versión `V2`, conmutador de grafo activo (`React` | `Rails`), conmutador de vista (`Grafo` | `Flashcards`).
  - *Derecha*: Contador total tabular `[2/101 (2%)]` con barra fina de progreso, botón de búsqueda `Buscar Ctrl+K`, acceso a configuración `⚙️ BYOK`.
- **Regla de Espacio**: Altura fija de 52px con backdrop-blur (`rgba(10, 15, 29, 0.85)`).

#### B. Cockpit Control Deck Unificado (`CockpitControlDeck.jsx` & `SuggestedNext.jsx`)
- **Evaluación Comparativa de Opciones de Organización de la Información (Matriz de Trade-offs)**:
  Antes de implementar, se evaluaron tres paradigmas estructurales para la taxonomía curricular y filtros (8 categorías en React, 10 en Rails):
  1. *Opción A: Cinta Horizontal con Scroll y Máscara de Desvanecimiento (`whiteSpace: nowrap`)*:
     - *Ventaja*: Ocupa una sola fila fija (~32px).
     - *Desventaja Crítica*: **Affordance Oculta Severa**. En pantallas estándar de 1080p, solo caben 5 o 6 categorías; el 40% del temario queda invisible a la derecha. El desplazamiento horizontal con rueda de ratón en escritorio es antinatural y produce desuso.
     - *Veredicto*: **RECHAZADA**.
  2. *Opción B: Menú Selector Desplegable / Popover (`[ 🏷️ Categoría: Todas ▾ ]`)*:
     - *Ventaja*: Ocupa ancho mínimo fijo en la barra.
     - *Desventaja*: Oculta la riqueza visual de las categorías y sus colores detrás de un clic. En un mapa de conocimiento, ver las categorías activas es clave para la orientación espacial.
     - *Veredicto*: **RECHAZADA**.
  3. *Opción C: Matriz Auto-Envolvente Compacta (`flexWrap: wrap`)*:
     - *Ventajas*: **100% de descubribilidad inmediata**. Todas las 8 a 10 categorías son visibles y seleccionables con un solo clic. Cero scroll horizontal.
     - *Trade-off*: En anchos medios ocupa 2 filas en lugar de 1.
     - *Mitigación*: Tipografía compacta (`11px`), padding micro (`3px 8px`) y gap de `6px`. La sección de filtros consume solo ~50px, permitiendo que todo el Cockpit unificado (Fila 1: Desafío + Fila 2: Filtros) ocupe **~96px**, muy por debajo del límite de 130px.
     - *Veredicto*: **SELECCIONADA (Arquitectura Ganadora)**.

- **Jerarquía del Cockpit Unificado**:
  - *Fila 1 (Acción Inmediata & Estado)*:
    - *Izquierda*: Badge `🎯 PRÓXIMO DESAFÍO` + prioridad `p#N` + Título del concepto + botón `Estudiar ahora →` acoplados con gap de 8-10px (cero cañón horizontal de vacío).
    - *Derecha*: Contador total de conceptos visibles + Selector segmentado `[⊞ Cuadrícula | ☊ Topología SVG]`.
  - *Divisor*: Regla de 1px sutil (`rgba(255, 255, 255, 0.06)`).
  - *Fila 2 (Taxonomía Completa & Filtros)*:
    - Etiqueta `FILTRO` + Chip `Todos (N)` + Chips individuales de categoría con envoltura limpia (`flexWrap: wrap`). 100% del temario visible en escritorio. Cero desbordes, cero scroll horizontal obligatorio.

#### D. Tarjeta de Concepto (`GraphNode.jsx`)
- **Estructura Interna**:
  - *Acento Lateral Izquierdo*: Barra vertical fija de 3px con el `categoryColor` original inmutable.
  - *Cabecera*: Título del concepto (`13.5px`, semi-bold) + dot pulsante si tiene tarea IA en curso.
  - *Cuerpo*: Micro-resumen conceptual de 2 líneas (`node.lesson.summary` con `-webkit-line-clamp: 2`). Aporta valor cognitivo inmediato y elimina el aspecto de caja vacía.
  - *Pie*: Línea separadora sutil (`1px solid rgba(255,255,255,0.05)`). A la izquierda: Pill de puntaje tabular (`★ 120/120` en dorado para bonus, `100/120` en verde para maestría, `<100` en cian, o `Pendiente` con dot gris). A la derecha: Alerta de prerequisitos pendientes `⚠️ N prereqs` o tag `p#N`.
- **Regla de Espacio**: Altura consistente, padding `12px 14px 10px 16px`, minHeight calibrado.

#### E. Drawer de Seniority y Milestones (`SeniorityProgressPanel.jsx`)
- **Jerarquía**:
  - *Header*: `MAPA CURRICULAR` en cian + Título `Progreso y Seniority` + botón de cierre `✕`.
  - *Progreso Total*: Barra cian con métrica tabular `N/Total (N%)`.
  - *Niveles de Seniority*: 4 bandas de carrera (`React profesional`, `Senior frontend`, `Senior Design Systems`, `Frontend Lead`) con badges de progreso en píldora ámbar.
  - *Hitos (Milestones)*: 7 hitos curriculares con descripción pedagógica, barra de avance coloreada y porcentaje a la derecha.

#### F. Topología SVG (`GraphTopologyCanvas.jsx`)
- **Visualización**: Disposición en capas DAG tipo Sugiyama con curvas Bézier suaves, marcadores direccionales y controles de zoom flotantes no invasivos.

#### G. Command Palette (`CommandPalette.jsx`)
- **Diseño**: Modal centrado estilo Spotlight (`maxWidth: 580px`), input sin bordes toscos con icono de lupa, lista de resultados agrupados con keybindings `Enter` y `Esc`.

---

### US2: Modal de Estudio de 4 Etapas (`StudyModal.jsx`)

#### A. Contenedor Maestro y Blindaje Flexbox
- Header y barras de navegación fijadas con `flexShrink: 0`.
- Contenedor de contenido con `flex: 1, minHeight: 0, overflowY: "auto"` y scrollbar ultrafina.
- Garantía de que las 4 pestañas (`01 Leer`, `02 Aprender`, `03 Parafrasear`, `04 Evaluar`) mantendrán siempre su altura de 42px y su línea cian activa sin importar el contenido o resolución.

#### B. Etapa 01 Leer (`ReadStage.jsx`)
- **Resumen Editorial Integrado**: Cabecera limpia con `📌 EN UNA FRASE`, tesis en 15px bold, `Por qué importa` destacado en ámbar, y **un único botón maestro** `🔊 Escuchar` en la esquina superior derecha. Cero cajas flotantes con bordes gruesos.
- **Explicación Técnica**: Tipografía clara a 13.5px con enlaces discretos `?` que abren popovers de glosario deep-dive en el lugar.
- **Comparativa de Código**: Selector de pestañas `[Enfoque ingenuo | Patrón Senior]`, bloques de código con diff-highlighting y callout sutil `⚖️ TRADE-OFF ASUMIDO`. Visible por encima del pliegue gracias al ahorro de espacio de la cabecera editorial.
- **Paso a Paso y Trade-offs**: Cuadrícula transparente de 2 columnas con tipografía monoespaciada en títulos.
- **Preguntas FAANG**: Acordeón con badges de estado bloqueado/desbloqueado según prerrequisitos.

#### C. Etapa 02 Aprender (`LearnStage.jsx`)
- Tutor socrático interactivo con 4 chips de quick-prompt temáticos (`¿Por qué falla el enfoque ingenuo?`, `¿Podés explicarlo con una analogía visual?`, etc.) y botón de integración con la respuesta.

#### D. Etapa 03 Parafrasear (`ParaphraseStage.jsx`)
- Cabecera editorial con consigna senior, contador de caracteres con indicador de límite mínimo (<140 chars), dictado por voz y selector de vista `[✏️ Editor | 📖 Reading Chunks]` para análisis léxico.

#### E. Etapa 04 Evaluar (`EvaluateStage.jsx`) — Executive Scorecard
- **Switcher de Intentos**: Inline sutil `← Intento N de Total →` | `Puntaje` | `● Último resultado`.
- **Cabecera Ejecutiva a Dos Columnas**:
  - *Columna Izquierda*: Puntaje display gigante (`120 / 120`) con sparkline SVG de tendencia histórica integrada.
  - *Columna Derecha*: Cita editorial con veredicto de Staff Engineer con borde cian vertical.
- **Grilla de Rúbrica 2x2**: Los 4 criterios (`accuracy`, `causalityAndTradeoffs`, `application`, `completeness`) mostrados simultáneamente con barras de progreso esmeralda y notas tabulares **sin necesidad de scroll**.

#### F. Modo Zen Pantalla Completa
- Ocupa `100vw × 100vh`, elimina el backdrop y oculta toda distracción visual del espacio de trabajo.

---

### US3: BYOK y Respaldo (`ProviderModal.jsx`)
- Modal compacto con selector de chips de proveedores (`OpenRouter`, `OpenAI`, `Groq`, `Ollama`), inputs con focus ring nítido, botón de prueba y sección de importación/exportación JSON con feedback.

---

### US5: Background Tasks y Global HUD (`GlobalTasksHud.jsx`)
- HUD flotante en la esquina inferior derecha con indicador pulsante, contador de streaming de caracteres, botón para saltar al modal y cancelación limpia.

---

### US6: Flashcards 3D (`FlashcardGrid.jsx` & `FlashcardCard.jsx`)
- Grid responsive con filtros de dominio y maestría. Tarjetas con volteo 3D interactivo (`transform-style: preserve-3d`): anverso con pregunta de alto nivel, reverso con respuesta técnica clave enmarcada en cian.

---

### US7: Ergonomía Móvil (Viewport 390×844)
- **MobileBottomNav**: Barra fija inferior en la zona accesible del pulgar con 5 destinos (`Grafo`, `Flashcards`, `Progreso`, `Buscar`, `Ajustes`).
- **Touch Targets**: Área mínima de interacción de $44 \times 44\,\text{px}$.
- **Safe Area**: Padding inferior de 70px para evitar solapamientos con la barra de navegación del sistema.

---

## 3. Matriz de Tokens de Diseño

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

/* Tipografía */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
```
