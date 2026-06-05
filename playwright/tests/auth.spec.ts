import { test, expect } from '@playwright/test';

test.describe('Authentication flow for different roles', () => {
  const admin = { email: 'adm@adm.com', password: 'admin123' };
  const seller = { email: 'cardosodanielly11@gmail.com', password: 'seller123' };
  const store = { email: 'infindamidiadigital@gmail.com', password: 'store123' };

  test('admin can log in and access admin dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', admin.email);
    await page.fill('input[name="password"]', admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });

  test('seller can log in and access seller dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', seller.email);
    await page.fill('input[name="password"]', seller.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/seller');
    await expect(page.locator('[data-testid="seller-dashboard"]')).toBeVisible();
  });

  test('store can log in and access store dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', store.email);
    await page.fill('input[name="password"]', store.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/store');
    await expect(page.locator('[data-testid="store-dashboard"]')).toBeVisible();
  });
});
