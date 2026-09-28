import { z } from "zod";
import { ErrorCodes, GatewayError } from "./errors.js";

// Language of every AI answer (mentor, paraphrase coaching, evaluation feedback).
// Requests without the field come from clients that predate it and keep the original Spanish behavior.
export const SUPPORTED_LOCALES = Object.freeze(["en", "es"]);
export const LEGACY_LOCALE = "es";
export const LocaleZod = z.enum(SUPPORTED_LOCALES).default(LEGACY_LOCALE);

export function parseLocale(value) {
  const result = LocaleZod.safeParse(value ?? undefined);
  if (!result.success) {
    throw new GatewayError(ErrorCodes.BAD_REQUEST, `locale must be one of: ${SUPPORTED_LOCALES.join(", ")}`);
  }
  return result.data;
}

export function resolveLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : LEGACY_LOCALE;
}

// Labels of the user messages sent to the model, plus short gateway texts shown in the UI.
const TEXT = {
  es: {
    conceptTitle: "TÍTULO DEL CONCEPTO",
    level: "NIVEL / AUDIENCIA",
    essentialSummary: "RESUMEN ESENCIAL",
    why: "POR QUÉ IMPORTA",
    explanation: "EXPLICACIÓN DETALLADA / MODELO MENTAL",
    codeBlock: "BLOQUE DE CÓDIGO / EJEMPLO FORMAL",
    steps: "PRINCIPIOS CLAVE / PASOS",
    pitfalls: "ERRORES COMUNES / SÍNTOMAS Y TRADE-OFFS",
    takeaway: "IDEA PARA RECORDAR / REGLA PRÁCTICA",
    table: "TABLA COMPARATIVA",
    applicationPrompt: "CONSIGNA DE APLICACIÓN",
    docNotes: "NOTAS DE DOCUMENTACIÓN",
    concept: "CONCEPTO",
    topicFallback: "Tema",
    currentDraft: "BORRADOR ACTUAL DEL ESTUDIANTE",
    focusToIntegrate: "FOCO ESPECÍFICO A INTEGRAR (HINT DEL COACH)",
    focusLabel: "- Foco:",
    focusDetail: "- Explicación del foco:",
    canonicalSummary: "RESUMEN CANÓNICO DE REFERENCIA",
    referenceCode: "CÓDIGO DE REFERENCIA",
    closingRule: "REGLA DE CIERRE RECOMENDADA",
    roleCoach: "COACH",
    roleStudent: "ESTUDIANTE",
    message: "Mensaje",
    chat: "CONVERSACIÓN DEL CHAT CON EL COACH (Dudas, aclaraciones y explicaciones)",
    noMessages: "Sin mensajes en el chat",
    technicalConcept: "CONCEPTO TÉCNICO",
    goldenRuleClosing: "REGLA DE ORO / CIERRE",
    previousDraft: "BORRADOR PREVIO (Transformalo con verdadera maestría didáctica desarmando cualquier jerga pesada o estructura rígida)",
    conceptToJudge: "CONCEPTO A EVALUAR",
    explanationToJudge: "EXPLICACIÓN DEL ESTUDIANTE A JUZGAR",
    whyUseCase: "POR QUÉ IMPORTA / CASO DE USO",
    expectedCode: "CÓDIGO / EJEMPLO ESPERADO",
    canonicalRule: "REGLA DE ORO CANÓNICA",
    currentScore: (score) => `PUNTAJE PEDAGÓGICO ACTUAL: ${score}/100 (Meta: >= 95)`,
    judgeCritique: "CRÍTICA CONCRETA DEL JUEZ PEDAGÓGICO (SUBSANAR CADA PUNTO)",
    critiqueFallbackLine: "- Mejorar la fluidez, intuición y desglose progresivo del texto.",
    draftToRefine: "BORRADOR ACTUAL A PERFECCIONAR",
    conceptSummary: "RESUMEN ESENCIAL DEL CONCEPTO",
    finalRule: "REGLA PRÁCTICA FINAL",
    rubricAlreadyScored: "Rubrica ya calculada (no la modifiques):",
    coachContext: "CONTEXTO FIJO DE ESTA ITERACIÓN (JSON):",
    harnessGenerating: "Generando borrador inicial con IA...",
    harnessJudging: "⚖️ Evaluando calidad pedagógica inicial con Juez...",
    harnessRefining: (iteration, max) => `🪄 Refinando explicación según crítica del Juez (Iteración ${iteration}/${max})...`,
    harnessRejudging: (iteration) => `⚖️ Re-evaluando calidad con Juez (Iteración ${iteration})...`,
    cancelledByUser: "Cancelado por el usuario",
    judgeCompleted: "Evaluación completada",
    judgeCritiqueFallback: "Mejorar la fluidez y claridad general.",
    judgeMastery: "Maestría pedagógica alcanzada",
    judgeNeedsRefinement: "Requiere refinamiento",
  },
  en: {
    conceptTitle: "CONCEPT TITLE",
    level: "LEVEL / AUDIENCE",
    essentialSummary: "ESSENTIAL SUMMARY",
    why: "WHY IT MATTERS",
    explanation: "DETAILED EXPLANATION / MENTAL MODEL",
    codeBlock: "CODE BLOCK / FORMAL EXAMPLE",
    steps: "KEY PRINCIPLES / STEPS",
    pitfalls: "COMMON MISTAKES / SYMPTOMS AND TRADE-OFFS",
    takeaway: "KEY IDEA / RULE OF THUMB",
    table: "COMPARISON TABLE",
    applicationPrompt: "APPLICATION PROMPT",
    docNotes: "DOCUMENTATION NOTES",
    concept: "CONCEPT",
    topicFallback: "Topic",
    currentDraft: "STUDENT'S CURRENT DRAFT",
    focusToIntegrate: "SPECIFIC FOCUS TO INTEGRATE (COACH HINT)",
    focusLabel: "- Focus:",
    focusDetail: "- Focus explanation:",
    canonicalSummary: "CANONICAL REFERENCE SUMMARY",
    referenceCode: "REFERENCE CODE",
    closingRule: "RECOMMENDED CLOSING RULE",
    roleCoach: "COACH",
    roleStudent: "STUDENT",
    message: "Message",
    chat: "CHAT CONVERSATION WITH THE COACH (questions, clarifications and explanations)",
    noMessages: "No chat messages",
    technicalConcept: "TECHNICAL CONCEPT",
    goldenRuleClosing: "GOLDEN RULE / CLOSING",
    previousDraft: "PREVIOUS DRAFT (Rework it with real teaching craft, unpacking any heavy jargon or rigid structure)",
    conceptToJudge: "CONCEPT TO EVALUATE",
    explanationToJudge: "STUDENT EXPLANATION TO JUDGE",
    whyUseCase: "WHY IT MATTERS / USE CASE",
    expectedCode: "EXPECTED CODE / EXAMPLE",
    canonicalRule: "CANONICAL GOLDEN RULE",
    currentScore: (score) => `CURRENT TEACHING SCORE: ${score}/100 (Target: >= 95)`,
    judgeCritique: "SPECIFIC CRITIQUE FROM THE TEACHING JUDGE (ADDRESS EVERY POINT)",
    critiqueFallbackLine: "- Improve the flow, intuition and step-by-step breakdown of the text.",
    draftToRefine: "CURRENT DRAFT TO REFINE",
    conceptSummary: "ESSENTIAL SUMMARY OF THE CONCEPT",
    finalRule: "FINAL RULE OF THUMB",
    rubricAlreadyScored: "Rubric already computed (do not change it):",
    coachContext: "FIXED CONTEXT FOR THIS ITERATION (JSON):",
    harnessGenerating: "Generating the initial draft with AI...",
    harnessJudging: "⚖️ Judging the initial teaching quality...",
    harnessRefining: (iteration, max) => `🪄 Refining the explanation from the judge's critique (iteration ${iteration}/${max})...`,
    harnessRejudging: (iteration) => `⚖️ Judging the quality again (iteration ${iteration})...`,
    cancelledByUser: "Cancelled by the user",
    judgeCompleted: "Evaluation completed",
    judgeCritiqueFallback: "Improve the overall flow and clarity.",
    judgeMastery: "Teaching mastery reached",
    judgeNeedsRefinement: "Needs refinement",
  },
};

export function serverText(locale) {
  return TEXT[resolveLocale(locale)];
}
