import { useCallback, useEffect, useRef, useState } from "react";
import { getDraft, listAttempts, saveAttempt, setDraft } from "../ai/learningStore.js";

export function useStudySession(graphId, node) {
  const nodeId = node?.id;
  const [stage, setStage] = useState("read"); // "read" | "learn" | "paraphrase" | "evaluate"
  const [draft, setDraftText] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef(null);

  // Cargar borrador e historial de intentos de IndexedDB
  useEffect(() => {
    if (!graphId || !nodeId) return;

    let active = true;
    setLoading(true);

    Promise.all([
      getDraft(graphId, nodeId),
      listAttempts(graphId, nodeId),
    ])
      .then(([savedDraft, savedAttempts]) => {
        if (!active) return;
        setDraftText(savedDraft || "");
        setAttempts(savedAttempts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar sesión de estudio:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [graphId, nodeId]);

  // Guardado automático del borrador en IndexedDB con debounce
  const updateDraft = useCallback((text) => {
    setDraftText(text);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (!graphId || !nodeId) return;

    saveTimeoutRef.current = setTimeout(() => {
      setDraft(graphId, nodeId, text).catch(console.error);
    }, 600);
  }, [graphId, nodeId]);

  // Guardar intento completado
  const recordAttempt = useCallback(async (attemptData) => {
    if (!graphId || !nodeId) return;
    await saveAttempt(attemptData);
    const updated = await listAttempts(graphId, nodeId);
    setAttempts(updated || []);
  }, [graphId, nodeId]);

  const latestAttempt = attempts[attempts.length - 1] ?? null;

  return {
    stage,
    setStage,
    draft,
    updateDraft,
    attempts,
    latestAttempt,
    loading,
    recordAttempt,
  };
}
