import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users, products } from '../utils/test-data';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('user can add a product and view it in the cart @smoke', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addProductToCart(products.backpack);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await inventory.openCart();

    await cart.expectProductInCart(products.backpack);
  });

  test('user can remove a product from the cart @regression', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addProductToCart(products.bikeLight);
    await inventory.openCart();
    await cart.expectProductInCart(products.bikeLight);
    await page.getByRole('button', { name: 'Remove' }).click();

    await cart.expectCartEmpty();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('user can sort products by price low to high @regression', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.sortBy('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price => Number(price.replace('$', '')));

    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
  });
});