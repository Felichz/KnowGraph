# Implementation Plan: Clean Learning Workspace V2

**Branch**: `001-clean-workspace-v2` | **Date**: 2026-09-03 | **Spec**: [specs/001-clean-workspace-v2/spec.md](spec.md)  
**Input**: Feature specification from `specs/001-clean-workspace-v2/spec.md`  

---

## Summary

Reconstrucción completa de la capa de presentación de Learning Workspace bajo arquitectura modular, reactiva y desacoplada. Se conserva el núcleo headless (`src/logic/` y `src/ai/`), el servidor gateway (`server/`) y el catálogo de 101 nodos React y 41 nodos Rails. La UI se implementa mediante componentes atómicos de menos de 150 líneas conectados a través de custom hooks y `useSyncExternalStore`. Se capturan y preservan todas las gemas pedagógicas e interactivas descubiertas en el prototipo legacy: mapa de seniority y milestones, preguntas de entrevista FAANG desbloqueables, navegación histórica time-travel, HUD flotante global de tareas con cancelación, exportación/importación de respaldos JSON y modo flashcards.

---

## Technical Context

| Dimensión | Especificación Técnica |
| :--- | :--- |
| **Language/Version** | JavaScript ES2023 / JSX, Node.js 20+ |
| **Primary Dependencies** | React 19, Vite 6, Electron 41, Zod 3, idb 8, PrismJS, Mermaid 11 |
| **Storage** | IndexedDB (`idb` v8) para intentos/borradores, `localStorage` para progreso/grafos, `safeStorage` en Electron para API keys |
| **Web APIs** | `SpeechSynthesis` (TTS), `SpeechRecognition` (dictado por voz), `History API` (pushState/popstate), `BroadcastChannel` (sync multi-pestaña), `AbortController` (cancelación de streaming) |
| **Testing** | Node test runner (`tests/logic/*.mjs`), script de auditoría de contenido (`scripts/audit-react-graph.mjs`), auditoría de líneas (`scripts/audit-lines.mjs`) |
| **Target Platform** | Web SPA moderna (Vite/Vercel) y Desktop nativo (Electron para Windows, macOS, Linux) |
| **Performance Goals** | Carga inicial < 1.2s, bundle CSS < 10 kB, 0 layout shifts en streaming SSE |
| **Constraints** | Local-first estricto, offline-capable, privacidad BYOK absoluta, límite constitucional de 150 líneas por archivo |
| **Scale/Scope** | 101 nodos React, 41 nodos Rails, 110 preguntas de referencia FAANG, 4 bandas de seniority |

---

## Constitution Check

*GATE: Verificación obligatoria contra `.specify/memory/constitution.md` antes de cada incremento.*

| Regla Constitucional | Estado | Justificación y Mecanismo de Cumplimiento |
| :--- | :---: | :--- |
| **Art. I: Cero Vibe-Coding** | **PASÓ** | Todo desarrollo responde a tareas trazables en `tasks.md` originadas en `spec.md`. |
| **Art. II: Headless-First** | **PASÓ** | El dominio reside en `src/logic/` y `src/ai/` con 0 dependencias de React o DOM. Los tests corren en Node puro. |
| **Art. III: Límite de 150 líneas** | **PASÓ** | Ningún archivo superará 150 líneas. Los paneles y vistas complejas se descomponen en subcomponentes atómicos. |
| **Art. IV: Contratos en Fronteras** | **PASÓ** | Esquemas Zod validan requests/responses del gateway, perfiles de proveedor y estructuras de respaldo JSON. |
| **Art. V: Preservación de Gemas** | **PASÓ** | Las 14 gemas y detalles de interacción descubiertos en el código legacy están formalmente capturados en US1–US7. |
| **Art. VI: Seguridad BYOK** | **PASÓ** | El gateway mantiene `assertPublicProviderUrl` (defensa anti-SSRF) y Electron usa `safeStorage` con permisos `0o600`. |
| **Art. VII: CSS Modular** | **PASÓ** | Los estilos se basan exclusivamente en variables de tokens limpios definidos en `src/styles/theme.css`. |

---

## Project Structure

