// Background AI task HUD.
export default {
  region: "AI tasks",
  running: ({ n }) => `${n} AI task${n > 1 ? "s" : ""} running`,
  types: {
    evaluation: "Evaluation",
    pedagogicalHarness: "AI draft",
    fallback: "Task",
  },
  toastReady: "{type} ready: {label}",
  status: {
    failed: "Failed",
    ready: "{type} · ready",
    progress: "{type} · {n} chars",
    starting: "{type} · starting",
  },
  cancelTask: "Cancel task",
  dismiss: "Dismiss",
};
