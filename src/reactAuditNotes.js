// Complementos autocontenidos para entrevistas: cada nota introduce los términos
// que la card usa y muestra un flujo real con estados de éxito y de fallo.
export const REACT_AUDIT_NOTES = {
  react_mental_model: {
    primer: "React es una librería que calcula una descripción de la interfaz a partir de props, state y contexto. Un render es ese cálculo; el commit es el momento en que React aplica al DOM solo los cambios necesarios.",
    example: "En un contador, el click agenda un nuevo state, React vuelve a ejecutar el componente y compara el resultado. Si solo cambió el número, no tiene que reconstruir toda la página. Si el componente hace una mutación durante render, React podría repetirla y producir efectos duplicados.",
    failureModes: ["Un render impuro puede duplicar una request o una suscripción.", "Si se copia el mismo dato en dos states, una actualización puede dejar una parte de la pantalla desactualizada."],
  },
  components_props: {
    primer: "Un componente es una función que recibe props, devuelve UI y puede componer otros componentes. Props son entradas de solo lectura; el state pertenece a quien debe decidir cómo cambia el dato.",
    example: "Una OrdersTable puede recibir rows y onSelectOrder. La tabla muestra y emite la intención; la pantalla padre decide si abre un modal, cambia la URL o pide más datos. Así la misma tabla sirve para una página y para un panel lateral.",
    failureModes: ["Una prop con demasiadas opciones crea un componente difícil de entender.", "Si el hijo mantiene una copia editable de una prop sin sincronización explícita, puede mostrar un valor viejo."],
  },
  jsx_rendering: {
    primer: "JSX es sintaxis de JavaScript que describe elementos; no es un template HTML que el navegador ejecuta directamente. Las expresiones entre llaves se evalúan durante el render.",
    example: "En `items.map(item => <Row key={item.id} />)`, map construye la descripción de cada fila y key le da identidad. React escapa un texto como `<script>` si se muestra como contenido, pero `dangerouslySetInnerHTML` salta esa protección y requiere sanitización.",
    failureModes: ["Una key basada en el índice puede mover el state interno a otra fila cuando se reordena la lista.", "Un HTML proveniente del usuario puede convertirse en XSS si se inyecta sin sanitizar."],
  },
  state_updates: {
    primer: "El state de React es un snapshot: dentro de un render y de su handler se observa el valor de ese render. El setter agenda otro render; no muta la variable local inmediatamente.",
    example: "Si un botón incrementa dos veces usando `setCount(count + 1)`, ambas expresiones pueden usar el mismo snapshot. `setCount(current => current + 1)` encadena correctamente las dos transiciones porque cada updater recibe el valor más reciente de la cola.",
    failureModes: ["Leer state inmediatamente después del setter puede hacer que una validación use el valor anterior.", "Mutar un objeto existente y volver a guardar la misma referencia puede impedir que la UI detecte el cambio."],
  },
  hooks_rules: {
    primer: "Un Hook es una API de React que permite usar state, efectos u otras capacidades desde un componente funcional. Las reglas de Hooks exigen llamarlos siempre en el mismo orden, en el nivel superior.",
    example: "`useState` no debe estar dentro de `if (enabled)`: cuando enabled cambia, React ya no podría saber qué state corresponde a cada llamada. La alternativa es llamar el Hook siempre y decidir dentro de su callback qué comportamiento ejecutar.",
    failureModes: ["Un Hook dentro de un loop o condición rompe la correspondencia entre llamadas y puede producir errores difíciles de rastrear.", "Un custom Hook no comparte automáticamente state entre consumidores: cada llamada crea su propia instancia."],
  },
  custom_hooks: {
    primer: "Un Custom Hook es una función cuyo nombre empieza con `use` y que compone Hooks existentes para reutilizar lógica, no para compartir una instancia de datos.",
    example: "`useOnlineStatus` puede suscribirse a los eventos online/offline, devolver `{ isOnline }` y limpiar listeners al desmontar. Dos componentes que lo llamen reciben el mismo hecho del navegador, pero cada uno administra su suscripción.",
    failureModes: ["Un custom Hook que mezcla fetching, navegación y UI termina teniendo demasiadas responsabilidades.", "Olvidar cleanup en una suscripción deja listeners duplicados después de montar y desmontar la pantalla."],
  },
  use_state_reducer: {
    primer: "`useState` es el Hook oficial para valores locales simples. `useReducer` es otro Hook oficial: recibe acciones y una función pura que calcula el siguiente state cuando hay varias transiciones relacionadas.",
    example: "Un editor puede tener `idle`, `saving`, `saved` y `error`. Con un reducer, `dispatch({ type: 'save_started' })` y `dispatch({ type: 'save_failed', message })` hacen explícito el flujo, mientras la llamada HTTP permanece fuera del reducer.",
    failureModes: ["Un reducer que llama una API deja de ser puro y hace difícil repetirlo o probarlo.", "Usar un reducer para un boolean aislado agrega ceremonia sin una frontera de decisión real."],
  },
  forms_controlled: {
    primer: "Un input controlado recibe su `value` desde React y notifica cambios con `onChange`; un input no controlado conserva el valor en el DOM y se lee con una ref o al enviar el form.",
    example: "Para un email, un form controlado puede mostrar el error debajo del campo mientras el usuario escribe. Para un formulario enorme, React Hook Form puede registrar inputs no controlados y validar en submit sin provocar un render por cada tecla.",
    failureModes: ["Un input que pasa de undefined a value se vuelve controlado a mitad de vida y genera warnings.", "Deshabilitar el botón no reemplaza la validación del backend ni evita un submit duplicado desde otro cliente."],
  },
  form_validation: {
    primer: "React Hook Form es una librería para registrar inputs y coordinar validación. Un schema es una descripción ejecutable de las reglas del payload, por ejemplo email requerido y password con longitud mínima.",
    example: "El schema puede rechazar un email mal formado antes de llamar a Rails. Después del submit, Rails puede devolver un conflicto de username; ese error no pertenece al schema local y debe mapearse al campo o al mensaje general.",
    failureModes: ["La validación del frontend mejora feedback pero nunca autoriza ni garantiza integridad en el backend.", "Un error de red no debe mostrarse como si el usuario hubiera escrito mal el formulario."],
  },
  lifting_state: {
    primer: "Lifting state significa mover un state al ancestro común más cercano cuando dos componentes necesitan coordinarse. Ese ancestro se convierte en la fuente de verdad.",
    example: "Si SearchInput cambia el término y ResultsList filtra resultados, OrdersPage guarda `query` y pasa `value` y `onChange` al input, mientras entrega el mismo query a la lista. Así no existen dos filtros que puedan divergir.",
    failureModes: ["Subir todo el state hasta App puede provocar props innecesarias y renders amplios.", "Copiar el mismo filtro en input, lista y URL crea conflictos sobre cuál valor gana."],
  },
  derived_state: {
    primer: "Estado derivado es un valor que se puede calcular a partir de props o state existentes, como `filteredItems`. No conviene guardarlo por separado porque introduce otra fuente de verdad.",
    example: "Si el state contiene todos los productos y el texto de búsqueda, `visibleProducts = products.filter(...)` se calcula durante render. Solo se usa `useMemo` si una medición demuestra que ese cálculo es costoso.",
    failureModes: ["Actualizar manualmente `filteredProducts` cuando cambia products y cuando cambia query puede olvidar una de las dos rutas.", "Normalizar datos no significa duplicarlos sin criterio: la referencia canónica debe estar clara."],
  },
  context: {
    primer: "Context permite que un valor atraviese un subárbol sin pasar props por cada nivel. Es útil para dependencias amplias como tema, locale o sesión; no es automáticamente un store global.",
    example: "Un ThemeProvider puede exponer el tema a Button y Modal. Cambiar el value del Provider puede volver a renderizar consumidores; para un carrito con muchas actualizaciones conviene evaluar un store o dividir contextos.",
    failureModes: ["Meter todo el state de la aplicación en un único Context amplía el blast radius de cada cambio.", "Context no reemplaza autorización: ocultar un botón no impide que alguien llame directamente a la API."],
  },
  refs_dom: {
    primer: "`useRef` es un Hook oficial que conserva un valor mutable entre renders sin provocar un render al cambiarlo. También permite obtener una referencia a un nodo del DOM.",
    example: "Después de abrir un diálogo, `dialogRef.current?.focus()` devuelve el foco al primer control. Para guardar un timer o el último request también sirve; para un valor que debe verse en pantalla, se necesita state.",
    failureModes: ["Leer `ref.current` durante render para decidir la UI suele romper el modelo declarativo.", "Una ref no reemplaza cleanup: un timer guardado allí sigue necesitando `clearTimeout` o `clearInterval`."],
  },
  effects: {
    primer: "`useEffect` es un Hook oficial para sincronizar React con un sistema externo después del commit: red, timer, listener, WebSocket o API imperativa. No es el lugar general para calcular datos derivados.",
    example: "Un componente de chat abre un WebSocket cuando cambia `roomId`, escucha mensajes y devuelve un cleanup que cierra la conexión anterior. Si el usuario hace click en guardar, la request normalmente pertenece al handler del click, no a un Effect que observa un booleano.",
    failureModes: ["Un Effect que actualiza state que él mismo usa como dependencia puede entrar en loop.", "Si no se limpia la conexión anterior, cambiar de room deja mensajes de varias salas mezclados."],
  },
  effect_dependencies: {
    primer: "Las dependencias de un Effect indican qué valores capturados deben hacer que React repita la sincronización. Una stale closure es una función que conserva un valor viejo porque no se volvió a crear cuando ese valor cambió.",
    example: "Un interval que imprime `count` dentro de un Effect con `[]` seguirá viendo el count inicial. Se puede incluir count como dependencia, usar un updater o guardar la última referencia cuando el caso lo justifica.",
    failureModes: ["Omitir una dependencia puede esconder un bug hasta que cambie el usuario o la ruta.", "Agregar una función nueva como dependencia sin estabilizarla puede reconectar el sistema en cada render."],
  },
  data_fetching: {
    primer: "Data fetching es pedir datos externos y representar al menos loading, éxito y error. Esos estados describen el ciclo de la request, no son detalles opcionales de la UI.",
    example: "Al abrir `/orders`, la pantalla muestra skeleton, luego la lista o un estado vacío. Si el backend responde 500, el usuario ve un error con reintento; si abandona la ruta, la request puede cancelarse para no actualizar un componente que ya no está visible.",
    failureModes: ["Un spinner permanente puede ocultar que la request falló.", "Mostrar la respuesta de una request vieja después de cambiar de filtro produce datos incorrectos aunque no haya una excepción."],
  },
  async_race: {
    primer: "Una race condition ocurre cuando dos trabajos terminan en un orden distinto al que fueron iniciados. AbortController permite cancelar una request fetch, aunque un diseño robusto también valida qué resultado sigue siendo vigente.",
    example: "El usuario escribe `re` y luego `react`. La request de `react` debería ganar aunque la de `re` termine después; se puede abortar la anterior y asociar cada respuesta con el query que la originó.",
    failureModes: ["Cancelar el fetch no detiene automáticamente un parseo o transformación que ya está en curso.", "Reintentar sin límite puede saturar la API y empeorar una caída; se necesita backoff y una condición de abandono."],
  },
  routing: {
    primer: "Un router relaciona la URL con una pantalla y sus parámetros. Un parámetro de ruta identifica un recurso, como `/orders/42`; un query parameter suele representar filtros o paginación, como `?status=pending`.",
    example: "Al compartir `/orders/42`, la app puede reconstruir directamente el detalle, mostrar loading y luego 404 si la orden no existe. Una ruta protegida puede redirigir la UI, pero Rails todavía debe verificar identidad y permisos.",
    failureModes: ["Un refresh en una ruta profunda puede devolver 404 si el servidor no redirige al entrypoint de la SPA.", "Ocultar una ruta no protege sus datos: un usuario puede llamar a la API manualmente."],
  },
  auth_frontend: {
    primer: "Autenticación verifica quién es el usuario; autorización verifica qué puede hacer. Un 401 significa credencial ausente o inválida; un 403 significa identidad válida sin permiso. El frontend coordina la sesión, pero el backend decide.",
    example: "Al cargar la app, `checking` evita redirigir antes de saber si existe sesión. Una request recibe 401, un coordinador hace un único refresh, reintenta una vez las requests pendientes y, si falla, limpia usuario y cache sensible.",
    failureModes: ["Un refresh que reintenta el propio endpoint de refresh puede crear un loop infinito.", "Guardar un refresh token largo en localStorage aumenta el impacto de un XSS; una cookie HttpOnly cambia el flujo y requiere protección CSRF adecuada."],
  },
  server_state: {
    primer: "Client state representa interacción local, como un modal abierto. Server state representa datos cuya autoridad está fuera del browser, como orders; necesita freshness, cache, refetch, invalidación y manejo de conflictos.",
    example: "El modal puede vivir en useState y desaparecer al cerrar la pantalla. Las órdenes no deberían copiarse a ese state: una cache de queries puede mostrar datos previos mientras obtiene una versión nueva y luego invalidarse después de guardar.",
    failureModes: ["Copiar server state a muchos componentes permite que cada copia quede desactualizada.", "Tratar un error de permisos como cache vacía puede mostrar una pantalla engañosa."],
  },
  react_query: {
    primer: "TanStack Query es una librería para gestionar server state. `useQuery` usa una `queryKey` estable para identificar la entrada de cache y una `queryFn` para obtenerla; una mutación debe actualizar o invalidar las entradas afectadas.",
    example: "Para un dashboard, `['orders', filters]` separa la cache por filtros. Al crear una orden, la mutación puede invalidar `['orders']`; mientras llega la respuesta, la UI debe distinguir datos previos, fetching en background y error de la mutación.",
    failureModes: ["Una queryKey incompleta puede mostrar resultados de filtros anteriores.", "Reintentar automáticamente una mutación de pago puede duplicar una operación si el backend no tiene idempotencia."],
  },
  optimistic_ui: {
    primer: "`useOptimistic` es un Hook oficial de React para mostrar una proyección temporal mientras una Action está pendiente. No reemplaza la fuente confirmada: cuando termina la Action, React vuelve al valor real que llega por props o state. TanStack Query ofrece otro patrón para optimismo sobre una cache compartida.",
    example: "En una lista de comentarios, al pulsar Like mostramos el contador incrementado y una marca `pending`. Si el backend confirma, la respuesta canónica reemplaza la predicción; si responde 409 porque otro cambio ganó, revertimos el contador, quitamos `pending` y mostramos Reintentar. En un Delete podemos ocultar la fila temporalmente, pero debemos ofrecer Undo porque la operación puede ser irreversible.",
    failureModes: ["Timeout no significa necesariamente que el servidor no haya guardado: reintentar requiere una idempotency key o una consulta de reconciliación.", "Dos clicks rápidos o dos pestañas pueden generar predicciones incompatibles; hay que deduplicar, ordenar o reconciliar por versión.", "No conviene optimismo cuando una predicción incorrecta tiene alto costo, como confirmar un pago."],
  },
  react_actions: {
    primer: "`useActionState` es un Hook oficial de React para conectar una función Action con el state resultado y un flag `isPending`. La función recibe el estado anterior y el payload, puede ser async y realizar efectos externos. `useOptimistic` es otro Hook oficial para la vista temporal durante esa Action; el dispatcher debe ejecutarse dentro de una Action o Transition.",
    example: "En un perfil, `dispatch({ name })` ejecuta `saveProfile(previousState, payload)`. Mientras espera mostramos el nombre optimista y deshabilitamos el submit; un error de validación vuelve como state conocido para pintar el campo, mientras un error inesperado puede llegar al Error Boundary. Si se hacen tres submits, `useActionState` los encola: si se necesita paralelismo o cancelación, hay que elegir otro diseño.",
    failureModes: ["Llamar el dispatcher fuera de una Action o Transition impide que React gestione correctamente el pending.", "Confundir un error de validación retornable con una excepción inesperada produce una UX o una recuperación incorrecta.", "Una Action no autoriza nada: el servidor debe validar sesión, permisos e idempotencia."],
  },
  render_reconciliation: {
    primer: "Reconciliation es la comparación que React hace entre el árbol anterior y el nuevo para decidir qué conservar. Commit es la aplicación de esas decisiones al DOM; render por sí solo no significa que todos los nodos hayan cambiado.",
    example: "Si una pantalla cambia el título de una fila, React puede conservar el input vecino y su foco. Si cambia la key del subárbol, React lo interpreta como otra identidad y desmonta el state anterior.",
    failureModes: ["Hacer trabajo pesado o efectos durante render perjudica la posibilidad de repetir o interrumpir el cálculo.", "Medir solo el tiempo total de la request puede ocultar que el cuello de botella está en commits grandes."],
  },
  transitions_concurrency: {
    primer: "`startTransition` y `useTransition` son APIs oficiales para marcar actualizaciones no urgentes. La escritura del usuario debe seguir siendo inmediata; un filtrado o navegación costosa puede ejecutarse como transición y exponer `isPending`.",
    example: "En un buscador, el state `inputValue` se actualiza urgente y el filtro de 20.000 filas se marca como transición. La transición mantiene la pantalla usable, pero no cancela requests ni arregla por sí sola una race condition de red.",
    failureModes: ["Marcar el input mismo como transición puede hacer que el cursor se sienta lento.", "Una transición no reemplaza debounce, AbortController, paginación o virtualización cuando el problema es red o volumen de datos."],
  },
  keys_lists: {
    primer: "Una key es la identidad que React usa para relacionar un elemento de una lista con el elemento del siguiente render. Debe representar la identidad del dominio y ser estable entre renders.",
    example: "Si una lista tiene A, B y C y se inserta X al principio, usar índices hace que el input que era de A parezca pertenecer a X. Con `key={item.id}`, React conserva cada fila con su registro correcto.",
    failureModes: ["Usar `Math.random()` como key fuerza desmontajes y pierde state en cada render.", "Cambiar una key deliberadamente puede ser útil para resetear un form, pero debe ser una decisión explícita."],
  },
  memoization: {
    primer: "`memo`, `useMemo` y `useCallback` son herramientas de memoización, no requisitos de corrección. Guardan un resultado, un valor o una identidad de función para evitar trabajo cuando las dependencias no cambiaron.",
    example: "Si Profiler muestra que una tabla costosa se renderiza porque su padre crea el mismo objeto de filtros en cada render, primero estabilizamos el contrato o movemos el state. Solo después evaluamos `memo` y medimos si la comparación cuesta menos que renderizar.",
    failureModes: ["Memoizar cada componente agrega comparaciones y complejidad sin beneficio medible.", "Un callback memoizado que captura state incorrecto puede conservar una stale closure."],
  },
  performance: {
    primer: "Performance real se diagnostica midiendo una interacción concreta: duración, commits, long tasks, requests y Web Vitals. La optimización es una respuesta a una causa, no una lista fija de Hooks.",
    example: "Si una tabla tarda por 10.000 DOM nodes, virtualizar reduce nodos visibles. Si tarda por una API lenta, la solución puede ser paginación o cache; `useMemo` no arregla una respuesta de red que llega tarde.",
    failureModes: ["Optimizar un benchmark artificial puede empeorar el código que más usa el usuario.", "Un promedio puede ocultar que el p95 en un celular lento es inaceptable."],
  },
  suspense_lazy: {
    primer: "`lazy` divide el JavaScript y carga un componente bajo demanda. `Suspense` muestra un fallback mientras algo suspendible no está listo; para un chunk que falla se necesita además un Error Boundary con una recuperación.",
    example: "Una ruta de Reports importa su pantalla solo cuando el usuario entra. Mostramos un skeleton que conserva el layout; si el chunk no descarga por una versión vieja del CDN, el boundary ofrece recargar y no deja toda la app en blanco.",
    failureModes: ["Un fallback genérico que cambia todo el layout produce layout shift.", "Confundir code Suspense con data fetching Suspense puede llevar a asumir que cualquier Promise lanzada desde un componente se recupera igual."],
  },
  error_boundaries: {
    primer: "Un Error Boundary captura errores durante render, lifecycle y componentes descendientes. No captura automáticamente errores de event handlers ni cualquier rechazo de fetch; esos flujos necesitan try/catch y estados explícitos.",
    example: "Un dashboard puede aislar el widget de recomendaciones: si falla, la tabla de órdenes sigue funcionando y el widget ofrece Reintentar. El logger recibe route, release y usuario anonimizado para diagnosticar.",
    failureModes: ["Un boundary demasiado alto convierte un fallo pequeño en una pantalla completa caída.", "Mostrar un fallback sin resetearlo al cambiar de route puede dejar el error pegado a una nueva pantalla."],
  },
  accessibility: {
    primer: "Accesibilidad es el contrato que permite usar la UI con teclado, lector de pantalla, zoom y distintas capacidades. No se logra agregando un atributo aislado: requiere semántica, foco, nombre y feedback.",
    example: "Una acción de guardar debe ser un `<button>` con nombre accesible y estado disabled/pending. Un error de formulario se asocia al input con `aria-describedby` y recibe foco cuando corresponde.",
    failureModes: ["Una div clickable puede verse como botón pero no tener teclado ni semántica.", "Un modal que no mueve el foco ni lo devuelve al trigger deja al usuario de teclado perdido."],
  },
  portals_dialogs: {
    primer: "Un Portal permite renderizar un subárbol en otro nodo del DOM sin romper el árbol lógico de React. Un dialog también necesita foco, cierre con Escape, nombre accesible y bloqueo o manejo del foco exterior.",
    example: "El modal se monta en `document.body` para escapar de un `overflow: hidden` del panel. Al abrir, enfoca el título o primer control; al cerrar, devuelve foco al botón que lo abrió.",
    failureModes: ["El portal visual no elimina la propagación de eventos del árbol React.", "Un modal sin cleanup puede dejar listeners de Escape o scroll lock activos después de cerrarse."],
  },
  security_frontend: {
    primer: "XSS es ejecutar JavaScript no confiable en el contexto de la app. CSRF fuerza a un navegador autenticado a enviar una acción que el usuario no pretendía. El frontend ayuda, pero la API debe validar input, identidad y permisos.",
    example: "Un comentario se renderiza como texto y no como HTML arbitrario. Si se usa una cookie de sesión, una mutación requiere una defensa CSRF; si se usa un access token en memoria y refresh HttpOnly, el flujo cambia pero sigue necesitando autorización en Rails.",
    failureModes: ["Una API key incluida en el bundle no es secreta.", "Ocultar el botón Delete no evita que un usuario llame `DELETE /orders/42` manualmente."],
  },
  ssr_hydration: {
    primer: "SSR genera HTML en el servidor para que el navegador pueda mostrar contenido antes de tener todo el JavaScript. Hidratación es el proceso en que React conecta eventos y confirma ese HTML; el primer render del cliente debe coincidir.",
    example: "Renderizar `new Date()` o leer localStorage durante el primer render puede producir markup distinto entre servidor y cliente. Se puede mostrar un placeholder estable y leer el dato en un Effect después de hidratar.",
    failureModes: ["Acceder a `window` durante el render server rompe porque no existe en Node.", "Silenciar todos los hydration warnings puede ocultar una diferencia visual o de contenido real."],
  },
  server_components: {
    primer: "Un Server Component se ejecuta en el servidor y puede acceder al data layer sin enviar ese código al browser. Un Client Component usa state, eventos y APIs del navegador; la frontera se marca según el framework, por ejemplo con `use client`.",
    example: "Una página de productos puede consultar el catálogo en servidor y pasar datos serializables a un selector interactivo cliente. El selector no recibe una conexión de base de datos ni una función arbitraria como prop.",
    failureModes: ["Importar una librería pesada desde la frontera cliente puede aumentar el bundle.", "Server Components no reemplazan autorización: el servidor debe validar la sesión en cada operación sensible."],
  },
  component_architecture: {
    primer: "Arquitectura de componentes decide qué componente posee datos, qué componente coordina el flujo y qué componente solo presenta UI. Page, feature y presentational no son nombres mágicos: son fronteras de responsabilidad.",
    example: "OrdersPage lee URL y cache; OrdersScreen recibe `rows`, `isLoading` y callbacks; EmptyState solo presenta el caso vacío. Si cambia TanStack Query, la pantalla visual no debería reescribirse.",
    failureModes: ["Un componente que hace fetch, decide permisos, transforma datos y pinta 300 líneas es difícil de probar y cambiar.", "Separar cada div en un componente también puede ocultar el flujo y aumentar indirecciones sin beneficio."],
  },
  component_api_patterns: {
    primer: "Una API de componente es el contrato de props, eventos, children, refs y estados controlado/no controlado que los consumidores pueden usar. Una buena API expone intención y oculta detalles internos.",
    example: "Dialog recibe `open` y `onOpenChange`, mientras el padre conserva la fuente de verdad. `children` permite componer título y acciones sin crear una prop booleana por cada variante.",
    failureModes: ["Exponer estados internos como props públicas dificulta cambiar la implementación.", "Un callback sin contrato de cuándo se dispara puede provocar submits dobles o cierres inesperados."],
  },
  state_management: {
    primer: "State management no es elegir una librería única: es decidir el dueño según el alcance. URL sirve para estado navegable, Context para dependencias amplias, store para coordinación compleja y query cache para datos remotos.",
    example: "Filtros compartibles viven en la URL; el draft de un input vive localmente; el tema vive en Context; el carrito complejo puede vivir en un store; orders permanecen en una cache de server state.",
    failureModes: ["Duplicar el mismo dato en URL, Context y store crea sincronizaciones frágiles.", "Un store global no vuelve frescos los datos del backend ni reemplaza invalidación."],
  },
  external_stores: {
    primer: "`useSyncExternalStore` es un Hook oficial de React para leer una fuente de datos que vive fuera de React, como online status, Redux o una librería de estado. Recibe subscribe, getSnapshot y opcionalmente getServerSnapshot.",
    example: "Un store de conectividad notifica cuando el browser pasa offline. React se suscribe, lee un snapshot estable y limpia la suscripción al desmontar; durante SSR usa un snapshot conocido para evitar una hidratación distinta.",
    failureModes: ["Devolver un objeto nuevo en cada getSnapshot puede producir renders infinitos.", "Un useEffect manual puede hacer que distintas partes lean versiones diferentes durante un render concurrente."],
  },
  typescript_react: {
    primer: "TypeScript verifica formas y relaciones durante el build, pero no valida JSON que llega de la red en runtime. Los tipos de props expresan el contrato de React; una validación runtime protege el borde de la API.",
    example: "`Order` puede tipar la tabla y sus callbacks, mientras un schema valida que el JSON realmente contiene `id`, `status` y `total`. Así evitamos que un backend cambiado rompa la UI lejos del lugar de entrada.",
    failureModes: ["Un `as Order` solo silencia al compilador y no transforma ni valida datos.", "Tipos demasiado genéricos como `any` trasladan el error al consumidor y pierden el contrato."],
  },
  case_dashboard: {
    primer: "Este es un ejercicio de diseño: primero definimos ownership de URL, cache y widgets; después modelamos loading, error, vacío y reintento por frontera. El dashboard no es una única request ni una única pantalla de éxito.",
    example: "URL guarda `status` y `page`; TanStack Query usa esos valores en queryKey; la tabla muestra datos anteriores mientras llega la nueva página; un widget de métricas puede fallar sin ocultar la tabla. Después de crear una orden se invalidan las queries afectadas.",
    failureModes: ["Una request global bloquea todo el dashboard aunque solo falle un widget.", "Sin paginación o virtualización, una respuesta grande puede congelar el render aunque la API responda rápido.", "Un filtro que no está en queryKey muestra resultados de otra selección."],
  },
  case_auth: {
    primer: "Este caso combina estado de sesión, router y cliente HTTP. La app necesita una fase `checking` antes de decidir la ruta, un refresh coordinado y una diferencia clara entre sesión inválida y permiso insuficiente.",
    example: "Cinco requests reciben 401 al mismo tiempo: solo una llama `/refresh`; las demás esperan el mismo Promise. Si refresh confirma, se reintentan una vez; si falla, se limpian usuario y cache y se redirige a login. Un 403 muestra una pantalla de permiso, no login.",
    failureModes: ["Cada request haciendo su propio refresh produce carreras y rotaciones conflictivas.", "Reintentar una respuesta 401 indefinidamente genera un loop de red y nunca devuelve al usuario a un estado de sesión recuperable.", "Cachear datos privados después de logout puede exponer información al siguiente usuario del dispositivo."],
  },
  case_checkout: {
    primer: "Checkout es un flujo distribuido: React maneja la experiencia, Rails valida y persiste, y un proveedor de pago puede requerir pasos externos. Por eso se modela con estados explícitos y no con un único `loading`.",
    example: "`editing` valida campos; `submitting` deduplica el botón; `requires_action` espera 3DS; `pending` cubre un timeout ambiguo; `success` y `failed` son resultados recuperables. La misma idempotency key permite reintentar sin crear dos órdenes.",
    failureModes: ["Vaciar el carrito antes de una confirmación durable puede perder la intención del usuario.", "Un timeout del proveedor no prueba que el pago falló: hay que consultar el estado.", "El frontend nunca debe tratar un precio o permiso calculado en browser como autoridad."],
  },
  frontend_system_design: {
    primer: "Frontend system design es diseñar el flujo completo de una feature: requisitos, ownership, contratos, estados, fallas, observabilidad y evolución. No es dibujar componentes aislados ni elegir una librería antes de entender el problema.",
    example: "Para Orders, la URL posee filtros, la query cache posee datos remotos, la pantalla compone loading/error/empty y Rails autoriza cada request. El diagrama también debe mostrar qué pasa si la API tarda, si un widget falla o si cambia el contrato.",
    failureModes: ["Un diagrama de cajas que solo muestra el happy path no explica recuperación ni ownership.", "Elegir Redux, SSR o microfrontends antes de conocer escala y restricciones agrega complejidad sin una decisión que proteger."],
  },
  module_boundaries_monorepo: {
    primer: "Una frontera de módulo define qué API es pública, qué imports están prohibidos y quién es responsable del cambio. Un monorepo organiza muchos paquetes, pero no crea modularidad por sí mismo.",
    example: "`features/orders` puede importar `shared/http` mediante un entry point público, pero no `features/billing/internal`. Un test o lint detecta ciclos antes de que dos equipos conviertan una dependencia temporal en contrato permanente.",
    failureModes: ["Un paquete `shared` sin owner se convierte en un cajón de utilidades que todos modifican.", "Separar paquetes sin aislar una decisión real agrega builds, versionado y coordinación."],
  },
  feature_flags_migrations: {
    primer: "Una migración gradual separa deploy de release: primero hacemos compatible el sistema, luego activamos el nuevo camino para una población controlada y finalmente retiramos el viejo.",
    example: "Un checkout nuevo puede activarse para empleados, observar conversión y errores, ampliar al 10% y volver al flujo anterior si falla. Si cambia el formato de datos, primero se agrega compatibilidad, después se migra y al final se elimina la ruta vieja.",
    failureModes: ["Un flag permanente duplica caminos y aumenta combinaciones de estados.", "Un rollback de UI no deshace una migración destructiva del backend.", "Sin métricas por variante no sabemos si el nuevo camino mejoró o solo recibió menos tráfico."],
  },
  js_basics: {
    primer: "Para leer React necesitás cuatro piezas de JavaScript: closures, módulos, Promises y referencias inmutables. Una closure conserva variables; una Promise representa trabajo futuro; una copia nueva permite detectar cambios por referencia.",
    example: "Un handler creado dentro del render forma una closure sobre props y state. Un `fetch` devuelve una Promise y `await` pausa esa función, no el navegador. `setItems([...items, item])` crea un array nuevo; `items.push(item)` muta la referencia existente.",
    failureModes: ["Una closure puede leer un snapshot viejo si se usa después en un timer o callback.", "Un `catch` ausente convierte un rechazo de Promise en un error no manejado.", "Mutar un objeto compartido puede hacer que React y otros consumidores no detecten el cambio."],
  },
  events_propagation: {
    primer: "Los eventos del navegador tienen una fase de captura y otra de burbujeo. React expone handlers como `onClick`; `stopPropagation` detiene el viaje del evento, mientras `preventDefault` evita la acción nativa como navegar un link.",
    example: "Una fila abre el detalle al hacer click, pero su botón Delete debe detener la propagación para no abrir también el detalle. El handler todavía debe pedir confirmación, manejar pending y tratar un error de la API.",
    failureModes: ["Confundir preventDefault con stopPropagation deja el evento viajando o bloquea una acción equivocada.", "Un botón dentro de un link puede producir navegación accidental y una mutación al mismo tiempo."],
  },
  react_compiler: {
    primer: "React Compiler es una herramienta de build que puede aplicar memoización automática en componentes compatibles. No cambia qué datos son correctos ni elimina la necesidad de render puro, keys estables o medición.",
    example: "Si una lista recibe props estables, el compiler puede evitar trabajo repetido sin que agreguemos `useMemo` manual. Si el componente muta un objeto durante render o usa una key incorrecta, la optimización no corrige el bug conceptual.",
    failureModes: ["Esperar que el compiler arregle una request duplicada confunde performance con efectos.", "Desactivar optimizaciones sin medir puede dejar código manual innecesario y difícil de mantener."],
  },
  styling_assets: {
    primer: "Styling define cómo se expresa la apariencia y qué contrato tienen tokens, clases, assets y estados visuales. CSS no reemplaza semántica ni comportamiento accesible.",
    example: "Un botón puede recibir un token de color para hover y disabled, mientras la semántica sigue siendo `<button>`. Un asset con hash en producción permite cache largo; el HTML debe referenciar la URL generada, no una ruta local.",
    failureModes: ["Un z-index alto no arregla un stacking context mal entendido.", "Un icono que comunica estado solo por color falla para usuarios con baja percepción cromática.", "Cachear para siempre un asset sin fingerprint puede servir una versión vieja."],
  },
  testing_rtl: {
    primer: "React Testing Library prueba la UI como la usa una persona: consulta roles y nombres accesibles, dispara interacciones y verifica resultados visibles. El objetivo es proteger comportamiento, no la estructura interna de componentes.",
    example: "Un test de login encuentra el botón por role, completa email y password, hace click y espera que aparezca el dashboard. Si mañana cambiamos divs por un componente distinto pero el flujo sigue igual, el test continúa siendo válido.",
    failureModes: ["Consultar clases internas puede hacer que un refactor visual rompa tests sin cambiar comportamiento.", "Un test async sin esperar la respuesta puede pasar o fallar según el timing."],
  },
  testing_async: {
    primer: "Probar async significa controlar el tiempo y las respuestas externas. MSW intercepta requests en el test como un servidor falso; el test verifica loading, éxito, error y recuperación sin depender de una API real.",
    example: "Un test devuelve 500 para `GET /orders`, verifica el mensaje y pulsa Reintentar; luego MSW devuelve 200 y se comprueba la tabla. La prueba demuestra el contrato observable y la transición de error a éxito.",
    failureModes: ["Mockear la función interna que hace fetch puede ocultar errores de integración del contrato HTTP.", "No limpiar handlers, timers o cache entre tests produce contaminación y flakiness."],
  },
  deployment_web: {
    primer: "Deploy frontend transforma el código en un artefacto que el navegador puede descargar. Observabilidad agrega evidencia de qué versión, ruta y dispositivo fallaron; no es solo subir archivos a un CDN.",
    example: "CI genera un build con assets fingerprinted, publica un preview, libera producción gradualmente y registra release en el error tracker. Si una versión rompe el checkout, un flag o rollback limita el impacto.",
    failureModes: ["Un source map público puede revelar código que no querías exponer.", "Rebuilds distintos por ambiente hacen imposible saber qué artefacto se probó.", "Un rollback de frontend puede ser incompatible con una API que ya cambió."],
  },
  threat_modeling_frontend: {
    primer: "Threat modeling enumera activos, fronteras de confianza, atacantes y mitigaciones. El browser está bajo control del usuario, por lo que el frontend nunca es una autoridad de seguridad.",
    example: "Para proteger una sesión dibujamos browser, CDN, API e Identity Provider; preguntamos dónde puede robarse o alterarse un token y elegimos HttpOnly, CSP, allowlists, expiración y autorización server-side.",
    failureModes: ["Ocultar un botón no evita una request manual.", "Un token en memoria reduce persistencia pero no evita XSS durante la sesión.", "Una checklist sin identificar activos puede gastar esfuerzo en riesgos irrelevantes."],
  },
  oauth_oidc_sessions: {
    primer: "OAuth delega autorización para acceder a una API; OpenID Connect agrega identidad. Authorization Code con PKCE vincula el código de login con el cliente que inició el flujo.",
    example: "React redirige al Identity Provider con `state` y `code_challenge`; vuelve con un code; un backend o BFF lo canjea con el verifier y entrega una sesión HttpOnly. El ID token describe autenticación; el access token es para una audiencia de API.",
    failureModes: ["Usar el ID token como access token mezcla audiencias y permisos.", "Un redirect URI demasiado abierto permite desviar códigos.", "Guardar refresh tokens largos en localStorage amplía el impacto de XSS."],
  },
  csp_supply_chain: {
    primer: "CSP limita qué scripts y recursos puede ejecutar una página. Supply-chain security reduce la confianza ciega en paquetes, lockfiles, builds y artefactos de terceros.",
    example: "Primero se despliega CSP en report-only para ver violaciones; después se restringen scripts propios y nonces. El pipeline fija dependencias, revisa cambios y mantiene source maps fuera del acceso público.",
    failureModes: ["`unsafe-inline` debilita la protección principal de CSP.", "Un lockfile evita variación accidental, pero no demuestra que un paquete sea confiable.", "Un scanner no reemplaza revisar el código y el provenance de una dependencia crítica."],
  },
  testing_strategy: {
    primer: "Una estrategia de testing asigna cada riesgo al test más barato que pueda observarlo con suficiente fidelidad: tipos, unit, RTL, contract, E2E o visual.",
    example: "Una función pura puede tener unit test; el comportamiento de un formulario RTL; el contrato con Rails contract test; y solo el checkout completo E2E. Cada capa cubre un riesgo distinto.",
    failureModes: ["Coverage de líneas puede subir mientras el flujo crítico sigue sin probarse.", "Duplicar el mismo caso en todas las capas aumenta mantenimiento sin aumentar señal.", "Un E2E flakey puede quitar confianza a toda la pipeline."],
  },
  contract_visual_e2e: {
    primer: "Contract tests verifican la forma y semántica del intercambio entre sistemas; visual tests comparan estados renderizados; E2E recorre un journey real en navegador.",
    example: "El contrato verifica que Rails devuelve `id` y `status`; un visual test revisa loading/error/long label del Button; un E2E confirma login, checkout y redirección final con el sistema desplegado.",
    failureModes: ["Un snapshot enorme puede cambiar sin que nadie entienda qué regresión protege.", "Un E2E que depende de datos compartidos falla por causas ajenas al código.", "El contrato debe versionarse junto con la compatibilidad del consumidor."],
  },
  test_reliability: {
    primer: "Flakiness es que el mismo test cambie de resultado sin cambiar código. Confiabilidad exige aislar datos, controlar tiempo, esperar señales reales y registrar evidencia del fallo.",
    example: "Un test de debounce usa fake timers y avanza el reloj explícitamente; un test de request espera el mensaje de éxito, no un sleep fijo. Cada test crea su usuario y limpia cache y handlers.",
    failureModes: ["Aumentar retries puede esconder un test defectuoso y alargar la pipeline.", "Sleep arbitrario es lento y sigue siendo susceptible a máquinas más lentas.", "Compartir estado global entre tests crea dependencia del orden."],
  },
};
