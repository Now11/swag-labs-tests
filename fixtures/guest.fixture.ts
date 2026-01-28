import { test as base } from '@playwright/test';
import { App } from '@src/pages/index.js';
import { TAppFixture } from './types.js';

export const guestFixture = base.extend<TAppFixture>({
  app: async ({ page }, use) => {
    const app = new App(page);
    await use(app);
  },
});

export { expect } from '@playwright/test';
