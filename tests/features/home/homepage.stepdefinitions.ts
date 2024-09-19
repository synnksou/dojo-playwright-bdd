import { expect } from '@playwright/test';
import { Given, When, Then } from '../../utils/fixtures';

Given('I am on the Duende Demo home page', async ({ page }) => {
	await page.goto('https://demo.duendesoftware.com/diagnostics');
	await expect(page).toHaveTitle(/Duende IdentityServer/);
});

When('I fill in the Login input field', async ({ page }) => {
	await page.locator('#Input_Username').fill(process.env.DUENDE_USERNAME);
});

When('I fill in the Password input field', async ({ page }) => {
	await page.locator('#Input_Password').fill(process.env.DUENDE_PASSWORD);
});

When('I click on the {string} button', async ({ page }, name: string) => {
	await page.getByRole('button', { name }).first().click();
});

Then('I should see the message {string}', async ({ page }, text: string) => {
	await page.getByText(text).isVisible();
});
