import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Capa única de tooltips: cualquier elemento con data-tip muestra su texto (design-spec D.3).
const DELAY = 600;

export function TooltipLayer() {
  const [tip, setTip] = useState(null);
  const timer = useRef(null);
  const current = useRef(null);

  useEffect(() => {
    function show(target, immediate) {
      clearTimeout(timer.current);
      const text = target.getAttribute("data-tip");
      if (!text) return;
      const run = () => {
        const rect = target.getBoundingClientRect();
        const side = target.getAttribute("data-tip-side") || "bottom";
        setTip({ text, rect, side });
      };
      if (immediate || tip) run(); else timer.current = setTimeout(run, DELAY);
    }
    function hide() { clearTimeout(timer.current); current.current = null; setTip(null); }
    function over(event) {
      const target = event.target.closest?.("[data-tip]");
      if (target === current.current) return;
      current.current = target;
      if (target) show(target, false); else hide();
    }
    function focusIn(event) {
      const target = event.target.closest?.("[data-tip]");
      if (target && target.matches(":focus-visible")) { current.current = target; show(target, true); }
    }
    const onKey = (event) => { if (event.key === "Escape" && current.current) hide(); };
    document.addEventListener("pointerover", over);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", hide);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("scroll", hide, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("scroll", hide, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [tip]);

  if (!tip) return null;
  const { rect, side } = tip;
  const style = side === "right"
    ? { left: rect.right + 8, top: rect.top + rect.height / 2, transform: "translateY(-50%)" }
    : side === "top"
      ? { left: rect.left + rect.width / 2, top: rect.top - 8, transform: "translate(-50%, -100%)" }
      : { left: rect.left + rect.width / 2, top: rect.bottom + 8, transform: "translateX(-50%)" };
  return createPortal(<div role="tooltip" className="tooltip" style={style}>{tip.text}</div>, document.body);
}
