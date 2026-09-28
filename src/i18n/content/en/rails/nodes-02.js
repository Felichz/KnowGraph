// rails concepts (case_checkout, query_object, case_reporting, form_object, case_signup, callbacks, jobs_mailers, strategy_pattern, adapter_pattern, sti, sti_tradeoffs, polymorphic)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "case_checkout": {
    "_source": "eb1ba4b7460b",
    "label": "Case: checking out an order",
    "lesson": {
      "level": "Design case",
      "summary": "Designing checkout requires separating HTTP, data consistency, the external payment and asynchronous effects.",
      "why": "It is an excellent interview exercise because it reveals boundaries, transactions, dependencies and failure handling.",
      "code": "class OrdersController < ApplicationController\n  def create\n    order = CheckoutOrder.new(user: current_user, cart: current_cart,\n                              payments: StripePaymentAdapter.new).call\n    render json: OrderSerializer.new(order), status: :created\n  end\nend\n\nclass CheckoutOrder\n  def call\n    order = create_pending_order!       # SQL transaction 1\n    payment = @payments.charge!(order, idempotency_key: order.checkout_key)\n\n    Order.transaction do               # SQL transaction 2\n      order.update!(status: \"paid\", provider_payment_id: payment.id)\n    end\n    OrderPaidJob.perform_later(order.id) # only after the commit\n    order\n  rescue PaymentDeclined => error\n    order&.update!(status: \"failed\")\n    raise error\n  end\n\n  def create_pending_order!\n    Order.transaction do\n      order = @user.orders.create!(status: \"pending\")\n      @cart.items.each { |item| order.items.create!(product: item.product, quantity: item.quantity) }\n      order\n    end\n  end\nend",
      "codeLabel": "Explicit orchestration with two SQL boundaries",
      "steps": [
        "The controller does the HTTP part: it authenticates, permits params and translates a result into 201, 422 or a payment error. It does not calculate or charge directly.",
        "The first transaction creates the Order and each OrderItem. Using create! makes a failure raise an error and Rails rolls back all those writes; that is the local transactional boundary.",
        "The order is left pending before calling the payment. The adapter translates your app's contract to the SDK of Stripe or another provider.",
        "The second transaction saves paid/failed and the external payment identifier. Then the job is enqueued explicitly, once the commit has finished.",
        "Idempotency means that if the browser retries the same checkout because of a timeout, the same checkout_key lets you recognize it and prevents a second charge."
      ],
      "pitfalls": [
        "A SQL transaction does not include Stripe: do not keep the transaction open while you wait on the network. That network call can be slow, fail or respond after a timeout.",
        "Partial failure: Stripe charges successfully but the app goes down before saving paid. To resolve it you need to store IDs/keys, query the provider or process a webhook, and do safe retries.",
        "An after_commit callback on Order could enqueue the email when it changes to paid. That is valid, but it hides a step of the flow; this example keeps it explicit with OrderPaidJob.perform_later after the commit.",
        "The invariant is not a decorative word: it is a business condition you protect with validations, constraints, transactions and states, such as never marking an order without items as paid."
      ],
      "takeaway": "When designing business logic, name what must always be true, what each transaction confirms, what fails outside your database and how a retry avoids repeating the effect.",
      "prompt": "“Design the creation of an order that saves its items, charges through an external provider and sends a confirmation.”",
      "diagramTitle": "Complete checkout: HTTP, database, external provider and follow-up effect",
      "diagram": [
        {
          "label": "POST /orders",
          "detail": "HTTP entry point"
        },
        {
          "label": "OrdersController",
          "detail": "params + auth"
        },
        {
          "label": "CheckoutOrder",
          "detail": "orchestrates the case"
        },
        {
          "label": "DB transaction",
          "detail": "Order + Items"
        },
        {
          "label": "Payment adapter",
          "detail": "external provider"
        },
        {
          "label": "Active Job",
          "detail": "email and effects"
        }
      ],
      "explanation": "Checkout is a use case because a single user intention (buying) crosses several boundaries. First the application persists a pending order and its items atomically in its own database. Then it talks to the payment provider, which is outside that SQL transaction. Finally it saves the paid or failed result and schedules the follow-up effect. Invariants are conditions that should never be broken, for example a paid order must have items and a consistent amount. Partial failures appear because the payment can be approved even though saving paid fails afterwards; that is why we use states, retries and idempotency.",
      "tableTitle": "Checkout boundaries",
      "tableLabel": "What can be committed together and what can fail separately",
      "table": {
        "columns": [
          "Stage",
          "Durable result",
          "Failure to account for"
        ],
        "rows": [
          [
            "Transaction 1",
            "Pending Order + OrderItems are saved together or nothing is saved.",
            "Invalid item or out of stock: rollback."
          ],
          [
            "External payment",
            "The provider accepts or declines the charge.",
            "Timeout: it may have charged, but your app got no response."
          ],
          [
            "Transaction 2",
            "Order moves to paid/failed and stores the external id.",
            "Payment approved but updating the database fails."
          ],
          [
            "Job/Mailer",
            "The confirmation is processed after the commit.",
            "The job can be retried; do not send two confirmations."
          ]
        ]
      },
      "mermaid": "flowchart TD\n      A[\"POST /orders\"] --> B[\"OrdersController\nauth + params\"]\n      B --> C[\"CheckoutOrder.call\"]\n      C --> D[\"Transaction 1\"]\n      D --> E[\"Order: pending\"]\n      E --> F[\"OrderItems\nsaved together\"]\n      F --> G[\"Local COMMIT\"]\n      G --> H[\"PaymentAdapter.charge!\nwith checkout_key\"]\n      H -->|\"declined\"| I[\"Order: failed\npayment response\"]\n      H -->|\"approved\"| J[\"Transaction 2\"]\n      J --> K[\"Order: paid\nprovider_payment_id\"]\n      K --> L[\"Local COMMIT\"]\n      L --> M[\"OrderPaidJob\"]\n      M --> N[\"Worker → OrderMailer\nconfirmation\"]"
    }
  },
  "query_object": {
    "_source": "3f42cf2541f4",
    "label": "Query Object",
    "lesson": {
      "level": "Application design",
      "summary": "A Query Object encapsulates a complex query with its own name, parameters and tests.",
      "why": "It keeps controllers and scopes readable once joins, filters and rules appear.",
      "code": "class CourseSearchQuery\n  def self.call(term:)\n    pattern = \"%#{term}%\"\n    Course.where(\"courses.title ILIKE ?\", pattern)\n  end\nend\n\n# The ? is a placeholder: Rails sends pattern as data.\n# Never do: \"title ILIKE '%#{params[:term]}%'\"",
      "codeLabel": "Safe search with a bound value",
      "steps": [
        "The SQL part you write defines the allowed structure: courses.title ILIKE ?.",
        "The ? sign is a placeholder; pattern is sent separately and the driver treats it as a value, even if it contains quotes or malicious text.",
        "where(status: filters[:status]) is the hash variant and also uses safe values without you writing the placeholder.",
        "If you want to sort by a column chosen by the user, do not interpolate it: pick it from a closed list of allowed names."
      ],
      "pitfalls": [
        "Interpolating means inserting text inside other text. In SQL, building `WHERE title = '#{params[:title]}'` lets user input change the statement the database understands.",
        "Use placeholders: `where(\"title ILIKE ?\", pattern)` keeps the statement fixed and sends pattern as separate, escaped data.",
        "Values can be bound; column names cannot. To sort, choose among allowed columns in code, for example { newest: :created_at, price: :price_cents }."
      ],
      "takeaway": "Parameter binding means the SQL defines the statement and the user only supplies data; never build the statement by pasting user text.",
      "explanation": "When you need SQL expressed as text, bound parameters separate the fixed text of the query from the user's values. Rails sends the value separately to the database driver, instead of pasting it inside the SQL. That way a search like %ana% is treated as data, not as part of the SQL statement. In Active Record, where with a hash already does this; for textual SQL you use a ? placeholder and pass the value as a separate argument."
    }
  },
  "case_reporting": {
    "_source": "6f04a6de1cc1",
    "label": "Case: filterable report",
    "lesson": {
      "level": "Design case",
      "summary": "A filterable report should keep the controller small and build an efficient Relation that can be paginated.",
      "why": "Given your experience with large tables, this case connects frontend, API, SQL, indexes and N+1.",
      "code": "authorized_scope = current_user.orders\n\norders = OrdersReportQuery.call(\n  scope: authorized_scope,\n  filters: report_params,\n  page: params.fetch(:page, 1).to_i,\n)\n\norders.each do |order|\n  order.customer.name # without includes: possible extra query per order\nend",
      "codeLabel": "Authorized scope + includes before the serialization loop",
      "steps": [
        "The controller builds authorized_scope = current_user.orders. It is a Relation: a query not yet executed that also enforces authorization.",
        "The Query Object composes filters, ordering, limit/offset and includes on top of that Relation without loading it too early.",
        "The N+1 appears during serialization: the loop goes through 50 orders and reading order.customer fires up to 50 additional SELECTs if customer was not preloaded.",
        "includes(:customer) makes Rails load those associations eagerly; check the SQL or the metrics because the concrete plan depends on the query."
      ],
      "pitfalls": [
        "scope here is a variable holding a Relation, not the scope :published, -> { ... } macro. Both use the idea of a composable query, but they are not the same thing.",
        "includes is not decoration: add it because you know which association the serializer or the view will read in a loop.",
        "Preloading huge associations you will not display also costs memory and queries; pick only what that page consumes."
      ],
      "takeaway": "Authorize with the initial scope, compose the Relation and preload exactly the association the JSON loop is going to read.",
      "prompt": "“Design a reporting endpoint with filters, ordering, related data and a possible bulk export.”",
      "diagramTitle": "Query flow",
      "diagram": [
        {
          "label": "GET /reports",
          "detail": "filters + page"
        },
        {
          "label": "ReportsController",
          "detail": "normalizes input"
        },
        {
          "label": "ReportQuery",
          "detail": "composes Relation"
        },
        {
          "label": "SQL + indexes",
          "detail": "filters and sorts"
        },
        {
          "label": "includes",
          "detail": "avoids N+1"
        },
        {
          "label": "Serializer",
          "detail": "paginated JSON"
        }
      ],
      "explanation": "In this case scope does not mean a model's scope method: it is just a name for an initial Relation, for example current_user.orders. That Relation already limits which orders the person can see, and then the Query Object adds filters and ordering to it. includes(:customer) is related to N+1 because the report ultimately iterates over the orders to build JSON: if inside that loop it reads order.customer.name, without includes Rails may run an extra query for each customer that was not loaded. includes fetches the page's customers up front and avoids that pattern."
    }
  },
  "form_object": {
    "_source": "67d6fb860a23",
    "label": "Form Object",
    "lesson": {
      "level": "Application design",
      "summary": "A Form Object gathers the fields and validations of a form that may touch several models.",
      "why": "It avoids filling User, Profile or controllers with rules that only apply to one screen.",
      "codeLabel": "One form with several destinations",
      "steps": [
        "SignupForm can accept email, password, name and timezone even though User and Profile live in different tables.",
        "The form validates format, presence and rules that involve several fields; if it fails, the controller can render all the errors together.",
        "If it is valid, the form calls a service or runs a small transaction to create User and Profile.",
        "It normally exposes one main flow such as submit or save; it is not a model with arbitrary methods for every case in the app."
      ],
      "pitfalls": [
        "Do not confuse a Form Object with Active Record: including ActiveModel::Model provides the validations API, not a table or automatic persistence.",
        "Do not put rules inside the form that must hold even if the user is created from the console, an import or an internal API; those rules must live further down.",
        "A service does not need to know what each form input was called; take a clean contract so the use case is reusable."
      ],
      "takeaway": "A Form Object adapts and validates input for one UX; a Service Object runs the business process that can exist without that form.",
      "explanation": "A Form Object is a specialized kind of input object: it represents what a form or endpoint receives, even if those fields end up creating or modifying several tables. It is not a database model and it does not have to be a Service Object, although it can call one. Its main job is to expose attributes, validate a combination of fields and collect errors in a way that fits a screen. A Service Object, by contrast, describes the business operation and should be usable without knowing about HTML, params or form messages.",
      "tableTitle": "Form Object and Service Object",
      "tableLabel": "Both can take part in a flow, but they have different boundaries",
      "table": {
        "columns": [
          "Object",
          "Main input",
          "Responsibility"
        ],
        "rows": [
          [
            "Form Object",
            "Raw fields from a form or endpoint.",
            "Validate the set of fields and expose errors to the user."
          ],
          [
            "Service Object",
            "Already prepared data and domain dependencies.",
            "Run a use case such as registering a user or charging an order."
          ]
        ]
      }
    }
  },
  "case_signup": {
    "_source": "9c0a5850b4fd",
    "label": "Case: multi-model signup",
    "lesson": {
      "level": "Design case",
      "summary": "A signup that creates User, Profile and preferences does not map cleanly to a single model.",
      "why": "It lets you explain Form Object, cross-field validations, transactions and follow-up effects.",
      "code": "class SignupController < ApplicationController\n  def create\n    form = SignupForm.new(signup_params)\n    return render json: { errors: form.errors }, status: :unprocessable_entity unless form.submit\n\n    render json: { id: form.user.id }, status: :created\n  end\nend\n\nclass SignupForm\n  include ActiveModel::Model\n  attr_accessor :email, :password, :name, :timezone\n  attr_reader :user\n  validates :email, :password, :name, :timezone, presence: true\n\n  def submit\n    return false unless valid?\n\n    @user = User.transaction do\n      user = User.create!(email:, password:)\n      user.create_profile!(name:, timezone:)\n      user.create_preference!(newsletter: true)\n      user\n    end # at this point the three rows are already committed\n\n    WelcomeJob.perform_later(@user.id) # effect after the commit\n    true\n  end\nend",
      "codeLabel": "Full flow: request → Form Object → transaction → job",
      "steps": [
        "The controller receives HTTP, permits fields and creates SignupForm. Nothing is written to the database yet.",
        "SignupForm validates input that spans models. If name is missing, it returns errors for the user without creating either User or Profile.",
        "If everything is valid, the transaction creates three records: one row in users, one in profiles and one in preferences.",
        "If create_profile! fails, Rails rolls back: it also undoes the User row created inside the same transaction. No incomplete account is left behind.",
        "After the commit, WelcomeJob is enqueued with the ID. The worker reloads the user and the mailer builds/sends the email outside the request."
      ],
      "pitfalls": [
        "A transaction only protects those SQL writes. It cannot un-send an email; that is why the job is enqueued after the commit succeeded.",
        "You could enqueue with an after_create_commit callback on User. It works because it runs after the commit, but it is less visible; in an interview walkthrough, enqueuing it explicitly at the end of the use case usually communicates the path better.",
        "The rules User must always satisfy still live in User. SignupForm only gathers and validates the specific input of the multi-model signup."
      ],
      "takeaway": "Model SignupForm because signing up is an input flow that produces several related rows; it is not simply creating a User row.",
      "prompt": "“A form must create a user, a profile and preferences, showing all the errors together.”",
      "diagramTitle": "Multi-model signup: no account is left half-done",
      "diagram": [
        {
          "label": "POST /signup",
          "detail": "several fields"
        },
        {
          "label": "SignupForm",
          "detail": "validates the set"
        },
        {
          "label": "DB transaction",
          "detail": "all or nothing"
        },
        {
          "label": "User",
          "detail": "identity"
        },
        {
          "label": "Profile",
          "detail": "associated data"
        },
        {
          "label": "WelcomeJob",
          "detail": "follow-up effect"
        }
      ],
      "explanation": "A row is a concrete record inside a database table: a users row stores a user and a profiles row stores the associated profile. The signup form does not represent just one of those rows: it combines fields from both, such as email, password, name and time zone, and its success means all the pieces were created consistently. That is why we model the input flow with SignupForm: the unit the user understands is signing up, not inserting an isolated row into users.",
      "mermaid": "flowchart TD\n      A[\"POST /signup\"] --> B[\"SignupController\nstrong params\"]\n      B --> C[\"SignupForm\nemail, password, name, timezone\"]\n      C --> D{\"valid?\"}\n      D -->|\"no\"| E[\"422 + errors\nno writes\"]\n      D -->|\"yes\"| F[\"SQL transaction\"]\n      F --> G[\"users\none User row\"]\n      G --> H[\"profiles\none Profile row\"]\n      H --> I[\"preferences\none Preference row\"]\n      I --> J[\"COMMIT\nall three persist together\"]\n      J --> K[\"WelcomeJob.perform_later(user.id)\"]\n      K --> L[\"Worker → Mailer\nwelcome email\"]"
    }
  },
  "callbacks": {
    "_source": "67e7bc149369",
    "label": "Callbacks vs explicit flow",
    "lesson": {
      "level": "Application design",
      "summary": "Callbacks run code around a record's lifecycle.",
      "why": "They are useful for effects tied to persistence, but they can hide important consequences.",
      "codeLabel": "Effect after the commit",
      "steps": [
        "A callback is code that Rails runs automatically when a model is saved, updated or commits a transaction.",
        "after_commit means the database has already committed the changes, which is why it is safer for enqueuing a job that depends on that record.",
        "The benefit is that a small effect stays close to the model that triggers it.",
        "The cost is that creating a model can trigger work that is not visible in the controller or the service."
      ],
      "pitfalls": [
        "Do not put long business rules or payments inside callbacks; the flow becomes hard to follow and test.",
        "Choose after_commit for external effects; before_save can run even if the transaction later ends in a rollback."
      ],
      "takeaway": "The more important the flow, the more it pays to make it explicit with a service or a job.",
      "explanation": "A callback runs code automatically at points in a model's lifecycle, for example after a create is committed to the database. It is convenient for small effects tied to the data. The trade-off is that the flow stays hidden: creating a User can trigger something without the controller or the service showing it."
    }
  },
  "jobs_mailers": {
    "_source": "613ef390988b",
    "label": "Active Job & Mailer",
    "lesson": {
      "level": "Applied design",
      "summary": "Active Job runs work outside the request and Action Mailer builds emails using conventions similar to controllers and views.",
      "why": "Sending emails or processing exports inline increases the endpoint's latency and fragility.",
      "codeLabel": "Moving slow effects out of HTTP",
      "steps": [
        "ActiveJob::Base provides the integration with queues; Sidekiq, Solid Queue or another adapter do the work of running it in the background.",
        "ApplicationJob < ActiveJob::Base is a base class in your project. Inheriting from it avoids repeating configuration in every job.",
        "OrderPaidJob < ApplicationJob defines perform(order_id). When a worker picks it up, Rails calls perform with that ID.",
        "perform_later(order.id) does not call perform at that moment: it adds a message to the queue so another process runs it later."
      ],
      "pitfalls": [
        "Do not confuse the general Active Job interface with ApplicationJob: the latter is your base subclass; the former is the Rails framework.",
        "Pass IDs and reload data at execution time because the job may run minutes later, when the original object has already changed.",
        "A job can be retried; make sending an effect or updating a state safe against more than one execution."
      ],
      "takeaway": "Active Job defines the system; ApplicationJob is your app's base; perform is the entry point the queue runs later.",
      "explanation": "Active Job is the Rails framework and interface for defining and enqueuing asynchronous work. ApplicationJob is a class in your application that normally inherits from ActiveJob::Base; it works as an intermediate base where you could put configuration shared by all your jobs. That is why OrderPaidJob < ApplicationJob is still an Active Job indirectly. perform is the method the queue will run later when it picks up the job; perform_later enqueues it during the request."
    }
  },
  "strategy_pattern": {
    "_source": "2c328053bd10",
    "label": "Strategy Pattern",
    "lesson": {
      "level": "Design pattern",
      "summary": "Strategy encapsulates interchangeable algorithms behind the same interface.",
      "why": "It is useful when a rule changes by plan, country, shipping method or customer type without filling the service with conditionals.",
      "code": "# 1. The controller receives shipping_method: \"express\"\nstrategy = ExpressShipping.new\n\n# 2. Build the object that uses that strategy\ncalculator = ShippingCalculator.new(strategy: strategy)\n\n# 3. The use case calculates the price\nprice = calculator.call(order)\n\n# @strategy is just a well-named instance variable.",
      "codeLabel": "Actual flow: choose the option and calculate",
      "steps": [
        "The controller or a factory translates an allowed value such as express into a concrete strategy. Do not accept class names sent by the user.",
        "ShippingCalculator.new(strategy: ExpressShipping.new) runs initialize and stores that object in @strategy.",
        "calculator.call(order) runs the stable logic: it asks the chosen strategy for price_for(order).",
        "ExpressShipping, StandardShipping and Pickup implement the same price_for message, each with its own algorithm and tests."
      ],
      "pitfalls": [
        "@strategy is not a Rails API or a reserved word: it is Ruby syntax and a name chosen by the programmer.",
        "initialize builds/prepares the instance; call runs the use case. Neither is magic beyond Ruby's convention for initialize.",
        "Do not extract a Strategy for a small, fixed if. Use it when the variants change, grow, or are tested and deployed with conceptual independence."
      ],
      "takeaway": "Strategy separates which algorithm is used from who needs the result; @strategy is just the chosen object and call is an action convention.",
      "prompt": "“Shipping cost changes depending on standard, express or pickup, and more options will be added.”",
      "diagramTitle": "Variation point",
      "diagram": [
        {
          "label": "Checkout",
          "detail": "needs a price"
        },
        {
          "label": "ShippingCalculator",
          "detail": "stable interface"
        },
        {
          "label": "Strategy",
          "detail": "selection"
        },
        {
          "label": "Standard / Express / Pickup",
          "detail": "separate algorithms"
        }
      ],
      "explanation": "@strategy is simply a name chosen by whoever wrote the class. The @ prefix marks a Ruby instance variable: a piece of data stored inside that ShippingCalculator; you could call it @shipping_rule, although @strategy communicates the pattern. initialize is the closest thing to a constructor in PHP or JavaScript: Ruby runs it when you do ShippingCalculator.new(strategy: ExpressShipping.new). Then call is the conventional entry point that delegates to the chosen algorithm with @strategy.price_for(order).",
      "mermaid": "flowchart LR\n      A[\"Checkout receives express\"] --> B[\"Factory picks ExpressShipping\"]\n      B --> C[\"ShippingCalculator.new(strategy: ...)\"]\n      C --> D[\"calculator.call(order)\"]\n      D --> E[\"@strategy.price_for(order)\"]\n      E --> F[\"Shipping price\"]"
    }
  },
  "adapter_pattern": {
    "_source": "4036d00ba18a",
    "label": "Adapter for integrations",
    "lesson": {
      "level": "Design pattern",
      "summary": "An Adapter translates an external provider's API into an interface of the application's own.",
      "why": "It keeps Stripe, Salesforce or any SDK from leaking into the use case and makes replacements and tests easier.",
      "codeLabel": "Isolating an integration",
      "steps": [
        "First you define the operation your application needs, for example charge!(order).",
        "The adapter calls the external SDK and translates its names, data formats and errors into that operation of your own.",
        "CheckoutOrder depends on your PaymentGateway interface, not on Stripe directly.",
        "In tests you can use a fake adapter that simulates success or failure without making a real network call."
      ],
      "pitfalls": [
        "Do not hide important provider behavior; for example, differences in refunds or states must stay visible in your design.",
        "Translate external errors into errors the use case can understand and handle."
      ],
      "takeaway": "Your domain speaks its own language; the adapter deals with the provider's language.",
      "prompt": "“Payments go through Stripe today, but the client wants to be able to migrate or use a different provider per country.”",
      "diagramTitle": "External boundary",
      "diagram": [
        {
          "label": "CheckoutOrder",
          "detail": "use case"
        },
        {
          "label": "PaymentGateway",
          "detail": "own interface"
        },
        {
          "label": "Adapter",
          "detail": "translates contract"
        },
        {
          "label": "Stripe / Adyen",
          "detail": "external SDK"
        }
      ],
      "explanation": "An Adapter protects your application from the particular shape of an external integration. Your use case wants to charge an order; Stripe may call that PaymentIntent.create and another provider may use a different API. The adapter translates between the two languages so the rest of the application does not depend directly on an SDK."
    }
  },
  "sti": {
    "_source": "020efb2638ba",
    "label": "Single Table Inheritance",
    "lesson": {
      "level": "Model design",
      "summary": "STI stores several subtypes in one table and uses a type column to rebuild the Ruby class.",
      "why": "It fits when the subtypes are variants of the same concept and share most of the schema.",
      "code": "class Vehicle < ApplicationRecord\nend\n\nclass Car < Vehicle\nend\n\nclass Motorcycle < Vehicle\nend\n\nCar.create!(brand: \"Ford\")\nVehicle.all # all types\nCar.all     # WHERE type = \"Car\"",
      "codeLabel": "One table, several classes",
      "steps": [
        "You create a base table, for example vehicles, with columns shared by every type.",
        "The type column stores a name such as Car or Motorcycle.",
        "When reading a row, Rails looks at type and creates an instance of the matching class.",
        "Vehicle.all returns the whole family and Car.all returns only rows whose type is Car."
      ],
      "pitfalls": [
        "type has a special meaning for Rails; do not use it as a regular column if you do not want to enable STI.",
        "STI only works well when the types genuinely share most of their data and behavior."
      ],
      "takeaway": "STI models a homogeneous family, not just any set of related classes.",
      "explanation": "Single Table Inheritance, or STI, is a way of storing variants of the same family in a single table. For example, Car and Motorcycle can live in vehicles, and a type column tells Rails which Ruby class to create when reading each row. It is useful if they share almost all their attributes and behavior."
    }
  },
  "sti_tradeoffs": {
    "_source": "c7d05ed58ab1",
    "label": "STI trade-offs",
    "lesson": {
      "level": "Model design",
      "summary": "STI simplifies queries, but it concentrates the attributes of every subtype in one table.",
      "why": "Choosing it is a trade-off about how the domain will evolve, not just a syntax decision.",
      "code": "vehicles\n# id | type       | wheels | battery_capacity | cargo_volume\n# 1  | Car        | 4      | NULL             | NULL\n# 2  | Motorcycle  | 2      | NULL             | NULL\n# 3  | ElectricCar | 4      | 75               | NULL\n\n# Lots of NULLs and conditional validations\n# can signal that STI no longer fits.",
      "codeLabel": "The cost of sharing a table",
      "steps": [
        "The advantage of STI is having a single table and being able to query the whole family easily.",
        "The cost shows up when each subtype asks for its own attributes: the table accumulates columns that other types leave as NULL.",
        "Validations start depending on the type, for example one rule for ElectricCar and another for Motorcycle.",
        "If the types evolve along very different paths, separate tables or composition may represent the domain better."
      ],
      "pitfalls": [
        "Do not choose STI just because there is inheritance in the code; first ask whether the schema and rules are also shared.",
        "Many if type or case type checks spread across the app signal that the family is no longer uniform."
      ],
      "takeaway": "The key question is whether the subtypes will evolve together.",
      "explanation": "STI saves tables and makes it easy to query a whole family, but it forces every subtype to share the same schema. If ElectricCar starts needing many columns that Motorcycle never uses, lots of NULLs and conditional rules appear. The decision depends on how much the types will evolve together."
    }
  },
  "polymorphic": {
    "_source": "8883438047ad",
    "label": "Polymorphic associations",
    "lesson": {
      "level": "Model design",
      "summary": "A polymorphic association lets a record point to models of different types using an id and a type.",
      "why": "It is useful for cross-cutting behavior such as comments, attachments, likes or audits.",
      "code": "class Comment < ApplicationRecord\n  belongs_to :user       # who wrote the comment\n  belongs_to :commentable, polymorphic: true # what it was written about\nend\n\nclass Post < ApplicationRecord\n  has_many :comments, as: :commentable\nend\n\nclass Video < ApplicationRecord\n  has_many :comments, as: :commentable\nend\n\n# comment.commentable can be a Post or a Video.\n# comment.user is always the concrete author.",
      "codeLabel": "Author and commented resource are different associations",
      "steps": [
        "Commentable is the conceptual name of the commented object; it is not a single model, but the role that Post, Video or Ticket can play.",
        "user_id and commentable_type/commentable_id answer different questions: who wrote it and which resource it was written about.",
        "You do not need User as a join table between Post, Video and Comment: the user is the comment's author, not the link that determines the commented resource.",
        "If a user needs to see their comments, User has_many :comments is enough. If Post needs its comments, Post has_many :comments, as: :commentable is enough."
      ],
      "pitfalls": [
        "Polymorphism is usually one-to-many per owner type: a Post has many Comments and each Comment has a single owner. It does not imply many-to-many.",
        "A traditional foreign key says `comments.post_id REFERENCES posts(id)`. In a polymorphic association there is no single target table: the target changes according to commentable_type.",
        "The database can check that commentable_id is a number, but it cannot check with a traditional foreign key that the id exists in posts when type is Post or in videos when type is Video.",
        "The application must validate the resource and authorize it; it is also worth defining what happens when a Post/Video is deleted. If integrity is critical, separate explicit associations may be safer."
      ],
      "takeaway": "Polymorphism reuses one capability across different types; many-to-many connects two sets through a join. The user can be the author without being a join table.",
      "explanation": "A polymorphic association is not the same as a many-to-many. Many-to-many means that many records of A relate to many of B through an intermediate table with two concrete foreign keys, for example posts ↔ tags through post_tags. Polymorphism means a record has one owner out of several possible types: a Comment can belong to a Post or to a Video, but each comment points to a single commentable at a time. The comments table stores commentable_type = \"Post\" and commentable_id = 7, or type = \"Video\" and another id.",
      "tableTitle": "Polymorphism versus many-to-many",
      "tableLabel": "Two different modeling problems",
      "table": {
        "columns": [
          "Association",
          "What it means",
          "Example"
        ],
        "rows": [
          [
            "Polymorphic",
            "A record points to one type out of several possible ones.",
            "Comment → Post or Video."
          ],
          [
            "Many-to-many",
            "Many records of A connect with many of B.",
            "Post ↔ Tag through post_tags."
          ],
          [
            "Authorship",
            "A user writes many comments.",
            "User has_many :comments."
          ]
        ]
      }
    }
  }
};
