# ADR 0006 — Escala Canónica de Evaluación 0–120 con Zona de Excelencia Dorada

- Estado: **Aceptado**
- Fecha: 2026-09-04
- Decisores: Learning Workspace Core

## Contexto

La mayoría de las plataformas de estudio y herramientas que integran LLMs para evaluar respuestas de alumnos utilizan la escala porcentual tradicional de 0 a 100 puntos. En la práctica de entrevistas técnicas para roles de ingeniería, esto presenta dos problemas estructurales graves:

1. **"Grade Inflation" de los LLMs**: Los modelos de lenguaje tienden a otorgar calificaciones de 90 a 100 puntos a cualquier respuesta pasable o superficialmente correcta que repita la definición de un concepto.
2. **Falta de Diferenciación entre "Suficiente" y "Maestría Senior/Staff"**:
   - Para aprobar una entrevista técnica, explicar correctamente qué es un Hook o cómo funciona una migración en Rails es la base mínima esperada (suficiente).
   - Sin embargo, para calificar como *Senior*, *Lead* o *Staff*, el entrevistador busca que el candidato demuestre comprensión de los *internals* del runtime (ej. cómo el Fiber Reconciler gestiona prioridades concurrentes, qué impacto tiene el Garbage Collector en la memoria, o cómo el motor de bases de datos calcula el costo de un plan de consulta).

Si 100 puntos representa la perfección, el estudiante se conforma con alcanzar la definición básica y el sistema pierde su capacidad de empujarlo hacia la excelencia técnica.

## Decisión

Se estableció una **Escala Canónica de 0 a 120 Puntos** dividida en dos zonas conceptuales bien diferenciadas:

### 1. Zona Base de Suficiencia Técnica (0 a 100 Puntos)
* **100 Puntos**: Representa la cobertura conceptual completa y rigurosa de la lección estándar.
* Si el estudiante cubre los 4 pilares de la rúbrica (precisión técnica, causalidad/trade-offs, aplicación práctica y completitud de edge cases), alcanza la condición de **Maestría Base (`isMastery = true`)**.
* En la interfaz, esta zona se representa con colores institucionales sobrios (cian de la categoría y verde esmeralda de éxito).

### 2. Zona de Bonus de Excelencia Opcional (101 a 120 Puntos)
* Los puntos del 101 al 120 están estrictamente reservados para respuestas que demuestren dominio de bajo nivel, arquitectura interna del motor o consideraciones avanzadas de rendimiento no requeridas en el temario general.
* Para reflejar este logro en la psicología del aprendizaje:
  - **Aura Dorada de Excelencia (`boxShadow` ámbar dorado)** en la tarjeta del grafo y en el modal de evaluación.
  - **Identificador de Estrella (`★ 108/120`)** en el Canvas y en los badges.
  - **Anillos Concéntricos Duales (`CoverageRings`)**: El anillo interior mide el progreso base 0–100 en el color temático, y un segundo anillo exterior concéntrico dorado se dibuja exclusivamente para los puntos 101 a 120.

## Consecuencias

### Positivas
* **Combate la complacencia**: Alumno que obtiene un 95 sabe que tiene una base sólida pero que aún no ha explorado los *internals* profundos que marcan la diferencia en un comité de contratación.
* **Recompensa visual no intrusiva**: El aura dorada actúa como un motivador visual claro (*gamification* sofisticada) sin degradar la estética técnica y minimalista de la plataforma.

### Negativas / Trade-offs
* **Desvío de la convención estándar**: Requiere que la interfaz explique claramente que 100 es la meta de suficiencia completa y que 120 es excelencia opcional, para evitar que un estudiante perciba un 98/120 como un fracaso.
