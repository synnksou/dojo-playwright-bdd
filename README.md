# 📦 Test de téléchargement GitHub

Énoncé : Écrivez un test pour vérifier que l'utilisateur peut télécharger le repo "dojo-playwright-bdd" en cliquant sur le bouton "Download ZIP" et que le téléchargement est réussi.

## Etapes:

1. Créer `download.feature` dans tests/download/ :
    * Gherkin décrivant navigation et téléchargement.

2. Créer `download.stepdefinitions.ts` :
    * Utiliser `waitForEvent('download')` + `fs` pour vérifier que le fichier ZIP est téléchargé.
    * Créer un dossier temporaire (temp/) pour les fichiers téléchargés.

###### **📌 waitForEvent**

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

📄 `tests/download/download.feature`
```gherkin
Feature: Téléchargement du repo

    Scenario: Télécharger le repo GitHub
        Given Je suis la page du repo
        When Je télécharge le repo
        Then Le téléchargement est réussi

```

📄 `tests/download/download.stepdefinitions.ts`
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

[➡️ Passer à l'exercice suivant](https://github.com/synnksou/dojo-playwright-bdd/tree/dojo/step-five/README.md)