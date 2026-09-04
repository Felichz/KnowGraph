# ADR 0004 — Local-First User-Owned Harness Philosophy and Desktop Electron

- Status: **Accepted**
- Date: 2026-09-04
- Deciders: Learning Workspace Core

## Context

Many AI evaluation and interview preparation tools operate under the traditional SaaS paradigm:
1. Candidate oral transcriptions, study notes, and evaluation history are stored in centralized vendor databases.
2. Users pay recurring subscriptions with arbitrary markups over underlying LLM inference tokens.
3. If the SaaS service shuts down or changes its terms, developers lose their accumulated study history.
4. API credentials are often routed through or stored on third-party cloud servers.

For Learning Workspace, the goal is fundamentally different: to engineer the product as a **personal, user-owned technical training harness**, analogous to a compiler, a test runner, or a local linter executing on the developer's machine. The developer must have complete sovereignty over their training data, knowledge graph, and model connections—mirroring the architectural ethos of modern developer AI agent CLIs (such as Claude Code, Cursor, OpenCode, or Aider).

## Decision

### 1. "Personal Training Harness" Philosophy (User-Owned)

The product is defined as an evaluation and active learning harness owned entirely by the developer:
* **Local-First Persistence**: All drafts, evaluation attempts, voice recordings, and tutoring sessions reside on the user's local disk (IndexedDB in the browser, local files and SQLite/OPFS in Electron). Hosting cost for the user: **$0**.
* **Zero Content Telemetry**: User answers, study notes, and candidate explanations are never transmitted to centralized telemetry servers or utilized for model training.
* **Complete Data Portability**: Full schema-validated JSON export and import (`learning-workspace-backup-[date].json`), allowing developers to freely migrate between machines or commit their learning trajectory to private Git repositories.

### 2. First-Class Desktop Citizen via Electron

To anchor its nature as desktop software, the application is packaged and distributed natively using **Electron**:
* **Hardware-Secured Secrets via `safeStorage`**: Under Electron, API keys are not stored in plaintext `localStorage`, but encrypted using native operating system cryptographic vaults (`DPAPI` on Windows, `Keychain` on macOS, `libsecret` on Linux) with restricted `0o600` file permissions.
* **100% Offline Capability**: Topological navigation, curriculum lessons, deep dives, FAANG interview banks, and past attempt reviews function completely offline without internet connectivity.
* **Native OS Integration**: Direct integration with system file dialogs for seamless JSON backup workflows and global keyboard shortcuts.

### 3. Decoupled Inference Configuration (Developer Agent CLI Paradigm)

Mirroring developer agent tools:
* Users **Bring Their Own Keys (BYOK)**: Connect commercial APIs (OpenAI, Anthropic, Google Gemini, Groq, OpenRouter) or offline local inference runtimes (**Ollama, LM Studio, vLLM**).
* Inference is direct or through a local zero-markup proxy gateway.
* Supports multiple profiles and hot model-switching depending on the task (e.g., lightweight fast models for autocompletion/live review vs. reasoning models for canonical evaluation).

## Consequences

### Positive
* **Sovereignty and Privacy**: Developers prepare for confidential technical interviews knowing their private notes and practice answers never leave their machine.
* **Zero Lock-In & Subscriptions**: Usage costs reflect exact raw inference API rates (or $0 when using local Ollama).
* **Software Longevity**: The application remains operational indefinitely on the developer's hardware regardless of external service lifecycles.

### Accepted Costs and Limitations
* **Manual Multi-Device Sync**: In the absence of a centralized cloud database, transferring history between a laptop and desktop requires exporting/importing JSON backups or syncing directories using Git or Syncthing.
