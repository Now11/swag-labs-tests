import { expect, type Locator } from '@playwright/test';
import { step } from '@src/utils/decorators.js';

export abstract class BaseElement {
  constructor(public readonly root: Locator) {}

  @step('Perform click on element')
  async click(): Promise<void> {
    await this.root.click();
  }

  @step('Get element text')
  async getText(): Promise<string> {
    return this.root.innerText();
  }

  @step('Button to be visible')
  async shouldBeVisible() {
    await expect(this.root).toBeVisible();
  }
}
