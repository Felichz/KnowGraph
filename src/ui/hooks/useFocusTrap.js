import { useEffect } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusable(root) {
  if (!root) return [];
  return [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
}

// Focus trap + foco inicial + retorno de foco (design-spec D.3).
export function useFocusTrap(ref, active, { initialFocus, returnFocus = true } = {}) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const previous = document.activeElement;
    const root = ref.current;
    const first = (initialFocus && root.querySelector(initialFocus)) || getFocusable(root)[0] || root;
    requestAnimationFrame(() => first?.focus?.({ preventScroll: true }));
    function onKeyDown(event) {
      if (event.key !== "Tab") return;
      const items = getFocusable(root);
      if (!items.length) { event.preventDefault(); return; }
      const index = items.indexOf(document.activeElement);
      if (event.shiftKey && (index <= 0)) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0].focus(); }
    }
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("keydown", onKeyDown);
      if (!returnFocus) return;
      const target = previous && document.contains(previous) && !previous.closest("[inert]")
        ? previous
        : document.querySelector("[data-view-title]");
      target?.focus?.({ preventScroll: true });
    };
  }, [active, ref, initialFocus, returnFocus]);
}
