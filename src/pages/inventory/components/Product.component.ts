import { expect } from '@playwright/test';
import { ButtonElement } from '@src/elements/Button.element.js';
import { BaseComponent } from '@src/shared-components/Base.component.js';
import { step } from '@src/utils/decorators.js';
import { ProductDetailPage } from '../../product-detail/index.js';

export class ProductComponent extends BaseComponent {
  private readonly image = this.root.locator('img.inventory_item_img');
  private readonly title = this.root.locator('[data-test="inventory-item-name"]');
  private readonly price = this.root.locator('[data-test="inventory-item-price"]');
  private readonly addToCartButton = new ButtonElement(this.root.locator('[data-test*="add-to-cart"]'));
  private readonly removeButton = new ButtonElement(this.root.locator('[data-test*="remove"]'));

  @step('Add product to cart')
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  @step('Remove product from cart')
  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  @step('Open product details')
  async openDetails(): Promise<ProductDetailPage> {
    await this.title.click();
    const productDetailPage = new ProductDetailPage(this.page);
    await productDetailPage.shouldBeOpened();
    return productDetailPage;
  }

  @step('Get product title')
  async getTitle(): Promise<string> {
    return this.title.innerText();
  }

  @step('Get product price')
  async getPrice(): Promise<string> {
    return this.price.innerText();
  }

  @step('Verify product title:', ([expected]) => expected)
  async shouldHaveTitle(expected: string): Promise<void> {
    await expect(this.title).toHaveText(expected);
  }

  @step('Verify product price:', ([expected]) => expected)
  async shouldHavePrice(expected: string): Promise<void> {
    await expect(this.price).toHaveText(expected);
  }

  @step('Verify add to cart button is visible')
  async shouldHaveAddToCartButton(): Promise<void> {
    await this.addToCartButton.shouldBeVisible();
  }

  @step('Verify remove button is visible')
  async shouldHaveRemoveButton(): Promise<void> {
    await this.removeButton.shouldBeVisible();
  }

  @step('Verify product image is displayed')
  async imageShouldBeDisplayed(): Promise<void> {
    await expect(this.image).toBeVisible();
  }
}
