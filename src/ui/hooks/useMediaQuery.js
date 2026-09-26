import { useSyncExternalStore } from "react";

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (fn) => { const mql = window.matchMedia(query); mql.addEventListener("change", fn); return () => mql.removeEventListener("change", fn); },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const MOBILE = "(max-width: 47.99em)";
export const TABLET = "(min-width: 48em) and (max-width: 68.74em)";
export const DESKTOP = "(min-width: 68.75em)";
export const useIsMobile = () => useMediaQuery(MOBILE);
export const useIsDesktop = () => useMediaQuery(DESKTOP);
