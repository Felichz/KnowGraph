# ADR 0001 — Registry de providers LLM y configuración BYOK

- Estado: **Aceptado**
- Fecha: 2026-08-11
- Decisores: Learning Workspace

## Contexto

Learning Workspace usa modelos para coaching en vivo, evaluación canónica y
chat de profundización. Es una app web desplegable y una app Electron, por lo
que debe aceptar credenciales del usuario sin convertir el gateway en un
almacén de secretos ni acoplar la UI a un vendor.

La primera versión tenía dos adapters (`openai` y `minimax`) y trataba
`GET /models` como prueba de conexión. Eso no es una premisa válida: algunos
providers compatibles con Chat Completions no publican ese endpoint, o lo
protegen/implementan de otra forma. MiniMax es un ejemplo relevante.

También necesitamos dar un selector de modelos útil sin mantener a mano un
catálogo global que inevitablemente quedará desactualizado.

## Decisión

### 1. Registry controlado, no código arbitrario

El servidor define los presets, el transporte y las peculiaridades de request
en `server/ai/providerRegistry.js`.

Los adapters iniciales son:

| Adapter | Uso |
|---|---|
| `openai` | Escape hatch para cualquier endpoint Chat Completions compatible. |
| `openrouter` | Preset con endpoint y catálogo de OpenRouter. Sigue usando el transporte compatible. |
| `minimax` | Adapter nativo para `thinking`, `reasoning_split` y el fallback de structured output. |

Un perfil no puede declarar un paquete npm, ejecutar código ni transformar
requests arbitrariamente. Es importante tanto para Electron como para una
instancia web pública: la configuración es datos, no una superficie de
ejecución.

```ts
type ProviderProfile = {
  id: string
  label: string
  adapter: "openai" | "openrouter" | "minimax"
  baseUrl: string
  apiKey: string
  model: string
}
```

El registry deriva capacidades y comportamiento de request. La UI no pide que
el usuario determine si su provider acepta `response_format`: el gateway lo
intenta cuando corresponde y vuelve al parser de bloques si el provider lo
rechaza.

### 2. Separar inferencia de descubrimiento de modelos

Hay dos operaciones distintas:

| Operación | Endpoint | Qué valida |
|---|---|---|
| Prueba de modelo | `POST /api/ai/providers/test` | Hace una completion mínima contra el modelo elegido. Valida URL, credencial, ruta y slug reales. |
| Descubrir catálogo | `POST /api/ai/providers/models` | Une `/models` del upstream con el catálogo local/remoto. Nunca determina si la conexión funciona. |

La prueba no contiene contenido de la card ni texto del estudiante; solicita
solamente una respuesta `OK`. Es billable por el provider y se ejecuta solo por
una acción explícita del usuario.

Un provider sin `/models` sigue siendo válido: el usuario puede seleccionar un
modelo de catálogo o escribir el slug manualmente.

### 3. Models.dev es enriquecimiento, no autoridad de runtime

`server/ai/modelCatalog.js` consulta `https://models.dev/api.json` desde el
servidor, sin enviar URL de usuario, API key, prompt ni perfil. El resultado se
mantiene en memoria por seis horas y solo enriquece el selector con nombres,
límites y capacidades.

La precedencia al construir la lista es:

1. Respuesta del endpoint configurado (`/models`), cuando existe.
2. Modelo explícito del perfil y modelos conocidos del preset.
3. Metadata de Models.dev.
4. Entrada manual del usuario.

La lista remota nunca modifica base URLs, headers, credenciales ni el
comportamiento de request. Si Models.dev falla, el preset y la entrada manual
siguen funcionando.

### 4. Configuración y secretos tienen ciclos de vida distintos

El estado de settings es versión 3 y guarda un borrador independiente por
preset. Cambiar de MiniMax a OpenRouter no pisa los campos que el usuario había
escrito para el otro provider.

