import { Monitor, Moon, Sun } from "lucide-react";
import { Segmented } from "../primitives/Segmented.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { setThemePreference } from "../theme/theme.js";
import { useT } from "../../i18n/react.js";

const OPTIONS = [{ value: "system", icon: Monitor }, { value: "light", icon: Sun }, { value: "dark", icon: Moon }];

// Tema: sistema (por defecto), claro u oscuro. Se guarda en este dispositivo.
export function ThemeSection() {
  const t = useT();
  const { preference } = useTheme();
  const options = OPTIONS.map((option) => ({ ...option, label: t(`common.theme.${option.value}`) }));
  return (
    <section className="settings__section" aria-labelledby="settings-theme">
      <h3 id="settings-theme" className="settings__h">{t("common.theme.label")}</h3>
      <p className="t2">{t("settings.theme.hint")}</p>
      <div><Segmented label={t("common.theme.label")} options={options} value={preference} onChange={setThemePreference} size="sm" /></div>
    </section>
  );
}
