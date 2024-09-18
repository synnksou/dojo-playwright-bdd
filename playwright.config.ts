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
		video: 'on-first-retry',
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
	webServer: {
		command: 'npm run start',
		port: 5173,
		url: 'http://localhost',
		reuseExistingServer: !process.env.CI,
	},
});
