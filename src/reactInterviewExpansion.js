const source = (label, href) => ({ label, href });

export const INTERVIEW_EXPANSION_DATA = [
  ["react_values_elements", "React nodes, elements, components y Fragments", "fundamentals"],
  ["legacy_react_apis", "React legacy: clases, lifecycles y migración", "fundamentals"],
  ["effect_timing_strict_mode", "Effects: timing, layout y Strict Mode", "effects"],
  ["useid_identity", "useId, identidad y relaciones accesibles", "state"],
  ["react_patterns_history", "Patrones React: composición, HOC y render props", "architecture"],
  ["responsive_browser_subscriptions", "ResizeObserver y suscripciones del browser", "platform"],
  ["routing_data_apis", "React Router moderno: loaders, actions y errores", "architecture"],
  ["i18n_localization", "i18n: mensajes, locales y layout resiliente", "platform"],
  ["testing_tools_legacy", "Tooling de tests y APIs legacy", "quality"],
  ["rendering_strategies", "CSR, SSR, SSG, streaming e hidratación", "platform"],
  ["react_resources_activity", "React moderno: use, Suspense y Activity", "rendering"],
];

export const INTERVIEW_EXPANSION_PREREQUISITES = {
  react_values_elements: ["jsx_rendering", "components_props"],
  legacy_react_apis: ["react_values_elements", "hooks_rules"],
  effect_timing_strict_mode: ["effects", "effect_dependencies", "render_reconciliation"],
  useid_identity: ["hooks_rules", "jsx_rendering"],
  react_patterns_history: ["components_props", "custom_hooks", "component_architecture"],
  responsive_browser_subscriptions: ["refs_dom", "effect_dependencies", "external_stores"],
  routing_data_apis: ["routing", "data_fetching", "error_boundaries"],
  i18n_localization: ["jsx_rendering", "accessibility", "styling_assets"],
  testing_tools_legacy: ["testing_rtl", "testing_async", "legacy_react_apis"],
  rendering_strategies: ["ssr_hydration", "routing", "suspense_lazy"],
  react_resources_activity: ["suspense_lazy", "transitions_concurrency", "effect_timing_strict_mode"],
};

export const INTERVIEW_PRIORITY_INSERTIONS = [
  { id: "react_values_elements", after: "jsx_rendering" },
  { id: "legacy_react_apis", after: "hooks_rules" },
  { id: "useid_identity", after: "refs_dom" },
  { id: "effect_timing_strict_mode", after: "render_reconciliation" },
  { id: "routing_data_apis", after: "error_boundaries" },
  { id: "react_patterns_history", after: "component_api_patterns" },
  { id: "react_resources_activity", after: "suspense_lazy" },
  { id: "responsive_browser_subscriptions", after: "styling_assets" },
  { id: "i18n_localization", after: "responsive_browser_subscriptions" },
  { id: "testing_tools_legacy", after: "testing_async" },
  { id: "rendering_strategies", after: "ssr_hydration" },
];

