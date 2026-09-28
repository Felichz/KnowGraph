const NARRATION_TEXT = {
  es: {
    arrow: " siguiente ",
    summary: "En una frase",
    why: "Por qué importa",
    explanation: "Explicación clara",
    auditFailures: (failureModes) => ` Si algo sale mal: ${failureModes}`,
    auditCase: (primer, example, failures) => `${primer} Ejemplo: ${example}.${failures}`,
    auditRisksTitle: "Riesgos que debés poder explicar",
    auditCaseTitle: "Caso concreto y fallas",
    docNotes: "Matices de la documentación",
    context: "Dónde estamos en la ruta",
    prompt: "Posible consigna en vivo",
    tableColumnFallback: "Dato",
    tableTitle: "Mapa rápido",
    tableIntro: (rows) => `La tabla resume esta relación. ${rows}`,
    diagramTitle: "Cómo leer el diagrama",
    diagramItem: (label, detail) => `${label} significa lo siguiente: ${detail}`,
    diagramIntro: (flow) => `El diagrama representa este flujo conceptual. ${flow}`,
    mermaidTitled: (diagramTitle) => ` titulado ${diagramTitle}`,
    mermaid: (title) => `El diagrama${title} resume el flujo principal de este caso. Seguí las flechas para entender qué ocurre primero, qué respuesta recibe la interfaz y en qué punto se actualiza la fuente de verdad. La explicación de la card desarrolla cada decisión y cada posible salida.`,
    steps: "Paso a paso",
    step: (number, step) => `Paso ${number}: ${step}`,
    pitfalls: "Trade-offs y errores",
    takeaway: "Idea para recordar",
    codeFallback: (explanation) => `Mirá el snippet mientras escuchás. El fragmento lleva a código la idea central de esta card. ${explanation} Prestá atención a qué datos entran, qué función coordina el flujo y qué resultado observa el usuario.`,
    codeOverrides: {
      routing: "Mirá el snippet mientras escuchás. La ruta declara que cuando el navegador visita una URL como orders seguido de un identificador, React debe renderizar la pantalla de detalle de una orden. Los dos puntos delante de id indican que ese fragmento de la URL es un parámetro dinámico. En una aplicación real, el componente puede leer ese parámetro para pedir la orden correspondiente. La ruta decide qué pantalla mostrar; no reemplaza la autorización del backend.",
      auth_frontend: "Mirá el snippet mientras escuchás. Esta request agrega un header Authorization con el esquema Bearer y el access token que obtuvo el usuario al iniciar sesión. El cliente envía ese token en requests protegidas para que la API identifique la sesión. Si la API responde 401, el cliente puede intentar renovar la sesión una sola vez; si responde 403, la identidad existe pero no tiene permiso. El token no convierte al frontend en autoridad: Rails debe verificar todo nuevamente.",
      server_state: "Mirá el snippet mientras escuchás. El primer valor, isOpen, representa estado local: controla una interacción de esta pantalla y vive en useState. El segundo valor, orders, representa datos que vienen del servidor y se obtienen mediante una query. La diferencia importante no es la sintaxis del hook, sino el ciclo de vida: el modal cambia por eventos locales, mientras las órdenes tienen loading, freshness, cache, refetch e invalidación.",
      react_query: "Mirá el snippet mientras escuchás. useQuery recibe dos piezas. queryKey identifica de manera estable qué resultado se está cacheando; por eso incluye orders y los filtros actuales. queryFn sabe cómo pedir esos datos a la API. Cuando cambian los filtros cambia la clave y React Query puede buscar el resultado correcto, reutilizar cache o ejecutar la request. Después de una mutación hay que invalidar o actualizar las claves afectadas.",
      optimistic_ui: "Mirá el snippet mientras escuchás. useOptimistic parte de la lista confirmada de todos y construye una versión temporal. Cuando el usuario agrega un todo, la actualización optimista lo muestra enseguida con pending en true. startTransition coordina ese trabajo mientras createTodo habla con el servidor. Si el backend confirma, la fuente real reemplaza la predicción; si falla, la UI debe quitarla o restaurar el estado anterior y comunicar el error.",
      react_actions: "Mirá el snippet mientras escuchás. useActionState conecta la función saveProfile con el resultado y el estado pending de una operación asíncrona. La función rename se ejecuta dentro de startTransition: primero actualiza la vista optimista con el nuevo nombre y después envía el payload mediante submitAction. Mientras la operación está pendiente, la interfaz puede mostrar la predicción; cuando llega la respuesta, result vuelve a ser la fuente confirmada.",
      component_architecture: "Mirá el snippet mientras escuchás. OrdersPage coordina tres responsabilidades: obtiene los filtros desde un hook, consulta las órdenes usando el valor de esos filtros y entrega ambos contratos a OrdersScreen. La página funciona como frontera de feature; OrdersScreen puede concentrarse en presentar la UI. La idea es que la vista no conozca detalles de transporte ni que cada componente tenga que descubrir por su cuenta cómo obtener los datos.",
      component_api_patterns: "Mirá el snippet mientras escuchás. El componente Dialog recibe open y onOpenChange, así que el padre conserva la fuente de verdad y el diálogo solo propone cambios. children permite que el consumidor componga el contenido, como Title y Actions, sin agregar una prop booleana por cada variación. La API expone intención, estado y eventos; oculta cómo se implementan el foco, el portal o el cierre.",
      state_management: "Mirá el snippet mientras escuchás. Este mapa compara dueños de estado, no muestra una única API para copiar. La interacción aislada pertenece al state local; los filtros que deben compartirse pueden vivir en la URL; dependencias amplias como el tema encajan en Context; un carrito complejo puede vivir en un store; y las órdenes remotas deben permanecer en una cache de servidor. Elegir dueño evita duplicar la misma fuente en varios lugares.",
      external_stores: "Mirá el snippet mientras escuchás. useSyncExternalStore recibe una función subscribe y dos formas de leer el valor. subscribe registra listeners para los eventos online y offline y devuelve cleanup para quitarlos. getSnapshot consulta navigator.onLine en el navegador; getServerSnapshot devuelve un valor estable durante SSR. React usa ese contrato para leer un store externo de forma consistente durante renders concurrentes.",
    },
  },
  en: {
    arrow: " next ",
    summary: "In one sentence",
    why: "Why it matters",
    explanation: "Clear explanation",
    auditFailures: (failureModes) => ` If something goes wrong: ${failureModes}`,
    auditCase: (primer, example, failures) => `${primer} Example: ${example}.${failures}`,
    auditRisksTitle: "Risks you should be able to explain",
    auditCaseTitle: "Concrete case and failures",
    docNotes: "Documentation nuances",
    context: "Where we are on the route",
    prompt: "Possible live exercise",
    tableColumnFallback: "Item",
    tableTitle: "Quick map",
    tableIntro: (rows) => `The table summarizes this relationship. ${rows}`,
    diagramTitle: "How to read the diagram",
    diagramItem: (label, detail) => `${label} means the following: ${detail}`,
    diagramIntro: (flow) => `The diagram represents this conceptual flow. ${flow}`,
    mermaidTitled: (diagramTitle) => ` titled ${diagramTitle}`,
    mermaid: (title) => `The diagram${title} summarizes the main flow of this case. Follow the arrows to understand what happens first, what response the interface receives and at which point the source of truth is updated. The explanation in the card develops each decision and each possible outcome.`,
    steps: "Step by step",
    step: (number, step) => `Step ${number}: ${step}`,
    pitfalls: "Trade-offs and mistakes",
    takeaway: "Idea to remember",
    codeFallback: (explanation) => `Look at the snippet while you listen. The fragment turns the central idea of this card into code. ${explanation} Pay attention to which data comes in, which function coordinates the flow and what result the user sees.`,
    codeOverrides: {
      routing: "Look at the snippet while you listen. The route declares that when the browser visits a URL like orders followed by an identifier, React should render the detail screen for an order. The colon in front of id indicates that this part of the URL is a dynamic parameter. In a real application, the component can read that parameter to request the corresponding order. The route decides which screen to show; it does not replace authorization in the backend.",
      auth_frontend: "Look at the snippet while you listen. This request adds an Authorization header with the Bearer scheme and the access token the user obtained when signing in. The client sends that token on protected requests so the API can identify the session. If the API responds 401, the client can try to renew the session once; if it responds 403, the identity exists but does not have permission. The token does not make the frontend an authority: Rails must verify everything again.",
      server_state: "Look at the snippet while you listen. The first value, isOpen, represents local state: it controls an interaction on this screen and lives in useState. The second value, orders, represents data that comes from the server and is obtained through a query. The important difference is not the hook syntax but the lifecycle: the modal changes through local events, while the orders have loading, freshness, cache, refetch and invalidation.",
      react_query: "Look at the snippet while you listen. useQuery receives two pieces. queryKey identifies in a stable way which result is being cached; that is why it includes orders and the current filters. queryFn knows how to request that data from the API. When the filters change, the key changes and React Query can look up the right result, reuse the cache or run the request. After a mutation you have to invalidate or update the affected keys.",
      optimistic_ui: "Look at the snippet while you listen. useOptimistic starts from the confirmed list of todos and builds a temporary version. When the user adds a todo, the optimistic update shows it right away with pending set to true. startTransition coordinates that work while createTodo talks to the server. If the backend confirms, the real source replaces the prediction; if it fails, the UI must remove it or restore the previous state and communicate the error.",
      react_actions: "Look at the snippet while you listen. useActionState connects the saveProfile function with the result and the pending state of an async operation. The rename function runs inside startTransition: first it updates the optimistic view with the new name and then it sends the payload through submitAction. While the operation is pending, the interface can show the prediction; when the response arrives, result becomes the confirmed source again.",
      component_architecture: "Look at the snippet while you listen. OrdersPage coordinates three responsibilities: it gets the filters from a hook, queries the orders using the value of those filters and hands both contracts to OrdersScreen. The page works as a feature boundary; OrdersScreen can focus on presenting the UI. The idea is that the view does not know transport details and that no component has to figure out on its own how to get the data.",
      component_api_patterns: "Look at the snippet while you listen. The Dialog component receives open and onOpenChange, so the parent keeps the source of truth and the dialog only proposes changes. children lets the consumer compose the content, such as Title and Actions, without adding a boolean prop for every variation. The API exposes intent, state and events; it hides how focus, the portal or closing are implemented.",
      state_management: "Look at the snippet while you listen. This map compares state owners; it does not show a single API to copy. The isolated interaction belongs in local state; filters that need to be shared can live in the URL; broad dependencies like the theme fit in Context; a complex cart can live in a store; and remote orders should stay in a server cache. Choosing an owner avoids duplicating the same source in several places.",
      external_stores: "Look at the snippet while you listen. useSyncExternalStore receives a subscribe function and two ways to read the value. subscribe registers listeners for the online and offline events and returns a cleanup that removes them. getSnapshot reads navigator.onLine in the browser; getServerSnapshot returns a stable value during SSR. React uses that contract to read an external store consistently during concurrent renders.",
    },
  },
};

