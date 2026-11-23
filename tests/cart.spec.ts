import { test, expect } from './fixtures';
import { users, products } from '../utils/test-data';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });
  test('user can add a product and view it in the cart @smoke', async ({ inventoryPage,cartPage,page}) => {
    await inventoryPage.addProductToCart(products.backpack);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await inventoryPage.openCart();
    await cartPage.expectProductInCart(products.backpack);
  });
  test('user can remove a product from the cart @regression', async ({ inventoryPage,cartPage,page}) => {
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.expectProductInCart(products.bikeLight);
    await page.getByRole('button', { name: 'Remove' }).click();
    await cartPage.expectCartEmpty();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
  test('user can sort products by price low to high @regression', async ({inventoryPage,page}) => {
    await inventoryPage.sortBy('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price => Number(price.replace('$', '')));

    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b)
    );
  });
});