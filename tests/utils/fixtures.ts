import { test as base, createBdd } from 'playwright-bdd';

type Fixtures = {};

export const test = base.extend<Fixtures>({});

export const { Given, When, Then } = createBdd(test);
