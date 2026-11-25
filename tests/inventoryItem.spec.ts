const { test, expect } = require('@playwright/test');
const { InventoryItemPage } = require('./pages/InventoryItemPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { LoginPage } = require('./pages/LoginPage');

const backpackName = 'Sauce Labs Backpack';
let inventoryItemPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.visit();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.openProductDetails(backpackName);
  inventoryItemPage = new InventoryItemPage(page, backpackName);
});

test('backpack details show the product and add-to-cart button', async () => {
  await expect(inventoryItemPage.productTitle).toBeVisible();
  await expect(inventoryItemPage.addToCartButton).toBeVisible();
});

test('backpack can be added and removed from the product details page', async () => {
  await inventoryItemPage.addToCart();
  await expect(inventoryItemPage.cartBadge).toHaveText('1');
  await expect(inventoryItemPage.removeFromCartButton).toBeVisible();

  await inventoryItemPage.removeFromCart();
  await expect(inventoryItemPage.cartBadge).toBeHidden();
  await expect(inventoryItemPage.addToCartButton).toBeVisible();
});
