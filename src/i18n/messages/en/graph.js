// Graph view: full stage map, semantic zoom, prerequisite chain and the selected-concept panel.
export default {
  canvas: {
    roleDescription: "dependency map",
    label: ({ graph, stages, edges }) =>
      `Dependency map of ${graph}: ${stages} ${stages === 1 ? "stage" : "stages"} and ${edges} ${edges === 1 ? "dependency" : "dependencies"}. Arrow keys move between concepts, Enter opens one.`,
  },
  node: { stage: "stage {stage}" },
  status: {
    extra: "extra depth, {score} of 120",
    mastered: "mastered",
    progress: "in progress, {score} of 120",
    available: "ready to study",
    blocked: ({ n }) => `needs ${n} ${n === 1 ? "prerequisite" : "prerequisites"}`,
  },
  ruler: { stage: "Stage" },
  minimap: {
    title: "Whole map",
    mastered: "{done}/{total}",
    label: ({ done, total }) => `Whole map: ${done} of ${total} concepts mastered. Click or drag to move the view.`,
  },
  cycleWarning: "We found a cycle in the dependencies, so some arrows may appear out of order.",
  controls: {
    label: "Map controls",
    bestNext: "Go to best next",
    fit: "Show the whole map",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
  },
  legend: {
    label: "Legend",
    mastered: "Mastered (100+)",
    extra: "Extra depth",
    available: "Ready",
    blocked: "Needs prerequisites",
    best: "Best next",
    chain: "Prerequisite chain",
    unlocks: "Unlocks",
    hint: "Scroll to zoom, drag to move. Zoom in to read titles; double-click to study.",
  },
  panel: {
    label: "Selected concept",
    stage: "Stage {n} of {total}",
    whyNow: "Why now",
    needs: "Needs",
    needsNone: "Nothing. It's a starting point.",
    unlocks: "Unlocks",
    unlocksNone: "No other concept depends on it.",
    study: "Study now",
    backToBest: "Back to best next",
    outOfFocus: "outside this focus",
  },
};
