# Visual Design Engineering & Continuous Review Workflow

**Workflow Entrypoint Document for `/goal`**  
**Reference**: [ADR 0010 — Spec-Driven Visual Design Engineering](./adr/0010-spec-driven-visual-design-and-continuous-review-workflow.md)  
**Governing Criteria**: [docs/DESIGN_CRITERIA.md](./DESIGN_CRITERIA.md)  
**Specification**: [specs/001-clean-workspace-v2/spec.md](../specs/001-clean-workspace-v2/spec.md)  
**Design Blueprint**: [specs/001-clean-workspace-v2/design-spec.md](../specs/001-clean-workspace-v2/design-spec.md)  

---

## 1. Goal Execution Contract

When invoking `/goal` with this workflow, the agent is bound to execute all 3 phases sequentially without stopping or declaring premature completion. The task concludes **ONLY** when Phase 3 certifies that **100% of the spec-mapped views score $\ge 9.0 / 10$ across all 4 independent review passes**.

```
[Phase 1: Blueprint from Scratch] ──► [Phase 2: Implementation & Tests]
                                                     │
                                                     ▼
┌───────────────────────────────────► [Phase 3: Capture & 4-Pass Review Loop]
│                                                    │
│                                    ¿Alguna pasada < 9.0 en alguna vista?
│                                              /            \
│                                          [SÍ]             [NO (100% ≥ 9.0)]
│                                           │                     │
└────── [Refactor Atómico + Tests] ◄────────┘                     ▼
                                                          [GOAL_COMPLETE]
```

---

## 2. Mandatory 100% Spec Coverage Matrix

Every User Story and Acceptance Scenario defined in `specs/001-clean-workspace-v2/spec.md` must have an explicit visual capture in `tmp/showcase/` using deterministic naming:

| Identifier | User Story Reference | Viewport | Scope / Visual Target |
|:---|:---|:---:|:---|
| `US1-Scen01-Populated-Desktop-CockpitGrid` | US1 Acceptance 1 | Desktop (1440x900) | Canvas principal, métricas tabulares, tarjetas temario |
| `US1-Scen02-Populated-Desktop-RailsGraph` | US1 Acceptance 2 | Desktop (1440x900) | Conmutación instantánea a grafo Rails |
| `US1-Scen03-Populated-Desktop-CategoryFilter` | US1 Acceptance 3 | Desktop (1440x900) | Filtro por categoría activo y recálculo de ruta |
| `US1-Scen04-Populated-Desktop-CommandPalette` | US1 Acceptance 4 | Desktop (1440x900) | Modal Ctrl+K con búsqueda y acciones rápidas |
| `US1-Scen06-Populated-Desktop-SeniorityTop` | US1 Acceptance 6 | Desktop (1440x900) | Drawer de Seniority Bands y métricas de avance |
| `US1-Scen06-Populated-Desktop-SeniorityScroll` | US1 Acceptance 6 | Desktop (1440x900) | Scroll de Milestones con scrollbar ultrafina |
| `US1-Scen09-Populated-Desktop-TopologySVG` | US1 Acceptance 9 | Desktop (1440x900) | Visualizador DAG SVG con Pan & Zoom |
| `US2-Scen01-Populated-Desktop-StudyReadTop` | US2 Acceptance 1 | Desktop (1440x900) | Modal Etapa 01 Leer, tesis editorial y comparativa |
| `US2-Scen01-Populated-Desktop-StudyReadScroll` | US2 Acceptance 1 | Desktop (1440x900) | Scroll de código comparativo Naive vs Senior |
| `US2-Scen03-Populated-Desktop-StudyFAANG` | US2 Acceptance 3 | Desktop (1440x900) | Sección preguntas FAANG desbloqueadas/bloqueadas |
| `US2-Scen07-Populated-Desktop-StudyZenMode` | US2 Acceptance 7 | Desktop (1440x900) | Modo Zen pantalla completa sin distracciones |
| `US2-Scen08-Populated-Desktop-StudyLearnStage` | US2 Acceptance 8 | Desktop (1440x900) | Etapa 02 Aprender: tutor socrático y quick chips |
| `US2-Scen11-Populated-Desktop-StudyParaphrase` | US2 Acceptance 11 | Desktop (1440x900) | Etapa 03 Parafrasear: editor de borrador y consigna |
| `US2-Scen11-Populated-Desktop-StudyChunks` | US2 Acceptance 11 | Desktop (1440x900) | Alternancia a Chunks de lectura con densidad léxica |
| `US2-Scen14-Boundary-Desktop-StudyEvaluateScore` | US2 Acceptance 14 | Desktop (1440x900) | Etapa 04 Evaluar: Executive Scorecard y rúbrica 2x2 |
| `US2-Scen15-Populated-Desktop-StudyEvaluateHistory` | US2 Acceptance 15 | Desktop (1440x900) | Switcher histórico de intentos previos |
| `US3-Scen01-Populated-Desktop-BYOKSettings` | US3 Acceptance 1 | Desktop (1440x900) | Modal configuración proveedores LLM y backup |
| `US5-Scen02-Populated-Desktop-GlobalHUDStreaming` | US5 Acceptance 2 | Desktop (1440x900) | HUD flotante con streaming de caracteres |
| `US6-Scen01-Populated-Desktop-FlashcardsGrid` | US6 Acceptance 1 | Desktop (1440x900) | Cuadrícula de flashcards 3D y filtros de dominio |
| `US6-Scen02-Populated-Desktop-FlashcardFlipped` | US6 Acceptance 2 | Desktop (1440x900) | Reverso de flashcard con respuesta técnica clave |
| `US7-Scen01-Populated-Mobile-WorkspaceTop` | US7 Acceptance 1 | Mobile (390x844) | Viewport móvil, SuggestedNext compacto y bottom nav |
| `US7-Scen01-Populated-Mobile-WorkspaceScroll` | US7 Acceptance 1 | Mobile (390x844) | Scroll en móvil con safe padding inferior |
| `US7-Scen01-Populated-Mobile-BottomNavActive` | US7 Acceptance 1 | Mobile (390x844) | Barra inferior fija con pestaña activa en thumb zone |
| `US7-Scen02-Populated-Mobile-Flashcards` | US7 Acceptance 2 | Mobile (390x844) | Flashcards en columna única para interacción táctil |
| `US7-Scen02-Populated-Mobile-StudyModal` | US7 Acceptance 2 | Mobile (390x844) | Modal de estudio en móvil sin desbordes horizontales |

