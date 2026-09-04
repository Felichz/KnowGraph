# ADR 0007 — Calibración de la Rúbrica: Causalidad y Trade-offs como Factor Principal

- Estado: **Aceptado**
- Fecha: 2026-09-04
- Decisores: Learning Workspace Core

## Contexto

En los prototipos iniciales de evaluación con IA, los pesos de la rúbrica analítica estaban distribuidos tradicionalmente con el mayor peso en la precisión de la definición:
* `accuracy`: 40 puntos
* `causalityAndTradeoffs`: 25 puntos
* `application`: 20 puntos
* `completeness`: 15 puntos

Al someter este esquema a la realidad de las entrevistas técnicas de la industria (FAANG, unicornios y empresas tecnológicas globales), se identificó un desfase con los criterios de contratación:
* En niveles Junior y Mid-Level, el entrevistador comprueba si el candidato conoce la terminología y la sintaxis (`accuracy`).
* En niveles **Senior, Staff y Principal**, la barra de contratación se traslada casi por completo a la **causalidad y los trade-offs**: entender por qué una solución falla a gran escala, qué condiciones de carrera (*race conditions*) pueden ocurrir bajo concurrencia, qué costo de memoria se asume y por qué se descartan enfoques alternativos.

Un candidato que recita la documentación de memoria pero no sabe explicar las desventajas operativas en producción no supera una ronda técnica Senior.

## Decisión

Se decidió rebalancear formalmente los pesos de la rúbrica analítica en la especificación y en los esquemas Zod del backend (`server/ai/schemas.js`), otorgando la máxima prioridad evaluativa a la dimensión de causalidad:

| Dimensión | Puntos Máximos | Ponderación | Criterio Pedagógico |
| :--- | :---: | :---: | :--- |
| **`causalityAndTradeoffs`** | **35 pts** | **35%** | **Factor Decisivo Senior/Staff**. Razonamiento causal: por qué funciona internamente, qué trade-offs de rendimiento/memoria se aceptan y cómo falla en producción. |
| **`accuracy`** | **30 pts** | **30%** | Corrección técnica estricta, ausencia de conceptos erróneos (*misconceptions*) y uso preciso del vocabulario del dominio. |
| **`application`** | **20 pts** | **20%** | Capacidad de plasmar el concepto en código idiomático, patrones resilientes y manejo de errores. |
| **`completeness`** | **15 pts** | **15%** | Cobertura de edge cases, fases del ciclo de vida y consideraciones de limpieza de recursos. |

Total base: **100 puntos** (a los que se suman hasta 20 puntos de excelencia dorada por *internals* del motor).

## Consecuencias

### Positivas
* **Alineación con Estándares Reales de Entrevista**: El evaluador de IA penaliza respuestas teóricas impecables que omitan explicar los problemas de concurrencia o escalabilidad, forzando al estudiante a razonar como un ingeniero de producción.
* **Feedback Accionable más Valioso**: En los reportes de evaluación (`EvaluateStage.jsx`), el alumno recibe señalamientos concretos sobre trade-offs no considerados en lugar de correcciones gramaticales.

### Negativas / Trade-offs
* **Mayor Exigencia al Estudiante**: Los estudiantes habituados a respuestas breves o puramente sintácticas pueden sentir frustración inicial al ver puntuaciones bajas en lecciones que creían "conocer". Para mitigar esto, el sistema provee los chips de preguntas socráticas en la etapa *02 Aprender* orientados a trade-offs.
