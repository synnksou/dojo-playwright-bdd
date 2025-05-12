import { expect } from '@playwright/test';
import { Given, When, Then } from '@utils/fixtures';

Given("Je suis sur la page d'accueil de Duende", async ({ page }) => {
	await page.goto('https://demo.duendesoftware.com/diagnostics');
	await expect(page).toHaveTitle(/Duende IdentityServer/);
});

When('Je remplis le champ de saisie Login', async ({ page }) => {
	await page.locator('#Input_Username').fill('bob');
});

When('Je remplis le champ de saisie du mot de passe', async ({ page }) => {
	await page.locator('#Input_Password').fill('bob');
});

When('Je clique sur le bouton "Login"', async ({ page }) => {
	await page.getByRole('button', { name: 'Login' }).click();
});

Then('Je devrais voir le message {string}', async ({ page }, text: string) => {
	await page.getByText(text).isVisible();
});
