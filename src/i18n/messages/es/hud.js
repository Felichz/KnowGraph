// HUD de tareas de IA en background.
export default {
  region: "Tareas de IA",
  running: ({ n }) => `${n} tarea${n > 1 ? "s" : ""} de IA en curso`,
  types: {
    evaluation: "Evaluación",
    pedagogicalHarness: "Borrador con IA",
    fallback: "Tarea",
  },
  toastReady: "{type} lista: {label}",
  status: {
    failed: "Falló",
    ready: "{type} · lista",
    progress: "{type} · {n} car.",
    starting: "{type} · iniciando",
  },
  cancelTask: "Cancelar tarea",
  dismiss: "Descartar",
};
