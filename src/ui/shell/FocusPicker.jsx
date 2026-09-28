import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LayoutGrid } from "lucide-react";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { Overlay, OverlayHeader } from "../primitives/Overlay.jsx";
import { useEscape } from "../hooks/useEscape.js";
import { ESC_PRIORITY } from "../state/escStack.js";
import { actions } from "../state/useWorkspace.js";
import { FocusRow } from "./SidebarFocus.jsx";
import { useT } from "../../i18n/react.js";

function FocusOptions({ model, onDone }) {
  const { graph, focusCat, progress } = model;
  const t = useT();
  const pick = (cat) => { actions.setFocus(cat); onDone(); };
  return (
    <div role="radiogroup" aria-label={t("shell.focus.groupLabel")} className="focus-list">
      <FocusRow checked={!focusCat} onSelect={() => pick(null)} label={t("shell.focus.all")} status={progress.status}
        icon={<LayoutGrid size={16} strokeWidth={1.5} aria-hidden="true" />} count={`${progress.done}/${progress.total}`} />
      {Object.entries(graph.categories).map(([cat, info]) => (
        <FocusRow key={cat} checked={focusCat === cat} onSelect={() => pick(cat)} label={info.label} status={progress.status}
          icon={<CategoryDot graph={graph} cat={cat} />} count={`${progress.byCat[cat]?.done ?? 0}/${progress.byCat[cat]?.total ?? 0}`} />
      ))}
    </div>
  );
}

// Popover anclado (tablet, sidebar colapsada).
export function FocusPopover({ model, anchor, onClose }) {
  const ref = useRef(null);
  const t = useT();
  useEscape(() => { onClose(); anchor.current?.focus(); return true; }, ESC_PRIORITY.popover, true);
  useEffect(() => {
    ref.current?.querySelector('[aria-checked="true"]')?.focus();
    const close = (event) => { if (!ref.current?.contains(event.target) && !anchor.current?.contains(event.target)) onClose(); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [anchor, onClose]);
  const rect = anchor.current?.getBoundingClientRect();
  return createPortal(
    <div ref={ref} role="dialog" aria-label={t("shell.focus.choose")} className="popover focus-popover"
      style={{ top: Math.max(8, (rect?.top ?? 80) - 8), left: (rect?.right ?? 56) + 8 }}>
      <FocusOptions model={model} onDone={() => { onClose(); anchor.current?.focus(); }} />
    </div>, document.body);
}

// Hoja inferior (móvil).
export function FocusSheet({ model, open, onClose }) {
  const t = useT();
  return (
    <Overlay open={open} onClose={onClose} kind="sheet" labelledBy="focus-sheet-title" initialFocus="[data-close]">
      <OverlayHeader id="focus-sheet-title" title={t("shell.focus.sheetTitle")} onClose={onClose} />
      <div className="sheet__body"><FocusOptions model={model} onDone={onClose} /></div>
    </Overlay>
  );
}
