# Checklist de QA visual — Learning Workspace

Revisado: 2026-08-12, contra la app Vite local. La evidencia combinó capturas reales, interacción por mouse/teclado y revisión de los contratos de estado que no existen en el IndexedDB actual.

Estados: `Pass` = comprobado en runtime; `Finding resuelto` = se encontró, corrigió y se volvió a comprobar; `N/A verificado` = no había datos seguros para montar ese estado, pero su contrato, estilos y tests se revisaron. No quedan filas pendientes.

## Evidencia transversal

- Breakpoints capturados: `1440×900`, `1280×800`, `1024×768`, `768×900` y `390×844`.
- En escritorio el documento conserva el viewport (`scrollWidth === viewport width`, sin scroll global). En móvil hay scroll vertical de contenido, pero tras el fix `scrollWidth` quedó en `375 px` dentro de un viewport de `390 px`: sin overflow horizontal.
- Se verificaron rutas reales: `/` redirige a `/react`; `/react`, `/rails`, `/react/card/react_mental_model` y `/react/card/js_basics` abren la superficie correspondiente.
- Se ejecutaron `npm run build` y `npm run test:logic` tras los cambios de UI.

## Findings resueltos

| ID | Finding | Corrección | Revisión posterior |
| --- | --- | --- | --- |
| V-01 | El foco inicial mostraba una etapa siguiente como columna parcialmente cortada. | `GraphTopologyView` calcula cuántas etapas completas caben y ajusta su escala/anchor de forma determinista. | Capturas a 1440, 1280 y 1024: solo se ven cards completas; el control “Próximo foco” vuelve al mismo encuadre. |
| V-02 | El botón de cierre de la flashcard quedaba vacío porque el estilo global ocultaba el carácter `×`. | Se sustituyó por un SVG del mismo sistema de iconos. | Captura de detalle: icono visible, botón accesible y cierre operativo. |
| V-03 | En 390 px el panel de progreso se renderizaba en fila y hacía crecer el documento a ~5.151 px de ancho. | El panel móvil ahora apila secciones, limita su ancho y delega el desplazamiento solo a sus tiras internas. | `scrollWidth` bajó de 5151 a 375 px; desapareció la barra horizontal global. |
| V-04 | El filtro vacío de flashcards usaba un botón estirado a todo el canvas y no tenía jerarquía. | Estado vacío centrado, copy legible y acción compacta. | Captura con “Con extra dorado”: mensaje y “Ver todas” centrados y proporcionados. |
| V-05 | Un error de coaching podía mostrarse como texto poco distinguible. | Panel de error con contraste, indicador, causa y recuperación en español. | Contrato visual y el formateador de errores se revisaron; el draft no se descarta. |
| V-06 | Cambiar de tab podía conservar una posición de scroll intermedia. | La card resetea scroll horizontal y vertical al cambiar nodo o vista. | Se cambió Lectura → Coaching → Evaluar en runtime: cada superficie comenzó desde arriba. |

## A. Shell de escritorio y mapa

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| A1 | Inicio con navegación cerrada | Finding resuelto | Captura 1440: mapa protagonista, command bar compacta y sin scroll global. V-01 elimina cards cortadas. |
| A2 | Navegación abierta | Pass | Captura 1440: React/Rails, filtros, tabs y próximo desafío legibles en el rail; el canvas conserva el foco. |
| A3 | Panel de progreso | Pass + N/A verificado | Captura 1440 de panel vacío: rail propio, milestones y bandas sin desplazar el mapa. Los estados parcial/completo/dorado dependen del progreso real; estilos y cálculo de milestones se revisaron mediante contratos existentes. |
| A4 | Panel de IA | Pass + N/A verificado | Se comprobó estado sin conexión, catálogo cargado, búsqueda MiniMax y formulario de MiniMax. No se creó una conexión personal ni se envió una key solo para fabricar error/éxito. |
| A5 | Cambio de grafo | Pass | React → Rails abrió `/rails`, actualizó título, categorías, ruta sugerida y contador. `/` vuelve a React como default. |
| A6 | Cambio de modo | Pass | Grafo ↔ Flashcards probado con rail abierto/cerrado: conserva workspace y no genera scroll ni rutas inválidas. |
| A7 | Breakpoints | Finding resuelto | 1440/1280/1024/768/390 revisados. V-03 resolvió el único overflow horizontal detectado. |

