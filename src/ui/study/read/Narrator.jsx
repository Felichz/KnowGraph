import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { IconButton } from "../../primitives/Button.jsx";
import { actions, useWorkspace } from "../../state/useWorkspace.js";

const SPEEDS = [0.85, 1, 1.25, 1.5];
const strip = (text = "") => String(text).replace(/```[\s\S]*?```/g, " ").replace(/[`*_#>]/g, "");

export function lessonSpeechText(node) {
  const l = node.lesson ?? {};
  return [node.label, l.summary, l.why, l.explanation, ...(l.steps ?? []), ...(l.pitfalls ?? []), l.takeaway].filter(Boolean).map(strip).join(". ");
}

// Lectura por voz de la lección (Web Speech API). Velocidad persistida en prefs.
export function Narrator({ text }) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const speed = useWorkspace((s) => s.prefs.readingSpeed ?? 1);
  const [state, setState] = useState("idle"); // idle | playing | paused
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);
  if (!supported) return null;

  const play = () => {
    const synth = window.speechSynthesis;
    if (state === "paused") { synth.resume(); setState("playing"); return; }
    if (state === "playing") { synth.pause(); setState("paused"); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-AR"; u.rate = speed;
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    synth.speak(u);
    setState("playing");
  };
  const stop = () => { window.speechSynthesis.cancel(); setState("idle"); };
  const cycle = () => actions.setPref("readingSpeed", SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] ?? 1);

  return (
    <div className="narrator" role="group" aria-label="Lectura en voz alta">
      <IconButton icon={state === "playing" ? Pause : Play} label={state === "playing" ? "Pausar lectura" : state === "paused" ? "Reanudar lectura" : "Leer en voz alta"} onClick={play} />
      {state !== "idle" && <IconButton icon={Square} label="Detener lectura" onClick={stop} />}
      <button type="button" className="narrator__speed mono" onClick={cycle} aria-label={`Velocidad ${speed}x. Cambiar`}>{speed}×</button>
    </div>
  );
}
