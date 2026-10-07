// Repaso espaciado (specs/006): SM-2 simplificado por días. Puro y sin dependencias para poder testearlo.
// Entrada guardada por concepto: { ease, interval (días), reps, due: "YYYY-MM-DD", last: "YYYY-MM-DD" }.
export const RATING = { again: 1, hard: 2, good: 3, easy: 4 };
const MIN_EASE = 1.3;

export function dayKey(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(day, n) {
  const [y, m, d] = day.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

export function schedule(prev, rating, today = dayKey()) {
  const ease0 = prev?.ease ?? 2.5;
  const reps0 = prev?.reps ?? 0;
  const int0 = prev?.interval ?? 0;
  let ease = ease0;
  let interval;
  let reps = reps0 + 1;
  if (rating <= RATING.again) { reps = 0; interval = 0; ease = ease0 - 0.2; }
  else if (rating === RATING.hard) { interval = Math.max(1, Math.round(int0 * 1.2)); ease = ease0 - 0.15; }
  else if (rating === RATING.good) interval = reps0 === 0 ? 1 : reps0 === 1 ? 3 : Math.round(int0 * ease0);
  else { interval = reps0 === 0 ? 3 : Math.round(int0 * ease0 * 1.3); ease = ease0 + 0.15; }
  ease = Math.max(MIN_EASE, Math.round(ease * 100) / 100);
  return { ease, interval, reps, due: addDays(today, interval), last: today };
}

// Pendiente hoy: vencida, o trabajada (borrador/intento) y nunca repasada.
export function isDue(entry, worked, today = dayKey()) {
  if (entry) return entry.due <= today;
  return Boolean(worked);
}

export function daysUntil(entry, today = dayKey()) {
  if (!entry) return 0;
  const [a, b] = [entry.due, today].map((s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); });
  return Math.round((a - b) / 86400000);
}
