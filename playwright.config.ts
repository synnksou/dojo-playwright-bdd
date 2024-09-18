import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

const testDir = defineBddConfig({
	features: 'tests/features/**/*.feature',
	steps: 'tests/features/**/*.stepdefinitions.ts',
	importTestFrom: 'tests/utils/fixtures.ts',
	disableWarnings: {
		importTestFrom: true,
	},
});

const envPath = path.resolve(__dirname, '.env');
if(existsSync(envPath)){
	config({ path: envPath });
}

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
