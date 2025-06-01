# Test du Profil

### 🧪 Exécution des tests

Pour exécuter les tests localement, utilisez la commande suivante :

```bash
npx playwright test
```

Pour exécuter les tests localement avec l'interface utilisateur, utilisez la commande suivante :

```bash
npx playwright test --ui
```

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

When('....', async ({ page }, title) => {
....
});

Then('....', async ({ page }, title) => {
....
});
```

Ensuite utilisez la commande

`npx bddgen` ou `npm run test` qui lance bddgen & playwright

#### 🔁 Test d'affichage de la Page Duende

Vérifier que lorsqu’un utilisateur accède à la page https://demo.duendesoftware.com/, un texte spécifique comme "Welcome to the IdentityServer demo" est bien affiché.

##### Étapes :
1. Créer le fichier `home.feature` dans `tests/features/home/` :
    * Écrire un scénario Gherkin décrivant l'accès à la page d’accueil de Duende et la vérification d’un texte affiché.

2. Créer `home.stepdefinitions.ts` dans `tests/features/home/` :
    * Implémenter les étapes suivantes :
      * Aller sur la page https://demo.duendesoftware.com/
      * Attendre que la page soit complètement chargée
      * Vérifier qu’un message spécifique (ex. : "Welcome to Duende IdentityServer") est affiché

<details>
    <summary>Réponse</summary>

Créez un fichier de test sous `tests/home/home.stepdefinitions.ts` et votre premier Gherkin dans `tests/home/home.feature` :

**`tests/home/home.feature`** :

```gherkin
Feature: Accès à la page d'accueil Duende

  Scenario: L'utilisateur voit le contenu de la page d'accueil
    Given Je suis sur la page d'accueil de Duende
    When La page est complètement chargée
    Then Je devrais voir le texte "Welcome to the IdentityServer demo"
```

**`tests/home/home.stepdefinitions.ts`** :

```typescript
Given("Je suis sur la page d'accueil de Duende", async ({ page }) => {
  await page.goto('https://demo.duendesoftware.com/');
});

When("La page est complètement chargée", async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
});

Then("Je devrais voir le texte {string}", async ({ page }, expectedText: string) => {
  const isVisible = await page.getByText(expectedText, { exact: false }).isVisible();
  expect(isVisible).toBeTruthy();
});

```

</details>


[https://github.com/synnksou/dojo-playwright-bdd/tree/dojo/step-two](➡️ Passer à l'exercice suivant – branche dojo/step-two)