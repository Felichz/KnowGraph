# Learning Graph Logic API

Núcleo headless para estudiar conceptos de React y Rails mediante grafos, cards, progreso, evaluación con LLM, flashcards, audio y persistencia local.

La presentación visual anterior fue retirada para permitir que una capa de diseño independiente construya la experiencia final sin duplicar reglas de negocio. El entrypoint expone `window.learningGraphApi` en el browser y los módulos públicos están en `src/logic/`.

## Arquitectura

- `src/logic/graphRegistry.js`: catálogo normalizado de grafos React y Rails.
- `src/logic/railsGraph.js`: nodos, grupos y dependencias pedagógicas de Rails.
- `src/logic/selectors.js`: view models puros para progreso, grafo, flashcards y siguiente nodo.
- `src/logic/learningController.js`: estado, navegación, drafts, persistencia y evaluación streaming.
- `src/logic/index.js`: API pública para la capa presentacional.
- `src/ai/`: cliente del gateway, schemas, score y IndexedDB.
- `server/`: gateway Node que valida el JSON del LLM y calcula el score final.
- `docs/PRESENTATION_HANDOFF_GUIDE.md`: contrato completo para implementar la nueva UI.

## Uso desde una presentación

```js
import { createLearningController } from "./src/logic/index.js";

const learning = createLearningController({ graphId: "react" });
const unsubscribe = learning.subscribe((snapshot) => {
  render(snapshot);
});

await learning.hydrate();
learning.selectOnlyGroup("architecture");
learning.navigateToSuggested();
```

El consumidor visual debe leer el snapshot y llamar métodos del controller. No debe consultar IndexedDB, llamar directamente al gateway ni recalcular score, progreso o navegación.

## Contrato de evaluación

El LLM devuelve primero un objeto `scoreSummary` con los cuatro subscores y después un objeto `feedback` con notas y textos. El gateway transforma ese formato a la forma de dominio, valida con Zod y calcula el score visible de 0 a 120.

La cobertura conceptual de 100 completa el nodo. Los puntos 101–120 son profundidad opcional y no bloquean el avance.

## Comandos

```bash
npm install
npm run test:logic
node server/tests/test-parse.mjs
npm run build
npm run audit:react
```

El servidor de IA se ejecuta aparte:

```bash
cd server
npm install
npm start
```

La configuración se toma de `server/.env`; usar `server/.env.example` como referencia y no commitear tokens.

## Contenido

El repositorio conserva el contenido didáctico y sus fuentes:

- React: modelo mental, estado, hooks, asincronía, arquitectura, performance, testing, seguridad, producción, design systems y liderazgo.
- Rails: Ruby, MVC, Rack, routing, Active Record, asociaciones, validaciones, transacciones, patrones, APIs, seguridad, assets y testing.

Para el diseño de la nueva interfaz, empezar por [PRESENTATION_HANDOFF_GUIDE.md](docs/PRESENTATION_HANDOFF_GUIDE.md).
