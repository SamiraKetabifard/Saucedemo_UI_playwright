import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.inventoryItems = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async addProductToCart(productName: string) {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName: string) {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(value);
  }

  async openCart() {
    await this.cartLink.click();
  }
}