class InventoryItemPage {
  constructor(page, productName) {
    this.page = page;
    this.productName = productName;
    this.productTitle = page.getByText(productName, { exact: true });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeFromCartButton = page.getByRole('button', { name: 'Remove' });
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeFromCartButton.click();
  }
}

module.exports = { InventoryItemPage };
