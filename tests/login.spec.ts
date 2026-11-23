import { test, expect } from './fixtures';
import { users } from '../utils/test-data';

test.describe('Login functionality', () => {
  test('standard user can log in @smoke', async ({
    loginPage,inventoryPage,page}) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username,users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
    await inventoryPage.expectLoaded();
  });
  test('locked-out user sees an appropriate error @regression', async ({loginPage}) => {
    await loginPage.goto();
    await loginPage.login( users.locked.username, users.locked.password);
    await loginPage.expectLoginError('Sorry, this user has been locked out');
  });
  test('invalid credentials are rejected @regression', async ({loginPage}) => {
    await loginPage.goto();
    await loginPage.login(users.invalid.username,users.invalid.password );
    await loginPage.expectLoginError( 'Username and password do not match');
  });
  test('login validation appears when fields are empty @regression', async ({loginPage }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();
    await loginPage.expectLoginError(
      'Username is required'
    );
  });
});