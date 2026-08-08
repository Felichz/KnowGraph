# Sistema de producto y UI/UX de la Learning Map

## 1. Propósito del producto

Esta aplicación no es solamente un grafo de conceptos. Es un sistema de entrenamiento para convertir conocimiento disperso en una explicación que el usuario pueda recuperar, organizar y comunicar en una entrevista.

El grafo es la representación espacial del mapa. La unidad real de aprendizaje es la card/nodo y su ciclo de dominio:

```text
ubicar el concepto → estudiarlo → explicarlo con palabras propias
→ recibir una guía rápida → confirmar con una evaluación completa
→ corregir gaps → volver a intentarlo o avanzar
```

La UI debe hacer visible ese ciclo. Si el usuario no sabe qué está leyendo, qué está practicando, qué está siendo medido o qué puede hacer después, la interfaz está fallando aunque cada componente individual se vea prolijo.

## 2. Usuario, contexto y necesidades

El usuario es un developer con experiencia práctica que necesita recuperar rápidamente un modelo mental profundo para entrevistas senior o tech lead. No necesita una experiencia de curso introductorio: puede entender conceptos rápido, pero necesita:

- cobertura explícita de los puntos importantes;
- explicación de causas, trade-offs y fallas, no solo definiciones;
- ejemplos concretos de diseño e implementación;
- una forma de expresarlo con sus propias palabras;
- feedback que identifique el próximo gap prioritario;
- evidencia de que una card está cubierta sin obligarlo a perfeccionar cada detalle opcional;
- una ruta progresiva para no perderse entre conceptos relacionados.

La tensión central del producto es esta:

```text
profundidad suficiente para aprender bien
                  ×
rapidez y baja fricción para iterar muchas veces
```

La interfaz debe mostrar una sola decisión principal por vez. El usuario puede acceder al detalle, pero el detalle no debe competir con el siguiente paso.

## 3. Modelo conceptual de dominio

### 3.1 Entidades

- **Graph:** conjunto de nodos, categorías, dependencias y milestones de un tema.
- **Node/Card:** concepto enseñable con explicación, ejemplos, código, diagramas, errores, trade-offs y preguntas.
- **Dependency:** relación que explica qué conocimiento habilita otro concepto.
- **Draft:** explicación actual que el usuario está escribiendo. No es una evaluación.
- **Live review:** revisión rápida y provisional del draft. Sirve para orientar la próxima edición.
- **Checkpoint:** evaluación completa y persistida contra el contenido de la card.
- **Attempt:** snapshot de un checkpoint, con respuesta, score, modelo, duración y feedback.
- **Completion:** estado derivado de la cobertura esencial del checkpoint, no de la profundidad extra.

### 3.2 Tres verdades que no se deben mezclar

La aplicación debe mantener separadas estas tres cosas:

1. **Lo que la card enseña.** Es contenido estable.
2. **Lo que el coach cree que conviene revisar ahora.** Es feedback provisional y puede cambiar mientras el usuario escribe.
3. **Lo que una evaluación completa registró.** Es evidencia histórica y no debe cambiar silenciosamente cuando cambia el draft.

Una regla de diseño importante deriva de esto: nunca presentar el score provisional del coach con el mismo peso semántico que el score canónico de un checkpoint.

## 4. Arquitectura de información

### 4.1 Nivel aplicación

La aplicación tiene dos superficies principales:

- **Mapa:** exploración, orientación, dependencias, prioridades y progreso global.
- **Card:** aprendizaje profundo de un nodo concreto.

La card es una superficie de trabajo completa. Al abrirla, el usuario no debería sentir que sigue mirando el grafo detrás; cambia de contexto.

### 4.2 Nivel card

La card tiene tres vistas explícitas y mutuamente excluyentes:

#### Vista 1 — Lectura

Objetivo: construir comprensión antes de responder.

Orden recomendado:

1. resumen en una frase;
2. por qué importa;
3. explicación causal;
4. contexto en la ruta y dependencias;
5. caso concreto, fallas y trade-offs;
6. tabla o diagrama;
7. ejemplo de código;
8. paso a paso;
9. idea para recordar;
10. preguntas de entrevista, fuentes y conceptos relacionados.

La vista de lectura no debe mostrar el textarea ni barras de evaluación. Puede mostrar audio, profundidad contextual y navegación hacia otras cards.

#### Vista 2 — Coaching

Objetivo: producir una explicación propia con feedback rápido.

Orden recomendado:

1. estado del coach;
2. un único indicador de cobertura provisional;
3. editor de texto;
4. estado del debounce/request;
5. un solo hint prioritario;
6. acción manual para pedir checkpoint completo.

El coach no completa nodos y no genera checkpoints automáticamente. Su resultado es una sugerencia de edición, no un veredicto histórico.

#### Vista 3 — Evaluar

Objetivo: registrar y revisar evidencia de dominio.

Orden recomendado:

