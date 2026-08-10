// Prosa de lectura reescrita para las cards fundacionales del grafo React.
// Cada entrada pisa campos del lesson base en reactGraph.js (ver REACT_FOUNDATIONS_PROSE
// en la cadena de merges de `nodes`). Las explanations usan \n\n porque la vista de
// lectura (ReadingChunks) corta ahí los párrafos.
export const REACT_FOUNDATIONS_PROSE = {
  js_basics: {
    explanation: "Antes de React hay cuatro ideas de JavaScript que aparecen en cada componente: closures, módulos, Promises e inmutabilidad. Una closure es una función que recuerda las variables del lugar donde nació. Cada handler que escribís dentro de un componente es una closure que captura las props y el state de ese render, y por eso un setTimeout puede terminar leyendo un valor viejo: la función recuerda el render en que fue creada, no el último.\n\nLos módulos te dicen de dónde sale cada símbolo: cuando leés `import { useState } from \"react\"` estás viendo el contrato, no magia. Una Promise representa trabajo que todavía no terminó; `await` pausa esa función, no el navegador, y un rechazo sin `catch` se convierte en un error que nadie manejó.\n\nPor último, la inmutabilidad. React detecta cambios comparando referencias, así que `setItems([...items, item])` le entrega una referencia nueva que sí puede reconocer, mientras `items.push(item)` muta la que ya tenía y puede dejar la pantalla desactualizada. Dominar estas cuatro piezas convierte la lectura de cualquier componente en un ejercicio mecánico: sabés qué captura cada función, de dónde viene cada símbolo, qué sigue pendiente y qué referencia cambió.",
    code: "import { useState } from \"react\"\n\nfunction Search() {\n  const [query, setQuery] = useState(\"\")\n  const submit = async () => {\n    // closure: recuerda el `query` del render donde nació\n    const res = await fetch(`/api/search?q=${query}`)\n    console.log(await res.json())\n  }\n  return <button onClick={submit}>Buscar \"{query}\"</button>\n}",
    codeLabel: "Módulo, closure y Promise en un handler",
    steps: [
      "Leé cada handler como una closure: identificá qué valores del render actual capturó.",
      "Seguí cada símbolo hasta su import para entender qué contrato expone ese módulo.",
      "Tratá cada fetch como una Promise: dónde se espera el resultado y dónde se atrapa el rechazo.",
      "Ante cada actualización, preguntate si creaste una referencia nueva o mutaste la existente.",
    ],
    pitfalls: [
      "Mutar un array u objeto existente puede ocultar el cambio: React compara referencias y la vieja sigue en su lugar.",
      "Una referencia nueva no garantiza datos nuevos: `[...items]` copia la estructura, no valida el contenido.",
      "Un fetch sin catch deja el rechazo como unhandled rejection: la pantalla queda colgada y el error solo vive en la consola.",
    ],
  },
  react_mental_model: {
    explanation: "React te propone un trato: vos describís cómo debería verse la interfaz para un estado dado, y React se encarga de llevar el DOM hasta ese punto. Ese cálculo de la descripción se llama render; el momento en que React aplica al DOM solo lo que cambió se llama commit.\n\nMirá el contador del ejemplo: el click no cambia el número en pantalla, agenda un state nuevo. React vuelve a ejecutar tu componente con ese valor, compara la descripción nueva con la anterior y toca únicamente el texto del botón. Nada más se reconstruye.\n\nDe este modelo se desprenden dos reglas que explican casi todos los bugs de React. Primera: el render puede repetirse, así que debe ser puro — si mutás algo o hacés un fetch durante render, ese trabajo puede duplicarse. Segunda: todo lo que sincroniza con el mundo externo (suscripciones, timers, red) va después del commit, en un Effect. Cuando una pantalla hace algo raro, la pregunta correcta casi siempre es la misma: ¿esto pasó en render, en commit o en un effect?",
  },
  components_props: {
    explanation: "Un componente es una función que recibe entradas (props) y devuelve una descripción de UI. Las props son de solo lectura: el hijo las usa, pero no las cambia, porque cada dato tiene un dueño y ese dueño es quien decide cómo evoluciona.\n\nLa composición es lo que permite que esto escale. En vez de un componente gigante con veinte flags, armás piezas chicas con contratos chicos y las combinás. `children` es el caso más útil: una `Card` no necesita saber qué lleva adentro, solo dónde ponerlo, y por eso puede envolver hoy una tabla y mañana un formulario sin cambiar una línea.\n\nCuando el hijo necesita que algo cambie, no modifica la prop: avisa. Una `OrdersTable` recibe `rows` y `onSelectOrder`; muestra y emite intención, y la pantalla padre decide si ese click abre un modal, cambia la URL o pide más datos. Por eso la misma tabla sirve en una página completa y en un panel lateral: su contrato no presume contexto, y esa es la propiedad que hace a un componente reutilizable de verdad.",
    steps: [
      "Definí qué datos necesita el componente y exponelos como props de solo lectura.",
      "Ubicá el state en el dueño de la decisión; el hijo pide cambios mediante callbacks.",
      "Usá children cuando el contenedor no deba conocer el contenido que envuelve.",
      "Mantené el contrato chico: pocas props, nombres del dominio, sin flags que se contradicen entre sí.",
    ],
    pitfalls: [
      "Una prop con demasiadas opciones, o un objeto options genérico, obliga a leer la implementación para usar bien el componente.",
      "Copiar una prop a state local para poder editarla crea dos fuentes de verdad: cuando la prop cambia, el hijo sigue mostrando el valor viejo.",
      "Pasar props a través de cinco niveles que no las usan (prop drilling) suele indicar que falta composición o un Context, no que faltan props.",
    ],
  },
  jsx_rendering: {
    explanation: "JSX parece HTML, pero es JavaScript: cada etiqueta que escribís se transforma en una llamada que produce la descripción de ese pedazo de interfaz. Las llaves `{}` meten cualquier expresión dentro de esa descripción — un valor, un ternario, un `map` que construye una lista.\n\nQue sea declarativo cambia tu trabajo: no decís \"buscá este nodo y cambiale el texto\"; describís cómo se ve la UI para el estado actual y React resuelve la diferencia con lo que ya está en pantalla.\n\nDos protecciones vienen de fábrica y conviene conocerlas. React escapa el texto que renderizás, así que un comentario que contiene `<script>` se muestra como texto y no se ejecuta; `dangerouslySetInnerHTML` existe para cuando realmente necesitás HTML crudo, y exige sanitizarlo antes. Y en las listas, `key` le da identidad estable a cada fila para que React sepa cuál es cuál cuando el orden cambia.",
    steps: [
      "Leé el JSX como expresiones: todo lo que está entre llaves se evalúa en cada render.",
      "Construí listas con map y una key estable que venga de los datos, no del índice del array.",
      "Confiá en el escape por defecto; si usás dangerouslySetInnerHTML, sanitizá el HTML primero.",
      "Describí el resultado final para cada estado en lugar de instrucciones para mutar el DOM.",
    ],
    pitfalls: [
      "Una key basada en el índice parece funcionar hasta que la lista se reordena: el state interno queda pegado a la posición y salta a otra fila.",
      "`{count && <Badge />}` con un count numérico renderiza un 0 en pantalla cuando vale cero: usá un booleano explícito.",
      "Inyectar HTML de un usuario sin sanitizar es XSS directo: el escape por defecto solo protege lo que renderizás como texto.",
    ],
  },
  events_propagation: {
    explanation: "Un evento del navegador nace en un nodo concreto y viaja: primero baja en fase de captura y después sube burbujeando hasta la raíz. React te deja declarar handlers en cualquier componente de ese camino con props como `onClick`, y respeta el viaje.\n\nDe ahí salen dos herramientas que tenés que distinguir sin pensar. `preventDefault` frena la acción nativa del navegador: que el form recargue la página, que el link navegue. `stopPropagation` frena el viaje del evento hacia los ancestros. El caso clásico: una fila que abre el detalle al click y adentro tiene un botón Delete — sin `stopPropagation`, borrar también abre el detalle.\n\nY hay una regla de frontera que ordena todo el modelo: el handler es el lugar de las acciones del usuario. Confirmar, poner el estado pending, llamar la API y manejar el error viven ahí, no en un Effect que observa un booleano, porque el Effect no sabe qué click originó la operación ni con qué contexto.",
  },
  state_updates: {
    explanation: "El state de React no es una variable que cambia: es un snapshot del render, una foto fija de los valores con los que se calculó esa pasada. Cuando escribís `setCount(count + 1)` no estás modificando `count`; estás agendando un render nuevo con otro valor. Dentro del handler actual, `count` sigue siendo el de la foto.\n\nEsto explica el bug favorito de las entrevistas: dos `setCount(count + 1)` seguidos no suman dos, porque ambos leen el mismo snapshot. La forma funcional `setCount(c => c + 1)` sí acumula, porque cada updater recibe el valor más reciente de la cola de actualizaciones.\n\nEl batching completa el cuadro: React agrupa las actualizaciones de un mismo evento en un solo render, así que tres setters seguidos no son tres renders. La conclusión práctica tiene tres patas: si el próximo valor depende del anterior, usá updater; si trabajás con objetos o arrays, creá referencias nuevas; y nunca leas el state esperando que el setter recién llamado ya hizo efecto.",
    pitfalls: [
      "Leer el state inmediatamente después del setter para validar o loguear usa el valor anterior: la foto todavía no se renovó.",
      "Mutar un objeto y volver a guardar la misma referencia puede dejar la UI sin cambios: React compara referencias para decidir.",
      "Asumir que cada setter dispara un render inmediato lleva a código defensivo innecesario: React agrupa las actualizaciones del mismo evento.",
    ],
  },
  hooks_rules: {
    explanation: "Los Hooks son funciones que conectan tu componente con capacidades de React: state, effects, contexto, refs. El precio de esa comodidad es una regla dura: llamalos siempre en el mismo orden y en el nivel superior del componente.\n\nLa razón es mecánica, no ideológica. React no tiene nombres para asociar cada `useState` con su valor; usa la posición de la llamada en la secuencia. Si metés un Hook dentro de un `if`, cuando la condición cambie las posiciones se corren y React le asigna a cada Hook el state de otro. Por eso la solución nunca es llamarlo a veces: llamalo siempre y poné la condición adentro de la lógica, como hace el ejemplo, donde el Effect se ejecuta siempre y decide con un early return si hay trabajo que hacer.\n\nLa otra consecuencia es feliz: cualquier función que empiece con `use` y llame Hooks hereda el mismo contrato, y cada componente que la usa recibe su propia instancia de estado. Esa es la base sobre la que se construyen los custom Hooks.",
    code: "function Search({ enabled }) {\n  const [term, setTerm] = useState(\"\")\n  useEffect(() => {\n    if (!enabled) return // la condición va adentro, no alrededor del Hook\n    const id = setTimeout(() => search(term), 300)\n    return () => clearTimeout(id)\n  }, [enabled, term])\n}",
    codeLabel: "La condición va adentro del Hook",
    pitfalls: [
      "Un Hook dentro de un if, un loop o después de un early return rompe la correspondencia posicional, y el error aparece lejos de la línea culpable.",
      "Extraer lógica con Hooks a una función común sin prefijo use esconde el contrato: el linter no la revisa y tus colegas no la reconocen.",
      "Creer que dos componentes que usan el mismo custom Hook comparten state: cada llamada crea su propia instancia independiente.",
    ],
  },
  custom_hooks: {
    explanation: "Un custom Hook es una función con nombre `use...` que empaqueta lógica de React — state, effects, suscripciones — para reutilizarla sin duplicar coordinación en los componentes.\n\nLa clave conceptual: comparte comportamiento, no datos. Si dos pantallas llaman `useOnlineStatus`, cada una tiene su propio state y su propia suscripción a los eventos online/offline del navegador; lo que reutilizan es la receta, no la instancia. Esto lo diferencia de un store global, y el hecho de usar Hooks adentro lo diferencia de una función helper común.\n\nEl diseño de su API importa tanto como su implementación: debería hablar el idioma del dominio (`isOnline`, `retry`, `isIdle`) y no filtrar detalles de implementación como refs o nombres de eventos del navegador. La señal de extracción es simple: cuando la misma coordinación aparece por tercera vez en un componente, probablemente tiene nombre propio y quiere ser un Hook.",
    pitfalls: [
      "Un custom Hook que mezcla fetching, navegación y decisiones de UI acumula responsabilidades y deja de ser reutilizable.",
      "Olvidar el cleanup de una suscripción dentro del Hook deja listeners duplicados cada vez que la pantalla se monta y desmonta.",
      "Usar un custom Hook para sincronizar un recurso global entre componentes no funciona: cada llamada tiene su instancia; ahí corresponde un store o Context.",
    ],
  },
  use_state_reducer: {
    explanation: "Los dos Hooks oficiales de estado local responden a dos formas distintas de cambio. `useState` describe un valor: ideal cuando las transiciones son chicas e independientes, como un texto o un flag. `useReducer` describe transiciones: el componente despacha eventos (`save_started`, `save_failed`) y una función pura, el reducer, decide el próximo state para cada uno.\n\nEl reducer gana cuando varias actualizaciones comparten reglas, o cuando el estado es en realidad una máquina de estados. Un editor que pasa de `idle` a `saving` a `saved` o `error` se lee mejor como eventos que como cuatro setters repartidos por el código, y las transiciones inválidas quedan visibles en un solo lugar.\n\nEl costo es la ceremonia: action types, dispatch, switch. Por eso la regla no es \"reducer es más profesional\", sino \"reducer cuando hay lógica de transición que concentrar\". Y una frontera que no se negocia: el reducer es puro. La llamada HTTP vive en el handler que despacha la acción, nunca dentro de la función que calcula el estado.",
    pitfalls: [
      "Meter un fetch o un Date.now() dentro del reducer lo vuelve impuro: deja de ser predecible, repetible y testeable.",
      "Usar un reducer para un booleano aislado agrega ceremonia sin ninguna decisión real que concentrar.",
      "Despachar acciones genéricas tipo set_field recrea useState con más pasos: las acciones deberían nombrar eventos del dominio.",
    ],
  },
  forms_controlled: {
    explanation: "Todo input en React elige un dueño para su valor. En un input controlado el dueño es React: `value` viene del state y cada tecla pasa por `onChange`, así que la pantalla siempre muestra lo que tu estado dice y podés validar mientras el usuario escribe. En uno no controlado el dueño es el DOM: el input guarda su propio valor y vos lo leés con una ref o con FormData al enviar.\n\nEl trade-off es real. Controlado te da feedback inmediato — mostrar el error del email debajo del campo mientras se tipea — al precio de un render por tecla. No controlado evita esos renders y es la base de librerías como React Hook Form, que registra inputs y valida en el momento correcto.\n\nLa regla práctica: si la validación o el formato en vivo importan, controlado; si el formulario es enorme y el costo de renders se nota, registrá sin controlar. Lo que no cambia con ninguna de las dos: el submit tiene que modelar validación, pending, éxito y error como estados explícitos.",
    pitfalls: [
      "Un input que arranca con value undefined y después recibe un string pasa de no controlado a controlado a mitad de vida: React lo advierte y el bug es confuso.",
      "Un render por tecla en un formulario de cincuenta campos se siente: medí el costo antes de controlar todo por defecto.",
      "Deshabilitar el botón de submit no reemplaza la validación del backend ni evita submits duplicados desde otro cliente.",
    ],
  },
  form_validation: {
    explanation: "En un formulario serio hay dos validaciones con trabajos distintos. La del cliente existe para el feedback: rechazar un email mal formado al instante, marcar el campo, ahorrar un roundtrip. La del servidor existe para la verdad: el cliente es manipulable y nada de lo que valide ahí autoriza nada.\n\nReact Hook Form cubre la primera con registro eficiente de inputs — no controla cada tecla, valida cuando corresponde — y un schema como Zod describe las reglas del payload de forma declarativa y ejecutable, como en el ejemplo: email con formato válido y edad entera.\n\nEl punto donde muchos formularios se rompen es el regreso. Cuando el backend responde con un conflicto de username, ese error no viene del schema local: hay que mapearlo al campo correcto o a un mensaje general. Y un error de red no es un error del usuario — \"no pudimos guardar, reintentá\" y \"escribiste mal este campo\" son mensajes distintos que merecen tratamiento distinto.",
    pitfalls: [
      "Tratar la validación del cliente como seguridad: cualquiera puede saltear el formulario y pegarle directo a la API.",
      "Mostrar un error de red como si fuera un error de validación confunde al usuario sobre qué tiene que corregir.",
      "Duplicar reglas de negocio complejas en el schema del cliente crea dos fuentes que divergen: el cliente valida forma, el servidor valida verdad.",
    ],
  },
  lifting_state: {
    explanation: "Cuando dos componentes necesitan el mismo dato, el state tiene que vivir en el ancestro común más cercano: eso es lifting state. Ese ancestro se convierte en la única fuente de verdad y reparte el dato hacia abajo como props, junto con callbacks para pedir cambios.\n\nEl ejemplo canónico: un SearchInput y una ResultsList que filtra. Si cada uno guarda su propia copia del término, tarde o temprano divergen. Si la página guarda `query`, pasa `value` y `onChange` al input y entrega el mismo `query` a la lista, no existe manera de que muestren filtros distintos.\n\nEl límite del patrón es la distancia. Subir el state un nivel ordena; subirlo hasta App porque \"todo se comparte\" llena de props a componentes que no las usan y amplía los renders. Cuando la distancia crece, las alternativas son Context, la URL o un store — pero la regla de una sola fuente de verdad no se mueve nunca.",
    pitfalls: [
      "Subir todo el state al tope del árbol por las dudas provoca prop drilling y renders que abarcan media pantalla.",
      "Copiar el mismo filtro en input, lista y URL sin decidir cuál manda crea conflictos sobre qué valor gana al sincronizar.",
      "Levantar state efímero de UI, como hover o foco, contamina al padre con cambios que no le importan: no todo merece compartirse.",
    ],
  },
  derived_state: {
    explanation: "Antes de crear un state nuevo, hacete una pregunta: ¿puedo calcular este valor a partir de lo que ya tengo? Si la respuesta es sí, no es state: es un valor derivado y pertenece al render.\n\nEl caso típico es la lista filtrada. Si ya guardás `products` y `query`, entonces `visibleProducts = products.filter(...)` se calcula en cada render y jamás puede quedar desactualizado, porque no existe como dato independiente. Guardarlo como state crea una segunda fuente de verdad que hay que sincronizar a mano cada vez que cambia products y cada vez que cambia query — y el día que olvidés una de las dos rutas, la pantalla miente.\n\nLa única razón legítima para memorizar un derivado es el costo: si el cálculo es caro y una medición lo demuestra, `useMemo` lo cachea sin duplicar la fuente de verdad. Normalizar los datos del servidor es el mismo principio visto del otro lado: cada entidad vive una sola vez y todo lo demás son referencias a ella.",
    pitfalls: [
      "Actualizar filteredProducts a mano en dos lugares distintos garantiza que algún día una ruta quede sin actualizar.",
      "Sincronizar props a state con un Effect para derivar valores es la versión escondida del mismo bug: calculá en render.",
      "useMemo no arregla una fuente de verdad duplicada; solo cachea un cálculo. Si el derivado vive en state, el problema ya está instalado.",
    ],
  },
  context: {
    explanation: "Context resuelve un problema de alcance: entregar un valor a un subárbol entero sin pasarlo como prop por cada nivel intermedio. El Provider declara el valor y cualquier descendiente lo lee con `useContext`; los componentes del medio ni se enteran.\n\nSus casos legítimos son dependencias amplias y estables: tema, idioma, usuario actual, feature flags. Su trampa es creer que es un store global de estado. No lo es: cuando el `value` del Provider cambia, todos los consumidores se vuelven a renderizar, así que un carrito que cambia diez veces por segundo en un Context único arrastra renders a medio árbol. Las defensas son dividir contexts por responsabilidad y frecuencia de cambio, o mover el estado caliente a un store externo.\n\nY una aclaración que no perdona entrevistas: Context distribuye datos, no autoriza. Ocultar un botón según un contexto no impide que alguien llame la API directamente; la autorización siempre se verifica en el servidor.",
    pitfalls: [
      "Meter todo el estado de la app en un único Context convierte cada cambio chico en un render masivo y en acoplamiento invisible.",
      "Un objeto literal como value se recrea en cada render del Provider y despierta consumidores aunque nada cambió: memorizalo o separalo.",
      "Usar Context para evitar pasar dos props un solo nivel esconde dependencias sin ganar nada: el prop drilling corto es más honesto.",
    ],
  },
  refs_dom: {
    explanation: "`useRef` te da una caja mutable que sobrevive entre renders sin provocar renders nuevos cuando la cambiás. Tiene dos usos que conviene separar mentalmente.\n\nEl primero es escapar hacia el DOM: `dialogRef.current?.focus()` después de abrir un diálogo, medir un nodo, integrar una librería imperativa. El segundo es guardar valores que pertenecen a la lógica pero no a la pantalla: el id de un timer, el último request disparado, el valor anterior de una prop.\n\nLa regla que une ambos usos: si cambiar el valor debería actualizar lo que se ve, es state; si no, puede ser ref. Y hay dos detalles de timing que no perdonan. `ref.current` se asigna después del commit, así que leerlo durante render es leer el pasado. Y mutarlo no avisa a nadie: una ref jamás dispara la UI por sí sola, por eso un timer guardado ahí sigue necesitando su clearTimeout en el cleanup.",
    pitfalls: [
      "Leer ref.current durante render para decidir qué mostrar rompe el modelo: la caja puede cambiar sin que React repinte.",
      "Guardar un timer en una ref no lo limpia: sin clearTimeout en el cleanup, el callback sigue vivo después del desmontaje.",
      "Usar refs para evitar state en valores visibles produce pantallas que no reflejan los datos: la mutación silenciosa es el bug, no la solución.",
    ],
  },
  effects: {
    explanation: "Un Effect tiene un único trabajo: sincronizar tu componente con un sistema externo — la red, un WebSocket, un timer, un listener del navegador, una API imperativa. La pregunta que ordena todo es: ¿qué sistema externo debe quedar sincronizado con este render?\n\nSi la respuesta es una conexión de chat, el Effect la abre después del commit y el cleanup la cierra antes de abrir la siguiente. Si la respuesta es \"ninguno\", no necesitás un Effect. Esa segunda mitad es la que más vale: la mayoría de los Effects del código real no deberían existir. Si el valor puede calcularse con props y state, calculalo en render; si la operación ocurre porque el usuario hizo click, pertenece al handler del click, no a un Effect que observa un booleano.\n\nEl ciclo completo siempre tiene tres partes: qué sincroniza, de qué depende y cómo se limpia. Un Effect que no puede responder las tres todavía no está terminado.",
    pitfalls: [
      "Un Effect que actualiza el mismo state que usa como dependencia entra en loop: render, effect, setState, render.",
      "No limpiar la suscripción anterior deja dos conexiones vivas: al cambiar de sala, llegan mensajes de las dos.",
      "Usar un Effect para transformar datos al recibir props agrega un render extra con un estado intermedio visible: ese cálculo va en render.",
    ],
  },
  effect_dependencies: {
    explanation: "Cada render crea versiones nuevas de tus funciones: closures que capturan los valores de ese render. Un Effect ve el mundo a través de la closure del render en que se creó, y el array de dependencias le dice a React cuándo esa closure quedó vieja y hay que resincronizar.\n\nEl bug característico es la stale closure: un interval dentro de un Effect con `[]` imprime el `count` del primer render para siempre, porque su closure nunca se renovó. Las salidas honestas son tres: declarar la dependencia que realmente usás, usar la forma funcional del setter cuando solo necesitás el valor anterior, o mover el valor a una ref cuando no debería disparar resincronización. Lo que no es salida es mentirle al array: omitir una dependencia porque molesta solo posterga el bug hasta que cambie el usuario o la ruta.\n\nEl cleanup completa el contrato. AbortController cancela la request que ya no importa, el listener se desuscribe, la respuesta que llega tarde se descarta. Sin eso, el trabajo viejo compite con el nuevo y gana el que llega último.",
    code: "useEffect(() => {\n  const controller = new AbortController()\n  api.getUser(userId, { signal: controller.signal })\n    .then(setUser)\n    .catch((error) => { if (error.name !== \"AbortError\") report(error) })\n  return () => controller.abort()\n}, [userId])",
    codeLabel: "Cancelación con AbortController",
    pitfalls: [
      "Omitir una dependencia compila y hasta funciona en el happy path: el valor viejo aparece recién cuando cambia algo que no tocaste.",
      "Pasar una función u objeto recreado en cada render como dependencia resincroniza en cada render: estabilizalo o sacalo del array.",
      "Un fetch sin cancelación puede resolver en desorden: la respuesta vieja pisa a la nueva si no descartás el resultado tardío.",
    ],
  },
};
