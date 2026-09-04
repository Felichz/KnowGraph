import { useCallback, useEffect, useState } from "react";

export function useAudioNarrator() {
  const [speaking, setSpeaking] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [speed, setSpeed] = useState(1);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setActiveSectionId(null);
    }
  }, []);

  const playSection = useCallback((sectionId, text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Si ya se está reproduciendo este mismo fragmento, pausar/detener
    if (speaking && activeSectionId === sectionId) {
      stop();
      return;
    }

    window.speechSynthesis.cancel();

    if (!text || typeof text !== "string") return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = "es-ES";

    utterance.onstart = () => {
      setSpeaking(true);
      setActiveSectionId(sectionId);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setActiveSectionId(null);
    };

    utterance.onerror = (e) => {
      console.warn("TTS error:", e);
      setSpeaking(false);
      setActiveSectionId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [speaking, activeSectionId, speed, stop]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speaking,
    activeSectionId,
    speed,
    setSpeed,
    playSection,
    stop,
  };
}
