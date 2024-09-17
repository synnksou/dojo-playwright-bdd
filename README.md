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
GITHUB_TOKEN=VotreTokenDAccesPersonnel
```

Assurez-vous d'avoir généré un [token d'accès personnel GitHub](https://github.com/settings/tokens) avec les permissions nécessaires.

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

### Coverage

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
      const isChromium = test.info().project.name === 'chromium';

      if (isChromium) {
        await Promise.all([
          page.coverage.startJSCoverage({
            resetOnNavigation: false,
          }),
        ]);
      }

      await use('autoTestFixture');

      if (isChromium) {
        const [jsCoverage] = await Promise.all([page.coverage.stopJSCoverage()]);
        const coverageList = [...jsCoverage];
        const mcr = MCR(coverageOptions);
        await mcr.add(coverageList);
      }
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
});
```

#### `page.coverage.startJSCoverage`

Cette fonction démarre la collecte de la couverture de code JavaScript pour la page. Elle prend un objet d'options en paramètre, où vous pouvez spécifier des options comme `resetOnNavigation` pour indiquer si la couverture doit être réinitialisée lors de la navigation.

#### `page.coverage.stopJSCoverage`

Cette fonction arrête la collecte de la couverture de code JavaScript et renvoie les données de couverture collectées. Ces données peuvent ensuite être utilisées pour générer des rapports de couverture de code.

3. Créez un fichier de configuration `mcr.config.js` pour `monocart-coverage-reports` :

```javascript
module.exports = {
  reports: {
    html: {
      output: 'coverage/html',
    },
    json: {
      output: 'coverage/coverage-final.json',
    },
  },
};
```

4. Ajoutez un script dans votre `package.json` pour générer le rapport de couverture :

```json
"scripts": {
  "test:coverage": "npx playwright test && npx monocart-coverage-reports"
}
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
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();


Given('Je suis connecté à GitHub', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.fill('input[name="login"]', process.env.GITHUB_USERNAME);
  await page.fill('input[name="password"]', process.env.GITHUB_TOKEN);
  await page.click('input[name="commit"]');
});

When('Je crée un nouveau fichier nommé {string} avec le contenu {string}', async ({ page }, fileName, content) => {
  await page.goto('https://github.com/votre-utilisateur/dojo-playwright');
  await page.click('text=Add file');
  await page.click('text=Create new file');
  await page.fill('input[name="filename"]', fileName);
  await page.fill('.CodeMirror', content);
  await page.click('text=Commit new file');
});

Then('Le commit {string} est créé', async ({ page }, commitMessage) => {
  const message = await page.textContent('.commit-message');
  expect(message).toContain(commitMessage);
});
```

</details>

#### Test de création de téléchargement

Énoncé : Écrivez un test pour vérifier que l'utilisateur peut télécharger le repo "dojo-playwright" en cliquant sur le bouton "Download ZIP" et que le téléchargement est réussi.
<details>
<summary>Réponse</summary>
    

```gherkin
Feature: Téléchargement du repo

  Scenario: Télécharger le repo GitHub
    Given Je suis connecté à GitHub
    When Je télécharge le repo "dojo-playwright"
    Then Le téléchargement est réussi
```

</details>


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
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Assurez-vous d’ajouter les secrets `GITHUB_USERNAME` et `GITHUB_TOKEN` dans les paramètres de votre dépôt GitHub (`Settings > Secrets and variables > Actions`).

### Exécution des Tests

Pour exécuter les tests localement, utilisez la commande suivante :

```bash
npx playwright test
```

Pour exécuter les tests localement avec l'interface utilisateur, utilisez la commande suivante :

```bash
npx playwright test --ui
```

### Contribuer

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request pour toute suggestion ou amélioration.

Bonne chance avec votre dojo ! Si vous avez des questions ou des problèmes, n'hésitez pas à demander.

