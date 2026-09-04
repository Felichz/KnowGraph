# ADR 0005 — Máquina de Estado Headless y Sincronización con `useSyncExternalStore`

- Estado: **Aceptado**
- Fecha: 2026-09-04
- Decisores: Learning Workspace Core

## Contexto

En el prototipo original, el estado de la aplicación estaba concentrado casi en su totalidad dentro de `legacy/App.jsx`, alcanzando más de 2.600 líneas de código. Esto generaba problemas críticos de arquitectura:
1. **Re-renders en cascada**: Cualquier cambio menor (como tipear en un input o el avance de un stream de audio) provocaba renders masivos en el grafo y los paneles.
2. **Imposibilidad de Testing Headless**: No se podía probar la lógica de cálculo de recomendaciones, progreso de categorías o selección de nodos sin montar React y simular el DOM del navegador.
3. **Alto acoplamiento de framework**: Las reglas de negocio de la preparación para entrevistas estaban entrelazadas con hooks de ciclo de vida (`useEffect`, `useState`, `useCallback`).

Para el rediseño V2, se evaluaron alternativas tradicionales como **Redux Toolkit**, **Zustand** y **React Context API**.

## Decisión

Se decidió implementar un **Controlador de Dominio Headless en Vanilla JavaScript** (`createLearningController`) completamente agnóstico de frameworks, conectándolo a React 19 mediante la API nativa **`useSyncExternalStore`**.

### 1. Núcleo Puro en Vanilla JS (`src/logic/learningController.js`)
* El controlador expone un patrón formal de *Store*: `subscribe(listener)`, `getSnapshot()` y métodos de acción (`setGraph`, `selectNode`, `setSelectedGroups`, `saveAttempt`, `saveDraft`).
* Todos los selectores (`getSuggestedNextNode`, `getProgressMap`, `getVisibleNodes`, `getSeniorityProgress`) son funciones puras que operan sobre el snapshot.
* No importa `react`, `react-dom`, ni globals de ventana en su lógica nuclear. Puede ejecutarse directamente en Node.js puro.

### 2. Conexión Idiomática con React 19 (`src/hooks/useController.js`)
* En lugar de envolver la aplicación en providers de Contexto (que causan re-renders innecesarios en ramas profundas), se utiliza `useSyncExternalStore`:
```javascript
const snapshot = useSyncExternalStore(
  controller.subscribe,
  controller.getSnapshot,
  controller.getSnapshot // Para SSR / snapshot inicial
);
```
* React garantiza consistencia concurrente sin *tearing* visual durante transiciones concurrentes.

### 3. Componentes como Cáscaras de Presentación Pura
* Los componentes en `src/components/` reciben datos primitivos o callbacks simples y miden menos de 135 líneas cada uno.

## Consecuencias

### Positivas
* **Velocidad de Pruebas**: 7 suites de pruebas automatizadas (`tests/logic/*.mjs`) se ejecutan en Node.js puro en menos de 2 segundos sin requerir JSDOM ni overhead de emulación de navegador.
* **Componentes Desacoplados**: La capa de UI es puramente presentacional, lo que permitió cumplir estrictamente la regla constitucional de 150 líneas por archivo.
* **Zero-Dependencies**: No se requirió añadir librerías externas de gestión de estado (`redux`, `zustand`, `mobx`), reduciendo el tamaño del bundle final.

### Negativas / Trade-offs
* **Inmutabilidad Manual**: Las mutaciones de estado dentro del controlador deben manejar copias inmutables explícitas para que `Object.is(prev, next)` detecte los cambios en los snapshots.