## B. Grafo topológico

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| B1 | Ruta inicial | Finding resuelto | V-01: las primeras etapas y la siguiente visible entran completas; no hay medias cards. |
| B2 | Navegación expandida | Pass | Rail abierto muestra tres etapas completas y la guía contextual sin solaparse. |
| B3 | Hover y foco | Pass | Hover sobre “Modelo mental” mostró `Necesita 1 · Habilita 2`, aristas de entrada/salida de alto contraste y título completo con `<title>`. El mismo estado se conecta a `onFocus`. |
| B4 | Estados de nodo | Pass + N/A verificado | Se capturaron pendiente, score `0/120`, seleccionado y guía de ruta. Las clases para parcial, base `100/120` y excelencia dorada están cubiertas por `getNodeVisual` y CSS; el store actual no contiene esos scores para capturarlos sin alterar datos de estudio. |
| B5 | Controles | Pass | Zoom aumentó el ancho de nodo de 236.6 a 274.5 px y Alejar lo restauró. Pan, fit y próximo foco conservan el viewport sin salto. |
| B6 | Mapa completo | Pass | Fit muestra el DAG entero como overview; “Próximo foco” restaura la ruta de estudio. |
| B7 | Filtros | Pass | Aislar “Arquitectura web” dejó 19 de 101 nodos activos y actualizó el próximo desafío a Routing SPA. |

## C. Flashcards

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| C1 | Grid | Pass + N/A verificado | Grid de tres columnas a 1280 y 1440; títulos largos truncan de forma consistente. Se capturaron cards sin intento y score bajo. Base/excelencia no existen en el store actual; sus filtros y clases están cubiertos por el selector de attempts. |
| C2 | Filtros y aleatoria | Finding resuelto | “Elegir una al azar” marcó una única card y desplazó la grilla. “Con extra dorado” mostró V-04; “Ver todas” recupera el grid. |
| C3 | Detalle | Finding resuelto | Frente, reverso, metadata de modelo/duración, navegación y cierre se probaron. V-02 hace visible el cierre. |
| C4 | Traspaso a lección | Pass | “Estudiar card” desde el modal navegó a `/react/card/js_basics` y cerró la flashcard. |

## D. Card: lectura y navegación

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| D1 | Entrada / salida | Pass | Nodo → ruta de card; cierre → `/react`; atrás restaura el mapa. La card usa el viewport completo sin scroll del documento. |
| D2 | Header | Pass + N/A verificado | Se capturaron pending y score 0. El header comparte tono y estructura con los estados de mastery/extra definidos en `getScoreView`; no se creó una evaluación artificial. |
| D3 | Tabs | Finding resuelto | Lectura, Coaching y Evaluar se probaron después de scroll; V-06 garantiza inicio de superficie en cada cambio. |
| D4 | Lectura larga | Pass | Captura de card real con summary, explicación fragmentada, labels y acciones TTS por sección. Code/diagramas siguen el mismo renderer de contenido; no se detectó corte horizontal. |
| D5 | TTS | N/A verificado | Controles idle, replay, anterior/siguiente y velocidad son accesibles en header/secciones. La reproducción literal requiere una voz del navegador disponible en el dispositivo, por lo que no se forzó audio durante auditoría visual. |
| D6 | Tooltips / chunks | Pass | Hover de chunk activó foco global: texto del chunk blanco y entorno atenuado, sin ocultar código. El efecto se restringe al contenido de la vista. |
| D7 | Scroll / responsive | Pass | Desktop mantiene `body` con overflow oculto y la card usa su propio scroller. Móvil no presenta ancho excedido ni doble barra global. |

## E. Coaching

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| E1 | Vacío | Pass | Card sin borrador: instrucción clara y sin skeleton ni request automática. |
| E2 | Editor | Pass | Editor expandido sin scrollbar interior; 48 caracteres y el contador se mostraron sin mover el scroll de la card. |
| E3 | Debounce | Pass | Tras escribir se mostró PAUSA, anillo, `5s`, `Ctrl/Cmd + ↵` y `Esc`. Esc canceló la espera sin cerrar la card. |
| E4 | Streaming | N/A verificado | El parser SSE y los estados connecting/processing/scoring/coverage/hint se revisaron contra `liveReviewStream` y `LiveRequestFeedback`. No se lanzó una request de proveedor solo para producir tokens durante la auditoría. |
| E5 | Resultado | N/A verificado | Escalas 0–120, cobertura y extra dorado comparten `buildLiveReviewState`/`getScoreView`. No había un live review persistido para montar este estado sin alterar la sesión. |
| E6 | Error | Finding resuelto | V-05: mensajes de red/5xx se traducen a recuperación accionable y el campo no se limpia. |
| E7 | Historial / chat | N/A verificado | El store conserva iteraciones inmutables por hash y el componente deja editable solo la actual; no había historial de coaching en el store de auditoría para una captura fiel. |

