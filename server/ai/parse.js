import { ZodError } from "zod";
import { ErrorCodes, GatewayError, SchemaMismatchError } from "./errors.js";

/**
 * Estrategia de parseo en 3 niveles:
 *  1) JSON.parse directo + Zod validation
 *  2) extraer primer bloque {...} balanceado y reintentar
 *  3) repair: pedirle al modelo que devuelva el JSON correcto
 *  4) error tipado SchemaMismatchError
 */
export async function parseStructuredResponse({ raw, schema, repair }) {
  const text = extractAssistantText(raw);
  if (!text) {
    throw new SchemaMismatchError({ reason: "no_content", snippet: "" });
  }

  // Nivel 1: parseo directo
  const direct = tryParse(text, schema);
  if (direct.ok) return { data: direct.data, attempts: 0, rawText: text };

  // Nivel 2: extraer bloque JSON balanceado
  const extracted = extractBalancedJson(text);
  if (extracted && extracted !== text) {
    const second = tryParse(extracted, schema);
    if (second.ok) return { data: second.data, attempts: 0, rawText: text, extracted: true };
  }

  // Nivel 3: repair (una sola vez)
  if (typeof repair === "function") {
    const repaired = await repair({ badOutput: text, issues: direct.issues });
    if (repaired) {
      const third = tryParse(repaired, schema);
      if (third.ok) return { data: third.data, attempts: 1, rawText: text, repaired: true };
    }
  }

  // Nivel 4: error
  throw new SchemaMismatchError({
    reason: "all_levels_failed",
    snippet: text.slice(0, 400),
    issues: direct.issues?.slice(0, 5) ?? [],
  });
}

function extractAssistantText(raw) {
  const choice = raw?.choices?.[0];
  return choice?.message?.content ?? "";
}

function tryParse(text, schema) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return { ok: false, issues: [`json_parse: ${e.message}`] };
  }
  try {
    const data = schema.parse(parsed);
    return { ok: true, data };
  } catch (e) {
    if (e instanceof ZodError) {
      return { ok: false, issues: e.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`) };
    }
    return { ok: false, issues: [e?.message ?? "validation_failed"] };
  }
}

/**
 * Busca el primer bloque {...} balanceado en el texto.
 * No es parser completo: asume JSON bien parentizado (lo que devuelve un LLM).
 */
function extractBalancedJson(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}
