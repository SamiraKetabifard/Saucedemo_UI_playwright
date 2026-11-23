import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../utils/test-data';

test.describe('Login functionality', () => {
  test('standard user can log in @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory.html/);
    await inventory.expectLoaded();
  });

  test('locked-out user sees an appropriate error @regression', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(users.locked.username, users.locked.password);

    await login.expectLoginError('Sorry, this user has been locked out');
  });

  test('invalid credentials are rejected @regression', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(users.invalid.username, users.invalid.password);

    await login.expectLoginError('Username and password do not match');
  });

  test('login validation appears when fields are empty @regression', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.loginButton.click();

    await login.expectLoginError('Username is required');
  });
})