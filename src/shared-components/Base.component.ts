import type { Page, Locator } from '@playwright/test';
import { step } from '@src/utils/decorators.js';

export abstract class BaseComponent {
  constructor(
    public readonly page: Page,
    public readonly root: Locator,
  ) {}

  @step('Is Visible')
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
