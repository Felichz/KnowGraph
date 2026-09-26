// Pila única de Esc (design-spec D.2): cada capa registra un handler con prioridad;
// un solo listener global consume el de mayor prioridad que devuelva true.
const handlers = new Set();
let installed = false;

export const ESC_PRIORITY = {
  tooltip: 100, popover: 90, palette: 80, modal: 70, drawer: 60, sheet: 55,
  hud: 50, liveReview: 40, zen: 30, study: 20,
};

function onKeyDown(event) {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  const ordered = [...handlers].sort((a, b) => b.priority - a.priority);
  for (const entry of ordered) {
    if (entry.fn(event) !== false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }
}

export function registerEscape(fn, priority) {
  if (!installed && typeof window !== "undefined") {
    window.addEventListener("keydown", onKeyDown, true);
    installed = true;
  }
  const entry = { fn, priority };
  handlers.add(entry);
  return () => handlers.delete(entry);
}
