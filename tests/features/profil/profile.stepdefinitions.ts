import { expect } from 'playwright/test';
import { Given, When, Then } from '@utils/fixtures';

Given('Je suis authentifié sur le Duende', async ({ page }) => {
  await page.goto('https://demo.duendesoftware.com');
});

When('Je navigue vers le profil', async ({ page }) => {
  await page.getByText('Claims See the claims for your current session. Go').getByRole('link', { name: 'Go' }).click();
});

Then('Je devrais voir les cookies', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Properties' })).toBeVisible();
});

Then('Je devrais voir les droits', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Claims' })).toBeVisible();
});
