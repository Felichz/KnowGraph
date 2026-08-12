# ADR 0002 — Biblioteca curada y conexiones LLM múltiples

- Estado: **Aceptado**
- Fecha: 2026-08-11
- Decisores: Learning Workspace
- Complementa: [ADR 0001](./0001-llm-provider-registry.md)

## Contexto

El primer panel BYOK presentaba tres presets dentro de un único formulario y
guardaba un borrador por `adapter`. Era suficiente para probar un provider,
pero no representa cómo una herramienta de trabajo maneja cuentas reales: una
persona puede tener un OpenRouter personal, una cuenta de trabajo y un endpoint
compatible, y debe poder conservarlos sin que uno reemplace a otro.

El producto necesita dos cosas distintas:

1. una biblioteca pequeña y fiable de providers que el gateway actual puede
   ejecutar por `POST /chat/completions`;
2. conexiones nombradas por el usuario, de las cuales exactamente una puede
   quedar activa para coaching, chat y evaluación.

No intentamos que el selector sea un directorio exhaustivo de vendors ni
prometemos transportes que no implementamos. Por ejemplo, Anthropic Messages y
OpenAI Responses requieren contracts distintos y no aparecen como presets
nativos hasta que el gateway los soporte de verdad.

## Decisión

### Catálogo compartido y explícito

`shared/providerCatalog.js` es la fuente de verdad para la biblioteca visible
y el registry del gateway. Cada entrada declara:

```ts
type ProviderPreset = {
  id: string
  group: "APIs directas" | "Routers" | "Personalizado"
  label: string
  description: string
  defaultBaseUrl: string
  catalogProvider: string | null
  transport: "chat-completions"
  discovery: string
}
```

Los presets iniciales son OpenAI, OpenRouter, MiniMax, Groq, Mistral AI y
Cerebras, más **Endpoint compatible** como escape hatch. Todos usan el mismo
transporte Chat Completions; MiniMax conserva su comportamiento especial de
reasoning en el gateway. Las URLs prefijadas se verifican contra la
documentación de cada provider: [Groq](https://console.groq.com/docs/openai),
[Mistral](https://docs.mistral.ai/resources/migration-guides) y
[Cerebras](https://inference-docs.cerebras.ai/resources/openai).

Models.dev sigue siendo enriquecimiento de **modelos**, no una fuente de
providers ejecutables ni una dependencia de runtime.

### Conexiones, no borradores por adapter

El estado persistido pasa a v4:

```ts
type ProviderConnection = {
  id: string
  label: string
  adapter: ProviderPreset["id"]
  baseUrl: string
  apiKey: string
  model: string
}

type ProviderSettings = {
  version: 4
  activeProfileId: string | null
  profiles: ProviderConnection[]
}
```

- `profiles` puede contener varias conexiones del mismo provider.
- `activeProfileId` es la única selección utilizada en requests de IA.
- `null` significa usar el provider por defecto del gateway, sin borrar las
  conexiones personales.
- Guardar una conexión puede hacerse sin activarla.
- La migración preserva los perfiles v1-v3. El antiguo preset genérico
  `OpenAI compatible` se convierte en `custom`, porque esa era su semántica.

El navegador mantiene las conexiones en `sessionStorage`; Electron usa su
almacenamiento cifrado. El gateway recibe una conexión solo por la request que
la necesita y no persiste API keys.

### Flujo de interfaz

El panel tiene tres vistas con responsabilidades separadas:

1. **Conexiones**: muestra la conexión en uso, las guardadas y acciones
   explícitas para usar, editar o eliminar.
2. **Agregar conexión**: lista providers por categoría, incluyendo el escape
   hatch compatible.
3. **Configurar conexión**: recoge endpoint, credencial y modelo. Descubrir
   modelos y probar una inferencia son operaciones separadas.

La prueba envía solo una inferencia `OK`; no envía la card ni la respuesta del
estudiante. Un catálogo vacío no invalida una conexión: el slug manual sigue
siendo una ruta válida.

## Consecuencias

### Positivas

- La UI representa relaciones reales: proveedor → conexión → modelo → activo.
- Se puede alternar entre cuentas sin reingresar credenciales.
- Agregar otro provider Chat Completions es un cambio revisable de datos y
  contratos, no una instrucción ambigua para el usuario.
- El custom endpoint sigue disponible sin fabricar soporte nativo inexistente.

### Costos y límites

- La biblioteca es curada, no un marketplace dinámico.
- Cada nuevo transporte nativo necesita un ADR, validación y pruebas propias.
- En el deployment público se rechazan endpoints no HTTPS o privados. Un
  gateway local puede habilitarlos deliberadamente con
  `ALLOW_PRIVATE_PROVIDER_URLS=true`.

## Alternativas consideradas

### Un dropdown con todos los providers de Models.dev

Se descarta. Un catálogo de marketing no demuestra que el gateway pueda hablar
el transporte requerido ni que sus peculiaridades estén testeadas. Models.dev
queda para metadata de modelos.

### LiteLLM o Vercel AI SDK como requisito inmediato

Se posterga. Ambas son opciones razonables cuando haya varios transportes
nativos; hoy el límite real es el contrato del gateway propio y sus eventos
SSE. Mantener esa frontera permite sustituir el cliente interno sin cambiar la
configuración ni la UI.

### Una API key global del deployment

Se descarta para el modo público. BYOK evita que la app comparta una key de
proveedor; una key global solo puede existir como provider por defecto
administrado por el operador.
