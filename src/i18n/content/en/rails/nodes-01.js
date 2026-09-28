// rails concepts (ruby_basics, mvc, rack, routing_rest, controllers_params, responses_errors, ar_pattern, ar_orm, migrations, validations, assoc_belongs, transactions, scopes, n_plus_one, eager_loading, assoc_through, service_object)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "ruby_basics": {
    "_source": "d192835ed2cc",
    "label": "Just enough Ruby to read Rails",
    "lesson": {
      "level": "Starting point",
      "summary": "You don't need to learn all of Ruby before Rails: you need to recognize the syntax that shows up in models, controllers and examples.",
      "why": "Your backend knowledge already transfers; this concept only keeps Ruby syntax from hiding the Rails concept you are studying.",
      "code": "# symbol, hash and keyword arguments\ndef create_order(user:, status: :pending)\n  { user_id: user.id, status: status }\nend\n\n# block: equivalent to iterating over a collection\nposts.each do |post|\n  puts post.title\nend\n\norder.save! # ! usually indicates it raises an exception if it fails",
      "codeLabel": "The Ruby you will find in Rails",
      "steps": [
        "A symbol like :pending is a short value Rails uses to name states, options or keys; it is not a variable or a class.",
        "A Hash like { name: \"Ana\" } groups key-value pairs, similar to a JavaScript object or a PHP associative array.",
        "A do ... end block is code that a method runs later; each runs it for every element and transaction runs it inside a transaction.",
        "The ! at the end of a method usually signals the strict version; for example save! raises an error if it cannot save."
      ],
      "pitfalls": [
        "The ! is a common convention, not a universal Ruby rule; always check what the specific method promises.",
        "You don't need to translate Ruby into PHP word by word in your head: first identify the goal of the code, then the syntax."
      ],
      "takeaway": "If you can read symbols, hashes, keyword args, blocks and the !, Rails examples stop looking like a foreign language.",
      "explanation": "Before studying Rails you need to be able to read its examples. Ruby uses a compact syntax, but the ideas are familiar: classes, methods, objects, collections and exceptions. This concept is not about writing advanced Ruby; it is about making sure a block like User.transaction do ... end doesn't distract you from the transaction concept that comes next."
    }
  },
  "mvc": {
    "_source": "69ed05725519",
    "label": "Rails MVC + conventions",
    "lesson": {
      "level": "Fundamentals",
      "summary": "Rails combines MVC with Convention over Configuration: names and locations connect routes, controllers, models, tables and views.",
      "why": "You already know MVC; what matters in the interview is explaining how conventions reduce configuration and speed up development, at the cost of having to know the defaults.",
      "code": "# config/routes.rb\nresources :posts, only: :index\n\n# app/controllers/posts_controller.rb\nclass PostsController < ApplicationController\n  def index\n    @page_title = \"Posts\"\n    # Rails looks for views/posts/index.html.erb by convention\n  end\nend\n\n# The model and Active Record are covered in the next branch.",
      "codeLabel": "First piece of MVC, without touching the database yet",
      "steps": [
        "A thin controller holds transport logic: permitted params, authentication/authorization, choosing the use case and mapping the result to HTTP.",
        "Rules that stay true regardless of whether the order was created via web, console, API or job belong in the model or a domain object.",
        "If the rule needs to coordinate Order, Inventory, a transaction and an external payment, name the flow with a Service Object like CheckoutOrder.",
        "For an API, a serializer/presenter prepares the structure for the client; that way you don't mix JSON formatting with domain decisions."
      ],
      "pitfalls": [
        "A controller with price calculations, state changes, several saves and calls to providers becomes hard to reuse and test outside HTTP.",
        "Not every method goes in the model: if it only organizes a screen or spans several aggregates, a fat model gets confusing too.",
        "The phrase controller = business logic is too broad. In Rails, the controller coordinates a request; business logic lives as close as possible to the rule it protects."
      ],
      "takeaway": "Think of the controller as an HTTP translator, the model as the guardian of its own state and the service as the explicit name of a business process.",
      "explanation": "The controller is not the general owner of business rules. It is the HTTP boundary: it receives the verb, URL and params, checks identity and authorization, calls the right use case and translates the result into JSON, HTML or a status. The model represents a domain entity and the rules close to its own state; for example, Order can know whether it can be canceled. When an operation coordinates several models, a transaction or an external provider, a Service Object usually expresses that use case better. Shaping the response specifically for React belongs to a serializer or presenter; the controller decides to use it, but shouldn't build all the formatting logic.",
      "tableTitle": "Controller, Model and Service",
      "tableLabel": "The HTTP boundary is not the place for all the logic",
      "table": {
        "columns": [
          "Piece",
          "Responsibility",
          "Healthy example"
        ],
        "rows": [
          [
            "Controller",
            "Translate HTTP to and from the use case.",
            "Reads order_params, authorizes and responds 201 or 422."
          ],
          [
            "Model",
            "State, relationships and rules specific to an entity.",
            "order.cancelable? or order.mark_paid!."
          ],
          [
            "Service Object",
            "Coordinate a flow that spans entities or systems.",
            "CheckoutOrder creates the order and items and coordinates payment."
          ],
          [
            "Serializer",
            "Choose which JSON structure the client sees.",
            "OrderSerializer exposes total, status and customer."
          ]
        ]
      }
    }
  },
  "rack": {
    "_source": "a351c8da6c61",
    "label": "Request lifecycle & Rack",
    "lesson": {
      "level": "Infrastructure",
      "summary": "Rack is the layer that connects the web server to Rails. It sits before the router and lets the request pass through middleware before reaching your controller.",
      "why": "Think of it as the Ruby equivalent of the PSR-15 world you already know: a middleware chain receives a request, can act on it and delegates to the next component.",
      "code": "Browser: GET /orders/42\n  ↓\nNginx / Puma (receives HTTP)\n  ↓\nRack middleware (cookies, session, CSRF, logs...)\n  ↓\nRails router → OrdersController#show\n  ↓\nRack returns [status, headers, body]\n  ↓\nBrowser receives the response",
      "codeLabel": "Where Rack shows up in a real request",
      "steps": [
        "The browser sends HTTP and a server like Puma accepts that connection.",
        "Rack turns that incoming request into a format that Rails and its middleware can process.",
        "A middleware is a layer that runs before or after Rails for repeated tasks, such as reading cookies, writing logs or validating CSRF.",
        "After the router and controller, Rack hands the server the status, headers and body that will travel to the browser."
      ],
      "pitfalls": [
        "Rack doesn't choose the route or query the database; it only connects pieces of the HTTP cycle.",
        "Middleware order matters because a later layer depends on what an earlier layer already did."
      ],
      "takeaway": "To explain it in an interview: Rack is the contract and pipeline that carries HTTP to Rails; Rails uses middleware before deciding the route and the controller.",
      "diagramTitle": "Request lifecycle: from the browser to Rails",
      "diagram": [
        {
          "label": "Browser",
          "detail": "GET /orders/42"
        },
        {
          "label": "Puma / Nginx",
          "detail": "receives HTTP"
        },
        {
          "label": "Rack middleware",
          "detail": "session, CSRF, logs"
        },
        {
          "label": "Rails router",
          "detail": "picks the action"
        },
        {
          "label": "Controller",
          "detail": "coordinates the response"
        },
        {
          "label": "HTTP response",
          "detail": "status + headers + body"
        }
      ],
      "explanation": "We are still before the router. When the browser requests a URL, a web server hands that request to Rails through Rack. Rack is just a common contract so the server, middleware and Rails can talk to each other; it is not a database, a screen or the router."
    }
  },
  "routing_rest": {
    "_source": "96e869745bd7",
    "label": "RESTful routing",
    "lesson": {
      "level": "Rails core",
      "summary": "The router translates a combination of HTTP verb and path into a controller action.",
      "why": "In an interview, designing a feature usually starts by defining resources, actions and HTTP boundaries.",
      "code": "# config/routes.rb\nRails.application.routes.draw do\n  resources :posts, only: %i[index show create update destroy]\nend\n\n# Rails automatically creates the routes from the table above.\n# For now ignore member: it is an extension for later.",
      "codeLabel": "The simplest way to declare a resource's routes",
      "steps": [
        "A route combines an HTTP verb and a URL; for example GET /posts means requesting information and POST /posts means submitting a creation.",
        "A resource is a business thing with an identity, like a post or an order; Rails generates standard routes to work with that resource.",
        "index means listing several records, show means viewing one, create means creating one, update changing it and destroy deleting it.",
        "resources :posts creates that route map without declaring one line per action."
      ],
      "pitfalls": [
        "GET /posts and GET /posts/42 are different requests: one asks for a collection and the other for a single element.",
        "REST organizes the common operations; for a special business action you can add an extra route once it is clear which need it addresses."
      ],
      "takeaway": "A route answers: for this HTTP verb and this URL, which controller method runs?",
      "explanation": "Routing is the map that says which code runs for each HTTP request. A route combines a verb like GET or POST with a URL like /posts. RESTful is a convention for naming those routes when you work with resources: a post, an order or a user. Rails uses standard names so everyone knows which action each endpoint performs.",
      "table": {
        "columns": [
          "Request",
          "Rails action",
          "Meaning"
        ],
        "rows": [
          [
            "GET /posts",
            "index",
            "list many posts"
          ],
          [
            "GET /posts/42",
            "show",
            "view a single post with id 42"
          ],
          [
            "POST /posts",
            "create",
            "create a post with the submitted data"
          ],
          [
            "PATCH /posts/42",
            "update",
            "change post 42"
          ],
          [
            "DELETE /posts/42",
            "destroy",
            "delete post 42"
          ]
        ]
      }
    }
  },
  "controllers_params": {
    "_source": "cc1cc1f07db8",
    "label": "Controllers & strong params",
    "lesson": {
      "level": "Rails core",
      "summary": "The controller receives HTTP, authorizes and validates the shape of the input, delegates the use case and builds the response.",
      "why": "Strong Parameters prevents mass assignment of fields the client shouldn't control.",
      "codeLabel": "Accept only permitted input",
      "steps": [
        "The Controller receives the request the router already picked and decides how to respond.",
        "params contains data sent via URL, form or JSON; for example a profile's name and timezone.",
        "params.require demands that an expected group of data exists and permit lists the fields you do accept.",
        "Before passing data to a model or service, the controller discards fields the client has no right to modify."
      ],
      "pitfalls": [
        "Strong Parameters limits which fields come in, but it doesn't check whether an email is valid or whether an order has stock; those are other rules.",
        "Putting complex queries, transactions and external calls inside the controller makes an action hard to test and understand."
      ],
      "takeaway": "Before talking about models, understand this boundary: the controller decides which HTTP input reaches the rest of the application.",
      "explanation": "After a route picks an action, the Controller receives the request data. params is the container for that data: for example, what a form or a JSON payload sends. Strong Parameters is an explicit list of fields you accept; it prevents the client from changing attributes it shouldn't be able to control."
    }
  },
  "responses_errors": {
    "_source": "b1ca908fed72",
    "label": "Responses, status & errors",
    "lesson": {
      "level": "Rails core",
      "summary": "A Rails action must respond with a representation, a redirect or a consistent status, and map expected failures.",
      "why": "The interviewer may evaluate both the happy path and what happens with invalid data, missing records or conflicts.",
      "code": "def preview\n  render json: { message: \"accepted\" }, status: :ok\nrescue ActionController::ParameterMissing => error\n  render json: { error: error.message }, status: :bad_request\nend\n\n# Later on:\n# 201 create · 404 not found · 422 validation failure",
      "codeLabel": "Responding over HTTP without depending on the database yet",
      "steps": [
        "Every action ends with an HTTP response: a status that explains the outcome and a body with JSON, HTML or nothing.",
        "200 means the operation went fine; 201 usually indicates something was created; 404 that it doesn't exist; 422 that the data doesn't meet the rules.",
        "render sends content in the current response; redirect_to asks the browser to make another request to a URL.",
        "An expected error is translated into a clear status and message so the frontend knows what to do."
      ],
      "pitfalls": [
        "Responding 200 for an error forces the frontend to guess whether the operation really worked.",
        "Don't return stack traces, secrets or internal details of unexpected errors to the client."
      ],
      "takeaway": "The controller doesn't just run code: it defines the HTTP contract the client observes.",
      "explanation": "The visible work of a controller action ends with an HTTP response. That response has a status, for example 200 or 404, and a body, for example JSON or HTML. Designing errors means deciding which failures are expected and turning them into a clear response for the client, without exposing internal details."
    }
  },
  "ar_pattern": {
    "_source": "5af0249351e0",
    "label": "Active Record mental model",
    "lesson": {
      "level": "Fundamentals",
      "summary": "Active Record mixes domain object and persistence; Data Mapper keeps those responsibilities separate.",
      "why": "The difference explains why Rails feels direct and when an additional boundary may be worth it.",
      "code": "post = Post.new(title: \"Hola\")\npost.save\n\n# Active Record: the object knows how to persist itself.\n\npost = Post.new(title: \"Hola\")\npost_repository.save(post)\n\n# Data Mapper: a collaborator saves the object.",
      "codeLabel": "Two persistence boundaries",
      "steps": [
        "Each model instance normally represents a row: a Ruby Post corresponds to a record in the posts table.",
        "The model contains attributes and methods like save, which is why Active Record puts object and persistence together in a direct API.",
        "This resembles Eloquent: you can create, find and save without writing SQL for each operation.",
        "The convenience is high for CRUD; as the domain grows, you split use cases into services and complex queries into Query Objects."
      ],
      "pitfalls": [
        "A Repository is a persistence boundary separate from the model. It makes sense if it hides a complex query, combines data sources or lets you swap a relevant dependency.",
        "A UserRepository.find(id) that only delegates to User.find(id) doesn't add a useful boundary: it doesn't shield the domain from anything or simplify a decision; it only adds a hop and another name to maintain.",
        "Active Record doesn't force every flow to live inside User or Order either: operations that coordinate several entities can still live in services."
      ],
      "takeaway": "Choose an extra abstraction when it changes a dependency or reduces real complexity, not just because a pattern name exists.",
      "explanation": "Active Record is the pattern Rails uses so a Ruby object represents a row and also knows how to read or save that row. For example, User.find(7) looks up a row in users and returns a User. A Repository is a separate class that encapsulates data access; it is only worth it if it actually hides a decision or a data source. If UserRepository#find(id) only does User.find(id), the rest of the app still depends on Active Record and now also has to go through another class that added no behavior, security or different interface."
    }
  },
  "ar_orm": {
    "_source": "c97b5fd6d522",
    "label": "CRUD, Relation & lazy queries",
    "lesson": {
      "level": "Rails core",
      "summary": "Active Record translates Ruby methods into chainable SQL queries and CRUD operations.",
      "why": "It is the everyday vocabulary for reading, creating, updating and deleting data.",
      "codeLabel": "Query and mutations",
      "steps": [
        "Post.create creates and saves a record; update changes attributes of an existing record; destroy deletes it.",
        "where, order and limit build a Relation: a prepared query that can still take more filters.",
        "Rails runs the query when you need the records, for example when iterating it with each or asking for its results.",
        "find looks up by id and fails if it doesn't exist; find_by looks up by condition and returns nil if it finds nothing."
      ],
      "pitfalls": [
        "Loading records too early with each or to_a prevents further composing of the query and can fetch more data than needed.",
        "The ORM makes SQL more convenient, but it doesn't replace indexes, constraints or checking which query actually ends up running."
      ],
      "takeaway": "Identify whether you are handling a relation, a record or already loaded results.",
      "explanation": "CRUD means creating, reading, updating and deleting records. In Rails, methods like where and order usually don't fetch data immediately: they return a Relation, that is, an object representing a query that can still keep being built. When you iterate it or need the result, Rails runs SQL."
    }
  },
  "migrations": {
    "_source": "b1b6ad8c371b",
    "label": "Migrations, indexes & constraints",
    "lesson": {
      "level": "Rails core",
      "summary": "A migration describes a versioned, reproducible change to the database schema.",
      "why": "It lets development, CI and production apply the same history of changes.",
      "codeLabel": "Reversible change",
      "steps": [
        "For a new table, the migration can create the column, foreign key, index and constraint from the start.",
        "To add a required field to a populated table, first add a column that accepts null or a safe default.",
        "Backfill means going through the existing records and filling in that new field, ideally in batches so you don't lock a large table for too long.",
        "Once you've verified no invalid data remains, a later migration adds NOT NULL, a unique index or whatever constraint applies."
      ],
      "pitfalls": [
        "A migration describes structure; it is not the ideal place for a long process that updates millions of rows during a deploy.",
        "Adding a required rule before the backfill can make the deploy fail because the old rows don't meet the rule yet.",
        "An index speeds up reads and can also enforce uniqueness, but it adds space and write cost."
      ],
      "takeaway": "Backfill = filling in existing data after adding a field; only then do you tighten the schema constraint.",
      "explanation": "A migration changes the shared structure of the database: tables, columns, indexes and constraints. A backfill is a separate step that fills in a new field on rows that existed before the change. For example, if you add users.timezone to a table with thousands of users, you first temporarily allow null, then a job or task updates the old records in batches, and only after that do you require NOT NULL. That way the schema and the old data evolve without assuming the table starts empty."
    }
  },
  "validations": {
    "_source": "0692edf7fcc1",
    "label": "Validations and integrity",
    "lesson": {
      "level": "Rails core",
      "summary": "Validations protect the model before it is persisted and explain why a record is invalid.",
      "why": "They centralize data rules and let you return useful errors to the user.",
      "code": "class User < ApplicationRecord\n  validates :email, presence: true, uniqueness: true\nend\n\n# db/migrate/..._add_unique_email_to_users.rb\nadd_index :users, :email, unique: true\n\n# If two requests pass validates at the same time,\n# the database accepts one and rejects the other with RecordNotUnique.",
      "codeLabel": "Validation for UX + constraint for concurrency",
      "steps": [
        "The model validation runs inside the application and lets you show messages like email is already taken before saving.",
        "Under concurrency, request A and request B can check at almost the same time and both see that the email doesn't exist yet.",
        "The database's unique index is the arbiter: it only lets one row with that value commit, even if two concurrent INSERTs arrive.",
        "At the application edge, catch the expected conflict and return an appropriate error; don't rely solely on validates uniqueness."
      ],
      "pitfalls": [
        "Validating uniqueness without a unique index leaves a race condition: duplicates can appear under real load.",
        "A unique index doesn't replace friendly validation messages; the two serve different purposes.",
        "Don't put a manual exists? query in the controller thinking it solves concurrency: it has the same race window."
      ],
      "takeaway": "Validation = early feedback. Database constraint = real integrity, even when several requests compete.",
      "explanation": "Model validations give understandable errors before trying to save, but they are not a sufficient guarantee when two requests arrive at the same time. A uniqueness validation asks whether the value looks free; between that question and the INSERT another request can save the same value. The final guarantee lives in the database through a unique index or constraint. The application keeps the validation for a good experience and also handles the database rejection (for example ActiveRecord::RecordNotUnique) by returning a conflict or a clear error."
    }
  },
  "assoc_belongs": {
    "_source": "c07174af9be6",
    "label": "belongs_to / has_many",
    "lesson": {
      "level": "Rails core",
      "summary": "Associations express relationships between models and hide much of the foreign key handling.",
      "why": "A well-associated model makes business code read like the real domain.",
      "codeLabel": "One to many",
      "steps": [
        "A foreign key is a column that stores the id of another record; comment.post_id points to the post that owns the comment.",
        "belongs_to :post in Comment means a comment has an owning post.",
        "has_many :comments in Post means a post can retrieve all the comments that have its post_id.",
        "Rails generates navigation methods like comment.post and post.comments using that declared relationship."
      ],
      "pitfalls": [
        "The Ruby association doesn't create a safe foreign key in the database on its own; the migration must create it.",
        "Choose dependent: :destroy only if deleting the owner really should delete the associated records; it is a business decision."
      ],
      "takeaway": "The location of the foreign key tells you where belongs_to goes.",
      "explanation": "An association describes how two types of data are connected. If a comment belongs to a post, each comments row stores post_id. That is why Comment uses belongs_to :post and Post uses has_many :comments. Rails uses those declarations to give you methods like post.comments and comment.post without writing the join by hand."
    }
  },
  "transactions": {
    "_source": "a2b6737372be",
    "label": "Transactions & atomicity",
    "lesson": {
      "level": "Active Record",
      "summary": "A transaction groups writes so that either all of them commit or none do.",
      "why": "It is essential when a business need modifies several rows that must stay consistent.",
      "code": "order = Order.transaction do\n  order = user.orders.create!(status: \"pending\")\n  params[:items].each do |item|\n    order.items.create!(item)\n  end\n  order\nend\n\n# Any exception inside the block triggers a rollback.",
      "codeLabel": "Keeping an invariant",
      "steps": [
        "A transaction opens a protected block for several related writes.",
        "If the whole block finishes fine, Rails commits the changes; if an operation raises an error, Rails reverts that block's changes.",
        "Creating an order and all its items together prevents a half-built order from existing.",
        "Methods with ! are useful inside a transaction because a failure raises an error and triggers the rollback."
      ],
      "pitfalls": [
        "A transaction only reverts database changes; it cannot unsend an email or refund a card charge.",
        "Don't keep a transaction open while waiting on an external network call, because it holds database resources for longer."
      ],
      "takeaway": "Transactions for local consistency; idempotency and compensation for external effects.",
      "explanation": "Use a transaction when several writes represent a single business decision. For example, creating an order and its items must happen all or nothing: if one item fails, you don't want an incomplete order. The transaction protects changes inside the database; it cannot undo an email already sent or a charge already made on Stripe."
    }
  },
  "scopes": {
    "_source": "939ec049ff2b",
    "label": "Scopes",
    "lesson": {
      "level": "Rails core",
      "summary": "A scope is a named, reusable, chainable query on a model.",
      "why": "It avoids repeating common filters and makes the query express intent.",
      "codeLabel": "Queries with intent",
      "steps": [
        "A scope gives a name to a small query that repeats, like published for published posts.",
        "The scope returns a Relation, so you can combine it with other filters: Post.published.order(...).",
        "The name should express an understandable business idea, not a confusing technical detail.",
        "If the query needs many parameters, joins and conditions, you move it to a Query Object with a clearer interface."
      ],
      "pitfalls": [
        "A huge scope can hide expensive SQL and make it hard to know which records it returns.",
        "A scope must keep returning a chainable query; returning nil breaks later combinations."
      ],
      "takeaway": "A good scope has a business name and a short query.",
      "explanation": "A scope is a reusable name for a frequent query. Instead of repeating everywhere the filter on published: true, you define published and combine it with other queries. It is useful as long as it stays a small, clear condition; if it starts taking many filters and joins, the next step is a Query Object."
    }
  },
  "n_plus_one": {
    "_source": "241d0bf246b2",
    "label": "N+1 queries",
    "lesson": {
      "level": "Performance",
      "summary": "N+1 happens when an initial query fetches N records and then another query runs for each association.",
      "why": "It can look fine in development and become very slow as the collection grows.",
      "code": "Post.limit(100).each do |post|\n  puts post.author.name\nend\n\n# 1 query for posts + 1 query per author:\n# SELECT * FROM posts LIMIT 100\n# SELECT * FROM users WHERE id = 7\n# SELECT * FROM users WHERE id = 8",
      "codeLabel": "How it shows up",
      "steps": [
        "First you load a list, for example 100 posts, with one query.",
        "Then a loop asks for post.author on each post; if author isn't loaded, Rails runs another query on every iteration.",
        "The result is one initial query plus N additional queries, hence the name N+1.",
        "SQL logs or tools like Bullet let you detect the pattern by looking at how many queries a screen produces."
      ],
      "pitfalls": [
        "The problem isn't using a loop; the problem is that the loop triggers repeated data access.",
        "Don't optimize on intuition: check the logs and the real size of the list to confirm the cost."
      ],
      "takeaway": "Ask how many queries each loop that navigates associations produces.",
      "explanation": "N+1 shows up when you load a list and then, inside a loop, Rails runs another query for each element to fetch an association. For example, listing 100 posts and asking for post.author on each iteration can produce 101 queries. The code looks simple, but the cost grows with the number of rows."
    }
  },
  "eager_loading": {
    "_source": "6bc2c7133efe",
    "label": "Eager loading",
    "lesson": {
      "level": "Performance",
      "summary": "Eager loading loads associations before you use them to avoid repeated queries inside loops.",
      "why": "It is the practical fix for N+1, balancing queries, memory and result size.",
      "code": "posts = Post.includes(:author).limit(100)\n\nposts.each do |post|\n  puts post.author.name\nend\n\n# preload: separate queries\n# eager_load: LEFT OUTER JOIN when needed",
      "codeLabel": "Load what you are going to read",
      "steps": [
        "includes(:author) tells Rails you will need the authors along with the posts.",
        "Rails loads that association before the loop, so post.author doesn't need a new query each time.",
        "preload and eager_load are internal variants; for an interview it is enough to know Rails can use separate queries or a join depending on the case.",
        "The goal is to read data that is already loaded, not to request it repeatedly inside a collection."
      ],
      "pitfalls": [
        "Loading every association by default can fetch thousands of rows and waste memory.",
        "includes fixes N+1 only for the associations you declared and actually use."
      ],
      "takeaway": "The right optimization depends on query count, size and memory.",
      "explanation": "Eager loading means loading ahead of time the associations you know you will read. With includes(:author), Rails avoids fetching the author once per post. It is not performance magic: it trades fewer queries for more data in memory, which is why you use it once you've looked at the real access pattern and found an N+1."
    }
  },
  "assoc_through": {
    "_source": "b37d303f9b0e",
    "label": "has_many :through",
    "lesson": {
      "level": "Rails core",
      "summary": "has_many :through models many-to-many when the intermediate relationship has its own data or behavior.",
      "why": "It is more expressive than hiding an important relationship in a join table without identity.",
      "codeLabel": "The intermediate relationship matters",
      "steps": [
        "A migration creates posts, comments and the comments.post_id column; only then do the Ruby associations describe how to navigate that data.",
        "has_many :comments reads many Comment records whose post_id foreign key points to this Post. There is no hidden or implicit table.",
        "In Student → Enrollment → Course, Enrollment is an explicit model and table with student_id and course_id.",
        "has_many :courses, through: :enrollments tells Rails to reach the courses by going through those enrollments."
      ],
      "pitfalls": [
        "Don't confuse a Ruby association with a SQL migration: the first declares navigation; the second creates and protects structure.",
        "Use an intermediate model when the relationship has attributes or rules. If you only need a simple relationship, more abstraction can needlessly hide the schema.",
        "Add a unique index on student_id and course_id if a person can't enroll twice in the same course."
      ],
      "takeaway": "Rails never creates tables when you write has_many; through makes explicit the model that represents an important relationship.",
      "explanation": "No: declaring has_many doesn't create any table automatically. Tables are always created by a migration. A direct has_many describes a one-to-many relationship using a foreign key that already exists: Post has_many :comments because comments has post_id. has_many :through goes through an intermediate model that you define, like Enrollment, and that is why it lets you treat that relationship as something with its own data: date, role, status or validations."
    }
  },
  "service_object": {
    "_source": "e63751011e63",
    "label": "Service Object",
    "lesson": {
      "level": "Application design",
      "summary": "A Service Object encapsulates a use case: an action that coordinates several steps and objects.",
      "why": "It avoids fat controllers and makes a flow like charging an order and sending a notification testable.",
      "codeLabel": "An explicit use case",
      "steps": [
        "Define an explicit input with initialize, for example user:, cart: and payments:. initialize is the closest thing to a constructor: it runs when you create the object with .new.",
        "Store dependencies and data in instance variables like @user. The @ is Ruby syntax for data that belongs to that instance; it is not Rails or a reserved name.",
        "call runs a complete flow and returns a result or raises an error that the controller translates to HTTP.",
        "The controller can do CheckoutOrder.new(...).call or the class can offer self.call as a shorthand. Both forms are design conventions."
      ],
      "pitfalls": [
        "Don't use Service Object as a generic folder for any awkward method: it must have a clearly named use case.",
        "A service that reads params or calls render is still coupled to HTTP; take in already permitted data and return a domain result.",
        "call doesn't grant a transaction, validation or async on its own; each of those decisions must be written explicitly."
      ],
      "takeaway": "call is an action convention; a Service Object is worth it when it makes explicit a business flow that doesn't belong to a single entity.",
      "explanation": "A Service Object is a plain Ruby class that names and runs a use case: checkout, canceling a subscription or importing a CSV. call is not a reserved Rails method or a special capability of services; it is a Ruby convention. Any class can define def call, and using Service.call(...) makes it visible that the class represents an action. Ruby Procs/lambdas also have call, but that doesn't make every call a Service Object."
    }
  }
};
