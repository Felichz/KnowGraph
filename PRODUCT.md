# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

El usuario principal es un desarrollador web con experiencia práctica que se prepara para entrevistas senior o tech lead, especialmente en React y Rails. El producto nació para el flujo personal de Félix y debe poder servir después a otros desarrolladores con un nivel y una necesidad similares.

## Product Purpose

Learning Workspace convierte una preparación amplia y desordenada para entrevistas en una ruta de estudio activa. Permite recuperar y consolidar un modelo mental de conceptos técnicos, practicar cómo explicarlos con palabras propias y llegar con seguridad a conversaciones de arquitectura, implementación y trade-offs.

El éxito no es solo "leer" una card: es poder explicar el concepto con cobertura suficiente, detectar qué falta y avanzar con una señal de dominio comprensible.

## Positioning

El producto combina un grafo explícito de dependencias conceptuales con coaching iterativo basado en parafraseo. Cada nodo define el surface conceptual que hace falta cubrir; un evaluador LLM da feedback priorizado, puntaje y próximos pasos, sin convertir los prerrequisitos en bloqueos rígidos.

El umbral de 100/120 representa cobertura completa de lo esencial. El tramo de 101 a 120 representa profundidad o excelencia opcional: es una oportunidad de ir más allá, no una condición para poder continuar.

## Operating Context

La persona estudia por sesiones, usualmente cerca de una entrevista o mientras refresca experiencia profesional acumulada. Alterna entre un mapa de conceptos, cards didácticas, práctica escrita con un coach, evaluaciones completas, historial de intentos y flashcards.

El producto incluye dos mapas principales: React para entrevistas frontend senior/tech lead y Rails para entrevistas fullstack/backend. Puede crecer para incluir otros dominios de aprendizaje.

## Capabilities and Constraints

- Grafos independientes con nodos, categorías, dependencias, prioridades, milestones y rutas sugeridas.
- Cards autocontenidas con explicación, ejemplos, código, pasos, trade-offs, errores frecuentes, diagramas y fuentes.
- Progreso local por grafo; las dependencias guían el aprendizaje pero no bloquean completar un nodo.
- Coaching y evaluación por LLM a través de un gateway local: MiniMax es el proveedor principal y FreeLLMAPI funciona como fallback.
- Persistencia local de borradores e intentos en IndexedDB y del progreso de mapa en almacenamiento local.
- Flashcards con el parafraseo evaluado del usuario y su score representativo.
- Lectura por voz mediante SpeechSynthesis del sistema.
- La experiencia debe funcionar en web y como aplicación Electron para escritorio; el runtime desktop conserva la misma aplicación React, inicia el gateway local cuando hace falta y no empaqueta claves.
- Es una aplicación local-first. No debe exponer claves ni el gateway de IA al navegador ni asumir una cuenta o backend remoto propio.

## Brand Commitments

El nombre de producto es Learning Workspace. La voz debe ser directa, didáctica y técnicamente precisa: trata al usuario como un desarrollador capaz, evita simplificaciones vacías y explica el porqué, los límites y los trade-offs cuando aportan comprensión.

La interfaz es una herramienta de trabajo y aprendizaje sostenido, no una experiencia de marketing ni un quiz superficial. El puntaje de excelencia debe sentirse especial, pero la cobertura completa debe comunicar una meta alcanzable y suficiente.

## Evidence on Hand

- Los grafos, las cards, preguntas, fuentes, relaciones y contenido de estudio viven en `src/`.
- La auditoría de React valida contenido y relaciones con `npm run audit:react`.
- El gateway LLM, sus prompts, validación y streaming viven en `server/`.
- La guía técnica de la aplicación desktop está en `docs/DESKTOP_APP.md`.
- El plan de la experiencia LLM está en `docs/LLM_LEARNING_EXPERIENCE_PLAN.md`.
- No hay investigación de usuarios externa, métricas públicas, testimonios ni claims comerciales que deban inventarse.

## Product Principles

1. Aprender en orden conceptual sin perder autonomía sobre por dónde empezar.
2. Hacer visible qué falta para poder explicarlo, no solo si una respuesta parece correcta.
3. Favorecer práctica activa, iteración y recuperación de memoria por encima del consumo pasivo.
4. Distinguir cobertura necesaria de profundidad opcional para evitar perfeccionismo que frene el avance.
5. Mantener el control y los datos de aprendizaje en local mientras se integra IA de forma segura.

## Accessibility & Inclusion

La interfaz debe ser legible en sesiones largas, usable con teclado y compatible con lectores de pantalla. Los controles de navegación, evaluación, streaming y lectura por voz deben comunicar su estado sin depender únicamente del color o de animaciones. La versión desktop no sustituye los fundamentos de accesibilidad de la versión web.
