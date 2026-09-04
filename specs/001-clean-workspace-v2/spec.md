# Feature Specification: Clean Learning Workspace V2

**Feature Branch**: `001-clean-workspace-v2`  
**Created**: 2026-09-03  
**Status**: Ready for Implementation  
**Input**: User description: "Reconstruir la UI y la arquitectura de Learning Workspace de forma limpia, separando la lógica headless de la presentación, siguiendo Spec-Driven Development con GitHub Spec Kit y preservando todas las gemas de interacción y pedagogía validadas en el prototipo."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegación Topológica, Grafo, Routing, Seniority Bands y Topologías Alternativas (Priority: P1) 🎯 MVP

Como desarrollador que se prepara para una entrevista técnica senior,  
quiero visualizar el grafo de conceptos organizado por categorías, precedencias, milestones, bandas de seniority y diferentes topologías visuales (Clásico, Carriles, Radial, Ruta), con gestos de Pan & Zoom y sincronización bidireccional de URL,  
para entender mi progreso real hacia roles Senior/Lead y navegar ágilmente por el mapa curricular según mi preferencia espacial.

**Why this priority**: Es el núcleo de la propuesta de valor. Sin el mapa topológico, la visualización de relaciones y la sincronización de URL, la aplicación carece de estructura formativa.

**Independent Test**: Montar la aplicación, alternar entre React y Rails, verificar la carga de categorías y nodos, probar la sincronización de rutas (`/:graph/card/:id`), abrir el panel de progreso y comprobar el cálculo de Seniority Bands y Milestones.

**Acceptance Scenarios**:

1. **Given** el usuario inicia la aplicación,  
   **When** se monta la pantalla principal,  
   **Then** se renderiza el grafo activo con nodos, colores de categoría, contador de progreso y franja de "Próximo desafío".
2. **Given** el usuario en el grafo de React,  
   **When** hace clic en el switch de grafo "Rails entrevistas",  
   **Then** la vista cambia de inmediato al grafo de Rails, actualizando categorías, nodos y progreso persistido en `localStorage`.
3. **Given** el usuario visualiza todas las categorías,  
   **When** hace clic en una categoría específica,  
   **Then** el canvas aísla los nodos de esa categoría y la franja de "Próximo desafío" recalcula el siguiente nodo sugerido dentro de ese foco.
4. **Given** el usuario presiona `Ctrl+K`,  
   **When** se abre la Command Palette y tipea un concepto o comando rápido,  
   **Then** la lista filtra en tiempo real permitiendo tanto abrir nodos como ejecutar acciones globales directas (*📇 Flashcards*, *📊 Seniority*, *⚙️ Ajustes BYOK*).
5. **Given** el usuario navega a un nodo o abre la URL directa `/:graph/card/:nodeId`,  
   **When** se carga la página o presiona Atrás/Adelante en el navegador (`popstate`),  
   **Then** la card correspondiente se abre o cierra automáticamente sincronizando el historial de navegación sin recargar.
6. **Given** el usuario hace clic en el panel de progreso de la cabecera,  
   **When** se despliega el panel lateral de progreso,  
   **Then** se visualizan las **Seniority Bands** (*Mid-Level, Senior Frontend, Staff / Lead, Design Systems*) indicando capacidades cerradas, y las tarjetas de **Milestones** con descripciones, barras de porcentaje y badge `✓ COMPLETO`.
7. **Given** el cálculo de recomendación topológica,  
   **When** se evalúa el temario,  
   **Then** el motor de orientación clasifica recomendaciones en 3 niveles: Nivel 1 ("MEJOR SIGUIENTE"), Nivel 2 y Nivel 3.
8. **Given** el lienzo del grafo,  
   **When** el usuario realiza gestos de arrastre con puntero o rueda de ratón,  
   **Then** el hook `usePanZoom` aplica traslación y zoom centrado en las coordenadas del cursor, ignorando arrastres menores a 5px para no anular los clics en los nodos.
9. **Given** la barra de variantes visuales del grafo,  
   **When** el usuario selecciona entre *Clásico*, *Carriles*, *Radial* o *Ruta*,  
   **Then** el lienzo adapta la proyección geométrica (layout Sugiyama, swimlanes por categoría, constelación polar o camino en serpiente) respetando el estado de dominio de cada concepto.

---

### User Story 2 - Ruta de Estudio Guiada en 4 Etapas con Interacciones Ricas (Priority: P2)

Como estudiante técnico,  
quiero que al abrir un nodo se despliegue un modal con una ruta estructurada de 4 etapas (*01 Leer*, *02 Aprender*, *03 Parafrasear*, *04 Evaluar*), con herramientas de dictado por voz, deep-dives contextuales, preguntas de entrevista FAANG desbloqueables, navegación histórica, modo Zen, chips de preguntas rápidas al mentor, reconciliación del chat con el borrador y desglose cognitivo por chunks,  
para asimilar conceptos, autoevaluarme verbalmente y calibrar mi nivel técnico frente a estándares de la industria.

