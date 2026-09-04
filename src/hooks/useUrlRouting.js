import { useEffect } from "react";

export function parseAppPath(pathname = "/") {
  const match = pathname.match(/^\/(react|rails)(?:\/card\/([a-zA-Z0-9_-]+))?/);
  if (!match) return { graphId: "react", nodeId: null };
  return {
    graphId: match[1] || "react",
    nodeId: match[2] || null,
  };
}

export function buildAppPath(graphId = "react", nodeId = null) {
  if (nodeId) return `/${graphId}/card/${nodeId}`;
  return `/${graphId}`;
}

export function useUrlRouting({ activeGraphId, modalNodeId, onApplyRoute }) {
  // Sincronizar ruta inicial en mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = parseAppPath(window.location.pathname);
    if (initial.graphId || initial.nodeId) {
      onApplyRoute?.(initial);
    }

    const handlePopState = () => {
      const current = parseAppPath(window.location.pathname);
      onApplyRoute?.(current);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onApplyRoute]);

  // Sincronizar cambios de estado hacia la URL (pushState)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targetPath = buildAppPath(activeGraphId, modalNodeId);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [activeGraphId, modalNodeId]);
}
