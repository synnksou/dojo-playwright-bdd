import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto('https://github.com/login');
	await page.getByLabel('Username or email address').fill('TEST');
	await page.getByLabel('Password').fill('PASSWRD');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();

	// IF 2FA is enabled, you can add the following code to handle it.
	await page.pause();
	await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 30000 });

	await page.context().storageState({ path: authFile });
});
