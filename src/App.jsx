import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import * as d3 from "d3";
import LESSONS from "./lessons";
import LEARNING_EXPLANATIONS from "./learningExplanations";
import CLARIFIED_BULLETS from "./clarifiedBullets";
import REACT_GRAPH from "./reactGraph";
import { buildBrowserSpeechSegments } from "./browserTtsFull";
import { getCodeNarration } from "./ttsSegments";
import { REACT_DEEP_DIVES, findDeepDiveMatches } from "./reactDeepDives";
import { getInterviewQuestionPrerequisites } from "./reactQuiz";
import { ParaphraseReview } from "./components/ParaphraseReview.jsx";
import { FlashcardView } from "./components/FlashcardView.jsx";
import { ViewModeToggle } from "./components/ViewModeToggle.jsx";
import GraphLanesView from "./components/graphViews/GraphLanesView.jsx";
import GraphRadialView from "./components/graphViews/GraphRadialView.jsx";
import GraphPathView from "./components/graphViews/GraphPathView.jsx";
import { GraphViewTabs } from "./components/graphViews/GraphViewTabs.jsx";
import { ReadingChunks } from "./components/ReadingChunks.jsx";
import { listAllAttempts } from "./ai/learningStore.js";
import { hashCardContent } from "./ai/contentHash.js";
import { getCompletionView, getScoreView, isEvaluationSurfaceComplete } from "./ai/types.js";

let mermaidLoader;

function loadMermaid() {
  if (!mermaidLoader) {
    mermaidLoader = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        themeVariables: {
          primaryColor: "#171c27",
          primaryTextColor: "#f5f1e8",
          primaryBorderColor: "#5aa9ff",
          lineColor: "#95a0b3",
          secondaryColor: "#202735",
          tertiaryColor: "#12161f",
        },
        flowchart: { htmlLabels: true, curve: "basis" },
      });
      return mermaid;
    });
  }
  return mermaidLoader;
}

function MermaidDiagram({ chart }) {
  const diagramId = `diagram-${useId().replace(/:/g, "")}`;
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadMermaid().then((mermaid) => mermaid.render(diagramId, chart))
      .then(({ svg: renderedSvg }) => { if (!cancelled) setSvg(renderedSvg); })
      .catch(() => { if (!cancelled) setSvg(""); });
    return () => { cancelled = true; };
  }, [chart, diagramId]);

  return svg
    ? <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
    : <div className="mermaid-diagram mermaid-loading">Preparando diagrama…</div>;
}

function SectionAudioButton({ segmentId, active, onClick }) {
  return <button className={`section-audio-button ${active ? "is-active" : ""}`} type="button" aria-label={`Reproducir sección ${segmentId}`} title="Reproducir esta sección" onClick={() => onClick(segmentId)}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M17 8.5a5 5 0 0 1 0 7M19.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  </button>;
}

