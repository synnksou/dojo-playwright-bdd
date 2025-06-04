# ♿️ Test d'Accessibilité des images (attributs alt)

Énoncé : Écrivez un test BDD avec Playwright pour vérifier que toutes les balises <img> présentes sur la page https://fake-university.com/news-and-events.html possèdent un attribut alt renseigné.

##### Étapes :

1. Créer `accessibility.feature` dans tests/accessibility/ :
   * Gherkin décrivant chargement de la page et vérification des alt.

2. Créer `accessibility.stepdefinitions.ts` :
    * Utiliser `page.evaluate()` pour vérifier que chaque image a un alt non vide.


## Un peu d'aide 
### **🔍 À quoi sert page.evaluate() dans ce test ?**
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
			.map(img => img.src);
	});

	expect(imagesWithoutAlt.length).toBe(0);
});
```

**📦 Alternative : axe-playwright**

Vous pouvez aussi utiliser la librairie axe-playwright pour faire des audits d’accessibilité automatisés. Elle détecte les problèmes d’accessibilité courants, y compris l'absence d'attributs alt, et fournit des rapports détaillés.

[➡️ Passer à l'exercice suivant](https://github.com/synnksou/dojo-playwright-bdd/tree/dojo/step-six/README.md)
