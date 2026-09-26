import { useEffect, useRef } from "react";
import { registerEscape } from "../state/escStack.js";

// Registra un handler de Esc mientras `active` sea true. El handler devuelve false si no consume.
export function useEscape(handler, priority, active = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return undefined;
    return registerEscape((event) => ref.current(event), priority);
  }, [priority, active]);
}
