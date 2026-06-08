
import { test, expect } from '@playwright/test';
import * as Base from './helperFunctions';

test.describe('Positive Login Test Automation', () => {
  // Parameterized test: loops through all valid users
  for (const user of Base.validUsers) {
    test(`Successful login for user: ${user}`, async ({ page }) => {
      // Login with valid credentials
      await Base.StartLogin({page}, {user});
      // Assert that the products title is visible
      const title = page.locator('[data-test="title"]');
      await expect(title).toHaveText('Products');
    });
  };

  // Separate test for the locked out user to verify the error state
  test('Failed login for user: locked_out_user', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', 'locked_out_user');
    await page.fill('[data-test="password"]', Base.PASSWORD);
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });
});

test.describe('Negative Login Test Automation', () => {
  // test with empty username & password 
  test('Empty username & password', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', '');
    await page.fill('[data-test="password"]', '');
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username is required');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });


  // test with empty username & valid password 
  test('Empty username and valid password', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', '');
    await page.fill('[data-test="password"]', Base.PASSWORD);
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username is required');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });


  // test with valid username & empty password 
  test('Valid username and empty password', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', '');
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Password is required');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });

  // 'space' not equal to 'underscore' standard_user and standard user  
  test('standard_user not equal to standard user', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', 'standard user');
    await page.fill('[data-test="password"]', Base.PASSWORD);
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });
});

test.describe('Additional Login Test Automation', () => {
  // test case sensitivity 1
  test('test case sensitivity 1', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', 'Standard_user');
    await page.fill('[data-test="password"]', Base.PASSWORD);
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });


  // test case sensitivity 2 
  test('test case sensitivity 2', async ({ page }) => {
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', 'STANDARD_USER');
    await page.fill('[data-test="password"]', Base.PASSWORD);
    await page.click('[data-test="login-button"]');
    // Define the error message locator
    const errorMessage = page.locator('[data-test="error"]');
    // Assert the error message appears and contains the correct text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    // Check that we are still on the login page by verifying the URL hasn't changed to inventory
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });


  //Authentication routing test: Ensure that unauthenticated users cannot access the inventory page directly
  test('Unauthenticated access to inventory page', async ({ page }) => {
    await page.goto(`${Base.BASE_URL}inventory.html/`);
    // Assert that we are redirected back to the login page
    await expect(page).toHaveURL(Base.BASE_URL);
    // Assert that the login button is visible
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(loginButton).toBeVisible();
  });

  //Logout and Back Button - Login with valid credentials, logout and then simulate using browser back button. 
  //    (Verify the user is not allowed to authenticated pages without logging in)
  test('Using back button after logout', async ({ page }) => {
    // Login with valid credentials
    await Base.StartLogin({page}, {user: 'standard_user'});
    // Click the logout button
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link'); 
    await expect(page).toHaveURL(Base.BASE_URL);
    // Simulate using the browser back button
    await page.goBack();
    // Assert that we are still on the login page and not able to access inventory
    await expect(page).toHaveURL(Base.BASE_URL);
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(loginButton).toBeVisible();
  });

  // press 'Enter' key instead of clicking login button
  test('Login using Enter key', async ({ page }) => {
    // Login with valid credentials
    await Base.StartLogin({page}, {user: 'standard_user'});
    // Assert that the products title is visible
    const title = page.locator('[data-test="title"]');
    await expect(title).toHaveText('Products');
  });

   // press 'Tab' key to move to password field, and press 'Tab' again to highlight the login button
  test('Login using Tab key navigation', async ({ page }) => {
    // Login with valid credentials
    await page.goto(Base.BASE_URL);
    await page.fill('[data-test="username"]', 'standard_user');
    await page.press('[data-test="username"]', 'Tab');
    await page.fill('[data-test="password"]', Base.PASSWORD);
    await page.press('[data-test="password"]', 'Tab');
    await page.press('[data-test="login-button"]', 'Enter');
    // Assert that we are redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    // Assert that the products title is visible
    const title = page.locator('[data-test="title"]');
    await expect(title).toHaveText('Products');
  });
});
