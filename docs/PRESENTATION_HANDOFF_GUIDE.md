# Guía de handoff: Learning Graph Logic API

## Propósito

Este proyecto separa el sistema de aprendizaje de su representación visual. La capa de lógica contiene el catálogo de grafos, reglas de navegación, progreso, drafts, intentos, scoring, evaluación con IA, streaming, audio y persistencia. La capa presentacional debe decidir cómo se ve todo: layout, componentes, CSS, animaciones, transiciones, accesibilidad visual y event handlers de UI.

La implementación visual anterior fue retirada intencionalmente. El entrypoint de Vite no monta una interfaz: expone `window.learningGraphApi` para facilitar el trabajo de otra capa React o de cualquier consumidor compatible.

## Frontera de capas

```text
Datos de contenido + adapters externos
  src/lessons.js, src/reactGraph.js, src/ai/*, src/ttsSegments.js
                         ↓
Lógica headless pública
  src/logic/graphRegistry.js
  src/logic/selectors.js
  src/logic/learningController.js
  src/logic/index.js
                         ↓
Presentación reemplazable
  React, CSS, canvas, SVG, mobile, etc.
```

La lógica no debe importar JSX, CSS, `ReactDOM`, Mermaid, D3 ni APIs de layout. La presentación no debe recalcular scores, consultar IndexedDB directamente, llamar al gateway de IA directamente ni duplicar reglas de navegación.

## API pública

```js
import { createLearningController, getGraph, listGraphs } from "./logic/index.js";

const controller = createLearningController({ graphId: "react" });
const unsubscribe = controller.subscribe((snapshot) => {
  // La vista renderiza exclusivamente este snapshot.
});

await controller.hydrate();
```

### Catálogo

- `listGraphs()` devuelve los grafos disponibles sin exponer los índices internos de búsqueda.
- `getGraph(graphId)` devuelve el catálogo normalizado para uso del controller; puede incluir índices internos `Map`/`Set` que la presentación no necesita tocar.
- Cada grafo contiene `id`, `label`, `title`, `subtitle`, `categories`, `nodes`, `edges`, `milestones` y `seniorityBands`.
- Cada nodo contiene `id`, `label`, `cat`, `lesson`, `priority` y `prerequisites`.

Los prerequisitos son información pedagógica y de navegación sugerida. No bloquean completar ni abrir un nodo.

### Controller

`createLearningController` devuelve un objeto estable con estas operaciones:

| Operación | Responsabilidad |
| --- | --- |
| `getSnapshot()` | Lee el estado actual y todos los view models derivados. |
| `subscribe(listener)` | Suscribe una presentación a cambios; devuelve cleanup. |
| `hydrate()` | Carga intentos y drafts desde el adapter de persistencia. |
| `setGraph(graphId)` | Cambia de tema y vuelve a hidratar sus datos. |
| `selectNode(nodeId, options)` | Selecciona y opcionalmente abre el detalle. |
| `closeNode()` | Cierra el detalle sin borrar selección. |
| `setViewMode("graph" \| "flashcards")` | Cambia la proyección principal. |
| `setGroups(ids)` | Reemplaza el filtro de grupos. Una lista vacía significa todos. |
| `toggleGroup(id)` | Agrega o quita un grupo sin obligar a deseleccionar los demás. |
| `selectOnlyGroup(id)` | Atajo para enfocar un grupo. `null` vuelve a todos. |
| `navigate(direction)` | Mueve al nodo anterior o siguiente dentro del filtro activo. |
| `navigateToSuggested()` | Selecciona el mejor próximo nodo visible. |
| `updateDraft(nodeId, text)` | Actualiza el borrador y lo persiste. |
| `submitParaphrase(nodeId, answer)` | Ejecuta la evaluación streaming y guarda el intento terminado. |
| `cancelEvaluation()` | Cancela la request activa y limpia el estado transitorio. |
| `selectAttempt(nodeId, index)` | Cambia el intento mostrado. |
| `getNode(nodeId)` | Devuelve el view model de un nodo puntual. |
| `destroy()` | Cancela trabajo pendiente y elimina listeners. |

### Snapshot

El snapshot es la fuente de verdad para la presentación. Sus partes principales son:

```js
{
  graphId,
  graph,
  viewMode,
  selectedGroupIds,
  selectedNodeId,
  modalNodeId,
  hydrated,
  error,
  selectedNode,
  visibleNodes,
  suggestedNextNode,
  graphView: { nodes, edges, progress },
  flashcards,
  progressMap,
  attemptsByNode,
  draftsByNode,
  activeEvaluation,
}
```

`selectedNode`, `graphView.nodes` y `flashcards` ya incluyen `progress`, `draft` y `narrationSegments`. La presentación no necesita volver a consultar la base ni reconstruir ese dato.

## Progreso y score

El score tiene dos significados distintos:

- `coveragePercent` representa cobertura conceptual de la card, de 0 a 100.
- `displayScore` representa cobertura más profundidad opcional, de 0 a 120.

Un nodo se considera completo cuando la cobertura alcanza 100. Los puntos 101–120 son excelencia opcional y nunca bloquean navegación.

`getNodeProgress` expone:

```js
{
  latestAttempt,
  attemptCount,
  score,
  completion,
  isComplete,
}
```

El `score` ya está normalizado por `src/ai/types.js`; no debe reinterpretarse visualmente en otra capa.

## Evaluación streaming

`activeEvaluation` representa únicamente el trabajo transitorio:

```js
{
  status: "running",
  nodeId,
  startedAt,
  chars,
  sections,
  blocks,
}
```

Los bloques de score llegan primero con ids como:

