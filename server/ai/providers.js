import { config } from "../config.js";

/**
 * Provider order is intentional: MiniMax is the preferred model for this
 * app; FreeLLMAPI remains the recovery path when MiniMax is unavailable.
 * API keys never leave the gateway and are not exposed to the browser.
 */
export function minimaxProvider({ thinking = "adaptive" } = {}) {
  return {
    name: "minimax",
    baseUrl: config.minimaxBaseUrl,
    apiKey: config.minimaxApiKey,
    model: config.minimaxModel,
    supportsResponseFormat: false,
    extraBody: {
      thinking: { type: thinking === "disabled" ? "disabled" : "adaptive" },
      reasoning_split: true,
    },
    // El endpoint HTTP crudo entrega deltas incrementales. El ejemplo del
    // SDK mantiene un buffer acumulado, pero esa adaptación ya no aplica aquí.
    streamContentMode: "delta",
  };
}

export function freellmapiProvider(model) {
  return {
    name: "freellmapi",
    baseUrl: config.freellmapiBaseUrl,
    apiKey: config.freellmapiApiKey,
    model,
    supportsResponseFormat: true,
  };
}

export function providerChain(model, options) {
  return {
    primary: minimaxProvider(options),
    fallback: freellmapiProvider(model),
  };
}
