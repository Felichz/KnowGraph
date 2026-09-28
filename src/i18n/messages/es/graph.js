// Vista Grafo: lienzo, columnas de etapa, nodos y overlays (lectura, controles, leyenda).
export default {
  canvas: {
    roleDescription: "mapa de dependencias",
    label: ({ graph, stages, edges }) => `Mapa topológico de ${graph}. ${stages} etapas y ${edges} dependencias.`,
  },
  stage: {
    index: "ETAPA {n}",
    start: "Punto de partida",
    count: ({ n }) => `${n} conceptos`,
  },
  node: {
    stage: "etapa {stage}",
    title: "{label}. Etapa {stage}. {score}",
  },
  inspect: {
    needs: "Necesita",
    needsNone: "nada: es punto de partida",
    unlocks: "Habilita",
    unlocksNone: "ningún concepto directo",
    help: "Mostramos solo el próximo avance. Pasá por un nodo o seleccionalo para ver sus relaciones directas.",
  },
  cycleWarning: "Detectamos un ciclo en las dependencias; algunas flechas pueden verse fuera de orden.",
  controls: {
    stage: "Etapa {stage} de {total}",
    label: "Controles del mapa",
    primary: "Próximo foco",
    fit: "Ver el mapa completo",
    zoomOut: "Alejar",
    zoomIn: "Acercar",
  },
  legend: {
    label: "Leyenda",
    needs: "Necesita",
    extra: "Extra",
    questionsRef: "{count}/110 preguntas de referencia",
  },
};
