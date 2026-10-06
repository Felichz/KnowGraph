import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_K as MAX, MIN_K as MIN } from "./graphUtils.js";

const DRAG = 5;
const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Pan (arrastre con captura diferida) y zoom (rueda anclada al cursor) — design-spec D.6.
export function useGraphViewport(initial) {
  const ref = useRef(null);
  const drag = useRef(null);
  const moved = useRef(0);
  const [view, setView] = useState(initial);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [animate, setAnimate] = useState(false);
  const timer = useRef(0);
  // Saltos de cámara (encuadre, ir a un nodo) animados; rueda y arrastre son directos.
  const goTo = useCallback((next, animated = true) => {
    window.clearTimeout(timer.current);
    const on = animated && !reducedMotion();
    setAnimate(on);
    setView(next);
    if (on) timer.current = window.setTimeout(() => setAnimate(false), 420);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      setAnimate(false);
      setView((v) => {
        const k = Math.min(MAX, Math.max(MIN, v.k * factor));
        return { k, x: px - ((px - v.x) / v.k) * k, y: py - ((py - v.y) / v.k) * k };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) setSize((s) => (s.width === Math.round(rect.width) && s.height === Math.round(rect.height) ? s : { width: Math.round(rect.width), height: Math.round(rect.height) }));
    });
    ro.observe(el);
    return () => { el.removeEventListener("wheel", onWheel); ro.disconnect(); };
  }, []);

  const zoomBy = useCallback((factor) => {
    setAnimate(!reducedMotion());
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnimate(false), 420);
    setView((v) => {
      const k = Math.min(MAX, Math.max(MIN, v.k * factor));
      const cx = size.width / 2;
      const cy = size.height / 2;
      return { k, x: cx - ((cx - v.x) / v.k) * k, y: cy - ((cy - v.y) / v.k) * k };
    });
  }, [size]);

  const handlers = {
    onPointerDown(event) {
      if (event.button !== 0) return;
      moved.current = 0;
      drag.current = { sx: event.clientX, sy: event.clientY, vx: view.x, vy: view.y, captured: false };
    },
    onPointerMove(event) {
      const d = drag.current;
      if (!d) return;
      const dx = event.clientX - d.sx;
      const dy = event.clientY - d.sy;
      moved.current = Math.max(moved.current, Math.abs(dx) + Math.abs(dy));
      if (moved.current > DRAG) {
        if (!d.captured) { event.currentTarget.setPointerCapture?.(event.pointerId); d.captured = true; setAnimate(false); }
        setView((v) => ({ ...v, x: d.vx + dx, y: d.vy + dy }));
      }
    },
    onPointerUp(event) {
      if (drag.current?.captured) event.currentTarget.releasePointerCapture?.(event.pointerId);
      drag.current = null;
    },
  };
  handlers.onPointerCancel = handlers.onPointerUp;
  return { ref, view, goTo, animate, size, measured: size.width > 0, zoomBy, handlers, wasDragged: () => moved.current > DRAG };
}
