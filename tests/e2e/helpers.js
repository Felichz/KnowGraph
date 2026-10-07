import fs from "node:fs";
import { expect } from "@playwright/test";

// Shared helpers for the e2e specs (not a spec file: Playwright only collects *.spec.js).

export const LOCALE_KEY = "learning-workspace:locale";
export const PREFS_KEY = "learning-workspace:ui-prefs:v3";
export const REVIEW_KEY = "learning-workspace:review:v1:react";

export function readFixture(name) {
  return JSON.parse(fs.readFileSync(new URL(`../fixtures/${name}.json`, import.meta.url), "utf8"));
}

// Any uncaught browser exception fails the test.
export function failOnPageError(page) {
  page.on("pageerror", (err) => {
    throw new Error(`Uncaught browser exception: ${err.message}\n${err.stack}`);
  });
}

// Seeds IndexedDB ("learning-graph-ai" v3) with the attempts/drafts of a backup fixture and reloads.
// The page must already be on the app so the DB and its stores exist.
export async function seedFixture(page, name) {
  const backup = readFixture(name);
  await expect(page.locator(".app")).toBeVisible();
  await page.evaluate((learning) => new Promise((resolve, reject) => {
    const req = indexedDB.open("learning-graph-ai", 3);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(["attempts", "drafts"], "readwrite");
      for (const store of ["attempts", "drafts"]) {
        const os = tx.objectStore(store);
        os.clear();
        for (const item of learning[store] || []) os.put(item);
      }
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
  }), backup.learning);
  await page.reload();
}

// Server-sent events body as the AI gateway streams it.
export function sse(events) {
  return events.map(([name, data]) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`).join("");
}
