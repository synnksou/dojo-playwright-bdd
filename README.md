# Dojo Playwright et Playwright-BDD

Bienvenue dans ce dojo où vous apprendrez à utiliser Playwright et Playwright-BDD pour tester des fonctionnalités sur GitHub. Vous allez configurer l'authentification, tester la création de commits sur vos propres dépôts, et intégrer le tout dans un pipeline CI/CD avec GitHub Actions.

## Objectifs

1. **Tester la page GitHub** : Utilisez Playwright pour automatiser les tests de la page d'accueil de GitHub.
2. **Configurer l'authentification** : Mettez en place l'authentification pour accéder à vos dépôts privés.
3. **Tester la création de commits** : Écrivez des tests pour vérifier la création de commits sur vos dépôts.
4. **Tester le téléchargement du repo** : Écrivez des tests pour vérifier que le téléchargement du repo fonctionne.
5. **CI/CD avec GitHub Actions** : Configurez un pipeline GitHub Actions pour exécuter vos tests automatiquement.
6. **Tester sur votre projet** : Essayez de tester une page sur votre application/projet.

## Prérequis

- Node.js installé sur votre machine. (Node 18)
- Un compte GitHub avec accès aux repos à tester.

## Installation

### 1. Forkez le repo et clonez

```bash
git clone https://github.com/votre-utilisateur/dojo-playwright.git
cd dojo-playwright
```

### 2. Installez les dépendances

```bash
npm install
```

### 3. Configurez l'authentification

Créez un fichier `.env` à la racine du projet et ajoutez vos informations d'authentification GitHub :

```
GITHUB_USERNAME=VotreNomDUtilisateur
GITHUB_PASSWORD=VotreMotDePasse
```

## Configuration

### Playwright et Playwright-BDD

Après l'installation de Playwright et des packages, il faut configurer la configuration pour votre utilisation. Dans notre cas, avec Playwright-BDD, vous devriez modifier le `testDir` de Playwright de base.

Ici, pour une configuration simpliste, on va juste donner le chemin pour les features et steps :

