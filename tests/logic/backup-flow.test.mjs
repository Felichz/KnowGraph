import test from "node:test";
import assert from "node:assert/strict";
import { parseBackup, downloadBackup } from "../../src/ai/backup.js";
import { setLocale } from "../../src/i18n/locale.js";

test("parseBackup validates structure correctly", () => {
  const validJson = JSON.stringify({
    app: "learning-workspace",
    kind: "state-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    secretsIncluded: false,
    learning: { attempts: [] },
    providers: { profiles: [] }
  });

  const parsed = parseBackup(validJson);
  assert.equal(parsed.app, "learning-workspace");
  assert.equal(parsed.kind, "state-backup");
  assert.equal(parsed.version, 1);

  assert.throws(() => parseBackup("not-json"), /JSON/);
  assert.throws(() => parseBackup(JSON.stringify({ app: "other-app" })), /not a valid Learning Workspace backup/);
  setLocale("es");
  try {
    assert.throws(() => parseBackup(JSON.stringify({ app: "other-app" })), /El archivo no es un respaldo válido/);
  } finally {
    setLocale("en");
  }
});

test("downloadBackup invokes native desktop save API when running in Electron", async () => {
  let saveCalled = false;
  let receivedContent = null;
  let receivedFilename = null;

  globalThis.window = {
    learningDesktop: {
      backup: {
        save: async (content, defaultFilename) => {
          saveCalled = true;
          receivedContent = content;
          receivedFilename = defaultFilename;
          return { success: true, filePath: "/tmp/backup.json" };
        }
      }
    }
  };

  const mockBackup = {
    app: "learning-workspace",
    kind: "state-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    secretsIncluded: false,
    learning: { attempts: [] },
    providers: { profiles: [] }
  };

  await downloadBackup(mockBackup);
  assert.equal(saveCalled, true);
  assert.ok(receivedFilename.startsWith("learning-workspace-backup-"));
  assert.ok(receivedContent.includes('"app": "learning-workspace"'));
});

test("downloadBackup falls back to browser DOM anchor when not in Electron", async () => {
  let appendedAnchor = null;
  let clicked = false;

  globalThis.window = {}; // No learningDesktop
  globalThis.document = {
    createElement(tag) {
      return {
        style: {},
        href: "",
        download: "",
        click() { clicked = true; }
      };
    },
    body: {
      appendChild(node) { appendedAnchor = node; },
      removeChild(node) {}
    }
  };
  globalThis.URL = {
    createObjectURL(blob) { return "blob:mock-url"; },
    revokeObjectURL(url) {}
  };

  const mockBackup = {
    app: "learning-workspace",
    kind: "state-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    secretsIncluded: false,
    learning: {},
    providers: {}
  };

  await downloadBackup(mockBackup);
  assert.equal(clicked, true);
  assert.ok(appendedAnchor);
  assert.equal(appendedAnchor.href, "blob:mock-url");
});
