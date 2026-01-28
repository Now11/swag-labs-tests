import { expect } from '@playwright/test';
import { BasePage } from '../Base.page.js';
import { ButtonElement } from '@src/elements/Button.element.js';
import { step } from '@src/utils/decorators.js';

export class ProductDetailPage extends BasePage {
  protected readonly url = '/inventory-item.html';

  private readonly productContainer = this.page.locator('[data-test="inventory-item"]');

  private readonly backButton = new ButtonElement(this.page.locator('[data-test="back-to-products"]'));
  private readonly removeButton = new ButtonElement(this.productContainer.locator('[data-test="remove"]'));
  private readonly addToCartButton = new ButtonElement(this.productContainer.locator('[data-test="add-to-cart"]'));
  private readonly productImage = this.productContainer.locator('img.inventory_details_img');
  private readonly productName = this.productContainer.locator('[data-test="inventory-item-name"]');
  private readonly productDescription = this.productContainer.locator('[data-test="inventory-item-desc"]');
  private readonly productPrice = this.productContainer.locator('[data-test="inventory-item-price"]');

  @step('Verify product detail page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory-item\.html/);
    await expect(this.productContainer).toBeVisible();
  }

  @step('Go back to products')
  async goBackToProducts(): Promise<void> {
    await this.backButton.click();
  }

  @step('Add product to cart')
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  @step('Remove product from cart')
  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  @step('Get product name')
  async getName(): Promise<string> {
    return this.productName.innerText();
  }

  @step('Get product description')
  async getDescription(): Promise<string> {
    return this.productDescription.innerText();
  }

  @step('Get product price')
  async getPrice(): Promise<string> {
    return this.productPrice.innerText();
  }

  @step('Verify product name:', ([expected]) => expected)
  async shouldHaveName(expected: string): Promise<void> {
    await expect(this.productName).toHaveText(expected);
  }

  @step('Verify product price:', ([expected]) => expected)
  async shouldHavePrice(expected: string): Promise<void> {
    await expect(this.productPrice).toHaveText(expected);
  }

  @step('Verify product image is visible')
  async shouldHaveImage(): Promise<void> {
    await expect(this.productImage).toBeVisible();
  }

  @step('Verify add to cart button is visible')
  async shouldHaveAddToCartButton(): Promise<void> {
    await expect(this.addToCartButton.root).toBeVisible();
  }

  @step('Verify remove button is visible')
  async shouldHaveRemoveButton(): Promise<void> {
    await expect(this.removeButton.root).toBeVisible();
  }
}