## F. Evaluación completa

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| F1 | Vacío / borrador | Pass | Se capturaron card sin evaluación y borrador corto; el borrador existente mostró conteo y CTA de evaluación. |
| F2 | Streaming | N/A verificado | Skeleton, secciones SSE y cancelación están enlazados al mismo cliente que coaching. No se iniciaron evaluaciones facturables de prueba. |
| F3 | Resultado | Pass + N/A verificado | Captura de resultado real `0/120`, score canónico, umbral 100 y carril de excelencia hasta 120. Los estados 100 y >100 no existen localmente; cálculo y clases se revisaron. |
| F4 | Rúbricas | Pass | Expandir Precisión mostró detalle sin aumentar la altura de la rúbrica de la columna vecina. |
| F5 | Historial | Pass + N/A verificado | Línea de progreso real, intento, fecha, modelo `deepseek/deepseek-v4-flash` y duración `38.0 s` visibles. No había múltiples intentos/stale para navegar sin fabricar datos. |
| F6 | Error / retry | Finding resuelto | V-05 cubre copia recuperable y conservación de draft. Los aborts se tratan como cancelación y no como error. |

## G. Provider settings y accesibilidad transversal

| ID | Superficie / estado | Estado | Evidencia / resultado |
| --- | --- | --- | --- |
| G1 | Catálogo | Pass + N/A verificado | Catálogo Models.dev cargó 180 providers; búsqueda MiniMax filtró a 4 e informó protocolos/adaptadores. La UI de carga/error/fallback está cubierta por el estado de catálogo, sin inducir fallo de red. |
| G2 | Formulario | Pass + N/A verificado | Se revisaron Endpoint compatible, MiniMax directo y aviso de modelos locales solo desktop. OpenRouter/custom reutilizan el mismo formulario de endpoint/modelo. |
| G3 | Prueba de modelo | N/A verificado | Sin key en memoria el botón se mantiene deshabilitado, evitando requests inválidas. Los resultados del gateway se mapean a estado de prueba y error; no se expusieron credenciales. |
| G4 | Persistencia | Pass | `test:logic` cubre migración v3, múltiples conexiones y selección activa. La UI declara explícitamente que la key solo vive en la pestaña. |
| G5 | Teclado | Pass | DOM snapshot confirmó nombres accesibles; Escape cancela debounce y no cierra card durante esa prioridad. Dialogs, navegación y controles usan labels explícitos. |
| G6 | Movimiento | Pass | `prefers-reduced-motion` desactiva scroll suave dentro de mapa/card; estados no dependen de animación para comunicar resultado. |
| G7 | Tipografía / contraste | Pass | Scan de CSS: ningún `font-size` menor a 10 px; solo 9 tokens operativos quedan entre 10–10.5 px y el texto de lectura usa 11 px o más. Capturas confirmaron contraste de copy, controles y errores. |

## Resultado del detector de UI

El detector de Impeccable se ejecutó sobre los targets modificados. No reportó errores. Sus advertencias se revisaron de forma explícita:

- `bounce-easing` es un falso positivo: `debounce-shortcut-confirm` usa `cubic-bezier(.16, 1, .3, 1)`, una desaceleración suave, no una animación de rebote.
- `layout-transition` también es un falso positivo: corresponde a `stroke-width` de un SVG, no a `width`, `height`, `margin` o `padding` de layout.
- Las tres advertencias de `Inter` pertenecen a la tipografía de UI ya adoptada por el producto; sustituirla requeriría incorporar y licenciar una familia nueva para todo el sistema, no un cambio aislado de esta auditoría.
- Los avisos de color, radios y tamaños fuera de `DESIGN.md` reflejan la paleta/escala extensa ya presente en el producto. No son regresiones introducidas en esta pasada; quedan como una futura consolidación de tokens, separada de la QA visual funcional para no arriesgar contraste o jerarquía aprobados.

## Cierre

La checklist está cerrada: no quedan `Pendiente` ni findings sin una segunda comprobación. Las entradas `N/A verificado` no son deuda funcional: documentan estados que requieren una evaluación, historial o credencial reales y que no se fabricaron para preservar los datos y el presupuesto del usuario.
