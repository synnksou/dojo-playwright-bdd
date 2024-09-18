import { expect } from '@playwright/test';
import { Given, When, Then } from '../../utils';

Given('Je suis connecté à GitHub', async ({ page }) => {
	await page.goto('https://github.com/synnksou/dojo-playwright-bdd');
});

When('Je crée un nouveau fichier nommé {string} avec le contenu {string}', async ({ page }, fileName, content) => {
	await page.getByRole('button', { name: 'Add file' }).click();
	await page.getByLabel('Create new file').click();
	await page.getByRole('region', { name: 'Editing file contents' }).click();
	await page.getByLabel('Use Control + Shift + m to').fill(content);
	await page.getByPlaceholder('Name your file...').fill(fileName);
	await page.getByRole('button', { name: 'Commit changes...' }).click();
	await page.getByRole('button', { name: 'Add file' }).click();
	await page.getByLabel('Create new file').click();
});

Then('Le commit {string} est créé', async ({ page }, commitMessage) => {
	const message = await page.textContent('Create test-file.txt');
	expect(message).toContain(commitMessage);
});
