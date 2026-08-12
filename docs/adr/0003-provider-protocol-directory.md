# ADR 0003 — Directorio amplio de providers y compatibilidad por protocolo

- Estado: **Aceptado**
- Fecha: 2026-08-12
- Decisores: Learning Workspace
- Complementa: [ADR 0001](./0001-llm-provider-registry.md) y [ADR 0002](./0002-multiple-provider-connections.md)

## Contexto

El panel inicial de conexiones sólo mostraba una biblioteca curada de siete
providers. Era correcta desde el punto de vista del transporte, pero no daba
la experiencia de una herramienta de IA abierta: una persona no podía buscar
su proveedor habitual, entender por qué no era conectable o descubrir un
endpoint compatible que el gateway sí podía usar.

Al mismo tiempo, un directorio visual no puede prometer que un provider es
utilizable sólo porque aparece en un catálogo. El gateway existente implementa
`POST /chat/completions`, streaming SSE y algunas opciones de MiniMax. No
implementa, por ejemplo, Anthropic Messages, Gemini `generateContent`, AWS
sigv4/Bedrock o flujos OAuth. Presentar esos providers como si aceptaran una
API key y el mismo endpoint sería un error de producto y de seguridad.

## Decisión

### Dos fuentes con responsabilidades distintas

1. `shared/providerCatalog.js` es el **registry ejecutable**. Contiene los
   endpoints que el gateway puede llamar hoy por Chat Completions, sus URLs
   por defecto y particularidades controladas como MiniMax.
2. `https://models.dev/api.json` es el **directorio de descubrimiento**.
   Se consulta desde el gateway, se cachea seis horas con ETag y nunca recibe
   API keys, respuestas del estudiante, URLs arbitrarias ni otros datos de
   sesión.

El endpoint público `GET /api/ai/providers/catalog` fusiona ambos orígenes y
devuelve metadata segura para el navegador. El catálogo visible no se usa para
ejecutar código ni para definir headers arbitrarios.

### Estados explícitos de compatibilidad

Cada fila del directorio lleva uno de estos estados:

| Estado | Significado | Acción en la UI |
| --- | --- | --- |
| `ready` | La app puede hablar su `chat-completions` hoy. Incluye los presets verificados y metadata de Models.dev que declara `@ai-sdk/openai-compatible` con una URL. | **Conectar** |
| `local` | Usa el mismo protocolo, pero la URL es privada/local. | Conectar sólo en Electron o gateway local; Vercel lo explica y lo rechaza. |
| `adapter-required` | Usa un contrato nativo que este gateway no implementa. | Visible y buscable, sin botón de conexión; se explica el límite real. |

Esto separa claramente *“está en el directorio”* de *“el runtime lo puede
ejecutar”*. Un provider que no sea compatible puede utilizarse mediante
OpenRouter si corresponde, o mediante **Endpoint compatible** cuando el usuario
dispone de un proxy que expone el protocolo correcto.

### Perfil persistido

Las conexiones siguen siendo perfiles nombrados. Se añade `catalogProvider`
como metadata opcional:

```ts
type ProviderConnection = {
  id: string
  label: string
  adapter: string
  catalogProvider: string | null
  baseUrl: string
  apiKey: string
  model: string
}
```

`adapter` ya no es un enum cerrado en la request: se valida como identificador
seguro y se resuelve en un transporte controlado. Un identificador desconocido
no puede introducir código, headers o transformaciones; conserva únicamente el
vínculo con Models.dev y utiliza la misma llamada genérica Chat Completions.

Las credenciales siguen en `sessionStorage` en navegador y en el almacén
cifrado del sistema en Electron. El gateway las recibe para una request, no las
persiste ni devuelve en eventos SSE, logs o errores.

### Experiencia de configuración

El panel opera como una herramienta:

1. **Conexiones** muestra las cuentas guardadas y cuál está activa.
2. **Elegí un provider** ofrece búsqueda en un directorio amplio, un escape
   hatch para endpoint compatible y estados de protocolo legibles.
3. **Configurar conexión** deja separado cargar modelos de probar una
   inferencia mínima. La prueba no contiene material de estudio.

El modelo puede elegirse desde Models.dev, desde `GET /models` cuando el
endpoint lo ofrece o con un slug manual. Una conexión no queda validada por la
lista: la inferencia mínima es la evidencia de URL, API key y modelo correctos.

## Consecuencias

### Positivas

- La interfaz permite descubrir una lista amplia sin mantener manualmente
  decenas de nombres y modelos.
- Los providers OpenAI-compatible detectados pueden configurarse sin esperar
  una release del producto.
- La app no vende soporte nativo inexistente ni induce a pegar una key donde
  el protocolo no coincide.
- El contrato de perfiles continúa siendo portable entre web y Electron.

### Costos y límites

- Models.dev puede estar temporalmente fuera de línea; la biblioteca integrada
  sigue funcionando y el panel informa ese fallback.
- Un provider marcado `adapter-required` necesita un adapter de gateway,
  pruebas de stream/error y un ADR antes de quedar conectable.
- El modo Vercel sigue bloqueando endpoints HTTP, locales o de red privada.
  Esa restricción evita que un gateway BYOK público se convierta en un vector
  SSRF. El modo local sólo se habilita explícitamente mediante
  `ALLOW_PRIVATE_PROVIDER_URLS=true`.

## Alternativas consideradas

### Usar Models.dev como lista automáticamente ejecutable

Se descarta. La presencia de un modelo o de una variable de entorno no prueba
el protocolo, el formato de stream ni la autenticación que espera un provider.

### Agregar LiteLLM o todos los paquetes de Vercel AI SDK inmediatamente

Se posterga. Son buenas capas de transporte cuando se incorpore un conjunto de
adapters nativos; no sustituyen la decisión de qué contratos se soportan ni el
control de las credenciales en el gateway. La frontera actual permite adoptar
una de esas librerías sin cambiar la UI ni el formato del perfil.

### Ocultar los providers sin adapter

Se descarta. Ocultarlos devuelve al problema anterior: el usuario no sabe si
la app no los conoce o si requieren un protocolo distinto. Mostrarlos con una
razón concreta conserva descubrimiento y honestidad técnica.
