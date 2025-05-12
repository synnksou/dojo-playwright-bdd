# 🧪 Dojo Playwright & Playwright-BDD (WIP V2)

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

📁 `tests/features/`
C’est ici que tu places tous tes **scénarios BDD** écrits en Gherkin (`.feature`) ainsi que leurs définitions (`.stepdefinitions.ts`).

Exemple :
    * `my-feature.feature`: contient les scénarios de test (Given, When, Then…)
    * `my-feature.stepdefinitions.ts` : contient l’implémentation de ces étapes en TypeScript ou Javascrippt via Playwright-BDD

Cette organisation par **feature** permet de regrouper facilement les tests liés à une même fonctionnalité.

📁 `tests/utils/`
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

When('....', async ({ page }, title) => {
....
});

Then('....', async ({ page }, title) => {
....
});
```

Ensuite utilisez la commande

`npx bddgen` ou `npm run test` qui lance bddgen & playwright

#### 🔁 Test Redirection Duende

Énoncé :Écrivez un test end-to-end pour vérifier qu’un utilisateur est bien redirigé et voit un message spécifique après avoir tenté de se connecter à la page de démonstration Duende.

##### Étapes :
1. Créer le fichier `home.feature` dans tests/home/ :
    * Décrire le scénario Gherkin avec les étapes de connexion.

2. Créer home.stepdefinitions.ts dans tests/home/ :
    * Implémenter chaque étape (remplir le login, le mot de passe, cliquer, vérifier le message).

<details>
    <summary>Réponse</summary>

Créez un fichier de test sous `tests/home/home.stepdefinitions.ts` et votre premier Gherkin dans `tests/home/home.feature` :

**`tests/home/home.feature`** :

```gherkin
Feature: Page d'accueil Duende 

  Scenario: Vérifier la redirection
    Given Je suis sur la page d'accueil de Duende Demo
    When Je remplis le champ de saisie Login
    And Je remplis le champ de saisie du mot de passe
    And Je clique sur le bouton "Login"
    Then Je devrais voir le message "Authentication Cookie"
```

**`tests/home/home.stepdefinitions.ts`** :

```typescript
import { Given, When, Then } from 'playwright-bdd';
import { expect } from '@playwright/test';

Given("Je suis sur la page d'accueil de Duende Demo Diag", async ({ page }) => {
	await page.goto('https://demo.duendesoftware.com/diagnostics');
	await expect(page).toHaveTitle(/Duende IdentityServer/);
});

When('Je remplis le champ de saisie Login', async ({ page }) => {
	await page.locator('#Input_Username').fill(process.env.DUENDE_USERNAME);
});


When('Je remplis le champ de saisie du mot de passe', async ({ page }) => {
	await page.locator('#Input_Password').fill(process.env.DUENDE_PASSWORD);
});

When('Je clique sur le bouton "Login"', async ({ page }) => {
  await page.getByRole('button', { name: 'Login' }).click();
});