### Documentación (Spec Kit)
```text
.specify/
├── memory/
│   └── constitution.md     # Constitución y reglas innegociables
└── templates/
    ├── spec-template.md     # Plantilla de especificación
    ├── plan-template.md     # Plantilla de plan técnico
    └── tasks-template.md    # Plantilla de tareas

specs/001-clean-workspace-v2/
├── spec.md                 # Especificación funcional priorizada (P1-P7)
├── plan.md                 # Este plan técnico
└── tasks.md                # Checklist ordenado de tareas ejecutables
```

### Código Fuente (Estructura Modular)
```text
legacy/                     # 📦 Archivo de referencia histórica (UI v1 monolítica)

server/                     # 🧠 Gateway de IA (BYOK, Zod, SSE, SSRF safe)

src/                        # ✨ Nueva UI limpia v2
├── logic/                  # Capa 1: Dominio Headless puro (0 JSX)
│   ├── graphRegistry.js
│   ├── railsGraph.js
│   ├── selectors.js
│   ├── topologicalLayout.js
│   ├── seniorityProgress.js # Cálculo de Seniority Bands y Milestones
│   ├── interviewUnlock.js   # Cálculo de preguntas desbloqueadas
│   └── learningController.js
│
├── ai/                     # Capa 1: Adapters y Storage
│   ├── client.js           # Cliente SSE con AbortController
│   ├── backup.js           # Exportar e Importar JSON de respaldo
│   ├── learningStore.js    # IndexedDB para intentos y borradores
│   ├── backgroundTaskManager.js # Tareas asíncronas y sync BroadcastChannel
│   └── providerSettings.js # Persistencia de credenciales
│
├── hooks/                  # Capa 2: Orquestación y UI State
│   ├── useController.js    # useSyncExternalStore sobre learningController
│   ├── useUrlRouting.js    # Sincronización bidireccional de URL
│   ├── useStudySession.js  # Estado de la card abierta, etapas y borrador
│   ├── useSpeechRecognition.js # Dictado por voz nativo al parafrasear
│   ├── useAudioNarrator.js # TTS nativo por fragmentos
│   ├── useBackgroundTasks.js # Reactividad a tareas en background
│   └── useKeyboardShortcuts.js # Atajos globales (Ctrl+K, Esc, Ctrl+Enter)
│
├── components/             # Capa 3: Dumb Components (< 150 líneas)
│   ├── layout/
│   │   ├── AppHeader.jsx
│   │   ├── CategoryNav.jsx
│   │   ├── SeniorityProgressPanel.jsx # Panel de Seniority y Milestones
│   │   ├── GlobalTasksHud.jsx        # HUD flotante inferior de tareas
│   │   ├── MobileBottomNav.jsx       # Barra fija para móviles
│   │   └── TaskBanner.jsx
│   ├── graph/
│   │   ├── GraphCanvas.jsx
│   │   ├── GraphNode.jsx
│   │   └── SuggestedNext.jsx
│   ├── flashcards/
│   │   ├── FlashcardGrid.jsx
│   │   └── FlashcardCard.jsx
│   ├── study/
│   │   ├── StudyModal.jsx
│   │   ├── ConceptMapNav.jsx
│   │   ├── DeepDiveText.jsx
│   │   ├── DeepDivePopover.jsx
│   │   ├── InterviewQuestionsSection.jsx # Acordeón FAANG desbloqueables
│   │   ├── AttemptHistoryBar.jsx         # Paginación time-travel
│   │   ├── ReadStage.jsx
│   │   ├── LearnStage.jsx
│   │   ├── ParaphraseStage.jsx
│   │   └── EvaluateStage.jsx
│   ├── common/
│   │   ├── CodeSnippet.jsx
│   │   ├── MermaidChart.jsx
│   │   ├── Sparkline.jsx
│   │   └── CommandPalette.jsx
│   └── settings/
│       ├── ProviderModal.jsx
│       └── BackupActions.jsx # Botones de Exportar/Importar JSON
│
├── styles/
│   └── theme.css           # Tokens y paleta oscura de DESIGN.md
│
├── App.jsx                 # Orquestador raíz limpio (< 145 líneas)
└── main.jsx                # Entrypoint de la aplicación
```

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| *Ninguna violación* | Toda la solución respeta estrictamente los principios de la Constitución. | N/A |
