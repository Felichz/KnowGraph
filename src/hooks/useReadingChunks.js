import { useCallback, useMemo, useState } from "react";
import { getLocale, INTL_LOCALE } from "../i18n/locale.js";
import { useLocale } from "../i18n/react.js";

// One sentence segmenter per locale, created on first use.
const segmenters = new Map();
function getSentenceSegmenter(locale = getLocale()) {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") return null;
  const tag = INTL_LOCALE[locale] ?? INTL_LOCALE.en;
  if (!segmenters.has(tag)) segmenters.set(tag, new Intl.Segmenter(tag, { granularity: "sentence" }));
  return segmenters.get(tag);
}

export function splitParagraph(paragraph, locale = getLocale()) {
  if (!paragraph) return [];
  if (looksLikeStructuredText(paragraph)) return [paragraph];

  const sentenceSegmenter = getSentenceSegmenter(locale);
  const sentences = sentenceSegmenter
    ? [...sentenceSegmenter.segment(paragraph)].map(({ segment }) => segment.trim()).filter(Boolean)
    : paragraph.match(/[^.!?]+(?:[.!?]+|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [paragraph];

  return mergeTinySentences(sentences);
}

export function mergeTinySentences(sentences) {
  const chunks = [];
  for (const sentence of sentences) {
    if (sentence.length < 36 && chunks.length > 0) {
      chunks[chunks.length - 1] = `${chunks[chunks.length - 1]} ${sentence}`;
    } else {
      chunks.push(sentence);
    }
  }
  return chunks;
}

export function looksLikeStructuredText(text) {
  return /(^|\n)\s*(?:[-*+] |\d+[.)] )/.test(text) || text.includes("\n");
}

export function splitReadingChunks(value, locale = getLocale()) {
  const text = String(value ?? "").trim();
  if (!text) return [];

  return text
    .split(/\n\s*\n/)
    .flatMap((paragraph) => splitParagraph(paragraph.trim(), locale))
    .filter(Boolean);
}

/**
 * Custom Hook: useReadingChunks
 * Encapsulates the ownership of chunk segmentation, stats, and active highlight state.
 */
export function useReadingChunks(text, options = {}) {
  const { initialActiveIndex = null } = options;
  const [activeChunkIndex, setActiveChunkIndex] = useState(initialActiveIndex);
  const locale = useLocale();

  const chunks = useMemo(() => {
    return splitReadingChunks(text, locale);
  }, [text, locale]);

  const stats = useMemo(() => {
    const raw = String(text ?? "").trim();
    const words = raw ? raw.split(/\s+/).filter(Boolean).length : 0;
    const chars = raw.length;
    return {
      totalChunks: chunks.length,
      totalWords: words,
      totalChars: chars,
      avgWordsPerChunk: chunks.length ? Math.round(words / chunks.length) : 0,
    };
  }, [chunks, text]);

  const getChunkClass = useCallback((index) => {
    const isEven = index % 2 === 0;
    const isHighlighted = activeChunkIndex === index;
    return `reading-chunk reading-chunk--${isEven ? "a" : "b"} ${isHighlighted ? "is-hit-active" : ""}`;
  }, [activeChunkIndex]);

  const hoverChunk = useCallback((index) => {
    setActiveChunkIndex(index);
  }, []);

  const clearHover = useCallback(() => {
    setActiveChunkIndex(null);
  }, []);

  return {
    chunks,
    stats,
    activeChunkIndex,
    setActiveChunkIndex,
    hoverChunk,
    clearHover,
    getChunkClass,
  };
}
