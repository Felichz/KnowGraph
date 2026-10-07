import assert from "node:assert/strict";
import { RATING, addDays, daysUntil, isDue, schedule } from "../../src/logic/spacedRepetition.js";

const today = "2026-10-06";
assert.equal(addDays(today, 30), "2026-11-05", "adds days across months");

const g1 = schedule(null, RATING.good, today);
assert.deepEqual([g1.interval, g1.reps, g1.due], [1, 1, "2026-10-07"], "first good → tomorrow");
const g2 = schedule(g1, RATING.good, g1.due);
assert.equal(g2.interval, 3, "second good → 3 days");
const g3 = schedule(g2, RATING.good, g2.due);
assert.equal(g3.interval, Math.round(3 * 2.5), "then grows by ease");

const again = schedule(g3, RATING.again, today);
assert.deepEqual([again.interval, again.reps, again.due], [0, 0, today], "again resets and stays due today");
assert.ok(again.ease < g3.ease, "again lowers ease");
assert.ok(schedule(null, RATING.easy, today).interval > g1.interval, "easy spaces more than good");
let e = null; for (let i = 0; i < 20; i += 1) e = schedule(e, RATING.again, today);
assert.equal(e.ease, 1.3, "ease never drops below 1.3");

assert.equal(isDue(null, true, today), true, "worked but never reviewed is due");
assert.equal(isDue(null, false, today), false, "untouched card is not due");
assert.equal(isDue(g1, true, today), false, "scheduled for tomorrow is not due today");
assert.equal(isDue(g1, true, "2026-10-08"), true, "overdue is due");
assert.equal(daysUntil(g2, today), 4, "days until next review");
console.log("spaced repetition: OK");