**Why this priority**: Es el corazón pedagógico del producto. Combina active recall, speech-to-text para ensayar entrevistas orales, y rúbricas analíticas con trazabilidad histórica.

**Independent Test**: Abrir un nodo, revisar las 4 pestañas, probar dictado por voz, verificar que el scroll se resetea a 0 en cada pestaña, abrir preguntas de entrevista y validar la navegación entre intentos anteriores.

**Acceptance Scenarios**:

1. **Given** un nodo seleccionado en el grafo,  
   **When** el usuario hace clic en el nodo o presiona `Enter`,  
   **Then** se abre el modal de estudio en la pestaña *01 Leer*, mostrando resumen, por qué importa, código con sintaxis resaltada y trade-offs.
2. **Given** la etapa *01 Leer*,  
   **When** el texto contiene términos técnicos avanzados reconocidos en el glosario de profundización,  
   **Then** se renderizan badges discretos `?` que al hacer clic abren un popover flotante posicionado con la explicación de bajo nivel ("Deep Dive") sin salir de la lección.
3. **Given** la etapa *01 Leer*,  
   **When** se expande la sección "Cobertura de Entrevista",  
   **Then** se listan las preguntas de referencia FAANG/GreatFrontEnd de ese concepto, indicando cuáles están desbloqueadas y cuáles bloqueadas por prerrequisitos pendientes.
4. **Given** la etapa *01 Leer*,  
   **When** existen fuentes oficiales (`lesson.sources`) o conceptos relacionados (`selectedRelatedNodes`),  
   **Then** se muestran enlaces externos con icono `↗` y botones directos para saltar a repasar conceptos relacionados sin perder la lección actual.
5. **Given** el usuario cambiando entre las pestañas del modal (*01* a *04*),  
   **When** se selecciona una pestaña diferente,  
   **Then** el contenedor del modal resetea automáticamente su scroll (`scrollTop = 0`).
6. **Given** el usuario navegando dentro del modal,  
   **When** hace clic en el flujo conceptual Antes → Ahora → Después,  
   **Then** puede saltar a un prerrequisito o dependiente y se activa el botón en la cabecera: `← Volver a [Concepto Anterior]`.
7. **Given** el usuario en cualquier etapa del modal de estudio,  
   **When** activa el botón de "Modo Zen",  
   **Then** el modal se expande a pantalla completa sin distracciones visuales.
8. **Given** la etapa *02 Aprender*,  
   **When** el usuario abre la conversación con el tutor,  
   **Then** se presentan 4 chips de preguntas rápidas (`¿Por qué falla el enfoque ingenuo?`, `¿Podrías explicarlo con una analogía visual?`, `¿Cómo diagnostico este error en producción?`, `Tengo una duda con el código...`) que insertan y envían la consulta de inmediato.
9. **Given** la etapa *02 Aprender* con un intercambio socrático activo,  
   **When** el usuario presiona "✨ Integrar chat a mi respuesta",  
   **Then** el endpoint `reconcileParaphraseStream` sintetiza las conclusiones del chat en el borrador de la etapa *03 Parafrasear* y calcula su hash de reconciliación.
10. **Given** la etapa *03 Parafrasear*,  
    **When** el usuario presiona "Dictar por voz" y habla al micrófono,  
    **Then** la API `SpeechRecognition` nativa transcribe sus palabras en tiempo real al editor de texto y se auto-guarda en IndexedDB.
11. **Given** la etapa *03 Parafrasear*,  
    **When** el usuario conmuta entre `✏️ Editor` y `📖 Chunks de Lectura`,  
    **Then** la vista alterna entre el campo de redacción crudo y la descomposición en párrafos cognitivos con estadísticas de densidad léxica.
12. **Given** la etapa *03 Parafrasear*,  
    **When** la redacción contiene menos de 140 caracteres,  
    **Then** el contador exhibe una advertencia discreta: *"un poco corta para medir profundidad"*.
13. **Given** un borrador redactado en la etapa *03 Parafrasear*,  
    **When** el usuario presiona `Ctrl+Enter` o hace clic en "Evaluar con IA",  
    **Then** la etapa *04 Evaluar* muestra el `EvaluationLoader` con cronómetro de segundos transcurridos, barra de latencia explicativa para *thinking models*, contador de caracteres recibidos vía SSE y botón para cancelar la evaluación.
14. **Given** una evaluación completada en la etapa *04 Evaluar*,  
    **When** se renderiza el resultado final,  
    **Then** se exhibe el veredicto ejecutivo destacado (`conciseVerdict`), la rúbrica analítica en 4 dimensiones (0–120) con el bonus dorado (101-120), las notas explicativas desplegables y, si el score supera 100, el aura dorada de excelencia.
