# 👤Test Profil Utilisateur

Énoncé : Écrivez un test BDD avec Playwright pour vérifier que, lorsqu’un utilisateur authentifié accède à la page Diagnostics de Duende IdentityServer, il peut consulter les informations de son profil utilisateur. Sur le site https://demo.duendesoftware.com

## Etapes:

1. Créer `profile.feature` dans `tests/profile/` :
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

import { Given, When, Then } from '@utils/fixtures';

Given('Je suis authentifié sur le Duende', async ({ page }) => {
	await page.goto('https://demo.duendesoftware.com');
});

When('Je navigue vers le profil', async ({ page }) => {
	await page.getByRole('link', { name: 'Go ' }).nth(1).click();
});

Then('Je devrais voir les cookies', async ({ page }) => {
	await page.getByRole('heading', { name: 'Properties' }).click();
});

Then('Je devrais voir les droits', async ({ page }) => {
	await page.getByRole('heading', { name: 'Claims' }).click();
});

```
</details>
    
[➡️ Passer à l'exercice suivant](https://github.com/synnksou/dojo-playwright-bdd/tree/dojo/step-four/README.md)