# 🎯 Ajout du test d'authentification persistante

## 📝 Introduction

Ce guide présente comment configurer une **authentification persistante avec Playwright** pour éviter de répéter la connexion à chaque test. Nous verrons plusieurs approches disponibles dans Playwright, avec un focus sur la méthode recommandée : **Project Dependency**, permettant une authentification unique au début de l'exécution des tests.

---

### 🔐 Mise en place de l’authentification persistante avec Playwright

Pour mettre en place une authentification persistante dans vos tests avec **Playwright**, plusieurs approches sont possibles, chacune avec ses avantages selon le contexte.

#### ✅ Option recommandée : Project Dependency (authentification avant tous les tests)

La méthode la plus propre et modulaire consiste à créer un projet spécifique dédié à l’authentification (via un fichier `auth.setup.ts`), puis à l’utiliser comme **dépendance** dans votre configuration. Cela permet d’exécuter l’authentification une seule fois **avant toute la suite de tests**, tout en gardant une architecture claire et scalable.

#### 🔁 Alternative : Global Setup

Si vous ne souhaitez pas utiliser le système de projets multiples, vous pouvez opter pour le **global setup**, une fonction spéciale qui s’exécute une seule fois **avant tous les tests**. Elle est idéale pour effectuer des actions globales, comme la connexion à une application ou la configuration du coverage.

#### 🧩 Autre possibilité : Hooks (Before / After)

Si vous utilisez **playwright-bdd**, vous pouvez recourir aux **hooks** (`Before`, `After`) pour exécuter du code avant ou après chaque scénario. Cette approche fonctionne bien, mais elle implique que l’authentification se répète à chaque scénario, ce qui peut nuire aux performances.

#### 💡 Bonne pratique : Fixtures

Playwright propose une alternative plus puissante et flexible que les hooks : **les fixtures**. Elles permettent de gérer et partager un état (comme une session d’utilisateur) entre les tests, avec un meilleur contrôle sur leur cycle de vie.

Dans notre cas, nous allons opter pour la simplicité en utilisant la méthode `Project Dependency`.

<details>
    <summary>🧠 <b>Petit rappel des concepts</b></summary>

* **Hooks (Before, After)** : Fonctions exécutées avant ou après chaque scénario. Pratiques pour des actions répétitives.
* **BeforeAll / AfterAll** : Exécutées une seule fois avant ou après tous les tests d’un fichier ou projet.
* **Global setup** : S’exécute une seule fois avant toute la suite de tests.
* **Project dependency** : Structure des dépendances entre projets de test.
* **Fixtures** : Permettent de gérer des ressources partagées dans Playwright de manière modulaire.
</details>

---

## ✅ Option : Project Dependency (la plus simple)

Cette méthode consiste à utiliser un fichier de setup (`auth.setup.ts`) pour effectuer l’authentification une fois, puis à injecter le contexte de session (cookies, localStorage, etc.) dans les tests via la configuration du projet. L'url est https://demo.duendesoftware.com/diagnostics

### Étapes

1. **Créer le fichier `auth.setup.ts` dans `tests/utils/`** :
   * Script de connexion automatique à Duende
   * Sauvegarde de l'état via `storageState`

2. **Modifier `playwright.config.ts`** :
   * Créez un projet d’authentification avec `testMatch`
   * Ajoutez une dépendance dans les autres projets
   * Chargez l’état via `storageState`

💾 **À quoi sert `storageState` ?**

`storageState` permet de charger un état de session précédemment sauvegardé. Il contient :
* Cookies,
* Local storage,
* Sessions, etc.

<details>
<summary>Réponse</summary>

📄 `tests/utils/auth.setup.ts`

```ts
import { expect, test as setup } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://demo.duendesoftware.com/diagnostics');

  await expect(page).toHaveTitle(/Duende IdentityServer/);
  await page.locator('#Input_Username').fill("bob");
  await page.locator('#Input_Password').fill("bob");
  await page.getByRole('button', { name: 'Login' }).click();

  await page.context().storageState({ path: authFile });
});
```

💡 Cette méthode peut aussi fonctionner avec [`APIRequestContext`](https://playwright.dev/docs/api/class-apirequestcontext) pour l’authentification via API, sans navigateur.

📄 `playwright.config.ts`

```ts
export default defineConfig({
  testDir,
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

#### 🧠 Pourquoi utiliser `dependencies: ['auth']` ?

Cela garantit que le projet `auth` est exécuté **avant** que `chromium` ne démarre ses tests. Vous bénéficiez ainsi d’un **contexte utilisateur déjà connecté** pour tous les tests suivants.
</details>

📷 Exemple d’image :  
![image](https://github.com/user-attachments/assets/c2597549-1ad7-4127-a1a3-469f756862df)

### [➡️ Passer à l'exercice suivant](https://github.com/synnksou/dojo-playwright-bdd/blob/dojo/step-three/README.md)

---

## ⚙️ Exemple avec `BeforeEach`

Vous pouvez définir des hooks pour gérer l'authentification et la navigation vers la page de connexion.

```ts
import { test as base, createBdd } from "playwright-bdd";

type Fixtures = {};

export const test = base.extend<Fixtures>({});

test.beforeEach(async ({ page }) => {
  await page.goto("https://demo.duendesoftware.com/Account/Login?ReturnUrl=%2Fdiagnostics");
});

export const { Given, When, Then } = createBdd(test);
```

## ⚙️ Exemple avec Fixture partagée

Vous pouvez aussi définir une fixture partagée que vous appelez dans votre test.

Dans votre fichier utils : 

```ts
type Fixtures = {
  auth: { loginFunction: () => Promise<void> };
};

export const test = base.extend<Fixtures>({
  auth: async ({ page }, use) => {
    const loginFunction = async () => {
      await page.goto('https://demo.duendesoftware.com/diagnostics');
      await expect(page).toHaveTitle(/Duende IdentityServer/);

      await page.locator('#Input_Username').fill('bob');
      await page.locator('#Input_Password').fill('bob');

      await page.getByRole('button', { name: 'Login' }).click();
      // retour à la page d'accueil après la connexion
      await page.goto('https://demo.duendesoftware.com/');
    };

    await use({ loginFunction });
  },
});
```

Et voici un exemple d'utilisation dans votre step : 

```ts
import { Given, When, Then } from '@utils/fixtures';

Given('Je suis authentifié sur le Duende', async ({ page, auth }) => {
  await auth.loginFunction();
});
```
