import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  })

  test('Should Be Possible Access Home Page', async ({ page }) => {
    await expect(page.getByTestId('hero-title')).toBeVisible();
  });
});