1. navegación de intentos;
2. score global 0–120;
3. umbral de cobertura 100;
4. rúbricas individuales 0–120;
5. fortalezas;
6. gaps y correcciones;
7. próximo intento;
8. respuesta evaluada y metadata del modelo/duración.

La evaluación no debe desplazar o reemplazar silenciosamente al coaching. Es otra vista del mismo ciclo.

### 4.3 Contexto persistente

El header de la card debe mantener siempre visibles:

- tema y prioridad;
- título del nodo;
- estado de completitud;
- controles de lectura;
- cierre y navegación.

La navegación de vistas debe permanecer visible debajo del header. El aside puede mantenerse como contexto secundario en desktop, pero no debe competir con el contenido principal ni duplicar información que ya está en la vista activa.

## 5. Jerarquía visual

Cada elemento debe tener una sola función dominante.

### 5.1 Niveles de importancia

| Nivel | Función | Tratamiento |
|---|---|---|
| L0 | Superficie y contexto | fondo, bordes suaves, bajo contraste |
| L1 | Contenido principal | texto legible, ancho controlado, alto contraste |
| L2 | Acción primaria | color de marca, peso visual alto, una por región |
| L3 | Estado importante | badge, barra o callout semántico |
| L4 | Detalle opcional | texto secundario, colapsable o tooltip |

Un score canónico y un botón primario pueden ser L2/L3. Un modelo usado, timestamp o ruta del request debe ser L4. Nunca se deben presentar con el mismo peso.

### 5.2 Regla de foco

Cada vista debe responder visualmente a una pregunta:

- Lectura: **¿qué necesito entender?**
- Coaching: **¿qué debo mejorar ahora?**
- Evaluación: **¿qué tan completa fue mi explicación y qué sigue?**

Si una sección no ayuda a responder la pregunta de la vista, debe moverse, resumirse o esconderse.

## 6. Sistema de diseño

### 6.1 Tokens de espacio

Usar una escala de base 4 px, con estos valores preferidos:

```text
4   detalle mínimo
8   separación entre elementos relacionados
12  padding compacto
16  separación estándar entre bloques
24  separación entre secciones
32  separación de regiones grandes
40+ respiración de superficie
```

No se deben introducir valores arbitrarios como 17, 19 o 23 salvo que exista una razón geométrica documentada. La consistencia espacial comunica que dos elementos pertenecen al mismo grupo.

### 6.2 Tokens de forma

- controles pequeños: radio 8;
- cards y paneles: radio 12–16;
- superficie fullscreen: sin radio externo;
- badges: radio pill solo cuando representan una etiqueta compacta;
- bordes: 1 px por defecto, 2 px solo para foco o estado destacado.

### 6.3 Tokens de color semántico

El color debe comunicar significado, no decorar:

- cyan/teal: actividad, coach, foco actual, navegación viva;
- azul: acción o información estable;
- verde: cobertura esencial y completitud;
- dorado: profundidad opcional, excelencia >100, milestone especial;
- naranja: advertencia, score en desarrollo, atención requerida;
- rojo: error, misconception o riesgo;
- gris azulado: metadata y contenido secundario.

El color nunca debe ser la única señal: acompañarlo con texto, icono, posición o forma.

### 6.4 Tipografía

- título de card: display fuerte, una sola línea cuando sea posible;
- encabezados de sección: monospace uppercase pequeño para orientar, no para leer contenido;
- cuerpo didáctico: ancho de lectura de 65–75 caracteres y line-height 1.55–1.75;
- código y metadata: monospace;
- feedback del LLM: cuerpo normal, no todo en monospace.

La jerarquía se consigue combinando tamaño, peso, color y espacio. No se debe usar mayúsculas pequeñas para todo porque destruye la diferencia entre navegación, contenido y estado.

## 7. Componentes y anatomía

### 7.1 Header de card

Debe contener:

- eyebrow: tema y prioridad;
- título;
- estado de completitud o disponibilidad;
- controles de audio agrupados;
- botón de cierre.

No debe contener feedback largo ni acciones de evaluación. El header identifica la card y permite salir; no es el lugar para explicar todo.

### 7.2 Navegación de vistas

Debe comportarse como una tablist:

- tres tabs siempre visibles;
- una activa claramente identificada;
- foco de teclado visible;
- label estable, no cambiar entre “Evaluar”, “Score”, “Historial” según el estado;
- badge secundario opcional para indicar que existe checkpoint;
- cambiar de tab no debe borrar ni enviar datos.

### 7.3 Panel de coaching

Anatomía:

```text
estado del coach
score provisional / cobertura
editor
estado debounce/request
hint único
acción checkpoint manual
```

El hint debe ser accionable y específico. “Te falta explicar X y por qué importa” es útil. “Profundizá más” no lo es.

### 7.4 Panel de evaluación

Anatomía:

```text
selector de intento
score canónico destacado
barra 0–120 con umbral 100
desglose de rúbricas
feedback ordenado por prioridad
respuesta evaluada
metadata secundaria
acciones de reintento/navegación
```

