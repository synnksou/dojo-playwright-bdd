import { test as base, createBdd } from 'playwright-bdd';
import { expect } from 'playwright/test';

type Fixtures = {
  auth: { loginFunction: () => Promise<void> };
};

export const test = base.extend<Fixtures>({
  auth: async ({ page }, use) => {
    const loginFunction = async () => {
      await page.goto('https://demo.duendesoftware.com/diagnostics');
      await expect(page).toHaveTitle(/Duende IdentityServer/);

      await page.locator('#Input_Username').fill('bob');
      await page.locator('#Input_Password').fill('bob');

      await page.getByRole('button', { name: 'Login' }).click();
      //retour à la page d'accueil après la connexion
      await page.goto('https://demo.duendesoftware.com/');
    };

    await use({ loginFunction });
  },
});

export const { Given, When, Then } = createBdd(test);