---

## 3. Las 3 Fases de Ejecución

### Fase 1: Arquitectura de Información, Divergencia & Blueprint desde Cero
- **Objetivo**: Planificar la jerarquía, densidad y estructura visual de cada pantalla antes de implementar, evaluando alternativas como un diseñador experto.
- **Entradas**: `specs/001-clean-workspace-v2/spec.md` + Principios de Anthropic `frontend-design`.
- **Paso Obligatorio: Matriz de Trade-offs y Evaluación Comparativa de IA**:
  Para cada organismo estructural clave (filtros taxonómicos, cabeceras, decks de control, modales), formular y comparar explícitamente al menos 2-3 opciones estructurales (ej. cinta de scroll horizontal vs. matriz auto-envolvente vs. menú selector segmentado) analizando:
  1. *Densidad & Altura Vertical*.
  2. *Escalabilidad ante $N$ ítems* (qué pasa con 4, 8, 12 elementos).
  3. *Descubribilidad & Cero Affordances Ocultas* (evitar esconder opciones críticas).
  4. *Ergonomía de Puntero/Desktop vs. Touch/Mobile*.
- **Artefacto**: `specs/001-clean-workspace-v2/design-spec.md` (debe contener la matriz comparativa de decisiones).
- **Invariante**: Prohibir defaults perezosos (ej. asumir una sola línea horizontal sin evaluar cómo entran los tags), prohibir carditis/layer-cake y definir densidad controlada.

### Fase 2: Implementación y Barreras de Calidad
- **Objetivo**: Construir el código reflejando fielmente el Blueprint validado.
- **Barreras Obligatorias (Quality Gates)**:
  1. `node scripts/audit-lines.mjs`: **43/43 archivos $\le 150$ líneas (0 violaciones)**.
  2. `npm run test:logic`: **8/8 suites passing**.
  3. `npm run build`: **Compilación sin errores en `dist/`**.
  4. `npx playwright test`: **33/33 tests E2E passing (0 uncaught exceptions)**.

