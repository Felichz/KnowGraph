import EN_DEEP_DIVES from "./i18n/content/en/deepDives.js";

const source = (label, href) => ({ label, href });

export const REACT_DEEP_DIVES = {
  render_vs_commit: {
    title: "¿Por qué React separa render y commit?",
    aliases: ["render y commit", "render, reconciliation y commit", "después del commit", "durante render"],
    nodeIds: ["react_mental_model", "render_reconciliation", "effects", "effect_dependencies", "performance"],
    answer: "Durante render, React calcula qué debería mostrar la interfaz. Esa fase debe ser pura porque puede repetirse, pausarse o descartarse. En commit aplica al DOM el resultado elegido. Separarlas permite preparar trabajo sin producir efectos visibles antes de saber que ese trabajo será usado.",
    example: "Si un render se interrumpe por una actualización más urgente, una llamada a una API hecha durante render ya habría escapado al control de React. En cambio, un Effect se ejecuta después de que el resultado fue confirmado en el commit.",
    nuance: "Un re-render no implica que todo el DOM cambie. Puede ejecutarse el componente y, luego de reconciliar, no haber ninguna mutación DOM para una parte del árbol.",
    sources: [
      source("Render and Commit — React", "https://react.dev/learn/render-and-commit"),
      source("Components and Hooks must be pure — React", "https://react.dev/reference/rules/components-and-hooks-must-be-pure"),
    ],
  },
  state_snapshot: {
    title: "¿Por qué state es un snapshot?",
    aliases: ["state es un snapshot", "snapshot del render", "snapshot anterior", "valor viejo"],
    nodeIds: ["state_updates", "effect_dependencies", "optimistic_ui", "react_actions"],
    answer: "Cada render recibe una fotografía fija de props y state. Los handlers creados por ese render cierran sobre esa fotografía. Un setter solicita otro render; no modifica retroactivamente las variables que ya está usando el handler actual.",
    example: "Tres llamadas a setNumber(number + 1) desde el mismo handler leen el mismo number. Tres updaters setNumber(n => n + 1) forman una cola y cada uno recibe el resultado del anterior.",
    nuance: "Esto no significa que la actualización sea lenta. Significa que React conserva una semántica estable para el código que ya se está ejecutando y aplica el nuevo valor en otro render.",
    sources: [
      source("State as a Snapshot — React", "https://react.dev/learn/state-as-a-snapshot"),
      source("Queueing a Series of State Updates — React", "https://react.dev/learn/queueing-a-series-of-state-updates"),
    ],
  },
  identity_and_keys: {
    title: "¿Por qué una key controla la identidad?",
    aliases: ["key estable", "keys estables", "identidad estable", "identidad del dominio", "estado preservado", "resetear un subárbol"],
    nodeIds: ["keys_lists", "render_reconciliation", "useid_identity", "controlled_uncontrolled_api"],
    answer: "React asocia state con una posición del árbol: tipo de componente, posición y key. Una key le dice que una entidad sigue siendo la misma aunque cambie de lugar. Si cambia, React trata el subárbol como otra identidad y reinicia su state.",
    example: "Al insertar una fila al principio, key={item.id} conserva el input editado con su registro. key={index} puede trasladar ese state visual a otra fila.",
    nuance: "useId no genera keys de listas. Las keys deben venir de los datos porque representan identidad del dominio; useId sirve para relaciones de accesibilidad dentro de una instancia.",
    sources: [
      source("Preserving and Resetting State — React", "https://react.dev/learn/preserving-and-resetting-state"),
      source("Rendering Lists — React", "https://react.dev/learn/rendering-lists"),
    ],
  },
  effects_are_sync: {
    title: "¿Por qué un Effect es sincronización y no un lifecycle genérico?",
    aliases: ["sincronización externa", "sistema externo", "sistemas externos", "probablemente no necesitás un Effect", "no necesitás un Effect"],
    nodeIds: ["effects", "effect_dependencies", "data_fetching", "effect_timing_strict_mode"],
    answer: "Un Effect declara cómo mantener un sistema externo alineado con el estado confirmado de React: una conexión, listener, timer, widget imperativo o request. Si solo calculás un valor para renderizar o respondés a un click, no existe un sistema externo que sincronizar.",
    example: "Conectar un chat depende de roomId y requiere disconnect en cleanup. Calcular filteredItems a partir de items y query ocurre durante render; enviar un formulario ocurre en el handler o Action que representa esa intención.",
    nuance: "El lifecycle útil es el de la sincronización: iniciar con unas dependencias, detener esa versión y volver a iniciar cuando cambian. No coincide necesariamente con la historia mental de mount/update/unmount del componente.",
    sources: [
      source("Synchronizing with Effects — React", "https://react.dev/learn/synchronizing-with-effects"),
      source("You Might Not Need an Effect — React", "https://react.dev/learn/you-might-not-need-an-effect"),
      source("Lifecycle of Reactive Effects — React", "https://react.dev/learn/lifecycle-of-reactive-effects"),
    ],
  },
  strict_mode_probe: {
    title: "¿Por qué Strict Mode ejecuta trabajo extra?",
    aliases: ["Strict Mode", "doble render", "doble ejecución", "setup+cleanup"],
    nodeIds: ["effect_timing_strict_mode", "effects", "effect_dependencies", "refs_dom"],
    answer: "En desarrollo, Strict Mode repite funciones que deberían ser puras y hace un ciclo extra de setup y cleanup. Es una sonda: intenta volver visibles mutaciones durante render y recursos que no se limpian correctamente.",
    example: "Si un Effect abre una conexión pero su cleanup no la cierra, el ciclo adicional deja dos conexiones y revela el bug antes de producción.",
    nuance: "No es un comportamiento de producción ni una razón para desactivar el modo. El objetivo es que repetir render o setup-cleanup no cambie la corrección.",
    sources: [source("StrictMode — React", "https://react.dev/reference/react/StrictMode")],
  },
  controlled_source_of_truth: {
    title: "¿Por qué importa quién controla el valor?",
    aliases: ["fuente de verdad", "controlado y no controlado", "controlados y no controlados", "modo controlado"],
    nodeIds: ["forms_controlled", "lifting_state", "component_api_patterns", "controlled_uncontrolled_api", "draft_commit_state"],
    answer: "Controlado significa que el padre entrega el valor actual y decide cada cambio; no controlado significa que el componente o el DOM conserva el valor inicial y su evolución. La diferencia define ownership, no calidad.",
    example: "Un Dialog controlado recibe open y onOpenChange para que una ruta o flujo coordine su visibilidad. Un input no controlado puede dejar el texto en el DOM y entregarlo al submit mediante FormData.",
    nuance: "Un componente no debería alternar de controlado a no controlado durante su vida. También debe quedar claro si un callback informa una intención o confirma que el valor ya cambió.",
    sources: [
      source("Sharing State Between Components — React", "https://react.dev/learn/sharing-state-between-components"),
      source("input — React DOM", "https://react.dev/reference/react-dom/components/input"),
    ],
  },
  server_state_authority: {
    title: "¿Por qué server state no es simplemente state global?",
    aliases: ["server state", "fuente de verdad reside", "freshness", "invalidación", "dato fresco"],
    nodeIds: ["server_state", "react_query", "state_management", "case_dashboard"],
    answer: "La diferencia central es la autoridad. El navegador posee un draft o un modal; el servidor posee órdenes compartidas y puede cambiarlas sin que este cliente participe. Una cache local solo conserva una observación temporal de esos datos.",
    example: "Dos usuarios editan la misma orden. Aunque Redux conserve una copia perfecta, no sabe que el otro usuario la cambió. Se necesita una política de frescura, revalidación, invalidación o eventos en tiempo real.",
    nuance: "Client state puede persistir en URL o storage, y server state puede estar disponible sin red gracias a cache. Persistencia y sincronía no definen por sí solas la categoría.",
    sources: [
      source("TanStack Query Overview", "https://tanstack.com/query/latest/docs/framework/react/overview"),
      source("Managing State — React", "https://react.dev/learn/managing-state"),
    ],
  },
  query_identity: {
    title: "¿Por qué queryKey es parte del modelo de datos?",
    aliases: ["queryKey", "clave de identidad", "entrada de cache", "cache por filtros"],
    nodeIds: ["react_query", "case_dashboard", "server_state"],
    answer: "La queryKey declara qué variables hacen que dos resultados sean datos distintos. La cache usa esa identidad para compartir, refrescar e invalidar la observación correcta.",
    example: "['orders', { status, page }] separa páginas y filtros. Si page no está en la key, la página 2 puede reutilizar el resultado de la página 1.",
    nuance: "Una key correcta no decide cuánto tiempo es fresco el dato ni qué mutaciones lo afectan. Identidad, staleTime e invalidación son decisiones separadas.",
    sources: [source("Query Keys — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys")],
  },
  optimistic_prediction: {
    title: "¿Por qué la UI optimista es una predicción?",
    aliases: ["actualización optimista", "UI optimista", "useOptimistic", "rollback"],
    nodeIds: ["optimistic_ui", "react_actions", "react_query", "case_checkout"],
    answer: "La interfaz muestra un resultado que todavía no es autoridad. Por eso debe distinguir pending, reconciliar con la respuesta canónica y explicar o revertir un rechazo.",
    example: "Para un like se puede incrementar temporalmente el contador. Si el servidor devuelve el contador real, ese valor reemplaza la proyección; si rechaza, se restaura el estado confirmado y se ofrece reintentar.",
    nuance: "useOptimistic vuelve a derivar la vista desde el valor base cuando termina la Action. TanStack Query suele pedir cancelar/refetch, guardar un snapshot y restaurarlo en onError. Son mecanismos distintos.",
    sources: [
      source("useOptimistic — React", "https://react.dev/reference/react/useOptimistic"),
      source("Optimistic Updates — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates"),
    ],
  },
  transition_priority: {
    title: "¿Por qué una transición no es un debounce?",
    aliases: ["transición", "useTransition", "startTransition", "useDeferredValue", "UI responsiva"],
    nodeIds: ["transitions_concurrency", "react_actions", "performance", "react_resources_activity"],
    answer: "Una transición marca una actualización de render como no urgente para que una interacción urgente pueda interrumpirla. No reduce necesariamente la cantidad de eventos ni retrasa una request por tiempo.",
    example: "El input actualiza su texto de inmediato y la lista costosa se recalcula en una transición. Un debounce, en cambio, espera un intervalo antes de iniciar una búsqueda; AbortController puede cancelar la request vieja.",
    nuance: "useDeferredValue difiere el valor consumido por una parte del árbol; useTransition te permite marcar el setter o Action que inicia la actualización y observar isPending.",
    sources: [
      source("useTransition — React", "https://react.dev/reference/react/useTransition"),
      source("useDeferredValue — React", "https://react.dev/reference/react/useDeferredValue"),
    ],
  },
  browser_history_contract: {
    title: "¿Por qué una SPA todavía necesita al servidor para sus URLs?",
    aliases: ["History API", "pushState", "popstate", "deep links", "ruta profunda", "fallback"],
    nodeIds: ["routing", "routing_data_apis", "case_auth", "case_dashboard"],
    answer: "pushState cambia la entrada del historial sin pedir otro documento. Pero si el usuario abre esa URL desde cero, la petición sí llega al servidor. El hosting debe devolver el entry point adecuado o resolver la ruta en el servidor.",
    example: "Navegar internamente a /orders/42 funciona con el router. Al refrescar, Nginx recibe GET /orders/42; en una SPA puramente cliente normalmente debe servir index.html para que el router interprete la URL.",
    nuance: "En SSR o en un data router con servidor, la ruta puede tener un handler real y no usar un fallback universal. La configuración depende del modo de rendering.",
    sources: [
      source("History: pushState — MDN", "https://developer.mozilla.org/docs/Web/API/History/pushState"),
      source("React Router — Routing", "https://reactrouter.com/start/data/routing"),
    ],
  },
  authn_vs_authz: {
    title: "¿Por qué ocultar una ruta no autoriza?",
    aliases: ["autenticación y autorización", "identidad y permisos", "401", "403", "ruta protegida"],
    nodeIds: ["auth_frontend", "case_auth", "routing", "security_frontend", "oauth_oidc_sessions"],
    answer: "El router solo controla qué UI presenta este cliente. La API recibe requests que pueden venir de DevTools, curl u otro programa, por lo que debe volver a comprobar identidad, permiso y ownership del recurso.",
    example: "No mostrar el botón Delete mejora la UX, pero DELETE /orders/42 debe verificar en Rails que el usuario autenticado pueda borrar esa orden.",
    nuance: "401 indica que falta una credencial aceptable; 403 indica que la identidad fue entendida pero no tiene permiso. Algunas APIs deliberadamente devuelven 404 para no revelar la existencia de un recurso.",
    sources: [
      source("HTTP 401 — MDN", "https://developer.mozilla.org/docs/Web/HTTP/Status/401"),
      source("HTTP 403 — MDN", "https://developer.mozilla.org/docs/Web/HTTP/Status/403"),
    ],
  },
  token_storage_tradeoff: {
    title: "¿Por qué no existe un único storage correcto para auth?",
    aliases: ["Access Token en memoria", "Refresh Token", "cookie HttpOnly", "localStorage", "SameSite"],
    nodeIds: ["auth_frontend", "case_auth", "security_frontend", "oauth_oidc_sessions"],
    answer: "Cada diseño mueve el riesgo. Una cookie HttpOnly evita que JavaScript lea el secreto, pero el navegador la adjunta automáticamente y exige analizar CSRF. Un token accesible a JavaScript permite Authorization explícito, pero un XSS puede robarlo.",
    example: "Una app same-site puede usar una sesión HttpOnly con SameSite y token CSRF. Otra arquitectura puede usar access token corto en memoria y refresh cookie. La elección depende de dominios, backend, amenazas y experiencia de renovación.",
    nuance: "HttpOnly mitiga robo directo, no todas las consecuencias de XSS: un script malicioso todavía puede ejecutar acciones mientras la sesión esté activa. El backend siempre autoriza cada operación.",
    sources: [
      source("Set-Cookie — MDN", "https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie"),
      source("Session Management Cheat Sheet — OWASP", "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"),
    ],
  },
  runtime_validation: {
    title: "¿Por qué TypeScript no valida una respuesta HTTP?",
    aliases: ["validación en runtime", "no valida JSON", "as Order", "schema"],
    nodeIds: ["typescript_react", "library_type_design", "data_fetching"],
    answer: "Los tipos se eliminan al generar JavaScript. El servidor puede responder una forma distinta y el navegador no ejecuta la interfaz TypeScript. Un parser o schema inspecciona el valor real en la frontera.",
    example: "const body: Order = await response.json() confía sin comprobar. OrderSchema.parse(await response.json()) produce un Order validado o un error localizado.",
    nuance: "No hace falta validar de nuevo cada objeto interno si ya existe una frontera confiable. La profundidad de validación debe seguir el riesgo y el contrato del sistema.",
    sources: [
      source("TypeScript for React — React", "https://react.dev/learn/typescript"),
      source("TypeScript Handbook: Erased Types", "https://www.typescriptlang.org/docs/handbook/2/basic-types.html#erased-types"),
    ],
  },
  native_semantics: {
    title: "¿Por qué un elemento nativo carga tanto comportamiento?",
    aliases: ["semántica nativa", "elemento nativo", "paridad nativa", "HTML semántico"],
    nodeIds: ["accessibility", "native_component_contract", "behavior_ownership", "accessible_composites", "case_design_system_select"],
    answer: "Un button, input o select ya participa en teclado, foco, formularios, accesibilidad y APIs del navegador. Reemplazarlo por divs transfiere esas obligaciones a tu código.",
    example: "Un button responde a Enter y Space, puede estar disabled, recibe foco y expone role y nombre. Una div con onClick solo cubre el puntero hasta que implementás el resto.",
    nuance: "ARIA describe semántica; no implementa comportamiento. Un widget custom puede ser correcto, pero debe seguir un patrón completo y justificar el ownership adicional.",
    sources: [
      source("Accessibility attributes — React DOM", "https://react.dev/reference/react-dom/components/common#accessibility"),
      source("ARIA Authoring Practices Guide", "https://www.w3.org/WAI/ARIA/apg/"),
    ],
  },
  error_boundary_scope: {
    title: "¿Por qué los Error Boundaries no capturan todo?",
    aliases: ["Error Boundary", "Error Boundaries", "frontera de error"],
    nodeIds: ["error_boundaries", "suspense_lazy", "case_dashboard", "routing_data_apis"],
    answer: "Un Error Boundary protege el render de un subárbol y ciertos ciclos de React. Un error que ocurre en un event handler o en trabajo async ya está fuera de ese render y necesita manejo en el flujo que lo inició.",
    example: "Si un widget lanza durante render, el boundary puede reemplazarlo. Si submit() rechaza dentro de onClick, el handler o la herramienta de mutations debe convertirlo en estado de error o propagarlo mediante una integración diseñada para ello.",
    nuance: "Frameworks y routers pueden conectar loaders, Actions y errores a boundaries propios. Eso es una capacidad de esa integración, no una ampliación automática de un class Error Boundary común.",
    sources: [
      source("Component: catching rendering errors — React", "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"),
      source("Error Boundaries — React Router", "https://reactrouter.com/how-to/error-boundary"),
    ],
  },
  cache_freshness: {
    title: "¿Por qué cacheado no significa fresco?",
    aliases: ["staleTime", "gcTime", "revalidación", "dato obsoleto", "datos previos"],
    nodeIds: ["react_query", "server_state", "case_dashboard", "http_cache_network"],
    answer: "La cache responde qué valor conocido tenemos; la política de frescura responde durante cuánto tiempo confiamos en él sin volver a consultar. Mantener un valor en memoria y considerarlo fresco son decisiones independientes.",
    example: "Una orden puede permanecer 30 minutos en cache inactiva, pero considerarse stale inmediatamente. Al volver a la pantalla se muestra el dato conocido mientras se revalida.",
    nuance: "staleTime pertenece a la cache de queries. Cache-Control pertenece al protocolo HTTP. Pueden combinarse, pero operan en capas y con claves distintas.",
    sources: [
      source("Important Defaults — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults"),
      source("HTTP caching — MDN", "https://developer.mozilla.org/docs/Web/HTTP/Caching"),
    ],
  },
  ownership_boundary: {
    title: "¿Por qué ownership es una decisión de arquitectura?",
    aliases: ["ownership", "fuentes de verdad", "fuente de verdad", "frontera coherente", "frontera de módulo"],
    nodeIds: ["component_architecture", "component_api_patterns", "state_management", "frontend_system_design", "module_boundaries_monorepo", "case_checkout"],
    answer: "Ownership nombra quién puede confirmar un valor o una transición. Hace posible decidir dónde validar, quién notifica cambios y qué copia puede quedar obsoleta. Sin dueño, dos capas intentan corregirse mutuamente y aparecen estados imposibles.",
    example: "La URL posee filtros compartibles, la query cache observa órdenes del servidor y un input posee su draft. Copiar los tres a un store global no crea una autoridad: crea tres versiones que sincronizar.",
    nuance: "El dueño no siempre es un componente. Puede ser el browser, una route, un store externo, una cache o el backend. La frontera correcta sigue la semántica del dato.",
    sources: [
      source("Choosing the State Structure — React", "https://react.dev/learn/choosing-the-state-structure"),
      source("Sharing State Between Components — React", "https://react.dev/learn/sharing-state-between-components"),
    ],
  },
  observable_component_contract: {
    title: "¿Por qué el contrato es mayor que las props?",
    aliases: ["todo lo observable", "API de un componente", "contrato enfocado", "contratos enfocados"],
    nodeIds: ["component_api_patterns", "component_architecture", "public_component_contract", "native_component_contract"],
    answer: "Un consumidor también depende del DOM, ref, nombres accesibles, timing de callbacks, comportamiento de forms, foco y selectores de styling. Aunque TypeScript no cambie, modificar cualquiera de esas superficies puede romper una aplicación.",
    example: "Cambiar un Button de button a div conserva props como onClick, pero pierde submit, disabled, teclado y ref a HTMLButtonElement. La firma parece estable y el contrato real cambió.",
    nuance: "No todo detalle interno es público. La tarea de diseño es decidir qué observaciones se prometen y mantener libertad para reemplazar lo demás.",
    sources: [
      source("Passing Props to a Component — React", "https://react.dev/learn/passing-props-to-a-component"),
      source("Common components — WAI-ARIA APG", "https://www.w3.org/WAI/ARIA/apg/patterns/"),
    ],
  },
  external_snapshot_protocol: {
    title: "¿Por qué useSyncExternalStore exige un snapshot estable?",
    aliases: ["getSnapshot", "snapshots inmutables", "subscribe/getSnapshot", "fuente externa compartida"],
    nodeIds: ["external_stores", "responsive_browser_subscriptions", "state_management"],
    answer: "React necesita leer la fuente varias veces y saber si sigue viendo la misma versión. subscribe solo avisa que podría haber un cambio; getSnapshot entrega la observación comparable. Si crea un objeto nuevo sin cambio real, React no puede estabilizar el render.",
    example: "Un store mutable conserva internamente un objeto. Cuando cambia, construye y cachea un snapshot inmutable nuevo; mientras no cambia, getSnapshot devuelve exactamente esa referencia.",
    nuance: "useSyncExternalStore no vuelve correcto al store. El protocolo todavía necesita unsubscribe, snapshots coherentes y un getServerSnapshot compatible con hidratación.",
    sources: [source("useSyncExternalStore — React", "https://react.dev/reference/react/useSyncExternalStore")],
  },
  idempotency_unknown_outcome: {
    title: "¿Por qué timeout no significa fallo?",
    aliases: ["idempotency key", "idempotencia", "resultado desconocido", "resultado ambiguo"],
    nodeIds: ["case_checkout", "optimistic_ui", "auth_frontend", "case_auth"],
    answer: "La respuesta puede perderse después de que el servidor o proveedor confirmó el efecto. El cliente solo sabe que no recibió confirmación. Repetir con otra identidad puede duplicar; repetir con la misma clave permite recuperar el mismo resultado o consultar el estado.",
    example: "POST /payments llega al proveedor, cobra y la red cae antes del 200. El retry conserva checkout_123; el servidor devuelve el pago ya asociado en vez de crear otro.",
    nuance: "Idempotencia debe implementarse en la frontera que posee el efecto. Deshabilitar un botón o guardar una clave solo en React no protege contra retries de red o procesos paralelos.",
    sources: [source("Idempotent requests — Stripe", "https://docs.stripe.com/api/idempotent_requests")],
  },
  migration_compatibility: {
    title: "¿Por qué una migración necesita compatibilidad intermedia?",
    aliases: ["expand", "contract", "feature flag", "entry points públicos", "deep imports"],
    nodeIds: ["feature_flags_migrations", "module_boundaries_monorepo", "api_evolution"],
    answer: "Productores y consumidores no cambian siempre en el mismo deploy. Expand agrega una forma compatible, migrate mueve uso o datos y contract elimina lo viejo solo cuando ya no tiene consumidores. Así cada estado intermedio sigue funcionando.",
    example: "Primero una API acepta oldName y newName; luego los clientes migran y la telemetría confirma que oldName no se usa; al final se elimina y se publica el cambio breaking correspondiente.",
    nuance: "Un flag controla exposición, no compatibilidad de datos por sí solo. Si ambos caminos escriben formatos diferentes, el rollback visual puede no recuperar lo ya persistido.",
    sources: [source("Parallel Change", "https://martinfowler.com/bliki/ParallelChange.html")],
  },
  reuse_pattern_tradeoff: {
    title: "¿Por qué un custom Hook no comparte state?",
    aliases: ["custom Hook", "HOC", "render props", "composición explícita"],
    nodeIds: ["react_patterns_history", "component_architecture", "custom_hooks"],
    answer: "Un custom Hook es una función que compone llamadas a Hooks. Cada componente que lo llama obtiene su propio state de React. Solo comparten datos si el Hook los conecta deliberadamente a Context, un store, cache u otra fuente externa.",
    example: "Dos componentes llaman useOnlineStatus y cada uno crea una suscripción, salvo que el Hook use un store compartido. Extraer useForm no hace que dos formularios compartan su draft.",
    nuance: "HOC y render props pueden compartir una instancia mediante el wrapper que renderizan. La elección trata de ownership y API, no de que un patrón sea siempre moderno o siempre obsoleto.",
    sources: [source("Reusing Logic with Custom Hooks — React", "https://react.dev/learn/reusing-logic-with-custom-hooks")],
  },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const DEEP_DIVE_OVERLAYS = { en: EN_DEEP_DIVES };
const localizedDeepDives = new Map();

function mergeDeepDive(dive, overlay) {
  if (!overlay) return dive;
  return {
    ...dive,
    title: overlay.title ?? dive.title,
    aliases: overlay.aliases ?? dive.aliases,
    answer: overlay.answer ?? dive.answer,
    example: overlay.example ?? dive.example,
    nuance: overlay.nuance ?? dive.nuance,
    sources: dive.sources.map((item, index) => ({ ...item, label: overlay.sources?.[index]?.label ?? item.label })),
  };
}

/**
 * Deep dives for a UI locale. Spanish returns REACT_DEEP_DIVES itself; other
 * locales merge their text overlay onto the Spanish dive, which keeps nodeIds
 * and source hrefs as the single source of truth.
 */
export function getDeepDives(locale = "es") {
  const overlays = DEEP_DIVE_OVERLAYS[locale];
  if (!overlays) return REACT_DEEP_DIVES;
  if (!localizedDeepDives.has(locale)) {
    localizedDeepDives.set(locale, Object.fromEntries(
      Object.entries(REACT_DEEP_DIVES).map(([id, dive]) => [id, mergeDeepDive(dive, overlays[id])]),
    ));
  }
  return localizedDeepDives.get(locale);
}

export function findDeepDiveMatches(text, nodeId, limit = 3, locale = "es") {
  if (!text || typeof text !== "string") return [];

  const candidates = Object.entries(getDeepDives(locale))
    .filter(([, dive]) => !dive.nodeIds || dive.nodeIds.includes(nodeId))
    .flatMap(([id, dive]) => dive.aliases.map((alias) => ({ id, alias })))
    .sort((a, b) => b.alias.length - a.alias.length);

  const matches = [];
  const occupied = [];
  const used = new Set();

  for (const candidate of candidates) {
    if (matches.length >= limit || used.has(candidate.id)) continue;
    const expression = new RegExp(escapeRegex(candidate.alias), "iu");
    const result = expression.exec(text);
    if (!result) continue;

    const start = result.index;
    const end = start + result[0].length;
    if (occupied.some(([from, to]) => start < to && end > from)) continue;

    matches.push({ id: candidate.id, start, end, text: result[0] });
    occupied.push([start, end]);
    used.add(candidate.id);
  }

  return matches.sort((a, b) => a.start - b.start);
}
