import { getCategoryColor } from "../theme/categoryPalette.js";

// Punto de categoría 8px (DESIGN §8.2). La categoría siempre va con label visible junto al punto.
export function CategoryDot({ graph, cat, size = 8 }) {
  const color = getCategoryColor(graph.id, cat, graph.categories[cat]?.color);
  return <span className="cat-dot" aria-hidden="true" style={{ background: color, width: size, height: size }} />;
}

export function CategoryLabel({ graph, cat, className = "" }) {
  return (
    <span className={`cat-label ${className}`}>
      <CategoryDot graph={graph} cat={cat} />
      <span className="clamp-1">{graph.categories[cat]?.label ?? cat}</span>
    </span>
  );
}
