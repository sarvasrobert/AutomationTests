
//Website functionality with standard_user:
//    - click on hamburger menu to open menu.
//    - click each page in menu
//    - test filtering of products
//    - click cart to open cart page
//    - test redirect links in footer (linkedIn, Facebook, X)

import { test, expect } from '@playwright/test';
// Configuration
const BASE_URL = 'https://www.saucedemo.com/';
const PASSWORD = 'secret_sauce';
// Array of users expected to successfully log in
const validUsers = [
  'standard_user',
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user'
];


test.describe('UI Test Automation', () => {
  // Parameterized test: loops through all valid users
  for (const user of validUsers) {
    test(`MENU pages: ${user}`, async ({ page }) => {
      // Navigate to the login page
      await page.goto(BASE_URL);
      // Fill in credentials using data-test attributes
      await page.fill('[data-test="username"]', user);
      await page.fill('[data-test="password"]', PASSWORD);
      // Click the login button
      await page.click('[data-test="login-button"]');
      // Assert that we are redirected to the inventory page
      await expect(page).toHaveURL(/.*inventory\.html/);
      
      // Take a screenshot of the inventory page
      await page.screenshot({ path: `screenshots/${user}_inventory.png` });  
      // Click the hamburger menu to open it
      await page.click('#react-burger-menu-btn'); 
      // Take a screenshot of the opened menu
      await page.screenshot({ path: `screenshots/${user}_menu.png` });
      
      // Click on each page in the menu and take a screenshot
      await page.click('[data-test="inventory-sidebar-link"]');
      await page.screenshot({ path: `screenshots/${user}_All_Items.png` });
      await expect(page.locator(`[data-test="title"]`)).toBeVisible();
      
      await page.click('[data-test="about-sidebar-link"]');
      await page.screenshot({ path: `screenshots/${user}_About.png` });
      await expect(page).toHaveURL(/.*saucelabs\.com/);
      await page.goBack();
      await expect(page).toHaveURL(/.*inventory\.html/);

      await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
      await page.click('#react-burger-menu-btn'); 

      await page.click('[data-test="reset-sidebar-link"]');
      await page.screenshot({ path: `screenshots/${user}_Reset_App_State.png` });  
      await expect(page.locator(`[data-test="title"]`)).toBeVisible();

      await page.click('[data-test="logout-sidebar-link"]');
      await page.screenshot({ path: `screenshots/${user}_Logout.png` });
      await expect(page.locator(`[data-test="login-button"]`)).toBeVisible(); 

});
  test(`Footer links: ${user}`, async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);
    // Fill in credentials using data-test attributes
    await page.fill('[data-test="username"]', user);
    await page.fill('[data-test="password"]', PASSWORD);
    // Click the login button
    await page.click('[data-test="login-button"]');
    // Assert that we are redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Click on the LinkedIn link in the footer
    const [newPage_LinkedIn] = await Promise.all([
      page.context().waitForEvent('page'),
      // Click the LinkedIn link which opens in a new tab
      page.click('[data-test="social-linkedin"]')
    ]);
    await expect(newPage_LinkedIn).toHaveURL(/.*linkedin\.com\/company\/sauce-labs/);
    await newPage_LinkedIn.close(); // Close the LinkedIn tab and return to the original page

    // Click on the Facebook link in the footer
    const [newPage_Facebook] = await Promise.all([
      page.context().waitForEvent('page'),
      // Click the Facebook link which opens in a new tab 
      page.click('[data-test="social-facebook"]')
    ]);
    await expect(newPage_Facebook).toHaveURL(/.*facebook\.com\/saucelabs/);
    await newPage_Facebook.close(); // Close the Facebook tab and return to the original page

    // Click on the Twitter link in the footer
    const [newPage_Twitter] = await Promise.all([
      page.context().waitForEvent('page'),
      // Click the Twitter link which opens in a new tab
      page.click('[data-test="social-twitter"]')
    ]);
    await expect(newPage_Twitter).toHaveURL(/.*x\.com\/saucelabs/);
    await newPage_Twitter.close(); // Close the Twitter tab and return to the original page

  });
  test(`Product filtering: ${user}`, async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);
    // Fill in credentials using data-test attributes
    await page.fill('[data-test="username"]', user);
    await page.fill('[data-test="password"]', PASSWORD); 
    // Click the login button
    await page.click('[data-test="login-button"]');
    // Assert that we are redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/); 
    // Test filtering of products
    await page.selectOption('[data-test="product-sort-container"]', 'hilo');
    await page.screenshot({ path: `screenshots/${user}_filtered.png` }); 

    await page.selectOption('[data-test="product-sort-container"]', 'lohi');
    await page.screenshot({ path: `screenshots/${user}_filtered_lohi.png` });

    await page.selectOption('[data-test="product-sort-container"]', 'az');
    await page.screenshot({ path: `screenshots/${user}_filtered_az.png` });

    await page.selectOption('[data-test="product-sort-container"]', 'za');
    await page.screenshot({ path: `screenshots/${user}_filtered_za.png` }); 
  });
  // screenshot of cart page for each user
  test(`Cart page: ${user}`, async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);
    // Fill in credentials using data-test attributes
    await page.fill('[data-test="username"]', user);
    await page.fill('[data-test="password"]', PASSWORD);
    // Click the login button
    await page.click('[data-test="login-button"]');
    // Assert that we are redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/); 

    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*cart\.html/);
    await page.screenshot({ path: `screenshots/${user}_cart.png` });
    
    await expect(page.locator(`[data-test="checkout"]`)).toBeVisible();
    await page.click('[data-test="checkout"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_checkout.png` });

    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('[data-test="payment-info-label"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_checkout_step_two.png` });

    await page.click('[data-test="finish"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.locator('[data-test="checkout-complete-container"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_checkout_complete.png` });

    await page.click('[data-test="back-to-products"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
  test(`Products page: ${user}`, async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);
    // Fill in credentials using data-test attributes
    await page.fill('[data-test="username"]', user);
    await page.fill('[data-test="password"]', PASSWORD);
    // Click the login button
    await page.click('[data-test="login-button"]');
    // Assert that we are redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);

    await page.click('[data-test="item-4-title-link"]');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_product_4.png` });
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();

    await page.click('[data-test="item-0-title-link"]');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_product_0.png` });
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();

    await page.click('[data-test="item-1-title-link"]');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_product_1.png` });
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible(); 

    await page.click('[data-test="item-2-title-link"]');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_product_2.png` });
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('[data-test="item-2-title-link"]')).toBeVisible();

    await page.click('[data-test="item-3-title-link"]');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_product_3.png` });
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('[data-test="item-3-title-link"]')).toBeVisible();

    await page.click('[data-test="item-5-title-link"]');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.screenshot({ path: `screenshots/${user}_product_5.png` });
    await page.click('[data-test="back-to-products"]');
    await expect(page.locator('[data-test="item-5-title-link"]')).toBeVisible();

  });

}});

