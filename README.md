
# 📊 Couverture de Code avec Monocart

Pour générer des rapports de couverture de code, nous allons utiliser le package [`monocart-coverage-reports`](https://www.npmjs.com/package/monocart-coverage-reports). Voici un guide complet pour l'intégrer dans votre projet.

## 📦 Installation

Commencez par installer le package via NPM :

```bash
npm install -D monocart-coverage-reports
```

## ⚙️ Configuration dans `e2e/support/fixtures.ts`

Ajoutez la logique de collecte de couverture dans le fichier `e2e/support/fixtures.ts` :

```ts
import MCR from 'monocart-coverage-reports';
import { test as base } from 'playwright-bdd';
import coverageOptions from './mcr.config';

export const test = base.extend<{
  autoTestFixture: string;
}>({
  autoTestFixture: [
    async ({ page }, use) => {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });

      await use('autoTestFixture');

      const [jsCoverage] = await Promise.all([page.coverage.stopJSCoverage()]);
      const mcr = MCR(coverageOptions);
      await mcr.add([...jsCoverage]);
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
});

export const { Given, When, Then } = createBdd(test); // On exporte tous les steps avec les fixtures
```

### 📌 Détails des fonctions Playwright utilisées

- **`page.coverage.startJSCoverage`** : démarre la collecte de la couverture de code JavaScript. L'option `resetOnNavigation: false` permet de conserver les données même en cas de navigation.
- **`page.coverage.stopJSCoverage`** : arrête la collecte et retourne les données de couverture, utilisables pour le reporting.

## 🌐 Fichiers globaux pour la couverture

Pour initialiser et finaliser la couverture, ajoutez deux fichiers globaux :

### `global-setup.ts`

Utilisé pour nettoyer les caches de couverture avant les tests :

```ts
import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';

async function globalSetup() {
  const mcr = MCR(coverageOptions);
  mcr.cleanCache();
}

export default globalSetup;
```

### `global-teardown.ts`

Utilisé pour générer les rapports une fois les tests terminés :

```ts
import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';

async function globalTeardown() {
  const mcr = MCR(coverageOptions);
  await mcr.generate();
}

export default globalTeardown;
```

## 🛠️ Fichier de configuration `mcr.config.ts`

Ce fichier définit les options de filtrage, les formats de sortie et le nom du rapport :

```ts
import { CoverageReportOptions } from 'monocart-coverage-reports';

const coverageOptions: CoverageReportOptions = {
  enable: true,
  name: 'playwright-bdd-coverage',
  reports: [
    'text',
    'text-summary',
    ['html', { subdirdir: 'coverage' }],
    ['lcov', { file: 'lcov.info' }],
  ],
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

## 🧪 Résultats

### Exemple CLI

![Coverage CLI](https://github.com/user-attachments/assets/c26ae8b2-7994-4d69-94d0-68fe58c04916)

### Exemple HTML

![Coverage HTML](https://github.com/user-attachments/assets/8ec498c0-b846-44b0-b66c-46647193bdb0)

