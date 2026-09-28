// react concepts (incident_debugging, threat_modeling_frontend, oauth_oidc_sessions, csp_supply_chain, testing_strategy, contract_visual_e2e, test_reliability, product_metrics_experiments, i18n_content_resilience, ux_performance_tradeoffs, technical_direction, adr_rfc_decisions, code_review_mentoring, planning_delegation, conflict_stakeholders)
// Generated skeleton, then translated. Keep keys and array lengths identical to the Spanish shape.
export default {
  "incident_debugging": {
    "_source": "0e95ddb50caa",
    "label": "Incidents and debugging in production",
    "lesson": {
      "level": "Production",
      "summary": "Responding to an incident means stabilizing first, building a timeline with evidence and fixing the cause without losing the learning.",
      "explanation": "A good diagnosis formulates hypotheses and looks for signals that could refute them. The end goal is not just the fix: it is reducing the probability or the impact of the next failure.",
      "why": "Senior quality shows up when there is pressure, incomplete information and affected users.",
      "code": "1. confirm impact and owner\n2. mitigate: flag or rollback\n3. correlate release + signals\n4. reproduce and fix\n5. blameless postmortem",
      "codeLabel": "Incident flow",
      "steps": [
        "Declare severity and channel.",
        "Stop the damage with the most reversible action.",
        "Preserve evidence.",
        "Communicate status and upcoming checkpoints.",
        "Turn the cause into systemic actions with an owner."
      ],
      "pitfalls": [
        "Debugging for hours before mitigating prolongs the impact.",
        "Changing several variables at once destroys evidence.",
        "A postmortem that blames a person does not improve the system."
      ],
      "takeaway": "First restore service; then understand and strengthen the system.",
      "audit": {
        "primer": "During an incident, you reduce impact first and then investigate with preserved evidence. Each hypothesis should predict an observable signal; changing one variable at a time lets you know which explanation survived.",
        "example": "After checkout errors spike, the team pauses the rollout, compares release and traffic, confirms that only the new bundle fails and reverts. Then it reproduces with the requestId, finds a changed contract and adds a contract test and a gate.",
        "failureModes": [
          "Investigating the perfect cause before mitigating prolongs avoidable damage.",
          "Changing cache, API and frontend at the same time destroys the evidence of which intervention worked.",
          "A blame-centered postmortem does not improve the system's detection, limits or recovery."
        ]
      },
      "sources": [
        {
          "label": "Incident Response (Google SRE)"
        },
        {
          "label": "Postmortem Culture (Google SRE)"
        }
      ]
    }
  },
  "threat_modeling_frontend": {
    "_source": "f8b7951f796f",
    "label": "Frontend threat modeling",
    "lesson": {
      "level": "Security",
      "summary": "Threat modeling identifies assets, trust boundaries, possible attackers and mitigations before implementing.",
      "explanation": "The frontend is a hostile boundary because the user controls the runtime. The UI can reduce exposure and protect the session, but the API must validate identity, permission and integrity.",
      "why": "It helps prioritize real risks instead of applying a checklist without context.",
      "code": "Asset: user session\nBoundaries: browser <-> CDN <-> API <-> IdP\nThreats: XSS, token theft, redirect abuse\nMitigations: CSP, HttpOnly, allowlist, rotation",
      "codeLabel": "Small threat model",
      "steps": [
        "List assets and sensitive data.",
        "Draw inputs and boundaries.",
        "Ask how each flow can be spoofed, tampered with, leaked or disrupted.",
        "Choose mitigations and residual risk."
      ],
      "pitfalls": [
        "Hiding buttons is not authorization.",
        "Trusting that the input originated in your UI ignores modified clients.",
        "Adding controls with no owner or monitoring produces nominal security."
      ],
      "takeaway": "Protect concrete assets at concrete boundaries.",
      "audit": {
        "primer": "Threat modeling enumerates assets, trust boundaries, attackers and mitigations. The browser is under the user's control, so the frontend is never a security authority.",
        "example": "To protect a session we draw browser, CDN, API and Identity Provider; we ask where a token could be stolen or altered and choose HttpOnly, CSP, allowlists, expiration and server-side authorization.",
        "failureModes": [
          "Hiding a button does not prevent a manual request.",
          "A token in memory reduces persistence but does not prevent XSS during the session.",
          "A checklist without identified assets can spend effort on irrelevant risks."
        ]
      },
      "sources": [
        {
          "label": "Threat Modeling (OWASP)"
        }
      ]
    }
  },
  "oauth_oidc_sessions": {
    "_source": "f68effcd6f5d",
    "label": "OAuth, OIDC and sessions",
    "lesson": {
      "level": "Security",
      "summary": "OAuth delegates authorization; OpenID Connect adds identity. In a modern web app, Authorization Code with PKCE avoids handing credentials to the frontend.",
      "explanation": "First decide who consumes the token and what session architecture your app needs. Then choose where each credential is persisted and how it is rotated, revoked and expired.",
      "why": "It lets you design federated login without confusing access token, ID token, refresh token and application session.",
      "codeLabel": "Authorization Code + PKCE",
      "steps": [
        "state protects the return against forged requests.",
        "PKCE binds the code to whoever started the flow.",
        "The ID token describes authentication; the access token authorizes an API.",
        "An HttpOnly/BFF session reduces token exposure to JavaScript."
      ],
      "pitfalls": [
        "Using the ID token as an access token mixes audiences.",
        "Storing long-lived refresh tokens in localStorage increases the impact of XSS.",
        "Open redirect URIs allow codes to be diverted."
      ],
      "takeaway": "Identity, authorization and session are different contracts.",
      "audit": {
        "primer": "OAuth delegates authorization to access an API; OpenID Connect adds identity. Authorization Code with PKCE binds the login code to the client that started the flow.",
        "example": "React redirects to the Identity Provider with `state` and `code_challenge`; it comes back with a code; a backend or BFF exchanges it using the verifier and issues an HttpOnly session. The ID token describes authentication; the access token is meant for an API audience.",
        "failureModes": [
          "Using the ID token as an access token mixes audiences and permissions.",
          "An overly open redirect URI allows codes to be diverted.",
          "Storing long-lived refresh tokens in localStorage widens the impact of XSS."
        ]
      },
      "sources": [
        {
          "label": "OAuth 2.0 Cheat Sheet (OWASP)"
        }
      ]
    }
  },
  "csp_supply_chain": {
    "_source": "ec552a2ae431",
    "label": "CSP and supply-chain security",
    "lesson": {
      "level": "Security",
      "summary": "CSP limits what code and resources a page can execute; supply-chain security reduces implicit trust in dependencies and builds.",
      "explanation": "CSP does not replace sanitization and a scanner does not replace review. Both layers limit the blast radius when other prevention fails.",
      "why": "XSS and compromised packages can execute code with your application's permissions.",
      "codeLabel": "Defense in depth",
      "steps": [
        "Deploy CSP in report-only mode first.",
        "Remove inline scripts or use nonces.",
        "Pin versions and review provenance/licenses.",
        "Scan dependencies without blindly applying breaking changes."
      ],
      "pitfalls": [
        "unsafe-inline weakens the main protection.",
        "A lockfile reduces variation; it does not prove the package is trustworthy.",
        "Uploading public source maps can reveal implementation and internal routes."
      ],
      "takeaway": "Reduce what code can get in and what code can execute.",
      "audit": {
        "primer": "CSP limits which scripts and resources a page can execute. Supply-chain security reduces blind trust in third-party packages, lockfiles, builds and artifacts.",
        "example": "CSP is first deployed in report-only mode to see violations; then scripts are restricted to your own origins and nonces. The pipeline pins dependencies, reviews changes and keeps source maps out of public access.",
        "failureModes": [
          "`unsafe-inline` weakens CSP's main protection.",
          "A lockfile prevents accidental variation, but it does not show that a package is trustworthy.",
          "A scanner does not replace reviewing the code and provenance of a critical dependency."
        ]
      },
      "sources": [
        {
          "label": "Content Security Policy (OWASP)"
        }
      ]
    }
  },
  "testing_strategy": {
    "_source": "d38e0e94827c",
    "label": "Testing strategy",
    "lesson": {
      "level": "Quality",
      "summary": "A testing strategy assigns each risk to the cheapest harness that can observe it with fidelity.",
      "explanation": "Start from the observable claim and ask what environment it needs. A parser can be tested without React; real focus or navigation require a browser; API compatibility may need contract tests.",
      "why": "It avoids huge suites that test internal details while leaving critical contracts unprotected.",
      "code": "Types: static contracts\nUnit: pure logic\nRTL: UI behavior\nContract: integration between services\nE2E: critical journeys\nVisual: state regression",
      "codeLabel": "Risk by layer",
      "steps": [
        "List behaviors and costly failures.",
        "Choose the layer with the best signal/cost ratio.",
        "Protect a few critical E2E journeys.",
        "Measure flakiness, duration and escaped defects."
      ],
      "pitfalls": [
        "The pyramid does not prescribe universal percentages.",
        "Duplicating the same case in every layer multiplies maintenance.",
        "Line coverage does not prove that a flow works."
      ],
      "takeaway": "The suite is a confidence portfolio, not a quantity contest.",
      "audit": {
        "primer": "A testing strategy assigns each risk to the cheapest test that can observe it with enough fidelity: types, unit, RTL, contract, E2E or visual.",
        "example": "A pure function can get a unit test; a form's behavior, an RTL test; the contract with Rails, a contract test; and only the full checkout, an E2E test. Each layer covers a different risk.",
        "failureModes": [
          "Line coverage can go up while the critical flow remains untested.",
          "Duplicating the same case in every layer increases maintenance without increasing signal.",
          "A flaky E2E test can erode confidence in the whole pipeline."
        ]
      },
      "sources": [
        {
          "label": "Guiding Principles (Testing Library)"
        },
        {
          "label": "Playwright: Best Practices"
        }
      ]
    }
  },
  "contract_visual_e2e": {
    "_source": "89cffd8ab5aa",
    "label": "Contract, visual and E2E tests",
    "lesson": {
      "level": "Quality",
      "summary": "Contract, visual and E2E tests protect against risks that a unit test or jsdom cannot represent well.",
      "explanation": "These layers do not replace RTL; they cover its blind spot. Choose stable, high-value cases: forms, auth, focus, overlays, API compatibility and public visual states.",
      "why": "Boundaries between services, real layout and complete journeys often fail even when every unit passes.",
      "codeLabel": "Complementary tests",
      "steps": [
        "Contract tests verify compatibility between producer and consumer.",
        "Visual regression captures geometry, tokens and states.",
        "E2E validates deployed integration and real navigation.",
        "Each failure should indicate which contract was lost."
      ],
      "pitfalls": [
        "Visual snapshots without defined states generate noise.",
        "E2E for every edge case makes the suite slow and fragile.",
        "Mocking the entire network in E2E can hide the contract you wanted to test."
      ],
      "takeaway": "Use the real environment only for the risk that needs reality.",
      "audit": {
        "primer": "Contract tests verify the shape and semantics of the exchange between systems; visual tests compare rendered states; E2E runs through a real journey in a browser.",
        "example": "The contract verifies that Rails returns `id` and `status`; a visual test checks the Button's loading/error/long label states; an E2E test confirms login, checkout and the final redirect against the deployed system.",
        "failureModes": [
          "A huge snapshot can change without anyone understanding which regression it protects against.",
          "An E2E test that depends on shared data fails for reasons unrelated to the code.",
          "The contract must be versioned together with consumer compatibility."
        ]
      },
      "sources": [
        {
          "label": "Playwright: Best Practices"
        }
      ]
    }
  },
  "test_reliability": {
    "_source": "a282ad42ec05",
    "label": "Test flakiness and reliability",
    "lesson": {
      "level": "Quality",
      "summary": "A flaky test alternates results without any relevant change and destroys confidence in the CI signal.",
      "explanation": "Treat the suite like production: measure failure rate, duration and unstable cases. The goal is not some magical zero variability, but detecting and removing uncontrolled sources.",
      "why": "When a failure stops meaning anything, the team retries or ignores the suite.",
      "code": "await expect.poll(() => api.status()).toBe('ready')\n// wait for an observable condition, not sleep(2000)",
      "codeLabel": "Deterministic synchronization",
      "steps": [
        "Classify the cause: timing, data, order, environment or dependency.",
        "Isolate state and generate unique data.",
        "Wait for observable conditions.",
        "Give any quarantine an owner and a date."
      ],
      "pitfalls": [
        "Increasing timeouts only makes a race slower.",
        "Automatic retry can hide a real regression.",
        "Tests that depend on order share accidental state."
      ],
      "takeaway": "A reliable suite fails for a reproducible reason.",
      "audit": {
        "primer": "Flakiness means the same test changes its result without the code changing. Reliability requires isolating data, controlling time, waiting for real signals and recording evidence of the failure.",
        "example": "A debounce test uses fake timers and advances the clock explicitly; a request test waits for the success message, not a fixed sleep. Each test creates its own user and cleans up cache and handlers.",
        "failureModes": [
          "Increasing retries can hide a defective test and lengthen the pipeline.",
          "An arbitrary sleep is slow and still vulnerable to slower machines.",
          "Sharing global state between tests creates order dependency."
        ]
      },
      "sources": [
        {
          "label": "Playwright: Best Practices"
        }
      ]
    }
  },
  "product_metrics_experiments": {
    "_source": "5e5a2d7bff35",
    "label": "Metrics, analytics and experiments",
    "lesson": {
      "level": "Product",
      "summary": "Metrics connect UI decisions with user outcomes; experiments test a hypothesis with explicit exposure and guardrails.",
      "explanation": "Analytics is also a contract: names, payload, privacy and version. A healthy experiment starts from a decision you would actually change depending on the result.",
      "why": "A frontend lead should avoid both deciding on intuition alone and optimizing a metric while damaging the product.",
      "code": "Hypothesis: simplifying checkout increases completion\nPrimary: checkout_completed / checkout_started\nGuardrails: errors, latency, cancellations\nSegments: device, locale, new user",
      "codeLabel": "Measurable hypothesis",
      "steps": [
        "Define a semantic event and an owner.",
        "Validate event quality and loss.",
        "Choose the primary metric and guardrails.",
        "Interpret segments and significance together with qualitative context."
      ],
      "pitfalls": [
        "Page views do not explain whether the user achieved their goal.",
        "Changing the event definition breaks comparisons.",
        "More conversion with more errors or manipulation can be a worse product."
      ],
      "takeaway": "Measure outcomes and side effects, not activity for its own sake.",
      "audit": {
        "primer": "A product metric represents a behavior that helps you decide, not just an event that is easy to count. An experiment defines the hypothesis, population, primary metric, guardrails and what action the team would take depending on the result.",
        "example": "A new search aims to increase completed orders. The primary metric is checkout per session with search; the guardrails are latency, errors and cancellations. The event includes the schema version and variant so results can be interpreted.",
        "failureModes": [
          "More clicks can mean confusion rather than progress toward the goal.",
          "Changing event names or payloads without a version breaks historical series.",
          "An aggregate improvement can hide harm to keyboard users, regions or slow devices."
        ]
      },
      "sources": [
        {
          "label": "Web Vitals (web.dev)"
        }
      ]
    }
  },
  "i18n_content_resilience": {
    "_source": "653374c1a377",
    "label": "i18n and resilient content",
    "lesson": {
      "level": "Product",
      "summary": "Internationalization changes text, direction, formats and available space; a resilient UI preserves meaning under that variation.",
      "explanation": "Think of every component as a container for text its author does not control. i18n, accessibility and responsive design meet in the same question: what variation does the contract support.",
      "why": "Real copy and zoom often reveal assumptions that the English mockup did not show.",
      "codeLabel": "Variable content and layout",
      "steps": [
        "Use Intl for dates, numbers and pluralization.",
        "Design with logical properties for RTL.",
        "Test long copy, empty copy and different scripts.",
        "Do not build sentences by concatenating translated fragments."
      ],
      "pitfalls": [
        "A fixed width can truncate German or 200% zoom.",
        "Translating aria-labels separately can misalign the visible and accessible names.",
        "Locale should not decide business rules."
      ],
      "takeaway": "Content is an input to layout, not decoration added afterwards.",
      "audit": {
        "primer": "Internationalization separates messages from code and applies local rules to pluralization, numbers, dates and direction. The UI should treat content as variable, not as a fixed length known to whoever designed the component.",
        "example": "A counter uses Intl.PluralRules or a message library to distinguish zero, one and many; the price uses the order's currency. The layout uses margin-inline and supports Arabic RTL without manually mirroring every component.",
        "failureModes": [
          "Concatenating fragments forces other languages to keep the grammatical word order of Spanish.",
          "The user's locale should not change business rules such as the currency actually charged.",
          "Translating only the visible text and leaving aria-labels hardcoded creates two different experiences."
        ]
      },
      "sources": [
        {
          "label": "Intl (MDN)"
        },
        {
          "label": "WCAG: Reflow"
        }
      ]
    }
  },
  "ux_performance_tradeoffs": {
    "_source": "1f69f5eaf638",
    "label": "UX and performance trade-offs",
    "lesson": {
      "level": "Product",
      "summary": "A senior decision balances perceived speed, accessibility, clarity, technical cost and business goal.",
      "explanation": "Explain why the trade-off is right for this flow and what signal would make you change it. That capacity for revision is more senior than defending a universal recipe.",
      "why": "The fastest metric or the most attractive animation does not necessarily produce the best experience.",
      "code": "Decision: optimistic save\nBenefit: immediate feedback\nRisk: confusing rollback\nGuardrails: error rate, undo, a11y announcements\nFallback: explicit pending",
      "codeLabel": "Documented trade-off",
      "steps": [
        "Name the user and the goal.",
        "Compare the benefit with the failure modes.",
        "Include devices, accessibility and extreme content.",
        "Define evidence and a reversible option."
      ],
      "pitfalls": [
        "Skeletons can make a screen feel slower or cause layout shift.",
        "Optimism in payments can lie about a critical outcome.",
        "A smooth animation that ignores reduced motion is still a defect."
      ],
      "takeaway": "The best solution optimizes the whole goal, not an isolated metric.",
      "audit": {
        "primer": "A UX trade-off compares benefit, cost and risk for a concrete flow. The senior answer identifies who wins, who might be harmed, what uncertain state is communicated and what evidence would prompt revisiting the decision.",
        "example": "For a Like, optimism is used because the effect is reversible and low risk; it is marked pending and reverted with a message. For a payment, Processing is shown until authoritative confirmation: declaring success early can induce a false financial decision.",
        "failureModes": [
          "A skeleton without stable dimensions can add layout shift and make loading feel worse.",
          "Optimizing the average can degrade the slow percentile or assistive technologies.",
          "Defending a universal recipe prevents adapting the solution to risk, device and recoverability."
        ]
      },
      "sources": [
        {
          "label": "Web Vitals (web.dev)"
        },
        {
          "label": "WCAG: Reflow"
        }
      ]
    }
  },
  "technical_direction": {
    "_source": "48fba9b9b9bf",
    "label": "Technical direction and principles",
    "lesson": {
      "level": "Leadership",
      "summary": "Technical direction establishes architectural principles, invariants and automated mechanisms so that multiple teams can make coherent decisions with speed and autonomy, without depending on constant approval from a leader.",
      "explanation": "Effective technical direction reduces the fatigue of repeated decisions, prevents chaotic fragmentation and sustains the product's evolution through living architecture, shared tooling and distributed ownership.",
      "why": "Technical leadership scales through context and mechanisms in the system, not by becoming a human bottleneck.",
      "code": "As an organization grows, two opposite traps appear: technical anarchy (each team invents its own architecture, creating fragmentation and technical debt) or centralized bureaucracy (the Tech Lead must approve every PR or decision, slowing down delivery). Senior technical direction resolves this tension by defining non-negotiable system-level 'invariants' and automated 'guardrails' (linters, contract tooling and CI gates) while delegating freedom of local implementation.",
      "codeLabel": "Pillars of technical direction",
      "steps": [
        "Define clear global invariants (API contracts, security, observability) and delimit which decisions can be delegated to the team.",
        "Translate principles into automated mechanisms in CI and tooling instead of theoretical documents nobody reads.",
        "Communicate product context and trade-offs so developers can make correct decisions autonomously.",
        "Review and adapt the principles periodically when business constraints or scale change."
      ],
      "pitfalls": [
        "An architecture document without automated mechanisms becomes a dead letter.",
        "Trying to standardize every minor detail stifles autonomy and demotivates the team.",
        "A leader who centralizes every decision prevents the team from growing and blocks progress."
      ],
      "takeaway": "Give the team clear context and guardrails so they can decide and move forward without you.",
      "audit": {
        "primer": "Technical direction turns product goals into principles, limits and mechanisms that enable consistent decisions without centralizing them all in one person. It should make clear what is invariant and where the team can choose.",
        "example": "The principle 'one authoritative source per piece of data' is made concrete with examples, lint rules, templates and reviews. Each feature chooses its tool, but must show ownership, error states and how it is observed in production.",
        "failureModes": [
          "A vision without tooling, examples or owners remains an aspirational document.",
          "Standardizing every local detail turns alignment into a bottleneck.",
          "Not revisiting principles when data or constraints change turns past experience into dogma."
        ]
      },
      "sources": [
        {
          "label": "Architecture Decision Records"
        }
      ]
    }
  },
  "adr_rfc_decisions": {
    "_source": "e1d34e8bfdda",
    "label": "ADRs, RFCs and reversible decisions",
    "lesson": {
      "level": "Leadership",
      "summary": "ADRs record decisions that were made; RFCs allow discussing important changes before their cost gets buried in code.",
      "explanation": "Reversible decisions need speed; irreversible or cross-cutting ones need more evidence. The format helps calibrate that investment and build technical memory.",
      "why": "They preserve context, alternatives and review conditions so the team does not repeat debates or turn temporary decisions into dogma.",
      "code": "Context -> forces -> options\nDecision -> consequences\nReversibility -> migration plan\nReview date -> signals to reconsider",
      "codeLabel": "Decision document",
      "steps": [
        "Match the depth to the blast radius.",
        "Separate facts, assumptions and preferences.",
        "Include alternatives and why not now.",
        "Name the owner, rollout and review criterion."
      ],
      "pitfalls": [
        "A 30-page RFC for a local decision slows the team down.",
        "Documenting only the winning option hides the trade-off.",
        "An ADR does not replace communicating with those affected."
      ],
      "takeaway": "Record the why and the condition for change, not a novel.",
      "audit": {
        "primer": "An ADR records a decision and its context; an RFC opens a cross-cutting proposal to review before implementing it. The depth is calibrated by reversibility, number of people affected and the cost of being wrong.",
        "example": "Changing the shared router requires an RFC with alternatives, migration impact, rollout and owner. Choosing a reversible local helper can be settled in the pull request and, if it matters for the future, leave a short ADR.",
        "failureModes": [
          "Documenting only the chosen solution hides why the alternatives did not work under those constraints.",
          "Requiring a lengthy RFC for local decisions reduces speed without improving coordination.",
          "The document does not replace talking with the teams that will have to migrate or operate the change."
        ]
      },
      "sources": [
        {
          "label": "Architecture Decision Records"
        }
      ]
    }
  },
  "code_review_mentoring": {
    "_source": "b67bfc1e79a1",
    "label": "Code review and mentoring",
    "lesson": {
      "level": "Leadership",
      "summary": "Code review protects behavior and teaches mental models; mentoring transfers judgment until another person can make decisions on their own.",
      "explanation": "Ask for evidence proportional to the risk and make the intent of each comment clear. In mentoring, success means the person builds the mental model, not that they copy your solution.",
      "why": "A lead is also measured by the quality and autonomy they produce around them.",
      "code": "Review:\n- observable risk\n- evidence and reproduction\n- severity and intent\nMentoring:\n- ask about the mental model\n- show the boundary\n- let them decide with guardrails",
      "codeLabel": "Feedback that develops judgment",
      "steps": [
        "Review contract, ownership, platform, tests and scope.",
        "Separate bugs from preferences.",
        "Explain the impact and a concrete option.",
        "Adjust the help to the level: teach, accompany or delegate."
      ],
      "pitfalls": [
        "Rewriting another person's code does not teach.",
        "Vague comments like 'this is wrong' are not actionable.",
        "Using review to impose taste slows things down and reduces psychological safety."
      ],
      "takeaway": "The best review improves the change and the author's next change.",
      "audit": {
        "primer": "A review protects the user and the contract while helping the author build judgment. A useful comment shows evidence, impact and a proportional request; it distinguishes a blocking bug from a preference.",
        "example": "Instead of 'this is wrong', the reviewer says: 'The ref now points to the wrapper; two consumers call focus on the input. Can we keep the attachment point and add a type and focus test?'. The author understands the risk and can propose the solution.",
        "failureModes": [
          "Rewriting the whole diff teaches dependence on the reviewer instead of decision-making ability.",
          "Too many style comments hide contract and product problems.",
          "Using vague questions for confirmed bugs makes it unclear what must change before merge."
        ]
      },
      "sources": [
        {
          "label": "Semantic Versioning"
        }
      ]
    }
  },
  "planning_delegation": {
    "_source": "4baa8deb2797",
    "label": "Planning and delegation",
    "lesson": {
      "level": "Leadership",
      "summary": "Planning breaks an outcome into verifiable increments; delegating hands over context, authority and limits, not just tasks.",
      "explanation": "A good plan changes as it learns. The lead protects the goal, makes dependencies explicit and lets the team adjust the implementation without losing alignment.",
      "why": "Team delivery fails when dependencies, risks and decisions stay concentrated in one person.",
      "code": "Outcome -> vertical milestones -> owners\n       -> dependencies -> risks -> checkpoints\nDelegation: goal + constraints + decision + success signal",
      "codeLabel": "Plan and ownership",
      "steps": [
        "Define the outcome, not just the output.",
        "Slice vertically to get early feedback.",
        "Assign an owner and the decisions they can make.",
        "Create checkpoints by risk, not daily micromanagement."
      ],
      "pitfalls": [
        "Splitting up files does not create ownership.",
        "Estimates without uncertainty turn into false promises.",
        "Delegating without context forces people to guess or come back for every decision."
      ],
      "takeaway": "Delegate decisions with guardrails and keep risk visible.",
      "audit": {
        "primer": "Planning defines the outcome, constraints, risks and slices that produce feedback. Delegating hands over ownership of a decision with context and limits, not just a list of files someone else has to modify.",
        "example": "To migrate auth, one person owns the refresh flow and its contract; another owns cache cleanup and UX. There is a checkpoint once a vertical slice works with telemetry, and explicit escalation if the Rails contract changes.",
        "failureModes": [
          "Splitting by files creates horizontal dependencies and nobody owns the complete outcome.",
          "Daily checkpoints on every line are micromanagement, not risk management.",
          "An estimate without assumptions or uncertainty is interpreted as a promise even if the problem changes."
        ]
      },
      "sources": [
        {
          "label": "Incident Response (Google SRE)"
        }
      ]
    }
  },
  "conflict_stakeholders": {
    "_source": "38f46ad638e7",
    "label": "Disagreements and stakeholders",
    "lesson": {
      "level": "Leadership",
      "summary": "Technical disagreements usually mix goals, risks, evidence and preferences; leading means making those layers visible and reaching a sustainable decision.",
      "explanation": "Formal authority is the last resort. An effective lead translates perspectives, points out costs and keeps the working relationship intact after the decision.",
      "why": "Product, design, backend and frontend optimize different parts of the same system.",
      "code": "Shared goal: reduce abandonment\nConstraints: date, a11y, API, risk\nOptions: A/B/C with trade-offs\nDecision-maker + date + review signal",
      "codeLabel": "Disagreement turned into a decision",
      "steps": [
        "Listen and restate the concern.",
        "Align on goal and constraints.",
        "Compare options with evidence.",
        "Define who decides and document the outcome.",
        "Disagree and commit without ruling out a later review."
      ],
      "pitfalls": [
        "Winning the argument can cost trust and context.",
        "Escalating before trying to resolve locally adds politics.",
        "Full consensus is not a requirement for a clear decision."
      ],
      "takeaway": "Make disagreement produce clarity, not winners and losers.",
      "audit": {
        "primer": "Resolving technical disagreements requires separating positions from interests, aligning goal and constraints, comparing options with evidence and clarifying who decides. The close-out includes what will be done, why and when it will be reviewed.",
        "example": "Product wants to launch now and platform fears a risky migration. The lead proposes a slice behind a flag with traffic limits, metrics and rollback; they document that product decides exposure and platform keeps the integrity gate.",
        "failureModes": [
          "Winning by authority can lose information and commitment from those who will operate the decision.",
          "Seeking full consensus indefinitely hides that someone has to decide under uncertainty.",
          "Disagree and commit with no review criterion turns a temporary decision into dogma."
        ]
      },
      "sources": [
        {
          "label": "Architecture Decision Records"
        }
      ]
    }
  }
};