```text
scoreSummary.rubric.accuracy.score
scoreSummary.rubric.accuracy.max
scoreSummary.rubric.completeness.score
...
```

Los textos llegan después con ids como:

```text
feedback.rubricNotes.accuracy
feedback.strengths[0]
feedback.gaps[0].explanation
feedback.conciseVerdict
```

La UI debería mostrar skeletons de bloques, barras individuales apenas estén disponibles y un score provisional derivado cuando ya se puedan calcular los subscores. Al recibir el evento final, el gateway valida el JSON, normaliza el formato y calcula el score definitivo.

La presentación no debe persistir un resultado parcial como intento terminado. Solo `submitParaphrase` guarda cuando recibe `done` con una evaluación válida.

## Persistencia y adapters

El controller usa IndexedDB a través de `src/ai/learningStore.js`. Para tests o una futura base local se pueden inyectar adapters:

```js
createLearningController({
  graphId: "react",
  storage: {
    listAllAttempts,
    listAttempts,
    saveAttempt,
    getDraft,
    setDraft,
    deleteDraft,
  },
  ai: {
    evaluateParaphraseStream,
    isCancel,
  },
});
```

La vista no debe conocer IndexedDB, claves de storage ni detalles de `AbortController`.

## Reglas que la presentación debe respetar

1. No bloquear un nodo por prerequisitos.
2. No mostrar 101–120 como si fueran cobertura obligatoria.
3. No reemplazar el último intento por el mejor intento sin indicarlo.
4. No perder un draft al cerrar o cambiar de nodo.
5. No iniciar dos evaluaciones simultáneas desde el mismo controller.
6. No guardar un stream incompleto como evaluación válida.
7. No enviar la API key al navegador; el cliente solo llama `/api/ai`.
8. No hacer que los nombres visuales de grupos sean parte de la lógica de scoring.
9. Mantener una forma clara de volver del detalle al nodo anterior.
10. Hacer visible cuándo un score es provisional y cuándo fue confirmado.

## Brief para el LLM especialista en diseño

Diseñá una experiencia de aprendizaje para un grafo de conceptos técnicos. El grafo es la vista principal; el detalle de un nodo es una superficie de estudio profunda; flashcards es una vista alternativa. Deben existir estados visibles para: carga inicial, grupo activo, nodo sugerido, nodo completo, nodo con profundidad extra, draft, evaluación streaming, error recuperable, historial de intentos y navegación anterior/siguiente.

Usá el controller como única fuente de verdad. La presentación puede convertir eventos de click, teclado, drag, hover o shortcuts en llamadas al controller, pero no debe mutar el snapshot ni inventar reglas. Si una decisión visual necesita datos nuevos, agregá un selector o un campo al contrato de lógica; no leas directamente módulos de storage o AI desde un componente.

### Instrucciones específicas para Kimi K3

Kimi K3 debe encargarse de dos tareas: pensar la experiencia visual completa y luego implementarla en React. Debe leer primero este documento, `README.md`, `src/logic/index.js`, `src/logic/learningController.js`, `src/logic/selectors.js` y los grafos antes de escribir componentes.

El objetivo visual no es mostrar un dashboard genérico. Es comunicar una ruta de aprendizaje viva y hacer que el usuario entienda en todo momento:

1. qué concepto está estudiando;
2. cuál es el siguiente concepto recomendado y por qué;
3. qué parte de su comprensión ya cubrió;
4. qué feedback está llegando mientras evalúa su respuesta;
5. qué es cobertura suficiente para completar el nodo;
6. qué es profundidad opcional y excepcional.

El score debe tener dos lecturas visuales claramente distintas:

- `0–100`: cobertura conceptual. Llegar a 100 significa que la respuesta cubrió la superficie necesaria de la card y permite considerar el nodo completo.
- `101–120`: excelencia opcional. No debe parecer una continuación obligatoria de la barra normal. Debe sentirse como una zona especial —por ejemplo, con un tratamiento dorado, brillo sutil o una transición celebratoria contenida— que comunique profundidad adicional sin generar ansiedad por no alcanzarla.

La evaluación streaming debe diseñarse como una transición progresiva, no como un bloque que aparece de golpe. La UI debe poder mostrar skeletons inmediatamente, revelar primero las barras de cada rúbrica cuando llegan sus scores, derivar un score provisional claramente etiquetado y completar después las explicaciones textuales. El estado provisional nunca debe confundirse con un intento confirmado.

La presentación puede implementar libremente layout, tipografía, color, animaciones, canvas/SVG, responsive design, microinteracciones, tooltips, accesibilidad y controles de audio. No puede cambiar las reglas de scoring, declarar completo un nodo por su cuenta, bloquear por prerequisitos ni llamar directamente a IndexedDB o al gateway.

Antes de implementar, Kimi debe producir una propuesta breve que describa:

- jerarquía visual de la pantalla principal;
- tratamiento de grupos y filtros;
- estados visuales de nodo pendiente, sugerido, activo, completo y excelente;
- transición entre grafo, detalle y flashcards;
- flujo de evaluación desde draft hasta feedback confirmado;
- comportamiento responsive para escritorio y móvil;
- estrategia de accesibilidad y reducción de movimiento.

Después debe implementar esa propuesta consumiendo únicamente el controller y el snapshot. Si detecta que falta información para representar un estado importante, debe señalar el hueco y proponer una extensión pequeña del contrato antes de duplicar lógica en la UI.

## Validación

Los comandos mínimos son:

```bash
npm run test:logic
node server/tests/test-parse.mjs
npm run build
npm run audit:react
```

El build actual valida que el paquete headless pueda ser servido por Vite aunque todavía no exista una presentación visual montada.