const narrationText = (locale) => NARRATION_TEXT[locale] ?? NARRATION_TEXT.es;

export function normalizeSpeechText(value, locale = "es") {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/[`*_~]/g, "")
    .replace(/[→↔←]/g, narrationText(locale).arrow)
    .replace(/\s+/g, " ")
    .trim();
}

function makeSpeechSegment(id, title, content, locale = "es") {
  const body = normalizeSpeechText(content, locale);
  const prefix = title ? `${title}. ` : "";
  return body ? { id, title, text: normalizeSpeechText(`${prefix}${body}`, locale) } : null;
}

export function getCodeNarration(node, lesson, locale = "es") {
  const text = narrationText(locale);
  return text.codeOverrides[node.id] ?? text.codeFallback(lesson.explanation);
}

export function buildLessonNarrationSegments(node, context, locale = "es") {
  const text = narrationText(locale);
  const segment = (id, title, content) => makeSpeechSegment(id, title, content, locale);
  const lesson = node.lesson;
  const segments = [
    segment("summary", text.summary, `${node.label}. ${lesson.summary}`),
    segment("why", text.why, lesson.why),
    segment("explanation", text.explanation, lesson.explanation),
  ];

  if (lesson.audit) {
    const failures = lesson.audit.failureModes?.length ? text.auditFailures(lesson.audit.failureModes.join(". ")) : "";
    const auditText = lesson.explanationUsesAudit
      ? failures
      : text.auditCase(lesson.audit.primer, lesson.audit.example, failures);
    segments.push(segment("audit", lesson.explanationUsesAudit ? text.auditRisksTitle : text.auditCaseTitle, auditText));
  }
  if (lesson.docNotes?.length) segments.push(segment("docNotes", text.docNotes, lesson.docNotes.join(". ")));
  segments.push(segment("context", text.context, context));
  if (lesson.prompt) segments.push(segment("prompt", text.prompt, lesson.prompt));
  if (lesson.table) {
    const rows = lesson.table.rows
      .map((row) => row.map((cell, index) => `${lesson.table.columns?.[index] ?? text.tableColumnFallback}: ${cell}`).join(". "))
      .join(". ");
    segments.push(segment("table", lesson.tableTitle ?? text.tableTitle, text.tableIntro(rows)));
  }
  if (lesson.diagram) {
    const flow = lesson.diagram.map((item) => text.diagramItem(item.label, item.detail)).join(". ");
    segments.push(segment("diagram", text.diagramTitle, text.diagramIntro(flow)));
  }
  if (lesson.mermaid) {
    const title = lesson.diagramTitle ? text.mermaidTitled(lesson.diagramTitle) : "";
    segments.push(segment("diagram", text.diagramTitle, text.mermaid(title)));
  }
  if (lesson.code) segments.push(segment("example", "", getCodeNarration(node, lesson, locale)));
  if (lesson.steps?.length) segments.push(segment("steps", text.steps, lesson.steps.map((step, index) => text.step(index + 1, step)).join(". ")));
  if (lesson.pitfalls?.length) segments.push(segment("pitfalls", text.pitfalls, lesson.pitfalls.join(". ")));
  if (lesson.takeaway) segments.push(segment("takeaway", text.takeaway, lesson.takeaway));

  return segments.filter(Boolean);
}
