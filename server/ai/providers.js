import { lookup } from "node:dns/promises";
import { z } from "zod";
import { config } from "../config.js";
import { ErrorCodes, GatewayError } from "./errors.js";
import { PROVIDER_ADAPTERS, normalizeProviderAdapter, providerRuntimeOptions, resolveProviderProfile } from "./providerRegistry.js";

const ProviderProfileBaseZod = z.object({
  // The browser may keep an empty draft id. It is metadata, not a required
  // part of the provider contract, so normalize that value to "undefined"
  // instead of rejecting an otherwise valid provider request.
  id: z.preprocess(
    (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().min(1).max(80).optional(),
  ),
  label: z.string().trim().min(1).max(80).default("Provider personal"),
  adapter: z.preprocess(
    normalizeProviderAdapter,
    z.enum(PROVIDER_ADAPTERS),
  ).default("custom"),
  baseUrl: z.string().url().transform((value) => value.replace(/\/+$/, "")),
  apiKey: z.string().trim().min(1).max(4096),
  // Kept only to accept profiles saved by the initial BYOK screen. Runtime
  // behavior now comes from the controlled provider registry instead of a
  // checkbox the user has to understand.
  supportsResponseFormat: z.boolean().optional(),
}).strict();

const ProviderProfileZod = ProviderProfileBaseZod.extend({
  model: z.string().trim().min(1).max(200),
});

const ProviderDiscoveryProfileZod = ProviderProfileBaseZod.extend({
  model: z.string().trim().max(200).optional(),
});

/**
 * A runtime provider is supplied for a single request. The gateway never
 * writes it to disk or logs its API key. OpenAI-compatible is the normal
 * contract; MiniMax is the only special adapter because of its thinking API.
 */
export async function parseRequestProvider(value, { requireModel = true } = {}) {
  if (value == null) return null;
  const schema = requireModel ? ProviderProfileZod : ProviderDiscoveryProfileZod;
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "La configuracion del provider no es valida");
  }
  if (!config.allowPrivateProviderUrls) await assertPublicProviderUrl(result.data.baseUrl);
  return resolveProviderProfile(result.data);
}

export function requestProvider(profile, { thinking = "adaptive" } = {}) {
  if (!profile) return null;
  return providerRuntimeOptions(profile, { thinking });
}

function minimaxProvider({ thinking = "adaptive" } = {}) {
  if (!config.minimaxApiKey) return null;
  return providerRuntimeOptions({
    label: "minimax",
    adapter: "minimax",
    baseUrl: config.minimaxBaseUrl,
    apiKey: config.minimaxApiKey,
    model: config.minimaxModel,
  }, { thinking });
}

function freellmapiProvider(model) {
  if (!config.freellmapiBaseUrl || !config.freellmapiApiKey) return null;
  return {
    name: "freellmapi",
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model,
    responseFormatMode: "supported",
  };
}

export function providerChain(model, { provider = null, allowFallback = false, ...options } = {}) {
  const selected = requestProvider(provider, options);
  if (selected) {
    return {
      primary: selected,
      // A BYOK selection should not silently bill a gateway fallback.
      fallback: allowFallback ? freellmapiProvider(model) : null,
    };
  }

  const primary = minimaxProvider(options);
  const fallback = freellmapiProvider(model);
  return {
    primary: primary ?? fallback,
    fallback: primary ? fallback : null,
  };
}

async function assertPublicProviderUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error("non_https");
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "::1" || host.endsWith(".local")) throw new Error("local_host");
    const addresses = await lookup(host, { all: true, verbatim: true });
    if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
      throw new Error("private_address");
    }
  } catch {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, "El endpoint del provider debe ser publico, HTTPS y resolver a una IP publica");
  }
}

function isPrivateAddress(address) {
  const normalized = String(address).toLowerCase();
  if (normalized === "::" || normalized === "::1" || normalized.startsWith("fe80:") || /^(fc|fd)/.test(normalized)) return true;
  const mapped = normalized.match(/^::ffff:(.+)$/);
  if (mapped) return isPrivateAddress(mapped[1]);

  const octets = normalized.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false;
  const [a, b] = octets;
  return a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
    || a >= 224;
}
