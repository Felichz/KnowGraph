import { createLearningController, getGraph, listGraphs } from "./logic/index.js";

// Este entrypoint es deliberadamente headless. La app visual que consuma la
// API puede montarse en React, otra librería o una integración embebida.
export { createLearningController, getGraph, listGraphs };

if (typeof window !== "undefined") {
  window.learningGraphApi = { createLearningController, getGraph, listGraphs };
}
