// Theme: store (system default, saved choice, OS changes), pre-paint script in index.html and its CSP hash,
// and parity between the dark (tokens.css) and light (light.css) color tokens.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
};
const media = { matches: false, listeners: [], addEventListener(_type, fn) { this.listeners.push(fn); } };
globalThis.window = { matchMedia: () => media, addEventListener() {} };

const { THEME_STORAGE_KEY, THEME_COLOR, getThemeState, setThemePreference, toggleTheme, subscribeTheme } = await import("../../src/ui/theme/theme.js");

// System default (OS dark), following OS changes while there is no saved choice.
assert.equal(THEME_STORAGE_KEY, "knowgraph:theme");
assert.deepEqual(getThemeState(), { preference: "system", theme: "dark" });
const seen = [];
const unsubscribe = subscribeTheme((state) => seen.push(state.theme));
media.matches = true;
media.listeners.forEach((fn) => fn());
assert.deepEqual(getThemeState(), { preference: "system", theme: "light" });

// Explicit choice is saved and wins over the OS; invalid values fall back to the system.
setThemePreference("dark");
assert.equal(memory.get(THEME_STORAGE_KEY), "dark");
media.listeners.forEach((fn) => fn());
assert.deepEqual(getThemeState(), { preference: "dark", theme: "dark" });
toggleTheme();
assert.equal(memory.get(THEME_STORAGE_KEY), "light");
setThemePreference("system");
assert.equal(memory.has(THEME_STORAGE_KEY), false);
assert.deepEqual(getThemeState(), { preference: "system", theme: "light" });
unsubscribe();
assert.deepEqual(seen, ["light", "dark", "light", "light"]);

// index.html: the inline pre-paint script uses the same key and colors, and the CSP allows it by hash.
const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
assert.equal(inline.length, 1, "exactly one inline script (theme boot)");
const hash = createHash("sha256").update(inline[0]).digest("base64");
assert.ok(csp.includes(`'sha256-${hash}'`), `CSP script-src must include 'sha256-${hash}'`);
assert.ok(html.indexOf("Content-Security-Policy") < html.indexOf("<script>"), "boot script runs under the CSP");
assert.ok(inline[0].includes(`"${THEME_STORAGE_KEY}"`));
for (const color of Object.values(THEME_COLOR)) assert.ok(inline[0].includes(color) && html.includes(`background:${color}`));

// Every color token of the dark base has a light value (non-color tokens are shared).
const tokens = (file) => new Set([...readFileSync(new URL(`../../src/ui/theme/${file}`, import.meta.url), "utf8")
  .matchAll(/(--[\w-]+):\s*((?:#|rgba\()[^;]*|0 1px[^;]*|inset[^;]*)/g)].map((m) => m[1]));
const dark = tokens("tokens.css");
const light = tokens("light.css");
const missing = [...dark].filter((name) => !light.has(name) && !["--code-bg"].includes(name));
assert.deepEqual(missing, [], `light.css is missing: ${missing.join(", ")}`);
assert.match(readFileSync(new URL("../../src/ui/theme/tokens.css", import.meta.url), "utf8"), /--bg-app:#100E0C/);
assert.match(readFileSync(new URL("../../src/ui/theme/light.css", import.meta.url), "utf8"), /--bg-app:#F7F4EF/);

console.log("theme OK");
