import dotenv from "dotenv";
import { z } from "zod";
import { ErrorCodes, GatewayError } from "./ai/errors.js";

dotenv.config();

const Schema = z.object({
  FREELLMAPI_BASE_URL: z.string().url(),
  FREELLMAPI_API_KEY: z.string().min(1),
    LLM_EVALUATION_MODEL: z.string().min(1).default("auto:fastest"),
    LLM_TUTOR_MODEL: z.string().min(1).default("auto:fastest"),
  GATEWAY_PORT: z.coerce.number().int().positive().default(4317),
  GATEWAY_HOST: z.string().min(1).default("127.0.0.1"),
});

const parsed = Schema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join(".") || "(root)").join(", ");
  console.error(`[config] Error de configuración: ${missing}. Copiá server/.env.example a server/.env.`);
  throw new GatewayError(ErrorCodes.NOT_CONFIGURED, `Faltan variables: ${missing}`);
}

export const config = Object.freeze({
  freellmapiBaseUrl: parsed.data.FREELLMAPI_BASE_URL.replace(/\/+$/, ""),
  freellmapiApiKey: parsed.data.FREELLMAPI_API_KEY,
  evaluationModel: parsed.data.LLM_EVALUATION_MODEL,
  tutorModel: parsed.data.LLM_TUTOR_MODEL,
  port: parsed.data.GATEWAY_PORT,
  host: parsed.data.GATEWAY_HOST,
});