### Fase 3: Bucle Continuo de Captura & Auditoría de 4 Pasadas Independientes
- **Paso 3.1: Captura Determinista**: Ejecutar `node scripts/capture-showcase.mjs` con inyección de fixture nominal (`hydrated-state.json`).
- **Paso 3.2.0: Reconsideración y Confirmación de Hipótesis Arquitectónicas (Design Reality Check)**:
  Antes de auditar micro-detalles, evaluar la macro-estructura real en las capturas:
  - *¿Sobrevivió la estructura elegida en Fase 1 al contacto con datos reales?*
  - *¿Quedaron categorías decapitadas o escondidas detrás de scrolls horizontales incómodos en escritorio?*
  - Si la hipótesis de diseño demuestra fricción o falta de descubribilidad, se declara **Fallo Estructural de IA** y se bifurca de inmediato a un pivote arquitectónico en Fase 2.
- **Paso 3.2: Protocolo de 4 Pasadas Independientes por Captura**:
  Cada captura se audita secuencialmente con `view_file` a través de 4 perspectivas especializadas:
  1. **Pasada 1: Macro-Arquitectura de Pantalla y Viewport (Telescopio)**:
     - Invariante Anti-Layer-Cake (cero apilamiento de múltiples franjas/cajas horizontales independientes).
     - Regla del 70% del Viewport (barras/filtros $\le 130\text{px}$ de altura vertical total; al menos 2 filas completas de tarjetas visibles sin scroll).
     - Prohibición de Cañones Horizontales por `space-between` (>350px de vacío; Ley de Fitts).
     - Invariante Anti-Hidden-Affordance (100% de categorías/filtros visibles sin obligar a scroll horizontal ciego en escritorio).
     - *Violación: Cap máximo $\le 6.5 / 10$*.
  2. **Pasada 2: Micro-Densidad y Anti-Carditis de Componentes (Microscopio)**:
     - Controlled Density (cero cajas huecas con $>40\text{px}$ de aire muerto).
     - Anti-Carditis Interna (cero cajas decorativas dentro de modales o paneles).
     - Protección Flexbox (`flexShrink: 0` en encabezados y tabs).
     - *Violación: Cap máximo $\le 7.0 / 10$*.
  3. **Pasada 3: Semántica Cromática y Jerarquía de Iluminación (Colorista)**:
     - Ancla inmutable de color de categoría.
     - Acentos afilados vs. Árbol de Navidad (prohibido pintar bordes completos de tarjetas en dorado/verde por puntaje).
     - *Violación: Cap máximo $\le 8.0 / 10$*.
  4. **Pasada 4: Ergonomía de Interacción, Móvil y Estados Extremos (Táctil)**:
     - Touch targets $\ge 44\times 44\text{px}$ y safe area de 70px en móvil.
     - Cero truncamientos duros en viewport estrecho (envoltura inteligente y legibilidad de títulos).
     - Modos inmersivos (Zen Mode 100vw × 100vh con ancho de lectura contenido).
     - *Violación: Cap máximo $\le 8.0 / 10$*.
- **Paso 3.3: Bifurcación**:
  - Si alguna vista obtiene **$< 9.0$** en cualquiera de las 4 pasadas o falla la reconsideración arquitectónica: Se registra el defecto y se pasa de inmediato al **Refactor Atómico** en la Fase 2, repitiendo el ciclo.
  - Si el 100% de las vistas obtiene **$\ge 9.0$** en las 4 pasadas: La suite queda formalmente certificada y se avanza directo al cierre del Goal.

---

## 4. Condición de Finalización del Goal

El comando `/goal` finaliza **ÚNICAMENTE** cuando:
1. `specs/001-clean-workspace-v2/design-spec.md` existe y está completo.
2. Todas las capturas mapeadas en la Sección 2 están generadas en `tmp/showcase/`.
3. Todos los tests (`audit-lines`, `test:logic`, Playwright) pasan al 100%.
4. La **Auditoría de 4 Pasadas Independientes** ratifica que el **100% de las capturas obtuvieron $\ge 9.0 / 10$** en todas las perspectivas.
5. Se incluye en el mensaje final la confirmación del sello de cierre: `<!-- GOAL_COMPLETE -->`.