- **Electron:** el perfil se cifra mediante `safeStorage` del sistema.
- **Web desplegada:** se conserva en `sessionStorage`; se pierde al cerrar la
  pestaña.
- **Gateway:** recibe la key por request para ejecutar la inferencia, pero no
  la escribe a disco ni la incluye en responses o logs.

El gateway acepta automáticamente el mismo origen que lo está sirviendo; una
SPA desplegada junto a `api/ai/**` en Vercel no requiere configuración CORS
adicional. Los frontends hospedados por separado sí deben figurar de forma
explícita en `CORS_ALLOWED_ORIGINS`; nunca se usa `*` en un gateway BYOK.

En una futura versión con cuentas se reemplazará `apiKey` por un `credentialRef`
resuelto desde un vault, sin cambiar el contrato que consume el coaching.

### 5. El contrato de producto sigue siendo propio

Los providers emiten texto o SSE de proveedor. El gateway conserva la
responsabilidad de parsearlo, validarlo y emitir los eventos estables que usa
la aplicación: progreso, subscores, cobertura, hint y resultado final. La UI
no consume chunks específicos de OpenRouter, MiniMax o cualquier otro vendor.

## Consecuencias

### Positivas

- Se puede sumar un provider compatible sin crear un adapter nuevo.
- Los providers especiales quedan aislados y testeables.
- El selector deja de fallar por asumir que `/models` equivale a inferencia.
- Models.dev reduce mantenimiento manual sin pasarle secretos.
- La migración posterior a Vercel AI SDK puede limitarse a la implementación
  del transporte detrás del registry, sin cambiar el gateway SSE ni la UI.

### Costos y límites aceptados

- Un catálogo en memoria no es persistente entre instancias serverless; es una
  optimización, no un requisito de corrección.
- Un catálogo de comunidad puede estar desactualizado; por eso el slug manual
  y el catálogo real del endpoint conservan prioridad.
- Solo Chat Completions está implementado hoy. `Responses` y
  `Anthropic Messages` requerirán adapters explícitos cuando el producto los
  necesite.
- La prueba de inferencia consume pocos tokens del usuario.

## Alternativas consideradas

### LiteLLM embebido

Se descarta como dependencia de esta app. Añadiría un proceso Python/proxy y
otro límite operativo para un caso que ya cubre el adapter OpenAI-compatible.
Un usuario puede conectar una instancia de LiteLLM como endpoint compatible.

### OpenRouter como abstracción central

Se descarta. Es un provider/preset útil, pero convertirlo en la única ruta
eliminaría BYOK directo y dependencia de servicios externos innecesaria.

### Vercel AI SDK ahora

Se posterga, no se rechaza. Es un buen candidato para sustituir la
implementación interna de transportes TypeScript, pero esta decisión primero
define la frontera estable: registry controlado → gateway propio → SSE propio.

### Permitir paquetes runtime desde settings

Se descarta por seguridad. Open source no requiere ejecutar código de terceros
desde una configuración de provider; los nuevos adapters entran por revisión y
tests del proyecto.

## Implementación inicial

- `server/ai/providerRegistry.js`: presets y opciones de runtime.
- `server/ai/modelCatalog.js`: caché de Models.dev y merge seguro de metadata.
- `server/ai/llmClient.js`: `probeProvider()` contra Chat Completions.
- `server/index.js`: endpoints separados para inferencia y discovery.
- `src/ai/providerSettings.js`: estado v3, presets y migración v1/v2.
- `electron/main.cjs`: persistencia cifrada compatible con el estado v3.
- `server/tests/test-providers.mjs`: contratos de perfiles, catálogo y probe.

## Seguimiento

La siguiente decisión relacionada deberá cubrir `credentialRef` y vault para
una versión con cuentas. Otra ADR será necesaria al agregar transportes nativos
`Responses` o `Anthropic Messages`, tools de browser/web y políticas de
fallback configurables por tarea.
