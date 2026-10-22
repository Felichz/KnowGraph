import { Check, Star } from "lucide-react";
import { useT } from "../../i18n/react.js";

// La escala 0–120 explicada con el mismo código visual que el riel (DESIGN §8.1):
// 0–99 en curso, 100 dominada (objetivo), 101–120 profundidad extra opcional.
export function ScaleExplainer({ compact = false }) {
  const t = useT();
  return (
    <div className={`scale ${compact ? "is-compact" : ""}`} role="group" aria-label={t("primitives.scale.label")}>
      <div className="scale__track" aria-hidden="true">
        <span className="scale__seg is-progress" />
        <span className="scale__seg is-mastered" />
        <span className="scale__seg is-extra" />
      </div>
      <ul className="scale__legend">
        <li className="is-progress"><span className="mono">0–99</span> {t("primitives.scale.progress")}</li>
        <li className="is-mastered"><Check size={14} strokeWidth={2} aria-hidden="true" /><span className="mono">100</span> {t("primitives.scale.mastered")}</li>
        <li className="is-extra"><Star size={14} strokeWidth={2} aria-hidden="true" /><span className="mono">101–120</span> {t("primitives.scale.extra")}</li>
      </ul>
    </div>
  );
}