Then('Je devrais voir le message {string}', async ({ page }, text: string) => {
	await page.getByText(text).isVisible();
});
```

</details>

#### 🎯Ajout du test d'authentification persistante

##### 🔐 Mise en place de l’authentification persistante avec Playwright

Pour mettre en place une authentification persistante dans vos tests avec **Playwright**, plusieurs approches sont possibles, chacune avec ses avantages selon le contexte.

**✅ Option recommandée : Project Dependency (authentification avant tous les tests)**

La méthode la plus propre et modulaire consiste à créer un projet spécifique dédié à l’authentification (via un fichier `auth.setup.ts`), puis à l’utiliser comme **dépendance** dans votre configuration. Cela permet d’exécuter l’authentification une seule fois **avant toute la suite de tests**, tout en gardant une architecture claire et scalable.

**🔁 Alternative : Global Setup**

Si vous ne souhaitez pas utiliser le système de projets multiples, vous pouvez opter pour le **global setup**, une fonction spéciale qui s’exécute une seule fois **avant tous les tests**. Elle est idéale pour effectuer des actions globales, comme la connexion à une application et la sauvegarde du contexte utilisateur ou encore du coverage.

**🧩 Autre possibilité : Hooks (Before / After)**

Si vous utilisez **playwright-bdd**, vous pouvez recourir aux **hooks** (`Before`, `After`) pour exécuter du code avant ou après chaque scénario. Cette approche fonctionne bien, mais elle implique que l’authentification se répète à chaque scénario, ce qui peut nuire à la performance.

**💡 Meilleure pratique : Fixtures**

Playwright propose une alternative plus puissante et flexible que les hooks : **les fixtures**. Elles permettent de gérer et partager un état (comme une session d’utilisateur) entre les tests, avec un meilleur contrôle sur leur cycle de vie. Les fixtures sont fortement recommandées par Playwright, car elles remplacent avantageusement les hooks en termes de lisibilité, modularité et maintenabilité.

Dans notre cas nous allons rester sur la simplicité le `Project Dependency`.

<br>
<details>
    <summary>  🧠 <b> À savoir – Petit rappel des concepts </b>: </summary>

* **Hook (Before, After)** : Fonctions exécutées avant ou après chaque scénario. Pratiques pour des actions répétitives. Vous pouvez les retrouvez ici [Hooks](https://vitalets.github.io/playwright-bdd/#/writing-steps/hooks)
* **BeforeAll / AfterAll** : Exécuté une seule fois avant/à la fin de tous les tests dans un fichier ou un projet.
* **Global setup** : Exécuté une seule fois avant toute la suite de tests, idéal pour des configurations lourdes comme l’authentification, coverage.
* **Project dependency** : Permet de structurer des dépendances entre projets de test
* **Fixtures** : Systèmes de gestion d’état et de ressources partagées dans Playwright, remplaçant les hooks avec une approche plus modulaire.
</details>
</br>


**Option : Project Dependency (la plus simple)**

Cette méthode consiste à utiliser un fichier de setup (auth.setup.ts) pour effectuer l’authentification une fois, puis à injecter le contexte de session (cookies, localStorage, etc.) dans les tests via la configuration du projet.

##### Etapes:

1. Créer le fichier `auth.setup.ts` dans tests/utils/ :
    * Scripter la connexion automatique à Duende et sauvegarder l'état avec storageState.
      * Se connecter à l’application.
      * Sauvegarder le contexte dans un fichier (auth.json par exemple).

2. Modifier `playwright.config.ts` :
   * Dans le fichier `playwright.config.ts`, créez un projet Playwright qui dépend de ce setup via dependencies.   
     * Ajouter un projet auth pour exécuter ce test en premier.
     * Ajouter storageState: `tests/.auth/user.json` dans les autres projets.

💾 **À quoi sert storageState ?**
`storageState` est une option de configuration dans Playwright qui permet de charger un état de session précédemment sauvegardé. Ce fichier contient toutes les informations nécessaires à la simulation d’un utilisateur déjà connecté :
   * Cookies,
   * Local storage,
   * Sessions,
   * etc.

<details>
    <summary>Réponse</summary>

```typescript
import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
	await page.goto('https://demo.duendesoftware.com/diagnostics');

	await expect(page).toHaveTitle(/Duende IdentityServer/);

	await page.locator('#Input_Username').fill(process.env.DUENDE_USERNAME);

	await page.locator('#Input_Password').fill(process.env.DUENDE_PASSWORD);

    await page.getByRole('button', { name: 'Login' }).click();

	await page.context().storageState({ path: authFile });
});
```

Ou sinon vous pouvez directement faire une request post par exemple sur une auth github

```typescript
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
	// Send authentication request. Replace with your own.
	await request.post('https://github.com/login', {
		form: {
			user: 'user',
			password: 'password',
		},
	});
	await request.storageState({ path: authFile });
});
```

> 💡 Dans cette méthode, on utilise [`APIRequestContext`](https://playwright.dev/docs/api/class-apirequestcontext) :  
> C’est un objet fourni par Playwright permettant de faire des requêtes HTTP directement (POST, GET, etc.) sans ouvrir de navigateur.  
> Il est idéal pour réaliser une authentification via une API, récupérer un token, puis sauvegarder le contexte utilisateur pour le réutiliser dans vos tests.


Ensuite il suffit de l'ajouter dans la config Playwright dans le fichier `playwright.config.ts`

```typescript
export default defineConfig({
	testDir,
	...,
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

```

🧠 **Pourquoi utiliser dependencies: `['auth']` ?**

L’option dependencies permet de spécifier que le projet principal (chromium, ici) dépend du projet auth. Cela garantit que le projet auth est exécuté et terminé avant que chromium ne démarre ses tests.

Ce mécanisme est crucial lorsque vous avez besoin :

* d’effectuer une authentification une seule fois,

* de sauvegarder un état de session (storageState),

* et de le réutiliser dans tous les autres projets de test.

✅ En déclarant cette dépendance, vous assurez que tous vos tests bénéficient d’un contexte utilisateur déjà authentifié, sans avoir à refaire l’authentification à chaque test.


</details>

Exemple d'image
![image](https://github.com/user-attachments/assets/c2597549-1ad7-4127-a1a3-469f756862df)

#### 👤Test Profil Utilisateur

Énoncé : Écrivez un test BDD avec Playwright pour vérifier que, lorsqu’un utilisateur authentifié accède à la page Diagnostics de Duende IdentityServer, il peut consulter les informations de son profil utilisateur. Sur le site https://demo.duendesoftware.com

##### Etapes:

1. Créer `profile.feature` dans tests/profile/ :
    * Gherkin avec étapes "authentifié", navigation vers profil ("see the claims)" et vérifications.

2. Créer `profile.stepdefinitions.ts` dans le même dossier :
    * Utiliser la session persistée pour accéder au profil.

<details>
    <summary>Réponse</summary>


📄 tests/profile/profile.feature

```gherkin
Feature: Profil Duende

  Scenario: Vérification des informations du profil utilisateur
    Given Je suis authentifié sur le Duende
    When Je navigue vers le profil
    Then Je devrais voir les cookies
    And Je devrais voir les droits
```

```typescript
import { Given, When, Then } from 'playwright-bdd';

Given('Je suis authentifié sur le Duende', async ({ page }) => {
  // TODO: Aller sur la page diagnostics en étant connecté
    await page.goto('https://demo.duendesoftware.com');
});

When('Je navigue vers le profil', async ({ page }) => {
    await page.getByRole('listitem').filter({ hasText: 'Click here to see the claims' }).getByRole('link').click();
});

Then('Je devrais voir les cookies', async ({ page }) => {
    await page.getByRole('heading', { name: 'Properties' }).click();
});

Then('Je devrais voir les droits', async ({ page }) => {
    await page.getByRole('heading', { name: 'Claims' }).click();
});
```
</details>


#### 📦 Test de téléchargement GitHub

Énoncé : Écrivez un test pour vérifier que l'utilisateur peut télécharger le repo "dojo-playwright-bdd" en cliquant sur le bouton "Download ZIP" et que le téléchargement est réussi.

##### Etapes:

1. Créer `download.feature` dans tests/download/ :
    * Gherkin décrivant navigation et téléchargement.

2. Créer `download.stepdefinitions.ts` :
    * Utiliser `waitForEvent('download')` + `fs` pour vérifier que le fichier ZIP est téléchargé.
    * Créer un dossier temporaire (temp/) pour les fichiers téléchargés.

**📌 waitForEvent**

Playwright propose une API appelée `waitForEvent` qui permet d’attendre un événement spécifique.

Cela suspendra l'exécution jusqu'à ce qu'un téléchargement démarre (clic sur un lien de téléchargement, bouton, etc.)

CF [API Download Playwright](https://playwright.dev/docs/api/class-download)
CF [API waitForEvent](https://playwright.dev/docs/api/class-websocket#web-socket-wait-for-event)

Exemple :
```typescript
const download = await page.waitForEvent('download');
```

**📦 fs (File System)**
Le module fs de Node.js permet de manipuler le système de fichiers, notamment pour :
   * Vérifier si un fichier a bien été téléchargé,
   * Lire, déplacer ou supprimer des fichiers,
   * Gérer un dossier temporaire pour stocker les fichiers téléchargés (ex: temp/).
  


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

Step.ts
```typescript
import { expect } from '@playwright/test';
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

#### ♿️ Test d'Accessibilité des images (attributs alt)

Énoncé : Écrivez un test BDD avec Playwright pour vérifier que toutes les balises <img> présentes sur la page https://fake-university.com/news-and-events.html possèdent un attribut alt renseigné.

##### Étapes :

1. Créer `accessibility.feature` dans tests/accessibility/ :
   * Gherkin décrivant chargement de la page et vérification des alt.

2. Créer `accessibility.stepdefinitions.ts` :
    * Utiliser `page.evaluate()` pour vérifier que chaque image a un alt non vide.

**🔍 À quoi sert page.evaluate() dans ce test ?**
La méthode `page.evaluate()` de Playwright permet d’exécuter du JavaScript directement dans le contexte du navigateur, comme si vous étiez dans la console DevTools.
Cela signifie que vous pouvez interagir directement avec le DOM de la page, récupérer ou manipuler des éléments, ou effectuer des vérifications complexes.

CF [API Evaluate](https://playwright.dev/docs/api/class-worker#worker-evaluate)


<details>
<summary>Réponse</summary>
    
Gherkin 
```gherkin
Feature: Accessibilité des images

  Scenario: Vérifier que toutes les images ont un attribut alt
    Given Je visite la page d'actualités et d'événements de la fausse université
    When La page est entièrement chargée   
    Then Toutes les images doivent avoir un attribut alt non vide
```

Step.ts
```typescript
const { Given, When, Then } = createBdd();

Given("Je visite la page d'actualités et d'événements de la fausse université", async ({ page }) => {
	await page.goto('https://fake-university.com/news-and-events.html');
});

When('La page est entièrement chargée', async ({ page }) => {
	await page.getByRole('heading', { name: 'News & Events' }).click();
});

Then('Toutes les images doivent avoir un attribut alt non vide', async ({ page }) => {
	const imagesWithoutAlt = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('img'))
			.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '')
			.map(img => img.src); // pour log/debug
	});

	expect(imagesWithoutAlt.length).toBe(0);
});
```

**📦 Alternative : axe-playwright**

Vous pouvez aussi utiliser la librairie axe-playwright pour faire des audits d’accessibilité automatisés. Elle détecte les problèmes d’accessibilité courants, y compris l'absence d'attributs alt, et fournit des rapports détaillés.

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
