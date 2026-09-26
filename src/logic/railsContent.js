// Contenido Rails portado desde legacy/App.jsx (v3): contexto de categorías,
// overrides de entrevista, correcciones conceptuales y milestones.
import LESSONS from "../lessons.js";

export const RAILS_CATEGORY_CONTEXT = {
  fundamentals: "Estamos armando el recorrido de una request Rails, desde el lenguaje y las convenciones hasta la respuesta HTTP.",
  activerecord: "Ahora que sabés cómo una request llega al controller, entramos en la capa que modela y persiste los datos.",
  patterns: "Con request, datos y transacciones claros, ahora decidimos dónde vive la lógica de negocio y cómo cambia sin acoplarse.",
  sti: "Con asociaciones básicas resueltas, ahora modelamos variantes y capacidades compartidas entre registros.",
  infra: "La aplicación ya funciona en lo básico; ahora definimos su contrato con React, su seguridad y su operación en distintos entornos.",
  assets: "Esta rama explica cómo Rails publica los archivos que el navegador necesita y qué alternativa usa cada generación de proyectos.",
  testing: "Después de entender el comportamiento, definimos cómo demostrarlo con tests rápidos y de alcance correcto.",
};

export const INTERVIEW_LESSON_OVERRIDES = {
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

export const CONCEPTUAL_CORRECTIONS = {
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

export const RAILS_MILESTONES = [
  { id: "rails_request", label: "Request Rails", description: "Podés explicar cómo entra, se enruta y responde una request.", color: "#E8A33D", nodeIds: ["ruby_basics", "mvc", "rack", "routing_rest", "controllers_params", "responses_errors"] },
  { id: "rails_data", label: "Datos y Active Record", description: "Modelás persistencia, asociaciones, consultas e integridad.", color: "#CC342D", nodeIds: ["ar_pattern", "ar_orm", "migrations", "validations", "assoc_belongs", "transactions", "scopes", "n_plus_one", "eager_loading", "assoc_through"] },
  { id: "rails_business", label: "Diseño de negocio", description: "Elegís dónde vive cada regla y cómo coordinar flujos complejos.", color: "#5AA9FF", nodeIds: ["service_object", "query_object", "form_object", "callbacks", "jobs_mailers", "strategy_pattern", "adapter_pattern"] },
  { id: "rails_cases", label: "Casos de entrevista", description: "Podés diseñar checkout, reporting y registro multi-modelo.", color: "#38BDF8", nodeIds: ["case_checkout", "case_reporting", "case_signup"] },
  { id: "rails_domain", label: "Modelado de dominio", description: "Entendés STI, polimorfismo y sus trade-offs.", color: "#A78BFA", nodeIds: ["sti", "sti_tradeoffs", "polymorphic", "case_content"] },
  { id: "rails_api_security", label: "API, React y seguridad", description: "Conectás Rails con un frontend y protegés el sistema.", color: "#94A3B8", nodeIds: ["api_mode", "serialization_cors", "auth_security", "react_rails_auth"] },
  { id: "rails_quality", label: "Testing y operación", description: "Probás comportamiento y entendés el entorno de ejecución.", color: "#4ADE80", nodeIds: ["rspec_basics", "factory_bot", "spec_types", "gemfile", "env_logger"] },
  { id: "rails_assets", label: "Assets de Rails", description: "Podés explicar fingerprinting y las opciones modernas.", color: "#2DD4BF", nodeIds: ["asset_pipeline", "modern_assets"] },
];
