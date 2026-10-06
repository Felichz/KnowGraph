import { heatLevel, scoreTier } from "../../logic/studyQueue.js";
import { getCategoryColor } from "../theme/categoryPalette.js";

// Celda de calor (DESIGN v4 §8.1): cuadrado del color del área, más lleno cuanto más dominado.
// Decorativa por defecto; quien la usa como control aporta el nombre accesible.
export function HeatCell({ graph, node, p, now = false, size, className = "" }) {
  const extra = scoreTier(p) === "extra";
  return (
    <span aria-hidden="true" className={`heat h${heatLevel(p)} ${extra ? "is-extra" : ""} ${now ? "is-now" : ""} ${className}`}
      style={{ "--area": getCategoryColor(graph.id, node.cat), ...(size ? { "--cell": `${size}px` } : null) }} />
  );
}