15. **Given** un nodo con múltiples intentos guardados,  
    **When** el usuario visita la etapa *04 Evaluar*,  
    **Then** una barra de paginación histórica (`← Evaluación X de Y →`) permite viajar en el tiempo para inspeccionar respuestas anteriores en modo solo lectura con un botón "Volver a la versión actual".
16. **Given** una evaluación guardada cuya lección en el código sufrió modificaciones posteriores,  
    **When** el usuario visualiza el resultado,  
    **Then** se muestra una alerta: *"Esta evaluación corresponde a una versión anterior de la card. Reintentá para medir el contenido actual."*

---

### User Story 3 - Tareas Asíncronas en Segundo Plano, HUD Global y Cancelación (Priority: P3)

Como usuario que realiza evaluaciones con modelos de IA con pensamiento profundo (*thinking models*),  
quiero poder cerrar el modal o navegar a otros nodos mientras la IA procesa, ver un HUD flotante con el estado de las tareas y poder cancelarlas en cualquier momento,  
para no tener mi flujo de estudio bloqueado esperando respuestas largas.

**Why this priority**: Evita la frustración de esperas largas (5–40s), permite paralelizar el estudio de varios conceptos y otorga control al usuario para abortar peticiones lentas o erróneas.

**Independent Test**: Iniciar una evaluación, cerrar el modal, verificar la aparición del HUD flotante en la esquina inferior derecha con contador de caracteres en tiempo real, presionar "Cancelar" y comprobar que la petición se aborta limpiamente.

**Acceptance Scenarios**:

1. **Given** una evaluación en curso en la card A,  
   **When** el usuario cierra el modal y navega por el grafo,  
   **Then** un HUD flotante en la esquina inferior derecha muestra el nodo activo, el estado del streaming y el contador de caracteres recibidos.
2. **Given** el HUD flotante con múltiples tareas activas,  
   **When** el usuario hace clic o hover sobre el HUD,  
   **Then** se despliega una lista emergente con cada tarea, botón "Abrir card →" y botón "Cancelar ✕".
3. **Given** una evaluación en progreso,  
   **When** el usuario presiona el botón "Cancelar" en el loader o en el HUD,  
   **Then** se dispara el `AbortController` cancelando la conexión SSE y liberando el estado sin errores en consola.
4. **Given** el loader de progreso de evaluación,  
   **When** el tiempo transcurre,  
   **Then** el componente actualiza el tiempo en segundos y transiciona entre fases (*Normal* → *Lento* → *Crítico*).
5. **Given** dos pestañas abiertas en el navegador en la misma sesión,  
   **When** una tarea muta o finaliza en la pestaña 1,  
   **Then** la pestaña 2 recibe el evento vía `BroadcastChannel` y actualiza su estado en tiempo real.

---

### User Story 4 - Lectura Asistida por Voz (TTS Sincronizado) (Priority: P4)

Como usuario que aprende mejor escuchando o descansando la vista,  
quiero poder reproducir por audio secciones de la card con la voz nativa del navegador,  
para escuchar explicaciones técnicas con sincronización visual por fragmentos.

**Why this priority**: Aumenta la accesibilidad y el confort en sesiones de estudio prolongadas sin requerir servicios TTS pagos externos.

**Independent Test**: En la etapa *01 Leer*, presionar el botón de audio de cualquier sección y verificar que el navegador vocaliza el texto y resalta visualmente el párrafo activo.

**Acceptance Scenarios**:

1. **Given** el usuario está en la etapa *01 Leer*,  
   **When** presiona el botón de audio en una sección,  
   **Then** el `SpeechSynthesis` del navegador inicia la lectura y el fragmento se resalta visualmente con pulso animado.
2. **Given** un audio reproduciéndose,  
   **When** el usuario presiona pausar o selecciona otra sección,  
   **Then** la locución anterior se detiene limpiamente sin colisiones de audio.

---

### User Story 5 - Gestión Privada BYOK y Portabilidad de Respaldo JSON (Priority: P5)

Como desarrollador que cuida su privacidad y desea conservar sus datos de estudio,  
quiero configurar mis propias API keys de forma privada y poder exportar/importar un archivo de respaldo JSON con todo mi historial,  
para tener soberanía absoluta de mis notas y poder migrar entre mi laptop, la web y Electron Desktop.

**Why this priority**: Garantiza la filosofía Local-First real y la portabilidad completa del aprendizaje sin lock-in.

**Independent Test**: En el modal de ajustes, presionar "Exportar respaldo" para descargar el JSON, borrar un intento de prueba, presionar "Importar respaldo" y verificar que el estado se restaura al 100%.

**Acceptance Scenarios**:

