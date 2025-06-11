import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://demo.duendesoftware.com/diagnostics');

  await expect(page).toHaveTitle(/Duende IdentityServer/);

  await page.locator('#Input_Username').fill('bob');

  await page.locator('#Input_Password').fill('bob');

  await page.getByRole('button', { name: 'Login' }).click();

  await page.context().storageState({ path: authFile });
});
