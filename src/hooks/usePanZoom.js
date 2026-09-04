import { useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD = 5;

export function usePanZoom({ min = 0.3, max = 2.5, initial = { x: 40, y: 30, k: 0.85 } } = {}) {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const movedRef = useRef(0);
  const [view, setView] = useState(initial);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;

    const onWheel = (event) => {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;

      setView((current) => {
        const k = Math.min(max, Math.max(min, current.k * factor));
        const worldX = (px - current.x) / current.k;
        const worldY = (py - current.y) / current.k;
        return { k, x: px - worldX * k, y: py - worldY * k };
      });
    };

    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [min, max]);

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    movedRef.current = 0;
    dragRef.current = { startX: event.clientX, startY: event.clientY, viewX: view.x, viewY: view.y };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    movedRef.current = Math.max(movedRef.current, Math.abs(dx) + Math.abs(dy));
    if (movedRef.current > DRAG_THRESHOLD) {
      setView((current) => ({ ...current, x: drag.viewX + dx, y: drag.viewY + dy }));
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const resetView = () => setView(initial);
  const zoomIn = () => setView((c) => ({ ...c, k: Math.min(max, c.k * 1.2) }));
  const zoomOut = () => setView((c) => ({ ...c, k: Math.max(min, c.k / 1.2) }));

  return {
    ref,
    view,
    wasDragged: () => movedRef.current > DRAG_THRESHOLD,
    panHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    resetView,
    zoomIn,
    zoomOut,
  };
}
