const LEARNING_EXPLANATIONS = {
  ruby_basics: {
    explanation: "Antes de estudiar Rails necesitás poder leer sus ejemplos. Ruby usa una sintaxis compacta, pero las ideas son familiares: clases, métodos, objetos, colecciones y excepciones. Este nodo no busca que programes Ruby avanzado; busca que un bloque como User.transaction do ... end no te distraiga del concepto de transacción que viene después.",
  },
  mvc: {
    explanation: "Una aplicación web recibe una petición, decide qué hacer y devuelve una respuesta. MVC reparte ese trabajo: el Controller recibe la petición y coordina, el Model representa datos y reglas, y la View muestra HTML cuando la app tiene vistas. Rails añade convenciones: si llamás Post a un modelo, Rails espera una tabla posts y ciertas carpetas con nombres predecibles.",
  },
  rack: {
    explanation: "Estamos todavía antes del router. Cuando el navegador pide una URL, un servidor web entrega esa petición a Rails mediante Rack. Rack es solo un contrato común para que servidor, middleware y Rails puedan hablar entre sí; no es una base de datos, ni una pantalla, ni el router.",
  },
  routing_rest: {
    explanation: "Routing es el mapa que dice qué código se ejecuta para cada petición HTTP. Una ruta combina un verbo como GET o POST con una URL como /posts. RESTful es una convención para nombrar esas rutas cuando trabajás con recursos: un post, una orden o un usuario. Rails usa nombres estándar para que todos sepan qué acción hace cada endpoint.",
    table: {
      columns: ["Petición", "Acción Rails", "Significado"],
      rows: [
        ["GET /posts", "index", "listar muchos posts"],
        ["GET /posts/42", "show", "ver un solo post con id 42"],
        ["POST /posts", "create", "crear un post con datos enviados"],
        ["PATCH /posts/42", "update", "cambiar el post 42"],
        ["DELETE /posts/42", "destroy", "eliminar el post 42"],
      ],
    },
  },
  controllers_params: {
    explanation: "Después de que una ruta eligió una acción, el Controller recibe los datos de la petición. params es el contenedor de esos datos: por ejemplo, lo que envía un formulario o un JSON. Strong Parameters es una lista explícita de campos que aceptás; evita que el cliente cambie atributos que no debería poder controlar.",
  },
  responses_errors: {
    explanation: "El trabajo visible de una acción de controller termina con una respuesta HTTP. Esa respuesta tiene un status, por ejemplo 200 o 404, y un body, por ejemplo JSON o HTML. Diseñar errores significa decidir qué fallas son esperables y convertirlas en una respuesta clara para el cliente, sin exponer detalles internos.",
  },
  ar_pattern: {
    explanation: "Active Record es la forma en que Rails representa una fila de base de datos como un objeto Ruby. Un Post puede tener title, validarse y guardarse con post.save. Esto se parece a Eloquent: Rails prioriza una API directa para CRUD, aunque mezcla datos, consultas y persistencia en el mismo modelo.",
  },
  ar_orm: {
    explanation: "CRUD significa crear, leer, actualizar y borrar registros. En Rails, métodos como where y order no suelen traer datos inmediatamente: devuelven una Relation, es decir, un objeto que representa una consulta que todavía puede seguir construyéndose. Cuando la recorrés o necesitás el resultado, Rails ejecuta SQL.",
  },
  migrations: {
    explanation: "Una migration es un archivo versionado que cambia el esquema de la base: crear una tabla, agregar una columna o un índice. Es el equivalente de una migration de Phinx. Un índice es una estructura que hace más rápidas ciertas búsquedas; una constraint es una regla que la propia base obliga, aunque el código tenga un bug.",
  },
  validations: {
    explanation: "Las validaciones son reglas de la aplicación antes de guardar un modelo: por ejemplo, que un título exista o que un email tenga formato. Sirven para mostrar errores útiles al usuario. No sustituyen las reglas de la base de datos: si algo debe ser imposible incluso con dos requests simultáneas, también necesita una constraint o índice adecuado.",
  },
  assoc_belongs: {
    explanation: "Una asociación describe cómo se conectan dos tipos de datos. Si un comentario pertenece a un post, cada fila comments guarda post_id. Por eso Comment usa belongs_to :post y Post usa has_many :comments. Rails usa esas declaraciones para darte métodos como post.comments y comment.post sin escribir el join manual.",
  },
  transactions: {
    explanation: "Usá una transacción cuando varias escrituras representan una sola decisión de negocio. Por ejemplo, crear una orden y sus items debe suceder todo o nada: si falla un item, no querés una orden incompleta. La transacción protege cambios dentro de la base de datos; no puede deshacer un email ya enviado o un cobro hecho a Stripe.",
  },
  scopes: {
    explanation: "Un scope es un nombre reutilizable para una consulta frecuente. En vez de repetir dónde se filtra por published: true, definís published y lo combinás con otras consultas. Es útil mientras siga siendo una condición pequeña y clara; si empieza a recibir muchos filtros y joins, el próximo paso es un Query Object.",
  },
  n_plus_one: {
    explanation: "N+1 aparece cuando cargás una lista y luego, dentro de un loop, Rails hace otra consulta por cada elemento para buscar una relación. Por ejemplo, listar 100 posts y pedir post.author en cada vuelta puede producir 101 consultas. El código parece simple, pero el costo crece con la cantidad de filas.",
  },
  eager_loading: {
    explanation: "Eager loading significa cargar antes las relaciones que sabés que vas a leer. Con includes(:author), Rails evita pedir el autor una vez por cada post. No es magia de performance: cambia menos consultas por más datos en memoria, por eso se usa cuando miraste el acceso real y detectaste un N+1.",
  },
  assoc_through: {
    explanation: "A veces la relación entre dos cosas también tiene información propia. Un estudiante y un curso se conectan por Enrollment, que puede guardar fecha, estado o nota. has_many :through permite navegar de Student a Course, sin ocultar que Enrollment es un modelo importante y no solo una tabla técnica.",
  },
  service_object: {
    explanation: "Un Service Object representa un caso de uso completo, no una tabla. Por ejemplo, crear una orden puede coordinar datos, una transacción, una integración y un job. El controller entrega la entrada HTTP; el service nombra y organiza la decisión de negocio. Esto evita tanto controllers gigantes como modelos con responsabilidades ajenas.",
  },
  case_checkout: {
    explanation: "Este es un ejercicio de diseño que combina nodos anteriores. Una orden necesita guardarse de forma consistente, cobrar con un proveedor externo y luego notificar. La respuesta esperada no es una clase perfecta: es que expliques límites claros entre HTTP, transacción de base, integración externa y trabajo asíncrono.",
  },
  query_object: {
    explanation: "Un Query Object es una clase cuyo único trabajo es construir una consulta compleja con un nombre de negocio. En vez de esconder filtros, joins y orden dentro de un controller, la consulta vive en un objeto que recibe filtros y devuelve una Relation. Así se puede testear, paginar y reutilizar sin mezclarla con escrituras.",
  },
  case_reporting: {
    explanation: "Este caso usa Query Object para resolver una pantalla típica de producto: filtros, orden, página de resultados y datos relacionados. La idea es no traer toda la base al navegador. La API recibe filtros permitidos, consulta solo la página necesaria y evita N+1 al preparar el JSON.",
  },
  form_object: {
    explanation: "Un Form Object representa los datos que llegan en un formulario cuando no corresponden exactamente a una sola tabla. Por ejemplo, una pantalla de registro puede pedir datos de User y Profile juntos. El objeto valida ese conjunto de campos y luego coordina la creación; no reemplaza a los modelos que sí representan entidades reales.",
  },
  case_signup: {
    explanation: "Este caso convierte una pantalla de registro en una operación consistente. El Form Object junta y valida la entrada; la transacción crea User y Profile como una sola unidad; un job manda la bienvenida fuera de la request. Es la respuesta adecuada cuando el negocio habla de un flujo, no simplemente de guardar una fila.",
  },
  jobs_mailers: {
    explanation: "Un job es trabajo que se ejecuta fuera de la respuesta HTTP, por ejemplo enviar un email, generar un CSV o llamar a un servicio lento. Active Job es la interfaz de Rails para encolar ese trabajo y Action Mailer construye el email. La request responde rápido y el sistema puede reintentar si algo falla.",
  },
  callbacks: {
    explanation: "Un callback ejecuta código automáticamente en momentos del ciclo de vida de un modelo, por ejemplo después de confirmar una creación en la base. Es cómodo para efectos pequeños ligados al dato. El trade-off es que el flujo queda escondido: crear un User puede disparar algo sin que el controller ni el service lo muestren.",
  },
  strategy_pattern: {
    explanation: "Strategy se usa cuando una misma decisión puede tener varios algoritmos intercambiables. Por ejemplo, calcular envío standard, express o pickup. En lugar de un service lleno de if según el tipo, cada estrategia implementa la misma operación. El código que la usa no necesita saber el detalle de cada fórmula.",
  },
  adapter_pattern: {
    explanation: "Adapter protege a tu aplicación de la forma particular de una integración externa. Tu caso de uso quiere cobrar una orden; Stripe puede llamar a eso PaymentIntent.create y otro proveedor usar otra API. El adapter traduce entre ambos idiomas para que el resto de la aplicación no dependa directamente de un SDK.",
  },
  sti: {
    explanation: "Single Table Inheritance, o STI, es una forma de guardar variantes de una misma familia en una sola tabla. Por ejemplo, Car y Motorcycle pueden vivir en vehicles y una columna type indica qué clase Ruby debe crear Rails al leer cada fila. Es útil si comparten casi todos sus atributos y comportamiento.",
  },
  sti_tradeoffs: {
    explanation: "STI ahorra tablas y permite consultar toda una familia fácilmente, pero hace que cada subtipo comparta el mismo esquema. Si ElectricCar empieza a necesitar muchas columnas que Motorcycle nunca usa, aparecen muchos NULL y reglas condicionales. La decisión depende de cuánto van a evolucionar juntos los tipos.",
  },
  polymorphic: {
    explanation: "Una asociación polimórfica permite que un registro se relacione con modelos de tipos distintos. Un Comment puede pertenecer a un Post o a un Video usando dos columnas: commentable_type y commentable_id. No es STI: STI modela variantes de una misma cosa; polimorfismo agrega una capacidad común a cosas diferentes.",
  },
  case_content: {
    explanation: "Este caso aplica la asociación polimórfica a una necesidad reconocible: comentarios reutilizables para posts, videos o tickets. En entrevista conviene aclarar el beneficio y el costo: evitás repetir tablas de comentarios, pero la base ya no puede usar una foreign key tradicional para verificar todos los tipos posibles.",
  },
  api_mode: {
    explanation: "Una app Rails API-only no renderiza HTML como responsabilidad principal; responde JSON para que un frontend como React lo consuma. La arquitectura sigue teniendo routes, controllers, modelos y servicios. La diferencia es que la salida usual es un contrato JSON con status HTTP, no una vista ERB.",
  },
  serialization_cors: {
    explanation: "Serializar significa elegir exactamente qué datos se transforman en JSON y con qué nombres. CORS es una regla del navegador que decide desde qué origen web se permite llamar a la API. Son dos responsabilidades distintas: el serializer cuida el contrato de datos; CORS controla qué frontend puede hacer la request desde el browser.",
  },
  auth_security: {
    explanation: "Autenticación responde quién hizo la request; autorización responde si esa persona puede hacer esta acción sobre este recurso. Strong params limita qué campos entran, CSRF protege requests autenticadas por cookies y CORS regula orígenes del navegador. Son capas distintas que se complementan, no sinónimos.",
  },
  asset_pipeline: {
    explanation: "El asset pipeline prepara archivos estáticos para el navegador: CSS, JavaScript, imágenes y fuentes. En Rails clásico, Sprockets los procesa y produce un manifest con nombres fingerprinted. El fingerprint cambia cuando cambia el contenido, así el navegador puede cachear mucho tiempo sin usar una versión vieja después de deployar.",
  },
  modern_assets: {
    explanation: "Rails tiene varias generaciones de manejo de JavaScript. Sprockets es el pipeline clásico; Webpacker fue una integración de Webpack usada en apps Rails intermedias; import maps y jsbundling son alternativas actuales. Para un frontend React separado, normalmente React tiene su propio build y Rails se concentra en la API.",
  },
  rspec_basics: {
    explanation: "RSpec describe comportamiento con ejemplos ejecutables. describe dice qué objeto o método se está probando, it dice el resultado esperado y expect verifica el resultado. No necesitás memorizar muchos matchers al inicio: la habilidad importante es formular una promesa clara que el código debe cumplir.",
  },
  factory_bot: {
    explanation: "FactoryBot evita repetir setup de datos en tests. build crea un objeto en memoria y create lo guarda en la base de test. Una factory ofrece defaults razonables y traits para estados como published, pero no debe ocultar tantos datos que ya no se entienda qué escenario está probando la spec.",
  },
  spec_types: {
    explanation: "Cada tipo de spec mira la aplicación desde un alcance diferente. Una model spec prueba reglas de un modelo; una service spec prueba un caso de uso sin HTTP; una request spec llama una ruta real y verifica status y JSON. Elegir el alcance correcto hace que el test sea más rápido y que una falla sea más fácil de ubicar.",
  },
  gemfile: {
    explanation: "Gemfile es la lista declarativa de librerías Ruby que usa el proyecto y Gemfile.lock guarda las versiones exactas resueltas. Es el paralelo de composer.json y composer.lock. Bundler instala esa combinación y bundle exec ejecuta comandos usando exactamente esas dependencias.",
  },
  env_logger: {
    explanation: "La configuración cambia según el entorno: una base local, una URL de producción o una key privada. ENV y Rails Credentials mantienen esos valores fuera del código. Rails.logger registra eventos con contexto, como un order_id, para poder entender qué pasó después sin guardar secretos en los logs.",
  },
};

export default LEARNING_EXPLANATIONS;

