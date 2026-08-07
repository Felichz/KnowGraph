const CLARIFIED_BULLETS = {
  ruby_basics: {
    steps: ["Un símbolo como :pending es un valor corto que Rails usa para nombrar estados, opciones o claves; no es una variable ni una clase.", "Un Hash como { name: \"Ana\" } agrupa pares clave-valor, parecido a un objeto JavaScript o array asociativo de PHP.", "Un bloque do ... end es código que un método ejecuta después; each lo ejecuta por cada elemento y transaction lo ejecuta dentro de una transacción.", "El signo ! al final de un método suele avisar que la versión es estricta; por ejemplo save! lanza un error si no puede guardar."],
    pitfalls: ["El signo ! es una convención frecuente, no una regla universal de Ruby; siempre mirá qué promete el método concreto.", "No hace falta traducir Ruby mentalmente a PHP palabra por palabra: primero identificá el objetivo del código y luego la sintaxis."],
  },
  mvc: {
    steps: ["La ruta decide qué acción de Controller recibe una petición.", "El Controller reúne lo necesario para responder; no debería contener toda la lógica de negocio ni saber detalles de la base.", "El Model representa datos y reglas; la View muestra HTML cuando la aplicación tiene interfaz renderizada por Rails.", "Las convenciones conectan nombres: Post suele usar la tabla posts y PostsController suele buscar vistas dentro de views/posts."],
    pitfalls: ["MVC no significa que todo código de una feature deba vivir en tres archivos; Rails también usa services, queries y jobs para responsabilidades específicas.", "Cambiar nombres o carpetas sin necesidad obliga a configurar lo que Rails normalmente infiere solo."],
  },
  rack: {
    steps: ["El navegador manda HTTP y un servidor como Puma recibe esa conexión.", "Rack convierte esa llegada en un formato que Rails y sus middlewares pueden procesar.", "Un middleware es una capa que corre antes o después de Rails para tareas repetidas, como leer cookies, registrar logs o validar CSRF.", "Después del router y controller, Rack devuelve al servidor el status, headers y body que viajarán al navegador."],
    pitfalls: ["Rack no decide la ruta ni consulta la base de datos; solo conecta piezas del ciclo HTTP.", "El orden del middleware importa porque una capa posterior depende de lo que una capa anterior ya hizo."],
  },
  routing_rest: {
    steps: ["Una ruta combina un verbo HTTP y una URL; por ejemplo GET /posts significa pedir información y POST /posts significa enviar una creación.", "Un recurso es una cosa del negocio que tiene identidad, como un post u orden; Rails genera rutas estándar para trabajar con ese recurso.", "index significa listar varios registros, show significa ver uno, create significa crear uno, update cambiarlo y destroy eliminarlo.", "resources :posts crea ese mapa de rutas sin tener que declarar una línea por cada acción."],
    pitfalls: ["GET /posts y GET /posts/42 son peticiones distintas: una pide una colección y la otra un único elemento.", "REST organiza las operaciones comunes; para una acción especial de negocio se puede agregar una ruta extra cuando ya esté claro qué necesidad resuelve."],
  },
  controllers_params: {
    steps: ["El Controller recibe la petición que el router ya eligió y decide cómo responder.", "params contiene datos enviados por URL, formulario o JSON; por ejemplo name y timezone de un perfil.", "params.require exige que exista un grupo de datos esperado y permit enumera los campos que sí aceptás.", "Antes de pasar datos a un modelo o service, el controller descarta campos que el cliente no tiene derecho a modificar."],
    pitfalls: ["Strong Parameters limita qué campos entran, pero no comprueba si un email es válido ni si una orden tiene stock; esas son otras reglas.", "Poner consultas complejas, transacciones y llamadas externas dentro del controller hace difícil probar y entender una acción."],
  },
  responses_errors: {
    steps: ["Toda acción termina con una respuesta HTTP: un status que explica el resultado y un body con JSON, HTML o nada.", "200 significa que la operación salió bien; 201 suele indicar que se creó algo; 404 que no existe; 422 que los datos no cumplen reglas.", "render envía contenido en la respuesta actual; redirect_to pide al navegador que haga otra petición a una URL.", "Un error esperado se traduce a un status y mensaje claros para que el frontend sepa qué hacer."],
    pitfalls: ["Responder 200 para un error obliga al frontend a adivinar si la operación realmente funcionó.", "No devuelvas stack traces, secretos ni detalles internos de errores inesperados al cliente."],
  },
  ar_pattern: {
    steps: ["Cada instancia de un modelo representa normalmente una fila: un Post Ruby corresponde a un registro de la tabla posts.", "El modelo contiene atributos y métodos como save, por eso Active Record junta objeto y persistencia en una API directa.", "Esto se parece a Eloquent: podés crear, buscar y guardar sin escribir SQL para cada operación.", "La conveniencia es alta para CRUD; cuando el dominio crece, separás casos de uso en services y consultas complejas en Query Objects."],
    pitfalls: ["Active Record no significa que el modelo deba contener todos los flujos de negocio de la aplicación.", "Una abstracción extra como Repository solo vale si oculta una complejidad real; repetir User.find dentro de otra clase no mejora el diseño."],
  },
  ar_orm: {
    steps: ["Post.create crea y guarda un registro; update cambia atributos de un registro existente; destroy lo elimina.", "where, order y limit construyen una Relation: una consulta preparada que todavía puede recibir más filtros.", "Rails ejecuta la consulta cuando necesitás los registros, por ejemplo al recorrerla con each o pedir sus resultados.", "find busca por id y falla si no existe; find_by busca por condición y devuelve nil si no encuentra nada."],
    pitfalls: ["Cargar registros demasiado temprano con each o to_a impide seguir componiendo la consulta y puede traer más datos de los necesarios.", "El ORM hace SQL más cómodo, pero no reemplaza índices, constraints ni revisar qué query termina ejecutándose."],
  },
  migrations: {
    steps: ["Una migration describe un cambio de estructura de base y queda guardada en Git junto al código.", "rails db:migrate aplica las migrations pendientes en orden; así todos los entornos llegan al mismo esquema.", "Un índice acelera búsquedas sobre columnas usadas en filtros, joins u orden; por ejemplo buscar por user_id.", "Una constraint es una regla aplicada por la base, como no permitir un valor nulo o una referencia inexistente."],
    pitfalls: ["No edites una migration que ya corrió en producción; creá otra migration que cambie o corrija el esquema.", "Agregar una columna nueva no completa automáticamente datos viejos; a veces necesitás un proceso de backfill."],
  },
  validations: {
    steps: ["Una validación revisa un modelo antes de guardarlo; si falla, save devuelve false y errors explica el motivo.", "Presence evita datos vacíos, length limita tamaños y format comprueba una forma como la de un email.", "Las validaciones dan feedback útil al usuario y evitan guardar estados obviamente inválidos desde la aplicación.", "Para reglas críticas como unicidad, agregás además una regla de base: un índice unique evita duplicados bajo concurrencia."],
    pitfalls: ["Una validación de Ruby sola no protege contra dos requests simultáneas que intentan guardar el mismo valor.", "No mezcles una operación de negocio completa dentro de validaciones si necesita llamar servicios externos o coordinar varios modelos."],
  },
  assoc_belongs: {
    steps: ["Una foreign key es una columna que guarda el id de otro registro; comment.post_id apunta al post dueño del comentario.", "belongs_to :post en Comment significa que un comentario tiene un post dueño.", "has_many :comments en Post significa que un post puede recuperar todos los comentarios que tienen su post_id.", "Rails genera métodos de navegación como comment.post y post.comments usando esa relación declarada."],
    pitfalls: ["La asociación Ruby no crea por sí sola una foreign key segura en la base; la migration debe crearla.", "Elegí dependent: :destroy solo si borrar el dueño realmente debe borrar los registros asociados; es una decisión de negocio."],
  },
  transactions: {
    steps: ["Una transacción abre un bloque protegido para varias escrituras relacionadas.", "Si todo el bloque termina bien, Rails confirma los cambios; si una operación lanza error, Rails revierte los cambios de ese bloque.", "Crear una orden y todos sus items juntos evita que exista una orden a medias.", "Los métodos con ! son útiles dentro de una transacción porque una falla lanza error y activa el rollback."],
    pitfalls: ["Una transacción solo revierte cambios de la base de datos; no puede des-enviar un email ni des-cobrar una tarjeta.", "No mantengas una transacción abierta mientras esperás una red externa, porque bloquea recursos de la base más tiempo."],
  },
  scopes: {
    steps: ["Un scope da un nombre a una consulta pequeña que se repite, como published para posts publicados.", "El scope devuelve una Relation, por lo que podés combinarlo con otros filtros: Post.published.order(...).", "El nombre debe expresar una idea de negocio entendible, no un detalle técnico confuso.", "Si la consulta necesita muchos parámetros, joins y condiciones, la movés a un Query Object con una interfaz más clara."],
    pitfalls: ["Un scope enorme puede esconder SQL costoso y hacer difícil saber qué registros devuelve.", "Un scope debe seguir devolviendo una consulta encadenable; devolver nil rompe combinaciones posteriores."],
  },
  n_plus_one: {
    steps: ["Primero cargás una lista, por ejemplo 100 posts, con una consulta.", "Después un loop pide post.author para cada post; si author no está cargado, Rails hace otra consulta por cada vuelta.", "El resultado es una consulta inicial más N consultas adicionales, de ahí el nombre N+1.", "Los logs SQL o herramientas como Bullet permiten detectar el patrón mirando cuántas queries produce una pantalla."],
    pitfalls: ["El problema no es usar un loop; el problema es que el loop activa acceso a datos repetido.", "No optimices por intuición: revisá logs y tamaño real de la lista para confirmar el costo."],
  },
  eager_loading: {
    steps: ["includes(:author) le dice a Rails que vas a necesitar los autores junto con los posts.", "Rails carga esa relación antes del loop, de modo que post.author no necesita una nueva consulta cada vez.", "preload y eager_load son variantes internas; para una entrevista alcanza saber que Rails puede usar consultas separadas o un join según el caso.", "La meta es mirar los datos ya cargados, no pedirlos repetidamente dentro de una colección."],
    pitfalls: ["Cargar todas las relaciones por defecto puede traer miles de filas y gastar memoria innecesaria.", "includes resuelve N+1 solo para las relaciones que declaraste y realmente usás."],
  },
  assoc_through: {
    steps: ["Student y Course tienen una relación muchos-a-muchos: un estudiante puede tener varios cursos y un curso varios estudiantes.", "Enrollment es el modelo del medio que guarda student_id y course_id.", "Como Enrollment es un modelo real, puede guardar estado, fecha, nota o validaciones.", "has_many :courses, through: :enrollments permite preguntar student.courses sin perder el acceso a student.enrollments."],
    pitfalls: ["No escondas una relación importante en una tabla anónima si tiene datos propios que el negocio necesita leer.", "Si la combinación de los dos ids debe ser única, agregá una constraint o índice unique para evitar duplicados."],
  },
  service_object: {
    steps: ["Un Service Object es una clase que representa una acción del negocio, como CheckoutOrder o CancelSubscription.", "Recibe datos y colaboradores necesarios, ejecuta los pasos en orden y devuelve un resultado claro.", "El controller queda enfocado en HTTP y el modelo en datos; el service coordina la operación que los une.", "Es más fácil testear un caso de uso llamando service.call que simulando una request completa."],
    pitfalls: ["No crees un service para cada método pequeño; usalo cuando exista una operación con varios pasos o responsabilidades.", "Un service debe tener un nombre de negocio y una entrada/salida clara; una clase llamada UtilsService no explica nada."],
  },
  case_checkout: {
    steps: ["El controller recibe la petición, autentica al usuario y pasa solo datos permitidos al caso de uso.", "CheckoutOrder abre una transacción para crear Order e Items como una sola decisión de base.", "Un Payment Adapter se encarga de hablar con Stripe u otro proveedor sin que CheckoutOrder conozca su SDK.", "Después, un job envía el email o procesa trabajo lento fuera de la respuesta HTTP.", "La orden necesita estados como pending, paid y failed para manejar fallas parciales y reintentos."],
    pitfalls: ["Si cobrós dos veces por un retry, el usuario paga dos veces; usá una clave de idempotencia para reconocer el mismo intento.", "No prometas que una transacción SQL cubre a Stripe: para sistemas externos necesitás estados, reintentos o compensación."],
  },
  query_object: {
    steps: ["Un Query Object recibe filtros y construye una Relation con nombre de negocio, por ejemplo OrdersReportQuery.", "El controller no necesita conocer joins, orden ni condiciones SQL; solo entrega filtros ya permitidos.", "Como el resultado sigue siendo una Relation, todavía se puede paginar, ordenar o contar antes de ejecutar SQL.", "La clase se prueba directamente con datos de test, sin levantar una request HTTP."],
    pitfalls: ["Un Query Object debe leer datos; si también crea o actualiza registros, mezcla consulta y comando.", "No interpolés texto del usuario dentro de SQL sin parámetros seguros; usá where con valores enlazados."],
  },
  case_reporting: {
    steps: ["La API recibe filtros como rango de fechas, estado y página; el controller valida qué filtros acepta.", "ReportQuery aplica esos filtros, ordena y limita el resultado a una página pequeña.", "Un índice acelera las columnas que se filtran u ordenan con frecuencia; medís antes de decidir cuál agregar.", "includes carga clientes relacionados por adelantado para que serializar la página no genere N+1.", "Una exportación enorme suele ir a un job; no conviene mantener una request abierta mientras genera 100 mil filas."],
    pitfalls: ["Enviar toda la tabla al navegador para filtrar localmente no escala cuando el conjunto es grande.", "Agregar índices a todo también tiene costo: ocupan espacio y hacen más lentas algunas escrituras."],
  },
  form_object: {
    steps: ["Un Form Object representa una pantalla o flujo de entrada, no una tabla de la base.", "Puede tener atributos de User y Profile al mismo tiempo y validar reglas que involucran ambos.", "ActiveModel::Model le da una interfaz parecida a un modelo: atributos, valid? y errors.", "Si pasa la validación, el Form Object llama a los modelos o services necesarios para persistir el resultado."],
    pitfalls: ["No uses un Form Object para esconder un modelo que realmente necesita identidad y comportamiento propio.", "Si el form crea varias filas, usá una transacción para no guardar solo una parte del flujo."],
  },
  case_signup: {
    steps: ["SignupForm recibe los campos de una pantalla y puede mostrar errores juntos aunque pertenezcan a User y Profile.", "Cuando los datos son válidos, una transacción crea User y Profile como una unidad.", "WelcomeJob se encola después para que enviar el correo no haga lenta ni frágil la respuesta de registro.", "El controller solo entrega params permitidos al form y responde según el resultado."],
    pitfalls: ["Crear User primero y Profile después sin transacción puede dejar un usuario incompleto si Profile falla.", "Un job puede reintentarse; el email o efecto posterior debe tolerar que se ejecute más de una vez."],
  },
  jobs_mailers: {
    steps: ["perform_later agrega un trabajo a una cola para ejecutarlo después; la respuesta HTTP puede terminar sin esperar el email.", "El job recibe normalmente ids simples, vuelve a buscar los datos al ejecutarse y llama al mailer.", "Un mailer construye asunto, destinatario y cuerpo del correo; es la parte Rails para enviar email.", "La cola real puede usar Sidekiq u otro backend, pero Active Job da una interfaz común desde Rails."],
    pitfalls: ["Un job no es instantáneo ni tiene garantía de ejecutarse exactamente una vez; puede demorar o reintentarse.", "No pases objetos grandes o datos sensibles al job si podés pasar un id y recargar lo necesario."],
  },
  callbacks: {
    steps: ["Un callback es código que Rails ejecuta automáticamente cuando un modelo se guarda, actualiza o confirma una transacción.", "after_commit significa que la base ya confirmó los cambios, por eso es más seguro para encolar un job que depende de ese registro.", "El beneficio es que un efecto pequeño queda cerca del modelo que lo provoca.", "El costo es que crear un modelo puede disparar trabajo que no se ve en el controller ni en el service."],
    pitfalls: ["No pongas reglas de negocio largas o pagos dentro de callbacks; el flujo se vuelve difícil de seguir y testear.", "Elegí after_commit para efectos externos; before_save puede correr aunque luego la transacción complete con rollback."],
  },
  strategy_pattern: {
    steps: ["Definís una operación común, por ejemplo price_for(order), que todas las estrategias deben cumplir.", "StandardShipping, ExpressShipping y Pickup implementan esa operación con reglas distintas.", "ShippingCalculator recibe una estrategia elegida y la usa sin llenar su código de condiciones por tipo.", "Agregar una modalidad nueva significa crear otra estrategia, sin modificar todas las que ya existen."],
    pitfalls: ["Si solo hay una condición pequeña y estable, varias clases pueden ser más complejas que un simple if.", "Las estrategias deben responder la misma pregunta; si cada una necesita una interfaz completamente distinta, la abstracción es mala."],
  },
  adapter_pattern: {
    steps: ["Primero definís la operación que tu aplicación necesita, por ejemplo charge!(order).", "El adapter llama al SDK externo y traduce sus nombres, formatos de datos y errores a esa operación propia.", "CheckoutOrder depende de tu interfaz PaymentGateway, no de Stripe directamente.", "En tests podés usar un fake adapter que simula éxito o falla sin hacer una llamada de red real."],
    pitfalls: ["No escondas un comportamiento importante del proveedor; por ejemplo, diferencias de reembolso o estados deben seguir siendo visibles en tu diseño.", "Traducí errores externos a errores que el caso de uso pueda entender y manejar."],
  },
  sti: {
    steps: ["Creás una tabla base, por ejemplo vehicles, con columnas compartidas por todos los tipos.", "La columna type guarda un nombre como Car o Motorcycle.", "Al leer una fila, Rails mira type y crea una instancia de la clase correspondiente.", "Vehicle.all devuelve toda la familia y Car.all devuelve solo filas cuyo type es Car."],
    pitfalls: ["type tiene significado especial para Rails; no la uses como columna común si no querés activar STI.", "STI funciona bien solo cuando los tipos comparten de verdad la mayor parte de sus datos y comportamiento."],
  },
  sti_tradeoffs: {
    steps: ["La ventaja de STI es tener una sola tabla y poder consultar toda la familia fácilmente.", "El costo aparece cuando cada subtipo pide atributos propios: la tabla acumula columnas que otros tipos dejan en NULL.", "Las validaciones empiezan a depender del tipo, por ejemplo una regla para ElectricCar y otra para Motorcycle.", "Si los tipos evolucionan por caminos muy distintos, tablas separadas o composición pueden representar mejor el dominio."],
    pitfalls: ["No elijas STI solo porque hay herencia en el código; primero preguntá si el esquema y reglas también son compartidos.", "Muchos if type o case type repartidos por la app indican que la familia dejó de ser uniforme."],
  },
  polymorphic: {
    steps: ["Comment tiene una relación llamada commentable en vez de una relación fija como post.", "commentable_id guarda el id del dueño y commentable_type guarda qué tipo de dueño es, por ejemplo Post o Video.", "Post y Video declaran que tienen comments usando el mismo nombre commentable.", "Así reutilizás una sola tabla comments para varios modelos que comparten la capacidad de recibir comentarios."],
    pitfalls: ["La base no puede crear una foreign key estándar que apunte al mismo tiempo a posts y videos; perdés parte de esa protección automática.", "No uses polimorfismo solo para ahorrar tablas si una relación explícita sería más fácil de entender y mantener."],
  },
  case_content: {
    steps: ["Elegís Comment como modelo reutilizable porque posts, videos y tickets comparten la misma capacidad: recibir comentarios.", "Antes de crear un comentario, el caso de uso busca el recurso dueño correcto y verifica que el usuario tenga permiso.", "La asociación polimórfica guarda un solo esquema de comentarios y permite agregar nuevos tipos de contenido más adelante.", "El diseño debe decidir cómo buscar comentarios globalmente y cómo proteger integridad si un dueño se elimina."],
    pitfalls: ["Eliminar un Post debe decidir qué pasa con sus comments; esa regla de ciclo de vida no aparece sola por usar polimorfismo.", "Renombrar una clase puede afectar valores guardados en commentable_type, así que esos cambios requieren cuidado."],
  },
  api_mode: {
    steps: ["Rails API-only mantiene routes, controllers, modelos y services, pero normalmente responde JSON en vez de HTML.", "React hace una request HTTP, Rails procesa el caso de uso y devuelve JSON con status claro.", "El controller sigue usando params permitidos, autenticación y autorización; cambiar a API no elimina esas responsabilidades.", "La aplicación puede tener React separado con su propio build o un frontend integrado, según la arquitectura real."],
    pitfalls: ["Una API no debe devolver automáticamente todas las columnas de un modelo; elegí una representación explícita.", "API-only no resuelve por sí sola autenticación, CORS, versionado ni manejo de errores."],
  },
  serialization_cors: {
    steps: ["Un serializer transforma un modelo en el JSON que el frontend espera; decide qué campos y relaciones se exponen.", "CORS es una regla que el navegador aplica antes de permitir que un sitio web llame a una API de otro origen.", "Configurás CORS con orígenes, métodos y headers permitidos, por ejemplo permitir solo tu dominio React.", "El frontend puede manejar status y mensajes porque la API devuelve un contrato consistente."],
    pitfalls: ["Permitir cualquier origen por comodidad puede abrir la API más de lo necesario.", "CORS no reemplaza autenticación: permitir una request desde un sitio no significa que el usuario tenga permiso."],
  },
  auth_security: {
    steps: ["Autenticación identifica al usuario, por ejemplo desde una sesión basada en cookie o un token.", "Autorización comprueba si ese usuario puede acceder a este recurso o ejecutar esta acción.", "Buscar current_user.orders.find(id) limita la búsqueda a órdenes del usuario actual y evita que un id ajeno se filtre.", "CSRF protege requests autenticadas por cookies contra envíos maliciosos desde otro sitio; Strong Parameters limita campos modificables."],
    pitfalls: ["Ocultar un botón en React no es autorización; Rails debe validar permisos en el servidor.", "CORS, CSRF y autenticación resuelven problemas distintos; no reemplazan unos a otros."],
  },
  asset_pipeline: {
    steps: ["En desarrollo escribís archivos con nombres lógicos como application.css o logo.png.", "Durante build o deploy, Sprockets procesa esos archivos y genera una versión publicada.", "El fingerprint agrega un hash al nombre, por ejemplo application-a1b2.css; si cambia el contenido, cambia la URL.", "Como la URL cambia al cambiar el archivo, el navegador puede cachear la versión anterior sin confundirla con la nueva."],
    pitfalls: ["Referenciar a mano el nombre fingerprinted puede romperse en el próximo deploy; usá helpers o el manifest.", "Si falta un asset en producción, revisá si fue incluido en el manifest y precompilado."],
  },
  modern_assets: {
    steps: ["Sprockets es el sistema clásico de assets de Rails y sigue apareciendo en proyectos legacy.", "Webpacker integró Webpack y npm dentro de Rails, por eso muchas apps Rails 5 o 6 tienen packs.", "Import maps permite usar módulos JavaScript sin un bundler completo; jsbundling usa herramientas como esbuild para producir bundles.", "En una arquitectura React separada, React suele compilarse fuera de Rails y Rails entrega JSON."],
    pitfalls: ["No asumas qué herramienta usa una app solo por ser Rails; revisá versión, Gemfile y scripts de build.", "No propongas migrar la estrategia de assets sin una necesidad concreta como performance, mantenimiento o soporte."],
  },
  rspec_basics: {
    steps: ["describe agrupa ejemplos sobre una clase, método o comportamiento.", "it expresa una expectativa en lenguaje humano, por ejemplo que un título asignado se conserve.", "expect compara el resultado real con el esperado usando un matcher como eq.", "Una spec pequeña prepara un escenario, ejecuta una acción y verifica un resultado observable."],
    pitfalls: ["Una spec que revisa variables internas se rompe al refactorizar aunque el comportamiento siga correcto.", "Si una spec necesita demasiado setup y muchos expects, probablemente está probando más de una cosa."],
  },
  factory_bot: {
    steps: ["Una factory define datos de prueba por defecto para un modelo, por ejemplo un Post con título válido.", "build crea el objeto solo en memoria; create lo guarda en la base de test.", "Un trait nombra una variante reutilizable, por ejemplo :published para un post publicado.", "La spec puede sobrescribir los atributos que importan para dejar claro su escenario."],
    pitfalls: ["Factories con muchas asociaciones automáticas hacen las specs lentas y ocultan qué datos se están creando.", "No uses create cuando build alcanza; persistir en la base cuesta más tiempo."],
  },
  spec_types: {
    steps: ["Una model spec prueba comportamiento local del modelo, como una validación o método.", "Una service spec prueba un caso de uso llamando su método call sin pasar por HTTP.", "Una request spec hace una petición a una ruta real y verifica status, JSON y efectos importantes.", "Una system spec abre un navegador simulado y cubre un flujo completo, por eso es más lenta."],
    pitfalls: ["No conviertas todas las pruebas en system specs; son útiles para pocos flujos críticos, no para cada regla.", "No pruebes solo modelos si el contrato HTTP con React es importante; usá request specs para ese límite."],
  },
  gemfile: {
    steps: ["Gemfile declara qué gems necesita el proyecto y en qué grupos, por ejemplo development o test.", "bundle install resuelve versiones compatibles y escribe el resultado exacto en Gemfile.lock.", "Gemfile.lock permite que tu máquina, CI y producción instalen la misma combinación de gems.", "bundle exec rspec ejecuta RSpec usando las versiones del proyecto, no una gem global distinta."],
    pitfalls: ["Borrar Gemfile.lock puede actualizar muchas dependencias de golpe y generar cambios inesperados.", "Agregar una gem sin entender su mantenimiento o propósito aumenta superficie de seguridad y complejidad."],
  },
  env_logger: {
    steps: ["ENV guarda configuración que cambia por entorno, como DATABASE_URL; ENV.fetch falla temprano si falta algo obligatorio.", "Rails Credentials guarda secretos cifrados que no deberían escribirse directamente en el repositorio.", "Rails.logger registra eventos con nivel y contexto, por ejemplo el id de la orden que está fallando.", "Logs útiles permiten investigar producción sin agregar prints ni reproducir exactamente la sesión del usuario."],
    pitfalls: ["Nunca escribas passwords, tokens, tarjetas o datos privados completos en logs.", "Un log sin contexto como error happened no ayuda; incluí qué operación y qué id estaban involucrados."],
  },
};

export default CLARIFIED_BULLETS;
