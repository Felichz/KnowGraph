import dotenv from "dotenv";
import { z } from "zod";
import { ErrorCodes, GatewayError } from "./ai/errors.js";

dotenv.config();

const optionalText = (schema) => z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  schema.optional(),
);

const Schema = z.object({
  // Los defaults del gateway son opcionales: en modo BYOK el provider llega
  // con cada request y el proceso puede arrancar sin una key propia.
  FREELLMAPI_BASE_URL: optionalText(z.string().url()),
  FREELLMAPI_API_KEY: optionalText(z.string().min(1)),
  MINIMAX_BASE_URL: z.string().url().default("https://api.minimax.io/v1"),
  MINIMAX_API_KEY: optionalText(z.string().min(1)),
  MINIMAX_MODEL: z.string().min(1).default("MiniMax-M3"),
  LLM_EVALUATION_MODEL: z.string().min(1).default("auto:reliable"),
  LLM_TUTOR_MODEL: z.string().min(1).default("auto:reliable"),
  LLM_LIVE_MODEL: z.string().min(1).default("auto:fastest"),
  GATEWAY_PORT: z.coerce.number().int().positive().default(4317),
  GATEWAY_HOST: z.string().min(1).default("127.0.0.1"),
  CORS_ALLOWED_ORIGINS: z.string().optional().default(""),
  ALLOW_PRIVATE_PROVIDER_URLS: z.enum(["true", "false"]).default("false"),
});

const parsed = Schema.safeParse({
  ...process.env,
  // Render, Railway y otros hosts exponen PORT; el entorno local conserva
  // GATEWAY_PORT para no cambiar los scripts actuales.
  GATEWAY_PORT: process.env.GATEWAY_PORT ?? process.env.PORT,
});

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join(".") || "(root)").join(", ");
  console.error(`[config] Error de configuración: ${missing}. Copiá server/.env.example a server/.env.`);
  throw new GatewayError(ErrorCodes.NOT_CONFIGURED, `Faltan variables: ${missing}`);
}

export const config = Object.freeze({
  freellmapiBaseUrl: parsed.data.FREELLMAPI_BASE_URL?.replace(/\/+$/, "") ?? "",
  freellmapiApiKey: parsed.data.FREELLMAPI_API_KEY ?? "",
  minimaxBaseUrl: parsed.data.MINIMAX_BASE_URL.replace(/\/+$/, ""),
  minimaxApiKey: parsed.data.MINIMAX_API_KEY ?? "",
  minimaxModel: parsed.data.MINIMAX_MODEL,
  evaluationModel: parsed.data.LLM_EVALUATION_MODEL,
  tutorModel: parsed.data.LLM_TUTOR_MODEL,
  liveModel: parsed.data.LLM_LIVE_MODEL,
  port: parsed.data.GATEWAY_PORT,
  host: parsed.data.GATEWAY_HOST,
  allowedOrigins: parsed.data.CORS_ALLOWED_ORIGINS
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean),
  allowPrivateProviderUrls: parsed.data.ALLOW_PRIVATE_PROVIDER_URLS === "true",
});
