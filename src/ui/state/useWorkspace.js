import { useEffect, useSyncExternalStore } from "react";
import { actions, getState, subscribe } from "./workspaceStore.js";

export function useWorkspace(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(getState()), () => selector(getState()));
}

export function usePopstate() {
  useEffect(() => {
    const onPop = () => actions.applyLocation();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
}

export { actions };
