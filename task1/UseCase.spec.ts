/*Common use-case tests:

Add to cart 1
    1.) Login with valid username and password
    2.) click add-to cart from product page (for each product) -> Assert that: cart icon with number of all products should be visualized 
    3.) Click remove button for each product on pruduct page -> Assert that: (cart icon should be without numbers)
    4.) click on cart and Assert that: there should be nothing in cart

Add to cart 2
    1.) Login with valid username and password
    2.) click add to cart first item from product page.
    3.) click on name of second product -> redirects you to page and click add to cart
    4.) log out the user
    5.) login with the same credentials as in step 1 - Assert that products which u added during previous session are in car

*/

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

test.describe('Functional Tests:', () => {
  // Parameterized test: loops through all valid users
  for (const user of validUsers) {
    test(`Add to cart: ${user}`, async ({ page }) => {
        // Navigate to the login page
        await page.goto(BASE_URL);
        // Fill in credentials using data-test attributes
        await page.fill('[data-test="username"]', user);
        await page.fill('[data-test="password"]', PASSWORD);
        // Click the login button
        await page.click('[data-test="login-button"]');
        // Assert that we are redirected to the inventory page
        await expect(page).toHaveURL(/.*inventory\.html/);

        // Add products to the cart and verify the cart badge updates correctly
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

        await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
        await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

        await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
        await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeVisible();

        await page.click('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('4');
        await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toBeVisible();

        await page.click('[data-test="add-to-cart-sauce-labs-onesie"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('5');
        await expect(page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeVisible();

        await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
        await expect(page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')).toBeVisible();

        // Remove products from the cart and verify the cart badge updates correctly
        await page.click('[data-test="remove-sauce-labs-backpack"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('5');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();

        await page.click('[data-test="remove-sauce-labs-bike-light"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('4');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();

        await page.click('[data-test="remove-sauce-labs-bolt-t-shirt"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')).toBeVisible();

        await page.click('[data-test="remove-sauce-labs-fleece-jacket"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')).toBeVisible();

        await page.click('[data-test="remove-sauce-labs-onesie"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-onesie"]')).toBeVisible();

        await page.click('[data-test="remove-test.allthethings()-t-shirt-(red)"]');
        await expect(page.locator('.shopping_cart_badge')).toBeHidden();
        await expect(page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')).toBeVisible();

    });
    test(`Persistence of cart items after logout: ${user}`, async ({ page }) => {
        // Navigate to the login page
        await page.goto(BASE_URL);
        // Fill in credentials using data-test attributes
        await page.fill('[data-test="username"]', user);
        await page.fill('[data-test="password"]', PASSWORD);
        // Click the login button
        await page.click('[data-test="login-button"]');
        // Assert that we are redirected to the inventory page
        await expect(page).toHaveURL(/.*inventory\.html/);
        // Add a product to the cart
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        // Log out the user
        await page.click('#react-burger-menu-btn');
        await page.click('#logout_sidebar_link');  

        // Log back in with the same credentials
        await page.fill('[data-test="username"]', user);
        await page.fill('[data-test="password"]', PASSWORD);
        await page.click('[data-test="login-button"]');
        // Assert that we are redirected to the inventory page
        await expect(page).toHaveURL(/.*inventory\.html/);
        // Assert that the cart item is still present
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    });
};
    // Placeholder for timeout test - implementation depends on specific timeout behavior being tested
    test(`Timeout test `, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', PASSWORD);
        await page.click('[data-test="login-button"]');
        await expect(page).toHaveURL(/.*inventory\.html/);

        // Simulate user inactivity or wait for a specific timeout duration
        await page.waitForSelector('[data-test="inventory_container"]', { state: 'hidden', timeout: 300000 }); // Wait for inventory container to disappear, indicating timeout

        // Assert that the user is not logged out or redirected to the login page after timeout
        await expect(page).toHaveURL(/.*inventory\.html/);
    
    
    });

});