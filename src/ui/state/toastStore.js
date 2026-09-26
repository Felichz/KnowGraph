// Toasts + pila de deshacer (design-spec F.5, DESIGN §5.1).
let toasts = [];
const listeners = new Set();
let seq = 0;

function emit() { listeners.forEach((fn) => fn()); }

export function subscribeToasts(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function getToasts() { return toasts; }

// tone: info | success | error | warn. Los errores no se autodescartan.
export function toast({ tone = "info", message, action, onAction, duration = 5000, persistent }) {
  const id = ++seq;
  const sticky = persistent ?? tone === "error";
  toasts = [...toasts.slice(-2), { id, tone, message, action, onAction, duration, sticky }];
  emit();
  return id;
}

export function dismissToast(id) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

// Último deshacer disponible (⌘/Ctrl+Z fuera de campos editables).
export function undoLast() {
  const last = [...toasts].reverse().find((item) => item.action === "Deshacer" && item.onAction);
  if (!last) return false;
  last.onAction();
  dismissToast(last.id);
  return true;
}
