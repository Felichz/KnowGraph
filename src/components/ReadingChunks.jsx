import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const sentenceSegmenter = typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
  ? new Intl.Segmenter("es", { granularity: "sentence" })
  : null;
const INTERACTIVE_TARGET_SELECTOR = "button, a, input, textarea, select, summary, [role='button'], [role='link'], [contenteditable='true'], [data-no-reading-focus]";
const READING_DIM_EXEMPT_SELECTOR = ".lesson-view-tabs, [data-reading-dim-exempt]";
const readingGroups = new Set();
let pointerFrame = null;
let latestPointer = null;
let focusedSurface = null;
let focusedRoot = null;
let focusedGroup = null;
let focusedIndex = -1;
const dimmedNodes = new Set();
const surfaceListeners = new Map();

function clearPresentation() {
  for (const node of dimmedNodes) node.classList.remove("is-reading-dimmed");
  dimmedNodes.clear();
  focusedRoot?.classList.remove("is-reading-focused");
  focusedSurface?.classList.remove("is-reading-focused");
  focusedRoot = null;
  focusedSurface = null;
  focusedGroup = null;
  focusedIndex = -1;
}

function applyPresentation(owner, index) {
  if (focusedGroup === owner && focusedIndex === index) return;
  clearPresentation();
  if (!owner || index < 0) return;

  focusedGroup = owner;
  focusedIndex = index;
  focusedRoot = owner.root;
  focusedSurface = owner.dimSurface;
  focusedRoot?.classList.add("is-reading-focused");
  focusedSurface?.classList.add("is-reading-focused");

  let current = owner.root;
  while (current && current !== owner.dimSurface) {
    const parent = current.parentElement;
    if (!parent) break;
    for (const sibling of parent.children) {
      if (sibling !== current && !sibling.matches?.(READING_DIM_EXEMPT_SELECTOR)) {
        sibling.classList.add("is-reading-dimmed");
        dimmedNodes.add(sibling);
      }
    }
    current = parent;
  }
}

function scheduleGlobalFocus() {
  if (pointerFrame === null) pointerFrame = requestAnimationFrame(updateGlobalFocus);
}

function updateGlobalFocus() {
  pointerFrame = null;
  if (!latestPointer) {
    clearGlobalFocus();
    return;
  }
  const interactive = latestPointer?.target instanceof Element
    && latestPointer.target.closest(INTERACTIVE_TARGET_SELECTOR);
  let owner = null;
  let ownerIndex = -1;

  if (!interactive) {
    for (const group of readingGroups) {
      const surface = group.surfaceRect;
      // The invisible hit area follows the lesson content column. It covers
      // blank space beside a chunk inside that column, but it must not absorb
      // the study navigation rail or the header/context controls.
      const insideSurface = surface
        && latestPointer.clientX >= surface.left
        && latestPointer.clientX <= surface.right
        && latestPointer.clientY >= surface.top
        && latestPointer.clientY <= surface.bottom;
      if (!insideSurface) continue;
      const index = group.rects.findIndex(({ top, height }) => latestPointer.clientY >= top && latestPointer.clientY <= top + height);
      if (index >= 0) {
        owner = group;
        ownerIndex = index;
        break;
      }
    }
  }

  for (const group of readingGroups) {
    const nextIndex = group === owner ? ownerIndex : -1;
    if (group.activeIndex === nextIndex) continue;
    group.activeIndex = nextIndex;
    group.onFocusChange(nextIndex < 0 ? null : nextIndex);
  }
  applyPresentation(owner, ownerIndex);
}

function onGlobalPointerMove(event) {
  latestPointer = { clientX: event.clientX, clientY: event.clientY, target: event.target };
  scheduleGlobalFocus();
}

function registerReadingSurface(surface) {
  if (!surface) return () => {};
  const currentCount = surfaceListeners.get(surface) ?? 0;
  if (currentCount === 0) {
    // Listen globally instead of attaching to the content element. This keeps
    // the hit area full-width without an overlay that could steal clicks from
    // buttons, links, or the editor.
    if (surfaceListeners.size === 0) {
      window.addEventListener("pointermove", onGlobalPointerMove, { passive: true });
    }
  }
  surfaceListeners.set(surface, currentCount + 1);
  return () => {
    const nextCount = (surfaceListeners.get(surface) ?? 1) - 1;
    if (nextCount > 0) {
      surfaceListeners.set(surface, nextCount);
      return;
    }
    surfaceListeners.delete(surface);
    if (surfaceListeners.size === 0) {
      window.removeEventListener("pointermove", onGlobalPointerMove);
    }
  };
}

function clearGlobalFocus() {
  latestPointer = null;
  for (const group of readingGroups) {
    if (group.activeIndex === -1) continue;
    group.activeIndex = -1;
    group.onFocusChange(null);
  }
  clearPresentation();
}