function RichText({ text, nodeId, enabled, onDeepDive, activeDeepDiveKey, limit = 3 }) {
  if (!enabled || !text || typeof text !== "string") return text;
  const matches = findDeepDiveMatches(text, nodeId, limit);
  if (!matches.length) return text;

  const parts = [];
  let cursor = 0;
  matches.forEach((match) => {
    if (match.start > cursor) parts.push(text.slice(cursor, match.start));
    const triggerKey = `${nodeId}:${match.id}:${match.start}:${text.length}:${text.slice(0, 24)}`;
    const expanded = activeDeepDiveKey === triggerKey;
    parts.push(
      <button
        className="deep-dive-term"
        type="button"
        key={`${match.id}-${match.start}`}
        aria-label={`Profundizar por qué: ${match.text}`}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={expanded ? "deep-dive-popover" : undefined}
        title="Abrir una explicación más profunda"
        onClick={(event) => onDeepDive(match.id, event, triggerKey)}
      >
        {match.text}
        <span aria-hidden="true">?</span>
      </button>,
    );
    cursor = match.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function DeepDivePopover({ active, onClose }) {
  if (!active) return null;
  const dive = REACT_DEEP_DIVES[active.id];
  if (!dive) return null;

  return (
    <aside
      id="deep-dive-popover"
      className={`deep-dive-popover ${active.above ? "is-above" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-label={dive.title}
      style={{ left: active.left, top: active.top }}
    >
      <div className="deep-dive-popover-head">
        <div>
          <span>SEGUNDA CAPA · POR QUÉ</span>
          <h3>{dive.title}</h3>
        </div>
        <button type="button" aria-label="Cerrar explicación profunda" onClick={onClose}>×</button>
      </div>
      <p>{dive.answer}</p>
      <div className="deep-dive-example"><strong>Ejemplo</strong><span>{dive.example}</span></div>
      {dive.nuance && <div className="deep-dive-nuance"><strong>Matiz importante</strong><span>{dive.nuance}</span></div>}
      {dive.sources?.length > 0 && <div className="deep-dive-sources">
        {dive.sources.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label} ↗</a>)}
      </div>}
    </aside>
  );
}

const TTS_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const CATEGORIES = {
  fundamentals: { label: "Rails core & request", color: "#E8A33D" },
  activerecord: { label: "Active Record & DB", color: "#CC342D" },
  patterns: { label: "Diseño aplicado", color: "#5AA9FF" },
  sti: { label: "STI & polimorfismo", color: "#A78BFA" },
  infra: { label: "API, seguridad & runtime", color: "#94A3B8" },
  assets: { label: "Asset pipeline", color: "#2DD4BF" },
  testing: { label: "Testing (RSpec)", color: "#4ADE80" },
};

const CATEGORY_CONTEXT = {
  fundamentals: "Estamos armando el recorrido de una request Rails, desde el lenguaje y las convenciones hasta la respuesta HTTP.",
  activerecord: "Ahora que sabés cómo una request llega al controller, entramos en la capa que modela y persiste los datos.",
  patterns: "Con request, datos y transacciones claros, ahora decidimos dónde vive la lógica de negocio y cómo cambia sin acoplarse.",
  sti: "Con asociaciones básicas resueltas, ahora modelamos variantes y capacidades compartidas entre registros.",
  infra: "La aplicación ya funciona en lo básico; ahora definimos su contrato con React, su seguridad y su operación en distintos entornos.",
  assets: "Esta rama explica cómo Rails publica los archivos que el navegador necesita y qué alternativa usa cada generación de proyectos.",
  testing: "Después de entender el comportamiento, definimos cómo demostrarlo con tests rápidos y de alcance correcto.",
};

const NODE_DATA = [
  ["ruby_basics", "Ruby mínimo para leer Rails", "fundamentals"],
  ["mvc", "Rails MVC + convenciones", "fundamentals"],
  ["rack", "Request lifecycle & Rack", "fundamentals"],
  ["routing_rest", "Routing RESTful", "fundamentals"],
  ["controllers_params", "Controllers & strong params", "fundamentals"],
  ["responses_errors", "Responses, status & errores", "fundamentals"],
  ["ar_pattern", "Mental model de Active Record", "activerecord"],
  ["ar_orm", "CRUD, Relation & lazy queries", "activerecord"],
  ["migrations", "Migrations, índices & constraints", "activerecord"],
  ["validations", "Validaciones e integridad", "activerecord"],
  ["assoc_belongs", "belongs_to / has_many", "activerecord"],
  ["transactions", "Transacciones & atomicidad", "activerecord"],
  ["scopes", "Scopes", "activerecord"],
  ["n_plus_one", "N+1 queries", "activerecord"],
  ["eager_loading", "Eager loading", "activerecord"],
  ["assoc_through", "has_many :through", "activerecord"],
  ["service_object", "Service Object", "patterns"],
  ["case_checkout", "Caso: checkout de una orden", "patterns"],
  ["query_object", "Query Object", "patterns"],
  ["case_reporting", "Caso: reporte filtrable", "patterns"],
  ["form_object", "Form Object", "patterns"],
  ["case_signup", "Caso: registro multi-modelo", "patterns"],
  ["callbacks", "Callbacks vs flujo explícito", "patterns"],
  ["jobs_mailers", "Active Job & Mailer", "patterns"],
  ["strategy_pattern", "Strategy Pattern", "patterns"],
  ["adapter_pattern", "Adapter para integraciones", "patterns"],
  ["sti", "Single Table Inheritance", "sti"],
  ["sti_tradeoffs", "Trade-offs de STI", "sti"],
  ["polymorphic", "Polymorphic associations", "sti"],
  ["case_content", "Caso: comentarios reutilizables", "sti"],
  ["api_mode", "Rails API-only + React", "infra"],
  ["serialization_cors", "JSON, serializers & CORS", "infra"],
  ["auth_security", "Auth, autorización & seguridad", "infra"],
  ["react_rails_auth", "Auth React + Rails con tokens", "infra"],
  ["asset_pipeline", "Asset pipeline & fingerprinting", "assets"],
  ["modern_assets", "Webpacker → opciones modernas", "assets"],
  ["rspec_basics", "RSpec: sintaxis & mindset", "testing"],
  ["factory_bot", "FactoryBot", "testing"],
  ["spec_types", "Model, service & request specs", "testing"],
  ["gemfile", "Gemfile & Bundler", "infra"],
  ["env_logger", "Credentials, ENV & logging", "infra"],
];

// Ruta cerrada de alta prioridad para la entrevista: core → datos → diseño → temas explícitamente pedidos.
const PRIORITY_ORDER = [
  "ruby_basics", "mvc", "rack", "routing_rest", "controllers_params", "responses_errors",
  "ar_pattern", "ar_orm", "migrations", "validations", "assoc_belongs", "transactions",
  "scopes", "n_plus_one", "eager_loading", "assoc_through",
  "service_object", "query_object", "case_reporting", "form_object", "strategy_pattern", "adapter_pattern",
  "jobs_mailers", "callbacks", "case_checkout", "case_signup",
  "sti", "sti_tradeoffs", "polymorphic", "case_content",
  "api_mode", "serialization_cors", "auth_security", "react_rails_auth",
  "asset_pipeline", "modern_assets",
  "rspec_basics", "factory_bot", "spec_types", "gemfile", "env_logger",
];

// Solo dependencias pedagógicas reales. Las comparaciones se explican dentro de cada lección.
const PREREQUISITES = {
  ruby_basics: [],
  mvc: ["ruby_basics"],
  rack: ["mvc"],
  routing_rest: ["rack"],
  controllers_params: ["routing_rest"],
  responses_errors: ["controllers_params"],
  ar_pattern: ["mvc"],
  ar_orm: ["ar_pattern"],
  migrations: ["ar_orm"],
  validations: ["migrations"],
  assoc_belongs: ["ar_orm"],
  transactions: ["ar_orm"],
  scopes: ["ar_orm"],
  n_plus_one: ["assoc_belongs"],
  eager_loading: ["n_plus_one"],
  assoc_through: ["assoc_belongs"],
  service_object: ["controllers_params", "transactions"],
  case_checkout: ["service_object", "transactions", "adapter_pattern", "jobs_mailers"],
  query_object: ["scopes"],
  case_reporting: ["query_object", "eager_loading"],
  form_object: ["service_object", "validations"],
  case_signup: ["form_object", "transactions", "jobs_mailers"],
  jobs_mailers: ["service_object"],
  callbacks: ["ar_orm", "jobs_mailers"],
  strategy_pattern: ["service_object"],
  adapter_pattern: ["service_object"],
  sti: ["assoc_belongs"],
  sti_tradeoffs: ["sti"],
  polymorphic: ["assoc_belongs"],
  case_content: ["polymorphic"],
  api_mode: ["responses_errors", "ar_orm"],
  serialization_cors: ["api_mode"],
  auth_security: ["controllers_params", "api_mode"],
  react_rails_auth: ["auth_security", "serialization_cors"],
  asset_pipeline: ["mvc"],
  modern_assets: ["asset_pipeline"],
  rspec_basics: ["ar_orm"],
  factory_bot: ["rspec_basics", "migrations"],
  spec_types: ["rspec_basics", "controllers_params"],
  gemfile: ["ruby_basics"],
  env_logger: ["gemfile"],
};

const PRIORITY = new Map(PRIORITY_ORDER.map((id, index) => [id, index + 1]));
const INTERVIEW_LESSON_OVERRIDES = {
  mvc: {
    ...LESSONS.mvc,
    summary: "Rails combina MVC con Convention over Configuration: nombres y ubicaciones conectan rutas, controllers, modelos, tablas y vistas.",
    why: "Ya conocés MVC; lo importante para la entrevista es explicar cómo las convenciones reducen configuración y aceleran el desarrollo, a cambio de tener que conocer los defaults.",
    codeLabel: "Primera pieza de MVC, sin entrar aún en base de datos",
    code: `# config/routes.rb
resources :posts, only: :index

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @page_title = "Posts"
    # Rails busca views/posts/index.html.erb por convención
  end
end

# El modelo y Active Record se estudian en la siguiente rama.`,
    steps: [
      ...LESSONS.mvc.steps,
      "Post usa la tabla posts, PostsController#index busca views/posts/index.html.erb y la primary key esperada es id, salvo configuración explícita.",
    ],
    pitfalls: [
      ...LESSONS.mvc.pitfalls,
      "Romper convenciones sin una razón agrega configuración y hace que una app Rails sea menos predecible.",
    ],
    takeaway: "MVC separa responsabilidades; las convenciones hacen que esas piezas se encuentren con muy poca configuración.",
  },
  rack: {
    ...LESSONS.rack,
    summary: "Rack es la capa que conecta el servidor web con Rails. Está antes del router y hace posible que la request atraviese middleware antes de llegar a tu controller.",
    why: "Pensalo como el equivalente Ruby del mundo PSR-15 que ya conocés: una cadena de middleware recibe una request, puede actuar sobre ella y delega al siguiente componente.",
    codeLabel: "Dónde aparece Rack en una request real",
    code: `Browser: GET /orders/42
  ↓
Nginx / Puma (recibe HTTP)
  ↓
Rack middleware (cookies, sesión, CSRF, logs...)
  ↓
Rails router → OrdersController#show
  ↓
Rack devuelve [status, headers, body]
  ↓
Browser recibe la respuesta`,
    steps: [
      "El browser manda una request HTTP; un servidor como Puma la recibe. Rails no es el servidor web en sí.",
      "Rack define el contrato común para entregar esa request a una app Ruby: recibe env y devuelve [status, headers, body].",
      "Antes del router, la request cruza un stack de middleware: cookies, sesión, autenticación, CSRF, logging o CORS.",
      "Cada middleware puede modificar la request, devolver una respuesta temprano o delegar a la siguiente capa.",
      "Rails es una Rack app: cuando la cadena llega a Rails, su router decide qué controller/action ejecutar.",
    ],
    pitfalls: [
      "Rack no es el router ni el servidor web; es la interfaz que permite conectarlos con la aplicación.",
      "El orden del middleware importa: una capa solo puede usar lo que una capa anterior ya preparó.",
      "Un middleware puede cortar el flujo —por ejemplo, devolver 401 antes de que se ejecute el controller—.",
    ],
    takeaway: "Para explicarlo en entrevista: Rack es el contrato y pipeline que lleva HTTP hasta Rails; Rails usa middleware antes de decidir la ruta y el controller.",
    diagramTitle: "Request lifecycle: desde el browser hasta Rails",
    diagram: [
      { label: "Browser", detail: "GET /orders/42" },
      { label: "Puma / Nginx", detail: "recibe HTTP" },
      { label: "Rack middleware", detail: "sesión, CSRF, logs" },
      { label: "Rails router", detail: "elige acción" },
      { label: "Controller", detail: "coordina respuesta" },
      { label: "HTTP response", detail: "status + headers + body" },
    ],
  },
  controllers_params: {
    ...LESSONS.controllers_params,
    codeLabel: "Aceptar solo la entrada permitida",
    code: `class ProfilesController < ApplicationController
  def preview
    render json: { accepted: profile_params }
  end

  private

  def profile_params
    params.require(:profile).permit(:name, :timezone)
  end
end`,
    steps: [
      "Por ahora no importa dónde se guarda el perfil: el objetivo es ver que el controller recibe una request y produce una respuesta.",
      "params contiene la entrada HTTP; require exige que exista profile y permit enumera los únicos campos que aceptamos.",
      "Más adelante, un controller real pasará esos datos permitidos a un modelo o a un Service Object.",
    ],
    takeaway: "Antes de hablar de modelos, entendé esta frontera: el controller decide qué entrada HTTP llega al resto de la aplicación.",
  },
  routing_rest: {
    ...LESSONS.routing_rest,
    codeLabel: "La forma más simple de declarar rutas de un recurso",
    code: `# config/routes.rb
Rails.application.routes.draw do
  resources :posts, only: %i[index show create update destroy]
end

# Rails crea automáticamente las rutas de la tabla de arriba.
# Por ahora ignorá member: es una extensión para más adelante.`,
    steps: [
      "Un recurso es una cosa del dominio que tiene una URL: posts, orders o users.",
      "resources :posts le pide a Rails que cree las rutas estándar para listar, ver uno, crear, actualizar y borrar posts.",
      "index, show y create no son palabras mágicas: son nombres convencionales de métodos dentro de PostsController.",
      "La tabla de rutas de arriba es lo importante. Una vez que la entendés, extensiones como member son solo rutas extra para una acción particular.",
    ],
    pitfalls: [
      "GET /posts y GET /posts/42 no son lo mismo: el primero pide una lista y el segundo pide un elemento concreto.",
      "REST es una convención útil para recursos; no obliga a forzar todas las acciones de negocio dentro de nombres CRUD.",
    ],
    takeaway: "Una ruta responde: para este verbo HTTP y esta URL, ¿qué método de controller se ejecuta?",
  },
  responses_errors: {
    ...LESSONS.responses_errors,
    codeLabel: "Responder HTTP sin depender todavía de la base",
    code: `def preview
  render json: { message: "accepted" }, status: :ok
rescue ActionController::ParameterMissing => error
  render json: { error: error.message }, status: :bad_request
end

# Más adelante:
# 201 create · 404 not found · 422 validation failure`,
    steps: [
      "Antes de Active Record, fijate en la forma: una acción termina devolviendo status, headers y body JSON o una redirección.",
      "Un error de entrada como un parámetro faltante se traduce a una respuesta 400, no a una página de error interna.",
      "Cuando incorpores modelos, las validaciones suelen devolver 422 y un registro ausente suele devolver 404.",
    ],
    takeaway: "El controller no solo ejecuta código: define el contrato HTTP observable por el cliente.",
  },
  rspec_basics: {
    ...LESSONS.rspec_basics,
    codeLabel: "Una spec sin depender aún de factories",
    code: `RSpec.describe Post, type: :model do
  describe "#title" do
    it "keeps the assigned title" do
      post = Post.new(title: "Rails")

      expect(post.title).to eq("Rails")
    end
  end
end`,
    steps: [
      "describe nombra el sujeto o comportamiento; it expresa el resultado esperado.",
      "Post.new usa el modelo que ya estudiaste, sin introducir FactoryBot antes de su propio nodo.",
      "expect compara un valor observable; una buena spec cuenta qué promete el código, no cómo está implementado por dentro.",
    ],
    takeaway: "Primero aprendé a leer una spec simple; FactoryBot solo reduce setup repetido después.",
  },
  case_reporting: {
    ...LESSONS.case_reporting,
    code: `class OrdersReportQuery
  def self.call(scope: Order.all, filters:, page: 1)
    scope.includes(:customer)
      .where(status: filters[:status])
      .order(created_at: :desc)
      .limit(50)
      .offset((page - 1) * 50)
  end
end

OrdersReportQuery.call(filters:, page: 2)`,
    steps: [
      "El controller entrega filtros ya permitidos y un scope autorizado; el Query Object arma una Relation todavía componible.",
      "limit y offset muestran la idea de paginación sin asumir una gem que todavía no estudiamos.",
      "includes evita una consulta extra por customer al serializar la página resultante; índices sostienen los filtros y el orden.",
    ],
  },
};

const CONCEPTUAL_CORRECTIONS = {
  ar_pattern: {
    explanation: "Active Record es el patrón que Rails usa para que un objeto Ruby represente una fila y también sepa leer o guardar esa fila. Por ejemplo, User.find(7) busca una fila de users y devuelve un User. Un Repository es una clase separada que encapsula acceso a datos; solo vale la pena si realmente oculta una decisión o una fuente de datos. Si UserRepository#find(id) hace únicamente User.find(id), el resto de la app sigue dependiendo de Active Record y ahora además debe atravesar otra clase que no agregó comportamiento, seguridad ni una interfaz distinta.",
    pitfalls: [
      "Un Repository es una frontera de persistencia separada del modelo. Tiene sentido si oculta una consulta compleja, combina fuentes de datos o permite cambiar una dependencia relevante.",
      "UserRepository.find(id) que solo delega a User.find(id) no agrega una frontera útil: no protege al dominio de nada ni simplifica una decisión; solo añade un salto y otro nombre que mantener.",
      "Active Record tampoco obliga a que todos los flujos vivan dentro de User u Order: las operaciones que coordinan varias entidades siguen pudiendo vivir en services.",
    ],
    takeaway: "Elegí una abstracción extra cuando cambia una dependencia o reduce una complejidad real, no solo porque existe un nombre de patrón.",
  },
  mvc: {
    explanation: "El controller no es el dueño general de las reglas de negocio. Es la frontera HTTP: recibe verbo, URL y params, verifica identidad y autorización, llama al caso de uso correcto y traduce el resultado a JSON, HTML o un status. El modelo representa una entidad del dominio y sus reglas cercanas a su propio estado; por ejemplo, Order puede saber si puede cancelarse. Cuando una operación coordina varios modelos, una transacción o un proveedor externo, un Service Object suele expresar mejor ese caso de uso. Dar forma específica a la respuesta para React corresponde a un serializer o presenter; el controller decide usarlo, pero no debería construir toda la lógica de formato.",
    tableTitle: "Controller, Model y Service",
    tableLabel: "La frontera HTTP no es el lugar de toda la lógica",
    table: {
      columns: ["Pieza", "Responsabilidad", "Ejemplo sano"],
      rows: [
        ["Controller", "Traducir HTTP hacia y desde el caso de uso.", "Lee order_params, autoriza y responde 201 o 422."],
        ["Model", "Estado, relaciones y reglas propias de una entidad.", "order.cancelable? o order.mark_paid!."],
        ["Service Object", "Coordinar un flujo que cruza entidades o sistemas.", "CheckoutOrder crea orden, items y coordina pago."],
        ["Serializer", "Elegir qué estructura JSON ve el cliente.", "OrderSerializer expone total, status y customer."],
      ],
    },
    steps: [
      "Un controller delgado tiene lógica de transporte: params permitidos, autenticación/autorización, elegir el caso de uso y mapear resultado a HTTP.",
      "Reglas que siguen siendo verdad sin importar si la orden se creó por web, consola, API o job pertenecen al modelo o a un objeto de dominio.",
      "Si la regla necesita coordinar Order, Inventory, una transacción y un pago externo, nombrá el flujo con un Service Object como CheckoutOrder.",
      "Para una API, un serializer/presenter prepara la estructura para el cliente; así no mezclás formato JSON con decisiones de dominio.",
    ],
    pitfalls: [
      "Un controller con cálculos de precio, cambios de estado, varios saves y llamadas a proveedores queda difícil de reutilizar y testear fuera de HTTP.",
      "No todo método va al modelo: si solo organiza una pantalla o cruza varios agregados, un modelo gordo también se vuelve confuso.",
      "La frase controller = lógica de negocio es demasiado amplia. En Rails, el controller coordina una request; la lógica de negocio vive lo más cerca posible de la regla que protege.",
    ],
    takeaway: "Pensá el controller como traductor HTTP, el modelo como guardián de su estado y el service como nombre explícito de un proceso de negocio.",
  },
  migrations: {
    explanation: "Una migración cambia la estructura compartida de la base de datos: tablas, columnas, índices y restricciones. Un backfill es un paso separado que completa un nuevo dato en filas que ya existían antes del cambio. Por ejemplo, si agregás users.timezone a una tabla con miles de usuarios, primero permitís temporalmente null, luego un job o tarea actualiza los registros antiguos por lotes y recién después exigís NOT NULL. Así el esquema y los datos viejos evolucionan sin asumir que la tabla empieza vacía.",
    steps: [
      "Para una tabla nueva, la migración puede crear columna, foreign key, índice y constraint desde el inicio.",
      "Para agregar un dato obligatorio a una tabla poblada, agregá primero una columna que acepte null o un default seguro.",
      "Backfill significa recorrer los registros existentes y llenar ese nuevo campo, idealmente en lotes para no bloquear una tabla grande durante demasiado tiempo.",
      "Cuando verificaste que no quedan datos inválidos, una migración posterior agrega NOT NULL, un índice único o la restricción que corresponda.",
    ],
    pitfalls: [
      "Una migración describe estructura; no es el lugar ideal para un proceso largo que actualiza millones de filas durante un deploy.",
      "Agregar una regla obligatoria antes del backfill puede hacer fallar el deploy porque las filas antiguas todavía no cumplen la regla.",
      "Un índice acelera lecturas y también puede hacer cumplir unicidad, pero agrega costo de espacio y de escritura.",
    ],
    takeaway: "Backfill = completar datos ya existentes después de agregar un campo; recién entonces endurecés la restricción del esquema.",
  },
  validations: {
    explanation: "Las validaciones del modelo dan errores entendibles antes de intentar guardar, pero no son una garantía suficiente cuando dos requests llegan al mismo tiempo. Una validación de unicidad pregunta si el valor parece libre; entre esa pregunta y el INSERT otra request puede guardar el mismo valor. La garantía final vive en la base de datos mediante un índice o constraint único. La aplicación conserva la validación para una buena experiencia y además maneja el rechazo de la base —por ejemplo ActiveRecord::RecordNotUnique— devolviendo un conflicto o un error claro.",
    codeLabel: "Validación para UX + restricción para concurrencia",
    code: `class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
end

# db/migrate/..._add_unique_email_to_users.rb
add_index :users, :email, unique: true

# Si dos requests pasan validates al mismo tiempo,
# la base acepta una y rechaza la otra con RecordNotUnique.`,
    steps: [
      "La validación del modelo corre dentro de la aplicación y permite mostrar mensajes como email ya está en uso antes de guardar.",
      "Con concurrencia, request A y request B pueden consultar casi al mismo tiempo y ambas ver que todavía no existe ese email.",
      "El índice unique de la base es el árbitro: solo deja confirmar una fila con ese valor aunque lleguen dos INSERT concurrentes.",
      "En el borde de la aplicación, capturá el conflicto esperado y devolvé un error apropiado; no dependas únicamente de validates uniqueness.",
    ],
    pitfalls: [
      "Validar unicidad sin un índice unique deja una carrera: puede haber duplicados bajo carga real.",
      "Un índice único no reemplaza mensajes de validación amigables; ambos cumplen funciones distintas.",
      "No metas una consulta manual de existe? en el controller creyendo que resuelve concurrencia: tiene la misma ventana de carrera.",
    ],
    takeaway: "Validación = feedback temprano. Constraint de base = integridad real, incluso cuando varias requests compiten.",
  },
  assoc_through: {
    explanation: "No: declarar has_many no crea ninguna tabla de forma automática. Las tablas siempre las crea una migración. Un has_many directo describe una relación uno-a-muchos usando una foreign key que ya existe: Post has_many :comments porque comments tiene post_id. has_many :through recorre un modelo intermedio que vos definís, como Enrollment, y por eso permite tratar esa relación como algo con datos propios: fecha, rol, estado o validaciones.",
    steps: [
      "Una migración crea posts, comments y la columna comments.post_id; recién entonces las asociaciones Ruby describen cómo navegar esos datos.",
      "has_many :comments lee muchos Comment cuya foreign key post_id apunta a este Post. No hay tabla oculta ni implícita.",
      "En Student → Enrollment → Course, Enrollment es un modelo y una tabla explícitos con student_id y course_id.",
      "has_many :courses, through: :enrollments le dice a Rails que llegue a los cursos atravesando esas inscripciones.",
    ],
    pitfalls: [
      "No confundas asociación Ruby con migración SQL: la primera declara navegación; la segunda crea y protege estructura.",
      "Usá un modelo intermedio cuando la relación tiene atributos o reglas. Si solo necesitás una relación simple, más abstracción puede ocultar innecesariamente el esquema.",
      "Agregá un índice único sobre student_id y course_id si una persona no puede inscribirse dos veces al mismo curso.",
    ],
    takeaway: "Rails nunca crea tablas al escribir has_many; through hace explícito el modelo que representa una relación importante.",
  },
  service_object: {
    explanation: "Un Service Object es una clase común de Ruby que nombra y ejecuta un caso de uso: checkout, cancelar suscripción o importar un CSV. call no es un método reservado de Rails ni una capacidad especial de los services; es una convención de Ruby. Cualquier clase puede definir def call, y usar Service.call(...) hace visible que la clase representa una acción. También los Proc/lambdas de Ruby tienen call, pero eso no convierte a cada call en un Service Object.",
    steps: [
      "Definí una entrada explícita con initialize, por ejemplo user:, cart: y payments:. initialize es lo más parecido a un constructor: se ejecuta al crear el objeto con .new.",
      "Guardá dependencias y datos en variables de instancia como @user. El @ es sintaxis Ruby para un dato que pertenece a esa instancia; no es Rails ni un nombre reservado.",
      "call ejecuta un flujo completo y devuelve un resultado o lanza un error que el controller traduce a HTTP.",
      "El controller puede hacer CheckoutOrder.new(...).call o la clase puede ofrecer self.call para abreviar. Las dos formas son convenciones de diseño.",
    ],
    pitfalls: [
      "No uses Service Object como carpeta genérica para cualquier método incómodo: debe tener un caso de uso con nombre claro.",
      "Un service que lee params o hace render sigue acoplado a HTTP; recibí datos ya permitidos y devolvé un resultado de dominio.",
      "call no otorga transacción, validación ni async por sí solo; cada una de esas decisiones debe escribirse explícitamente.",
    ],
    takeaway: "call es una convención de acción; un Service Object vale la pena cuando hace explícito un flujo de negocio que no pertenece a una sola entidad.",
  },
  form_object: {
    explanation: "Un Form Object es un tipo especializado de objeto de entrada: representa lo que un formulario o endpoint recibe, aunque esos campos terminen creando o modificando varias tablas. No es un modelo de base de datos y no tiene por qué ser un Service Object, aunque puede llamar a uno. Su trabajo principal es exponer atributos, validar una combinación de campos y reunir errors de una forma compatible con una pantalla. Un Service Object, en cambio, describe la operación de negocio y debería poder usarse sin conocer HTML, params o mensajes de formulario.",
    tableTitle: "Form Object y Service Object",
    tableLabel: "Ambos pueden participar en un flujo, pero tienen fronteras distintas",
    table: {
      columns: ["Objeto", "Entrada principal", "Responsabilidad"],
      rows: [
        ["Form Object", "Campos crudos de un formulario o endpoint.", "Validar el conjunto de campos y exponer errores para el usuario."],
        ["Service Object", "Datos ya preparados y dependencias de dominio.", "Ejecutar un caso de uso como registrar usuario o cobrar orden."],
      ],
    },
    steps: [
      "SignupForm puede aceptar email, password, name y timezone aunque User y Profile vivan en tablas diferentes.",
      "El form valida formato, presencia y reglas que involucran varios campos; si falla, el controller puede renderizar todos los errors juntos.",
      "Si es válido, el form llama a un service o ejecuta una transacción pequeña para crear User y Profile.",
      "Normalmente expone un flujo principal como submit o save; no es un modelo con métodos arbitrarios para todos los casos de la app.",
    ],
    pitfalls: [
      "No confundas Form Object con Active Record: incluir ActiveModel::Model aporta API de validaciones, no una tabla ni persistencia automática.",
      "No metas dentro del form reglas que deben mantenerse incluso si el usuario se crea desde consola, importación o API interna; esas reglas deben vivir más abajo.",
      "Un service no necesita saber cómo se llamó cada input del formulario; recibí un contrato limpio para que el caso de uso sea reutilizable.",
    ],
    takeaway: "Form Object adapta y valida entrada para una UX; Service Object ejecuta el proceso de negocio que puede existir sin ese formulario.",
  },
  query_object: {
    explanation: "Cuando necesitás SQL expresado como texto, los parámetros enlazados separan el texto fijo de la consulta de los valores del usuario. Rails manda el valor por separado al driver de base de datos, en lugar de pegarlo dentro del SQL. Así una búsqueda como %ana% se trata como dato, no como parte de la instrucción SQL. En Active Record, where con hash ya hace esto; para SQL textual usás un placeholder ? y pasás el valor como argumento separado.",
    codeLabel: "Búsqueda segura con un valor enlazado",
    code: `class CourseSearchQuery
  def self.call(term:)
    pattern = "%#{term}%"
    Course.where("courses.title ILIKE ?", pattern)
  end
end

# El ? es un placeholder: Rails envía pattern como dato.
# Nunca hagas: "title ILIKE '%#{params[:term]}%'"`,
    steps: [
      "La parte SQL escrita por vos define la estructura permitida: courses.title ILIKE ?.",
      "El signo ? es un placeholder; pattern se envía separado y el driver lo trata como valor, incluso si contiene comillas o texto malicioso.",
      "where(status: filters[:status]) es la variante con hash y también usa valores seguros sin que escribas el placeholder.",
      "Si querés ordenar por una columna elegida por el usuario, no la interpolés: elegila desde una lista cerrada de nombres permitidos.",
    ],
    pitfalls: [
      "Interpolar significa insertar texto dentro de otro texto. En SQL, construir `WHERE title = '#{params[:title]}'` deja que la entrada del usuario cambie la instrucción que entiende la base.",
      "Usá placeholders: `where(\"title ILIKE ?\", pattern)` mantiene la instrucción fija y envía pattern como dato separado y escapado.",
      "Los valores se pueden enlazar; los nombres de columnas no. Para ordenar, elegí entre columnas permitidas en código, por ejemplo { newest: :created_at, price: :price_cents }.",
    ],
    takeaway: "Parameter binding significa que el SQL define la instrucción y el usuario solo aporta datos; nunca construyas la instrucción pegando texto del usuario.",
  },
  case_reporting: {
    explanation: "En este caso scope no significa el método scope de un modelo: es solo un nombre para una Relation inicial, por ejemplo current_user.orders. Esa Relation ya limita qué órdenes puede ver la persona y luego el Query Object le agrega filtros y orden. includes(:customer) se relaciona con N+1 porque el reporte finalmente recorre las órdenes para armar JSON: si dentro de ese loop lee order.customer.name, sin includes Rails puede hacer una consulta extra por cada customer no cargado. includes pide por adelantado los customers de la página y evita ese patrón.",
    codeLabel: "Scope autorizado + includes antes del loop de serialización",
    code: `authorized_scope = current_user.orders

orders = OrdersReportQuery.call(
  scope: authorized_scope,
  filters: report_params,
  page: params.fetch(:page, 1).to_i,
)

orders.each do |order|
  order.customer.name # sin includes: posible query extra por orden
end`,
    steps: [
      "El controller construye authorized_scope = current_user.orders. Es una Relation: una consulta todavía no ejecutada que además protege autorización.",
      "El Query Object compone filtros, orden, limit/offset e includes sobre esa Relation sin cargarla demasiado pronto.",
      "El N+1 aparece al serializar: el loop recorre 50 orders y leer order.customer dispara hasta 50 SELECT adicionales si customer no estaba precargado.",
      "includes(:customer) hace que Rails cargue esas relaciones de forma anticipada; verificá el SQL o las métricas porque el plan concreto depende de la consulta.",
    ],
    pitfalls: [
      "scope aquí es una variable con una Relation, no la macro scope :published, -> { ... }. Ambas usan la idea de consulta componible, pero no son lo mismo.",
      "includes no es decoración: agregalo porque sabés qué relación leerá el serializer o la vista en un loop.",
      "Precargar relaciones enormes que no vas a mostrar también cuesta memoria y queries; elegí solo lo que esa página consume.",
    ],
    related: ["scopes", "n_plus_one", "eager_loading"],
    takeaway: "Autorizá con el scope inicial, componé la Relation y precargá exactamente la relación que el loop de JSON va a leer.",
  },
  strategy_pattern: {
    explanation: "@strategy es simplemente un nombre elegido por quien escribió la clase. El prefijo @ indica una variable de instancia Ruby: un dato guardado dentro de ese ShippingCalculator; podrías llamarla @shipping_rule, aunque @strategy comunica el patrón. initialize es lo más parecido a un constructor en PHP o JavaScript: Ruby lo ejecuta al hacer ShippingCalculator.new(strategy: ExpressShipping.new). Luego call es el punto de entrada convencional que delega al algoritmo elegido con @strategy.price_for(order).",
    codeLabel: "Flujo real: elegir modalidad y calcular",
    code: `# 1. El controller recibe shipping_method: "express"
strategy = ExpressShipping.new

# 2. Construye el objeto que usa esa estrategia
calculator = ShippingCalculator.new(strategy: strategy)

# 3. El caso de uso calcula el precio
price = calculator.call(order)

# @strategy es solo una variable de instancia con un buen nombre.`,
    steps: [
      "El controller o un factory traduce un dato permitido como express a una estrategia concreta. No aceptes nombres de clases enviados por el usuario.",
      "ShippingCalculator.new(strategy: ExpressShipping.new) ejecuta initialize y guarda ese objeto en @strategy.",
      "calculator.call(order) ejecuta la lógica estable: pide a la estrategia elegida price_for(order).",
      "ExpressShipping, StandardShipping y Pickup implementan el mismo mensaje price_for, cada uno con su algoritmo y tests propios.",
    ],
    pitfalls: [
      "@strategy no es API de Rails ni una palabra reservada: es sintaxis Ruby y un nombre elegido por el programador.",
      "initialize construye/prepara la instancia; call ejecuta el caso de uso. Ninguno es mágico más allá de la convención de Ruby para initialize.",
      "No extraigas Strategy para un if fijo y pequeño. Usalo cuando las variantes cambian, crecen o se prueban y despliegan con independencia conceptual.",
    ],
    mermaid: `flowchart LR
      A["Checkout recibe express"] --> B["Factory elige ExpressShipping"]
      B --> C["ShippingCalculator.new(strategy: ...)"]
      C --> D["calculator.call(order)"]
      D --> E["@strategy.price_for(order)"]
      E --> F["Precio de envío"]`,
    takeaway: "Strategy separa qué algoritmo se usa de quién necesita el resultado; @strategy es solo el objeto elegido y call es una convención de acción.",
  },
  jobs_mailers: {
    explanation: "Active Job es el framework e interfaz de Rails para definir y encolar trabajo asíncrono. ApplicationJob es una clase de tu aplicación que normalmente hereda de ActiveJob::Base; funciona como una base intermedia donde podrías poner configuración compartida para todos tus jobs. Por eso OrderPaidJob < ApplicationJob sigue siendo un Active Job indirectamente. perform es el método que la cola ejecutará más tarde cuando tome el job; perform_later lo encola durante la request.",
    steps: [
      "ActiveJob::Base aporta la integración con colas; Sidekiq, Solid Queue u otro adapter hacen el trabajo de ejecutarlo en segundo plano.",
      "ApplicationJob < ActiveJob::Base es una clase base de tu proyecto. Heredar de ella evita repetir configuración en cada job.",
      "OrderPaidJob < ApplicationJob define perform(order_id). Cuando un worker lo toma, Rails llama perform con ese ID.",
      "perform_later(order.id) no llama perform en ese instante: agrega un mensaje a la cola para que otro proceso lo ejecute después.",
    ],
    pitfalls: [
      "No confundas la interfaz general Active Job con ApplicationJob: la segunda es tu subclase base; la primera es el framework de Rails.",
      "Pasá IDs y recargá datos al ejecutar porque el job puede correr minutos después, cuando el objeto original ya cambió.",
      "Un job puede reintentarse; hacé que enviar un efecto o actualizar un estado sea seguro ante más de una ejecución.",
    ],
    takeaway: "Active Job define el sistema; ApplicationJob es la base de tu app; perform es la entrada que la cola ejecuta más tarde.",
  },
  polymorphic: {
    explanation: "Una asociación polimórfica no es lo mismo que un many-to-many. Many-to-many significa que muchos registros de A se relacionan con muchos de B mediante una tabla intermedia con dos foreign keys concretas, por ejemplo posts ↔ tags mediante post_tags. Polimorfismo significa que un registro tiene un dueño de uno entre varios tipos posibles: Comment puede pertenecer a un Post o a un Video, pero cada comentario apunta a un solo commentable a la vez. La tabla comments guarda commentable_type = \"Post\" y commentable_id = 7, o type = \"Video\" y otro id.",
    codeLabel: "Autor y recurso comentado son relaciones distintas",
    code: `class Comment < ApplicationRecord
  belongs_to :user       # quién escribió el comentario
  belongs_to :commentable, polymorphic: true # sobre qué se escribió
end

class Post < ApplicationRecord
  has_many :comments, as: :commentable
end

class Video < ApplicationRecord
  has_many :comments, as: :commentable
end

# comment.commentable puede ser Post o Video.
# comment.user siempre es el autor concreto.`,
    tableTitle: "Polimorfismo versus many-to-many",
    tableLabel: "Dos problemas de modelado diferentes",
    table: {
      columns: ["Relación", "Qué significa", "Ejemplo"],
      rows: [
        ["Polimórfica", "Un registro apunta a un tipo entre varios posibles.", "Comment → Post o Video."],
        ["Many-to-many", "Muchos registros de A se conectan con muchos de B.", "Post ↔ Tag mediante post_tags."],
        ["Autoría", "Un usuario escribe muchos comentarios.", "User has_many :comments."],
      ],
    },
    steps: [
      "Commentable es el nombre conceptual del objeto comentado; no es un modelo único, sino el rol que pueden cumplir Post, Video o Ticket.",
      "user_id y commentable_type/commentable_id responden preguntas distintas: quién escribió y sobre qué recurso escribió.",
      "No necesitás User como tabla puente entre Post, Video y Comment: el usuario es el autor del comentario, no el vínculo que decide el recurso comentado.",
      "Si un usuario necesita ver sus comentarios, User has_many :comments alcanza. Si Post necesita sus comentarios, Post has_many :comments, as: :commentable alcanza.",
    ],
    pitfalls: [
      "Polimorfismo suele ser uno-a-muchos por cada tipo dueño: un Post tiene muchos Comments y cada Comment tiene un solo dueño. No implica muchos-a-muchos.",
      "Una foreign key tradicional dice `comments.post_id REFERENCES posts(id)`. En una asociación polimórfica no hay una única tabla destino: el destino cambia según commentable_type.",
      "La base puede comprobar que commentable_id es un número, pero no puede comprobar con una foreign key tradicional que el id exista en posts cuando type es Post o en videos cuando type es Video.",
      "La aplicación debe validar el recurso y autorizarlo; también conviene definir qué ocurre al borrar un Post/Video. Si la integridad es crítica, asociaciones explícitas separadas pueden ser más seguras.",
    ],
    takeaway: "Polimorfismo reutiliza una capacidad para tipos distintos; many-to-many conecta dos conjuntos mediante una unión. El usuario puede ser autor sin ser tabla puente.",
  },
  case_content: {
    explanation: "Para comentarios, el modelo natural es `Comment belongs_to :user` para representar al autor y `Comment belongs_to :commentable, polymorphic: true` para representar el recurso comentado. Un comentario no necesita una relación many-to-many: tiene un autor y un destino. User no conecta Post con Video; simplemente identifica quién escribió. Si mañana además querés mencionar usuarios o compartir comentarios entre varios recursos, eso sería otra necesidad y podría requerir otra relación, pero no conviene agregarla al modelo original sin una regla de negocio real.",
    codeLabel: "Comentarios: autor + recurso destino",
    code: `class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :commentable, polymorphic: true

  validates :body, presence: true
end

# La migración tendría, conceptualmente:
# comments.user_id
# comments.commentable_type
# comments.commentable_id

# La base puede proteger user_id si apunta a users.
# No puede declarar una sola FK para posts y videos a la vez.`,
    steps: [
      "La request recibe commentable_type/id, pero el servidor debe convertirlos en un recurso permitido y comprobar que el usuario puede comentarlo.",
      "Comment guarda el user_id del autor y el par type/id del objeto comentado; son dos relaciones independientes dentro del mismo registro.",
      "La foreign key user_id → users.id sí puede ser tradicional porque siempre apunta a users.",
      "Para commentable, la aplicación valida existencia y autorización. Si se borra el Post, una política explícita puede borrar sus comentarios o conservarlos anonimizados.",
    ],
    pitfalls: [
      "No agregues User como `through` solo porque aparece en el escenario: un through representa una ruta real de tablas, no cualquier entidad relacionada.",
      "Si el negocio necesita la máxima integridad referencial y solo existen Post y Video, dos asociaciones explícitas pueden ser preferibles a polimorfismo.",
      "Si hay muchos tipos y la capacidad transversal es estable, polimorfismo reduce tablas repetidas, pero aceptás más responsabilidad en código y procesos de borrado.",
    ],
    takeaway: "El comentario tiene autor y destino; ninguno de esos dos roles convierte automáticamente la relación en many-to-many.",
  },
  auth_security: {
    explanation: "CSRF significa Cross-Site Request Forgery, o falsificación de requests entre sitios. El problema aparece cuando Rails autentica mediante cookie: el navegador adjunta esa cookie automáticamente incluso si una página maliciosa intenta enviar una request a tu app. Rails genera un token secreto asociado a la sesión; el formulario o frontend legítimo lo envía en la request y Rails rechaza una mutación sin el token correcto. CORS no reemplaza CSRF: CORS limita qué JavaScript de otro origen puede leer respuestas, mientras CSRF protege que un sitio malicioso no consiga ejecutar cambios usando tus cookies.",
    codeLabel: "CSRF en una app Rails con cookie de sesión",
    code: `# Rails incluye un token en un formulario HTML
<%= form_with model: @order do |form| %>
  ...
<% end %>

# Si Rails sirve el HTML, csrf_meta_tags lo deja en un meta tag.
# Si React está separado, un endpoint puede entregar el token:
class CsrfController < ApplicationController
  def show
    render json: { csrf_token: form_authenticity_token }
  end
end

# React obtiene /csrf primero y luego envía el token.
fetch("https://api.example.com/orders", {
  method: "POST",
  credentials: "include", # adjunta la cookie de sesión
  headers: { "X-CSRF-Token": csrfToken, "Content-Type": "application/json" },
  body: JSON.stringify(orderData)
})`,
    steps: [
      "El usuario inicia sesión y Rails guarda una sesión en una cookie. El navegador enviará esa cookie automáticamente a requests hacia ese dominio.",
      "Un sitio malicioso podría intentar hacer POST /orders desde otra página; la cookie podría viajar, pero no debería conocer el token CSRF que Rails espera.",
      "El frontend legítimo obtiene el token del meta tag o de un endpoint /csrf y lo envía en el formulario o header; Rails verifica que coincida antes de aceptar la mutación.",
      "El token se asocia a la sesión. Según el session store, esa sesión puede vivir en una cookie cifrada/firmada, Redis o la base; no existe necesariamente una tabla csrf_tokens.",
      "Una app Rails API-only no trae sesiones y protección CSRF activadas como una app web tradicional; si usás cookies, tenés que habilitar/configurar ese soporte.",
      "Si la API usa exclusivamente `Authorization: Bearer ...` y no una cookie automática para autenticar la request, el riesgo CSRF cambia; siguen siendo importantes XSS, expiración y almacenamiento seguro del token.",
    ],
    pitfalls: [
      "CSRF no significa que alguien robó la contraseña: significa que un sitio externo intenta aprovechar una sesión que el navegador ya tiene abierta.",
      "CORS no autentica ni impide por sí solo que un formulario HTML envíe una request; su función principal es controlar lectura desde JavaScript del navegador.",
      "No desactives la protección CSRF globalmente sin entender qué endpoints usan cookies. Para un endpoint con cookie, preferí token, SameSite apropiado y verificación del origen cuando corresponda.",
    ],
    takeaway: "Cookie automática implica pensar en CSRF; Bearer en header cambia ese riesgo, pero no elimina seguridad: todavía hay que proteger tokens, sesión, autorización y XSS.",
  },
  react_rails_auth: {
    explanation: "Un flujo común cuando React y Rails están separados es usar un access token corto para las requests y un refresh token de mayor duración para obtener otro cuando el primero vence. Rails autentica al usuario en login, devuelve el access token y guarda de forma revocable el refresh token —idealmente solo su hash—. React manda `Authorization: Bearer <access_token>` a cada endpoint. Cuando Rails responde 401 por expiración, React llama a refresh, Rails rota el refresh token y devuelve un access token nuevo; React reintenta una sola vez la request original. Logout revoca el refresh token. El access token puede vivir en memoria para reducir exposición; un refresh token en cookie HttpOnly debe acompañarse de protección CSRF porque la cookie se envía automáticamente.",
    codeLabel: "Ida y vuelta: login, request, refresh y logout",
    code: `// React: login
const response = await fetch(API_URL + "/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // si refresh vive en cookie HttpOnly
  body: JSON.stringify({ email, password })
});
const { access_token } = await response.json();

// React: request autenticada
fetch(API_URL + "/orders", {
  headers: { Authorization: "Bearer <access_token>" }
});

// Rails, conceptualmente
def show
  user = authenticate_access_token! # firma + expiración + user_id
  order = user.orders.find(params[:id]) # autorización por alcance
  render json: OrderSerializer.new(order)
end

// Si llega 401 por expiración:
// 1. POST /auth/refresh con la cookie HttpOnly
// 2. Rails rota/verifica refresh y devuelve access token nuevo
// 3. React reintenta la request original una sola vez`,
    tableTitle: "Qué viaja en cada paso",
    tableLabel: "Separar identidad, autorización y renovación",
    table: {
      columns: ["Momento", "Cliente React", "Rails"],
      rows: [
        ["Login", "Envía email/password por HTTPS.", "Verifica credenciales y crea tokens."],
        ["Request normal", "Envía Bearer access token.", "Valida firma/expiración y obtiene current_user."],
        ["Recurso", "Lee JSON o recibe 401/403.", "Autoriza el recurso antes de responder."],
        ["Refresh", "Pide token nuevo con refresh.", "Verifica/rota refresh y devuelve access corto."],
        ["Logout", "Descarta access local.", "Revoca refresh para impedir nuevas sesiones."],
      ],
    },
    steps: [
      "Login: React envía credenciales por HTTPS; Rails verifica password con bcrypt/Devise y no devuelve la password ni un secreto permanente.",
      "Rails genera un access token de vida corta y un refresh token. El servidor debería poder revocar el refresh token guardando una referencia o hash en la base.",
      "En cada request, React agrega el access token en Authorization. Rails valida firma, expiración y usuario; después aplica autorización, por ejemplo current_user.orders.find(id).",
      "Si el access expira, Rails devuelve 401. Un interceptor de React llama una sola vez a refresh, actualiza el access token y reintenta la request original; evita loops infinitos.",
      "Logout revoca el refresh token del servidor y elimina el access token local. Un access token ya emitido puede seguir siendo válido hasta expirar, por eso debe durar poco.",
    ],
    pitfalls: [
      "No confundas autenticación —quién sos— con autorización —qué recurso podés usar—. Un token válido no autoriza acceder a cualquier order id.",
      "Guardar tokens largos en localStorage es cómodo pero aumenta el impacto de XSS. Una alternativa común es access token en memoria y refresh token HttpOnly/Secure, con CSRF para el endpoint basado en cookie.",
      "CORS debe permitir explícitamente el origen de React y headers/métodos necesarios; no debe usarse como sustituto de autenticación ni autorización.",
      "Elegí una estrategia coherente con la infraestructura y la librería de auth. El flujo conceptual importa más que memorizar una implementación casera de JWT.",
    ],
    mermaid: `flowchart TD
      A["React: POST /login"] --> B["Rails verifica credenciales"]
      B --> C["access token corto + refresh token"]
      C --> D["React guarda access en memoria\nrefresh en cookie HttpOnly"]
      D --> E["GET /orders\nAuthorization: Bearer"]
      E --> F["Rails valida token\nautorización"]
      F -->|"200"| G["JSON para React"]
      F -->|"401 expirado"| H["POST /auth/refresh\ncon cookie"]
      H --> I["Rails rota refresh\ny devuelve access nuevo"]
      I --> E
      H -->|"revocado/inválido"| J["Logout + login requerido"]`,
    diagramTitle: "Autenticación React + Rails: ida y vuelta completa",
    related: ["api_mode", "serialization_cors", "auth_security"],
    takeaway: "El access token identifica una request corta; el refresh renueva la sesión; Rails todavía debe autorizar cada recurso y proteger cualquier flujo basado en cookies.",
  },
  modern_assets: {
    explanation: "Un bundler de JavaScript es una herramienta que sigue los imports de módulos, reúne muchos archivos en uno o varios bundles, transpila sintaxis si hace falta y suele minificar el resultado para producción. Por ejemplo, si app.js importa React, ReactDOM y tus componentes, esbuild/Webpack/Rollup recorren ese grafo y generan archivos que el navegador puede descargar eficientemente. jsbundling-rails no es un bundler distinto: es una integración de Rails que instala y ejecuta un bundler externo como esbuild, Rollup o Webpack. Import Maps es otra estrategia: en vez de agrupar todo, mapea nombres como `react` a URLs de módulos que el navegador carga directamente. Si React está separado de Rails, normalmente Vite o su bundler pertenece al proyecto React y Rails solo entrega JSON.",
    codeLabel: "Tres estrategias expresadas en el flujo de build",
    code: `// app/javascript/application.js
import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./Dashboard";

// Bundler (esbuild/Rollup/Webpack) sigue estos imports y produce:
// public/assets/application-[hash].js

// importmap-rails usa un mapa de URLs, sin bundle de módulos:
// pin "react", to: "https://ga.jspm.io/npm:react@..."

// React separado:
// Vite genera el build del frontend.
// Rails sirve API JSON y no necesita compilar esos módulos.`,
    steps: [
      "El código fuente usa módulos pequeños con import/export, pero el navegador necesita saber de dónde sale cada módulo.",
      "Un bundler sigue ese grafo de imports, combina o divide archivos, transforma sintaxis y genera artefactos optimizados para producción.",
      "jsbundling-rails conecta Rails con una herramienta externa; elegís esbuild por simplicidad, Rollup/Webpack por necesidades específicas, pero el trabajo lo hace esa herramienta.",
      "Import Maps evita el paso de bundling para ciertos proyectos: el navegador resuelve cada módulo desde una URL fijada.",
      "Con React separado, el build de React vive normalmente en Vite/Webpack del frontend y el asset pipeline de Rails no es responsable de ese bundle.",
    ],
    pitfalls: [
      "No digas que jsbundling es una librería que reemplaza a Webpack: es una integración Rails para ejecutar una herramienta de bundling.",
      "No confundas fingerprinting de Sprockets con bundling: el primero ayuda a cachear archivos; el segundo resuelve y transforma módulos JavaScript.",
      "La estrategia depende de la generación de Rails y de si React vive dentro del repo Rails o en una aplicación separada.",
    ],
    takeaway: "Bundler = recorre imports y produce JavaScript distribuible; jsbundling-rails integra uno en Rails; Import Maps evita agrupar cuando el proyecto lo permite.",
  },
  case_signup: {
    explanation: "Una fila es un registro concreto dentro de una tabla de base de datos: una fila de users guarda un usuario y una fila de profiles guarda el perfil asociado. El formulario de registro no representa solamente una de esas filas: junta campos de ambos, como email, password, nombre y zona horaria, y su éxito significa que todas las piezas fueron creadas coherentemente. Por eso modelamos el flujo de entrada con SignupForm: la unidad que el usuario entiende es registrarme, no insertar una fila aislada en users.",
    codeLabel: "Flujo completo: request → Form Object → transacción → job",
    code: `class SignupController < ApplicationController
  def create
    form = SignupForm.new(signup_params)
    return render json: { errors: form.errors }, status: :unprocessable_entity unless form.submit

    render json: { id: form.user.id }, status: :created
  end
end

class SignupForm
  include ActiveModel::Model
  attr_accessor :email, :password, :name, :timezone
  attr_reader :user
  validates :email, :password, :name, :timezone, presence: true

  def submit
    return false unless valid?

    @user = User.transaction do
      user = User.create!(email:, password:)
      user.create_profile!(name:, timezone:)
      user.create_preference!(newsletter: true)
      user
    end # aquí las tres filas ya hicieron commit

    WelcomeJob.perform_later(@user.id) # efecto posterior al commit
    true
  end
end`,
    steps: [
      "El controller recibe HTTP, permite campos y crea SignupForm. Todavía no se escribe en la base.",
      "SignupForm valida una entrada que cruza modelos. Si name falta, devuelve errors para el usuario sin crear ni User ni Profile.",
      "Si todo es válido, la transacción crea tres registros: una fila en users, una en profiles y una en preferences.",
      "Si create_profile! falla, Rails hace rollback: deshace también la fila User creada dentro de la misma transacción. No queda una cuenta incompleta.",
      "Después del commit se encola WelcomeJob con el ID. El worker recarga al usuario y el mailer arma/envía el email fuera de la request.",
    ],
    pitfalls: [
      "Una transacción protege solo esas escrituras SQL. No puede des-enviar un email; por eso el job se encola después de que el commit fue exitoso.",
      "Podrías encolar con un callback after_create_commit en User. Funciona porque corre tras el commit, pero es menos visible; para un flujo de entrevista, encolarlo explícitamente al final del caso de uso suele comunicar mejor el recorrido.",
      "Las reglas que siempre debe cumplir User siguen viviendo en User. SignupForm solo reúne y valida la entrada particular del registro multi-modelo.",
    ],
    mermaid: `flowchart TD
      A["POST /signup"] --> B["SignupController\nstrong params"]
      B --> C["SignupForm\nemail, password, name, timezone"]
      C --> D{"valid?"}
      D -->|"no"| E["422 + errors\nsin escrituras"]
      D -->|"sí"| F["Transacción SQL"]
      F --> G["users\nuna fila User"]
      G --> H["profiles\nuna fila Profile"]
      H --> I["preferences\nuna fila Preference"]
      I --> J["COMMIT\nlas tres persisten juntas"]
      J --> K["WelcomeJob.perform_later(user.id)"]
      K --> L["Worker → Mailer\nemail de bienvenida"]`,
    diagramTitle: "Registro multi-modelo: ninguna cuenta queda a medias",
    related: ["form_object", "validations", "transactions", "jobs_mailers"],
    takeaway: "Modelá SignupForm porque registrarse es un flujo de entrada que produce varias filas relacionadas; no es simplemente crear una fila User.",
  },
  case_checkout: {
    explanation: "Checkout es un caso de uso porque una sola intención del usuario —comprar— cruza varias fronteras. Primero la aplicación persiste una orden pending y sus items de forma atómica en su propia base. Después habla con el proveedor de pagos, que está fuera de esa transacción SQL. Finalmente guarda el resultado paid o failed y agenda el efecto posterior. Las invariantes son condiciones que nunca deberían romperse, por ejemplo una orden pagada debe tener items y un importe consistente. Las fallas parciales aparecen porque el pago puede aprobarse aunque luego falle guardar paid; por eso usamos estados, reintentos e idempotencia.",
    tableTitle: "Fronteras del checkout",
    tableLabel: "Qué se puede confirmar junto y qué puede fallar por separado",
    table: {
      columns: ["Etapa", "Resultado durable", "Falla a contemplar"],
      rows: [
        ["Transacción 1", "Order pending + OrderItems quedan juntos o no queda nada.", "Item inválido o falta de stock: rollback."],
        ["Pago externo", "El proveedor acepta o rechaza el cobro.", "Timeout: quizá cobró, pero tu app no recibió respuesta."],
        ["Transacción 2", "Order pasa a paid/failed y guarda el id externo.", "Pago aprobado pero falla actualizar la base."],
        ["Job/Mailer", "Se procesa confirmación tras el commit.", "El job puede reintentarse; no enviar dos confirmaciones."],
      ],
    },
    codeLabel: "Orquestación explícita con dos fronteras SQL",
    code: `class OrdersController < ApplicationController
  def create
    order = CheckoutOrder.new(user: current_user, cart: current_cart,
                              payments: StripePaymentAdapter.new).call
    render json: OrderSerializer.new(order), status: :created
  end
end

class CheckoutOrder
  def call
    order = create_pending_order!       # transacción SQL 1
    payment = @payments.charge!(order, idempotency_key: order.checkout_key)

    Order.transaction do               # transacción SQL 2
      order.update!(status: "paid", provider_payment_id: payment.id)
    end
    OrderPaidJob.perform_later(order.id) # solo después del commit
    order
  rescue PaymentDeclined => error
    order&.update!(status: "failed")
    raise error
  end

  def create_pending_order!
    Order.transaction do
      order = @user.orders.create!(status: "pending")
      @cart.items.each { |item| order.items.create!(product: item.product, quantity: item.quantity) }
      order
    end
  end
end`,
    steps: [
      "El controller hace lo HTTP: autentica, permite params y traduce un resultado a 201, 422 o un error de pago. No calcula ni cobra directamente.",
      "La primera transacción crea Order y cada OrderItem. El uso de create! hace que una falla lance error y Rails revierta todas esas escrituras; esa es la frontera transaccional local.",
      "La orden queda pending antes de llamar al pago. El adapter traduce el contrato de tu app al SDK de Stripe u otro proveedor.",
      "La segunda transacción guarda paid/failed y el identificador del pago externo. Luego se encola el job explícitamente, cuando el commit ya terminó.",
      "Idempotencia significa que si el browser reintenta el mismo checkout por timeout, la misma checkout_key permite reconocerlo y evita un segundo cobro.",
    ],
    pitfalls: [
      "Una transacción SQL no incluye Stripe: no dejes la transacción abierta mientras esperás la red. Esa red puede tardar, fallar o responder después de un timeout.",
      "Falla parcial: Stripe cobra correctamente pero la app cae antes de guardar paid. Para resolverla necesitás guardar IDs/keys, consultar al proveedor o procesar un webhook y hacer retries seguros.",
      "Un callback after_commit en Order podría encolar el email cuando cambia a paid. Es válido, pero oculta un paso del flujo; este ejemplo lo deja explícito con OrderPaidJob.perform_later después del commit.",
      "La invariante no es una palabra decorativa: es una condición de negocio que protegés con validaciones, constraints, transacciones y estados, como no marcar paid una orden sin items.",
    ],
    mermaid: `flowchart TD
      A["POST /orders"] --> B["OrdersController\nauth + params"]
      B --> C["CheckoutOrder.call"]
      C --> D["Transacción 1"]
      D --> E["Order: pending"]
      E --> F["OrderItems\nse guardan juntos"]
      F --> G["COMMIT local"]
      G --> H["PaymentAdapter.charge!\ncon checkout_key"]
      H -->|"rechazado"| I["Order: failed\nrespuesta de pago"]
      H -->|"aprobado"| J["Transacción 2"]
      J --> K["Order: paid\nprovider_payment_id"]
      K --> L["COMMIT local"]
      L --> M["OrderPaidJob"]
      M --> N["Worker → OrderMailer\nconfirmación"]`,
    diagramTitle: "Checkout completo: HTTP, base, proveedor externo y efecto posterior",
    related: ["transactions", "adapter_pattern", "jobs_mailers", "callbacks"],
    takeaway: "Al diseñar negocio, nombrá qué debe ser siempre verdad, qué confirma cada transacción, qué falla fuera de tu base y cómo un retry no repite el efecto.",
  },
};

const NODES = NODE_DATA.map(([id, label, cat]) => ({
  id, label, cat,
  lesson: { ...(INTERVIEW_LESSON_OVERRIDES[id] ?? LESSONS[id]), ...(LEARNING_EXPLANATIONS[id] ?? {}), ...(CLARIFIED_BULLETS[id] ?? {}), ...(CONCEPTUAL_CORRECTIONS[id] ?? {}) },
  priority: PRIORITY.get(id) ?? 99,
  prerequisites: PREREQUISITES[id] ?? [],
}));
const NODE_IDS = new Set(NODES.map((node) => node.id));
const EDGES = Object.entries(PREREQUISITES).flatMap(([target, prerequisites]) => prerequisites.map((source) => [source, target]));

// Milestones are intentionally smaller than a whole category. Each one groups
// a coherent learning outcome so progress feels meaningful before the entire
// graph is complete.
const RAILS_MILESTONES = [
  { id: "rails_request", label: "Request Rails", description: "Podés explicar cómo entra, se enruta y responde una request.", color: "#E8A33D", nodeIds: ["ruby_basics", "mvc", "rack", "routing_rest", "controllers_params", "responses_errors"] },
  { id: "rails_data", label: "Datos y Active Record", description: "Modelás persistencia, asociaciones, consultas e integridad.", color: "#CC342D", nodeIds: ["ar_pattern", "ar_orm", "migrations", "validations", "assoc_belongs", "transactions", "scopes", "n_plus_one", "eager_loading", "assoc_through"] },
  { id: "rails_business", label: "Diseño de negocio", description: "Elegís dónde vive cada regla y cómo coordinar flujos complejos.", color: "#5AA9FF", nodeIds: ["service_object", "query_object", "form_object", "callbacks", "jobs_mailers", "strategy_pattern", "adapter_pattern"] },
  { id: "rails_cases", label: "Casos de entrevista", description: "Podés diseñar checkout, reporting y registro multi-modelo.", color: "#38BDF8", nodeIds: ["case_checkout", "case_reporting", "case_signup"] },
  { id: "rails_domain", label: "Modelado de dominio", description: "Entendés STI, polimorfismo y sus trade-offs.", color: "#A78BFA", nodeIds: ["sti", "sti_tradeoffs", "polymorphic", "case_content"] },
  { id: "rails_api_security", label: "API, React y seguridad", description: "Conectás Rails con un frontend y protegés el sistema.", color: "#94A3B8", nodeIds: ["api_mode", "serialization_cors", "auth_security", "react_rails_auth"] },
  { id: "rails_quality", label: "Testing y operación", description: "Probás comportamiento y entendés el entorno de ejecución.", color: "#4ADE80", nodeIds: ["rspec_basics", "factory_bot", "spec_types", "gemfile", "env_logger"] },
  { id: "rails_assets", label: "Assets de Rails", description: "Podés explicar fingerprinting y las opciones modernas.", color: "#2DD4BF", nodeIds: ["asset_pipeline", "modern_assets"] },
];

const GRAPH_CONFIGS = {
  rails: {
    id: "rails",
    label: "Rails entrevistas",
    title: "Rails interview map",
    subtitle: "Core conceptual, diseño de necesidades de negocio, STI, API para React y asset pipeline.",
    categories: CATEGORIES,
    categoryContext: CATEGORY_CONTEXT,
    nodes: NODES,
    edges: EDGES,
    nodeIds: new Set(NODES.map((node) => node.id)),
    milestones: RAILS_MILESTONES,
  },
  react: REACT_GRAPH,
};

const APP_ROUTE_STATE = "learning-map";

function getAppRoute(pathname) {
  const rawPath = typeof pathname === "string" ? pathname : "/rails";
  const parts = rawPath.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const graphKey = GRAPH_CONFIGS[parts[0]] ? parts[0] : "rails";
  const graph = GRAPH_CONFIGS[graphKey];
  const nodeId = parts[1] === "card" && graph.nodes.some((node) => node.id === parts[2]) ? parts[2] : null;
  return {
    graphKey,
    nodeId,
    view: nodeId ? "card" : "graph",
    path: nodeId ? `/${graphKey}/card/${nodeId}` : `/${graphKey}`,
  };
}

function getRouteNode(route) {
  return route.nodeId ? GRAPH_CONFIGS[route.graphKey]?.nodes.find((node) => node.id === route.nodeId) ?? null : null;
}

function makeAppHistoryState(route, previousNodeIds = [], canReturn = route.view === "card") {
  return {
    app: APP_ROUTE_STATE,
    view: route.view,
    graphKey: route.graphKey,
    nodeId: route.nodeId,
    previousNodeIds,
    canReturn: route.view === "card" && canReturn,
  };
}

const WIDTH = 1500;
const HEIGHT = 980;

// The classic map is a study surface, not an emergent data visualization.
// Keep its coordinates deterministic and derived from dependency depth so
// opening a graph never starts a force simulation or moves every node while
// the browser is already rendering UI.
function getStaticNodeLayout(graph, canvasWidth) {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const prerequisites = new Map(graph.nodes.map((node) => [node.id, new Set()]));
  graph.edges.forEach(([source, target]) => {
    if (nodeIds.has(source) && nodeIds.has(target)) prerequisites.get(target).add(source);
  });

  const depths = new Map();
  const visiting = new Set();
  const getDepth = (nodeId) => {
    if (depths.has(nodeId)) return depths.get(nodeId);
    // A cycle should not destroy the layout. Treat the repeated branch as a
    // root-like continuation; the graph audit still remains responsible for
    // reporting the invalid dependency.
    if (visiting.has(nodeId)) return 0;
    visiting.add(nodeId);
    const depth = Math.max(0, ...[...prerequisites.get(nodeId)].map(getDepth)) + 1;
    visiting.delete(nodeId);
    depths.set(nodeId, depth);
    return depth;
  };

  graph.nodes.forEach((node) => getDepth(node.id));
  const layers = new Map();
  graph.nodes.forEach((node) => {
    const layer = depths.get(node.id) - 1;
    if (!layers.has(layer)) layers.set(layer, []);
    layers.get(layer).push(node);
  });

  const maxLayer = Math.max(0, ...layers.keys());
  const maxNodesInLayer = Math.max(1, ...[...layers.values()].map((layer) => layer.length));
  const horizontalPadding = 150;
  const verticalPadding = 68;
  const xGap = maxLayer === 0
    ? 0
    : Math.max(154, Math.min(210, (canvasWidth - horizontalPadding * 2) / maxLayer));
  const yGap = maxNodesInLayer === 1
    ? 0
    : Math.max(64, Math.min(104, (HEIGHT - verticalPadding * 2) / (maxNodesInLayer - 1)));
  const layoutWidth = Math.max(canvasWidth, horizontalPadding * 2 + maxLayer * xGap);
  const graphSpan = maxLayer * xGap;
  const startX = Math.max(horizontalPadding, (layoutWidth - graphSpan) / 2);

  return {
    width: layoutWidth,
    nodes: [...layers.entries()].flatMap(([layer, layerNodes]) => {
      const ordered = layerNodes.sort((a, b) => a.cat.localeCompare(b.cat) || a.priority - b.priority);
      const totalHeight = (ordered.length - 1) * yGap;
      const startY = Math.max(verticalPadding, (HEIGHT - totalHeight) / 2);
      return ordered.map((node, index) => ({
        ...node,
        x: startX + layer * xGap,
        y: startY + index * yGap,
      }));
    }),
  };
}

function getGuidance(nodes, checked, activeCats) {
  const known = new Set(checked);
  const levels = [];

  for (let depth = 0; depth < 3; depth += 1) {
    const available = nodes
      .filter((node) => !known.has(node.id) && activeCats.has(node.cat))
      .filter((node) => node.prerequisites.every((id) => {
        const prerequisite = nodes.find((candidate) => candidate.id === id);
        // When the user focuses a topic, prerequisites from hidden topics are
        // treated as context already available. Dependencies inside the focus
        // remain explicit, so the topic still unfolds in the right order.
        return !prerequisite || !activeCats.has(prerequisite.cat) || known.has(id);
      }))
      .sort((a, b) => a.priority - b.priority);
    const selectedForLevel = available.slice(0, depth === 0 ? 1 : 4);
    levels.push(selectedForLevel);
    selectedForLevel.forEach((node) => known.add(node.id));
  }

  const levelById = new Map();
  levels.forEach((level, index) => level.forEach((node) => levelById.set(node.id, index + 1)));
  return { levels, levelById, primary: levels[0]?.[0] ?? null };
}

function getLessonContext(node, prerequisites, missingPrerequisites, categoryContext) {
  const phase = categoryContext[node.cat];
  if (!prerequisites.length) return `${phase} Este es el punto de partida: no presupone ningún nodo anterior.`;
  const names = prerequisites.map((item) => item.label).join(" y ");
  if (missingPrerequisites.length) return `${phase} Antes de estudiar este nodo necesitás completar: ${missingPrerequisites.map((item) => item.label).join(" y ")}. Esos conceptos aparecen aquí como base, no como detalle opcional.`;
  return `${phase} Llegaste acá después de ${names}; este nodo usa esas ideas y agrega una decisión nueva.`;
}

function getMilestoneProgress(milestones, checked, nodeIds) {
  return milestones.map((milestone) => {
    const ids = milestone.nodeIds.filter((id) => nodeIds.has(id));
    const done = ids.filter((id) => checked.has(id)).length;
    return {
      ...milestone,
      done,
      total: ids.length,
      percentage: ids.length ? Math.round((done / ids.length) * 100) : 0,
    };
  });
}

function getSeniorityProgress(bands, checked, nodeIds) {
  const completedBands = new Set();

  return bands.map((band) => {
    const ids = band.nodeIds.filter((id) => nodeIds.has(id));
    const done = ids.filter((id) => checked.has(id)).length;
    const percentage = ids.length ? Math.round((done / ids.length) * 100) : 0;
    const requirementsMet = band.requires.every((id) => completedBands.has(id));
    const complete = requirementsMet && percentage === 100;
    if (complete) completedBands.add(band.id);

    return {
      ...band,
      done,
      total: ids.length,
      percentage,
      requirementsMet,
      complete,
    };
  });
}

function getMilestoneBoundary(groupNodes, padding = 54) {
  if (!groupNodes.length) return null;

  const points = groupNodes.map((node) => [node.x, node.y]);
  const centroid = points.length > 2 && d3.polygonHull(points)
    ? d3.polygonCentroid(d3.polygonHull(points))
    : [points.reduce((sum, point) => sum + point[0], 0) / points.length, points.reduce((sum, point) => sum + point[1], 0) / points.length];
  let boundary = d3.polygonHull(points);

  if (!boundary || boundary.length < 3) {
    if (points.length === 1) {
      const [x, y] = points[0];
      return { path: `M ${x - padding} ${y} a ${padding} ${padding} 0 1 0 ${padding * 2} 0 a ${padding} ${padding} 0 1 0 ${-padding * 2} 0`, labelX: x, labelY: y - padding - 10 };
    }

    const [first, second] = points;
    const dx = second[0] - first[0];
    const dy = second[1] - first[1];
    const length = Math.max(Math.hypot(dx, dy), 1);
    const ux = dx / length;
    const uy = dy / length;
    const nx = -uy;
    const ny = ux;
    const extension = padding * 0.75;
    boundary = [
      [first[0] - ux * extension + nx * padding, first[1] - uy * extension + ny * padding],
      [second[0] + ux * extension + nx * padding, second[1] + uy * extension + ny * padding],
      [second[0] + ux * extension - nx * padding, second[1] + uy * extension - ny * padding],
      [first[0] - ux * extension - nx * padding, first[1] - uy * extension - ny * padding],
    ];
  } else {
    boundary = boundary.map(([x, y]) => {
      const distance = Math.max(Math.hypot(x - centroid[0], y - centroid[1]), 1);
      return [x + ((x - centroid[0]) / distance) * padding, y + ((y - centroid[1]) / distance) * padding];
    });
  }

  const path = `${boundary.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ")} Z`;
  const topY = Math.min(...boundary.map((point) => point[1]));
  return { path, labelX: centroid[0], labelY: topY - 10 };
}

export default function App() {
  const initialRoute = getAppRoute(typeof window !== "undefined" ? window.location.pathname : "/rails");
  const svgRef = useRef(null);
  const lessonModalRef = useRef(null);
  const modalCloseRef = useRef(null);
  const modalReturnFocusRef = useRef(null);
  const modalWasOpenRef = useRef(false);
  const simRef = useRef(null);
  const nodesRef = useRef([]);
  const layoutWidthRef = useRef(WIDTH);
  const dragRef = useRef({ id: null, moved: false });
  const [, forceTick] = useState(0);
  const [graphKey, setGraphKey] = useState(() => initialRoute.graphKey);
  const graph = GRAPH_CONFIGS[graphKey];
  // La completitud ya no se marca manualmente: se deriva de evaluaciones cuya
  // dimensión completeness llegó a 15/15.
  const [checked, setChecked] = useState(() => new Set());
  const [latestAttemptsByNode, setLatestAttemptsByNode] = useState(() => new Map());
  const [activeCats, setActiveCats] = useState(() => new Set(Object.keys(GRAPH_CONFIGS.rails.categories)));
  const [selected, setSelected] = useState(() => getRouteNode(initialRoute));
  const [lessonView, setLessonView] = useState("read"); // "read" | "coach" | "evaluate"
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [lessonHistory, setLessonHistory] = useState(() => {
    const previousNodeIds = typeof window !== "undefined" && Array.isArray(window.history.state?.previousNodeIds)
      ? window.history.state.previousNodeIds
      : [];
    return previousNodeIds.map((nodeId) => GRAPH_CONFIGS[initialRoute.graphKey].nodes.find((node) => node.id === nodeId)).filter(Boolean);
  });
  const [showCodeExplanation, setShowCodeExplanation] = useState(false);
  const [activeDeepDive, setActiveDeepDive] = useState(null);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState(WIDTH);
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const [ttsState, setTtsState] = useState({ status: "idle", error: "", chunkIndex: 0, chunkCount: 0, activeSegmentId: "", paused: false });
  const [viewMode, setViewMode] = useState("graph"); // "graph" | "flashcards"
  const [graphView, setGraphView] = useState("classic"); // "classic" | "lanes" | "radial" | "path"
  const ttsSpeechRef = useRef(null);
  const ttsSpeedRef = useRef(1);
  const ttsPlaybackRef = useRef({ segments: [], index: 0, generation: 0 });

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    ttsSpeechRef.current = null;
    ttsPlaybackRef.current = { segments: [], index: 0, generation: ttsPlaybackRef.current.generation + 1 };
    setTtsState({ status: "idle", error: "", chunkIndex: 0, chunkCount: 0, activeSegmentId: "", paused: false });
  }, []);

  const applyAppRoute = useCallback((route, state = {}) => {
    const nextGraphKey = GRAPH_CONFIGS[route.graphKey] ? route.graphKey : "rails";
    const nextRoute = { ...route, graphKey: nextGraphKey };
    const nextNode = getRouteNode(nextRoute);
    const previousNodeIds = Array.isArray(state.previousNodeIds) ? state.previousNodeIds : [];

    stopSpeech();
    if (nextGraphKey !== graphKey) setActiveCats(new Set(Object.keys(GRAPH_CONFIGS[nextGraphKey].categories)));
    setGraphKey(nextGraphKey);
    setSelected(nextNode);
    setLessonView("read");
    setHoveredNodeId(null);
    setLessonHistory(previousNodeIds.map((nodeId) => GRAPH_CONFIGS[nextGraphKey].nodes.find((node) => node.id === nodeId)).filter(Boolean));
    setShowCodeExplanation(false);
    setActiveDeepDive(null);
  }, [graphKey, stopSpeech]);

  const navigateAppRoute = useCallback((route, { replace = false, previousNodeIds = [], canReturn = route.view === "card" } = {}) => {
    const state = makeAppHistoryState(route, previousNodeIds, canReturn);
    if (typeof window !== "undefined") {
      const method = replace ? "replaceState" : "pushState";
      window.history[method](state, "", route.path);
    }
    applyAppRoute(route, state);
  }, [applyAppRoute]);

  const closeLesson = useCallback(() => {
    const currentState = typeof window !== "undefined" ? window.history.state : null;
    const canGoBack = Boolean(selected && currentState?.app === APP_ROUTE_STATE && currentState.view === "card" && currentState.canReturn);
    if (canGoBack) {
      stopSpeech();
      window.history.back();
      return;
    }
    navigateAppRoute(getAppRoute(`/${graphKey}`), { replace: true, canReturn: false });
  }, [graphKey, navigateAppRoute, selected, stopSpeech]);

  const openLesson = useCallback((node, rememberCurrent = false) => {
    if (!node) return;
    if (selected?.id === node.id) {
      closeLesson();
      return;
    }
    if (!selected && typeof document !== "undefined" && typeof document.activeElement?.focus === "function") {
      modalReturnFocusRef.current = document.activeElement;
    }
    const previousNodeIds = rememberCurrent && selected
      ? [...lessonHistory.map((item) => item.id), selected.id]
      : [];
    navigateAppRoute({ graphKey, nodeId: node.id, view: "card", path: `/${graphKey}/card/${node.id}` }, { previousNodeIds, canReturn: true });
  }, [closeLesson, graphKey, lessonHistory, navigateAppRoute, selected]);

  const goBack = useCallback(() => {
    const currentState = typeof window !== "undefined" ? window.history.state : null;
    if (currentState?.app === APP_ROUTE_STATE && currentState.view === "card" && currentState.canReturn) {
      stopSpeech();
      window.history.back();
      return;
    }
    closeLesson();
  }, [closeLesson, stopSpeech]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const route = getAppRoute(window.location.pathname);
    const currentState = window.history.state;
    const isCurrentRouteState = currentState?.app === APP_ROUTE_STATE
      && currentState.graphKey === route.graphKey
      && currentState.nodeId === route.nodeId
      && currentState.view === route.view;
    if (!isCurrentRouteState || window.location.pathname !== route.path) {
      window.history.replaceState(makeAppHistoryState(route, [], false), "", route.path);
    }
    const onPopState = () => {
      const nextRoute = getAppRoute(window.location.pathname);
      applyAppRoute(nextRoute, window.history.state ?? {});
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [applyAppRoute]);

  const openDeepDive = useCallback((id, event, triggerKey) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const halfWidth = Math.min(190, Math.max(145, (viewportWidth - 32) / 2));
    const left = Math.min(viewportWidth - halfWidth - 16, Math.max(halfWidth + 16, rect.left + rect.width / 2));
    const above = viewportHeight - rect.bottom < 380 && rect.top > 390;
    setActiveDeepDive({
      id,
      triggerKey,
      trigger: event.currentTarget,
      left,
      top: above ? rect.top - 10 : rect.bottom + 10,
      above,
    });
  }, []);

  const closeDeepDive = useCallback((restoreFocus = true) => {
    setActiveDeepDive((current) => {
      if (restoreFocus && typeof current?.trigger?.focus === "function") {
        window.requestAnimationFrame(() => current.trigger.focus());
      }
      return null;
    });
  }, []);

  const buildSelectedSpeech = useCallback(() => {
    if (!selected) return [];
    const prerequisites = selected.prerequisites.map((id) => graph.nodes.find((node) => node.id === id)).filter(Boolean);
    const missingPrerequisites = prerequisites.filter((node) => !checked.has(node.id));
    const context = getLessonContext(selected, prerequisites, missingPrerequisites, graph.categoryContext);
    return buildBrowserSpeechSegments(selected, context);
  }, [selected, graph, checked]);

  const startBrowserPlayback = useCallback((startIndex = 0) => {
    if (!selected) return;
    const segments = buildSelectedSpeech();
    if (!segments.length) return;
    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setTtsState({ status: "error", error: "Este navegador no ofrece Speech Synthesis.", chunkIndex: 0, chunkCount: 0, activeSegmentId: "", paused: false });
      return;
    }

    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const generation = ttsPlaybackRef.current.generation + 1;
    ttsPlaybackRef.current = { segments, index: startIndex, generation };
    setTtsState({ status: "loading", error: "", chunkIndex: startIndex + 1, chunkCount: segments.length, activeSegmentId: segments[startIndex]?.id ?? "", paused: false });

    const speakSegment = (index) => {
      if (ttsPlaybackRef.current.generation !== generation || !segments[index]) return;
      const segment = segments[index];
      const utterance = new window.SpeechSynthesisUtterance(segment.text);
      utterance.lang = "es-419";
      utterance.rate = ttsSpeedRef.current;
      ttsSpeechRef.current = utterance;
      ttsPlaybackRef.current.index = index;
      setTtsState((previous) => ({ ...previous, status: "loading", chunkIndex: index + 1, chunkCount: segments.length, activeSegmentId: segment.id, paused: false }));
      utterance.onstart = () => setTtsState((previous) => ({ ...previous, status: "playing", error: "", activeSegmentId: segment.id, paused: false }));
      utterance.onend = () => {
        if (ttsPlaybackRef.current.generation !== generation) return;
        if (index + 1 < segments.length) window.setTimeout(() => speakSegment(index + 1), 0);
        else setTtsState((previous) => ({ ...previous, status: "idle", chunkIndex: segments.length, chunkCount: segments.length, activeSegmentId: "", paused: false }));
      };
      utterance.onerror = (event) => {
        if (event.error === "canceled" || event.error === "interrupted" || ttsPlaybackRef.current.generation !== generation) return;
        setTtsState({ status: "error", error: "No se pudo reproducir la lectura. " + event.error, chunkIndex: index + 1, chunkCount: segments.length, activeSegmentId: segment.id, paused: false });
      };
      synthesis.speak(utterance);
    };

    speakSegment(Math.max(0, Math.min(segments.length - 1, startIndex)));
  }, [selected, buildSelectedSpeech]);

  const pauseSpeech = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis?.speaking) return;
    window.speechSynthesis.pause();
    setTtsState((previous) => ({ ...previous, status: "paused", paused: true }));
  }, []);

  const resumeSpeech = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis?.paused) return;
    window.speechSynthesis.resume();
    setTtsState((previous) => ({ ...previous, status: "playing", paused: false }));
  }, []);

  const replaySpeech = useCallback(() => {
    startBrowserPlayback(Math.max(0, ttsPlaybackRef.current.index ?? 0));
  }, [startBrowserPlayback]);

  const moveSpeechSegment = useCallback((offset) => {
    const segments = ttsPlaybackRef.current.segments.length ? ttsPlaybackRef.current.segments : buildSelectedSpeech();
    if (!segments.length) return;
    const currentIndex = ttsPlaybackRef.current.segments.length ? ttsPlaybackRef.current.index : 0;
    const nextIndex = Math.max(0, Math.min(segments.length - 1, currentIndex + offset));
    startBrowserPlayback(nextIndex);
  }, [buildSelectedSpeech, startBrowserPlayback]);

  const toggleSpeech = useCallback(() => {
    if (ttsState.status === "playing") pauseSpeech();
    else if (ttsState.status === "paused") resumeSpeech();
    else if (ttsState.status === "loading") return;
    else startBrowserPlayback(0);
  }, [pauseSpeech, resumeSpeech, startBrowserPlayback, ttsState.status]);

  const changeSpeechSpeed = useCallback((offset) => {
    const currentIndex = TTS_SPEEDS.indexOf(ttsSpeedRef.current);
    const nextIndex = Math.max(0, Math.min(TTS_SPEEDS.length - 1, currentIndex + offset));
    const nextSpeed = TTS_SPEEDS[nextIndex];
    ttsSpeedRef.current = nextSpeed;
    setTtsSpeed(nextSpeed);
    if (ttsState.status === "playing") startBrowserPlayback(ttsPlaybackRef.current.index ?? 0);
  }, [startBrowserPlayback, ttsState.status]);

  const playSectionSpeech = useCallback((segmentId) => {
    if (!selected) return;
    const segmentIndex = buildSelectedSpeech().findIndex((segment) => segment.id === segmentId);
    if (segmentIndex >= 0) startBrowserPlayback(segmentIndex);
  }, [selected, buildSelectedSpeech, startBrowserPlayback]);

  useEffect(() => () => stopSpeech(), [stopSpeech]);

  useEffect(() => {
    if (!selected) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      if (activeDeepDive) closeDeepDive();
      else closeLesson();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected, activeDeepDive, closeDeepDive, closeLesson]);

  useEffect(() => {
    const isOpen = Boolean(selected);
    let restoreScroll = () => {};
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const body = document.body;
      const previousRootOverflow = root.style.overflow;
      const previousBodyOverflow = body.style.overflow;
      if (isOpen) {
        root.style.overflow = "hidden";
        body.style.overflow = "hidden";
        restoreScroll = () => {
          root.style.overflow = previousRootOverflow;
          body.style.overflow = previousBodyOverflow;
        };
      }
    }
    if (isOpen && !modalWasOpenRef.current) {
      window.requestAnimationFrame(() => modalCloseRef.current?.focus());
    } else if (!isOpen && modalWasOpenRef.current) {
      const returnTarget = modalReturnFocusRef.current;
      window.requestAnimationFrame(() => returnTarget?.focus?.());
      modalReturnFocusRef.current = null;
    }
    modalWasOpenRef.current = isOpen;
    return restoreScroll;
  }, [selected]);

  const keepFocusInsideLesson = useCallback((event) => {
    if (event.key !== "Tab" || !lessonModalRef.current) return;
    const focusable = [...lessonModalRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => !element.hasAttribute("hidden") && element.getClientRects().length > 0);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !lessonModalRef.current.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || typeof ResizeObserver === "undefined") return undefined;
    const svgElement = svgRef.current;
    const updateCanvasWidth = () => {
      const { width, height } = svgElement.getBoundingClientRect();
      if (width > 0 && height > 0) setCanvasWidth(Math.max(WIDTH, Math.round((width / height) * HEIGHT)));
    };
    updateCanvasWidth();
    const observer = new ResizeObserver(updateCanvasWidth);
    observer.observe(svgElement);
    return () => observer.disconnect();
    // El svg clásico se desmonta al cambiar de variante: reenganchar al volver.
  }, [graphView]);

  useEffect(() => {
    setActiveDeepDive(null);
    setChecked(new Set());
    setLatestAttemptsByNode(new Map());
    setActiveCats(new Set(Object.keys(graph.categories)));
    setTransform({ k: 1, x: 0, y: 0 });

    let cancelled = false;
    listAllAttempts().then((all) => {
      if (cancelled) return;
      const currentNodes = new Map(graph.nodes.map((node) => [node.id, node]));
      const latest = new Map();
      const completed = new Set();
      for (const attempt of all) {
        if (attempt.graphId !== graphKey) continue;
        const node = currentNodes.get(attempt.nodeId);
        if (!node || attempt.contentHash !== hashCardContent(node)) continue;
        const current = latest.get(attempt.nodeId);
        if (!current || attempt.createdAt >= current.createdAt) latest.set(attempt.nodeId, attempt);
        if (isEvaluationSurfaceComplete(attempt.evaluation)) completed.add(attempt.nodeId);
      }
      setLatestAttemptsByNode(latest);
      setChecked(completed);
    }).catch(() => {
      if (!cancelled) {
        setLatestAttemptsByNode(new Map());
        setChecked(new Set());
      }
    });
    return () => { cancelled = true; };
  }, [graphKey, graph]);

  useEffect(() => {
    const layout = getStaticNodeLayout(graph, canvasWidth);
    const nodes = layout.nodes;
    const links = graph.edges.map(([source, target]) => ({ source, target }));
    nodesRef.current = nodes;
    layoutWidthRef.current = layout.width;
    simRef.current = { links };
    forceTick((value) => value + 1);
  }, [canvasWidth, graph]);

  useEffect(() => {
    if (!svgRef.current) return undefined;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([0.4, 2.2]).on("zoom", (event) => setTransform(event.transform));
    svg.call(zoom);
    return () => svg.on(".zoom", null);
    // Mismo motivo: reenganchar el zoom cuando se vuelve a la vista clásica.
  }, [graphView]);

  const toSvgCoords = (clientX, clientY) => {
    const point = svgRef.current.createSVGPoint();
    point.x = clientX; point.y = clientY;
    const inverse = svgRef.current.getScreenCTM().inverse();
    const local = point.matrixTransform(inverse);
    return { x: (local.x - transform.x) / transform.k, y: (local.y - transform.y) / transform.k };
  };

  const onNodePointerDown = (node) => (event) => {
    event.stopPropagation();
    if (event.button !== undefined && event.button !== 0) return;
    const nodeElement = event.currentTarget;
    dragRef.current = { id: node.id, moved: false };
    const move = (moveEvent) => {
      if (dragRef.current.id !== node.id) return;
      const dx = moveEvent.clientX - event.clientX;
      const dy = moveEvent.clientY - event.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragRef.current.moved = true;
      if (!dragRef.current.moved) return;
      const point = toSvgCoords(moveEvent.clientX, moveEvent.clientY);
      node.x = Math.max(100, Math.min(layoutWidthRef.current - 100, point.x));
      node.y = Math.max(60, Math.min(HEIGHT - 60, point.y));
      forceTick((value) => value + 1);
    };
    const finishPointer = (cancelled) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      const wasMoved = dragRef.current.moved;
      dragRef.current = { id: null, moved: false };
      if (!cancelled && !wasMoved) {
        nodeElement.focus();
        // Toggle selection instead of always selecting. The node's click is also stopped below,
        // so the SVG background handler cannot immediately clear this state.
        if (selected?.id === node.id) closeLesson();
        else openLesson(node);
      }
    };
    const up = () => finishPointer(false);
    const cancel = () => finishPointer(true);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
    window.addEventListener("pointercancel", cancel, { once: true });
  };

  const focusCategory = (category) => setActiveCats(new Set([category]));
  const showAllCategories = () => setActiveCats(new Set(Object.keys(graph.categories)));

  const handleEvaluationSaved = useCallback((attempt) => {
    const node = graph.nodes.find((candidate) => candidate.id === attempt.nodeId);
    if (!node || attempt.graphId !== graphKey || attempt.contentHash !== hashCardContent(node)) return;
    setLatestAttemptsByNode((previous) => new Map(previous).set(attempt.nodeId, attempt));
    if (isEvaluationSurfaceComplete(attempt.evaluation)) {
      setChecked((previous) => new Set(previous).add(attempt.nodeId));
    }
  }, [graph, graphKey]);

  const switchGraph = (nextGraphKey) => {
    if (nextGraphKey === graphKey) return;
    simRef.current?.sim?.stop?.();
    simRef.current = null;
    nodesRef.current = [];
    navigateAppRoute(getAppRoute(`/${nextGraphKey}`));
  };

  // Refs update outside React's render cycle. During the one render between changing
  // graphs and creating the new simulation, never paint nodes from the previous graph.
  const nodes = nodesRef.current.filter((node) => graph.nodeIds.has(node.id) && graph.categories[node.cat]);
  const graphWidth = Math.max(canvasWidth, layoutWidthRef.current);
  const hoveredNode = hoveredNodeId ? nodes.find((node) => node.id === hoveredNodeId) : null;
  const excellenceNodeIds = new Set(
    [...latestAttemptsByNode.entries()]
      .filter(([, attempt]) => getScoreView(attempt.evaluation)?.isExtra)
      .map(([nodeId]) => nodeId),
  );
  const links = (simRef.current?.links ?? []).filter((link) => {
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;
    return graph.nodeIds.has(sourceId) && graph.nodeIds.has(targetId);
  });
  const total = graph.nodes.length;
  const done = checked.size;
  const percentage = Math.round((done / total) * 100);
  const milestoneProgress = getMilestoneProgress(graph.milestones, checked, graph.nodeIds);
  const milestoneByNodeId = new Map();
  milestoneProgress.forEach((milestone) => milestone.nodeIds.forEach((id) => milestoneByNodeId.set(id, milestone)));
  const seniorityProgress = getSeniorityProgress(graph.seniorityBands ?? [], checked, graph.nodeIds);
  const seniorityByNodeId = new Map();
  seniorityProgress.forEach((band) => band.nodeIds.forEach((id) => seniorityByNodeId.set(id, band)));
  const guidance = getGuidance(graph.nodes, checked, activeCats);
  const seniorityBoundaries = seniorityProgress
    .map((band) => ({
      ...band,
      boundary: getMilestoneBoundary(nodes.filter((node) => band.nodeIds.includes(node.id) && activeCats.has(node.cat)), 90),
    }))
    .filter((band) => band.boundary);
  const milestoneBoundaries = milestoneProgress
    .filter((milestone) => milestone.done > 0)
    .map((milestone) => ({
      ...milestone,
      boundary: getMilestoneBoundary(nodes.filter((node) => milestone.nodeIds.includes(node.id) && activeCats.has(node.cat))),
      hasPrimaryGuide: milestone.nodeIds.some((id) => guidance.levelById.get(id) === 1),
    }))
    .filter((milestone) => milestone.boundary);
  const primaryNext = guidance.primary;
  const selectedPrerequisites = selected ? selected.prerequisites.map((id) => graph.nodes.find((node) => node.id === id)).filter(Boolean) : [];
  const selectedNavigationPrerequisites = selectedPrerequisites.filter((node) => activeCats.has(node.cat));
  const missingSelectedPrerequisites = selectedPrerequisites.filter((node) => !checked.has(node.id));
  const selectedNextNodes = selected ? graph.nodes.filter((node) => activeCats.has(node.cat) && node.prerequisites.includes(selected.id)).sort((a, b) => a.priority - b.priority).slice(0, 5) : [];
  const activeFocusNodes = graph.nodes.filter((node) => activeCats.has(node.cat)).sort((a, b) => a.priority - b.priority);
  const nextFocusNode = selected ? activeFocusNodes.find((node) => node.priority > selected.priority) : null;
  const selectedAfterNodes = selectedNextNodes.length ? selectedNextNodes : nextFocusNode ? [nextFocusNode] : [];
  const selectedRelatedNodes = selected ? (selected.lesson.related ?? []).map((id) => graph.nodes.find((node) => node.id === id)).filter((node) => node && activeCats.has(node.cat)) : [];
  const selectedLatestAttempt = selected ? latestAttemptsByNode.get(selected.id) : null;
  const selectedCompletion = selectedLatestAttempt ? getCompletionView(selectedLatestAttempt.evaluation) : null;
  const selectedScore = selectedLatestAttempt ? getScoreView(selectedLatestAttempt.evaluation) : null;
  const selectedLessonContext = selected ? getLessonContext(selected, selectedPrerequisites, missingSelectedPrerequisites, graph.categoryContext) : "";
  const speechSegments = buildSelectedSpeech();
  const speechSegmentIds = new Set(speechSegments.map((segment) => segment.id));
  const selectedCodeNarration = selected?.lesson.code ? getCodeNarration(selected, selected.lesson) : "";
  const selectedInterviewQuestions = selected?.interviewQuestions ?? [];
  const interviewQuestionStates = selectedInterviewQuestions.map((question) => {
    const prerequisiteIds = getInterviewQuestionPrerequisites(question, graph);
    const missingNodes = prerequisiteIds
      .filter((id) => !checked.has(id))
      .map((id) => graph.nodes.find((node) => node.id === id))
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority);
    return { question, missingNodes };
  });
  const unlockedInterviewQuestions = interviewQuestionStates.filter((item) => item.missingNodes.length === 0).map((item) => item.question);
  const richText = (text, limit = 3) => <RichText text={text} nodeId={selected?.id} enabled={graphKey === "react"} onDeepDive={openDeepDive} activeDeepDiveKey={activeDeepDive?.triggerKey} limit={limit} />;

  // Contexto compartido por las variantes del grafo (Carriles, Radial, Ruta).
  const graphViewContext = {
    graph,
    checked,
    latestAttemptsByNode,
    activeCats,
    guidance,
    milestoneProgress,
    seniorityProgress,
    milestoneByNodeId,
    seniorityByNodeId,
  };
  const toggleLessonNode = (node) => {
    if (selected?.id === node.id) closeLesson();
    else openLesson(node);
  };

  return (
    <main className="page" data-graph={graphKey}>
      <header className="header">
        <div>
          <div className="eyebrow">ENTREVISTA · RUTA GUIADA</div>
          <h1>{graph.title}</h1>
          <p className="subtitle">{graph.subtitle}</p>
          {graph.interviewQuestions?.length > 0 && <a className="interview-coverage-badge" href={graph.interviewQuestionSource} target="_blank" rel="noreferrer">
            <span>{graph.interviewQuestions.length}/110</span> preguntas de referencia trazadas al mapa ↗
          </a>}
        </div>
        <div className="progress-block">
          <span className="progress-number">{done}/{total}</span>
          <span className="progress-track" role="progressbar" aria-label={`Progreso total: ${done} de ${total} nodos`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></span>
          <span className="progress-percent">{percentage}% dominado</span>
        </div>
      </header>

      <section className="map-workspace" aria-label="Workspace de aprendizaje">
      <div className="graph-switcher" aria-label="Elegir grafo">
        {Object.values(GRAPH_CONFIGS).map((item) => <button key={item.id} className={`graph-switch ${item.id === graphKey ? "is-active" : ""}`} onClick={() => switchGraph(item.id)}>{item.label}</button>)}
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      <div className="legend">
        <button className={`category-chip category-all ${activeCats.size === Object.keys(graph.categories).length ? "is-active" : ""}`} onClick={showAllCategories} aria-pressed={activeCats.size === Object.keys(graph.categories).length}>Todos</button>
        {Object.entries(graph.categories).map(([key, category]) => {
          const active = activeCats.has(key);
          const categoryNodes = graph.nodes.filter((node) => node.cat === key);
          const focused = activeCats.size === 1 && active;
          return <button key={key} className={`category-chip ${focused ? "is-focused" : ""}`} onClick={() => focusCategory(key)} aria-pressed={focused} style={{ "--category-color": category.color, opacity: active ? 1 : 0.42 }}>
            <span className="category-dot" style={{ background: category.color }} />{category.label}<span className="category-count">{categoryNodes.filter((node) => checked.has(node.id)).length}/{categoryNodes.length}</span>
          </button>;
        })}
      </div>

      <div className="map-focus-strip" aria-label="Próximo desafío sugerido">
        <div className="map-focus-strip__copy">
          <span>PRÓXIMO DESAFÍO</span>
          <strong>{primaryNext ? primaryNext.label : "Ruta completada"}</strong>
        </div>
        <span className="map-focus-strip__scope">
          {activeCats.size === Object.keys(graph.categories).length
            ? "Viendo la ruta completa"
            : `Foco: ${[...activeCats].map((key) => graph.categories[key]?.label).filter(Boolean).join(", ")}`}
        </span>
        {primaryNext && <button type="button" onClick={() => openLesson(primaryNext)}>
          Abrir card <span aria-hidden="true">→</span>
        </button>}
      </div>

      {seniorityProgress.length > 0 && <section className="seniority-overview" aria-label="Mapa de seniority">
        <div className="seniority-heading">
          <div>
            <span className="guide-kicker">MAPA DE SENIORITY</span>
            <h2>La superficie completa del crecimiento frontend</h2>
            <p>Cada banda agrupa varios milestones. Design Systems es una especialización paralela; Frontend Lead se construye sobre la banda Senior Frontend.</p>
          </div>
          <span className="seniority-summary">{seniorityProgress.filter((band) => band.complete).length}/{seniorityProgress.length} capacidades cerradas</span>
        </div>
        <div className="seniority-grid">
          {seniorityProgress.map((band) => {
            const status = band.complete ? "✓ NIVEL COMPLETO" : band.requirementsMet ? "EN PROGRESO" : "BASE PENDIENTE";
            return <article className={`seniority-card ${band.complete ? "is-complete" : band.requirementsMet ? "is-active" : "is-locked"}`} key={band.id} style={{ "--seniority-color": band.color }}>
              <div className="seniority-stage-row">
                <span className="seniority-stage">{band.stage}</span>
                <span className="seniority-status">{status}</span>
              </div>
              <div className="seniority-title-row">
                <h3>{band.label}</h3>
                <strong>{band.percentage}%</strong>
              </div>
              <p>{band.description}</p>
              <div className="seniority-track" role="progressbar" aria-label={`${band.label}: ${band.done} de ${band.total}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={band.percentage}>
                <span style={{ width: `${band.percentage}%` }} />
              </div>
              <div className="seniority-meta"><span>{band.done}/{band.total} nodos</span><span>{band.milestoneIds.length} milestones</span></div>
              <div className="seniority-surface" aria-label={`Incluye ${band.milestoneIds.length} grupos`}>
                {band.milestoneIds.map((id) => {
                  const milestone = milestoneProgress.find((item) => item.id === id);
                  return milestone ? <span className={milestone.percentage === 100 ? "is-complete" : ""} key={id}>{milestone.label}</span> : null;
                })}
              </div>
            </article>;
          })}
        </div>
      </section>}

      <section className="milestones" aria-label="Milestones de aprendizaje">
        <div className="milestones-heading">
          <div>
            <span className="guide-kicker">MILESTONES</span>
            <p>Completá grupos coherentes para cerrar etapas y recuperar la sensación de avance.</p>
          </div>
          <span className="milestones-summary">{milestoneProgress.filter((milestone) => milestone.percentage === 100).length}/{milestoneProgress.length} grupos completos</span>
        </div>
        <div className="milestone-grid">
          {milestoneProgress.map((milestone) => (
            <article className={`milestone-card ${milestone.percentage === 100 ? "is-complete" : ""}`} key={milestone.id} style={{ "--milestone-color": milestone.color }}>
              <div className="milestone-card-header">
                <div>
                  <h2>{milestone.label}</h2>
                  <p>{milestone.description}</p>
                </div>
                <strong>{milestone.percentage}%</strong>
              </div>
              <div className="milestone-track" role="progressbar" aria-label={`${milestone.label}: ${milestone.done} de ${milestone.total}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={milestone.percentage}>
                <span style={{ width: `${milestone.percentage}%` }} />
              </div>
              <div className="milestone-meta">
                <span>{milestone.done}/{milestone.total} nodos</span>
                {milestone.percentage === 100 && <span className="milestone-complete">✓ COMPLETO</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-guide" aria-label="Ruta sugerida de aprendizaje">
        <div className="guide-heading">
          <span className="guide-kicker">RUTA SUGERIDA</span>
          <span className="guide-help">Las flechas muestran qué concepto habilita al siguiente.</span>
        </div>
        <div className="guide-levels">
          {guidance.levels.map((level, index) => (
            <div className={`guide-level guide-level-${index + 1}`} key={index}>
              <span className="guide-level-label">{index === 0 ? "AHORA" : index === 1 ? "DESPUÉS" : "MÁS ADELANTE"}</span>
              <div className="guide-items">
                {level.length ? level.map((node) => (
                  <button key={node.id} className="guide-item" onClick={() => openLesson(node)}>
                    <span className="guide-number">{node.priority}</span>{node.label}
                  </button>
                )) : <span className="guide-empty">No hay nodos disponibles</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="canvas-row">
        {viewMode === "flashcards" ? (
          <FlashcardView
            graph={graph}
            onOpenNode={(node) => { setViewMode("graph"); openLesson(node, false); }}
          />
        ) : (
        <div className="graph-area">
        <GraphViewTabs mode={graphView} onChange={setGraphView} />
        {graphView === "classic" ? (
        <svg ref={svgRef} viewBox={`0 0 ${graphWidth} ${HEIGHT}`} className="graph" onClick={(event) => { if (!event.target.closest(".node-group")) closeLesson(); }}>
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="35%" r="75%"><stop offset="0%" stopColor="#161A24" /><stop offset="100%" stopColor="#0B0D13" /></radialGradient>
            <marker id="dependency-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#667080" /></marker>
          </defs>
          <rect width={graphWidth} height={HEIGHT} fill="url(#bgGlow)" />
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            <g className="seniority-territories" pointerEvents="none">
              {seniorityBoundaries.map((band) => (
                <g className={`seniority-territory ${band.complete ? "is-complete" : band.requirementsMet ? "is-active" : "is-locked"}`} key={band.id} style={{ color: band.color }}>
                  <path d={band.boundary.path} fill={band.color} stroke={band.color} />
                  <text x={band.boundary.labelX} y={band.boundary.labelY + 22} textAnchor="middle">{band.stage} · {band.label} · {band.percentage}%</text>
                </g>
              ))}
            </g>
            <g className="milestone-boundaries" pointerEvents="none">
              {milestoneBoundaries.map((milestone) => {
                const isComplete = milestone.percentage === 100;
                const showBoundary = !isComplete || milestone.hasPrimaryGuide;

                if (!showBoundary) return null;

                return (
                <g className={`milestone-boundary ${milestone.percentage === 100 ? "is-complete" : "is-progress"} ${milestone.hasPrimaryGuide ? "has-primary-guide" : ""}`} key={milestone.id} style={{ color: milestone.color }}>
                  <path d={milestone.boundary.path} fill={milestone.color} stroke={milestone.color} />
                  <text x={milestone.boundary.labelX} y={milestone.boundary.labelY} textAnchor="middle">
                    {milestone.percentage === 100 ? `✓ ${milestone.label}` : milestone.label}
                  </text>
                </g>
                );
              })}
            </g>
            {links.map((link, index) => {
              const source = typeof link.source === "object" ? link.source : nodes.find((node) => node.id === link.source);
              const target = typeof link.target === "object" ? link.target : nodes.find((node) => node.id === link.target);
              if (!source || !target) return null;
              const dim = !activeCats.has(source.cat) || !activeCats.has(target.cat);
              const doneLink = checked.has(source.id) && checked.has(target.id);
              const sourceMilestone = milestoneByNodeId.get(source.id);
              const targetMilestone = milestoneByNodeId.get(target.id);
              const energyLink = sourceMilestone?.id === targetMilestone?.id && sourceMilestone?.percentage === 100;
              const sourceBand = seniorityByNodeId.get(source.id);
              const targetBand = seniorityByNodeId.get(target.id);
              const seniorityEnergyLink = sourceBand?.id === targetBand?.id && sourceBand?.complete && sourceMilestone?.id !== targetMilestone?.id;
              const guideLevel = guidance.levelById.get(target.id) ?? 0;
              const guideStroke = guideLevel === 1 ? "#F5F1E8" : guideLevel === 2 ? "#E8A33D" : guideLevel === 3 ? "#5AA9FF" : null;
              return <g key={index} className={energyLink ? "has-energy-link" : ""}>
                <line className={`dependency-link ${guideLevel ? `guide-link-${guideLevel}` : ""}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={guideStroke ?? (doneLink ? "#CC342D" : "#3A404D")} strokeOpacity={dim ? 0.08 : guideLevel ? 0.82 : doneLink ? 0.55 : 0.38} strokeWidth={guideLevel === 1 ? 2.4 : doneLink ? 1.6 : 1.15} markerEnd="url(#dependency-arrow)" />
                {energyLink && <line className="milestone-energy-link" x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={sourceMilestone.color} markerEnd="url(#dependency-arrow)" />}
                {seniorityEnergyLink && <line className="seniority-energy-link" x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={sourceBand.color} markerEnd="url(#dependency-arrow)" />}
              </g>;
            })}
            {nodes.map((node) => {
              const category = graph.categories[node.cat];
              const isSelected = selected?.id === node.id;
              const isChecked = checked.has(node.id);
              const milestone = milestoneByNodeId.get(node.id);
              const completedMilestone = milestone?.percentage === 100;
              const inProgressMilestone = milestone && milestone.done > 0 && !completedMilestone;
              const guideLevel = guidance.levelById.get(node.id) ?? 0;
              const radius = isSelected ? 29 : guideLevel === 1 ? 23 : guideLevel === 2 ? 19 : guideLevel === 3 ? 17 : 15;
              const nodeOpacity = !activeCats.has(node.cat) ? 0.12 : isChecked ? 0.74 : guideLevel ? 1 : 0.82;
              const mapLabel = node.label.length > 20 ? `${node.label.slice(0, 18)}…` : node.label;
              const isGuideBadgeAnchor = guideLevel > 0 && guidance.levels[guideLevel - 1]?.[0]?.id === node.id;
              const hasExcellence = excellenceNodeIds.has(node.id);
              const nodeAccessibleLabel = `${node.label}. Prioridad ${node.priority}.${node.prerequisites.length ? ` Depende de ${node.prerequisites.map((id) => graph.nodes.find((item) => item.id === id)?.label).join(", ")}.` : " Punto de partida."}`;
              return <g className={`node-group guide-node-${guideLevel} ${completedMilestone ? "milestone-node-complete" : inProgressMilestone ? "milestone-node-progress" : ""}`} key={node.id} transform={`translate(${node.x},${node.y})`} opacity={nodeOpacity} role="button" tabIndex={activeCats.has(node.cat) ? 0 : -1} aria-label={nodeAccessibleLabel} aria-pressed={isSelected} onPointerEnter={() => setHoveredNodeId(node.id)} onPointerLeave={() => setHoveredNodeId(null)} onFocus={() => setHoveredNodeId(node.id)} onBlur={() => setHoveredNodeId(null)} onPointerDown={onNodePointerDown(node)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (isSelected) closeLesson();
                else openLesson(node);
              }}>
              <title>{`${node.label} · prioridad ${node.priority}${node.prerequisites.length ? ` · depende de ${node.prerequisites.map((id) => graph.nodes.find((item) => item.id === id)?.label).join(", ")}` : " · punto de partida"}`}</title>
                {isSelected && <circle r={36} fill="none" stroke={category.color} strokeOpacity=".22" strokeWidth="7" className="selected-halo" />}
                {completedMilestone && <circle r={radius + 6} fill="none" stroke={milestone.color} strokeOpacity=".34" strokeWidth="1.5" className="milestone-node-ring" />}
                {hasExcellence && <circle r={radius + 11} className="excellence-aura" />}
                {hasExcellence && <circle r={radius + 6} className="excellence-ring" />}
                {guideLevel === 1 && <circle r={radius + 10} fill="none" stroke="#F5F1E8" strokeOpacity=".44" strokeWidth="2.5" className="primary-halo" />}
                <circle className={`node-circle ${hasExcellence ? "node-circle-excellence" : ""}`} r={hasExcellence ? radius - 3 : radius} fill={isChecked ? category.color : "#12141C"} stroke={isSelected ? "#F5F1E8" : category.color} strokeWidth={isSelected ? 2.8 : isChecked ? 1.5 : guideLevel === 1 ? 2.4 : 1.8} />
                {hasExcellence && <circle className="excellence-border" r={radius} fill="none" stroke="#F5C451" strokeWidth="1.8" />}
                {isChecked && !isSelected && <path d="M -6 0 L -1.5 5 L 7 -6" stroke="#0B0D13" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
                {isGuideBadgeAnchor && <text y={-radius - 13} textAnchor="middle" className={`guide-badge guide-badge-${guideLevel}`}>{guideLevel === 1 ? "MEJOR SIGUIENTE" : `NIVEL ${guideLevel}`}</text>}
                <text y={radius + 19} textAnchor="middle" className={`node-label ${isChecked ? "is-checked" : ""}`}>{mapLabel}</text>
              </g>;
            })}
            {hoveredNode && (() => {
              const radius = selected?.id === hoveredNode.id ? 29 : 15;
              const tooltipWidth = Math.min(360, Math.max(150, hoveredNode.label.length * 7 + 28));
              const tooltipX = Math.max(tooltipWidth / 2 + 12, Math.min(graphWidth - tooltipWidth / 2 - 12, hoveredNode.x));
              const below = hoveredNode.y < HEIGHT - 125;
              const tooltipY = below ? hoveredNode.y + radius + 38 : hoveredNode.y - radius - 25;
              return <g className={`node-hover-tooltip ${below ? "is-below" : "is-above"}`} transform={`translate(${tooltipX},${tooltipY})`} pointerEvents="none">
                <rect x={-tooltipWidth / 2} y="-16" width={tooltipWidth} height="25" rx="6" />
                <text y="1" textAnchor="middle">{hoveredNode.label}</text>
              </g>;
            })()}
          </g>
        </svg>
        ) : graphView === "lanes" ? (
          <GraphLanesView context={graphViewContext} selected={selected} onToggleNode={toggleLessonNode} onBackgroundClick={closeLesson} />
        ) : graphView === "radial" ? (
          <GraphRadialView context={graphViewContext} selected={selected} onToggleNode={toggleLessonNode} onBackgroundClick={closeLesson} />
        ) : (
          <GraphPathView context={graphViewContext} selected={selected} onToggleNode={toggleLessonNode} onBackgroundClick={closeLesson} />
        )}
        </div>
        )}

      </section>
      </section>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLesson(); }}>
        <section ref={lessonModalRef} className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title" aria-describedby="lesson-summary" onKeyDown={keepFocusInsideLesson} onScroll={() => { if (activeDeepDive) setActiveDeepDive(null); }} style={{ "--lesson-color": graph.categories[selected.cat].color }}>
          <header className="lesson-header">
            <div className="lesson-header-copy">
              <div className="lesson-kicker">{graph.categories[selected.cat].label} · PRIORIDAD #{selected.priority}</div>
              <div className="lesson-title-row">
              <h2 id="lesson-title">{selected.label}</h2>
              <div className={`lesson-header-score ${selectedScore?.isExtra ? "is-extra" : ""}`} aria-label={selectedScore ? `Score canónico ${selectedScore.displayScore} de ${selectedScore.displayMax}` : "Sin evaluación canónica"}>
                <div className="lesson-header-score__topline">
                  <span className="lesson-header-score__label">SCORE CANÓNICO</span>
                  {selectedScore ? <><strong>{selectedScore.displayScore}</strong><span className="lesson-header-score__max">/{selectedScore.displayMax}</span></> : <span className="lesson-header-score__empty">PENDIENTE</span>}
                </div>
                <div className="lesson-header-score__track" aria-hidden="true">
                  {selectedScore && <span style={{ width: `${Math.min(100, (selectedScore.displayScore / selectedScore.displayMax) * 100)}%` }} />}
                </div>
                <span className="lesson-header-score__detail">{selectedScore ? `${selectedScore.coveragePercent}% de cobertura · ${selectedScore.isExtra ? "excelencia extra" : "base"}` : "Evaluá tu draft cuando estés listo"}</span>
              </div>
              </div>
              <div className="lesson-status-row">
                {ttsState.status === "loading" && ttsState.chunkCount > 0 && <span className="tts-source-state tts-progress-state">PARTE {ttsState.chunkIndex}/{ttsState.chunkCount}</span>}
                {ttsState.status === "playing" && <span className="tts-source-state">PARTE {ttsState.chunkIndex}/{ttsState.chunkCount} · LECTURA DEL NAVEGADOR</span>}
                {ttsState.status === "paused" && <span className="tts-source-state tts-paused-state">LECTURA EN PAUSA · PARTE {ttsState.chunkIndex}/{ttsState.chunkCount}</span>}
                {checked.has(selected.id) ? <span className="status-badge completion-state">SUPERFICIE CUBIERTA 100%</span> : selectedCompletion ? <span className="unavailable-state">CHECKPOINT · COBERTURA {selectedCompletion.percent}%</span> : guidance.levelById.has(selected.id) ? <span className={`status-badge guide-state-${guidance.levelById.get(selected.id)}`}>{guidance.levelById.get(selected.id) === 1 ? "MEJOR SIGUIENTE" : `NIVEL ${guidance.levelById.get(selected.id)}`}</span> : missingSelectedPrerequisites.length ? <span className="unavailable-state">PRERREQUISITOS RECOMENDADOS</span> : <span className="unavailable-state">DISPONIBLE</span>}
                <span className="lesson-close-hint">Esc para cerrar · clic afuera también</span>
              </div>
            </div>
            <div className="lesson-header-actions">
              {speechSegments.length > 0 && <div className="tts-controls" aria-label="Controles de lectura del navegador">
                <button className="tts-control" type="button" aria-label="Repetir segmento actual" title="Repetir segmento actual" onClick={replaySpeech}>↻</button>
                <button className="tts-control" type="button" aria-label="Ir al segmento anterior" title="Segmento anterior" onClick={() => moveSpeechSegment(-1)} disabled={ttsState.chunkIndex <= 1}>⏮</button>
                <button className={`tts-button tts-main-control tts-${ttsState.status}`} type="button" aria-label={ttsState.status === "playing" ? "Pausar lectura" : "Reproducir lectura"} title={ttsState.status === "playing" ? "Pausar" : "Reproducir"} onClick={toggleSpeech}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {ttsState.status === "playing" ? <><path d="M7 5v14M17 5v14" /><path d="M7 5h3M7 19h3M14 5h3M14 19h3" /></> : <path d="M8 5v14l11-7-11-7Z" />}
                  </svg>
                  <span>{ttsState.status === "playing" ? "Pausa" : ttsState.status === "loading" ? `Preparando ${ttsState.chunkIndex}/${ttsState.chunkCount}` : "Play"}</span>
                </button>
                <button className="tts-control" type="button" aria-label="Ir al segmento siguiente" title="Segmento siguiente" onClick={() => moveSpeechSegment(1)} disabled={ttsState.chunkCount > 0 && ttsState.chunkIndex >= ttsState.chunkCount}>⏭</button>
              </div>}
              {speechSegments.length > 0 && <div className="tts-speed-control" aria-label="Velocidad de lectura">
                <button className="tts-speed-button" type="button" aria-label="Reducir velocidad" title="Reducir velocidad" onClick={() => changeSpeechSpeed(-1)} disabled={ttsSpeed === TTS_SPEEDS[0]}>−</button>
                <span aria-live="polite">{ttsSpeed}x</span>
                <button className="tts-speed-button" type="button" aria-label="Aumentar velocidad" title="Aumentar velocidad" onClick={() => changeSpeechSpeed(1)} disabled={ttsSpeed === TTS_SPEEDS[TTS_SPEEDS.length - 1]}>+</button>
              </div>}
              {lessonHistory.length > 0 && <button className="modal-back" onClick={goBack}>← Volver a {lessonHistory[lessonHistory.length - 1].label}</button>}
              <button ref={modalCloseRef} className="modal-close" aria-label="Cerrar lección" onClick={closeLesson}>×</button>
            </div>
          </header>

          <nav className="lesson-header-secondary" aria-label="Navegación y estado de la card">
            <section className="concept-map">
              <div className="lesson-section-label">LUGAR EN EL MAPA</div>
              <div className="concept-flow">
                <div className="flow-column">
                  <span className="flow-label">ANTES</span>
                  {selectedNavigationPrerequisites.length ? selectedNavigationPrerequisites.map((node) => <button key={node.id} className="flow-node" onClick={() => openLesson(node, true)}>{node.label}</button>) : <span className="flow-root">{activeCats.size === 1 ? "Inicio de este foco" : "Punto de partida"}</span>}
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-column current-flow">
                  <span className="flow-label">AHORA</span>
                  <span className="flow-node current-flow-node">{selected.label}</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-column">
                  <span className="flow-label">DESPUÉS</span>
                  {selectedAfterNodes.length ? selectedAfterNodes.map((node) => <button key={node.id} className="flow-node" onClick={() => openLesson(node, true)}>{node.label}</button>) : <span className="flow-root">Último eslabón</span>}
                </div>
              </div>
            </section>

            <div className="lesson-header-secondary__status">
              {nextFocusNode && <section className="next-card-nav">
                <span className="lesson-section-label">SIGUIENTE CARD EN ESTE FOCO</span>
                <button className="next-card-button" onClick={() => openLesson(nextFocusNode, true)}>
                  <span>Continuar con</span>
                  <strong>{nextFocusNode.label} <span aria-hidden="true">→</span></strong>
                </button>
              </section>}

              <section className={`lesson-check-card ${checked.has(selected.id) ? "is-complete" : ""}`}>
                <span className="lesson-section-label">COMPLETITUD</span>
                <p className="completion-explanation">
                  {checked.has(selected.id)
                    ? "Superficie conceptual cubierta al 100%. Ya podés avanzar; la profundización extra es opcional."
                    : selectedCompletion
                      ? `Cobertura conceptual: ${selectedCompletion.percent}% (${selectedCompletion.score}/${selectedCompletion.max} puntos). Score global: ${selectedScore.displayScore}/120. La profundización extra no reemplaza las ideas esenciales que faltan.`
                      : "Todavía no hay una evaluación para este nodo. Escribí tu explicación y pedí una revisión para medir la cobertura de la card."}
                </p>
                {selectedLatestAttempt && <span className="completion-score-detail">{selectedCompletion.score}/{selectedCompletion.max} cobertura · score {selectedScore.displayScore}/120</span>}
              </section>
            </div>
          </nav>

          <nav className="lesson-view-tabs" role="tablist" aria-label="Vistas de la card">
            <div className="lesson-view-tabs__heading" aria-hidden="true">
              <span>RUTA DE ESTUDIO</span>
              <strong>Del concepto al dominio</strong>
            </div>
            <button type="button" role="tab" className={lessonView === "read" ? "is-active" : ""} aria-selected={lessonView === "read"} onClick={() => { setActiveDeepDive(null); setLessonView("read"); }}>
              <span className="lesson-view-tabs__index">01</span>
              <span className="lesson-view-tabs__copy"><strong>Lectura</strong><small>Entender el concepto</small></span>
            </button>
            <button type="button" role="tab" className={lessonView === "coach" ? "is-active" : ""} aria-selected={lessonView === "coach"} onClick={() => { setActiveDeepDive(null); setLessonView("coach"); }}>
              <span className="lesson-view-tabs__index">02</span>
              <span className="lesson-view-tabs__copy"><strong>Coaching</strong><small>Ensayar tu respuesta</small></span>
            </button>
            <button type="button" role="tab" className={lessonView === "evaluate" ? "is-active" : ""} aria-selected={lessonView === "evaluate"} onClick={() => { setActiveDeepDive(null); setLessonView("evaluate"); }}>
              <span className="lesson-view-tabs__index">03</span>
              <span className="lesson-view-tabs__copy"><strong>Evaluar</strong><small>Confirmar dominio</small></span>
            </button>
          </nav>

          <div className={`lesson-layout lesson-layout--${lessonView}`}>
            <article className={`lesson-content lesson-content--${lessonView}`} aria-label={lessonView === "read" ? "Contenido de lectura" : lessonView === "coach" ? "Coaching de la explicación" : "Evaluación e historial"}>
              {lessonView === "read" && <>
              {ttsState.error && <div className="tts-error" role="alert">{ttsState.error}</div>}
              <section className="lesson-intro">
                <div className="lesson-section-heading"><span className="lesson-section-label">EN UNA FRASE</span>{speechSegmentIds.has("summary") && <SectionAudioButton segmentId="summary" active={ttsState.activeSegmentId === "summary"} onClick={playSectionSpeech} />}</div>
                <ReadingChunks id="lesson-summary" text={selected.lesson.summary} className="lesson-summary-chunks" chunkClassName={`lesson-summary ${ttsState.activeSegmentId === "summary" ? "tts-reading-text" : ""}`} />
                <div className="lesson-why-heading"><strong>Por qué importa:</strong>{speechSegmentIds.has("why") && <SectionAudioButton segmentId="why" active={ttsState.activeSegmentId === "why"} onClick={playSectionSpeech} />}</div>
                <ReadingChunks text={selected.lesson.why} className="lesson-why-chunks" chunkClassName={`lesson-why ${ttsState.activeSegmentId === "why" ? "tts-reading-text" : ""}`} />
              </section>

              <section className={`lesson-explanation ${ttsState.activeSegmentId === "explanation" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading"><span className="lesson-section-label">EXPLICACIÓN CLARA</span>{speechSegmentIds.has("explanation") && <SectionAudioButton segmentId="explanation" active={ttsState.activeSegmentId === "explanation"} onClick={playSectionSpeech} />}</div>
                <ReadingChunks text={selected.lesson.explanation} renderChunk={(chunk) => richText(chunk, 2)} />
              </section>

              {selected.lesson.audit && <section className={`lesson-audit ${ttsState.activeSegmentId === "audit" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading"><span className="lesson-section-label">{selected.lesson.explanationUsesAudit ? "RIESGOS QUE DEBÉS PODER EXPLICAR" : "CASO CONCRETO Y FALLAS"}</span>{speechSegmentIds.has("audit") && <SectionAudioButton segmentId="audit" active={ttsState.activeSegmentId === "audit"} onClick={playSectionSpeech} />}</div>
                {!selected.lesson.explanationUsesAudit && <>
                  <p><strong>Qué es:</strong> {selected.lesson.audit.primer}</p>
                  <p><strong>Ejemplo:</strong> {selected.lesson.audit.example}</p>
                </>}
                <div className="lesson-audit-failures"><strong>{selected.lesson.explanationUsesAudit ? "Qué puede salir mal:" : "Si algo sale mal:"}</strong><ul>{selected.lesson.audit.failureModes.map((failure) => <li key={failure}>{failure}</li>)}</ul></div>
              </section>}

              {selected.lesson.docNotes?.length > 0 && <section className={`lesson-doc-notes ${ttsState.activeSegmentId === "docNotes" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading"><span className="lesson-section-label">MATICES DE LA DOCUMENTACIÓN</span>{speechSegmentIds.has("docNotes") && <SectionAudioButton segmentId="docNotes" active={ttsState.activeSegmentId === "docNotes"} onClick={playSectionSpeech} />}</div>
                <p>Estas aclaraciones separan el comportamiento documentado de React o la librería de una decisión de arquitectura de la app.</p>
                <ul>{selected.lesson.docNotes.map((note) => <li key={note}>{note}</li>)}</ul>
              </section>}

              <section className={`lesson-context ${missingSelectedPrerequisites.length ? "is-blocked" : ""} ${ttsState.activeSegmentId === "context" ? "tts-reading-section" : ""}`}>
                <div className="lesson-context-heading"><span className="lesson-section-label">DÓNDE ESTAMOS EN LA RUTA</span>{speechSegmentIds.has("context") && <SectionAudioButton segmentId="context" active={ttsState.activeSegmentId === "context"} onClick={playSectionSpeech} />}</div>
                <p>{selectedLessonContext}</p>
              </section>

              {selected.lesson.prompt && <section className={`interview-prompt ${ttsState.activeSegmentId === "prompt" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading"><span className="lesson-section-label">POSIBLE CONSIGNA EN VIVO</span>{speechSegmentIds.has("prompt") && <SectionAudioButton segmentId="prompt" active={ttsState.activeSegmentId === "prompt"} onClick={playSectionSpeech} />}</div>
                <p>{selected.lesson.prompt}</p>
              </section>}

              {selected.lesson.table && <section className={`lesson-section lesson-table-section ${ttsState.activeSegmentId === "table" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading"><div className="lesson-heading-copy"><span className="lesson-section-label">{selected.lesson.tableTitle ?? "MAPA RÁPIDO"}</span><span>{selected.lesson.tableLabel ?? "Relación entre conceptos"}</span></div>{speechSegmentIds.has("table") && <SectionAudioButton segmentId="table" active={ttsState.activeSegmentId === "table"} onClick={playSectionSpeech} />}</div>
                <div className="lesson-table-wrap"><table className="lesson-table"><thead><tr>{selected.lesson.table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{selected.lesson.table.rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
              </section>}

              {(selected.lesson.mermaid || selected.lesson.diagram) && <section className={`lesson-section lesson-diagram-section ${ttsState.activeSegmentId === "diagram" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading"><div className="lesson-heading-copy"><span className="lesson-section-label">DIAGRAMA</span><span>{selected.lesson.diagramTitle}</span></div>{speechSegmentIds.has("diagram") && <SectionAudioButton segmentId="diagram" active={ttsState.activeSegmentId === "diagram"} onClick={playSectionSpeech} />}</div>
                {selected.lesson.mermaid ? <MermaidDiagram chart={selected.lesson.mermaid} /> : <div className="business-diagram">
                  {selected.lesson.diagram.map((item, index) => <React.Fragment key={`${item.label}-${index}`}>
                    <div className="business-diagram-node"><strong>{item.label}</strong><span>{item.detail}</span></div>
                    {index < selected.lesson.diagram.length - 1 && <span className="business-diagram-arrow">→</span>}
                  </React.Fragment>)}
                </div>}
              </section>}

              <section className={`lesson-section lesson-example-section ${ttsState.activeSegmentId === "example" ? "tts-reading-section" : ""}`}>
                <div className="lesson-section-heading lesson-code-heading">
                  <div className="lesson-code-title"><span className="lesson-section-label">EJEMPLO</span><span>{selected.lesson.codeLabel}</span></div>
                  <div className="lesson-code-actions">
                    {speechSegmentIds.has("example") && <SectionAudioButton segmentId="example" active={ttsState.activeSegmentId === "example"} onClick={playSectionSpeech} />}
                    <button className="code-info-button" type="button" aria-expanded={showCodeExplanation} aria-controls="code-explanation" aria-label={showCodeExplanation ? "Ocultar explicación del snippet" : "Mostrar explicación del snippet"} title={showCodeExplanation ? "Ocultar explicación" : "Explicar este snippet"} onClick={() => setShowCodeExplanation((value) => !value)}>i</button>
                  </div>
                </div>
                {showCodeExplanation && <div id="code-explanation" className="code-explanation"><p>{selectedCodeNarration}</p></div>}
                <pre className="code-block"><code>{selected.lesson.code}</code></pre>
              </section>

              <div className={`lesson-columns ${selected.lesson.pitfalls.length ? "" : "is-single"}`}>
                <section className={`lesson-section lesson-list-section ${ttsState.activeSegmentId === "steps" ? "tts-reading-section" : ""}`}>
                  <div className="lesson-section-heading"><span className="lesson-section-label">PASO A PASO</span>{speechSegmentIds.has("steps") && <SectionAudioButton segmentId="steps" active={ttsState.activeSegmentId === "steps"} onClick={playSectionSpeech} />}</div>
                  <ol className="lesson-steps">{selected.lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                </section>
                {selected.lesson.pitfalls.length > 0 && <section className={`lesson-section lesson-list-section warning-section ${ttsState.activeSegmentId === "pitfalls" ? "tts-reading-section" : ""}`}>
                  <div className="lesson-section-heading"><span className="lesson-section-label">TRADE-OFFS Y ERRORES</span>{speechSegmentIds.has("pitfalls") && <SectionAudioButton segmentId="pitfalls" active={ttsState.activeSegmentId === "pitfalls"} onClick={playSectionSpeech} />}</div>
                  <ul className="lesson-pitfalls">{selected.lesson.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul>
                </section>}
              </div>

              <section className={`lesson-takeaway ${ttsState.activeSegmentId === "takeaway" ? "tts-reading-section" : ""}`}><div className="lesson-section-heading"><span className="lesson-section-label">IDEA PARA RECORDAR</span>{speechSegmentIds.has("takeaway") && <SectionAudioButton segmentId="takeaway" active={ttsState.activeSegmentId === "takeaway"} onClick={playSectionSpeech} />}</div><p>{selected.lesson.takeaway}</p></section>

              </>}

              <ParaphraseReview
                graphId={graphKey}
                node={selected}
                viewMode={lessonView === "coach" ? "coach" : lessonView === "evaluate" ? "evaluate" : "hidden"}
                onEvaluationSaved={handleEvaluationSaved}
                onRequestCoach={() => setLessonView("coach")}
                onNavigateBack={goBack}
                onNavigateNext={nextFocusNode ? () => openLesson(nextFocusNode, true) : undefined}
                hasPrevious={lessonHistory.length > 0}
                hasNext={Boolean(nextFocusNode)}
              />

              {lessonView === "read" && <>
              {selectedInterviewQuestions.length > 0 && <section className="lesson-interview-questions">
                <details>
                  <summary><span>COBERTURA DE ENTREVISTA</span><strong>{unlockedInterviewQuestions.length}/{selectedInterviewQuestions.length} desbloqueadas</strong></summary>
                  <ol>{interviewQuestionStates.map(({ question, missingNodes }) => <li className={missingNodes.length ? "is-locked" : "is-unlocked"} key={question.id}><span>#{question.id}</span>{question.title}<em>{missingNodes.length ? `Bloqueada: completá ${missingNodes.map((node) => node.label).join(" · ")}.` : "Incluida en el quiz de esta card."}</em></li>)}</ol>
                  <a href={graph.interviewQuestionSource} target="_blank" rel="noreferrer">Abrir la lista de referencia de GreatFrontend ↗</a>
                </details>
              </section>}

              {selected.lesson.sources?.length > 0 && <section className="lesson-sources">
                <span className="lesson-section-label">FUENTES PARA VERIFICAR Y PROFUNDIZAR</span>
                <div>{selected.lesson.sources.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label}<span aria-hidden="true">↗</span></a>)}</div>
              </section>}

              {selectedRelatedNodes.length > 0 && <section className="lesson-related">
                <span className="lesson-section-label">RECORDATORIOS RELACIONADOS</span>
                <p>Si necesitás repasar una pieza antes de continuar, abrila sin perder esta lección.</p>
                <div>{selectedRelatedNodes.map((node) => <button key={node.id} className="related-link" onClick={() => openLesson(node, true)}>Abrir: {node.label} →</button>)}</div>
              </section>}
              </>}
            </article>

            <aside className="lesson-aside">
              <section className="concept-map">
                <div className="lesson-section-label">LUGAR EN EL MAPA</div>
                <div className="concept-flow">
                  <div className="flow-column">
                    <span className="flow-label">ANTES</span>
                    {selectedNavigationPrerequisites.length ? selectedNavigationPrerequisites.map((node) => <button key={node.id} className="flow-node" onClick={() => openLesson(node, true)}>{node.label}</button>) : <span className="flow-root">{activeCats.size === 1 ? "Inicio de este foco" : "Punto de partida"}</span>}
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-column current-flow">
                    <span className="flow-label">AHORA</span>
                    <span className="flow-node current-flow-node">{selected.label}</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-column">
                    <span className="flow-label">DESPUÉS</span>
                    {selectedAfterNodes.length ? selectedAfterNodes.map((node) => <button key={node.id} className="flow-node" onClick={() => openLesson(node, true)}>{node.label}</button>) : <span className="flow-root">Último eslabón</span>}
                  </div>
                </div>
              </section>

              {nextFocusNode && <section className="next-card-nav">
                <span className="lesson-section-label">SIGUIENTE CARD EN ESTE FOCO</span>
                <button className="next-card-button" onClick={() => openLesson(nextFocusNode, true)}>
                  <span>Continuar con</span>
                  <strong>{nextFocusNode.label} <span aria-hidden="true">→</span></strong>
                </button>
              </section>}

              <section className={`lesson-check-card ${checked.has(selected.id) ? "is-complete" : ""}`}>
                <span className="lesson-section-label">COMPLETITUD</span>
                <p className="completion-explanation">
                  {checked.has(selected.id)
                    ? "Superficie conceptual cubierta al 100%. Ya podés avanzar; la profundización extra es opcional."
                    : selectedCompletion
                      ? `Cobertura conceptual: ${selectedCompletion.percent}% (${selectedCompletion.score}/${selectedCompletion.max} puntos). Score global: ${selectedScore.displayScore}/120. La profundización extra no reemplaza las ideas esenciales que faltan.`
                      : "Todavía no hay una evaluación para este nodo. Escribí tu explicación y pedí una revisión para medir la cobertura de la card."}
                </p>
                {selectedLatestAttempt && <span className="completion-score-detail">{selectedCompletion.score}/{selectedCompletion.max} cobertura · score {selectedScore.displayScore}/120</span>}
              </section>
            </aside>
          </div>
          <DeepDivePopover active={activeDeepDive} onClose={closeDeepDive} />
        </section>
      </div>}
    </main>
  );
}

