# Feature Specification: Clean Learning Workspace V2

**Feature Branch**: `001-clean-workspace-v2`  
**Created**: 2026-09-03  
**Status**: Ready for Design & Implementation  
**Mission**: Construir una estación de trabajo de aprendizaje y maestría técnica para ingenieros senior/staff, separando estrictamente la lógica de dominio headless de la capa de presentación, con diseño editorial de alta densidad y verificación automatizada sin sesgo de implementaciones previas.

---

## User Scenarios & Functional Requirements

### User Story 1 - Navegación Topológica, Currículum y Progresión de Madurez (P1 🎯 MVP)

Como ingeniero de software preparándome para entrevistas técnicas senior/staff,  
Quiero explorar el temario técnico estructurado por categorías, prerrequisitos topológicos, bandas de seniority e hitos de aprendizaje, con soporte para rutas directas en URL y alternativas de visualización espacial (cuadrícula de conceptos y grafo topológico interactivo),  
Para comprender mi nivel real de preparación y avanzar sistemáticamente por la ruta formativa óptima.

**Criterios de Aceptación y Reglas de Negocio**:
1. **Montaje y Datos Iniciales**: Al iniciar la aplicación, se carga el grafo activo con sus conceptos curriculares, estados de maestría, métricas de avance y la recomendación topológica del siguiente paso según dependencias y prioridades.
2. **Conmutación de Ecosistema**: El usuario puede alternar instantáneamente entre los currículums de React y Rails, actualizando categorías, nodos y estado local sin recargar la página.
3. **Filtro Taxonómico**: Al seleccionar una categoría, la vista filtra los conceptos y recalcula la recomendación topológica dentro de dicha área de enfoque.
4. **Búsqueda Rápida y Acciones Globales (Command Palette)**: Mediante el atajo de teclado (`Ctrl+K` / `Cmd+K`) o affordance accesible, se accede a un buscador omni-canal para filtrar conceptos en tiempo real y ejecutar acciones globales clave (*Flashcards*, *Seniority*, *Ajustes de IA*).
5. **Enrutamiento Bidireccional y Navegación Histórica**: La selección de un concepto sincroniza la URL canónica (`/:graph/card/:nodeId`) y responde a los eventos de historial del navegador (`popstate` / Atrás y Adelante).
6. **Inspección de Seniority y Milestones**: El usuario puede consultar el desglose de su nivel de madurez técnica a través de bandas de seniority (*React Profesional*, *Senior Frontend*, *Staff/Lead*, *Design Systems*) e hitos curriculares con porcentajes y competencias dominadas.
7. **Motor de Orientación Topológica**: El sistema calcula y clasifica la recomendación del siguiente paso en tres niveles de prioridad según el estado de los prerrequisitos.
8. **Visualización Topológica con Pan & Zoom**: En la visualización de grafo dirigido (DAG), el usuario puede explorar dependencias con manipulación fluida de traslación (pan) y ampliación (zoom), con controles de recentrado y filtros de maestría.

---

### User Story 2 - Experiencia Guiada de Estudio en 4 Etapas Pedagógicas (P2)

Como estudiante técnico,  
Quiero acceder a una experiencia de estudio guiada en 4 etapas (*01 Leer*, *02 Aprender*, *03 Parafrasear*, *04 Evaluar*), con comparativa de código Naive vs Senior, preguntas de entrevista FAANG, tutor socrático, formulación activa con dictado por voz y evaluación analítica por IA,  
Para internalizar modelos mentales profundos, ensayar mi comunicación técnica y calibrar mi nivel contra los estándares de contratación de la industria.

**Criterios de Aceptación y Reglas de Negocio**:
1. **Etapa 01 Leer (Comprensión del Modelo Mental)**:
   - Presenta el concepto en una frase, justificación arquitectónica, comparativa pedagógica interactiva (*Enfoque ingenuo con causa de fallo en producción* vs *Patrón senior con trade-offs asumidos*), paso a paso de ejecución y riesgos.
   - Enlaces a términos de bajo nivel (glosario deep-dive), fuentes oficiales y preguntas de entrevista desbloqueables según prerrequisitos.
   - Navegación contextual del flujo conceptual (*Antes → Ahora → Después*).
2. **Etapa 02 Aprender (Tutor Socrático Interactivo)**:
   - Espacio de diálogo socrático guiado con preguntas rápidas de diagnóstico y trade-offs.
   - Posibilidad de sintetizar las conclusiones de la conversación e integrarlas al borrador de estudio.
3. **Etapa 03 Parafrasear (Formulación Activa)**:
   - Editor de formulación técnica con opción de dictado por voz mediante `SpeechRecognition` nativo.
   - Métricas de extensión en tiempo real (caracteres, palabras) y desglose de chunks conceptuales.
   - Guardado local automático y persistente ante recargas.
4. **Etapa 04 Evaluar (Calibración con IA y Rúbrica)**:
   - Streaming en tiempo real del progreso de evaluación con cronómetro y control de cancelación.
   - Scorecard analítico sobre escala 0–120 (base 100 + 20 de excelencia senior) con veredicto conciso y desglose en rúbrica de 4 dimensiones: `accuracy`, `causalityAndTradeoffs`, `application` y `completeness`.
   - Navegación histórica entre evaluaciones previas del mismo concepto.
5. **Modo Zen / Inmersivo**:
   - Capacidad de conmutar a una vista inmersiva a pantalla completa para eliminar distracciones visuales durante la sesión de estudio.
6. **Accesibilidad y Cierre**:
   - Cierre accesible con tecla `Escape`, contención de foco ARIA (`role="dialog"`), y reseteo automático de posición de lectura al cambiar de etapa.

