import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto('https://github.com/login');
	await page.getByLabel('Username or email address').fill('synnksou');
	await page.getByLabel('Password').fill('9Hwarrii');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();

	// IF 2FA is enabled, you can add the following code to handle it.
	//await page.pause();

	// Alternatively, you can wait until the page reaches a state where all cookies are set.
	await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

	await page.context().storageState({ path: authFile });
});
