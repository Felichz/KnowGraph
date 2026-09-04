---
description: "Task list for Clean Learning Workspace V2 implementation"
---

# Tasks: Clean Learning Workspace V2

**Input**: Design documents from `/specs/001-clean-workspace-v2/`  
**Prerequisites**: `plan.md`, `spec.md`, `.specify/memory/constitution.md`  
**Organization**: Las tareas están agrupadas por fase y por User Story (P1 a P7) para permitir implementación y verificación independiente de cada incremento.  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Ejecutable en paralelo (archivos independientes)
- **[Story]**: Historia de usuario a la que pertenece (US1 a US7)
- Incluye las rutas de archivo exactas

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Crear `src/styles/theme.css` con las variables de color, espaciado y tipografía de `DESIGN.md`.
- [x] T002 [P] Crear `src/components/common/CodeSnippet.jsx` (< 80 líneas) con PrismJS y narración técnica.
- [x] T003 [P] Crear `src/components/common/MermaidChart.jsx` (< 70 líneas) con carga diferida y renderizado SVG.
- [x] T004 [P] Crear `src/components/common/Sparkline.jsx` (< 90 líneas) con visualización SVG de trayectoria de puntajes.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T005 Crear `src/hooks/useController.js` para conectar `createLearningController` mediante `useSyncExternalStore`.
- [x] T006 [P] Crear `src/hooks/useKeyboardShortcuts.js` para captura global de `Ctrl+K`, `Escape` y navegación.
- [x] T007 [P] Crear `src/hooks/useBackgroundTasks.js` con subscripción a `backgroundTaskManager` para reactividad en vivo.

---

## Phase 3: User Story 1 - Navegación y Grafo (Priority: P1) 🎯 MVP

- [x] T008 [US1] Crear `src/components/layout/AppHeader.jsx` (< 110 líneas) con switch de grafo y resumen de progreso.
- [x] T009 [US1] Crear `src/components/layout/CategoryNav.jsx` (< 100 líneas) con chips de categorías y conteos de avance.
- [x] T010 [US1] Crear `src/components/graph/SuggestedNext.jsx` (< 60 líneas) con la franja del próximo desafío topológico.
- [x] T011 [US1] Crear `src/components/graph/GraphNode.jsx` (< 90 líneas) para la tarjeta de nodo con badges de estado.
- [x] T012 [US1] Crear `src/components/graph/GraphCanvas.jsx` (< 130 líneas) para el contenedor del grafo topológico.
- [x] T013 [US1] Crear `src/components/common/CommandPalette.jsx` (< 120 líneas) con búsqueda instantánea accesible con `Ctrl+K`.
- [x] T014 [US1] Integrar el MVP en `src/App.jsx` y verificar aceptación de User Story 1.

---

## Phase 4: User Story 2 - Modal de Estudio en 4 Etapas (Priority: P2)

- [x] T015 [US2] Crear `src/hooks/useStudySession.js` (< 120 líneas) para coordinar las 4 etapas y auto-guardado en IndexedDB.
- [x] T016 [US2] Crear `src/components/study/ReadStage.jsx` (< 140 líneas) con resumen, explicación, snippet y trade-offs.
- [x] T017 [US2] Crear `src/components/study/LearnStage.jsx` (< 130 líneas) para el hilo socrático con el tutor de IA.
- [x] T018 [US2] Crear `src/components/study/ParaphraseStage.jsx` (< 140 líneas) con editor de redacción propia y live review.
- [x] T019 [US2] Crear `src/components/study/EvaluateStage.jsx` (< 140 líneas) con barras de rúbrica 0–120, gaps y sparkline.
- [x] T020 [US2] Crear `src/components/study/StudyModal.jsx` (< 120 líneas) integrando las 4 etapas con navegación.
- [x] T021 [US2] Conectar `StudyModal` en `src/App.jsx` y verificar aceptación de User Story 2.

---

## Phase 5: User Story 3 - Background Tasks y Multi-Pestaña (Priority: P3)

- [x] T022 [US3] Crear `src/components/layout/TaskBanner.jsx` (< 70 líneas) con animación de pulso y botón "Ver en vivo →".
- [x] T023 [US3] Integrar `TaskBanner` en `src/components/layout/AppHeader.jsx` o en la vista principal.
- [x] T024 [US3] Verificar aceptación de User Story 3.

---

## Phase 6: User Story 4 - Lectura por Voz Sincronizada (Priority: P4)

- [x] T025 [US4] Crear `src/hooks/useAudioNarrator.js` (< 110 líneas) gestionando `SpeechSynthesis` por IDs de fragmento.
- [x] T026 [US4] Conectar `useAudioNarrator` en `src/components/study/ReadStage.jsx` con botones de audio por sección.
- [x] T027 [US4] Verificar aceptación de User Story 4.

---

## Phase 7: User Story 5 - Configuración Privada BYOK (Priority: P5)

- [x] T028 [US5] Crear `src/components/settings/ProviderModal.jsx` (< 140 líneas) conectado a `src/ai/providerSettings.js`.
- [x] T029 [US5] Integrar el disparador del modal en `src/components/layout/AppHeader.jsx`.
- [x] T030 [US5] Verificar aceptación de User Story 5.

---

## Phase 8: Verificación y Compliance Base

