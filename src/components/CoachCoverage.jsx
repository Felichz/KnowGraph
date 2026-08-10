import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { buildCoachChecklist, mergeCoachCoverage } from "../ai/coverage.js";

const STATUS_LABEL = {
  covered: "Cubierto",
  partial: "Parcial",
  missing: "Falta",
  pending: "Sin revisar",
};

export function CoachCoverage({ node, coverage = [], onTooltipSpaceChange }) {
  const detailsRef = useRef(null);
  const tooltipRef = useRef(null);
  const reservedSpaceRef = useRef(0);
  const checklist = buildCoachChecklist(node);
  const items = mergeCoachCoverage(checklist, coverage);

  const covered = items.filter((item) => item.status === "covered").length;
  const partial = items.filter((item) => item.status === "partial").length;
  const pending = items.filter((item) => item.status === "pending").length;
  const missing = items.length - covered - partial - pending;
  const progress = items.length ? ((covered + partial * 0.5) / items.length) * 100 : 0;
  const label = items.length > 0 && covered === items.length ? "Superficie cubierta" : "Ver superficie";

  const measureTooltipSpace = useCallback(() => {
    const details = detailsRef.current;
    const tooltip = tooltipRef.current;
    const footer = details?.closest(".live-review");
    if (!details || !tooltip || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    // Restamos el espacio ya aplicado para medir el solapamiento original y
    // evitar que ResizeObserver entre en un ciclo al mover el tooltip.
    const tooltipTopWithoutReservedSpace = tooltipRect.top - reservedSpaceRef.current;
    const overlap = Math.max(0, Math.ceil(footerRect.top - tooltipTopWithoutReservedSpace + 4));
    const nextSpace = details.open ? overlap : 0;
    if (nextSpace === reservedSpaceRef.current) return;
    reservedSpaceRef.current = nextSpace;
    onTooltipSpaceChange?.(nextSpace);
  }, [onTooltipSpaceChange]);

  const prepareTooltipLayout = useCallback(() => {
    const details = detailsRef.current;
    if (!details) return;

    // Native <details> changes `open` before React gets a chance to repaint.
    // Keep the tooltip hidden while the footer reserves its space so the
    // first painted frame can never cover the editor.
    details.dataset.layoutReady = "false";
    measureTooltipSpace();
    requestAnimationFrame(() => {
      measureTooltipSpace();
      if (details.isConnected) details.dataset.layoutReady = "true";
    });
  }, [measureTooltipSpace]);

  useLayoutEffect(() => {
    prepareTooltipLayout();
    const details = detailsRef.current;
    const tooltip = tooltipRef.current;
    const footer = details?.closest(".live-review");
    if (!details || !tooltip || !footer) return undefined;

    const resizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(measureTooltipSpace)
      : null;
    resizeObserver?.observe(tooltip);
    resizeObserver?.observe(footer);
    window.addEventListener("resize", measureTooltipSpace);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureTooltipSpace);
      onTooltipSpaceChange?.(0);
    };
  }, [measureTooltipSpace, onTooltipSpaceChange, prepareTooltipLayout]);

  useEffect(() => {
    const closeOnOutsidePointer = (event) => {
      const details = detailsRef.current;
      if (!details?.open || details.contains(event.target)) return;

      // El tooltip acompaña al editor: hacer click en el textarea para
      // continuar escribiendo no debe cerrar la superficie que el usuario
      // está consultando.
      if (event.target.closest?.(".paraphrase-review__textarea, .coach-chat textarea, .coach-chat input, [data-coach-editor]")) return;
      details.open = false;
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  if (!items.length) return null;

  return (
    <div className="coach-coverage">
      <details
        ref={detailsRef}
        className="coach-coverage__details"
        onToggle={prepareTooltipLayout}
      >
        <summary className="coach-coverage__trigger" aria-label="Ver cobertura de pasos y trade-offs de la card">
          <span className="coach-coverage__eyebrow">SUPERFICIE</span>
          <span className="coach-coverage__score"><strong>{covered}</strong><small>/{items.length}</small></span>
          <span className="coach-coverage__mini-meter" aria-hidden="true"><span style={{ width: `${progress}%` }} /></span>
          <span className="coach-coverage__trigger-label">{label}</span>
          <span className="coach-coverage__chevron" aria-hidden="true">⌃</span>
        </summary>

        <div ref={tooltipRef} className="coach-coverage__tooltip" role="group" aria-label="Detalle de cobertura de la card">
          <header className="coach-coverage__tooltip-header">
            <div>
              <span className="lesson-section-label">MAPA DE COBERTURA</span>
              <strong>{covered}/{items.length} puntos cubiertos</strong>
            </div>
            <span className="coach-coverage__tooltip-status">
              {partial ? `${partial} parciales` : missing ? `${missing} faltan` : pending ? "Esperando revisión" : "Completo"}
            </span>
          </header>
          <div className="coach-coverage__groups">
            <CoverageGroup title="Paso a paso" items={items.filter((item) => item.group === "steps")} />
            <CoverageGroup title="Trade-offs y errores" items={items.filter((item) => item.group === "tradeoffs")} />
          </div>
        </div>
      </details>
    </div>
  );
}

function CoverageGroup({ title, items }) {
  if (!items.length) return null;
  return (
    <div className="coach-coverage__group">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li className={`coach-coverage__item coach-coverage__item--${item.status}`} key={item.id}>
            <span className="coach-coverage__status" aria-label={STATUS_LABEL[item.status]}>
              {item.status === "covered" ? "✓" : item.status === "partial" ? "~" : item.status === "missing" ? "×" : "·"}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
