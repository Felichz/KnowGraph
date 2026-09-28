// Módulos de IA sin React: conexiones, respaldo, tareas en segundo plano (mensajes del HUD).
export default {
  providers: {
    storageDesktop: "La clave se guarda cifrada en este dispositivo.",
    storageSession: "La clave se conserva solo mientras esta pestaña permanezca abierta.",
    notReady: "La conexión debe tener endpoint, API key y modelo antes de usarse.",
    missingAll: "Completá endpoint, API key y modelo.",
    missingEndpointAndKey: "Completá endpoint y API key.",
  },
  backup: {
    invalid: "El archivo no es un respaldo válido de Learning Workspace.",
    saveFailed: "Error al guardar el archivo en disco.",
  },
  tasks: {
    harnessStarting: "Iniciando Harness Pedagógico...",
    generatingDraft: "🪄 Generando borrador inicial con IA...",
    judgingInitial: "⚖️ Evaluando calidad pedagógica inicial con Juez...",
    mastery: "✨ ¡Maestría pedagógica alcanzada ({score}/100)!",
    judgeScore: "⚖️ Juez asignó {score}/100 (Meta: 95+)",
    refining: "🪄 Refinando explicación según crítica del Juez (Iteración {iter}/{max})...",
    rejudging: "⚖️ Re-evaluando calidad pedagógica (Iteración {iter}/{max})...",
    judgeScoreIteration: "⚖️ Juez asignó {score}/100 en Iteración {iter} (Meta: 95+)",
    iterationLimit: "Límite de {max} iteraciones alcanzado (Puntaje: {score}/100)",
    harnessFailed: "No se pudo completar el perfeccionamiento pedagógico.",
    cancelledByUser: "Cancelado por el usuario",
    evaluating: "🧠 Evaluando tu explicación con IA...",
    evaluationDone: "Evaluación completada",
    evaluationCancelled: "Evaluación cancelada",
    evaluationFailed: "No se pudo completar la evaluación.",
  },
};
