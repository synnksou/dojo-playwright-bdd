import { expect } from '@playwright/test';
import { Given, When, Then } from '../../utils';
import fs from 'fs';

const PATH = './temp/';
let downloadFile: any;

Given('Je suis la page du repo', async ({ page }) => {
	await page.goto('https://github.com/synnksou/dojo-playwright-bdd');
});

When('Je télécharge le repo', async ({ page }, email) => {
	await page.getByRole('button', { name: 'Code' }).click();
	const downloadPromise = page.waitForEvent('download');
	await page.getByLabel('Download ZIP').click();
	const download = await downloadPromise;
	downloadFile = download.suggestedFilename();
	await download.saveAs(PATH + downloadFile);
});

Then('Le téléchargement est réussi', async ({ page }) => {
	await expect(fs.promises.stat(PATH + downloadFile)).resolves.not.toBeNull();
	await fs.promises.unlink(PATH + downloadFile);
});
