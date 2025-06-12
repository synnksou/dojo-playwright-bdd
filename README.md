# 🔁 Test d'affichage de la Page Duende & CodeGen

## 📝 Introduction

Ce premier exercice présente un tutoriel pratique pour générer des tests automatisés à l’aide de l’outil **Playwright Codegen**, en commençant par des interactions simples sur une page web (ici, celle de Duende IdentityServer). Il inclut également des exemples concrets de scénarios BDD, leur implémentation, et les commandes pour exécuter les tests dans un environnement Playwright.

## 🎯 Génération de code avec Playwright (codegen)

Playwright propose un outil interactif appelé Codegen qui permet d’enregistrer automatiquement des actions dans le navigateur et de générer le code de test correspondant. C’est un excellent point de départ pour écrire rapidement des tests.

### ✅ Commande de base

Pour lancer le Codegen, utilisez la commande suivante :

```bash
npx playwright codegen <url>
```

Exemple :

```bash
npx playwright codegen http://localhost:3000
```

Cette commande ouvre une interface graphique Playwright avec :
* Un navigateur contrôlé par Playwright,
* Un panneau latéral qui enregistre automatiquement les actions utilisateur (clics, saisies, navigations...),
* Le code généré en temps réel (JavaScript, TypeScript, Python, C# ou Java).

### 🧠 Ce que Codegen sélectionne

Le Codegen utilise intelligemment des sélecteurs pour cibler les éléments dans la page. Il choisit :
* Par texte visible (`getByText`, `locator('text=…')`),
* Par rôle ARIA et attributs d’accessibilité (`getByRole`) : recommandé pour la robustesse et l’accessibilité,
* Par attributs `([data-testid="..."] ou [id="..."])`,
* Par hiérarchie DOM (si aucun des autres ne convient).

### 🔄 Réutilisation du code

Une fois le code généré :
* Copiez les actions dans un fichier `.spec.ts` ou `.stepdefinitions.tsx`,
* Adaptez les sélecteurs ou assertions si nécessaire,
* Exécutez les tests.

✍️ **Astuce Codelab** : Pour gagner du temps dans les exercices suivants, démarrez vos tests avec Codegen, puis collez le code généré dans vos définitions d’étapes BDD. Cela vous évite d’écrire chaque interaction manuellement.

## 🧪 Test d'affichage de la Page Duende

Vérifiez que lorsqu’un utilisateur accède à la page https://demo.duendesoftware.com/, un texte spécifique comme "Welcome to the IdentityServer demo" est bien affiché.

### 📝 Étapes

1. Créez le fichier `home.feature` dans `tests/features/home/` :
    * Écrivez un scénario Gherkin décrivant l'accès à la page d’accueil de Duende et la vérification d’un texte affiché.

2. Créez `home.stepdefinitions.ts` dans `tests/features/home/` :
    * Implémentez les étapes suivantes :
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
        Then Je devrais voir le titre "Welcome to Duende"
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

### 🧪 Exécution des tests

#### ✅ Générer les fichiers de test à partir des fichiers `.feature`

Cette commande permet de générer automatiquement les squelettes de fichiers `.stepdefinitions.ts` et `.feature` pour Playwright :

```bash
npx bddgen
```

#### 🚀 Exécuter les tests Playwright

Lancer les tests en mode terminal :

```bash
npx playwright test
```

Pour exécuter les tests localement avec l'interface utilisateur, utilisez la commande suivante :

```bash
npx playwright test --ui
```

#### 👨‍💻 Commandes disponibles dans le Codelab

Deux commandes sont prêtes à l’utilisation :

```bash
npm run watch:bdd
```

• Lance la génération des fichiers `.stepdefinitions.ts` automatiquement à chaque modification des `.feature` ou en tapant `rs`

```bash
npm run watch:pw
```

### [➡️ Passer à l'exercice suivant](https://github.com/synnksou/dojo-playwright-bdd/blob/dojo/step-two/README.md)
