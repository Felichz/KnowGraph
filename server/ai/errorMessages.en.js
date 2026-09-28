// English versions of the gateway's user-facing error messages. The gateway raises errors with
// the original Spanish text; jsonErrorResponse() swaps them when the request locale is "en".

export const FRIENDLY_EN = {
  not_configured: "AI is not configured yet. You can keep writing, but the review is not available.",
  unauthorized: "The gateway does not have a valid token. Check server/.env.",
  rate_limit: "The provider's usage limit was reached. Wait a few seconds and retry.",
  timeout: "The AI provider is congested (no response in about 5 min). Retry in a few minutes or switch models in server/.env.",
  schema_mismatch: "We could not interpret the model's response. Retry.",
  upstream: "The AI provider returned an error. Retry in a moment.",
  aborted: "Cancelled.",
  bad_request: "The request is invalid.",
  internal: "Internal gateway error.",
};

const EXACT = {
  "Este origen no puede usar el gateway": "This origin is not allowed to use the gateway",
  "Falta la configuracion del provider": "The provider configuration is missing",
  "Faltan campos: graphId, nodeId, answer, contentHash": "Missing fields: graphId, nodeId, answer, contentHash",
  "Falta el contenido de la card (node)": "The card content (node) is missing",
  "Faltan campos del contexto de coaching": "Missing coaching context fields",
  "La pregunta está vacía": "The question is empty",
  "Ruta no encontrada": "Route not found",
  "JSON inválido": "Invalid JSON",
  "Body demasiado grande": "Request body too large",
  "El coach no devolvió contenido": "The coach returned no content",
  "Falta FREELLMAPI_BASE_URL": "FREELLMAPI_BASE_URL is missing",
  "Falta FREELLMAPI_API_KEY": "FREELLMAPI_API_KEY is missing",
  "Falta modelo": "The model is missing",
  "messages requerido": "messages is required",
  "Cancelado": "Cancelled",
  "Cancelado por el usuario": "Cancelled by the user",
  "Configurá un provider de IA antes de evaluar": "Set up an AI provider before evaluating",
  "No hay provider de fallback configurado": "No fallback provider is configured",
  "Falta parser estructurado": "The structured parser is missing",
  "La llamada al LLM excedió el tiempo": "The LLM call timed out",
  "Error de red": "Network error",
  "Error leyendo stream": "Error reading the stream",
  "El stream no devolvió contenido": "The stream returned no content",
  "El proveedor rechazó el token": "The provider rejected the token",
  "Rate limit del proveedor": "Provider rate limit",
  "El contenido de la card está vacío": "The card content is empty",
  "El modelo no devolvió texto de paráfrasis": "The model returned no paraphrase text",
  "El modelo no devolvió texto de paráfrasis mejorada": "The model returned no improved paraphrase text",
  "El modelo no devolvió texto de paráfrasis reconciliada": "The model returned no reconciled paraphrase text",
  "El modelo no devolvió texto de paráfrasis didáctica": "The model returned no teaching paraphrase text",
  "El modelo no devolvió texto refinado": "The model returned no refined text",
  "La configuracion del provider no es valida": "The provider configuration is not valid",
  "El endpoint del provider debe ser publico, HTTPS y resolver a una IP publica": "The provider endpoint must be public, use HTTPS and resolve to a public IP",
};

const PATTERNS = [
  [/^answer demasiado largo \(max (\d+)\)$/, "answer too long (max $1)"],
  [/^question demasiado largo \(max (\d+)\)$/, "question too long (max $1)"],
  [/^La pregunta supera (\d+) caracteres$/, "The question exceeds $1 characters"],
  [/^Proveedor 5xx: /, "Provider 5xx: "],
];

// Spanish words that only appear in gateway-authored messages, never in provider responses.
const SPANISH_HINT = /[áéíóúñ¿¡]|\b(Falta|Faltan|No hay|Configurá|Cancelado|Proveedor|requerido|inválid[oa]|demasiado|devolvió)\b/;

export function toEnglishMessage(message, code) {
  if (typeof message !== "string" || !message) return FRIENDLY_EN[code] ?? FRIENDLY_EN.internal;
  if (EXACT[message]) return EXACT[message];
  for (const [pattern, replacement] of PATTERNS) {
    if (pattern.test(message)) return message.replace(pattern, replacement);
  }
  if (SPANISH_HINT.test(message)) return FRIENDLY_EN[code] ?? FRIENDLY_EN.internal;
  return message;
}
