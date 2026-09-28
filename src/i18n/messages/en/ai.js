// Non-React AI modules: provider settings, backup, background tasks (HUD messages).
export default {
  providers: {
    storageDesktop: "The key is stored encrypted on this device.",
    storageSession: "The key is kept only while this tab stays open.",
    notReady: "The connection needs an endpoint, API key and model before it can be used.",
    missingAll: "Fill in the endpoint, API key and model.",
    missingEndpointAndKey: "Fill in the endpoint and API key.",
  },
  backup: {
    invalid: "This file is not a valid Learning Workspace backup.",
    saveFailed: "Couldn't save the file to disk.",
  },
  tasks: {
    harnessStarting: "Starting the pedagogical harness...",
    generatingDraft: "🪄 Generating an initial draft with AI...",
    judgingInitial: "⚖️ Judge is scoring the initial teaching quality...",
    mastery: "✨ Teaching mastery reached ({score}/100)!",
    judgeScore: "⚖️ Judge scored {score}/100 (target: 95+)",
    refining: "🪄 Refining the explanation from the judge's critique (iteration {iter}/{max})...",
    rejudging: "⚖️ Re-scoring teaching quality (iteration {iter}/{max})...",
    judgeScoreIteration: "⚖️ Judge scored {score}/100 in iteration {iter} (target: 95+)",
    iterationLimit: "Reached the limit of {max} iterations (score: {score}/100)",
    harnessFailed: "Couldn't finish the pedagogical refinement.",
    cancelledByUser: "Cancelled by the user",
    evaluating: "🧠 Evaluating your explanation with AI...",
    evaluationDone: "Evaluation complete",
    evaluationCancelled: "Evaluation cancelled",
    evaluationFailed: "Couldn't complete the evaluation.",
  },
};
