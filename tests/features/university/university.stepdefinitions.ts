import { expect } from '@playwright/test';
import { Given, When, Then } from '../../utils/fixtures';

Given("Je visite la page d'actualités et d'événements de la fausse université", async ({ page }) => {
	await page.goto('https://fake-university.com/news-and-events.html');
});

When('La page est entièrement chargée', async ({ page }) => {
	await page.getByRole('heading', { name: 'News & Events' }).click();
});

Then('Toutes les images doivent avoir un attribut alt non vide', async ({ page }) => {
	const imagesWithoutAlt = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('img'))
			.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '')
			.map(img => img.src); // pour log/debug
	});

	expect(imagesWithoutAlt.length).toBe(0);
});
