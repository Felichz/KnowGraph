# Learning Graph

Aplicación web interactiva para estudiar conceptos de desarrollo frontend y backend mediante grafos de conocimiento, cards didácticas, dependencias, milestones, quizzes y navegación guiada.

El proyecto nació como un mapa de preparación para entrevistas de Rails y React. La aplicación permite estudiar un concepto por vez, entender por qué importa, revisar ejemplos de código, explorar relaciones de dependencia y comprobar la comprensión antes de avanzar.

## Documentos de diseño

- [Plan de integración LLM: parafraseo, tutoría y flashcards](docs/LLM_LEARNING_EXPERIENCE_PLAN.md)
- [Guía de la API headless y handoff de presentación](docs/PRESENTATION_HANDOFF_GUIDE.md)
- [Aplicación desktop con Electron](docs/DESKTOP_APP.md)

La presentación activa conserva la versión original de `src/App.jsx` y sus componentes detallados. El núcleo headless de `src/logic/` permanece disponible para futuras iteraciones o rediseños, pero no reemplaza la UI actual.

## Objetivos

- Convertir un temario amplio en una ruta visual de aprendizaje.
- Mostrar qué conceptos conviene estudiar antes de otros.
- Explicar cada nodo con contexto, ejemplos, trade-offs, errores comunes y fuentes.
- Permitir estudiar por grupos temáticos sin bloquear la finalización por prerrequisitos.
- Incorporar preguntas de entrevista y preguntas de recuperación activa por card.
- Mantener el progreso localmente en el navegador.

## Funcionalidades principales

### Grafos de temas

La aplicación soporta varios grafos independientes. Actualmente incluye:

- **Rails entrevistas**: Ruby mínimo, Rails MVC, request lifecycle, Rack, routing, Active Record, asociaciones, validaciones, transacciones, seguridad, APIs, React + Rails y assets.
- **React entrevistas**: modelo mental, componentes, estado, hooks, asincronía, arquitectura web, performance, testing, seguridad, producción, design systems y liderazgo frontend.

Cada grafo tiene sus propios nodos, categorías, dependencias, milestones y progreso.

### Cards didácticas

Al abrir un nodo se muestra un modal con:

- resumen y explicación principal;
- motivo por el que el concepto importa;
- contexto dentro de la ruta;
- ejemplos de código;
- pasos de implementación;
- trade-offs y errores frecuentes;
- tablas, diagramas Mermaid o diagramas de flujo;
- explicaciones profundas activables desde frases relevantes;
- fuentes para verificar o continuar estudiando;
- navegación hacia prerrequisitos, relacionados y próximos nodos.

Las cards están diseñadas para ser autocontenidas: los términos importantes se introducen antes de usarse y las dependencias se muestran explícitamente.

### Progreso y milestones

El usuario puede marcar cualquier nodo como entendido aunque todavía no haya completado sus prerrequisitos. Las dependencias sirven para orientar la ruta, no para impedir estudiar o completar un nodo.

El progreso se visualiza en varios niveles:

- progreso total del grafo;
- progreso por categoría;
- milestones temáticos;
- bandas de seniority para el grafo de React;
- siguiente nodo recomendado según prioridad y dependencias.

El estado se guarda en `localStorage`, separado por grafo.

### Quiz por nodo

Cada card genera tres preguntas propias:

1. comprensión del concepto;
2. aplicación en un caso práctico;
3. riesgos, límites o trade-offs.

En React también se incorporan las preguntas de entrevista trazadas al nodo. Una pregunta de entrevista se muestra en el quiz cuando se completaron sus dependencias conceptuales.

El quiz permite:

- responder opciones múltiples;
- evaluar todas las respuestas visibles;
- ver score y porcentaje;
- identificar respuestas correctas e incorrectas;
- leer una explicación posterior a cada respuesta;
- reintentar;
- marcar la card como entendida;
- volver a la card anterior;
- ir directamente a la siguiente card.

Las opciones se equilibran automáticamente para evitar que la respuesta correcta sea obvia por ser mucho más larga que las demás. La auditoría automática comprueba este criterio.

### Lectura por voz

La lectura usa la API nativa `SpeechSynthesis` del navegador. No requiere un servidor TTS local ni una API externa.

La card puede leerse por segmentos, incluyendo:

- resumen;
- explicación;
- contexto;
- ejemplo;
- pasos;
- trade-offs;
- idea final;
- explicación narrativa del snippet de código.

Los controles incluyen play/pausa, anterior, siguiente, replay y velocidad de lectura.

## Stack

- React 19
- React DOM 19
- Vite 6
- D3 7 para el grafo y la visualización de relaciones
- Mermaid 11 para diagramas conceptuales
- JavaScript con módulos ES
- CSS propio, sin framework visual externo
- `localStorage` para el progreso
- `idb` para intentos de autoevaluación y borradores
- `SpeechSynthesis` para texto a voz
- Gateway local en Node (`server/`) con Zod para validación runtime
- Electron como runtime desktop opcional, manteniendo la misma aplicación React

