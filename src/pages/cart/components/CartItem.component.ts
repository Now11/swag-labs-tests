import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { ButtonElement } from '@src/elements/Button.element.js';
import { step } from '@src/utils/decorators.js';

export class CartItemComponent {
  private readonly quantity = this.root.locator('[data-test="item-quantity"]');
  private readonly name = this.root.locator('[data-test="inventory-item-name"]');
  private readonly description = this.root.locator('[data-test="inventory-item-desc"]');
  private readonly price = this.root.locator('[data-test="inventory-item-price"]');
  private readonly removeButton = new ButtonElement(this.root.locator('button[data-test^="remove"]'));

  constructor(public readonly root: Locator) {}

  @step('Remove item from cart')
  async remove(): Promise<void> {
    await this.removeButton.click();
  }

  @step('Get item name')
  async getName(): Promise<string> {
    return this.name.innerText();
  }

  @step('Get item price')
  async getPrice(): Promise<string> {
    return this.price.innerText();
  }

  @step('Get item quantity')
  async getQuantity(): Promise<string> {
    return this.quantity.innerText();
  }

  @step('Get item description')
  async getDescription(): Promise<string> {
    return this.description.innerText();
  }

  @step('Verify item name:', ([expected]) => expected)
  async shouldHaveName(expected: string): Promise<void> {
    await expect(this.name).toHaveText(expected);
  }

  @step('Verify item price:', ([expected]) => expected)
  async shouldHavePrice(expected: string): Promise<void> {
    await expect(this.price).toHaveText(expected);
  }

  @step('Verify item quantity:', ([expected]) => expected)
  async shouldHaveQuantity(expected: string): Promise<void> {
    await expect(this.quantity).toHaveText(expected);
  }

  @step('Verify item description:', ([expected]) => expected)
  async shouldHaveDescription(expected: string): Promise<void> {
    await expect(this.description).toHaveText(expected);
  }
}
