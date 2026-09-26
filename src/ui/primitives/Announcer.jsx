import { useEffect, useState } from "react";

// Regiones vivas globales (design-spec F.4).
let setters = { polite: null, assertive: null };

export function announce(message, politeness = "polite") {
  const set = setters[politeness];
  if (!set) return;
  set("");
  requestAnimationFrame(() => set(message));
}

export function LiveAnnouncer() {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  useEffect(() => {
    setters = { polite: setPolite, assertive: setAssertive };
    return () => { setters = { polite: null, assertive: null }; };
  }, []);
  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{polite}</div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">{assertive}</div>
    </>
  );
}

export function SkipLink({ target, children }) {
  return (
    <a className="skip-link" href={`#${target}`} onClick={(event) => {
      event.preventDefault();
      const el = document.getElementById(target);
      el?.focus({ preventScroll: false });
    }}>{children}</a>
  );
}