## Requisitos

- Node.js compatible con Vite 6.
- npm.
- Un navegador moderno con soporte para módulos ES y, opcionalmente, `SpeechSynthesis`.

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

Y desde `server/` para el gateway de IA:

```bash
cd server
npm install
cp .env.example .env
# Editá server/.env y completá FREELLMAPI_API_KEY y MINIMAX_API_KEY
```

## Desarrollo local

En dos terminales:

**Terminal 1 — gateway de IA** (necesario para la autoevaluación por parafraseo):

```bash
cd server
npm start
```

Por defecto escucha en `http://127.0.0.1:4317` y expone las rutas `/api/ai/*`. El gateway intenta primero `MiniMax-M3` directamente y usa FreeLLMAPI como fallback si MiniMax falla. No abrir públicamente; Vite ya proxia esas rutas en el dev server.

**Terminal 2 — Vite**:

```bash
npm run dev
```

La aplicación queda disponible normalmente en:

```text
http://localhost:5173
```

El servidor está configurado para escuchar en `0.0.0.0`, por lo que también puede abrirse desde otro dispositivo de la red local usando la IP de la computadora:

```text
http://IP_DE_LA_COMPUTADORA:5173
```

En Windows, la IP puede consultarse con:

```powershell
ipconfig
```

Si otro dispositivo no puede conectarse, hay que revisar que el firewall permita conexiones entrantes al puerto `5173` y que ambos dispositivos estén en la misma red.

## Autoevaluación por parafraseo (IA)

La evaluación por parafraseo reemplaza el quiz de opciones múltiples: el usuario escribe con sus propias palabras lo que entendió y un LLM devuelve un puntaje, una rúbrica, fortalezas, vacíos, errores conceptuales y una consigna concreta para reintentar.

