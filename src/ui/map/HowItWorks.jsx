import { useT } from "../../i18n/react.js";

// Primer uso (specs/007): el ciclo leer → explicar → evaluar en una línea, bajo el botón de empezar.
// Desaparece solo en cuanto hay actividad; la escala /120 se explica donde se usa (Evaluar).
export function HowItWorks() {
  const t = useT();
  const steps = ["read", "explain", "evaluate"];
  return (
    <ol className="intro__steps" aria-label={t("map.intro.title")}>
      {steps.map((step, i) => (
        <li key={step}>
          <span className="intro__num mono" aria-hidden="true">{i + 1}</span>
          <span><strong>{t(`map.intro.steps.${step}.title`)}</strong> <span className="t2">{t(`map.intro.steps.${step}.body`)}</span></span>
        </li>
      ))}
    </ol>
  );
}
