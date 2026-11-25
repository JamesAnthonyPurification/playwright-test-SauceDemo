const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

let loginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.visit();
});

test('standard user can log in', async ({ page }) => {
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('locked-out user sees a login error', async () => {
  await loginPage.login('locked_out_user', 'secret_sauce');

  await expect(loginPage.errorMessage).toContainText('locked out');
});
