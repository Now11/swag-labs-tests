import { type Page } from '@playwright/test';
import { step } from '@src/utils/index.js';

export abstract class BasePage {
  protected abstract readonly url: string;

  constructor(protected readonly page: Page) {}

  @step(`Open page`)
  async open(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  @step('Wait for page to be loaded')
  async shouldBeOpened() {
    throw new Error('Implement this method');
  }
}