```typescript
const testDir = defineBddConfig({
    features: 'tests/features/**/*.feature',
    steps: 'tests/features/**/*.stepdefinitions.ts',
});
```
[API CONFIG de Playwright-BDD](https://vitalets.github.io/playwright-bdd/#/configuration/options)

Ensuite, pour continuer, il faudra ajouter ce `testDir` aux paramètres de la configuration Playwright :

```typescript
export default defineConfig({
    testDir, // Juste ici
    ...
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
```
[API Test configuration Playwright](https://playwright.dev/docs/test-configuration)

### Exécution des Tests

Pour exécuter les tests localement, utilisez la commande suivante :

```bash
npx playwright test
```

Pour exécuter les tests localement avec l'interface utilisateur, utilisez la commande suivante :

```bash
npx playwright test --ui
```


### Écriture des tests

### Exemple d'utilisation Playwright-bdd

Créez un fichier `.feature` dans le dossier `features`, par exemple `<nomDuComposant>/<nomDuFichier>.feature` :

```gherkin
Feature: Gestion du panier

  Scenario: Ajout d'un produit dans le panier
....
```

Créez le fichier de définition des étapes correspondant dans `features/<nomDuComposant>/<nomDuFichier>.stepdefinitions.tsx` :

```typescript
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('...', async ({ page }) => {
  ....
});

Then('....', async ({ page }, title) => {
....
});
```



#### Test de la page GitHub

Énoncé : Écrivez un test pour vérifier que l'utilisateur est redirigé vers la page d'inscription après avoir rempli le champ email et cliqué sur le bouton "Sign up for GitHub". 

<details>
    <summary>Réponse</summary>

Créez un fichier de test sous `tests/home/home.stepdefinitions.ts` et votre premier Gherkin dans `tests/home/home.feature` :
    


**`tests/home/home.feature`** :
```gherkin
Feature: GitHub Home Page

  Scenario: Check Redirection
    Given I am on the GitHub homepage
    When I fill in the email field with "test@example.com"
    And I click the "Sign up for GitHub" button
    Then I should be redirected to the sign-up page
```

**`tests/home/home.stepdefinitions.ts`** :
```typescript
import { Given, When, Then } from 'playwright-bdd';
import { expect } from '@playwright/test';

Given('I am on the GitHub homepage', async ({ page }) => {
  await page.goto('https://github.com');
});

When('I fill in the email field with {string}', async ({ page }, email) => {
  await page.fill('input[name="user[email]"]', email);
});

When('I click the {string} button', async ({ page }, buttonName) => {
  await page.click(`text=${buttonName}`);
});

Then('I should be redirected to the sign-up page', async ({ page }) => {
  await expect(page).toHaveURL(/.*join/);
});
```
</details>

#### Ajout du test d'authentification
>[!WARNING]
>IL NE FAUT PAS AVOIR LA 2FA ACTIVER POUR LA FONCTION DE AUTH, DESACTIVEZ LA POUR LE DOJO SINON FAITE UN @SKIP SUR LA FEATURE COMMIT

Ici pour ce faire, vous avez plusieurs possibilité pour le mettre en place, si vous voulez mettre en place "before overall test" alors, il vaut mieux utilisé les globals setup.

Sinon vous avez des hooks avec playwright-bdd comme `Before` ou `After` qui permette d'utilisé avant chaque scénario, ce sont les hooks mais bien que les hooks soient un concept bien connu, Playwright propose une meilleure alternative : les fixtures. 
Dans la plupart des cas, les fixtures peuvent remplacer entièrement les hooks et offrent de nombreux avantages. Par défaut, pensez toujours à utiliser les fixtures.

Dans notre cas nous allons nous basé sur la simplicité, il faudra juste crée un fichier `auth.setup.ts`, ajoutez votre contexte d'authentification en playwright et l'ajouté en dépendence dans le fichier de config,

Créez le ficher `auth.setup.ts`

```typescript

import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto('https://github.com/login');
	await page.getByLabel('Username or email address').fill('pseudo');
	await page.getByLabel('Password').fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();

	// IF 2FA is enabled, you can add the following code to handle it.
	//await page.pause(); and manualy

	// Alternatively, you can wait until the page reaches a state where all cookies are set.
	await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

	await page.context().storageState({ path: authFile });
});

```

Ou sinon vous pouvez directement faire une request post 

```typescript
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post('https://github.com/login', {
    form: {
      'user': 'user',
      'password': 'password'
    }
  });
  await request.storageState({ path: authFile });
});

```
[APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext)

Ensuite il suffit de l'ajouter dans la config PW

```typescript
export default defineConfig({
	testDir,
	....
	projects: [
		{
			name: 'auth', // ICI L'AUTH
			testMatch: '**/auth.setup.ts',
			testDir: 'tests/utils',
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/user.json' },
			dependencies: ['auth'], // LES TESTS SERONT TJR LANCER AVEC AUTH EN BEFORE
		},
	],
});

```
Exemple d'image
![image](https://github.com/user-attachments/assets/c2597549-1ad7-4127-a1a3-469f756862df)


......

#### Test de création de commit

Énoncé : Écrivez un test pour vérifier que l'utilisateur peut créer un nouveau fichier nommé "test-file.txt" avec le contenu "This is a test file." et que le commit "Create test-file.txt" est créé.

<details>
    <summary>Réponse</summary>

    


Créez un fichier de test sous `tests/commit/commit.feature` : 

```gherkin
Feature: Création de commit

    Scenario: Créer un commit sur GitHub
        Given Je suis connecté à GitHub
        When Je crée un nouveau fichier nommé "test-file.txt" avec le contenu "This is a test file."
        Then Le commit "Create test-file.txt" est créé
```

Créez le fichier de définition des étapes correspondant dans `tests/commit/commit.stepdefinitions.ts` :

```typescript
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

```

</details>

#### Test de création de téléchargement

Énoncé : Écrivez un test pour vérifier que l'utilisateur peut télécharger le repo "dojo-playwright" en cliquant sur le bouton "Download ZIP" et que le téléchargement est réussi.
<details>
<summary>Réponse</summary>
    
Gherkin 
```gherkin
Feature: Téléchargement du repo

    Scenario: Télécharger le repo GitHub
        Given Je suis la page du repo
        When Je télécharge le repo
        Then Le téléchargement est réussi
```

Step 
```typescript
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

```

</details>


## Coverage

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

3. Configuration des fichiers globaux
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


### Configuration CI/CD avec GitHub Actions

Créez un fichier `.github/workflows/test.yml` :

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
        env:
            GITHUB_USERNAME: ${{ secrets.GITHUB_USERNAME }}
            GITHUB_PASSWORD: ${{ secrets.GITHUB_PASSWORD }}
```

Assurez-vous d’ajouter les secrets `GITHUB_USERNAME` et `GITHUB_PASSWORD` dans les paramètres de votre dépôt GitHub (`Settings > Secrets and variables > Actions`).


### Sources
- [Playwright](https://playwright.dev/docs/intro)
- [Playwright-Bdd](https://vitalets.github.io/playwright-bdd/#/)


### Contribuer

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request pour toute suggestion ou amélioration.

Bonne chance avec votre dojo ! Si vous avez des questions ou des problèmes, n'hésitez pas à demander.

