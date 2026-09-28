import { useT } from "../../i18n/react.js";
import { LanguageSwitch } from "../shell/LanguageSwitch.jsx";

// Idioma de la interfaz, del temario y de las respuestas de IA.
export function LanguageSection() {
  const t = useT();
  return (
    <section className="settings__section" aria-labelledby="settings-language">
      <h3 id="settings-language" className="settings__h">{t("common.language.label")}</h3>
      <p className="t2">{t("settings.language.hint")}</p>
      <LanguageSwitch />
    </section>
  );
}
