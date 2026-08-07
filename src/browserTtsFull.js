import { buildLessonNarrationSegments } from "./ttsSegments.js";

export function buildBrowserSpeechSegments(node, context) {
  return buildLessonNarrationSegments(node, context);
}
