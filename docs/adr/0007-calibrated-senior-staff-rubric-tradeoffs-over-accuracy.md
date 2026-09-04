# ADR 0007 — Calibrated Senior/Staff Rubric: Causality and Trade-offs as Primary Factor

- Status: **Accepted**
- Date: 2026-09-04
- Deciders: Learning Workspace Core

## Context

In early evaluation prototypes, rubric weights followed a traditional distribution assigning the heaviest weight to textbook definition accuracy:
* `accuracy`: 40 points
* `causalityAndTradeoffs`: 25 points
* `application`: 20 points
* `completeness`: 15 points

Calibrating this weighting against actual industry hiring bars (FAANG, tier-1 tech firms, and top-tier startups) revealed a fundamental disconnect:
* For Junior and Mid-Level engineering roles, interviewers verify whether a candidate knows definitions and syntax (`accuracy`).
* For **Senior, Staff, and Principal** levels, hiring decisions hinge on **causality and trade-offs**: understanding failure modes at scale, concurrency race conditions, memory footprint, GC pressure, and the rationale behind rejecting alternative approaches.

A candidate reciting documentation definitions from memory without articulating operational trade-offs will not pass a Senior technical committee.

## Decision

We formally rebalanced the weights of the analytical evaluation rubric in specifications and backend Zod schemas (`server/ai/schemas.js`), positioning causality and architectural trade-offs as the primary factor:

| Dimension | Max Points | Weight | Pedagogical Criteria |
| :--- | :---: | :---: | :--- |
| **`causalityAndTradeoffs`** | **35 pts** | **35%** | **Primary Senior/Staff Deciding Factor**. Causal mechanics: how the engine works internally, accepted performance/memory trade-offs, and catastrophic failure modes under production load. |
| **`accuracy`** | **30 pts** | **30%** | Strict technical correctness, absence of misconceptions, and precise domain vocabulary. |
| **`application`** | **20 pts** | **20%** | Translating concepts into idiomatic, resilient code patterns and defensible error handling. |
| **`completeness`** | **15 pts** | **15%** | Edge-case coverage, lifecycle phases, and resource cleanup. |

Base total: **100 points** (with up to 20 optional golden excellence bonus points awarded for deep runtime internals).

## Consequences

### Positive
* **Alignment with Real Senior Interview Bars**: The AI evaluator penalizes book-definition answers that omit concurrency or scale challenges, conditioning candidates to reason like production systems engineers.
* **Higher-Signal Actionable Feedback**: Evaluation summaries focus on omitted operational trade-offs rather than trivial stylistic corrections.

### Accepted Costs and Limitations
* **Stricter Candidate Standards**: Candidates accustomed to brief, syntax-heavy answers may experience initial friction seeing lower scores on topics they believed they understood. The Socratic tutor stage (*02 Learn*) provides dedicated prompts targeting trade-offs to scaffold this transition.
