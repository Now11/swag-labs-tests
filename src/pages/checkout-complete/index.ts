import { expect } from '@playwright/test';
import { BasePage } from '../Base.page.js';
import { ButtonElement } from '@src/elements/Button.element.js';
import { step } from '@src/utils/decorators.js';
import { successMessages } from '@test-data/success-messages.js';

export class CheckoutCompletePage extends BasePage {
  protected readonly url = '/checkout-complete.html';

  private readonly title = this.page.locator('[data-test="title"]');
  private readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  private readonly completeText = this.page.locator('[data-test="complete-text"]');
  private readonly backHomeButton = new ButtonElement(this.page.locator('[data-test="back-to-products"]'));

  @step('Verify checkout complete page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.title).toHaveText(successMessages.CHECKOUT_COMPLETED);
  }

  @step('Verify success message')
  async shouldHaveSuccessMessage(): Promise<void> {
    await expect(this.completeHeader).toHaveText(successMessages.ORDER_COMPLETED);
    await expect(this.completeText).toHaveText(successMessages.COMPLETE_TEXT);
  }

  @step('Go back to products')
  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
