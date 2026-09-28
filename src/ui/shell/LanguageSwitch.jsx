import { LOCALES } from "../../i18n/locale.js";
import { useLocale, useT } from "../../i18n/react.js";
import { Segmented } from "../primitives/Segmented.jsx";
import { actions } from "../state/useWorkspace.js";

// EN / ES switcher. `compact` renders a single toggle button (collapsed sidebar, mobile bar).
export function LanguageSwitch({ compact = false, size = "sm", className = "" }) {
  const t = useT();
  const locale = useLocale();
  if (compact) {
    const next = LOCALES.find((item) => item !== locale) ?? locale;
    const label = `${t("common.language.switchTo")}: ${t(`common.language.${next}`)}`;
    return (
      <button type="button" className={`icon-btn icon-btn--md lang-toggle mono ${className}`} aria-label={label}
        data-tip={label} data-tip-side="right" onClick={() => actions.setLocale(next)}>
        {t(`common.language.short.${locale}`)}
      </button>
    );
  }
  const options = LOCALES.map((value) => ({ value, label: t(`common.language.short.${value}`) }));
  return (
    <div className={`lang-switch ${className}`} data-tip={t("common.language.label")}>
      <Segmented label={t("common.language.label")} options={options} value={locale} onChange={actions.setLocale} size={size} />
    </div>
  );
}