export const INTERVIEW_EXPANSION_DETAILS = {
  react_values_elements: [
    "Fundamento",
    "Un React node es cualquier valor renderizable; un React element es la descripción inmutable de una pieza de UI; un component es la función o clase que React ejecuta para obtener nodes. JSX crea elements y un Fragment agrupa hijos sin agregar un nodo DOM.",
    "Separar estos términos evita explicar React como si JSX fuera HTML o como si llamar una función componente fuera equivalente a dejar que React la renderice.",
    "function Greeting({ name }) {\\n  return <>Hola <strong>{name}</strong></>\\n}\\n\\nconst element = <Greeting name=\"Felix\" />\\n// element describe qué renderizar; React decide cuándo ejecutar Greeting.",
    "Del JSX al árbol de React",
    [
      "JSX se transforma mediante el JSX runtime en llamadas que producen React elements; no se inserta como string HTML.",
      "Un element contiene type, props y key. Es una descripción, no un nodo DOM ni una instancia mutable.",
      "Un node puede ser un element, texto, número, null, un array de nodes y otros valores admitidos por React.",
      "Un Fragment permite varios hijos sin introducir un wrapper DOM; la sintaxis larga admite key cuando se usa en listas.",
      "createElement es la forma explícita que JSX reemplaza; cloneElement existe, pero suele crear acoplamiento frágil y la documentación propone composición, Context o render props como alternativas.",
    ],
    [
      "No llames Component(props) directamente para renderizarlo: <Component /> deja que React controle identidad, Hooks y reconciliación.",
      "Virtual DOM es una metáfora útil, pero una entrevista fuerte habla de elements, árbol, render, reconciliation y commit sin prometer que siempre supera cualquier actualización manual.",
      "Un Fragment elimina un wrapper innecesario; no elimina la necesidad de key cuando cada grupo pertenece a una lista.",
    ],
    "Component produce nodes; JSX produce elements; React reconcilia esas descripciones y hace commit al host.",
    {
      tableTitle: "VOCABULARIO EXACTO",
      tableLabel: "No son sinónimos",
      table: {
        columns: ["Concepto", "Qué es", "Ejemplo"],
        rows: [
          ["React node", "Cualquier valor que React puede renderizar", "texto, null, element, array"],
          ["React element", "Objeto inmutable que describe UI", "<Button />"],
          ["Component", "Definición que React ejecuta", "function Button()"],
          ["DOM node", "Objeto real del navegador", "HTMLButtonElement"],
        ],
      },
      audit: {
        primer: "JSX describe un árbol de React; no es HTML pegado al DOM. El element conserva type, props y key, y React usa esa descripción para decidir qué componente ejecutar y qué host nodes confirmar.",
        example: "El Fragment en una fila puede devolver dos celdas sin envolverlas en un div inválido dentro del table. Si varias filas usan Fragment, React.Fragment con key conserva su identidad.",
        failureModes: [
          "Confundir element con DOM node lleva a intentar mutarlo o medirlo antes del commit.",
          "Invocar un componente como función puede romper las reglas de Hooks y ocultar su identidad a React.",
        ],
      },
      sources: [
        source("createElement — React", "https://react.dev/reference/react/createElement"),
        source("Fragment — React", "https://react.dev/reference/react/Fragment"),
        source("React calls Components and Hooks — React", "https://react.dev/reference/rules/react-calls-components-and-hooks"),
      ],
    },
  ],
  legacy_react_apis: [
    "Mantenimiento",
    "El React moderno usa function components y Hooks, pero una entrevista puede pedir reconocer clases, lifecycle methods, PureComponent, PropTypes, forwardRef y APIs de testing antiguas. La meta es traducir su intención y conocer qué cambió en React 19.",
    "Muchos productos siguen migrando código. Saber leer el pasado evita respuestas dogmáticas y permite elegir una migración segura.",
    "class Boundary extends React.Component {\\n  state = { error: null }\\n  static getDerivedStateFromError(error) { return { error } }\\n  componentDidCatch(error, info) { report(error, info) }\\n  render() { return this.state.error ? <Fallback /> : this.props.children }\\n}",
    "El caso vigente de una clase: Error Boundary",
    [
      "constructor inicializa state; render calcula UI; componentDidMount conecta; componentDidUpdate resincroniza; componentWillUnmount limpia. Un Effect modela una sincronización completa en vez de repartirla por tres métodos.",
      "PureComponent aplica una comparación superficial de props y state. React.memo cumple un rol parecido para function components, pero ninguno vuelve puro al código ni corrige mutaciones.",
      "React 19 ignora propTypes en function components y recomienda TypeScript u otra solución; la validación de red sigue siendo runtime y separada.",
      "En React 19 ref puede recibirse como prop en function components. forwardRef sigue siendo necesario para entender y mantener código de React 18 y librerías compatibles.",
      "Los Error Boundaries todavía se implementan con una clase directamente, aunque frameworks y librerías ofrecen wrappers o boundaries de ruta.",
    ],
    [
      "No traduzcas componentDidMount mecánicamente a useEffect(..., []): primero identificá qué sistema sincroniza y qué dependencias reales tiene.",
      "PureComponent y memo usan igualdad superficial; mutar un objeto puede hacer que parezca sin cambios.",
      "PropTypes no reemplazaba validación de input externo: era una comprobación de props en desarrollo.",
    ],
    "Reconocé la intención legacy y migrala al modelo moderno; no memorices equivalencias lifecycle por lifecycle.",
    {
      prompt: "Te muestran una clase con componentDidMount, componentDidUpdate y componentWillUnmount. Explicá la sincronización que representan y migrala sin omitir dependencias ni cleanup.",
      audit: {
        primer: "Las clases no desaparecieron del ecosistema, pero las nuevas APIs de React se diseñan alrededor de funciones. El valor de entrevista es poder mantener y migrar sin inventar equivalencias falsas.",
        example: "Una suscripción repartida entre mount, update y unmount se convierte en un Effect cuya setup y cleanup dependen del roomId. Un Error Boundary puede permanecer como clase y envolver una feature funcional.",
        failureModes: [
          "Copiar lifecycle methods a varios Effects puede duplicar requests o separar setup de cleanup.",
          "Asumir que forwardRef ya no existe rompe compatibilidad con React 18 aunque React 19 permita ref como prop.",
        ],
      },
      sources: [
        source("Component — React", "https://react.dev/reference/react/Component"),
        source("PureComponent — React", "https://react.dev/reference/react/PureComponent"),
        source("React 19 Upgrade Guide", "https://react.dev/blog/2024/04/25/react-19-upgrade-guide"),
        source("forwardRef — React", "https://react.dev/reference/react/forwardRef"),
      ],
    },
  ],
  effect_timing_strict_mode: [
    "Effects",
    "useEffect sincroniza después del commit; useLayoutEffect permite medir o ajustar layout antes de que el navegador repinte; useInsertionEffect existe principalmente para librerías CSS-in-JS. Strict Mode agrega comprobaciones de desarrollo para revelar impureza y cleanup incompleto.",
    "El timing importa cuando una medición visible podría parpadear, pero usar trabajo síncrono antes del paint bloquea la pantalla y debe ser excepcional.",
    "function Tooltip() {\\n  const ref = useRef(null)\\n  useLayoutEffect(() => {\\n    setHeight(ref.current.getBoundingClientRect().height)\\n  }, [])\\n  return <div ref={ref}>...</div>\\n}",
    "Medición antes del paint",
    [
      "Render calcula; commit modifica el DOM; el browser prepara layout y paint. useLayoutEffect corre después del cambio DOM y antes del repaint.",
      "Preferí useEffect para red, listeners y sincronización que no necesita bloquear el paint.",
      "Usá useLayoutEffect cuando debés medir y realizar un segundo render antes de que el usuario vea una posición incorrecta.",
      "Strict Mode vuelve a renderizar y ejecuta un ciclo extra setup-cleanup en desarrollo; confirma pureza y simetría, no simula dos usuarios.",
      "En React 19.2, useEffectEvent separa lógica no reactiva disparada desde un Effect sin usarla para ocultar dependencias verdaderas.",
    ],
    [
      "useLayoutEffect en exceso retrasa el paint y puede producir warnings en rendering de servidor.",
      "Eliminar una dependencia para frenar un Effect conserva una closure vieja; primero reestructurá la sincronización.",
      "No desactives Strict Mode para esconder un setup duplicado: hacé que cleanup deshaga exactamente el recurso creado.",
    ],
    "Elegí el Effect por el sistema que sincroniza y el momento visual que necesita; Strict Mode prueba que el contrato resiste repetición.",
    {
      explanation: "useEffect se ejecuta después del commit para sincronizaciones que no necesitan bloquear la pintura. useLayoutEffect también corre después de que React modificó el DOM, pero antes de que el navegador repinte: permite medir y corregir una posición sin que el usuario vea el salto, a costa de bloquear ese frame. useInsertionEffect es una escape hatch todavía más temprana pensada principalmente para librerías CSS-in-JS. En desarrollo, Strict Mode repite renders y ensaya un ciclo adicional de setup y cleanup para revelar impureza o recursos que no se liberan; ese trabajo extra no ocurre igual en producción.",
      tableTitle: "TIMING DE ESCAPE HATCHES",
      tableLabel: "Usá la menos bloqueante que resuelva el caso",
      table: {
        columns: ["API", "Momento", "Caso"],
        rows: [
          ["useEffect", "Después del commit; normalmente después del paint", "red, listeners, widgets"],
          ["useLayoutEffect", "Después del DOM, antes del repaint", "medir y corregir layout"],
          ["useInsertionEffect", "Antes de Effects de layout", "inyección de estilos en librerías"],
          ["useEffectEvent", "Se llama desde un Effect", "leer valores recientes sin resincronizar"],
        ],
      },
      audit: {
        primer: "No existe un equivalente exacto 'componentDidMount = useEffect'. Un Effect representa una sincronización que puede empezar y detenerse muchas veces.",
        example: "Un tooltip se mide con layout effect para que el usuario no vea el salto; analytics puede enviarse en effect sin bloquear el paint.",
        failureModes: [
          "Una medición en useEffect puede producir flicker.",
          "Trabajo caro en useLayoutEffect congela el frame antes de que el usuario vea contenido.",
        ],
      },
      sources: [
        source("useEffect — React", "https://react.dev/reference/react/useEffect"),
        source("useLayoutEffect — React", "https://react.dev/reference/react/useLayoutEffect"),
        source("StrictMode — React", "https://react.dev/reference/react/StrictMode"),
        source("useEffectEvent — React", "https://react.dev/reference/react/useEffectEvent"),
      ],
    },
  ],
  useid_identity: [
    "Hooks",
    "useId genera un identificador estable para relacionar elementos de accesibilidad dentro de una instancia y coordina IDs entre server rendering e hidratación. No representa identidad de datos y no debe usarse como key de una lista.",
    "Confundir identidad DOM, identidad del dominio e identidad de React causa labels rotos, hydration mismatches y state asociado a la fila incorrecta.",
    "function PasswordField() {\\n  const hintId = useId()\\n  return <>\\n    <label>Password <input aria-describedby={hintId} /></label>\\n    <p id={hintId}>Al menos 12 caracteres.</p>\\n  </>\\n}",
    "Una relación accesible sin colisiones",
    [
      "Llamá useId en el nivel superior y agregá sufijos si un componente necesita varias relaciones.",
      "Usalo para htmlFor, aria-describedby o aria-controls cuando el consumidor no entregó un id explícito.",
      "Durante SSR, el árbol inicial del servidor y del cliente debe coincidir para que React genere la misma secuencia.",
      "Para keys usá un id proveniente de los datos; para un recurso de negocio usá su identificador canónico.",
    ],
    [
      "useId no es un generador de UUID para requests, registros o claves de idempotencia.",
      "Generar Math.random durante render rompe estabilidad y puede causar hydration mismatch.",
      "Un id único no garantiza que la relación ARIA sea correcta: los roles y estados también deben corresponder.",
    ],
    "useId relaciona markup; keys relacionan elementos entre renders; los IDs de dominio identifican entidades.",
    {
      audit: {
        primer: "Hay tres identidades distintas: DOM/a11y, reconciliación y dominio. useId solo resuelve la primera.",
        example: "Dos PasswordField en la misma página reciben IDs distintos y cada input apunta a su propia ayuda. Una lista de usuarios sigue usando user.id como key.",
        failureModes: [
          "Usar useId dentro de map no solo viola Hooks: tampoco expresa la identidad persistente del registro.",
          "Cambiar el árbol entre servidor y primer render cliente puede desalinear IDs e hidratación.",
        ],
      },
      sources: [source("useId — React", "https://react.dev/reference/react/useId")],
    },
  ],
  react_patterns_history: [
    "Arquitectura",
    "Composición, custom Hooks, Context, render props y HOCs son formas de reutilizar comportamiento o estructura. HOCs y render props siguen apareciendo en bases reales; para código nuevo, composición y custom Hooks suelen hacer el flujo más directo, pero no reemplazan todos los casos.",
    "Una entrevista puede usar nombres históricos para comprobar si reconocés el problema detrás del patrón y sus costos de identidad, nesting, tipos y depuración.",
    "function withPermission(Component) {\\n  return function Guarded(props) {\\n    const canView = usePermission(props.resource)\\n    return canView ? <Component {...props} /> : <Forbidden />\\n  }\\n}\\n\\n// Alternativa moderna: usePermission + composición explícita en la route.",
    "HOC reconocido y alternativa explícita",
    [
      "Composición usa children o props de elementos para ensamblar UI sin herencia.",
      "Un HOC recibe un component y devuelve otro; fue común para conectar stores, permisos o datos antes de Hooks.",
      "Render props entregan comportamiento mediante una función prop; permiten que el consumidor decida el markup.",
      "Un custom Hook reutiliza lógica con Hooks y deja la estructura visible en el componente consumidor.",
      "Container/presentational describe roles de coordinación y presentación, no una obligación de dividir cada componente.",
    ],
    [
      "Crear el HOC dentro de render produce un component type nuevo y puede resetear todo el subárbol.",
      "Cadenas de HOCs o render props pueden ocultar de dónde vienen props y crear nesting difícil de depurar.",
      "Un custom Hook no comparte state entre llamadas salvo que se conecte a una fuente externa común.",
    ],
    "Aprendé la intención y el costo de cada patrón; elegí composición explícita salvo que otra frontera proteja mejor una decisión.",
    {
      tableTitle: "PATRONES DE REUTILIZACIÓN",
      tableLabel: "Reconocer legado y elegir con intención",
      table: {
        columns: ["Patrón", "Reutiliza", "Costo típico"],
        rows: [
          ["Composición", "estructura y slots", "contrato disperso si hay demasiados slots"],
          ["Custom Hook", "lógica con Hooks", "dependencias ocultas si el nombre es pobre"],
          ["HOC", "envoltura de components", "capas, tipos y colisiones de props"],
          ["Render prop", "comportamiento con markup libre", "nesting e identidades de funciones"],
        ],
      },
      audit: {
        primer: "Los patrones no son generaciones que se invalidan entre sí. Cambia cuál hace más visible el flujo para un problema concreto.",
        example: "Una librería headless puede usar un Hook para state y devolver props explícitas; un Error Boundary todavía necesita otra frontera; una integración legacy puede exponer un HOC estable.",
        failureModes: [
          "Migrar un HOC a Hook sin conservar loading, errores y suscripciones puede cambiar el contrato.",
          "Extraer cualquier lógica a un Hook con nombre genérico solo mueve complejidad.",
        ],
      },
      docNotes: [
        "La documentación actual de React enseña composición y custom Hooks como herramientas principales. HOCs y render props siguen siendo patrones de JavaScript válidos, pero aparecen sobre todo en librerías o código anterior.",
        "React debe llamar a los components mediante JSX. Un HOC se crea fuera de render y devuelve un component type estable; no se invoca el component envuelto como una función común.",
        "Extraer un custom Hook cambia la organización, no el ownership: cada llamada conserva state separado salvo que el Hook se conecte a una fuente compartida.",
      ],
      sources: [
        source("Passing Props to a Component — React", "https://react.dev/learn/passing-props-to-a-component"),
        source("Reusing Logic with Custom Hooks — React", "https://react.dev/learn/reusing-logic-with-custom-hooks"),
        source("cloneElement alternatives — React", "https://react.dev/reference/react/cloneElement#alternatives"),
      ],
    },
  ],
  responsive_browser_subscriptions: [
    "Web platform",
    "Una UI puede responder al viewport con CSS, al tamaño de un contenedor con container queries o ResizeObserver, y a una fuente externa compartida con useSyncExternalStore. Elegir la capa correcta evita convertir layout en state React sin necesidad.",
    "La pregunta de entrevista '¿cómo rerenderizar al hacer resize?' esconde otra más importante: ¿la UI realmente necesita JavaScript o CSS ya expresa el comportamiento?",
    "function useElementWidth(ref) {\\n  const [width, setWidth] = useState(0)\\n  useLayoutEffect(() => {\\n    const node = ref.current\\n    if (!node) return\\n    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))\\n    observer.observe(node)\\n    return () => observer.disconnect()\\n  }, [ref])\\n  return width\\n}",
    "Observar el contenedor y limpiar",
    [
      "Preferí media queries o container queries cuando solo cambia el layout visual.",
      "Usá ResizeObserver cuando JavaScript necesita el tamaño de un elemento, no solo del viewport.",
      "Agrupá o limitá trabajo costoso porque resize puede producir muchas notificaciones.",
      "Desconectá observers y listeners en cleanup.",
      "Si muchos componentes leen una misma fuente externa, modelá subscribe/getSnapshot con useSyncExternalStore.",
    ],
    [
      "Escuchar window.resize no detecta necesariamente el cambio de tamaño de un contenedor.",
      "Leer layout y escribir estilos repetidamente en el mismo frame puede provocar layout thrashing.",
      "Guardar cada pixel en Context puede rerenderizar una gran parte del árbol sin necesidad.",
    ],
    "CSS posee layout; observadores conectan JavaScript solo cuando el comportamiento necesita una medición.",
    {
      audit: {
        primer: "Responsive no significa siempre setState(window.innerWidth). Primero elegí si el problema pertenece a CSS, a un elemento o a una fuente de datos del browser.",
        example: "Una card cambia de columnas con container queries. Un gráfico que recalcula su escala observa el ancho real de su wrapper y cancela el observer al desmontar.",
        failureModes: [
          "Un listener sin cleanup sigue ejecutándose después de desmontar la pantalla y retiene callbacks o datos que ya deberían liberarse.",
          "Un resize handler que fuerza layout varias veces por frame produce jank.",
        ],
      },
      sources: [
        source("ResizeObserver — MDN", "https://developer.mozilla.org/docs/Web/API/ResizeObserver"),
        source("CSS Container Queries — MDN", "https://developer.mozilla.org/docs/Web/CSS/CSS_containment/Container_queries"),
        source("useSyncExternalStore — React", "https://react.dev/reference/react/useSyncExternalStore"),
      ],
    },
  ],
  routing_data_apis: [
    "Arquitectura",
    "React Router moderno puede hacer más que mapear paths a elements. En data o framework mode, una route define loader para lecturas, action para mutaciones, pending UI, revalidación y ErrorBoundary. La ruta se convierte en una frontera de datos y errores coordinada con la navegación.",
    "Conocer solo BrowserRouter y useNavigate cubre routing declarativo básico; una entrevista actual puede preguntar cómo evitar fetch waterfalls, manejar mutations o aislar errores por ruta.",
    "const router = createBrowserRouter([{\\n  path: \"/orders/:id\",\\n  loader: ({ params }) => getOrder(params.id),\\n  action: ({ request, params }) => updateOrder(request, params.id),\\n  Component: OrderRoute,\\n  ErrorBoundary: OrderError,\\n}])",
    "Una route con lectura, mutación y error",
    [
      "Elegí el modo del router según si necesitás solo matching, APIs de datos o integración full-stack.",
      "El loader obtiene datos para una navegación y puede lanzar una Response 404 a la boundary más cercana.",
      "El action procesa una mutación de route; después, el router revalida loaders relevantes.",
      "useNavigation y fetchers permiten mostrar pending y mutar sin inventar flags globales.",
      "Nested routes componen layouts, datos y Error Boundaries; Outlet renderiza el hijo que hizo match.",
    ],
    [
      "No mezcles un loader y un useEffect que obtienen el mismo recurso: creás dos autoridades y requests duplicadas.",
      "Una private route del cliente no sustituye auth en loaders, actions y API.",
      "replace evita una entrada de historial; push crea una nueva. Elegir mal afecta Back después de login o redirects.",
    ],
    "Una route moderna puede poseer URL, datos, mutaciones, pending y errores como una frontera coherente.",
    {
      prompt: "Diseñá /orders/:id/edit con loader, action, 404, validación y pending sin duplicar el dato en useEffect.",
      audit: {
        primer: "React Router tiene modos. La API de <Routes> alcanza para matching declarativo; data routers agregan coordinación de red y estados de navegación.",
        example: "El loader de /orders/42 obtiene la orden antes de renderizar; una 404 llega a OrderError. El form llama la action y el router revalida el loader al completar.",
        failureModes: [
          "Un spinner global para cada navegación puede ocultar el layout y empeorar UX.",
          "Revalidar todos los loaders después de cualquier action puede generar trabajo innecesario si no se entiende la dependencia.",
        ],
      },
      docNotes: [
        "React Router documenta tres modos: declarative, data y framework. Las APIs disponibles y la estrategia de data loading cambian según el modo elegido.",
        "Después de una action exitosa, los data routers revalidan loader data para mantener la UI sincronizada. Un fetcher permite mutar sin producir una navegación.",
        "Una ErrorBoundary de route puede recibir errores de loaders, actions y rendering de la route. Eso es una integración del router y no el alcance automático de cualquier Error Boundary de React.",
      ],
      sources: [
        source("React Router: Picking a mode", "https://reactrouter.com/start/modes"),
        source("Route Object", "https://reactrouter.com/start/data/route-object"),
        source("Actions", "https://reactrouter.com/start/data/actions"),
        source("Error Boundaries", "https://reactrouter.com/how-to/error-boundary"),
      ],
    },
  ],
  i18n_localization: [
    "Web platform",
    "Internacionalizar no es reemplazar strings. La aplicación separa mensajes de código, elige locale, formatea números, fechas y plurales con reglas locales, soporta dirección de texto y prueba que el layout resiste contenido más largo o distinto.",
    "Las preguntas sobre react-intl evalúan una implementación; el conocimiento transferible es modelar mensajes, locale, fallback, formato y contenido resiliente.",
    "const formatter = new Intl.NumberFormat(locale, {\\n  style: \"currency\",\\n  currency: order.currency,\\n})\\nreturn <output>{formatter.format(order.total)}</output>",
    "Formato según locale y moneda",
    [
      "Definí cómo se negocia y persiste el locale: URL, perfil, cookie o preferencia del browser.",
      "Usá IDs de mensaje estables y catálogos por locale; no concatenes fragmentos que el traductor no puede reordenar.",
      "Formateá números, fechas, moneda, listas y plurales con Intl o una librería que use esas reglas.",
      "Propagá lang y dir al documento o subárbol cuando cambia el idioma o la dirección.",
      "Probá pseudolocalización, copy larga, caracteres no latinos, RTL, zoom y fallback por mensaje faltante.",
    ],
    [
      "Guardar fechas ya formateadas pierde zona horaria y capacidad de volver a representar.",
      "Asumir que plural es singular/plural falla en idiomas con más categorías.",
      "Usar texto traducido como key de React o ID de una opción rompe identidad al cambiar locale.",
    ],
    "Localizá significado y formato; diseñá el layout para contenido que no controlás.",
    {
      tableTitle: "CAPAS DE I18N",
      tableLabel: "Qué responsabilidad tiene cada una",
      table: {
        columns: ["Capa", "Ejemplo", "Falla si se omite"],
        rows: [
          ["Mensajes", "orders.empty.title", "copy hardcodeada"],
          ["Formato", "Intl.DateTimeFormat", "fecha o moneda ambigua"],
          ["Locale", "/es-UY/orders", "pantalla no reproducible"],
          ["Layout", "dir=rtl, texto largo", "contenido cortado"],
        ],
      },
      audit: {
        primer: "react-intl o react-i18next son herramientas. El modelo base son mensajes, locale, reglas lingüísticas y resiliencia visual.",
        example: "La URL /es-UY/orders conserva el locale; el precio usa moneda de la orden y convenciones del usuario; una traducción alemana larga no corta el botón.",
        failureModes: [
          "Concatenar 'Hola ' + name puede impedir que otro idioma reordene la oración.",
          "Un fallback silencioso puede mezclar idiomas y ocultar mensajes no traducidos.",
        ],
      },
      sources: [
        source("Intl — MDN", "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl"),
        source("FormatJS: React Intl", "https://formatjs.github.io/docs/react-intl/"),
        source("W3C Internationalization", "https://www.w3.org/International/"),
      ],
    },
  ],
  testing_tools_legacy: [
    "Testing",
    "El runner (Vitest o Jest), el entorno DOM, Testing Library, user-event, MSW y el browser runner cumplen roles distintos. React 19 depreca react-test-renderer y recomienda alejarse de shallow rendering porque ambos dependen de detalles que no representan bien el entorno del usuario.",
    "Una entrevista suele mezclar nombres de herramientas; responder bien significa ubicar cada una y elegir evidencia según el riesgo.",
    "test(\"guarda una orden\", async () => {\\n  const user = userEvent.setup()\\n  server.use(http.post(\"/orders\", () => HttpResponse.json({ id: \"42\" })))\\n  render(<Checkout />)\\n  await user.click(screen.getByRole(\"button\", { name: /confirmar/i }))\\n  expect(await screen.findByText(/orden 42 creada/i)).toBeVisible()\\n})",
    "Interacción, red y resultado observable",
    [
      "El test runner descubre tests, ejecuta assertions y provee mocks/timers; jsdom simula APIs DOM sin ser un browser completo.",
      "Testing Library renderiza y consulta por roles, nombres y resultados visibles; user-event reproduce secuencias de interacción más realistas.",
      "MSW intercepta HTTP en el borde de red para que el componente use su cliente real sin llamar un backend externo.",
      "renderHook sirve para Hooks que son una API reutilizable; si el Hook solo existe para una feature, probar el componente suele dar más confianza.",
      "Snapshot puede proteger una salida pequeña y deliberada; un snapshot enorme no explica qué comportamiento importa.",
    ],
    [
      "Shallow rendering evita hijos y puede ocultar integración, Context y efectos; React recomienda migrar a una librería de testing moderna.",
      "react-test-renderer está deprecado en React 19 y puede comportarse distinto al DOM real.",
      "Mockear cada Hook interno hace que el test repita la implementación y sobreviva aunque el flujo de usuario esté roto.",
    ],
    "Nombrá primero el riesgo observable; después elegí runner, DOM simulado, red interceptada o browser real.",
    {
      tableTitle: "HERRAMIENTA POR RESPONSABILIDAD",
      tableLabel: "Evitar tratar todo como Jest",
      table: {
        columns: ["Pieza", "Responsabilidad", "No demuestra"],
        rows: [
          ["Vitest/Jest", "runner, assertions, mocks", "layout real"],
          ["RTL + user-event", "comportamiento DOM", "browser completo"],
          ["MSW", "contrato HTTP desde el cliente", "backend real"],
          ["Playwright", "flujo en browser", "todas las ramas unitarias"],
        ],
      },
      audit: {
        primer: "Testing moderno prueba contratos en la capa más barata que puede observar el riesgo con fidelidad.",
        example: "RTL verifica que un 500 muestra Reintentar usando MSW; Playwright comprueba foco real y navegación; un unit test prueba un parser puro con muchas combinaciones.",
        failureModes: [
          "fireEvent puede saltar eventos que user-event sí dispara.",
          "waitFor con assertions vagas puede ocultar que el test no llegó al estado esperado.",
        ],
      },
      sources: [
        source("React 19 Upgrade Guide: testing APIs", "https://react.dev/blog/2024/04/25/react-19-upgrade-guide"),
        source("React Testing Library", "https://testing-library.com/docs/react-testing-library/intro/"),
        source("Mock Service Worker", "https://mswjs.io/docs/"),
      ],
    },
  ],
  rendering_strategies: [
    "Plataforma",
    "CSR, SSR, SSG y streaming describen cuándo y dónde se produce HTML; hidratación conecta React cliente a HTML previo. Server Components describen dónde se ejecuta y empaqueta un componente. Son ejes relacionados, no nombres intercambiables.",
    "Una entrevista actual espera elegir estrategia por contenido, caché, personalización, SEO, latencia y costo operativo, no declarar que SSR siempre es más rápido.",
    "createRoot(container).render(<App />)       // CSR\\nhydrateRoot(container, <App />)              // HTML previo + cliente\\nrenderToPipeableStream(<App />, options)      // streaming SSR en Node",
    "Tres puntos de entrada distintos",
    [
      "CSR envía un shell y produce la UI principal en el browser después de cargar JavaScript.",
      "SSR produce HTML por request; SSG lo produce durante build o revalidación para servirlo desde cache/CDN.",
      "Streaming SSR envía partes listas y fallbacks de Suspense antes de completar toda la página.",
      "Hidratación requiere que el primer árbol cliente coincida con el HTML del servidor; luego conecta eventos.",
      "Server Components pueden ejecutarse en build o request y enviar una representación serializada; su código no forma parte del bundle cliente.",
    ],
    [
      "SSR puede mejorar contenido inicial pero también agrega trabajo de servidor, hydration y JavaScript cliente.",
      "SSG puro no sirve para datos personalizados por request sin una capa dinámica adicional.",
      "Leer Date.now, random, window o localStorage en el primer render puede causar mismatch.",
    ],
    "Separá generación de HTML, hidratación y frontera server/client antes de comparar arquitecturas.",
    {
      tableTitle: "EJES DE RENDERING",
      tableLabel: "Cuándo se produce y qué llega al browser",
      table: {
        columns: ["Estrategia", "Momento", "Trade-off"],
        rows: [
          ["CSR", "en el browser", "shell simple; contenido espera JS/datos"],
          ["SSR", "por request", "personalización; costo y cache complejos"],
          ["SSG", "build/revalidación", "CDN rápido; freshness limitada"],
          ["Streaming SSR", "por request en partes", "contenido progresivo; boundaries necesarias"],
        ],
      },
      audit: {
        primer: "SSR, SSG y Server Components responden preguntas distintas. Primero preguntá cuándo se genera HTML y qué JavaScript necesita el cliente.",
        example: "Una landing pública puede ser estática; una cuenta personalizada usa rendering por request; un filtro interactivo sigue siendo cliente aunque reciba su catálogo desde un Server Component.",
        failureModes: [
          "Llamar SSR a cualquier código que corre en servidor confunde HTML inicial con Server Components.",
          "Hidratar markup distinto puede forzar recuperación cliente y ocultar errores de datos o HTML inválido.",
        ],
      },
      sources: [
        source("React DOM Server APIs", "https://react.dev/reference/react-dom/server"),
        source("hydrateRoot — React", "https://react.dev/reference/react-dom/client/hydrateRoot"),
        source("Server Components — React", "https://react.dev/reference/rsc/server-components"),
      ],
    },
  ],
  react_resources_activity: [
    "React moderno",
    "La API use lee un recurso como una Promise o Context durante render y se integra con Suspense y Error Boundaries. Activity, estable en React 19.2, permite ocultar una parte preservando state, desmontando sus Effects y difiriendo trabajo oculto. Ambas requieren entender render concurrente y límites de framework.",
    "GreatFrontend cubre React 19, pero una preparación actual también debe reconocer las adiciones de React 19.2 y distinguir una API React estable de una integración que solo ofrece un framework.",
    "function Comments({ commentsPromise }) {\\n  const comments = use(commentsPromise)\\n  return comments.map(comment => <Comment key={comment.id} {...comment} />)\\n}\\n\\n<Activity mode={tab === \"details\" ? \"visible\" : \"hidden\"}>\\n  <Details />\\n</Activity>",
    "Leer un recurso y preservar una pantalla oculta",
    [
      "use(Promise) suspende mientras la Promise está pending, devuelve su valor al cumplir y propaga el rechazo a la Error Boundary.",
      "A diferencia de Hooks comunes, use puede llamarse en condiciones y loops, pero sigue debiendo ejecutarse mientras React renderiza un component o Hook.",
      "La Promise debe ser estable; crear una nueva en cada render cliente puede suspender repetidamente. Los frameworks suelen producir y cachear esos recursos.",
      "Activity hidden oculta hijos, desmonta Effects y difiere actualizaciones, pero conserva state para una navegación posterior.",
      "useEffectEvent, Activity y React Performance Tracks son temas de React 19.2; cacheSignal y varias APIs de recursos dependen del entorno Server Components.",
    ],
    [
      "use no convierte cualquier fetch de cliente en una estrategia completa de cache, deduplicación y mutación.",
      "Ocultar una Activity no significa que sus conexiones sigan activas: sus Effects se limpian.",
      "No presentes una API de framework como disponible automáticamente en una SPA Vite sin esa integración.",
    ],
    "React moderno coordina recursos y prioridad, pero el framework sigue definiendo cómo nacen, se cachean y se transportan los datos.",
    {
      prompt: "Compará use(Promise), un loader del router y TanStack Query para una pantalla de detalle. Explicá quién crea el recurso, quién cachea y cómo se recupera un error.",
      audit: {
        primer: "use es una API de lectura durante render; Activity gestiona una parte visible u oculta del árbol. No reemplazan una arquitectura de datos ni autorización.",
        example: "Un Server Component crea una Promise y la pasa a un Client Component que la lee con use bajo Suspense. Una tab visitada se conserva en Activity hidden, pero su conexión se limpia mientras no es visible.",
        failureModes: [
          "Crear la Promise durante cada render puede reiniciar Suspense.",
          "Conservar state oculto puede aumentar memoria; solo conviene para superficies donde la navegación rápida lo justifica.",
        ],
      },
      sources: [
        source("use — React", "https://react.dev/reference/react/use"),
        source("Activity — React", "https://react.dev/reference/react/Activity"),
        source("React 19.2", "https://react.dev/blog/2025/10/01/react-19-2"),
      ],
    },
  ],
};
