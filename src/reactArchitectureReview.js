const source = (label, href) => ({ label, href });

export const REACT_ARCHITECTURE_REVIEW = {
  routing: {
    explanation: "Una navegación web normal solicita otro documento al servidor. En una SPA ya cargada, el router puede usar la History API para cambiar la URL y elegir otro árbol de UI sin pedir un documento nuevo. El contrato sigue incluyendo al navegador y al servidor: Back/Forward deben reconstruir la pantalla, un deep link debe funcionar al abrirse desde cero y la URL debe conservar solo estado que tenga sentido compartir o recuperar.",
    why: "Routing no es esconder y mostrar componentes: coordina URL, historial, layouts, carga de datos, errores, pending UI y la respuesta del servidor al abrir una ruta directamente.",
    docNotes: [
      "pushState agrega una entrada al historial, replaceState reemplaza la actual y popstate informa navegaciones como Back/Forward. Cambiar la URL no renderiza React por sí solo; el router escucha y actualiza la aplicación.",
      "React Router actual ofrece modos declarativo, data y framework. Un ejemplo con <Routes> explica matching, pero loaders, actions, pending UI y errores pertenecen a sus APIs de datos o de framework.",
      "Un parámetro de ruta identifica una parte jerárquica de la URL; search params suelen expresar filtros o paginación. La distinción es semántica, no una regla de seguridad.",
    ],
    pitfalls: [
      "Configurar un fallback universal a index.html es correcto para una SPA cliente, pero no para cualquier arquitectura: SSR y routers con servidor pueden resolver la ruta antes de enviar HTML.",
      "pushState y replaceState no disparan automáticamente popstate en la misma llamada; la librería mantiene su propia notificación de navegación.",
      "Una guard de ruta mejora la experiencia, pero no autoriza datos: la API debe verificar identidad, permiso y ownership.",
    ],
    sources: [
      source("React Router: Routing", "https://reactrouter.com/start/data/routing"),
      source("React Router: Picking a mode", "https://reactrouter.com/start/modes"),
      source("History.pushState — MDN", "https://developer.mozilla.org/docs/Web/API/History/pushState"),
    ],
  },
  auth_frontend: {
    explanation: "React modela la experiencia de sesión: bootstrap, identidad conocida o anónima, renovación, logout y estados de permiso. La seguridad real vive en cada request que valida el backend. No existe un único esquema universal de tokens: una sesión con cookie HttpOnly y defensa CSRF puede ser excelente; access token corto en memoria más refresh cookie también puede serlo. La elección depende de dominios, amenazas, backend y necesidad de delegación.",
    why: "Una respuesta sólida separa UX de sesión, transporte de credenciales y autorización del servidor; además explica XSS, CSRF, expiración, rotación y requests concurrentes.",
    docNotes: [
      "HttpOnly impide que JavaScript lea la cookie, pero el navegador todavía puede enviarla en requests. SameSite, Secure, origen de la app y defensa CSRF forman parte del mismo diseño.",
      "Un access token en memoria reduce persistencia del secreto, pero obliga a diseñar el bootstrap y la renovación al recargar. No es automáticamente superior a una sesión de cookie.",
      "Ante varios 401 simultáneos, compartir una única promesa de refresh evita rotaciones paralelas. Cada request se reintenta como máximo una vez y el endpoint de refresh queda fuera del interceptor.",
    ],
    sources: [
      source("Session Management Cheat Sheet — OWASP", "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"),
      source("OAuth 2.0 for Browser-Based Apps — IETF", "https://datatracker.ietf.org/doc/html/rfc9700"),
      source("Set-Cookie — MDN", "https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie"),
    ],
  },
  server_state: {
    explanation: "La distinción útil no es 'local versus global' ni 'temporal versus persistente', sino quién tiene autoridad. React posee un draft de formulario; la URL posee filtros navegables; el servidor posee la versión canónica de una orden que otros procesos pueden cambiar. El navegador puede cachear esa observación, pero necesita decidir identidad, frescura, revalidación, invalidación y reconciliación.",
    docNotes: [
      "Client state también puede persistir en URL, sessionStorage o un store; server state también puede mostrarse inmediatamente desde cache. Persistencia y sincronía no definen la categoría.",
      "Copiar una query a useState solo se justifica si se crea otro concepto, como un draft editable. Esa copia ya no se mantiene sincronizada automáticamente con la fuente remota.",
      "Pending, stale, fetching y error describen momentos distintos. Una UI puede tener datos visibles y estar revalidando al mismo tiempo.",
    ],
    sources: [
      source("Managing State — React", "https://react.dev/learn/managing-state"),
      source("TanStack Query Overview", "https://tanstack.com/query/latest/docs/framework/react/overview"),
    ],
  },
  react_query: {
    explanation: "TanStack Query implementa una cache de server state y coordina observadores, requests, reintentos e invalidación. No conoce la semántica de tu negocio: vos definís qué identifica el dato en queryKey, cómo lo obtiene queryFn, cuándo es suficientemente fresco y qué mutaciones vuelven obsoletas qué entradas.",
    why: "La librería elimina boilerplate mecánico, pero deja visibles las decisiones difíciles: identidad, freshness, ownership de errores, paginación, mutaciones y consistencia.",
    docNotes: [
      "La queryKey debe incluir toda variable usada por queryFn que cambie el resultado. Dos componentes con la misma key observan la misma entrada.",
      "staleTime indica cuánto tiempo el dato se considera fresco; gcTime indica cuánto conserva la cache una query sin observadores. No son equivalentes.",
      "isPending describe que todavía no hay datos exitosos; isFetching describe que queryFn está ejecutándose, incluso si existen datos previos visibles.",
      "Invalidar marca queries como stale y puede refetchear observadores activos. Para una respuesta inmediata también se puede escribir en cache con el dato canónico devuelto por la mutación.",
    ],
    pitfalls: [
      "Una queryKey con un objeto es válida si su contenido serializable representa la identidad; el problema no es que el objeto sea una referencia nueva, sino omitir o incluir datos que no corresponden.",
      "Retries por defecto pueden ser razonables para lecturas, pero una mutación con efectos debe tener semántica idempotente antes de reintentarse.",
      "No uses invalidación global por reflejo: puede generar tráfico y estados pending que no guardan relación con la mutación.",
    ],
    sources: [
      source("Query Keys — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"),
      source("Important Defaults — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults"),
      source("Query Invalidation — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation"),
    ],
  },
  optimistic_ui: {
    explanation: "Optimismo significa renderizar una proyección antes de recibir la confirmación canónica. Hay mecanismos distintos. useOptimistic deriva una vista temporal mientras una Action está en curso y vuelve a partir del valor base cuando termina. TanStack Query puede actualizar una cache compartida: normalmente cancela refetches que podrían sobrescribir la predicción, guarda contexto para restaurar y luego invalida o reconcilia.",
    why: "La pregunta no es solo cómo hacer la UI rápida, sino cuándo una predicción es segura, cómo se representa pending y cómo se resuelven rechazo, timeout, concurrencia y respuesta canónica.",
    docNotes: [
      "useOptimistic es un Hook oficial de React. Su updateFn debe ser pura y recibe el estado actual más el valor optimista.",
      "Con useOptimistic no siempre escribís un rollback manual: al finalizar la Action, la proyección deja de aplicarse y la UI vuelve al valor base que la aplicación entregue.",
      "En una cache compartida, un snapshot manual es una estrategia posible, no una regla universal. También se puede refetchear o reconciliar con la respuesta del servidor.",
      "Un timeout es resultado desconocido, no rechazo confirmado. Para reintentar una operación con efectos necesitás idempotencia o consultar su estado.",
    ],
    steps: [
      "Definí cuál es el valor confirmado y cuál será solo una proyección visible mientras la operación está pendiente.",
      "Elegí el mecanismo según el ownership: useOptimistic para una vista asociada a una Action; la mutation cache para datos remotos compartidos.",
      "Mostrá qué entidad está pending y evitá que interacciones incompatibles se acumulen sin una política.",
      "Ante éxito, reconciliá con la respuesta canónica; ante rechazo, restaurá o dejá que desaparezca la proyección y explicá cómo recuperar.",
      "Ante timeout o concurrencia, tratá el resultado como ambiguo y usá idempotencia, versión o refetch para resolverlo.",
    ],
    sources: [
      source("useOptimistic — React", "https://react.dev/reference/react/useOptimistic"),
      source("Optimistic Updates — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates"),
    ],
  },
  react_actions: {
    explanation: "En React, Action es una convención para una función que realiza trabajo async dentro de una transición. <form action={fn}> integra FormData y pending; useActionState conserva el último resultado de la Action y expone isPending; useFormStatus lee el estado del formulario descendiente; useOptimistic agrega una proyección temporal. Ninguna de estas APIs decide validación, autorización o persistencia del servidor.",
    docNotes: [
      "useActionState devuelve [state, dispatchAction, isPending]. La Action recibe primero el estado anterior y después los argumentos del dispatch o el FormData del formulario.",
      "Cuando una función se pasa a action en un <form>, React puede resetear campos no controlados después del éxito. Los campos controlados siguen dependiendo de tu state.",
      "useFormStatus debe ejecutarse desde un componente descendiente del form; no observa el form declarado por el mismo componente que llama al Hook.",
      "startTransition marca actualizaciones como no urgentes, pero una actualización de input controlado no debe depender de una transición.",
    ],
    sources: [
      source("Actions — React 19", "https://react.dev/blog/2024/12/05/react-19#actions"),
      source("useActionState — React", "https://react.dev/reference/react/useActionState"),
      source("form — React DOM", "https://react.dev/reference/react-dom/components/form"),
      source("useFormStatus — React DOM", "https://react.dev/reference/react-dom/hooks/useFormStatus"),
    ],
  },
  component_architecture: {
    explanation: "La arquitectura de componentes asigna ownership. Una page o route conoce URL y datos; un componente de feature coordina un caso de uso; componentes de UI reciben contratos enfocados; custom Hooks encapsulan sincronización o lógica reutilizable. Son roles, no carpetas obligatorias. Una frontera gana su costo cuando permite comprender, probar o reemplazar una decisión de forma local.",
    docNotes: [
      "La documentación de React parte de descomponer la UI y encontrar la fuente mínima de state. No prescribe categorías universales como smart/dumb.",
      "Un custom Hook comparte lógica, no state: cada llamada conserva su propia instancia salvo que ambas se conecten a una fuente externa compartida.",
      "Separar acceso a datos de presentación puede mejorar pruebas, pero un wrapper que solo reenvía props y no protege una decisión agrega indirección.",
    ],
    sources: [
      source("Thinking in React", "https://react.dev/learn/thinking-in-react"),
      source("Reusing Logic with Custom Hooks", "https://react.dev/learn/reusing-logic-with-custom-hooks"),
    ],
  },
  component_api_patterns: {
    explanation: "La API de un componente es todo lo observable por consumidores: props, children, ref, DOM, eventos, estados controlado/no controlado, semántica, estilos y timing. Diseñarla consiste en exponer intención estable sin ocultar capacidades necesarias del elemento nativo ni filtrar detalles internos que después no puedan cambiarse.",
    docNotes: [
      "children y slots por composición suelen escalar mejor que una prop booleana por cada variante, pero la estructura debe seguir siendo comprensible y accesible.",
      "En React 19, los function components pueden recibir ref como prop. forwardRef sigue apareciendo en código existente y debe entenderse para mantenimiento.",
      "cloneElement y Children existen, pero la documentación los considera APIs poco comunes y potencialmente frágiles; render props, Context o custom Hooks suelen expresar mejor la relación.",
    ],
    sources: [
      source("Passing Props to a Component — React", "https://react.dev/learn/passing-props-to-a-component"),
      source("Passing data deeply with Context — React", "https://react.dev/learn/passing-data-deeply-with-context"),
      source("cloneElement — React", "https://react.dev/reference/react/cloneElement"),
    ],
  },
  state_management: {
    explanation: "Elegir state management es asignar una fuente de verdad según semántica y alcance. State local posee interacción aislada; el ancestro común coordina hijos; URL posee navegación compartible; Context distribuye una dependencia; useSyncExternalStore integra una fuente externa; una query cache observa datos remotos. Una librería no elimina la necesidad de decidir ownership.",
    docNotes: [
      "Prop drilling no es automáticamente un problema: hace dependencias explícitas. Context conviene cuando muchos descendientes necesitan la misma dependencia y la composición no alcanza.",
      "Cambiar el value de un Context actualiza a los consumidores que lo leen. Separar providers por responsabilidad y frecuencia puede reducir trabajo y acoplamiento.",
      "No dupliques una misma autoridad en URL, Context y store. Si necesitás un draft, nombralo como concepto distinto y definí cuándo se confirma o resetea.",
    ],
    sources: [
      source("Managing State — React", "https://react.dev/learn/managing-state"),
      source("Passing Data Deeply with Context — React", "https://react.dev/learn/passing-data-deeply-with-context"),
    ],
  },
  external_stores: {
    explanation: "useSyncExternalStore es el puente oficial para una fuente cuyo ciclo de vida no pertenece a React. subscribe notifica que algo podría haber cambiado; getSnapshot devuelve la versión que React comparará con Object.is; getServerSnapshot entrega una observación coherente para SSR e hidratación. El store todavía debe garantizar snapshots inmutables y suscripciones correctas.",
    docNotes: [
      "getSnapshot debe devolver exactamente el mismo valor mientras el store no cambió. Si construye un objeto nuevo siempre, React no puede estabilizar la lectura.",
      "subscribe debe devolver unsubscribe. Si la función subscribe cambia en cada render, React vuelve a suscribirse; normalmente se declara fuera del componente.",
      "getServerSnapshot es necesario si el componente se renderiza en servidor. Su valor inicial del cliente debe coincidir con el HTML hidratado.",
    ],
    sources: [source("useSyncExternalStore — React", "https://react.dev/reference/react/useSyncExternalStore")],
  },
  typescript_react: {
    explanation: "TypeScript hace explícitas relaciones de compilación: props, callbacks, refs y estados posibles. Una unión discriminada puede impedir combinaciones inválidas en el código. Como los tipos se eliminan al generar JavaScript, una respuesta HTTP, localStorage o mensaje externo sigue necesitando validación runtime antes de convertirse en dato confiable.",
    docNotes: [
      "Usá los tipos de React y ComponentProps cuando querés conservar el contrato de un elemento nativo; omití o redefine solo las props cuya semántica realmente cambia.",
      "Un cast as T no valida ni transforma el valor. Es una afirmación al compilador y debe reservarse para información que el runtime ya garantizó por otro medio.",
      "Una unión discriminada expresa estados mutuamente excluyentes; no garantiza por sí sola que la máquina de transiciones sea correcta.",
    ],
    sources: [
      source("Using TypeScript — React", "https://react.dev/learn/typescript"),
      source("Narrowing — TypeScript", "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions"),
    ],
  },
  case_dashboard: {
    explanation: "Primero asigná ownership: la URL conserva filtros compartibles; cada queryKey identifica una observación remota; cada widget decide su pending, empty, error y retry; una mutación invalida o actualiza solo los datos afectados. Después elegí si coordinar requests, usar Suspense, mantener datos previos, paginar o virtualizar según la experiencia y el volumen.",
    docNotes: [
      "Un Error Boundary de React no captura automáticamente el rechazo de cualquier fetch. La librería o el router debe convertir ese error en render, o la query debe mostrar su estado de error explícito.",
      "Suspense coordina fallbacks de trabajo suspendible; no reemplaza empty, stale, background fetching ni errores de una mutación.",
      "Virtualización reduce nodos DOM; paginación reduce transferencia y trabajo del servidor. Pueden combinarse, pero resuelven costos diferentes.",
    ],
    sources: [
      source("Suspense — React", "https://react.dev/reference/react/Suspense"),
      source("Paginated Queries — TanStack Query", "https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries"),
    ],
  },
  case_auth: {
    explanation: "El flujo comienza en checking porque todavía no sabemos si existe sesión. La ruta puede posponer su decisión o mostrar un shell estable. Las requests comparten un coordinador de refresh para evitar carreras; un éxito renueva y reintenta una vez, un fallo limpia identidad y cache sensible, y un 403 conserva la sesión pero presenta falta de permiso.",
    docNotes: [
      "Guardas de UI y loaders pueden evitar renderizar una pantalla privada, pero el servidor vuelve a autorizar cada recurso.",
      "La ruta de retorno después de login debe validarse para evitar open redirects a dominios controlados por un atacante.",
      "Logout local debe limpiar caches con datos de usuario; logout global o revocación depende de que el backend conserve una sesión o refresh token revocable.",
    ],
    sources: [
      source("Unvalidated Redirects Cheat Sheet — OWASP", "https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html"),
      source("React Router: Sessions and Cookies", "https://reactrouter.com/explanation/sessions-and-cookies"),
    ],
  },
  case_checkout: {
    explanation: "Checkout es una coordinación entre una máquina de estados de UI y una operación distribuida. editing conserva el draft; submitting representa una intención enviada una sola vez; requires_action delega un paso al proveedor; pending cubre un resultado todavía desconocido; success y failed solo se muestran cuando el backend tiene un estado durable. La idempotency key identifica el mismo intento a través de reintentos.",
    docNotes: [
      "Deshabilitar el botón reduce dobles clicks, pero no reemplaza idempotencia: el navegador, un proxy o el usuario pueden repetir la request.",
      "Un timeout no demuestra si el pago ocurrió. Conservá el identificador del intento y consultá o recibí la reconciliación del backend.",
      "Optimistic UI es apropiada para cambios de bajo riesgo; no conviene presentar un pago como confirmado antes de tener autoridad durable.",
    ],
    sources: [
      source("Idempotency — Stripe Docs", "https://docs.stripe.com/api/idempotent_requests"),
      source("useActionState — React", "https://react.dev/reference/react/useActionState"),
    ],
  },
  frontend_system_design: {
    explanation: "Frontend system design convierte una necesidad ambigua en un modelo verificable: usuarios y restricciones, fuentes de verdad, estados observables, límites entre browser y servicios, fallas parciales, seguridad, performance, evidencia y evolución. El diagrama debe mostrar el flujo y la autoridad de cada decisión, no solo nombres de componentes.",
    docNotes: [
      "Separá requisitos funcionales de atributos de calidad. 'Filtrar órdenes' no responde todavía latencia, volumen, permisos, offline ni accesibilidad.",
      "Por cada flecha del diagrama preguntá qué datos viajan, quién puede rechazarlos, cómo se observa pending y qué ocurre si la respuesta llega tarde o duplicada.",
      "Terminá con evidencia: métricas, tests, rollout y rollback. Una arquitectura que no puede verificarse es solo una hipótesis.",
    ],
  },
  module_boundaries_monorepo: {
    explanation: "Una frontera de módulo controla dirección de imports, API pública y ownership del cambio. Una carpeta mejora navegación; un package puede agregar entry points, versionado y build; un monorepo coordina varios proyectos. Ninguna de esas formas produce desacoplamiento si los consumidores importan internals o comparten state y contratos sin una dirección deliberada.",
    docNotes: [
      "Exponé entry points públicos y evitá deep imports que hagan observable la estructura interna.",
      "Detectá ciclos porque vuelven ambiguo qué capa puede cambiar a cuál. El objetivo no es un DAG perfecto, sino que las excepciones sean visibles y justificadas.",
      "Extraer shared demasiado pronto puede acoplar dominios distintos a una abstracción basada solo en similitud visual.",
    ],
  },
  feature_flags_migrations: {
    explanation: "Una migración segura separa compatibilidad, activación y limpieza. Expand agrega el nuevo contrato sin romper consumidores; migrate mueve tráfico o datos con telemetría; contract elimina el camino anterior cuando ya no existe dependencia. Un feature flag controla exposición, pero también crea combinaciones de estado que deben probarse y retirarse.",
    docNotes: [
      "Deploy y release son decisiones distintas: el código puede estar desplegado pero inactivo mientras se valida con empleados, porcentaje o cohortes.",
      "Definí antes del rollout qué métricas habilitan avanzar y qué señales ordenan rollback.",
      "La migración no termina al llegar al 100%. Falta borrar flag, compatibilidad, métricas temporales y documentación vieja.",
    ],
  },
};
