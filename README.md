# 🧪 Dojo Playwright & Playwright-BDD

Bienvenue dans ce dojo où vous apprendrez à utiliser Playwright et Playwright-BDD pour automatiser des tests end-to-end sur une application web. Vous mettrez en place une authentification persistante, testerez la connexion à une page sécurisée, la consultation d'un profil utilisateur, le téléchargement d’un dépôt GitHub, et vérifierez l’accessibilité ainsi que la couverture de vos tests.

## 🎯 Objectifs

1. **Tester la page Duende** :  Vérifiez la redirection et les messages après une tentative de connexion.
2. **Configurer l'authentification** : Mettez en place une session authentifiée persistante.
3. **Teste du Profil** : Vérifiez que les informations de session sont visibles après login avec l'utilisation d'un setup.
4. **Tester le téléchargement du repo** : Vérifiez que l’utilisateur peut télécharger le repo GitHub.
5. **Tester d'Accessibilité** : Assurez-vous que toutes les images ont un alt.
6. **Ajouter le coverage de code** : Générez un rapport de couverture pour vos tests.


## ✅ Prérequis

- Node.js installé sur votre machine. (Node 18)
- Connaissance de Js et Ts

## 🚀 Installation

### 1. Forkez le repo et clonez

```bash
git clone https://github.com/votre-utilisateur/dojo-playwright-bdd.git
cd dojo-playwright-bdd
```

### 2. Installer les dépendances
Installez PW

```bash
npx playwright install
```

Installez les autres deps

```bash
npm install
```

## Configuration

### 🧩 Playwright et Playwright-BDD
Après avoir installé **Playwright** ainsi que les packages nécessaires à l’utilisation de Playwright-BDD, il est important de configurer correctement l’environnement de test.

#### 📁 Configuration de base avec `defineBddConfig`
Lorsque vous utilisez Playwright-BDD, il faut spécifier où se trouvent vos fichiers `.feature` et leurs fichiers de définition de pas (`.stepdefinitions.ts`). Pour cela, on utilise la fonction `defineBddConfig` dans le fichier  `playwright.config.ts`:

```typescript
const testDir = defineBddConfig({
	features: 'tests/features/**/*.feature',
	steps: 'tests/features/**/*.stepdefinitions.ts',
});
```

[Voir la documentation officielle de playwright-bdd](https://vitalets.github.io/playwright-bdd/#/configuration/options)

#### 🛠 Intégration dans la configuration globale `playwright.config.ts`

Une fois votre `testDir` défini, il suffit de l’injecter dans la configuration Playwright principale :

```typescript
export default defineConfig({
    testDir, // Le répertoire défini avec defineBddConfig    ...
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
```
[Voir la documentation officielle de Playwright sur la configuration](https://playwright.dev/docs/test-configuration)

Cela permet à Playwright de charger correctement vos scénarios BDD (Gherkin) et leurs étapes associées au moment du lancement des tests.

### 📁 Structure recommandée

![Arboresence de Structure]({6DAB1FC4-B7AF-471C-B28B-A5CB1B6621AF}.png)

#### 📁 `tests/features/`
C’est ici que tu places tous tes **scénarios BDD** écrits en Gherkin (`.feature`) ainsi que leurs définitions (`.stepdefinitions.ts`).

Exemple :
    * `my-feature.feature`: contient les scénarios de test (Given, When, Then…)
    * `my-feature.stepdefinitions.ts` : contient l’implémentation de ces étapes en TypeScript ou Javascrippt via Playwright-BDD

Cette organisation par **feature** permet de regrouper facilement les tests liés à une même fonctionnalité.

#### 📁 `tests/utils/`
Ce dossier est destiné à des outils partagés ou des scripts de préparation, exemple :
 * `auth.setup.ts`: un fichier servant à créer un contexte d’authentification persistent utilisé dans les tests, par exemple via [`APIRequestContext`](https://playwright.dev/docs/api/class-apirequestcontext) et [`storageState`](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-storage-state).

Ce fichier peut être lancé via un projet Playwright dédié dans la config (avec la propriété `testMatch`).

### 🧪 Exécution des tests

Pour exécuter les tests localement, utilisez la commande suivante :

```bash
npx playwright test
```

Pour exécuter les tests localement avec l'interface utilisateur, utilisez la commande suivante :

```bash
npx playwright test --ui
```

### Écriture des tests


#### Exemple d'utilisation Playwright-bdd

Pour mettre en place un scénario de test avec playwright-bdd, suivez les étapes suivantes :
Commencez par ajouter un fichier `.feature` dans le dossier features. Par convention, il est organisé par composant, par exemple :`features/<nomDuComposant>/<nomDuFichier>.feature`.
Ce fichier décrit en langage Gherkin le comportement attendu. Par exemple :

```gherkin
Feature: Gestion du panier

  Scenario: Ajout d'un produit dans le panier
....
```
Pour chaque fichier .feature, il faut créer un fichier de définitions d'étapes correspondant dans le même dossier, avec l'extension `.stepdefinitions.tsx`. 

Ce fichier associe chaque étape Gherkin à une fonction de test Playwright :

```typescript
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('...', async ({ page }) => {
  ....
});

When('....', async ({ page }, title) => {
....
});

Then('....', async ({ page }, title) => {
....
});
```

Une fois vos fichiers .feature et leurs définitions prêtes, vous pouvez lancer les tests avec :

Cette commande génère les fichiers de test compatibles Playwright à partir de vos fichiers .feature et exécute les scénarios définis.
```bash
npx bddgen
```

```bash
npx playwright
```

Pour plus de simplicité, le projet fournit déjà plusieurs scripts dans le fichier package.json pour simplifier l'exécution des tests :
* `watch:bdd` : génère automatiquement les fichiers Playwright à chaque modification d’un fichier .feature ou .stepdefinitions.
* `watch:pw` : lance l’interface graphique de Playwright pour exécuter et visualiser les tests.
* `watch` : exécute en parallèle watch:bdd et watch:pw pour un flux de travail complet.
  
Vous pouvez donc simplement lancer :

```bash
npm run watch
```

Après avoir compris et installez le nécessaire vous pouvez passer au première exo ! :
### [Passage au prochaine exercice !](https://github.com/synnksou/dojo-playwright-bdd/blob/dojo/step-one/README.md)






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
