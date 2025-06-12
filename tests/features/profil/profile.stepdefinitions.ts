import { Given, When, Then } from '@utils/fixtures';

Given('Je suis authentifié sur le Duende', async ({ page }) => {
  await page.goto('https://demo.duendesoftware.com');
});

When('Je navigue vers le profil', async ({ page }) => {
  await page.getByRole('link', { name: 'Go ' }).nth(1).click();
});

Then('Je devrais voir les cookies', async ({ page }) => {
  await page.getByRole('heading', { name: 'Properties' }).click();
});

Then('Je devrais voir les droits', async ({ page }) => {
  await page.getByRole('heading', { name: 'Claims' }).click();
});
