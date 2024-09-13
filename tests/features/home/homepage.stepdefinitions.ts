import { expect } from '@playwright/test';
import { Given, When, Then } from '../../utils/fixtures';

Given('I am on the GitHub home page', async ({ page }) => {
	await page.goto('https://github.com');
	await expect(page).toHaveTitle(/GitHub/);
});

When('I fill {string} in the Email input field', async ({ page }, name: string) => {
	await page.locator('#hero_user_email').fill(name);
});

When('I click on the {string} button', async ({ page }, name: string) => {
	await page.getByRole('button', { name }).first().click();
});

Then('I should see the message {string}', async ({ page }, text: string) => {
	await page.getByText(text).isVisible();
});
