import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BrandGlyph } from "../primitives/BrandGlyph.jsx";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { useT } from "../../i18n/react.js";
import { CurriculumMenu } from "./Sidebar.jsx";

function useScrolled(scrollRef) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);
  return scrolled;
}

// Si hay un área en foco, se nombra y se puede quitar desde aquí: el único filtro del mapa.
function FocusChip({ model }) {
  const t = useT();
  if (!model.focusCat) return null;
  const name = model.graph.categories[model.focusCat].label;
  return (
    <button type="button" className="focus-chip" onClick={() => actions.setFocus(null)} aria-label={t("shell.topbar.showAll")}>
      <span className="clamp-1">{t("shell.topbar.focusLabel", { name })}</span>
      <X size={14} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

// Barra superior (specs/007): solo dónde estás y, si lo hay, el área en foco. Idioma y tema viven en Ajustes.
export function TopBar({ model, scrollRef }) {
  const view = useWorkspace((s) => s.view);
  const scrolled = useScrolled(scrollRef);
  const t = useT();
  return (
    <header className={`topbar ${scrolled ? "is-scrolled" : ""}`}>
      <h1 className="topbar__title" tabIndex={-1} data-view-title>
        {view === "flashcards" ? t("shell.nav.flashcards") : t("shell.nav.map")}
        <span className="topbar__sub"> · {model.graph.label}</span>
      </h1>
      <FocusChip model={model} />
    </header>
  );
}

// Barra móvil: glifo, temario y área en foco.
export function MobileTopBar({ model }) {
  const view = useWorkspace((s) => s.view);
  const t = useT();
  return (
    <header className="mtopbar">
      <BrandGlyph size={24} />
      <h1 className="sr-only" tabIndex={-1} data-view-title>{view === "flashcards" ? t("shell.nav.flashcards") : t("shell.nav.map")} · {model.graph.label}</h1>
      <CurriculumMenu model={model} />
      <FocusChip model={model} />
    </header>
  );
}
