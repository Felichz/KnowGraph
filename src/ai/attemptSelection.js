import { getScoreView } from "./types.js";

export const RECENCY_SCORE_TOLERANCE = 5;

function attemptTime(attempt) {
  const time = Date.parse(attempt?.createdAt ?? "");
  return Number.isFinite(time) ? time : 0;
}

function attemptScore(attempt) {
  return getScoreView(attempt?.evaluation)?.displayScore ?? 0;
}

/**
 * El intento representativo de una card no es siempre el máximo histórico.
 * Si el último intento está a cinco puntos o menos del máximo, lo preferimos:
 * refleja mejor el estado actual y evita que una pequeña variación del modelo
 * haga parecer vigente una respuesta vieja.
 */
export function selectRepresentativeAttempt(attempts, tolerance = RECENCY_SCORE_TOLERANCE) {
  if (!attempts?.length) return null;

  const newest = attempts.reduce((candidate, attempt) => (
    !candidate || attemptTime(attempt) > attemptTime(candidate) ? attempt : candidate
  ), null);
  const best = attempts.reduce((candidate, attempt) => (
    !candidate || attemptScore(attempt) > attemptScore(candidate) ||
      (attemptScore(attempt) === attemptScore(candidate) && attemptTime(attempt) > attemptTime(candidate))
      ? attempt
      : candidate
  ), null);

  return attemptScore(best) - attemptScore(newest) <= tolerance ? newest : best;
}

