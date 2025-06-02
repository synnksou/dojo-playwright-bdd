### 🎯Ajout du test d'authentification persistante

#### 🔐 Mise en place de l’authentification persistante avec Playwright

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


📄 `tests/utils/auth.setup.ts`

```typescript
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

###### 🧠 **Pourquoi utiliser dependencies: `['auth']` ?**

L’option dependencies permet de spécifier que le projet principal (chromium, ici) dépend du projet auth. Cela garantit que le projet auth est exécuté et terminé avant que chromium ne démarre ses tests.

Ce mécanisme est crucial lorsque vous avez besoin :

* d’effectuer une authentification une seule fois,

* de sauvegarder un état de session (storageState),

* et de le réutiliser dans tous les autres projets de test.

✅ En déclarant cette dépendance, vous assurez que tous vos tests bénéficient d’un contexte utilisateur déjà authentifié, sans avoir à refaire l’authentification à chaque test.


</details>

Exemple d'image
![image](https://github.com/user-attachments/assets/c2597549-1ad7-4127-a1a3-469f756862df)

[Passage au prochaine exercice !](https://github.com/synnksou/dojo-playwright-bdd/tree/dojo/step-three)