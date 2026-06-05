# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication flow for different roles >> store can log in and access store dashboard
- Location: playwright\tests\auth.spec.ts:26:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e6]:
            - heading "MEC Hub" [level=1] [ref=e7]
            - generic [ref=e8]: by Infinda
          - button "Colapsar sidebar" [ref=e9]:
            - img
        - navigation [ref=e13]:
          - button "Dashboard Geral" [ref=e14]:
            - generic [ref=e15]:
              - img
              - generic [ref=e16]: Dashboard Geral
          - button "Empresas" [ref=e17]:
            - generic [ref=e18]:
              - img
              - generic [ref=e19]: Empresas
          - button "Lojas" [ref=e20]:
            - generic [ref=e21]:
              - img
              - generic [ref=e22]: Lojas
          - button "Vendedores" [ref=e23]:
            - generic [ref=e24]:
              - img
              - generic [ref=e25]: Vendedores
          - button "CRM" [ref=e26]:
            - generic [ref=e27]:
              - img
              - generic [ref=e28]: CRM
          - button "Pipeline" [ref=e29]:
            - generic [ref=e30]:
              - img
              - generic [ref=e31]: Pipeline
          - button "WhatsApp" [ref=e32]:
            - generic [ref=e33]:
              - img
              - generic [ref=e34]: WhatsApp
          - button "Agente IA" [ref=e35]:
            - generic [ref=e36]:
              - img
              - generic [ref=e37]: Agente IA
          - button "Reativação" [ref=e38]:
            - generic [ref=e39]:
              - img
              - generic [ref=e40]: Reativação
          - button "Métricas" [ref=e41]:
            - generic [ref=e42]:
              - img
              - generic [ref=e43]: Métricas
          - button "Projeção Financeira" [ref=e44]:
            - generic [ref=e45]:
              - img
              - generic [ref=e46]: Projeção Financeira
          - button "Configurações" [ref=e47]:
            - generic [ref=e48]:
              - img
              - generic [ref=e49]: Configurações
        - generic [ref=e51]:
          - generic [ref=e52]: Troca Rápida de Perfil
          - generic [ref=e53]:
            - button "Trocar para perfil admin" [ref=e54]:
              - generic [ref=e56]: admin
            - button "Trocar para perfil loja" [ref=e57]:
              - generic [ref=e58]: loja
            - button "Trocar para perfil vendedor" [ref=e59]:
              - generic [ref=e60]: vendedor
      - generic [ref=e61]:
        - banner [ref=e62]:
          - generic [ref=e63]:
            - heading "Plataforma MEC Hub" [level=2] [ref=e65]
            - generic [ref=e66]:
              - generic [ref=e67]:
                - generic [ref=e68]: "Empresa:"
                - button "Todas as Empresas" [ref=e71]:
                  - generic [ref=e72]: Todas as Empresas
                  - img [ref=e73]
              - generic [ref=e75]:
                - generic [ref=e76]: "Unidade:"
                - button "Todas as Unidades" [ref=e79]:
                  - generic [ref=e80]: Todas as Unidades
                  - img [ref=e81]
          - generic [ref=e83]:
            - generic [ref=e86]:
              - button "Notificações" [ref=e87]:
                - generic [ref=e88]: Notificações
                - img [ref=e89]
              - button "Minha Conta" [ref=e91]:
                - generic [ref=e92]: Minha Conta
                - img [ref=e93]
            - button "Alternar tema" [ref=e95]:
              - img
        - main [ref=e96]:
          - generic [ref=e99]:
            - heading "404" [level=1] [ref=e100]
            - paragraph [ref=e101]: Página não encontrada
            - button "Voltar para o Dashboard" [ref=e102]
      - region "Notifications alt+T"
    - region "Notifications alt+T"
  - complementary "Edit with Lovable" [ref=e103]:
    - link "Edit with Lovable" [ref=e104] [cursor=pointer]:
      - /url: https://lovable.dev/projects/a2fbd200-3bae-47a4-895d-349c6f74fed9?utm_source=lovable-badge
      - generic [ref=e105]: Edit with
      - img [ref=e106]
    - button "Dismiss" [ref=e111] [cursor=pointer]:
      - img [ref=e112]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication flow for different roles', () => {
  4  |   const admin = { email: 'adm@adm.com', password: 'admin123' };
  5  |   const seller = { email: 'cardosodanielly11@gmail.com', password: 'seller123' };
  6  |   const store = { email: 'infindamidiadigital@gmail.com', password: 'store123' };
  7  | 
  8  |   test('admin can log in and access admin dashboard', async ({ page }) => {
  9  |     await page.goto('/login');
  10 |     await page.fill('input[name="email"]', admin.email);
  11 |     await page.fill('input[name="password"]', admin.password);
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL('/admin');
  14 |     await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('seller can log in and access seller dashboard', async ({ page }) => {
  18 |     await page.goto('/login');
  19 |     await page.fill('input[name="email"]', seller.email);
  20 |     await page.fill('input[name="password"]', seller.password);
  21 |     await page.click('button[type="submit"]');
  22 |     await expect(page).toHaveURL('/seller');
  23 |     await expect(page.locator('[data-testid="seller-dashboard"]')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('store can log in and access store dashboard', async ({ page }) => {
  27 |     await page.goto('/login');
> 28 |     await page.fill('input[name="email"]', store.email);
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  29 |     await page.fill('input[name="password"]', store.password);
  30 |     await page.click('button[type="submit"]');
  31 |     await expect(page).toHaveURL('/store');
  32 |     await expect(page.locator('[data-testid="store-dashboard"]')).toBeVisible();
  33 |   });
  34 | });
  35 | 
```