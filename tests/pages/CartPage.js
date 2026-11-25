class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItemNames = page.locator('.cart_item .inventory_item_name');
  }

  async getProductNames() {
    return this.cartItemNames.allTextContents();
  }

  async removeProduct(productName) {
    const cartItem = this.page.locator('.cart_item').filter({
      hasText: productName,
    });

    await cartItem.getByRole('button', { name: 'Remove' }).click();
  }
}

module.exports = { CartPage };
