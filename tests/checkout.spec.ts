import { test, expect } from './fixtures';
import { users, customer, products } from '../utils/test-data';

test.describe('Checkout journey', () => {
  test('user can complete an order end to end @smoke', async ({loginPage,inventoryPage,cartPage,
    checkoutPage,page}) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username,users.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.expectProductInCart(products.backpack);
    await cartPage.checkout();
    await checkoutPage.enterCustomerDetails(customer.firstName,customer.lastName,customer.postalCode);
    await expect(page).toHaveURL(/checkout-step-two.html/);
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('checkout requires a first name @regression', async ({loginPage,inventoryPage,cartPage,checkoutPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username,users.standard.password );
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.lastName.fill(customer.lastName);
    await checkoutPage.postalCode.fill(customer.postalCode);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required'
    );
  });
});