// rails graph: labels, focus areas, milestones, seniority levels, interview questions
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "_source": "4e164f25e588",
  "label": "Rails interviews",
  "title": "Rails interview map",
  "subtitle": "Conceptual core, designing for business needs, STI, API for React and the asset pipeline.",
  "categories": {
    "fundamentals": {
      "label": "Rails core & request"
    },
    "activerecord": {
      "label": "Active Record & DB"
    },
    "patterns": {
      "label": "Applied design"
    },
    "sti": {
      "label": "STI & polymorphism"
    },
    "infra": {
      "label": "API, security & runtime"
    },
    "assets": {
      "label": "Asset pipeline"
    },
    "testing": {
      "label": "Testing (RSpec)"
    }
  },
  "categoryContext": {
    "fundamentals": "We are tracing the path of a Rails request, from the language and conventions to the HTTP response.",
    "activerecord": "Now that you know how a request reaches the controller, we move into the layer that models and persists data.",
    "patterns": "With requests, data and transactions clear, we now decide where business logic lives and how it changes without coupling.",
    "sti": "With basic associations settled, we now model variants and capabilities shared across records.",
    "infra": "The application works at a basic level; now we define its contract with React, its security and how it runs in different environments.",
    "assets": "This branch explains how Rails serves the files the browser needs and which alternative each generation of projects uses.",
    "testing": "After understanding the behavior, we define how to prove it with fast tests of the right scope."
  },
  "milestones": [
    {
      "label": "Rails request",
      "description": "You can explain how a request comes in, gets routed and is answered."
    },
    {
      "label": "Data and Active Record",
      "description": "You model persistence, associations, queries and integrity."
    },
    {
      "label": "Business design",
      "description": "You choose where each rule lives and how to coordinate complex flows."
    },
    {
      "label": "Interview cases",
      "description": "You can design checkout, reporting and multi-model registration."
    },
    {
      "label": "Domain modeling",
      "description": "You understand STI, polymorphism and their trade-offs."
    },
    {
      "label": "API, React and security",
      "description": "You connect Rails to a frontend and protect the system."
    },
    {
      "label": "Testing and operations",
      "description": "You test behavior and understand the runtime environment."
    },
    {
      "label": "Rails assets",
      "description": "You can explain fingerprinting and the modern options."
    }
  ]
};
