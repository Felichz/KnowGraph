import { test, expect } from "@playwright/test";

test.describe("AI Paraphrase Generator, Coaching & Flashcard Views", () => {
  test("opens card modal, displays AI generate tools and loads flashcards without reference errors", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

    await page.goto("/");
    await page.waitForSelector(".workspace-nav-toggle", { timeout: 15_000 });

    // Open workspace nav drawer
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForSelector(".guide-item", { timeout: 10_000 });

    // Open first card
    await page.locator(".guide-item").first().click();
    await page.waitForSelector(".lesson-modal", { timeout: 10_000 });

    // Switch to Coaching tab (view 02)
    const coachingTab = page.locator(".lesson-view-tabs button").filter({ hasText: /Coaching/i });
    await coachingTab.click();
    await page.waitForSelector(".paraphrase-review__textarea", { timeout: 10_000 });

    // Verify AI generate button is present
    const aiButton = page.locator(".ai-generate-button");
    await expect(aiButton).toBeVisible();
    await expect(aiButton).toContainText("Generar con IA");

    // Open AI info tooltip
    const tooltipTrigger = page.locator(".ai-generate-tooltip-trigger");
    await expect(tooltipTrigger).toBeVisible();
    await tooltipTrigger.hover();
    const tooltipPopover = page.locator(".ai-generate-tooltip-popover");
    await expect(tooltipPopover).toBeVisible();
    await expect(tooltipPopover).toContainText("PARAFRASEO RÁPIDO");

    // Close lesson modal
    await page.locator(".modal-close").first().click();

    // Open workspace nav drawer again and switch to Flashcards mode
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForSelector(".view-mode-toggle", { timeout: 10_000 });
    const flashcardModeBtn = page.locator(".view-mode-toggle__btn").filter({ hasText: "Flashcards" });
    await flashcardModeBtn.click();

    // Verify Flashcard view is loaded and AI filter is present
    await page.waitForSelector(".flashcards", { timeout: 10_000 });
    const aiFilterChip = page.locator(".flashcards__filter").filter({ hasText: /Con IA/i });
    await expect(aiFilterChip).toBeVisible();

    // Verify no runtime ReferenceError or JS errors occurred
    const runtimeErrors = consoleErrors.filter((msg) => !msg.includes("Content Security Policy"));
    expect(runtimeErrors).toEqual([]);
  });
});

