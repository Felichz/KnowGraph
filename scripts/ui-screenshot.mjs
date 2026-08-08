import { chromium } from '@playwright/test';

const base = process.env.BASE_URL || 'http://localhost:5173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'test-results/ui-home.png' });
await page.screenshot({ path: 'test-results/ui-home-full.png', fullPage: true });

// Try clicking through main interactive elements to capture other views
const clickables = await page.$$('button');
console.log('buttons found:', clickables.length);
for (let i = 0; i < Math.min(clickables.length, 12); i++) {
  const label = (await clickables[i].innerText().catch(() => '')).trim().slice(0, 40);
  console.log(i, JSON.stringify(label));
}
await browser.close();
