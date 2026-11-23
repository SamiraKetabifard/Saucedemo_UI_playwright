import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, customer, products } from '../utils/test-data';

test.describe('Checkout journey', () => {
  test('user can complete an order end to end @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.goto();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    await inventory.addProductToCart(products.backpack);
    await inventory.openCart();
    await cart.expectProductInCart(products.backpack);
    await cart.checkout();

    await checkout.enterCustomerDetails(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await expect(page).toHaveURL(/checkout-step-two.html/);
    await checkout.finishOrder();
    await checkout.expectOrderComplete();
  });

  test('checkout requires a first name @regression', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.goto();
    await login.login(users.standard.username, users.standard.password);
    await inventory.addProductToCart(products.backpack);
    await inventory.openCart();
    await cart.checkout();

    await checkout.lastName.fill(customer.lastName);
    await checkout.postalCode.fill(customer.postalCode);
    await checkout.continueButton.click();

    await expect(checkout.errorMessage).toContainText('First Name is required');
  });
});