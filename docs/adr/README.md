# Architecture Decision Records

Este directorio conserva decisiones arquitectónicas que afectan contratos,
seguridad, datos persistidos o extensibilidad del producto.

- Un ADR se agrega cuando la decisión tiene consecuencias duraderas.
- No reescribimos un ADR aceptado: un cambio de rumbo se registra en otro ADR
  que lo reemplaza o complementa.
- El número es secuencial y el estado puede ser `Propuesto`, `Aceptado`,
  `Reemplazado` o `Retirado`.

## Índice

- [0001 — Registry de providers LLM y configuración BYOK](./0001-llm-provider-registry.md)
- [0002 — Biblioteca curada y conexiones LLM múltiples](./0002-multiple-provider-connections.md)
- [0003 — Directorio amplio de providers y compatibilidad por protocolo](./0003-provider-protocol-directory.md)
- [0004 — Software Tipo Harness Local-First, Soberanía de Datos y Desktop Electron](./0004-user-owned-local-harness-and-desktop-electron.md)
- [0005 — Máquina de Estado Headless y Sincronización con useSyncExternalStore](./0005-headless-state-machine-use-sync-external-store.md)
- [0006 — Escala Canónica de Evaluación 0–120 con Zona de Excelencia Dorada](./0006-dual-tier-evaluation-scale-0-120.md)
- [0007 — Calibración de la Rúbrica: Causalidad y Trade-offs como Factor Principal](./0007-calibrated-senior-staff-rubric-tradeoffs-over-accuracy.md)
- [0008 — Límite Constitucional de 150 Líneas por Archivo y Linter en CI](./0008-strict-150-line-file-limit-and-ci-linter.md)