- El gateway local (`server/`) intenta primero [MiniMax M3](https://platform.minimax.io/docs/api-reference/text-chat-openai) y usa [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) como fallback; ninguna key se expone al navegador.
- Cada intento se guarda en IndexedDB (`learning-graph-ai`) con 12 intentos máximos por nodo (FIFO).
- El borrador se persiste automáticamente con debounce y se borra al evaluar con éxito.
- La vista de flashcards (`[ Grafo | Flashcards ]`) muestra la cara posterior de cada card con el último parafraseo evaluado y su score.
- El feedback no bloquea marcar un nodo como entendido.

Más detalle en [docs/LLM_LEARNING_EXPERIENCE_PLAN.md](docs/LLM_LEARNING_EXPERIENCE_PLAN.md).

## Exponerlo con ngrok

Con el servidor de Vite ejecutándose:

```bash
ngrok http 5173
```

Luego se abre en el teléfono la URL HTTPS que muestra ngrok. `vite.config.js` ya permite los dominios habituales de ngrok (`ngrok-free.app`, `ngrok.app` y `ngrok.io`).

Si se usa un hostname personalizado:

```powershell
$env:NGROK_HOST="tu-hostname.ngrok-free.app"
npm run dev
```

## Build de producción

```bash
npm run build
```

Los archivos generados quedan en `dist/`.

Para probar el build con el servidor de preview de Vite:

```bash
npm run preview
```

## Scripts disponibles

| Comando | Propósito |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo escuchando en todas las interfaces. |
| `npm run build` | Genera el build de producción. |
| `npm run desktop:dev` | Abre la aplicación en Electron y administra el gateway local. |
| `npm run desktop:pack` | Genera una build desktop desempaquetada para verificar. |
| `npm run desktop:dist` | Genera el instalador de Windows. |
| `npm run preview` | Sirve localmente el build generado. |
| `npm run audit:react` | Valida la estructura y calidad mínima del grafo de React. |
| `npm run check` | Ejecuta la auditoría y luego el build. |

## Arquitectura del código

### Entrada de la aplicación

- `src/main.jsx`: monta React en el elemento `#root`.
- `src/App.jsx`: contiene la composición principal, estado de navegación, modal de card, progreso, TTS, quiz y render del grafo.
- `src/styles.css`: estilos globales, visualización del grafo, cards, modal, quiz, milestones y responsive layout.

### Definición de los grafos

- `src/lessons.js`: contenido base del grafo de Rails.
- `src/reactGraph.js`: nodos, dependencias y contenido del grafo de React.
- `src/reactInterviewQuestions.js`: las preguntas de entrevista de referencia y su relación con nodos.
- `src/reactMilestones.js`: agrupaciones temáticas del grafo de React.
- `src/reactSources.js`: fuentes de documentación asociadas a conceptos React.

### Capas de enriquecimiento del contenido React

El contenido de React se compone de varias capas para poder mantener el grafo manejable:

- `reactAuditNotes.js`: auditoría y aclaraciones de contenido.
- `reactAdvancedAuditNotes.js`: temas avanzados y criterios de seniority.
- `reactArchitectureReview.js`: revisión de arquitectura, casos y relaciones.
- `reactConceptualCorrections.js`: correcciones de precisión conceptual.
- `reactDeepDives.js`: explicaciones de segunda capa activables desde el texto.
- `seniorReactTopics.js`: temas de producción, design systems y liderazgo.
- `reactInterviewExpansion.js`: expansión de cobertura para entrevistas.

`reactGraph.js` combina estas fuentes al construir cada nodo final.

### Quiz

- `src/reactQuiz.js`: genera las tres preguntas propias de cada nodo, crea preguntas derivadas de entrevista, resuelve dependencias y equilibra visualmente la longitud de las opciones.
- `scripts/audit-react-graph.mjs`: comprueba que todos los nodos tengan contenido, fuentes, preguntas válidas y opciones equilibradas.

### Lectura por voz

- `src/browserTtsFull.js`: construcción de segmentos de texto para la lectura del navegador.
- `src/ttsSegments.js`: narraciones específicas, especialmente para snippets de código y diagramas.

## Modelo conceptual de un nodo

Un nodo pertenece conceptualmente a esta estructura:

```js
{
  id: "hooks_rules",
  label: "Hooks y reglas de uso",
  cat: "state",
  priority: 12,
  prerequisites: ["state_updates"],
  lesson: {
    summary: "...",
    why: "...",
    explanation: "...",
    code: "...",
    steps: ["..."],
    pitfalls: ["..."],
    takeaway: "...",
    sources: [{ label: "...", href: "https://..." }],
    audit: {
      primer: "...",
      example: "...",
      failureModes: ["...", "..."]
    }
  }
}
```

Las dependencias se expresan mediante `prerequisites`. Una dependencia `A -> B` significa que A aporta el modelo mental necesario para entender B; no significa que B esté bloqueado.

## Cómo agregar o modificar contenido

### Agregar un nodo Rails

1. Agregar el contenido en `src/lessons.js`.
2. Agregar el nodo y sus dependencias en la configuración correspondiente dentro de `src/App.jsx`.
3. Asignarlo a una categoría y, si corresponde, a un milestone.
4. Incluir un ejemplo, pasos, errores y una fuente.
5. Ejecutar:

```bash
npm run check
```

### Agregar un nodo React

1. Agregar el nodo base y sus prerrequisitos en `src/reactGraph.js`.
2. Agregar o extender el contenido en la capa temática apropiada.
3. Agregar fuentes en `src/reactSources.js`.
4. Agregar preguntas de entrevista en `src/reactInterviewQuestions.js` si corresponde.
5. Asignar el nodo a milestones y bandas de seniority cuando corresponda.
6. Ejecutar:

```bash
npm run check
```

La auditoría falla si faltan explicaciones, ejemplos, fallos, fuentes, dependencias válidas o preguntas con opciones mal formadas.

## Decisiones importantes

### Progreso sin bloqueo duro

Las dependencias son una guía pedagógica. El usuario puede comenzar por una categoría concreta o completar un nodo fuera de orden. Esto permite estudiar para una entrevista con tiempo limitado sin perder la representación conceptual del grafo.

### Quiz basado en el contenido de la card

Las respuestas correctas se derivan del contenido que el usuario acaba de estudiar, en vez de mantener un segundo sistema de respuestas manual completamente separado. Así el quiz comprueba comprensión del material mostrado y la auditoría puede verificar que cada nodo tenga cobertura mínima.

### TTS del navegador

La lectura se mantiene en el cliente para evitar dependencias, costos, credenciales y servidores adicionales. La voz y su calidad dependen del navegador y del sistema operativo del usuario.

### Diagramas Mermaid

Los diagramas se cargan de forma diferida cuando se necesitan. Esto evita cargar todo Mermaid durante el primer render, aunque el build todavía muestra warnings de chunks grandes por las librerías de diagramas.

## Validación

La validación principal se ejecuta con:

```bash
npm run check
```

La auditoría actual valida, entre otras cosas:

- 101 nodos React;
- 212 dependencias válidas;
- 110 preguntas de referencia;
- contenido mínimo por card;
- fuentes HTTPS;
- dependencias con prioridad anterior;
- tres preguntas propias por nodo;
- cuatro opciones por pregunta;
- una respuesta correcta válida;
- explicación posterior a cada respuesta;
- longitud visual equilibrada entre opciones;
- consistencia de milestones, seniority y deep dives.

El build puede mostrar warnings de Vite sobre chunks grandes relacionados con Mermaid y las librerías de diagramación. Actualmente no impiden generar el build.

## Estado del proyecto

El proyecto es una aplicación de estudio local y no requiere backend propio. El progreso se guarda en el navegador, por lo que limpiar el storage del sitio elimina el avance local.

La información de las cards vive en código fuente. Para publicar cambios de contenido hay que modificar los archivos correspondientes, volver a ejecutar la auditoría y generar un nuevo build.
