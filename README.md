# Étape 7 — Découvrir les agents IA avec Playwright

Pour terminer le dojo, faites créer un test sur [Duende Demo](https://demo.duendesoftware.com/) par votre agent IA.

**La mission : depuis l'accueil Duende, trouver « RSA key for JWT/JAR samples », copier la clé affichée et l'enregistrer dans un fichier local.** 

Ce parcours n'est pas couvert par les tests du profil. Le test réutilise le projet `auth` sans modifier la session ni les données du site.

## Qui fait quoi ?

Ces outils se complètent, mais ne sont pas tous des agents :

| Élément | Son rôle | Son utilité dans cet exercice |
| --- | --- | --- |
| **Agent IA**, par exemple Copilot en mode agent | Interprète la demande, lit le dépôt, écrit du code et utilise les outils autorisés. | Explore la déconnexion et écrit les steps du nouveau parcours. |
| **Playwright CLI** | Outil de pilotage du navigateur en ligne de commande. L’agent l’utilise via un terminal pour ouvrir une page, lire un snapshot et interagir. | Observer la vraie interface avant de choisir un locator. |
| **Playwright MCP** | Serveur qui expose des outils navigateur à un assistant compatible avec le Model Context Protocol (MCP). | Permettre à l’agent de naviguer, lire la structure accessible et cliquer via des appels d’outils. |
| **Playwright-BDD** | Bibliothèque qui relie les scénarios Gherkin aux steps et génère des tests Playwright avec `bddgen`. Ce n’est pas un agent IA. | Produire un test lisible avec `Given`, `When`, `Then`, comme dans le reste du dojo. |
| **Skill Playwright-BDD** | Instructions spécialisées chargées par un agent compatible pour l’aider à utiliser Playwright-BDD. | Guider la rédaction du scénario et des steps selon les conventions de la bibliothèque. |
| **Playwright Test** | Runner qui exécute les tests, les fixtures et les assertions. | Vérifier réellement le résultat avec la dépendance `auth`. |

Le skill BDD peut compléter l’un ou l’autre, mais ne fournit pas à lui seul un navigateur.

`playwright-cli` et `npx playwright test` n’ont pas le même rôle : l’un pilote un navigateur, l’autre exécute des tests. 

Installer le paquet `playwright-bdd` ne configure pas automatiquement son skill dans l’agent.

```
npx skills add vitalets/playwright-bdd
```

https://vitalets.github.io/playwright-bdd/#/getting-started/agent-skill

Le scénario obtenu doit rester aussi court que ceci (adapte les mots au
parcours observé, pas l'objectif métier) :

```gherkin
Feature: Copier la clé RSA des exemples Duende

  Scenario: Enregistrer la clé RSA des exemples JWT/JAR
    Given Je suis authentifié sur le Duende
    When Je consulte la clé RSA des exemples JWT/JAR
    And Je l'enregistre dans un fichier local
    Then Le fichier contient la clé RSA affichée
```

## Pour aller plus loin, après le dojo

  - [Playwright CLI](https://github.com/microsoft/playwright-cli)
  - [Playwright MCP](https://github.com/microsoft/playwright-mcp)
  - [Playwright-BDD](https://vitalets.github.io/playwright-bdd/#/)
  - [Skill Playwright-BDD](https://vitalets.github.io/playwright-bdd/#/getting-started/agent-skill)
  - [Dépendances de projets Playwright](https://playwright.dev/docs/test-projects#dependencies)