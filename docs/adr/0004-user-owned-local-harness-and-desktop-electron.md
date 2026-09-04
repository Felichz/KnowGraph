# ADR 0004 — Software Tipo Harness Local-First, Soberanía de Datos y Desktop Electron

- Estado: **Aceptado**
- Fecha: 2026-09-04
- Decisores: Learning Workspace Core

## Contexto

Muchas herramientas de preparación técnica y evaluación con IA operan bajo el modelo SaaS tradicional:
1. Las respuestas orales, borradores, notas personales y métricas de desempeño se almacenan en bases de datos centralizadas de un tercero.
2. El usuario paga suscripciones recurrentes con márgenes arbitrarios sobre los tokens de inferencia.
3. Si el servicio cierra o cambia sus políticas, el desarrollador pierde su historial acumulado de estudio.
4. Las credenciales de API (API keys) suelen almacenarse en la nube del proveedor o transmitirse a través de servidores intermediarios.

Para Learning Workspace, el objetivo es radicalmente diferente: concebir el software como un **harness de entrenamiento personal owned por el usuario**, similar a un compilador, un linter o una suite de testing local que corre en su propia máquina. El desarrollador debe ser el dueño absoluto de su entorno de preparación, su base de conocimientos y sus conexiones de inferencia, de forma análoga a cómo funcionan los CLIs modernos de agentes de IA (como Claude Code, Cursor, OpenCode o Aider).

## Decisión

### 1. Filosofía de "Personal Training Harness" Owned por el Usuario

El producto se define como un *harness* de evaluación y estudio técnico que pertenece íntegramente al desarrollador:
* **Almacenamiento Local-First**: Todos los borradores, intentos de evaluación, transcripciones de voz e historiales de tutoría residen en el disco del usuario (IndexedDB en el navegador, archivos y base local en Electron). Costo de hosting para el usuario: **$0**.
* **Zero-Telemetry de Contenido**: Las explicaciones técnicas redactadas o grabadas por el estudiante nunca se envían a un servidor central de telemetría ni se utilizan para entrenar modelos de terceros.
* **Portabilidad Absoluta**: Exportación e importación completa en JSON (`learning-workspace-backup-[fecha].json`) validada por esquema, permitiendo migrar libremente entre computadoras o respaldar en un repositorio Git privado.

### 2. Ciudadano de Primer Nivel en Desktop con Electron

Para consolidar la naturaleza de software local de escritorio, la aplicación se empaqueta y distribuye nativamente en **Electron**:
* **Aislamiento de Secretos vía `safeStorage`**: En el entorno Electron, las API keys no se guardan en texto plano en `localStorage`, sino cifradas mediante las APIs criptográficas nativas del sistema operativo (`DPAPI` en Windows, `Keychain` en macOS, `libsecret` en Linux) con permisos restringidos `0o600`.
* **Capacidad Offline**: La navegación topológica, las lecciones, los deep-dives, las preguntas FAANG y la revisión de intentos anteriores funcionan 100% offline sin conexión a internet.
* **Acceso a APIs del Sistema Operativo**: Soporte nativo para diálogos de archivos del SO para respaldos y atajos de teclado globales.

### 3. Configuración de Inferencia Desacoplada (Estilo CLI de Agentes de IA)

Al igual que en los CLIs de agentes de desarrollo:
* El usuario **trae su propio proveedor (BYOK)**: puede usar OpenAI, Anthropic, Google Gemini, Groq, OpenRouter, MiniMax, o servidores locales de inferencia sin conexión a internet como **Ollama, LM Studio o vLLM**.
* La inferencia se realiza directamente o a través de un gateway local sin recargos sobre el consumo de tokens.
* Soporta perfiles múltiples y conmutación de modelos en caliente según la tarea (ej. un modelo ultrarrápido para autocompletado/live review y un modelo con pensamiento profundo para la evaluación canónica).

## Consecuencias

### Positivas
* **Soberanía y Privacidad**: El estudiante tiene la tranquilidad de que sus notas de estudio, errores y reflexiones para entrevistas confidenciales no salen de su máquina.
* **Sin Vendor Lock-in ni Suscripciones**: El costo de uso es exactamente el costo de inferencia de la API que elija el usuario (o $0 si usa Ollama en local).
* **Longevidad del Software**: La aplicación continuará funcionando indefinidamente en la máquina del desarrollador aunque no haya conexión externa.

### Negativas / Trade-offs
* **Sincronización Multi-Dispositivo Manual**: Al no contar con una base de datos centralizada en la nube, pasar datos entre una laptop de trabajo y una PC de escritorio requiere exportar/importar el archivo de respaldo JSON o sincronizar la carpeta con herramientas tipo Syncthing / Git.
