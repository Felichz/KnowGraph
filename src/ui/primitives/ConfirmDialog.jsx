import { useId } from "react";
import { Overlay } from "./Overlay.jsx";
import { Button } from "./Button.jsx";
import { useT } from "../../i18n/react.js";

// Confirmación (design-spec D.9): foco inicial en Cancelar.
export function ConfirmDialog({ open, title, body, confirmLabel, destructive = false, onConfirm, onCancel }) {
  const t = useT();
  const titleId = useId();
  const bodyId = useId();
  return (
    <Overlay open={open} onClose={onCancel} kind="alert" labelledBy={titleId} describedBy={bodyId}
      initialFocus="[data-cancel]" className="confirm">
      <h2 id={titleId} className="confirm__title">{title}</h2>
      <p id={bodyId} className="confirm__body">{body}</p>
      <div className="confirm__actions">
        <Button variant="secondary" onClick={onCancel} data-cancel>{t("common.actions.cancel")}</Button>
        <Button variant={destructive ? "danger-fill" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Overlay>
  );
}
