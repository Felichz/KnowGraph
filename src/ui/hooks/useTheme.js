import { useSyncExternalStore } from "react";
import { getThemeState, subscribeTheme } from "../theme/theme.js";

// { theme: "light" | "dark", preference: "light" | "dark" | "system" }
export function useTheme() {
  return useSyncExternalStore(subscribeTheme, getThemeState, getThemeState);
}
