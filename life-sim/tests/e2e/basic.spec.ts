import { test, expect } from '@playwright/test';

test('place sofa and watch fun increase', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('.game-canvas')).toBeVisible();
  await page.getByRole('button', { name: /^(Construir|Build)/ }).click();
  await page.getByText(/Sofá|Sofa/).click();
  await page.mouse.click(400, 300);
  await page.getByRole('button', { name: '1x' }).click();
  await page.waitForTimeout(1000);
  const funText = await page.locator('.hud .needs li').nth(4).locator('.fill').getAttribute('style');
  expect(funText).toBeTruthy();
});
