import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent } from '@src/shared-components/Base.component.js';
import { ButtonElement } from '@src/elements/Button.element.js';
import { step } from '@src/utils/decorators.js';

export class ErrorMessageComponent extends BaseComponent {
  private readonly closeButton = new ButtonElement(this.root.locator('[data-test="error-button"]'));
  private readonly errorText = this.root.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page, page.locator('.error-message-container'));
  }

  @step('Verify error message text:', ([expected]) => expected)
  async shouldHaveText(expected: string): Promise<void> {
    await expect(this.errorText).toHaveText(expected);
  }

  @step('Verify error message is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  @step('Verify error message is not visible')
  async shouldNotBeVisible(): Promise<void> {
    await expect(this.errorText).not.toBeVisible();
  }

  @step('Close error message')
  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
