export const REACT_ADVANCED_AUDIT_NOTES = {
  native_component_contract: {
    primer: "Un wrapper reutilizable no reemplaza el contrato del elemento nativo que contiene. Si promete comportarse como un button o input, debe conservar atributos, eventos, ref, foco y participación en formularios en el nodo que realmente posee ese comportamiento.",
    example: "Un TextField puede dibujar label, ayuda y error alrededor de un input. La ref, name, required y onChange llegan al input; className puede necesitar destinos separados para el control y el wrapper. Así FormData, focus() y las herramientas de accesibilidad siguen observando el elemento correcto.",
    failureModes: [
      "Propagar todas las props al div exterior hace que TypeScript acepte name o disabled aunque el formulario y el navegador no los reciban.",
      "Mover la ref del input al wrapper rompe código consumidor que llama focus(), mide el control o espera HTMLInputElement.",
      "Duplicar el mismo id o handler en dos nodos puede crear HTML inválido o eventos ejecutados dos veces.",
    ],
  },
  public_component_contract: {
    primer: "La superficie pública es todo lo que otra parte del sistema puede observar y usar de forma legítima: props y tipos, pero también DOM, ref, callbacks, semántica, nombres accesibles, comportamiento de form y puntos de extensión visual.",
    example: "Una aplicación puede depender de que Button sea un button real para enviar un form, de que su ref permita focus y de que data-state=\"loading\" exista para styling. Cambiarlo por un div conserva el aspecto, pero rompe tres contratos sin modificar la interface TypeScript.",
    failureModes: [
      "Declarar que un detalle era interno no protege a consumidores si la librería lo expuso y documentó de hecho.",
      "Prometer cada clase y cada nodo congela la implementación; conviene nombrar attachment points deliberados.",
      "Un snapshot que conserva el DOM actual no decide qué parte de ese DOM debería ser estable.",
    ],
  },
  callback_contracts: {
    primer: "Un callback es un pequeño protocolo entre el componente y su consumidor. Su nombre, momento de ejecución, payload y significado indican qué transición ocurrió y qué puede hacer el receptor con esa información.",
    example: "Un Select emite onValueChange({ value: \"admin\", reason: \"select\", originalEvent }) cuando el usuario confirma una opción. Cerrar con Escape solo emite onOpenChange(false); no inventa una selección ni confirma el borrador.",
    failureModes: [
      "Un onChange que a veces significa edición y otras veces confirmación obliga a cada consumidor a inferir el estado interno.",
      "Cambiar el orden de parámetros posicionales es breaking aunque TypeScript todavía encuentre tipos compatibles.",
      "Fabricar un objeto parecido a un evento nativo sin preventDefault, target o lifecycle reales crea una API engañosa.",
    ],
  },
  controlled_uncontrolled_api: {
    primer: "En modo controlado, el valor visible viene de la prop value y el callback solo propone un cambio; el padre debe entregar el valor nuevo. En modo no controlado, defaultValue inicializa state interno una vez y el componente pasa a poseerlo.",
    example: "Un Accordion controlado recibe openItem y onOpenItemChange; si el padre ignora el callback, la UI no cambia. En modo no controlado recibe defaultOpenItem, actualiza su state al interactuar y puede exponer el mismo callback como notificación.",
    failureModes: [
      "Copiar value a state con un Effect crea dos fuentes de verdad y puede sobrescribir una interacción reciente.",
      "Usar value || internalValue rompe valores controlados válidos como cadena vacía, cero o false.",
      "Cambiar de modo durante la vida del componente vuelve ambiguos reset, validación y ownership.",
    ],
  },
  draft_commit_state: {
    primer: "Draft es lo que la persona está editando; committed es el valor que la aplicación ya aceptó. Separarlos permite que Apply confirme y que Cancel, Escape o cerrar sin guardar descarten el borrador de manera predecible.",
    example: "Un filtro de fechas abre con draft igual al rango confirmado. Mover el calendario cambia solo el draft; Apply valida, emite el rango y cierra. Escape cierra y al abrir de nuevo reconstruye el draft desde el valor confirmado.",
    failureModes: [
      "Copiar props cada vez que cambia isOpen puede borrar una edición si otra actualización visual abre o cierra el panel.",
      "Tratar click afuera como Apply confirma datos que la persona quizá estaba revisando.",
      "Confundir Clear con Reset impide distinguir valor vacío, valor inicial y valor confirmado por el padre.",
    ],
  },
  library_type_design: {
    primer: "Un tipo público debe impedir estados inválidos, revelar las operaciones disponibles y seguir siendo útil en el editor. TypeScript describe lo conocido en compilación; datos de red, storage o configuración todavía necesitan validación en runtime.",
    example: "En vez de { loading?: boolean, data?: T, error?: Error }, una unión por status evita data y error simultáneos. Un parser valida el JSON de la API antes de convertirlo a esa unión; escribir response as T no ejecuta ninguna comprobación.",
    failureModes: [
      "Muchas props opcionales permiten combinaciones que el componente no sabe renderizar.",
      "Un cast silencia al compilador justamente en la frontera donde el dato todavía no fue probado.",
      "Reexportar tipos de un vendor sin política puede convertir cualquier cambio de esa dependencia en un breaking change propio.",
    ],
  },
  api_evolution: {
    primer: "Una API compartida no cambia para todos sus consumidores al mismo tiempo. Una migración segura mantiene temporalmente el contrato anterior, anuncia la alternativa, permite medir adopción y elimina lo viejo en una versión compatible con esa promesa.",
    example: "La prop isOpen se depreca a favor de open. Durante una versión, el componente acepta ambas, prioriza open, muestra aviso de desarrollo y documenta un codemod. La telemetría o búsqueda de consumidores confirma adopción antes de remover isOpen en la siguiente major.",
    failureModes: [
      "Eliminar primero y escribir la guía después obliga a cada aplicación a descubrir la migración cuando ya está rota.",
      "Mantener dos caminos sin una regla de precedencia produce resultados distintos cuando llegan ambas props.",
      "Una feature flag no corrige incompatibilidad de tipos, datos o entry points entre versiones desplegadas.",
    ],
  },
  behavior_ownership: {
    primer: "Ownership de comportamiento significa ser responsable de todas las reglas que hacen funcionar una interacción. Reemplazar una primitive nativa por UI custom transfiere al equipo teclado, foco, validación, forms, eventos, accesibilidad y casos extremos.",
    example: "Para cambiar colores de un date input se conserva el input nativo y se estiliza su contenedor. Si el requisito exige un calendario custom, el equipo debe implementar parsing, min/max, navegación por teclado, locale, foco, reset y serialización del form, no solo el popover.",
    failureModes: [
      "La paridad visual puede ocultar que teclado, autofill, validación o submit ya no funcionan.",
      "Un wrapper presentado como pequeño puede terminar concentrando una política de estado que nadie documentó.",
      "Reimplementar la plataforma sin una necesidad de producto clara aumenta bugs y costo de mantenimiento.",
    ],
  },
  accessible_composites: {
    primer: "Un widget compuesto necesita un patrón completo, no una colección de atributos ARIA. El patrón define roles relacionados, nombre, estado, movimiento de foco, teclas soportadas y qué ocurre al abrir, elegir, cancelar y cerrar.",
    example: "En un combobox, el input conserva foco, aria-expanded indica si la lista está abierta, aria-controls apunta al listbox y aria-activedescendant identifica la opción activa. Flechas cambian la opción activa, Enter confirma y Escape cierra sin seleccionar.",
    failureModes: [
      "role=\"option\" sin listbox o aria-selected en un elemento incompatible comunica una estructura falsa.",
      "Mover foco y aria-activedescendant al mismo tiempo sin un modelo definido puede producir anuncios duplicados.",
      "Anidar botones o links interactivos crea órdenes de teclado y activaciones ambiguas.",
    ],
  },
  design_tokens: {
    primer: "Un token semántico nombra una decisión que debe mantenerse coherente entre componentes y temas. Una variable local, en cambio, coordina cálculos dentro de una implementación; un literal sigue siendo válido cuando no representa un eje de cambio.",
    example: "Button usa --control-bg-danger y --focus-ring-color porque el tema decide ambos valores. Dentro del componente, --icon-size puede coordinar ancho y separación. Un border de 1px local no necesita convertirse automáticamente en token global.",
    failureModes: [
      "Tokens nombrados por color físico, como blue-500, obligan al componente a conocer la paleta en vez de la intención.",
      "Convertir cada número en variable agrega indirección sin crear una decisión reutilizable.",
      "Cambiar un data-state documentado rompe estilos y pruebas visuales de consumidores aunque el componente compile.",
    ],
  },
  resilient_ui: {
    primer: "Una UI resiliente conserva jerarquía, operación y significado cuando cambia el contenido o el entorno: texto más largo, zoom, idioma RTL, viewport estrecho, preferencias de movimiento y temas desconocidos.",
    example: "Una card usa grid flexible, min-width: 0 y overflow-wrap para aceptar un título alemán largo. A 200% de zoom los controles pasan a otra línea sin quedar ocultos; en árabe usa padding-inline y el orden lógico se adapta a RTL.",
    failureModes: [
      "Alturas fijas cortan traducciones o dejan espacio vacío cuando cambia el tamaño de fuente.",
      "Elipsis puede ocultar el único dato que distingue dos opciones y requiere una alternativa accesible.",
      "Responsive probado solo por ancho no cubre zoom, copy real, teclado ni reduced motion.",
    ],
  },
  vendor_boundaries: {
    primer: "Una frontera de vendor decide qué dependencia conocen los consumidores. Un reexport conserva casi el contrato externo; una façade ofrece un subconjunto estable; un adapter traduce entre el modelo del proveedor y el dominio propio.",
    example: "PaymentsAdapter recibe Money y PaymentIntent propios y traduce a Stripe. En cambio, reexportar Row de TanStack Table declara que ese tipo forma parte de la API pública y que un upgrade incompatible puede exigir una major de la librería.",
    failureModes: [
      "Un wrapper que copia todas las opciones crea otra API sin reducir acoplamiento.",
      "Ocultar capacidades necesarias hace que consumidores salten la frontera con imports profundos.",
      "Duplicar lógica del vendor en varios adapters produce comportamiento distinto para el mismo caso.",
    ],
  },
  proof_strategy: {
    primer: "La evidencia se elige según el contrato que podría romperse. Tipos observan compilación; Testing Library observa semántica y eventos; un navegador real observa foco y layout; stories y visual regression observan estados y temas.",
    example: "Para un Select, un type test protege props, RTL prueba seleccionar y enviar FormData, Playwright recorre teclado y foco reales, y Storybook captura open, disabled, error y temas. Cada prueba cubre un riesgo diferente.",
    failureModes: [
      "Un snapshot grande puede aprobar mientras submit, ref o teclado están rotos.",
      "Repetir el mismo happy path en cuatro capas aumenta costo sin sumar señal.",
      "jsdom no reproduce con fidelidad layout, navegación de foco ni todas las APIs del browser.",
    ],
  },
  scope_reviewability: {
    primer: "Reviewability es la capacidad de entender qué problema resuelve un cambio, qué contratos toca y qué evidencia lo sostiene. Un review de alto valor separa bugs demostrables, preguntas de intención, sugerencias y preferencias.",
    example: "Un cambio de color reemplaza un input nativo por un popover. El review primero señala el nuevo ownership de teclado, forms y foco; compara con la primitive existente y pide pruebas de paridad. Un rename menor queda como sugerencia no bloqueante.",
    failureModes: [
      "Comentar cada detalle visual oculta el único riesgo que puede romper consumidores.",
      "Prescribir una solución antes de confirmar intención puede resolver otro problema distinto.",
      "Aceptar complejidad porque el diff es corto ignora nuevas políticas de lifecycle o estado escondidas.",
    ],
  },
  case_design_system_select: {
    primer: "Diseñar un Select público es un ejercicio de contratos coordinados. Primero se decide si el elemento nativo cubre la necesidad; si no, la API custom debe definir valor, eventos, identidad, forms, foco, teclado, accesibilidad, styling y evolución.",
    example: "Un Select buscable usa value/defaultValue con una sola fuente por modo, option.id como identidad, onValueChange con reason y un hidden input para FormData. El trigger controla un listbox con navegación completa; Apply no existe si cada selección confirma inmediatamente.",
    failureModes: [
      "Usar el label traducible como key o value cambia identidad cuando cambia el idioma.",
      "Cerrar el popover no debe emitir selección si el contrato distingue draft y commit.",
      "Exponer dos hooks o entry points que poseen el mismo estado crea autoridades rivales.",
    ],
  },
  event_loop_tasks: {
    primer: "El hilo principal ejecuta una task de JavaScript hasta que termina, vacía las microtasks pendientes y recién entonces puede atender otra task y encontrar una oportunidad para renderizar. Un callback largo bloquea input y paint aunque React esté bien diseñado.",
    example: "Parsear un archivo grande durante un click ocupa 180 ms: el spinner se agenda, pero el browser no puede pintarlo hasta que termina el parseo. Dividir trabajo, usar un Worker o moverlo al servidor devuelve oportunidades de respuesta.",
    failureModes: [
      "Una cadena que agrega nuevas Promises continuamente puede agotar microtasks e impedir el paint.",
      "setTimeout(0) agenda otra task; no garantiza ejecución inmediata ni una latencia exacta.",
      "Marcar una actualización como transición no reduce el costo de una función CPU-bound indivisible.",
    ],
  },
  browser_rendering_pipeline: {
    primer: "Después de ejecutar JavaScript, el browser resuelve estilos, calcula geometría en layout, dibuja en paint y combina capas en composición. La etapa costosa depende de qué propiedad cambió y de cuánto documento quedó invalidado.",
    example: "Animar left obliga a recalcular geometría y puede volver a pintar; animar transform suele permitir composición de una capa ya dibujada. DevTools Performance confirma si el cuello real fue scripting, layout, paint o una imagen pesada.",
    failureModes: [
      "Leer getBoundingClientRect después de varias escrituras de estilo puede forzar layout síncrono repetidas veces.",
      "Agregar will-change a todo reserva recursos y memoria sin garantizar una mejora.",
      "Reducir renders React no corrige un layout thrashing originado por código imperativo.",
    ],
  },
  memory_resource_lifecycle: {
    primer: "Un leak aparece cuando algo que ya no es útil sigue siendo alcanzable: listeners, observers, timers, sockets, caches o closures conservan referencias. La solución empieza nombrando quién adquiere el recurso y cuándo termina su vida.",
    example: "Una pantalla crea un ResizeObserver sobre su tabla. El Effect guarda la misma instancia y cleanup llama disconnect al desmontar. Un heap snapshot después de abrir y cerrar veinte veces confirma que las tablas anteriores ya no quedan retenidas.",
    failureModes: [
      "removeEventListener con una función distinta no elimina el listener original.",
      "Una cache global sin límite puede retener responses y nodos aunque cada componente haga cleanup.",
      "Mirar solo la RAM total confunde cache legítima, garbage collection diferido y una retención creciente.",
    ],
  },
  http_cache_network: {
    primer: "La entrega web tiene varias caches con políticas distintas. Assets con hash pueden ser inmutables; HTML suele revalidarse para descubrir el build actual; respuestas de API dependen de frescura, privacidad y validadores como ETag.",
    example: "app.a1b2.js se sirve un año con immutable porque otro contenido produciría otro nombre. index.html usa no-cache para poder recibir 304 o una versión nueva. Así nunca queda apuntando durante meses a chunks que el deploy ya retiró.",
    failureModes: [
      "no-cache permite almacenar y obliga a revalidar; no-store es la directiva que evita almacenamiento.",
      "Marcar index.html como immutable puede dejar clientes atrapados en un grafo de assets antiguo.",
      "La cache de TanStack Query mejora el estado de la app, pero no reemplaza CDN, cache HTTP ni validadores.",
    ],
  },
  realtime_offline: {
    primer: "Tiempo real necesita una semántica por encima del transporte: un snapshot inicial, eventos identificables, orden o versión, deduplicación, reconexión y una regla para reconciliar lo perdido durante la desconexión.",
    example: "El cliente carga orders con version 42 y luego aplica eventos 43 y 44 por WebSocket. Si reconecta recibiendo 47, pide un snapshot o los eventos faltantes antes de continuar; no asume que todo lo no recibido nunca ocurrió.",
    failureModes: [
      "Reconectar todos los clientes de inmediato después de una caída puede volver a tumbar el servicio.",
      "navigator.onLine solo describe conectividad de red y no demuestra que la API responda.",
      "Aceptar escrituras offline sin política de conflicto puede sobrescribir cambios de otro actor.",
    ],
  },
  frontend_observability: {
    primer: "Observabilidad conecta una falla con contexto suficiente para actuar: release, ruta, operación, timings, dependencia y un identificador de correlación. Debe responder qué usuarios fueron afectados y en qué parte del flujo, sin registrar secretos.",
    example: "checkout_submit registra duración y resultado junto al release y requestId. Un aumento del error payment_timeout en la versión nueva enlaza el evento frontend con el trace de Rails y permite separar proveedor lento de validación local.",
    failureModes: [
      "Subir source maps públicamente o registrar tokens y datos personales crea una exposición adicional.",
      "Un promedio global oculta que el percentil 95 falla solo en móviles lentos.",
      "Recolectar eventos sin owner, alertas ni preguntas operativas agrega costo sin capacidad de respuesta.",
    ],
  },
  ci_cd_release_strategy: {
    primer: "CI verifica y construye; CD promueve el mismo artefacto por ambientes y controla exposición. La cantidad de gates debe seguir el riesgo, el alcance del fallo y la capacidad de detectar y revertir.",
    example: "El pipeline instala con lockfile, ejecuta lint, tipos y tests, construye una imagen una vez y la prueba en preview. Producción recibe 5% del tráfico; métricas de error y conversión deciden continuar o volver al artefacto anterior.",
    failureModes: [
      "Reconstruir por ambiente puede desplegar bytes distintos de los que fueron probados.",
      "Un rollback de frontend no alcanza si el release ya escribió datos incompatibles.",
      "Una pipeline tan lenta que el equipo la evita reduce más seguridad que un conjunto pequeño de gates confiables.",
    ],
  },
  incident_debugging: {
    primer: "Durante un incidente, primero se reduce impacto y después se investiga con evidencia preservada. Cada hipótesis debe predecir una señal observable; cambiar una variable por vez permite saber qué explicación sobrevivió.",
    example: "Tras subir errores de checkout, el equipo pausa el rollout, compara release y tráfico, confirma que solo falla el nuevo bundle y revierte. Luego reproduce con el requestId, encuentra un contrato cambiado y agrega un contract test y un gate.",
    failureModes: [
      "Investigar la causa perfecta antes de mitigar prolonga daño evitable.",
      "Cambiar cache, API y frontend simultáneamente destruye la evidencia de cuál intervención funcionó.",
      "Un postmortem centrado en culpa no mejora detección, límites ni recuperación del sistema.",
    ],
  },
  product_metrics_experiments: {
    primer: "Una métrica de producto representa una conducta que ayuda a decidir, no solo un evento fácil de contar. Un experimento define hipótesis, población, métrica primaria, guardrails y qué acción tomaría el equipo según el resultado.",
    example: "Una nueva búsqueda intenta aumentar órdenes completadas. La métrica primaria es checkout por sesión con búsqueda; guardrails son latencia, errores y cancelaciones. El evento incluye versión del schema y variante para poder interpretar resultados.",
    failureModes: [
      "Más clicks pueden significar confusión y no progreso hacia el objetivo.",
      "Cambiar nombres o payloads de eventos sin versión rompe series históricas.",
      "Una mejora agregada puede ocultar daño en usuarios de teclado, regiones o dispositivos lentos.",
    ],
  },
  i18n_content_resilience: {
    primer: "Internacionalización separa mensajes del código y aplica reglas locales a pluralización, números, fechas y dirección. La UI debe tratar el contenido como variable y no como una longitud fija conocida por quien diseñó el componente.",
    example: "Un contador usa Intl.PluralRules o una librería de mensajes para distinguir cero, uno y varios; el precio usa moneda de la orden. El layout emplea margin-inline y soporta árabe RTL sin invertir manualmente cada componente.",
    failureModes: [
      "Concatenar fragmentos obliga a otros idiomas a conservar el orden gramatical del español.",
      "Locale del usuario no debe cambiar reglas de negocio como la moneda realmente cobrada.",
      "Traducir solo el texto visible y dejar aria-labels hardcodeados crea dos experiencias distintas.",
    ],
  },
  ux_performance_tradeoffs: {
    primer: "Un trade-off de UX compara beneficio, costo y riesgo para un flujo concreto. La respuesta senior identifica quién gana, quién puede quedar perjudicado, qué estado incierto se comunica y qué evidencia haría revisar la decisión.",
    example: "En Like se usa optimismo porque el efecto es reversible y de bajo riesgo; se marca pending y se revierte con mensaje. En un pago se muestra Procesando hasta confirmación autoritativa: declarar éxito antes puede inducir una decisión financiera falsa.",
    failureModes: [
      "Un skeleton sin dimensiones estables puede agregar layout shift y hacer la carga sentirse peor.",
      "Optimizar la media puede degradar el percentil lento o tecnologías asistivas.",
      "Defender una receta universal impide adaptar la solución a riesgo, dispositivo y recuperabilidad.",
    ],
  },
  technical_direction: {
    primer: "Dirección técnica convierte objetivos de producto en principios, límites y mecanismos que permiten decisiones consistentes sin centralizarlas todas en una persona. Debe aclarar qué es invariante y dónde el equipo puede elegir.",
    example: "El principio 'una fuente autoritativa por dato' se concreta con ejemplos, lint rules, templates y reviews. Cada feature decide su herramienta, pero debe mostrar ownership, estados de error y cómo se observa en producción.",
    failureModes: [
      "Una visión sin tooling, ejemplos ni responsables queda como documento aspiracional.",
      "Estandarizar cada detalle local transforma alineación en cuello de botella.",
      "No revisar principios cuando cambian datos o constraints convierte experiencia pasada en dogma.",
    ],
  },
  adr_rfc_decisions: {
    primer: "Un ADR registra una decisión y su contexto; un RFC abre una propuesta transversal a revisión antes de implementarla. La profundidad se calibra por reversibilidad, cantidad de afectados y costo de equivocarse.",
    example: "Cambiar el router compartido requiere RFC con alternativas, impacto de migración, rollout y owner. Elegir un helper local reversible puede resolverse en el pull request y, si importa a futuro, dejar un ADR breve.",
    failureModes: [
      "Documentar solo la solución elegida oculta por qué las alternativas no servían bajo esos constraints.",
      "Pedir un RFC extenso para decisiones locales reduce velocidad sin mejorar coordinación.",
      "El documento no reemplaza conversar con equipos que deberán migrar o operar el cambio.",
    ],
  },
  code_review_mentoring: {
    primer: "Un review protege al usuario y al contrato mientras ayuda a que el autor construya criterio. El comentario útil muestra evidencia, impacto y una petición proporcional; distingue un bug bloqueante de una preferencia.",
    example: "En vez de 'esto está mal', el reviewer dice: 'La ref ahora apunta al wrapper; dos consumidores llaman focus sobre el input. ¿Podemos conservar el attachment point y agregar un test de tipo y foco?'. El autor entiende el riesgo y puede proponer la solución.",
    failureModes: [
      "Reescribir todo el diff enseña dependencia del reviewer en vez de capacidad de decisión.",
      "Demasiados comentarios de estilo esconden problemas de contrato y producto.",
      "Usar preguntas vagas para bugs comprobados vuelve incierto qué debe cambiar antes de merge.",
    ],
  },
  planning_delegation: {
    primer: "Planificar define resultado, restricciones, riesgos y cortes que produzcan feedback. Delegar entrega ownership de una decisión con contexto y límites, no solo una lista de archivos que otra persona debe modificar.",
    example: "Para migrar auth, una persona posee el flujo refresh y su contrato; otra, limpieza de cache y UX. Hay un checkpoint cuando funciona un vertical slice con telemetría, y escalación explícita si cambia el contrato de Rails.",
    failureModes: [
      "Dividir por archivos crea dependencias horizontales y nadie posee el resultado completo.",
      "Checkpoints diarios sobre cada línea son micromanagement, no gestión de riesgo.",
      "Una estimación sin supuestos ni incertidumbre se interpreta como promesa aunque cambie el problema.",
    ],
  },
  conflict_stakeholders: {
    primer: "Resolver desacuerdos técnicos exige separar posiciones de intereses, alinear objetivo y constraints, comparar opciones con evidencia y aclarar quién decide. El cierre incluye qué se hará, por qué y cuándo se revisará.",
    example: "Producto quiere lanzar ya y plataforma teme una migración riesgosa. El lead propone un slice detrás de flag con límites de tráfico, métricas y rollback; documenta que producto decide exposición y plataforma conserva el gate de integridad.",
    failureModes: [
      "Ganar por autoridad puede perder información y compromiso de quienes operarán la decisión.",
      "Buscar consenso total indefinidamente oculta que alguien debe decidir con incertidumbre.",
      "Disagree and commit sin criterio de revisión convierte una decisión temporal en dogma.",
    ],
  },
};