---

### User Story 3 - Tareas Asíncronas en Segundo Plano y HUD Global (P3)

Como usuario que realiza evaluaciones con modelos de lenguaje con razonamiento profundo,  
Quiero poder continuar explorando el temario mientras la IA procesa la respuesta en segundo plano, disponer de un indicador HUD accesible y poder cancelar la petición en cualquier momento,  
Para no sufrir tiempos de espera bloqueantes ni interrumpir mi ritmo de estudio.

**Criterios de Aceptación y Reglas de Negocio**:
1. **Ejecución en Background**: Si el usuario sale de la vista de evaluación mientras el streaming está activo, la tarea continúa procesándose en segundo plano.
2. **Indicador HUD Global**: Un indicador flotante no bloqueante muestra el estado de la tarea en curso, el concepto evaluado y el conteo de caracteres recibidos.
3. **Acciones del HUD**: Permite abrir directamente la vista de la tarea en curso o cancelar la evaluación inmediatamente mediante `AbortController`.
4. **Sincronización Multi-Pestaña**: El estado de las tareas se sincroniza entre pestañas del navegador mediante `BroadcastChannel`.

---

### User Story 4 - Lectura Asistida por Voz (TTS Sincronizado) (P4)

Como usuario que aprende mejor escuchando o busca descansar la fatiga visual,  
Quiero reproducir la explicación conceptual mediante síntesis de voz nativa (`SpeechSynthesis`),  
Para asimilar explicaciones complejas de manera auditiva con controles accesibles de pausa y reanudación.

---

### User Story 5 - Gestión Privada de Proveedores (BYOK) y Respaldo Local (P5)

Como usuario que valora la privacidad y la soberanía sobre sus datos de estudio,  
Quiero configurar mis propias credenciales de modelos de IA (OpenRouter, OpenAI, Groq, Ollama) y exportar/importar respaldos completos en formato JSON,  
Para mantener propiedad absoluta de mis notas, borradores y calificaciones sin dependencia de servidores centrales.

**Criterios de Aceptación y Reglas de Negocio**:
1. **Configuración Local de Claves**: Las API keys se almacenan únicamente en el almacenamiento local del cliente (`localStorage` / cifrado nativo en desktop).
2. **Prueba de Conexión**: Permite verificar la conectividad con el proveedor configurado antes de activarlo.
3. **Portabilidad de Respaldo**: Exportación e importación de un archivo JSON validado contra el esquema de datos del workspace, restaurando borradores, historial y configuración.

---

### User Story 6 - Repaso Activo con Flashcards (P6)

Como usuario realizando sesiones de calentamiento antes de entrevistas,  
Quiero alternar a un modo de flashcards con volteo interactivo y filtros por nivel de maestría,  
Para ejercitar la memoria de trabajo sobre conceptos clave y preguntas directas de entrevista.

**Criterios de Aceptación y Reglas de Negocio**:
1. **Vista de Flashcards**: Presenta los conceptos en formato de tarjetas de repaso con filtros de categoría y dominio.
2. **Volteo Interactivo**: Muestra en el anverso el desafío o pregunta de entrevista y en el reverso la respuesta técnica clave con razonamiento arquitectónico.
3. **Acceso a Profundización**: Permite saltar directamente desde cualquier tarjeta a la sesión de estudio completa del concepto.

---

### User Story 7 - Ergonomía y Navegación Móvil (P7)

Como usuario que estudia desde dispositivos móviles o tablets en tránsito,  
Quiero una navegación táctil fluida orientada a la zona del pulgar con áreas de toque confortables y márgenes de seguridad para la pantalla,  
Para contar con una experiencia de lectura y estudio cómoda sin controles diminutos ni desbordes.

**Criterios de Aceptación y Reglas de Negocio**:
1. **Adaptación a Pulgar**: En pantallas móviles (<768px), los controles principales y la barra/dock de navegación (`mobile-bottom-nav`) se posicionan al alcance del pulgar, respetando `safe-area-inset-bottom` y objetivos táctiles $\ge 44\times 44\text{px}$.
2. **Navegación Unificada**: Permite acceder con un toque a las vistas principales: Grafo, Flashcards, Progreso (Seniority), Búsqueda y Ajustes.
3. **Capas y Modales en Móvil**: Al abrir vistas de detalle o estudio, el contenido se adapta limpiamente sin que los controles de fondo interfieran visualmente.

---

## Esquemas de Datos del Dominio (Headless)

### 1. Modelo de Lección Pedagógica (`node.lesson`)
```typescript
interface PedagogicalLesson {
  level: "mid" | "senior" | "staff";
  summary: string;
  why: string;
  codeComparison: {
    naive: { label: string; code: string; whyItFails: string };
    production: { label: string; code: string; tradeOff: string };
  };
  steps: string[];
  pitfalls: string[];
  takeaway: string;
  deepDives?: Array<{ term: string; trigger: string; definition: string; mentalModel: string }>;
  interviewQuestions?: Array<{ question: string; answerSummary: string; whyAsked: string; isUnlocked: boolean }>;
}
```

### 2. Rúbrica de Evaluación Canónica (0–120)
```typescript
interface EvaluationResult {
  score: number; // 0..120 (base 100 + 20 bonus)
  verdict: string;
  rubric: {
    accuracy: { score: number; max: 40; label: string; note: string };
    causalityAndTradeoffs: { score: number; max: 25; label: string; note: string };
    application: { score: number; max: 20; label: string; note: string };
    completeness: { score: number; max: 15; label: string; note: string };
  };
  feedback: { strengths: string[]; gaps: string[]; misconceptions: string[]; nextAttemptPrompt: string };
}
```
