import type { Page } from '@playwright/test';
import { InventoryPage } from './inventory/index.js';
import { LoginPage } from './login/index.js';
import { ProductDetailPage } from './product-detail/index.js';
import { CartPage } from './cart/index.js';

export class App {
  readonly loginPage = new LoginPage(this.page);
  readonly inventoryPage = new InventoryPage(this.page);
  readonly cardPage = new CartPage(this.page);
  readonly ProductDetailPage = new ProductDetailPage(this.page);

  constructor(protected page: Page) {}
}
