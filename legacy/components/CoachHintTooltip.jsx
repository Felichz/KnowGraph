import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { ChunkedMarkdown } from "./CoachChat.jsx";

export function CoachHintTooltip({
  hint,
  onTooltipSpaceChange,
  isStale = false,
  onIncorporateFocus,
  isIncorporatingFocus = false,
}) {
  const detailsRef = useRef(null);
  const tooltipRef = useRef(null);
  const reservedSpaceRef = useRef(0);
  const detail = String(hint?.detail ?? hint?.text ?? "").trim();

  const updateTooltipPosition = useCallback(() => {
    const details = detailsRef.current;
    const tooltip = tooltipRef.current;
    if (!details || !tooltip || !details.open) return;

    const detailsRect = details.getBoundingClientRect();
    const vw = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth;
    const vh = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
    const modal = details.closest(".lesson-modal");
    const topBoundary = modal ? Math.max(16, modal.getBoundingClientRect().top + 16) : 16;

    const margin = 16;
    const desiredWidth = Math.min(800, vw - margin * 2);

    let leftOffset = 0;
    const tooltipRight = detailsRect.left + desiredWidth;
    if (tooltipRight > vw - margin) {
      leftOffset = (vw - margin) - tooltipRight;
    }
    if (detailsRect.left + leftOffset < margin) {
      leftOffset = margin - detailsRect.left;
    }

    const availableHeight = Math.max(220, (detailsRect.top - 12) - topBoundary);

    tooltip.style.setProperty("--tooltip-width", `${desiredWidth}px`);
    tooltip.style.setProperty("--tooltip-left", `${leftOffset}px`);
    tooltip.style.setProperty("--tooltip-max-height", `${availableHeight}px`);
  }, []);

  const measureTooltipSpace = useCallback(() => {
    const details = detailsRef.current;
    const tooltip = tooltipRef.current;
    const footer = details?.closest(".live-review");
    if (!details || !tooltip || !footer) return;

    updateTooltipPosition();

    const footerRect = footer.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const tooltipTopWithoutReservedSpace = tooltipRect.top - reservedSpaceRef.current;
    const overlap = Math.max(0, Math.ceil(footerRect.top - tooltipTopWithoutReservedSpace + 4));
    const nextSpace = details.open ? overlap : 0;
    if (nextSpace === reservedSpaceRef.current) return;
    reservedSpaceRef.current = nextSpace;
    onTooltipSpaceChange?.(nextSpace);
  }, [onTooltipSpaceChange, updateTooltipPosition]);

  const prepareTooltipLayout = useCallback(() => {
    const details = detailsRef.current;
    if (!details) return;

    details.dataset.layoutReady = "false";
    updateTooltipPosition();
    measureTooltipSpace();
    requestAnimationFrame(() => {
      updateTooltipPosition();
      measureTooltipSpace();
      if (details.isConnected) details.dataset.layoutReady = "true";
    });
  }, [measureTooltipSpace, updateTooltipPosition]);

  useLayoutEffect(() => {
    prepareTooltipLayout();
    const details = detailsRef.current;
    const tooltip = tooltipRef.current;
    const footer = details?.closest(".live-review");
    if (!details || !tooltip || !footer) return undefined;

    const handleResize = () => {
      updateTooltipPosition();
      measureTooltipSpace();
    };

    const resizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(handleResize)
      : null;
    resizeObserver?.observe(tooltip);
    resizeObserver?.observe(footer);
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", handleResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
      onTooltipSpaceChange?.(0);
    };
  }, [measureTooltipSpace, onTooltipSpaceChange, prepareTooltipLayout, updateTooltipPosition]);

  useEffect(() => {
    const closeOnOutsidePointer = (event) => {
      const details = detailsRef.current;
      if (!details?.open || details.contains(event.target)) return;
      if (event.target.closest?.(".paraphrase-review__textarea, .coach-chat textarea, .coach-chat input, [data-coach-editor]")) return;
      details.open = false;
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  if (!hint || !detail) return null;

  return (
    <div className={`live-review__primary-hint coach-hint ${isStale ? "is-stale" : ""}`}>
      <details ref={detailsRef} className="coach-hint__details" onToggle={prepareTooltipLayout}>
        <summary className="coach-hint__trigger" aria-label="Ver explicación detallada del próximo foco">
          <span className="coach-hint__trigger-copy">
            <span className="coach-hint__eyebrow">{hint.kind === "gap" ? "AHORA" : "PARA PROFUNDIZAR"}</span>
            <span className="coach-hint__label">{hint.text}</span>
          </span>
          <span className="coach-hint__chevron" aria-hidden="true">⌃</span>
        </summary>
        <div ref={tooltipRef} className="coach-hint__tooltip" data-no-reading-focus="true" role="group" aria-label="Explicación detallada del próximo foco">
          <header className="coach-hint__tooltip-header">
            <div className="coach-hint__tooltip-header-top">
              <span className="lesson-section-label">EXPLICACIÓN DEL FOCO</span>
              {isIncorporatingFocus && (
                <span className="coach-hint__generating-pill">
                  <span className="coach-hint__sparkle" aria-hidden="true">✨</span>
                  <span>Incorporando...</span>
                </span>
              )}
            </div>
            <strong>{hint.text}</strong>
          </header>
          <ChunkedMarkdown text={detail} />
          {onIncorporateFocus && (
            <footer className="coach-hint__actions">
              <button
                type="button"
                className={`coach-hint__incorporate-btn ${isIncorporatingFocus ? "is-generating" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onIncorporateFocus(hint);
                }}
                disabled={isIncorporatingFocus || isStale}
                aria-label="Incorporar este foco al borrador con IA"
                title="Integra esta explicación directamente en tu paráfrasis usando IA"
              >
                <span className="coach-hint__incorporate-icon" aria-hidden="true">✨</span>
                <span>{isIncorporatingFocus ? "Incorporando foco con IA..." : "Incorporar este foco al borrador con IA"}</span>
              </button>
            </footer>
          )}
        </div>
      </details>
    </div>
  );
}
