// rails concepts (case_content, api_mode, serialization_cors, auth_security, react_rails_auth, asset_pipeline, modern_assets, rspec_basics, factory_bot, spec_types, gemfile, env_logger)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "case_content": {
    "_source": "514824e39f94",
    "label": "Case: reusable comments",
    "lesson": {
      "level": "Design case",
      "summary": "Reusable comments or attachments can belong to different models through a polymorphic association.",
      "why": "It is the concrete case that shows when to choose polymorphism and when to prefer explicit associations.",
      "code": "class Comment < ApplicationRecord\n  belongs_to :user\n  belongs_to :commentable, polymorphic: true\n\n  validates :body, presence: true\nend\n\n# Conceptually, the migration would have:\n# comments.user_id\n# comments.commentable_type\n# comments.commentable_id\n\n# The database can protect user_id if it points to users.\n# It cannot declare a single FK for posts and videos at the same time.",
      "codeLabel": "Comments: author + target resource",
      "steps": [
        "The request receives commentable_type/id, but the server must turn them into an allowed resource and check that the user can comment on it.",
        "Comment stores the author's user_id and the type/id pair of the commented object; they are two independent relationships within the same record.",
        "The user_id → users.id foreign key can be a traditional one because it always points to users.",
        "For commentable, the application validates existence and authorization. If the Post is deleted, an explicit policy can delete its comments or keep them anonymized."
      ],
      "pitfalls": [
        "Do not add User as a `through` just because it appears in the scenario: a through represents a real path across tables, not any related entity.",
        "If the business needs maximum referential integrity and only Post and Video exist, two explicit associations may be preferable to polymorphism.",
        "If there are many types and the cross-cutting capability is stable, polymorphism reduces repeated tables, but you accept more responsibility in code and in deletion processes."
      ],
      "takeaway": "The comment has an author and a target; neither of those two roles automatically turns the relationship into many-to-many.",
      "prompt": "“Posts, videos and tickets must accept comments with the same functionality.”",
      "diagramTitle": "Polymorphic association",
      "diagram": [
        {
          "label": "Comment",
          "detail": "body + author"
        },
        {
          "label": "commentable",
          "detail": "type + id"
        },
        {
          "label": "Post",
          "detail": "one possible type"
        },
        {
          "label": "Video / Ticket",
          "detail": "other types"
        }
      ],
      "explanation": "For comments, the natural model is `Comment belongs_to :user` to represent the author and `Comment belongs_to :commentable, polymorphic: true` to represent the commented resource. A comment does not need a many-to-many relationship: it has one author and one target. User does not connect Post with Video; it simply identifies who wrote it. If tomorrow you also want to mention users or share comments across several resources, that would be a different need and might require another relationship, but it is not a good idea to add it to the original model without a real business rule."
    }
  },
  "api_mode": {
    "_source": "b08708308380",
    "label": "Rails API-only + React",
    "lesson": {
      "level": "Architecture",
      "summary": "Rails API-only removes traditional views and focuses on JSON endpoints for another client.",
      "why": "It is common when React, mobile or another service consumes Rails as a backend.",
      "codeLabel": "JSON backend",
      "steps": [
        "Rails API-only keeps routes, controllers, models and services, but normally responds with JSON instead of HTML.",
        "React makes an HTTP request, Rails processes the use case and returns JSON with a clear status.",
        "The controller still uses permitted params, authentication and authorization; switching to an API does not remove those responsibilities.",
        "The application can have a separate React app with its own build or an integrated frontend, depending on the actual architecture."
      ],
      "pitfalls": [
        "An API should not automatically return every column of a model; choose an explicit representation.",
        "API-only does not by itself solve authentication, CORS, versioning or error handling."
      ],
      "takeaway": "In API-only, the HTTP contract is the main interface.",
      "explanation": "A Rails API-only app does not render HTML as its main responsibility; it responds with JSON for a frontend like React to consume. The architecture still has routes, controllers, models and services. The difference is that the usual output is a JSON contract with an HTTP status, not an ERB view."
    }
  },
  "serialization_cors": {
    "_source": "28610d542501",
    "label": "JSON, serializers & CORS",
    "lesson": {
      "level": "API for React",
      "summary": "An API must control its JSON representation and explicitly allow the origins that can call it from the browser.",
      "why": "Separate React and Rails apps turn serialization and CORS into part of the contract, not accidental details.",
      "codeLabel": "Frontend/backend contract",
      "steps": [
        "A serializer transforms a model into the JSON the frontend expects; it decides which fields and relationships are exposed.",
        "CORS is a rule the browser applies before allowing a website to call an API on another origin.",
        "You configure CORS with allowed origins, methods and headers, for example allowing only your React domain.",
        "The frontend can handle statuses and messages because the API returns a consistent contract."
      ],
      "pitfalls": [
        "Allowing any origin for convenience can open the API more than necessary.",
        "CORS does not replace authentication: allowing a request from a site does not mean the user has permission."
      ],
      "takeaway": "For React, JSON is a public interface: explicit, small, stable and authorized.",
      "explanation": "Serializing means choosing exactly which data is turned into JSON and under which names. CORS is a browser rule that decides from which web origin calls to the API are allowed. They are two different responsibilities: the serializer takes care of the data contract; CORS controls which frontend can make the request from the browser."
    }
  },
  "auth_security": {
    "_source": "18bda57fc54c",
    "label": "Auth, authorization & security",
    "lesson": {
      "level": "API and security",
      "summary": "Authentication answers who the user is; authorization decides whether they can perform an action on a resource.",
      "why": "In Rails web apps, sessions, signed cookies, CSRF and strong params also show up as common defenses.",
      "code": "# Rails includes a token in an HTML form\n<%= form_with model: @order do |form| %>\n  ...\n<% end %>\n\n# If Rails serves the HTML, csrf_meta_tags puts it in a meta tag.\n# If React is separate, an endpoint can deliver the token:\nclass CsrfController < ApplicationController\n  def show\n    render json: { csrf_token: form_authenticity_token }\n  end\nend\n\n# React fetches /csrf first and then sends the token.\nfetch(\"https://api.example.com/orders\", {\n  method: \"POST\",\n  credentials: \"include\", # attaches the session cookie\n  headers: { \"X-CSRF-Token\": csrfToken, \"Content-Type\": \"application/json\" },\n  body: JSON.stringify(orderData)\n})",
      "codeLabel": "CSRF in a Rails app with a session cookie",
      "steps": [
        "The user logs in and Rails stores a session in a cookie. The browser will automatically send that cookie with requests to that domain.",
        "A malicious site could try to make a POST /orders from another page; the cookie might be sent along, but the site should not know the CSRF token Rails expects.",
        "The legitimate frontend gets the token from the meta tag or from a /csrf endpoint and sends it in the form or a header; Rails verifies that it matches before accepting the mutation.",
        "The token is tied to the session. Depending on the session store, that session can live in an encrypted/signed cookie, Redis or the database; there is not necessarily a csrf_tokens table.",
        "A Rails API-only app does not ship with sessions and CSRF protection enabled the way a traditional web app does; if you use cookies, you have to enable/configure that support.",
        "If the API authenticates the request exclusively with `Authorization: Bearer ...` and not with an automatic cookie, the CSRF risk changes; XSS, expiration and secure token storage are still important."
      ],
      "pitfalls": [
        "CSRF does not mean someone stole the password: it means an external site tries to take advantage of a session the browser already has open.",
        "CORS does not authenticate, nor does it by itself prevent an HTML form from sending a request; its main role is to control reads from browser JavaScript.",
        "Do not disable CSRF protection globally without understanding which endpoints use cookies. For a cookie-based endpoint, prefer a token, an appropriate SameSite setting and origin verification where applicable."
      ],
      "takeaway": "An automatic cookie means thinking about CSRF; a Bearer token in a header changes that risk, but does not remove security concerns: you still have to protect tokens, the session, authorization and against XSS.",
      "explanation": "CSRF stands for Cross-Site Request Forgery. The problem appears when Rails authenticates via a cookie: the browser attaches that cookie automatically even if a malicious page tries to send a request to your app. Rails generates a secret token tied to the session; the legitimate form or frontend sends it with the request and Rails rejects a mutation without the correct token. CORS does not replace CSRF: CORS limits which JavaScript from another origin can read responses, while CSRF protection prevents a malicious site from managing to execute changes using your cookies."
    }
  },
  "react_rails_auth": {
    "_source": "aa1b4907f741",
    "label": "React + Rails auth with tokens",
    "lesson": {
      "explanation": "A common flow when React and Rails are separate is to use a short-lived access token for requests and a longer-lived refresh token to get a new one when the first expires. Rails authenticates the user at login, returns the access token and stores the refresh token in a revocable way (ideally only its hash). React sends `Authorization: Bearer <access_token>` to every endpoint. When Rails responds 401 due to expiration, React calls refresh, Rails rotates the refresh token and returns a new access token; React retries the original request only once. Logout revokes the refresh token. The access token can live in memory to reduce exposure; a refresh token in an HttpOnly cookie must be paired with CSRF protection because the cookie is sent automatically.",
      "codeLabel": "Round trip: login, request, refresh and logout",
      "code": "// React: login\nconst response = await fetch(API_URL + \"/login\", {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/json\" },\n  credentials: \"include\", // if refresh lives in an HttpOnly cookie\n  body: JSON.stringify({ email, password })\n});\nconst { access_token } = await response.json();\n\n// React: authenticated request\nfetch(API_URL + \"/orders\", {\n  headers: { Authorization: \"Bearer <access_token>\" }\n});\n\n// Rails, conceptually\ndef show\n  user = authenticate_access_token! # signature + expiration + user_id\n  order = user.orders.find(params[:id]) # authorization by scope\n  render json: OrderSerializer.new(order)\nend\n\n// If a 401 arrives due to expiration:\n// 1. POST /auth/refresh with the HttpOnly cookie\n// 2. Rails rotates/verifies refresh and returns a new access token\n// 3. React retries the original request only once",
      "tableTitle": "What travels at each step",
      "tableLabel": "Separate identity, authorization and renewal",
      "table": {
        "columns": [
          "Moment",
          "React client",
          "Rails"
        ],
        "rows": [
          [
            "Login",
            "Sends email/password over HTTPS.",
            "Verifies credentials and creates tokens."
          ],
          [
            "Normal request",
            "Sends Bearer access token.",
            "Validates signature/expiration and gets current_user."
          ],
          [
            "Resource",
            "Reads JSON or receives 401/403.",
            "Authorizes the resource before responding."
          ],
          [
            "Refresh",
            "Requests a new token with refresh.",
            "Verifies/rotates refresh and returns a short access token."
          ],
          [
            "Logout",
            "Discards local access token.",
            "Revokes refresh to prevent new sessions."
          ]
        ]
      },
      "steps": [
        "Login: React sends credentials over HTTPS; Rails verifies the password with bcrypt/Devise and returns neither the password nor a permanent secret.",
        "Rails generates a short-lived access token and a refresh token. The server should be able to revoke the refresh token by storing a reference or hash in the database.",
        "On each request, React adds the access token in Authorization. Rails validates the signature, expiration and user; then it applies authorization, for example current_user.orders.find(id).",
        "If the access token expires, Rails returns 401. A React interceptor calls refresh only once, updates the access token and retries the original request; avoid infinite loops.",
        "Logout revokes the refresh token on the server and deletes the local access token. An access token that was already issued may remain valid until it expires, which is why it must be short-lived."
      ],
      "pitfalls": [
        "Do not confuse authentication (who you are) with authorization (which resource you can use). A valid token does not authorize access to any order id.",
        "Storing long-lived tokens in localStorage is convenient but increases the impact of XSS. A common alternative is an access token in memory and an HttpOnly/Secure refresh token, with CSRF protection for the cookie-based endpoint.",
        "CORS must explicitly allow the React origin and the required headers/methods; it must not be used as a substitute for authentication or authorization.",
        "Choose a strategy consistent with the infrastructure and the auth library. The conceptual flow matters more than memorizing a homemade JWT implementation."
      ],
      "mermaid": "flowchart TD\n      A[\"React: POST /login\"] --> B[\"Rails verifies credentials\"]\n      B --> C[\"short access token + refresh token\"]\n      C --> D[\"React keeps access in memory\nrefresh in HttpOnly cookie\"]\n      D --> E[\"GET /orders\nAuthorization: Bearer\"]\n      E --> F[\"Rails validates token\nauthorization\"]\n      F -->|\"200\"| G[\"JSON for React\"]\n      F -->|\"401 expired\"| H[\"POST /auth/refresh\nwith cookie\"]\n      H --> I[\"Rails rotates refresh\nand returns new access\"]\n      I --> E\n      H -->|\"revoked/invalid\"| J[\"Logout + login required\"]",
      "diagramTitle": "React + Rails authentication: full round trip",
      "takeaway": "The access token identifies a short-lived request; the refresh token renews the session; Rails must still authorize every resource and protect any cookie-based flow."
    }
  },
  "asset_pipeline": {
    "_source": "abbd17d9cc20",
    "label": "Asset pipeline & fingerprinting",
    "lesson": {
      "level": "Common interview topic",
      "summary": "The classic asset pipeline collects, processes and publishes CSS, JavaScript and images with fingerprinted names.",
      "why": "It was mentioned to you directly; they expect you to be able to explain Sprockets, precompilation, caching and why it exists.",
      "code": "// app/assets/config/manifest.js\n//= link_tree ../images\n//= link_directory ../stylesheets .css\n\n# Production\nrails assets:precompile\n\n# application.css\n# -> application-a1b2c3d4.css",
      "codeLabel": "From source to cacheable asset",
      "steps": [
        "In development you write files with logical names like application.css or logo.png.",
        "During build or deploy, Sprockets processes those files and generates a published version.",
        "The fingerprint adds a hash to the name, for example application-a1b2.css; if the content changes, the URL changes.",
        "Since the URL changes when the file changes, the browser can cache the previous version without confusing it with the new one."
      ],
      "pitfalls": [
        "Referencing the fingerprinted name by hand can break on the next deploy; use helpers or the manifest.",
        "If an asset is missing in production, check whether it was included in the manifest and precompiled."
      ],
      "takeaway": "Short explanation: processing + manifest + fingerprint + cache busting during deploy.",
      "explanation": "The asset pipeline prepares static files for the browser: CSS, JavaScript, images and fonts. In classic Rails, Sprockets processes them and produces a manifest with fingerprinted names. The fingerprint changes when the content changes, so the browser can cache for a long time without using an old version after a deploy."
    }
  },
  "modern_assets": {
    "_source": "94c8db8bfbd5",
    "label": "Webpacker → modern options",
    "lesson": {
      "level": "Common interview topic",
      "summary": "Rails went from Sprockets for everything, to Webpacker, and then to smaller options like importmap-rails, jsbundling-rails and cssbundling-rails.",
      "why": "Showing the evolution matters more than memorizing one version: each Rails project may be on a different generation.",
      "code": "// app/javascript/application.js\nimport React from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport Dashboard from \"./Dashboard\";\n\n// The bundler (esbuild/Rollup/Webpack) follows these imports and produces:\n// public/assets/application-[hash].js\n\n// importmap-rails uses a map of URLs, with no module bundle:\n// pin \"react\", to: \"https://ga.jspm.io/npm:react@...\"\n\n// Separate React:\n// Vite generates the frontend build.\n// Rails serves a JSON API and does not need to compile those modules.",
      "codeLabel": "Three strategies expressed in the build flow",
      "steps": [
        "Source code uses small modules with import/export, but the browser needs to know where each module comes from.",
        "A bundler follows that import graph, combines or splits files, transforms syntax and generates optimized artifacts for production.",
        "jsbundling-rails connects Rails to an external tool; you choose esbuild for simplicity, Rollup/Webpack for specific needs, but that tool does the work.",
        "Import Maps avoids the bundling step for certain projects: the browser resolves each module from a pinned URL.",
        "With a separate React app, the React build normally lives in the frontend's Vite/Webpack setup and the Rails asset pipeline is not responsible for that bundle."
      ],
      "pitfalls": [
        "Do not say jsbundling is a library that replaces Webpack: it is a Rails integration for running a bundling tool.",
        "Do not confuse Sprockets fingerprinting with bundling: the former helps cache files; the latter resolves and transforms JavaScript modules.",
        "The strategy depends on the Rails generation and on whether React lives inside the Rails repo or in a separate application."
      ],
      "takeaway": "Bundler = walks imports and produces distributable JavaScript; jsbundling-rails integrates one into Rails; Import Maps avoids bundling when the project allows it.",
      "explanation": "A JavaScript bundler is a tool that follows module imports, gathers many files into one or several bundles, transpiles syntax if needed and usually minifies the result for production. For example, if app.js imports React, ReactDOM and your components, esbuild/Webpack/Rollup walk that graph and generate files the browser can download efficiently. jsbundling-rails is not a different bundler: it is a Rails integration that installs and runs an external bundler like esbuild, Rollup or Webpack. Import Maps is another strategy: instead of bundling everything, it maps names like `react` to module URLs that the browser loads directly. If React is separate from Rails, Vite or its bundler normally belongs to the React project and Rails only delivers JSON."
    }
  },
  "rspec_basics": {
    "_source": "b88ab1184f45",
    "label": "RSpec: syntax & mindset",
    "lesson": {
      "level": "Testing",
      "summary": "RSpec organizes examples with describe, context, it and expect to turn behavior into executable documentation.",
      "why": "A clear spec explains what the code promises and protects future refactors.",
      "codeLabel": "A spec that does not yet depend on factories",
      "steps": [
        "describe groups examples about a class, method or behavior.",
        "it expresses an expectation in human language, for example that an assigned title is kept.",
        "expect compares the actual result with the expected one using a matcher like eq.",
        "A small spec sets up a scenario, performs an action and verifies an observable result."
      ],
      "pitfalls": [
        "A spec that checks internal variables breaks on refactoring even if the behavior is still correct.",
        "If a spec needs too much setup and many expects, it is probably testing more than one thing."
      ],
      "takeaway": "First learn to read a simple spec; FactoryBot only reduces repeated setup later.",
      "explanation": "RSpec describes behavior with executable examples. describe says which object or method is being tested, it says the expected result and expect verifies the result. You do not need to memorize many matchers at the start: the important skill is formulating a clear promise the code must keep."
    }
  },
  "factory_bot": {
    "_source": "8c1320c780ce",
    "label": "FactoryBot",
    "lesson": {
      "level": "Testing",
      "summary": "FactoryBot creates test objects with expressive defaults, associations and reusable traits.",
      "why": "It reduces repeated setup without turning each spec into a fragile list of attributes.",
      "codeLabel": "Test data with intent",
      "steps": [
        "A factory defines default test data for a model, for example a Post with a valid title.",
        "build creates the object in memory only; create saves it to the test database.",
        "A trait names a reusable variant, for example :published for a published post.",
        "The spec can override the attributes that matter to make its scenario clear."
      ],
      "pitfalls": [
        "Factories with many automatic associations make specs slow and hide which data is being created.",
        "Do not use create when build is enough; persisting to the database takes more time."
      ],
      "takeaway": "A factory is a convenient default, not an automatic explanation of the scenario.",
      "explanation": "FactoryBot avoids repeating data setup in tests. build creates an object in memory and create saves it to the test database. A factory offers reasonable defaults and traits for states like published, but it should not hide so much data that it is no longer clear which scenario the spec is testing."
    }
  },
  "spec_types": {
    "_source": "e31025926631",
    "label": "Model, service & request specs",
    "lesson": {
      "level": "Testing",
      "summary": "Model, request and system specs observe different layers of an application.",
      "why": "Choosing the right layer makes tests faster and pinpoints a failure better.",
      "codeLabel": "The layer determines the scope",
      "steps": [
        "A model spec tests the model's local behavior, such as a validation or method.",
        "A service spec tests a use case by calling its call method without going through HTTP.",
        "A request spec makes a request to a real route and verifies the status, JSON and important side effects.",
        "A system spec opens a simulated browser and covers a full flow, which is why it is slower."
      ],
      "pitfalls": [
        "Do not turn every test into a system spec; they are useful for a few critical flows, not for every rule.",
        "Do not test only models if the HTTP contract with React is important; use request specs for that boundary."
      ],
      "takeaway": "Use the smallest test that observes the behavior you care about.",
      "explanation": "Each type of spec looks at the application from a different scope. A model spec tests a model's rules; a service spec tests a use case without HTTP; a request spec calls a real route and verifies the status and JSON. Choosing the right scope makes the test faster and a failure easier to locate."
    }
  },
  "gemfile": {
    "_source": "3be54c3aba25",
    "label": "Gemfile & Bundler",
    "lesson": {
      "level": "Infrastructure",
      "summary": "Gemfile declares dependencies and Bundler resolves a reproducible set recorded in Gemfile.lock.",
      "why": "The lockfile prevents incompatible combinations across development, CI and production.",
      "codeLabel": "Dependencies per environment",
      "steps": [
        "Gemfile declares which gems the project needs and in which groups, for example development or test.",
        "bundle install resolves compatible versions and writes the exact result to Gemfile.lock.",
        "Gemfile.lock lets your machine, CI and production install the same combination of gems.",
        "bundle exec rspec runs RSpec using the project's versions, not a different global gem."
      ],
      "pitfalls": [
        "Deleting Gemfile.lock can update many dependencies at once and cause unexpected changes.",
        "Adding a gem without understanding its maintenance or purpose increases security surface and complexity."
      ],
      "takeaway": "Gemfile declares the intent; Gemfile.lock pins the result.",
      "explanation": "Gemfile is the declarative list of Ruby libraries the project uses, and Gemfile.lock stores the exact resolved versions. It is the counterpart of composer.json and composer.lock. Bundler installs that combination and bundle exec runs commands using exactly those dependencies."
    }
  },
  "env_logger": {
    "_source": "d99a1c2cfcf5",
    "label": "Credentials, ENV & logging",
    "lesson": {
      "level": "Rails runtime",
      "summary": "ENV/Credentials separate configuration from code, and Rails.logger leaves operational evidence with context.",
      "why": "They are direct equivalents of Dotenv and Monolog, so you should be able to explain them quickly in Rails terms.",
      "codeLabel": "Configuration and observability",
      "steps": [
        "ENV stores configuration that changes per environment, like DATABASE_URL; ENV.fetch fails early if something required is missing.",
        "Rails Credentials stores encrypted secrets that should not be written directly into the repository.",
        "Rails.logger records events with a level and context, for example the id of the order that is failing.",
        "Useful logs let you investigate production without adding prints or reproducing the user's exact session."
      ],
      "pitfalls": [
        "Never write passwords, tokens, card numbers or full private data to logs.",
        "A log without context like error happened does not help; include which operation and which id were involved."
      ],
      "takeaway": "Explicit configuration and contextual logs are part of the design, not deploy details.",
      "explanation": "Configuration changes by environment: a local database, a production URL or a private key. ENV and Rails Credentials keep those values out of the code. Rails.logger records events with context, like an order_id, so you can understand what happened later without storing secrets in the logs."
    }
  }
};
