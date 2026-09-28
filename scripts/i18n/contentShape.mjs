// Shared rules for localized curriculum content (used by the extractor and the i18n check).
// Spanish is the base locale: every other locale is an overlay that mirrors the Spanish text
// leaves of the composed graph. IDs, edges, colors, hrefs and code are never part of the shape.
import { createHash } from "node:crypto";

// Keys that never carry prose: identifiers, graph structure, links and styling.
export const SKIP_KEYS = new Set([
  "id", "cat", "prerequisites", "related", "href", "color", "nodeIds", "milestoneIds", "requires",
  "priority", "explanationUsesAudit", "contentHash", "sourceQuestionId",
]);

// Code is shared across locales. An overlay may override it only to translate Spanish comments.
export const OPTIONAL_KEYS = new Set(["code"]);

const SPANISH_WORDS = /\b(el|los|las|del|que|para|con|una|por|cuando|como|pero|está|están|también|según|sin|sobre|entre|puede|porque|hay|más|qué|cómo|cuándo|dónde|usá|mirá|podés|necesitás|tenés)\b/gi;

export function looksSpanish(text) {
  const value = String(text ?? "");
  if (/[ñ¿¡]/.test(value)) return true;
  const hits = value.match(SPANISH_WORDS)?.length ?? 0;
  const accents = value.match(/[áéíóú]/g)?.length ?? 0;
  return hits >= 3 || (hits >= 1 && accents >= 1) || accents >= 3;
}

// Code only needs a translated copy when a comment or string literal is Spanish prose.
export function looksSpanishCode(code) {
  const value = String(code ?? "");
  return /[ñ¿¡áéíóú]/.test(value) || (value.match(SPANISH_WORDS)?.length ?? 0) >= 1;
}

// Mirrors the translatable text of `value`. Returns undefined when nothing is translatable.
export function textShape(value, key = "") {
  if (SKIP_KEYS.has(key)) return undefined;
  if (typeof value === "string") {
    if (OPTIONAL_KEYS.has(key)) return looksSpanishCode(value) ? value : undefined;
    return value;
  }
  if (Array.isArray(value)) {
    const items = value.map((item) => textShape(item));
    return items.some((item) => item !== undefined) ? items.map((item) => item ?? null) : undefined;
  }
  if (value && typeof value === "object" && !(value instanceof Set) && !(value instanceof Map)) {
    const out = {};
    for (const [childKey, child] of Object.entries(value)) {
      const shaped = textShape(child, childKey);
      if (shaped !== undefined) out[childKey] = shaped;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

export function nodeShape(node) {
  return textShape({ label: node.label, lesson: node.lesson });
}

export function graphMetaShape(graph) {
  return textShape({
    label: graph.label,
    title: graph.title,
    subtitle: graph.subtitle,
    categories: Object.fromEntries(Object.entries(graph.categories).map(([id, cat]) => [id, { label: cat.label }])),
    categoryContext: graph.categoryContext,
    milestones: (graph.milestones ?? []).map(({ label, description }) => ({ label, description })),
    seniorityBands: (graph.seniorityBands ?? []).map(({ label, description, stage }) => ({ label, description, stage })),
    interviewQuestions: (graph.interviewQuestions ?? []).map(({ title }) => ({ title })),
  });
}

// Hash of the required Spanish text, used to detect translations that went stale.
export function shapeHash(shape) {
  const required = JSON.stringify(shape, (key, value) => (OPTIONAL_KEYS.has(key) ? undefined : value));
  return createHash("sha1").update(required).digest("hex").slice(0, 12);
}
