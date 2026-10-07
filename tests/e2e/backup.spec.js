import fs from "node:fs";
import { test, expect } from "@playwright/test";
import { failOnPageError } from "./helpers.js";

const drawer = (page) => page.getByRole("dialog", { name: "Settings" });

async function openSettings(page) {
  await page.getByRole("complementary", { name: "Main navigation" }).getByRole("button", { name: /AI connections/ }).click();
  await expect(drawer(page)).toBeVisible();
  return drawer(page);
}

function validBackup() {
  return {
    app: "learning-workspace",
    kind: "state-backup",
    version: 1,
    exportedAt: "2026-09-04T00:00:00.000Z",
    secretsIncluded: false,
    learning: {
      attempts: [{
        id: "test_attempt_1", graphId: "react", nodeId: "state_updates", createdAt: "2026-09-04T00:00:00.000Z",
        evaluation: { score: 100, scoreScaleVersion: 3, coveragePercent: 100, rawScore: 85 },
      }],
      drafts: [],
      liveReviews: [],
      coachIterations: [],
    },
    providers: { version: 4, activeProfileId: null, profiles: [] },
  };
}

// User Stories 3/5: settings drawer (BYOK AI connections, language, theme) and local JSON backup.
test.describe("Settings, AI connections & backup", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react");
  });

  test("the settings drawer lists connections, language, theme and backup and closes with Escape", async ({ page }) => {
    const settings = await openSettings(page);
    await expect(settings.getByRole("heading", { level: 3 })).toHaveText(["AI connections", "Language", "Theme", "Backup"]);
    const active = settings.getByRole("radiogroup", { name: "Active connection" });
    await expect(active.getByRole("radio", { name: /Project gateway/ })).toBeChecked();
    await expect(settings.getByRole("button", { name: "Export" })).toBeVisible();
    await expect(settings.getByRole("button", { name: "Import…" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer(page)).toHaveCount(0);
  });

  test("'Add connection' opens the provider catalog with search and an editor", async ({ page }) => {
    const settings = await openSettings(page);
    await settings.getByRole("button", { name: "Add connection" }).click();
    const picker = page.getByRole("dialog", { name: "New connection" });
    await expect(picker).toContainText("OpenRouter");
    const search = picker.getByRole("textbox", { name: "Search providers" });
    await search.fill("ollama");
    await expect(picker.locator(".picker__item")).toHaveCount(1);
    await expect(picker.locator(".picker__item")).toContainText("Ollama");
    await search.fill("zzzz-no-provider");
    await expect(picker).toContainText("No providers match.");
    await search.fill("ollama");
    await picker.locator(".picker__item").click();

    const editor = page.getByRole("dialog", { name: /Ollama/ });
    await expect(editor.getByRole("button", { name: "Test" })).toBeVisible();
    await expect(editor.getByRole("button", { name: "Save and use" })).toBeVisible();
    await editor.getByRole("button", { name: "Back" }).click();
    await expect(drawer(page)).toBeVisible();
  });

  test("theme and language preferences apply from the drawer", async ({ page }) => {
    const settings = await openSettings(page);
    await settings.getByRole("radiogroup", { name: "Theme" }).getByRole("radio", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await settings.getByRole("radiogroup", { name: "Theme" }).getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await settings.getByRole("radio", { name: "ES", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("dialog", { name: "Ajustes" })).toBeVisible();
  });

  test("exports a JSON backup with the expected structure", async ({ page }) => {
    const settings = await openSettings(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      settings.getByRole("button", { name: "Export" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^learning-workspace-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const backup = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    expect(backup).toMatchObject({ app: "learning-workspace", kind: "state-backup", version: 1 });
    expect(Object.keys(backup.learning)).toEqual(expect.arrayContaining(["attempts", "drafts"]));
    await expect(page.locator(".toast", { hasText: "Backup downloaded." })).toBeVisible();
  });

  test("rejects an invalid backup and restores a valid one after confirmation", async ({ page }) => {
    const settings = await openSettings(page);
    const fileInput = settings.locator('input[type="file"]');

    await fileInput.setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ hello: "world" })) });
    await expect(settings).toContainText("This file is not a valid Learning Workspace backup.");

    await fileInput.setInputFiles({ name: "valid.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(validBackup())) });
    const confirm = page.getByRole("alertdialog", { name: "Restore this backup?" });
    await expect(confirm).toBeVisible();
    await expect(confirm.getByRole("button", { name: "Cancel" })).toBeFocused();

    // Cancelling keeps the current state.
    await confirm.getByRole("button", { name: "Cancel" }).click();
    await expect(confirm).toHaveCount(0);
    await fileInput.setInputFiles({ name: "valid.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(validBackup())) });
    await page.getByRole("alertdialog", { name: "Restore this backup?" }).getByRole("button", { name: "Restore" }).click();
    await expect(page.locator(".toast", { hasText: "Backup restored." })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer(page)).toHaveCount(0);
    await expect(page.locator(".hgrid__total")).toHaveText(/1\s*\/101 mastered/);
    await expect(page.locator('.hgrid__cell[data-node="state_updates"]')).toHaveAttribute("aria-label", /100\/120 · mastered/);
  });

  test("the command palette exposes the settings action", async ({ page }) => {
    await page.keyboard.press("Control+k");
    const palette = page.getByRole("dialog", { name: "Search" });
    await palette.getByRole("combobox").fill("backup");
    await palette.getByRole("option", { name: /Settings: AI connections, language, theme and backup/ }).click();
    await expect(palette).toHaveCount(0);
    await expect(drawer(page)).toBeVisible();
  });
});
