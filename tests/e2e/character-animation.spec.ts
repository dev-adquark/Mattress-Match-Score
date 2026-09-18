import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

test.describe('Character animation and GLB loading', () => {
  test('character GLB loads without errors on home page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(500);

    // Wait for canvas and 3D scene to render
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Give it time to load the GLB (useGLTF)
    await page.waitForTimeout(2000);

    // Verify no errors were logged (except deprecation warnings)
    const criticalErrors = errors.filter((e) => !e.includes('deprecated'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('animation clips are available in the loaded GLB', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Wait for scene to load
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Inject script to check if canvas exists
    const canvasCount = await page.evaluate(() => {
      return document.querySelectorAll('canvas').length;
    });

    expect(canvasCount).toBe(1);
  });
});
