// Modulo de correcciones conceptuales y explicaciones continuas en lenguaje natural
// para las lecciones de Arquitectura Web y temas Senior en React Graph.

export const REACT_CONCEPTUAL_CORRECTIONS = {
  routing: {
    summary: "Un router en una SPA relaciona la URL del navegador con un árbol de componentes sin recargar el documento HTML completo.",
    why: "Permite construir navegación fluida, URLs compartibles con filtros, deep links, layouts protegidos y carga diferida por ruta.",
    explanation: "El routing en una Single Page Application (SPA) cambia fundamentalmente la forma en que el cliente interactúa con la web. En una aplicación tradicional, cada clic en un enlace dispara una petición HTTP al servidor, el cual responde con un documento HTML nuevo completas. En React, el navegador intercepta la navegación utilizando la API de Historial de HTML5 (a través de métodos como pushState y eventos popstate). Esto permite actualizar la URL de la barra de direcciones de forma totalmente síncrona en el cliente y renderizar la vista correspondiente sin parpadear ni volver a descargar los activos JS y CSS de la aplicación.",
    steps: [
      "El usuario navega a una URL o interactúa con un enlace dentro de la aplicación.",
      "El router del cliente intercepta la navegación mediante la HTML5 History API sin realizar una petición de página completa al backend.",
      "Se comparan la ruta navegada y los parámetros dinámicos con el árbol de componentes declarados en las rutas.",
      "React renderiza el nuevo subárbol de componentes correspondiente a la ruta y actualiza el historial navegable del navegador.",
      "Los parámetros de búsqueda (query params) y de ruta se exponen como fuente de verdad para sincronizar la interfaz."
    ],
    pitfalls: [
      "Al hacer F5 o ingresar directamente a una ruta profunda como /orders/42, el servidor web (Nginx/CDN) devolverá 404 a menos que esté configurado con un fallback que redirija todas las peticiones a index.html.",
      "Ocultar una ruta o una sección en el cliente no constituye autorización de seguridad: el backend debe validar cada endpoint de datos de manera independiente.",
      "Copiar los query params de la URL a un useState local dentro de la pantalla provoca bugs de desincronización al navegar usando los botones de avance o retroceso del navegador."
    ],
    takeaway: "La URL es el estado navegable primario de la SPA; el router sincroniza ese estado con la UI manteniendo la compatibilidad con el navegador.",
    tableTitle: "TIPOS DE DATOS EN LA URL",
    tableLabel: "Elegir el lugar adecuado según la intención",
    table: {
      columns: ["Tipo de Dato", "Ejemplo", "Propósito en la Arquitectura"],
      rows: [
        ["Parámetro de Ruta", "/orders/:id (/orders/42)", "Identifica de forma unívoca un recurso o entidad del dominio."],
        ["Query Parameter", "?status=paid&page=2", "Expresa preferencias de UI compartibles: filtros, búsquedas y paginación."],
        ["Hash", "#section-comments", "Navegación interna dentro del mismo documento o posición de desplazaiento."]
      ]
    },
    mermaid: `flowchart LR
      A[Navegación / Clic] --> B[Router intercepta]
      B --> C[pushState / popstate]
      C --> D[Matching de Ruta y Params]
      D --> E[Render de Componente / Layout]
      E --> F[UI Actualizada]`,
    diagramTitle: "Ciclo de navegación cliente en SPA"
  },

  auth_frontend: {
    summary: "El cliente React coordina el ciclo de vida de la sesión (login, tokens y reintentos), mientras la API conserva la autoridad de identidad y permisos.",
    why: "Es la base para proteger recursos de usuario, evitar parpadeos visuales en el bootstrap y manejar la expiración de credenciales sin interrumpir la experiencia.",
    explanation: "La autenticación en frontend no se limita a guardar un token y mostrar un formulario de login. Consiste en administrar una máquina de estados de sesión segura y tolerante a fallas. Al abrir la aplicación, React necesita determinar si existe una sesión válida antes de decidir qué pantalla mostrar. Durante esta fase inicial (session bootstrap), la UI debe permanecer en un estado de verificación transitorio; de lo contrario, la aplicación sufrirá un parpadeo visual donde redirige al usuario a la pantalla de login durante unos milisegundos antes de confirmar que sí estaba autenticado.",
    steps: [
      "Al iniciar la app, React entra en estado 'checking' mientras valida la sesión existente contra la API o la memoria.",
      "El login solicita credenciales por HTTPS; al autenticarse, guarda el Access Token en memoria y recibe el Refresh Token en una cookie HttpOnly.",
      "Cada petición HTTP a la API adjunta el Access Token en la cabecera Authorization (Bearer Token).",
      "Si la API responde 401 Unauthorized, un interceptor captura el fallo, pausa las peticiones salientes y solicita un nuevo token al endpoint de refresh.",
      "Al confirmar el nuevo token, el cliente reintenta las peticiones fallidas de forma transparente para el usuario."
    ],
    pitfalls: [
      "Almacenar Access Tokens o Refresh Tokens de larga duración en localStorage expone la sesión a robo directo en caso de una vulnerabilidad de XSS.",
      "Disparar peticiones de refresh en paralelo cuando 5 llamadas simultáneas devuelven 401 puede provocar carreras de tokens o bucles infinitos si el endpoint de refresh también falla.",
      "Tratar un error 403 Forbidden (falta de permisos para un recurso) como si fuera un 401 (falta de sesión), cerrando la sesión del usuario por accidente."
    ],
    takeaway: "React gestiona la experiencia y el flujo de la sesión; la API valida e impone la autoridad sobre cada petición.",
    tableTitle: "ESTRATEGIA DE TOKENS",
    tableLabel: "Dónde almacenar las credenciales de sesión",
    table: {
      columns: ["Tipo de Token", "Almacenamiento Recomendado", "Mitigación de Riesgo"],
      rows: [
        ["Access Token", "Memoria JS (State / Closure)", "Desechable y de corta vida (ej. 15 min); reduce el impacto de XSS."],
        ["Refresh Token", "Cookie HttpOnly + Secure + SameSite", "Inaccesible para JavaScript en el navegador; previene lecturas por XSS."]
      ]
    },
    mermaid: `flowchart TD
      A[Petición API] --> B{Status?}
      B -->|200 OK| C[Retornar Datos]
      B -->|401 Unauthorized| D{¿Refresh en curso?}
      D -->|No| E[Iniciar Refresh Token]
      D -->|Sí| F[Encolar Petición en Promesa]
      E --> G{¿Refresh Exitoso?}
      G -->|Sí| H[Reintentar Peticiones Encoladas]
      G -->|No| I[Limpiar Sesión y Redirigir a Login]`,
    diagramTitle: "Manejo de 401 y cola de refresh tokens"
  },

  server_state: {
    summary: "Server State pertenece al servidor y es asíncrono; Client State representa la intención e interacción local en el navegador.",
    why: "Distinguir ambos tipos de estado evita duplicar datos remotos en useState o Redux y previene bugs de datos desactualizados en la UI.",
    explanation: "Uno de los mayores errores conceptuales en React es tratar los datos de una API remota como si fueran estado local del componente. El Client State representa la interacción del usuario en la interfaz: si un modal está abierto, qué pestaña está seleccionada o el texto que se está escribiendo en un buscador. Este estado es síncrono, vive en la memoria de la aplicación y desaparece al desmontar la vista. El Server State, en cambio, representa datos cuya fuente de verdad reside en la base de datos del servidor (como órdenes, productos o perfiles). Es asíncrono, compartido por múltiples usuarios y puede cambiar fuera del control de tu componente.",
    steps: [
      "Identificá si el dato se origina en el navegador (Client State) o en una base de datos remota (Server State).",
      "Mantené el Client State en componentes, URL o stores de UI según su alcance de interacción.",
      "Administrá el Server State mediante una biblioteca de caché que controle frescura, revalidación e invalidación.",
      "Ante una acción del usuario, enviá la mutación al servidor e invalidá las entradas afectadas en la caché.",
      "Reflejá en la UI los estados de carga, revalidación en segundo plano y errores devueltos por el servidor."
    ],
    pitfalls: [
      "Copiar datos de una API en un useState local crea versiones desactualizadas que no se enteran si los datos cambian en otra parte de la app.",
      "Usar Redux o Context como una caché manual de servidor requiere escribir cientos de líneas de reducers e intermediarios para reintentos e invalidación.",
      "Asumir que los datos devueltos por la API permanecen frescos indefinidamente sin definir una estrategia de revalidación."
    ],
    takeaway: "Preguntá quién es el verdadero dueño del dato: el cliente administra su UI, el servidor posee los datos de dominio.",
    tableTitle: "CLIENT STATE VS SERVER STATE",
    tableLabel: "Diferencias fundamentales de ciclo de vida",
    table: {
      columns: ["Propiedad", "Client State", "Server State"],
      rows: [
        ["Autoridad", "El navegador (React)", "El servidor (Base de Datos)"],
        ["Naturaleza", "Síncrona e inmediata", "Asíncrona y sujeta a latencia/red"],
        ["Persistencia", "Temporal (memoria de UI / URL)", "Persistente y duradera"],
        ["Herramienta Recomendada", "useState / useReducer / Zustand / URL", "TanStack Query / SWR / RTK Query"]
      ]
    }
  },

  react_query: {
    summary: "TanStack Query gestiona la caché, sincronización e invalidación de Server State de forma declarativa sin boilerplate manual.",
    why: "Elimina la necesidad de escribir useEffects y useStates repetitivos para fetching, ofreciendo caché transparente y deduplicación.",
    explanation: "TanStack Query abstrae por completo el ciclo de vida del Server State en React. En lugar de ejecutar imperativamente un fetch dentro de un useEffect y guardar la respuesta en un useState local, declarás una consulta mediante `useQuery({ queryKey, queryFn })`. La `queryKey` actúa como el identificador único y determinista de esa entrada en la caché global. Si dos componentes en distintas partes del árbol solicitan la misma queryKey simultáneamente, TanStack Query realiza una sola petición de red y comparte el resultado entre ambos.",
    steps: [
      "Definí una queryKey estable (array) que incluya todas las variables de las que depende la consulta (filtros, IDs, páginas).",
      "Proporcioná la queryFn asíncrona encargada de solicitar los datos a la API REST o GraphQL.",
      "TanStack Query evalúa la caché: si el dato está fresco (staleTime), lo entrega al instante sin tocar la red.",
      "Si el dato está obsoleto pero existe en caché, lo muestra inmediatamente en la UI y dispara una revalidación en segundo plano (isFetching).",
      "Al ejecutar mutaciones (useMutation), invalidá la queryKey afectada para forzar la actualización automática de la vista."
    ],
    pitfalls: [
      "Construir queryKeys incompletas omitiendo variables de filtro o página, haciendo que búsquedas distintas compartan la misma caché equivocada.",
      "Confundir isLoading (primera carga sin datos previa) con isFetching (petición de red en curso, incluso con datos previos visibles).",
      "Confundir staleTime (tiempo que el dato se considera fresco) con gcTime / cacheTime (tiempo que el dato inactivo permanece en memoria antes de borrarse)."
    ],
    takeaway: "La caché de servidor requiere tres decisiones explícitas: clave de identidad, tiempo de frescura y estrategia de invalidación.",
    tableTitle: "ESTADOS DE UNA QUERY",
    tableLabel: "Distinguir entre carga inicial y revalidación",
    table: {
      columns: ["Estado", "isLoading", "isFetching", "Visualización Recomendada"],
      rows: [
        ["Primera Carga", "true", "true", "Skeleton o Spinner de pantalla completa"],
        ["Revalidación en Background", "false", "true", "UI con datos previos + indicador sutil de actualización"],
        ["Dato Fresco en Caché", "false", "false", "UI con datos instantáneos (sin spinners)"]
      ]
    }
  },

  optimistic_ui: {
    summary: "Optimistic UI actualiza la pantalla al instante asumiendo que la acción tendrá éxito, preparando un rollback explícito si falla.",
    why: "Proporciona una percepción de latencia cero en interacciones frecuentes como likes, favoritos o listas de tareas.",
    explanation: "En la mayoría de las aplicaciones web, cuando el usuario realiza una acción (como dar un 'Like' a una publicación), la UI muestra un indicador de carga y espera a que el servidor responda con un 200 OK para pintar el nuevo estado. La interfaz optimista invierte este flujo: actualiza la pantalla en el milisegundo en que el usuario hace clic, asumiendo que el servidor responderá exitosamente. Sin embargo, para que este patrón sea seguro y no deje la pantalla desincronizada ante un error de red o de validación, la arquitectura debe guardar una copia previa del estado y revertirla si la petición falla.",
    steps: [
      "El usuario dispara una acción en la interfaz (ej. eliminar un elemento de una lista).",
      "Se cancelan peticiones salientes en curso sobre ese recurso para evitar respuestas cruzadas.",
      "Se guarda un snapshot del estado actual de la caché o UI antes de realizar la modificación.",
      "Se aplica la actualización optimista inmediatamente en la pantalla.",
      "Si la petición falla, el callback de error restaura el snapshot previo y notifica la causa al usuario."
    ],
    pitfalls: [
      "Aplicar optimismo a operaciones irreversibles o críticas de negocio, como la confirmación de un pago o una transferencia bancaria.",
      "Olvidar guardar el snapshot previo, dejando la interfaz en un estado corrupto e irrecuperable si el servidor rechaza la orden.",
      "No manejar clics rápidos y repetidos del usuario (doble clic), generando conflictos entre snapshots anteriores."
    ],
    takeaway: "La UI optimista es una predicción de UX controlada: acelera la percepción, pero exige reconciliación y una recuperación explícita cuando el servidor no confirma.",
    mermaid: `flowchart TD
      A[Acción del usuario] --> B[Cancelar queries en curso]
      B --> C[Guardar Snapshot previo]
      C --> D[Actualizar UI al instante]
      D --> E{¿Respuesta API?}
      E -->|200 OK| F[Reconciliar con respuesta real]
      E -->|Error| G[Restaurar Snapshot + Notificar]`,
    diagramTitle: "Flujo de mutación optimista con rollback"
  },

  react_actions: {
    summary: "Las Actions en React 19 coordinan transiciones asíncronas, administrando pendings, errores y optimismo de forma nativa.",
    why: "Simplifican el manejo de formularios y mutaciones asíncronas reduciendo el boilerplate de useStates manuales para la carga.",
    explanation: "En versiones anteriores de React, enviar un formulario requería gestionar manualmente múltiples useStates (`isSubmitting`, `error`, `data`), controlar el evento submit y manejar bloques try/catch. En React 19, una Action es una función que encapsula una transición asíncrona. Al pasar una Action a un formulario o ejecutarla mediante `useActionState(actionFn, initialState)`, React se encarga de gestionar de forma nativa el estado pendiente (`isPending`), la captura de respuestas y la integración con `useOptimistic` para vistas temporales.",
    steps: [
      "Definí la Action asíncrona que recibe el estado anterior y los datos del payload.",
      "Conectá la Action al formulario mediante la prop action o usá useActionState para obtener el estado resultado y el flag isPending.",
      "React activa isPending de forma síncrona mientras la Action se ejecuta en segundo plano.",
      "Utilizá useOptimistic si querés mostrar una predicción visual mientras la Action está pendiente.",
      "Al finalizar la Action, React actualiza la vista con el estado retornado por el servidor o la función."
    ],
    pitfalls: [
      "Confundir errores de validación esperados (que deben devolverse como parte del estado de la Action) con excepciones de servidor (que capturan Error Boundaries).",
      "Disparar el dispatcher de la Action fuera de una prop de acción o de una Transition, perdiendo el control automático del estado isPending.",
      "Asumir que las Actions reemplazan la seguridad del backend: cualquier parámetro enviado debe volver a validarse en el servidor."
    ],
    takeaway: "Las Actions estandarizan la gestión de transiciones asíncronas en React, coordinando pendings y respuestas sin plomería manual."
  },

  component_architecture: {
    summary: "Una arquitectura sana separa la capa de datos, la orquestación de la pantalla y los componentes de presentación puros.",
    why: "Permite que la aplicación crezca sin que cada componente dependa de routers, APIs o detalles de estado global.",
    explanation: "A medida que una aplicación crece, situar el acceso a datos, los efectos de red, la lógica de negocio y el marcado JSX dentro de un mismo archivo convierte a los componentes en piezas rígidas y difíciles de testear. Una arquitectura de componentes escalable organiza el código en tres capas con responsabilidades delimitadas: 1. Capa de Datos (Custom Hooks) que aísla la red y la caché; 2. Contenedor de Feature (Screen) que coordina la pantalla, lee la URL y gestiona diálogos; y 3. Componentes Presentacionales puros de UI que solo reciben props y emiten callbacks.",
    steps: [
      "Organizá el código por capacidades de negocio (features) en lugar de carpetas por tipo de archivo.",
      "Extraé la lógica de red y caché a Custom Hooks dedicados con nombres de dominio (ej. useOrders).",
      "Construí componentes de pantalla que orquesten los datos y manejen la navegación de la ruta.",
      "Diseñá componentes presentacionales puros que reciban props claras y no conozcan la existencia de APIs o routers.",
      "Escribí pruebas de comportamiento sobre los componentes de UI y pruebas de integración sobre los Custom Hooks."
    ],
    pitfalls: [
      "Acoplar componentes de UI reutilizables (como botones o tablas) directamente a librerías de cliente de API o routers de la app.",
      "Crear abstracciones y capas intermedias por reflejo antes de que exista una necesidad real de reutilización.",
      "Realizar prop drilling a través de más de 4 niveles en lugar de utilizar composición con children."
    ],
    takeaway: "Dividí responsabilidades con claridad: los hooks obtienen datos, los contenedores orquestan y los componentes presentacionales pintan UI.",
    tableTitle: "LAS 3 CAPAS DE UN COMPONENTE",
    tableLabel: "Límites claros de responsabilidad",
    table: {
      columns: ["Capa", "Responsabilidad", "Lo que NO debe contener"],
      rows: [
        ["Custom Hook (Data)", "Peticiones de red, caché, formato de datos", "Marcado JSX, estilos visuales, routing"],
        ["Feature Screen (Contenedor)", "Orquestar hooks, leer URL, manejar diálogos", "Estilos CSS complejos, lógica de parsing"],
        ["Componente Presentacional", "Pintar UI, manejar accesibilidad y eventos", "Llamadas a fetch, imports de Redux/Query"]
      ]
    }
  },

  component_api_patterns: {
    summary: "Una buena API de componente expresa intención con props claras, composición con children y callbacks con payloads estables.",
    why: "Evita componentes frágiles inflados con props booleanas infinitas y permite evolucionar la librería sin romper consumidores.",
    explanation: "Diseñar la API pública de un componente reutilizable requiere pensar en los desarrolladores que van a consumirlo. El problema más frecuente en proyectos maduros es la acumulación de props booleanas de configuración (como `<Modal isOpen isLarge hasHeader isEditable />`). Esta estrategia explota rápidamente en combinaciones imposibles. La solución profesional consiste en diseñar componentes compuestos mediante `children` (Compound Components) o patrones de slots, permitiendo al consumidor ensamblar la estructura con libertad y manteniendo el estado compartido de forma encapsulada.",
    steps: [
      "Identificá las capacidades principales del componente y evitá crear props booleanas para cada variante visual.",
      "Utilizá composición con children o Compound Components para permitir estructuras flexibles.",
      "Para componentes controlados, expón el par `value` (o equivalente) y el callback `onChange` / `onValueChange`.",
      "Diseñá los callbacks de modo que entreguen objetos de detalles extensibles en lugar de múltiples parámetros posicionales.",
      "Preservá los contratos nativos de la plataforma (como `ref`, `disabled`, `aria-*`) cuando envuelvas elementos HTML."
    ],
    pitfalls: [
      "Crear decenas de props booleanas opcionales que generan combinaciones de estado imposibles de mantener.",
      "Exponer estados internos del componente como props públicas sin una política clara de controlado vs no controlado.",
      "Cambiar la firma de los callbacks públicos en actualizaciones posteriores, rompiendo a los consumidores de la aplicación."
    ],
    takeaway: "Diseñá componentes como contratos estables: utilizá composición para la estructura y payloads claros para los eventos."
  },

  state_management: {
    summary: "La gestión de estado decide dónde vive cada dato según su alcance, frecuencia de cambio y propietario legítimo.",
    why: "Previene tanto el prop drilling accidental como el antipatrón de meter todo el estado en un store global o Context unificado.",
    explanation: "Gestionar el estado en React no consiste en elegir una única librería y usarla para toda la aplicación. Una arquitectura sólida aplica una Matriz de Decisión según la naturaleza de cada dato: la URL se utiliza para el estado navegable y compartible (filtros, paginación); Context para dependencias de alcance amplio y baja frecuencia (tema, idioma); stores globales externos (Zustand) para estado de cliente complejo y frecuente (carrito, editores); y cachés de servidor (TanStack Query) para datos remotos.",
    steps: [
      "Definí si el dato es navegable: si debe compartirse por link, su fuente de verdad es la URL.",
      "Si el dato es una preferencia de UI global de baja frecuencia (tema), ubicalo en un Context.",
      "Si es estado de cliente interactivo complejo compartido por piezas lejanas (carrito), usá un Store global como Zustand.",
      "Si el dato proviene de una API externa, administralo con una caché de servidor dedicada.",
      "Mantené como useState local todo estado de interacción que solo le importe a un único componente."
    ],
    pitfalls: [
      "Duplicar el mismo dato en la URL, en Context y en un useState, creando fuentes de verdad enfrentadas.",
      "Usar Context para datos de alta frecuencia de cambio, provocando que todo el árbol de consumidores se re-renderice en cada actualización.",
      "Almacenar respuestas de la API en Redux o Context en lugar de emplear un administrador de caché de servidor."
    ],
    takeaway: "No existe una herramienta única para el estado: elegí la ubicación según el alcance, la frecuencia y la propiedad del dato.",
    tableTitle: "MATRIZ DE DECISIÓN DE ESTADO",
    tableLabel: "Dónde ubicar cada dato en la arquitectura",
    table: {
      columns: ["Categoría de Dato", "Ubicación Recomendada", "Ejemplo Concreto"],
      rows: [
        ["Filtros y Navegación", "URL Query Params", "?status=active&page=2"],
        ["Preferencia Global (Baja Freq)", "React Context", "Tema visual (dark/light), Idioma"],
        ["Estado Cliente Complejo", "Store Externo (Zustand)", "Carrito de compras, Canvas interactivo"],
        ["Datos Remotos", "Server Cache (TanStack Query)", "Lista de órdenes, Perfil de usuario"]
      ]
    }
  },

  external_stores: {
    summary: "useSyncExternalStore ofrece el protocolo oficial para que React lea y se suscriba de forma coherente a una fuente externa durante render concurrente.",
    why: "Es el contrato oficial para integrar Redux, Zustand o APIs del navegador (online/offline) con React 18+ de forma segura.",
    explanation: "Antes de React 18, suscribirse a un store de datos fuera de React usando `useEffect` y `useState` funcionaba bien. Sin embargo, con el renderizado concurrente, React puede pausar y reanudar el renderizado de un árbol de componentes. Si el store externo cambia a mitad de ese proceso, un componente podría leer la versión vieja y otro la versión nueva en la misma pantalla, produciendo el fenómeno conocido como 'Tearing' (desgarro visual). `useSyncExternalStore` soluciona esto exigiendo una función de suscripción y un snapshot inmutable.",
    steps: [
      "Proporcioná una función `subscribe` que registre el callback de cambio y devuelva la función de limpieza.",
      "Implementá `getSnapshot` devolviendo el valor actual del estado de forma inmutable.",
      "Asegurate de que `getSnapshot` retorne la misma referencia en memoria si el dato no ha cambiado.",
      "Proporcioná `getServerSnapshot` para entregar un valor inicial seguro durante el renderizado en el servidor (SSR).",
      "React usará estas funciones para mantener la pantalla síncrona y consistente durante renders concurrentes."
    ],
    pitfalls: [
      "Retornar un nuevo objeto o array en cada llamada a `getSnapshot`, lo que provoca bucles infinitos de re-renderizado en React.",
      "Utilizar `useEffect` manual para suscribirse a stores globales en aplicaciones que aprovechan las características concurrentes de React 18.",
      "Omitir `getServerSnapshot` en proyectos con SSR (Next.js), generando errores de desincronización durante la hidratación."
    ],
    takeaway: "useSyncExternalStore garantiza que los stores externos a React se lean de forma síncrona y consistente en toda la UI."
  },

  typescript_react: {
    summary: "TypeScript documenta y verifica contratos de componentes y estados en compilación, pero no valida datos de red en runtime.",
    why: "Permite prevenir errores de propiedades inexistentes, modelar estados de UI de forma honesta y refactorizar con confianza.",
    explanation: "TypeScript en React sirve para hacer explícitos los contratos de props, callbacks y estados de la interfaz. La mejor práctica para modelar estados de UI es utilizar Uniones Discriminadas (Discriminated Unions). En lugar de usar propiedades opcionales ambiguas que permiten combinaciones imposibles (como tener `isLoading: true` y `data` cargado al mismo tiempo), se define un tipo con una propiedad discriminadora (`status`) que garantiza que cada estado tenga únicamente las propiedades que le corresponden.",
    steps: [
      "Tipá las props de los componentes y los callbacks en las fronteras de entrada.",
      "Utilizá Uniones Discriminadas para representar estados de UI mutuamente excluyentes (idle, loading, success, error).",
      "Extendé tipos nativos como `ComponentPropsWithoutRef<'button'>` al crear componentes que envuelven elementos HTML.",
      "Evitá el uso de `any` o casts defensivos (`as Type`) que ocultan la falta de comprobaciones reales.",
      "Combiná TypeScript con esquemas de validación en runtime (Zod) al recibir datos externos de la red."
    ],
    pitfalls: [
      "Usar `as Type` para forzar un tipo sobre una respuesta JSON sin validar que los campos realmente existan en runtime.",
      "Definir props con múltiples flags opcionales que permiten representar estados de UI contradictorios.",
      "Tipar manualmente eventos nativos en lugar de utilizar los tipos integrados proporcionados por React."
    ],
    takeaway: "TypeScript verifica el código en desarrollo; la validación en runtime protege las fronteras de datos reales."
  },

  case_dashboard: {
    summary: "Un Dashboard combina filtros en URL, caché de servidor por widget, paginación y aislamiento de fallas entre widgets.",
    why: "Es un ejercicio clave de entrevista de System Design Frontend que demuestra dominio de estado, resiliencia y UX real.",
    explanation: "Diseñar un Dashboard complejo en React requiere coordinar múltiples piezas sin que la pantalla se vuelva lenta o frágil. Los filtros generales (rango de fechas, cliente, estado) deben vivir en la URL para ser navegables y compartibles. Cada widget de la pantalla debe ser una frontera independiente: realiza su propia consulta de datos con TanStack Query y cuenta con sus propios estados de carga y Error Boundaries. De este modo, si un gráfico secundario falla por un error del servidor, el resto del dashboard permanece totalmente funcional.",
    steps: [
      "Establecé la URL como la fuente de verdad de los filtros globales compartibles.",
      "Asigná a cada widget su propia queryKey derivada de los filtros de la URL.",
      "Aislá los widgets con Suspense o estados de carga independientes para evitar que una petición lenta bloquee la pantalla.",
      "Envolvé secciones o widgets en Error Boundaries locales para ofrecer reintentos sin derribar el dashboard.",
      "Implementá paginación en servidor o virtualización para tablas con volumen grande de datos."
    ],
    pitfalls: [
      "Bloquear toda la pantalla del dashboard con un único spinner gigante mientras se cargan múltiples peticiones independientes.",
      "No incluir las variables de filtro en la queryKey de los widgets, mostrando datos de selecciones anteriores.",
      "Renderizar miles de filas en el DOM sin paginación ni virtualización, congelando el navegador."
    ],
    takeaway: "Filtros en URL, caché por widget y fronteras de error independientes aseguran un dashboard rápido y resiliente.",
    mermaid: `flowchart TD
      A[URL Params: ?status=paid] --> B[Dashboard Container]
      B --> C[Widget Métricas: useQuery]
      B --> D[Widget Ventas: useQuery]
      B --> E[Tabla Órdenes: useQuery]
      C --> C1[Error Boundary 1]
      D --> D1[Error Boundary 2]
      E --> E1[Paginación / Virtualización]`,
    diagramTitle: "Arquitectura desacoplada de un dashboard"
  },

  case_auth: {
    summary: "Auth frontend coordina la verificación inicial de sesión, guardas de rutas, refresh de tokens sin bucles y manejo de permisos.",
    why: "Prueba si entendés la diferencia entre autenticación y autorización y cómo estructurar flujos de sesión sin parpadeos visuales.",
    explanation: "El diseño de autenticación en React debe manejar con precisión el ciclo de vida del usuario. Al cargar la app, el estado inicial de sesión es 'checking' para evitar redirigir al usuario al login antes de verificar si existen credenciales válidas en cookies o memoria. Las rutas protegidas interceptan la navegación evaluando este estado. En caso de recibir un 401 Unauthorized, un interceptor intenta renovar el token una sola vez; si el refresh falla o devuelve 401, se destruye la sesión y se redirige a login.",
    steps: [
      "Mantené un estado inicial 'checking' durante el bootstrap para no redirigir al login prematuramente.",
      "Construí un componente Guard de ruta protegida que evalúe la sesión al intentar acceder a pantallas privadas.",
      "Implementá el refresco silencioso de token ante respuestas 401, encolando peticiones concurrentes.",
      "Si el refresh falla, limpiá la caché y la sesión e iniciá la redirección a login guardando la ruta de origen.",
      "Diferenciá respuestas 401 (re-autenticar) de respuestas 403 (mostrar pantalla de acceso denegado sin cerrar sesión)."
    ],
    pitfalls: [
      "Redirigir al usuario a la pantalla de login mientras el estado de autenticación aún se encuentra en fase de carga inicial.",
      "Permitir que múltiples peticiones 401 salientes disparen peticiones de refresh duplicadas de forma simultánea.",
      "Reintentar indefinidamente la petición de refresh cuando el propio endpoint de refresh devuelve un error 401."
    ],
    takeaway: "El cliente organiza la experiencia y navegación de la sesión; el backend valida de forma absoluta cada permiso."
  },

  case_checkout: {
    summary: "Checkout frontend es una máquina de estados finita que coordina validación, estado de envío, clave de idempotencia y resultados.",
    why: "Muestra capacidad para diseñar flujos transaccionales tolerantes a latencia, doble clic, timeouts y fallas del proveedor.",
    explanation: "Un flujo de checkout en React no debe manejarse con un simple booleano de carga. Se modela como una máquina de estados explícita con transiciones claras: 'editing' (completando campos), 'submitting' (envío en curso con botón deshabilitado y clave de idempotencia), 'pending' (esperando confirmación o verificación 3DS externa), 'success' (confirmación recibida) y 'failed' (error recuperable). Esto evita cobros duplicados por doble clic y asegura que el carrito solo se vacíe tras recibir la confirmación durable del servidor.",
    steps: [
      "Modelá el flujo con estados finitos explícitos (editing, submitting, pending, success, failed).",
      "Generá una clave de idempotencia (idempotencyKey) en el cliente al iniciar el intento de cobro.",
      "Deshabilitá los controles de submit inmediatamente al iniciar la transición para evitar envíos duplicados.",
      "Diferenciá errores de validación (recuperables en el form) de fallas de red o timeouts (requieren consulta de estado).",
      "Vaciá el carrito de compras únicamente cuando el servidor devuelva la confirmación exitosa y duradera de la orden."
    ],
    pitfalls: [
      "Vaciar el carrito de compras del usuario antes de recibir la confirmación exitosa y duradera del servidor.",
      "No utilizar claves de idempotencia en peticiones de cobro, provocando cobros dobles si el usuario reintenta por latencia.",
      "Tratar un timeout de red como si el pago se hubiera rechazado, sin consultar el estado real de la orden en el servidor."
    ],
    takeaway: "Checkout exige estados finitos e idempotencia: el cliente previene la duplicación y el servidor confirma el pago."
  }
};
