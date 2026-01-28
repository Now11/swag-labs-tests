import { expect } from '@playwright/test';
import { BasePage } from '../Base.page.js';
import { ButtonElement } from '@src/elements/Button.element.js';
import { step } from '@src/utils/decorators.js';

export class CheckoutStepTwoPage extends BasePage {
  protected readonly url = '/checkout-step-two.html';

  private readonly title = this.page.locator('[data-test="title"]');
  private readonly cartList = this.page.locator('[data-test="cart-list"]');
  private readonly subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
  private readonly taxLabel = this.page.locator('[data-test="tax-label"]');
  private readonly totalLabel = this.page.locator('[data-test="total-label"]');
  private readonly cancelButton = new ButtonElement(this.page.locator('[data-test="cancel"]'));
  private readonly finishButton = new ButtonElement(this.page.locator('[data-test="finish"]'));

  @step('Verify checkout step two page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  @step('Get subtotal')
  async getSubtotal(): Promise<string> {
    return this.subtotalLabel.innerText();
  }

  @step('Get tax')
  async getTax(): Promise<string> {
    return this.taxLabel.innerText();
  }

  @step('Get total')
  async getTotal(): Promise<string> {
    return this.totalLabel.innerText();
  }

  @step('Get items count')
  async getItemsCount(): Promise<number> {
    return this.cartList.locator('[data-test="inventory-item"]').count();
  }

  @step('Click finish')
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  @step('Click cancel')
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  @step('Verify items count:', ([expected]) => expected)
  async shouldHaveItemsCount(expected: number): Promise<void> {
    await expect(this.cartList.locator('[data-test="inventory-item"]')).toHaveCount(expected);
  }
}
