# Visual Design Engineering & Continuous Review Workflow

**Workflow Entrypoint Document for `/goal`**  
**Reference**: [ADR 0010 — Spec-Driven Visual Design Engineering](./adr/0010-spec-driven-visual-design-and-continuous-review-workflow.md)  
**Governing Criteria**: [docs/DESIGN_CRITERIA.md](./DESIGN_CRITERIA.md)  
**Specification**: [specs/001-clean-workspace-v2/spec.md](../specs/001-clean-workspace-v2/spec.md)  
**Design Blueprint**: [specs/001-clean-workspace-v2/design-spec.md](../specs/001-clean-workspace-v2/design-spec.md)  

---

## 1. Goal Execution Contract

When invoking `/goal` with this workflow, the agent is bound to execute all 4 phases sequentially without stopping or declaring premature completion. The task concludes **ONLY** when Phase 4 produces a certified, clean second pass where **100% of the spec-mapped views score $\ge 9.0 / 10$**.

```
[Phase 1: Blueprint from Scratch] ──► [Phase 2: Implementation & Tests]
                                                     │
                                                     ▼
┌───────────────────────────────────► [Phase 3: Capture & Review Loop]
│                                                    │
│                                           ¿Alguna vista < 9.0?
│                                              /            \
│                                          [SÍ]             [NO]
│                                           │                 │
│                                           ▼                 ▼
└────── [Refactor Atómico + Tests] ◄────────┘     [Phase 4: Segunda Pasada]
                                                              │
                                                        ¿Fallo en 2da?
                                                           /      \
                                                        [SÍ]      [NO (100% ≥ 9.0)]
                                                         │              │
                                                         └──────────────┼──► [GOAL_COMPLETE]
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

## 3. Las 4 Fases de Ejecución

### Fase 1: Arquitectura de Información & Blueprint desde Cero
- **Objetivo**: Planificar la jerarquía, densidad y estructura visual de cada pantalla antes de implementar.
- **Entradas**: `specs/001-clean-workspace-v2/spec.md` + Principios de Anthropic `frontend-design`.
- **Artefacto**: `specs/001-clean-workspace-v2/design-spec.md`.
- **Invariante**: Debe documentar explícitamente el diseño de las 7 User Stories, prohibir carditis/div soup y definir la densidad controlada (cero cajas huecas con $>40\text{px}$ de vacío).

### Fase 2: Implementación y Barreras de Calidad
- **Objetivo**: Construir el código reflejando fielmente el Blueprint.
- **Barreras Obligatorias (Quality Gates)**:
  1. `node scripts/audit-lines.mjs`: **43/43 archivos $\le 150$ líneas (0 violaciones)**.
  2. `npm run test:logic`: **8/8 suites passing**.
  3. `npm run build`: **Compilación sin errores en `dist/`**.
  4. `npx playwright test`: **33/33 tests E2E passing (0 uncaught exceptions)**.

### Fase 3: Bucle Continuo de Captura, Review & Mejora
- **Paso 3.1: Captura Determinista**: Ejecutar `node scripts/capture-showcase.mjs` con inyección de fixture nominal (`hydrated-state.json`).
- **Paso 3.2: Review Forense con Lista Negativa**: Cada captura debe inspeccionarse con `view_file` contra los 5 Invariantes Negativos:
  - *Invariante 1*: Cero truncamientos duros de texto o chips (debe haber `mask-image` o scroll).
  - *Invariante 2*: Cero compresión de flexbox (tabs y headers con `flexShrink: 0`).
  - *Invariante 3*: Cero cajas flotantes redundantes (anti-carditis).
  - *Invariante 4*: Cero aire muerto ($>40\text{px}$) o huecos asimétricos.
  - *Invariante 5*: Colores semánticos de categoría preservados inmutablemente.
  - *Regla de Puntuación*: Violación de $\ge 1$ invariante $\implies$ calificación máxima $\le 7.0 / 10$ ($\le 5.0$ si es estructural).
- **Paso 3.3: Bifurcación**:
  - Si alguna vista obtiene **$< 9.0$**: Se registra el defecto y se pasa de inmediato al **Refactor Atómico** en la Fase 2, repitiendo el ciclo.
  - Si el 100% de las vistas obtiene **$\ge 9.0$**: Se avanza a la **Fase 4**.

### Fase 4: Segunda Pasada Exhaustiva de Cierre (Gate Certification)
- **Activación**: Únicamente cuando la Fase 3 concluyó con todas las vistas puntuadas en $\ge 9.0$.
- **Protocolo**:
  - Re-auditar independientemente las 25 capturas desde cero con mirada hipercrítica.
  - Si se detecta un solo defecto que no merezca $\ge 9.0$, se cancela el cierre y se regresa a la Fase 3.
  - Si todas ratifican $\ge 9.0$ sin ninguna objeción, se emite la certificación final.

---

## 4. Condición de Finalización del Goal

El comando `/goal` finaliza **ÚNICAMENTE** cuando:
1. `specs/001-clean-workspace-v2/design-spec.md` existe y está completo.
2. Todas las capturas mapeadas en la Sección 2 están generadas en `tmp/showcase/`.
3. Todos los tests (`audit-lines`, `test:logic`, Playwright) pasan al 100%.
4. La **Segunda Pasada Exhaustiva de la Fase 4** ratifica que el **100% de las capturas obtuvieron $\ge 9.0 / 10$**.
5. Se incluye en el mensaje final la confirmación del sello de cierre: `<!-- GOAL_COMPLETE -->`.
