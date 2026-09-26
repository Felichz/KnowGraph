import { useEffect, useRef, useSyncExternalStore } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { dismissToast, getToasts, subscribeToasts, undoLast } from "../state/toastStore.js";

const ICONS = { error: AlertCircle, success: CheckCircle2, info: Info, warn: AlertTriangle };

function ToastItem({ item }) {
  const timer = useRef(null);
  const start = () => { if (!item.sticky) timer.current = setTimeout(() => dismissToast(item.id), item.duration); };
  const stop = () => clearTimeout(timer.current);
  useEffect(() => { start(); return stop; });
  const Icon = ICONS[item.tone] ?? Info;
  return (
    <div className={`toast toast--${item.tone}`} role={item.tone === "error" ? "alert" : "status"}
      onMouseEnter={stop} onMouseLeave={start} onFocus={stop} onBlur={start}>
      <Icon size={16} strokeWidth={1.5} className="toast__icon" aria-hidden="true" />
      <p className="toast__msg">{item.message}</p>
      {item.action ? (
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => { item.onAction?.(); dismissToast(item.id); }}>
          <span className="btn__label">{item.action}</span>
        </button>
      ) : null}
      <button type="button" className="icon-btn icon-btn--sm" aria-label="Cerrar aviso" onClick={() => dismissToast(item.id)}>
        <X size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

// Región de toasts: F6 lleva el foco aquí; ⌘/Ctrl+Z deshace fuera de campos editables.
export function Toaster() {
  const items = useSyncExternalStore(subscribeToasts, getToasts, getToasts);
  const region = useRef(null);
  useEffect(() => {
    function onKey(event) {
      const editable = event.target.closest?.("input, textarea, [contenteditable=true]");
      if (event.key === "F6" && items.length) { event.preventDefault(); region.current?.querySelector("button")?.focus(); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !event.shiftKey && !editable) {
        if (undoLast()) event.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);
  return (
    <section ref={region} className="toaster" aria-label="Avisos" aria-live="polite">
      {items.map((item) => <ToastItem key={item.id} item={item} />)}
    </section>
  );
}
