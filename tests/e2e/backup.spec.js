import { test, expect } from "@playwright/test";
import fs from "node:fs";

const SESSION_KEY = "learning-workspace:provider-connections:v4";

test.describe("backup de estado e2e", () => {
  test("exporta sin API keys, valida imports y expone acciones en la paleta", async ({ page }) => {
    const dialogs = [];
    page.on("dialog", (dialog) => {
      dialogs.push({ type: dialog.type(), message: dialog.message() });
      dialog.accept();
    });

    await page.goto("/");
    await page.waitForSelector(".workspace-provider-toggle", { timeout: 15_000 });

    await page.evaluate((key) => {
      localStorage.setItem(key, JSON.stringify({
        version: 4,
        activeProfileId: null,
        profiles: [{
          id: "provider_custom_p1",
          label: "Endpoint propio",
          adapter: "custom",
          catalogProvider: null,
          baseUrl: "http://127.0.0.1:31415/v1",
          apiKey: "SECRET_KEY_123",
          model: "free-model",
        }],
      }));
    }, SESSION_KEY);

    await page.locator(".progress-block").click();
    await page.waitForSelector(".backup-data", { timeout: 10_000 });
    await expect(page.locator(".backup-data__actions")).toContainText("Exportar respaldo");
    await expect(page.locator(".backup-data__actions")).toContainText("Importar respaldo");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Exportar respaldo" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^learning-workspace-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const backupPath = await download.path();
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

    expect(backup.app).toBe("learning-workspace");
    expect(backup.kind).toBe("state-backup");
    expect(backup.version).toBe(1);
    expect(backup.secretsIncluded).toBe(true);
    expect(Object.keys(backup.learning)).toEqual(["attempts", "drafts", "liveReviews", "coachIterations"]);
    expect(backup.providers.profiles[0].label).toBe("Endpoint propio");
    expect(backup.providers.profiles[0].apiKey).toBe("SECRET_KEY_123");
    expect(JSON.stringify(backup)).toContain("SECRET_KEY_123");

    await page.keyboard.press("Control+k");
    await page.locator(".command-palette__input").fill("respaldo");
    await expect(page.locator(".command-palette__item--action")).toHaveCount(2);
    await expect(page.locator(".command-palette")).toContainText("Exportar respaldo");
    await expect(page.locator(".command-palette")).toContainText("Importar respaldo");
    await page.keyboard.press("Escape");

    const invalidFile = { hello: "mundo" };
    await page.locator("input[type=file]").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(invalidFile)),
    });
    await expect.poll(() => dialogs.filter((d) => d.type === "alert").length).toBe(1);
    expect(dialogs.at(-1).message).toContain("No se pudo importar el respaldo");

    const validBackup = {
      app: "learning-workspace",
      kind: "state-backup",
      version: 1,
      exportedAt: "2026-08-16T00:00:00.000Z",
      secretsIncluded: false,
      learning: {
        attempts: [{ id: "a1", graphId: "react", nodeId: "state", createdAt: "2026-08-01T00:00:00.000Z" }],
        drafts: [],
        liveReviews: [],
        coachIterations: [],
      },
      providers: { version: 4, activeProfileId: null, profiles: [] },
    };
    await page.locator("input[type=file]").setInputFiles({
      name: "valid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(validBackup)),
    });

    await expect.poll(() => dialogs.filter((d) => d.type === "confirm").length).toBe(1);
    expect(dialogs.at(-1).message).toContain("reemplazará");
    await page.waitForLoadState("load");
    await page.waitForSelector(".workspace-provider-toggle", { timeout: 15_000 });
  });
});