El score 100 debe comunicarse como cobertura suficiente. La franja 100–120 debe verse especial, pero nunca como una deuda necesaria para avanzar.

### 7.5 Aside

El aside es orientación, no contenido principal. Debe responder:

- ¿de dónde vengo?
- ¿dónde estoy?
- ¿qué viene después?
- ¿qué nivel de cobertura tengo?

Si muestra una explicación extensa, compite con la vista principal y debe trasladarse a Lectura o Evaluar.

## 8. Estados que deben diseñarse

Cada componente interactivo debe tener al menos:

- default;
- hover;
- focus-visible;
- active/selected;
- disabled;
- loading/skeleton;
- success;
- warning;
- error;
- stale;
- reduced-motion.

### 8.1 Coaching

```text
idle       escribí para activar el coach
waiting    debounce visible, request aún no enviada
running    request activa, no editar ni ocultar el campo
ready      hint y cobertura actualizados
error      error recuperable, el draft se conserva
stale      el usuario siguió escribiendo, resultado anterior atenuado
```

### 8.2 Evaluación

```text
empty      todavía no existe checkpoint
streaming  score/bloques parciales visibles
ready      evaluación completa persistida
cancelled  no se guardó evidencia parcial como intento
error      reintentar sin perder el draft
historical intento anterior seleccionado
extra      score superior a 100 con tratamiento dorado
```

## 9. Layout y responsive

### Desktop

- header y tabs fuera del scroll del contenido;
- columna principal para la vista activa;
- aside de contexto con ancho estable;
- el contenido de lectura debe tener un ancho máximo cómodo;
- coaching y evaluación pueden usar más ancho porque contienen editor, barras y feedback;
- ningún sticky debe tener fondo transparente.

### Tablet

- reducir aside o convertirlo en panel colapsable;
- mantener tabs en una sola fila horizontal;
- conservar el editor y el score como regiones de ancho completo.

### Mobile

- header compacto;
- audio y cierre agrupados sin empujar el título fuera de pantalla;
- tabs con scroll horizontal o tres botones de ancho flexible;
- aside debajo del contenido o convertido en sección colapsable;
- acciones primarias de ancho suficiente para touch;
- nunca poner dos paneles complejos lado a lado.

## 10. Accesibilidad y comportamiento

- usar `nav`, `main`, `article`, `section` y `tablist` semánticamente;
- `aria-current` o `aria-selected` en navegación activa;
- todos los botones deben tener label visible o accessible name;
- no usar color como única señal;
- respetar `prefers-reduced-motion`;
- preservar foco al abrir/cerrar card;
- no mover el scroll al escribir;
- anunciar estados de request sin inundar lectores de pantalla;
- mantener contraste AA para cuerpo y controles;
- el contenido largo debe poder recorrerse con teclado.

## 11. Proceso de diseño y validación

### Paso 1 — Inventario

Listar regiones, componentes, estados y acciones actuales. Marcar duplicaciones y elementos que no tienen dueño semántico.

### Paso 2 — Modelo de tareas

Probar las tareas principales:

1. abrir el siguiente nodo correcto;
2. entender la card;
3. escribir una explicación;
4. identificar un gap;
5. refinar sin perder el draft;
6. pedir un checkpoint;
7. comparar intentos;
8. decidir si avanzar.

### Paso 3 — Wireframes

Diseñar primero cajas y jerarquía, sin colores decorativos. Validar que cada vista tenga una sola acción dominante.

### Paso 4 — Tokens y componentes

Convertir decisiones repetidas en variables y componentes. Si dos estados necesitan estilos distintos, documentar la razón semántica.

### Paso 5 — Prototipo funcional

Probar transiciones reales: streaming, cancelación, cambio de tab, error, historial, mobile, contenido largo y score extra.

### Paso 6 — QA visual y de interacción

Revisar capturas en desktop, tablet y mobile. Verificar overlays, scrollbars, foco, textos largos, tooltips, sticky surfaces y layout durante loading.

### Paso 7 — Iteración basada en fricción

Medir dónde el usuario duda, vuelve atrás, no encuentra el siguiente paso o confunde score provisional con score canónico. Ajustar jerarquía y copy antes de agregar más controles.

## 12. Criterios de éxito para esta app

La interfaz está bien resuelta cuando:

- al abrir una card se entiende inmediatamente el concepto y el próximo paso;
- se puede leer sin que el coaching interrumpa la lectura;
- se puede escribir sin perder el cursor ni el scroll;
- el coach se siente rápido y provisional;
- el checkpoint se siente deliberado y confiable;
- 100 se entiende como suficiencia, no como fracaso incompleto;
- 100–120 se siente como excelencia opcional;
- el historial se puede inspeccionar sin reemplazar el draft actual;
- el usuario siempre sabe si está leyendo, practicando o verificando;
- el grafo guía, pero la card enseña.

