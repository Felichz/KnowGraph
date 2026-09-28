// Toasts + pila de deshacer (design-spec F.5, DESIGN §5.1).
import { LOCALES } from "../../i18n/locale.js";
import { translate } from "../../i18n/translate.js";

let toasts = [];
const listeners = new Set();
let seq = 0;

function emit() { listeners.forEach((fn) => fn()); }

export function subscribeToasts(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function getToasts() { return toasts; }

// tone: info | success | error | warn. Los errores no se autodescartan.
// undo: true marca el toast como deshacible (⌘/Ctrl+Z), independiente del idioma del label.
export function toast({ tone = "info", message, action, onAction, duration = 5000, persistent, undo = false }) {
  const id = ++seq;
  const sticky = persistent ?? tone === "error";
  toasts = [...toasts.slice(-2), { id, tone, message, action, onAction, duration, sticky, undo }];
  emit();
  return id;
}

export function dismissToast(id) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

// Último deshacer disponible (⌘/Ctrl+Z fuera de campos editables).
export function undoLast() {
  // Compat: toasts sin flag cuyo label es "Deshacer"/"Undo" en cualquier idioma.
  const labels = new Set(LOCALES.map((locale) => translate(locale, "common.actions.undo")));
  const last = [...toasts].reverse().find((item) => (item.undo || labels.has(item.action)) && item.onAction);
  if (!last) return false;
  last.onAction();
  dismissToast(last.id);
  return true;
}
