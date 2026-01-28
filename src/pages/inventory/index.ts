import { expect } from '@playwright/test';
import { BasePage } from '../Base.page.js';
import { ProductsListComponent } from './components/ProductsList.component.js';
import { HeaderComponent } from '@src/shared-components/Header.component.js';
import { step } from '@src/utils/decorators.js';

type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

type SortTextOption = 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)';

function getSortOptionByText(option: SortTextOption): SortOption {
  switch (option) {
    case 'Name (A to Z)':
      return 'az';
    case 'Name (Z to A)':
      return 'za';
    case 'Price (high to low)':
      return 'lohi';
    case 'Price (low to high)':
      return 'hilo';

    default:
      throw new Error('Invalid sorting option');
  }
}

export class InventoryPage extends BasePage {
  protected readonly url = '/inventory.html';

  private readonly title = this.page.locator('[data-test="title"]');
  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  readonly productsList = new ProductsListComponent(this.page);
  readonly header = new HeaderComponent(this.page);

  @step('Verify inventory page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  @step('Sort products by:', ([option]) => option)
  async sortBy(option: SortTextOption): Promise<void> {
    const optValue = getSortOptionByText(option);
    await this.sortDropdown.selectOption(optValue);
  }

  @step('Get all product names')
  async getProductNames(): Promise<string[]> {
    const products = await this.productsList.getAllProducts();
    const names: string[] = [];
    for (const product of products) {
      names.push(await product.getTitle());
    }
    return names;
  }

  @step('Get all product prices')
  async getProductPrices(): Promise<number[]> {
    const products = await this.productsList.getAllProducts();
    const prices: number[] = [];
    for (const product of products) {
      const priceText = await product.getPrice();
      prices.push(parseFloat(priceText.replace('$', '')));
    }
    return prices;
  }
}
