# Etape 7 - Developper avec un agent IA

Cette etape montre comment utiliser un agent IA avec Playwright et Playwright-BDD.
L'objectif n'est pas de demander a l'agent de coder immediatement, mais de faire du
scenario Gherkin l'espace de discussion, de validation et finalement le test
d'acceptation.

## Objectifs

- formuler une demande fonctionnelle courte pour un agent IA ;
- lui demander de proposer un scenario Gherkin avant toute implementation ;
- relire et simplifier le scenario avec l'equipe ;
- faire implementer les etapes Playwright apres approbation ;
- executer `bddgen` puis Playwright pour verifier le comportement.

## Le workflow

### 1. Commencer par le comportement

Dans VS Code, ouvrez l'agent IA et donnez une demande volontairement courte :

```text
Ajoute une pagination a la liste des utilisateurs.
La liste doit afficher 5 utilisateurs par page.
Propose d'abord un scenario Playwright-BDD, sans modifier le code.
```

Le scenario est la premiere proposition de travail. Il permet de discuter du
comportement attendu sans imposer tout de suite la structure React, le modele
d'etat ou les selecteurs.

### 2. Iterer sur le fichier feature

Demandez a l'agent de garder le scenario lisible et centre sur le parcours
utilisateur. Un scenario approuve peut ressembler a ceci :

```gherkin
Feature: Liste des utilisateurs

  Scenario: Parcourir la liste paginee
    Given je suis sur la liste des utilisateurs
    Then je vois le titre "Users"
    And je vois 5 utilisateurs dans le tableau
    And le premier utilisateur est "Leanne Graham"
    When je clique sur le bouton de page suivante
    Then je vois 5 utilisateurs dans le tableau
    And le premier utilisateur est "Mrs. Dennis Schulist"
    When je clique sur le bouton de page precedente
    Then le premier utilisateur est "Leanne Graham"
```

Un bon scenario de BDD decrit ce que l'utilisateur observe. Il ne dicte pas
l'implementation et evite les details techniques qui n'ont pas de valeur
fonctionnelle.

### 3. Approuver avant d'implementer

Demandez a l'agent :

```text
Le scenario est approuve. Implemente le comportement et les step definitions
Playwright correspondantes. Utilise des roles accessibles et lance bddgen puis
les tests Playwright. Signale les hypotheses et les tests qui manquent.
```

L'agent peut alors ajouter ou modifier l'application, le fichier `.feature` et
les fichiers `.stepdefinitions.ts`. Relisez toujours le diff : BDD clarifie le
comportement, mais ne remplace pas le jugement d'ingenierie.

### 4. Ecrire des steps courtes

Les definitions d'etapes doivent rester proches de leur phrase Gherkin :

```typescript
When('je clique sur le bouton de page suivante', async ({ page }) => {
  await page.getByRole('button', { name: 'Next page' }).click();
});

Then('le premier utilisateur est {string}', async ({ page }, name: string) => {
  await expect(page.getByTestId('user-row').first()).toContainText(name);
});
```

Preferer les roles, labels et attributs de test stables aux selecteurs CSS
fragiles. Les steps ne doivent pas contenir de logique metier complexe.

### 5. Verifier le resultat

Depuis la racine du projet :

```bash
npx bddgen
npx playwright test
```

Pour le debug :

```bash
npx playwright test --ui
```

Le fichier `examples/ai-assisted-bdd/users-pagination.feature` contient la
proposition complete utilisee dans cet exercice. Il est volontairement place
hors de `tests/features`, car l'application de pagination n'est pas fournie
dans ce dojo et l'exemple est une base de travail pour votre agent.

## BDD ou SDD ?

Un scenario BDD est tres efficace quand le changement possede un parcours
utilisateur clair. Il sert a la fois de conversation avec l'agent, de contrat
relisible et de test automatise.

Un document de conception reste preferable pour une migration, une decision
d'architecture, un changement de modele de donnees ou une optimisation de
performance. Dans ces cas, BDD peut rester une partie du processus, mais ne
doit pas remplacer la conception technique.

## Ressource

- [Why I Prefer BDD over SDD for Agentic Development](https://dev.to/vitalets/why-i-prefer-bdd-over-sdd-for-agentic-development-4c3d)
- [Playwright-BDD](https://vitalets.github.io/playwright-bdd/#/)
- [Playwright](https://playwright.dev/docs/intro)## 📊 Coverage (monocart)

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