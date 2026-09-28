import { toEnglishMessage } from "./errorMessages.en.js";

export const ErrorCodes = Object.freeze({
  NOT_CONFIGURED: "not_configured",
  UNAUTHORIZED: "unauthorized",
  RATE_LIMIT: "rate_limit",
  TIMEOUT: "timeout",
  SCHEMA_MISMATCH: "schema_mismatch",
  UPSTREAM: "upstream",
  ABORTED: "aborted",
  BAD_REQUEST: "bad_request",
  INTERNAL: "internal",
});

const STATUS_BY_CODE = {
  [ErrorCodes.NOT_CONFIGURED]: 503,
  [ErrorCodes.UNAUTHORIZED]: 401,
  [ErrorCodes.RATE_LIMIT]: 429,
  [ErrorCodes.TIMEOUT]: 504,
  [ErrorCodes.SCHEMA_MISMATCH]: 502,
  [ErrorCodes.UPSTREAM]: 502,
  [ErrorCodes.BAD_REQUEST]: 400,
  [ErrorCodes.INTERNAL]: 500,
};

const FRIENDLY = {
  [ErrorCodes.NOT_CONFIGURED]: "La IA no está configurada todavía. Podés escribir igual, pero la revisión no estará disponible.",
  [ErrorCodes.UNAUTHORIZED]: "El gateway no tiene un token válido. Revisá server/.env.",
  [ErrorCodes.RATE_LIMIT]: "Tope de uso alcanzado en el proveedor. Esperá unos segundos y reintentá.",
  [ErrorCodes.TIMEOUT]: "El proveedor de IA está congestionado (no respondió en ~5 min). Reintentá en unos minutos o cambiá de modelo en server/.env.",
  [ErrorCodes.SCHEMA_MISMATCH]: "No pudimos interpretar la respuesta del modelo. Reintentá.",
  [ErrorCodes.UPSTREAM]: "El proveedor de IA tuvo un error. Reintentá en un momento.",
  [ErrorCodes.ABORTED]: "Cancelado.",
  [ErrorCodes.BAD_REQUEST]: "La solicitud es inválida.",
  [ErrorCodes.INTERNAL]: "Error interno del gateway.",
};

export class GatewayError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "GatewayError";
    this.code = code;
    this.details = details;
  }
}

export class SchemaMismatchError extends GatewayError {
  constructor(details) {
    super(ErrorCodes.SCHEMA_MISMATCH, FRIENDLY[ErrorCodes.SCHEMA_MISMATCH], details);
    this.name = "SchemaMismatchError";
  }
}

export function httpStatusFor(code) {
  return STATUS_BY_CODE[code] ?? 500;
}

export function friendlyMessage(code) {
  return FRIENDLY[code] ?? FRIENDLY[ErrorCodes.INTERNAL];
}

export function jsonErrorResponse(err, locale = "es") {
  const code = err?.code ?? ErrorCodes.INTERNAL;
  const original = err?.message && typeof err.message === "string"
    ? err.message
    : friendlyMessage(code);
  const message = locale === "en" ? toEnglishMessage(original, code) : original;
  const body = {
    code,
    message,
    details: sanitizeDetails(err?.details),
  };
  return { status: httpStatusFor(code), body };
}

function sanitizeDetails(details) {
  if (!details) return undefined;
  try {
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(details, (key, value) => {
        if (typeof value === "string" && /key|token|authorization/i.test(key)) return "[redacted]";
        if (value && typeof value === "object") {
          if (seen.has(value)) return "[circular]";
          seen.add(value);
        }
        return value;
      }),
    );
  } catch {
    return undefined;
  }
}
