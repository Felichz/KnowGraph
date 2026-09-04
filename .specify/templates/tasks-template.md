---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create project structure per implementation plan
- [ ] T002 [P] Configure theme, tokens, and style foundation

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 Core data controllers and headless hooks
- [ ] T004 Persistence adapters and storage hooks

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

- [ ] T005 [US1] Component implementation
- [ ] T006 [US1] Verification scenario

## Phase 4: User Story 2 - [Title] (Priority: P2)

- [ ] T007 [US2] Component implementation
- [ ] T008 [US2] Verification scenario

## Phase 5: Polish & Integration

- [ ] T009 Root app wiring and Constitution check verification
