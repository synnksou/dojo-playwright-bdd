import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
	features: 'tests/features/**/*.feature',
	steps: 'tests/features/**/*.stepdefinitions.ts',
	importTestFrom: 'tests/utils/fixtures.ts',
	disableWarnings: {
		importTestFrom: true,
	},
});

export default defineConfig({
	testDir,
	timeout: 30000,
	reporter: [
		['list'],
		cucumberReporter('junit', {
			outputFile: 'tests/reports/junit.xml',
			suiteName: 'Playwright Coverage',
		}),
	],
	globalSetup: 'tests/utils/global.setup.ts',
	globalTeardown: 'tests/utils/global.teardown.ts',
	use: {
		video: 'on',
		viewport: { width: 1920, height: 1080 },
	},
	projects: [
		{
			name: 'auth',
			testMatch: '**/auth.setup.ts',
			testDir: 'tests/utils',
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/user.json' },
			dependencies: ['auth'],
		},
	],
});
