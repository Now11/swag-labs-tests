import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent } from '@src/shared-components/Base.component.js';
import { ProductComponent } from './Product.component.js';
import { step } from '@src/utils/decorators.js';

export class ProductsListComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator('[data-test="inventory-list"]'));
  }

  getProductByName(name: string): ProductComponent {
    const productLocator = this.root.locator('[data-test="inventory-item"]', {
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: name }),
    });
    return new ProductComponent(this.page, productLocator);
  }

  @step('Get all products')
  async getAllProducts(): Promise<ProductComponent[]> {
    const items = this.root.locator('[data-test="inventory-item"]');
    const count = await items.count();
    const products: ProductComponent[] = [];

    for (let i = 0; i < count; i++) {
      products.push(new ProductComponent(this.page, items.nth(i)));
    }

    return products;
  }

  @step('Get products count')
  async getCount(): Promise<number> {
    return this.root.locator('[data-test="inventory-item"]').count();
  }

  @step('Verify products list is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  @step('Verify products count:', ([expected]) => expected)
  async shouldHaveCount(expected: number): Promise<void> {
    await expect(this.root.locator('[data-test="inventory-item"]')).toHaveCount(expected);
  }
}