1. **Given** el modal de proveedores de IA abierto,  
   **When** el usuario selecciona un proveedor o ingresa credenciales,  
   **Then** puede ejecutar el test de inferencia mínima y guardar la configuración localmente (con cifrado `safeStorage` si corre en Electron).
2. **Given** el modal de ajustes abierto,  
   **When** el usuario presiona "Exportar respaldo",  
   **Then** se genera y descarga un archivo `learning-workspace-backup-[fecha].json` conteniendo todos los borradores, intentos, notas históricas y configuraciones.
3. **Given** un archivo de respaldo válido,  
   **When** el usuario presiona "Importar respaldo" y carga el archivo,  
   **Then** la aplicación valida la firma y versión del archivo, restaura los datos en IndexedDB y `localStorage`, y refresca el estado en pantalla.

---

### User Story 6 - Modo Flashcards y Repaso Activo (Priority: P6)

Como usuario que desea hacer sesiones rápidas de repaso espaciado o calentamiento antes de una entrevista,  
quiero alternar a una vista de flashcards con animación de volteo 3D y filtros por nivel de dominio,  
para poner a prueba mi memoria de trabajo sobre conceptos clave de forma ágil.

**Why this priority**: Complementa la exploración topológica del grafo con un flujo ágil de autoevaluación rápida (active recall) estilo Anki.

**Independent Test**: Cambiar el modo de vista de "Grafo" a "Flashcards", aplicar filtros (ej. "Base < 100"), voltear tarjetas para ver la respuesta técnica y registrar la práctica con racha.

**Acceptance Scenarios**:

1. **Given** la pantalla principal,  
   **When** el usuario alterna el modo de vista a "Flashcards",  
   **Then** el canvas se reemplaza por la cuadrícula de tarjetas de memoria técnica con su categoría y estado de dominio.
2. **Given** una flashcard visible,  
   **When** el usuario hace clic en la tarjeta o presiona la barra espaciadora,  
   **Then** la tarjeta se voltea con animación 3D revelando la respuesta técnica y el por qué importa.
3. **Given** el modo de práctica de flashcards activo,  
   **When** el usuario marca una tarjeta como dominada y avanza a la siguiente,  
   **Then** se incrementa el contador de racha (*streak*) de la sesión.

---

### User Story 7 - Ergonomía Móvil y Navegación Inferior (Priority: P7)

Como usuario que repasa conceptos desde un smartphone o tablet,  
quiero contar con una barra de navegación inferior fija para cambiar entre vistas con el pulgar,  
para tener una experiencia ergonómica en pantallas táctiles sin sacrificar espacio de lectura.

**Why this priority**: Facilita el estudio móvil en tiempos muertos o viajes en transporte sin depender de controles superiores apretados.

**Independent Test**: Reducir el viewport a ancho móvil (< 768px), verificar la presencia de la barra inferior con iconos accesibles y comprobar la navegación táctil a Grafo, Flashcards, Progreso, Búsqueda y Ajustes.

**Acceptance Scenarios**:

1. **Given** la aplicación ejecutándose en un viewport menor a 768px,  
   **When** se carga la pantalla,  
   **Then** se despliega la barra de navegación inferior fija (`mobile-bottom-nav`) con padding para `safe-area-inset-bottom` y accesos directos a Grafo, Flashcards, Progreso, Búsqueda y Ajustes, permaneciendo oculta en pantallas de escritorio (> 768px).
2. **Given** la barra de navegación inferior,  
   **When** el usuario toca en "Progreso",  
   **Then** se abre el panel de progreso y mapa de seniority ocupando la pantalla móvil de forma limpia.

---

## Edge Cases & Invariantes del Sistema

1. **Cero pérdida de borradores**: Si el usuario recarga la página o se cierra el navegador mientras escribe o dicta un parafraseo, el borrador en IndexedDB debe restaurarse idéntico al reabrir el nodo.
2. **Invariante de Puntuación Canónica (0–120)**:
   - Cobertura básica completa = exactamente 100 puntos.
   - Puntos 101 a 120 = bonus de excelencia y profundidad (aura dorada `excellence-aura`).
3. **Invariante de Rendimiento y Modularidad**:
   - Ningún archivo de componente en `src/components/` o `src/hooks/` superará las 150 líneas de código.
   - Todo componente pesado (Mermaid, PrismJS, Charts) se difiere dinámicamente (`React.lazy`).
4. **Tolerancia y Fallbacks de Web APIs**:
   - Si `SpeechRecognition` no está soportado por el navegador, el botón de dictado por voz se oculta sin romper la interfaz.
   - Si una petición SSE de evaluación excede el tiempo esperado, el loader ofrece abortar de forma limpia con `AbortController`.
5. **Invariante de Integridad de Respaldo**:
   - Todo archivo de importación debe validar `app === "learning-workspace"` y coincidir con el schema de versión esperado antes de mutar el almacenamiento local.
