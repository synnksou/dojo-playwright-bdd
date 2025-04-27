import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

const testDir = defineBddConfig({
	features: 'tests/features/**/*.feature',
	steps: 'tests/features/**/*.stepdefinitions.ts',
});

const envPath = path.resolve(__dirname, '.env');
if(existsSync(envPath)){
	config({ path: envPath });
}

export default defineConfig({
	testDir,
	reporter: [cucumberReporter('html', { outputFile: 'cucumber-report/report.html' })],
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
