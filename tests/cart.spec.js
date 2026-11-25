const { test, expect } = require('@playwright/test');
const { CartPage } = require('./pages/CartPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { LoginPage } = require('./pages/LoginPage');

const backpackName = 'Sauce Labs Backpack';
let cartPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);

  await loginPage.visit();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart(backpackName);
  await inventoryPage.openCart();
});

test('added backpack appears in the cart', async () => {
  const productNames = await cartPage.getProductNames();

  expect(productNames).toContain(backpackName);
});

test('backpack can be removed from the cart', async () => {
  await cartPage.removeProduct(backpackName);

  const productNames = await cartPage.getProductNames();
  expect(productNames).not.toContain(backpackName);
});
