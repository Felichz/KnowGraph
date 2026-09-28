import { Moon, Sun } from "lucide-react";
import { IconButton } from "../primitives/Button.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { toggleTheme } from "../theme/theme.js";
import { useT } from "../../i18n/react.js";

// Light / dark toggle next to the language switcher. The icon shows the theme you switch to.
export function ThemeToggle({ size = "sm", className = "", tipSide }) {
  const t = useT();
  const { theme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <IconButton icon={next === "light" ? Sun : Moon} label={t(`common.theme.switchTo.${next}`)} size={size}
      className={`theme-toggle ${className}`} data-tip-side={tipSide} data-theme-toggle={next} onClick={toggleTheme} />
  );
}