- [x] T031 Auditoría de límites: Confirmar que ningún archivo en `src/components/` o `src/hooks/` supere las 150 líneas.
- [x] T032 Confirmar que `src/App.jsx` mide menos de 150 líneas.
- [x] T033 Ejecutar `npm run check` en verde.
- [x] T034 Ejecutar `npm run test:logic` en verde sin bloqueos.

---

## Phase 9: Refinamiento de Gemas de Interacción (US1 y US2)

- [x] T035 [US2] Crear `src/hooks/useSpeechRecognition.js` (< 60 líneas) para dictado por voz oral en `ParaphraseStage`.
- [x] T036 [US2] Conectar botón de micrófono y atajo `Ctrl+Enter` en `src/components/study/ParaphraseStage.jsx`.
- [x] T037 [US2] Crear `src/components/study/DeepDivePopover.jsx` y `DeepDiveText.jsx` para términos técnicos de bajo nivel.
- [x] T038 [US1/US2] Crear `src/components/study/ConceptMapNav.jsx` con flujo Antes → Ahora → Después y botón volver.
- [x] T039 [US1] Crear `src/hooks/useUrlRouting.js` (< 70 líneas) para sincronización de URL bidireccional (`popstate`).
- [x] T040 [US2] Implementar toggle de `zenMode` (pantalla completa) en `src/components/study/StudyModal.jsx`.

---

## Phase 10: User Story 6 - Modo Flashcards y Repaso Activo (Priority: P6)

- [x] T041 [US6] Crear `src/components/flashcards/FlashcardCard.jsx` (< 90 líneas) con efecto flip 3D.
- [x] T042 [US6] Crear `src/components/flashcards/FlashcardGrid.jsx` (< 120 líneas) con filtros por dominio.
- [x] T043 [US6] Conectar toggle de vista Grafo/Flashcards en `src/components/layout/AppHeader.jsx` y `src/App.jsx`.
- [x] T044 Re-ejecutar `scripts/audit-lines.mjs` y `npm run check` confirmando 0 violaciones.

---

## Phase 11: Curriculum, Seniority Bands & Preguntas FAANG (Priority: P1 & P2)

**Goal**: Modelar las abstracciones de alto nivel de carrera (Seniority Bands, Milestones y preguntas de entrevista desbloqueables).

- [x] T045 [P] [US1] Crear `src/logic/seniorityProgress.js` (< 60 líneas) con cálculo puro de bandas y milestones.
- [x] T046 [P] [US2] Crear `src/logic/interviewUnlock.js` (< 60 líneas) con cálculo de preguntas FAANG desbloqueadas.
- [x] T047 [US1] Crear `src/components/layout/SeniorityProgressPanel.jsx` (< 120 líneas) con desglose de bandas y milestones.
- [x] T048 [US2] Crear `src/components/study/InterviewQuestionsSection.jsx` (< 90 líneas) con acordeón de preguntas FAANG.
- [x] T049 [US2] Integrar `InterviewQuestionsSection`, fuentes oficiales y nodos relacionados en `ReadStage.jsx`.

---

## Phase 12: Time-Travel Histórico, Respaldo JSON y Mobile Nav (Priority: P2, P3, P5, P7)

**Goal**: Proveer inspección histórica de evaluaciones, respaldo completo local-first, HUD flotante y barra táctil móvil.

- [x] T050 [P] [US2] Crear `src/components/study/AttemptHistoryBar.jsx` (< 80 líneas) con paginación `← X de Y →` y alerta stale.
- [x] T051 [P] [US5] Crear `src/components/settings/BackupActions.jsx` (< 80 líneas) conectando `src/ai/backup.js`.
- [x] T052 [P] [US3] Crear `src/components/layout/GlobalTasksHud.jsx` (< 100 líneas) con HUD flotante y cancelación con AbortController.
- [x] T053 [P] [US7] Crear `src/components/layout/MobileBottomNav.jsx` (< 90 líneas) para navegación táctil en viewports estrechos.
- [x] T054 Conectar los nuevos componentes en `App.jsx`, `StudyModal.jsx`, `EvaluateStage.jsx` y `ProviderModal.jsx`.
- [x] T055 Ejecutar `node scripts/audit-lines.mjs`, `npm run test:logic` y `npm run check` para certificar cumplimiento final.

---

## Phase 13: Refinamiento Forense y Micro-Interacciones (US1, US2, US7)

**Goal**: Cerrar todos los detalles descubiertos en las pasadas forenses (acciones de command palette, loader reactivo, aura dorada y visibilidad móvil).

- [x] T056 [P] [US1] Añadir comandos rápidos de sistema (*📇 Flashcards*, *📊 Seniority*, *⚙️ BYOK*) a `src/components/common/CommandPalette.jsx`.
- [x] T057 [P] [US2/US3] Crear `src/components/study/EvaluationLoader.jsx` (< 75 líneas) con latencia en tiempo real, aviso de *thinking models* y cancelación con `AbortController`.
- [x] T058 [US2] Integrar `conciseVerdict` y `EvaluationLoader` en `src/components/study/EvaluateStage.jsx`.
- [x] T059 [US1] Incorporar indicador de excelencia `isExtra` y aura dorada `★ score/120` en `src/components/graph/GraphNode.jsx`.
- [x] T060 [US7] Implementar reglas de visibilidad condicional en `src/styles/theme.css` para ocultar `mobile-bottom-nav` en desktop y soportar `safe-area-inset-bottom` en mobile.

