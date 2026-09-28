import { buildLessonNarrationSegments } from "./ttsSegments.js";

export function buildBrowserSpeechSegments(node, context, locale = "es") {
  return buildLessonNarrationSegments(node, context, locale);
}
