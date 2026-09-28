// Graph view: canvas, stage columns, nodes, overlays (reading panel, controls, legend).
export default {
  canvas: {
    roleDescription: "dependency map",
    label: ({ graph, stages, edges }) =>
      `Topological map of ${graph}: ${stages} ${stages === 1 ? "stage" : "stages"} and ${edges} ${edges === 1 ? "dependency" : "dependencies"}.`,
  },
  stage: {
    index: "STAGE {n}",
    start: "Starting point",
    count: ({ n }) => `${n} ${n === 1 ? "concept" : "concepts"}`,
  },
  node: {
    stage: "stage {stage}",
    title: "{label}. Stage {stage}. {score}",
  },
  inspect: {
    needs: "Needs",
    needsNone: "nothing, it's a starting point",
    unlocks: "Unlocks",
    unlocksNone: "no direct concepts",
    help: "Only the next step is shown. Hover over or select a concept to see its direct relationships.",
  },
  cycleWarning: "We found a cycle in the dependencies, so some arrows may appear out of order.",
  controls: {
    stage: "Stage {stage} of {total}",
    label: "Map controls",
    primary: "Go to next concept",
    fit: "Show the full map",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
  },
  legend: {
    label: "Legend",
    needs: "Needs",
    extra: "Extra",
    questionsRef: "{count}/110 reference questions",
  },
};
