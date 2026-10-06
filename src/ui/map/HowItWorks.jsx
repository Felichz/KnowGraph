import { useState } from "react";
import { X } from "lucide-react";
import { useT } from "../../i18n/react.js";
import { IconButton } from "../primitives/Button.jsx";
import { ScaleExplainer } from "../primitives/ScaleExplainer.jsx";

const KEY = "learning-workspace:intro-dismissed";

export function useIntroDismissed() {
  const [dismissed, setDismissed] = useState(() => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } });
  const dismiss = () => { try { localStorage.setItem(KEY, "1"); } catch { /* sin almacenamiento: solo esta sesión */ } setDismissed(true); };
  return [dismissed, dismiss];
}

// Primer uso (specs/004-ui-flow §4): el ciclo leer → explicar → evaluar y qué significa la escala /120.
export function HowItWorks({ onDismiss }) {
  const t = useT();
  const steps = ["read", "explain", "evaluate"];
  return (
    <aside className="intro" aria-labelledby="intro-title">
      <div className="intro__head">
        <h3 id="intro-title" className="intro__title">{t("map.intro.title")}</h3>
        <IconButton icon={X} label={t("map.intro.dismiss")} onClick={onDismiss} />
      </div>
      <ol className="intro__steps">
        {steps.map((step, i) => (
          <li key={step}>
            <span className="intro__num mono" aria-hidden="true">{i + 1}</span>
            <span><strong>{t(`map.intro.steps.${step}.title`)}</strong> <span className="t2">{t(`map.intro.steps.${step}.body`)}</span></span>
          </li>
        ))}
      </ol>
      <ScaleExplainer />
    </aside>
  );
}
