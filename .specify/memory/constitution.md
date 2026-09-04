# CONSTITUTION: Learning Workspace (v2 Architecture)

<!-- GitHub Spec Kit: Project Constitution -->
**Versión:** 2.0.0  
**Estado:** Activa  
**Ámbito:** Todo el repositorio `KnowGraph` / `Learning Workspace`

---

## 1. Visión y Propósito Fundacional

Learning Workspace es un *cockpit* de dominio técnico y preparación intensiva para entrevistas Senior y Tech Lead. La aplicación convierte temarios complejos (React, Rails, Arquitectura Web) en un grafo activo de estudio guiado, parafraseo socrático y evaluación analítica por IA.

Esta Constitución establece las reglas de ingeniería innegociables para erradicar la deuda técnica y el código desordenado (*vibe coding*), asegurando que el proyecto tenga un estándar de calidad, mantenibilidad y elegancia digno de un perfil Senior/Staff.

---

## 2. Principios Arquitectónicos Innegociables

### Artículo I: Política de Cero Vibe-Coding (Spec-Driven First)
1. **Ninguna línea de UI se escribe sin spec**: Todo componente, hook o funcionalidad nueva debe responder a una tarea explícita en `specs/`.
2. **Trazabilidad**: Cada commit debe referenciar el requerimiento o tarea de la especificación que resuelve.
3. **No a la acumulación de parches**: Si una feature requiere modificar un componente existente y este supera sus límites, se refactoriza y descompone antes de agregar la nueva función.

### Artículo II: Separación Estricta de Capas (Headless-First)
El sistema se organiza en tres capas estrictamente unidireccionales:

```text
┌──────────────────────────────────────────────────────────┐
│  CAPA 1: DOMINIO Y LÓGICA PURA (Headless)               │
│  - Grafos, orden topológico, prerrequisitos, milestones  │
│  - Persistencia IndexedDB (learningStore)                │
│  - Schemas Zod y contratos de IA                         │
│  REGLA: 0 JSX, 0 CSS, 0 DOM. 100% testeable en Node.js.  │
└────────────────────────────┬─────────────────────────────┘
                             │ Provee snapshots / métodos
                             ▼
┌──────────────────────────────────────────────────────────┐
│  CAPA 2: ORQUESTACIÓN Y UI STATE (Hooks & Stores)        │
│  - useStudySession (ruta de 4 etapas: Read/Learn/Coach/Eval)
│  - useBackgroundTask (tareas asíncronas del Juez/Eval)   │
│  - useAudioNarrator (lectura TTS por chunks)             │
│  - useCommandPalette (navegación y atajos Ctrl+K)        │
│  REGLA: Lógica de interacción limpia, sin renderizado.   │
└────────────────────────────┬─────────────────────────────┘
                             │ Provee estado y callbacks
                             ▼
┌──────────────────────────────────────────────────────────┐
│  CAPA 3: PRESENTACIÓN VISUAL (Dumb Components)           │
│  - Componentes React puros, layout y estilos modulares   │
│  REGLA: Máximo 150 líneas por archivo. Solo renderizado. │
└──────────────────────────────────────────────────────────┘
```

### Artículo III: Límite de Tamaño y Responsabilidad Única (SRP)
1. **Límite de 150 líneas**: Ningún archivo de componente React puede superar las 150 líneas de código.
2. **Prohibición de monolitos**: `App.jsx` debe ser un coordinador limpio de alto nivel de no más de 120 líneas. No puede contener definiciones de datos, constantes de audio, ni layouts complejos en línea.
3. **Descomposición inmediata**: Si un componente requiere más de 4 hooks de estado (`useState`), debe extraerse la lógica a un Custom Hook de la Capa 2.

### Artículo IV: Contratos y Tipado en Fronteras
1. Todo dato que cruza fronteras externas (Gateway de IA, respuestas SSE, almacenamiento en IndexedDB o localStorage) debe validarse mediante schemas `Zod`.
2. Los errores de validación deben producir mensajes tipados y legibles para el usuario, nunca excepciones no controladas.

### Artículo V: Preservación de las Gemas de Interacción
La reconstrucción limpia no simplifica ni elimina las funcionalidades avanzadas validadas en el prototipo original:
- **Ruta de estudio de 4 etapas**: *01 Leer* → *02 Aprender* → *03 Parafrasear* → *04 Evaluar*.
- **Background Tasks Reactivas**: Las evaluaciones y llamadas al Juez Pedagógico continúan ejecutándose en segundo plano con notificación en vivo si el usuario cambia de card.
- **Sincronización Multi-Pestaña**: Coordinada mediante `BroadcastChannel` para no perder tareas ni estados concurrentes.
- **Lectura por Voz Sincronizada**: Resaltado visual del bloque de texto que se está vocalizando mediante `SpeechSynthesis`.
- **Rúbrica Analítica de Dominio (0–120)**: Cobertura completa en 100 pts y excelencia técnica opcional en 101–120 pts.

### Artículo VI: Seguridad y Privacidad Local-First
1. **Cero exposición de secretos**: Las API keys BYOK nunca se envían a servidores de terceros que no sean el proveedor configurado explícitamente por el usuario.
2. **Defensa contra SSRF**: El Gateway valida todas las URLs de proveedores contra IPs privadas y DNS loopback antes de emitir requests en entornos públicos.
3. **Cifrado local**: En Electron, las credenciales se almacenan cifradas en disco mediante `safeStorage` (DPAPI/Keychain) con permisos `0o600`.

### Artículo VII: Disciplina Visual y CSS
1. **Prohibición de hojas de estilo monstruo**: Queda prohibido mantener archivos CSS monolíticos sin estructura.
2. **Modularidad**: Cada componente o módulo visual tiene sus estilos encapsulados o utiliza utilidades CSS predecibles.
3. **Tema Oscuro Técnico**: La paleta oficial es la definida en `DESIGN.md` (Cockpit nocturno, canvas `#0c0f14`, acentos `#70ddd4`, `#6eb7ff`, `#55d98a`, `#e6b95b`).

---

## 3. Proceso de Verificación y Compliance

Cualquier Pull Request o implementación se considera terminada únicamente cuando:
1. Pasa `npm run check` (`audit:react` + build limpio).
2. Pasa `npm run test:logic` al 100% sin procesos colgados.
3. Todos los archivos cumplen con el límite de 150 líneas y la separación de capas.
4. Cumple los criterios de aceptación detallados en su respectivo `tasks.md`.
