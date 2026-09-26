import { useEffect, useState } from "react";
import { loadProviderProfile } from "../../ai/providerSettings.js";

export const PROVIDER_EVENT = "lw:provider-changed";

export function notifyProviderChanged() { window.dispatchEvent(new Event(PROVIDER_EVENT)); }

// Etiqueta de la conexión de IA activa ("Gateway" si no hay una personal).
export function useProviderProfile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = () => loadProviderProfile().then((value) => { if (alive) setProfile(value ?? null); }).catch(() => {});
    load();
    window.addEventListener(PROVIDER_EVENT, load);
    return () => { alive = false; window.removeEventListener(PROVIDER_EVENT, load); };
  }, []);
  return profile;
}

export function useProviderLabel() {
  const profile = useProviderProfile();
  return profile?.label || "Gateway";
}
