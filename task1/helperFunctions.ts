
import { test, expect } from '@playwright/test';


// Configuration
export const BASE_URL = 'https://www.saucedemo.com/';
export const PASSWORD = 'secret_sauce';
export const validUsers = [
    'standard_user',  
    'problem_user',
    'performance_glitch_user',
    'error_user',
    'visual_user'
];

export async function StartLogin( {page}: {page: any},  {user}: {user: string}) {
    // Navigate to the login page
    await page.goto(BASE_URL);  
    // Fill in credentials using data-test attributes
    await page.fill('[data-test="username"]', user);
    await page.fill('[data-test="password"]', PASSWORD);   
    // Click the login button
    await page.click('[data-test="login-button"]');
    // Assert that we are redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    return;
}
