import { chromium } from '@playwright/test';

const base = 'http://localhost:5173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: 'networkidle' });

// Flashcards mode
await page.locator('button:has-text("Flashcards")').first().click();
await page.waitForTimeout(800);
await page.screenshot({ path: 'test-results/ui-flashcards.png', fullPage: true });

// Back to graph, click a node
await page.locator('button:has-text("Grafo")').first().click();
await page.waitForTimeout(500);
const node = page.locator('svg circle, [class*=node]').first();
await node.click({ force: true }).catch(e => console.log('node click failed', e.message));
await page.waitForTimeout(800);
await page.screenshot({ path: 'test-results/ui-node-detail.png', fullPage: true });

// React interviews tab (close modal first if open)
await page.keyboard.press('Escape');
await page.locator('.modal-backdrop button').first().click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(400);
await page.locator('button:has-text("React entrevistas")').first().click();
await page.waitForTimeout(800);
await page.screenshot({ path: 'test-results/ui-react.png', fullPage: true });

// Mobile viewport
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'test-results/ui-mobile.png', fullPage: true });

await browser.close();
console.log('done');
