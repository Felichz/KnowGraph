import { test, expect } from "@playwright/test";

// These specs assert the Spanish interface: English is the default, so select Spanish first
// (tests/e2e/i18n.spec.js covers the English default and the switcher).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("learning-workspace:locale", "es"));
});
import fs from "node:fs";

test.describe("Backup & BYOK Provider Settings (User Story 3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("abre el modal de configuración BYOK (⚙️ IA / LLM) y permite gestionar conexiones", async ({ page }) => {
    const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    // Modal de ajustes debe abrirse
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Proveedores de IA y Respaldo");
    await expect(modal).toContainText("OpenRouter");
    await expect(modal).toContainText("OpenAI");
    await expect(modal).toContainText("Ollama");

    // Botones de acción del proveedor
    await expect(modal.getByRole("button", { name: "Probar conexión" })).toBeVisible();
    await expect(modal.getByRole("button", { name: "Guardar y Activar" })).toBeVisible();

    // Cerrar con Escape
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("exporta respaldo JSON y valida su estructura", async ({ page }) => {
    const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
    await settingsBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("DATOS Y RESPALDO LOCAL");

    const exportBtn = modal.getByRole("button", { name: /Exportar respaldo JSON/ });
    await expect(exportBtn).toBeVisible();

    // Capturar descarga
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      exportBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^learning-workspace-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const backupPath = await download.path();
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

    expect(backup.app).toBe("learning-workspace");
    expect(backup.kind).toBe("state-backup");
    expect(backup.version).toBe(1);
    expect(backup.learning).toBeDefined();
  });

  test("detecta errores al importar un respaldo inválido y confirma éxito con uno válido", async ({ page }) => {
    const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
    await settingsBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    const fileInput = modal.locator('input[type="file"]');

    // 1. Archivo inválido
    const invalidFile = { hello: "mundo" };
    await fileInput.setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(invalidFile)),
    });

    await expect(modal).toContainText("Error al restaurar");

    // 2. Archivo válido
    const validBackup = {
      app: "learning-workspace",
      kind: "state-backup",
      version: 1,
      exportedAt: "2026-09-04T00:00:00.000Z",
      secretsIncluded: false,
      learning: {
        attempts: [{ id: "test_attempt_1", graphId: "react", nodeId: "state_updates", createdAt: "2026-09-04T00:00:00.000Z", score: 95 }],
        drafts: [],
        liveReviews: [],
        coachIterations: [],
      },
      providers: { version: 4, activeProfileId: null, profiles: [] },
    };

    await fileInput.setInputFiles({
      name: "valid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(validBackup)),
    });

    await expect(modal).toContainText("✓ Respaldo restaurado con éxito");
  });

  test("expone las acciones de respaldo en la Command Palette (Ctrl+K)", async ({ page }) => {
    await page.keyboard.press("Control+k");

    const paletteInput = page.getByPlaceholder(/Buscar concepto o acción/i);
    await expect(paletteInput).toBeVisible();

    await paletteInput.fill("respaldo");
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toContainText("Configurar proveedores de IA y Respaldo");

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});