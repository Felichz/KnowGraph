import { MESSAGES } from "./messages/index.js";
import { DEFAULT_LOCALE, getLocale, INTL_LOCALE } from "./locale.js";

function lookup(tree, key) {
  let node = tree;
  for (const part of key.split(".")) {
    if (node == null || typeof node !== "object") return undefined;
    node = node[part];
  }
  return node;
}

// Messages are strings with {param} placeholders or functions (params) => string for plurals.
export function translate(locale, key, params) {
  const value = lookup(MESSAGES[locale], key) ?? lookup(MESSAGES[DEFAULT_LOCALE], key);
  if (value === undefined) return key;
  if (typeof value === "function") return value(params ?? {});
  if (typeof value !== "string") return key;
  return params ? value.replace(/\{(\w+)\}/g, (match, name) => (params[name] ?? match)) : value;
}

export function t(key, params) {
  return translate(getLocale(), key, params);
}

export function formatNumber(value, locale = getLocale()) {
  return Number(value ?? 0).toLocaleString(INTL_LOCALE[locale] ?? INTL_LOCALE[DEFAULT_LOCALE]);
}

export function formatDate(value, options, locale = getLocale()) {
  return new Date(value).toLocaleString(INTL_LOCALE[locale] ?? INTL_LOCALE[DEFAULT_LOCALE], options);
}
