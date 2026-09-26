# Feature Specification: Workspace UI v3 (reconstrucción visual completa)

**Feature Branch**: `ui-v3`
**Created**: 2026-09-26
**Status**: Ready for Design
**Supersedes (presentación)**: `specs/001-clean-workspace-v2/spec.md` (se conservan sus historias; este documento fija alcance, decisiones y correcciones)
**Inventario de paridad**: [`legacy-inventory.md`](./legacy-inventory.md) — lista verificada de cada superficie, dato, copy y estado del legacy.

---

## 1. Misión

Reconstruir desde cero la capa de presentación de Learning Workspace con una dirección visual nueva —**oscuro refinado**— y una arquitectura de componentes mantenible, alcanzando **paridad funcional completa** con lo que el usuario veía en el legacy (`legacy/`), corrigiendo sus bugs documentados y sin tocar el contrato de dominio (grafos, contenido, gateway de IA, almacenamiento).

## 2. Alcance

### Dentro
- Todas las superficies montadas del legacy (inventario §2–§17): shell, mapa (lista y grafo topológico), ruta sugerida, sesión de estudio en 4 etapas, deep dives, lectura por voz, dictado, mentor IA (harness pedagógico), parafraseo con coaching en vivo, evaluación en streaming en background, historial y gráfico de intentos, flashcards con práctica, progreso (seniority + milestones), conexiones de IA (3 vistas), respaldo, paleta de comandos, HUD de tareas, navegación móvil.
- Nuevo: comparación de código *ingenuo vs. producción* (`lesson.codeComparison`) y resaltado de sintaxis para el código de la lección.
- Corrección: chat socrático real en Mentor IA (usa `coachChatStream`), copy honesto sobre API keys en respaldos, Esc en modo Zen, deep link de flashcards a Parafrasear, acentos y mojibake.
- Datos: el contenido Rails que solo vive en `legacy/App.jsx` (contexto de categorías, overrides, correcciones conceptuales, milestones) se porta a `src/` para que `legacy/` quede como archivo inerte.

### Fuera (decisión explícita)
- Vistas alternativas de grafo dormidas (Carriles, Radial, Ruta): no se portan. La vista *Lista* del mapa las sustituye como alternativa legible.
- "Incorporar este foco con IA" y "reconciliar chat con el borrador" (dormidos): no se portan en v3.
- Repetición espaciada persistente en flashcards: la autoevaluación 1–4 sigue siendo de sesión.

## 3. Historias de usuario (resumen; detalle en 001 e inventario)

| ID | Historia | Prioridad |
|:--|:--|:--:|
| US1 | Explorar el mapa (React/Rails), filtrar por foco, ver la ruta sugerida en 3 niveles, alternar Lista/Grafo, buscar con ⌘K, rutas `/:graph` y `/:graph/card/:id` con historial y "Volver a …". | P1 |
| US2 | Estudiar una card en 4 etapas: 01 Leer, 02 Mentor IA, 03 Parafrasear (coaching en vivo), 04 Evaluar (0–120, rúbrica de 4 dimensiones, historial). Modo Zen. | P1 |
| US3 | Tareas de IA en background (evaluación, harness) con HUD global, cancelación y sincronización entre pestañas. | P2 |
| US4 | Lectura por voz segmentada (play/pausa, anterior/siguiente, repetir, velocidad, por sección, resaltado). Dictado por voz. | P2 |
| US5 | Conexiones de IA propias (catálogo, editor, prueba, activar) y respaldo local export/import. | P2 |
| US6 | Flashcards: filtros, volteo, práctica con autoevaluación y racha, salto a la card. | P2 |
| US7 | Progreso: bandas de seniority y milestones. | P3 |
| US8 | Móvil (<768px): navegación inferior al alcance del pulgar, HUD del foco, targets ≥44px, safe areas. | P2 |

## 4. Reglas de negocio unificadas

1. **Card dominada** (`isComplete`): existe *algún* intento con `getScoreView(evaluation).isMastery` (display ≥ 100) **o** el borrador tiene `harnessPassedThreshold` / `harnessScore ≥ 95`. Se elimina la regla legacy `score ≥ 80`.
2. **Escala**: 0–100 = cobertura esencial; 101–120 = profundidad opcional (dorado). 100 es meta suficiente, nunca se presenta como "insuficiente".
3. **Ruta sugerida**: algoritmo legacy `getGuidance` (3 niveles: 1 + 4 + 4; candidatos no dominados del foco con prerrequisitos dominados o fuera de foco, por prioridad). Se porta a `src/logic/guidance.js`.
4. **Contexto de la card**: `getLessonContext` legacy (3 textos) portado al mismo módulo; también alimenta la narración.
5. **Borrador**: autosave 400 ms; la evaluación **no** borra el borrador.
6. **Respaldo**: el archivo incluye las API keys (`secretsIncluded: true`). Todo copy debe decirlo.
7. **Preferencias de UI persistidas** (nuevo, `localStorage`): vista del mapa (Lista/Grafo), velocidad de lectura, barra lateral colapsada.

## 5. Criterios de éxito

- Paridad: cada ítem de la *Parity checklist* del inventario está implementado o marcado fuera de alcance en §2.
- Calidad visual: cada vista ≥ 9.0 según `docs/DESIGN_CRITERIA.md`.
- Técnicos: 0 archivos > 150 líneas en `src/` (`scripts/audit-lines.mjs`), `npm run test:logic` y `npm run build` en verde, e2e reescritos para la nueva UI en verde.
