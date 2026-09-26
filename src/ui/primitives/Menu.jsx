import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { useEscape } from "../hooks/useEscape.js";
import { ESC_PRIORITY } from "../state/escStack.js";

// Menú de opciones exclusivas (menuitemradio) anclado a su disparador.
export function Menu({ trigger, items, value, onSelect, label, align = "end" }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  useEscape(() => { setOpen(false); triggerRef.current?.focus(); return true; }, ESC_PRIORITY.popover, open);
  useEffect(() => {
    if (!open) return undefined;
    const checked = listRef.current?.querySelector('[aria-checked="true"]') ?? listRef.current?.querySelector("[role=menuitemradio]");
    checked?.focus();
    const close = (event) => { if (!listRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  function toggle() {
    setRect(triggerRef.current?.getBoundingClientRect() ?? null);
    setOpen((v) => !v);
  }
  function onKeyDown(event) {
    const nodes = [...listRef.current.querySelectorAll("[role=menuitemradio]")];
    const i = nodes.indexOf(document.activeElement);
    if (event.key === "ArrowDown") { event.preventDefault(); nodes[(i + 1) % nodes.length].focus(); }
    if (event.key === "ArrowUp") { event.preventDefault(); nodes[(i - 1 + nodes.length) % nodes.length].focus(); }
    if (event.key === "Tab") setOpen(false);
  }
  const style = rect ? { top: rect.bottom + 4, ...(align === "end" ? { right: window.innerWidth - rect.right } : { left: rect.left }) } : {};
  return (
    <>
      {trigger({ ref: triggerRef, onClick: toggle, "aria-haspopup": "menu", "aria-expanded": open })}
      {open && createPortal(
        <div ref={listRef} role="menu" aria-label={label} className="menu" style={style} onKeyDown={onKeyDown}>
          {items.map((item) => (
            <button key={item.value} type="button" role="menuitemradio" aria-checked={item.value === value}
              className="menu__item" onClick={() => { onSelect(item.value); setOpen(false); triggerRef.current?.focus(); }}>
              <span>{item.label}</span>
              {item.value === value ? <Check size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>, document.body)}
    </>
  );
}