function registerReadingGroup(group) {
  readingGroups.add(group);
  if (readingGroups.size === 1) {
    window.addEventListener("blur", clearGlobalFocus);
  }
  return () => {
    readingGroups.delete(group);
    group.activeIndex = -1;
    if (readingGroups.size === 0) {
      window.removeEventListener("blur", clearGlobalFocus);
      if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
      pointerFrame = null;
      latestPointer = null;
      clearPresentation();
    }
  };
}

export function splitReadingChunks(value) {
  const text = String(value ?? "").trim();
  if (!text) return [];

  return text
    .split(/\n\s*\n/)
    .flatMap((paragraph) => splitParagraph(paragraph.trim()))
    .filter(Boolean);
}

export function ReadingChunks({ text, renderChunk, className = "", chunkClassName = "", id, singleChunk = false, chunkElement = "p", contentElement = "span" }) {
  const chunks = singleChunk
    ? (String(text ?? "").trim() ? [String(text).trim()] : [])
    : splitReadingChunks(text);
  const rootRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const groupRef = useRef(null);
  if (!groupRef.current) groupRef.current = { rects: [], activeIndex: -1, onFocusChange: setActiveIndex, surface: null, surfaceRect: null, dimSurface: null, root: null };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    // The reading focus belongs to the tab's scrollable content, not to the
    // modal header, study navigation rail, or context controls. The hit-test
    // uses this surface for both its horizontal and vertical bounds.
    groupRef.current.surface = root.closest(".lesson-content, .flashcard-modal__body");
    groupRef.current.dimSurface = root.closest(".lesson-modal, .flashcard-modal") ?? groupRef.current.surface;
    groupRef.current.root = root;

    let frame = null;
    const updateRects = () => {
      frame = null;
      const surfaceRect = groupRef.current.surface?.getBoundingClientRect();
      groupRef.current.surfaceRect = surfaceRect
        ? { left: surfaceRect.left, right: surfaceRect.right, top: surfaceRect.top, bottom: surfaceRect.bottom }
        : null;
      const measured = [...root.querySelectorAll(":scope > .reading-chunk")].map((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, height: rect.height };
      });
      const next = measured.map((rect, index) => {
        const previous = measured[index - 1];
        const following = measured[index + 1];
        const gapBefore = previous ? Math.max(0, rect.top - (previous.top + previous.height)) : 0;
        const gapAfter = following ? Math.max(0, following.top - (rect.top + rect.height)) : 0;
        return {
          top: rect.top - gapBefore / 2,
          height: rect.height + gapBefore / 2 + gapAfter / 2,
        };
      });
      const group = groupRef.current;
      if (!sameRects(group.rects, next)) group.rects = next;
      if (group.activeIndex >= next.length) {
        group.activeIndex = -1;
        setActiveIndex(null);
      }
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updateRects);
    };
    // The modal is the scroll owner after the layout rework. Listening to the
    // content element first would leave hit rectangles stale while scrolling.
    const scroller = root.closest(".lesson-modal, .flashcard-modal")
      ?? root.closest(".lesson-content, .flashcard-modal__body");
    const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(scheduleUpdate) : null;
    const unregisterSurface = registerReadingSurface(groupRef.current.surface);

    updateRects();
    scroller?.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    resizeObserver?.observe(root);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      scroller?.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver?.disconnect();
      unregisterSurface();
      if (focusedGroup === groupRef.current) clearPresentation();
      groupRef.current.surface = null;
      groupRef.current.surfaceRect = null;
      groupRef.current.dimSurface = null;
      groupRef.current.root = null;
    };
  }, [chunks.length]);

  useEffect(() => {
    return registerReadingGroup(groupRef.current);
  }, []);

  const ChunkElement = chunkElement;
  const ContentElement = contentElement;

  return (
    <>
      <div ref={rootRef} className={`reading-chunks ${className}`.trim()}>
      {chunks.map((chunk, index) => (
        <ChunkElement
          className={`reading-chunk reading-chunk--${index % 2 === 0 ? "a" : "b"} ${activeIndex === index ? "is-hit-active" : ""} ${chunkClassName}`.trim()}
          id={index === 0 ? id : undefined}
          key={index}
          tabIndex="0"
        >
          <ContentElement className="reading-chunk__content">
            {renderChunk ? renderChunk(chunk, index) : chunk}
          </ContentElement>
        </ChunkElement>
      ))}
      </div>
    </>
  );
}

function sameRects(previous, next) {
  return previous.length === next.length && previous.every((rect, index) => (
    Math.abs(rect.top - next[index].top) < 0.5 && Math.abs(rect.height - next[index].height) < 0.5
  ));
}

function splitParagraph(paragraph) {
  if (!paragraph) return [];
  if (looksLikeStructuredText(paragraph)) return [paragraph];

  const sentences = sentenceSegmenter
    ? [...sentenceSegmenter.segment(paragraph)].map(({ segment }) => segment.trim()).filter(Boolean)
    : paragraph.match(/[^.!?]+(?:[.!?]+|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [paragraph];

  return mergeTinySentences(sentences);
}

function mergeTinySentences(sentences) {
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

function looksLikeStructuredText(text) {
  return /(^|\n)\s*(?:[-*+] |\d+[.)] )/.test(text) || text.includes("\n");
}
