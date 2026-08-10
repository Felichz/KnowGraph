---
name: Learning Workspace
description: Cockpit local para dominar conceptos técnicos y comunicar con seguridad en entrevistas senior.
colors:
  canvas: "#0c0f14"
  workspace-bg: "#090b0f"
  surface: "#11151b"
  surface-raised: "#161b22"
  surface-emphasis: "#1b212a"
  line: "rgba(255, 255, 255, .075)"
  line-strong: "rgba(255, 255, 255, .14)"
  text-primary: "#f3f5f7"
  text-secondary: "#b2bac5"
  text-muted: "#727c89"
  operational-cyan: "#70ddd4"
  information-blue: "#6eb7ff"
  success-green: "#55d98a"
  warning-red: "#ef7668"
  excellence-gold: "#e6b95b"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 740
    lineHeight: 1.04
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  control: "8px"
  panel: "12px"
  card: "18px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
components:
  command-button:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
    height: "36px"
  command-button-active:
    backgroundColor: "{colors.surface-emphasis}"
    textColor: "{colors.operational-cyan}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
    height: "36px"
  editor:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  flashcard:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.panel}"
    padding: "18px 19px 15px"
  status-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.control}"
    padding: "5px 9px"
  score-extra:
    backgroundColor: "{colors.excellence-gold}"
    textColor: "{colors.workspace-bg}"
    rounded: "{rounded.control}"
    padding: "5px 9px"
---

# Design System: Learning Workspace

## Overview

**Creative North Star: "El cockpit de dominio técnico"**

Learning Workspace se comporta como una herramienta de concentración para una persona que estudia en serio: el mapa orienta, la card abre una superficie de trabajo y el coaching calibra una explicación en progreso. La interfaz no intenta parecer un curso ni un dashboard corporativo. Su lenguaje viene de una consola técnica nocturna: información precisa, jerarquía fuerte, estados visibles y una atmósfera tranquila que sostiene sesiones largas.

La densidad es deliberada, pero no comprimida. Las capas oscuras separan contexto, trabajo y feedback; los bordes finos dibujan la estructura; el color funciona como una señal semántica. Los glows son discretos y aparecen para foco, actividad, progreso o logro, nunca como adorno permanente.

**Key Characteristics:**

- Dark workspace de baja luminancia, con capas tonales azul-negras y ruido visual mínimo.
- Inter para leer y pensar; JetBrains Mono para coordenadas, estado, progreso y controles.
- Cian como señal de operación y foco; el dorado está reservado para excelencia real.
- Bordes finos, radios moderados y profundidad tonal antes que superficies flotantes.
- La card es una superficie de aprendizaje completa; no una ventana ornamental dentro de otra ventana.

## Colors

La paleta usa neutrales fríos y contrastados como espacio de trabajo, mientras los acentos codifican intención y estado.

### Primary

- **Cian operativo:** guía acciones activas, foco, selección, cobertura y progreso de entrenamiento.

### Secondary

- **Azul de información:** señala enlaces, foco de campo y estados informativos que no implican dominio.

### Tertiary

- **Dorado de excelencia:** aparece únicamente cuando una explicación supera la cobertura esencial y entra en profundidad extra.
- **Verde de confirmación:** comunica éxito o cobertura alcanzada sin competir con el dorado.
- **Rojo de corrección:** marca errores, riesgo o revisión requerida con contención visual.

### Neutral

- **Canvas nocturno:** sostiene el grafo y las superficies de lectura sin convertir el fondo en negro puro.
- **Superficies escalonadas:** separan command bar, rail, card, editor y feedback por luminancia sutil.
- **Texto de lectura y texto secundario:** preservan contraste alto para contenido largo y una jerarquía tranquila para metadatos.
- **Líneas fantasma:** delimitan áreas y controles sin crear una grilla pesada.

### Named Rules

**The Gold Reserve Rule.** El dorado no indica un botón común, una advertencia ni una categoría. Solo representa una respuesta por encima de 100/120 y la sensación de haber ido más allá de la cobertura necesaria.

**The Signal, Not Decoration Rule.** Cada color de acento debe expresar una condición operativa concreta. Si el estado se entiende sin color, el color puede reforzarlo; si no, debe existir también texto, forma o iconografía que lo comunique.

