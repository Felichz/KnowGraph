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
