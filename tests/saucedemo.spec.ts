import { test, expect, type Page } from '@playwright/test';

/**
 * Assignment 3 - SauceDemo (Guest checkout)
 * Test cases selected from "SauceDemo (Test Cases).xlsx" > sheet "Checkout"
 *   TC-CKO-002 : Register in Checkout: Your Information page using valid inputs
 *   TC-CKO-003 : Register in Checkout: Your Information page without filling mandatory fields
 *   TC-CKO-013 : Verify success message in checkout complete page
 */

const BASE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

// Pre-condition: log in and put one item in the cart, then open the cart page.
async function loginAndAddItemToCart(page: Page) {
  await page.goto(BASE_URL);
  await page.locator('#user-name').fill(USERNAME);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
}

test.describe('SauceDemo - Guest checkout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndAddItemToCart(page);
  });

  /* ---------------------------------------------------------------------
   * TC-CKO-002 : Checkout: Your Information - valid inputs
   * Expected: user is redirected to Checkout: Overview page
   * ------------------------------------------------------------------ */
  test('TC-CKO-002: fill Your Information with valid inputs and continue', async ({ page }) => {
    // Step 4: click Checkout button on the cart page
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 5: enter first name, last name and postal code
    await page.locator('#first-name').fill('Mew');
    await page.locator('#last-name').fill('Rockzee');
    await page.locator('#postal-code').fill('10900');
    await page.screenshot({ path: 'screenshots/sauce-tc002-01-form-filled.png', fullPage: true });

    // Step 6: click Continue
    await page.locator('[data-test="continue"]').click();

    // Expected result: redirected to Checkout: Overview
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await page.screenshot({ path: 'screenshots/sauce-tc002-02-overview.png', fullPage: true });
  });

  /* ---------------------------------------------------------------------
   * TC-CKO-003 : Checkout: Your Information - mandatory fields empty
   * Expected: error message "Error: First Name is required" is displayed
   * ------------------------------------------------------------------ */
  test('TC-CKO-003: continue without filling mandatory fields shows an error', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 5: click Continue while all fields are still empty
    await page.locator('[data-test="continue"]').click();

    // Expected result: stay on the same page and show the error message
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
    await page.screenshot({ path: 'screenshots/sauce-tc003-01-error-required.png', fullPage: true });
  });

  /* ---------------------------------------------------------------------
   * TC-CKO-013 : Success message on Checkout: Complete page
   * Expected: "Thank you for your order!" is displayed
   * ------------------------------------------------------------------ */
  test('TC-CKO-013: finishing the order shows the success message', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();

    await page.locator('#first-name').fill('Mew');
    await page.locator('#last-name').fill('Rockzee');
    await page.locator('#postal-code').fill('10900');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Click Finish on the Checkout: Overview page
    await page.locator('[data-test="finish"]').click();

    // Expected result: Checkout: Complete page with the success message
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text'))
      .toContainText('Your order has been dispatched');
    await page.screenshot({ path: 'screenshots/sauce-tc013-01-order-complete.png', fullPage: true });
  });
});
