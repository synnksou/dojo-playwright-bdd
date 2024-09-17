# Dojo Playwright et Playwright-BDD

Bienvenue dans ce dojo où vous apprendrez à utiliser Playwright et Playwright-BDD pour tester des fonctionnalités sur GitHub. Vous allez configurer l'authentification, tester la création de commits sur vos propres dépôts, et intégrer le tout dans un pipeline CI/CD avec GitHub Actions.

## Objectifs

01. **Tester la page GiteHub** : Utilisez Playwright pour automatisr les tests de la page d'accueil de GitHub.
2. **Configurer l'authentification** : Mettez en place l'authentification pour accéder à vos dépôts privés.
3. **Tester la création de commits** : Écrivez des tests pour vérifier la création de commits sur vos dépôts.
4. **Tester le telechargement du repo** : Écrivez des tests pour vérifier que le téléchargement du répos fonctionne.
5. **CI/CD avec GitHub Actions** : Configurez un pipeline GitHub Actions pour exécuter vos tests automatiquement.
6. **Tester sur votre projet** : Essayer de tester une page sur votre application/projet

## Prérequis

- Node.js installé sur votre machine. (Node 18)
- Un compte GitHub avec accès aux repos à tester.

## Installation

### 1. Forkez le repo et Clo,ne

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

Après l'installation PW et des packages, il faut configurer la config pour votre utilisation, dans notre cas avec playwright-bdd vous devriez modifier le `testDir` de Playwright de base

Ici pour une config simpliste on vas juster donner le path pour les features et steps,

```typescript
const testDir = defineBddConfig({
    features: 'tests/features/**/*.feature',
    steps: 'tests/features/**/*.stepdefinitions.ts',
});
```
[API CONFIG de Playwright-bdd](https://vitalets.github.io/playwright-bdd/#/configuration/options)

Ensuite pour continuer il faudra ajouter ce testDir au params de la config PW :)

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

Playwright lis automatiquement le defineConfig en export


## Écriture des tests

### Test de la page GitHub

Vous devrez tester la remplissage de l'email et ça redirection sur le bouton

Créez un fichier de test sous `tests/home/home.stepdefinitions.ts` et votre premier Gherkin dans  `tests/home/home.feature`:

Vous pouvez passé des variables de votre Gherkin au Step en passant "{string}" dans votre Step 

Exemple : 

En Gherkin
```gherkin
    Then I should see the message "I hate Cypress"
```

En Ts
```typescript
    Then('I should see the message {string}', async ({ page }, text: string) => {})
```

Debut du test
```gherkin
Feature: GitHub Home Page

    Scenario: Check Redirection
    ....
```




### Test de création de commit

Créez un fichier de test sous `tests/commit.spec.js` :

```javascript

```

### Utilisation de Playwright-BDD

Si vous souhaitez utiliser Playwright-BDD, installez le package :

```bash
npm install playwright-bdd
```

Créez un fichier `.feature` dans le dossier `features`, par exemple `github.feature` :

```gherkin
Feature: Tester la page d'accueil de GitHub

  Scenario: Vérifier le titre de la page GitHub
    Given je suis sur la page d'accueil de GitHub
    Then je devrais voir "GitHub" dans le titre
```

Créez le fichier de définition des étapes correspondant dans `features/steps/github.steps.js` :

```javascript

Given('je suis sur la page d\'accueil de GitHub', async function () {
  await this.page.goto('https://github.com');
});

Then('je devrais voir {string} dans le titre', async function (title) {
  await expect(this.page).toHaveTitle(new RegExp(title));
});
```

## Configuration CI/CD avec GitHub Actions

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
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
        env:
          GITHUB_USERNAME: ${{ secrets.GITHUB_USERNAME }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Assurez-vous d’ajouter les secrets `GITHUB_USERNAME` et `GITHUB_TOKEN` dans les paramètres de votre dépôt GitHub (`Settings > Secrets and variables > Actions`).

## Exécution des Tests

Pour exécuter les tests localement, utilisez la commande suivante :

```bash
npx playwright test
```


Pour exécuter les tests localement avec ui, utilisez la commande suivante :

```bash
npx playwright test --ui
```


## Contribuer

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request pour toute suggestion ou amélioration.

Bonne chance avec votre dojo ! Si vous avez des questions ou des problèmes, n'hésitez pas à demander.
