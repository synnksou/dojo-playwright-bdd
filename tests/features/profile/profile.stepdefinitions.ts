import { Given, When, Then } from '@utils/fixtures';

Given('Je suis authentifié sur le Duende', async ({ page }) => {
	// TODO: Aller sur la page diagnostics en étant connecté
	await page.goto('https://demo.duendesoftware.com');
});

When('Je navigue vers le profil', async ({ page }) => {
	await page.getByRole('listitem').filter({ hasText: 'Click here to see the claims' }).getByRole('link').click();
});

Then('Je devrais voir les cookies', async ({ page }) => {
	await page.getByRole('heading', { name: 'Properties' }).click();
});

Then('Je devrais voir les droits', async ({ page }) => {
	await page.getByRole('heading', { name: 'Claims' }).click();
});