## Typography

**Display Font:** Inter con fallback de sistema.

**Body Font:** Inter con fallback de sistema.

**Label/Mono Font:** JetBrains Mono con fallback monoespaciado.

**Character:** La combinación separa comprensión de instrumentación. Inter hace que explicaciones, ejemplos y preguntas sigan siendo humanas; JetBrains Mono hace que score, prioridad, estado y navegación se lean como coordenadas confiables de una herramienta técnica.

### Hierarchy

- **Display:** títulos de card y puntos de entrada del workspace; compactos, pesados y de alto contraste.
- **Headline:** título de flashcard, sección o bloque de feedback; debe mantener lectura rápida sin competir con el concepto principal.
- **Title:** nombres de nodos, acciones y módulos; privilegia claridad sobre énfasis decorativo.
- **Body:** explicaciones, trade-offs, feedback y chat; usa un ancho de lectura controlado y aire vertical consistente.
- **Label:** categorías, prioridad, score, tabs y metadatos; siempre en mono, con tracking abierto y una voz de instrumento.

### Named Rules

**The Two Voices Rule.** No se usa la tipografía mono para explicar conceptos ni la tipografía de lectura para simular estado técnico. Cada familia conserva su rol.

## Layout

El workspace desktop prioriza un canvas amplio y vive dentro de un solo viewport: el documento principal no scrollea. La command bar queda fija y compacta; la navegación de grafos se revela a la izquierda y el progreso detallado en un inspector derecho con scroll propio, nunca ambos a la vez. La ruta sugerida funciona como status bar inferior del canvas. El mapa usa una única composición topológica determinista: izquierda significa menor profundidad de dependencias y derecha significa mayor profundidad. Cada etapa agrupa nodos con la misma distancia conceptual respecto de los fundamentos; el orden vertical reduce cruces y mantiene juntas las cadenas relacionadas. Las conexiones usan divulgación progresiva: en reposo solo aparece la ruta sugerida y el hover o foco revela padres e hijos directos del nodo inspeccionado.

La lección es una ruta de pantalla completa: header operativo, rail de etapas y una columna de lectura o práctica. El contenido largo tiene una anchura deliberadamente limitada para conservar legibilidad. Las herramientas de coaching permanecen cerca del editor mediante elementos sticky, mientras que el historial y los detalles viven debajo, no en una segunda columna que compita con la tarea principal.

En anchos reducidos, la arquitectura pasa a una columna: controles táctiles compactos, navegación horizontal cuando corresponde y card como hoja de trabajo desde el borde inferior. La jerarquía y los estados se conservan, no se reemplazan por una versión visualmente ajena.

## Elevation & Depth

La profundidad es principalmente tonal. Canvas, superficie, superficie elevada y superficie de énfasis se distinguen por luminancia baja y por una línea fina, no por una colección de sombras pesadas. Las sombras existen en contenedores importantes y en estados de foco, son amplias y oscuras, y sirven para separar contexto, no para hacer que cada card flote.

### Shadow Vocabulary

- **Panel de workspace:** sombra ambiental amplia para el contenedor de mapa y para superficies que necesitan separarse del canvas.
- **Foco activo:** halo cian sutil alrededor de un nodo, control o card seleccionada.
- **Excellence glow:** halo dorado leve y acotado a score o estado de profundidad extra.

### Named Rules

**The Tonal-First Rule.** Antes de agregar sombra, resolvé la jerarquía con capa, borde y contraste. La sombra es una señal de elevación o foco, no un sustituto de estructura.

## Shapes

Los controles son suavemente rectangulares y los paneles tienen esquinas moderadas. Las formas redondeadas pequeñas se reservan para botones y toggles; las cards, popovers y superficies de trabajo usan radios mayores para agrupar contenido sin volverse blandas. Los chips pueden ser más redondeados cuando su función es filtrar o resumir estado.

Los bordes son finos y poco contrastados en reposo. En foco o selección, el borde cambia de color y puede ganar un halo corto. El énfasis no se logra engrosando todos los contornos.

## Components

### Buttons

**Character:** controles instrumentales, compactos y explícitos.

