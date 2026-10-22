// Vista Grafo: mapa completo por etapas, zoom semántico, cadena de prerrequisitos y panel del concepto.
export default {
  canvas: {
    roleDescription: "mapa de dependencias",
    label: ({ graph, stages, edges }) =>
      `Mapa de dependencias de ${graph}: ${stages} etapas y ${edges} dependencias. Las flechas del teclado mueven entre conceptos y Enter abre uno.`,
  },
  node: { stage: "etapa {stage}" },
  status: {
    extra: "profundidad extra, {score} de 120",
    mastered: "dominada",
    progress: "en curso, {score} de 120",
    available: "lista para estudiar",
    blocked: ({ n }) => `necesita ${n} ${n === 1 ? "prerrequisito" : "prerrequisitos"}`,
  },
  ruler: { stage: "Etapa" },
  minimap: {
    title: "Mapa completo",
    mastered: "{done}/{total}",
    label: ({ done, total }) => `Mapa completo: ${done} de ${total} conceptos dominados. Pulsa o arrastra para mover la vista.`,
  },
  cycleWarning: "Encontramos un ciclo en las dependencias, así que algunas flechas pueden aparecer fuera de orden.",
  controls: {
    label: "Controles del mapa",
    bestNext: "Ir al mejor siguiente",
    fit: "Ver el mapa completo",
    zoomOut: "Alejar",
    zoomIn: "Acercar",
  },
  legend: {
    label: "Leyenda",
    mastered: "Dominada (100+)",
    extra: "Profundidad extra",
    available: "Lista",
    blocked: "Necesita prerrequisitos",
    best: "Mejor siguiente",
    chain: "Cadena de prerrequisitos",
    unlocks: "Desbloquea",
    hint: "Rueda para hacer zoom, arrastra para moverte. Acerca para leer títulos; doble clic para estudiar.",
  },
  panel: {
    label: "Concepto seleccionado",
    stage: "Etapa {n} de {total}",
    whyNow: "Por qué ahora",
    needs: "Necesita",
    needsNone: "Nada. Es un punto de partida.",
    unlocks: "Desbloquea",
    unlocksNone: "Ningún otro concepto depende de él.",
    study: "Estudiar ahora",
    backToBest: "Volver al mejor siguiente",
    outOfFocus: "fuera de este foco",
  },
};
