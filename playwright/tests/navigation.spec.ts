import { test, expect } from '@playwright/test';

test.describe('Navigation after login', () => {
  const admin = { email: 'adm@adm.com', password: 'admin123' };
  const seller = { email: 'cardosodanielly11@gmail.com', password: 'seller123' };
  const store = { email: 'infindamidiadigital@gmail.com', password: 'store123' };

  test('admin can navigate to dashboard sections', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', admin.email);
    await page.fill('input[name="password"]', admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
    // Example navigation click
    await page.click('[data-testid="nav-reports"]');
    await expect(page.locator('[data-testid="reports-page"]')).toBeVisible();
  });

  test('seller can navigate to sales page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', seller.email);
    await page.fill('input[name="password"]', seller.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/seller');
    await page.click('[data-testid="nav-sales"]');
    await expect(page.locator('[data-testid="sales-page"]')).toBeVisible();
  });

  test('store can navigate to inventory', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', store.email);
    await page.fill('input[name="password"]', store.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/store');
    await page.click('[data-testid="nav-inventory"]');
    await expect(page.locator('[data-testid="inventory-page"]')).toBeVisible();
  });
});
