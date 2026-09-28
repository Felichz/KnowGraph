import { useCallback, useSyncExternalStore } from "react";
import { getLocale, subscribeLocale } from "./locale.js";
import { translate } from "./translate.js";

export function useLocale() {
  return useSyncExternalStore(subscribeLocale, getLocale, getLocale);
}

// const t = useT(); t("shell.nav.map") / t("map.count", { n: 3 })
export function useT() {
  const locale = useLocale();
  return useCallback((key, params) => translate(locale, key, params), [locale]);
}
