import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async expectProductInCart(productName: string) {
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}