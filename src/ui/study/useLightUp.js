import { useEffect, useRef, useState } from "react";
import { toast } from "../state/toastStore.js";

const DURATION = 2400;

// «La celda se enciende» (DESIGN v4 §8.1): cuando una evaluación lleva el concepto a 100+ con la sesión
// abierta, la celda de la cabecera se llena con un destello del color del área y se anuncia en un toast.
export function useLightUp(node, p, t) {
  const [lit, setLit] = useState(false);
  const was = useRef({ id: node.id, complete: p.isComplete });
  useEffect(() => {
    const before = was.current;
    was.current = { id: node.id, complete: p.isComplete };
    if (before.id !== node.id || before.complete || !p.isComplete) return undefined;
    setLit(true);
    toast({ tone: "success", message: t("study.session.mastered", { label: node.label }) });
    const timer = setTimeout(() => setLit(false), DURATION);
    return () => clearTimeout(timer);
  }, [node.id, node.label, p.isComplete, t]);
  return lit;
}