- **Shape:** rectángulo de esquinas suaves; las acciones de icono usan la misma altura que los controles de texto.
- **Primary:** el cian aparece para una acción activa, una selección o un foco claro; no como relleno dominante en toda la interfaz.
- **Hover / Focus:** se eleva el contraste de borde y texto; el foco de teclado tiene una señal azul o cian inequívoca.
- **Secondary / Ghost:** conserva superficie oscura y borde fino; se usa para navegación, audio y acciones auxiliares.

### Chips

**Character:** filtros y estados cortos, no mini-botones decorativos.

- **Style:** superficie elevada, borde discreto, etiqueta mono y color semántico cuando existe un estado real.
- **State:** el filtro activo cambia de contraste y borde; el estado de excelencia usa el dorado reservado.

### Cards / Containers

**Character:** superficies de trabajo definidas por capa y borde, no por una pila de cards anidadas.

- **Corner Style:** radios moderados que separan grupos sin redondear la estructura completa en exceso.
- **Background:** cada contenedor responde a una capa semántica del workspace: canvas, superficie, elevada o énfasis.
- **Shadow Strategy:** plano en reposo; sombra ambiental o halo pequeño solo al seleccionar, enfocar o abrir.
- **Border:** una línea de baja opacidad en reposo; mayor contraste cuando expresa navegación, estado o logro.
- **Internal Padding:** ritmo compacto para controles y generoso para lectura, escritura y feedback.

### Inputs / Fields

**Character:** un editor de pensamiento, no una caja de formulario genérica.

- **Style:** fondo inset oscuro, borde fino, tipografía de lectura y espacio vertical suficiente para escribir sin sentir fricción.
- **Focus:** anillo de foco visible de información; el cursor y el contenido mantienen el rol central.
- **Error / Disabled:** el error se comunica con copy y color de riesgo; los estados deshabilitados bajan contraste sin desaparecer.

### Navigation

**Character:** orientación de herramienta, progresiva y plegable.

- **Workspace:** command bar compacta y menú que puede ocultarse para devolver el viewport al mapa.
- **Lesson:** rail de tres etapas —lectura, coaching y evaluar— con el paso activo claramente señalado.
- **Topological map:** una toolbar compacta explica la dirección de lectura y permite centrar el próximo foco, ver el conjunto y controlar zoom. No existen variantes visuales que contradigan el orden real de prerrequisitos.

### Score & Progress

**Character:** telemetría de aprendizaje, no gamificación vacía.

- **Base:** cian y azul muestran cobertura y avance hacia el dominio.
- **Threshold:** 100/120 se entiende como superficie esencial cubierta.
- **Extra:** solo el tramo superior a 100 se vuelve dorado, con un halo contenido que reconoce profundidad adicional sin convertirla en un requisito.

## Do's and Don'ts

### Do:

- **Do** tratar el canvas del grafo como el protagonista de la vista principal y mantener la navegación secundaria plegable.
- **Do** derivar posiciones de las dependencias, mantenerlas deterministas y hacer que avanzar hacia la derecha siempre implique mayor profundidad conceptual.
- **Do** mantener la lectura en columnas de ancho controlado y reservar aire para explicaciones, código y feedback.
- **Do** usar JetBrains Mono para score, labels, prioridad, atajos y estado; usar Inter para contenido que el usuario deba entender.
- **Do** usar cian para foco operativo y dorado exclusivamente para excelencia por encima de 100/120.
- **Do** comunicar estados con texto, estructura y color, incluidos streaming, errores, cobertura y foco de teclado.
- **Do** preferir profundidad tonal, bordes finos y halos pequeños sobre sombras fuertes o glows constantes.

### Don't:

- **Don't** convertir cada grupo de contenido en una card dentro de otra card; una superficie debe tener una razón estructural clara.
- **Don't** usar dorado para acciones comunes, alertas o decoración.
- **Don't** esconder la acción principal entre múltiples controles de peso visual idéntico.
- **Don't** reducir la tipografía de contenido legible por debajo del tamaño que sostenga una sesión de estudio real.
- **Don't** depender solo del color, la animación o el hover para comunicar una condición importante.
- **Don't** tratar la interfaz como un dashboard de métricas: el objetivo es entender, practicar y comunicar mejor.
- **Don't** usar force layouts, constelaciones radiales o recorridos arbitrarios que oculten cuál concepto habilita al siguiente.
