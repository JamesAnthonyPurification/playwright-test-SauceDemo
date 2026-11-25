class InventoryPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('.inventory_item');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async addProductToCart(productName) {
    const productCard = this.productCards.filter({
      has: this.page.getByText(productName, { exact: true }),
    });

    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }
}

module.exports = { InventoryPage };
