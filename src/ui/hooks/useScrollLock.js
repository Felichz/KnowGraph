import { useEffect } from "react";

// Bloquea el scroll de los contenedores de fondo (design-spec D.3) con un contador global.
let locks = 0;
function apply() {
  document.documentElement.dataset.scrollLocked = locks > 0 ? "true" : "false";
}

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    locks += 1;
    apply();
    return () => {
      locks = Math.max(0, locks - 1);
      apply();
    };
  }, [active]);
}
