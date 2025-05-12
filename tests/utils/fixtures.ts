import { test as base, createBdd } from 'playwright-bdd';

type Fixtures = {};

export const test = base.extend<Fixtures>({
	$afterAll: async ({}, use) => {
		// Cleanup after all tests
		// This is where you can close any resources or perform final checks
		await use();
	},
});

export const { Given, When, Then } = createBdd(test);
