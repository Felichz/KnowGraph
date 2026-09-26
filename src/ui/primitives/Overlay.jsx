import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEscape } from "../hooks/useEscape.js";
import { useFocusTrap } from "../hooks/useFocusTrap.js";
import { useScrollLock } from "../hooks/useScrollLock.js";
import { ESC_PRIORITY } from "../state/escStack.js";
import { IconButton } from "./Button.jsx";

const PRIORITY = { dialog: ESC_PRIORITY.modal, alert: ESC_PRIORITY.modal, drawer: ESC_PRIORITY.drawer,
  sheet: ESC_PRIORITY.sheet, "side-sheet": ESC_PRIORITY.sheet, palette: ESC_PRIORITY.palette };

// Overlay modal genérico (design-spec D.3): scrim, focus trap, Esc, scroll-lock, retorno de foco.
export function Overlay({ open, onClose, kind = "dialog", label, labelledBy, describedBy, initialFocus, className = "", children }) {
  const panel = useRef(null);
  useEscape(() => { onClose(); return true; }, PRIORITY[kind] ?? ESC_PRIORITY.modal, open);
  useFocusTrap(panel, open, { initialFocus });
  useScrollLock(open);
  if (!open) return null;
  return createPortal(
    <div className={`overlay overlay--${kind}`}>
      <div className="overlay__scrim" onMouseDown={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role={kind === "alert" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`overlay__panel ${className}`}
      >
        {kind === "sheet" && <span className="sheet__handle" aria-hidden="true" />}
        {children}
      </div>
    </div>,
    document.body,
  );
}

// Cabecera estándar de hoja/drawer con título y cerrar.
export function OverlayHeader({ id, title, subtitle, onClose, actions, closeLabel = "Cerrar" }) {
  return (
    <header className="overlay-header">
      <div className="overlay-header__text">
        <h2 id={id} className="overlay-header__title" tabIndex={-1}>{title}</h2>
        {subtitle ? <p className="overlay-header__subtitle">{subtitle}</p> : null}
      </div>
      {actions}
      <IconButton icon={X} label={closeLabel} onClick={onClose} className="overlay-header__close" data-close />
    </header>
  );
}
