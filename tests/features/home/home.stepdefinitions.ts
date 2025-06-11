import { createBdd } from 'playwright-bdd';
import { expect } from 'playwright/test';

const { Given, When, Then } = createBdd();

Given("Je suis sur la page d'accueil de Duende", async ({ page }) => {
  await page.goto('https://demo.duendesoftware.com/');
});

When('La page est complètement chargée', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
  console.log('Page chargée');
});

Then('Je devrais voir le titre {string}', async ({ page }, expectedText: string) => {
  await expect(page.getByRole('link', { name: expectedText })).toBeVisible();
});
