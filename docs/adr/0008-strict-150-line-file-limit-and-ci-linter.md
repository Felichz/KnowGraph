# ADR 0008 — Límite Constitucional de 150 Líneas por Archivo y Linter en CI

- Estado: **Aceptado**
- Fecha: 2026-09-04
- Decisores: Learning Workspace Core

## Contexto

En el desarrollo asistido por agentes de inteligencia artificial y programación ágil (*vibe-coding*), existe una entropía natural documentada: los modelos de IA tienden a resolver nuevos requerimientos añadiendo funciones, hooks, estilos inline y estados locales directamente dentro del archivo existente más cercano, en lugar de descomponer el problema en módulos nuevos.

Este patrón degeneró el prototipo original hasta convertir `legacy/App.jsx` en un archivo inmanejable de 2.643 líneas. Sin un mecanismo de contención automático y no negociable, cualquier refactorización limpia volvería a degradarse rápidamente a medida que se agregaran nuevas funcionalidades.

## Decisión

Se consagró el **Artículo III en la Constitución del Proyecto** (`.specify/memory/constitution.md`):

> **Artículo III: Límite Estricto de 150 Líneas por Archivo.**  
> Ningún archivo de componente o hook en `src/` podrá superar bajo ninguna circunstancia las 150 líneas de código.

Para garantizar su cumplimiento continuo e impedir excepciones:
1. **Linter Automatizado en Node (`scripts/audit-lines.mjs`)**:
   - Analiza recursivamente todos los archivos `.js` y `.jsx` en `src/components/` y `src/hooks/`.
   - Si un solo archivo supera las 150 líneas, el script emite un error explícito y finaliza con código de salida 1.
2. **Gate de Integración Continua (CI)**:
   - El script forma parte del pipeline de verificación obligatoria (`npm run check` y pre-commit).
   - No se permite fusionar ningún PR o rama de feature que reporte violaciones.
3. **Estrategia de Descomposición Forzada**:
   - Si una vista compleja (como el modal de estudio o el panel de proveedores) crece, se obliga arquitectónicamente a descomponerla en subcomponentes atómicos con responsabilidad única (ej. `AttemptHistoryBar`, `EvaluationLoader`, `BackupActions`, `DeepDivePopover`).

## Consecuencias

### Positivas
* **Cero Degeneración Monolítica**: La aplicación se mantiene permanentemente modular. En la auditoría actual, los 38 componentes miden entre 2 y 135 líneas ([`App.jsx`](file:///C:/Users/felix/dev/learning/src/App.jsx) mide solo 118 líneas).
* **Baja Carga Cognitiva**: Cualquier ingeniero o agente puede leer, entender y modificar cualquier componente completo en una sola pantalla sin necesidad de hacer scroll vertical excesivo.
* **Trazabilidad y Refactorización Aislada**: Los bugs y mejoras quedan contenidos en archivos pequeños de dominio específico.

### Negativas / Trade-offs
* **Mayor Número de Archivos**: Requiere administrar más archivos en el árbol del proyecto y pasar props o callbacks explícitos entre el contenedor y sus piezas hijas.
