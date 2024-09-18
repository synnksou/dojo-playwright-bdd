import { test as base, createBdd } from 'playwright-bdd';
import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';

<<<<<<< HEAD
type Fixtures = {};

export const test = base.extend<Fixtures>({
	$afterAll: async ({}, use) => {
		// Cleanup after all tests
		// This is where you can close any resources or perform final checks
		await use();
	},
=======
type Fixtures = {
	autoTestFixture: string;
};

export const test = base.extend<Fixtures>({
	autoTestFixture: [
		async ({ page }, use) => {
			await Promise.all([
				page.coverage.startJSCoverage({
					resetOnNavigation: false,
				}),
			]);
			await use('autoTestFixture');

			const [jsCoverage] = await Promise.all([page.coverage.stopJSCoverage()]);
			const coverageList = [...jsCoverage];
			const mcr = MCR(coverageOptions);
			await mcr.add(coverageList);
		},
		{
			scope: 'test',
			auto: true,
		},
	],
>>>>>>> 7a59d8d (ci(PW): add pw test on github action)
});

export const { Given, When, Then } = createBdd(test);
