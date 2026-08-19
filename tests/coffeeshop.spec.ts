import { test, expect } from '@playwright/test';

/**
 * Assignment 3 - Coffee Shop Testing
 * Site: https://seleniumbase.io/coffee/
 *
 *   TC-COF-001 : Add a single coffee and verify the total price
 *   TC-COF-002 : Add multiple coffees and verify the cart page and the summed total
 *   TC-COF-003 : Complete the payment flow and verify the success message
 *
 * Price list used by these tests:
 *   Espresso $10 | Cafe Latte $16 | Americano $7
 */

const BASE_URL = 'https://seleniumbase.io/coffee/';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  // The cart starts empty on every fresh page load
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $0.00');
});

/* -------------------------------------------------------------------------
 * TC-COF-001: Add a single coffee and verify the total price
 * ---------------------------------------------------------------------- */
test('TC-COF-001: adding one Cafe Latte updates the total to $16.00', async ({ page }) => {
  // Click the Cafe Latte cup
  await page.locator('[data-test="Cafe_Latte"]').click();

  // The pay button must show the price of that single cup
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $16.00');

  // The cart link in the header must show 1 item
  await expect(page.getByRole('link', { name: /cart/i })).toContainText('(1)');

  await page.screenshot({ path: 'screenshots/coffee-tc001-01-one-latte.png', fullPage: true });
});

/* -------------------------------------------------------------------------
 * TC-COF-002: Add multiple coffees and verify the cart page + summed total
 * ---------------------------------------------------------------------- */
test('TC-COF-002: adding Espresso + Americano sums the total to $17.00', async ({ page }) => {
  // Espresso $10.00
  await page.locator('[data-test="Espresso"]').click();
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $10.00');

  // Americano $7.00  ->  10 + 7 = 17
  await page.locator('[data-test="Americano"]').click();
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $17.00');
  await expect(page.getByRole('link', { name: /cart/i })).toContainText('(2)');

  await page.screenshot({ path: 'screenshots/coffee-tc002-01-two-items.png', fullPage: true });

  // Open the cart page and verify both items are listed
  await page.getByRole('link', { name: /cart/i }).click();
  await expect(page.getByText('Espresso', { exact: true })).toBeVisible();
  await expect(page.getByText('Americano', { exact: true })).toBeVisible();
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $17.00');

  await page.screenshot({ path: 'screenshots/coffee-tc002-02-cart-page.png', fullPage: true });
});

/* -------------------------------------------------------------------------
 * TC-COF-003: Complete the payment flow and verify the success message
 * ---------------------------------------------------------------------- */
test('TC-COF-003: submitting payment details shows the success message', async ({ page }) => {
  await page.locator('[data-test="Espresso"]').click();
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $10.00');

  // Clicking the total button opens the payment dialog
  await page.locator('[data-test="checkout"]').click();
  await expect(page.getByText('Payment details')).toBeVisible();

  await page.getByLabel('Name', { exact: true }).fill('Mew Rockzee');
  await page.getByLabel('Email', { exact: true }).fill('rockzee2018@gmail.com');
  await page.screenshot({ path: 'screenshots/coffee-tc003-01-payment-form.png', fullPage: true });

  await page.getByRole('button', { name: 'Submit' }).click();

  // Expected: success message is shown and the cart is reset to $0.00
  await expect(page.getByText(/Thanks for your purchase/i)).toBeVisible();
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $0.00');

  await page.screenshot({ path: 'screenshots/coffee-tc003-02-success.png', fullPage: true });
});
