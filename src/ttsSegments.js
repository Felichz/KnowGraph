export function normalizeSpeechText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/[`*_~]/g, "")
    .replace(/[→↔←]/g, " siguiente ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeSpeechSegment(id, title, content) {
  const body = normalizeSpeechText(content);
  const prefix = title ? `${title}. ` : "";
  return body ? { id, title, text: normalizeSpeechText(`${prefix}${body}`) } : null;
}

const CODE_NARRATION_OVERRIDES = {
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
};

export function getCodeNarration(node, lesson) {
  return CODE_NARRATION_OVERRIDES[node.id]
    ?? `Mirá el snippet mientras escuchás. El fragmento lleva a código la idea central de esta card. ${lesson.explanation} Prestá atención a qué datos entran, qué función coordina el flujo y qué resultado observa el usuario.`;
}

export function buildLessonNarrationSegments(node, context) {
  const lesson = node.lesson;
  const segments = [
    makeSpeechSegment("summary", "En una frase", `${node.label}. ${lesson.summary}`),
    makeSpeechSegment("why", "Por qué importa", lesson.why),
    makeSpeechSegment("explanation", "Explicación clara", lesson.explanation),
  ];

  if (lesson.audit) {
    const failures = lesson.audit.failureModes?.length ? ` Si algo sale mal: ${lesson.audit.failureModes.join(". ")}` : "";
    const auditText = lesson.explanationUsesAudit
      ? failures
      : `${lesson.audit.primer} Ejemplo: ${lesson.audit.example}.${failures}`;
    segments.push(makeSpeechSegment("audit", lesson.explanationUsesAudit ? "Riesgos que debés poder explicar" : "Caso concreto y fallas", auditText));
  }
  if (lesson.docNotes?.length) segments.push(makeSpeechSegment("docNotes", "Matices de la documentación", lesson.docNotes.join(". ")));
  segments.push(makeSpeechSegment("context", "Dónde estamos en la ruta", context));
  if (lesson.prompt) segments.push(makeSpeechSegment("prompt", "Posible consigna en vivo", lesson.prompt));
  if (lesson.table) {
    const rows = lesson.table.rows
      .map((row) => row.map((cell, index) => `${lesson.table.columns?.[index] ?? "Dato"}: ${cell}`).join(". "))
      .join(". ");
    segments.push(makeSpeechSegment("table", lesson.tableTitle ?? "Mapa rápido", `La tabla resume esta relación. ${rows}`));
  }
  if (lesson.diagram) {
    const flow = lesson.diagram.map((item) => `${item.label} significa lo siguiente: ${item.detail}`).join(". ");
    segments.push(makeSpeechSegment("diagram", "Cómo leer el diagrama", `El diagrama representa este flujo conceptual. ${flow}`));
  }
  if (lesson.mermaid) {
    const title = lesson.diagramTitle ? ` titulado ${lesson.diagramTitle}` : "";
    segments.push(makeSpeechSegment("diagram", "Cómo leer el diagrama", `El diagrama${title} resume el flujo principal de este caso. Seguí las flechas para entender qué ocurre primero, qué respuesta recibe la interfaz y en qué punto se actualiza la fuente de verdad. La explicación de la card desarrolla cada decisión y cada posible salida.`));
  }
  if (lesson.code) segments.push(makeSpeechSegment("example", "", getCodeNarration(node, lesson)));
  if (lesson.steps?.length) segments.push(makeSpeechSegment("steps", "Paso a paso", lesson.steps.map((step, index) => `Paso ${index + 1}: ${step}`).join(". ")));
  if (lesson.pitfalls?.length) segments.push(makeSpeechSegment("pitfalls", "Trade-offs y errores", lesson.pitfalls.join(". ")));
  if (lesson.takeaway) segments.push(makeSpeechSegment("takeaway", "Idea para recordar", lesson.takeaway));

  return segments.filter(Boolean);
}
