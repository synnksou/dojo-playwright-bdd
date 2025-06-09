## 📊 Coverage (monocart)

Pour générer des rapports de couverture de code, nous allons utiliser `monocart-coverage-reports`. Voici comment configurer la couverture de code dans votre projet.

1. Installez `monocart-coverage-reports` :

```bash
npm install monocart-coverage-reports
```

2. Configurez la couverture de code dans votre fichier `e2e/support/fixtures.ts` :

```typescript
import MCR from 'monocart-coverage-reports';
import { test as base } from 'playwright-bdd';

import coverageOptions from './mcr.config';

export const test = base.extend<{
	autoTestFixture: string;
}>({
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
});

export const { Given, When, Then } = createBdd(test); // On export tout les steps avec les fixtures
```

#### `page.coverage.startJSCoverage`

Cette fonction démarre la collecte de la couverture de code JavaScript pour la page. Elle prend un objet d'options en paramètre, où vous pouvez spécifier des options comme `resetOnNavigation` pour indiquer si la couverture doit être réinitialisée lors de la navigation.

#### `page.coverage.stopJSCoverage`

Cette fonction arrête la collecte de la couverture de code JavaScript et renvoie les données de couverture collectées. Ces données peuvent ensuite être utilisées pour générer des rapports de couverture de code.

### Configuration des fichiers globaux

Pour configurer les fichiers globaux nécessaires à votre projet de plus avec MCR, vous devez créer deux fichiers : global-setup.ts et global-teardown.ts.
Ces fichiers permettent de configurer et de nettoyer l'environnement de test avant et après l'exécution des tests respectivement.

#### `global-setup.ts`

Ce fichier est utilisé pour configurer l'environnement de test avant l'exécution des tests. Par exemple, vous pouvez l'utiliser pour initialiser des variables d'environnement, configurer des connexions à des bases de données, etc.

```typescript
import MCR from 'monocart-coverage-reports';

import coverageOptions from './mcr.config';

async function globalSetup() {
	const mcr = MCR(coverageOptions);
	mcr.cleanCache();
}

export default globalSetup;
```

#### `global-teardown.ts`

Ce fichier est utilisé pour nettoyer l'environnement de test après l'exécution des tests. Par exemple, vous pouvez l'utiliser pour fermer des connexions à des bases de données, supprimer des fichiers temporaires, etc.

```typescript
import MCR from 'monocart-coverage-reports';

import coverageOptions from './mcr.config';

async function globalTeardown() {
	const mcr = MCR(coverageOptions);
	await mcr.generate();
}

export default globalTeardown;
```

#### `mcr.config.ts`

Ce fichier est utilisé pour la configuration du reporting coverage des tests

```typescript
import { CoverageReportOptions } from 'monocart-coverage-reports';

const coverageOptions: CoverageReportOptions = {
	enable: true,
	name: 'playwright-bdd-coverage',
	reports: ['text', 'text-summary', ['html', { subdirdir: 'coverage' }], ['lcov', { file: 'lcov.info' }]],
	entryFilter: {
		'**/node_modules/**': false,
		'**/tests/**': false,
		'**/*.[jt]s?(x)': true,
		'**/app/**': false,
	},
	sourceFilter: {
		'**/node_modules/**': false,
		'**/tests/**': false,
		'**/*.[jt]s?(x)': true,
		'**/app/**': false,
	},
	outputDir: './coverage/playwright',
};

export default coverageOptions;
```

Exemple de coverage CLI

![image](https://github.com/user-attachments/assets/c26ae8b2-7994-4d69-94d0-68fe58c04916)

Exemple de coverage HTML

![image](https://github.com/user-attachments/assets/8ec498c0-b846-44b0-b66c-46647193bdb0)

### Sources

- [Playwright](https://playwright.dev/docs/intro)
- [Playwright-Bdd](https://vitalets.github.io/playwright-bdd/#/)

### 🙏 Remerciements

Un grand merci à **Paul Plancq** ([@pplanq](https://www.github.com/pplanq)) pour son accompagnement et ses retours techniques tout au long de ce dojo/codelab.  
Merci également à **Olivier Sailly** ([@Olisail](https://www.github.com/Olisail)) pour son soutien, ses conseils et son expertise précieuse.

Votre contribution a largement participé à la qualité de ce projet !

### Contribuer

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request pour toute suggestion ou amélioration.
    
Bonne chance avec votre dojo ! Si vous avez des questions ou des problèmes, n'hésitez pas à demander.