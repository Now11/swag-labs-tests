import { test as base } from '@playwright/test';
import { App } from '@src/pages/index.js';
import { STORAGE_STATE_PATH } from '@src/utils/constants/index.js';
import { TAppFixture } from './types.js';

export const authorizedFixture = base.extend<TAppFixture>({
  storageState: STORAGE_STATE_PATH,
  app: async ({ page }, use) => {
    const app = new App(page);
    await use(app);
  },
});

export { expect } from '@playwright/test';
